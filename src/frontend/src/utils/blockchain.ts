import { ethers } from 'ethers';
import { ServiceRecordNFT } from '../contracts/ServiceRecordNFT';
import { PointsSystem } from '../contracts/PointsSystem';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask!');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  return await signer.getAddress();
};

export const getServiceRecordContract = (provider: ethers.providers.Provider | ethers.Signer) => {
  const contractAddress = process.env.REACT_APP_SERVICE_RECORD_NFT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Service Record NFT contract address not configured');
  }
  return new ethers.Contract(contractAddress, ServiceRecordNFT.abi, provider);
};

export const getPointsSystemContract = (provider: ethers.providers.Provider | ethers.Signer) => {
  const contractAddress = process.env.REACT_APP_POINTS_SYSTEM_ADDRESS;
  if (!contractAddress) {
    throw new Error('Points System contract address not configured');
  }
  return new ethers.Contract(contractAddress, PointsSystem.abi, provider);
};

export const switchNetwork = async (chainId: string) => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexValue(parseInt(chainId)) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error('Please add the network to your MetaMask');
    }
    throw error;
  }
}; 