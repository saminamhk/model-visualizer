import { ContentTypeModels } from "@kontent-ai/management-sdk";
import React from "react";

type SidebarProps = {
  types: Array<ContentTypeModels.ContentType>;
};

export const Sidebar: React.FC<SidebarProps> = ({ types }) => {
  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 p-2">Content Types</h2>
      <ul>
        {types.map((type) => (
          <li key={type.id} className="py-2 text-sm">
            {type.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
