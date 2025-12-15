import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, LogIn } from "lucide-react";
import { Navbar } from "@/components/navBar";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    loadUser();
  }, []);

  const handleAnalyzeClick = () => {
    if (!user) navigate("/signin");
    else navigate("/index");
  };

  const goToLogin = () => navigate("/signin");
  const goToSignup = () => navigate("/signup");

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* 🌌 Navy + Green Background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br
        from-[#0F172A] via-[#1E293B]/95 to-[#0F172A]/95
        animate-gradient-xy"
      />

      {/* Glowing Blobs */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[34rem] h-[34rem] bg-[#10B981]/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[34rem] h-[34rem] bg-[#34D399]/20 rounded-full blur-[160px]" />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 flex items-center justify-center pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-white space-y-14 animate-fade-in">

          {/* LOGO ADDED HERE */}
          <div className="flex justify-center">
            <img
              src="/src/assets/logo.png"
              alt="TailorMyCV Logo"
              className="w-24 h-24 rounded-2xl shadow-xl mb-3"
            />
          </div>

          {/* TITLE */}
          <div className="text-center space-y-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
              Welcome to
              <span className="block mt-1 bg-gradient-to-r 
                from-[#10B981] to-[#34D399]
                text-transparent bg-clip-text">
                TailorMyCV
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and receive AI-powered feedback with
              actionable insights to help you stand out and land the job
              you deserve.
            </p>

            {user && (
              <p className="text-white/75 text-lg">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col items-center gap-5 pt-2 w-full">
            <Button
              size="lg"
              onClick={handleAnalyzeClick}
              className="text-lg px-10 py-5 bg-gradient-to-r
                from-[#10B981] to-[#34D399]
                hover:scale-[1.04] transition-all duration-300
                shadow-[0_0_30px_rgba(16,185,129,0.25)]
                text-[#0F172A]
                rounded-xl w-full sm:w-auto"
            >
              <Upload className="h-5 w-5 mr-2" />
              Analyze My Resume
            </Button>

            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">

                {/* Sign In */}
                <Button
                  onClick={goToLogin}
                  className="px-8 py-4 text-base bg-white/10 hover:bg-white/20 
                    backdrop-blur-xl border border-white/20 rounded-lg text-white w-full sm:w-auto"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>

                {/* Sign Up */}
                <Button
                  variant="outline"
                  onClick={goToSignup}
                  className="px-8 py-4 text-base border-white/40 text-[#34D399]
                    hover:bg-white/10 backdrop-blur-xl rounded-lg w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>

          {/* TRUST INDICATORS */}
          <div className="pt-10 flex flex-wrap justify-center gap-6 sm:gap-10 text-white/60 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              AI-Powered Analysis
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
              Instant Results
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/70 animate-pulse" />
              Secure & Private
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HomePage;
