import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark">
      <Outlet />
    </div>
  );
};

export default AppLayout;
