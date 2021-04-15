import React, { useState, useEffect } from 'react';
import List from './components/List';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchPerson, setSearchPerson] = useState('');

  const fetchData = () => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => setPersons(response.data));
  };

  // only run on first render
  useEffect(fetchData, []);

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
