'use client'

import { useRef, useEffect } from 'react'
import styles from '../styles/Canvas.module.css'
import { Point, Joint } from './Canvas/Blob'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  let mouseX = 0
  let mouseY = 0
  const points: Point[] = []
  const joints: Joint[] = []
  let animation: number | null = null

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      mouseX = e.x - target.offsetLeft
      mouseY = e.y - target.offsetTop
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current

    const handleResize = () => {
      const computed = getComputedStyle(canvas.parentNode as Element)
      const w = parseInt(computed.width, 10)
      const h = parseInt(computed.height, 10)
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const setup = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 10

      const pointCount = 80
      const radius = 300
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * 2 * Math.PI
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        points.push(new Point({ x, y, damping: 0.99 }))
      }

      for (let i = 0, l = points.length; i < l; i++) {
        const pointA = points[i]
        const pointB = points[(i + 1) % l]
        const pointC = points[(i + 2) % l]
        const pointD = points[Math.floor(i + l / 2) % l]
        joints.push(new Joint(pointA, pointB, 10, 0.75))
        joints.push(new Joint(pointA, pointC, 20, 0.5))
        joints.push(new Joint(pointA, pointD, radius * 2, 0.0125))
      }
    }

    const draw = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      const hw = ctx.canvas.width / 2
      const hh = ctx.canvas.height / 2

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = 'black'

      ctx.translate(hw, hh)

      const mx = mouseX - hw
      const my = mouseY - hh

      for (let i = 0, l = points.length; i < l; i++) {
        const pointA = points[i]

        for (let j = 0, jl = joints.length; j < jl; j++) {
          joints[j].update(0.01)
        }

        pointA.collide(mx, my, 80)

        for (let j = i + 1; j < l; j++) {
          const pointB = points[j]
          const repelForce = pointA.repel(pointB.x, pointB.y, 10, 0.1)
          if (repelForce) {
            pointB.addForce(-repelForce.x, -repelForce.y)
          }
        }

        pointA.update(0.7)
        pointA.constrain(-hw, -hh, hw, hh)
      }

      ctx.beginPath()
      for (let i = 0, l = points.length; i < l; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y)
        else ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.closePath()
      ctx.fillStyle = 'black'
      ctx.fill()

      ctx.translate(-hw, -hh)

      animation = requestAnimationFrame(draw)
    }

    setup()
    animation = requestAnimationFrame(draw)

    return () => {
      if (animation) cancelAnimationFrame(animation)
    }
  }, [])

  return (
    <div className={styles.canvas}>
      <canvas width={900} height={900} ref={canvasRef} />
    </div>
  )
}
