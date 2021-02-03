import React, { useEffect, useContext, useState } from "react";
import SVG from "react-inlinesvg";
import { useSpring, animated } from "react-spring";
import gsap from "gsap";

// Icons
import LogoIcon from "resources/logo_white.svg";
import NameIcon from "resources/icons/name.svg";
import EmailIcon from "resources/icons/email.svg";
import PasswordIcon from "resources/icons/password.svg";

// Contexts
import { Utils } from "contexts/Utils";

// Constants
var SCREEN_WIDTH = window.innerWidth;

export default function Landing() {
    // Contexts
    const { clamp } = useContext(Utils);

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Current state: "welcome", "login", "signup"
    const [currPage, setCurrPage] = useState("");

    // Page position spring
    const [{ welcomeX, loginX, signupX }, setPagePositions] = useSpring(() => ({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH }));

    // Show the welcome screen
    const showWelcomeScreen = (first) => {
        // Fade in if it is the first time
        if (first) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".welcome > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");
        }

        setCurrPage("welcome");
        setPagePositions({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH });
    };

    // Show the login screen
    const showLoginScreen = () => {
        setCurrPage("login");
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: 0, signupX: SCREEN_WIDTH });
    };

    // Show the signup screen
    const showSignupScreen = () => {
        setCurrPage("signup");
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: 0 });
    };

    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Accelerometer string
    const [{ tilt }, setTilt] = useSpring(() => ({ tilt: "perspective(2000px) rotateX(0deg) rotateY(0deg)" }));

    // Handle device orientation change
    const onOrientationChange = ({ gamma, beta }) => {
        setTilt({ tilt: `perspective(2000px) rotateX(${clamp(beta * 0.5, -10, 10)}deg) rotateY(${clamp(-gamma * 0.5, -10, 10)}deg)` });
    };

    // #################################################
    //   FORMS
    // #################################################

    // Form states
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSingupForm] = useState({ name: "", email: "", password: "" });

    // When te login form changes
    const onLoginFormChange = (event) => {
        const { name, value } = event.target;
        setLoginForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When te signup form changes
    const onSingupFormChange = (event) => {
        const { name, value } = event.target;
        setSingupForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Resize
        const onResize = () => {
            SCREEN_WIDTH = window.innerWidth;
        };

        // Go to welcome page
        showWelcomeScreen(true);

        // Subscribe to events
        window.addEventListener("resize", onResize);
        window.addEventListener("deviceorientation", onOrientationChange, true);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("deviceorientation", onOrientationChange, true);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(currPage);

    return (
        <div className="landing">
            <div className="background"></div>

            <animated.div className="section welcome" style={{ x: welcomeX }}>
                <animated.div className="glass" style={{ transform: tilt }}>
                    <SVG className="logo" src={LogoIcon} />

                    <div className="button signup" onClick={showSignupScreen}>
                        Sign Up
                    </div>

                    <div className="button login" onClick={showLoginScreen}>
                        Login
                    </div>
                </animated.div>
            </animated.div>

            <animated.div className="section login" style={{ x: loginX }}>
                <animated.div className="glass" style={{ transform: tilt }}>
                    <SVG className="logo small" src={LogoIcon} />
                    <form autoComplete="off">
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={EmailIcon} />
                            <input
                                className="input email"
                                type="email"
                                placeholder=" email"
                                name="email"
                                required
                                value={loginForm.email}
                                onChange={onLoginFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="inputContainer">
                            <SVG className="inputIcon" src={PasswordIcon} />
                            <input
                                className="input password"
                                type="password"
                                placeholder=" password"
                                name="password"
                                required
                                value={loginForm.password}
                                onChange={onLoginFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="button last" onClick={showLoginScreen}>
                            Login
                        </div>
                    </form>
                </animated.div>
            </animated.div>

            <animated.div className="section signup" style={{ x: signupX }}>
                <animated.div className="glass" style={{ transform: tilt }}>
                    <SVG className="logo small" src={LogoIcon} />
                    <form autoComplete="off">
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={NameIcon} />
                            <input
                                className="input name"
                                type="text"
                                placeholder=" name"
                                name="name"
                                required
                                value={signupForm.name}
                                onChange={onSingupFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={EmailIcon} />
                            <input
                                className="input email"
                                type="email"
                                placeholder=" email"
                                name="email"
                                required
                                value={signupForm.email}
                                onChange={onSingupFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="inputContainer">
                            <SVG className="inputIcon" src={PasswordIcon} />
                            <input
                                className="input password"
                                type="password"
                                placeholder=" password"
                                name="password"
                                required
                                value={signupForm.password}
                                onChange={onSingupFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="button last" onClick={showLoginScreen}>
                            Sign Up
                        </div>
                    </form>
                </animated.div>
            </animated.div>
        </div>
    );
}
