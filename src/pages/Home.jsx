import React, { useEffect } from "react";
import LeaderBoard from "../components/LeaderBoard";
import GameState from "../components/GameState";
import { Loader, LogOut } from "lucide-react";
import { url } from "./Login";

const Home = ({ user, setUser, topPlayers, setTopPlayers }) => {
 const fetchTopPlayers = async () => {
  try {
   const resp = await fetch(`${url}/user/lboard`);
   if (!resp.ok) {
    console.log("error fetching leaderboard");
    return;
   }
   const data = await resp.json();
   setTopPlayers(data);
  } catch (error) {
   console.log(error);
  }
 };

 const handleLogOut = () => {
  setUser(null);
  localStorage.setItem("snake_game_user", null);
 };

 useEffect(() => {
  fetchTopPlayers();
 }, [user.score]);

 if (!user) {
  return <Loader />;
 }

 return (
  <div className=" bg-slate-950 min-w-full min-h-screen text-white flex flex-col-reverse gap-3 items-center justify-center md:flex-row">
   <div className="flex flex-col gap-2">
    <LeaderBoard topPlayers={topPlayers} user={user} />
    <button
     onClick={handleLogOut}
     className="w-full bg-slate-900 py-2 cursor-pointer hover:bg-slate-800 flex items-center justify-center gap-2"
    >
     Logout <LogOut size={18} />
    </button>
   </div>

   <GameState user={user} setUser={setUser} />
  </div>
 );
};

export default Home;
