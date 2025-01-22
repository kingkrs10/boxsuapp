const MessageSearch = ({ onSearch }) => {
    return (
      <input
        type="text"
        placeholder="Search messages..."
        onChange={(e) => onSearch(e.target.value)}
        className="px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };