export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon_name: string
          tool_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon_name: string
          tool_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon_name?: string
          tool_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          category_id: string
          logo_url: string | null
          website_url: string
          pricing: "Free" | "Freemium" | "Paid"
          rating: number
          review_count: number
          featured: boolean
          is_published: boolean
          sponsored: boolean
          is_verified: boolean
          screenshots: any
          features: string[]
          pros: string[]
          cons: string[]
          faqs: any
          website_label: string
          seo_title: string | null
          seo_description: string | null
          search_vector: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          category_id: string
          logo_url?: string | null
          website_url: string
          pricing: "Free" | "Freemium" | "Paid"
          rating?: number
          review_count?: number
          featured?: boolean
          is_published?: boolean
          sponsored?: boolean
          is_verified?: boolean
          screenshots?: any
          features?: string[]
          pros?: string[]
          cons?: string[]
          faqs?: any
          website_label?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          category_id?: string
          logo_url?: string | null
          website_url?: string
          pricing?: "Free" | "Freemium" | "Paid"
          rating?: number
          review_count?: number
          featured?: boolean
          is_published?: boolean
          sponsored?: boolean
          is_verified?: boolean
          screenshots?: any
          features?: string[]
          pros?: string[]
          cons?: string[]
          faqs?: any
          website_label?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string
          category_id: string
          cover_image_url: string | null
          read_time: string
          published_at: string | null
          author_id: string | null
          author_name: string
          featured: boolean
          is_published: boolean
          tags: any
          seo_title: string | null
          seo_description: string | null
          search_vector: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content: string
          category_id: string
          cover_image_url?: string | null
          read_time: string
          published_at?: string | null
          author_id?: string | null
          author_name: string
          featured?: boolean
          is_published?: boolean
          tags?: any
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string
          category_id?: string
          cover_image_url?: string | null
          read_time?: string
          published_at?: string | null
          author_id?: string | null
          author_name?: string
          featured?: boolean
          is_published?: boolean
          tags?: any
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          username: string | null
          bio: string | null
          website: string | null
          twitter: string | null
          linkedin: string | null
          github: string | null
          role: "admin" | "user"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          twitter?: string | null
          linkedin?: string | null
          github?: string | null
          role?: "admin" | "user"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          twitter?: string | null
          linkedin?: string | null
          github?: string | null
          role?: "admin" | "user"
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          tool_id: string | null
          article_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id?: string | null
          article_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string | null
          article_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          rating: number
          content: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          rating: number
          content?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          rating?: number
          content?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_submissions: {
        Row: {
          id: string
          submitter_email: string
          tool_name: string
          tool_url: string
          description: string
          category_id: string | null
          status: "pending" | "approved" | "rejected"
          admin_notes: string | null
          user_id: string | null
          logo_url: string | null
          cover_image_url: string | null
          gallery_images: any
          full_description: string | null
          pricing: string
          tags: any
          features: any
          pros: any
          cons: any
          faqs: any
          contact_email: string | null
          slug: string | null
          submission_status: string
          publish_status: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submitter_email: string
          tool_name: string
          tool_url: string
          description: string
          category_id?: string | null
          status?: "pending" | "approved" | "rejected"
          admin_notes?: string | null
          user_id?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: any
          full_description?: string | null
          pricing?: string
          tags?: any
          features?: any
          pros?: any
          cons?: any
          faqs?: any
          contact_email?: string | null
          slug?: string | null
          submission_status?: string
          publish_status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          submitter_email?: string
          tool_name?: string
          tool_url?: string
          description?: string
          category_id?: string | null
          status?: "pending" | "approved" | "rejected"
          admin_notes?: string | null
          user_id?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: any
          full_description?: string | null
          pricing?: string
          tags?: any
          features?: any
          pros?: any
          cons?: any
          faqs?: any
          contact_email?: string | null
          slug?: string | null
          submission_status?: string
          publish_status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_submissions_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          subscribed?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          subscribed?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: "review_reply" | "tool_approved" | "tool_rejected" | "submission_status" | "bookmark_update" | "mention" | "system"
          title: string
          body: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "review_reply" | "tool_approved" | "tool_rejected" | "submission_status" | "bookmark_update" | "mention" | "system"
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "review_reply" | "tool_approved" | "tool_rejected" | "bookmark_update" | "mention" | "system"
          title?: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      tool_tags: {
        Row: {
          tool_id: string
          tag_id: string
        }
        Insert: {
          tool_id: string
          tag_id: string
        }
        Update: {
          tool_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_tags_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      resources: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          content: string | null
          category_id: string | null
          logo_url: string | null
          cover_image_url: string | null
          website_url: string | null
          download_url: string | null
          pricing: string
          features: any
          tags: any
          featured: boolean
          is_published: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          content?: string | null
          category_id?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website_url?: string | null
          download_url?: string | null
          pricing?: string
          features?: any
          tags?: any
          featured?: boolean
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          content?: string | null
          category_id?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website_url?: string | null
          download_url?: string | null
          pricing?: string
          features?: any
          tags?: any
          featured?: boolean
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      resource_tags: {
        Row: {
          resource_id: string
          tag_id: string
        }
        Insert: {
          resource_id: string
          tag_id: string
        }
        Update: {
          resource_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_tags_resource_id_fkey"
            columns: ["resource_id"]
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          key: string
          value: any
          updated_at: string
        }
        Insert: {
          key: string
          value?: any
          updated_at?: string
        }
        Update: {
          key?: string
          value?: any
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: any
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comparisons: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          tool_a_id: string
          tool_b_id: string
          category_id: string | null
          tool_a_notes: string | null
          tool_b_notes: string | null
          pros_a: string[]
          pros_b: string[]
          cons_a: string[]
          cons_b: string[]
          features_comparison: any
          pricing_comparison: any
          ratings_comparison: any
          views: number
          is_featured: boolean
          is_published: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string
          tool_a_id: string
          tool_b_id: string
          category_id?: string | null
          tool_a_notes?: string | null
          tool_b_notes?: string | null
          pros_a?: string[]
          pros_b?: string[]
          cons_a?: string[]
          cons_b?: string[]
          features_comparison?: any
          pricing_comparison?: any
          ratings_comparison?: any
          views?: number
          is_featured?: boolean
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          tool_a_id?: string
          tool_b_id?: string
          category_id?: string | null
          tool_a_notes?: string | null
          tool_b_notes?: string | null
          pros_a?: string[]
          pros_b?: string[]
          cons_a?: string[]
          cons_b?: string[]
          features_comparison?: any
          pricing_comparison?: any
          ratings_comparison?: any
          views?: number
          is_featured?: boolean
          is_published?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_tool_a_id_fkey"
            columns: ["tool_a_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparisons_tool_b_id_fkey"
            columns: ["tool_b_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparisons_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      tool_screenshots: {
        Row: {
          id: string
          tool_id: string
          url: string
          alt: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          tool_id: string
          url: string
          alt?: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          tool_id?: string
          url?: string
          alt?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_screenshots_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
