'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  date?: string;
  count?: number;
  category?: string;
  views?: number;
  avgPrice?: number;
  brand?: string;
  value?: number;
}

interface AnalyticsChartsProps {
  dailyViews: ChartData[];
  dailySearches: ChartData[];
  categoryTrends: ChartData[];
  categoryPerformance: ChartData[];
  topBrands: ChartData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function AnalyticsCharts({
  dailyViews,
  dailySearches,
  categoryTrends,
  categoryPerformance,
  topBrands
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Daily Activity Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg p-4 border">
          <h3 className="text-lg font-semibold mb-4">Daily Product Views</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [value, 'Views']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <h3 className="text-lg font-semibold mb-4">Daily Searches</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySearches}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [value, 'Searches']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg p-4 border">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: any) => [value, 'Views']} />
              <Bar dataKey="views" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <h3 className="text-lg font-semibold mb-4">Top Brands</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topBrands} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="brand" type="category" width={80} />
              <Tooltip formatter={(value: any) => [value, 'Views']} />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={categoryTrends}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {categoryTrends.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [value, 'Views']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
