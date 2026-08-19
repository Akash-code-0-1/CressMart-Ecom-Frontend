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

// 1. Root Notification Socket
const rootSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // 🚀 Polling fallback for production stability
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
      // 1. Identify Role
      const adminToken = await getAdminTokenAction();
      const isAdmin = !!adminToken;

      // --- A. INITIAL UNREAD FETCH ---
      try {
        // Customers use the 'sync-room' endpoint seen in your Network tab
        const endpoint = isAdmin 
          ? "/chat/rooms" 
          : "/chat/conversations/sync-room";

        const res = await apiFetch(endpoint, {
          method: "GET",
          headers: isAdmin ? {
            Authorization: `Bearer ${adminToken}`,
            "X-Admin-Request": "true",
          } : {},
        });

        if (res.ok) {
          const data = await res.json();
          let count = 0;

          if (isAdmin) {
            // Admin logic: sum unread counts from all rooms
            const rooms = Array.isArray(data) ? data : (data?.data || []);
            count = rooms.reduce((acc: number, r: any) => acc + (r.unreadCount || 0), 0);
          } else {
            // Customer logic: 
            // The sync-room usually returns the conversation. 
            // We look for messages sent by ADMIN that are unread.
            const conversation = data?.data || data;
            if (conversation?.messages) {
              count = conversation.messages.filter(
                (m: any) => m.sender?.role === "ADMIN" && m.is_read === false
              ).length;
            } else if (typeof conversation?.unreadCount === 'number') {
              count = conversation.unreadCount;
            }
          }
          setUnreadMessageCount(count);
        }
      } catch (err) {
        console.error("Failed to sync unread count:", err);
      }

      // --- B. AUTHENTICATED CHAT SOCKET ---
      chatSocket = io(`${SOCKET_URL}/chat`, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: { token: adminToken || "user-session" },
        query: { isAdmin: isAdmin ? "true" : "false" },
      });

      chatSocket.on("newMessage", (message: any) => {
        const state = useAuthStore.getState();
        
        // 🚀 THE FIX:
        // If I am a CUSTOMER, I only want to increment the badge if the sender is an ADMIN.
        // If I am an ADMIN, I only want to increment if the sender is a CUSTOMER.
        const isFromOtherSide = isAdmin 
          ? message.sender?.role !== "ADMIN" 
          : message.sender?.role === "ADMIN";

        if (!state.isChatOpen && isFromOtherSide) {
          state.setUnreadMessageCount(state.unreadMessageCount + 1);
          toast(`New message received`, {
            icon: "💬",
            style: { background: "#FF6A00", color: "#fff" },
          });
        }
      });
    };

    // --- C. SYSTEM NOTIFICATIONS ---
    const handleNotification = (n: any) => {
      if (n.type === "ORDER" || n.type === "REVIEW") {
        addNotification(n);
        toast(n.title, { icon: "🔔" });
      }
    };

    rootSocket.on("newNotification", handleNotification);
    notificationApi.getRecent().then((data) => setNotifications(data));
    
    initializeSync();

    return () => {
      rootSocket.off("newNotification", handleNotification);
      if (chatSocket) {
        chatSocket.off("newMessage");
        chatSocket.disconnect();
      }
    };
  }, [user?.id, setNotifications, addNotification, setUnreadMessageCount]);
};