const ErrorMessage = ({ error, onRetry }) => (
    <div className="p-4 bg-red-50 text-red-900 rounded-md">
      <p className="font-medium">Error: {error.message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm text-red-700 hover:text-red-900"
        >
          Try Again
        </button>
      )}
    </div>
  );