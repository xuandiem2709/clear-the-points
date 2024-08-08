"use client";

import { useState } from "react";
import "./main.scss";

type Circle = {
  id: number;
  left: string;
  top: string;
  isClicked: boolean;
  visibility: "visible" | "hidden";
};
const status = {
  play: "LET'S PLAY",
  lose: "GAME OVER",
  win: "ALL CLEARED",
};

export default function GameUI() {
  const [points, setPoints] = useState(3);
  const [time, setTime] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [buttonLabel, setButtonLabel] = useState("Play");
  const [title, setTitle] = useState(status.play);
  const [clickCount, setClickCount] = useState(0);

  const getStatusClass = (title: any) => {
    switch (title) {
      case status.lose:
        return "lose";
      case status.win:
        return "win";
      default:
        return "play";
    }
  };

  const handleRestart = () => {
    if (timerId) {
      clearInterval(timerId);
    }

    setTime(0);
    const newCircles: Circle[] = [...Array(points)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 90}%`,
      isClicked: false,
      visibility: "visible",
    }));
    setCircles(newCircles);

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 0.1);
    }, 100);
    setTimerId(interval);
    setButtonLabel("Restart");
    setTitle(status.play);
    setClickCount(0);
  };

  const handleCircleClick = (id: number) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id ? { ...circle, isClicked: true } : circle
      )
    );

    if (clickCount <= circles.length) {
      if (id === clickCount) {
        setClickCount((prevCount) => prevCount + 1);

        setTimeout(() => {
          setCircles((prevCircles) =>
            prevCircles.map((circle) =>
              circle.id === id ? { ...circle, visibility: "hidden" } : circle
            )
          );
          if (clickCount + 1 === circles.length) {
            setTitle(status.win);
            if (timerId) {
              clearInterval(timerId);
            }
          }
        }, 1000);
      } else {
        setTitle(status.lose);
        if (timerId) {
          clearInterval(timerId);
        }
      }
    }
  };

  return (
    <div className="container">
      <h2 className={`title ${getStatusClass(title)}`}>{title}</h2>
      <div className="grid-container">
        <h4>Points:</h4>
        <input
          className="input-point"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
        <h4>Time: </h4>
        <p>{time.toFixed(1)}s</p>
      </div>
      <button className="button-play" onClick={handleRestart}>
        {buttonLabel}
      </button>
      <div className="circleContainer">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className={`circle ${circle.isClicked ? "clicked" : ""}`}
            style={{
              left: circle.left,
              top: circle.top,
              visibility: circle.visibility,
            }}
            onClick={() => handleCircleClick(circle.id)}
          >
            {circle.id + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
