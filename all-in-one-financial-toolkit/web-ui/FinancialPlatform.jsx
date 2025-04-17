import React, { useState, useEffect } from 'react';
import TaxForm from './TaxCalculator';

function PlaidBankSync() {
  const [transactions, setTransactions] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/plaid/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Plaid Bank Sync</h3>
      <input
        type="text"
        placeholder="Enter Plaid Access Token"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        className="border p-2 w-full rounded mb-2"
      />
      <button
        onClick={fetchTransactions}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Fetch Transactions
      </button>
      <ul className="mt-4 max-h-48 overflow-auto">
        {transactions.length === 0 && <li>No transactions found.</li>}
        {transactions.map((tx, index) => (
          <li key={index} className="border-b py-1">
            {tx.date} - {tx.name} - ${tx.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DoubleEntryAccounting() {
  const [entries, setEntries] = useState([]);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('DEBIT');

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/ledger/');
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
    }
  };

  const addEntry = async () => {
    if (!account || !amount) return;
    try {
      const response = await fetch('/api/ledger/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, amount: parseFloat(amount), type }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAccount('');
        setAmount('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Error adding ledger entry:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Double-Entry Accounting</h3>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="DEBIT">Debit</option>
          <option value="CREDIT">Credit</option>
        </select>
        <button
          onClick={addEntry}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Entry
        </button>
      </div>
      <ul className="max-h-48 overflow-auto">
        {entries.length === 0 && <li>No ledger entries.</li>}
        {entries.map((entry, index) => (
          <li key={index} className="border-b py-1">
            {entry.type} - {entry.account} - ${entry.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AIPoweredInsights() {
  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
      <p>Get predictive cash flow, tax-saving recommendations, and fraud detection.</p>
      {/* AI models and analytics integration to be implemented */}
    </div>
  );
}

// Role-based access placeholder
function RoleBasedDashboard({ role }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard - Role: {role}</h2>
      <PlaidBankSync />
      <DoubleEntryAccounting />
      <TaxForm income={75000} />
      <AIPoweredInsights />
    </div>
  );
}

export default function FinancialPlatform() {
  const [role, setRole] = useState('Individual'); // Roles: Individual, Business, Advisor

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-2">AI-Driven Financial Platform</h1>
        <p className="text-center text-gray-600 mb-4">
          Integrated tools for personal budgeting, business accounting, investing, tax management, and payments.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${role === 'Individual' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
            onClick={() => setRole('Individual')}
          >
            Individual
          </button>
          <button
            className={`px-4 py-2 rounded ${role === 'Business' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'}`}
            onClick={() => setRole('Business')}
          >
            Business
          </button>
          <button
            className={`px-4 py-2 rounded ${role === 'Advisor' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-600'}`}
            onClick={() => setRole('Advisor')}
          >
            Advisor
          </button>
        </div>
      </header>
      <main>
        <RoleBasedDashboard role={role} />
      </main>
    </div>
  );
}
