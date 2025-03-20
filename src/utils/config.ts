type LayoutConfig = {
  edgeType: "default" | "straight" | "smoothstep" | "step";
  alignment: "UL" | "UR" | "DL" | "DR";
  rankDirection: "TB" | "LR";
  ranker: "network-simplex" | "tight-tree" | "longest-path";
  acyclicer: "greedy" | "none";
  nodeSeparation: number;
  rankSeparation: number;
  nodeWidth: number;
  baseNodeHeight: number;
  elementHeight: number;
};

export const layoutConfig: Readonly<LayoutConfig> = {
  edgeType: "default",
  alignment: "UL",
  rankDirection: "LR",
  ranker: "network-simplex",
  acyclicer: "greedy",
  nodeSeparation: 100,
  rankSeparation: 200,
  nodeWidth: 172,
  baseNodeHeight: 76,
  elementHeight: 24,
};
