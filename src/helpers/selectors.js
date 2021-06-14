export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.find((loopDay) => loopDay.name === day);

  if (!filteredDays) return [];
  const filteredAppointment = filteredDays.appointments.map(
    (appointment) => state.appointments[appointment]
  );

  return filteredAppointment;
}

export function getInterview(state, interview) {
  if (interview) {
    const stateInterviewer = state.interviewers[interview.interviewer];
    return { ...interview, interviewer: stateInterviewer };
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.find((loopDay) => loopDay.name === day);

  if (!filteredDays) return [];
  const filteredInterviewers = filteredDays.interviewers.map(
    (interviewer) => state.interviewers[interviewer]
  );

  return filteredInterviewers;
}
