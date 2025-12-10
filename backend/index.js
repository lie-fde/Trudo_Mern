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
import { createStream} from 'rotating-file-stream';
import fs from 'fs'
import path from 'path';
import PaymentRoutes from './routes/PaymentRoutes.js'
import EventRoute from './routes/EvenRoute.js'

connectDB()

const app = express()
const PORT = process.env.PORT || 3000;

const logDirectory = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const accessLogStream = createStream("access.log", {
  interval: "1d",     // rotate daily
  path: logDirectory,
  maxFiles: 7,        // keep logs for 7 days
  compress: "gzip"    // optional: compress old logs
});

// Print logs to terminal
app.use(morgan("dev"));

// Write logs to rotating file
app.use(morgan("combined", { stream: accessLogStream }));


app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(passport.initialize());
app.use(errorMiddleware);




app.use('/auth/users',userRoutes)
app.use('/auth/admin',AdminAuthRoutes)
app.use('/admin',AdminRoutes)
app.use("/campaign", CampaignRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/payments',PaymentRoutes)
app.use("/events",EventRoute)


app.get('/',(req,res)=>{
    res.send(" MERN Backend with Controller-Service-Repository running!")
})

app.listen(PORT,"0.0.0.0", async ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
