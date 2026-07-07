import { z } from "zod"

export const FaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
})

export const SubmissionSchema = z.object({
  toolName: z.string().min(2, "Tool name must be at least 2 characters").max(200),
  websiteUrl: z.string().url("Invalid URL").refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "URL must start with http:// or https://"
  ),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(1000),
  fullDescription: z.string().min(10, "Full description must be at least 10 characters").or(z.literal("")).optional().default(""),
  pricing: z.enum(["Free", "Freemium", "Paid"]),
  categoryId: z.string().uuid("Select a category"),
  tags: z.array(z.string()).max(20, "Maximum 20 tags").default([]),
  features: z.array(z.string().min(1)).max(30, "Maximum 30 features").default([]),
  pros: z.array(z.string().min(1)).max(20, "Maximum 20 pros").default([]),
  cons: z.array(z.string().min(1)).max(20, "Maximum 20 cons").default([]),
  faqs: z.array(FaqSchema).max(20, "Maximum 20 FAQs").default([]),
  contactEmail: z.string().email("Invalid email"),
  logoFile: z.instanceof(File).optional(),
  coverFile: z.instanceof(File).optional(),
  galleryFiles: z.array(z.instanceof(File)).max(10, "Maximum 10 images").default([]),
})

export type SubmissionFormData = z.infer<typeof SubmissionSchema>

export const DraftSchema = SubmissionSchema.partial()

export type DraftFormData = z.infer<typeof DraftSchema>
