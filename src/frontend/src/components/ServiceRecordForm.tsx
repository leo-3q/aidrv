import React, { useState } from 'react';
import axios from 'axios';

interface ServiceRecordFormProps {
  onSubmit: (data: any) => void;
}

const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    serviceDate: '',
    serviceProvider: '',
    vehicleInfo: '',
    serviceDetails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/service-records/mint', formData);
      onSubmit(response.data);
    } catch (error) {
      console.error('Error submitting service record:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <input
          type="text"
          name="serviceType"
          id="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700">
          Service Date
        </label>
        <input
          type="date"
          name="serviceDate"
          id="serviceDate"
          value={formData.serviceDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700">
          Service Provider
        </label>
        <input
          type="text"
          name="serviceProvider"
          id="serviceProvider"
          value={formData.serviceProvider}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="vehicleInfo" className="block text-sm font-medium text-gray-700">
          Vehicle Information
        </label>
        <input
          type="text"
          name="vehicleInfo"
          id="vehicleInfo"
          value={formData.vehicleInfo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="serviceDetails" className="block text-sm font-medium text-gray-700">
          Service Details
        </label>
        <textarea
          name="serviceDetails"
          id="serviceDetails"
          value={formData.serviceDetails}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Submit Service Record
        </button>
      </div>
    </form>
  );
};

export default ServiceRecordForm; 