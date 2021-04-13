import React from 'react';
import Person from './Person';

const List = ({ list }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {list.map((item) => (
          <Person key={item.name} person={item}></Person>
        ))}
      </ul>
    </div>
  );
};

export default List;
