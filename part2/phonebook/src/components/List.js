import React from 'react';
import Person from './Person';

const List = ({ list, onDelete }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {list.map((item) => (
          <Person key={item.id} person={item} onDelete={onDelete}></Person>
        ))}
      </ul>
    </div>
  );
};

export default List;
