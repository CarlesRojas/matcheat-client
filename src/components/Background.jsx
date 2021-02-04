import React, { useRef, useState, useEffect } from "react";
import SVG from "react-inlinesvg";
import { useSpring } from "react-spring";

// Icons
import Icons from "resources/background.svg";

// Constants
var SCREEN_WIDTH = window.innerWidth;
//const NUM_TILES = 4;
const TILE_SIZE = SCREEN_WIDTH / 2;
const MAX_FPS = 120;
const FPS = 60;
const DECELERATION = 20;

export default function Background() {
    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Current position
    const positionRef = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Current Speed in pixels per second
    //const pixelsPerSecond = useRef({ x: 0, y: 0 });
    const [{ speed }, setSpeed] = useSpring(() => ({ speed: { x: 0, y: 0 } }));

    // Current alpha and beta
    const motion = useRef({ alpha: 0, beta: 0 });
    const prevMotion = useRef({ alpha: 0, beta: 0 });

    // Handle device orientation change
    const onDeviceMotion = ({ rotationRate }) => {
        const { alpha, beta } = rotationRate;

        if (Math.abs(alpha) > 20 || Math.abs(beta) > 20) {
            // Save current motion only if it is bigger
            motion.current = {
                alpha:
                    (Math.sign(motion.current.alpha) === Math.sign(alpha) || motion.current.alpha === 0) && Math.abs(motion.current.alpha) > Math.abs(alpha)
                        ? motion.current.alpha
                        : alpha,
                beta:
                    (Math.sign(motion.current.beta) === Math.sign(beta) || motion.current.beta === 0) && Math.abs(motion.current.beta) > Math.abs(beta)
                        ? motion.current.beta
                        : beta,
            };

            // Update speed
            // pixelsPerSecond.current = {
            //     x: Math.abs(motion.current.beta) > 5 ? motion.current.beta : pixelsPerSecond.current.x,
            //     y: Math.abs(motion.current.alpha) > 5 ? motion.current.alpha : pixelsPerSecond.current.y,
            // };

            //console.log(`Beta: ${motion.current.beta}   XSpeed: ${pixelsPerSecond.current.x}`);
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
        //debugger;
        // New speed same as old
        var newSpeed = { x: speed.get().x, y: speed.get().y };

        // Update x speed
        if (prevMotion.current.beta !== motion.current.beta) newSpeed.x = motion.current.beta;
        else if (newSpeed.x !== 0) newSpeed.x > 0 ? Math.max(newSpeed.x - frameDesceleration, 0) : Math.min(newSpeed.x + frameDesceleration, 0);

        // Update y speed
        if (prevMotion.current.alpha !== motion.current.alpha) newSpeed.y = motion.current.alpha;
        else if (newSpeed.y !== 0) newSpeed.y > 0 ? Math.max(newSpeed.y - frameDesceleration, 0) : Math.min(newSpeed.y + frameDesceleration, 0);

        // Set speed and save current motion
        if (prevMotion.current.beta !== motion.current.beta || prevMotion.current.alpha !== motion.current.alpha) {
            console.log(`New Beta: ${motion.current.beta}    New Speed ${newSpeed.x}`);

            setSpeed({ speed: newSpeed });
            prevMotion.current = motion.current;
        }
        // Update speed
        // pixelsPerSecond.current = {
        //     x: pixelsPerSecond.current.x > 0 ? Math.max(pixelsPerSecond.current.x - frameDesceleration, 0) : Math.min(pixelsPerSecond.current.x + frameDesceleration, 0),
        //     y: pixelsPerSecond.current.y > 0 ? Math.max(pixelsPerSecond.current.y - frameDesceleration, 0) : Math.min(pixelsPerSecond.current.y + frameDesceleration, 0),
        // };

        // // Stop at low speeds
        // if (Math.abs(pixelsPerSecond.current.x) < 1) pixelsPerSecond.current = { x: 0, y: pixelsPerSecond.current.y };
        // if (Math.abs(pixelsPerSecond.current.y) < 1) pixelsPerSecond.current = { x: pixelsPerSecond.current.x, y: 0 };

        // Update position
        var newPosition = {
            x: positionRef.current.x + speed.get().x * deltaTime,
            y: positionRef.current.y + speed.get().y * deltaTime,
        };

        console.log(`XPos: ${newPosition.x}   XSpeed: ${speed.get().x}`);

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
