import SEO from './SEO';
import Nav from '../components/common/Nav';
import Footer from './common/Footer';
import { Suspense } from 'react';

const Layout = ({ children }) => {
	return (
		<>
			<SEO />
			<Nav />
			<Suspense>
			{children}
			</Suspense>
			<Footer />
		</>
	);
};

export default Layout;
