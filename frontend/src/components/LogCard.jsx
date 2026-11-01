import { Link } from "react-router-dom";

const LogCard = ({ log }) => {
  // Map local uploads paths to port 5000 backend
  const image = log.photos?.[0]
    ? (log.photos[0].startsWith("http") || log.photos[0].startsWith("data:")
      ? log.photos[0]
      : `http://localhost:5000${log.photos[0]}`)
    : "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

  const tags = Array.isArray(log.tags)
    ? log.tags
    : typeof log.tags === "string"
    ? log.tags.split(",")
    : [];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
      {/* Top Part */}
      <div>
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={log.title}
            className="w-full h-60 object-cover"
          />

          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow">
            ⭐ {log.rating || 5}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">
            {log.title}
          </h2>

          <p className="text-gray-500 mb-2">
            📍 {log.destination}
          </p>

          <p className="text-gray-400 text-sm mb-4">
            {log.dateOfTravel
              ? new Date(log.dateOfTravel).toLocaleDateString()
              : "Travel Date"}
          </p>

          <p className="text-gray-600 line-clamp-3 mb-4">
            {log.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-2 flex justify-between items-center border-t border-gray-50">
        <Link
          to={`/logs/${log._id}`}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition font-medium"
        >
          Read Story
        </Link>

        <span className="text-gray-400 font-semibold flex items-center gap-1 select-none">
          ❤️ {log.likes?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default LogCard;
