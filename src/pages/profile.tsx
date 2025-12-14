import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, LogOut, FileText } from "lucide-react";
import { Navbar } from "@/components/navBar";

interface ResumeRecord {
  id: string;
  file_name: string;
  score: number;
  created_at: string;
  download_url: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<ResumeRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/signin");
        return;
      }
      setUser(data.user);
    };

    // Mock Data
    const mockHistory: ResumeRecord[] = [
      {
        id: "1",
        file_name: "Edison_CV.pdf",
        score: 87,
        created_at: "2025-02-12",
        download_url: "/downloads/analysis_1.json",
      },
      {
        id: "2",
        file_name: "Edison_Updated_CV.pdf",
        score: 92,
        created_at: "2025-02-18",
        download_url: "/downloads/analysis_2.json",
      },
    ];

    setHistory(mockHistory);
    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Navy + Green Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br 
        from-[#0F172A]/85 via-[#1E293B]/95 to-[#0F172A]/85 animate-gradient-xy" />

      {/* Soft Green Glows */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[34rem] h-[34rem] 
        bg-[#10B981]/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[34rem] h-[34rem] 
        bg-[#34D399]/20 rounded-full blur-[150px]" />

      <main className="flex-1 px-6 pt-32 pb-24 flex items-start">
        <div className="max-w-5xl mx-auto space-y-12 text-white animate-fade-in">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Your Profile
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Signed in as <span className="font-semibold">{user?.email}</span>
              </p>
            </div>

            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 
                text-white px-6 py-3 rounded-xl text-lg shadow-lg shadow-red-900/40"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </div>

          {/* STATS */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Resumes analyzed",
                value: history.length,
              },
              {
                label: "Best score",
                value: history.length
                  ? Math.max(...history.map((h) => h.score))
                  : "--",
              },
              {
                label: "Last update",
                value: history.length
                  ? history[history.length - 1].created_at
                  : "--",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 
                  rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              >
                <p className="text-base text-white/70">{stat.label}</p>
                <p className="text-4xl font-bold mt-1 text-[#34D399]">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          {/* HISTORY */}
          <section className="backdrop-blur-xl bg-white/5 border border-white/10 
            rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold">Previous Analyses</h2>
              <p className="text-base text-white/70">
                Track your improvement over time.
              </p>
            </div>

            {history.length === 0 ? (
              <p className="text-white/70 text-lg">
                You haven’t analyzed any resumes yet.
              </p>
            ) : (
              <div className="space-y-5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4 md:items-center 
                      md:justify-between p-5 rounded-xl 
                      bg-white/10 border border-white/10 
                      hover:bg-white/15 transition"
                  >
                    <div className="flex items-start gap-4">
                      <FileText className="h-7 w-7 text-[#34D399]" />
                      <div>
                        <h3 className="text-lg font-medium">{item.file_name}</h3>
                        <p className="text-sm text-white/70">
                          Score: <span className="font-semibold">{item.score}</span> • {item.created_at}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="flex gap-2 border-white/40 text-[#127a54] 
                        hover:bg-white/10 text-base px-6 py-2 rounded-lg"
                      onClick={() => window.open(item.download_url, "_blank")}
                    >
                      <Download className="h-5 w-5" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
