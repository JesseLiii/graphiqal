import React, { useState } from 'react';
import CustomIconCircleButton from '../../components/molecules/CustomIconCircleButton';
import { Plus } from '@styled-icons/fa-solid/Plus';
import TextButton from '../../components/molecules/TextButton';
import { useRouter } from 'next/router';
import {
	GenerateCypher,
	returnCypher,
} from '../../backend/cypher-generation/cypherGenerators';
// import register from '../api/authentication/register';
import deleteUser from '../api/general/deleteUser';
import { login } from '../../backend/functions/authentication';
import { signIn } from 'next-auth/react';
import Divider from '../../components/atoms/Divider';
import Link from 'next/link';

//used for dragging
const SignIn: React.FC = () => {
	const [email, setemail] = useState('icejes8@gmail.com');
	const [password, setpassword] = useState('password');

	const router = useRouter();

	// const login = () => {
	// 	console.log('login');
	// };

	return (
		<div>
			<div className='flex flex-col justify-center items-center h-screen gap-4'>
				<div className='title text-xl font-extrabold'>Error</div>
				<Divider widthCSS='w-10' />
				<p className='text-sm text-lining'>
					<Link
						href='/auth/signin'
						className='underline hover:text-base_black'
					>
						Return to Login page
					</Link>
				</p>
			</div>
			{/* <CustomIconCircleButton onClick={() => {}} icon={<Plus />} /> */}
		</div>
	);
};

export default SignIn;