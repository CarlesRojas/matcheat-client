import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";
import classnames from "classnames";
import gsap from "gsap";

// Icons
import LogoIcon from "resources/logo_white.svg";
import BackIcon from "resources/icons/arrow.svg";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function Navbar({ prevPage, onBackButtonClicked, onLogoClicked }) {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Navbar", "color: grey; font-size: 11px");

    // Contexts
    const { logout } = useContext(API);
    const { setRoomUsers, setRoomID } = useContext(Data);
    const { emit } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // #################################################
    //   LOGOUT
    // #################################################

    const [logoutActive, setLogoutActive] = useState(false);

    // Show log out button
    const onShowLogout = () => {
        if (onLogoClicked) onLogoClicked(true);
        setLogoutActive(true);

        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".buttonContainer", { height: "0rem" }, { height: "3.5rem", duration: 0.2 });
        timeline.fromTo(".navbar", { minHeight: "3rem" }, { minHeight: "6.5rem", duration: 0.2 }, "-=0.2");
        timeline.fromTo(".buttonContainer > .button", { display: "none" }, { display: "block" });
        timeline.fromTo(".buttonContainer > .button", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "-=0.5");
    };

    // Hide log out button
    const onHideLogout = () => {
        if (onLogoClicked) onLogoClicked(false);
        setLogoutActive(false);

        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".buttonContainer > .button", { opacity: 1 }, { opacity: 0, duration: 0.2 });
        timeline.fromTo(".buttonContainer > .button", { display: "block" }, { display: "none" });
        timeline.fromTo(".buttonContainer", { height: "3.5rem" }, { height: "0rem", duration: 0.2 }, "-=0.5");
        timeline.fromTo(".navbar", { minHeight: "6.5rem" }, { minHeight: "3rem", duration: 0.2 }, "-=0.5");
    };

    // Leave the room
    const leaveRoom = (inform) => {
        // Delete the room code
        setRoomID(null);

        // Clear the room users array
        setRoomUsers([]);

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // Log out
    const onLogout = () => {
        // Leave Room
        leaveRoom(true);

        // Redirect
        setRedirectTo("/");

        // Logout
        logout();
    };

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // Back button if necessary
    var backButton = onBackButtonClicked ? (
        <SVG
            className="backButton"
            src={BackIcon}
            onClick={() => {
                onBackButtonClicked();
                if (prevPage) setRedirectTo(prevPage);
            }}
        />
    ) : null;

    return (
        <div className="navbar">
            {backButton}
            <SVG className="navbarLogo" src={LogoIcon} onClick={onShowLogout} />
            <div className={classnames("clickToClose", { active: logoutActive })} onClick={onHideLogout}></div>
            <div className="buttonContainer">
                <div className="button last lower thinner" onClick={onLogout} style={{ zIndex: 100, display: "none", marginBottom: 0 }}>
                    Logout
                </div>
            </div>
        </div>
    );
}
