/**
 * Main Graph component
 * Creates and sets all the global props that go into Context wrappers
 */

import React, { useContext, useEffect, useRef, useState } from 'react';

import router, { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../backend/driver/fetcher';
import DrawingContext from '../context/GraphDrawingContext';
import GraphViewContext from '../context/GraphViewContext';
import { BoxDragLayer } from '../helpers/BoxDragLayer';
import { handleDrawingHotkey } from '../hooks/drawing/useDrawingEnd';
import { GraphContainer } from './GraphContainer';
import ViewContext, {
  ViewContextInterface,
} from '../../../components/context/ViewContext';
import { getTags } from '../../../helpers/backend/gettersConnectionInfo';
import SplitPaneContext, {
  SplitPaneContextInterface,
} from '../../../components/organisms/split-pane/SplitPaneContext';
import { ConnectionData, GraphNodeData, NodeData } from '../graphTypes';
import { Alert } from '../../../components/organisms/Alert';
import { Divider } from '@udecode/plate';
import TextButton from '../../../components/molecules/TextButton';
import SplitPane, {
  SplitPaneLeft,
  SplitPaneRight,
} from '../../../components/organisms/split-pane/SplitPane';
import EditorComponent from '../../editor/EditorComponent';
import GraphSideTabs from '../../../components/organisms/Tabs/GraphSideTabs';

const Graph: React.FC<{
  viewId: string;
}> = ({ viewId }) => {
  if (!document || !window) return <div></div>;

  const { nodeId, username } = useContext(ViewContext) as ViewContextInterface;

  const { data, error, isLoading } = useSWR(
    nodeId ? `/api/${username}/${nodeId}/graph/${viewId}` : null,
    fetcher
  );

  let nodeData: { [key: string]: NodeData } = {};
  let visualData: { [key: string]: GraphNodeData } = {};

  if (!isLoading) {
    console.log('data');
    console.log(data);

    for (let node in data) {
      let nodeConnections: { [key: string]: ConnectionData } = {};
      for (let connection in data[node].connections) {
        nodeConnections[data[node].connections[connection].endNode] = {
          ...data[node].connections[connection],
          content: [],
        };
      }
      nodeData[data[node].node.id] = {
        ...data[node].node,
        connections: nodeConnections,
        icon: 'block',
        color: 'black',
      };

      visualData[data[node].node.id] = data[node].relationship;
    }
  }

  // node data
  const [nodeData_Graph, setnodeData_Graph] = useState(nodeData);
  const [nodeVisualData_Graph, setnodeVisualData_Graph] = useState(visualData);

  useEffect(() => {
    setnodeData_Graph(nodeData);
    setnodeVisualData_Graph(visualData);
  }, [isLoading]);

  //Graph in view of one node, keep the id.
  const [nodeInFocus, setnodeInFocus] = useState(nodeId);
  const [nodeInFocus_Connections, setNodeInFocus_Connections] = useState<
    { r: any; c: any }[]
  >([]);

  // get the connected nodes of seleced node
  useEffect(() => {
    console.log('nodeInFocus');
    console.log(nodeInFocus);
    if (nodeInFocus)
      fetch(`/api/${username}/${nodeInFocus}`)
        .then((res) => res.json())
        .then((json) => {
          console.log('connected Nodes');
          console.log(json);
          setNodeInFocus_Connections(json);
        });
  }, [nodeInFocus]);

  // // set NodeId once it changes
  useEffect(() => {
    console.log('nodeId updated' + nodeId);
    setnodeInFocus(nodeId);
  }, [nodeId]);

  const [currGraphViewId, setCurrGraphViewId] = useState(viewId);

  //Drawing states
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawingMode, setDrawingMode] = useState(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  console.log('nodeData_Graph');
  console.log(nodeData_Graph);
  console.log('nodeVisualData_Graph');
  console.log(nodeVisualData_Graph);

  //Drawing line data
  const startNode = useRef<string>('');
  const endNode = useRef<string>('');

  //Line functions for detecting arrows
  let isPointInCanvasFuncs = useRef<any>({});
  let numPointsInTriangleFuncs = useRef<any>({});

  const [modalNode, setModalNode] = useState('');
  const [showModalConnection, setShowModalConnection] = useState(false);

  // Hot key for undo/redo
  useEffect(() => {
    const listenerFunc = (evt: any) => {
      evt.stopImmediatePropagation();
      if (evt.code === 'KeyZ' && (evt.ctrlKey || evt.metaKey) && evt.shiftKey) {
        // redo();
      } else if (evt.code === 'KeyZ' && (evt.ctrlKey || evt.metaKey)) {
        // undo();
      }
    };
    document.addEventListener('keydown', (event) => listenerFunc(event));
    return document.removeEventListener('keydown', (event) =>
      listenerFunc(event)
    );
  }, []);

  //graph view tags default
  const [tags, setTags] = useState(getTags(nodeData_Graph));

  //alert message
  const [alert, setAlert] = useState('');

  return (
    <DrawingContext.Provider
      value={{
        startNode: startNode,
        endNode: endNode,
        isPointInCanvasFuncs: isPointInCanvasFuncs,
        numPointsInTriangleFuncs: numPointsInTriangleFuncs,
        drawingMode: drawingMode,
        setDrawingMode: setDrawingMode,
        isDrawing: isDrawing,
        setIsDrawing: setIsDrawing,
      }}
    >
      <GraphViewContext.Provider
        value={{
          setnodeInFocus: setnodeInFocus,
          nodeData_Graph: nodeData_Graph,
          setnodeData_Graph: setnodeData_Graph,
          nodeVisualData_Graph: nodeVisualData_Graph,
          setnodeVisualData_Graph: setnodeVisualData_Graph,
          modalNode: modalNode,
          setModalNode: setModalNode,
          nodeInFocus: nodeInFocus,
          graphViewId: currGraphViewId as string,
          setGraphViewId: setCurrGraphViewId,
          tags: tags,
          setTags: setTags,
          alert: alert,
          setAlert: setAlert,
        }}
      >
        <SplitPane className='split-pane-row'>
          <SplitPaneLeft>
            <div
              // onKeyDown={(event) =>
              // 	handleDrawingHotkey(event, drawingMode, setDrawingMode)
              // }
              tabIndex={-1}
              ref={containerRef}
              // className='relative'
            >
              <GraphContainer />
              <Alert />
            </div>
            {/* <BoxDragLayer parentRef={containerRef} /> */}
          </SplitPaneLeft>
          <Divider className='separator-col' />
          <SplitPaneRight>
            <GraphSideTabs nodeInFocus_Connections={nodeInFocus_Connections} />
          </SplitPaneRight>
        </SplitPane>
      </GraphViewContext.Provider>
    </DrawingContext.Provider>
  );
};

export default Graph;