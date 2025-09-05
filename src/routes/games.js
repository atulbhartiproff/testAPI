import {Router} from 'express';
import {db} from '../db.js';
const router=Router();

router.post("/", async (req, res) => {
    const { title, genre, platform, description } = req.body;
    const result = await pool.query(
      "INSERT INTO games (title, genre, platform, description) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, genre, platform, description]
    );
    res.json(result.rows[0]);
  });

router.get("/", async (req,res)=>{
    const result=await db.query("SELECT * FROM games");
    res.json(result.rows);
});

router.get("/:id",async (req,res)=>{
    const {id}=req.params;
    const result=await db.query("SELECT * from games WHERE id=$1",[id]);
    if(result.rows.length===0){
        return res.status(404).json({error:"Game not found"});
    }
    res.json(result.rows[0]);
});

export default router;