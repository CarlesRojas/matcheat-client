import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";

// Icons
import LogoIcon from "resources/logo_white.svg";
import BackIcon from "resources/icons/arrow.svg";

export default function Navbar({ prevPage, onBackButtonClicked, style, settings = false }) {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Navbar", "color: grey; font-size: 11px");

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // #################################################
    //   SETTINGS BUTTON ACTION
    // #################################################

    // Called when the settings button is clicked
    const onSettingsButtonClicked = () => {
        if (!settings) return;

        console.log("ROJAS make settings");
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

    //var settingsButton = settings ? <SVG className="settingsButton" src={SettingsIcon} onClick={onSettingsButtonClicked} /> : null;

    return (
        <div className="navbar" style={style}>
            {backButton}
            <SVG className="navbarLogo" src={LogoIcon} onClick={onSettingsButtonClicked} />
            {/* {settingsButton} */}
        </div>
    );
}
