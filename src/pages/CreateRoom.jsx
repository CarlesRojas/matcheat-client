import React, { useEffect, useContext } from "react";

// Components
import Navbar from "components/Navbar";

// Contexts
import { Data } from "contexts/Data";

export default function CreateRoom() {
    // Print Render
    if (process.env.NODE_ENV !== "production") console.log("%cRender Create Room", "color: grey; font-size: 11px");

    // Contexts
    const { setBackgroundGradient } = useContext(Data);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("green");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="createRoom">
            <Navbar></Navbar>
            <div className="container"></div>
        </div>
    );
}
