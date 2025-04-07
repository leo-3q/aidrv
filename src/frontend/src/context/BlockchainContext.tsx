import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectWallet, switchNetwork } from '../utils/blockchain';

interface BlockchainContextType {
  address: string;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const BlockchainContext = createContext<BlockchainContextType>({
  address: '',
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkConnection();

    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setAddress('');
        setIsConnected(false);
      }
    });

    return () => {
      window.ethereum?.removeAllListeners('accountsChanged');
    };
  }, []);

  const connect = async () => {
    try {
      await switchNetwork(process.env.REACT_APP_CHAIN_ID || '1337');
      const address = await connectWallet();
      setAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress('');
    setIsConnected(false);
  };

  return (
    <BlockchainContext.Provider value={{ address, isConnected, connect, disconnect }}>
      {children}
    </BlockchainContext.Provider>
  );
}; 