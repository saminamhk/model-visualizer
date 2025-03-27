import {
  ContentTypeElements,
  ContentTypeModels,
  ContentTypeSnippetModels,
  ManagementClient,
  TaxonomyModels,
} from "@kontent-ai/management-sdk";
import { AppError } from "../errors";

export type ContentType = ContentTypeModels.ContentType;

export type ContentGroup = ContentTypeModels.ContentTypeGroup;

export type Taxonomy = TaxonomyModels.Taxonomy;

export type Snippet = ContentTypeSnippetModels.ContentTypeSnippet;

export type Element = ContentTypeElements.ContentTypeElementModel;

export type SnippetElement = ContentTypeElements.ISnippetElement;

export type AnnotatedElement = Element & { fromSnippet: { id: string; name: string } | false };

export type NamedElement = Exclude<
  ContentTypeElements.ContentTypeElementModel,
  ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement
>;

export type RelationshipElement =
  | ContentTypeElements.ILinkedItemsElement
  | ContentTypeElements.ISubpagesElement
  | ContentTypeElements.IRichTextElement;

export type RequirableElement = Exclude<
  Element,
  ContentTypeElements.IGuidelinesElement | ContentTypeElements.ISnippetElement
>;

export type ElementType = Element["type"];

export type ResolvedType = Omit<ContentTypeModels.ContentType, "elements"> & {
  elements: AnnotatedElement[];
};

export type ElementTypeLabels = {
  [K in ElementType]: string;
};

export type Action = keyof Pick<ManagementClient, "listContentTypes" | "listContentTypeSnippets" | "listTaxonomies">;

export type ApiResponse<T> = {
  data?: T;
  error?: AppError;
};
