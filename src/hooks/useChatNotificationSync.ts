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

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { notificationApi } from "@/services-api/notificationService";
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";
import { toast } from "react-hot-toast";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8082";

// 1. Root Notification Socket (Global System Notifications)
const rootSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
});

export const useChatNotificationSync = () => {
  const { setNotifications, addNotification } = useNotificationStore();
  const { setUnreadMessageCount, user } = useAuthStore();

  useEffect(() => {
    // Safety check: only run if user is logged in
    if (!user) return;

    let chatSocket: Socket | null = null;

    const initializeSync = async () => {
      // 🚀 Step 1: Detect Role via Admin Token check
      const adminToken = await getAdminTokenAction();
      const isAdmin = !!adminToken;

      // --- A. INITIAL UNREAD FETCH ---
      try {
        if (isAdmin) {
          // ADMIN logic: fetch all rooms and sum counts
          const res = await apiFetch("/chat/rooms", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "X-Admin-Request": "true",
            },
          });
          if (res.ok) {
            const rooms = await res.json();
            const total = (Array.isArray(rooms) ? rooms : []).reduce(
              (acc: number, r: any) => acc + (r.unreadCount || 0),
              0
            );
            setUnreadMessageCount(total);
          }
        } else {
          /**
           * CUSTOMER logic: 
           * Since your /sync-room only returns the ID, we rely on the Socket 
           * for real-time updates. On initial load, we assume 0 or 
           * you can fetch messages (but your service marks them as read immediately).
           */
          setUnreadMessageCount(0); 
        }
      } catch (err) {
        console.error("Unread count fetch error:", err);
      }

      // --- B. AUTHENTICATED CHAT SOCKET ---
      // We connect to the namespace shown in your logs
      chatSocket = io(`${SOCKET_URL}/chat`, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: { token: adminToken || "user-session" },
        query: { isAdmin: isAdmin ? "true" : "false" },
      });

      chatSocket.on("connect", () => {
        console.log("[Socket] Chat connected successfully");
      });

      chatSocket.on("newMessage", (message: any) => {
        const state = useAuthStore.getState();
        
        // 🚀 Logic to decide if we increment the badge
        // 1. If user is Admin -> Increment if sender is NOT an Admin
        // 2. If user is Customer -> Increment if sender IS an Admin
        const shouldIncrement = isAdmin 
          ? message.sender?.role !== 'ADMIN' 
          : message.sender?.role === 'ADMIN' || message.sender?.role === 'MANAGER';

        // Only increment if chat window is closed and message is from "the other side"
        if (!state.isChatOpen && shouldIncrement) {
          state.setUnreadMessageCount(state.unreadMessageCount + 1);
          
          toast(`New message from ${message.sender?.name || 'Support'}`, {
            icon: "💬",
            style: { background: "#FF6A00", color: "#fff" },
          });
        }
      });
    };

    // --- C. SYSTEM NOTIFICATIONS (Orders/Reviews) ---
    const handleNewNotification = (notification: any) => {
      if (notification.type === "ORDER" || notification.type === "REVIEW") {
        addNotification(notification);
        toast(notification.title, { icon: "🔔" });
      }
    };

    rootSocket.on("newNotification", handleNewNotification);

    // Fetch history
    notificationApi.getRecent().then((data) => setNotifications(data));

    initializeSync();

    return () => {
      rootSocket.off("newNotification", handleNewNotification);
      if (chatSocket) {
        chatSocket.off("newMessage");
        chatSocket.disconnect();
      }
    };
  }, [user?.id, setNotifications, addNotification, setUnreadMessageCount]);
};