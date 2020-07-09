import React from "react";

import goodScore from "../../assets/images/goodscore.gif";
import badScore from "../../assets/images/badscore.gif";

const GOOD_SCORE_TRESHOLD = 600000;

const Scoreboard: React.FC<{ playerWeight: number; targetWeight: number; timeLeft: number }> = ({
  playerWeight,
  targetWeight,
  timeLeft,
}) => {
  const score = 399999;
  const isGoodScore = score > GOOD_SCORE_TRESHOLD;
  return (
    <>
      <div className="text-center uppercase text-3xl mb-5 font-bold">Your Score: {score}</div>

      {isGoodScore ? (
        <div className="mb-10">
          <img className="block mx-auto " src={goodScore} alt="Score gif" />
          <p className="text-center uppercase text-3xl">Good job!</p>
        </div>
      ) : (
        <div className="mb-10">
          <img className="block mx-auto" src={badScore} alt="Score gif" />
          <p className="text-center uppercase text-3xl">Better luck next time...</p>
        </div>
      )}

      <div className="flex text-xl justify-between">
        <div className="w-1/2">Your accumulated Weight:</div>
        <div className="w-1/2 text-right">{+playerWeight / 1000} KG</div>
      </div>
      <div className="flex text-xl justify-between">
        <div className="w-1/2">Your target Weight:</div>
        <div className="w-1/2 text-right">{+targetWeight / 1000} KG</div>
      </div>
      <div className="flex text-xl justify-between">
        <div className="w-1/2">Time left:</div>
        <div className="w-1/2 text-right">{+timeLeft / 1000} SEC.</div>
      </div>
    </>
  );
};

export default Scoreboard;
