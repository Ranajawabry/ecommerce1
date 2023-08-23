import bcrypt from 'bcryptjs';

export const hash =(plainText,saltRound= parseInt(process.env.SALT_ROUND))=>{
   
    return bcrypt.hashSync(plainText , saltRound);
}
  
export const compare =(password,hashText)=>{

  return   bcrypt.compareSync(password,hashText); // false
}
