import express from "express";
import { DatabaseConnector } from "./database";

const dbConnector = DatabaseConnector.getInstance();

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer mySecretToken") {
    next();
    return;
  }
  res.status(401).json({ message: "You need to provide a valid token!" });
});

app.get("/", (req, res) => {
  try {
    res.json(dbConnector.getTransactions());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions.", error: error.message });
  }
});

app.get("/incomes/", (req, res) => {
  try {
    res.json(dbConnector.getIncomes());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching incomes.", error: error.message });
  }
});

app.get("/expenses", (req, res) => {
  try {
    res.json(dbConnector.getExpenses());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching expenses.", error: error.message });
  }
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  const transaction = dbConnector.getTransaction(parseInt(id));
  if (!transaction) {
    res.status(404).json({ message: "Transaction not found!" });
    return;
  }
  try {
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transaction by id.",
      error: error.message,
    });
  }
});

function isValidDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // Matches 'YYYY-MM-DD'
  return regex.test(date);
}

app.get("/transactions/daterange", (req, res) => {
  const { startDate, endDate } = req.query;

  if (
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    !isValidDate(startDate) ||
    !isValidDate(endDate)
  ) {
    res.status(400).json({
      message:
        "You must provide both startDate and endDate in the 'YYYY-MM-DD' format.",
    });
    return;
  }
  try {
    const transactions = dbConnector.getTransactionsBetweenDates(
      startDate as string,
      endDate as string
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions between dates.",
      error: error.message,
    });
  }
});

app.get("/transactions/last/:days", (req, res) => {
  const { days } = req.params;
  try {
    res.json(dbConnector.getTransactionsFromLastDays(parseInt(days)));
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions from last days.",
      error: error.message,
    });
  }
});

///Adding new data to the server
app.post("/", (req, res) => {
  const { name, description, value, date, type, category, currency } = req.body;

  if (
    name === undefined ||
    description === undefined ||
    value === undefined ||
    date === undefined ||
    type === undefined ||
    category === undefined ||
    currency === undefined
  ) {
    res.status(400).json({
      message:
        "You need to provide all data(name, description, value, date, type, category, currency)!",
    });
    return;
  }
  try {
    const addedTransaction = dbConnector.createTransaction(
      name,
      description,
      value,
      date,
      type,
      category,
      currency
    );
    res.json(addedTransaction);
  } catch (error) {
    res.status(500).json({
      message: "Error adding transaction.",
      error: error.message,
    });
  }
});

//Updating data on the server
app.put("/", (req, res) => {
  const { id, name, description, value, date, type, category, currency } =
    req.body;
  if (
    id === undefined ||
    name === undefined ||
    description === undefined ||
    value === undefined ||
    date === undefined ||
    type === undefined ||
    category === undefined ||
    currency === undefined
  ) {
    res.json({
      message:
        "You need to provide all data(id, name, description, value, date, type, category, currency)!",
    });
    return;
  }
  //check if transaction exists
  const transaction = dbConnector.getTransactions().find((transaction) => {
    return transaction.id === parseInt(id);
  });
  if (!transaction) {
    res.json({ message: "Transaction not found!" });
    return;
  }
  try {
    const updatedTransaction = dbConnector.updateTransaction(
      id,
      name,
      description,
      value,
      date,
      type,
      category,
      currency
    );
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({
      message: "Error updating transaction.",
      error: error.message,
    });
  }
});

//Deleting data from the server
app.delete("/:id", (req, res) => {
  const { id } = req.params;
  //check if transaction exists
  const transaction = dbConnector
    .getTransactions()
    .find((transaction) => transaction.id === parseInt(id));
  if (!transaction) {
    res.json({ message: "Transaction not found!" });
    return;
  }
  try{
    dbConnector.deleteTransaction(parseInt(id));
  res.json({ message: "You deleted a transaction!" });
  } catch (error){
    res.status(500).json({
      message: "Error deleting transaction.",
      error: error.message,
    });
  }

  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
