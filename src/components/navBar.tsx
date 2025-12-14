import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Analyze", path: "/index" },
    { name: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-[#0F172A]/80 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_4px_20px_rgba(0,0,0,0.45)]
      "
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO + TITLE */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.png"
            alt="TailorMyCV Logo"
            className="w-12 h-12 rounded-lg shadow-md"
          />
          <span
            className="
              text-2xl font-extrabold tracking-tight
              bg-gradient-to-r from-[#10B981] to-[#34D399]
              bg-clip-text text-transparent
            "
          >
            TailorMyCV
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                text-base font-medium transition-all
                ${
                  isActive(item.path)
                    ? "text-[#34D399] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#10B981] after:rounded"
                    : "text-white/70 hover:text-white"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP CTA */}
        <Link
          to="/index"
          className="
            hidden md:block text-base px-5 py-2.5 rounded-lg font-semibold
            bg-gradient-to-r from-[#10B981] to-[#34D399]
            text-[#0F172A] shadow-md
            hover:shadow-lg hover:shadow-[#10B981]/30 hover:scale-[1.03]
            transition-all
          "
        >
          Upload CV
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300
          ${open ? "max-h-96 py-4" : "max-h-0 py-0"}
        `}
      >
        <div className="flex flex-col items-center gap-6 bg-[#0F172A]/70 backdrop-blur-xl pb-6">

          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`
                text-lg font-medium transition-all
                ${
                  isActive(item.path)
                    ? "text-[#34D399] font-semibold underline underline-offset-4"
                    : "text-white/80 hover:text-white"
                }
              `}
            >
              {item.name}
            </Link>
          ))}

          {/* MOBILE CTA */}
          <Link
            to="/index"
            onClick={() => setOpen(false)}
            className="
              text-lg px-6 py-3 rounded-lg font-semibold
              bg-gradient-to-r from-[#10B981] to-[#34D399]
              text-[#0F172A] shadow-md
              hover:scale-[1.04] transition-all
            "
          >
            Upload CV
          </Link>
        </div>
      </div>
    </nav>
  );
};
