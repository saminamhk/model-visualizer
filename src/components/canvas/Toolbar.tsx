import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { useEntities } from "../../contexts/EntityContext";
import { useNodeState } from "../../contexts/NodeStateContext";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useAppContext } from "../../contexts/AppContext";
export const Toolbar: React.FC = () => {
  const { expandedNodes, toggleNode, resetIsolation } = useNodeState();
  const { getNodes, fitView } = useReactFlow();
  const { showSnippets, toggleSnippets } = useEntities();
  const { customApp } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const environmentId = customApp.context.environmentId;

  const handleSnippetToggle = () => {
    toggleSnippets();
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleExpandCollapse = () => {
    const nodes = getNodes();
    const allExpanded = nodes.every(node => expandedNodes.has(node.id));
    nodes.forEach(node => toggleNode(node.id, !allExpanded));
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleReset = () => {
    resetIsolation();
    getNodes().forEach(node => toggleNode(node.id, false));
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const exportToPdf = async (flowElement: HTMLElement) => {
    const canvas = await html2canvas(flowElement, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
    });

    new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    })
      .addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, "", "FAST")
      .save(`content-model-${environmentId}.pdf`);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const flowElement = document.querySelector(".react-flow");
      if (flowElement) await exportToPdf(flowElement as HTMLElement);
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

  const toolbarButton = (onClick: () => void, title: string, icon: string) => (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-2 px-4 py-1 h-[50px] border-b border-gray-200">
      {toolbarButton(
        handleExpandCollapse,
        "Expand/Collapse All",
        isAllExpanded() ? "➖ Collapse All" : "➕ Expand All",
      )}
      {toolbarButton(handleReset, "Reset View", "🔄 Reset View")}
      {toolbarButton(handleExport, "Export to PDF", isExporting ? "⏳" : "📑 Export to PDF")}
      {toolbarButton(handleSnippetToggle, "Toggle Snippets", showSnippets ? "📌 Hide Snippets" : "📌 Show Snippets")}
    </div>
  );
};
