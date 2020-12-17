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
  }
]

export const RouteWithSubRoutes:React.FC<IRoutes> = (route) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <Suspense fallback={<div>loading...</div>}>
          <route.component {...props} routes={route.routes} />
        </Suspense>
      )}
    />
  )
}
