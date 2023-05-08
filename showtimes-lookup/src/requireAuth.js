import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Make an axios request to check if the session exists
    axios.get('http://localhost/backend-cities-lookup/checkSession.php')
    .then(response => {
        // If session exists, set authenticated to true
        if (response.data.status === 'success') {
          setAuthenticated(true);
        }
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
