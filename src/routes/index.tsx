import React from 'react'
import { Route } from 'react-router-dom'
import Loadable, { LoadingComponentProps } from 'react-loadable'
import Home from '@pages/home'

interface IRoutes {
  path: string,
  component: any,
  routes?: IRoutes[],
}

const Loading: React.FunctionComponent<LoadingComponentProps> = ({isLoading = true, children}) => {
  return (
    <div>
      {isLoading ? 'loading...' : children}
    </div>
  )
}

export const routes: IRoutes[] = [
  {
    path: '/',
    component: Loadable({
      loader: () => import('@pages/home'),
      loading: Loading,
    }),
    routes: [],
  }
]

export const RouteWithSubRoutes = (route: IRoutes) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}
