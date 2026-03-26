require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public routes
app.use('/api/authors', require('./routers/authors.routes'));
app.use('/api/stories', require('./routers/stories.routes'));
app.use('/api/tags', require('./routers/tags.routes'));
app.use('/api/collections', require('./routers/collections.routes'));
app.use('/api/search', require('./routers/search.routes'));

// Admin routes
app.use('/api/admin', require('./routers/admin/auth.routes'));
app.use('/api/admin/authors', auth, require('./routers/admin/authors.routes'));
app.use('/api/admin/stories', auth, require('./routers/admin/stories.routes'));
app.use('/api/admin/tags', auth, require('./routers/admin/tags.routes'));
app.use('/api/admin/collections', auth, require('./routers/admin/collections.routes'));
app.use('/api/admin/dashboard', auth, require('./routers/admin/dashboard.routes'));

app.use(errorHandler);

module.exports = app;
