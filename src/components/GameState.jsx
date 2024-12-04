import React, { useEffect, useState } from "react";
import GamePieces from "./GamePieces";
import { url } from "../pages/Login";

const GameState = ({ user, setUser }) => {
 const [score, setScore] = useState(0);
 const [highScore, setHighScore] = useState(user.score || 0);
 const [gameOver, setGameOver] = useState(false);
 const [collisionType, setCollisionType] = useState(null);

 const handleGameOver = (type) => {
  setGameOver(true);

  if (score > highScore) {
   setHighScore(score);
   updateHighScore(score);
  }

  setCollisionType(type);
 };

 const updateHighScore = async (score) => {
  const userId = user._id;
  try {
   const resp = await fetch(`${url}/user/update/${userId}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
   });
   if (!resp.ok) {
    return;
   }
   const data = await resp.json();
   setUser(data);
   localStorage.setItem("snake_game_user", JSON.stringify(data));
  } catch (error) {
   console.log(error);
  }
 };

 const handleResetGame = () => {
  setScore(0);
  setGameOver(false);
 };

 useEffect(() => {
  const handleKeyPress = (e) => {
   if (
    (gameOver && e.key === "Enter") ||
    e.key === " " ||
    e.key === "Spacebar"
   ) {
    handleResetGame();
   }
  };

  window.addEventListener("keydown", handleKeyPress);
 }, [gameOver]);

 return (
  <div className="w-[800px] text-center">
   <p className="tracking-widest">
    {user.username} score: <span className="text-cyan-400">{score}</span>
   </p>
   <p className="high-score tracking-widest">
    Your high Score: <span className="text-orange-400 ">{highScore}</span>
   </p>
   {gameOver && (
    <div className="text-center text-xl">
     <p className="t">
      Game Over!{" "}
      {collisionType === "wall" ? "You Hit the wall" : "You Ate yourself"}!
     </p>
     <p>Press Enter to reset the game.</p>
    </div>
   )}
   {!gameOver && (
    <GamePieces
     score={score}
     setScore={setScore}
     onGameOver={(type) => handleGameOver(type)}
    />
   )}
  </div>
 );
};

export default GameState;
