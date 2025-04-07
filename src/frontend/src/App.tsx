import React, { useEffect, useState } from 'react';
import ServiceRecordForm from './components/ServiceRecordForm';
import ServiceRecordList from './components/ServiceRecordList';
import PointsSystem from './components/PointsSystem';
import TransactionHistory from './components/TransactionHistory';
import Notification from './components/Notification';
import { BlockchainProvider, useBlockchain } from './context/BlockchainContext';
import { StateManager } from './services/StateManager';
import { StorageManager } from './services/StorageManager';
import { ErrorHandler } from './services/ErrorHandler';
import { EventManager } from './services/EventManager';
import { NotificationManager } from './services/NotificationManager';
import { NotificationType } from './components/Notification';

const AppContent: React.FC = () => {
  const { address, isConnected, connect } = useBlockchain();
  const stateManager = StateManager.getInstance();
  const storageManager = StorageManager.getInstance();
  const errorHandler = ErrorHandler.getInstance();
  const eventManager = EventManager.getInstance();
  const notificationManager = NotificationManager.getInstance();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: NotificationType;
    message: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    const handleNotification = (notification: {
      id: string;
      type: NotificationType;
      message: string;
      duration: number;
    }) => {
      setNotifications(prev => [...prev, notification]);
    };

    notificationManager.addListener(handleNotification);

    return () => {
      notificationManager.removeListener(handleNotification);
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await stateManager.initialize();
        if (isConnected) {
          await eventManager.startListening();
          notificationManager.showSuccess('Wallet connected successfully');
        }
      } catch (error) {
        errorHandler.handleError(error);
        notificationManager.showError('Failed to initialize application');
      }
    };

    initializeApp();

    return () => {
      eventManager.stopListening();
    };
  }, [isConnected]);

  const handleNotificationClose = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => handleNotificationClose(notification.id)}
        />
      ))}

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">DriveChain</h1>
            </div>
            <div className="flex items-center">
              {isConnected ? (
                <span className="text-sm text-gray-600">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              ) : (
                <button
                  onClick={connect}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isConnected ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Create Service Record</h2>
                  <ServiceRecordForm onSubmit={(data) => console.log('Service record submitted:', data)} />
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Service Records</h2>
                  <ServiceRecordList />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Points System</h2>
                  <PointsSystem address={address} />
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
                  <TransactionHistory />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to DriveChain</h2>
            <p className="mt-2 text-gray-600">Please connect your wallet to get started</p>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BlockchainProvider>
      <AppContent />
    </BlockchainProvider>
  );
};

export default App; 