import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateLog = () => {
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
  const navigate = useNavigate();

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

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      photos.forEach((file) => {
        data.append("photos", file);
      });

      const res = await api.post("/logs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/logs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create travel log");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              Create Travel Log
            </h1>

            <p className="text-gray-500 mt-2">
              Share your travel experience with the world.
            </p>
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
                placeholder="My Amazing Pokhara Adventure"
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
                placeholder="Pokhara, Nepal"
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
                placeholder="Tell your travel story..."
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block mb-2 font-semibold">Upload Photos</label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-xl p-3"
              />

              <p className="text-sm text-gray-500 mt-2">Maximum 5 photos</p>
            </div>

            {/* Preview */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    className="h-32 w-full object-cover rounded-xl"
                  />
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition"
            >
              Publish Travel Log
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLog;
