import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Subscriptions",
      value: stats?.total_subscriptions || 0,
      icon: Calendar,
      color: "bg-blue-500",
      testId: "total-subscriptions-card",
    },
    {
      title: "Upcoming Renewals",
      subtitle: "Next 30 Days",
      value: stats?.upcoming_renewals || 0,
      icon: AlertTriangle,
      color: "bg-amber-500",
      testId: "upcoming-renewals-card",
    },
    {
      title: "Due Today / Overdue",
      value: stats?.renewals_due_today || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      testId: "due-today-card",
    },
    {
      title: "Expired Subscriptions",
      value: stats?.expired_subscriptions || 0,
      icon: XCircle,
      color: "bg-red-500",
      testId: "expired-subscriptions-card",
    },
  ];

  return (
    <div className="space-y-6" data-testid="admin-dashboard">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-600">
          Monitor your subscription renewals and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border-slate-200 hover:shadow-lg transition-shadow"
              data-testid={stat.testId}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                  {stat.subtitle && (
                    <span className="block text-xs text-slate-500 font-normal mt-1">
                      {stat.subtitle}
                    </span>
                  )}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="text-3xl font-bold text-slate-900"
                  data-testid={`${stat.testId}-value`}
                >
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/subscriptions"
              className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
              data-testid="quick-action-subscriptions"
            >
              <h3 className="font-semibold text-indigo-900 mb-1">
                Manage Subscriptions
              </h3>
              <p className="text-sm text-indigo-700">
                View, add, edit, or delete subscriptions
              </p>
            </a>
            <a
              href="/staff"
              className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              data-testid="quick-action-staff"
            >
              <h3 className="font-semibold text-slate-900 mb-1">
                Manage Staff
              </h3>
              <p className="text-sm text-slate-600">
                Add or manage staff accounts
              </p>
            </a>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Renewal Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.upcoming_renewals > 0 && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">
                      {stats.upcoming_renewals} subscription
                      {stats.upcoming_renewals > 1 ? "s" : ""} expiring soon
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Review upcoming renewals in the next 30 days
                    </p>
                  </div>
                </div>
              )}
              {stats?.renewals_due_today > 0 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">
                      {stats.renewals_due_today} renewal
                      {stats.renewals_due_today > 1 ? "s" : ""} due today
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Take immediate action on these subscriptions
                    </p>
                  </div>
                </div>
              )}
              {stats?.expired_subscriptions > 0 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      {stats.expired_subscriptions} expired subscription
                      {stats.expired_subscriptions > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Review and renew these subscriptions
                    </p>
                  </div>
                </div>
              )}
              {!stats?.upcoming_renewals &&
                !stats?.renewals_due_today &&
                !stats?.expired_subscriptions && (
                  <p className="text-slate-500 text-center py-8">
                    All subscriptions are up to date!
                  </p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
