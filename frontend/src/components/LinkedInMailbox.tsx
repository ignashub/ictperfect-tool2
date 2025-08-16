import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  MessageCircle, UserPlus, Send, Search, Filter, RefreshCw,
  Clock, CheckCircle, User, Building, Linkedin, Bot,
  Users, TrendingUp, Award, Briefcase, Brain
} from "lucide-react";
import { useAppData } from "@/hooks/useAppData";

interface Lead {
  id: string;
  company: string;
  industry: string;
  location: string;
  employees: string;
  score: number;
  tier: "Hot" | "Warm" | "Cold";
  contact: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  revenue: string;
  founded: string;
  addedDate: string;
  source: "Manual" | "Import" | "AI Generated";
}

interface LinkedInMessage {
  id: string;
  from: string;
  fromProfile: string;
  to: string;
  toProfile: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromLead: boolean;
  leadId?: string;
  threadId: string;
  messageType: "connection_request" | "message" | "inmail";
}

interface LinkedInThread {
  id: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  leadProfile: string;
  connectionStatus: "pending" | "connected" | "not_connected";
  lastActivity: string;
  messageCount: number;
  unreadCount: number;
  messages: LinkedInMessage[];
  leadTier: "Hot" | "Warm" | "Cold";
}

export const LinkedInMailbox = () => {
  const { leads, trackSentMessage, outreachStats, icpData } = useAppData();
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedThread, setSelectedThread] = useState<LinkedInThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [customLinkedInThreads, setCustomLinkedInThreads] = useState<LinkedInThread[]>([]);

  // Generate AI-powered LinkedIn threads based on leads
  const generateLinkedInThreads = (): LinkedInThread[] => {
    // Only show conversations if AI engine has been used (outreach sent)
    const hasUsedAIEngine = outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0;
    
    if (leads.length === 0 || !hasUsedAIEngine) return [];

    // If no LinkedIn connections made, don't show LinkedIn conversations
    if (outreachStats.linkedinConnections === 0 || outreachStats.linkedinLeads.length === 0) return [];

    // Only show threads for leads that actually had LinkedIn connections sent to them
    const linkedinLeadIds = outreachStats.linkedinLeads;
    const leadsWithLinkedInSent = leads.filter(lead => linkedinLeadIds.includes(lead.id));

    if (leadsWithLinkedInSent.length === 0) return [];

    // Prioritize leads for conversations (Hot leads first, then Warm, then Cold)
    const prioritizedLeads = [...leadsWithLinkedInSent].sort((a, b) => {
      const tierPriority = { "Hot": 3, "Warm": 2, "Cold": 1 };
      return tierPriority[b.tier] - tierPriority[a.tier];
    });

    return prioritizedLeads.map((lead, index) => {
      const threadId = `linkedin-thread-${lead.id}`;
      const isHotLead = lead.tier === "Hot";
      const isWarmLead = lead.tier === "Warm";
      
      // Only show the initial LinkedIn connection request sent via AI engine
      const messages: LinkedInMessage[] = [
        {
          id: `linkedin-${lead.id}-connection`,
          from: "you",
          fromProfile: "Your Profile",
          to: lead.contact,
          toProfile: lead.linkedin || `${lead.contact} - ${lead.title}`,
          content: generateConnectionRequest(lead),
          timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: true,
          isFromLead: false,
          threadId,
          messageType: "connection_request"
        }
      ];

      const unreadCount = 0; // No unread messages since we only sent outbound
      const connectionStatus = "pending"; // All initial connection requests are pending

      return {
        id: threadId,
        leadName: lead.contact,
        leadTitle: lead.title,
        leadCompany: lead.company,
        leadProfile: lead.linkedin || `${lead.contact} - ${lead.title}`,
        connectionStatus,
        lastActivity: messages[messages.length - 1].timestamp,
        messageCount: messages.length,
        unreadCount,
        messages,
        leadTier: lead.tier
      };
    });
  };

  // AI LinkedIn Message Generation Functions
  const generateConnectionRequest = (lead: Lead): string => {
    const requests = [
      `Hi ${lead.contact}, I noticed your work at ${lead.company} in the ${lead.industry.toLowerCase()} space. I'd love to connect and share insights about industry trends.`,
      `Hello ${lead.contact}, saw your profile and impressed by ${lead.company}'s growth. Would love to connect and exchange ideas about ${lead.industry.toLowerCase()} innovation.`,
      `Hi ${lead.contact}, fellow ${lead.industry.toLowerCase()} professional here. Your experience at ${lead.company} caught my attention. Let's connect!`,
      `Hello ${lead.contact}, I help ${lead.industry.toLowerCase()} companies like ${lead.company} scale their operations. Would love to connect and share some insights.`
    ];
    return requests[Math.floor(Math.random() * requests.length)];
  };

  const generateLinkedInFollowUp = (lead: Lead): string => {
    const templates = [
      `Thanks for connecting! I've been following ${lead.company}'s journey in ${lead.industry.toLowerCase()}. We've helped similar companies increase efficiency by 30-40%. Quick 15-min call to share some insights?`,
      `Great to connect! Noticed ${lead.company} is growing fast in ${lead.location}. We work with ${lead.industry.toLowerCase()} leaders to optimize their sales processes. Worth a brief chat?`,
      `Appreciate the connection! ${lead.company} seems to be doing great things in ${lead.industry.toLowerCase()}. We've helped companies like yours scale revenue by 35%. Interested in learning more?`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateLinkedInResponse = (lead: Lead): string => {
    if (lead.tier === "Hot") {
      return `Absolutely! ${lead.company} is always looking for ways to improve. Those results sound impressive. Would love to learn more about how you achieve that. Can we schedule a call this week?`;
    } else {
      return `Thanks for reaching out! Interesting approach. Could you send me some more details? I'd be happy to take a look when I have time.`;
    }
  };

  // Load custom LinkedIn threads from localStorage on component mount
  useEffect(() => {
    const savedLinkedInThreads = localStorage.getItem('linkedInThreads');
    if (savedLinkedInThreads) {
      try {
        setCustomLinkedInThreads(JSON.parse(savedLinkedInThreads));
      } catch (error) {
        console.error("Error loading saved LinkedIn threads:", error);
      }
    }
  }, []);

  // Regenerate threads when outreach stats change (new LinkedIn connections sent)
  useEffect(() => {
    const baseLinkedInThreads = generateLinkedInThreads();
    if (baseLinkedInThreads.length > 0 && customLinkedInThreads.length === 0) {
      // Auto-generate new threads when outreach stats increase and no custom threads exist
      setCustomLinkedInThreads(baseLinkedInThreads);
      localStorage.setItem('linkedInThreads', JSON.stringify(baseLinkedInThreads));
    } else if (baseLinkedInThreads.length > customLinkedInThreads.length) {
      // Add new threads when new LinkedIn connections are sent
      const newThreads = baseLinkedInThreads.slice(customLinkedInThreads.length);
      const updatedThreads = [...customLinkedInThreads, ...newThreads];
      setCustomLinkedInThreads(updatedThreads);
      localStorage.setItem('linkedInThreads', JSON.stringify(updatedThreads));
    }
  }, [outreachStats.linkedinConnections, outreachStats.linkedinLeads, leads]);

  // Generate base AI threads and use custom threads if available
  const baseLinkedInThreads = generateLinkedInThreads();
  const linkedInThreads = customLinkedInThreads.length > 0 ? customLinkedInThreads : baseLinkedInThreads;
  const filteredThreads = linkedInThreads.filter(thread =>
    thread.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.leadCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.leadTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if AI engine has been used for outreach
  const hasUsedAIEngine = outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0;
  
  const totalUnread = hasUsedAIEngine ? linkedInThreads.reduce((sum, thread) => sum + thread.unreadCount, 0) : 0;
  const totalConnections = linkedInThreads.filter(t => t.connectionStatus === "connected").length;
  const pendingRequests = linkedInThreads.filter(t => t.connectionStatus === "pending").length;

  const sendReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    
    setIsReplying(true);
    
    setTimeout(() => {
      trackSentMessage('linkedin');
      
      // Create new LinkedIn message
      const newMessage: LinkedInMessage = {
        id: `linkedin-reply-${Date.now()}`,
        from: "you",
        fromProfile: "Your Profile",
        to: selectedThread.leadName,
        toProfile: selectedThread.leadProfile,
        content: replyText,
        timestamp: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: true,
        isFromLead: false,
        threadId: selectedThread.id,
        messageType: "message"
      };

      // Update the threads with the new reply
      const updatedThreads = linkedInThreads.map(thread => {
        if (thread.id === selectedThread.id) {
          const updatedThread = {
            ...thread,
            messages: [...thread.messages, newMessage],
            messageCount: thread.messageCount + 1,
            lastActivity: newMessage.timestamp
          };
          return updatedThread;
        }
        return thread;
      });

      // Save updated threads to localStorage and state
      setCustomLinkedInThreads(updatedThreads);
      localStorage.setItem('linkedInThreads', JSON.stringify(updatedThreads));

      // Update selected thread to show the new message
      const updatedSelectedThread = updatedThreads.find(t => t.id === selectedThread.id);
      if (updatedSelectedThread) {
        setSelectedThread(updatedSelectedThread);
      }
      
      setReplyText("");
      setIsReplying(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Hot": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "Warm": return <Award className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <span>LinkedIn Messaging</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {linkedInThreads.length} conversations
            </Badge>
            {totalUnread > 0 && (
              <Badge className="bg-blue-600 text-white">
                {totalUnread} unread
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage LinkedIn connections and conversations with your prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{totalConnections}</div>
              <p className="text-sm text-blue-700">Connections</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <UserPlus className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
              <p className="text-sm text-yellow-700">Pending Requests</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{outreachStats.linkedinConnections}</div>
              <p className="text-sm text-green-700">Messages Sent</p>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              {customLinkedInThreads.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCustomLinkedInThreads([]);
                    localStorage.removeItem('linkedInThreads');
                  }}
                  className="text-gray-600"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="messages" className="relative">
                Connection Requests Sent
                {linkedInThreads.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {linkedInThreads.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4 mt-6">
              {!hasUsedAIEngine ? (
                <div className="text-center py-12">
                  <Linkedin className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No LinkedIn Outreach Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Your LinkedIn connection requests will appear here once you start using the AI Engine.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-2 text-blue-800 mb-3">
                      <Brain className="w-5 h-5" />
                      <span className="font-medium">Get Started</span>
                    </div>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Go to the AI Engine tab</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Select leads for outreach</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Send LinkedIn connections</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-8">
                  <Linkedin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No LinkedIn outreach found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                      thread.unreadCount > 0 ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedThread(thread)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <Linkedin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className={`${thread.unreadCount > 0 ? 'font-bold' : 'font-medium'} text-gray-900`}>
                            {thread.leadName}
                          </p>
                          <p className="text-sm text-gray-600">{thread.leadTitle}</p>
                          <p className="text-xs text-gray-500">{thread.leadCompany}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(thread.connectionStatus)}>
                          {thread.connectionStatus === "connected" ? "Connected" : "Pending"}
                        </Badge>
                        {getTierIcon(thread.leadTier)}
                        {thread.unreadCount > 0 && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 truncate">
                          {thread.messages[thread.messages.length - 1]?.content.substring(0, 80)}...
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                          <span>Connection request sent</span>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">Awaiting acceptance</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4">
                        <p>{thread.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* LinkedIn Thread Dialog */}
      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedThread && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedThread.leadName}</h2>
                    <p className="text-gray-600">{selectedThread.leadTitle} • {selectedThread.leadCompany}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-6">
                {selectedThread.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      message.isFromLead
                        ? "bg-blue-50 border-blue-200 ml-8"
                        : "bg-gray-50 border-gray-200 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Linkedin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {message.isFromLead ? message.from : "You"}
                          </span>
                        </div>
                        {message.messageType === "connection_request" && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Connection Request</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="text-gray-800">{message.content}</div>
                  </div>
                ))}

                {/* Reply Section */}
                {selectedThread.connectionStatus === "connected" && (
                  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send message to {selectedThread.leadName}
                    </h4>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your LinkedIn message..."
                      className="min-h-[100px] mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedThread(null)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={sendReply} 
                        disabled={!replyText.trim() || isReplying}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isReplying ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 