export interface IRoutes {
  path: string,
  component: any,
  routes?: IRoutes[],
  exact?: boolean,
  authority?: string[],
  icon?: string[],
  name?: string,
}
