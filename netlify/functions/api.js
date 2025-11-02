// Main API function for Getron platform
exports.handler = async (event, context) => {
  const path = event.path;
  const method = event.httpMethod;
  
  // Handle different API paths
  if (path === '/api/health' || path === '/health') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'healthy',
        platform: 'Getron - Ultimate AI Platform',
        message: 'Platform is running!',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        services: {
          gemini: 'available',
          supabase: 'configured'
        }
      })
    };
  }
  
  if (path === '/api' || path === '/') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        name: 'Getron - Ultimate AI Platform',
        version: '2.0.0',
        message: 'All systems operational!',
        endpoints: {
          health: '/api/health',
          gemini: '/api/gemini',
          analytics: '/api/analytics'
        },
        timestamp: new Date().toISOString()
      })
    };
  }
  
  // Default response for other endpoints
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ready',
      message: 'Getron platform is ready!',
      path: path,
      method: method,
      timestamp: new Date().toISOString()
    })
  };
};
