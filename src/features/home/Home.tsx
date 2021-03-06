import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectGameStatus,
  selectTubes,
  selectTargetWeight,
  selectPlayerWeight,
  startGame,
  pauseGame,
  updatePlayerWeight,
  setTargetWeight,
  setTubes,
  endGame,
  updateTube,
} from "./homeSlice";
import { GAME_STATUSES } from "../../enums/gameStatuses";
import { createTube } from "../../models/tube";

import logo from "../../assets/images/logo.png";
import tubeImage from "../../assets/images/tube.png";
import crateImage from "../../assets/images/crate.png";
import Scoreboard from "../scoreboard/Scoreboard";

const ONE_SECOND = 1000;
const DEFAULT_TIMER = ONE_SECOND * 30;
const DEFAULT_START_LABEL = "START";
const MIN_TARGET_WEIGHT = 1000 * 100;
const MAX_TARGET_WEIGHT = 1000 * 150;
const MIN_INCREMENT_WEIGHT = 1000 * 2;
const MAX_INCREMENT_WEIGHT = 1000 * 5;
const NR_TUBES = 3;

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const status = useSelector(selectGameStatus);
  const tubes = useSelector(selectTubes);
  const targetWeight = useSelector(selectTargetWeight);
  const playerWeight = useSelector(selectPlayerWeight);

  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [startButtonLabel, setStartButtonLabel] = useState(DEFAULT_START_LABEL);
  const [showScore, setShowScore] = useState(false);

  const startButtonClick = (e: React.MouseEvent) => {
    console.log("Game start");
    dispatch(startGame());

    if (status === GAME_STATUSES.NOT_STARTED || status === GAME_STATUSES.FINISHED) {
      const newTubes = Array(NR_TUBES)
        .fill(1)
        .map((el) => createTube());
      const targetWeight = Math.floor(Math.random() * (MAX_TARGET_WEIGHT - MIN_TARGET_WEIGHT + 1)) + MIN_TARGET_WEIGHT;

      setTimer(DEFAULT_TIMER);
      dispatch(setTargetWeight(Number(targetWeight) || 0));
      dispatch(setTubes(newTubes));
      dispatch(updatePlayerWeight());
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
    let timerInterval: any;

    switch (status) {
      case GAME_STATUSES.STARTED:
        setShowScore(false);

        timerInterval = setInterval(() => {
          setTimer((t) => {
            if (t - ONE_SECOND === 0) {
              clearInterval(timerInterval);
              dispatch(endGame());
              return 0;
            }

            const updatedTubes = tubes.map((t) => {
              if (t.blocked) {
                return t;
              }

              const weight =
                t.weight +
                Math.floor(Math.random() * (MAX_INCREMENT_WEIGHT - MIN_INCREMENT_WEIGHT + 1)) +
                MIN_INCREMENT_WEIGHT;

              return {
                ...t,
                weight,
              };
            });

            dispatch(setTubes(updatedTubes));
            dispatch(updatePlayerWeight());

            return t - ONE_SECOND;
          });
        }, ONE_SECOND);

        const areAllTubesBlocked = tubes.filter((t) => t.blocked === false).length === 0;

        if (areAllTubesBlocked) {
          dispatch(endGame());
        }
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
  }, [status, tubes, dispatch]);

  useEffect(() => {
    if (playerWeight > targetWeight) {
      dispatch(endGame());
    }
  }, [playerWeight, dispatch, targetWeight]);

  return (
    <section className="w-3/4 mx-auto p-20 bg-teal-200 uppercase">
      <img className="block mx-auto mb-20" src={logo} alt="Heavy Tubes logo" />
      {status !== GAME_STATUSES.NOT_STARTED && status !== GAME_STATUSES.FINISHED && (
        <div className="flex flex-row sm:flex-col md:flex-row justify-between items-center">
          <div className="flex-1 sm:text-center md:text-left text-xl font-bold">
            <div>Target Weight: {+targetWeight / 1000} KG</div>
            <div>Your Weight: {+playerWeight / 1000} KG</div>
          </div>
          <div className="flex-1 sm:text-center md:text-right text-xl font-bold">Time left {+timer / 1000}s</div>
        </div>
      )}
      {showScore && <Scoreboard playerWeight={playerWeight} targetWeight={targetWeight} timeLeft={timer}></Scoreboard>}
      {((status === GAME_STATUSES.STARTED || status === GAME_STATUSES.PAUSED) && tubes.length) > 0 && (
        <div className="my-20">
          <div className="flex flex-row sm:flex-col md:flex-row justify-between">
            {tubes.map((tube) => (
              <div
                key={tube.id}
                className={`w-4/12 self-center ${
                  tube.blocked || status !== GAME_STATUSES.STARTED ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <img className="w-40 mx-auto block" src={tubeImage} alt="Tube" />
                <img onClick={() => onTubeClick(tube.id)} className="w-40 mx-auto block" src={crateImage} alt="Crate" />
              </div>
              // <Tube key={el.id} tube={el}></Tube>
            ))}
          </div>
        </div>
      )}
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
