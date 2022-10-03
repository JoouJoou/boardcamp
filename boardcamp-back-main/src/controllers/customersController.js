import { connection } from "../database/db.js";

export async function postCustomer(req, res) {
  try {
    const checkCostumer = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [req.body.cpf]
    );
    if (checkCostumer.rowCount > 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${req.body.name}', '${req.body.phone}', '${req.body.cpf}', '${req.body.birthday}')`
    );
    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
}

export async function getCustomers(req, res) {
  try {
    const cpf = req.query.cpf;
    if (cpf) {
      const { rows: customer } = await connection.query(
        `SELECT * FROM customers WHERE cpf = '${cpf}'`
      );
      return res.send(customer);
    }
    const { rows: customers } = await connection.query(
      "SELECT * FROM customers;"
    );
    return res.send(customers);
  } catch {
    return res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  try {
    const { id } = req.params;
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers WHERE id = '${id}'`
    );
    console.log(customer);
    if (customer.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(customer);
  } catch {
    return res.sendStatus(500);
  }
}
