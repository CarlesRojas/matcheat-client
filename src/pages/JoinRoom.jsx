import React, { useEffect, useContext } from "react";

// Components
import Navbar from "components/Navbar";

// Contexts
import { Data } from "contexts/Data";

export default function JoinRoom() {
    // Print Render
    if (process.env.NODE_ENV !== "production") console.log("%cRender Join Room", "color: grey; font-size: 11px");

    // Contexts
    const { setBackgroundGradient } = useContext(Data);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("blue");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="joinRoom">
            <Navbar></Navbar>
            <div className="container"></div>
        </div>
    );
}
