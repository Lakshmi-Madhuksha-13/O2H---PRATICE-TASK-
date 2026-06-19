import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import client from '../api/client';
import { Task, TaskStatus } from '../types';
import { Card, Badge, useToast } from '../components/ui';
import { Calendar, Tag, AlertCircle, Play, CheckCircle } from 'lucide-react';

export const Kanban: React.FC = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await client.get('/tasks', { params: { per_page: 100 } });
      setTasks(res.data.data);
    } catch (err: any) {
      toast('Failed to load Kanban board tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (id: string, newStatus: TaskStatus) => {
    // Optimistic UI Update
    const originalTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await client.patch(`/tasks/${id}/status`, { status: newStatus });
      toast(`Task status moved to ${newStatus}`, 'success');
    } catch (err: any) {
      setTasks(originalTasks); // Rollback on failure
      toast('Failed to update task status.', 'error');
    }
  };

  const columns: { title: TaskStatus; icon: any; color: string }[] = [
    { title: 'Pending', icon: AlertCircle, color: 'border-t-4 border-t-amber-500' },
    { title: 'In Progress', icon: Play, color: 'border-t-4 border-t-sky-500' },
    { title: 'Completed', icon: CheckCircle, color: 'border-t-4 border-t-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 animate-pulse h-full" />
        ))}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Workspace</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">Kanban Board</h1>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-[calc(100vh-220px)] min-h-[500px]">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.title);
            return (
              <KanbanColumn
                key={col.title}
                status={col.title}
                tasks={columnTasks}
                moveTask={moveTask}
                icon={col.icon}
                borderStyle={col.color}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

// ==========================================
// KANBAN COLUMN DROP TARGET
// ==========================================
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  moveTask: (id: string, status: TaskStatus) => void;
  icon: any;
  borderStyle: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  moveTask,
  icon: Icon,
  borderStyle,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any}
      className={`flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl p-4 h-full transition-all duration-200 ${borderStyle} ${
        isOver ? 'bg-slate-900/80 border-indigo-500/50 scale-[1.01]' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-200">{status}</h3>
        </div>
        <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
          {tasks.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => <KanbanCard key={task.id} task={task} />)
        ) : (
          <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-500">
            <span className="text-xs">Drag tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// KANBAN CARD DRAG SOURCE
// ==========================================
interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="p-4 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 text-left space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
          {task.title}
        </h4>
        <Badge type="priority" value={task.priority} />
      </div>

      {task.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px] text-slate-500">
        <span className="flex items-center font-medium">
          <Calendar className="h-3 w-3 mr-1" />
          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Limit'}
        </span>

        {task.tags && task.tags.length > 0 && (
          <span className="flex items-center max-w-[80px] truncate">
            <Tag className="h-2.5 w-2.5 mr-1" />
            {task.tags[0]}
          </span>
        )}
      </div>
    </div>
  );
};
