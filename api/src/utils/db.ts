import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

let _db: Database | null = null;

const db = async () => {
  if (_db) {
    return _db;
  }
  _db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await _db.run("PRAGMA foreign_keys = ON");
  return _db;
};

export { db };
