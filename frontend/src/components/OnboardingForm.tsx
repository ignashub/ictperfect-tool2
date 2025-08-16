import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, Building, Target, Info } from "lucide-react";

interface OnboardingFormProps {
  onComplete: (data: any) => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company: "",
    industry: "",
    country: "",
    companySize: "",
    email: "",
    name: "",
    targetCriteria: ""
  });

  const industries = [
    "Technology", "Healthcare", "Finance", "E-commerce", "Manufacturing", 
    "Education", "Real Estate", "Marketing", "Consulting", "Other"
  ];

  const countries = [
    "United States", "Canada", "United Kingdom", "Germany", "France", 
    "Australia", "Netherlands", "Sweden", "Singapore", "Other"
  ];

  const companySizes = [
    "1-10 employees", "11-50 employees", "51-200 employees", 
    "201-1000 employees", "1000+ employees"
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.company;
      case 2:
        return formData.industry && formData.country && formData.companySize && formData.targetCriteria;
      default:
        return false;
    }
  };



  return (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to ICPerfect
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Let's set up your AI-powered sales intelligence platform
          </CardDescription>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic Information</h3>
                <p className="text-gray-600">Tell us about yourself and your company</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Details</h3>
                <p className="text-gray-600">Help us understand your business context</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <span>Industry</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your company's industry</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <span>Country</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your company's location</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <span>Company Size</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your company's employee count</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCriteria" className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Target Customer Criteria (ICP)</span>
                </Label>
                <Textarea
                  id="targetCriteria"
                  placeholder="Describe your ideal customer profile - industry, company size, key services, funding stage, geographic location, etc. Example: SaaS companies in Europe, 50-200 employees, B2B focus, Series A+ funding..."
                  value={formData.targetCriteria}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCriteria: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This helps our AI identify and prioritize the best prospects for your business
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center space-x-2"
            >
              <span>Previous</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
            >
              <span>{step === 2 ? 'Complete Setup' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
};
