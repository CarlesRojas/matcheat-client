import React, { useEffect, useContext, useState } from "react";
import SVG from "react-inlinesvg";
import { useSpring, animated } from "react-spring";
import gsap from "gsap";
import { Redirect } from "react-router-dom";

// Icons
import LogoIcon from "resources/logo_white.svg";
import BackIcon from "resources/icons/arrow.svg";
import NameIcon from "resources/icons/name.svg";
import EmailIcon from "resources/icons/email.svg";
import PasswordIcon from "resources/icons/password.svg";

// Contexts
import { Utils } from "contexts/Utils";
import { API } from "contexts/API";

// Constants
var SCREEN_WIDTH = window.innerWidth;

export default function Landing() {
    // Contexts
    const { clamp } = useContext(Utils);
    const { register, login } = useContext(API);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // #################################################
    //   FORMS
    // #################################################

    // Form states
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSingupForm] = useState({ name: "", email: "", password: "" });
    const [loginError, setLoginError] = useState(null);
    const [signUpError, setSignUpError] = useState(null);

    // When the login form changes
    const onLoginFormChange = (event) => {
        const { name, value } = event.target;
        setLoginForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the signup form changes
    const onSingupFormChange = (event) => {
        const { name, value } = event.target;
        setSingupForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the users tries to login
    const onLogin = async (event) => {
        event.preventDefault();

        // Login
        const loginResult = await login(loginForm.email, loginForm.password);

        // Throw error
        if ("error" in loginResult) setLoginError(loginResult.error);
        else {
            console.log(loginResult);
            console.log(`LOGIN SUCCESSFUL ${loginResult.name}`);
            setRedirectTo("/home");
        }
    };

    // When the users tries to sign up
    const onSignUp = async (event) => {
        event.preventDefault();

        // Sign Up
        const singUpResult = await register(signupForm.name, signupForm.email, signupForm.password);

        // Login
        await login(signupForm.email, signupForm.password);

        // Throw error
        if ("error" in singUpResult) setSignUpError(singUpResult.error);
        else {
            console.log(`SING UP SUCCESSFUL ${singUpResult.id}`);
            setRedirectTo("/home");
        }
    };

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Page position spring
    const [{ welcomeX, loginX, signupX }, setPagePositions] = useSpring(() => ({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH }));

    // Show the welcome screen
    const showWelcomeScreen = (first) => {
        // Fade in if it is the first time
        if (first) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".welcome > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");
        }

        resetForms();
        setPagePositions({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH });
    };

    // Show the login screen
    const showLoginScreen = () => {
        resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: 0, signupX: SCREEN_WIDTH });
    };

    // Show the signup screen
    const showSignupScreen = () => {
        resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: 0 });
    };

    // Reset all form fields and errors
    const resetForms = () => {
        setLoginError(null);
        setSignUpError(null);
        setLoginForm({ email: "", password: "" });
        setSingupForm({ name: "", email: "", password: "" });
    };

    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Accelerometer string
    const [{ tilt }, setTilt] = useSpring(() => ({ tilt: "perspective(2500px) rotateX(0deg) rotateY(0deg)" }));

    // Handle device orientation change
    const onOrientationChange = ({ gamma, beta }) => {
        setTilt({ tilt: `perspective(2500px) rotateX(${clamp(beta * 0.5, -6, 6)}deg) rotateY(${clamp(-gamma * 0.5, -6, 6)}deg)` });
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

    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    return (
        <div className="landing">
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
                    <SVG className="backButton" src={BackIcon} onClick={() => showWelcomeScreen(false)} />

                    <SVG className="logo small" src={LogoIcon} />

                    <form autoComplete="off" noValidate spellCheck="false" onSubmit={onLogin}>
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={EmailIcon} />
                            <input
                                className="input email"
                                type="email"
                                placeholder=" email"
                                name="email"
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
                                value={loginForm.password}
                                onChange={onLoginFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <button type="submit" className="button last">
                            Login
                        </button>

                        <div className="error">{loginError}</div>
                    </form>
                </animated.div>
            </animated.div>

            <animated.div className="section signup" style={{ x: signupX }}>
                <animated.div className="glass" style={{ transform: tilt }}>
                    <SVG className="backButton" src={BackIcon} onClick={() => showWelcomeScreen(false)} />

                    <SVG className="logo small" src={LogoIcon} />

                    <form autoComplete="off" noValidate spellCheck="false" onSubmit={onSignUp}>
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={NameIcon} />
                            <input
                                className="input name"
                                type="text"
                                placeholder=" name"
                                name="name"
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
                                value={signupForm.password}
                                onChange={onSingupFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <button type="submit" className="button last">
                            Sign Up
                        </button>

                        <div className="error">{signUpError}</div>
                    </form>
                </animated.div>
            </animated.div>
        </div>
    );
}
