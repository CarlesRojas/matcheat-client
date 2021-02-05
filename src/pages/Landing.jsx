import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { API } from "contexts/API";

export default function Landing() {
    // Contexts
    const { isLoggedIn } = useContext(API);

    // Already logged in -> Go Home
    if (isLoggedIn()) return <Redirect to={"/home"} push={false} />;

    // Not logged in -> Go to Auth
    return <Redirect to={"/auth"} push={false} />;
}
