import React from 'react';
import Country from './Country';
import SingleCountry from './SingleCountry';

const ShowCountries = ({countries, filter, buttonClick}) => {
  let filteredCountries = countries;

  if (filter) {
    filteredCountries = filteredCountries.filter((country) =>
      country.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specifiy another filter</p>;
  }

  if (filteredCountries.length === 1) {
    return <SingleCountry country={filteredCountries[0]}></SingleCountry>;
  }

  const display = () => {
    return filteredCountries.map((country) => (
      <Country
        key={country.name}
        name={country.name}
        showSingleCountry={buttonClick}
      ></Country>
    ));
  };
  return <ul>{display()}</ul>;
};

export default ShowCountries;
