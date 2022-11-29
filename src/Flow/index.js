import React, { useState, useCallback } from 'react';
import Cursor from 'react-cursor-follow'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
  useReactFlow,
  useViewport 
} from 'reactflow';
import 'reactflow/dist/style.css';
import {Stack} from '@fluentui/react'

import './Flow.css';

const nodesKey = 'flow-nodes';
const mouseKey = 'flow-mouse';
const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  {
    id: '0',
    type: 'output',
    data: { label: 'Opens zoom client' },
    position: { x: 500, y: 0 },
  },
  {
    id: '1',
    type: 'output',
    data: { label: 'Starting meeting with oneself' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'click the recording button' },
    position: { x: 100, y: 200 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'display 3 second intro slide' },
    position: { x: 500, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'answer the midterm question' },
    position: { x: 500, y: 500 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'add subtitles' },
    position: { x: 100, y: 300 },
  },
  {
    id: '6',
    type: 'output',
    data: { label: 'accidentally not recording' },
    position: { x: 100, y: 400 },
  },
  {
    id: '9',
    type: 'output',
    data: { label: 'accidentally not sharing screen' },
    position: { x: 100, y: 500 },
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'accidentally not sharing audio' },
    position: { x: 100, y: 600 },
  },
  {
    id: '11',
    type: 'output',
    data: { label: 'focused on virtual meeting experience' },
    position: { x: 100, y: 700 },
  },
  {
    id: '12',
    type: 'output',
    data: { label: 'face is not clear/visible' },
    position: { x: 500, y: 300 },
  },
  {
    id: '13',
    type: 'output',
    data: { label: 'no way to mark up the screen while also interacting with screen' },
    position: { x: 1000, y: 0 },
  },
  {
    id: '14',
    type: 'output',
    data: { label: 'must add subtitles manually' },
    position: { x: 1000, y: 100 },
  },
  {
    id: '15',
    type: 'output',
    data: { label: 'unnecessary features for screen recording (e.g. breakout rooms)' },
    position: { x: 1000, y: 200 },
  },
  {
    id: '16',
    type: 'output',
    data: { label: 'layout suited for virtual meeting experience' },
    position: { x: 1000, y: 300 },
  },
  {
    id: '17',
    type: 'output',
    data: { label: 'recording start button hidden in menus' },
    position: { x: 1000, y: 400 },
  },
  { id: '7', 
  type: 'output', data: { label: 'no option to upload to canvas directly' }, position: { x: 500, y: 400 } },
];


const initialEdges = [
];

const SmoothTransition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const [rfInstance, setRfInstance] = useState(null);
  const [mouseInstance, setMouseInstance] = useState(null);

  // const onNodeMouseEnter = (() => {
  //   // const mouseLocation = {x: e.clientX, y: e.clientY, zoom: 1}
  //   const mouseLocation = useViewport();
  //   console.log(e)
  //   localStorage.setItem(mouseKey, JSON.stringify(mouseLocation));
  // }, [mouseInstance]);

  const Component = (props) => {
    return <Cursor />
  }  
  
  const mouseLocation = useViewport();

  const { setViewport, zoomIn, zoomOut } = useReactFlow();

  const recordMouseLocation = () => {
    localStorage.setItem(mouseKey, JSON.stringify(mouseLocation));
    console.log(mouseLocation)
  }

  const goToDefault = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  const goToOtherUser = useCallback(() => {
    const restoreMouse = async () => {
      const flow = JSON.parse(localStorage.getItem(mouseKey));
      setViewport(flow, { duration: 800 });
    };

    restoreMouse();
  }, [setViewport]);

  const onSave = useCallback(() => {
    console.log("called onSave");
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(nodesKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    console.log("called onRestore");
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(nodesKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        // setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes]);

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

  var red = "#ff0000";

  return (     
    <Stack verticalFill = {true}>
    <div className="zoom__controls">
      <button onClick={() => zoomIn({ duration: 800 })}>zoom in</button>
      <button onClick={() => zoomOut({ duration: 800 })}>zoom out</button>
      <button onClick={goToDefault}>pan to center(0,0,1)</button>
      <button onClick={goToOtherUser}>go to other user</button>
    </div>
    <div className="save_controls">
        {/* <button onClick={onSave}>save</button> */}
        {/* <button onClick={onRestore}>restore</button> */}
        <button onClick={onAdd}>add node</button>
      </div>
      <div>
        Zoom Value: {mouseLocation.zoom}
      </div>
      <div>
      <Cursor hollow duration={0.8} size={45} color={red}/>
      </div>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={recordMouseLocation}
      onNodeDragStop={onSave}
      onPaneMouseEnter={onRestore}
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