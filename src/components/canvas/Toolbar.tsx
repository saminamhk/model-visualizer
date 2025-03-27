import React, { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useNodeState } from "../../contexts/NodeStateContext";
import { useView } from "../../contexts/ViewContext";
import { ViewMap, views, ViewType } from "../views/views";
import IconExpand from "../icons/IconExpand";
import IconCollapse from "../icons/IconCollapse";
import IconArrowReturn from "../icons/IconArrowReturn";
import { InfoBadge } from "../controls/InfoBadge";
import IconQuestionCircle from "../icons/IconQuestionCircle";
import IconFile from "../icons/IconFile";
import { createPortal } from "react-dom";
import { ImportExportModal } from "../utils/ImportExportModal";
import { useContentModel } from "../../contexts/ContentModelContext";

export const Toolbar: React.FC = () => {
  const { expandedNodes, toggleNode, resetIsolation, includeRichText, setIncludeRichText } = useNodeState();
  const { currentView, setCurrentView } = useView();
  const { getNodes, fitView } = useReactFlow();
  const [isToggled, setIsToggled] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const { isInspectMode, exitInspectMode } = useContentModel();

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

  const handleViewChange = (viewId: keyof ViewMap) => {
    setCurrentView(views[viewId]);
    handleReset();
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

  const toolbarCheckbox = (onChange: () => void, content: React.ReactNode, checked: boolean, className?: string) => (
    <label className={`flex checkbox ml-3 ${className ?? ""}`}>
      <input type="checkbox" onChange={onChange} checked={checked} />
      <span className="checkmark purple mr-2"></span>
      <span className="text-sm">{content}</span>
    </label>
  );

  return (
    <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200">
      <div className="flex flex-col items-center caret-transparent">
        <div onClick={() => setIsToggled(!isToggled)} className={`select ${isToggled ? "open" : ""}`}>
          {currentView.label}
        </div>
        <div className={`options ${isToggled ? "block" : "hidden"} absolute top-[50px] z-1000 bg-white min-w-[150px]`}>
          {Object.entries(views).map(([k, v]) => (
            <div
              className={`option ${currentView === v ? "selected" : ""}`}
              onClick={() => {
                handleViewChange(k as ViewType);
                setIsToggled(false);
              }}
              key={k}
            >
              {v.label}
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
      {currentView.id === "default" && (
        <div className="flex items-center">
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
        </div>
      )}

      <div className="flex-1" />
      {isInspectMode && toolbarButton(
        exitInspectMode,
        <div className="flex items-center gap-2">
          <span>Exit Inspect Mode</span>
        </div>,
        "red",
      )}
      {!isInspectMode && toolbarButton(
        () => setShowImportExport(true),
        <div className="flex items-center gap-2">
          <span className="text-base pt-1">
            <IconFile />
          </span>
          <span>Import / Export</span>
        </div>,
        "purple",
      )}
      {/* portal to body to ensure the modal is rendered above the canvas */}
      {showImportExport && createPortal(
        <ImportExportModal onClose={() => setShowImportExport(false)} />,
        document.body,
      )}
    </div>
  );
};
