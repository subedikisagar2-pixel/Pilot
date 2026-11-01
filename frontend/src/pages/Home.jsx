import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import LogCard from "../components/LogCard";

const mockFeaturedLogs = [
  {
    _id: "mock1",
    title: "Exploring Pokhara",
    destination: "Pokhara, Nepal",
    photos: ["https://images.unsplash.com/photo-1577717903315-1691ae25ab3f"],
    rating: 5,
    dateOfTravel: "2026-06-15",
    description: "Enjoying the serene Phewa lake and views of the beautiful Annapurna mountain range in Pokhara.",
    tags: ["adventure", "nature", "nepal"]
  },
  {
    _id: "mock2",
    title: "Adventure in Mustang",
    destination: "Mustang, Nepal",
    photos: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"],
    rating: 5,
    dateOfTravel: "2026-05-20",
    description: "Offroad road trip through high-altitude desert climates and ancient cultural monasteries in Upper Mustang.",
    tags: ["roadtrip", "trekking", "culture"]
  },
  {
    _id: "mock3",
    title: "Everest Base Camp Trek",
    destination: "Solukhumbu, Nepal",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"],
    rating: 5,
    dateOfTravel: "2026-04-10",
    description: "Trekking to the base of the world's highest peak, witnessing breathtaking Himalayan glaciers and views.",
    tags: ["trekking", "himalayas", "mountains"]
  },
];

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestLogs = async () => {
      try {
        const res = await api.get("/logs?limit=3");
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error("Error fetching latest logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestLogs();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = "/logs?limit=9";
      if (searchQuery.trim()) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }
      if (tagQuery.trim()) {
        url += `&tag=${encodeURIComponent(tagQuery)}`;
      }
      const res = await api.get(url);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Explore The World
          </h1>

          <p className="text-lg md:text-2xl max-w-3xl mb-8">
            Discover amazing destinations, share unforgettable journeys, and
            inspire fellow travelers.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/create-log"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition"
            >
              Create Travel Log
            </Link>

            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              placeholder="Tags (Adventure, Trekking...)"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={handleSearch}
              className="bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Logs */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          {searchQuery || tagQuery ? "Search Results" : "Featured Travel Stories"}
        </h2>

        {loading ? (
          <div className="text-center py-10">Loading stories...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {logs.length > 0
              ? logs.map((log) => <LogCard key={log._id} log={log} />)
              : mockFeaturedLogs.map((log) => <LogCard key={log._id} log={log} />)}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-20 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready To Share Your Journey?
          </h2>

          <p className="text-lg mb-8">
            Create beautiful travel stories and inspire thousands of travelers
            around the world.
          </p>

          <Link
            to="/create-log"
            className="bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Start Writing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
