import express from 'express'
import dotenv from "dotenv";
dotenv.config()
import morgan from 'morgan';
import userRoutes from './routes/UserRoutes.js'
import AdminAuthRoutes from './routes/AdminAuthRoutes.js'
import AdminRoutes from './routes/AdminRoutes.js'
import CampaignRoutes from './routes/CampaignRoutes.js'
import connectDB from './config/db.js'
import cors from 'cors'
import "./config/passport.js";    
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import cloudinary from './config/cloudinary.js';

connectDB()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(passport.initialize());
app.use(morgan("dev"))
app.use(errorMiddleware);


app.use('/auth/users',userRoutes)
app.use('/auth/admin',AdminAuthRoutes)
app.use('/admin',AdminRoutes)
app.use("/campaign", CampaignRoutes);


app.get('/',(req,res)=>{
    res.send(" MERN Backend with Controller-Service-Repository running!")
})

app.listen(PORT,"0.0.0.0", async ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
