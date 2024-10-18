import { Request, Response } from 'express';

export const loginDetails = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    
    res.send('Login details received');
};
 export const registrationDetails =async()=>{
    
 }