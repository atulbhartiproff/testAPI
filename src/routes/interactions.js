import { Router } from "express";
import { db } from "../db.js"

const router = Router();

// Log user-item interaction
router.post("/", async (req, res) => {
  const { user_id, game_id, action, rating} =req.body;
  try{
  const result = await db.query(
    `INSERT INTO interactions (user_id, game_id, action, rating)
    VALUES ($1, $2, $3, $4) RETURNING *`,
   [user_id, game_id, action, rating || null]
  );
  res.json(result.rows[0]);
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({error:"Failed to log interaction"})
  }
});

router.get("/:userid",async (req,res)=>{
  try{
    const {userid} =req.params;
    const result=await db.query(
      `SELECT i.*, g.title, g.genre, g.platform
       FROM interactions i
       JOIN games g ON i.game_id = g.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [userid]
    );
    res.json(result.rows);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:"Failed to fetch anything"});
  }
})

export default router;
