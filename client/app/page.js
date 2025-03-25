"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDeploy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deploy-token`,
        {
          name,
          symbol,
          supply: parseInt(supply), // Ensure supply is a number
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to deploy token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">MintForge - Create Token</h1>
        <form onSubmit={handleDeploy} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black-700">Token Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., TestToken"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black-700">Token Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., TST"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black-700">Initial Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 1000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Deploying..." : "Deploy Token"}
          </button>
        </form>
        {result && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <p><strong>Contract Address:</strong> {result.address}</p>
            <p><strong>Transaction Hash:</strong> {result.tx}</p>
            <a
              href={`https://amoy.polygonscan.com/tx/${result.tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on PolygonScan
            </a>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}