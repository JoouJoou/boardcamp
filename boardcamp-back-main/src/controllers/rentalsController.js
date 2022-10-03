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
    const { customerId, gameId } = req.query;

    let where;
    const preventSQLInjection = [];

    if (customerId && gameId) {
      where = 'WHERE "customerId" = $1 AND "gameId" = $2';
      preventSQLInjection.push(customerId, gameId);
    } else if (customerId) {
      where = 'WHERE "customerId" = $1';
      preventSQLInjection.push(customerId);
    } else if (gameId) {
      where = 'WHERE "gameId" = $1';
      preventSQLInjection.push(gameId);
    } else {
      where = "";
    }

    const { rows: rentals } = await connection.query(
      `
    SELECT rentals.*, 
    json_build_object('id', customers.id, 'name', customers.name) AS customer,
    json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id
    ${where}
    `,
      preventSQLInjection
    );
    return res.send(rentals);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function endRental(req, res) {
  try {
    const { id } = req.params;
    const date = dayjs().format("YYYY-MM-DD");
    const { rows: rent } = await connection.query(
      `SELECT * FROM rentals WHERE id = ${id}`
    );
    if (rent.length === 0) {
      return res.sendStatus(404);
    } else if (rent[0].delayFee !== null) {
      return res.sendStatus(400);
    }
    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = ${rent[0].gameId}`
    );
    const diffDay = dayjs().diff(rent[0].rentDate, "day");
    console.log(date);
    const delayFee = game[0].pricePerDay * diffDay;
    await connection.query(
      `UPDATE rentals SET "returnDate" = '${date}', "delayFee" = ${delayFee} WHERE id = ${id}`
    );
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
