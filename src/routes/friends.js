import {Router} from 'express';
import {db} from '../db.js';

const router = Router();

router.post("/:userId/friends", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { friendId } = req.body;
  
    if (userId === friendId) {
      return res.status(400).json({ error: "Cannot be friends with yourself" });
    }
  
    try {
      await db.query(`
        INSERT INTO friends (user_id, friend_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [userId, friendId]);
  
      await db.query(`
        INSERT INTO friends (user_id, friend_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [friendId, userId]);
  
      res.json({ message: "Mutual friendship created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create mutual friendship" });
    }
  });
  

router.get('/:userid/friends', async (req, res) => {
    const { userid } = req.params;
    try {
        const friends = await db.query(`

      SELECT u.id, u.name, u.email
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = $1;
    `, [userid]);
     res.json(friends.rows);
        }
        catch(err)
        {
            console.error(err);
            res.status(500).json({error: 'Internal server error'});
        }
});

export default router;