import express from 'express';

import dotenv from 'dotenv'

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'

const app = express();

dotenv.config()
connectDB()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user',userRoutes)

const PORT=process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
