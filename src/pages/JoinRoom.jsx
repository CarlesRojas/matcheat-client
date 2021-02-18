import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import gsap from "gsap";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";
import Profile from "components/Profile";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function JoinRoom() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Join Room", "color: grey; font-size: 11px");

    // Contexts
    const { setRoomID, setBackgroundGradient, landingDone, image, username, socketError } = useContext(Data);
    const { emit, sub, unsub } = useContext(Socket);

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

    // When the login form changes
    const onCodeFormChange = (event) => {
        const { value } = event.target;
        setCodeForm(value);
    };

    // #################################################
    //   ROOM
    // #################################################

    // On a user joining the room
    const onUserJoinedRoom = ({ simplifiedUser, room }) => {
        console.log(`${simplifiedUser.username} joined the room ${room.roomID}.`);
    };

    // On a user leaving the room
    const onUserLeftRoom = ({ simplifiedUser, room }) => {
        console.log(`${simplifiedUser.username} left the room ${room.roomID}.`);
    };

    // Delete room if user leaves this page
    const onBackButtonClicked = () => {
        setRoomID(null);

        // Leave Room
        emit("leaveRoom", {});
    };

    // On code entered
    const onCodeEnter = (event) => {
        event.preventDefault();

        // Create amd join the room
        emit("joinRoom", { roomID: codeForm, username: username.current });

        // Subscribe to a user joining the room
        sub("userJoinedRoom", onUserJoinedRoom);

        // Subscribe to a user leaving the room
        sub("userLeftRoom", onUserLeftRoom);

        // Set room id
        setRoomID(codeForm);
    };

    // #################################################
    //   ERRORS
    // #################################################

    // On socket error
    const onSocketError = ({ error }) => {
        socketError.current = error;
        setRedirectTo("/home");
    };

    // On socket disconnection
    const onSocketDisconnected = () => {
        socketError.current = "Disconnected from the server";
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
            // Animate
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".joinRoom > .container > .glass", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.25");

            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", onSocketError);
            window.PubSub.sub("onSocketDisconnected", onSocketDisconnected);

            // Focus the input
            inputRef.current.focus();
        }

        // Unsubscribe on unmount
        return () => {
            unsub("userJoinedRoom", onUserJoinedRoom);
            unsub("userLeftRoom", onUserLeftRoom);

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
    const glassStyle = {
        minHeight: "8vh",
        padding: "2%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div className="joinRoom">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container">
                <Glass style={glassStyle} onClick={() => {}} classes="">
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

                        <button type="submit" className="button last">
                            JOIN ROOM
                        </button>
                    </form>
                </Glass>
            </div>
        </div>
    );
}
