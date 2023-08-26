import useSWR from 'swr';
import { fetcher } from '../../../driver/fetcher';
import { jsonToCypher_graphView } from '../../../driver/dataConversion';
import { NodeData } from '../../../../packages/graph/graphTypes';
import { Action } from '../../../../packages/graph/hooks/useHistoryState';

type deleteDetachNodeInput = {
	nodeId: string;
};

export const deleteDetachNode = async ({ nodeId }: deleteDetachNodeInput) => {
	const body = `
        MERGE (n: Node {id: "${nodeId}"})
		DETACH DELETE n
	`;

	const res = await fetch(`/api/general/nodes/mutate/deleteDetachNode`, {
		method: 'POST',
		body: body,
	})
		.then((res) => {
			console.log('res ', res);
			return res.json();
		})
		.then((json) => {
			console.log('json: ', json);
			return json;
		});

	return res;
};
