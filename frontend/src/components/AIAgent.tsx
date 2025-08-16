import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  Phone, 
  Search, 
  AlertTriangle,
  Zap,
  Activity,
  Settings,
  BarChart3,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { AgentCalendar } from './AgentCalendar';
import { RLSimulator } from './RLSimulator';

interface AgentSettings {
  autoLeadSearch: boolean;
  autoOutreach: boolean;
  autoFollowUp: boolean;
  autoCalendarSync: boolean;
  requireConfirmation: boolean;
}

interface AgentTask {
  id: string;
  type: 'lead_search' | 'outreach' | 'follow_up' | 'calendar_sync';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'awaiting_approval';
  description: string;
  progress: number;
  scheduledTime?: string;
  result?: any;
  confidence: number;
}

interface AgentMetrics {
  totalAutomatedActions: number;
  successRate: number;
  timesSaved: number;
  learningScore: number;
  adaptationRate: number;
}

export const AIAgent = () => {
  const { leads, icpData, outreachStats, addMultipleLeads, trackSentMessage } = useAppData();
  const { toast } = useToast();

  const [agentActive, setAgentActive] = useState(false);
  const [agentSettings, setAgentSettings] = useState<AgentSettings>({
    autoLeadSearch: true,
    autoOutreach: false,
    autoFollowUp: true,
    autoCalendarSync: false,
    requireConfirmation: true,
  });

  const [currentTasks, setCurrentTasks] = useState<AgentTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<AgentTask[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics>({
    totalAutomatedActions: 0,
    successRate: 85,
    timesSaved: 0,
    learningScore: 78,
    adaptationRate: 92,
  });

  const [learningPhase, setLearningPhase] = useState<'idle' | 'analyzing' | 'optimizing' | 'adapting'>('idle');
  const [nextScheduledAction, setNextScheduledAction] = useState<string>('');

  // Simulated reinforcement learning metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (agentActive) {
        setAgentMetrics(prev => ({
          ...prev,
          learningScore: Math.min(100, prev.learningScore + Math.random() * 0.5),
          adaptationRate: Math.min(100, prev.adaptationRate + Math.random() * 0.3),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [agentActive]);

  // Auto-schedule next action
  useEffect(() => {
    if (agentActive && currentTasks.length === 0) {
      const actions = ['Lead Discovery', 'Outreach Optimization', 'Follow-up Analysis', 'Calendar Sync'];
      const nextAction = actions[Math.floor(Math.random() * actions.length)];
      const nextTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      setNextScheduledAction(`${nextAction} at ${nextTime.toLocaleTimeString()}`);
    }
  }, [agentActive, currentTasks]);

  const generateTask = (type: AgentTask['type'], description: string, confidence: number): AgentTask => ({
    id: `task-${Date.now()}-${Math.random()}`,
    type,
    status: agentSettings.requireConfirmation ? 'awaiting_approval' : 'pending',
    description,
    progress: 0,
    confidence,
    scheduledTime: new Date().toISOString(),
  });

  const executeTask = async (task: AgentTask) => {
    setCurrentTasks(prev => 
      prev.map(t => t.id === task.id ? { ...t, status: 'running' as const, progress: 0 } : t)
    );

    // Simulate task execution with progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setCurrentTasks(prev => 
        prev.map(t => t.id === task.id ? { ...t, progress } : t)
      );
    }

    // Complete task and move to completed
    let result = {};
    let success = Math.random() > 0.15; // 85% success rate

    switch (task.type) {
      case 'lead_search':
        if (success) {
          const newLeads = generateAILeads(3);
          addMultipleLeads(newLeads);
          result = { leadsFound: newLeads.length, sources: ['LinkedIn', 'Company Databases', 'AI Prospecting'] };
          toast({
            title: "AI Agent Success",
            description: `Found ${newLeads.length} new qualified leads automatically`,
          });
        }
        break;
      case 'outreach':
        if (success) {
          const leadsToContact = leads.slice(0, 5);
          leadsToContact.forEach(lead => {
            trackSentMessage('email', lead.id);
            trackSentMessage('linkedin', lead.id);
          });
          result = { emailsSent: leadsToContact.length, linkedinMessages: leadsToContact.length };
          toast({
            title: "AI Agent Success",
            description: `Sent personalized outreach to ${leadsToContact.length} leads`,
          });
        }
        break;
      case 'follow_up':
        if (success) {
          result = { followUpsSent: 8, responsesReceived: 3 };
          toast({
            title: "AI Agent Success",
            description: "Automated follow-up sequence completed",
          });
        }
        break;
      case 'calendar_sync':
        if (success) {
          result = { meetingsScheduled: 2, calendarUpdated: true };
          toast({
            title: "AI Agent Success",
            description: "Calendar synchronized with new prospect meetings",
          });
        }
        break;
    }

    setCurrentTasks(prev => prev.filter(t => t.id !== task.id));
    setCompletedTasks(prev => [{
      ...task,
      status: success ? 'completed' : 'failed',
      progress: 100,
      result
    }, ...prev.slice(0, 9)]); // Keep last 10 completed tasks

    setAgentMetrics(prev => ({
      ...prev,
      totalAutomatedActions: prev.totalAutomatedActions + 1,
      timesSaved: prev.timesSaved + (task.type === 'lead_search' ? 120 : 30), // minutes saved
      successRate: success ? Math.min(100, prev.successRate + 0.5) : Math.max(70, prev.successRate - 1),
    }));
  };

  const generateAILeads = (count: number) => {
    const companies = ['NextGen Analytics', 'CloudScale Solutions', 'DataDriven Corp', 'InnovateTech', 'ScaleFast Inc'];
    const industries = ['SaaS', 'Analytics', 'Cloud Services', 'AI/ML', 'E-commerce'];
    const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
    
    return Array.from({ length: count }, (_, i) => ({
      company: companies[i % companies.length] + ` ${Math.floor(Math.random() * 100)}`,
      industry: industries[Math.floor(Math.random() * industries.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      employees: ['50-75', '75-100', '100-200'][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 20) + 80,
      contact: `Contact ${i + 1}`,
      title: ['VP Sales', 'CTO', 'Head of Growth'][Math.floor(Math.random() * 3)],
      email: `contact${i}@company.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedin: `contact-${i}-linkedin`,
      website: `company${i}.com`,
      revenue: '$10M - $25M',
      founded: (2015 + Math.floor(Math.random() * 8)).toString(),
      source: 'AI Generated' as const,
    }));
  };

  const approveTask = (taskId: string) => {
    setCurrentTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, status: 'pending' as const } : t)
    );
    
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
      executeTask({ ...task, status: 'pending' });
    }
  };

  const triggerLearningCycle = () => {
    setLearningPhase('analyzing');
    setTimeout(() => setLearningPhase('optimizing'), 2000);
    setTimeout(() => setLearningPhase('adapting'), 4000);
    setTimeout(() => {
      setLearningPhase('idle');
      setAgentMetrics(prev => ({
        ...prev,
        learningScore: Math.min(100, prev.learningScore + 2),
        adaptationRate: Math.min(100, prev.adaptationRate + 1),
      }));
      toast({
        title: "AI Learning Complete",
        description: "Agent has adapted strategies based on recent performance data",
      });
    }, 6000);
  };

  const startAutomatedWorkflow = () => {
    if (!icpData.isGenerated) {
      toast({
        title: "ICP Required",
        description: "Please generate your ICP first to enable AI Agent automation",
        variant: "destructive",
      });
      return;
    }

    setAgentActive(true);
    
    const initialTasks = [
      generateTask('lead_search', 'AI searching for high-quality leads matching your ICP', 89),
      generateTask('outreach', 'Personalizing and sending outreach messages', 76),
      generateTask('calendar_sync', 'Syncing calendar for prospect meetings', 92),
    ];

    setCurrentTasks(initialTasks);

    // Auto-execute if confirmation not required
    if (!agentSettings.requireConfirmation) {
      initialTasks.forEach(task => {
        setTimeout(() => executeTask(task), Math.random() * 2000);
      });
    }

    toast({
      title: "AI Agent Activated",
      description: "Autonomous B2B sales agent is now running",
    });
  };

  const pauseAgent = () => {
    setAgentActive(false);
    setCurrentTasks([]);
    toast({
      title: "AI Agent Paused",
      description: "All automated workflows have been stopped",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI B2B Sales Agent</CardTitle>
                <CardDescription className="text-purple-100">
                  Autonomous reinforcement learning-powered sales automation
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {agentActive ? 'Active' : 'Inactive'}
              </Badge>
              {agentActive ? (
                <Button onClick={pauseAgent} variant="secondary" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Agent
                </Button>
              ) : (
                <Button 
                  onClick={startAutomatedWorkflow} 
                  variant="secondary" 
                  size="sm"
                  className="bg-white hover:bg-gray-50 text-gray-900 border"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Agent
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Agent Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">{agentMetrics.successRate}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${agentMetrics.successRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Learning Score</span>
                <span className="font-medium">{Math.round(agentMetrics.learningScore)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${agentMetrics.learningScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Adaptation Rate</span>
                <span className="font-medium">{Math.round(agentMetrics.adaptationRate)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${agentMetrics.adaptationRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Actions Automated</span>
                <span className="font-bold">{agentMetrics.totalAutomatedActions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time Saved</span>
                <span className="font-bold">{Math.round(agentMetrics.timesSaved / 60)}h {agentMetrics.timesSaved % 60}m</span>
              </div>
            </div>

            <Button
              onClick={triggerLearningCycle}
              variant="outline"
              size="sm"
              disabled={learningPhase !== 'idle'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:text-white border-0"
            >
              {learningPhase === 'idle' ? (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Trigger Learning Cycle
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {learningPhase === 'analyzing' && 'Analyzing...'}
                  {learningPhase === 'optimizing' && 'Optimizing...'}
                  {learningPhase === 'adapting' && 'Adapting...'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Agent Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Agent Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoLeadSearch" className="text-sm">Auto Lead Search</Label>
                <Switch
                  id="autoLeadSearch"
                  checked={agentSettings.autoLeadSearch}
                  onCheckedChange={(checked) => 
                    setAgentSettings(prev => ({ ...prev, autoLeadSearch: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoOutreach" className="text-sm">Auto Outreach</Label>
                <Switch
                  id="autoOutreach"
                  checked={agentSettings.autoOutreach}
                  onCheckedChange={(checked) => 
                    setAgentSettings(prev => ({ ...prev, autoOutreach: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoFollowUp" className="text-sm">Auto Follow-up</Label>
                <Switch
                  id="autoFollowUp"
                  checked={agentSettings.autoFollowUp}
                  onCheckedChange={(checked) => 
                    setAgentSettings(prev => ({ ...prev, autoFollowUp: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoCalendarSync" className="text-sm">Calendar Coordination</Label>
                <Switch
                  id="autoCalendarSync"
                  checked={agentSettings.autoCalendarSync}
                  onCheckedChange={(checked) => 
                    setAgentSettings(prev => ({ ...prev, autoCalendarSync: checked }))
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="requireConfirmation" className="text-sm font-medium">
                  Human-in-the-Loop
                </Label>
                <Switch
                  id="requireConfirmation"
                  checked={agentSettings.requireConfirmation}
                  onCheckedChange={(checked) => 
                    setAgentSettings(prev => ({ ...prev, requireConfirmation: checked }))
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Require approval before executing actions
              </p>
            </div>

            {nextScheduledAction && agentActive && (
              <Alert>
                <Clock className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Next: {nextScheduledAction}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Real-time Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className={`w-5 h-5 transition-all duration-500 ${agentActive ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
              <span>Real-time Status</span>
              {agentActive ? (
                <div className="flex items-center space-x-1 animate-in fade-in duration-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 animate-in fade-in duration-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-600 font-medium">INACTIVE</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className={`transition-all duration-500 ${!agentActive ? 'opacity-50 pointer-events-none' : ''}`}>
            {!agentActive ? (
              <div className="text-center py-8 transition-all duration-500 opacity-100">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3 transition-all duration-300 hover:scale-110" />
                <p className="text-gray-500">Agent is inactive</p>
                <p className="text-xs text-gray-400 mt-1">Start the agent to begin automation</p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-700">
                {currentTasks.length === 0 ? (
                  <div className="text-center py-4 animate-in fade-in duration-500 delay-200">
                    <div className="relative">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2 animate-in zoom-in duration-500 delay-300" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm text-gray-600 animate-in fade-in duration-500 delay-400">All tasks complete</p>
                    <div className="flex items-center justify-center space-x-2 mt-2 animate-in fade-in duration-500 delay-500">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                      <span className="text-xs text-gray-400 ml-2">Monitoring for new opportunities</span>
                    </div>
                  </div>
                ) : (
                  currentTasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="border rounded-lg p-3 space-y-2 transition-all duration-500 hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 150 + 300}ms`, animationDuration: '600ms' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {task.type === 'lead_search' && <Search className={`w-4 h-4 text-blue-500 transition-all duration-300 ${task.status === 'running' ? 'animate-spin' : ''}`} />}
                          {task.type === 'outreach' && <Mail className={`w-4 h-4 text-green-500 transition-all duration-300 ${task.status === 'running' ? 'animate-pulse' : ''}`} />}
                          {task.type === 'follow_up' && <RefreshCw className={`w-4 h-4 text-purple-500 transition-all duration-300 ${task.status === 'running' ? 'animate-spin' : ''}`} />}
                          {task.type === 'calendar_sync' && <Calendar className={`w-4 h-4 text-orange-500 transition-all duration-300 ${task.status === 'running' ? 'animate-bounce' : ''}`} />}
                          <span className="text-sm font-medium">{task.description}</span>
                          {task.status === 'running' && (
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={
                            task.status === 'running' ? 'default' :
                            task.status === 'awaiting_approval' ? 'secondary' :
                            'outline'
                          }
                          className={`transition-all duration-300 ${
                            task.status === 'running' ? 'animate-pulse bg-blue-100 text-blue-800' :
                            task.status === 'awaiting_approval' ? 'bg-yellow-100 text-yellow-800' :
                            ''
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {task.status === 'running' && (
                        <div className="space-y-1 animate-in fade-in duration-300">
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span className="animate-pulse">Processing...</span>
                            <span>{task.progress}%</span>
                          </div>
                        </div>
                      )}
                      
                      {task.status === 'awaiting_approval' && (
                        <div className="flex space-x-2 animate-in slide-in-from-bottom-2 duration-300">
                          <Button 
                            size="sm" 
                            onClick={() => approveTask(task.id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:text-white transition-all duration-300 hover:scale-105"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="transition-all duration-300 hover:scale-105"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span>Confidence:</span> 
                          <span className={`font-medium ${task.confidence > 85 ? 'text-green-600' : task.confidence > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {task.confidence}%
                          </span>
                        </span>
                        <span>{new Date(task.scheduledTime!).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task History & Calendar & AI Optimization */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Task History</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>Recent automated actions performed by the AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No completed tasks yet</p>
                  <p className="text-sm text-gray-400">Start the agent to see automated actions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {task.status === 'completed' ? 
                          <CheckCircle className="w-5 h-5 text-green-500" /> :
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        }
                        <div>
                          <p className="font-medium text-sm">{task.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(task.scheduledTime!).toLocaleString()}
                          </p>
                          {task.result && (
                            <p className="text-xs text-blue-600 mt-1">
                              {Object.entries(task.result).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={task.status === 'completed' ? 'outline' : 'destructive'}
                        className={task.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <RLSimulator />
        </TabsContent>

        <TabsContent value="calendar">
          <AgentCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};