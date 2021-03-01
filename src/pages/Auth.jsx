import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import Webcam from "react-webcam";
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
import CameraIcon from "resources/icons/cam.svg";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Constants
const SCREEN_WIDTH = window.innerWidth;

export default function Auth() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Auth", "color: grey; font-size: 11px");

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
    const [signupForm, setSingupForm] = useState({ username: "", email: "", password: "", image: "" });
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
            setRedirectTo("/home");
        }
    };

    // When the users tries to sign up
    const onSignUp = async (event) => {
        event.preventDefault();

        // Show loading screen
        showLoadingScreen();

        // Sign Up
        const singUpResult = await register(signupForm.username, signupForm.email, signupForm.password, signupForm.image);

        // Throw error
        if ("error" in singUpResult) {
            setSignUpError(singUpResult.error);
            showSignupScreen(true);
        } else {
            // Login
            const loginResult = await login(signupForm.email, signupForm.password);

            if ("error" in loginResult) {
                setSignUpError(loginResult.error);
                showSignupScreen(true);
            } else {
                console.log(`SING UP SUCCESSFUL`);
                setRedirectTo("/home");
            }
        }
    };

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Current page: "welcome" "login" "signup" "loading" "camera"
    const currPageRef = useRef("welcome");
    const [, setCurrPage] = useState("welcome");

    // Page position spring
    const [{ welcomeX, loginX, signupX, loadingX, cameraX }, setPagePositions] = useSpring(() => ({
        welcomeX: 0,
        loginX: SCREEN_WIDTH,
        signupX: SCREEN_WIDTH,
        loadingX: SCREEN_WIDTH,
        cameraX: SCREEN_WIDTH,
    }));

    // Show the welcome screen
    const showWelcomeScreen = (first) => {
        // Fade in if it is the first time
        if (first) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".welcome > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.25");
        }

        setBackgroundGradient("pink");
        resetForms();
        setPagePositions({ welcomeX: 0, loginX: SCREEN_WIDTH, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "welcome";
        setCurrPage("welcome");
    };

    // Show the login screen
    const showLoginScreen = (keepForm) => {
        setBackgroundGradient("red");
        if (!keepForm) resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: 0, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "login";
        setCurrPage("login");
    };

    // Show the signup screen
    const showSignupScreen = (keepForm) => {
        setBackgroundGradient("purple");
        if (!keepForm) resetForms();
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: 0, loadingX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "signup";
        setCurrPage("signup");
    };

    // Show the camera screen
    const showCameraScreen = () => {
        setBackgroundGradient("green");
        setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: -SCREEN_WIDTH, loadingX: SCREEN_WIDTH, cameraX: 0 });
        currPageRef.current = "camera";
        setCurrPage("camera");
    };

    // Show the signup screen
    const showLoadingScreen = () => {
        if (currPageRef.current === "login") setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: -SCREEN_WIDTH, signupX: SCREEN_WIDTH, loadingX: 0, cameraX: SCREEN_WIDTH });
        else setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: -SCREEN_WIDTH, loadingX: 0, cameraX: SCREEN_WIDTH });

        currPageRef.current = "loading";
        setCurrPage("loading");
    };

    // Reset all form fields and errors
    const resetForms = () => {
        setLoginError(null);
        setSignUpError(null);
        setLoginForm({ email: "", password: "" });
        setSingupForm({ username: "", email: "", password: "", image: "" });
    };

    // #################################################
    //   WEBCAM
    // #################################################

    // Webcam reference
    const cameraRef = React.useRef(null);

    // Capture a screenshot and save it in the register form state
    const capturePhoto = () => {
        const imageSrc = cameraRef.current.getScreenshot({ width: 400, height: 400 });

        setSingupForm((prevState) => ({ ...prevState, image: imageSrc }));
        showSignupScreen(true);
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
            if (currPageRef.current !== "login" && currPageRef.current !== "signup" && currPageRef.current !== "camera") {
                cancel();
                return;
            }

            // Snap to the welcome screen or stay on te current page
            if (!down) {
                if (currPageRef.current === "camera" && (mx > 100 || vx > 1)) showSignupScreen(true);
                else if (mx > 100 || vx > 1) showWelcomeScreen(false);
                else if (currPageRef.current === "login") showLoginScreen(true);
                else if (currPageRef.current === "signup") showSignupScreen(true);
                else showCameraScreen();
            }

            // Update the position while the gesture is active
            else {
                var displ = Math.max(mx, -20);
                if (currPageRef.current === "login")
                    setPagePositions({ welcomeX: -SCREEN_WIDTH + displ, loginX: displ, signupX: SCREEN_WIDTH, loadingX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
                else if (currPageRef.current === "signup")
                    setPagePositions({ welcomeX: -SCREEN_WIDTH + displ, loginX: SCREEN_WIDTH, signupX: displ, loadingX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
                else setPagePositions({ welcomeX: -SCREEN_WIDTH, loginX: SCREEN_WIDTH, signupX: -SCREEN_WIDTH + displ, loadingX: SCREEN_WIDTH, cameraX: displ });
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
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // If already logged in -> go to home
    if (isLoggedIn()) {
        isLoggedInRef.current = true;
        return <Redirect to={"/home"} push={true} />;
    }

    // Placeholder image if necessary
    var profileImage = signupForm.image ? (
        <img src={signupForm.image} alt="img" className="profileImage" onClick={showCameraScreen} />
    ) : (
        <div className="placeholderContainer" onClick={showCameraScreen}>
            <SVG className="profileImagePlaceholder" src={CameraIcon} />
        </div>
    );

    // Placeholder camera
    var webcam =
        currPageRef.current === "camera" ? (
            <Webcam className="webcam" audio={false} videoConstraints={{ facingMode: "user", aspectRatio: 1 }} mirrored={true} ref={cameraRef} screenshotFormat="image/png" />
        ) : null;

    return (
        <div className="auth">
            <animated.div className="section welcome" style={{ x: welcomeX }}>
                <Glass style={{ minHeight: "67%" }}>
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
                <Glass style={{ minHeight: "67%" }}>
                    <SVG className="backButton" src={BackIcon} onClick={() => showWelcomeScreen(false)} />

                    <SVG className="logo small" src={LogoIcon} />

                    <form autoComplete="off" noValidate spellCheck="false" onSubmit={onLogin}>
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={EmailIcon} />
                            <input className="input email" type="email" placeholder=" email" name="email" value={loginForm.email} onChange={onLoginFormChange} autoComplete="off"></input>
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
                <Glass style={{ minHeight: "67%" }}>
                    <SVG className="backButton" src={BackIcon} onClick={() => showWelcomeScreen(false)} />

                    {profileImage}

                    <form autoComplete="off" noValidate spellCheck="false" onSubmit={onSignUp}>
                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={NameIcon} />
                            <input
                                className="input name"
                                type="text"
                                placeholder=" name"
                                name="username"
                                value={signupForm.username}
                                onChange={onSingupFormChange}
                                autoComplete="off"
                            ></input>
                        </div>

                        <div className="inputContainer">
                            <SVG className="inputIcon email" src={EmailIcon} />
                            <input className="input email" type="email" placeholder=" email" name="email" value={signupForm.email} onChange={onSingupFormChange} autoComplete="off"></input>
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

            <animated.div className="section cam" style={{ x: cameraX }} {...gestureBind()}>
                <Glass style={{ minHeight: "67%" }}>
                    <SVG className="backButton" src={BackIcon} onClick={() => showSignupScreen(true)} />

                    {webcam}
                    {/* <Webcam
                        className="webcam"
                        audio={false}
                        videoConstraints={{ facingMode: "user", aspectRatio: 1 }}
                        mirrored={true}
                        ref={cameraRef}
                        screenshotFormat="image/png"
                    /> */}

                    <div className="camButton">
                        <SVG className="camIcon" src={CameraIcon} onClick={capturePhoto} />
                    </div>
                </Glass>
            </animated.div>

            <animated.div className="section loading" style={{ x: loadingX }}>
                <SVG className="loadingIcon" src={LogoIcon} />
            </animated.div>
        </div>
    );
}
