// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PointsSystem
 * @dev This contract manages the DriveChain points system
 */
contract PointsSystem is ERC20, Ownable {
    // Mapping to store points earned from service records
    mapping(uint256 => uint256) private _serviceRecordPoints;
    
    // Mapping to store service type point multipliers
    mapping(string => uint256) private _serviceTypeMultipliers;
    
    // Mapping to store user's total points earned
    mapping(address => uint256) private _totalPointsEarned;
    
    // Base points for any service
    uint256 public constant BASE_POINTS = 10;
    
    // Event emitted when points are awarded
    event PointsAwarded(
        address indexed user,
        uint256 amount,
        uint256 serviceRecordId,
        string serviceType
    );
    
    // Event emitted when points are transferred
    event PointsTransferred(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    
    // Event emitted when a service type multiplier is set
    event ServiceTypeMultiplierSet(
        string serviceType,
        uint256 multiplier
    );

    constructor() ERC20("DriveChain Points", "DCP") {
        // Set default multipliers for common service types
        _serviceTypeMultipliers["Oil Change"] = 2;
        _serviceTypeMultipliers["Tire Rotation"] = 1;
        _serviceTypeMultipliers["Brake Service"] = 3;
        _serviceTypeMultipliers["Engine Repair"] = 5;
    }

    /**
     * @dev Sets the point multiplier for a service type
     * @param serviceType Type of service
     * @param multiplier Point multiplier (1 = 1x, 2 = 2x, etc.)
     */
    function setServiceTypeMultiplier(
        string memory serviceType,
        uint256 multiplier
    ) public onlyOwner {
        require(multiplier > 0, "Multiplier must be greater than 0");
        _serviceTypeMultipliers[serviceType] = multiplier;
        emit ServiceTypeMultiplierSet(serviceType, multiplier);
    }

    /**
     * @dev Gets the point multiplier for a service type
     * @param serviceType Type of service
     * @return The point multiplier
     */
    function getServiceTypeMultiplier(
        string memory serviceType
    ) public view returns (uint256) {
        return _serviceTypeMultipliers[serviceType];
    }

    /**
     * @dev Awards points to a user for a service record
     * @param user Address of the user to award points to
     * @param serviceRecordId ID of the service record
     * @param serviceType Type of service performed
     */
    function awardPoints(
        address user,
        uint256 serviceRecordId,
        string memory serviceType
    ) public onlyOwner {
        require(user != address(0), "Invalid user address");
        
        uint256 multiplier = _serviceTypeMultipliers[serviceType];
        require(multiplier > 0, "Invalid service type");
        
        uint256 points = BASE_POINTS * multiplier;
        
        _mint(user, points);
        _serviceRecordPoints[serviceRecordId] = points;
        _totalPointsEarned[user] += points;
        
        emit PointsAwarded(user, points, serviceRecordId, serviceType);
    }

    /**
     * @dev Transfers points from one user to another
     * @param to Address to transfer points to
     * @param amount Amount of points to transfer
     */
    function transferPoints(
        address to,
        uint256 amount
    ) public {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient points balance");

        _transfer(msg.sender, to, amount);
        emit PointsTransferred(msg.sender, to, amount);
    }

    /**
     * @dev Returns the points awarded for a specific service record
     * @param serviceRecordId ID of the service record
     * @return Amount of points awarded
     */
    function getServiceRecordPoints(
        uint256 serviceRecordId
    ) public view returns (uint256) {
        return _serviceRecordPoints[serviceRecordId];
    }

    /**
     * @dev Returns the total points earned by a user
     * @param user Address of the user
     * @return Total points earned
     */
    function getTotalPointsEarned(
        address user
    ) public view returns (uint256) {
        return _totalPointsEarned[user];
    }

    /**
     * @dev Overrides the default decimals function
     * @return Number of decimal places
     */
    function decimals() public pure override returns (uint8) {
        return 0; // Points are whole numbers
    }
} 