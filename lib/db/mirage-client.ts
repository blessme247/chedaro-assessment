
import { makeServer } from './mirage'

let server: any

export function startMirage() {
  if (typeof window !== 'undefined' && !server) {
    server = makeServer('development')
    console.log('🚀 MirageJS server started')
  }
  return server
}

export function stopMirage() {
  if (server) {
    server.shutdown()
    server = null
    console.log('🛑 MirageJS server stopped')
  }
}