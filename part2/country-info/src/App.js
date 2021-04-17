import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShowCountries from './components/ShowCountries';

const App = () => {
  const [countries, setcountries] = useState([]);
  const [filter, setFilter] = useState('');
  const fetchCountries = async () => {
    const response = await axios.get('https://restcountries.eu/rest/v2/all');
    setcountries(response.data);
  };

  // run query on pageload
  useEffect(() => {
    fetchCountries();
  }, []);

  const inputChange = (event) => {
    setFilter(event.target.value);
  };

  const showSingleCountry = (event) => {
    setFilter(event.target.attributes.country.value);
  };

  return (
    <div>
      find countries
      <input value={filter} onChange={inputChange} />{' '}
      <button type="button" onClick={() => setFilter('')}>
        res
      </button>
      <ShowCountries
        countries={countries}
        filter={filter}
        buttonClick={showSingleCountry}
      />
    </div>
  );
};
export default App;
