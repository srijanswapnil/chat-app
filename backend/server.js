import express from 'express';
import { chats } from "./data/data.js"; 
import dotenv from 'dotenv'

import connectDB from './config/db.js';
const app = express();

dotenv.config()
connectDB()


app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user',userRoutes)

const PORT=process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
