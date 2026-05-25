import { useEffect, useState } from "react";
import ChatBox from "../Components/ChatBox";
import ChatRoom from "../Components/ChatRoom";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [user, setUser] = useState(null);

  const [selectedTab, setSelectedTab] = useState("groups");
  const [selectedChat, setSelectedChat] = useState(null);

  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const host = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${host}/api/kurakani/chat/user`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const r = await response.json();

      if (response.ok) {
        setUser(r.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">

      <div className="w-[900px] h-[650px] bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex text-white">

        {/* LEFT SIDEBAR */}
        <div className="w-[280px] border-r border-gray-700 p-4 flex flex-col">

          {/* title (ONLY non-white text) */}
          <div className="text-2xl font-bold border-l-4 border-green-500 pl-3 text-green-400">
            Kurakani
          </div>

          {/* tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setSelectedTab("friends")}
              className={`flex-1 p-2 rounded-lg text-sm ${
                selectedTab === "friends"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              Friends
            </button>

            <button
              onClick={() => setSelectedTab("groups")}
              className={`flex-1 p-2 rounded-lg text-sm ${
                selectedTab === "groups"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              Groups
            </button>
          </div>

          {/* chat list */}
          <div className="mt-6 flex-1 overflow-y-auto text-white">
            <ChatRoom
              type={selectedTab}
              onSelect={(chat) => setSelectedChat(chat)}
            />
          </div>

          {/* user */}
          <div className="mt-4 text-sm text-white">
            {user?.name}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col">

          {/* top bar */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">

            <div className="font-semibold text-white">
              {selectedChat?.name || "Select a chat"}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>

          {/* chat box */}
          <div className="flex-1 p-4 overflow-hidden">
            <ChatBox
              user={user}
              chat={selectedChat}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;