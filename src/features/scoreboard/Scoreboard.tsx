import React from "react";

import goodScore from "../../assets/images/goodscore.gif";
import badScore from "../../assets/images/badscore.gif";

const GOOD_SCORE_TRESHOLD = 1000 * 150;

const Scoreboard: React.FC<{ playerWeight: number; targetWeight: number; timeLeft: number }> = ({
  playerWeight,
  targetWeight,
  timeLeft,
}) => {
  const accuracy = (playerWeight / targetWeight) * 100;
  const score = accuracy * 2000 + timeLeft;
  const isGoodScore = score > GOOD_SCORE_TRESHOLD;
  const isGameOver = playerWeight > targetWeight;
  return (
    <>
      {isGameOver ? (
        <>
          <div className="text-center text-red-400 uppercase text-3xl mb-5 font-bold">Game Over!</div>
          <div className="my-10">
            <img className="block mx-auto mb-5" src={badScore} alt="Score gif" />
            <p className="text-center uppercase text-3xl">Better luck next time...</p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center uppercase text-3xl mb-5 font-bold">Your Score: {score.toFixed(0)}</div>
          {isGoodScore ? (
            <div className="mb-10">
              <img className="block mx-auto mb-5" src={goodScore} alt="Score gif" />
              <p className="text-center uppercase text-3xl">Good job!</p>
            </div>
          ) : (
            <div className="mb-10">
              <img className="block mx-auto mb-5" src={badScore} alt="Score gif" />
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
          <div className="flex text-xl justify-between">
            <div className="w-1/2">Your accuracy:</div>
            <div className="w-1/2 text-right">{accuracy.toFixed(2)} %</div>
          </div>
        </>
      )}
    </>
  );
};

export default Scoreboard;
