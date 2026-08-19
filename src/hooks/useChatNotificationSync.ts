// import { useEffect } from "react";
// import { io, Socket } from "socket.io-client";
// import { useNotificationStore } from "@/store/useNotificationStore";
// import { notificationApi } from "@/services-api/notificationService";
// import { toast } from "react-hot-toast";

// const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";

// const socket: Socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   autoConnect: true,
// });

// export const useChatNotificationSync = () => {
//   const { setNotifications, addNotification } = useNotificationStore();

//   useEffect(() => {
//     // 1. Fetch history (Already filtered in service)
//     notificationApi.getRecent().then(data => {
//       setNotifications(data);
//     });

//     // 2. Listen for Real-time events
//     socket.on("newNotification", (notification: any) => {
//       // 🚀 FILTER: Only push if it's an Order or Review
//       if (notification.type === 'ORDER' || notification.type === 'REVIEW') {
//         addNotification(notification);

//         toast(notification.title, {
//           icon: notification.type === 'ORDER' ? '📦' : '⭐',
//           style: { borderRadius: '10px', background: '#023337', color: '#fff', fontSize: '14px' },
//           duration: 5000,
//         });
//       }
//     });

//     return () => {
//       socket.off("newNotification");
//     };
//   }, [setNotifications, addNotification]);
// };



import { useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { notificationApi } from "@/services-api/notificationService";
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8082";

// 1. Root Notification Socket (System Notifications)
const rootSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
});

export const useChatNotificationSync = () => {
  const { setNotifications, addNotification } = useNotificationStore();
  const { setUnreadMessageCount, user } = useAuthStore();

  // 🚀 FIXED: Wrapped in Promise.resolve() to match your Admin Modal's stable sync logic
  const updateGlobalBadge = useCallback((count: number) => {
    Promise.resolve().then(() => {
      useAuthStore.getState().setUnreadMessageCount(count);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    let chatSocket: Socket | null = null;

    const initializeSync = async () => {
      const adminToken = await getAdminTokenAction();
      const isAdmin = !!adminToken;

      try {
        // --- A. INITIAL FETCH (PERSISTENCE) ---
        const endpoint = isAdmin ? "/chat/rooms" : "/chat/conversations/sync-room";
        const res = await apiFetch(endpoint, {
          method: "GET",
          headers: isAdmin ? { Authorization: `Bearer ${adminToken}`, "X-Admin-Request": "true" } : {},
        });

        if (res.ok) {
          const json = await res.json();
          // Extract data correctly based on your controller's { data: ... } wrapper
          const responseData = json.data || json;
          
          if (isAdmin) {
            const rooms = Array.isArray(responseData) ? responseData : [];
            const total = rooms.reduce((acc: number, r: any) => acc + (r.unreadCount || 0), 0);
            updateGlobalBadge(total);
          } else {
            // 🚀 SUCCESS: Reads the unreadCount returned by your fixed sync-room endpoint
            updateGlobalBadge(responseData.unreadCount || 0);
          }
          
          // --- B. SOCKET CONNECTION ---
          chatSocket = io(`${SOCKET_URL}/chat`, {
            transports: ["websocket", "polling"],
            withCredentials: true,
            auth: { token: adminToken || getCookie("auth_token") },
            query: { isAdmin: isAdmin ? "true" : "false" },
          });

          chatSocket.on("connect", () => {
            // 🚀 100% CRITICAL: Customer MUST join room to hear "newMessage" events while widget is closed
            if (!isAdmin && responseData.conversationId) {
              chatSocket?.emit("joinRoom", { conversationId: responseData.conversationId });
            }
          });

          chatSocket.on("newMessage", (message: any) => {
            const state = useAuthStore.getState();
            
            // Logic: Is this message coming from the staff?
            const isFromStaff = message.sender?.role === 'ADMIN' || message.sender?.role === 'MANAGER';

            // Only increment if chat is closed and it's from staff
            if (!state.isChatOpen && isFromStaff) {
              const newCount = state.unreadMessageCount + 1;
              updateGlobalBadge(newCount);
              
              toast(`Support: ${message.text || 'Sent a file'}`, {
                icon: "💬",
                duration: 5000,
                style: {
                  borderRadius: '12px',
                  background: '#023337',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                },
              });
            }
          });
        }
      } catch (err) {
        console.error("Chat Sync Error:", err);
      }
    };

    // --- C. SYSTEM NOTIFICATIONS ---
    const handleNotify = (n: any) => {
      if (n.type === "ORDER" || n.type === "REVIEW") {
        addNotification(n);
        toast(n.title, { icon: "🔔" });
      }
    };

    rootSocket.on("newNotification", handleNotify);
    notificationApi.getRecent().then((data) => setNotifications(data));

    initializeSync();

    return () => {
      rootSocket.off("newNotification", handleNotify);
      if (chatSocket) chatSocket.disconnect();
    };
  }, [user?.id, setNotifications, addNotification, updateGlobalBadge]);
};