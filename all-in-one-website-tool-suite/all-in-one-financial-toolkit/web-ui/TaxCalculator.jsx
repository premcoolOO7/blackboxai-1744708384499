import React, { useState } from 'react';

function calculateTax(income, deductions) {
  // Simple progressive tax calculation example
  let taxableIncome = income - deductions.reduce((a, b) => a + b, 0);
  if (taxableIncome <= 9875) return taxableIncome * 0.10;
  if (taxableIncome <= 40125) return 987.5 + (taxableIncome - 9875) * 0.12;
  if (taxableIncome <= 85525) return 4617.5 + (taxableIncome - 40125) * 0.22;
  return 14605.5 + (taxableIncome - 85525) * 0.24;
}

export default function TaxForm({ income }) {
  const [deductions, setDeductions] = useState([]);
  const [deductionInput, setDeductionInput] = useState('');

  const addDeduction = () => {
    const val = parseFloat(deductionInput);
    if (!isNaN(val) && val > 0) {
      setDeductions([...deductions, val]);
      setDeductionInput('');
    }
  };

  const taxOwed = calculateTax(income, deductions);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Tax Calculator</h2>
      <div className="mb-2">
        <label className="block mb-1">Add Deduction Amount:</label>
        <input
          type="number"
          value={deductionInput}
          onChange={(e) => setDeductionInput(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={addDeduction}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Deduction
        </button>
      </div>
      <div className="mb-2">
        <strong>Deductions:</strong> {deductions.join(', ') || 'None'}
      </div>
      <div>
        <strong>Tax Owed:</strong> ${taxOwed.toFixed(2)}
      </div>
    </div>
  );
}
