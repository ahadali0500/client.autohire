'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useLogin } from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setToken, setIsLoading, setError } from "@/store/slices/authSlice";

export default function SigninPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [serverError, setServerError] = useState<string>("");
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: LoginFormData) => {
        setServerError("");
        dispatch(setIsLoading(true));

        login(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: (response) => {
                    dispatch(setUser(response.result.user));
                    dispatch(setToken(response.result.access_token));
                    dispatch(setIsLoading(false));
                    reset();
                    router.push("/dashboard");
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message ||
                        "Login failed. Please try again.";
                    setServerError(errorMessage);
                    dispatch(setError(errorMessage));
                    dispatch(setIsLoading(false));
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md shadow-lg card-theme border border-transparent border-theme">

                <h2 className="text-2xl font-semibold mb-6 text-center">Signin</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm"
                            placeholder="Enter password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-2 rounded-lg transition"
                    >
                        {isPending ? "Signing in..." : "Submit"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Don't have an account?
                    <Link href="/signup" className="text-blue-400 hover:underline"> Sign up</Link>
                </p>
            </div>
        </div>
    );
}