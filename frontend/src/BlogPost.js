import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog, createComment, getCommentsByBlogId } from './blogService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const BlogPost = ({ username }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false); // State to control the visibility of comments
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlogById(id);
        setBlog(blogData);
        // Check if the username matches the blog author's username
        if (blogData && blogData.username === username) {
          setIsAuthorized(true);
        }
      } catch (error) {
        setError(error.message || 'Error fetching blog details');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, username]);

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment(id, { content: commentInput });
      setCommentInput('');
      // Refresh comments after adding a new one
      await fetchBlogComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchBlogComments = async () => {
    try {
      const commentsData = await getCommentsByBlogId(id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = async () => {
    try {
      if (!showComments) {
        await fetchBlogComments();
      }
      setShowComments(!showComments);
    } catch (error) {
      console.error('Error toggling comments:', error);
    }
  };

  return (
    <div className="blog-details">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {blog && (
        <div className="blog-post">
          <h2>{blog.title}</h2>
          <p className="blog-author">By {blog.author}</p>
          <div className="blog-content">{blog.content}</div>
          <p className="blog-dates">
            Created Date: {new Date(blog.date_created).toLocaleString()} | Updated Date: {new Date(blog.date_updated).toLocaleString()}
          </p>
          <br />
          <div className="comment-section">
            <div className="comment-icon" onClick={toggleComments}>
              <FontAwesomeIcon icon={faComment} size="2x" />
              <span>All comments</span>
            </div>
            {showComments && (
              <div className="comments-list">
                {comments.map((comment, index) => (
                  <div key={index} className="comment-card">
                    <div className="comment-card-content">{comment.content}</div>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                placeholder="Write your comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>

          {isAuthorized && (
            <div className="button-container">
              <button onClick={handleDelete} className="delete-button">Delete</button>
              <Link to={`/posts/${id}/edit`} className="update-button">Update</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPost;
