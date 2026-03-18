'use client';

import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { useSignup } from "@/hooks/useSignup";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string>("");
    const { mutate: signup, isPending } = useSignup();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setServerError("");
        signup(
            {
                name: data.name,
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: (response) => {
                    reset();
                    // router.push("/dashboard");
                    console.log(response);
                    
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message ||
                        "Signup failed. Please try again.";
                    setServerError(errorMessage);
                },
            }
        );
    };

    return (
        <div className="mt-40 flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md shadow-lg card-theme border border-transparent border-theme">

                <h2 className="text-2xl font-semibold mb-6 text-center">Join us</h2>

                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <label className="text-sm mb-1 block">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            {...register("name")}
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            {...register("password")}
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Signing up..." : "Sign Up"}
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
