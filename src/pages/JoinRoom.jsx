import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import gsap from "gsap";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";
import Profile from "components/Profile";
import Room from "components/Room";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

// Constants
const SCREEN_WIDTH = window.innerWidth;

export default function JoinRoom() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Join Room", "color: grey; font-size: 11px");

    // Contexts
    const { setRoomID, setRoomUsers, isBoss, setBackgroundGradient, landingDone, image, username, socketError } = useContext(Data);
    const { emit, sub, subOnce, unsub } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   FORM
    // #################################################

    // Input reference
    const inputRef = useRef(null);

    // Form states
    const [codeForm, setCodeForm] = useState("");

    // Form Error
    const [formError, setFormError] = useState(null);

    // When the login form changes
    const onCodeFormChange = (event) => {
        const { value } = event.target;
        setCodeForm(value);
    };

    // #################################################
    //   PAGE NAVIGATION
    // #################################################

    // Current page: "join" "room"
    const currPageRef = useRef("join");
    const [, setCurrPage] = useState("join");

    // Page positions
    const [pagePositions, setPagePositions] = useSpring(() => ({ joinX: 0, roomX: SCREEN_WIDTH }));

    // Room margin for navbar
    const [roomMargin, setRoomMargin] = useState("3rem");

    // Show the join screen
    const showJoinScreen = (first, reset = true) => {
        // Fade in if it is the first time
        if (first) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".join > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.25");
        }

        if (reset) resetForms();

        //setBackgroundGradient("pink");
        setPagePositions({ joinX: 0, roomX: SCREEN_WIDTH });
        currPageRef.current = "join";
        setCurrPage("join");
    };

    // Show the room screen
    const showRoomScreen = () => {
        //setBackgroundGradient("red");
        setPagePositions({ joinX: -SCREEN_WIDTH, roomX: 0 });
        currPageRef.current = "room";
        setCurrPage("room");
    };

    // Reset all form fields and errors
    const resetForms = () => {
        setFormError(null);
        setCodeForm("");
    };

    // On navbar logo clicked
    const onLogoClicked = (open) => {
        setRoomMargin(open ? "6.5rem" : "3rem");
    };

    // #################################################
    //   ROOM
    // #################################################

    // When we recieve the current users in the room
    const onRoomUsers = (users) => {
        setRoomUsers(users);
    };

    // On a user joining the room
    const onUserJoinedRoom = ({ simplifiedUser, room }) => {
        setRoomUsers((oldArray) => [...oldArray, simplifiedUser]);
        console.log(`${simplifiedUser.username} joined the room ${room.roomID}.`);
    };

    // On a user leaving the room
    const onUserLeftRoom = ({ simplifiedUser, room }) => {
        setRoomUsers((oldArray) => oldArray.filter(({ username }) => username !== simplifiedUser.username));
        console.log(`${simplifiedUser.username} left the room ${room.roomID}.`);
    };

    // On the room starting
    const onRoomHasStarted = () => {
        // Redirect to restaurants
        setRedirectTo("/restaurants");
    };

    // Leave the room
    const leaveRoom = (inform) => {
        // Set boss to false
        isBoss.current = false;

        // Delete the room code
        setRoomID(null);

        // Clear the room users array
        setRoomUsers([]);

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // Delete room if user leaves this page
    const onBackButtonClicked = () => {
        if (currPageRef.current === "join") setRedirectTo("/home");
        else showJoinScreen(false);

        // Leave room
        leaveRoom(true);
    };

    // On code entered
    const onCodeEnter = (event) => {
        event.preventDefault();

        // Focus the input
        inputRef.current.blur();

        // Get room users
        subOnce("roomUsers", onRoomUsers);

        // Subscribe to a user joining the room
        sub("userJoinedRoom", onUserJoinedRoom);

        // Subscribe to a user leaving the room
        sub("userLeftRoom", onUserLeftRoom);

        // Subscribe to the room start event
        sub("roomHasStarted", onRoomHasStarted);

        // Create amd join the room
        emit("joinRoom", { roomID: codeForm, username: username.current });

        // Set room id
        setRoomID(codeForm);
    };

    // #################################################
    //   ERRORS
    // #################################################

    // On socket error
    const onSocketError = ({ error, errorCode }) => {
        // If user inputs a wrong room code
        if (errorCode === 610) {
            setFormError(error);
            showJoinScreen(false, false);
        }

        // On other errors
        else if (errorCode !== 621) {
            // Set error
            socketError.current = error;

            // Leave room
            leaveRoom(false);

            // Redirect to home
            setRedirectTo("/home");
        }
    };

    // On socket disconnection
    const onSocketDisconnected = () => {
        // Set error
        socketError.current = "Disconnected from the server";

        // Leave room
        leaveRoom(false);

        // Redirect to home
        setRedirectTo("/home");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("blue");

        if (landingDone.current) {
            // Show the join screen
            showJoinScreen(true);

            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", onSocketError);
            window.PubSub.sub("onSocketDisconnected", onSocketDisconnected);

            // Focus the input
            inputRef.current.focus();
        }

        // Unsubscribe on unmount
        return () => {
            unsub("roomUsers");
            unsub("userJoinedRoom");
            unsub("userLeftRoom");
            unsub("roomHasStarted");

            // Unsubscribe to error and disconnext events
            window.PubSub.unsub("onSocketError", onSocketError);
            window.PubSub.unsub("onSocketDisconnected", onSocketDisconnected);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // Style for the glass
    const joinGlassStyle = {
        minHeight: "8vh",
        padding: "2%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    };

    // Style for the glass
    const roomGlassStyle = {
        minHeight: "8vh",
        margin: "0 0 5%",
        padding: "2%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div className="joinRoom">
            <Navbar onBackButtonClicked={onBackButtonClicked} onLogoClicked={onLogoClicked}></Navbar>

            <div style={{ pointerEvents: "none", flexGrow: "1" }}></div>

            <animated.div className="section join" style={{ x: pagePositions.joinX }}>
                <Glass style={joinGlassStyle} onClick={() => {}} classes="">
                    <Profile image={image.current} text={username.current} size={"1.5rem"} clickable={false}></Profile>

                    <form autoComplete="off" noValidate spellCheck="false" onSubmit={onCodeEnter}>
                        <div className="inputContainer">
                            <input
                                className="input"
                                type="text"
                                placeholder=" enter room code"
                                value={codeForm}
                                onChange={onCodeFormChange}
                                autoComplete="off"
                                ref={inputRef}
                            ></input>
                        </div>

                        <button type="submit" className="button last" onClick={showRoomScreen}>
                            JOIN ROOM
                        </button>
                    </form>

                    <div className="error">{formError}</div>
                </Glass>
            </animated.div>

            <animated.div className="section room" style={{ x: pagePositions.roomX }}>
                <div className="marginContainer" style={{ marginTop: roomMargin }}>
                    <Room />
                    <Glass style={roomGlassStyle} classes="waiting">
                        <p>Waiting to Start...</p>
                    </Glass>
                </div>
            </animated.div>
        </div>
    );
}
