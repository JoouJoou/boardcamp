import { connection } from "../database/db.js";

export async function getGames(req, res) {
  try {
    const { rows: games } = await connection.query("SELECT * FROM games;");
    return res.send(games);
  } catch {
    return res.sendStatus(500);
  }
}

export async function postGames(req, res) {
  try {
    const checkGame = await connection.query(
      `SELECT * FROM games WHERE name = $1`,
      [req.body.name]
    );
    if (checkGame.rowCount > 0) {
      return res.sendStatus(409);
    }
    const checkCategory = await connection.query(
      `SELECT * FROM categories WHERE id = $1`,
      [req.body.categoryId]
    );
    if (checkCategory.rowCount === 0) {
      console.log("si");
      return res.sendStatus(400);
    }
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${req.body.name}', '${req.body.image}', ${req.body.stockTotal}, ${req.body.categoryId}, ${req.body.pricePerDay})`
    );
    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
}
