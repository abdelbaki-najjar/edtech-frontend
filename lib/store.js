// lib/store.js
// ── Global State — React Context بدون مكتبات خارجية ───────────
"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { studentsAPI } from "./api";

const StoreContext = createContext(null);

const initialState = {
  user: null,       // بيانات الطالب المسجّل
  token: null,      // JWT token
  isLoading: true,  // جار التحقق من الجلسة
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "UPDATE_XP":
      return {
        ...state,
        user: state.user
          ? { ...state.user, total_xp: state.user.total_xp + action.payload }
          : state.user,
      };
    case "DONE_LOADING":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // تحقق من الجلسة عند التحميل
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: "DONE_LOADING" });
      return;
    }
    dispatch({ type: "SET_TOKEN", payload: token });
    studentsAPI
      .getMe()
      .then((user) => dispatch({ type: "SET_USER", payload: user }))
      .catch(() => {
        localStorage.removeItem("token");
        dispatch({ type: "DONE_LOADING" });
      });
  }, []);

  const actions = {
    login(token, user) {
      localStorage.setItem("token", token);
      dispatch({ type: "SET_TOKEN", payload: token });
      dispatch({ type: "SET_USER", payload: user });
    },
    logout() {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    },
    addXP(amount) {
      dispatch({ type: "UPDATE_XP", payload: amount });
    },
    refreshUser() {
      return studentsAPI
        .getMe()
        .then((user) => dispatch({ type: "SET_USER", payload: user }));
    },
  };

  return (
    <StoreContext.Provider value={{ ...state, ...actions }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
