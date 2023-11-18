// use Express for type information

import { 
    FastifyPluginAsync,
 } from 'fastify'
import fp from 'fastify-plugin'

import { 
    FastifyRequest,
    FastifyReply,
    FastifyPluginOptions
} from 'fastify'

import { serialize } from 'cookie'

import { Auth } from '@hellocoop/types'
import { 
    router,
    HelloResponse, 
    HelloRequest, 
    clearAuthCookieParams,
    getAuthfromCookies, 
    isConfigured,
    configure,
    Config,
}  from '@hellocoop/router'

const convertToHelloRequest = ( req: FastifyRequest ): HelloRequest => {
    return {
        headers: () => { return req.headers as { [key: string]: string }},
        query: req.query as { [key: string]: string } | {},
        path: req.routeOptions.url,
        getAuth: () => { return req.auth },
        setAuth: (auth: Auth) => {req.auth = auth},
    }
}


const convertToHelloResponse = ( res: FastifyReply ): HelloResponse => {
    return {
        clearAuth: () => {
            const { name, value, options } = clearAuthCookieParams()
            res.header('Set-Cookie', serialize(name, value, options))
        },
        send: (data: any) => res.type('text/html').send( data ),
        json: (data: any) => res.send( data),
        redirect: (url : string) => res.redirect(url),
        setCookie: (name: string, value: string, options: any) => {
            res.header('Set-Cookie', serialize(name, value, options))
        },
        setHeader: (name: string, value: string) => res.header(name, value),
        status: ( statusCode: number) => { 
            res.code(statusCode) 
            return {
                send: (data: any) => res.send(data)
            }
        },
    }
}



declare module 'fastify' {
    interface FastifyRequest {
      auth?: Auth,
      getAuth: () => Promise<Auth>
    }
    interface FastifyReply {
      clearAuth: () => void,
    }
  }
  
export interface HelloConfig extends FastifyPluginOptions, Config {}
  
  
const helloPlugin: FastifyPluginAsync <HelloConfig> = async (instance, options) => {
    if (!isConfigured)
       configure(options)
    instance.decorateRequest('auth', undefined)
    instance.decorateRequest('getAuth', async function () { 
        const helloReq = convertToHelloRequest(this)
        this.auth = await getAuthfromCookies(helloReq)
        return this.auth  
     })
    instance.decorateReply('clearAuth', function () {
        const { name, value, options } = clearAuthCookieParams()
        this.header('Set-Cookie', serialize(name, value, options))
    })

    instance.get('/api/hellocoop', async (req, res) => {
      const helloReq = convertToHelloRequest(req)
      const helloRes = convertToHelloResponse(res)
      return await router(helloReq, helloRes)
    })
}

export default fp( helloPlugin )