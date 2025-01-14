"use client";
import { useEffect, useState } from "react";
import { Transaction, DatesRange } from "../types/transaction";
import { useRouter } from "next/navigation"

const Daterange = () => {
    const [dataFromTransactions, setDataFromTransactions] = useState<
    Transaction[]
  >([]);

    const [datesForTransactions, setDatesForTransactions] = useState<
    DatesRange
  >({
    startDate: getCurrentDateString(),
    endDate: getCurrentDateString(),
  });

  const [refreshKey, setRefreshKey] = useState(0); // Trigger useEffect on submit

  const router = useRouter(); // Initialize the useRouter hook

  function getCurrentDateString(): string {
    const today = new Date();

    // Format the date as a string in "YYYY-MM-DD" format
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

  useEffect(() => {    

  fetch(
    `http://localhost:8080/daterange/dates?startDate=${datesForTransactions.startDate}&endDate=${datesForTransactions.endDate}`
  )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDataFromTransactions(data); // Ensure data is an array
        } else {
          console.error("Expected array but received:", data);
          setDataFromTransactions([]); // Reset to empty array on invalid data
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setDataFromTransactions([]); // Reset to empty array on fetch error
      });
  }, [datesForTransactions, refreshKey]);
    
  

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRefreshKey((prev) => prev + 1); // Trigger useEffect by changing refreshKey
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
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Date 1 field */}
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              id="startDate"
              type="date"
              value={datesForTransactions.startDate}
              onChange={(e) =>
                setDatesForTransactions((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          {/* Date 2 field */}
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              id="endDate"
              type="date"
              value={datesForTransactions.endDate}
              onChange={(e) =>
                setDatesForTransactions((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </form>
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

export default Daterange;