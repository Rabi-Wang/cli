import React, { ReactElement } from 'react'
import { Layout } from 'antd'
import Home from './home'

const { Header, Sider, Content, Footer } = Layout

const App: React.FC = () => {
  return (
    <Layout>
      <Sider>Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content><Home /></Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}

export default App
