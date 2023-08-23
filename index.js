import asyncHandler from 'express-async-handler'
import * as dotenv from 'dotenv' 
dotenv.config()

import express from'express'
import initApp from './src/app.router.js'
import connectDB from './Db/connectionDB.js'
import { sendEmail } from './src/services/sendEmail.js'

const app = express()

//app.set(`case sensitive routing`,true)
await sendEmail('rana.a.jawabry@gmail.com','hii','welcome')
initApp(express,app);




const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
}
   
)

