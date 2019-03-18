import { EventEmitter } from "events";

export class SessionService {
    readonly singleSession: boolean;

    protected sessions: { [id: string]: Session } = {};
    protected uidMap: { [uid: string]: Session[] } = {};
    constructor(opts: { singleSession?: boolean }) {
        this.singleSession = opts.singleSession || false;
    }


    create(id: string, frontendId: string, socket: object) {

    }

    bind(id: string, uid: string) {

    }
}

export class Session extends EventEmitter {
    readonly id: string;
    readonly frontendId: string;

    protected uid: string | undefined;

    private settings: { [key: string]: any } = {};
    constructor(id: string, frontendId: string, socket: object, service: SessionService) {
        super();

        this.id = id;
        this.frontendId = frontendId;
    }

    toFrontendSession() {

    }

    bind(uid: string) {

    }

    unbind() {

    }

    set(key: string, value: any) {

    }

    get(key: string) {

    }

    remove(key: string) {

    }

    send(msg: object) {

    }

    sendBatch(msgs: object[]) {

    }

    closed(reason: { code: number, tips?: string }) {

    }
}


export class FrontendSession {

}