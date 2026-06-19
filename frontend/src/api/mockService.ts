import { AxiosRequestConfig } from 'axios';
import { Task, TaskStatus, TaskPriority, ActivityLog, User } from '../types';

interface MockDB {
  users: User[];
  passwords: Record<string, string>; // user_id -> password
  tasks: Task[];
  logs: ActivityLog[];
}

// Helper to get ISO strings for relative days
const getRelativeDate = (daysAgo: number, hour = 10): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    created_at: getRelativeDate(10),
  },
];

const INITIAL_PASSWORDS: Record<string, string> = {
  user_1: 'password123',
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    title: 'Complete onboarding flow design',
    description: 'Design the layout and animations for user onboarding sequences.',
    status: 'Completed',
    priority: 'High',
    tags: ['Design', 'Frontend'],
    due_date: getRelativeDate(4),
    user_id: 'user_1',
    created_at: getRelativeDate(6, 9),
    updated_at: getRelativeDate(4, 17),
  },
  {
    id: 'task_2',
    title: 'Integrate Stripe payment gateway',
    description: 'Hook up subscription webhooks, create setup intents, and secure endpoint checkouts.',
    status: 'In Progress',
    priority: 'High',
    tags: ['Billing', 'Backend'],
    due_date: getRelativeDate(-3),
    user_id: 'user_1',
    created_at: getRelativeDate(6, 14),
    updated_at: getRelativeDate(3, 11),
  },
  {
    id: 'task_3',
    title: 'Refactor database queries for MongoDB Atlas performance optimization',
    description: 'Add compound indexes and redesign search filters to reduce execution latency.',
    status: 'Completed',
    priority: 'Medium',
    tags: ['Database', 'Backend'],
    due_date: getRelativeDate(1),
    user_id: 'user_1',
    created_at: getRelativeDate(5, 8),
    updated_at: getRelativeDate(1, 16),
  },
  {
    id: 'task_4',
    title: 'Implement user authentication with JWT/Sanctum',
    description: 'Set up stateless auth tokens and customize sanctum token model for Mongo compatibility.',
    status: 'Completed',
    priority: 'High',
    tags: ['Security', 'Backend'],
    due_date: getRelativeDate(2),
    user_id: 'user_1',
    created_at: getRelativeDate(5, 12),
    updated_at: getRelativeDate(2, 10),
  },
  {
    id: 'task_5',
    title: 'Draft technical specification for API v2',
    description: 'Outline resource schemas, versioning strategies, and caching headers.',
    status: 'Pending',
    priority: 'Low',
    tags: ['Documentation'],
    due_date: getRelativeDate(-6),
    user_id: 'user_1',
    created_at: getRelativeDate(5, 16),
    updated_at: getRelativeDate(5, 16),
  },
  {
    id: 'task_6',
    title: 'Optimize dashboard chart rendering with Recharts',
    description: 'Implement resize observers and smooth framer-motion container entrances.',
    status: 'Completed',
    priority: 'Low',
    tags: ['Frontend', 'Performance'],
    due_date: getRelativeDate(2),
    user_id: 'user_1',
    created_at: getRelativeDate(4, 9),
    updated_at: getRelativeDate(2, 14),
  },
  {
    id: 'task_7',
    title: 'Setup CI/CD pipeline on GitHub Actions',
    description: 'Add auto-testing configurations, code analysis coverage, and test triggers on pull request.',
    status: 'Completed',
    priority: 'Medium',
    tags: ['DevOps'],
    due_date: getRelativeDate(0),
    user_id: 'user_1',
    created_at: getRelativeDate(4, 11),
    updated_at: getRelativeDate(0, 18),
  },
  {
    id: 'task_8',
    title: 'Write end-to-end Cypress tests for critical paths',
    description: 'Cover auth gates, dashboard stat checks, and tasks CRUD flow cycles.',
    status: 'In Progress',
    priority: 'Medium',
    tags: ['QA', 'Testing'],
    due_date: getRelativeDate(-2),
    user_id: 'user_1',
    created_at: getRelativeDate(4, 14),
    updated_at: getRelativeDate(1, 9),
  },
  {
    id: 'task_9',
    title: 'Fix bug on Kanban drag-and-drop state updates',
    description: 'Resolve status state mismatch causing items to jump layout columns on drop.',
    status: 'Completed',
    priority: 'High',
    tags: ['Frontend', 'Bug'],
    due_date: getRelativeDate(3),
    user_id: 'user_1',
    created_at: getRelativeDate(4, 17),
    updated_at: getRelativeDate(3, 15),
  },
  {
    id: 'task_10',
    title: 'Review pull request for Dark/Light mode integration',
    description: 'Verify variables mapping and smooth contrast changes across typography.',
    status: 'Completed',
    priority: 'Low',
    tags: ['Review', 'Frontend'],
    due_date: getRelativeDate(2),
    user_id: 'user_1',
    created_at: getRelativeDate(3, 10),
    updated_at: getRelativeDate(2, 9),
  },
  {
    id: 'task_11',
    title: 'Draft content strategy for landing page launch',
    description: 'Formulate core messaging headings and layout specifications.',
    status: 'Pending',
    priority: 'Low',
    tags: ['Marketing'],
    due_date: getRelativeDate(-8),
    user_id: 'user_1',
    created_at: getRelativeDate(3, 13),
    updated_at: getRelativeDate(3, 13),
  },
  {
    id: 'task_12',
    title: 'Schedule database backup and monitoring alerts',
    description: 'Automate mongodump uploads to AWS S3 buckets and hook up Slack health checks.',
    status: 'Completed',
    priority: 'High',
    tags: ['DevOps', 'Database'],
    due_date: getRelativeDate(1),
    user_id: 'user_1',
    created_at: getRelativeDate(3, 16),
    updated_at: getRelativeDate(1, 14),
  },
  {
    id: 'task_13',
    title: 'Implement activity logging for audit trail security requirements',
    description: 'Capture resource, action types, timestamps, and active user references.',
    status: 'In Progress',
    priority: 'Medium',
    tags: ['Security', 'Backend'],
    due_date: getRelativeDate(-1),
    user_id: 'user_1',
    created_at: getRelativeDate(2, 10),
    updated_at: getRelativeDate(2, 10),
  },
  {
    id: 'task_14',
    title: 'Resolve CSS layout alignment issue on Mobile layout',
    description: 'Fix navigation elements sliding under mobile screen boundaries.',
    status: 'Completed',
    priority: 'Low',
    tags: ['Frontend', 'Bug'],
    due_date: getRelativeDate(1),
    user_id: 'user_1',
    created_at: getRelativeDate(2, 15),
    updated_at: getRelativeDate(1, 16),
  },
  {
    id: 'task_15',
    title: 'Conduct UI usability testing session with stakeholders',
    description: 'Gather user flow efficiency metrics and outline interface updates.',
    status: 'Pending',
    priority: 'Medium',
    tags: ['UX', 'Meeting'],
    due_date: getRelativeDate(-5),
    user_id: 'user_1',
    created_at: getRelativeDate(1, 9),
    updated_at: getRelativeDate(1, 9),
  },
  {
    id: 'task_16',
    title: 'Document API endpoints using Swagger OpenAPI 3.0',
    description: 'Standardize schemas and list expected response status codes.',
    status: 'Pending',
    priority: 'Low',
    tags: ['Documentation', 'API'],
    due_date: getRelativeDate(-9),
    user_id: 'user_1',
    created_at: getRelativeDate(1, 11),
    updated_at: getRelativeDate(1, 11),
  },
  {
    id: 'task_17',
    title: 'Conduct threat modeling analysis for backend services',
    description: 'Map potential entry points and audit authorization guards.',
    status: 'Pending',
    priority: 'High',
    tags: ['Security'],
    due_date: getRelativeDate(-4),
    user_id: 'user_1',
    created_at: getRelativeDate(1, 13),
    updated_at: getRelativeDate(1, 13),
  },
  {
    id: 'task_18',
    title: 'Draft user support documentation and FAQs',
    description: 'Compile guides detailing settings profiles and tasks filters.',
    status: 'Pending',
    priority: 'Low',
    tags: ['Documentation'],
    due_date: getRelativeDate(-11),
    user_id: 'user_1',
    created_at: getRelativeDate(1, 16),
    updated_at: getRelativeDate(1, 16),
  },
  {
    id: 'task_19',
    title: 'Set up logging and application monitoring via Sentry',
    description: 'Configure event tracking and performance instrumentation metrics.',
    status: 'In Progress',
    priority: 'Medium',
    tags: ['DevOps'],
    due_date: getRelativeDate(-3),
    user_id: 'user_1',
    created_at: getRelativeDate(0, 8),
    updated_at: getRelativeDate(0, 10),
  },
  {
    id: 'task_20',
    title: 'Release beta version of Taskora to initial users',
    description: 'Prepare deployment packages and distribute invites to waitlisted accounts.',
    status: 'Pending',
    priority: 'High',
    tags: ['Release'],
    due_date: getRelativeDate(-2),
    user_id: 'user_1',
    created_at: getRelativeDate(0, 11),
    updated_at: getRelativeDate(0, 11),
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    task_id: 'task_1',
    user_id: 'user_1',
    action: 'Completed task',
    created_at: getRelativeDate(4, 17),
    task_title: 'Complete onboarding flow design',
  },
  {
    id: 'log_2',
    task_id: 'task_4',
    user_id: 'user_1',
    action: 'Completed task',
    created_at: getRelativeDate(2, 10),
    task_title: 'Implement user authentication with JWT/Sanctum',
  },
  {
    id: 'log_3',
    task_id: 'task_6',
    user_id: 'user_1',
    action: 'Completed task',
    created_at: getRelativeDate(2, 14),
    task_title: 'Optimize dashboard chart rendering with Recharts',
  },
  {
    id: 'log_4',
    task_id: 'task_3',
    user_id: 'user_1',
    action: 'Completed task',
    created_at: getRelativeDate(1, 16),
    task_title: 'Refactor database queries for MongoDB Atlas performance optimization',
  },
  {
    id: 'log_5',
    task_id: 'task_14',
    user_id: 'user_1',
    action: 'Completed task',
    created_at: getRelativeDate(1, 16),
    task_title: 'Resolve CSS layout alignment issue on Mobile layout',
  },
  {
    id: 'log_6',
    task_id: 'task_19',
    user_id: 'user_1',
    action: 'Updated task',
    created_at: getRelativeDate(0, 10),
    task_title: 'Set up logging and application monitoring via Sentry',
  },
];

class MockService {
  private getDB(): MockDB {
    const dbStr = localStorage.getItem('taskora_mock_db');
    if (dbStr) {
      return JSON.parse(dbStr);
    }
    const db: MockDB = {
      users: INITIAL_USERS,
      passwords: INITIAL_PASSWORDS,
      tasks: INITIAL_TASKS,
      logs: INITIAL_LOGS,
    };
    this.saveDB(db);
    return db;
  }

  private saveDB(db: MockDB) {
    localStorage.setItem('taskora_mock_db', JSON.stringify(db));
  }

  private getLoggedInUser(headers: any): User | null {
    const authHeader = headers?.Authorization || headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    if (!token.startsWith('mock_token_')) {
      return null;
    }
    const userId = token.substring(11);
    const db = this.getDB();
    return db.users.find((u) => u.id === userId) || null;
  }

  private logActivity(db: MockDB, userId: string, taskId: string | null, action: string, taskTitle: string | null) {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      task_id: taskId,
      user_id: userId,
      action,
      created_at: new Date().toISOString(),
      task_title: taskTitle,
    };
    db.logs.unshift(newLog);
  }

  public async handleRequest(config: AxiosRequestConfig): Promise<any> {
    // Delay slightly to simulate network speed
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanUrl = config.url?.replace(/^(https?:\/\/[^\/]+)?\/api/, '') || '';
    const [pathPart] = cleanUrl.split('?');
    const path = pathPart.replace(/\/$/, ''); // Remove trailing slash
    const method = config.method?.toLowerCase() || 'get';
    const db = this.getDB();

    // PUBLIC ROUTES
    if (path === '/login' && method === 'post') {
      const { email, password } = JSON.parse(config.data || '{}');
      const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
      if (!user || db.passwords[user.id] !== password) {
        throw {
          response: {
            status: 422,
            data: { message: 'Invalid credentials. Please verify email and password.' },
          },
        };
      }
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          token: `mock_token_${user.id}`,
          user,
        },
      };
    }

    if (path === '/register' && method === 'post') {
      const { name, email, password } = JSON.parse(config.data || '{}');
      if (!name || !email || !password) {
        throw {
          response: {
            status: 422,
            data: { message: 'The name, email, and password fields are required.' },
          },
        };
      }
      const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw {
          response: {
            status: 422,
            data: { message: 'The email has already been taken.' },
          },
        };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        created_at: new Date().toISOString(),
      };

      db.users.push(newUser);
      db.passwords[newUser.id] = password;
      this.saveDB(db);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          token: `mock_token_${newUser.id}`,
          user: newUser,
        },
      };
    }

    if (path === '/forgot-password' && method === 'post') {
      const { email } = JSON.parse(config.data || '{}');
      const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
      if (!user) {
        throw {
          response: {
            status: 422,
            data: { message: 'No account registered with this email address.' },
          },
        };
      }
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          message: 'Password reset link sent to your email.',
          reset_token: `reset_token_${user.id}`,
        },
      };
    }

    if (path === '/reset-password' && method === 'post') {
      const { email, password, token } = JSON.parse(config.data || '{}');
      const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
      if (!user || token !== `reset_token_${user.id}`) {
        throw {
          response: {
            status: 422,
            data: { message: 'Invalid reset token or email mismatch.' },
          },
        };
      }
      db.passwords[user.id] = password;
      this.saveDB(db);
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { message: 'Password has been reset successfully.' },
      };
    }

    // PROTECTED ROUTES REQUIRE AUTH
    const loggedInUser = this.getLoggedInUser(config.headers);
    if (!loggedInUser) {
      throw {
        response: {
          status: 401,
          data: { message: 'Unauthenticated.' },
        },
      };
    }

    if (path === '/user' && method === 'get') {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { data: loggedInUser },
      };
    }

    if (path === '/logout' && method === 'post') {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { message: 'Logged out successfully.' },
      };
    }

    if (path === '/profile' && method === 'put') {
      const { name, email } = JSON.parse(config.data || '{}');
      if (!name || !email) {
        throw {
          response: {
            status: 422,
            data: { message: 'Name and email are required.' },
          },
        };
      }

      // Check unique email except current
      const exists = db.users.some((u) => u.id !== loggedInUser.id && u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw {
          response: {
            status: 422,
            data: { message: 'The email has already been taken.' },
          },
        };
      }

      loggedInUser.name = name;
      loggedInUser.email = email;

      // Update in db
      const idx = db.users.findIndex((u) => u.id === loggedInUser.id);
      if (idx !== -1) {
        db.users[idx] = loggedInUser;
      }
      this.saveDB(db);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          message: 'Profile updated successfully.',
          user: loggedInUser,
        },
      };
    }

    if (path === '/profile/password' && method === 'put') {
      const { current_password, password } = JSON.parse(config.data || '{}');
      if (db.passwords[loggedInUser.id] !== current_password) {
        throw {
          response: {
            status: 422,
            data: { message: 'The current password you provided is incorrect.' },
          },
        };
      }

      db.passwords[loggedInUser.id] = password;
      this.saveDB(db);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { message: 'Password updated successfully.' },
      };
    }

    // TASK ENDPOINTS
    if (path === '/tasks' && method === 'get') {
      const params = config.params || {};
      const search = (params.search || '').toLowerCase();
      const status = params.status || '';
      const priority = params.priority || '';
      const sortBy = params.sort_by || 'created_at';
      const sortOrder = params.sort_order || 'desc';
      const page = parseInt(params.page || '1', 10);
      const perPage = parseInt(params.per_page || '10', 10);

      // Filter tasks for logged in user
      let filtered = db.tasks.filter((t) => t.user_id === loggedInUser.id);

      // Apply Search
      if (search) {
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(search) ||
            (t.description || '').toLowerCase().includes(search) ||
            t.tags.some((tag) => tag.toLowerCase().includes(search))
        );
      }

      // Apply Filters
      if (status) {
        filtered = filtered.filter((t) => t.status === status);
      }
      if (priority) {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      // Apply Sort
      filtered.sort((a: any, b: any) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'title') {
          valA = (valA || '').toLowerCase();
          valB = (valB || '').toLowerCase();
        } else {
          // Dates or fallback
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Pagination
      const total = filtered.length;
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      const startIdx = (page - 1) * perPage;
      const paginated = filtered.slice(startIdx, startIdx + perPage);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          data: paginated,
          meta: {
            current_page: page,
            last_page: lastPage,
            per_page: perPage,
            total,
          },
        },
      };
    }

    if (path === '/tasks' && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      if (!data.title) {
        throw {
          response: {
            status: 422,
            data: { message: 'The title field is required.' },
          },
        };
      }

      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: data.title,
        description: data.description || null,
        status: data.status || 'Pending',
        priority: data.priority || 'Medium',
        tags: data.tags || [],
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        user_id: loggedInUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      db.tasks.push(newTask);
      this.logActivity(db, loggedInUser.id, newTask.id, 'Created task', newTask.title);
      this.saveDB(db);

      return {
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
        data: {
          message: 'Task created successfully.',
          task: newTask,
        },
      };
    }

    // Task details, update, status update, deletion match regex: /tasks/:id
    const taskMatch = path.match(/^\/tasks\/([^\/]+)$/);
    if (taskMatch) {
      const taskId = taskMatch[1];
      const taskIdx = db.tasks.findIndex((t) => t.id === taskId && t.user_id === loggedInUser.id);
      if (taskIdx === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Task not found.' },
          },
        };
      }

      if (method === 'get') {
        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: db.tasks[taskIdx],
        };
      }

      if (method === 'put') {
        const data = JSON.parse(config.data || '{}');
        const task = db.tasks[taskIdx];

        task.title = data.title || task.title;
        task.description = data.description === undefined ? task.description : data.description;
        task.status = data.status || task.status;
        task.priority = data.priority || task.priority;
        task.tags = data.tags || task.tags;
        task.due_date = data.due_date === undefined ? task.due_date : (data.due_date ? new Date(data.due_date).toISOString() : null);
        task.updated_at = new Date().toISOString();

        db.tasks[taskIdx] = task;
        this.logActivity(db, loggedInUser.id, task.id, 'Updated task', task.title);
        this.saveDB(db);

        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: {
            message: 'Task updated successfully.',
            task,
          },
        };
      }

      if (method === 'delete') {
        const task = db.tasks[taskIdx];
        db.tasks.splice(taskIdx, 1);
        this.logActivity(db, loggedInUser.id, null, 'Deleted task', task.title);
        this.saveDB(db);

        return {
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          data: { message: 'Task deleted successfully.' },
        };
      }
    }

    const taskStatusMatch = path.match(/^\/tasks\/([^\/]+)\/status$/);
    if (taskStatusMatch && method === 'patch') {
      const taskId = taskStatusMatch[1];
      const taskIdx = db.tasks.findIndex((t) => t.id === taskId && t.user_id === loggedInUser.id);
      if (taskIdx === -1) {
        throw {
          response: {
            status: 404,
            data: { message: 'Task not found.' },
          },
        };
      }

      const { status } = JSON.parse(config.data || '{}');
      const task = db.tasks[taskIdx];
      const oldStatus = task.status;
      task.status = status as TaskStatus;
      task.updated_at = new Date().toISOString();

      db.tasks[taskIdx] = task;

      let logAction = 'Changed status';
      if (status === 'Completed') {
        logAction = 'Completed task';
      } else if (oldStatus === 'Completed' && status !== 'Completed') {
        logAction = 'Reopened task';
      } else {
        logAction = `Changed status to ${status}`;
      }

      this.logActivity(db, loggedInUser.id, task.id, logAction, task.title);
      this.saveDB(db);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          message: 'Task status updated successfully.',
          task,
        },
      };
    }

    // DASHBOARD STATS
    if (path === '/dashboard/stats' && method === 'get') {
      const userTasks = db.tasks.filter((t) => t.user_id === loggedInUser.id);
      const total = userTasks.length;
      const pending = userTasks.filter((t) => t.status === 'Pending').length;
      const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
      const completed = userTasks.filter((t) => t.status === 'Completed').length;

      const now = new Date();
      const overdue = userTasks.filter(
        (t) => t.status !== 'Completed' && t.due_date && new Date(t.due_date) < now
      ).length;

      // Sorted recently created
      const recentlyCreated = [...userTasks]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Sorted recently updated
      const recentlyUpdated = [...userTasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          total_tasks: total,
          pending_tasks: pending,
          in_progress_tasks: inProgress,
          completed_tasks: completed,
          overdue_tasks: overdue,
          recently_created: recentlyCreated,
          recently_updated: recentlyUpdated,
        },
      };
    }

    // DASHBOARD CHARTS
    if (path === '/dashboard/charts' && method === 'get') {
      const userTasks = db.tasks.filter((t) => t.user_id === loggedInUser.id);
      const pending = userTasks.filter((t) => t.status === 'Pending').length;
      const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
      const completed = userTasks.filter((t) => t.status === 'Completed').length;

      const pieChart = [
        { status: 'Pending', count: pending, color: '#f59e0b' },
        { status: 'In Progress', count: inProgress, color: '#3b82f6' },
        { status: 'Completed', count: completed, color: '#10b981' },
      ];

      const weeklyChart = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const count = userTasks.filter((t) => {
          const cat = new Date(t.created_at);
          return cat >= start && cat <= end;
        }).length;

        weeklyChart.push({
          day: days[date.getDay()],
          date: date.toISOString().split('T')[0],
          tasks_created: count,
        });
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          pie_chart: pieChart,
          weekly_chart: weeklyChart,
        },
      };
    }

    // AUDIT LOGS
    if (path === '/activity' && method === 'get') {
      const params = config.params || {};
      const limit = parseInt(params.limit || '100', 10);
      const userLogs = db.logs.filter((l) => l.user_id === loggedInUser.id).slice(0, limit);

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: userLogs,
      };
    }

    throw {
      response: {
        status: 404,
        data: { message: 'Route not found in mock service.' },
      },
    };
  }
}

export default new MockService();
