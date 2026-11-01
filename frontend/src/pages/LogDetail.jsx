import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const LogDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [log, setLog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [mainImage, setMainImage] = useState("");

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const getFullImgUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    return path.startsWith("http") || path.startsWith("data:")
      ? path
      : `http://localhost:5000${path}`;
  };

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await api.get(`/logs/${id}`);
        const fetchedLog = res.data.log;
        if (fetchedLog.photos) {
          fetchedLog.photos = fetchedLog.photos.map(getFullImgUrl);
        }
        setLog(fetchedLog);
        setComments(res.data.comments || []);
        
        setMainImage(fetchedLog.photos?.[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb");

        if (user && fetchedLog.likes) {
          setLiked(fetchedLog.likes.includes(user._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this travel log!");
      return;
    }
    try {
      const res = await api.put(`/logs/${id}/like`);
      setLiked(res.data.liked);
      setLog((prev) => ({
        ...prev,
        likes: res.data.liked
          ? [...(prev.likes || []), user._id]
          : (prev.likes || []).filter((uid) => uid !== user._id),
      }));
    } catch (err) {
      console.error("Error liking log:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/comments/${id}`, { text: commentText });
      setComments([res.data, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading travel story...</div>;
  }

  if (!log) {
    return <div className="text-center py-20 text-red-500 font-semibold">Log not found</div>;
  }

  const tags = Array.isArray(log.tags)
    ? log.tags
    : typeof log.tags === "string"
      ? log.tags.split(",")
      : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <div className="h-[500px] overflow-hidden relative">
        <img
          src={mainImage}
          alt={log.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white max-w-4xl">
          <p className="text-orange-400 font-semibold uppercase tracking-wider mb-2">📍 {log.destination}</p>
          <h1 className="text-4xl md:text-6xl font-bold">{log.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-block mb-6 text-orange-500 hover:text-orange-600 font-semibold"
        >
          ← Back to home
        </Link>

        {/* main Story Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={log.user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={log.user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <p className="font-semibold text-slate-800">{log.user?.name || "Traveler"}</p>
                <p className="text-sm text-gray-500">
                  Published {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-6 text-gray-500 mt-4 md:mt-0 font-medium">
              <span>📅 Travelled on: {new Date(log.dateOfTravel).toLocaleDateString()}</span>
              <span>⭐ {log.rating}/5 Rating</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Story Description */}
          <div className="prose max-w-none">
            <p className="text-lg leading-8 text-gray-700 whitespace-pre-wrap">
              {log.description}
            </p>
          </div>

          {/* Photo Gallery thumbnails */}
          {log.photos && log.photos.length > 1 && (
            <div className="mt-10 border-t pt-8">
              <h3 className="text-xl font-bold mb-4 text-slate-800">Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {log.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className={`h-24 w-full object-cover rounded-xl border-2 transition cursor-pointer ${
                      mainImage === photo ? "border-orange-500 scale-105" : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setMainImage(photo)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action buttons (Like) */}
          <div className="mt-8 pt-6 border-t flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                liked
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200"
              }`}
            >
              ❤️ {liked ? "Liked" : "Like"} ({log.likes?.length || 0})
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts about this journey..."
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:bg-orange-300"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="bg-orange-50 rounded-2xl p-4 mb-8 text-center text-orange-700">
              Please{" "}
              <Link to="/login" className="underline font-semibold">
                login
              </Link>{" "}
              to join the discussion and post a comment.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4 border-b pb-5 last:border-0 last:pb-0">
                  <img
                    src={comment.user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={comment.user?.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="flex gap-3 items-center">
                      <span className="font-semibold text-slate-800">{comment.user?.name || "Traveler"}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetails;
