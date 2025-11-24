import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, LogOut, FileText } from "lucide-react";

interface ResumeRecord {
  id: string;
  file_name: string;
  score: number;
  created_at: string;
  download_url: string; // You will fill this later when connecting Supabase storage
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

    // Mock history (replace with Supabase query later)
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
    <div className="min-h-screen px-6 py-12 container max-w-3xl mx-auto">

      {/* Header Section */}
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Stats Section */}
      <div className="bg-card p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Activity</h2>
        <p className="text-lg">
          You have analyzed 
          <span className="font-bold text-primary"> {history.length} resumes</span>.
        </p>
      </div>

      {/* History Section */}
      <div className="bg-card p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Previous Analyses</h2>

        {history.length === 0 ? (
          <p className="text-muted-foreground">No resume analyses yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/10 transition"
              >
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {item.file_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Score: {item.score} • {item.created_at}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => window.open(item.download_url, "_blank")}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-12 flex justify-center">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
