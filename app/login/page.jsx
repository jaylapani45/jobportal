"use client";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { JobContext } from "../components/context/JobContext";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import  fire  from "../utils/firebase";
import Input from "../components/common/Input";
import HelperMsg from "../components/common/HelperMsg";
import Button from "../components/common/Button";
import styles from "../styles/auth.module.css";
import { useRouter, useSearchParams } from "next/navigation";

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const { email, setEmail } = useContext(AuthContext);
  const { password, setPassword } = useContext(AuthContext);
  const { emailErr, setEmailErr } = useContext(AuthContext);
  const { passwordErr, setPasswordErr } = useContext(AuthContext);
  const { setHasSignedIn, hasSignedIn } = useContext(AuthContext);
  const { setIsOrg } = useContext(AuthContext);
  const { userJobs, setUserJobs } = useContext(JobContext);
  const router = useRouter();

  const auth = getAuth(fire);
  const db = getFirestore(fire);

    
   
  
  

  /**
   * reset values of inputs to empty string
   */
  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrs = () => {
    setEmailErr("");
    setPasswordErr("");
  };

  
  const handleLogin = async () => {
    clearErrs();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setHasSignedIn(true);
      localStorage.setItem("hasSignedIn", true);
      localStorage.setItem("email", email);

    //   const searchParams = useSearchParams();
    // const jobId = searchParams.get("jobId");
    // const fromApply = searchParams.get("fromApply");
      
      console.log(jobId,fromApply)

      if (fromApply && jobId) {
        // Apply for job if redirected from apply page
        // setLoading(true);
        console.log("hello");
        console.log(email);
        
      }
      router.push("/dashboard");
    } catch (err) {
      const { code, message } = err;
      if (
        code === "auth/invalid-email" ||
        code === "auth/user-disabled" ||
        code === "auth/user-not-found"
      ) {
        setEmailErr(message);
      }
      if (code === "auth/wrong-password") {
        setPasswordErr(message);
      }
    }
  };

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')
  const fromApply = searchParams.get('fromApply')

  const applyJob = async () =>{
    console.log("try")
    try {
      const jobDocRef = doc(db, "jobs", jobId);
      // const userDocRef = doc(db, "users", jobId.companyEmail);
      console.log("Updating job document:", jobDocRef.id);
      await updateDoc(jobDocRef, {
        applicants: arrayUnion(email),
      });

      console.log("Updating user's job list and job's applicants");
      // await updateDoc(userDocRef, {
      //   [`jobList.${jobId}.applicants`]: arrayUnion(email),
      // });
      console.log("Successfully applied for job");
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      //   setLoading(false);
    }
    router.push('/dashboard')
  }

  useEffect(() => {
    authListener();
    
    if (hasSignedIn) {
      if(jobId && fromApply){
        applyJob()
      }else{
      router.push("/dashboard");
      }
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
        <Button label="Login" onClick={handleLogin} />
        <HelperMsg
          content="Don't have an account?"
          option="Sign Up"
          url="signup"
        />
      </div>
    </div>
  );
};

export default Login;
