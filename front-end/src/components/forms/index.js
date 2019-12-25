import React from 'react';
import {
  Card, Icon, Row, Col,
} from 'antd';
import {
  useRouteMatch, Link, Route, Switch,
} from 'react-router-dom';
import FormScreen from '../../containers/form-screen';

const { Meta } = Card;

const Forms = (props) => {
  const { path, url } = useRouteMatch();

  const renderFormPlaceHolder = (form, index) => (
    <Col key={index} span={6}>
      <Link to={form.url}>
        <div>
          <Card
            actions={[
              <Icon type="form" key="form" />,
            ]}
          >
            <Meta
              title={form.title}
            />
          </Card>
        </div>
      </Link>
    </Col>
  );

  const { forms } = props;

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <h2>Forms</h2>
          <h3>Please select a form to render:</h3>
          <Row gutter={16}>
            {forms.map((form, index) => renderFormPlaceHolder(form, index))}
          </Row>
        </Route>
        <Route path={`${url}/:id`}>
          <FormScreen />
        </Route>
      </Switch>
    </div>
  );
};

export default Forms;
