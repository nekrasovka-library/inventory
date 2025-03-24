import * as types from "./actionTypes";

export const getAllowance = (payload) => ({
  type: types.ALLOWANCE_GET,
  payload,
});
