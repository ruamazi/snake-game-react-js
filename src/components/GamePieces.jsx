import React, { useEffect, useRef, useState } from "react";

const GamePieces = ({ score, setScore, onGameOver }) => {
 const canvasRef = useRef();
 const SNAKE_SPEED = 10;
 const [apple, setApple] = useState({ x: 180, y: 100 });
 const [extraApple, setExtraApple] = useState({ x: 280, y: 100 });
 const [snake, setSnake] = useState([
  { x: 100, y: 50 },
  { x: 95, y: 50 },
 ]);
 const [direction, setDirection] = useState(null);
 const [lastDirection, setLastDirection] = useState("right");
 const [paused, setPaused] = useState(false);
 const [snakeSpeed, setSnakeSpeed] = useState(SNAKE_SPEED);

 const spawnExtraApple = () => {
  setExtraApple({
   x:
    Math.floor((Math.random() * canvasRef.current.width) / snakeSpeed) *
    snakeSpeed,
   y:
    Math.floor((Math.random() * canvasRef.current.height) / snakeSpeed) *
    snakeSpeed,
  });
  const randomTime = Math.floor(Math.random() * 20000) + 20000;
  setTimeout(spawnExtraApple, randomTime);
 };
 const startExtraAppleTimeout = () => {
  setTimeout(() => {
   setExtraApple(null);
  }, 30000);
 };

 useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const drawSnake = () => {
   snake.forEach((snakePart, i) => {
    ctx.beginPath();
    ctx.rect(snakePart.x, snakePart.y, 10, 10);
    if (i === 0) {
     ctx.fillStyle = "#32CD32"; // head color
    } else {
     ctx.fillStyle = "#90EE90"; // body color
    }
    ctx.fill();
    ctx.closePath();
   });
  };

  const drawApple = () => {
   ctx.beginPath();
   ctx.rect(apple.x, apple.y, 10, 10);
   ctx.fillStyle = "#FF0000";
   ctx.fill();
   ctx.closePath();
  };
  const drawExtraApple = () => {
   if (extraApple) {
    ctx.beginPath();
    ctx.arc(extraApple.x + 5, extraApple.y + 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.closePath();
   }
  };

  const moveSnake = () => {
   if (paused) return;
   if (direction) {
    setSnake((prevSnake) => {
     const newSnake = [...prevSnake];
     const snakeHead = { x: newSnake[0].x, y: newSnake[0].y };

     for (let i = newSnake.length - 1; i > 0; i--) {
      newSnake[i].x = newSnake[i - 1].x;
      newSnake[i].y = newSnake[i - 1].y;
     }

     switch (direction) {
      case "right":
       snakeHead.x += snakeSpeed;
       break;
      case "left":
       snakeHead.x -= snakeSpeed;
       break;
      case "up":
       snakeHead.y -= snakeSpeed;
       break;
      case "down":
       snakeHead.y += snakeSpeed;
       break;
      default:
       break;
     }

     newSnake[0] = snakeHead;

     handleAppleCollision(newSnake);
     handleExtraAppleCollision(newSnake);
     handleWallCollision(snakeHead);
     handleBodyCollision(newSnake);

     return newSnake;
    });
   }
  };

  const handleWallCollision = (snakeHead) => {
   if (
    snakeHead.x + snakeSpeed > canvas.width ||
    snakeHead.x + snakeSpeed < 0
   ) {
    onGameOver("wall");
   }
   if (
    snakeHead.y + snakeSpeed > canvas.height ||
    snakeHead.y + snakeSpeed < 0
   ) {
    onGameOver("wall");
   }
  };

  const handleBodyCollision = (newSnake) => {
   const snakeHead = newSnake[0];
   for (let i = 1; i < newSnake.length; i++) {
    if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
     onGameOver("self");
    }
   }
  };

  const handleAppleCollision = (newSnake) => {
   const snakeHead = newSnake[0];
   if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
    setScore((prevScore) => prevScore + 1);
    setApple({
     x: Math.floor((Math.random() * canvas.width) / snakeSpeed) * snakeSpeed,
     y: Math.floor((Math.random() * canvas.height) / snakeSpeed) * snakeSpeed,
    });
    newSnake.push({
     x: newSnake[newSnake.length - 1].x,
     y: newSnake[newSnake.length - 1].y,
    });
   }
  };
  const handleExtraAppleCollision = (newSnake) => {
   const snakeHead = newSnake[0];
   if (
    extraApple &&
    snakeHead.x === extraApple.x &&
    snakeHead.y === extraApple.y
   ) {
    setScore((prevScore) => prevScore + 5);
    setExtraApple(null);
    for (let i = 0; i < 5; i++) {
     const lastBlock = newSnake[newSnake.length - 1];
     newSnake.push({ x: lastBlock.x, y: lastBlock.y });
    }
    spawnExtraApple();
    startExtraAppleTimeout();
   }
  };

  const handleKeyPress = (e) => {
   if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    setPaused(!paused); // Toggle the paused state
    return; // Don't process other keys if the game is paused
   }

   switch (e.key) {
    case "ArrowRight":
    case "d":
    case "D":
     if (lastDirection !== "left") {
      setDirection("right");
      setLastDirection("right");
     }
     break;
    case "a":
    case "A":
    case "ArrowLeft":
     if (lastDirection !== "right") {
      setDirection("left");
      setLastDirection("left");
     }

     break;
    case "ArrowUp":
    case "w":
    case "W":
     if (lastDirection !== "down") {
      setDirection("up");
      setLastDirection("up");
     }

     break;
    case "ArrowDown":
    case "s":
    case "S":
     if (lastDirection !== "up") {
      setDirection("down");
      setLastDirection("down");
     }

     break;
    default:
     break;
   }
  };

  window.addEventListener("keydown", handleKeyPress);

  const interval = setInterval(() => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   drawSnake();
   drawApple();
   drawExtraApple();
   moveSnake();
  }, 100);

  return () => {
   clearInterval(interval);
   window.removeEventListener("keydown", handleKeyPress);
  };
 }, [snake, direction, lastDirection, paused, apple, extraApple]);

 return (
  <div className="flex items-center justify-center py-7 relative">
   <canvas
    className={`bottom-3 border border-white bg-slate-900 transition-all duration-300 ${
     paused ? "filter blur-sm" : ""
    }`} // Apply blur on pause
    ref={canvasRef}
    width={750}
    height={420}
   />
   {paused && (
    <div className="absolute text-white text-3xl font-bold">PAUSED</div>
   )}
  </div>
 );
};

export default GamePieces;
