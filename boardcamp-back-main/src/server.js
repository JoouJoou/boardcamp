import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const connection = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "1234",
  database: "boardcamp",
});

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log("Listen on 5000");
});
