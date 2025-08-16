import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Phone, PhoneCall, Brain, Play, Pause, StopCircle, Volume2, Mic, MicOff, Clock, CheckCircle, XCircle, MessageSquare, User, Bot, Activity, Download } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { getRandomConversationFlow, ConversationLine } from "@/data/conversationFlows";

interface CallTranscript {
  speaker: 'agent' | 'prospect';
  message: string;
  timestamp: string;
}

interface CallResult {
  outcome: 'answered' | 'voicemail' | 'busy' | 'no-answer';
  duration: number;
  nextAction: string;
  notes: string;
  transcript: CallTranscript[];
}

export const AIPhoneAgent = () => {
  const { hasAnyData, leads, trackSentMessage } = useAppData();
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [callScript, setCallScript] = useState<string>("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callPhase, setCallPhase] = useState<'dialing' | 'ringing' | 'connected' | 'ended'>('dialing');
  const [transcript, setTranscript] = useState<CallTranscript[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callResult, setCallResult] = useState<CallResult | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const generateCallScript = () => {
    if (!selectedLead) return;
    
    setIsGeneratingScript(true);
    setTimeout(() => {
      const selectedLeadData = leads.find(lead => lead.id === selectedLead);
      const script = `Hi ${selectedLeadData?.contact}, this is [Your Name] from [Your Company]. 

I hope I'm catching you at a good time. I noticed ${selectedLeadData?.company} is doing some interesting work in the ${selectedLeadData?.industry} space, and I wanted to reach out because we've been helping similar companies streamline their sales processes.

We recently worked with a ${selectedLeadData?.industry} company similar to yours and helped them increase their qualified leads by 35% in just 90 days. 

I'd love to share how we might be able to help ${selectedLeadData?.company} achieve similar results. Do you have about 2 minutes for me to explain what we do?

[PAUSE FOR RESPONSE]

[IF INTERESTED]: Great! Let me quickly explain our approach...
[IF NOT INTERESTED]: I completely understand. Would it be better if I sent you a brief case study via email instead?
[IF BUSY]: No problem at all. When would be a better time for a quick 5-minute conversation?`;

      setCallScript(script);
      setIsGeneratingScript(false);
    }, 2000);
  };

  const startCall = () => {
    if (!selectedLead || !callScript) return;
    
    setIsCallActive(true);
    setCallPhase('dialing');
    setTranscript([]);
    setCallDuration(0);
    setCallResult(null);

    // Simulate call progression
    setTimeout(() => setCallPhase('ringing'), 1000);
    
    // Simulate call being answered (80% chance) or going to voicemail
    setTimeout(() => {
      const isAnswered = Math.random() > 0.2;
      if (isAnswered) {
        setCallPhase('connected');
        startConversation();
      } else {
        endCall('voicemail');
      }
    }, 4000);

    // Start duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Store timer reference for cleanup
    setTimeout(() => clearInterval(timer), 120000); // Max 2 minutes
  };

  const startConversation = () => {
    const selectedLeadData = leads.find(lead => lead.id === selectedLead);
    
    // Get a random conversation flow from the external file
    const conversationFlow = getRandomConversationFlow(selectedLeadData);

    let cumulativeDelay = 0;
    conversationFlow.forEach((line, index) => {
      cumulativeDelay += line.delay;
      setTimeout(() => {
        setTranscript(prev => [...prev, {
          ...line,
          timestamp: new Date().toLocaleTimeString()
        }]);
        
        // End call after conversation
        if (index === conversationFlow.length - 1) {
          setTimeout(() => {
            const finalMessage = line.message.toLowerCase();
            const outcome = finalMessage.includes('demo') || finalMessage.includes('calendar') || finalMessage.includes('great') 
              ? 'answered' : 'answered';
            endCall(outcome);
          }, 2000);
        }
      }, cumulativeDelay);
    });
  };

  const endCall = (outcome: CallResult['outcome']) => {
    setCallPhase('ended');
    setIsCallActive(false);
    
    // Track the call in statistics
    trackSentMessage('phone', selectedLead);
    
    // Generate call result
    const result: CallResult = {
      outcome,
      duration: callDuration,
      nextAction: outcome === 'answered' && transcript.some(t => t.message.includes('interested')) 
        ? 'Schedule follow-up meeting' 
        : outcome === 'voicemail' 
        ? 'Send follow-up email' 
        : 'Try again in 2-3 days',
      notes: `Call ${outcome}. ${outcome === 'answered' ? 'Prospect showed interest in our solution.' : outcome === 'voicemail' ? 'Left professional voicemail message.' : 'Will retry at better time.'}`,
      transcript
    };
    
    setCallResult(result);
  };

  const resetCall = () => {
    setIsCallActive(false);
    setCallPhase('dialing');
    setTranscript([]);
    setCallDuration(0);
    setCallResult(null);
  };

  const downloadTranscript = () => {
    if (!callResult || transcript.length === 0) return;
    
    const selectedLeadData = leads.find(lead => lead.id === selectedLead);
    const callDate = new Date().toLocaleDateString();
    const callTime = new Date().toLocaleTimeString();
    
    // Create transcript content
    let transcriptContent = `CALL TRANSCRIPT\n`;
    transcriptContent += `===============\n\n`;
    transcriptContent += `Date: ${callDate}\n`;
    transcriptContent += `Time: ${callTime}\n`;
    transcriptContent += `Contact: ${selectedLeadData?.contact}\n`;
    transcriptContent += `Company: ${selectedLeadData?.company}\n`;
    transcriptContent += `Duration: ${Math.floor(callResult.duration / 60)}:${(callResult.duration % 60).toString().padStart(2, '0')}\n`;
    transcriptContent += `Outcome: ${callResult.outcome.charAt(0).toUpperCase() + callResult.outcome.slice(1)}\n`;
    transcriptContent += `Next Action: ${callResult.nextAction}\n\n`;
    transcriptContent += `CONVERSATION\n`;
    transcriptContent += `============\n\n`;
    
    transcript.forEach((line) => {
      const speaker = line.speaker === 'agent' ? 'AI Agent' : selectedLeadData?.contact || 'Prospect';
      transcriptContent += `[${line.timestamp}] ${speaker}:\n${line.message}\n\n`;
    });
    
    transcriptContent += `\nCALL NOTES\n`;
    transcriptContent += `==========\n`;
    transcriptContent += `${callResult.notes}\n\n`;
    transcriptContent += `Generated by ICPerfect AI Phone Agent\n`;
    
    // Create and download file
    const blob = new Blob([transcriptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `call-transcript-${selectedLeadData?.contact?.replace(/\s+/g, '-')}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!hasAnyData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-purple-600" />
            <span>AI Phone Agent</span>
          </CardTitle>
          <CardDescription>Intelligent automated calling with conversation AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PhoneCall className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leads Available</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Add leads to your database to start making AI-powered sales calls.
            </p>
            <div className="text-sm text-gray-500">
              • Add leads to your database<br/>
              • Generate personalized call scripts<br/>
              • Let AI make intelligent sales calls
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
          <Phone className="w-5 h-5 text-purple-600" />
          <span>AI Phone Agent</span>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        </CardTitle>
        <CardDescription>Intelligent automated calling with conversation AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lead Selection and Script Generation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Lead to Call</label>
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
            <label className="text-sm font-medium text-gray-700">Call Script</label>
            <Button 
              onClick={generateCallScript}
              disabled={!selectedLead || isGeneratingScript}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGeneratingScript ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate AI Script
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Script Display */}
        {callScript && !isCallActive && !callResult && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Generated Call Script</label>
              <Textarea
                value={callScript}
                onChange={(e) => setCallScript(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="AI-generated call script will appear here..."
              />
            </div>

            <Button 
              onClick={startCall}
              disabled={!callScript || isCallActive}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Start AI Call
            </Button>
          </div>
        )}

        {/* Active Call Interface */}
        {isCallActive && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    callPhase === 'connected' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {leads.find(l => l.id === selectedLead)?.contact}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {leads.find(l => l.id === selectedLead)?.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {callPhase === 'dialing' && 'Dialing...'}
                    {callPhase === 'ringing' && 'Ringing...'}
                    {callPhase === 'connected' && 'Connected'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="sm"
                  className={isMuted ? 'bg-red-50 border-red-300' : ''}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => endCall('answered')}
                  variant="destructive"
                  size="sm"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Transcript - Always visible when there's a transcript */}
        {transcript.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">
              {isCallActive ? 'Live Conversation' : 'Call Conversation'}
            </h4>
            <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-2">
              {transcript.map((line, index) => (
                <div key={index} className={`flex items-start space-x-2 ${
                  line.speaker === 'agent' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    line.speaker === 'agent' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-1 mb-1">
                      {line.speaker === 'agent' ? (
                        <Bot className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span className="text-xs opacity-75">
                        {line.speaker === 'agent' ? 'AI Agent' : 'Prospect'}
                      </span>
                      <span className="text-xs opacity-50">{line.timestamp}</span>
                    </div>
                    <p className="text-sm">{line.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call Result */}
        {callResult && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${
              callResult.outcome === 'answered' ? 'bg-green-50 border-green-200' :
              callResult.outcome === 'voicemail' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  {callResult.outcome === 'answered' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="capitalize">Call {callResult.outcome}</span>
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(callResult.duration / 60)}:{(callResult.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Next Action:</p>
                  <p className="text-sm text-gray-600">{callResult.nextAction}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Call Notes:</p>
                  <p className="text-sm text-gray-600">{callResult.notes}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={resetCall}
                variant="outline"
                className="flex-1"
              >
                Make Another Call
              </Button>
              <Button 
                onClick={downloadTranscript}
                variant="outline"
                className="flex-1"
                disabled={!callResult || transcript.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Transcript
              </Button>
            </div>
          </div>
        )}

        {/* Status when generating script */}
        {isGeneratingScript && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
              <div>
                <p className="font-medium text-blue-900">Generating Personalized Script</p>
                <p className="text-sm text-blue-700">Analyzing lead profile and creating optimized conversation flow...</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>


    </Card>
  );
}; 