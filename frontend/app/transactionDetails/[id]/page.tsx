"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams from next/navigation
import { Transaction } from "../../types/transaction";
import { useRouter } from "next/navigation";

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const { id } = useParams(); // Get the dynamic 'id' parameter from the URL

  const deleteTransaction = (id: number | bigint) => {
    fetch(`http://localhost:8080/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        router.push("/");
      }
    });
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div>
      <h1>Transaction Details</h1>
      <table className="table-auto border-collapse w-full text-sm">
        <tbody className="bg-white dark:bg-slate-800">
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Id
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.id}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Name
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.name}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Description
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.description}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Value
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.value}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Date
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.date}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Category
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.category}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Currency
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.currency}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Created
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.createdAt}
            </td>
          </tr>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Updated
            </th>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {transaction.updatedAt}
            </td>
          </tr>
        </tbody>
      </table>
      <button
            onClick={() => {
              router.push(`/editTrans/${id}`)
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            EDIT
      </button>
      <button
            onClick={() => {
              deleteTransaction(parseInt(id as string, 10));
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            DELETE
      </button>
    </div>
  );
};

export default TransactionDetails;
