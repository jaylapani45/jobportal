"use client"
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../components/context/AuthContext';
import Input from '../components/common/Input';
import HelperMsg from '../components/common/HelperMsg';
import Button from '../components/common/Button';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { fire } from '../utils/firebase';
import styles from '../styles/auth.module.css';

const SignUp = () => {
	const { user, setUser } = useContext(AuthContext);
	const { email, setEmail } = useContext(AuthContext);
	const { password, setPassword } = useContext(AuthContext);
	const { emailErr, setEmailErr } = useContext(AuthContext);
	const { passwordErr, setPasswordErr } = useContext(AuthContext);
	const { isOrg, setIsOrg } = useContext(AuthContext);
	const { hasSignedIn } = useContext(AuthContext);
	const router = useRouter();

	const auth = getAuth(fire);
	const db = getFirestore(fire);

	/**
	 * Reset values of inputs to empty string
	 */
	const clearInput = () => {
		setEmail('');
		setPassword('');
	};

	/**
	 * Reset values of errors to empty string
	 */
	const clearErrs = () => {
		setEmailErr('');
		setPasswordErr('');
	};

	/**
	 * Sign up a new user
	 */
	const handleSignUp = async () => {
		clearErrs();
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			await setDoc(doc(db, 'users', email), {
				email: email,
				isOrg: isOrg === 'false' ? false : true,
				jobList: []
			});
			router.push('/login');
		} catch (err) {
			const { code, message } = err;
			if (code === 'auth/email-already-in-use' || code === 'auth/invalid-email') {
				setEmailErr(message);
			}
			if (code === 'auth/weak-password') {
				setPasswordErr(message);
			}
		}
	};

	/**
	 * Checks whether the user is logged in or not
	 */
	const authListener = () => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				clearInput();
				setUser(user);
			} else {
				setUser(null);
			}
		});
	};

	useEffect(() => {
		authListener();
		if (hasSignedIn) {
			router.push('/');
		}
	}, [hasSignedIn, router]);

	return (
		<div className={styles.container}>
			<div className={styles.subcontainer}>
				<Input
					htmlFor="email"
					label="Email"
					type="email"
					autoFocus={true}
					value={email}
					handleOnChange={setEmail}
					err={emailErr}
				/>
				<Input
					htmlFor="password"
					label="Password"
					type="password"
					value={password}
					handleOnChange={setPassword}
					err={passwordErr}
				/>
				<Input
					htmlFor="isOrg"
					label="Are you signing up as a company?"
					dropdown={true}
					handleOnChange={setIsOrg}
				/>
				<Button label="Sign Up" onClick={handleSignUp} />
				<HelperMsg
					content="Already have an account?"
					option="Sign in"
					url="login"
				/>
			</div>
		</div>
	);
};

export default SignUp;
