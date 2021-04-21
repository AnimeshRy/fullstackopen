import React from 'react';

const Person = ({ person, onDelete }) => {
  return (
    <li>
      {person.name} - {person.number}{' '}
      <button onClick={() => onDelete(person.id)}>delete</button>
    </li>
  );
};

export default Person;
