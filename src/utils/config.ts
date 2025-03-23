type LayoutConfig = {
  edgeType: "default" | "straight" | "smoothstep" | "step";
  alignment: "UL" | "UR" | "DL" | "DR";
  rankDirection: "TB" | "LR";
  ranker: "network-simplex" | "tight-tree" | "longest-path";
  acyclicer: "greedy" | "none";
  nodeSeparation: number;
  rankSeparation: number;
  baseNodeWidth: number;
  baseNodeHeight: number;
};

export const layoutConfig: Readonly<LayoutConfig> = {
  edgeType: "default",
  alignment: "UL",
  rankDirection: "LR",
  ranker: "network-simplex",
  acyclicer: "greedy",
  nodeSeparation: 60,
  rankSeparation: 200,
  baseNodeWidth: 172,
  baseNodeHeight: 76,
};
