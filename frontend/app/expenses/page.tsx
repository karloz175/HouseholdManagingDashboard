"use client";
import { useEffect, useState } from "react";
import { Transaction } from "../types/transaction";
import { useRouter } from "next/navigation"

const Expenses = () => {
    const [dataFromTransactions, setDataFromTransactions] = useState<
    Transaction[]
  >([]);

  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    fetch("http://localhost:8080/expenses")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDataFromTransactions(data);
      });
  }, []);

  const deleteTransaction = (id: number | bigint) => {
    fetch(`http://localhost:8080/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        // setTrigger((prev) => !prev); // na nowo fetchuje, a to niżej tylko na UI wywali z wygladu i nie bedzie fetchowac na nowo
        setDataFromTransactions((prev) => {
          return prev.filter((trans) => trans.id !== id);
        });
      }
    });
  };

  const handleRowClick = (id: number | bigint) => {
    // Navigate to the transaction details page when the row is clicked
    router.push(`/transactionDetails/${id}`);
  };

  // html view for data:
  const listOfTransactions = dataFromTransactions.map((trans) => {
    return (
      <tr
        key={trans.id}
        onClick={() => handleRowClick(trans.id)} // Handle click on the row
        style={{ cursor: "pointer" }} // Style to indicate it's clickable
        className="hover:bg-gray-100 dark:hover:bg-gray-600" // Optional: hover effect
      >
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.id}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.name}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.description}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.value}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.date}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.category}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.currency}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.createdAt}
        </td>
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
          {trans.updatedAt}
        </td>
        <td>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the row click handler from firing when deleting
              deleteTransaction(trans.id);
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            DELETE
          </button>
        </td>
      </tr>
    );
  });
  
  return (
    <div>
      {/*  */}
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Id
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Name
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Description
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Value
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Date
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Category
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Currency
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Created
            </th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          {listOfTransactions}
        </tbody>
      </table>
    </div>
  );
}

export default Expenses;