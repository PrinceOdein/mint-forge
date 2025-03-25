const express = require('express');
const ethers = require('ethers');
require('dotenv').config();

const app = express();
app.use(express.json());

// Set up the provider (Polygon Amoy testnet as an example)
const providerUrl = `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const network = { chainId: 80002, name: 'amoy' };
const provider = new ethers.JsonRpcProvider(providerUrl, network);

// Initialize the wallet
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load the contract artifact
const tknForgeArtifact = require('./artifacts/contracts/tknForge.sol/tknForge.json');
const abi = tknForgeArtifact.abi;
const bytecode = tknForgeArtifact.bytecode;

app.post('/deploy-token', async (req, res) => {
  try {
    const { name, symbol, supply } = req.body;

    // Log request data
    console.log('Request body:', { name, symbol, supply });

    // Create the contract factory
    const TokenFactory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Log ABI and bytecode to verify they’re loaded
    console.log('ABI:', abi);
    console.log('Bytecode:', bytecode ? bytecode.substring(0, 50) + '...' : 'undefined');

    // Deploy the contract
    const token = await TokenFactory.deploy(name, symbol, supply);

    // Log the token object and deployTransaction
    console.log('Token object:', token);
    console.log('Deploy transaction:', token.deployTransaction);

    // Check if deployTransaction exists
    if (!token.deployTransaction) {
      throw new Error('deployTransaction is undefined. Deployment may have failed silently.');
    }

    // Wait for transaction confirmation
    const txReceipt = await token.deployTransaction.wait();
    console.log('Transaction confirmed:', txReceipt);

    // Respond with the contract address and transaction hash
    res.json({
      address: token.address,
      tx: token.deployTransaction.hash,
    });
  } catch (error) {
    console.error('Deployment failed:', error);
    res.status(500).json({ error: 'Deployment failed', details: error.message });
  }
});



app.listen(5001, () => console.log('Server on port 5001'));