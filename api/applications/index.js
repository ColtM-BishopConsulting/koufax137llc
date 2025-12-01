// api/applications/index.js
const { query } = require("../../db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const {
        name = null,
        email = null,
        phone = null,
        propertyAddress = null,
        moveInDate = null,
        coAppEmail = null,   // 👈 NEW
      } = body;

      const result = await query(
        `INSERT INTO applications (name, email, phone, property_address, move_in_date, co_app_email, raw_payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, email, phone, propertyAddress, moveInDate, coAppEmail, JSON.stringify(body)]
      );

      return res.status(201).json(result.rows[0]);
    }

    if (req.method === "GET") {
      const result = await query(
        `SELECT * FROM applications ORDER BY created_at DESC`
      );
      return res.status(200).json(result.rows);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in /api/applications:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
