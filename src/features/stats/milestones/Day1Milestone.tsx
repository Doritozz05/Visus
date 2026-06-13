import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day1Milestone: StreakMilestone = {
  id: "day1",
  isMatch: (s) => s >= 1 && s < 5,
  canvasWidth: 67, // 24 * 2.8
  canvasHeight: 67, // 24 * 2.8
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-10 h-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        fill="#f97316"
        stroke="#fdba74"
        strokeWidth="0.5"
        animate={{
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "12px 18px" }}
      />
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );

    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f97316";
    ctx.fill(flamePath);

    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);

    ctx.restore();
  }
};
