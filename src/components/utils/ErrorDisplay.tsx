import React from "react";

type ErrorDisplayProps = {
  description: string;
  code: string;
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ description, code }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center mb-6">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-semibold text-gray-800 ml-4">
            Something went wrong
          </h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            {description}
          </p>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-mono text-gray-500">
              Error code: {code}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="!w-full button orange"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
