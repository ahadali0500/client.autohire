import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPresignedUrl, uploadToS3, createAgent } from "@/lib/api";
import { AgentFormData } from "@/lib/validations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { fetchAllAgents, addAgentOptimistic } from "@/store/slices/agentSlice";

export const useCreateAgent = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const token = useAppSelector(state => state.auth.token);

    return useMutation({
        mutationFn: async (data: AgentFormData) => {
            if (!token) {
                throw new Error("Not authenticated");
            }

            const resumeUrls = await Promise.all(
                data.resumes.map(async (file: File) => {
                    const presignedData = await getPresignedUrl(file.name, file.type, token);
                    await uploadToS3(presignedData.pre_signed_url, file);
                    return presignedData.public_url;
                })
            );

            const agentData = {
                title: data.title,
                description: data.description,
                niceToHave: data.niceToHave,
                mustHave: data.mustHave,
                experience: data.experience,
                maxCandidates: data.maxCandidates,
                minScore: data.minScore,
                interview_start_date: data.interview_start_date,
                interview_end_date: data.interview_end_date,
                resumes: resumeUrls,
                availability: data.availability.map(day => ({
                    date: day.date,
                    slots: day.slots.map(slot => ({
                        start: slot.start,
                        end: slot.end
                    }))
                })),
                sourceTag: data.sourceTag || null,
                hrGuidelines: data.hrGuidelines || null,
            };

            const response = await createAgent(agentData, token);
            return response;
        },
        onSuccess: (data) => {
            const agentId = data.result.agent_id;
            
            // Optimistically update the sidebar
            dispatch(addAgentOptimistic({
                ...data.result,
                total_candidates: 0,
                shortlisted_candidates: 0,
                outreach_sent: 0,
                parsed_candidates: 0,
                interviews_scheduled: 0,
            }));

            if (token) {
                dispatch(fetchAllAgents(token));
            }
            queryClient.invalidateQueries({ queryKey: ["agents", "all"] });
            router.push(`/agent/${agentId}`);
        },
    });
};
