import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("focusflow_user") || "null"),
  accessToken: localStorage.getItem("focusflow_access_token")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("focusflow_user", JSON.stringify(action.payload.user));
      localStorage.setItem("focusflow_access_token", action.payload.accessToken);
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("focusflow_user", JSON.stringify(action.payload));
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("focusflow_user");
      localStorage.removeItem("focusflow_access_token");
    }
  }
});

export const { clearCredentials, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
