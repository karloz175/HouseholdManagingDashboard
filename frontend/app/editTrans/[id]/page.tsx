"use client";
//it will be a dynamic page, on client side
import { useEffect, useState } from "react";
import {
  Transaction,
  TransactionCategory,
  TransactionCurrency,
  TransactionType,
} from "../../types/transaction";
import { useParams } from "next/navigation";

export default function EditTransPage() {
  const [transaction, setTransaction] = useState<Transaction>({
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();


  useEffect(() => {
    if (id) {
      // Fetch transaction details based on the ID from the URL
      fetch(`http://localhost:8080/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Transaction not found");
          }
          return response.json();
        })
        .then((data) => {
          setTransaction(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Call the backend to add the transaction
    try {
      const response = await fetch("http://localhost:8080/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        setStatusMessage("Transaction edited successfully!");
        // Reset the form
        setTransaction({
          id: transaction.id,
          name: transaction.name,
          description: transaction.description,
          value: transaction.value,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          currency: transaction.currency,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        });
      } else {
        setStatusMessage("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      setStatusMessage("An error occurred while adding the transaction.");
      console.error(error);
    }
  };

  {
    /* 
        Formularz do dodawania transakcji:
      */
  }
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
              value={transaction.name}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.description}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.value}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.date}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.type}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.category}
              onChange={(e) =>
                setTransaction((prev) => ({
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
              value={transaction.currency}
              onChange={(e) =>
                setTransaction((prev) => ({
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
          Edit transaction
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
