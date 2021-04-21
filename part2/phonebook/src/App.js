import React, { useState, useEffect } from 'react';
import List from './components/List';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/numbers';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchPerson, setSearchPerson] = useState('');

  // only run on first render
  useEffect(() => {
    async function fetchData() {
      const response = await personService.getAll();
      setPersons(response);
    }
    fetchData();
  }, []);

  const updateNumber = async (name, newNumber) => {
    const person = persons.find((person) => person.name === name);
    const updatedPerson = { ...person, number: newNumber };
    const returnedRecord = await personService.update(
      updatedPerson.id,
      updatedPerson
    );
    setPersons(
      persons.map((person) =>
        person.id !== updatedPerson.id ? person : returnedRecord
      )
    );
    setNewName('');
    setNewNumber('');
  };

  const addPerson = async (event) => {
    event.preventDefault();
    const newObj = {
      name: newName,
      number: newNumber,
    };
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} already in the phonebook, do you want to replace the old number with the new one ?`
        )
      ) {
        updateNumber(newName, newNumber);
        return;
      }
      return;
    }
    const returnedRecord = await personService.create(newObj);
    setPersons(persons.concat(returnedRecord));
    setNewName('');
    setNewNumber('');
  };
  const deletePerson = async (id) => {
    const tobeDeleted = persons.find((n) => n.id === id);
    if (window.confirm(`Do you really want to delete ${tobeDeleted.name} ?`)) {
      await personService.deleteRecord(id);
      setPersons(persons.filter((person) => person.id !== id));
    }
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

      <List list={filterListValue()} onDelete={deletePerson}></List>
    </div>
  );
};

export default App;
