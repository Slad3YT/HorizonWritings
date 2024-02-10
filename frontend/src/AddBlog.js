import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from './blogService';

const AddBlog = ({ username }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!author || !title || !blogContent) {
      setError('Please fill in all fields');
      return; // Don't proceed further if any field is empty
    }
    
    try {
      const description = blogContent.length > 225 ? blogContent.substring(0, 225) + '...' : blogContent;
      await createBlog({ author, title, excerpt: description, content: blogContent,username  });
      console.log('Blog created successfully');
      alert(`Blog by ${author} successfully created!`);
      navigate('/');
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className="create">
      <form onSubmit={handleSubmit} className="addBlog">
        <h2>Add a New Blog</h2>
        
        <br />
        <label htmlFor="author">Author: </label>
        <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} /><br /><br />
        <label htmlFor="title">Title: </label>
        <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} /><br /><br />
        <label htmlFor="blogContent">Blog:</label>
        <textarea id="blogContent" name="blogContent" rows="4" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} /><br />
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <button type="submit" className="button">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;