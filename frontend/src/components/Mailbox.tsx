import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Mail, MailOpen, Reply, Forward, Archive, Trash2, 
  Search, Filter, RefreshCw, Send, Paperclip, 
  Clock, CheckCircle, AlertCircle, User, Building, Star, Bot, Linkedin, Brain
} from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { LinkedInMailbox } from "@/components/LinkedInMailbox";

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

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isFromLead: boolean;
  leadId?: string;
  threadId: string;
  hasAttachment: boolean;
  priority: "high" | "normal" | "low";
  labels: string[];
}

interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  lastActivity: string;
  messageCount: number;
  leadCompany?: string;
  leadName?: string;
  status: "pending" | "replied" | "converted" | "bounced";
  emails: Email[];
  unreadCount: number;
}

export const Mailbox = () => {
  const { leads, trackSentMessage, outreachStats, icpData } = useAppData();
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [customThreads, setCustomThreads] = useState<EmailThread[]>([]);

  // Generate AI-powered email threads based on actual leads and outreach
  const generateAIEmailThreads = (): EmailThread[] => {
    // Only show conversations if AI engine has been used (outreach sent)
    const hasUsedAIEngine = outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0;
    
    if (leads.length === 0 || !hasUsedAIEngine) return [];

    // If no emails sent, don't show email conversations
    if (outreachStats.emailsSent === 0 || outreachStats.emailLeads.length === 0) return [];

    // Only show threads for leads that actually had emails sent to them
    const emailLeadIds = outreachStats.emailLeads;
    const leadsWithEmailsSent = leads.filter(lead => emailLeadIds.includes(lead.id));

    if (leadsWithEmailsSent.length === 0) return [];

    // Prioritize leads for conversations (Hot leads first, then Warm, then Cold)
    const prioritizedLeads = [...leadsWithEmailsSent].sort((a, b) => {
      const tierPriority = { "Hot": 3, "Warm": 2, "Cold": 1 };
      return tierPriority[b.tier] - tierPriority[a.tier];
    });

    return prioritizedLeads.map((lead, index) => {
      const threadId = `thread-${lead.id}`;
      const isHotLead = lead.tier === "Hot";
      const isWarmLead = lead.tier === "Warm";
      
      // Generate AI-personalized email content
      const aiSubject = generateAISubject(lead);
      const aiOutreachEmail = generateAIOutreachEmail(lead);
      const aiResponseEmail = generateAIResponseEmail(lead);
      const aiFollowUpEmail = generateAIFollowUpEmail(lead);

      // Only show the initial outbound email sent via AI engine
      const emails: Email[] = [
        {
          id: `email-${lead.id}-1`,
          from: "you@company.com",
          to: lead.email,
          subject: aiSubject,
          body: aiOutreachEmail,
          timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: true,
          isFromLead: false,
          threadId,
          hasAttachment: false,
          priority: isHotLead ? "high" : isWarmLead ? "normal" : "low",
          labels: ["outreach", "ai-sent"]
        }
      ];

      const lastEmail = emails[emails.length - 1];

      return {
        id: threadId,
        subject: aiSubject,
        participants: [lead.email, "you@company.com"],
        lastActivity: lastEmail.timestamp,
        messageCount: emails.length,
        leadCompany: lead.company,
        leadName: lead.contact,
        status: "pending", // All initial messages are pending responses
        unreadCount: 0, // No unread messages since we only sent outbound
        emails
      };
    });
  };

  // AI Email Generation Functions
  const generateAISubject = (lead: Lead): string => {
    const industrySubjects = {
      "Technology": [
        `Scale ${lead.company}'s Tech Operations with AI`,
        `${lead.company}: Reduce Development Costs by 30%`,
        `AI Sales Automation for ${lead.company}`
      ],
      "Healthcare": [
        `Transform ${lead.company}'s Patient Acquisition`,
        `Healthcare AI Solutions for ${lead.company}`,
        `${lead.company}: Streamline Your Practice Operations`
      ],
      "Finance": [
        `${lead.company}: Automate Your Client Acquisition`,
        `Financial Services AI for ${lead.company}`,
        `Scale ${lead.company}'s Revenue with Smart Automation`
      ],
      "Retail": [
        `${lead.company}: Boost E-commerce Conversion by 40%`,
        `AI-Powered Sales Growth for ${lead.company}`,
        `Transform ${lead.company}'s Customer Experience`
      ],
      "Manufacturing": [
        `${lead.company}: Optimize Your Supply Chain with AI`,
        `Manufacturing Efficiency Solutions for ${lead.company}`,
        `${lead.company}: Reduce Operational Costs`
      ]
    };

    const subjects = industrySubjects[lead.industry as keyof typeof industrySubjects] || [
      `Partnership Opportunity with ${lead.company}`,
      `${lead.company}: Increase Revenue with AI`,
      `Scale ${lead.company}'s Operations`
    ];

    return subjects[Math.floor(Math.random() * subjects.length)];
  };

  const generateAIOutreachEmail = (lead: Lead): string => {
    const templates = icpData.messaging?.industryTemplates?.find(t => t.industry === lead.industry);
    const valueProps = icpData.messaging?.valuePropositions || [];
    
    if (templates && valueProps.length > 0) {
      return templates.template
        .replace(/\{company\}/g, lead.company)
        .replace(/\{contact\}/g, lead.contact)
        .replace(/\{industry\}/g, lead.industry)
        .replace(/\{valueProposition\}/g, valueProps[0] || "streamline operations and increase efficiency");
    }

    // Fallback template
    return `Hi ${lead.contact},

I hope this email finds you well. I noticed ${lead.company} has been growing in the ${lead.industry} space and thought you might be interested in how we've helped similar companies.

We've recently worked with companies like yours to:
• Increase sales efficiency by 35-40%
• Reduce operational costs by 25%
• Automate repetitive processes saving 15+ hours per week

Would you be open to a brief 15-minute call next week to discuss how this could benefit ${lead.company}?

Best regards,
[Your Name]

P.S. I've attached a case study showing similar results in your industry.`;
  };

  const generateAIResponseEmail = (lead: Lead): string => {
    if (lead.tier === "Hot") {
      return `Hi,

Thanks for reaching out! This sounds exactly like what we've been looking for at ${lead.company}. We're definitely interested in learning more about how you can help us improve our ${lead.industry.toLowerCase()} operations.

Could we schedule a call this week? I'm available Tuesday or Thursday afternoons.

Looking forward to hearing from you!

Best,
${lead.contact}
${lead.title}
${lead.company}`;
    } else {
      return `Hi,

Thanks for your email. This is interesting - could you send me some more details about your solution and pricing?

I'd be happy to take a look when I have time.

Thanks,
${lead.contact}`;
    }
  };

  const generateAIFollowUpEmail = (lead: Lead): string => {
    return `Hi ${lead.contact},

Thanks for the great call today! I'm excited about the potential to help ${lead.company} achieve the results we discussed.

As promised, I've attached:
• Detailed proposal with pricing options
• Implementation timeline
• ROI projections specific to ${lead.company}

Key next steps:
1. Review the proposal
2. Schedule demo with your team (if needed)
3. Kick off implementation in Q1

Would next Friday work for a follow-up call to discuss any questions?

Best regards,
[Your Name]

Looking forward to partnering with ${lead.company}!`;
  };

  // Load custom threads from localStorage on component mount
  useEffect(() => {
    const savedThreads = localStorage.getItem('emailThreads');
    if (savedThreads) {
      try {
        setCustomThreads(JSON.parse(savedThreads));
      } catch (error) {
        console.error("Error loading saved email threads:", error);
      }
    }
  }, []);

  // Regenerate threads when outreach stats change (new emails sent)
  useEffect(() => {
    const baseEmailThreads = generateAIEmailThreads();
    if (baseEmailThreads.length > 0 && customThreads.length === 0) {
      // Auto-generate new threads when outreach stats increase and no custom threads exist
      setCustomThreads(baseEmailThreads);
      localStorage.setItem('emailThreads', JSON.stringify(baseEmailThreads));
    } else if (baseEmailThreads.length > customThreads.length) {
      // Add new threads when new emails are sent
      const newThreads = baseEmailThreads.slice(customThreads.length);
      const updatedThreads = [...customThreads, ...newThreads];
      setCustomThreads(updatedThreads);
      localStorage.setItem('emailThreads', JSON.stringify(updatedThreads));
    }
  }, [outreachStats.emailsSent, outreachStats.emailLeads, leads]);

  // Generate base AI threads and use custom threads if available
  const baseEmailThreads = generateAIEmailThreads();
  const emailThreads: EmailThread[] = customThreads.length > 0 ? customThreads : baseEmailThreads;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "replied": return "bg-blue-100 text-blue-800";
      case "converted": return "bg-green-100 text-green-800";
      case "bounced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "low": return <Clock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const filteredThreads = emailThreads.filter(thread =>
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.leadCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.leadName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if AI engine has been used for outreach
  const hasUsedAIEngine = outreachStats.emailsSent > 0 || outreachStats.linkedinConnections > 0 || outreachStats.callsMade > 0;
  
  const totalUnread = hasUsedAIEngine ? emailThreads.reduce((sum, thread) => sum + thread.unreadCount, 0) : 0;

  const sendReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    
    setIsReplying(true);
    
    // Simulate sending reply
    setTimeout(() => {
      // Track as sent message
      trackSentMessage('email');
      
      // Create new reply email
      const newEmail: Email = {
        id: `email-${Date.now()}`,
        from: "you@company.com",
        to: selectedThread.emails.find(e => e.isFromLead)?.from || selectedThread.emails[0].to,
        subject: `Re: ${selectedThread.subject}`,
        body: replyText,
        timestamp: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: true,
        isFromLead: false,
        threadId: selectedThread.id,
        hasAttachment: false,
        priority: "normal",
        labels: ["sent", "reply"]
      };

      // Update the threads with the new reply
      const updatedThreads = emailThreads.map(thread => {
        if (thread.id === selectedThread.id) {
          const updatedThread = {
            ...thread,
            emails: [...thread.emails, newEmail],
            messageCount: thread.messageCount + 1,
            lastActivity: newEmail.timestamp,
            status: "replied" as const
          };
          return updatedThread;
        }
        return thread;
      });

      // Save updated threads to localStorage and state
      setCustomThreads(updatedThreads);
      localStorage.setItem('emailThreads', JSON.stringify(updatedThreads));

      // Update selected thread to show the new message
      const updatedSelectedThread = updatedThreads.find(t => t.id === selectedThread.id);
      if (updatedSelectedThread) {
        setSelectedThread(updatedSelectedThread);
      }
      
      setReplyText("");
      setIsReplying(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <span>Communication Hub</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Multi-channel messaging
            </Badge>
            {totalUnread > 0 && (
              <Badge className="bg-red-500 text-white">
                {totalUnread} unread
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage email and LinkedIn conversations with your leads and prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
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
              {customThreads.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCustomThreads([]);
                    localStorage.removeItem('emailThreads');
                  }}
                  className="text-gray-600"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbox" className="relative">
                Email Campaigns
                {emailThreads.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                    {emailThreads.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="relative">
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4 mt-6">
              {!hasUsedAIEngine ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Email Campaigns Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Your sent email campaigns will appear here once you start using the AI Engine.
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
                        <span>Send email campaigns</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No email campaigns found</h3>
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                          {thread.leadName ? (
                            <User className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Building className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className={`${thread.unreadCount > 0 ? 'font-bold' : 'font-medium'} text-gray-900`}>
                            {thread.leadName || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">{thread.leadCompany}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(thread.status)}>
                          {thread.status}
                        </Badge>
                        {getPriorityIcon(thread.emails[thread.emails.length - 1]?.priority)}
                        {thread.unreadCount > 0 && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {thread.subject}
                        </p>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {thread.emails[thread.emails.length - 1]?.body.substring(0, 80)}...
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                          <span>Email sent</span>
                          <span>•</span>
                          <span className="text-orange-600 font-medium">Awaiting response</span>
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

            <TabsContent value="linkedin">
              <LinkedInMailbox />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Email Thread Dialog */}
      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedThread && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedThread.subject}</h2>
                    <p className="text-gray-600">{selectedThread.leadName} • {selectedThread.leadCompany}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-6">
                {selectedThread.emails.map((email, index) => (
                  <div
                    key={email.id}
                    className={`p-4 rounded-lg border ${
                      email.isFromLead
                        ? "bg-blue-50 border-blue-200 ml-8"
                        : "bg-gray-50 border-gray-200 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {email.isFromLead ? email.from.split('@')[0] : "You"}
                        </span>
                        <span className="text-sm text-gray-500">
                          to {email.isFromLead ? "you" : email.to.split('@')[0]}
                        </span>
                        {email.labels.includes("interested") && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Interested</Badge>
                        )}
                        {email.labels.includes("converted") && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">Converted</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {email.hasAttachment && <Paperclip className="w-4 h-4 text-gray-400" />}
                        <span className="text-sm text-gray-500">{email.timestamp}</span>
                      </div>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap">{email.body}</div>
                  </div>
                ))}

                {/* Reply Section */}
                <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Reply className="w-4 h-4 mr-2" />
                    Reply to {selectedThread.leadName}
                  </h4>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[120px] mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedThread(null)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={sendReply} 
                      disabled={!replyText.trim() || isReplying}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isReplying ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 