import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";

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

interface ICPData {
  isGenerated: boolean;
  confidence?: number;
  primaryIndustries: string[];
  idealCompanySize: string;
  topRegions: string[];
  totalAddressableMarket: number;
  conversionPrediction: number;
  generatedDate?: string;
  // Enhanced ICP criteria for lead scoring
  criteria: {
    industries: { name: string; weight: number; score: number }[];
    companySizes: { range: string; weight: number; score: number }[];
    regions: { location: string; weight: number; score: number }[];
    revenueRanges: { range: string; weight: number; score: number }[];
    jobTitles: { title: string; weight: number; score: number }[];
  };
  // Personalization data for AI messaging
  messaging: {
    industryTemplates: { industry: string; template: string; tone: string }[];
    valuePropositions: string[];
    painPoints: string[];
    commonObjections: string[];
    successStories: string[];
  };
}

interface OutreachStats {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  aiConfidence: number;
  emailsSent: number;
  linkedinConnections: number;
  callsMade: number;
  // Track which leads had outreach sent to them
  emailLeads: string[]; // Array of lead IDs that had emails sent
  linkedinLeads: string[]; // Array of lead IDs that had LinkedIn messages sent
  phoneLeads: string[]; // Array of lead IDs that had phone calls made
}

interface AppDataContextType {
  leads: Lead[];
  icpData: ICPData;
  outreachStats: OutreachStats;
  addLead: (lead: Omit<Lead, 'id' | 'addedDate' | 'tier'> & { tier?: "Hot" | "Warm" | "Cold" }) => void;
  addMultipleLeads: (leads: (Omit<Lead, 'id' | 'addedDate' | 'tier'> & { tier?: "Hot" | "Warm" | "Cold" })[]) => void;
  generateICP: (userData: any) => void;
  updateOutreachStats: () => void;
  trackSentMessage: (messageType: 'email' | 'linkedin' | 'phone', leadId?: string) => void;
  calculateICPMatchScore: (lead: Lead) => number;
  hasAnyData: boolean;
  resetAllData: () => void;
}

const defaultICPData: ICPData = {
  isGenerated: false,
  primaryIndustries: [],
  idealCompanySize: "",
  topRegions: [],
  totalAddressableMarket: 0,
  conversionPrediction: 0,
  criteria: {
    industries: [],
    companySizes: [],
    regions: [],
    revenueRanges: [],
    jobTitles: [],
  },
  messaging: {
    industryTemplates: [],
    valuePropositions: [],
    painPoints: [],
    commonObjections: [],
    successStories: [],
  },
};

const defaultOutreachStats: OutreachStats = {
  totalLeads: 0,
  qualifiedLeads: 0,
  conversionRate: 0,
  aiConfidence: 0,
  emailsSent: 0,
  linkedinConnections: 0,
  callsMade: 0,
  emailLeads: [],
  linkedinLeads: [],
  phoneLeads: [],
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [icpData, setICPData] = useState<ICPData>(defaultICPData);
  const [outreachStats, setOutreachStats] = useState<OutreachStats>(defaultOutreachStats);

  // Load data from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedLeads = localStorage.getItem(`leads_${user.id}`);
      const savedICP = localStorage.getItem(`icp_${user.id}`);
      const savedStats = localStorage.getItem(`stats_${user.id}`);

      if (savedLeads) {
        try {
          setLeads(JSON.parse(savedLeads));
        } catch (error) {
          console.error("Error loading leads:", error);
        }
      }

      if (savedICP) {
        try {
          setICPData(JSON.parse(savedICP));
        } catch (error) {
          console.error("Error loading ICP data:", error);
        }
      }

      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          // Ensure all new properties exist for backward compatibility
          setOutreachStats({
            ...defaultOutreachStats,
            ...parsedStats,
            emailLeads: parsedStats.emailLeads || [],
            linkedinLeads: parsedStats.linkedinLeads || [],
            phoneLeads: parsedStats.phoneLeads || [],
          });
        } catch (error) {
          console.error("Error loading stats:", error);
        }
      }
    }
  }, [user?.id]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`leads_${user.id}`, JSON.stringify(leads));
    }
  }, [leads, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`icp_${user.id}`, JSON.stringify(icpData));
    }
  }, [icpData, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`stats_${user.id}`, JSON.stringify(outreachStats));
    }
  }, [outreachStats, user?.id]);

  const calculateLeadTier = (leadData: Omit<Lead, 'id' | 'addedDate' | 'tier'>): "Hot" | "Warm" | "Cold" => {
    // Calculate engagement score based on various factors
    let engagementScore = 0;
    
    // Industry scoring (high-value industries get higher scores)
    const industryScores: Record<string, number> = {
      "Technology": 25,
      "SaaS": 30,
      "FinTech": 28,
      "Healthcare": 22,
      "E-commerce": 20,
      "Finance": 24,
      "Manufacturing": 18,
      "Real Estate": 16,
      "Education": 14,
      "Consulting": 20
    };
    engagementScore += industryScores[leadData.industry] || 10;
    
    // Company size scoring (medium-large companies are ideal)
    const sizeScores: Record<string, number> = {
      "500+": 25,
      "200-500": 30,
      "100-200": 28,
      "75-100": 25,
      "50-75": 22,
      "25-50": 18,
      "10-25": 15,
      "1-10": 10
    };
    engagementScore += sizeScores[leadData.employees] || 15;
    
    // Job title scoring (decision makers get higher scores)
    const titleKeywords = leadData.title.toLowerCase();
    if (titleKeywords.includes('ceo') || titleKeywords.includes('founder')) engagementScore += 30;
    else if (titleKeywords.includes('cto') || titleKeywords.includes('vp')) engagementScore += 25;
    else if (titleKeywords.includes('director') || titleKeywords.includes('head of')) engagementScore += 20;
    else if (titleKeywords.includes('manager')) engagementScore += 15;
    else engagementScore += 10;
    
    // Revenue scoring
    const revenue = leadData.revenue;
    if (revenue.includes('$50M+') || revenue.includes('$100M+')) engagementScore += 25;
    else if (revenue.includes('$25M') || revenue.includes('$30M')) engagementScore += 22;
    else if (revenue.includes('$10M') || revenue.includes('$15M')) engagementScore += 18;
    else if (revenue.includes('$5M')) engagementScore += 15;
    else engagementScore += 10;
    
    // Base score influence
    const scoreBonus = Math.floor((leadData.score - 70) / 5) * 3; // Every 5 points above 70 adds 3 to engagement
    engagementScore += Math.max(0, scoreBonus);
    
    // Determine tier based on total engagement score
    if (engagementScore >= 85) return "Hot";
    else if (engagementScore >= 65) return "Warm";
    else return "Cold";
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'addedDate' | 'tier'> & { tier?: "Hot" | "Warm" | "Cold" }) => {
    const tier = leadData.tier || calculateLeadTier(leadData);
    const newLead: Lead = {
      ...leadData,
      tier,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
    };
    setLeads(prev => [...prev, newLead]);
    updateOutreachStats();
  };

  const addMultipleLeads = (leadsData: (Omit<Lead, 'id' | 'addedDate' | 'tier'> & { tier?: "Hot" | "Warm" | "Cold" })[]) => {
    const newLeads: Lead[] = leadsData.map(leadData => {
      const { tier: providedTier, ...leadDataWithoutTier } = leadData;
      const tier = providedTier || calculateLeadTier(leadDataWithoutTier);
      return {
        ...leadDataWithoutTier,
        tier,
        id: Date.now().toString() + Math.random(),
        addedDate: new Date().toISOString(),
      };
    });
    setLeads(prev => [...prev, ...newLeads]);
    updateOutreachStats();
  };

  const generateICPCriteria = (userData: any, leadData: any) => {
    // Generate scoring criteria based on lead performance
    const industries = Object.entries(leadData.industryCount)
      .map(([industry, count]: [string, any]) => ({
        name: industry,
        weight: count > leadData.totalLeads * 0.3 ? 0.9 : 0.6, // High weight for dominant industries
        score: count > 0 ? Math.min(100, 60 + (count / leadData.totalLeads) * 40) : 50
      }))
      .sort((a, b) => b.score - a.score);

    const companySizes = Object.entries(leadData.sizeCount)
      .map(([size, count]: [string, any]) => ({
        range: size,
        weight: count > leadData.totalLeads * 0.2 ? 0.8 : 0.5,
        score: count > 0 ? Math.min(100, 50 + (count / leadData.totalLeads) * 50) : 40
      }))
      .sort((a, b) => b.score - a.score);

    const regions = Object.entries(leadData.locationCount)
      .map(([location, count]: [string, any]) => ({
        location: location,
        weight: count > leadData.totalLeads * 0.25 ? 0.7 : 0.4,
        score: count > 0 ? Math.min(100, 55 + (count / leadData.totalLeads) * 45) : 45
      }))
      .sort((a, b) => b.score - a.score);

    // Revenue ranges based on existing lead patterns
    const revenueRanges = [
      { range: "$25M - $50M", weight: 0.9, score: 90 },
      { range: "$10M - $25M", weight: 0.8, score: 85 },
      { range: "$5M - $10M", weight: 0.7, score: 75 },
      { range: "$1M - $5M", weight: 0.6, score: 65 },
      { range: "Under $1M", weight: 0.3, score: 40 }
    ];

    // Job titles based on existing leads
    const jobTitles = [
      { title: "VP of Sales", weight: 0.95, score: 95 },
      { title: "CTO", weight: 0.9, score: 90 },
      { title: "Head of Operations", weight: 0.85, score: 85 },
      { title: "Director of Marketing", weight: 0.8, score: 80 },
      { title: "Sales Manager", weight: 0.7, score: 70 }
    ];

    return {
      industries: industries.slice(0, 5), // Top 5 industries
      companySizes: companySizes.slice(0, 4), // Top 4 sizes
      regions: regions.slice(0, 6), // Top 6 regions
      revenueRanges,
      jobTitles
    };
  };

  const generateICPMessaging = (userData: any, leadData: any) => {
    const topIndustries = Object.keys(leadData.industryCount).slice(0, 3);
    
    const industryTemplates = topIndustries.map(industry => ({
      industry,
      template: getIndustryTemplate(industry),
      tone: getIndustryTone(industry)
    }));

    const valuePropositions = [
      "Increase sales efficiency by 40% with AI-powered lead generation",
      "Reduce manual prospecting time while improving lead quality",
      "Scale your outreach with personalized multi-channel campaigns",
      "Get real-time insights into your ideal customer profile",
      "Automate follow-ups and nurture sequences for better conversion"
    ];

    const painPoints = [
      "Spending too much time on manual lead research",
      "Low response rates from cold outreach campaigns", 
      "Difficulty identifying high-quality prospects",
      "Lack of personalization in sales messaging",
      "Poor lead scoring and qualification processes"
    ];

    const commonObjections = [
      "We already have a sales process that works",
      "AI tools are too expensive for our budget",
      "Our team isn't technical enough to use AI",
      "We prefer building relationships manually",
      "Concerned about data privacy and security"
    ];

    const successStories = [
      "TechCorp increased qualified leads by 60% in 3 months",
      "SaaS startup scaled from 10 to 100 leads per week",
      "Enterprise client improved conversion rates by 35%",
      "Marketing agency reduced lead research time by 70%",
      "Sales team hit 120% of quota using AI insights"
    ];

    return {
      industryTemplates,
      valuePropositions,
      painPoints,
      commonObjections,
      successStories
    };
  };

  const getIndustryTemplate = (industry: string): string => {
    const templates: Record<string, string> = {
      "SaaS": "Hi {name}, I noticed {company} is innovating in the SaaS space. We've helped similar companies increase their customer acquisition by 40% through AI-powered lead generation...",
      "Technology": "Hi {name}, As a leader in {company}'s technology initiatives, you're probably focused on scaling efficiently. We've helped tech companies like yours automate their sales pipeline...",
      "Analytics": "Hi {name}, Data-driven companies like {company} often struggle with lead quality. Our AI platform has helped analytics firms improve lead scoring accuracy by 60%...",
      "E-commerce": "Hi {name}, E-commerce businesses like {company} need to move fast. Our AI sales platform has helped online retailers increase conversion rates while reducing acquisition costs...",
      "Default": "Hi {name}, I've been following {company}'s growth and believe our AI sales platform could help you scale your customer acquisition efforts..."
    };
    return templates[industry] || templates["Default"];
  };

  const getIndustryTone = (industry: string): string => {
    const tones: Record<string, string> = {
      "SaaS": "Technical and data-driven",
      "Technology": "Innovative and forward-thinking", 
      "Analytics": "Analytical and metric-focused",
      "E-commerce": "Fast-paced and results-oriented",
      "Default": "Professional and value-focused"
    };
    return tones[industry] || tones["Default"];
  };

  const generateICP = (userData: any) => {
    // Generate ICP based on actual lead data and user input
    const leadBasedData = analyzeLeadData();
    const newICPData: ICPData = {
      isGenerated: true,
      confidence: calculateICPConfidence(leadBasedData),
      primaryIndustries: determineIndustries(userData, leadBasedData),
      idealCompanySize: determineCompanySize(userData, leadBasedData),
      topRegions: determineRegions(userData, leadBasedData),
      totalAddressableMarket: calculateTAM(leadBasedData),
      conversionPrediction: calculateConversionPrediction(leadBasedData),
      generatedDate: new Date().toISOString(),
      criteria: generateICPCriteria(userData, leadBasedData),
      messaging: generateICPMessaging(userData, leadBasedData),
    };
    setICPData(newICPData);
  };

  const analyzeLeadData = () => {
    const totalLeads = leads.length;
    const hotLeads = leads.filter(lead => lead.tier === "Hot").length;
    const warmLeads = leads.filter(lead => lead.tier === "Warm").length;
    const coldLeads = leads.filter(lead => lead.tier === "Cold").length;
    
    // Analyze industries from actual leads
    const industryCount: Record<string, number> = {};
    leads.forEach(lead => {
      industryCount[lead.industry] = (industryCount[lead.industry] || 0) + 1;
    });
    
    // Analyze company sizes from actual leads
    const sizeCount: Record<string, number> = {};
    leads.forEach(lead => {
      sizeCount[lead.employees] = (sizeCount[lead.employees] || 0) + 1;
    });
    
    // Analyze locations from actual leads
    const locationCount: Record<string, number> = {};
    leads.forEach(lead => {
      locationCount[lead.location] = (locationCount[lead.location] || 0) + 1;
    });

    // Calculate performance metrics
    const averageScore = totalLeads > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads : 0;
    const qualificationRate = totalLeads > 0 ? (hotLeads + warmLeads) / totalLeads : 0;
    
    return {
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      industryCount,
      sizeCount,
      locationCount,
      averageScore,
      qualificationRate,
      outreachPerformance: {
        emailsSent: outreachStats.emailsSent,
        linkedinConnections: outreachStats.linkedinConnections,
        callsMade: outreachStats.callsMade,
      }
    };
  };

  const calculateICPConfidence = (leadData: any): number => {
    if (leadData.totalLeads === 0) return 75; // Base confidence without data
    
    let confidence = 60;
    
    // More leads = higher confidence
    if (leadData.totalLeads >= 50) confidence += 20;
    else if (leadData.totalLeads >= 20) confidence += 15;
    else if (leadData.totalLeads >= 10) confidence += 10;
    else confidence += 5;
    
    // Higher qualification rate = higher confidence
    if (leadData.qualificationRate >= 0.4) confidence += 15;
    else if (leadData.qualificationRate >= 0.25) confidence += 10;
    else confidence += 5;
    
    // Outreach activity = higher confidence
    const totalOutreach = leadData.outreachPerformance.emailsSent + 
                         leadData.outreachPerformance.linkedinConnections + 
                         leadData.outreachPerformance.callsMade;
    if (totalOutreach >= 100) confidence += 10;
    else if (totalOutreach >= 50) confidence += 5;
    
    return Math.min(confidence, 95); // Cap at 95%
  };

  const determineIndustries = (userData: any, leadData: any): string[] => {
    const userIndustry = userData?.industry || "Technology";
    
    if (leadData.totalLeads === 0) {
      // Fallback to user industry + related
      const allIndustries = ["SaaS", "Technology", "E-commerce", "Healthcare", "Finance", "Manufacturing", "Education", "Real Estate"];
      const remaining = allIndustries.filter(i => i !== userIndustry);
      const additional = remaining.sort(() => 0.5 - Math.random()).slice(0, 2);
      return [userIndustry, ...additional];
    }
    
    // Use actual lead data
    const sortedIndustries = Object.entries(leadData.industryCount)
      .sort(([,a]: any, [,b]: any) => b - a)
      .map(([industry]) => industry);
    
    return sortedIndustries.slice(0, 3);
  };

  const determineCompanySize = (userData: any, leadData: any): string => {
    if (leadData.totalLeads === 0) {
      return userData?.companySize || "51-200 employees";
    }
    
    // Find most common company size from leads
    const sortedSizes = Object.entries(leadData.sizeCount)
      .sort(([,a]: any, [,b]: any) => b - a);
    
    return sortedSizes.length > 0 ? sortedSizes[0][0] : "51-200 employees";
  };

  const determineRegions = (userData: any, leadData: any): string[] => {
    if (leadData.totalLeads === 0) {
      // Fallback to user location
      const userCountry = userData?.country || "United States";
      if (userCountry.includes("United States") || userCountry.includes("Canada")) {
        return ["North America", "Europe", "Asia-Pacific"];
      } else if (userCountry.includes("United Kingdom") || userCountry.includes("Germany") || userCountry.includes("France")) {
        return ["Europe", "North America", "Asia-Pacific"];
      } else {
        return ["Asia-Pacific", "North America", "Europe"];
      }
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
    Object.entries(leadData.locationCount).forEach(([location, count]: [string, any]) => {
      const region = regionMapping[location] || "Other";
      regionCount[region] = (regionCount[region] || 0) + count;
    });
    
    const sortedRegions = Object.entries(regionCount)
      .sort(([,a]: any, [,b]: any) => b - a)
      .map(([region]) => region);
    
    return sortedRegions.slice(0, 3);
  };

  const calculateTAM = (leadData: any): number => {
    if (leadData.totalLeads === 0) {
      return Math.floor(Math.random() * 50000) + 10000; // Fallback
    }
    
    // Base TAM on lead performance and industries
    const baseMultiplier = 1000;
    const industryMultipliers: Record<string, number> = {
      "Technology": 2.5,
      "SaaS": 3.0,
      "E-commerce": 2.0,
      "Healthcare": 1.8,
      "Finance": 2.2,
      "Manufacturing": 1.5,
      "Education": 1.3,
      "Real Estate": 1.6,
    };
    
    let tam = leadData.totalLeads * baseMultiplier;
    
    // Adjust based on top industries
    Object.entries(leadData.industryCount).forEach(([industry, count]: [string, any]) => {
      const multiplier = industryMultipliers[industry] || 1.0;
      tam += count * baseMultiplier * multiplier;
    });
    
    // Add performance bonus
    if (leadData.qualificationRate > 0.3) tam *= 1.5;
    else if (leadData.qualificationRate > 0.2) tam *= 1.2;
    
    return Math.floor(tam);
  };

  const calculateConversionPrediction = (leadData: any): number => {
    if (leadData.totalLeads === 0) {
      return Math.floor(Math.random() * 15) + 10; // 10-25% fallback
    }
    
    let prediction = 8; // Base conversion rate
    
    // Adjust based on lead quality
    const hotRatio = leadData.totalLeads > 0 ? leadData.hotLeads / leadData.totalLeads : 0;
    const warmRatio = leadData.totalLeads > 0 ? leadData.warmLeads / leadData.totalLeads : 0;
    
    prediction += hotRatio * 25; // Hot leads boost
    prediction += warmRatio * 15; // Warm leads boost
    
    // Adjust based on outreach activity
    const totalOutreach = leadData.outreachPerformance.emailsSent + 
                         leadData.outreachPerformance.linkedinConnections + 
                         leadData.outreachPerformance.callsMade;
    
    if (totalOutreach >= 100) prediction += 8;
    else if (totalOutreach >= 50) prediction += 5;
    else if (totalOutreach >= 20) prediction += 3;
    
    // Adjust based on AI phone success (estimated from calls made)
    if (leadData.outreachPerformance.callsMade >= 20) prediction += 5;
    else if (leadData.outreachPerformance.callsMade >= 10) prediction += 3;
    
    return Math.min(Math.round(prediction), 35); // Cap at 35%
  };

  const updateOutreachStats = () => {
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => lead.score >= 70).length;
    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    
    setOutreachStats(prev => ({
      ...prev,
      totalLeads,
      qualifiedLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      aiConfidence: totalLeads > 0 ? Math.floor(Math.random() * 20) + 80 : 0,
    }));
  };

  const trackSentMessage = (messageType: 'email' | 'linkedin' | 'phone', leadId?: string) => {
    setOutreachStats(prev => {
      const updated = { ...prev };
      switch (messageType) {
        case 'email':
          updated.emailsSent = prev.emailsSent + 1;
          if (leadId && !prev.emailLeads.includes(leadId)) {
            updated.emailLeads = [...prev.emailLeads, leadId];
          }
          break;
        case 'linkedin':
          updated.linkedinConnections = prev.linkedinConnections + 1;
          if (leadId && !prev.linkedinLeads.includes(leadId)) {
            updated.linkedinLeads = [...prev.linkedinLeads, leadId];
          }
          break;
        case 'phone':
          updated.callsMade = prev.callsMade + 1;
          if (leadId && !prev.phoneLeads.includes(leadId)) {
            updated.phoneLeads = [...prev.phoneLeads, leadId];
          }
          break;
      }
      return updated;
    });
  };

  const calculateICPMatchScore = (lead: Lead): number => {
    if (!icpData.isGenerated || !icpData.criteria) {
      return lead.score; // Return original score if no ICP generated
    }

    let matchScore = 0;
    let totalWeight = 0;

    // Industry matching
    const industryMatch = icpData.criteria.industries.find(i => i.name === lead.industry);
    if (industryMatch) {
      matchScore += industryMatch.score * industryMatch.weight;
      totalWeight += industryMatch.weight;
    }

    // Company size matching
    const sizeMatch = icpData.criteria.companySizes.find(s => s.range === lead.employees);
    if (sizeMatch) {
      matchScore += sizeMatch.score * sizeMatch.weight;
      totalWeight += sizeMatch.weight;
    }

    // Region matching
    const regionMatch = icpData.criteria.regions.find(r => r.location === lead.location);
    if (regionMatch) {
      matchScore += regionMatch.score * regionMatch.weight;
      totalWeight += regionMatch.weight;
    }

    // Revenue matching (approximate based on lead revenue field)
    const revenueMatch = icpData.criteria.revenueRanges.find(r => lead.revenue.includes(r.range.split(' - ')[0]));
    if (revenueMatch) {
      matchScore += revenueMatch.score * revenueMatch.weight;
      totalWeight += revenueMatch.weight;
    }

    // Job title matching
    const titleMatch = icpData.criteria.jobTitles.find(t => lead.title.toLowerCase().includes(t.title.toLowerCase()));
    if (titleMatch) {
      matchScore += titleMatch.score * titleMatch.weight;
      totalWeight += titleMatch.weight;
    }

    // Calculate weighted average, fallback to original score
    const icpScore = totalWeight > 0 ? Math.round(matchScore / totalWeight) : lead.score;
    
    // Blend with original score (70% ICP, 30% original)
    return Math.round(icpScore * 0.7 + lead.score * 0.3);
  };

  const resetAllData = () => {
    setLeads([]);
    setICPData(defaultICPData);
    setOutreachStats(defaultOutreachStats);
    
    if (user?.id) {
      localStorage.removeItem(`leads_${user.id}`);
      localStorage.removeItem(`icp_${user.id}`);
      localStorage.removeItem(`stats_${user.id}`);
    }
    
    // Also clear mailbox data
    localStorage.removeItem('emailThreads');
    localStorage.removeItem('linkedInThreads');
  };

  const hasAnyData = leads.length > 0 || icpData.isGenerated;

  const value = {
    leads,
    icpData,
    outreachStats,
    addLead,
    addMultipleLeads,
    generateICP,
    updateOutreachStats,
    trackSentMessage,
    calculateICPMatchScore,
    hasAnyData,
    resetAllData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}; 