import userModel from "../../../../Db/model/user.model.js";
import bcrypt from 'bcryptjs';
import { compare, hash } from "../../../services/hashAndCompare.js";
import { generateToken, verifyToken } from "../../../services/generateAndVerifyToken.js";
import { schemaSingin, schemaSingup } from "../auth.validatiion.js";
import { sendEmail } from "../../../services/sendEmail.js";
import { customAlphabet } from "nanoid";

export const signup= async(req,res,next)=>{
    
    
    const {userName,email,password}=req.body;
    

   
    const user = await userModel.findOne({email})
   
    if(!user){
        const token = generateToken({email},process.env.EMAIL_TOKEN, 5*60 );// 5min
        
        const RefrehToken = generateToken({email},process.env.EMAIL_TOKEN, 60*60*24 );// oneDay
        
         const newUser = await userModel.create({userName,email, password :hash(password) });
         

         const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
         const Rlink=`${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${RefrehToken}`;
         
         const html=`<a href="${link}">"Verify your email</a> <br> <br> <br> <a href=${Rlink}>send new email<a>`
         
         await sendEmail(email,'Verify your Email',html);
        

         return res.status(201).json({message:"done", newUser});


    }
    return next(new Error("email already exists",{cause:409}));
   return res.status(409).json({message:"email is exist"});


    
}

export const signin = async(req,res,next)=>{
    
    const {email,password}=req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return next(new Error("email not exists",{cause:404}));
        return res.status(400).json({message:"invalied email"})
    }
    if(user.confirmEmail==false){
        return next(new Error("plz verify your email",{cause:404}));
        return res.json({message:"plz verify your email"});
    }
    const match = compare(password,user.password)
    if(!match){
        return next(new Error("innvalied login data",{cause:400}));
      
    }
    const token= generateToken({id:user._id,role:user.role},process.env.LOGIN_TOKEN,'1h')
    const refreshToken= generateToken({id:user._id,role:user.role},process.env.LOGIN_TOKEN,60*60*24*365);
   
    return res.status(200).json({message:"success",token,refreshToken});




}

export const confirmEmail =async(req,res)=>{
    const {token}= req.params;
    if(!token){
        return res.status(404).json({message:"invalied token"})
    }
    const {email} = verifyToken(token,process.env.EMAIL_TOKEN);
    
    if(!email){
        return next(new Error("invalied token payload",{cause:400}))

    }

    const user= await userModel.updateOne({email},{confirmEmail:true})
    if(user.modifiedCount){
        return res.status(200).json({message: "your email conffiem" })
        //return res.redirect("http://www.facebook.com")

    }
   
    
}

export const NewconfirmEmail = async(req,res,next)=>{ 

    let {token} =req.params;

    const {email}=verifyToken(token,process.env.EMAIL_TOKEN);

    if(!email){
        return next(new Error("invalied token payload",{cause:400}))

    }

    const user = await userModel.findOne({email});
    if(!user){
        return next(new Error("email is not exist",{cause:400}))
    }
   if(user.confirmEmail){
    return res.status(200).redirect("https://www.facebook.com/rana.jawabry/")
   }
   token = generateToken({email},process.env.EMAIL_TOKEN, 60*5)
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const html=`<a href="${link}">"Verify your email</a> `
     sendEmail(email,'Verify your Email',html);
     
     return res.status(200).send('<p>new confirm email send</p>')

}
export const sendCode = async(req,res,next)=>{
    const {email} = req.body;
    let code = customAlphabet('12345abcd',4);
    code=code()
    const user = await userModel.findOneAndUpdate({email},{forgetPassword:code},{new:true})
    
    const html =`<p>${code}</p>`;
    sendEmail(email,'forget password',html);
    return res.status(200).json({message:"success",user})

}

export const forgetPassword =async(req,res,next)=>{

const {code,email,password}=req.body;

const user = await userModel.findOne({email});
if(!user){
    return next(new Error("not rejester account",{cause:400}))
}
if(!code||user.forgetPassword!=code){
    return next(new Error("invalied code",{cause:404}))
}
const newPassword = hash(password);
user.password=newPassword;
user.forgetPassword=null
user.changePasswordTime=Date.now(); ///// 
await user.save();



return res.status(200).json({message:"success",user})
}