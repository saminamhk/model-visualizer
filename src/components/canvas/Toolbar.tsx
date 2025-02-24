import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { useNodeState } from "../../contexts/NodeStateContext";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useAppContext } from "../../contexts/AppContext";
import IconExpand from "../icons/IconExpand";
import IconCollapse from "../icons/IconCollapse";
import IconArrowReturn from "../icons/IconArrowReturn";
import IconFilePdf from "../icons/IconFilePdf";

type ToolbarProps = {
  onToggleSnippets: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({ onToggleSnippets }) => {
  const { expandedNodes, toggleNode, resetIsolation } = useNodeState();
  const { getNodes, fitView } = useReactFlow();
  const { customApp } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const environmentId = customApp.context.environmentId;

  const handleSnippetToggle = () => {
    onToggleSnippets();
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 50);
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
      if (flowElement) {
        await exportToPdf(flowElement as HTMLElement);
      }
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

  const toolbarButton = (onClick: () => void, content: React.ReactNode, className?: string) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 button ${className || "purple secondary"}`}
    >
      {content}
    </button>
  );

  const toolbarCheckbox = (onClick: () => void, id: string, content: string, className?: string) => (
    <span className={`${className || ""}`}>
      <label className={`checkbox`}>
        <input type="checkbox" id={id} onClick={onClick} />
        <span className="checkmark"></span>
        <span>{content}</span>
      </label>
    </span>
  );

  return (
    <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200">
      {toolbarButton(
        handleExpandCollapse,
        <div className="flex items-center gap-2 justify-around">
          {isAllExpanded() ? <IconCollapse /> : <IconExpand />}
          <span>{isAllExpanded() ? "Collapse All" : "Expand All"}</span>
        </div>,
        "purple secondary min-w-[170px]",
      )}
      {toolbarButton(
        handleReset,
        <div className="flex items-center gap-2">
          <IconArrowReturn /> <span>Reset View</span>
        </div>,
      )}
      {toolbarCheckbox(
        handleSnippetToggle,
        "toggleSnippets",
        "Include Snippets",
        "pl-4 caret-transparent",
      )}
      <div className="flex-1">
      </div>
      {toolbarButton(
        handleExport,
        <div className="flex items-center gap-2">
          <span className="text-base pt-1">
            <IconFilePdf />
          </span>
          <span>{isExporting ? "Exporting..." : "Export to PDF"}</span>
        </div>,
        "green",
      )}
    </div>
  );
};
