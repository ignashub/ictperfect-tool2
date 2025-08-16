import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Building, Users, Target, TrendingUp, Mail, 
  Phone, Linkedin, Brain, LogOut, User, Plus, Upload, Sparkles,
  Globe, BarChart3, Zap, Bot, MessageSquare, Activity, DollarSign,
  CheckCircle, Clock, PieChart, Info, Search, Database, Shield, Rocket,
  UserSearch, BarChart, Settings
} from "lucide-react";
import { LeadsList } from "@/components/LeadsList";
import { RLSimulator } from "@/components/RLSimulator";
import { NLPMessageGenerator } from "@/components/NLPMessageGenerator";
import { AIPhoneAgent } from "@/components/AIPhoneAgent";
import { ChannelOrchestration } from "@/components/ChannelOrchestration";
import { Profile } from "@/components/Profile";
import { Mailbox } from "@/components/Mailbox";
import { AIAgent } from "@/components/AIAgent";
import { useAuth } from "@/hooks/useAuth";
import { useAppData } from "@/hooks/useAppData";

interface DashboardProps {
  userData: any;
}

export const Dashboard = ({ userData }: DashboardProps) => {
  const { user, logout } = useAuth();
  const { outreachStats, hasAnyData, generateICP, addMultipleLeads, leads, icpData } = useAppData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<string>("");
  const [isGeneratingLeads, setIsGeneratingLeads] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'analyzing' | 'searching' | 'validating' | 'complete'>('analyzing');
  const [showAISuccess, setShowAISuccess] = useState(false);
  const [isGeneratingICP, setIsGeneratingICP] = useState(false);
  const [icpGenerationPhase, setICPGenerationPhase] = useState<'profiling' | 'analyzing' | 'creating' | 'complete'>('profiling');
  const [showICPSuccess, setShowICPSuccess] = useState(false);
  const [hasUsedAI, setHasUsedAI] = useState(false);
  const [hasLaunchedOutreach, setHasLaunchedOutreach] = useState(false);

  // Calculate real-time industry breakdown from actual leads
  const getActualIndustryBreakdown = () => {
    if (leads.length === 0) return [];
    
    const industryCount: Record<string, number> = {};
    leads.forEach(lead => {
      industryCount[lead.industry] = (industryCount[lead.industry] || 0) + 1;
    });

    return Object.entries(industryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: Math.round((count / leads.length) * 100)
      }));
  };

  // Calculate dynamic AI performance metrics
  const getAIMetrics = () => {
    const totalMessages = outreachStats.emailsSent + outreachStats.linkedinConnections;
    
    // Phone success rate improves with activity and lead quality
    const basePhoneRate = 67;
    const qualityBonus = leads.length > 0 ? (leads.filter(l => l.tier === 'Hot').length / leads.length) * 15 : 0;
    const activityBonus = outreachStats.callsMade > 20 ? 8 : outreachStats.callsMade > 10 ? 4 : 0;
    const phoneSuccessRate = Math.min(basePhoneRate + qualityBonus + activityBonus, 85);
    
    // Message responses based on actual send volume with scaling
    const emailResponseRate = outreachStats.emailsSent > 50 ? 0.26 : 0.24;
    const linkedinResponseRate = outreachStats.linkedinConnections > 30 ? 0.20 : 0.18;
    const messageResponses = Math.round(
      (outreachStats.emailsSent * emailResponseRate) + 
      (outreachStats.linkedinConnections * linkedinResponseRate)
    );
    
    // Conversion prediction based on lead quality and outreach performance
    const baseConversion = 23;
    const leadQualityBonus = leads.length > 0 ? 
      (leads.filter(l => l.tier === 'Hot' || l.tier === 'Warm').length / leads.length) * 12 : 0;
    const outreachVolumeBonus = (outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade) > 100 ? 5 : 0;
    const conversionPrediction = Math.min(baseConversion + leadQualityBonus + outreachVolumeBonus, 45);
    
    return {
      phoneSuccessRate: Math.round(phoneSuccessRate),
      messageResponses,
      conversionPrediction: Math.round(conversionPrediction),
      actualConnections: Math.round(outreachStats.callsMade * (phoneSuccessRate / 100))
    };
  };

  // Calculate real-time revenue projections
  const getRevenueProjections = () => {
    const aiMetrics = getAIMetrics();
    const currentConversions = Math.floor(outreachStats.qualifiedLeads * aiMetrics.conversionPrediction / 100);
    const pipelineValue = currentConversions * 55000;
    
    // Annual projection based on current activity trends
    const totalAddressableMarket = icpData.totalAddressableMarket || Math.max(leads.length * 2500, 25000);
    const annualProjection = Math.floor(
      totalAddressableMarket * 0.08 * 0.67 * 0.25 * aiMetrics.conversionPrediction / 100
    ) * 55000;
    
    return {
      currentConversions,
      pipelineValue,
      annualProjection: Math.max(annualProjection, pipelineValue * 8) // Ensure annual is higher than current
    };
  };

  // Generate sample leads for demo
  const generateSampleLeads = () => {
    setIsGeneratingLeads(true);
    setGenerationPhase('analyzing');
    setShowAISuccess(false);

    // Phase 1: Analyzing ICP (1500ms)
    setTimeout(() => {
      setGenerationPhase('searching');
    }, 1500);

    // Phase 2: Searching databases (2000ms) 
    setTimeout(() => {
      setGenerationPhase('validating');
    }, 3500);

    // Phase 3: Validating leads (1500ms)
    setTimeout(() => {
      setGenerationPhase('complete');
      
      const sampleLeads = [
        {
          company: "TechFlow Solutions",
          industry: "SaaS",
          location: "San Francisco, CA",
          employees: "150-200",
          score: 92,
          tier: "Hot" as const,
          contact: "Sarah Johnson",
          title: "VP of Sales",
          email: "sarah.j@techflow.com",
          phone: "+1 (555) 123-4567",
          linkedin: "sarah-johnson-sales",
          website: "techflow.com",
          revenue: "$25M - $50M",
          founded: "2018",
          source: "AI Generated" as const,
        },
        {
          company: "DataSync Corp",
          industry: "Analytics",
          location: "New York, NY",
          employees: "75-100",
          score: 87,
          tier: "Warm" as const,
          contact: "Michael Chen",
          title: "CTO",
          email: "m.chen@datasync.com",
          phone: "+1 (555) 987-6543",
          linkedin: "michael-chen-cto",
          website: "datasync.com",
          revenue: "$10M - $25M",
          founded: "2019",
          source: "AI Generated" as const,
        },
        {
          company: "CloudVenture Inc",
          industry: "Cloud Services",
          location: "Austin, TX",
          employees: "50-75",
          score: 81,
          tier: "Warm" as const,
          contact: "Emily Rodriguez",
          title: "Head of Operations",
          email: "e.rodriguez@cloudventure.com",
          phone: "+1 (555) 456-7890",
          linkedin: "emily-rodriguez-ops",
          website: "cloudventure.com",
          revenue: "$5M - $10M",
          founded: "2020",
          source: "AI Generated" as const,
        }
      ];
      
      addMultipleLeads(sampleLeads);
      
      setIsGeneratingLeads(false);
      setHasUsedAI(true);
      setShowAISuccess(true);
    }, 5000);
  };

  const handleGenerateICP = () => {
    if (icpData.isGenerated) return; // Prevent multiple clicks
    
    setIsGeneratingICP(true);
    setICPGenerationPhase('profiling');
    setShowICPSuccess(false);

    // Phase 1: Profiling company (1200ms)
    setTimeout(() => {
      setICPGenerationPhase('analyzing');
    }, 1200);

    // Phase 2: Analyzing market data (1500ms) 
    setTimeout(() => {
      setICPGenerationPhase('creating');
    }, 2700);

    // Phase 3: Creating ICP criteria (1000ms)
    setTimeout(() => {
      setICPGenerationPhase('complete');
      
      generateICP(userData);
      
      setIsGeneratingICP(false);
      setShowICPSuccess(true);
    }, 3700);
  };

  const handleSuccessDismiss = (action?: 'view-leads' | 'continue') => {
    setShowAISuccess(false);
    if (action === 'view-leads') {
      setActiveTab("leads");
    }
  };

  const handleICPSuccessDismiss = (action?: 'add-leads' | 'continue') => {
    setShowICPSuccess(false);
    if (action === 'add-leads') {
      // Focus on the "Add Your First Leads" section
      document.getElementById('add-leads-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ICPerfect</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.full_name || userData?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm text-gray-600">Total Leads</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          <strong>Total Leads:</strong> The complete number of prospects in your database. 
                          This includes all leads regardless of quality score, from cold prospects to hot leads ready for outreach.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{outreachStats.totalLeads}</p>
                  {hasAnyData && <p className="text-sm text-green-600 font-medium">+{outreachStats.totalLeads}</p>}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm text-gray-600">Qualified Leads</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          <strong>Qualified Leads:</strong> High-value prospects with scores ≥70 points. 
                          These leads match your ICP criteria and show strong potential for conversion based on company size, industry, and engagement signals.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{outreachStats.qualifiedLeads}</p>
                  {hasAnyData && <p className="text-sm text-green-600 font-medium">+{outreachStats.qualifiedLeads}</p>}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          <strong>Conversion Rate:</strong> Percentage of qualified leads out of total leads (Qualified ÷ Total × 100). 
                          A higher rate indicates better lead quality and more effective targeting. Industry average is 20-30%.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{outreachStats.conversionRate}%</p>
                  {hasAnyData && <p className="text-sm text-green-600 font-medium">+{outreachStats.conversionRate}%</p>}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm text-gray-600">AI Confidence</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          <strong>AI Confidence:</strong> How confident our AI is in predicting lead success based on data quality, outreach patterns, and historical performance. 
                          80%+ indicates strong predictive accuracy for your campaigns.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{outreachStats.aiConfidence}%</p>
                  {hasAnyData && <p className="text-sm text-green-600 font-medium">+{outreachStats.aiConfidence}%</p>}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Onboarding cards for new users */}
        {!hasLaunchedOutreach && (
          <Card 
            data-onboarding-card
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-500 ease-in-out animate-in fade-in-0 zoom-in-95"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                <span>Quick Setup</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  3 Steps
                </Badge>
              </CardTitle>
              <CardDescription>
                Get started with AI-powered sales in under 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`text-center p-6 bg-gradient-to-br rounded-xl border transition-all duration-300 ${
                  icpData.isGenerated 
                    ? 'from-green-50 to-emerald-50 border-green-200' 
                    : 'from-purple-50 to-blue-50 border-purple-200'
                }`}>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                    icpData.isGenerated 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                  }`}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create ICP</h3>
                  <p className="text-gray-600 mb-4">
                    {icpData.isGenerated 
                      ? 'Your Ideal Customer Profile has been generated and is ready to use'
                      : 'Define your ideal customer profile to improve lead targeting'
                    }
                  </p>

                  {/* ICP Generation Animation */}
                  {isGeneratingICP && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-300 rounded-lg">
                      {icpGenerationPhase === 'profiling' && (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="relative">
                            <User className="w-6 h-6 text-purple-600 animate-pulse" />
                            <div className="absolute inset-0 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-30"></div>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-purple-900">Profiling Your Company</p>
                            <p className="text-sm text-purple-700">Analyzing your business model...</p>
                          </div>
                        </div>
                      )}

                      {icpGenerationPhase === 'analyzing' && (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="relative">
                            <BarChart className="w-6 h-6 text-blue-600 animate-bounce" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-900">Analyzing Market Data</p>
                            <p className="text-sm text-blue-700">Processing industry insights...</p>
                          </div>
                        </div>
                      )}

                      {icpGenerationPhase === 'creating' && (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="relative">
                            <Target className="w-6 h-6 text-indigo-600 animate-spin" />
                            <div className="absolute inset-0 w-6 h-6 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-indigo-900">Creating ICP Criteria</p>
                            <p className="text-sm text-indigo-700">Building your ideal profile...</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ease-out ${
                            icpGenerationPhase === 'profiling' ? 'bg-purple-600 w-1/4' :
                            icpGenerationPhase === 'analyzing' ? 'bg-blue-600 w-2/3' :
                            icpGenerationPhase === 'creating' ? 'bg-indigo-600 w-full' :
                            'bg-green-600 w-full'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}

                                      <Button 
                      onClick={handleGenerateICP}
                      variant="outline"
                      disabled={isGeneratingICP || icpData.isGenerated}
                      className={`transition-all duration-300 ${
                        isGeneratingICP 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 transform scale-105' 
                          : icpData.isGenerated
                          ? 'border-green-600 bg-green-50 text-green-600 cursor-not-allowed'
                          : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                    {isGeneratingICP ? (
                      <>
                        {icpGenerationPhase === 'profiling' && (
                          <>
                            <User className="w-4 h-4 mr-2 animate-pulse" />
                            Profiling...
                          </>
                        )}
                        {icpGenerationPhase === 'analyzing' && (
                          <>
                            <BarChart className="w-4 h-4 mr-2 animate-bounce" />
                            Analyzing...
                          </>
                        )}
                        {icpGenerationPhase === 'creating' && (
                          <>
                            <Settings className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        )}
                        {icpGenerationPhase === 'complete' && (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2 animate-bounce" />
                            Complete!
                          </>
                        )}
                      </>
                    ) : icpData.isGenerated ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ICP Generated
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate ICP
                      </>
                    )}
                  </Button>
                </div>

                {!hasLaunchedOutreach && (
                  <div id="add-leads-section" className={`text-center p-6 bg-gradient-to-br rounded-xl border transition-all duration-300 ${
                    icpData.isGenerated 
                      ? 'from-blue-50 to-indigo-50 border-blue-200' 
                      : 'from-gray-50 to-gray-100 border-gray-300'
                  }`}>
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                      icpData.isGenerated 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                      icpData.isGenerated ? 'text-gray-900' : 'text-gray-500'
                    }`}>2. Add Your First Leads</h3>
                    <p className={`mb-4 transition-all duration-300 ${
                      icpData.isGenerated 
                        ? 'text-gray-600' 
                        : 'text-gray-500'
                    }`}>
                      {icpData.isGenerated 
                        ? 'Start building your prospect database with manual entry or use the help of AI'
                        : 'Complete step 1 first to enable lead generation with ICP-enhanced scoring'
                      }
                    </p>

                    {/* AI Generation Animation */}
                    {isGeneratingLeads && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-300 rounded-lg">
                        {/* Analyzing Phase */}
                        {generationPhase === 'analyzing' && (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="relative">
                              <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                              <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-900">Analyzing Your ICP</p>
                              <p className="text-sm text-blue-700">Understanding your ideal customer profile...</p>
                            </div>
                          </div>
                        )}

                        {/* Searching Phase */}
                        {generationPhase === 'searching' && (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="relative">
                              <Search className="w-6 h-6 text-indigo-600 animate-bounce" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-indigo-900">Searching Databases</p>
                              <p className="text-sm text-indigo-700">Finding prospects that match your criteria...</p>
                            </div>
                          </div>
                        )}

                        {/* Validating Phase */}
                        {generationPhase === 'validating' && (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="relative">
                              <Shield className="w-6 h-6 text-purple-600 animate-spin" />
                              <div className="absolute inset-0 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-purple-900">Validating Leads</p>
                              <p className="text-sm text-purple-700">Scoring and qualifying prospects...</p>
                            </div>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${
                              generationPhase === 'analyzing' ? 'bg-blue-600 w-1/4' :
                              generationPhase === 'searching' ? 'bg-indigo-600 w-2/3' :
                              generationPhase === 'validating' ? 'bg-purple-600 w-full' :
                              'bg-green-600 w-full'
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={generateSampleLeads}
                      variant="outline"
                      disabled={isGeneratingLeads || !icpData.isGenerated || hasUsedAI}
                      className={`transition-all duration-300 ${
                        isGeneratingLeads 
                          ? 'border-purple-600 bg-purple-50 text-purple-700 transform scale-105' 
                          : hasUsedAI
                          ? 'border-green-600 bg-green-50 text-green-600 cursor-not-allowed'
                          : icpData.isGenerated
                          ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          : 'border-gray-400 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isGeneratingLeads ? (
                        <>
                          {generationPhase === 'analyzing' && (
                            <>
                              <Brain className="w-4 h-4 mr-2 animate-pulse" />
                              Analyzing...
                            </>
                          )}
                          {generationPhase === 'searching' && (
                            <>
                              <Search className="w-4 h-4 mr-2 animate-bounce" />
                              Searching...
                            </>
                          )}
                          {generationPhase === 'validating' && (
                            <>
                              <Shield className="w-4 h-4 mr-2 animate-spin" />
                              Validating...
                            </>
                          )}
                          {generationPhase === 'complete' && (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2 animate-bounce" />
                              Complete!
                            </>
                          )}
                        </>
                      ) : hasUsedAI ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          AI Generated
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Use AI
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className={`text-center p-6 bg-gradient-to-br rounded-xl border transition-all duration-300 ${
                  icpData.isGenerated && hasUsedAI
                    ? 'from-green-50 to-emerald-50 border-green-200' 
                    : 'from-gray-50 to-gray-100 border-gray-300'
                }`}>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                    icpData.isGenerated && hasUsedAI
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                    icpData.isGenerated && hasUsedAI ? 'text-gray-900' : 'text-gray-500'
                  }`}>3. Launch Outreach</h3>
                  <p className={`mb-4 transition-all duration-300 ${
                    icpData.isGenerated && hasUsedAI
                      ? 'text-gray-600' 
                      : 'text-gray-500'
                  }`}>
                    {icpData.isGenerated && hasUsedAI
                      ? 'Use AI-powered messaging and multi-channel orchestration'
                      : 'Complete steps 1 & 2 to enable campaign launch'
                    }
                  </p>
                  <Button 
                    variant="outline"
                    disabled={!icpData.isGenerated || !hasUsedAI}
                    onClick={() => {
                      // Add smooth transition effect
                      const onboardingCard = document.querySelector('[data-onboarding-card]');
                      if (onboardingCard) {
                        onboardingCard.classList.add('animate-out', 'fade-out-0', 'zoom-out-95', 'duration-500');
                        setTimeout(() => {
                          setHasLaunchedOutreach(true);
                          setActiveTab("ai-engine");
                        }, 500);
                      } else {
                        setHasLaunchedOutreach(true);
                        setActiveTab("ai-engine");
                      }
                    }}
                    className={`transition-all duration-300 ${
                      icpData.isGenerated && hasUsedAI
                        ? 'border-green-600 text-green-600 hover:bg-green-50'
                        : 'border-gray-400 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Start Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => {
          if (value !== "ai-engine") {
            setSelectedLeadForOutreach("");
          }
          setActiveTab(value);
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            {/* <TabsTrigger value="ai-engine">AI Engine</TabsTrigger>
            <TabsTrigger value="ai-agent" className="relative">
              AI Agent
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></span>
            </TabsTrigger>
            <TabsTrigger value="mailbox" className="relative">
              Mailbox
              {(outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0) && leads.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {Math.min(outreachStats.emailLeads.length + outreachStats.linkedinLeads.length, 9)}
                </span>
              )}
            </TabsTrigger> */}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {leads.length > 0 && icpData.isGenerated ? (
              <>
                {/* ICP Intelligence Section */}
                {icpData.isGenerated && leads.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                        <span>ICP Intelligence Overview</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {icpData.confidence}% Confidence
                        </Badge>
                  </CardTitle>
                      <CardDescription>
                        AI-powered insights based on your lead data and outreach performance
                      </CardDescription>
                </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                          <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600 mb-1">{(icpData.totalAddressableMarket || Math.max(leads.length * 2500, 25000)).toLocaleString()}</div>
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-sm text-gray-600">Total Addressable Market</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>Total Addressable Market (TAM):</strong> The total market demand for your product or service within your target segments. 
                                  Calculated based on your lead data, industry size, and ICP criteria. This represents the maximum revenue opportunity if you captured 100% market share.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <Bot className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {getAIMetrics().phoneSuccessRate}%
                          </div>
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-sm text-gray-600">AI Phone Success Rate</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>AI Phone Success Rate:</strong> Percentage of phone calls that result in meaningful conversations or appointments. 
                                  Calculated as successful connections ÷ total calls made. Industry average is 25-35%. Higher rates indicate better targeting and script quality.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-xs text-gray-500">({getAIMetrics().actualConnections}/{outreachStats.callsMade} calls)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {getAIMetrics().messageResponses}
                          </div>
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-sm text-gray-600">AI Message Responses</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>AI Message Responses:</strong> Total number of replies received from your email and LinkedIn outreach campaigns. 
                                  Includes positive responses, questions, and engagement from prospects. Higher numbers indicate effective messaging and targeting.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-xs text-gray-500">({outreachStats.emailsSent + outreachStats.linkedinConnections} sent)</p>
                        </div>
                        
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-orange-600 mb-1">{getAIMetrics().conversionPrediction}%</div>
                          <div className="flex items-center justify-center space-x-1">
                            <p className="text-sm text-gray-600">Predicted Conversion</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>Predicted Conversion Rate:</strong> AI-calculated probability of converting leads into customers based on lead quality, engagement patterns, and ICP match scores. 
                                  Uses machine learning to analyze lead behavior and historical conversion patterns.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-xs text-gray-500">Based on lead quality</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Building className="w-4 h-4 text-purple-600" />
                            <span>Top Industries</span>
                          </h4>
                          <div className="space-y-3">
                            {getActualIndustryBreakdown().length > 0 ? (
                              getActualIndustryBreakdown().map((item) => (
                                <div key={item.industry} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="font-medium text-gray-900">{item.industry}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{item.count} leads</span>
                                    <Badge variant="outline">{item.percentage}%</Badge>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">No industry data yet</p>
                                <p className="text-xs">Add leads to see breakdown</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                            <span>Lead Quality Distribution</span>
                          </h4>
                          <div className="space-y-3">
                            {['Hot', 'Warm', 'Cold'].map((tier) => {
                              const tierLeads = leads.filter(lead => lead.tier === tier).length;
                              const percentage = leads.length > 0 ? Math.round((tierLeads / leads.length) * 100) : 0;
                              const bgColor = tier === 'Hot' ? 'bg-red-50 border-red-200' : 
                                            tier === 'Warm' ? 'bg-yellow-50 border-yellow-200' : 
                                            'bg-blue-50 border-blue-200';
                              const textColor = tier === 'Hot' ? 'text-red-700' : 
                                              tier === 'Warm' ? 'text-yellow-700' : 
                                              'text-blue-700';
                              return (
                                <div key={tier} className={`flex items-center justify-between p-3 ${bgColor} rounded-lg border`}>
                                  <span className={`font-medium ${textColor}`}>{tier} Leads</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{tierLeads} leads</span>
                                    <Badge variant="outline">{percentage}%</Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance & Revenue Section */}
                {(outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0 || leads.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <span>Outreach Performance</span>
                      </CardTitle>
                      <CardDescription>Multi-channel AI-powered outreach results</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl">
                          <div className="flex items-center space-x-2 mb-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Email</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">{outreachStats.emailsSent}</div>
                            <div className="text-sm text-gray-600">Messages sent</div>
                            <div className="text-xs text-blue-600">~{Math.round(outreachStats.emailsSent * 0.24)} responses</div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl">
                          <div className="flex items-center space-x-2 mb-3">
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="font-medium">LinkedIn</span>
                        </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">{outreachStats.linkedinConnections}</div>
                            <div className="text-sm text-gray-600">Messages sent</div>
                            <div className="text-xs text-blue-600">~{Math.round(outreachStats.linkedinConnections * 0.18)} responses</div>
                      </div>
                        </div>
                        
                        <div className="p-4 border border-purple-200 bg-purple-50 rounded-xl">
                          <div className="flex items-center space-x-2 mb-3">
                            <Phone className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">Phone</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">{outreachStats.callsMade}</div>
                            <div className="text-sm text-gray-600">Calls made</div>
                            <div className="text-xs text-purple-600">~{Math.round(outreachStats.callsMade * 0.67)} connected</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span>Revenue Intelligence</span>
                      </CardTitle>
                      <CardDescription>Pipeline value and conversion projections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-xs text-green-600">Current</span>
                          </div>
                          <div className="text-xl font-bold text-green-600 mb-1">
                            ${getRevenueProjections().pipelineValue.toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-1">
                            <p className="text-xs text-gray-600">Pipeline Value</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>Pipeline Value:</strong> Current potential revenue based on qualified leads × AI conversion rate × average deal size ($55K). 
                                  Calculated as: {getRevenueProjections().currentConversions} expected conversions × $55,000 = ${getRevenueProjections().pipelineValue.toLocaleString()}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                      </div>
                    </div>
                    
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <span className="text-xs text-purple-600">Projected</span>
                          </div>
                          <div className="text-xl font-bold text-purple-600 mb-1">
                            ${getRevenueProjections().annualProjection.toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-1">
                            <p className="text-xs text-gray-600">Annual Potential</p>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  <strong>Annual Potential:</strong> Projected yearly revenue based on TAM × market penetration (8%) × AI success rates × conversion prediction. 
                                  Factors in your total addressable market, outreach performance, and AI optimization to estimate realistic annual revenue potential.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Total Outreach</span>
                          <span className="font-semibold">{(outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Qualified Leads</span>
                          <span className="font-semibold">{outreachStats.qualifiedLeads}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Expected Conversions</span>
                          <span className="font-semibold">{getRevenueProjections().currentConversions}</span>
                        </div>
                      </div>
                    </CardContent>
                                    </Card>
                    </div>
                )}

                {/* AI Insights - only show if there's meaningful data */}
                {(leads.length > 0 || outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0) && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span>AI Recommendations</span>
                    </CardTitle>
                    <CardDescription>Intelligent insights based on your data and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">Focus Industries</span>
                  </div>
                        <p className="text-sm text-gray-600">
                          {getActualIndustryBreakdown().length > 0 ? 
                            `${getActualIndustryBreakdown().slice(0, 2).map(i => i.industry).join(' and ')} companies show ${getAIMetrics().conversionPrediction}% higher conversion rates` :
                            'Focus on qualifying leads to optimize conversion rates'
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Optimal Timing</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          AI phone agent performs best {outreachStats.callsMade > 10 ? 'with your current lead quality' : 'with 20+ daily calls for maximum efficiency'}
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Performance Boost</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade > 50 ? 
                            '+18% optimization achieved through consistent activity' : 
                            'Reach 50+ total outreach activities for +18% performance boost'}
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <BarChart3 className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-900">Lead Quality</span>
                      </div>
                        <p className="text-sm text-gray-600">
                          Current {Math.round((outreachStats.qualifiedLeads / outreachStats.totalLeads) * 100) || 0}% qualification rate - 
                          {outreachStats.qualifiedLeads > outreachStats.totalLeads * 0.3 ? ' excellent performance!' : ' focus on hot leads for better conversion'}
                        </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                )}
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Complete the steps above to see your dashboard analytics and AI insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList onSwitchToAIEngine={(leadId) => {
              setSelectedLeadForOutreach(leadId || "");
              setActiveTab("ai-engine");
            }} />
          </TabsContent>

          <TabsContent value="ai-engine">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NLPMessageGenerator initialLeadId={selectedLeadForOutreach} />
                <AIPhoneAgent />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-agent">
            <AIAgent />
          </TabsContent>

          <TabsContent value="mailbox">
            <Mailbox />
          </TabsContent>

          <TabsContent value="profile">
            <Profile userData={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>

        {/* ICP Generation Success Popup */}
        {showICPSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-in zoom-in-50 duration-300">
              {/* Header with celebration gradient */}
              <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 p-6 rounded-t-2xl text-white text-center relative overflow-hidden">
                {/* Floating particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute top-6 right-12 w-1 h-1 bg-white/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-4 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.7s' }}></div>
                  <div className="absolute top-8 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute bottom-6 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.1s' }}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-center space-x-3 mb-2">
                  <div className="relative">
                    <Target className="w-10 h-10 text-white animate-bounce" />
                    <div className="absolute inset-0 w-10 h-10 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="relative">
                    <Brain className="w-10 h-10 text-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-1">ICP Generated Successfully!</h2>
                <p className="text-purple-100">Your Ideal Customer Profile is ready</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Lead Scoring Enhanced</p>
                      <p className="text-sm text-gray-600">ICP criteria applied to all leads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Messaging Templates Created</p>
                      <p className="text-sm text-gray-600">Industry-specific outreach ready</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AI Engine Optimized</p>
                      <p className="text-sm text-gray-600">Personalized campaigns enabled</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleICPSuccessDismiss('add-leads')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Leads
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleICPSuccessDismiss('continue')}
                    className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Continue Setup
                  </Button>
                </div>

                {/* Close button */}
                <button 
                  onClick={() => handleICPSuccessDismiss()}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Lead Generation Success Popup */}
        {showAISuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-in zoom-in-50 duration-300">
              {/* Header with celebration gradient */}
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-6 rounded-t-2xl text-white text-center relative overflow-hidden">
                {/* Floating particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute top-6 right-12 w-1 h-1 bg-white/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-4 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.7s' }}></div>
                  <div className="absolute top-8 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute bottom-6 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.1s' }}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-center space-x-3 mb-2">
                  <div className="relative">
                    <CheckCircle className="w-10 h-10 text-white animate-bounce" />
                    <div className="absolute inset-0 w-10 h-10 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="relative">
                    <Rocket className="w-10 h-10 text-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-1">Leads Generated Successfully!</h2>
                <p className="text-green-100">3 high-quality prospects found and validated</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">TechFlow Solutions</p>
                      <p className="text-sm text-gray-600">Score: 92 (Hot Lead)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">DataSync Corp</p>
                      <p className="text-sm text-gray-600">Score: 87 (Warm Lead)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">CloudVenture Inc</p>
                      <p className="text-sm text-gray-600">Score: 81 (Warm Lead)</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleSuccessDismiss('view-leads')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Leads
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSuccessDismiss('continue')}
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Continue Setup
                  </Button>
                </div>

                {/* Close button */}
                <button 
                  onClick={() => handleSuccessDismiss()}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
    </TooltipProvider>
  );
};

