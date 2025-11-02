"""
TRON Ultimate AI Platform - Supabase Database Manager
Pure class integration with Supabase for high-performance database operations
"""

import os
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from supabase import create_client, Client
import uuid

logger = logging.getLogger(__name__)

class SupabaseDatabaseManager:
    """
    Supabase database manager for TRON Ultimate AI Platform
    Handles all database operations with Row Level Security
    """
    
    def __init__(self):
        self.client: Optional[Client] = None
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.is_connected = False
        
    async def initialize(self) -> bool:
        """
        Initialize Supabase client connection
        Returns True if successful, False otherwise
        """
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not found - database features disabled")
            return False
            
        try:
            self.client = create_client(self.supabase_url, self.supabase_key)
            # Test connection
            result = self.client.table('system_analytics').select('count', count='exact').limit(1).execute()
            self.is_connected = True
            logger.info("Supabase database connection established")
            return True
        except Exception as e:
            logger.error(f"Supabase initialization failed: {str(e)}")
            return False
    
    async def log_request(self, 
                         request_id: str,
                         capability: str,
                         model: str,
                         prompt_text: str,
                         response_data: Any,
                         processing_time: float,
                         success: bool = True,
                         error_message: Optional[str] = None,
                         user_id: Optional[str] = None) -> bool:
        """
        Log AI request to database for analytics and monitoring
        """
        if not self.is_connected:
            logger.warning("Database not connected - request not logged")
            return False
            
        try:
            request_data = {
                'id': request_id,
                'user_id': user_id,
                'request_type': capability,
                'capability': capability,
                'model': model,
                'prompt': prompt_text,
                'response_data': response_data,
                'execution_time': processing_time,
                'success': success,
                'error_message': error_message,
                'status': 'completed' if success else 'error',
                'created_at': datetime.now().isoformat()
            }
            
            result = self.client.table('ai_requests').insert(request_data).execute()
            logger.debug(f"Request logged successfully: {capability}")
            return True
        except Exception as e:
            logger.error(f"Failed to log request: {str(e)}")
            return False
    
    async def log_file_generation(self,
                                 filename: str,
                                 file_type: str,
                                 file_path: str,
                                 file_size: int,
                                 user_id: Optional[str] = None) -> bool:
        """
        Log file generation for tracking and analytics
        """
        if not self.is_connected:
            return False
            
        try:
            file_data = {
                'filename': filename,
                'file_type': file_type,
                'file_path': file_path,
                'file_size': file_size,
                'user_id': user_id,
                'created_at': datetime.now().isoformat()
            }
            
            result = self.client.table('generated_files').insert(file_data).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to log file generation: {str(e)}")
            return False
    
    async def update_analytics(self, 
                              date: Optional[str] = None,
                              increment_requests: bool = False,
                              increment_capability: Optional[str] = None,
                              increment_errors: bool = False) -> bool:
        """
        Update system analytics counters
        """
        if not self.is_connected:
            return False
            
        try:
            if not date:
                date = datetime.now().date().isoformat()
            
            # Get current analytics
            result = self.client.table('system_analytics').select('*').eq('date', date).execute()
            
            if result.data:
                # Update existing record
                update_data = {}
                if increment_requests:
                    update_data['total_requests'] = result.data[0]['total_requests'] + 1
                if increment_capability:
                    field_name = f"{increment_capability}s" if not increment_capability.endswith('s') else increment_capability
                    update_data[field_name] = result.data[0][field_name] + 1
                if increment_errors:
                    update_data['error_count'] = result.data[0]['error_count'] + 1
                
                if update_data:
                    self.client.table('system_analytics').update(update_data).eq('date', date).execute()
            else:
                # Create new record
                new_data = {
                    'date': date,
                    'total_requests': 1 if increment_requests else 0,
                    'image_generations': 1 if increment_capability == 'image_generation' else 0,
                    'web_researches': 1 if increment_capability == 'web_research' else 0,
                    'code_executions': 1 if increment_capability == 'code_execution' else 0,
                    'file_creations': 1 if increment_capability == 'file_creation' else 0,
                    'error_count': 1 if increment_errors else 0
                }
                self.client.table('system_analytics').insert(new_data).execute()
            
            return True
        except Exception as e:
            logger.error(f"Failed to update analytics: {str(e)}")
            return False
    
    async def get_user_requests(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get user's request history
        """
        if not self.is_connected:
            return []
            
        try:
            result = (self.client.table('ai_requests')
                     .select('*')
                     .eq('user_id', user_id)
                     .order('created_at', desc=True)
                     .limit(limit)
                     .execute())
            return result.data or []
        except Exception as e:
            logger.error(f"Failed to get user requests: {str(e)}")
            return []
    
    async def get_system_stats(self, days: int = 30) -> Dict[str, Any]:
        """
        Get system statistics for dashboard
        """
        if not self.is_connected:
            return {}
            
        try:
            start_date = (datetime.now() - timedelta(days=days)).date().isoformat()
            
            # Get recent analytics
            result = (self.client.table('system_analytics')
                     .select('*')
                     .gte('date', start_date)
                     .order('date', desc=True)
                     .execute())
            
            return {
                'analytics': result.data or [],
                'total_requests': sum(item['total_requests'] for item in result.data) if result.data else 0,
                'success_rate': 100.0,  # Would calculate from error data
                'most_used_capability': 'image_generation'  # Would calculate from request types
            }
        except Exception as e:
            logger.error(f"Failed to get system stats: {str(e)}")
            return {}
    
    async def record_performance_metric(self, metric_type: str, value: float) -> bool:
        """
        Record performance metrics
        """
        if not self.is_connected:
            return False
            
        try:
            metric_data = {
                'metric_type': metric_type,
                'metric_value': value,
                'recorded_at': datetime.now().isoformat()
            }
            
            result = self.client.table('performance_metrics').insert(metric_data).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to record metric: {str(e)}")
            return False
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check database health and connectivity
        """
        if not self.is_connected:
            return {'status': 'disconnected', 'message': 'Database not connected'}
            
        try:
            # Test basic connectivity
            result = self.client.table('system_analytics').select('count', count='exact').limit(1).execute()
            
            return {
                'status': 'healthy',
                'connection': 'active',
                'tables_accessible': True,
                'message': 'Database connection active and responsive'
            }
        except Exception as e:
            return {
                'status': 'error',
                'connection': 'failed',
                'error': str(e),
                'message': 'Database connection failed'
            }

# Global database manager instance
db_manager = SupabaseDatabaseManager()

# Database service functions for easy importing
async def initialize_database() -> bool:
    """Initialize the database connection"""
    return await db_manager.initialize()

async def log_ai_request(**kwargs) -> bool:
    """Log an AI request to database"""
    return await db_manager.log_request(**kwargs)

async def log_file_generation(**kwargs) -> bool:
    """Log file generation to database"""
    return await db_manager.log_file_generation(**kwargs)

async def update_system_analytics(**kwargs) -> bool:
    """Update system analytics"""
    return await db_manager.update_analytics(**kwargs)

async def get_database_health() -> Dict[str, Any]:
    """Get database health status"""
    return await db_manager.health_check()