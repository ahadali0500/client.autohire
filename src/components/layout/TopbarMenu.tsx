import { useState, useRef, useEffect } from "react";
import { Bell, Crown, LogOut, Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function TopbarMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: any) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative flex items-center space-x-3 mr-4" ref={menuRef}>

            <Bell size={20} className="cursor-pointer" />

            {/* USER ICON */}
            <User
                size={21}
                className="cursor-pointer hover:text-blue-500 transition"
                onClick={() => setOpen(!open)}
            />

            <ThemeToggle />

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 top-10 w-48 card-theme border-2 card-border-theme rounded-xl shadow-lg p-2 animate-slideDown z-50">
                    <div className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm`}>
                        <Settings size={16} /> <span className="ml-3 mt-[-1px]" >Account</span>
                    </div>
                    <div className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm`}>
                        <Crown size={16} /> <span className="ml-3 mt-[-1px]" >Pricing</span>
                    </div>
                    <div className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm text-red-500 dark:text-red-400`}>
                        <LogOut size={16} /> <span className="ml-3 mt-[-1px]" >Signout</span>
                    </div>
                    {/* ${danger ? "text-red-500 dark:text-red-400" : ""} */}
                    {/* <DropdownItem label="Profile" />
                    <DropdownItem label="Setting" />
                    <DropdownItem label="Logout" danger /> */}
                </div>
            )}
        </div>
    );
}

function DropdownItem({ label, danger }: any) {
    return (
        <div className={`px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm ${danger ? "text-red-500 dark:text-red-400" : ""}`}>
            {label}
        </div>
    );
}
