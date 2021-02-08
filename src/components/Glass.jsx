import React from "react";

export default function Glass({ children, style, onClick, classes }) {
    console.log("RENDER GLASS");

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={`glass ${classes}`} style={style} onClick={onClick}>
            {children}
        </div>
    );
}
