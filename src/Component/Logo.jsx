import React from 'react';
import blog from '../assets/blog.svg';

const Logo = ({ width = '50px' }) => {
  return (
    <div>
      <img src={blog} alt="Blog Logo" style={{ width }} />
    </div>
  );
};

export default Logo;