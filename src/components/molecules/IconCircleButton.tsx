import React from 'react';
import Circle from '../atoms/Circle';
import IconButton from '../atoms/IconButton';
import { Plus } from '@styled-icons/fa-solid/Plus';
import { Star } from '@styled-icons/fa-solid/Star';
import { Pencil } from '@styled-icons/bootstrap/Pencil';
import { Cube } from '@styled-icons/boxicons-solid/Cube';
import { Undo } from '@styled-icons/icomoon/Undo';
import { Redo } from '@styled-icons/icomoon/Redo';
import { Flashlight } from '@styled-icons/fluentui-system-filled/Flashlight';
import { Navigation } from '@styled-icons/boxicons-regular/Navigation';
import { ArrowsAngleExpand } from '@styled-icons/bootstrap/ArrowsAngleExpand';
import { Trash } from '@styled-icons/bootstrap/Trash';
import { Connectdevelop } from '@styled-icons/fa-brands/Connectdevelop';
import { CloseOutline } from '@styled-icons/evaicons-outline/CloseOutline';
import { AngleDown } from '@styled-icons/fa-solid/AngleDown';
import { AngleRight } from '@styled-icons/fa-solid/AngleRight';
import { AngleLeft } from '@styled-icons/fa-solid/AngleLeft';
import { Save } from '@styled-icons/boxicons-regular/Save';
import { Data } from '@styled-icons/boxicons-solid/Data';
import { Thealgorithms } from '@styled-icons/simple-icons/Thealgorithms';
import { CardChecklist } from '@styled-icons/bootstrap/CardChecklist';
import { MenuOutline } from '@styled-icons/evaicons-outline/MenuOutline';
import { Settings } from '@styled-icons/material/Settings';

type NodeButtonProps = {
	onClick: () => void;
	src: string;
	selected?: boolean;
	size?: number;
	circle?: boolean;
	color?: string;
};

//filled circle button with plus icon button inside
//choose from dictionary of icons by passing in one of these string values as source: 'plus', 'draw'
const IconCircleButton: React.FC<NodeButtonProps> = ({
	onClick,
	src,
	selected = false,
	size = 30,
	circle = true,
	color = 'black',
}) => {
	const iconSize = size * 0.5;

	const handleClick = (e: any) => {
		console.log('handleClick');
		e.stopPropagation();
		e.preventDefault();
		onClick();
	};

	const icons: any = {
		plus: <Plus color={!selected ? color : 'white'} size={iconSize} />,
		draw: <Pencil color={!selected ? color : 'white'} size={iconSize} />,
		undo: <Undo color={!selected ? color : 'white'} size={iconSize} />,
		redo: <Redo color={!selected ? color : 'white'} size={iconSize} />,
		spotlight: (
			<Flashlight color={!selected ? color : 'white'} size={iconSize} />
		),
		navigation: (
			<Navigation color={!selected ? color : 'white'} size={iconSize} />
		),
		expand: (
			<ArrowsAngleExpand
				color={!selected ? color : 'white'}
				size={iconSize}
			/>
		),
		remove: <Trash color={!selected ? color : 'white'} size={iconSize} />,
		connection: (
			<Connectdevelop
				color={!selected ? color : 'white'}
				size={iconSize}
			/>
		),
		close: (
			<CloseOutline color={!selected ? color : 'white'} size={iconSize} />
		),
		block: <Cube size={'1em'} color={!selected ? color : 'white'} />,
		angleRight: (
			<AngleRight size={'1em'} color={!selected ? color : 'white'} />
		),
		angleLeft: (
			<AngleLeft size={'1em'} color={!selected ? color : 'white'} />
		),
		angleDown: (
			<AngleDown size={'1em'} color={!selected ? color : 'white'} />
		),
		save: <Save size={'1em'} color={!selected ? color : 'white'} />,
		data: <Data size={'1em'} color={!selected ? color : 'white'} />,
		algo: (
			<Thealgorithms size={'1em'} color={!selected ? color : 'white'} />
		),
		checklist: (
			<CardChecklist size={'1em'} color={!selected ? color : 'white'} />
		),
		star: <Star size={'1em'} color={selected ? color : 'white'} />,
		menu: <MenuOutline size={'1em'} color={!selected ? color : 'white'} />,
		settings: <Settings size={'1em'} color={!selected ? color : 'white'} />,
	};

	return (
		<div className='hover:cursor-pointer hover:opacity-80'>
			{circle ? (
				<Circle
					onClick={onClick}
					diameter={size}
					children={<IconButton src={icons[src]} />}
					backgroundClass={selected ? 'bg-base_black' : 'bg-white'}
				/>
			) : (
				<div
					className='rounded-full bg-opacity-0 hover:bg-opacity-10 bg-black flex align-middle justify-center items-center'
					style={{ width: size + 'px', height: size + 'px' }}
				>
					<IconButton onClick={onClick} src={icons[src]} />
				</div>
			)}
		</div>
	);
};
export default IconCircleButton;
