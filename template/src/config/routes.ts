import React from 'react'
import { IRoutes } from './types'

export const routes: IRoutes[] = [
  {
    path: '/',
    component: React.lazy(() => import('@pages/home')),
  },  {
    path: '/home',
    component: React.lazy(() => import('@pages/home'))
  },
  {
    path: '/todoList',
    component: React.lazy(() => import('@pages/todoList'))
  },
]
