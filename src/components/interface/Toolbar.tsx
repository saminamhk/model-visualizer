import React, { useState, useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { useCanvas } from "../../contexts/CanvasContext";
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
import { delayTwoAnimationFrames } from "../../utils/layout";

export const Toolbar: React.FC = () => {
  const {
    expandedNodes,
    toggleNode,
    resetIsolation,
    includeRichText,
    setIncludeRichText,
  } = useCanvas();
  const { currentView, setCurrentView } = useView();
  const { getNodes, fitView } = useReactFlow();
  const [viewDropdownToggled, setViewDropdownToggled] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [hoveredView, setHoveredView] = useState<ViewType | null>(null);
  const { isInspectMode, exitInspectMode } = useContentModel();

  const visibleNodes = useMemo(
    () => getNodes().filter((node) => !node.hidden),
    [getNodes],
  );

  // Check if all visible nodes are expanded.
  const areNodesExpanded = useMemo(
    () => visibleNodes.every((node) => expandedNodes.has(node.id)),
    [visibleNodes, expandedNodes],
  );

  const handleExpandCollapse = useCallback(() => {
    visibleNodes.forEach((node) => toggleNode(node.id, !areNodesExpanded));
    delayTwoAnimationFrames(() => fitView({ duration: 800 }));
  }, [visibleNodes, areNodesExpanded, toggleNode, fitView]);

  const handleReset = useCallback(() => {
    resetIsolation();
    requestAnimationFrame(() => {
      getNodes().forEach((node) => toggleNode(node.id, false));
      requestAnimationFrame(() => fitView({ duration: 800 }));
    });
  }, [getNodes, toggleNode, resetIsolation, fitView]);

  const handleViewChange = useCallback(
    (viewId: keyof ViewMap) => {
      setCurrentView(views[viewId]);
      handleReset();
      setViewDropdownToggled(false);
    },
    [setCurrentView, handleReset],
  );

  const toolbarButton = useCallback((
    onClick: () => void,
    content: React.ReactNode,
    className?: string,
  ) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 button ${className || "purple secondary"}`}
    >
      {content}
    </button>
  ), []);

  const toolbarCheckbox = useCallback((
    onChange: () => void,
    content: React.ReactNode,
    checked: boolean,
    className?: string,
  ) => (
    <label className={`flex checkbox ml-3 ${className ?? ""}`}>
      <input type="checkbox" onChange={onChange} checked={checked} />
      <span className="checkmark purple mr-2"></span>
      <span className="text-sm">{content}</span>
    </label>
  ), []);

  return (
    <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200">
      <div className="flex flex-col items-center caret-transparent">
        <div
          onClick={() => setViewDropdownToggled(!viewDropdownToggled)}
          className={`select ${viewDropdownToggled ? "open" : ""}`}
        >
          {currentView.label}
        </div>
        <div
          className={`options ${
            viewDropdownToggled ? "block" : "hidden"
          } absolute top-[50px] z-1000 bg-white min-w-[150px]`}
        >
          {Object.entries(views).map(([k, v]) => (
            <div className="flex" key={k}>
              <div
                className={`flex-1 option ${currentView === v ? "selected" : ""}`}
                onClick={() => {
                  handleViewChange(k as ViewType);
                  setViewDropdownToggled(false);
                }}
                onMouseEnter={() => setHoveredView(k as ViewType)}
                onMouseLeave={() => setHoveredView(null)}
              >
                {v.label}
              </div>
              {hoveredView === k && (
                <div className="absolute left-[110%] text-xs bg-gray-800 p-2 rounded-md whitespace-nowrap text-white">
                  {v.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {toolbarButton(
        handleExpandCollapse,
        <div className="flex items-center gap-2 justify-around">
          {areNodesExpanded
            ? (
              <>
                <IconCollapse />
                <span>Collapse All</span>
              </>
            )
            : (
              <>
                <IconExpand />
                <span>Expand All</span>
              </>
            )}
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
      {isInspectMode
        && toolbarButton(
          exitInspectMode,
          <div className="flex items-center gap-2">
            <span>Exit Inspect Mode</span>
          </div>,
          "red",
        )}
      {!isInspectMode
        && toolbarButton(
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
      {showImportExport
        && createPortal(
          <ImportExportModal onClose={() => setShowImportExport(false)} />,
          document.body,
        )}
    </div>
  );
};
