import { Metadata } from 'next';
import AnalyticsDashboard from '@/components/analytics/analytics-dashboard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | ShopAI',
  description: 'Track your shopping behavior and discover insights with our comprehensive analytics dashboard.',
};

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AnalyticsDashboard />
      </div>
    </ProtectedRoute>
  );
}
