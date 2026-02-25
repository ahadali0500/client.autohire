import { BadgePlus, CircleUserRound, Crown, Gem, House, Settings, History } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

export default function Sidebar(data: { collapse: boolean }) {

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

    const historyItems = [
        "Agent created #8340",
        "Resume analyzed #1192",
        "New job match #552",
        "Candidate report generated",
        "Automation triggered #0021",

    ];
    return (
        <>
            <aside
                className={`
            hidden lg:flex flex-col border-r border-theme h-screen sidebar-theme
            ${data.collapse ? "w-16" : "w-64"}
          `}
            >
                <div className="flex justify-start p-5" >
                    <img src="/assets/img/logo.png" className='w-10 dark:hidden' />
                    <img src="/assets/img/logo.png" className='w-10 hidden dark:block' />

                    {!data.collapse && <h2 className='flex-1 text-xl font-bold flex items-center pl-3'>Auto Hire</h2>}

                </div>

                <div className="overflow-y-auto p-2 mb-4">
                    {sidebarItems.map((item, index) => (
                        <div key={index}>
                            <Link href={item.path}>
                                <div className={`flex ${data.collapse && 'justify-center'} px-3 py-2 rounded-lg hover-theme cursor-pointer items-center border border-transparent transition-all duration-200`}>
                                    <item.icon size={20} /> {!data.collapse && <h1 className="ml-3 text-sm">{item.name}</h1>}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="overflow-y-auto flex-1 px-2 space-y-1">
                    <h3 className={`text-xs uppercas px-3 mb-3 ${data.collapse ? "hidden" : "block"}`}>
                        Recent Activity
                    </h3>

                    {historyItems.map((title, index) => (
                        <div
                            key={index}
                            className="px-3 py-1.5 border border-transparent transition-all duration-200 rounded-lg hover-theme cursor-pointer text-sm"
                        >
                            <Link href="/agent/398" >{!data.collapse && title}</Link>
                        </div>
                    ))}
                </div>

                <div className="border-t card-theme border-theme p-3 space-y-2">
                    <div className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition ${data.collapse ? "justify-center" : "justify-between"}`}>
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                EM
                            </div>

                            {!data.collapse && (
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-medium">Emergi Mentor</span>
                                    <span className="text-xs text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 px-2 py-[2px] rounded-md w-fit">
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
                </div>


            </aside>
        </>
    )
}
