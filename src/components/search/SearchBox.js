import React, { useState, useEffect } from 'react';
import search__icon from '../../images/search-icon.svg';

const SearchBox = ({ content, searchContacts, searchUsers, setSearchState }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const doneTypingInterval = 500;
  let typingTimer;

  useEffect(() => {
    setSearchTerm("");
  }, [content]);


  const handleSearch = () => {
    content === 'contactList' && searchUsers({ variables: { searchTerm } });
    searchContacts({ variables: { searchTerm } });
    setSearchState(true)
  }
  
  const handleKeyUp = (event) => {
    clearTimeout(typingTimer);
    if (searchTerm) {
      typingTimer = setTimeout(handleSearch, doneTypingInterval);
    } else {
      setSearchState(false)
    }  
  }

  const handleKeyDown = (event) => {
    clearTimeout(typingTimer);
  }

  return (
    <section className='search u-margin-top-2'>
      <label  htmlFor='search' className='search__button'>
        <img className='search__botton--icon' src={search__icon} alt='search icon'/>
      </label>
      <input 
        className='form__input search__box' 
        value={searchTerm}
        type='text' 
        placeholder='Search...' 
        name='search' 
        id='search'
        onChange={event => setSearchTerm(event.target.value)} 
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    </section>
  );
}

export default SearchBox;
