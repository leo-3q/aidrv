const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PointsSystem", function () {
  let PointsSystem;
  let pointsSystem;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    PointsSystem = await ethers.getContractFactory("PointsSystem");
    pointsSystem = await PointsSystem.deploy();
    await pointsSystem.deployed();
  });

  describe("Service Type Multipliers", function () {
    it("Should have default multipliers set", async function () {
      expect(await pointsSystem.getServiceTypeMultiplier("Oil Change")).to.equal(2);
      expect(await pointsSystem.getServiceTypeMultiplier("Tire Rotation")).to.equal(1);
      expect(await pointsSystem.getServiceTypeMultiplier("Brake Service")).to.equal(3);
      expect(await pointsSystem.getServiceTypeMultiplier("Engine Repair")).to.equal(5);
    });

    it("Should allow owner to set new multipliers", async function () {
      await expect(pointsSystem.setServiceTypeMultiplier("New Service", 4))
        .to.emit(pointsSystem, "ServiceTypeMultiplierSet")
        .withArgs("New Service", 4);

      expect(await pointsSystem.getServiceTypeMultiplier("New Service")).to.equal(4);
    });

    it("Should not allow non-owner to set multipliers", async function () {
      await expect(
        pointsSystem.connect(addr1).setServiceTypeMultiplier("New Service", 4)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow zero multiplier", async function () {
      await expect(
        pointsSystem.setServiceTypeMultiplier("New Service", 0)
      ).to.be.revertedWith("Multiplier must be greater than 0");
    });
  });

  describe("Points Awarding", function () {
    it("Should award points based on service type multiplier", async function () {
      const serviceRecordId = 1;
      const serviceType = "Oil Change"; // Multiplier = 2

      await expect(pointsSystem.awardPoints(addr1.address, serviceRecordId, serviceType))
        .to.emit(pointsSystem, "PointsAwarded")
        .withArgs(addr1.address, 20, serviceRecordId, serviceType); // 10 * 2 = 20

      expect(await pointsSystem.balanceOf(addr1.address)).to.equal(20);
      expect(await pointsSystem.getServiceRecordPoints(serviceRecordId)).to.equal(20);
      expect(await pointsSystem.getTotalPointsEarned(addr1.address)).to.equal(20);
    });

    it("Should not award points for invalid service type", async function () {
      await expect(
        pointsSystem.awardPoints(addr1.address, 1, "Invalid Service")
      ).to.be.revertedWith("Invalid service type");
    });

    it("Should not allow non-owner to award points", async function () {
      await expect(
        pointsSystem.connect(addr1).awardPoints(addr2.address, 1, "Oil Change")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Points Transfer", function () {
    it("Should transfer points correctly", async function () {
      // Award points to addr1
      await pointsSystem.awardPoints(addr1.address, 1, "Oil Change");

      // Transfer points from addr1 to addr2
      await expect(pointsSystem.connect(addr1).transferPoints(addr2.address, 10))
        .to.emit(pointsSystem, "PointsTransferred")
        .withArgs(addr1.address, addr2.address, 10);

      expect(await pointsSystem.balanceOf(addr1.address)).to.equal(10);
      expect(await pointsSystem.balanceOf(addr2.address)).to.equal(10);
      expect(await pointsSystem.getTotalPointsEarned(addr1.address)).to.equal(20);
    });

    it("Should not allow transfer of insufficient points", async function () {
      await pointsSystem.awardPoints(addr1.address, 1, "Oil Change");

      await expect(
        pointsSystem.connect(addr1).transferPoints(addr2.address, 30)
      ).to.be.revertedWith("Insufficient points balance");
    });
  });
}); 