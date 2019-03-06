import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <Link to="/">Home</Link>

    <nav>
      <Link to="/login">Log In</Link>
    </nav>
    <nav>
      <Link to="/signup">Sign Up</Link>
    </nav>
    <nav>
      <Link to="/forget-password">Forget Password?</Link>
    </nav>

    <hr />
  </header>
);

export default Header;
