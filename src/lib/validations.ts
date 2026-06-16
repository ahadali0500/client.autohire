import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

const timeSlotSchema = z.object({
  start: z.string().nonempty("Start time is required"),
  end: z.string().nonempty("End time is required"),
}).refine(data => data.start < data.end, {
  message: "End time must be after start time",
  path: ["end"],
});

const availabilityDateSchema = z.object({
  date: z.string().nonempty("Date is required"),
  slots: z.array(timeSlotSchema).min(1, "At least one time slot is required"),
});

export const agentSchema = z.object({
  title: z.string().min(1, 'Job Title is required'),
  description: z.string().min(1, 'Job Description is required'),
  niceToHave: z.array(z.string()).min(1, 'At least one Nice-Have Skill is required'),
  mustHave: z.array(z.string()).min(1, 'At least one Must-Have Skill is required'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  maxCandidates: z.number().min(1, 'Maximum Candidates must be at least 1'),
  minScore: z.number()
    .min(0, 'Minimum Score must be between 0 and 100')
    .max(100, 'Minimum Score must be between 0 and 100'),
  interview_start_date: z.string().nonempty("Interview start is required"),
  interview_end_date: z.string().nonempty("Interview end is required"),
  resumes: z.any()
    .refine(files => files?.length > 0, 'At least one resume is required.')
    .refine(files => {
      if (!files) return false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== 'application/pdf') return false;
      }
      return true;
    }, 'Only PDF files are allowed.'),
  availability: z.array(availabilityDateSchema).min(1, "At least one availability date is required"),
  sourceTag: z.string().optional(),
  hrGuidelines: z.string().optional(),
})
.refine(
  (data) => data.interview_start_date <= data.interview_end_date,
  {
    message: "End date must be after or same as start date",
    path: ["interview_end_date"],
  }
)
.refine((data) => {
  if (!data.interview_start_date || !data.interview_end_date) return true;

  return data.availability.every((d) => {
    return (
      d.date >= data.interview_start_date &&
      d.date <= data.interview_end_date
    );
  });
}, {
  message: "Availability dates must be within interview window",
  path: ["availability"],
});

export type AgentFormData = z.infer<typeof agentSchema>;
