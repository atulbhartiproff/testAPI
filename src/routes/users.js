import {Router} from 'express';
import {db} from '../db.js';

const router=Router();

router.post("/",async (req,res)=>{
    const {name,email}=req.body;
    const result=await db.query(
        "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *", [name,email]
    );
    res.json(result.rows[0]);
})

router.get("/",async (req,res)=>{
    const result=await db.query("SELECT * FROM users");
    res.json(result.rows);
});

export default router;