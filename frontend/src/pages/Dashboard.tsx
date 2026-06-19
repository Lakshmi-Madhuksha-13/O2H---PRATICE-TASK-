import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { DashboardStats, DashboardCharts, ActivityLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Badge, useToast } from '../components/ui';
import {
  ListTodo,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileEdit,
  History,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartsRes, activityRes] = await Promise.all([
          client.get('/dashboard/stats'),
          client.get('/dashboard/charts'),
          client.get('/activity?limit=5'),
        ]);

        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setActivities(activityRes.data.data || activityRes.data);
      } catch (err: any) {
        toast('Failed to load dashboard metrics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-xl lg:col-span-2 animate-pulse" />
          <div className="h-80 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        </div>
        {/* Lists skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Formatting date string nicely
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statCards = [
    { title: 'Total Tasks', value: stats?.total_tasks || 0, icon: ListTodo, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Pending Tasks', value: stats?.pending_tasks || 0, icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { title: 'In Progress Tasks', value: stats?.in_progress_tasks || 0, icon: Play, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { title: 'Completed Tasks', value: stats?.completed_tasks || 0, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Overdue Tasks', value: stats?.overdue_tasks || 0, icon: AlertCircle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome message */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here is your productivity outline for today. You have {stats?.pending_tasks || 0} pending tasks.
        </p>
      </div>

      {/* 1. STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-1.5 rounded-lg border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 text-left">
                <span className="text-3xl font-bold text-slate-100 light:text-slate-900">{card.value}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart - Weekly creation */}
        <Card className="lg:col-span-2">
          <CardHeader className="text-left border-b border-slate-900 light:border-slate-100 pb-3 mb-5">
            <CardTitle className="text-base flex items-center">
              <SparkleIcon className="h-4 w-4 mr-2 text-indigo-400 animate-pulse" />
              Tasks Created (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {charts?.weekly_chart && charts.weekly_chart.some((x) => x.tasks_created > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.weekly_chart}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                    />
                    <Bar dataKey="tasks_created" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <ListTodo className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">No tasks created recently.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie chart - Status ratio */}
        <Card>
          <CardHeader className="text-left border-b border-slate-900 light:border-slate-100 pb-3 mb-5">
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-full relative flex items-center justify-center">
              {charts?.pie_chart && charts.pie_chart.some((x) => x.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.pie_chart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {charts.pie_chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Clock className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">No tasks found.</p>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="flex gap-4 mt-2">
              {charts?.pie_chart.map((x) => (
                <div key={x.status} className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: x.color }} />
                  <span>
                    {x.status}: <span className="font-bold text-slate-200">{x.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. RECENT ACTIVITY LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Updated Tasks */}
        <Card>
          <CardHeader className="text-left border-b border-slate-900 light:border-slate-100 pb-3 mb-4">
            <CardTitle className="text-base flex items-center">
              <FileEdit className="h-4 w-4 mr-2 text-indigo-400" />
              Recently Updated Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recently_updated && stats.recently_updated.length > 0 ? (
              <div className="space-y-3.5 text-left">
                {stats.recently_updated.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-xl transition-all">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-semibold text-slate-200 truncate">{task.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Updated: {formatDate(task.updated_at)}</p>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <Badge type="priority" value={task.priority} />
                      <Badge type="status" value={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500">
                <ListTodo className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">No task updates yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Activity Logs */}
        <Card>
          <CardHeader className="text-left border-b border-slate-900 light:border-slate-100 pb-3 mb-4">
            <CardTitle className="text-base flex items-center">
              <History className="h-4 w-4 mr-2 text-indigo-400" />
              Audit Trail & Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-3.5 text-left">
                {activities.map((log) => {
                  const getActionColor = (action: string) => {
                    if (action.includes('Created')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                    if (action.includes('Completed')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    if (action.includes('Deleted')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  };

                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                      <div className="min-w-0 pr-4">
                        <p className="text-xs font-semibold text-slate-200">
                          {log.action}
                          {log.task_title && (
                            <span className="text-slate-400 font-normal">
                              {' '}on <span className="font-medium text-slate-300">"{log.task_title}"</span>
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{formatDate(log.created_at)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getActionColor(log.action)}`}>
                        {log.action.split(' ')[1] || log.action}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500">
                <History className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">No audit logs logged yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Quick helper icon components
const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
