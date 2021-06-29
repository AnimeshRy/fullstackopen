import React from 'react';

const Notification = ({ errormessage, successmessage }) => {
  if (errormessage === null && successmessage === null) {
    return null;
  } else if (errormessage) {
    return <div className="error">{errormessage}</div>;
  } else {
    return <div className="success">{successmessage}</div>;
  }
};

export default Notification;
