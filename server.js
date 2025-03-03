const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(express.json());

const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_API_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.post("/deploy-token", async (req, res) => {
  const { name, symbol, supply } = req.body;
  const Token = await ethers.getContractFactory("MyToken").connect(wallet);
  const token = await Token.deploy(name, symbol, supply);
  await token.deployed();
  res.json({ address: token.address, tx: token.deployTransaction.hash });
});

app.listen(3000, () => console.log("Server on port 3000"));