import {Router} from "express";
import {db} from "../db.js"
const router=Router();


router.get("/:userid", async (req,res)=>{
    const {userid}=req.params;
    try{
        const result=await db.query(`SELECT g.id, g.title, g.genre, g.platform
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
    SELECT game_id
    FROM interactions
    WHERE user_id = $1
)
LIMIT 10;
`,
      [userid]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Something messed up again didnt it"});
    }
});

export default router;