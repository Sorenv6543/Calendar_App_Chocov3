<template>
    <div class="vue-flow-wrapper">
      <VueFlow v-model="elements" @connect="onConnect" @nodeclick="onNodeClick">
        <Background pattern-color="#aaa" :gap="8" />
        <MiniMap />
        <Controls />
      </VueFlow>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { VueFlow, Background, Controls, MiniMap, useVueFlow } from '@vue-flow/core';
  import '@vue-flow/core/dist/style.css';
  import '@vue-flow/core/dist/theme-default.css';
  import '@vue-flow/minimap/dist/style.css';
  import '@vue-flow/controls/dist/style.css';
  
  const { findNode, addEdges } = useVueFlow();
  const elements = ref([]);
  
  onMounted(() => {
    // Initialize with some nodes and edges
    elements.value = [
      // Nodes
      {
        id: '1',
        type: 'input',
        label: 'Start Process',
        position: { x: 250, y: 5 },
        data: { description: 'Initial state of the process' }
      },
      {
        id: '2',
        label: 'Decision Point',
        position: { x: 250, y: 100 },
        data: { description: 'Evaluate conditions' }
      },
      {
        id: '3',
        label: 'Task A',
        position: { x: 100, y: 200 },
        data: { description: 'Execute Task A', status: 'pending' }
      },
      {
        id: '4',
        label: 'Task B',
        position: { x: 400, y: 200 },
        data: { description: 'Execute Task B', status: 'in-progress' }
      },
      {
        id: '5',
        type: 'output',
        label: 'Complete',
        position: { x: 250, y: 350 },
        data: { description: 'Process completed', status: 'completed' }
      },
      
      // Edges
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', label: 'Option A' },
      { id: 'e2-4', source: '2', target: '4', label: 'Option B' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-5', source: '4', target: '5' }
    ];
  });
  
  // Handle new connections
  const onConnect = (params) => {
    addEdges([{
      ...params,
      animated: true,
      id: `e${params.source}-${params.target}`
    }]);
  };
  
  // Handle node click events
  const onNodeClick = (event, node) => {
    console.log('Node clicked:', node);
    // You could update node status or trigger other actions here
  };
  </script>
  
  <style scoped>
  .vue-flow-wrapper {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>