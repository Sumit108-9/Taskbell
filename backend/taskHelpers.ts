import { Task, FilterType } from '@/backend/types';
import { format, isToday, isPast, isFuture, parseISO, differenceInMinutes, differenceInDays, isSameDay } from 'date-fns';

export function getTaskDueDateTime(task: Task): Date | null {
  if (!task.dueDate) return null;
  const d = parseISO(task.dueDate);
  if (task.dueTime) {
    const [h, m] = task.dueTime.split(':').map(Number);
    d.setHours(h || 0, m || 0, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

export function isOverdue(task: Task): boolean {
  if (task.isCompleted) return false;
  const due = getTaskDueDateTime(task);
  if (!due) return false;
  return isPast(due);
}

export function formatDeadline(task: Task): string {
  const due = getTaskDueDateTime(task);
  if (!due) return 'No deadline';
  if (isToday(due)) {
    return task.dueTime ? `Today, ${formatTime(task.dueTime)}` : 'Today';
  }
  if (isOverdue(task)) {
    const days = differenceInDays(new Date(), due);
    if (days <= 0) return 'Overdue';
    return `Overdue ${days}d`;
  }
  return format(due, 'MMM d') + (task.dueTime ? `, ${formatTime(task.dueTime)}` : '');
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, 'h:mm a');
}

export function formatCountdown(task: Task): { label: string; tone: 'overdue' | 'today' | 'upcoming' | 'none' } {
  const due = getTaskDueDateTime(task);
  if (!due) return { label: 'No deadline set', tone: 'none' };
  const now = new Date();
  if (due < now && !task.isCompleted) {
    const days = differenceInDays(now, due);
    if (days >= 1) return { label: `OVERDUE by ${days} day${days === 1 ? '' : 's'}`, tone: 'overdue' };
    const mins = differenceInMinutes(now, due);
    return { label: `OVERDUE by ${mins} min`, tone: 'overdue' };
  }
  if (isSameDay(due, now)) {
    return { label: task.dueTime ? `Due today at ${formatTime(task.dueTime)}` : 'Due today', tone: 'today' };
  }
  const days = differenceInDays(due, now) + 1;
  return {
    label: `Due in ${days} day${days === 1 ? '' : 's'}${task.dueTime ? ` at ${formatTime(task.dueTime)}` : ''}`,
    tone: 'upcoming',
  };
}

export function getTasksByFilter(tasks: Task[], filter: FilterType, date?: Date): Task[] {
  return tasks.filter((t) => {
    switch (filter) {
      case 'All':
        return true;
      case 'Today':
        return t.dueDate ? isSameDay(parseISO(t.dueDate), date ?? new Date()) : false;
      case 'Upcoming':
        return t.dueDate ? isFuture(getTaskDueDateTime(t)!) && !t.isCompleted : false;
      case 'Completed':
        return t.isCompleted;
      case 'Overdue':
        return isOverdue(t);
      default:
        return true;
    }
  });
}

export function tasksOnDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((t) => t.dueDate && isSameDay(parseISO(t.dueDate), date));
}

export function withComputedFlags(task: Task): Task {
  return { ...task, isOverdue: isOverdue(task) };
}
