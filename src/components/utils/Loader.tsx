import React from "react";

type LoaderProps = {
  title: string;
  message: string;
};

export const Loader: React.FC<LoaderProps> = ({ title, message }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-20 bg-white rounded-4xl shadow-2xl shadow-gray-200 text-center">
        <div className="text-4xl font-extralight text-gray-500 mb-10 caret-transparent">{title}</div>
        <div className="text-gray-600 mb-10 caret-transparent">{message}</div>
        <div className="w-10 h-10 border-4 border-t-4 border-t-[#5b4ff5] border-gray-300 rounded-full animate-spin mx-auto caret-transparent">
        </div>
      </div>
    </div>
  );
};
