import { connection } from "../database/db.js";
import dayjs from "dayjs";

export async function postRent(req, res) {
  try {
    console.log("s");
    const date = dayjs().format("YYYY-MM-DD");
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers WHERE id = '${req.body.customerId}'`
    );
    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = '${req.body.gameId}'`
    );
    if (game.length === 0 || customer.length === 0) {
      return res.sendStatus(400);
    }
    const gameAmount = game[0].stockTotal - 1;
    if (gameAmount < 0) {
      return res.sendStatus(400);
    }
    await connection.query(
      `UPDATE games SET "stockTotal" = ${gameAmount} WHERE id = ${req.body.gameId}`
    );
    const price = req.body.daysRented * game[0].pricePerDay;
    const rent = {
      customerId: req.body.customerId,
      gameId: req.body.gameId,
      daysRented: req.body.daysRented,
      rentDate: date,
      returnDate: null,
      originalPrice: price,
      delayFee: null,
    };
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES (${rent.customerId}, ${rent.gameId}, '${rent.rentDate}', ${rent.daysRented}, ${rent.originalPrice})`
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  try {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    return res.send(customers);
  } catch {
    return res.sendStatus(500);
  }
}
