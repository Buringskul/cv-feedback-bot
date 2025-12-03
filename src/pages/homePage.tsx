import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, LogIn } from "lucide-react";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load current user
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
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">

      {/* 🔥 Animated Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br 
                      from-primary/20 via-accent/20 to-primary-glow/20 
                      animate-gradient-xy" />

      {/* 🔷 Soft glowing radial effect */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-[120px]" />

      {/* 🌟 Main Content Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 
                      p-10 rounded-3xl shadow-2xl max-w-2xl text-center 
                      animate-fade-in">

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Welcome to 
          <span className="block bg-gradient-to-r from-primary to-accent 
                           bg-clip-text text-transparent mt-2">
            TailorMyCV
          </span>
        </h1>

        {/* Subtitle */}
        {!user ? (
          <p className="text-lg text-gray-800 max-w-lg mx-auto mb-10">
            Upload your resume and get instant AI-powered feedback with clear,
            actionable improvements — all in a few seconds.
          </p>
        ) : (
          <p className="text-lg text-gray-800 max-w-lg mx-auto mb-10">
            Welcome back, <span className="font-semibold text-black">{user.email}</span>!  
            Your next resume review is just one click away.
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-4 items-center">

          <Button
            size="lg"
            onClick={handleAnalyzeClick}
            className="text-lg px-10 py-6 flex items-center gap-2 
                       bg-gradient-to-r from-primary to-accent
                       hover:shadow-glow hover:scale-[1.03] transition-all"
          >
            <Upload className="h-5 w-5" />
            Analyze My Resume
          </Button>

          {!user && (
            <div className="flex gap-4 pt-4">
              <Button
                onClick={goToLogin}
                className="px-8 py-4 flex items-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Button>

              <Button
                variant="outline"
                onClick={goToSignup}
                className="px-8 py-4 border-white/30 text-black hover:bg-white/10"
              >
                Create Account
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
