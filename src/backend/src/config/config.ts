import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    network: {
        rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
        chainId: process.env.CHAIN_ID || '1337',
    },
    contracts: {
        serviceRecordNFT: {
            address: process.env.SERVICE_RECORD_NFT_ADDRESS || '',
            abi: require('../../contracts/artifacts/contracts/ServiceRecordNFT.sol/ServiceRecordNFT.json').abi
        },
        pointsSystem: {
            address: process.env.POINTS_SYSTEM_ADDRESS || '',
            abi: require('../../contracts/artifacts/contracts/PointsSystem.sol/PointsSystem.json').abi
        }
    },
    wallet: {
        privateKey: process.env.WALLET_PRIVATE_KEY || ''
    }
}; 