import React, { useState } from 'react'
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
import styles from './app.module.less'
// import './index.module.less'

const { Sider, Content, Header, Footer } = Layout
const MenuItem = Menu.Item

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  console.log(styles)

  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logo} />
          <Menu theme="dark" mode="inline">
            <MenuItem key="1" icon={<UserOutlined />}>nav 1</MenuItem>
            <MenuItem key="2" icon={<VideoCameraOutlined />}>nav 2</MenuItem>
            <MenuItem key="3" icon={<UploadOutlined />}>nav 3</MenuItem>
          </Menu>
        </Sider>
        <Layout className={styles.siteLayout}>
          <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuFoldOutlined : MenuUnfoldOutlined, {
              className: styles.trigger,
              onClick: () => setCollapsed(state => !state)
            })}
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
            className={styles.siteLayoutBackground}
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
  )
}

export default App
