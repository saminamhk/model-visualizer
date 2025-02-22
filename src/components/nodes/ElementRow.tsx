import React from "react";
import { SourceHandle } from "./Handles";
import { elementTypeMap } from "../../utils/mapi";
import { isRelationshipElement } from "../../utils/layout";
import { ContentTypeElements } from "@kontent-ai/management-sdk";

type NamedElement =
  | Exclude<
    ContentTypeElements.ContentTypeElementModel,
    ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement
  >
  | ({
    name: string;
  } & ContentTypeElements.ISnippetElement);

type ElementRowProps = {
  element: NamedElement;
  isLast: boolean;
};

export const ElementRow: React.FC<ElementRowProps> = ({ element, isLast }) => {
  return (
    <div
      className="flex items-center justify-between py-1 px-2 relative"
      style={{
        borderBottom: !isLast ? "1px solid #ddd" : "none",
      }}
    >
      <div className="font-bold text-xs">{element.name}</div>
      <div className="text-xs">
        {elementTypeMap.get(element.type) || element.type}
      </div>
      {isRelationshipElement(element) && <SourceHandle id={`source-${element.id}`} />}
    </div>
  );
};
