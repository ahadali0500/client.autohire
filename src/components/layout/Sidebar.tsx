"use client";

import { BadgePlus, CircleUserRound, Crown, Gem, House, Settings, History, LogOut, MessageSquareText } from 'lucide-react'
import Link from 'next/link';
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { fetchAllAgents } from '@/store/slices/agentSlice';

export default function Sidebar(data: { collapse: boolean }) {
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const { user, token } = useAppSelector(state => state.auth);
    const { agents, isLoading } = useAppSelector(state => state.agents);

    useEffect(() => {
        if (token && agents.length === 0 && !isLoading) {
            dispatch(fetchAllAgents(token));
        }
    }, [token, agents.length, isLoading, dispatch]);

    useEffect(() => {
        const handler = (e: any) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/signin");
    };

    // Get user initials
    const getInitials = (name: string | undefined) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const sidebarItems = [
        {
            name: "Dashboard",
            icon: House,
            path: "/dashboard",
        },
        {
            name: "New Agent",
            icon: BadgePlus,
            path: "/agent/new",
        },
        {
            name: "Agent Setting",
            icon: Settings,
            path: "/agent/setting",
        },
        {
            name: "Recent Activity",
            icon: History,
            path: "/agent",
        },
        {
            name: "Pricing",
            icon: Crown,
            path: "/pricing",
        },
    ];

    const displayAgents = useMemo(() => {
        return [...agents].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 8);
    }, [agents]);

    const isAgentActive = (id: number) => pathname === `/agent/${id}`;

    return (
        <>
            <aside
                className={`
            hidden lg:flex flex-col border-r border-theme h-screen bg-bg
            ${data.collapse ? "w-16" : "w-64"}
          `}
            >
                <div className="flex justify-start p-5 mb-2" >
                    <img src="/assets/img/logo.png" className='w-8 h-8' />
                    {!data.collapse && <h2 className='flex-1 text-lg font-bold flex items-center pl-3 tracking-tight text-text'>AutoHire</h2>}
                </div>

                <div className="px-2 space-y-1 mb-6">
                    <Link href="/agent/new">
                        <div className={`flex ${data.collapse ? 'justify-center' : 'px-3'} py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover cursor-pointer items-center transition-all duration-200 shadow-sm mb-4 mx-1`}>
                            <BadgePlus size={18} /> 
                            {!data.collapse && <span className="ml-3 text-sm ">New Session</span>}
                        </div>
                    </Link>

                    {sidebarItems.filter(item => item.path !== "/agent/new").map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={index} href={item.path}>
                                <div className={`flex ${data.collapse ? 'justify-center' : 'px-3'} py-2 rounded-xl items-center border border-transparent transition-colors duration-200 ${isActive ? 'bg-surface text-text font-medium border-theme' : 'hover:bg-surface text-subtext hover:text-text hover:border-theme'}`}>
                                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} /> 
                                    {!data.collapse && <h1 className="ml-3 text-sm">{item.name}</h1>}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="overflow-y-auto flex-1 px-2 space-y-0.5 custom-scrollbar">
                    {!data.collapse && (
                        <div className="px-3 py-2">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-subtext/60">
                                Recent Activity
                            </h3>
                        </div>
                    )}

                    {isLoading && !data.collapse && (
                        <div className="px-3 space-y-4 pt-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center gap-3 px-1">
                                    <div className="h-2 bg-border rounded-full animate-pulse flex-1" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-border animate-pulse opacity-50" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!data.collapse && !isLoading && displayAgents.map((agent) => {
                        const active = isAgentActive(agent.agent_id);
                        return (
                            <Link 
                                key={agent.agent_id} 
                                href={`/agent/${agent.agent_id}`}
                                className={`group flex items-center px-3 py-2 rounded-lg mb-0.5 text-[13px] border border-transparent transition-colors duration-200 ${
                                    active 
                                    ? 'bg-surface text-text font-medium border-theme' 
                                    : 'hover:bg-surface text-text hover:text-text hover:border-theme'
                                }`}
                            >
                                <span className="truncate flex-1">{agent.job_title}</span>
                                {agent.state === 'active' && (
                                    <div className={`shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2 ${!active && 'animate-pulse'}`} />
                                )}
                            </Link>
                        );
                    })}

                    {!data.collapse && agents.length > 8 && (
                        <Link 
                            href="/agent" 
                            className="flex items-center px-3 py-2 text-[11px] font-bold text-primary/60 hover:text-primary transition-colors mt-2"
                        >
                            View all sessions
                        </Link>
                    )}

                    {!data.collapse && agents.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-2 opacity-20">
                            <History size={20} strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Empty</p>
                        </div>
                    )}
                </div>

                <div className="border-t card-theme border-theme p-3 space-y-2 relative" ref={menuRef}>
                    <div 
                        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition ${data.collapse ? "justify-center" : "justify-between"} hover-theme`}
                        onClick={() => !data.collapse && setOpenUserMenu(!openUserMenu)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                {getInitials(user?.name)}
                            </div>

                            {!data.collapse && (
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-medium text-text">{user?.name || "User"}</span>
                                    <span className="text-xs text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 px-2 py-0.5 rounded-md w-fit">
                                        Free
                                    </span>
                                </div>
                            )}
                        </div>

                        {!data.collapse && (
                            <Link href="/pricing" className="flex items-center">
                                <Gem
                                    size={18}
                                    className="text-purple-500 hover:text-purple-400 transition"
                                />
                            </Link>
                        )}
                    </div>

                    {/* USER DROPDOWN MENU */}
                    {!data.collapse && openUserMenu && (
                        <div className="absolute bottom-full mb-2 left-0 w-full card-theme border-2 card-border-theme rounded-xl shadow-lg p-2 animate-slideDown z-50">
                            <div className="px-3 py-2 border-b border-theme mb-1">
                                {user && (
                                    <div className="text-sm">
                                        <p className="font-medium text-text">{user.name}</p>
                                        <p className="text-subtext">{user.email}</p>
                                    </div>
                                )}
                            </div>
                            <Link href="/agent/setting" className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm text-text`}>
                                <Settings size={16} /> <span className="ml-3 -mt-px">Account</span>
                            </Link>
                            <Link href="/pricing" className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm text-text`}>
                                <Crown size={16} /> <span className="ml-3 -mt-px">Pricing</span>
                            </Link>
                            <div
                                onClick={handleLogout}
                                className={`flex justify-start px-3 py-2 rounded-lg cursor-pointer hover-theme border border-transparent transition text-sm text-red-500 dark:text-red-400`}
                            >
                                <LogOut size={16} /> <span className="ml-3 -mt-px">Logout</span>
                            </div>
                        </div>
                    )}
                </div>


            </aside>
        </>
    )
}
