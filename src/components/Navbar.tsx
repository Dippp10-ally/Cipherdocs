import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { truncateAddress } from '../utils/truncateAddress';
import WalletConnectButton from './WalletConnectButton';

const Navbar: React.FC = () => {
  const { isConnectedToPeraWallet, address, connectWallet, disconnectWallet } = useWallet();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">ConsentApp</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          {isConnectedToPeraWallet && (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/consents" className="hover:text-gray-300">Consents</Link>
              <Link to="/settings" className="hover:text-gray-300">Settings</Link>
            </>
          )}
        </div>
        <div>
          {isConnectedToPeraWallet ? (
            <div className="flex items-center space-x-4">
              <span>{truncateAddress(address || '')}</span>
              <button onClick={disconnectWallet} className="bg-red-500 px-3 py-1 rounded">Disconnect</button>
            </div>
          ) : (
            <WalletConnectButton onConnect={connectWallet} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 