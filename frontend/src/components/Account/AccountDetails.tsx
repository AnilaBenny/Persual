import  { useState, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash, FaThumbsUp, FaLock } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import {   useSelector } from 'react-redux';
import axiosInstance from '../../AxiosConfig/AxiosConfig';
import Navbar from '../Navbar/Navbar';
import { PenTool } from 'lucide-react';
import ProfileEdit from './ProfileEdit';
import { ChangePassword } from '../../ApiService/ApiService';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import EditArticleModal from '../EditArticleModal/EditArticleModal';

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [newArticleModalOpen, setNewArticleModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    name: '',
    description: '',
    tags: '',
    category: '',
    images: []
  });
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const navigate = useNavigate();
  const user = useSelector((state:any) => state.user.user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.post('/userarticles',{userId:user._id});
      const userPosts = response.data.articles;
      setPosts(userPosts);
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setProfileEditOpen(true);
  };

  const handleEdit = (item:any) => {
    setEditingItem(item);
    setEditModalOpen(true);
    setShowOptions(null);
  };

  const handleShowOptions = (postId:any) => {
    setShowOptions((prevId) => (prevId === postId ? null : postId));
  };
  const showConfirmationToast = (id:any) => {
    toast.info(
      <div>
        <p>Are you sure you want to block this article?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={()=>handleConfirmAction(id)}
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
  const handleConfirmAction = async (id:any) => {
    try {
 
    await axiosInstance.delete(`/deletearticle/${id}`);
    const updatedPosts = posts.filter((post:any) => post._id !== id);
    setPosts(updatedPosts);
    setShowOptions(null);

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
      console.error('Error deleting the article:', error);
      toast.error('Failed to delete the article.', {
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
  const handleDelete = async (id:any) => {
      showConfirmationToast(id);
  };

  const handleSaveEdit = async (editedItem:any) => {
    const formData = new FormData();
    formData.append('name', editedItem.name);
    formData.append('description', editedItem.description);
    formData.append('tags', editedItem.tags);
    formData.append('category',editedItem.category)
    formData.append('articleId',editedItem.articleId)
    if (editedItem.image) {
      formData.append('image', editedItem.image);
    }

    const response=await axiosInstance.put('/editarticle', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const updatedArticle = response.data.article;

    setPosts((prevPosts:any) =>
      prevPosts.map((post:any) =>
        post._id === editedItem.articleId ? updatedArticle : post
      )
    );

  };
  




  const handleNewArticle = () => {
    setNewArticleModalOpen(true);
  };

  const handleSaveNewArticle = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newArticle.name);
      formData.append('description', newArticle.description);
      formData.append('tags', newArticle.tags);
      formData.append('category', newArticle.category);
      newArticle.images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await axiosInstance.post('/api/auth/createArticle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
//@ts-ignore
      setPosts([response.data, ...posts]);
      setNewArticleModalOpen(false);
      setNewArticle({
        name: '',
        description: '',
        tags: '',
        category: '',
        images: []
      });
    } catch (error) {
      console.log('Error creating new article:', error);
    }
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
  };

 

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmNewPassword: Yup.string()
  //@ts-ignore
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});



const handleSavePassword = async () => {
    try {
      await passwordValidationSchema.validate(passwordData, { abortEarly: false });

      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const response = await ChangePassword(passwordData,user.email);
      
      if (response?.status === 200) {
        setChangePasswordOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        toast.success('Password changed successfully');
      }else{
        if(response?.data.message){
        toast.error(response?.data.message);}
      }
    } catch (error:any) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err:any) => toast.error(err)); 
      } else {
        console.log('Error changing password:', error);
        toast.error('Password update failed');
      }
    }
  };
  

  const getInitials = (name:string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1">
            <div className="relative mb-6">
              <img
                src="/bg.jpg"
                alt="Cover"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(`${user?.firstName} ${user?.lastName}`)}
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Phone:</span>
                <span>{user?.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Interests:</span>
                <span>{user?.articlePreferences?.join(', ')}</span>
                </div>

            </div>
            <div className="mt-8 space-y-4">
              <button
                onClick={handleEditProfile}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={handleChangePassword}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300 flex items-center justify-center"
              >
                <FaLock className="mr-2" /> Change Password
              </button>
            </div>
          </div>

          {/* Articles Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Articles</h2>
                <NavLink
                  to="/write"
                  onClick={handleNewArticle}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
                >
                  <PenTool className="mr-2" size={18} />
                  Write New Article
                </NavLink>
              </div>
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No Articles available.</p>
                </div>
              ) : (
                posts.map((post:any) => (
                  <div
                  key={post._id}
                  className="bg-white p-6 rounded-lg shadow-md mb-6 relative"
                  
                  style={{ cursor: 'pointer' }}  
                >
                    <div className="absolute top-4 right-4" >
                      <button onClick={() => handleShowOptions(post._id)} className="text-gray-500 hover:text-gray-700">
                        <FaEllipsisV />
                      </button>
                      {showOptions === post._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEdit(post)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaEdit className="inline mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaTrash className="inline mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div onClick={() => navigate('/article', { state: post })} >
                    <h3 className="text-xl font-semibold mb-2" >{post.name}</h3>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                       
                          <FaThumbsUp className="mr-2" />
                          <span>{post.liked.length || 0} Likes</span>
                      
                      </div>
                      <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
<ProfileEdit  profileEditOpen={profileEditOpen} setProfileEditOpen={setProfileEditOpen} editedUser={editedUser} />


      {/* Edit Article Modal */}
<EditArticleModal editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} editingItem={editingItem} handleSaveEdit={handleSaveEdit} />


      {/* New Article Modal */}
      {newArticleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create New Article</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Article Name</label>
              <input
                type="text"
                id="name"
                value={newArticle.name}
                onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={newArticle.description}
                onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              //@ts-ignore
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                id="tags"
                value={newArticle.tags}
                onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                value={newArticle.category}
                onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                id="images"
                multiple
                //@ts-ignore
                onChange={(e) => setNewArticle({ ...newArticle, images: Array.from(e.target.files) })}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setNewArticleModalOpen(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewArticle}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setChangePasswordOpen(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}