import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Forms from '../../components/forms';

const BACK_END_URL = 'http://localhost:9000/api/forms/';

const HomeScreen = () => {
  const [forms, setForms] = useState([]);

  async function getForms() {
    const res = await fetch(BACK_END_URL);

    res
      .json()
      .then((newRes) => {
        const newForms = [];
        newRes.forEach((result) => {
          newForms[result.id] = {
            title: result.title,
            url: result.back_end_url.substring(4),
            back_end_url: result.back_end_url,
          };
        });
        setForms(newForms);
      });
  }

  useEffect(() => {
    getForms();
  }, []);

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/forms">Forms</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/">
            <h1>Welcome to DynaForm!</h1>
          </Route>
          <Route path="/forms/">
            <Forms forms={forms} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HomeScreen;
