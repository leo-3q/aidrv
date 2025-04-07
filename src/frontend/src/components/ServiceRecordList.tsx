import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface ServiceRecord {
  tokenId: string;
  serviceType: string;
  serviceDate: string;
  serviceProvider: string;
  vehicleInfo: string;
  serviceDetails: string;
  isVerified: boolean;
}

const ServiceRecordList: React.FC = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch the list of token IDs first
      // For MVP, we'll assume we have a way to get the user's records
      const response = await axios.get('/api/service-records/list');
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load service records');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyRecord = async (tokenId: string) => {
    try {
      await axios.get(API_ENDPOINTS.SERVICE_RECORDS.VERIFY(tokenId));
      // Update the record in the list
      setRecords(records.map(record =>
        record.tokenId === tokenId ? { ...record, isVerified: true } : record
      ));
    } catch (err) {
      console.error('Error verifying record:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No service records found</p>
      ) : (
        records.map((record) => (
          <div
            key={record.tokenId}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {record.serviceType}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(record.serviceDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                {record.isVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => verifyRecord(record.tokenId)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Provider</p>
                <p className="mt-1 text-sm text-gray-900">{record.serviceProvider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vehicle</p>
                <p className="mt-1 text-sm text-gray-900">{record.vehicleInfo}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Details</p>
              <p className="mt-1 text-sm text-gray-900">{record.serviceDetails}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ServiceRecordList; 