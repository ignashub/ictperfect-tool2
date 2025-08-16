import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Linkedin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Play, 
  Pause, 
  Settings,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Clock,
  Target,
  Activity,
  BarChart3,
  Eye,
  MousePointer,
  CheckCircle,
  XCircle
} from "lucide-react";

interface LinkedInMetrics {
  profileViews: number;
  postEngagement: number;
  contentShares: number;
  followerGrowth: number;
  industryBreakdown: Record<string, number>;
  seniorityLevel: Record<string, number>;
}

interface EmailMetrics {
  deliveryRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  spamRate: number;
  clickThroughRate: number;
  forwardRate: number;
  timeToOpen: string;
  deviceBreakdown: Record<string, number>;
}

interface PhoneMetrics {
  voicemailRate: number;
  callbackRate: number;
  avgCallDuration: string;
  qualifiedLeads: number;
  timeZoneBreakdown: Record<string, number>;
  callOutcome: Record<string, number>;
}

interface DetailedMetrics {
  linkedin: LinkedInMetrics;
  email: EmailMetrics;
  phone: PhoneMetrics;
}

export const ChannelOrchestration = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "SaaS Decision Makers Q4",
      status: "active",
      leads: 245,
      currentStep: 3,
      totalSteps: 7,
      channels: ["linkedin", "email", "phone"],
      performance: { sent: 180, opened: 126, replied: 23, meetings: 8 },
      budget: 2500,
      spent: 1680,
      roi: 340,
      startDate: "2024-01-15",
      endDate: "2024-03-15"
    },
    {
      id: 2,
      name: "Enterprise Tech Leaders",
      status: "paused",
      leads: 89,
      currentStep: 2,
      totalSteps: 5,
      channels: ["email", "linkedin"],
      performance: { sent: 65, opened: 42, replied: 12, meetings: 4 },
      budget: 1200,
      spent: 890,
      roi: 180,
      startDate: "2024-02-01",
      endDate: "2024-04-01"
    },
    {
      id: 3,
      name: "Mid-Market Software",
      status: "draft",
      leads: 156,
      currentStep: 1,
      totalSteps: 6,
      channels: ["phone", "email", "linkedin"],
      performance: { sent: 0, opened: 0, replied: 0, meetings: 0 },
      budget: 3000,
      spent: 0,
      roi: 0,
      startDate: "2024-03-01",
      endDate: "2024-05-01"
    }
  ]);

  const [channelStats, setChannelStats] = useState({
    linkedin: { 
      sent: 456, 
      connected: 289, 
      replied: 94, 
      meetings: 23,
      rate: 20.6,
      trend: "+5.2%",
      avgResponseTime: "2.3 hours",
      bestTimeToSend: "Tue 10-11 AM",
      connectionRate: 63.4,
      cost: "$2.50 per connection"
    },
    email: { 
      sent: 1203, 
      opened: 734, 
      replied: 156, 
      meetings: 34,
      rate: 12.9,
      trend: "+2.1%",
      avgResponseTime: "4.7 hours",
      bestTimeToSend: "Thu 9-10 AM",
      openRate: 61.0,
      cost: "$0.25 per email"
    },
    phone: { 
      sent: 145, 
      connected: 67, 
      replied: 34, 
      meetings: 18,
      rate: 23.4,
      trend: "+8.4%",
      avgResponseTime: "1.2 hours",
      bestTimeToCall: "Wed 2-3 PM",
      connectionRate: 46.2,
      cost: "$5.00 per call"
    }
  });

  const [detailedMetrics, setDetailedMetrics] = useState<DetailedMetrics>({
    linkedin: {
      profileViews: 1234,
      postEngagement: 567,
      contentShares: 89,
      followerGrowth: 156,
      industryBreakdown: {
        "Technology": 45,
        "Finance": 23,
        "Healthcare": 18,
        "Manufacturing": 14
      },
      seniorityLevel: {
        "C-Level": 12,
        "VP": 28,
        "Director": 35,
        "Manager": 25
      }
    },
    email: {
      deliveryRate: 97.8,
      bounceRate: 2.2,
      unsubscribeRate: 0.8,
      spamRate: 0.1,
      clickThroughRate: 3.4,
      forwardRate: 1.2,
      timeToOpen: "3.2 hours",
      deviceBreakdown: {
        "Desktop": 52,
        "Mobile": 41,
        "Tablet": 7
      }
    },
    phone: {
      voicemailRate: 45,
      callbackRate: 15,
      avgCallDuration: "4.2 min",
      qualifiedLeads: 28,
      timeZoneBreakdown: {
        "EST": 40,
        "CST": 25,
        "MST": 15,
        "PST": 20
      },
      callOutcome: {
        "Connected": 46,
        "Voicemail": 45,
        "Busy": 6,
        "No Answer": 3
      }
    }
  });

  const [sequenceSteps, setSequenceSteps] = useState([
    { id: 1, channel: "linkedin", action: "Connection Request", delay: "Day 0", active: true, performance: { sent: 245, success: 156 } },
    { id: 2, channel: "linkedin", action: "Follow-up Message", delay: "Day 3", active: true, performance: { sent: 156, success: 89 } },
    { id: 3, channel: "email", action: "Introduction Email", delay: "Day 5", active: true, performance: { sent: 89, success: 54 } },
    { id: 4, channel: "linkedin", action: "Value-add Post Share", delay: "Day 8", active: false, performance: { sent: 0, success: 0 } },
    { id: 5, channel: "email", action: "Case Study Follow-up", delay: "Day 12", active: true, performance: { sent: 54, success: 23 } },
    { id: 6, channel: "phone", action: "Direct Call", delay: "Day 15", active: false, performance: { sent: 0, success: 0 } },
    { id: 7, channel: "email", action: "Final Outreach", delay: "Day 20", active: true, performance: { sent: 23, success: 8 } },
  ]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "linkedin": return <Linkedin className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      case "phone": return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "linkedin": return "border-blue-200 bg-blue-50";
      case "email": return "border-green-200 bg-green-50";
      case "phone": return "border-purple-200 bg-purple-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const toggleCampaign = (id: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === "active" ? "paused" : "active" }
        : campaign
    ));
  };

  const toggleSequenceStep = (stepId: number) => {
    setSequenceSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, active: !step.active }
        : step
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="w-5 h-5 text-purple-600" />
            <span>Channel Orchestration</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              AI Optimized
            </Badge>
          </CardTitle>
          <CardDescription>
            Unified multi-channel outreach campaigns with AI-driven sequencing and advanced analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="sequences">Sequences</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(channelStats).map(([channel, stats]) => (
                  <Card key={channel} className={`border ${getChannelColor(channel)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(channel)}
                          <span className="font-medium capitalize">{channel}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          {stats.trend}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.rate}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {stats.meetings} meetings from {stats.sent} outreach
                        </div>
                        <div className="text-xs text-gray-500">
                          Avg response: {stats.avgResponseTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stats.cost}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Meeting scheduled</div>
                        <div className="text-xs text-gray-600">TechFlow Solutions - Sarah Johnson</div>
                      </div>
                      <div className="text-xs text-gray-500">2 min ago</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Email opened</div>
                        <div className="text-xs text-gray-600">DataSync Corp - Michael Chen</div>
                      </div>
                      <div className="text-xs text-gray-500">5 min ago</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Call completed</div>
                        <div className="text-xs text-gray-600">CloudVenture Inc - Emily Rodriguez</div>
                      </div>
                      <div className="text-xs text-gray-500">12 min ago</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Performance Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Outreach</span>
                      <span className="font-semibold">1,804</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-semibold text-green-600">15.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Meetings Booked</span>
                      <span className="font-semibold text-blue-600">75</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pipeline Generated</span>
                      <span className="font-semibold text-purple-600">$2.1M</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ROI</span>
                        <span className="font-bold text-green-600">340%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-lg">{campaign.name}</div>
                              <div className="text-sm text-gray-600">{campaign.leads} leads • {campaign.startDate} - {campaign.endDate}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={campaign.status === "active" ? "default" : campaign.status === "paused" ? "secondary" : "outline"}>
                                {campaign.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleCampaign(campaign.id)}
                                disabled={campaign.status === "draft"}
                              >
                                {campaign.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">Progress</div>
                              <div className="text-lg font-semibold">Step {campaign.currentStep}/{campaign.totalSteps}</div>
                              <Progress value={(campaign.currentStep / campaign.totalSteps) * 100} className="mt-1" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Budget</div>
                              <div className="text-lg font-semibold">${campaign.spent.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">of ${campaign.budget.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Meetings</div>
                              <div className="text-lg font-semibold text-green-600">{campaign.performance.meetings}</div>
                              <div className="text-xs text-gray-500">{campaign.performance.replied} replies</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">ROI</div>
                              <div className="text-lg font-semibold text-purple-600">{campaign.roi}%</div>
                              <div className="text-xs text-gray-500">Pipeline generated</div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {campaign.channels.map((channel) => (
                              <div key={channel} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
                                {getChannelIcon(channel)}
                                <span className="text-xs capitalize">{channel}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

                         <TabsContent value="analytics" className="space-y-6">
               <div className="space-y-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                       <Linkedin className="w-5 h-5 text-blue-600" />
                       <span>LinkedIn Analytics</span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Profile Views</div>
                         <div className="text-2xl font-bold">{detailedMetrics.linkedin.profileViews.toLocaleString()}</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Post Engagement</div>
                         <div className="text-2xl font-bold">{detailedMetrics.linkedin.postEngagement}</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Content Shares</div>
                         <div className="text-2xl font-bold">{detailedMetrics.linkedin.contentShares}</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Follower Growth</div>
                         <div className="text-2xl font-bold text-green-600">+{detailedMetrics.linkedin.followerGrowth}</div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                       <Mail className="w-5 h-5 text-green-600" />
                       <span>Email Analytics</span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Delivery Rate</div>
                         <div className="text-2xl font-bold text-green-600">{detailedMetrics.email.deliveryRate}%</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Click-Through Rate</div>
                         <div className="text-2xl font-bold">{detailedMetrics.email.clickThroughRate}%</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Bounce Rate</div>
                         <div className="text-2xl font-bold text-red-600">{detailedMetrics.email.bounceRate}%</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Time to Open</div>
                         <div className="text-2xl font-bold">{detailedMetrics.email.timeToOpen}</div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center space-x-2">
                       <Phone className="w-5 h-5 text-purple-600" />
                       <span>Phone Analytics</span>
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Connection Rate</div>
                         <div className="text-2xl font-bold text-green-600">{channelStats.phone.connectionRate}%</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Avg Call Duration</div>
                         <div className="text-2xl font-bold">{detailedMetrics.phone.avgCallDuration}</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Qualified Leads</div>
                         <div className="text-2xl font-bold text-purple-600">{detailedMetrics.phone.qualifiedLeads}</div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-gray-600">Callback Rate</div>
                         <div className="text-2xl font-bold">{detailedMetrics.phone.callbackRate}%</div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>

            <TabsContent value="sequences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Sequence Builder</span>
                  </CardTitle>
                  <CardDescription>Configure your multi-channel outreach sequence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sequenceSteps.map((step, index) => (
                      <div key={step.id} className={`p-4 border rounded-lg ${step.active ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                {step.id}
                              </div>
                              {getChannelIcon(step.channel)}
                            </div>
                            <div>
                              <div className="font-medium">{step.action}</div>
                              <div className="text-sm text-gray-600">{step.delay}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">{step.performance.success}/{step.performance.sent}</div>
                              <div className="text-xs text-gray-500">
                                {step.performance.sent > 0 ? Math.round((step.performance.success / step.performance.sent) * 100) : 0}% success rate
                              </div>
                            </div>
                            <Switch
                              checked={step.active}
                              onCheckedChange={() => toggleSequenceStep(step.id)}
                            />
                          </div>
                        </div>
                        {index < sequenceSteps.length - 1 && (
                          <div className="ml-4 mt-2">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 