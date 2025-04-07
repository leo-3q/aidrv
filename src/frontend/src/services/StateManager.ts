import { ethers } from 'ethers';
import { getServiceRecordContract, getPointsSystemContract } from '../utils/blockchain';

export class StateManager {
  private static instance: StateManager;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private serviceRecordContract: ethers.Contract | null = null;
  private pointsSystemContract: ethers.Contract | null = null;

  private constructor() {}

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public async initialize() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.serviceRecordContract = getServiceRecordContract(this.signer);
      this.pointsSystemContract = getPointsSystemContract(this.signer);
    }
  }

  public async getServiceRecords(address: string) {
    if (!this.serviceRecordContract) throw new Error('Contract not initialized');
    // Implementation depends on your contract's events/methods
    return [];
  }

  public async getPointsBalance(address: string) {
    if (!this.pointsSystemContract) throw new Error('Contract not initialized');
    return await this.pointsSystemContract.balanceOf(address);
  }

  public async transferPoints(to: string, amount: number) {
    if (!this.pointsSystemContract) throw new Error('Contract not initialized');
    const tx = await this.pointsSystemContract.transfer(to, amount);
    return await tx.wait();
  }

  public async mintServiceRecord(
    serviceType: string,
    serviceDate: string,
    serviceProvider: string,
    vehicleInfo: string,
    serviceDetails: string
  ) {
    if (!this.serviceRecordContract) throw new Error('Contract not initialized');
    const tx = await this.serviceRecordContract.mint(
      serviceType,
      serviceDate,
      serviceProvider,
      vehicleInfo,
      serviceDetails
    );
    return await tx.wait();
  }

  public async verifyServiceRecord(tokenId: string) {
    if (!this.serviceRecordContract) throw new Error('Contract not initialized');
    return await this.serviceRecordContract.verify(tokenId);
  }

  public async getServiceRecord(tokenId: string) {
    if (!this.serviceRecordContract) throw new Error('Contract not initialized');
    return await this.serviceRecordContract.getServiceRecord(tokenId);
  }

  public async getMultipliers() {
    if (!this.pointsSystemContract) throw new Error('Contract not initialized');
    return await this.pointsSystemContract.getAllMultipliers();
  }

  public getProvider() {
    return this.provider;
  }

  public getSigner() {
    return this.signer;
  }

  public getServiceRecordContract() {
    return this.serviceRecordContract;
  }

  public getPointsSystemContract() {
    return this.pointsSystemContract;
  }
} 