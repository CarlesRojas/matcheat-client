import React, { useEffect, useContext } from "react";

// Contexts
import { Data } from "contexts/Data";

export default function JoinRoom() {
    console.log("%cRender Join Room");

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

    return <div className="joinRoom"></div>;
}
