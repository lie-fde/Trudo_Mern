import express from 'express'
import dotenv from "dotenv";
import userRoutes from './routes/UserRoutes.js'
import connectDB from './config/db.js'
import cors from 'cors'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000;


app.use(cors())
app.use(express.json())


app.use('/auth/users',userRoutes)

app.get('/',(req,res)=>{
    res.send("🚀 MERN Backend with Controller-Service-Repository running!")
})

app.listen(PORT, async ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
