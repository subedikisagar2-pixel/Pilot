import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const EditLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    dateOfTravel: "",
    description: "",
    rating: 5,
    tags: "",
  });
  
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await api.get(`/logs/${id}`);
        const log = res.data.log;
        setForm({
          title: log.title,
          destination: log.destination,
          dateOfTravel: log.dateOfTravel ? log.dateOfTravel.slice(0, 10) : "",
          description: log.description,
          rating: log.rating,
          tags: log.tags ? log.tags.join(", ") : "",
        });
        if (log.photos && log.photos.length > 0) {
          setPreviews(
            log.photos.map((p) =>
              p.startsWith("http") || p.startsWith("data:") ? p : `http://localhost:5000${p}`
            )
          );
        }
      } catch (err) {
        setError("Could not load travel log");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }

    setError("");
    setPhotos(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      photos.forEach((file) => {
        data.append("photos", file);
      });

      await api.put(`/logs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/logs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update travel log");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading travel log details...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Edit Travel Log
              </h1>
              <p className="text-gray-500 mt-2">
                Update your travel story details and photos.
              </p>
            </div>
            
            <Link
              to="/dashboard"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block mb-2 font-semibold">Destination</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block mb-2 font-semibold">Travel Date</label>
              <input
                type="date"
                name="dateOfTravel"
                value={form.dateOfTravel}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-2 font-semibold">Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    ⭐ {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 font-semibold">Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="adventure, trekking, nature"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold">Travel Story</label>
              <textarea
                rows="6"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block mb-2 font-semibold">Replace Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-xl p-3"
              />
              <p className="text-sm text-gray-500 mt-2">
                Uploading new photos replaces existing ones. Maximum 5 photos.
              </p>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    className="h-32 w-full object-cover rounded-xl border"
                  />
                ))}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition disabled:bg-orange-300"
              >
                {submitting ? "Saving Changes..." : "Save Changes"}
              </button>
              
              <Link
                to={`/logs/${id}`}
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 rounded-xl transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLog;
