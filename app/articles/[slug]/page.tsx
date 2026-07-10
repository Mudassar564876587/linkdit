import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { notFound } from "next/navigation"
import Link from "next/link"
import { marked } from "marked"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SITE } from "@/constants/site"
import ArticleMeta from "@/components/articles/article-meta"
import ShareButtons from "@/components/articles/share-buttons"
import TableOfContents from "@/components/articles/table-of-contents"
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner"
import ArticleBookmarkButton from "@/components/articles/article-bookmark-button"
import { Calendar, Clock, ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react"
import BackNav from "@/components/ui/back-nav"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data: article } = await supabase
    .from("articles")
    .select("title, description, seo_title, seo_description, cover_image_url, slug, published_at, author_name")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!article) return { title: "Article not found" }

  const title = article.seo_title || article.title
  const description = article.seo_description || article.description

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "LinkDit",
      locale: "en_US",
      url: `/articles/${slug}`,
      publishedTime: article.published_at || undefined,
      authors: [article.author_name],
      images: article.cover_image_url ? [{ url: article.cover_image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data: rawArticle, error } = await supabase
    .from("articles")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !rawArticle) notFound()

  const article: any = rawArticle
  const { data: allPublished } = await supabase
    .from("articles")
    .select("id, title, slug, published_at")
    .eq("is_published", true)
    .eq("category_id", article.category_id)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  const currentIndex = allPublished?.findIndex((x) => x.id === article.id) ?? -1
  const prevArticle = currentIndex > 0 ? allPublished?.[currentIndex - 1] : null
  const nextArticle = currentIndex >= 0 && currentIndex < (allPublished?.length ?? 0) - 1 ? allPublished?.[currentIndex + 1] : null

  const { data: related } = await supabase
    .from("articles")
    .select("id, title, slug, description, cover_image_url, read_time, published_at, author_name, categories(name)")
    .eq("is_published", true)
    .eq("category_id", article.category_id)
    .neq("id", article.id)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3)

  const tags = Array.isArray(article.tags) ? article.tags : []

  const { data: { user: currentUser } } = await supabase.auth.getUser()
  let isArticleBookmarked = false
  if (currentUser) {
    const { data: abm } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("article_id", article.id)
      .maybeSingle()
    isArticleBookmarked = !!abm
  }

  const jsonLd = {
    "@context": "https://schemarticle.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: "LinkDit",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/articles/${slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <BackNav />

          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ChevronLeft className="h-4 w-4" /> Back to Articles
          </Link>

          <header className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {article.categories && (
                <Link href={`/articles?category=${article.categories.slug}`}
                  className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {article.categories.name}
                </Link>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight">
              {article.title}
            </h1>

            <ArticleMeta
              authorName={article.author_name}
              publishedAt={article.published_at}
              readTime={article.read_time}
            />
            <div className="mt-4">
              <ArticleBookmarkButton
                articleId={article.id}
                isBookmarked={isArticleBookmarked}
                isAuthenticated={!!currentUser}
              />
            </div>
          </header>

          {article.cover_image_url && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full object-cover"
                style={{ maxHeight: "500px" }}
              />
            </div>
          )}

          <div className="mt-10 grid gap-10 lg:grid-cols-[200px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                <TableOfContents content={article.content} />

                <ShareButtons
                  url={`${SITE.url}/articles/${slug}`}
                  title={article.title}
                />
              </div>
            </aside>

            <div className="min-w-0">
              <div
                className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-img:rounded-xl prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: article.content ? marked.parse(article.content) : "" }}
              />

              <div className="mt-10">
                <AdsterraNativeBanner />
              </div>

              {tags.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-sm font-semibold text-foreground mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, i: number) => (
                      <span key={i} className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 lg:hidden">
                <ShareButtons
                  url={`${SITE.url}/articles/${slug}`}
                  title={article.title}
                />
              </div>

              <div className="mt-10 rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary shrink-0">
                    {article.users?.avatar_url ? (
                      <img src={article.users.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      article.author_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{article.users?.full_name || article.author_name}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              </div>

              {(prevArticle || nextArticle) && (
                <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Previous and next articles">
                  {prevArticle ? (
                    <Link href={`/articles/${prevArticle.slug}`}
                      className="group flex flex-col gap-1 rounded-xl border border-border p-4 hover:bg-accent transition-colors">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowLeft className="h-3 w-3" /> Previous
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {prevArticle.title}
                      </span>
                    </Link>
                  ) : <div />}
                  {nextArticle ? (
                    <Link href={`/articles/${nextArticle.slug}`}
                      className="group flex flex-col gap-1 rounded-xl border border-border p-4 text-right hover:bg-accent transition-colors">
                      <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        Next <ArrowRight className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {nextArticle.title}
                      </span>
                    </Link>
                  ) : <div />}
                </nav>
              )}
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <section className="border-t border-border bg-secondary/50">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/articles/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                    {r.cover_image_url && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={r.cover_image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {r.published_at ? new Date(r.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {r.read_time}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  )
}
