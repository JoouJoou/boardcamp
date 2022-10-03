import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const user = "postgres";
const password = "1234";
const host = "localhost";
const port = 5432;
const database = "boardcamp";

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { connection };
