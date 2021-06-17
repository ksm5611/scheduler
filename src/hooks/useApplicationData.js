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

  //fetching api
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
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

  const getSpotsForDay = (dayObj, appointments) => {
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    return spots;
  };

  //updating remaining spots when the interview exist or not
  const updateSpots = (dayName, days, appointments) => {
    const dayObj = days.find((day) => day.name === dayName);
    const spots = getSpotsForDay(dayObj, appointments);
    const newDay = { ...dayObj, spots };

    const newDays = days.map((day) => (day.name === dayName ? newDay : day));
    return newDays;
  };
  //to book interview
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
        const newDays = updateSpots(state.day, state.days, appointments);

        dispatch({
          type: SET_INTERVIEW,
          value: { appointments, days: newDays },
        });
      });
  }
  //to cancel interciew
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
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
        const loseDays = updateSpots(state.day, state.days, appointments);
        dispatch({
          type: SET_INTERVIEW,
          value: { appointments, days: loseDays },
        });
      });
  }
  return { state, setDay, bookInterview, cancelInterview };
}
