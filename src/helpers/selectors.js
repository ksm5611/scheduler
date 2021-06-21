export function getAppointmentsForDay(state, day) {
  // selecting day
  const selectedDay = state.days.find((loopDay) => loopDay.name === day);

  if (!selectedDay) return [];
  const filteredAppointment = selectedDay.appointments.map(
    (appointment) => state.appointments[appointment]
  );

  return filteredAppointment;
}

// to get a new interview
export function getInterview(state, interview) {
  if (interview) {
    const stateInterviewer = state.interviewers[interview.interviewer];
    return { ...interview, interviewer: stateInterviewer };
  }
  return null;
}

//to get an interview for each day
export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find((loopDay) => loopDay.name === day);

  if (!selectedDay) return [];
  const filteredInterviewers = selectedDay.interviewers.map(
    (interviewer) => state.interviewers[interviewer]
  );

  return filteredInterviewers;
}
