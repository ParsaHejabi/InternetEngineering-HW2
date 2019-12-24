import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Layout,
  Menu,
  Icon,
} from 'antd';
import Forms from '../../components/forms';

const {
  Content, Footer, Sider,
} = Layout;

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
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="home" />
                <span className="nav-text">Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/forms">
                <Icon type="form" />
                <span className="nav-text">Forms</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ minHeight: '100vh' }}>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
              <Switch>
                <Route exact path="/">
                  <h1>Welcome to DynaForm!</h1>
                </Route>
                <Route path="/forms/">
                  <Forms forms={forms} />
                </Route>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Parsa Hejabi & Reza Ferdosi ©2019</Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default HomeScreen;
