import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, Mail, Phone, Building, MapPin, Calendar, 
  Crown, Bell, Shield, Zap, Settings, Save,
  Brain, Target, Globe, Users, Camera, Edit3, TrendingUp
} from "lucide-react";

interface ProfileProps {
  userData: any;
}

export const Profile = ({ userData }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || "Alex Johnson",
    email: userData?.email || "alex.johnson@company.com",
    phone: "+1 (555) 123-4567",
    company: userData?.company || "TechCorp Inc",
    title: "VP of Sales",
    location: "San Francisco, CA",
    bio: "Experienced sales leader focused on leveraging AI to drive revenue growth and optimize sales processes.",
    website: "https://techcorp.com",
    linkedIn: "alex-johnson-sales"
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    aiRecommendations: true,
    weeklyReports: true,
    leadAlerts: true,
    marketingEmails: false,
    aiConfidenceThreshold: "80",
    autoSequencing: true,
    dataRetention: "12"
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    // Show success message
  };

  const subscriptionPlan = {
    name: "Professional",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited lead scoring",
      "Advanced AI insights",
      "Multi-channel sequences",
      "Priority support",
      "Custom integrations"
    ],
    nextBilling: "March 15, 2024"
  };

  const activityStats = [
    { label: "Messages Generated", value: "1,247", icon: Brain },
    { label: "Leads Qualified", value: "186", icon: Target },
    { label: "Campaigns Active", value: "12", icon: Zap },
    { label: "Response Rate", value: "18.5%", icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.title} at {profileData.company}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profileData.location}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                {subscriptionPlan.name}
              </Badge>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Manage your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profileData.linkedIn}
                    onChange={(e) => setProfileData({...profileData, linkedIn: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Preferences</span>
              </CardTitle>
              <CardDescription>Configure how AI assists with your sales process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="confidence">AI Confidence Threshold</Label>
                  <Select 
                    value={preferences.aiConfidenceThreshold} 
                    onValueChange={(value) => setPreferences({...preferences, aiConfidenceThreshold: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70% - More Leads</SelectItem>
                      <SelectItem value="80">80% - Balanced</SelectItem>
                      <SelectItem value="90">90% - High Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention (months)</Label>
                  <Select 
                    value={preferences.dataRetention} 
                    onValueChange={(value) => setPreferences({...preferences, dataRetention: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-recommendations">AI Recommendations</Label>
                    <p className="text-sm text-gray-500">Receive AI-powered lead and strategy suggestions</p>
                  </div>
                  <Switch
                    id="ai-recommendations"
                    checked={preferences.aiRecommendations}
                    onCheckedChange={(checked) => setPreferences({...preferences, aiRecommendations: checked})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sequencing">Auto Sequencing</Label>
                    <p className="text-sm text-gray-500">Automatically trigger follow-up sequences</p>
                  </div>
                  <Switch
                    id="auto-sequencing"
                    checked={preferences.autoSequencing}
                    onCheckedChange={(checked) => setPreferences({...preferences, autoSequencing: checked})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose what notifications you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">General account and system notifications</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lead-alerts">Lead Alerts</Label>
                  <p className="text-sm text-gray-500">Notifications for new qualified leads</p>
                </div>
                <Switch
                  id="lead-alerts"
                  checked={preferences.leadAlerts}
                  onCheckedChange={(checked) => setPreferences({...preferences, leadAlerts: checked})}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Weekly performance and insights summary</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={preferences.weeklyReports}
                  onCheckedChange={(checked) => setPreferences({...preferences, weeklyReports: checked})}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-gray-500">Product updates and promotional content</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => setPreferences({...preferences, marketingEmails: checked})}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <span>Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-3">
                  {subscriptionPlan.name} Plan
                </Badge>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptionPlan.price}
                  <span className="text-sm font-normal text-gray-500">/{subscriptionPlan.period}</span>
                </div>
              </div>
              <div className="space-y-2">
                {subscriptionPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Next billing: {subscriptionPlan.nextBilling}
                </p>
                <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span>Activity Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}; 