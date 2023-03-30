import { EventEmitter } from 'events'
import { Socket } from 'net'

declare const version: string

declare const connectors: {
    readonly hybridconnector: new (port: number, host: string, opts?: object) => Connector
    readonly sioconnector: new (port: number, host: string, opts?: object) => Connector
    readonly udpconnector: new (port: number, host: string, opts?: object) => Connector
    readonly mqttconnector: new (port: number, host: string, opts?: object) => Connector
}

declare const pushSchedulers: {
    readonly direct: new (app: Application, opts?: object) => DirectPushScheduler
    readonly buffer: new (app: Application, opts?: object) => BufferPushScheduler
}

declare const events: {
    readonly ADD_SERVERS: string
    readonly REMOVE_SERVERS: string
    readonly REPLACE_SERVERS: string
    readonly BIND_SESSION: string
    readonly UNBIND_SESSION: string
    readonly CLOSE_SESSION: string
    readonly ADD_CRONS: string
    readonly REMOVE_CRONS: string
    readonly START_SERVER: string
    readonly START_ALL: string
}

declare const components: {
    readonly backendSession: (app: Application) => BackendSessionService
    readonly channel: (app: Application, opts?: object) => ChannelService
    readonly connection: (app: Application) => ConnectionComponent
    readonly connector: (app: Application, opts?: object) => ConnectorComponent
    readonly dictionary: (app: Application, opts?: object) => DictionaryComponent
    readonly master: (app: Application, opts?: object) => MasterComponent
    readonly monitor: (app: Application, opts?: object) => MonitorComponent
    readonly protobuf: (app: Application, opts?: object) => ProtobufComponent
    readonly proxy: (app: Application, opts?: object) => ProxyComponent
    readonly pushScheduler: (app: Application, opts?: object) => PushSchedulerComponent
    readonly remote: (app: Application, opts?: object) => RemoteComponent
    readonly server: (app: Application, opts?: object) => ServerComponent
    readonly session: (app: Application, opts?: object) => SessionComponent
}

declare const backendSession: (app: Application) => BackendSessionService
declare const channel: (app: Application, opts?: object) => ChannelService
declare const connection: (app: Application) => ConnectionComponent
declare const connector: (app: Application, opts?: object) => ConnectorComponent
declare const dictionary: (app: Application, opts?: object) => DictionaryComponent

declare const master: (app: Application, opts?: object) => MasterComponent
declare const monitor: (app: Application, opts?: object) => MonitorComponent
declare const protobuf: (app: Application, opts?: object) => ProtobufComponent
declare const proxy: (app: Application, opts?: object) => ProxyComponent
declare const pushScheduler: (app: Application, opts?: object) => PushSchedulerComponent
declare const remote: (app: Application, opts?: object) => RemoteComponent
declare const server: (app: Application, opts?: object) => ServerComponent
declare const session: (app: Application, opts?: object) => SessionComponent

declare const filters: {
    readonly serial: (timeout: number) => HandlerFilter
    readonly time: () => HandlerFilter
    readonly timeout: (timeout?: number, maxSize?: number) => HandlerFilter
    readonly toobusy: (maxLag: number) => HandlerFilter
}
declare const serial: (timeout: number) => HandlerFilter
declare const time: () => HandlerFilter
declare const timeout: (timeout?: number, maxSize?: number) => HandlerFilter
declare const toobusy: (maxLag: number) => HandlerFilter

declare const rpcFilters: {
    readonly rpcLog: () => RPCFilter
    readonly toobusy: (maxLag: number) => RPCFilter
}

declare function createApp(opts?: object): Application

declare interface ServerContext {
    app: Application
    reload(): Promise<any>

    [prop: string]: any
}

declare interface Application {
    rpc: any

    readonly env: string
    readonly serverType: string

    init(opts: object): void

    getBase(): string

    require(ph: string): any

    configureLogger(logger: object): void

    filter(filter: object | Function): void

    globalFilter(filter: object | Function): void

    before(bf: object | Function): void

    after(af: object | Function): void

    globalBefore(bf: object | Function): void

    globalAfter(af: object | Function): void

    rpcBefore(bf: object | Function): void

    rpcAfter(af: object | Function): void

    rpcFilter(filter: object | Function): void

    load(name: string | null, component: object | Function, opts?: object): object

    loadConfigBaseApp(key: string, val: string, reload: boolean): void

    getConfigBasePath(val: string): string | undefined

    loadConfig(key: string, val: string): void

    route(serverType: string, routeFunc: Function): Application

    beforeStopHook(fun: Function): void

    start(cb?: Function): void

    afterStart(cb: Function): void

    stop(force?: boolean): void

    set(setting: string, val?: any, attach?: boolean): Application | any

    get(key: 'channelService'): ChannelService

    get(key: 'sessionService'): SessionService

    get(setting: string): any

    enabled(setting: string): boolean

    disabled(setting: string): boolean

    enable(setting: string): Application

    disable(setting: string): Application

    configure(env: string, type: string, fn: Function): Application

    configure(env: string, fn: Function): Application

    registerAdmin(moduleId: string, module: object, opts: object): void

    use(plugin: { components: string }, opts: object): void

    transaction(name: string, conditions: CallbackMap, handlers: CallbackMap, retry: number): void

    getMaster(): MasterInfo

    readonly master: MasterInfo
    readonly context: ServerContext
    readonly components: any

    getCurServer(): ServerInfo

    getServerId(): string

    getServerType(): string

    getServers(): { [key: string]: ServerInfo }

    readonly servers: { [key: string]: ServerInfo }

    getServersFromConfig(): { [key: string]: ServerInfo }

    getServerTypes(): Array<string | number>

    getServerById(serverId: string | number): ServerInfo

    getServerFromConfig(serverId: string | number): ServerInfo

    getServersByType(serverType: string | number): Array<ServerInfo>

    isFrontend(server?: ServerInfo): boolean

    isBackend(server?: ServerInfo): boolean

    isMaster(): boolean

    addServers(servers: Array<ServerInfo>): void

    removeServers(ids: Array<string | number>): void

    replaceServers(servers: { [idx: string]: ServerInfo }): void

    addCrons(crons: Array<any>): void

    removeCrons(crons: Array<any>): void

    readonly channelService: ChannelService
    readonly backendSessionService: BackendSessionService
    readonly localSessionService: BackendSessionService
    readonly event: EventEmitter

    readonly statusService: StatusService
}

declare interface StatusService {
    start(cb: Function): void
    stop(cb: Function): void
    clean(cb: Function): void

    add(uid: number | string, sid: string, frontendId: string): Promise<any>
    leave(uid: number | string, sid: string): Promise<any>
    getSidsByUid(uid: number | string): Promise<{ [frontedId: string]: string[] }>
    getFrontendIdsByUid(uid: number | string): Promise<string[]>
    getStatusByUid(uid: number | string): Promise<boolean>
    pushByUids(uids: (string | number)[], route: string, msg: any): Promise<any>
    getUids(): Promise<string[]>
}

declare interface Connector extends EventEmitter {
    new (port: number, host: string, opts: object): Connector

    start(cb: Function): void

    stop(): void

    close?(): void
}

declare interface CallbackMap {
    [name: string]: { (cb: Function): void }
}

declare interface MasterInfo {
    id: string
    host: string
    port: number
}

declare interface ServerInfo {
    id: string
    host: string
    port: number
    serverType?: string | number
    frontend?: boolean | string
    clientHost?: string
    clientPort?: number
    instance?: string
}

declare interface FakeSession {
    /// user id :string
    uid: number | string
    /// session id :string;
    id: string
    /// session server id :string;
    frontendId: string
    [ids: string]: any
}

declare interface BackendSession {
    new (opts: object, service: BackendSessionService): BackendSession

    bind(uid: number | string, cb: Function): void

    unbind(uid: number | string, cb: Function): void

    set(key: string, value: any): void

    get(key: string): any

    push(key: string, cb: Function): void

    pushAll(cb: Function): void

    export(): { [name: string]: any }

    /// user id :string
    uid: number | string
    /// session id :string;
    id: string
    /// session server id :string;
    frontendId: string
}

declare interface BackendSessionService {
    readonly name: string

    new (app: Application): BackendSessionService

    create(opts: object): BackendSession

    get(frontendId: string, sid: string, cb: Function): void

    getByUid(frontendId: string, uid: number | string, cb: Function): void

    kickBySid(frontendId: string, sid: string, reason: any, cb: Function): void

    kickByUid(frontendId: string, uid: number | string, reason: any, cb: Function): void

    bind(frontendId: string, sid: string, uid: number | string, cb: Function): void

    unbind(frontendId: string, sid: string, uid: number | string, cb: Function): void

    push(frontendId: string, sid: string, key: string, value: object, cb: Function): void

    pushAll(frontendId: string, sid: string, settings: object, cb: Function): void
}

declare interface Channel {
    new (name: string, service: ChannelService): Channel

    add(uid: number | string, sid: string): boolean

    leave(uid: number | string, sid: string): boolean

    getUserAmount(): number

    getMembers(): Array<{ sid: string; [idx: string]: any }>

    getMember(uid: number | string): { sid: string; [idx: string]: any }

    destroy(): void

    pushMessage(msg: object, cb?: Function): void

    pushMessage(msg: object, opts: object, cb?: Function): void

    pushMessage(route: string, msg: object, opts: object, cb?: Function): void
}

declare interface ChannelService {
    new (app: Application, opts?: object): ChannelService

    start(cb: Function): void

    createChannel(name: string): Channel

    getChannel(name: string, create: boolean): Channel

    destroyChannel(name: string): void

    pushMessageByUids(msg: object, uids: Array<{ uid: number | string; sid: string }>, cb?: Function): void

    pushMessageByUids(msg: object, uids: Array<{ uid: number | string; sid: string }>, opts?: object, cb?: Function): void

    pushMessageByUids(route: string, msg: object, uids: Array<{ uid: number | string; sid: string }>, opts: object, cb: Function): void

    /**
     * Broadcast message to all the connected clients.
     *
     * @param  {String}   stype      frontend server type string
     * @param  {String}   route      route string
     * @param  {Object}   msg        message
     * @param  {Object}   opts       user-defined broadcast options, optional
     *                               opts.binded: push to binded sessions or all the sessions
     *                               opts.filterParam: parameters for broadcast filter.
     * @param  {Function} cb         callback
     * @memberOf ChannelService
     */
    broadcast(stype: string, route: string, msg: object, opts: { binded?: boolean; filterParam?: any }, cb: Function): void
}

declare interface ConnectionService {
    addLoginedUser(uid: number | string, info: object): void

    updateUserInfo(uid: number | string, info: object): void

    increaseConnectionCount(): void

    removeLoginedUser(uid: number | string): void

    decreaseConnectionCount(): void

    getStatisticsInfo(): {
        serverId: string
        totalConnCount: number
        loginedCount: number
        loginedList: Array<string>
    }
}

declare interface ConnectionComponent extends ConnectionService {
    readonly name: string
}

declare interface ConnectorComponent {
    readonly name: string

    start(cb: Function): void

    afterStart(cb: Function): void

    stop(force: boolean, cb: Function): void

    send(reqId: number, route: string, msg: object, recvs: Array<string>, opts: object, cb: Function): void

    sendAsync(reqId: number, route: string, msg: object, recvs: Array<string>, opts: object, cb: Function): void

    doSend(reqId: number, route: string, msg: object, recvs: Array<string>, opts: object, cb: Function): void

    setPubKey(id: number | string, key: object): void

    getPubKey(id: number | string): object
}

declare interface DictionaryComponent {
    readonly name: string

    start(cb: Function): void

    getDict(): object

    getAbbrs(): object

    getVersion(): string
}

declare interface MasterComponent {
    readonly name: string

    start(cb: Function): void

    stop(force: boolean, cb: Function): void
}

declare interface MonitorComponent {
    readonly name: string

    start(cb: Function): void

    stop(force: boolean, cb: Function): void

    reconnect(masterInfo: MasterInfo): void
}

declare interface ProtobufComponent {
    readonly name: string

    encode(key: string, msg: object): Buffer

    encode2Bytes(key: string, msg: object): Uint8Array

    decode(key: string, msg: Buffer | Uint16Array): object

    getProtos(): { server: object; client: object; version: string }

    getVersion(): string

    setProtos(type: 'server' | 'client', path: string): void
}

declare interface ProxyComponent {
    readonly name: string

    start(cb: Function): void

    afterStart(cb: Function): void

    addServers(servers: Array<ServerInfo>): void

    removeServers(ids: Array<string | number>): void

    replaceServers(servers: Array<ServerInfo>): void

    rpcInvoke(serverId: string | number, msg: object, cb: Function): void
}

declare interface PushSchedulerComponent {
    readonly name: string

    afterStart(cb: Function): void

    stop(force: boolean, cb: Function): void

    schedule(reqId: number, route: string, msg: object, recvs: Array<string>, opts: object, cb: Function): void
}

declare interface RemoteComponent {
    readonly name: string

    start(cb: Function): void

    stop(force: boolean, cb: Function): void
}

declare interface ServerComponent {
    readonly name: string

    start(cb: Function): void

    afterStart(cb: Function): void

    stop(force: boolean, cb: Function): void

    handle(msg: object, session: any, cb: Function): void
}

declare interface FrontendSession extends EventEmitter {
    uid: number | string

    id: string

    frontendId: string

    bind(uid: number | string, cb: Function): void

    unbind(uid: number | string, cb: Function): void

    set(key: any, value: any): void

    get(key: any): any

    push(key: string | object, cb: Function): void

    pushAll(cb: Function): void

    export(): object
}

declare interface Session extends EventEmitter {
    uid: number | string
    id: string
    frontendId: string

    toFrontendSession(): FrontendSession

    bind(uid: number | string): void

    bind(uid: number | string, cb: () => void): void

    set(key: string | object, value: any): void

    remove(key: string | object): void

    get(key: string | object): any

    send(msg: object): void

    sendBatch(msgs: Array<object>): void

    closed(reason: string): void

    push(key: string | object, cb: Function): void

    pushAll(cb: Function): void
}

declare interface SessionService {
    create(sid: string, frontendId: string, socket: Socket): Session

    bind(sid: string, uid: number | string, cb: Function): void

    unbind(sid: string, uid: number | string, cb: Function): void

    get(sid: string): Session

    getByUid(uid: number | string): Array<Session>

    remove(sid: string): void

    import(sid: string, key: string | object, value: object, cb: Function): void

    importAll(sid: string, settings: object, cb: Function): void

    kick(uid: number | string, reason: string, cb: Function): void

    kickBySessionId(sid: string, reason: string, cb: Function): void

    getClientAddressBySessionId(sid: string): string | null

    sendMessage(sid: string, msg: object): boolean

    sendMessageByUid(uid: number | string, msg: object): boolean | undefined

    forEachSession(cb: Function): void

    forEachBindedSession(cb: Function): void

    getSessionsCount(): number
}

declare interface HandlerFilter {
    before(msg: object, session: Session, next: Function): void

    after(err: string | object | null, msg: object, session: Session, next: Function): void
}

declare interface RPCFilter {
    before(serverId: string, msg: object, opts: object, next: Function): void

    after(serverId: string, msg: object, opts: object, next: Function): void
}

declare interface SessionComponent extends SessionService {
    readonly name: string
}

declare interface BufferPushScheduler {
    new (app: Application, opts?: object): this

    start(cb?: Function): void

    stop(force: boolean, cb?: Function): void

    schedule(reqId: number, route: string, msg: object, recvs: Array<number | string>, opts?: object, cb?: Function): void
}

declare interface DirectPushScheduler {
    new (app: Application, opts?: object): this

    schedule(reqId: number, route: string, msg: object, recvs: Array<number | string>, opts?: object, cb?: Function): void
}

declare interface MasterAgent {
    request(serverId: string, moduleId: string, msg: any, cb: Function): boolean

    requestServer(serverId: string, serverInfo: any, moduleId: string, msg: any, cb: Function): boolean

    notifyById(serverId: string, moduleId: string, msg: any): boolean

    notifyByServer(serverId: string, serverInfo: any, moduleId: string, msg: any): boolean

    notifyByType(type: string, moduleId: string, msg: any): boolean

    notifyAll(moduleId: string, msg: any): boolean

    notifyClient(clientId: string, moduleId: string, msg: any): boolean

    notifyCommand(command: string, moduleId: string, msg: any): boolean
}

declare const app: Application
