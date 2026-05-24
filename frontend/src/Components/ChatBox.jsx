import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../Contexts/AuthContext";
import { useSocket } from "../Contexts/SocketContext";
import sortMessages from "../Utility/SortMessages";

const ChatBox = (props) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const { token } = useAuth();
  const { socket, isConnected } = useSocket();
  const host = import.meta.env.VITE_BASE_URL;

  const chatBoxRef = useRef(null);

  // fetch messages once
  useEffect(() => {
    fetchMessage();
  }, []);

  // socket listeners
  useEffect(() => {
    if (!isConnected || !socket) return;

    const handleRecentMessage = (msgs) => {
      setAllMessages((prev) => [...prev, msgs.createdMsg]);
    };

    const handleTyping = (typingInfo) => {
      setTyping(typingInfo.state);
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
  }, [socket, isConnected]);

  // typing emit
  useEffect(() => {
    if (!socket) return;
    socket.emit("typing", typing);
  }, [typing, socket]);

  // scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allMessages, typing]);

  const fetchMessage = async () => {
    setIsLoadingMsg(true);

    try {
      const response = await fetch(`${host}/api/kurakani/chat`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const r = await response.json();

      if (response.ok) {
        const sorted = sortMessages(r.data);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!messageToSend.trim() || !socket) return;

    setIsSending(true);

    socket.emit("sendMessage", messageToSend, () => {
      setIsSending(false);
    });

    setMessageToSend("");
  };

  return (
    <div className="border-2 border-t-0 border-chat-header-border-light dark:border-chat-header-border-dark rounded-t-xl">

      {/* header */}
      <div className="bg-transparent sticky top-0 backdrop-blur-lg rounded-t-xl px-3 py-2 flex flex-row gap-3 items-center border-b-2 border-chat-header-border-light dark:border-chat-header-border-dark">
        <div
          className="md:hidden w-10 h-10 text-center text-white p-2 text-2xl mr-4 rounded-full"
          onClick={() => props.openChatList(false)}
        >
          &lt;
        </div>

        <div className="w-10 h-10 rounded-full bg-amber-500 text-center leading-10 font-black text-white">
          DC
        </div>

        <div>
          <p className="font-bold text-xl text-chat-header-text-light dark:text-chat-header-text-dark">
            Default Chat
          </p>

          <div className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full inline-block"></div>{" "}
            {onlineCount} Active Now
          </div>
        </div>
      </div>

      {/* messages */}
      <div
        ref={chatBoxRef}
        className="h-[500px] md:h-[510px] overflow-auto bg-chat-bg-light dark:bg-chat-bg-dark flex flex-col"
      >
        {allMessages.map((m, i) => (
          <div
            key={m._id || i}
            className={props.user === m.username.username ? "self-end" : "self-start"}
          >
            <MessageBubble
              sender={m.username.username}
              msg={m.message}
              timestamp={m.createdAt}
              user={props.user}
            />
          </div>
        ))}

        {typing && (
          <p className="mx-6 mb-2 text-sm text-green-700 font-semibold">
            Someone is typing...
          </p>
        )}
      </div>

      {/* input */}
      <div className="border-t-2 dark:border-slate-700">
        <form
          className="flex items-center"
          onSubmit={handleFormSubmit}
        >
          <textarea
            value={messageToSend}
            placeholder="Your message here"
            className="flex-1 resize-none m-3 p-2 rounded-xl"
            onChange={(e) => setMessageToSend(e.target.value)}
            onFocus={() => setTyping(true)}
            onBlur={() => setTyping(false)}
          />

          <button
            type="submit"
            disabled={isSending}
            className="m-2 p-3 bg-green-600 text-white rounded-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;