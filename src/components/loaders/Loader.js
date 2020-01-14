import React from 'react';

const Loader = ({ size, color }) => {
  return (
    <div className={`loader ${size && `loader--${size}`} ${color && `loader--${color}`}`} />
  );
}

export default Loader;
