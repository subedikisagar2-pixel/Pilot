import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLogs = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/logs/user/${user._id}`);
        setLogs(res.data);
      } catch (err) {
        setError("Failed to load your travel logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserLogs();
  }, [user]);

  const handleDelete = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this travel log?")) {
      return;
    }
    try {
      await api.delete(`/logs/${logId}`);
      setLogs(logs.filter((log) => log._id !== logId));
    } catch (err) {
      alert("Failed to delete log");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading dashboard...</div>;
  }

  // Calculate stats
  const totalLogs = logs.length;
  const totalLikes = logs.reduce((acc, log) => acc + (log.likes?.length || 0), 0);
  const totalComments = logs.reduce((acc, log) => acc + (log.commentCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-500 object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome Back, {user?.name || "Traveler"} 👋
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your travel stories and adventures.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500">Travel Logs</h3>
            <p className="text-4xl font-bold mt-2 text-orange-500">{totalLogs}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500">Likes Received</h3>
            <p className="text-4xl font-bold mt-2 text-blue-500">{totalLikes}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-500">Comments</h3>
            <p className="text-4xl font-bold mt-2 text-green-500">{totalComments}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            to="/create-log"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            + Create New Log
          </Link>

          <Link
            to={`/profile/${user?._id}`}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition font-semibold"
          >
            View Profile
          </Link>
        </div>

        {/* Recent Logs */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Recent Travel Logs</h2>

          {logs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-10 text-center">
              <h3 className="text-xl font-semibold text-gray-600">No travel logs found</h3>
              <p className="text-gray-400 mt-2">Get started by creating your first story!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {logs.map((log) => {
                const imageUrl = log.photos?.[0]
                  ? (log.photos[0].startsWith("http") || log.photos[0].startsWith("data:")
                    ? log.photos[0]
                    : `http://localhost:5000${log.photos[0]}`)
                  : "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
                return (
                  <div
                    key={log._id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={imageUrl}
                        alt={log.title}
                        className="w-full h-56 object-cover"
                      />

                      <div className="p-6">
                        <h3 className="text-xl font-bold line-clamp-1">{log.title}</h3>
                        <p className="text-gray-500 mt-2">📍 {log.destination}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(log.dateOfTravel).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <div className="flex gap-3">
                        <Link
                          to={`/logs/${log._id}`}
                          className="flex-1 text-center bg-orange-100 text-orange-600 py-2 rounded-xl hover:bg-orange-200 transition font-medium"
                        >
                          View
                        </Link>
                        
                        <button
                          onClick={() => navigate(`/edit-log/${log._id}`)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition font-medium"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(log._id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
