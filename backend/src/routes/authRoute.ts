import express from 'express';  
import { loginDetails,logoutUser,registrationDetails,EditProfile,ChangePassword,WriteArticle,
    EditArticle,
    deleteArticle,
    likeArticle,
    dislikeArticle,
    getAllArticlesByUser,
    getAllArticlesByUsersPreference,
    blockArticle
} from '../controllers/authController';
import upload from '../utils/Multer';
const authRoute=express.Router();

authRoute.post('/login',loginDetails);
authRoute.post('/register',registrationDetails);
authRoute.get('/logout',logoutUser);
authRoute.put('/editprofile',EditProfile);
authRoute.post('/changepassword',ChangePassword);
authRoute.post('/writearticle',upload.single('image') ,WriteArticle);
authRoute.put('/editarticle',upload.single('image') ,EditArticle);
authRoute.delete('/deletearticle/:articleId',deleteArticle);
authRoute.post('/likearticle',likeArticle);
authRoute.post('/dislikearticle',dislikeArticle);
authRoute.post('/userarticles',getAllArticlesByUser);
authRoute.post('/blockarticle',blockArticle);
authRoute.post('/prefferedarticle',getAllArticlesByUsersPreference);


export default authRoute;