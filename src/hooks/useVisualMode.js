import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //change current mode
  const transition = (newMode, replace) => {
    if (replace) {
      back();
    }
    setMode(newMode);
    setHistory((prev) => [...prev, newMode]);
  };
  //back to previous mode
  const back = () => {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
      setHistory(history);
    }
  };

  return { mode, transition, back };
}
