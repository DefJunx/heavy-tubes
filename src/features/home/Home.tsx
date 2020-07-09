import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectGameStatus,
  selectTubes,
  selectTargetWeight,
  startGame,
  pauseGame,
  setTargetWeight,
  setTubes,
  endGame,
  updateTube,
} from "./homeSlice";
import { GAME_STATUSES } from "../../enums/gameStatuses";
import { createTube } from "../../models/tube";

import logo from "../../assets/images/logo.png";
import tubeImage from "../../assets/images/tube.png";

const ONE_SECOND = 1000;
const DEFAULT_TIMER = ONE_SECOND * 5;
const DEFAULT_START_LABEL = "START";
const MIN_TARGET_WEIGHT = 1000 * 100;
const MAX_TARGET_WEIGHT = 1000 * 150;
const NR_TUBES = 3;

const Home: React.FC = () => {
  const status = useSelector(selectGameStatus);
  const tubes = useSelector(selectTubes);
  const targetWeight = useSelector(selectTargetWeight);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [startButtonLabel, setStartButtonLabel] = useState(DEFAULT_START_LABEL);
  const [showScore, setShowScore] = useState(false);
  const [playerWeight, setPlayerWeight] = useState(0);

  const startButtonClick = (e: React.MouseEvent) => {
    console.log("Game start");
    setShowScore(false);
    dispatch(startGame());

    // setGameStatus(GAME_STATUSES.STARTED);

    if (status === GAME_STATUSES.NOT_STARTED || status === GAME_STATUSES.FINISHED) {
      const newTubes = Array(NR_TUBES)
        .fill(1)
        .map((el) => createTube());
      const targetWeight = Math.floor(Math.random() * (MAX_TARGET_WEIGHT - MIN_TARGET_WEIGHT + 1)) + MIN_TARGET_WEIGHT;
      const newTubesSum = newTubes.reduce((sum, current) => sum + current.weight, 0);

      setTimer(DEFAULT_TIMER);
      dispatch(setTargetWeight(Number(targetWeight) || 0));
      dispatch(setTubes(newTubes));
      setPlayerWeight(newTubesSum);
    }
  };

  const pauseButtonClick = (e: React.MouseEvent) => {
    if (status === GAME_STATUSES.STARTED) {
      dispatch(pauseGame());
    } else {
      dispatch(startGame());
    }
  };

  const onTubeClick = (id: string) => {
    const tube = tubes.find((t) => t.id === id);

    if (!tube) {
      throw new Error("Tube is not defined");
    }

    if (tube.blocked || status !== GAME_STATUSES.STARTED) {
      return;
    }

    dispatch(updateTube({ ...tube, blocked: true }));
  };

  useEffect(() => {
    const areAllTubesBlocked = tubes.filter((t) => t.blocked === false).length === 0;

    if (areAllTubesBlocked) {
      dispatch(endGame());
    }
  }, [tubes, dispatch]);

  useEffect(() => {
    let timerInterval: any;

    switch (status) {
      case GAME_STATUSES.STARTED:
        timerInterval = setInterval(() => {
          setTimer((t) => {
            if (t === 0) {
              clearInterval(timerInterval);
              dispatch(endGame());
              return 0;
            }

            return t - ONE_SECOND;
          });
        }, ONE_SECOND);
        break;
      case GAME_STATUSES.PAUSED:
        clearInterval(timerInterval);
        setStartButtonLabel("RESUME");
        break;
      case GAME_STATUSES.FINISHED:
        clearInterval(timerInterval);
        setStartButtonLabel("RESTART");
        setShowScore(true);
        break;
      default:
        setStartButtonLabel(DEFAULT_START_LABEL);
    }

    return () => clearInterval(timerInterval);
  }, [status, dispatch]);

  return (
    <section className="w-3/4 mx-auto p-20 bg-teal-200 uppercase">
      <img className="block mx-auto mb-20" src={logo} alt="Heavy Tubes logo" />
      {status !== GAME_STATUSES.NOT_STARTED && (
        <div className="flex flex-row sm:flex-col md:flex-row justify-between items-center">
          <div className="flex-1 sm:text-center md:text-left text-xl font-bold">
            <div>Target Weight: {+targetWeight / 1000} KG</div>
            <div>Your Weight: {+playerWeight / 1000} KG</div>
          </div>
          <div className="flex-1 sm:text-center md:text-right text-xl font-bold">Time left {+timer / 1000}s</div>
        </div>
      )}
      {((status === GAME_STATUSES.STARTED || status === GAME_STATUSES.PAUSED) && tubes.length) > 0 && (
        <div className="my-20">
          <div className="flex flex-row sm:flex-col md:flex-row justify-between">
            {tubes.map((tube) => (
              <div
                className={`w-4/12 self-center ${
                  tube.blocked || status !== GAME_STATUSES.STARTED ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => onTubeClick(tube.id)}
              >
                <img className="w-40 mx-auto block" src={tubeImage} alt="Tube" />
              </div>
              // <Tube key={el.id} tube={el}></Tube>
            ))}
          </div>
        </div>
      )}
      {/* {showScore && <Scoreboard></Scoreboard>} */}
      <div className="my-10 flex items-center justify-between">
        {status !== GAME_STATUSES.STARTED && (
          <button className="flex-1 font-bold py-2 px-4 rounded bg-green-700 text-white" onClick={startButtonClick}>
            {startButtonLabel}
          </button>
        )}
        {status === GAME_STATUSES.STARTED && (
          <button
            className="flex-1 font-bold mx-2 py-2 px-4 rounded bg-orange-400 text-white"
            onClick={pauseButtonClick}
          >
            PAUSE
          </button>
        )}
      </div>
    </section>
  );
};

export default Home;
