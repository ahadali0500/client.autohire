export interface TimeSlot {
    start: string;
    end: string;
}

export interface AvailabilityDate {
    date: string;
    slots: TimeSlot[];
}

export interface AgentStats {
    total_candidates: number;
    parsed_candidates: number;
    shortlisted_candidates: number;
    outreach_sent: number;
    interviews_scheduled: number;
}

export interface CandidateHeader {
    name: string;
    email: string;
    phone: string;
    title: string;
    github: string | null;
    linkedin: string | null;
    location: string;
    portfolio: string | null;
}

export interface CandidateProject {
    name: string;
    github: string | null;
    live_demo: string | null;
    tech_stack: string[];
    description: string[];
}

export interface CandidateEducation {
    degree: string;
    end_year: string | null;
    location: string | null;
    start_year: string | null;
    institution: string;
}

export interface CandidateWorkExperience {
    company: string;
    end_date: string;
    location: string | null;
    job_title: string;
    start_date: string;
    responsibilities: string[];
}

export interface CandidateTechnicalSkills {
    [key: string]: string[];
}

export interface CandidateAdditionalSection {
    title: string;
    description: string[];
}

export interface CandidateData {
    header: CandidateHeader;
    projects: CandidateProject[];
    education: CandidateEducation[];
    certifications: string[];
    work_experience: CandidateWorkExperience[];
    technical_skills: {
        skills: CandidateTechnicalSkills;
    };
    additional_sections: CandidateAdditionalSection[];
    professional_summary: string;
}

export interface ScoredData {
    weights: {
        [key: string]: number;
    };
    recommended: boolean;
    overall_score: number;
    threshold_met: boolean;
    category_scores: {
        [key: string]: {
            score: number;
            explanation: string;
        };
    };
    adaptation_reason: string;
    adaptation_applied: boolean;
}

export interface Candidate {
    candidate_id: number;
    candidate_data?: CandidateData;
    scored_data?: ScoredData;
    parse_status: string;
    parsed_at: string;
    parse_error: string;
    score_status: string;
    scored_at: string | null;
    scored_error: string | null;
    outreach_status: string;
    outreach_at: string;
    outreach_error: string | null;
    interview_status: string | null;
    interview_scheduled_at: string | null;
    interview_start_time: string | null;
    interview_end_time: string | null;
    calendar_event_id: string | null;
    calendar_event_link: string | null;
    hangout_link: string | null;
    conversations: ConversationMessage[];
}

export interface ConversationMessage {
    sender: 'candidate' | 'ai';
    created_at: string;
    content: string;
}

export interface AgentSummary {
    agent_id: number;
    job_title: string;
    job_description: string;
    max_candidate: number;
    status: 'pending' | 'resume-screening' | 'shortlisting' | 'outreaching' | 'interview-scheduling' | 'summary' | 'completed';
    state: 'pending' | 'running' | 'paused' | 'stopped' | 'completed';
    created_at: string;
    total_candidates: number;
    shortlisted_candidates: number;
    outreach_sent: number;
    parsed_candidates: number;
    interviews_scheduled: number;
}

export interface AllAgentsResponse {
    success: boolean;
    message: string;
    errors: null | any;
    result: AgentSummary[];
}

export interface log {
    logs_id: number;
    text: string;
    status: string;
    timestamp: any;
}

export interface AgentDetail {
    agent_id: number;
    job_title: string;
    job_description: string;
    status: 'pending' | 'resume-screening' | 'shortlisting' | 'outreaching' | 'interview-scheduling' | 'summary' | 'completed';
    state: 'pending' | 'running' | 'paused' | 'stopped' | 'completed';
    experience_range: number;
    max_candidate: number;
    min_resume_score: number;
    nice_to_have_skills: string[];
    must_have_skills: string[];
    stats: AgentStats;
    candidates: Candidate[];
    logs: log[];
}

export interface AgentDetailResponse {
    success: boolean;
    message: string;
    errors: null | any;
    result: AgentDetail;
}
