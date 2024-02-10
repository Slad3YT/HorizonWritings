import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Content from './Content';
import UpdateBlog from './UpdateBlog';
import AddBlog from './AddBlog';
import BlogPost from './BlogPost';
import Login from './Login';
import Register from './Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        username={username}
        setUsername={setUsername} // Pass setUsername to AppContent
      />
    </Router>
  );
}

function AppContent({ isLoggedIn, setIsLoggedIn, username, setUsername }) {
  const location = useLocation();
  const showNavbarFooter = !['/login', '/register'].includes(location.pathname);
  
  return (
    <div className="App">
      {showNavbarFooter && <Navbar isLoggedIn={isLoggedIn} />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Content />} />
          {/* Pass setUsername prop to AddBlog */}
          <Route path="/create" element={<AddBlog username={username} />} />
          <Route path="/posts/:id" element={<BlogPost username={username} />} />
          <Route path="/posts/:id/edit" element={<UpdateBlog />} />
          {/* Pass setUsername prop to Login */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      {showNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
