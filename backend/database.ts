import Database from "better-sqlite3";
import BetterSqlite3 from "better-sqlite3";

type TransactionType = 'income' | 'expense';
type TransactionCategory = 'Food' | 'Housing' | 'Other fees and bills' | 'Health, hygiene and chemicals' | 'Clothes and footwear' | 'Relaxation' | 'Transport' | 'Other expenses';
type TransactionCurrency = 'PLN' | 'EUR' | 'USD' | 'CHF' | 'CZK';

interface Transaction{
    id: number|bigint;
    name: string;
    description: string; //optional field for more details about transaction
    value: number;
    date: Date; // when transaction had place format (e.g., '2025-01-09')
    type: TransactionType;
    category: TransactionCategory;
    currency: TransactionCurrency;
    createdAt: Date; // when created
    updatedAt: Date; // when last updated
}


export class DatabaseConnector {
  private static instance: DatabaseConnector;

  private _db: BetterSqlite3.Database;

  private constructor() {
    this._db = new Database("database.db");
    this.init();
  }

  public static getInstance(): DatabaseConnector {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = new DatabaseConnector();
    }

    return DatabaseConnector.instance;
  }

  public getTransaction(id: number):Transaction {
    return this._db.prepare("SELECT * FROM transactions WHERE id = ?").get(id) as Transaction;
  }

  public getTransactions():Transaction[] {
    return this._db.prepare("SELECT * FROM transactions").all() as Transaction[];
  }

  public getExpenses():Transaction[] {
    return this._db.prepare("SELECT * FROM transactions WHERE type='expense'").all() as Transaction[];
  }

  public getIncomes():Transaction[] {
    return this._db.prepare("SELECT * FROM transactions WHERE type='income'").all() as Transaction[];
  }

  public getTransactionsFromLastDays(days: number):Transaction[] {
    return this._db.prepare("SELECT * FROM transactions WHERE date > DATE('now', ?)").all(`-${days} days`) as Transaction[];
  }

  public getTransactionsBetweenDates(startDate: string, endDate: string): Transaction[] {
    return this._db.prepare("SELECT * FROM transactions WHERE date BETWEEN ? AND ?").all(startDate, endDate) as Transaction[];
  }


  public createTransaction(name: string, description: string, value: number, date: Date, type: TransactionType, category: TransactionCategory, currency: TransactionCurrency):Transaction{
    const id = this._db
      .prepare("INSERT INTO transactions (name, description, value, date, type, category, currency, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)")
      .run(name, description, value, date, type, category, currency).lastInsertRowid;
      const transaction = this._db.prepare(`SELECT * FROM transactions WHERE id = ?`).get(id) as Transaction;
    return {
        id,
        name,
        description,
        value,
        date: new Date(transaction.date),
        type,
        category,
        currency,
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt)

    }
  }

  public updateTransaction(id: number, name: string, description: string, value: number, date: Date, type: TransactionType, category: TransactionCategory, currency: TransactionCurrency) {
    this._db
      .prepare("UPDATE transactions SET name = ?, description = ?, value = ?, date = ?, type = ?, category = ?, currency = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?")
      .run(name, description, value, date, type, category, currency, id);
      return this.getTransaction(id);
  }

  public deleteTransaction(id: number) {
    return this._db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
  }

  createTableQuery: string = `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID, auto-incremented
            name TEXT NOT NULL, -- Transaction name
            description TEXT NOT NULL, -- Description of the transaction.
            value REAL NOT NULL, -- Transaction value (REAL to support decimals)
            date TEXT NOT NULL, -- Date of the transaction (ISO 8601 format: 'YYYY-MM-DD')
            type TEXT CHECK(type IN ('income', 'expense')) NOT NULL, -- Type of transaction
            category TEXT CHECK(category IN (
                'Food',
                'Housing',
                'Other fees and bills',
                'Health, hygiene and chemicals',
                'Clothes and footwear',
                'Relaxation',
                'Transport',
                'Other expenses'
            )) NOT NULL, -- Category of the transaction
            currency TEXT CHECK(currency IN ('PLN', 'EUR', 'USD', 'CHF', 'CZK')) NOT NULL, -- Currency type
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp when created
            updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp when last updated
        )`

  private init() {
    this._db
      .prepare(this.createTableQuery)
      .run();
  }
}
