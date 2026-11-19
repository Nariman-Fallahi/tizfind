import { AppWindow, LayoutDashboard } from "lucide-react";
import { ToggleSwitcher } from "./toggle-switcher";
import { useLocation, useNavigate } from "react-router";

const pageOptions = [
  { value: "/", label: "Launcher", icon: AppWindow },
  { value: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export default function PageSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentPage =
    pageOptions.find((page) => pathname === page.value)?.value ?? "/";

  return (
    <ToggleSwitcher
      value={currentPage}
      onChange={navigate}
      options={pageOptions}
      ariaLabel="Main navigation"
    />
  );
}
