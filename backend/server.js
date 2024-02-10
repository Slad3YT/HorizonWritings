const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());


// Create and connect to the SQLite database
const db = new sqlite3.Database('blogs.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the blogs database.');
});


// Create blogs table
db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

    // Create blogs table
    db.run(`
       CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            content TEXT,
            excerpt TEXT,
            username TEXT, 
            date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
            date_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create comments table
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id INTEGER,
            content TEXT,
            date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(blog_id) REFERENCES blogs(id) ON DELETE CASCADE
        )
    `);
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { fullName, username, password } = req.body;

    // Validate request body
    if (!fullName || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert user into database
    const insertStmt = db.prepare(`
     INSERT INTO users (fullName, username, password)
      VALUES (?, ?, ?)
    `);

    // Insert user into database
    insertStmt.run(fullName, username, password, (err) => {
        if (err) {
            console.error(err.message);
            // Check for unique constraint error
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'User registered successfully' });
    });

    insertStmt.finalize();
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'Login successful' });
    });
});

// Get all blogs
app.get('/api/blogs', (req, res) => {
    db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

// Create a new blog
app.post('/api/blogs', (req, res) => {
    const { title, author, content, excerpt, username } = req.body; // Include username in request body

    if (!title || !author || !content || !excerpt || !username) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertStmt = db.prepare(`
        INSERT INTO blogs (title, author, content, excerpt, username, date_created, date_updated)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    insertStmt.run(title, author, content, excerpt, username, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Blog created successfully' });
    });

    insertStmt.finalize();
});

// Update a blog by ID
app.put('/api/blogs/:id', (req, res) => {
    const { title, content } = req.body;
    const id = req.params.id;

    if (!title && !content) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const updateStmt = db.prepare(`
        UPDATE blogs
        SET title=?, content=?, date_updated=datetime('now')
        WHERE id=?
    `);

    updateStmt.run(title, content, id, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Blog updated successfully' });
    });

    updateStmt.finalize();
});

// Delete a blog by ID
app.delete('/api/blogs/:id', (req, res) => {
    const id = req.params.id;

    const deleteStmt = db.prepare('DELETE FROM blogs WHERE id=?');
    deleteStmt.run(id, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Blog deleted successfully' });
    });

    deleteStmt.finalize();
});

// Get a blog by ID
app.get('/api/blogs/:id', (req, res) => {
    const blogId = req.params.id;

    console.log(`Fetching blog with ID: ${blogId}`);

    db.get('SELECT * FROM blogs WHERE id = ?', [blogId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            console.log(`Blog with ID ${blogId} not found`);
            return res.status(404).json({ error: 'Blog not found' });
        }
        console.log(`Blog with ID ${blogId} found`);
        console.log('Blog details:', row); // Log the blog details
        res.json(row);
    });
});

// Create a comment associated with a specific blog
app.post('/api/blogs/:blogId/comments', (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertStmt = db.prepare(`
        INSERT INTO comments (blog_id, content, date_created)
        VALUES (?, ?, datetime('now'))
    `);

    insertStmt.run(blogId, content, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Comment added successfully' });
    });

    insertStmt.finalize();
});

// Fetch all comments for a specific blog
app.get('/api/blogs/:blogId/comments', (req, res) => {
    const { blogId } = req.params;

    db.all('SELECT * FROM comments WHERE blog_id = ?', [blogId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});