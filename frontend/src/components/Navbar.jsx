import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    ...(user
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Create Log", path: "/create-log" },
          { name: "Profile", path: `/profile/${user._id}` },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
          >
            TravelLog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition ${
                  location.pathname === link.path
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
                  <img
                    src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-orange-500 object-cover"
                  />
                  <span className="font-medium text-gray-700 hover:text-orange-500">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <img
                      src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-orange-500 object-cover"
                    />
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-red-500 font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-orange-500">
                    Login
                  </Link>

                  <Link to="/register" onClick={() => setIsOpen(false)} className="text-orange-500 font-semibold">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
