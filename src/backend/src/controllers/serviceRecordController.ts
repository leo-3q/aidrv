import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { config } from '../config/config';

export class ServiceRecordController {
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private serviceRecordNFT: ethers.Contract;
    private pointsSystem: ethers.Contract;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
        this.wallet = new ethers.Wallet(config.wallet.privateKey, this.provider);
        this.serviceRecordNFT = new ethers.Contract(
            config.contracts.serviceRecordNFT.address,
            config.contracts.serviceRecordNFT.abi,
            this.wallet
        );
        this.pointsSystem = new ethers.Contract(
            config.contracts.pointsSystem.address,
            config.contracts.pointsSystem.abi,
            this.wallet
        );
    }

    async mintServiceRecord(req: Request, res: Response) {
        try {
            const { serviceType, serviceDate, serviceProvider, vehicleInfo, serviceDetails } = req.body;
            
            const tx = await this.serviceRecordNFT.mintServiceRecord(
                serviceType,
                serviceDate,
                serviceProvider,
                vehicleInfo,
                serviceDetails
            );
            
            const receipt = await tx.wait();
            const tokenId = receipt.events[0].args.tokenId.toNumber();
            
            // Award points for the service
            await this.pointsSystem.awardPoints(
                req.body.userAddress,
                tokenId,
                serviceType
            );
            
            res.json({
                success: true,
                tokenId,
                transactionHash: receipt.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getServiceRecord(req: Request, res: Response) {
        try {
            const { tokenId } = req.params;
            const record = await this.serviceRecordNFT.getServiceRecord(tokenId);
            
            res.json({
                success: true,
                record: {
                    serviceType: record.serviceType,
                    serviceDate: record.serviceDate,
                    serviceProvider: record.serviceProvider,
                    vehicleInfo: record.vehicleInfo,
                    serviceDetails: record.serviceDetails,
                    isVerified: record.isVerified,
                    verifiedBy: record.verifiedBy,
                    verificationTimestamp: record.verificationTimestamp
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async verifyServiceRecord(req: Request, res: Response) {
        try {
            const { tokenId } = req.params;
            const tx = await this.serviceRecordNFT.verifyServiceRecord(tokenId);
            const receipt = await tx.wait();
            
            res.json({
                success: true,
                transactionHash: receipt.transactionHash
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
} 