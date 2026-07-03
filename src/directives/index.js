import { vPermission } from './vPermission'
import { vDebounce } from './vDebounce'
import { vLazy } from './vLazy'

export function setupDirectives(app) {
  app.directive('permission', vPermission)
  app.directive('debounce', vDebounce)
  app.directive('lazy', vLazy)
}
