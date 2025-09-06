import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await db.query(
      `SELECT g.*
       FROM games g
       WHERE g.genre IN (
           SELECT DISTINCT g2.genre
           FROM interactions i
           JOIN games g2 ON i.game_id = g2.id
           WHERE i.user_id = $1
       )
       AND g.id NOT IN (
           SELECT game_id FROM interactions WHERE user_id = $1
       )
       LIMIT 5;`,
      [userid]
    );

    if (result.rows.length === 0) {
      const fallback = await db.query(
        `
        SELECT g.id, g.title, g.genre, g.platform
        FROM games g
        LEFT JOIN interactions i ON g.id = i.game_id
        GROUP BY g.id
        ORDER BY COUNT(i.id) DESC
        LIMIT 10;`
      );
      return res.json(fallback.rows);
    }

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something messed up" });
  }
});

export default router;
