import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, MapPin, Users, Star, Mail, Phone, Linkedin, Search, Filter, X, Globe, Calendar, TrendingUp, DollarSign, Activity, MessageCircle, Target, Plus, Upload, Sparkles, UserPlus, Brain, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/use-toast";

interface LeadsListProps {
  onSwitchToAIEngine?: (leadId?: string) => void;
}

export const LeadsList = ({ onSwitchToAIEngine }: LeadsListProps) => {
  const { leads, addLead, addMultipleLeads, icpData, calculateICPMatchScore } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [newLead, setNewLead] = useState({
    company: "",
    industry: "",
    location: "",
    employees: "",
    contact: "",
    title: "",
    email: "",
    phone: "",
    linkedin: "",
    website: "",
    revenue: "",
    founded: "",
  });

  const generateAILeads = () => {
    setIsGeneratingAI(true);
    // Simulate AI processing with delay
    setTimeout(() => {
      const aiGeneratedLeads = [
        {
          company: "InnovateTech Solutions",
          industry: "SaaS",
          location: "Austin, TX",
          employees: "100-200",
          score: 89,
          contact: "Jessica Martinez",
          title: "VP of Sales",
          email: "j.martinez@innovatetech.com",
          phone: "+1 (555) 234-5678",
          linkedin: "jessica-martinez-sales",
          website: "innovatetech.com",
          revenue: "$15M - $30M",
          founded: "2017",
          source: "AI Generated" as const,
        },
        {
          company: "CloudFirst Analytics",
          industry: "Technology",
          location: "Denver, CO",
          employees: "75-100",
          score: 84,
          contact: "Robert Kim",
          title: "CTO",
          email: "r.kim@cloudfirst.com",
          phone: "+1 (555) 345-6789",
          linkedin: "robert-kim-tech",
          website: "cloudfirst.com",
          revenue: "$10M - $15M",
          founded: "2019",
          source: "AI Generated" as const,
        },
        {
          company: "NextGen E-commerce",
          industry: "E-commerce",
          location: "Miami, FL",
          employees: "50-75",
          score: 78,
          contact: "Amanda Thompson",
          title: "COO",
          email: "a.thompson@nextgenecom.com",
          phone: "+1 (555) 456-7890",
          linkedin: "amanda-thompson-coo",
          website: "nextgenecom.com",
          revenue: "$5M - $10M",
          founded: "2020",
          source: "AI Generated" as const,
        }
      ];
      addMultipleLeads(aiGeneratedLeads);
      setIsGeneratingAI(false);
    }, 2500);
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError("Please select a CSV file");
      return;
    }

    setCsvFile(file);
    setCsvError("");
    
    // Read and parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsedData = parseCsvData(text);
        setCsvData(parsedData);
        setCsvPreview(parsedData.slice(0, 5)); // Show first 5 rows as preview
      } catch (error) {
        setCsvError("Error parsing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const parseCsvData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header row and one data row");
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length !== headers.length) continue; // Skip malformed rows

      const row: any = {};
      headers.forEach((header, index) => {
        // Map common CSV headers to our lead structure
        const mappedField = mapCsvHeader(header);
        if (mappedField) {
          row[mappedField] = values[index] || '';
        }
      });

      // Only add rows that have required fields
      if (row.company && row.contact && row.email) {
        // Generate score for CSV leads (tier will be calculated automatically by useAppData)
        row.score = Math.floor(Math.random() * 30) + 70; // 70-99 score
        row.source = "Import" as const;
        
        // Ensure all required fields have default values
        row.industry = row.industry || '';
        row.location = row.location || '';
        row.employees = row.employees || '';
        row.title = row.title || '';
        row.phone = row.phone || '';
        row.linkedin = row.linkedin || '';
        row.website = row.website || '';
        row.revenue = row.revenue || '';
        row.founded = row.founded || '';
        
        data.push(row);
      }
    }

    if (data.length === 0) {
      throw new Error("No valid leads found in CSV. Please ensure you have company, contact, and email columns.");
    }

    return data;
  };

  const mapCsvHeader = (header: string): string | null => {
    const mapping: { [key: string]: string } = {
      'company': 'company',
      'company name': 'company',
      'organization': 'company',
      'business': 'company',
      'contact': 'contact',
      'contact name': 'contact',
      'name': 'contact',
      'full name': 'contact',
      'first name': 'contact',
      'email': 'email',
      'email address': 'email',
      'phone': 'phone',
      'phone number': 'phone',
      'mobile': 'phone',
      'title': 'title',
      'job title': 'title',
      'position': 'title',
      'role': 'title',
      'industry': 'industry',
      'sector': 'industry',
      'location': 'location',
      'city': 'location',
      'address': 'location',
      'employees': 'employees',
      'company size': 'employees',
      'team size': 'employees',
      'linkedin': 'linkedin',
      'linkedin profile': 'linkedin',
      'website': 'website',
      'company website': 'website',
      'url': 'website',
      'revenue': 'revenue',
      'annual revenue': 'revenue',
      'founded': 'founded',
      'founded year': 'founded',
      'established': 'founded',
    };

    return mapping[header] || null;
  };

  const handleCsvUpload = () => {
    if (csvData.length === 0) {
      setCsvError("No valid leads to import");
      return;
    }

    setIsProcessingCsv(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        console.log("Attempting to add CSV leads:", csvData);
        addMultipleLeads(csvData);
        console.log("CSV leads added successfully");
        setIsProcessingCsv(false);
        setIsCsvModalOpen(false);
        setCsvFile(null);
        setCsvData([]);
        setCsvPreview([]);
        setCsvError("");
        toast({
          title: "CSV Import Successful",
          description: `Imported ${csvData.length} leads successfully.`,
        });
      } catch (error) {
        console.error("Error uploading CSV leads:", error);
        setCsvError("Error uploading leads. Please try again.");
        setIsProcessingCsv(false);
      }
    }, 1500);
  };

  const resetCsvUpload = () => {
    setCsvFile(null);
    setCsvData([]);
    setCsvPreview([]);
    setCsvError("");
  };

  const handleAddLead = () => {
    if (!newLead.company || !newLead.contact || !newLead.email) {
      return;
    }

    const leadToAdd = {
      ...newLead,
      score: Math.floor(Math.random() * 30) + 70, // 70-99 score (tier will be calculated automatically)
      source: "Manual" as const,
    };

    addLead(leadToAdd);
    setNewLead({
      company: "",
      industry: "",
      location: "",
      employees: "",
      contact: "",
      title: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
      revenue: "",
      founded: "",
    });
    setIsAddModalOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-700 bg-green-100 hover:bg-green-50 hover:text-green-600";
    if (score >= 80) return "text-orange-700 bg-orange-100 hover:bg-orange-50 hover:text-orange-600";
    return "text-slate-700 bg-slate-100 hover:bg-slate-50 hover:text-slate-600";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Hot": return "bg-red-100 text-red-800 hover:bg-red-50 hover:text-red-700";
      case "Warm": return "bg-amber-100 text-amber-800 hover:bg-amber-50 hover:text-amber-700";
      default: return "bg-sky-100 text-sky-800 hover:bg-sky-50 hover:text-sky-700";
    }
  };

  const getScoreTooltip = (score: number, isICP: boolean = false) => {
    if (isICP) {
      return `ICP Match Score: ${score}/100. This enhanced score is calculated based on your Ideal Customer Profile criteria including industry match, company size, job title authority, and revenue range. Higher scores indicate better alignment with your target customer profile.`;
    } else {
      return `Lead Quality Score: ${score}/100. Based on company data, growth signals, contact authority level, industry value, and engagement potential. Scores 90+ are Hot leads, 70-89 are Warm leads, and below 70 are Cold leads.`;
    }
  };

  const getTierTooltip = (tier: string) => {
    switch (tier) {
      case "Hot":
        return "🔥 Hot Lead: High-value prospect with strong buying signals. Ideal industry, company size, decision-maker role, and good revenue. Engagement score 85+. Expected conversion rate: 35-45%.";
      case "Warm":
        return "🟡 Warm Lead: Good potential prospect with some positive signals. Decent company profile and moderate engagement potential. Engagement score 65-84. Expected conversion rate: 15-25%.";
      default:
        return "🔵 Cold Lead: Early-stage prospect requiring nurturing. Lower engagement signals but still has potential. Engagement score below 65. Expected conversion rate: 3-8%.";
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = scoreFilter === "all" || 
                        (scoreFilter === "hot" && lead.score >= 90) ||
                        (scoreFilter === "warm" && lead.score >= 80 && lead.score < 90) ||
                        (scoreFilter === "cold" && lead.score < 80);
    return matchesSearch && matchesScore;
  });

  const openLeadDetails = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeLeadDetails = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-purple-600" />
            <span>Lead Management</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {leads.length} leads
            </Badge>
          </CardTitle>
          <CardDescription>Build and manage your prospect database with AI-powered scoring</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leads Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your prospect database. Add leads manually or let our AI generate qualified prospects based on your ICP.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <UserPlus className="w-4 h-4" />
                      <span>Add Manually</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Lead</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          value={newLead.company}
                          onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={newLead.industry}
                          onChange={(e) => setNewLead(prev => ({ ...prev, industry: e.target.value }))}
                          placeholder="SaaS"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Name *</Label>
                        <Input
                          id="contact"
                          value={newLead.contact}
                          onChange={(e) => setNewLead(prev => ({ ...prev, contact: e.target.value }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={newLead.title}
                          onChange={(e) => setNewLead(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="CEO"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newLead.email}
                          onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@acme.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newLead.phone}
                          onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newLead.location}
                          onChange={(e) => setNewLead(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employees">Company Size</Label>
                        <Input
                          id="employees"
                          value={newLead.employees}
                          onChange={(e) => setNewLead(prev => ({ ...prev, employees: e.target.value }))}
                          placeholder="50-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newLead.website}
                          onChange={(e) => setNewLead(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="acme.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={newLead.linkedin}
                          onChange={(e) => setNewLead(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="john-doe-ceo"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddLead}
                        disabled={!newLead.company || !newLead.contact || !newLead.email}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Add Lead
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload CSV</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Upload Leads from CSV</span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* CSV Upload Instructions */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          Your CSV file should include these columns (case-insensitive):
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-blue-600">
                          <div><strong>Required:</strong> Company, Contact, Email</div>
                          <div><strong>Optional:</strong> Title, Phone, Industry, Location, Website, LinkedIn</div>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="csvFileEmpty">Select CSV File</Label>
                          <div className="mt-2">
                            <Input
                              id="csvFileEmpty"
                              type="file"
                              accept=".csv"
                              onChange={handleCsvFileChange}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>

                        {csvError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{csvError}</AlertDescription>
                          </Alert>
                        )}

                        {csvFile && !csvError && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              File "{csvFile.name}" loaded successfully. Found {csvData.length} valid leads.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* CSV Preview */}
                      {csvPreview.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Preview (First 5 rows)</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Company</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Contact</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Title</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Industry</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {csvPreview.map((lead, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-sm text-gray-900">{lead.company}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{lead.contact}</td>
                                    <td className="px-3 py-2 text-sm text-gray-900">{lead.email}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">{lead.title || '-'}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600">{lead.industry || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {csvData.length > 5 && (
                            <p className="text-sm text-gray-500">
                              ...and {csvData.length - 5} more leads
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setIsCsvModalOpen(false)}>
                            Cancel
                          </Button>
                          {csvFile && (
                            <Button variant="outline" onClick={resetCsvUpload}>
                              Reset
                            </Button>
                          )}
                        </div>
                        <Button 
                          onClick={handleCsvUpload}
                          disabled={csvData.length === 0 || isProcessingCsv}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isProcessingCsv ? (
                            <>
                              <Activity className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Import {csvData.length} Leads
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={generateAILeads}
                        disabled={isGeneratingAI}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Use AI</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI will find qualified prospects based on your ICP</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {isGeneratingAI && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6">
                      <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">AI Lead Generation in Progress</p>
                      <p className="text-sm text-blue-700">Analyzing market data and identifying qualified prospects...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Leads List
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search companies or contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="hot">Hot (90+)</SelectItem>
                    <SelectItem value="warm">Warm (80-89)</SelectItem>
                    <SelectItem value="cold">Cold (60-79)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add Lead</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Lead</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name *</Label>
                          <Input
                            id="company"
                            value={newLead.company}
                            onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Acme Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={newLead.industry}
                            onChange={(e) => setNewLead(prev => ({ ...prev, industry: e.target.value }))}
                            placeholder="SaaS"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact">Contact Name *</Label>
                          <Input
                            id="contact"
                            value={newLead.contact}
                            onChange={(e) => setNewLead(prev => ({ ...prev, contact: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            value={newLead.title}
                            onChange={(e) => setNewLead(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="CEO"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newLead.email}
                            onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@acme.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newLead.phone}
                            onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newLead.location}
                            onChange={(e) => setNewLead(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employees">Company Size</Label>
                          <Input
                            id="employees"
                            value={newLead.employees}
                            onChange={(e) => setNewLead(prev => ({ ...prev, employees: e.target.value }))}
                            placeholder="50-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={newLead.website}
                            onChange={(e) => setNewLead(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="acme.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={newLead.linkedin}
                            onChange={(e) => setNewLead(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="john-doe-ceo"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAddLead}
                          disabled={!newLead.company || !newLead.contact || !newLead.email}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          Add Lead
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload CSV</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <span>Upload Leads from CSV</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* CSV Upload Instructions */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
                          <p className="text-sm text-blue-700 mb-2">
                            Your CSV file should include these columns (case-insensitive):
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-blue-600">
                            <div><strong>Required:</strong> Company, Contact, Email</div>
                            <div><strong>Optional:</strong> Title, Phone, Industry, Location, Website, LinkedIn</div>
                          </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="csvFile">Select CSV File</Label>
                            <div className="mt-2">
                              <Input
                                id="csvFile"
                                type="file"
                                accept=".csv"
                                onChange={handleCsvFileChange}
                                className="cursor-pointer"
                              />
                            </div>
                          </div>

                          {csvError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{csvError}</AlertDescription>
                            </Alert>
                          )}

                          {csvFile && !csvError && (
                            <Alert>
                              <CheckCircle className="h-4 w-4" />
                              <AlertDescription>
                                File "{csvFile.name}" loaded successfully. Found {csvData.length} valid leads.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        {/* CSV Preview */}
                        {csvPreview.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Preview (First 5 rows)</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Company</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Contact</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Title</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Industry</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {csvPreview.map((lead, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                      <td className="px-3 py-2 text-sm text-gray-900">{lead.company}</td>
                                      <td className="px-3 py-2 text-sm text-gray-900">{lead.contact}</td>
                                      <td className="px-3 py-2 text-sm text-gray-900">{lead.email}</td>
                                      <td className="px-3 py-2 text-sm text-gray-600">{lead.title || '-'}</td>
                                      <td className="px-3 py-2 text-sm text-gray-600">{lead.industry || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {csvData.length > 5 && (
                              <p className="text-sm text-gray-500">
                                ...and {csvData.length - 5} more leads
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setIsCsvModalOpen(false)}>
                              Cancel
                            </Button>
                            {csvFile && (
                              <Button variant="outline" onClick={resetCsvUpload}>
                                Reset
                              </Button>
                            )}
                          </div>
                          <Button 
                            onClick={handleCsvUpload}
                            disabled={csvData.length === 0 || isProcessingCsv}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            {isProcessingCsv ? (
                              <>
                                <Activity className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Import {csvData.length} Leads
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={generateAILeads}
                          disabled={isGeneratingAI}
                          size="sm" 
                          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isGeneratingAI ? (
                            <>
                              <Activity className="w-4 h-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Use AI</span>
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI will find qualified prospects based on your ICP</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {isGeneratingAI && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6">
                      <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">AI Lead Generation in Progress</p>
                      <p className="text-sm text-blue-700">Analyzing market data and identifying qualified prospects...</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeads.map((lead) => (
                  <Card 
                    key={lead.id} 
                    className="bg-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => openLeadDetails(lead)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{lead.company}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Building className="w-4 h-4" />
                            <span>{lead.industry}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{lead.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {icpData.isGenerated ? (
                            <div className="flex flex-col items-end space-y-1">
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className={`${getScoreColor(calculateICPMatchScore(lead))} px-3 py-1 text-sm font-medium hover:scale-105 transition-all duration-200`}>
                                <Target className="w-3 h-3 mr-1" />
                                {calculateICPMatchScore(lead)}
                              </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{getScoreTooltip(calculateICPMatchScore(lead), true)}</p>
                                </TooltipContent>
                              </Tooltip>
                              <span className="text-xs text-gray-500">ICP Match</span>
                            </div>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className={`${getScoreColor(lead.score)} px-3 py-1 text-sm font-medium hover:scale-105 transition-all duration-200`}>
                              {lead.score}
                            </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{getScoreTooltip(lead.score, false)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className={`${getTierColor(lead.tier)} transition-all duration-200`}>
                            {lead.tier}
                          </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{getTierTooltip(lead.tier)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.contact}</p>
                            <p className="text-sm text-gray-600">{lead.title}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{lead.employees} employees</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>{lead.revenue}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex space-x-1">
                            <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200">
                              <Linkedin className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all duration-200">
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {lead.source === "AI Generated" ? "Found by AI" : lead.source}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLeads.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeLeadDetails}>
        <DialogContent className="max-w-4xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLead.company}</h2>
                    <p className="text-gray-600">{selectedLead.industry} • {selectedLead.location}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedLead.contact}</p>
                          <p className="text-sm text-gray-600">{selectedLead.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">{selectedLead.email}</span>
                      </div>
                      {selectedLead.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900">{selectedLead.phone}</span>
                        </div>
                      )}
                      {selectedLead.linkedin && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Linkedin className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900">{selectedLead.linkedin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-medium text-gray-900">{selectedLead.employees}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium text-gray-900">{selectedLead.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Founded</span>
                        <span className="font-medium text-gray-900">{selectedLead.founded}</span>
                      </div>
                      {selectedLead.website && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Website</span>
                          <span className="font-medium text-gray-900">{selectedLead.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Score & Analysis</h3>
                    <div className="space-y-4">
                      {icpData.isGenerated && (
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-700 font-medium flex items-center">
                              <Target className="w-4 h-4 mr-2 text-green-600" />
                              ICP Match Score
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className={`${getScoreColor(calculateICPMatchScore(selectedLead))} px-3 py-1 text-lg font-bold hover:scale-105 transition-all duration-200`}>
                              {calculateICPMatchScore(selectedLead)}
                            </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{getScoreTooltip(calculateICPMatchScore(selectedLead), true)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div 
                              className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${calculateICPMatchScore(selectedLead)}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Enhanced score based on your Ideal Customer Profile criteria including industry, company size, and job title matching.
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700 font-medium">Original Score</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className={`${getScoreColor(selectedLead.score)} px-3 py-1 text-lg font-bold hover:scale-105 transition-all duration-200`}>
                            {selectedLead.score}
                          </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{getScoreTooltip(selectedLead.score, false)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedLead.score}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Base lead quality score based on company data, growth signals, and contact authority level.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="outline" onClick={closeLeadDetails}>
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => {
                    closeLeadDetails();
                    onSwitchToAIEngine?.(selectedLead?.id);
                  }}
                >
                  Start Outreach
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
};
