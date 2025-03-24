import { combineReducers } from "redux";

import allowance from "./allowance";
import progress from "./progress";

export default combineReducers({
  allowance: allowance.reducer,
  progress: progress.reducer,
});
