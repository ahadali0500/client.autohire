"use client";

import { useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema, AgentFormData } from "@/lib/validations";
import TagInput from "@/components/TagInput/Index";
import AvailabilitySetup from "./AvailabilitySetup";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { Loader2 } from "lucide-react";
// import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface ResumeFile {
    name: string;
    file: File;
}

export default function JobForm() {
    const { mutate: createAgent, isPending, isError, error } = useCreateAgent();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue
    } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            experience: 5,
            maxCandidates: 50,
            minScore: 70,
            niceToHave: [],
            mustHave: [],
            availability: [],
            interview_start_date: "",
            interview_end_date: "",
        },
    });

    const experience = watch("experience");
    const maxCandidates = watch("maxCandidates");
    const minScore = watch("minScore");

    const [files, setFiles] = useState<ResumeFile[]>([]);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        setValue("resumes", selected, { shouldValidate: true });

        const selectedWithNames = selected.map((file) => ({
            name: file.name,
            file,
        }));
        setFiles((prev) => [...prev, ...selectedWithNames]);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        const fileList = updatedFiles.map(f => f.file);
        setValue("resumes", fileList, { shouldValidate: true });
    };

    const onSubmit = (data: AgentFormData) => {
        createAgent(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-5xl mx-auto p-6 space-y-10">
                    <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold">Job Details</h2>
                        <div>
                            <label className="block text-sm mb-1">Job Title *</label>
                            <input
                                type="text"
                                {...register("title")}
                                placeholder="Senior Full Stack Developer"
                                className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Job Description *</label>
                            <textarea
                                rows={4}
                                {...register("description")}
                                placeholder="Write the description here..."
                                className="w-full px-3 py-2 rounded-lg border-2 border-theme outline-none text-sm bg-bg"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="niceToHave"
                                control={control}
                                render={({ field }) => (
                                    <TagInput
                                        label="Nice-To-Have Skills"
                                        placeholder="Type and press Enter"
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <div>
                                <Controller
                                    name="mustHave"
                                    control={control}
                                    render={({ field }) => (
                                        <TagInput
                                            label="Must-Have Skills *"
                                            placeholder="Type and press Enter"
                                            value={field.value || []}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.mustHave && <p className="text-red-500 text-xs mt-1">{errors.mustHave.message}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Experience Range (Min Years)</label>
                                <span className="text-sm">{experience}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={20}
                                {...register("experience", { valueAsNumber: true })}
                                className="range-slider w-full"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium mb-1">Maximum Candidates to Approach</label>
                                <span className="text-sm">{maxCandidates}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                {...register("maxCandidates", { valueAsNumber: true })}
                                className="range-slider w-full"
                            />
                            {errors.maxCandidates && <p className="text-red-500 text-xs mt-1">{errors.maxCandidates.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-sm font-medium mb-1">Minimum Resume Score</label>
                                <span className="text-sm">{minScore}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                {...register("minScore", { valueAsNumber: true })}
                                className="range-slider w-full"
                            />
                            {errors.minScore && <p className="text-red-500 text-xs mt-1">{errors.minScore.message}</p>}
                        </div>
                    </section>

                    <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold">Resumes *</h2>
                        <input
                            type="file"
                            id="resumes"
                            multiple
                            className="hidden"
                            onChange={handleUpload}
                            accept="application/pdf"
                        />
                        <div onClick={() => document.getElementById("resumes")?.click()} className="border-2 border-dashed border-theme rounded-xl p-6 cursor-pointer hover:bg-hover-bg transition flex flex-col items-center justify-center text-center bg-bg mt-2">
                            <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
                                📄
                            </div>
                            <p className="text-sm font-medium">
                                Drop files here or <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-subtext mt-1">Only PDF allowed</p>
                        </div>
                        {errors.resumes && <p className="text-red-500 text-xs mt-1">{errors.resumes.message as string}</p>}

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-bg p-2 rounded">
                                        <p className="text-sm">{file.name}</p>
                                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-1">Source Tag (Optional)</label>
                            <select {...register("sourceTag")} className="select-theme w-full px-3 py-2 rounded-lg border-2 border-theme text-sm bg-bg">
                                <option value="">Select source</option>
                                <option>LinkedIn Campaign</option>
                                <option>Job Board</option>
                                <option>Internal Referral</option>
                                <option>Talent Pool</option>
                            </select>
                        </div>
                    </section>

                    <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold">Interview Window *</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Start */}
                            <div>
                                <label className="block text-sm mb-1">
                                    Interview Start Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("interview_start_date")}
                                    className="w-full px-3 py-2 rounded-lg border-2 border-theme text-sm bg-bg outline-none"
                                />
                                {errors.interview_start_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.interview_start_date.message}
                                    </p>
                                )}
                            </div>

                            {/* End */}
                            <div>
                                <label className="block text-sm mb-1">
                                    Interview End Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("interview_end_date")}
                                    className="w-full px-3 py-2 rounded-lg border-2 border-theme text-sm bg-bg outline-none"
                                />
                                {errors.interview_end_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.interview_end_date.message}
                                    </p>
                                )}
                            </div>

                        </div>
                    </section>

                    <Controller
                        name="availability"
                        control={control}
                        render={({ field }) => (
                            <AvailabilitySetup
                                value={field.value}
                                onChange={field.onChange}
                                interview_start_date={watch("interview_start_date")}
                                interview_end_date={watch("interview_end_date")}
                                errors={errors.availability}
                            />
                        )}
                    />
                    {errors.availability && !errors.availability.length && <p className="text-red-500 text-xs mt-1">{errors.availability.message as string}</p>}

                    {isError && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {(error as any)?.response?.data?.message || "An error occurred while creating the agent."}
                        </div>
                    )}

                    <section className="bg-card border border-theme rounded-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold mb-4">AI Agent Guidelines</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">HR Guidelines for AI</label>
                            <textarea
                                rows={4}
                                {...register("hrGuidelines")}
                                placeholder="Any special instructions for the AI agent..."
                                className="w-full px-3 py-2 rounded-lg border-2 border-theme text-sm placeholder:text-sm bg-bg outline-none"
                            />
                        </div>
                    </section>
                </div>

                <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bg via-bg/95 to-transparent backdrop-blur-md py-2 px-1 flex justify-end border-t border-theme z-40">
                    <div className="bg-card px-6 py-1 rounded-xl shadow-lg shadow-black/10 border border-theme flex items-center gap-4 animate-fade-in">
                        <span className="text-sm text-subtext hidden sm:block">
                            All set? Start the AI hiring agent
                        </span>
                        <button type="submit" disabled={isPending} className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition disabled:bg-primary/70 flex items-center gap-2 min-w-32 justify-center">
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing
                                </>
                            ) : (
                                "Create Agent →"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

