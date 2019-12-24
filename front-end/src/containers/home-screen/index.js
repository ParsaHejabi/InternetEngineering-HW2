import React, { useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import FormScreen from '../form-screen';
import Forms from '../../components/forms';

const BACK_END_URL = 'http://localhost:9000/api/forms/';

const HomeScreen = (props) => {
  const [forms, setForms] = useState([]);

  async function getForms() {
    const res = await fetch(BACK_END_URL);

    res
      .json()
      .then((res) => {
        const forms = [];
        res.forEach((result) => {
          forms[result.id] = {
            title: result.title,
            url: result.back_end_url.substring(4),
            back_end_url: result.back_end_url,
          };
        });
        setForms(forms);
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
          <Route path="/forms/" children={<Forms forms={forms} />} />
        </Switch>
      </div>
    </Router>
  );
};

export default HomeScreen;
