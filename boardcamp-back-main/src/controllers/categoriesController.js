import { connection } from "../database/db.js";

export async function postCategories(req, res) {
  try {
    const name = req.body.name;
    const exist = await connection.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );
    if (name === "") {
      return res.sendStatus(400);
    } else if (exist.rowCount > 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      `INSERT INTO categories (name) VALUES ('${req.body.name}');`
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories;"
    );
    return res.send(categories);
  } catch {
    res.sendStatus(500);
  }
}
