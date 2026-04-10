import { Outlet } from "react-router-dom";
import PrimarySidebar from "./PrimarySidebar";
import SecondarySidebar from "./SecondarySidebar";
import TopHeader from "./TopHeader";
import ToastHost from "./ToastHost";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-default">
      <PrimarySidebar />
      <SecondarySidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto bg-bg-default">
          <Outlet />
        </main>
        <ToastHost />
      </div>
    </div>
  );
}
