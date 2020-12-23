import React, { Suspense } from 'react'
import { Route } from 'react-router'
import { IRoutes } from './types'

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
