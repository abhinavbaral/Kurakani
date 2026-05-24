import { useEffect, useState } from "react";
import ChatBox from "../Components/ChatBox";
import ChatRoom from "../Components/ChatRoom";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [chatListClick, setChatListClick] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const host = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoadingUser(true);

    try {
      const response = await fetch(`${host}/api/kurakani/chat/user`, {
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
        setUser(r.user);
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleCloseChatList = (isClicked) => {
    setChatListClick(isClicked);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-cardBgLight dark:bg-cardBgDark rounded-2xl p-6 border shadow-lg">

        <div className="flex">

          {/* sidebar */}
          <div className={`${chatListClick ? "hidden md:block" : "block"}`}>
            
            <div className="text-2xl font-bold border-l-4 border-greenAccent px-3">
              Kurakani
            </div>

            <div className="mt-10 flex flex-col gap-5">

              <div onClick={() => setChatListClick(true)}>
                <ChatRoom isClicked={chatListClick} />
              </div>

              <div className="text-center">
                <p className="font-semibold">
                  Namaste, {user || "Loading..."}
                </p>

                <p
                  className="mt-3 cursor-pointer text-sm hover:text-black"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>

          {/* chat area */}
          <div
            className={`${
              chatListClick ? "block" : "hidden"
            } md:block lg:w-[700px] md:h-[600px] md:ml-6 md:border-l-2 md:pl-6`}
          >
            <ChatBox user={user} openChatList={handleCloseChatList} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;