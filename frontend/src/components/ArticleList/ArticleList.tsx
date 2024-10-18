import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecommendedArticles = () => {
  const navigate = useNavigate();
  
  // Mock data for recommended articles
  const articles = [
    { id: 1, title: "10 Tips for Effective Reading", author: "John Doe" },
    { id: 2, title: "The Benefits of Daily Reading", author: "Jane Smith" },
    { id: 3, title: "How to Choose Your Next Book", author: "Alice Johnson" },
    { id: 4, title: "Understanding Different Literary Genres", author: "Bob Wilson" },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Recommended Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600">By {article.author}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/article')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            See More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedArticles;