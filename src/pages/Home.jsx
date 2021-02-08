import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";
import gsap from "gsap";

// Components
import Glass from "components/Glass";
import Navbar from "components/Navbar";

// Icons
import CreateIcon from "resources/icons/create.svg";
import JoinIcon from "resources/icons/join.svg";

// Contexts
import { Data } from "contexts/Data";

export default function Home() {
    console.log("RENDER HOME");

    // Contexts
    const { setBackgroundGradient } = useContext(Data);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // #################################################
    //   OPTION CLICKED
    // #################################################

    // When the users creates a room
    const onCreateRoomClicked = () => {
        setRedirectTo("/createRoom");
    };

    // When the user wants to join a room
    const onJoinRoomClicked = () => {
        setRedirectTo("/joinRoom");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("fcb");

        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".home > .container > .glass", { opacity: 0 }, { opacity: 1, duration: 1 }, "+=0.5");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) {
        return <Redirect to={redirectTo} push={true} />;
    }

    return (
        <div className="home">
            <Navbar></Navbar>
            <div className="container">
                <Glass style={{ minHeight: "25%", marginBottom: "7%", padding: "10%" }} onClick={onCreateRoomClicked} classes="clickable">
                    <SVG className="icon" src={CreateIcon} />
                    <p className="text">Create Room</p>
                </Glass>

                <Glass style={{ minHeight: "25%", padding: "10%" }} onClick={onJoinRoomClicked} classes="clickable">
                    <SVG className="icon" src={JoinIcon} />
                    <p className="text">Join Room</p>
                </Glass>
            </div>
        </div>
    );
}
