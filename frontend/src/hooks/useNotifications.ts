import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsApi } from '../api/notifications.api';
import type { Notification } from '../types/notification.types';

const POLL_INTERVAL = 8000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async (p: number) => {
    try {
      const data = await notificationsApi.getAll(p, 20);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const data = await notificationsApi.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
    pollingRef.current = setInterval(refreshUnreadCount, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchNotifications, refreshUnreadCount]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      setLoading(true);
      fetchNotifications(p);
    },
    [fetchNotifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    page,
    totalPages,
    markAsRead,
    markAllAsRead,
    goToPage,
    refreshUnreadCount,
  };
}