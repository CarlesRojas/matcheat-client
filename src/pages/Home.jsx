import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";

export default function Home() {
    // Contexts
    const { logout } = useContext(API);
    const { setBackgroundGradient } = useContext(Data);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Log out
    const onLogout = () => {
        setRedirectTo("/landing");
        logout();
    };

    // Redirect to new route
    if (redirectTo) {
        setBackgroundGradient("pink");
        return <Redirect to={redirectTo} push={false} />;
    }

    return (
        <div className="home">
            <div className="button" onClick={onLogout}>
                Logout
            </div>
        </div>
    );
}
