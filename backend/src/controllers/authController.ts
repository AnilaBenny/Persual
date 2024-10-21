import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import generateToken,{verifyToken} from '../utils/generateToken';
import { Article } from '../models/Article';

export const loginDetails = async (req: Request, res: Response): Promise<any>=> {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (!existingUser || typeof existingUser.password !== 'string') {
        return res.status(500).json({ message: 'Invalid user data' });
    }
    const verify = await bcrypt.compare(password, existingUser.password);
    
    if (verify) {
        const token = await generateToken({ userId: existingUser._id });
        
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000
        });

        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const sanitizedUser = await sanitizeUser(existingUser);
        console.log(sanitizedUser, 'sanitizedUser');

        res.status(200).json({ message: 'User successfully registered', user: sanitizedUser });
    } else {
        return res.status(404).json({ message: 'Password is not match' });
    }
};

const securePassword = async (password:string) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error:any) {
        console.log(error.message);
    }
};

function sanitizeUser(user:any) {
    const {password,firstName,lastName,email,phone,articlePreferences,_id,dob,}=user    
    return {firstName,lastName,email,phone,articlePreferences,_id,dob}
  }

export const registrationDetails = async (req: Request, res: Response) => {
  try {    
    const { firstName,
        lastName,
        email,       
        phone,
        dob,
        password,
        confirmPassword,
        articlePreferences } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(409).json({ message: 'User is already registered' });
    }
    const passwordHash = await securePassword(password);
    const user=new User({
        firstName:firstName,
        lastName:lastName,
        email:email,
        phone:phone,
        password:passwordHash,
        dob:dob,
        articlePreferences:articlePreferences
    })
    const createdUser=await user.save()
    const token=await generateToken({userId:createdUser._id});
    res.cookie('accessToken',token.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000 
      });
  
      res.cookie('refreshToken',token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      
      const sanitizedUser = await sanitizeUser(user);
      console.log(sanitizedUser,'sanitizedUser');
      
     res.status(200).json({ message: 'User successfully registered',user:sanitizedUser});
     
    
  } catch (error:any) {
    
     res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
      });
  
    res.status(200).json({ message: 'Logout successful' });
  };

  export const EditProfile = async (req: Request, res: Response): Promise<any> => {
    try { 
      const { firstName, lastName, email, phone, dob, preferences } = req.body;
  
      const existingUser = await User.findOne({email});
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    
      existingUser.firstName = firstName || existingUser.firstName;
      existingUser.lastName = lastName || existingUser.lastName;
      existingUser.email = email || existingUser.email;
      existingUser.phone = phone || existingUser.phone;
      existingUser.dob = dob || existingUser.dob;
      existingUser.articlePreferences = preferences || existingUser.articlePreferences;
      existingUser.password = existingUser.password ;
      
  
      const updatedUser = await existingUser.save();
  

      const sanitizedUser = await sanitizeUser(updatedUser);

      res.status(200).json({
        message: 'Profile successfully updated',
        user: sanitizedUser,
      });
  
    } catch (err: any) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };

  export const ChangePassword = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
      const { values, email } = req.body;
      let {currentPassword,newPassword}=values


  
      if (!currentPassword || !newPassword || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  

      const user = await User.findOne({ email });
      if (!user || typeof user.password !== 'string') {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
  

      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password must be different from the current password' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
 
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'An error occurred while changing the password' });
    }
  };

  export const WriteArticle = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.file,req.body);
      const { name, description, tags, category, author } = req.body;
      const image=req.file?.filename;
      
      
  
      if (!name || !description || !category || !author) {
         res.status(400).json({ message: "All required fields must be provided" });
      }
  
     
      const newArticle = new Article({
        name,
        description,
        tags: tags || [], 
        category,
        image: image || '', 
        author, 
      });
  
      const savedArticle = await newArticle.save();
  
       res.status(200).json({
        message: 'Article successfully created',
        article: savedArticle,
      });
    } catch (error:any) {
      console.error("Error creating article:", error);
      
       res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

  export const getAllArticlesByUser=async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;
  
      if (!userId) {
         res.status(400).json({ message: 'User ID is required' });
      }
      const articles = await Article.find({ author: userId });
  
      if (articles.length === 0) {
         res.status(404).json({ message: 'No articles found for this user' });
      }
  
       res.status(200).json({ message: 'Articles retrieved successfully', articles });
    } catch (error) {
      console.error('Error retrieving articles:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const getAllArticlesByUsersPreference = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const articles = await Article.find({ category: { $in: user.articlePreferences } }).populate('author');
 
      return res.status(200).json(articles);
      
    } catch (error) {
      console.error('Error fetching articles by user preferences:', error);
 
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };
  export const likeArticle = async (req: Request, res: Response)=> {
    try {
      const {userId,articleId} = req.body;
  
      const article :any = await Article.findById(articleId);
  
      if (!article) {
         res.status(404).json({ message: 'Article not found' });
      }
      const isAlreadyLiked = article.liked.includes(userId);
      const isDisliked = article.disliked.includes(userId);
  
      if (isAlreadyLiked) {
        article.liked = article.liked.filter((id:any) => id.toString() !== userId);
      } else {
        article.liked.push(userId);
  
        if (isDisliked) {
          article.disliked = article.disliked.filter((id:any) => id.toString() !== userId);
        }
      }
  
      await article.save(); 
  
       res.status(200).json({ message: 'Article liked status updated', liked: article.liked.length });
  
    } catch (error) {
      console.error('Error liking article:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const dislikeArticle = async (req: Request, res: Response)=> {
    try {
      const {userId,articleId} = req.body;
  
      const article:any = await Article.findById(articleId);
  
      if (!article) {
         res.status(404).json({ message: 'Article not found' });
      }
      const isAlreadyDisliked = article.disliked.includes(userId);
      const isLiked = article.liked.includes(userId);
  
      if (isAlreadyDisliked) {
        article.disliked = article.disliked.filter((id:any) => id.toString() !== userId);
      } else {
        article.disliked.push(userId);
        if (isLiked) {
          article.liked = article.liked.filter((id:any) => id.toString() !== userId);
        }
      }
  
      await article.save(); 
  
       res.status(200).json({ message: 'Article dislike status updated', disliked: article.disliked.length });
  
    } catch (error) {
      console.error('Error disliking article:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const blockArticle=async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, articleId } = req.body;

      const user = await User.findById(userId);
      const article = await Article.findById(articleId);
  
      if (!user || !article) {
        res.status(404).json({ message: 'User or Article not found' });
        return;
      }
  
      const isAlreadyBlocked = user.blockedArticles.includes(articleId);
  
      if (isAlreadyBlocked) {
        user.blockedArticles = user.blockedArticles.filter(
          (id) => id.toString() !== articleId.toString()
        );
        article.Blocked = article.Blocked.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        user.blockedArticles.push(articleId);
        article.Blocked.push(userId);
      }
  
      await user.save();
      await article.save();
  
      res.status(200).json({
        message: isAlreadyBlocked ? 'Article unblocked' : 'Article blocked',
        isBlocked: !isAlreadyBlocked,
        user:user
      });
    } catch (error) {
      console.error('Error blocking/unblocking article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  export const EditArticle = async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, description, tags, category, author, articleId } = req.body;
      const image = req.file ? req.file.filename : null; 
  
     
      const existingArticle = await Article.findById(articleId);
      
      if (!existingArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      
      existingArticle.name = name || existingArticle.name;
      existingArticle.description = description || existingArticle.description;
      existingArticle.tags = tags || existingArticle.tags;
      existingArticle.category = category || existingArticle.category;
      
    
      if (author) {
        const authorExists = await User.findById(author);
        if (!authorExists) {
          return res.status(404).json({ message: 'Author not found' });
        }
        existingArticle.author = author;
      }

      if (image) {
        existingArticle.image = image; 
      }
  
     
      const updatedArticle = await existingArticle.save();
  
 
      res.status(200).json({
        message: 'Article successfully updated',
        article: updatedArticle,
      });
  
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  export const deleteArticle = async(req: Request, res: Response): Promise<any> => {
    const { articleId } = req.params; 
  
    try {
      const deletedArticle = await Article.findByIdAndDelete(articleId);
  
      if (!deletedArticle) {
         res.status(404).json({ message: 'Article not found' });
      }
      await User.updateMany(
        { blockedArticles: articleId }, 
        { $pull: { blockedArticles: articleId } } 
      );

  
      res.status(200).json({ message: 'Article deleted and users updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  