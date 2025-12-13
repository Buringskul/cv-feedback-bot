import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Gradient overlay (keeps your original look) */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-purple-100/80 to-indigo-100/80" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Improve Your CV with AI
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Get instant, AI-powered feedback to strengthen your resume and
          optimize it for recruiters and ATS systems.
        </p>

        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            AI-Powered Analysis
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Instant Results
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Secure & Private
          </span>
        </div>
      </div>
    </section>
  );
}
