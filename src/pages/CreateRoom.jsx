import React, { useEffect, useContext } from "react";

// Contexts
import { Data } from "contexts/Data";

export default function CreateRoom() {
    console.log("RENDER CREATE ROOM");

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

    return <div className="createRoom"></div>;
}
