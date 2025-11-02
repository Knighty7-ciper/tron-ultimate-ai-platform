// Simple routes module for Netlify Functions
// This module is deprecated - all routing is now handled in index.js
// Kept for compatibility but returns a simple object

module.exports = {
  status: 'routes-handled-inline',
  message: 'All routing logic has been moved to index.js for simplified Netlify Functions',
  timestamp: new Date().toISOString()
};