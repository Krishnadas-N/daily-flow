import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { parse, set } from 'date-fns';

export function useNotifications() {
  const { tasks, reminders } = useStore();
  const notifiedSet = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      
      const checkAndNotify = (dateStr: string, timeStr: string | undefined, title: string, body: string, tag: string) => {
        let date = parse(dateStr, 'yyyy-MM-dd', new Date());
        
        if (timeStr) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          date = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
        } else {
          date = set(date, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
        }

        const diffMs = now.getTime() - date.getTime();
        
        // Generous 1-minute window to catch it, with a Set to prevent duplicates
        if (diffMs >= 0 && diffMs < 60000) {
          const uniqueTag = `${tag}-${date.getTime()}`;
          if (!notifiedSet.current.has(uniqueTag)) {
            notifiedSet.current.add(uniqueTag);
            
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
               navigator.serviceWorker.ready.then((registration) => {
                 registration.showNotification(title, {
                    body,
                    icon: '/icon-192x192.png',
                    tag,
                    requireInteraction: true,
                 });
               });
            } else {
               new Notification(title, {
                  body,
                  tag,
                  requireInteraction: true,
               });
            }
          }
        }
      };

      tasks.forEach(task => {
        if (task.status === 'Completed' || !task.reminderDate) return;
        checkAndNotify(task.reminderDate, task.reminderTime, `Task Reminder: ${task.title}`, task.description || 'Time to check this task!', `task-${task.id}`);
      });

      reminders.forEach(reminder => {
        if (!reminder.reminderDate) return;
        checkAndNotify(reminder.reminderDate, reminder.reminderTime, `Reminder: ${reminder.title}`, "It's time!", `reminder-${reminder.id}`);
      });
    };

    // Check immediately on mount/update
    checkReminders();
    
    // Check every 10 seconds
    const intervalId = setInterval(checkReminders, 10000);
    return () => clearInterval(intervalId);
  }, [tasks, reminders]);
}
