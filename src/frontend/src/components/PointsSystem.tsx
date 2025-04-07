import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PointsSystemProps {
  address: string;
}

const PointsSystem: React.FC<PointsSystemProps> = ({ address }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [multipliers, setMultipliers] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchBalance();
    fetchMultipliers();
  }, [address]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`/api/points/balance/${address}`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };

  const fetchMultipliers = async () => {
    try {
      const response = await axios.get('/api/points/multipliers');
      setMultipliers(response.data);
    } catch (error) {
      console.error('Error fetching multipliers:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/points/transfer', {
        recipient,
        amount: parseInt(transferAmount)
      });
      fetchBalance();
      setTransferAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Error transferring points:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Points Balance</h2>
        <p className="mt-2 text-3xl font-semibold text-primary-600">{balance} Points</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Transfer Points</h2>
        <form onSubmit={handleTransfer} className="mt-4 space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="1"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Transfer Points
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Service Type Multipliers</h2>
        <div className="mt-4 space-y-2">
          {Object.entries(multipliers).map(([serviceType, multiplier]) => (
            <div key={serviceType} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{serviceType}</span>
              <span className="text-sm font-medium text-primary-600">x{multiplier}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsSystem; 