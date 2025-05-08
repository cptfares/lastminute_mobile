import { expect } from "chai";
import { ethers } from "hardhat";
import { LSTToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("LSTToken", function () {
  let token: LSTToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("LSTToken");
    token = await TokenFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(await owner.getAddress());
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(await owner.getAddress());
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(await addr1.getAddress(), ethers.parseEther("50"));
      expect(await token.balanceOf(await addr1.getAddress())).to.equal(ethers.parseEther("50"));

      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(await addr2.getAddress(), ethers.parseEther("50"));
      expect(await token.balanceOf(await addr2.getAddress())).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(await owner.getAddress());
      await expect(
        token.connect(addr1).transfer(await owner.getAddress(), 1)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
      expect(await token.balanceOf(await owner.getAddress())).to.equal(initialOwnerBalance);
    });
  });
});