import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navBar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/25 via-accent/20 to-primary-glow/25 animate-gradient-xy" />
      <div className="absolute top-[-4rem] left-[-4rem] w-96 h-96 bg-primary/40 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-4rem] right-[-4rem] w-96 h-96 bg-accent/40 rounded-full blur-[130px]" />

      <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
        <div className="text-center backdrop-blur-xl bg-white/10 border border-white/20 px-10 py-12 rounded-3xl shadow-2xl max-w-lg w-full">
          <h1 className="mb-3 text-6xl font-extrabold text-white">404</h1>
          <p className="mb-3 text-xl text-white/90">Oops! Page not found</p>
          <p className="mb-6 text-sm text-white/70">
            The page <span className="font-mono">{location.pathname}</span>{" "}
            doesn’t exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:scale-105 hover:shadow-glow transition"
          >
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
