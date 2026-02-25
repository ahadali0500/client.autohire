'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md shadow-lg card-theme border border-transparent border-theme">

                <h2 className="text-2xl font-semibold mb-6 text-center">Signin</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.push("/dashboard");
                    }}
                    className="space-y-5">
                    <div>
                        <label className="text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                        className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                        className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-l transition"
                    >
                        Submit
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Don’t have an account?
                    <Link href="/signup" className="text-blue-400 hover:underline"> Sign up</Link>
                </p>
            </div>
        </div>
    );
}
