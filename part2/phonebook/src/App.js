import React, { useState } from 'react';
import List from './components/List';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchPerson, setSearchPerson] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    const newObj = {
      name: newName,
      number: newNumber,
    };
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    setPersons(persons.concat(newObj));
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchPerson(e.target.value);
  };

  const filterListValue = () => {
    if (searchPerson === '') {
      return persons;
    }
    return [...persons].filter((person) =>
      person.name.toLowerCase().includes(searchPerson.toLowerCase())
    );
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        inputValue={searchPerson}
        handleInputChange={handleFilterChange}
      ></Filter>

      <PersonForm
        formSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        nameValueChange={handleNameChange}
        numberValueChange={handleNumberChange}
      ></PersonForm>

      <List list={filterListValue()}></List>
    </div>
  );
};

export default App;
