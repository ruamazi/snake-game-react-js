const LeaderBoard = ({ topPlayers, user }) => {
 return (
  <div className=" w-[250px] h-[800px] border border-white flex flex-col gap-1 overflow-y-auto">
   <p className=" text-center text-xl py-3"> Leader Board</p>
   {topPlayers.map((each, i) => (
    <div
     key={each.username}
     className={`${
      each.username === user.username ? "bg-yellow-400/20" : "bg-slate-500/20"
     } py-2 px-3 flex gap-3 `}
    >
     <p className={`${user.username.length > 16 ? "text-sm" : ""}`}>
      {i + 1}. {each.username}
     </p>
     <p className="font-bold">{each.score}</p>
    </div>
   ))}
  </div>
 );
};

export default LeaderBoard;
