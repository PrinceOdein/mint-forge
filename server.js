const express = require("express");
const ethers = require("ethers");
require("dotenv").config();

const app = express();
app.use(express.json());

// Define the provider with custom URL for Polygon Amoy testnet
const providerUrl = `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
const network = { chainId: 80002, name: 'amoy' }
const provider = new ethers.JsonRpcProvider(providerUrl, network);

// Initialize the wallet with the provider
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Example endpoint to deploy a token (adjust as needed)
app.post("/deploy-token", async (req, res) => {
  const { name, symbol, supply } = req.body;
  const Token = await ethers.getContractFactory("tknForge");
  const tokenWithSigner = Token.connect(wallet);
  const token = await tokenWithSigner.deploy(name, symbol, supply);
  await token.deployed();
  res.json({ address: token.address, tx: token.deployTransaction.hash });
});

app.listen(3000, () => console.log("Server on port 3000"));