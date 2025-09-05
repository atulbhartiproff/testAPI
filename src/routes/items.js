import {Router} from 'express';
import {db} from '../db.js';
const router=Router();

router.post("/",async (req,res)=>{
    const {title,description,tags}=req.body;
    const result= await db.query(
        "INSERT INTO items (title,description,tags) VALUES ($1,$2,$3) RETURNING *", [title,description,tags]
    );
    res.json(result.rows[0]);
});

router.get("/", async (req,res)=>{
    const result=await db.query("SELECT * FROM items");
    res.json(result.rows);
});

export default router;