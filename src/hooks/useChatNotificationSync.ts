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

// 1. Root Notification Socket (System-wide)
const rootSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // 🚀 Added polling fallback for better production stability
  withCredentials: true,
  autoConnect: true,
});

export const useChatNotificationSync = () => {
  const { setNotifications, addNotification } = useNotificationStore();
  const { setUnreadMessageCount, user } = useAuthStore();

  useEffect(() => {
    let chatSocket: Socket | null = null;

    const initializeSync = async () => {
      // 🚀 FIX 1: Get Token for either Admin OR Customer
      // First try to get the admin token
      let token = await getAdminTokenAction();
      let isAdmin = !!token;

      // If no admin token, try to get standard user token (assuming it's stored in cookies or similar)
      // If your apiFetch handles tokens via cookies, we still need the string for Socket.io auth
      if (!token) {
        // Fallback: Try to get token from cookies if getAdminTokenAction returned null
        token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || null;
      }

      // If absolutely no token is found, we cannot connect to the authenticated chat namespace
      if (!token) return;

      // --- A. INITIAL UNREAD FETCH ---
      try {
        // This endpoint should work for both admins (returning all rooms) 
        // and customers (returning just their own room)
        const res = await apiFetch("/chat/rooms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ...(isAdmin && { "X-Admin-Request": "true" }),
          },
        });

        if (res.ok) {
          const roomData = await res.json();
          const rooms = Array.isArray(roomData)
            ? roomData
            : roomData?.rooms || roomData?.data || [];
          
          const totalUnread = rooms.reduce(
            (acc: number, room: any) => acc + (room.unreadCount || 0),
            0,
          );
          setUnreadMessageCount(totalUnread);
        }
      } catch (err) {
        console.error("Failed to fetch initial unread count", err);
      }

      // --- B. AUTHENTICATED CHAT SOCKET ---
      chatSocket = io(`${SOCKET_URL}/chat`, {
        transports: ["websocket", "polling"], // 🚀 Added polling fallback
        withCredentials: true,
        auth: { token: token },
        query: { isAdmin: isAdmin ? "true" : "false" }, // 🚀 Dynamically set isAdmin
      });

      chatSocket.on("newMessage", (message: any) => {
        const state = useAuthStore.getState();
        // Only increment if user is NOT currently looking at the chat
        if (!state.isChatOpen) {
          // Check if message is from "the other side" (Admin if user is customer, or vice versa)
          // Most backends send a 'sender_id'. We ensure we don't count our own messages.
          if (message.sender_id !== user?.id) {
            state.setUnreadMessageCount(state.unreadMessageCount + 1);
            toast(`New message received`, {
              icon: "💬",
              style: { background: "#FF6A00", color: "#fff" },
            });
          }
        }
      });

      // Handle reconnection to ensure badge stays accurate
      chatSocket.on("connect", () => {
        console.log("Chat socket connected");
      });
    };

    // --- C. SYSTEM NOTIFICATIONS ---
    const handleNewNotification = (notification: any) => {
      if (notification.type === "ORDER" || notification.type === "REVIEW") {
        addNotification(notification);
        toast(notification.title, { icon: "🔔" });
      }
    };

    rootSocket.on("newNotification", handleNewNotification);

    // Fetch notification history
    notificationApi.getRecent().then((data) => setNotifications(data));

    initializeSync();

    return () => {
      rootSocket.off("newNotification", handleNewNotification);
      if (chatSocket) {
        chatSocket.off("newMessage");
        chatSocket.disconnect();
      }
    };
  }, [setNotifications, addNotification, setUnreadMessageCount, user?.id]);
};