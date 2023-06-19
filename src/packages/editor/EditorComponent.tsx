import {
	createComboboxPlugin,
	createNodeIdPlugin,
	Plate,
} from '@udecode/plate';
import React, { useEffect, useMemo, useRef } from 'react';
import { saveDocument } from '../../backend/functions/general/document/mutate/saveDocument';
import { EditorFloatingMenu } from './Components/EditorFloatingMenu';
import { EditorSlashMenu } from './Components/EditorSlashMenu';
import { editableProps } from './editableProps';
import {
	createMyEditor,
	createMyPlugins,
	MyValue,
	useMyEditorState,
} from './plateTypes';
import { BlockPlugins } from './Plugins/BlockPlugins';
import { CommandPlugins } from './Plugins/CommandPlugins';
import { FormatPlugins } from './Plugins/FormatPlugins';
import { createBlockPlugin } from './Plugins/NestedBlocksPlugin/BlockPlugin';
import { TextMarkPlugins } from './Plugins/TextMarkPlugins';

import { v4 as uuidv4 } from 'uuid';
import { useViewData } from '../../components/context/ViewContext';
import { createMyPlateEditor } from './plateTypes';

const EditorComponent: React.FC<{
	value: any[];
	setValue: Function;
	initialValue: any[];
	id: string;
}> = ({ initialValue, value, setValue, id = uuidv4() }) => {
	// const router = useRouter();
	const { nodeId, username, currNode_data } = useViewData();

	const intervalRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 5000));

	useEffect(() => {
		window.addEventListener('beforeunload', onUnload);

		return () => window.removeEventListener('beforeunload', onUnload);
	}, [value]);

	const onUnload = () => {
		// code to save progress to local storage....
		if (value.length > 0) {
			// console.log('unloading', JSON.stringify(value));
			saveDocument({
				nodeId,
				username,
				document: value.slice(1),
				title: value[0].children[0].text as string,
			});
		}
	};

	const plugins = useMemo(
		() =>
			createMyPlugins([
				// Mark Plugins
				...TextMarkPlugins,
				// elements
				...BlockPlugins,
				// Commands,
				...CommandPlugins,
				...FormatPlugins,
				createBlockPlugin(),
				createComboboxPlugin({
					options: {},
				}),
				// createHistoryPlugin(),
				createNodeIdPlugin({
					options: {
						idCreator: uuidv4,
					},
				}),
			]),
		[]
	);

	// const editorOnly = createMyEditor();
	// const editor = createMyPlateEditor({
	// 	plugins: plugins,
	// });

	// `useCallback` here to memoize the function for subsequent renders.
	// const renderElement = useCallback((props: any) => {
	// 	return <Block {...props} />;
	// }, []);

	// get editor instance
	// const editor =

	return (
		<div>
			<Plate<MyValue>
				editableProps={editableProps}
				initialValue={initialValue}
				// editor={editor}
				onChange={(docValue) => {
					console.log(docValue);
					setValue(docValue);
					clearTimeout(intervalRef.current);
					intervalRef.current = setTimeout(() => {
						saveDocument({
							nodeId,
							username,
							document: docValue.slice(1),
							title: docValue[0].children[0].text as string,
						});
					}, 5000);
				}}
				plugins={plugins}
				id={id}
			>
				<EditorFloatingMenu />
				<EditorSlashMenu />
			</Plate>
		</div>
	);
};

export default EditorComponent;
