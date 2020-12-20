import React, { useState } from 'react'
import {
  Switch,
  useHistory,
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
  routeWithSubRoutes,
} from '@config'
import styles from './app.module.less'

const { Sider, Content, Header, Footer } = Layout
const MenuItem = Menu.Item

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const history = useHistory()

  const handleMenuClick = (item: any) => {
    history.push(`/${item.key}`)
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo} />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']} onClick={handleMenuClick}>
          <MenuItem key="home" icon={<UserOutlined />}>home</MenuItem>
          <MenuItem key="todoList" icon={<VideoCameraOutlined />}>todo</MenuItem>
          {/*<MenuItem key="3" icon={<UploadOutlined />}>nav 3</MenuItem>*/}
        </Menu>
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
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
            {routes.map((route, index) => {
                return routeWithSubRoutes(index, route)
              })}
          </Switch>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}

export default App
