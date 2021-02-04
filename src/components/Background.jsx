import React, { useRef, useState, useEffect } from "react";
import SVG from "react-inlinesvg";

// Icons
import Icons from "resources/background.svg";

// Constants
var SCREEN_WIDTH = window.innerWidth;
//const NUM_TILES = 4;
const TILE_SIZE = SCREEN_WIDTH / 2;
const MAX_FPS = 120;
const FPS = 60;
const DECELERATION = 10;

export default function Background() {
    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Current position
    const positionRef = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Current Speed
    const pixelsPerSecond = useRef({ x: 0, y: 0 });

    // Current alpha and beta
    const motion = useRef({ alpha: 0, beta: 0 });

    // Handle device orientation change
    const onDeviceMotion = ({ rotationRate }) => {
        const { alpha, beta } = rotationRate;

        if (Math.abs(alpha) > 5 || Math.abs(beta) > 5) {
            // Save current motion only if it is bigger
            motion.current = {
                alpha: Math.sign(motion.current.alpha) === Math.sign(alpha) && Math.abs(motion.current.alpha) > Math.abs(alpha) ? motion.current.alpha : alpha,
                beta: Math.sign(motion.current.beta) === Math.sign(beta) && Math.abs(motion.current.beta) > Math.abs(beta) ? motion.current.beta : beta,
            };

            // Update speed
            pixelsPerSecond.current = {
                x: Math.abs(motion.current.beta) > 5 ? motion.current.beta : pixelsPerSecond.current.x,
                y: Math.abs(motion.current.alpha) > 5 ? motion.current.alpha : pixelsPerSecond.current.y,
            };

            console.log(`Beta: ${motion.current.beta}   XSpeed: ${pixelsPerSecond.current.x}`);
        }
    };

    // #################################################
    //   LOOP
    // #################################################

    const frameID = useRef(0);
    const frameCount = useRef(0);
    const lastFrameTime = useRef(Date.now());

    // Update actions
    const update = (deltaTime) => {
        // Frame deceleration
        const frameDesceleration = DECELERATION * deltaTime;
        console.log(frameDesceleration);

        // Update speed
        pixelsPerSecond.current = {
            x: pixelsPerSecond.current.x > 0 ? Math.max(pixelsPerSecond.current.x - frameDesceleration, 0) : Math.min(pixelsPerSecond.current.x + frameDesceleration, 0),
            y: pixelsPerSecond.current.y > 0 ? Math.max(pixelsPerSecond.current.y - frameDesceleration, 0) : Math.min(pixelsPerSecond.current.y + frameDesceleration, 0),
        };

        // Stop at low speeds
        if (Math.abs(pixelsPerSecond.current.x) < 1) pixelsPerSecond.current = { x: 0, y: pixelsPerSecond.current.y };
        if (Math.abs(pixelsPerSecond.current.y) < 1) pixelsPerSecond.current = { x: pixelsPerSecond.current.x, y: 0 };

        // Update position
        var newPosition = {
            x: positionRef.current.x + pixelsPerSecond.current.x * deltaTime,
            y: positionRef.current.y + pixelsPerSecond.current.y * deltaTime,
        };

        console.log(`XPos: ${newPosition.x}   XSpeed: ${pixelsPerSecond.current.x}`);

        setPosition(newPosition);
        positionRef.current = newPosition;
    };

    // Called every frame
    const loop = () => {
        frameCount.current++;

        if (frameCount.current >= Math.round(MAX_FPS / FPS)) {
            // Get delta time
            var currentTime = Date.now();
            var deltaTime = (currentTime - lastFrameTime.current) / 1000;
            lastFrameTime.current = currentTime;

            // Update
            update(deltaTime);
            frameCount.current = 0;
        }
        frameID.current = window.requestAnimationFrame(loop);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Resize
        const onResize = () => {
            SCREEN_WIDTH = window.innerWidth;
        };

        // Subscribe to events
        window.addEventListener("resize", onResize);
        window.addEventListener("devicemotion", onDeviceMotion, true);

        // Start loop
        loop();
        //const loopInterval = setInterval(loop, 1000 / FPS);

        // Unsubscribe from events and stop loop
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("devicemotion", onDeviceMotion, true);

            // Cancel animation
            if (frameID.current) window.cancelAnimationFrame(frameID.current);
            //clearInterval(loopInterval);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="background">
            <SVG className="cell" src={Icons} style={{ width: TILE_SIZE, transform: `translate(${position.x}px, ${position.y}px)` }} />
        </div>
    );
}
