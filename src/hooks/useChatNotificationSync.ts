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
import { getCookie } from "cookies-next";

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
    if (!user) return;

    let chatSocket: Socket | null = null;

    const initializeSync = async () => {
      const adminToken = await getAdminTokenAction();
      const isAdmin = !!adminToken;

      // 1️⃣ INITIAL FETCH
      try {
        const endpoint = isAdmin ? "/chat/rooms" : "/chat/conversations/sync-room";
        const res = await apiFetch(endpoint, {
          method: "GET",
          headers: isAdmin ? { Authorization: `Bearer ${adminToken}`, "X-Admin-Request": "true" } : {},
        });

        if (res.ok) {
          const json = await res.json();
          const responseData = json.data || json;
          
          if (isAdmin) {
            const total = (Array.isArray(responseData) ? responseData : []).reduce(
              (acc: number, r: any) => acc + (r.unreadCount || 0), 0
            );
            setUnreadMessageCount(total);
          } else {
            // 🚀 FIX: Set the real unread count from DB for customers
            setUnreadMessageCount(responseData.unreadCount || 0);
          }
          
          // 2️⃣ SOCKET CONNECTION
          const SOCKET_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";
          
          chatSocket = io(`${SOCKET_BASE}/chat`, {
            transports: ["websocket"],
            withCredentials: true,
            auth: { token: adminToken || getCookie("auth_token") },
            query: { isAdmin: isAdmin ? "true" : "false" },
          });

          chatSocket.on("connect", () => {
            // 🚀 CRITICAL FIX: Customer joins their room immediately so they hear messages while closed
            if (!isAdmin && responseData.conversationId) {
              chatSocket?.emit("joinRoom", { conversationId: responseData.conversationId });
            }
          });

          chatSocket.on("newMessage", (message: any) => {
            const state = useAuthStore.getState();
            
            // Logic: Admins hear customers, Customers hear Admins
            const isFromOtherSide = isAdmin 
              ? message.sender?.role !== 'ADMIN' 
              : (message.sender?.role === 'ADMIN' || message.sender?.role === 'MANAGER');

            if (!state.isChatOpen && isFromOtherSide) {
              state.setUnreadMessageCount(state.unreadMessageCount + 1);
              toast(`New message received`, { icon: "💬" });
            }
          });
        }
      } catch (err) {
        console.error("Sync init failed", err);
      }
    };

    // (System Notifications logic remains same...)
    initializeSync();

    return () => {
      if (chatSocket) chatSocket.disconnect();
    };
  }, [user?.id]);
};