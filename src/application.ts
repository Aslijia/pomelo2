import { EventEmitter } from "events";
import * as path from 'path';

export function instance(opts?: object) {
    return new Application(opts || {});
}

export class Application extends EventEmitter {
    readonly serverId: string;
    readonly serverType: string;
    readonly main: string;
    readonly workspace: string;

    constructor(opts: { workspace?: string }) {
        super();

        this.main = process.mainModule ? process.mainModule.filename : '';
        this.workspace = opts.workspace || path.parse(this.main).dir;

        this.serverId = '';
        this.serverType = '';
    }

}