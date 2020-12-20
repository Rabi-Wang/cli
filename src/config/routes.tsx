import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'

interface IRoutes {
  path: string,
  component: any,
  routes?: IRoutes[],
  exact?: boolean,
  authority?: string[],
  icon?: string[],
  name?: string,
}

export const routes: IRoutes[] = [
  {
    path: '/',
    component: React.lazy(() => import('@pages/home')),
  },
  {
    path: '/home',
    component: React.lazy(() => import('@pages/home')),
  },
  {
    path: '/todoList',
    component: React.lazy(() => import('@pages/todoList')),
  },
]

export const routeWithSubRoutes = (key: any, route: IRoutes) => {
  return (
    <Route
      key={key}
      exact={route.exact === undefined ? true : route.exact}
      path={route.path}
      render={props => (
        <Suspense fallback={<div>loading...</div>}>
          <route.component {...props} routes={route.routes} />
        </Suspense>
      )}
    />
  )
}
