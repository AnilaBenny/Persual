import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { ThumbsUp, ThumbsDown, Ban, Tag } from 'lucide-react';
import axiosInstance from '../AxiosConfig/AxiosConfig';
import { toast } from 'react-toastify';
import { setUser } from '../Redux/slices/UserSlice';

export default () => {
  const location = useLocation();
  const article = location.state;
  const user = useSelector((state:any) => state.user.user);
  const dispatch=useDispatch()
  const [likes, setLikes] = useState(article?.liked.length || 0);
  const [dislikes, setDislikes] = useState(article?.disliked.length || 0);
  const [isBlocked, setIsBlocked] = useState(user?.blockedArticles?.includes(article._id) || false);
  const [userLiked, setUserLiked] = useState(article?.liked.includes(user._id));
  const [userDisliked, setUserDisliked] = useState(article?.disliked.includes(user._id));
  

  useEffect(() => {
    setUserLiked(article?.liked.includes(user._id));
    setUserDisliked(article?.disliked.includes(user._id));
  }, [article, user._id]);

  const handleLike = async () => {
    try {
      await axiosInstance.post(`/likearticle`, { userId: user._id, articleId: article._id });
      setLikes((prevLikes:any) => userLiked ? prevLikes - 1 : prevLikes + 1);
      setUserLiked(!userLiked);
      if (userDisliked) {
        setDislikes((prevDislikes:any) => prevDislikes - 1);
        setUserDisliked(false);
      }
    } catch (error) {
      console.error('Error liking the article:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await axiosInstance.post(`/dislikearticle`, { userId: user._id, articleId: article._id });
      setDislikes((prevDislikes:any) => userDisliked ? prevDislikes - 1 : prevDislikes + 1);
      setUserDisliked(!userDisliked);
      if (userLiked) {
        setLikes((prevLikes:any) => prevLikes - 1);
        setUserLiked(false);
      }
    } catch (error) {
      console.error('Error disliking the article:', error);
    }
  };

  const showConfirmationToast = () => {
    toast.info(
      <div>
        <p>Are you sure you want to block this article?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleConfirmAction}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Yes
          </button>
          <button
            onClick={handleCancelAction}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false, 
        closeOnClick: false,
        draggable: false,
        closeButton: false, 
      }
    );
  };
  const handleConfirmAction = async () => {
    try {
     
      const response=await axiosInstance.post(`/blockarticle`, { userId: user._id, articleId: article._id });
      dispatch(setUser(response.data.user))
      
      setIsBlocked(true);
      toast.dismiss();
      toast.success('Article has been blocked successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    } catch (error) {
      console.error('Error blocking the article:', error);
      toast.error('Failed to block the article.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancelAction = () => {
    toast.dismiss();
    toast.info('Action canceled', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleBlock = () => {
    showConfirmationToast();
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-100 pt-36">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-16 p-8 bg-red-50 border border-red-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Article Blocked</h2>
          <p className="text-red-600">This article has been blocked and is no longer visible to you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={article?.image ? `http://localhost:8080/uploads/${article.image}` : '/default-image.jpg'} 
            alt={article?.name} 
            className="w-full h-64 object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-black text-center pt-7">{article?.name}</h1>
        
        <div className="p-8">
          {!user._id===article.author?(<div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button
                onClick={handleLike}
                disabled={userDisliked}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition duration-200 ${
                  userLiked
                    ? 'bg-green-600 text-white'
                    : userDisliked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <ThumbsUp size={20} />
                <span>{likes}</span>
              </button>
              <button
                onClick={handleDislike}
                disabled={userLiked}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition duration-200 ${
                  userDisliked
                    ? 'bg-red-600 text-white'
                    : userLiked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <ThumbsDown size={20} />
                <span>{dislikes}</span>
              </button>
            </div>
            <button
              onClick={handleBlock}
              className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition duration-200"
            >
              <Ban size={20} />
              <span>Block</span>
            </button>
          </div>):(<div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <button
                disabled
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition duration-200`}
              >
                <ThumbsUp size={20} />
                <span>{likes}</span>
              </button>
              <button
                disabled
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition duration-200 `}
              >
                <ThumbsDown size={20} />
                <span>{dislikes}</span>
              </button>
            </div>

          </div>)}
          
          <div className="flex flex-wrap gap-2 mb-6">
            {article?.tags.map((tag:any, index:any) => (
              <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                <Tag size={14} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">{article?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};