import express from "express";
import axios from "axios";
import cors from "cors";
import users from "./routes/users.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;


//Routes one by one
app.use("/users",users);

app.listen(PORT, ()=> {console.log("SERVER RUNNING BOYS");})

