import React from "react";
import { SourceHandle } from "../controls/Handles";
import { AnnotatedElement, elementTypeMap } from "../../utils/mapi";
import { isRelationshipElement } from "../../utils/layout";
import { ContentTypeElements } from "@kontent-ai/management-sdk";
import IconAccordion from "../icons/IconAccordion";
import IconRotateDoubleRight from "../icons/IconRotateDoubleRight";
import { InfoBadge } from "../controls/InfoBadge";
import IconBracesOctothorpe from "../icons/IconBracesOctothorpe";

type NamedElement =
  | Exclude<
    AnnotatedElement,
    ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement
  >
  | ({
    name: string;
    fromSnippet: false;
  } & ContentTypeElements.ISnippetElement);

type ElementRowProps = {
  element: NamedElement;
  isLast: boolean;
  selfReferences: boolean;
};

const linkedItemConditionMap: ReadonlyMap<"at_least" | "at_most" | "exactly", string> = new Map([
  ["at_least", "At least"],
  ["at_most", "At most"],
  ["exactly", "Exactly"],
]);

export const ElementRow: React.FC<ElementRowProps> = ({ element, isLast, selfReferences }) => (
  <div
    className="flex items-center justify-between py-1 px-2 relative"
    style={{
      borderBottom: !isLast ? "1px solid #ddd" : "none",
    }}
  >
    <div className="font-bold text-xs">{element.name}</div>
    <span className="flex-1"></span>
    {element.fromSnippet && (
      <InfoBadge title={`This element comes from ${element.fromSnippet.name} snippet`} icon={<IconAccordion />} />
    )}
    {selfReferences && (
      <InfoBadge title={`This element can reference its own content type.`} icon={<IconRotateDoubleRight />} />
    )}
    {(element.type === "modular_content" || element.type === "subpages") && (
      element.item_count_limit && (
        <InfoBadge
          title={`${linkedItemConditionMap.get(element.item_count_limit.condition)} ${element.item_count_limit.value} ${
            element.item_count_limit.value === 1 ? "item" : "items"
          }`}
          icon={<IconBracesOctothorpe />}
        />
      )
    )}
    <div className="text-xs">
      {elementTypeMap.get(element.type) || element.type}
    </div>
    {isRelationshipElement(element) && <SourceHandle id={`source-${element.id}`} />}
  </div>
);
