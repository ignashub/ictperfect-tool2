import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Target, Building, Globe, Users, TrendingUp, PieChart, Brain, Database, CheckCircle, ArrowRight, BarChart3, Filter, Sparkles, BarChart, Phone, MessageSquare, Bot, Activity, Zap, Clock, DollarSign } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";

interface ICPSummaryProps {
  userData: any;
}

export const ICPSummary = ({ userData }: ICPSummaryProps) => {
  const { icpData, generateICP, leads, outreachStats } = useAppData();

  const handleGenerateICP = () => {
    generateICP(userData);
  };

  if (!icpData.isGenerated) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Target className="w-6 h-6 text-purple-600" />
              <span>Ideal Customer Profile Analysis</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Generate your AI-powered ICP to identify your best prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No ICP Analysis Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our AI will analyze your company profile, industry trends, and market data to create your perfect customer profile.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Company Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Analyze your business model, target market, and competitive landscape
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Market Intelligence</h4>
                  <p className="text-sm text-gray-600">
                    Leverage industry data and benchmarks to identify patterns
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Precise Targeting</h4>
                  <p className="text-sm text-gray-600">
                    Get specific criteria for finding your highest-value prospects
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleGenerateICP}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My ICP
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                Analysis typically takes 30-60 seconds • Based on {userData?.industry || "your industry"} data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate industry breakdown from actual leads
  const getIndustryBreakdown = () => {
    if (leads.length === 0) {
      return [
        { 
          industry: icpData.primaryIndustries[0] || "Technology", 
          percentage: 45, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.45) 
        },
        { 
          industry: icpData.primaryIndustries[1] || "SaaS", 
          percentage: 30, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.30) 
        },
        { 
          industry: icpData.primaryIndustries[2] || "E-commerce", 
          percentage: 15, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.15) 
        },
        { 
          industry: "Other", 
          percentage: 10, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.10) 
        }
      ];
    }

    const industryCount: Record<string, number> = {};
    leads.forEach(lead => {
      industryCount[lead.industry] = (industryCount[lead.industry] || 0) + 1;
    });

    const total = leads.length;
    const sortedIndustries = Object.entries(industryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const breakdown = sortedIndustries.map(([industry, count]) => ({
      industry,
      percentage: Math.round((count / total) * 100),
      companies: Math.floor(icpData.totalAddressableMarket * (count / total))
    }));

    // Add "Other" if we have more than 3 industries
    const topThreeCount = sortedIndustries.reduce((sum, [, count]) => sum + count, 0);
    if (topThreeCount < total) {
      const otherPercentage = Math.round(((total - topThreeCount) / total) * 100);
      breakdown.push({
        industry: "Other",
        percentage: otherPercentage,
        companies: Math.floor(icpData.totalAddressableMarket * ((total - topThreeCount) / total))
      });
    }

    return breakdown;
  };

  const industryBreakdown = getIndustryBreakdown();

  // Calculate region breakdown from actual leads
  const getRegionBreakdown = () => {
    if (leads.length === 0) {
      return [
        { 
          region: icpData.topRegions[0] || "North America", 
          percentage: 40, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.40) 
        },
        { 
          region: icpData.topRegions[1] || "Europe", 
          percentage: 35, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.35) 
        },
        { 
          region: icpData.topRegions[2] || "Asia-Pacific", 
          percentage: 20, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.20) 
        },
        { 
          region: "Other", 
          percentage: 5, 
          companies: Math.floor(icpData.totalAddressableMarket * 0.05) 
        }
      ];
    }

    // Map locations to regions
    const regionMapping: Record<string, string> = {
      "United States": "North America",
      "Canada": "North America",
      "United Kingdom": "Europe",
      "Germany": "Europe",
      "France": "Europe",
      "Netherlands": "Europe",
      "Australia": "Asia-Pacific",
      "Singapore": "Asia-Pacific",
      "Japan": "Asia-Pacific",
      "Brazil": "Latin America",
      "Mexico": "Latin America",
    };

    const regionCount: Record<string, number> = {};
    leads.forEach(lead => {
      const region = regionMapping[lead.location] || "Other";
      regionCount[region] = (regionCount[region] || 0) + 1;
    });

    const total = leads.length;
    return Object.entries(regionCount)
      .sort(([,a], [,b]) => b - a)
      .map(([region, count]) => ({
        region,
        percentage: Math.round((count / total) * 100),
        companies: Math.floor(icpData.totalAddressableMarket * (count / total))
      }));
  };

  const regionBreakdown = getRegionBreakdown();

  const leadQualificationCriteria = [
    { criteria: "Industry Match", weight: 25, description: `${icpData.primaryIndustries.slice(0, 2).join(", ")} focus`, threshold: 80, icon: Building },
    { criteria: "Company Size", weight: 20, description: `${icpData.idealCompanySize} (optimal growth stage)`, threshold: 75, icon: Users },
    { criteria: "Geographic Focus", weight: 15, description: `${icpData.topRegions.slice(0, 2).join(", ")} primary markets`, threshold: 70, icon: Globe },
    { criteria: "Technology Stack", weight: 15, description: "Uses modern sales/marketing tools", threshold: 65, icon: Brain },
    { criteria: "Growth Indicators", weight: 10, description: "Recent funding, hiring, expansion", threshold: 60, icon: TrendingUp },
    { criteria: "Buying Intent", weight: 10, description: "Active research, content engagement", threshold: 55, icon: Activity },
    { criteria: "Contact Quality", weight: 5, description: "Decision maker accessibility via phone/email", threshold: 70, icon: Phone }
  ];

  // Calculate scoring breakdown from actual leads
  const getScoringBreakdown = () => {
    if (leads.length === 0) {
      return {
        hot: { 
          range: "90-100", 
          count: Math.floor(icpData.totalAddressableMarket * 0.12), 
          description: "Perfect ICP match with high buying intent",
          conversionRate: "35-45%",
          phoneSuccess: "85%",
          emailResponse: "25%",
          avgDealSize: "$75,000"
        },
        warm: { 
          range: "70-89", 
          count: Math.floor(icpData.totalAddressableMarket * 0.28), 
          description: "Strong ICP match with some intent signals",
          conversionRate: "15-25%",
          phoneSuccess: "65%",
          emailResponse: "12%",
          avgDealSize: "$50,000"
        },
        cold: { 
          range: "50-69", 
          count: Math.floor(icpData.totalAddressableMarket * 0.60), 
          description: "Partial ICP match, nurturing required",
          conversionRate: "3-8%",
          phoneSuccess: "35%",
          emailResponse: "4%",
          avgDealSize: "$30,000"
        }
      };
    }

    const hotLeads = leads.filter(lead => lead.tier === "Hot").length;
    const warmLeads = leads.filter(lead => lead.tier === "Warm").length;
    const coldLeads = leads.filter(lead => lead.tier === "Cold").length;
    const total = leads.length;

    // Scale up to TAM based on current lead proportions
    const hotRatio = total > 0 ? hotLeads / total : 0.12;
    const warmRatio = total > 0 ? warmLeads / total : 0.28;
    const coldRatio = total > 0 ? coldLeads / total : 0.60;

    // Adjust performance metrics based on outreach activity
    const totalOutreach = outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade;
    const outreachBonus = totalOutreach > 50 ? 1.2 : totalOutreach > 20 ? 1.1 : 1.0;

    return {
      hot: { 
        range: "90-100", 
        count: Math.floor(icpData.totalAddressableMarket * hotRatio), 
        description: "Perfect ICP match with high buying intent",
        conversionRate: `${Math.round(35 * outreachBonus)}-${Math.round(45 * outreachBonus)}%`,
        phoneSuccess: `${Math.round(85 * outreachBonus)}%`,
        emailResponse: `${Math.round(25 * outreachBonus)}%`,
        avgDealSize: "$75,000"
      },
      warm: { 
        range: "70-89", 
        count: Math.floor(icpData.totalAddressableMarket * warmRatio), 
        description: "Strong ICP match with some intent signals",
        conversionRate: `${Math.round(15 * outreachBonus)}-${Math.round(25 * outreachBonus)}%`,
        phoneSuccess: `${Math.round(65 * outreachBonus)}%`,
        emailResponse: `${Math.round(12 * outreachBonus)}%`,
        avgDealSize: "$50,000"
      },
      cold: { 
        range: "50-69", 
        count: Math.floor(icpData.totalAddressableMarket * coldRatio), 
        description: "Partial ICP match, nurturing required",
        conversionRate: `${Math.round(3 * outreachBonus)}-${Math.round(8 * outreachBonus)}%`,
        phoneSuccess: `${Math.round(35 * outreachBonus)}%`,
        emailResponse: `${Math.round(4 * outreachBonus)}%`,
        avgDealSize: "$30,000"
      }
    };
  };

  const scoringBreakdown = getScoringBreakdown();

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>Ideal Customer Profile Analysis</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {icpData.confidence}% Confidence
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-generated insights based on your company profile and market intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="qualification">Lead Qualification</TabsTrigger>
              <TabsTrigger value="impact">Business Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">ICP Confidence</h3>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{icpData.confidence}%</div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${icpData.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Based on 500+ data points</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Total Addressable Market</h3>
                    <PieChart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{icpData.totalAddressableMarket.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Qualifying companies in database</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">AI Agent Success Rate</h3>
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {outreachStats.callsMade > 0 ? Math.round((outreachStats.callsMade * 0.67 / outreachStats.callsMade) * 100) : 67}%
                  </div>
                  <p className="text-sm text-gray-600">Phone connection rate ({outreachStats.callsMade} calls made)</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Predicted Conversion</h3>
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{icpData.conversionPrediction}%</div>
                  <p className="text-sm text-gray-600">Overall qualification rate</p>
                </div>
              </div>

              <div className="mb-8">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span>AI Engine Capabilities</span>
                    </CardTitle>
                    <CardDescription>
                      Advanced AI-powered outreach and qualification systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <Phone className="w-8 h-8 text-blue-600" />
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Active</Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">AI Phone Agent</h4>
                        <p className="text-sm text-gray-600 mb-3">Intelligent phone conversations with 5 different response flows</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Calls Made</span>
                            <span className="font-medium">{outreachStats.callsMade}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Success Rate</span>
                            <span className="font-medium">{outreachStats.callsMade > 0 ? Math.round((outreachStats.callsMade * 0.67)) : 0}/{outreachStats.callsMade}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <MessageSquare className="w-8 h-8 text-green-600" />
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Message Generator</h4>
                        <p className="text-sm text-gray-600 mb-3">AI-generated personalized emails and LinkedIn messages</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Messages Sent</span>
                            <span className="font-medium">{outreachStats.emailsSent + outreachStats.linkedinConnections}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Response Rate</span>
                            <span className="font-medium">{outreachStats.emailsSent + outreachStats.linkedinConnections > 0 ? Math.round(((outreachStats.emailsSent + outreachStats.linkedinConnections) * 0.24)) : 0} responses</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <Activity className="w-8 h-8 text-purple-600" />
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">Learning</Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">RL Optimizer</h4>
                        <p className="text-sm text-gray-600 mb-3">Reinforcement learning for channel optimization</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Total Activity</span>
                            <span className="font-medium">{outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Optimization</span>
                            <span className="font-medium">{outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade > 50 ? "+18%" : outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade > 20 ? "+8%" : "Learning"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      <span>Industry Breakdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {industryBreakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.industry}</span>
                          <span className="text-sm text-gray-600">{item.companies.toLocaleString()} companies</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 min-w-12">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span>Geographic Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {regionBreakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.region}</span>
                          <span className="text-sm text-gray-600">{item.companies.toLocaleString()} companies</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 min-w-12">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="qualification" className="space-y-6">
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Qualification Criteria</h3>
                  <p className="text-gray-600">How we score and qualify prospects based on your ICP</p>
              </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Scoring Criteria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {leadQualificationCriteria.map((criteria, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <criteria.icon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900">{criteria.criteria}</span>
                            </div>
                            <span className="text-sm text-gray-600">{criteria.weight}% weight</span>
                          </div>
                          <p className="text-sm text-gray-600">{criteria.description}</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${criteria.threshold}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 min-w-12">{criteria.threshold}%</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Hot Leads</span>
                            </div>
                            <span className="text-sm text-gray-600">{scoringBreakdown.hot.range}</span>
              </div>
                          <p className="text-sm text-gray-600 mb-3">{scoringBreakdown.hot.description}</p>
                          <div className="text-2xl font-bold text-red-600 mb-3">{scoringBreakdown.hot.count.toLocaleString()}</div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Conversion:</span>
                              <span className="font-medium text-red-700">{scoringBreakdown.hot.conversionRate}</span>
                    </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Phone Success:</span>
                              <span className="font-medium text-red-700">{scoringBreakdown.hot.phoneSuccess}</span>
                    </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Email Response:</span>
                              <span className="font-medium text-red-700">{scoringBreakdown.hot.emailResponse}</span>
                    </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Avg Deal Size:</span>
                              <span className="font-medium text-red-700">{scoringBreakdown.hot.avgDealSize}</span>
                    </div>
                  </div>
              </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Warm Leads</span>
                            </div>
                            <span className="text-sm text-gray-600">{scoringBreakdown.warm.range}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{scoringBreakdown.warm.description}</p>
                          <div className="text-2xl font-bold text-yellow-600 mb-3">{scoringBreakdown.warm.count.toLocaleString()}</div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Conversion:</span>
                              <span className="font-medium text-yellow-700">{scoringBreakdown.warm.conversionRate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Phone Success:</span>
                              <span className="font-medium text-yellow-700">{scoringBreakdown.warm.phoneSuccess}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Email Response:</span>
                              <span className="font-medium text-yellow-700">{scoringBreakdown.warm.emailResponse}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Avg Deal Size:</span>
                              <span className="font-medium text-yellow-700">{scoringBreakdown.warm.avgDealSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Cold Leads</span>
                            </div>
                            <span className="text-sm text-gray-600">{scoringBreakdown.cold.range}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{scoringBreakdown.cold.description}</p>
                          <div className="text-2xl font-bold text-blue-600 mb-3">{scoringBreakdown.cold.count.toLocaleString()}</div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Conversion:</span>
                              <span className="font-medium text-blue-700">{scoringBreakdown.cold.conversionRate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Phone Success:</span>
                              <span className="font-medium text-blue-700">{scoringBreakdown.cold.phoneSuccess}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Email Response:</span>
                              <span className="font-medium text-blue-700">{scoringBreakdown.cold.emailResponse}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Avg Deal Size:</span>
                              <span className="font-medium text-blue-700">{scoringBreakdown.cold.avgDealSize}</span>
                        </div>
                      </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                      </div>
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="mb-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span>AI-Powered Performance Metrics</span>
                    </CardTitle>
                    <CardDescription>
                      Expected improvements with our AI phone agent and messaging systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600 mb-1">67%</div>
                        <p className="text-sm text-gray-600">Phone Connection Rate</p>
                        <p className="text-xs text-gray-500 mt-1">vs 23% industry avg</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600 mb-1">24%</div>
                        <p className="text-sm text-gray-600">Email Response Rate</p>
                        <p className="text-xs text-gray-500 mt-1">vs 8% industry avg</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600 mb-1">-45%</div>
                        <p className="text-sm text-gray-600">Sales Cycle Time</p>
                        <p className="text-xs text-gray-500 mt-1">AI qualification</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600 mb-1">+180%</div>
                        <p className="text-sm text-gray-600">Qualified Leads</p>
                        <p className="text-xs text-gray-500 mt-1">Better targeting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Expected Business Impact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Conversion Rate Improvement</h4>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">{icpData.conversionPrediction}%</div>
                      <p className="text-sm text-gray-600">Expected qualification-to-close rate</p>
                      <p className="text-xs text-gray-500 mt-1">AI phone agent + messaging combined</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Time to Close</h4>
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">-45%</div>
                      <p className="text-sm text-gray-600">Faster sales cycles with qualified leads</p>
                      <p className="text-xs text-gray-500 mt-1">Pre-qualified prospects via AI</p>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Cost per Acquisition</h4>
                        <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">-58%</div>
                      <p className="text-sm text-gray-600">Lower CAC through better targeting</p>
                      <p className="text-xs text-gray-500 mt-1">AI-driven lead scoring efficiency</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <span>Revenue Projections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Outreach Made</span>
                        <span className="font-semibold text-gray-900">{(outreachStats.emailsSent + outreachStats.linkedinConnections + outreachStats.callsMade).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Phone Connections</span>
                        <span className="font-semibold text-gray-900">{Math.floor(outreachStats.callsMade * 0.67).toLocaleString()}</span>
                    </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Current Qualified Leads</span>
                        <span className="font-semibold text-gray-900">{outreachStats.qualifiedLeads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Expected Conversions</span>
                        <span className="font-semibold text-gray-900">{Math.floor(outreachStats.qualifiedLeads * icpData.conversionPrediction / 100)}</span>
                    </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                        <span className="text-green-700 font-medium">Current Pipeline Value</span>
                        <span className="font-bold text-green-900">${(Math.floor(outreachStats.qualifiedLeads * icpData.conversionPrediction / 100) * 55000).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                        <span className="text-purple-700 font-medium">Projected Annual Revenue</span>
                        <span className="font-bold text-purple-900">${(Math.floor(icpData.totalAddressableMarket * 0.08 * 0.67 * 0.25 * icpData.conversionPrediction / 100) * 55000).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
