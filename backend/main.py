"""
TRON ULTIMATE AI PLATFORM - BACKEND SERVER
Pure class FastAPI application
No emojis, professional architecture, high-class design
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import logging
from datetime import datetime
import sys

# Import API routers
from api_router import router as ultimate_ai_router
from supabase_database_manager import initialize_database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('tron_ai_backend.log')
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# APPLICATION SETUP
# =============================================================================

def create_app() -> FastAPI:
    """Create and configure the TRON Ultimate AI FastAPI application"""
    
    # Initialize FastAPI app
    app = FastAPI(
        title="Getron - Ultimate AI Platform",
        description="Pure class AI agent platform with 8 specialized Gemini models",
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )
    
    # Add middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # =============================================================================
    # ROUTER REGISTRATION
    # =============================================================================
    
    # Register Ultimate AI router
    app.include_router(
        ultimate_ai_router,
        prefix="/api/ultimate-ai",
        tags=["ultimate-ai"]
    )
    
    # =============================================================================
    # ROOT AND STATUS ENDPOINTS
    # =============================================================================
    
    @app.get("/")
    async def root():
        """Root endpoint with platform information"""
        return {
            "platform": "TRON Ultimate AI Platform",
            "version": "2.0.0",
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "capabilities": 8,
            "models": [
                "gemini-2.5-flash",
                "gemini-2.5-flash-image",
                "gemini-2.5-pro",
                "gemini-2.5-computer-use-preview",
                "gemini-2.5-flash-native-audio-preview",
                "gemini-2.5-pro-thinking"
            ]
        }
    
    @app.get("/health")
    async def health_check():
        """Comprehensive health check endpoint"""
        try:
            # Check environment variables
            required_env_vars = ["GEMINI_API_KEY"]
            missing_vars = [var for var in required_env_vars if not os.getenv(var)]
            
            health_status = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "version": "2.0.0",
                "environment": {
                    "variables": "configured" if not missing_vars else "missing",
                    "missing_variables": missing_vars
                },
                "api_endpoints": {
                    "ultimate_ai": "/api/ultimate-ai",
                    "docs": "/docs",
                    "health": "/health"
                }
            }
            
            if missing_vars:
                health_status["status"] = "configuration_error"
                health_status["message"] = f"Missing environment variables: {', '.join(missing_vars)}"
            
            return health_status
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")
    
    @app.get("/api/status")
    async def api_status():
        """API status and capabilities overview"""
        return {
            "api_status": "operational",
            "endpoints": {
                "ultimate_ai": {
                    "base_url": "/api/ultimate-ai",
                    "endpoints": [
                        "POST /generate-image",
                        "POST /research-web", 
                        "POST /execute-code",
                        "POST /control-browser",
                        "POST /create-file",
                        "POST /live-interaction",
                        "POST /execute-workflow",
                        "GET /analytics",
                        "GET /capabilities"
                    ]
                }
            },
            "capabilities": {
                "image_generation": "gemini-2.5-flash-image",
                "web_research": "gemini-2.5-pro with Google Search",
                "code_execution": "Python sandbox",
                "browser_control": "gemini-2.5-computer-use-preview",
                "file_creation": "Multi-format support",
                "live_interactions": "Real-time voice/video",
                "analytics": "System monitoring and performance",
                "workflows": "Multi-task automation"
            },
            "timestamp": datetime.now().isoformat()
        }
    
    # =============================================================================
    # ERROR HANDLERS
    # =============================================================================
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Custom HTTP exception handler"""
        logger.warning(f"HTTP {exc.status_code} error: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "status_code": exc.status_code,
                "detail": exc.detail,
                "timestamp": datetime.now().isoformat(),
                "path": str(request.url.path)
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """General exception handler for unhandled errors"""
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "status_code": 500,
                "detail": "Internal server error",
                "timestamp": datetime.now().isoformat(),
                "path": str(request.url.path)
            }
        )
    
    # =============================================================================
    # STARTUP AND SHUTDOWN EVENTS
    # =============================================================================
    
    @app.on_event("startup")
    async def startup_event():
        """Application startup event"""
        logger.info("TRON Ultimate AI Platform starting up...")
        logger.info("Loading Ultimate AI capabilities...")
        
        # Verify environment setup
        if not os.getenv("GEMINI_API_KEY"):
            logger.warning("GEMINI_API_KEY not found in environment variables")
        else:
            logger.info("GEMINI_API_KEY configured successfully")
        
        # Initialize database connection
        try:
            await initialize_database()
            logger.info("Database connection established")
        except Exception as e:
            logger.warning(f"Database initialization failed: {e}")
            logger.info("Continuing without database integration")
        
        logger.info("TRON Ultimate AI Platform startup complete")
        logger.info("Available endpoints:")
        logger.info("  - / (Platform information)")
        logger.info("  - /health (Health check)")
        logger.info("  - /api/status (API status)")
        logger.info("  - /api/ultimate-ai/* (Ultimate AI capabilities)")
        logger.info("  - /docs (API documentation)")
    
    @app.on_event("shutdown")
    async def shutdown_event():
        """Application shutdown event"""
        logger.info("TRON Ultimate AI Platform shutting down...")
        logger.info("Cleanup complete")
    
    return app

# =============================================================================
# APPLICATION INSTANCE
# =============================================================================

app = create_app()

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    # Start server
    logger.info(f"Starting TRON Ultimate AI Platform server on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    logger.info(f"Auto-reload: {reload}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        debug=debug,
        reload=reload,
        log_level="info",
        access_log=True
    )