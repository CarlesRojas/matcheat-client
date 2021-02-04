import React, { useRef, useEffect, useContext } from "react";
import SVG from "react-inlinesvg";

// Icons
import Icons from "resources/background.svg";

// Contexts
import { Data } from "contexts/Data";

// Constants
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const TILE_SIZE = SCREEN_WIDTH / 2;
const NUM_TILES = { x: Math.ceil(SCREEN_WIDTH / TILE_SIZE) + 2, y: Math.ceil(SCREEN_HEIGHT / TILE_SIZE) + 2 };
const MAX_FPS = 120;
const FPS = 60;
const DECELERATION = 10;

export default function Background() {
    // Contexts
    const { positionRef, position, setPosition, speed, setSpeed, motion, prevMotion, gradient } = useContext(Data);

    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Handle device orientation change
    const onDeviceMotion = ({ rotationRate }) => {
        const { alpha, beta } = rotationRate;

        // New motion
        var newMotion = {
            alpha: motion.current.alpha,
            beta: motion.current.beta,
        };

        // Update alpha
        if (Math.abs(alpha) > 10) {
            newMotion.alpha =
                (Math.sign(motion.current.alpha) === Math.sign(alpha) || motion.current.alpha === 0) && Math.abs(motion.current.alpha) > Math.abs(alpha)
                    ? motion.current.alpha
                    : alpha;
        }

        if (Math.abs(beta) > 10) {
            newMotion.beta =
                (Math.sign(motion.current.beta) === Math.sign(beta) || motion.current.beta === 0) && Math.abs(motion.current.beta) > Math.abs(beta)
                    ? motion.current.beta
                    : beta;
        }

        motion.current = newMotion;
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

        // New speed same as old
        var newSpeed = { x: speed.get().x, y: speed.get().y };

        // Update x speed
        if (prevMotion.current.beta !== motion.current.beta) newSpeed.x = motion.current.beta;
        else if (newSpeed.x !== 0) newSpeed.x = newSpeed.x > 0 ? Math.max(newSpeed.x - frameDesceleration, 0) : Math.min(newSpeed.x + frameDesceleration, 0);

        // Update y speed
        if (prevMotion.current.alpha !== motion.current.alpha) newSpeed.y = motion.current.alpha;
        else if (newSpeed.y !== 0) newSpeed.y = newSpeed.y > 0 ? Math.max(newSpeed.y - frameDesceleration, 0) : Math.min(newSpeed.y + frameDesceleration, 0);

        // Set speed and save current motion
        if (prevMotion.current.beta !== motion.current.beta || prevMotion.current.alpha !== motion.current.alpha) prevMotion.current = motion.current;

        // Update speed
        setSpeed({ speed: newSpeed });

        // Update position
        var newPosition = {
            x: positionRef.current.x + speed.get().x * deltaTime,
            y: positionRef.current.y + speed.get().y * deltaTime,
        };

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
        // Subscribe to events
        window.addEventListener("devicemotion", onDeviceMotion, true);

        // Start loop
        loop();

        // Unsubscribe from events and stop loop
        return () => {
            window.removeEventListener("devicemotion", onDeviceMotion, true);

            // Cancel animation
            if (frameID.current) window.cancelAnimationFrame(frameID.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tile matrix
    var tiles = [];
    for (let i = 0; i < NUM_TILES.x; i++) {
        for (let j = 0; j < NUM_TILES.y; j++) {
            // Get position
            let xPos = ((position.x + i * TILE_SIZE) % (NUM_TILES.x * TILE_SIZE)) - TILE_SIZE;
            let yPos = ((position.y + j * TILE_SIZE) % (NUM_TILES.y * TILE_SIZE)) - TILE_SIZE;

            tiles.push(
                <SVG key={`${i - 1}-${j - 1}`} className="cell" src={Icons} style={{ width: TILE_SIZE, transform: `translate(${xPos}px, ${yPos}px)` }} />
            );
        }
    }

    return (
        <div className="background" style={{ backgroundImage: gradient.get() }}>
            {tiles}
        </div>
    );
}
