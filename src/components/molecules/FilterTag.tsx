'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { connectedNode_type } from '@/backend/functions/node/query/useGetNodeData';
import { Tag } from '../ui/tag';
import IconTitle from './IconTitle';
import { NodeTitle } from '@/packages/editor/Elements/Elements';
import { connectionColours } from '@/theme/colors';
import { Router, useRouter } from 'next/router';
import { useViewData } from '../context/ViewContext';
import { NodeData } from '@/packages/graph/graphTypes';
import IconCircleButton from './IconCircleButton';
import IconButton from '../atoms/IconButton';

export function FilterTag({
	type,
	nodes,
}: {
	type: string;
	nodes: NodeData[];
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

	const router = useRouter();
	const { nodeId, username } = useViewData();

	const renderTitles = () => {
		const outString = nodes.map((node) => (
			<IconTitle icon={node.icon} title={node.title + ', '} />
		));

		return outString;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Tag
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={'w-fit justify-between bg-' + type.toUpperCase()}
				>
					<div className='max-w-[150px] truncate overflow-ellipsis flex flex-row'>
						<span className='font-bold mr-1'>{type + ':'}</span>
						{renderTitles()}
					</div>
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Tag>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search for Node...' />
					<CommandEmpty>No node found.</CommandEmpty>
					<CommandGroup>
						{nodes.map((node) => (
							<CommandItem
								key={node.id}
								onSelect={(id) => {
									router.push(`/${username}/${node.id}`);
									// setValue(id === value ? '' : id);
									// setOpen(false);
								}}
							>
								<div className='flex justify-between flex-row w-full'>
									<IconTitle
										icon={node.icon}
										title={node.title}
									/>
									<IconButton
										onClick={() => {
											console.log('delete');
										}}
										src='delete'
									/>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
