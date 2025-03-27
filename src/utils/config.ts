import { LayoutConfig } from "./types/layout";

export const layoutConfig: Readonly<LayoutConfig> = {
  edgeType: "default",
  alignment: "UL",
  rankDirection: "LR",
  ranker: "network-simplex",
  acyclicer: "none",
  nodeSeparation: 60,
  rankSeparation: 200,
};
