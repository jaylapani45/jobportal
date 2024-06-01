"use client"
import { useContext, useEffect, useState } from 'react';
import Load from './components/common/Load';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { JobContext } from './components/context/JobContext';
import Jobs from './components/Jobs';
import  fire  from './utils/firebase';

export default function Home() {
	const { jobs, setJobs } = useContext(JobContext);
	const [loading, setLoading] = useState(true); // Add loading state

	useEffect(() => {
		const fetchData = async () => {
			try {
				const db = getFirestore(fire); // Initialize Firestore
				const jobsCollection = collection(db, 'jobs');
				const querySnapshot = await getDocs(jobsCollection);

				const allJobs = [];
				querySnapshot.forEach((doc) => {
					allJobs.push({ id: doc.id, ...doc.data() });
				});

				console.log('Fetched Jobs:', allJobs); // Log fetched jobs
				setJobs(allJobs);
				setLoading(false); // Update loading state once data is fetched
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false); // Update loading state in case of error
			}
		};

		fetchData();
	}, [setJobs]);

	return (
		<>
			{loading ? <Load /> : ( // Render loading component while data is being fetched
				<Jobs label="All the Developer Jobs" jobs={jobs} />
			)}
		</>
	);
}
