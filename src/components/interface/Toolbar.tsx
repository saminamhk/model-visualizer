import React, { useState, useCallback, useMemo } from "react";
import { useReactFlow, Node } from "@xyflow/react";
import { useCanvas } from "../../contexts/CanvasContext";
import { useView } from "../../contexts/ViewContext";
import { views, ViewType } from "../views/views";
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

type ToolbarProps = {
  currentNodes: Node[];
};

type ToolbarButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

type ToolbarCheckboxProps = {
  onChange: () => void;
  children: React.ReactNode;
  checked: boolean;
  className?: string;
};

const ToolbarButton = React.memo<ToolbarButtonProps>(({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 button ${className || "purple secondary"}`}
  >
    {children}
  </button>
));

const ToolbarCheckbox = React.memo<ToolbarCheckboxProps>(({ onChange, children, checked, className }) => (
  <label className={`flex checkbox ml-3 ${className || ""}`}>
    <input type="checkbox" onChange={onChange} checked={checked} />
    <span className="checkmark purple mr-2"></span>
    <span className="text-sm">{children}</span>
  </label>
));

export const Toolbar: React.FC<ToolbarProps> = ({ currentNodes }) => {
  const {
    expandedNodes,
    toggleNode,
    resetIsolation,
    includeRichText,
    setIncludeRichText,
  } = useCanvas();
  const { currentView, setCurrentView } = useView();
  const { getNodes, fitView } = useReactFlow();
  const { isInspectMode, exitInspectMode } = useContentModel();

  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const visibleNodes = useMemo(
    () => currentNodes.filter((node) => !node.hidden),
    [currentNodes],
  );

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
    (viewId: ViewType) => {
      setCurrentView(views[viewId]);
      handleReset();
      setIsViewMenuOpen(false);
    },
    [setCurrentView, handleReset],
  );

  const handleCheckboxChange = useCallback(() => {
    setIncludeRichText(!includeRichText);
    fitView({ duration: 800 });
  }, [setIncludeRichText, fitView, includeRichText]);

  return (
    <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200">
      <div className="relative flex flex-col items-center caret-transparent">
        <div
          onClick={() => setIsViewMenuOpen((prev) => !prev)}
          className={`select ${isViewMenuOpen ? "open" : ""}`}
        >
          {currentView.label}
        </div>
        {isViewMenuOpen && (
          <div className="options absolute top-[50px] z-1000 bg-white min-w-[150px]">
            {Object.entries(views).map(([key, view]) => (
              <div className="relative flex group" key={key}>
                <div
                  className={`flex-1 option ${currentView === view ? "selected" : ""}`}
                  onClick={() => handleViewChange(key as ViewType)}
                >
                  {view.label}
                </div>
                <div className="absolute left-[110%] text-xs bg-gray-800 p-2 rounded-md whitespace-nowrap text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {view.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToolbarButton
        onClick={handleExpandCollapse}
        className="purple secondary min-w-[170px]"
      >
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
        </div>
      </ToolbarButton>

      <ToolbarButton onClick={handleReset}>
        <div className="flex items-center gap-2">
          <IconArrowReturn />
          <span>Reset View</span>
        </div>
      </ToolbarButton>

      {currentView.id === "default" && (
        <div className="flex items-center">
          <ToolbarCheckbox
            onChange={handleCheckboxChange}
            checked={includeRichText}
          >
            Include rich text
          </ToolbarCheckbox>
          <InfoBadge
            title="Include relationships defined in rich text elements."
            icon={<IconQuestionCircle />}
            className="text-lg"
          />
        </div>
      )}

      <div className="flex-1" />

      {isInspectMode
        ? (
          <ToolbarButton onClick={exitInspectMode} className="red">
            <div className="flex items-center gap-2">
              <span>Exit Inspect Mode</span>
            </div>
          </ToolbarButton>
        )
        : (
          <ToolbarButton onClick={() => setShowImportExport(true)} className="purple">
            <div className="flex items-center gap-2">
              <span className="text-base pt-1">
                <IconFile />
              </span>
              <span>Import / Export</span>
            </div>
          </ToolbarButton>
        )}

      {showImportExport
        && createPortal(
          <ImportExportModal onClose={() => setShowImportExport(false)} />,
          document.body,
        )}
    </div>
  );
};
