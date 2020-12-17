import React, { useState } from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import {
  HashRouter as Router,
  Switch,
} from 'react-router-dom'
import {
  Layout,
  Menu,
} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  routes,
  RouteWithSubRoutes,
} from '@config'
import {
  stores,
  StoresContext,
} from './stores'
import '@themes/index.global.less'
import './index.less'

const { Sider, Content, Header, Footer } = Layout
const MenuItem = Menu.Item

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Provider {...stores}>
      <StoresContext.Provider value={stores}>
        <Router>
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className="logo" />
              <Menu theme="dark" mode="inline">
                <MenuItem key="1" icon={<UserOutlined />}>nav 1</MenuItem>
                <MenuItem key="2" icon={<VideoCameraOutlined />}>nav 2</MenuItem>
                <MenuItem key="3" icon={<UploadOutlined />}>nav 3</MenuItem>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }}>
                {React.createElement(collapsed ? MenuFoldOutlined : MenuUnfoldOutlined, {
                  className: 'trigger',
                  onClick: () => setCollapsed(state => !state)
                })}
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                }}
                className="site-layout-background"
              >
                <Switch>
                  {
                    routes.map((route, index) => (
                      <RouteWithSubRoutes key={index} {...route} />
                    ))
                  }
                </Switch>
              </Content>
              <Footer>Footer</Footer>
            </Layout>
          </Layout>
        </Router>
      </StoresContext.Provider>
    </Provider>
  )
}

render(<App /> ,document.getElementById('root'))
