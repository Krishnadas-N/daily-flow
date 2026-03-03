import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useArchitectureStore } from "../store/useArchitectureStore";
import {
  Download,
  Upload,
  RefreshCw,
  X,
  Server,
  Layout as LayoutIcon,
  Database,
  Cpu,
  Image as ImageIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toPng } from "html-to-image";

type SubType = "frontend" | "backend" | "database" | "generic";

const NodeIcon = ({ type }: { type: SubType }) => {
  switch (type) {
    case "frontend":
      return <LayoutIcon size={14} className="text-blue-500" />;
    case "backend":
      return <Server size={14} className="text-emerald-500" />;
    case "database":
      return <Database size={14} className="text-amber-500" />;
    default:
      return <Cpu size={14} className="text-indigo-500" />;
  }
};

const getColors = (type: SubType) => {
  switch (type) {
    case "frontend":
      return "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-700 ring-blue-200";
    case "backend":
      return "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-700 ring-emerald-200";
    case "database":
      return "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-700 ring-amber-200";
    default:
      return "bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-700 ring-indigo-200";
  }
};

const ArchitectureNode = ({ data, id, selected }: NodeProps) => {
  const deleteNode = useArchitectureStore((state) => state.deleteNode);
  const updateNodeData = useArchitectureStore((state) => state.updateNodeData);

  const subType = (data.subType as SubType) || "generic";
  const colors = getColors(subType);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: evt.target.value });
    },
    [id, updateNodeData],
  );

  return (
    <div
      className={`group relative px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white ${
        selected ? `shadow-md ring-2 ${colors.split(" ").pop()}` : "shadow-sm"
      } ${colors.split("hover")[0]} hover:border-slate-400`}
      style={{
        borderColor: selected ? undefined : "rgb(226 232 240)", // Tailwinds slate-200
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <NodeIcon type={subType} />
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-80">
            {subType}
          </label>
        </div>
        <input
          className="bg-transparent border-none p-0 text-sm font-semibold text-slate-800 focus:ring-0 w-32 placeholder:text-slate-400"
          value={data.label as string}
          onChange={onChange}
          placeholder="Name..."
        />
      </div>

      <button
        onClick={() => deleteNode(id)}
        className="absolute -top-2 -right-2 p-1.5 bg-white text-rose-500 rounded-full border border-rose-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
      >
        <X size={12} />
      </button>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
    </div>
  );
};

const nodeTypes = {
  architectureNode: ArchitectureNode,
};

const ArchitectureCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearAll,
    setNodes,
    setEdges,
  } = useArchitectureStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: "architectureNode",
        position,
        data: { label: `New ${type}`, subType: type },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const exportData = useCallback(() => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `architecture-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const exportImage = useCallback(() => {
    const reactFlowElement = document.querySelector(
      ".react-flow",
    ) as HTMLElement;
    if (reactFlowElement) {
      toPng(reactFlowElement, {
        backgroundColor: "#f8fafc",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `architecture-${new Date().toISOString().split("T")[0]}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Failed to capture image", err);
          alert("Failed to export image.");
        });
    }
  }, []);

  const importData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = JSON.parse(e.target?.result as string);
            if (content.nodes && content.edges) {
              setNodes(content.nodes);
              setEdges(content.edges);
            }
          } catch (err) {
            console.error("Failed to parse", err);
            alert("Invalid architecture file");
          }
        };
        reader.readAsText(file);
      }
    },
    [setNodes, setEdges],
  );

  return (
    <div className="h-[calc(100vh-160px)] w-full bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">
      {/* Sidebar Palette */}
      <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4 z-10 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Blocks</h2>
          <p className="text-[10px] text-slate-500 font-medium mb-3">
            Drag components to canvas
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div
            onDragStart={(e) => onDragStart(e, "frontend")}
            draggable
            className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-blue-400 hover:shadow-sm transition-all shadow-sm"
          >
            <LayoutIcon size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-slate-700">Frontend</span>
          </div>
          <div
            onDragStart={(e) => onDragStart(e, "backend")}
            draggable
            className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-emerald-400 hover:shadow-sm transition-all shadow-sm"
          >
            <Server size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Backend</span>
          </div>
          <div
            onDragStart={(e) => onDragStart(e, "database")}
            draggable
            className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-amber-400 hover:shadow-sm transition-all shadow-sm"
          >
            <Database size={16} className="text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Database</span>
          </div>
          <div
            onDragStart={(e) => onDragStart(e, "generic")}
            draggable
            className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-indigo-400 hover:shadow-sm transition-all shadow-sm"
          >
            <Cpu size={16} className="text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Generic</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-200">
          <button
            onClick={exportImage}
            className="flex items-center gap-2 justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
          >
            <ImageIcon size={16} /> Save Image
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
          >
            <Download size={16} /> Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
          >
            <Upload size={16} /> Import JSON
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={importData}
            />
          </button>
          <button
            onClick={() => {
              if (confirm("Clear architecture?")) clearAll();
            }}
            className="flex items-center gap-2 justify-center p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium mt-2"
          >
            <RefreshCw size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="bg-slate-50"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color="#cbd5e1"
          />
          <Controls
            showInteractive={false}
            className="bg-white border-slate-200 shadow-sm rounded-lg"
          />
          <MiniMap
            nodeColor="#6366f1"
            maskColor="rgba(248, 250, 252, 0.7)"
            className="rounded-xl border border-slate-200 shadow-lg !bg-white"
          />

          <Panel
            position="bottom-center"
            className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-indigo-400"
          >
            {nodes.length} Components • {edges.length} Dependencies
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const ArchitecturePage = () => (
  <ReactFlowProvider>
    <ArchitectureCanvas />
  </ReactFlowProvider>
);

export default ArchitecturePage;
