import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: localStorage.getItem("focusflow_theme") === "dark",
    toast: null
  },
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("focusflow_theme", state.darkMode ? "dark" : "light");
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    }
  }
});

export const { clearToast, showToast, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
