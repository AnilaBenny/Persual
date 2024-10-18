import express from 'express';  
import { loginDetails,registrationDetails } from '../controllers/authController';
const authRoute=express.Router();

authRoute.post('/',loginDetails);
authRoute.post('/signup',registrationDetails);

export default authRoute;