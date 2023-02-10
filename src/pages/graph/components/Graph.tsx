import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GraphContainer } from './GraphContainer';

const Graph: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <GraphContainer hideSourceOnDrag={true} />
    </DndProvider>
  );
};
export default Graph;
