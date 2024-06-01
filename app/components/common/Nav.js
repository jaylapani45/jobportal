"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';
import { getAuth, signOut } from 'firebase/auth'; // Import necessary Firebase auth functions
import { fire } from '../../utils/firebase';
import styles from '../../styles/nav.module.css';

const Nav = () => {
  const { hasSignedIn: val, setHasSignedIn: setVal, isOrg } = useContext(
    AuthContext
  );
  const { setUserJobs } = useContext(JobContext);
  const [hasSignedIn, setHasSignedIn] = useState(val);

  useEffect(() => {
    const signedIn = localStorage.getItem('hasSignedIn');
    setHasSignedIn(signedIn);
  }, []);

  /**
   * Log out user from the system
   */
  const handleLogout = () => {
    const auth = getAuth(fire); // Initialize Firebase auth

    signOut(auth)
      .then(() => {
        setHasSignedIn(false);
        setVal(false);
        setUserJobs([]);
        localStorage.setItem('hasSignedIn', false);
        localStorage.setItem('email', null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

	return (
		<div className={styles.container}>
			<div className={styles.main_container}>
				<div className={styles.img_container}>
					<Link href="/">
						
							<Image
								src="/logo2.png"
								alt="jobportal"
								width={100}
								height={80}
							/>
						
					</Link>
				</div>
				<div className={styles.links_container}>
					{!val ? (
						<>
							<Link href="/login">
								<div className={styles.links}>
									<p>Login</p>
								</div>
							</Link>
							<Link href="/signup">
								<div className={styles.links}>
									<p>Sign Up</p>
								</div>
							</Link>
						</>
					) : (
						<>
							<Link href="/dashboard">
								<div className={styles.links}>
									<p>Dashboard</p>
								</div>
							</Link>
							<Link href="/">
								<div
									className={styles.links}
									onClick={handleLogout}
								>
									<p>Logout</p>
								</div>
							</Link>
						</>
					)}

					<div>
						{val ? (
							isOrg ? (
								<Link href="/hire">
									<p>
										<button>Post a Job</button>
									</p>
								</Link>
							) : null
						) : (
							<Link href="/login">
								<p>
									<button>Post a Job</button>
								</p>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Nav;
