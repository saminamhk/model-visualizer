import React from "react";

type LoaderProps = {
  title: string;
  message: string;
};

export const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold p-5">{props.title}</h2>
      <p className="pb-12">{props.message}</p>
      <div className="loader"></div>
    </div>
  );
};
