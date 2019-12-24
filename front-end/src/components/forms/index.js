import React from 'react';
import { Card, Icon, Avatar } from 'antd';
import {
  useRouteMatch, Link, Route, Switch,
} from 'react-router-dom';
import FormScreen from '../../containers/form-screen';

const { Meta } = Card;

const Forms = (props) => {
  const { path, url } = useRouteMatch();

  const renderFormPlaceHolder = (form, index) => (
    <Link key={index} to={form.url}>
      <Card
        style={{ width: 300, margin: 10 }}
        cover={(
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
                      )}
        actions={[
          <Icon type="setting" key="setting" />,
          <Icon type="edit" key="edit" />,
          <Icon type="ellipsis" key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={form.title}
          description="This is the description"
        />
      </Card>
    </Link>
  );

  return (
    <div>
      <h2>Forms</h2>
      <Switch>
        <Route exact path={path}>
          <h3>Please select a form to render:</h3>
          {props.forms.map((form, index) => renderFormPlaceHolder(form, index))}
        </Route>
        <Route path={`${url}/:id`}>
          <FormScreen forms={props.forms} />
        </Route>
      </Switch>
    </div>
  );
};

export default Forms;
