import * as types from "./actionTypes";

const initialState = {
  progress: 0,
  show: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.PROGRESS_START:
      return {
        ...state,
        progress: 40,
        show: true,
      };
    case types.PROGRESS_FINISH:
      return {
        progress: 100,
      };

    case types.PROGRESS_CLOSE: {
      return {
        progress: 0,
        show: false,
      };
    }

    case types.PROGRESS_CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
