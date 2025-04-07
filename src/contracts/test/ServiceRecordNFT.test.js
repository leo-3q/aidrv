const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ServiceRecordNFT", function () {
  let ServiceRecordNFT;
  let serviceRecordNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    ServiceRecordNFT = await ethers.getContractFactory("ServiceRecordNFT");
    serviceRecordNFT = await ServiceRecordNFT.deploy();
    await serviceRecordNFT.deployed();
  });

  describe("Minting", function () {
    it("Should mint a new service record NFT", async function () {
      const serviceType = "Oil Change";
      const serviceDate = "2023-01-01";
      const serviceProvider = "DriveChain Garage";
      const vehicleInfo = "Toyota Camry 2020";
      const serviceDetails = "Regular maintenance";

      await expect(
        serviceRecordNFT.mintServiceRecord(
          serviceType,
          serviceDate,
          serviceProvider,
          vehicleInfo,
          serviceDetails
        )
      )
        .to.emit(serviceRecordNFT, "ServiceRecordMinted")
        .withArgs(1, owner.address, serviceType, serviceDate);

      const record = await serviceRecordNFT.getServiceRecord(1);
      expect(record.serviceType).to.equal(serviceType);
      expect(record.serviceDate).to.equal(serviceDate);
      expect(record.serviceProvider).to.equal(serviceProvider);
      expect(record.vehicleInfo).to.equal(vehicleInfo);
      expect(record.serviceDetails).to.equal(serviceDetails);
      expect(record.isVerified).to.equal(false);
    });
  });

  describe("Verification", function () {
    it("Should verify a service record", async function () {
      // Mint a new NFT
      await serviceRecordNFT.mintServiceRecord(
        "Test Service",
        "2023-01-01",
        "Test Provider",
        "Test Vehicle",
        "Test Details"
      );

      // Verify the record
      await expect(serviceRecordNFT.verifyServiceRecord(1))
        .to.emit(serviceRecordNFT, "ServiceRecordVerified")
        .withArgs(1, owner.address, anyValue);

      const record = await serviceRecordNFT.getServiceRecord(1);
      expect(record.isVerified).to.equal(true);
      expect(record.verifiedBy).to.equal(owner.address);
    });

    it("Should not allow unauthorized verification", async function () {
      // Mint a new NFT
      await serviceRecordNFT.mintServiceRecord(
        "Test Service",
        "2023-01-01",
        "Test Provider",
        "Test Vehicle",
        "Test Details"
      );

      // Try to verify with unauthorized address
      await expect(
        serviceRecordNFT.connect(addr1).verifyServiceRecord(1)
      ).to.be.revertedWith("Not authorized to verify");
    });

    it("Should not allow double verification", async function () {
      // Mint a new NFT
      await serviceRecordNFT.mintServiceRecord(
        "Test Service",
        "2023-01-01",
        "Test Provider",
        "Test Vehicle",
        "Test Details"
      );

      // Verify the record
      await serviceRecordNFT.verifyServiceRecord(1);

      // Try to verify again
      await expect(
        serviceRecordNFT.verifyServiceRecord(1)
      ).to.be.revertedWith("Record already verified");
    });
  });

  describe("Verifier Management", function () {
    it("Should allow owner to authorize verifiers", async function () {
      await expect(serviceRecordNFT.setVerifierStatus(addr1.address, true))
        .to.emit(serviceRecordNFT, "VerifierStatusChanged")
        .withArgs(addr1.address, true);

      expect(await serviceRecordNFT.isAuthorizedVerifier(addr1.address)).to.equal(true);
    });

    it("Should allow owner to unauthorize verifiers", async function () {
      // First authorize
      await serviceRecordNFT.setVerifierStatus(addr1.address, true);

      // Then unauthorize
      await expect(serviceRecordNFT.setVerifierStatus(addr1.address, false))
        .to.emit(serviceRecordNFT, "VerifierStatusChanged")
        .withArgs(addr1.address, false);

      expect(await serviceRecordNFT.isAuthorizedVerifier(addr1.address)).to.equal(false);
    });

    it("Should not allow non-owner to manage verifiers", async function () {
      await expect(
        serviceRecordNFT.connect(addr1).setVerifierStatus(addr2.address, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
}); 