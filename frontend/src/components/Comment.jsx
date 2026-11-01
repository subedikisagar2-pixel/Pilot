const Comment = ({ comment }) => {
  return (
    <div className="border-b border-gray-100 py-3">
      <strong className="text-sm">{comment.user?.name || "Unknown"}</strong>
      <p className="mt-1 text-gray-800">{comment.text}</p>
      <small className="text-gray-400">
        {new Date(comment.createdAt).toLocaleString()}
      </small>
    </div>
  );
};

export default Comment;
