const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy("TestToken", "TST", 1000);
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main().catch((error) => console.error(error));