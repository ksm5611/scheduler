import React from "react";
import PropTypes from "prop-types";

import classnames from "classnames";
import InterviewerListItem from "components/InterviewerListItem";
import "./InterviewerList.scss";

function InterviewerList(props) {
  const interviewerList = classnames("interviewers");

  // to show list of interviewers
  const listOfInterviwers = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={props.value === interviewer.id}
        setInterviewer={() => props.onChange(interviewer.id)}
      />
    );
  });

  return (
    <section className={interviewerList}>
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{listOfInterviwers}</ul>
    </section>
  );
}
//props types of interviewer list
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired,
};

export default InterviewerList;
