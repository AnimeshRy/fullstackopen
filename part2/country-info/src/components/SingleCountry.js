import React from 'react';
import Weatherdata from './Weatherdata';

const SingleCountry = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>

      <div>
        <b>Capital</b> - {country.capital}
        <br />
        <b>Population</b> - {country.population.toLocaleString()}
      </div>

      <h3>Languages</h3>
      <ul>
        {country.languages.map((lan, i) => {
          return <li key={i}>{lan.name}</li>;
        })}
      </ul>
      <img src={country.flag} alt="flag" width="150px" height="150px" />

      <Weatherdata country={country.name}></Weatherdata>
    </div>
  );
};

export default SingleCountry;
