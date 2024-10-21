import mongoose, { Schema, model } from 'mongoose';


const articleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    default: [],
  },
  category: {
    type: String,
    enum: ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'], // Enum for category
    required: true,
  },
  image: {
    type: String
  },
  liked:{
    type:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      }],
      default:[]
  },
  disliked:{
    type:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      }],
      default:[]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  Blocked:{
    type:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      }],
      default:[]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


articleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});


const Article = model('Article', articleSchema);

export {
  Article
};
