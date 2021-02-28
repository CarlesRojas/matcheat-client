import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";
import gsap from "gsap";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";
import Room from "components/Room";

// Icons
import CopyIcon from "resources/icons/copy.svg";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function CreateRoom() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Create Room", "color: grey; font-size: 11px");

    // Contexts
    const { createUniqueID, copy } = useContext(Utils);
    const { roomID, setRoomID, setRoomUsers, isBoss, setBackgroundGradient, landingDone, username, socketError } = useContext(Data);
    const { emit, sub, subOnce, unsub } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

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
        // Redirect to loading
        setRedirectTo("/loading");
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
        // Leave room
        leaveRoom(true);
    };

    // On room start
    const onRoomStart = () => {
        // Set as boss
        isBoss.current = true;

        // Inform that the room starts
        emit("broadcastMessageToRoom", { message: "roomHasStarted", roomID });
    };

    // #################################################
    //   ERRORS
    // #################################################

    // Throw an error and go home
    const throwError = ({ error }) => {
        // Set error
        socketError.current = error;

        // Leave room
        leaveRoom(false);

        // Redirect to home
        setRedirectTo("/home");
    };

    // #################################################
    //   COPY CODE
    // #################################################

    // Code reference
    const codeCopiedRef = useRef(null);

    // On Code copied
    const onCopyCode = () => {
        // Show the copied message for a second
        codeCopiedRef.current.classList.remove("fadeOut");
        void codeCopiedRef.current.offsetWidth;
        codeCopiedRef.current.classList.add("fadeOut");

        // Copy code to clipboard
        copy("roomCode");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("green");

        if (landingDone.current) {
            // Animate
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".createRoom > .container > .glass", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.25");

            // Create room code
            const newCode = createUniqueID(6);
            setRoomID(newCode);
            if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log(newCode);

            // Get room users
            subOnce("roomUsers", onRoomUsers);

            // Create amd join the room
            emit("createRoom", { roomID: newCode, username: username.current });

            // Subscribe to a user joining the room
            sub("userJoinedRoom", onUserJoinedRoom);

            // Subscribe to a user leaving the room
            sub("userLeftRoom", onUserLeftRoom);

            // Subscribe to the room start event
            sub("roomHasStarted", onRoomHasStarted);

            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);
        }

        // Unsubscribe on unmount
        return () => {
            unsub("roomUsers");
            unsub("userJoinedRoom");
            unsub("userLeftRoom");
            unsub("roomHasStarted");

            // Unsubscribe to error and disconnext events
            window.PubSub.unsub("onSocketError", throwError);
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
        margin: "0 0 5%",
        padding: "2%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div className="createRoom">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container">
                <Room />
                <p className="codeCopied" ref={codeCopiedRef}>
                    Code Copied
                </p>
                <Glass style={glassStyle} onClick={onCopyCode} classes="clickable">
                    <form autoComplete="off" noValidate spellCheck="false">
                        <input id="roomCode" className="roomCode" type="text" defaultValue={roomID ? roomID : ""} />
                    </form>
                    <SVG className="copyIcon" src={CopyIcon} />
                </Glass>

                <div className="button last" style={{ width: "90%", minHeight: "2.7em" }} onClick={onRoomStart}>
                    START
                </div>
            </div>
        </div>
    );
}
