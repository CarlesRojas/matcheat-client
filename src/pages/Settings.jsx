import React, { useEffect, useContext, useState, useRef } from "react";

import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import Webcam from "react-webcam";
import SVG from "react-inlinesvg";
import classnames from "classnames";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";
import Setting from "components/Setting";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Icons
import LogoIcon from "resources/logo_white.svg";
import SettingsIcon from "resources/icons/settings.svg";
import UserIcon from "resources/icons/user.svg";
import EmailIcon from "resources/icons/email.svg";
import PasswordIcon from "resources/icons/password.svg";
import CameraIcon from "resources/icons/cam.svg";
import ReverseIcon from "resources/icons/reverse.svg";
import FolderIcon from "resources/icons/folder.svg";

// Constants
const SCREEN_WIDTH = window.innerWidth;

export default function Settings() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Settings", "color: grey; font-size: 11px");

    // Contexts
    const { vibrate, cropAndResizeImage } = useContext(Utils);
    const { setBackgroundGradient, landingDone, vibrationSetting } = useContext(Data);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   FORMS
    // #################################################

    // Form states
    const [changeUsernameForm, setChangeUsernameForm] = useState({ username: "", password: "" });
    const [changeEmailForm, setChangeEmailForm] = useState({ email: "", password: "" });
    const [changePasswordForm, setChangePasswordForm] = useState({ newPassword: "", password: "" });
    const [changeImageForm, setChangeImageForm] = useState({ image: "", password: "" });

    // Errors in forms
    const [changeUsernameError, setChangeUsernameError] = useState(null);
    const [changeEmailError, setChangeEmailError] = useState(null);
    const [changePasswordError, setChangePasswordError] = useState(null);
    const [changeImageError, setChangeImageError] = useState(null);
    const [camError, setCamError] = useState(null);

    // Success message
    const [successMessage, setSuccessMessage] = useState(null);

    // When the change username form changes
    const onChangeUsernameFormChange = (event) => {
        const { name, value } = event.target;
        setChangeUsernameForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the change email form changes
    const onChangeEmailFormChange = (event) => {
        const { name, value } = event.target;
        setChangeEmailForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the change password form changes
    const onChangePasswordFormChange = (event) => {
        const { name, value } = event.target;
        setChangePasswordForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the change image form changes
    const onChangeImageFormChange = (event) => {
        const { name, value } = event.target;
        setChangeImageForm((prevState) => ({ ...prevState, [name]: value }));
    };

    // When the users tries to change the username
    const onChangeUsername = async (event) => {
        event.preventDefault();

        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        // Login
        // ROJAS ADD API CALL
        //const result = await login(loginForm.email, loginForm.password);
        const result = {};

        // Throw error
        if ("error" in result) setChangeUsernameError(result.error);
        else {
            setSuccessMessage("User changed successfully");
            showMainScreen(false);
        }
    };

    // When the users tries to change the email
    const onChangeEmail = async (event) => {
        event.preventDefault();

        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        // Login
        // ROJAS ADD API CALL
        //const result = await login(loginForm.email, loginForm.password);
        const result = {};

        // Throw error
        if ("error" in result) setChangeEmailError(result.error);
        else {
            setSuccessMessage("Email changed successfully");
            showMainScreen(false);
        }
    };

    // When the users tries to change the password
    const onChangePassword = async (event) => {
        event.preventDefault();

        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        // Login
        // ROJAS ADD API CALL
        //const result = await login(loginForm.email, loginForm.password);
        const result = {};

        // Throw error
        if ("error" in result) setChangePasswordError(result.error);
        else {
            setSuccessMessage("Password changed successfully");
            showMainScreen(false);
        }
    };

    // When the users tries to change the image
    const onChangeImage = async (event) => {
        event.preventDefault();

        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        // Login
        // ROJAS ADD API CALL
        //const result = await login(loginForm.email, loginForm.password);
        const result = {};

        // Throw error
        if ("error" in result) setChangeImageError(result.error);
        else {
            setSuccessMessage("Image changed successfully");
            showMainScreen(false);
        }
    };

    // When the user changes the vibration setting
    const onVibrationSettingChange = (newValue) => {
        console.log(`Vibrate ${newValue}`);

        // ROJAS ADD API CALL
    };

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Current page: "main" "changeUsername" "changeEmail" "changePassword" "changeImage" "camera"
    const currPageRef = useRef("main");
    const [, setCurrPage] = useState("main");

    // Page position spring
    const [pagePositions, setPagePositions] = useSpring(() => ({
        mainX: 0,
        changeUsernameX: SCREEN_WIDTH,
        changeEmailX: SCREEN_WIDTH,
        changePasswordX: SCREEN_WIDTH,
        changeImageX: SCREEN_WIDTH,
        cameraX: SCREEN_WIDTH,
    }));

    // Show the main screen
    const showMainScreen = (first) => {
        // Vibrate
        if (!first && vibrationSetting.current) vibrate(25);

        setBackgroundGradient("purple");
        resetForms();
        setPagePositions({ mainX: 0, changeUsernameX: SCREEN_WIDTH, changeEmailX: SCREEN_WIDTH, changePasswordX: SCREEN_WIDTH, changeImageX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "main";
        setCurrPage("main");
    };

    // Show the change username screen
    const showChangeUsernameScreen = (keepForm) => {
        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        setBackgroundGradient("pink");
        if (!keepForm) resetForms();
        setSuccessMessage();
        setPagePositions({ mainX: -SCREEN_WIDTH, changeUsernameX: 0, changeEmailX: SCREEN_WIDTH, changePasswordX: SCREEN_WIDTH, changeImageX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "changeUsername";
        setCurrPage("changeUsername");
    };

    // Show the change email screen
    const showChangeEmailScreen = (keepForm) => {
        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        setBackgroundGradient("pink");
        if (!keepForm) resetForms();
        setSuccessMessage();
        setPagePositions({ mainX: -SCREEN_WIDTH, changeUsernameX: SCREEN_WIDTH, changeEmailX: 0, changePasswordX: SCREEN_WIDTH, changeImageX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "changeEmail";
        setCurrPage("changeEmail");
    };

    // Show the change password screen
    const showChangePasswordScreen = (keepForm) => {
        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        setBackgroundGradient("pink");
        if (!keepForm) resetForms();
        setSuccessMessage();
        setPagePositions({ mainX: -SCREEN_WIDTH, changeUsernameX: SCREEN_WIDTH, changeEmailX: SCREEN_WIDTH, changePasswordX: 0, changeImageX: SCREEN_WIDTH, cameraX: SCREEN_WIDTH });
        currPageRef.current = "changePassword";
        setCurrPage("changePassword");
    };

    // Show the change image screen
    const showChangeImageScreen = (keepForm) => {
        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        setBackgroundGradient("pink");
        if (!keepForm) resetForms();
        setSuccessMessage();
        setPagePositions({ mainX: -SCREEN_WIDTH, changeUsernameX: SCREEN_WIDTH, changeEmailX: SCREEN_WIDTH, changePasswordX: SCREEN_WIDTH, changeImageX: 0, cameraX: SCREEN_WIDTH });
        currPageRef.current = "changeImage";
        setCurrPage("changeImage");
    };

    // Show the camera screen
    const showCameraScreen = () => {
        // Vibrate
        if (vibrationSetting.current) vibrate(25);

        setBackgroundGradient("lime");
        setPagePositions({ mainX: -SCREEN_WIDTH, changeUsernameX: SCREEN_WIDTH, changeEmailX: SCREEN_WIDTH, changePasswordX: SCREEN_WIDTH, changeImageX: -SCREEN_WIDTH, cameraX: 0 });
        currPageRef.current = "camera";
        setCurrPage("camera");
    };

    // Reset all form fields and errors
    const resetForms = () => {
        setChangeUsernameForm({ username: "", password: "" });
        setChangeEmailForm({ email: "", password: "" });
        setChangePasswordForm({ newPassword: "", password: "" });
        setChangeImageForm({ image: "", password: "" });
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
            if (
                currPageRef.current !== "changeUsername" &&
                currPageRef.current !== "changeEmail" &&
                currPageRef.current !== "changePassword" &&
                currPageRef.current !== "changeImage" &&
                currPageRef.current !== "camera"
            ) {
                cancel();
                return;
            }

            // Snap to the welcome screen or stay on the current page
            if (!down) {
                if (currPageRef.current === "camera" && (mx > 100 || vx > 1)) showChangeImageScreen(true);
                else if (mx > 100 || vx > 1) showMainScreen(false);
                else if (currPageRef.current === "changeUsername") showChangeUsernameScreen(true);
                else if (currPageRef.current === "changeEmail") showChangeEmailScreen(true);
                else if (currPageRef.current === "changePassword") showChangePasswordScreen(true);
                else if (currPageRef.current === "changeImage") showChangeImageScreen(true);
                else if (currPageRef.current === "camera") showCameraScreen();
            }

            // Update the position while the gesture is active
            else {
                var displ = Math.max(mx, -20);
                if (currPageRef.current === "changeUsername")
                    setPagePositions({
                        mainX: -SCREEN_WIDTH + displ,
                        changeUsernameX: displ,
                        changeEmailX: SCREEN_WIDTH,
                        changePasswordX: SCREEN_WIDTH,
                        changeImageX: SCREEN_WIDTH,
                        cameraX: SCREEN_WIDTH,
                    });
                else if (currPageRef.current === "changeEmail")
                    setPagePositions({
                        mainX: -SCREEN_WIDTH + displ,
                        changeUsernameX: SCREEN_WIDTH,
                        changeEmailX: displ,
                        changePasswordX: SCREEN_WIDTH,
                        changeImageX: SCREEN_WIDTH,
                        cameraX: SCREEN_WIDTH,
                    });
                else if (currPageRef.current === "changePassword")
                    setPagePositions({
                        mainX: -SCREEN_WIDTH + displ,
                        changeUsernameX: SCREEN_WIDTH,
                        changeEmailX: SCREEN_WIDTH,
                        changePasswordX: displ,
                        changeImageX: SCREEN_WIDTH,
                        cameraX: SCREEN_WIDTH,
                    });
                else if (currPageRef.current === "changeImage")
                    setPagePositions({
                        mainX: -SCREEN_WIDTH + displ,
                        changeUsernameX: SCREEN_WIDTH,
                        changeEmailX: SCREEN_WIDTH,
                        changePasswordX: SCREEN_WIDTH,
                        changeImageX: displ,
                        cameraX: SCREEN_WIDTH,
                    });
                else if (currPageRef.current === "camera")
                    setPagePositions({
                        mainX: -SCREEN_WIDTH,
                        changeUsernameX: SCREEN_WIDTH,
                        changeEmailX: SCREEN_WIDTH,
                        changePasswordX: SCREEN_WIDTH,
                        changeImageX: -SCREEN_WIDTH + displ,
                        cameraX: displ,
                    });
            }
        },
        { filterTaps: true, axis: "x" }
    );

    // #################################################
    //   WEBCAM
    // #################################################

    // Webcam reference
    const cameraRef = React.useRef(null);

    // Facing mode: "user" or "environment"
    const [facingMode, setFacingMode] = useState("user");
    const [numCameras, setNumCameras] = useState(2);

    // Capture a screenshot and save it in the register form state
    const capturePhoto = () => {
        const imageSrc = cameraRef.current.getScreenshot({ width: 400, height: 400 });

        setChangeImageForm((prevState) => ({ ...prevState, image: imageSrc }));
        showChangeImageScreen(true);
    };

    // Reverse camera
    const reverseCamera = () => {
        setFacingMode((prevState) => (prevState === "user" ? "environment" : "user"));
    };

    // #################################################
    //   IMAGE FILE
    // #################################################

    // Image input ref
    const imageInputRef = useRef(null);

    // Validate that the file is an image
    const validateFileType = async (event) => {
        // Return if there is no file
        if (!event.target.files || !event.target.files[0]) return;

        // Get file type
        var fileName = imageInputRef.current.value;
        var extension = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();

        // Crop and resize
        if (extension === "png" || extension === "jpg" || extension === "jpeg") {
            try {
                var croppedImage = await cropAndResizeImage(URL.createObjectURL(event.target.files[0]), 1, 400);
                setChangeImageForm((prevState) => ({ ...prevState, image: croppedImage }));
                showChangeImageScreen(true);
            } catch (error) {
                setCamError("Unable to load image");
            }
        }

        // Set error
        else setCamError("Wrong file type");
    };

    // Get image file from the system files
    const searchImageFile = () => {
        imageInputRef.current.click();
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    const onBackButtonClicked = () => {
        if (currPageRef.current === "main") setRedirectTo("/home");
        else if (currPageRef.current === "camera") showChangeImageScreen(false);
        else showMainScreen(false);
    };

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("purple");

        if (landingDone.current) {
            // Get number of cameras
            const getNumCams = async () => {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter(({ kind, label }) => kind === "videoinput" && !label.includes("OBS"));
                setNumCameras(cameras.length);
            };
            getNumCams();

            resetForms();

            // Show main settings screen
            showMainScreen(true);
        }

        // Unsubscribe on unmount
        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // Placeholder image if necessary
    var profileImage = changeImageForm.image ? (
        <img src={changeImageForm.image} alt="img" className="profileImage" onClick={showCameraScreen} />
    ) : (
        <div className="placeholderContainer" onClick={showCameraScreen}>
            <SVG className="profileImagePlaceholder" src={CameraIcon} />
        </div>
    );

    // Placeholder camera
    var webcam =
        currPageRef.current === "camera" ? (
            <Webcam
                className="webcam"
                audio={false}
                videoConstraints={{ facingMode: facingMode, aspectRatio: 1 }}
                mirrored={facingMode === "user"}
                ref={cameraRef}
                screenshotFormat="image/png"
            />
        ) : null;

    return (
        <div className="settings">
            <Navbar onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container">
                <animated.div className="section main" style={{ x: pagePositions.mainX }}>
                    <Glass style={{ minHeight: "67%" }}>
                        <SVG className="settingsIcon" src={SettingsIcon} />

                        <div className="button lower closer" onClick={showChangeUsernameScreen}>
                            Change Name
                        </div>

                        <div className="button lower closer" onClick={showChangeEmailScreen}>
                            Change Email
                        </div>

                        <div className="button lower closer" onClick={showChangePasswordScreen}>
                            Change Password
                        </div>

                        <div className="button lower closer" onClick={showChangeImageScreen}>
                            Change Image
                        </div>

                        <Setting name="Vibration" action={onVibrationSettingChange} setting={vibrationSetting}></Setting>

                        <div className="success">{successMessage}</div>
                    </Glass>
                </animated.div>

                <animated.div className="section changeUsername" style={{ x: pagePositions.changeUsernameX }} {...gestureBind()}>
                    <Glass style={{ minHeight: "67%" }}>
                        <SVG className="logo small" src={LogoIcon} />

                        <form autoComplete="off" noValidate spellCheck="false" onSubmit={onChangeUsername}>
                            <div className="inputContainer">
                                <SVG className="inputIcon" src={UserIcon} />
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=" new name"
                                    name="username"
                                    value={changeUsernameForm.username}
                                    onChange={onChangeUsernameFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <div className="inputContainer">
                                <SVG className="inputIcon" src={PasswordIcon} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder=" password"
                                    name="password"
                                    value={changeUsernameForm.password}
                                    onChange={onChangeUsernameFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <button type="submit" className="button closer">
                                Change Name
                            </button>

                            <div className="error">{changeUsernameError}</div>
                        </form>
                    </Glass>
                </animated.div>

                <animated.div className="section changeEmail" style={{ x: pagePositions.changeEmailX }} {...gestureBind()}>
                    <Glass style={{ minHeight: "67%" }}>
                        <SVG className="logo small" src={LogoIcon} />

                        <form autoComplete="off" noValidate spellCheck="false" onSubmit={onChangeEmail}>
                            <div className="inputContainer">
                                <SVG className="inputIcon email" src={EmailIcon} />
                                <input
                                    className="input"
                                    type="email"
                                    placeholder=" new email"
                                    name="email"
                                    value={changeEmailForm.email}
                                    onChange={onChangeEmailFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <div className="inputContainer">
                                <SVG className="inputIcon" src={PasswordIcon} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder=" password"
                                    name="password"
                                    value={changeEmailForm.password}
                                    onChange={onChangeEmailFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <button type="submit" className="button closer">
                                Change Email
                            </button>
                            <div className="error">{changeEmailError}</div>
                        </form>
                    </Glass>
                </animated.div>

                <animated.div className="section changePassword" style={{ x: pagePositions.changePasswordX }} {...gestureBind()}>
                    <Glass style={{ minHeight: "67%" }}>
                        <SVG className="logo small" src={LogoIcon} />

                        <form autoComplete="off" noValidate spellCheck="false" onSubmit={onChangePassword}>
                            <div className="inputContainer">
                                <SVG className="inputIcon" src={PasswordIcon} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder=" new password"
                                    name="newPassword"
                                    value={changePasswordForm.password}
                                    onChange={onChangePasswordFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <div className="inputContainer">
                                <SVG className="inputIcon" src={PasswordIcon} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder=" old password"
                                    name="password"
                                    value={changePasswordForm.password}
                                    onChange={onChangePasswordFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <button type="submit" className="button closer">
                                Change Password
                            </button>

                            <div className="error">{changePasswordError}</div>
                        </form>
                    </Glass>
                </animated.div>

                <animated.div className="section changeImage" style={{ x: pagePositions.changeImageX }} {...gestureBind()}>
                    <Glass style={{ minHeight: "67%" }}>
                        {profileImage}

                        <form autoComplete="off" noValidate spellCheck="false" onSubmit={onChangeImage}>
                            <div className="inputContainer">
                                <SVG className="inputIcon" src={PasswordIcon} />
                                <input
                                    className="input"
                                    type="password"
                                    placeholder=" password"
                                    name="password"
                                    value={changeImageForm.password}
                                    onChange={onChangeImageFormChange}
                                    autoComplete="off"
                                ></input>
                            </div>

                            <button type="submit" className="button closer">
                                Change Image
                            </button>

                            <div className="error">{changeImageError}</div>
                        </form>
                    </Glass>
                </animated.div>

                <animated.div className="section camera" style={{ x: pagePositions.cameraX }} {...gestureBind()}>
                    <Glass style={{ minHeight: "67%" }}>
                        {webcam}

                        <div className="camControls">
                            <SVG className={classnames("camControlIcon", { disabled: numCameras < 2 })} src={ReverseIcon} onClick={reverseCamera} />

                            <div className={classnames("camButton", { disabled: numCameras < 1 })}>
                                <SVG className="camIcon" src={CameraIcon} onClick={capturePhoto} />
                            </div>

                            <SVG className="camControlIcon" src={FolderIcon} onClick={searchImageFile} />
                            <input name="image" type="file" className="inputImage" accept=".jpg,.jpeg,.png" onChange={validateFileType} ref={imageInputRef} />
                        </div>

                        <div className="error">{camError}</div>
                    </Glass>
                </animated.div>
            </div>
        </div>
    );
}
