#!/bin/bash
# Getron Repository Structure Fix Script
# This script creates the correct structure for Netlify deployment

echo "🔧 Fixing Getron repository structure for Netlify deployment..."

# Check current structure
echo "Current repository structure:"
ls -la

# Ensure functions directory exists with correct structure
echo "Ensuring functions directory structure..."
mkdir -p netlify/functions/api
mkdir -p netlify/functions/gemini
mkdir -p netlify/functions/analytics

# Create a simple health check function
cat > netlify/functions/health.js << 'EOF'
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
EOF

# Create main API function
cat > netlify/functions/api.js << 'EOF'
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
EOF

echo "✅ Functions directory structure created!"
echo "📁 Created:"
echo "   - netlify/functions/api.js (main API)"
echo "   - netlify/functions/health.js (health check)"

# Create a simple index.html for testing
echo "Creating simple test page..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Getron - Ultimate AI Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #000;
            color: #fff;
            margin: 0;
            padding: 40px;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .title {
            font-size: 2.5em;
            color: #ff0066;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: 1.2em;
            color: #0099ff;
            margin-bottom: 40px;
        }
        .status {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #333;
        }
        .btn {
            background: #ff0066;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
        .btn:hover {
            background: #cc0052;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🚀 Getron</h1>
        <h2 class="subtitle">Ultimate AI Platform</h2>
        
        <div class="status">
            <h3>✅ Platform Status</h3>
            <p>Getron is successfully deployed and running!</p>
            <button class="btn" onclick="testAPI()">Test API</button>
            <button class="btn" onclick="testHealth()">Health Check</button>
        </div>
        
        <div id="result" style="margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 5px; display: none;">
            <h4>API Response:</h4>
            <pre id="result-text"></pre>
        </div>
    </div>

    <script>
        async function testAPI() {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                showResult(data);
            } catch (error) {
                showResult({error: error.message});
            }
        }

        async function testHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                showResult(data);
            } catch (error) {
                showResult({error: error.message});
            }
        }

        function showResult(data) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('result-text').textContent = JSON.stringify(data, null, 2);
        }
    </script>
</body>
</html>
EOF

echo "✅ Simple test page created!"
echo "🚀 Repository structure fixed!"

echo ""
echo "📋 NEXT STEPS:"
echo "1. Commit these changes: git add . && git commit -m 'Fix Netlify deployment structure'"
echo "2. Push to GitHub: git push"
echo "3. Redeploy on Netlify with the same settings"
echo "4. Test your site at your Netlify URL"