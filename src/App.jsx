import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import { useEffect, useState } from "react";

function App() {
 const [user, setUser] = useState(null);
 const [topPlayers, setTopPlayers] = useState([]);

 useEffect(() => {
  const storedUser = localStorage.getItem("snake_game_user");
  if (storedUser) {
   setUser(JSON.parse(storedUser));
  }
 }, []);

 return (
  <Routes>
   <Route
    path="/"
    element={
     user ? (
      <Home
       user={user}
       setUser={setUser}
       topPlayers={topPlayers}
       setTopPlayers={setTopPlayers}
      />
     ) : (
      <Navigate to={"/login"} />
     )
    }
   />
   <Route
    path="/login"
    element={!user ? <Login setUser={setUser} /> : <Navigate to={"/"} />}
   />
   <Route path="*" element={<PageNotFound />} />
  </Routes>
 );
}

export default App;
