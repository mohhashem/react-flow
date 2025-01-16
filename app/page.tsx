"use client";

import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
} from "react-flow-renderer";
import { Box, IconButton, Drawer, Tabs, Tab } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import SidePanel from "./components/SidePanel";

export interface NodeData {
  name?: string;
  habit?: string;
  type: string;
}

export interface CustomNode extends Node<NodeData> {
  position: { x: number; y: number };
}

const Home: React.FC = () => {
  const [textfieldNodes, setTextfieldNodes] = useState<CustomNode[]>([]);
  const [selectNodes, setSelectNodes] = useState<CustomNode[]>([]);
  const [textfieldEdges, setTextfieldEdges] = useState<Edge[]>([]);
  const [selectEdges, setSelectEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleNodeClick = (event: React.MouseEvent, node: Node<unknown>) => {
    setSelectedNode(node as CustomNode);
    setDrawerOpen(true);
  };

  const handleAddNode = (data: NodeData) => {
    const newNode: CustomNode = {
      id: `${
        (data.type === "textfield" ? textfieldNodes : selectNodes).length + 1
      }`,
      type: data.type,
      data,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    if (data.type === "textfield" && textfieldNodes.length < 20) {
      setTextfieldNodes((nds) => [...nds, newNode]);
      if (textfieldNodes.length > 0) {
        setTextfieldEdges((eds) =>
          addEdge(
            {
              id: `e${textfieldNodes[textfieldNodes.length - 1].id}-${
                newNode.id
              }`,
              source: textfieldNodes[textfieldNodes.length - 1].id,
              target: newNode.id,
            },
            eds
          )
        );
      }
    } else if (data.type === "select" && selectNodes.length < 20) {
      setSelectNodes((nds) => [...nds, newNode]);
      if (selectNodes.length > 0) {
        setSelectEdges((eds) =>
          addEdge(
            {
              id: `e${selectNodes[selectNodes.length - 1].id}-${newNode.id}`,
              source: selectNodes[selectNodes.length - 1].id,
              target: newNode.id,
            },
            eds
          )
        );
      }
    }

    setDrawerOpen(false);
  };

  const handleSaveNode = (data: NodeData) => {
    if (selectedNode) {
      const updatedNode = { ...selectedNode, data };
      if (data.type === "textfield") {
        setTextfieldNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === selectedNode.id ? updatedNode : node
          )
        );
      } else if (data.type === "select") {
        setSelectNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === selectedNode.id ? updatedNode : node
          )
        );
      }
    }

    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(false);
    setSelectedNode(null);
  };

  const handleNodesChange: OnNodesChange = (changes) => {
    if (activeTab === 0) {
      setTextfieldNodes((prevNodes) =>
        prevNodes.map((node) => {
          const change = changes.find(
            (c) => c.type === "position" && "id" in c && c.id === node.id
          );
          return change && "position" in change
            ? { ...node, position: { ...node.position, ...change.position } }
            : node;
        })
      );
    } else {
      setSelectNodes((prevNodes) =>
        prevNodes.map((node) => {
          const change = changes.find(
            (c) => c.type === "position" && "id" in c && c.id === node.id
          );
          return change && "position" in change
            ? { ...node, position: { ...node.position, ...change.position } }
            : node;
        })
      );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px", zIndex: 1000 }}
        onClick={() => setDrawerOpen(true)}
      >
        <ArrowForwardIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
      >
        <SidePanel
          onSubmit={selectedNode ? handleSaveNode : handleAddNode}
          selectedNode={selectedNode}
          isEditMode={!!selectedNode}
          activeTab={activeTab}
        />
      </Drawer>

      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="Text Fields" />
          <Tab label="Selects" />
        </Tabs>

        {activeTab === 0 && (
          <ReactFlow
            nodes={textfieldNodes.map((node) => ({
              ...node,
              data: { label: node.data.name },
            }))}
            edges={textfieldEdges}
            onNodeClick={handleNodeClick}
            onNodesChange={handleNodesChange}
          >
            <Background />
            <Controls />
          </ReactFlow>
        )}

        {activeTab === 1 && (
          <ReactFlow
            nodes={selectNodes.map((node) => ({
              ...node,
              data: { label: node.data.habit || "Unselected" },
            }))}
            edges={selectEdges}
            onNodeClick={handleNodeClick}
            onNodesChange={handleNodesChange}
          >
            <Background />
            <Controls />
          </ReactFlow>
        )}
      </Box>
    </Box>
  );
};

export default Home;
