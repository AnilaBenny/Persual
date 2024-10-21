"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.EditArticle = exports.blockArticle = exports.dislikeArticle = exports.likeArticle = exports.getAllArticlesByUsersPreference = exports.getAllArticlesByUser = exports.WriteArticle = exports.ChangePassword = exports.EditProfile = exports.logoutUser = exports.registrationDetails = exports.loginDetails = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const Article_1 = require("../models/Article");
const loginDetails = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User_1.User.findOne({ email });
    if (!existingUser || typeof existingUser.password !== 'string') {
        return res.status(500).json({ message: 'Invalid user data' });
    }
    const verify = await bcryptjs_1.default.compare(password, existingUser.password);
    if (verify) {
        const token = await (0, generateToken_1.default)({ userId: existingUser._id });
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
    }
    else {
        return res.status(404).json({ message: 'Password is not match' });
    }
};
exports.loginDetails = loginDetails;
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message);
    }
};
function sanitizeUser(user) {
    const { password, firstName, lastName, email, phone, articlePreferences, _id, dob, } = user;
    return { firstName, lastName, email, phone, articlePreferences, _id, dob };
}
const registrationDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob, password, confirmPassword, articlePreferences } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User is already registered' });
        }
        const passwordHash = await securePassword(password);
        const user = new User_1.User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: passwordHash,
            dob: dob,
            articlePreferences: articlePreferences
        });
        const createdUser = await user.save();
        const token = await (0, generateToken_1.default)({ userId: createdUser._id });
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
        const sanitizedUser = await sanitizeUser(user);
        console.log(sanitizedUser, 'sanitizedUser');
        res.status(200).json({ message: 'User successfully registered', user: sanitizedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.registrationDetails = registrationDetails;
const logoutUser = (req, res) => {
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
exports.logoutUser = logoutUser;
const EditProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob, preferences } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        existingUser.firstName = firstName || existingUser.firstName;
        existingUser.lastName = lastName || existingUser.lastName;
        existingUser.email = email || existingUser.email;
        existingUser.phone = phone || existingUser.phone;
        existingUser.dob = dob || existingUser.dob;
        existingUser.articlePreferences = preferences || existingUser.articlePreferences;
        existingUser.password = existingUser.password;
        const updatedUser = await existingUser.save();
        const sanitizedUser = await sanitizeUser(updatedUser);
        res.status(200).json({
            message: 'Profile successfully updated',
            user: sanitizedUser,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
exports.EditProfile = EditProfile;
const ChangePassword = async (req, res) => {
    try {
        console.log(req.body);
        const { values, email } = req.body;
        let { currentPassword, newPassword } = values;
        if (!currentPassword || !newPassword || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user || typeof user.password !== 'string') {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'An error occurred while changing the password' });
    }
};
exports.ChangePassword = ChangePassword;
const WriteArticle = async (req, res) => {
    var _a;
    try {
        console.log(req.file, req.body);
        const { name, description, tags, category, author } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        if (!name || !description || !category || !author) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        const newArticle = new Article_1.Article({
            name,
            description,
            tags: tags || [],
            category,
            image: image || '',
            author,
        });
        const savedArticle = await newArticle.save();
        return res.status(200).json({
            message: 'Article successfully created',
            article: savedArticle,
        });
    }
    catch (error) {
        console.error("Error creating article:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.WriteArticle = WriteArticle;
const getAllArticlesByUser = () => { };
exports.getAllArticlesByUser = getAllArticlesByUser;
const getAllArticlesByUsersPreference = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const articles = await Article_1.Article.find({ category: { $in: user.articlePreferences } }).populate('author');
        return res.status(200).json(articles);
    }
    catch (error) {
        console.error('Error fetching articles by user preferences:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.getAllArticlesByUsersPreference = getAllArticlesByUsersPreference;
const likeArticle = async (req, res) => {
    try {
        const { userId, articleId } = req.body;
        const article = await Article_1.Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const isAlreadyLiked = article.liked.includes(userId);
        const isDisliked = article.disliked.includes(userId);
        if (isAlreadyLiked) {
            article.liked = article.liked.filter((id) => id.toString() !== userId);
        }
        else {
            article.liked.push(userId);
            if (isDisliked) {
                article.disliked = article.disliked.filter((id) => id.toString() !== userId);
            }
        }
        await article.save();
        return res.status(200).json({ message: 'Article liked status updated', liked: article.liked.length });
    }
    catch (error) {
        console.error('Error liking article:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.likeArticle = likeArticle;
const dislikeArticle = async (req, res) => {
    try {
        const { userId, articleId } = req.body;
        const article = await Article_1.Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const isAlreadyDisliked = article.disliked.includes(userId);
        const isLiked = article.liked.includes(userId);
        if (isAlreadyDisliked) {
            article.disliked = article.disliked.filter((id) => id.toString() !== userId);
        }
        else {
            article.disliked.push(userId);
            if (isLiked) {
                article.liked = article.liked.filter((id) => id.toString() !== userId);
            }
        }
        await article.save();
        return res.status(200).json({ message: 'Article dislike status updated', disliked: article.disliked.length });
    }
    catch (error) {
        console.error('Error disliking article:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.dislikeArticle = dislikeArticle;
const blockArticle = () => { };
exports.blockArticle = blockArticle;
const EditArticle = () => { };
exports.EditArticle = EditArticle;
const deleteArticle = () => { };
exports.deleteArticle = deleteArticle;
