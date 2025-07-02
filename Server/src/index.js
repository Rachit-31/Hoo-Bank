import dotenv from "dotenv"
import app from './app.js'

dotenv.config({
    path:'./env'
})

app.get('/', (req, res)=>{
    res.send("server is running")
})