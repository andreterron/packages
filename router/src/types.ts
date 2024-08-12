// Helle router types

import type { Claims, Scope, ProviderHint, Auth } from '@hellocoop/types'
import type { CookieSerializeOptions } from 'cookie'

export type CallbackRequest = {
    getHeaders: () => Record<string, string>,
}


export type CallbackResponse = {
    getHeaders: () => Record<string, string>,
    setHeader: (key: string, value: string | string[]) => void,
    setCookie: (key: string, value: string, options: CookieSerializeOptions) => void,
}

export type LoginSyncParams = {
    token: string,
    payload: Claims,
    target_uri: string,
    cbReq: CallbackRequest,
    cbRes: CallbackResponse
}

export type LoginSyncResponse = {
    accessDenied?: boolean,
    target_uri?: string,
    updatedAuth?: {[key: string]: any}
}


export type LogoutSyncParams = {
    cbReq: CallbackRequest,
    cbRes: CallbackResponse
}

export type LogoutSyncResponse = null | Error

export interface Config {
    client_id?: string,
    scope?: Scope[],
    provider_hint?: ProviderHint[],
    sameSiteStrict?: boolean,
    loginSync?: (params: LoginSyncParams) => Promise<LoginSyncResponse>,
    logoutSync?: (params: LogoutSyncParams) => Promise<LogoutSyncResponse>,
    routes?: {
        loggedIn?: string,
        loggedOut?: string,
        error?: string
    },
    cookieToken?: boolean,
    logConfig?: boolean,
    apiRoute?: string,
}

export type HelloRequest = {
    getAuth: () => Auth | undefined,
    headers: () => { [key: string]: string };
    path: string;
    query: { [key: string]: string };
    setAuth: ( auth: Auth) => void,
    method: string,
    body: any
};
  
export type HelloResponse = {
    clearAuth: () => void,
    send: (data: string) => void;
    json: ( data : any ) => void;
    redirect: (url: string) => void;
    setCookie: (name: string, value: string, options: CookieSerializeOptions) => void;
    setHeader: (name: string, value: string | string[]) => void;
    status: (statusCode: number) => { send: (data: any) => void };
    getHeaders: () => Record<string, string>
};


