const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  SERVICE_RECORDS: {
    MINT: `${API_BASE_URL}/api/service-records/mint`,
    GET: (tokenId: string) => `${API_BASE_URL}/api/service-records/${tokenId}`,
    VERIFY: (tokenId: string) => `${API_BASE_URL}/api/service-records/${tokenId}/verify`,
  },
  POINTS: {
    BALANCE: (address: string) => `${API_BASE_URL}/api/points/balance/${address}`,
    TRANSFER: `${API_BASE_URL}/api/points/transfer`,
    MULTIPLIERS: `${API_BASE_URL}/api/points/multipliers`,
  },
}; 