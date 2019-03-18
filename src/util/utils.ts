
/**
 * Get the count of elements of object
 */
export function size(obj: object) {
    return Object.keys(obj).length;
};

/**
 * Check a string whether ends with another string
 */
export function endsWith(str: string, suffix: string) {
    if (typeof str !== 'string' || typeof suffix !== 'string' ||
        suffix.length > str.length) {
        return false;
    }
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * Check a string whether starts with another string
 */
export function startsWith(str: string, prefix: string) {
    if (typeof str !== 'string' || typeof prefix !== 'string' ||
        prefix.length > str.length) {
        return false;
    }

    return str.indexOf(prefix) === 0;
};

/**
 * check if has Chinese characters.
 */
export function hasChineseChar(str: string) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
        return true;
    } else {
        return false;
    }
};

/**
 * transform unicode to utf8
 */
export function unicodeToUtf8(str: string) {
    var i, len, ch;
    var utf8Str = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        ch = str.charCodeAt(i);

        if ((ch >= 0x0) && (ch <= 0x7F)) {
            utf8Str += str.charAt(i);

        } else if ((ch >= 0x80) && (ch <= 0x7FF)) {
            utf8Str += String.fromCharCode(0xc0 | ((ch >> 6) & 0x1F));
            utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

        } else if ((ch >= 0x800) && (ch <= 0xFFFF)) {
            utf8Str += String.fromCharCode(0xe0 | ((ch >> 12) & 0xF));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

        } else if ((ch >= 0x10000) && (ch <= 0x1FFFFF)) {
            utf8Str += String.fromCharCode(0xF0 | ((ch >> 18) & 0x7));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

        } else if ((ch >= 0x200000) && (ch <= 0x3FFFFFF)) {
            utf8Str += String.fromCharCode(0xF8 | ((ch >> 24) & 0x3));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

        } else if ((ch >= 0x4000000) && (ch <= 0x7FFFFFFF)) {
            utf8Str += String.fromCharCode(0xFC | ((ch >> 30) & 0x1));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 24) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
            utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

        }

    }
    return utf8Str;
};
import * as cp from 'child_process';
/**
 * Ping server to check if network is available
 *
 */
export function ping(host: string, cb: Function) {
    if (!module.exports.isLocal(host)) {
        var cmd = 'ping -w 15 ' + host;
        cp.exec(cmd, function (err, stdout, stderr) {
            if (!!err) {
                cb(false);
                return;
            }
            cb(true);
        });
    } else {
        cb(true);
    }
};


export function isLocal(host: string) {
    return host === '127.0.0.1' || host === 'localhost' || host === '0.0.0.0' || inLocal(host);

};

export function headHandler(headBuffer: Buffer) {
    var len = 0;
    for (var i = 1; i < 4; i++) {
        if (i > 1) {
            len <<= 8;
        }
        len += headBuffer.readUInt8(i);
    }
    return len;
};

var inLocal = function (host: string) {
    for (var index in localIps) {
        if (host === localIps[index]) {
            return true;
        }
    }
    return false;
};

import * as os from 'os';
var localIps = function () {
    var ifaces = os.networkInterfaces();
    var ips: any[] = [];
    var func = function (details: any) {
        if (details.family === 'IPv4') {
            ips.push(details.address);
        }
    };
    for (var dev in ifaces) {
        ifaces[dev].forEach(func);
    }
    return ips;
}();

export function isObject(arg: any) {
    return typeof arg === 'object' && arg !== null;
};
