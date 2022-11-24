import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {Stack} from '@fluentui/react'

import './Flow.css';

const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Smooth Transition' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'zoom-in' },
    position: { x: 100, y: 100 },
  },
  { id: '3', data: { label: 'zoom-out' }, position: { x: 400, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const SmoothTransition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const [rfInstance, setRfInstance] = useState(null);

  const { setViewport, zoomIn, zoomOut } = useReactFlow();

  const handleTransform = useCallback(() => {
    console.log("clicked home")
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (     
    <Stack verticalFill = {true}>
    <button onClick={() => zoomIn({ duration: 800 })}>zoom in</button>
    <button onClick={() => zoomOut({ duration: 800 })}>zoom out</button>
    <button onClick={handleTransform}>pan to center(0,0,1)</button>

    <div className="save__controls">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
      </div>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={setRfInstance}
      // onConnect={onConnect}
      fitView
      className="transition"
    >
      <Background />
      
    </ReactFlow>
    </Stack>
  );
};

export default () => (
  <ReactFlowProvider>
    <SmoothTransition />
  </ReactFlowProvider>
);
