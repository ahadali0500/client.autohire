"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-20 border-b border-theme bg-bg/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" ><span className="text-2xl font-bold tracking-tight">Auto Hire</span></Link>

                <div className="hidden md:flex gap-8 text-sm">
                    <Link href="about-us" className="hover:text-primary transition">About us</Link>
                    <Link href="/pricing" className="hover:text-primary transition">Pricing</Link>
                    <Link href="/how-it-work" className="hover:text-primary transition">How it work</Link>
                    <Link href="/contact" className="hover:text-primary transition">Contact Us</Link>
                </div>

                <div className="flex gap-3">
                    <Link href="/signin" className="px-4 py-2 border border-theme rounded-lg hover-theme text-sm">
                        Login
                    </Link>
                    <Link href="signup" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
