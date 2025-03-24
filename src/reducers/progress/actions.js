import * as types from "./actionTypes";

export const startProgress = () => ({
  type: types.PROGRESS_START
});

export const finishProgress = () => ({
  type: types.PROGRESS_FINISH
});

export const closeProgress = () => ({
  type: types.PROGRESS_CLOSE
});

export const clearProgress = () => ({
  type: types.PROGRESS_CLEAR
});
