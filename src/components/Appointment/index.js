import React from "react";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const CANCEL = "CANCEL";
  const SAVING = "SAVING";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE ";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((err) => {
        transition(ERROR_SAVE, true);
      });
  }

  function deleting() {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition(ERROR_DELETE, true);
      });
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back(CANCEL)}
          onSave={save}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={deleting}
          onCancel={back}
        />
      )}
      {mode === DELETE && <Status message={"Deleting"} />}
      {mode === EDIT && (
        <Form
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          interviewers={props.interviewers}
          onCancel={() => back(CANCEL)}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          onClose={() => back()}
          message={"Could not update appointment."}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          onClose={() => back()}
          message={"Could not delete appointment."}
        />
      )}
    </article>
  );
}
