import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              TravelLog
            </h2>

            <p className="mt-4 text-slate-400">
              Share your adventures, inspire travelers, and explore the world
              through stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-orange-400 transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/create-log"
                  className="hover:text-orange-400 transition"
                >
                  Create Log
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-orange-400 transition"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>

            <ul className="space-y-3 text-slate-400">
              <li>Adventure</li>
              <li>Trekking</li>
              <li>Road Trips</li>
              <li>Nature</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>

            <ul className="space-y-3 text-slate-400">
              <li>📧 support@travellog.com</li>
              <li>📍 Pokhara, Nepal</li>
              <li>📱 +977-98XXXXXXXX</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TravelLog. All rights reserved.
          </p>

          <div className="flex gap-5 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-orange-400 transition"
            >
              Facebook
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-orange-400 transition"
            >
              Instagram
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-orange-400 transition"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
