import * as types from "./actionTypes";
import format from "date-fns/format";
import locale from "date-fns/locale/ru";

const now = new Date();
const today = format(now, "yyyy-MM-dd", { locale });

const initialState = {
  today,
  roles: [],
  department: "",
  name: "",
  user: "",
  point_id: "",
  checkTokenExpiredYesUpdate: null,
  isAllowanceLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ALLOWANCE_GET:
      return {
        ...state,
        ...action.payload,
        isAllowanceLoading: true,
      };

    default:
      return state;
  }
};
