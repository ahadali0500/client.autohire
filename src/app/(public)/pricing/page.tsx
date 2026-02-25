"use client";

import PublicNavbar from "@/components/public-layout/Navbar";
import { Check, Minus } from "lucide-react";

export default function PlansPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            highlight: false,
            limits: {
                resumes: "Up to 20 resumes",
                outreach: "5 candidates outreach",
                chatAI: "No AI chat screening",
                scheduling: "No interview scheduling",
                support: "Email support only",
            },
            cta: "Start Free",
        },
        {
            name: "Basic",
            price: "$29/mo",
            highlight: true,
            limits: {
                resumes: "Up to 200 resumes",
                outreach: "30 candidates outreach",
                chatAI: "AI chat screening included",
                scheduling: "Auto scheduling included",
                support: "Priority email support",
            },
            cta: "Upgrade to Basic",
        },
        {
            name: "Premium",
            price: "$79/mo",
            highlight: false,
            limits: {
                resumes: "Unlimited resume screening",
                outreach: "Unlimited outreach",
                chatAI: "Advanced AI chat screening",
                scheduling: "Smart scheduling + reminders",
                support: "24/7 dedicated Slack support",
            },
            cta: "Go Premium",
        },
    ];

    return (
        <>
        <div className="max-w-6xl mx-auto p-6">
            {/* Title */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">AI Hiring Agent Plans</h1>
                <p className="text-subtext text-sm mt-2">
                    Choose a plan that fits your hiring needs
                </p>
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`
              rounded-2xl border p-6 bg-card relative
              ${plan.highlight ? "border-primary shadow-lg scale-[1.02]" : "border-theme"}
            `}
                    >
                        {/* Recommended badge */}
                        {plan.highlight && (
                            <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-primary text-white">
                                Most Popular
                            </span>
                        )}

                        <h2 className="text-xl font-semibold">{plan.name}</h2>
                        <p className="text-3xl font-bold mt-3">{plan.price}</p>

                        <hr className="my-4 border-theme" />

                        {/* Features List */}
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2">
                                <Check className="text-primary w-4 h-4" />
                                {plan.limits.resumes}
                            </li>
                            <li className="flex gap-2">
                                <Check className="text-primary w-4 h-4" />
                                {plan.limits.outreach}
                            </li>
                            <li className="flex gap-2">
                                {plan.limits.chatAI.includes("No") ? (
                                    <Minus className="text-red-500 w-4 h-4" />
                                ) : (
                                    <Check className="text-primary w-4 h-4" />
                                )}
                                {plan.limits.chatAI}
                            </li>
                            <li className="flex gap-2">
                                {plan.limits.scheduling.includes("No") ? (
                                    <Minus className="text-red-500 w-4 h-4" />
                                ) : (
                                    <Check className="text-primary w-4 h-4" />
                                )}
                                {plan.limits.scheduling}
                            </li>
                            <li className="flex gap-2">
                                <Check className="text-primary w-4 h-4" />
                                {plan.limits.support}
                            </li>
                        </ul>

                        {/* Button */}
                        <button
                            className={`
                w-full mt-6 py-3 rounded-lg font-semibold transition
                ${plan.highlight
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "border border-theme hover:bg-hover-bg"
                                }
              `}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
