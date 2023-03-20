// Credit to Juhani Halkomäki for the original code: https://openprocessing.org/sketch/1555443
// I've made some changes to the original so that it runs in vanilla JS and React, but the core logic is the same

export class Point {
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

export class Joint {
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

export default class Blob {
    constructor({ x, y, radius, color, numPoints = 10, damping = 0.9, friction = 0.1 }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.numPoints = numPoints;
        this.damping = damping;
        this.friction = friction;
        this.points = [];
        this.joints = [];
        this.init();
    }

    init() {
        const { x, y, radius, numPoints, damping, friction } = this;
        const angle = (Math.PI * 2) / numPoints;
        for (let i = 0; i < numPoints; i++) {
            const point = new Point({
                x: x + cos(angle * i) * radius,
                y: y + sin(angle * i) * radius,
                damping,
                friction,
                parent: this
            });
            this.points.push(point);
        }
        for (let i = 0; i < numPoints; i++) {
            const pointA = this.points[i];
            const pointB = this.points[(i + 1) % numPoints];
            const joint = new Joint(pointA, pointB, radius, 1);
            this.joints.push(joint);
        }
    }
}