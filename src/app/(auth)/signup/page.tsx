import Link from "next/link";
import React from "react";

export default function page() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">

                <h2 className="text-2xl font-semibold mb-6 text-center">Join us</h2>

                <form className="space-y-5">

                    <div>
                        <label className="text-sm mb-1 block">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                            placeholder="Create a password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>

                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?
                    <Link href="/signin" className="text-blue-400 hover:underline"> Signin</Link>
                </p>
            </div>
        </div>
    );
}
