import React, { useState } from 'react';


const API_KEYS = import.meta.env.REACT_APP_YOUTUBE_API_KEY; // Use Vite environment variable

const Header = ({ onFormSubmit }) => {
  const [term, setTerm] = useState('');

  const onInputChange = (event) => {
    setTerm(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(term);
  };

  return (
    <div className="search-bar ui segment">
      <form onSubmit={onSubmit} className="ui form">
        <div className="field">
          <input
            type="text"
            value={term}
            onChange={onInputChange}
            placeholder="Search..."
          />
        </div>
      </form>
    </div>
  );
};

export default Header;