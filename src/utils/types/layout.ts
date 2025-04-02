import { Node } from "@xyflow/react";

/**
 * Configuration for layout settings.
 */
export type LayoutConfig = {
  /**
   * The style of the edge connecting nodes.
   *
   * - `default`: the standard curved edge.
   * - `straight`: a straight line between nodes.
   * - `smoothstep`: a smooth, stepped curve.
   * - `step`: a stepped edge with sharp corners.
   */
  edgeType: "default" | "straight" | "smoothstep" | "step";

  /**
   * Alignment for node placement within each rank.
   *
   * - `UL`: Align nodes to the upper left.
   * - `UR`: Align nodes to the upper right.
   * - `DL`: Align nodes to the lower left.
   * - `DR`: Align nodes to the lower right.
   */
  alignment: "UL" | "UR" | "DL" | "DR";

  /**
   * The primary direction in which the layout is organized.
   *
   * - `LR`: Left to Right layout (default).
   * - `TB`: Top to Bottom layout (may require repositioning node handles to top and bottom for better readability).
   */
  rankDirection: "TB" | "LR";

  /**
   * The algorithm used to assign ranks to nodes.
   *
   * - `network-simplex`: A fast algorithm suitable for many graphs.
   * - `tight-tree`: An algorithm that minimizes wasted space, forming a tree-like structure.
   * - `longest-path`: Ranks nodes based on the longest path in the graph.
   */
  ranker: "network-simplex" | "tight-tree" | "longest-path";

  /**
   * The strategy used to remove cycles from the graph.
   *
   * - `greedy`: A greedy approach to break cycles. May result in more compact but crowded graph.
   * - `none`: No cycle optimization. Results in clearer but more spread out graph.
   */
  acyclicer: "greedy" | "none";

  /**
   * Horizontal space between individual nodes.
   */
  nodeSeparation: number;

  /**
   * Vertical space between ranks (levels) of nodes.
   */
  rankSeparation: number;
};

export type NodeIsolation = {
  nodeId: string;
  mode: "related" | "single";
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type BaseCustomNode<T extends Record<string, unknown> = {}> =
  & Node<
    { label: string; id: string } & T
  >
  & {
    type: "contentType" | "snippet" | "taxonomy";
  };
