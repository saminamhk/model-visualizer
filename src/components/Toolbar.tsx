import React, { useState } from "react";
import { useExpandedNodes } from "../contexts/ExpandedNodesContext";
import { useReactFlow } from "reactflow";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const Toolbar: React.FC<{ environmentId: string }> = ({ environmentId }) => {
  const { expandedNodes, toggleNode } = useExpandedNodes();
  const { getNodes, fitView, setNodes } = useReactFlow();
  const [isExporting, setIsExporting] = useState(false);

  const handleExpandCollapse = () => {
    const nodes = getNodes();
    const allExpanded = nodes.every(node => expandedNodes.has(node.id));

    nodes.forEach(node => {
      toggleNode(node.id, !allExpanded);
    });

    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleReset = () => {
    setNodes(nodes =>
      nodes.map(node => ({
        ...node,
        hidden: false,
      }))
    );

    expandedNodes.forEach(node => {
      toggleNode(node, false);
    });
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    const flowElement = document.querySelector(".react-flow") as HTMLElement;
    if (!flowElement) return;

    try {
      // Capture the canvas
      const canvas = await html2canvas(flowElement, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
      });

      // Create PDF and add the image
      new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      }).addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, "", "FAST")
        .save(`content-model-${environmentId}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const isAllExpanded = () => {
    const nodes = getNodes();
    return expandedNodes.size === nodes.length;
  };

  return (
    <div className="fixed left-64 right-0 top-0 h-[50px] bg-white border-b border-gray-200 flex items-center align px-8 gap-2">
      <div
        onClick={handleExpandCollapse}
        className="button secondary purple min-w-[150px] text-center"
      >
        {isAllExpanded() ? "Collapse All" : "Expand All"}
      </div>

      <div
        onClick={() => fitView({ duration: 800 })}
        className="button secondary purple"
      >
        Fit to View
      </div>

      <div
        onClick={handleReset}
        className="button secondary purple"
      >
        Reset View
      </div>
      {
        /* <label className="switch mx-2">
        <input
          type="checkbox"
          id="switch"
          checked={showAllToolbars}
          onChange={(e) => setShowAllToolbars(e.target.checked)}
        />
        <span className="slider purple"></span>
        <span className="text-sm mx-2">Show all node toolbars</span>

      </label> */
      }

      <div className="flex-1" />

      <label className="switch mr-10 disabled">
        <span className="text-sm mr-2">Edit mode</span>
        <input type="checkbox" id="switch" />
        <span className="slider purple"></span>
      </label>

      <div
        onClick={handleExport}
        className={`button min-w-[155px] text-center green ${isExporting ? "disabled" : ""}`}
      >
        {isExporting ? "Exporting..." : "Export to PDF"}
      </div>
    </div>
  );
};
