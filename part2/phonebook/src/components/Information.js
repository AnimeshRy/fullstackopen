import React from 'react';

function Information({ message }) {
  if (message === null) return null;
  return <div className={'information'}>{message}</div>;
}

export default Information;
