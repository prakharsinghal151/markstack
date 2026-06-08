import { Calendar, FileText } from "lucide-react";
import { AppContainer } from "@/components/layout/app-container";

export function Features() {
  return (
    <>
      <section id="features" className="py-16">
        <AppContainer className="space-y-16">
          {/* FEATURES (BENTO STYLE) */}
          <section>
            <div className="grid md:grid-cols-12 gap-6">
              {/* card */}
              <div className="md:col-span-4 p-6 sm:p-10 rounded-xl border bg-card hover:bg-accent/50 transition">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold">3 Creative tools</h3>
                </div>
                <p className="text-muted-foreground">
                  Visual canvas, markdown editor, and task planner in one place.
                </p>
              </div>

              {/* big feature */}
              <div className="md:col-span-8 p-6 sm:p-10 rounded-xl border bg-card flex flex-col gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Connected Ecosystem
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
                    Markdown to Blog Publishing
                  </h3>
                  <p className="text-muted-foreground mt-4 mb-6">
                    Transform your markdown documents into beautiful,
                    SEO-optimized blog posts with one click. Built-in syntax
                    highlighting, responsive design, and automatic table of
                    contents generation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Live Preview
                    </span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      SEO Optimized
                    </span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Code Highlighting
                    </span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Responsive Design
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="space-y-2">
                      <div className="text-primary"># My Blog Post</div>
                      <div className="text-muted-foreground">
                        Welcome to my markdown...
                      </div>
                      <div className="text-primary">```javascript</div>
                      <div className="text-accent-foreground">
                        const hello = "world";
                      </div>
                      <div className="text-primary">```</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="max-w-7xl mx-auto mb-32 grid md:grid-cols-12 gap-4 -mt-10">
            {/* BIG */}
            <div className="md:col-span-8 bg-card border border-border p-6 sm:p-8 rounded-xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Unified Workspace
              </h3>
              <p className="text-muted-foreground max-w-md">
                Markdown + canvas in one environment.
              </p>
            </div>

            {/* SIDE */}
            <div className="md:col-span-4 bg-card border border-border p-6 sm:p-8 rounded-xl">
              <h4 className="text-lg sm:text-xl font-bold mb-2">
                Blog Publishing
              </h4>
              <p className="text-sm text-muted-foreground">
                One-click deployment with SEO optimization.
              </p>
            </div>
          </section>

          {/* TODO PLANNER WITH DATES */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Todo Planner with Dates</h2>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Today
                    </span>
                    <span className="text-xs text-primary">Dec 15, 2024</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Complete blog post draft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-muted-foreground">
                        Team standup meeting
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Review pull requests</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Tomorrow
                    </span>
                    <span className="text-xs text-primary">Dec 16, 2024</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Start new project design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Client presentation prep</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Update documentation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      This Week
                    </span>
                    <span className="text-xs text-primary">Dec 20, 2024</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Sprint planning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Performance review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Deploy new features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CANVAS EXCALIDRAW */}
          <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold">
                Visual Canvas - Excalidraw Integration
              </h2>
            </div>

            <div className="bg-muted rounded-lg p-6 sm:p-8 min-h-[300px] sm:min-h-[400px] relative overflow-hidden">
              <div className="flex items-center justify-center h-full mt-20">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Interactive Canvas</h3>
                  <p className="text-muted-foreground max-w-md">
                    Draw diagrams, flowcharts, and mind maps with our integrated
                    Excalidraw canvas. Perfect for visual thinking and
                    collaborative design.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Real-time Collaboration
                    </span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Export Options
                    </span>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                      Excalidraw Support
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AppContainer>
      </section>
    </>
  );
}
