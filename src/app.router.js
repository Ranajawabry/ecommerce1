import connectDB from '../Db/connectionDB.js';
import AuthRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import messageRouter from './modules/messages/message.router.js'
import catagoryRouter from './modules/catagory/catagory.router.js'
import subCatagory from './modules/subCatagory/subCatagory.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import productRouter from './modules/product/product.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import { globalErrorHandel } from './services/errorHandling.js';
import cors from 'cors' ;

const initApp = (express,app)=>{
    
    var whitelist = ['http://127.0.0.1:5500', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
    app.use(cors())
    app.use(express.json());
    app.get('/', (req, res) => res.json('Hello World!'))
    app.use('/auth', AuthRouter)
    app.use('/user', userRouter)
    app.use('/message',messageRouter)
    app.use('/catagory',catagoryRouter)
    app.use('/subcatagory',subCatagory)
    app.use('/coupon',couponRouter)
    app.use('/product',productRouter)
    app.use('/cart',cartRouter)
    app.use('/order',orderRouter)

    app.use('*',(req,res)=>{
        return res.json("page not found")
    })
    
    app.use(globalErrorHandel)    // globalError
}
export default initApp;