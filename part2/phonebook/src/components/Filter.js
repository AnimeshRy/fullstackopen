import React from 'react';

function Filter({ inputValue, handleInputChange }) {
  return (
    <div>
      Filter Numbers -{' '}
      <input value={inputValue} onChange={handleInputChange}></input>
    </div>
  );
}

export default Filter;
