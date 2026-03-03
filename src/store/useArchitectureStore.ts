import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, Connection } from '@xyflow/react';

interface ArchitectureState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  clearAll: () => void;
}

export const useArchitectureStore = create<ArchitectureState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, get().edges),
        });
      },
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      updateNodeData: (id, data) => set({
        nodes: get().nodes.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        }),
      }),
      deleteNode: (id) => set({
        nodes: get().nodes.filter((node) => node.id !== id),
        edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      }),
      clearAll: () => set({ nodes: [], edges: [] }),
    }),
    {
      name: 'architecture-storage',
    }
  )
);
