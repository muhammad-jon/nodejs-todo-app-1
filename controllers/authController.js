import db from "./../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Email, name, password required! " });
    }
    const existingUser = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "Sucessfuly registered", data: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if ((!email, !password)) {
      res.status(400).json({
        message: "Email, password required",
      });
    }
    const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken({id:user.id, email:user.email});

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
