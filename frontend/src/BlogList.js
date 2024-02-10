import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readBlogs } from './blogService';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch blog posts when the component mounts
    const fetchBlogs = async () => {
      try {
        const blogPosts = await readBlogs();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []); // Empty dependency array to ensure it only runs once on mount

  return (
    <div className="blog-list">
      <h1>All Blog Posts</h1>
      <br />
      {posts.map((post) => (
        <div key={post.id} className="blog-post-preview">
          <Link to={`/posts/${post.id}`}>
            <h3>{post.title}</h3>
            <p>By {post.author}</p>
            <br />
            <p>{post.excerpt}</p>
            <span>Read More</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
