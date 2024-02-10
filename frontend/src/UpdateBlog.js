import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importing useParams hook from React Router
import { updateBlog, getBlogById } from './blogService';

const UpdateBlog = () => {
  const { id } = useParams(); // Accessing the id parameter from URL

  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogById(id);
        setBlogData({
          title: blog.title,
          content: blog.content,
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(id, blogData);
      alert('Blog updated successfully!');
      // You can redirect or perform any other action upon successful update
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div className='updateBlog-co'>
      <h2>Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={blogData.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <button className="updateBlog"type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default UpdateBlog;
