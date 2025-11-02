/**
 * TRON ULTIMATE AI CONTROLLER
 * Pure class UI component with Tron aesthetics
 * Black background, red accents, professional naming, no emojis
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Search, 
  Code, 
  Globe, 
  FileText, 
  Mic, 
  Activity,
  Monitor,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Cpu,
  Database,
  Network,
  Gauge,
  BarChart3,
  Settings,
  Play,
  Pause,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ultimateAIService, 
  SystemAnalytics, 
  CapabilityInfo,
  APIResponse 
} from '../services/ultimateAIService';

type CapabilityType = 
  | 'overview'
  | 'image_generation'
  | 'web_research'
  | 'code_execution'
  | 'browser_control'
  | 'file_creation'
  | 'live_interaction'
  | 'analytics_monitoring'
  | 'workflow_automation';

interface CapabilityConfig {
  id: CapabilityType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  bgGradient: string;
}

const capabilityConfigs: CapabilityConfig[] = [
  {
    id: 'overview',
    name: 'System Overview',
    description: 'Complete platform status and analytics',
    icon: Monitor,
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgGradient: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'image_generation',
    name: 'Image Generation',
    description: 'Professional image creation with Nano Banana',
    icon: Zap,
    color: 'text-red-300',
    borderColor: 'border-red-300/30',
    bgGradient: 'from-red-800/20 to-red-700/10'
  },
  {
    id: 'web_research',
    name: 'Web Research',
    description: 'Real-time research with Google Search grounding',
    icon: Search,
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgGradient: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'code_execution',
    name: 'Code Execution',
    description: 'Python sandbox with advanced debugging',
    icon: Code,
    color: 'text-red-300',
    borderColor: 'border-red-300/30',
    bgGradient: 'from-red-800/20 to-red-700/10'
  },
  {
    id: 'browser_control',
    name: 'Browser Control',
    description: 'Web automation and browser interaction',
    icon: Globe,
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgGradient: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'file_creation',
    name: 'File Creation',
    description: 'Multi-format file generation and downloads',
    icon: FileText,
    color: 'text-red-300',
    borderColor: 'border-red-300/30',
    bgGradient: 'from-red-800/20 to-red-700/10'
  },
  {
    id: 'live_interaction',
    name: 'Live Interaction',
    description: 'Real-time voice and video communications',
    icon: Mic,
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgGradient: 'from-red-900/20 to-red-800/10'
  },
  {
    id: 'analytics_monitoring',
    name: 'Analytics & Monitoring',
    description: 'Advanced system monitoring and analytics',
    icon: BarChart3,
    color: 'text-red-300',
    borderColor: 'border-red-300/30',
    bgGradient: 'from-red-800/20 to-red-700/10'
  },
  {
    id: 'workflow_automation',
    name: 'Workflow Automation',
    description: 'Multi-task workflow coordination',
    icon: Activity,
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgGradient: 'from-red-900/20 to-red-800/10'
  }
];

export const UltimateAIController: React.FC = () => {
  const [activeCapability, setActiveCapability] = useState<CapabilityType>('overview');
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [capabilityInfo, setCapabilityInfo] = useState<CapabilityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load system data
  const loadSystemData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analytics, capabilities] = await Promise.all([
        ultimateAIService.getAnalytics(),
        ultimateAIService.getCapabilities()
      ]);
      
      setSystemAnalytics(analytics);
      setCapabilityInfo(capabilities);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system data');
      console.error('System data loading failed:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Refresh system data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadSystemData();
  }, [loadSystemData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadSystemData();
    
    const interval = setInterval(loadSystemData, 30000);
    return () => clearInterval(interval);
  }, [loadSystemData]);

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  // Render overview dashboard
  const renderOverview = () => {
    if (!systemAnalytics || !capabilityInfo) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Loading system overview...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* System Status Header */}
        <div className={`p-6 rounded-lg border-2 ${
          systemAnalytics.system_status === 'operational' 
            ? 'bg-green-900/20 border-green-400/30' 
            : 'bg-red-900/20 border-red-400/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2">
                System Status: {systemAnalytics.system_status.toUpperCase()}
              </h3>
              <p className="text-red-300">
                {systemAnalytics.error_count === 0 ? 'All systems operational' : `${systemAnalytics.error_count} errors detected`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-400">
                {systemAnalytics.total_requests.toLocaleString()}
              </div>
              <div className="text-sm text-red-300">Total Requests</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-400/30">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-red-400">Response Time</h4>
            </div>
            <div className="text-2xl font-bold text-red-300">
              {systemAnalytics.performance_metrics.average_response_time}s
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border border-red-400/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-red-400">RPM</h4>
            </div>
            <div className="text-2xl font-bold text-red-300">
              {systemAnalytics.performance_metrics.requests_per_minute}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border border-red-400/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-red-400">Uptime</h4>
            </div>
            <div className="text-2xl font-bold text-red-300">
              {Math.floor(systemAnalytics.uptime_seconds / 3600)}h
            </div>
          </div>
        </div>

        {/* Capability Usage */}
        <div className="p-6 rounded-lg bg-red-900/20 border border-red-400/30">
          <h4 className="text-lg font-semibold text-red-400 mb-4">Capability Usage</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(systemAnalytics.capability_usage).map(([capability, count]) => (
              <div key={capability} className="text-center">
                <div className="text-xl font-bold text-red-300">{count}</div>
                <div className="text-sm text-red-400 capitalize">{capability.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Status */}
        <div className="p-6 rounded-lg bg-red-900/20 border border-red-400/30">
          <h4 className="text-lg font-semibold text-red-400 mb-4">AI Models Status</h4>
          <div className="space-y-2">
            {Object.entries(systemAnalytics.models_status).map(([model, status]) => (
              <div key={model} className="flex items-center justify-between">
                <span className="text-red-300 capitalize">{model.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'active' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className={`text-sm ${status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render capability-specific content
  const renderCapabilityContent = () => {
    const config = capabilityConfigs.find(c => c.id === activeCapability);
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className="space-y-6">
        {/* Capability Header */}
        <div className={`p-6 rounded-lg bg-gradient-to-br ${config.bgGradient} border ${config.borderColor}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${config.color} bg-red-900/30`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-400">{config.name}</h3>
              <p className="text-red-300 mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Placeholder content for each capability */}
        <div className="p-6 rounded-lg bg-red-900/10 border border-red-400/20">
          <p className="text-red-300 mb-4">
            Advanced {config.name.toLowerCase()} interface coming soon.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-400/30 transition-colors">
              Launch {config.name}
            </button>
            <button className="px-4 py-2 bg-transparent hover:bg-red-900/20 text-red-400 rounded-lg border border-red-400/30 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !systemAnalytics) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
          <div className="text-red-400">Initializing TRON Ultimate AI Platform...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-red-400/30 bg-gradient-to-r from-red-900/20 to-red-800/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">Getron - Ultimate AI Platform</h1>
            <p className="text-red-300">Pure class AI agent with 8 specialized capabilities</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm text-red-400">
              <div>Last update: {formatTimeAgo(lastUpdate)}</div>
              <div>Status: {systemAnalytics?.system_status || 'Loading...'}</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-400/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mx-6 mt-4 rounded-lg bg-red-900/20 border border-red-400/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-red-400/30 bg-gradient-to-b from-red-900/10 to-red-800/5 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-red-400 mb-4">AI Capabilities</h2>
            <div className="space-y-2">
              {capabilityConfigs.map((config) => {
                const IconComponent = config.icon;
                const isActive = activeCapability === config.id;
                
                return (
                  <motion.button
                    key={config.id}
                    onClick={() => setActiveCapability(config.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isActive 
                        ? `${config.bgGradient} ${config.borderColor} border-2` 
                        : 'bg-transparent border-red-400/20 hover:bg-red-900/10 hover:border-red-400/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${config.color}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isActive ? 'text-red-400' : 'text-red-300'}`}>
                          {config.name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-red-400/80' : 'text-red-400/60'}`}>
                          {config.description}
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-red-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeCapability === 'overview' ? renderOverview() : renderCapabilityContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateAIController;