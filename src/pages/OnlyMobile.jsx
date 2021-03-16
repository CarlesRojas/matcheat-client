import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";

// Components
import Glass from "components/Glass";

// Contexts
import { Data } from "contexts/Data";

// Icons
import LogoIcon from "resources/logo_white.svg";
import QR from "resources/qr/qr-1.png";

export default function OnlyMobile() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Home", "color: grey; font-size: 11px");

    // Contexts
    const { setBackgroundGradient, landingDone } = useContext(Data);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("blaugrana");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    return (
        <div className="onlyMobile">
            <Glass style={{ maxWidth: "600px", padding: "3rem" }}>
                <SVG className="icon" src={LogoIcon} />
                <p className="text">MatchEat is only available on mobile devices.</p>
                <p className="subtitle">Scan this QR code to open the app from your phone.</p>

                <Glass style={{}}>
                    <img src={QR} alt="" className="qrCode" />
                </Glass>
            </Glass>
        </div>
    );
}
