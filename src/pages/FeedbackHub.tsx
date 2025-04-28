import React, { useState } from 'react';
import FeedbackRepository from '@/components/feedback-hub/FeedbackRepository';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const FeedbackHub = () => {
  const { toast } = useToast();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { 
    data, 
    isLoading, 
    metadataDistribution, 
    sourcesDistribution 
  } = useDashboardData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
    toast({
      title: isDebugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
      description: isDebugMode 
        ? "Hiding detailed debug information." 
        : "Showing detailed debug information and logs.",
      variant: isDebugMode ? "default" : "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Hub</h1>
        <button
          onClick={toggleDebugMode}
          className={`px-4 py-2 rounded-md transition-colors ${
            isDebugMode 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {isDebugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
        </button>
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        {/* Feedback Over Time */}
        <Card className="shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Feedback Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3">
            <div className="h-[250px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.timeSeriesData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribution Charts */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Roles Distribution */}
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Roles Distribution</CardTitle>
              <CardDescription className="text-xs">By company role</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.roles || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Sources */}
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Feedback Sources</CardTitle>
              <CardDescription className="text-xs">Distribution by source</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcesDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {sourcesDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ARR Distribution */}
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">ARR Distribution</CardTitle>
              <CardDescription className="text-xs">By company revenue</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.arr || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Size */}
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">Company Size</CardTitle>
              <CardDescription className="text-xs">By employee count</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 p-3">
              <div className="h-[220px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metadataDistribution?.employeeCount || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <FeedbackRepository isDebugMode={isDebugMode} />
    </div>
  );
};

export default FeedbackHub;
