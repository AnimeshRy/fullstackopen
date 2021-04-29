import React, { useState, useEffect } from 'react';
import List from './components/List';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/Numbers';
import Notification from './components/Notification';
import Information from './components/Information';
import './App.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchPerson, setSearchPerson] = useState('');
  const [errorMessage, seterrorMessage] = useState(null);
  const [informationMessage, setinformationMessage] = useState(null);

  // only run on first render
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await personService.getAll();
        setPersons(response);
      } catch (error) {
        seterrorMessage('Error in retrieving data from the server');
        setTimeout(() => {
          seterrorMessage(null);
        }, 5000);
      }
    }
    fetchData();
  }, []);

  const updateNumber = async (name, newNumber) => {
    const person = persons.find((person) => person.name === name);
    const updatedPerson = { ...person, number: newNumber };
    try {
      const returnedRecord = await personService.update(
        updatedPerson.id,
        updatedPerson
      );
      console.log(returnedRecord);
      setPersons(
        persons.map((person) =>
          person.name === name ? returnedRecord : person
        )
      );
    } catch (error) {
      seterrorMessage(
        `Information of ${name} has already been removed from the server`
      );
      setPersons(persons.filter((pp) => pp !== person));
      setTimeout(() => {
        seterrorMessage(null);
      }, 3000);
    }
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
    try {
      const returnedRecord = await personService.create(newObj);
      setPersons(persons.concat(returnedRecord));
      setinformationMessage(`Added ${newName} to the phonebook!`);
      setTimeout(() => {
        setinformationMessage(null);
      }, 3000);
    } catch ({ response }) {
      // Validation Error
      seterrorMessage(response.data.error);
      setTimeout(() => {
        seterrorMessage(null);
      }, 5000);
    }
    setNewName('');
    setNewNumber('');
  };
  const deletePerson = async (id) => {
    const tobeDeleted = persons.find((n) => n.id === id);
    if (window.confirm(`Do you really want to delete ${tobeDeleted.name} ?`)) {
      try {
        await personService.deleteRecord(id);
      } catch (error) {
        seterrorMessage(
          'Looks like the record is already removed from the server'
        );
        setTimeout(() => {
          seterrorMessage(null);
        }, 5000);
      }
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
      <Information message={informationMessage}></Information>
      <Notification message={errorMessage}></Notification>
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
