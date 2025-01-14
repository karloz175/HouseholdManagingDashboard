"use client";
//it will be a dynamic page, on client side
import { useState } from "react";
import { Transaction, TransactionCategory, TransactionCurrency, TransactionType } from "../types/transaction";

export default function AddTransPage() {

  const [newTransactionData, setNewTransactionData] = useState<Transaction>({
    id: 0,
    name: "",
    description: "",
    value: 0,
    date: "",
    type: "expense",
    category: "Other expenses",
    currency: "PLN",
    createdAt: "",
    updatedAt: "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Call the backend to add the transaction
    try {
      const response = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransactionData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        setStatusMessage("Transaction added successfully!");
        // Reset the form
        setNewTransactionData({
          id: 0,
          name: "",
          description: "",
          value: 0,
          date: "",
          type: "expense",
          category: "Other expenses",
          currency: "PLN",
          createdAt: "",
          updatedAt: "",
        });
      } else {
        setStatusMessage("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      setStatusMessage("An error occurred while adding the transaction.");
      console.error(error);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">Add a Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={newTransactionData.name}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Description field */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              value={newTransactionData.description}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Value field */}
          <div className="flex flex-col">
            <label
              htmlFor="value"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Value
            </label>
            <input
              id="value"
              type="number"
              value={newTransactionData.value}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  value: Number(e.target.value),
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Date field */}
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={newTransactionData.date}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Type field */}
          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <select
              id="type"
              value={newTransactionData.type}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  type: e.target.value as TransactionType,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category field */}
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={newTransactionData.category}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  category: e.target.value as TransactionCategory,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Food">Food</option>
              <option value="Housing">Housing</option>
              <option value="Other fees and bills">Other fees and bills</option>
              <option value="Health, hygiene and chemicals">
                Health, hygiene and chemicals
              </option>
              <option value="Clothes and footwear">Clothes and footwear</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Transport">Transport</option>
              <option value="Other expenses">Other expenses</option>
            </select>
          </div>

          {/* Currency field */}
          <div className="flex flex-col">
            <label
              htmlFor="currency"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              value={newTransactionData.currency}
              onChange={(e) =>
                setNewTransactionData((prev) => ({
                  ...prev,
                  currency: e.target.value as TransactionCurrency,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="CHF">CHF</option>
              <option value="CZK">CZK</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add transaction
        </button>
      </form>

      {statusMessage && (
        <p className="text-center mt-4 text-sm text-gray-500">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
