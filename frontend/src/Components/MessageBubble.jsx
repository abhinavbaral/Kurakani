import { useEffect, useState } from "react";
import getDuration from "../Utility/Date";

const MessageBubble = ({ sender, msg, timestamp, user }) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!timestamp) return;
    setDuration(getDuration(timestamp));
  }, [timestamp]);

  const isOwnMessage = user === sender;

  return (
    <div className="m-4">
      
      {/* header */}
      <div className="flex items-center">
        <p className="text-[14px] px-2 text-gray-400 font-semibold capitalize">
          {sender}
        </p>
        <p className="text-[11px] font-semibold px-2 text-gray-400">
          {duration}
        </p>
      </div>

      {/* bubble */}
      <div
        className={`h-fit cursor-pointer max-w-full p-2 rounded-xl transition-colors ${
          isOwnMessage
            ? "text-message-sender-text-light bg-message-sender-light dark:bg-message-sender-dark hover:bg-greenAccentHoverLight dark:hover:bg-greenAccentHover"
            : "text-message-receiver-text-light dark:text-message-receiver-text-dark bg-gray-300 dark:bg-message-receiver-dark hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {msg}
      </div>
    </div>
  );
};

export default MessageBubble;
