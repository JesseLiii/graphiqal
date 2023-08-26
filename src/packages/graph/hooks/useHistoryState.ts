/**
 * Hook for controlling history actions
 */

import {
	MutableRefObject,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from 'react';
import { GraphNodeData, LineRefs, NodeData } from '../graphTypes';
import { KeyedMutator, useSWRConfig } from 'swr';
import { createConnection } from '@/backend/functions/node/mutate/createConnection';
import { deleteConnectionAPI } from '@/backend/functions/node/mutate/deleteConnection';
import { updateGraphNode } from '@/backend/functions/graph/mutate/updateGraphNode';

export type Action = {
	type: ActionChanges;
	id: string;
	value: any;
};

export type ActionChanges =
	| 'NODE_ADD'
	| 'NODE_ADD_EXISTING'
	| 'NODE_DELETE'
	| 'CONNECTION_ADD'
	| 'CONNECTION_DELETE'
	| 'CONNECTION_DIRECTION_ADD'
	| 'CONNECTION_TYPE'
	| 'CONNECTION_DIRECTION'
	| 'DRAG'
	| 'NODE_ICON'
	| 'NODE_COLOR'
	//not done
	| 'NODE_TITLE'
	| 'NODE_SIZE';

export type History_Graph = React.MutableRefObject<{
	undos: Action[];
	redos: Action[];
}>;

type historyStateInput = {
	changeNodeData_Graph: any;
	changeVisualData_Graph: any;
	changeAlert: (val: string) => void;
	nodeDataRef: MutableRefObject<{ [key: string]: NodeData }>;
	visualDataRef: MutableRefObject<{ [key: string]: GraphNodeData }>;
	mutateGraphData: KeyedMutator<any>;
	graphViewId: string;
};
export const useHistoryState = ({
	changeNodeData_Graph,
	changeVisualData_Graph,
	changeAlert,
	nodeDataRef,
	visualDataRef,
	mutateGraphData,
	graphViewId,
}: historyStateInput) => {
	const history = useRef<{ undos: Action[]; redos: Action[] }>({
		undos: [],
		redos: [],
	});

	const addActionToStack = (action: Action) => {
		history.current.undos = [...history.current.undos, action];

		history.current.redos = [];

		console.log(history.current);
	};

	const applyAction = (action: Action) => {
		const { id, type, value } = action;
		const nodeData_Graph = nodeDataRef.current;
		const nodeVisualData_Graph = visualDataRef.current;

		let newState: any;

		switch (type) {
			case 'NODE_SIZE':
				newState = { ...nodeData_Graph };
				newState[id].height = value.new.height;
				newState[id].width = value.new.width;
				newState[id].x = value.new.x;
				newState[id].y = value.new.y;
				changeVisualData_Graph(newState);

				mutateGraphData(
					updateGraphNode({
						nodeId: id,
						nodeVisualData: {
							x: value.new.x,
							y: value.new.y,
							height: value.new.height,
							width: value.new.width,
						},
						graphViewId,
					}),
					{
						optimisticData: (data: any) => ({
							nodeData: data.nodeData,
							visualData: newState,
						}),
						populateCache: false,
						revalidate: false,
					}
				);

				break;

			case 'NODE_ADD':
				newState = { ...nodeData_Graph };
				newState[id] = value.new.node_data;
				changeNodeData_Graph(newState);
				newState = { ...nodeVisualData_Graph };
				newState[id] = value.new.node_visual;
				changeVisualData_Graph(newState);
				break;
			case 'NODE_ADD_EXISTING':
				newState = { ...nodeData_Graph };
				newState[id] = value.new.node_data;
				if (value.old.node_data)
					delete newState[value.old.node_data.id];
				changeNodeData_Graph(newState);
				newState = { ...nodeVisualData_Graph };
				newState[id] = value.new.node_visual;
				if (value.old.node_data)
					delete newState[value.old.node_data.id];
				changeVisualData_Graph(newState);
				break;
			case 'NODE_DELETE':
				newState = { ...nodeData_Graph };
				delete newState[id];
				changeNodeData_Graph(newState);
				newState = { ...nodeVisualData_Graph };
				delete newState[id];
				changeVisualData_Graph(newState);
				break;
			case 'NODE_COLOR':
				newState = { ...nodeData_Graph };
				newState[id].color = value.new.color;
				changeNodeData_Graph(newState);
				break;
			case 'NODE_ICON':
				newState = { ...nodeData_Graph };
				newState[id].icon = value.new.icon;
				changeNodeData_Graph(newState);
				break;
			case 'CONNECTION_ADD':
				// newState = { ...nodeData_Graph };
				// newState[id].connections[value.endNode] = value.connection;
				// changeNodeData_Graph(newState);

				mutateGraphData(
					createConnection({
						startNode: value.startNode,
						endNode: value.endNode,
						type: 'RELATED',
					}),
					{
						optimisticData: (data: any) => {
							let newnodeData_Graph = { ...data.nodeData };

							newnodeData_Graph[value.startNode].connections[
								value.endNode
							] = {
								startNode: value.startNode,
								endNode: value.endNode,
								content: [],
								type: 'RELATED',
							};

							changeAlert(
								'Connection of type RELATED added between ' +
									newnodeData_Graph[value.startNode].title +
									' and ' +
									newnodeData_Graph[value.endNode].title
							);

							return {
								visualData: data.nodeVisualData_Graph,
								nodeData: newnodeData_Graph,
							};
						},
						populateCache: false,
						revalidate: false,
					}
				);

				break;
			case 'CONNECTION_DELETE':
				// newState = { ...nodeData_Graph };
				// delete newState[id].connections[value.endNode];
				// changeNodeData_Graph(newState);

				changeAlert(
					'Deleted connection from ' +
						nodeData_Graph[value.startNode].title +
						' to ' +
						nodeData_Graph[value.endNode].title
				);

				let newNodes = { ...nodeData_Graph };

				const type =
					newNodes[value.startNode].connections[value.endNode].type;

				delete newNodes[value.startNode].connections[value.endNode];
				delete newNodes[value.endNode].connections[value.startNode];

				// changeNodeData_Graph(newNodes);

				mutateGraphData(
					deleteConnectionAPI({
						startNode: value.startNode,
						endNode: value.endNode,
						type,
					}),
					{
						optimisticData: (data: any) => ({
							nodeData: newNodes,
							visualData: data.visualData,
						}),
						populateCache: false,
						revalidate: false,
					}
				);

				break;
			case 'CONNECTION_TYPE':
				newState = { ...nodeData_Graph };
				newState[id].connections[value.endNode].type = value.new.type;
				changeNodeData_Graph(newState);
				break;
			case 'CONNECTION_DIRECTION':
				newState = { ...nodeData_Graph };
				if (newState[id].connections[value.endNode]) {
					newState[value.endNode].connections[id] =
						value.newConnection;
					delete newState[id].connections[value.endNode];
				} else {
					newState[id].connections[value.endNode] =
						value.newConnection;
					delete newState[value.endNode].connections[id];
				}
				changeNodeData_Graph(newState);
				break;
			case 'DRAG':
				console.log('drag');

				newState = { ...nodeVisualData_Graph };
				newState[id].x = value.new.x;
				newState[id].y = value.new.y;

				changeVisualData_Graph(newState);

				mutateGraphData(
					updateGraphNode({
						nodeId: id,
						nodeVisualData: { x: value.new.x, y: value.new.y },
						graphViewId,
					}),
					{
						optimisticData: (data: any) => ({
							nodeData: data.nodeData,
							visualData: newState,
						}),
						populateCache: false,
						revalidate: false,
					}
				);
				break;
		}
	};

	const addAction = (id: string, type: ActionChanges, value: any) => {
		// just directly fetch it.
		// This won't cache the change though.

		applyAction({
			id: id,
			value: value,
			type: type,
		});

		addActionToStack({
			id: id,
			value: value,
			type: type,
		});
	};

	const undo = () => {
		const nodeData_Graph = nodeDataRef.current;
		const nodeVisualData_Graph = visualDataRef.current;
		let newState: any;

		console.log(history.current);
		if (history.current.undos.length < 1) return;

		const { id, value, type } =
			history.current.undos[history.current.undos.length - 1];

		history.current.undos.pop();
		history.current.redos.push({ id, value, type });

		console.log('undo values: ', id, value, type);

		switch (type) {
			case 'NODE_SIZE':
				newState = { ...nodeVisualData_Graph };
				newState[id].height = value.old.height;
				newState[id].width = value.old.width;
				newState[id].x = value.old.x;
				newState[id].y = value.old.y;
				changeVisualData_Graph(newState);

				// Just directly mutate here

				// alert('asd');

				break;
			case 'NODE_ADD':
				newState = { ...nodeData_Graph };
				delete newState[id];
				changeNodeData_Graph(newState);
				let newVisualState = { ...nodeVisualData_Graph };
				delete newVisualState[id];
				changeVisualData_Graph(newVisualState);

				break;
			case 'NODE_ADD_EXISTING':
				newState = { ...nodeData_Graph };
				if (value.old.node_data) {
					newState[value.old.node_data.id] = value.old.node_data;
				}
				delete newState[id];
				changeNodeData_Graph(newState);
				newState = { ...nodeVisualData_Graph };
				if (value.old.node_data)
					newState[value.old.node_data.id] = value.old.node_visual;
				delete newState[id];
				changeVisualData_Graph(newState);
				break;

			case 'NODE_DELETE':
				newState = { ...nodeData_Graph };
				newState[id] = value.deletedNode;
				changeNodeData_Graph(newState);
				newState = { ...nodeVisualData_Graph };
				newState[id] = value.deletedVisualNode;
				changeVisualData_Graph(newState);
				break;
			case 'NODE_COLOR':
				newState = { ...nodeData_Graph };
				newState[id].color = value.old.color;
				changeNodeData_Graph(newState);
				break;
			case 'NODE_ICON':
				newState = { ...nodeData_Graph };
				newState[id].icon = value.old.icon;
				changeNodeData_Graph(newState);
				break;
			case 'CONNECTION_ADD':
				newState = { ...nodeData_Graph };
				delete newState[id].connections[value.endNode];
				changeNodeData_Graph(newState);

				break;
			case 'CONNECTION_DELETE':
				newState = { ...nodeData_Graph };
				newState[id].connections[value.endNode] = value.connection;
				changeNodeData_Graph(nodeData_Graph);
				break;

			case 'CONNECTION_TYPE':
				newState = { ...nodeData_Graph };
				newState[id].connections[value.endNode].type = value.old.type;
				changeNodeData_Graph(newState);
				break;
			case 'CONNECTION_DIRECTION':
				newState = { ...nodeData_Graph };
				newState[value.endNode].connections[id] = value.oldConnection;
				changeNodeData_Graph(newState);
				break;
			case 'DRAG':
				newState = { ...nodeVisualData_Graph };
				newState[id].x = value.old.x;
				newState[id].y = value.old.y;
				changeVisualData_Graph(newState);
				break;
			case 'NODE_TITLE':
				// let undoOps = 0;
				// for (let i = history.current.length - 1; i > 0; --i) {
				//   if (history.current[i].type == 'NODE_TITLE' && undoOps < 5) {
				//     undoOps += 1;
				//   } else {
				//     break;
				//   }
				// }
				// pointer.current -= undoOps;
				newState = { ...nodeData_Graph };
				newState[id].title = value.oldTitle;
				changeNodeData_Graph(newState);
				break;
		}
	};

	const redo = () => {
		console.log(history.current);

		if (history.current.redos.length < 1) return;

		const { id, value, type } =
			history.current.redos[history.current.redos.length - 1];

		console.log('redo', { id, value, type });

		history.current.redos.pop();
		history.current.undos.push({ id, value, type });
		applyAction({ id, type, value });
	};

	return { undo, redo, addAction, history };
};
