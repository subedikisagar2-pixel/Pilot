import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import LogCard from "../components/LogCard";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit profile modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch User Info
        const userRes = await api.get(`/auth/user/${userId}`);
        setProfileUser(userRes.data);

        // Fetch Logs
        const logsRes = await api.get(`/logs/user/${userId}`);
        setLogs(logsRes.data);
      } catch (err) {
        console.error(err);
        setError("Could not load traveler profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const openEditModal = () => {
    setEditForm({
      name: profileUser.name,
      bio: profileUser.bio || "",
      profilePicture: profileUser.profilePicture || "",
    });
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put("/auth/profile", editForm);
      setProfileUser({
        ...profileUser,
        name: res.data.name,
        bio: res.data.bio,
        profilePicture: res.data.profilePicture,
      });

      // Update global context user if editing own profile
      if (currentUser && currentUser._id === profileUser._id) {
        setCurrentUser({
          ...currentUser,
          name: res.data.name,
          bio: res.data.bio,
          profilePicture: res.data.profilePicture,
        });
      }
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading traveler profile...</div>;
  }

  if (error || !profileUser) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error || "Traveler profile not found"}
      </div>
    );
  }

  // Calculate live stats
  const totalLogs = logs.length;
  const totalLikes = logs.reduce((acc, log) => acc + (log.likes?.length || 0), 0);
  const totalComments = logs.reduce((acc, log) => acc + (log.commentCount || 0), 0);

  const isOwnProfile = currentUser && currentUser._id === profileUser._id;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Banner */}
      <div
        className="h-72 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-20">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <img
                src={profileUser.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={profileUser.name}
                className="w-36 h-36 rounded-full border-4 border-orange-500 object-cover"
              />

              {/* User Info */}
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl font-bold text-slate-800">
                  {profileUser.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {profileUser.bio || "Passionate explorer sharing travel stories."}
                </p>

                {isOwnProfile && (
                  <button
                    onClick={openEditModal}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-orange-50 rounded-2xl p-6 text-center">
                <h3 className="text-gray-500 font-medium">Travel Logs</h3>
                <p className="text-4xl font-bold text-orange-500 mt-2">
                  {totalLogs}
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <h3 className="text-gray-500 font-medium">Likes Received</h3>
                <p className="text-4xl font-bold text-blue-500 mt-2">
                  {totalLikes}
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <h3 className="text-gray-500 font-medium">Comments</h3>
                <p className="text-4xl font-bold text-green-500 mt-2">
                  {totalComments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Logs */}
        <div className="mt-12 mb-20">
          <h2 className="text-3xl font-bold mb-6">Travel Stories by {profileUser.name}</h2>

          {logs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-10 text-center">
              <h3 className="text-xl font-semibold text-gray-600">
                No travel logs yet
              </h3>
              <p className="text-gray-400 mt-2">
                Stay tuned for upcoming adventure logs!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {logs.map((log) => (
                <LogCard key={log._id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 font-sans">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-2 font-semibold">Bio</label>
                <textarea
                  rows="3"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-medium"
                />
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block mb-2 font-semibold">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <img
                    src={editForm.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-grow bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:bg-orange-300"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-grow bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
