import React from "react";

const Scoreboard: React.FC<{ playerWeight: number; targetWeight: number; timeLeft: number }> = ({
  playerWeight,
  targetWeight,
  timeLeft,
}) => {
  return (
    <div>
      <div>Scores:</div>
      <ul>
        <li>{playerWeight}</li>
        <li>{targetWeight}</li>
        <li>{timeLeft}</li>
      </ul>
    </div>
  );
};

export default Scoreboard;
