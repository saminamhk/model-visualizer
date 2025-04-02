import { CustomAppContext } from "@kontent-ai/custom-app-sdk";
import { SharedModels } from "@kontent-ai/management-sdk";

export type AppError = {
  body: string;
  statusCode: string | number;
  originalError?: unknown;
};

export type CustomAppError = Omit<Extract<CustomAppContext, { isError: true }>, "isError">;

export const createAppError = (
  body: string,
  statusCode: string | number,
  originalError?: unknown,
): AppError => ({ body, statusCode, originalError });

export const isAppError = (
  error: unknown,
): error is AppError => typeof error === "object" && error !== null && "body" in error && "statusCode" in error;

export const isKontentError = (
  error: unknown,
): error is SharedModels.ContentManagementBaseKontentError =>
  error instanceof SharedModels.ContentManagementBaseKontentError;

export const isCustomAppError = (error: unknown): error is CustomAppError => {
  return typeof error === "object" && error !== null && "description" in error && "code" in error;
};
