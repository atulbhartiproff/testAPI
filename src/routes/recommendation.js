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

router.get("/hybrid/:userid", async (req, res) => {
  const contentweight = 0.3;
  const collabweight = 0.7;
  const { userid } = req.params;
  try {
    const contentRes = await db.query(
      `
          SELECT g.id, g.title, g.genre, g.platform, 1.0 AS score
          FROM games g
          WHERE g.genre = (
              SELECT g2.genre
              FROM interactions i
              JOIN games g2 ON i.game_id = g2.id
              WHERE i.user_id = $1
              ORDER BY i.created_at DESC
              LIMIT 1
          )
          AND g.id NOT IN (
              SELECT game_id FROM interactions WHERE user_id = $1
          )
          LIMIT 10;
        `,
      [userid]
    );

    const collabRes = await db.query(
      `
          SELECT g.id, g.title, g.genre, g.platform, 1.0 AS score
          FROM interactions i
          JOIN games g ON i.game_id = g.id
          WHERE i.user_id IN (
            SELECT DISTINCT i2.user_id
            FROM interactions i1
            JOIN interactions i2 ON i1.game_id = i2.game_id
            WHERE i1.user_id = $1 AND i2.user_id != $1
          )
          AND g.id NOT IN (
            SELECT game_id FROM interactions WHERE user_id = $1
          )
          GROUP BY g.id
          ORDER BY COUNT(i.id) DESC
          LIMIT 10;
        `,
      [userid]
    );

    const weightedContent = contentRes.rows.map((g) => ({
      ...g,
      score: g.score * contentweight,
    }));
    const weightedCollab = collabRes.rows.map((g) => ({
      ...g,
      score: g.score * collabweight,
    }));

    const mergedMap = new Map();
    [...weightedContent, ...weightedCollab].forEach((game) => {
      if (mergedMap.has(game.id)) {
        mergedMap.set(game.id, {
          ...game,
          score: mergedMap.get(game.id).score + game.score,
        });
      } else {
        mergedMap.set(game.id, game);
      }
    });

    let merged = Array.from(mergedMap.values()).sort(
      (a, b) => b.score - a.score
    );
    if (merged.length === 0) {
      const fallback = await db.query(`
              SELECT g.id, g.title, g.genre, g.platform
              FROM games g
              LEFT JOIN interactions i ON g.id = i.game_id
              GROUP BY g.id
              ORDER BY COUNT(i.id) DESC
              LIMIT 10;
            `);
      merged = fallback.rows;
    }

    res.json(merged);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something messed up" });
  }
});

export default router;
