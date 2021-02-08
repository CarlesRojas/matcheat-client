import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";
import classnames from "classnames";
import gsap from "gsap";

// Icons
import LogoIcon from "resources/logo_white.svg";

// Contexts
import { API } from "contexts/API";

export default function Navbar() {
    console.log("RENDER NAVBAR");

    // Contexts
    const { logout } = useContext(API);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // #################################################
    //   LOGOUT
    // #################################################

    const [logoutActive, setLogoutActive] = useState(false);

    // Show log out button
    const onShowLogout = () => {
        setLogoutActive(true);
        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".buttonContainer", { height: "0rem" }, { height: "4rem", duration: 0.2 });
        timeline.fromTo(".buttonContainer > .button", { display: "none" }, { display: "block" });
        timeline.fromTo(".buttonContainer > .button", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "-=0.5");
    };

    // Hide log out button
    const onHideLogout = () => {
        setLogoutActive(false);

        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".buttonContainer > .button", { opacity: 1 }, { opacity: 0, duration: 0.2 });
        timeline.fromTo(".buttonContainer > .button", { display: "block" }, { display: "none" });
        timeline.fromTo(".buttonContainer", { height: "4rem" }, { height: "0rem", duration: 0.2 }, "-=0.5");
    };

    // Log out
    const onLogout = () => {
        setRedirectTo("/");
        logout();
    };

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) {
        return <Redirect to={redirectTo} push={true} />;
    }

    return (
        <div className="navbar">
            <SVG className="navbarLogo" src={LogoIcon} onClick={onShowLogout} />
            <div className={classnames("clickToClose", { active: logoutActive })} onClick={onHideLogout}></div>
            <div className="buttonContainer">
                <div className="button last " onClick={onLogout} style={{ zIndex: 100, display: "none" }}>
                    Logout
                </div>
            </div>
        </div>
    );
}
