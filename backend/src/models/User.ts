const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,
    password: '',
    confirmPassword: '',
    articlePreferences: [],
  };


  import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: {
    type: String,
    
  },    lastName: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
 
  },
  phone: {
    type: Number,
  },

  articlePreferences: {
    type: [String], 
    default: [],
  },
  blockedArticles:{
type:[{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User', 
  required: true,
}],
default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = model('User', userSchema);

export {
  User
};