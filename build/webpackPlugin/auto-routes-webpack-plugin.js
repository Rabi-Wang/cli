const fs = require('fs').promises
const path = require('path')
const chokidar = require('chokidar')

class AutoRoutesWebpackPlugin {
  constructor (options) {
    const { routesPath, pagesPath } = options
    this.routesPath = routesPath
    this.pagesPath = pagesPath
    this.route = ''
    this.watcher = chokidar.watch(this.pagesPath, {
      // usePolling: true,
    })
  }

  async init() {
    const existRoute = await fs.readFile(this.routesPath, 'utf-8')
    if (existRoute) {
      this.route = existRoute
    } else {
      this.route =
        `import React from 'react'
import { IRoutes } from './types'

export const routes: IRoutes[] = [
  {
    path: '/',
    component: React.lazy(() => import('@pages/home')),
  },]`
    }
  }

  async writeRouteToDisk (isAdd, dirname) {
    const path = dirname.split('pages')[1].replace(/\\/g, '/')

    if (path) {
      const routesItem = `  \n{ \n    path: '${path}', \n    component: React.lazy(() => import('@pages${path}')) \n  },\n`
      // console.log(this.route)
      // console.log(path)
      // console.log(!this.route.includes(`'${path}'`))
      if (isAdd && !this.route.includes(`'${path}'`)) {
        const routeArr = this.route.split('')
        routeArr.splice(this.route.length - 2, 0, routesItem)
        this.route = routeArr.join('')
      }
      if (!isAdd) {
        this.route = this.route.replace(routesItem, '')
      }
      // console.log(this.route)
      const oldRoute = await fs.readFile(this.routesPath, 'utf-8')
      // console.log(route)
      // console.log(oldRoute)
      // console.log(oldRoute === route)
      if (oldRoute !== this.route) {
        const routeFile = await fs.open(this.routesPath, 'w')
        await routeFile.writeFile(this.route)
        await routeFile.close()
      }
    }
  }

  writeRoute () {
    this.watcher
      .on('addDir', this.writeRouteToDisk.bind(this, true))
      .on('unlinkDir', this.writeRouteToDisk.bind(this, false))
  }

  apply (compiler) {
    compiler.hooks.watchRun .tapAsync('AutoRoutesWebpackPlugin', async (params, callback) => {
      try {
        await this.init()
        await this.writeRoute(this.routesPath, this.pagesPath)
        callback()
      } catch (e) {
        console.log(e)
      }
    })
  }

  // async apply () {
  //   await this.init()
  //   this.writeRoute()
  // }
}

// const test = new AutoRoutesWebpackPlugin({
//   routesPath: path.resolve(__dirname, '../../src/config/routes.ts'),
//   pagesPath: path.resolve(__dirname, '../../src/pages'),
// })
//
// test.apply()

module.exports = {
  AutoRoutesWebpackPlugin,
}
