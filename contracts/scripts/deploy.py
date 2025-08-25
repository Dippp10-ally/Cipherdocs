#!/usr/bin/env python3

import json
import time
from pathlib import Path

from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import StateSchema, ApplicationCreateTxn
import base64
import sys

# Setup paths relative to this script file
base_path = Path(__file__).parent.parent / "algorand"
approval_path = base_path / "consent_approval.teal"
clear_path = base_path / "consent_clear.teal"
output_path = Path(__file__).parent / "app_id.json"

# Configs
MNEMONIC = "clean lend scan box absorb cancel legal wood frost dynamic frequent uphold cluster lake sibling luggage flat unfair runway pole physical receive foam above hat"
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # No token needed for Algonode

def load_teal(path: Path) -> str:
    if not path.exists():
        print(f"ERROR: TEAL file not found: {path}")
        sys.exit(1)
    with path.open("r") as f:
        return f.read()

def wait_for_confirmation(client, txid, timeout=20):
    last_round = client.status().get('last-round')
    start_time = time.time()
    while True:
        try:
            txinfo = client.pending_transaction_info(txid)
        except Exception as e:
            print(f"Error checking transaction status: {e}")
            time.sleep(1)
            continue

        if txinfo.get('confirmed-round', 0) > 0:
            return txinfo

        if time.time() - start_time > timeout:
            raise TimeoutError("Timeout waiting for transaction confirmation")

        last_round += 1
        client.status_after_block(last_round)

def main():
    print("Loading TEAL programs...")
    approval_program = load_teal(approval_path)
    clear_program = load_teal(clear_path)

    print("Connecting to algod client...")
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

    try:
        print("Compiling approval program...")
        compiled_approval = algod_client.compile(approval_program)["result"]
        print("Compiling clear state program...")
        compiled_clear = algod_client.compile(clear_program)["result"]
    except Exception as e:
        print(f"Failed to compile TEAL programs: {e}")
        sys.exit(1)

    try:
        private_key = mnemonic.to_private_key(MNEMONIC)
    except Exception as e:
        print(f"Invalid mnemonic: {e}")
        sys.exit(1)
    address = account.address_from_private_key(private_key)

    print(f"Using deployer address: {address}")

    global_schema = StateSchema(num_uints=2, num_byte_slices=6)
    local_schema = StateSchema(num_uints=0, num_byte_slices=0)

    print("Fetching suggested transaction params...")
    params = algod_client.suggested_params()

    txn = ApplicationCreateTxn(
        sender=address,
        sp=params,
        on_complete=0,  # NoOp
        approval_program=base64.b64decode(compiled_approval),
        clear_program=base64.b64decode(compiled_clear),
        global_schema=global_schema,
        local_schema=local_schema,
    )

    signed_txn = txn.sign(private_key)

    try:
        txid = algod_client.send_transaction(signed_txn)
    except Exception as e:
        print(f"Failed to send transaction: {e}")
        sys.exit(1)

    print(f"Transaction sent with txID: {txid}")
    print("Waiting for confirmation...")

    try:
        confirmed_txn = wait_for_confirmation(algod_client, txid)
    except TimeoutError as e:
        print(e)
        sys.exit(1)

    app_id = confirmed_txn.get("application-index")
    if app_id is None:
        print("Application ID not found in confirmation.")
        sys.exit(1)

    print(f"Deployed ConsentManager with App ID: {app_id}")

    try:
        with output_path.open("w") as f:
            json.dump({"app_id": app_id}, f, indent=4)
        print(f"App ID saved to {output_path}")
    except Exception as e:
        print(f"Failed to write app ID to file: {e}")

if __name__ == "__main__":
    main()
