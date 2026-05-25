import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../Contexts/AuthContext";
import { useSocket } from "../Contexts/SocketContext";
import sortMessages from "../Utility/SortMessages";

const ChatBox = (props) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);

  const [messageToSend, setMessageToSend] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const { token } = useAuth();
  const { socket, isConnected } = useSocket();
  const host = import.meta.env.VITE_BASE_URL;

  const chatBoxRef = useRef(null);

  // ---------------- FETCH MESSAGES (per chat) ----------------
  const fetchMessage = async () => {
    if (!props.chat?._id) return;

    setIsLoadingMsg(true);

    try {
      const response = await fetch(
        `${host}/api/kurakani/chat/${props.chat._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const r = await response.json();

      if (response.ok) {
        const sorted = sortMessages(r.data || []);
        setAllMessages(sorted);
      } else {
        setLoadingError(r.message);
      }
    } catch (err) {
      setLoadingError("Failed to load messages");
    } finally {
      setIsLoadingMsg(false);
    }
  };

  // refetch when chat changes
  useEffect(() => {
    fetchMessage();
  }, [props.chat]);

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(() => {
    if (!isConnected || !socket) return;

    const handleRecentMessage = (data) => {
      if (data.chatId !== props.chat?._id) return;
      setAllMessages((prev) => [...prev, data.createdMsg]);
    };

    const handleTyping = (typingInfo) => {
      setRemoteTyping(typingInfo.state);
    };

    const handleOnlineUsers = (count) => {
      setOnlineCount(count);
    };

    socket.on("recentMessage", handleRecentMessage);
    socket.on("typing", handleTyping);
    socket.on("onlineUsersCount", handleOnlineUsers);

    return () => {
      socket.off("recentMessage", handleRecentMessage);
      socket.off("typing", handleTyping);
      socket.off("onlineUsersCount", handleOnlineUsers);
    };
  }, [socket, isConnected, props.chat]);

  // ---------------- SEND TYPING STATUS ----------------
  useEffect(() => {
    if (!socket) return;

    socket.emit("typing", {
      chatId: props.chat?._id,
      state: isTyping,
    });
  }, [isTyping, socket, props.chat]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    if (chatBoxRef.current && !remoteTyping) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allMessages, remoteTyping]);

  // ---------------- SEND MESSAGE ----------------
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!messageToSend.trim() || !socket || !props.chat?._id) return;

    setIsSending(true);

    socket.emit(
      "sendMessage",
      {
        chatId: props.chat._id,
        message: messageToSend,
      },
      () => {
        setIsSending(false);
      }
    );

    setMessageToSend("");
  };

  // ---------------- UI ----------------
  return (
    <div className="border-2 border-t-0 rounded-t-xl">

      {/* HEADER */}
      <div className="px-3 py-2 flex items-center gap-3 border-b">
        <div className="w-10 h-10 rounded-full bg-amber-500 text-center leading-10 font-bold text-white">
          {props.chat?.name?.slice(0, 2).toUpperCase() || "DC"}
        </div>

        <div>
          <p className="font-bold text-xl">
            {props.chat?.name || "Select a chat"}
          </p>

          <div className="text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>{" "}
            {onlineCount} Active Now
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={chatBoxRef}
        className="h-[500px] overflow-auto flex flex-col p-3"
      >
        {!props.chat?._id && (
          <div className="text-gray-400 text-center mt-10">
            Select a chat to start messaging
          </div>
        )}

        {allMessages.map((m, i) => {
          const isMe =
            props.user?.username === m?.username?.username;

          return (
            <div
              key={m._id || i}
              className={isMe ? "self-end" : "self-start"}
            >
              <MessageBubble
                sender={m.username.username}
                msg={m.message}
                timestamp={m.createdAt}
                user={props.user}
              />
            </div>
          );
        })}

        {remoteTyping && (
          <p className="text-sm text-green-600 font-semibold mt-2">
            Someone is typing...
          </p>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t">
        <form onSubmit={handleFormSubmit} className="flex items-center">
          <textarea
            value={messageToSend}
            placeholder="Type message..."
            className="flex-1 m-2 p-2 rounded-lg resize-none"
            onChange={(e) => setMessageToSend(e.target.value)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />

          <button
            type="submit"
            disabled={isSending}
            className="m-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;