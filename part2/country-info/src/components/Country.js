import React from 'react';

const Country = ({name, showSingleCountry}) => {
  return (
    <li>
      {name}{' '}
      <button onClick={showSingleCountry} country={name}>
        show
      </button>
    </li>
  );
};

export default Country;
