import asyncHandler from 'express-async-handler'
import * as dotenv from 'dotenv' 
dotenv.config()

import express from'express'
import initApp from './src/app.router.js'
import connectDB from './Db/connectionDB.js'

const app = express()

//app.set(`case sensitive routing`,true)

initApp(express,app);




const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
}
   
)

