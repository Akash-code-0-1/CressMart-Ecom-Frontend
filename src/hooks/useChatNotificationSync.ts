"use client";

import { useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { getAdminTokenAction } from "@/app/actions/auth";
import { apiFetch } from "@/utils/api";

let globalSyncSocketInstance: Socket | null = null;

export const useChatNotificationSync = () => {
  const setUnreadMessageCount = useAuthStore((state) => state.setUnreadMessageCount);

  const fetchUnreadTotals = useCallback(async () => {
    try {
      const adminToken = await getAdminTokenAction();
      const res = await apiFetch("/chat/rooms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken || ""}`,
          "X-Admin-Request": "true",
        },
      });

      if (res.ok) {
        const roomData = await res.json();
        const dynamicRooms = Array.isArray(roomData)
          ? roomData
          : roomData?.rooms || roomData?.data || [];

        const totalUnread = dynamicRooms.reduce(
          (acc: number, room: any) => acc + (room.unreadCount || 0),
          0
        );
        setUnreadMessageCount(totalUnread);
      }
    } catch (err) {
      console.error("Background sync tracking failed:", err);
    }
  }, [setUnreadMessageCount]);

  useEffect(() => {
    fetchUnreadTotals();

    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:8082";

    if (!globalSyncSocketInstance) {
      globalSyncSocketInstance = io(`${backendUrl}/chat`, {
        withCredentials: true,
        transports: ["websocket"],
        query: { isAdmin: "true" },
      });
    }

    globalSyncSocketInstance.on("newMessage", () => {
      fetchUnreadTotals();
    });

    return () => {
      // Retain subscription parameters cleanly
    };
  }, [fetchUnreadTotals]);
};