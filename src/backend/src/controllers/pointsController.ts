import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { config } from '../config/config';

export class PointsController {
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private pointsSystem: ethers.Contract;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.network.rpcUrl);
        this.wallet = new ethers.Wallet(config.wallet.privateKey, this.provider);
        this.pointsSystem = new ethers.Contract(
            config.contracts.pointsSystem.address,
            config.contracts.pointsSystem.abi,
            this.wallet
        );
    }

    async getPointsBalance(req: Request, res: Response) {
        try {
            const { address } = req.params;
            const balance = await this.pointsSystem.balanceOf(address);
            const totalEarned = await this.pointsSystem.getTotalPointsEarned(address);
            
            res.json({
                success: true,
                balance: balance.toString(),
                totalEarned: totalEarned.toString()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async transferPoints(req: Request, res: Response) {
        try {
            const { to, amount } = req.body;
            const tx = await this.pointsSystem.transferPoints(to, amount);
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

    async getServiceTypeMultiplier(req: Request, res: Response) {
        try {
            const { serviceType } = req.params;
            const multiplier = await this.pointsSystem.getServiceTypeMultiplier(serviceType);
            
            res.json({
                success: true,
                multiplier: multiplier.toString()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async setServiceTypeMultiplier(req: Request, res: Response) {
        try {
            const { serviceType, multiplier } = req.body;
            const tx = await this.pointsSystem.setServiceTypeMultiplier(serviceType, multiplier);
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