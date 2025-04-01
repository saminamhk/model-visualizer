import React, { useState, useRef, useEffect } from "react";
import { useContentModel } from "../../contexts/ContentModelContext";
import { useAppContext } from "../../contexts/AppContext";
import { mergeTypesWithSnippets } from "../../utils/mapi";

export const ImportExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<"import" | "export" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { contentTypes, taxonomies, snippets, importContentModel } = useContentModel();
  const { customApp } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      // automatically trigger import when file is selected
      handleImport(e.target.files[0]);
    }
  };

  const handleImport = (selectedFile: File | null = file) => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== "string") {
          throw new Error("Invalid file format");
        }

        const importedData = JSON.parse(result);
        console.log("Importing content model data:", importedData);

        if (
          !importedData.contentTypes || !importedData.snippets || !importedData.taxonomies
        ) {
          throw new Error("Invalid content model format");
        }

        const typesWithSnippets = mergeTypesWithSnippets(importedData.contentTypes, importedData.snippets);

        importContentModel({
          contentTypes: importedData.contentTypes,
          snippets: importedData.snippets,
          taxonomies: importedData.taxonomies,
          typesWithSnippets: typesWithSnippets,
        });

        // Close the modal after successful import
        onClose();
      } catch (err) {
        console.error("Import error:", err);
        setError(`Failed to import: ${err instanceof Error ? err.message : "Unknown error"}`);
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file");
      setIsImporting(false);
    };

    reader.readAsText(selectedFile);
  };

  const handleExport = () => {
    const exportData = {
      contentTypes,
      taxonomies,
      snippets,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const date = new Date().toISOString().slice(0, 16).replace("T", "-");
    link.download = `model-visualizer-export-${customApp.context.environmentId}-${date}UTC.json`;

    // append the link to the document, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // clean up the URL object
    URL.revokeObjectURL(url);
  };

  // click the hidden file input when import button is clicked
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-full z-1000
        transition-all duration-200 ease-in-out
        ${isVisible ? "bg-gray-100/80" : "bg-gray-100/0"}
      `}
    >
      <div
        className={`
          absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-1001
          transition-all duration-200 ease-in-out
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg w-xl mx-4">
          <button
            onClick={handleClose}
            className="top-2 right-7 absolute font-extrabold text-gray-400 text-2xl cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="text-xl font-extralight text-center caret-transparent">
            Choose an action
          </div>

          {error && <div className="text-red-500 text-sm text-center my-2">{error}</div>}

          {/* hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <div className="flex text-sm items-center justify-center min-h-[50px]">
            {hoveredAction === "import" && <span>Inspect content model from a JSON file.</span>}
            {hoveredAction === "export" && <span>Export content model to a JSON file.</span>}
            {isImporting && <span>Importing data, please wait...</span>}
          </div>

          <div className="flex justify-between">
            <button
              onMouseEnter={() => setHoveredAction("import")}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={triggerFileInput}
              disabled={isImporting}
              className={`!w-full button purple secondary m-2 ${isImporting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isImporting ? "Importing..." : "Import"}
            </button>
            <button
              onMouseEnter={() => setHoveredAction("export")}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={handleExport}
              className="!w-full button purple m-2"
            >
              Export
            </button>
          </div>
          {/* show the file name and continue button if automatic trigger failed for some reason */}
          {file && !isImporting && (
            <div className="text-center mt-4">
              <div className="text-sm text-gray-600 mb-2">
                Selected file: {file.name}
              </div>
              <button
                onClick={() => handleImport()}
                className="button purple small"
              >
                Continue with Import
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
