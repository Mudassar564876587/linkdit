import { z } from "zod"

export const ArticleSubmissionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  categoryId: z.string().uuid("Select a category"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImageUrl: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
  tags: z.array(z.string()).max(20, "Maximum 20 tags").default([]),
})

export type ArticleSubmissionFormData = z.infer<typeof ArticleSubmissionSchema>
