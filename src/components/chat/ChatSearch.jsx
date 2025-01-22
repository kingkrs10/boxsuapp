const ChatSearch = ({ onSearch }) => {
    return (
      <div className="p-4 border-b">
        <Input
          type="search"
          placeholder="Search in conversation..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
      </div>
    );
  };