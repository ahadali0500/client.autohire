"use client";
import React from 'react'
import { BadgePlus, Bell, BellRing, ChevronLeft, ChevronRight, Crown, House, PanelLeft, PanelLeftClose, Settings, User } from "lucide-react";
import { useState } from "react";
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import TopbarMenu from './TopbarMenu';
import Link from 'next/link';

export default function Root({ children }: any) {
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const sidebarItems = [
        {
            name: "Dashboard",
            icon: House,
            path: "/dashboard",
        },
        {
            name: "New Agent",
            icon: BadgePlus,
            path: "/agent",
        },
        {
            name: "Agent Setting",
            icon: Settings,
            path: "/agent/setting",
        },
        {
            name: "Pricing",
            icon: Crown,
            path: "/pricing",
        },
    ];
    return (
        <div className="h-screen flex">
            <div className="flex flex-1">
                <Sidebar collapse={collapsed}></Sidebar>

                {/* Mobile Sidebar Overlay */}
                <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden  transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />

                {/* Mobile Sidebar Drawer */}
                <aside className={`fixed left-0 top-0 h-full w-64 bg-(--bg) z-50 lg:hidden transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="p-4 font-bold text-primary">Menu</div>
                    <div className="space-y-2">
                        {sidebarItems.map((item: any, idx: number) => (
                            <Link href={item.path} key={idx}>
                                <div className="flex items-center px-3 py-2 rounded-lg hover-theme border border-transparent transition-all duration-200">
                                    <item.icon size={20} />
                                    <span className="ml-3 text-sm">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <header className="h-14 border-b border-theme  flex items-center justify-between sticky top-0 backdrop-blur-md bg-[--bg-blur] dark:bg-[--bg-blur]">
                        <button onClick={() => setOpen(true)} className="lg:hidden text-2xl space-x-4 ml-4">
                            ☰
                        </button>
                        <div className="hidden lg:flex items-center space-x-4 ml-4">
                            <button onClick={() => setCollapsed(!collapsed)}>
                                {collapsed ? (
                                    <PanelLeft className="w-5 h-5" />
                                ) : (
                                    <PanelLeft className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <TopbarMenu></TopbarMenu>
                    </header>
                    <section>
                        {children}
                    </section>
                </main>

            </div>
        </div>
    )
}
