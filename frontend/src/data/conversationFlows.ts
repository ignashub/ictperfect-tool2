export interface ConversationLine {
  speaker: 'agent' | 'prospect';
  message: string;
  delay: number;
}

export interface ConversationFlow {
  name: string;
  probability: number;
  flow: ConversationLine[];
}

export const createBaseFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "Hello?", delay: 1000 },
  { speaker: 'agent', message: `Hi ${leadData?.contact}, this is the AI agent from [Your Company]. Hope I'm catching you at a good time?`, delay: 2000 },
  { speaker: 'prospect', message: "Sure, what's this about?", delay: 2500 },
  { speaker: 'agent', message: `I noticed ${leadData?.company} is in the ${leadData?.industry} space. We've been helping similar companies increase their sales efficiency. Do you have 2 minutes?`, delay: 3000 },
];

export const createInterestedFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "Yes, I'm interested. Tell me more.", delay: 2500 },
  { speaker: 'agent', message: `Great! We specialize in AI-powered sales optimization. We recently helped a ${leadData?.industry} company similar to yours increase their qualified leads by 35% in just 90 days.`, delay: 3500 },
  { speaker: 'prospect', message: "That sounds impressive. How does it work exactly?", delay: 3000 },
  { speaker: 'agent', message: `Our platform uses machine learning to analyze your customer data and identify the highest-value prospects. We also provide AI-generated personalized messaging and optimize your outreach timing.`, delay: 4000 },
  { speaker: 'prospect', message: "Interesting. What kind of results have you seen with companies our size?", delay: 3500 },
  { speaker: 'agent', message: `For companies with ${leadData?.employees} employees like yours, we typically see 25-40% improvement in conversion rates and 30% reduction in sales cycle time within the first quarter.`, delay: 4500 },
  { speaker: 'prospect', message: "That could definitely help us. What would be the next step?", delay: 3000 },
  { speaker: 'agent', message: `I'd love to schedule a quick 15-minute demo where I can show you exactly how this would work for ${leadData?.company}. Are you available for a call this week?`, delay: 4000 },
  { speaker: 'prospect', message: "Yes, that would be great. Send me some times that work.", delay: 2500 },
  { speaker: 'agent', message: `Perfect! I'll send you a calendar link right after this call. Thanks for your time, ${leadData?.contact}!`, delay: 3000 },
];

export const createNotInterestedFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "Actually, we're pretty busy right now. Can you send me some information instead?", delay: 2500 },
  { speaker: 'agent', message: `Absolutely, I understand you're busy. I'll send you a brief case study showing how we helped a similar ${leadData?.industry} company. It's just a 2-page overview.`, delay: 4000 },
  { speaker: 'prospect', message: "That would be helpful, thank you.", delay: 2000 },
  { speaker: 'agent', message: `Great! Would it be okay if I follow up in a week or two after you've had a chance to review it?`, delay: 3500 },
  { speaker: 'prospect', message: "Sure, that sounds reasonable.", delay: 2000 },
  { speaker: 'agent', message: `Perfect! I'll send that over within the hour. Thanks for your time, ${leadData?.contact}.`, delay: 3000 },
];

export const createBusyFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "I'm actually in a meeting right now. Can you call back later?", delay: 2500 },
  { speaker: 'agent', message: `Of course! What would be a better time to reach you? I just need 5 minutes to share something that could really benefit ${leadData?.company}.`, delay: 4000 },
  { speaker: 'prospect', message: "Maybe tomorrow afternoon would be better.", delay: 2500 },
  { speaker: 'agent', message: `Perfect! I'll call you tomorrow around 2 PM. I'll also send a quick email with some info so you know what to expect. Sound good?`, delay: 4000 },
  { speaker: 'prospect', message: "Yes, that works. Talk to you then.", delay: 2000 },
];

export const createRudeFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "Look, I'm not interested in whatever you're selling.", delay: 2500 },
  { speaker: 'agent', message: `I completely understand, ${leadData?.contact}. I'm not trying to sell you anything today. I just wanted to share a quick insight that could help ${leadData?.company} save time in your sales process.`, delay: 4000 },
  { speaker: 'prospect', message: "What kind of insight?", delay: 2000 },
  { speaker: 'agent', message: `We found that ${leadData?.industry} companies like yours are losing about 30% of potential deals due to poor lead timing. There's actually a simple way to fix this.`, delay: 4500 },
  { speaker: 'prospect', message: "Okay, you have 30 seconds.", delay: 2000 },
  { speaker: 'agent', message: `Fair enough. The key is using AI to identify when prospects are actively researching solutions. Instead of cold outreach, you contact them when they're already looking. Much higher success rate.`, delay: 5000 },
  { speaker: 'prospect', message: "That actually makes sense. Send me some information.", delay: 2500 },
  { speaker: 'agent', message: `Will do. I'll send a brief case study showing exactly how this works. Thanks for giving me those 30 seconds, ${leadData?.contact}.`, delay: 3500 },
];

export const createSkepticalFlow = (leadData: any): ConversationLine[] => [
  { speaker: 'prospect', message: "We've tried AI solutions before and they didn't work. What makes yours different?", delay: 3000 },
  { speaker: 'agent', message: `That's a great question, and honestly, many AI solutions overpromise and underdeliver. Our approach is different because we focus on integration with your existing workflow rather than replacing it.`, delay: 4500 },
  { speaker: 'prospect', message: "How so?", delay: 1500 },
  { speaker: 'agent', message: `Instead of a black box that gives you random leads, our AI learns from your successful deals. It analyzes what made your best customers convert and finds more companies with those exact characteristics.`, delay: 5000 },
  { speaker: 'prospect', message: "That does sound more practical. What's the setup process like?", delay: 3000 },
  { speaker: 'agent', message: `The beauty is there's almost no setup. We integrate with your existing CRM, analyze your historical data, and start providing insights within 48 hours. No disruption to your current process.`, delay: 4500 },
  { speaker: 'prospect', message: "Interesting. Can you show me some specific examples?", delay: 2500 },
  { speaker: 'agent', message: `Absolutely. I'd love to show you a 5-minute demo using data similar to ${leadData?.company}'s. Would Thursday or Friday work better for a quick call?`, delay: 4000 },
  { speaker: 'prospect', message: "Friday could work. Send me the details.", delay: 2000 },
];

export const conversationFlows: ConversationFlow[] = [
  {
    name: 'interested',
    probability: 0.25, // 25%
    flow: []
  },
  {
    name: 'notInterested',
    probability: 0.25, // 25%
    flow: []
  },
  {
    name: 'busy',
    probability: 0.20, // 20%
    flow: []
  },
  {
    name: 'rude',
    probability: 0.15, // 15%
    flow: []
  },
  {
    name: 'skeptical',
    probability: 0.15, // 15%
    flow: []
  }
];

export const getRandomConversationFlow = (leadData: any): ConversationLine[] => {
  const random = Math.random();
  const baseFlow = createBaseFlow(leadData);
  
  let cumulativeProbability = 0;
  for (const flow of conversationFlows) {
    cumulativeProbability += flow.probability;
    if (random <= cumulativeProbability) {
      switch (flow.name) {
        case 'interested':
          return [...baseFlow, ...createInterestedFlow(leadData)];
        case 'notInterested':
          return [...baseFlow, ...createNotInterestedFlow(leadData)];
        case 'busy':
          return [...baseFlow, ...createBusyFlow(leadData)];
        case 'rude':
          return [...baseFlow, ...createRudeFlow(leadData)];
        case 'skeptical':
          return [...baseFlow, ...createSkepticalFlow(leadData)];
        default:
          return [...baseFlow, ...createInterestedFlow(leadData)];
      }
    }
  }
  
  // Fallback to interested flow
  return [...baseFlow, ...createInterestedFlow(leadData)];
}; 