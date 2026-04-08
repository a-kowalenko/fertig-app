var $E = Object.defineProperty;
var wh = (e) => {
  throw TypeError(e);
};
var vE = (e, t, r) => t in e ? $E(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var ns = (e, t, r) => vE(e, typeof t != "symbol" ? t + "" : t, r), Uc = (e, t, r) => t.has(e) || wh("Cannot " + r);
var le = (e, t, r) => (Uc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), zt = (e, t, r) => t.has(e) ? wh("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Nt = (e, t, r, n) => (Uc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), br = (e, t, r) => (Uc(e, t, "access private method"), r);
import Cr, { app as pi, BrowserWindow as _E, ipcMain as xr, dialog as Sh } from "electron";
import ve from "node:path";
import EE from "node:fs/promises";
import { fileURLToPath as wE } from "node:url";
import Ce from "node:process";
import { promisify as it, isDeepStrictEqual as bh } from "node:util";
import ue from "node:fs";
import is from "node:crypto";
import Ph from "node:assert";
import Ky from "node:os";
import "node:events";
import "node:stream";
import mn from "fs";
import SE from "constants";
import Xs from "stream";
import bu from "util";
import Wy from "assert";
import Fe from "path";
import Bo from "child_process";
import Yy from "events";
import Js from "crypto";
import Xy from "tty";
import Go from "os";
import yn from "url";
import Jy from "zlib";
import bE from "http";
const Gn = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Qy = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Zy = 1e6, PE = (e) => e >= "0" && e <= "9";
function e0(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Zy;
  }
  return !1;
}
function Mc(e, t) {
  return Qy.has(e) ? !1 : (e && e0(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function TE(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", i = !1, s = 0;
  for (const a of e) {
    if (s++, i) {
      r += a, i = !1;
      continue;
    }
    if (a === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${a}' in an index at position ${s}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${a}' after an index at position ${s}`);
      i = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (a) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Mc(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Mc(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const o = Number.parseInt(r, 10);
            !Number.isNaN(o) && Number.isFinite(o) && o >= 0 && o <= Number.MAX_SAFE_INTEGER && o <= Zy && r === String(o) ? t.push(o) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${s}`);
        r += a;
        break;
      }
      default: {
        if (n === "index" && !PE(a))
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${s}`);
        n === "start" && (n = "property"), r += a;
      }
    }
  }
  switch (i && (r += "\\"), n) {
    case "property": {
      if (!Mc(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Ho(e) {
  if (typeof e == "string")
    return TE(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Qy.has(n))
        return [];
      typeof n == "string" && e0(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Th(e, t, r) {
  if (!Gn(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = Ho(t);
  if (n.length === 0)
    return r;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (e = e[s], e == null) {
      if (i !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function Sa(e, t, r) {
  if (!Gn(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, i = Ho(t);
  if (i.length === 0)
    return e;
  for (let s = 0; s < i.length; s++) {
    const a = i[s];
    if (s === i.length - 1)
      e[a] = r;
    else if (!Gn(e[a])) {
      const c = typeof i[s + 1] == "number";
      e[a] = c ? [] : {};
    }
    e = e[a];
  }
  return n;
}
function NE(e, t) {
  if (!Gn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ho(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !Gn(e))
      return !1;
  }
}
function xc(e, t) {
  if (!Gn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ho(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Gn(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Qr = Ky.homedir(), Pu = Ky.tmpdir(), { env: mi } = Ce, RE = (e) => {
  const t = ve.join(Qr, "Library");
  return {
    data: ve.join(t, "Application Support", e),
    config: ve.join(t, "Preferences", e),
    cache: ve.join(t, "Caches", e),
    log: ve.join(t, "Logs", e),
    temp: ve.join(Pu, e)
  };
}, OE = (e) => {
  const t = mi.APPDATA || ve.join(Qr, "AppData", "Roaming"), r = mi.LOCALAPPDATA || ve.join(Qr, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ve.join(r, e, "Data"),
    config: ve.join(t, e, "Config"),
    cache: ve.join(r, e, "Cache"),
    log: ve.join(r, e, "Log"),
    temp: ve.join(Pu, e)
  };
}, AE = (e) => {
  const t = ve.basename(Qr);
  return {
    data: ve.join(mi.XDG_DATA_HOME || ve.join(Qr, ".local", "share"), e),
    config: ve.join(mi.XDG_CONFIG_HOME || ve.join(Qr, ".config"), e),
    cache: ve.join(mi.XDG_CACHE_HOME || ve.join(Qr, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ve.join(mi.XDG_STATE_HOME || ve.join(Qr, ".local", "state"), e),
    temp: ve.join(Pu, t, e)
  };
};
function IE(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ce.platform === "darwin" ? RE(e) : Ce.platform === "win32" ? OE(e) : AE(e);
}
const Vr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(r);
  };
}, Pr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (s) {
      return r(s);
    }
  };
}, CE = 250, qr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, a = i.interval ?? CE, o = Date.now() + s;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!r(l) || Date.now() >= o)
          throw l;
        const f = Math.round(a * Math.random());
        return f > 0 ? new Promise((h) => setTimeout(h, f)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, Br = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, a = Date.now() + s;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (u) {
          if (!r(u) || Date.now() >= a)
            throw u;
          continue;
        }
    };
  };
}, yi = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!yi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !DE && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!yi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!yi.isNodeError(e))
      throw e;
    if (!yi.isChangeErrorOk(e))
      throw e;
  }
}, ba = {
  onError: yi.onChangeError
}, Ft = {
  onError: () => {
  }
}, DE = Ce.getuid ? !Ce.getuid() : !1, st = {
  isRetriable: yi.isRetriableError
}, ct = {
  attempt: {
    /* ASYNC */
    chmod: Vr(it(ue.chmod), ba),
    chown: Vr(it(ue.chown), ba),
    close: Vr(it(ue.close), Ft),
    fsync: Vr(it(ue.fsync), Ft),
    mkdir: Vr(it(ue.mkdir), Ft),
    realpath: Vr(it(ue.realpath), Ft),
    stat: Vr(it(ue.stat), Ft),
    unlink: Vr(it(ue.unlink), Ft),
    /* SYNC */
    chmodSync: Pr(ue.chmodSync, ba),
    chownSync: Pr(ue.chownSync, ba),
    closeSync: Pr(ue.closeSync, Ft),
    existsSync: Pr(ue.existsSync, Ft),
    fsyncSync: Pr(ue.fsync, Ft),
    mkdirSync: Pr(ue.mkdirSync, Ft),
    realpathSync: Pr(ue.realpathSync, Ft),
    statSync: Pr(ue.statSync, Ft),
    unlinkSync: Pr(ue.unlinkSync, Ft)
  },
  retry: {
    /* ASYNC */
    close: qr(it(ue.close), st),
    fsync: qr(it(ue.fsync), st),
    open: qr(it(ue.open), st),
    readFile: qr(it(ue.readFile), st),
    rename: qr(it(ue.rename), st),
    stat: qr(it(ue.stat), st),
    write: qr(it(ue.write), st),
    writeFile: qr(it(ue.writeFile), st),
    /* SYNC */
    closeSync: Br(ue.closeSync, st),
    fsyncSync: Br(ue.fsyncSync, st),
    openSync: Br(ue.openSync, st),
    readFileSync: Br(ue.readFileSync, st),
    renameSync: Br(ue.renameSync, st),
    statSync: Br(ue.statSync, st),
    writeSync: Br(ue.writeSync, st),
    writeFileSync: Br(ue.writeFileSync, st)
  }
}, kE = "utf8", Nh = 438, FE = 511, LE = {}, jE = Ce.geteuid ? Ce.geteuid() : -1, UE = Ce.getegid ? Ce.getegid() : -1, ME = 1e3, xE = !!Ce.getuid;
Ce.getuid && Ce.getuid();
const Rh = 128, VE = (e) => e instanceof Error && "code" in e, Oh = (e) => typeof e == "string", Vc = (e) => e === void 0, qE = Ce.platform === "linux", t0 = Ce.platform === "win32", Tu = ["SIGHUP", "SIGINT", "SIGTERM"];
t0 || Tu.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
qE && Tu.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class BE {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (t0 && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ce.kill(Ce.pid, "SIGTERM") : Ce.kill(Ce.pid, t));
      }
    }, this.hook = () => {
      Ce.once("exit", () => this.exit());
      for (const t of Tu)
        try {
          Ce.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const GE = new BE(), HE = GE.register, lt = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, r = !0) => {
    const n = lt.truncate(t(e));
    return n in lt.store ? lt.get(e, t, r) : (lt.store[n] = r, [n, () => delete lt.store[n]]);
  },
  purge: (e) => {
    lt.store[e] && (delete lt.store[e], ct.attempt.unlink(e));
  },
  purgeSync: (e) => {
    lt.store[e] && (delete lt.store[e], ct.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in lt.store)
      lt.purgeSync(e);
  },
  truncate: (e) => {
    const t = ve.basename(e);
    if (t.length <= Rh)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Rh;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
HE(lt.purgeSyncAll);
function r0(e, t, r = LE) {
  if (Oh(r))
    return r0(e, t, { encoding: r });
  const i = { timeout: r.timeout ?? ME };
  let s = null, a = null, o = null;
  try {
    const c = ct.attempt.realpathSync(e), u = !!c;
    e = c || e, [a, s] = lt.get(e, r.tmpCreate || lt.create, r.tmpPurge !== !1);
    const l = xE && Vc(r.chown), f = Vc(r.mode);
    if (u && (l || f)) {
      const p = ct.attempt.statSync(e);
      p && (r = { ...r }, l && (r.chown = { uid: p.uid, gid: p.gid }), f && (r.mode = p.mode));
    }
    if (!u) {
      const p = ve.dirname(e);
      ct.attempt.mkdirSync(p, {
        mode: FE,
        recursive: !0
      });
    }
    o = ct.retry.openSync(i)(a, "w", r.mode || Nh), r.tmpCreated && r.tmpCreated(a), Oh(t) ? ct.retry.writeSync(i)(o, t, 0, r.encoding || kE) : Vc(t) || ct.retry.writeSync(i)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ct.retry.fsyncSync(i)(o) : ct.attempt.fsync(o)), ct.retry.closeSync(i)(o), o = null, r.chown && (r.chown.uid !== jE || r.chown.gid !== UE) && ct.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Nh && ct.attempt.chmodSync(a, r.mode);
    try {
      ct.retry.renameSync(i)(a, e);
    } catch (p) {
      if (!VE(p) || p.code !== "ENAMETOOLONG")
        throw p;
      ct.retry.renameSync(i)(a, lt.truncate(e));
    }
    s(), a = null;
  } finally {
    o && ct.attempt.closeSync(o), a && lt.purge(a);
  }
}
var $t = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function n0(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bl = { exports: {} }, i0 = {}, rr = {}, Ii = {}, Qs = {}, fe = {}, Ds = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((N, D) => `${N}${D}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((N, D) => (D instanceof r && (N[D.str] = (N[D.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(m, ...E) {
    const N = [m[0]];
    let D = 0;
    for (; D < E.length; )
      o(N, E[D]), N.push(m[++D]);
    return new n(N);
  }
  e._ = i;
  const s = new n("+");
  function a(m, ...E) {
    const N = [h(m[0])];
    let D = 0;
    for (; D < E.length; )
      N.push(s), o(N, E[D]), N.push(s, h(m[++D]));
    return c(N), new n(N);
  }
  e.str = a;
  function o(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(f(E));
  }
  e.addCodeArg = o;
  function c(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === s) {
        const N = u(m[E - 1], m[E + 1]);
        if (N !== void 0) {
          m.splice(E - 1, 3, N);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function u(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function l(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : a`${m}${E}`;
  }
  e.strConcat = l;
  function f(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : h(Array.isArray(m) ? m.join(",") : m);
  }
  function p(m) {
    return new n(h(m));
  }
  e.stringify = p;
  function h(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = h;
  function $(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
  }
  e.getProperty = $;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(Ds);
var Gl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Ds;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class s extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = s;
  const a = (0, t._)`\n`;
  class o extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new s(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const p = this.toName(u), { prefix: h } = p, $ = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let y = this._values[h];
      if (y) {
        const E = y.get($);
        if (E)
          return E;
      } else
        y = this._values[h] = /* @__PURE__ */ new Map();
      y.set($, p);
      const v = this._scope[h] || (this._scope[h] = []), m = v.length;
      return v[m] = l.ref, p.setValue(l, { property: h, itemIndex: m }), p;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (p) => {
        if (p.value === void 0)
          throw new Error(`CodeGen: name "${p}" has no value`);
        return p.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, p) {
      let h = t.nil;
      for (const $ in u) {
        const y = u[$];
        if (!y)
          continue;
        const v = f[$] = f[$] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let E = l(m);
          if (E) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            h = (0, t._)`${h}${N} ${m} = ${E};${this.opts._n}`;
          } else if (E = p == null ? void 0 : p(m))
            h = (0, t._)`${h}${E}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return h;
    }
  }
  e.ValueScope = o;
})(Gl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Ds, r = Gl;
  var n = Ds;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Gl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, g) {
      return this;
    }
  }
  class a extends s {
    constructor(d, g, R) {
      super(), this.varKind = d, this.name = g, this.rhs = R;
    }
    render({ es5: d, _n: g }) {
      const R = d ? r.varKinds.var : this.varKind, q = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${R} ${this.name}${q};` + g;
    }
    optimizeNames(d, g) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = C(this.rhs, d, g)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class o extends s {
    constructor(d, g, R) {
      super(), this.lhs = d, this.rhs = g, this.sideEffects = R;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, g) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = C(this.rhs, d, g), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ne(d, this.rhs);
    }
  }
  class c extends o {
    constructor(d, g, R, q) {
      super(d, R, q), this.op = g;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends s {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class p extends s {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, g) {
      return this.code = C(this.code, d, g), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class h extends s {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((g, R) => g + R.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let g = d.length;
      for (; g--; ) {
        const R = d[g].optimizeNodes();
        Array.isArray(R) ? d.splice(g, 1, ...R) : R ? d[g] = R : d.splice(g, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, g) {
      const { nodes: R } = this;
      let q = R.length;
      for (; q--; ) {
        const B = R[q];
        B.optimizeNames(d, g) || (I(d, B.names), R.splice(q, 1));
      }
      return R.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, g) => K(d, g.names), {});
    }
  }
  class $ extends h {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class y extends h {
  }
  class v extends $ {
  }
  v.kind = "else";
  class m extends $ {
    constructor(d, g) {
      super(g), this.condition = d;
    }
    render(d) {
      let g = `if(${this.condition})` + super.render(d);
      return this.else && (g += "else " + this.else.render(d)), g;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let g = this.else;
      if (g) {
        const R = g.optimizeNodes();
        g = this.else = Array.isArray(R) ? new v(R) : R;
      }
      if (g)
        return d === !1 ? g instanceof m ? g : g.nodes : this.nodes.length ? this : new m(x(d), g instanceof m ? [g] : g.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, g) {
      var R;
      if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(d, g), !!(super.optimizeNames(d, g) || this.else))
        return this.condition = C(this.condition, d, g), this;
    }
    get names() {
      const d = super.names;
      return ne(d, this.condition), this.else && K(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class E extends $ {
  }
  E.kind = "for";
  class N extends E {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, g) {
      if (super.optimizeNames(d, g))
        return this.iteration = C(this.iteration, d, g), this;
    }
    get names() {
      return K(super.names, this.iteration.names);
    }
  }
  class D extends E {
    constructor(d, g, R, q) {
      super(), this.varKind = d, this.name = g, this.from = R, this.to = q;
    }
    render(d) {
      const g = d.es5 ? r.varKinds.var : this.varKind, { name: R, from: q, to: B } = this;
      return `for(${g} ${R}=${q}; ${R}<${B}; ${R}++)` + super.render(d);
    }
    get names() {
      const d = ne(super.names, this.from);
      return ne(d, this.to);
    }
  }
  class j extends E {
    constructor(d, g, R, q) {
      super(), this.loop = d, this.varKind = g, this.name = R, this.iterable = q;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, g) {
      if (super.optimizeNames(d, g))
        return this.iterable = C(this.iterable, d, g), this;
    }
    get names() {
      return K(super.names, this.iterable.names);
    }
  }
  class z extends $ {
    constructor(d, g, R) {
      super(), this.name = d, this.args = g, this.async = R;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  z.kind = "func";
  class Q extends h {
    render(d) {
      return "return " + super.render(d);
    }
  }
  Q.kind = "return";
  class se extends $ {
    render(d) {
      let g = "try" + super.render(d);
      return this.catch && (g += this.catch.render(d)), this.finally && (g += this.finally.render(d)), g;
    }
    optimizeNodes() {
      var d, g;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (g = this.finally) === null || g === void 0 || g.optimizeNodes(), this;
    }
    optimizeNames(d, g) {
      var R, q;
      return super.optimizeNames(d, g), (R = this.catch) === null || R === void 0 || R.optimizeNames(d, g), (q = this.finally) === null || q === void 0 || q.optimizeNames(d, g), this;
    }
    get names() {
      const d = super.names;
      return this.catch && K(d, this.catch.names), this.finally && K(d, this.finally.names), d;
    }
  }
  class W extends $ {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  W.kind = "catch";
  class A extends $ {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  A.kind = "finally";
  class H {
    constructor(d, g = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...g, _n: g.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, g) {
      const R = this._extScope.value(d, g);
      return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
    }
    getScopeValue(d, g) {
      return this._extScope.getValue(d, g);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, g, R, q) {
      const B = this._scope.toName(g);
      return R !== void 0 && q && (this._constants[B.str] = R), this._leafNode(new a(d, B, R)), B;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, g, R) {
      return this._def(r.varKinds.const, d, g, R);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, g, R) {
      return this._def(r.varKinds.let, d, g, R);
    }
    // `var` declaration with optional assignment
    var(d, g, R) {
      return this._def(r.varKinds.var, d, g, R);
    }
    // assignment code
    assign(d, g, R) {
      return this._leafNode(new o(d, g, R));
    }
    // `+=` code
    add(d, g) {
      return this._leafNode(new c(d, e.operators.ADD, g));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new p(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const g = ["{"];
      for (const [R, q] of d)
        g.length > 1 && g.push(","), g.push(R), (R !== q || this.opts.es5) && (g.push(":"), (0, t.addCodeArg)(g, q));
      return g.push("}"), new t._Code(g);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, g, R) {
      if (this._blockNode(new m(d)), g && R)
        this.code(g).else().code(R).endIf();
      else if (g)
        this.code(g).endIf();
      else if (R)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new m(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(d, g) {
      return this._blockNode(d), g && this.code(g).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, g) {
      return this._for(new N(d), g);
    }
    // `for` statement for a range of values
    forRange(d, g, R, q, B = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const ee = this._scope.toName(d);
      return this._for(new D(B, ee, g, R), () => q(ee));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, g, R, q = r.varKinds.const) {
      const B = this._scope.toName(d);
      if (this.opts.es5) {
        const ee = g instanceof t.Name ? g : this.var("_arr", g);
        return this.forRange("_i", 0, (0, t._)`${ee}.length`, (X) => {
          this.var(B, (0, t._)`${ee}[${X}]`), R(B);
        });
      }
      return this._for(new j("of", q, B, g), () => R(B));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, g, R, q = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${g})`, R);
      const B = this._scope.toName(d);
      return this._for(new j("in", q, B, g), () => R(B));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const g = new Q();
      if (this._blockNode(g), this.code(d), g.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Q);
    }
    // `try` statement
    try(d, g, R) {
      if (!g && !R)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const q = new se();
      if (this._blockNode(q), this.code(d), g) {
        const B = this.name("e");
        this._currNode = q.catch = new W(B), g(B);
      }
      return R && (this._currNode = q.finally = new A(), this.code(R)), this._endBlockNode(W, A);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, g) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(g), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const g = this._blockStarts.pop();
      if (g === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const R = this._nodes.length - g;
      if (R < 0 || d !== void 0 && R !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${d} expected`);
      return this._nodes.length = g, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, g = t.nil, R, q) {
      return this._blockNode(new z(d, g, R)), q && this.code(q).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, g) {
      const R = this._currNode;
      if (R instanceof d || g && R instanceof g)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${g ? `${d.kind}/${g.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const g = this._currNode;
      if (!(g instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = g.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const g = this._nodes;
      g[g.length - 1] = d;
    }
  }
  e.CodeGen = H;
  function K(b, d) {
    for (const g in d)
      b[g] = (b[g] || 0) + (d[g] || 0);
    return b;
  }
  function ne(b, d) {
    return d instanceof t._CodeOrName ? K(b, d.names) : b;
  }
  function C(b, d, g) {
    if (b instanceof t.Name)
      return R(b);
    if (!q(b))
      return b;
    return new t._Code(b._items.reduce((B, ee) => (ee instanceof t.Name && (ee = R(ee)), ee instanceof t._Code ? B.push(...ee._items) : B.push(ee), B), []));
    function R(B) {
      const ee = g[B.str];
      return ee === void 0 || d[B.str] !== 1 ? B : (delete d[B.str], ee);
    }
    function q(B) {
      return B instanceof t._Code && B._items.some((ee) => ee instanceof t.Name && d[ee.str] === 1 && g[ee.str] !== void 0);
    }
  }
  function I(b, d) {
    for (const g in d)
      b[g] = (b[g] || 0) - (d[g] || 0);
  }
  function x(b) {
    return typeof b == "boolean" || typeof b == "number" || b === null ? !b : (0, t._)`!${P(b)}`;
  }
  e.not = x;
  const L = w(e.operators.AND);
  function V(...b) {
    return b.reduce(L);
  }
  e.and = V;
  const U = w(e.operators.OR);
  function O(...b) {
    return b.reduce(U);
  }
  e.or = O;
  function w(b) {
    return (d, g) => d === t.nil ? g : g === t.nil ? d : (0, t._)`${P(d)} ${b} ${P(g)}`;
  }
  function P(b) {
    return b instanceof t.Name ? b : (0, t._)`(${b})`;
  }
})(fe);
var Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.checkStrictMode = Y.getErrorPath = Y.Type = Y.useFunc = Y.setEvaluated = Y.evaluatedPropsToName = Y.mergeEvaluated = Y.eachItem = Y.unescapeJsonPointer = Y.escapeJsonPointer = Y.escapeFragment = Y.unescapeFragment = Y.schemaRefOrVal = Y.schemaHasRulesButRef = Y.schemaHasRules = Y.checkUnknownRules = Y.alwaysValidSchema = Y.toHash = void 0;
const be = fe, zE = Ds;
function KE(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
Y.toHash = KE;
function WE(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (s0(e, t), !a0(t, e.self.RULES.all));
}
Y.alwaysValidSchema = WE;
function s0(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || l0(e, `unknown keyword: "${s}"`);
}
Y.checkUnknownRules = s0;
function a0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
Y.schemaHasRules = a0;
function YE(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
Y.schemaHasRulesButRef = YE;
function XE({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, be._)`${r}`;
  }
  return (0, be._)`${e}${t}${(0, be.getProperty)(n)}`;
}
Y.schemaRefOrVal = XE;
function JE(e) {
  return o0(decodeURIComponent(e));
}
Y.unescapeFragment = JE;
function QE(e) {
  return encodeURIComponent(Nu(e));
}
Y.escapeFragment = QE;
function Nu(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Y.escapeJsonPointer = Nu;
function o0(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Y.unescapeJsonPointer = o0;
function ZE(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
Y.eachItem = ZE;
function Ah({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, a, o) => {
    const c = a === void 0 ? s : a instanceof be.Name ? (s instanceof be.Name ? e(i, s, a) : t(i, s, a), a) : s instanceof be.Name ? (t(i, a, s), s) : r(s, a);
    return o === be.Name && !(c instanceof be.Name) ? n(i, c) : c;
  };
}
Y.mergeEvaluated = {
  props: Ah({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, be._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, be._)`${r} || {}`).code((0, be._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, be._)`${r} || {}`), Ru(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: c0
  }),
  items: Ah({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, be._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, be._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function c0(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, be._)`{}`);
  return t !== void 0 && Ru(e, r, t), r;
}
Y.evaluatedPropsToName = c0;
function Ru(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, be._)`${t}${(0, be.getProperty)(n)}`, !0));
}
Y.setEvaluated = Ru;
const Ih = {};
function ew(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ih[t.code] || (Ih[t.code] = new zE._Code(t.code))
  });
}
Y.useFunc = ew;
var Hl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Hl || (Y.Type = Hl = {}));
function tw(e, t, r) {
  if (e instanceof be.Name) {
    const n = t === Hl.Num;
    return r ? n ? (0, be._)`"[" + ${e} + "]"` : (0, be._)`"['" + ${e} + "']"` : n ? (0, be._)`"/" + ${e}` : (0, be._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, be.getProperty)(e).toString() : "/" + Nu(e);
}
Y.getErrorPath = tw;
function l0(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Y.checkStrictMode = l0;
var Lt = {};
Object.defineProperty(Lt, "__esModule", { value: !0 });
const at = fe, rw = {
  // validation function arguments
  data: new at.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new at.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new at.Name("instancePath"),
  parentData: new at.Name("parentData"),
  parentDataProperty: new at.Name("parentDataProperty"),
  rootData: new at.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new at.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new at.Name("vErrors"),
  // null or array of validation errors
  errors: new at.Name("errors"),
  // counter of validation errors
  this: new at.Name("this"),
  // "globals"
  self: new at.Name("self"),
  scope: new at.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new at.Name("json"),
  jsonPos: new at.Name("jsonPos"),
  jsonLen: new at.Name("jsonLen"),
  jsonPart: new at.Name("jsonPart")
};
Lt.default = rw;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = fe, r = Y, n = Lt;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, E, N) {
    const { it: D } = v, { gen: j, compositeRule: z, allErrors: Q } = D, se = f(v, m, E);
    N ?? (z || Q) ? c(j, se) : u(D, (0, t._)`[${se}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, E) {
    const { it: N } = v, { gen: D, compositeRule: j, allErrors: z } = N, Q = f(v, m, E);
    c(D, Q), j || z || u(N, n.default.vErrors);
  }
  e.reportExtraError = s;
  function a(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function o({ gen: v, keyword: m, schemaValue: E, data: N, errsCount: D, it: j }) {
    if (D === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", D, n.default.errors, (Q) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${Q}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, j.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (v.assign((0, t._)`${z}.schema`, E), v.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = o;
  function c(v, m) {
    const E = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, m) {
    const { gen: E, validateName: N, schemaEnv: D } = v;
    D.$async ? E.throw((0, t._)`new ${v.ValidationError}(${m})`) : (E.assign((0, t._)`${N}.errors`, m), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, m, E) {
    const { createErrors: N } = v.it;
    return N === !1 ? (0, t._)`{}` : p(v, m, E);
  }
  function p(v, m, E = {}) {
    const { gen: N, it: D } = v, j = [
      h(D, E),
      $(v, E)
    ];
    return y(v, m, j), N.object(...j);
  }
  function h({ errorPath: v }, { instancePath: m }) {
    const E = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function $({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: N }) {
    let D = N ? m : (0, t.str)`${m}/${v}`;
    return E && (D = (0, t.str)`${D}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, D];
  }
  function y(v, { params: m, message: E }, N) {
    const { keyword: D, data: j, schemaValue: z, it: Q } = v, { opts: se, propertyName: W, topSchemaRef: A, schemaPath: H } = Q;
    N.push([l.keyword, D], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), se.messages && N.push([l.message, typeof E == "function" ? E(v) : E]), se.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${A}${H}`], [n.default.data, j]), W && N.push([l.propertyName, W]);
  }
})(Qs);
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.boolOrEmptySchema = Ii.topBoolOrEmptySchema = void 0;
const nw = Qs, iw = fe, sw = Lt, aw = {
  message: "boolean schema is false"
};
function ow(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? u0(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(sw.default.data) : (t.assign((0, iw._)`${n}.errors`, null), t.return(!0));
}
Ii.topBoolOrEmptySchema = ow;
function cw(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), u0(e)) : r.var(t, !0);
}
Ii.boolOrEmptySchema = cw;
function u0(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, nw.reportError)(i, aw, void 0, t);
}
var Be = {}, Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.getRules = Hn.isJSONType = void 0;
const lw = ["string", "number", "integer", "boolean", "null", "object", "array"], uw = new Set(lw);
function fw(e) {
  return typeof e == "string" && uw.has(e);
}
Hn.isJSONType = fw;
function dw() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Hn.getRules = dw;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.shouldUseRule = Rr.shouldUseGroup = Rr.schemaHasRulesForType = void 0;
function hw({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && f0(e, n);
}
Rr.schemaHasRulesForType = hw;
function f0(e, t) {
  return t.rules.some((r) => d0(e, r));
}
Rr.shouldUseGroup = f0;
function d0(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Rr.shouldUseRule = d0;
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.reportTypeError = Be.checkDataTypes = Be.checkDataType = Be.coerceAndCheckDataType = Be.getJSONTypes = Be.getSchemaTypes = Be.DataType = void 0;
const pw = Hn, mw = Rr, yw = Qs, he = fe, h0 = Y;
var bi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(bi || (Be.DataType = bi = {}));
function gw(e) {
  const t = p0(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Be.getSchemaTypes = gw;
function p0(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(pw.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Be.getJSONTypes = p0;
function $w(e, t) {
  const { gen: r, data: n, opts: i } = e, s = vw(t, i.coerceTypes), a = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, mw.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const o = Ou(t, n, i.strictNumbers, bi.Wrong);
    r.if(o, () => {
      s.length ? _w(e, t, s) : Au(e);
    });
  }
  return a;
}
Be.coerceAndCheckDataType = $w;
const m0 = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function vw(e, t) {
  return t ? e.filter((r) => m0.has(r) || t === "array" && r === "array") : [];
}
function _w(e, t, r) {
  const { gen: n, data: i, opts: s } = e, a = n.let("dataType", (0, he._)`typeof ${i}`), o = n.let("coerced", (0, he._)`undefined`);
  s.coerceTypes === "array" && n.if((0, he._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, he._)`${i}[0]`).assign(a, (0, he._)`typeof ${i}`).if(Ou(t, i, s.strictNumbers), () => n.assign(o, i))), n.if((0, he._)`${o} !== undefined`);
  for (const u of r)
    (m0.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), Au(e), n.endIf(), n.if((0, he._)`${o} !== undefined`, () => {
    n.assign(i, o), Ew(e, o);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, he._)`${a} == "number" || ${a} == "boolean"`).assign(o, (0, he._)`"" + ${i}`).elseIf((0, he._)`${i} === null`).assign(o, (0, he._)`""`);
        return;
      case "number":
        n.elseIf((0, he._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(o, (0, he._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, he._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(o, (0, he._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, he._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(o, !1).elseIf((0, he._)`${i} === "true" || ${i} === 1`).assign(o, !0);
        return;
      case "null":
        n.elseIf((0, he._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(o, null);
        return;
      case "array":
        n.elseIf((0, he._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(o, (0, he._)`[${i}]`);
    }
  }
}
function Ew({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, he._)`${t} !== undefined`, () => e.assign((0, he._)`${t}[${r}]`, n));
}
function zl(e, t, r, n = bi.Correct) {
  const i = n === bi.Correct ? he.operators.EQ : he.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, he._)`${t} ${i} null`;
    case "array":
      s = (0, he._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, he._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = a((0, he._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = a();
      break;
    default:
      return (0, he._)`typeof ${t} ${i} ${e}`;
  }
  return n === bi.Correct ? s : (0, he.not)(s);
  function a(o = he.nil) {
    return (0, he.and)((0, he._)`typeof ${t} == "number"`, o, r ? (0, he._)`isFinite(${t})` : he.nil);
  }
}
Be.checkDataType = zl;
function Ou(e, t, r, n) {
  if (e.length === 1)
    return zl(e[0], t, r, n);
  let i;
  const s = (0, h0.toHash)(e);
  if (s.array && s.object) {
    const a = (0, he._)`typeof ${t} != "object"`;
    i = s.null ? a : (0, he._)`!${t} || ${a}`, delete s.null, delete s.array, delete s.object;
  } else
    i = he.nil;
  s.number && delete s.integer;
  for (const a in s)
    i = (0, he.and)(i, zl(a, t, r, n));
  return i;
}
Be.checkDataTypes = Ou;
const ww = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, he._)`{type: ${e}}` : (0, he._)`{type: ${t}}`
};
function Au(e) {
  const t = Sw(e);
  (0, yw.reportError)(t, ww);
}
Be.reportTypeError = Au;
function Sw(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, h0.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.assignDefaults = void 0;
const ei = fe, bw = Y;
function Pw(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      Ch(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => Ch(e, s, i.default));
}
zo.assignDefaults = Pw;
function Ch(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: a } = e;
  if (r === void 0)
    return;
  const o = (0, ei._)`${s}${(0, ei.getProperty)(t)}`;
  if (i) {
    (0, bw.checkStrictMode)(e, `default is ignored for: ${o}`);
    return;
  }
  let c = (0, ei._)`${o} === undefined`;
  a.useDefaults === "empty" && (c = (0, ei._)`${c} || ${o} === null || ${o} === ""`), n.if(c, (0, ei._)`${o} = ${(0, ei.stringify)(r)}`);
}
var mr = {}, ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.validateUnion = ge.validateArray = ge.usePattern = ge.callValidateCode = ge.schemaProperties = ge.allSchemaProperties = ge.noPropertyInData = ge.propertyInData = ge.isOwnProperty = ge.hasPropFunc = ge.reportMissingProp = ge.checkMissingProp = ge.checkReportMissingProp = void 0;
const Re = fe, Iu = Y, Gr = Lt, Tw = Y;
function Nw(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(Du(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Re._)`${t}` }, !0), e.error();
  });
}
ge.checkReportMissingProp = Nw;
function Rw({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Re.or)(...n.map((s) => (0, Re.and)(Du(e, t, s, r.ownProperties), (0, Re._)`${i} = ${s}`)));
}
ge.checkMissingProp = Rw;
function Ow(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ge.reportMissingProp = Ow;
function y0(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Re._)`Object.prototype.hasOwnProperty`
  });
}
ge.hasPropFunc = y0;
function Cu(e, t, r) {
  return (0, Re._)`${y0(e)}.call(${t}, ${r})`;
}
ge.isOwnProperty = Cu;
function Aw(e, t, r, n) {
  const i = (0, Re._)`${t}${(0, Re.getProperty)(r)} !== undefined`;
  return n ? (0, Re._)`${i} && ${Cu(e, t, r)}` : i;
}
ge.propertyInData = Aw;
function Du(e, t, r, n) {
  const i = (0, Re._)`${t}${(0, Re.getProperty)(r)} === undefined`;
  return n ? (0, Re.or)(i, (0, Re.not)(Cu(e, t, r))) : i;
}
ge.noPropertyInData = Du;
function g0(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ge.allSchemaProperties = g0;
function Iw(e, t) {
  return g0(t).filter((r) => !(0, Iu.alwaysValidSchema)(e, t[r]));
}
ge.schemaProperties = Iw;
function Cw({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: a }, o, c, u) {
  const l = u ? (0, Re._)`${e}, ${t}, ${n}${i}` : t, f = [
    [Gr.default.instancePath, (0, Re.strConcat)(Gr.default.instancePath, s)],
    [Gr.default.parentData, a.parentData],
    [Gr.default.parentDataProperty, a.parentDataProperty],
    [Gr.default.rootData, Gr.default.rootData]
  ];
  a.opts.dynamicRef && f.push([Gr.default.dynamicAnchors, Gr.default.dynamicAnchors]);
  const p = (0, Re._)`${l}, ${r.object(...f)}`;
  return c !== Re.nil ? (0, Re._)`${o}.call(${c}, ${p})` : (0, Re._)`${o}(${p})`;
}
ge.callValidateCode = Cw;
const Dw = (0, Re._)`new RegExp`;
function kw({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Re._)`${i.code === "new RegExp" ? Dw : (0, Tw.useFunc)(e, i)}(${r}, ${n})`
  });
}
ge.usePattern = kw;
function Fw(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const o = t.let("valid", !0);
    return a(() => t.assign(o, !1)), o;
  }
  return t.var(s, !0), a(() => t.break()), s;
  function a(o) {
    const c = t.const("len", (0, Re._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: Iu.Type.Num
      }, s), t.if((0, Re.not)(s), o);
    });
  }
}
ge.validateArray = Fw;
function Lw(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Iu.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), o = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, o);
    t.assign(a, (0, Re._)`${a} || ${o}`), e.mergeValidEvaluated(l, o) || t.if((0, Re.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ge.validateUnion = Lw;
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.validateKeywordUsage = mr.validSchemaType = mr.funcKeywordCode = mr.macroKeywordCode = void 0;
const mt = fe, On = Lt, jw = ge, Uw = Qs;
function Mw(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: a } = e, o = t.macro.call(a.self, i, s, a), c = $0(r, n, o);
  a.opts.validateSchema !== !1 && a.self.validateSchema(o, !0);
  const u = r.name("valid");
  e.subschema({
    schema: o,
    schemaPath: mt.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
mr.macroKeywordCode = Mw;
function xw(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: a, $data: o, it: c } = e;
  qw(c, t);
  const u = !o && t.compile ? t.compile.call(c.self, s, a, c) : t.validate, l = $0(n, i, u), f = n.let("valid");
  e.block$data(f, p), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function p() {
    if (t.errors === !1)
      y(), t.modifying && Dh(e), v(() => e.error());
    else {
      const m = t.async ? h() : $();
      t.modifying && Dh(e), v(() => Vw(e, m));
    }
  }
  function h() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, mt._)`await `), (E) => n.assign(f, !1).if((0, mt._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, mt._)`${E}.errors`), () => n.throw(E))), m;
  }
  function $() {
    const m = (0, mt._)`${l}.errors`;
    return n.assign(m, null), y(mt.nil), m;
  }
  function y(m = t.async ? (0, mt._)`await ` : mt.nil) {
    const E = c.opts.passContext ? On.default.this : On.default.self, N = !("compile" in t && !o || t.schema === !1);
    n.assign(f, (0, mt._)`${m}${(0, jw.callValidateCode)(e, l, E, N)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, mt.not)((E = t.valid) !== null && E !== void 0 ? E : f), m);
  }
}
mr.funcKeywordCode = xw;
function Dh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, mt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Vw(e, t) {
  const { gen: r } = e;
  r.if((0, mt._)`Array.isArray(${t})`, () => {
    r.assign(On.default.vErrors, (0, mt._)`${On.default.vErrors} === null ? ${t} : ${On.default.vErrors}.concat(${t})`).assign(On.default.errors, (0, mt._)`${On.default.vErrors}.length`), (0, Uw.extendErrors)(e);
  }, () => e.error());
}
function qw({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function $0(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, mt.stringify)(r) });
}
function Bw(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
mr.validSchemaType = Bw;
function Gw({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((o) => !Object.prototype.hasOwnProperty.call(e, o)))
    throw new Error(`parent schema must have dependencies of ${s}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
mr.validateKeywordUsage = Gw;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.extendSubschemaMode = on.extendSubschemaData = on.getSubschema = void 0;
const hr = fe, v0 = Y;
function Hw(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const o = e.schema[t];
    return r === void 0 ? {
      schema: o,
      schemaPath: (0, hr._)`${e.schemaPath}${(0, hr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: o[r],
      schemaPath: (0, hr._)`${e.schemaPath}${(0, hr.getProperty)(t)}${(0, hr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, v0.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
on.getSubschema = Hw;
function zw(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: o } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, p = o.let("data", (0, hr._)`${t.data}${(0, hr.getProperty)(r)}`, !0);
    c(p), e.errorPath = (0, hr.str)`${u}${(0, v0.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, hr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof hr.Name ? i : o.let("data", i, !0);
    c(u), a !== void 0 && (e.propertyName = a);
  }
  s && (e.dataTypes = s);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
on.extendSubschemaData = zw;
function Kw(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
on.extendSubschemaMode = Kw;
var Ze = {}, Ko = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, i, s;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (i = n; i-- !== 0; )
        if (!e(t[i], r[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (s = Object.keys(t), n = s.length, n !== Object.keys(r).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var a = s[i];
      if (!e(t[a], r[a])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, _0 = { exports: {} }, rn = _0.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  oo(t, n, i, e, "", e);
};
rn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
rn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
rn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
rn.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function oo(e, t, r, n, i, s, a, o, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, a, o, c, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in rn.arrayKeywords)
          for (var p = 0; p < f.length; p++)
            oo(e, t, r, f[p], i + "/" + l + "/" + p, s, i, l, n, p);
      } else if (l in rn.propsKeywords) {
        if (f && typeof f == "object")
          for (var h in f)
            oo(e, t, r, f[h], i + "/" + l + "/" + Ww(h), s, i, l, n, h);
      } else (l in rn.keywords || e.allKeys && !(l in rn.skipKeywords)) && oo(e, t, r, f, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, a, o, c, u);
  }
}
function Ww(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Yw = _0.exports;
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.getSchemaRefs = Ze.resolveUrl = Ze.normalizeId = Ze._getFullPath = Ze.getFullPath = Ze.inlineRef = void 0;
const Xw = Y, Jw = Ko, Qw = Yw, Zw = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function eS(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Kl(e) : t ? E0(e) <= t : !1;
}
Ze.inlineRef = eS;
const tS = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Kl(e) {
  for (const t in e) {
    if (tS.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Kl) || typeof r == "object" && Kl(r))
      return !0;
  }
  return !1;
}
function E0(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Zw.has(r) && (typeof e[r] == "object" && (0, Xw.eachItem)(e[r], (n) => t += E0(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function w0(e, t = "", r) {
  r !== !1 && (t = Pi(t));
  const n = e.parse(t);
  return S0(e, n);
}
Ze.getFullPath = w0;
function S0(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ze._getFullPath = S0;
const rS = /#\/?$/;
function Pi(e) {
  return e ? e.replace(rS, "") : "";
}
Ze.normalizeId = Pi;
function nS(e, t, r) {
  return r = Pi(r), e.resolve(t, r);
}
Ze.resolveUrl = nS;
const iS = /^[a-z_][-a-z0-9._]*$/i;
function sS(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = Pi(e[r] || t), s = { "": i }, a = w0(n, i, !1), o = {}, c = /* @__PURE__ */ new Set();
  return Qw(e, { allKeys: !0 }, (f, p, h, $) => {
    if ($ === void 0)
      return;
    const y = a + p;
    let v = s[$];
    typeof f[r] == "string" && (v = m.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), s[p] = v;
    function m(N) {
      const D = this.opts.uriResolver.resolve;
      if (N = Pi(v ? D(v, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let j = this.refs[N];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? u(f, j.schema, N) : N !== Pi(y) && (N[0] === "#" ? (u(f, o[N], N), o[N] = f) : this.refs[N] = y), N;
    }
    function E(N) {
      if (typeof N == "string") {
        if (!iS.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), o;
  function u(f, p, h) {
    if (p !== void 0 && !Jw(f, p))
      throw l(h);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Ze.getSchemaRefs = sS;
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.getData = rr.KeywordCxt = rr.validateFunctionCode = void 0;
const b0 = Ii, kh = Be, ku = Rr, wo = Be, aS = zo, vs = mr, qc = on, te = fe, ae = Lt, oS = Ze, Or = Y, ss = Qs;
function cS(e) {
  if (N0(e) && (R0(e), T0(e))) {
    fS(e);
    return;
  }
  P0(e, () => (0, b0.topBoolOrEmptySchema)(e));
}
rr.validateFunctionCode = cS;
function P0({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, te._)`${ae.default.data}, ${ae.default.valCxt}`, n.$async, () => {
    e.code((0, te._)`"use strict"; ${Fh(r, i)}`), uS(e, i), e.code(s);
  }) : e.func(t, (0, te._)`${ae.default.data}, ${lS(i)}`, n.$async, () => e.code(Fh(r, i)).code(s));
}
function lS(e) {
  return (0, te._)`{${ae.default.instancePath}="", ${ae.default.parentData}, ${ae.default.parentDataProperty}, ${ae.default.rootData}=${ae.default.data}${e.dynamicRef ? (0, te._)`, ${ae.default.dynamicAnchors}={}` : te.nil}}={}`;
}
function uS(e, t) {
  e.if(ae.default.valCxt, () => {
    e.var(ae.default.instancePath, (0, te._)`${ae.default.valCxt}.${ae.default.instancePath}`), e.var(ae.default.parentData, (0, te._)`${ae.default.valCxt}.${ae.default.parentData}`), e.var(ae.default.parentDataProperty, (0, te._)`${ae.default.valCxt}.${ae.default.parentDataProperty}`), e.var(ae.default.rootData, (0, te._)`${ae.default.valCxt}.${ae.default.rootData}`), t.dynamicRef && e.var(ae.default.dynamicAnchors, (0, te._)`${ae.default.valCxt}.${ae.default.dynamicAnchors}`);
  }, () => {
    e.var(ae.default.instancePath, (0, te._)`""`), e.var(ae.default.parentData, (0, te._)`undefined`), e.var(ae.default.parentDataProperty, (0, te._)`undefined`), e.var(ae.default.rootData, ae.default.data), t.dynamicRef && e.var(ae.default.dynamicAnchors, (0, te._)`{}`);
  });
}
function fS(e) {
  const { schema: t, opts: r, gen: n } = e;
  P0(e, () => {
    r.$comment && t.$comment && A0(e), yS(e), n.let(ae.default.vErrors, null), n.let(ae.default.errors, 0), r.unevaluated && dS(e), O0(e), vS(e);
  });
}
function dS(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, te._)`${r}.evaluated`), t.if((0, te._)`${e.evaluated}.dynamicProps`, () => t.assign((0, te._)`${e.evaluated}.props`, (0, te._)`undefined`)), t.if((0, te._)`${e.evaluated}.dynamicItems`, () => t.assign((0, te._)`${e.evaluated}.items`, (0, te._)`undefined`));
}
function Fh(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, te._)`/*# sourceURL=${r} */` : te.nil;
}
function hS(e, t) {
  if (N0(e) && (R0(e), T0(e))) {
    pS(e, t);
    return;
  }
  (0, b0.boolOrEmptySchema)(e, t);
}
function T0({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function N0(e) {
  return typeof e.schema != "boolean";
}
function pS(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && A0(e), gS(e), $S(e);
  const s = n.const("_errs", ae.default.errors);
  O0(e, s), n.var(t, (0, te._)`${s} === ${ae.default.errors}`);
}
function R0(e) {
  (0, Or.checkUnknownRules)(e), mS(e);
}
function O0(e, t) {
  if (e.opts.jtd)
    return Lh(e, [], !1, t);
  const r = (0, kh.getSchemaTypes)(e.schema), n = (0, kh.coerceAndCheckDataType)(e, r);
  Lh(e, r, !n, t);
}
function mS(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Or.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function yS(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Or.checkStrictMode)(e, "default is ignored in the schema root");
}
function gS(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, oS.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function $S(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function A0({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, te._)`${ae.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const a = (0, te.str)`${n}/$comment`, o = e.scopeValue("root", { ref: t.root });
    e.code((0, te._)`${ae.default.self}.opts.$comment(${s}, ${a}, ${o}.schema)`);
  }
}
function vS(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, te._)`${ae.default.errors} === 0`, () => t.return(ae.default.data), () => t.throw((0, te._)`new ${i}(${ae.default.vErrors})`)) : (t.assign((0, te._)`${n}.errors`, ae.default.vErrors), s.unevaluated && _S(e), t.return((0, te._)`${ae.default.errors} === 0`));
}
function _S({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof te.Name && e.assign((0, te._)`${t}.props`, r), n instanceof te.Name && e.assign((0, te._)`${t}.items`, n);
}
function Lh(e, t, r, n) {
  const { gen: i, schema: s, data: a, allErrors: o, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Or.schemaHasRulesButRef)(s, l))) {
    i.block(() => D0(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || ES(e, t), i.block(() => {
    for (const p of l.rules)
      f(p);
    f(l.post);
  });
  function f(p) {
    (0, ku.shouldUseGroup)(s, p) && (p.type ? (i.if((0, wo.checkDataType)(p.type, a, c.strictNumbers)), jh(e, p), t.length === 1 && t[0] === p.type && r && (i.else(), (0, wo.reportTypeError)(e)), i.endIf()) : jh(e, p), o || i.if((0, te._)`${ae.default.errors} === ${n || 0}`));
  }
}
function jh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, aS.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, ku.shouldUseRule)(n, s) && D0(e, s.keyword, s.definition, t.type);
  });
}
function ES(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (wS(e, t), e.opts.allowUnionTypes || SS(e, t), bS(e, e.dataTypes));
}
function wS(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      I0(e.dataTypes, r) || Fu(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), TS(e, t);
  }
}
function SS(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Fu(e, "use allowUnionTypes to allow union type keyword");
}
function bS(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, ku.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((a) => PS(t, a)) && Fu(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function PS(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function I0(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function TS(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    I0(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Fu(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Or.checkStrictMode)(e, t, e.opts.strictTypes);
}
let C0 = class {
  constructor(t, r, n) {
    if ((0, vs.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Or.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", k0(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, vs.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", ae.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, te.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, te.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, te._)`${r} !== undefined && (${(0, te.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? ss.reportExtraError : ss.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, ss.reportError)(this, this.def.$dataError || ss.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, ss.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = te.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = te.nil, r = te.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: a } = this;
    n.if((0, te.or)((0, te._)`${i} === undefined`, r)), t !== te.nil && n.assign(t, !0), (s.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== te.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, te.or)(a(), o());
    function a() {
      if (n.length) {
        if (!(r instanceof te.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, te._)`${(0, wo.checkDataTypes)(c, r, s.opts.strictNumbers, wo.DataType.Wrong)}`;
      }
      return te.nil;
    }
    function o() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, te._)`!${c}(${r})`;
      }
      return te.nil;
    }
  }
  subschema(t, r) {
    const n = (0, qc.getSubschema)(this.it, t);
    (0, qc.extendSubschemaData)(n, this.it, t), (0, qc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return hS(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Or.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Or.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, te.Name)), !0;
  }
};
rr.KeywordCxt = C0;
function D0(e, t, r, n) {
  const i = new C0(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, vs.funcKeywordCode)(i, r) : "macro" in r ? (0, vs.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, vs.funcKeywordCode)(i, r);
}
const NS = /^\/(?:[^~]|~0|~1)*$/, RS = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function k0(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return ae.default.rootData;
  if (e[0] === "/") {
    if (!NS.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = ae.default.rootData;
  } else {
    const u = RS.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let a = s;
  const o = i.split("/");
  for (const u of o)
    u && (s = (0, te._)`${s}${(0, te.getProperty)((0, Or.unescapeJsonPointer)(u))}`, a = (0, te._)`${a} && ${s}`);
  return a;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
rr.getData = k0;
var Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
let OS = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
Zs.default = OS;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Bc = Ze;
let AS = class extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Bc.resolveUrl)(t, r, n), this.missingSchema = (0, Bc.normalizeId)((0, Bc.getFullPath)(t, this.missingRef));
  }
};
Mi.default = AS;
var gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.resolveSchema = gt.getCompilingSchema = gt.resolveRef = gt.compileSchema = gt.SchemaEnv = void 0;
const Kt = fe, IS = Zs, bn = Lt, er = Ze, Uh = Y, CS = rr;
let Wo = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, er.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
gt.SchemaEnv = Wo;
function Lu(e) {
  const t = F0.call(this, e);
  if (t)
    return t;
  const r = (0, er.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, a = new Kt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let o;
  e.$async && (o = a.scopeValue("Error", {
    ref: IS.default,
    code: (0, Kt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: bn.default.data,
    parentData: bn.default.parentData,
    parentDataProperty: bn.default.parentDataProperty,
    dataNames: [bn.default.data],
    dataPathArr: [Kt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Kt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: o,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Kt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Kt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, CS.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
    const f = a.toString();
    l = `${a.scopeRefs(bn.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const h = new Function(`${bn.default.self}`, `${bn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: h }), h.errors = null, h.schema = e.schema, h.schemaEnv = e, e.$async && (h.$async = !0), this.opts.code.source === !0 && (h.source = { validateName: c, validateCode: f, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: $, items: y } = u;
      h.evaluated = {
        props: $ instanceof Kt.Name ? void 0 : $,
        items: y instanceof Kt.Name ? void 0 : y,
        dynamicProps: $ instanceof Kt.Name,
        dynamicItems: y instanceof Kt.Name
      }, h.source && (h.source.evaluated = (0, Kt.stringify)(h.evaluated));
    }
    return e.validate = h, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
gt.compileSchema = Lu;
function DS(e, t, r) {
  var n;
  r = (0, er.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = LS.call(this, e, r);
  if (s === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: o } = this.opts;
    a && (s = new Wo({ schema: a, schemaId: o, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = kS.call(this, s);
}
gt.resolveRef = DS;
function kS(e) {
  return (0, er.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Lu.call(this, e);
}
function F0(e) {
  for (const t of this._compilations)
    if (FS(t, e))
      return t;
}
gt.getCompilingSchema = F0;
function FS(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function LS(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Yo.call(this, e, t);
}
function Yo(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, er._getFullPath)(this.opts.uriResolver, r);
  let i = (0, er.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Gc.call(this, r, e);
  const s = (0, er.normalizeId)(n), a = this.refs[s] || this.schemas[s];
  if (typeof a == "string") {
    const o = Yo.call(this, e, a);
    return typeof (o == null ? void 0 : o.schema) != "object" ? void 0 : Gc.call(this, r, o);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Lu.call(this, a), s === (0, er.normalizeId)(t)) {
      const { schema: o } = a, { schemaId: c } = this.opts, u = o[c];
      return u && (i = (0, er.resolveUrl)(this.opts.uriResolver, i, u)), new Wo({ schema: o, schemaId: c, root: e, baseId: i });
    }
    return Gc.call(this, r, a);
  }
}
gt.resolveSchema = Yo;
const jS = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Gc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const o of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Uh.unescapeFragment)(o)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !jS.has(o) && u && (t = (0, er.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, Uh.schemaHasRulesButRef)(r, this.RULES)) {
    const o = (0, er.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Yo.call(this, n, o);
  }
  const { schemaId: a } = this.opts;
  if (s = s || new Wo({ schema: r, schemaId: a, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const US = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", MS = "Meta-schema for $data reference (JSON AnySchema extension proposal)", xS = "object", VS = [
  "$data"
], qS = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, BS = !1, GS = {
  $id: US,
  description: MS,
  type: xS,
  required: VS,
  properties: qS,
  additionalProperties: BS
};
var ju = {}, Xo = { exports: {} };
const HS = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), L0 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function j0(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const zS = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Mh(e) {
  return e.length = 0, !0;
}
function KS(e, t, r) {
  if (e.length) {
    const n = j0(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function WS(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, a = !1, o = KS;
  for (let c = 0; c < e.length; c++) {
    const u = e[c];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (s === !0 && (a = !0), !o(i, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (s = !0), n.push(":");
        continue;
      } else if (u === "%") {
        if (!o(i, n, r))
          break;
        o = Mh;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (o === Mh ? r.zone = i.join("") : a ? n.push(i.join("")) : n.push(j0(i))), r.address = n.join(""), r;
}
function U0(e) {
  if (YS(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = WS(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function YS(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function XS(e) {
  let t = e;
  const r = [];
  let n = -1, i = 0;
  for (; i = t.length; ) {
    if (i === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (i === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (i === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function JS(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function QS(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!L0(r)) {
      const n = U0(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var M0 = {
  nonSimpleDomain: zS,
  recomposeAuthority: QS,
  normalizeComponentEncoding: JS,
  removeDotSegments: XS,
  isIPv4: L0,
  isUUID: HS,
  normalizeIPv6: U0
};
const { isUUID: ZS } = M0, eb = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function x0(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function V0(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function q0(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function tb(e) {
  return e.secure = x0(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function rb(e) {
  if ((e.port === (x0(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function nb(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(eb);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const i = `${n}:${t.nid || e.nid}`, s = Uu(i);
    e.path = void 0, s && (e = s.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function ib(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), i = `${r}:${t.nid || n}`, s = Uu(i);
  s && (e = s.serialize(e, t));
  const a = e, o = e.nss;
  return a.path = `${n || t.nid}:${o}`, t.skipEscape = !0, a;
}
function sb(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !ZS(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function ab(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const B0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: V0,
    serialize: q0
  }
), ob = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: B0.domainHost,
    parse: V0,
    serialize: q0
  }
), co = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: tb,
    serialize: rb
  }
), cb = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: co.domainHost,
    parse: co.parse,
    serialize: co.serialize
  }
), lb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: nb,
    serialize: ib,
    skipNormalize: !0
  }
), ub = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: sb,
    serialize: ab,
    skipNormalize: !0
  }
), So = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: B0,
    https: ob,
    ws: co,
    wss: cb,
    urn: lb,
    "urn:uuid": ub
  }
);
Object.setPrototypeOf(So, null);
function Uu(e) {
  return e && (So[
    /** @type {SchemeName} */
    e
  ] || So[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var fb = {
  SCHEMES: So,
  getSchemeHandler: Uu
};
const { normalizeIPv6: db, removeDotSegments: ps, recomposeAuthority: hb, normalizeComponentEncoding: Pa, isIPv4: pb, nonSimpleDomain: mb } = M0, { SCHEMES: yb, getSchemeHandler: G0 } = fb;
function gb(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  yr(Dr(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Dr(yr(e, t), t)), e;
}
function $b(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, i = H0(Dr(e, n), Dr(t, n), n, !0);
  return n.skipEscape = !0, yr(i, n);
}
function H0(e, t, r, n) {
  const i = {};
  return n || (e = Dr(yr(e, r), r), t = Dr(yr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ps(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ps(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = ps(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = ps(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function vb(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = yr(Pa(Dr(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = yr(Pa(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = yr(Pa(Dr(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = yr(Pa(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function yr(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), i = [], s = G0(n.scheme || r.scheme);
  s && s.serialize && s.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && i.push(r.scheme, ":");
  const a = hb(r);
  if (a !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(a), r.path && r.path[0] !== "/" && i.push("/")), r.path !== void 0) {
    let o = r.path;
    !n.absolutePath && (!s || !s.absolutePath) && (o = ps(o)), a === void 0 && o[0] === "/" && o[1] === "/" && (o = "/%2F" + o.slice(2)), i.push(o);
  }
  return r.query !== void 0 && i.push("?", r.query), r.fragment !== void 0 && i.push("#", r.fragment), i.join("");
}
const _b = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Dr(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let i = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const s = e.match(_b);
  if (s) {
    if (n.scheme = s[1], n.userinfo = s[3], n.host = s[4], n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = s[7], n.fragment = s[8], isNaN(n.port) && (n.port = s[5]), n.host)
      if (pb(n.host) === !1) {
        const c = db(n.host);
        n.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const a = G0(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!a || !a.unicodeSupport) && n.host && (r.domainHost || a && a.domainHost) && i === !1 && mb(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (o) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + o;
      }
    (!a || a && !a.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), a && a.parse && a.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Mu = {
  SCHEMES: yb,
  normalize: gb,
  resolve: $b,
  resolveComponent: H0,
  equal: vb,
  serialize: yr,
  parse: Dr
};
Xo.exports = Mu;
Xo.exports.default = Mu;
Xo.exports.fastUri = Mu;
var z0 = Xo.exports;
Object.defineProperty(ju, "__esModule", { value: !0 });
const K0 = z0;
K0.code = 'require("ajv/dist/runtime/uri").default';
ju.default = K0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = fe;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Zs, i = Mi, s = Hn, a = gt, o = fe, c = Ze, u = Be, l = Y, f = GS, p = ju, h = (O, w) => new RegExp(O, w);
  h.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function N(O) {
    var w, P, b, d, g, R, q, B, ee, X, ce, S, _, M, k, ye, Ee, we, Ae, Ie, Ve, Se, qe, Gt, jt;
    const Ye = O.strict, dt = (w = O.code) === null || w === void 0 ? void 0 : w.optimize, Er = dt === !0 || dt === void 0 ? 1 : dt || 0, Lr = (b = (P = O.code) === null || P === void 0 ? void 0 : P.regExp) !== null && b !== void 0 ? b : h, Tt = (d = O.uriResolver) !== null && d !== void 0 ? d : p.default;
    return {
      strictSchema: (R = (g = O.strictSchema) !== null && g !== void 0 ? g : Ye) !== null && R !== void 0 ? R : !0,
      strictNumbers: (B = (q = O.strictNumbers) !== null && q !== void 0 ? q : Ye) !== null && B !== void 0 ? B : !0,
      strictTypes: (X = (ee = O.strictTypes) !== null && ee !== void 0 ? ee : Ye) !== null && X !== void 0 ? X : "log",
      strictTuples: (S = (ce = O.strictTuples) !== null && ce !== void 0 ? ce : Ye) !== null && S !== void 0 ? S : "log",
      strictRequired: (M = (_ = O.strictRequired) !== null && _ !== void 0 ? _ : Ye) !== null && M !== void 0 ? M : !1,
      code: O.code ? { ...O.code, optimize: Er, regExp: Lr } : { optimize: Er, regExp: Lr },
      loopRequired: (k = O.loopRequired) !== null && k !== void 0 ? k : E,
      loopEnum: (ye = O.loopEnum) !== null && ye !== void 0 ? ye : E,
      meta: (Ee = O.meta) !== null && Ee !== void 0 ? Ee : !0,
      messages: (we = O.messages) !== null && we !== void 0 ? we : !0,
      inlineRefs: (Ae = O.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (Ie = O.schemaId) !== null && Ie !== void 0 ? Ie : "$id",
      addUsedSchema: (Ve = O.addUsedSchema) !== null && Ve !== void 0 ? Ve : !0,
      validateSchema: (Se = O.validateSchema) !== null && Se !== void 0 ? Se : !0,
      validateFormats: (qe = O.validateFormats) !== null && qe !== void 0 ? qe : !0,
      unicodeRegExp: (Gt = O.unicodeRegExp) !== null && Gt !== void 0 ? Gt : !0,
      int32range: (jt = O.int32range) !== null && jt !== void 0 ? jt : !0,
      uriResolver: Tt
    };
  }
  class D {
    constructor(w = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), w = this.opts = { ...w, ...N(w) };
      const { es5: P, lines: b } = this.opts.code;
      this.scope = new o.ValueScope({ scope: {}, prefixes: y, es5: P, lines: b }), this.logger = K(w.logger);
      const d = w.validateFormats;
      w.validateFormats = !1, this.RULES = (0, s.getRules)(), j.call(this, v, w, "NOT SUPPORTED"), j.call(this, m, w, "DEPRECATED", "warn"), this._metaOpts = A.call(this), w.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), w.keywords && W.call(this, w.keywords), typeof w.meta == "object" && this.addMetaSchema(w.meta), Q.call(this), w.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: w, meta: P, schemaId: b } = this.opts;
      let d = f;
      b === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), P && w && this.addMetaSchema(d, d[b], !1);
    }
    defaultMeta() {
      const { meta: w, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof w == "object" ? w[P] || w : void 0;
    }
    validate(w, P) {
      let b;
      if (typeof w == "string") {
        if (b = this.getSchema(w), !b)
          throw new Error(`no schema with key or ref "${w}"`);
      } else
        b = this.compile(w);
      const d = b(P);
      return "$async" in b || (this.errors = b.errors), d;
    }
    compile(w, P) {
      const b = this._addSchema(w, P);
      return b.validate || this._compileSchemaEnv(b);
    }
    compileAsync(w, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: b } = this.opts;
      return d.call(this, w, P);
      async function d(X, ce) {
        await g.call(this, X.$schema);
        const S = this._addSchema(X, ce);
        return S.validate || R.call(this, S);
      }
      async function g(X) {
        X && !this.getSchema(X) && await d.call(this, { $ref: X }, !0);
      }
      async function R(X) {
        try {
          return this._compileSchemaEnv(X);
        } catch (ce) {
          if (!(ce instanceof i.default))
            throw ce;
          return q.call(this, ce), await B.call(this, ce.missingSchema), R.call(this, X);
        }
      }
      function q({ missingSchema: X, missingRef: ce }) {
        if (this.refs[X])
          throw new Error(`AnySchema ${X} is loaded but ${ce} cannot be resolved`);
      }
      async function B(X) {
        const ce = await ee.call(this, X);
        this.refs[X] || await g.call(this, ce.$schema), this.refs[X] || this.addSchema(ce, X, P);
      }
      async function ee(X) {
        const ce = this._loading[X];
        if (ce)
          return ce;
        try {
          return await (this._loading[X] = b(X));
        } finally {
          delete this._loading[X];
        }
      }
    }
    // Adds schema to the instance
    addSchema(w, P, b, d = this.opts.validateSchema) {
      if (Array.isArray(w)) {
        for (const R of w)
          this.addSchema(R, void 0, b, d);
        return this;
      }
      let g;
      if (typeof w == "object") {
        const { schemaId: R } = this.opts;
        if (g = w[R], g !== void 0 && typeof g != "string")
          throw new Error(`schema ${R} must be string`);
      }
      return P = (0, c.normalizeId)(P || g), this._checkUnique(P), this.schemas[P] = this._addSchema(w, b, P, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(w, P, b = this.opts.validateSchema) {
      return this.addSchema(w, P, !0, b), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(w, P) {
      if (typeof w == "boolean")
        return !0;
      let b;
      if (b = w.$schema, b !== void 0 && typeof b != "string")
        throw new Error("$schema must be a string");
      if (b = b || this.opts.defaultMeta || this.defaultMeta(), !b)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(b, w);
      if (!d && P) {
        const g = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(g);
        else
          throw new Error(g);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(w) {
      let P;
      for (; typeof (P = z.call(this, w)) == "string"; )
        w = P;
      if (P === void 0) {
        const { schemaId: b } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: b });
        if (P = a.resolveSchema.call(this, d, w), !P)
          return;
        this.refs[w] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(w) {
      if (w instanceof RegExp)
        return this._removeAllSchemas(this.schemas, w), this._removeAllSchemas(this.refs, w), this;
      switch (typeof w) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = z.call(this, w);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[w], delete this.refs[w], this;
        }
        case "object": {
          const P = w;
          this._cache.delete(P);
          let b = w[this.opts.schemaId];
          return b && (b = (0, c.normalizeId)(b), delete this.schemas[b], delete this.refs[b]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(w) {
      for (const P of w)
        this.addKeyword(P);
      return this;
    }
    addKeyword(w, P) {
      let b;
      if (typeof w == "string")
        b = w, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = b);
      else if (typeof w == "object" && P === void 0) {
        if (P = w, b = P.keyword, Array.isArray(b) && !b.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (C.call(this, b, P), !P)
        return (0, l.eachItem)(b, (g) => I.call(this, g)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, u.getJSONTypes)(P.type),
        schemaType: (0, u.getJSONTypes)(P.schemaType)
      };
      return (0, l.eachItem)(b, d.type.length === 0 ? (g) => I.call(this, g, d) : (g) => d.type.forEach((R) => I.call(this, g, d, R))), this;
    }
    getKeyword(w) {
      const P = this.RULES.all[w];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(w) {
      const { RULES: P } = this;
      delete P.keywords[w], delete P.all[w];
      for (const b of P.rules) {
        const d = b.rules.findIndex((g) => g.keyword === w);
        d >= 0 && b.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(w, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[w] = P, this;
    }
    errorsText(w = this.errors, { separator: P = ", ", dataVar: b = "data" } = {}) {
      return !w || w.length === 0 ? "No errors" : w.map((d) => `${b}${d.instancePath} ${d.message}`).reduce((d, g) => d + P + g);
    }
    $dataMetaSchema(w, P) {
      const b = this.RULES.all;
      w = JSON.parse(JSON.stringify(w));
      for (const d of P) {
        const g = d.split("/").slice(1);
        let R = w;
        for (const q of g)
          R = R[q];
        for (const q in b) {
          const B = b[q];
          if (typeof B != "object")
            continue;
          const { $data: ee } = B.definition, X = R[q];
          ee && X && (R[q] = U(X));
        }
      }
      return w;
    }
    _removeAllSchemas(w, P) {
      for (const b in w) {
        const d = w[b];
        (!P || P.test(b)) && (typeof d == "string" ? delete w[b] : d && !d.meta && (this._cache.delete(d.schema), delete w[b]));
      }
    }
    _addSchema(w, P, b, d = this.opts.validateSchema, g = this.opts.addUsedSchema) {
      let R;
      const { schemaId: q } = this.opts;
      if (typeof w == "object")
        R = w[q];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof w != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let B = this._cache.get(w);
      if (B !== void 0)
        return B;
      b = (0, c.normalizeId)(R || b);
      const ee = c.getSchemaRefs.call(this, w, b);
      return B = new a.SchemaEnv({ schema: w, schemaId: q, meta: P, baseId: b, localRefs: ee }), this._cache.set(B.schema, B), g && !b.startsWith("#") && (b && this._checkUnique(b), this.refs[b] = B), d && this.validateSchema(w, !0), B;
    }
    _checkUnique(w) {
      if (this.schemas[w] || this.refs[w])
        throw new Error(`schema with key or id "${w}" already exists`);
    }
    _compileSchemaEnv(w) {
      if (w.meta ? this._compileMetaSchema(w) : a.compileSchema.call(this, w), !w.validate)
        throw new Error("ajv implementation error");
      return w.validate;
    }
    _compileMetaSchema(w) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, w);
      } finally {
        this.opts = P;
      }
    }
  }
  D.ValidationError = n.default, D.MissingRefError = i.default, e.default = D;
  function j(O, w, P, b = "error") {
    for (const d in O) {
      const g = d;
      g in w && this.logger[b](`${P}: option ${d}. ${O[g]}`);
    }
  }
  function z(O) {
    return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
  }
  function Q() {
    const O = this.opts.schemas;
    if (O)
      if (Array.isArray(O))
        this.addSchema(O);
      else
        for (const w in O)
          this.addSchema(O[w], w);
  }
  function se() {
    for (const O in this.opts.formats) {
      const w = this.opts.formats[O];
      w && this.addFormat(O, w);
    }
  }
  function W(O) {
    if (Array.isArray(O)) {
      this.addVocabulary(O);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const w in O) {
      const P = O[w];
      P.keyword || (P.keyword = w), this.addKeyword(P);
    }
  }
  function A() {
    const O = { ...this.opts };
    for (const w of $)
      delete O[w];
    return O;
  }
  const H = { log() {
  }, warn() {
  }, error() {
  } };
  function K(O) {
    if (O === !1)
      return H;
    if (O === void 0)
      return console;
    if (O.log && O.warn && O.error)
      return O;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function C(O, w) {
    const { RULES: P } = this;
    if ((0, l.eachItem)(O, (b) => {
      if (P.keywords[b])
        throw new Error(`Keyword ${b} is already defined`);
      if (!ne.test(b))
        throw new Error(`Keyword ${b} has invalid name`);
    }), !!w && w.$data && !("code" in w || "validate" in w))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function I(O, w, P) {
    var b;
    const d = w == null ? void 0 : w.post;
    if (P && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: g } = this;
    let R = d ? g.post : g.rules.find(({ type: B }) => B === P);
    if (R || (R = { type: P, rules: [] }, g.rules.push(R)), g.keywords[O] = !0, !w)
      return;
    const q = {
      keyword: O,
      definition: {
        ...w,
        type: (0, u.getJSONTypes)(w.type),
        schemaType: (0, u.getJSONTypes)(w.schemaType)
      }
    };
    w.before ? x.call(this, R, q, w.before) : R.rules.push(q), g.all[O] = q, (b = w.implements) === null || b === void 0 || b.forEach((B) => this.addKeyword(B));
  }
  function x(O, w, P) {
    const b = O.rules.findIndex((d) => d.keyword === P);
    b >= 0 ? O.rules.splice(b, 0, w) : (O.rules.push(w), this.logger.warn(`rule ${P} is not defined`));
  }
  function L(O) {
    let { metaSchema: w } = O;
    w !== void 0 && (O.$data && this.opts.$data && (w = U(w)), O.validateSchema = this.compile(w, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function U(O) {
    return { anyOf: [O, V] };
  }
})(i0);
var xu = {}, Vu = {}, qu = {};
Object.defineProperty(qu, "__esModule", { value: !0 });
const Eb = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
qu.default = Eb;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.callRef = kr.getValidate = void 0;
const wb = Mi, xh = ge, Ot = fe, ti = Lt, Vh = gt, Ta = Y, Sb = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: a, opts: o, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return f();
    const l = Vh.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new wb.default(n.opts.uriResolver, i, r);
    if (l instanceof Vh.SchemaEnv)
      return p(l);
    return h(l);
    function f() {
      if (s === u)
        return lo(e, a, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return lo(e, (0, Ot._)`${$}.validate`, u, u.$async);
    }
    function p($) {
      const y = W0(e, $);
      lo(e, y, $, $.$async);
    }
    function h($) {
      const y = t.scopeValue("schema", o.code.source === !0 ? { ref: $, code: (0, Ot.stringify)($) } : { ref: $ }), v = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: Ot.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function W0(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ot._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
kr.getValidate = W0;
function lo(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: a, schemaEnv: o, opts: c } = s, u = c.passContext ? ti.default.this : Ot.nil;
  n ? l() : f();
  function l() {
    if (!o.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, Ot._)`await ${(0, xh.callValidateCode)(e, t, u)}`), h(t), a || i.assign($, !0);
    }, (y) => {
      i.if((0, Ot._)`!(${y} instanceof ${s.ValidationError})`, () => i.throw(y)), p(y), a || i.assign($, !1);
    }), e.ok($);
  }
  function f() {
    e.result((0, xh.callValidateCode)(e, t, u), () => h(t), () => p(t));
  }
  function p($) {
    const y = (0, Ot._)`${$}.errors`;
    i.assign(ti.default.vErrors, (0, Ot._)`${ti.default.vErrors} === null ? ${y} : ${ti.default.vErrors}.concat(${y})`), i.assign(ti.default.errors, (0, Ot._)`${ti.default.vErrors}.length`);
  }
  function h($) {
    var y;
    if (!s.opts.unevaluated)
      return;
    const v = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = Ta.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, Ot._)`${$}.evaluated.props`);
        s.props = Ta.mergeEvaluated.props(i, m, s.props, Ot.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = Ta.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, Ot._)`${$}.evaluated.items`);
        s.items = Ta.mergeEvaluated.items(i, m, s.items, Ot.Name);
      }
  }
}
kr.callRef = lo;
kr.default = Sb;
Object.defineProperty(Vu, "__esModule", { value: !0 });
const bb = qu, Pb = kr, Tb = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  bb.default,
  Pb.default
];
Vu.default = Tb;
var Bu = {}, Gu = {};
Object.defineProperty(Gu, "__esModule", { value: !0 });
const bo = fe, Hr = bo.operators, Po = {
  maximum: { okStr: "<=", ok: Hr.LTE, fail: Hr.GT },
  minimum: { okStr: ">=", ok: Hr.GTE, fail: Hr.LT },
  exclusiveMaximum: { okStr: "<", ok: Hr.LT, fail: Hr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Hr.GT, fail: Hr.LTE }
}, Nb = {
  message: ({ keyword: e, schemaCode: t }) => (0, bo.str)`must be ${Po[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, bo._)`{comparison: ${Po[e].okStr}, limit: ${t}}`
}, Rb = {
  keyword: Object.keys(Po),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Nb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, bo._)`${r} ${Po[t].fail} ${n} || isNaN(${r})`);
  }
};
Gu.default = Rb;
var Hu = {};
Object.defineProperty(Hu, "__esModule", { value: !0 });
const _s = fe, Ob = {
  message: ({ schemaCode: e }) => (0, _s.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, _s._)`{multipleOf: ${e}}`
}, Ab = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Ob,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, a = t.let("res"), o = s ? (0, _s._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}` : (0, _s._)`${a} !== parseInt(${a})`;
    e.fail$data((0, _s._)`(${n} === 0 || (${a} = ${r}/${n}, ${o}))`);
  }
};
Hu.default = Ab;
var zu = {}, Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
function Y0(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Ku.default = Y0;
Y0.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(zu, "__esModule", { value: !0 });
const An = fe, Ib = Y, Cb = Ku, Db = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, An.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, An._)`{limit: ${e}}`
}, kb = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Db,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? An.operators.GT : An.operators.LT, a = i.opts.unicode === !1 ? (0, An._)`${r}.length` : (0, An._)`${(0, Ib.useFunc)(e.gen, Cb.default)}(${r})`;
    e.fail$data((0, An._)`${a} ${s} ${n}`);
  }
};
zu.default = kb;
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
const Fb = ge, Lb = Y, gi = fe, jb = {
  message: ({ schemaCode: e }) => (0, gi.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, gi._)`{pattern: ${e}}`
}, Ub = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: jb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = a.opts.code, u = c.code === "new RegExp" ? (0, gi._)`new RegExp` : (0, Lb.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, gi._)`${u}(${s}, ${o}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, gi._)`!${l}`);
    } else {
      const c = (0, Fb.usePattern)(e, i);
      e.fail$data((0, gi._)`!${c}.test(${r})`);
    }
  }
};
Wu.default = Ub;
var Yu = {};
Object.defineProperty(Yu, "__esModule", { value: !0 });
const Es = fe, Mb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Es.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Es._)`{limit: ${e}}`
}, xb = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Mb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? Es.operators.GT : Es.operators.LT;
    e.fail$data((0, Es._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Yu.default = xb;
var Xu = {};
Object.defineProperty(Xu, "__esModule", { value: !0 });
const as = ge, ws = fe, Vb = Y, qb = {
  message: ({ params: { missingProperty: e } }) => (0, ws.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, ws._)`{missingProperty: ${e}}`
}, Bb = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: qb,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: a } = e, { opts: o } = a;
    if (!s && r.length === 0)
      return;
    const c = r.length >= o.loopRequired;
    if (a.allErrors ? u() : l(), o.strictRequired) {
      const h = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const y of r)
        if ((h == null ? void 0 : h[y]) === void 0 && !$.has(y)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${v}" (strictRequired)`;
          (0, Vb.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(ws.nil, f);
      else
        for (const h of r)
          (0, as.checkReportMissingProp)(e, h);
    }
    function l() {
      const h = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => p(h, $)), e.ok($);
      } else
        t.if((0, as.checkMissingProp)(e, r, h)), (0, as.reportMissingProp)(e, h), t.else();
    }
    function f() {
      t.forOf("prop", n, (h) => {
        e.setParams({ missingProperty: h }), t.if((0, as.noPropertyInData)(t, i, h, o.ownProperties), () => e.error());
      });
    }
    function p(h, $) {
      e.setParams({ missingProperty: h }), t.forOf(h, n, () => {
        t.assign($, (0, as.propertyInData)(t, i, h, o.ownProperties)), t.if((0, ws.not)($), () => {
          e.error(), t.break();
        });
      }, ws.nil);
    }
  }
};
Xu.default = Bb;
var Ju = {};
Object.defineProperty(Ju, "__esModule", { value: !0 });
const Ss = fe, Gb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Ss.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Ss._)`{limit: ${e}}`
}, Hb = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Gb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? Ss.operators.GT : Ss.operators.LT;
    e.fail$data((0, Ss._)`${r}.length ${i} ${n}`);
  }
};
Ju.default = Hb;
var Qu = {}, ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const X0 = Ko;
X0.code = 'require("ajv/dist/runtime/equal").default';
ea.default = X0;
Object.defineProperty(Qu, "__esModule", { value: !0 });
const Hc = Be, Je = fe, zb = Y, Kb = ea, Wb = {
  message: ({ params: { i: e, j: t } }) => (0, Je.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Je._)`{i: ${e}, j: ${t}}`
}, Yb = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Wb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: a, it: o } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, Hc.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, Je._)`${a} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, Je._)`${r}.length`), y = t.let("j");
      e.setParams({ i: $, j: y }), t.assign(c, !0), t.if((0, Je._)`${$} > 1`, () => (f() ? p : h)($, y));
    }
    function f() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function p($, y) {
      const v = t.name("item"), m = (0, Hc.checkDataTypes)(u, v, o.opts.strictNumbers, Hc.DataType.Wrong), E = t.const("indices", (0, Je._)`{}`);
      t.for((0, Je._)`;${$}--;`, () => {
        t.let(v, (0, Je._)`${r}[${$}]`), t.if(m, (0, Je._)`continue`), u.length > 1 && t.if((0, Je._)`typeof ${v} == "string"`, (0, Je._)`${v} += "_"`), t.if((0, Je._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(y, (0, Je._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Je._)`${E}[${v}] = ${$}`);
      });
    }
    function h($, y) {
      const v = (0, zb.useFunc)(t, Kb.default), m = t.name("outer");
      t.label(m).for((0, Je._)`;${$}--;`, () => t.for((0, Je._)`${y} = ${$}; ${y}--;`, () => t.if((0, Je._)`${v}(${r}[${$}], ${r}[${y}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Qu.default = Yb;
var Zu = {};
Object.defineProperty(Zu, "__esModule", { value: !0 });
const Wl = fe, Xb = Y, Jb = ea, Qb = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Wl._)`{allowedValue: ${e}}`
}, Zb = {
  keyword: "const",
  $data: !0,
  error: Qb,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Wl._)`!${(0, Xb.useFunc)(t, Jb.default)}(${r}, ${i})`) : e.fail((0, Wl._)`${s} !== ${r}`);
  }
};
Zu.default = Zb;
var ef = {};
Object.defineProperty(ef, "__esModule", { value: !0 });
const ms = fe, eP = Y, tP = ea, rP = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, ms._)`{allowedValues: ${e}}`
}, nP = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: rP,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const o = i.length >= a.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, eP.useFunc)(t, tP.default));
    let l;
    if (o || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const h = t.const("vSchema", s);
      l = (0, ms.or)(...i.map(($, y) => p(h, y)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", s, (h) => t.if((0, ms._)`${u()}(${r}, ${h})`, () => t.assign(l, !0).break()));
    }
    function p(h, $) {
      const y = i[$];
      return typeof y == "object" && y !== null ? (0, ms._)`${u()}(${r}, ${h}[${$}])` : (0, ms._)`${r} === ${y}`;
    }
  }
};
ef.default = nP;
Object.defineProperty(Bu, "__esModule", { value: !0 });
const iP = Gu, sP = Hu, aP = zu, oP = Wu, cP = Yu, lP = Xu, uP = Ju, fP = Qu, dP = Zu, hP = ef, pP = [
  // number
  iP.default,
  sP.default,
  // string
  aP.default,
  oP.default,
  // object
  cP.default,
  lP.default,
  // array
  uP.default,
  fP.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  dP.default,
  hP.default
];
Bu.default = pP;
var tf = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.validateAdditionalItems = void 0;
const In = fe, Yl = Y, mP = {
  message: ({ params: { len: e } }) => (0, In.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, In._)`{limit: ${e}}`
}, yP = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: mP,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Yl.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    J0(e, n);
  }
};
function J0(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: a } = e;
  a.items = !0;
  const o = r.const("len", (0, In._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, In._)`${o} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Yl.alwaysValidSchema)(a, n)) {
    const u = r.var("valid", (0, In._)`${o} <= ${t.length}`);
    r.if((0, In.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, o, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Yl.Type.Num }, u), a.allErrors || r.if((0, In.not)(u), () => r.break());
    });
  }
}
xi.validateAdditionalItems = J0;
xi.default = yP;
var rf = {}, Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.validateTuple = void 0;
const qh = fe, uo = Y, gP = ge, $P = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Q0(e, "additionalItems", t);
    r.items = !0, !(0, uo.alwaysValidSchema)(r, t) && e.ok((0, gP.validateArray)(e));
  }
};
function Q0(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: a, it: o } = e;
  l(i), o.opts.unevaluated && r.length && o.items !== !0 && (o.items = uo.mergeEvaluated.items(n, r.length, o.items));
  const c = n.name("valid"), u = n.const("len", (0, qh._)`${s}.length`);
  r.forEach((f, p) => {
    (0, uo.alwaysValidSchema)(o, f) || (n.if((0, qh._)`${u} > ${p}`, () => e.subschema({
      keyword: a,
      schemaProp: p,
      dataProp: p
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: p, errSchemaPath: h } = o, $ = r.length, y = $ === f.minItems && ($ === f.maxItems || f[t] === !1);
    if (p.strictTuples && !y) {
      const v = `"${a}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${h}"`;
      (0, uo.checkStrictMode)(o, v, p.strictTuples);
    }
  }
}
Vi.validateTuple = Q0;
Vi.default = $P;
Object.defineProperty(rf, "__esModule", { value: !0 });
const vP = Vi, _P = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, vP.validateTuple)(e, "items")
};
rf.default = _P;
var nf = {};
Object.defineProperty(nf, "__esModule", { value: !0 });
const Bh = fe, EP = Y, wP = ge, SP = xi, bP = {
  message: ({ params: { len: e } }) => (0, Bh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Bh._)`{limit: ${e}}`
}, PP = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: bP,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, EP.alwaysValidSchema)(n, t) && (i ? (0, SP.validateAdditionalItems)(e, i) : e.ok((0, wP.validateArray)(e)));
  }
};
nf.default = PP;
var sf = {};
Object.defineProperty(sf, "__esModule", { value: !0 });
const qt = fe, Na = Y, TP = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qt.str)`must contain at least ${e} valid item(s)` : (0, qt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qt._)`{minContains: ${e}}` : (0, qt._)`{minContains: ${e}, maxContains: ${t}}`
}, NP = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: TP,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let a, o;
    const { minContains: c, maxContains: u } = n;
    s.opts.next ? (a = c === void 0 ? 1 : c, o = u) : a = 1;
    const l = t.const("len", (0, qt._)`${i}.length`);
    if (e.setParams({ min: a, max: o }), o === void 0 && a === 0) {
      (0, Na.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (o !== void 0 && a > o) {
      (0, Na.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Na.alwaysValidSchema)(s, r)) {
      let y = (0, qt._)`${l} >= ${a}`;
      o !== void 0 && (y = (0, qt._)`${y} && ${l} <= ${o}`), e.pass(y);
      return;
    }
    s.items = !0;
    const f = t.name("valid");
    o === void 0 && a === 1 ? h(f, () => t.if(f, () => t.break())) : a === 0 ? (t.let(f, !0), o !== void 0 && t.if((0, qt._)`${i}.length > 0`, p)) : (t.let(f, !1), p()), e.result(f, () => e.reset());
    function p() {
      const y = t.name("_valid"), v = t.let("count", 0);
      h(y, () => t.if(y, () => $(v)));
    }
    function h(y, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Na.Type.Num,
          compositeRule: !0
        }, y), v();
      });
    }
    function $(y) {
      t.code((0, qt._)`${y}++`), o === void 0 ? t.if((0, qt._)`${y} >= ${a}`, () => t.assign(f, !0).break()) : (t.if((0, qt._)`${y} > ${o}`, () => t.assign(f, !1).break()), a === 1 ? t.assign(f, !0) : t.if((0, qt._)`${y} >= ${a}`, () => t.assign(f, !0)));
    }
  }
};
sf.default = NP;
var Jo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = fe, r = Y, n = ge;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = s(c);
      a(c, u), o(c, l);
    }
  };
  function s({ schema: c }) {
    const u = {}, l = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const p = Array.isArray(c[f]) ? u : l;
      p[f] = c[f];
    }
    return [u, l];
  }
  function a(c, u = c.schema) {
    const { gen: l, data: f, it: p } = c;
    if (Object.keys(u).length === 0)
      return;
    const h = l.let("missing");
    for (const $ in u) {
      const y = u[$];
      if (y.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, $, p.opts.ownProperties);
      c.setParams({
        property: $,
        depsCount: y.length,
        deps: y.join(", ")
      }), p.allErrors ? l.if(v, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, y, h)})`), (0, n.reportMissingProp)(c, h), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function o(c, u = c.schema) {
    const { gen: l, data: f, keyword: p, it: h } = c, $ = l.name("valid");
    for (const y in u)
      (0, r.alwaysValidSchema)(h, u[y]) || (l.if(
        (0, n.propertyInData)(l, f, y, h.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: p, schemaProp: y }, $);
          c.mergeValidEvaluated(v, $);
        },
        () => l.var($, !0)
        // TODO var
      ), c.ok($));
  }
  e.validateSchemaDeps = o, e.default = i;
})(Jo);
var af = {};
Object.defineProperty(af, "__esModule", { value: !0 });
const Z0 = fe, RP = Y, OP = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Z0._)`{propertyName: ${e.propertyName}}`
}, AP = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: OP,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, RP.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, s), t.if((0, Z0.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
af.default = AP;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Ra = ge, Jt = fe, IP = Lt, Oa = Y, CP = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Jt._)`{additionalProperty: ${e.additionalProperty}}`
}, DP = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: CP,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, Oa.alwaysValidSchema)(a, r))
      return;
    const u = (0, Ra.allSchemaProperties)(n.properties), l = (0, Ra.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Jt._)`${s} === ${IP.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? $(v) : t.if(p(v), () => $(v));
      });
    }
    function p(v) {
      let m;
      if (u.length > 8) {
        const E = (0, Oa.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Ra.isOwnProperty)(t, E, v);
      } else u.length ? m = (0, Jt.or)(...u.map((E) => (0, Jt._)`${v} === ${E}`)) : m = Jt.nil;
      return l.length && (m = (0, Jt.or)(m, ...l.map((E) => (0, Jt._)`${(0, Ra.usePattern)(e, E)}.test(${v})`))), (0, Jt.not)(m);
    }
    function h(v) {
      t.code((0, Jt._)`delete ${i}[${v}]`);
    }
    function $(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        h(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), o || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Oa.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (y(v, m, !1), t.if((0, Jt.not)(m), () => {
          e.reset(), h(v);
        })) : (y(v, m), o || t.if((0, Jt.not)(m), () => t.break()));
      }
    }
    function y(v, m, E) {
      const N = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: Oa.Type.Str
      };
      E === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Qo.default = DP;
var of = {};
Object.defineProperty(of, "__esModule", { value: !0 });
const kP = rr, Gh = ge, zc = Y, Hh = Qo, FP = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Hh.default.code(new kP.KeywordCxt(s, Hh.default, "additionalProperties"));
    const a = (0, Gh.allSchemaProperties)(r);
    for (const f of a)
      s.definedProperties.add(f);
    s.opts.unevaluated && a.length && s.props !== !0 && (s.props = zc.mergeEvaluated.props(t, (0, zc.toHash)(a), s.props));
    const o = a.filter((f) => !(0, zc.alwaysValidSchema)(s, r[f]));
    if (o.length === 0)
      return;
    const c = t.name("valid");
    for (const f of o)
      u(f) ? l(f) : (t.if((0, Gh.propertyInData)(t, i, f, s.opts.ownProperties)), l(f), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
    function u(f) {
      return s.opts.useDefaults && !s.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
of.default = FP;
var cf = {};
Object.defineProperty(cf, "__esModule", { value: !0 });
const zh = ge, Aa = fe, Kh = Y, Wh = Y, LP = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: a } = s, o = (0, zh.allSchemaProperties)(r), c = o.filter((y) => (0, Kh.alwaysValidSchema)(s, r[y]));
    if (o.length === 0 || c.length === o.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof Aa.Name) && (s.props = (0, Wh.evaluatedPropsToName)(t, s.props));
    const { props: f } = s;
    p();
    function p() {
      for (const y of o)
        u && h(y), s.allErrors ? $(y) : (t.var(l, !0), $(y), t.if(l));
    }
    function h(y) {
      for (const v in u)
        new RegExp(y).test(v) && (0, Kh.checkStrictMode)(s, `property ${v} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function $(y) {
      t.forIn("key", n, (v) => {
        t.if((0, Aa._)`${(0, zh.usePattern)(e, y)}.test(${v})`, () => {
          const m = c.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: v,
            dataPropType: Wh.Type.Str
          }, l), s.opts.unevaluated && f !== !0 ? t.assign((0, Aa._)`${f}[${v}]`, !0) : !m && !s.allErrors && t.if((0, Aa.not)(l), () => t.break());
        });
      });
    }
  }
};
cf.default = LP;
var lf = {};
Object.defineProperty(lf, "__esModule", { value: !0 });
const jP = Y, UP = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, jP.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
lf.default = UP;
var uf = {};
Object.defineProperty(uf, "__esModule", { value: !0 });
const MP = ge, xP = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: MP.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
uf.default = xP;
var ff = {};
Object.defineProperty(ff, "__esModule", { value: !0 });
const fo = fe, VP = Y, qP = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, fo._)`{passingSchemas: ${e.passing}}`
}, BP = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: qP,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, a = t.let("valid", !1), o = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: o }), t.block(u), e.result(a, () => e.reset(), () => e.error(!0));
    function u() {
      s.forEach((l, f) => {
        let p;
        (0, VP.alwaysValidSchema)(i, l) ? t.var(c, !0) : p = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, fo._)`${c} && ${a}`).assign(a, !1).assign(o, (0, fo._)`[${o}, ${f}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(o, f), p && e.mergeEvaluated(p, fo.Name);
        });
      });
    }
  }
};
ff.default = BP;
var df = {};
Object.defineProperty(df, "__esModule", { value: !0 });
const GP = Y, HP = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, a) => {
      if ((0, GP.alwaysValidSchema)(n, s))
        return;
      const o = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(o);
    });
  }
};
df.default = HP;
var hf = {};
Object.defineProperty(hf, "__esModule", { value: !0 });
const To = fe, eg = Y, zP = {
  message: ({ params: e }) => (0, To.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, To._)`{failingKeyword: ${e.ifClause}}`
}, KP = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: zP,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, eg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Yh(n, "then"), s = Yh(n, "else");
    if (!i && !s)
      return;
    const a = t.let("valid", !0), o = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(o, u("then", l), u("else", l));
    } else i ? t.if(o, u("then")) : t.if((0, To.not)(o), u("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const p = e.subschema({ keyword: l }, o);
        t.assign(a, o), e.mergeValidEvaluated(p, a), f ? t.assign(f, (0, To._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Yh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, eg.alwaysValidSchema)(e, r);
}
hf.default = KP;
var pf = {};
Object.defineProperty(pf, "__esModule", { value: !0 });
const WP = Y, YP = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, WP.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
pf.default = YP;
Object.defineProperty(tf, "__esModule", { value: !0 });
const XP = xi, JP = rf, QP = Vi, ZP = nf, e1 = sf, t1 = Jo, r1 = af, n1 = Qo, i1 = of, s1 = cf, a1 = lf, o1 = uf, c1 = ff, l1 = df, u1 = hf, f1 = pf;
function d1(e = !1) {
  const t = [
    // any
    a1.default,
    o1.default,
    c1.default,
    l1.default,
    u1.default,
    f1.default,
    // object
    r1.default,
    n1.default,
    t1.default,
    i1.default,
    s1.default
  ];
  return e ? t.push(JP.default, ZP.default) : t.push(XP.default, QP.default), t.push(e1.default), t;
}
tf.default = d1;
var mf = {}, qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.dynamicAnchor = void 0;
const Kc = fe, h1 = Lt, Xh = gt, p1 = kr, m1 = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => tg(e, e.schema)
};
function tg(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, Kc._)`${h1.default.dynamicAnchors}${(0, Kc.getProperty)(t)}`, s = n.errSchemaPath === "#" ? n.validateName : y1(e);
  r.if((0, Kc._)`!${i}`, () => r.assign(i, s));
}
qi.dynamicAnchor = tg;
function y1(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: i, baseId: s, localRefs: a, meta: o } = t.root, { schemaId: c } = n.opts, u = new Xh.SchemaEnv({ schema: r, schemaId: c, root: i, baseId: s, localRefs: a, meta: o });
  return Xh.compileSchema.call(n, u), (0, p1.getValidate)(e, u);
}
qi.default = m1;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.dynamicRef = void 0;
const Jh = fe, g1 = Lt, Qh = kr, $1 = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => rg(e, e.schema)
};
function rg(e, t) {
  const { gen: r, keyword: n, it: i } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const s = t.slice(1);
  if (i.allErrors)
    a();
  else {
    const c = r.let("valid", !1);
    a(c), e.ok(c);
  }
  function a(c) {
    if (i.schemaEnv.root.dynamicAnchors[s]) {
      const u = r.let("_v", (0, Jh._)`${g1.default.dynamicAnchors}${(0, Jh.getProperty)(s)}`);
      r.if(u, o(u, c), o(i.validateName, c));
    } else
      o(i.validateName, c)();
  }
  function o(c, u) {
    return u ? () => r.block(() => {
      (0, Qh.callRef)(e, c), r.let(u, !0);
    }) : () => (0, Qh.callRef)(e, c);
  }
}
Bi.dynamicRef = rg;
Bi.default = $1;
var yf = {};
Object.defineProperty(yf, "__esModule", { value: !0 });
const v1 = qi, _1 = Y, E1 = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, v1.dynamicAnchor)(e, "") : (0, _1.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
yf.default = E1;
var gf = {};
Object.defineProperty(gf, "__esModule", { value: !0 });
const w1 = Bi, S1 = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, w1.dynamicRef)(e, e.schema)
};
gf.default = S1;
Object.defineProperty(mf, "__esModule", { value: !0 });
const b1 = qi, P1 = Bi, T1 = yf, N1 = gf, R1 = [b1.default, P1.default, T1.default, N1.default];
mf.default = R1;
var $f = {}, vf = {};
Object.defineProperty(vf, "__esModule", { value: !0 });
const Zh = Jo, O1 = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Zh.error,
  code: (e) => (0, Zh.validatePropertyDeps)(e)
};
vf.default = O1;
var _f = {};
Object.defineProperty(_f, "__esModule", { value: !0 });
const A1 = Jo, I1 = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, A1.validateSchemaDeps)(e)
};
_f.default = I1;
var Ef = {};
Object.defineProperty(Ef, "__esModule", { value: !0 });
const C1 = Y, D1 = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, C1.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Ef.default = D1;
Object.defineProperty($f, "__esModule", { value: !0 });
const k1 = vf, F1 = _f, L1 = Ef, j1 = [k1.default, F1.default, L1.default];
$f.default = j1;
var wf = {}, Sf = {};
Object.defineProperty(Sf, "__esModule", { value: !0 });
const Yr = fe, ep = Y, U1 = Lt, M1 = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Yr._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, x1 = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: M1,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: i, it: s } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: o } = s;
    o instanceof Yr.Name ? t.if((0, Yr._)`${o} !== true`, () => t.forIn("key", n, (f) => t.if(u(o, f), () => c(f)))) : o !== !0 && t.forIn("key", n, (f) => o === void 0 ? c(f) : t.if(l(o, f), () => c(f))), s.props = !0, e.ok((0, Yr._)`${i} === ${U1.default.errors}`);
    function c(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), a || t.break();
        return;
      }
      if (!(0, ep.alwaysValidSchema)(s, r)) {
        const p = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: ep.Type.Str
        }, p), a || t.if((0, Yr.not)(p), () => t.break());
      }
    }
    function u(f, p) {
      return (0, Yr._)`!${f} || !${f}[${p}]`;
    }
    function l(f, p) {
      const h = [];
      for (const $ in f)
        f[$] === !0 && h.push((0, Yr._)`${p} !== ${$}`);
      return (0, Yr.and)(...h);
    }
  }
};
Sf.default = x1;
var bf = {};
Object.defineProperty(bf, "__esModule", { value: !0 });
const Cn = fe, tp = Y, V1 = {
  message: ({ params: { len: e } }) => (0, Cn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Cn._)`{limit: ${e}}`
}, q1 = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: V1,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e, s = i.items || 0;
    if (s === !0)
      return;
    const a = t.const("len", (0, Cn._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: s }), e.fail((0, Cn._)`${a} > ${s}`);
    else if (typeof r == "object" && !(0, tp.alwaysValidSchema)(i, r)) {
      const c = t.var("valid", (0, Cn._)`${a} <= ${s}`);
      t.if((0, Cn.not)(c), () => o(c, s)), e.ok(c);
    }
    i.items = !0;
    function o(c, u) {
      t.forRange("i", u, a, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: tp.Type.Num }, c), i.allErrors || t.if((0, Cn.not)(c), () => t.break());
      });
    }
  }
};
bf.default = q1;
Object.defineProperty(wf, "__esModule", { value: !0 });
const B1 = Sf, G1 = bf, H1 = [B1.default, G1.default];
wf.default = H1;
var Pf = {}, Tf = {};
Object.defineProperty(Tf, "__esModule", { value: !0 });
const je = fe, z1 = {
  message: ({ schemaCode: e }) => (0, je.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, je._)`{format: ${e}}`
}, K1 = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: z1,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: a, it: o } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = o;
    if (!c.validateFormats)
      return;
    i ? p() : h();
    function p() {
      const $ = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), y = r.const("fDef", (0, je._)`${$}[${a}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, je._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign(v, (0, je._)`${y}.type || "string"`).assign(m, (0, je._)`${y}.validate`), () => r.assign(v, (0, je._)`"string"`).assign(m, y)), e.fail$data((0, je.or)(E(), N()));
      function E() {
        return c.strictSchema === !1 ? je.nil : (0, je._)`${a} && !${m}`;
      }
      function N() {
        const D = l.$async ? (0, je._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, je._)`${m}(${n})`, j = (0, je._)`(typeof ${m} == "function" ? ${D} : ${m}.test(${n}))`;
        return (0, je._)`${m} && ${m} !== true && ${v} === ${t} && !${j}`;
      }
    }
    function h() {
      const $ = f.formats[s];
      if (!$) {
        E();
        return;
      }
      if ($ === !0)
        return;
      const [y, v, m] = N($);
      y === t && e.pass(D());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${s}" ignored in schema at path "${u}"`;
        }
      }
      function N(j) {
        const z = j instanceof RegExp ? (0, je.regexpCode)(j) : c.code.formats ? (0, je._)`${c.code.formats}${(0, je.getProperty)(s)}` : void 0, Q = r.scopeValue("formats", { key: s, ref: j, code: z });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, je._)`${Q}.validate`] : ["string", j, Q];
      }
      function D() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, je._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, je._)`${m}(${n})` : (0, je._)`${m}.test(${n})`;
      }
    }
  }
};
Tf.default = K1;
Object.defineProperty(Pf, "__esModule", { value: !0 });
const W1 = Tf, Y1 = [W1.default];
Pf.default = Y1;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.contentVocabulary = Ci.metadataVocabulary = void 0;
Ci.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ci.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(xu, "__esModule", { value: !0 });
const X1 = Vu, J1 = Bu, Q1 = tf, Z1 = mf, eT = $f, tT = wf, rT = Pf, rp = Ci, nT = [
  Z1.default,
  X1.default,
  J1.default,
  (0, Q1.default)(!0),
  rT.default,
  rp.metadataVocabulary,
  rp.contentVocabulary,
  eT.default,
  tT.default
];
xu.default = nT;
var Nf = {}, Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.DiscrError = void 0;
var np;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(np || (Zo.DiscrError = np = {}));
Object.defineProperty(Nf, "__esModule", { value: !0 });
const fi = fe, Xl = Zo, ip = gt, iT = Mi, sT = Y, aT = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Xl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fi._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, oT = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: aT,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: a } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const o = n.propertyName;
    if (typeof o != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, fi._)`${r}${(0, fi.getProperty)(o)}`);
    t.if((0, fi._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Xl.DiscrError.Tag, tag: u, tagName: o })), e.ok(c);
    function l() {
      const h = p();
      t.if(!1);
      for (const $ in h)
        t.elseIf((0, fi._)`${u} === ${$}`), t.assign(c, f(h[$]));
      t.else(), e.error(!1, { discrError: Xl.DiscrError.Mapping, tag: u, tagName: o }), t.endIf();
    }
    function f(h) {
      const $ = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: h }, $);
      return e.mergeEvaluated(y, fi.Name), $;
    }
    function p() {
      var h;
      const $ = {}, y = m(i);
      let v = !0;
      for (let D = 0; D < a.length; D++) {
        let j = a[D];
        if (j != null && j.$ref && !(0, sT.schemaHasRulesButRef)(j, s.self.RULES)) {
          const Q = j.$ref;
          if (j = ip.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, Q), j instanceof ip.SchemaEnv && (j = j.schema), j === void 0)
            throw new iT.default(s.opts.uriResolver, s.baseId, Q);
        }
        const z = (h = j == null ? void 0 : j.properties) === null || h === void 0 ? void 0 : h[o];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${o}"`);
        v = v && (y || m(j)), E(z, D);
      }
      if (!v)
        throw new Error(`discriminator: "${o}" must be required`);
      return $;
      function m({ required: D }) {
        return Array.isArray(D) && D.includes(o);
      }
      function E(D, j) {
        if (D.const)
          N(D.const, j);
        else if (D.enum)
          for (const z of D.enum)
            N(z, j);
        else
          throw new Error(`discriminator: "properties/${o}" must have "const" or "enum"`);
      }
      function N(D, j) {
        if (typeof D != "string" || D in $)
          throw new Error(`discriminator: "${o}" values must be unique strings`);
        $[D] = j;
      }
    }
  }
};
Nf.default = oT;
var Rf = {};
const cT = "https://json-schema.org/draft/2020-12/schema", lT = "https://json-schema.org/draft/2020-12/schema", uT = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, fT = "meta", dT = "Core and Validation specifications meta-schema", hT = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], pT = [
  "object",
  "boolean"
], mT = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", yT = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, gT = {
  $schema: cT,
  $id: lT,
  $vocabulary: uT,
  $dynamicAnchor: fT,
  title: dT,
  allOf: hT,
  type: pT,
  $comment: mT,
  properties: yT
}, $T = "https://json-schema.org/draft/2020-12/schema", vT = "https://json-schema.org/draft/2020-12/meta/applicator", _T = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, ET = "meta", wT = "Applicator vocabulary meta-schema", ST = [
  "object",
  "boolean"
], bT = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, PT = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, TT = {
  $schema: $T,
  $id: vT,
  $vocabulary: _T,
  $dynamicAnchor: ET,
  title: wT,
  type: ST,
  properties: bT,
  $defs: PT
}, NT = "https://json-schema.org/draft/2020-12/schema", RT = "https://json-schema.org/draft/2020-12/meta/unevaluated", OT = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, AT = "meta", IT = "Unevaluated applicator vocabulary meta-schema", CT = [
  "object",
  "boolean"
], DT = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, kT = {
  $schema: NT,
  $id: RT,
  $vocabulary: OT,
  $dynamicAnchor: AT,
  title: IT,
  type: CT,
  properties: DT
}, FT = "https://json-schema.org/draft/2020-12/schema", LT = "https://json-schema.org/draft/2020-12/meta/content", jT = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, UT = "meta", MT = "Content vocabulary meta-schema", xT = [
  "object",
  "boolean"
], VT = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, qT = {
  $schema: FT,
  $id: LT,
  $vocabulary: jT,
  $dynamicAnchor: UT,
  title: MT,
  type: xT,
  properties: VT
}, BT = "https://json-schema.org/draft/2020-12/schema", GT = "https://json-schema.org/draft/2020-12/meta/core", HT = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, zT = "meta", KT = "Core vocabulary meta-schema", WT = [
  "object",
  "boolean"
], YT = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, XT = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, JT = {
  $schema: BT,
  $id: GT,
  $vocabulary: HT,
  $dynamicAnchor: zT,
  title: KT,
  type: WT,
  properties: YT,
  $defs: XT
}, QT = "https://json-schema.org/draft/2020-12/schema", ZT = "https://json-schema.org/draft/2020-12/meta/format-annotation", eN = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, tN = "meta", rN = "Format vocabulary meta-schema for annotation results", nN = [
  "object",
  "boolean"
], iN = {
  format: {
    type: "string"
  }
}, sN = {
  $schema: QT,
  $id: ZT,
  $vocabulary: eN,
  $dynamicAnchor: tN,
  title: rN,
  type: nN,
  properties: iN
}, aN = "https://json-schema.org/draft/2020-12/schema", oN = "https://json-schema.org/draft/2020-12/meta/meta-data", cN = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, lN = "meta", uN = "Meta-data vocabulary meta-schema", fN = [
  "object",
  "boolean"
], dN = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, hN = {
  $schema: aN,
  $id: oN,
  $vocabulary: cN,
  $dynamicAnchor: lN,
  title: uN,
  type: fN,
  properties: dN
}, pN = "https://json-schema.org/draft/2020-12/schema", mN = "https://json-schema.org/draft/2020-12/meta/validation", yN = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, gN = "meta", $N = "Validation vocabulary meta-schema", vN = [
  "object",
  "boolean"
], _N = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, EN = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, wN = {
  $schema: pN,
  $id: mN,
  $vocabulary: yN,
  $dynamicAnchor: gN,
  title: $N,
  type: vN,
  properties: _N,
  $defs: EN
};
Object.defineProperty(Rf, "__esModule", { value: !0 });
const SN = gT, bN = TT, PN = kT, TN = qT, NN = JT, RN = sN, ON = hN, AN = wN, IN = ["/properties"];
function CN(e) {
  return [
    SN,
    bN,
    PN,
    TN,
    NN,
    t(this, RN),
    ON,
    t(this, AN)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, IN) : n;
  }
}
Rf.default = CN;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = i0, n = xu, i = Nf, s = Rf, a = "https://json-schema.org/draft/2020-12/schema";
  class o extends r.default {
    constructor(h = {}) {
      super({
        ...h,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((h) => this.addVocabulary(h)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: h, meta: $ } = this.opts;
      $ && (s.default.call(this, h), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = o, e.exports = t = o, e.exports.Ajv2020 = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
  var c = rr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = fe;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var l = Zs;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = Mi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(Bl, Bl.exports);
var DN = Bl.exports, Jl = { exports: {} }, ng = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(H, K) {
    return { validate: H, compare: K };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(s, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), u),
    "date-time": t(p(!0), h),
    "iso-time": t(c(), l),
    "iso-date-time": t(p(), $),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: A,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: z },
    // signed 64 bit integer
    int64: { type: "number", validate: Q },
    // C-type float
    float: { type: "number", validate: se },
    // C-type double
    double: { type: "number", validate: se },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, h),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, $),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(H) {
    return H % 4 === 0 && (H % 100 !== 0 || H % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function s(H) {
    const K = n.exec(H);
    if (!K)
      return !1;
    const ne = +K[1], C = +K[2], I = +K[3];
    return C >= 1 && C <= 12 && I >= 1 && I <= (C === 2 && r(ne) ? 29 : i[C]);
  }
  function a(H, K) {
    if (H && K)
      return H > K ? 1 : H < K ? -1 : 0;
  }
  const o = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(H) {
    return function(ne) {
      const C = o.exec(ne);
      if (!C)
        return !1;
      const I = +C[1], x = +C[2], L = +C[3], V = C[4], U = C[5] === "-" ? -1 : 1, O = +(C[6] || 0), w = +(C[7] || 0);
      if (O > 23 || w > 59 || H && !V)
        return !1;
      if (I <= 23 && x <= 59 && L < 60)
        return !0;
      const P = x - w * U, b = I - O * U - (P < 0 ? 1 : 0);
      return (b === 23 || b === -1) && (P === 59 || P === -1) && L < 61;
    };
  }
  function u(H, K) {
    if (!(H && K))
      return;
    const ne = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf(), C = (/* @__PURE__ */ new Date("2020-01-01T" + K)).valueOf();
    if (ne && C)
      return ne - C;
  }
  function l(H, K) {
    if (!(H && K))
      return;
    const ne = o.exec(H), C = o.exec(K);
    if (ne && C)
      return H = ne[1] + ne[2] + ne[3], K = C[1] + C[2] + C[3], H > K ? 1 : H < K ? -1 : 0;
  }
  const f = /t|\s/i;
  function p(H) {
    const K = c(H);
    return function(C) {
      const I = C.split(f);
      return I.length === 2 && s(I[0]) && K(I[1]);
    };
  }
  function h(H, K) {
    if (!(H && K))
      return;
    const ne = new Date(H).valueOf(), C = new Date(K).valueOf();
    if (ne && C)
      return ne - C;
  }
  function $(H, K) {
    if (!(H && K))
      return;
    const [ne, C] = H.split(f), [I, x] = K.split(f), L = a(ne, I);
    if (L !== void 0)
      return L || u(C, x);
  }
  const y = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(H) {
    return y.test(H) && v.test(H);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(H) {
    return E.lastIndex = 0, E.test(H);
  }
  const D = -2147483648, j = 2 ** 31 - 1;
  function z(H) {
    return Number.isInteger(H) && H <= j && H >= D;
  }
  function Q(H) {
    return Number.isInteger(H);
  }
  function se() {
    return !0;
  }
  const W = /[^\\]\\Z/;
  function A(H) {
    if (W.test(H))
      return !1;
    try {
      return new RegExp(H), !0;
    } catch {
      return !1;
    }
  }
})(ng);
var ig = {}, Ql = { exports: {} }, sg = {}, nr = {}, Di = {}, ta = {}, me = {}, ks = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((N, D) => `${N}${D}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((N, D) => (D instanceof r && (N[D.str] = (N[D.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(m, ...E) {
    const N = [m[0]];
    let D = 0;
    for (; D < E.length; )
      o(N, E[D]), N.push(m[++D]);
    return new n(N);
  }
  e._ = i;
  const s = new n("+");
  function a(m, ...E) {
    const N = [h(m[0])];
    let D = 0;
    for (; D < E.length; )
      N.push(s), o(N, E[D]), N.push(s, h(m[++D]));
    return c(N), new n(N);
  }
  e.str = a;
  function o(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(f(E));
  }
  e.addCodeArg = o;
  function c(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === s) {
        const N = u(m[E - 1], m[E + 1]);
        if (N !== void 0) {
          m.splice(E - 1, 3, N);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function u(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function l(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : a`${m}${E}`;
  }
  e.strConcat = l;
  function f(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : h(Array.isArray(m) ? m.join(",") : m);
  }
  function p(m) {
    return new n(h(m));
  }
  e.stringify = p;
  function h(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = h;
  function $(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
  }
  e.getProperty = $;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(ks);
var Zl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = ks;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class s extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = s;
  const a = (0, t._)`\n`;
  class o extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new s(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const p = this.toName(u), { prefix: h } = p, $ = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let y = this._values[h];
      if (y) {
        const E = y.get($);
        if (E)
          return E;
      } else
        y = this._values[h] = /* @__PURE__ */ new Map();
      y.set($, p);
      const v = this._scope[h] || (this._scope[h] = []), m = v.length;
      return v[m] = l.ref, p.setValue(l, { property: h, itemIndex: m }), p;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (p) => {
        if (p.value === void 0)
          throw new Error(`CodeGen: name "${p}" has no value`);
        return p.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, p) {
      let h = t.nil;
      for (const $ in u) {
        const y = u[$];
        if (!y)
          continue;
        const v = f[$] = f[$] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let E = l(m);
          if (E) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            h = (0, t._)`${h}${N} ${m} = ${E};${this.opts._n}`;
          } else if (E = p == null ? void 0 : p(m))
            h = (0, t._)`${h}${E}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return h;
    }
  }
  e.ValueScope = o;
})(Zl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = ks, r = Zl;
  var n = ks;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Zl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, g) {
      return this;
    }
  }
  class a extends s {
    constructor(d, g, R) {
      super(), this.varKind = d, this.name = g, this.rhs = R;
    }
    render({ es5: d, _n: g }) {
      const R = d ? r.varKinds.var : this.varKind, q = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${R} ${this.name}${q};` + g;
    }
    optimizeNames(d, g) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = C(this.rhs, d, g)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class o extends s {
    constructor(d, g, R) {
      super(), this.lhs = d, this.rhs = g, this.sideEffects = R;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, g) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = C(this.rhs, d, g), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ne(d, this.rhs);
    }
  }
  class c extends o {
    constructor(d, g, R, q) {
      super(d, R, q), this.op = g;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends s {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class p extends s {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, g) {
      return this.code = C(this.code, d, g), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class h extends s {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((g, R) => g + R.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let g = d.length;
      for (; g--; ) {
        const R = d[g].optimizeNodes();
        Array.isArray(R) ? d.splice(g, 1, ...R) : R ? d[g] = R : d.splice(g, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, g) {
      const { nodes: R } = this;
      let q = R.length;
      for (; q--; ) {
        const B = R[q];
        B.optimizeNames(d, g) || (I(d, B.names), R.splice(q, 1));
      }
      return R.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, g) => K(d, g.names), {});
    }
  }
  class $ extends h {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class y extends h {
  }
  class v extends $ {
  }
  v.kind = "else";
  class m extends $ {
    constructor(d, g) {
      super(g), this.condition = d;
    }
    render(d) {
      let g = `if(${this.condition})` + super.render(d);
      return this.else && (g += "else " + this.else.render(d)), g;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let g = this.else;
      if (g) {
        const R = g.optimizeNodes();
        g = this.else = Array.isArray(R) ? new v(R) : R;
      }
      if (g)
        return d === !1 ? g instanceof m ? g : g.nodes : this.nodes.length ? this : new m(x(d), g instanceof m ? [g] : g.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, g) {
      var R;
      if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(d, g), !!(super.optimizeNames(d, g) || this.else))
        return this.condition = C(this.condition, d, g), this;
    }
    get names() {
      const d = super.names;
      return ne(d, this.condition), this.else && K(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class E extends $ {
  }
  E.kind = "for";
  class N extends E {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, g) {
      if (super.optimizeNames(d, g))
        return this.iteration = C(this.iteration, d, g), this;
    }
    get names() {
      return K(super.names, this.iteration.names);
    }
  }
  class D extends E {
    constructor(d, g, R, q) {
      super(), this.varKind = d, this.name = g, this.from = R, this.to = q;
    }
    render(d) {
      const g = d.es5 ? r.varKinds.var : this.varKind, { name: R, from: q, to: B } = this;
      return `for(${g} ${R}=${q}; ${R}<${B}; ${R}++)` + super.render(d);
    }
    get names() {
      const d = ne(super.names, this.from);
      return ne(d, this.to);
    }
  }
  class j extends E {
    constructor(d, g, R, q) {
      super(), this.loop = d, this.varKind = g, this.name = R, this.iterable = q;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, g) {
      if (super.optimizeNames(d, g))
        return this.iterable = C(this.iterable, d, g), this;
    }
    get names() {
      return K(super.names, this.iterable.names);
    }
  }
  class z extends $ {
    constructor(d, g, R) {
      super(), this.name = d, this.args = g, this.async = R;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  z.kind = "func";
  class Q extends h {
    render(d) {
      return "return " + super.render(d);
    }
  }
  Q.kind = "return";
  class se extends $ {
    render(d) {
      let g = "try" + super.render(d);
      return this.catch && (g += this.catch.render(d)), this.finally && (g += this.finally.render(d)), g;
    }
    optimizeNodes() {
      var d, g;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (g = this.finally) === null || g === void 0 || g.optimizeNodes(), this;
    }
    optimizeNames(d, g) {
      var R, q;
      return super.optimizeNames(d, g), (R = this.catch) === null || R === void 0 || R.optimizeNames(d, g), (q = this.finally) === null || q === void 0 || q.optimizeNames(d, g), this;
    }
    get names() {
      const d = super.names;
      return this.catch && K(d, this.catch.names), this.finally && K(d, this.finally.names), d;
    }
  }
  class W extends $ {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  W.kind = "catch";
  class A extends $ {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  A.kind = "finally";
  class H {
    constructor(d, g = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...g, _n: g.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, g) {
      const R = this._extScope.value(d, g);
      return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
    }
    getScopeValue(d, g) {
      return this._extScope.getValue(d, g);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, g, R, q) {
      const B = this._scope.toName(g);
      return R !== void 0 && q && (this._constants[B.str] = R), this._leafNode(new a(d, B, R)), B;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, g, R) {
      return this._def(r.varKinds.const, d, g, R);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, g, R) {
      return this._def(r.varKinds.let, d, g, R);
    }
    // `var` declaration with optional assignment
    var(d, g, R) {
      return this._def(r.varKinds.var, d, g, R);
    }
    // assignment code
    assign(d, g, R) {
      return this._leafNode(new o(d, g, R));
    }
    // `+=` code
    add(d, g) {
      return this._leafNode(new c(d, e.operators.ADD, g));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new p(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const g = ["{"];
      for (const [R, q] of d)
        g.length > 1 && g.push(","), g.push(R), (R !== q || this.opts.es5) && (g.push(":"), (0, t.addCodeArg)(g, q));
      return g.push("}"), new t._Code(g);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, g, R) {
      if (this._blockNode(new m(d)), g && R)
        this.code(g).else().code(R).endIf();
      else if (g)
        this.code(g).endIf();
      else if (R)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new m(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(d, g) {
      return this._blockNode(d), g && this.code(g).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, g) {
      return this._for(new N(d), g);
    }
    // `for` statement for a range of values
    forRange(d, g, R, q, B = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const ee = this._scope.toName(d);
      return this._for(new D(B, ee, g, R), () => q(ee));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, g, R, q = r.varKinds.const) {
      const B = this._scope.toName(d);
      if (this.opts.es5) {
        const ee = g instanceof t.Name ? g : this.var("_arr", g);
        return this.forRange("_i", 0, (0, t._)`${ee}.length`, (X) => {
          this.var(B, (0, t._)`${ee}[${X}]`), R(B);
        });
      }
      return this._for(new j("of", q, B, g), () => R(B));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, g, R, q = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${g})`, R);
      const B = this._scope.toName(d);
      return this._for(new j("in", q, B, g), () => R(B));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const g = new Q();
      if (this._blockNode(g), this.code(d), g.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Q);
    }
    // `try` statement
    try(d, g, R) {
      if (!g && !R)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const q = new se();
      if (this._blockNode(q), this.code(d), g) {
        const B = this.name("e");
        this._currNode = q.catch = new W(B), g(B);
      }
      return R && (this._currNode = q.finally = new A(), this.code(R)), this._endBlockNode(W, A);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, g) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(g), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const g = this._blockStarts.pop();
      if (g === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const R = this._nodes.length - g;
      if (R < 0 || d !== void 0 && R !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${d} expected`);
      return this._nodes.length = g, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, g = t.nil, R, q) {
      return this._blockNode(new z(d, g, R)), q && this.code(q).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, g) {
      const R = this._currNode;
      if (R instanceof d || g && R instanceof g)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${g ? `${d.kind}/${g.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const g = this._currNode;
      if (!(g instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = g.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const g = this._nodes;
      g[g.length - 1] = d;
    }
  }
  e.CodeGen = H;
  function K(b, d) {
    for (const g in d)
      b[g] = (b[g] || 0) + (d[g] || 0);
    return b;
  }
  function ne(b, d) {
    return d instanceof t._CodeOrName ? K(b, d.names) : b;
  }
  function C(b, d, g) {
    if (b instanceof t.Name)
      return R(b);
    if (!q(b))
      return b;
    return new t._Code(b._items.reduce((B, ee) => (ee instanceof t.Name && (ee = R(ee)), ee instanceof t._Code ? B.push(...ee._items) : B.push(ee), B), []));
    function R(B) {
      const ee = g[B.str];
      return ee === void 0 || d[B.str] !== 1 ? B : (delete d[B.str], ee);
    }
    function q(B) {
      return B instanceof t._Code && B._items.some((ee) => ee instanceof t.Name && d[ee.str] === 1 && g[ee.str] !== void 0);
    }
  }
  function I(b, d) {
    for (const g in d)
      b[g] = (b[g] || 0) - (d[g] || 0);
  }
  function x(b) {
    return typeof b == "boolean" || typeof b == "number" || b === null ? !b : (0, t._)`!${P(b)}`;
  }
  e.not = x;
  const L = w(e.operators.AND);
  function V(...b) {
    return b.reduce(L);
  }
  e.and = V;
  const U = w(e.operators.OR);
  function O(...b) {
    return b.reduce(U);
  }
  e.or = O;
  function w(b) {
    return (d, g) => d === t.nil ? g : g === t.nil ? d : (0, t._)`${P(d)} ${b} ${P(g)}`;
  }
  function P(b) {
    return b instanceof t.Name ? b : (0, t._)`(${b})`;
  }
})(me);
var J = {};
Object.defineProperty(J, "__esModule", { value: !0 });
J.checkStrictMode = J.getErrorPath = J.Type = J.useFunc = J.setEvaluated = J.evaluatedPropsToName = J.mergeEvaluated = J.eachItem = J.unescapeJsonPointer = J.escapeJsonPointer = J.escapeFragment = J.unescapeFragment = J.schemaRefOrVal = J.schemaHasRulesButRef = J.schemaHasRules = J.checkUnknownRules = J.alwaysValidSchema = J.toHash = void 0;
const Pe = me, kN = ks;
function FN(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
J.toHash = FN;
function LN(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ag(e, t), !og(t, e.self.RULES.all));
}
J.alwaysValidSchema = LN;
function ag(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || ug(e, `unknown keyword: "${s}"`);
}
J.checkUnknownRules = ag;
function og(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
J.schemaHasRules = og;
function jN(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
J.schemaHasRulesButRef = jN;
function UN({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, Pe._)`${r}`;
  }
  return (0, Pe._)`${e}${t}${(0, Pe.getProperty)(n)}`;
}
J.schemaRefOrVal = UN;
function MN(e) {
  return cg(decodeURIComponent(e));
}
J.unescapeFragment = MN;
function xN(e) {
  return encodeURIComponent(Of(e));
}
J.escapeFragment = xN;
function Of(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
J.escapeJsonPointer = Of;
function cg(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
J.unescapeJsonPointer = cg;
function VN(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
J.eachItem = VN;
function sp({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, a, o) => {
    const c = a === void 0 ? s : a instanceof Pe.Name ? (s instanceof Pe.Name ? e(i, s, a) : t(i, s, a), a) : s instanceof Pe.Name ? (t(i, a, s), s) : r(s, a);
    return o === Pe.Name && !(c instanceof Pe.Name) ? n(i, c) : c;
  };
}
J.mergeEvaluated = {
  props: sp({
    mergeNames: (e, t, r) => e.if((0, Pe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, Pe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, Pe._)`${r} || {}`).code((0, Pe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, Pe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, Pe._)`${r} || {}`), Af(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: lg
  }),
  items: sp({
    mergeNames: (e, t, r) => e.if((0, Pe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, Pe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, Pe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, Pe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function lg(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, Pe._)`{}`);
  return t !== void 0 && Af(e, r, t), r;
}
J.evaluatedPropsToName = lg;
function Af(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, Pe._)`${t}${(0, Pe.getProperty)(n)}`, !0));
}
J.setEvaluated = Af;
const ap = {};
function qN(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ap[t.code] || (ap[t.code] = new kN._Code(t.code))
  });
}
J.useFunc = qN;
var eu;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(eu || (J.Type = eu = {}));
function BN(e, t, r) {
  if (e instanceof Pe.Name) {
    const n = t === eu.Num;
    return r ? n ? (0, Pe._)`"[" + ${e} + "]"` : (0, Pe._)`"['" + ${e} + "']"` : n ? (0, Pe._)`"/" + ${e}` : (0, Pe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, Pe.getProperty)(e).toString() : "/" + Of(e);
}
J.getErrorPath = BN;
function ug(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
J.checkStrictMode = ug;
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
const ot = me, GN = {
  // validation function arguments
  data: new ot.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new ot.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new ot.Name("instancePath"),
  parentData: new ot.Name("parentData"),
  parentDataProperty: new ot.Name("parentDataProperty"),
  rootData: new ot.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new ot.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new ot.Name("vErrors"),
  // null or array of validation errors
  errors: new ot.Name("errors"),
  // counter of validation errors
  this: new ot.Name("this"),
  // "globals"
  self: new ot.Name("self"),
  scope: new ot.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new ot.Name("json"),
  jsonPos: new ot.Name("jsonPos"),
  jsonLen: new ot.Name("jsonLen"),
  jsonPart: new ot.Name("jsonPart")
};
vr.default = GN;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = me, r = J, n = vr;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, E, N) {
    const { it: D } = v, { gen: j, compositeRule: z, allErrors: Q } = D, se = f(v, m, E);
    N ?? (z || Q) ? c(j, se) : u(D, (0, t._)`[${se}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, E) {
    const { it: N } = v, { gen: D, compositeRule: j, allErrors: z } = N, Q = f(v, m, E);
    c(D, Q), j || z || u(N, n.default.vErrors);
  }
  e.reportExtraError = s;
  function a(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function o({ gen: v, keyword: m, schemaValue: E, data: N, errsCount: D, it: j }) {
    if (D === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", D, n.default.errors, (Q) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${Q}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, j.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (v.assign((0, t._)`${z}.schema`, E), v.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = o;
  function c(v, m) {
    const E = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, m) {
    const { gen: E, validateName: N, schemaEnv: D } = v;
    D.$async ? E.throw((0, t._)`new ${v.ValidationError}(${m})`) : (E.assign((0, t._)`${N}.errors`, m), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, m, E) {
    const { createErrors: N } = v.it;
    return N === !1 ? (0, t._)`{}` : p(v, m, E);
  }
  function p(v, m, E = {}) {
    const { gen: N, it: D } = v, j = [
      h(D, E),
      $(v, E)
    ];
    return y(v, m, j), N.object(...j);
  }
  function h({ errorPath: v }, { instancePath: m }) {
    const E = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function $({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: N }) {
    let D = N ? m : (0, t.str)`${m}/${v}`;
    return E && (D = (0, t.str)`${D}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, D];
  }
  function y(v, { params: m, message: E }, N) {
    const { keyword: D, data: j, schemaValue: z, it: Q } = v, { opts: se, propertyName: W, topSchemaRef: A, schemaPath: H } = Q;
    N.push([l.keyword, D], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), se.messages && N.push([l.message, typeof E == "function" ? E(v) : E]), se.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${A}${H}`], [n.default.data, j]), W && N.push([l.propertyName, W]);
  }
})(ta);
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.boolOrEmptySchema = Di.topBoolOrEmptySchema = void 0;
const HN = ta, zN = me, KN = vr, WN = {
  message: "boolean schema is false"
};
function YN(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? fg(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(KN.default.data) : (t.assign((0, zN._)`${n}.errors`, null), t.return(!0));
}
Di.topBoolOrEmptySchema = YN;
function XN(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), fg(e)) : r.var(t, !0);
}
Di.boolOrEmptySchema = XN;
function fg(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, HN.reportError)(i, WN, void 0, t);
}
var Ge = {}, zn = {};
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.getRules = zn.isJSONType = void 0;
const JN = ["string", "number", "integer", "boolean", "null", "object", "array"], QN = new Set(JN);
function ZN(e) {
  return typeof e == "string" && QN.has(e);
}
zn.isJSONType = ZN;
function eR() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
zn.getRules = eR;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.shouldUseRule = Ar.shouldUseGroup = Ar.schemaHasRulesForType = void 0;
function tR({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && dg(e, n);
}
Ar.schemaHasRulesForType = tR;
function dg(e, t) {
  return t.rules.some((r) => hg(e, r));
}
Ar.shouldUseGroup = dg;
function hg(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Ar.shouldUseRule = hg;
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.reportTypeError = Ge.checkDataTypes = Ge.checkDataType = Ge.coerceAndCheckDataType = Ge.getJSONTypes = Ge.getSchemaTypes = Ge.DataType = void 0;
const rR = zn, nR = Ar, iR = ta, pe = me, pg = J;
var Ti;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Ti || (Ge.DataType = Ti = {}));
function sR(e) {
  const t = mg(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Ge.getSchemaTypes = sR;
function mg(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(rR.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ge.getJSONTypes = mg;
function aR(e, t) {
  const { gen: r, data: n, opts: i } = e, s = oR(t, i.coerceTypes), a = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, nR.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const o = If(t, n, i.strictNumbers, Ti.Wrong);
    r.if(o, () => {
      s.length ? cR(e, t, s) : Cf(e);
    });
  }
  return a;
}
Ge.coerceAndCheckDataType = aR;
const yg = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function oR(e, t) {
  return t ? e.filter((r) => yg.has(r) || t === "array" && r === "array") : [];
}
function cR(e, t, r) {
  const { gen: n, data: i, opts: s } = e, a = n.let("dataType", (0, pe._)`typeof ${i}`), o = n.let("coerced", (0, pe._)`undefined`);
  s.coerceTypes === "array" && n.if((0, pe._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, pe._)`${i}[0]`).assign(a, (0, pe._)`typeof ${i}`).if(If(t, i, s.strictNumbers), () => n.assign(o, i))), n.if((0, pe._)`${o} !== undefined`);
  for (const u of r)
    (yg.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), Cf(e), n.endIf(), n.if((0, pe._)`${o} !== undefined`, () => {
    n.assign(i, o), lR(e, o);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, pe._)`${a} == "number" || ${a} == "boolean"`).assign(o, (0, pe._)`"" + ${i}`).elseIf((0, pe._)`${i} === null`).assign(o, (0, pe._)`""`);
        return;
      case "number":
        n.elseIf((0, pe._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(o, (0, pe._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, pe._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(o, (0, pe._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, pe._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(o, !1).elseIf((0, pe._)`${i} === "true" || ${i} === 1`).assign(o, !0);
        return;
      case "null":
        n.elseIf((0, pe._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(o, null);
        return;
      case "array":
        n.elseIf((0, pe._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(o, (0, pe._)`[${i}]`);
    }
  }
}
function lR({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, pe._)`${t} !== undefined`, () => e.assign((0, pe._)`${t}[${r}]`, n));
}
function tu(e, t, r, n = Ti.Correct) {
  const i = n === Ti.Correct ? pe.operators.EQ : pe.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, pe._)`${t} ${i} null`;
    case "array":
      s = (0, pe._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, pe._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = a((0, pe._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = a();
      break;
    default:
      return (0, pe._)`typeof ${t} ${i} ${e}`;
  }
  return n === Ti.Correct ? s : (0, pe.not)(s);
  function a(o = pe.nil) {
    return (0, pe.and)((0, pe._)`typeof ${t} == "number"`, o, r ? (0, pe._)`isFinite(${t})` : pe.nil);
  }
}
Ge.checkDataType = tu;
function If(e, t, r, n) {
  if (e.length === 1)
    return tu(e[0], t, r, n);
  let i;
  const s = (0, pg.toHash)(e);
  if (s.array && s.object) {
    const a = (0, pe._)`typeof ${t} != "object"`;
    i = s.null ? a : (0, pe._)`!${t} || ${a}`, delete s.null, delete s.array, delete s.object;
  } else
    i = pe.nil;
  s.number && delete s.integer;
  for (const a in s)
    i = (0, pe.and)(i, tu(a, t, r, n));
  return i;
}
Ge.checkDataTypes = If;
const uR = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, pe._)`{type: ${e}}` : (0, pe._)`{type: ${t}}`
};
function Cf(e) {
  const t = fR(e);
  (0, iR.reportError)(t, uR);
}
Ge.reportTypeError = Cf;
function fR(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, pg.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var ec = {};
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.assignDefaults = void 0;
const ri = me, dR = J;
function hR(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      op(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => op(e, s, i.default));
}
ec.assignDefaults = hR;
function op(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: a } = e;
  if (r === void 0)
    return;
  const o = (0, ri._)`${s}${(0, ri.getProperty)(t)}`;
  if (i) {
    (0, dR.checkStrictMode)(e, `default is ignored for: ${o}`);
    return;
  }
  let c = (0, ri._)`${o} === undefined`;
  a.useDefaults === "empty" && (c = (0, ri._)`${c} || ${o} === null || ${o} === ""`), n.if(c, (0, ri._)`${o} = ${(0, ri.stringify)(r)}`);
}
var gr = {}, $e = {};
Object.defineProperty($e, "__esModule", { value: !0 });
$e.validateUnion = $e.validateArray = $e.usePattern = $e.callValidateCode = $e.schemaProperties = $e.allSchemaProperties = $e.noPropertyInData = $e.propertyInData = $e.isOwnProperty = $e.hasPropFunc = $e.reportMissingProp = $e.checkMissingProp = $e.checkReportMissingProp = void 0;
const Oe = me, Df = J, zr = vr, pR = J;
function mR(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(Ff(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Oe._)`${t}` }, !0), e.error();
  });
}
$e.checkReportMissingProp = mR;
function yR({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Oe.or)(...n.map((s) => (0, Oe.and)(Ff(e, t, s, r.ownProperties), (0, Oe._)`${i} = ${s}`)));
}
$e.checkMissingProp = yR;
function gR(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
$e.reportMissingProp = gR;
function gg(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Oe._)`Object.prototype.hasOwnProperty`
  });
}
$e.hasPropFunc = gg;
function kf(e, t, r) {
  return (0, Oe._)`${gg(e)}.call(${t}, ${r})`;
}
$e.isOwnProperty = kf;
function $R(e, t, r, n) {
  const i = (0, Oe._)`${t}${(0, Oe.getProperty)(r)} !== undefined`;
  return n ? (0, Oe._)`${i} && ${kf(e, t, r)}` : i;
}
$e.propertyInData = $R;
function Ff(e, t, r, n) {
  const i = (0, Oe._)`${t}${(0, Oe.getProperty)(r)} === undefined`;
  return n ? (0, Oe.or)(i, (0, Oe.not)(kf(e, t, r))) : i;
}
$e.noPropertyInData = Ff;
function $g(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
$e.allSchemaProperties = $g;
function vR(e, t) {
  return $g(t).filter((r) => !(0, Df.alwaysValidSchema)(e, t[r]));
}
$e.schemaProperties = vR;
function _R({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: a }, o, c, u) {
  const l = u ? (0, Oe._)`${e}, ${t}, ${n}${i}` : t, f = [
    [zr.default.instancePath, (0, Oe.strConcat)(zr.default.instancePath, s)],
    [zr.default.parentData, a.parentData],
    [zr.default.parentDataProperty, a.parentDataProperty],
    [zr.default.rootData, zr.default.rootData]
  ];
  a.opts.dynamicRef && f.push([zr.default.dynamicAnchors, zr.default.dynamicAnchors]);
  const p = (0, Oe._)`${l}, ${r.object(...f)}`;
  return c !== Oe.nil ? (0, Oe._)`${o}.call(${c}, ${p})` : (0, Oe._)`${o}(${p})`;
}
$e.callValidateCode = _R;
const ER = (0, Oe._)`new RegExp`;
function wR({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Oe._)`${i.code === "new RegExp" ? ER : (0, pR.useFunc)(e, i)}(${r}, ${n})`
  });
}
$e.usePattern = wR;
function SR(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const o = t.let("valid", !0);
    return a(() => t.assign(o, !1)), o;
  }
  return t.var(s, !0), a(() => t.break()), s;
  function a(o) {
    const c = t.const("len", (0, Oe._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: Df.Type.Num
      }, s), t.if((0, Oe.not)(s), o);
    });
  }
}
$e.validateArray = SR;
function bR(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Df.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), o = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, o);
    t.assign(a, (0, Oe._)`${a} || ${o}`), e.mergeValidEvaluated(l, o) || t.if((0, Oe.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
$e.validateUnion = bR;
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.validateKeywordUsage = gr.validSchemaType = gr.funcKeywordCode = gr.macroKeywordCode = void 0;
const yt = me, Dn = vr, PR = $e, TR = ta;
function NR(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: a } = e, o = t.macro.call(a.self, i, s, a), c = vg(r, n, o);
  a.opts.validateSchema !== !1 && a.self.validateSchema(o, !0);
  const u = r.name("valid");
  e.subschema({
    schema: o,
    schemaPath: yt.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
gr.macroKeywordCode = NR;
function RR(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: a, $data: o, it: c } = e;
  AR(c, t);
  const u = !o && t.compile ? t.compile.call(c.self, s, a, c) : t.validate, l = vg(n, i, u), f = n.let("valid");
  e.block$data(f, p), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function p() {
    if (t.errors === !1)
      y(), t.modifying && cp(e), v(() => e.error());
    else {
      const m = t.async ? h() : $();
      t.modifying && cp(e), v(() => OR(e, m));
    }
  }
  function h() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, yt._)`await `), (E) => n.assign(f, !1).if((0, yt._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, yt._)`${E}.errors`), () => n.throw(E))), m;
  }
  function $() {
    const m = (0, yt._)`${l}.errors`;
    return n.assign(m, null), y(yt.nil), m;
  }
  function y(m = t.async ? (0, yt._)`await ` : yt.nil) {
    const E = c.opts.passContext ? Dn.default.this : Dn.default.self, N = !("compile" in t && !o || t.schema === !1);
    n.assign(f, (0, yt._)`${m}${(0, PR.callValidateCode)(e, l, E, N)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, yt.not)((E = t.valid) !== null && E !== void 0 ? E : f), m);
  }
}
gr.funcKeywordCode = RR;
function cp(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, yt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function OR(e, t) {
  const { gen: r } = e;
  r.if((0, yt._)`Array.isArray(${t})`, () => {
    r.assign(Dn.default.vErrors, (0, yt._)`${Dn.default.vErrors} === null ? ${t} : ${Dn.default.vErrors}.concat(${t})`).assign(Dn.default.errors, (0, yt._)`${Dn.default.vErrors}.length`), (0, TR.extendErrors)(e);
  }, () => e.error());
}
function AR({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function vg(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, yt.stringify)(r) });
}
function IR(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
gr.validSchemaType = IR;
function CR({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((o) => !Object.prototype.hasOwnProperty.call(e, o)))
    throw new Error(`parent schema must have dependencies of ${s}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
gr.validateKeywordUsage = CR;
var cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.extendSubschemaMode = cn.extendSubschemaData = cn.getSubschema = void 0;
const pr = me, _g = J;
function DR(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const o = e.schema[t];
    return r === void 0 ? {
      schema: o,
      schemaPath: (0, pr._)`${e.schemaPath}${(0, pr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: o[r],
      schemaPath: (0, pr._)`${e.schemaPath}${(0, pr.getProperty)(t)}${(0, pr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, _g.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
cn.getSubschema = DR;
function kR(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: o } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, p = o.let("data", (0, pr._)`${t.data}${(0, pr.getProperty)(r)}`, !0);
    c(p), e.errorPath = (0, pr.str)`${u}${(0, _g.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, pr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof pr.Name ? i : o.let("data", i, !0);
    c(u), a !== void 0 && (e.propertyName = a);
  }
  s && (e.dataTypes = s);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
cn.extendSubschemaData = kR;
function FR(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
cn.extendSubschemaMode = FR;
var et = {}, Eg = { exports: {} }, nn = Eg.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  ho(t, n, i, e, "", e);
};
nn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
nn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
nn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
nn.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function ho(e, t, r, n, i, s, a, o, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, a, o, c, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in nn.arrayKeywords)
          for (var p = 0; p < f.length; p++)
            ho(e, t, r, f[p], i + "/" + l + "/" + p, s, i, l, n, p);
      } else if (l in nn.propsKeywords) {
        if (f && typeof f == "object")
          for (var h in f)
            ho(e, t, r, f[h], i + "/" + l + "/" + LR(h), s, i, l, n, h);
      } else (l in nn.keywords || e.allKeys && !(l in nn.skipKeywords)) && ho(e, t, r, f, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, a, o, c, u);
  }
}
function LR(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var jR = Eg.exports;
Object.defineProperty(et, "__esModule", { value: !0 });
et.getSchemaRefs = et.resolveUrl = et.normalizeId = et._getFullPath = et.getFullPath = et.inlineRef = void 0;
const UR = J, MR = Ko, xR = jR, VR = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function qR(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ru(e) : t ? wg(e) <= t : !1;
}
et.inlineRef = qR;
const BR = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ru(e) {
  for (const t in e) {
    if (BR.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ru) || typeof r == "object" && ru(r))
      return !0;
  }
  return !1;
}
function wg(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !VR.has(r) && (typeof e[r] == "object" && (0, UR.eachItem)(e[r], (n) => t += wg(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Sg(e, t = "", r) {
  r !== !1 && (t = Ni(t));
  const n = e.parse(t);
  return bg(e, n);
}
et.getFullPath = Sg;
function bg(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
et._getFullPath = bg;
const GR = /#\/?$/;
function Ni(e) {
  return e ? e.replace(GR, "") : "";
}
et.normalizeId = Ni;
function HR(e, t, r) {
  return r = Ni(r), e.resolve(t, r);
}
et.resolveUrl = HR;
const zR = /^[a-z_][-a-z0-9._]*$/i;
function KR(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = Ni(e[r] || t), s = { "": i }, a = Sg(n, i, !1), o = {}, c = /* @__PURE__ */ new Set();
  return xR(e, { allKeys: !0 }, (f, p, h, $) => {
    if ($ === void 0)
      return;
    const y = a + p;
    let v = s[$];
    typeof f[r] == "string" && (v = m.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), s[p] = v;
    function m(N) {
      const D = this.opts.uriResolver.resolve;
      if (N = Ni(v ? D(v, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let j = this.refs[N];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? u(f, j.schema, N) : N !== Ni(y) && (N[0] === "#" ? (u(f, o[N], N), o[N] = f) : this.refs[N] = y), N;
    }
    function E(N) {
      if (typeof N == "string") {
        if (!zR.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), o;
  function u(f, p, h) {
    if (p !== void 0 && !MR(f, p))
      throw l(h);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
et.getSchemaRefs = KR;
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.getData = nr.KeywordCxt = nr.validateFunctionCode = void 0;
const Pg = Di, lp = Ge, Lf = Ar, No = Ge, WR = ec, bs = gr, Wc = cn, re = me, oe = vr, YR = et, Ir = J, os = ta;
function XR(e) {
  if (Rg(e) && (Og(e), Ng(e))) {
    ZR(e);
    return;
  }
  Tg(e, () => (0, Pg.topBoolOrEmptySchema)(e));
}
nr.validateFunctionCode = XR;
function Tg({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, re._)`${oe.default.data}, ${oe.default.valCxt}`, n.$async, () => {
    e.code((0, re._)`"use strict"; ${up(r, i)}`), QR(e, i), e.code(s);
  }) : e.func(t, (0, re._)`${oe.default.data}, ${JR(i)}`, n.$async, () => e.code(up(r, i)).code(s));
}
function JR(e) {
  return (0, re._)`{${oe.default.instancePath}="", ${oe.default.parentData}, ${oe.default.parentDataProperty}, ${oe.default.rootData}=${oe.default.data}${e.dynamicRef ? (0, re._)`, ${oe.default.dynamicAnchors}={}` : re.nil}}={}`;
}
function QR(e, t) {
  e.if(oe.default.valCxt, () => {
    e.var(oe.default.instancePath, (0, re._)`${oe.default.valCxt}.${oe.default.instancePath}`), e.var(oe.default.parentData, (0, re._)`${oe.default.valCxt}.${oe.default.parentData}`), e.var(oe.default.parentDataProperty, (0, re._)`${oe.default.valCxt}.${oe.default.parentDataProperty}`), e.var(oe.default.rootData, (0, re._)`${oe.default.valCxt}.${oe.default.rootData}`), t.dynamicRef && e.var(oe.default.dynamicAnchors, (0, re._)`${oe.default.valCxt}.${oe.default.dynamicAnchors}`);
  }, () => {
    e.var(oe.default.instancePath, (0, re._)`""`), e.var(oe.default.parentData, (0, re._)`undefined`), e.var(oe.default.parentDataProperty, (0, re._)`undefined`), e.var(oe.default.rootData, oe.default.data), t.dynamicRef && e.var(oe.default.dynamicAnchors, (0, re._)`{}`);
  });
}
function ZR(e) {
  const { schema: t, opts: r, gen: n } = e;
  Tg(e, () => {
    r.$comment && t.$comment && Ig(e), iO(e), n.let(oe.default.vErrors, null), n.let(oe.default.errors, 0), r.unevaluated && eO(e), Ag(e), oO(e);
  });
}
function eO(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, re._)`${r}.evaluated`), t.if((0, re._)`${e.evaluated}.dynamicProps`, () => t.assign((0, re._)`${e.evaluated}.props`, (0, re._)`undefined`)), t.if((0, re._)`${e.evaluated}.dynamicItems`, () => t.assign((0, re._)`${e.evaluated}.items`, (0, re._)`undefined`));
}
function up(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, re._)`/*# sourceURL=${r} */` : re.nil;
}
function tO(e, t) {
  if (Rg(e) && (Og(e), Ng(e))) {
    rO(e, t);
    return;
  }
  (0, Pg.boolOrEmptySchema)(e, t);
}
function Ng({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Rg(e) {
  return typeof e.schema != "boolean";
}
function rO(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Ig(e), sO(e), aO(e);
  const s = n.const("_errs", oe.default.errors);
  Ag(e, s), n.var(t, (0, re._)`${s} === ${oe.default.errors}`);
}
function Og(e) {
  (0, Ir.checkUnknownRules)(e), nO(e);
}
function Ag(e, t) {
  if (e.opts.jtd)
    return fp(e, [], !1, t);
  const r = (0, lp.getSchemaTypes)(e.schema), n = (0, lp.coerceAndCheckDataType)(e, r);
  fp(e, r, !n, t);
}
function nO(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ir.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function iO(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ir.checkStrictMode)(e, "default is ignored in the schema root");
}
function sO(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, YR.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function aO(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ig({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, re._)`${oe.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const a = (0, re.str)`${n}/$comment`, o = e.scopeValue("root", { ref: t.root });
    e.code((0, re._)`${oe.default.self}.opts.$comment(${s}, ${a}, ${o}.schema)`);
  }
}
function oO(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, re._)`${oe.default.errors} === 0`, () => t.return(oe.default.data), () => t.throw((0, re._)`new ${i}(${oe.default.vErrors})`)) : (t.assign((0, re._)`${n}.errors`, oe.default.vErrors), s.unevaluated && cO(e), t.return((0, re._)`${oe.default.errors} === 0`));
}
function cO({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof re.Name && e.assign((0, re._)`${t}.props`, r), n instanceof re.Name && e.assign((0, re._)`${t}.items`, n);
}
function fp(e, t, r, n) {
  const { gen: i, schema: s, data: a, allErrors: o, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Ir.schemaHasRulesButRef)(s, l))) {
    i.block(() => kg(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || lO(e, t), i.block(() => {
    for (const p of l.rules)
      f(p);
    f(l.post);
  });
  function f(p) {
    (0, Lf.shouldUseGroup)(s, p) && (p.type ? (i.if((0, No.checkDataType)(p.type, a, c.strictNumbers)), dp(e, p), t.length === 1 && t[0] === p.type && r && (i.else(), (0, No.reportTypeError)(e)), i.endIf()) : dp(e, p), o || i.if((0, re._)`${oe.default.errors} === ${n || 0}`));
  }
}
function dp(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, WR.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, Lf.shouldUseRule)(n, s) && kg(e, s.keyword, s.definition, t.type);
  });
}
function lO(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (uO(e, t), e.opts.allowUnionTypes || fO(e, t), dO(e, e.dataTypes));
}
function uO(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Cg(e.dataTypes, r) || jf(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), pO(e, t);
  }
}
function fO(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && jf(e, "use allowUnionTypes to allow union type keyword");
}
function dO(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, Lf.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((a) => hO(t, a)) && jf(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function hO(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Cg(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function pO(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Cg(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function jf(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ir.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Dg {
  constructor(t, r, n) {
    if ((0, bs.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ir.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Fg(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, bs.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", oe.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, re.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, re.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, re._)`${r} !== undefined && (${(0, re.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? os.reportExtraError : os.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, os.reportError)(this, this.def.$dataError || os.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, os.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = re.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = re.nil, r = re.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: a } = this;
    n.if((0, re.or)((0, re._)`${i} === undefined`, r)), t !== re.nil && n.assign(t, !0), (s.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== re.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, re.or)(a(), o());
    function a() {
      if (n.length) {
        if (!(r instanceof re.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, re._)`${(0, No.checkDataTypes)(c, r, s.opts.strictNumbers, No.DataType.Wrong)}`;
      }
      return re.nil;
    }
    function o() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, re._)`!${c}(${r})`;
      }
      return re.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Wc.getSubschema)(this.it, t);
    (0, Wc.extendSubschemaData)(n, this.it, t), (0, Wc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return tO(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ir.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ir.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, re.Name)), !0;
  }
}
nr.KeywordCxt = Dg;
function kg(e, t, r, n) {
  const i = new Dg(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, bs.funcKeywordCode)(i, r) : "macro" in r ? (0, bs.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, bs.funcKeywordCode)(i, r);
}
const mO = /^\/(?:[^~]|~0|~1)*$/, yO = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Fg(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return oe.default.rootData;
  if (e[0] === "/") {
    if (!mO.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = oe.default.rootData;
  } else {
    const u = yO.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let a = s;
  const o = i.split("/");
  for (const u of o)
    u && (s = (0, re._)`${s}${(0, re.getProperty)((0, Ir.unescapeJsonPointer)(u))}`, a = (0, re._)`${a} && ${s}`);
  return a;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
nr.getData = Fg;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
class gO extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
ra.default = gO;
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
const Yc = et;
class $O extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Yc.resolveUrl)(t, r, n), this.missingSchema = (0, Yc.normalizeId)((0, Yc.getFullPath)(t, this.missingRef));
  }
}
Gi.default = $O;
var It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.resolveSchema = It.getCompilingSchema = It.resolveRef = It.compileSchema = It.SchemaEnv = void 0;
const Wt = me, vO = ra, Pn = vr, tr = et, hp = J, _O = nr;
class tc {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tr.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
It.SchemaEnv = tc;
function Uf(e) {
  const t = Lg.call(this, e);
  if (t)
    return t;
  const r = (0, tr.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, a = new Wt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let o;
  e.$async && (o = a.scopeValue("Error", {
    ref: vO.default,
    code: (0, Wt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Pn.default.data,
    parentData: Pn.default.parentData,
    parentDataProperty: Pn.default.parentDataProperty,
    dataNames: [Pn.default.data],
    dataPathArr: [Wt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Wt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: o,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Wt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Wt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, _O.validateFunctionCode)(u), a.optimize(this.opts.code.optimize);
    const f = a.toString();
    l = `${a.scopeRefs(Pn.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const h = new Function(`${Pn.default.self}`, `${Pn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: h }), h.errors = null, h.schema = e.schema, h.schemaEnv = e, e.$async && (h.$async = !0), this.opts.code.source === !0 && (h.source = { validateName: c, validateCode: f, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: $, items: y } = u;
      h.evaluated = {
        props: $ instanceof Wt.Name ? void 0 : $,
        items: y instanceof Wt.Name ? void 0 : y,
        dynamicProps: $ instanceof Wt.Name,
        dynamicItems: y instanceof Wt.Name
      }, h.source && (h.source.evaluated = (0, Wt.stringify)(h.evaluated));
    }
    return e.validate = h, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
It.compileSchema = Uf;
function EO(e, t, r) {
  var n;
  r = (0, tr.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = bO.call(this, e, r);
  if (s === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: o } = this.opts;
    a && (s = new tc({ schema: a, schemaId: o, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = wO.call(this, s);
}
It.resolveRef = EO;
function wO(e) {
  return (0, tr.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Uf.call(this, e);
}
function Lg(e) {
  for (const t of this._compilations)
    if (SO(t, e))
      return t;
}
It.getCompilingSchema = Lg;
function SO(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function bO(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || rc.call(this, e, t);
}
function rc(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, tr._getFullPath)(this.opts.uriResolver, r);
  let i = (0, tr.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Xc.call(this, r, e);
  const s = (0, tr.normalizeId)(n), a = this.refs[s] || this.schemas[s];
  if (typeof a == "string") {
    const o = rc.call(this, e, a);
    return typeof (o == null ? void 0 : o.schema) != "object" ? void 0 : Xc.call(this, r, o);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Uf.call(this, a), s === (0, tr.normalizeId)(t)) {
      const { schema: o } = a, { schemaId: c } = this.opts, u = o[c];
      return u && (i = (0, tr.resolveUrl)(this.opts.uriResolver, i, u)), new tc({ schema: o, schemaId: c, root: e, baseId: i });
    }
    return Xc.call(this, r, a);
  }
}
It.resolveSchema = rc;
const PO = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Xc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const o of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, hp.unescapeFragment)(o)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !PO.has(o) && u && (t = (0, tr.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, hp.schemaHasRulesButRef)(r, this.RULES)) {
    const o = (0, tr.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = rc.call(this, n, o);
  }
  const { schemaId: a } = this.opts;
  if (s = s || new tc({ schema: r, schemaId: a, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const TO = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", NO = "Meta-schema for $data reference (JSON AnySchema extension proposal)", RO = "object", OO = [
  "$data"
], AO = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, IO = !1, CO = {
  $id: TO,
  description: NO,
  type: RO,
  required: OO,
  properties: AO,
  additionalProperties: IO
};
var Mf = {};
Object.defineProperty(Mf, "__esModule", { value: !0 });
const jg = z0;
jg.code = 'require("ajv/dist/runtime/uri").default';
Mf.default = jg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = nr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = me;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = ra, i = Gi, s = zn, a = It, o = me, c = et, u = Ge, l = J, f = CO, p = Mf, h = (O, w) => new RegExp(O, w);
  h.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function N(O) {
    var w, P, b, d, g, R, q, B, ee, X, ce, S, _, M, k, ye, Ee, we, Ae, Ie, Ve, Se, qe, Gt, jt;
    const Ye = O.strict, dt = (w = O.code) === null || w === void 0 ? void 0 : w.optimize, Er = dt === !0 || dt === void 0 ? 1 : dt || 0, Lr = (b = (P = O.code) === null || P === void 0 ? void 0 : P.regExp) !== null && b !== void 0 ? b : h, Tt = (d = O.uriResolver) !== null && d !== void 0 ? d : p.default;
    return {
      strictSchema: (R = (g = O.strictSchema) !== null && g !== void 0 ? g : Ye) !== null && R !== void 0 ? R : !0,
      strictNumbers: (B = (q = O.strictNumbers) !== null && q !== void 0 ? q : Ye) !== null && B !== void 0 ? B : !0,
      strictTypes: (X = (ee = O.strictTypes) !== null && ee !== void 0 ? ee : Ye) !== null && X !== void 0 ? X : "log",
      strictTuples: (S = (ce = O.strictTuples) !== null && ce !== void 0 ? ce : Ye) !== null && S !== void 0 ? S : "log",
      strictRequired: (M = (_ = O.strictRequired) !== null && _ !== void 0 ? _ : Ye) !== null && M !== void 0 ? M : !1,
      code: O.code ? { ...O.code, optimize: Er, regExp: Lr } : { optimize: Er, regExp: Lr },
      loopRequired: (k = O.loopRequired) !== null && k !== void 0 ? k : E,
      loopEnum: (ye = O.loopEnum) !== null && ye !== void 0 ? ye : E,
      meta: (Ee = O.meta) !== null && Ee !== void 0 ? Ee : !0,
      messages: (we = O.messages) !== null && we !== void 0 ? we : !0,
      inlineRefs: (Ae = O.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (Ie = O.schemaId) !== null && Ie !== void 0 ? Ie : "$id",
      addUsedSchema: (Ve = O.addUsedSchema) !== null && Ve !== void 0 ? Ve : !0,
      validateSchema: (Se = O.validateSchema) !== null && Se !== void 0 ? Se : !0,
      validateFormats: (qe = O.validateFormats) !== null && qe !== void 0 ? qe : !0,
      unicodeRegExp: (Gt = O.unicodeRegExp) !== null && Gt !== void 0 ? Gt : !0,
      int32range: (jt = O.int32range) !== null && jt !== void 0 ? jt : !0,
      uriResolver: Tt
    };
  }
  class D {
    constructor(w = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), w = this.opts = { ...w, ...N(w) };
      const { es5: P, lines: b } = this.opts.code;
      this.scope = new o.ValueScope({ scope: {}, prefixes: y, es5: P, lines: b }), this.logger = K(w.logger);
      const d = w.validateFormats;
      w.validateFormats = !1, this.RULES = (0, s.getRules)(), j.call(this, v, w, "NOT SUPPORTED"), j.call(this, m, w, "DEPRECATED", "warn"), this._metaOpts = A.call(this), w.formats && se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), w.keywords && W.call(this, w.keywords), typeof w.meta == "object" && this.addMetaSchema(w.meta), Q.call(this), w.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: w, meta: P, schemaId: b } = this.opts;
      let d = f;
      b === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), P && w && this.addMetaSchema(d, d[b], !1);
    }
    defaultMeta() {
      const { meta: w, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof w == "object" ? w[P] || w : void 0;
    }
    validate(w, P) {
      let b;
      if (typeof w == "string") {
        if (b = this.getSchema(w), !b)
          throw new Error(`no schema with key or ref "${w}"`);
      } else
        b = this.compile(w);
      const d = b(P);
      return "$async" in b || (this.errors = b.errors), d;
    }
    compile(w, P) {
      const b = this._addSchema(w, P);
      return b.validate || this._compileSchemaEnv(b);
    }
    compileAsync(w, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: b } = this.opts;
      return d.call(this, w, P);
      async function d(X, ce) {
        await g.call(this, X.$schema);
        const S = this._addSchema(X, ce);
        return S.validate || R.call(this, S);
      }
      async function g(X) {
        X && !this.getSchema(X) && await d.call(this, { $ref: X }, !0);
      }
      async function R(X) {
        try {
          return this._compileSchemaEnv(X);
        } catch (ce) {
          if (!(ce instanceof i.default))
            throw ce;
          return q.call(this, ce), await B.call(this, ce.missingSchema), R.call(this, X);
        }
      }
      function q({ missingSchema: X, missingRef: ce }) {
        if (this.refs[X])
          throw new Error(`AnySchema ${X} is loaded but ${ce} cannot be resolved`);
      }
      async function B(X) {
        const ce = await ee.call(this, X);
        this.refs[X] || await g.call(this, ce.$schema), this.refs[X] || this.addSchema(ce, X, P);
      }
      async function ee(X) {
        const ce = this._loading[X];
        if (ce)
          return ce;
        try {
          return await (this._loading[X] = b(X));
        } finally {
          delete this._loading[X];
        }
      }
    }
    // Adds schema to the instance
    addSchema(w, P, b, d = this.opts.validateSchema) {
      if (Array.isArray(w)) {
        for (const R of w)
          this.addSchema(R, void 0, b, d);
        return this;
      }
      let g;
      if (typeof w == "object") {
        const { schemaId: R } = this.opts;
        if (g = w[R], g !== void 0 && typeof g != "string")
          throw new Error(`schema ${R} must be string`);
      }
      return P = (0, c.normalizeId)(P || g), this._checkUnique(P), this.schemas[P] = this._addSchema(w, b, P, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(w, P, b = this.opts.validateSchema) {
      return this.addSchema(w, P, !0, b), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(w, P) {
      if (typeof w == "boolean")
        return !0;
      let b;
      if (b = w.$schema, b !== void 0 && typeof b != "string")
        throw new Error("$schema must be a string");
      if (b = b || this.opts.defaultMeta || this.defaultMeta(), !b)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(b, w);
      if (!d && P) {
        const g = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(g);
        else
          throw new Error(g);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(w) {
      let P;
      for (; typeof (P = z.call(this, w)) == "string"; )
        w = P;
      if (P === void 0) {
        const { schemaId: b } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: b });
        if (P = a.resolveSchema.call(this, d, w), !P)
          return;
        this.refs[w] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(w) {
      if (w instanceof RegExp)
        return this._removeAllSchemas(this.schemas, w), this._removeAllSchemas(this.refs, w), this;
      switch (typeof w) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = z.call(this, w);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[w], delete this.refs[w], this;
        }
        case "object": {
          const P = w;
          this._cache.delete(P);
          let b = w[this.opts.schemaId];
          return b && (b = (0, c.normalizeId)(b), delete this.schemas[b], delete this.refs[b]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(w) {
      for (const P of w)
        this.addKeyword(P);
      return this;
    }
    addKeyword(w, P) {
      let b;
      if (typeof w == "string")
        b = w, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = b);
      else if (typeof w == "object" && P === void 0) {
        if (P = w, b = P.keyword, Array.isArray(b) && !b.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (C.call(this, b, P), !P)
        return (0, l.eachItem)(b, (g) => I.call(this, g)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, u.getJSONTypes)(P.type),
        schemaType: (0, u.getJSONTypes)(P.schemaType)
      };
      return (0, l.eachItem)(b, d.type.length === 0 ? (g) => I.call(this, g, d) : (g) => d.type.forEach((R) => I.call(this, g, d, R))), this;
    }
    getKeyword(w) {
      const P = this.RULES.all[w];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(w) {
      const { RULES: P } = this;
      delete P.keywords[w], delete P.all[w];
      for (const b of P.rules) {
        const d = b.rules.findIndex((g) => g.keyword === w);
        d >= 0 && b.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(w, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[w] = P, this;
    }
    errorsText(w = this.errors, { separator: P = ", ", dataVar: b = "data" } = {}) {
      return !w || w.length === 0 ? "No errors" : w.map((d) => `${b}${d.instancePath} ${d.message}`).reduce((d, g) => d + P + g);
    }
    $dataMetaSchema(w, P) {
      const b = this.RULES.all;
      w = JSON.parse(JSON.stringify(w));
      for (const d of P) {
        const g = d.split("/").slice(1);
        let R = w;
        for (const q of g)
          R = R[q];
        for (const q in b) {
          const B = b[q];
          if (typeof B != "object")
            continue;
          const { $data: ee } = B.definition, X = R[q];
          ee && X && (R[q] = U(X));
        }
      }
      return w;
    }
    _removeAllSchemas(w, P) {
      for (const b in w) {
        const d = w[b];
        (!P || P.test(b)) && (typeof d == "string" ? delete w[b] : d && !d.meta && (this._cache.delete(d.schema), delete w[b]));
      }
    }
    _addSchema(w, P, b, d = this.opts.validateSchema, g = this.opts.addUsedSchema) {
      let R;
      const { schemaId: q } = this.opts;
      if (typeof w == "object")
        R = w[q];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof w != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let B = this._cache.get(w);
      if (B !== void 0)
        return B;
      b = (0, c.normalizeId)(R || b);
      const ee = c.getSchemaRefs.call(this, w, b);
      return B = new a.SchemaEnv({ schema: w, schemaId: q, meta: P, baseId: b, localRefs: ee }), this._cache.set(B.schema, B), g && !b.startsWith("#") && (b && this._checkUnique(b), this.refs[b] = B), d && this.validateSchema(w, !0), B;
    }
    _checkUnique(w) {
      if (this.schemas[w] || this.refs[w])
        throw new Error(`schema with key or id "${w}" already exists`);
    }
    _compileSchemaEnv(w) {
      if (w.meta ? this._compileMetaSchema(w) : a.compileSchema.call(this, w), !w.validate)
        throw new Error("ajv implementation error");
      return w.validate;
    }
    _compileMetaSchema(w) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, w);
      } finally {
        this.opts = P;
      }
    }
  }
  D.ValidationError = n.default, D.MissingRefError = i.default, e.default = D;
  function j(O, w, P, b = "error") {
    for (const d in O) {
      const g = d;
      g in w && this.logger[b](`${P}: option ${d}. ${O[g]}`);
    }
  }
  function z(O) {
    return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
  }
  function Q() {
    const O = this.opts.schemas;
    if (O)
      if (Array.isArray(O))
        this.addSchema(O);
      else
        for (const w in O)
          this.addSchema(O[w], w);
  }
  function se() {
    for (const O in this.opts.formats) {
      const w = this.opts.formats[O];
      w && this.addFormat(O, w);
    }
  }
  function W(O) {
    if (Array.isArray(O)) {
      this.addVocabulary(O);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const w in O) {
      const P = O[w];
      P.keyword || (P.keyword = w), this.addKeyword(P);
    }
  }
  function A() {
    const O = { ...this.opts };
    for (const w of $)
      delete O[w];
    return O;
  }
  const H = { log() {
  }, warn() {
  }, error() {
  } };
  function K(O) {
    if (O === !1)
      return H;
    if (O === void 0)
      return console;
    if (O.log && O.warn && O.error)
      return O;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function C(O, w) {
    const { RULES: P } = this;
    if ((0, l.eachItem)(O, (b) => {
      if (P.keywords[b])
        throw new Error(`Keyword ${b} is already defined`);
      if (!ne.test(b))
        throw new Error(`Keyword ${b} has invalid name`);
    }), !!w && w.$data && !("code" in w || "validate" in w))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function I(O, w, P) {
    var b;
    const d = w == null ? void 0 : w.post;
    if (P && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: g } = this;
    let R = d ? g.post : g.rules.find(({ type: B }) => B === P);
    if (R || (R = { type: P, rules: [] }, g.rules.push(R)), g.keywords[O] = !0, !w)
      return;
    const q = {
      keyword: O,
      definition: {
        ...w,
        type: (0, u.getJSONTypes)(w.type),
        schemaType: (0, u.getJSONTypes)(w.schemaType)
      }
    };
    w.before ? x.call(this, R, q, w.before) : R.rules.push(q), g.all[O] = q, (b = w.implements) === null || b === void 0 || b.forEach((B) => this.addKeyword(B));
  }
  function x(O, w, P) {
    const b = O.rules.findIndex((d) => d.keyword === P);
    b >= 0 ? O.rules.splice(b, 0, w) : (O.rules.push(w), this.logger.warn(`rule ${P} is not defined`));
  }
  function L(O) {
    let { metaSchema: w } = O;
    w !== void 0 && (O.$data && this.opts.$data && (w = U(w)), O.validateSchema = this.compile(w, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function U(O) {
    return { anyOf: [O, V] };
  }
})(sg);
var xf = {}, Vf = {}, qf = {};
Object.defineProperty(qf, "__esModule", { value: !0 });
const DO = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
qf.default = DO;
var Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.callRef = Kn.getValidate = void 0;
const kO = Gi, pp = $e, At = me, ni = vr, mp = It, Ia = J, FO = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: a, opts: o, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return f();
    const l = mp.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new kO.default(n.opts.uriResolver, i, r);
    if (l instanceof mp.SchemaEnv)
      return p(l);
    return h(l);
    function f() {
      if (s === u)
        return po(e, a, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return po(e, (0, At._)`${$}.validate`, u, u.$async);
    }
    function p($) {
      const y = Ug(e, $);
      po(e, y, $, $.$async);
    }
    function h($) {
      const y = t.scopeValue("schema", o.code.source === !0 ? { ref: $, code: (0, At.stringify)($) } : { ref: $ }), v = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: At.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function Ug(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, At._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Kn.getValidate = Ug;
function po(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: a, schemaEnv: o, opts: c } = s, u = c.passContext ? ni.default.this : At.nil;
  n ? l() : f();
  function l() {
    if (!o.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, At._)`await ${(0, pp.callValidateCode)(e, t, u)}`), h(t), a || i.assign($, !0);
    }, (y) => {
      i.if((0, At._)`!(${y} instanceof ${s.ValidationError})`, () => i.throw(y)), p(y), a || i.assign($, !1);
    }), e.ok($);
  }
  function f() {
    e.result((0, pp.callValidateCode)(e, t, u), () => h(t), () => p(t));
  }
  function p($) {
    const y = (0, At._)`${$}.errors`;
    i.assign(ni.default.vErrors, (0, At._)`${ni.default.vErrors} === null ? ${y} : ${ni.default.vErrors}.concat(${y})`), i.assign(ni.default.errors, (0, At._)`${ni.default.vErrors}.length`);
  }
  function h($) {
    var y;
    if (!s.opts.unevaluated)
      return;
    const v = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = Ia.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, At._)`${$}.evaluated.props`);
        s.props = Ia.mergeEvaluated.props(i, m, s.props, At.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = Ia.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, At._)`${$}.evaluated.items`);
        s.items = Ia.mergeEvaluated.items(i, m, s.items, At.Name);
      }
  }
}
Kn.callRef = po;
Kn.default = FO;
Object.defineProperty(Vf, "__esModule", { value: !0 });
const LO = qf, jO = Kn, UO = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  LO.default,
  jO.default
];
Vf.default = UO;
var Bf = {}, Gf = {};
Object.defineProperty(Gf, "__esModule", { value: !0 });
const Ro = me, Kr = Ro.operators, Oo = {
  maximum: { okStr: "<=", ok: Kr.LTE, fail: Kr.GT },
  minimum: { okStr: ">=", ok: Kr.GTE, fail: Kr.LT },
  exclusiveMaximum: { okStr: "<", ok: Kr.LT, fail: Kr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Kr.GT, fail: Kr.LTE }
}, MO = {
  message: ({ keyword: e, schemaCode: t }) => (0, Ro.str)`must be ${Oo[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Ro._)`{comparison: ${Oo[e].okStr}, limit: ${t}}`
}, xO = {
  keyword: Object.keys(Oo),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: MO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Ro._)`${r} ${Oo[t].fail} ${n} || isNaN(${r})`);
  }
};
Gf.default = xO;
var Hf = {};
Object.defineProperty(Hf, "__esModule", { value: !0 });
const Ps = me, VO = {
  message: ({ schemaCode: e }) => (0, Ps.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Ps._)`{multipleOf: ${e}}`
}, qO = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: VO,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, a = t.let("res"), o = s ? (0, Ps._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}` : (0, Ps._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Ps._)`(${n} === 0 || (${a} = ${r}/${n}, ${o}))`);
  }
};
Hf.default = qO;
var zf = {}, Kf = {};
Object.defineProperty(Kf, "__esModule", { value: !0 });
function Mg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Kf.default = Mg;
Mg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(zf, "__esModule", { value: !0 });
const kn = me, BO = J, GO = Kf, HO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, kn.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, kn._)`{limit: ${e}}`
}, zO = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: HO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? kn.operators.GT : kn.operators.LT, a = i.opts.unicode === !1 ? (0, kn._)`${r}.length` : (0, kn._)`${(0, BO.useFunc)(e.gen, GO.default)}(${r})`;
    e.fail$data((0, kn._)`${a} ${s} ${n}`);
  }
};
zf.default = zO;
var Wf = {};
Object.defineProperty(Wf, "__esModule", { value: !0 });
const KO = $e, WO = J, $i = me, YO = {
  message: ({ schemaCode: e }) => (0, $i.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, $i._)`{pattern: ${e}}`
}, XO = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: YO,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = a.opts.code, u = c.code === "new RegExp" ? (0, $i._)`new RegExp` : (0, WO.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, $i._)`${u}(${s}, ${o}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, $i._)`!${l}`);
    } else {
      const c = (0, KO.usePattern)(e, i);
      e.fail$data((0, $i._)`!${c}.test(${r})`);
    }
  }
};
Wf.default = XO;
var Yf = {};
Object.defineProperty(Yf, "__esModule", { value: !0 });
const Ts = me, JO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Ts.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ts._)`{limit: ${e}}`
}, QO = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: JO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? Ts.operators.GT : Ts.operators.LT;
    e.fail$data((0, Ts._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Yf.default = QO;
var Xf = {};
Object.defineProperty(Xf, "__esModule", { value: !0 });
const cs = $e, Ns = me, ZO = J, eA = {
  message: ({ params: { missingProperty: e } }) => (0, Ns.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Ns._)`{missingProperty: ${e}}`
}, tA = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: eA,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: a } = e, { opts: o } = a;
    if (!s && r.length === 0)
      return;
    const c = r.length >= o.loopRequired;
    if (a.allErrors ? u() : l(), o.strictRequired) {
      const h = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const y of r)
        if ((h == null ? void 0 : h[y]) === void 0 && !$.has(y)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${y}" is not defined at "${v}" (strictRequired)`;
          (0, ZO.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(Ns.nil, f);
      else
        for (const h of r)
          (0, cs.checkReportMissingProp)(e, h);
    }
    function l() {
      const h = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => p(h, $)), e.ok($);
      } else
        t.if((0, cs.checkMissingProp)(e, r, h)), (0, cs.reportMissingProp)(e, h), t.else();
    }
    function f() {
      t.forOf("prop", n, (h) => {
        e.setParams({ missingProperty: h }), t.if((0, cs.noPropertyInData)(t, i, h, o.ownProperties), () => e.error());
      });
    }
    function p(h, $) {
      e.setParams({ missingProperty: h }), t.forOf(h, n, () => {
        t.assign($, (0, cs.propertyInData)(t, i, h, o.ownProperties)), t.if((0, Ns.not)($), () => {
          e.error(), t.break();
        });
      }, Ns.nil);
    }
  }
};
Xf.default = tA;
var Jf = {};
Object.defineProperty(Jf, "__esModule", { value: !0 });
const Rs = me, rA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Rs.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Rs._)`{limit: ${e}}`
}, nA = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: rA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? Rs.operators.GT : Rs.operators.LT;
    e.fail$data((0, Rs._)`${r}.length ${i} ${n}`);
  }
};
Jf.default = nA;
var Qf = {}, na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const xg = Ko;
xg.code = 'require("ajv/dist/runtime/equal").default';
na.default = xg;
Object.defineProperty(Qf, "__esModule", { value: !0 });
const Jc = Ge, Qe = me, iA = J, sA = na, aA = {
  message: ({ params: { i: e, j: t } }) => (0, Qe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Qe._)`{i: ${e}, j: ${t}}`
}, oA = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: aA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: a, it: o } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, Jc.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, Qe._)`${a} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, Qe._)`${r}.length`), y = t.let("j");
      e.setParams({ i: $, j: y }), t.assign(c, !0), t.if((0, Qe._)`${$} > 1`, () => (f() ? p : h)($, y));
    }
    function f() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function p($, y) {
      const v = t.name("item"), m = (0, Jc.checkDataTypes)(u, v, o.opts.strictNumbers, Jc.DataType.Wrong), E = t.const("indices", (0, Qe._)`{}`);
      t.for((0, Qe._)`;${$}--;`, () => {
        t.let(v, (0, Qe._)`${r}[${$}]`), t.if(m, (0, Qe._)`continue`), u.length > 1 && t.if((0, Qe._)`typeof ${v} == "string"`, (0, Qe._)`${v} += "_"`), t.if((0, Qe._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(y, (0, Qe._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Qe._)`${E}[${v}] = ${$}`);
      });
    }
    function h($, y) {
      const v = (0, iA.useFunc)(t, sA.default), m = t.name("outer");
      t.label(m).for((0, Qe._)`;${$}--;`, () => t.for((0, Qe._)`${y} = ${$}; ${y}--;`, () => t.if((0, Qe._)`${v}(${r}[${$}], ${r}[${y}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Qf.default = oA;
var Zf = {};
Object.defineProperty(Zf, "__esModule", { value: !0 });
const nu = me, cA = J, lA = na, uA = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, nu._)`{allowedValue: ${e}}`
}, fA = {
  keyword: "const",
  $data: !0,
  error: uA,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, nu._)`!${(0, cA.useFunc)(t, lA.default)}(${r}, ${i})`) : e.fail((0, nu._)`${s} !== ${r}`);
  }
};
Zf.default = fA;
var ed = {};
Object.defineProperty(ed, "__esModule", { value: !0 });
const ys = me, dA = J, hA = na, pA = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, ys._)`{allowedValues: ${e}}`
}, mA = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: pA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const o = i.length >= a.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, dA.useFunc)(t, hA.default));
    let l;
    if (o || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const h = t.const("vSchema", s);
      l = (0, ys.or)(...i.map(($, y) => p(h, y)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", s, (h) => t.if((0, ys._)`${u()}(${r}, ${h})`, () => t.assign(l, !0).break()));
    }
    function p(h, $) {
      const y = i[$];
      return typeof y == "object" && y !== null ? (0, ys._)`${u()}(${r}, ${h}[${$}])` : (0, ys._)`${r} === ${y}`;
    }
  }
};
ed.default = mA;
Object.defineProperty(Bf, "__esModule", { value: !0 });
const yA = Gf, gA = Hf, $A = zf, vA = Wf, _A = Yf, EA = Xf, wA = Jf, SA = Qf, bA = Zf, PA = ed, TA = [
  // number
  yA.default,
  gA.default,
  // string
  $A.default,
  vA.default,
  // object
  _A.default,
  EA.default,
  // array
  wA.default,
  SA.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  bA.default,
  PA.default
];
Bf.default = TA;
var td = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.validateAdditionalItems = void 0;
const Fn = me, iu = J, NA = {
  message: ({ params: { len: e } }) => (0, Fn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Fn._)`{limit: ${e}}`
}, RA = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: NA,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, iu.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Vg(e, n);
  }
};
function Vg(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: a } = e;
  a.items = !0;
  const o = r.const("len", (0, Fn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Fn._)`${o} <= ${t.length}`);
  else if (typeof n == "object" && !(0, iu.alwaysValidSchema)(a, n)) {
    const u = r.var("valid", (0, Fn._)`${o} <= ${t.length}`);
    r.if((0, Fn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, o, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: iu.Type.Num }, u), a.allErrors || r.if((0, Fn.not)(u), () => r.break());
    });
  }
}
Hi.validateAdditionalItems = Vg;
Hi.default = RA;
var rd = {}, zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.validateTuple = void 0;
const yp = me, mo = J, OA = $e, AA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return qg(e, "additionalItems", t);
    r.items = !0, !(0, mo.alwaysValidSchema)(r, t) && e.ok((0, OA.validateArray)(e));
  }
};
function qg(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: a, it: o } = e;
  l(i), o.opts.unevaluated && r.length && o.items !== !0 && (o.items = mo.mergeEvaluated.items(n, r.length, o.items));
  const c = n.name("valid"), u = n.const("len", (0, yp._)`${s}.length`);
  r.forEach((f, p) => {
    (0, mo.alwaysValidSchema)(o, f) || (n.if((0, yp._)`${u} > ${p}`, () => e.subschema({
      keyword: a,
      schemaProp: p,
      dataProp: p
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: p, errSchemaPath: h } = o, $ = r.length, y = $ === f.minItems && ($ === f.maxItems || f[t] === !1);
    if (p.strictTuples && !y) {
      const v = `"${a}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${h}"`;
      (0, mo.checkStrictMode)(o, v, p.strictTuples);
    }
  }
}
zi.validateTuple = qg;
zi.default = AA;
Object.defineProperty(rd, "__esModule", { value: !0 });
const IA = zi, CA = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, IA.validateTuple)(e, "items")
};
rd.default = CA;
var nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
const gp = me, DA = J, kA = $e, FA = Hi, LA = {
  message: ({ params: { len: e } }) => (0, gp.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, gp._)`{limit: ${e}}`
}, jA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: LA,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, DA.alwaysValidSchema)(n, t) && (i ? (0, FA.validateAdditionalItems)(e, i) : e.ok((0, kA.validateArray)(e)));
  }
};
nd.default = jA;
var id = {};
Object.defineProperty(id, "__esModule", { value: !0 });
const Bt = me, Ca = J, UA = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Bt.str)`must contain at least ${e} valid item(s)` : (0, Bt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Bt._)`{minContains: ${e}}` : (0, Bt._)`{minContains: ${e}, maxContains: ${t}}`
}, MA = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: UA,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let a, o;
    const { minContains: c, maxContains: u } = n;
    s.opts.next ? (a = c === void 0 ? 1 : c, o = u) : a = 1;
    const l = t.const("len", (0, Bt._)`${i}.length`);
    if (e.setParams({ min: a, max: o }), o === void 0 && a === 0) {
      (0, Ca.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (o !== void 0 && a > o) {
      (0, Ca.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Ca.alwaysValidSchema)(s, r)) {
      let y = (0, Bt._)`${l} >= ${a}`;
      o !== void 0 && (y = (0, Bt._)`${y} && ${l} <= ${o}`), e.pass(y);
      return;
    }
    s.items = !0;
    const f = t.name("valid");
    o === void 0 && a === 1 ? h(f, () => t.if(f, () => t.break())) : a === 0 ? (t.let(f, !0), o !== void 0 && t.if((0, Bt._)`${i}.length > 0`, p)) : (t.let(f, !1), p()), e.result(f, () => e.reset());
    function p() {
      const y = t.name("_valid"), v = t.let("count", 0);
      h(y, () => t.if(y, () => $(v)));
    }
    function h(y, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Ca.Type.Num,
          compositeRule: !0
        }, y), v();
      });
    }
    function $(y) {
      t.code((0, Bt._)`${y}++`), o === void 0 ? t.if((0, Bt._)`${y} >= ${a}`, () => t.assign(f, !0).break()) : (t.if((0, Bt._)`${y} > ${o}`, () => t.assign(f, !1).break()), a === 1 ? t.assign(f, !0) : t.if((0, Bt._)`${y} >= ${a}`, () => t.assign(f, !0)));
    }
  }
};
id.default = MA;
var Bg = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = me, r = J, n = $e;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = s(c);
      a(c, u), o(c, l);
    }
  };
  function s({ schema: c }) {
    const u = {}, l = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const p = Array.isArray(c[f]) ? u : l;
      p[f] = c[f];
    }
    return [u, l];
  }
  function a(c, u = c.schema) {
    const { gen: l, data: f, it: p } = c;
    if (Object.keys(u).length === 0)
      return;
    const h = l.let("missing");
    for (const $ in u) {
      const y = u[$];
      if (y.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, $, p.opts.ownProperties);
      c.setParams({
        property: $,
        depsCount: y.length,
        deps: y.join(", ")
      }), p.allErrors ? l.if(v, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, y, h)})`), (0, n.reportMissingProp)(c, h), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function o(c, u = c.schema) {
    const { gen: l, data: f, keyword: p, it: h } = c, $ = l.name("valid");
    for (const y in u)
      (0, r.alwaysValidSchema)(h, u[y]) || (l.if(
        (0, n.propertyInData)(l, f, y, h.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: p, schemaProp: y }, $);
          c.mergeValidEvaluated(v, $);
        },
        () => l.var($, !0)
        // TODO var
      ), c.ok($));
  }
  e.validateSchemaDeps = o, e.default = i;
})(Bg);
var sd = {};
Object.defineProperty(sd, "__esModule", { value: !0 });
const Gg = me, xA = J, VA = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Gg._)`{propertyName: ${e.propertyName}}`
}, qA = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: VA,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, xA.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, s), t.if((0, Gg.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
sd.default = qA;
var nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
const Da = $e, Qt = me, BA = vr, ka = J, GA = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Qt._)`{additionalProperty: ${e.additionalProperty}}`
}, HA = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: GA,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, ka.alwaysValidSchema)(a, r))
      return;
    const u = (0, Da.allSchemaProperties)(n.properties), l = (0, Da.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Qt._)`${s} === ${BA.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? $(v) : t.if(p(v), () => $(v));
      });
    }
    function p(v) {
      let m;
      if (u.length > 8) {
        const E = (0, ka.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Da.isOwnProperty)(t, E, v);
      } else u.length ? m = (0, Qt.or)(...u.map((E) => (0, Qt._)`${v} === ${E}`)) : m = Qt.nil;
      return l.length && (m = (0, Qt.or)(m, ...l.map((E) => (0, Qt._)`${(0, Da.usePattern)(e, E)}.test(${v})`))), (0, Qt.not)(m);
    }
    function h(v) {
      t.code((0, Qt._)`delete ${i}[${v}]`);
    }
    function $(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        h(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), o || t.break();
        return;
      }
      if (typeof r == "object" && !(0, ka.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (y(v, m, !1), t.if((0, Qt.not)(m), () => {
          e.reset(), h(v);
        })) : (y(v, m), o || t.if((0, Qt.not)(m), () => t.break()));
      }
    }
    function y(v, m, E) {
      const N = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: ka.Type.Str
      };
      E === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
nc.default = HA;
var ad = {};
Object.defineProperty(ad, "__esModule", { value: !0 });
const zA = nr, $p = $e, Qc = J, vp = nc, KA = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && vp.default.code(new zA.KeywordCxt(s, vp.default, "additionalProperties"));
    const a = (0, $p.allSchemaProperties)(r);
    for (const f of a)
      s.definedProperties.add(f);
    s.opts.unevaluated && a.length && s.props !== !0 && (s.props = Qc.mergeEvaluated.props(t, (0, Qc.toHash)(a), s.props));
    const o = a.filter((f) => !(0, Qc.alwaysValidSchema)(s, r[f]));
    if (o.length === 0)
      return;
    const c = t.name("valid");
    for (const f of o)
      u(f) ? l(f) : (t.if((0, $p.propertyInData)(t, i, f, s.opts.ownProperties)), l(f), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
    function u(f) {
      return s.opts.useDefaults && !s.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
ad.default = KA;
var od = {};
Object.defineProperty(od, "__esModule", { value: !0 });
const _p = $e, Fa = me, Ep = J, wp = J, WA = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: a } = s, o = (0, _p.allSchemaProperties)(r), c = o.filter((y) => (0, Ep.alwaysValidSchema)(s, r[y]));
    if (o.length === 0 || c.length === o.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof Fa.Name) && (s.props = (0, wp.evaluatedPropsToName)(t, s.props));
    const { props: f } = s;
    p();
    function p() {
      for (const y of o)
        u && h(y), s.allErrors ? $(y) : (t.var(l, !0), $(y), t.if(l));
    }
    function h(y) {
      for (const v in u)
        new RegExp(y).test(v) && (0, Ep.checkStrictMode)(s, `property ${v} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function $(y) {
      t.forIn("key", n, (v) => {
        t.if((0, Fa._)`${(0, _p.usePattern)(e, y)}.test(${v})`, () => {
          const m = c.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: v,
            dataPropType: wp.Type.Str
          }, l), s.opts.unevaluated && f !== !0 ? t.assign((0, Fa._)`${f}[${v}]`, !0) : !m && !s.allErrors && t.if((0, Fa.not)(l), () => t.break());
        });
      });
    }
  }
};
od.default = WA;
var cd = {};
Object.defineProperty(cd, "__esModule", { value: !0 });
const YA = J, XA = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, YA.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
cd.default = XA;
var ld = {};
Object.defineProperty(ld, "__esModule", { value: !0 });
const JA = $e, QA = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: JA.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ld.default = QA;
var ud = {};
Object.defineProperty(ud, "__esModule", { value: !0 });
const yo = me, ZA = J, eI = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, yo._)`{passingSchemas: ${e.passing}}`
}, tI = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: eI,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, a = t.let("valid", !1), o = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: o }), t.block(u), e.result(a, () => e.reset(), () => e.error(!0));
    function u() {
      s.forEach((l, f) => {
        let p;
        (0, ZA.alwaysValidSchema)(i, l) ? t.var(c, !0) : p = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, yo._)`${c} && ${a}`).assign(a, !1).assign(o, (0, yo._)`[${o}, ${f}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(o, f), p && e.mergeEvaluated(p, yo.Name);
        });
      });
    }
  }
};
ud.default = tI;
var fd = {};
Object.defineProperty(fd, "__esModule", { value: !0 });
const rI = J, nI = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, a) => {
      if ((0, rI.alwaysValidSchema)(n, s))
        return;
      const o = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(o);
    });
  }
};
fd.default = nI;
var dd = {};
Object.defineProperty(dd, "__esModule", { value: !0 });
const Ao = me, Hg = J, iI = {
  message: ({ params: e }) => (0, Ao.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ao._)`{failingKeyword: ${e.ifClause}}`
}, sI = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: iI,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Hg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Sp(n, "then"), s = Sp(n, "else");
    if (!i && !s)
      return;
    const a = t.let("valid", !0), o = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(o, u("then", l), u("else", l));
    } else i ? t.if(o, u("then")) : t.if((0, Ao.not)(o), u("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const p = e.subschema({ keyword: l }, o);
        t.assign(a, o), e.mergeValidEvaluated(p, a), f ? t.assign(f, (0, Ao._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Sp(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Hg.alwaysValidSchema)(e, r);
}
dd.default = sI;
var hd = {};
Object.defineProperty(hd, "__esModule", { value: !0 });
const aI = J, oI = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, aI.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
hd.default = oI;
Object.defineProperty(td, "__esModule", { value: !0 });
const cI = Hi, lI = rd, uI = zi, fI = nd, dI = id, hI = Bg, pI = sd, mI = nc, yI = ad, gI = od, $I = cd, vI = ld, _I = ud, EI = fd, wI = dd, SI = hd;
function bI(e = !1) {
  const t = [
    // any
    $I.default,
    vI.default,
    _I.default,
    EI.default,
    wI.default,
    SI.default,
    // object
    pI.default,
    mI.default,
    hI.default,
    yI.default,
    gI.default
  ];
  return e ? t.push(lI.default, fI.default) : t.push(cI.default, uI.default), t.push(dI.default), t;
}
td.default = bI;
var pd = {}, md = {};
Object.defineProperty(md, "__esModule", { value: !0 });
const Ue = me, PI = {
  message: ({ schemaCode: e }) => (0, Ue.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ue._)`{format: ${e}}`
}, TI = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: PI,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: a, it: o } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = o;
    if (!c.validateFormats)
      return;
    i ? p() : h();
    function p() {
      const $ = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), y = r.const("fDef", (0, Ue._)`${$}[${a}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Ue._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign(v, (0, Ue._)`${y}.type || "string"`).assign(m, (0, Ue._)`${y}.validate`), () => r.assign(v, (0, Ue._)`"string"`).assign(m, y)), e.fail$data((0, Ue.or)(E(), N()));
      function E() {
        return c.strictSchema === !1 ? Ue.nil : (0, Ue._)`${a} && !${m}`;
      }
      function N() {
        const D = l.$async ? (0, Ue._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Ue._)`${m}(${n})`, j = (0, Ue._)`(typeof ${m} == "function" ? ${D} : ${m}.test(${n}))`;
        return (0, Ue._)`${m} && ${m} !== true && ${v} === ${t} && !${j}`;
      }
    }
    function h() {
      const $ = f.formats[s];
      if (!$) {
        E();
        return;
      }
      if ($ === !0)
        return;
      const [y, v, m] = N($);
      y === t && e.pass(D());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${s}" ignored in schema at path "${u}"`;
        }
      }
      function N(j) {
        const z = j instanceof RegExp ? (0, Ue.regexpCode)(j) : c.code.formats ? (0, Ue._)`${c.code.formats}${(0, Ue.getProperty)(s)}` : void 0, Q = r.scopeValue("formats", { key: s, ref: j, code: z });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Ue._)`${Q}.validate`] : ["string", j, Q];
      }
      function D() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Ue._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Ue._)`${m}(${n})` : (0, Ue._)`${m}.test(${n})`;
      }
    }
  }
};
md.default = TI;
Object.defineProperty(pd, "__esModule", { value: !0 });
const NI = md, RI = [NI.default];
pd.default = RI;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.contentVocabulary = ki.metadataVocabulary = void 0;
ki.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
ki.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(xf, "__esModule", { value: !0 });
const OI = Vf, AI = Bf, II = td, CI = pd, bp = ki, DI = [
  OI.default,
  AI.default,
  (0, II.default)(),
  CI.default,
  bp.metadataVocabulary,
  bp.contentVocabulary
];
xf.default = DI;
var yd = {}, ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.DiscrError = void 0;
var Pp;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Pp || (ic.DiscrError = Pp = {}));
Object.defineProperty(yd, "__esModule", { value: !0 });
const di = me, su = ic, Tp = It, kI = Gi, FI = J, LI = {
  message: ({ params: { discrError: e, tagName: t } }) => e === su.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, di._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, jI = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: LI,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: a } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const o = n.propertyName;
    if (typeof o != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, di._)`${r}${(0, di.getProperty)(o)}`);
    t.if((0, di._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: su.DiscrError.Tag, tag: u, tagName: o })), e.ok(c);
    function l() {
      const h = p();
      t.if(!1);
      for (const $ in h)
        t.elseIf((0, di._)`${u} === ${$}`), t.assign(c, f(h[$]));
      t.else(), e.error(!1, { discrError: su.DiscrError.Mapping, tag: u, tagName: o }), t.endIf();
    }
    function f(h) {
      const $ = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: h }, $);
      return e.mergeEvaluated(y, di.Name), $;
    }
    function p() {
      var h;
      const $ = {}, y = m(i);
      let v = !0;
      for (let D = 0; D < a.length; D++) {
        let j = a[D];
        if (j != null && j.$ref && !(0, FI.schemaHasRulesButRef)(j, s.self.RULES)) {
          const Q = j.$ref;
          if (j = Tp.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, Q), j instanceof Tp.SchemaEnv && (j = j.schema), j === void 0)
            throw new kI.default(s.opts.uriResolver, s.baseId, Q);
        }
        const z = (h = j == null ? void 0 : j.properties) === null || h === void 0 ? void 0 : h[o];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${o}"`);
        v = v && (y || m(j)), E(z, D);
      }
      if (!v)
        throw new Error(`discriminator: "${o}" must be required`);
      return $;
      function m({ required: D }) {
        return Array.isArray(D) && D.includes(o);
      }
      function E(D, j) {
        if (D.const)
          N(D.const, j);
        else if (D.enum)
          for (const z of D.enum)
            N(z, j);
        else
          throw new Error(`discriminator: "properties/${o}" must have "const" or "enum"`);
      }
      function N(D, j) {
        if (typeof D != "string" || D in $)
          throw new Error(`discriminator: "${o}" values must be unique strings`);
        $[D] = j;
      }
    }
  }
};
yd.default = jI;
const UI = "http://json-schema.org/draft-07/schema#", MI = "http://json-schema.org/draft-07/schema#", xI = "Core schema meta-schema", VI = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, qI = [
  "object",
  "boolean"
], BI = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, GI = {
  $schema: UI,
  $id: MI,
  title: xI,
  definitions: VI,
  type: qI,
  properties: BI,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = sg, n = xf, i = yd, s = GI, a = ["/properties"], o = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const $ = this.opts.$data ? this.$dataMetaSchema(s, a) : s;
      this.addMetaSchema($, o, !1), this.refs["http://json-schema.org/schema"] = o;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var u = nr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = me;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var f = ra;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var p = Gi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return p.default;
  } });
})(Ql, Ql.exports);
var HI = Ql.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = HI, r = me, n = r.operators, i = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, s = {
    message: ({ keyword: o, schemaCode: c }) => (0, r.str)`should be ${i[o].okStr} ${c}`,
    params: ({ keyword: o, schemaCode: c }) => (0, r._)`{comparison: ${i[o].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(i),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: s,
    code(o) {
      const { gen: c, data: u, schemaCode: l, keyword: f, it: p } = o, { opts: h, self: $ } = p;
      if (!h.validateFormats)
        return;
      const y = new t.KeywordCxt(p, $.RULES.all.format.definition, "format");
      y.$data ? v() : m();
      function v() {
        const N = c.scopeValue("formats", {
          ref: $.formats,
          code: h.code.formats
        }), D = c.const("fmt", (0, r._)`${N}[${y.schemaCode}]`);
        o.fail$data((0, r.or)((0, r._)`typeof ${D} != "object"`, (0, r._)`${D} instanceof RegExp`, (0, r._)`typeof ${D}.compare != "function"`, E(D)));
      }
      function m() {
        const N = y.schema, D = $.formats[N];
        if (!D || D === !0)
          return;
        if (typeof D != "object" || D instanceof RegExp || typeof D.compare != "function")
          throw new Error(`"${f}": format "${N}" does not define "compare" function`);
        const j = c.scopeValue("formats", {
          key: N,
          ref: D,
          code: h.code.formats ? (0, r._)`${h.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        o.fail$data(E(j));
      }
      function E(N) {
        return (0, r._)`${N}.compare(${u}, ${l}) ${i[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (o) => (o.addKeyword(e.formatLimitDefinition), o);
  e.default = a;
})(ig);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = ng, n = ig, i = me, s = new i.Name("fullFormats"), a = new i.Name("fastFormats"), o = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(u, l, r.fullFormats, s), u;
    const [f, p] = l.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, s], h = l.formats || r.formatNames;
    return c(u, h, f, p), l.keywords && (0, n.default)(u), u;
  };
  o.get = (u, l = "full") => {
    const p = (l === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!p)
      throw new Error(`Unknown format "${u}"`);
    return p;
  };
  function c(u, l, f, p) {
    var h, $;
    (h = ($ = u.opts.code).formats) !== null && h !== void 0 || ($.formats = (0, i._)`require("ajv-formats/dist/formats").${p}`);
    for (const y of l)
      u.addFormat(y, f[y]);
  }
  e.exports = t = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
})(Jl, Jl.exports);
var zI = Jl.exports;
const KI = /* @__PURE__ */ n0(zI), WI = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !YI(i, s) && n || Object.defineProperty(e, r, s);
}, YI = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, XI = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, JI = (e, t) => `/* Wrapped ${e}*/
${t}`, QI = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), ZI = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), eC = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, i = JI.bind(null, n, t.toString());
  Object.defineProperty(i, "name", ZI);
  const { writable: s, enumerable: a, configurable: o } = QI;
  Object.defineProperty(e, "toString", { value: i, writable: s, enumerable: a, configurable: o });
};
function tC(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const i of Reflect.ownKeys(t))
    WI(e, t, i, r);
  return XI(e, t), eC(e, t, n), e;
}
const Np = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: i = !1,
    after: s = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!i && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, o, c;
  const u = function(...l) {
    const f = this, p = () => {
      a = void 0, o && (clearTimeout(o), o = void 0), s && (c = e.apply(f, l));
    }, h = () => {
      o = void 0, a && (clearTimeout(a), a = void 0), s && (c = e.apply(f, l));
    }, $ = i && !a;
    return clearTimeout(a), a = setTimeout(p, r), n > 0 && n !== Number.POSITIVE_INFINITY && !o && (o = setTimeout(h, n)), $ && (c = e.apply(f, l)), c;
  };
  return tC(u, e), u.cancel = () => {
    a && (clearTimeout(a), a = void 0), o && (clearTimeout(o), o = void 0);
  }, u;
};
var au = { exports: {} };
const rC = "2.0.0", zg = 256, nC = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, iC = 16, sC = zg - 6, aC = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var sc = {
  MAX_LENGTH: zg,
  MAX_SAFE_COMPONENT_LENGTH: iC,
  MAX_SAFE_BUILD_LENGTH: sC,
  MAX_SAFE_INTEGER: nC,
  RELEASE_TYPES: aC,
  SEMVER_SPEC_VERSION: rC,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const oC = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ac = oC;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = sc, s = ac;
  t = e.exports = {};
  const a = t.re = [], o = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const p = "[a-zA-Z0-9-]", h = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], $ = (v) => {
    for (const [m, E] of h)
      v = v.split(`${m}*`).join(`${m}{0,${E}}`).split(`${m}+`).join(`${m}{1,${E}}`);
    return v;
  }, y = (v, m, E) => {
    const N = $(m), D = f++;
    s(v, D, m), l[v] = D, c[D] = m, u[D] = N, a[D] = new RegExp(m, E ? "g" : void 0), o[D] = new RegExp(N, E ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), y("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${p}+`), y("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), y("FULL", `^${c[l.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), y("LOOSE", `^${c[l.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), y("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", c[l.COERCE], !0), y("COERCERTLFULL", c[l.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(au, au.exports);
var ia = au.exports;
const cC = Object.freeze({ loose: !0 }), lC = Object.freeze({}), uC = (e) => e ? typeof e != "object" ? cC : e : lC;
var gd = uC;
const Rp = /^[0-9]+$/, Kg = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Rp.test(e), n = Rp.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, fC = (e, t) => Kg(t, e);
var Wg = {
  compareIdentifiers: Kg,
  rcompareIdentifiers: fC
};
const La = ac, { MAX_LENGTH: Op, MAX_SAFE_INTEGER: ja } = sc, { safeRe: Ua, t: Ma } = ia, dC = gd, { compareIdentifiers: Zc } = Wg;
let hC = class ur {
  constructor(t, r) {
    if (r = dC(r), t instanceof ur) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Op)
      throw new TypeError(
        `version is longer than ${Op} characters`
      );
    La("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ua[Ma.LOOSE] : Ua[Ma.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ja || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ja || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ja || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < ja)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (La("SemVer.compare", this.version, this.options, t), !(t instanceof ur)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ur(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ur || (t = new ur(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ur || (t = new ur(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (La("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Zc(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ur || (t = new ur(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (La("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Zc(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ua[Ma.PRERELEASELOOSE] : Ua[Ma.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), Zc(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Et = hC;
const Ap = Et, pC = (e, t, r = !1) => {
  if (e instanceof Ap)
    return e;
  try {
    return new Ap(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Ki = pC;
const mC = Ki, yC = (e, t) => {
  const r = mC(e, t);
  return r ? r.version : null;
};
var gC = yC;
const $C = Ki, vC = (e, t) => {
  const r = $C(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var _C = vC;
const Ip = Et, EC = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Ip(
      e instanceof Ip ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var wC = EC;
const Cp = Ki, SC = (e, t) => {
  const r = Cp(e, null, !0), n = Cp(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, a = s ? r : n, o = s ? n : r, c = !!a.prerelease.length;
  if (!!o.prerelease.length && !c) {
    if (!o.patch && !o.minor)
      return "major";
    if (o.compareMain(a) === 0)
      return o.minor && !o.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var bC = SC;
const PC = Et, TC = (e, t) => new PC(e, t).major;
var NC = TC;
const RC = Et, OC = (e, t) => new RC(e, t).minor;
var AC = OC;
const IC = Et, CC = (e, t) => new IC(e, t).patch;
var DC = CC;
const kC = Ki, FC = (e, t) => {
  const r = kC(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var LC = FC;
const Dp = Et, jC = (e, t, r) => new Dp(e, r).compare(new Dp(t, r));
var ir = jC;
const UC = ir, MC = (e, t, r) => UC(t, e, r);
var xC = MC;
const VC = ir, qC = (e, t) => VC(e, t, !0);
var BC = qC;
const kp = Et, GC = (e, t, r) => {
  const n = new kp(e, r), i = new kp(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var $d = GC;
const HC = $d, zC = (e, t) => e.sort((r, n) => HC(r, n, t));
var KC = zC;
const WC = $d, YC = (e, t) => e.sort((r, n) => WC(n, r, t));
var XC = YC;
const JC = ir, QC = (e, t, r) => JC(e, t, r) > 0;
var oc = QC;
const ZC = ir, eD = (e, t, r) => ZC(e, t, r) < 0;
var vd = eD;
const tD = ir, rD = (e, t, r) => tD(e, t, r) === 0;
var Yg = rD;
const nD = ir, iD = (e, t, r) => nD(e, t, r) !== 0;
var Xg = iD;
const sD = ir, aD = (e, t, r) => sD(e, t, r) >= 0;
var _d = aD;
const oD = ir, cD = (e, t, r) => oD(e, t, r) <= 0;
var Ed = cD;
const lD = Yg, uD = Xg, fD = oc, dD = _d, hD = vd, pD = Ed, mD = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return lD(e, r, n);
    case "!=":
      return uD(e, r, n);
    case ">":
      return fD(e, r, n);
    case ">=":
      return dD(e, r, n);
    case "<":
      return hD(e, r, n);
    case "<=":
      return pD(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Jg = mD;
const yD = Et, gD = Ki, { safeRe: xa, t: Va } = ia, $D = (e, t) => {
  if (e instanceof yD)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? xa[Va.COERCEFULL] : xa[Va.COERCE]);
  else {
    const c = t.includePrerelease ? xa[Va.COERCERTLFULL] : xa[Va.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return gD(`${n}.${i}.${s}${a}${o}`, t);
};
var vD = $D;
let _D = class {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
};
var ED = _D, el, Fp;
function sr() {
  if (Fp) return el;
  Fp = 1;
  const e = /\s+/g;
  class t {
    constructor(I, x) {
      if (x = i(x), I instanceof t)
        return I.loose === !!x.loose && I.includePrerelease === !!x.includePrerelease ? I : new t(I.raw, x);
      if (I instanceof s)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = x, this.loose = !!x.loose, this.includePrerelease = !!x.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((V) => !y(V[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && v(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let I = 0; I < this.set.length; I++) {
          I > 0 && (this.formatted += "||");
          const x = this.set[I];
          for (let L = 0; L < x.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += x[L].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(I) {
      const L = ((this.options.includePrerelease && h) | (this.options.loose && $)) + ":" + I, V = n.get(L);
      if (V)
        return V;
      const U = this.options.loose, O = U ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      I = I.replace(O, K(this.options.includePrerelease)), a("hyphen replace", I), I = I.replace(c[u.COMPARATORTRIM], l), a("comparator trim", I), I = I.replace(c[u.TILDETRIM], f), a("tilde trim", I), I = I.replace(c[u.CARETTRIM], p), a("caret trim", I);
      let w = I.split(" ").map((g) => E(g, this.options)).join(" ").split(/\s+/).map((g) => H(g, this.options));
      U && (w = w.filter((g) => (a("loose invalid filter", g, this.options), !!g.match(c[u.COMPARATORLOOSE])))), a("range list", w);
      const P = /* @__PURE__ */ new Map(), b = w.map((g) => new s(g, this.options));
      for (const g of b) {
        if (y(g))
          return [g];
        P.set(g.value, g);
      }
      P.size > 1 && P.has("") && P.delete("");
      const d = [...P.values()];
      return n.set(L, d), d;
    }
    intersects(I, x) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, x) && I.set.some((V) => m(V, x) && L.every((U) => V.every((O) => U.intersects(O, x)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new o(I, this.options);
        } catch {
          return !1;
        }
      for (let x = 0; x < this.set.length; x++)
        if (ne(this.set[x], I, this.options))
          return !0;
      return !1;
    }
  }
  el = t;
  const r = ED, n = new r(), i = gd, s = cc(), a = ac, o = Et, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: p
  } = ia, { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: $ } = sc, y = (C) => C.value === "<0.0.0-0", v = (C) => C.value === "", m = (C, I) => {
    let x = !0;
    const L = C.slice();
    let V = L.pop();
    for (; x && L.length; )
      x = L.every((U) => V.intersects(U, I)), V = L.pop();
    return x;
  }, E = (C, I) => (C = C.replace(c[u.BUILD], ""), a("comp", C, I), C = z(C, I), a("caret", C), C = D(C, I), a("tildes", C), C = se(C, I), a("xrange", C), C = A(C, I), a("stars", C), C), N = (C) => !C || C.toLowerCase() === "x" || C === "*", D = (C, I) => C.trim().split(/\s+/).map((x) => j(x, I)).join(" "), j = (C, I) => {
    const x = I.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return C.replace(x, (L, V, U, O, w) => {
      a("tilde", C, L, V, U, O, w);
      let P;
      return N(V) ? P = "" : N(U) ? P = `>=${V}.0.0 <${+V + 1}.0.0-0` : N(O) ? P = `>=${V}.${U}.0 <${V}.${+U + 1}.0-0` : w ? (a("replaceTilde pr", w), P = `>=${V}.${U}.${O}-${w} <${V}.${+U + 1}.0-0`) : P = `>=${V}.${U}.${O} <${V}.${+U + 1}.0-0`, a("tilde return", P), P;
    });
  }, z = (C, I) => C.trim().split(/\s+/).map((x) => Q(x, I)).join(" "), Q = (C, I) => {
    a("caret", C, I);
    const x = I.loose ? c[u.CARETLOOSE] : c[u.CARET], L = I.includePrerelease ? "-0" : "";
    return C.replace(x, (V, U, O, w, P) => {
      a("caret", C, V, U, O, w, P);
      let b;
      return N(U) ? b = "" : N(O) ? b = `>=${U}.0.0${L} <${+U + 1}.0.0-0` : N(w) ? U === "0" ? b = `>=${U}.${O}.0${L} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.0${L} <${+U + 1}.0.0-0` : P ? (a("replaceCaret pr", P), U === "0" ? O === "0" ? b = `>=${U}.${O}.${w}-${P} <${U}.${O}.${+w + 1}-0` : b = `>=${U}.${O}.${w}-${P} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.${w}-${P} <${+U + 1}.0.0-0`) : (a("no pr"), U === "0" ? O === "0" ? b = `>=${U}.${O}.${w}${L} <${U}.${O}.${+w + 1}-0` : b = `>=${U}.${O}.${w}${L} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.${w} <${+U + 1}.0.0-0`), a("caret return", b), b;
    });
  }, se = (C, I) => (a("replaceXRanges", C, I), C.split(/\s+/).map((x) => W(x, I)).join(" ")), W = (C, I) => {
    C = C.trim();
    const x = I.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return C.replace(x, (L, V, U, O, w, P) => {
      a("xRange", C, L, V, U, O, w, P);
      const b = N(U), d = b || N(O), g = d || N(w), R = g;
      return V === "=" && R && (V = ""), P = I.includePrerelease ? "-0" : "", b ? V === ">" || V === "<" ? L = "<0.0.0-0" : L = "*" : V && R ? (d && (O = 0), w = 0, V === ">" ? (V = ">=", d ? (U = +U + 1, O = 0, w = 0) : (O = +O + 1, w = 0)) : V === "<=" && (V = "<", d ? U = +U + 1 : O = +O + 1), V === "<" && (P = "-0"), L = `${V + U}.${O}.${w}${P}`) : d ? L = `>=${U}.0.0${P} <${+U + 1}.0.0-0` : g && (L = `>=${U}.${O}.0${P} <${U}.${+O + 1}.0-0`), a("xRange return", L), L;
    });
  }, A = (C, I) => (a("replaceStars", C, I), C.trim().replace(c[u.STAR], "")), H = (C, I) => (a("replaceGTE0", C, I), C.trim().replace(c[I.includePrerelease ? u.GTE0PRE : u.GTE0], "")), K = (C) => (I, x, L, V, U, O, w, P, b, d, g, R) => (N(L) ? x = "" : N(V) ? x = `>=${L}.0.0${C ? "-0" : ""}` : N(U) ? x = `>=${L}.${V}.0${C ? "-0" : ""}` : O ? x = `>=${x}` : x = `>=${x}${C ? "-0" : ""}`, N(b) ? P = "" : N(d) ? P = `<${+b + 1}.0.0-0` : N(g) ? P = `<${b}.${+d + 1}.0-0` : R ? P = `<=${b}.${d}.${g}-${R}` : C ? P = `<${b}.${d}.${+g + 1}-0` : P = `<=${P}`, `${x} ${P}`.trim()), ne = (C, I, x) => {
    for (let L = 0; L < C.length; L++)
      if (!C[L].test(I))
        return !1;
    if (I.prerelease.length && !x.includePrerelease) {
      for (let L = 0; L < C.length; L++)
        if (a(C[L].semver), C[L].semver !== s.ANY && C[L].semver.prerelease.length > 0) {
          const V = C[L].semver;
          if (V.major === I.major && V.minor === I.minor && V.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return el;
}
var tl, Lp;
function cc() {
  if (Lp) return tl;
  Lp = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = l.match(f);
      if (!p)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new o(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new o(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  tl = t;
  const r = gd, { safeRe: n, t: i } = ia, s = Jg, a = ac, o = Et, c = sr();
  return tl;
}
const wD = sr(), SD = (e, t, r) => {
  try {
    t = new wD(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var lc = SD;
const bD = sr(), PD = (e, t) => new bD(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var TD = PD;
const ND = Et, RD = sr(), OD = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new RD(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new ND(n, r));
  }), n;
};
var AD = OD;
const ID = Et, CD = sr(), DD = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new CD(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new ID(n, r));
  }), n;
};
var kD = DD;
const rl = Et, FD = sr(), jp = oc, LD = (e, t) => {
  e = new FD(e, t);
  let r = new rl("0.0.0");
  if (e.test(r) || (r = new rl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((a) => {
      const o = new rl(a.semver.version);
      switch (a.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!s || jp(o, s)) && (s = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), s && (!r || jp(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var jD = LD;
const UD = sr(), MD = (e, t) => {
  try {
    return new UD(e, t).range || "*";
  } catch {
    return null;
  }
};
var xD = MD;
const VD = Et, Qg = cc(), { ANY: qD } = Qg, BD = sr(), GD = lc, Up = oc, Mp = vd, HD = Ed, zD = _d, KD = (e, t, r, n) => {
  e = new VD(e, n), t = new BD(t, n);
  let i, s, a, o, c;
  switch (r) {
    case ">":
      i = Up, s = HD, a = Mp, o = ">", c = ">=";
      break;
    case "<":
      i = Mp, s = zD, a = Up, o = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (GD(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, p = null;
    if (l.forEach((h) => {
      h.semver === qD && (h = new Qg(">=0.0.0")), f = f || h, p = p || h, i(h.semver, f.semver, n) ? f = h : a(h.semver, p.semver, n) && (p = h);
    }), f.operator === o || f.operator === c || (!p.operator || p.operator === o) && s(e, p.semver))
      return !1;
    if (p.operator === c && a(e, p.semver))
      return !1;
  }
  return !0;
};
var wd = KD;
const WD = wd, YD = (e, t, r) => WD(e, t, ">", r);
var XD = YD;
const JD = wd, QD = (e, t, r) => JD(e, t, "<", r);
var ZD = QD;
const xp = sr(), ek = (e, t, r) => (e = new xp(e, r), t = new xp(t, r), e.intersects(t, r));
var tk = ek;
const rk = lc, nk = ir;
var ik = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const a = e.sort((l, f) => nk(l, f, r));
  for (const l of a)
    rk(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [l, f] of n)
    l === f ? o.push(l) : !f && l === a[0] ? o.push("*") : f ? l === a[0] ? o.push(`<=${f}`) : o.push(`${l} - ${f}`) : o.push(`>=${l}`);
  const c = o.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const Vp = sr(), Sd = cc(), { ANY: nl } = Sd, ls = lc, bd = ir, sk = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Vp(e, r), t = new Vp(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const a = ok(i, s, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, ak = [new Sd(">=0.0.0-0")], qp = [new Sd(">=0.0.0")], ok = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === nl) {
    if (t.length === 1 && t[0].semver === nl)
      return !0;
    r.includePrerelease ? e = ak : e = qp;
  }
  if (t.length === 1 && t[0].semver === nl) {
    if (r.includePrerelease)
      return !0;
    t = qp;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const h of e)
    h.operator === ">" || h.operator === ">=" ? i = Bp(i, h, r) : h.operator === "<" || h.operator === "<=" ? s = Gp(s, h, r) : n.add(h.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && s) {
    if (a = bd(i.semver, s.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const h of n) {
    if (i && !ls(h, String(i), r) || s && !ls(h, String(s), r))
      return null;
    for (const $ of t)
      if (!ls(h, String($), r))
        return !1;
    return !0;
  }
  let o, c, u, l, f = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && s.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const h of t) {
    if (l = l || h.operator === ">" || h.operator === ">=", u = u || h.operator === "<" || h.operator === "<=", i) {
      if (p && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === p.major && h.semver.minor === p.minor && h.semver.patch === p.patch && (p = !1), h.operator === ">" || h.operator === ">=") {
        if (o = Bp(i, h, r), o === h && o !== i)
          return !1;
      } else if (i.operator === ">=" && !ls(i.semver, String(h), r))
        return !1;
    }
    if (s) {
      if (f && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === f.major && h.semver.minor === f.minor && h.semver.patch === f.patch && (f = !1), h.operator === "<" || h.operator === "<=") {
        if (c = Gp(s, h, r), c === h && c !== s)
          return !1;
      } else if (s.operator === "<=" && !ls(s.semver, String(h), r))
        return !1;
    }
    if (!h.operator && (s || i) && a !== 0)
      return !1;
  }
  return !(i && u && !s && a !== 0 || s && l && !i && a !== 0 || p || f);
}, Bp = (e, t, r) => {
  if (!e)
    return t;
  const n = bd(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Gp = (e, t, r) => {
  if (!e)
    return t;
  const n = bd(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var ck = sk;
const il = ia, Hp = sc, lk = Et, zp = Wg, uk = Ki, fk = gC, dk = _C, hk = wC, pk = bC, mk = NC, yk = AC, gk = DC, $k = LC, vk = ir, _k = xC, Ek = BC, wk = $d, Sk = KC, bk = XC, Pk = oc, Tk = vd, Nk = Yg, Rk = Xg, Ok = _d, Ak = Ed, Ik = Jg, Ck = vD, Dk = cc(), kk = sr(), Fk = lc, Lk = TD, jk = AD, Uk = kD, Mk = jD, xk = xD, Vk = wd, qk = XD, Bk = ZD, Gk = tk, Hk = ik, zk = ck;
var Kk = {
  parse: uk,
  valid: fk,
  clean: dk,
  inc: hk,
  diff: pk,
  major: mk,
  minor: yk,
  patch: gk,
  prerelease: $k,
  compare: vk,
  rcompare: _k,
  compareLoose: Ek,
  compareBuild: wk,
  sort: Sk,
  rsort: bk,
  gt: Pk,
  lt: Tk,
  eq: Nk,
  neq: Rk,
  gte: Ok,
  lte: Ak,
  cmp: Ik,
  coerce: Ck,
  Comparator: Dk,
  Range: kk,
  satisfies: Fk,
  toComparators: Lk,
  maxSatisfying: jk,
  minSatisfying: Uk,
  minVersion: Mk,
  validRange: xk,
  outside: Vk,
  gtr: qk,
  ltr: Bk,
  intersects: Gk,
  simplifyRange: Hk,
  subset: zk,
  SemVer: lk,
  re: il.re,
  src: il.src,
  tokens: il.t,
  SEMVER_SPEC_VERSION: Hp.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Hp.RELEASE_TYPES,
  compareIdentifiers: zp.compareIdentifiers,
  rcompareIdentifiers: zp.rcompareIdentifiers
};
const ii = /* @__PURE__ */ n0(Kk), Wk = Object.prototype.toString, Yk = "[object Uint8Array]", Xk = "[object ArrayBuffer]";
function Zg(e, t, r) {
  return e ? e.constructor === t ? !0 : Wk.call(e) === r : !1;
}
function e$(e) {
  return Zg(e, Uint8Array, Yk);
}
function Jk(e) {
  return Zg(e, ArrayBuffer, Xk);
}
function Qk(e) {
  return e$(e) || Jk(e);
}
function Zk(e) {
  if (!e$(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function eF(e) {
  if (!Qk(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function sl(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, s) => i + s.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    Zk(i), r.set(i, n), n += i.length;
  return r;
}
const qa = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Ba(e, t = "utf8") {
  return eF(e), qa[t] ?? (qa[t] = new globalThis.TextDecoder(t)), qa[t].decode(e);
}
function tF(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const rF = new globalThis.TextEncoder();
function al(e) {
  return tF(e), rF.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Kp = "aes-256-cbc", t$ = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), nF = (e) => typeof e == "string" && t$.has(e), Tr = () => /* @__PURE__ */ Object.create(null), Wp = (e) => e !== void 0, ol = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Xr = "__internal__", cl = `${Xr}.migrations.version`;
var en, tn, Mn, Rt, Vt, xn, Vn, Ai, dr, We, r$, n$, i$, s$, a$, o$, c$, l$;
class iF {
  constructor(t = {}) {
    zt(this, We);
    ns(this, "path");
    ns(this, "events");
    zt(this, en);
    zt(this, tn);
    zt(this, Mn);
    zt(this, Rt);
    zt(this, Vt, {});
    zt(this, xn, !1);
    zt(this, Vn);
    zt(this, Ai);
    zt(this, dr);
    ns(this, "_deserialize", (t) => JSON.parse(t));
    ns(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = br(this, We, r$).call(this, t);
    Nt(this, Rt, r), br(this, We, n$).call(this, r), br(this, We, s$).call(this, r), br(this, We, a$).call(this, r), this.events = new EventTarget(), Nt(this, tn, r.encryptionKey), Nt(this, Mn, r.encryptionAlgorithm ?? Kp), this.path = br(this, We, o$).call(this, r), br(this, We, c$).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (le(this, Rt).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Xr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, i = (s, a) => {
      if (ol(s, a), le(this, Rt).accessPropertiesByDotNotation)
        Sa(n, s, a);
      else {
        if (s === "__proto__" || s === "constructor" || s === "prototype")
          return;
        n[s] = a;
      }
    };
    if (typeof t == "object") {
      const s = t;
      for (const [a, o] of Object.entries(s))
        i(a, o);
    } else
      i(t, r);
    this.store = n;
  }
  has(t) {
    return le(this, Rt).accessPropertiesByDotNotation ? xc(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    ol(t, r);
    const n = le(this, Rt).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Wp(le(this, Vt)[r]) && this.set(r, le(this, Vt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    le(this, Rt).accessPropertiesByDotNotation ? NE(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Tr();
    for (const r of Object.keys(le(this, Vt)))
      Wp(le(this, Vt)[r]) && (ol(r, le(this, Vt)[r]), le(this, Rt).accessPropertiesByDotNotation ? Sa(t, r, le(this, Vt)[r]) : t[r] = le(this, Vt)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = ue.readFileSync(this.path, le(this, tn) ? null : "utf8"), n = this._decryptData(r);
      return ((s) => {
        const a = this._deserialize(s);
        return le(this, xn) || this._validate(a), Object.assign(Tr(), a);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Tr();
      if (le(this, Rt).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return Tr();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !xc(t, Xr))
      try {
        const r = ue.readFileSync(this.path, le(this, tn) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
        xc(i, Xr) && Sa(t, Xr, Th(i, Xr));
      } catch {
      }
    le(this, xn) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    le(this, Vn) && (le(this, Vn).close(), Nt(this, Vn, void 0)), le(this, Ai) && (ue.unwatchFile(this.path), Nt(this, Ai, !1)), Nt(this, dr, void 0);
  }
  _decryptData(t) {
    const r = le(this, tn);
    if (!r)
      return typeof t == "string" ? t : Ba(t);
    const n = le(this, Mn), i = n === "aes-256-gcm" ? 16 : 0, s = ":".codePointAt(0), a = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(s !== void 0 && a === s)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Ba(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (h) => {
      if (i === 0)
        return { ciphertext: h };
      const $ = h.length - i;
      if ($ < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: h.slice(0, $),
        authenticationTag: h.slice($)
      };
    }, u = t.slice(0, 16), l = t.slice(17), f = typeof l == "string" ? al(l) : l, p = (h) => {
      const { ciphertext: $, authenticationTag: y } = c(f), v = is.pbkdf2Sync(r, h, 1e4, 32, "sha512"), m = is.createDecipheriv(n, v, u);
      return y && m.setAuthTag(y), Ba(sl([m.update($), m.final()]));
    };
    try {
      return p(u);
    } catch {
      try {
        return p(u.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : Ba(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const i = r, s = this.store;
      bh(s, i) || (r = s, t.call(this, s, i));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const i = () => {
      const s = n, a = t();
      bh(a, s) || (n = a, r.call(this, a, s));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!le(this, en) || le(this, en).call(this, t) || !le(this, en).errors)
      return;
    const n = le(this, en).errors.map(({ instancePath: i, message: s = "" }) => `\`${i.slice(1)}\` ${s}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ue.mkdirSync(ve.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = le(this, tn);
    if (n) {
      const i = is.randomBytes(16), s = is.pbkdf2Sync(n, i, 1e4, 32, "sha512"), a = is.createCipheriv(le(this, Mn), s, i), o = sl([a.update(al(r)), a.final()]), c = [i, al(":"), o];
      le(this, Mn) === "aes-256-gcm" && c.push(a.getAuthTag()), r = sl(c);
    }
    if (Ce.env.SNAP)
      ue.writeFileSync(this.path, r, { mode: le(this, Rt).configFileMode });
    else
      try {
        r0(this.path, r, { mode: le(this, Rt).configFileMode });
      } catch (i) {
        if ((i == null ? void 0 : i.code) === "EXDEV") {
          ue.writeFileSync(this.path, r, { mode: le(this, Rt).configFileMode });
          return;
        }
        throw i;
      }
  }
  _watch() {
    if (this._ensureDirectory(), ue.existsSync(this.path) || this._write(Tr()), Ce.platform === "win32" || Ce.platform === "darwin") {
      le(this, dr) ?? Nt(this, dr, Np(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ve.dirname(this.path), r = ve.basename(this.path);
      Nt(this, Vn, ue.watch(t, { persistent: !1, encoding: "utf8" }, (n, i) => {
        i && i !== r || typeof le(this, dr) == "function" && le(this, dr).call(this);
      }));
    } else
      le(this, dr) ?? Nt(this, dr, Np(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), ue.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof le(this, dr) == "function" && le(this, dr).call(this);
      }), Nt(this, Ai, !0);
  }
  _migrate(t, r, n) {
    let i = this._get(cl, "0.0.0");
    const s = Object.keys(t).filter((o) => this._shouldPerformMigration(o, i, r));
    let a = structuredClone(this.store);
    for (const o of s)
      try {
        n && n(this, {
          fromVersion: i,
          toVersion: o,
          finalVersion: r,
          versions: s
        });
        const c = t[o];
        c == null || c(this), this._set(cl, o), i = o, a = structuredClone(this.store);
      } catch (c) {
        this.store = a;
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !ii.eq(i, r)) && this._set(cl, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Xr || t.startsWith(`${Xr}.`);
  }
  _isVersionInRangeFormat(t) {
    return ii.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ii.satisfies(r, t) ? !1 : ii.satisfies(n, t) : !(ii.lte(t, r) || ii.gt(t, n));
  }
  _get(t, r) {
    return Th(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Sa(n, t, r), this.store = n;
  }
}
en = new WeakMap(), tn = new WeakMap(), Mn = new WeakMap(), Rt = new WeakMap(), Vt = new WeakMap(), xn = new WeakMap(), Vn = new WeakMap(), Ai = new WeakMap(), dr = new WeakMap(), We = new WeakSet(), r$ = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = Kp), !nF(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...t$].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = IE(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, n$ = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = KI.default, n = new DN.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const i = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  Nt(this, en, n.compile(i)), br(this, We, i$).call(this, t.schema);
}, i$ = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, i] of r) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: s } = i;
    s !== void 0 && (le(this, Vt)[n] = s);
  }
}, s$ = function(t) {
  t.defaults && Object.assign(le(this, Vt), t.defaults);
}, a$ = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, o$ = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ve.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, c$ = function(t) {
  if (t.migrations) {
    br(this, We, l$).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Tr(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Ph.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, l$ = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Nt(this, xn, !0);
    try {
      const i = this.store, s = Object.assign(Tr(), t.defaults ?? {}, i);
      try {
        Ph.deepEqual(i, s);
      } catch {
        this._write(s);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Nt(this, xn, !1);
    }
  }
};
const { app: go, ipcMain: ou, shell: sF } = Cr;
let Yp = !1;
const Xp = () => {
  if (!ou || !go)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: go.getPath("userData"),
    appVersion: go.getVersion()
  };
  return Yp || (ou.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Yp = !0), e;
};
class aF extends iF {
  constructor(t) {
    let r, n;
    if (Ce.type === "renderer") {
      const i = Cr.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = i);
    } else ou && go && ({ defaultCwd: r, appVersion: n } = Xp());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ve.isAbsolute(t.cwd) ? t.cwd : ve.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Xp();
  }
  async openInEditor() {
    const t = await sF.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var xt = {}, Yn = {}, wt = {};
wt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
wt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Wr = SE, oF = process.cwd, $o = null, cF = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return $o || ($o = oF.call(process)), $o;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Jp = process.chdir;
  process.chdir = function(e) {
    $o = null, Jp.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Jp);
}
var lF = uF;
function uF(e) {
  Wr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, p, h) {
    h && process.nextTick(h);
  }, e.lchownSync = function() {
  }), cF === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(p, h, $) {
      var y = Date.now(), v = 0;
      l(p, h, function m(E) {
        if (E && (E.code === "EACCES" || E.code === "EPERM" || E.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(h, function(N, D) {
              N && N.code === "ENOENT" ? l(p, h, m) : $(E);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        $ && $(E);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function f(p, h, $, y, v, m) {
      var E;
      if (m && typeof m == "function") {
        var N = 0;
        E = function(D, j, z) {
          if (D && D.code === "EAGAIN" && N < 10)
            return N++, l.call(e, p, h, $, y, v, E);
          m.apply(this, arguments);
        };
      }
      return l.call(e, p, h, $, y, v, E);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(f, p, h, $, y) {
      for (var v = 0; ; )
        try {
          return l.call(e, f, p, h, $, y);
        } catch (m) {
          if (m.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw m;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(f, p, h) {
      l.open(
        f,
        Wr.O_WRONLY | Wr.O_SYMLINK,
        p,
        function($, y) {
          if ($) {
            h && h($);
            return;
          }
          l.fchmod(y, p, function(v) {
            l.close(y, function(m) {
              h && h(v || m);
            });
          });
        }
      );
    }, l.lchmodSync = function(f, p) {
      var h = l.openSync(f, Wr.O_WRONLY | Wr.O_SYMLINK, p), $ = !0, y;
      try {
        y = l.fchmodSync(h, p), $ = !1;
      } finally {
        if ($)
          try {
            l.closeSync(h);
          } catch {
          }
        else
          l.closeSync(h);
      }
      return y;
    };
  }
  function r(l) {
    Wr.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, p, h, $) {
      l.open(f, Wr.O_SYMLINK, function(y, v) {
        if (y) {
          $ && $(y);
          return;
        }
        l.futimes(v, p, h, function(m) {
          l.close(v, function(E) {
            $ && $(m || E);
          });
        });
      });
    }, l.lutimesSync = function(f, p, h) {
      var $ = l.openSync(f, Wr.O_SYMLINK), y, v = !0;
      try {
        y = l.futimesSync($, p, h), v = !1;
      } finally {
        if (v)
          try {
            l.closeSync($);
          } catch {
          }
        else
          l.closeSync($);
      }
      return y;
    }) : l.futimes && (l.lutimes = function(f, p, h, $) {
      $ && process.nextTick($);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(f, p, h) {
      return l.call(e, f, p, function($) {
        u($) && ($ = null), h && h.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(f, p) {
      try {
        return l.call(e, f, p);
      } catch (h) {
        if (!u(h)) throw h;
      }
    };
  }
  function s(l) {
    return l && function(f, p, h, $) {
      return l.call(e, f, p, h, function(y) {
        u(y) && (y = null), $ && $.apply(this, arguments);
      });
    };
  }
  function a(l) {
    return l && function(f, p, h) {
      try {
        return l.call(e, f, p, h);
      } catch ($) {
        if (!u($)) throw $;
      }
    };
  }
  function o(l) {
    return l && function(f, p, h) {
      typeof p == "function" && (h = p, p = null);
      function $(y, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), h && h.apply(this, arguments);
      }
      return p ? l.call(e, f, p, $) : l.call(e, f, $);
    };
  }
  function c(l) {
    return l && function(f, p) {
      var h = p ? l.call(e, f, p) : l.call(e, f);
      return h && (h.uid < 0 && (h.uid += 4294967296), h.gid < 0 && (h.gid += 4294967296)), h;
    };
  }
  function u(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Qp = Xs.Stream, fF = dF;
function dF(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Qp.call(this);
    var s = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), o = 0, c = a.length; o < c; o++) {
      var u = a[o];
      this[u] = i[u];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        s._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, f) {
      if (l) {
        s.emit("error", l), s.readable = !1;
        return;
      }
      s.fd = f, s.emit("open", f), s._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Qp.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var s = Object.keys(i), a = 0, o = s.length; a < o; a++) {
      var c = s[a];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var hF = mF, pF = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function mF(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: pF(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ke = mn, yF = lF, gF = fF, $F = hF, Ga = bu, tt, Io;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (tt = Symbol.for("graceful-fs.queue"), Io = Symbol.for("graceful-fs.previous")) : (tt = "___graceful-fs.queue", Io = "___graceful-fs.previous");
function vF() {
}
function u$(e, t) {
  Object.defineProperty(e, tt, {
    get: function() {
      return t;
    }
  });
}
var qn = vF;
Ga.debuglog ? qn = Ga.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (qn = function() {
  var e = Ga.format.apply(Ga, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ke[tt]) {
  var _F = $t[tt] || [];
  u$(ke, _F), ke.close = function(e) {
    function t(r, n) {
      return e.call(ke, r, function(i) {
        i || Zp(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Io, {
      value: e
    }), t;
  }(ke.close), ke.closeSync = function(e) {
    function t(r) {
      e.apply(ke, arguments), Zp();
    }
    return Object.defineProperty(t, Io, {
      value: e
    }), t;
  }(ke.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    qn(ke[tt]), Wy.equal(ke[tt].length, 0);
  });
}
$t[tt] || u$($t, ke[tt]);
var St = Pd($F(ke));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ke.__patched && (St = Pd(ke), ke.__patched = !0);
function Pd(e) {
  yF(e), e.gracefulify = Pd, e.createReadStream = j, e.createWriteStream = z;
  var t = e.readFile;
  e.readFile = r;
  function r(W, A, H) {
    return typeof A == "function" && (H = A, A = null), K(W, A, H);
    function K(ne, C, I, x) {
      return t(ne, C, function(L) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? si([K, [ne, C, I], L, x || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(W, A, H, K) {
    return typeof H == "function" && (K = H, H = null), ne(W, A, H, K);
    function ne(C, I, x, L, V) {
      return n(C, I, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? si([ne, [C, I, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = a);
  function a(W, A, H, K) {
    return typeof H == "function" && (K = H, H = null), ne(W, A, H, K);
    function ne(C, I, x, L, V) {
      return s(C, I, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? si([ne, [C, I, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = c);
  function c(W, A, H, K) {
    return typeof H == "function" && (K = H, H = 0), ne(W, A, H, K);
    function ne(C, I, x, L, V) {
      return o(C, I, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? si([ne, [C, I, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(W, A, H) {
    typeof A == "function" && (H = A, A = null);
    var K = l.test(process.version) ? function(I, x, L, V) {
      return u(I, ne(
        I,
        x,
        L,
        V
      ));
    } : function(I, x, L, V) {
      return u(I, x, ne(
        I,
        x,
        L,
        V
      ));
    };
    return K(W, A, H);
    function ne(C, I, x, L) {
      return function(V, U) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? si([
          K,
          [C, I, x],
          V,
          L || Date.now(),
          Date.now()
        ]) : (U && U.sort && U.sort(), typeof x == "function" && x.call(this, V, U));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = gF(e);
    m = p.ReadStream, N = p.WriteStream;
  }
  var h = e.ReadStream;
  h && (m.prototype = Object.create(h.prototype), m.prototype.open = E);
  var $ = e.WriteStream;
  $ && (N.prototype = Object.create($.prototype), N.prototype.open = D), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return m;
    },
    set: function(W) {
      m = W;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return N;
    },
    set: function(W) {
      N = W;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = m;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(W) {
      y = W;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = N;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(W) {
      v = W;
    },
    enumerable: !0,
    configurable: !0
  });
  function m(W, A) {
    return this instanceof m ? (h.apply(this, arguments), this) : m.apply(Object.create(m.prototype), arguments);
  }
  function E() {
    var W = this;
    se(W.path, W.flags, W.mode, function(A, H) {
      A ? (W.autoClose && W.destroy(), W.emit("error", A)) : (W.fd = H, W.emit("open", H), W.read());
    });
  }
  function N(W, A) {
    return this instanceof N ? ($.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function D() {
    var W = this;
    se(W.path, W.flags, W.mode, function(A, H) {
      A ? (W.destroy(), W.emit("error", A)) : (W.fd = H, W.emit("open", H));
    });
  }
  function j(W, A) {
    return new e.ReadStream(W, A);
  }
  function z(W, A) {
    return new e.WriteStream(W, A);
  }
  var Q = e.open;
  e.open = se;
  function se(W, A, H, K) {
    return typeof H == "function" && (K = H, H = null), ne(W, A, H, K);
    function ne(C, I, x, L, V) {
      return Q(C, I, x, function(U, O) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? si([ne, [C, I, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  return e;
}
function si(e) {
  qn("ENQUEUE", e[0].name, e[1]), ke[tt].push(e), Td();
}
var Ha;
function Zp() {
  for (var e = Date.now(), t = 0; t < ke[tt].length; ++t)
    ke[tt][t].length > 2 && (ke[tt][t][3] = e, ke[tt][t][4] = e);
  Td();
}
function Td() {
  if (clearTimeout(Ha), Ha = void 0, ke[tt].length !== 0) {
    var e = ke[tt].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      qn("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      qn("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var o = Date.now() - s, c = Math.max(s - i, 1), u = Math.min(c * 1.2, 100);
      o >= u ? (qn("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ke[tt].push(e);
    }
    Ha === void 0 && (Ha = setTimeout(Td, 0));
  }
}
(function(e) {
  const t = wt.fromCallback, r = St, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, s) {
    return typeof s == "function" ? r.exists(i, s) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, s, a, o, c, u) {
    return typeof u == "function" ? r.read(i, s, a, o, c, u) : new Promise((l, f) => {
      r.read(i, s, a, o, c, (p, h, $) => {
        if (p) return f(p);
        l({ bytesRead: h, buffer: $ });
      });
    });
  }, e.write = function(i, s, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, s, ...a) : new Promise((o, c) => {
      r.write(i, s, ...a, (u, l, f) => {
        if (u) return c(u);
        o({ bytesWritten: l, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, s, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, s, ...a) : new Promise((o, c) => {
      r.writev(i, s, ...a, (u, l, f) => {
        if (u) return c(u);
        o({ bytesWritten: l, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Yn);
var Nd = {}, f$ = {};
const EF = Fe;
f$.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(EF.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const d$ = Yn, { checkPath: h$ } = f$, p$ = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Nd.makeDir = async (e, t) => (h$(e), d$.mkdir(e, {
  mode: p$(t),
  recursive: !0
}));
Nd.makeDirSync = (e, t) => (h$(e), d$.mkdirSync(e, {
  mode: p$(t),
  recursive: !0
}));
const wF = wt.fromPromise, { makeDir: SF, makeDirSync: ll } = Nd, ul = wF(SF);
var _r = {
  mkdirs: ul,
  mkdirsSync: ll,
  // alias
  mkdirp: ul,
  mkdirpSync: ll,
  ensureDir: ul,
  ensureDirSync: ll
};
const bF = wt.fromPromise, m$ = Yn;
function PF(e) {
  return m$.access(e).then(() => !0).catch(() => !1);
}
var Xn = {
  pathExists: bF(PF),
  pathExistsSync: m$.existsSync
};
const Ri = St;
function TF(e, t, r, n) {
  Ri.open(e, "r+", (i, s) => {
    if (i) return n(i);
    Ri.futimes(s, t, r, (a) => {
      Ri.close(s, (o) => {
        n && n(a || o);
      });
    });
  });
}
function NF(e, t, r) {
  const n = Ri.openSync(e, "r+");
  return Ri.futimesSync(n, t, r), Ri.closeSync(n);
}
var y$ = {
  utimesMillis: TF,
  utimesMillisSync: NF
};
const Fi = Yn, Ke = Fe, RF = bu;
function OF(e, t, r) {
  const n = r.dereference ? (i) => Fi.stat(i, { bigint: !0 }) : (i) => Fi.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function AF(e, t, r) {
  let n;
  const i = r.dereference ? (a) => Fi.statSync(a, { bigint: !0 }) : (a) => Fi.lstatSync(a, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: s, destStat: null };
    throw a;
  }
  return { srcStat: s, destStat: n };
}
function IF(e, t, r, n, i) {
  RF.callbackify(OF)(e, t, n, (s, a) => {
    if (s) return i(s);
    const { srcStat: o, destStat: c } = a;
    if (c) {
      if (sa(o, c)) {
        const u = Ke.basename(e), l = Ke.basename(t);
        return r === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: o, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && Rd(e, t) ? i(new Error(uc(e, t, r))) : i(null, { srcStat: o, destStat: c });
  });
}
function CF(e, t, r, n) {
  const { srcStat: i, destStat: s } = AF(e, t, n);
  if (s) {
    if (sa(i, s)) {
      const a = Ke.basename(e), o = Ke.basename(t);
      if (r === "move" && a !== o && a.toLowerCase() === o.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Rd(e, t))
    throw new Error(uc(e, t, r));
  return { srcStat: i, destStat: s };
}
function g$(e, t, r, n, i) {
  const s = Ke.resolve(Ke.dirname(e)), a = Ke.resolve(Ke.dirname(r));
  if (a === s || a === Ke.parse(a).root) return i();
  Fi.stat(a, { bigint: !0 }, (o, c) => o ? o.code === "ENOENT" ? i() : i(o) : sa(t, c) ? i(new Error(uc(e, r, n))) : g$(e, t, a, n, i));
}
function $$(e, t, r, n) {
  const i = Ke.resolve(Ke.dirname(e)), s = Ke.resolve(Ke.dirname(r));
  if (s === i || s === Ke.parse(s).root) return;
  let a;
  try {
    a = Fi.statSync(s, { bigint: !0 });
  } catch (o) {
    if (o.code === "ENOENT") return;
    throw o;
  }
  if (sa(t, a))
    throw new Error(uc(e, r, n));
  return $$(e, t, s, n);
}
function sa(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Rd(e, t) {
  const r = Ke.resolve(e).split(Ke.sep).filter((i) => i), n = Ke.resolve(t).split(Ke.sep).filter((i) => i);
  return r.reduce((i, s, a) => i && n[a] === s, !0);
}
function uc(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Wi = {
  checkPaths: IF,
  checkPathsSync: CF,
  checkParentPaths: g$,
  checkParentPathsSync: $$,
  isSrcSubdir: Rd,
  areIdentical: sa
};
const Ct = St, Fs = Fe, DF = _r.mkdirs, kF = Xn.pathExists, FF = y$.utimesMillis, Ls = Wi;
function LF(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Ls.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: a, destStat: o } = s;
    Ls.checkParentPaths(e, a, t, "copy", (c) => c ? n(c) : r.filter ? v$(em, o, e, t, r, n) : em(o, e, t, r, n));
  });
}
function em(e, t, r, n, i) {
  const s = Fs.dirname(r);
  kF(s, (a, o) => {
    if (a) return i(a);
    if (o) return Co(e, t, r, n, i);
    DF(s, (c) => c ? i(c) : Co(e, t, r, n, i));
  });
}
function v$(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, s) : s(), (a) => s(a));
}
function jF(e, t, r, n, i) {
  return n.filter ? v$(Co, e, t, r, n, i) : Co(e, t, r, n, i);
}
function Co(e, t, r, n, i) {
  (n.dereference ? Ct.stat : Ct.lstat)(t, (a, o) => a ? i(a) : o.isDirectory() ? GF(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? UF(o, e, t, r, n, i) : o.isSymbolicLink() ? KF(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function UF(e, t, r, n, i, s) {
  return t ? MF(e, r, n, i, s) : _$(e, r, n, i, s);
}
function MF(e, t, r, n, i) {
  if (n.overwrite)
    Ct.unlink(r, (s) => s ? i(s) : _$(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function _$(e, t, r, n, i) {
  Ct.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? xF(e.mode, t, r, i) : fc(r, e.mode, i));
}
function xF(e, t, r, n) {
  return VF(e) ? qF(r, e, (i) => i ? n(i) : tm(e, t, r, n)) : tm(e, t, r, n);
}
function VF(e) {
  return (e & 128) === 0;
}
function qF(e, t, r) {
  return fc(e, t | 128, r);
}
function tm(e, t, r, n) {
  BF(t, r, (i) => i ? n(i) : fc(r, e, n));
}
function fc(e, t, r) {
  return Ct.chmod(e, t, r);
}
function BF(e, t, r) {
  Ct.stat(e, (n, i) => n ? r(n) : FF(t, i.atime, i.mtime, r));
}
function GF(e, t, r, n, i, s) {
  return t ? E$(r, n, i, s) : HF(e.mode, r, n, i, s);
}
function HF(e, t, r, n, i) {
  Ct.mkdir(r, (s) => {
    if (s) return i(s);
    E$(t, r, n, (a) => a ? i(a) : fc(r, e, i));
  });
}
function E$(e, t, r, n) {
  Ct.readdir(e, (i, s) => i ? n(i) : w$(s, e, t, r, n));
}
function w$(e, t, r, n, i) {
  const s = e.pop();
  return s ? zF(e, s, t, r, n, i) : i();
}
function zF(e, t, r, n, i, s) {
  const a = Fs.join(r, t), o = Fs.join(n, t);
  Ls.checkPaths(a, o, "copy", i, (c, u) => {
    if (c) return s(c);
    const { destStat: l } = u;
    jF(l, a, o, i, (f) => f ? s(f) : w$(e, r, n, i, s));
  });
}
function KF(e, t, r, n, i) {
  Ct.readlink(t, (s, a) => {
    if (s) return i(s);
    if (n.dereference && (a = Fs.resolve(process.cwd(), a)), e)
      Ct.readlink(r, (o, c) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Ct.symlink(a, r, i) : i(o) : (n.dereference && (c = Fs.resolve(process.cwd(), c)), Ls.isSrcSubdir(a, c) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Ls.isSrcSubdir(c, a) ? i(new Error(`Cannot overwrite '${c}' with '${a}'.`)) : WF(a, r, i)));
    else
      return Ct.symlink(a, r, i);
  });
}
function WF(e, t, r) {
  Ct.unlink(t, (n) => n ? r(n) : Ct.symlink(e, t, r));
}
var YF = LF;
const ut = St, js = Fe, XF = _r.mkdirsSync, JF = y$.utimesMillisSync, Us = Wi;
function QF(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Us.checkPathsSync(e, t, "copy", r);
  return Us.checkParentPathsSync(e, n, t, "copy"), ZF(i, e, t, r);
}
function ZF(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = js.dirname(r);
  return ut.existsSync(i) || XF(i), S$(e, t, r, n);
}
function eL(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return S$(e, t, r, n);
}
function S$(e, t, r, n) {
  const s = (n.dereference ? ut.statSync : ut.lstatSync)(t);
  if (s.isDirectory()) return oL(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return tL(s, e, t, r, n);
  if (s.isSymbolicLink()) return uL(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function tL(e, t, r, n, i) {
  return t ? rL(e, r, n, i) : b$(e, r, n, i);
}
function rL(e, t, r, n) {
  if (n.overwrite)
    return ut.unlinkSync(r), b$(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function b$(e, t, r, n) {
  return ut.copyFileSync(t, r), n.preserveTimestamps && nL(e.mode, t, r), Od(r, e.mode);
}
function nL(e, t, r) {
  return iL(e) && sL(r, e), aL(t, r);
}
function iL(e) {
  return (e & 128) === 0;
}
function sL(e, t) {
  return Od(e, t | 128);
}
function Od(e, t) {
  return ut.chmodSync(e, t);
}
function aL(e, t) {
  const r = ut.statSync(e);
  return JF(t, r.atime, r.mtime);
}
function oL(e, t, r, n, i) {
  return t ? P$(r, n, i) : cL(e.mode, r, n, i);
}
function cL(e, t, r, n) {
  return ut.mkdirSync(r), P$(t, r, n), Od(r, e);
}
function P$(e, t, r) {
  ut.readdirSync(e).forEach((n) => lL(n, e, t, r));
}
function lL(e, t, r, n) {
  const i = js.join(t, e), s = js.join(r, e), { destStat: a } = Us.checkPathsSync(i, s, "copy", n);
  return eL(a, i, s, n);
}
function uL(e, t, r, n) {
  let i = ut.readlinkSync(t);
  if (n.dereference && (i = js.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = ut.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return ut.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (s = js.resolve(process.cwd(), s)), Us.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (ut.statSync(r).isDirectory() && Us.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return fL(i, r);
  } else
    return ut.symlinkSync(i, r);
}
function fL(e, t) {
  return ut.unlinkSync(t), ut.symlinkSync(e, t);
}
var dL = QF;
const hL = wt.fromCallback;
var Ad = {
  copy: hL(YF),
  copySync: dL
};
const rm = St, T$ = Fe, Te = Wy, Ms = process.platform === "win32";
function N$(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || rm[r], r = r + "Sync", e[r] = e[r] || rm[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Id(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), Te(e, "rimraf: missing path"), Te.strictEqual(typeof e, "string", "rimraf: path should be a string"), Te.strictEqual(typeof r, "function", "rimraf: callback function required"), Te(t, "rimraf: invalid options argument provided"), Te.strictEqual(typeof t, "object", "rimraf: options should be object"), N$(t), nm(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => nm(e, t, i), a);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function nm(e, t, r) {
  Te(e), Te(t), Te(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Ms)
      return im(e, t, n, r);
    if (i && i.isDirectory())
      return vo(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return Ms ? im(e, t, s, r) : vo(e, t, s, r);
        if (s.code === "EISDIR")
          return vo(e, t, s, r);
      }
      return r(s);
    });
  });
}
function im(e, t, r, n) {
  Te(e), Te(t), Te(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, a) => {
      s ? n(s.code === "ENOENT" ? null : r) : a.isDirectory() ? vo(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function sm(e, t, r) {
  let n;
  Te(e), Te(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? _o(e, t, r) : t.unlinkSync(e);
}
function vo(e, t, r, n) {
  Te(e), Te(t), Te(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? pL(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function pL(e, t, r) {
  Te(e), Te(t), Te(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, a;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      Id(T$.join(e, o), t, (c) => {
        if (!a) {
          if (c) return r(a = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function R$(e, t) {
  let r;
  t = t || {}, N$(t), Te(e, "rimraf: missing path"), Te.strictEqual(typeof e, "string", "rimraf: path should be a string"), Te(t, "rimraf: missing options"), Te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Ms && sm(e, t, n);
  }
  try {
    r && r.isDirectory() ? _o(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Ms ? sm(e, t, n) : _o(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    _o(e, t, n);
  }
}
function _o(e, t, r) {
  Te(e), Te(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      mL(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function mL(e, t) {
  if (Te(e), Te(t), t.readdirSync(e).forEach((r) => R$(T$.join(e, r), t)), Ms) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var yL = Id;
Id.sync = R$;
const Do = St, gL = wt.fromCallback, O$ = yL;
function $L(e, t) {
  if (Do.rm) return Do.rm(e, { recursive: !0, force: !0 }, t);
  O$(e, t);
}
function vL(e) {
  if (Do.rmSync) return Do.rmSync(e, { recursive: !0, force: !0 });
  O$.sync(e);
}
var dc = {
  remove: gL($L),
  removeSync: vL
};
const _L = wt.fromPromise, A$ = Yn, I$ = Fe, C$ = _r, D$ = dc, am = _L(async function(t) {
  let r;
  try {
    r = await A$.readdir(t);
  } catch {
    return C$.mkdirs(t);
  }
  return Promise.all(r.map((n) => D$.remove(I$.join(t, n))));
});
function om(e) {
  let t;
  try {
    t = A$.readdirSync(e);
  } catch {
    return C$.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = I$.join(e, r), D$.removeSync(r);
  });
}
var EL = {
  emptyDirSync: om,
  emptydirSync: om,
  emptyDir: am,
  emptydir: am
};
const wL = wt.fromCallback, k$ = Fe, sn = St, F$ = _r;
function SL(e, t) {
  function r() {
    sn.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  sn.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = k$.dirname(e);
    sn.stat(s, (a, o) => {
      if (a)
        return a.code === "ENOENT" ? F$.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(a);
      o.isDirectory() ? r() : sn.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function bL(e) {
  let t;
  try {
    t = sn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = k$.dirname(e);
  try {
    sn.statSync(r).isDirectory() || sn.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") F$.mkdirsSync(r);
    else throw n;
  }
  sn.writeFileSync(e, "");
}
var PL = {
  createFile: wL(SL),
  createFileSync: bL
};
const TL = wt.fromCallback, L$ = Fe, Zr = St, j$ = _r, NL = Xn.pathExists, { areIdentical: U$ } = Wi;
function RL(e, t, r) {
  function n(i, s) {
    Zr.link(i, s, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  Zr.lstat(t, (i, s) => {
    Zr.lstat(e, (a, o) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (s && U$(o, s)) return r(null);
      const c = L$.dirname(t);
      NL(c, (u, l) => {
        if (u) return r(u);
        if (l) return n(e, t);
        j$.mkdirs(c, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function OL(e, t) {
  let r;
  try {
    r = Zr.lstatSync(t);
  } catch {
  }
  try {
    const s = Zr.lstatSync(e);
    if (r && U$(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = L$.dirname(t);
  return Zr.existsSync(n) || j$.mkdirsSync(n), Zr.linkSync(e, t);
}
var AL = {
  createLink: TL(RL),
  createLinkSync: OL
};
const an = Fe, Os = St, IL = Xn.pathExists;
function CL(e, t, r) {
  if (an.isAbsolute(e))
    return Os.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = an.dirname(t), i = an.join(n, e);
    return IL(i, (s, a) => s ? r(s) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : Os.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: an.relative(n, e)
    })));
  }
}
function DL(e, t) {
  let r;
  if (an.isAbsolute(e)) {
    if (r = Os.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = an.dirname(t), i = an.join(n, e);
    if (r = Os.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Os.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: an.relative(n, e)
    };
  }
}
var kL = {
  symlinkPaths: CL,
  symlinkPathsSync: DL
};
const M$ = St;
function FL(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  M$.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function LL(e, t) {
  let r;
  if (t) return t;
  try {
    r = M$.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var jL = {
  symlinkType: FL,
  symlinkTypeSync: LL
};
const UL = wt.fromCallback, x$ = Fe, Zt = Yn, V$ = _r, ML = V$.mkdirs, xL = V$.mkdirsSync, q$ = kL, VL = q$.symlinkPaths, qL = q$.symlinkPathsSync, B$ = jL, BL = B$.symlinkType, GL = B$.symlinkTypeSync, HL = Xn.pathExists, { areIdentical: G$ } = Wi;
function zL(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Zt.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      Zt.stat(e),
      Zt.stat(t)
    ]).then(([a, o]) => {
      if (G$(a, o)) return n(null);
      cm(e, t, r, n);
    }) : cm(e, t, r, n);
  });
}
function cm(e, t, r, n) {
  VL(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, BL(s.toCwd, r, (a, o) => {
      if (a) return n(a);
      const c = x$.dirname(t);
      HL(c, (u, l) => {
        if (u) return n(u);
        if (l) return Zt.symlink(e, t, o, n);
        ML(c, (f) => {
          if (f) return n(f);
          Zt.symlink(e, t, o, n);
        });
      });
    });
  });
}
function KL(e, t, r) {
  let n;
  try {
    n = Zt.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = Zt.statSync(e), c = Zt.statSync(t);
    if (G$(o, c)) return;
  }
  const i = qL(e, t);
  e = i.toDst, r = GL(i.toCwd, r);
  const s = x$.dirname(t);
  return Zt.existsSync(s) || xL(s), Zt.symlinkSync(e, t, r);
}
var WL = {
  createSymlink: UL(zL),
  createSymlinkSync: KL
};
const { createFile: lm, createFileSync: um } = PL, { createLink: fm, createLinkSync: dm } = AL, { createSymlink: hm, createSymlinkSync: pm } = WL;
var YL = {
  // file
  createFile: lm,
  createFileSync: um,
  ensureFile: lm,
  ensureFileSync: um,
  // link
  createLink: fm,
  createLinkSync: dm,
  ensureLink: fm,
  ensureLinkSync: dm,
  // symlink
  createSymlink: hm,
  createSymlinkSync: pm,
  ensureSymlink: hm,
  ensureSymlinkSync: pm
};
function XL(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + s;
}
function JL(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Cd = { stringify: XL, stripBom: JL };
let Li;
try {
  Li = St;
} catch {
  Li = mn;
}
const hc = wt, { stringify: H$, stripBom: z$ } = Cd;
async function QL(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Li, n = "throws" in t ? t.throws : !0;
  let i = await hc.fromCallback(r.readFile)(e, t);
  i = z$(i);
  let s;
  try {
    s = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return s;
}
const ZL = hc.fromPromise(QL);
function ej(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Li, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = z$(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function tj(e, t, r = {}) {
  const n = r.fs || Li, i = H$(t, r);
  await hc.fromCallback(n.writeFile)(e, i, r);
}
const rj = hc.fromPromise(tj);
function nj(e, t, r = {}) {
  const n = r.fs || Li, i = H$(t, r);
  return n.writeFileSync(e, i, r);
}
var ij = {
  readFile: ZL,
  readFileSync: ej,
  writeFile: rj,
  writeFileSync: nj
};
const za = ij;
var sj = {
  // jsonfile exports
  readJson: za.readFile,
  readJsonSync: za.readFileSync,
  writeJson: za.writeFile,
  writeJsonSync: za.writeFileSync
};
const aj = wt.fromCallback, As = St, K$ = Fe, W$ = _r, oj = Xn.pathExists;
function cj(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = K$.dirname(e);
  oj(i, (s, a) => {
    if (s) return n(s);
    if (a) return As.writeFile(e, t, r, n);
    W$.mkdirs(i, (o) => {
      if (o) return n(o);
      As.writeFile(e, t, r, n);
    });
  });
}
function lj(e, ...t) {
  const r = K$.dirname(e);
  if (As.existsSync(r))
    return As.writeFileSync(e, ...t);
  W$.mkdirsSync(r), As.writeFileSync(e, ...t);
}
var Dd = {
  outputFile: aj(cj),
  outputFileSync: lj
};
const { stringify: uj } = Cd, { outputFile: fj } = Dd;
async function dj(e, t, r = {}) {
  const n = uj(t, r);
  await fj(e, n, r);
}
var hj = dj;
const { stringify: pj } = Cd, { outputFileSync: mj } = Dd;
function yj(e, t, r) {
  const n = pj(t, r);
  mj(e, n, r);
}
var gj = yj;
const $j = wt.fromPromise, _t = sj;
_t.outputJson = $j(hj);
_t.outputJsonSync = gj;
_t.outputJSON = _t.outputJson;
_t.outputJSONSync = _t.outputJsonSync;
_t.writeJSON = _t.writeJson;
_t.writeJSONSync = _t.writeJsonSync;
_t.readJSON = _t.readJson;
_t.readJSONSync = _t.readJsonSync;
var vj = _t;
const _j = St, cu = Fe, Ej = Ad.copy, Y$ = dc.remove, wj = _r.mkdirp, Sj = Xn.pathExists, mm = Wi;
function bj(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  mm.checkPaths(e, t, "move", r, (s, a) => {
    if (s) return n(s);
    const { srcStat: o, isChangingCase: c = !1 } = a;
    mm.checkParentPaths(e, o, t, "move", (u) => {
      if (u) return n(u);
      if (Pj(t)) return ym(e, t, i, c, n);
      wj(cu.dirname(t), (l) => l ? n(l) : ym(e, t, i, c, n));
    });
  });
}
function Pj(e) {
  const t = cu.dirname(e);
  return cu.parse(t).root === t;
}
function ym(e, t, r, n, i) {
  if (n) return fl(e, t, r, i);
  if (r)
    return Y$(t, (s) => s ? i(s) : fl(e, t, r, i));
  Sj(t, (s, a) => s ? i(s) : a ? i(new Error("dest already exists.")) : fl(e, t, r, i));
}
function fl(e, t, r, n) {
  _j.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Tj(e, t, r, n) : n());
}
function Tj(e, t, r, n) {
  Ej(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : Y$(e, n));
}
var Nj = bj;
const X$ = St, lu = Fe, Rj = Ad.copySync, J$ = dc.removeSync, Oj = _r.mkdirpSync, gm = Wi;
function Aj(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = gm.checkPathsSync(e, t, "move", r);
  return gm.checkParentPathsSync(e, i, t, "move"), Ij(t) || Oj(lu.dirname(t)), Cj(e, t, n, s);
}
function Ij(e) {
  const t = lu.dirname(e);
  return lu.parse(t).root === t;
}
function Cj(e, t, r, n) {
  if (n) return dl(e, t, r);
  if (r)
    return J$(t), dl(e, t, r);
  if (X$.existsSync(t)) throw new Error("dest already exists.");
  return dl(e, t, r);
}
function dl(e, t, r) {
  try {
    X$.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Dj(e, t, r);
  }
}
function Dj(e, t, r) {
  return Rj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), J$(e);
}
var kj = Aj;
const Fj = wt.fromCallback;
var Lj = {
  move: Fj(Nj),
  moveSync: kj
}, gn = {
  // Export promiseified graceful-fs:
  ...Yn,
  // Export extra methods:
  ...Ad,
  ...EL,
  ...YL,
  ...vj,
  ..._r,
  ...Lj,
  ...Dd,
  ...Xn,
  ...dc
}, Jn = {}, un = {}, He = {}, fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.CancellationError = fn.CancellationToken = void 0;
const jj = Yy;
class Uj extends jj.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new uu());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, s) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          s(new uu());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, s, (o) => {
        a = o;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
fn.CancellationToken = Uj;
class uu extends Error {
  constructor() {
    super("cancelled");
  }
}
fn.CancellationError = uu;
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.newError = Mj;
function Mj(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var vt = {}, fu = { exports: {} }, Ka = { exports: {} }, hl, $m;
function xj() {
  if ($m) return hl;
  $m = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  hl = function(l, f) {
    f = f || {};
    var p = typeof l;
    if (p === "string" && l.length > 0)
      return a(l);
    if (p === "number" && isFinite(l))
      return f.long ? c(l) : o(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function a(l) {
    if (l = String(l), !(l.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (f) {
        var p = parseFloat(f[1]), h = (f[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return p * s;
          case "weeks":
          case "week":
          case "w":
            return p * i;
          case "days":
          case "day":
          case "d":
            return p * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return p * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return p * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return p * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return p;
          default:
            return;
        }
      }
    }
  }
  function o(l) {
    var f = Math.abs(l);
    return f >= n ? Math.round(l / n) + "d" : f >= r ? Math.round(l / r) + "h" : f >= t ? Math.round(l / t) + "m" : f >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var f = Math.abs(l);
    return f >= n ? u(l, f, n, "day") : f >= r ? u(l, f, r, "hour") : f >= t ? u(l, f, t, "minute") : f >= e ? u(l, f, e, "second") : l + " ms";
  }
  function u(l, f, p, h) {
    var $ = f >= p * 1.5;
    return Math.round(l / p) + " " + h + ($ ? "s" : "");
  }
  return hl;
}
var pl, vm;
function Q$() {
  if (vm) return pl;
  vm = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = o, n.enable = s, n.enabled = c, n.humanize = xj(), n.destroy = l, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let p = 0;
      for (let h = 0; h < f.length; h++)
        p = (p << 5) - p + f.charCodeAt(h), p |= 0;
      return n.colors[Math.abs(p) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let p, h = null, $, y;
      function v(...m) {
        if (!v.enabled)
          return;
        const E = v, N = Number(/* @__PURE__ */ new Date()), D = N - (p || N);
        E.diff = D, E.prev = p, E.curr = N, p = N, m[0] = n.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
        let j = 0;
        m[0] = m[0].replace(/%([a-zA-Z%])/g, (Q, se) => {
          if (Q === "%%")
            return "%";
          j++;
          const W = n.formatters[se];
          if (typeof W == "function") {
            const A = m[j];
            Q = W.call(E, A), m.splice(j, 1), j--;
          }
          return Q;
        }), n.formatArgs.call(E, m), (E.log || n.log).apply(E, m);
      }
      return v.namespace = f, v.useColors = n.useColors(), v.color = n.selectColor(f), v.extend = i, v.destroy = n.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => h !== null ? h : ($ !== n.namespaces && ($ = n.namespaces, y = n.enabled(f)), y),
        set: (m) => {
          h = m;
        }
      }), typeof n.init == "function" && n.init(v), v;
    }
    function i(f, p) {
      const h = n(this.namespace + (typeof p > "u" ? ":" : p) + f);
      return h.log = this.log, h;
    }
    function s(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const p = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const h of p)
        h[0] === "-" ? n.skips.push(h.slice(1)) : n.names.push(h);
    }
    function a(f, p) {
      let h = 0, $ = 0, y = -1, v = 0;
      for (; h < f.length; )
        if ($ < p.length && (p[$] === f[h] || p[$] === "*"))
          p[$] === "*" ? (y = $, v = h, $++) : (h++, $++);
        else if (y !== -1)
          $ = y + 1, v++, h = v;
        else
          return !1;
      for (; $ < p.length && p[$] === "*"; )
        $++;
      return $ === p.length;
    }
    function o() {
      const f = [
        ...n.names,
        ...n.skips.map((p) => "-" + p)
      ].join(",");
      return n.enable(""), f;
    }
    function c(f) {
      for (const p of n.skips)
        if (a(f, p))
          return !1;
      for (const p of n.names)
        if (a(f, p))
          return !0;
      return !1;
    }
    function u(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return pl = e, pl;
}
var _m;
function Vj() {
  return _m || (_m = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = s, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      c.splice(1, 0, u, "color: inherit");
      let l = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (p) => {
        p !== "%%" && (l++, p === "%c" && (f = l));
      }), c.splice(f, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Q$()(t);
    const { formatters: o } = e.exports;
    o.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Ka, Ka.exports)), Ka.exports;
}
var Wa = { exports: {} }, ml, Em;
function qj() {
  return Em || (Em = 1, ml = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ml;
}
var yl, wm;
function Bj() {
  if (wm) return yl;
  wm = 1;
  const e = Go, t = Xy, r = qj(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function a(c, u) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !u && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function o(c) {
    const u = a(c, c && c.isTTY);
    return s(u);
  }
  return yl = {
    supportsColor: o,
    stdout: s(a(!0, t.isatty(1))),
    stderr: s(a(!0, t.isatty(2)))
  }, yl;
}
var Sm;
function Gj() {
  return Sm || (Sm = 1, function(e, t) {
    const r = Xy, n = bu;
    t.init = l, t.log = o, t.formatArgs = s, t.save = c, t.load = u, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = Bj();
      p && (p.stderr || p).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((p) => /^debug_/i.test(p)).reduce((p, h) => {
      const $ = h.substring(6).toLowerCase().replace(/_([a-z])/g, (v, m) => m.toUpperCase());
      let y = process.env[h];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), p[$] = y, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(p) {
      const { namespace: h, useColors: $ } = this;
      if ($) {
        const y = this.color, v = "\x1B[3" + (y < 8 ? y : "8;5;" + y), m = `  ${v};1m${h} \x1B[0m`;
        p[0] = m + p[0].split(`
`).join(`
` + m), p.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = a() + h + " " + p[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function o(...p) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...p) + `
`);
    }
    function c(p) {
      p ? process.env.DEBUG = p : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function l(p) {
      p.inspectOpts = {};
      const h = Object.keys(t.inspectOpts);
      for (let $ = 0; $ < h.length; $++)
        p.inspectOpts[h[$]] = t.inspectOpts[h[$]];
    }
    e.exports = Q$()(t);
    const { formatters: f } = e.exports;
    f.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((h) => h.trim()).join(" ");
    }, f.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(Wa, Wa.exports)), Wa.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? fu.exports = Vj() : fu.exports = Gj();
var Hj = fu.exports, aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.ProgressCallbackTransform = void 0;
const zj = Xs;
class Kj extends zj.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
aa.ProgressCallbackTransform = Kj;
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.DigestTransform = vt.HttpExecutor = vt.HttpError = void 0;
vt.createHttpError = hu;
vt.parseJson = tU;
vt.configureRequestOptionsFromUrl = ev;
vt.configureRequestUrl = Fd;
vt.safeGetHeader = Oi;
vt.configureRequestOptions = ko;
vt.safeStringifyJson = Fo;
const Wj = Js, Yj = Hj, Xj = mn, Jj = Xs, du = yn, Qj = fn, bm = Yi, Zj = aa, Tn = (0, Yj.default)("electron-builder");
function hu(e, t = null) {
  return new kd(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Fo(e.headers), t);
}
const eU = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class kd extends Error {
  constructor(t, r = `HTTP error: ${eU.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
vt.HttpError = kd;
function tU(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class vi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Qj.CancellationToken(), n) {
    ko(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      Tn(i);
      const { headers: a, ...o } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": s.length,
          ...a
        },
        ...o
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(s));
  }
  doApiRequest(t, r, n, i = 0) {
    return Tn.enabled && Tn(`Request: ${Fo(t)}`), r.createPromise((s, a, o) => {
      const c = this.createRequest(t, (u) => {
        try {
          this.handleResponse(u, t, r, s, a, i, n);
        } catch (l) {
          a(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, a, t.timeout), this.addRedirectHandlers(c, t, a, i, (u) => {
        this.doApiRequest(u, r, n, i).then(s).catch(a);
      }), n(c, a), o(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, s) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, s, a, o) {
    var c;
    if (Tn.enabled && Tn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Fo(r)}`), t.statusCode === 404) {
      s(hu(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, f = Oi(t, "location");
    if (l && f != null) {
      if (a > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(vi.prepareRedirectUrlOptions(f, r), n, o, a).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", s), t.on("data", (h) => p += h), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const h = Oi(t, "content-type"), $ = h != null && (Array.isArray(h) ? h.find((y) => y.includes("json")) != null : h.includes("json"));
          s(hu(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${$ ? JSON.stringify(JSON.parse(p)) : p}
          `));
        } else
          i(p.length === 0 ? null : p);
      } catch (h) {
        s(h);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, s) => {
      const a = [], o = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Fd(t, o), ko(o), this.doDownload(o, {
        destination: null,
        options: r,
        onCancel: s,
        callback: (c) => {
          c == null ? n(Buffer.concat(a)) : i(c);
        },
        responseHandler: (c, u) => {
          let l = 0;
          c.on("data", (f) => {
            if (l += f.length, l > 524288e3) {
              u(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), c.on("end", () => {
            u(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (s) => {
      if (s.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${s.statusCode}: ${s.statusMessage}`));
        return;
      }
      s.on("error", r.callback);
      const a = Oi(s, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(vi.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? nU(r, s) : r.responseHandler(s, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (s) => {
      this.doDownload(s, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = ev(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const s = vi.reconstructOriginalUrl(r), a = Z$(t, r);
      vi.isCrossOriginRedirect(s, a) && (Tn.enabled && Tn(`Given the cross-origin redirect (from ${s.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new du.URL(`${r}//${n}${i}${s}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof kd && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
vt.HttpExecutor = vi;
function Z$(e, t) {
  try {
    return new du.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new du.URL(e, s);
  }
}
function ev(e, t) {
  const r = ko(t), n = Z$(e, t);
  return Fd(n, r), r;
}
function Fd(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class pu extends Jj.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Wj.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, bm.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, bm.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
vt.DigestTransform = pu;
function rU(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Oi(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function nU(e, t) {
  if (!rU(Oi(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = Oi(t, "content-length");
    a != null && r.push(new Zj.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new pu(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new pu(e.options.sha2, "sha256", "hex"));
  const i = (0, Xj.createWriteStream)(e.destination);
  r.push(i);
  let s = t;
  for (const a of r)
    a.on("error", (o) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(o);
    }), s = s.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function ko(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Fo(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.MemoLazy = void 0;
class iU {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && tv(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
pc.MemoLazy = iU;
function tv(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((a) => tv(e[a], t[a]));
  }
  return e === t;
}
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.githubUrl = sU;
oa.githubTagPrefix = aU;
oa.getS3LikeProviderBaseUrl = oU;
function sU(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function aU(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function oU(e) {
  const t = e.provider;
  if (t === "s3")
    return cU(e);
  if (t === "spaces")
    return lU(e);
  throw new Error(`Not supported provider: ${t}`);
}
function cU(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return rv(t, e.path);
}
function rv(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function lU(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return rv(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ld = {};
Object.defineProperty(Ld, "__esModule", { value: !0 });
Ld.retry = nv;
const uU = fn;
async function nv(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: a = 0, shouldRetry: o, cancellationToken: c = new uU.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((r = o == null ? void 0 : o(u)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * a)), await nv(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw u;
  }
}
var jd = {};
Object.defineProperty(jd, "__esModule", { value: !0 });
jd.parseDn = fU;
function fU(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const s = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && s.set(r, n);
      break;
    }
    const o = e[a];
    if (t) {
      if (o === '"') {
        t = !1;
        continue;
      }
    } else {
      if (o === '"') {
        t = !0;
        continue;
      }
      if (o === "\\") {
        a++;
        const c = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(c) ? n += e[a] : (a++, n += String.fromCharCode(c));
        continue;
      }
      if (r === null && o === "=") {
        r = n, n = "";
        continue;
      }
      if (o === "," || o === ";" || o === "+") {
        r !== null && s.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (o === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let c = a;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += o;
  }
  return s;
}
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.nil = ji.UUID = void 0;
const iv = Js, sv = Yi, dU = "options.name must be either a string or a Buffer", Pm = (0, iv.randomBytes)(16);
Pm[0] = Pm[0] | 1;
const Eo = {}, _e = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Eo[t] = e, _e[e] = t;
}
class Wn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Wn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return hU(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = pU(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Eo[t[14] + t[15]] & 240) >> 4,
        variant: Tm((Eo[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: Tm((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, sv.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Eo[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
ji.UUID = Wn;
Wn.OID = Wn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Tm(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Is;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Is || (Is = {}));
function hU(e, t, r, n, i = Is.ASCII) {
  const s = (0, iv.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, sv.newError)(dU, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const o = s.digest();
  let c;
  switch (i) {
    case Is.BINARY:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, c = o;
      break;
    case Is.OBJECT:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, c = new Wn(o);
      break;
    default:
      c = _e[o[0]] + _e[o[1]] + _e[o[2]] + _e[o[3]] + "-" + _e[o[4]] + _e[o[5]] + "-" + _e[o[6] & 15 | r] + _e[o[7]] + "-" + _e[o[8] & 63 | 128] + _e[o[9]] + "-" + _e[o[10]] + _e[o[11]] + _e[o[12]] + _e[o[13]] + _e[o[14]] + _e[o[15]];
      break;
  }
  return c;
}
function pU(e) {
  return _e[e[0]] + _e[e[1]] + _e[e[2]] + _e[e[3]] + "-" + _e[e[4]] + _e[e[5]] + "-" + _e[e[6]] + _e[e[7]] + "-" + _e[e[8]] + _e[e[9]] + "-" + _e[e[10]] + _e[e[11]] + _e[e[12]] + _e[e[13]] + _e[e[14]] + _e[e[15]];
}
ji.nil = new Wn("00000000-0000-0000-0000-000000000000");
var ca = {}, av = {};
(function(e) {
  (function(t) {
    t.parser = function(S, _) {
      return new n(S, _);
    }, t.SAXParser = n, t.SAXStream = f, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(S, _) {
      if (!(this instanceof n))
        return new n(S, _);
      var M = this;
      s(M), M.q = M.c = "", M.bufferCheckPosition = t.MAX_BUFFER_LENGTH, M.encoding = null, M.opt = _ || {}, M.opt.lowercase = M.opt.lowercase || M.opt.lowercasetags, M.looseCase = M.opt.lowercase ? "toLowerCase" : "toUpperCase", M.opt.maxEntityCount = M.opt.maxEntityCount || 512, M.opt.maxEntityDepth = M.opt.maxEntityDepth || 4, M.entityCount = M.entityDepth = 0, M.tags = [], M.closed = M.closedRoot = M.sawRoot = !1, M.tag = M.error = null, M.strict = !!S, M.noscript = !!(S || M.opt.noscript), M.state = A.BEGIN, M.strictEntities = M.opt.strictEntities, M.ENTITIES = M.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), M.attribList = [], M.opt.xmlns && (M.ns = Object.create(v)), M.opt.unquotedAttributeValues === void 0 && (M.opt.unquotedAttributeValues = !S), M.trackPosition = M.opt.position !== !1, M.trackPosition && (M.position = M.line = M.column = 0), K(M, "onready");
    }
    Object.create || (Object.create = function(S) {
      function _() {
      }
      _.prototype = S;
      var M = new _();
      return M;
    }), Object.keys || (Object.keys = function(S) {
      var _ = [];
      for (var M in S) S.hasOwnProperty(M) && _.push(M);
      return _;
    });
    function i(S) {
      for (var _ = Math.max(t.MAX_BUFFER_LENGTH, 10), M = 0, k = 0, ye = r.length; k < ye; k++) {
        var Ee = S[r[k]].length;
        if (Ee > _)
          switch (r[k]) {
            case "textNode":
              V(S);
              break;
            case "cdata":
              L(S, "oncdata", S.cdata), S.cdata = "";
              break;
            case "script":
              L(S, "onscript", S.script), S.script = "";
              break;
            default:
              O(S, "Max buffer length exceeded: " + r[k]);
          }
        M = Math.max(M, Ee);
      }
      var we = t.MAX_BUFFER_LENGTH - M;
      S.bufferCheckPosition = we + S.position;
    }
    function s(S) {
      for (var _ = 0, M = r.length; _ < M; _++)
        S[r[_]] = "";
    }
    function a(S) {
      V(S), S.cdata !== "" && (L(S, "oncdata", S.cdata), S.cdata = ""), S.script !== "" && (L(S, "onscript", S.script), S.script = "");
    }
    n.prototype = {
      end: function() {
        w(this);
      },
      write: ce,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var o;
    try {
      o = require("stream").Stream;
    } catch {
      o = function() {
      };
    }
    o || (o = function() {
    });
    var c = t.EVENTS.filter(function(S) {
      return S !== "error" && S !== "end";
    });
    function u(S, _) {
      return new f(S, _);
    }
    function l(S, _) {
      if (S.length >= 2) {
        if (S[0] === 255 && S[1] === 254)
          return "utf-16le";
        if (S[0] === 254 && S[1] === 255)
          return "utf-16be";
      }
      return S.length >= 3 && S[0] === 239 && S[1] === 187 && S[2] === 191 ? "utf8" : S.length >= 4 ? S[0] === 60 && S[1] === 0 && S[2] === 63 && S[3] === 0 ? "utf-16le" : S[0] === 0 && S[1] === 60 && S[2] === 0 && S[3] === 63 ? "utf-16be" : "utf8" : _ ? "utf8" : null;
    }
    function f(S, _) {
      if (!(this instanceof f))
        return new f(S, _);
      o.apply(this), this._parser = new n(S, _), this.writable = !0, this.readable = !0;
      var M = this;
      this._parser.onend = function() {
        M.emit("end");
      }, this._parser.onerror = function(k) {
        M.emit("error", k), M._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(k) {
        Object.defineProperty(M, "on" + k, {
          get: function() {
            return M._parser["on" + k];
          },
          set: function(ye) {
            if (!ye)
              return M.removeAllListeners(k), M._parser["on" + k] = ye, ye;
            M.on(k, ye);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(o.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype._decodeBuffer = function(S, _) {
      if (this._decoderBuffer && (S = Buffer.concat([this._decoderBuffer, S]), this._decoderBuffer = null), !this._decoder) {
        var M = l(S, _);
        if (!M)
          return this._decoderBuffer = S, "";
        this._parser.encoding = M, this._decoder = new TextDecoder(M);
      }
      return this._decoder.decode(S, { stream: !_ });
    }, f.prototype.write = function(S) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(S))
        S = this._decodeBuffer(S, !1);
      else if (this._decoderBuffer) {
        var _ = this._decodeBuffer(Buffer.alloc(0), !0);
        _ && (this._parser.write(_), this.emit("data", _));
      }
      return this._parser.write(S.toString()), this.emit("data", S), !0;
    }, f.prototype.end = function(S) {
      if (S && S.length && this.write(S), this._decoderBuffer) {
        var _ = this._decodeBuffer(Buffer.alloc(0), !0);
        _ && (this._parser.write(_), this.emit("data", _));
      } else if (this._decoder) {
        var M = this._decoder.decode();
        M && (this._parser.write(M), this.emit("data", M));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(S, _) {
      var M = this;
      return !M._parser["on" + S] && c.indexOf(S) !== -1 && (M._parser["on" + S] = function() {
        var k = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        k.splice(0, 0, S), M.emit.apply(M, k);
      }), o.prototype.on.call(M, S, _);
    };
    var p = "[CDATA[", h = "DOCTYPE", $ = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", v = { xml: $, xmlns: y }, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, E = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function j(S) {
      return S === " " || S === `
` || S === "\r" || S === "	";
    }
    function z(S) {
      return S === '"' || S === "'";
    }
    function Q(S) {
      return S === ">" || j(S);
    }
    function se(S, _) {
      return S.test(_);
    }
    function W(S, _) {
      return !se(S, _);
    }
    var A = 0;
    t.STATE = {
      BEGIN: A++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: A++,
      // leading whitespace
      TEXT: A++,
      // general stuff
      TEXT_ENTITY: A++,
      // &amp and such.
      OPEN_WAKA: A++,
      // <
      SGML_DECL: A++,
      // <!BLARG
      SGML_DECL_QUOTED: A++,
      // <!BLARG foo "bar
      DOCTYPE: A++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: A++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: A++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: A++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: A++,
      // <!-
      COMMENT: A++,
      // <!--
      COMMENT_ENDING: A++,
      // <!-- blah -
      COMMENT_ENDED: A++,
      // <!-- blah --
      CDATA: A++,
      // <![CDATA[ something
      CDATA_ENDING: A++,
      // ]
      CDATA_ENDING_2: A++,
      // ]]
      PROC_INST: A++,
      // <?hi
      PROC_INST_BODY: A++,
      // <?hi there
      PROC_INST_ENDING: A++,
      // <?hi "there" ?
      OPEN_TAG: A++,
      // <strong
      OPEN_TAG_SLASH: A++,
      // <strong /
      ATTRIB: A++,
      // <a
      ATTRIB_NAME: A++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: A++,
      // <a foo _
      ATTRIB_VALUE: A++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: A++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: A++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: A++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: A++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: A++,
      // <foo bar=&quot
      CLOSE_TAG: A++,
      // </a
      CLOSE_TAG_SAW_WHITE: A++,
      // </a   >
      SCRIPT: A++,
      // <script> ...
      SCRIPT_ENDING: A++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(S) {
      var _ = t.ENTITIES[S], M = typeof _ == "number" ? String.fromCharCode(_) : _;
      t.ENTITIES[S] = M;
    });
    for (var H in t.STATE)
      t.STATE[t.STATE[H]] = H;
    A = t.STATE;
    function K(S, _, M) {
      S[_] && S[_](M);
    }
    function ne(S) {
      var _ = S && S.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return _ ? _[2] : null;
    }
    function C(S) {
      return S ? S.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function I(S, _) {
      const M = C(S), k = C(_);
      return !M || !k ? !0 : k === "utf16" ? M === "utf16le" || M === "utf16be" : M === k;
    }
    function x(S, _) {
      if (!(!S.strict || !S.encoding || !_ || _.name !== "xml")) {
        var M = ne(_.body);
        M && !I(S.encoding, M) && P(
          S,
          "XML declaration encoding " + M + " does not match detected stream encoding " + S.encoding.toUpperCase()
        );
      }
    }
    function L(S, _, M) {
      S.textNode && V(S), K(S, _, M);
    }
    function V(S) {
      S.textNode = U(S.opt, S.textNode), S.textNode && K(S, "ontext", S.textNode), S.textNode = "";
    }
    function U(S, _) {
      return S.trim && (_ = _.trim()), S.normalize && (_ = _.replace(/\s+/g, " ")), _;
    }
    function O(S, _) {
      return V(S), S.trackPosition && (_ += `
Line: ` + S.line + `
Column: ` + S.column + `
Char: ` + S.c), _ = new Error(_), S.error = _, K(S, "onerror", _), S;
    }
    function w(S) {
      return S.sawRoot && !S.closedRoot && P(S, "Unclosed root tag"), S.state !== A.BEGIN && S.state !== A.BEGIN_WHITESPACE && S.state !== A.TEXT && O(S, "Unexpected end"), V(S), S.c = "", S.closed = !0, K(S, "onend"), n.call(S, S.strict, S.opt), S;
    }
    function P(S, _) {
      if (typeof S != "object" || !(S instanceof n))
        throw new Error("bad call to strictFail");
      S.strict && O(S, _);
    }
    function b(S) {
      S.strict || (S.tagName = S.tagName[S.looseCase]());
      var _ = S.tags[S.tags.length - 1] || S, M = S.tag = { name: S.tagName, attributes: {} };
      S.opt.xmlns && (M.ns = _.ns), S.attribList.length = 0, L(S, "onopentagstart", M);
    }
    function d(S, _) {
      var M = S.indexOf(":"), k = M < 0 ? ["", S] : S.split(":"), ye = k[0], Ee = k[1];
      return _ && S === "xmlns" && (ye = "xmlns", Ee = ""), { prefix: ye, local: Ee };
    }
    function g(S) {
      if (S.strict || (S.attribName = S.attribName[S.looseCase]()), S.attribList.indexOf(S.attribName) !== -1 || S.tag.attributes.hasOwnProperty(S.attribName)) {
        S.attribName = S.attribValue = "";
        return;
      }
      if (S.opt.xmlns) {
        var _ = d(S.attribName, !0), M = _.prefix, k = _.local;
        if (M === "xmlns")
          if (k === "xml" && S.attribValue !== $)
            P(
              S,
              "xml: prefix must be bound to " + $ + `
Actual: ` + S.attribValue
            );
          else if (k === "xmlns" && S.attribValue !== y)
            P(
              S,
              "xmlns: prefix must be bound to " + y + `
Actual: ` + S.attribValue
            );
          else {
            var ye = S.tag, Ee = S.tags[S.tags.length - 1] || S;
            ye.ns === Ee.ns && (ye.ns = Object.create(Ee.ns)), ye.ns[k] = S.attribValue;
          }
        S.attribList.push([S.attribName, S.attribValue]);
      } else
        S.tag.attributes[S.attribName] = S.attribValue, L(S, "onattribute", {
          name: S.attribName,
          value: S.attribValue
        });
      S.attribName = S.attribValue = "";
    }
    function R(S, _) {
      if (S.opt.xmlns) {
        var M = S.tag, k = d(S.tagName);
        M.prefix = k.prefix, M.local = k.local, M.uri = M.ns[k.prefix] || "", M.prefix && !M.uri && (P(
          S,
          "Unbound namespace prefix: " + JSON.stringify(S.tagName)
        ), M.uri = k.prefix);
        var ye = S.tags[S.tags.length - 1] || S;
        M.ns && ye.ns !== M.ns && Object.keys(M.ns).forEach(function(dt) {
          L(S, "onopennamespace", {
            prefix: dt,
            uri: M.ns[dt]
          });
        });
        for (var Ee = 0, we = S.attribList.length; Ee < we; Ee++) {
          var Ae = S.attribList[Ee], Ie = Ae[0], Ve = Ae[1], Se = d(Ie, !0), qe = Se.prefix, Gt = Se.local, jt = qe === "" ? "" : M.ns[qe] || "", Ye = {
            name: Ie,
            value: Ve,
            prefix: qe,
            local: Gt,
            uri: jt
          };
          qe && qe !== "xmlns" && !jt && (P(
            S,
            "Unbound namespace prefix: " + JSON.stringify(qe)
          ), Ye.uri = qe), S.tag.attributes[Ie] = Ye, L(S, "onattribute", Ye);
        }
        S.attribList.length = 0;
      }
      S.tag.isSelfClosing = !!_, S.sawRoot = !0, S.tags.push(S.tag), L(S, "onopentag", S.tag), _ || (!S.noscript && S.tagName.toLowerCase() === "script" ? S.state = A.SCRIPT : S.state = A.TEXT, S.tag = null, S.tagName = ""), S.attribName = S.attribValue = "", S.attribList.length = 0;
    }
    function q(S) {
      if (!S.tagName) {
        P(S, "Weird empty close tag."), S.textNode += "</>", S.state = A.TEXT;
        return;
      }
      if (S.script) {
        if (S.tagName !== "script") {
          S.script += "</" + S.tagName + ">", S.tagName = "", S.state = A.SCRIPT;
          return;
        }
        L(S, "onscript", S.script), S.script = "";
      }
      var _ = S.tags.length, M = S.tagName;
      S.strict || (M = M[S.looseCase]());
      for (var k = M; _--; ) {
        var ye = S.tags[_];
        if (ye.name !== k)
          P(S, "Unexpected close tag");
        else
          break;
      }
      if (_ < 0) {
        P(S, "Unmatched closing tag: " + S.tagName), S.textNode += "</" + S.tagName + ">", S.state = A.TEXT;
        return;
      }
      S.tagName = M;
      for (var Ee = S.tags.length; Ee-- > _; ) {
        var we = S.tag = S.tags.pop();
        S.tagName = S.tag.name, L(S, "onclosetag", S.tagName);
        var Ae = {};
        for (var Ie in we.ns)
          Ae[Ie] = we.ns[Ie];
        var Ve = S.tags[S.tags.length - 1] || S;
        S.opt.xmlns && we.ns !== Ve.ns && Object.keys(we.ns).forEach(function(Se) {
          var qe = we.ns[Se];
          L(S, "onclosenamespace", { prefix: Se, uri: qe });
        });
      }
      _ === 0 && (S.closedRoot = !0), S.tagName = S.attribValue = S.attribName = "", S.attribList.length = 0, S.state = A.TEXT;
    }
    function B(S) {
      var _ = S.entity, M = _.toLowerCase(), k, ye = "";
      return S.ENTITIES[_] ? S.ENTITIES[_] : S.ENTITIES[M] ? S.ENTITIES[M] : (_ = M, _.charAt(0) === "#" && (_.charAt(1) === "x" ? (_ = _.slice(2), k = parseInt(_, 16), ye = k.toString(16)) : (_ = _.slice(1), k = parseInt(_, 10), ye = k.toString(10))), _ = _.replace(/^0+/, ""), isNaN(k) || ye.toLowerCase() !== _ || k < 0 || k > 1114111 ? (P(S, "Invalid character entity"), "&" + S.entity + ";") : String.fromCodePoint(k));
    }
    function ee(S, _) {
      _ === "<" ? (S.state = A.OPEN_WAKA, S.startTagPosition = S.position) : j(_) || (P(S, "Non-whitespace before first tag."), S.textNode = _, S.state = A.TEXT);
    }
    function X(S, _) {
      var M = "";
      return _ < S.length && (M = S.charAt(_)), M;
    }
    function ce(S) {
      var _ = this;
      if (this.error)
        throw this.error;
      if (_.closed)
        return O(
          _,
          "Cannot write after close. Assign an onready handler."
        );
      if (S === null)
        return w(_);
      typeof S == "object" && (S = S.toString());
      for (var M = 0, k = ""; k = X(S, M++), _.c = k, !!k; )
        switch (_.trackPosition && (_.position++, k === `
` ? (_.line++, _.column = 0) : _.column++), _.state) {
          case A.BEGIN:
            if (_.state = A.BEGIN_WHITESPACE, k === "\uFEFF")
              continue;
            ee(_, k);
            continue;
          case A.BEGIN_WHITESPACE:
            ee(_, k);
            continue;
          case A.TEXT:
            if (_.sawRoot && !_.closedRoot) {
              for (var Ee = M - 1; k && k !== "<" && k !== "&"; )
                k = X(S, M++), k && _.trackPosition && (_.position++, k === `
` ? (_.line++, _.column = 0) : _.column++);
              _.textNode += S.substring(Ee, M - 1);
            }
            k === "<" && !(_.sawRoot && _.closedRoot && !_.strict) ? (_.state = A.OPEN_WAKA, _.startTagPosition = _.position) : (!j(k) && (!_.sawRoot || _.closedRoot) && P(_, "Text data outside of root node."), k === "&" ? _.state = A.TEXT_ENTITY : _.textNode += k);
            continue;
          case A.SCRIPT:
            k === "<" ? _.state = A.SCRIPT_ENDING : _.script += k;
            continue;
          case A.SCRIPT_ENDING:
            k === "/" ? _.state = A.CLOSE_TAG : (_.script += "<" + k, _.state = A.SCRIPT);
            continue;
          case A.OPEN_WAKA:
            if (k === "!")
              _.state = A.SGML_DECL, _.sgmlDecl = "";
            else if (!j(k)) if (se(m, k))
              _.state = A.OPEN_TAG, _.tagName = k;
            else if (k === "/")
              _.state = A.CLOSE_TAG, _.tagName = "";
            else if (k === "?")
              _.state = A.PROC_INST, _.procInstName = _.procInstBody = "";
            else {
              if (P(_, "Unencoded <"), _.startTagPosition + 1 < _.position) {
                var ye = _.position - _.startTagPosition;
                k = new Array(ye).join(" ") + k;
              }
              _.textNode += "<" + k, _.state = A.TEXT;
            }
            continue;
          case A.SGML_DECL:
            if (_.sgmlDecl + k === "--") {
              _.state = A.COMMENT, _.comment = "", _.sgmlDecl = "";
              continue;
            }
            _.doctype && _.doctype !== !0 && _.sgmlDecl ? (_.state = A.DOCTYPE_DTD, _.doctype += "<!" + _.sgmlDecl + k, _.sgmlDecl = "") : (_.sgmlDecl + k).toUpperCase() === p ? (L(_, "onopencdata"), _.state = A.CDATA, _.sgmlDecl = "", _.cdata = "") : (_.sgmlDecl + k).toUpperCase() === h ? (_.state = A.DOCTYPE, (_.doctype || _.sawRoot) && P(
              _,
              "Inappropriately located doctype declaration"
            ), _.doctype = "", _.sgmlDecl = "") : k === ">" ? (L(_, "onsgmldeclaration", _.sgmlDecl), _.sgmlDecl = "", _.state = A.TEXT) : (z(k) && (_.state = A.SGML_DECL_QUOTED), _.sgmlDecl += k);
            continue;
          case A.SGML_DECL_QUOTED:
            k === _.q && (_.state = A.SGML_DECL, _.q = ""), _.sgmlDecl += k;
            continue;
          case A.DOCTYPE:
            k === ">" ? (_.state = A.TEXT, L(_, "ondoctype", _.doctype), _.doctype = !0) : (_.doctype += k, k === "[" ? _.state = A.DOCTYPE_DTD : z(k) && (_.state = A.DOCTYPE_QUOTED, _.q = k));
            continue;
          case A.DOCTYPE_QUOTED:
            _.doctype += k, k === _.q && (_.q = "", _.state = A.DOCTYPE);
            continue;
          case A.DOCTYPE_DTD:
            k === "]" ? (_.doctype += k, _.state = A.DOCTYPE) : k === "<" ? (_.state = A.OPEN_WAKA, _.startTagPosition = _.position) : z(k) ? (_.doctype += k, _.state = A.DOCTYPE_DTD_QUOTED, _.q = k) : _.doctype += k;
            continue;
          case A.DOCTYPE_DTD_QUOTED:
            _.doctype += k, k === _.q && (_.state = A.DOCTYPE_DTD, _.q = "");
            continue;
          case A.COMMENT:
            k === "-" ? _.state = A.COMMENT_ENDING : _.comment += k;
            continue;
          case A.COMMENT_ENDING:
            k === "-" ? (_.state = A.COMMENT_ENDED, _.comment = U(_.opt, _.comment), _.comment && L(_, "oncomment", _.comment), _.comment = "") : (_.comment += "-" + k, _.state = A.COMMENT);
            continue;
          case A.COMMENT_ENDED:
            k !== ">" ? (P(_, "Malformed comment"), _.comment += "--" + k, _.state = A.COMMENT) : _.doctype && _.doctype !== !0 ? _.state = A.DOCTYPE_DTD : _.state = A.TEXT;
            continue;
          case A.CDATA:
            for (var Ee = M - 1; k && k !== "]"; )
              k = X(S, M++), k && _.trackPosition && (_.position++, k === `
` ? (_.line++, _.column = 0) : _.column++);
            _.cdata += S.substring(Ee, M - 1), k === "]" && (_.state = A.CDATA_ENDING);
            continue;
          case A.CDATA_ENDING:
            k === "]" ? _.state = A.CDATA_ENDING_2 : (_.cdata += "]" + k, _.state = A.CDATA);
            continue;
          case A.CDATA_ENDING_2:
            k === ">" ? (_.cdata && L(_, "oncdata", _.cdata), L(_, "onclosecdata"), _.cdata = "", _.state = A.TEXT) : k === "]" ? _.cdata += "]" : (_.cdata += "]]" + k, _.state = A.CDATA);
            continue;
          case A.PROC_INST:
            k === "?" ? _.state = A.PROC_INST_ENDING : j(k) ? _.state = A.PROC_INST_BODY : _.procInstName += k;
            continue;
          case A.PROC_INST_BODY:
            if (!_.procInstBody && j(k))
              continue;
            k === "?" ? _.state = A.PROC_INST_ENDING : _.procInstBody += k;
            continue;
          case A.PROC_INST_ENDING:
            if (k === ">") {
              const Ve = {
                name: _.procInstName,
                body: _.procInstBody
              };
              x(_, Ve), L(_, "onprocessinginstruction", Ve), _.procInstName = _.procInstBody = "", _.state = A.TEXT;
            } else
              _.procInstBody += "?" + k, _.state = A.PROC_INST_BODY;
            continue;
          case A.OPEN_TAG:
            se(E, k) ? _.tagName += k : (b(_), k === ">" ? R(_) : k === "/" ? _.state = A.OPEN_TAG_SLASH : (j(k) || P(_, "Invalid character in tag name"), _.state = A.ATTRIB));
            continue;
          case A.OPEN_TAG_SLASH:
            k === ">" ? (R(_, !0), q(_)) : (P(
              _,
              "Forward-slash in opening tag not followed by >"
            ), _.state = A.ATTRIB);
            continue;
          case A.ATTRIB:
            if (j(k))
              continue;
            k === ">" ? R(_) : k === "/" ? _.state = A.OPEN_TAG_SLASH : se(m, k) ? (_.attribName = k, _.attribValue = "", _.state = A.ATTRIB_NAME) : P(_, "Invalid attribute name");
            continue;
          case A.ATTRIB_NAME:
            k === "=" ? _.state = A.ATTRIB_VALUE : k === ">" ? (P(_, "Attribute without value"), _.attribValue = _.attribName, g(_), R(_)) : j(k) ? _.state = A.ATTRIB_NAME_SAW_WHITE : se(E, k) ? _.attribName += k : P(_, "Invalid attribute name");
            continue;
          case A.ATTRIB_NAME_SAW_WHITE:
            if (k === "=")
              _.state = A.ATTRIB_VALUE;
            else {
              if (j(k))
                continue;
              P(_, "Attribute without value"), _.tag.attributes[_.attribName] = "", _.attribValue = "", L(_, "onattribute", {
                name: _.attribName,
                value: ""
              }), _.attribName = "", k === ">" ? R(_) : se(m, k) ? (_.attribName = k, _.state = A.ATTRIB_NAME) : (P(_, "Invalid attribute name"), _.state = A.ATTRIB);
            }
            continue;
          case A.ATTRIB_VALUE:
            if (j(k))
              continue;
            z(k) ? (_.q = k, _.state = A.ATTRIB_VALUE_QUOTED) : (_.opt.unquotedAttributeValues || O(_, "Unquoted attribute value"), _.state = A.ATTRIB_VALUE_UNQUOTED, _.attribValue = k);
            continue;
          case A.ATTRIB_VALUE_QUOTED:
            if (k !== _.q) {
              k === "&" ? _.state = A.ATTRIB_VALUE_ENTITY_Q : _.attribValue += k;
              continue;
            }
            g(_), _.q = "", _.state = A.ATTRIB_VALUE_CLOSED;
            continue;
          case A.ATTRIB_VALUE_CLOSED:
            j(k) ? _.state = A.ATTRIB : k === ">" ? R(_) : k === "/" ? _.state = A.OPEN_TAG_SLASH : se(m, k) ? (P(_, "No whitespace between attributes"), _.attribName = k, _.attribValue = "", _.state = A.ATTRIB_NAME) : P(_, "Invalid attribute name");
            continue;
          case A.ATTRIB_VALUE_UNQUOTED:
            if (!Q(k)) {
              k === "&" ? _.state = A.ATTRIB_VALUE_ENTITY_U : _.attribValue += k;
              continue;
            }
            g(_), k === ">" ? R(_) : _.state = A.ATTRIB;
            continue;
          case A.CLOSE_TAG:
            if (_.tagName)
              k === ">" ? q(_) : se(E, k) ? _.tagName += k : _.script ? (_.script += "</" + _.tagName + k, _.tagName = "", _.state = A.SCRIPT) : (j(k) || P(_, "Invalid tagname in closing tag"), _.state = A.CLOSE_TAG_SAW_WHITE);
            else {
              if (j(k))
                continue;
              W(m, k) ? _.script ? (_.script += "</" + k, _.state = A.SCRIPT) : P(_, "Invalid tagname in closing tag.") : _.tagName = k;
            }
            continue;
          case A.CLOSE_TAG_SAW_WHITE:
            if (j(k))
              continue;
            k === ">" ? q(_) : P(_, "Invalid characters in closing tag");
            continue;
          case A.TEXT_ENTITY:
          case A.ATTRIB_VALUE_ENTITY_Q:
          case A.ATTRIB_VALUE_ENTITY_U:
            var we, Ae;
            switch (_.state) {
              case A.TEXT_ENTITY:
                we = A.TEXT, Ae = "textNode";
                break;
              case A.ATTRIB_VALUE_ENTITY_Q:
                we = A.ATTRIB_VALUE_QUOTED, Ae = "attribValue";
                break;
              case A.ATTRIB_VALUE_ENTITY_U:
                we = A.ATTRIB_VALUE_UNQUOTED, Ae = "attribValue";
                break;
            }
            if (k === ";") {
              var Ie = B(_);
              _.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ie) ? ((_.entityCount += 1) > _.opt.maxEntityCount && O(
                _,
                "Parsed entity count exceeds max entity count"
              ), (_.entityDepth += 1) > _.opt.maxEntityDepth && O(
                _,
                "Parsed entity depth exceeds max entity depth"
              ), _.entity = "", _.state = we, _.write(Ie), _.entityDepth -= 1) : (_[Ae] += Ie, _.entity = "", _.state = we);
            } else se(_.entity.length ? D : N, k) ? _.entity += k : (P(_, "Invalid character in entity name"), _[Ae] += "&" + _.entity + k, _.entity = "", _.state = we);
            continue;
          default:
            throw new Error(_, "Unknown state: " + _.state);
        }
      return _.position >= _.bufferCheckPosition && i(_), _;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var S = String.fromCharCode, _ = Math.floor, M = function() {
        var k = 16384, ye = [], Ee, we, Ae = -1, Ie = arguments.length;
        if (!Ie)
          return "";
        for (var Ve = ""; ++Ae < Ie; ) {
          var Se = Number(arguments[Ae]);
          if (!isFinite(Se) || // `NaN`, `+Infinity`, or `-Infinity`
          Se < 0 || // not a valid Unicode code point
          Se > 1114111 || // not a valid Unicode code point
          _(Se) !== Se)
            throw RangeError("Invalid code point: " + Se);
          Se <= 65535 ? ye.push(Se) : (Se -= 65536, Ee = (Se >> 10) + 55296, we = Se % 1024 + 56320, ye.push(Ee, we)), (Ae + 1 === Ie || ye.length > k) && (Ve += S.apply(null, ye), ye.length = 0);
        }
        return Ve;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: M,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = M;
    }();
  })(e);
})(av);
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.XElement = void 0;
ca.parseXml = $U;
const mU = av, Ya = Yi;
class ov {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ya.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!gU(t))
      throw (0, Ya.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Ya.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Ya.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Nm(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Nm(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
ca.XElement = ov;
const yU = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function gU(e) {
  return yU.test(e);
}
function Nm(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function $U(e) {
  let t = null;
  const r = mU.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new ov(i.name);
    if (s.attributes = i.attributes, t === null)
      t = s;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(s);
    }
    n.push(s);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const s = n[n.length - 1];
    s.value = i, s.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = fn;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Yi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = vt;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = pc;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = aa;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var a = oa;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var o = Ld;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return o.retry;
  } });
  var c = jd;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = ji;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = ca;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(p) {
    return p == null ? [] : Array.isArray(p) ? p : [p];
  }
})(He);
var rt = {}, Ud = {}, ar = {};
function cv(e) {
  return typeof e > "u" || e === null;
}
function vU(e) {
  return typeof e == "object" && e !== null;
}
function _U(e) {
  return Array.isArray(e) ? e : cv(e) ? [] : [e];
}
function EU(e, t) {
  var r, n, i, s;
  if (t)
    for (s = Object.keys(t), r = 0, n = s.length; r < n; r += 1)
      i = s[r], e[i] = t[i];
  return e;
}
function wU(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function SU(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
ar.isNothing = cv;
ar.isObject = vU;
ar.toArray = _U;
ar.repeat = wU;
ar.isNegativeZero = SU;
ar.extend = EU;
function lv(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function xs(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = lv(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
xs.prototype = Object.create(Error.prototype);
xs.prototype.constructor = xs;
xs.prototype.toString = function(t) {
  return this.name + ": " + lv(this, t);
};
var la = xs, gs = ar;
function gl(e, t, r, n, i) {
  var s = "", a = "", o = Math.floor(i / 2) - 1;
  return n - t > o && (s = " ... ", t = n - o + s.length), r - n > o && (a = " ...", r = n + o - a.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + s.length
    // relative position
  };
}
function $l(e, t) {
  return gs.repeat(" ", t - e.length) + e;
}
function bU(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], s, a = -1; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var o = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(a - c < 0); c++)
    u = gl(
      e.buffer,
      n[a - c],
      i[a - c],
      e.position - (n[a] - n[a - c]),
      f
    ), o = gs.repeat(" ", t.indent) + $l((e.line - c + 1).toString(), l) + " | " + u.str + `
` + o;
  for (u = gl(e.buffer, n[a], i[a], e.position, f), o += gs.repeat(" ", t.indent) + $l((e.line + 1).toString(), l) + " | " + u.str + `
`, o += gs.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(a + c >= i.length); c++)
    u = gl(
      e.buffer,
      n[a + c],
      i[a + c],
      e.position - (n[a] - n[a + c]),
      f
    ), o += gs.repeat(" ", t.indent) + $l((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return o.replace(/\n$/, "");
}
var PU = bU, Rm = la, TU = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], NU = [
  "scalar",
  "sequence",
  "mapping"
];
function RU(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function OU(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (TU.indexOf(r) === -1)
      throw new Rm('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = RU(t.styleAliases || null), NU.indexOf(this.kind) === -1)
    throw new Rm('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var bt = OU, us = la, vl = bt;
function Om(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(s, a) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function AU() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function mu(e) {
  return this.extend(e);
}
mu.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof vl)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new us("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof vl))
      throw new us("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new us("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new us("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof vl))
      throw new us("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(mu.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Om(i, "implicit"), i.compiledExplicit = Om(i, "explicit"), i.compiledTypeMap = AU(i.compiledImplicit, i.compiledExplicit), i;
};
var uv = mu, IU = bt, fv = new IU("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), CU = bt, dv = new CU("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), DU = bt, hv = new DU("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), kU = uv, pv = new kU({
  explicit: [
    fv,
    dv,
    hv
  ]
}), FU = bt;
function LU(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function jU() {
  return null;
}
function UU(e) {
  return e === null;
}
var mv = new FU("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: LU,
  construct: jU,
  predicate: UU,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), MU = bt;
function xU(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function VU(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function qU(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var yv = new MU("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: xU,
  construct: VU,
  predicate: qU,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), BU = ar, GU = bt;
function HU(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function zU(e) {
  return 48 <= e && e <= 55;
}
function KU(e) {
  return 48 <= e && e <= 57;
}
function WU(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!HU(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!zU(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!KU(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function YU(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function XU(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !BU.isNegativeZero(e);
}
var gv = new GU("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: WU,
  construct: YU,
  predicate: XU,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), $v = ar, JU = bt, QU = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function ZU(e) {
  return !(e === null || !QU.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function e2(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var t2 = /^[-+]?[0-9]+e/;
function r2(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if ($v.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), t2.test(r) ? r.replace("e", ".e") : r;
}
function n2(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || $v.isNegativeZero(e));
}
var vv = new JU("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: ZU,
  construct: e2,
  predicate: n2,
  represent: r2,
  defaultStyle: "lowercase"
}), _v = pv.extend({
  implicit: [
    mv,
    yv,
    gv,
    vv
  ]
}), Ev = _v, i2 = bt, wv = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Sv = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function s2(e) {
  return e === null ? !1 : wv.exec(e) !== null || Sv.exec(e) !== null;
}
function a2(e) {
  var t, r, n, i, s, a, o, c = 0, u = null, l, f, p;
  if (t = wv.exec(e), t === null && (t = Sv.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (s = +t[4], a = +t[5], o = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], f = +(t[11] || 0), u = (l * 60 + f) * 6e4, t[9] === "-" && (u = -u)), p = new Date(Date.UTC(r, n, i, s, a, o, c)), u && p.setTime(p.getTime() - u), p;
}
function o2(e) {
  return e.toISOString();
}
var bv = new i2("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: s2,
  construct: a2,
  instanceOf: Date,
  represent: o2
}), c2 = bt;
function l2(e) {
  return e === "<<" || e === null;
}
var Pv = new c2("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: l2
}), u2 = bt, Md = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function f2(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, s = Md;
  for (r = 0; r < i; r++)
    if (t = s.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function d2(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, s = Md, a = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)), a = a << 6 | s.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)) : r === 18 ? (o.push(a >> 10 & 255), o.push(a >> 2 & 255)) : r === 12 && o.push(a >> 4 & 255), new Uint8Array(o);
}
function h2(e) {
  var t = "", r = 0, n, i, s = e.length, a = Md;
  for (n = 0; n < s; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = s % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function p2(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Tv = new u2("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: f2,
  construct: d2,
  predicate: p2,
  represent: h2
}), m2 = bt, y2 = Object.prototype.hasOwnProperty, g2 = Object.prototype.toString;
function $2(e) {
  if (e === null) return !0;
  var t = [], r, n, i, s, a, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], a = !1, g2.call(i) !== "[object Object]") return !1;
    for (s in i)
      if (y2.call(i, s))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(s) === -1) t.push(s);
    else return !1;
  }
  return !0;
}
function v2(e) {
  return e !== null ? e : [];
}
var Nv = new m2("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: $2,
  construct: v2
}), _2 = bt, E2 = Object.prototype.toString;
function w2(e) {
  if (e === null) return !0;
  var t, r, n, i, s, a = e;
  for (s = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], E2.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    s[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function S2(e) {
  if (e === null) return [];
  var t, r, n, i, s, a = e;
  for (s = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), s[t] = [i[0], n[i[0]]];
  return s;
}
var Rv = new _2("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: w2,
  construct: S2
}), b2 = bt, P2 = Object.prototype.hasOwnProperty;
function T2(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (P2.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function N2(e) {
  return e !== null ? e : {};
}
var Ov = new b2("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: T2,
  construct: N2
}), xd = Ev.extend({
  implicit: [
    bv,
    Pv
  ],
  explicit: [
    Tv,
    Nv,
    Rv,
    Ov
  ]
}), Ln = ar, Av = la, R2 = PU, O2 = xd, dn = Object.prototype.hasOwnProperty, Lo = 1, Iv = 2, Cv = 3, jo = 4, _l = 1, A2 = 2, Am = 3, I2 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, C2 = /[\x85\u2028\u2029]/, D2 = /[,\[\]\{\}]/, Dv = /^(?:!|!!|![a-z\-]+!)$/i, kv = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Im(e) {
  return Object.prototype.toString.call(e);
}
function $r(e) {
  return e === 10 || e === 13;
}
function Bn(e) {
  return e === 9 || e === 32;
}
function Dt(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function _i(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function k2(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function F2(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function L2(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Cm(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function j2(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Fv(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var Lv = new Array(256), jv = new Array(256);
for (var ai = 0; ai < 256; ai++)
  Lv[ai] = Cm(ai) ? 1 : 0, jv[ai] = Cm(ai);
function U2(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || O2, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Uv(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = R2(r), new Av(t, r);
}
function ie(e, t) {
  throw Uv(e, t);
}
function Uo(e, t) {
  e.onWarning && e.onWarning.call(null, Uv(e, t));
}
var Dm = {
  YAML: function(t, r, n) {
    var i, s, a;
    t.version !== null && ie(t, "duplication of %YAML directive"), n.length !== 1 && ie(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && ie(t, "ill-formed argument of the YAML directive"), s = parseInt(i[1], 10), a = parseInt(i[2], 10), s !== 1 && ie(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Uo(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, s;
    n.length !== 2 && ie(t, "TAG directive accepts exactly two arguments"), i = n[0], s = n[1], Dv.test(i) || ie(t, "ill-formed tag handle (first argument) of the TAG directive"), dn.call(t.tagMap, i) && ie(t, 'there is a previously declared suffix for "' + i + '" tag handle'), kv.test(s) || ie(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      s = decodeURIComponent(s);
    } catch {
      ie(t, "tag prefix is malformed: " + s);
    }
    t.tagMap[i] = s;
  }
};
function ln(e, t, r, n) {
  var i, s, a, o;
  if (t < r) {
    if (o = e.input.slice(t, r), n)
      for (i = 0, s = o.length; i < s; i += 1)
        a = o.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || ie(e, "expected valid JSON character");
    else I2.test(o) && ie(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function km(e, t, r, n) {
  var i, s, a, o;
  for (Ln.isObject(r) || ie(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, o = i.length; a < o; a += 1)
    s = i[a], dn.call(t, s) || (Fv(t, s, r[s]), n[s] = !0);
}
function Ei(e, t, r, n, i, s, a, o, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && ie(e, "nested arrays are not supported inside keys"), typeof i == "object" && Im(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && Im(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s))
      for (u = 0, l = s.length; u < l; u += 1)
        km(e, t, s[u], r);
    else
      km(e, t, s, r);
  else
    !e.json && !dn.call(r, i) && dn.call(t, i) && (e.line = a || e.line, e.lineStart = o || e.lineStart, e.position = c || e.position, ie(e, "duplicated mapping key")), Fv(t, i, s), delete r[i];
  return t;
}
function Vd(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : ie(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Me(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Bn(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if ($r(i))
      for (Vd(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Uo(e, "deficient indentation"), n;
}
function mc(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Dt(r)));
}
function qd(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ln.repeat(`
`, t - 1));
}
function M2(e, t, r) {
  var n, i, s, a, o, c, u, l, f = e.kind, p = e.result, h;
  if (h = e.input.charCodeAt(e.position), Dt(h) || _i(h) || h === 35 || h === 38 || h === 42 || h === 33 || h === 124 || h === 62 || h === 39 || h === 34 || h === 37 || h === 64 || h === 96 || (h === 63 || h === 45) && (i = e.input.charCodeAt(e.position + 1), Dt(i) || r && _i(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", s = a = e.position, o = !1; h !== 0; ) {
    if (h === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Dt(i) || r && _i(i))
        break;
    } else if (h === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Dt(n))
        break;
    } else {
      if (e.position === e.lineStart && mc(e) || r && _i(h))
        break;
      if ($r(h))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, Me(e, !1, -1), e.lineIndent >= t) {
          o = !0, h = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    o && (ln(e, s, a, !1), qd(e, e.line - c), s = a = e.position, o = !1), Bn(h) || (a = e.position + 1), h = e.input.charCodeAt(++e.position);
  }
  return ln(e, s, a, !1), e.result ? !0 : (e.kind = f, e.result = p, !1);
}
function x2(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (ln(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else $r(r) ? (ln(e, n, i, !0), qd(e, Me(e, !1, t)), n = i = e.position) : e.position === e.lineStart && mc(e) ? ie(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  ie(e, "unexpected end of the stream within a single quoted scalar");
}
function V2(e, t) {
  var r, n, i, s, a, o;
  if (o = e.input.charCodeAt(e.position), o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return ln(e, r, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (ln(e, r, e.position, !0), o = e.input.charCodeAt(++e.position), $r(o))
        Me(e, !1, t);
      else if (o < 256 && Lv[o])
        e.result += jv[o], e.position++;
      else if ((a = F2(o)) > 0) {
        for (i = a, s = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (a = k2(o)) >= 0 ? s = (s << 4) + a : ie(e, "expected hexadecimal character");
        e.result += j2(s), e.position++;
      } else
        ie(e, "unknown escape sequence");
      r = n = e.position;
    } else $r(o) ? (ln(e, r, n, !0), qd(e, Me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && mc(e) ? ie(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  ie(e, "unexpected end of the stream within a double quoted scalar");
}
function q2(e, t) {
  var r = !0, n, i, s, a = e.tag, o, c = e.anchor, u, l, f, p, h, $ = /* @__PURE__ */ Object.create(null), y, v, m, E;
  if (E = e.input.charCodeAt(e.position), E === 91)
    l = 93, h = !1, o = [];
  else if (E === 123)
    l = 125, h = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), E = e.input.charCodeAt(++e.position); E !== 0; ) {
    if (Me(e, !0, t), E = e.input.charCodeAt(e.position), E === l)
      return e.position++, e.tag = a, e.anchor = c, e.kind = h ? "mapping" : "sequence", e.result = o, !0;
    r ? E === 44 && ie(e, "expected the node content, but found ','") : ie(e, "missed comma between flow collection entries"), v = y = m = null, f = p = !1, E === 63 && (u = e.input.charCodeAt(e.position + 1), Dt(u) && (f = p = !0, e.position++, Me(e, !0, t))), n = e.line, i = e.lineStart, s = e.position, Ui(e, t, Lo, !1, !0), v = e.tag, y = e.result, Me(e, !0, t), E = e.input.charCodeAt(e.position), (p || e.line === n) && E === 58 && (f = !0, E = e.input.charCodeAt(++e.position), Me(e, !0, t), Ui(e, t, Lo, !1, !0), m = e.result), h ? Ei(e, o, $, v, y, m, n, i, s) : f ? o.push(Ei(e, null, $, v, y, m, n, i, s)) : o.push(y), Me(e, !0, t), E = e.input.charCodeAt(e.position), E === 44 ? (r = !0, E = e.input.charCodeAt(++e.position)) : r = !1;
  }
  ie(e, "unexpected end of the stream within a flow collection");
}
function B2(e, t) {
  var r, n, i = _l, s = !1, a = !1, o = t, c = 0, u = !1, l, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      _l === i ? i = f === 43 ? Am : A2 : ie(e, "repeat of a chomping mode identifier");
    else if ((l = L2(f)) >= 0)
      l === 0 ? ie(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? ie(e, "repeat of an indentation width identifier") : (o = t + l - 1, a = !0);
    else
      break;
  if (Bn(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Bn(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!$r(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Vd(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < o) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > o && (o = e.lineIndent), $r(f)) {
      c++;
      continue;
    }
    if (e.lineIndent < o) {
      i === Am ? e.result += Ln.repeat(`
`, s ? 1 + c : c) : i === _l && s && (e.result += `
`);
      break;
    }
    for (n ? Bn(f) ? (u = !0, e.result += Ln.repeat(`
`, s ? 1 + c : c)) : u ? (u = !1, e.result += Ln.repeat(`
`, c + 1)) : c === 0 ? s && (e.result += " ") : e.result += Ln.repeat(`
`, c) : e.result += Ln.repeat(`
`, s ? 1 + c : c), s = !0, a = !0, c = 0, r = e.position; !$r(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    ln(e, r, e.position, !1);
  }
  return !0;
}
function Fm(e, t) {
  var r, n = e.tag, i = e.anchor, s = [], a, o = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ie(e, "tab characters must not be used in indentation")), !(c !== 45 || (a = e.input.charCodeAt(e.position + 1), !Dt(a)))); ) {
    if (o = !0, e.position++, Me(e, !0, -1) && e.lineIndent <= t) {
      s.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Ui(e, t, Cv, !1, !0), s.push(e.result), Me(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      ie(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = s, !0) : !1;
}
function G2(e, t, r) {
  var n, i, s, a, o, c, u = e.tag, l = e.anchor, f = {}, p = /* @__PURE__ */ Object.create(null), h = null, $ = null, y = null, v = !1, m = !1, E;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), E = e.input.charCodeAt(e.position); E !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ie(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), s = e.line, (E === 63 || E === 58) && Dt(n))
      E === 63 ? (v && (Ei(e, f, p, h, $, null, a, o, c), h = $ = y = null), m = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : ie(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, E = n;
    else {
      if (a = e.line, o = e.lineStart, c = e.position, !Ui(e, r, Iv, !1, !0))
        break;
      if (e.line === s) {
        for (E = e.input.charCodeAt(e.position); Bn(E); )
          E = e.input.charCodeAt(++e.position);
        if (E === 58)
          E = e.input.charCodeAt(++e.position), Dt(E) || ie(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (Ei(e, f, p, h, $, null, a, o, c), h = $ = y = null), m = !0, v = !1, i = !1, h = e.tag, $ = e.result;
        else if (m)
          ie(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (m)
        ie(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === s || e.lineIndent > t) && (v && (a = e.line, o = e.lineStart, c = e.position), Ui(e, t, jo, !0, i) && (v ? $ = e.result : y = e.result), v || (Ei(e, f, p, h, $, y, a, o, c), h = $ = y = null), Me(e, !0, -1), E = e.input.charCodeAt(e.position)), (e.line === s || e.lineIndent > t) && E !== 0)
      ie(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && Ei(e, f, p, h, $, null, a, o, c), m && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = f), m;
}
function H2(e) {
  var t, r = !1, n = !1, i, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && ie(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (s = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : ie(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Dt(a); )
      a === 33 && (n ? ie(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Dv.test(i) || ie(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    s = e.input.slice(t, e.position), D2.test(s) && ie(e, "tag suffix cannot contain flow indicator characters");
  }
  s && !kv.test(s) && ie(e, "tag name cannot contain such characters: " + s);
  try {
    s = decodeURIComponent(s);
  } catch {
    ie(e, "tag name is malformed: " + s);
  }
  return r ? e.tag = s : dn.call(e.tagMap, i) ? e.tag = e.tagMap[i] + s : i === "!" ? e.tag = "!" + s : i === "!!" ? e.tag = "tag:yaml.org,2002:" + s : ie(e, 'undeclared tag handle "' + i + '"'), !0;
}
function z2(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && ie(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Dt(r) && !_i(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && ie(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function K2(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Dt(n) && !_i(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && ie(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), dn.call(e.anchorMap, r) || ie(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Me(e, !0, -1), !0;
}
function Ui(e, t, r, n, i) {
  var s, a, o, c = 1, u = !1, l = !1, f, p, h, $, y, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, s = a = o = jo === r || Cv === r, n && Me(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; H2(e) || z2(e); )
      Me(e, !0, -1) ? (u = !0, o = s, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : o = !1;
  if (o && (o = u || i), (c === 1 || jo === r) && (Lo === r || Iv === r ? y = t : y = t + 1, v = e.position - e.lineStart, c === 1 ? o && (Fm(e, v) || G2(e, v, y)) || q2(e, y) ? l = !0 : (a && B2(e, y) || x2(e, y) || V2(e, y) ? l = !0 : K2(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && ie(e, "alias node should not have any properties")) : M2(e, y, Lo === r) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = o && Fm(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && ie(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, p = e.implicitTypes.length; f < p; f += 1)
      if ($ = e.implicitTypes[f], $.resolve(e.result)) {
        e.result = $.construct(e.result), e.tag = $.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (dn.call(e.typeMap[e.kind || "fallback"], e.tag))
      $ = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for ($ = null, h = e.typeMap.multi[e.kind || "fallback"], f = 0, p = h.length; f < p; f += 1)
        if (e.tag.slice(0, h[f].tag.length) === h[f].tag) {
          $ = h[f];
          break;
        }
    $ || ie(e, "unknown tag !<" + e.tag + ">"), e.result !== null && $.kind !== e.kind && ie(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + $.kind + '", not "' + e.kind + '"'), $.resolve(e.result, e.tag) ? (e.result = $.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : ie(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function W2(e) {
  var t = e.position, r, n, i, s = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (Me(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (s = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !Dt(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && ie(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Bn(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !$r(a));
        break;
      }
      if ($r(a)) break;
      for (r = e.position; a !== 0 && !Dt(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && Vd(e), dn.call(Dm, n) ? Dm[n](e, n, i) : Uo(e, 'unknown document directive "' + n + '"');
  }
  if (Me(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Me(e, !0, -1)) : s && ie(e, "directives end mark is expected"), Ui(e, e.lineIndent - 1, jo, !1, !0), Me(e, !0, -1), e.checkLineBreaks && C2.test(e.input.slice(t, e.position)) && Uo(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && mc(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Me(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    ie(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Mv(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new U2(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, ie(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    W2(r);
  return r.documents;
}
function Y2(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Mv(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function X2(e, t) {
  var r = Mv(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Av("expected a single document in the stream, but found more");
  }
}
Ud.loadAll = Y2;
Ud.load = X2;
var xv = {}, yc = ar, ua = la, J2 = xd, Vv = Object.prototype.toString, qv = Object.prototype.hasOwnProperty, Bd = 65279, Q2 = 9, Vs = 10, Z2 = 13, eM = 32, tM = 33, rM = 34, yu = 35, nM = 37, iM = 38, sM = 39, aM = 42, Bv = 44, oM = 45, Mo = 58, cM = 61, lM = 62, uM = 63, fM = 64, Gv = 91, Hv = 93, dM = 96, zv = 123, hM = 124, Kv = 125, ft = {};
ft[0] = "\\0";
ft[7] = "\\a";
ft[8] = "\\b";
ft[9] = "\\t";
ft[10] = "\\n";
ft[11] = "\\v";
ft[12] = "\\f";
ft[13] = "\\r";
ft[27] = "\\e";
ft[34] = '\\"';
ft[92] = "\\\\";
ft[133] = "\\N";
ft[160] = "\\_";
ft[8232] = "\\L";
ft[8233] = "\\P";
var pM = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], mM = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function yM(e, t) {
  var r, n, i, s, a, o, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, s = n.length; i < s; i += 1)
    a = n[i], o = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), c = e.compiledTypeMap.fallback[a], c && qv.call(c.styleAliases, o) && (o = c.styleAliases[o]), r[a] = o;
  return r;
}
function gM(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new ua("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + yc.repeat("0", n - t.length) + t;
}
var $M = 1, qs = 2;
function vM(e) {
  this.schema = e.schema || J2, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = yc.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = yM(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? qs : $M, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Lm(e, t) {
  for (var r = yc.repeat(" ", t), n = 0, i = -1, s = "", a, o = e.length; n < o; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = o) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (s += r), s += a;
  return s;
}
function gu(e, t) {
  return `
` + yc.repeat(" ", e.indent * t);
}
function _M(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function xo(e) {
  return e === eM || e === Q2;
}
function Bs(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Bd || 65536 <= e && e <= 1114111;
}
function jm(e) {
  return Bs(e) && e !== Bd && e !== Z2 && e !== Vs;
}
function Um(e, t, r) {
  var n = jm(e), i = n && !xo(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Bv && e !== Gv && e !== Hv && e !== zv && e !== Kv) && e !== yu && !(t === Mo && !i) || jm(t) && !xo(t) && e === yu || t === Mo && i
  );
}
function EM(e) {
  return Bs(e) && e !== Bd && !xo(e) && e !== oM && e !== uM && e !== Mo && e !== Bv && e !== Gv && e !== Hv && e !== zv && e !== Kv && e !== yu && e !== iM && e !== aM && e !== tM && e !== hM && e !== cM && e !== lM && e !== sM && e !== rM && e !== nM && e !== fM && e !== dM;
}
function wM(e) {
  return !xo(e) && e !== Mo;
}
function $s(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Wv(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Yv = 1, $u = 2, Xv = 3, Jv = 4, hi = 5;
function SM(e, t, r, n, i, s, a, o) {
  var c, u = 0, l = null, f = !1, p = !1, h = n !== -1, $ = -1, y = EM($s(e, 0)) && wM($s(e, e.length - 1));
  if (t || a)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = $s(e, c), !Bs(u))
        return hi;
      y = y && Um(u, l, o), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = $s(e, c), u === Vs)
        f = !0, h && (p = p || // Foldable line = too long, and not more-indented.
        c - $ - 1 > n && e[$ + 1] !== " ", $ = c);
      else if (!Bs(u))
        return hi;
      y = y && Um(u, l, o), l = u;
    }
    p = p || h && c - $ - 1 > n && e[$ + 1] !== " ";
  }
  return !f && !p ? y && !a && !i(e) ? Yv : s === qs ? hi : $u : r > 9 && Wv(e) ? hi : a ? s === qs ? hi : $u : p ? Jv : Xv;
}
function bM(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === qs ? '""' : "''";
    if (!e.noCompatMode && (pM.indexOf(t) !== -1 || mM.test(t)))
      return e.quotingType === qs ? '"' + t + '"' : "'" + t + "'";
    var s = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(u) {
      return _M(e, u);
    }
    switch (SM(
      t,
      o,
      e.indent,
      a,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Yv:
        return t;
      case $u:
        return "'" + t.replace(/'/g, "''") + "'";
      case Xv:
        return "|" + Mm(t, e.indent) + xm(Lm(t, s));
      case Jv:
        return ">" + Mm(t, e.indent) + xm(Lm(PM(t, a), s));
      case hi:
        return '"' + TM(t) + '"';
      default:
        throw new ua("impossible error: invalid scalar style");
    }
  }();
}
function Mm(e, t) {
  var r = Wv(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), s = i ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function xm(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function PM(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, r.lastIndex = u, Vm(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", s, a; a = r.exec(e); ) {
    var o = a[1], c = a[2];
    s = c[0] === " ", n += o + (!i && !s && c !== "" ? `
` : "") + Vm(c, t), i = s;
  }
  return n;
}
function Vm(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, s, a = 0, o = 0, c = ""; n = r.exec(e); )
    o = n.index, o - i > t && (s = a > i ? a : o, c += `
` + e.slice(i, s), i = s + 1), a = o;
  return c += `
`, e.length - i > t && a > i ? c += e.slice(i, a) + `
` + e.slice(a + 1) : c += e.slice(i), c.slice(1);
}
function TM(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = $s(e, i), n = ft[r], !n && Bs(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || gM(r);
  return t;
}
function NM(e, t, r) {
  var n = "", i = e.tag, s, a, o;
  for (s = 0, a = r.length; s < a; s += 1)
    o = r[s], e.replacer && (o = e.replacer.call(r, String(s), o)), (Fr(e, t, o, !1, !1) || typeof o > "u" && Fr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function qm(e, t, r, n) {
  var i = "", s = e.tag, a, o, c;
  for (a = 0, o = r.length; a < o; a += 1)
    c = r[a], e.replacer && (c = e.replacer.call(r, String(a), c)), (Fr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Fr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += gu(e, t)), e.dump && Vs === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = s, e.dump = i || "[]";
}
function RM(e, t, r) {
  var n = "", i = e.tag, s = Object.keys(r), a, o, c, u, l;
  for (a = 0, o = s.length; a < o; a += 1)
    l = "", n !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = s[a], u = r[c], e.replacer && (u = e.replacer.call(r, c, u)), Fr(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Fr(e, t, u, !1, !1) && (l += e.dump, n += l));
  e.tag = i, e.dump = "{" + n + "}";
}
function OM(e, t, r, n) {
  var i = "", s = e.tag, a = Object.keys(r), o, c, u, l, f, p;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new ua("sortKeys must be a boolean or a function");
  for (o = 0, c = a.length; o < c; o += 1)
    p = "", (!n || i !== "") && (p += gu(e, t)), u = a[o], l = r[u], e.replacer && (l = e.replacer.call(r, u, l)), Fr(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Vs === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, f && (p += gu(e, t)), Fr(e, t + 1, l, !0, f) && (e.dump && Vs === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = s, e.dump = i || "{}";
}
function Bm(e, t, r) {
  var n, i, s, a, o, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, s = 0, a = i.length; s < a; s += 1)
    if (o = i[s], (o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        if (c = e.styleMap[o.tag] || o.defaultStyle, Vv.call(o.represent) === "[object Function]")
          n = o.represent(t, c);
        else if (qv.call(o.represent, c))
          n = o.represent[c](t, c);
        else
          throw new ua("!<" + o.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function Fr(e, t, r, n, i, s, a) {
  e.tag = null, e.dump = r, Bm(e, r, !1) || Bm(e, r, !0);
  var o = Vv.call(e.dump), c = n, u;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var l = o === "[object Object]" || o === "[object Array]", f, p;
  if (l && (f = e.duplicates.indexOf(r), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (l && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (OM(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (RM(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? qm(e, t - 1, e.dump, i) : qm(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (NM(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && bM(e, e.dump, t, s, c);
    else {
      if (o === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new ua("unacceptable kind of an object to dump " + o);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function AM(e, t) {
  var r = [], n = [], i, s;
  for (vu(e, r, n), i = 0, s = n.length; i < s; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(s);
}
function vu(e, t, r) {
  var n, i, s;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, s = e.length; i < s; i += 1)
        vu(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, s = n.length; i < s; i += 1)
        vu(e[n[i]], t, r);
}
function IM(e, t) {
  t = t || {};
  var r = new vM(t);
  r.noRefs || AM(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Fr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
xv.dump = IM;
var Qv = Ud, CM = xv;
function Gd(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
rt.Type = bt;
rt.Schema = uv;
rt.FAILSAFE_SCHEMA = pv;
rt.JSON_SCHEMA = _v;
rt.CORE_SCHEMA = Ev;
rt.DEFAULT_SCHEMA = xd;
rt.load = Qv.load;
rt.loadAll = Qv.loadAll;
rt.dump = CM.dump;
rt.YAMLException = la;
rt.types = {
  binary: Tv,
  float: vv,
  map: hv,
  null: mv,
  pairs: Rv,
  set: Ov,
  timestamp: bv,
  bool: yv,
  int: gv,
  merge: Pv,
  omap: Nv,
  seq: dv,
  str: fv
};
rt.safeLoad = Gd("safeLoad", "load");
rt.safeLoadAll = Gd("safeLoadAll", "loadAll");
rt.safeDump = Gd("safeDump", "dump");
var gc = {};
Object.defineProperty(gc, "__esModule", { value: !0 });
gc.Lazy = void 0;
class DM {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
gc.Lazy = DM;
var _u = { exports: {} };
const kM = "2.0.0", Zv = 256, FM = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, LM = 16, jM = Zv - 6, UM = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var $c = {
  MAX_LENGTH: Zv,
  MAX_SAFE_COMPONENT_LENGTH: LM,
  MAX_SAFE_BUILD_LENGTH: jM,
  MAX_SAFE_INTEGER: FM,
  RELEASE_TYPES: UM,
  SEMVER_SPEC_VERSION: kM,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const MM = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var vc = MM;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = $c, s = vc;
  t = e.exports = {};
  const a = t.re = [], o = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const p = "[a-zA-Z0-9-]", h = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], $ = (v) => {
    for (const [m, E] of h)
      v = v.split(`${m}*`).join(`${m}{0,${E}}`).split(`${m}+`).join(`${m}{1,${E}}`);
    return v;
  }, y = (v, m, E) => {
    const N = $(m), D = f++;
    s(v, D, m), l[v] = D, c[D] = m, u[D] = N, a[D] = new RegExp(m, E ? "g" : void 0), o[D] = new RegExp(N, E ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), y("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${p}+`), y("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), y("FULL", `^${c[l.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), y("LOOSE", `^${c[l.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), y("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", c[l.COERCE], !0), y("COERCERTLFULL", c[l.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(_u, _u.exports);
var fa = _u.exports;
const xM = Object.freeze({ loose: !0 }), VM = Object.freeze({}), qM = (e) => e ? typeof e != "object" ? xM : e : VM;
var Hd = qM;
const Gm = /^[0-9]+$/, e_ = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Gm.test(e), n = Gm.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, BM = (e, t) => e_(t, e);
var t_ = {
  compareIdentifiers: e_,
  rcompareIdentifiers: BM
};
const Xa = vc, { MAX_LENGTH: Hm, MAX_SAFE_INTEGER: Ja } = $c, { safeRe: Qa, t: Za } = fa, GM = Hd, { compareIdentifiers: El } = t_;
let HM = class fr {
  constructor(t, r) {
    if (r = GM(r), t instanceof fr) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Hm)
      throw new TypeError(
        `version is longer than ${Hm} characters`
      );
    Xa("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Qa[Za.LOOSE] : Qa[Za.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ja || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ja || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ja || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < Ja)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Xa("SemVer.compare", this.version, this.options, t), !(t instanceof fr)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new fr(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof fr || (t = new fr(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof fr || (t = new fr(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Xa("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return El(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof fr || (t = new fr(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Xa("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return El(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Qa[Za.PRERELEASELOOSE] : Qa[Za.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), El(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Pt = HM;
const zm = Pt, zM = (e, t, r = !1) => {
  if (e instanceof zm)
    return e;
  try {
    return new zm(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Xi = zM;
const KM = Xi, WM = (e, t) => {
  const r = KM(e, t);
  return r ? r.version : null;
};
var YM = WM;
const XM = Xi, JM = (e, t) => {
  const r = XM(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var QM = JM;
const Km = Pt, ZM = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Km(
      e instanceof Km ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var ex = ZM;
const Wm = Xi, tx = (e, t) => {
  const r = Wm(e, null, !0), n = Wm(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, a = s ? r : n, o = s ? n : r, c = !!a.prerelease.length;
  if (!!o.prerelease.length && !c) {
    if (!o.patch && !o.minor)
      return "major";
    if (o.compareMain(a) === 0)
      return o.minor && !o.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var rx = tx;
const nx = Pt, ix = (e, t) => new nx(e, t).major;
var sx = ix;
const ax = Pt, ox = (e, t) => new ax(e, t).minor;
var cx = ox;
const lx = Pt, ux = (e, t) => new lx(e, t).patch;
var fx = ux;
const dx = Xi, hx = (e, t) => {
  const r = dx(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var px = hx;
const Ym = Pt, mx = (e, t, r) => new Ym(e, r).compare(new Ym(t, r));
var or = mx;
const yx = or, gx = (e, t, r) => yx(t, e, r);
var $x = gx;
const vx = or, _x = (e, t) => vx(e, t, !0);
var Ex = _x;
const Xm = Pt, wx = (e, t, r) => {
  const n = new Xm(e, r), i = new Xm(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var zd = wx;
const Sx = zd, bx = (e, t) => e.sort((r, n) => Sx(r, n, t));
var Px = bx;
const Tx = zd, Nx = (e, t) => e.sort((r, n) => Tx(n, r, t));
var Rx = Nx;
const Ox = or, Ax = (e, t, r) => Ox(e, t, r) > 0;
var _c = Ax;
const Ix = or, Cx = (e, t, r) => Ix(e, t, r) < 0;
var Kd = Cx;
const Dx = or, kx = (e, t, r) => Dx(e, t, r) === 0;
var r_ = kx;
const Fx = or, Lx = (e, t, r) => Fx(e, t, r) !== 0;
var n_ = Lx;
const jx = or, Ux = (e, t, r) => jx(e, t, r) >= 0;
var Wd = Ux;
const Mx = or, xx = (e, t, r) => Mx(e, t, r) <= 0;
var Yd = xx;
const Vx = r_, qx = n_, Bx = _c, Gx = Wd, Hx = Kd, zx = Yd, Kx = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Vx(e, r, n);
    case "!=":
      return qx(e, r, n);
    case ">":
      return Bx(e, r, n);
    case ">=":
      return Gx(e, r, n);
    case "<":
      return Hx(e, r, n);
    case "<=":
      return zx(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var i_ = Kx;
const Wx = Pt, Yx = Xi, { safeRe: eo, t: to } = fa, Xx = (e, t) => {
  if (e instanceof Wx)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? eo[to.COERCEFULL] : eo[to.COERCE]);
  else {
    const c = t.includePrerelease ? eo[to.COERCERTLFULL] : eo[to.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Yx(`${n}.${i}.${s}${a}${o}`, t);
};
var Jx = Xx;
class Qx {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var Zx = Qx, wl, Jm;
function cr() {
  if (Jm) return wl;
  Jm = 1;
  const e = /\s+/g;
  class t {
    constructor(I, x) {
      if (x = i(x), I instanceof t)
        return I.loose === !!x.loose && I.includePrerelease === !!x.includePrerelease ? I : new t(I.raw, x);
      if (I instanceof s)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = x, this.loose = !!x.loose, this.includePrerelease = !!x.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((V) => !y(V[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && v(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let I = 0; I < this.set.length; I++) {
          I > 0 && (this.formatted += "||");
          const x = this.set[I];
          for (let L = 0; L < x.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += x[L].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(I) {
      const L = ((this.options.includePrerelease && h) | (this.options.loose && $)) + ":" + I, V = n.get(L);
      if (V)
        return V;
      const U = this.options.loose, O = U ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      I = I.replace(O, K(this.options.includePrerelease)), a("hyphen replace", I), I = I.replace(c[u.COMPARATORTRIM], l), a("comparator trim", I), I = I.replace(c[u.TILDETRIM], f), a("tilde trim", I), I = I.replace(c[u.CARETTRIM], p), a("caret trim", I);
      let w = I.split(" ").map((g) => E(g, this.options)).join(" ").split(/\s+/).map((g) => H(g, this.options));
      U && (w = w.filter((g) => (a("loose invalid filter", g, this.options), !!g.match(c[u.COMPARATORLOOSE])))), a("range list", w);
      const P = /* @__PURE__ */ new Map(), b = w.map((g) => new s(g, this.options));
      for (const g of b) {
        if (y(g))
          return [g];
        P.set(g.value, g);
      }
      P.size > 1 && P.has("") && P.delete("");
      const d = [...P.values()];
      return n.set(L, d), d;
    }
    intersects(I, x) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, x) && I.set.some((V) => m(V, x) && L.every((U) => V.every((O) => U.intersects(O, x)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new o(I, this.options);
        } catch {
          return !1;
        }
      for (let x = 0; x < this.set.length; x++)
        if (ne(this.set[x], I, this.options))
          return !0;
      return !1;
    }
  }
  wl = t;
  const r = Zx, n = new r(), i = Hd, s = Ec(), a = vc, o = Pt, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: p
  } = fa, { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: $ } = $c, y = (C) => C.value === "<0.0.0-0", v = (C) => C.value === "", m = (C, I) => {
    let x = !0;
    const L = C.slice();
    let V = L.pop();
    for (; x && L.length; )
      x = L.every((U) => V.intersects(U, I)), V = L.pop();
    return x;
  }, E = (C, I) => (C = C.replace(c[u.BUILD], ""), a("comp", C, I), C = z(C, I), a("caret", C), C = D(C, I), a("tildes", C), C = se(C, I), a("xrange", C), C = A(C, I), a("stars", C), C), N = (C) => !C || C.toLowerCase() === "x" || C === "*", D = (C, I) => C.trim().split(/\s+/).map((x) => j(x, I)).join(" "), j = (C, I) => {
    const x = I.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return C.replace(x, (L, V, U, O, w) => {
      a("tilde", C, L, V, U, O, w);
      let P;
      return N(V) ? P = "" : N(U) ? P = `>=${V}.0.0 <${+V + 1}.0.0-0` : N(O) ? P = `>=${V}.${U}.0 <${V}.${+U + 1}.0-0` : w ? (a("replaceTilde pr", w), P = `>=${V}.${U}.${O}-${w} <${V}.${+U + 1}.0-0`) : P = `>=${V}.${U}.${O} <${V}.${+U + 1}.0-0`, a("tilde return", P), P;
    });
  }, z = (C, I) => C.trim().split(/\s+/).map((x) => Q(x, I)).join(" "), Q = (C, I) => {
    a("caret", C, I);
    const x = I.loose ? c[u.CARETLOOSE] : c[u.CARET], L = I.includePrerelease ? "-0" : "";
    return C.replace(x, (V, U, O, w, P) => {
      a("caret", C, V, U, O, w, P);
      let b;
      return N(U) ? b = "" : N(O) ? b = `>=${U}.0.0${L} <${+U + 1}.0.0-0` : N(w) ? U === "0" ? b = `>=${U}.${O}.0${L} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.0${L} <${+U + 1}.0.0-0` : P ? (a("replaceCaret pr", P), U === "0" ? O === "0" ? b = `>=${U}.${O}.${w}-${P} <${U}.${O}.${+w + 1}-0` : b = `>=${U}.${O}.${w}-${P} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.${w}-${P} <${+U + 1}.0.0-0`) : (a("no pr"), U === "0" ? O === "0" ? b = `>=${U}.${O}.${w}${L} <${U}.${O}.${+w + 1}-0` : b = `>=${U}.${O}.${w}${L} <${U}.${+O + 1}.0-0` : b = `>=${U}.${O}.${w} <${+U + 1}.0.0-0`), a("caret return", b), b;
    });
  }, se = (C, I) => (a("replaceXRanges", C, I), C.split(/\s+/).map((x) => W(x, I)).join(" ")), W = (C, I) => {
    C = C.trim();
    const x = I.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return C.replace(x, (L, V, U, O, w, P) => {
      a("xRange", C, L, V, U, O, w, P);
      const b = N(U), d = b || N(O), g = d || N(w), R = g;
      return V === "=" && R && (V = ""), P = I.includePrerelease ? "-0" : "", b ? V === ">" || V === "<" ? L = "<0.0.0-0" : L = "*" : V && R ? (d && (O = 0), w = 0, V === ">" ? (V = ">=", d ? (U = +U + 1, O = 0, w = 0) : (O = +O + 1, w = 0)) : V === "<=" && (V = "<", d ? U = +U + 1 : O = +O + 1), V === "<" && (P = "-0"), L = `${V + U}.${O}.${w}${P}`) : d ? L = `>=${U}.0.0${P} <${+U + 1}.0.0-0` : g && (L = `>=${U}.${O}.0${P} <${U}.${+O + 1}.0-0`), a("xRange return", L), L;
    });
  }, A = (C, I) => (a("replaceStars", C, I), C.trim().replace(c[u.STAR], "")), H = (C, I) => (a("replaceGTE0", C, I), C.trim().replace(c[I.includePrerelease ? u.GTE0PRE : u.GTE0], "")), K = (C) => (I, x, L, V, U, O, w, P, b, d, g, R) => (N(L) ? x = "" : N(V) ? x = `>=${L}.0.0${C ? "-0" : ""}` : N(U) ? x = `>=${L}.${V}.0${C ? "-0" : ""}` : O ? x = `>=${x}` : x = `>=${x}${C ? "-0" : ""}`, N(b) ? P = "" : N(d) ? P = `<${+b + 1}.0.0-0` : N(g) ? P = `<${b}.${+d + 1}.0-0` : R ? P = `<=${b}.${d}.${g}-${R}` : C ? P = `<${b}.${d}.${+g + 1}-0` : P = `<=${P}`, `${x} ${P}`.trim()), ne = (C, I, x) => {
    for (let L = 0; L < C.length; L++)
      if (!C[L].test(I))
        return !1;
    if (I.prerelease.length && !x.includePrerelease) {
      for (let L = 0; L < C.length; L++)
        if (a(C[L].semver), C[L].semver !== s.ANY && C[L].semver.prerelease.length > 0) {
          const V = C[L].semver;
          if (V.major === I.major && V.minor === I.minor && V.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return wl;
}
var Sl, Qm;
function Ec() {
  if (Qm) return Sl;
  Qm = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = l.match(f);
      if (!p)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new o(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new o(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Sl = t;
  const r = Hd, { safeRe: n, t: i } = fa, s = i_, a = vc, o = Pt, c = cr();
  return Sl;
}
const e3 = cr(), t3 = (e, t, r) => {
  try {
    t = new e3(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var wc = t3;
const r3 = cr(), n3 = (e, t) => new r3(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var i3 = n3;
const s3 = Pt, a3 = cr(), o3 = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new a3(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new s3(n, r));
  }), n;
};
var c3 = o3;
const l3 = Pt, u3 = cr(), f3 = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new u3(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new l3(n, r));
  }), n;
};
var d3 = f3;
const bl = Pt, h3 = cr(), Zm = _c, p3 = (e, t) => {
  e = new h3(e, t);
  let r = new bl("0.0.0");
  if (e.test(r) || (r = new bl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((a) => {
      const o = new bl(a.semver.version);
      switch (a.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!s || Zm(o, s)) && (s = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), s && (!r || Zm(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var m3 = p3;
const y3 = cr(), g3 = (e, t) => {
  try {
    return new y3(e, t).range || "*";
  } catch {
    return null;
  }
};
var $3 = g3;
const v3 = Pt, s_ = Ec(), { ANY: _3 } = s_, E3 = cr(), w3 = wc, ey = _c, ty = Kd, S3 = Yd, b3 = Wd, P3 = (e, t, r, n) => {
  e = new v3(e, n), t = new E3(t, n);
  let i, s, a, o, c;
  switch (r) {
    case ">":
      i = ey, s = S3, a = ty, o = ">", c = ">=";
      break;
    case "<":
      i = ty, s = b3, a = ey, o = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (w3(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, p = null;
    if (l.forEach((h) => {
      h.semver === _3 && (h = new s_(">=0.0.0")), f = f || h, p = p || h, i(h.semver, f.semver, n) ? f = h : a(h.semver, p.semver, n) && (p = h);
    }), f.operator === o || f.operator === c || (!p.operator || p.operator === o) && s(e, p.semver))
      return !1;
    if (p.operator === c && a(e, p.semver))
      return !1;
  }
  return !0;
};
var Xd = P3;
const T3 = Xd, N3 = (e, t, r) => T3(e, t, ">", r);
var R3 = N3;
const O3 = Xd, A3 = (e, t, r) => O3(e, t, "<", r);
var I3 = A3;
const ry = cr(), C3 = (e, t, r) => (e = new ry(e, r), t = new ry(t, r), e.intersects(t, r));
var D3 = C3;
const k3 = wc, F3 = or;
var L3 = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const a = e.sort((l, f) => F3(l, f, r));
  for (const l of a)
    k3(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [l, f] of n)
    l === f ? o.push(l) : !f && l === a[0] ? o.push("*") : f ? l === a[0] ? o.push(`<=${f}`) : o.push(`${l} - ${f}`) : o.push(`>=${l}`);
  const c = o.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const ny = cr(), Jd = Ec(), { ANY: Pl } = Jd, fs = wc, Qd = or, j3 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new ny(e, r), t = new ny(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const a = M3(i, s, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, U3 = [new Jd(">=0.0.0-0")], iy = [new Jd(">=0.0.0")], M3 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Pl) {
    if (t.length === 1 && t[0].semver === Pl)
      return !0;
    r.includePrerelease ? e = U3 : e = iy;
  }
  if (t.length === 1 && t[0].semver === Pl) {
    if (r.includePrerelease)
      return !0;
    t = iy;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const h of e)
    h.operator === ">" || h.operator === ">=" ? i = sy(i, h, r) : h.operator === "<" || h.operator === "<=" ? s = ay(s, h, r) : n.add(h.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && s) {
    if (a = Qd(i.semver, s.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const h of n) {
    if (i && !fs(h, String(i), r) || s && !fs(h, String(s), r))
      return null;
    for (const $ of t)
      if (!fs(h, String($), r))
        return !1;
    return !0;
  }
  let o, c, u, l, f = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && s.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const h of t) {
    if (l = l || h.operator === ">" || h.operator === ">=", u = u || h.operator === "<" || h.operator === "<=", i) {
      if (p && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === p.major && h.semver.minor === p.minor && h.semver.patch === p.patch && (p = !1), h.operator === ">" || h.operator === ">=") {
        if (o = sy(i, h, r), o === h && o !== i)
          return !1;
      } else if (i.operator === ">=" && !fs(i.semver, String(h), r))
        return !1;
    }
    if (s) {
      if (f && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === f.major && h.semver.minor === f.minor && h.semver.patch === f.patch && (f = !1), h.operator === "<" || h.operator === "<=") {
        if (c = ay(s, h, r), c === h && c !== s)
          return !1;
      } else if (s.operator === "<=" && !fs(s.semver, String(h), r))
        return !1;
    }
    if (!h.operator && (s || i) && a !== 0)
      return !1;
  }
  return !(i && u && !s && a !== 0 || s && l && !i && a !== 0 || p || f);
}, sy = (e, t, r) => {
  if (!e)
    return t;
  const n = Qd(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ay = (e, t, r) => {
  if (!e)
    return t;
  const n = Qd(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var x3 = j3;
const Tl = fa, oy = $c, V3 = Pt, cy = t_, q3 = Xi, B3 = YM, G3 = QM, H3 = ex, z3 = rx, K3 = sx, W3 = cx, Y3 = fx, X3 = px, J3 = or, Q3 = $x, Z3 = Ex, eV = zd, tV = Px, rV = Rx, nV = _c, iV = Kd, sV = r_, aV = n_, oV = Wd, cV = Yd, lV = i_, uV = Jx, fV = Ec(), dV = cr(), hV = wc, pV = i3, mV = c3, yV = d3, gV = m3, $V = $3, vV = Xd, _V = R3, EV = I3, wV = D3, SV = L3, bV = x3;
var a_ = {
  parse: q3,
  valid: B3,
  clean: G3,
  inc: H3,
  diff: z3,
  major: K3,
  minor: W3,
  patch: Y3,
  prerelease: X3,
  compare: J3,
  rcompare: Q3,
  compareLoose: Z3,
  compareBuild: eV,
  sort: tV,
  rsort: rV,
  gt: nV,
  lt: iV,
  eq: sV,
  neq: aV,
  gte: oV,
  lte: cV,
  cmp: lV,
  coerce: uV,
  Comparator: fV,
  Range: dV,
  satisfies: hV,
  toComparators: pV,
  maxSatisfying: mV,
  minSatisfying: yV,
  minVersion: gV,
  validRange: $V,
  outside: vV,
  gtr: _V,
  ltr: EV,
  intersects: wV,
  simplifyRange: SV,
  subset: bV,
  SemVer: V3,
  re: Tl.re,
  src: Tl.src,
  tokens: Tl.t,
  SEMVER_SPEC_VERSION: oy.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: oy.RELEASE_TYPES,
  compareIdentifiers: cy.compareIdentifiers,
  rcompareIdentifiers: cy.rcompareIdentifiers
}, da = {}, Vo = { exports: {} };
Vo.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", p = "[object Error]", h = "[object Function]", $ = "[object GeneratorFunction]", y = "[object Map]", v = "[object Number]", m = "[object Null]", E = "[object Object]", N = "[object Promise]", D = "[object Proxy]", j = "[object RegExp]", z = "[object Set]", Q = "[object String]", se = "[object Symbol]", W = "[object Undefined]", A = "[object WeakMap]", H = "[object ArrayBuffer]", K = "[object DataView]", ne = "[object Float32Array]", C = "[object Float64Array]", I = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", V = "[object Uint8Array]", U = "[object Uint8ClampedArray]", O = "[object Uint16Array]", w = "[object Uint32Array]", P = /[\\^$.*+?()[\]{}|]/g, b = /^\[object .+?Constructor\]$/, d = /^(?:0|[1-9]\d*)$/, g = {};
  g[ne] = g[C] = g[I] = g[x] = g[L] = g[V] = g[U] = g[O] = g[w] = !0, g[o] = g[c] = g[H] = g[l] = g[K] = g[f] = g[p] = g[h] = g[y] = g[v] = g[E] = g[j] = g[z] = g[Q] = g[A] = !1;
  var R = typeof $t == "object" && $t && $t.Object === Object && $t, q = typeof self == "object" && self && self.Object === Object && self, B = R || q || Function("return this")(), ee = t && !t.nodeType && t, X = ee && !0 && e && !e.nodeType && e, ce = X && X.exports === ee, S = ce && R.process, _ = function() {
    try {
      return S && S.binding && S.binding("util");
    } catch {
    }
  }(), M = _ && _.isTypedArray;
  function k(T, F) {
    for (var G = -1, Z = T == null ? 0 : T.length, Ne = 0, de = []; ++G < Z; ) {
      var Le = T[G];
      F(Le, G, T) && (de[Ne++] = Le);
    }
    return de;
  }
  function ye(T, F) {
    for (var G = -1, Z = F.length, Ne = T.length; ++G < Z; )
      T[Ne + G] = F[G];
    return T;
  }
  function Ee(T, F) {
    for (var G = -1, Z = T == null ? 0 : T.length; ++G < Z; )
      if (F(T[G], G, T))
        return !0;
    return !1;
  }
  function we(T, F) {
    for (var G = -1, Z = Array(T); ++G < T; )
      Z[G] = F(G);
    return Z;
  }
  function Ae(T) {
    return function(F) {
      return T(F);
    };
  }
  function Ie(T, F) {
    return T.has(F);
  }
  function Ve(T, F) {
    return T == null ? void 0 : T[F];
  }
  function Se(T) {
    var F = -1, G = Array(T.size);
    return T.forEach(function(Z, Ne) {
      G[++F] = [Ne, Z];
    }), G;
  }
  function qe(T, F) {
    return function(G) {
      return T(F(G));
    };
  }
  function Gt(T) {
    var F = -1, G = Array(T.size);
    return T.forEach(function(Z) {
      G[++F] = Z;
    }), G;
  }
  var jt = Array.prototype, Ye = Function.prototype, dt = Object.prototype, Er = B["__core-js_shared__"], Lr = Ye.toString, Tt = dt.hasOwnProperty, sh = function() {
    var T = /[^.]+$/.exec(Er && Er.keys && Er.keys.IE_PROTO || "");
    return T ? "Symbol(src)_1." + T : "";
  }(), ah = dt.toString, __ = RegExp(
    "^" + Lr.call(Tt).replace(P, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), oh = ce ? B.Buffer : void 0, ya = B.Symbol, ch = B.Uint8Array, lh = dt.propertyIsEnumerable, E_ = jt.splice, vn = ya ? ya.toStringTag : void 0, uh = Object.getOwnPropertySymbols, w_ = oh ? oh.isBuffer : void 0, S_ = qe(Object.keys, Object), Cc = Zn(B, "DataView"), Zi = Zn(B, "Map"), Dc = Zn(B, "Promise"), kc = Zn(B, "Set"), Fc = Zn(B, "WeakMap"), es = Zn(Object, "create"), b_ = wn(Cc), P_ = wn(Zi), T_ = wn(Dc), N_ = wn(kc), R_ = wn(Fc), fh = ya ? ya.prototype : void 0, Lc = fh ? fh.valueOf : void 0;
  function _n(T) {
    var F = -1, G = T == null ? 0 : T.length;
    for (this.clear(); ++F < G; ) {
      var Z = T[F];
      this.set(Z[0], Z[1]);
    }
  }
  function O_() {
    this.__data__ = es ? es(null) : {}, this.size = 0;
  }
  function A_(T) {
    var F = this.has(T) && delete this.__data__[T];
    return this.size -= F ? 1 : 0, F;
  }
  function I_(T) {
    var F = this.__data__;
    if (es) {
      var G = F[T];
      return G === n ? void 0 : G;
    }
    return Tt.call(F, T) ? F[T] : void 0;
  }
  function C_(T) {
    var F = this.__data__;
    return es ? F[T] !== void 0 : Tt.call(F, T);
  }
  function D_(T, F) {
    var G = this.__data__;
    return this.size += this.has(T) ? 0 : 1, G[T] = es && F === void 0 ? n : F, this;
  }
  _n.prototype.clear = O_, _n.prototype.delete = A_, _n.prototype.get = I_, _n.prototype.has = C_, _n.prototype.set = D_;
  function wr(T) {
    var F = -1, G = T == null ? 0 : T.length;
    for (this.clear(); ++F < G; ) {
      var Z = T[F];
      this.set(Z[0], Z[1]);
    }
  }
  function k_() {
    this.__data__ = [], this.size = 0;
  }
  function F_(T) {
    var F = this.__data__, G = $a(F, T);
    if (G < 0)
      return !1;
    var Z = F.length - 1;
    return G == Z ? F.pop() : E_.call(F, G, 1), --this.size, !0;
  }
  function L_(T) {
    var F = this.__data__, G = $a(F, T);
    return G < 0 ? void 0 : F[G][1];
  }
  function j_(T) {
    return $a(this.__data__, T) > -1;
  }
  function U_(T, F) {
    var G = this.__data__, Z = $a(G, T);
    return Z < 0 ? (++this.size, G.push([T, F])) : G[Z][1] = F, this;
  }
  wr.prototype.clear = k_, wr.prototype.delete = F_, wr.prototype.get = L_, wr.prototype.has = j_, wr.prototype.set = U_;
  function En(T) {
    var F = -1, G = T == null ? 0 : T.length;
    for (this.clear(); ++F < G; ) {
      var Z = T[F];
      this.set(Z[0], Z[1]);
    }
  }
  function M_() {
    this.size = 0, this.__data__ = {
      hash: new _n(),
      map: new (Zi || wr)(),
      string: new _n()
    };
  }
  function x_(T) {
    var F = va(this, T).delete(T);
    return this.size -= F ? 1 : 0, F;
  }
  function V_(T) {
    return va(this, T).get(T);
  }
  function q_(T) {
    return va(this, T).has(T);
  }
  function B_(T, F) {
    var G = va(this, T), Z = G.size;
    return G.set(T, F), this.size += G.size == Z ? 0 : 1, this;
  }
  En.prototype.clear = M_, En.prototype.delete = x_, En.prototype.get = V_, En.prototype.has = q_, En.prototype.set = B_;
  function ga(T) {
    var F = -1, G = T == null ? 0 : T.length;
    for (this.__data__ = new En(); ++F < G; )
      this.add(T[F]);
  }
  function G_(T) {
    return this.__data__.set(T, n), this;
  }
  function H_(T) {
    return this.__data__.has(T);
  }
  ga.prototype.add = ga.prototype.push = G_, ga.prototype.has = H_;
  function jr(T) {
    var F = this.__data__ = new wr(T);
    this.size = F.size;
  }
  function z_() {
    this.__data__ = new wr(), this.size = 0;
  }
  function K_(T) {
    var F = this.__data__, G = F.delete(T);
    return this.size = F.size, G;
  }
  function W_(T) {
    return this.__data__.get(T);
  }
  function Y_(T) {
    return this.__data__.has(T);
  }
  function X_(T, F) {
    var G = this.__data__;
    if (G instanceof wr) {
      var Z = G.__data__;
      if (!Zi || Z.length < r - 1)
        return Z.push([T, F]), this.size = ++G.size, this;
      G = this.__data__ = new En(Z);
    }
    return G.set(T, F), this.size = G.size, this;
  }
  jr.prototype.clear = z_, jr.prototype.delete = K_, jr.prototype.get = W_, jr.prototype.has = Y_, jr.prototype.set = X_;
  function J_(T, F) {
    var G = _a(T), Z = !G && dE(T), Ne = !G && !Z && jc(T), de = !G && !Z && !Ne && _h(T), Le = G || Z || Ne || de, ze = Le ? we(T.length, String) : [], Xe = ze.length;
    for (var De in T)
      Tt.call(T, De) && !(Le && // Safari 9 has enumerable `arguments.length` in strict mode.
      (De == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Ne && (De == "offset" || De == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      de && (De == "buffer" || De == "byteLength" || De == "byteOffset") || // Skip index properties.
      oE(De, Xe))) && ze.push(De);
    return ze;
  }
  function $a(T, F) {
    for (var G = T.length; G--; )
      if (yh(T[G][0], F))
        return G;
    return -1;
  }
  function Q_(T, F, G) {
    var Z = F(T);
    return _a(T) ? Z : ye(Z, G(T));
  }
  function ts(T) {
    return T == null ? T === void 0 ? W : m : vn && vn in Object(T) ? sE(T) : fE(T);
  }
  function dh(T) {
    return rs(T) && ts(T) == o;
  }
  function hh(T, F, G, Z, Ne) {
    return T === F ? !0 : T == null || F == null || !rs(T) && !rs(F) ? T !== T && F !== F : Z_(T, F, G, Z, hh, Ne);
  }
  function Z_(T, F, G, Z, Ne, de) {
    var Le = _a(T), ze = _a(F), Xe = Le ? c : Ur(T), De = ze ? c : Ur(F);
    Xe = Xe == o ? E : Xe, De = De == o ? E : De;
    var kt = Xe == E, Ht = De == E, nt = Xe == De;
    if (nt && jc(T)) {
      if (!jc(F))
        return !1;
      Le = !0, kt = !1;
    }
    if (nt && !kt)
      return de || (de = new jr()), Le || _h(T) ? ph(T, F, G, Z, Ne, de) : nE(T, F, Xe, G, Z, Ne, de);
    if (!(G & i)) {
      var Ut = kt && Tt.call(T, "__wrapped__"), Mt = Ht && Tt.call(F, "__wrapped__");
      if (Ut || Mt) {
        var Mr = Ut ? T.value() : T, Sr = Mt ? F.value() : F;
        return de || (de = new jr()), Ne(Mr, Sr, G, Z, de);
      }
    }
    return nt ? (de || (de = new jr()), iE(T, F, G, Z, Ne, de)) : !1;
  }
  function eE(T) {
    if (!vh(T) || lE(T))
      return !1;
    var F = gh(T) ? __ : b;
    return F.test(wn(T));
  }
  function tE(T) {
    return rs(T) && $h(T.length) && !!g[ts(T)];
  }
  function rE(T) {
    if (!uE(T))
      return S_(T);
    var F = [];
    for (var G in Object(T))
      Tt.call(T, G) && G != "constructor" && F.push(G);
    return F;
  }
  function ph(T, F, G, Z, Ne, de) {
    var Le = G & i, ze = T.length, Xe = F.length;
    if (ze != Xe && !(Le && Xe > ze))
      return !1;
    var De = de.get(T);
    if (De && de.get(F))
      return De == F;
    var kt = -1, Ht = !0, nt = G & s ? new ga() : void 0;
    for (de.set(T, F), de.set(F, T); ++kt < ze; ) {
      var Ut = T[kt], Mt = F[kt];
      if (Z)
        var Mr = Le ? Z(Mt, Ut, kt, F, T, de) : Z(Ut, Mt, kt, T, F, de);
      if (Mr !== void 0) {
        if (Mr)
          continue;
        Ht = !1;
        break;
      }
      if (nt) {
        if (!Ee(F, function(Sr, Sn) {
          if (!Ie(nt, Sn) && (Ut === Sr || Ne(Ut, Sr, G, Z, de)))
            return nt.push(Sn);
        })) {
          Ht = !1;
          break;
        }
      } else if (!(Ut === Mt || Ne(Ut, Mt, G, Z, de))) {
        Ht = !1;
        break;
      }
    }
    return de.delete(T), de.delete(F), Ht;
  }
  function nE(T, F, G, Z, Ne, de, Le) {
    switch (G) {
      case K:
        if (T.byteLength != F.byteLength || T.byteOffset != F.byteOffset)
          return !1;
        T = T.buffer, F = F.buffer;
      case H:
        return !(T.byteLength != F.byteLength || !de(new ch(T), new ch(F)));
      case l:
      case f:
      case v:
        return yh(+T, +F);
      case p:
        return T.name == F.name && T.message == F.message;
      case j:
      case Q:
        return T == F + "";
      case y:
        var ze = Se;
      case z:
        var Xe = Z & i;
        if (ze || (ze = Gt), T.size != F.size && !Xe)
          return !1;
        var De = Le.get(T);
        if (De)
          return De == F;
        Z |= s, Le.set(T, F);
        var kt = ph(ze(T), ze(F), Z, Ne, de, Le);
        return Le.delete(T), kt;
      case se:
        if (Lc)
          return Lc.call(T) == Lc.call(F);
    }
    return !1;
  }
  function iE(T, F, G, Z, Ne, de) {
    var Le = G & i, ze = mh(T), Xe = ze.length, De = mh(F), kt = De.length;
    if (Xe != kt && !Le)
      return !1;
    for (var Ht = Xe; Ht--; ) {
      var nt = ze[Ht];
      if (!(Le ? nt in F : Tt.call(F, nt)))
        return !1;
    }
    var Ut = de.get(T);
    if (Ut && de.get(F))
      return Ut == F;
    var Mt = !0;
    de.set(T, F), de.set(F, T);
    for (var Mr = Le; ++Ht < Xe; ) {
      nt = ze[Ht];
      var Sr = T[nt], Sn = F[nt];
      if (Z)
        var Eh = Le ? Z(Sn, Sr, nt, F, T, de) : Z(Sr, Sn, nt, T, F, de);
      if (!(Eh === void 0 ? Sr === Sn || Ne(Sr, Sn, G, Z, de) : Eh)) {
        Mt = !1;
        break;
      }
      Mr || (Mr = nt == "constructor");
    }
    if (Mt && !Mr) {
      var Ea = T.constructor, wa = F.constructor;
      Ea != wa && "constructor" in T && "constructor" in F && !(typeof Ea == "function" && Ea instanceof Ea && typeof wa == "function" && wa instanceof wa) && (Mt = !1);
    }
    return de.delete(T), de.delete(F), Mt;
  }
  function mh(T) {
    return Q_(T, mE, aE);
  }
  function va(T, F) {
    var G = T.__data__;
    return cE(F) ? G[typeof F == "string" ? "string" : "hash"] : G.map;
  }
  function Zn(T, F) {
    var G = Ve(T, F);
    return eE(G) ? G : void 0;
  }
  function sE(T) {
    var F = Tt.call(T, vn), G = T[vn];
    try {
      T[vn] = void 0;
      var Z = !0;
    } catch {
    }
    var Ne = ah.call(T);
    return Z && (F ? T[vn] = G : delete T[vn]), Ne;
  }
  var aE = uh ? function(T) {
    return T == null ? [] : (T = Object(T), k(uh(T), function(F) {
      return lh.call(T, F);
    }));
  } : yE, Ur = ts;
  (Cc && Ur(new Cc(new ArrayBuffer(1))) != K || Zi && Ur(new Zi()) != y || Dc && Ur(Dc.resolve()) != N || kc && Ur(new kc()) != z || Fc && Ur(new Fc()) != A) && (Ur = function(T) {
    var F = ts(T), G = F == E ? T.constructor : void 0, Z = G ? wn(G) : "";
    if (Z)
      switch (Z) {
        case b_:
          return K;
        case P_:
          return y;
        case T_:
          return N;
        case N_:
          return z;
        case R_:
          return A;
      }
    return F;
  });
  function oE(T, F) {
    return F = F ?? a, !!F && (typeof T == "number" || d.test(T)) && T > -1 && T % 1 == 0 && T < F;
  }
  function cE(T) {
    var F = typeof T;
    return F == "string" || F == "number" || F == "symbol" || F == "boolean" ? T !== "__proto__" : T === null;
  }
  function lE(T) {
    return !!sh && sh in T;
  }
  function uE(T) {
    var F = T && T.constructor, G = typeof F == "function" && F.prototype || dt;
    return T === G;
  }
  function fE(T) {
    return ah.call(T);
  }
  function wn(T) {
    if (T != null) {
      try {
        return Lr.call(T);
      } catch {
      }
      try {
        return T + "";
      } catch {
      }
    }
    return "";
  }
  function yh(T, F) {
    return T === F || T !== T && F !== F;
  }
  var dE = dh(/* @__PURE__ */ function() {
    return arguments;
  }()) ? dh : function(T) {
    return rs(T) && Tt.call(T, "callee") && !lh.call(T, "callee");
  }, _a = Array.isArray;
  function hE(T) {
    return T != null && $h(T.length) && !gh(T);
  }
  var jc = w_ || gE;
  function pE(T, F) {
    return hh(T, F);
  }
  function gh(T) {
    if (!vh(T))
      return !1;
    var F = ts(T);
    return F == h || F == $ || F == u || F == D;
  }
  function $h(T) {
    return typeof T == "number" && T > -1 && T % 1 == 0 && T <= a;
  }
  function vh(T) {
    var F = typeof T;
    return T != null && (F == "object" || F == "function");
  }
  function rs(T) {
    return T != null && typeof T == "object";
  }
  var _h = M ? Ae(M) : tE;
  function mE(T) {
    return hE(T) ? J_(T) : rE(T);
  }
  function yE() {
    return [];
  }
  function gE() {
    return !1;
  }
  e.exports = pE;
})(Vo, Vo.exports);
var PV = Vo.exports;
Object.defineProperty(da, "__esModule", { value: !0 });
da.DownloadedUpdateHelper = void 0;
da.createTempUpdateFile = AV;
const TV = Js, NV = mn, ly = PV, Nn = gn, Cs = Fe;
class RV {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Cs.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return ly(this.versionInfo, r) && ly(this.fileInfo.info, n.info) && await (0, Nn.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Nn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Nn.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Nn.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, Nn.readJson)(n);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Cs.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, Nn.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const c = await OV(o);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, o);
  }
  getUpdateInfoFile() {
    return Cs.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
da.DownloadedUpdateHelper = RV;
function OV(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const a = (0, TV.createHash)(t);
    a.on("error", s).setEncoding(r), (0, NV.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function AV(e, t, r) {
  let n = 0, i = Cs.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, Nn.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Cs.join(t, `${n++}-${e}`);
    }
  return i;
}
var Sc = {}, Zd = {};
Object.defineProperty(Zd, "__esModule", { value: !0 });
Zd.getAppCacheDir = CV;
const Nl = Fe, IV = Go;
function CV() {
  const e = (0, IV.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Nl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Nl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Nl.join(e, ".cache"), t;
}
Object.defineProperty(Sc, "__esModule", { value: !0 });
Sc.ElectronAppAdapter = void 0;
const uy = Fe, DV = Zd;
class kV {
  constructor(t = Cr.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? uy.join(process.resourcesPath, "app-update.yml") : uy.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, DV.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
Sc.ElectronAppAdapter = kV;
var o_ = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = He;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Cr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(s) {
      super(), this.proxyLoginCallback = s, this.cachedSession = null;
    }
    async download(s, a, o) {
      return await o.cancellationToken.createPromise((c, u, l) => {
        const f = {
          headers: o.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(s, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: o,
          onCancel: l,
          callback: (p) => {
            p == null ? c(a) : u(p);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(s, a) {
      s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const o = Cr.net.request({
        ...s,
        session: this.cachedSession
      });
      return o.on("response", a), this.proxyLoginCallback != null && o.on("login", this.proxyLoginCallback), o;
    }
    addRedirectHandlers(s, a, o, c, u) {
      s.on("redirect", (l, f, p) => {
        s.abort(), c > this.maxRedirects ? o(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(p, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(o_);
var ha = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.newBaseUrl = FV;
lr.newUrlFromBase = LV;
lr.getChannelFilename = jV;
const c_ = yn;
function FV(e) {
  const t = new c_.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function LV(e, t, r = !1) {
  const n = new c_.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function jV(e) {
  return `${e}.yml`;
}
var xe = {}, UV = "[object Symbol]", l_ = /[\\^$.*+?()[\]{}|]/g, MV = RegExp(l_.source), xV = typeof $t == "object" && $t && $t.Object === Object && $t, VV = typeof self == "object" && self && self.Object === Object && self, qV = xV || VV || Function("return this")(), BV = Object.prototype, GV = BV.toString, fy = qV.Symbol, dy = fy ? fy.prototype : void 0, hy = dy ? dy.toString : void 0;
function HV(e) {
  if (typeof e == "string")
    return e;
  if (KV(e))
    return hy ? hy.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function zV(e) {
  return !!e && typeof e == "object";
}
function KV(e) {
  return typeof e == "symbol" || zV(e) && GV.call(e) == UV;
}
function WV(e) {
  return e == null ? "" : HV(e);
}
function YV(e) {
  return e = WV(e), e && MV.test(e) ? e.replace(l_, "\\$&") : e;
}
var u_ = YV;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.Provider = void 0;
xe.findFile = e9;
xe.parseUpdateInfo = t9;
xe.getFileList = f_;
xe.resolveFiles = r9;
const hn = He, XV = rt, JV = yn, qo = lr, QV = u_;
class ZV {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, qo.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, qo.newUrlFromBase)(`${t.pathname.replace(new RegExp(QV(n), "g"), r)}.blockmap`, i ? new JV.URL(i) : t), s];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, hn.configureRequestUrl)(t, n), n;
  }
}
xe.Provider = ZV;
function e9(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, hn.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((a) => [a.url.pathname, a.info.url].some((o) => o.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((a) => !r.some((o) => a.url.pathname.toLowerCase().endsWith(`.${o.toLowerCase()}`))));
}
function t9(e, t, r) {
  if (e == null)
    throw (0, hn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, XV.load)(e);
  } catch (i) {
    throw (0, hn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function f_(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, hn.newError)(`No files provided: ${(0, hn.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function r9(e, t, r = (n) => n) {
  const i = f_(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, hn.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, hn.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, qo.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), s = e.packages, a = s == null ? null : s[process.arch] || s.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, qo.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(ha, "__esModule", { value: !0 });
ha.GenericProvider = void 0;
const py = He, Rl = lr, Ol = xe;
class n9 extends Ol.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Rl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Rl.getChannelFilename)(this.channel), r = (0, Rl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Ol.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof py.HttpError && i.statusCode === 404)
          throw (0, py.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((s, a) => {
            try {
              setTimeout(s, 1e3 * n);
            } catch (o) {
              a(o);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Ol.resolveFiles)(t, this.baseUrl);
  }
}
ha.GenericProvider = n9;
var bc = {}, Pc = {};
Object.defineProperty(Pc, "__esModule", { value: !0 });
Pc.BitbucketProvider = void 0;
const my = He, Al = lr, Il = xe;
class i9 extends Il.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, Al.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new my.CancellationToken(), r = (0, Al.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Al.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Il.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, my.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Il.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Pc.BitbucketProvider = i9;
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.GitHubProvider = pn.BaseGitHubProvider = void 0;
pn.computeReleaseNotes = h_;
const Nr = He, jn = a_, s9 = yn, wi = lr, Eu = xe, Cl = /\/tag\/([^/]+)$/;
class d_ extends Eu.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, wi.newBaseUrl)((0, Nr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, wi.newBaseUrl)((0, Nr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
pn.BaseGitHubProvider = d_;
class a9 extends d_ {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const a = new Nr.CancellationToken(), o = await this.httpRequest((0, wi.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), c = (0, Nr.parseXml)(o);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = jn.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          l = Cl.exec(u.element("link").attribute("href"))[1];
        else
          for (const m of c.getElements("entry")) {
            const E = Cl.exec(m.element("link").attribute("href"));
            if (E === null)
              continue;
            const N = E[1], D = ((n = jn.prerelease(N)) === null || n === void 0 ? void 0 : n[0]) || null, j = !v || ["alpha", "beta"].includes(v), z = D !== null && !["alpha", "beta"].includes(String(D));
            if (j && !z && !(v === "beta" && D === "alpha")) {
              l = N;
              break;
            }
            if (D && D === v) {
              l = N;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(a);
        for (const v of c.getElements("entry"))
          if (Cl.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, Nr.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${o}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Nr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, p = "", h = "";
    const $ = async (v) => {
      p = (0, wi.getChannelFilename)(v), h = (0, wi.newUrlFromBase)(this.getBaseDownloadPath(String(l), p), this.baseUrl);
      const m = this.createRequestOptions(h);
      try {
        return await this.executor.request(m, a);
      } catch (E) {
        throw E instanceof Nr.HttpError && E.statusCode === 404 ? (0, Nr.newError)(`Cannot find ${p} in the latest release artifacts (${h}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = jn.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((s = jn.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), f = await $(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        f = await $(this.getDefaultChannelName());
      else
        throw v;
    }
    const y = (0, Eu.parseUpdateInfo)(f, p, h);
    return y.releaseName == null && (y.releaseName = u.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = h_(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ...y
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, wi.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new s9.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Nr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Eu.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
pn.GitHubProvider = a9;
function yy(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function h_(e, t, r, n) {
  if (!t)
    return yy(n);
  const i = [];
  for (const s of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(s.element("link").attribute("href"))[1];
    jn.valid(a) && jn.lt(e, a) && i.push({
      version: a,
      note: yy(s)
    });
  }
  return i.sort((s, a) => jn.rcompare(s.version, a.version));
}
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
Tc.GitLabProvider = void 0;
const ht = He, Dl = yn, o9 = u_, ro = lr, kl = xe;
class c9 extends kl.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const s = t.host || "gitlab.com";
    this.baseApiUrl = (0, ro.newBaseUrl)(`https://${s}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new ht.CancellationToken(), r = (0, ro.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const p = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, h = await this.httpRequest(r, p, t);
      if (!h)
        throw (0, ht.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(h);
    } catch (p) {
      throw (0, ht.newError)(`Unable to find latest release on GitLab (${r}): ${p.stack || p.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let s = null, a = "", o = null;
    const c = async (p) => {
      a = (0, ro.getChannelFilename)(p);
      const h = n.assets.links.find((y) => y.name === a);
      if (!h)
        throw (0, ht.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      o = new Dl.URL(h.direct_asset_url);
      const $ = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const y = await this.httpRequest(o, $, t);
        if (!y)
          throw (0, ht.newError)(`Empty response from ${o}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return y;
      } catch (y) {
        throw y instanceof ht.HttpError && y.statusCode === 404 ? (0, ht.newError)(`Cannot find ${a} in the latest release artifacts (${o}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
    };
    try {
      s = await c(this.channel);
    } catch (p) {
      if (this.channel !== this.getDefaultChannelName())
        s = await c(this.getDefaultChannelName());
      else
        throw p;
    }
    if (!s)
      throw (0, ht.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, kl.parseUpdateInfo)(s, a, o);
    u.releaseName == null && (u.releaseName = n.name), u.releaseNotes == null && (u.releaseNotes = n.description || null);
    const l = /* @__PURE__ */ new Map();
    for (const p of n.assets.links)
      l.set(this.normalizeFilename(p.name), p.direct_asset_url);
    const f = {
      tag: i,
      assets: l,
      ...u
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const s = t.get(i);
      if (s)
        return new Dl.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new ht.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, ro.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, o = await this.httpRequest(s, a, r);
        if (o)
          return JSON.parse(o);
      } catch (a) {
        if (a instanceof ht.HttpError && a.statusCode === 404)
          continue;
        throw (0, ht.newError)(`Unable to find release ${i} on GitLab (${s}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, ht.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, s = null;
    const a = await this.getVersionInfoForBlockMap(r);
    a && (i = this.findBlockMapInAssets(a, n));
    const o = await this.getVersionInfoForBlockMap(t);
    if (o) {
      const c = n.replace(new RegExp(o9(r), "g"), t);
      s = this.findBlockMapInAssets(o, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [a, o] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!o)
        throw (0, ht.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, ht.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, o];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, kl.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, ht.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Dl.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Tc.GitLabProvider = c9;
var Nc = {};
Object.defineProperty(Nc, "__esModule", { value: !0 });
Nc.KeygenProvider = void 0;
const gy = He, Fl = lr, Ll = xe;
class l9 extends Ll.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Fl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new gy.CancellationToken(), r = (0, Fl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Fl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Ll.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, gy.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ll.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Nc.KeygenProvider = l9;
var Rc = {};
Object.defineProperty(Rc, "__esModule", { value: !0 });
Rc.PrivateGitHubProvider = void 0;
const oi = He, u9 = rt, f9 = Fe, $y = yn, vy = lr, d9 = pn, h9 = xe;
class p9 extends d9.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new oi.CancellationToken(), r = (0, vy.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, oi.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new $y.URL(i.url);
    let a;
    try {
      a = (0, u9.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (o) {
      throw o instanceof oi.HttpError && o.statusCode === 404 ? (0, oi.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : o;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, vy.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? s.find((a) => a.prerelease) || s[0] : s;
    } catch (s) {
      throw (0, oi.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, h9.getFileList)(t).map((r) => {
      const n = f9.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, oi.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new $y.URL(i.url),
        info: r
      };
    });
  }
}
Rc.PrivateGitHubProvider = p9;
Object.defineProperty(bc, "__esModule", { value: !0 });
bc.isUrlProbablySupportMultiRangeRequests = p_;
bc.createClient = _9;
const no = He, m9 = Pc, _y = ha, y9 = pn, g9 = Tc, $9 = Nc, v9 = Rc;
function p_(e) {
  return !e.includes("s3.amazonaws.com");
}
function _9(e, t, r) {
  if (typeof e == "string")
    throw (0, no.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new y9.GitHubProvider(i, t, r) : new v9.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new m9.BitbucketProvider(e, t, r);
    case "gitlab":
      return new g9.GitLabProvider(e, t, r);
    case "keygen":
      return new $9.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new _y.GenericProvider({
        provider: "generic",
        url: (0, no.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new _y.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && p_(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, no.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, no.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Oc = {}, pa = {}, Ji = {}, Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.OperationKind = void 0;
Qn.computeOperations = E9;
var Un;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Un || (Qn.OperationKind = Un = {}));
function E9(e, t, r) {
  const n = wy(e.files), i = wy(t.files);
  let s = null;
  const a = t.files[0], o = [], c = a.name, u = n.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: p, checksumToOldSize: h } = S9(n.get(c), u.offset, r);
  let $ = a.offset;
  for (let y = 0; y < l.checksums.length; $ += l.sizes[y], y++) {
    const v = l.sizes[y], m = l.checksums[y];
    let E = p.get(m);
    E != null && h.get(m) !== v && (r.warn(`Checksum ("${m}") matches, but size differs (old: ${h.get(m)}, new: ${v})`), E = void 0), E === void 0 ? (f++, s != null && s.kind === Un.DOWNLOAD && s.end === $ ? s.end += v : (s = {
      kind: Un.DOWNLOAD,
      start: $,
      end: $ + v
      // oldBlocks: null,
    }, Ey(s, o, m, y))) : s != null && s.kind === Un.COPY && s.end === E ? s.end += v : (s = {
      kind: Un.COPY,
      start: E,
      end: E + v
      // oldBlocks: [checksum]
    }, Ey(s, o, m, y));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), o;
}
const w9 = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Ey(e, t, r, n) {
  if (w9 && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((a, o) => a < o ? a : o);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Un[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function S9(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let s = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const o = e.checksums[a], c = e.sizes[a], u = i.get(o);
    if (u === void 0)
      n.set(o, s), i.set(o, c);
    else if (r.debug != null) {
      const l = u === c ? "(same size)" : `(size: ${u}, this size: ${c})`;
      r.debug(`${o} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    s += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function wy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.DataSplitter = void 0;
Ji.copyData = m_;
const io = He, b9 = mn, P9 = Xs, T9 = Qn, Sy = Buffer.from(`\r
\r
`);
var Jr;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Jr || (Jr = {}));
function m_(e, t, r, n, i) {
  const s = (0, b9.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  s.on("error", n), s.once("end", i), s.pipe(t, {
    end: !1
  });
}
class N9 extends P9.Writable {
  constructor(t, r, n, i, s, a, o, c) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = a, this.grandTotalBytes = o, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Jr.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      n();
    }).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, io.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Jr.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Jr.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Jr.BODY)
          this.readState = Jr.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, io.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const o = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (o < a)
            await this.copyExistingData(o, a);
          else if (o > a)
            throw (0, io.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Jr.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, s = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, s), this.remainingPartDataCount = n - (s - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const s = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== T9.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        m_(a, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Sy, r);
    if (n !== -1)
      return n + Sy.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, io.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r, this.transferred += n - r, this.delta += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((s, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), s();
      });
    });
  }
}
Ji.DataSplitter = N9;
var Ac = {};
Object.defineProperty(Ac, "__esModule", { value: !0 });
Ac.executeTasksUsingMultipleRangeRequests = R9;
Ac.checkIsRangesSupported = Su;
const wu = He, by = Ji, Py = Qn;
function R9(e, t, r, n, i) {
  const s = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = a + 1e3;
    O9(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => s(o), i);
  };
  return s;
}
function O9(e, t, r, n, i) {
  let s = "bytes=", a = 0, o = 0;
  const c = /* @__PURE__ */ new Map(), u = [];
  for (let p = t.start; p < t.end; p++) {
    const h = t.tasks[p];
    h.kind === Py.OperationKind.DOWNLOAD && (s += `${h.start}-${h.end - 1}, `, c.set(a, p), a++, u.push(h.end - h.start), o += h.end - h.start);
  }
  if (a <= 1) {
    const p = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const $ = t.tasks[h++];
      if ($.kind === Py.OperationKind.COPY)
        (0, by.copyData)($, r, t.oldFileFd, i, () => p(h));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${$.start}-${$.end - 1}`;
        const v = e.httpExecutor.createRequest(y, (m) => {
          m.on("error", i), Su(m, i) && (m.pipe(r, {
            end: !1
          }), m.once("end", () => p(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(v, i), v.end();
      }
    };
    p(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = s.substring(0, s.length - 2);
  const f = e.httpExecutor.createRequest(l, (p) => {
    if (!Su(p, i))
      return;
    const h = (0, wu.safeGetHeader)(p, "content-type"), $ = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(h);
    if ($ == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const y = new by.DataSplitter(r, t, c, $[1] || $[2], u, n, o, e.options.onProgress);
    y.on("error", i), p.pipe(y), p.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Su(e, t) {
  if (e.statusCode >= 400)
    return t((0, wu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, wu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
Ic.ProgressDifferentialDownloadCallbackTransform = void 0;
const A9 = Xs;
var Si;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Si || (Si = {}));
class I9 extends A9.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Si.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Si.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Si.COPY;
  }
  beginRangeDownload() {
    this.operationType = Si.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ic.ProgressDifferentialDownloadCallbackTransform = I9;
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.DifferentialDownloader = void 0;
const ds = He, jl = gn, C9 = mn, D9 = Ji, k9 = yn, so = Qn, Ty = Ac, F9 = Ic;
class L9 {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, ds.configureRequestUrl)(this.options.newUrl, t), (0, ds.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, so.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, a = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === so.OperationKind.DOWNLOAD ? s += u : a += u;
    }
    const o = this.blockAwareFileInfo.size;
    if (s + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${a}, newSize: ${o}`);
    return n.info(`Full: ${Ny(o)}, To download: ${Ny(s)} (${Math.round(s / (o / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, jl.close)(i.descriptor).catch((s) => {
      this.logger.error(`cannot close file "${i.path}": ${s}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((s) => {
      try {
        this.logger.error(`cannot close files: ${s}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, jl.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, jl.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, C9.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, o) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const m = [];
        let E = 0;
        for (const D of t)
          D.kind === so.OperationKind.DOWNLOAD && (m.push(D.end - D.start), E += D.end - D.start);
        const N = {
          expectedByteCounts: m,
          grandTotal: E
        };
        u = new F9.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new ds.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), s.on("finish", () => {
        s.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (m) {
            o(m);
            return;
          }
          a(void 0);
        });
      }), c.push(s);
      let f = null;
      for (const m of c)
        m.on("error", o), f == null ? f = m : f = f.pipe(m);
      const p = c[0];
      let h;
      if (this.options.isUseMultipleRangeRequest) {
        h = (0, Ty.executeTasksUsingMultipleRangeRequests)(this, t, p, n, o), h(0);
        return;
      }
      let $ = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", h = (m) => {
        var E, N;
        if (m >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const D = t[m++];
        if (D.kind === so.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, D9.copyData)(D, p, n, o, () => h(m));
          return;
        }
        const j = `bytes=${D.start}-${D.end - 1}`;
        v.headers.range = j, (N = (E = this.logger) === null || E === void 0 ? void 0 : E.debug) === null || N === void 0 || N.call(E, `download range: ${j}`), u && u.beginRangeDownload();
        const z = this.httpExecutor.createRequest(v, (Q) => {
          Q.on("error", o), Q.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && o((0, ds.createHttpError)(Q)), Q.pipe(p, {
            end: !1
          }), Q.once("end", () => {
            u && u.endRangeDownload(), ++$ === 100 ? ($ = 0, setTimeout(() => h(m), 1e3)) : h(m);
          });
        });
        z.on("redirect", (Q, se, W) => {
          this.logger.info(`Redirect to ${j9(W)}`), y = W, (0, ds.configureRequestUrl)(new k9.URL(y), v), z.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(z, o), z.end();
      }, h(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let s = 0;
    if (await this.request(i, (a) => {
      a.copy(n, s), s += a.length;
    }), s !== n.length)
      throw new Error(`Received data length ${s} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const s = this.httpExecutor.createRequest(t, (a) => {
        (0, Ty.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
pa.DifferentialDownloader = L9;
function Ny(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function j9(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Oc, "__esModule", { value: !0 });
Oc.GenericDifferentialDownloader = void 0;
const U9 = pa;
class M9 extends U9.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Oc.GenericDifferentialDownloader = M9;
var $n = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = He;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(s) {
      this.emitter = s;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(s) {
      n(this.emitter, "login", s);
    }
    progress(s) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, s);
    }
    updateDownloaded(s) {
      n(this.emitter, e.UPDATE_DOWNLOADED, s);
    }
    updateCancelled(s) {
      n(this.emitter, "update-cancelled", s);
    }
  }
  e.UpdaterSignal = r;
  function n(i, s, a) {
    i.on(s, a);
  }
})($n);
Object.defineProperty(un, "__esModule", { value: !0 });
un.NoOpLogger = un.AppUpdater = void 0;
const pt = He, x9 = Js, V9 = Go, q9 = Yy, Yt = gn, B9 = rt, Ul = gc, Xt = Fe, Rn = a_, Ry = da, G9 = Sc, Oy = o_, H9 = ha, Ml = bc, xl = Jy, z9 = Oc, ci = $n;
class eh extends q9.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, pt.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, pt.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Oy.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new y_();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Ul.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new ci.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new Ul.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Ul.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new G9.ElectronAppAdapter(), this.httpExecutor = new Oy.ElectronHttpExecutor((s, a) => this.emit("login", s, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Rn.parse)(n);
    if (i == null)
      throw (0, pt.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = K9(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new H9.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Ml.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Ml.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = eh.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Cr.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = pt.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Rn.parse)(t.version);
    if (r == null)
      throw (0, pt.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Rn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, Rn.gt)(r, n), a = (0, Rn.lt)(r, n);
    return s ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, V9.release)();
    if (r)
      try {
        if ((0, Rn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Ml.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new pt.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, pt.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new pt.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, pt.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof pt.CancellationError))
        try {
          this.dispatchError(i);
        } catch (s) {
          this._logger.warn(`Cannot dispatch error event: ${s.stack || s}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(ci.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, B9.load)(await (0, Yt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Xt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Yt.readFile)(t, "utf-8");
      if (pt.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = pt.UUID.v5((0, x9.randomBytes)(4096), pt.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Yt.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Xt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Ry.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(ci.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (E) => this.emit(ci.DOWNLOAD_PROGRESS, E));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, a = r.packageInfo;
    function o() {
      const E = decodeURIComponent(t.fileInfo.url.pathname);
      return E.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Xt.basename(E) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, Yt.mkdir)(u, { recursive: !0 });
    const l = o();
    let f = Xt.join(u, l);
    const p = a == null ? null : Xt.join(u, `package-${s}${Xt.extname(a.path) || ".7z"}`), h = async (E) => {
      await c.setDownloadedFile(f, p, i, r, l, E), await t.done({
        ...i,
        downloadedFile: f
      });
      const N = Xt.join(u, "current.blockmap");
      return await (0, Yt.pathExists)(N) && await (0, Yt.copyFile)(N, Xt.join(c.cacheDir, "current.blockmap")), p == null ? [f] : [f, p];
    }, $ = this._logger, y = await c.validateDownloadedPath(f, i, r, $);
    if (y != null)
      return f = y, await h(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, Yt.unlink)(f).catch(() => {
    })), m = await (0, Ry.createTempUpdateFile)(`temp-${l}`, u, $);
    try {
      await t.task(m, n, p, v), await (0, pt.retry)(() => (0, Yt.rename)(m, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (E) => E instanceof Error && /^EBUSY:/.test(E.message) ? !0 : ($.warn(`Cannot rename temp file to final file: ${E.message || E.stack}`), !1)
      });
    } catch (E) {
      throw await v(), E instanceof pt.CancellationError && ($.info("cancelled"), this.emit("update-cancelled", i)), E;
    }
    return $.info(`New version ${s} has been downloaded to ${f}`), await h(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = r.updateInfoAndProvider.provider, o = await a.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
      const c = async ($) => {
        const y = await this.httpExecutor.downloadToBuffer($, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (y == null || y.length === 0)
          throw new Error(`Blockmap "${$.href}" is empty`);
        try {
          return JSON.parse((0, xl.gunzipSync)(y).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${$.href}", error: ${v}`);
        }
      }, u = {
        newUrl: t.url,
        oldFile: Xt.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(ci.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = ($) => this.emit(ci.DOWNLOAD_PROGRESS, $));
      const l = async ($, y) => {
        const v = Xt.join(y, "current.blockmap");
        await (0, Yt.outputFile)(v, (0, xl.gzipSync)(JSON.stringify($)));
      }, f = async ($) => {
        const y = Xt.join($, "current.blockmap");
        try {
          if (await (0, Yt.pathExists)(y))
            return JSON.parse((0, xl.gunzipSync)(await (0, Yt.readFile)(y)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${v}`);
        }
        return null;
      }, p = await c(o[1]);
      await l(p, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let h = await f(this.downloadedUpdateHelper.cacheDir);
      return h == null && (h = await c(o[0])), await new z9.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(h, p), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
un.AppUpdater = eh;
function K9(e) {
  const t = (0, Rn.prerelease)(e);
  return t != null && t.length > 0;
}
class y_ {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
un.NoOpLogger = y_;
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.BaseUpdater = void 0;
const Ay = Bo, W9 = un;
class Y9 extends W9.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Cr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, s = n == null ? null : n.downloadedFileInfo;
    if (i == null || s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: s.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, Ay.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: s, status: a, stdout: o, stderr: c } = i;
    if (s != null)
      throw this._logger.error(c), s;
    if (a != null && a !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${a}`);
    return o.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((s, a) => {
      try {
        const o = { stdio: i, env: n, detached: !0 }, c = (0, Ay.spawn)(t, r, o);
        c.on("error", (u) => {
          a(u);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (o) {
        a(o);
      }
    });
  }
}
Jn.BaseUpdater = Y9;
var Gs = {}, ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
ma.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const li = gn, X9 = pa, J9 = Jy;
class Q9 extends X9.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = g_(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Z9(this.options.oldFile), i);
  }
}
ma.FileWithEmbeddedBlockMapDifferentialDownloader = Q9;
function g_(e) {
  return JSON.parse((0, J9.inflateRawSync)(e).toString());
}
async function Z9(e) {
  const t = await (0, li.open)(e, "r");
  try {
    const r = (await (0, li.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, li.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, li.read)(t, i, 0, i.length, r - n.length - i.length), await (0, li.close)(t), g_(i);
  } catch (r) {
    throw await (0, li.close)(t), r;
  }
}
Object.defineProperty(Gs, "__esModule", { value: !0 });
Gs.AppImageUpdater = void 0;
const Iy = He, Cy = Bo, eq = gn, tq = mn, hs = Fe, rq = Jn, nq = ma, iq = xe, Dy = $n;
class sq extends rq.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, iq.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Iy.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, eq.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, s) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: s.requestHeaders,
        cancellationToken: s.cancellationToken
      };
      return this.listenerCount(Dy.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(Dy.DOWNLOAD_PROGRESS, o)), await new nq.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Iy.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, tq.unlinkSync)(r);
    let n;
    const i = hs.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    hs.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = hs.join(hs.dirname(r), hs.basename(s)), (0, Cy.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Cy.execFileSync)(n, [], { env: a })), !0;
  }
}
Gs.AppImageUpdater = sq;
var Hs = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.LinuxUpdater = void 0;
const aq = Jn;
class oq extends aq.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, n = `"${r} would like to update"`, i = this.sudoWithArgs(n);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let s = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (s = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${s}/bin/bash`, "-c", `'${t.join(" ")}'${s}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    const n = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    if (n)
      return n;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
Qi.LinuxUpdater = oq;
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.DebUpdater = void 0;
const cq = xe, ky = $n, lq = Qi;
class th extends lq.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, cq.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(ky.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(ky.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      th.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var s;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (a) {
        i.warn((s = a.message) !== null && s !== void 0 ? s : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Hs.DebUpdater = th;
var zs = {};
Object.defineProperty(zs, "__esModule", { value: !0 });
zs.PacmanUpdater = void 0;
const Fy = $n, uq = xe, fq = Qi;
class rh extends fq.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, uq.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Fy.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Fy.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      rh.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (s) {
      n.warn((i = s.message) !== null && i !== void 0 ? i : s), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw n.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
zs.PacmanUpdater = rh;
var Ks = {};
Object.defineProperty(Ks, "__esModule", { value: !0 });
Ks.RpmUpdater = void 0;
const Ly = $n, dq = xe, hq = Qi;
class nh extends hq.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, dq.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Ly.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Ly.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      nh.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Ks.RpmUpdater = nh;
var Ws = {};
Object.defineProperty(Ws, "__esModule", { value: !0 });
Ws.MacUpdater = void 0;
const jy = He, Vl = gn, pq = mn, Uy = Fe, mq = bE, yq = un, gq = xe, My = Bo, xy = Js;
class $q extends yq.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Cr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let s = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), s = (0, My.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, My.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${p}`), a = a || p;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || s;
    const o = (f) => {
      var p;
      return f.url.pathname.includes("arm64") || ((p = f.info.url) === null || p === void 0 ? void 0 : p.includes("arm64"));
    };
    a && r.some(o) ? r = r.filter((f) => a === o(f)) : r = r.filter((f) => !o(f));
    const c = (0, gq.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, jy.newError)(`ZIP file not provided: ${(0, jy.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (f, p) => {
        const h = Uy.join(this.downloadedUpdateHelper.cacheDir, l), $ = () => (0, Vl.pathExistsSync)(h) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        $() && (y = await this.differentialDownloadInstaller(c, t, f, u, l)), y && await this.httpExecutor.download(c.url, f, p);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = Uy.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, Vl.copyFile)(f.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(c, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Vl.stat)(i)).size, a = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, mq.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const f = (0, xy.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${f}`, "ascii"), h = `/${(0, xy.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", ($, y) => {
        const v = $.url;
        if (a.info(`${v} requested`), v === "/") {
          if (!$.headers.authorization || $.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const N = $.headers.authorization.split(" ")[1], D = Buffer.from(N, "base64").toString("ascii"), [j, z] = D.split(":");
          if (j !== "autoupdater" || z !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const Q = Buffer.from(`{ "url": "${c(this.server)}${h}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": Q.length }), y.end(Q);
          return;
        }
        if (!v.startsWith(h)) {
          a.warn(`${v} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${h} requested by Squirrel.Mac, pipe ${i}`);
        let m = !1;
        y.on("finish", () => {
          m || (this.nativeUpdater.removeListener("error", l), u([]));
        });
        const E = (0, pq.createReadStream)(i);
        E.on("error", (N) => {
          try {
            y.end();
          } catch (D) {
            a.warn(`cannot end response: ${D}`);
          }
          m = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${N}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), E.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${o})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${o})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${p.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : u([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Ws.MacUpdater = $q;
var Ys = {}, ih = {};
Object.defineProperty(ih, "__esModule", { value: !0 });
ih.verifySignature = _q;
const Vy = He, $_ = Bo, vq = Go, qy = Fe;
function v_(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function _q(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, $_.execFile)(...v_(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, o, c) => {
      var u;
      try {
        if (a != null || c) {
          ql(r, a, c, i), n(null);
          return;
        }
        const l = Eq(o);
        if (l.Status === 0) {
          try {
            const $ = qy.normalize(l.Path), y = qy.normalize(t);
            if (r.info(`LiteralPath: ${$}. Update Path: ${y}`), $ !== y) {
              ql(r, new Error(`LiteralPath of ${$} is different than ${y}`), c, i), n(null);
              return;
            }
          } catch ($) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = $.message) !== null && u !== void 0 ? u : $.stack}`);
          }
          const p = (0, Vy.parseDn)(l.SignerCertificate.Subject);
          let h = !1;
          for (const $ of e) {
            const y = (0, Vy.parseDn)($);
            if (y.size ? h = Array.from(y.keys()).every((m) => y.get(m) === p.get(m)) : $ === p.get("CN") && (r.warn(`Signature validated using only CN ${$}. Please add your full Distinguished Name (DN) to publisherNames configuration`), h = !0), h) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (p, h) => p === "RawData" ? void 0 : h, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (l) {
        ql(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function Eq(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function ql(e, t, r, n) {
  if (wq()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, $_.execFileSync)(...v_("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function wq() {
  const e = vq.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.NsisUpdater = void 0;
const ao = He, By = Fe, Sq = Jn, bq = ma, Gy = $n, Pq = xe, Tq = gn, Nq = ih, Hy = yn;
class Rq extends Sq.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Nq.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Pq.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, a, o) => {
        const c = n.packageInfo, u = c != null && a != null;
        if (u && t.disableWebInstaller)
          throw (0, ao.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, ao.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await o(), (0, ao.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, a, r))
          try {
            await this.httpExecutor.download(new Hy.URL(c.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, Tq.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const s = () => {
      this.spawnLog(By.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((a) => {
      const o = a.code;
      this._logger.info(`Cannot run installer: error code: ${o}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), o === "UNKNOWN" || o === "EACCES" ? s() : o === "ENOENT" ? Cr.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new Hy.URL(r.path),
        oldFile: By.join(this.downloadedUpdateHelper.cacheDir, ao.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Gy.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Gy.DOWNLOAD_PROGRESS, a)), await new bq.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
Ys.NsisUpdater = Rq;
(function(e) {
  var t = $t && $t.__createBinding || (Object.create ? function(v, m, E, N) {
    N === void 0 && (N = E);
    var D = Object.getOwnPropertyDescriptor(m, E);
    (!D || ("get" in D ? !m.__esModule : D.writable || D.configurable)) && (D = { enumerable: !0, get: function() {
      return m[E];
    } }), Object.defineProperty(v, N, D);
  } : function(v, m, E, N) {
    N === void 0 && (N = E), v[N] = m[E];
  }), r = $t && $t.__exportStar || function(v, m) {
    for (var E in v) E !== "default" && !Object.prototype.hasOwnProperty.call(m, E) && t(m, v, E);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = gn, i = Fe;
  var s = Jn;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var a = un;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var o = xe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return o.Provider;
  } });
  var c = Gs;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = Hs;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = zs;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = Ks;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var p = Ws;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return p.MacUpdater;
  } });
  var h = Ys;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return h.NsisUpdater;
  } }), r($n, e);
  let $;
  function y() {
    if (process.platform === "win32")
      $ = new Ys.NsisUpdater();
    else if (process.platform === "darwin")
      $ = new Ws.MacUpdater();
    else {
      $ = new Gs.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(v))
          return $;
        switch ((0, n.readFileSync)(v).toString().trim()) {
          case "deb":
            $ = new Hs.DebUpdater();
            break;
          case "rpm":
            $ = new Ks.RpmUpdater();
            break;
          case "pacman":
            $ = new zs.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return $;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => $ || y()
  });
})(xt);
const Oq = wE(import.meta.url), zy = ve.dirname(Oq), ui = new aF();
pi.whenReady().then(() => {
  const e = new _E({
    width: 800,
    height: 750,
    webPreferences: {
      preload: ve.join(zy, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  });
  process.env.VITE_DEV_SERVER_URL ? e.loadURL(process.env.VITE_DEV_SERVER_URL) : e.loadFile(ve.join(zy, "../dist/index.html")), xt.autoUpdater.autoDownload = !1, xt.autoUpdater.autoInstallOnAppQuit = !0;
  let t = !1;
  xt.autoUpdater.on("update-available", (r) => {
    const n = ui.get("skippedUpdateVersion");
    !t && r.version === n || e.webContents.send("update-event", { type: "update-available", info: r });
  }), xt.autoUpdater.on("update-not-available", (r) => {
    t && e.webContents.send("update-event", { type: "update-not-available", info: r });
  }), xt.autoUpdater.on("download-progress", (r) => {
    e.webContents.send("update-event", { type: "download-progress", progress: r });
  }), xt.autoUpdater.on("update-downloaded", (r) => {
    e.webContents.send("update-event", { type: "update-downloaded", info: r });
  }), xt.autoUpdater.on("error", (r) => {
    e.webContents.send("update-event", { type: "error", error: r.message });
  }), setTimeout(() => {
    t = !1, xt.autoUpdater.checkForUpdates().catch(() => {
    });
  }, 3e3), xr.handle("check-for-updates", async (r, n) => {
    t = n;
    try {
      return await xt.autoUpdater.checkForUpdates(), { success: !0 };
    } catch (i) {
      return { success: !1, error: i.message };
    }
  }), xr.handle("download-update", async () => {
    try {
      return await xt.autoUpdater.downloadUpdate(), { success: !0 };
    } catch (r) {
      return { success: !1, error: r.message };
    }
  }), xr.handle("install-update", () => {
    xt.autoUpdater.quitAndInstall();
  }), xr.handle("skip-update", (r, n) => (ui.set("skippedUpdateVersion", n), !0)), xr.handle("get-settings", () => ui.get("defaultPath", pi.getPath("documents"))), xr.handle("save-settings", (r, n) => (ui.set("defaultPath", n), !0)), xr.handle("select-default-path", async () => {
    const r = ui.get("defaultPath", pi.getPath("documents")), n = await Sh.showOpenDialog(e, {
      defaultPath: r,
      properties: ["openDirectory"],
      title: "Standard-Ordner auswählen",
      buttonLabel: "Ordner wählen"
    });
    return n.canceled || n.filePaths.length === 0 ? { success: !1 } : { success: !0, filePath: n.filePaths[0] };
  }), xr.handle("select-folder-and-save", async (r, n) => {
    const i = ui.get("defaultPath", pi.getPath("documents")), s = await Sh.showOpenDialog(e, {
      defaultPath: i,
      properties: ["openDirectory"],
      title: "Bitte Zielordner auswählen",
      buttonLabel: "Speichern unter"
    });
    if (s.canceled || s.filePaths.length === 0)
      return { success: !1, error: "Abgebrochen" };
    const a = s.filePaths[0], o = ve.join(a, "_fertig.txt");
    try {
      const c = JSON.stringify(n, null, 2);
      return await EE.writeFile(o, c, "utf-8"), { success: !0, filePath: o };
    } catch (c) {
      return { success: !1, error: c.message };
    }
  });
});
pi.on("window-all-closed", () => {
  process.platform !== "darwin" && pi.quit();
});
