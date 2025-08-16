import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, TrendingUp, Target, Activity, BarChart3, Play, Pause, Settings } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";

export const RLSimulator = () => {
  const { hasAnyData, leads } = useAppData();
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const runSimulation = () => {
    setIsRunning(true);
    // Simulate AI processing
    setTimeout(() => {
      setSimulationResults({
        optimizationScore: Math.floor(Math.random() * 20) + 80,
        recommendedActions: [
          "Increase LinkedIn outreach frequency by 15%",
          "Focus on SaaS companies with 50-200 employees",
          "Send follow-up emails 3 days after initial contact"
        ],
        expectedImprovement: Math.floor(Math.random() * 25) + 15
      });
      setIsRunning(false);
    }, 3000);
  };

  if (!hasAnyData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Optimization Engine</span>
          </CardTitle>
          <CardDescription>Reinforcement learning for outreach strategy optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data for Analysis</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              The AI engine needs leads and outreach data to provide optimization recommendations.
            </p>
            <div className="text-sm text-gray-500">
              • Add leads to your database<br/>
              • Start outreach campaigns<br/>
              • Generate ICP analysis
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
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Optimization Engine</span>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        </CardTitle>
        <CardDescription>Reinforcement learning for outreach strategy optimization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div>
            <h4 className="font-semibold text-gray-900">Current Data Set</h4>
            <p className="text-sm text-gray-600">{leads.length} leads • Active campaigns</p>
          </div>
          <Button 
            onClick={runSimulation}
            disabled={isRunning}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {isRunning && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6">
                <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-blue-900">AI Analysis in Progress</p>
                <p className="text-sm text-blue-700">Processing outreach patterns and performance data...</p>
              </div>
            </div>
          </div>
        )}

        {simulationResults && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-900">Optimization Score</h4>
                <Badge className="bg-green-600 text-white">
                  {simulationResults.optimizationScore}/100
                </Badge>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${simulationResults.optimizationScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-700">
                Your outreach strategy is performing well with room for {simulationResults.expectedImprovement}% improvement.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {simulationResults.recommendedActions.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Apply Recommendations
            </Button>
          </div>
        )}

        {!simulationResults && !isRunning && (
          <div className="text-center py-6">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click "Run Analysis" to get AI-powered optimization insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 