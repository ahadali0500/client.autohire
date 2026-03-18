import { useState, useRef, useEffect } from "react";
import { Bell, Crown, LogOut, Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function TopbarMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector(state => state.auth);

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

    const handleLogout = () => {
        dispatch(logout());
        router.push("/signin");
    };

    return (
        <div className="relative flex items-center space-x-3 mr-4" ref={menuRef}>

            <Bell size={20} className="cursor-pointer" />

            {/* USER INFO */}
            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition" onClick={() => setOpen(!open)}>
                <User size={21} />
                {user && (
                    <span className="text-sm hidden md:block">{user.name}</span>
                )}
            </div>

            <ThemeToggle />

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 top-10 w-48 card-theme border-2 card-border-theme rounded-xl shadow-lg p-2 animate-slideDown z-50">
                    <div className="px-3 py-2 border-b border-theme mb-1">
                        {user && (
                            <div className="text-sm">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        )}
                    </div>
                    <div className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm`}>
                        <Settings size={16} /> <span className="ml-3 mt-[-1px]" >Account</span>
                    </div>
                    <div className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm`}>
                        <Crown size={16} /> <span className="ml-3 mt-[-1px]" >Pricing</span>
                    </div>
                    <div
                        onClick={handleLogout}
                        className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm text-red-500 dark:text-red-400`}
                    >
                        <LogOut size={16} /> <span className="ml-3 mt-[-1px]" >Signout</span>
                    </div>
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
