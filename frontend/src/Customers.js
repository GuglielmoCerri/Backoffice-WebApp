import { useEffect, useState } from "react";

const Customers = () => {
  const [authenticated, setauthenticated] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("authenticated");
    if (loggedInUser) {
      setauthenticated(loggedInUser);
    }
  }, []);

  if (!authenticated) {
  // Redirect
  } else {
    return (
      <div>
        <p>Welcome to your Customers</p>
      </div>
    );
  }
};

export default Customers;