import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { useNodeState } from "../../contexts/NodeStateContext";
import { useView } from "../../contexts/ViewContext";
import { VIEWS } from "../../types/views";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useAppContext } from "../../contexts/AppContext";
import IconExpand from "../icons/IconExpand";
import IconCollapse from "../icons/IconCollapse";
import IconArrowReturn from "../icons/IconArrowReturn";
import IconFilePdf from "../icons/IconFilePdf";
import { InfoBadge } from "../controls/InfoBadge";
import IconQuestionCircle from "../icons/IconQuestionCircle";

export const Toolbar: React.FC = () => {
  const { expandedNodes, toggleNode, resetIsolation, includeRichText, setIncludeRichText } = useNodeState();
  const { currentView, setCurrentView } = useView();
  const { getNodes, fitView } = useReactFlow();
  const { customApp } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const environmentId = customApp.context.environmentId;

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

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId as "default" | "snippet");
    handleReset();
  };

  const exportToPdf = async (flowElement: HTMLElement) => {
    setIsExporting(true);
    try {
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    const flowElement = document.querySelector(".react-flow") as HTMLElement;
    if (flowElement) {
      exportToPdf(flowElement);
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

  const toolbarCheckbox = (onClick: () => void, content: React.ReactNode, checked: boolean, className?: string) => (
    <label className={`flex checkbox ml-3 ${className ?? ""}`}>
      <input type="checkbox" onClick={onClick} checked={checked} />
      <span className="checkmark purple mr-2"></span>
      <span className="text-sm">{content}</span>
    </label>
  );

  return (
    <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200">
      <div className="flex flex-col items-center caret-transparent">
        <div onClick={() => setIsToggled(!isToggled)} className={`select ${isToggled ? "open" : ""}`}>
          {VIEWS.find(view => view.id === currentView)?.label}
        </div>
        <div className={`options ${isToggled ? "block" : "hidden"} absolute top-[50px] z-1000 bg-white min-w-[150px]`}>
          {VIEWS.map(view => (
            <div
              className={`option ${currentView === view.id ? "selected" : ""}`}
              onClick={() => {
                handleViewChange(view.id);
                setIsToggled(false);
              }}
              key={view.id}
            >
              {view.label}
            </div>
          ))}
        </div>
      </div>
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
        () => {
          setIncludeRichText(!includeRichText);
          fitView({ duration: 800 });
        },
        "Include rich text",
        includeRichText,
      )}
      <InfoBadge
        title="Include relationships defined in rich text elements."
        icon={<IconQuestionCircle />}
        className="text-lg"
      />
      <div className="flex-1" />
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
