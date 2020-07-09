import { GAME_STATUSES } from "../../enums/gameStatuses";
import { Tube } from "../../models/tube";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface HomeState {
  gameStatus: GAME_STATUSES;
  tubes: Tube[];
  targetWeight: number;
}

const initialState: HomeState = {
  gameStatus: GAME_STATUSES.NOT_STARTED,
  tubes: [],
  targetWeight: 0,
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
    setGameStatus: (state, action: PayloadAction<GAME_STATUSES>) => {
      state.gameStatus = action.payload;
    },
    setTargetWeight: (state, action: PayloadAction<number>) => {
      state.targetWeight = action.payload;
    },
    setTubes: (state, action: PayloadAction<Tube[]>) => {
      state.tubes = action.payload;
    },
  },
});

export const { setGameStatus, setTargetWeight, setTubes } = homeSlice.actions;

export const selectGameStatus = (state: RootState) => state.home.gameStatus;
export const selectTargetWeight = (state: RootState) => state.home.targetWeight;
export const selectTubes = (state: RootState) => state.home.tubes;

export default homeSlice.reducer;
