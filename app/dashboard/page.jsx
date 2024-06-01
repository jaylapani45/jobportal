"use client";
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import  fire  from '../utils/firebase';
import Job from '../components/common/Job';
import { AuthContext } from '../components/context/AuthContext';
import { JobContext } from '../components/context/JobContext';
import styles from '../styles/dashboard.module.css';
import { getFirestore, collection, doc, onSnapshot, query, where,updateDoc,deleteDoc } from 'firebase/firestore';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { email, setHasSignedIn, setIsOrg: flag } = useContext(AuthContext);
  const { jobs, setJobs, userJobs, setUserJobs } = useContext(JobContext);
  const [isOrg, setIsOrg] = useState(false);
  const [orgMsg, setOrgMsg] = useState('');
  const [usrMsg, setUsrMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSignedIn = localStorage.getItem('hasSignedIn');

      if (hasSignedIn === 'false') {
        router.push('/');
      } else {
        const eml = localStorage.getItem('email');
        const db = getFirestore(fire);

        setOrgMsg('Loading...');
        setUsrMsg('Loading...');

        const userDocRef = doc(db, 'users', eml);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const org = userData.isOrg;
            setIsOrg(org);
            flag(org);

            if (org) {
              const jobsQuery = query(
                collection(db, 'jobs'),
                where('companyEmail', '==', eml)
              );

              const unsubscribeOrgJobs = onSnapshot(jobsQuery, (querySnapshot) => {
                const orgJobs = [];
                querySnapshot.forEach((doc) => {
                  orgJobs.push({ id: doc.id, ...doc.data() });
                });
                setUserJobs(orgJobs);
                setOrgMsg(orgJobs.length === 0 ? 'No jobs from your organization have been posted yet.' : '');
              });

              return () => {
                unsubscribe();
                unsubscribeOrgJobs();
              };
            } else {
              const jobsQuery = query(
                collection(db, 'jobs'),
                where('applicants', 'array-contains', eml)
              );

              const unsubscribeJobs = onSnapshot(jobsQuery, (querySnapshot) => {
                const appliedJobs = [];
                querySnapshot.forEach((doc) => {
                  appliedJobs.push({ id: doc.id, ...doc.data() });
                });
                setUserJobs(appliedJobs);
                setUsrMsg(appliedJobs.length === 0 ? 'You have not applied to any jobs yet...' : '');
              });

              return () => {
                unsubscribe();
                unsubscribeJobs();
              };
            }
          } else {
            setUsrMsg("No data available")
            console.log('No such document!');
          }
        });

        setHasSignedIn(true);
      }
    }
  }, []);

  /**
   * Delete job
   */
  const handleDelete = async (jobId) => {
    const db = getFirestore(fire);
    const email = localStorage.getItem('email');  // Get the email from local storage or context
  
    const newState = userJobs.filter((job) => job.id !== jobId);
    const newJobState = jobs.filter((job) => job.id !== jobId);
  
    try {
      // Update user job list
      const userDocRef = doc(db, 'users', email);
      await updateDoc(userDocRef, {
        jobList: newState,
      });
      console.log('User job list updated successfully!');
  
      // Delete the job
      const jobDocRef = doc(db, 'jobs', jobId);
      await deleteDoc(jobDocRef);
      console.log('Job deleted successfully!');
  
      // Update state
      setUserJobs(newState);
      setJobs(newJobState);
    } catch (error) {
      console.error('Error deleting job: ', error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.subcontainer_1}>
        <div className={styles.btn}>
          {!isOrg && <button>Applied Jobs</button>}
          {isOrg && <button>Posted Jobs</button>}
        </div>
      </div>
      <div className={styles.subcontainer_2}>
        <div className={styles.job_listing}>
          {isOrg ? (
            <div className={styles.org_jobs}>
              {userJobs.length > 0 ? (
                userJobs.map((job) => {
                  const applicants = job.applicants || [];
                  console.log('applicants:', applicants);

                  return (
                    <div className={styles.job_list} key={job.id}>
                      <Job
                        key={job.id}
                        letter={job.companyName[0]}
                        title={job.jobTitle}
                        date={job.date}
                        company={job.companyName}
                        location={job.jobArea}
                        id={job.id}
                        isPreview={false}
                      />
                      {applicants.length > 0 ? (
                        <div className={styles.email_list}>
                          <p className="text-green-700">Applications received from:</p>
                          <ul>
                            {applicants.map((applicant, index) => (
                              <li key={index}>{applicant}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-red-500">No applicants yet.</p>
                      )}
                      <div
                        className={styles.image}
                        onClick={() => handleDelete(job.id)}
                      >
                        <Image
                          src="/delete.png"
                          alt="delete"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <h2 className={styles.notice}>{orgMsg}</h2>
              )}
            </div>
          ) : (
            <div className={styles.org_jobs}>
              {userJobs.length > 0 ? (
                userJobs.map((job) => (
                  <div className={styles.job_list} key={job.id}>
                    <Job
                      letter={job.companyName[0]}
                      title={job.jobTitle}
                      date={job.date}
                      company={job.companyName}
                      location={job.jobArea}
                      id={job.id}
                      isPreview={false}
                    />
                  </div>
                ))
              ) : (
                <h2 className={styles.notice}>{usrMsg}</h2>
              )}
            </div>
          )}
        </div>
      <Button label="Find Jobs" onClick={()=>router.push('/')}></Button>
      </div>
    </div>
  );
};

export default Dashboard;
