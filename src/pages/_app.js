// _app.js
/**
 * if you have any global layout in index.html file, change that to a react component
 * and use it to wrap all your pages
 */
// impoet global styles and layout (you can move global styles to /styles/ directory if you like)

import Head from 'next/head';
import React from 'react';
import { useState } from 'react';

import '../App.css';
import '../packages/resizable/resizable.css';
import '../packages/graph/graph.css';
import '../index.css';
import '../components/molecules/molecules.css';
import '../components/organisms/split-pane/pane.css';
import '../packages/editor/editor.css';
import '../components/atoms/atoms.css';
import '../components/organisms/organisms.css';

import View from '../components/layouts/View';
import Window from '../components/layouts/Window';
import TabContext from '../components/context/ViewContext';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<>
			<Head>
				<title>graphIQal</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
			</Head>
			<main>
				<SessionProvider>
					<Window>
						<View>
							<Component {...pageProps} />
						</View>
					</Window>
				</SessionProvider>
			</main>
		</>
	);
}
