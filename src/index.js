import express from "express";
import axios from "axios";
import cors from "cors";
import users from "./routes/users.js";
import games from "./routes/games.js";
import interactions from "./routes/interactions.js";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;


//Routes one by one
app.use("/users",users);
app.use("/games",games);
app.use("/interactions",interactions);

app.listen(PORT, ()=> {console.log("SERVER RUNNING BOYS");})

