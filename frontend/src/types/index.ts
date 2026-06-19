export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string | null;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  task_id: string | null;
  user_id: string;
  action: string;
  created_at: string;
  task_title: string | null;
}

export interface DashboardStats {
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  recently_created: Task[];
  recently_updated: Task[];
}

export interface PieChartData {
  status: string;
  count: number;
  color: string;
}

export interface WeeklyChartData {
  day: string;
  date: string;
  tasks_created: number;
}

export interface DashboardCharts {
  pie_chart: PieChartData[];
  weekly_chart: WeeklyChartData[];
}
