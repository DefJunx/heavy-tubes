import { GAME_STATUSES } from "../../enums/gameStatuses";
import { Tube } from "../../models/tube";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface HomeState {
  gameStatus: GAME_STATUSES;
  tubes: Tube[];
  targetWeight: number;
  playerWeight: number;
}

const initialState: HomeState = {
  gameStatus: GAME_STATUSES.NOT_STARTED,
  tubes: [],
  targetWeight: 0,
  playerWeight: 0,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    startGame: (state) => {
      state.gameStatus = GAME_STATUSES.STARTED;
    },
    pauseGame: (state) => {
      state.gameStatus = GAME_STATUSES.PAUSED;
    },
    endGame: (state) => {
      state.gameStatus = GAME_STATUSES.FINISHED;
    },
    updatePlayerWeight: (state) => {
      state.playerWeight = state.tubes.reduce((sum, current) => sum + current.weight, 0);
    },
    setGameStatus: (state, action: PayloadAction<GAME_STATUSES>) => {
      state.gameStatus = action.payload;
    },
    setTargetWeight: (state, action: PayloadAction<number>) => {
      state.targetWeight = action.payload;
    },
    setTubes: (state, action: PayloadAction<Tube[]>) => {
      state.tubes = action.payload;
    },
    updateTube: (state, action: PayloadAction<Tube>) => {
      state.tubes = state.tubes.map((t) => {
        if (t.id === action.payload.id) {
          return action.payload;
        }
        return t;
      });
    },
  },
});

export const {
  startGame,
  pauseGame,
  endGame,
  updatePlayerWeight,
  setGameStatus,
  setTargetWeight,
  setTubes,
  updateTube,
} = homeSlice.actions;

export const selectGameStatus = (state: RootState) => state.home.gameStatus;
export const selectTargetWeight = (state: RootState) => state.home.targetWeight;
export const selectTubes = (state: RootState) => state.home.tubes;
export const selectPlayerWeight = (state: RootState) => state.home.playerWeight;

export default homeSlice.reducer;
