import { useRef, useEffect } from 'react';

// Credit to Juhani Halkomäki for the original code: https://openprocessing.org/sketch/1555443
// I've made some changes to the original so that it runs in vanilla JS and React, but the core logic is the same

class Point {
    constructor({ x, y, radius, damping, friction, parent, color = 0 }) {
        this.x = x;
        this.y = y;
        this.oldx = x;
        this.oldy = y;
        this.nextx = x;
        this.nexty = y;
        this.delayedx = x;
        this.delayedy = y;
        this.radius = radius || 10;
        this.originalRadius = radius;
        this.damping = damping || 0.9;
        this.friction = friction || 0.1;
        this.parent = parent;
        this.maxVelocity = 50;
        this.color = color;
    }

    addForce(x, y, instant = false) {
        this.nextx += x;
        this.nexty += y;
        if (instant) {
            this.delayedx = lerp(this.delayedx, this.nextx, 0.25);
            this.delayedy = lerp(this.delayedy, this.nexty, 0.25);
        }
    }

    attract(otherX, otherY, strength = 1) {
        const diffx = otherX - this.x;
        const diffy = otherY - this.y;
        const mag = diffx * diffx + diffy * diffy;
        if (mag > 0.01) {
            const magSqrt = 1 / sqrt(mag);
            this.addForce(
                diffx * magSqrt * strength, // force x
                diffy * magSqrt * strength // force y
            );
        }
    }

    repel(otherX, otherY, radius = 1, strength = 1) {
        const diffx = this.x - otherX;
        const diffy = this.y - otherY;
        const mag = diffx * diffx + diffy * diffy;
        const combinedRadius = radius + this.radius;
        const minDist = combinedRadius * combinedRadius;
        if (mag > 0 && mag < minDist) {
            const magSqrt = 1 / Math.sqrt(mag);
            const forceX = diffx * magSqrt * strength;
            const forceY = diffy * magSqrt * strength;
            this.addForce(forceX, forceY);
            return { x: forceX, y: forceY };
        }

        return null;
    }

    collide(otherX, otherY, radius) {
        const diffx = otherX - this.x;
        const diffy = otherY - this.y;
        const diffMag = Math.sqrt(diffx * diffx + diffy * diffy);
        const combinedRadius = radius + this.radius;
        if (diffMag < combinedRadius) {
            const forceMag = diffMag - combinedRadius;
            const invMag = 1 / diffMag;
            this.addForce(diffx * invMag * forceMag, diffy * invMag * forceMag, true);
        }
    }

    constrain(left, top, right, bottom) {
        const { x, y, oldx, oldy, friction, radius } = this;
        const vx = (x - oldx) * friction;
        const vy = (y - oldy) * friction;

        left += radius;
        top += radius;
        right -= radius;
        bottom -= radius;

        if (x > right) {
            this.x = right;
            this.oldx = x + vx;
        } else if (x < left) {
            this.x = left;
            this.oldx = x + vx;
        }
        if (y > bottom) {
            this.y = bottom;
            this.oldy = y + vy;
        } else if (y < top) {
            this.y = top;
            this.oldy = y + vy;
        }
    }

    update(dt = 1) {
        let vx = this.x - this.oldx;
        let vy = this.y - this.oldy;
        this.oldx = this.x - vx * this.damping * (1 - dt);
        this.oldy = this.y - vy * this.damping * (1 - dt);
        this.x = this.nextx + vx * this.damping * dt;
        this.y = this.nexty + vy * this.damping * dt;
        this.delayedx = lerp(this.delayedx, this.x, 0.1);
        this.delayedy = lerp(this.delayedy, this.y, 0.1);
        this.nextx = this.x;
        this.nexty = this.y;
    }
}

class Joint {
    constructor(pointA, pointB, len, strength) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.originalLen = len;
        this.len = len;
        this.strength = strength;
    }

    update(dt = 1) {
        const diffx = this.pointA.x - this.pointB.x;
        const diffy = this.pointA.y - this.pointB.y;
        const mag = Math.sqrt(diffx * diffx + diffy * diffy);
        const diffMag = this.len - mag;
        if (mag > 0) {
            const invMag = 1 / mag;
            const forceX = diffx * invMag * diffMag * this.strength * 0.5 * dt;
            const forceY = diffy * invMag * diffMag * this.strength * 0.5 * dt;
            this.pointA.addForce(forceX, forceY);
            this.pointB.addForce(-forceX, -forceY);
        }
    }
}

const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end;
};

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

            console.log(e);
            mouseX = e.x - e.srcElement.offsetLeft;
            mouseY = e.y - e.srcElement.offsetTop;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [])

    useEffect(() => {
        const setup = () => {
            const ctx = canvasRef.current.getContext('2d'); // create canvas context
            // set line styles so that it's easier to see the moving points and joints
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 10;

            const pointCount = 80;
            const radius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.3;
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

    return <canvas width={900} height={900} ref={canvasRef} />;
};

export default Canvas;
