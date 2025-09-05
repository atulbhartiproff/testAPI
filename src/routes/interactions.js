import { Router } from "express";
import { db } from "../db.js"

const router = Router();

// Log user-item interaction
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { itemId, type, rating } = req.body;

  const result = await db.query(
    "INSERT INTO interactions (user_id, item_id, type, rating) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, itemId, type, rating]
  );
  res.json(result.rows[0]);
});

export default router;
