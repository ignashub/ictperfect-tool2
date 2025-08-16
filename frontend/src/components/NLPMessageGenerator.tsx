import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Sparkles, Copy, RefreshCw, Send, MessageCircle, Activity, CheckCircle, Mail, Linkedin, Rocket, Zap } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";

interface NLPMessageGeneratorProps {
  initialLeadId?: string;
}

export const NLPMessageGenerator = ({ initialLeadId }: NLPMessageGeneratorProps) => {
  const { hasAnyData, leads, trackSentMessage } = useAppData();
  const [selectedLead, setSelectedLead] = useState<string>(initialLeadId || "");
  const [messageType, setMessageType] = useState<string>("");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [sendingPhase, setSendingPhase] = useState<'preparing' | 'sending' | 'delivered' | 'complete'>('preparing');
  const [showCelebration, setShowCelebration] = useState(false);

  const generateMessage = () => {
    if (!selectedLead || !messageType) return;
    
    // Reset success state when generating new message
    resetSuccessState();
    setIsGenerating(true);
    // Simulate AI message generation
    setTimeout(() => {
      const selectedLeadData = leads.find(lead => lead.id === selectedLead);
      const messages = {
        email: `Hi ${selectedLeadData?.contact},

I noticed ${selectedLeadData?.company} is in the ${selectedLeadData?.industry} space and growing rapidly. We've helped similar companies in your industry streamline their sales processes and increase conversion rates by 25-40%.

Would you be open to a brief 15-minute call next week to discuss how we might help ${selectedLeadData?.company} achieve similar results?

Best regards,
[Your Name]`,
        linkedin: `Hi ${selectedLeadData?.contact}, I came across ${selectedLeadData?.company} and was impressed by your growth in the ${selectedLeadData?.industry} space. I'd love to connect and share how we've helped similar companies optimize their sales processes. Would you be open to connecting?`,
        followup: `Hi ${selectedLeadData?.contact},

Following up on my previous message about helping ${selectedLeadData?.company} optimize your sales processes. I know you're busy, but I wanted to share a quick case study of a ${selectedLeadData?.industry} company similar to yours that saw a 35% increase in qualified leads within 90 days.

Would a brief 10-minute call make sense to explore if this could work for ${selectedLeadData?.company}?

Best,
[Your Name]`
      };
      setGeneratedMessage(messages[messageType as keyof typeof messages] || "");
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    // Optionally reset success state when copying, indicating user is moving on
    if (messageSent) {
      resetSuccessState();
    }
  };

  const resetSuccessState = () => {
    setMessageSent(false);
    setShowCelebration(false);
    setSendingPhase('preparing');
  };

  const sendMessage = () => {
    setIsSending(true);
    setSendingPhase('preparing');
    setMessageSent(false);
    setShowCelebration(false);

    // Phase 1: Preparing (500ms)
    setTimeout(() => {
      setSendingPhase('sending');
    }, 500);

    // Phase 2: Sending (1000ms)
    setTimeout(() => {
      setSendingPhase('delivered');
    }, 1500);

    // Phase 3: Complete with celebration (500ms)
    setTimeout(() => {
      setSendingPhase('complete');
      
      // Track the sent message based on type
      const messageTypeMap: { [key: string]: 'email' | 'linkedin' | 'phone' } = {
        'email': 'email',
        'followup': 'email',
        'linkedin': 'linkedin'
      };
      
      const trackingType = messageTypeMap[messageType] || 'email';
      trackSentMessage(trackingType, selectedLead);
      
      setIsSending(false);
      setMessageSent(true);
      setShowCelebration(true);
      
      // Keep celebration visible until user action
      // No automatic reset - user must interact to dismiss
    }, 2000);
  };

  if (!hasAnyData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>AI Message Generator</span>
          </CardTitle>
          <CardDescription>Generate personalized outreach messages with AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leads Available</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Add leads to your database to start generating personalized AI messages for outreach.
            </p>
            <div className="text-sm text-gray-500">
              • Add leads manually or via AI generation<br/>
              • Select a lead and message type<br/>
              • Let AI create personalized messages
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>AI Message Generator</span>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        </CardTitle>
        <CardDescription>Generate personalized outreach messages with AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Lead</label>
            <Select value={selectedLead} onValueChange={setSelectedLead}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a lead..." />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.contact} - {lead.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message Type</label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose message type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Cold Email</SelectItem>
                <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                {/* <SelectItem value="followup">Follow-up Email</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={generateMessage}
          disabled={!selectedLead || !messageType || isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Message...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Message
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-blue-600 animate-pulse" />
              <div>
                <p className="font-medium text-blue-900">Crafting Personalized Message</p>
                <p className="text-sm text-blue-700">Analyzing lead profile and generating content...</p>
              </div>
            </div>
          </div>
        )}

        {isSending && (
          <div className="relative overflow-hidden">
            {/* Preparing Phase */}
            {sendingPhase === 'preparing' && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg transform transition-all duration-500 ease-in-out">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                    <div className="absolute inset-0 w-5 h-5 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Preparing Message</p>
                    <p className="text-sm text-blue-700">Optimizing content for delivery...</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '25%' }}></div>
                </div>
              </div>
            )}

            {/* Sending Phase */}
            {sendingPhase === 'sending' && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg transform transition-all duration-500 ease-in-out">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {messageType === 'linkedin' ? (
                      <Linkedin className="w-5 h-5 text-purple-600 animate-bounce" />
                    ) : (
                      <Mail className="w-5 h-5 text-purple-600 animate-bounce" />
                    )}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Sending Message</p>
                    <p className="text-sm text-purple-700">
                      {messageType === 'linkedin' ? 'Delivering via LinkedIn...' : 'Delivering via Email...'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}

            {/* Delivered Phase */}
            {sendingPhase === 'delivered' && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg transform transition-all duration-500 ease-in-out">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Rocket className="w-5 h-5 text-green-600 animate-bounce" />
                    <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Message Delivered!</p>
                    <p className="text-sm text-green-700">Successfully sent to recipient</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Celebration */}
        {showCelebration && (
          <div className="relative p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-lg transform transition-all duration-500 ease-in-out">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg opacity-50"></div>
            
            {/* Close button */}
            <button 
              onClick={resetSuccessState}
              className="absolute top-2 right-2 w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-10"
              aria-label="Close success message"
            >
              ×
            </button>
            
            <div className="relative">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="relative">
                  <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
                  <div className="absolute inset-0 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-40"></div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-900 text-lg">Message Sent Successfully!</p>
                  <p className="text-sm text-green-700">Your outreach is on its way to make an impact</p>
                  <div className="mt-2 flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-green-600 animate-spin" />
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-2 justify-center">
                <Button 
                  onClick={generateMessage}
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Send Another
                </Button>
                <Button 
                  onClick={resetSuccessState}
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute top-2 left-4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute top-4 right-8 w-1 h-1 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-2 right-12 w-1 h-1 bg-emerald-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.7s' }}></div>
          </div>
        )}

        {generatedMessage && !isGenerating && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Generated Message</label>
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Your AI-generated message will appear here..."
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button 
                onClick={generateMessage}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button 
                onClick={sendMessage}
                disabled={isSending || messageSent}
                variant="outline"
                className={`flex-1 transition-all duration-300 ${
                  isSending 
                    ? 'border-purple-600 bg-purple-50 text-purple-700 transform scale-105' 
                    : messageSent 
                      ? 'border-green-600 bg-green-50 text-green-700 transform scale-105 shadow-lg' 
                      : 'border-green-600 text-green-600 hover:bg-green-50 hover:scale-105 hover:shadow-md'
                }`}
              >
                {isSending ? (
                  <>
                    {sendingPhase === 'preparing' && (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        Preparing...
                      </>
                    )}
                    {sendingPhase === 'sending' && (
                      <>
                        {messageType === 'linkedin' ? (
                          <Linkedin className="w-4 h-4 mr-2 animate-bounce" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2 animate-bounce" />
                        )}
                        Sending...
                      </>
                    )}
                    {sendingPhase === 'delivered' && (
                      <>
                        <Rocket className="w-4 h-4 mr-2 animate-bounce" />
                        Delivered!
                      </>
                    )}
                  </>
                ) : messageSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {!generatedMessage && !isGenerating && selectedLead && messageType && (
          <div className="text-center py-6">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click "Generate AI Message" to create personalized content</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 