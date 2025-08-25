from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, ApplicationCallTxn, OnComplete, StateSchema
import base64
import json
import time
from pathlib import Path

# Connect to Algorand testnet
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # No token needed for public testnet
client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Load TEAL source code
def load_teal(filename):
    base_path = Path(__file__).parent.parent / "algorand"
    path = base_path / filename
    with path.open('r') as f:
        return f.read()


# Wait for transaction confirmation
def wait_for_confirmation(client, txid):
    last_round = client.status().get('last-round')
    while True:
        tx_info = client.pending_transaction_info(txid)
        if tx_info.get('confirmed-round', 0) > 0:
            return tx_info
        last_round += 1
        client.status_after_block(last_round)

# Create account from mnemonic
def get_account_from_mnemonic(mnemonic_str):
    private_key = mnemonic.to_private_key(mnemonic_str)
    address = account.address_from_private_key(private_key)
    return address, private_key

# Deploy the smart contract
def deploy_contract(creator_address, creator_private_key):
    approval_source = load_teal("consent_approval.teal")
    clear_source = load_teal("consent_clear.teal")

    # Compile programs
    compiled_approval = client.compile(approval_source)['result']
    compiled_clear = client.compile(clear_source)['result']

    params = client.suggested_params()

    txn = ApplicationCreateTxn(
        sender=creator_address,
        sp=params,
        on_complete=OnComplete.NoOpOC,
        approval_program=base64.b64decode(compiled_approval),
        clear_program=base64.b64decode(compiled_clear),
        global_schema=StateSchema(num_uints=8, num_byte_slices=8),
        local_schema=StateSchema(num_uints=0, num_byte_slices=0)
    )

    signed_txn = txn.sign(creator_private_key)
    tx_id = client.send_transaction(signed_txn)
    print(f"Deploy transaction sent with txID: {tx_id}")

    confirmed_txn = wait_for_confirmation(client, tx_id)
    app_id = confirmed_txn['application-index']
    print(f"Smart contract deployed with app ID: {app_id}")
    return app_id

# Test contract functions
def test_contract(app_id, creator_address, creator_private_key, recipient_address, recipient_private_key):
    params = client.suggested_params()

    # 1. request_consent
    request_txn = ApplicationCallTxn(
        sender=creator_address,
        sp=params,
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[
            b"request_consent",
            b"document_hash_123",
            b"Aadhaar Card",
            b"request_1",
            recipient_address.encode()
        ]
    )
    signed_request = request_txn.sign(creator_private_key)
    request_txid = client.send_transaction(signed_request)
    print(f"request_consent tx sent: {request_txid}")
    wait_for_confirmation(client, request_txid)

    # 2. grant_consent
    expiry_timestamp = str(int(time.time()) + 30 * 24 * 60 * 60).encode()  # 30 days from now
    permissions = json.dumps({"view": True, "download": False}).encode()

    grant_txn = ApplicationCallTxn(
        sender=recipient_address,
        sp=client.suggested_params(),
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[b"grant_consent", expiry_timestamp, permissions]
    )
    signed_grant = grant_txn.sign(recipient_private_key)
    grant_txid = client.send_transaction(signed_grant)
    print(f"grant_consent tx sent: {grant_txid}")
    wait_for_confirmation(client, grant_txid)

    # 3. view_document
    view_txn = ApplicationCallTxn(
        sender=creator_address,
        sp=client.suggested_params(),
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[b"view_document"]
    )
    signed_view = view_txn.sign(creator_private_key)
    view_txid = client.send_transaction(signed_view)
    print(f"view_document tx sent: {view_txid}")
    wait_for_confirmation(client, view_txid)

    # 4. revoke_consent
    revoke_txn = ApplicationCallTxn(
        sender=recipient_address,
        sp=client.suggested_params(),
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[b"revoke_consent"]
    )
    signed_revoke = revoke_txn.sign(recipient_private_key)
    revoke_txid = client.send_transaction(signed_revoke)
    print(f"revoke_consent tx sent: {revoke_txid}")
    wait_for_confirmation(client, revoke_txid)

def main():
    creator_mnemonic = "clean lend scan box absorb cancel legal wood frost dynamic frequent uphold cluster lake sibling luggage flat unfair runway pole physical receive foam above hat"
    recipient_mnemonic = "alter green actual grab spoon okay faith repeat smile report easily retire plate enact vacuum spin bachelor rate where service settle nice north above soul"

    creator_address, creator_private_key = get_account_from_mnemonic(creator_mnemonic)
    recipient_address, recipient_private_key = get_account_from_mnemonic(recipient_mnemonic)

    print(f"Creator address: {creator_address}")
    print(f"Recipient address: {recipient_address}")

    app_id = deploy_contract(creator_address, creator_private_key)
    test_contract(app_id, creator_address, creator_private_key, recipient_address, recipient_private_key)

if __name__ == "__main__":
    main()
