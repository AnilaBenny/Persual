import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

const databaseURI = "mongodb+srv://anilabenny810:Anila123@persual.usrlq.mongodb.net/persual?retryWrites=true&w=majority&appName=Persual";

export async function connectToDatabase() {
   try {    
      if (!databaseURI) {
         console.log('not found');
         
         throw new Error('MONGODB_URI is not defined in the environment variables.');
      }

      await mongoose.connect(databaseURI);
      console.log('MongoDB Connected');
   } catch (err:any) {
      console.error('Error connecting to MongoDB: ' + err.message);
      throw err;
   }
}






