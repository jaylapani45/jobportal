import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFirestore, doc, collection,addDoc,updateDoc,arrayUnion } from 'firebase/firestore';
import  fire  from '../utils/firebase';
import { AuthContext } from '../components/context/AuthContext';
import { HireContext } from '../components/context/HireContext';
import Button from './common/Button';
import Initial from './common/Initial';
import styles from '../styles/preview.module.css';

const Preview = ({ mainPreview = false, jobId }) => {
  const router = useRouter();
  const { email, hasSignedIn, isOrg } = useContext(AuthContext);
  const {
    jobTitle,
    jobType,
    jobArea,
    jobDescription,
    jobLink,
    companyName,
    companyEmail,
    companyWebsite,
    companyDescription,
  } = useContext(HireContext);

  const [loading, setLoading] = useState(false);

  const handlePostJob = async () => {
	const date = new Date();
	const month = date.getMonth();
	const day = date.getDay();
	const time = day+'/'+month
    if (
      jobTitle !== '' &&
      jobArea !== '' &&
      jobDescription !== '' &&
      jobLink !== '' &&
      companyName !== '' &&
      companyEmail !== '' &&
      companyWebsite !== '' &&
      companyDescription !== ''
    ) {
      setLoading(true);

      const jobInfo = {
        jobTitle,
        jobType,
        jobArea,
        jobLink,
        jobDescription,
        companyName,
        companyEmail,
        companyWebsite,
        companyDescription,
        date: time, // Assuming you store date as a Date object
        applicants: [], // Initialize applicants array
      };

      try {
        const db = getFirestore(fire);
        const jobsCollection = collection(db, 'jobs');

        const newJobRef = await addDoc(jobsCollection, jobInfo);

        // Update user's jobList with the new job ID
        const userDocRef = doc(db, 'users', email);
        await updateDoc(userDocRef, {
          jobList: arrayUnion({
            ...jobInfo,
            id: newJobRef.id, // Add job ID to job info
          }),
        });

        setLoading(false);
        router.push('/');
      } catch (error) {
        console.error('Error posting job:', error);
        setLoading(false);
      }
    }
  };
  const handleApplyClick = async () => {
	console.log(jobId)
      // User is not logged in, redirect to login page with state
      router.push("/login/?fromApply=true&jobId="+`${jobId}`); // Pass state to indicate redirected from apply
  };

  

  return (
    <div className={styles.preview_container}>
      <div className={styles.initial_wrapper}>
        <Initial letter={companyName[0]} name={companyName} />
      </div>
      <div className={styles.job_title}>
        <h2>{jobTitle}</h2>
      </div>
      <div className={styles.side_info}>
        <p>
          <strong>Job Type:</strong> {jobType}
        </p>
        <p>
          <strong>Location:</strong> {jobArea}
        </p>
      </div>
      <div className={styles.description}>
        <p>{jobDescription}</p>
      </div>
      <div className={styles.company}>
        <h2>About {companyName}</h2>
        <a href={companyWebsite}>Visit website</a>
        <br />
        <br />
        <a href={`mailto:${companyEmail}`}>Email them</a>
        <h3>Description</h3>
        <div className={styles.description}>
          <p>{companyDescription}</p>
        </div>
      </div>
      <div className={styles.btn}>
        {hasSignedIn ? (
          isOrg ? (
            <Button label="Post Job" onClick={handlePostJob} disabled={loading} />
          ) : (
            <Button label="Apply for Job" onClick={handleApplyClick} disabled={loading} />
          )
        ) : (
          <Button label="Apply for Job" onClick={handleApplyClick} disabled={loading} />
        )}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Preview;
