// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ServiceRecordNFT
 * @dev This contract handles the minting and management of automotive service record NFTs
 */
contract ServiceRecordNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to store service record metadata
    struct ServiceRecord {
        string serviceType;
        string serviceDate;
        string serviceProvider;
        string vehicleInfo;
        string serviceDetails;
        address verifiedBy;
        bool isVerified;
        uint256 verificationTimestamp;
    }

    // Mapping from token ID to service record
    mapping(uint256 => ServiceRecord) private _serviceRecords;
    
    // Mapping to store authorized verifiers
    mapping(address => bool) private _authorizedVerifiers;

    // Event emitted when a new service record NFT is minted
    event ServiceRecordMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string serviceType,
        string serviceDate
    );

    // Event emitted when a service record is verified
    event ServiceRecordVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        uint256 timestamp
    );

    // Event emitted when a verifier is authorized/unauthorized
    event VerifierStatusChanged(
        address indexed verifier,
        bool isAuthorized
    );

    constructor() ERC721("DriveChain Service Record", "DCSR") {
        // Contract deployer is automatically an authorized verifier
        _authorizedVerifiers[msg.sender] = true;
    }

    /**
     * @dev Authorizes or unauthorizes an address to verify service records
     * @param verifier Address to authorize/unauthorize
     * @param isAuthorized Whether to authorize or unauthorize
     */
    function setVerifierStatus(address verifier, bool isAuthorized) public onlyOwner {
        _authorizedVerifiers[verifier] = isAuthorized;
        emit VerifierStatusChanged(verifier, isAuthorized);
    }

    /**
     * @dev Checks if an address is authorized to verify service records
     * @param verifier Address to check
     * @return bool Whether the address is authorized
     */
    function isAuthorizedVerifier(address verifier) public view returns (bool) {
        return _authorizedVerifiers[verifier];
    }

    /**
     * @dev Mints a new service record NFT
     * @param serviceType Type of service performed
     * @param serviceDate Date of service
     * @param serviceProvider Name of the service provider
     * @param vehicleInfo Vehicle information
     * @param serviceDetails Detailed description of the service
     * @return The ID of the newly minted NFT
     */
    function mintServiceRecord(
        string memory serviceType,
        string memory serviceDate,
        string memory serviceProvider,
        string memory vehicleInfo,
        string memory serviceDetails
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        _serviceRecords[newTokenId] = ServiceRecord(
            serviceType,
            serviceDate,
            serviceProvider,
            vehicleInfo,
            serviceDetails,
            address(0),
            false,
            0
        );

        emit ServiceRecordMinted(newTokenId, msg.sender, serviceType, serviceDate);
        return newTokenId;
    }

    /**
     * @dev Verifies a service record
     * @param tokenId ID of the token to verify
     */
    function verifyServiceRecord(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(_authorizedVerifiers[msg.sender], "Not authorized to verify");
        require(!_serviceRecords[tokenId].isVerified, "Record already verified");

        _serviceRecords[tokenId].verifiedBy = msg.sender;
        _serviceRecords[tokenId].isVerified = true;
        _serviceRecords[tokenId].verificationTimestamp = block.timestamp;

        emit ServiceRecordVerified(tokenId, msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the service record details for a given token ID
     * @param tokenId The ID of the token to query
     * @return ServiceRecord struct containing all service details
     */
    function getServiceRecord(uint256 tokenId) public view returns (ServiceRecord memory) {
        require(_exists(tokenId), "Token does not exist");
        return _serviceRecords[tokenId];
    }

    /**
     * @dev Overrides the default ERC721 tokenURI function
     * @param tokenId The ID of the token to query
     * @return A string containing the token's metadata URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        ServiceRecord memory record = _serviceRecords[tokenId];
        
        // Construct metadata JSON
        string memory metadata = string(abi.encodePacked(
            '{"name": "DriveChain Service Record #', Strings.toString(tokenId), '",',
            '"description": "Automotive service record NFT",',
            '"attributes": [',
            '{"trait_type": "Service Type", "value": "', record.serviceType, '"},',
            '{"trait_type": "Service Date", "value": "', record.serviceDate, '"},',
            '{"trait_type": "Service Provider", "value": "', record.serviceProvider, '"},',
            '{"trait_type": "Vehicle Info", "value": "', record.vehicleInfo, '"},',
            '{"trait_type": "Verified", "value": "', record.isVerified ? "true" : "false", '"}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(metadata))
        ));
    }
} 