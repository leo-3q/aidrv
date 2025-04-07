import { ethers } from 'ethers';
import { StateManager } from './StateManager';
import { ErrorHandler } from './ErrorHandler';

export class EventManager {
  private static instance: EventManager;
  private stateManager: StateManager;
  private errorHandler: ErrorHandler;
  private eventListeners: Map<string, ethers.providers.Listener>;

  private constructor() {
    this.stateManager = StateManager.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.eventListeners = new Map();
  }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  public async startListening() {
    try {
      const serviceRecordContract = this.stateManager.getServiceRecordContract();
      const pointsSystemContract = this.stateManager.getPointsSystemContract();

      // 监听服务记录创建事件
      const recordCreatedListener = serviceRecordContract.on(
        'ServiceRecordCreated',
        (tokenId, serviceType, serviceDate, serviceProvider, vehicleInfo, serviceDetails) => {
          console.log('New service record created:', {
            tokenId: tokenId.toString(),
            serviceType,
            serviceDate: new Date(serviceDate * 1000).toISOString(),
            serviceProvider,
            vehicleInfo,
            serviceDetails
          });
        }
      );
      this.eventListeners.set('ServiceRecordCreated', recordCreatedListener);

      // 监听服务记录验证事件
      const recordVerifiedListener = serviceRecordContract.on(
        'ServiceRecordVerified',
        (tokenId, verifier) => {
          console.log('Service record verified:', {
            tokenId: tokenId.toString(),
            verifier
          });
        }
      );
      this.eventListeners.set('ServiceRecordVerified', recordVerifiedListener);

      // 监听积分转账事件
      const pointsTransferListener = pointsSystemContract.on(
        'PointsTransferred',
        (from, to, amount) => {
          console.log('Points transferred:', {
            from,
            to,
            amount: amount.toString()
          });
        }
      );
      this.eventListeners.set('PointsTransferred', pointsTransferListener);

      // 监听乘数更新事件
      const multiplierUpdatedListener = pointsSystemContract.on(
        'MultiplierUpdated',
        (serviceType, multiplier) => {
          console.log('Multiplier updated:', {
            serviceType,
            multiplier: multiplier.toString()
          });
        }
      );
      this.eventListeners.set('MultiplierUpdated', multiplierUpdatedListener);

    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  public stopListening() {
    this.eventListeners.forEach((listener, eventName) => {
      try {
        listener.removeAllListeners();
        console.log(`Stopped listening to ${eventName} events`);
      } catch (error) {
        this.errorHandler.handleError(error);
      }
    });
    this.eventListeners.clear();
  }

  public async getPastEvents(eventName: string, fromBlock: number, toBlock: number) {
    try {
      const serviceRecordContract = this.stateManager.getServiceRecordContract();
      const pointsSystemContract = this.stateManager.getPointsSystemContract();

      let events;
      if (eventName === 'ServiceRecordCreated' || eventName === 'ServiceRecordVerified') {
        events = await serviceRecordContract.queryFilter(eventName, fromBlock, toBlock);
      } else if (eventName === 'PointsTransferred' || eventName === 'MultiplierUpdated') {
        events = await pointsSystemContract.queryFilter(eventName, fromBlock, toBlock);
      }

      return events || [];
    } catch (error) {
      this.errorHandler.handleError(error);
      return [];
    }
  }
} 