// utils/withAuth.js
import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import styles from "../styles/notfound.module.css"

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
      const checkAuth = async () => {
        const user = await getUserFromLocalStorage();
        if (!user) {
          console.log("page not found");
        } else {
          setUser(user);
        }
      };

      checkAuth();
    }, [router, setUser]);

    if (!user) {
      return (
        <div className={styles.error}>
          <h1 className={styles.h1}> 404 </h1>
          <p className={styles.p}>Oops! The page you're looking for is not here.</p>
        </div>
      ); // You can replace this with a loading spinner or similar
    }

    return <WrappedComponent {...props} />;
  };
};

const getUserFromLocalStorage = async () => {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("email");
    const hasSignedIn = localStorage.getItem("hasSignedIn");
    if (email && hasSignedIn === "true") {
      return { email };
    }
  }
  return null;
};

export default withAuth;
