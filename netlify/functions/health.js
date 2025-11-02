// Simple health check function for debugging
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      message: 'Getron Netlify Functions are working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      functions_path: '/netlify/functions/'
    })
  };
};
