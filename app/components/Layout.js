import Nav from '../components/common/Nav';
import { Suspense } from 'react';

const Layout = ({ children }) => {
	return (
		<>
			
			<Nav />
			<Suspense>
			{children}
			</Suspense>
			
		</>
	);
};

export default Layout;
