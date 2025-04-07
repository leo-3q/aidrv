export const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'serviceType',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceDate',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceProvider',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'vehicleInfo',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceDetails',
        type: 'string',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getServiceRecord',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'serviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceDate',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceProvider',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'vehicleInfo',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceDetails',
            type: 'string',
          },
        ],
        internalType: 'struct ServiceRecordNFT.ServiceRecord',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]; 