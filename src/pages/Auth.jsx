import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import SVG from "react-inlinesvg";
import gsap from "gsap";

// Components
import Glass from "components/Glass";

// Icons
import LogoIcon from "resources/logo_white.svg";
import BackIcon from "resources/icons/arrow.svg";
import NameIcon from "resources/icons/name.svg";
import EmailIcon from "resources/icons/email.svg";
import PasswordIcon from "resources/icons/password.svg";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Constants
const SCREEN_WIDTH = window.innerWidth;

export default function Auth() {
    console.log("%cRender Auth");

    // Contexts
    const { register, login, isLoggedIn } = useContext(API);
    const { setBackgroundGradient } = useContext(Data);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);
    const isLoggedInRef = useRef(false);

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

        // Show loading screen
        showLoadingScreen();

        // Login
        const loginResult = await login(loginForm.email, loginForm.password);

        // Throw error
        if ("error" in loginResult) {
            setLoginError(loginResult.error);
            showLoginScreen(true);
        } else {
            console.log(`LOGIN SUCCESSFUL ${loginResult.name}`);
            setRedirectTo("/home");
        }
    };

    // When the users tries to sign up
    const onSignUp = async (event) => {
        event.preventDefault();

        // Show loading screen
        showLoadingScreen();

        // Sign Up
        const singUpResult = await register(signupForm.name, signupForm.email, signupForm.password);

        // Login
        await login(signupForm.email, signupForm.password);

        // Throw error
        if ("error" in singUpResult) {
            setSignUpError(singUpResult.error);
            showSignupScreen(true);
        } else {
            console.log(`SING UP SUCCESSFUL`);
            setRedirectTo("/home");
        }
    };

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Current page: "welcome" "login" "signup" "loading"
    const currPage = useRef("welcome");

    // Page position spring
    const [{ welcomeX, loginX, signupX, loadingX }, setPagePositions] = useSpring(() => ({
        welcomeX: 0,
        loginX: SCREEN_WIDTH,
        signupX: SCREEN_WIDTH,
        loadingX: SCREEN_WIDTH,
    }));

    // Show the welcome screen
    const showWelcomeScreen = (first) => {
        // Fade in if it is the first time
        if (first) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".welcome > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");
        }

        currPage.current = "welcome";
        setBackgroundGradient("pink");
        resetForms();
        setPagePositions({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH });
    };

    // Show the login screen
    const showLoginScreen = (formError) => {
        currPage.current = "login";
        setBackgroundGradient("red");
        if (!formError) resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: 0, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH });
    };

    // Show the signup screen
    const showSignupScreen = (formError) => {
        currPage.current = "signup";
        setBackgroundGradient("purple");
        if (!formError) resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: 0, loadingX: SCREEN_WIDTH });
    };

    // Show the signup screen
    const showLoadingScreen = () => {
        if (currPage.current === "login") setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: -SCREEN_WIDTH, signupX: SCREEN_WIDTH, loadingX: 0 });
        else setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: -SCREEN_WIDTH, loadingX: 0 });
        currPage.current = "loading";
    };

    // Reset all form fields and errors
    const resetForms = () => {
        setLoginError(null);
        setSignUpError(null);
        setLoginForm({ email: "", password: "" });
        setSingupForm({ name: "", email: "", password: "" });
    };

    // #################################################
    //   BACK GESTURE
    // #################################################

    // Horizontal gesture
    const gestureBind = useDrag(
        ({ event, cancel, canceled, down, vxvy: [vx], movement: [mx] }) => {
            // Stop event propagation
            event.stopPropagation();

            // Return if canceled
            if (canceled) return;

            // Cancel gesture
            if (currPage.current !== "login" && currPage.current !== "signup") {
                cancel();
                return;
            }

            // Snap to the welcome screen or stay on te current page
            if (!down) {
                if (mx > 100 || vx > 1) showWelcomeScreen();
                else if (currPage.current === "login") showLoginScreen(true);
                else showSignupScreen(true);
            }

            // Update the position while the gesture is active
            else {
                var displ = Math.max(mx, -20);
                if (currPage.current === "login") setPagePositions({ welcomeX: -SCREEN_WIDTH + displ, loginX: displ, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH });
                else setPagePositions({ welcomeX: -SCREEN_WIDTH + displ, loginX: SCREEN_WIDTH, signupX: displ, loadingX: SCREEN_WIDTH });
            }
        },
        { filterTaps: true, axis: "x" }
    );

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("pink");

        // Go to welcome page
        if (!isLoggedInRef.current) showWelcomeScreen(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) {
        return <Redirect to={redirectTo} push={true} />;
    }

    // If already logged in -> go to home
    if (isLoggedIn()) {
        isLoggedInRef.current = true;
        return <Redirect to={"/home"} push={true} />;
    }

    return (
        <div className="auth">
            <animated.div className="section welcome" style={{ x: welcomeX }}>
                <Glass style={{ minHeight: "70%" }}>
                    <SVG className="logo" src={LogoIcon} />

                    <div className="button" onClick={showSignupScreen}>
                        Sign Up
                    </div>

                    <div className="button lower" onClick={showLoginScreen}>
                        Login
                    </div>
                </Glass>
            </animated.div>

            <animated.div className="section login" style={{ x: loginX }} {...gestureBind()}>
                <Glass style={{ minHeight: "70%" }}>
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
                </Glass>
            </animated.div>

            <animated.div className="section signup" style={{ x: signupX }} {...gestureBind()}>
                <Glass style={{ minHeight: "70%" }}>
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
                </Glass>
            </animated.div>

            <animated.div className="section loading" style={{ x: loadingX }}>
                <SVG className="loadingIcon" src={LogoIcon} />
            </animated.div>
        </div>
    );
}
