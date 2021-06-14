import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          ...action.value,
        };
      case SET_INTERVIEW: {
        return {
          ...state,
          ...action.value,
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        },
      });
    });
  }, []);

  const updateSpots = (dayName, days, appointments) => {
    // state.days.spots
    let currentDay = "";
    let spots = 0;
    for (let day of days) {
      if (day.name === dayName) {
        currentDay = day;
      }
    }
    for (let id of currentDay.appointments) {
      if (appointments[id].interview === null) {
        spots++;
      }
    }
    return spots;
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        const newDays = state.days.map((day) => {
          if (day.name === state.day) {
            return {
              ...day,
              spots: updateSpots(day.name, state.days, state.appointments),
            };
          }
          return day;
        });
        dispatch({
          type: SET_INTERVIEW,
          value: { appointments, days: newDays },
        });
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, {
        interview: null,
      })
      .then(() => {
        const loseDays = state.days.map((day) => {
          if (day.name === state.day) {
            return {
              ...day,
              spots: updateSpots(day.name, state.days, state.appointments),
            };
          }
          return day;
        });
        dispatch({
          type: SET_INTERVIEW,
          value: { appointments, days: loseDays },
        });
      });
  }
  return { state, setDay, bookInterview, cancelInterview };
}
