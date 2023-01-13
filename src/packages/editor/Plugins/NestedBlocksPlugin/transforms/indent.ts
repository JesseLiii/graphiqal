import {
	getChildren,
	getNode,
	moveChildren,
	moveNodes,
	PlateEditor,
} from '@udecode/plate';
import { getNodeEntries, getPluginInjectProps } from '@udecode/plate-core';
import { Path } from 'slate';
import { COMMAND_NEST, MyValue } from '../../../plateTypes';
import { SetIndentOptions } from './setIndent';

/**
 * Increase the indentation of the selected blocks.
 */
export const indent = <V extends MyValue>(
	editor: PlateEditor<V>,
	options?: SetIndentOptions<V>
) => {
	// const { nodeKey } = getPluginInjectProps(editor, COMMAND_NEST);

	const _nodes = getNodeEntries(editor, {
		block: true,
		mode: 'lowest',
		...options,
	});

	const nodes = Array.from(_nodes);

	console.log(nodes);

	if (editor.selection) {
		// User is in the text node of a p paragraph, so gets to p element above that.
		const paragraphPath = Path.parent(editor.selection.anchor.path);
		console.log(paragraphPath);

		// It should always look at its level, if it's not the first in its level (there is smth above it at the same level, we can move the node)
		if (paragraphPath[paragraphPath.length - 2] > 1) {
			const blockNode = getNode(editor, Path.parent(paragraphPath));
			// Get block node above this one.
			const destNodePath = [...Path.parent(paragraphPath)];
			destNodePath[destNodePath.length - 1] -= 1;
			const destNode = getNode(editor, destNodePath);

			if (
				destNode &&
				'children' in destNode &&
				Array.isArray(destNode.children)
			) {
				const length = destNode.children.length;
				console.log('length ', length);
				console.log(destNodePath);
				console.log([...destNodePath, length]);
				moveNodes(editor, {
					to: [...destNodePath, length],
					at: Path.parent(paragraphPath),
				});
				// if there are things below they should all be wrapped.
			}
		} else {
			console.log(false);
		}

		// if (parentNode && 'children' in parentNode) {
		// 	// parentPath[parentPath.length - 2] = parentNode.children.length;
		// 	// if there are children, it should look at the path above it.
		// }
		// moveNodes(editor, { to: [parentPath] });
	}
};
