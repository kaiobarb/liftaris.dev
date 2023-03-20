import { useRef, useEffect } from 'react';
import styles from '../styles/Canvas.module.css';
import Blob, { Point, Joint } from './Canvas/Blob';

const Canvas = () => {
    const canvasRef = useRef(null);
    let mouseX = 0;
    let mouseY = 0;
    const points = [];
    const joints = [];
    let animation = null;

    useEffect(() => {
        const handleMouseMove = (e) => {
            // getX and getY are DOM element methods which 
            // return the coordinates relative to the element
            mouseX = e.x - e.srcElement.offsetLeft;
            mouseY = e.y - e.srcElement.offsetTop;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [])

    useEffect(() => {
        if (!canvasRef) return;
        const canvas = canvasRef.current;

        const handleResize = () => {
            const computed = getComputedStyle(canvas.parentNode);
            const w = parseInt(computed.width, 10);
            const h = parseInt(computed.height, 10);
            canvas.width = w;
            canvas.height = h;
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const setup = () => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d'); // create canvas context
            // set line styles so that it's easier to see the moving points and joints
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 10;

            const pointCount = 80;
            // const radius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.3;
            const radius = 300;
            for (let i = 0; i < pointCount; i++) {
                const angle = (i / pointCount) * 2 * Math.PI;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                points.push(new Point({ x, y, damping: 0.99 }));
            }

            for (let i = 0, l = points.length; i < l; i++) {
                const pointA = points[i];
                const pointB = points[(i + 1) % l];
                const pointC = points[(i + 2) % l];
                const pointD = points[Math.floor(i + l / 2) % l];
                joints.push(new Joint(pointA, pointB, 10, 0.75));
                joints.push(new Joint(pointA, pointC, 20, 0.5));
                joints.push(new Joint(pointA, pointD, radius * 2, 0.0125));
            }
        };

        const draw = () => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d'); // create canvas context
            const hw = ctx.canvas.width / 2;
            const hh = ctx.canvas.height / 2;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = 'black';

            ctx.translate(hw, hh);

            const mx = mouseX - hw;
            const my = mouseY - hh;

            ////////////////////
            // Calculate forces
            for (let i = 0, l = points.length; i < l; i++) {
                let pointA = points[i];

                for (let i = 0, l = joints.length; i < l; i++) {
                    joints[i].update(0.01);
                }

                ////////////////////////////
                // Move points towards center
                // let gravity = Math.atan2(-pointA.y, -pointA.x) * 0.1;
                // // let gravity = Math.atan2(hh - pointA.y, hw - pointA.x) * 0.1;
                // let force = 0.2 * gravity;
                // let fx = force * Math.cos(gravity);
                // let fy = force * Math.sin(gravity);
                // pointA.addForce(fx, fy);

                // mouse interaction
                pointA.collide(mx, my, 80);

                // 
                for (let j = i + 1; j < l; j++) {
                    let pointB = points[j];
                    let repelForce = pointA.repel(pointB.x, pointB.y, 10, 0.1);
                    if (repelForce) {
                        pointB.addForce(-repelForce.x, -repelForce.y);
                    }
                }

                pointA.update(0.7);
                // Keep points within canvas
                pointA.constrain(-hw, -hh, hw, hh);
            }

            ///////////////
            // Draw points
            ctx.beginPath();
            for (let i = 0, l = points.length; i < l; i++) {
                if (i == 0) ctx.moveTo(points[i].x, points[i].y);
                else ctx.lineTo(points[i].x, points[i].y);
                // ctx.stroke();
            }
            ctx.closePath();
            // ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fill();

            ctx.translate(-hw, -hh); // reset translation back to original position

            animation = requestAnimationFrame(draw);
        };
        animation = requestAnimationFrame(draw);

        setup();
        draw();

        return () => {
            cancelAnimationFrame(animation);
        }
    }, []);

    return (<div className={styles.canvas} >
        <canvas width={900} height={900} ref={canvasRef} />
    </div>);
};

export default Canvas;
