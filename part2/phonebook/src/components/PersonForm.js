import React from 'react';

const PersonForm = (props) => {
  let {
    formSubmit,
    newName,
    nameValueChange,
    newNumber,
    numberValueChange,
  } = props;
  return (
    <>
      <h2>Add a New</h2>
      <form onSubmit={formSubmit}>
        <div>
          name: <input value={newName} onChange={nameValueChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={numberValueChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
