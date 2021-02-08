import React, { useRef, useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";
import gsap from "gsap";

// Icons
import LogoIcon from "resources/logo_white.svg";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Components
import Glass from "components/Glass";

// Constants
const ASK_PERMISSIONS = false;

export default function Landing() {
    console.log("RENDER LANDING");

    // Contexts
    const { isLoggedIn } = useContext(API);
    const { setBackgroundGradient } = useContext(Data);

    // #################################################
    //   CHECK PERMISSIONS
    // #################################################

    const [permissionsChecked, setPermissionsChecked] = useState(false);
    const permissionsGranted = useRef(false);
    const checkPermissionsTimeout = useRef(null);

    // Handle device orientation change
    const onDeviceMotion = () => {
        permissionsGranted.current = true;
        setPermissionsChecked(true);
    };

    // On grant permissions clicked
    const onGrantPermissionsClick = () => {
        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".permissions > .glass", { opacity: 1 }, { opacity: 0, duration: 1 });

        DeviceMotionEvent.requestPermission()
            .then(() => {
                // On permissions granted or denied -> Keep going anyway
                permissionsGranted.current = true;
                setPermissionsChecked(true);
            })
            .catch(() => {
                // On error -> Keep going anyway
                permissionsGranted.current = true;
                setPermissionsChecked(true);
            });
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("pink");

        // Subscribe to events
        window.addEventListener("devicemotion", onDeviceMotion, true);

        // Start timer to check for the permissions
        if (ASK_PERMISSIONS && typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
            checkPermissionsTimeout.current = setTimeout(() => {
                // permissions have been granted
                if (permissionsGranted.current) {
                    permissionsGranted.current = true;
                    setPermissionsChecked(true);
                }

                // Permissions have never been granted
                else {
                    const timeline = gsap.timeline({ defaults: { ease: "power1" } });
                    timeline.fromTo(".permissions > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");
                }
            }, 200);
        }

        // No permissions needed
        else {
            permissionsGranted.current = true;
            setPermissionsChecked(true);
        }

        // Unsubscribe from events and stop loop
        return () => {
            window.removeEventListener("devicemotion", onDeviceMotion, true);
            clearTimeout(checkPermissionsTimeout.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    if (!permissionsChecked || !permissionsGranted.current)
        return (
            <div className="landing">
                <div className="section permissions">
                    <Glass style={{ minHeight: "50%" }}>
                        <SVG className="logo small" src={LogoIcon} />

                        <div className="askPermissionText">To work properly, MatchEat needs pemission to use your phone location and accelerometer.</div>

                        <div className="button" onClick={onGrantPermissionsClick}>
                            Grant Permission
                        </div>
                    </Glass>
                </div>
            </div>
        );

    // Already logged in -> Go Home
    if (isLoggedIn()) return <Redirect to={"/home"} push={true} />;

    // Not logged in -> Go to Auth
    return <Redirect to={"/auth"} push={true} />;
}
