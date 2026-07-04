import { Search, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

const stats = [
  { value: "10,000+", label: "AI Tools" },
  { value: "500+", label: "Tutorials" },
  { value: "50K+", label: "Monthly Visitors" },
  { value: "4.9", label: "Rating" },
]

const floatingTools = [
  { name: "ChatGPT", color: "bg-emerald-500", delay: "animate-[float_3s_ease-in-out_infinite]" },
  { name: "Claude", color: "bg-orange-500", delay: "animate-[float-delayed_3.5s_ease-in-out_infinite]" },
  { name: "Midjourney", color: "bg-violet-500", delay: "animate-[float-slow_4s_ease-in-out_infinite]" },
]

const chartBars = [
  { height: 32, color: "bg-blue-200" },
  { height: 52, color: "bg-blue-300" },
  { height: 42, color: "bg-blue-400" },
  { height: 68, color: "bg-blue-500" },
  { height: 60, color: "bg-blue-400" },
  { height: 82, color: "bg-blue-500" },
  { height: 90, color: "bg-blue-600" },
  { height: 76, color: "bg-blue-500" },
  { height: 88, color: "bg-blue-600" },
  { height: 96, color: "bg-blue-600" },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pb-40 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Discover the Future of AI
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover, Compare & Master
              <br />
              the World&apos;s Best AI Tools
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground sm:mt-6">
              Explore AI tools, tutorials, comparisons and resources designed to
              help creators, developers, students and businesses work smarter.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-blue-500/20">
                <Sparkles className="h-4 w-4" />
                Explore AI Tools
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                <TrendingUp className="h-4 w-4" />
                Read Articles
              </Button>
            </div>

            <div className="mx-auto mt-10 max-w-xl lg:mx-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-36 text-sm shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button className="absolute right-1.5 top-1/2 h-11 -translate-y-1/2 px-5">
                  <ArrowUpRight className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
              <span className="font-medium text-foreground">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm transition-all duration-200 hover:border-primary hover:text-primary"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-xl shadow-blue-500/5">
                <div className="mb-5 flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      AI Tool Discovery
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      +28.5%
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    {chartBars.map((bar, index) => (
                      <div
                        key={index}
                        className={`${bar.color} w-full rounded-t-sm transition-all duration-500`}
                        style={{ height: `${bar.height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="text-xs text-muted-foreground">
                      Active Tools
                    </div>
                    <div className="mt-0.5 text-xl font-semibold text-foreground">
                      12,847
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-xs text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      +12.3%
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="text-xs text-muted-foreground">
                      Categories
                    </div>
                    <div className="mt-0.5 text-xl font-semibold text-foreground">
                      48
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-xs text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      +8.1%
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="text-xs text-muted-foreground">
                      Weekly Reviews
                    </div>
                    <div className="mt-0.5 text-xl font-semibold text-foreground">
                      2,431
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-xs text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      +5.7%
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="text-xs text-muted-foreground">
                      Avg. Rating
                    </div>
                    <div className="mt-0.5 text-xl font-semibold text-foreground">
                      4.8
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-xs text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      +0.2
                    </div>
                  </div>
                </div>
              </div>

              {floatingTools.map((tool, index) => {
                const positions = [
                  "-right-8 top-12",
                  "-left-8 bottom-32",
                  "-right-6 bottom-16",
                ]
                return (
                  <div
                    key={tool.name}
                    className={`absolute ${positions[index]} ${tool.delay} rounded-xl border border-border/60 bg-white px-4 py-2.5 shadow-lg`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${tool.color}`} />
                      <span className="text-sm font-medium text-foreground">{tool.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
