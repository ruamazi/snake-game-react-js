import React, { useState } from "react";

export const url = import.meta.env.VITE_BACKEND_URL;

const Login = ({ setUser }) => {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [guestLoading, setGuestLoading] = useState(false);
 const [error, setError] = useState(null);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
   const resp = await fetch(`${url}/user/create`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
   });
   const data = await resp.json();
   if (data.error) {
    setError(data.error);
    return;
   }
   setUser(data);
   localStorage.setItem("snake_game_user", JSON.stringify(data));
  } catch (error) {
   setError("Failed to Login, please try later!");
  } finally {
   setLoading(false);
   setUsername("");
   setPassword("");
  }
 };
 const handleGuest = async () => {
  setGuestLoading(true);
  setError(null);
  const url = import.meta.env.VITE_BACKEND_URL;
  try {
   const resp = await fetch(`${url}/user/guest`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
    },
   });
   const data = await resp.json();
   if (data.error) {
    setError(data.error);
    return;
   }
   setUser(data);
   localStorage.setItem("snake_game_user", JSON.stringify(data));
  } catch (error) {
   setError("Failed to Login, please try later!");
  } finally {
   setGuestLoading(false);
  }
 };

 return (
  <div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">
   <form
    className=" flex flex-col gap-3 w-[300px] text-black"
    onSubmit={handleLogin}
   >
    <input
     className="rounded-sm p-1 px-3"
     value={username}
     type="text"
     placeholder="Enter username"
     onChange={(e) => {
      setUsername(e.target.value);
     }}
    />
    <input
     className="rounded-sm p-1 px-3"
     value={password}
     type="password"
     placeholder="Your password"
     onChange={(e) => {
      setPassword(e.target.value);
     }}
    />
    <div className="text-white flex gap-3 justify-between textsm">
     <button
      className="bg-blue-500 px-2 rounded-sm py-2 cursor-pointer hover:bg-blue-600 "
      disabled={loading || guestLoading}
     >
      {loading ? "Loading..." : "Sign-in"}
     </button>
     <button
      disabled={loading || guestLoading}
      type="button"
      className="bg-slate-600 px-2 rounded-sm cursor-pointe hover:bg-slate-700"
      onClick={handleGuest}
     >
      {guestLoading ? "Loading..." : "Countinue as a Guest"}
     </button>
    </div>
    {error && <p className="text-red-500 text-center">{error}</p>}
   </form>
  </div>
 );
};

export default Login;
