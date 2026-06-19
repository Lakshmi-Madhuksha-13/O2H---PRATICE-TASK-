import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Task, TaskStatus, TaskPriority } from '../types';
import { Button, Input, Badge, Card, Dialog, useToast } from '../components/ui';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Circle,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { toast } = useToast();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('Pending');
  const [formPriority, setFormPriority] = useState<TaskPriority>('Medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formTags, setFormTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await client.get('/tasks', { params });
      setTasks(res.data.data);
      setCurrentPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
      setTotalItems(res.data.meta.total);
    } catch (err: any) {
      toast('Failed to load tasks list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder, perPage]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStatus('Pending');
    setFormPriority('Medium');
    setFormDueDate('');
    setFormTags('');
    setIsCreateOpen(true);
  };

  // Create Task Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast('Task title is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = formTags
        ? formTags.split(',').map((x) => x.trim()).filter((x) => x.length > 0)
        : [];

      await client.post('/tasks', {
        title: formTitle,
        description: formDescription || null,
        status: formStatus,
        priority: formPriority,
        due_date: formDueDate || null,
        tags: tagsArray,
      });

      toast('Task created successfully!', 'success');
      setIsCreateOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast('Failed to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setFormTags(task.tags ? task.tags.join(', ') : '');
    setIsEditOpen(true);
  };

  // Edit Task Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast('Task title is required.', 'error');
      return;
    }
    if (!selectedTask) return;

    setIsSubmitting(true);
    try {
      const tagsArray = formTags
        ? formTags.split(',').map((x) => x.trim()).filter((x) => x.length > 0)
        : [];

      await client.put(`/tasks/${selectedTask.id}`, {
        title: formTitle,
        description: formDescription || null,
        status: formStatus,
        priority: formPriority,
        due_date: formDueDate || null,
        tags: tagsArray,
      });

      toast('Task updated successfully!', 'success');
      setIsEditOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast('Failed to update task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Details Modal
  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  // Delete Task Submit
  const handleDeleteSubmit = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      await client.delete(`/tasks/${selectedTask.id}`);
      toast('Task deleted successfully!', 'success');
      setIsDeleteOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast('Failed to delete task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Completion
  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await client.patch(`/tasks/${task.id}/status`, { status: newStatus });
      toast(
        newStatus === 'Completed' ? 'Task marked as completed!' : 'Task reopened.',
        'success'
      );
      fetchTasks();
    } catch (err: any) {
      toast('Failed to update task status.', 'error');
    }
  };

  // Toggle Sort Order
  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Workspace</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">Task Manager</h1>
        </div>
        <Button onClick={handleOpenCreate} icon={Plus} size="md">
          Create New Task
        </Button>
      </div>

      {/* 2. FILTERS, SEARCH AND SORT BAR */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </span>
          <input
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto md:ml-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="created_at">Date Created</option>
              <option value="due_date">Due Date</option>
              <option value="title">Title Alphabetical</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* 3. TASKS TABLE / LIST VIEW */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3 text-left">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl transition-all duration-200 gap-4"
            >
              {/* Checkbox & Details */}
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-600 hover:text-indigo-500" />
                  )}
                </button>
                <div className="min-w-0">
                  <h4
                    className={`text-sm font-semibold text-slate-100 truncate ${
                      task.status === 'Completed' ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 max-w-lg">{task.description}</p>
                  )}
                  {/* Tags & Dates */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {task.due_date && (
                      <span className="inline-flex items-center text-[10px] text-slate-500 font-medium">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.tags &&
                      task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-750"
                        >
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Status and Priority badges + Action buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                <div className="flex space-x-2">
                  <Badge type="priority" value={task.priority} />
                  <Badge type="status" value={task.status} />
                </div>

                <div className="flex space-x-1.5 border-l border-slate-800 pl-3">
                  <button
                    onClick={() => handleOpenDetails(task)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(task)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 4. SERVER-SIDE PAGINATION */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-900">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-300">{tasks.length}</span> of{' '}
              <span className="font-semibold text-slate-300">{totalItems}</span> tasks
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                icon={ChevronLeft}
              >
                Previous
              </Button>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 flex items-center">
                Page {currentPage} of {lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                icon={ChevronRight}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="py-16 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 rounded-full bg-slate-900 text-slate-500 border border-slate-850">
              <ListTodo className="h-10 w-10 opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No tasks found</h3>
            <p className="text-slate-500 text-sm">
              We couldn't find any tasks matching your filters. Try adjusting your parameters or create a new task.
            </p>
            <Button onClick={handleOpenCreate} icon={Plus} size="sm" className="mt-2">
              Add a Task
            </Button>
          </div>
        </Card>
      )}

      {/* 5. CREATE DIALOG */}
      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Task Title"
            type="text"
            placeholder="Implement authentication checks"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-left">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
              placeholder="Describe the objective and deliverables of this task..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
          />

          <Input
            label="Tags (Comma Separated)"
            type="text"
            placeholder="Frontend, Bug, High-Priority"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 6. EDIT DIALOG */}
      <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Task">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Task Title"
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-left">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
          />

          <Input
            label="Tags (Comma Separated)"
            type="text"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 7. DETAILS DIALOG */}
      <Dialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Task Details">
        {selectedTask && (
          <div className="space-y-5 text-left">
            <div>
              <h3 className="text-xl font-bold text-slate-100">{selectedTask.title}</h3>
              <div className="flex space-x-2 mt-2">
                <Badge type="priority" value={selectedTask.priority} />
                <Badge type="status" value={selectedTask.status} />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</h5>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedTask.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Due Date</span>
                <span className="text-slate-200 font-semibold flex items-center mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                  {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'No limit set'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Date Created</span>
                <span className="text-slate-200 font-semibold flex items-center mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                  {new Date(selectedTask.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <div className="border-t border-slate-800 pt-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-medium flex items-center"
                    >
                      <Tag className="h-3 w-3 mr-1.5 text-indigo-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button onClick={() => setIsDetailsOpen(false)}>Close Dialog</Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 8. DELETE CONFIRMATION DIALOG */}
      <Dialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete task <span className="font-semibold text-slate-100">"{selectedTask?.title}"</span>?
            This action cannot be undone and will permanently erase this task from the system database.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" isLoading={isSubmitting} onClick={handleDeleteSubmit}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
