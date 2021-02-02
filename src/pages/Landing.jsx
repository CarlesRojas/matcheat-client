import React, { useEffect, useContext } from "react";
import SVG from "react-inlinesvg";
import { useSpring, animated } from "react-spring";

// Icons
import LogoIcon from "resources/logo_white.svg";

// Contexts
import { Utils } from "contexts/Utils";

export default function Landing() {
    // Contexts
    const { clamp } = useContext(Utils);

    // Accelerometer string
    //const [tilt, setTilt] = useSpring(() => ({ tilt: "perspective(600px) rotateX(0deg) rotateY(0deg)" /*, config: { mass: 5, tension: 350, friction: 40 } */ }));
    const [{ tilt }, setTilt] = useSpring(() => ({ tilt: "perspective(600px) rotateX(0deg) rotateY(0deg)" }));

    // Handle device orientation change
    const onOrientationChange = ({ gamma, beta }) => {
        console.log(gamma, beta);
        setTilt({ tilt: `perspective(600px) rotateX(${clamp(beta * 0.5, -10, 10)}deg) rotateY(${clamp(-gamma * 0.5, -10, 10)}deg)` });
    };

    // Subscribe to events
    useEffect(() => {
        window.addEventListener("deviceorientation", onOrientationChange, true);
        return () => {
            window.removeEventListener("deviceorientation", onOrientationChange, true);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="landing">
            <div className="background"></div>

            <animated.div className="glass" style={{ transform: tilt }}>
                <SVG className="logo" src={LogoIcon} />
                <div className="button">Sign Up</div>
                <div className="button login">Login</div>
            </animated.div>
        </div>
    );
}
