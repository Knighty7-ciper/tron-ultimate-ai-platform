"""
TRON ULTIMATE AI API ROUTER
Pure class API endpoints for all AI capabilities
No emojis, professional naming, high-class design
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
import os
from pathlib import Path
import uuid

from ultimate_gemini_engine import TRONGeminiEngine, EngineCapabilities

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router and engine
router = APIRouter(prefix="/api/ultimate-ai", tags=["ultimate-ai"])
tron_engine = TRONGeminiEngine()

# CORS middleware for cross-origin requests
router.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# REQUEST MODELS
# =============================================================================

class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., description="Image generation prompt")
    config: Optional[Dict[str, Any]] = Field(default=None, description="Additional configuration")

class WebResearchRequest(BaseModel):
    query: str = Field(..., description="Research query")
    context: Optional[str] = Field(default=None, description="Additional context")

class CodeExecutionRequest(BaseModel):
    code: str = Field(..., description="Code to execute")
    language: str = Field(default="python", description="Programming language")
    context: Optional[str] = Field(default=None, description="Additional context")

class BrowserControlRequest(BaseModel):
    task_description: str = Field(..., description="Browser automation task")
    url: Optional[str] = Field(default=None, description="Target URL")

class FileCreationRequest(BaseModel):
    content: str = Field(..., description="File content")
    filename: str = Field(..., description="File name without extension")
    format: str = Field(default="txt", description="File format")

class LiveInteractionRequest(BaseModel):
    interaction_type: str = Field(..., description="Type of interaction: audio, video, text")
    data: Dict[str, Any] = Field(..., description="Interaction data")

class WorkflowRequest(BaseModel):
    workflow_description: str = Field(..., description="Workflow description")
    tasks: List[Dict[str, Any]] = Field(..., description="Tasks to execute")

# =============================================================================
# CORE API ENDPOINTS
# =============================================================================

@router.get("/status")
async def get_system_status():
    """Get comprehensive system status and health"""
    try:
        analytics = tron_engine.get_system_analytics()
        capabilities = tron_engine.get_capability_info()
        
        return {
            "system": "operational",
            "timestamp": datetime.now().isoformat(),
            "analytics": analytics,
            "capabilities": capabilities,
            "uptime": "active"
        }
    except Exception as e:
        logger.error(f"Status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"System status check failed: {str(e)}")

@router.get("/capabilities")
async def get_capabilities():
    """Get detailed information about available capabilities"""
    try:
        return tron_engine.get_capability_info()
    except Exception as e:
        logger.error(f"Capabilities retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Capabilities retrieval failed: {str(e)}")

@router.post("/generate-image")
async def generate_image(request: ImageGenerationRequest):
    """Generate professional images using Gemini 2.5 Flash Image"""
    try:
        logger.info(f"Image generation request: {request.prompt[:100]}...")
        result = await tron_engine.generate_image(
            prompt=request.prompt,
            config=request.config
        )
        return result
    except Exception as e:
        logger.error(f"Image generation API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

@router.post("/research-web")
async def research_web(request: WebResearchRequest):
    """Conduct real-time web research with Google Search grounding"""
    try:
        logger.info(f"Web research request: {request.query[:100]}...")
        result = await tron_engine.research_web(
            query=request.query,
            context=request.context
        )
        return result
    except Exception as e:
        logger.error(f"Web research API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Web research failed: {str(e)}")

@router.post("/execute-code")
async def execute_code(request: CodeExecutionRequest):
    """Execute code in Python sandbox environment"""
    try:
        logger.info(f"Code execution request: {request.language}, length: {len(request.code)}")
        result = await tron_engine.execute_code(
            code=request.code,
            language=request.language,
            context=request.context
        )
        return result
    except Exception as e:
        logger.error(f"Code execution API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Code execution failed: {str(e)}")

@router.post("/control-browser")
async def control_browser(request: BrowserControlRequest):
    """Control web browsers using Computer Use model"""
    try:
        logger.info(f"Browser control request: {request.task_description[:100]}...")
        result = await tron_engine.control_browser(
            task_description=request.task_description,
            url=request.url
        )
        return result
    except Exception as e:
        logger.error(f"Browser control API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Browser control failed: {str(e)}")

@router.post("/create-file")
async def create_file(request: FileCreationRequest):
    """Create and save files in any format"""
    try:
        logger.info(f"File creation request: {request.filename}.{request.format}")
        result = await tron_engine.create_file(
            content=request.content,
            filename=request.filename,
            format_type=request.format
        )
        return result
    except Exception as e:
        logger.error(f"File creation API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File creation failed: {str(e)}")

@router.post("/live-interaction")
async def live_interaction(request: LiveInteractionRequest):
    """Handle real-time voice/video interactions"""
    try:
        logger.info(f"Live interaction request: {request.interaction_type}")
        result = await tron_engine.live_interaction(
            interaction_type=request.interaction_type,
            data=request.data
        )
        return result
    except Exception as e:
        logger.error(f"Live interaction API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Live interaction failed: {str(e)}")

@router.post("/execute-workflow")
async def execute_workflow(request: WorkflowRequest):
    """Execute multi-task workflows combining all capabilities"""
    try:
        logger.info(f"Workflow execution request: {request.workflow_description[:100]}...")
        result = await tron_engine.execute_workflow(
            workflow_description=request.workflow_description,
            tasks=request.tasks
        )
        return result
    except Exception as e:
        logger.error(f"Workflow execution API failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

# =============================================================================
# FILE DOWNLOAD ENDPOINTS
# =============================================================================

@router.get("/download/{filename}")
async def download_file(filename: str):
    """Download generated files"""
    try:
        temp_dir = Path(tempfile.gettempdir()) / "tron_ai_files"
        file_path = temp_dir / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='application/octet-stream'
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File download failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File download failed: {str(e)}")

# =============================================================================
# ANALYTICS AND MONITORING ENDPOINTS
# =============================================================================

@router.get("/analytics")
async def get_system_analytics():
    """Get comprehensive system analytics and monitoring data"""
    try:
        return tron_engine.get_system_analytics()
    except Exception as e:
        logger.error(f"Analytics retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analytics retrieval failed: {str(e)}")

@router.get("/analytics/capabilities-usage")
async def get_capability_usage():
    """Get detailed capability usage statistics"""
    try:
        analytics = tron_engine.get_system_analytics()
        return {
            "capability_usage": analytics["capability_usage"],
            "total_requests": analytics["total_requests"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Capability usage retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Capability usage retrieval failed: {str(e)}")

@router.get("/analytics/performance")
async def get_performance_metrics():
    """Get detailed performance metrics"""
    try:
        analytics = tron_engine.get_system_analytics()
        return {
            "performance_metrics": analytics["performance_metrics"],
            "error_rate": analytics["error_rate"],
            "uptime_seconds": analytics["uptime_seconds"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Performance metrics retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Performance metrics retrieval failed: {str(e)}")

@router.get("/analytics/models-status")
async def get_models_status():
    """Get status of all AI models"""
    try:
        capabilities = tron_engine.get_capability_info()
        return {
            "models_status": capabilities["models_status"],
            "capabilities_status": capabilities["capabilities"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Models status retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Models status retrieval failed: {str(e)}")

# =============================================================================
# UPLOAD ENDPOINTS
# =============================================================================

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads for processing"""
    try:
        # Create upload directory
        upload_dir = Path(tempfile.gettempdir()) / "tron_ai_uploads"
        upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "success": True,
            "filename": unique_filename,
            "original_filename": file.filename,
            "size": len(content),
            "path": str(file_path),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# =============================================================================
# HEALTH AND MONITORING ENDPOINTS
# =============================================================================

@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@router.get("/metrics")
async def get_metrics():
    """Prometheus-compatible metrics endpoint"""
    try:
        analytics = tron_engine.get_system_analytics()
        
        metrics = {
            "tron_ai_total_requests": analytics["total_requests"],
            "tron_ai_error_count": analytics["error_count"],
            "tron_ai_error_rate": analytics["error_rate"],
            "tron_ai_average_response_time": analytics["performance_metrics"]["average_response_time"],
            "tron_ai_uptime_seconds": analytics["uptime_seconds"]
        }
        
        # Add capability-specific metrics
        for capability, count in analytics["capability_usage"].items():
            metrics[f"tron_ai_capability_{capability}_usage"] = count
        
        return metrics
    except Exception as e:
        logger.error(f"Metrics retrieval failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Metrics retrieval failed: {str(e)}")

# =============================================================================
# EXPORT CONFIGURATION
# =============================================================================

# Export router for use in main application
__all__ = ["router", "tron_engine"]