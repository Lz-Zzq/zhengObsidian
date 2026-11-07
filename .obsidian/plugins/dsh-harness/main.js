var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DshHarnessPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian10 = require("obsidian");
var import_node_os10 = require("node:os");
var import_node_path17 = require("node:path");

// src/exec-env.ts
var import_node_child_process = require("node:child_process");
var import_node_fs = require("node:fs");
var import_node_os = require("node:os");
function pathSeparator(platform) {
  return platform === "win32" ? ";" : ":";
}
function posixJoin(...parts) {
  return parts.filter((p) => p !== "").join("/").replace(/\/{2,}/g, "/");
}
function mergePaths(current2, extras, separator) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const part of [...current2.split(separator), ...extras]) {
    const p = part.trim();
    if (p === "" || seen.has(p)) continue;
    seen.add(p);
    out.push(p);
  }
  return out.join(separator);
}
function compareNodeVersion(a, b) {
  var _a, _b;
  const parse = (v) => v.replace(/^v/, "").split(".").map((s) => Number.parseInt(s, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i += 1) {
    const d = ((_a = pa[i]) != null ? _a : 0) - ((_b = pb[i]) != null ? _b : 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}
function nvmNodeBinDirs(nvmBase, readDir = import_node_fs.readdirSync, exists = import_node_fs.existsSync) {
  if (nvmBase === "") return [];
  let names;
  try {
    names = readDir(posixJoin(nvmBase, "versions", "node"));
  } catch (e) {
    return [];
  }
  return names.filter((n) => /^v?\d+\.\d+\.\d+/.test(n)).sort(compareNodeVersion).map((n) => posixJoin(nvmBase, "versions", "node", n, "bin")).filter((p) => exists(p));
}
function nvmGlobalModuleRoots(opts = {}) {
  var _a, _b, _c, _d, _e;
  const env = (_a = opts.env) != null ? _a : process.env;
  const home = (_b = opts.homeDir) != null ? _b : (0, import_node_os.homedir)();
  const readDir = (_c = opts.readDir) != null ? _c : import_node_fs.readdirSync;
  const exists = (_d = opts.exists) != null ? _d : import_node_fs.existsSync;
  const nvmEnvDir = ((_e = env.NVM_DIR) != null ? _e : "").trim();
  const nvmBase = nvmEnvDir !== "" ? nvmEnvDir : posixJoin(home, ".nvm");
  return nvmNodeBinDirs(nvmBase, readDir, exists).reverse().map((bin) => bin.replace(/\/bin$/, "/lib/node_modules"));
}
function posixPathExtras(opts = {}) {
  var _a, _b, _c, _d, _e, _f;
  const env = (_a = opts.env) != null ? _a : process.env;
  const home = (_b = opts.homeDir) != null ? _b : (0, import_node_os.homedir)();
  const exists = (_c = opts.exists) != null ? _c : import_node_fs.existsSync;
  const readDir = (_d = opts.readDir) != null ? _d : import_node_fs.readdirSync;
  const dirs = [];
  const nvmBin = ((_e = env.NVM_BIN) != null ? _e : "").trim();
  if (nvmBin !== "") dirs.push(nvmBin);
  const nvmEnvDir = ((_f = env.NVM_DIR) != null ? _f : "").trim();
  const nvmBase = nvmEnvDir !== "" ? nvmEnvDir : posixJoin(home, ".nvm");
  dirs.push(...nvmNodeBinDirs(nvmBase, readDir, exists).reverse());
  dirs.push(posixJoin(home, ".volta", "bin"));
  dirs.push(posixJoin(home, "Library", "Application Support", "fnm", "aliases", "default", "bin"));
  dirs.push(posixJoin(home, ".fnm", "aliases", "default", "bin"));
  dirs.push(posixJoin(home, ".asdf", "shims"));
  dirs.push("/opt/homebrew/bin");
  dirs.push("/opt/homebrew/sbin");
  dirs.push("/usr/local/bin");
  dirs.push("/usr/local/sbin");
  dirs.push(posixJoin(home, "Library", "pnpm"));
  dirs.push(posixJoin(home, ".local", "share", "pnpm"));
  dirs.push(posixJoin(home, ".yarn", "bin"));
  dirs.push(posixJoin(home, ".bun", "bin"));
  dirs.push(posixJoin(home, ".local", "bin"));
  dirs.push(posixJoin(home, "bin"));
  return dirs.filter((d) => d !== "" && exists(d));
}
function readWindowsRegistryPath() {
  try {
    const script = "[Environment]::ExpandEnvironmentVariables(([Environment]::GetEnvironmentVariable('Path','Machine')+';'+[Environment]::GetEnvironmentVariable('Path','User')))";
    return (0, import_node_child_process.execFileSync)(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", windowsHide: true, timeout: 15e3 }
    ).trim();
  } catch (e) {
    return "";
  }
}
var capturedShellPath = "";
function effectiveShellPath(opts) {
  if (opts.shellPath !== void 0) return opts.shellPath;
  if (Object.keys(opts).length > 0) return "";
  return capturedShellPath;
}
function computeRefreshedPath(opts = {}) {
  var _a, _b, _c, _d, _e;
  const platform = (_a = opts.platform) != null ? _a : process.platform;
  const env = (_b = opts.env) != null ? _b : process.env;
  const current2 = (_d = (_c = env.PATH) != null ? _c : env.Path) != null ? _d : "";
  if (platform === "win32") {
    const registry = ((_e = opts.readWindowsRegistryPath) != null ? _e : readWindowsRegistryPath)();
    return mergePaths(current2, registry === "" ? [] : registry.split(";"), pathSeparator(platform));
  }
  const shellPath = effectiveShellPath(opts);
  const base = shellPath === "" ? current2 : mergePaths(shellPath, [current2], pathSeparator(platform));
  return mergePaths(base, posixPathExtras(opts), pathSeparator(platform));
}
var cachedPath;
function invalidateRefreshedPath() {
  cachedPath = void 0;
}
function refreshedPath(opts = {}) {
  const cacheable = Object.keys(opts).length === 0;
  if (cacheable && cachedPath !== void 0) return cachedPath;
  const path = computeRefreshedPath(opts);
  if (cacheable) cachedPath = path;
  return path;
}
function refreshedEnv(opts = {}) {
  var _a;
  const env = (_a = opts.env) != null ? _a : process.env;
  const path = refreshedPath(opts);
  return { ...env, PATH: path, Path: path };
}
function hasBin(name, opts = {}) {
  var _a;
  const platform = (_a = opts.platform) != null ? _a : process.platform;
  const probe = platform === "win32" ? "where" : "which";
  try {
    (0, import_node_child_process.execFileSync)(probe, [name], { stdio: "ignore", env: refreshedEnv(opts) });
    return true;
  } catch (e) {
    return false;
  }
}
var LOGIN_SHELL_TIMEOUT_MS = 5e3;
function parseShellPath(output) {
  var _a, _b;
  const lines = String(output != null ? output : "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "");
  const last = lines.length > 0 ? (_a = lines[lines.length - 1]) != null ? _a : "" : "";
  if (last === "" || last.length > 8192) return "";
  for (const ch of last) {
    if (((_b = ch.codePointAt(0)) != null ? _b : 0) < 32) return "";
  }
  const segments = last.split(":").filter((s) => s !== "");
  if (segments.filter((s) => s.startsWith("/")).length < 2) return "";
  return last;
}
function resolveLoginShell(opts = {}) {
  var _a, _b, _c;
  const env = (_a = opts.env) != null ? _a : process.env;
  const exists = (_b = opts.exists) != null ? _b : import_node_fs.existsSync;
  const candidates = [opts.shell, ((_c = env.SHELL) != null ? _c : "").trim(), "/bin/zsh", "/bin/bash", "/bin/sh"];
  for (const candidate of candidates) {
    if (candidate !== void 0 && candidate !== "" && exists(candidate)) return candidate;
  }
  return "";
}
function defaultShellRunner(file, args, opts) {
  return new Promise((resolve2) => {
    try {
      (0, import_node_child_process.execFile)(
        file,
        args,
        {
          cwd: opts.cwd,
          env: opts.env,
          encoding: "utf8",
          timeout: opts.timeoutMs,
          maxBuffer: 64 * 1024,
          windowsHide: true
        },
        (err, stdout) => {
          resolve2({ ok: err === null, out: String(stdout != null ? stdout : "") });
        }
      );
    } catch (e) {
      resolve2({ ok: false, out: "" });
    }
  });
}
async function runLoginShellCapture(opts) {
  var _a, _b, _c, _d, _e;
  const platform = (_a = opts.platform) != null ? _a : process.platform;
  if (platform === "win32") return "";
  const shell = resolveLoginShell(opts);
  if (shell === "") return "";
  const run5 = (_b = opts.runShell) != null ? _b : defaultShellRunner;
  let result;
  try {
    result = await run5(shell, ["-ilc", 'printf %s "$PATH"'], {
      cwd: (_c = opts.homeDir) != null ? _c : (0, import_node_os.homedir)(),
      env: (_d = opts.env) != null ? _d : process.env,
      timeoutMs: (_e = opts.timeoutMs) != null ? _e : LOGIN_SHELL_TIMEOUT_MS
    });
  } catch (e) {
    return "";
  }
  if (!result.ok) return "";
  return parseShellPath(result.out);
}
var shellPathPromise = null;
function captureLoginShellPathAsync(opts = {}) {
  const cacheable = Object.keys(opts).length === 0 || opts.force === true;
  if (cacheable && opts.force !== true && shellPathPromise !== null) return shellPathPromise;
  const promise = runLoginShellCapture(opts);
  if (Object.keys(opts).filter((k) => k !== "force").length === 0) {
    shellPathPromise = promise;
    void promise.then((value) => {
      capturedShellPath = value;
      invalidateRefreshedPath();
    });
  }
  return promise;
}
async function prepareExecEnvAsync(opts = {}) {
  const captured = await captureLoginShellPathAsync(opts);
  if (captured !== "") invalidateRefreshedPath();
  return captured;
}
function prewarmLoginShellPath() {
  try {
    void captureLoginShellPathAsync().catch(() => "");
  } catch (e) {
  }
}

// src/service-manager.ts
var import_node_child_process2 = require("node:child_process");
var import_node_fs4 = require("node:fs");
var import_node_net = require("node:net");
var import_node_os2 = require("node:os");
var import_node_path2 = require("node:path");

// src/i18n.ts
var dict = {
  // ---- 语言设置 ----
  "settings.language.title": ["\u754C\u9762\u8BED\u8A00", "Language"],
  "settings.language.desc": ["\u63D2\u4EF6\u754C\u9762\u8BED\u8A00\uFF1B\u8DDF\u968F Obsidian\uFF08\u4EC5\u4E2D\u6587/\u82F1\u6587\uFF0C\u5176\u4ED6\u8BED\u8A00\u81EA\u52A8\u82F1\u6587\uFF09", "Plugin UI language; follows Obsidian (Chinese or English \u2014 any other language falls back to English)"],
  "settings.language.auto": ["\u8DDF\u968F Obsidian", "Follow Obsidian"],
  "settings.language.zh": ["\u4E2D\u6587", "\u4E2D\u6587"],
  "settings.language.en": ["English", "English"],
  // ---- 状态横幅 ----
  "settings.status.title": ["DSH \u72B6\u6001", "DSH Status"],
  "settings.status.reading": ["\u8BFB\u53D6\u4E2D\u2026", "Reading\u2026"],
  "settings.status.installedVer": ["\u5DF2\u5B89\u88C5\uFF08{v}\uFF09 \xB7 \u670D\u52A1\u8FD0\u884C\u4E2D \u2713", "Installed ({v}) \xB7 running \u2713"],
  "settings.status.installed": ["\u5DF2\u5B89\u88C5 \xB7 \u670D\u52A1\u8FD0\u884C\u4E2D \u2713", "Installed \xB7 running \u2713"],
  "settings.status.stopped": ["\u5DF2\u5B89\u88C5 \xB7 \u670D\u52A1\u672A\u542F\u52A8", "Installed \xB7 not running"],
  "settings.status.notInstalled": ["\u672A\u5B89\u88C5", "Not installed"],
  "settings.status.check": ["\u68C0\u67E5\u66F4\u65B0", "Check for updates"],
  "settings.status.checking": ["\u68C0\u67E5\u4E2D\u2026", "Checking\u2026"],
  "settings.status.changelog": ["\u66F4\u65B0\u65E5\u5FD7", "Changelog"],
  // ---- 插件信息（DSH 状态下一栏）----
  "settings.pluginVersion.title": ["\u63D2\u4EF6\u4FE1\u606F", "Plugin info"],
  "settings.pluginVersion.installed": ["\u5DF2\u5B89\u88C5 v{v}", "Installed v{v}"],
  "settings.pluginVersion.check": ["\u68C0\u67E5\u63D2\u4EF6\u66F4\u65B0", "Check plugin updates"],
  "settings.pluginVersion.checking": ["\u6253\u5F00\u66F4\u65B0\u9875\u2026", "Opening updates\u2026"],
  "settings.pluginVersion.changelog": ["\u66F4\u65B0\u65E5\u5FD7", "Changelog"],
  "settings.pluginVersion.repoHint": ["\u4F7F\u7528\u53CD\u9988\u6B22\u8FCE\u7559\u8A00 \u{1F4AC}", "feedback & issues welcome \u{1F4AC}"],
  "pluginChangelog.title": ["\u63D2\u4EF6\u66F4\u65B0\u65E5\u5FD7", "Plugin Changelog"],
  "pluginChangelog.locale": ["zh", "en"],
  "pluginUpdate.latest": ["\u63D2\u4EF6\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF08v{v}\uFF09", "Plugin is up to date (v{v})"],
  "pluginUpdate.checkFail": ["\u65E0\u6CD5\u68C0\u67E5\u63D2\u4EF6\u66F4\u65B0\uFF08\u7F51\u7EDC\u4E0D\u53EF\u8FBE\uFF09\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5", "Cannot check for plugin updates (network unreachable); try again later"],
  "pluginUpdate.updateTitle": ["\u53D1\u73B0\u63D2\u4EF6\u65B0\u7248\u672C", "Plugin update available"],
  "pluginUpdate.updateBody": ["\u5F53\u524D v{local} \u2192 \u6700\u65B0 v{remote}\u3002\u6253\u5F00 Obsidian \u5B98\u65B9\u5546\u5E97\u9875\u67E5\u770B\uFF1B\u5E94\u7528\u5185\u66F4\u65B0\u5728 Obsidian \u8BBE\u7F6E \u2192 \u7B2C\u4E09\u65B9\u63D2\u4EF6 \u2192 \u68C0\u67E5\u66F4\u65B0\u3002", "Current v{local} \u2192 latest v{remote}. Open the official Obsidian store page to view; in-app updates are in Obsidian Settings \u2192 Community plugins \u2192 Check for updates."],
  "pluginUpdate.goStore": ["\u6253\u5F00\u5546\u5E97\u9875", "Open store page"],
  "pluginUpdate.storeHint": ["\u5DF2\u6253\u5F00\u5546\u5E97\u9875\uFF1B\u66F4\u65B0\u8BF7\u5728 Obsidian \u8BBE\u7F6E \u2192 \u7B2C\u4E09\u65B9\u63D2\u4EF6 \u2192 \u68C0\u67E5\u66F4\u65B0", "Store page opened; to update, use Obsidian Settings \u2192 Community plugins \u2192 Check for updates"],
  // ---- 基础设置 ----
  "settings.section.basic": ["\u57FA\u7840\u8BBE\u7F6E", "Basic Setup"],
  "settings.install.title": ["\u4E00\u952E\u914D\u7F6E DSH", "One-click configure DSH"],
  "settings.install.desc": ["\u6CA1\u88C5\u8FC7 DeepSeek Harness \u5C31\u70B9\u8FD9\u4E2A\uFF1A\u5148\u786E\u8BA4\u5B89\u88C5\u76EE\u5F55\uFF0C\u518D\u81EA\u52A8\u4E0B\u8F7D\u3001\u5B89\u88C5\u3001\u914D\u7F6E\u3002\u4F1A\u81EA\u52A8\u8865\u9F50\u7F3A\u5931\u5DE5\u5177\uFF08git / Node.js / pnpm\uFF09\u5E76\u5168\u5C40\u5B89\u88C5 DSH \u547D\u4EE4\u884C\u5DE5\u5177 dsh\uFF1B\u5DF2\u6709 DSH \u4F46\u7F3A\u4F9D\u8D56/CLI \u4E5F\u4F1A\u81EA\u52A8\u8865\u9F50\uFF0C\u51E0\u5206\u949F\u641E\u5B9A", "Never installed DeepSeek Harness? Click this: confirm the directory, then it downloads, installs and configures everything. It fills in missing tools (git / Node.js / pnpm) and installs the global DSH CLI; if DSH already exists but tools/CLI are missing, it fills them in automatically. A few minutes, no command line"],
  "settings.install.btn": ["\u4E00\u952E\u914D\u7F6EDSH", "Configure DSH"],
  "settings.install.preparing": ["\u51C6\u5907\u4E2D\u2026", "Preparing\u2026"],
  "settings.detect.title": ["\u4E00\u952E\u68C0\u6D4B\u914D\u7F6E", "Detect & apply config"],
  "settings.detect.desc": ["\u5DF2\u7ECF\u88C5\u8FC7 DSH \u7684\uFF0C\u81EA\u52A8\u627E\u5230\u4F4D\u7F6E\u5E76\u586B\u597D\u914D\u7F6E", "Already have DSH? Auto-detect its location and fill in the config"],
  "settings.detect.btn": ["\u68C0\u6D4B\u5E76\u586B\u5145", "Detect & fill"],
  "settings.detect.progress": ["\u68C0\u6D4B\u4E2D\u2026", "Detecting\u2026"],
  "settings.installDir.title": ["\u5B89\u88C5\u76EE\u5F55", "Install directory"],
  "settings.installDir.desc": ["DSH \u5B89\u88C5\u4F4D\u7F6E\uFF1B\u672C\u673A\u5DF2\u6709 DSH \u65F6\u81EA\u52A8\u586B\u5165\u68C0\u6D4B\u5230\u7684\u8DEF\u5F84", "Where DSH is installed; auto-filled when a local DSH is detected"],
  // v2.3.0：移除「自动检查更新」——DSH ≥0.1.2 认证未适配前不自动打扰，更新检查仅手动触发
  // ---- 快捷操作 ----
  "settings.section.quick": ["\u5FEB\u6377\u529F\u80FD", "Quick actions"],
  "settings.reconnect.title": ["\u91CD\u8FDE\u670D\u52A1", "Reconnect service"],
  "settings.reconnect.desc": ["DSH \u9762\u677F\u52A0\u8F7D\u5931\u8D25\u6216\u5361\u4F4F\u65F6\uFF0C\u91CD\u65B0\u63A2\u6D4B\u5E76\u5237\u65B0\u9762\u677F", "When the DSH panel fails to load or hangs, re-probe and refresh the panel"],
  "settings.reconnect.btn": ["\u5237\u65B0", "Refresh"],
  "settings.browser.title": ["\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH", "Open DSH in browser"],
  "settings.browser.desc": ["\u7528\u7CFB\u7EDF\u9ED8\u8BA4\u6D4F\u89C8\u5668\u6253\u5F00 DSH Web GUI\uFF08\u72EC\u7ACB\u7A97\u53E3\uFF0C\u4E0D\u53D7 Obsidian \u9762\u677F\u9650\u5236\uFF09", "Open the DSH Web GUI in your default browser (separate window, not constrained by the Obsidian panel)"],
  "settings.browser.btn": ["\u6253\u5F00\u6D4F\u89C8\u5668", "Open browser"],
  "settings.browser.copyToken": ["\u590D\u5236 token \u94FE\u63A5", "Copy token link"],
  "settings.aed.title": ["AED for DSH", "AED for DSH"],
  "settings.aed.desc": ["\u8C03\u7528\u72EC\u7ACB\u547D\u4EE4\u884C\u5DE5\u5177 dsh-fix \u4EE5\u5B89\u5168\u6A21\u5F0F\u542F\u52A8 DSH \u62A2\u6551\uFF1A\u5148\u68C0\u67E5\u63D2\u4EF6\u5065\u5EB7\uFF0C\u5F02\u5E38\u63D2\u4EF6\u4E0E\u635F\u574F bundle \u4E34\u65F6\u6458\u9664\u3001\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u65F6\u81EA\u52A8\u6062\u590D\uFF0C\u5B8C\u6210\u540E\u6821\u9A8C\u4E00\u6B21\u542F\u52A8\uFF0C\u5F02\u5E38\u53EF\u4E00\u952E\u4FEE\u590D\u3002", "Runs the standalone dsh-fix command-line tool and boots DSH in safe mode to rescue it: it first checks plugin health, temporarily removes broken plugins and unhealthy bundles and restores them when you exit safe mode, then verifies the boot and offers one-click fixes."],
  "settings.aed.symptomsLink": ["\u9002\u7528\u75C7\u72B6\u8BF4\u660E", "What it can fix"],
  // 「适用症状说明」弹窗：依赖说明小字 + ✓ 可抢救清单 + ✗ 不适用清单（两组同字号，只以符号与颜色区分）
  "aed.symptoms.depNote": ["\u4F9D\u8D56\u8BF4\u660E\uFF1Adsh-fix \u662F\u72EC\u7ACB\u7684 npm \u5168\u5C40\u547D\u4EE4\u884C\u5DE5\u5177\uFF0C\u4E0D\u662F DSH \u63D2\u4EF6\uFF1B\u672C\u63D2\u4EF6\u8D1F\u8D23\u628A\u5B83\u5B89\u88C5\u5E76\u5347\u7EA7\u5230\u6700\u65B0\u7248\uFF0C\u5B98\u65B9\u6E90\u4E0D\u53EF\u8FBE\u65F6\u8D70 npmmirror \u955C\u50CF\u3002", "Dependency: dsh-fix is a standalone npm global CLI, not a DSH plugin. This plugin installs and upgrades it to the latest version, falling back to npmmirror when the official registry is unreachable."],
  "aed.symptoms.canTitle": ["\u53EF\u4EE5\u62A2\u6551", "What it can rescue"],
  "aed.symptoms.cannotTitle": ["\u4E0D\u9002\u7528", "Not for"],
  // 渲染成 ul/li 并自动加 ✓／✗，故文案本身不带符号前缀
  "aed.symptoms.can": ["\u63D2\u4EF6\u4E92\u76F8\u51B2\u7A81\uFF0CDSH \u8D77\u4E0D\u6765\u6216\u521D\u59CB\u5316\u5373\u5D29\uFF08error during startup / uncaught exception\uFF09\n\u8865\u4E01\u5C42\u635F\u574F\uFF1Acordis.patch.yml \u89E3\u6790\u62A5\u9519\uFF0C\u63D2\u4EF6\u5C42\u6574\u4F53\u52A0\u8F7D\u4E0D\u4E86\n\u63D2\u4EF6\u5305\u7F3A\u5931\u6216\u5378\u8F7D\u6B8B\u7559\uFF08cannot find module / MODULE_NOT_FOUND / is NOT installed\uFF09\nbundle \u5C42\u63D2\u4EF6\u62D6\u57AE\u542F\u52A8\uFF08\u7ECF dsh plugin add \u5B89\u88C5\u3001\u8865\u4E01\u5C42\u7BA1\u4E0D\u5230\u7684\u90A3\u4E00\u7C7B\uFF0C\u672C\u529F\u80FD\u4E00\u5E76\u7981\u7528\uFF09\n\u5B89\u5168\u6A21\u5F0F\u6B8B\u7559\u628A\u6865\u63A5\u6216\u5BA2\u6237\u7AEF\u6A21\u5757\u7981\u6389\uFF1A\u9762\u677F\u767D\u5C4F\u3001\u62A5 client.js did not export the bootstrap module face\u3001\u6846\u9009\u6CE8\u5165\u9759\u9ED8\u5931\u6548\n\u7AEF\u53E3\u4E0A\u8FDB\u7A0B\u5728\u3001\u9875\u9762\u5374\u7F3A\u542F\u52A8\u5F15\u5BFC\u6CE8\u5165\uFF08__DSH_BOOT__ \u672A\u51FA\u73B0\uFF09", "Plugins conflict and DSH will not start, or crashes during initialisation (error during startup / uncaught exception)\nThe patch layer is broken: cordis.patch.yml fails to parse, so the whole plugin layer never loads\nA plugin package is missing or left behind by an uninstall (cannot find module / MODULE_NOT_FOUND / is NOT installed)\nA bundle-layer plugin breaks startup (installed via dsh plugin add, out of reach of patch-layer disables \u2014 this covers those too)\nSafe-mode leftovers disabled the bridge or the client modules: blank panel, client.js did not export the bootstrap module face, selection injection silently dead\nThe process answers on the port but the page lacks the boot injection (__DSH_BOOT__ missing)"],
  "aed.symptoms.cannot": ["\u4F1A\u8BDD\u6253\u4E0D\u5F00\u2014\u2014\u8BF7\u7528\u300C\u4F1A\u8BDD\u4FEE\u590D\u300D\n\u6A21\u578B\u4E0E\u51ED\u636E\u914D\u7F6E\u95EE\u9898\nDSH \u7248\u672C\u672C\u8EAB\u4E0D\u5728\u9002\u914D\u533A\u95F4\u2014\u2014\u8BF7\u770B\u300CDSH\u7248\u672C\u9002\u914D\u8BF4\u660E\u300D", "Unreadable sessions \u2014 use Session repair instead\nModel and credential configuration\nA DSH version outside the supported range \u2014 see the DSH version compatibility note"],
  "aed.symptoms.title": ["AED \u80FD\u62A2\u6551\u54EA\u4E9B DSH \u5D29\u6E83\u72B6\u6001", "What DSH breakages AED can rescue"],
  "aed.symptoms.exitNote": ["\u62A2\u6551\u540E DSH \u505C\u5728\u5B89\u5168\u6A21\u5F0F\uFF1A\u8FDB\u53BB\u540E\u8BA9 DSH \u81EA\u67E5\u81EA\u4FEE\uFF0C\u5B8C\u4E8B\u70B9\u540C\u884C\u300C\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u300D\u6062\u590D\u5168\u90E8\u63D2\u4EF6\uFF08\u4E34\u65F6\u6458\u9664\u7684\u635F\u574F bundle \u4E5F\u4F1A\u4E00\u5E76\u8FD8\u539F\uFF09\u3002", 'After a rescue DSH stays in safe mode: go in, let DSH inspect and repair itself, then use "Exit safe mode" on the same row to restore every plugin (temporarily removed bundles come back too).'],
  "settings.aed.btn": ["AED \u62A2\u6551", "AED"],
  "settings.exitSafeMode.btn": ["\u9000\u51FA\u5B89\u5168\u6A21\u5F0F", "Exit safe mode"],
  // ---- 桥接（状态与发送开关）----
  "settings.section.send": ["\u6865\u63A5", "Bridge"],
  "settings.send.openPanel.title": ["Obsidian \u6865\u63A5\u5230 DSH \u804A\u5929\u6846", "Bridge Obsidian \u2192 DSH chat"],
  "settings.send.openPanel.desc": ["\u5F00\u542F\u540E\uFF0C\u6846\u9009\u7B14\u8BB0\u6587\u5B57\u53F3\u952E\u5373\u53EF\u53D1\u9001\u5230 DSH \u804A\u5929\u6846\uFF08\u547D\u4EE4\u9762\u677F\u540C\u6837\u53EF\u7528\uFF09\uFF1B\u53D1\u9001\u540E\u81EA\u52A8\u6253\u5F00 DSH \u9762\u677F\u67E5\u770B\u5904\u7406", "When enabled, select text in a note and right-click to send it to the DSH chat (command palette works too); the DSH panel opens automatically after sending"],
  "settings.bridge.toObsidian.title": ["DSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian", "Bridge DSH chat \u2192 Obsidian"],
  "settings.bridge.toObsidian.desc": ["\u63A7\u5236 DSH \u4E0E Obsidian \u4E4B\u95F4\u7684\u6865\u63A5\uFF1A\u81EA\u52A8\u53D1\u9001\uFF08\u6846\u9009\u6587\u5B57\u81EA\u52A8\u4EE5\u9690\u5F0F\u4FE1\u606F\u884C\u6CE8\u5165\u804A\u5929\u6846\uFF0C\u542B\u7CBE\u786E\u884C:\u5217\u4E0E\u5B57\u6570\uFF0C\u4E0D\u542B\u539F\u6587\uFF09\u3001\u53F3\u952E\u53D1\u9001\uFF08\u4EC5\u901A\u8FC7\u53F3\u952E\u83DC\u5355/\u547D\u4EE4\u53D1\u9001\uFF09\u3001\u53D6\u6D88\uFF08\u5173\u95ED\u6865\u63A5\uFF09\uFF1B\u975E\u300C\u53D6\u6D88\u300D\u65F6 DSH \u4EA7\u7269\u4E2D\u7684\u5E93\u5185\u53EF\u8BFB\u8DEF\u5F84\u70B9\u51FB\u5373\u53EF\u5728 Obsidian \u6253\u5F00", "Controls the bridge between DSH and Obsidian: Auto-send (selecting text injects an implicit info line with exact line:col and word count, without the original text), Right-click send (only via the context menu/command), or Off (disabled). When not Off, in-vault readable paths in DSH output open in Obsidian with one click"],
  "settings.bridge.toObsidian.off": ["\u53D6\u6D88", "Off"],
  "settings.bridge.toObsidian.auto": ["\u81EA\u52A8\u53D1\u9001", "Auto-send"],
  "settings.bridge.toObsidian.rightClick": ["\u53F3\u952E\u53D1\u9001", "Right-click send"],
  "settings.bridge.status.title": ["\u6865\u63A5\u72B6\u6001", "Bridge status"],
  "settings.bridge.status.installedReady": ["\u6587\u4EF6\u5DF2\u5B89\u88C5\uFF1B\u5DF2\u52A0\u8F7D\u4E14\u751F\u6548 \u2713\n1. \u6846\u9009\u6587\u5B57\u81EA\u52A8\u6CE8\u5165\u9690\u5F0F\u4FE1\u606F\u884C\uFF08\u7CBE\u786E\u4F4D\u7F6E + \u5B57\u6570\uFF0C\u4E0D\u542B\u539F\u6587\uFF09\u5230 DSH \u804A\u5929\u6846\n2. DSH \u4E2D\u7684\u5E93\u5185\u53EF\u8BFB\u8DEF\u5F84\u53EF\u70B9\u51FB\u5728 Obsidian \u6253\u5F00\n3. \u5149\u6807\u5728 DSH \u9762\u677F\u5185\u65F6\uFF0CObsidian \u5168\u5C40\u5FEB\u6377\u952E\u4ECD\u53EF\u54CD\u5E94\uFF08iframe \u5FEB\u6377\u952E\u900F\u4F20\uFF09", "Installed; loaded and working \u2713\n1. Selected text auto-injects an implicit info line (exact position + word count, no original text) into the DSH chat\n2. In-vault readable paths in DSH open in Obsidian with one click\n3. Obsidian global shortcuts still work while focus is inside the DSH panel (iframe shortcut passthrough)"],
  "settings.bridge.status.installedNotReady": ["\u6587\u4EF6\u5DF2\u5B89\u88C5\uFF1B\u672A\u751F\u6548\uFF08\u91CD\u542F DSH \u670D\u52A1\u540E\u751F\u6548\uFF09", "Installed; not working yet (takes effect after restarting the DSH service)"],
  "settings.bridge.status.notInstalled": ["\u672A\u5B89\u88C5", "Not installed"],
  "settings.bridge.restart.title": ["\u91CD\u542F DSH \u670D\u52A1", "Restart DSH service"],
  "settings.bridge.restart.desc": ["\u7ED3\u675F\u5360\u7528\u7AEF\u53E3\u7684\u8FDB\u7A0B\uFF08\u542B\u5E38\u9A7B\u8FDB\u7A0B\uFF09\u5E76\u91CD\u65B0\u542F\u52A8\uFF1B\u7528\u4E8E\u52A0\u8F7D\u6865\u63A5\u8865\u4E01\u3002\u6CE8\u610F\uFF1A\u4F1A\u4E2D\u65AD\u5F53\u524D\u6B63\u5728\u8FD0\u884C\u7684\u4EFB\u52A1", "Kill the process on the port (including detached ones) and restart; used to load the bridge patch. Note: this interrupts running tasks"],
  "settings.bridge.restart.btn": ["\u91CD\u542F\u670D\u52A1", "Restart"],
  "settings.bridge.restart.progress": ["\u91CD\u542F\u4E2D\u2026", "Restarting\u2026"],
  "settings.bridge.rewrite.btn": ["\u91CD\u65B0\u5199\u5165", "Rewrite"],
  "settings.repair.title": ["\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D\uFF08\u4F1A\u8BDD\u6253\u4E0D\u5F00\u65F6\u7528\uFF09", "Session format repair (for unreadable sessions)"],
  // v2.8.6：该键原先**在词典里缺失**，t() 对未收录键原样返回 ⇒ 按钮上显示的是字面量 settings.repair.btn。
  // 补齐并按用户要求定为「会话修复」（英文 Session repair；行标题仍是「会话格式修复」）。
  "settings.repair.btn": ["\u4F1A\u8BDD\u4FEE\u590D", "Session repair"],
  "settings.repair.desc": ["DSH \u7248\u672C\u6F02\u79FB\u4F1A\u8BA9\u4F1A\u8BDD\u5728\u5F53\u524D\u683C\u5F0F\u4E0B\u4E0D\u53EF\u8BFB\u3002\u70B9\u51FB\u6253\u5F00\u9884\u68C0\uFF1A\u53EA\u8BFB\u4F53\u68C0 \u2192 \u5907\u4EFD\u5E76\u4FEE\u590D\uFF08\u7528 DSH \u81EA\u5E26\u683C\u5F0F\u94FE\u590D\u9A8C\u540E\u624D\u5199\u76D8\uFF09\uFF1B\u683C\u5F0F\u4F4E\u4E8E\u5F53\u524D DSH \u7684\u65E7\u4F1A\u8BDD\u4E0D\u6539\u5199\uFF0C\u7531 DSH \u6253\u5F00\u65F6\u81EA\u884C\u8FC1\u79FB\u3002", "DSH version drift can leave sessions unreadable on the current format. Open the checker: read-only scan \u2192 back up and repair (writes only after DSH's own format chain validates). Sessions older than the current DSH are left untouched \u2014 DSH migrates them when it opens them."],
  "settings.bridge.rewrite.fail": ["\u6865\u63A5\u5199\u5165\u5931\u8D25\uFF1A{err}", "Failed to write bridge files: {err}"],
  "settings.bridge.rewrite.updated": ["\u6865\u63A5\u6587\u4EF6\u5DF2\u66F4\u65B0\uFF0C\u91CD\u542F DSH \u670D\u52A1\u540E\u751F\u6548", "Bridge files updated; restart the DSH service to apply"],
  "settings.bridge.rewrite.ready": ["\u6865\u63A5\u6587\u4EF6\u5DF2\u5C31\u7EEA", "Bridge files ready"],
  // ---- 面板显示 ----
  "settings.section.panel": ["\u9762\u677F\u663E\u793A", "Panel display"],
  "settings.zoom.title": ["\u9875\u9762\u7F29\u653E", "Page zoom"],
  "settings.zoom.desc": ["DSH \u9875\u9762\u7F29\u653E\u6BD4\u4F8B", "DSH page zoom"],
  "settings.bottomPad.title": ["\u5E95\u90E8\u57AB\u9AD8", "Bottom padding"],
  "settings.bottomPad.desc": ["\u9762\u677F\u5E95\u90E8\u7559\u767D\uFF08\u9632\u72B6\u6001\u680F\u906E\u6321\uFF09", "Panel bottom padding (prevents status-bar overlap)"],
  "settings.passthrough.title": ["iframe \u5185\u5FEB\u6377\u952E\u900F\u4F20", "Pass through shortcuts in iframe"],
  "settings.passthrough.desc": ["\u5F00\u542F\u540E\uFF0C\u5149\u6807\u805A\u7126\u5728 DSH \u9762\u677F\u5185\u65F6 Obsidian \u5168\u5C40\u5FEB\u6377\u952E\u4ECD\u53EF\u54CD\u5E94\uFF08\u81EA\u52A8\u904D\u5386 Obsidian \u5F53\u524D\u5FEB\u6377\u952E\u8BBE\u7F6E\uFF09\uFF1B\u4FEE\u6539\u5FEB\u6377\u952E\u6216\u672C\u5F00\u5173\u540E\uFF0C\u9700\u91CD\u542F DSH \u670D\u52A1\u751F\u6548", "When enabled, Obsidian global shortcuts still work while focus is inside the DSH panel (auto-reads your current Obsidian hotkey settings); restart the DSH service after changing hotkeys or this switch"],
  // ---- 高级设置 ----
  "settings.section.advanced": ["\u9AD8\u7EA7\u8BBE\u7F6E", "Advanced"],
  // v2.6.0 高级设置重排：四个子分区（服务运行 → Profile → 更新与安装源 → 适配自检）
  "settings.section.service": ["\u670D\u52A1\u8FD0\u884C", "Service runtime"],
  "settings.section.service.desc": ["\u9762\u677F\u8FDE\u63A5 DSH \u7684\u7AEF\u70B9\uFF1A\u5730\u5740 \u2192 \u7AEF\u53E3 \u2192 \u534F\u8BAE\uFF08HTTPS \u65F6\u9644\u8BC1\u4E66\uFF09\u3002\u901A\u5E38\u53EA\u9700\u6539\u7AEF\u53E3\uFF1B\u6539\u5730\u5740\u6216\u542F\u7528 HTTPS \u65F6\uFF0C\u987B\u4E0E DSH \u5B9E\u9645\u76D1\u542C\u4FDD\u6301\u4E00\u81F4\u3002", "Endpoint the panel uses to reach DSH: host \u2192 port \u2192 protocol (plus the certificate for HTTPS). Usually only the port needs a change; when you change the host or enable HTTPS, keep it in sync with how DSH listens."],
  "settings.section.profile": ["DSH Profile\uFF08\u591A\u6863\u5171\u5B58\uFF09", "DSH profile (multi-profile coexistence)"],
  "settings.section.update": ["\u66F4\u65B0\u4E0E\u5B89\u88C5\u6E90", "Updates & install sources"],
  "settings.section.compat": ["\u9002\u914D\u72B6\u6001", "Compatibility"],
  "settings.profile.title": ["DSH Profile\uFF08\u914D\u7F6E\u6863\uFF09", "DSH profile"],
  "settings.profile.desc": [
    "\u9762\u677F\u670D\u52A1\u4E0E\u6865\u63A5\u6240\u5728\u7684 DSH profile\uFF0C\u9ED8\u8BA4 web\u3002\u4F7F\u7528\u975E web profile\uFF08\u5982 test\uFF09\u65F6\uFF1A\u63D2\u4EF6\u81EA\u52A8\u57FA\u4E8E web \u521B\u5EFA\u8BE5 profile\u3001\u628A\u6865\u63A5\u88C5\u5165\u5176\u4E2D\u3001\u542F\u52A8\u547D\u4EE4\u6539\u7528 dsh --profile <\u540D> \u5F62\u6001\uFF0C\u53EF\u4E0E\u684C\u9762\u7248\u7B49\u5176\u4ED6\u5B9E\u4F8B\u8DE8\u7AEF\u53E3\u5171\u5B58\uFF08\u4F1A\u8BDD\u5B58\u50A8\u672C\u673A\u5171\u4EAB\uFF09\u3002",
    "The DSH profile the panel service and bridge belong to (default: web). For a non-web profile (e.g. test): the plugin creates it from the web template, installs the bridge into it, launches it as dsh --profile <name>, and coexists with other instances (e.g. the desktop app) on a separate port \u2014 session storage is shared machine-wide."
  ],
  "settings.profile.invalid": ["profile \u540D\u4E0D\u5408\u6CD5\uFF1A{name}\uFF08\u987B\u5C0F\u5199\u5B57\u6BCD\u5F00\u5934\uFF0C\u4EC5\u9650 a-z 0-9 _ -\uFF0C\u226464 \u5B57\u7B26\uFF09", "Invalid profile name: {name} (must start with a lowercase letter; a-z 0-9 _ - only; \u226464 chars)"],
  "settings.profile.reserved": ["\u300C{name}\u300D\u662F DSH \u5185\u7F6E\u914D\u7F6E\u6863\uFF0C\u4E0D\u80FD\u4F5C\u4E3A\u9762\u677F\u7684\u81EA\u5B9A\u4E49 profile\uFF08\u5B83\u4F1A\u542F\u52A8\u53E6\u4E00\u79CD\u5E94\u7528\u5F62\u6001\uFF0C\u4E14\u4E0D\u53EF\u4EE3\u5EFA\uFF09\u2014\u2014\u8BF7\u6362\u4E00\u4E2A\u540D\u5B57\uFF0C\u5982 test", '"{name}" is a built-in DSH profile: it boots a different app form and cannot be created \u2014 pick another name, e.g. test'],
  "settings.profile.warnPort": ["\u63D0\u793A\uFF1A\u975E web profile \u5EFA\u8BAE\u6539\u7528\u72EC\u7ACB\u7AEF\u53E3\uFF08\u5982 3081\uFF09\uFF0C\u907F\u514D\u4E0E\u684C\u9762\u7248\uFF08\u5E38\u89C1\u4E3A 3080\uFF09\u51B2\u7A81", "Note: a non-web profile should use its own port (e.g. 3081) to avoid colliding with other instances (commonly the desktop app on 3080)"],
  "settings.profile.warnCmdMismatch": ["\u63D0\u793A\uFF1A\u4F60\u7684\u81EA\u5B9A\u4E49\u542F\u52A8\u547D\u4EE4\u4E0D\u542B --profile\uFF0C\u5B9E\u9645\u542F\u52A8\u7684\u4ECD\u662F\u539F profile\u2014\u2014\u7559\u7A7A\u8BE5\u547D\u4EE4\u53EF\u8BA9\u63D2\u4EF6\u6309\u6240\u9009 profile \u81EA\u52A8\u751F\u6210", "Note: your custom startup command has no --profile flag, so it still boots the original profile \u2014 clear the command to let the plugin generate one for the selected profile"],
  // ---- v2.6.0：profile 选择控件（下拉 + 新建）----
  "settings.profile.pick": ["\u5F53\u524D Profile", "Current profile"],
  "settings.profile.pickDesc": ["\u5217\u51FA\u672C\u673A\u5DF2\u6709\u7684 DSH profile\uFF1B\u5207\u6362\u4F1A\u91CD\u5EFA\u670D\u52A1\u5E76\u6539\u5199\u9ED8\u8BA4\u542F\u52A8\u547D\u4EE4\uFF0C\u5207\u6362\u524D\u4F1A\u5148\u8BE2\u95EE", "Lists the profiles that exist on this machine; switching rebuilds the service and rewrites the default startup command, and asks first"],
  "settings.profile.default": ["\u9ED8\u8BA4\u6863", "default"],
  "settings.profile.newName": ["\u65B0\u5EFA Profile", "New profile"],
  "settings.profile.newNameDesc": ["\u8F93\u5165\u65B0\u540D\u5B57\u540E\u70B9\u300C\u65B0\u5EFA\u5E76\u5207\u6362\u300D\uFF1A\u63D2\u4EF6\u4F1A\u57FA\u4E8E web \u6A21\u677F\u4EE3\u5EFA\u8BE5 profile\u3001\u628A\u6865\u63A5\u88C5\u8FDB\u53BB\uFF0C\u5E76\u5728\u72EC\u7ACB\u7AEF\u53E3\u62C9\u8D77\uFF08\u4E0E\u684C\u9762\u7248\u5171\u5B58\uFF09", "Type a name and press Create: the plugin clones it from the web template, installs the bridge into it and starts it on its own port (coexisting with the desktop app)"],
  "settings.profile.newNamePlaceholder": ["\u5982 test\uFF08\u5C0F\u5199\u5B57\u6BCD\u5F00\u5934\uFF0C\u4EC5\u9650 a-z 0-9 _ -\uFF09", "e.g. test (lowercase letter first; a-z 0-9 _ - only)"],
  "settings.profile.create": ["\u65B0\u5EFA\u5E76\u5207\u6362", "Create & switch"],
  // ---- v2.6.0：更新通道与自动检查（重开自动更新）----
  "settings.updateChannel.title": ["DSH \u66F4\u65B0\u901A\u9053", "DSH update channel"],
  "settings.updateChannel.desc": ["DSH \u76EE\u524D\u53EA\u53D1\u5E03\u9884\u7248\u672C\uFF08\u65E0\u6B63\u5F0F\u7248\uFF09\uFF0C\u6545\u9ED8\u8BA4\u8DDF\u968F\u5B98\u65B9 GitHub \u4ED3\u5E93\u5DF2\u53D1\u5E03\u7684\u7248\u672C\uFF08\u542B rc/beta\uFF09\u3002\u901A\u9053\u8D8A\u9760\u524D\u8D8A\u4FDD\u5B88", "DSH has no stable releases yet, so the plugin follows the versions already released on the official GitHub repo (rc/beta included) by default. Earlier channels are more conservative"],
  "settings.updateChannel.stable": ["\u4EC5\u6B63\u5F0F\u7248\uFF08\u6700\u4FDD\u5B88\uFF0C\u5B98\u65B9\u53D1\u7248\u524D\u7B49\u4E8E\u4E0D\u66F4\u65B0\uFF09", "Stable only (most conservative; effectively no updates until an official stable release)"],
  "settings.updateChannel.preview": ["\u8DDF\u968F\u5B98\u65B9\u53D1\u5E03\uFF08\u542B rc/beta\uFF0C\u9ED8\u8BA4\uFF09", "Follow the official releases (rc/beta included; default)"],
  "settings.updateChannel.dev": ["\u542B alpha\uFF08\u6700\u6FC0\u8FDB\uFF0C\u53EF\u80FD\u9047\u5230\u672A\u9002\u914D\u95EE\u9898\uFF09", "Include alpha (most aggressive; may hit unadapted changes)"],
  "settings.autoCheck.title": ["\u542F\u52A8\u540E\u81EA\u52A8\u68C0\u67E5 DSH \u66F4\u65B0", "Check DSH updates after startup"],
  "settings.autoCheck.desc": ["\u53EA\u68C0\u67E5\u5E76\u5F39\u786E\u8BA4\u6846\uFF0C\u7EDD\u4E0D\u9759\u9ED8\u5B89\u88C5\u2014\u2014\u66F4\u65B0\u4F1A\u5148\u7ED3\u675F\u672C\u673A\u5168\u90E8 DSH \u8FDB\u7A0B\uFF08\u542B\u684C\u9762\u7248\uFF09", "The plugin only checks and asks; it never installs silently \u2014 updating stops all local DSH processes (including the desktop app)"],
  "settings.autoCheckInterval.title": ["\u81EA\u52A8\u68C0\u67E5\u95F4\u9694", "Auto-check interval"],
  "settings.autoCheckInterval.desc": ["\u8DDD\u4E0A\u6B21\u81EA\u52A8\u68C0\u67E5\u4E0D\u8DB3 {h} \u5C0F\u65F6\u5219\u8DF3\u8FC7\uFF08\u624B\u52A8\u300C\u68C0\u67E5\u66F4\u65B0\u300D\u4E0D\u53D7\u9650\u5236\uFF09", 'Skip the automatic check if the last one is within {h} hours (manual "Check for updates" is unaffected)'],
  // ---- v2.6.0 适配体检 / v2.8.4 取消全部弹窗（只剩静默呈现的两行文字 + 用户主动点开的说明）----
  "settings.compat.recheck": ["\u91CD\u65B0\u68C0\u67E5\u9002\u914D", "Re-check now"],
  "settings.compat.state.title": ["\u5F53\u524D\u9002\u914D\u72B6\u6001", "Current compatibility"],
  "settings.compat.state.reading": ["\u6838\u5BF9\u4E2D\u2026", "Checking\u2026"],
  // 判定文案：键名与 compat.compatIssue() 返回值一一对应
  "compat.verdict.ok": ["\u672C\u673A {v} \u2713 \u5DF2\u9002\u914D", "Local {v} \u2713 supported"],
  "compat.verdict.unknown": ["\u672C\u673A DSH \u7248\u672C\u672A\u80FD\u6838\u9A8C\uFF08PATH \u4E0A\u7684 dsh \u53EF\u80FD\u7531\u7B2C\u4E09\u65B9\u540C\u540D\u5305\u63D0\u4F9B\uFF09\uFF0C\u56E0\u6B64\u4E0D\u4E0B\u9002\u914D\u7ED3\u8BBA", "Local DSH version could not be verified (the dsh on PATH may come from a third-party package of the same name), so no compatibility verdict is given"],
  "compat.verdict.incompatible": ["\u672C\u673A {v} \u2717 \u843D\u5728\u63D2\u4EF6\u5DF2\u77E5\u4E0D\u517C\u5BB9\u533A\u95F4", "Local {v} \u2717 within a known-incompatible range"],
  "compat.verdict.legacy": ["\u672C\u673A {v} \u26A0 \u65E7\u7248\u53EF\u7528\uFF08\u7F3A\u5C11\u65B0\u7248\u6865\u63A5\u524D\u63D0\uFF09", "Local {v} \u26A0 legacy (missing the newer bridge prerequisites)"],
  "compat.verdict.untested": ["\u672C\u673A {v} \u26A0 \u6BD4\u63D2\u4EF6\u5B9E\u6D4B\u9002\u914D\u7248\u672C\u66F4\u65B0\uFF0C\u5C1A\u672A\u9A8C\u8BC1", "Local {v} \u26A0 newer than the plugin\u2019s verified range"],
  "compat.verdict.bridge-not-installed": ["\u672C\u673A {v} \xB7 \u6865\u63A5\u672A\u5B89\u88C5\uFF08\u8DE8\u5411\u529F\u80FD\u4E0D\u53EF\u7528\uFF09", "Local {v} \xB7 bridge not installed (cross-panel features unavailable)"],
  "compat.verdict.bridge-not-live": ["\u672C\u673A {v} \xB7 \u6865\u63A5\u672A\u751F\u6548\uFF08DSH \u670D\u52A1\u9700\u91CD\u542F\uFF09", "Local {v} \xB7 bridge not live (restart the DSH service)"],
  // 状态横幅用的极简语气标记（横幅已有版本号，这里只给判定结论）。
  // 符号一律**后置**，与同栏「服务运行中 ✓」的构词保持一致（v2.6.0 用户定案）。
  "compat.tone.ok": ["\u5DF2\u9002\u914D \u2713", "supported \u2713"],
  "compat.tone.incompatible": ["\u5DF2\u77E5\u4E0D\u517C\u5BB9 \u2717", "known-incompatible \u2717"],
  "compat.tone.legacy": ["\u7248\u672C\u504F\u65E7 \u26A0", "outdated \u26A0"],
  "compat.tone.untested": ["\u65B0\u4E8E\u5B9E\u6D4B\u8303\u56F4 \u26A0", "newer than verified \u26A0"],
  "compat.tone.bridge-not-installed": ["\u6865\u63A5\u672A\u5B89\u88C5 \u26A0", "bridge missing \u26A0"],
  "compat.tone.bridge-not-live": ["\u6865\u63A5\u672A\u751F\u6548 \u26A0", "bridge not live \u26A0"],
  "compat.tone.unknown": ["\u7248\u672C\u672A\u5224\u5B9A ?", "version unresolved ?"],
  // 插件信息栏「DSH 版本适配说明」超链接与其弹窗
  "settings.pluginVersion.compatLink": ["DSH\u7248\u672C\u9002\u914D\u8BF4\u660E", "DSH version compatibility"],
  "compat.explain.title": ["DSH \u7248\u672C\u9002\u914D\u8BF4\u660E", "DSH version compatibility"],
  "compat.explain.close": ["\u5173\u95ED", "Close"],
  "compat.explain.bulletRange": ["\u63D2\u4EF6\u6309 DSH \u7248\u672C**\u9010\u7248\u5B9E\u6D4B**\u540E\u624D\u58F0\u660E\u9002\u914D\uFF0C\u5F53\u524D\u5B9E\u6D4B\u533A\u95F4\uFF1A{range}\uFF080.1.5 \u7CFB\u4E3A\u771F\u673A\u5B9E\u6D4B\uFF0C0.1.6 \u8D77\u4E3A\u9694\u79BB\u6C99\u76D2\u5B9E\u8DD1\uFF1A\u8BA4\u8BC1\u77E9\u9635\u3001\u591A profile \u5171\u5B58\u3001\u4F1A\u8BDD\u683C\u5F0F\u3001\u4E0A\u4F20\u51ED\u636E\u94FE\u4E0E\u6865\u63A5 setDraft \u7AEF\u5230\u7AEF\uFF09\u3002", "Compatibility is declared only after the plugin is tested against a specific DSH version. Currently verified: {range} (the 0.1.5 line on a real machine; from 0.1.6 onward in an isolated sandbox: auth matrix, multi-profile coexistence, session format, upload credential chain and the bridge setDraft end-to-end run)."],
  "compat.explain.bulletSilent": ['\u672C\u8BF4\u660E\u53EA\u5728\u4F60\u4E3B\u52A8\u70B9\u5F00\u65F6\u51FA\u73B0\u2014\u2014\u63D2\u4EF6**\u4E0D\u4F1A**\u56E0\u4E3A"\u7248\u672C\u4E0D\u9002\u914D / \u6865\u63A5\u672A\u751F\u6548"\u4E3B\u52A8\u5F39\u4EFB\u4F55\u63D0\u793A\u6846\uFF1B\u5224\u5B9A\u6C38\u8FDC\u53EA\u5199\u5728\u72B6\u6001\u6A2A\u5E45\u4E0E\u300C\u5F53\u524D\u9002\u914D\u72B6\u6001\u300D\u4E24\u884C\u6587\u5B57\u91CC\u3002', 'This note appears only when you open it \u2014 the plugin never pops a dialog for "incompatible version / bridge not live"; the verdict lives in the status row and the "current compatibility" line only.'],
  "compat.explain.bulletBad": ["0.1.2\u20130.1.4 \u5DF2\u77E5\u4E0D\u517C\u5BB9\uFF08\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\u53E0\u52A0\u4E0A\u6E38\u4F1A\u8BDD\u7F13\u5B58/\u5217\u8868\u7F3A\u9677\uFF09\uFF0C\u66F4\u65B0\u5F39\u7A97\u4F1A\u5728\u5B89\u88C5\u524D\u7EA2\u5B57\u529D\u9000\u3002", "0.1.2\u20130.1.4 are known incompatible (browser session auth combined with upstream session cache/list defects); the update dialog warns in red before installing them."],
  "compat.explain.bulletLegacy": ["0.1.1 \u53CA\u66F4\u65E9\u4E3A\u65E7\u7248\u53EF\u7528\uFF1A\u9762\u677F\u80FD\u5F00\uFF0C\u4F46\u7F3A\u5C11 0.1.5+ \u7684\u6865\u63A5\u5199\u5165\u524D\u63D0\uFF0C\u6846\u9009\u6CE8\u5165\u4E0E\u9762\u677F\u5185\u4E0A\u4F20\u4E0D\u53EF\u7528\u3002", "0.1.1 and earlier still open the panel, but lack the 0.1.5+ prerequisites for bridge writing, so selection injection and in-panel uploads do not work."],
  "compat.explain.bulletNewer": ["\u9AD8\u4E8E\u5B9E\u6D4B\u4E0A\u754C\uFF1D\u63D2\u4EF6\u53EF\u80FD\u5C1A\u672A\u8DDF\u4E0A\uFF1ADSH \u8FED\u4EE3\u5F88\u5FEB\uFF0C\u6BCF\u6B21\u53D1\u5E03\u90FD\u53EF\u80FD\u6539\u52A8\u63D2\u4EF6\u4F9D\u8D56\u7684\u5185\u90E8\u63A5\u7F1D\u3002\u529F\u80FD\u5F02\u5E38\u65F6\u5148\u68C0\u67E5\u63D2\u4EF6\u66F4\u65B0\u3002", "Above the verified upper bound means the plugin may not have caught up yet: DSH iterates fast and every release can move the internal seams the plugin relies on. Check for a plugin update first when something misbehaves."],
  "compat.explain.bulletBridge": ['\u6865\u63A5\u5224\u5B9A\u770B\u7684\u662F DSH **\u5B9E\u9645\u8FD4\u56DE\u7684\u9875\u9762**\u91CC\u6709\u6CA1\u6709\u6CE8\u5165\u811A\u672C\uFF0C\u4E0D\u662F\u78C1\u76D8\u4E0A\u6709\u6CA1\u6709\u6587\u4EF6\u2014\u2014\u8865\u4E01\u5C42\u53EA\u5728\u670D\u52A1\u542F\u52A8\u65F6\u52A0\u8F7D\uFF0C"\u6587\u4EF6\u662F\u65B0\u7684\u3001\u9875\u9762\u8DD1\u65E7\u811A\u672C"\u5FC5\u987B\u91CD\u542F\u670D\u52A1\u624D\u4F1A\u597D\u3002', 'The bridge verdict inspects the page DSH actually serves for the injected script, not whether a file exists on disk \u2014 the patch layer is loaded only at service start, so "new file, old script in the page" needs a service restart.'],
  "compat.detail": ["\u672C\u673A DSH\uFF1A{v}\uFF5C\u9002\u914D\u8303\u56F4\uFF1A{range}\uFF5Cprofile\uFF1A{profile}\uFF5C\u7AEF\u53E3\uFF1A{port}", "Local DSH: {v} | supported: {range} | profile: {profile} | port: {port}"],
  // v2.7.0（A2）：0.1.7 起「会话格式修复」对跨版本会话只报告不改写（能力差异，非不兼容）
  "compat.repairLimited": ["\u80FD\u529B\u5DEE\u5F02\uFF1A\u672C DSH \u7248\u672C\u4E0A\uFF0C\u683C\u5F0F\u4F4E\u4E8E\u5F53\u524D\u7248\u672C\u7684\u65E7\u4F1A\u8BDD\u7531 DSH \u6253\u5F00\u65F6\u6309\u5B98\u65B9\u8FC1\u79FB\u94FE\u81EA\u884C\u5347\u7EA7\uFF0C\u63D2\u4EF6\u7684\u300C\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D\u300D\u5BF9\u8FD9\u7C7B\u4F1A\u8BDD\u53EA\u62A5\u544A\u3001\u4E0D\u6539\u5199", "Capability note: on this DSH version, sessions in an older format are migrated by DSH itself when opened; the plugin session-format repair only reports them and never rewrites them"],
  // v2.8.8：高于实测上界时的只读触点自检（开机后台自动跑一次；结论只是文字，不弹窗、不构成登记）
  "compat.seams.intact": ["\u89E6\u70B9\u81EA\u68C0 {n}/{n} \u5168\u5728\uFF08\u57FA\u7EBF {b}\uFF09\u2014\u2014\u53EA\u8BFB\u53D6\u8BC1\uFF0C\u4E0D\u6784\u6210\u5B9E\u6D4B\u767B\u8BB0", "Seam check: all {n}/{n} present (baseline {b}) \u2014 read-only evidence, not a registration"],
  "compat.seams.moved": ["\u89E6\u70B9\u81EA\u68C0\uFF1A{k} \u9879\u4E0E\u57FA\u7EBF\u6709\u51FA\u5165\uFF08{ids}\uFF09\u2014\u2014\u7B26\u53F7\u90FD\u5728\uFF0C\u9700\u4EBA\u5DE5\u770B diff \u624D\u8C08\u767B\u8BB0", "Seam check: {k} seam(s) differ from baseline ({ids}) \u2014 symbols present; manual diff needed before any registration"],
  "compat.seams.gone": ["\u89E6\u70B9\u81EA\u68C0\uFF1A{k} \u9879\u89E6\u70B9\u6D88\u5931\uFF08{ids}\uFF09\u2014\u2014\u8BE5\u7248\u672C\u5927\u6982\u7387\u7834\u574F\u63D2\u4EF6\uFF0C\u5EFA\u8BAE\u5148\u522B\u5347", "Seam check: {k} seam(s) gone ({ids}) \u2014 this version likely breaks the plugin; hold off on upgrading"],
  "compat.seams.extra": ["\u53E6\u6709 {k} \u9879\u57FA\u7EBF\u5916\u65B0\u589E\u7B26\u53F7", "plus {k} new symbol(s) beyond the baseline"],
  "compat.seams.skipped": ["\u89E6\u70B9\u81EA\u68C0\u672A\u6267\u884C\uFF08{why}\uFF09", "seam check not run ({why})"],
  "compat.seams.failed": ["\u89E6\u70B9\u81EA\u68C0\u5931\u8D25\uFF08{why}\uFF09", "seam check failed ({why})"],
  "compat.seams.reason.noRoot": ["\u672A\u627E\u5230\u5DF2\u6838\u9A8C\u7684\u5B98\u65B9\u5B89\u88C5\u76EE\u5F55", "no verified official install directory found"],
  "compat.seams.reason.treeShape": ["\u4EC5\u626B\u5230 {f} \u4E2A\u6587\u4EF6\uFF0C\u8FDC\u4F4E\u4E8E\u57FA\u7EBF\u2014\u2014\u76EE\u5F55\u4E0D\u50CF\u53D1\u5E03\u5B89\u88C5", "only {f} files scanned, far below baseline \u2014 not a release-looking install directory"],
  "modal.profileSwitchTitle": ["\u5207\u6362 DSH Profile\uFF1F", "Switch the DSH profile?"],
  "modal.profileSwitchBody": ["\u5F53\u524D\u300C{from}\u300D\u2192 \u76EE\u6807\u300C{to}\u300D\u3002\u63D2\u4EF6\u4F1A\u4EE3\u5EFA\uFF08\u5982\u9700\uFF09\u3001\u628A\u6865\u63A5\u88C5\u8FDB\u8BE5 profile\u3001\u6539\u5199\u9ED8\u8BA4\u542F\u52A8\u547D\u4EE4\u5E76\u91CD\u5EFA\u670D\u52A1\uFF1B\u4F1A\u8BDD\u5B58\u50A8\u4E3A\u672C\u673A\u5171\u4EAB\uFF0C\u4E0D\u4F1A\u4E22\u4F1A\u8BDD\u3002", "From \u201C{from}\u201D to \u201C{to}\u201D. The plugin will create it if needed, install the bridge into it, rewrite the default startup command and rebuild the service. Session storage is shared machine-wide, so nothing is lost."],
  "modal.profileSwitchDanger": ["\u670D\u52A1\u4F1A\u91CD\u542F\uFF0C\u9762\u677F\u6B63\u5728\u8DD1\u7684\u4EFB\u52A1\u4F1A\u88AB\u4E2D\u65AD\uFF1B\u7AEF\u53E3\u82E5\u4E0E\u5176\u4ED6\u5B9E\u4F8B\u76F8\u51B2\uFF0C\u63D2\u4EF6\u4E0D\u4F1A\u62A2\u7AEF\u53E3\u800C\u662F\u63D0\u793A\u4F60\u6539\u3002", "The service restarts and any running panel task is interrupted; if the port collides with another instance, the plugin will not take it over but tell you to change it."],
  "modal.profileSwitchConfirm": ["\u5207\u6362\u5E76\u91CD\u542F\u670D\u52A1", "Switch & restart"],
  "settings.port.title": ["\u670D\u52A1\u7AEF\u53E3", "Service port"],
  "settings.port.desc": ["DSH Web GUI \u76D1\u542C\u7AEF\u53E3\uFF08\u9ED8\u8BA4 3080\uFF09\uFF0C\u4E0E\u4E0A\u9762\u7684\u5730\u5740\u3001\u4E0B\u9762\u7684\u534F\u8BAE\u5171\u540C\u7EC4\u6210\u9762\u677F\u8981\u8FDE\u7684\u7AEF\u70B9\uFF1B\u6539\u52A8\u540E\u9700\u300C\u91CD\u542F\u670D\u52A1\u300D\u751F\u6548\u3002", "Port the DSH Web GUI listens on (default 3080); with the host above and the protocol below it forms the endpoint; restart the service to apply."],
  // v2.9.0：连接地址（host）/ 协议 / TLS —— 端点是探活、请求、iframe、postMessage 的唯一事实源
  "settings.host.title": ["\u670D\u52A1\u5730\u5740", "Service host"],
  "settings.host.desc": ["\u9762\u677F\u8FDE\u63A5\u7684 DSH \u76D1\u542C\u5730\u5740\uFF0C\u987B\u4E0E `dsh web --host` \u4E00\u81F4\u3002\u9ED8\u8BA4 127.0.0.1\uFF08\u4EC5\u672C\u673A\u53EF\u8FDE\uFF09\uFF1B\u586B\u672C\u673A\u5176\u4ED6 IPv4 / IPv6 \u5B57\u9762\u91CF\uFF08\u5982 192.168.1.5\u3001::1\uFF09\u4F1A\u5BF9\u5916\u5F00\u653E\u8BE5\u7F51\u5361\uFF0C\u4E0D\u652F\u6301\u901A\u914D\u5730\u5740\u3002", "Address DSH listens on \u2014 must match `dsh web --host`. Default 127.0.0.1 (this machine only); another local IPv4/IPv6 literal (e.g. 192.168.1.5, ::1) exposes that interface; wildcards are not accepted."],
  "settings.host.invalid": ["\u670D\u52A1\u5730\u5740\u65E0\u6548\uFF0C\u5DF2\u6062\u590D\u539F\u503C\uFF1A\u9700\u672C\u673A IPv4 / IPv6 \u5B57\u9762\u91CF\u6216 localhost\uFF0C\u4E0D\u80FD\u5E26\u534F\u8BAE\u3001\u7AEF\u53E3\u3001\u8DEF\u5F84\uFF0C\u4E5F\u4E0D\u80FD\u662F\u901A\u914D\u5730\u5740", "Invalid service host \u2014 reverted: use a local IPv4/IPv6 literal or localhost, without scheme, port or path, and not a wildcard address"],
  "settings.host.lanWarn": ["\u26A0 \u5F53\u524D\u4E0D\u662F\u56DE\u73AF\u5730\u5740\uFF1ADSH \u4F1A\u5BF9\u8BE5\u7F51\u5361\u53EF\u8FBE\u7684\u5176\u5B83\u8BBE\u5907\u5F00\u653E\uFF0C\u8BF7\u53EA\u5728\u53EF\u4FE1\u7F51\u7EDC\u4E2D\u8FD9\u6837\u914D\u7F6E", "\u26A0 Not a loopback address: DSH becomes reachable from other devices on that interface \u2014 only do this on a trusted network"],
  "settings.scheme.title": ["\u670D\u52A1\u534F\u8BAE", "Service protocol"],
  "settings.scheme.desc": ["http / https\u3002\u9009 HTTPS \u9700\u586B\u4E0B\u9762\u4E24\u9879\u8BC1\u4E66\u8DEF\u5F84\uFF0C\u5BF9\u5E94 DSH \u7684 `--tls-cert` / `--tls-key`\uFF08\u9700 DSH \u2265 0.2.1-rc.2\uFF09\u3002", "http / https. HTTPS requires the two certificate paths below, matching DSH `--tls-cert` / `--tls-key` (DSH \u2265 0.2.1-rc.2)."],
  "settings.scheme.http": ["HTTP", "HTTP"],
  "settings.scheme.https": ["HTTPS", "HTTPS"],
  "settings.tlsCert.title": ["HTTPS \u8BC1\u4E66 PEM \u8DEF\u5F84", "HTTPS certificate PEM path"],
  "settings.tlsCert.desc": ["\u4EC5 HTTPS \u65F6\u4F7F\u7528\u3002\u8BC1\u4E66 PEM \u7684\u6587\u4EF6\u8DEF\u5F84\uFF08\u4E0D\u662F\u5185\u5BB9\uFF09\u3002\u63D2\u4EF6\u751F\u6210\u547D\u4EE4\u65F6\u4F5C\u4E3A `--tls-cert` \u4EA4\u7ED9 DSH\uFF0C\u540C\u65F6\u7528\u4E8E\u63D2\u4EF6\u81EA\u8EAB\u6821\u9A8C\uFF0C\u987B\u662F\u542B leaf \u7684\u670D\u52A1\u5668\u8BC1\u4E66\u94FE\uFF1A\u79C1\u6709 CA \u628A CA \u62FC\u8FDB\u540C\u4E00\u6587\u4EF6\uFF0C\u81EA\u7B7E\u5355\u8BC1\u4E66\u672C\u8EAB\u5373\u951A\u70B9\uFF1B\u81EA\u5B9A\u4E49\u547D\u4EE4\u81EA\u5E26 `--tls-cert` \u65F6\u586B\u7B7E\u53D1\u5B83\u7684 CA \u5373\u53EF\u3002", "Used for HTTPS only. File path (not contents) of the certificate PEM. A plugin-generated command passes it as `--tls-cert` and also uses it as the plugin-side trust anchor, so it must be a server certificate chain containing the leaf: concatenate a private CA into the same file (a self-signed single certificate is its own anchor); if your custom command supplies `--tls-cert`, point this at the issuing CA."],
  "settings.tlsKey.title": ["HTTPS \u79C1\u94A5 PEM \u8DEF\u5F84", "HTTPS private key PEM path"],
  "settings.tlsKey.desc": ["\u4EC5 HTTPS \u65F6\u4F7F\u7528\u3002\u79C1\u94A5 PEM \u7684\u6587\u4EF6\u8DEF\u5F84\uFF08\u4E0D\u662F\u5185\u5BB9\uFF09\uFF0C\u4E0E\u4E0A\u9762\u7684\u8BC1\u4E66\u6210\u5BF9\uFF1B\u63D2\u4EF6\u751F\u6210\u547D\u4EE4\u65F6\u4F5C\u4E3A `--tls-key`\u3002", "Used for HTTPS only. File path (not contents) of the private key PEM; paired with the certificate above and passed as `--tls-key` by a plugin-generated command."],
  "settings.tls.trustHint": ["\u26A0 HTTPS\uFF1A\u81EA\u7B7E\u540D\u8BC1\u4E66\u987B\u5BFC\u5165\u7CFB\u7EDF\u4FE1\u4EFB\u6839\uFF08Windows\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF1BmacOS \u94A5\u5319\u4E32\u8BBE\u4E3A\u300C\u59CB\u7EC8\u4FE1\u4EFB\u300D\uFF09\uFF0C\u5426\u5219\u9762\u677F iframe \u4F1A\u56E0\u8BC1\u4E66\u4E0D\u53D7\u4FE1\u4EFB\u6253\u4E0D\u5F00\uFF1B\u63D2\u4EF6 Node \u4FA7\u5219\u7528\u4E0A\u9762\u586B\u7684\u8BC1\u4E66 PEM \u6821\u9A8C", "\u26A0 HTTPS: import a self-signed certificate into the OS trust store (Windows \u201CTrusted Root Certification Authorities\u201D; macOS Keychain \u201CAlways Trust\u201D), otherwise the panel iframe cannot load; the plugin\u2019s Node side validates against the PEM path above"],
  "settings.tls.missingWarn": ["\u26A0 \u5DF2\u9009 HTTPS \u4F46\u8BC1\u4E66 / \u79C1\u94A5\u672A\u586B\u5168\uFF1A\u63D2\u4EF6\u751F\u6210\u547D\u4EE4\u65F6\u4E0D\u4F1A\u5E26 TLS \u53C2\u6570\uFF0C\u8FDE\u63A5\u4F1A\u5931\u8D25", "\u26A0 HTTPS selected but certificate / key incomplete: a plugin-generated command will carry no TLS flags, so the connection fails"],
  "settings.tls.needPair": ["\u5207\u5230 HTTPS \u9700\u8981\u8BC1\u4E66\u4E0E\u79C1\u94A5\uFF1A\u8BF7\u5148\u586B\u597D\u4E0B\u9762\u4E24\u9879\u300CHTTPS \u8BC1\u4E66 / \u79C1\u94A5 PEM \u8DEF\u5F84\u300D\u518D\u5207\u6362\uFF08\u63D2\u4EF6\u8981\u636E\u6B64\u5728\u542F\u52A8\u547D\u4EE4\u91CC\u8865 `--tls-cert/--tls-key`\uFF1B\u82E5\u547D\u4EE4\u91CC\u5DF2\u81EA\u5E26 TLS \u53C2\u6570\u5219\u4E0D\u62E6\uFF09\uFF1B\u5DF2\u4FDD\u6301\u539F\u534F\u8BAE\u3002", "Switching to HTTPS needs both certificate and key: fill in the two \u201CHTTPS certificate / private key PEM\u201D fields below first (the plugin appends `--tls-cert/--tls-key` to the startup command; a command that already carries TLS flags is allowed); the protocol was left unchanged."],
  "settings.command.title": ["\u542F\u52A8\u547D\u4EE4", "Startup command"],
  "settings.command.hint": ["\u7559\u7A7A\uFF1D\u7531\u63D2\u4EF6\u6309\u4E0A\u9762\u7684\u5730\u5740 / \u7AEF\u53E3 / \u534F\u8BAE\u751F\u6210\u542F\u52A8\u547D\u4EE4\uFF1B\u586B\u5165\u5219\u4FDD\u7559\u4F60\u7684\u53C2\u6570\uFF0C\u63D2\u4EF6\u53EA\u8865\u4E0A\u7F3A\u5931\u7684 `--host` / `--tls-cert` / `--tls-key`\uFF08\u5DF2\u6709\u7684\u540C\u540D\u53C2\u6570\u4E0D\u8986\u76D6\uFF09\u3002\u793A\u4F8B\uFF1Apnpm dsh web --port {port}", "Empty = the plugin builds the command from the host / port / protocol above; a value keeps your arguments and the plugin only appends missing `--host` / `--tls-cert` / `--tls-key` (existing flags win). Example: pnpm dsh web --port {port}"],
  // v2.9.2：端点参数对自定义命令也会补齐（已有同名参数不覆盖）
  "settings.command.hint.endpoint": ["\u7528 pnpm \u542F\u52A8\u65F6\u8BF7\u628A\u5DE5\u4F5C\u76EE\u5F55\u8BBE\u4E3A DSH \u4ED3\u5E93\u8DEF\u5F84\uFF1B`--host` / `--tls-*` \u9700\u8981 DSH \u2265 0.2.1-rc.2\uFF1B\u82E5\u547D\u4EE4\u91CC\u5DF2\u5199\u6B7B `--host` \u6216 `--tls-*`\uFF0C\u4EE5\u547D\u4EE4\u4E3A\u51C6\uFF08\u63D2\u4EF6\u4E0D\u518D\u8FFD\u52A0\uFF09\u3002", "When using pnpm, set the working directory to the DSH repo; `--host` / `--tls-*` require DSH \u2265 0.2.1-rc.2; flags you already wrote win (the plugin appends nothing twice)."],
  "settings.command.hostMismatch": ["\u26A0 \u542F\u52A8\u547D\u4EE4\u91CC\u7684 `--host` \u4E3A {cmd}\uFF0C\u4E0E\u300C\u670D\u52A1\u5730\u5740\u300D{host} \u4E0D\u4E00\u81F4\uFF1A\u63D2\u4EF6\u4F1A\u6309\u670D\u52A1\u5730\u5740\u8FDE\u63A5\uFF0C\u5FC5\u7136\u8FDE\u4E0D\u4E0A\u3002\u8BF7\u7EDF\u4E00\u4E8C\u8005\u3002", "\u26A0 The startup command pins `--host` to {cmd} while Service address is {host}: the plugin connects to the service address and will fail \u2014 make the two agree."],
  "settings.command.nonWeb": ["\u542F\u52A8\u547D\u4EE4\u6307\u5411 DSH \u5185\u7F6E\u7684\u300C{p}\u300D\u6863\uFF1A\u90A3\u4E00\u6863\u4E0D\u63D0\u4F9B Web \u754C\u9762\uFF08acp \u8D70 stdio \u7684 Agent Client Protocol\uFF0Cheadless/sdk \u53EA\u505A\u5BBF\u4E3B\uFF09\uFF0C\u6C38\u8FDC\u4E0D\u4F1A\u76D1\u542C\u7AEF\u53E3\uFF0C\u9762\u677F\u5FC5\u7136\u8FDE\u4E0D\u4E0A \u21D2 \u5DF2\u62D2\u7EDD\u4FDD\u5B58\u3002\u9762\u677F\u8BF7\u7528 dsh web --port {port} --no-open\uFF1B\u8981\u591A\u6863\u5171\u5B58\u5C31\u586B\u672C\u673A\u5DF2\u6709\u7684\u81EA\u5B9A\u4E49 profile\uFF08\u5982 test\uFF09\u3002", 'The startup command targets DSH built-in profile "{p}", which serves no Web GUI (acp speaks the Agent Client Protocol over stdio; headless/sdk are hosts only) and never listens on a port, so the panel can never connect \u2014 the change was rejected. Use dsh web --port {port} --no-open for the panel, or name an existing custom profile (e.g. test) for multi-profile setups.'],
  "settings.command.nonWebFallback": ["\u542F\u52A8\u547D\u4EE4\u91CC\u51FA\u73B0 DSH \u5185\u7F6E\u975E Web \u6863\u540D\u300C{p}\u300D\uFF08\u591A\u4E3A\u624B\u6539 data.json \u6240\u81F4\uFF09\uFF1A\u672C\u6B21\u5DF2\u56DE\u9000\u4E3A\u9ED8\u8BA4 Web \u547D\u4EE4\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u9875\u6539\u6B63\u3002", 'The startup command names DSH built-in non-Web profile "{p}" (usually from an edited data.json): this launch fell back to the default Web command \u2014 please fix it in Settings.'],
  "settings.cwd.title": ["\u5DE5\u4F5C\u76EE\u5F55", "Working directory"],
  "settings.cwd.desc": ["\u542F\u52A8 DSH \u65F6\u7684\u5DE5\u4F5C\u76EE\u5F55\uFF08DSH \u5DE5\u4F5C\u533A\uFF09\uFF1B\u7559\u7A7A\u4E3A Vault \u6839\u76EE\u5F55", "Working directory used to start DSH (the DSH workspace); empty means the Vault root"],
  "settings.autoStart.title": ["\u79BB\u7EBF\u65F6\u81EA\u52A8\u542F\u52A8", "Auto-start when offline"],
  "settings.autoStart.desc": ["\u6253\u5F00\u9762\u677F\u65F6\u82E5\u7AEF\u70B9\u65E0\u670D\u52A1\uFF0C\u81EA\u52A8\u8FD0\u884C\u542F\u52A8\u547D\u4EE4", "Automatically run the startup command when nothing is listening on the endpoint"],
  "settings.detached.title": ["\u8FDB\u7A0B\u72EC\u7ACB\u5E38\u9A7B", "Detached persistent process"],
  "settings.detached.desc": ["\u5F00\u542F\u540E\uFF0C\u63D2\u4EF6\u542F\u52A8\u7684 DSH \u8FDB\u7A0B\u5728 Obsidian \u9000\u51FA\u540E\u7EE7\u7EED\u8FD0\u884C\uFF08\u9ED8\u8BA4\u5F00\u542F\uFF09\uFF1B\u5173\u95ED\u540E\u968F Obsidian \u9000\u51FA\u800C\u7EC8\u6B62", "When on (default), the DSH process started by the plugin keeps running after Obsidian exits; when off, it terminates with Obsidian"],
  "settings.readyTimeout.title": ["\u542F\u52A8\u7B49\u5F85\u65F6\u95F4", "Startup timeout"],
  "settings.readyTimeout.desc": ["\u81EA\u52A8\u542F\u52A8\u540E\u7B49\u5F85\u670D\u52A1\u5C31\u7EEA\u7684\u6700\u957F\u65F6\u95F4\uFF08\u5F53\u524D {s} \u79D2\uFF09\uFF1B\u9996\u6B21\u542F\u52A8\u53EF\u80FD\u9700\u8981 1\u20132 \u5206\u949F", "Max time to wait for the service after auto-start (currently {s}s); first start may take 1\u20132 minutes"],
  "settings.installUrl.title": ["\u5B89\u88C5\u5730\u5740", "Install URL"],
  "settings.installUrl.desc": ["\u514B\u9686\u4ED3\u5E93\u5730\u5740\uFF1B\u9ED8\u8BA4\u5B98\u65B9\u4ED3\u5E93\uFF0C\u7F51\u7EDC\u53D7\u9650\u65F6\u53EF\u6362\u4EE3\u7406\u955C\u50CF\uFF08\u5982 https://gh-proxy.com/https://github.com/deepseek-ai/deepseek-harness.git\uFF09", "Repo URL to clone; defaults to the official repo. Behind a restricted network, switch to a proxy mirror (e.g. https://gh-proxy.com/https://github.com/deepseek-ai/deepseek-harness.git)"],
  // ---- 面板视图 ----
  "view.action.reconnect": ["\u91CD\u8FDE\u670D\u52A1", "Reconnect"],
  "view.action.openBrowser": ["\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00 DSH", "Open DSH in browser"],
  "view.monitor.disconnected": ["\u8FDE\u63A5\u5DF2\u65AD\u5F00\uFF1A{msg}", "Disconnected: {msg}"],
  "view.loading.title": ["\u6B63\u5728\u542F\u52A8 DeepSeek Harness\u2026", "Starting DeepSeek Harness\u2026"],
  "view.loading.detail": ["\u9996\u6B21\u542F\u52A8\u53EF\u80FD\u9700\u8981\u4E00\u4E24\u5206\u949F\uFF0C\u8BF7\u7A0D\u5019", "The first start may take a minute or two, please wait"],
  "view.copy.copied": ["\u547D\u4EE4\u5DF2\u590D\u5236", "Command copied"],
  "view.copy.failed": ["\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236", "Copy failed, please copy manually"],
  "view.install.title": ["\u8FD8\u6CA1\u5B89\u88C5 DeepSeek Harness", "DeepSeek Harness is not installed yet"],
  "view.install.desc": ["\u70B9\u4E00\u4E0B\u81EA\u52A8\u5B89\u88C5\uFF1A\u4F1A\u81EA\u52A8\u4E0B\u8F7D DeepSeek Harness \u5E76\u914D\u597D\u4E00\u5207\uFF0C\u5168\u7A0B\u4E0D\u7528\u78B0\u547D\u4EE4\u884C\u3002", "Click to install automatically: it downloads DeepSeek Harness and sets everything up \u2014 no command line needed."],
  "view.install.mark.ok": ["\u2713 \u5DF2\u5B89\u88C5", "\u2713 Installed"],
  "view.install.mark.missing": ["\u2717 \u672A\u5B89\u88C5", "\u2717 Missing"],
  "view.install.depsHint": ["\u4E0A\u9762\u6709\u7F3A\u5931\u7684\u5DE5\u5177\uFF0C\u5148\u70B9\u4E0B\u9762\u7684\u6309\u94AE\u88C5\u4E0A\uFF08\u9700\u8981\u6388\u6743\u65F6\u6309\u63D0\u793A\u5141\u8BB8\uFF09\uFF1A", "Some tools above are missing \u2014 install them with the buttons below (approve the prompts when asked):"],
  "view.install.git": ["\u4E00\u952E\u5B89\u88C5 git", "Install git"],
  "view.install.node": ["\u4E00\u952E\u5B89\u88C5 Node.js", "Install Node.js"],
  "view.install.pnpm": ["\u4E00\u952E\u5B89\u88C5 pnpm", "Install pnpm"],
  "view.install.btn": ["\u4E00\u952E\u914D\u7F6EDSH", "Configure DSH"],
  "view.install.installing": ["\u5B89\u88C5\u4E2D\u2026", "Installing\u2026"],
  "view.install.done": ["\u5B89\u88C5\u5B8C\u6210\uFF08\u5DF2\u81EA\u52A8\u5237\u65B0\u73AF\u5883\u53D8\u91CF\uFF0C\u65E0\u9700\u91CD\u542F\uFF09", "Installed (PATH refreshed automatically; no restart needed)"],
  "view.install.preparing": ["\u51C6\u5907\u4E2D\u2026", "Preparing\u2026"],
  "view.install.starting": ["\u5B89\u88C5\u5B8C\u6210\uFF0C\u6B63\u5728\u542F\u52A8\u2026", "Installed, starting\u2026"],
  // ---- DSH 睡着了（等待重连界面）----
  "view.asleep.name": ["DSH for Obsidian", "DSH for Obsidian"],
  "view.asleep.status": ["\u4F60\u7684 DSH \u7761\u7740\u4E86\uFF0C\u8BF7\u5C1D\u8BD5\u5524\u9192", "Your DSH is asleep \u2014 try to wake it up"],
  "view.asleep.hint": ["\u5C0F\u63D0\u793A\uFF1ADSH \u751F\u6001\u5C1A\u672A\u5B8C\u5584\uFF0C\u6709\u673A\u4F1A\u56E0\u4E3A\u63D2\u4EF6\u51B2\u7A81\u6216\u63D2\u4EF6\u5378\u8F7D\u6B8B\u7559\u7B49\u95EE\u9898\u5BFC\u81F4\u65E0\u6CD5\u8FDE\u63A5\u3002", "Tip: The DSH ecosystem is still maturing; connection can fail due to plugin conflicts or leftover files from uninstalled plugins."],
  "view.asleep.wake": ["\u5524\u9192\u5E72\u6D3B", "Wake it up"],
  "view.asleep.aed": ["AED for DSH", "AED for DSH"],
  "view.asleep.aedConfirm": ["\u63D2\u4EF6\u5C06\u4E0B\u8F7D\u5E76\u6267\u884Cdsh-fix\uFF0C\u5C1D\u8BD5\u4EE5\u5B89\u5168\u6A21\u5F0F\u8FDB\u884CDSH\u3002\n\u8BF7\u7528\u6237\u8FDB\u5165DSH\u540E\u6307\u4EE4DSH\u8FDB\u884C\u81EA\u884C\u4FEE\u590D\uFF0C\u5E76\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u3002", "The plugin will download and run dsh-fix to try operating DSH in safe mode.\nAfter entering DSH, instruct DSH to repair itself, then exit safe mode."],
  "view.asleep.aedConfirmBtn": ["\u786E\u8BA4\u6267\u884C", "Confirm & run"],
  "view.asleep.aedCancel": ["\u53D6\u6D88", "Cancel"],
  "view.asleep.askAi": ["\u95EE\u95EE AI", "Ask AI"],
  "view.asleep.more": ["\u66F4\u591A\u8BBE\u7F6E", "More settings"],
  // ---- v2.3.1 认证拦截引导卡（面板内嵌不可用时）----
  "view.blocked.title": ["\u5185\u5D4C\u754C\u9762\u6682\u4E0D\u53EF\u7528", "Embedded panel unavailable"],
  "view.blocked.desc": ["DSH \u65B0\u7248\u542F\u7528\u4E86\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\uFF0C\u5F53\u524D\u63D2\u4EF6\u7684\u5D4C\u5165\u9002\u914D\u6682\u65F6\u672A\u80FD\u751F\u6548\uFF08\u591A\u4E3A DSH \u66F4\u65B0\u540E\u63A5\u53E3\u53D8\u52A8\uFF0C\u7B49\u5F85\u63D2\u4EF6\u66F4\u65B0\u9002\u914D\uFF09\u3002\u7B14\u8BB0\u53D1\u9001\u4E0E\u6865\u63A5\u529F\u80FD\u4E0D\u53D7\u5F71\u54CD\uFF1B\u70B9\u300C\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH\u300D\u53EF\u5B8C\u6574\u4F7F\u7528\u3002", 'The newer DSH enables browser-session authentication and the plugin embed adapter is not currently active (typically after a DSH interface change; a plugin update restores it). Note sending and bridge features still work; use "Open DSH in browser" for the full interface.'],
  "view.blocked.openBrowser": ["\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH", "Open DSH in browser"],
  "view.blocked.retry": ["\u91CD\u65B0\u52A0\u8F7D", "Reload"],
  "view.blocked.fallback": ["\u56DE\u9000\u5230\u9002\u914D\u7248\u672C DSH\uFF08{v}\uFF09", "Fall back to adapted DSH ({v})"],
  "view.blocked.fallbackHint": ["\u5F53\u524D DSH {cur}\uFF08\u672C\u63D2\u4EF6\u5DF2\u9A8C\u8BC1\u533A\u95F4 {range}\uFF09\u3002\u53EF\u4E00\u952E\u5B89\u88C5\u5DF2\u9A8C\u8BC1\u7684\u9002\u914D\u7248\u672C {v} \u5E76\u91CD\u542F\u670D\u52A1\uFF1B\u88C5\u597D\u540E\u968F\u65F6\u53EF\u4EE5\u518D\u5347\u7EA7\u3002", "Installed DSH {cur} (this plugin has verified {range}). Install the verified adapted version {v} and restart the service in one click; you can upgrade again later."],
  "view.blocked.fallbackConfirmBody": ["\u5C06\u7ED3\u675F\u672C\u673A DSH \u8FDB\u7A0B \u2192 \u5168\u5C40\u5B89\u88C5 @deepseek-ai/dsh@{v} \u2192 \u91CD\u542F\u670D\u52A1\u5E76\u5237\u65B0\u9762\u677F\u3002\u671F\u95F4\u9762\u677F\u77ED\u6682\u79BB\u7EBF\uFF0C\u5DF2\u5B8C\u6210\u7684\u4F1A\u8BDD\u4E0D\u53D7\u5F71\u54CD\uFF1B\u5B98\u65B9\u6E90\u5931\u8D25\u4F1A\u81EA\u52A8\u5207 npmmirror\u3002", "This stops the local DSH processes, installs @deepseek-ai/dsh@{v} globally, then restarts the service and reloads the panel. The panel is briefly offline; finished sessions are unaffected. If the official registry fails it retries via npmmirror."],
  "view.blocked.fallbackConfirm": ["\u786E\u8BA4\u56DE\u9000\u5E76\u5B89\u88C5", "Install the adapted version"],
  "view.blocked.fallbackCancel": ["\u53D6\u6D88", "Cancel"],
  "view.blocked.fallbackRunning": ["\u6B63\u5728\u5B89\u88C5 DSH {v}\uFF0C\u8BF7\u7A0D\u5019\u2026", "Installing DSH {v}\u2026"],
  "view.blocked.fallbackFail": ["\u56DE\u9000\u5931\u8D25\uFF1A{err}\u3002\u53EF\u624B\u52A8\u6267\u884C npm i -g @deepseek-ai/dsh@{v} \u540E\u91CD\u542F\u670D\u52A1\u3002", "Fallback failed: {err}. You can run npm i -g @deepseek-ai/dsh@{v} manually, then restart the service."],
  "view.blocked.fallbackSame": ["\u5F53\u524D\u5DF2\u662F\u9002\u914D\u7248\u672C {v}\u3002\u82E5\u9762\u677F\u4ECD\u4E0D\u53EF\u7528\uFF0C\u8BF7\u70B9\u300C\u91CD\u65B0\u52A0\u8F7D\u300D\uFF1B\u4ECD\u4E0D\u884C\u5219\u5230\u8BBE\u7F6E\u9875\u91CD\u542F DSH \u670D\u52A1\u540E\u518D\u8BD5\u3002", 'Already on the adapted version {v}. If the panel is still unavailable, click "Reload"; if that fails, restart the DSH service in settings.'],
  "view.blocked.fallbackDone": ["\u5DF2\u56DE\u9000\u5230\u9002\u914D\u7248\u672C DSH {v}\uFF0C\u9762\u677F\u5373\u5C06\u91CD\u65B0\u52A0\u8F7D", "Fell back to adapted DSH {v}; the panel is reloading."],
  "view.wait.title": ["DSH \u670D\u52A1\u542F\u52A8\u4E2D\u2026", "Starting the DSH service\u2026"],
  "view.wait.desc": ["\u5C31\u7EEA\u540E\u9762\u677F\u4F1A\u81EA\u52A8\u663E\u793A\uFF0C\u65E0\u9700\u624B\u52A8\u5237\u65B0\u3002\u51B7\u542F\u52A8\u53EF\u80FD\u9700\u8981\u5341\u51E0\u79D2\u5230\u4E00\u5206\u949F\uFF08\u53D6\u51B3\u4E8E\u5DF2\u88C5\u63D2\u4EF6\u6570\u91CF\uFF09\u3002", "The panel appears automatically once ready \u2014 no manual refresh needed. A cold start can take tens of seconds depending on installed plugins."],
  "notice.bridgeScriptStale": ["\u6CE8\u5165\u811A\u672C\u4E3A\u65E7\u7248\u672C\uFF08\u672A\u4E0A\u62A5\u754C\u9762\u72B6\u6001\uFF09\uFF1A\u767D\u5C4F\u81EA\u52A8\u6062\u590D\u6682\u65F6\u65E0\u6548\uFF0C\u8BF7\u5230\u8BBE\u7F6E\u9875\u70B9\u4E00\u6B21\u300C\u91CD\u542F DSH \u670D\u52A1\u300D", 'The injected script is outdated (no UI-state reporting), so blank-panel auto-recovery is inactive. Click "Restart DSH service" once in settings'],
  "notice.injectStormStopped": ["\u6865\u63A5\u6CE8\u5165\u5DF2\u8FBE\u5355\u4F1A\u8BDD\u4E0A\u9650\uFF08{n} \u6B21\uFF09\u5E76\u81EA\u52A8\u505C\u6B62\uFF1A\u672C\u6B21\u4F1A\u8BDD\u6B64\u524D\u53EF\u80FD\u56E0\u53CD\u590D\u6846\u9009\u800C\u8FC7\u5EA6\u6CE8\u5165\u3002\u5EFA\u8BAE\u65B0\u5EFA\u4F1A\u8BDD\u7EE7\u7EED\u4F7F\u7528\uFF1B\u82E5\u9700\u518D\u6B21\u6CE8\u5165\u540C\u4E00\u9009\u533A\uFF0C\u8BF7\u4FEE\u6539\u9009\u533A\u6216\u6307\u4EE4\u6587\u672C\u3002", "Bridge injection hit the per-session cap ({n}) and stopped automatically: this session was likely over-injected by repeated selections. Start a new session to continue; to inject the same selection again, change the selection or the instruction text."],
  "notice.linkNotFound": ["\u672A\u627E\u5230\u7B14\u8BB0\uFF1A{target}\uFF08\u4E0D\u5B58\u5728\uFF0C\u6216\u4E0D\u5728\u5F53\u524D\u5E93\u5185\uFF09", "Note not found: {target} (missing, or outside the current vault)"],
  // ---- AED for DSH（抢救工具）----
  "aed.checkFix": ["\u68C0\u67E5 dsh-fix\u2026", "Checking dsh-fix\u2026"],
  "aed.installFix": ["\u6B63\u5728\u5B89\u88C5 dsh-fix\u2026", "Installing dsh-fix\u2026"],
  "aed.installFixMirror": ["\u5B98\u65B9\u6E90\u4E0D\u53EF\u8FBE\uFF0C\u6539\u7528\u955C\u50CF\u5B89\u88C5\u2026", "Official registry unreachable; trying the mirror\u2026"],
  "aed.installFixDone": ["dsh-fix \u5DF2\u5C31\u7EEA", "dsh-fix ready"],
  "aed.installFixFail": ["dsh-fix \u5B89\u88C5\u5931\u8D25\uFF1A{err}", "dsh-fix install failed: {err}"],
  "aed.fallbackNpx": ["\u5168\u5C40\u5B89\u88C5\u5931\u8D25\uFF0C\u6539\u7528 npx \u4E34\u65F6\u8FD0\u884C\u2026", "Global install failed; using npx temporarily\u2026"],
  "aed.doctor": ["dsh-fix doctor \u8BCA\u65AD\u4E2D\u2026", "Running dsh-fix doctor\u2026"],
  "aed.doctorNoDetail": ["\uFF08\u8BCA\u65AD\u65E0\u660E\u7EC6\uFF09", "(no diagnostic detail)"],
  "aed.safeMode": ["\u8FDB\u5165\u5B89\u5168\u6A21\u5F0F\uFF08\u7981\u7528\u7528\u6237\u63D2\u4EF6\uFF09\u2026", "Entering safe mode (disabling user plugins)\u2026"],
  "aed.safeFail": ["\u5B89\u5168\u6A21\u5F0F\u542F\u52A8\u5931\u8D25\uFF1A{err}", "Safe mode failed: {err}"],
  "aed.safeDone": ["\u5DF2\u8FDB\u5165\u5B89\u5168\u6A21\u5F0F\uFF1A{diag}", "Safe mode entered: {diag}"],
  "aed.disableBundles": ["\u7981\u7528 bundle \u5C42\u7528\u6237\u63D2\u4EF6\u2026", "Disabling bundle-layer user plugins\u2026"],
  "aed.disableBundlesFail": ["\u7981\u7528 bundle \u5C42\u7528\u6237\u63D2\u4EF6\u5931\u8D25\uFF1A{err}", "Failed to disable bundle-layer user plugins: {err}"],
  "aed.safeBundles": ["\uFF1Bbundle \u5C42\u7528\u6237\u63D2\u4EF6\u5DF2\u4E00\u5E76\u7981\u7528\uFF1A{list}", "; bundle-layer user plugins also disabled: {list}"],
  "aed.done": ["AED \u62A2\u6551\u5B8C\u6210", "AED recovery done"],
  "aed.running": ["AED \u62A2\u6551\u8FDB\u884C\u4E2D\u2026", "AED recovery in progress\u2026"],
  "aed.exitSafeMode": ["\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\uFF08\u6062\u590D\u7528\u6237\u63D2\u4EF6\uFF09\u2026", "Exiting safe mode (restoring user plugins)\u2026"],
  "aed.exitSafeFail": ["\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u5931\u8D25\uFF1A{err}", "Exiting safe mode failed: {err}"],
  "aed.exitBundleFail": ["\u6062\u590D bundle \u5C42\u7528\u6237\u63D2\u4EF6\u5931\u8D25\uFF1A{err}", "Failed to restore bundle-layer user plugins: {err}"],
  "aed.exitSafeDone": ["\u5DF2\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\uFF0C\u5168\u90E8\u7528\u6237\u63D2\u4EF6\u5DF2\u6062\u590D\uFF08\u542B bundle \u5C42\uFF09", "Exited safe mode; all user plugins restored (including bundle layer)"],
  // ---- AED 启动校验与一次性修复（v2.1.0）----
  "aed.bootVerify": ["\u6B63\u5728\u6821\u9A8C DSH \u542F\u52A8\u2026", "Verifying DSH boot\u2026"],
  "aed.takesTime": ["\uFF08\u6293\u53D6\u9875\u9762\u6821\u9A8C\uFF0C\u53EF\u80FD\u9700\u8981\u6570\u79D2\uFF09", "(page fetch check; may take a few seconds)"],
  "aed.bootVerifyOk": ["\u542F\u52A8\u6821\u9A8C\u901A\u8FC7 \u2713\uFF08\u9875\u9762\u6CE8\u5165\u5B8C\u6574\uFF09", "Boot check passed \u2713 (page injection intact)"],
  "aed.verifyModalTitle": ["\u68C0\u6D4B\u5230 DSH \u542F\u52A8\u5F02\u5E38", "DSH boot issue detected"],
  "aed.modal.type": ["\u9519\u8BEF\u7C7B\u578B", "Error type"],
  "aed.modal.reason": ["\u5224\u65AD", "Assessment"],
  "aed.modal.fix": ["\u5EFA\u8BAE\u52A8\u4F5C", "Suggested action"],
  "aed.modal.apply": ["\u6267\u884C\u4FEE\u590D\uFF08\u4EC5\u4E00\u6B21\uFF09", "Apply fix (once only)"],
  "aed.modal.understood": ["\u77E5\u9053\u4E86", "Got it"],
  "aed.modal.detail": ["\u9519\u8BEF\u8BE6\u60C5\uFF1A{detail}", "Error detail: {detail}"],
  "aed.kind.client-modules": ["\u5BA2\u6237\u7AEF\u6A21\u5757\u52A0\u8F7D\u5931\u8D25\uFF08client-modules\uFF09", "Client modules failed to load (client-modules)"],
  "aed.kind.bundle-face": ["\u542F\u52A8\u5F15\u5BFC\u6A21\u5757\u5F02\u5E38\uFF08bootstrap module face\uFF09", "Bootstrap module face error"],
  "aed.kind.patch-parse": ["\u8865\u4E01\u914D\u7F6E\u89E3\u6790\u5931\u8D25\uFF08cordis.patch.yml\uFF09", "Patch config parse error (cordis.patch.yml)"],
  "aed.kind.plugin-missing": ["\u63D2\u4EF6\u6587\u4EF6\u7F3A\u5931", "Plugin files missing"],
  "aed.kind.init-crash": ["\u670D\u52A1\u521D\u59CB\u5316\u5D29\u6E83", "Service initialization crash"],
  "aed.kind.unreachable": ["\u670D\u52A1\u672A\u54CD\u5E94", "Service unreachable"],
  "aed.kind.other": ["\u5176\u4ED6\u5F02\u5E38", "Other error"],
  "aed.reason.client-modules": ["\u9875\u9762\u7F3A\u5C11 DSH \u542F\u52A8\u5F15\u5BFC\u6CE8\u5165\uFF08__DSH_BOOT__ / client.js\uFF09\u3002\u5E38\u89C1\u539F\u56E0\uFF1A\u5B89\u5168\u6A21\u5F0F\u6B8B\u7559\u7981\u7528\u4E86\u6865\u63A5\u63D2\u4EF6\uFF0C\u6216\u5BA2\u6237\u7AEF\u6A21\u5757\u88AB\u7981\u7528/\u672A\u6784\u5EFA", "The page is missing the DSH boot injection (__DSH_BOOT__ / client.js). Common causes: safe-mode leftovers disabled the bridge plugin, or the client module is disabled/unbuilt"],
  "aed.reason.bundle-face": ["client.js \u672A\u5BFC\u51FA\u542F\u52A8\u6A21\u5757\u3002\u5E38\u89C1\u539F\u56E0\uFF1A\u5BA2\u6237\u7AEF\u6A21\u5757\u88AB\u7981\u7528\uFF0C\u6216\u4ED3\u5E93\u5F62\u6001\u4E0B\u672A\u6784\u5EFA\uFF08\u9700 pnpm run build\uFF09", "client.js does not export the bootstrap module. Common causes: a disabled client module, or an unbuilt repo form (needs pnpm run build)"],
  "aed.reason.patch-parse": ["cordis.patch.yml \u5B58\u5728\u89E3\u6790\u9519\u8BEF\uFF0C\u8865\u4E01\u5C42\uFF08\u63D2\u4EF6\uFF09\u53EF\u80FD\u6574\u4F53\u672A\u52A0\u8F7D", "cordis.patch.yml has a parse error; the patch layer (plugins) may not load at all"],
  "aed.reason.plugin-missing": ["\u6709\u63D2\u4EF6\u5F15\u7528\u7684\u6587\u4EF6\u7F3A\u5931\uFF0CDSH \u53EF\u80FD\u62D2\u7EDD\u542F\u52A8", "A plugin file referenced is missing; DSH may refuse to boot"],
  "aed.reason.init-crash": ["DSH \u521D\u59CB\u5316\u9636\u6BB5\u5D29\u6E83\uFF0C\u53EF\u80FD\u4E0E\u63D2\u4EF6\u51B2\u7A81\u6216\u914D\u7F6E\u635F\u574F\u6709\u5173", "DSH crashed during initialization \u2014 likely a plugin conflict or corrupted config"],
  "aed.reason.unreachable": ["\u91CD\u542F\u540E DSH \u672A\u5728\u9884\u671F\u7AEF\u53E3\u54CD\u5E94\uFF0C\u8BF7\u786E\u8BA4\u670D\u52A1\u662F\u5426\u771F\u7684\u542F\u52A8", "DSH did not respond on the expected port after restart \u2014 confirm the service actually started"],
  "aed.reason.other": ["\u672A\u80FD\u8BC6\u522B\u5177\u4F53\u539F\u56E0\uFF0C\u8BF7\u67E5\u770B\u4E0B\u65B9\u9519\u8BEF\u8BE6\u60C5", "Could not identify the cause; see the error detail below"],
  "aed.fix.patch": ["\u91CD\u5EFA\u6865\u63A5\u8865\u4E01\uFF08\u81EA\u6108\u5B89\u5168\u6A21\u5F0F\u6B8B\u7559\u7684\u7981\u7528\u5757\uFF09\u5E76\u79FB\u9664\u5386\u53F2\u6B8B\u7559\u7684 bundle \u7981\u7528\u5757\uFF0C\u7136\u540E\u91CD\u542F DSH \u670D\u52A1\u590D\u9A8C\u3002\u4EC5\u5C1D\u8BD5\u4E00\u6B21\u3002", "Rewrite the bridge patch (healing safe-mode disable leftovers) and remove stale bundle disable blocks, then restart the DSH service to re-verify. Attempted once."],
  "aed.fix.none": ["\u6B64\u9519\u8BEF\u65E0\u6CD5\u81EA\u52A8\u4FEE\u590D\u3002\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u65B9\u5F0F\uFF1Adsh-fix doctor / bisect\uFF0C\u6216\u91CD\u88C5 DSH\u3002", "This error cannot be auto-fixed. Try other approaches: dsh-fix doctor / bisect, or reinstall DSH."],
  "aed.fix.done": ["\u4FEE\u590D\u5B8C\u6210\uFF0C\u542F\u52A8\u6821\u9A8C\u901A\u8FC7 \u2713", "Fix applied; boot check passed \u2713"],
  "aed.fix.fail": ["\u4FEE\u590D\u540E\u4ECD\u4E3A\u540C\u7C7B\u9519\u8BEF\uFF0C\u4E0D\u518D\u81EA\u52A8\u91CD\u8BD5\u3002", "Same error after the fix; no automatic retry."],
  "aed.otherHarness": ["\u8BF7\u5C1D\u8BD5\u7528\u5176\u4ED6 harness \u4FEE\u590D\uFF1Adsh-fix doctor / bisect\uFF0C\u6216\u91CD\u88C5 DSH\u3002", "Please repair with another harness: dsh-fix doctor / bisect, or reinstall DSH."],
  // ---- AED 安全模式增强（v2.2.0）：临时摘除异常 bundle ----
  "aed.stripBundles": ["\u68C0\u67E5\u5E76\u4E34\u65F6\u6458\u9664\u5F02\u5E38 bundle\u2026", "Checking & temporarily removing unhealthy bundles\u2026"],
  "aed.stripNote": ["\uFF1B\u5DF2\u4E34\u65F6\u6458\u9664\u5F02\u5E38 bundle\uFF1A{list}\uFF08\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u65F6\u81EA\u52A8\u6062\u590D\uFF09", "; unhealthy bundles temporarily removed: {list} (auto-restored on exiting safe mode)"],
  "aed.stripFail": ["\uFF1Bbundle \u5065\u5EB7\u68C0\u67E5\u5931\u8D25\uFF1A{err}", "; bundle health check failed: {err}"],
  "aed.stripRestored": ["\uFF1B\u5DF2\u6062\u590D\u4E34\u65F6\u6458\u9664\u7684 bundle\uFF1A{list}", "; restored temporarily removed bundles: {list}"],
  "aed.stripRestoreFail": ["\uFF1B\u6062\u590D bundle \u6E05\u5355\u5931\u8D25\uFF1A{err}", "; failed to restore the bundle list: {err}"],
  // ---- 认证类（DSH ≥0.1.2 浏览器会话认证，v2.3.0 缓解）----
  "aed.kind.auth": ["\u672C\u6B21\u542F\u52A8\u51ED\u636E\u672A\u53D6\u5230\uFF08\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\uFF09", "Launch credential unavailable (browser-session auth)"],
  "aed.reason.auth": ["DSH 0.1.2 \u8D77 Web \u754C\u9762\u542F\u7528\u4E00\u6B21\u6027 token + cookie \u8BA4\u8BC1\uFF0C\u672C\u63D2\u4EF6\u5DF2\u9002\u914D\uFF08\u9762\u677F\u5E26 token+ob=1 \u5185\u5D4C\u3001\u8BF7\u6C42\u81EA\u52A8\u8865\u51ED\u636E\uFF09\u3002\u51FA\u73B0\u8FD9\u4E00\u6761\u901A\u5E38\u8868\u793A\u6821\u9A8C\u65F6\u8FD8\u6CA1\u62FF\u5230\u672C\u6B21\u542F\u52A8\u7684 token\uFF1A\u670D\u52A1\u7531\u63D2\u4EF6\u5916\u90E8\u62C9\u8D77\uFF0C\u6216\u521A\u91CD\u542F\u5C1A\u672A\u6253\u5370\u542F\u52A8\u94FE\u63A5\u3002", "DSH 0.1.2+ gates the Web UI with a one-time token and a cookie, and this plugin is already adapted (the panel embeds with token + ob=1, requests carry the credential). This verdict usually means the check ran before the current launch token was available: the service was started outside the plugin, or had just restarted and had not printed its launch link yet."],
  "aed.modal.openBrowser": ["\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH", "Open DSH in browser"],
  "aed.fix.auth.browser": ["\u70B9\u300C\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH\u300D\u5373\u53EF\u7528\u672C\u6B21\u542F\u52A8\u7684\u8BA4\u8BC1\u94FE\u63A5\u76F4\u63A5\u4F7F\u7528\uFF1B\u9762\u677F\u82E5\u4ECD\u8D77\u4E0D\u6765\uFF0C\u70B9\u300C\u91CD\u8FDE\u670D\u52A1\u300D\u8BA9\u63D2\u4EF6\u91CD\u65B0\u62C9\u8D77\u5E76\u6355\u83B7 token\u3002", `Use "Open DSH in browser" to work with this launch's authentication link; if the panel still will not come up, use "Reconnect service" so the plugin relaunches DSH and captures the token again.`],
  "aed.fix.auth.none": ["\u82E5\u670D\u52A1\u4E0D\u662F\u672C\u63D2\u4EF6\u62C9\u8D77\u7684\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u9875\u6838\u5BF9\u7AEF\u53E3\u4E0E\u542F\u52A8\u547D\u4EE4\uFF0C\u6216\u70B9\u300C\u91CD\u8FDE\u670D\u52A1\u300D\u7531\u63D2\u4EF6\u63A5\u7BA1\u542F\u52A8\uFF08token \u53EA\u51FA\u73B0\u5728\u5B83\u81EA\u5DF1\u7684\u542F\u52A8\u8F93\u51FA\u91CC\uFF09\u3002", 'If the service was started outside this plugin, check the port and launch command in Settings, or use "Reconnect service" so the plugin takes over launching (the token only appears in its own startup output).'],
  "aed.fix.auth.lost": ["\u6CE8\u610F\uFF1A\u5728\u7CFB\u7EDF\u6D4F\u89C8\u5668\u91CC\u4F7F\u7528 DSH \u65F6\uFF0C\u4E0E Obsidian \u9762\u677F\u8054\u52A8\u7684\u8F85\u52A9\u529F\u80FD\uFF08\u6846\u9009\u6CE8\u5165\u6865\u63A5\u3001\u8DEF\u5F84\u70B9\u51FB\u8DF3\u8F6C\uFF09\u4E0D\u8D77\u4F5C\u7528\u2014\u2014\u5B83\u4EEC\u4F9D\u8D56\u672C\u63D2\u4EF6\u7684\u9762\u677F\uFF1B\u670D\u52A1\u7BA1\u7406\u4E0E\u56DE\u5230\u9762\u677F\u540E\u7167\u5E38\u3002", "Note: in a system browser the features tied to the Obsidian panel (selection bridge, path links) do not apply \u2014 they live in this plugin; service management and returning to the panel are unaffected."],
  // ---- 卸载并重装 DSH（v2.2.0）：备份聊天记录 + 强确认 ----
  "settings.cleanup.title": ["\u5378\u8F7D\u5E76\u91CD\u88C5 DSH\uFF08\u4FDD\u7559\u804A\u5929\u8BB0\u5F55\uFF09", "Uninstall & reinstall DSH (keep chat history)"],
  "settings.cleanup.desc": ["\u5F7B\u5E95\u6E05\u7406 DSH \u76F8\u5173\u6587\u4EF6\u4E0E\u63D2\u4EF6\u6CE8\u518C\u540E\u91CD\u65B0\u4E0B\u8F7D\u5B89\u88C5\uFF1B\u804A\u5929\u8BB0\u5F55\u3001\u9644\u4EF6\u3001\u51ED\u636E\u3001\u8BBE\u7F6E\u4E0E\u6280\u80FD\u4F1A\u5907\u4EFD\u4FDD\u7559\u3002\u7834\u574F\u6027\u64CD\u4F5C\u2014\u2014\u8BF7\u5148\u5C1D\u8BD5 AED \u62A2\u6551\u6216\u8BA9 AI/\u7B2C\u4E09\u65B9 Harness \u4FEE\u590D", "Fully uninstall DSH files & plugin registrations, then reinstall. Chat history, attachments, credentials, settings and skills are backed up and kept. Destructive \u2014 try AED or an AI / third-party harness first"],
  "settings.cleanup.btn": ["\u5378\u8F7D\u5E76\u91CD\u88C5", "Uninstall & reinstall"],
  "cleanup.modal.title": ["\u5378\u8F7D\u5E76\u91CD\u88C5 DSH\uFF08\u7834\u574F\u6027\u64CD\u4F5C\uFF09", "Uninstall & reinstall DSH (destructive)"],
  "cleanup.modal.warn": ["\u5C06\u5220\u9664\uFF1ADSH \u7684\u63D2\u4EF6\u6CE8\u518C\u3001\u63D2\u4EF6\u8FD0\u884C\u6587\u4EF6\uFF08profiles / plugins / storages / cache / logs \u7B49\uFF09\u4E0E\u5168\u5C40 CLI dsh\u3002\u4F60\u7684 DSH \u63D2\u4EF6\u548C\u81EA\u5B9A\u4E49\u914D\u7F6E\u4F1A\u88AB\u6E05\u7A7A\u3002", "Will be removed: DSH plugin registrations & runtime files (profiles / plugins / storages / cache / logs etc.) and the global CLI dsh. Your DSH plugins and custom configuration will be wiped."],
  "cleanup.modal.keep": ["\u5C06\u5907\u4EFD\u5E76\u4FDD\u7559\uFF1A\u804A\u5929\u8BB0\u5F55\uFF08sessions\uFF09\u3001\u9644\u4EF6\uFF08attachments\uFF09\u3001\u51ED\u636E\uFF08.credentials.yaml\uFF09\u3001\u8BBE\u7F6E\uFF08settings.yaml\uFF09\u4E0E\u6280\u80FD\uFF08skills\uFF09\u2014\u2014\u8FD9\u4E9B\u76EE\u5F55\u4E0D\u4F1A\u88AB\u5220\u9664\u3002", "Backed up & kept: chat history (sessions), attachments, credentials (.credentials.yaml), settings (settings.yaml) and skills \u2014 these directories are NOT deleted."],
  "cleanup.modal.suggest": ["\u5EFA\u8BAE\u5148\u5C1D\u8BD5\u975E\u7834\u574F\u6027\u4FEE\u590D\uFF1A\u2460 AED \u62A2\u6551 / \u9000\u51FA\u5B89\u5168\u6A21\u5F0F \u2461 dsh-fix doctor / bisect \u2462 \u8BA9 AI \u6216\u7B2C\u4E09\u65B9 Harness \u534F\u52A9\u4FEE\u590D\u3002\u4EE5\u4E0A\u90FD\u65E0\u6CD5\u89E3\u51B3\u65F6\uFF0C\u518D\u6267\u884C\u672C\u64CD\u4F5C\u3002", "Try non-destructive repairs first: \u2460 AED recovery / exit safe mode \u2461 dsh-fix doctor / bisect \u2462 ask AI or a third-party harness. Only run this when all of those fail."],
  "cleanup.modal.backupDir": ["\u5907\u4EFD\u76EE\u5F55", "Backup directory"],
  "cleanup.modal.deleteRepo": ["\u540C\u65F6\u5220\u9664 DSH \u6E90\u7801\u4ED3\u5E93\u76EE\u5F55\uFF08{dir}\uFF0C\u9700\u91CD\u65B0\u514B\u9686\uFF0C\u8F83\u8017\u65F6\uFF09", "Also delete the DSH source repo ({dir}; requires re-cloning, slower)"],
  "cleanup.modal.confirmCheck": ["\u6211\u5DF2\u9605\u8BFB\u5E76\u7406\u89E3\uFF0C\u786E\u8BA4\u6267\u884C", "I have read and understood; proceed"],
  "cleanup.modal.confirm": ["\u5F00\u59CB\u5378\u8F7D\u5E76\u91CD\u88C5", "Start uninstall & reinstall"],
  "cleanup.step.backup": ["\u5907\u4EFD\u804A\u5929\u8BB0\u5F55\u4E0E\u914D\u7F6E\u2026", "Backing up chat history & config\u2026"],
  "cleanup.step.wipe": ["\u5378\u8F7D DSH \u76F8\u5173\u6587\u4EF6\u4E0E\u63D2\u4EF6\u6CE8\u518C\u2026", "Uninstalling DSH files & plugin registrations\u2026"],
  "cleanup.step.cli": ["\u5378\u8F7D\u5168\u5C40 CLI dsh\u2026", "Uninstalling global CLI dsh\u2026"],
  "cleanup.step.install": ["\u91CD\u65B0\u4E0B\u8F7D\u5B89\u88C5 DSH\u2026", "Re-downloading & installing DSH\u2026"],
  "cleanup.step.verify": ["\u6821\u9A8C\u542F\u52A8\u5E76\u786E\u8BA4\u804A\u5929\u8BB0\u5F55\u2026", "Verifying boot & chat history\u2026"],
  "cleanup.cliSkipped": ["\u5168\u5C40 CLI dsh \u672A\u5B89\u88C5\uFF0C\u8DF3\u8FC7\u5378\u8F7D", "Global CLI dsh not installed; skipped"],
  "cleanup.cliDone": ["\u5168\u5C40 CLI dsh \u5DF2\u5378\u8F7D", "Global CLI dsh uninstalled"],
  "cleanup.cliFail": ["\u5168\u5C40 CLI \u5378\u8F7D\u5931\u8D25\uFF1A{err}\uFF08\u91CD\u88C5\u4F1A\u91CD\u65B0\u5B89\u88C5\uFF09", "Global CLI uninstall failed: {err} (reinstall will install it again)"],
  "cleanup.repoDeleted": ["\u4ED3\u5E93\u6E90\u7801\u76EE\u5F55\u5DF2\u5220\u9664\uFF1A{dir}", "Source repo deleted: {dir}"],
  "cleanup.repoDeleteFail": ["\u4ED3\u5E93\u6E90\u7801\u76EE\u5F55\u5220\u9664\u5931\u8D25\uFF1A{err}", "Failed to delete the source repo: {err}"],
  "cleanup.done": ["\u5378\u8F7D\u91CD\u88C5\u5B8C\u6210\uFF1B\u804A\u5929\u8BB0\u5F55\u5DF2\u4FDD\u7559\uFF08{files} \u4E2A\u6587\u4EF6 / {bytes}\uFF09\u3002\u5907\u4EFD\u76EE\u5F55\uFF1A{dir}", "Reinstall complete; chat kept ({files} files / {bytes}). Backup: {dir}"],
  "cleanup.bootFail": ["\u542F\u52A8\u6821\u9A8C\u672A\u901A\u8FC7\uFF08{detail}\uFF09\uFF0C\u53EF\u518D\u8BD5 AED \u6216\u624B\u52A8\u5904\u7406", "Boot check failed ({detail}); try AED or handle manually"],
  "cleanup.fail": ["\u5378\u8F7D\u91CD\u88C5\u5931\u8D25\uFF1A{err}\u3002\u539F\u6570\u636E\u672A\u88AB\u5220\u9664\uFF08\u5907\u4EFD\u4F4D\u4E8E {dir}\uFF09", "Uninstall/reinstall failed: {err}. Original data was not deleted (backup at {dir})"],
  // ---- 报错诊断（发给 DeepSeek 会话）----
  "diag.header": ["DeepSeek Harness Obsidian \u63D2\u4EF6\u62A5\u9519\uFF0C\u8BF7\u5206\u6790\u539F\u56E0\u5E76\u7ED9\u51FA\u5177\u4F53\u89E3\u51B3\u6B65\u9AA4\uFF1A", "The DeepSeek Harness Obsidian plugin reported an error. Analyze the cause and give concrete fix steps:"],
  "diag.error": ["\u9519\u8BEF\uFF1A", "Error: "],
  "diag.hint": ["\u63D0\u793A\uFF1A", "Hint: "],
  "diag.endpoint": ["\u8FDE\u63A5\u5730\u5740\uFF1A", "Endpoint: "],
  "diag.cwd": ["\u5DE5\u4F5C\u76EE\u5F55\uFF1A", "Working directory: "],
  "diag.command": ["\u542F\u52A8\u547D\u4EE4\uFF1A", "Startup command: "],
  "notice.askAiCopied": ["\u8BCA\u65AD\u4FE1\u606F\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF1B\u5DF2\u6253\u5F00 DeepSeek \u7F51\u9875\u7248\uFF0C\u7C98\u8D34\uFF08Ctrl+V\uFF09\u540E\u53D1\u9001", "Diagnostic copied to the clipboard; DeepSeek web chat opened \u2014 paste (Ctrl+V) and send"],
  // ---- 人话化错误提示 ----
  "hz.notFound": ["\u8FD8\u6CA1\u6709\u68C0\u6D4B\u5230 DeepSeek Harness\uFF0C\u5148\u5B89\u88C5\u4E00\u6B21\u5427\u3002", "DeepSeek Harness was not detected \u2014 install it first."],
  "hz.github": ["\u8FDE\u4E0D\u4E0A GitHub\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u518D\u8BD5\u3002", "Cannot reach GitHub \u2014 check your network and try again."],
  "hz.exited": ["DeepSeek Harness \u542F\u52A8\u5931\u8D25\u4E86\uFF0C\u8BF7\u91CD\u65B0\u5B89\u88C5\u6216\u68C0\u67E5\u8BBE\u7F6E\u3002", "DeepSeek Harness failed to start \u2014 reinstall it or check the settings."],
  "hz.timeout": ["DeepSeek Harness \u542F\u52A8\u6709\u70B9\u6162\uFF0C\u7B49\u4E00\u4F1A\u513F\u518D\u8BD5\u8BD5\u3002", "DeepSeek Harness is starting slowly \u2014 try again in a moment."],
  "hz.noAuto": ["\u670D\u52A1\u6CA1\u6709\u8FD0\u884C\uFF0C\u4E14\u5DF2\u5173\u95ED\u81EA\u52A8\u542F\u52A8\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u91CC\u6253\u5F00\u3002", "The service is not running and auto-start is off \u2014 enable it in Settings."],
  // ---- 命令 / 菜单 / 浮动按钮 / 对话框 ----
  "cmd.ribbon": ["\u6253\u5F00 DeepSeek Harness", "Open DeepSeek Harness"],
  "cmd.openPanel": ["\u6253\u5F00\u9762\u677F", "Open panel"],
  "cmd.sendSelection": ["\u53D1\u9001\u9009\u4E2D\u6587\u5B57\u5230 DSH", "Send selection to DSH"],
  "menu.sendSelection": ["\u53D1\u9001\u9009\u4E2D\u6587\u5B57\u5230 DSH", "Send selection to DSH"],
  "modal.cancel": ["\u53D6\u6D88", "Cancel"],
  "modal.installTitle": ["\u5B89\u88C5 DeepSeek Harness", "Install DeepSeek Harness"],
  "modal.installDesc": ["\u9009\u62E9 DeepSeek Harness \u7684\u5B89\u88C5\u76EE\u5F55\u3002\u5C06\u81EA\u52A8\u5B8C\u6210\uFF1A\u2460\u7F3A\u5931\u7684 git / Node.js / pnpm \u4E00\u952E\u5B89\u88C5 \u2461\u514B\u9686 DSH \u5B98\u65B9\u4ED3\u5E93 \u2462\u5B89\u88C5\u4F9D\u8D56\u5E76\u6784\u5EFA\uFF08pnpm run build\uFF09\u2463\u5168\u5C40\u5B89\u88C5 DSH \u547D\u4EE4\u884C\u5DE5\u5177 dsh\uFF08npm i -g @deepseek-ai/dsh@latest\uFF09\u3002\u5DF2\u6709 DSH \u4F46\u7F3A\u4F9D\u8D56/CLI \u4E5F\u4F1A\u81EA\u52A8\u8865\u9F50\u3002\u5168\u7A0B\u65E0\u9700\u547D\u4EE4\u884C\u3002", "Choose where to install DeepSeek Harness. It will: \u2460 install missing git / Node.js / pnpm \u2461 clone the official DSH repo \u2462 install dependencies and build (pnpm run build) \u2463 install the global DSH CLI (npm i -g @deepseek-ai/dsh@latest). If DSH already exists but tools/CLI are missing, they are filled in automatically. No command line needed."],
  "modal.installStart": ["\u5F00\u59CB\u5B89\u88C5", "Start install"],
  "modal.installProgressTitle": ["\u4E00\u952E\u914D\u7F6E DSH", "Configure DSH"],
  "modal.installProgressDesc": ["\u6B63\u5728\u68C0\u6D4B\u4E0E\u5B89\u88C5\u4F9D\u8D56\u3001\u514B\u9686\u4ED3\u5E93\u3001\u6784\u5EFA\u5E76\u914D\u7F6E\u5168\u5C40 CLI\u2026", "Checking and installing dependencies, cloning the repo, building, and setting up the global CLI\u2026"],
  "modal.updateTitle": ["\u53D1\u73B0 DSH \u65B0\u7248\u672C", "DSH update available"],
  "modal.updateBody": ["{msg} \u662F\u5426\u7ACB\u5373\u66F4\u65B0\uFF1F\uFF08\u5FEB\u8FDB\u5F0F\u66F4\u65B0\uFF0C\u4E0D\u5F71\u54CD\u672C\u5730\u672A\u63D0\u4EA4\u6539\u52A8\uFF09", "{msg} Update now? (Fast-forward; local uncommitted changes are untouched)"],
  // v2.8.8 用户定案：更新弹窗只陈述「非正式版」事实，删除劝退句（有风险/不稳定/可能崩溃/建议等正式版一类措辞一律不出现）
  "modal.updatePrereleaseTitle": ["\u53D1\u73B0 DSH \u9884\u89C8\u7248\uFF08\u975E\u6B63\u5F0F\u7248\uFF09", "DSH prerelease available (not a stable release)"],
  "modal.updatePrereleaseBody": ["{msg}\u3002\u662F\u5426\u66F4\u65B0\uFF1F", "{msg}. Update now?"],
  "modal.updateConfirm": ["\u7ACB\u5373\u66F4\u65B0", "Update now"],
  "modal.authDanger": ["\u26A0 \u76EE\u6807\u7248\u672C\uFF080.1.2\u20130.1.4\uFF09\u4E0E\u63D2\u4EF6\u5DF2\u77E5\u4E0D\u517C\u5BB9\uFF1A\u5185\u5D4C\u9762\u677F\u7684\u804A\u5929\u8BB0\u5F55\u65E0\u6CD5\u663E\u793A\u3001\u8F93\u5165\u6846\u4E0D\u53EF\u7528\u3002\u8BF7\u66F4\u65B0\u5230\u5B9E\u6D4B\u9002\u914D\u533A\u95F4\uFF08{range}\uFF09\u5185\u7684\u7248\u672C\uFF0C\u6216\u4FDD\u6301\u5F53\u524D 0.1.1 \u7CFB\u3002", "\u26A0 The target version (0.1.2\u20130.1.4) is known to be incompatible with this plugin: the embedded panel cannot show chat history and the composer is unusable. Please update to a version inside the verified range ({range}), or stay on the 0.1.1 line."],
  "modal.updateKillNote": ["\u26A0 \u66F4\u65B0\u524D\u4F1A\u7ED3\u675F\u6240\u6709 DSH \u8FDB\u7A0B\uFF08\u542B\u5F53\u524D\u9762\u677F\u4E0E\u540E\u53F0\u670D\u52A1\uFF09\uFF0C\u968F\u540E\u81EA\u52A8\u91CD\u542F\u5E76\u6309\u65B0\u8BA4\u8BC1\u51ED\u8BC1\u91CD\u8F7D\u9762\u677F\u3002\u4F1A\u8BDD\u6570\u636E\u4E0D\u53D7\u5F71\u54CD\u3002", "\u26A0 All DSH processes (including the current panel and background service) will be terminated before updating, then the service restarts and the panel reloads with the new auth credential. Session data is unaffected."],
  // v2.8.8：适配句不再写死版本号——按 judgeDshCompat 的等级选文案，区间/上界取自 compat.ts 常量（单一事实源）
  "modal.updateAdaptedNote": ["\u76EE\u6807\u7248\u672C\u5728\u63D2\u4EF6\u5B9E\u6D4B\u9002\u914D\u533A\u95F4\uFF08{range}\uFF09\u5185 \u2713\uFF0C\u53EF\u653E\u5FC3\u66F4\u65B0\u3002", "Target version is inside the plugin\u2019s verified range ({range}) \u2713 \u2014 safe to update."],
  "modal.updateNewerNote": ["\u76EE\u6807\u7248\u672C\u65B0\u4E8E\u63D2\u4EF6\u5B9E\u6D4B\u9002\u914D\u4E0A\u754C\uFF08{max}\uFF0C\u5F53\u524D\u533A\u95F4 {range}\uFF09\uFF1A\u6C99\u76D2\u5C1A\u672A\u767B\u8BB0\u5B9E\u6D4B\u3002\u66F4\u65B0\u540E\u63D2\u4EF6\u5F00\u673A\u4F1A\u81EA\u52A8\u8DD1\u4E00\u6B21\u53EA\u8BFB\u89E6\u70B9\u81EA\u68C0\uFF0C\u7ED3\u8BBA\u8FFD\u52A0\u5728\u8BBE\u7F6E\u9875\u300C\u5F53\u524D\u9002\u914D\u72B6\u6001\u300D\u884C\uFF08\u4E0D\u5F39\u7A97\uFF09\u3002", "The target version is newer than the plugin\u2019s verified upper bound ({max}; current range {range}): no sandbox registration yet. After updating, the plugin runs one read-only seam self-check at startup and appends the verdict to the settings \u201Ccurrent compatibility\u201D row (never a dialog)."],
  "modal.updateLegacyNote": ["\u76EE\u6807\u7248\u672C\u4E3A\u65E7\u7248\uFF08\u22640.1.1\uFF09\uFF1A\u9762\u677F\u80FD\u5F00\uFF0C\u4F46\u7F3A\u5C11 0.1.5+ \u7684\u6865\u63A5\u5199\u5165\u4E0E\u8BA4\u8BC1\u9002\u914D\u524D\u63D0\uFF0C\u6846\u9009\u6CE8\u5165\u4E0E\u9762\u677F\u5185\u4E0A\u4F20\u4E0D\u53EF\u7528\u3002", "The target version is legacy (\u22640.1.1): the panel opens, but the 0.1.5+ bridge-writing and auth prerequisites are missing, so selection injection and in-panel uploads do not work."],
  "modal.updateAnyway": ["\u4ECD\u7136\u66F4\u65B0", "Update anyway"],
  "modal.updateViewChanges": ["\u67E5\u770B GitHub \u66F4\u65B0\u5185\u5BB9", "View changes on GitHub"],
  // ---- 通知 ----
  "notice.bridgeInstalled": ["DSH \u6865\u63A5\u5DF2\u5B89\u88C5\uFF0C\u91CD\u542F DSH \u670D\u52A1\u540E\u751F\u6548\uFF08\u8BBE\u7F6E\u9875\u300C\u91CD\u542F DSH \u670D\u52A1\u300D\uFF09", "DSH bridge installed; restart the DSH service to apply (Settings \u2192 Restart DSH service)"],
  "notice.bridgeRewritten": ["DSH \u66F4\u65B0\u5B8C\u6210\uFF0C\u6865\u63A5\u5DF2\u540C\u6B65\u91CD\u5199\uFF0C\u91CD\u542F DSH \u670D\u52A1\u540E\u751F\u6548\uFF08\u8BBE\u7F6E\u9875\u300C\u91CD\u542F DSH \u670D\u52A1\u300D\uFF09", "DSH updated; the bridge was rewritten to match. Restart the DSH service to apply (Settings \u2192 Restart DSH service)"],
  "notice.noOpenRemoved": ["\u68C0\u6D4B\u5230\u5F53\u524D DSH \u4E0D\u652F\u6301 --no-open\uFF0C\u5DF2\u4ECE\u542F\u52A8\u547D\u4EE4\u79FB\u9664\uFF08\u65B0\u7248 DSH \u4E0D\u518D\u81EA\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\uFF09", "The current DSH does not support --no-open; removed it from the startup command (newer DSH no longer auto-opens the browser)"],
  "notice.noOpenAdded": ["\u5DF2\u4E3A\u542F\u52A8\u547D\u4EE4\u6DFB\u52A0 --no-open\uFF08DSH \u542F\u52A8/\u91CD\u542F\u4E0D\u518D\u81EA\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\uFF09", "Added --no-open to the startup command (DSH will not auto-open the browser on start/restart)"],
  "notice.reconnected": ["\u5DF2\u91CD\u8FDE DeepSeek Harness", "Reconnected to DeepSeek Harness"],
  "notice.notRunning": ["DSH \u670D\u52A1\u672A\u8FD0\u884C\uFF0C\u8BF7\u5148\u6253\u5F00\u9762\u677F\u6216\u68C0\u67E5\u8BBE\u7F6E", "DSH service is not running; open the panel or check the settings"],
  "notice.tokenCopied": ["\u5DF2\u590D\u5236\u5E26 token \u7684\u94FE\u63A5\uFF1A\u624B\u673A\u6D4F\u89C8\u5668\u6253\u5F00\u5373\u53EF\u514D\u8BA4\u8BC1\uFF08\u94FE\u63A5\u7B49\u540C\u94A5\u5319\uFF0C\u52FF\u5916\u4F20\uFF09", "Token link copied \u2014 open it in the phone browser to sign in without the auth prompt (treat it as a key and never share it)"],
  "notice.tokenMissing": ["\u8FD8\u6CA1\u62FF\u5230\u542F\u52A8 token\uFF1A\u786E\u8BA4\u670D\u52A1\u7531\u672C\u63D2\u4EF6\u62C9\u8D77\u540E\u91CD\u8BD5\uFF1B\u6216\u5148\u70B9\u300C\u91CD\u542F\u670D\u52A1\u300D\u518D\u590D\u5236", "No launch token captured yet: make sure this plugin started the service, or restart the service and copy again"],
  "notice.tokenCopyFail": ["\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236\u542F\u52A8\u65E5\u5FD7\u91CC `dsh web:` \u5F00\u5934\u7684\u90A3\u6761\u5B8C\u6574\u94FE\u63A5\uFF1A{url}", "Copy failed \u2014 manually copy the full link that starts with `dsh web:` in the launch log: {url}"],
  "notice.selectFirst": ["\u8BF7\u5148\u6846\u9009\u8981\u53D1\u9001\u7684\u6587\u5B57", "Select some text first"],
  "notice.fillPending": ["\u5DF2\u53D1\u9001\u586B\u5165\u8BF7\u6C42\uFF0CDSH \u9875\u9762\u4ECD\u5728\u52A0\u8F7D\uFF08\u6587\u5B57\u7A0D\u540E\u51FA\u73B0\uFF09\uFF1B\u82E5\u957F\u65F6\u95F4\u672A\u51FA\u73B0\u8BF7\u91CD\u542F DSH \u670D\u52A1", "Fill requested; the DSH page is still loading (text should appear shortly). If it never appears, restart the DSH service"],
  "notice.bridgeOff": ["\u300CDSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian\u300D\u5DF2\u8BBE\u4E3A\u53D6\u6D88\uFF0C\u672A\u53D1\u9001\uFF1B\u5982\u9700\u53D1\u9001\u8BF7\u6539\u4E3A\u81EA\u52A8\u53D1\u9001\u6216\u53F3\u952E\u53D1\u9001", "Bridge is set to Off \u2014 nothing was sent; switch to Auto-send or Right-click send to use it"],
  "notice.sendNoFile": ["\u65E0\u6CD5\u5B9A\u4F4D\u5F53\u524D\u7B14\u8BB0\u6587\u4EF6\uFF0C\u672A\u53D1\u9001", "Cannot locate the active note; nothing was sent"],
  "notice.startingPanel": ["DSH \u670D\u52A1\u672A\u8FD0\u884C\uFF0C\u6B63\u5728\u6253\u5F00\u9762\u677F\u542F\u52A8\u2026", "DSH service is not running; opening the panel to start it\u2026"],
  "notice.filled": ["\u5DF2\u586B\u5165 DSH \u8F93\u5165\u6846\uFF0C\u8BF7\u786E\u8BA4\u540E\u53D1\u9001", "Filled into the DSH input; review it and send"],
  "notice.sendFailed": ["\u53D1\u9001\u5931\u8D25\uFF1A{err}", "Send failed: {err}"],
  "notice.bridgeFallback": ["DSH \u6865\u63A5\u672A\u5C31\u7EEA\uFF0C\u5DF2\u6539\u4E3A\u76F4\u63A5\u53D1\u9001\uFF08\u8BBE\u7F6E\u9875\u53EF\u67E5\u770B\u6865\u63A5\u72B6\u6001\uFF09", "DSH bridge not ready; sent directly instead (see the bridge status in Settings)"],
  "notice.restarting": ["\u6B63\u5728\u91CD\u542F DSH \u670D\u52A1\u2026", "Restarting the DSH service\u2026"],
  "notice.dshProcessesKilled": ["\u5DF2\u7ED3\u675F {n} \u4E2A DSH \u8FDB\u7A0B", "Terminated {n} DSH process(es)"],
  "notice.sessionsBackedUp": ["\u5347\u7EA7\u524D\u5DF2\u5907\u4EFD {n} \u4E2A\u4F1A\u8BDD\u6587\u4EF6\uFF08{size}\uFF09\u5230 {dir}", "Backed up {n} session files ({size}) to {dir} before upgrading"],
  "notice.sessionsBackupNone": ["\u672A\u53D1\u73B0\u4F1A\u8BDD\u76EE\u5F55\uFF0C\u8DF3\u8FC7\u5347\u7EA7\u524D\u5907\u4EFD", "No sessions directory found; skipping pre-upgrade backup"],
  "notice.sessionsBackupFail": ["\u4F1A\u8BDD\u5907\u4EFD\u5931\u8D25\uFF0C\u5DF2\u4E2D\u6B62\u5347\u7EA7\uFF1A{err}\uFF08\u53EF\u624B\u52A8\u590D\u5236 ~/.dsh/sessions \u540E\u91CD\u8BD5\uFF09", "Session backup failed; upgrade aborted: {err} (copy ~/.dsh/sessions manually and retry)"],
  "notice.sessionPrecheckOk": ["\u5347\u7EA7\u540E\u9884\u68C0\uFF1A{n} \u4E2A\u4F1A\u8BDD\u5747\u53EF\u8BFB\u53D6", "Post-upgrade check: all {n} sessions are readable"],
  "notice.sessionPrecheckWarn": ["\u5347\u7EA7\u540E\u9884\u68C0\uFF1A\u78C1\u76D8\u6709 {files} \u4E2A\u4F1A\u8BDD\uFF0C\u65B0\u7248\u4EC5\u5217\u51FA {listed} \u4E2A\u2014\u2014\u90E8\u5206\u5386\u53F2\u7684\u4F1A\u8BDD\u683C\u5F0F\u4E0E\u8BE5\u7248\u672C\u4E0D\u517C\u5BB9\uFF08\u5DF2\u5907\u4EFD\uFF0C\u53EF\u4FEE\u590D\u540E\u6062\u590D\u663E\u793A\uFF09", "Post-upgrade check: {files} sessions on disk but only {listed} listed \u2014 some history uses a session format incompatible with this version (backed up; repairable)"],
  "notice.sessionPrecheckFail": ["\u5347\u7EA7\u540E\u9884\u68C0\u5931\u8D25\uFF1A{err}\uFF08\u4E0D\u5F71\u54CD\u4F7F\u7528\uFF1B\u5982\u5386\u53F2\u7F3A\u5931\u8BF7\u67E5\u770B\u5907\u4EFD\uFF09", "Post-upgrade check failed: {err} (usage is unaffected; check the backup if history is missing)"],
  // ---- 会话格式漂移修复（v2.4.0）----
  "repair.noZstdNode": ["\u672A\u627E\u5230\u5177\u5907 zstd \u80FD\u529B\u7684 Node\uFF08\u9700\u8981 Node \u2265 22.15\uFF09\uFF1A\u8BF7\u5B89\u88C5/\u5207\u6362\u5230 Node 22 \u4EE5\u4E0A\u540E\u91CD\u8BD5", "No zstd-capable Node found (Node \u2265 22.15 required). Install or switch to Node 22+ and retry."],
  "repair.noDshInstall": ["\u672A\u627E\u5230 DSH \u5B89\u88C5\u76EE\u5F55\uFF1A\u65E0\u6CD5\u7528 DSH \u81EA\u5E26\u7684\u8FC1\u79FB\u94FE\u590D\u9A8C\u4E0E\u4FEE\u590D", "DSH installation not found: cannot validate/repair with DSH's own migration chain"],
  "repair.driverFail": ["\u4FEE\u590D\u9A71\u52A8\u5F02\u5E38\u9000\u51FA\uFF08code {code}\uFF09", "Repair driver exited unexpectedly (code {code})"],
  "repair.title": ["\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D", "Session format repair"],
  "repair.checking": ["\u6B63\u5728\u9884\u68C0\u4F1A\u8BDD\uFF08\u53EA\u8BFB\uFF09\u2026", "Checking sessions (read-only)\u2026"],
  "repair.checkDone": ["\u9884\u68C0\u5B8C\u6210\uFF1A{total} \u4E2A\u4F1A\u8BDD\uFF0C\u53EF\u8BFB {ok}\uFF0C\u4E0D\u53EF\u8BFB {broken}", "Check complete: {total} sessions, {ok} readable, {broken} unreadable"],
  "repair.checkClean": ["\u5168\u90E8 {total} \u4E2A\u4F1A\u8BDD\u5747\u53EF\u8BFB\uFF0C\u65E0\u9700\u4FEE\u590D", "All {total} sessions are readable \u2014 nothing to repair"],
  "repair.desc": ['DSH \u7248\u672C\u6F02\u79FB\u4F1A\u8BA9\u4F1A\u8BDD\u5728\u5F53\u524D\u7248\u672C\u4E0B\u4E0D\u53EF\u8BFB\uFF08\u5982 sourceEventSeqs \u5F62\u6001\u53D8\u5316\u3001\u63D2\u4EF6\u5199\u5165\u7684\u975E\u6CD5 source.form\u3001\u5B50\u4F1A\u8BDD descriptor \u7248\u672C\u3001v4 \u9000\u5F79\u7684 kind:"plugin"\u3001\u6D88\u606F\u7F3A id/role\uFF09\u3002\u4FEE\u590D\u4F1A\u5148\u5907\u4EFD\u539F\u6587\u4EF6\u3001\u6539\u5B8C\u7528 DSH \u81EA\u5E26\u7684\u683C\u5F0F\u94FE\u590D\u9A8C\uFF0C\u901A\u8FC7\u624D\u843D\u76D8\uFF1B\u683C\u5F0F\u4F4E\u4E8E\u5F53\u524D DSH \u7684\u65E7\u4F1A\u8BDD\u4E0D\u6539\u5199\uFF0C\u7531 DSH \u6253\u5F00\u65F6\u81EA\u884C\u8FC1\u79FB\u3002', `DSH version drift can make sessions unreadable on the current version (e.g. sourceEventSeqs shape changes, invalid plugin-written source.form, subagent descriptor version, the retired v4 kind:"plugin", messages missing id/role). Repair backs up each file first and validates with DSH's own format chain before writing; sessions older than the current DSH are left untouched \u2014 DSH migrates them when it opens them.`],
  // v2.7.0（A1）：0.1.7+ 的 v3 及更早会话由 DSH 自身迁移链处理，本插件只报告不改写
  "repair.deferred": ["\u5176\u4E2D {n} \u4E2A\u4F1A\u8BDD\u683C\u5F0F\u4F4E\u4E8E DSH \u5F53\u524D\u7248\u672C\uFF0C\u5C06\u5728 DSH \u6253\u5F00\u8BE5\u4F1A\u8BDD\u65F6\u81EA\u884C\u8FC1\u79FB\uFF0C\u672C\u63D2\u4EF6\u4E0D\u6539\u5199\u5176\u5185\u5BB9", "{n} sessions use an older format than the current DSH; DSH migrates them when the session is opened, and this plugin leaves them untouched"],
  "repair.danger": ["\u26A0 \u4FEE\u590D\u4F1A\u6539\u5199\u4F1A\u8BDD\u6587\u4EF6\uFF08\u6BCF\u6587\u4EF6\u5148\u590D\u5236\u5230\u5907\u4EFD\u76EE\u5F55\uFF09\u3002\u4FEE\u590D\u4E0D\u4F1A\u8BA9\u4E0D\u53EF\u51B7\u6062\u590D\u7684\u5B50\u4F1A\u8BDD\u53D8\u5F97\u53EF\u6062\u590D\uFF0C\u53EA\u662F\u8BA9\u65E5\u5FD7\u53EF\u8BFB\u3002", "\u26A0 Repair rewrites session files (each one is copied to the backup directory first). It does not make non-resumable subagent sessions resumable \u2014 it only makes the log readable."],
  "repair.btnRepair": ["\u5907\u4EFD\u5E76\u4FEE\u590D\uFF08{n} \u4E2A\uFF09", "Back up and repair ({n})"],
  "repair.btnRecheck": ["\u91CD\u65B0\u9884\u68C0", "Re-check"],
  "repair.running": ["\u6B63\u5728\u4FEE\u590D\uFF1A{done}/{total}", "Repairing: {done}/{total}"],
  "repair.done": ["\u4FEE\u590D\u5B8C\u6210\uFF1A\u6210\u529F {fixed}\uFF0C\u5931\u8D25 {errors}\uFF0C\u4ECD\u4E0D\u53EF\u8BFB {broken}", "Repair complete: {fixed} fixed, {errors} failed, {broken} still unreadable"],
  "repair.backupDir": ["\u5907\u4EFD\u76EE\u5F55\uFF1A{dir}", "Backup directory: {dir}"],
  "repair.noChange": ["\u6CA1\u6709\u9700\u8981\u4FEE\u590D\u7684\u4F1A\u8BDD", "No sessions need repair"],
  "repair.runtime": ["\u8FD0\u884C\u65F6\uFF1A{node}\uFF08{version}\uFF09\xB7 \u6821\u9A8C\u5668\uFF1ADSH {dir}", "Runtime: {node} ({version}) \xB7 validator: DSH {dir}"],
  "notice.restarted": ["DSH \u670D\u52A1\u5DF2\u91CD\u542F\uFF0C\u6865\u63A5\u5DF2\u52A0\u8F7D", "DSH service restarted; bridge loaded"],
  "notice.restartFailed": ["\u91CD\u542F\u5931\u8D25\uFF1A{msg}", "Restart failed: {msg}"],
  "notice.installing": ["\u5F00\u59CB\u5B89\u88C5 DeepSeek Harness\u2026", "Installing DeepSeek Harness\u2026"],
  "notice.installDirEmpty": ["\u5B89\u88C5\u76EE\u5F55\u4E0D\u80FD\u4E3A\u7A7A", "The install directory cannot be empty"],
  // ---- 安装器 ----
  "install.dirEmpty": ["\u5B89\u88C5\u76EE\u5F55\u4E3A\u7A7A\uFF1A\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u586B\u5199\u5B89\u88C5\u76EE\u5F55", "The install directory is empty: fill it in Settings"],
  "install.found": ["\u68C0\u6D4B\u5230\u5DF2\u5B89\u88C5\u7684 DSH \u4ED3\u5E93\uFF1A{dir}", "Found an existing DSH repo: {dir}"],
  "install.notDsh": ["\u76EE\u5F55\u5DF2\u5B58\u5728\u4F46\u4E0D\u662F DSH \u4ED3\u5E93\uFF1A{dir}\u3002\u4E3A\u907F\u514D\u8986\u76D6\u6570\u636E\uFF0C\u8BF7\u66F4\u6362\u5B89\u88C5\u76EE\u5F55\u6216\u624B\u52A8\u5904\u7406", "The directory exists but is not a DSH repo: {dir}. To avoid overwriting data, choose another directory or handle it manually"],
  "install.downloading": ["\u6B63\u5728\u4E0B\u8F7D DeepSeek Harness\u2026", "Downloading DeepSeek Harness\u2026"],
  "install.mirrorRetry": ["\u5B98\u65B9\u6E90\u4E0B\u8F7D\u5931\u8D25\uFF0C\u6B63\u5728\u901A\u8FC7\u955C\u50CF\u91CD\u8BD5\uFF08\u7B2C {n} \u6B21\uFF09\u2026", "Official source failed; retrying via mirror ({n})\u2026"],
  "install.cloneFailed": ["\u514B\u9686\u5931\u8D25\uFF1A{err}\u3002\u5DF2\u81EA\u52A8\u91CD\u8BD5\u5B98\u65B9\u6E90\u4E0E gh-proxy.com \u955C\u50CF\uFF1B\u4ECD\u5931\u8D25\u65F6\u53EF\u5728\u8BBE\u7F6E\u4E2D\u66F4\u6362\u5B89\u88C5\u5730\u5740\u6216\u7A0D\u540E\u518D\u8BD5", "Clone failed: {err}. The official source and gh-proxy.com mirror were retried automatically; if it still fails, change the install URL in Settings or try again later"],
  "install.depsInstalling": ["\u6B63\u5728\u5B89\u88C5\u4F9D\u8D56\uFF08\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\uFF09\u2026", "Installing dependencies (may take a few minutes)\u2026"],
  "install.depsMirror": ["\u4F9D\u8D56\u6E90\u8BBF\u95EE\u5931\u8D25\uFF0C\u6539\u7528\u56FD\u5185\u955C\u50CF\u6E90\u91CD\u8BD5\u2026", "Dependency source unreachable; retrying with a mirror\u2026"],
  "install.depsNoteFail": ["\uFF1B\u4F9D\u8D56\u5B89\u88C5\u672A\u5B8C\u6210\uFF08{err}\uFF09\uFF0C\u53EF\u7A0D\u540E\u5728 {dir} \u4E0B\u6267\u884C pnpm install", "; dependencies not fully installed ({err}) \u2014 run pnpm install in {dir} later"],
  "install.depsNoteNoPnpm": ["\uFF1B\u672A\u68C0\u6D4B\u5230 pnpm\uFF0C\u8BF7\u5B89\u88C5 pnpm \u540E\u5728\u4ED3\u5E93\u76EE\u5F55\u6267\u884C pnpm install", "; pnpm not found \u2014 install pnpm and run pnpm install in the repo directory"],
  "install.done": ["\u5B89\u88C5\u5B8C\u6210", "Done"],
  "install.buildStep": ["\u6B63\u5728\u6784\u5EFA DSH \u4ED3\u5E93\uFF08pnpm run build\uFF0C\u9996\u6B21\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\uFF09\u2026", "Building the DSH repo (pnpm run build; the first run may take a few minutes)\u2026"],
  "install.buildFail": ["DSH \u4ED3\u5E93\u5DF2\u4E0B\u8F7D\u5E76\u5B89\u88C5\u4F9D\u8D56\uFF0C\u4F46\u6784\u5EFA\u5931\u8D25\uFF1A{err}\u3002\u8BF7\u7A0D\u540E\u5728 {dir} \u4E0B\u624B\u52A8\u6267\u884C pnpm run build\uFF0C\u6216\u91CD\u8BD5\u5B89\u88C5", "Repo downloaded and dependencies installed, but the build failed: {err}. Run pnpm run build in {dir} later, or retry the install"],
  "install.message": ["DSH \u5DF2\u5B89\u88C5\uFF1A{dir}{note}", "DSH installed: {dir}{note}"],
  "install.cliInstalling": ["\u6B63\u5728\u5B89\u88C5 DSH \u5168\u5C40 CLI\u2026", "Installing the DSH global CLI\u2026"],
  "install.cliUpgrading": ["\u68C0\u6D4B\u5230\u5DF2\u77E5\u4E0D\u517C\u5BB9\u7684 DSH {v}\uFF0C\u6B63\u5728\u5347\u7EA7\u5230\u6700\u65B0\u53EF\u7528\u7248\u672C\u2026", "Known-incompatible DSH {v} detected; upgrading to the latest usable version\u2026"],
  "install.cliDone": ["\uFF1B\u5168\u5C40 CLI dsh \u5DF2\u5C31\u7EEA\uFF08{v}\uFF0C\u53EF\u7528 dsh web \u542F\u52A8\uFF09", '; global CLI dsh is ready ({v}; start with "dsh web")'],
  "install.cliFail": ["\uFF1B\u5168\u5C40 CLI \u5B89\u88C5\u5931\u8D25\uFF1A{err}\uFF08\u53EF\u7A0D\u540E\u6267\u884C npm i -g @deepseek-ai/dsh@{v}\uFF09", "; global CLI install failed: {err} (run npm i -g @deepseek-ai/dsh@{v} later)"],
  "install.autoDep": ["\u6B63\u5728\u4E00\u952E\u5B89\u88C5\u7F3A\u5931\u4F9D\u8D56 {dep}\u2026", "Installing missing dependency {dep}\u2026"],
  "install.depStillMissing": ["\u4F9D\u8D56 {dep} \u5B89\u88C5\u540E\u4ECD\u4E0D\u53EF\u7528\uFF0C\u8BF7\u624B\u52A8\u5B89\u88C5\u540E\u91CD\u8BD5", "{dep} is still unavailable after installation \u2014 install it manually and retry"],
  "dep.git.installed": ["git \u5DF2\u5B89\u88C5\u3002\u65E0\u9700\u91CD\u542F\uFF0C\u53EF\u7EE7\u7EED\u4E0B\u4E00\u6B65", "git is installed. No restart needed \u2014 continue"],
  "dep.git.fail": ["git \u5B89\u88C5\u5931\u8D25\uFF1A{err}\u3002\u53EF\u624B\u52A8\u5230 git-scm.com \u4E0B\u8F7D\u5B89\u88C5", "git install failed: {err}. Install it manually from git-scm.com"],
  "dep.node.installed": ["Node.js \u5DF2\u5B89\u88C5\u3002\u65E0\u9700\u91CD\u542F\uFF0C\u53EF\u7EE7\u7EED\u4E0B\u4E00\u6B65", "Node.js is installed. No restart needed \u2014 continue"],
  "dep.node.fail": ["Node.js \u5B89\u88C5\u5931\u8D25\uFF1A{err}\u3002\u53EF\u624B\u52A8\u5230 nodejs.org \u4E0B\u8F7D\u5B89\u88C5", "Node.js install failed: {err}. Install it manually from nodejs.org"],
  "dep.pnpm.installed": ["pnpm \u5DF2\u5B89\u88C5\u3002\u65E0\u9700\u91CD\u542F\uFF0C\u53EF\u7EE7\u7EED\u4E0B\u4E00\u6B65", "pnpm is installed. No restart needed \u2014 continue"],
  "dep.pnpm.fail": ["pnpm \u5B89\u88C5\u5931\u8D25\uFF1A{err}\u3002\u53EF\u624B\u52A8\u6267\u884C winget install pnpm.pnpm \u6216 npm install -g pnpm", "pnpm install failed: {err}. Run winget install pnpm.pnpm or npm install -g pnpm manually"],
  "dep.brew.installed": ["{dep} \u5DF2\u5B89\u88C5\uFF08brew\uFF09\u3002\u65E0\u9700\u91CD\u542F\uFF0C\u53EF\u7EE7\u7EED\u4E0B\u4E00\u6B65", "{dep} installed (brew). No restart needed \u2014 continue"],
  "dep.brew.fail": ["{dep} \u5B89\u88C5\u5931\u8D25\uFF1A{err}\u3002\u53EF\u624B\u52A8\u6267\u884C brew install {formula}\uFF08\u9700\u5148\u5B89\u88C5 Homebrew\uFF09", "{dep} install failed: {err}. Run brew install {formula} manually (Homebrew required)"],
  "dep.manual": ["\u8BF7\u624B\u52A8\u5B89\u88C5\u4F9D\u8D56\uFF1A{hint}", "Install the dependency manually: {hint}"],
  "install.depMirror": ["winget \u5931\u8D25\uFF0C\u6539\u7528 npmmirror \u955C\u50CF\u4E0B\u8F7D\u5B89\u88C5\u2026", "winget failed; downloading via npmmirror mirror\u2026"],
  "install.depMirrorFail": ["npmmirror \u955C\u50CF\u4E0B\u8F7D/\u5B89\u88C5\u5931\u8D25\uFF1A{err}", "npmmirror mirror download/install failed: {err}"],
  "dep.noWinget": ["\u7CFB\u7EDF\u7F3A\u5C11 winget\uFF08App Installer \u672A\u5B89\u88C5/\u635F\u574F\uFF09\uFF0C\u5DF2\u6539\u7528\u955C\u50CF\u4E0B\u8F7D", "winget (App Installer) is missing/broken; falling back to the mirror"],
  "dep.git.installedMirror": ["git \u5DF2\u5B89\u88C5\uFF08npmmirror \u955C\u50CF\uFF09\u3002\u65E0\u9700\u91CD\u542F", "git installed (npmmirror mirror). No restart needed"],
  "dep.node.installedMirror": ["Node.js \u5DF2\u5B89\u88C5\uFF08npmmirror \u955C\u50CF\uFF09\u3002\u65E0\u9700\u91CD\u542F", "Node.js installed (npmmirror mirror). No restart needed"],
  "dep.hint.node": ["\u8BF7\u5230 nodejs.org \u4E0B\u8F7D\u5B89\u88C5 Node.js", "Download Node.js from nodejs.org"],
  "dep.hint.pnpm": ["\u5148\u5B89\u88C5 Node.js\uFF0C\u518D\u6267\u884C npm install -g pnpm", "Install Node.js first, then run npm install -g pnpm"],
  // ---- 服务管理器 ----
  "svc.offlineNoAuto": ["{addr} \u65E0\u670D\u52A1\uFF0C\u4E14\u5DF2\u5173\u95ED\u81EA\u52A8\u542F\u52A8\uFF08\u8BBE\u7F6E\u91CC\u53EF\u6253\u5F00\uFF09", "No service on {addr} and auto-start is off (enable it in Settings)"],
  "svc.stopped": ["DSH \u670D\u52A1\u5DF2\u505C\u6B62\uFF08\u8FDB\u7A0B\u9000\u51FA\uFF0C\u6216 {addr} \u65E0\u54CD\u5E94\uFF09", "DSH service stopped (process exited or {addr} not responding)"],
  "svc.offline": ["{addr} \u65E0\u670D\u52A1", "No service on {addr}"],
  "svc.portOwnedByExternal": ["\u7AEF\u53E3 {port} \u88AB\u672C\u63D2\u4EF6\u4E4B\u5916\u7684 DSH \u5B9E\u4F8B\u5360\u7528\uFF08\u5982\u684C\u9762\u7248\uFF09\uFF0C\u63D2\u4EF6\u4E0D\u4F1A\u7EC8\u6B62\u5B83\u2014\u2014\u8BF7\u4E3A\u672C\u9762\u677F\u6539\u7528\u5176\u5B83\u7AEF\u53E3\uFF0C\u6216\u5148\u81EA\u884C\u9000\u51FA\u8BE5\u5B9E\u4F8B", "Port {port} is held by a DSH instance outside this plugin (e.g. the desktop app); the plugin will not kill it \u2014 point the panel to another port, or stop that instance yourself"],
  "notice.profileCreated": ["\u5DF2\u521B\u5EFA DSH profile\u300C{profile}\u300D\uFF08\u57FA\u4E8E web \u6A21\u677F\uFF09", 'Created DSH profile "{profile}" from the web template'],
  "notice.profileCreateFail": ["\u521B\u5EFA profile\u300C{profile}\u300D\u5931\u8D25\uFF1A{err}", 'Failed to create profile "{profile}": {err}'],
  "notice.profileSwitched": ["\u6865\u63A5\u5DF2\u88C5\u5165 profile\u300C{profile}\u300D\uFF0C\u91CD\u542F DSH \u670D\u52A1\u540E\u751F\u6548\uFF08\u8BBE\u7F6E\u9875 \u2192 \u5FEB\u6377\u64CD\u4F5C \u2192 \u91CD\u542F DSH \u670D\u52A1\uFF09", 'Bridge installed into profile "{profile}" \u2014 restart the DSH service to load it (Settings \u2192 Quick actions \u2192 Restart DSH service)'],
  "notice.killAllForUpgrade": ["\u5347\u7EA7/\u91CD\u88C5\u5C06\u7ED3\u675F\u672C\u673A\u5168\u90E8 DSH \u5B9E\u4F8B\uFF08\u542B\u684C\u9762\u7248\u7B49\u5176\u4ED6\u7A97\u53E3\uFF09\uFF0C\u5B8C\u6210\u540E\u9700\u5404\u81EA\u91CD\u5F00", "Upgrading/reinstalling will stop ALL local DSH instances (including other apps such as the desktop version); restart them afterwards"],
  "restart.foreignTitle": ["\u7AEF\u53E3\u5360\u7528\u8005\u4E0D\u662F\u672C\u63D2\u4EF6\u62C9\u8D77\u7684\u5B9E\u4F8B", "The port owner is not an instance launched by this plugin"],
  "restart.foreignBody": ["\u7AEF\u53E3 {port} \u4E0A\u7684 DSH \u670D\u52A1\u5E76\u975E\u7531\u672C\u63D2\u4EF6\u62C9\u8D77\uFF08\u53EF\u80FD\u662F\u684C\u9762\u7248\u5B9E\u4F8B\uFF0C\u6216\u5347\u7EA7\u63D2\u4EF6\u524D\u7684\u65E7\u5E38\u9A7B\u8FDB\u7A0B\uFF09\u3002\u91CD\u542F\u9700\u8981\u7EC8\u6B62\u5B83\u2014\u2014\u786E\u8BA4\u7EE7\u7EED\uFF1F", "The DSH service on port {port} was not launched by this plugin (possibly the desktop app, or a pre-upgrade resident process). Restarting requires terminating it \u2014 continue?"],
  "restart.foreignConfirm": ["\u7EC8\u6B62\u5E76\u91CD\u542F", "Terminate and restart"],
  "svc.ensureOffline": ["{addr} \u65E0\u670D\u52A1\uFF0C\u4E14\u5DF2\u5173\u95ED\u81EA\u52A8\u542F\u52A8", "No service on {addr} and auto-start is off"],
  "svc.unloaded": ["\u63D2\u4EF6\u5DF2\u5378\u8F7D", "Plugin unloaded"],
  "svc.startFailed": ["\u542F\u52A8\u5931\u8D25\uFF1A{err}", "Start failed: {err}"],
  "svc.timeout": ["\u7B49\u5F85\u670D\u52A1\u5C31\u7EEA\u8D85\u65F6\uFF08{sec} \u79D2\uFF09\uFF1B\u8BF7\u68C0\u67E5\u542F\u52A8\u547D\u4EE4\u662F\u5426\u6B63\u786E", "Timed out waiting for the service ({sec}s); check the startup command"],
  "svc.noCommand": ["\u8BF7\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u914D\u7F6E DSH \u542F\u52A8\u547D\u4EE4", "Configure the DSH startup command in the plugin settings"],
  "svc.spawnENOENT": ["\u591A\u534A\u662F DSH \u547D\u4EE4\u884C\u5DE5\u5177\u4E0D\u5728 PATH \u4E0A\uFF08\u672A\u5B89\u88C5\uFF0C\u6216\u8FDB\u7A0B PATH \u672A\u5237\u65B0\uFF09\uFF1A\u70B9\u300C\u4E00\u952E\u5B89\u88C5 DSH\u300D\uFF0C\u6216\u628A\u542F\u52A8\u547D\u4EE4\u6539\u4E3A\u5305\u88C5\u811A\u672C\uFF08\u811A\u672C\u9996\u884C export PATH=\u2026\uFF09\u3002\u6CE8\u610F npm/pnpm/dsh \u7684\u7EDD\u5BF9\u8DEF\u5F84\u901A\u5E38\u65E0\u6548\u2014\u2014\u5B83\u4EEC\u7684 shebang \u4ECD\u9700\u8981 PATH \u91CC\u7684 node", "Most likely the DSH CLI is not on PATH (not installed, or the process PATH was not refreshed): use one-click install, or point the startup command at a wrapper script that exports PATH. Note that an absolute path to npm/pnpm/dsh usually does not help \u2014 their shebang still needs node on PATH"],
  // macOS 专属：Dock/访达启动的进程只继承 launchd 最小 PATH，重启 Obsidian 无效（与登录 shell 的 PATH 无关）
  "svc.spawnENOENT.mac": ['macOS \u4ECE Dock/\u8BBF\u8FBE\u542F\u52A8\u7684\u5E94\u7528\u53EA\u7EE7\u627F\u7CFB\u7EDF\u6700\u5C0F PATH\uFF08/usr/bin:/bin:/usr/sbin:/sbin\uFF09\uFF0C\u4E0D\u542B Homebrew \u4E0E nvm \u5B89\u88C5\u76EE\u5F55\uFF0C\u91CD\u542F Obsidian \u4E5F\u4E0D\u4F1A\u6539\u53D8\u8FD9\u4E00\u70B9\u3002\u63D2\u4EF6\u5DF2\u81EA\u52A8\u5408\u5E76\u5E38\u89C1\u5DE5\u5177\u76EE\u5F55\uFF08brew/nvm/volta/pnpm \u7B49\uFF09\uFF1B\u82E5\u4ECD\u5931\u8D25\uFF0C\u8BF7\u628A\u542F\u52A8\u547D\u4EE4\u6539\u4E3A\u5305\u88C5\u811A\u672C\uFF08\u811A\u672C\u9996\u884C export PATH="/opt/homebrew/bin:$PATH"\uFF09\uFF0C\u6216\u628A DSH \u88C5\u5230\u63D2\u4EF6\u53EF\u8BC6\u522B\u7684\u76EE\u5F55\uFF08\u5982 /opt/homebrew \u4E0B\u7684\u5168\u5C40 CLI\uFF09', "Apps launched from the Dock/Finder inherit macOS\u2019s minimal PATH (/usr/bin:/bin:/usr/sbin:/sbin) without Homebrew or nvm install directories, and restarting Obsidian does not change that. The plugin already merges common tool directories (brew/nvm/volta/pnpm \u2026); if it still fails, point the startup command at a wrapper script that exports PATH, or install DSH where the plugin can find it (e.g. the global CLI under /opt/homebrew)"],
  "svc.spawnDenied": ["\u7CFB\u7EDF\u62D2\u7EDD\u542F\u52A8\u8FDB\u7A0B\uFF08\u6743\u9650\u4E0D\u8DB3\u6216\u88AB\u5B89\u5168\u8F6F\u4EF6\u62E6\u622A\uFF09\uFF1A\u8BF7\u628A\u542F\u52A8\u547D\u4EE4\u52A0\u5165\u767D\u540D\u5355\uFF0C\u6216\u4EE5\u6B63\u5E38\u6743\u9650\u91CD\u8BD5", "The OS refused to spawn the process (permission denied or blocked by security software): allow the command or retry with normal privileges"],
  "svc.exited": ["\u8FDB\u7A0B\u5DF2\u9000\u51FA\uFF08\u4EE3\u7801 {code}\uFF09\uFF1B\u8BF7\u68C0\u67E5\u542F\u52A8\u547D\u4EE4\u4E0E\u5DE5\u4F5C\u76EE\u5F55", "Process exited (code {code}); check the startup command and working directory"],
  // ---- 更新器 ----
  "up.noRepo": ["\u672A\u627E\u5230 DSH \u4ED3\u5E93\uFF08\u7F3A\u5C11 .git\uFF09\uFF1A\u8BF7\u5148\u300C\u4E00\u952E\u68C0\u6D4B\u914D\u7F6E\u300D\u6216\u300C\u4E00\u952E\u5B89\u88C5\u300D\u586B\u5145\u5DE5\u4F5C\u76EE\u5F55", 'DSH repo not found (no .git): run "Detect & fill" or "Install" first to set the working directory'],
  "up.noLocal": ["\u65E0\u6CD5\u8BFB\u53D6\u672C\u5730\u7248\u672C", "Cannot read the local version"],
  "up.githubFail": ["\u65E0\u6CD5\u8FDE\u63A5 GitHub\uFF08git ls-remote\uFF09\uFF1A{err}\uFF1B\u8BF7\u786E\u8BA4\u7F51\u7EDC\u4E0E git \u53EF\u7528", "Cannot reach GitHub (git ls-remote): {err}; check that the network and git are available"],
  // v2.8.11：缺 git 与「连不上 GitHub」必须分开报（macOS GUI 下 PATH 里没有 brew/nvm 目录，真因是找不到 git）
  "up.gitMissing": ["\u672A\u627E\u5230 git\uFF08\u65E0\u6CD5\u6267\u884C git ls-remote\uFF09\uFF1A\u8BF7\u5148\u5B89\u88C5 git\uFF1B\u82E5\u5DF2\u5B89\u88C5\uFF0C\u6CE8\u610F macOS \u4ECE Dock/\u8BBF\u8FBE\u542F\u52A8\u7684\u5E94\u7528\u53EA\u7EE7\u627F\u7CFB\u7EDF\u6700\u5C0F PATH\uFF08\u63D2\u4EF6\u5DF2\u81EA\u52A8\u5408\u5E76 Homebrew/nvm \u76EE\u5F55\uFF09", "git not found (cannot run git ls-remote): install git first; if it is already installed, note that an app launched from the Dock/Finder only inherits macOS\u2019s minimal PATH (the plugin already merges Homebrew/nvm directories)"],
  "up.latest": ["\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF08{v}\uFF09\uFF0C\u65E0\u9700\u66F4\u65B0", "Already up to date ({v}) \u2014 no update needed"],
  "up.latestNpmOnly": ["\u4F60\u7684\u7248\u672C\u5DF2\u662F\u6700\u65B0\uFF08{v}\uFF09\u2014\u2014\u4EC5\u6309 npm \u5B98\u65B9\u63A8\u9001\u7684\u5168\u5C40 CLI \u7248\u672C\u68C0\u6D4B\uFF1BGitHub \u4ED3\u5E93\u53E6\u6709 {github}\uFF08\u9884\u89C8\uFF0C\u5C1A\u672A\u53D1\u5E03\u5230 npm\uFF0C\u4E0D\u89E6\u53D1\u81EA\u52A8\u66F4\u65B0\u63D0\u793A\uFF09", "You are up to date ({v}) \u2014 checked against the npm-published global CLI version; GitHub also has {github} (prerelease, not yet published to npm, so no update prompt is shown)"],
  // v2.9.4：更新只认 GitHub 官方 release——npm 抢先收到预发布（next 标签）时压住不提示
  "up.releaseCeiling": ["\u5B98\u65B9\u4ED3\u5E93\u6700\u65B0\u53D1\u5E03\u4E3A {tag}\uFF1Bnpm \u4E0A\u53E6\u6709\u66F4\u65B0\u7684 {remote}\uFF08\u5B98\u65B9\u5C1A\u672A\u53D1\u5E03\uFF0C\u6309\u5B98\u65B9\u53D1\u5E03\u8282\u594F\u6682\u4E0D\u63D0\u793A\u5347\u7EA7\uFF09\u3002\u5F53\u524D {local}", "The latest official release is {tag}; npm has a newer {remote} that has not been released officially yet, so no update prompt is shown until it is. Current {local}"],
  "up.stableOnly": ["\u6682\u65E0\u6B63\u5F0F\u7248\u53EF\u66F4\u65B0\uFF08\u5F53\u524D {v}\uFF09\uFF1B\u63D2\u4EF6\u4EC5\u5728\u5B98\u65B9\u53D1\u5E03\u6B63\u5F0F\u7248\u540E\u63A8\u9001\u5347\u7EA7", "No stable release available (current {v}); the plugin only offers updates after an official stable release"],
  "up.prereleaseBehind": ["\u68C0\u6D4B\u5230 DSH \u9884\u89C8\u7248\uFF08\u975E\u6B63\u5F0F\u7248\uFF09 {remote}\uFF08\u5F53\u524D {local}\uFF09", "Detected DSH prerelease (not a stable release) {remote} (current {local})"],
  "up.repoOnlyHint": ["\uFF1B\u4ED3\u5E93\u6E90\u7801\u5DF2\u66F4\u65B0\uFF0C\u4F46\u8FD0\u884C\u4E2D\u7684\u670D\u52A1\u7531\u5168\u5C40 CLI \u542F\u52A8\uFF0C\u9700\u53E6\u884C\u5347\u7EA7\u5168\u5C40 CLI \u5E76\u91CD\u542F\u670D\u52A1\u540E\u751F\u6548", "; repo source updated, but the running service is launched by the global CLI \u2014 upgrade the global CLI and restart the service to apply"],
  "up.behind": ["GitHub \u4E0A\u6709\u65B0\u7248\u672C\uFF1A\u672C\u5730 {local}\uFF0CGitHub \u6700\u65B0 {remote}", "New version on GitHub: local {local}, latest {remote}"],
  "up.behindVer": ["GitHub \u4E0A\u6709\u65B0\u7248\u672C\uFF1A\u672C\u5730 {local}\uFF0C\u6700\u65B0 {remote}", "New version on GitHub: local {local}, latest {remote}"],
  "up.diverged": ["\u672C\u5730\u6709 {count} \u4E2A\u672A\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C\u6709\u53EF\u80FD\u662F\u4F60\u81EA\u884C\u5F00\u53D1\u7684\u63D2\u4EF6\uFF0C\u8BF7\u5728 DSH \u4E2D\u544A\u8BC9 AI \u81EA\u884C\u66F4\u65B0", "There are {count} uncommitted-to-remote local commits, possibly plugins you developed yourself \u2014 ask the AI in DSH to update on its own"],
  "up.dirty": ["\u4ED3\u5E93\u6709\u672A\u63D0\u4EA4\u6539\u52A8\uFF08{files}\uFF09\uFF0Cgit \u66F4\u65B0\u88AB\u963B\u585E\u2014\u2014\u8BF7\u5728 DSH \u4E2D\u8BA9 AI \u5148\u5904\u7406\u8FD9\u4E9B\u6539\u52A8\uFF08\u63D0\u4EA4\u6216 stash\uFF09\u540E\u518D\u66F4\u65B0", "The repo has uncommitted changes ({files}) that block the git update \u2014 ask the AI in DSH to commit or stash them first, then update"],
  "up.done": ["DSH \u5DF2\u66F4\u65B0\uFF08{dir}\uFF09\u3002\u82E5 DSH \u670D\u52A1\u6B63\u5728\u8FD0\u884C\uFF0C\u8BF7\u91CD\u542F\u670D\u52A1\u4F7F\u65B0\u7248\u672C\u751F\u6548", "DSH updated ({dir}). If the DSH service is running, restart it to apply the new version"],
  "up.fail": ["DSH \u66F4\u65B0\u5931\u8D25\uFF1A{err}\uFF08\u672C\u5730\u53EF\u80FD\u6709\u672A\u63D0\u4EA4\u6539\u52A8\u6216\u7F51\u7EDC\u95EE\u9898\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\uFF09", "DSH update failed: {err} (there may be uncommitted changes or network issues; handle it manually)"],
  "up.mirrorFail": ["\uFF1B\u955C\u50CF\u6E90\u4E5F\u5931\u8D25\uFF1A{err}", "; the mirror also failed: {err}"],
  "up.cliDone": ["DSH \u5168\u5C40 CLI \u5DF2\u66F4\u65B0\uFF08npm i -g @deepseek-ai/dsh@latest\uFF09\u3002\u8BF7\u91CD\u542F DSH \u670D\u52A1\u4F7F\u65B0\u7248\u672C\u751F\u6548", "DSH global CLI updated (npm i -g @deepseek-ai/dsh@latest). Restart the DSH service to apply"],
  "up.cliFail": ["DSH \u5168\u5C40 CLI \u66F4\u65B0\u5931\u8D25\uFF1A{err}\uFF08\u53EF\u7A0D\u540E\u624B\u52A8\u6267\u884C npm i -g @deepseek-ai/dsh@latest\uFF09", "DSH global CLI update failed: {err} (run npm i -g @deepseek-ai/dsh@latest later)"],
  "up.cliUpdatingTitle": ["\u66F4\u65B0 DSH", "Updating DSH"],
  "up.cliUpdating": ["\u6B63\u5728\u66F4\u65B0 DSH \u5168\u5C40 CLI\uFF08\u5DF2\u505C\u6B62\u670D\u52A1\u4EE5\u91CA\u653E\u6587\u4EF6\u9501\uFF09\uFF0C\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\u2026", "Updating the DSH global CLI (service stopped to release file locks); may take a few minutes\u2026"],
  "up.cliRestarting": ["DSH \u5168\u5C40 CLI \u5DF2\u66F4\u65B0\uFF0C\u6B63\u5728\u91CD\u542F\u670D\u52A1\u2026", "DSH global CLI updated; restarting the service\u2026"],
  "notice.updating": ["\u6B63\u5728\u66F4\u65B0 DSH\u2026", "Updating DSH\u2026"],
  "settings.updateMirror.title": ["\u66F4\u65B0\u955C\u50CF\u5730\u5740", "Update mirror URL"],
  "settings.updateMirror.desc": ["DSH \u66F4\u65B0\u7684\u53EA\u8BFB\u955C\u50CF\uFF1B\u7559\u7A7A\u81EA\u52A8\u7528 gh-proxy \u515C\u5E95\uFF08\u5982 https://gh-proxy.com/https://github.com/deepseek-ai/deepseek-harness.git\uFF09", "Read-only mirror for DSH updates; empty auto-falls back to gh-proxy (e.g. https://gh-proxy.com/https://github.com/deepseek-ai/deepseek-harness.git)"],
  "up.unknown": ["\u672A\u77E5", "Unknown"],
  "err.unknown": ["\u672A\u77E5\u9519\u8BEF", "unknown error"],
  "err.failed": ["\u5931\u8D25", "failed"],
  // ---- 一键检测 ----
  "detect.path": ["\u5DF2\u68C0\u6D4B\u5230 dsh\uFF08PATH \u4E2D\uFF09\uFF0C\u542F\u52A8\u547D\u4EE4\u5DF2\u8BBE\u4E3A dsh web --port {port}", "dsh found on PATH; startup command set to dsh web --port {port}"],
  "detect.notFound": ["\u672A\u68C0\u6D4B\u5230 DeepSeek Harness \u4ED3\u5E93\uFF1A\u8BF7\u5148\u4ECE github.com/deepseek-ai/deepseek-harness \u83B7\u53D6\u6E90\u7801\uFF0C\u6216\u5728\u8BBE\u7F6E\u4E2D\u624B\u52A8\u586B\u5199\u542F\u52A8\u547D\u4EE4\u4E0E\u5DE5\u4F5C\u76EE\u5F55", "No DeepSeek Harness repo detected: get the source from github.com/deepseek-ai/deepseek-harness, or fill in the startup command and working directory manually in Settings"],
  "detect.found": ["\u5DF2\u68C0\u6D4B\u5230 DSH \u4ED3\u5E93\uFF1A{dir}\uFF1B\u542F\u52A8\u547D\u4EE4\uFF1A{cmd}", "DSH repo detected: {dir}; startup command: {cmd}"],
  // ---- DSH RPC API ----
  "api.timeout": ["\u8BF7\u6C42 DSH \u8D85\u65F6\uFF08{ms}ms\uFF09", "DSH request timed out ({ms}ms)"],
  "api.notRunning": ["DSH \u670D\u52A1\u672A\u8FD0\u884C\uFF08{addr} \u62D2\u7EDD\u8FDE\u63A5\uFF09", "DSH service is not running (connection refused on {addr})"],
  "api.connectFail": ["\u65E0\u6CD5\u8FDE\u63A5 DSH\uFF1A{err}", "Cannot connect to DSH: {err}"],
  "api.httpStatus": ["DSH \u8FD4\u56DE HTTP {code}", "DSH returned HTTP {code}"],
  "api.badFormat": ["DSH \u8FD4\u56DE\u4E86\u610F\u5916\u7684\u54CD\u5E94\u683C\u5F0F", "DSH returned an unexpected response format"],
  "api.rejected": ["DSH \u62D2\u7EDD\u4E86\u8BF7\u6C42", "DSH rejected the request"],
  "api.unparsable": ["DSH \u54CD\u5E94\u65E0\u6CD5\u89E3\u6790", "Cannot parse the DSH response"],
  "api.authRequired": ["DSH \u9700\u8981\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\u4E14\u63D2\u4EF6\u672A\u80FD\u81EA\u52A8\u53D6\u5F97\u8BA4\u8BC1\u94FE\u63A5\uFF08\u670D\u52A1\u975E\u672C\u63D2\u4EF6\u62C9\u8D77\u65F6\u5E38\u89C1\uFF09\uFF1B\u53EF\u5728\u63D2\u4EF6\u8BBE\u7F6E\u300C\u91CD\u542F DSH \u670D\u52A1\u300D\u540E\u91CD\u8BD5", "DSH requires browser-session authentication but the plugin could not obtain the auth link (typical when the service was not started by the plugin); use Settings \u2192 Restart DSH service, then retry"],
  // ---- 诊断（启动耗时）----
  "settings.diag.title": ["\u8BCA\u65AD", "Diagnostics"],
  "settings.diag.startup.title": ["\u542F\u52A8\u8017\u65F6\u8BB0\u5F55", "Startup timing log"],
  "settings.diag.startup.desc": ["\u63D2\u4EF6\u52A0\u8F7D \u2192 \u670D\u52A1\u63A2\u6D4B \u2192 \u542F\u52A8 \u2192 \u9762\u677F\u5C31\u7EEA\u5404\u9636\u6BB5\u8017\u65F6\uFF08\u6700\u8FD1 5 \u6B21\uFF09", "Per-phase timings: plugin load \u2192 service probe \u2192 startup \u2192 panel ready (last 5 runs)"],
  "settings.diag.refresh": ["\u5237\u65B0", "Refresh"],
  "settings.diag.empty": ["\u6682\u65E0\u8BB0\u5F55\uFF08\u6253\u5F00\u9762\u677F\u540E\u81EA\u52A8\u91C7\u96C6\uFF09", "No records yet (collected when the panel opens)"],
  // v2.9.0：「测试连接」——只诊断、不改设置；TLS 失败按 tlsErrorKind 分别给提示，并附原始 code 便于对照 README 故障排查
  "settings.conn.title": ["\u8FDE\u63A5\u5730\u5740", "Connection address"],
  "settings.conn.test": ["\u6D4B\u8BD5\u8FDE\u63A5", "Test connection"],
  "settings.conn.testing": ["\u6D4B\u8BD5\u4E2D\u2026", "Testing\u2026"],
  "settings.conn.ok": ["\u8FDE\u63A5\u6B63\u5E38\uFF08{addr}\uFF0CHTTP {status}\uFF09", "Connection OK ({addr}, HTTP {status})"],
  "settings.conn.http": ["\u670D\u52A1\u53EF\u8FBE\u4F46\u8FD4\u56DE HTTP {status}\uFF08{addr}\uFF09\uFF1A\u5730\u5740\u6216\u534F\u8BAE\u53EF\u80FD\u4E0D\u5339\u914D\uFF0C\u6216\u9762\u677F\u9700\u8981\u8BA4\u8BC1", "Service reachable but returned HTTP {status} ({addr}): host or protocol may be off, or the panel needs auth"],
  "settings.conn.refused": ["\u8FDE\u63A5\u88AB\u62D2\u7EDD\uFF08{addr}\uFF09\uFF1A\u8BE5\u5730\u5740\u6CA1\u6709\u670D\u52A1\u5728\u76D1\u542C\u2014\u2014\u670D\u52A1\u672A\u542F\u52A8\uFF0C\u6216\u5730\u5740 / \u7AEF\u53E3\u586B\u9519", "Connection refused ({addr}): nothing is listening \u2014 the service is not running, or host/port is wrong"],
  "settings.conn.timeout": ["\u8FDE\u63A5\u8D85\u65F6\uFF08{addr}\uFF09\uFF1A\u65E0\u54CD\u5E94\uFF0C\u786E\u8BA4\u8BE5\u5730\u5740\u662F\u672C\u673A\u5DF2\u7ED1\u5B9A\u7F51\u5361\u7684\u5730\u5740", "Connection timed out ({addr}): no response \u2014 make sure the address belongs to a local interface"],
  "settings.conn.tlsUntrusted": ["TLS \u8BC1\u4E66\u672A\u53D7\u4FE1\u4EFB\uFF08{addr}\uFF0C{code}\uFF09\uFF1A\u81EA\u7B7E\u540D\u8BC1\u4E66\u9700\u5BFC\u5165\u7CFB\u7EDF\u4FE1\u4EFB\u6839\uFF0C\u5E76\u5728\u8BBE\u7F6E\u91CC\u586B\u8BC1\u4E66 PEM\uFF1B\u8BE6\u89C1 README \u6545\u969C\u6392\u67E5", "TLS certificate not trusted ({addr}, {code}): import the self-signed certificate into the OS trust store and fill in its PEM path above; see the README troubleshooting section"],
  "settings.conn.tlsAltname": ["TLS \u8BC1\u4E66\u4E0E\u5730\u5740\u4E0D\u5339\u914D\uFF08{addr}\uFF0C{code}\uFF09\uFF1A\u8BC1\u4E66 SAN \u4E0D\u542B\u8BE5\u5730\u5740\uFF0C\u8BF7\u6362\u5730\u5740\u6216\u91CD\u7B7E\u8BC1\u4E66", "TLS certificate does not match the address ({addr}, {code}): the certificate SAN lacks that address \u2014 use another host or reissue it"],
  "settings.conn.tlsExpired": ["TLS \u8BC1\u4E66\u5DF2\u8FC7\u671F\u6216\u5C1A\u672A\u751F\u6548\uFF08{addr}\uFF0C{code}\uFF09\uFF1A\u8BF7\u6362\u4E00\u5F20\u6709\u6548\u8BC1\u4E66", "TLS certificate expired or not yet valid ({addr}, {code}): replace it with a valid one"],
  "settings.conn.tlsOther": ["TLS \u63E1\u624B\u5931\u8D25\uFF08{addr}\uFF0C{code}\uFF09\uFF1A{err}", "TLS handshake failed ({addr}, {code}): {err}"],
  "settings.conn.other": ["\u8FDE\u63A5\u5931\u8D25\uFF08{addr}\uFF09\uFF1A{err}", "Connection failed ({addr}): {err}"],
  "bridge.patchMergeError": ["\u73B0\u6709\u8865\u4E01\u6587\u4EF6\u4E3A\u975E\u7A7A\u6D41\u5F0F\u6570\u7EC4\u683C\u5F0F\uFF0C\u65E0\u6CD5\u81EA\u52A8\u5408\u5E76\uFF1B\u8BF7\u624B\u52A8\u5728 {patch} \u8FFD\u52A0\u6865\u63A5\u6761\u76EE", "The existing patch file uses a non-empty flow-array format that cannot be merged automatically; add the bridge entry manually in {patch}"],
  // v2.7.0（A3）：裸包名模式下 node_modules 链接建不出来（同名实体/权限）→ 自动退回路径模式，客户端半不可用
  "bridge.packageLinkFailed": ["\u65E0\u6CD5\u5728 profile \u4E0B\u5EFA\u7ACB node_modules \u94FE\u63A5\uFF08\u540C\u540D\u6761\u76EE\u5DF2\u5B58\u5728\u6216\u6743\u9650\u53D7\u9650\uFF09\uFF0C\u672C\u6B21\u5DF2\u9000\u56DE\u8DEF\u5F84\u6A21\u5F0F\u5B89\u88C5\uFF1A\u5BA2\u6237\u7AEF\u534A\u6682\u4E0D\u53EF\u7528\uFF0C\u5176\u4F59\u529F\u80FD\u4E0D\u53D7\u5F71\u54CD", "Could not create the node_modules link inside the profile (an entry with that name already exists, or permissions blocked it); installed in path mode instead: the client half stays unavailable, everything else is unaffected"],
  // ---- 远程访问配置（v2.9.1，设置页快捷功能组 AED 之后一行）----
  "settings.mobile.title": ["\u8FDC\u7A0B\u8BBF\u95EE\u914D\u7F6E", "Remote access setup"],
  "settings.mobile.desc": ["\u4E00\u952E\u751F\u6210\u672C\u673A HTTPS \u81EA\u7B7E\u8BC1\u4E66\uFF0C\u5E76\u628A\u670D\u52A1\u5730\u5740\u3001\u534F\u8BAE\u3001\u8BC1\u4E66\u4E0E\u79C1\u94A5\u8DEF\u5F84\u586B\u597D\uFF0C\u4F9B\u540C\u4E00\u5C40\u57DF\u7F51\u5185\u7684\u624B\u673A\u3001\u5E73\u677F\u6216\u5176\u5B83\u7535\u8111\u6D4F\u89C8\u5668\u8BBF\u95EE\u672C\u673A DSH\u3002", "One click generates a local HTTPS self-signed certificate and fills in the service host, protocol, certificate and private-key paths, so phones, tablets or other computers on the same LAN can reach this machine's DSH in a browser."],
  "settings.mobile.helpLink": ["\u624B\u673A\u8FDC\u7A0B\u8BBF\u95EE\u793A\u4F8B", "Phone remote-access example"],
  "settings.mobile.btn": ["\u751F\u6210\u5E76\u586B\u5165", "Generate & fill"],
  "settings.mobile.btnBusy": ["\u751F\u6210\u4E2D\u2026", "Generating\u2026"],
  "settings.mobile.resetBtn": ["\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9", "Reset endpoint defaults"],
  // 帮助弹窗（主动点行名右侧链接才出现）：示例场景 / 前置 / 会替你做的事 / 示例步骤 / 示例结果 / 边界与风险
  "mobile.help.title": ["\u8FDC\u7A0B\u8BBF\u95EE\u914D\u7F6E \xB7 \u624B\u673A\u8FDC\u7A0B\u8BBF\u95EE\u793A\u4F8B", "Remote access setup \xB7 Phone remote-access example"],
  "mobile.help.intro": ["\u4EE5\u4E0B\u7528\u4E00\u4E2A\u5B8C\u6574\u793A\u4F8B\u8BF4\u660E\uFF1A\u5728\u5BA2\u5385\u7528\u624B\u673A\u7EE7\u7EED\u7535\u8111\u4E0A\u6B63\u5728\u8FD0\u884C\u7684 DSH \u4F1A\u8BDD\u3002\u672C\u529F\u80FD\u8D1F\u8D23\u628A\u8FDE\u63A5\u6240\u9700\u7684\u81EA\u7B7E\u8BC1\u4E66\u4E0E\u56DB\u9879\u670D\u52A1\u8BBE\u7F6E\u4E00\u6B21\u914D\u597D\uFF0C\u7535\u8111\u4E0E\u624B\u673A\u5404\u5B89\u88C5\u4E00\u6B21\u4FE1\u4EFB\u5373\u53EF\u3002", "The following example shows one complete run: continuing a DSH session running on the computer from the living room on a phone. This feature prepares the self-signed certificate and the four service settings in one go; you install trust once on the computer and once on the phone."],
  "mobile.help.sceneTitle": ["\u793A\u4F8B\u573A\u666F", "Example scenario"],
  "mobile.help.scene": ["\u5468\u672B\u665A\u4E0A\uFF0C\u4E66\u623F\u7684\u7535\u8111\u4E0A\u6B63\u8FD0\u884C\u7740\u4E00\u4E2A DSH \u4F1A\u8BDD\uFF0C\u4F60\u60F3\u6362\u5230\u5BA2\u5385\u7528\u624B\u673A\u63A5\u7740\u804A\u540C\u4E00\u6BB5\u5BF9\u8BDD\n\u624B\u673A\u4E0E\u7535\u8111\u8FDE\u540C\u4E00\u4E2A\u5BB6\u5EAD Wi-Fi\uFF0C\u7535\u8111\u4FDD\u6301\u5F00\u673A\u3001DSH \u670D\u52A1\u6301\u7EED\u8FD0\u884C", "On a weekend evening a DSH session is running on the computer in the study, and you want to continue the same conversation on your phone in the living room\nThe phone and the computer are on the same home Wi-Fi; the computer stays powered on and the DSH service keeps running"],
  "mobile.help.requires": ["\u524D\u7F6E\u8981\u6C42\uFF1ADSH \u2265 0.2.1-rc.2\uFF08\u652F\u6301 --host / --tls-cert / --tls-key\uFF09\uFF1B\u624B\u673A\u4E0E\u7535\u8111\u8FDE\u540C\u4E00\u4E2A\u5C40\u57DF\u7F51\uFF1B\u53EA\u5728\u53EF\u4FE1\u7F51\u7EDC\uFF08\u5BB6\u5EAD\u6216\u516C\u53F8\u5185\u7F51\uFF09\u4F7F\u7528\u3002", "Requirements: DSH \u2265 0.2.1-rc.2 (supports --host / --tls-cert / --tls-key); phone and computer on the same LAN; trusted networks only (home or office intranet)."],
  "mobile.help.keepAwake": ["\u793A\u4F8B\u671F\u95F4\u7535\u8111\u8981\u4FDD\u6301\u5F00\u673A\u3001DSH \u670D\u52A1\u6301\u7EED\u8FD0\u884C\uFF0C\u5E76\u907F\u514D\u7761\u7720 / \u4F11\u7720\uFF1AWindows \u53EF\u5728\u300C\u8BBE\u7F6E \u2192 \u7CFB\u7EDF \u2192 \u7535\u6E90\u548C\u7535\u6C60 \u2192 \u5C4F\u5E55\u548C\u7761\u7720\u300D\u628A\u7761\u7720\u8BBE\u4E3A\u300C\u4ECE\u4E0D\u300D\uFF0C\u5408\u76D6\u7B14\u8BB0\u672C\u8BF7\u540C\u65F6\u5173\u6389\u300C\u5408\u76D6\u7761\u7720\u300D\u6216\u5728\u5408\u76D6\u65F6\u63D2\u7535\uFF1B\u7535\u8111\u4E00\u65E6\u7761\u7720\uFF0C\u624B\u673A\u4F1A\u8FDE\u4E0D\u4E0A\u3002", 'During the example keep the computer powered on, with the DSH service running, and prevent sleep: on Windows set "Settings \u2192 System \u2192 Power & battery \u2192 Screen and sleep" to Never, and on laptops also disable "sleep when closing the lid" (or keep it plugged in with the lid closed). Once the computer sleeps, the phone cannot connect.'],
  "mobile.help.does.title": ["\u793A\u4F8B\u4E2D\u4F1A\u66FF\u4F60\u505A\u7684\u4E8B", "What the example does for you"],
  "mobile.help.does": ["\u5728\u672C\u673A\u7528\u6237\u76EE\u5F55\u751F\u6210\u81EA\u7B7E\u8BC1\u4E66\u4E0E\u79C1\u94A5\uFF08\u6709\u6548\u671F\u7EA6 825 \u5929\uFF09\n\u628A\u6839\u8BC1\u4E66 rootCA.pem \u590D\u5236\u5230\u684C\u9762\uFF0C\u4F9B\u7535\u8111\u4E0E\u624B\u673A\u5B89\u88C5\u4FE1\u4EFB\nWindows \u4E0B\u81EA\u52A8\u628A\u6839\u8BC1\u4E66\u88C5\u5165\u5F53\u524D\u7528\u6237\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF08\u514D\u7BA1\u7406\u5458\uFF1BmacOS \u9700\u624B\u52A8\uFF09\n\u586B\u5165\u670D\u52A1\u5730\u5740\uFF08\u672C\u673A\u5C40\u57DF\u7F51 IPv4\uFF09\u3001\u670D\u52A1\u534F\u8BAE\uFF08https\uFF09\u3001\u8BC1\u4E66\u8DEF\u5F84\u3001\u79C1\u94A5\u8DEF\u5F84\n\u4E0D\u4F1A\u81EA\u52A8\u91CD\u542F\u670D\u52A1\uFF1B\u4E5F\u4E0D\u4F1A\u6539\u52A8\u624B\u673A\u7684\u8BC1\u4E66\u4FE1\u4EFB", `Generates a self-signed certificate and private key in your user folder (valid for about 825 days)
Copies the root certificate rootCA.pem to the Desktop for trust installation on computer and phone
On Windows it installs the root into the current user's "Trusted Root Certification Authorities" (no admin; macOS is manual)
Fills in the service host (this machine's LAN IPv4), protocol (https), certificate path and private-key path
Does not restart the service and does not change certificate trust on the phone`],
  "mobile.help.tokenTitle": ["\u793A\u4F8B\u6B65\u9AA4", "Example steps"],
  "mobile.help.tokenFlow": ["\u5728\u7535\u8111\u4E0A\u70B9\u672C\u884C\u300C\u751F\u6210\u5E76\u586B\u5165\u300D\uFF0C\u63D2\u4EF6\u751F\u6210\u672C\u673A HTTPS \u81EA\u7B7E\u8BC1\u4E66\uFF0C\u5E76\u628A\u670D\u52A1\u5730\u5740\u3001\u534F\u8BAE\u3001\u8BC1\u4E66\u4E0E\u79C1\u94A5\u8DEF\u5F84\u4E00\u6B21\u586B\u597D\n\u628A\u684C\u9762\u7684 rootCA.pem \u88C5\u5165\u7535\u8111\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF08Windows \u81EA\u52A8\u5B8C\u6210\uFF1BmacOS \u9700\u624B\u52A8\uFF09\uFF0C\u518D\u628A\u540C\u4E00\u4E2A rootCA.pem \u4F20\u5230\u624B\u673A\u5E76\u4FE1\u4EFB\uFF08iOS \u8FD8\u8981\u5728\u300C\u8BBE\u7F6E \u2192 \u901A\u7528 \u2192 \u5173\u4E8E\u672C\u673A \u2192 \u8BC1\u4E66\u4FE1\u4EFB\u8BBE\u7F6E\u300D\u91CC\u6253\u5F00\uFF09\n\u70B9\u6210\u529F\u5F39\u7A97\u91CC\u7684\u300C\u91CD\u542F\u670D\u52A1\u5E76\u751F\u6548\u300D\uFF0C\u670D\u52A1\u6539\u4EE5\u5C40\u57DF\u7F51 https \u5730\u5740\u8FD0\u884C\n\u70B9\u672C\u63D2\u4EF6\u7684\u300C\u590D\u5236 token \u94FE\u63A5\u300D\uFF08\u8BBE\u7F6E \u2192 \u5FEB\u6377\u64CD\u4F5C\uFF09\u590D\u5236\u5B8C\u6574 token \u94FE\u63A5\uFF0C\u5F62\u5982 https://<\u672C\u673A\u5C40\u57DF\u7F51IP>:<\u7AEF\u53E3>/?token=\u2026\uFF1B\u4E5F\u53EF\u70B9\u300C\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH\u300D\uFF0C\u4F46\u8DF3\u8F6C\u540E\u5730\u5740\u680F\u4F1A\u4E22\u6389 token\uFF0C\u4E0D\u8981\u4ECE\u5730\u5740\u680F\u590D\u5236\uFF1B\u6216\u8BFB\u542F\u52A8\u65E5\u5FD7 %TEMP%\\dsh-web-out-<\u7AEF\u53E3>.log \u91CC\u4EE5 `dsh web:` \u5F00\u5934\u7684\u90A3\u4E00\u884C\n\u624B\u673A\u8FDE\u4E0E\u7535\u8111\u76F8\u540C\u7684 Wi-Fi\uFF0C\u5728\u624B\u673A\u6D4F\u89C8\u5668\u91CC\u7C98\u8D34\u521A\u624D\u590D\u5236\u7684 token \u94FE\u63A5\u6253\u5F00\ntoken \u6BCF\u6B21 DSH \u670D\u52A1\u542F\u52A8\u90FD\u4F1A\u91CD\u65B0\u751F\u6210\uFF0C\u91CD\u542F\u6216\u5347\u7EA7\u540E\u65E7\u94FE\u63A5\u5931\u6548\uFF0C\u9700\u91CD\u65B0\u590D\u5236\uFF1Btoken \u94FE\u63A5\u7B49\u540C\u4E8E\u8FD9\u53F0\u7535\u8111\u7684\u94A5\u5319\uFF0C\u4E0D\u8981\u53D1\u7ED9\u522B\u4EBA\uFF0C\u4E5F\u4E0D\u8981\u5728\u516C\u5171 Wi-Fi \u4E0B\u4F7F\u7528", 'On the computer click "Generate & fill" on this row: the plugin creates a local HTTPS self-signed certificate and fills in the service host, protocol, certificate and private-key paths in one go\nInstall the Desktop rootCA.pem into "Trusted Root Certification Authorities" on the computer (Windows does it automatically; macOS is manual), then send the same rootCA.pem to the phone and trust it (on iOS also enable it under Settings \u2192 General \u2192 About \u2192 Certificate Trust Settings)\nChoose "Restart service & apply" in the success dialog; the service then runs on the LAN https address\nClick the "Copy token link" button of this plugin (Settings \u2192 Quick actions) to copy the full token link, e.g. https://<LAN IP>:<port>/?token=\u2026 You can also use "Open DSH in browser", but the browser drops the token from the address bar after the redirect \u2014 do not copy it from there; alternatively read the line starting with `dsh web:` in the launch log %TEMP%\\dsh-web-out-<port>.log\nConnect the phone to the same Wi-Fi as the computer and paste the copied token link into the phone browser\nThe token is regenerated for every DSH process; after a restart or upgrade the old link stops working, so copy a new one. A token link is a key to this computer: never share it, and do not use it on public Wi-Fi'],
  "mobile.help.resultTitle": ["\u793A\u4F8B\u7ED3\u679C", "Example result"],
  "mobile.help.result": ["\u624B\u673A\u6D4F\u89C8\u5668\u91CC\u51FA\u73B0\u4E0E\u7535\u8111\u4E0A\u76F8\u540C\u7684 DSH \u754C\u9762\uFF0C\u53EF\u4EE5\u76F4\u63A5\u63A5\u7740\u5904\u7406\u540C\u4E00\u6BB5\u4F1A\u8BDD\n\u9996\u6B21\u6253\u5F00\u6210\u529F\u540E\u6D4F\u89C8\u5668\u4F1A\u8BB0\u4F4F\u767B\u5F55 cookie\uFF0C\u4E4B\u540E\u53EF\u7528\u4E0D\u5E26 token \u7684\u5730\u5740\u6253\u5F00", "The same DSH interface as on the computer appears in the phone browser, so you can continue the same session right away\nAfter the first successful open the browser remembers the login cookie, so the tokenless address works from then on"],
  "mobile.help.limits.title": ["\u8FB9\u754C\u4E0E\u98CE\u9669", "Limits and risks"],
  "mobile.help.limits": ["\u5185\u5D4C\u9762\u677F\u5FC5\u987B\u7531\u672C\u63D2\u4EF6\u62C9\u8D77\u7684\u670D\u52A1\u63D0\u4F9B\uFF1B\u4F60\u81EA\u5DF1\u5728\u7EC8\u7AEF\u542F\u52A8\u7684\u5B9E\u4F8B\u65E0\u6CD5\u9644\u4E0A\u5D4C\u5165 token\uFF0C\u624B\u673A\u7AEF\u53EA\u80FD\u7528\u6D4F\u89C8\u5668\u6253\u5F00\n\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\u53EA\u628A\u56DB\u9879\u8BBE\u7F6E\u6539\u56DE\uFF0C\u4E0D\u4F1A\u79FB\u9664\u7CFB\u7EDF\u6216\u624B\u673A\u4E0A\u5DF2\u5B89\u88C5\u7684\u8BC1\u4E66\u4FE1\u4EFB\n\u81EA\u5B9A\u4E49\u542F\u52A8\u547D\u4EE4\u4F1A\u88AB\u81EA\u52A8\u8865\u4E0A\u7F3A\u5931\u7684 `--host` / `--tls-*`\uFF1B\u82E5\u547D\u4EE4\u91CC\u5DF2\u5199\u6B7B `--host` \u6216 `--tls-*`\uFF0C\u751F\u6210\u4F1A\u5148\u63D0\u793A\u51B2\u7A81\uFF08\u9700\u5148\u6539\u547D\u4EE4\uFF09", "The embedded panel needs a service started by this plugin; an instance you start in a terminal cannot carry the embed token, so the phone can only use a browser\nResetting endpoint defaults only reverts the four settings; it does not remove certificate trust already installed on the computer or phone\nA custom startup command gets the missing `--host` / `--tls-*` appended; if it already pins `--host` or `--tls-*`, generation reports the conflict first (fix the command)"],
  // 预检弹窗：红色风险段 + 编号步骤；确认后才执行生成
  "mobile.intro.title": ["\u751F\u6210\u8FDC\u7A0B\u8BBF\u95EE\u914D\u7F6E\uFF1F", "Generate remote access settings?"],
  "mobile.intro.riskTitle": ["\u98CE\u9669\u63D0\u793A\uFF08\u52A1\u5FC5\u5148\u8BFB\uFF09", "Risks (please read first)"],
  "mobile.intro.risk": ["\u7ED1\u5B9A\u5C40\u57DF\u7F51\u5730\u5740\u4F1A\u628A DSH \u66B4\u9732\u7ED9\u540C\u4E00\u7F51\u6BB5\u7684\u5176\u5B83\u8BBE\u5907\nDSH \u80FD\u5728\u672C\u673A\u8BFB\u5199\u6587\u4EF6\u5E76\u6267\u884C\u547D\u4EE4\uFF0C\u6D4F\u89C8\u5668\u91CC\u7684 token \u94FE\u63A5\u7B49\u540C\u4E8E\u94A5\u5319\uFF0C\u4E0D\u8981\u5916\u4F20\n\u53EA\u5728\u5BB6\u5EAD / \u53EF\u4FE1 Wi-Fi \u4E0B\u4F7F\u7528\uFF0C\u516C\u5171\u7F51\u7EDC\u8BF7\u5148\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\n\u79C1\u94A5\u4FDD\u5B58\u5728\u672C\u673A\u7528\u6237\u76EE\u5F55\uFF0C\u4E0D\u8981\u590D\u5236\u5916\u53D1\n\u4F1A\u5728\u5F53\u524D Windows \u7528\u6237\u7684\u8BC1\u4E66\u5E93\u4E2D\u4FE1\u4EFB\u8FD9\u5F20\u81EA\u7B7E\u8BC1\u4E66\uFF08\u4EC5\u672C\u7528\u6237\uFF1B\u53EF\u5728 certmgr.msc \u5220\u9664\uFF1B\u300C\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\u300D\u4E0D\u4F1A\u64A4\u9500\uFF09\n\u4F1A\u8986\u76D6\u5F53\u524D\u300C\u670D\u52A1\u5730\u5740 / \u670D\u52A1\u534F\u8BAE / \u8BC1\u4E66 / \u79C1\u94A5\u300D\u56DB\u9879\u8BBE\u7F6E", `Binding a LAN address exposes DSH to every device on the same subnet
DSH can read and write files and run commands on this computer; a token link is a key, never share it
Use only on home / trusted Wi-Fi; on public networks reset the endpoint defaults first
The private key stays in your user folder; never copy it elsewhere
This adds the self-signed certificate to the current Windows user's trust store (this user only; removable via certmgr.msc; "Reset endpoint defaults" does not revoke it)
This overwrites the current service host, protocol, certificate and private-key settings`],
  "mobile.intro.stepsTitle": ["\u5C06\u6267\u884C\u7684\u6B65\u9AA4", "What will happen"],
  "mobile.intro.steps": ["\u68C0\u6D4B\u672C\u673A\u5C40\u57DF\u7F51 IPv4\uFF08\u627E\u4E0D\u5230\u5C31\u62A5\u9519\uFF0C\u4E0D\u5199\u4EFB\u4F55\u8BBE\u7F6E\uFF09\n\u751F\u6210\u81EA\u7B7E\u8BC1\u4E66\u4E0E\u79C1\u94A5\u5230\u672C\u673A\u7528\u6237\u76EE\u5F55\uFF0C\u5E76\u628A rootCA.pem \u590D\u5236\u5230\u684C\u9762\nWindows \u4E0B\u81EA\u52A8\u628A\u6839\u8BC1\u4E66\u88C5\u5165\u5F53\u524D\u7528\u6237\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF08\u514D\u7BA1\u7406\u5458\uFF1BmacOS \u9700\u624B\u52A8\uFF09\n\u586B\u5165\u56DB\u9879\u8BBE\u7F6E\uFF1A\u670D\u52A1\u5730\u5740=\u5C40\u57DF\u7F51 IP\u3001\u534F\u8BAE=https\u3001\u8BC1\u4E66\u8DEF\u5F84\u3001\u79C1\u94A5\u8DEF\u5F84\uFF1B\u968F\u540E\u63D0\u793A\u91CD\u542F\u670D\u52A1\u751F\u6548", `Detect this machine's LAN IPv4 (fail with no settings written if none)
Generate a self-signed certificate and key in your user folder and copy rootCA.pem to the Desktop
On Windows install the root into the current user's "Trusted Root Certification Authorities" (no admin; macOS is manual)
Fill the four settings (host = LAN IP, protocol = https, certificate path, private-key path) and prompt a service restart`],
  "mobile.intro.note": ["\u751F\u6210\u5B8C\u6210\u540E\u6309\u5F39\u7A97\u91CC\u7684\u6B65\u9AA4\u5728\u7535\u8111\u4E0E\u624B\u673A\u4E0A\u5B89\u88C5\u4FE1\u4EFB\uFF0C\u518D\u70B9\u300C\u91CD\u542F\u670D\u52A1\u5E76\u751F\u6548\u300D\u3002\u8BBE\u7F6E\u9875\u56DB\u9879\u8BBE\u7F6E\u4F1A\u5373\u65F6\u663E\u793A\u65B0\u503C\u3002", 'After generating, install the trust on computer and phone as shown, then choose "Restart service & apply". The four settings update in the settings page immediately.'],
  "mobile.intro.confirm": ["\u786E\u8BA4\u751F\u6210\u5E76\u586B\u5165", "Generate & fill"],
  // 成功弹窗：路径 + Windows 信任根 + iOS / 安卓两套步骤 + token 链接 + 重启 CTA
  "mobile.done.title": ["\u8FDC\u7A0B\u8BBF\u95EE\u914D\u7F6E\u5DF2\u751F\u6210", "Remote access settings generated"],
  "mobile.done.files": ["\u5DF2\u586B\u5165\uFF1A\u670D\u52A1\u5730\u5740 {host}\u3001\u534F\u8BAE https\u3001\u7AEF\u53E3 {port}\n\u8BC1\u4E66 PEM\uFF1A{cert}\n\u79C1\u94A5 PEM\uFF1A{key}", "Filled in: host {host}, protocol https, port {port}\nCertificate PEM: {cert}\nPrivate key PEM: {key}"],
  "mobile.done.rootCa": ["\u684C\u9762\u6839\u8BC1\u4E66\uFF1A{root}", "Desktop root certificate: {root}"],
  "mobile.done.windows": ["\u7535\u8111\u7AEF\u624B\u52A8\u4FE1\u4EFB\uFF08\u81EA\u52A8\u5BFC\u5165\u5931\u8D25\u6216 macOS\uFF09\uFF1AWindows \u53CC\u51FB\u684C\u9762\u7684 rootCA.pem \u2192 \u5B89\u88C5\u8BC1\u4E66 \u2192 \u9009\u62E9\u300C\u5F53\u524D\u7528\u6237\u300D\u2192 \u653E\u5165\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF1BmacOS \u6253\u5F00\u300C\u94A5\u5319\u4E32\u8BBF\u95EE\u300D\u2192 \u5BFC\u5165 rootCA.pem \u2192 \u53CC\u51FB\u8BC1\u4E66 \u2192 \u4FE1\u4EFB \u2192 \u300C\u59CB\u7EC8\u4FE1\u4EFB\u300D\u3002\u5426\u5219 Obsidian \u5185\u5D4C\u9762\u677F\u4F1A\u56E0\u8BC1\u4E66\u4E0D\u53D7\u4FE1\u4EFB\u800C\u6253\u4E0D\u5F00\u3002", 'Computer, manual trust (auto-import failed, or macOS): on Windows double-click rootCA.pem on the Desktop \u2192 Install Certificate \u2192 Current user \u2192 "Trusted Root Certification Authorities"; on macOS open Keychain Access \u2192 import rootCA.pem \u2192 double-click it \u2192 Trust \u2192 "Always Trust". Otherwise the embedded Obsidian panel cannot open because the certificate is not trusted.'],
  "mobile.done.windowsAuto": ["\u7535\u8111\uFF08Windows\uFF09\uFF1A\u5DF2\u81EA\u52A8\u628A rootCA.pem \u88C5\u5165\u5F53\u524D\u7528\u6237\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\u2713\uFF0CObsidian \u5185\u5D4C\u9762\u677F\u65E0\u9700\u518D\u624B\u52A8\u5BFC\u5165\uFF1B\u82E5\u9762\u677F\u4ECD\u6253\u4E0D\u5F00\uFF0C\u91CD\u542F Obsidian \u6216\u91CD\u542F\u670D\u52A1\u5373\u53EF\u3002", `Computer (Windows): rootCA.pem was installed into the current user's "Trusted Root Certification Authorities" automatically \u2713 \u2014 no manual import needed for the embedded Obsidian panel; if it still will not open, restart Obsidian or the service.`],
  "mobile.done.trustFail": ["\u26A0 \u81EA\u52A8\u5BFC\u5165 Windows \u8BC1\u4E66\u4FE1\u4EFB\u5931\u8D25\uFF1A{err}\u3002\u8BF7\u6309\u4E0A\u9762\u7684\u624B\u52A8\u6B65\u9AA4\u5BFC\u5165\uFF0C\u6216\u53F3\u952E\u300C\u4EE5\u7BA1\u7406\u5458\u8EAB\u4EFD\u300D\u91CD\u8BD5\u3002", "\u26A0 Automatic Windows trust import failed: {err}. Follow the manual steps above, or retry as administrator."],
  "mobile.done.iosTitle": ["iOS / iPadOS", "iOS / iPadOS"],
  "mobile.done.ios": ["\u628A\u684C\u9762\u4E0A\u7684 rootCA.pem \u4F20\u5230\u624B\u673A\uFF08AirDrop / \u90AE\u4EF6 / \u7F51\u76D8 / \u6570\u636E\u7EBF\u5747\u53EF\uFF09\n\u5728\u300C\u6587\u4EF6\u300DApp \u91CC\u70B9\u5F00\u5B83\uFF0C\u5141\u8BB8\u4E0B\u8F7D\u63CF\u8FF0\u6587\u4EF6\n\u8BBE\u7F6E \u2192 \u901A\u7528 \u2192 VPN\u4E0E\u8BBE\u5907\u7BA1\u7406\uFF08\u6216\u300C\u5DF2\u4E0B\u8F7D\u63CF\u8FF0\u6587\u4EF6\u300D\uFF09\u2192 \u70B9\u5F00\u8BE5\u63CF\u8FF0\u6587\u4EF6 \u2192 \u5B89\u88C5\n\u8BBE\u7F6E \u2192 \u901A\u7528 \u2192 \u5173\u4E8E\u672C\u673A \u2192 \u8BC1\u4E66\u4FE1\u4EFB\u8BBE\u7F6E \u2192 \u6253\u5F00\u8BE5\u6839\u8BC1\u4E66\u7684\u5F00\u5173\n\u624B\u673A\u8FDE\u4E0E\u7535\u8111\u76F8\u540C\u7684 Wi-Fi\n\u7528 Safari \u6253\u5F00\u7535\u8111\u4E0A\u590D\u5236\u7684 token \u94FE\u63A5", 'Send rootCA.pem from the Desktop to the phone (AirDrop / email / cloud drive / cable)\nOpen it in the Files app and allow the profile download\nSettings \u2192 General \u2192 VPN & Device Management (or "Downloaded Profile") \u2192 tap the profile \u2192 Install\nSettings \u2192 General \u2192 About \u2192 Certificate Trust Settings \u2192 enable the root certificate\nConnect the phone to the same Wi-Fi as the computer\nOpen the copied token link in Safari'],
  "mobile.done.androidTitle": ["\u5B89\u5353", "Android"],
  "mobile.done.android": ["\u628A\u684C\u9762\u4E0A\u7684 rootCA.pem \u4F20\u5230\u624B\u673A\uFF08\u6570\u636E\u7EBF / \u7F51\u76D8 / \u6587\u4EF6\u4F20\u8F93\u5747\u53EF\uFF09\n\u8BBE\u7F6E \u2192 \u5B89\u5168\uFF08\u90E8\u5206\u673A\u578B\uFF1A\u5B89\u5168\u4E0E\u9690\u79C1 \u2192 \u66F4\u591A\u5B89\u5168\u8BBE\u7F6E\uFF09\u2192 \u52A0\u5BC6\u4E0E\u51ED\u636E \u2192 \u5B89\u88C5\u8BC1\u4E66 \u2192 CA \u8BC1\u4E66\n\u786E\u8BA4\u98CE\u9669\u63D0\u793A\u540E\u9009\u62E9 rootCA.pem \u5B89\u88C5\uFF08\u53EF\u80FD\u9700\u8981\u9501\u5C4F\u5BC6\u7801\uFF09\n\u624B\u673A\u8FDE\u4E0E\u7535\u8111\u76F8\u540C\u7684 Wi-Fi\n\u7528 Chrome \u6253\u5F00\u7535\u8111\u4E0A\u590D\u5236\u7684 token \u94FE\u63A5", "Send rootCA.pem from the Desktop to the phone (cable / cloud drive / file transfer)\nSettings \u2192 Security (some models: Security & privacy \u2192 More security settings) \u2192 Encryption & credentials \u2192 Install a certificate \u2192 CA certificate\nAccept the warning and pick rootCA.pem to install (a screen lock may be required)\nConnect the phone to the same Wi-Fi as the computer\nOpen the copied token link in Chrome"],
  "mobile.done.nextToken": ["token \u94FE\u63A5\uFF1A\u5728\u7535\u8111\u4E0A\u70B9\u672C\u63D2\u4EF6\u7684\u300C\u590D\u5236 token \u94FE\u63A5\u300D\u6309\u94AE\uFF08\u8BBE\u7F6E \u2192 \u5FEB\u6377\u64CD\u4F5C\uFF09\u53D6\u5F97\u5B8C\u6574\u5730\u5740\uFF0C\u53D1\u5230\u624B\u673A\u6253\u5F00\u5373\u53EF\uFF08\u624B\u673A\u4E0E\u7535\u8111\u4E00\u6837\u9700\u8981\u8FD9\u6761\u94FE\u63A5\uFF1B\u4E5F\u53EF\u70B9\u300C\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH\u300D\uFF0C\u4F46\u8DF3\u8F6C\u540E\u5730\u5740\u680F\u4F1A\u4E22\u6389 token\uFF1B\u5B8C\u6574\u6B65\u9AA4\u4E0E\u65B9\u6CD5\u89C1\u672C\u884C\u300C\u624B\u673A\u8FDC\u7A0B\u8BBF\u95EE\u793A\u4F8B\u300D\u91CC\u7684\u793A\u4F8B\u6B65\u9AA4\uFF09\u3002", 'Token link: on the computer use the "Copy token link" button of this plugin (Settings \u2192 Quick actions) to get the full address, then open it on the phone (the phone needs this link exactly like the desktop; "Open DSH in browser" also works, but the browser drops the token from the address bar after the redirect; the complete flow is in the "Phone remote-access example" on this row).'],
  "mobile.done.restart": ["\u91CD\u542F\u670D\u52A1\u5E76\u751F\u6548", "Restart service & apply"],
  "mobile.done.later": ["\u7A0D\u540E", "Later"],
  "mobile.done.laterHint": ["\u8BBE\u7F6E\u5DF2\u4FDD\u7559\u3002\u91CD\u542F\u670D\u52A1\u524D\u624B\u673A\u4E0E\u5185\u5D4C\u9762\u677F\u90FD\u4E0D\u4F1A\u6309\u65B0\u914D\u7F6E\u5DE5\u4F5C\uFF0C\u53EF\u968F\u65F6\u5728\u300C\u5FEB\u6377\u529F\u80FD\u300D\u91CC\u624B\u52A8\u91CD\u542F\u670D\u52A1\u3002", "Settings are kept. Until the service restarts, neither the phone nor the embedded panel uses the new configuration; restart it from Quick actions whenever you are ready."],
  // 错误（main 返回错误码 / 原始 message，弹窗映射成本地化文案）
  "mobile.err.noLan": ["\u672A\u627E\u5230\u672C\u673A\u5C40\u57DF\u7F51 IPv4 \u5730\u5740\uFF1A\u8BF7\u5148\u8FDE\u4E0A Wi-Fi \u6216\u6709\u7EBF\u7F51\u7EDC\u540E\u91CD\u8BD5\uFF08\u8BBE\u7F6E\u672A\u6539\u52A8\uFF09\u3002", "No LAN IPv4 address found on this machine: connect to Wi-Fi or Ethernet and retry (no settings were changed)."],
  "mobile.err.desktop": ["\u627E\u4E0D\u5230\u684C\u9762\u76EE\u5F55\uFF08~/Desktop\u3001~/OneDrive/Desktop\u3001~/\u684C\u9762 \u5747\u4E0D\u5B58\u5728\uFF09\uFF1A\u8BF7\u5148\u521B\u5EFA\u684C\u9762\u6587\u4EF6\u5939\u6216\u68C0\u67E5\u7CFB\u7EDF\u7528\u6237\u76EE\u5F55\u540E\u91CD\u8BD5\uFF08\u8BBE\u7F6E\u672A\u6539\u52A8\uFF09\u3002", "No Desktop folder found (~/Desktop, ~/OneDrive/Desktop, ~/\u684C\u9762): create one or check your user folder and retry (no settings were changed)."],
  "mobile.err.customHost": ["\u542F\u52A8\u547D\u4EE4\u91CC\u5199\u6B7B\u4E86 `--host`\uFF0C\u4E14\u4E0E\u672C\u6B21\u68C0\u6D4B\u5230\u7684\u5C40\u57DF\u7F51 IP \u4E0D\u4E00\u81F4\uFF1A\u8BF7\u5148\u5220\u9664\u547D\u4EE4\u91CC\u7684 `--host`\uFF08\u6216\u628A\u5B83\u6539\u6210\u8BE5 IP\uFF09\u518D\u751F\u6210\uFF0C\u5426\u5219\u63D2\u4EF6\u4E0E DSH \u4F1A\u8FDE\u5230\u4E0D\u540C\u5730\u5740\uFF08\u8BBE\u7F6E\u672A\u6539\u52A8\uFF09\u3002", "The startup command pins `--host` to a different address than this machine's LAN IP: remove or fix `--host` in the command before generating, otherwise the plugin and DSH connect to different addresses (no settings were changed)."],
  "mobile.err.customTls": ["\u542F\u52A8\u547D\u4EE4\u91CC\u5DF2\u7ECF\u5199\u4E86 `--tls-cert` / `--tls-key`\uFF1A\u5B83\u4EEC\u4F1A\u8986\u76D6\u672C\u6B21\u751F\u6210\u7684\u65B0\u8BC1\u4E66\uFF0C\u624B\u673A\u4E0E\u63D2\u4EF6\u5FC5\u7136\u5BF9\u4E0D\u4E0A\u3002\u8BF7\u5148\u5220\u9664\u547D\u4EE4\u91CC\u7684\u8FD9\u4E24\u4E2A\u53C2\u6570\u518D\u751F\u6210\uFF08\u8BBE\u7F6E\u672A\u6539\u52A8\uFF09\u3002", "The startup command already contains `--tls-cert` / `--tls-key`: they would override the certificate generated now, so the phone and the plugin cannot agree. Remove those flags from the command and retry (no settings were changed)."],
  "mobile.err.gen": ["\u751F\u6210\u5931\u8D25\uFF1A{err}", "Generation failed: {err}"],
  "mobile.err.busy": ["\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u2026", "Generation already in progress, please wait\u2026"],
  // 恢复默认（v2.9.1 §11：只改设置，不删证书、不撤销信任）
  "reset.title": ["\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\uFF1F", "Reset endpoint defaults?"],
  "reset.body": ["\u670D\u52A1\u5730\u5740\u5C06\u6539\u56DE 127.0.0.1\u3001\u534F\u8BAE\u6539\u56DE http\u3001\u8BC1\u4E66\u4E0E\u79C1\u94A5\u8DEF\u5F84\u6E05\u7A7A\u3002\n\u624B\u673A\u5C06\u65E0\u6CD5\u518D\u8BBF\u95EE\uFF1B\u672C\u673A\u9762\u677F\u4F1A**\u81EA\u52A8\u91CD\u542F\u670D\u52A1**\u5E76\u5207\u56DE\u9ED8\u8BA4\u5730\u5740\uFF08\u9762\u677F\u4F1A\u77ED\u6682\u65AD\u5F00\u51E0\u79D2\uFF09\uFF0C\u6D4F\u89C8\u5668\u91CC\u5DF2\u6253\u5F00\u7684\u65E7\u9875\u9762\u9700\u624B\u52A8\u5173\u95ED\u540E\u91CD\u65B0\u6253\u5F00\u3002\n\u4E0D\u4F1A\u5220\u9664\u5DF2\u751F\u6210\u7684\u8BC1\u4E66\u6587\u4EF6\u4E0E\u684C\u9762 rootCA.pem\uFF1A\n\u8BC1\u4E66\uFF1A{cert}\n\u79C1\u94A5\uFF1A{key}\n\u5982\u9700\u5F7B\u5E95\u6E05\u7406\u8BF7\u624B\u52A8\u5220\u9664\u4E0A\u8FF0\u6587\u4EF6\uFF1B\u7CFB\u7EDF\u4E0E\u624B\u673A\u91CC\u5DF2\u5B89\u88C5\u7684\u8BC1\u4E66\u4FE1\u4EFB\u4E5F\u4E0D\u4F1A\u88AB\u79FB\u9664\u3002", "The service host goes back to 127.0.0.1, the protocol back to http, and both certificate paths are cleared.\nThe phone can no longer connect; the local panel restarts the service automatically and switches back to the default address (it disconnects for a few seconds) \u2014 an already-open external browser tab must be closed and reopened manually.\nGenerated certificate files and the Desktop rootCA.pem are not deleted:\nCertificate: {cert}\nPrivate key: {key}\nDelete those files yourself for a full cleanup; certificate trust already installed on the system or phone is not removed either."],
  "reset.confirm": ["\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\u5E76\u91CD\u542F", "Reset & restart"],
  "reset.done": ["\u5DF2\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\uFF1A\u670D\u52A1\u5DF2\u81EA\u52A8\u91CD\u542F\uFF0C\u9762\u677F\u5DF2\u5207\u56DE 127.0.0.1\uFF08\u6D4F\u89C8\u5668\u91CC\u5DF2\u6253\u5F00\u7684\u65E7\u9875\u9762\u8BF7\u624B\u52A8\u5173\u95ED\u91CD\u5F00\uFF1B\u8BC1\u4E66\u6587\u4EF6\u672A\u5220\u9664\uFF0C\u7CFB\u7EDF/\u624B\u673A\u8BC1\u4E66\u4FE1\u4EFB\u672A\u64A4\u9500\uFF09", "Endpoint defaults restored: the service was restarted automatically and the panel is back on 127.0.0.1 (close and reopen any old external browser tab; certificate files were kept and existing certificate trust is unchanged)"],
  "reset.alreadyDefault": ["\u5F53\u524D\u5DF2\u662F\u9ED8\u8BA4\u7AEF\u70B9\uFF08127.0.0.1 / http / \u65E0\u8BC1\u4E66\uFF09\uFF0C\u65E0\u9700\u6062\u590D", "Already at the default endpoint (127.0.0.1 / http / no certificates); nothing to reset"]
};
var current = "zh";
var I18N_KEYS = Object.keys(dict);
function resolveLocale(setting, detected) {
  if (setting === "zh") return "zh";
  if (setting === "en") return "en";
  return detected != null ? detected : "en";
}
function applyLocale(setting, detected) {
  current = resolveLocale(setting, detected);
}
function getLocale() {
  return current;
}
function t(key, vars) {
  const entry = dict[key];
  const text = entry ? current === "en" ? entry[1] : entry[0] : key;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, name) => {
    var _a;
    return String((_a = vars[name]) != null ? _a : "");
  });
}

// src/profile.ts
var import_node_fs2 = require("node:fs");
var import_node_path = require("node:path");
var VALID_PROFILE_RE = /^[a-z][a-z0-9_-]{0,63}$/;
var RESERVED_PROFILES = ["acp", "headless", "sdk", "sdk-minimal"];
function isReservedProfile(value) {
  const p = (value != null ? value : "").trim().toLowerCase();
  return RESERVED_PROFILES.includes(p);
}
function nonWebProfileInCommand(cmd) {
  const c = (cmd != null ? cmd : "").toLowerCase();
  for (const p of RESERVED_PROFILES) {
    if (new RegExp(`--profile[= ]${p}(?![a-z0-9_-])`).test(c)) return p;
    if (new RegExp(`\\bdsh\\s+${p}(?![a-z0-9_-])`).test(c)) return p;
  }
  return null;
}
function normalizeProfile(value) {
  if (typeof value !== "string") return "web";
  const v = value.trim();
  return VALID_PROFILE_RE.test(v) && !isReservedProfile(v) ? v : "web";
}
function listProfiles(home, readdir2 = listDir) {
  try {
    const names = readdir2((0, import_node_path.join)(home, "profiles")).filter(
      (name) => VALID_PROFILE_RE.test(name) && name !== "node_modules" && !isReservedProfile(name)
    );
    return names.sort((a, b) => a === "web" ? -1 : b === "web" ? 1 : a.localeCompare(b));
  } catch (e) {
    return [];
  }
}
function listDir(dir) {
  return (0, import_node_fs2.readdirSync)(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && (0, import_node_fs2.existsSync)((0, import_node_path.join)(dir, e.name, "package.json"))).map((e) => e.name);
}

// src/service-endpoint.ts
var import_node_fs3 = require("node:fs");
var import_node_http = require("node:http");
var import_node_https = require("node:https");
var DEFAULT_SERVICE_HOST = "127.0.0.1";
var DEFAULT_SERVICE_PORT = 3080;
function unwrapBrackets(host) {
  if (host.startsWith("[") || host.endsWith("]")) {
    return host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : null;
  }
  return host;
}
function isIpv4Literal(host) {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}
function isIpv6Literal(host) {
  if (!host.includes(":") || host.includes(":::")) return false;
  const firstDouble = host.indexOf("::");
  if (firstDouble !== -1 && host.indexOf("::", firstDouble + 1) !== -1) return false;
  const head = firstDouble === -1 ? host : host.slice(0, firstDouble);
  const tail = firstDouble === -1 ? "" : host.slice(firstDouble + 2);
  const groups = [...head === "" ? [] : head.split(":"), ...tail === "" ? [] : tail.split(":")];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return false;
  return firstDouble === -1 ? groups.length === 8 : groups.length < 8;
}
function normalizeServiceHost(raw) {
  const input = String(raw != null ? raw : "").trim();
  if (input === "") return { ok: false, reason: "empty" };
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(input)) return { ok: false, reason: "scheme" };
  if (/[\s/?#@]/.test(input)) return { ok: false, reason: "path" };
  if (/^\[[^\]]*\]:\d+$/.test(input) || /^[^:[\]%]+:\d+$/.test(input)) {
    return { ok: false, reason: "port" };
  }
  const unwrapped = unwrapBrackets(input);
  if (unwrapped === null) return { ok: false, reason: "invalid" };
  const host = unwrapped.toLowerCase();
  if (host === "") return { ok: false, reason: "invalid" };
  if (host.includes("%")) return { ok: false, reason: "zone" };
  if (host === "0.0.0.0" || host === "::") return { ok: false, reason: "wildcard" };
  if (host === "localhost" || isIpv4Literal(host) || isIpv6Literal(host)) {
    return { ok: true, host };
  }
  return { ok: false, reason: "invalid" };
}
function isLoopbackHost(host) {
  const unwrapped = unwrapBrackets(String(host != null ? host : "").trim());
  if (unwrapped === null) return false;
  const h = unwrapped.toLowerCase();
  if (h === "localhost" || h === "::1") return true;
  return /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h);
}
function clampPort(port) {
  const n = Number(port);
  if (!Number.isFinite(n)) return DEFAULT_SERVICE_PORT;
  return Math.min(65535, Math.max(1, Math.trunc(n)));
}
function endpointFromSettings(s) {
  var _a, _b, _c;
  const check = normalizeServiceHost((_a = s.serviceHost) != null ? _a : "");
  const scheme = String((_b = s.serviceScheme) != null ? _b : "").trim().toLowerCase() === "https" ? "https" : "http";
  const caCertPath = String((_c = s.tlsCertPath) != null ? _c : "").trim();
  const ep = {
    scheme,
    host: check.ok ? check.host : DEFAULT_SERVICE_HOST,
    port: clampPort(s.port)
  };
  if (scheme === "https" && caCertPath !== "") ep.caCertPath = caCertPath;
  return ep;
}
function hostForUrl(host) {
  return host.includes(":") ? `[${host}]` : host;
}
function endpointOrigin(ep) {
  return `${ep.scheme}://${hostForUrl(ep.host)}:${String(ep.port)}`;
}
function endpointLabel(ep) {
  return endpointOrigin(ep);
}
function quoteCommandArg(value) {
  const raw = String(value != null ? value : "");
  if (!/[\s"]/.test(raw)) return raw;
  return `"${raw.replaceAll('"', '\\"')}"`;
}
function applyEndpointFlags(command, ep, tlsKeyPath = "") {
  var _a;
  const base = String(command != null ? command : "").trim();
  if (base === "") return "";
  const parts = [];
  if (ep.host !== DEFAULT_SERVICE_HOST && !/(?:^|\s)--host(?:[=\s]|$)/.test(base)) {
    parts.push("--host", quoteCommandArg(ep.host));
  }
  const cert = String((_a = ep.caCertPath) != null ? _a : "").trim();
  const key = String(tlsKeyPath != null ? tlsKeyPath : "").trim();
  const hasTlsFlag = /(?:^|\s)--tls-(?:cert|key)(?:[=\s]|$)/.test(base);
  if (ep.scheme === "https" && cert !== "" && key !== "" && !hasTlsFlag) {
    parts.push("--tls-cert", quoteCommandArg(cert), "--tls-key", quoteCommandArg(key));
  }
  return parts.length === 0 ? base : `${base} ${parts.join(" ")}`;
}
function hostFlagInCommand(command) {
  var _a, _b, _c;
  const m = /(?:^|\s)--host(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(String(command != null ? command : ""));
  if (m === null) return null;
  return (_c = (_b = (_a = m[1]) != null ? _a : m[2]) != null ? _b : m[3]) != null ? _c : null;
}
function hasTlsFlagsInCommand(command) {
  return /(?:^|\s)--tls-(?:cert|key)(?:=|\s|$)/.test(String(command != null ? command : ""));
}
function httpsSwitchNeedsPair(input) {
  var _a, _b;
  if (input.scheme !== "https") return false;
  if (hasTlsFlagsInCommand(input.startupCommand)) return false;
  const cert = String((_a = input.tlsCertPath) != null ? _a : "").trim();
  const key = String((_b = input.tlsKeyPath) != null ? _b : "").trim();
  return cert === "" || key === "";
}
var DEFAULT_REQUEST_TIMEOUT_MS = 8e3;
var certCache = /* @__PURE__ */ new Map();
var WRAPPED_MARK = Symbol("endpointRequestError");
function wrapRequestError(err, ep) {
  if (err instanceof Error && err[WRAPPED_MARK] === true) return err;
  const e = err != null ? err : {};
  const code = typeof e.code === "string" ? e.code : "";
  const detail = err instanceof Error ? err.message : typeof e.message === "string" && e.message !== "" ? e.message : String(err);
  const out = new Error(
    `request to ${endpointOrigin(ep)} failed: ${detail}${code === "" ? "" : ` (code=${code})`}`
  );
  if (code !== "") out.code = code;
  out[WRAPPED_MARK] = true;
  return out;
}
function caPemOf(path) {
  const cached = certCache.get(path);
  if (cached !== void 0) return cached;
  try {
    const pem = (0, import_node_fs3.readFileSync)(path);
    certCache.set(path, pem);
    return pem;
  } catch (e) {
    const err = new Error(`cannot read TLS certificate: ${path}`);
    err.code = "ENOENT";
    throw err;
  }
}
function endpointRequest(ep, req) {
  return new Promise((resolve2, reject) => {
    var _a, _b, _c, _d, _e;
    const timeoutMs = (_a = req.timeoutMs) != null ? _a : DEFAULT_REQUEST_TIMEOUT_MS;
    const headers = { ...(_b = req.headers) != null ? _b : {} };
    const hasHostHeader = Object.keys(headers).some((k) => k.toLowerCase() === "host");
    if (!hasHostHeader) headers.host = `${hostForUrl(ep.host)}:${String(ep.port)}`;
    if (req.method === "POST") {
      if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) {
        headers["content-type"] = "application/json";
      }
      headers["content-length"] = String(Buffer.byteLength((_c = req.body) != null ? _c : ""));
    }
    const baseOptions = {
      host: ep.host,
      port: ep.port,
      path: req.path,
      method: req.method,
      timeout: timeoutMs,
      headers
    };
    const onResponse = (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        var _a2;
        const rawCookie = res.headers["set-cookie"];
        const firstCookie = Array.isArray(rawCookie) ? rawCookie[0] : rawCookie;
        resolve2({
          status: (_a2 = res.statusCode) != null ? _a2 : 0,
          text: Buffer.concat(chunks).toString("utf8"),
          headers: res.headers,
          setCookie: firstCookie != null ? firstCookie : ""
        });
      });
    };
    let client;
    try {
      if (ep.scheme === "https") {
        const certPath = String((_d = ep.caCertPath) != null ? _d : "").trim();
        const tlsOptions = { ...baseOptions, rejectUnauthorized: true };
        client = certPath === "" ? (0, import_node_https.request)(tlsOptions, onResponse) : (0, import_node_https.request)({ ...tlsOptions, ca: caPemOf(certPath) }, onResponse);
      } else {
        client = (0, import_node_http.request)(baseOptions, onResponse);
      }
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    client.on("timeout", () => {
      const timedOut = new Error(
        `request to ${endpointOrigin(ep)}${req.path} timed out after ${String(timeoutMs)}ms`
      );
      timedOut.code = "ETIMEDOUT";
      timedOut[WRAPPED_MARK] = true;
      client.destroy(timedOut);
    });
    client.on("error", (err) => reject(wrapRequestError(err, ep)));
    if (req.method === "POST") client.end((_e = req.body) != null ? _e : "");
    else client.end();
  });
}
function tlsErrorKind(err) {
  const e = err != null ? err : {};
  const code = typeof e.code === "string" ? e.code : "";
  const message = typeof e.message === "string" ? e.message : "";
  const hay = `${code} ${message}`;
  if (/CERT_HAS_EXPIRED|CERT_NOT_YET_VALID|certificate has expired|certificate is not yet valid/i.test(hay)) return "expired";
  if (/ERR_TLS_CERT_ALTNAME_INVALID|altnames?\/IP|does not match the certificate/i.test(hay)) return "altname";
  if (/DEPTH_ZERO_SELF_SIGNED_CERT|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|UNABLE_TO_GET_ISSUER_CERT|certificate chain|self[- ]signed certificate/i.test(
    hay
  )) {
    return "untrusted";
  }
  if (/TLS|SSL|certificate/i.test(hay)) return "other";
  return "none";
}
function classifyConnectFailure(err) {
  const e = err != null ? err : {};
  const code = typeof e.code === "string" ? e.code : "";
  const message = typeof e.message === "string" ? e.message : "";
  const hay = `${code} ${message}`;
  if (/ECONNREFUSED|EHOSTUNREACH|ENETUNREACH|address not available/i.test(hay)) {
    return { kind: "refused", tls: "none" };
  }
  if (/ETIMEDOUT|ESOCKETTIMEDOUT|timed out/i.test(hay)) {
    return { kind: "timeout", tls: "none" };
  }
  const tls = tlsErrorKind(err);
  if (tls !== "none") return { kind: "tls", tls };
  return { kind: "other", tls: "none" };
}

// src/win-exec.ts
var CMD_WRAP_SET = /* @__PURE__ */ new Set(["npm", "npx", "pnpm", "dsh", "dsh-fix", "dsh-doctor"]);
function resolveExec(platform, command, args) {
  if (platform === "win32" && CMD_WRAP_SET.has(command)) {
    return { command: "cmd.exe", args: ["/d", "/s", "/c", command, ...args] };
  }
  return { command, args };
}

// src/service-manager.ts
function describeSpawnError(err, command, args) {
  var _a, _b;
  const e = err != null ? err : {};
  const code = String((_a = e.code) != null ? _a : "");
  const syscall = String((_b = e.syscall) != null ? _b : "");
  let msg = "unknown spawn error";
  if (typeof err === "string") msg = err;
  else if (err instanceof Error) msg = err.message !== "" ? err.message : err.name;
  else {
    const raw = err == null ? void 0 : err.message;
    if (typeof raw === "string" && raw !== "") msg = raw;
  }
  const attempt = [command, ...args].join(" ").slice(0, 220);
  const hint = code === "ENOENT" ? t(process.platform === "darwin" ? "svc.spawnENOENT.mac" : "svc.spawnENOENT") : code === "EACCES" || code === "EPERM" ? t("svc.spawnDenied") : "";
  return [
    msg,
    code !== "" ? `code=${code}` : "",
    syscall !== "" ? `syscall=${syscall}` : "",
    `cmd: ${attempt}`,
    hint
  ].filter((s) => s !== "").join(" | ");
}
var DEFAULT_PROBE_TIMEOUT_MS = 3e3;
var DEFAULT_POLL_INTERVAL_MS = 1e3;
var DEFAULT_READY_TIMEOUT_MS = 3e5;
function launchLogFile(port) {
  return (0, import_node_path2.join)((0, import_node_os2.tmpdir)(), `dsh-web-out-${String(port)}.log`);
}
function parseLaunchUrl(text) {
  var _a;
  const m = /dsh web: (https?:\/\/[^\s"'<>)]+)/.exec(text);
  return (_a = m == null ? void 0 : m[1]) != null ? _a : "";
}
var pendingLaunchLog = null;
function tokenizeCommand(line) {
  const out = [];
  let current2 = "";
  let inQuote = false;
  let started = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuote) {
      if (ch === "\\" && line[i + 1] === '"') {
        current2 += '"';
        i += 1;
      } else if (ch === '"') {
        inQuote = false;
      } else {
        current2 += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuote = true;
      started = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (started) {
        out.push(current2);
        current2 = "";
        started = false;
      }
      continue;
    }
    current2 += ch;
    started = true;
  }
  if (started) out.push(current2);
  return out;
}
function renderCommand(template, port) {
  const trimmed = template.replaceAll("{port}", String(port)).trim();
  if (trimmed === "") {
    return { command: "", args: [] };
  }
  const parts = tokenizeCommand(trimmed);
  if (parts.length === 0) {
    return { command: "", args: [] };
  }
  return { command: parts[0], args: parts.slice(1) };
}
function applyNoOpenAdaptive(cmd, supported) {
  const trimmed = cmd.trim();
  if (trimmed === "") return null;
  const hasFlag = /\s*--no-open\b/.test(trimmed);
  if (supported) {
    if (hasFlag) return null;
    return `${trimmed} --no-open`;
  }
  if (!hasFlag) return null;
  const cleaned = trimmed.replace(/\s*--no-open\b/g, "").trim();
  return cleaned === "" ? null : cleaned;
}
function detectStartupCommand(profile = "web") {
  if (!hasBin("dsh")) {
    return "";
  }
  return profileStartupCommand(profile);
}
function profileStartupCommand(profile) {
  const core = profile === "" || profile === "web" ? "dsh web --port {port}" : `dsh --profile ${profile} --port {port}`;
  return dshSupportsNoOpen() ? `${core} --no-open` : core;
}
function profileBinSegment(profile) {
  return profile === "" || profile === "web" ? "web" : `--profile ${profile}`;
}
function repoStartupTail(profile) {
  return `${profileBinSegment(profile)} --port {port}`;
}
var cachedDshVersion = "";
var cachedNoOpenSupport = null;
function dshSupportsNoOpen() {
  if (cachedNoOpenSupport !== null) return cachedNoOpenSupport;
  return true;
}
function probeNoOpenSupportAsync(onDone) {
  let resolved;
  try {
    resolved = resolveExec(process.platform, "dsh", ["web", "--help"]);
  } catch (e) {
    cachedNoOpenSupport = true;
    onDone == null ? void 0 : onDone(true);
    return;
  }
  const env = refreshedEnv();
  (0, import_node_child_process2.execFile)(
    resolved.command,
    resolved.args,
    { encoding: "utf8", timeout: 15e3, windowsHide: true, env },
    (err, stdout) => {
      const supported = err === null ? String(stdout).includes("no-open") : true;
      cachedNoOpenSupport = supported;
      try {
        const v = resolveExec(process.platform, "dsh", ["--version"]);
        (0, import_node_child_process2.execFile)(v.command, v.args, { encoding: "utf8", timeout: 5e3, windowsHide: true, env }, (err2, out2) => {
          var _a;
          if (err2 === null) {
            cachedDshVersion = ((_a = String(out2).trim().split(/\r?\n/)[0]) != null ? _a : "").trim();
          }
          onDone == null ? void 0 : onDone(supported);
        });
      } catch (e) {
        onDone == null ? void 0 : onDone(supported);
      }
    }
  );
}
function killPortOwner(port) {
  for (const pid of portOwnerPids(port)) {
    if (!isDshProcess(String(pid))) continue;
    try {
      if (process.platform === "win32") {
        (0, import_node_child_process2.execFileSync)("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        (0, import_node_child_process2.execFileSync)("kill", ["-9", String(pid)], { stdio: "ignore" });
      }
    } catch (e) {
    }
  }
}
function parseNetstatListeners(text) {
  const out = [];
  for (const line of String(text != null ? text : "").split(/\r?\n/)) {
    const m = /^\s*TCP\s+(\S+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i.exec(line);
    if (m === null) continue;
    const local = m[1];
    const pid = Number(m[2]);
    const colon = local.lastIndexOf(":");
    if (colon <= 0) continue;
    const port = Number(local.slice(colon + 1));
    if (!Number.isInteger(port) || port < 1 || port > 65535) continue;
    if (!Number.isInteger(pid) || pid <= 0) continue;
    out.push({ port, pid });
  }
  return out;
}
function portOwnerPids(port) {
  if (process.platform === "win32") {
    try {
      const netstat = (0, import_node_child_process2.execFileSync)("netstat", ["-ano"], { encoding: "utf8" });
      const pids = /* @__PURE__ */ new Set();
      for (const listener of parseNetstatListeners(netstat)) {
        if (listener.port === port) pids.add(listener.pid);
      }
      return [...pids];
    } catch (e) {
      return [];
    }
  }
  try {
    const out = (0, import_node_child_process2.execFileSync)("lsof", ["-ti", `:${port}`], { encoding: "utf8" });
    return out.split(/\s+/).filter(Boolean).map(Number).filter((n) => Number.isInteger(n) && n > 0);
  } catch (e) {
    return [];
  }
}
function isDshProcess(pid) {
  try {
    const ps = process.platform === "win32" ? (0, import_node_child_process2.execFileSync)("powershell", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine`
    ], { encoding: "utf8", timeout: 8e3 }) : (0, import_node_child_process2.execFileSync)("ps", ["-p", pid, "-o", "command="], { encoding: "utf8", timeout: 8e3 });
    return DSH_CMD_RE.test(ps) || /dsh-launch-/.test(ps);
  } catch (e) {
    return false;
  }
}
var DSH_CMD_RE = /(@deepseek-ai[\\/]dsh|deepseek-harness[\\/]apps[\\/]cli|\bdsh\s+(?:web|--profile)\b|profiles[\\/][^\\/]+[\\/]dsh-obsidian-bridge)/i;
function filterDshProcesses(rows, selfPid) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const row of rows) {
    const pid = Number(row.pid);
    if (!Number.isInteger(pid) || pid <= 0 || pid === selfPid || seen.has(pid)) continue;
    if (!DSH_CMD_RE.test(String(row.command))) continue;
    seen.add(pid);
    out.push({ pid, command: String(row.command) });
  }
  return out;
}
async function runQuiet(command, args, timeoutMs) {
  return new Promise((resolve2) => {
    try {
      (0, import_node_child_process2.execFile)(command, args, { encoding: "utf8", timeout: timeoutMs, windowsHide: true }, (err, stdout) => {
        resolve2(err ? { ok: false, out: "" } : { ok: true, out: String(stdout != null ? stdout : "") });
      });
    } catch (e) {
      resolve2({ ok: false, out: "" });
    }
  });
}
async function listDshProcesses() {
  if (process.platform === "win32") {
    const r2 = await runQuiet("powershell", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine } | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`
    ], 2e4);
    const trimmed = r2.out.trim();
    if (!r2.ok || trimmed === "") return [];
    try {
      const parsed = JSON.parse(trimmed);
      const rows2 = (Array.isArray(parsed) ? parsed : [parsed]).map((row) => {
        var _a;
        const rec = row;
        return {
          pid: Number((_a = rec.ProcessId) != null ? _a : 0),
          command: typeof rec.CommandLine === "string" ? rec.CommandLine : ""
        };
      });
      return filterDshProcesses(rows2, process.pid);
    } catch (e) {
      return [];
    }
  }
  const r = await runQuiet("pgrep", ["-af", "dsh"], 8e3);
  if (!r.ok) return [];
  const rows = r.out.split(/\r?\n/).filter((line) => line.trim() !== "").map((line) => {
    const sp = line.indexOf(" ");
    return { pid: Number(sp >= 0 ? line.slice(0, sp) : line), command: sp >= 0 ? line.slice(sp + 1) : "" };
  });
  return filterDshProcesses(rows, process.pid);
}
async function killDshProcesses() {
  const targets = await listDshProcesses();
  const doKill = async (pid) => {
    if (process.platform === "win32") {
      await runQuiet("taskkill", ["/pid", String(pid), "/T", "/F"], 1e4);
    } else {
      await runQuiet("kill", ["-9", String(pid)], 8e3);
    }
  };
  for (const target of targets) {
    await doKill(target.pid);
  }
  const deadline = Date.now() + 8e3;
  for (; ; ) {
    const left = await listDshProcesses();
    if (left.length === 0) break;
    if (Date.now() > deadline) {
      for (const t2 of left) await doKill(t2.pid);
      break;
    }
    await new Promise((resolve2) => window.setTimeout(resolve2, 300));
  }
  return targets;
}
function tcpProbe(endpoint, timeoutMs) {
  return new Promise((resolve2) => {
    const socket = (0, import_node_net.connect)({ host: endpoint.host, port: endpoint.port });
    const timer = window.setTimeout(() => {
      socket.destroy();
      resolve2(false);
    }, timeoutMs);
    socket.once("connect", () => {
      window.clearTimeout(timer);
      socket.destroy();
      resolve2(true);
    });
    socket.once("error", () => {
      window.clearTimeout(timer);
      resolve2(false);
    });
  });
}
async function defaultProbe(endpoint, timeoutMs) {
  const t2 = timeoutMs != null ? timeoutMs : DEFAULT_PROBE_TIMEOUT_MS;
  return tcpProbe(endpoint, t2);
}
function winQuoted(part) {
  return /\s/.test(part) ? `"${part}"` : part;
}
function winSpawnHidden(command, args, cwd, detached, env) {
  const cmdLine = [winQuoted(command), ...args.map(winQuoted)].join(" ");
  const redirect = pendingLaunchLog !== null ? ` > "%TEMP%\\${(0, import_node_path2.basename)(pendingLaunchLog)}" 2>&1` : "";
  const vbsPath = (0, import_node_path2.join)((0, import_node_os2.tmpdir)(), `dsh-launch-${process.pid}-${Date.now()}.vbs`);
  const body = `Set sh = CreateObject("WScript.Shell")\r
On Error Resume Next\r
Set ex = sh.Run("cmd.exe /d /s /c ${(cmdLine + redirect).replaceAll('"', '""')}", 0, True)\r
If Err.Number = 0 And Not ex Is Nothing Then WScript.Quit ex.ExitCode\r
`;
  (0, import_node_fs4.writeFileSync)(vbsPath, "\uFEFF" + body, "utf16le");
  const child = (0, import_node_child_process2.spawn)("wscript.exe", ["//nologo", "//b", vbsPath], {
    cwd,
    detached,
    stdio: "ignore",
    windowsHide: true,
    env
  });
  const cleanup = () => {
    try {
      (0, import_node_fs4.unlinkSync)(vbsPath);
    } catch (e) {
    }
  };
  child.once("exit", cleanup);
  child.once("error", cleanup);
  return child;
}
function defaultSpawnProcess(command, args, cwd, detached, env) {
  if (process.platform === "win32") {
    return winSpawnHidden(command, args, cwd, detached, env);
  }
  let stdio = "ignore";
  if (pendingLaunchLog !== null) {
    try {
      const fd = (0, import_node_fs4.openSync)(pendingLaunchLog, "a");
      stdio = ["ignore", fd, fd];
    } catch (e) {
    }
  }
  return (0, import_node_child_process2.spawn)(command, args, {
    cwd,
    detached: true,
    stdio,
    windowsHide: true,
    env
  });
}
function delay(ms) {
  return new Promise((resolve2) => window.setTimeout(resolve2, ms));
}
async function probePanelNeedsAuth(endpoint, timeoutMs = 4e3) {
  try {
    const res = await endpointRequest(endpoint, { path: "/", method: "GET", timeoutMs });
    if (res.status === 401) return "auth";
    if (res.status >= 200 && res.status < 400) return "open";
    return "unknown";
  } catch (e) {
    return "unknown";
  }
}
var BRIDGE_PAGE_MARKER = "__DSH_OBSIDIAN_BRIDGE__";
async function probeBridgeInjected(endpoint, token, timeoutMs = 6e3) {
  const path = `/?token=${encodeURIComponent(token)}&ob=1`;
  try {
    const res = await endpointRequest(endpoint, { path, method: "GET", timeoutMs });
    if (res.status === 401 || res.status === 403) return "unauthorized";
    if (res.status < 200 || res.status >= 400) return "unreachable";
    return res.text.includes(BRIDGE_PAGE_MARKER) ? "injected" : "missing";
  } catch (e) {
    return "unreachable";
  }
}
function managedRegistryFile(base = (0, import_node_os2.tmpdir)()) {
  return (0, import_node_path2.join)(base, "dsh-obsidian-managed.json");
}
function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === "EPERM";
  }
}
function readManagedProcs(file = managedRegistryFile()) {
  try {
    const parsed = JSON.parse((0, import_node_fs4.readFileSync)(file, "utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => {
      const rec = r;
      return Number.isInteger(rec.pid) && rec.pid > 0 && Number.isInteger(rec.port);
    });
  } catch (e) {
    return [];
  }
}
function writeManagedProcs(rows, file) {
  try {
    (0, import_node_fs4.writeFileSync)(file, JSON.stringify(rows.slice(-30)), "utf8");
  } catch (e) {
  }
}
function registerManagedProc(entry, file = managedRegistryFile()) {
  const rows = readManagedProcs(file).filter((r) => r.pid !== entry.pid);
  rows.push(entry);
  writeManagedProcs(rows, file);
}
function unregisterManagedProc(pid, file = managedRegistryFile()) {
  const rows = readManagedProcs(file);
  const kept = rows.filter((r) => r.pid !== pid);
  if (kept.length !== rows.length) writeManagedProcs(kept, file);
}
async function readProcTable() {
  var _a;
  if (process.platform === "win32") {
    const r2 = await runQuiet("powershell", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,CommandLine | ConvertTo-Json -Compress"
    ], 2e4);
    const trimmed = r2.out.trim();
    if (!r2.ok || trimmed === "") return null;
    try {
      const parsed = JSON.parse(trimmed);
      const rows = (Array.isArray(parsed) ? parsed : [parsed]).map((row) => {
        var _a2, _b;
        const rec = row;
        return {
          pid: Number((_a2 = rec.ProcessId) != null ? _a2 : 0),
          ppid: Number((_b = rec.ParentProcessId) != null ? _b : 0),
          cmd: typeof rec.CommandLine === "string" ? rec.CommandLine : ""
        };
      });
      return rows.filter((row) => Number.isInteger(row.pid) && row.pid > 0);
    } catch (e) {
      return null;
    }
  }
  const r = await runQuiet("ps", ["-eo", "pid=,ppid=,args="], 1e4);
  if (!r.ok) return null;
  const out = [];
  for (const line of r.out.split(/\r?\n/)) {
    const m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
    if (m !== null) out.push({ pid: Number(m[1]), ppid: Number(m[2]), cmd: (_a = m[3]) != null ? _a : "" });
  }
  return out.length > 0 ? out : null;
}
function ancestorChain(rows, pid) {
  const byPid = new Map(rows.map((r) => [r.pid, r]));
  const chain = [];
  const seen = /* @__PURE__ */ new Set();
  let current2 = byPid.get(pid);
  for (let hops = 0; current2 !== void 0 && hops < 32; hops += 1) {
    if (seen.has(current2.pid)) break;
    seen.add(current2.pid);
    chain.push(current2);
    if (current2.ppid <= 0 || current2.ppid === current2.pid) break;
    current2 = byPid.get(current2.ppid);
  }
  return chain;
}
function portOwnerVerdict(ownerCmd, isManaged) {
  const dsh = DSH_CMD_RE.test(ownerCmd) || /dsh-launch-/.test(ownerCmd);
  if (isManaged) return dsh ? "kill" : "ignore";
  return dsh ? "external" : "ignore";
}
async function killProcessTree(pid) {
  if (process.platform === "win32") {
    await runQuiet("taskkill", ["/pid", String(pid), "/T", "/F"], 1e4);
    return;
  }
  try {
    process.kill(-pid, "SIGKILL");
  } catch (e) {
    try {
      process.kill(pid, "SIGKILL");
    } catch (e2) {
    }
  }
}
async function acquirePort(port, managedPids = []) {
  var _a, _b;
  const owners = portOwnerPids(port);
  if (owners.length === 0) return "free";
  const table = await readProcTable();
  if (table === null) return "free";
  const byPid = new Map(table.map((r) => [r.pid, r]));
  const managedSet = new Set(managedPids);
  let killed = 0;
  let external = false;
  for (const owner of owners) {
    const isManaged = ancestorChain(table, owner).some((r) => managedSet.has(r.pid));
    const verdict = portOwnerVerdict((_b = (_a = byPid.get(owner)) == null ? void 0 : _a.cmd) != null ? _b : "", isManaged);
    if (verdict === "kill") {
      await killProcessTree(owner);
      killed += 1;
    } else if (verdict === "external") {
      external = true;
    }
  }
  if (external) return "external";
  return killed > 0 ? "killed" : "free";
}
async function killManagedForPort(port, file = managedRegistryFile()) {
  var _a, _b;
  const entries = readManagedProcs(file).filter((r) => r.port === port);
  if (entries.length === 0) return 0;
  const table = await readProcTable();
  let killed = 0;
  for (const e of entries) {
    if (e.pid === process.pid) continue;
    if (!isPidAlive(e.pid)) {
      unregisterManagedProc(e.pid, file);
      continue;
    }
    const cmd = (_b = (_a = table == null ? void 0 : table.find((r) => r.pid === e.pid)) == null ? void 0 : _a.cmd) != null ? _b : "";
    if (cmd === "" || !(DSH_CMD_RE.test(cmd) || /dsh-launch-/.test(cmd))) continue;
    await killProcessTree(e.pid);
    unregisterManagedProc(e.pid, file);
    killed += 1;
  }
  return killed;
}
function pickErrorLine(text) {
  var _a;
  const lines = String(text != null ? text : "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "");
  const thrown = lines.find((l) => /^[A-Za-z]*Error:\s/i.test(l));
  if (thrown) return thrown.replace(/^[A-Za-z]*Error:\s*/i, "");
  const frame = /^(file:\/\/|\^+$|at\s|node\.js\s+v\d)/i;
  const prose = lines.find((l) => !frame.test(l));
  return (_a = prose != null ? prose : lines[0]) != null ? _a : "";
}
async function ensureProfile(home, profile, exec = import_node_child_process2.execFile) {
  const p = (profile != null ? profile : "").trim();
  if (p === "" || p === "web") return { kind: "exists" };
  const pkg = (0, import_node_path2.join)(home, "profiles", p, "package.json");
  if ((0, import_node_fs4.existsSync)(pkg)) return { kind: "exists" };
  if (isReservedProfile(p)) return { kind: "failed", error: t("settings.profile.reserved", { name: p }) };
  const args = ["--profile", p, "--from-default-profile", "web", "--dump-default-config"];
  let resolved;
  try {
    resolved = resolveExec(process.platform, "dsh", args);
  } catch (err) {
    return { kind: "failed", error: err instanceof Error ? err.message : String(err) };
  }
  return new Promise((resolve2) => {
    exec(
      resolved.command,
      resolved.args,
      // v2.8.11：合并 PATH（`dsh` 在 brew/nvm 目录里；GUI 启动时父进程 PATH 找不到 → ENOENT）
      { encoding: "utf8", timeout: 6e4, windowsHide: true, env: { ...refreshedEnv(), DSH_HOME: home } },
      (err, stdout, stderr) => {
        if (err === null) {
          resolve2((0, import_node_fs4.existsSync)(pkg) ? { kind: "created" } : { kind: "failed", error: "profile was not created" });
          return;
        }
        const msg = pickErrorLine(String(stderr != null ? stderr : "")) || pickErrorLine(String(stdout != null ? stdout : "")) || err.message;
        resolve2(/already exists/i.test(msg) && (0, import_node_fs4.existsSync)(pkg) ? { kind: "exists" } : { kind: "failed", error: msg });
      }
    );
  });
}
var DshServiceManager = class {
  constructor(opts, deps) {
    this.child = null;
    /** 是否已发起过启动（普通可变字段）。 */
    this.spawned = false;
    /** spawn 失败原因（由子进程 'error' 事件捕获）。 */
    this.spawnError = null;
    /**
     * 最近一次 spawn 失败证据（v2.8.11）：`spawnError` 会在重试时被清空（避免轮询短路），
     * 本字段保留证据，供「重试后既无错误也无就绪」的超时分支报出真实原因。
     */
    this.spawnEvidence = null;
    /** 本次启动是否已用掉 ENOENT 的「失效缓存 + 重试一次」额度（v2.8.11，防无限重试）。 */
    this.spawnRetried = false;
    /** 是否已 dispose（防止卸载后重新拉起）。 */
    this.disposed = false;
    /** 缓存的启动认证 URL（DSH ≥0.1.2 打印的带 token 链接；'' = 未解析到）。 */
    this.launchUrl = "";
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.opts = opts;
    this.deps = {
      probe: (_a = deps == null ? void 0 : deps.probe) != null ? _a : (ep) => defaultProbe(ep, opts.probeTimeoutMs),
      spawnProcess: (_b = deps == null ? void 0 : deps.spawnProcess) != null ? _b : defaultSpawnProcess,
      // v2.8.11：spawn 环境（合并 PATH）。缺省实现走 exec-env；测试注入以锁定「服务必须带合并 PATH」
      spawnEnv: (_c = deps == null ? void 0 : deps.spawnEnv) != null ? _c : () => refreshedEnv(),
      // v2.8.11：拉起前抓一次登录 shell 的真实 PATH（Windows 空操作；POSIX 有界 + 记忆化）
      prepareEnv: (_d = deps == null ? void 0 : deps.prepareEnv) != null ? _d : () => prepareExecEnvAsync(),
      acquirePort: (_e = deps == null ? void 0 : deps.acquirePort) != null ? _e : (p, managed) => acquirePort(p, managed),
      killManaged: (_f = deps == null ? void 0 : deps.killManaged) != null ? _f : (p) => killManagedForPort(p)
    };
    this.pollIntervalMs = (_g = opts.pollIntervalMs) != null ? _g : DEFAULT_POLL_INTERVAL_MS;
    this.readyTimeoutMs = (_h = opts.readyTimeoutMs) != null ? _h : DEFAULT_READY_TIMEOUT_MS;
  }
  /** 当前端点（连接事实源；探活/HTTP 请求/展示串都从这里取）。 */
  get endpoint() {
    return this.opts.endpoint;
  }
  /** 当前端口（启动日志名、受管注册、端口裁决等仍按端口执行）。 */
  get port() {
    return this.opts.endpoint.port;
  }
  /** 当前端口对应的启动输出日志路径。 */
  get launchLog() {
    return launchLogFile(this.port);
  }
  /**
   * 解析服务启动输出中的认证 URL（`dsh web: http://127.0.0.1:<port>/?token=...`）。
   * DSH <0.1.2 不打印 token → 返回 ''（正常）；≥0.1.2 用它让「在浏览器打开」绕过 401。
   *
   * v2.4.0：**每次调用都重读日志**（不再永久缓存）。token 每进程重新生成，缓存旧 token 会让
   * 面板与直发请求命中 `dsh web authentication required`（服务被外部重启、崩溃重启、插件重装等
   * 不走 restartDshService 的路径都会换 token）。start() 会截断日志，所以**日志内容即当前进程真值**：
   * 解析为空 → 说明新进程还没打印 → 清掉旧值，避免继续使用上一进程的 token。
   * 日志只有几百字节且本方法调用频率低（渲染面板、发送时），重读成本可忽略。
   */
  getLaunchUrl() {
    try {
      this.launchUrl = parseLaunchUrl((0, import_node_fs4.readFileSync)(this.launchLog, "utf8"));
    } catch (e) {
    }
    return this.launchUrl;
  }
  /**
   * 丢弃缓存的启动认证 URL（v2.4.0）：DSH 升级/重启后 token 会换新，
   * 继续用旧 token 会让面板与直发请求命中 `dsh web authentication required`。
   * 清缓存后 getLaunchUrl() 会从本次启动日志重新解析（start() 已截断日志）。
   */
  clearLaunchUrl() {
    this.launchUrl = "";
  }
  /** 本服务所属 profile（注册表条目字段）。 */
  profileName() {
    return this.opts.profile === void 0 || this.opts.profile === "" ? "web" : this.opts.profile;
  }
  /** 当前受管 pid 集合：注册表（全端口）+ 本会话子进程根。 */
  managedPids() {
    var _a;
    const set = new Set(readManagedProcs().map((r) => r.pid));
    const childPid = (_a = this.child) == null ? void 0 : _a.pid;
    if (childPid !== void 0) set.add(childPid);
    return [...set];
  }
  /** 探测一次服务是否在线。 */
  async probe() {
    return this.deps.probe(this.endpoint);
  }
  /**
   * 等待端口真正释放（v2.4.4）：杀掉旧进程后立刻 `ensureOnline()` 会踩到"旧进程仍在应答"的竞态
   * （判为 online → 不拉起新服务 → 面板白屏；再重启一次才正常）。这里轮询到端口不再应答为止。
   * 返回 true 表示已释放；false 表示超时仍被占用（交由调用方决定是否继续）。
   */
  async waitPortFree(timeoutMs = 12e3) {
    const deadline = Date.now() + timeoutMs;
    for (; ; ) {
      if (!await this.probe()) return true;
      if (Date.now() > deadline) return false;
      await new Promise((resolve2) => window.setTimeout(resolve2, 300));
    }
  }
  /**
   * 面板是否需要认证（v2.4.4 三态）：'auth' 必须先拿到启动 token 才能内嵌；
   * 'open' 可直接嵌入；'unknown' 探测失败（调用方按"保守等待"处理）。
   */
  async panelNeedsAuth() {
    return probePanelNeedsAuth(this.endpoint);
  }
  /** i18n 参数：错误文案统一带 {addr}（endpointLabel）与 {port}（部分 key 仍按端口描述）。 */
  i18nVars() {
    return { addr: endpointLabel(this.endpoint), port: this.port };
  }
  /** 服务离线时的原因描述（优先进程退出/spawn 错误，其次自动启动开关，兜底通用描述）。 */
  describeOffline() {
    if (this.spawnError) {
      return this.spawnError;
    }
    if (!this.opts.autoStart) {
      return t("svc.offlineNoAuto", this.i18nVars());
    }
    if (this.spawned) {
      return t("svc.stopped", this.i18nVars());
    }
    return t("svc.offline", this.i18nVars());
  }
  /**
   * 确保服务在线：先探活，离线时按 autoStart 决定启动并轮询等待就绪。
   * 返回最终服务状态（online / failed）。
   * v2.6.0：拉起前经 acquirePort 裁决端口——只清受管残留；被外部 DSH（如 desktop 实例）
   * 占用时明确失败并提示改端口，**绝不**终止外部实例（多 profile 协同底线）。
   */
  async ensureOnline() {
    var _a;
    if (await this.probe()) {
      return { kind: "online" };
    }
    if (!this.opts.autoStart) {
      return { kind: "failed", message: t("svc.ensureOffline", this.i18nVars()) };
    }
    try {
      await ((_a = this.deps.prepareEnv) != null ? _a : () => Promise.resolve())();
    } catch (e) {
    }
    const acquisition = await this.deps.acquirePort(this.port, this.managedPids());
    if (acquisition === "external") {
      return { kind: "failed", message: t("svc.portOwnedByExternal", this.i18nVars()) };
    }
    this.start();
    const deadline = Date.now() + this.readyTimeoutMs;
    while (Date.now() < deadline) {
      if (this.disposed) {
        return { kind: "failed", message: t("svc.unloaded") };
      }
      if (this.spawnError) {
        this.reportSpawnFailure(this.spawnError);
        return { kind: "failed", message: t("svc.startFailed", { err: this.spawnError }) };
      }
      await delay(this.pollIntervalMs);
      if (await this.probe()) {
        return { kind: "online" };
      }
    }
    if (this.spawnEvidence !== null) {
      this.reportSpawnFailure(this.spawnEvidence);
      return { kind: "failed", message: t("svc.startFailed", { err: this.spawnEvidence }) };
    }
    const seconds = Math.ceil(this.readyTimeoutMs / 1e3);
    return { kind: "failed", message: t("svc.timeout", { sec: seconds }) };
  }
  /** 把 spawn 失败证据交给调用方（插件侧写进 `dsh-panel-diag.log`）；回调抛错不影响主流程。 */
  reportSpawnFailure(detail) {
    var _a, _b;
    try {
      (_b = (_a = this.opts).onSpawnFailure) == null ? void 0 : _b.call(_a, detail);
    } catch (e) {
    }
  }
  /**
   * 拉起服务子进程（新一次启动；重置 ENOENT 重试额度）。
   * 已 dispose 或已启动（child 存活）则忽略。命令为空时抛错。
   */
  start() {
    this.spawnRetried = false;
    this.spawnEvidence = null;
    this.spawnOnce();
  }
  /** 单次拉起（ENOENT 重试路径复用它，避免重置重试额度造成无限重试）。 */
  spawnOnce() {
    var _a;
    if (this.disposed) {
      return;
    }
    if (this.child) {
      return;
    }
    const { command, args } = renderCommand(this.opts.startupCommand, this.port);
    if (!command) {
      throw new Error(t("svc.noCommand"));
    }
    this.spawnError = null;
    this.launchUrl = "";
    try {
      (0, import_node_fs4.writeFileSync)(this.launchLog, "");
      pendingLaunchLog = this.launchLog;
    } catch (e) {
      pendingLaunchLog = null;
    }
    const env = ((_a = this.deps.spawnEnv) != null ? _a : () => refreshedEnv())();
    const child = this.deps.spawnProcess(command, args, this.opts.startupCwd, this.opts.detached, env);
    pendingLaunchLog = null;
    this.child = child;
    this.spawned = true;
    const rootPid = child.pid;
    if (rootPid !== void 0 && rootPid > 0) {
      registerManagedProc({ pid: rootPid, port: this.port, profile: this.profileName(), startedAt: Date.now() });
    }
    child.on("exit", (code) => {
      var _a2;
      this.child = null;
      if (rootPid !== void 0 && rootPid > 0) unregisterManagedProc(rootPid);
      if (code !== 0 && code !== null) {
        this.spawnError = (_a2 = this.spawnError) != null ? _a2 : t("svc.exited", { code });
      }
    });
    child.on("error", (err) => {
      const evidence = describeSpawnError(err, command, args);
      this.spawnError = evidence;
      this.spawnEvidence = evidence;
      this.child = null;
      if (rootPid !== void 0 && rootPid > 0) unregisterManagedProc(rootPid);
      if (err.code === "ENOENT" && !this.spawnRetried) {
        this.spawnRetried = true;
        invalidateRefreshedPath();
        void prepareExecEnvAsync({ force: true }).catch(() => "");
        try {
          this.spawnOnce();
        } catch (e) {
          this.spawnError = evidence;
        }
      }
    });
  }
  /**
   * v2.6.0 作用域重启（取代旧「全机杀所有 DSH 进程」的常规重启语义）：
   * 只终止受管（本插件登记拉起）的端口残留；杀完等端口真正释放（v2.4.4 竞态教训保留）。
   * @returns 'ok'＝端口已可为新进程让位（含本来就空闲）；'external'＝端口在线但占用者非受管
   * （外部 DSH 实例/升级前遗留的无注册表旧实例）——调用方据此走确认路径，不静默杀。
   */
  async restartManaged(waitFreeMs = 12e3) {
    const killed = await this.deps.killManaged(this.port);
    if (killed === 0) {
      return await this.probe() ? "external" : "ok";
    }
    const free = await this.waitPortFree(waitFreeMs);
    if (free) return "ok";
    return await this.probe() ? "external" : "ok";
  }
  /** 回收资源：非 detached 子进程将被终止；Windows 按进程树、POSIX 按进程组整组回收。 */
  dispose() {
    this.disposed = true;
    if (this.child && !this.opts.detached) {
      const pid = this.child.pid;
      if (pid && process.platform === "win32") {
        try {
          (0, import_node_child_process2.execFileSync)("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
        } catch (e) {
        }
      } else if (pid) {
        try {
          process.kill(-pid, "SIGTERM");
        } catch (e) {
        }
      } else {
        this.child.kill();
      }
      this.child = null;
    }
  }
};

// src/updater.ts
var import_node_child_process3 = require("node:child_process");
var import_node_fs6 = require("node:fs");
var import_node_https2 = require("node:https");
var import_node_path4 = require("node:path");

// src/dsh-identity.ts
var import_node_fs5 = require("node:fs");
var import_node_os3 = require("node:os");
var import_node_path3 = require("node:path");
var OFFICIAL_DSH_PACKAGE = "@deepseek-ai/dsh";
var OFFICIAL_DSH_ROOT_PACKAGE = "@deepseek-ai/dsh-root";
var LEGACY_DSH_ROOT_PACKAGE = "deepseek-harness";
var OFFICIAL_DSH_NAMES = [
  OFFICIAL_DSH_PACKAGE,
  OFFICIAL_DSH_ROOT_PACKAGE,
  LEGACY_DSH_ROOT_PACKAGE
];
function isOfficialDshPackageName(name) {
  if (typeof name !== "string") return false;
  return OFFICIAL_DSH_NAMES.includes(name.trim());
}
function readDshPackageIdentity(dir) {
  const pkgPath = (0, import_node_path3.join)(dir, "package.json");
  if (!dir || !(0, import_node_fs5.existsSync)(pkgPath)) return null;
  try {
    const pkg = JSON.parse((0, import_node_fs5.readFileSync)(pkgPath, "utf8"));
    if (!isOfficialDshPackageName(pkg.name)) return null;
    return {
      name: String(pkg.name).trim(),
      version: typeof pkg.version === "string" ? pkg.version.trim() : ""
    };
  } catch (e) {
    return null;
  }
}
function readPackageName(dir) {
  try {
    const pkg = JSON.parse((0, import_node_fs5.readFileSync)((0, import_node_path3.join)(dir, "package.json"), "utf8"));
    return typeof pkg.name === "string" ? pkg.name : "";
  } catch (e) {
    return "";
  }
}
function isOfficialDshCheckout(dir) {
  var _a;
  if (!dir) return false;
  const base = (_a = dir.replace(/[\\/]+$/, "").split(/[\\/]/).pop()) != null ? _a : "";
  return base === "deepseek-harness" && (0, import_node_fs5.existsSync)((0, import_node_path3.join)(dir, "pnpm-workspace.yaml")) && (0, import_node_fs5.existsSync)((0, import_node_path3.join)(dir, "apps", "cli", "src", "bin.ts"));
}
function globalDshManifestCandidates(homeDir = (0, import_node_os3.homedir)()) {
  var _a, _b;
  const roots = [];
  if (process.platform === "win32") {
    const appdata = (_a = process.env.APPDATA) != null ? _a : "";
    if (appdata !== "") roots.push((0, import_node_path3.join)(appdata, "npm", "node_modules"));
    roots.push((0, import_node_path3.join)(homeDir, "AppData", "Roaming", "npm", "node_modules"));
  } else {
    roots.push("/usr/local/lib/node_modules", "/opt/homebrew/lib/node_modules", (0, import_node_path3.join)(homeDir, ".npm-global", "lib", "node_modules"));
  }
  const prefix = ((_b = process.env.NPM_CONFIG_PREFIX) != null ? _b : "").trim();
  if (prefix !== "") roots.push((0, import_node_path3.join)(prefix, "lib", "node_modules"), (0, import_node_path3.join)(prefix, "node_modules"));
  return [...new Set(roots)].map((root) => (0, import_node_path3.join)(root, "@deepseek-ai", "dsh", "package.json"));
}
function readGlobalDshVersion(homeDir = (0, import_node_os3.homedir)()) {
  for (const manifest of globalDshManifestCandidates(homeDir)) {
    if (!(0, import_node_fs5.existsSync)(manifest)) continue;
    try {
      const pkg = JSON.parse((0, import_node_fs5.readFileSync)(manifest, "utf8"));
      if (!isOfficialDshPackageName(pkg.name)) continue;
      if (typeof pkg.version === "string" && pkg.version.trim() !== "") return pkg.version.trim();
    } catch (e) {
    }
  }
  return "";
}

// src/updater.ts
var DSH_MIN_SUPPORTED = "0.1.5-rc.1";
var DSH_LEGACY_SUPPORTED_MAX = [0, 1, 1];
var DSH_KNOWN_INCOMPATIBLE = [
  [0, 1, 2],
  [0, 1, 3],
  [0, 1, 4]
];
function parseCoreTriple(version) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(version.trim().toLowerCase());
  if (m === null) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function compareTriple(a, b) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}
function classifyDshTarget(remoteVersion) {
  const v = remoteVersion.trim();
  if (v === "") return "unknown";
  const core = parseCoreTriple(v);
  if (core === null) return "unknown";
  for (const bad of DSH_KNOWN_INCOMPATIBLE) {
    if (compareTriple(core, bad) === 0) return "known-incompatible";
  }
  if (compareTriple(core, DSH_LEGACY_SUPPORTED_MAX) <= 0) return "supported";
  const min = parseCoreTriple(DSH_MIN_SUPPORTED);
  if (min === null) return "unknown";
  return compareTriple(core, min) >= 0 ? "supported" : "unknown";
}
function isKnownIncompatibleDsh(version) {
  return classifyDshTarget(version) === "known-incompatible";
}
var UPDATE_CHANNELS = ["stable", "preview", "dev"];
var DEFAULT_UPDATE_CHANNEL = "preview";
function normalizeUpdateChannel(value) {
  return typeof value === "string" && UPDATE_CHANNELS.includes(value) ? value : DEFAULT_UPDATE_CHANNEL;
}
function channelAllows(channel, version) {
  const p = parseVersion(version);
  if (p === null) return false;
  if (p.prerelease === null) return true;
  if (channel === "dev") return true;
  if (channel === "preview") return p.prerelease.kind === "rc" || p.prerelease.kind === "beta";
  return false;
}
function pickBestVersion(versions, channel) {
  let best = null;
  for (const v of versions) {
    if (!channelAllows(channel, v)) continue;
    if (best === null || compareVersions(v, best) > 0) best = v;
  }
  return best;
}
function collectTagVersions(output) {
  const found = [];
  for (const line of output.split("\n")) {
    const v = extractTagVersion(line);
    if (v !== null && parseVersion(v) !== null) found.push(v);
  }
  return found;
}
function run(exec, args, timeoutMs = 3e4) {
  return new Promise((resolve2) => {
    exec("git", args, { timeout: timeoutMs, windowsHide: true, env: refreshedEnv() }, (err, stdout, stderr) => {
      if (err) {
        resolve2({
          ok: false,
          out: "",
          err: String(stderr != null ? stderr : "").trim(),
          missing: err.code === "ENOENT"
        });
      } else {
        resolve2({ ok: true, out: String(stdout).trim(), err: "" });
      }
    });
  });
}
async function getLocalDshVersion(repoDir, exec = import_node_child_process3.execFile) {
  const identity = readDshPackageIdentity(repoDir);
  if (identity !== null && identity.version !== "") return identity.version;
  if (contradictsOfficialIdentity(repoDir)) return t("up.unknown");
  const r = await run(exec, ["-C", repoDir, "rev-parse", "HEAD"]);
  return r.ok && r.out ? r.out.slice(0, 7) : t("up.unknown");
}
function contradictsOfficialIdentity(dir) {
  if (readDshPackageIdentity(dir) !== null) return false;
  const name = readPackageName(dir);
  return name !== "" && !isOfficialDshCheckout(dir);
}
function gitFailMessage(r, mirrorTried) {
  if (r.missing === true) return t("up.gitMissing");
  const err = r.err || t("err.unknown");
  return t("up.githubFail", { err }) + (mirrorTried ? t("up.mirrorFail", { err }) : "");
}
function extractTagVersion(line) {
  const m = /refs\/tags\/[^^]*?([0-9]+\.[0-9]+\.[0-9]+[\w.-]*)$/.exec(line);
  return m ? m[1] : null;
}
function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?/.exec(v.trim());
  if (!m) return null;
  const pre = m[4] !== void 0 ? { kind: m[4], num: Number(m[5]) } : null;
  return { core: [Number(m[1]), Number(m[2]), Number(m[3])], prerelease: pre };
}
var PRE_ORDER = { alpha: 0, beta: 1, rc: 2, stable: 3 };
function isStableVersion(v) {
  const p = parseVersion(v);
  return p !== null && p.prerelease === null;
}
function compareVersions(a, b) {
  var _a, _b, _c, _d;
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return a === b ? 0 : a < b ? -1 : 1;
  for (let i = 0; i < 3; i++) {
    if (pa.core[i] !== pb.core[i]) return pa.core[i] > pb.core[i] ? 1 : -1;
  }
  const ka = PRE_ORDER[(_b = (_a = pa.prerelease) == null ? void 0 : _a.kind) != null ? _b : "stable"];
  const kb = PRE_ORDER[(_d = (_c = pb.prerelease) == null ? void 0 : _c.kind) != null ? _d : "stable"];
  if (ka !== kb) return ka > kb ? 1 : -1;
  if (pa.prerelease === null && pb.prerelease === null) return 0;
  if (pa.prerelease === null) return 1;
  if (pb.prerelease === null) return -1;
  if (pa.prerelease.num !== pb.prerelease.num) return pa.prerelease.num > pb.prerelease.num ? 1 : -1;
  return 0;
}
function bestTagVersion(output, channel) {
  return pickBestVersion(collectTagVersions(output), channel);
}
async function checkDshUpdates(repoDir, exec = import_node_child_process3.execFile, opts = {}) {
  var _a, _b;
  const pullCommand = `cd "${repoDir}" && git pull`;
  if (!repoDir || !(0, import_node_fs6.existsSync)((0, import_node_path4.join)(repoDir, ".git"))) {
    return {
      state: "error",
      message: t("up.noRepo"),
      pullCommand
    };
  }
  const identity = readDshPackageIdentity(repoDir);
  if (contradictsOfficialIdentity(repoDir)) {
    return { state: "error", message: t("up.noRepo"), pullCommand };
  }
  const localVersion = identity !== null && identity.version !== "" ? identity.version : null;
  let localHash = "";
  const local = await run(exec, ["-C", repoDir, "rev-parse", "HEAD"]);
  if (local.ok && local.out) {
    localHash = local.out.trim();
  } else if (!localVersion) {
    return { state: "error", message: t("up.noLocal"), pullCommand };
  }
  let tags = await run(exec, ["-C", repoDir, "ls-remote", "--tags", "origin"], 45e3);
  let mirrorTried = false;
  if ((!tags.ok || !tags.out) && opts.mirrorUrl) {
    mirrorTried = true;
    tags = await run(exec, ["-C", repoDir, "ls-remote", "--tags", opts.mirrorUrl], 45e3);
  }
  if (!tags.ok) {
    return {
      state: "error",
      message: gitFailMessage(tags, mirrorTried),
      pullCommand
    };
  }
  const channel = normalizeUpdateChannel(opts.channel);
  const remoteVersion = bestTagVersion(tags.out, channel);
  if (remoteVersion === null) {
    return {
      state: "up-to-date",
      message: t("up.stableOnly", { v: localVersion != null ? localVersion : localHash }),
      pullCommand,
      localVersion: localVersion != null ? localVersion : localHash
    };
  }
  if (localVersion) {
    if (compareVersions(localVersion, remoteVersion) >= 0) {
      return { state: "up-to-date", message: t("up.latest", { v: localVersion }), pullCommand, localVersion };
    }
    return {
      state: "behind",
      prerelease: !isStableVersion(remoteVersion),
      message: t(channel === "stable" ? "up.behindVer" : "up.prereleaseBehind", { local: localVersion, remote: remoteVersion }),
      pullCommand,
      remoteVersion,
      localVersion
    };
  }
  let remote = await run(exec, ["-C", repoDir, "ls-remote", "origin", "HEAD"], 45e3);
  if ((!remote.ok || !remote.out) && opts.mirrorUrl) {
    remote = await run(exec, ["-C", repoDir, "ls-remote", opts.mirrorUrl, "HEAD"], 45e3);
  }
  if (!remote.ok || !remote.out) {
    return {
      state: "error",
      message: gitFailMessage(remote, mirrorTried),
      pullCommand
    };
  }
  const remoteShort = (_b = (_a = remote.out.split(/\s+/)[0]) == null ? void 0 : _a.slice(0, 7)) != null ? _b : "";
  if (localHash.slice(0, 7) === remoteShort) {
    return { state: "up-to-date", message: t("up.latest", { v: localHash.slice(0, 7) }), pullCommand, localVersion: localHash };
  }
  return {
    state: "behind",
    message: t("up.behind", { local: localHash.slice(0, 7), remote: remoteShort }),
    pullCommand,
    remoteVersion: remoteShort,
    localVersion: localHash
  };
}
async function pullDshUpdates(repoDir, exec = import_node_child_process3.execFile, opts = {}) {
  let pull = await run(exec, ["-C", repoDir, "pull", "--ff-only", "--quiet"]);
  let mirrorTried = false;
  if (!pull.ok && opts.mirrorUrl) {
    mirrorTried = true;
    pull = await run(exec, ["-C", repoDir, "pull", "--ff-only", "--quiet", opts.mirrorUrl]);
  }
  if (pull.ok) {
    return {
      ok: true,
      message: t("up.done", { dir: repoDir })
    };
  }
  const dirty = await localDirtyFiles(repoDir, exec);
  if (dirty.length > 0) {
    const list = dirty.slice(0, 5).join("\u3001") + (dirty.length > 5 ? ` \u7B49 ${dirty.length} \u4E2A\u6587\u4EF6` : "");
    return {
      ok: false,
      message: t("up.dirty", { files: list }) + (mirrorTried ? t("up.mirrorFail", { err: pull.err || t("err.unknown") }) : "")
    };
  }
  const ahead = await countLocalAhead(repoDir, exec);
  const diverged = ahead > 0;
  const err = pull.err || t("err.unknown");
  return {
    ok: false,
    message: (diverged ? t("up.diverged", { count: String(ahead) }) : t("up.fail", { err })) + (mirrorTried ? t("up.mirrorFail", { err }) : "")
  };
}
async function localDirtyFiles(repoDir, exec) {
  const r = await run(exec, ["-C", repoDir, "status", "--short"], 15e3);
  if (!r.ok || !r.out) return [];
  return r.out.split("\n").map((line) => line.trim().replace(/^[ MADRCU?!]{1,2}\s+/, "")).filter(Boolean).slice(0, 20);
}
async function countLocalAhead(repoDir, exec) {
  const branch = await run(exec, ["-C", repoDir, "rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch.ok || !branch.out || branch.out === "HEAD") return 0;
  const upstream = await run(exec, ["-C", repoDir, "rev-parse", "--abbrev-ref", `${branch.out}@{upstream}`]);
  if (!upstream.ok || !upstream.out) return 0;
  const count = await run(exec, ["-C", repoDir, "rev-list", "--count", `${upstream.out}..HEAD`]);
  if (!count.ok) return 0;
  const n = Number(count.out.trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}
var NPM_REGISTRIES = ["https://registry.npmmirror.com", "https://registry.npmjs.org"];
var DSH_GITHUB_URLS = [
  "https://github.com/deepseek-ai/deepseek-harness.git",
  "https://gh-proxy.com/https://github.com/deepseek-ai/deepseek-harness.git"
];
var DSH_RELEASES_URLS = [
  "https://api.github.com/repos/deepseek-ai/deepseek-harness/releases?per_page=30",
  "https://gh-proxy.com/https://api.github.com/repos/deepseek-ai/deepseek-harness/releases?per_page=30"
];
function versionFromReleaseTag(tag) {
  const m = /(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)$/.exec(tag.trim());
  if (m === null) return null;
  return parseVersion(m[1]) !== null ? m[1] : null;
}
function pickLatestReleaseVersion(json) {
  let rows;
  try {
    rows = JSON.parse(json);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(rows)) return null;
  let best = null;
  for (const row of rows) {
    if (row === null || typeof row !== "object") continue;
    const rec = row;
    if (rec.draft === true || typeof rec.tag_name !== "string") continue;
    const version = versionFromReleaseTag(rec.tag_name);
    if (version === null) continue;
    if (best === null || compareVersions(version, best) > 0) best = version;
  }
  return best;
}
function httpsGetText(url, timeoutMs = 8e3) {
  return new Promise((resolve2) => {
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve2(value);
    };
    const req = (0, import_node_https2.request)(
      url,
      { method: "GET", headers: { accept: "application/vnd.github+json", "user-agent": "dsh-harness-obsidian" } },
      (res) => {
        var _a;
        const status = (_a = res.statusCode) != null ? _a : 0;
        if (status < 200 || status >= 300) {
          res.resume();
          settle(null);
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
          if (body.length > 4 * 1024 * 1024) {
            req.destroy();
            settle(null);
          }
        });
        res.on("end", () => settle(body));
      }
    );
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      settle(null);
    });
    req.on("error", () => settle(null));
    req.end();
  });
}
async function fetchGithubLatestReleaseTag() {
  for (const url of DSH_RELEASES_URLS) {
    const text = await httpsGetText(url);
    if (text === null) continue;
    const version = pickLatestReleaseVersion(text);
    if (version !== null) return version;
  }
  return null;
}
async function probeGithubTagNewer(local, exec = import_node_child_process3.execFile) {
  for (const url of DSH_GITHUB_URLS) {
    const r = await run(exec, ["ls-remote", "--tags", url], 3e4);
    if (!r.ok || !r.out) continue;
    let best = null;
    for (const line of r.out.split("\n")) {
      const v = extractTagVersion(line);
      if (v && compareVersions(v, local) > 0 && (best === null || compareVersions(v, best) > 0)) best = v;
    }
    if (best !== null) return best;
  }
  return null;
}
function runCmd(exec, command, args, timeoutMs = 3e4) {
  return new Promise((resolve2) => {
    const resolved = resolveExec(process.platform, command, args);
    exec(resolved.command, resolved.args, { timeout: timeoutMs, windowsHide: true, env: refreshedEnv() }, (err, stdout, stderr) => {
      if (err) {
        resolve2({
          ok: false,
          out: String(stdout != null ? stdout : "").trim(),
          err: String(stderr != null ? stderr : "").trim(),
          missing: err.code === "ENOENT"
        });
      } else {
        resolve2({ ok: true, out: String(stdout != null ? stdout : "").trim(), err: "" });
      }
    });
  });
}
async function getCliDshVersion(exec = import_node_child_process3.execFile) {
  var _a;
  const r = await runCmd(exec, "dsh", ["--version"], 15e3);
  return r.ok ? ((_a = r.out.split(/\r?\n/)[0]) != null ? _a : "").trim() : "";
}
async function getNpmDistTags(exec) {
  for (const reg of NPM_REGISTRIES) {
    const r = await runCmd(exec, "npm", ["view", "@deepseek-ai/dsh", "dist-tags", "--json", "--registry", reg], 3e4);
    if (!r.ok || r.out === "") continue;
    try {
      const parsed = JSON.parse(r.out);
      if (parsed && typeof parsed === "object") {
        const out = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
        }
        if (Object.keys(out).length > 0) return out;
      }
    } catch (e) {
    }
  }
  return {};
}
async function getNpmLatest(exec) {
  var _a;
  for (const reg of NPM_REGISTRIES) {
    const r = await runCmd(exec, "npm", ["view", "@deepseek-ai/dsh", "dist-tags.latest", "--registry", reg], 3e4);
    if (r.ok && r.out !== "") {
      return ((_a = r.out.split(/\r?\n/)[0]) != null ? _a : "").trim();
    }
  }
  return "";
}
async function pickNpmTarget(exec, channel) {
  const tags = await getNpmDistTags(exec);
  const values = Object.values(tags);
  if (values.length > 0) {
    const best = pickBestVersion(values, channel);
    if (best !== null) return best;
    return "";
  }
  const latest = await getNpmLatest(exec);
  if (latest === "") return "";
  return channelAllows(channel, latest) ? latest : "";
}
async function checkCliUpdate(exec = import_node_child_process3.execFile, channel = DEFAULT_UPDATE_CHANNEL) {
  const pullCommand = "npm i -g @deepseek-ai/dsh@latest";
  const local = await getCliDshVersion(exec);
  if (!local) {
    return { state: "error", message: t("up.noLocal"), pullCommand };
  }
  const remote = await pickNpmTarget(exec, channel);
  if (!remote) {
    const anyTag = Object.keys(await getNpmDistTags(exec)).length > 0 || await getNpmLatest(exec) !== "";
    if (anyTag) {
      return { state: "up-to-date", message: t("up.stableOnly", { v: local }), pullCommand, localVersion: local };
    }
    return { state: "error", message: t("up.githubFail", { err: "npm registry unreachable" }), pullCommand };
  }
  const pinned = `npm i -g @deepseek-ai/dsh@${remote}`;
  if (compareVersions(local, remote) >= 0) {
    const githubNewer = await probeGithubTagNewer(local, exec);
    const message = githubNewer === null ? t("up.latest", { v: local }) : t("up.latestNpmOnly", { v: local, github: githubNewer });
    return { state: "up-to-date", message, pullCommand: pinned, localVersion: local };
  }
  return {
    state: "behind",
    prerelease: !isStableVersion(remote),
    message: t(isStableVersion(remote) ? "up.behindVer" : "up.prereleaseBehind", { local, remote }),
    pullCommand: pinned,
    remoteVersion: remote,
    localVersion: local
  };
}
async function gateByRelease(result, channel = DEFAULT_UPDATE_CHANNEL, fetchTag = fetchGithubLatestReleaseTag) {
  var _a;
  if (result.state !== "behind" || result.remoteVersion === void 0) return result;
  if (parseCoreTriple(result.remoteVersion) === null) return result;
  const release = await fetchTag();
  if (release === null || !channelAllows(channel, release)) return result;
  if (compareVersions(result.remoteVersion, release) <= 0) return result;
  const local = (_a = result.localVersion) != null ? _a : "";
  if (local !== "" && compareVersions(local, release) >= 0) {
    return {
      state: "up-to-date",
      message: t("up.releaseCeiling", { local, remote: result.remoteVersion, tag: release }),
      pullCommand: result.pullCommand,
      localVersion: local
    };
  }
  return {
    state: "behind",
    prerelease: !isStableVersion(release),
    message: t(isStableVersion(release) ? "up.behindVer" : "up.prereleaseBehind", { local, remote: release }),
    pullCommand: result.pullCommand,
    remoteVersion: release,
    localVersion: local
  };
}
async function pullCliUpdate(exec = import_node_child_process3.execFile, spec = "latest") {
  const target = `@deepseek-ai/dsh@${spec.trim() === "" ? "latest" : spec.trim()}`;
  for (const reg of NPM_REGISTRIES) {
    const r = await runCmd(exec, "npm", ["install", "-g", target, "--no-fund", "--no-audit", "--registry", reg], 3e5);
    if (r.ok) {
      return { ok: true, message: t("up.cliDone") };
    }
  }
  return { ok: false, message: t("up.cliFail", { err: `npm install ${target} failed` }) };
}
var defaultHttpGet = (url) => new Promise((resolve2) => {
  (0, import_node_child_process3.execFile)("curl.exe", ["-L", "-sS", "--max-time", "25", url], { timeout: 3e4, windowsHide: true }, (err, stdout) => {
    if (err) {
      resolve2({ ok: false, text: "" });
    } else {
      resolve2({ ok: true, text: String(stdout) });
    }
  });
});
function parseLatestTag(json) {
  try {
    const obj = JSON.parse(json);
    return typeof obj.tag_name === "string" && obj.tag_name !== "" ? obj.tag_name : null;
  } catch (e) {
    return null;
  }
}
async function checkPluginUpdate(get = defaultHttpGet, mirrorBase = "https://gh-proxy.com/") {
  const urls = [
    `https://api.github.com/repos/hjxcloud-tech/dsh-harness/releases/latest`,
    `${mirrorBase}https://api.github.com/repos/hjxcloud-tech/dsh-harness/releases/latest`
  ];
  for (const url of urls) {
    const r = await get(url);
    if (r.ok && r.text !== "") {
      const tag = parseLatestTag(r.text);
      if (tag !== null) {
        return { remote: tag.replace(/^v/, ""), reachable: true };
      }
    }
  }
  return { remote: null, reachable: false };
}

// src/compat.ts
var DSH_ADAPTED_MIN = "0.1.5-rc.1";
var DSH_ADAPTED_MAX_TESTED = "0.2.2-rc.1";
var DSH_TESTED_VERSIONS = [
  "0.1.5-rc.1",
  "0.1.5-rc.2",
  "0.1.6-alpha.1",
  "0.1.7-rc.1",
  "0.1.7-rc.2",
  "0.2.0-rc.1",
  "0.2.0-rc.2",
  "0.2.1-rc.2",
  "0.2.1-rc.4",
  "0.2.2-rc.1"
];
function normalizeVersion(version) {
  return (version != null ? version : "").trim().replace(/^v/i, "");
}
function judgeDshCompat(version) {
  const v = normalizeVersion(version);
  if (v === "" || parseCoreTriple(v) === null) return "unknown";
  if (classifyDshTarget(v) === "known-incompatible") return "incompatible";
  if (DSH_TESTED_VERSIONS.includes(v)) return "tested";
  if (compareVersions(v, DSH_ADAPTED_MIN) < 0) return "legacy";
  if (compareVersions(v, DSH_ADAPTED_MAX_TESTED) > 0) return "untested-newer";
  return "within-line";
}
function compatIssue(level, bridge) {
  if (level === "incompatible") return "incompatible";
  if (bridge === "not-installed") return "bridge-not-installed";
  if (bridge === "not-live") return "bridge-not-live";
  if (level === "untested-newer") return "untested";
  if (level === "legacy") return "legacy";
  return null;
}
function repairCapabilityLimited(version) {
  if (!version) return false;
  const v = parseCoreTriple(version);
  if (!v) return false;
  const [maj, min, pat] = v;
  if (maj !== 0) return maj > 0;
  if (min !== 1) return min > 1;
  return pat >= 7;
}
function fallbackTargetFor(current2) {
  const max = DSH_ADAPTED_MAX_TESTED;
  const cur = normalizeVersion(current2);
  if (cur !== "" && compareVersions(cur, max) > 0) return max;
  let best = null;
  for (const v of DSH_TESTED_VERSIONS) {
    if (compareVersions(v, max) > 0) continue;
    if (cur !== "" && compareVersions(v, cur) >= 0) continue;
    if (best === null || compareVersions(v, best) > 0) best = v;
  }
  if (best !== null) return best;
  return cur !== "" ? cur : max;
}
function adaptedRangeLabel() {
  return `${DSH_ADAPTED_MIN} ~ ${DSH_ADAPTED_MAX_TESTED}`;
}

// src/compat-diff.ts
var import_node_fs7 = require("node:fs");
var import_node_path5 = require("node:path");
var COMPAT_BASELINE_VERSION = "0.2.2-rc.1";
var COMPAT_BASELINE_FILES = 1215;
var SCANNED = [".js", ".mjs", ".cjs"];
var MAX_FILE = 6 * 1024 * 1024;
var MAX_FILES = 8e3;
var MIN_SCAN_RATIO = 0.4;
var SEAM_BASELINE = [
  { id: "webServer.tapIndex", re: /tapIndex/g, why: "\u6865\u63A5\u5F80 index.html \u6CE8\u5165\u9875\u9762\u811A\u672C\u7684\u552F\u4E00\u5165\u53E3", hits: 6, files: 2 },
  { id: "connection.requestRejection", re: /requestRejection/g, why: "\u5D4C\u5165\u8BA4\u8BC1\u9002\u914D\u5668\u5305\u88F9\u7684\u62D2\u7EDD\u51FD\u6570", hits: 7, files: 5 },
  { id: "connection.admit", re: /admit\((req|request)\)/g, why: "0.2.1 \u8D77 /api \u4E0E WS \u5347\u7EA7\u7684\u76F4\u63A5\u9274\u6743\u95E8\uFF08\u4E0D\u518D\u7ECF requestRejection\uFF09\uFF0C\u6865\u63A5\u636E\u6B64\u5916\u5305\u653E\u884C\u5D4C\u5165\u51ED\u636E", hits: 5, files: 1 },
  { id: "connection.authorizeIndex", re: /authorizeIndex/g, why: "index \u9875\u9274\u6743\uFF08ob=1 \u76F4\u53D1\u653E\u884C\uFF1B0.2.2 \u8D77\u7531 Fetch \u8D44\u6E90\u8C03\u7528\uFF0C\u547D\u4E2D 10\u219212\uFF09", hits: 12, files: 4 },
  { id: "connection.authenticatedUrl", re: /authenticatedUrl/g, why: "\u5E26 token \u7684\u542F\u52A8 URL \u751F\u6210", hits: 8, files: 3 },
  { id: "launchToken \u6BCF\u8FDB\u7A0B\u968F\u673A", re: /launchToken/g, why: "\u5916\u90E8\u5B9E\u4F8B token \u4E0D\u53EF\u9644\u52A0 \u21D2 \u53EA\u80FD\u81EA\u8D77\u5B9E\u4F8B", hits: 5, files: 1 },
  { id: "agent/pre-step \u94A9\u5B50", re: /["']agent\/pre-step["']/g, why: "\u9690\u5F0F\u884C\u7684\u9690\u85CF\u7F16\u8F91\u6307\u4EE4\u6CE8\u5165", hits: 23, files: 22 },
  { id: "agent.inbox \u4E00\u6B21\u6027\u6295\u9012", re: /agent\.inbox/g, why: "pre-step \u4E4B\u5916\u7684\u4F1A\u8BDD\u5185\u76F4\u6295", hits: 49, files: 13 },
  { id: "\u5F15\u5BFC marker __DSH_BOOT__", re: /__DSH_BOOT__/g, why: "AED \u542F\u52A8\u5065\u5EB7\u6821\u9A8C\u5224\u636E", hits: 13, files: 6 },
  { id: "client.js face createClientModuleSystem", re: /createClientModuleSystem/g, why: "boot face \u6821\u9A8C\uFF08bundle-face \u9519\u8BEF\u5206\u7C7B\uFF09", hits: 5, files: 2 },
  { id: "dsh-client-modules \u5305", re: /dsh-client-modules/g, why: "\u5BA2\u6237\u7AEF\u6A21\u5757\u53D1\u73B0\u4E0E\u9884\u52A0\u8F7D", hits: 4, files: 3 },
  { id: "embed token \u53D8\u91CF __DSH_EMBED_TOKEN__", re: /__DSH_EMBED_TOKEN__/g, why: "\u9875\u9762\u811A\u672C\u8BFB\u542F\u52A8 token \u7684\u5165\u53E3", hits: 0, files: 0 },
  { id: "\u5B98\u65B9\u4E0A\u4F20\u94A9\u5B50 __DSH_FILE_UPLOAD__", re: /__DSH_FILE_UPLOAD__/g, why: "\u4E0A\u4F20\u515C\u5E95\u8F7D\u4F53\uFF08pre-Cordis \u94A9\u5B50\uFF09", hits: 2, files: 2 },
  { id: "\u4E0A\u4F20 Worker \u5177\u540D dsh-file-upload", re: /dsh-file-upload/g, why: "\u9762\u677F\u5185\u4E0A\u4F20\u8865\u4E01\u7684\u547D\u4E2D\u4F9D\u636E", hits: 2, files: 2 },
  { id: "\u4E0A\u4F20\u8DEF\u7531 uploadFileBinary", re: /uploadFileBinary/g, why: "\u51ED\u636E\u6CE8\u5165\u7684\u76EE\u6807\u7AEF\u70B9", hits: 3, files: 3 },
  { id: "home \u8DEF\u5F84 DSH_HOME \u7EA6\u5B9A", re: /dsh-home-paths|DSH_HOME/g, why: "profile/\u6865\u63A5\u6587\u4EF6\u843D\u4F4D", hits: 71, files: 14 },
  { id: "\u4F1A\u8BDD\u683C\u5F0F\u76EE\u5F55 session-format-catalog", re: /session-format-catalog/g, why: "\u4F1A\u8BDD\u4FEE\u590D\u7528\u7684\u8FC1\u79FB\u94FE", hits: 7, files: 5 },
  { id: "\u4F1A\u8BDD\u683C\u5F0F v4 \u6E90 kind \u786C\u62D2\uFF08producer-owned\uFF09", re: /producer-owned source kind/g, why: 'v4 \u8D77\u901A\u7528 kind:"plugin" \u6E90\u5305\u88F9\u5C42\u88AB\u786C\u62D2\uFF1B\u884C\u4E3A\u662F\u5426\u517C\u5BB9\u4ECD\u4EE5 verify-source-kind-admission \u4E3A\u51C6', hits: 2, files: 2 },
  { id: "bundle \u58F0\u660E dsh.bundle.patch", re: /dsh\.bundle\.patch/g, why: "AED \u5065\u5EB7\u63A2\u6D4B\u4E0E\u7981\u7528\u5757\u8BED\u4E49", hits: 7, files: 6 },
  { id: "profile \u6A21\u677F PROFILE_TEMPLATES", re: /PROFILE_TEMPLATES/g, why: "\u5185\u7F6E\u6863\u540D\u4FDD\u7559\u540D\u5355\u7684\u4E8B\u5B9E\u6E90", hits: 15, files: 5 },
  { id: "\u4EE3\u5EFA\u53C2\u6570 --from-default-profile", re: /from-default-profile/g, why: "\u53EA\u5EFA\u4E0D boot \u7684\u4EE3\u5EFA\u8DEF\u5F84", hits: 4, files: 2 },
  { id: "\u4EE3\u5EFA\u53C2\u6570 --dump-default-config", re: /dump-default-config/g, why: "\u540C\u4E0A\uFF08\u5FC5\u987B\u8D70 dump \u5206\u652F\u624D\u4E0D boot\uFF09", hits: 4, files: 2 },
  { id: "CLI \u9009\u9879 --no-open", re: /no-open/g, why: "\u907F\u514D\u542F\u52A8\u5F39\u6D4F\u89C8\u5668", hits: 10, files: 8 },
  { id: "\u542F\u52A8\u884C `dsh web:` \u683C\u5F0F", re: /dsh web: /g, why: "\u63D2\u4EF6\u4ECE\u5B50\u8FDB\u7A0B stdout \u6355\u83B7 token", hits: 3, files: 1 },
  { id: "\u5BA2\u6237\u7AEF\u63D2\u4EF6\u58F0\u660E dsh.client", re: /dsh\.client|"client"/g, why: "\u672A\u6765\u53CC\u9762\u63D2\u4EF6\u5316\u7684\u5165\u53E3", hits: 102, files: 44 },
  { id: "\u5916\u90E8\u4FEE\u590D\u5DE5\u5177 dsh-fix", re: /dsh-fix/g, why: "AED \u5B89\u5168\u6A21\u5F0F\u62A2\u6551\u94FE\uFF08\u5DE5\u5177\u72EC\u7ACB\u4E8E\u5B89\u88C5\u6811\uFF0C\u57FA\u7EBF\u96F6\u5C5E\u5B9E\u6D4B\u4E8B\u5B9E\uFF09", hits: 0, files: 0 },
  { id: "\u8F93\u5165\u6846 Lexical data-phase", re: /data-phase/g, why: "\u53D7\u63A7\u7F16\u8F91\u5668\u5199\u5165\u5B9A\u4F4D", hits: 12, files: 4 },
  { id: "\u5B98\u65B9\u5199\u5165\u53E3 setDraft", re: /setDraft/g, why: "\u66FF\u4EE3 DOM \u5199\u5165\u7684\u6B63\u89E3\uFF08\u672A\u91C7\u7528\uFF09", hits: 44, files: 8 }
];
function seamScanApplicable(input) {
  return input.verified && input.source === "official-manifest" && input.level === "untested-newer";
}
function findOfficialInstallRoot() {
  for (const manifest of globalDshManifestCandidates()) {
    if (!(0, import_node_fs7.existsSync)(manifest)) continue;
    const pkgDir = (0, import_node_path5.dirname)(manifest);
    if (readDshPackageIdentity(pkgDir) === null) continue;
    const root = (0, import_node_path5.dirname)((0, import_node_path5.dirname)(pkgDir));
    if ((0, import_node_fs7.existsSync)((0, import_node_path5.join)(root, "@deepseek-ai", "dsh"))) return root;
  }
  return null;
}
async function collectFiles(dir, out) {
  let entries;
  try {
    entries = await import_node_fs7.promises.readdir(dir, { withFileTypes: true });
  } catch (e) {
    return true;
  }
  for (const e of entries) {
    if (out.length >= MAX_FILES) return false;
    const p = (0, import_node_path5.join)(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      if (!await collectFiles(p, out)) return false;
    } else if (SCANNED.some((ext) => p.endsWith(ext))) {
      try {
        const st = await import_node_fs7.promises.stat(p);
        if (st.size <= MAX_FILE) out.push(p);
      } catch (e2) {
      }
    }
  }
  return true;
}
async function scanSeamTree(root) {
  var _a, _b;
  const files = [];
  let truncated = false;
  for (const p of [(0, import_node_path5.join)(root, "@deepseek-ai"), (0, import_node_path5.join)(root, "@deepseek-ai", "dsh", "node_modules", "@deepseek-ai")]) {
    if (!(0, import_node_fs7.existsSync)(p)) continue;
    if (!await collectFiles(p, files)) {
      truncated = true;
      break;
    }
  }
  const compiled = SEAM_BASELINE.map((row) => ({ id: row.id, re: new RegExp(row.re.source, "g") }));
  const counts = /* @__PURE__ */ new Map();
  for (let i = 0; i < files.length; i++) {
    if (i > 0 && i % 100 === 0) await new Promise((resolve2) => window.setTimeout(resolve2, 0));
    let text;
    try {
      text = await import_node_fs7.promises.readFile(files[i], "utf8");
    } catch (e) {
      continue;
    }
    for (const c of compiled) {
      const n = ((_a = text.match(c.re)) != null ? _a : []).length;
      if (n > 0) {
        const cur = (_b = counts.get(c.id)) != null ? _b : { hits: 0, files: 0 };
        cur.hits += n;
        cur.files += 1;
        counts.set(c.id, cur);
      }
    }
  }
  return { counts, files: files.length, truncated };
}
function classifySeams(counts) {
  var _a;
  const gone = [];
  const moved = [];
  const extra = [];
  let expected = 0;
  for (const row of SEAM_BASELINE) {
    const c = (_a = counts.get(row.id)) != null ? _a : { hits: 0, files: 0 };
    if (row.hits === 0) {
      if (c.hits > 0) extra.push(row.id);
      continue;
    }
    expected += 1;
    if (c.hits === 0) gone.push(row.id);
    else if (c.hits !== row.hits || c.files !== row.files) moved.push(row.id);
  }
  return { gone, moved, extra, expected, present: expected - gone.length };
}
async function runSeamScan(version, opts = {}) {
  var _a, _b;
  const mk = (state, patch = {}) => ({
    state,
    version,
    baselineVersion: COMPAT_BASELINE_VERSION,
    scannedFiles: 0,
    expected: 0,
    present: 0,
    gone: [],
    moved: [],
    extra: [],
    ...patch
  });
  try {
    const root = (_a = opts.root) != null ? _a : findOfficialInstallRoot();
    if (root === null) return mk("skipped", { reason: "no-root" });
    const { counts, files, truncated } = await scanSeamTree(root);
    const minFiles = (_b = opts.minFiles) != null ? _b : Math.floor(COMPAT_BASELINE_FILES * MIN_SCAN_RATIO);
    if (truncated || files < minFiles) return mk("skipped", { reason: "tree-shape", scannedFiles: files });
    const v = classifySeams(counts);
    const state = v.gone.length > 0 ? "gone" : v.moved.length > 0 ? "moved" : "intact";
    return mk(state, { scannedFiles: files, expected: v.expected, present: v.present, gone: v.gone, moved: v.moved, extra: v.extra });
  } catch (err) {
    return mk("failed", { reason: err instanceof Error ? err.message : String(err) });
  }
}
function seamReasonText(r) {
  var _a;
  if (r.reason === "no-root") return t("compat.seams.reason.noRoot");
  if (r.reason === "tree-shape") return t("compat.seams.reason.treeShape", { f: String(r.scannedFiles) });
  return (_a = r.reason) != null ? _a : "";
}
function seamLineFor(r) {
  if (!r) return "";
  const ids = (list) => list.slice(0, 3).join("\u3001") + (list.length > 3 ? "\u2026" : "");
  switch (r.state) {
    case "gone":
      return t("compat.seams.gone", { k: String(r.gone.length), ids: ids(r.gone) });
    case "moved": {
      const changed = [...r.moved, ...r.extra];
      return t("compat.seams.moved", { k: String(changed.length), ids: ids(changed) });
    }
    case "intact": {
      const line = t("compat.seams.intact", { n: String(r.expected), b: r.baselineVersion });
      return r.extra.length > 0 ? `${line}\uFF08${t("compat.seams.extra", { k: String(r.extra.length) })}\uFF09` : line;
    }
    case "skipped":
      return t("compat.seams.skipped", { why: seamReasonText(r) });
    default:
      return t("compat.seams.failed", { why: seamReasonText(r) });
  }
}

// src/compat-modal.ts
var import_obsidian = require("obsidian");
var CompatNoticeModal = class extends import_obsidian.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: this.opts.title });
    contentEl.createEl("p", { text: this.opts.body });
    if (this.opts.bullets && this.opts.bullets.length > 0) {
      const ul = contentEl.createEl("ul", { cls: "dsh-modal-bullets" });
      for (const item of this.opts.bullets) {
        ul.createEl("li", { text: item });
      }
    }
    if (this.opts.danger) {
      contentEl.createEl("p", { text: this.opts.danger, cls: "dsh-modal-danger" });
    }
    if (this.opts.detail) {
      contentEl.createEl("p", { text: this.opts.detail, cls: "dsh-modal-detail" });
    }
    const row = new import_obsidian.Setting(contentEl);
    row.addButton((b) => b.setButtonText(this.opts.closeLabel).onClick(() => {
      var _a, _b;
      this.close();
      (_b = (_a = this.opts).onClosePress) == null ? void 0 : _b.call(_a);
    }));
    for (const action of this.opts.actions) {
      row.addButton((b) => {
        b.setButtonText(action.label).onClick(() => {
          this.close();
          void action.onClick();
        });
        if (action.cta) b.setCta();
        return b;
      });
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/settings.ts
var import_obsidian5 = require("obsidian");

// src/detector.ts
var import_node_fs8 = require("node:fs");
var import_node_os4 = require("node:os");
var import_node_path6 = require("node:path");
function defaultHasBin(name) {
  return hasBin(name);
}
function isDshRepo(dir) {
  if (readDshPackageIdentity(dir) !== null) {
    return true;
  }
  return isOfficialDshCheckout(dir);
}
function locateDshRepoDir(candidates) {
  for (const dir of candidates) {
    if (dir && (0, import_node_fs8.existsSync)(dir) && isDshRepo(dir)) {
      return dir;
    }
  }
  return null;
}
function defaultCandidates(cwd, homeDir = (0, import_node_os4.homedir)()) {
  const winPaths = process.platform === "win32" ? ["D:\\deepseek-harness", "C:\\deepseek-harness"] : [];
  const posixPaths = process.platform === "darwin" ? ["/opt/deepseek-harness", "/usr/local/deepseek-harness"] : [];
  return [...new Set([cwd, (0, import_node_path6.join)(homeDir, "deepseek-harness"), ...posixPaths, ...winPaths].filter(Boolean))];
}
function detectDshConfig(current2, opts = {}) {
  var _a, _b, _c, _d;
  const homeDir = (_a = opts.homeDir) != null ? _a : (0, import_node_os4.homedir)();
  const hasBin4 = (_b = opts.hasBin) != null ? _b : defaultHasBin;
  const profile = (_c = opts.profile) != null ? _c : "web";
  if (hasBin4("dsh")) {
    const startupCommand = `dsh${profile === "web" ? " web" : ` --profile ${profile}`} --port {port} --no-open`;
    return {
      found: true,
      startupCommand,
      startupCwd: current2.cwd,
      message: t("detect.path", { port: "{port}" })
    };
  }
  const repoDir = locateDshRepoDir((_d = opts.candidates) != null ? _d : defaultCandidates(current2.cwd, homeDir));
  if (!repoDir) {
    return {
      found: false,
      startupCommand: "",
      startupCwd: "",
      message: t("detect.notFound")
    };
  }
  const bin = profile === "web" ? "web" : `--profile ${profile}`;
  const command = hasBin4("pnpm") ? `pnpm dsh ${bin} --port {port}` : `npm run dsh -- ${bin} --port {port}`;
  return {
    found: true,
    startupCommand: command,
    startupCwd: repoDir,
    message: t("detect.found", { dir: repoDir, cmd: command })
  };
}

// src/installer.ts
var import_node_child_process4 = require("node:child_process");
var import_node_fs9 = require("node:fs");
var import_node_os5 = require("node:os");
var import_node_path7 = require("node:path");
var DEFAULT_DSH_REPO_URL = "https://github.com/deepseek-ai/deepseek-harness.git";
var CLONE_TIMEOUT_MS = 3e5;
var INSTALL_TIMEOUT_MS = 6e5;
function run2(exec, command, args, timeoutMs, env) {
  const resolved = resolveExec(process.platform, command, args);
  return new Promise((resolve2) => {
    exec(resolved.command, resolved.args, { timeout: timeoutMs, windowsHide: true, ...env ? { env } : {} }, (err, stdout, stderr) => {
      if (err) {
        resolve2({ ok: false, out: String(stdout != null ? stdout : "").trim(), err: String(stderr != null ? stderr : "").trim() });
      } else {
        resolve2({ ok: true, out: String(stdout != null ? stdout : "").trim(), err: "" });
      }
    });
  });
}
function defaultHasBin2(name) {
  return hasBin(name);
}
function delay2(ms) {
  return new Promise((resolve2) => setTimer(resolve2, ms));
}
var winTimers = typeof window !== "undefined" ? window : void 0;
function setTimer(fn, ms) {
  return (winTimers != null ? winTimers : window).setTimeout(fn, ms);
}
function clearTimer(id) {
  (winTimers != null ? winTimers : window).clearTimeout(id);
}
function setIntervalTimer(fn, ms) {
  return (winTimers != null ? winTimers : window).setInterval(fn, ms);
}
function clearIntervalTimer(id) {
  (winTimers != null ? winTimers : window).clearInterval(id);
}
function cloneWithProgress(targetDir, url, env, onProgress) {
  return new Promise((resolve2) => {
    var _a;
    const child = (0, import_node_child_process4.spawn)(
      "git",
      [
        "clone",
        "--depth",
        "1",
        "--progress",
        "--config",
        "http.postBuffer=524288000",
        "--config",
        "http.lowSpeedLimit=1000",
        "--config",
        "http.lowSpeedTime=30",
        url,
        targetDir
      ],
      { env, windowsHide: true, stdio: ["ignore", "ignore", "pipe"] }
    );
    let stderr = "";
    let last = -1;
    const timer = setTimer(() => child.kill(), CLONE_TIMEOUT_MS);
    (_a = child.stderr) == null ? void 0 : _a.on("data", (chunk) => {
      const s = String(chunk);
      stderr += s;
      const m = s.match(/Receiving objects:\s+(\d+)%/);
      if (m) {
        const pct = Number(m[1]);
        if (pct !== last) {
          last = pct;
          onProgress(pct);
        }
      }
    });
    child.on("error", (err) => {
      clearTimer(timer);
      resolve2({ ok: false, out: "", err: err.message });
    });
    child.on("close", (code) => {
      clearTimer(timer);
      resolve2(code === 0 ? { ok: true, out: "", err: "" } : { ok: false, out: "", err: stderr.trim() });
    });
  });
}
async function runWithTicker(promise, onStep, baseStep, percent, intervalMs = 5e3) {
  let elapsed = 0;
  const id = setIntervalTimer(() => {
    elapsed += intervalMs;
    onStep(`${baseStep}\uFF08${Math.round(elapsed / 1e3)}s\uFF09`, percent);
  }, intervalMs);
  try {
    return await promise;
  } finally {
    clearIntervalTimer(id);
  }
}
function isRescuableDir(dir) {
  try {
    const entries = (0, import_node_fs9.readdirSync)(dir);
    return entries.length === 0 || entries.length === 1 && entries[0] === ".git";
  } catch (e) {
    return false;
  }
}
function checkDeps(opts = {}) {
  var _a;
  const hasBin4 = (_a = opts.hasBin) != null ? _a : defaultHasBin2;
  return { git: hasBin4("git"), node: hasBin4("node"), pnpm: hasBin4("pnpm") };
}
function compareVer(a, b) {
  var _a, _b;
  const pa = a.split(".").map((s) => Number(s) || 0);
  const pb = b.split(".").map((s) => Number(s) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = ((_a = pa[i]) != null ? _a : 0) - ((_b = pb[i]) != null ? _b : 0);
    if (d !== 0) return d;
  }
  return 0;
}
function fetchMirrorJson(url) {
  try {
    const out = (0, import_node_child_process4.execFileSync)("curl.exe", ["-L", "-sS", url], { encoding: "utf8", timeout: 3e4 });
    const parsed = JSON.parse(out);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}
function pickLatestMirrorEntry(entries, match, versionOf) {
  let best = null;
  let bestVer = "";
  for (const e of entries) {
    const name = typeof e.name === "string" ? e.name : "";
    if (!match(name)) continue;
    const ver = versionOf(name);
    if (best === null || compareVer(ver, bestVer) > 0) {
      best = name;
      bestVer = ver;
    }
  }
  return best;
}
function downloadViaCurl(url, dest) {
  return new Promise((resolve2) => {
    const child = (0, import_node_child_process4.spawn)("curl.exe", ["-L", "-sS", "--retry", "2", "-o", dest, url], { stdio: "ignore", windowsHide: true });
    child.on("error", () => resolve2(false));
    child.on("close", (code) => {
      resolve2(code === 0 && (0, import_node_fs9.existsSync)(dest) && (0, import_node_fs9.statSync)(dest).size > 0);
    });
  });
}
function gitDirVer(name) {
  return name.replace(/^v/, "").replace(/\.windows\./, ".").replace(/\/$/, "");
}
async function installGitFromMirror(onStep) {
  onStep(t("install.depMirror"), 26);
  const roots = fetchMirrorJson("https://registry.npmmirror.com/-/binary/git-for-windows/");
  if (roots === null) return { ok: false, message: t("install.depMirrorFail", { err: "mirror listing" }) };
  const dirs = roots.map((e) => typeof e.name === "string" ? e.name : "").filter((n) => /^v\d+\.\d+\.\d+\.windows\.\d+\/$/.test(n)).sort((a, b) => compareVer(gitDirVer(b), gitDirVer(a)));
  let versionDir = null;
  let exe = null;
  for (const dir of dirs) {
    const files = fetchMirrorJson(`https://registry.npmmirror.com/-/binary/git-for-windows/${dir}`);
    const found = files === null ? null : pickLatestMirrorEntry(files, (n) => /^Git-\d+\.\d+\.\d+-64-bit\.exe$/.test(n), (n) => n.replace(/^Git-/, "").replace(/-64-bit\.exe$/, ""));
    if (found !== null) {
      versionDir = dir;
      exe = found;
      break;
    }
  }
  if (versionDir === null || exe === null) return { ok: false, message: t("install.depMirrorFail", { err: "mirror listing" }) };
  const dest = (0, import_node_path7.join)((0, import_node_os5.tmpdir)(), exe);
  const dl = `https://npmmirror.com/mirrors/git-for-windows/${versionDir}${exe}`;
  if (!await downloadViaCurl(dl, dest)) {
    return { ok: false, message: t("install.depMirrorFail", { err: "download failed" }) };
  }
  try {
    (0, import_node_child_process4.execFileSync)(dest, ["/VERYSILENT", "/NORESTART", "/SP-"], { timeout: 6e5 });
    return { ok: true, message: t("dep.git.installedMirror") };
  } catch (err) {
    return { ok: false, message: t("install.depMirrorFail", { err: err instanceof Error ? err.message : String(err) }) };
  }
}
async function installNodeFromMirror(onStep) {
  onStep(t("install.depMirror"), 32);
  const files = fetchMirrorJson("https://registry.npmmirror.com/-/binary/node/latest-v22.x/");
  const msi = files === null ? null : pickLatestMirrorEntry(files, (n) => /^node-v\d+\.\d+\.\d+-x64\.msi$/.test(n), (n) => n.replace(/^node-v/, "").replace(/-x64\.msi$/, ""));
  if (msi === null) return { ok: false, message: t("install.depMirrorFail", { err: "mirror listing" }) };
  const dest = (0, import_node_path7.join)((0, import_node_os5.tmpdir)(), msi);
  const dl = `https://npmmirror.com/mirrors/node/latest-v22.x/${msi}`;
  if (!await downloadViaCurl(dl, dest)) {
    return { ok: false, message: t("install.depMirrorFail", { err: "download failed" }) };
  }
  try {
    (0, import_node_child_process4.execFileSync)("msiexec.exe", ["/i", dest, "/qn", "/norestart"], { timeout: 6e5 });
    return { ok: true, message: t("dep.node.installedMirror") };
  } catch (err) {
    return { ok: false, message: t("install.depMirrorFail", { err: err instanceof Error ? err.message : String(err) }) };
  }
}
async function installDependency(dep, opts = {}) {
  var _a, _b;
  const exec = (_a = opts.exec) != null ? _a : import_node_child_process4.execFile;
  const onStep = (_b = opts.onStep) != null ? _b : () => void 0;
  const env = opts.exec ? void 0 : refreshedEnv();
  const ticked = (promise, pct) => opts.exec ? promise : runWithTicker(promise, onStep, t("install.autoDep", { dep }), pct);
  if (process.platform === "win32") {
    const hasWinget = defaultHasBin2("winget");
    if (dep === "git") {
      const r2 = hasWinget ? await ticked(run2(exec, "winget", ["install", "--id", "Git.Git", "-e", "--accept-source-agreements", "--accept-package-agreements", "--silent"], 6e5, env), 8) : { ok: false, err: t("dep.noWinget") };
      if (r2.ok) return { ok: true, message: t("dep.git.installed") };
      if (!opts.exec) {
        const m = await installGitFromMirror(onStep);
        if (m.ok) return m;
        return { ok: false, message: t("dep.git.fail", { err: r2.err || m.message || t("err.unknown") }) };
      }
      return { ok: false, message: t("dep.git.fail", { err: r2.err || t("err.unknown") }) };
    }
    if (dep === "node") {
      const r2 = hasWinget ? await ticked(run2(exec, "winget", ["install", "--id", "OpenJS.NodeJS.LTS", "-e", "--accept-source-agreements", "--accept-package-agreements", "--silent"], 6e5, env), 16) : { ok: false, err: t("dep.noWinget") };
      if (r2.ok) return { ok: true, message: t("dep.node.installed") };
      if (!opts.exec) {
        const m = await installNodeFromMirror(onStep);
        if (m.ok) return m;
        return { ok: false, message: t("dep.node.fail", { err: r2.err || m.message || t("err.unknown") }) };
      }
      return { ok: false, message: t("dep.node.fail", { err: r2.err || t("err.unknown") }) };
    }
    const w = hasWinget ? await ticked(run2(exec, "winget", ["install", "--id", "pnpm.pnpm", "-e", "--accept-source-agreements", "--accept-package-agreements", "--silent"], 6e5, env), 24) : { ok: false, err: t("dep.noWinget") };
    if (w.ok) {
      return { ok: true, message: t("dep.pnpm.installed") };
    }
    const r = await ticked(run2(exec, "npm", ["install", "-g", "pnpm"], 6e5, env), 24);
    return r.ok ? { ok: true, message: t("dep.pnpm.installed") } : { ok: false, message: t("dep.pnpm.fail", { err: r.err || t("err.unknown") }) };
  }
  if (process.platform === "darwin") {
    const formula = dep === "git" ? "git" : dep === "node" ? "node" : "pnpm";
    const r = await ticked(run2(exec, "brew", ["install", formula], 6e5, env), 24);
    return r.ok ? { ok: true, message: t("dep.brew.installed", { dep }) } : { ok: false, message: t("dep.brew.fail", { dep, err: r.err.split("\n")[0] || t("err.unknown"), formula }) };
  }
  const hints = {
    git: "macOS: brew install git\uFF1BLinux: sudo apt install git",
    node: t("dep.hint.node"),
    pnpm: t("dep.hint.pnpm")
  };
  return { ok: false, message: t("dep.manual", { hint: hints[dep] }) };
}
async function ensureDeps(exec, hasBin4, env, onStep, opts) {
  if (opts.exec) return "";
  const depPct = { git: 8, node: 16, pnpm: 24 };
  for (const dep of ["git", "node", "pnpm"]) {
    if (!hasBin4(dep)) {
      onStep(t("install.autoDep", { dep }), depPct[dep]);
      const r = await installDependency(dep, { onStep });
      if (!r.ok) return r.message;
      invalidateRefreshedPath();
      if (!hasBin4(dep)) return t("install.depStillMissing", { dep });
    }
  }
  return "";
}
var DSH_INSTALL_SPEC = "@deepseek-ai/dsh@latest";
var DSH_FALLBACK_SPEC = `@deepseek-ai/dsh@${DSH_MIN_SUPPORTED}`;
async function ensureCli(exec, hasBin4, env, onStep, opts) {
  const present = hasBin4("dsh");
  if (present) {
    const current2 = await getCliDshVersion(exec);
    if (current2 === "" || !isKnownIncompatibleDsh(current2)) return { ok: true, note: "" };
    onStep(t("install.cliUpgrading", { v: current2 }), 92);
  } else {
    onStep(t("install.cliInstalling"), 92);
  }
  const install = (spec, extra = []) => run2(exec, "npm", ["install", "-g", spec, "--no-fund", "--no-audit", ...extra], INSTALL_TIMEOUT_MS, env);
  const tick = (p, pct) => opts.exec ? p : runWithTicker(p, onStep, t("install.cliInstalling"), pct);
  let cli = await tick(install(DSH_INSTALL_SPEC), 94);
  if (!cli.ok) cli = await install(DSH_INSTALL_SPEC, ["--registry", "https://registry.npmmirror.com"]);
  let version = cli.ok ? await getCliDshVersion(exec) : "";
  if (cli.ok && (version === "" || isKnownIncompatibleDsh(version))) {
    const fallback = await tick(install(DSH_FALLBACK_SPEC), 96);
    if (fallback.ok) {
      cli = fallback;
      version = await getCliDshVersion(exec);
    }
  }
  const ok = cli.ok && version !== "" && !isKnownIncompatibleDsh(version);
  const shown = version === "" ? DSH_MIN_SUPPORTED : version;
  return ok ? { ok: true, note: t("install.cliDone", { v: shown }) } : { ok: false, note: t("install.cliFail", { v: shown, err: cli.err.split("\n")[0] || t("err.failed") }) };
}
function startupCommandForInstall(cliOk, profile = "web") {
  return cliOk ? profileStartupCommand(profile) : `pnpm dsh ${repoStartupTail(profile)}`;
}
async function installDsh(targetDir, opts = {}) {
  var _a, _b, _c, _d;
  const exec = (_a = opts.exec) != null ? _a : import_node_child_process4.execFile;
  const hasBin4 = (_b = opts.hasBin) != null ? _b : defaultHasBin2;
  const cloneUrl = (_c = opts.cloneUrl) != null ? _c : DEFAULT_DSH_REPO_URL;
  const onStep = (_d = opts.onStep) != null ? _d : () => void 0;
  const env = opts.exec ? void 0 : refreshedEnv();
  if (!targetDir) {
    return { ok: false, message: t("install.dirEmpty") };
  }
  if ((0, import_node_fs9.existsSync)(targetDir) && isDshRepo(targetDir)) {
    const depErr2 = await ensureDeps(exec, hasBin4, env, onStep, opts);
    if (depErr2) {
      return { ok: false, message: depErr2, dir: targetDir };
    }
    const cli2 = await ensureCli(exec, hasBin4, env, onStep, opts);
    return {
      ok: true,
      message: t("install.found", { dir: targetDir }) + (cli2.note ? " " + cli2.note : ""),
      dir: targetDir,
      cliOk: cli2.ok
    };
  }
  if ((0, import_node_fs9.existsSync)(targetDir)) {
    if (isRescuableDir(targetDir)) {
      (0, import_node_fs9.rmSync)(targetDir, { recursive: true, force: true });
    } else {
      return {
        ok: false,
        message: t("install.notDsh", { dir: targetDir })
      };
    }
  }
  const depErr = await ensureDeps(exec, hasBin4, env, onStep, opts);
  if (depErr) {
    return { ok: false, message: depErr };
  }
  onStep(t("install.downloading"), 30);
  const mirrorUrl = `https://gh-proxy.com/${cloneUrl}`;
  const cloneAttempts = [cloneUrl, mirrorUrl];
  const cloneArgs = (url) => [
    "clone",
    "--depth",
    "1",
    "--config",
    "http.postBuffer=524288000",
    "--config",
    "http.lowSpeedLimit=1000",
    "--config",
    "http.lowSpeedTime=30",
    url,
    targetDir
  ];
  let clone = null;
  let lastErr = "";
  for (let i = 0; i < cloneAttempts.length; i++) {
    if (i > 0) {
      onStep(t("install.mirrorRetry", { n: i }), 28);
      await delay2(2e3);
    }
    const r = opts.exec ? await run2(exec, "git", cloneArgs(cloneAttempts[i]), CLONE_TIMEOUT_MS, env) : await cloneWithProgress(targetDir, cloneAttempts[i], env, (pct) => {
      onStep(t("install.downloading"), Math.round(30 + pct * 0.3));
    });
    if (r.ok && (0, import_node_fs9.existsSync)(targetDir) && isDshRepo(targetDir)) {
      clone = r;
      break;
    }
    lastErr = r.err.split("\n")[0] || `${t("err.failed")}\uFF08\u7B2C ${i + 1} \u6B21\u5C1D\u8BD5\uFF09`;
    if ((0, import_node_fs9.existsSync)(targetDir)) {
      (0, import_node_fs9.rmSync)(targetDir, { recursive: true, force: true });
    }
  }
  if (!clone) {
    return {
      ok: false,
      message: t("install.cloneFailed", { err: lastErr })
    };
  }
  let depsNote = "";
  if (hasBin4("pnpm")) {
    onStep(t("install.depsInstalling"), 65);
    const runInstall = (extra) => run2(exec, "pnpm", ["-C", targetDir, "install", ...extra], INSTALL_TIMEOUT_MS, env);
    let install = opts.exec ? await runInstall([]) : await runWithTicker(runInstall([]), onStep, t("install.depsInstalling"), 70);
    if (!install.ok) {
      onStep(t("install.depsMirror"), 60);
      install = opts.exec ? await runInstall(["--registry", "https://registry.npmmirror.com"]) : await runWithTicker(
        runInstall(["--registry", "https://registry.npmmirror.com"]),
        onStep,
        t("install.depsInstalling"),
        70
      );
    }
    if (!install.ok) {
      depsNote = t("install.depsNoteFail", { err: install.err.split("\n")[0] || t("err.failed"), dir: targetDir });
    }
  } else {
    depsNote = t("install.depsNoteNoPnpm");
  }
  if (hasBin4("pnpm")) {
    onStep(t("install.buildStep"), 75);
    const runBuild = () => run2(exec, "pnpm", ["-C", targetDir, "run", "build"], INSTALL_TIMEOUT_MS, env);
    const build = opts.exec ? await runBuild() : await runWithTicker(runBuild(), onStep, t("install.buildStep"), 85);
    if (!build.ok) {
      return {
        ok: false,
        message: t("install.buildFail", { err: build.err.split("\n")[0] || t("err.failed"), dir: targetDir })
      };
    }
  }
  const cli = await ensureCli(exec, hasBin4, env, onStep, opts);
  depsNote += cli.note;
  onStep(t("install.done"), 100);
  return {
    ok: true,
    message: t("install.message", { dir: targetDir, note: depsNote }),
    dir: targetDir,
    cliOk: cli.ok
  };
}

// src/bridge.ts
var import_node_crypto = require("node:crypto");
var import_node_fs10 = require("node:fs");
var import_node_os6 = require("node:os");
var import_node_path8 = require("node:path");
var BRIDGE_ENTRY_ID = "dsh-obsidian-bridge";
var BRIDGE_CLIENT_FILENAME = "client.js";
var BRIDGE_FILENAME = "dsh-obsidian-bridge.mjs";
var BRIDGE_PACKAGE_DIRNAME = "dsh-obsidian-bridge";
var BRIDGE_MODULE_FILENAME = "index.mjs";
var BRIDGE_PACKAGE_NAME = "dsh-obsidian-bridge";
var BRIDGE_PACKAGE_FALLBACK_VERSION = "0.0.0";
var PROFILE_MANIFEST_VERSION = "0.0.0";
function hotkeyToPassthroughKey(hk, platform = process.platform) {
  var _a;
  if (!hk || typeof hk.key !== "string" || hk.key === "") return null;
  const mods = ((_a = hk.modifiers) != null ? _a : []).map((m) => m.toLowerCase());
  const normalized = mods.map((m) => m === "mod" ? platform === "darwin" ? "meta" : "ctrl" : m);
  const prefix = normalized.filter((m) => m === "ctrl" || m === "meta" || m === "alt" || m === "shift").join("+");
  if (prefix === "") return null;
  return `${prefix}+${hk.key.toLowerCase()}`;
}
function dshHomeDir() {
  var _a;
  const env = ((_a = process.env.DSH_HOME) != null ? _a : "").trim();
  return env !== "" ? env : (0, import_node_path8.join)((0, import_node_os6.homedir)(), ".dsh");
}
function dshProfileDir(profile, home = dshHomeDir()) {
  return (0, import_node_path8.join)(home, "profiles", profile === "" ? "web" : profile);
}
function bridgePackageDir(profileDir2) {
  return (0, import_node_path8.join)(profileDir2, BRIDGE_PACKAGE_DIRNAME);
}
function bridgeModulePath(profileDir2) {
  return (0, import_node_path8.join)(bridgePackageDir(profileDir2), BRIDGE_MODULE_FILENAME);
}
function bridgePackageManifest(version, withClient = false) {
  const v = version.trim() === "" ? BRIDGE_PACKAGE_FALLBACK_VERSION : version.trim();
  const base = { name: BRIDGE_PACKAGE_NAME, version: v, private: true, type: "module" };
  if (!withClient) return `${JSON.stringify(base, null, 2)}
`;
  return `${JSON.stringify(
    {
      ...base,
      main: `./${BRIDGE_MODULE_FILENAME}`,
      exports: {
        ".": `./${BRIDGE_MODULE_FILENAME}`,
        "./client": { default: `./${BRIDGE_CLIENT_FILENAME}` },
        "./package.json": "./package.json"
      },
      dsh: { client: { platform: "web" } }
    },
    null,
    2
  )}
`;
}
function bridgeClientPath(profileDir2) {
  return (0, import_node_path8.join)(bridgePackageDir(profileDir2), BRIDGE_CLIENT_FILENAME);
}
function bridgePackageLinkPath(profileDir2) {
  return (0, import_node_path8.join)(profileDir2, "node_modules", BRIDGE_PACKAGE_NAME);
}
function ensurePackageLink(pkgDir, linkPath) {
  try {
    if ((0, import_node_fs10.existsSync)(linkPath)) {
      try {
        if ((0, import_node_fs10.lstatSync)(linkPath).isSymbolicLink() || (0, import_node_fs10.lstatSync)(linkPath).isDirectory()) {
          const real = (0, import_node_fs10.realpathSync)(linkPath);
          if (normalizeCase(real) === normalizeCase(pkgDir)) return true;
          const statSize = (0, import_node_fs10.lstatSync)(linkPath);
          if (!statSize.isSymbolicLink()) return false;
          (0, import_node_fs10.rmSync)(linkPath, { recursive: true, force: true });
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    (0, import_node_fs10.mkdirSync)((0, import_node_path8.join)(linkPath, ".."), { recursive: true });
    (0, import_node_fs10.symlinkSync)(pkgDir, linkPath, process.platform === "win32" ? "junction" : "dir");
    return true;
  } catch (e) {
    return false;
  }
}
function normalizeCase(p) {
  return process.platform === "win32" ? p.toLowerCase() : p;
}
function bridgeClientSource() {
  const LINES = [
    "window.__ModuleLoader__.load({",
    "	id: 'dsh-obsidian-bridge',",
    "	factory: (require) => {",
    "		var module = { exports: {} };",
    "		var exports = module.exports;",
    "		const inject = ['slots'];",
    "		const SLOT = 'conversation.input.left';",
    "		function report(patch) {",
    "			window.__DSH_BRIDGE_CLIENT__ = Object.assign(window.__DSH_BRIDGE_CLIENT__ || {}, patch);",
    "			try {",
    "				if (window.top !== window.self) {",
    "					window.parent.postMessage(Object.assign({ type: 'dsh-bridge-client' }, window.__DSH_BRIDGE_CLIENT__), '*');",
    "				}",
    "			} catch (_) {}",
    "		}",
    "		function Entry(props) {",
    "			try {",
    "				const actions = props && props.inputActions;",
    "				if (!actions) return null;",
    "				const ok = typeof actions.setDraft === 'function';",
    "				if (ok) {",
    "					window.__DSH_BRIDGE_SET_DRAFT__ = (text) => { try { actions.setDraft(String(text)); return true } catch (_) { return false } };",
    "				}",
    "				report({ ok: ok, setDraft: ok, hasUseInput: typeof (props && props.useInput), sessionId: String((props && props.sessionId) || ''), methods: Object.keys(actions).slice(0, 14).join(',') });",
    "			} catch (e) {",
    "				report({ ok: false, setDraft: false, detail: 'entry-throw: ' + String((e && e.message) || e) });",
    "			}",
    "			return null;",
    "		}",
    "		function apply(ctx) {",
    "			report({ loaded: true, hasSlots: !!(ctx && ctx.slots) });",
    "			try {",
    "				if (!ctx || !ctx.slots || typeof ctx.slots.inject !== 'function') { report({ detail: 'no-slots-api' }); return; }",
    "				ctx.slots.inject(SLOT, () => ctx.slots.register({ name: SLOT, id: 'dsh-obsidian-bridge' }, Entry));",
    "				report({ registered: true });",
    "				setTimeout(() => { const r = window.__DSH_BRIDGE_CLIENT__ || {}; if (!r.ok) report({ detail: 'never-mounted' }) }, 6000);",
    "			} catch (e) {",
    "				report({ ok: false, detail: 'inject-throw: ' + String((e && e.message) || e) });",
    "			}",
    "		}",
    "		exports.apply = apply;",
    "		exports.inject = inject;",
    "		return module.exports;",
    "	}",
    "});",
    ""
  ];
  return LINES.join("\n");
}
function embedFrameUrl(launchUrl, fallbackOrigin) {
  const u = launchUrl.trim();
  if (u === "") return `${fallbackOrigin}/`;
  return u + (u.includes("?") ? "&" : "?") + "ob=1";
}
function bridgeScriptSource() {
  return "(function(){if(window.__DSH_OBSIDIAN_BRIDGE__)return;window.__DSH_OBSIDIAN_BRIDGE__=true;var ET='';try{ET=window.__DSH_EMBED_TOKEN__||''}catch(_){}if(ET){" + // v2.8.1 命中判据重写：**解析后同源**，不再用字面量 '/api'（真机事故回归，详见 SAME_ORIGIN_SOURCE 注释）。
  SAME_ORIGIN_SOURCE + `function apiHdr(n){var h={};try{var s=n&&n.headers;if(s){if(typeof s.forEach==='function'){s.forEach(function(v,k){h[String(k)]=String(v)})}else{for(var k in s){h[k]=String(s[k])}}}}catch(_){}h.authorization='Bearer '+ET;return h}var NF=window.fetch&&window.fetch.bind(window);if(NF){window.fetch=function(i,n){try{var s='';if(typeof i==='string')s=i;else if(i)s=String(i.href||i.url||i);if(bridgeSameOrigin(s)){n=Object.assign({},n||{},{headers:apiHdr(n)})}}catch(_){}return NF(i,n)}};try{if(window.top!==window.self){var OWK=window.Worker;if(typeof OWK==='function'&&OWK.prototype&&typeof OWK.prototype.postMessage==='function'){var DWK=function(u,o){var w=new OWK(u,o);try{if(o&&o.name==='dsh-file-upload'){w.__dshUp=1}}catch(_){}return w};DWK.prototype=OWK.prototype;window.Worker=DWK;var OPX=OWK.prototype.postMessage;OWK.prototype.postMessage=function(m,t){try{if(m&&typeof m.url==='string'&&bridgeSameOrigin(m.url)&&bridgePath(m.url).indexOf('/api/')===0&&(this.__dshUp===1||(bridgePath(m.url).indexOf('/api/session/uploadFile')===0&&m.headers&&typeof m.headers==='object'))){var u=m.url+(m.url.indexOf('?')>=0?'&':'?')+'token='+encodeURIComponent(ET);var h={};try{var mh=m.headers;if(mh&&typeof mh==='object'){for(var k in mh){h[k]=mh[k]}}}catch(_){}if(h.authorization===undefined&&h.Authorization===undefined){h.authorization='Bearer '+ET}m=Object.assign({},m,{url:u,headers:h})}}catch(_){}return t===undefined?OPX.call(this,m):OPX.call(this,m,t)}}else{try{if(window.fetch){window.__DSH_FILE_UPLOAD__={fetch:window.fetch.bind(window)}}}catch(_){}}}}catch(_){}var OW=window.WebSocket;if(OW){var EW=function(u,p){try{if(bridgeSameOrigin(u)){u=String(u)+(String(u).indexOf('?')>=0?'&':'?')+'token='+encodeURIComponent(ET)}}catch(_){}return p===undefined?new OW(u):new OW(u,p)};EW.prototype=OW.prototype;EW.CONNECTING=OW.CONNECTING;EW.OPEN=OW.OPEN;EW.CLOSING=OW.CLOSING;EW.CLOSED=OW.CLOSED;window.WebSocket=EW}var OXP=window.XMLHttpRequest&&window.XMLHttpRequest.prototype;if(OXP&&OXP.open&&OXP.send){var xOpen=OXP.open,xSend=OXP.send;OXP.open=function(m,u){try{this.__dshBridgeUrl=String(u)}catch(_){}return xOpen.apply(this,arguments)};OXP.send=function(){try{if(bridgeSameOrigin(this.__dshBridgeUrl))this.setRequestHeader('authorization','Bearer '+ET)}catch(_){}return xSend.apply(this,arguments)}}var OE=window.EventSource;if(OE){var EES=function(u,c){try{if(bridgeSameOrigin(u)){u=String(u)+(String(u).indexOf('?')>=0?'&':'?')+'token='+encodeURIComponent(ET)}}catch(_){}return c===undefined?new OE(u):new OE(u,c)};EES.prototype=OE.prototype;EES.CONNECTING=OE.CONNECTING;EES.OPEN=OE.OPEN;EES.CLOSED=OE.CLOSED;window.EventSource=EES}}var BRIDGE_LINE_RE=/\\[\\s*BRIDGES is delivering packages for you\u2026\u2026\\s*\xB7\\s*(\\d+)\\s*words\\s*\xB7\\s*L(\\d+):(\\d+)-L(\\d+):(\\d+)\\s*\xB7\\s*([^\\]]+?)\\s*\xB7\\s*\\]/;function stripBridge(s){return String(s==null?'':s).replace(/\\[\\s*BRIDGES is delivering packages for you\u2026\u2026[^\\]]*\\]/g,'')}function mergeFill(existing,incoming){var rest=stripBridge(existing).replace(/\\n{3,}/g,'\\n\\n').replace(/^\\s+|\\s+$/g,'');if(incoming==='')return rest;return rest===''?incoming:incoming+'\\n'+rest}function pick(){var el=document.querySelector('textarea[data-phase]')||document.querySelector('textarea');if(el){return el.readOnly||el.disabled?null:el}var eds=document.querySelectorAll('[contenteditable="true"]');for(var i=0;i<eds.length;i++){var ce=eds[i];if(ce.isContentEditable&&!ce.disabled&&ce.offsetParent!==null)return ce}return null}function isField(el){var t=el.tagName;return t==='TEXTAREA'||t==='INPUT'}function fieldSet(el,val){var p=el.tagName==='INPUT'?window.HTMLInputElement.prototype:window.HTMLTextAreaElement.prototype;var d=Object.getOwnPropertyDescriptor(p,'value');d.set.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}))}function evType(t,o){try{var I=window.InputEvent;return I?new I(t,o):new Event(t,{bubbles:true})}catch(_){return new Event(t,{bubbles:true})}}function normWs(s){return String(s).replace(/\\s+/g,'')}var BRIDGE_SRC=` + JSON.stringify(BRIDGE_LINE_STRIP_RE.source) + ";var BRIDGE_RE=new RegExp(BRIDGE_SRC);function countBridge(t){try{var re=new RegExp(BRIDGE_SRC,'g');var n=0;while(re.exec(String(t||''))){n++}return n}catch(_){return -1}}function lineRange(root){try{if(typeof NodeFilter==='undefined'||!document.createTreeWalker)return null;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);var n;while((n=w.nextNode())){var s=n.nodeValue||'';BRIDGE_RE.lastIndex=0;var m=BRIDGE_RE.exec(s);if(m){var r=document.createRange();r.setStart(n,m.index);r.setEnd(n,m.index+m[0].length);var after=s.slice(m.index+m[0].length);if(after.charAt(0)==='\\n'){var cut=1;while(after.charAt(cut)===' ')cut++;r.setEnd(n,m.index+m[0].length+cut);return r}if(normWs(after)===''){var w2=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);var p;var seen=false;while((p=w2.nextNode())){if(p===n){seen=true;continue}if(seen){try{r.setEnd(p,0)}catch(_){}break}}}return r}}}catch(_){}return null}function lineOwnBlock(root){try{var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);var n;while((n=w.nextNode())){var s=n.nodeValue||'';BRIDGE_RE.lastIndex=0;if(!BRIDGE_RE.test(s))continue;var b=n;do{b=b.parentNode}while(b&&b!==root&&(b.nodeType===3||b.tagName==='SPAN'||b.tagName==='B'||b.tagName==='EM'||b.tagName==='I'));if(!b||b===root)return true;return normWs(stripBridge(b.innerText||b.textContent||''))==='' }}catch(_){}return true}" + // v2.8.0（setDraft 设计 P1/P2）：官方**模型层写入**成功判据 `bridgeOk` 上提到顶层，
  // 因为现在有两个使用者——DOM 定向路径的 `targetedOk`（editFill 内）与 setDraft 快路径
  // `trySetDraft`（顶层）。它只依赖 countBridge/normWs/stripBridge，上提不改变任何语义。
  TARGETED_OK_SOURCE + // 同上：`txtOf(el)` 也从 editFill 里提出来供顶层使用（editFill 内的 `txt()` 只是它的闭包别名）。
  // 为什么必须显式收元素参数：editFill 原有的 `txt()` 依赖它自己的闭包变量 `el`，正是这个耦合
  // 让"在 editFill 外读输入框文本"直接 ReferenceError（本轮实测踩到：定时器里抛未捕获异常）。
  "function txtOf(node){try{return node.innerText||node.textContent||''}catch(_){return ''}}function editFill(el,merged,line,cur,cb,job){function dead(){return !!(job&&job.dead)}var want=normWs(merged);var base=normWs(cur);var rest=(merged===line)?'':((merged.indexOf(line)===0)?merged.slice(line.length).replace(/^\\n/,''):merged);var prevFocus=null;try{prevFocus=document.activeElement}catch(_){}function refocus(){try{if(prevFocus&&prevFocus!==el&&prevFocus!==document.body&&prevFocus.focus){prevFocus.focus();return}}catch(_){}try{if(!prevFocus||prevFocus===document.body){window.parent.focus()}}catch(_){}}function wf(){try{el.focus()}catch(_){}}function noFlash(on){try{var id='dsh-nf-css',st=document.getElementById(id);if(on){if(!st){st=document.createElement('style');st.id=id;st.textContent='.dsh-nf-sel::selection{background:transparent;color:inherit}';document.head.appendChild(st)}el.classList.add('dsh-nf-sel')}else{el.classList.remove('dsh-nf-sel')}}catch(_){}}function txt(){return txtOf(el)}function isEmpty(){return normWs(txt())===''}function applied(){var t=normWs(txt());return want===''?t==='':t.indexOf(want)>=0}function selAll(){try{var s=window.getSelection();var r=document.createRange();r.selectNodeContents(el);s.removeAllRanges();s.addRange(r)}catch(_){}}function caretEnd(){try{var s=window.getSelection();if(!s||!s.rangeCount)return;var r=s.getRangeAt(0);if(!r.collapsed||r.startOffset!==0||!el.contains(r.startContainer))return;var rr=document.createRange();rr.selectNodeContents(el);rr.collapse(false);s.removeAllRanges();s.addRange(rr)}catch(_){}}function exec(c,v){try{return document.execCommand(c,false,v===undefined?undefined:v)}catch(_){return false}}function fireInput(type,data){try{el.dispatchEvent(evType('beforeinput',{inputType:type,data:data,bubbles:true,cancelable:true}));el.dispatchEvent(evType('input',{inputType:type,data:data,bubbles:true}))}catch(_){}}" + // v2.5.1 ②（hotfix 版）：用户是否插进来改动过——**按内容比对，不用事件计数**。
  // 旧版数 keydown/beforeinput 事件，编辑器自身派发的合成事件（焦点/选区/写入回响）会被误判成
  // "用户输入" → 整体放弃 → 真机表现为「重新框选/取消框选，隐式行不自动变更」。
  // 判定：当前内容既不是本次目标串的一部分、也不是本次写入前的原内容 → 才是用户新输入的。
  INTRUDED_SOURCE + `function put(fn){try{fn()}catch(_){}refocus()}function selRange(r){try{var s=window.getSelection();s.removeAllRanges();s.addRange(r)}catch(_){}}function toStart(){try{var s=window.getSelection();if(typeof NodeFilter!=='undefined'&&document.createTreeWalker){var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);var n;while((n=w.nextNode())){if((n.nodeValue||'')!==''){var r=document.createRange();r.setStart(n,0);r.collapse(true);s.removeAllRanges();s.addRange(r);return}}}var r2=document.createRange();r2.selectNodeContents(el);r2.collapse(true);s.removeAllRanges();s.addRange(r2)}catch(_){}}var restBefore=normWs(stripBridge(cur));function targetedOk(){return bridgeOk(txt(),line,restBefore)}function trimLead(done,result){var did=false;try{var t0=txt();if(!(/^\\s*\\n/.test(t0)||t0.charAt(0)==='\\u200b')){return done(result)}var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);var first=null;var nn;while((nn=w.nextNode())){var sv=nn.nodeValue||'';if(sv.replace(/\\u200b/g,'').trim()!==''){first=nn;break}}if(!first){return done(result)}var rg=document.createRange();rg.selectNodeContents(el);rg.setEnd(first,0);var s0=window.getSelection();s0.removeAllRanges();s0.addRange(rg);exec('delete');did=true}catch(_){}if(!did)return done(result);setTimeout(function(){done(targetedOk()?result:'bad')},80)}function targeted(done){if(dead())return;var r=lineRange(el);if(line===''){if(!r)return done('none');wf();selRange(r);put(function(){exec('delete')});setTimeout(function(){if(targetedOk())return trimLead(done,'ok');done('bad')},90);return}if(r){wf();selRange(r);put(function(){exec('insertText',line)});setTimeout(function(){if(targetedOk())return trimLead(done,'ok');wf();caretEnd();put(function(){exec('insertParagraph')});if(!lineOwnBlock(el)){put(function(){fireInput('insertParagraph')})}setTimeout(function(){if(!targetedOk())return done('bad');if(!lineOwnBlock(el))return done('nosep');trimLead(done,'ok')},90)},90);return}wf();toStart();put(function(){exec('insertText',line)});setTimeout(function(){if(!targetedOk())return done('bad');if(restBefore===''){return trimLead(done,'ok')}wf();put(function(){exec('insertParagraph')});if(!lineOwnBlock(el)){put(function(){fireInput('insertParagraph')})}setTimeout(function(){if(!targetedOk())return done('bad');if(!lineOwnBlock(el))return done('nosep');trimLead(done,'ok')},90)},90)}function finish(ok){if(dead())return;noFlash(false);refocus();cb(ok)}noFlash(true);function clearAll(done){if(dead())return;wf();selAll();exec('delete');setTimeout(function(){if(intruded())return done(false);put(function(){exec('delete')});setTimeout(function(){if(isEmpty())return done(true);wf();selAll();setTimeout(function(){put(function(){exec('delete')});setTimeout(function(){done(isEmpty())},60)},60)},80)},80)}function write(done){if(dead())return;if(intruded())return done('stale');if(rest===''){wf();put(function(){exec('insertText',merged)});setTimeout(function(){if(applied())return done('ok');if(intruded())return done('stale');wf();put(function(){fireInput('insertText',merged)});setTimeout(function(){done(intruded()?'stale':(applied()?'ok':'bad'))},70)},80);return}wf();put(function(){exec('insertText',line)});setTimeout(function(){if(intruded())return done('stale');wf();put(function(){fireInput('insertParagraph')});if(!lineOwnBlock(el)){wf();put(function(){exec('insertParagraph')})}setTimeout(function(){if(intruded())return done('stale');wf();caretEnd();put(function(){exec('insertText',rest)});setTimeout(function(){if(applied()&&lineOwnBlock(el))return done('ok');if(applied())return done('nosep');if(intruded())return done('stale');wf();put(function(){fireInput('insertText',merged)});setTimeout(function(){done(intruded()?'stale':(applied()?(lineOwnBlock(el)?'ok':'nosep'):'bad'))},70)},80)},70)},80)}function restore(userText,done){if(dead())return;if(userText===''){done();return}var rsd=window.__DSH_BRIDGE_SET_DRAFT__;if(typeof rsd==='function'){try{rsd(userText);setTimeout(function(){done()},60);return}catch(_){}}if(isField(el)){fieldSet(el,userText);done();return}clearAll(function(cleared){if(!cleared){done();return}wf();put(function(){exec('insertText',userText)});setTimeout(function(){done()},80)})}function fullRewrite(){if(dead())return;var cur2=txt();var merged2=mergeFill(cur2,line);if(normWs(cur2)===normWs(merged2))return finish(true);var keep=stripBridge(cur2);function failClosed(){if(keep==='')return finish(false);restore(keep,function(){finish(false)})}merged=merged2;cur=cur2;want=normWs(merged2);base=normWs(cur2);rest=(merged2===line)?'':((merged2.indexOf(line)===0)?merged2.slice(line.length).replace(/^\\n/,''):merged2);clearAll(function(cleared){if(!cleared){failClosed();return}write(function(r2){if(r2==='ok'||r2==='nosep')return finish(true);if(r2==='stale')return failClosed();if(intruded())return failClosed();wf();selAll();put(function(){exec('delete')});setTimeout(function(){if(intruded())return failClosed();wf();selAll();put(function(){exec('insertText',merged)});setTimeout(function(){if(applied())return finish(true);failClosed()},220)},60)})})}targeted(function(tr){if(tr==='ok'||tr==='nosep')return finish(true);fullRewrite()})}function fillAck(ok,sep,had,note,sd){try{window.parent.postMessage({type:'dsh-fill-ack',ok:!!ok,sep:!!sep,had:!!had,note:note||'',sd:!!sd},'*')}catch(_){}}function sdFail(r){try{window.parent.postMessage({type:'dsh-sd-fail',reason:String(r).slice(0,140)},'*')}catch(_){}}function trySetDraft(el,cur,line,merged,hadFocus,job){if(hadFocus){return false}var sd=window.__DSH_BRIDGE_SET_DRAFT__;if(typeof sd!=='function'){sdFail('no-api');return false}var baseUser=normWs(stripBridge(cur));var sdOk=false;try{sdOk=!!sd(merged)}catch(e){sdFail('threw:'+((e&&e.message)||e));return false}if(!sdOk){sdFail('returned-false');return false}function checkAgain(n){if(job&&job.dead)return;var t='';var okNow=false;try{t=txtOf(el);okNow=bridgeOk(t,line,baseUser)&&lineOwnBlock(el)}catch(_){}if(okNow){fillAck(true,t.indexOf('\\n')>=0,hadFocus,'setdraft',true);return}if(n<2){setTimeout(function(){checkAgain(n+1)},120);return}try{var cur2=txtOf(el);var merged2=mergeFill(cur2,line);if(normWs(cur2)===normWs(merged2)&&normWs(stripBridge(cur2))===baseUser){fillAck(true,cur2.indexOf('\\n')>=0,hadFocus,'setdraft',true);return}editFill(el,merged2,line,cur2,function(ok){var s2=true;try{s2=lineOwnBlock(el)}catch(_){}fillAck(ok,s2,hadFocus,'setdraft-dom')},job)}catch(_){}}setTimeout(function(){checkAgain(0)},90);return true}try{if(window.top!==window.self){var capN=0;var capProbe=function(){try{if(typeof window.__DSH_BRIDGE_SET_DRAFT__==='function'){window.__dshCapSent=true;try{window.parent.postMessage({type:'dsh-bridge-cap',setDraft:true},'*')}catch(_){}return}}catch(_){}if(capN++<40)setTimeout(capProbe,750)};capProbe()}}catch(_){}var fillJob=null;function fill(text){var n=0;var job={dead:false};if(fillJob){fillJob.dead=true}fillJob=job;function go(){if(job.dead)return;var el=pick();if(el){var cur=isField(el)?el.value||'':(el.innerText||el.textContent||'');var merged=mergeFill(cur,text);if(normWs(cur)===normWs(merged)){fillAck(true,(cur||'').indexOf('\\n')>=0,false,'same');return}var hadFocus=false;try{hadFocus=document.activeElement===el||el.contains(document.activeElement)}catch(_){}if(trySetDraft(el,cur,text,merged,hadFocus,job))return;if(isField(el)){fieldSet(el,merged);fillAck(true,false,hadFocus,'field');return}editFill(el,merged,text,cur,function(ok){var sep=false;try{sep=(el.innerText||el.textContent||'').indexOf('\\n')>=0}catch(_){}fillAck(ok,sep,hadFocus,'edit')},job);return}if(n<10){n++;setTimeout(go,100)}else if(n<15){n++;setTimeout(go,400)}}go()}var vaultRoot=null;function normP(p){return p.replace(/\\\\/g,'/').replace(/\\/+/g,'/')}function coll(p){var m=/^[A-Za-z]:/.exec(p),drive=m?m[0]:'',body=p.slice(drive.length),rooted=body.charAt(0)==='/',segs=[],i,parts=body.split('/');for(i=0;i<parts.length;i++){var s=parts[i];if(s===''||s==='.')continue;if(s==='..'){if(segs.length)segs.pop()}else{segs.push(s)}}return drive+(rooted?'/':'')+segs.join('/')}function resolveTxt(text){var t=text.trim();if(!t||t.length>300||!vaultRoot)return null;var r=normP(vaultRoot).replace(/\\/+$/,'');var abs=/^[A-Za-z]:/.test(t)||t.charAt(0)==='/'?normP(t):r+'/'+normP(t);var a=coll(abs);var rl=r.toLowerCase(),al=a.toLowerCase();if(al===rl||al.indexOf(rl+'/')===0)return a;return null}function isClickable(el){return el.tagName==='BUTTON'||el.tagName==='A'}function labelPrefixed(t){return /^(read|edit|write|think|grep|pwsh|tool|search|diff|web|bash|python|node|run|open|show|copy|cat|mkdir|rm|mv|add|delete)\\b/i.test(t)}function readable(p){return /\\.(md|markdown|txt|canvas|pdf|png|jpe?g|gif|svg|webp|bmp|ico|mp3|wav|ogg|oga|m4a|flac|opus|aac|mp4|webm|mov|mkv|avi|m4v|ogv|3gp|ts|js|jsx|tsx|mjs|cjs|json|css|scss|less|html|htm|xml|yaml|yml|csv|log|mdx|py|sh|bat|ps1)$/i.test(p)}function pathOf(el){var t=el.getAttribute?el.getAttribute('title'):null;if(t&&/[\\\\/]/.test(t))return t;return (el.textContent||'').trim()}document.addEventListener('click',function(e){if(!vaultRoot)return;var el=e.target;while(el&&el!==document.body){var txt=pathOf(el);if(txt.length>2&&txt.length<300&&/[\\\\/]/.test(txt)&&isClickable(el)&&!labelPrefixed(txt)){var r=resolveTxt(txt);if(r&&readable(r)){e.preventDefault();e.stopPropagation();try{window.parent.postMessage({type:'dsh-open-in-obsidian',path:r},'*')}catch(_){}return}}el=el.parentElement}},true);document.addEventListener('focusin',function(e){try{var t=e.target;if(!t)return;var isC=(t.tagName==='TEXTAREA')||(t.tagName==='INPUT')||!!t.isContentEditable;if(!isC&&t.closest){isC=!!t.closest('[contenteditable="true"]')}if(isC){try{window.parent.postMessage({type:'dsh-composer-focus'},'*')}catch(_){}}}catch(_){}},true);var WIKILINK_RE=/` + WIKILINK_SOURCE + "/g;function wlStyle(){try{if(document.getElementById('dsh-wl-css'))return;var st=document.createElement('style');st.id='dsh-wl-css';st.textContent='.dsh-wikilink{color:var(--link-color,var(--text-accent,#7b6cd9));text-decoration:underline;text-underline-offset:2px;cursor:pointer}'+'.dsh-wikilink:hover{opacity:.85}';document.head.appendChild(st)}catch(_){}}function wlSkip(el){for(var n=el;n&&n!==document.body;n=n.parentElement){var t=(n.tagName||'').toLowerCase();if(t==='code'||t==='pre'||t==='script'||t==='style'||t==='textarea'||t==='input')return true;if(n.isContentEditable)return true;if(n.classList&&n.classList.contains('dsh-wikilink'))return true}return false}function wlReplace(node){try{var s=node.nodeValue;WIKILINK_RE.lastIndex=0;var frag=document.createDocumentFragment(),last=0,m;while((m=WIKILINK_RE.exec(s))){if(m.index>last)frag.appendChild(document.createTextNode(s.slice(last,m.index)));var a=document.createElement('a');a.className='dsh-wikilink';a.setAttribute('data-wikilink',m[1]);a.setAttribute('title',m[1]);a.textContent=(m[2]&&m[2].trim())||m[1];frag.appendChild(a);last=m.index+m[0].length}if(last===0)return;if(last<s.length)frag.appendChild(document.createTextNode(s.slice(last)));node.parentNode.replaceChild(frag,node)}catch(_){}}function wlAnnotate(root){try{if(!root||wlSkip(root))return;var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);var batch=[],n;while((n=walker.nextNode())){var s=n.nodeValue;if(!s||s.indexOf('[[')<0||s.length>2000)continue;if(wlSkip(n.parentNode))continue;WIKILINK_RE.lastIndex=0;if(!WIKILINK_RE.test(s))continue;batch.push(n)}for(var i=0;i<batch.length;i++)wlReplace(batch[i])}catch(_){}}document.addEventListener('click',function(e){var el=e.target;while(el&&el!==document.body){if(el.classList&&el.classList.contains('dsh-wikilink')){e.preventDefault();e.stopPropagation();var t=el.getAttribute('data-wikilink')||'';if(t!==''){try{window.parent.postMessage({type:'dsh-wikilink',target:t},'*')}catch(_){}}return}el=el.parentElement}},true);var wlDirty=[],wlTimer=null;function wlMark(n){if(!n)return;if(wlDirty.indexOf(n)<0)wlDirty.push(n);if(wlTimer!==null)return;wlTimer=setTimeout(function(){wlTimer=null;var list=wlDirty.slice(0);wlDirty.length=0;for(var k=0;k<list.length;k++){try{if(list[k].isConnected!==false)wlAnnotate(list[k])}catch(_){}}},150)}function wlStart(){try{wlStyle();wlAnnotate(document.body);var obs=new MutationObserver(function(recs){try{for(var i=0;i<recs.length;i++){var rc=recs[i];if(rc.type==='characterData'){wlMark(rc.target&&rc.target.parentNode);continue}for(var j=0;j<rc.addedNodes.length;j++){var nd=rc.addedNodes[j];if(!nd)continue;if(nd.nodeType===1)wlMark(nd);else if(nd.nodeType===3)wlMark(nd.parentNode)}}}catch(_){}});obs.observe(document.body,{childList:true,subtree:true,characterData:true})}catch(_){}}if(document.body)wlStart();else document.addEventListener('DOMContentLoaded',wlStart);window.addEventListener('message',function(e){if(e.source!==window.parent)return;var d=e.data;if(!d)return;if(d.type==='dsh-fill-draft'&&typeof d.text==='string'){fill(d.text);return}if(d.type==='dsh-bridge-ping'){try{window.parent.postMessage({type:'dsh-bridge-ready'},'*')}catch(_){};return}if(d.type==='dsh-open-cfg'&&typeof d.vaultRoot==='string'){vaultRoot=d.vaultRoot;return}if(d.type==='dsh-kbd-cfg'&&d.keys&&d.keys.length!==undefined){kbdKeys=d.keys;logKbd('kbd-cfg received: '+kbdList());return}});var kbdKeys=[];function kbdMatch(e,k){if(!k||!e)return false;var wantC=k.indexOf('ctrl')>=0,wantM=k.indexOf('meta')>=0,wantA=k.indexOf('alt')>=0;if(wantC!==e.ctrlKey||wantM!==e.metaKey||wantA!==e.altKey)return false;var key=(e.key||'').toLowerCase();if(k.indexOf('+')>=0){var ch=k.slice(k.lastIndexOf('+')+1).toLowerCase();return key===ch}return key===k.toLowerCase()}function requestKbd(){var t=Date.now();if(t-(window.__dshKbdReqAt||0)<5000)return;window.__dshKbdReqAt=t;try{window.parent.postMessage({type:'dsh-kbd-request'},'*')}catch(_){}}function logKbd(m){try{console.log('[dsh-bridge]',m)}catch(_){}}function kbdList(){var s='';for(var i=0;i<kbdKeys.length;i++){s+=kbdKeys[i]+' '}return s}function editKey(e){var k=(e.key||'').toLowerCase();if(k==='backspace'||k==='delete'||k==='enter'||k==='tab'||k==='escape')return true;if(k.indexOf('arrow')===0||k==='home'||k==='end'||k==='pageup'||k==='pagedown')return true;if(!e.ctrlKey&&!e.metaKey)return false;return k==='z'||k==='y'||k==='a'||k==='c'||k==='v'||k==='x'||k==='insert'}logKbd('keydown listener installed, kbdKeys='+kbdKeys.length+': '+kbdList());document.addEventListener('keydown',function(e){if(editKey(e)){return}if(!kbdKeys.length){requestKbd();return}for(var i=0;i<kbdKeys.length;i++){if(kbdMatch(e,kbdKeys[i])){e.preventDefault();e.stopPropagation();logKbd('MATCH '+kbdKeys[i]+' -> post');try{window.parent.postMessage({type:'dsh-kbd-shortcut',key:kbdKeys[i]},'*')}catch(_){}return}}},true);try{window.parent.postMessage({type:'dsh-bridge-ready'},'*')}catch(_){}try{var uiApi=null;var apiProbe=function(){try{if(!ET)return;fetch('/api/session/list',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+ET},body:JSON.stringify({type:'client-request',rpcId:'h'+Date.now(),method:'session/list',payload:{args:{_request:{}}}})}).then(function(r){uiApi=r.status}).catch(function(){uiApi=-1})}catch(_){uiApi=-2}};var uiLastLen=-1,uiLastApi=0,uiTickN=0;var uiTick=function(){uiTickN++;var len=0;try{var b=document.body;len=(b&&b.textContent)?b.textContent.length:0}catch(_){}apiProbe();var need=uiTickN<=48||len<20||Math.abs(len-uiLastLen)>=2048||uiApi!==uiLastApi;if(need){uiLastLen=len;uiLastApi=uiApi;try{window.parent.postMessage({type:'dsh-ui-state',len:len,api:uiApi},'*')}catch(_){}}uiSchedule(len<20||uiTickN<=48?2500:15000)};var uiTimer=null;function uiSchedule(ms){if(uiTimer!==null)clearTimeout(uiTimer);uiTimer=setTimeout(uiTick,ms)};apiProbe();uiTick()}catch(_){}})()";
}
function bridgePluginSource() {
  const escaped = bridgeScriptSource().replaceAll("\\", "\\\\").replaceAll("'", "\\'");
  return [
    "// DeepSeek Harness Obsidian bridge \u2014 user patch-layer plugin (installed by the dsh-harness Obsidian plugin).",
    "// Registers an index.html transform that injects a postMessage bridge into the served Web GUI,",
    "// so the Obsidian plugin can fill the composer draft with selected text. Zero DSH source changes.",
    "// Also registers an agent/pre-step hook: when the newest user message carries a BRIDGES implicit",
    "// line, it injects a deterministic edit instruction (model reads the region, presents the result,",
    "// asks for consent, then writes with fs edit). The instruction itself never appears in the chat UI.",
    "// v2.3.2 embedder-auth adapter (interim \u2462b): for DSH >=0.1.2 browser-session auth whose Strict cookie",
    "// is structurally unusable inside cross-site iframes. Adds an extra accepted credential WITHOUT touching",
    "// defaults: index GET /?token=<T>&ob=1 -> 200 (no ob -> original 303 cookie flow, real browsers intact);",
    "// /api 401 verdict overridden by matching Bearer header or query token (403 fence verdicts untouched).",
    "// v2.9.5: DSH 0.2.2 serves the static fallback through the Fetch API, so authorizeIndex receives a Fetch",
    "// Request whose req.url is ABSOLUTE (http://host:port/?token=\u2026&ob=1). The old segment-before-'?' compare",
    "// never matched '/' for such URLs, silently disabling the ob=1 fast path (303 + SameSite=Strict cookie ->",
    "// iframe 401 'dsh web authentication required'). Path name is now resolved with WHATWG URL, relative or absolute.",
    "// v2.8.12: DSH 0.2.1-rc.2 routes /api and WS upgrades through connection.admit() directly (no longer",
    "// requestRejection), so the same credential is accepted by wrapping admit() too. Feature-detected:",
    "// service/method absent (older DSH) or signature moved (newer refactor) -> inert fallback.",
    "// v2.4.4 inject-once: delivers the edit instruction through the DSH-native one-shot inbox",
    "// (agent.inbox.prepend('next-step', msg)) instead of appending a fresh persisted user/message on every",
    "// step, with a compaction-proof local ledger + session cap (see inject-ledger.json / inject-log.jsonl).",
    "import { createHash } from 'node:crypto'",
    "import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'",
    "import { dirname, join } from 'node:path'",
    "import { fileURLToPath } from 'node:url'",
    "export const name = 'dsh-obsidian-bridge'",
    "",
    `const BRIDGE = '${escaped}'`,
    "",
    "const EMBED_TOKEN_QUERY = 'token'",
    "const EMBED_MARKER_QUERY = 'ob'",
    "function embedHeader(req, name) {",
    "  try {",
    "    const h = req && req.headers",
    "    if (!h) return ''",
    "    if (typeof h.get === 'function') return h.get(name) || ''",
    "    return h[name] || h[name.toLowerCase()] || ''",
    "  } catch { return '' }",
    "}",
    "function embedParams(req) {",
    "  try {",
    "    const u = String((req && req.url) || '')",
    "    const qi = u.indexOf('?')",
    "    if (qi < 0) return new URLSearchParams()",
    "    return new URLSearchParams(u.slice(qi + 1))",
    "  } catch { return null }",
    "}",
    "function embedTokenOf(conn) {",
    "  try {",
    "    return new URL(conn.authenticatedUrl('http://127.0.0.1/')).searchParams.get(EMBED_TOKEN_QUERY) || ''",
    "  } catch { return '' }",
    "}",
    "function embedPatchAuth(conn, token) {",
    "  const proto = Object.getPrototypeOf(conn)",
    "  if (!proto || proto.__dshEmbedPatched) return",
    "  const origRejection = typeof conn.requestRejection === 'function' ? proto.requestRejection : null",
    "  const origAdmit = typeof conn.admit === 'function' ? proto.admit : null",
    "  const origIndex = typeof conn.authorizeIndex === 'function' ? proto.authorizeIndex : null",
    "  if (!origRejection && !origAdmit && !origIndex) return",
    "  proto.__dshEmbedPatched = true",
    "  if (origRejection) {",
    "    proto.requestRejection = function (req) {",
    "      const verdict = origRejection.call(this, req)",
    "      if (verdict !== 401) return verdict",
    "      try {",
    "        if (embedHeader(req, 'authorization') === 'Bearer ' + token) return undefined",
    "        const sp = embedParams(req)",
    "        if (sp && sp.get(EMBED_TOKEN_QUERY) === token) return undefined",
    "      } catch {}",
    "      return verdict",
    "    }",
    "  }",
    "  // 0.2.1-rc.2 \u8D77 /api \u4E0E WS \u5347\u7EA7\u76F4\u63A5\u8D70 admit()\uFF08\u4E0D\u518D\u7ECF requestRejection\uFF09\u2014\u2014\u53EA\u5305 requestRejection",
    "  // \u4F1A\u8BA9\u5D4C\u5165\u6A21\u5F0F\uFF08ob=1 \u76F4\u53D1 index\u3001\u6CA1\u6709 cookie\uFF09\u4E0B\u6240\u6709 /api \u4E0E\u5347\u7EA7\u4E00\u5F8B 401\uFF1A\u804A\u5929\u5217\u8868/\u5DE5\u4F5C\u533A/\u63D2\u4EF6\u7BA1\u7406\u5668",
    "  // \u4E0E apply \u671F\u8C03\u7528 remote \u7684\u5BA2\u6237\u7AEF\u6761\u76EE\uFF08\u5982 cot-translation\uFF09\u4E00\u8D77 failed\uFF0C\u524D\u7AEF\u53EA\u5269 web boot \u8986\u76D6\u5C42\u3002",
    "  // \u6545\u6309\u540C\u4E00\u51ED\u636E\u518D\u5305 admit\uFF1A\u53EA\u5728\u539F\u5224\u5B9A 401 \u4E14\u672A disposed \u65F6\u653E\u884C\uFF1Bfence 403 \u4E0E disposed 401 \u539F\u6837\u8FD4\u56DE\uFF1B",
    "  // \u653E\u884C\u7ED3\u679C { peer: this.browserPeer } \u4E0E\u5B98\u65B9 cookie \u8DEF\u5F84\u540C\u6743\uFF08admitConnection \u5BF9\u65E0 peer \u8BB0\u5F55\u8005\u91CA\u653E\u5373\u7A7A\u64CD\u4F5C\uFF09\u3002",
    "  if (origAdmit) {",
    "    proto.admit = function (req) {",
    "      const admission = origAdmit.call(this, req)",
    "      if (!admission || admission.rejection !== 401) return admission",
    "      try {",
    "        if (this.disposed === true) return admission",
    "        if (embedHeader(req, 'authorization') === 'Bearer ' + token) return { peer: this.browserPeer }",
    "        const sp = embedParams(req)",
    "        if (sp && sp.get(EMBED_TOKEN_QUERY) === token) return { peer: this.browserPeer }",
    "      } catch {}",
    "      return admission",
    "    }",
    "  }",
    "  if (origIndex) {",
    "    proto.authorizeIndex = function (req, res) {",
    "      try {",
    "        if (req && req.method === 'GET') {",
    // v2.9.5（DSH 0.2.2 回归）：0.2.2 起静态兜底改走 Fetch API——`serveStatic(request, …)` 把
    // Fetch 的 `Request` 交给 `connection.authorizeIndex(r, self)`，`req.url` 因此是**绝对 URL**
    // （`http://127.0.0.1:3080/?token=…&ob=1`）。旧写法「砍掉 ? 后与 '/' 比较」在绝对 URL 下得到
    // `http://127.0.0.1:3080/`，条件恒假 ⇒ ob=1 直发 index 的快速通道失效 ⇒ 退回 303+Set-Cookie
    // （SameSite=Strict），而 Obsidian iframe 是跨站上下文（app://obsidian.md）不发送该 cookie ⇒
    // 401「dsh web authentication required; reopen the URL printed by dsh web.」。
    // 用 WHATWG URL 取 pathname：相对（旧版 node:http 形态）与绝对（0.2.2 Fetch 形态）同时成立。
    "          let pathOnly = ''",
    "          try { pathOnly = new URL(String(req.url || ''), 'http://dsh.invalid').pathname } catch (_) {}",
    "          if (pathOnly === '/' || pathOnly === '') {",
    "            const sp = embedParams(req)",
    "            if (sp && sp.get(EMBED_MARKER_QUERY) === '1' && sp.get(EMBED_TOKEN_QUERY) === token) return true",
    "          }",
    "        }",
    "      } catch {}",
    "      return origIndex.call(this, req, res)",
    "    }",
    "  }",
    "}",
    "let embedDone = false",
    "let embedToken = ''",
    "let embedLogged = false",
    "function embedLog(msg) {",
    "  if (embedLogged) return",
    "  embedLogged = true",
    "  try { console.log('[dsh-obsidian-bridge] embed adapter:', msg) } catch (_) {}",
    "}",
    // 挂载期由 inject(['connection']) 调用：必须早于任何 index 请求（认证开启时 401/303 会先于
    // tapIndex 短路，包裹若放在 tapIndex 回调里永远装不上——鸡生蛋问题）
    "function embedActivate(conn) {",
    "  if (embedDone) return",
    "  embedDone = true",
    "  try {",
    "    if (!conn || typeof conn.authenticatedUrl !== 'function') { embedLog('no browser-auth API (pre-0.1.2) \u2014 idle'); return }",
    "    const token = embedTokenOf(conn)",
    "    if (!token) { embedLog('token parse empty'); return }",
    "    embedPatchAuth(conn, token)",
    "    embedLog('adapter active (token len ' + String(token.length) + ')')",
    "    embedToken = token",
    "  } catch (err) { embedLog('unexpected: ' + (err && err.message)) }",
    "}",
    "",
    bridgeEditInjectSource(),
    "",
    "export function apply(ctx) {",
    "  try { console.log('[dsh-obsidian-bridge] apply called') } catch (_) {}",
    "  ctx.inject(['connection'], (actx) => {",
    "    try { embedActivate(actx.connection) } catch (_) {}",
    "  })",
    "  ctx.inject(['webServer'], (httpCtx) => {",
    "    httpCtx.effect(",
    "      () => httpCtx.webServer.tapIndex((html) => {",
    "        const embedVar = embedToken ? '<script>window.__DSH_EMBED_TOKEN__=' + JSON.stringify(embedToken) + ';<\/script>' : ''",
    "        return html.replace('<head>', '<head>' + embedVar + '<script>' + BRIDGE + '<\/script>')",
    "      }),",
    "      'dsh-obsidian-bridge: index bridge',",
    "    )",
    "  })",
    "  try {",
    "    ctx.on('agent/pre-step', async ({ agent, messages }, next) => {",
    "      const decision = await next()",
    "      if (decision.kind === 'reject') return decision",
    "      const pending = agent && agent.inbox && Array.isArray(agent.inbox.nextStep) ? agent.inbox.nextStep : []",
    "      const nodes = agent && agent.session && agent.session.surface && Array.isArray(agent.session.surface.nodes) ? agent.session.surface.nodes : []",
    "      const sessionKey = String((agent && agent.session && agent.session.id) || 'unknown')",
    "      const res = bridgeEditMaybeInject({ messages, pending, nodes, sessionKey })",
    "      const inboxReady = agent && agent.inbox && typeof agent.inbox.prepend === 'function'",
    "      // v2.5.0\uFF1A\u6BCF\u4F1A\u8BDD\u4E00\u6B21\u6295\u9012\u300C\u53CC\u94FE\u7EA6\u5B9A\u300D\uFF08\u53EA\u8D70\u4E00\u6B21\u6027 inbox\uFF1B\u65E0 inbox API \u65F6\u8BE5\u7EA6\u5B9A\u4ECD\u5305\u542B\u5728\u7F16\u8F91\u6307\u4EE4\u91CC\uFF09",
    "      if (inboxReady) {",
    "        try { const rule = bridgeWikilinkRule(sessionKey); if (rule) agent.inbox.prepend('next-step', rule) } catch (_) {}",
    "      }",
    "      if (!res || !res.msg) return decision",
    '      // v2.4.4\uFF1A\u4F18\u5148 DSH \u539F\u751F\u4E00\u6B21\u6027\u6295\u9012\u2014\u2014inbox \u9879\u88AB\u6D88\u8D39\u5373\u6D88\u5931\uFF0C\u4E0D\u4F1A\u50CF"\u6BCF step \u8FFD\u52A0\u4E00\u6761 user/message"\u90A3\u6837\u7D2F\u79EF\u3002',
    "      if (inboxReady) {",
    "        try { agent.inbox.prepend('next-step', res.msg); return decision } catch (_) {}",
    "      }",
    "      return { kind: 'enter', messages: [...decision.messages, res.msg] }",
    "    })",
    "  } catch (err) {",
    "    try { console.warn('[dsh-obsidian-bridge] pre-step unavailable:', err && err.message) } catch (_) {}",
    "  }",
    "}",
    ""
  ].join("\n");
}
var BRIDGE_LINE_STRIP_RE = /\[\s*BRIDGES is delivering packages for you……[^\]]*\]/g;
var WIKILINK_SOURCE = String.raw`\[\[([^\[\]\n|]{1,200})(?:\|([^\[\]\n]{1,200}))?\]\]`;
var SAME_ORIGIN_SOURCE = (
  // ws/wss 的 origin 自带 ws/wss 协议头，与页面的 http/https origin 永不相等（详见上方注释），
  // 故先归一化再比：判据是「origin 等价」，不是「origin 字面量相等」。
  "function bridgeOrigin(o){return o.indexOf('ws://')===0?'http://'+o.slice(5):(o.indexOf('wss://')===0?'https://'+o.slice(6):o)}function bridgeUrl(s){try{if(s===undefined||s===null||s==='')return null;var u=new URL(String(s),location.href);return bridgeOrigin(String(u.origin))!==location.origin?null:u}catch(_){return null}}function bridgeSameOrigin(s){return bridgeUrl(s)!==null}function bridgePath(s){var u=bridgeUrl(s);return u===null?'':u.pathname}"
);
var INTRUDED_SOURCE = "function intruded(){var nt=normWs(txt());if(nt==='')return false;if(want.indexOf(nt)>=0)return false;if(base!==''&&base.indexOf(nt)>=0)return false;return true}";
var TARGETED_OK_SOURCE = "function bridgeOk(t,line,restBefore){var c=countBridge(t);var restAfter=normWs(stripBridge(t));if(line==='')return c===0&&restAfter===restBefore;return c===1&&restAfter===restBefore&&normWs(t).indexOf(normWs(line))>=0}";
function bridgeEditInjectSource() {
  return [
    "const BRIDGE_LINE_RE = /\\[\\s*BRIDGES is delivering packages for you\u2026\u2026\\s*\xB7\\s*(\\d+)\\s*words\\s*\xB7\\s*L(\\d+):(\\d+)-L(\\d+):(\\d+)\\s*\xB7\\s*([^\\]]+?)\\s*\xB7\\s*\\]/",
    // v2.7.1：v4 起 source.kind 必须是生产者自己的名字（通用 'plugin' 被硬拒）。
    // 取值与 v4 迁移链给第三方插件的兜底形态一致 → 历史消息与新消息归到同一个 kind。
    "const BRIDGE_SOURCE_KIND = 'plugin:dsh-obsidian-bridge'",
    "function bridgeMessageId() {",
    "  try {",
    "    const c = globalThis.crypto",
    "    if (c && typeof c.randomUUID === 'function') return c.randomUUID()",
    "    if (c && typeof c.getRandomValues === 'function') {",
    "      const b = c.getRandomValues(new Uint8Array(16))",
    "      b[6] = (b[6] & 15) | 64",
    "      b[8] = (b[8] & 63) | 128",
    "      let h = ''",
    "      for (let i = 0; i < 16; i++) h += (b[i] + 256).toString(16).slice(1)",
    "      return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20)",
    "    }",
    "  } catch (_) {}",
    "  return 'bridge-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12)",
    "}",
    // ---- v2.4.4 注入台账（不依赖会话窗口；压缩裁剪也击不穿）+ 限流熔断 ----
    // 与 src/inject-ledger.ts 的 INJECT_LIMITS/decideInject 同规则（parity 由测试与模板标记兜底）。
    "const INJECT_LIMITS = { ttlMs: 600000, maxKeyHits: 1, maxSessionInjections: 20, maxItems: 200 }",
    "function bridgeLedgerPath(name) { try { return join(dirname(fileURLToPath(import.meta.url)), name) } catch (_) { return '' } }",
    "function bridgeEmptyLedger() { return { version: 1, items: [], sessions: {}, ruleSessions: [] } }",
    // v2.8.7：解析失败必须**留痕**——旧版静默返回空台账，等于把「注入风暴」的最后防线抹掉而无人知道
    //（真机历史：单会话 11.8MB / user-message 564 条 / DOM 279 万字 → DSH 崩溃，防线正是这份台账）。
    "function bridgeLoadLedger() { try { const f = bridgeLedgerPath('inject-ledger.json'); if (!f || !existsSync(f)) return bridgeEmptyLedger(); const p = JSON.parse(readFileSync(f, 'utf8')); return { version: 1, items: Array.isArray(p.items) ? p.items : [], sessions: p.sessions && typeof p.sessions === 'object' ? p.sessions : {}, ruleSessions: Array.isArray(p.ruleSessions) ? p.ruleSessions : [], storm: p.storm } } catch (e) { try { bridgeLogCorrupt(String((e && e.message) || e)) } catch (_) {} return bridgeEmptyLedger() } }",
    // 原子写：宿主与桥接两侧共用这份台账，直接覆盖可能留下半截 JSON（撕裂后读侧只能退回空台账）。
    // 两点纪律：①临时名**不得依赖 `process`**、②`renameSync` 取不到时退回直写——这段代码会被塞进任何
    // 宿主环境（真机 DSH、测试 vm 沙箱），一旦引用缺失就整段抛错被 catch 吞掉 ⇒ 台账永不落盘、
    // 去重与限流静默失效（本仓测试第一时间抓到的正是这个形态）。
    "function bridgeSaveLedger(data) { try { const f = bridgeLedgerPath('inject-ledger.json'); if (!f) return false; mkdirSync(dirname(f), { recursive: true }); const json = JSON.stringify(data); if (typeof renameSync !== 'function') { writeFileSync(f, json, 'utf8'); return true } const tmp = f + '.tmp-' + Date.now() + '-' + Math.floor(Math.random() * 1e6); writeFileSync(tmp, json, 'utf8'); renameSync(tmp, f); return true } catch (_) { return false } }",
    // 兜底也必须返回**完整形状**：旧版这里少了 ruleSessions，一旦触发就把「每会话一次的双链约定」
    // 投递记录抹掉（bridgeWikilinkRule 紧接着会把它落盘覆盖 ⇒ 同会话重复投递一条全局指令）
    "function bridgePrune(data, now) { try { const items = data.items.filter((it) => it && typeof it.at === 'number' && now - it.at <= INJECT_LIMITS.ttlMs); items.sort((a, b) => b.at - a.at); return { ...data, items: items.slice(0, INJECT_LIMITS.maxItems) } } catch (_) { return bridgeEmptyLedger() } }",
    "function bridgeLogCorrupt(msg) { try { const f = bridgeLedgerPath('inject-log.jsonl'); if (!f) return; if (existsSync(f) && statSync(f).size > 262144) writeFileSync(f, ''); appendFileSync(f, JSON.stringify({ at: Date.now(), kind: 'ledger-corrupt', msg: msg.slice(0, 160) }) + '\\n', 'utf8') } catch (_) {} }",
    "function bridgeKeyHits(data, key, now) { try { return data.items.filter((it) => it.key === key && now - it.at <= INJECT_LIMITS.ttlMs).length } catch (_) { return 0 } }",
    "function bridgeInjectKey(path, loc, instruction) { try { return createHash('sha256').update(path + '|' + loc + '|' + String(instruction).trim()).digest('hex').slice(0, 16) } catch (_) { return 'k' + String(path.length) + '-' + loc } }",
    "function bridgeInjectSig(path, loc) { return '[BRIDGES \u7F16\u8F91\u6307\u4EE4] ' + path + ' \xB7 ' + loc }",
    "function bridgeLogDecision(res, sessionKey) { try { const f = bridgeLedgerPath('inject-log.jsonl'); if (!f) return; if (existsSync(f) && statSync(f).size > 262144) writeFileSync(f, ''); appendFileSync(f, JSON.stringify({ at: Date.now(), session: sessionKey, action: res ? res.action : 'skip', reason: res ? res.reason : 'none', key: res ? res.key : '', keyHits: res ? res.keyHits : 0, sessionCount: res ? res.sessionCount : 0 }) + '\\n', 'utf8') } catch (_) {} }",
    "function bridgeDecideInject({ messages, pending, nodes, sessionKey }) {",
    "  const base = { action: 'skip', reason: 'none', msg: null, key: '', sig: '', keyHits: 0, sessionCount: 0 }",
    "  if (!messages || !messages.length) return base",
    "  const last = messages[messages.length - 1]",
    "  const text = typeof last === 'string' ? last : ((last && last.content) || []).map((c) => (c && c.text) || '').join('')",
    "  if (!text) return base",
    "  const m = BRIDGE_LINE_RE.exec(text)",
    "  if (!m) return base",
    "  const path = m[6].trim()",
    "  const loc = 'L' + m[2] + ':' + m[3] + '-L' + m[4] + ':' + m[5]",
    // v2.8.7：必须**全局**剔除——非全局的 BRIDGE_LINE_RE 只去掉第一条，框里一旦叠了多条隐式行
    // （交叠链的产物），残留的行会混进"用户要求"里，模型收到一条自相矛盾的指令。
    "  const instruction = text.replace(new RegExp(BRIDGE_LINE_RE.source, 'g'), '').trim() || '\u8BF7\u8BFB\u53D6\u8BE5\u533A\u57DF\u5185\u5BB9\u5E76\u5904\u7406'",
    "  const key = bridgeInjectKey(path, loc, instruction)",
    "  const sig = bridgeInjectSig(path, loc)",
    "  let windowHasInject = false",
    "  for (let i = 0; i < messages.length; i++) { const s = messages[i] && messages[i].source; if (s && (s.kind === BRIDGE_SOURCE_KIND || s.plugin === 'dsh-obsidian-bridge')) { windowHasInject = true; break } }",
    "  const sigOf = (x) => { try { const s2 = x && x.source; return s2 && typeof s2.summary === 'string' ? s2.summary : '' } catch (_) { return '' } }",
    "  const pendingSigs = (pending || []).map(sigOf).filter((x) => x !== '')",
    "  const surfaceSigs = (nodes || []).map(sigOf).filter((x) => x !== '')",
    "  const now = Date.now()",
    "  const data = bridgePrune(bridgeLoadLedger(), now)",
    "  const keyHits = bridgeKeyHits(data, key, now)",
    "  const sessionCount = data.sessions[sessionKey] || 0",
    "  const info = { key, sig, keyHits, sessionCount }",
    "  if (windowHasInject) return { ...base, ...info, reason: 'window' }",
    "  if (pendingSigs.indexOf(sig) >= 0) return { ...base, ...info, reason: 'pending' }",
    "  if (surfaceSigs.indexOf(sig) >= 0) return { ...base, ...info, reason: 'surface' }",
    "  if (keyHits >= INJECT_LIMITS.maxKeyHits) return { ...base, ...info, reason: 'ledger' }",
    "  if (sessionCount >= INJECT_LIMITS.maxSessionInjections) { bridgeSaveLedger({ ...data, storm: { at: now, reason: 'session cap', session: sessionKey } }); return { ...base, ...info, reason: 'caps' } }",
    "  const text2 = '[BRIDGES \u7F16\u8F91\u6307\u4EE4] \u76EE\u6807\u6587\u4EF6\uFF1A' + path + '\uFF1B\u9009\u533A\uFF081 \u57FA\u884C:\u5217\uFF09\uFF1A' + loc + '\uFF1B\u7528\u6237\u8981\u6C42\uFF1A' + instruction",
    "    + '\u3002\u5904\u7406\u540E\u5F15\u7528 vault \u5185\u5176\u5B83\u7B14\u8BB0\u65F6\uFF0C\u8BF7\u4F7F\u7528 [[\u7B14\u8BB0\u540D]] \u6216 [[\u8DEF\u5F84/\u7B14\u8BB0\u540D|\u522B\u540D]] \u8BED\u6CD5\uFF08\u4E0D\u8981\u7528\u666E\u901A Markdown \u94FE\u63A5\u6216\u7EDD\u5BF9\u8DEF\u5F84\uFF09\uFF0C\u8FD9\u6837 Obsidian \u91CC\u624D\u80FD\u70B9\u5F00\u3002\u5904\u7406\u8981\u6C42\uFF1A\u5148\u7528 fs read \u8BFB\u53D6\u8BE5\u533A\u57DF\u539F\u6587\uFF1B\u6309\u7528\u6237\u8981\u6C42\u76F4\u63A5\u751F\u6210\u7ED3\u679C\uFF08\u53EA\u8F93\u51FA\u7ED3\u679C\u672C\u8EAB\u3001\u4E00\u6BB5\u5373\u53EF\uFF0C\u4E0D\u8981\u9644\u5E26\u5B9A\u4F4D\u8BF4\u660E\u6216\u8865\u5145\uFF09\uFF1B\u968F\u540E\u8BE2\u95EE\u7528\u6237\u662F\u5426\u540C\u610F\u5C06\u8BE5\u7ED3\u679C\u5199\u5165\u6587\u4EF6\uFF1B\u7ECF\u7528\u6237\u540C\u610F\u540E\u518D\u7528 fs edit \u5199\u5165\uFF08old_string=\u8BFB\u53D6\u5230\u7684\u539F\u6587\uFF0C\u6309\u7528\u6237\u8981\u6C42\u66FF\u6362\u6216\u8FFD\u52A0\uFF09\u3002\u672C\u7F16\u8F91\u4EFB\u52A1\u5B8C\u6210\u540E\u8BF7\u5FFD\u7565\u672C\u6307\u4EE4\uFF0C\u52FF\u5728\u540E\u7EED\u5BF9\u8BDD\u4E2D\u91CD\u590D\u6267\u884C\u3002'",
    "  const msg = { id: bridgeMessageId(), role: 'user', source: { kind: BRIDGE_SOURCE_KIND, form: 'notice', summary: sig }, content: [{ type: 'text', text: text2 }] }",
    "  bridgeSaveLedger({ ...data, items: [...data.items, { key, at: now, count: keyHits + 1, session: sessionKey, sig }], sessions: { ...data.sessions, [sessionKey]: sessionCount + 1 } })",
    "  return { action: 'inject', reason: 'none', msg, key, sig, keyHits: keyHits + 1, sessionCount: sessionCount + 1 }",
    "}",
    // 单一出口：判定 + 决策日志（hook 与直接调用者共用，保证 inject-log.jsonl 一定被写）
    "function bridgeEditMaybeInject(input) {",
    "  const res = bridgeDecideInject(input || {})",
    "  bridgeLogDecision(res, input && input.sessionKey)",
    "  return res",
    "}",
    // v2.5.0：每会话一次的「vault 双链约定」指令（DSH 原生 inbox 一次性投递；台账 ruleSessions 防重复）。
    // 与"编辑指令"不同：这条对所有回答生效，让模型在引用库内笔记时用 [[wikilink]] 而不是裸路径。
    "function bridgeWikilinkRule(sessionKey) {",
    "  try {",
    "    const data = bridgePrune(bridgeLoadLedger(), Date.now())",
    "    const done = Array.isArray(data.ruleSessions) ? data.ruleSessions : []",
    "    if (!sessionKey || done.indexOf(sessionKey) >= 0) return null",
    "    bridgeSaveLedger({ ...data, ruleSessions: [...done, sessionKey].slice(-50) })",
    "    const text = '\u5F15\u7528\u672C vault \u5185\u7B14\u8BB0\u65F6\uFF0C\u8BF7\u4F7F\u7528 [[\u7B14\u8BB0\u540D]] \u6216 [[\u8DEF\u5F84/\u7B14\u8BB0\u540D|\u522B\u540D]] \u8BED\u6CD5\uFF08\u4E0D\u8981\u7528\u666E\u901A Markdown \u94FE\u63A5\u6216\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u94FE\u63A5\u76EE\u6807\u4E0D\u8981\u5E26 .md \u540E\u7F00\uFF09\uFF1B\u8FD9\u6837 Obsidian \u9762\u677F\u91CC\u624D\u80FD\u76F4\u63A5\u70B9\u5F00\u3002'",
    "    return { id: bridgeMessageId(), role: 'user', source: { kind: BRIDGE_SOURCE_KIND, form: 'notice', summary: '[BRIDGES \u7EA6\u5B9A] vault \u5185\u7B14\u8BB0\u5F15\u7528\u4F7F\u7528 [[wikilink]]' }, content: [{ type: 'text', text }] }",
    "  } catch (_) { return null }",
    "}"
  ].join("\n");
}
function removeDshFixDisable(content) {
  const lines = content.split("\n");
  const out = [];
  let skip = false;
  for (const line of lines) {
    if (/^#\s*dsh-fix:\s*disabled entry\s+"dsh-obsidian-bridge"/.test(line)) {
      skip = true;
      continue;
    }
    if (skip) {
      if (/^\s*-?\s*id:\s*"?dsh-obsidian-bridge"?\s*$/.test(line)) continue;
      if (/^\s*disabled:\s*true\s*$/.test(line)) {
        skip = false;
        continue;
      }
    }
    out.push(line);
  }
  const result = out.join("\n");
  return result === content ? content : result;
}
function contentHash(s) {
  return (0, import_node_crypto.createHash)("sha256").update(s, "utf8").digest("hex");
}
function atomicWrite(filePath, content) {
  const tmp = `${filePath}.tmp-${process.pid}`;
  (0, import_node_fs10.writeFileSync)(tmp, content, "utf8");
  (0, import_node_fs10.renameSync)(tmp, filePath);
}
function ensureProfileManifestVersion(dir) {
  try {
    const manifestPath = (0, import_node_path8.join)(dir, "package.json");
    if (!(0, import_node_fs10.existsSync)(manifestPath)) return false;
    const manifest = JSON.parse((0, import_node_fs10.readFileSync)(manifestPath, "utf8"));
    if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) return false;
    const record = manifest;
    if (typeof record.version === "string" && record.version.trim().length > 0) return false;
    const next = {};
    for (const [key, value] of Object.entries(record)) {
      next[key] = value;
      if (key === "name") next.version = PROFILE_MANIFEST_VERSION;
    }
    if (!("version" in next)) next.version = PROFILE_MANIFEST_VERSION;
    atomicWrite(manifestPath, JSON.stringify(next, null, 2) + "\n");
    return true;
  } catch (e) {
    return false;
  }
}
function upsertBridgeEntry(existing, entry, fileUrl) {
  var _a;
  const idMarker = `- id: ${BRIDGE_ENTRY_ID}`;
  const idIndex = existing.indexOf(idMarker);
  if (idIndex >= 0) {
    const afterId = existing.slice(idIndex + idMarker.length);
    const nameLine = /^([ \t]*name:[ \t]*)([^\n]*)$/m.exec(afterId);
    if (nameLine === null) return { content: existing, changed: false };
    if (nameLine[2].trim() === fileUrl) return { content: existing, changed: false };
    const start = idIndex + idMarker.length + ((_a = nameLine.index) != null ? _a : 0) + nameLine[1].length;
    const end = start + nameLine[2].length;
    return { content: `${existing.slice(0, start)}${fileUrl}${existing.slice(end)}`, changed: true };
  }
  const body = existing.split("\n").filter((line) => !line.trim().startsWith("#")).join("\n").trim();
  if (existing === "") {
    return { content: `# ${BRIDGE_ENTRY_ID} \u2014 installed by the dsh-harness Obsidian plugin
${entry}`, changed: true };
  }
  if (body === "[]") {
    const header = existing.trimEnd().replace(/\s*\[\s*\]\s*$/, "");
    return { content: `${header === "" || header.endsWith("\n") ? header : `${header}
`}${entry}`, changed: true };
  }
  if (/^-\s/.test(body)) {
    return { content: `${existing.trimEnd()}
${entry}`, changed: true };
  }
  return { content: existing, changed: false };
}
function writeBridgeFiles(home = dshHomeDir(), version = BRIDGE_PACKAGE_FALLBACK_VERSION, profile = "web", installAs = "path") {
  try {
    const dir = dshProfileDir(profile, home);
    (0, import_node_fs10.mkdirSync)(dir, { recursive: true });
    ensureProfileManifestVersion(dir);
    const pkgDir = bridgePackageDir(dir);
    (0, import_node_fs10.mkdirSync)(pkgDir, { recursive: true });
    const pluginPath = bridgeModulePath(dir);
    const manifestPath = (0, import_node_path8.join)(pkgDir, "package.json");
    const manifest = bridgePackageManifest(version, installAs === "package");
    if (!(0, import_node_fs10.existsSync)(manifestPath) || (0, import_node_fs10.readFileSync)(manifestPath, "utf8") !== manifest) {
      atomicWrite(manifestPath, manifest);
    }
    const source = bridgePluginSource();
    let pluginRewritten = false;
    if (!(0, import_node_fs10.existsSync)(pluginPath) || contentHash((0, import_node_fs10.readFileSync)(pluginPath, "utf8")) !== contentHash(source)) {
      if ((0, import_node_fs10.existsSync)(pluginPath)) {
        try {
          (0, import_node_fs10.writeFileSync)(`${pluginPath}.bak-local`, (0, import_node_fs10.readFileSync)(pluginPath, "utf8"), "utf8");
        } catch (e) {
        }
      }
      atomicWrite(pluginPath, source);
      pluginRewritten = true;
    }
    const patchPath = (0, import_node_path8.join)(dir, "cordis.patch.yml");
    let existing = (0, import_node_fs10.existsSync)(patchPath) ? (0, import_node_fs10.readFileSync)(patchPath, "utf8") : "";
    const healed = removeDshFixDisable(existing);
    if (healed !== existing) {
      atomicWrite(patchPath, healed);
      existing = healed;
      pluginRewritten = true;
    }
    const fileUrl = `file:///${pluginPath.replaceAll("\\", "/")}`;
    const clientPath = bridgeClientPath(dir);
    const clientSource = bridgeClientSource();
    if (installAs === "package") {
      if (!(0, import_node_fs10.existsSync)(clientPath) || contentHash((0, import_node_fs10.readFileSync)(clientPath, "utf8")) !== contentHash(clientSource)) {
        atomicWrite(clientPath, clientSource);
        pluginRewritten = true;
      }
    } else if ((0, import_node_fs10.existsSync)(clientPath)) {
      try {
        (0, import_node_fs10.rmSync)(clientPath, { force: true });
      } catch (e) {
      }
    }
    let specifier = fileUrl;
    let entrySource = `- insert:
    - id: ${BRIDGE_ENTRY_ID}
      name: ${fileUrl}
`;
    let modeError = "";
    if (installAs === "package") {
      const link = bridgePackageLinkPath(dir);
      const linked = ensurePackageLink(pkgDir, link);
      if (linked) {
        specifier = BRIDGE_PACKAGE_NAME;
        entrySource = `- insert:
    - id: ${BRIDGE_ENTRY_ID}
      name: ${BRIDGE_PACKAGE_NAME}
`;
      } else {
        modeError = t("bridge.packageLinkFailed");
      }
    }
    const upserted = upsertBridgeEntry(existing, entrySource, specifier);
    if (upserted.changed) atomicWrite(patchPath, upserted.content);
    if (!upserted.content.includes(specifier)) {
      return {
        changed: false,
        pluginPath,
        pluginRewritten,
        // 路径按当前 profile 报（v2.6.0 多 profile：写死 web 会把用户支到另一个档去）
        error: t("bridge.patchMergeError", { patch: `~/.dsh/profiles/${profile === "" ? "web" : profile}/cordis.patch.yml` })
      };
    }
    if (modeError !== "") {
      return { changed: upserted.changed, pluginPath, pluginRewritten, installAs: "path", error: modeError };
    }
    const legacyPath = (0, import_node_path8.join)(dir, BRIDGE_FILENAME);
    if ((0, import_node_fs10.existsSync)(legacyPath)) {
      try {
        if (!(0, import_node_fs10.existsSync)(`${legacyPath}.bak-local`)) {
          (0, import_node_fs10.writeFileSync)(`${legacyPath}.bak-local`, (0, import_node_fs10.readFileSync)(legacyPath, "utf8"), "utf8");
        }
        (0, import_node_fs10.rmSync)(legacyPath, { force: true });
      } catch (e) {
      }
    }
    return {
      changed: upserted.changed,
      pluginPath,
      pluginRewritten,
      installAs: specifier === BRIDGE_PACKAGE_NAME ? "package" : "path"
    };
  } catch (err) {
    return {
      changed: false,
      pluginPath: "",
      pluginRewritten: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}
function isBridgeInstalled(home = dshHomeDir(), profile = "web") {
  try {
    const dir = dshProfileDir(profile, home);
    if (!(0, import_node_fs10.existsSync)(bridgeModulePath(dir))) return false;
    const patchPath = (0, import_node_path8.join)(dir, "cordis.patch.yml");
    if (!(0, import_node_fs10.existsSync)(patchPath)) return false;
    return (0, import_node_fs10.readFileSync)(patchPath, "utf8").includes(BRIDGE_ENTRY_ID);
  } catch (e) {
    return false;
  }
}

// src/install-progress-modal.ts
var import_obsidian2 = require("obsidian");
var InstallProgressModal = class extends import_obsidian2.Modal {
  constructor(app) {
    super(app);
    this.rows = /* @__PURE__ */ new Map();
    this.lastPercent = -1;
    this.finished = false;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dsh-install-modal");
    contentEl.createEl("h3", { text: t("modal.installProgressTitle") });
    contentEl.createEl("p", { cls: "dsh-detail", text: t("modal.installProgressDesc") });
    const order = [
      ["git", t("view.install.git")],
      ["node", t("view.install.node")],
      ["pnpm", t("view.install.pnpm")],
      ["clone", t("install.downloading")],
      ["deps", t("install.depsInstalling")],
      ["build", t("install.buildStep")],
      ["cli", t("install.cliInstalling")]
    ];
    const list = contentEl.createDiv({ cls: "dsh-install-steps" });
    for (const [key, label] of order) {
      const row = list.createDiv({ cls: "dsh-install-step" });
      const mark = row.createSpan({ cls: "dsh-install-mark", text: "\u25CB" });
      row.createSpan({ cls: "dsh-install-label", text: label });
      this.rows.set(key, { row, mark });
    }
    const barBox = contentEl.createDiv({ cls: "dsh-progress" });
    this.bar = barBox.createDiv({ cls: "dsh-progress-bar" });
    this.pctText = barBox.createDiv({ cls: "dsh-progress-text", text: "0%" });
    const deps = checkDeps();
    this.markDone("git", deps.git);
    this.markDone("node", deps.node);
    this.markDone("pnpm", deps.pnpm);
  }
  onClose() {
    this.contentEl.empty();
  }
  /** 安装进度回调（installDsh onStep 的包装）：按 percent 定位阶段并更新。 */
  update(percent, stepText) {
    if (this.finished) return;
    const pct = Math.max(0, Math.min(100, Math.round(percent != null ? percent : 0)));
    if (pct !== this.lastPercent) {
      this.lastPercent = pct;
      this.bar.setCssProps({ width: `${pct}%` });
      this.pctText.textContent = `${pct}%`;
    }
    if (pct > 0 && pct < 30) {
      this.activateByDepName(stepText);
    } else if (pct >= 30 && pct < 65) {
      this.activate("clone");
    } else if (pct >= 65 && pct < 75) {
      this.activate("deps");
    } else if (pct >= 75 && pct < 92) {
      this.activate("build");
    } else if (pct >= 92 && pct < 100) {
      this.activate("cli");
    } else if (pct >= 100) {
      this.done();
    }
  }
  /** 全部完成：剩余步骤打勾。 */
  done() {
    this.finished = true;
    for (const key of this.rows.keys()) this.markDone(key, true);
    this.bar.setCssProps({ width: "100%" });
    this.pctText.textContent = "100%";
  }
  /** 失败：当前阶段打叉（其余保持现状，用户可重试）。 */
  fail() {
    this.finished = true;
    for (const { mark } of this.rows.values()) {
      if (mark.textContent === "\u25CF" || mark.textContent === "\u25CB") {
        mark.textContent = "\u2717";
        mark.addClass("dsh-install-mark-fail");
      }
    }
  }
  markDone(key, ok) {
    const entry = this.rows.get(key);
    if (!entry) return;
    entry.mark.textContent = ok ? "\u2713" : "\u25CB";
    entry.row.addClass(ok ? "dsh-install-step-done" : "");
    if (ok) entry.mark.addClass("dsh-install-mark-ok");
  }
  activate(key) {
    for (const [k, { mark, row }] of this.rows) {
      if (k === key) {
        mark.textContent = "\u25CF";
        mark.addClass("dsh-install-mark-active");
        row.addClass("dsh-install-step-active");
      } else if (mark.textContent === "\u25CF") {
        mark.textContent = "\u2713";
        mark.removeClass("dsh-install-mark-active");
        mark.addClass("dsh-install-mark-ok");
        row.addClass("dsh-install-step-done");
        row.removeClass("dsh-install-step-active");
      }
    }
  }
  /** 依赖阶段：install.autoDep 的 step 文本含依赖名（git/node/pnpm）。 */
  activateByDepName(stepText) {
    const lower = stepText.toLowerCase();
    if (lower.includes("git")) this.activate("git");
    else if (lower.includes("node")) this.activate("node");
    else if (lower.includes("pnpm")) this.activate("pnpm");
  }
};
var UpdatingModal = class extends import_obsidian2.Modal {
  constructor(app) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dsh-install-modal");
    contentEl.createEl("h3", { text: t("up.cliUpdatingTitle") });
    const box = contentEl.createDiv({ cls: "dsh-updating" });
    box.createDiv({ cls: "dsh-spinner" });
    this.statusEl = box.createEl("p", { cls: "dsh-detail", text: t("up.cliUpdating") });
  }
  /** 更新阶段文本（如：已停止服务 / 正在重启服务…）。 */
  setStatus(text) {
    this.statusEl.textContent = text;
  }
  /** 失败：显示错误并停止转圈。 */
  fail(err) {
    var _a;
    this.statusEl.textContent = t("up.cliFail", { err });
    const spinner = (_a = this.statusEl.parentElement) == null ? void 0 : _a.querySelector(".dsh-spinner");
    spinner == null ? void 0 : spinner.addClass("dsh-spinner-fail");
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/aed-modal.ts
var import_obsidian3 = require("obsidian");
var AedBootModal = class extends import_obsidian3.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    var _a;
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("aed.verifyModalTitle") });
    const isAuth = this.opts.kind === "auth";
    const hasBrowser = isAuth && ((_a = this.opts.browserUrl) != null ? _a : "") !== "";
    new import_obsidian3.Setting(contentEl).setName(t("aed.modal.type")).setDesc(t(`aed.kind.${this.opts.kind}`));
    new import_obsidian3.Setting(contentEl).setName(t("aed.modal.reason")).setDesc(t(`aed.reason.${this.opts.kind}`));
    const fixText = isAuth ? hasBrowser ? t("aed.fix.auth.browser") : t("aed.fix.auth.none") : this.opts.autoFixable ? t("aed.fix.patch") : t("aed.fix.none");
    new import_obsidian3.Setting(contentEl).setName(t("aed.modal.fix")).setDesc(fixText);
    if (isAuth) {
      contentEl.createEl("p", { text: t("aed.fix.auth.lost"), cls: "dsh-modal-danger" });
    }
    if (this.opts.detail) {
      contentEl.createEl("p", { text: t("aed.modal.detail", { detail: this.opts.detail }), cls: "dsh-aed-detail" });
    }
    const s = new import_obsidian3.Setting(contentEl);
    s.addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close()));
    if (isAuth && hasBrowser) {
      s.addButton(
        (b) => b.setButtonText(t("aed.modal.openBrowser")).setCta().onClick(() => {
          var _a2, _b;
          this.close();
          (_b = (_a2 = this.opts).onOpenBrowser) == null ? void 0 : _b.call(_a2);
        })
      );
    } else if (this.opts.autoFixable) {
      s.addButton(
        (b) => b.setButtonText(t("aed.modal.apply")).setCta().onClick(async () => {
          this.close();
          await this.opts.onApply();
        })
      );
    } else {
      s.addButton((b) => b.setButtonText(t("aed.modal.understood")).setCta().onClick(() => this.close()));
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var AedSymptomsModal = class extends import_obsidian3.Modal {
  constructor(app) {
    super(app);
  }
  /** 一条症状：✓／✗ 单独成 span（着色），正文另起 span 保持正常文字色。 */
  addSymptom(list, text, can) {
    const li = list.createEl("li");
    li.createSpan({ cls: can ? "dsh-symptom-yes" : "dsh-symptom-no", text: can ? "\u2713" : "\u2717" });
    li.createSpan({ cls: "dsh-symptom-text", text });
  }
  addList(contentEl, titleKey, itemsKey, can) {
    contentEl.createEl("p", { text: t(titleKey), cls: "dsh-symptoms-title" });
    const list = contentEl.createEl("ul", { cls: "dsh-modal-bullets" });
    for (const line of t(itemsKey).split("\n")) {
      if (line === "") continue;
      this.addSymptom(list, line, can);
    }
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("aed.symptoms.title") });
    contentEl.createEl("p", { text: t("aed.symptoms.depNote"), cls: "dsh-modal-detail" });
    this.addList(contentEl, "aed.symptoms.canTitle", "aed.symptoms.can", true);
    this.addList(contentEl, "aed.symptoms.cannotTitle", "aed.symptoms.cannot", false);
    contentEl.createEl("p", { text: t("aed.symptoms.exitNote"), cls: "dsh-modal-detail" });
    new import_obsidian3.Setting(contentEl).addButton(
      (b) => b.setButtonText(t("compat.explain.close")).setCta().onClick(() => this.close())
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/mobile-access-modal.ts
var import_obsidian4 = require("obsidian");
function bulletLines(key, vars) {
  return t(key, vars).split("\n").map((line) => line.trim()).filter((line) => line !== "");
}
function addParagraphs(contentEl, key, vars, cls) {
  for (const line of bulletLines(key, vars)) contentEl.createEl("p", { text: line, cls });
}
function addList(contentEl, titleKey, itemsKey, opts) {
  contentEl.createEl("p", { text: t(titleKey), cls: "dsh-symptoms-title" });
  const list = contentEl.createEl((opts == null ? void 0 : opts.ordered) === true ? "ol" : "ul", { cls: "dsh-modal-bullets" });
  for (const line of bulletLines(itemsKey)) {
    list.createEl("li", (opts == null ? void 0 : opts.itemCls) !== void 0 ? { text: line, cls: opts.itemCls } : { text: line });
  }
}
function mobileErrorText(error) {
  if (error === "busy") return t("mobile.err.busy");
  if (error.includes("no-lan-address")) return t("mobile.err.noLan");
  if (error.includes("desktop-missing")) return t("mobile.err.desktop");
  if (error.includes("custom-host")) return t("mobile.err.customHost");
  if (error.includes("custom-tls")) return t("mobile.err.customTls");
  return t("mobile.err.gen", { err: error });
}
var MobileAccessHelpModal = class extends import_obsidian4.Modal {
  constructor(app) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("mobile.help.title") });
    contentEl.createEl("p", { text: t("mobile.help.intro"), cls: "dsh-modal-detail" });
    addList(contentEl, "mobile.help.sceneTitle", "mobile.help.scene");
    contentEl.createEl("p", { text: t("mobile.help.requires"), cls: "dsh-modal-detail" });
    contentEl.createEl("p", { text: t("mobile.help.keepAwake"), cls: "dsh-modal-detail" });
    addList(contentEl, "mobile.help.does.title", "mobile.help.does");
    addList(contentEl, "mobile.help.tokenTitle", "mobile.help.tokenFlow", { ordered: true });
    addList(contentEl, "mobile.help.resultTitle", "mobile.help.result");
    addList(contentEl, "mobile.help.limits.title", "mobile.help.limits");
    new import_obsidian4.Setting(contentEl).addButton(
      (b) => b.setButtonText(t("compat.explain.close")).setCta().onClick(() => this.close())
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};
var MobileAccessIntroModal = class extends import_obsidian4.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("mobile.intro.title") });
    contentEl.createEl("p", { text: t("mobile.intro.riskTitle"), cls: "dsh-symptoms-title dsh-modal-danger" });
    const risk = contentEl.createEl("ul", { cls: "dsh-modal-bullets" });
    for (const line of bulletLines("mobile.intro.risk")) {
      risk.createEl("li", { text: line, cls: "dsh-modal-danger" });
    }
    addList(contentEl, "mobile.intro.stepsTitle", "mobile.intro.steps", { ordered: true });
    contentEl.createEl("p", { text: t("mobile.intro.note"), cls: "dsh-modal-detail" });
    new import_obsidian4.Setting(contentEl).addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close())).addButton(
      (b) => b.setButtonText(t("mobile.intro.confirm")).setCta().onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("settings.mobile.btnBusy"));
        const res = await this.plugin.generateMobileAccessConfig();
        if (!res.ok) {
          b.setDisabled(false);
          b.setButtonText(t("mobile.intro.confirm"));
          new import_obsidian4.Notice(mobileErrorText(res.error), 12e3);
          return;
        }
        this.close();
        new MobileAccessDoneModal(this.app, this.plugin, res.result, res.trust).open();
      })
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};
var MobileAccessDoneModal = class extends import_obsidian4.Modal {
  constructor(app, plugin, result, trust) {
    super(app);
    this.plugin = plugin;
    this.result = result;
    this.trust = trust;
  }
  onOpen() {
    var _a;
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("mobile.done.title") });
    addParagraphs(contentEl, "mobile.done.files", {
      host: this.result.host,
      port: String(this.plugin.settings.port),
      cert: this.result.certPath,
      key: this.result.keyPath
    }, "dsh-modal-detail");
    contentEl.createEl("p", { text: t("mobile.done.rootCa", { root: this.result.rootCaPath }), cls: "dsh-modal-detail" });
    if (this.trust.ok) {
      contentEl.createEl("p", { text: t("mobile.done.windowsAuto") });
    } else {
      contentEl.createEl("p", { text: t("mobile.done.windows") });
      if (!this.trust.skipped) {
        contentEl.createEl("p", {
          text: t("mobile.done.trustFail", { err: (_a = this.trust.error) != null ? _a : "" }),
          cls: "dsh-modal-danger"
        });
      }
    }
    addList(contentEl, "mobile.done.iosTitle", "mobile.done.ios", { ordered: true });
    addList(contentEl, "mobile.done.androidTitle", "mobile.done.android", { ordered: true });
    contentEl.createEl("p", { text: t("mobile.done.nextToken"), cls: "dsh-modal-detail" });
    new import_obsidian4.Setting(contentEl).addButton(
      (b) => b.setButtonText(t("mobile.done.later")).onClick(() => {
        this.close();
        new import_obsidian4.Notice(t("mobile.done.laterHint"), 1e4);
      })
    ).addButton(
      (b) => b.setButtonText(t("mobile.done.restart")).setCta().onClick(() => {
        b.setDisabled(true);
        this.close();
        void this.plugin.restartDshService();
      })
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};
var MobileAccessResetModal = class extends import_obsidian4.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("dsh-aed-modal");
    contentEl.createEl("h3", { text: t("reset.title") });
    addParagraphs(contentEl, "reset.body", {
      cert: this.opts.certPath !== "" ? this.opts.certPath : t("err.unknown"),
      key: this.opts.keyPath !== "" ? this.opts.keyPath : t("err.unknown")
    }, "dsh-modal-detail");
    new import_obsidian4.Setting(contentEl).addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close())).addButton(
      (b) => b.setButtonText(t("reset.confirm")).setCta().onClick(async () => {
        b.setDisabled(true);
        this.close();
        await this.opts.onConfirm();
      })
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/bridge-mode.ts
function migrateBridgeMode(v) {
  if (v === true) return "auto";
  if (v === false) return "off";
  return null;
}
function normalizeBridgeInputMode(v) {
  return v === "dom" ? "dom" : "auto";
}
function installModeFor(input) {
  return input === "auto" ? "package" : "path";
}

// src/ui-compat.ts
function markDestructive(btn) {
  const capable = btn;
  if (typeof capable.setDestructive === "function") {
    capable.setDestructive();
    if (typeof capable.setCta === "function") capable.setCta();
    return btn;
  }
  const legacy = btn;
  legacy.setWarning();
  return btn;
}
function refreshSettingTab(tab) {
  if (tab === null || tab === void 0) return;
  const capable = tab;
  if (typeof capable.update === "function") {
    capable.update();
    return;
  }
  const legacy = tab;
  legacy.display();
}
function showSliderValueBubble(slider) {
  var _a;
  const capable = slider;
  (_a = capable.setDynamicTooltip) == null ? void 0 : _a.call(capable);
  return slider;
}

// src/settings.ts
var DEFAULT_SETTINGS = {
  port: 3080,
  serviceHost: DEFAULT_SERVICE_HOST,
  serviceScheme: "http",
  tlsCertPath: "",
  tlsKeyPath: "",
  startupCommand: "",
  startupCwd: "",
  profile: "web",
  autoStart: true,
  detached: true,
  readyTimeoutSec: 300,
  zoom: 0.6,
  installDir: "",
  installUrl: DEFAULT_DSH_REPO_URL,
  updateMirrorUrl: "",
  language: "auto",
  openPanelOnSend: true,
  bridgeToObsidian: "auto",
  bridgeInputMode: "auto",
  bottomPadPx: 20,
  shortcutPassthrough: true,
  updateChannel: DEFAULT_UPDATE_CHANNEL,
  autoCheckUpdates: true,
  autoCheckIntervalHours: 24,
  lastAutoUpdateAtMs: 0
};
var MIN_AUTO_CHECK_HOURS = 1;
function resetEndpointSettings() {
  return { serviceHost: DEFAULT_SERVICE_HOST, serviceScheme: "http", tlsCertPath: "", tlsKeyPath: "" };
}
function isDefaultEndpointSettings(s) {
  return s.serviceHost === DEFAULT_SERVICE_HOST && s.serviceScheme === "http" && s.tlsCertPath.trim() === "" && s.tlsKeyPath.trim() === "";
}
function startupCommandHint() {
  return `${t("settings.command.hint")} ${t("settings.command.hint.endpoint")}`;
}
function connectionTestMessage(result, addr) {
  var _a, _b;
  switch (result.kind) {
    case "ok":
      return t("settings.conn.ok", { addr, status: result.detail });
    case "http":
      return t("settings.conn.http", { addr, status: result.detail });
    case "refused":
      return t("settings.conn.refused", { addr });
    case "timeout":
      return t("settings.conn.timeout", { addr });
    case "other":
      return t("settings.conn.other", { addr, err: result.detail });
    case "tls": {
      const code = (_b = (_a = /code=([A-Z0-9_]+)/.exec(result.detail)) == null ? void 0 : _a[1]) != null ? _b : "TLS";
      const tlsKind = tlsErrorKind({ message: result.detail });
      if (tlsKind === "untrusted") return t("settings.conn.tlsUntrusted", { addr, code });
      if (tlsKind === "altname") return t("settings.conn.tlsAltname", { addr, code });
      if (tlsKind === "expired") return t("settings.conn.tlsExpired", { addr, code });
      return t("settings.conn.tlsOther", { addr, code, err: result.detail });
    }
  }
}
var DshSettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    /** 文本/滑杆控件防抖定时器（避免逐键/逐格触发保存与服务重建）。 */
    this.saveTimer = null;
    /** profile 新建文本框的草稿（点「新建并切换」才生效——逐字符切档会反复重启服务）。 */
    this.profileDraft = "";
    /** 「诊断 → 连接地址」行：端点相关控件变更后就地刷新它的展示串（不整页重画，避免打断输入）。 */
    this.connRowSetting = null;
  }
  /** 防抖执行保存+副作用（默认 500ms）；连续输入只触发最后一次。 */
  scheduleSave(effect, ms = 500) {
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = null;
      effect();
    }, ms);
  }
  /** 就地刷新「连接地址」行（端点四项任一变更后调用；只改 desc，不重画整页）。 */
  refreshEndpointRow() {
    var _a;
    (_a = this.connRowSetting) == null ? void 0 : _a.setDesc(endpointLabel(endpointFromSettings(this.plugin.settings)));
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("dsh-settings-tab");
    const detectedDir = locateDshRepoDir(defaultCandidates(this.plugin.settings.startupCwd));
    if (!this.plugin.settings.installDir && detectedDir) {
      this.plugin.settings.installDir = detectedDir;
      void this.plugin.saveSettings();
    }
    const statusSetting = new import_obsidian5.Setting(containerEl).setName(t("settings.status.title")).setDesc(t("settings.status.reading")).setClass("dsh-bridge-status-row").addButton(
      (b) => b.setButtonText(t("settings.status.check")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("settings.status.checking"));
        await this.plugin.checkUpdates();
        b.setDisabled(false);
        b.setButtonText(t("settings.status.check"));
      })
    );
    statusSetting.descEl.empty();
    const renderStatus = (label) => {
      statusSetting.descEl.createSpan({ text: label });
      statusSetting.descEl.createSpan({ text: " \xB7 " });
      const link = statusSetting.descEl.createEl("a", {
        cls: "dsh-changelog-link",
        text: t("settings.status.changelog"),
        href: "#"
      });
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.plugin.openInBrowser(this.plugin.getDshReleasesUrl());
      });
    };
    renderStatus(t("settings.status.reading"));
    void Promise.all([this.plugin.getDshStatus(), this.plugin.getCompatSnapshot()]).then(([s, c]) => {
      let text;
      if (!s.installed) {
        text = t("settings.status.notInstalled");
      } else if (s.online) {
        text = s.version !== t("up.unknown") ? t("settings.status.installedVer", { v: s.version }) : t("settings.status.installed");
      } else {
        text = t("settings.status.stopped");
      }
      const tone = !c ? t("compat.tone.unknown") : c.issue === null ? t(c.level === "unknown" ? "compat.tone.unknown" : "compat.tone.ok") : t(`compat.tone.${c.issue}`);
      statusSetting.descEl.empty();
      renderStatus(`${text} \xB7 ${tone}`);
    });
    const pluginVersionSetting = new import_obsidian5.Setting(containerEl).setName(t("settings.pluginVersion.title")).setDesc(t("settings.status.reading")).setClass("dsh-bridge-status-row").addButton(
      (b) => b.setButtonText(t("settings.pluginVersion.check")).onClick(() => {
        void this.plugin.checkPluginUpdates();
      })
    );
    pluginVersionSetting.descEl.empty();
    const renderPluginVersion = () => {
      pluginVersionSetting.descEl.createSpan({ text: t("settings.pluginVersion.installed", { v: this.plugin.manifest.version }) });
      pluginVersionSetting.descEl.createSpan({ text: " \xB7 " });
      const link = pluginVersionSetting.descEl.createEl("a", {
        cls: "dsh-changelog-link",
        text: t("settings.pluginVersion.changelog"),
        href: "#"
      });
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.plugin.showPluginChangelog();
      });
      pluginVersionSetting.descEl.createSpan({ text: " \xB7 " });
      const compatLink = pluginVersionSetting.descEl.createEl("a", {
        cls: "dsh-changelog-link",
        text: t("settings.pluginVersion.compatLink"),
        href: "#"
      });
      compatLink.addEventListener("click", (e) => {
        e.preventDefault();
        void this.plugin.showCompatExplanation();
      });
      pluginVersionSetting.descEl.createEl("br");
      const repoLink = pluginVersionSetting.descEl.createEl("a", {
        cls: "dsh-changelog-link",
        text: this.plugin.getPluginRepoUrl(),
        href: "#"
      });
      repoLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.plugin.openInBrowser(this.plugin.getPluginRepoUrl());
      });
      pluginVersionSetting.descEl.createSpan({ text: ` ${t("settings.pluginVersion.repoHint")}` });
    };
    renderPluginVersion();
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.basic")).setHeading();
    new import_obsidian5.Setting(containerEl).setName(t("settings.language.title")).setDesc(t("settings.language.desc")).addDropdown(
      (d) => d.addOption("auto", t("settings.language.auto")).addOption("zh", t("settings.language.zh")).addOption("en", t("settings.language.en")).setValue(this.plugin.settings.language).onChange(async (v) => {
        this.plugin.settings.language = v;
        await this.plugin.saveSettings();
        applyLocale(
          this.plugin.settings.language,
          this.plugin.settings.language === "auto" ? this.plugin.detectSystemLanguage() : void 0
        );
        refreshSettingTab(this);
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.install.title")).setDesc(t("settings.install.desc")).setClass("dsh-config-row").addButton(
      (b) => b.setButtonText(t("settings.install.btn")).onClick(async () => {
        b.setDisabled(true);
        const modal = new InstallProgressModal(this.app);
        modal.open();
        const ok = await this.plugin.installWithPathPrompt((step, percent) => modal.update(percent != null ? percent : 0, step));
        if (ok) {
          modal.done();
          window.setTimeout(() => modal.close(), 1500);
        } else {
          modal.fail();
        }
        b.setDisabled(false);
        b.setButtonText(t("settings.install.btn"));
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.detect.title")).setDesc(t("settings.detect.desc")).addButton(
      (b) => b.setButtonText(t("settings.detect.btn")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("settings.detect.progress"));
        await this.plugin.detectAndApplyConfig();
        b.setDisabled(false);
        b.setButtonText(t("settings.detect.btn"));
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.installDir.title")).setDesc(t("settings.installDir.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.installDir).onChange((v) => {
        this.plugin.settings.installDir = v.trim();
        this.scheduleSave(() => void this.plugin.saveSettings());
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.zoom.title")).setDesc(t("settings.zoom.desc", { z: this.plugin.settings.zoom.toFixed(2) })).addSlider(
      (s) => s.setLimits(0.5, 2, 0.05).setValue(this.plugin.settings.zoom).onChange((v) => {
        this.plugin.settings.zoom = v;
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          void ((_b = (_a = this.plugin).refreshView) == null ? void 0 : _b.call(_a));
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.bottomPad.title")).setDesc(t("settings.bottomPad.desc", { px: this.plugin.settings.bottomPadPx })).addSlider(
      (s) => s.setLimits(0, 30, 1).setValue(this.plugin.settings.bottomPadPx).onChange((v) => {
        this.plugin.settings.bottomPadPx = v;
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          void ((_b = (_a = this.plugin).refreshView) == null ? void 0 : _b.call(_a));
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.quick")).setHeading();
    new import_obsidian5.Setting(containerEl).setName(t("settings.reconnect.title")).setDesc(t("settings.reconnect.desc")).addButton(
      (b) => b.setButtonText(t("settings.reconnect.btn")).onClick(async () => {
        b.setDisabled(true);
        await this.plugin.reconnectDsh();
        b.setDisabled(false);
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.bridge.restart.title")).setDesc(t("settings.bridge.restart.desc")).addButton(
      (b) => b.setButtonText(t("settings.bridge.restart.btn")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("settings.bridge.restart.progress"));
        await this.plugin.restartDshService();
        b.setDisabled(false);
        b.setButtonText(t("settings.bridge.restart.btn"));
        void this.plugin.probeBridgeReady().then(() => refreshBridgeStatus());
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.browser.title")).setDesc(t("settings.browser.desc")).addButton(
      (b) => b.setButtonText(t("settings.browser.btn")).onClick(() => {
        this.plugin.openDshInBrowser();
      })
    ).addButton(
      (b) => b.setButtonText(t("settings.browser.copyToken")).onClick(() => {
        void this.plugin.copyDshTokenUrl();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.repair.title")).setDesc(t("settings.repair.desc")).addButton(
      (b) => b.setButtonText(t("settings.repair.btn")).onClick(() => {
        this.plugin.openSessionRepair();
      })
    );
    const aedRow = new import_obsidian5.Setting(containerEl).setName(t("settings.aed.title")).setDesc(t("settings.aed.desc")).setClass("dsh-bridge-status-row").addButton(
      (b) => b.setButtonText(t("settings.aed.btn")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("aed.running"));
        const home = this.plugin.aedHomeDir();
        const result = await this.plugin.runAedRecovery(home);
        new import_obsidian5.Notice(result.message, result.ok ? 8e3 : 12e3);
        b.setDisabled(false);
        b.setButtonText(t("settings.aed.btn"));
      })
    ).addButton(
      (b) => b.setButtonText(t("settings.exitSafeMode.btn")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("aed.running"));
        const home = this.plugin.aedHomeDir();
        const result = await this.plugin.runExitSafeMode(home);
        new import_obsidian5.Notice(result.message, result.ok ? 8e3 : 12e3);
        b.setDisabled(false);
        b.setButtonText(t("settings.exitSafeMode.btn"));
      })
    );
    const symptomsLink = aedRow.nameEl.createEl("a", {
      cls: "dsh-aed-symptoms-link",
      text: t("settings.aed.symptomsLink"),
      href: "#"
    });
    const symptomsIcon = symptomsLink.createSpan({ cls: "dsh-aed-symptoms-icon" });
    (0, import_obsidian5.setIcon)(symptomsIcon, "help-circle");
    if (symptomsIcon.childElementCount === 0) (0, import_obsidian5.setIcon)(symptomsIcon, "circle-help");
    symptomsLink.insertBefore(symptomsIcon, symptomsLink.firstChild);
    symptomsLink.addEventListener("click", (e) => {
      e.preventDefault();
      new AedSymptomsModal(this.app).open();
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.cleanup.title")).setDesc(t("settings.cleanup.desc")).setClass("dsh-bridge-status-row").addButton(
      (b) => markDestructive(b).setButtonText(t("settings.cleanup.btn")).onClick(() => {
        this.plugin.openCleanReinstallModal();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.send")).setHeading();
    const bridgeStatus = new import_obsidian5.Setting(containerEl).setName(t("settings.bridge.status.title")).setDesc(t("settings.status.reading")).setClass("dsh-bridge-status-row").addButton(
      (b) => b.setButtonText(t("settings.bridge.rewrite.btn")).onClick(() => {
        const r = writeBridgeFiles(
          void 0,
          this.plugin.manifest.version,
          this.plugin.settings.profile,
          installModeFor(normalizeBridgeInputMode(this.plugin.settings.bridgeInputMode))
        );
        if (r.error) {
          new import_obsidian5.Notice(t("settings.bridge.rewrite.fail", { err: r.error }), 8e3);
          return;
        }
        new import_obsidian5.Notice(r.changed ? t("settings.bridge.rewrite.updated") : t("settings.bridge.rewrite.ready"), 6e3);
        refreshBridgeStatus();
      })
    );
    const refreshBridgeStatus = () => {
      const s = this.plugin.getBridgeStatus();
      bridgeStatus.descEl.addClass("dsh-bridge-status");
      bridgeStatus.descEl.textContent = s.installed ? s.ready ? t("settings.bridge.status.installedReady") : t("settings.bridge.status.installedNotReady") : t("settings.bridge.status.notInstalled");
    };
    refreshBridgeStatus();
    void this.plugin.probeBridgeReady().then(() => refreshBridgeStatus());
    new import_obsidian5.Setting(containerEl).setName(t("settings.passthrough.title")).setDesc(t("settings.passthrough.desc")).setClass("dsh-bridge-status-row").addToggle(
      (tEl) => tEl.setValue(this.plugin.settings.shortcutPassthrough).onChange(async (v) => {
        var _a, _b;
        this.plugin.settings.shortcutPassthrough = v;
        await this.plugin.saveSettings();
        void ((_b = (_a = this.plugin).refreshView) == null ? void 0 : _b.call(_a));
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.send.openPanel.title")).setDesc(t("settings.send.openPanel.desc")).addToggle(
      (tEl) => tEl.setValue(this.plugin.settings.openPanelOnSend).onChange(async (v) => {
        this.plugin.settings.openPanelOnSend = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.bridge.toObsidian.title")).setDesc(t("settings.bridge.toObsidian.desc")).setClass("dsh-bridge-mode-row").addDropdown(
      (dd) => dd.addOption("off", t("settings.bridge.toObsidian.off")).addOption("auto", t("settings.bridge.toObsidian.auto")).addOption("rightClick", t("settings.bridge.toObsidian.rightClick")).setValue(this.plugin.settings.bridgeToObsidian).onChange(async (v) => {
        this.plugin.settings.bridgeToObsidian = v;
        await this.plugin.saveSettings();
        this.plugin.syncAutoSendRegistration();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.advanced")).setHeading();
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.service")).setHeading();
    containerEl.createDiv({ cls: "setting-item-description", text: t("settings.section.service.desc") });
    const mobileRow = new import_obsidian5.Setting(containerEl).setName(t("settings.mobile.title")).setDesc(t("settings.mobile.desc")).setClass("dsh-bridge-status-row").addButton(
      (b) => b.setButtonText(t("settings.mobile.btn")).onClick(() => {
        new MobileAccessIntroModal(this.app, this.plugin).open();
      })
    ).addButton(
      (b) => b.setButtonText(t("settings.mobile.resetBtn")).onClick(() => {
        if (isDefaultEndpointSettings(this.plugin.settings)) {
          new import_obsidian5.Notice(t("reset.alreadyDefault"), 6e3);
          return;
        }
        new MobileAccessResetModal(this.app, {
          certPath: this.plugin.settings.tlsCertPath,
          keyPath: this.plugin.settings.tlsKeyPath,
          onConfirm: async () => {
            await this.plugin.resetMobileAccessSettings();
            new import_obsidian5.Notice(t("reset.done"), 8e3);
          }
        }).open();
      })
    );
    const mobileHelpLink = mobileRow.nameEl.createEl("a", {
      cls: "dsh-aed-symptoms-link",
      text: t("settings.mobile.helpLink"),
      href: "#"
    });
    const mobileHelpIcon = mobileHelpLink.createSpan({ cls: "dsh-aed-symptoms-icon" });
    (0, import_obsidian5.setIcon)(mobileHelpIcon, "help-circle");
    if (mobileHelpIcon.childElementCount === 0) (0, import_obsidian5.setIcon)(mobileHelpIcon, "circle-help");
    mobileHelpLink.insertBefore(mobileHelpIcon, mobileHelpLink.firstChild);
    mobileHelpLink.addEventListener("click", (e) => {
      e.preventDefault();
      new MobileAccessHelpModal(this.app).open();
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.host.title")).setDesc(t("settings.host.desc")).addText((tEl) => {
      const applyHost = (raw) => {
        const check = normalizeServiceHost(raw);
        if (!check.ok) {
          new import_obsidian5.Notice(t("settings.host.invalid"), 1e4);
          tEl.setValue(this.plugin.settings.serviceHost);
          return;
        }
        this.plugin.settings.serviceHost = check.host;
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
          paintServiceWarnings();
          this.refreshEndpointRow();
        });
      };
      tEl.setValue(this.plugin.settings.serviceHost).onChange((v) => {
        if (!normalizeServiceHost(v).ok) return;
        applyHost(v);
      });
      tEl.inputEl.addEventListener("blur", () => {
        if (!normalizeServiceHost(tEl.getValue()).ok) applyHost(tEl.getValue());
      });
      tEl.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !normalizeServiceHost(tEl.getValue()).ok) applyHost(tEl.getValue());
      });
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.port.title")).setDesc(t("settings.port.desc")).addText(
      (tEl) => tEl.setValue(String(this.plugin.settings.port)).onChange((v) => {
        const n = Number(v);
        if (Number.isInteger(n) && n > 0 && n <= 65535) {
          this.plugin.settings.port = n;
          this.scheduleSave(() => {
            var _a, _b;
            void this.plugin.saveSettings();
            (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
            this.refreshEndpointRow();
          });
        }
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.scheme.title")).setDesc(t("settings.scheme.desc")).addDropdown(
      (d) => d.addOption("http", t("settings.scheme.http")).addOption("https", t("settings.scheme.https")).setValue(this.plugin.settings.serviceScheme).onChange(async (v) => {
        var _a, _b;
        const next = v === "https" ? "https" : "http";
        if (httpsSwitchNeedsPair({
          scheme: next,
          startupCommand: this.plugin.settings.startupCommand,
          tlsCertPath: this.plugin.settings.tlsCertPath,
          tlsKeyPath: this.plugin.settings.tlsKeyPath
        })) {
          new import_obsidian5.Notice(t("settings.tls.needPair"), 12e3);
          d.setValue(this.plugin.settings.serviceScheme);
          return;
        }
        this.plugin.settings.serviceScheme = next;
        await this.plugin.saveSettings();
        (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
        paintServiceWarnings();
        this.refreshEndpointRow();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.tlsCert.title")).setDesc(t("settings.tlsCert.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.tlsCertPath).onChange((v) => {
        this.plugin.settings.tlsCertPath = v.trim();
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
          paintServiceWarnings();
          this.refreshEndpointRow();
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.tlsKey.title")).setDesc(t("settings.tlsKey.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.tlsKeyPath).onChange((v) => {
        this.plugin.settings.tlsKeyPath = v.trim();
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
          paintServiceWarnings();
          this.refreshEndpointRow();
        });
      })
    );
    const serviceWarnEl = containerEl.createDiv({ cls: "setting-item-description" });
    const paintServiceWarnings = () => {
      serviceWarnEl.empty();
      const s = this.plugin.settings;
      const warnings = [];
      if (!isLoopbackHost(s.serviceHost)) warnings.push(t("settings.host.lanWarn"));
      const commandHost = hostFlagInCommand(s.startupCommand);
      if (commandHost !== null) {
        const normalized = normalizeServiceHost(commandHost);
        if (!normalized.ok || normalized.host !== s.serviceHost.toLowerCase()) {
          warnings.push(t("settings.command.hostMismatch", { cmd: commandHost, host: s.serviceHost }));
        }
      }
      if (s.serviceScheme === "https") {
        warnings.push(t("settings.tls.trustHint"));
        if (s.tlsCertPath.trim() === "" || s.tlsKeyPath.trim() === "") warnings.push(t("settings.tls.missingWarn"));
      }
      for (const text of warnings) serviceWarnEl.createDiv({ text });
    };
    paintServiceWarnings();
    new import_obsidian5.Setting(containerEl).setName(t("settings.autoStart.title")).setDesc(t("settings.autoStart.desc")).addToggle(
      (tEl) => tEl.setValue(this.plugin.settings.autoStart).onChange(async (v) => {
        var _a, _b;
        this.plugin.settings.autoStart = v;
        await this.plugin.saveSettings();
        (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.detached.title")).setDesc(t("settings.detached.desc")).addToggle(
      (tEl) => tEl.setValue(this.plugin.settings.detached).onChange(async (v) => {
        var _a, _b;
        this.plugin.settings.detached = v;
        await this.plugin.saveSettings();
        (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.readyTimeout.title")).setDesc(t("settings.readyTimeout.desc", { s: this.plugin.settings.readyTimeoutSec })).addSlider(
      (s) => s.setLimits(60, 600, 30).setValue(this.plugin.settings.readyTimeoutSec).onChange((v) => {
        this.plugin.settings.readyTimeoutSec = v;
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.command.title")).setDesc(startupCommandHint()).addText(
      (tEl) => tEl.setValue(this.plugin.settings.startupCommand).onChange((v) => {
        const cmd = v.trim();
        const bad = nonWebProfileInCommand(cmd);
        if (bad !== null) {
          new import_obsidian5.Notice(t("settings.command.nonWeb", { p: bad, port: String(this.plugin.settings.port) }), 14e3);
          tEl.setValue(this.plugin.settings.startupCommand);
          return;
        }
        this.plugin.settings.startupCommand = cmd;
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.cwd.title")).setDesc(t("settings.cwd.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.startupCwd).onChange((v) => {
        this.plugin.settings.startupCwd = v.trim();
        this.scheduleSave(() => {
          var _a, _b;
          void this.plugin.saveSettings();
          (_b = (_a = this.plugin).reconfigureService) == null ? void 0 : _b.call(_a);
        });
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.profile")).setHeading();
    new import_obsidian5.Setting(containerEl).setName(t("settings.profile.pick")).setDesc(t("settings.profile.pickDesc")).addDropdown((d) => {
      const current2 = this.plugin.settings.profile;
      const names = this.plugin.listDshProfiles();
      if (!names.includes(current2)) names.unshift(current2);
      for (const name of names) d.addOption(name, name === "web" ? `web\uFF08${t("settings.profile.default")}\uFF09` : name);
      d.setValue(current2).onChange((v) => {
        void this.plugin.requestProfileChange(v);
      });
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.profile.newName")).setDesc(t("settings.profile.newNameDesc")).addText((tEl) => {
      tEl.setPlaceholder(t("settings.profile.newNamePlaceholder"));
      tEl.onChange((v) => {
        this.profileDraft = v.trim().toLowerCase();
      });
    }).addButton(
      (b) => b.setButtonText(t("settings.profile.create")).onClick(() => {
        var _a;
        void this.plugin.requestProfileChange((_a = this.profileDraft) != null ? _a : "");
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.update")).setHeading();
    new import_obsidian5.Setting(containerEl).setName(t("settings.updateChannel.title")).setDesc(t("settings.updateChannel.desc")).addDropdown((d) => {
      d.addOption("stable", t("settings.updateChannel.stable"));
      d.addOption("preview", t("settings.updateChannel.preview"));
      d.addOption("dev", t("settings.updateChannel.dev"));
      d.setValue(this.plugin.settings.updateChannel).onChange(async (v) => {
        this.plugin.settings.updateChannel = v === "stable" || v === "dev" ? v : "preview";
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.autoCheck.title")).setDesc(t("settings.autoCheck.desc")).addToggle(
      (tEl) => tEl.setValue(this.plugin.settings.autoCheckUpdates).onChange(async (v) => {
        this.plugin.settings.autoCheckUpdates = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.autoCheckInterval.title")).setDesc(t("settings.autoCheckInterval.desc", { h: String(this.plugin.settings.autoCheckIntervalHours) })).addSlider((s) => {
      showSliderValueBubble(s.setLimits(1, 168, 1).setValue(this.plugin.settings.autoCheckIntervalHours));
      return s.onChange(async (v) => {
        this.plugin.settings.autoCheckIntervalHours = Math.max(MIN_AUTO_CHECK_HOURS, Math.round(v));
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian5.Setting(containerEl).setName(t("settings.updateMirror.title")).setDesc(t("settings.updateMirror.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.updateMirrorUrl).onChange((v) => {
        this.plugin.settings.updateMirrorUrl = v.trim();
        this.scheduleSave(() => void this.plugin.saveSettings());
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.installUrl.title")).setDesc(t("settings.installUrl.desc")).addText(
      (tEl) => tEl.setValue(this.plugin.settings.installUrl).onChange((v) => {
        this.plugin.settings.installUrl = v.trim() || DEFAULT_DSH_REPO_URL;
        this.scheduleSave(() => void this.plugin.saveSettings());
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.section.compat")).setHeading();
    const compatLine = new import_obsidian5.Setting(containerEl).setName(t("settings.compat.state.title")).setDesc(t("settings.compat.state.reading"));
    const paintCompatState = () => {
      compatLine.setDesc(t("settings.compat.state.reading"));
      void this.plugin.getCompatSnapshot().then((s) => {
        var _a;
        if (s === null) {
          compatLine.setDesc(t("compat.verdict.unknown"));
          return;
        }
        const base = t(`compat.verdict.${(_a = s.issue) != null ? _a : "ok"}`, { v: s.version });
        const seam = seamLineFor(s.seamScan);
        compatLine.setDesc(seam === "" ? base : `${base} \xB7 ${seam}`);
      });
    };
    compatLine.addButton(
      (b) => b.setButtonText(t("settings.compat.recheck")).onClick(() => {
        paintCompatState();
      })
    );
    paintCompatState();
    new import_obsidian5.Setting(containerEl).setName(t("settings.diag.title")).setHeading();
    this.connRowSetting = new import_obsidian5.Setting(containerEl).setName(t("settings.conn.title")).setDesc(endpointLabel(endpointFromSettings(this.plugin.settings))).addButton(
      (b) => b.setButtonText(t("settings.conn.test")).onClick(async () => {
        b.setDisabled(true);
        b.setButtonText(t("settings.conn.testing"));
        const addr = endpointLabel(endpointFromSettings(this.plugin.settings));
        const result = await this.plugin.testServiceConnection();
        new import_obsidian5.Notice(connectionTestMessage(result, addr), 14e3);
        b.setDisabled(false);
        b.setButtonText(t("settings.conn.test"));
      })
    );
    new import_obsidian5.Setting(containerEl).setName(t("settings.diag.startup.title")).setDesc(t("settings.diag.startup.desc")).addButton(
      (b) => b.setButtonText(t("settings.diag.refresh")).onClick(() => {
        renderDiag();
      })
    );
    const diagEl = containerEl.createDiv({ cls: "dsh-diag-log" });
    const renderDiag = () => {
      const records = this.plugin.getStartupRecords();
      diagEl.empty();
      if (records.length === 0) {
        diagEl.setText(t("settings.diag.empty"));
        return;
      }
      const lines = [];
      for (const rec of records.slice(-5).reverse()) {
        const when = new Date(rec.ts).toLocaleTimeString();
        const phases = Object.entries(rec.phases).map(([k, v]) => `${k}: ${v}ms`).join(" \xB7 ");
        lines.push(`${when} ${rec.ok ? "\u2713" : "\u2717"} ${phases}${rec.error ? " \u2014 " + rec.error : ""}`);
      }
      diagEl.setText(lines.join("\n"));
    };
    renderDiag();
  }
};

// src/view.ts
var import_obsidian6 = require("obsidian");

// src/diag.ts
var import_node_fs11 = require("node:fs");
var import_node_os7 = require("node:os");
var import_node_path9 = require("node:path");
var EVENTS_FILE = "dsh-panel-diag.log";
var HEART_FILE = "dsh-panel-heart.log";
var MAX_BYTES = 64 * 1024;
function diagDirCandidates(vaultBase, configDir, pluginId, manifestDir) {
  const out = [];
  if (vaultBase !== void 0 && vaultBase !== "") {
    const sep2 = vaultBase.includes("\\") ? "\\" : "/";
    out.push([vaultBase.replace(/[\\/]+$/, ""), configDir, "plugins", pluginId].join(sep2));
  }
  if (manifestDir !== void 0 && manifestDir !== "") out.push(manifestDir);
  out.push((0, import_node_path9.join)((0, import_node_os7.tmpdir)(), "dsh-harness-diag"));
  return out;
}
function appendLine(dirs, file, line) {
  const text = `${(/* @__PURE__ */ new Date()).toISOString()} ${line}
`;
  for (const dir of dirs) {
    try {
      const path = (0, import_node_path9.join)(dir, file);
      if ((0, import_node_fs11.existsSync)(path) && (0, import_node_fs11.statSync)(path).size > MAX_BYTES) (0, import_node_fs11.writeFileSync)(path, "");
      (0, import_node_fs11.appendFileSync)(path, text, "utf8");
      return;
    } catch (e) {
    }
  }
}
function diagLog(dirs, line) {
  appendLine(dirs, EVENTS_FILE, line);
}
function diagBeat(dirs, line) {
  appendLine(dirs, HEART_FILE, line);
}

// src/view.ts
var DSH_VIEW_TYPE = "dsh-harness-view";
var MONITOR_INTERVAL_MS = 4e3;
var READY_BUDGET_MS = 12e4;
var EMBED_WAIT_MS = 6e4;
var UI_RECOVERY_MS = 12e4;
var REPAINT_NUDGE_DELAYS = [2500, 4500, 7e3, 1e4];
async function copyText(text, successNotice) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      new import_obsidian6.Notice(successNotice != null ? successNotice : t("view.copy.copied"));
      return;
    }
  } catch (e) {
  }
  try {
    const requireFn = window.require;
    const electron = requireFn ? requireFn("electron") : void 0;
    if (electron == null ? void 0 : electron.clipboard) {
      electron.clipboard.writeText(text);
      new import_obsidian6.Notice(successNotice != null ? successNotice : t("view.copy.copied"));
      return;
    }
  } catch (e) {
  }
  new import_obsidian6.Notice(t("view.copy.failed"));
}
function humanize(message) {
  if (message.includes("\u672A\u627E\u5230 DSH \u4ED3\u5E93") || message.includes("DSH repo not found")) {
    return t("hz.notFound");
  }
  if (message.includes("\u65E0\u6CD5\u8FDE\u63A5 GitHub") || message.includes("Cannot reach GitHub")) {
    return t("hz.github");
  }
  if (message.includes("\u8FDB\u7A0B\u5DF2\u9000\u51FA") || message.includes("Process exited")) {
    return t("hz.exited");
  }
  if (message.includes("\u8D85\u65F6") || message.includes("Timed out")) {
    return t("hz.timeout");
  }
  if (message.includes("\u5DF2\u5173\u95ED\u81EA\u52A8\u542F\u52A8") || message.includes("auto-start is off")) {
    return t("hz.noAuto");
  }
  return message;
}
var DshView = class extends import_obsidian6.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    /** 运行期探活定时器：DSH 服务崩溃后自动切到错误视图（显示原因 + 重连）。 */
    this.monitorTimer = null;
    /** 当前渲染的 iframe（供插件发送 postMessage / 校验消息来源）。 */
    this.frame = null;
    /** 可见性监听回调：系统睡眠/失焦恢复后强制重渲染 iframe。 */
    this.onVisibilityChange = null;
    /** v2.3.1 冷启动守卫：就绪检查定时器与重试计数（每次 refresh 归零）。 */
    this.readyTimers = [];
    this.autoReloads = 0;
    /** 当前 iframe 使用的嵌入地址（v2.4.0）：用于检测 token 换新并立即重载。 */
    this.frameUrl = "";
    /** 冷启动等待的时间预算截止（v2.4.0）：按时间而非次数判定，0.1.5 冷启动可能 >60s。 */
    this.readyDeadline = 0;
    /** v2.4.0 冷启动等待横幅（代替白屏；就绪/超时后移除）。 */
    this.waitCard = null;
    /** v2.4.3：整视图重渲染兜底次数（每次打开视图重置），防止守卫与 refresh 互相触发。 */
    this.fullRefreshes = 0;
    /** v2.8.4：`refresh()` 是否正在跑（异步链路的互斥标记，杜绝同一轮里连刷两次）。 */
    this.refreshing = false;
    /** v2.8.4：互斥期间被拒绝的 refresh 请求——跑完这一轮后补一次，不丢事件。 */
    this.refreshQueued = false;
    /** v2.4.4：注入脚本上报"界面空白"的起始时间（0 = 当前不空白）。 */
    this.uiBlankSince = 0;
    /** v2.4.4：白屏自动恢复截止时间（超过则不再自动重刷，避免长期抖动）。 */
    this.uiRecoveryDeadline = 0;
    /** v2.4.4：是否收到过注入脚本的"界面状态"上报（没有 ⇒ 服务里跑的是旧脚本，需重启服务）。 */
    this.uiStateSeen = false;
    /** v2.3.1 认证拦截引导卡（已持有 token 仍起不来 = 典型 0.1.2+ 面板不可用态时覆盖显示）。 */
    this.blockedCard = null;
  }
  /** 当前 iframe 元素（可能未渲染完成）。 */
  getFrame() {
    return this.frame;
  }
  getViewType() {
    return DSH_VIEW_TYPE;
  }
  getDisplayText() {
    return "DeepSeek Harness";
  }
  getIcon() {
    return "dsh-logo";
  }
  async onOpen() {
    this.fullRefreshes = 0;
    this.uiBlankSince = 0;
    this.uiStateSeen = false;
    this.addAction("refresh-cw", t("view.action.reconnect"), () => void this.refresh());
    this.addAction("external-link", t("view.action.openBrowser"), () => this.plugin.openDshInBrowser());
    this.onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (this.frame === null) {
        void this.refresh();
        return;
      }
      this.nudgeRepaint(this.frame);
    };
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    await this.refresh();
  }
  // 新版 obsidian.d.ts（1.13.1）中 View.onClose 为 Promise<void>，须保持返回类型兼容
  onClose() {
    this.stopMonitor();
    if (this.onVisibilityChange !== null) {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.onVisibilityChange = null;
    }
    return Promise.resolve();
  }
  /** 停止运行期探活定时器与冷启动就绪检查。 */
  stopMonitor() {
    if (this.monitorTimer !== null) {
      window.clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
    for (const id of this.readyTimers) window.clearTimeout(id);
    this.readyTimers = [];
  }
  /**
   * v2.3.1 冷启动守卫：TCP 监听 ≠ 页面就绪（dsh 源码冷启动 20–60s），iframe 可能在服务
   * 半就绪时加载成空白。桥接握手（tapIndex 注入随 index 页一起到达）超时未就绪 → 自动重载。
   *
   * v2.4.0 加固（修「重启服务后必白屏、要手动刷新一次」）：
   * ① 认证链接（token）一变就立即用新链接重载并重置预算——冷启动时先加载的是裸地址（0.1.2+ 必 401 白屏），
   *    服务打印 token 后必须换到带 token 的嵌入地址；
   * ② 预算从"次数"（6s×5≈30s）改为**时间**（2 分钟）+ 退避：0.1.5 装了大量插件时冷启动常超过 30s，
   *    次数预算会提前放弃、只能手动刷新；
   * ③ 等待期盖一条顶部横幅（而不是让用户对着 401 白屏）；只有"已持有 token 仍起不来"（真正的认证拦截）
   *    或超时后才盖认证引导卡。
   */
  scheduleReadyCheck(delayMs) {
    const id = window.setTimeout(() => {
      this.readyTimers = this.readyTimers.filter((t2) => t2 !== id);
      if (!this.frame) return;
      if (this.plugin.getBridgeStatus().ready) {
        this.removeBlockedHint();
        this.removeWaitBanner();
        return;
      }
      const freshUrl = this.plugin.dshEmbedFrameUrl();
      if (freshUrl !== this.frameUrl) {
        this.frameUrl = freshUrl;
        this.autoReloads = 0;
        this.readyDeadline = Date.now() + READY_BUDGET_MS;
        this.frame.src = `${freshUrl}#r${String(Date.now())}`;
        this.scheduleReadyCheck(3e3);
        return;
      }
      if (Date.now() > this.readyDeadline) {
        this.removeWaitBanner();
        void this.renderBlockedHint();
        return;
      }
      this.renderWaitBanner();
      this.autoReloads += 1;
      if (this.autoReloads % 3 === 0) {
        this.frame.src = `${freshUrl}#r${String(Date.now())}`;
      }
      const backoff = Math.min(3e3 + this.autoReloads * 1500, 12e3);
      this.scheduleReadyCheck(backoff);
    }, delayMs);
    this.readyTimers.push(id);
  }
  /** 冷启动等待层（全覆盖，挡住 401/空白；就绪后移除）。 */
  renderWaitBanner() {
    if (this.waitCard !== null || !this.contentEl.isConnected) return;
    const card = this.contentEl.createDiv({ cls: "dsh-wait-card" });
    card.createEl("h3", { text: t("view.wait.title") });
    card.createEl("p", { text: t("view.wait.desc") });
    const retry = card.createEl("button", { text: t("view.blocked.retry") });
    retry.addEventListener("click", () => {
      this.removeWaitBanner();
      void this.refresh();
    });
    this.waitCard = card;
  }
  removeWaitBanner() {
    if (this.waitCard === null) return;
    this.waitCard.remove();
    this.waitCard = null;
  }
  /**
   * 容器尺寸由 0 变为可用后重载一次 iframe（v2.4.0）。
   * 场景：视图刚打开/叶子尚未显示时文档已加载完成，但 0 尺寸下不会绘制 →
   * 表现为「DSH 加载完成后白屏，手动刷新一次才显示」。最多等 15s，仅在尺寸就绪的瞬间重载一次。
   */
  reloadWhenSized(frame) {
    const deadline = Date.now() + 15e3;
    const tick = () => {
      if (this.frame !== frame) return;
      if (this.contentEl.clientWidth >= 2 && this.contentEl.clientHeight >= 2) {
        this.frameUrl = this.plugin.dshEmbedFrameUrl();
        frame.src = `${this.frameUrl}#r${String(Date.now())}`;
        this.autoReloads = 0;
        this.readyDeadline = Date.now() + READY_BUDGET_MS;
        this.scheduleReadyCheck(3e3);
        return;
      }
      if (Date.now() > deadline) return;
      window.setTimeout(tick, 300);
    };
    window.setTimeout(tick, 300);
  }
  /**
   * 跨域 iframe 重绘轻推（v2.4.0）：Electron 里嵌 cross-origin iframe 偶发"已加载但不绘制"，
   * 做一次 1px 级尺寸变化即可强制合成器重排（比整页重载温和，不会丢已就绪的面板状态）。
   * 用 CSS 类切换而非直接写 `style`（官方审核规则 obsidianmd/no-static-styles-assignment）。
   */
  nudgeRepaint(frame) {
    try {
      frame.addClass("dsh-frame-nudge");
      window.setTimeout(() => {
        frame.removeClass("dsh-frame-nudge");
      }, 60);
    } catch (e) {
    }
  }
  /** 移除认证拦截引导卡。 */
  removeBlockedHint() {
    if (this.blockedCard === null) return;
    this.blockedCard.remove();
    this.blockedCard = null;
  }
  /**
   * v2.3.1：认证拦截引导卡——0.1.2+ 的 Strict cookie 令内嵌面板无法登录（插件端无解，已实测），
   * 与其让用户对着 401 文本发懵，盖一张引导卡：一键「在浏览器打开 DSH」（自动携带认证链接）。
   *
   * v2.9.5：追加「回退到适配版本 DSH」——DSH 升到插件尚未跟上的版本时（如 0.2.2 把 index 鉴权改走
   * Fetch API 导致内嵌 401），用户可在这一页一键装回本插件**已实测适配**的版本，不必自己去终端 `npm i -g`。
   * 目标是 `compat.fallbackTargetFor()` 算出的已测版本：高于上界→上界；已在区间内→严格更低的最高已测版本
   * （真正的回退）。这是用户主动发起的操作，确认后执行（环境类判定本身仍然不弹窗）。
   */
  async renderBlockedHint() {
    if (this.blockedCard !== null || !this.contentEl.isConnected) return;
    const card = this.contentEl.createDiv({ cls: "dsh-blocked-card" });
    card.createEl("h3", { text: t("view.blocked.title") });
    card.createEl("p", { text: t("view.blocked.desc") });
    const range = adaptedRangeLabel();
    let current2 = "";
    try {
      current2 = (await this.plugin.getDshVersionInfo()).version;
    } catch (e) {
    }
    const target = fallbackTargetFor(current2);
    if (this.blockedCard !== null || !this.contentEl.isConnected) {
      card.remove();
      return;
    }
    card.createEl("p", {
      cls: "dsh-detail",
      text: t("view.blocked.fallbackHint", { cur: current2 === "" ? t("up.unknown") : current2, v: target, range })
    });
    const actions = card.createDiv({ cls: "dsh-blocked-actions" });
    const browser = actions.createEl("button", { cls: "mod-cta", text: t("view.blocked.openBrowser") });
    browser.addEventListener("click", () => this.plugin.openDshInBrowser());
    const fallback = actions.createEl("button", { text: t("view.blocked.fallback", { v: target }) });
    fallback.addEventListener("click", () => void this.plugin.fallbackToAdaptedDsh());
    const retry = actions.createEl("button", { text: t("view.blocked.retry") });
    retry.addEventListener("click", () => {
      this.removeBlockedHint();
      void this.refresh();
    });
    this.blockedCard = card;
  }
  /**
   * 启动运行期探活：面板在线时周期性 TCP 探测。
   * 服务中途崩溃/断开 → 切到「睡着了」视图；定时器保持运行，
   * 服务恢复在线后自动重渲染 iframe（无需手动点「唤醒干活」）。
   */
  startMonitor() {
    this.stopMonitor();
    this.monitorTimer = window.setInterval(() => {
      void this.plugin.service.probe().then((online) => {
        if (online) {
          if (this.frame === null) void this.refresh();
          return;
        }
        if (this.frame !== null) {
          this.renderAsleep(t("view.monitor.disconnected", { msg: this.plugin.service.describeOffline() }));
        }
      });
    }, MONITOR_INTERVAL_MS);
  }
  async refresh() {
    if (this.refreshing) {
      this.refreshQueued = true;
      return;
    }
    this.refreshing = true;
    try {
      await this.doRefresh();
    } finally {
      this.refreshing = false;
      if (this.refreshQueued) {
        this.refreshQueued = false;
        void this.refresh();
      }
    }
  }
  /** refresh 的实际流程（只由带并发守卫的 `refresh()` 调用）。 */
  async doRefresh() {
    this.stopMonitor();
    this.autoReloads = 0;
    this.frame = null;
    this.contentEl.empty();
    this.renderLoading();
    const state = await this.plugin.service.ensureOnline();
    if (state.kind === "online") {
      const probe = await this.plugin.service.panelNeedsAuth();
      if (probe !== "open") {
        await this.waitEmbedReady();
      }
      if (!this.plugin.dshEmbedFrameUrl().includes("token=")) {
        const again = await this.plugin.service.panelNeedsAuth();
        if (again === "auth") {
          diagLog(this.diagDirs(), "skip render: needs token but launch URL has none");
          this.renderWaitBanner();
          return;
        }
      }
      await this.waitForSize();
      this.renderFrame();
      return;
    }
    if (!this.plugin.isDshInstalled()) {
      this.renderInstallPrompt();
      return;
    }
    this.renderAsleep(state.kind === "failed" ? state.message : "");
    this.startMonitor();
  }
  /**
   * 等待可嵌入条件（v2.4.0）：0.1.2+ 必须等启动 token 打印出来（冷启动 20–60s）。
   * 期间界面停留在插件的 loading 态；超时后照常渲染（由冷启动守卫继续兜底）。
   */
  async waitEmbedReady() {
    const deadline = Date.now() + EMBED_WAIT_MS;
    while (Date.now() < deadline) {
      if (!this.contentEl.isConnected) return;
      if (this.plugin.dshEmbedFrameUrl().includes("token=")) {
        await new Promise((resolve2) => window.setTimeout(resolve2, 1500));
        return;
      }
      await new Promise((resolve2) => window.setTimeout(resolve2, 800));
    }
  }
  /**
   * 等待容器具备非 0 尺寸（v2.4.4）：真机日志显示首帧曾以 `size=0x0` 创建 iframe，
   * SPA 在 0 视口里启动后即便 DOM 有内容也不绘制（白屏、手动刷新才好）。最多等 5s，超时照常渲染。
   */
  async waitForSize() {
    const deadline = Date.now() + 5e3;
    while (Date.now() < deadline) {
      if (!this.contentEl.isConnected) return;
      if (this.contentEl.clientWidth >= 2 && this.contentEl.clientHeight >= 2) return;
      await new Promise((resolve2) => window.setTimeout(resolve2, 150));
    }
  }
  renderLoading() {
    this.contentEl.addClass("dsh-view");
    const box = this.contentEl.createDiv({ cls: "dsh-status" });
    box.createDiv({ cls: "dsh-spinner" });
    box.createEl("p", { text: t("view.loading.title") });
    box.createEl("p", { cls: "dsh-detail", text: t("view.loading.detail") });
  }
  renderFrame() {
    this.contentEl.empty();
    this.blockedCard = null;
    this.waitCard = null;
    this.contentEl.addClass("dsh-view");
    const zoom = this.plugin.settings.zoom;
    const bottomPadPx = this.plugin.settings.bottomPadPx;
    const wrapper = this.contentEl.createDiv({ cls: "dsh-zoom" });
    wrapper.style.width = `calc(100% / ${zoom})`;
    wrapper.style.height = `calc(100% / ${zoom} - ${bottomPadPx / zoom}px)`;
    wrapper.style.transform = `scale(${zoom})`;
    const frame = wrapper.createEl("iframe", { cls: "dsh-frame" });
    this.frameUrl = this.plugin.dshEmbedFrameUrl();
    frame.src = this.frameUrl;
    diagLog(
      this.diagDirs(),
      `renderFrame endpoint=${this.plugin.dshEndpointLabel()} token=\u2026${this.frameUrl.slice(-8)} ob=${String(this.frameUrl.includes("ob=1"))} size=${String(this.contentEl.clientWidth)}x${String(this.contentEl.clientHeight)} fullRefreshes=${String(this.fullRefreshes)}`
    );
    frame.setAttribute("allow", "clipboard-read; clipboard-write");
    this.frame = frame;
    const zeroSized = this.contentEl.clientWidth < 2 || this.contentEl.clientHeight < 2;
    let nudged = false;
    frame.addEventListener("load", () => {
      if (nudged) return;
      nudged = true;
      window.setTimeout(() => {
        if (this.frame !== frame || this.plugin.getBridgeStatus().ready) return;
        this.nudgeRepaint(frame);
      }, 400);
    });
    if (zeroSized) this.reloadWhenSized(frame);
    this.startMonitor();
    this.autoReloads = 0;
    this.readyDeadline = Date.now() + READY_BUDGET_MS;
    this.scheduleReadyCheck(6e3);
    this.uiBlankSince = 0;
    this.uiRecoveryDeadline = Date.now() + UI_RECOVERY_MS;
    for (const delay3 of REPAINT_NUDGE_DELAYS) {
      window.setTimeout(() => {
        if (this.frame !== frame) return;
        this.nudgeRepaint(frame);
      }, delay3);
    }
    window.setTimeout(() => {
      if (this.frame !== frame || this.uiStateSeen) return;
      if (!this.plugin.getBridgeStatus().ready) return;
      new import_obsidian6.Notice(t("notice.bridgeScriptStale"), 12e3);
    }, 1e4);
  }
  /**
   * v2.4.4：注入脚本上报的界面正文长度 → 判定"白屏"并自动整视图重渲染。
   * 为什么用功能探测而非定时：用户实测白屏在打开面板后 4–5s 出现（DSH 自己的重连界面转白），
   * 而修好它的操作（设置里「重连」= `refreshView()` → `view.refresh()`）与定时刷新同路径，
   * 差别只在"刷的时机"——定时容易扑空，探测则只在真的空白时刷，并可在窗口内一直重试。
   * 判定：连续 ≥3s 正文长度 <20 视为白屏；窗口 `UI_RECOVERY_MS` 内最多重刷 4 次。
   */
  notifyUiState(len, api) {
    this.uiStateSeen = true;
    diagBeat(
      this.diagDirs(),
      `ui-state len=${String(len)} api=${String(api)} blankMs=${this.uiBlankSince === 0 ? "0" : String(Date.now() - this.uiBlankSince)} fullRefreshes=${String(this.fullRefreshes)}`
    );
    if (!this.contentEl.isConnected) return;
    if (Date.now() > this.uiRecoveryDeadline) return;
    if (len >= 20) {
      this.uiBlankSince = 0;
      return;
    }
    if (this.uiBlankSince === 0) {
      this.uiBlankSince = Date.now();
      return;
    }
    if (Date.now() - this.uiBlankSince < 3e3) return;
    if (this.fullRefreshes >= 4) return;
    this.uiBlankSince = 0;
    this.fullRefreshes += 1;
    diagLog(this.diagDirs(), `auto-recovery refresh #${String(this.fullRefreshes)} (blank \u22653s)`);
    void this.refresh();
  }
  /** 诊断日志候选目录（vault 推算 → manifest.dir → 临时目录）。 */
  diagDirs() {
    const adapter = this.app.vault.adapter;
    return diagDirCandidates(adapter.basePath, this.app.vault.configDir, this.plugin.manifest.id, this.plugin.manifest.dir);
  }
  /** 未安装 DSH 时的一键安装引导（含依赖检测与一键安装）。 */
  renderInstallPrompt() {
    this.contentEl.empty();
    this.contentEl.addClass("dsh-view");
    const box = this.contentEl.createDiv({ cls: "dsh-status" });
    box.createEl("h3", { text: t("view.install.title") });
    box.createEl("p", { text: t("view.install.desc") });
    const deps = checkDeps();
    const depBox = box.createDiv({ cls: "dsh-dep" });
    const mark = (ok) => ok ? t("view.install.mark.ok") : t("view.install.mark.missing");
    depBox.createEl("p", { text: `git\uFF1A${mark(deps.git)}` });
    depBox.createEl("p", { text: `Node.js\uFF1A${mark(deps.node)}` });
    depBox.createEl("p", { text: `pnpm\uFF1A${mark(deps.pnpm)}` });
    const btn = box.createEl("button", { cls: "dsh-cta", text: t("view.install.btn") });
    btn.addEventListener("click", () => void this.installAndRefresh(btn));
    if (!deps.git || !deps.node || !deps.pnpm) {
      box.createEl("p", { cls: "dsh-detail", text: t("view.install.depsHint") });
      const miss = box.createDiv({ cls: "dsh-actions" });
      if (!deps.git) {
        const b = miss.createEl("button", { text: t("view.install.git") });
        b.addEventListener("click", () => void this.installDep("git", b));
      }
      if (!deps.node) {
        const b = miss.createEl("button", { text: t("view.install.node") });
        b.addEventListener("click", () => void this.installDep("node", b));
      }
      if (!deps.pnpm) {
        const b = miss.createEl("button", { text: t("view.install.pnpm") });
        b.addEventListener("click", () => void this.installDep("pnpm", b));
      }
    }
  }
  /** 一键安装缺失依赖并刷新依赖状态。 */
  async installDep(dep, btn) {
    var _a;
    btn.setAttribute("disabled", "");
    const orig = (_a = btn.textContent) != null ? _a : "";
    btn.textContent = t("view.install.installing");
    const r = await installDependency(dep);
    btn.removeAttribute("disabled");
    btn.textContent = orig;
    if (r.ok) {
      new import_obsidian6.Notice(t("view.install.done"), 8e3);
      this.renderInstallPrompt();
    } else {
      new import_obsidian6.Notice(r.message, 1e4);
    }
  }
  /** DSH 睡着了（等待重连）界面：插件名 + 状态说明 + 小提示 + 四按钮（唤醒干活 / AED / 问问AI / 更多设置）。 */
  renderAsleep(message) {
    this.contentEl.empty();
    this.contentEl.addClass("dsh-view");
    this.contentEl.removeClass("dsh-lang-zh");
    this.contentEl.removeClass("dsh-lang-en");
    this.contentEl.addClass("dsh-lang-" + getLocale());
    this.frame = null;
    const box = this.contentEl.createDiv({ cls: "dsh-status" });
    const main = box.createDiv({ cls: "dsh-asleep-main" });
    main.createDiv({ cls: "dsh-asleep-dot" });
    main.createEl("h2", { cls: "dsh-asleep-name", text: t("view.asleep.name") });
    main.createEl("p", { cls: "dsh-asleep-status", text: t("view.asleep.status") });
    const primary = main.createDiv({ cls: "dsh-actions dsh-asleep-primary" });
    const wake = primary.createEl("button", { cls: "dsh-cta", text: t("view.asleep.wake") });
    wake.addEventListener("click", () => void this.refresh());
    const secondary = main.createDiv({ cls: "dsh-actions dsh-asleep-secondary" });
    const aed = secondary.createEl("button", { text: t("view.asleep.aed") });
    aed.addEventListener("click", () => void this.runAed(buttonBox));
    const askAi = secondary.createEl("button", { text: t("view.asleep.askAi") });
    askAi.addEventListener("click", () => void this.askAiAboutError(message, ""));
    const more = secondary.createEl("button", { text: t("view.asleep.more") });
    more.addEventListener("click", () => {
      const settingApi = this.app.setting;
      settingApi.open();
      settingApi.openTabById("dsh-harness");
    });
    const buttonBox = main.createDiv({ cls: "dsh-asleep-aedbox" });
    box.createEl("p", { cls: "dsh-detail dsh-asleep-hint", text: t("view.asleep.hint") });
  }
  /** AED for DSH：确认后执行抢救流水线，显示进度。 */
  runAed(container) {
    container.empty();
    const box = container.createDiv({ cls: "dsh-asleep-aed" });
    for (const line of t("view.asleep.aedConfirm").split("\n")) {
      box.createEl("p", { cls: "dsh-detail", text: line });
    }
    const actions = box.createDiv({ cls: "dsh-actions" });
    const cancel = actions.createEl("button", { text: t("view.asleep.aedCancel") });
    cancel.addEventListener("click", () => box.remove());
    const confirm = actions.createEl("button", { cls: "dsh-cta", text: t("view.asleep.aedConfirmBtn") });
    confirm.addEventListener("click", () => {
      box.empty();
      const progress = box.createDiv({ cls: "dsh-progress" });
      const bar = progress.createDiv({ cls: "dsh-progress-bar" });
      const progressText = progress.createDiv({ cls: "dsh-progress-text" });
      const setProgress = (step, percent) => {
        progress.show();
        bar.style.width = `${Math.max(0, Math.min(100, percent != null ? percent : 0))}%`;
        progressText.textContent = step;
      };
      progress.hide();
      setProgress(t("aed.running"), 0);
      const home = this.plugin.aedHomeDir();
      void this.plugin.runAedRecovery(home, setProgress).then((result) => {
        progressText.textContent = result.message;
        if (result.ok) {
          new import_obsidian6.Notice(result.message, 8e3);
        } else {
          new import_obsidian6.Notice(result.message, 12e3);
        }
      });
    });
  }
  async askAiAboutError(message, cmdText) {
    const diag = t("diag.header") + "\n" + t("diag.error") + (message || humanize(message)) + "\n" + t("diag.hint") + humanize(message) + "\n" + t("diag.endpoint") + this.plugin.dshEndpointLabel() + "\n" + t("diag.cwd") + (this.plugin.settings.startupCwd || "\u2014") + "\n" + t("diag.command") + (cmdText.trim() !== "" ? cmdText : "\u2014");
    await copyText(diag, t("notice.askAiCopied"));
    this.plugin.openInBrowser("https://chat.deepseek.com/");
  }
  /** 一键安装：先询问安装路径（用户意向），确认后执行并刷新视图；进度经 InstallProgressModal 弹窗展示。 */
  installAndRefresh(btn) {
    btn.setAttribute("disabled", "");
    btn.textContent = t("view.install.preparing");
    const modal = new InstallProgressModal(this.app);
    modal.open();
    const report = (step, percent) => {
      modal.update(percent != null ? percent : 0, step);
    };
    void this.plugin.installWithPathPrompt(report).then((ok) => {
      btn.removeAttribute("disabled");
      if (ok) {
        modal.done();
        window.setTimeout(() => modal.close(), 1500);
        btn.textContent = t("view.install.starting");
        void this.refresh();
      } else {
        modal.fail();
        btn.textContent = t("view.install.btn");
      }
    });
  }
};

// src/aed.ts
var import_node_child_process5 = require("node:child_process");
var import_node_fs12 = require("node:fs");
var import_node_module = require("node:module");
var import_node_path10 = require("node:path");
var CORE_BUNDLES = /* @__PURE__ */ new Set(["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "@deepseek-ai/dsh-client-modules"]);
var BUNDLE_DISABLE_MARKER = "# dsh-harness: disabled bundle entry ";
var NPM_MIRROR = "https://registry.npmmirror.com";
function run3(exec, command, args, timeoutMs, env) {
  const resolved = resolveExec(process.platform, command, args);
  return new Promise((resolve2) => {
    exec(resolved.command, resolved.args, { timeout: timeoutMs, windowsHide: true, ...env ? { env } : {} }, (err, stdout, stderr) => {
      if (err) {
        resolve2({ ok: false, out: String(stdout != null ? stdout : "").trim(), err: String(stderr != null ? stderr : "").trim() });
      } else {
        resolve2({ ok: true, out: String(stdout != null ? stdout : "").trim(), err: "" });
      }
    });
  });
}
function fixTargetArgs(home) {
  const args = [];
  if (home !== "") args.push("--home", home, "--profile", activeProfile);
  return args;
}
function fixTargetEnv(home) {
  const env = { ...refreshedEnv() };
  if (home !== "") env.DSH_HOME = home;
  return env;
}
function hasBin2(name) {
  return hasBin(name);
}
function isDshFixInstalled() {
  return hasBin2("dsh-fix");
}
var activeProfile = "web";
function setAedProfile(profile) {
  const p = (profile != null ? profile : "").trim();
  activeProfile = p === "" ? "web" : p;
}
function profileDir(home) {
  return (0, import_node_path10.join)(home, "profiles", activeProfile);
}
function bundleUserPlugins(home) {
  var _a, _b;
  try {
    const pkgPath = (0, import_node_path10.join)(profileDir(home), "package.json");
    if (!(0, import_node_fs12.existsSync)(pkgPath)) return [];
    const pkg = JSON.parse((0, import_node_fs12.readFileSync)(pkgPath, "utf8"));
    const bundles = (_b = (_a = pkg.dsh) == null ? void 0 : _a.profile) == null ? void 0 : _b.bundles;
    if (!Array.isArray(bundles)) return [];
    return bundles.filter((b) => typeof b === "string" && !CORE_BUNDLES.has(b));
  } catch (e) {
    return [];
  }
}
function appendBundleDisableBlocks(home, plugins, extraAnchors = []) {
  const dir = profileDir(home);
  const patchPath = (0, import_node_path10.join)(dir, "cordis.patch.yml");
  if (!(0, import_node_fs12.existsSync)(patchPath) || plugins.length === 0) return;
  const existing = (0, import_node_fs12.readFileSync)(patchPath, "utf8");
  const targets = plugins.flatMap((pkg) => bundleDisableIds(home, pkg, extraAnchors).map((id) => ({ pkg, id })));
  const missing = targets.filter(({ id }) => !existing.includes(BUNDLE_DISABLE_MARKER + JSON.stringify(id)));
  if (missing.length === 0) return;
  (0, import_node_fs12.copyFileSync)(patchPath, (0, import_node_path10.join)(dir, `cordis.patch.yml.bak-harness-${Date.now()}`));
  const stamp = (/* @__PURE__ */ new Date()).toISOString();
  const blocks = missing.map(({ pkg, id }) => `${BUNDLE_DISABLE_MARKER}${JSON.stringify(id)} (${pkg}) at ${stamp}
- id: ${JSON.stringify(id)}
  disabled: true`).join("\n");
  (0, import_node_fs12.writeFileSync)(patchPath, existing.trimEnd() + "\n\n" + blocks + "\n", "utf8");
}
function removeBundleDisableBlocks(home) {
  const patchPath = (0, import_node_path10.join)(profileDir(home), "cordis.patch.yml");
  if (!(0, import_node_fs12.existsSync)(patchPath)) return;
  const lines = (0, import_node_fs12.readFileSync)(patchPath, "utf8").split("\n");
  const kept = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith(BUNDLE_DISABLE_MARKER)) {
      i += 3;
      continue;
    }
    kept.push(lines[i]);
    i++;
  }
  const out = kept.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  (0, import_node_fs12.writeFileSync)(patchPath, out, "utf8");
}
var STRIP_SIDE_CAR = ".dsh-harness-safe-strip.json";
var cachedInstallAnchors;
function dshInstallAnchors() {
  if (cachedInstallAnchors) return cachedInstallAnchors;
  const roots = [];
  try {
    const resolved = resolveExec(process.platform, "npm", ["root", "-g"]);
    const out = (0, import_node_child_process5.execFileSync)(resolved.command, resolved.args, {
      encoding: "utf8",
      timeout: 1e4,
      windowsHide: true,
      env: refreshedEnv()
    }).trim();
    if (out !== "") roots.push(out);
  } catch (e) {
  }
  const appdata = process.env.APPDATA;
  if (appdata) roots.push((0, import_node_path10.join)(appdata, "npm"));
  const npmPrefix = process.env.NPM_CONFIG_PREFIX;
  if (npmPrefix) roots.push(npmPrefix);
  const direct = [
    ...roots.map((root) => (0, import_node_path10.join)(root, "node_modules", "@deepseek-ai", "dsh", "package.json")),
    ...globalDshManifestCandidates(),
    // POSIX 常见 prefix（含 brew）
    ...nvmGlobalModuleRoots().map((root) => (0, import_node_path10.join)(root, "@deepseek-ai", "dsh", "package.json"))
  ];
  cachedInstallAnchors = direct.filter((p, i, all) => all.indexOf(p) === i && (0, import_node_fs12.existsSync)(p));
  return cachedInstallAnchors;
}
function loadYaml(anchors) {
  for (const anchor of anchors) {
    try {
      return (0, import_node_module.createRequire)(anchor)("js-yaml");
    } catch (e) {
    }
  }
  return null;
}
function entryListSchema(yaml) {
  const JsExpr = new yaml.Type("tag:yaml.org,2002:js", {
    kind: "scalar",
    resolve: () => true,
    construct: (data) => ({ __jsExpr: data })
  });
  return yaml.JSON_SCHEMA.extend(JsExpr);
}
function resolveBundleDirFrom(home, pkg, extraAnchors) {
  const anchors = [...extraAnchors, ...dshInstallAnchors()];
  const profilePkg = (0, import_node_path10.join)(profileDir(home), "package.json");
  if ((0, import_node_fs12.existsSync)(profilePkg)) anchors.push(profilePkg);
  for (const anchor of anchors) {
    try {
      const resolved = (0, import_node_module.createRequire)(anchor).resolve(`${pkg}/package.json`);
      return (0, import_node_path10.join)(resolved, "..");
    } catch (e) {
    }
  }
  return null;
}
function probeBundleHealthy(home, pkg, extraAnchors = []) {
  var _a, _b, _c, _d, _e;
  const bundleDir = resolveBundleDirFrom(home, pkg, extraAnchors);
  if (bundleDir === null) return { ok: false, reason: "missing" };
  let manifest;
  try {
    manifest = JSON.parse((0, import_node_fs12.readFileSync)((0, import_node_path10.join)(bundleDir, "package.json"), "utf8"));
  } catch (e) {
    return { ok: false, reason: "no-bundle-manifest" };
  }
  const patchRel = (_b = (_a = manifest.dsh) == null ? void 0 : _a.bundle) == null ? void 0 : _b.patch;
  if (typeof patchRel !== "string") return { ok: false, reason: "no-bundle-manifest" };
  const patchPath = (0, import_node_path10.join)(bundleDir, patchRel);
  const anchors = [...extraAnchors, ...dshInstallAnchors()];
  const profilePkg = (0, import_node_path10.join)(profileDir(home), "package.json");
  if ((0, import_node_fs12.existsSync)(profilePkg)) anchors.push(profilePkg);
  const yaml = loadYaml(anchors);
  if (yaml) {
    try {
      const parsed = yaml.load(
        (0, import_node_fs12.readFileSync)(patchPath, "utf8"),
        { schema: entryListSchema(yaml) }
      );
      if (!Array.isArray(parsed)) return { ok: false, reason: "patch-parse" };
    } catch (e) {
      return { ok: false, reason: "patch-parse" };
    }
  } else {
    try {
      const text = (0, import_node_fs12.readFileSync)(patchPath, "utf8");
      const first = (_c = text.replace(/^\s*(#.*\n?)*/u, "").trimStart()[0]) != null ? _c : "";
      if (text.trim() === "" || first !== "[" && first !== "-") return { ok: false, reason: "patch-parse" };
      const pairs = [[/\[/g, /\]/g], [/\{/g, /\}/g]];
      for (const [openRe, closeRe] of pairs) {
        if (((_d = text.match(openRe)) != null ? _d : []).length !== ((_e = text.match(closeRe)) != null ? _e : []).length) return { ok: false, reason: "patch-parse" };
      }
    } catch (e) {
      return { ok: false, reason: "patch-parse" };
    }
  }
  return { ok: true };
}
function bundleDisableIds(home, pkg, extraAnchors = []) {
  var _a, _b;
  const bundleDir = resolveBundleDirFrom(home, pkg, extraAnchors);
  if (bundleDir === null) return [pkg];
  try {
    const manifest = JSON.parse((0, import_node_fs12.readFileSync)((0, import_node_path10.join)(bundleDir, "package.json"), "utf8"));
    const patchRel = (_b = (_a = manifest.dsh) == null ? void 0 : _a.bundle) == null ? void 0 : _b.patch;
    if (typeof patchRel !== "string") return [pkg];
    const anchors = [...extraAnchors, ...dshInstallAnchors()];
    const profilePkg = (0, import_node_path10.join)(profileDir(home), "package.json");
    if ((0, import_node_fs12.existsSync)(profilePkg)) anchors.push(profilePkg);
    const yaml = loadYaml(anchors);
    if (!yaml) return [pkg];
    const rows = yaml.load(
      (0, import_node_fs12.readFileSync)((0, import_node_path10.join)(bundleDir, patchRel), "utf8"),
      { schema: entryListSchema(yaml) }
    );
    if (!Array.isArray(rows)) return [pkg];
    const ids = rows.filter((r) => typeof r === "object" && r !== null && !Array.isArray(r)).map((r) => r.id).filter((id) => typeof id === "string");
    return ids.length > 0 ? ids : [pkg];
  } catch (e) {
    return [pkg];
  }
}
function stripUnhealthyBundles(home, extraAnchors = []) {
  var _a, _b, _c, _d, _e;
  const dir = profileDir(home);
  const pkgPath = (0, import_node_path10.join)(dir, "package.json");
  if (!(0, import_node_fs12.existsSync)(pkgPath)) return { stripped: [] };
  const bundles = bundleUserPlugins(home);
  if (bundles.length === 0) return { stripped: [] };
  const unhealthy = bundles.filter((pkg2) => !probeBundleHealthy(home, pkg2, extraAnchors).ok);
  if (unhealthy.length === 0) return { stripped: [] };
  const pkg = JSON.parse((0, import_node_fs12.readFileSync)(pkgPath, "utf8"));
  const list = Array.isArray((_b = (_a = pkg.dsh) == null ? void 0 : _a.profile) == null ? void 0 : _b.bundles) ? pkg.dsh.profile.bundles : [];
  const kept = list.filter((b) => !unhealthy.includes(b));
  if (kept.length === list.length) return { stripped: [] };
  const backupPath = (0, import_node_path10.join)(dir, `package.json.bak-harness-safe-${Date.now()}`);
  (0, import_node_fs12.copyFileSync)(pkgPath, backupPath);
  let prev = [];
  const sidePath = (0, import_node_path10.join)(dir, STRIP_SIDE_CAR);
  try {
    if ((0, import_node_fs12.existsSync)(sidePath)) {
      const s = JSON.parse((0, import_node_fs12.readFileSync)(sidePath, "utf8"));
      if (Array.isArray(s.stripped)) prev = s.stripped.filter((x) => typeof x === "string");
    }
  } catch (e) {
  }
  const merged = [.../* @__PURE__ */ new Set([...prev, ...unhealthy])];
  const next = { ...pkg, dsh: { ...(_c = pkg.dsh) != null ? _c : {}, profile: { ...(_e = (_d = pkg.dsh) == null ? void 0 : _d.profile) != null ? _e : {}, bundles: kept } } };
  (0, import_node_fs12.writeFileSync)(pkgPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  (0, import_node_fs12.writeFileSync)(
    sidePath,
    JSON.stringify({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), stripped: merged, backup: backupPath }, null, 2) + "\n",
    "utf8"
  );
  return { stripped: unhealthy, backupPath };
}
function restoreStrippedBundles(home) {
  var _a, _b, _c, _d, _e;
  const dir = profileDir(home);
  const sidePath = (0, import_node_path10.join)(dir, STRIP_SIDE_CAR);
  if (!(0, import_node_fs12.existsSync)(sidePath)) return { restored: [] };
  try {
    const s = JSON.parse((0, import_node_fs12.readFileSync)(sidePath, "utf8"));
    const stripped = Array.isArray(s.stripped) ? s.stripped.filter((x) => typeof x === "string") : [];
    if (stripped.length > 0) {
      const pkgPath = (0, import_node_path10.join)(dir, "package.json");
      if ((0, import_node_fs12.existsSync)(pkgPath)) {
        const pkg = JSON.parse((0, import_node_fs12.readFileSync)(pkgPath, "utf8"));
        const list = Array.isArray((_b = (_a = pkg.dsh) == null ? void 0 : _a.profile) == null ? void 0 : _b.bundles) ? pkg.dsh.profile.bundles : [];
        const merged = [.../* @__PURE__ */ new Set([...list, ...stripped])];
        const next = { ...pkg, dsh: { ...(_c = pkg.dsh) != null ? _c : {}, profile: { ...(_e = (_d = pkg.dsh) == null ? void 0 : _d.profile) != null ? _e : {}, bundles: merged } } };
        (0, import_node_fs12.writeFileSync)(pkgPath, JSON.stringify(next, null, 2) + "\n", "utf8");
      }
    }
    (0, import_node_fs12.unlinkSync)(sidePath);
    return { restored: stripped };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
async function installDshFix(exec = import_node_child_process5.execFile, onStep) {
  const step = onStep != null ? onStep : () => void 0;
  step(t("aed.installFix"), 10);
  const env = refreshedEnv();
  let r = await run3(exec, "npm", ["install", "-g", "dsh-fix@latest", "--no-fund", "--no-audit"], 12e4, env);
  if (!r.ok) {
    step(t("aed.installFixMirror"), 30);
    r = await run3(exec, "npm", ["install", "-g", "dsh-fix@latest", "--registry", NPM_MIRROR, "--no-fund", "--no-audit"], 12e4, env);
  }
  if (!r.ok) {
    return { ok: false, message: t("aed.installFixFail", { err: r.err || t("err.unknown") }) };
  }
  return { ok: true, message: t("aed.installFixDone") };
}
async function runAedSafe(home, exec = import_node_child_process5.execFile, onStep) {
  const step = onStep != null ? onStep : () => void 0;
  const target = fixTargetArgs(home);
  const targetEnv = fixTargetEnv(home);
  let useNpx = false;
  step(t("aed.checkFix"), 5);
  const inst = await installDshFix(exec, step);
  if (!inst.ok) {
    useNpx = true;
    step(t("aed.fallbackNpx"), 8);
  }
  step(t("aed.doctor"), 40);
  const doctor = useNpx ? await run3(exec, "npx", ["--yes", "dsh-fix", "doctor", ...target], 12e4, targetEnv) : await run3(exec, "dsh-fix", ["doctor", ...target], 6e4, targetEnv);
  step(t("aed.stripBundles"), 55);
  let stripNote = "";
  try {
    const stripRes = stripUnhealthyBundles(home);
    if (stripRes.stripped.length > 0) {
      stripNote = t("aed.stripNote", { list: stripRes.stripped.join("\u3001") });
    }
  } catch (err) {
    stripNote = t("aed.stripFail", { err: err instanceof Error ? err.message : String(err) });
  }
  step(t("aed.safeMode"), 70);
  const safe = useNpx ? await run3(exec, "npx", ["--yes", "dsh-fix", "safe", ...target], 12e4, targetEnv) : await run3(exec, "dsh-fix", ["safe", ...target], 6e4, targetEnv);
  if (!safe.ok) {
    let restoreNote = "";
    try {
      const restored = restoreStrippedBundles(home);
      if ("error" in restored) restoreNote = t("aed.stripRestoreFail", { err: restored.error });
    } catch (err) {
      restoreNote = t("aed.stripRestoreFail", { err: err instanceof Error ? err.message : String(err) });
    }
    return { ok: false, message: t("aed.safeFail", { err: safe.err || t("err.unknown") }) + restoreNote };
  }
  const bundles = bundleUserPlugins(home);
  if (bundles.length > 0) {
    step(t("aed.disableBundles"), 85);
    try {
      appendBundleDisableBlocks(home, bundles);
    } catch (err) {
      return { ok: false, message: t("aed.disableBundlesFail", { err: err instanceof Error ? err.message : String(err) }) };
    }
  }
  const doctorLine = doctor.ok && doctor.out ? doctor.out.split("\n").slice(0, 3).join(" ") : "";
  const bundleNote = bundles.length > 0 ? t("aed.safeBundles", { list: bundles.join("\u3001") }) : "";
  return {
    ok: true,
    message: t("aed.safeDone", { diag: doctorLine || t("aed.doctorNoDetail") }) + bundleNote + stripNote
  };
}
async function exitSafeMode(home, exec = import_node_child_process5.execFile, onStep) {
  const step = onStep != null ? onStep : () => void 0;
  const target = fixTargetArgs(home);
  const targetEnv = fixTargetEnv(home);
  let useNpx = false;
  if (!isDshFixInstalled()) {
    step(t("aed.checkFix"), 10);
    const inst = await installDshFix(exec, step);
    if (!inst.ok) {
      useNpx = true;
      step(t("aed.fallbackNpx"), 15);
    }
  }
  step(t("aed.exitSafeMode"), 60);
  const clear = useNpx ? await run3(exec, "npx", ["--yes", "dsh-fix", "clear", ...target], 12e4, targetEnv) : await run3(exec, "dsh-fix", ["clear", ...target], 6e4, targetEnv);
  if (!clear.ok) {
    return { ok: false, message: t("aed.exitSafeFail", { err: clear.err || t("err.unknown") }) };
  }
  try {
    removeBundleDisableBlocks(home);
  } catch (err) {
    return { ok: false, message: t("aed.exitBundleFail", { err: err instanceof Error ? err.message : String(err) }) };
  }
  let restoreNote = "";
  try {
    const restored = restoreStrippedBundles(home);
    if ("restored" in restored && restored.restored.length > 0) {
      restoreNote = t("aed.stripRestored", { list: restored.restored.join("\u3001") });
    } else if ("error" in restored) {
      restoreNote = t("aed.stripRestoreFail", { err: restored.error });
    }
  } catch (err) {
    restoreNote = t("aed.stripRestoreFail", { err: err instanceof Error ? err.message : String(err) });
  }
  return { ok: true, message: t("aed.exitSafeDone") + restoreNote };
}
var BOOT_MARKERS = ["__DSH_BOOT__", "dsh-client-modules/client.js"];
var AUTO_FIXABLE_KINDS = /* @__PURE__ */ new Set([
  "client-modules",
  "bundle-face",
  "patch-parse"
]);
function classifyBootFailure(text, detail = "") {
  const hay = `${text}
${detail}`;
  if (/did not export the bootstrap module face/i.test(hay)) return "bundle-face";
  if (/authentication required|reopen the url printed/i.test(hay)) return "auth";
  if (/client-modules|bootstrap module|__DSH_BOOT__|preload|failed to fetch dynamically imported module/i.test(hay)) return "client-modules";
  if (/cordis\.patch|patch parse|failed to parse patch|parse error/i.test(hay)) return "patch-parse";
  if (/cannot find module|MODULE_NOT_FOUND|is NOT installed|unable to load plugin/i.test(hay)) return "plugin-missing";
  if (/error during startup|initialization|init crash|failed to (start|initialize)|uncaught exception/i.test(hay)) return "init-crash";
  return "other";
}
async function verifyDshBootAsync(endpoint, token = "", exec = import_node_child_process5.execFile, timeoutMs = 8e3) {
  var _a;
  const base = endpointOrigin(endpoint);
  const tlsArgs = endpoint.scheme !== "https" ? [] : endpoint.caCertPath !== void 0 && endpoint.caCertPath !== "" ? ["--cacert", endpoint.caCertPath] : ["-k"];
  const pageUrl = token === "" ? `${base}/` : `${base}/?token=${encodeURIComponent(token)}&ob=1`;
  const page = await run3(exec, "curl", ["-L", "-sS", "--max-time", String(Math.max(3, Math.floor(timeoutMs / 1e3))), ...tlsArgs, pageUrl], timeoutMs + 3e3);
  if (!page.ok) {
    return { ok: false, kind: "unreachable", detail: page.err || page.out || "" };
  }
  const html = page.out;
  const missing = BOOT_MARKERS.filter((m) => !html.includes(m));
  if (missing.length > 0) {
    const kind = classifyBootFailure(html, "");
    return { ok: false, kind: kind === "other" ? "client-modules" : kind, detail: `missing: ${missing.join(", ")}` };
  }
  const srcMatch = [...html.matchAll(/src="([^"]*client\.js[^"]*)"/g)].map((m) => m[1]);
  const rawSrc = (_a = srcMatch.find((s) => s.includes("client-modules"))) != null ? _a : srcMatch[0];
  if (!rawSrc) {
    return { ok: false, kind: "client-modules", detail: "HTML \u542B __DSH_BOOT__ \u4F46\u672A\u627E\u5230 client.js \u9884\u52A0\u8F7D" };
  }
  const clientSrc = rawSrc.replace(/&amp;/g, "&");
  const assetUrl = clientSrc.startsWith("http") ? clientSrc : `${base}${clientSrc.startsWith("/") ? "" : "/"}${clientSrc}`;
  const asset = await run3(exec, "curl", ["-L", "-sS", "--max-time", "6", ...tlsArgs, assetUrl], 9e3);
  if (!asset.ok) {
    return { ok: false, kind: "bundle-face", detail: `client.js \u83B7\u53D6\u5931\u8D25\uFF1A${asset.err || asset.out || ""}` };
  }
  if (!asset.out.includes("createClientModuleSystem")) {
    return { ok: false, kind: "bundle-face", detail: "client.js \u7F3A\u5C11 bootstrap face \u5BFC\u51FA\uFF08createClientModuleSystem\uFF09\uFF0C\u7591\u4F3C\u672A\u6784\u5EFA/\u9648\u65E7\u4EA7\u7269" };
  }
  return { ok: true };
}
async function aedRecovery(home, exec = import_node_child_process5.execFile, onStep) {
  const step = onStep != null ? onStep : () => void 0;
  const safeRes = await runAedSafe(home, exec, step);
  if (!safeRes.ok) {
    return safeRes;
  }
  step(t("aed.done"), 100);
  return { ok: true, message: safeRes.message };
}

// src/cleanup.ts
var import_node_child_process6 = require("node:child_process");
var import_promises = require("node:fs/promises");
var import_node_fs13 = require("node:fs");
var import_node_path11 = require("node:path");
var CLEANUP_KEEP_ITEMS = ["sessions", "attachments", "skills", ".credentials.yaml", "settings.yaml"];
var CLEANUP_WIPE_DIRS = ["profiles", "plugins", "storages", "cache", "logs", "doctor", "llm-deepseek"];
var CLEANUP_MANIFEST = "manifest.json";
function run4(exec, command, args, timeoutMs) {
  const resolved = resolveExec(process.platform, command, args);
  return new Promise((resolvePromise) => {
    exec(resolved.command, resolved.args, { timeout: timeoutMs, windowsHide: true, env: refreshedEnv() }, (err, stdout, stderr) => {
      if (err) {
        resolvePromise({ ok: false, out: String(stdout != null ? stdout : "").trim(), err: String(stderr != null ? stderr : "").trim() });
      } else {
        resolvePromise({ ok: true, out: String(stdout != null ? stdout : "").trim(), err: "" });
      }
    });
  });
}
function hasBin3(name) {
  return hasBin(name);
}
function defaultCleanupBackupDir(home) {
  return (0, import_node_path11.join)((0, import_node_path11.dirname)(home), `${(0, import_node_path11.basename)(home)}-backup-${backupTimestamp()}`);
}
function formatBytes(n) {
  if (n >= 1024 * 1024 * 1024) return (n / 1024 / 1024 / 1024).toFixed(1) + " GB";
  if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
  if (n >= 1024) return (n / 1024).toFixed(1) + " KB";
  return `${String(n)} B`;
}
function backupTimestamp(now = /* @__PURE__ */ new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}
function countSessionLogs(home) {
  const root = (0, import_node_path11.join)(home, "sessions");
  let count = 0;
  const walk = (dir) => {
    let entries;
    try {
      entries = (0, import_node_fs13.readdirSync)(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const entry of entries) {
      const p = (0, import_node_path11.join)(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name === "session.jsonl.zstd" || /^session\.jsonl(\.zstd)?$/.test(entry.name)) count += 1;
    }
  };
  walk(root);
  return count;
}
async function backupSessionsDir(home, backupRoot) {
  const src = (0, import_node_path11.join)(home, "sessions");
  if (!(0, import_node_fs13.existsSync)(src)) return null;
  const dir = (0, import_node_path11.join)(backupRoot, `sessions-${backupTimestamp()}`);
  await (0, import_promises.mkdir)(dir, { recursive: true });
  await (0, import_promises.cp)(src, dir, { recursive: true });
  const { files, bytes } = await countFiles(dir);
  return { dir, files, bytes };
}
async function countFiles(dir) {
  let files = 0;
  let bytes = 0;
  const walk = async (d) => {
    const entries = await (0, import_promises.readdir)(d, { withFileTypes: true });
    for (const entry of entries) {
      const p = (0, import_node_path11.join)(d, entry.name);
      if (entry.isDirectory()) {
        await walk(p);
      } else {
        files += 1;
        try {
          bytes += (await (0, import_promises.stat)(p)).size;
        } catch (e) {
        }
      }
    }
  };
  await walk(dir);
  return { files, bytes };
}
async function backupDshData(home, backupDir) {
  await (0, import_promises.mkdir)(backupDir, { recursive: true });
  const items = [];
  let totalFiles = 0;
  let totalBytes = 0;
  for (const name of CLEANUP_KEEP_ITEMS) {
    const src = (0, import_node_path11.join)(home, name);
    if (!(0, import_node_fs13.existsSync)(src)) continue;
    const isDir = (await (0, import_promises.stat)(src)).isDirectory();
    if (isDir) {
      await (0, import_promises.cp)(src, (0, import_node_path11.join)(backupDir, name), { recursive: true });
      const counted = await countFiles(src);
      items.push({ name, kind: "dir", files: counted.files, bytes: counted.bytes });
      totalFiles += counted.files;
      totalBytes += counted.bytes;
    } else {
      await (0, import_promises.copyFile)(src, (0, import_node_path11.join)(backupDir, name));
      const size = (await (0, import_promises.stat)(src)).size;
      items.push({ name, kind: "file", files: 1, bytes: size });
      totalFiles += 1;
      totalBytes += size;
    }
  }
  const manifest = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    dshHome: home,
    items,
    totalFiles,
    totalBytes
  };
  await (0, import_promises.writeFile)((0, import_node_path11.join)(backupDir, CLEANUP_MANIFEST), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return { backupDir, totalFiles, totalBytes, items };
}
async function wipeDshRuntime(home) {
  const removed = [];
  const homeResolved = (0, import_node_path11.resolve)(home);
  for (const name of CLEANUP_WIPE_DIRS) {
    const target = (0, import_node_path11.resolve)((0, import_node_path11.join)(homeResolved, name));
    if (!target.startsWith(homeResolved + import_node_path11.sep)) continue;
    if ((0, import_node_fs13.existsSync)(target)) {
      await (0, import_promises.rm)(target, { recursive: true, force: true });
      removed.push(name);
    }
  }
  return removed;
}
async function uninstallGlobalCli(exec = import_node_child_process6.execFile, hasBinFn = hasBin3) {
  if (!hasBinFn("dsh")) return t("cleanup.cliSkipped");
  const r = await run4(exec, "npm", ["uninstall", "-g", "@deepseek-ai/dsh", "--no-fund", "--no-audit"], 12e4);
  return r.ok ? t("cleanup.cliDone") : t("cleanup.cliFail", { err: r.err || t("err.unknown") });
}
async function restoreDshData(backupDir, home) {
  const restored = [];
  for (const name of CLEANUP_KEEP_ITEMS) {
    const src = (0, import_node_path11.join)(backupDir, name);
    const dst = (0, import_node_path11.join)(home, name);
    if (!(0, import_node_fs13.existsSync)(src) || (0, import_node_fs13.existsSync)(dst)) continue;
    if ((await (0, import_promises.stat)(src)).isDirectory()) {
      await (0, import_promises.cp)(src, dst, { recursive: true });
      restored.push({ name, kind: "dir" });
    } else {
      await (0, import_promises.copyFile)(src, dst);
      restored.push({ name, kind: "file" });
    }
  }
  return { restored };
}

// src/cleanup-modal.ts
var import_obsidian7 = require("obsidian");
var CleanReinstallModal = class extends import_obsidian7.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
    this.confirmed = false;
    this.deleteRepo = false;
    this.confirmBtn = null;
    this.backupDir = opts.defaultBackupDir;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("dsh-cleanup-modal");
    contentEl.createEl("h3", { text: t("cleanup.modal.title") });
    contentEl.createEl("p", { text: t("cleanup.modal.warn"), cls: "dsh-cleanup-warn" });
    contentEl.createEl("p", { text: t("cleanup.modal.keep") });
    contentEl.createEl("p", { text: t("cleanup.modal.suggest") });
    new import_obsidian7.Setting(contentEl).setName(t("cleanup.modal.backupDir")).addText(
      (txt) => txt.setValue(this.backupDir).onChange((v) => {
        this.backupDir = v.trim() || this.opts.defaultBackupDir;
      })
    );
    if (this.opts.repoDir) {
      new import_obsidian7.Setting(contentEl).setName(t("cleanup.modal.deleteRepo", { dir: this.opts.repoDir })).addToggle(
        (tg) => tg.setValue(false).onChange((v) => {
          this.deleteRepo = v;
        })
      );
    }
    new import_obsidian7.Setting(contentEl).setName(t("cleanup.modal.confirmCheck")).addToggle(
      (tg) => tg.setValue(false).onChange((v) => {
        var _a;
        this.confirmed = v;
        (_a = this.confirmBtn) == null ? void 0 : _a.setDisabled(!v);
      })
    );
    const s = new import_obsidian7.Setting(contentEl);
    s.addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close()));
    s.addButton((b) => {
      this.confirmBtn = markDestructive(b).setButtonText(t("cleanup.modal.confirm")).setDisabled(true).onClick(() => {
        this.close();
        this.opts.onConfirm(this.backupDir, this.deleteRepo);
      });
      return this.confirmBtn;
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/session-repair-modal.ts
var import_obsidian8 = require("obsidian");
var import_node_path13 = require("node:path");

// src/session-repair.ts
var import_node_child_process7 = require("node:child_process");
var import_node_fs14 = require("node:fs");
var import_node_path12 = require("node:path");
var import_node_os8 = require("node:os");
function dshPackageDirCandidates() {
  const out = [];
  try {
    const resolved = resolveExec(process.platform, "npm", ["root", "-g"]);
    const root = (0, import_node_child_process7.execFileSync)(resolved.command, resolved.args, {
      encoding: "utf8",
      timeout: 1e4,
      windowsHide: true,
      env: refreshedEnv()
    }).trim();
    if (root !== "") out.push((0, import_node_path12.join)(root, "@deepseek-ai", "dsh"));
  } catch (e) {
  }
  for (const manifest of globalDshManifestCandidates()) out.push((0, import_node_path12.dirname)(manifest));
  for (const root of nvmGlobalModuleRoots()) out.push((0, import_node_path12.join)(root, "@deepseek-ai", "dsh"));
  const appdata = process.env.APPDATA;
  if (appdata) out.push((0, import_node_path12.join)(appdata, "npm", "node_modules", "@deepseek-ai", "dsh"));
  const prefix = process.env.NPM_CONFIG_PREFIX;
  if (prefix) out.push((0, import_node_path12.join)(prefix, "node_modules", "@deepseek-ai", "dsh"));
  return [...new Set(out)];
}
function nodeCandidates() {
  const out = [];
  try {
    const resolved = resolveExec(process.platform, "node", []);
    out.push(resolved.command === "cmd.exe" ? "node" : resolved.command);
  } catch (e) {
    out.push("node");
  }
  if (process.platform !== "win32") {
    for (const dir of posixPathExtras()) out.push((0, import_node_path12.join)(dir, "node"));
  }
  const pf = process.env["ProgramFiles"];
  if (pf) out.push((0, import_node_path12.join)(pf, "nodejs", "node.exe"));
  const pf86 = process.env["ProgramFiles(x86)"];
  if (pf86) out.push((0, import_node_path12.join)(pf86, "nodejs", "node.exe"));
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) out.push((0, import_node_path12.join)(localAppData, "Programs", "nodejs", "node.exe"));
  return [...new Set(out)];
}
function probeZstdNode(nodePath) {
  try {
    const out = (0, import_node_child_process7.execFileSync)(nodePath, ["-e", "process.stdout.write(process.version+' '+typeof require('node:zlib').zstdDecompressSync)"], {
      encoding: "utf8",
      timeout: 1e4,
      windowsHide: true,
      // v2.8.11：合并 PATH —— 候选里的裸 `node` 与 nvm/brew 的 node 都靠它解析
      env: refreshedEnv()
    }).trim();
    const [version, kind] = out.split(" ");
    return kind === "function" ? version : null;
  } catch (e) {
    return null;
  }
}
function resolveSessionRepairRuntime() {
  let nodePath = "";
  let version = "";
  for (const candidate of nodeCandidates()) {
    const v = probeZstdNode(candidate);
    if (v !== null) {
      nodePath = candidate;
      version = v;
      break;
    }
  }
  if (nodePath === "") return { ok: false, error: t("repair.noZstdNode") };
  const pkgDir = dshPackageDirCandidates().find((dir) => (0, import_node_fs14.existsSync)((0, import_node_path12.join)(dir, "package.json")));
  if (pkgDir === void 0) return { ok: false, error: t("repair.noDshInstall") };
  return { ok: true, runtime: { nodePath, cwd: pkgDir, version } };
}
var SESSION_FILE_V3 = "session.v3.jsonl.zstd";
var SESSION_FILE_V0 = "session.jsonl.zstd";
var SESSION_FILE_V4 = "session.v4.jsonl.zstd";
function findSessionFiles(home) {
  var _a, _b;
  const root = (0, import_node_path12.join)(home, "sessions");
  const byDir = /* @__PURE__ */ new Map();
  const walk = (dir) => {
    var _a2;
    let entries;
    try {
      entries = (0, import_node_fs14.readdirSync)(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const entry of entries) {
      const p = (0, import_node_path12.join)(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
        continue;
      }
      if (entry.name === SESSION_FILE_V4 || entry.name === SESSION_FILE_V3 || entry.name === SESSION_FILE_V0) {
        const rec = (_a2 = byDir.get(dir)) != null ? _a2 : {};
        if (entry.name === SESSION_FILE_V4) rec.v4 = p;
        else if (entry.name === SESSION_FILE_V3) rec.v3 = p;
        else rec.v0 = p;
        byDir.set(dir, rec);
      }
    }
  };
  walk(root);
  const out = [];
  for (const rec of byDir.values()) {
    const picked = (_b = (_a = rec.v4) != null ? _a : rec.v3) != null ? _b : rec.v0;
    if (picked !== void 0) out.push(picked);
  }
  return out;
}
function buildSessionRepairDriverSource() {
  return `import { readFileSync, writeFileSync, renameSync, copyFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { zstdCompressSync, zstdDecompressSync } from 'node:zlib'

// \u5165\u53C2\u6765\u81EA argv[1] \u6307\u5411\u7684 JSON \u6587\u4EF6\uFF0C**\u4E0D\u662F\u547D\u4EE4\u884C\u672C\u8EAB**\uFF1A\u4F1A\u8BDD\u4E00\u591A\uFF0C\u547D\u4EE4\u884C\u4F1A\u8D85 Windows
// CreateProcess \u7684 32,767 \u5B57\u7B26\u4E0A\u9650\uFF08\u771F\u673A 203 \u4E2A\u4F1A\u8BDD = 37,897 \u5B57\u7B26 \u21D2 spawn ENAMETOOLONG\uFF09\u3002
const arg = JSON.parse(readFileSync(process.argv[1], 'utf8'))
const { mode, sessionsRoot, backupDir } = arg
const ALLOWED = new Set(['instructions', 'catalog', 'snapshot', 'notice', 'relay', 'recall'])
const MAGIC = 0xfd2fb528
// dsh-session \u7684 assertMessageEventShape\uFF1A\u8FD9\u51E0\u7C7B\u4E8B\u4EF6\u7684\u6D88\u606F\u5FC5\u987B"\u5DF2\u8BC6\u522B"\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32 id\uFF09+ role \u5339\u914D\u3002
// \u89D2\u8272\u8868**\u6309\u683C\u5F0F\u7248\u672C\u5206\u6863**\uFF08\u5B98\u65B9 MESSAGE_ROLE_BY_TYPE\uFF0Cdsh-session/lib/index.js:1143-1149\uFF0C0.1.7-rc.2 \u9010\u5B57\u6838\u5BF9\uFF09\uFF1A
//   v3 \u53CA\u66F4\u65E9\uFF1Atool/result \u7684\u6D88\u606F role \u662F 'user'\uFF0C\u6CA1\u6709 developer/message\uFF1B
//   v4\uFF1Atool/result \u6539\u6210 'tool'\uFF0C\u5E76\u65B0\u589E developer/message \u2192 'developer'\u3002
// \u771F\u673A\u53D6\u8BC1\uFF08\u672C\u673A ~/.dsh\uFF09\uFF1Av3 \u4F1A\u8BDD tool/result role=user \xD75421\uFF1Bv4 \u4F1A\u8BDD role=tool \xD762\u3002
// \u7528\u4E00\u5F20\u8868\u91CF\u4E24\u4EE3\u4F1A\u628A v4 \u4F1A\u8BDD\u6574\u6279\u8BEF\u5224\u4E3A\u4E0D\u53EF\u8BFB\uFF080.1.7-rc.2 \u5B9E\u6D4B 13 \u4E2A\u5047 broken\uFF09\u3002
// user/message \u7684 data \u672C\u8EAB\u5C31\u662F\u6D88\u606F\uFF1B\u5176\u4F59\u7C7B\u522B\u7684\u6D88\u606F\u5728 data.message / \u6570\u7EC4\u69FD\u4F4D\u4E0B\u3002
const MSG_ROLE_V3 = { 'system/message': 'system', 'user/message': 'user', 'assistant/message': 'assistant', 'tool/result': 'user' }
const MSG_ROLE_V4 = { 'system/message': 'system', 'developer/message': 'developer', 'user/message': 'user', 'assistant/message': 'assistant', 'tool/result': 'tool' }

function msgRoleTable(version) {
  return version >= 4 ? MSG_ROLE_V4 : MSG_ROLE_V3
}

/**
 * v4 \u7684\u58F0\u660E\u5F0F\u6D88\u606F\u69FD\u4F4D\u904D\u5386\uFF0C\u9010\u4E00\u5BF9\u9F50 dsh-session-format-v3-to-v4 \u7684 mapEventMessages()\uFF1A
 * user/message \u7684\u6D88\u606F\u5C31\u662F data\uFF1Bdeveloper/system/assistant/message \u4E0E tool/result \u5728 data.message\uFF1B
 * agent/inbox/spliced \u5728 data.inserted[]\uFF0Csession/title-llm-request \u5728 data.messages[]\u3002
 * \u5B98\u65B9 v4 \u6821\u9A8C assertV4MessageSources \u6B63\u662F\u6CBF\u8FD9\u6761\u8DEF\u5F84\u9010\u4E2A source \u8FC7\u95F8\u2014\u2014\u300C\u8FDE\u8FD8\u8EBA\u5728 inbox \u91CC\u3001
 * \u6CA1\u843D\u6210\u4E8B\u4EF6\u7684\u6CE8\u5165\u4E5F\u4F1A\u88AB\u62E6\u300D\uFF0C\u6240\u4EE5\u4FEE\u590D\u5FC5\u987B\u8D70\u540C\u4E00\u7EC4\u69FD\u4F4D\uFF0C\u53EA\u770B data.source \u4F1A\u6F0F\u6389\u5927\u534A\u3002
 */
const MSG_SLOT = { 'user/message': null, 'developer/message': 'message', 'system/message': 'message', 'assistant/message': 'message', 'tool/result': 'message' }
const MSG_ARRAY_SLOT = { 'agent/inbox/spliced': 'inserted', 'session/title-llm-request': 'messages' }

function isObj(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function eachMessage(obj, fn) {
  const d = obj.data
  if (!isObj(d)) return 0
  const t = obj.type
  if (Object.prototype.hasOwnProperty.call(MSG_SLOT, t)) {
    const slot = MSG_SLOT[t]
    if (slot === null) return fn(d)
    const m = d[slot]
    return isObj(m) ? fn(m) : 0
  }
  const key = Object.prototype.hasOwnProperty.call(MSG_ARRAY_SLOT, t) ? MSG_ARRAY_SLOT[t] : undefined
  if (key === undefined) return 0
  const arr = d[key]
  if (!Array.isArray(arr)) return 0
  let n = 0
  for (const m of arr) { if (isObj(m)) n += fn(m) }
  return n
}

/**
 * \u2464 v4 \u8D77 kind:'plugin' \u662F\u9000\u5F79\u5F62\u6001\uFF0Cv4 codec \u76F4\u63A5\u786C\u62D2
 * \uFF08format v4 message requires a producer-owned source kind\uFF09\u3002\u4E0B\u9762\u7684\u6620\u5C04\u8868\u9010\u5B57\u590D\u523B
 * @deepseek-ai/dsh-session-format-v3-to-v4/lib/index.js L50-93\uFF080.1.7-rc.2 \u5B9E\u6D4B\uFF09\uFF0C
 * \u8868\u5916\u4E00\u5F8B\u9000\u5316\u4E3A 'plugin:<\u63D2\u4EF6\u540D>'\u2014\u2014\u4E0E\u5B98\u65B9 default \u5206\u652F\u4E00\u81F4\uFF0C\u4E5F\u4E0E\u672C\u63D2\u4EF6\u6865\u63A5\u81EA v2.7.1
 * \u8D77\u53D1\u9001\u7684\u5F62\u6001\u540C\u6E90\uFF08src/bridge.ts \u7684 BRIDGE_SOURCE_KIND = plugin:dsh-obsidian-bridge\uFF09\u3002
 * \u6CE8\u610F\uFF1A\u672C\u51FD\u6570\u4F4D\u4E8E\u6A21\u677F\u5B57\u7B26\u4E32\u5185\uFF0C\u6CE8\u91CA\u91CC\u4E0D\u5F97\u51FA\u73B0\u53CD\u5F15\u53F7\uFF08\u4F1A\u63D0\u524D\u7EC8\u7ED3\u5B57\u7B26\u4E32\uFF09\u3002
 */
const RENAMED_PRODUCERS = { compact: 'compact-checkpoint', 'tools-code-mode': 'ptc-mode', 'tools-ptc': 'ptc-mode', 'dsh-compaction-basic': 'compact-basic', '@deepseek-ai/dsh-system-prompt': 'runtime-context' }
const SAME_NAME_PRODUCERS = new Set(['agent-instructions', 'session-reference', 'team-message', 'goal', 'skill-invocation', 'skill-catalog', 'coordinator', 'subagent-report', 'subagent-settled', 'webhook', 'agent-message', 'model-selection', 'plan-mode', 'time-context', 'tmux-context', 'user-approval', 'repeat-tool-reminder', 'tool-cordis', 'cordis-host-runner', 'tool-goal', 'tool-jobs', 'hooks-codex', 'hooks-claude-code', 'schedule', 'dsh-session-title-llm'])

function producerKind(plugin, role) {
  if (plugin === '@deepseek-ai/dsh-system-prompt' && role === 'system') return 'system-prompt'
  if (Object.prototype.hasOwnProperty.call(RENAMED_PRODUCERS, plugin)) return RENAMED_PRODUCERS[plugin]
  if (SAME_NAME_PRODUCERS.has(plugin)) return plugin
  return 'plugin:' + plugin
}

function fixPluginSourceKind(obj, version) {
  if (!(version >= 4)) return 0
  return eachMessage(obj, (m) => {
    const src = m.source
    if (!isObj(src)) return 0
    if (src.kind !== 'plugin') return 0
    if (typeof src.plugin !== 'string' || src.plugin === '') return 0
    const kind = producerKind(src.plugin, m.role)
    const keys = Object.keys(src)
    // \u5B98\u65B9 rewritePluginSource\uFF1A\u53EA\u5269 {kind, plugin} \u65F6\u584C\u7F29\u6210 {kind}\uFF1B\u5426\u5219\u4FDD\u7559\u975E\u8EAB\u4EFD\u5B57\u6BB5\u5E76\u5220\u6389 plugin
    m.source = keys.length === 2
      ? { kind }
      : Object.fromEntries(keys.filter((k) => k !== 'plugin').map((k) => [k, k === 'kind' ? kind : src[k]]))
    return 1
  })
}


/** \u5207\u5206 zstd \u591A\u5E27\uFF08Node \u7684 one-shot API \u53EA\u89E3\u7B2C\u4E00\u5E27\uFF09\u3002 */
function splitFrames(buf) {
  const frames = []
  let off = 0
  while (off < buf.length) {
    const start = off
    if (buf.length - off < 4) throw new Error('truncated zstd magic at ' + off)
    if (buf.readUInt32LE(off) !== MAGIC) throw new Error('bad zstd magic at ' + off)
    off += 4
    const descriptor = buf[off]
    off += 1
    const fcsFlag = descriptor >> 6
    const singleSegment = (descriptor >> 5) & 1
    const checksum = (descriptor >> 2) & 1
    const didFlag = descriptor & 3
    if (singleSegment === 0) off += 1
    off += [0, 1, 2, 4][didFlag]
    if (fcsFlag === 0) {
      if (singleSegment === 1) off += 1
    } else {
      off += [2, 4, 8][fcsFlag - 1]
    }
    for (;;) {
      if (buf.length - off < 3) throw new Error('truncated block header at ' + off)
      const bh = buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16)
      const last = bh & 1
      const type = (bh >> 1) & 3
      const size = bh >>> 3
      off += 3
      off += type === 1 ? 1 : size
      if (off > buf.length) throw new Error('truncated block payload at ' + off)
      if (last === 1) break
    }
    if (checksum === 1) off += 4
    frames.push(buf.subarray(start, off))
  }
  return frames
}

function decodeAll(path) {
  const buf = readFileSync(path)
  const frames = splitFrames(buf)
  let text = ''
  for (const frame of frames) text += zstdDecompressSync(frame).toString('utf8')
  return text
}

/** \u591A\u5E27\u538B\u7F29\uFF1A\u9996\u5E27\u6070\u597D\u4E00\u884C header\uFF08DSH assertZstdHeaderFrame \u8981\u6C42\uFF09\uFF0C\u5176\u4F59\u8FDB\u7B2C\u4E8C\u5E27\u3002 */
function encodeTwoFrames(text) {
  const lines = text.split('\\n')
  const head = lines[0] + '\\n'
  const rest = lines.slice(1).join('\\n')
  return Buffer.concat([zstdCompressSync(Buffer.from(head, 'utf8')), zstdCompressSync(Buffer.from(rest, 'utf8'))])
}

function summarize(text) {
  let path = ''
  let loc = ''
  const mp = /\u76EE\u6807\u6587\u4EF6\uFF1A(.*?)\uFF1B/.exec(text)
  if (mp) path = mp[1].trim()
  const ml = /\u9009\u533A\uFF081 \u57FA\u884C:\u5217\uFF09\uFF1A(.*?)\uFF1B/.exec(text)
  if (ml) loc = ml[1].trim()
  return ['BRIDGES \u7F16\u8F91\u6307\u4EE4', path, loc].filter((s) => s !== '').join(' \xB7 ')
}

/** \u2460 \u5D4C\u5957\u533A\u95F4 \u2192 \u5BC6\u96C6\u6574\u6570\u6570\u7EC4\u3002\u8FD4\u56DE\u6539\u52A8\u6570\u3002 */
function fixSourceEventSeqs(obj) {
  const ses = obj.sourceEventSeqs
  if (!Array.isArray(ses)) return 0
  let nested = false
  for (const v of ses) {
    if (!Number.isInteger(v)) { nested = true; break }
  }
  if (!nested) return 0
  const out = []
  for (const v of ses) {
    if (Number.isInteger(v)) { out.push(v); continue }
    if (Array.isArray(v) && v.length === 2 && v.every((x) => Number.isInteger(x)) && v[1] >= v[0]) {
      for (let i = v[0]; i <= v[1]; i++) out.push(i)
      continue
    }
    throw new Error('unexpected sourceEventSeqs element: ' + JSON.stringify(v))
  }
  obj.sourceEventSeqs = out
  return 1
}

/** \u2461 \u975E\u6CD5 source.form \u2192 notice + summary\u3002\u6CBF v4 \u7684\u5168\u90E8\u6D88\u606F\u69FD\u4F4D\u904D\u5386\uFF08inbox \u91CC\u672A\u843D\u6210\u4E8B\u4EF6\u7684\u6CE8\u5165\u540C\u6837\u8FC7\u95F8\uFF09\u3002\u8FD4\u56DE\u6539\u52A8\u6570\u3002 */
function fixSourceForm(obj) {
  return eachMessage(obj, (m) => {
    const src = m.source
    if (!isObj(src)) return 0
    const form = src.form
    if (typeof form !== 'string' || ALLOWED.has(form)) return 0
    let text = ''
    if (Array.isArray(m.content)) {
      for (const c of m.content) {
        if (c !== null && typeof c === 'object' && typeof c.text === 'string') { text = c.text; break }
      }
    }
    const next = { kind: src.kind, plugin: src.plugin, form: 'notice', summary: summarize(text) }
    m.source = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined))
    return 1
  })
}

/** \u2462 subagent/descriptor \u7684\u5DF2\u77E5\u65E7\u7248\u672C 2 \u2192 3\uFF1B\u5176\u5B83\u503C\u4E00\u5F8B\u4E0D\u52A8\u3002\u8FD4\u56DE\u6539\u52A8\u6570\u3002 */
function fixDescriptorVersion(obj) {
  if (obj.type !== 'subagent/descriptor') return 0
  const d = obj.data
  if (d === null || typeof d !== 'object') return 0
  // \u4F9D\u636E\uFF080.1.7-rc.2 \u9010\u5B57\u6838\u5BF9\uFF09\uFF1A\u4E0A\u6E38 SUBAGENT_DESCRIPTOR_VERSION = 3
  // \uFF08dsh-subagent/lib/index.js:1309\uFF09\uFF1Bv1+ codec \u6309 3 \u9A8C\u6536
  // \uFF08dsh-session-format-v0-to-v1/lib/index.js:1584\uFF09\uFF1Bv3\u2192v4 \u7684\u5B50\u4F1A\u8BDD\u8BC1\u636E\u53EA\u8BA4 {1,2,3}
  // \uFF08dsh-session-format-v3-to-v4/lib/index.js:904-908\uFF09\u3002
  // \u65E7\u5B9E\u73B0\u628A\u300C\u4EFB\u4F55\u975E 3\u300D\u90FD\u5199\u6210 3\u2014\u2014\u4E0A\u6E38\u5C06\u6765\u53D1\u5230 4 \u65F6\u4F1A\u88AB\u6211\u4EEC\u964D\u7EA7\u6539\u574F \u21D2 \u6536\u7A84\u4E3A\u53EA\u5347\u5DF2\u77E5\u65E7\u503C 2\u3002
  if (d.version !== 2) return 0
  d.version = 3
  return 1
}

/**
 * \u2463 user/message \u7F3A data.id/data.role \u2192 \u8865\u9F50\uFF08v2.4.0\uFF0C2026-09-10 \u771F\u673A\u5D29\u6E83\uFF09\u3002
 * \u75C7\u72B6\uFF1A\u300Csession event at seq N lacks an identified message\u300D\u2192 \u6574\u4E2A\u4F1A\u8BDD\u8BFB\u4E0D\u51FA\u6765\u3002
 * \u6210\u56E0\uFF1A\u63D2\u4EF6 pre-step \u6CE8\u5165\u7684\u6D88\u606F\u4E00\u5EA6\u53EA\u8FD4\u56DE { source, content }\uFF1BDSH \u8FC1\u79FB\u94FE\u53EA\u66FF**\u65E7**\u4E8B\u4EF6\u8865 id
 * \uFF08legacy-message:&lt;sessionId&gt;:&lt;seq&gt;\uFF09\uFF0C\u8FD0\u884C\u671F\u65B0\u6CE8\u5165\u7684\u4E8B\u4EF6\u4E0D\u8D70\u8FC1\u79FB\uFF0C\u65E0\u4EBA\u8865\u3002
 * \u8303\u56F4**\u53EA\u9650 user/message**\uFF1A\u771F\u673A\u4F1A\u8BDD\u5B9E\u6D4B\u53EA\u6709\u8BE5\u7C7B\u578B\u7684 data \u5929\u7136\u5E26 id+role
 * \uFF08assistant/message \u662F turn/step/message/usage\uFF0Ctool-call-chunks \u7684 id \u662F chunk id\uFF09\uFF0C
 * \u8D8A\u754C\u6539\u5176\u5B83\u7C7B\u578B\u4F1A\u8BA9 v0\u2192v1 \u8FC1\u79FB\u94FE\u62D2\u7EDD\u6574\u4E2A\u4F1A\u8BDD\u3002
 */
function fixMessageIdentity(obj, sid) {
  if (obj.type !== 'user/message') return 0
  const d = obj.data
  if (d === null || typeof d !== 'object') return 0
  let n = 0
  if (typeof d.id !== 'string' || d.id === '') {
    d.id = 'legacy-message:' + sid + ':' + String(obj.seq)
    n += 1
  }
  if (typeof d.role !== 'string' || d.role === '') {
    d.role = 'user'
    n += 1
  }
  return n
}

// v2.7.0\uFF080.1.7 \u9002\u914D A1\uFF09\uFF1A0.1.7 \u8D77 currentVersion=4\uFF0C\u800C**\u9759\u6001 catalog \u7684 V3\u2192V4 \u8FC1\u79FB\u8FB9\u8981\u6C42\u663E\u5F0F\u63D0\u4F9B
// \u8BE5 parent \u7684 historical child facts**\uFF08\u4E0D\u7ED9\u5C31\u629B\u300CV3 catalog migration requires explicit historical
// child facts\u2026\u300D\uFF09\u3002\u4E0A\u6E38\u81EA\u5DF1\u4E5F\u4E0D\u662F\u7528\u9759\u6001\u76EE\u5F55\u786C\u8FC1\u2014\u2014\u5B83\u5148\u7531\u6301\u4E45\u5316\u5C42\u7B97\u51FA related.facts \u518D\u8C03
// createSessionFormatCatalogWithChildren(facts)\uFF08dsh-session-persistence-jsonl/lib/index.js:2703\uFF09\u3002
// \u21D2 \u672C\u63D2\u4EF6**\u65E0\u6CD5**\u5728\u79BB\u7EBF\u6001\u5B89\u5168\u6821\u9A8C/\u6539\u5199\u4F4E\u4E8E currentVersion \u7684\u4F1A\u8BDD\uFF1A\u82E5\u7167\u65E7\u8C03\u7528\uFF0C\u4EFB\u4F55 v3 \u4F1A\u8BDD\u90FD\u4F1A\u88AB\u5224
// broken \u4E14"\u4FEE\u590D"\u6C38\u8FDC\u4FEE\u4E0D\u52A8\uFF080.1.7-rc.1 \u5B9E\u6D4B\uFF1A\u540C\u811A\u672C\u5BF9 0.1.5-rc.2 PASS\u3001\u5BF9 rc.1 FAIL\uFF09\u3002
// \u5904\u7F6E\uFF1A\u63A2\u6D4B catalog \u7684\u5F53\u524D\u683C\u5F0F\u7248\u672C\uFF0C\u51E1 header.version \u4F4E\u4E8E\u5B83\u4E00\u5F8B**\u53EA\u62A5\u544A\u4E0D\u6539\u5199**\uFF08deferred\uFF09\uFF0C
// \u5E76\u628A\u771F\u76F8\u8BF4\u6E05\u695A\u2014\u2014\u5347\u7EA7\u7531 DSH \u6253\u5F00\u4F1A\u8BDD\u65F6\u6309\u5B98\u65B9\u8FC1\u79FB\u94FE\u5B8C\u6210\u3002\u672C\u5730\u8865\u68C0\uFF08\u7F3A id/role\uFF09\u4ECD\u7167\u5E38\u6267\u884C\u3002
// \u6CE8\u610F\uFF1A\u672C\u6BB5\u6CE8\u91CA\u4F4D\u4E8E\u6A21\u677F\u5B57\u7B26\u4E32\u5185\uFF0C\u4E0D\u5F97\u51FA\u73B0\u53CD\u5F15\u53F7\uFF08\u4F1A\u63D0\u524D\u7EC8\u7ED3\u5B57\u7B26\u4E32\uFF09\u3002
let catalog = null
let catalogVersion = 0
try {
  const mod = await import('@deepseek-ai/dsh-session-format-catalog')
  catalog = mod.sessionFormatCatalog || null
  catalogVersion = Number(catalog && catalog.currentVersion) || 0
} catch {
  catalog = null
  catalogVersion = 0
}

/** \u8BFB header \u91CC\u7684\u683C\u5F0F\u7248\u672C\uFF08\u8BFB\u4E0D\u51FA\u6309 0\uFF1Dv0/\u672A\u77E5\uFF0C\u4E0D\u89E6\u53D1 deferred\uFF09\u3002 */
function headerVersion(text) {
  try {
    const h = JSON.parse(text.split('\\n')[0] || '{}')
    return Number(h === null || typeof h !== 'object' ? 0 : h.version) || 0
  } catch {
    return 0
  }
}

/**
 * \u672C\u5730\u8865\u68C0\u300Clacks an identified message\u300D\u3002
 *
 * \u4E3A\u4EC0\u4E48\u5FC5\u987B\u81EA\u5DF1\u67E5\uFF1Acatalog \u7684\u8FC1\u79FB\u94FE\uFF08createRestore/decodeRow\uFF09**\u4E0D\u8DD1**
 * dsh-session \u7684 assertMessageEventShape \u2014\u2014 \u540E\u8005\u5728 dsh-session \u7684\u8BFB\u53D6\u8DEF\u5F84\u91CC\uFF0C
 * \u4E0D\u5728\u683C\u5F0F\u8FC1\u79FB\u94FE\u91CC\u3002\u771F\u673A\u5B9E\u6D4B\uFF1A\u4E00\u4E2A\u786E\u51FF\u7F3A id \u7684\u4F1A\u8BDD\uFF0C\u7EAF catalog \u6821\u9A8C\u8FD4\u56DE ok\u3002
 * \u4E8E\u662F\u9884\u68C0\u4F1A\u62A5"\u5168\u90E8\u6B63\u5E38"\uFF0C\u5F39\u7A97\u91CC\u300C\u5907\u4EFD\u5E76\u4FEE\u590D\u300D\u6309\u94AE\u56E0 broken===0 \u88AB\u7981\u7528\uFF0C
 * \u8FD9\u4E2A\u529F\u80FD\u5BF9\u8BE5\u6545\u969C\u7B49\u4E8E\u4E0D\u5B58\u5728\u3002
 *
 * \u53EA\u5BF9 v3 \u53CA\u4EE5\u540E\u751F\u6548\uFF1Av0 \u7684 user/message \u672C\u5C31\u6CA1\u6709 id/role\uFF08\u8FC1\u79FB\u94FE\u4F1A\u8865
 * legacy-message:<sid>:<seq>\uFF09\uFF0C\u6309\u540C\u4E00\u628A\u5C3A\u5B50\u91CF\u4F1A\u628A\u5168\u90E8\u8001\u4F1A\u8BDD\u8BEF\u5224\u4E3A\u635F\u574F\u3002
 *
 * \u53EA\u5728"\u6D88\u606F\u5BF9\u8C61\u5B58\u5728\u4F46\u7F3A\u8EAB\u4EFD"\u65F6\u62A5\u9519 \u2014\u2014 \u7F3A data \u5C5E\u53E6\u4E00\u7C7B\u635F\u574F\uFF0C\u4E0D\u5728\u6B64\u5224\u5B9A\uFF0C\u907F\u514D\u8BEF\u4F24\u3002
 */
function localValidate(text, version) {
  if (!(version >= 3)) return { ok: true }
  const roleTable = msgRoleTable(version)
  const lines = text.split('\\n')
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '') continue
    let obj
    try { obj = JSON.parse(lines[i]) } catch { continue }
    const want = roleTable[obj.type]
    if (want === undefined) continue
    const d = obj.data
    if (d === null || typeof d !== 'object') continue
    const m = obj.type === 'user/message' ? d : d.message
    if (m === null || typeof m !== 'object') continue
    if (typeof m.id !== 'string' || m.id === '')
      return { ok: false, reason: 'session event at seq ' + String(obj.seq) + ' lacks an identified message' }
    if (m.role !== want)
      return { ok: false, reason: 'session event at seq ' + String(obj.seq) + ' message must have role \\"' + want + '\\"' }
  }
  return { ok: true }
}

/** \u6821\u9A8C\uFF1A\u5148\u672C\u5730\u8865\u68C0\uFF0C\u518D\u7528 DSH \u81EA\u5E26\u8FC1\u79FB\u94FE\u590D\u9A8C\uFF08\u65E0 catalog \u65F6\u964D\u7EA7\u4E3A\u672A\u6821\u9A8C\uFF0C\u4E0D\u963B\u65AD\u672C\u5730\u4FEE\u590D\uFF09\u3002 */
function validate(text) {
  const version = headerVersion(text)
  const local = localValidate(text, version)
  if (!local.ok) return { ok: false, reason: local.reason, validated: true }
  if (catalog === null) return { ok: true, validated: false }
  // \u4F4E\u4E8E catalog \u5F53\u524D\u683C\u5F0F\uFF1A\u9759\u6001\u76EE\u5F55\u65E0\u6CD5\u6821\u9A8C\uFF08V_{n-1}\u2192V_n \u8FB9\u9700\u8981\u5B50\u4F1A\u8BDD\u8BC1\u636E\uFF09\u21D2 \u53EA\u62A5\u544A\uFF0C\u4E0D\u6539\u5199\u3002
  if (catalogVersion > 0 && version > 0 && version < catalogVersion) {
    return {
      ok: true,
      validated: false,
      deferred: true,
      reason: 'v' + version + ' \u4F1A\u8BDD\uFF1ADSH \u5F53\u524D\u683C\u5F0F\u4E3A v' + catalogVersion + '\uFF0C\u8DE8\u7248\u672C\u8FC1\u79FB\u9700\u5B50\u4F1A\u8BDD\u8BC1\u636E\uFF0C' +
        '\u7531 DSH \u6253\u5F00\u8BE5\u4F1A\u8BDD\u65F6\u81EA\u884C\u5B8C\u6210\uFF1B\u672C\u63D2\u4EF6\u4E0D\u505A\u4EE3\u5199\uFF08\u907F\u514D\u65E0\u6CD5\u6821\u9A8C\u7684\u76F2\u6539\uFF09',
    }
  }
  const lines = text.split('\\n').filter((l) => l.length > 0)
  if (lines.length === 0) return { ok: false, reason: 'empty session', validated: true }
  let restore
  try {
    restore = catalog.createRestore(JSON.parse(lines[0]), { recovery: 'recoverable', validation: 'transformed' })
  } catch (err) {
    const msg = String(err && err.message ? err.message : err)
    // \u515C\u5E95\uFF1A\u5373\u4F7F\u63A2\u6D4B\u4E0D\u5230 catalog.currentVersion\uFF0CDSH \u81EA\u5DF1\u629B\u7684\u300C\u9700\u8981 historical child facts\u300D\u4E5F\u5FC5\u987B
    // \u5224\u4E3A\u300C\u8DE8\u7248\u672C\u3001\u672C\u63D2\u4EF6\u4E0D\u4EE3\u505A\u300D\uFF0C\u800C\u4E0D\u662F broken\uFF08\u5426\u5219\u6309\u94AE\u53D8\u6210\u4E00\u4E2A\u6C38\u8FDC\u4FEE\u4E0D\u52A8\u7684\u5047\u8C61\uFF09\u3002
    if (/historical child facts|child facts/i.test(msg)) {
      return {
        ok: true,
        validated: false,
        deferred: true,
        reason: '\u8BE5\u4F1A\u8BDD\u683C\u5F0F\u4F4E\u4E8E DSH \u5F53\u524D\u7248\u672C\uFF0C\u8DE8\u7248\u672C\u8FC1\u79FB\u9700\u5B50\u4F1A\u8BDD\u8BC1\u636E\uFF0C\u5C06\u7531 DSH \u6253\u5F00\u8BE5\u4F1A\u8BDD\u65F6\u81EA\u884C\u5B8C\u6210\uFF1B\u672C\u63D2\u4EF6\u4E0D\u505A\u4EE3\u5199',
      }
    }
    return { ok: false, reason: msg, validated: true }
  }
  try {
    for (let i = 1; i < lines.length; i++) restore.decodeRow(JSON.parse(lines[i]))
    restore.finish()
  } catch (err) {
    return { ok: false, reason: String(err && err.message ? err.message : err), validated: true }
  }
  return { ok: true, validated: true }
}

function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + '\\n')
}

const files = arg.files
let ok = 0
let broken = 0
let fixed = 0
let errors = 0
let deferred = 0
let validating = catalog !== null

for (const path of files) {
  let text
  try {
    text = decodeAll(path)
  } catch (err) {
    errors += 1
    emit({ path, status: 'error', reason: 'decode: ' + String(err && err.message ? err.message : err) })
    continue
  }
  const before = validate(text)
  if (mode === 'check') {
    if (before.deferred) { deferred += 1; emit({ path, status: 'ok', deferred: true, validated: false, reason: before.reason }); continue }
    if (before.ok) { ok += 1; emit({ path, status: 'ok', validated: before.validated }) }
    else { broken += 1; emit({ path, status: 'broken', reason: before.reason, validated: before.validated }) }
    continue
  }
  // repair\uFF1A\u8DE8\u7248\u672C\u4F1A\u8BDD\u4E00\u5F8B\u4E0D\u6539\u5199\uFF08\u89C1\u4E0A\u65B9 A1 \u6CE8\u91CA\uFF1A\u9759\u6001\u76EE\u5F55\u65E0\u6CD5\u6821\u9A8C\uFF0C\u5148\u9A8C\u540E\u5199\u7684\u5E95\u7EBF\u4E0D\u80FD\u7834\uFF09
  if (before.deferred) {
    deferred += 1
    emit({ path, status: 'ok', deferred: true, validated: false, reason: before.reason })
    continue
  }
  // repair\uFF1A\u65E0\u8BBA\u662F\u5426\u53EF\u8BFB\u90FD\u5C1D\u8BD5\u89C4\u8303\u5316\uFF08\u5E42\u7B49\uFF09\uFF0C\u53EA\u5728"\u6539\u5B8C\u53EF\u8BFB"\u4E14"\u786E\u6709\u6539\u52A8"\u65F6\u843D\u76D8
  let changed = { seqs: 0, form: 0, descriptor: 0, identity: 0, kind: 0 }
  const fileVersion = headerVersion(text)
  const outLines = []
  const lines = text.split('\\n')
  let sid = 'session'
  try {
    const h = JSON.parse(lines[0] || '{}')
    sid = String((h && (h.id ?? h.sessionId ?? h.session)) ?? 'session')
  } catch {
    sid = 'session'
  }
  let parseError = ''
  for (const line of lines) {
    if (line === '') { outLines.push(line); continue }
    let obj
    try {
      obj = JSON.parse(line)
    } catch {
      outLines.push(line)
      continue
    }
    try {
      changed.seqs += fixSourceEventSeqs(obj)
      changed.form += fixSourceForm(obj)
      // \u2464 \u4EC5 v4 \u751F\u6548\u3002\u987A\u5E8F\u8981\u7D27\uFF1A\u5148\u4FEE form\uFF08\u6B64\u65F6\u8FD8\u4F1A\u5E26\u4E0A kind/plugin\uFF09\uFF0C
      // \u518D\u628A\u9000\u5F79\u7684 kind:'plugin' \u5347\u6210\u751F\u4EA7\u8005\u81EA\u6709 kind \u5E76\u5220\u6389 plugin \u5B57\u6BB5\u3002
      changed.kind += fixPluginSourceKind(obj, fileVersion)
      changed.descriptor += fixDescriptorVersion(obj)
      changed.identity += fixMessageIdentity(obj, sid)
    } catch (err) {
      parseError = String(err && err.message ? err.message : err)
    }
    outLines.push(JSON.stringify(obj))
  }
  const totalChanged = changed.seqs + changed.form + changed.descriptor + changed.identity + changed.kind
  if (parseError !== '') {
    errors += 1
    emit({ path, status: 'error', reason: parseError, fixes: changed })
    continue
  }
  if (totalChanged === 0) {
    if (before.ok) { ok += 1; emit({ path, status: 'ok', validated: before.validated }) }
    else { broken += 1; emit({ path, status: 'broken', reason: before.reason, validated: before.validated }) }
    continue
  }
  const fixedText = outLines.join('\\n')
  const after = validate(fixedText)
  // \u5199\u524D\u5B88\u536B\uFF1A\u8DE8\u7248\u672C\uFF08deferred\uFF09\u4E00\u5F8B\u4E0D\u843D\u76D8\u2014\u2014\u5B83\u610F\u5473\u7740"\u65E0\u6CD5\u7528\u5B98\u65B9\u8FC1\u79FB\u94FE\u6821\u9A8C"\uFF0C\u5148\u9A8C\u540E\u5199\u7684\u5E95\u7EBF\u4E0D\u80FD\u7834
  if (after.deferred) {
    deferred += 1
    emit({ path, status: 'ok', deferred: true, validated: false, fixes: changed, reason: after.reason })
    continue
  }
  if (!after.ok) {
    broken += 1
    emit({ path, status: 'broken', reason: 'still invalid after fixes: ' + String(after.reason), fixes: changed, validated: after.validated })
    continue
  }
  try {
    const bytesBefore = statSync(path).size
    if (backupDir) {
      mkdirSync(backupDir, { recursive: true })
      const rel = path.slice(sessionsRoot.length).replace(/^[\\\\/]+/, '').replace(/[\\\\/]/g, '__')
      copyFileSync(path, join(backupDir, rel + '.bak'))
    }
    const blob = encodeTwoFrames(fixedText)
    const tmp = path + '.repair-tmp-' + process.pid
    writeFileSync(tmp, blob)
    renameSync(tmp, path)
    fixed += 1
    emit({ path, status: 'fixed', fixes: changed, validated: after.validated, bytesBefore, bytesAfter: blob.length })
  } catch (err) {
    errors += 1
    emit({ path, status: 'error', reason: 'write: ' + String(err && err.message ? err.message : err), fixes: changed })
  }
}

emit({ summary: true, mode, total: files.length, ok, broken, fixed, errors, deferred, validating })
`;
}
function runSessionRepairDriver(runtime, args, onItem) {
  return new Promise((resolve2) => {
    let dir = "";
    const cleanup = () => {
      if (dir === "") return;
      const target = dir;
      dir = "";
      try {
        (0, import_node_fs14.rmSync)(target, { recursive: true, force: true });
      } catch (e) {
      }
    };
    try {
      dir = (0, import_node_fs14.mkdtempSync)((0, import_node_path12.join)((0, import_node_os8.tmpdir)(), "dsh-repair-args-"));
      const argsPath = (0, import_node_path12.join)(dir, "args.json");
      (0, import_node_fs14.writeFileSync)(argsPath, JSON.stringify(args), "utf8");
      const child = (0, import_node_child_process7.spawn)(runtime.nodePath, ["--input-type=module", "-e", buildSessionRepairDriverSource(), argsPath], {
        cwd: runtime.cwd,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
        // v2.8.11：合并 PATH（驱动脚本由 nvm/brew 的 node 启动，其子步骤同样需要可用的 PATH）
        env: refreshedEnv()
      });
      let buffer = "";
      let stderr = "";
      let summary = null;
      const items = [];
      child.stdout.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
        let idx = buffer.indexOf("\n");
        while (idx >= 0) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          idx = buffer.indexOf("\n");
          if (line === "") continue;
          try {
            const parsed = JSON.parse(line);
            if ("summary" in parsed && parsed.summary === true) {
              summary = parsed;
            } else {
              const item = parsed;
              items.push(item);
              onItem == null ? void 0 : onItem(item);
            }
          } catch (e) {
          }
        }
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", (err) => {
        cleanup();
        resolve2({ ok: false, error: err.message });
      });
      child.on("close", (code) => {
        cleanup();
        if (summary === null) {
          resolve2({ ok: false, error: stderr.trim() !== "" ? stderr.trim().slice(0, 400) : t("repair.driverFail", { code: String(code != null ? code : -1) }) });
          return;
        }
        resolve2({ ok: true, summary: { ...summary, items } });
      });
    } catch (err) {
      cleanup();
      resolve2({ ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  });
}

// src/session-repair-modal.ts
var SessionRepairModal = class extends import_obsidian8.Modal {
  constructor(app, home = dshHomeDir()) {
    super(app);
    this.statusEl = null;
    this.dangerEl = null;
    this.busy = false;
    this.runtime = null;
    this.runtimeError = "";
    this.broken = 0;
    this.summary = null;
    this.home = home;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.setTitle(t("repair.title"));
    contentEl.createEl("p", { text: t("repair.desc") });
    this.dangerEl = contentEl.createEl("p", { cls: "dsh-modal-danger", text: t("repair.danger") });
    this.statusEl = contentEl.createEl("p", { cls: "dsh-repair-status", text: t("repair.checking") });
    this.renderButtons();
    void this.check();
  }
  onClose() {
    this.contentEl.empty();
  }
  setStatus(text) {
    if (this.statusEl !== null) this.statusEl.setText(text);
  }
  renderButtons() {
    const wrap = this.contentEl.createDiv({ cls: "dsh-repair-actions" });
    new import_obsidian8.Setting(wrap).addButton(
      (b) => markDestructive(b).setButtonText(t("repair.btnRepair", { n: String(this.broken) })).setDisabled(this.busy || this.broken === 0).onClick(() => {
        void this.repair();
      })
    ).addButton(
      (b) => b.setButtonText(t("repair.btnRecheck")).onClick(() => {
        if (this.busy) return;
        this.broken = 0;
        this.renderButtons();
        void this.check();
      })
    ).addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close()));
  }
  /** 清掉旧的按钮区后重画（按钮文案含不可读会话数）。 */
  rerenderActions() {
    const actions = this.contentEl.querySelectorAll(".dsh-repair-actions");
    actions.forEach((el) => el.remove());
    this.renderButtons();
  }
  async check() {
    var _a;
    this.busy = true;
    this.rerenderActions();
    this.setStatus(t("repair.checking"));
    try {
      const resolved = resolveSessionRepairRuntime();
      if (!resolved.ok) {
        this.runtimeError = resolved.error;
        this.setStatus(resolved.error);
        this.busy = false;
        this.rerenderActions();
        return;
      }
      this.runtime = resolved.runtime;
      const files = findSessionFiles(this.home);
      if (files.length === 0) {
        this.setStatus(t("repair.checkClean", { total: "0" }));
        this.busy = false;
        this.rerenderActions();
        return;
      }
      const result = await runSessionRepairDriver(this.runtime, {
        mode: "check",
        sessionsRoot: (0, import_node_path13.join)(this.home, "sessions"),
        files
      });
      if (!result.ok) {
        this.setStatus(result.error);
        this.busy = false;
        this.rerenderActions();
        return;
      }
      this.summary = result.summary;
      this.broken = result.summary.broken;
      const clean = result.summary.broken === 0;
      this.setStatus(
        clean ? t("repair.checkClean", { total: String(result.summary.total) }) : t("repair.checkDone", {
          total: String(result.summary.total),
          ok: String(result.summary.ok),
          broken: String(result.summary.broken)
        })
      );
      const deferredN = Number(result.summary.deferred) || 0;
      if (deferredN > 0) (_a = this.statusEl) == null ? void 0 : _a.createSpan({ text: t("repair.deferred", { n: String(deferredN) }) });
      this.renderRuntimeInfo();
    } catch (err) {
      this.setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      this.busy = false;
      this.rerenderActions();
    }
  }
  renderRuntimeInfo() {
    if (this.runtime === null || this.statusEl === null) return;
    const info = t("repair.runtime", {
      node: this.runtime.nodePath,
      version: this.runtime.version,
      dir: (0, import_node_path13.basename)(this.runtime.cwd)
    });
    this.statusEl.createEl("br");
    this.statusEl.createSpan({ text: info });
  }
  async repair() {
    var _a, _b;
    const resolved = this.runtime !== null ? { ok: true, runtime: this.runtime } : resolveSessionRepairRuntime();
    if (!resolved.ok) {
      new import_obsidian8.Notice(resolved.error, 1e4);
      return;
    }
    const files = findSessionFiles(this.home);
    if (files.length === 0) {
      new import_obsidian8.Notice(t("repair.noChange"), 6e3);
      return;
    }
    this.busy = true;
    this.rerenderActions();
    const backupDir = (0, import_node_path13.join)(defaultCleanupBackupDir(this.home), `sessions-repair-${backupTimestamp()}`);
    let done = 0;
    this.setStatus(t("repair.running", { done: "0", total: String(files.length) }));
    try {
      const result = await runSessionRepairDriver(
        resolved.runtime,
        { mode: "repair", sessionsRoot: (0, import_node_path13.join)(this.home, "sessions"), backupDir, files },
        () => {
          done += 1;
          this.setStatus(t("repair.running", { done: String(done), total: String(files.length) }));
        }
      );
      if (!result.ok) {
        new import_obsidian8.Notice(result.error, 12e3);
        this.setStatus(result.error);
        return;
      }
      const s = result.summary;
      this.setStatus(
        t("repair.done", {
          fixed: String(s.fixed),
          errors: String(s.errors),
          broken: String(s.broken)
        })
      );
      (_a = this.statusEl) == null ? void 0 : _a.createEl("br");
      (_b = this.statusEl) == null ? void 0 : _b.createSpan({ text: t("repair.backupDir", { dir: backupDir }) });
      new import_obsidian8.Notice(
        t("repair.done", { fixed: String(s.fixed), errors: String(s.errors), broken: String(s.broken) }),
        s.errors > 0 ? 15e3 : 8e3
      );
      this.busy = false;
      await this.check();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setStatus(msg);
      new import_obsidian8.Notice(msg, 12e3);
    } finally {
      this.busy = false;
      this.rerenderActions();
    }
  }
};

// src/dsh-api.ts
var DEFAULT_TIMEOUT_MS = 8e3;
var apiStyle = null;
var authCookie = "";
var authInFlight = null;
function resetDshApiSession() {
  apiStyle = null;
  authCookie = "";
  authInFlight = null;
}
function endpointFor(method, style) {
  return style === "dot" ? method : method.replace(".", "/");
}
function newRpcId() {
  try {
    const c = window.crypto;
    if (c == null ? void 0 : c.randomUUID) {
      return c.randomUUID();
    }
  } catch (e) {
  }
  return `rpc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
async function httpRequest(endpoint, path, method, body, headers) {
  try {
    const res = await endpointRequest(endpoint, {
      path,
      method,
      ...body === void 0 ? {} : { body },
      ...headers === void 0 ? {} : { headers },
      timeoutMs: DEFAULT_TIMEOUT_MS
    });
    return { status: res.status, text: res.text, setCookie: res.setCookie };
  } catch (err) {
    if (err.code === "ETIMEDOUT") {
      throw new Error(t("api.timeout", { ms: DEFAULT_TIMEOUT_MS }));
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}
function httpPost(endpoint, path, body, headers) {
  return httpRequest(endpoint, path, "POST", body, headers);
}
function httpGet(endpoint, path) {
  return httpRequest(endpoint, path, "GET");
}
var defaultTransport = { post: httpPost, get: httpGet };
function authPathOf(authUrl) {
  var _a;
  const m = /^https?:\/\/[^/]+(\/.*)$/.exec(authUrl.trim());
  return (_a = m == null ? void 0 : m[1]) != null ? _a : "";
}
async function exchangeAuthCookie(endpoint, authUrl, transport) {
  const path = authPathOf(authUrl);
  if (path === "") return "";
  if (authInFlight) return authInFlight;
  authInFlight = (async () => {
    var _a, _b, _c;
    try {
      const res = await transport.get(endpoint, path);
      const raw = (_a = res.setCookie) != null ? _a : "";
      const pair = (_c = (_b = raw.split(";")[0]) == null ? void 0 : _b.trim()) != null ? _c : "";
      if (res.status >= 300 && res.status < 400 && pair.startsWith("dsh-auth-")) {
        authCookie = pair;
      } else if (res.status === 200) {
        authCookie = "";
      }
      return authCookie;
    } catch (e) {
      return "";
    } finally {
      authInFlight = null;
    }
  })();
  return authInFlight;
}
function parseRpcResult(text) {
  var _a, _b, _c;
  try {
    const parsed = JSON.parse(text);
    if (parsed.type !== "server-response" || !parsed.result) {
      return { ok: false, error: t("api.badFormat") };
    }
    if (parsed.result.ok) {
      return { ok: true, value: parsed.result.value };
    }
    return {
      ok: false,
      error: (_b = (_a = parsed.result.error) == null ? void 0 : _a.message) != null ? _b : t("api.rejected"),
      code: (_c = parsed.result.error) == null ? void 0 : _c.code
    };
  } catch (e) {
    return { ok: false, error: t("api.unparsable") };
  }
}
async function dshRequest(endpoint, method, payload, transport = defaultTransport, authUrl = "") {
  var _a;
  const styles = apiStyle === "dot" ? ["dot", "slash"] : apiStyle === "slash" ? ["slash", "dot"] : ["dot", "slash"];
  let cookie = authCookie;
  let authTried = false;
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const rpcEndpoint = endpointFor(method, style);
    const body = JSON.stringify({ type: "client-request", rpcId: newRpcId(), method: rpcEndpoint, payload });
    let res;
    try {
      res = await transport.post(endpoint, `/api/${rpcEndpoint}`, body, cookie !== "" ? { cookie } : void 0);
    } catch (err) {
      const e = err;
      if ((e == null ? void 0 : e.code) === "ECONNREFUSED") {
        return { ok: false, error: t("api.notRunning", { addr: endpointLabel(endpoint), port: endpoint.port }) };
      }
      return { ok: false, error: t("api.connectFail", { err: (_a = e == null ? void 0 : e.message) != null ? _a : String(err) }) };
    }
    if (res.status === 401 && !authTried && authUrl !== "") {
      authTried = true;
      cookie = await exchangeAuthCookie(endpoint, authUrl, transport);
      i--;
      continue;
    }
    if (res.status === 404) {
      continue;
    }
    if (res.status !== 200) {
      return {
        ok: false,
        error: res.status === 401 ? t("api.authRequired") : t("api.httpStatus", { code: res.status })
      };
    }
    apiStyle = style;
    return parseRpcResult(res.text);
  }
  return { ok: false, error: t("api.httpStatus", { code: 404 }) };
}
function pickRecentSession(items) {
  var _a;
  const usable = items.find((item) => !item.blank);
  return (_a = usable == null ? void 0 : usable.sessionId) != null ? _a : null;
}
async function listSessions(endpoint, authUrl = "", transport = defaultTransport) {
  const modern = await dshRequest(
    endpoint,
    "session/list",
    { args: { _request: {} } },
    transport,
    authUrl
  );
  if (modern.ok) return modern;
  return dshRequest(endpoint, "session/list", {}, transport, authUrl);
}
async function resolveTargetSession(endpoint, transport = defaultTransport, authUrl = "") {
  const list = await dshRequest(endpoint, "session.list", {}, transport, authUrl);
  if (!list.ok) {
    return list;
  }
  const existing = pickRecentSession(list.value.items);
  if (existing) {
    return { ok: true, value: existing };
  }
  const created = await dshRequest(endpoint, "session.create", {}, transport, authUrl);
  if (!created.ok) {
    return created;
  }
  return { ok: true, value: created.value.sessionId };
}
async function sendTextToSession(endpoint, sessionId, text, transport = defaultTransport, authUrl = "") {
  return dshRequest(
    endpoint,
    "session.prompt",
    {
      sessionId,
      mode: "queue",
      content: [{ type: "text", text }]
    },
    transport,
    authUrl
  );
}

// src/startup-profiler.ts
var import_node_fs15 = require("node:fs");
var import_node_path14 = require("node:path");
var STARTUP_LOG_FILENAME = "dsh-startup-log.json";
var MAX_RECORDS = 20;
var defaultDeps = {
  readFile: (p) => (0, import_node_fs15.existsSync)(p) ? (0, import_node_fs15.readFileSync)(p, "utf8") : null,
  writeFile: (p, c) => {
    (0, import_node_fs15.mkdirSync)((0, import_node_path14.dirname)(p), { recursive: true });
    (0, import_node_fs15.writeFileSync)(p, c, "utf8");
  },
  now: () => Date.now()
};
var StartupProfiler = class {
  constructor(dataDir, deps = defaultDeps) {
    this.marks = [];
    this.dataDir = dataDir;
    this.deps = deps;
  }
  /** 标记一个阶段开始（或完成点）：记录 [name, ts]；同名前缀可多次（如 probe:start / probe:done）。 */
  mark(name) {
    this.marks.push({ name, ts: this.deps.now() });
  }
  /** 提交一次完整记录：把 marks 转成相邻阶段耗时并持久化；清空 marks。 */
  commit(ok, error) {
    const phases = {};
    const sorted = [...this.marks].sort((a, b) => a.ts - b.ts);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (cur.name === prev.name) continue;
      const key = `${prev.name}->${cur.name}`;
      phases[key] = cur.ts - prev.ts;
    }
    if (sorted.length > 0) {
      const last = sorted[sorted.length - 1];
      phases[`${last.name}->commit`] = this.deps.now() - last.ts;
    }
    this.append({ ts: this.deps.now(), phases, ok, ...error !== void 0 ? { error } : {} });
    this.marks.length = 0;
  }
  /** 追加记录到文件（截断到 MAX_RECORDS）。 */
  append(record) {
    const path = (0, import_node_path14.join)(this.dataDir, STARTUP_LOG_FILENAME);
    let records = [];
    const existing = this.deps.readFile(path);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed.records)) records = parsed.records;
      } catch (e) {
      }
    }
    records.push(record);
    if (records.length > MAX_RECORDS) records = records.slice(records.length - MAX_RECORDS);
    this.deps.writeFile(path, JSON.stringify({ records }, null, 2));
  }
  /** 读取最近记录（供设置页诊断区显示）。 */
  readRecords() {
    const path = (0, import_node_path14.join)(this.dataDir, STARTUP_LOG_FILENAME);
    const existing = this.deps.readFile(path);
    if (!existing) return [];
    try {
      const parsed = JSON.parse(existing);
      return Array.isArray(parsed.records) ? parsed.records : [];
    } catch (e) {
      return [];
    }
  }
};

// src/inject-ledger.ts
var import_node_crypto2 = require("node:crypto");
var import_node_fs16 = require("node:fs");
var import_node_path15 = require("node:path");
var INJECT_LIMITS = {
  /** 同 key 去重窗口：10 分钟。 */
  ttlMs: 10 * 60 * 1e3,
  /**
   * 同 key（同选区 + 同指令）在 TTL 窗口内的允许注入次数 = **1**（一次性语义）。
   * 之所以是 1：真机的注入风暴来自"每 step 重复注入"，而 DSH 的 inbox 一次性投递 + 本台账
   * 共同保证"同一选区只在首个 TTL 窗口注入一次"；想再次注入同一选区，改选区或改指令文本即可
   * （key 变化），或等 TTL 过期。
   */
  maxKeyHits: 1,
  /** 单会话注入总数上限（熔断阈值）。 */
  maxSessionInjections: 20,
  /** 台账条目上限（超出按时间淘汰）。 */
  maxItems: 200
};
function emptyLedger() {
  return { version: 1, items: [], sessions: {}, ruleSessions: [] };
}
function ledgerPathFor(bridgeDir) {
  return (0, import_node_path15.join)(bridgeDir, "inject-ledger.json");
}
function loadLedger(bridgeDir) {
  try {
    const raw = (0, import_node_fs16.readFileSync)(ledgerPathFor(bridgeDir), "utf8");
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return emptyLedger();
    const obj = parsed;
    return {
      version: 1,
      items: Array.isArray(obj.items) ? obj.items : [],
      sessions: obj.sessions !== null && typeof obj.sessions === "object" ? obj.sessions : {},
      ruleSessions: Array.isArray(obj.ruleSessions) ? obj.ruleSessions : [],
      storm: obj.storm
    };
  } catch (e) {
    return emptyLedger();
  }
}
function saveLedger(bridgeDir, data) {
  const file = ledgerPathFor(bridgeDir);
  const tmp = `${file}.tmp-${String(process.pid)}`;
  try {
    (0, import_node_fs16.mkdirSync)(bridgeDir, { recursive: true });
    (0, import_node_fs16.writeFileSync)(tmp, JSON.stringify(data), "utf8");
    (0, import_node_fs16.renameSync)(tmp, file);
    return true;
  } catch (e) {
    try {
      (0, import_node_fs16.writeFileSync)(file, JSON.stringify(data), "utf8");
      return true;
    } catch (e2) {
      return false;
    }
  }
}
function inspectLedger(bridgeDir) {
  const file = ledgerPathFor(bridgeDir);
  if (!(0, import_node_fs16.existsSync)(file)) return { exists: false, parseOk: true };
  try {
    const parsed = JSON.parse((0, import_node_fs16.readFileSync)(file, "utf8"));
    const ok = parsed !== null && typeof parsed === "object" && Array.isArray(parsed.items);
    return { exists: true, parseOk: ok };
  } catch (e) {
    return { exists: true, parseOk: false };
  }
}
function readStorm(bridgeDir, withinMs = 30 * 60 * 1e3, now = Date.now()) {
  const data = loadLedger(bridgeDir);
  if (data.storm === void 0) return null;
  if (now - data.storm.at > withinMs) return null;
  return data.storm;
}
function clearStorm(bridgeDir) {
  const data = loadLedger(bridgeDir);
  if (data.storm === void 0) return;
  const next = { version: 1, items: data.items, sessions: data.sessions, ruleSessions: data.ruleSessions };
  saveLedger(bridgeDir, next);
}

// src/changelog.ts
var import_obsidian9 = require("obsidian");

// src/changelog-data.ts
var PLUGIN_CHANGELOG = [
  {
    version: "2.9.5",
    items: [
      [
        "**\u4FEE\u590D DSH 0.2.2 \u4E0B\u5185\u5D4C\u9762\u677F\u62A5 401**\uFF1ADSH 0.2.2 \u628A\u9996\u9875\u9274\u6743\u6539\u6210 Fetch \u8BF7\u6C42\u540E\uFF0C\u5185\u5D4C\u9762\u677F\u88AB\u8BEF\u5224\u4E3A\u672A\u8BA4\u8BC1\u5E76\u663E\u793A `dsh web authentication required`\uFF0C\u73B0\u5DF2\u6062\u590D\u76F4\u51FA\u9762\u677F",
        "**Fixes the embedded panel 401 on DSH 0.2.2**: after DSH 0.2.2 moved index authorization to a Fetch request, the panel was treated as unauthenticated and showed `dsh web authentication required`; it now loads again"
      ],
      [
        "**\u767B\u8BB0 DSH 0.2.2-rc.1 \u5B9E\u6D4B\u9002\u914D**\uFF1A\u5B9E\u6D4B\u533A\u95F4\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8\uFF0C\u8BBE\u7F6E\u9875\u7684\u9002\u914D\u72B6\u6001\u4E0E\u8BF4\u660E\u540C\u6B65\u66F4\u65B0",
        "**Registered DSH 0.2.2-rc.1 as tested-supported**: the verified upper bound moves up accordingly and the compatibility status in settings follows"
      ],
      [
        "**\u8BBE\u7F6E\u9875\u300C\u624B\u673A\u8BBF\u95EE\u914D\u7F6E\u300D\u6539\u4E3A\u300C\u8FDC\u7A0B\u8BBF\u95EE\u914D\u7F6E\u300D**\uFF1A\u4F7F\u7528\u8BF4\u660E\u6539\u4E3A\u300C\u624B\u673A\u8FDC\u7A0B\u8BBF\u95EE\u793A\u4F8B\u300D\uFF0C\u6309\u793A\u4F8B\u6B65\u9AA4\u5373\u53EF\u5728\u624B\u673A\u4E0A\u6253\u5F00 DSH",
        '**Renamed "Mobile access setup" to "Remote access setup"**: the how-it-works dialog is now a phone remote-access example you can follow step by step'
      ],
      [
        "**\u5185\u5D4C\u754C\u9762\u4E0D\u53EF\u7528\u65F6\u65B0\u589E\u300C\u56DE\u9000\u5230\u9002\u914D\u7248\u672C DSH\u300D**\uFF1A\u5728\u8BE5\u9875\u786E\u8BA4\u540E\u81EA\u52A8\u5B89\u88C5\u5DF2\u9A8C\u8BC1\u7248\u672C\u5E76\u91CD\u542F\u670D\u52A1\uFF0C\u65E0\u9700\u81EA\u5DF1\u6267\u884C npm \u547D\u4EE4",
        "**New one-click fallback to an adapted DSH version when the panel is unavailable**: confirm on that page and the verified version is installed and the service restarted, with no manual npm command"
      ]
    ]
  },
  {
    version: "2.9.4",
    items: [
      [
        "**\u66F4\u65B0\u63D0\u793A\u6539\u4E3A\u4EE5\u5B98\u65B9 GitHub \u53D1\u5E03\u4E3A\u51C6**\uFF1Anpm \u4E0A\u53EF\u80FD\u5148\u4E8E\u5B98\u65B9\u4ED3\u5E93\u6536\u5230\u9884\u53D1\u5E03\uFF08`next` \u6807\u7B7E\uFF0C\u4F8B\u5982 0.2.1-rc.4\u2014\u2014npm \u5DF2\u6709\u3001\u5B98\u65B9\u4ED3\u5E93\u8FDE tag \u90FD\u6CA1\u6709\uFF09\uFF0C\u6B64\u524D\u63D2\u4EF6\u8BFB\u53D6 npm \u5168\u90E8 dist-tag \u4F1A\u628A\u5B83\u5F53\u5347\u7EA7\u76EE\u6807\u63A8\u7ED9\u4F60\uFF1B\u73B0\u5728\u81EA\u52A8\u68C0\u67E5\u4E0E\u624B\u52A8\u68C0\u67E5\u90FD\u4F1A\u5148\u6BD4\u5BF9\u5B98\u65B9\u4ED3\u5E93\u6700\u65B0 release\uFF0C\u76EE\u6807\u9AD8\u4E8E\u8BE5 release \u65F6**\u4E0D\u63D0\u793A**\uFF0C\u5B98\u65B9 release \u65B0\u4E8E\u672C\u5730\u65F6\u4EE5\u5B83\u4E3A\u5347\u7EA7\u76EE\u6807\uFF1B\u5B98\u65B9 release \u67E5\u8BE2\u4E0D\u901A\uFF08\u65AD\u7F51/\u955C\u50CF\u4E5F\u4E0D\u901A\uFF09\u65F6\u56DE\u9000\u6309 npm \u5224\u5B9A\uFF0C\u4E0D\u4F1A\u56E0\u6B64\u6C38\u4E45\u5173\u95ED\u66F4\u65B0",
        "**Update prompts now follow the official GitHub releases**: npm can receive a prerelease before the official repo does (the `next` tag \u2014 e.g. 0.2.1-rc.4 exists on npm while the repo has no tag for it). The plugin used to read every npm dist-tag and offer it as the update target; both the automatic and the manual check now compare against the latest official release first \u2014 if the npm target is newer than that release, **no prompt is shown**; if the official release is newer than your version, it becomes the update target. When the release query is unreachable (offline, or the mirror too), the npm-based check is used as a fallback, so updates are never disabled permanently"
      ],
      [
        "**\u767B\u8BB0 DSH 0.2.1-rc.4 \u5B9E\u6D4B\u9002\u914D**\uFF1A\u9694\u79BB\u5B89\u88C5\u540E\u6C99\u76D2\u516D\u5957\u5168\u7EFF\uFF08\u5D4C\u5165\u8BA4\u8BC1 11 \u9879\u96F6\u5931\u8D25\u3001\u591A profile \u4E0E\u8FDB\u7A0B\u5B89\u5168 34/34\u3001\u4F1A\u8BDD\u6E90 kind \u51C6\u5165 5/5\u3001\u4F1A\u8BDD\u4FEE\u590D 294 \u4F1A\u8BDD PASS\u3001setDraft \u7AEF\u5230\u7AEF 17/17\u3001\u5305\u6A21\u5F0F 10/10\uFF09\uFF0C\u4E0E rc.3 \u7684 28 \u4E2A\u89E6\u70B9\u96F6\u6F02\u79FB\uFF08GONE=0 / moved=0\uFF09\uFF0C\u5B9E\u6D4B\u533A\u95F4\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8\u4E3A 0.2.1-rc.4\uFF1B\u8BE5\u7248\u5C1A\u672A\u5728\u5B98\u65B9\u4ED3\u5E93\u53D1\u5E03\uFF0C\u6309\u4E0A\u9762\u7684\u95E8\u7981\u4E0D\u4F1A\u4E3B\u52A8\u63A8\u9001",
        "**Registered DSH 0.2.1-rc.4 as tested-supported**: an isolated install passed all six sandbox suites (11/11 embedded auth with zero failures, 34/34 multi-profile and process safety, 5/5 source-kind admission, session repair PASS over 294 sessions, 17/17 setDraft end-to-end, 10/10 package mode) with zero seam drift against rc.3 (GONE=0 / moved=0), so the verified upper bound moves up to 0.2.1-rc.4. That version is not published on the official repo yet, so the gate above will not push it"
      ]
    ]
  },
  {
    version: "2.9.3",
    items: [
      [
        "**\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9\u4F1A\u81EA\u52A8\u91CD\u542F\u5E76\u5237\u65B0\u9762\u677F**\uFF1A\u65E7\u5B9E\u4F8B\u4ECD\u7ED1\u5728\u5C40\u57DF\u7F51\u5730\u5740\u4E0A\uFF0C\u4EE5\u524D\u56DE\u9000\u8BBE\u7F6E\u540E\u8981\u624B\u52A8\u70B9\u300C\u91CD\u542F\u670D\u52A1\u300D\uFF1B\u73B0\u5728\u786E\u8BA4\u56DE\u9000\u540E\u63D2\u4EF6\u81EA\u52A8\u91CD\u542F\u670D\u52A1\u3001\u9762\u677F\u5207\u56DE `http://127.0.0.1:3080`\u3002\u5916\u90E8\u6D4F\u89C8\u5668\u91CC\u5DF2\u7ECF\u6253\u5F00\u7684\u65E7\u9875\u9762\u65E0\u6CD5\u88AB\u63D2\u4EF6\u6539\u5199\uFF0C\u9700\u624B\u52A8\u5173\u95ED\u540E\u91CD\u65B0\u6253\u5F00",
        "**Resetting endpoint defaults now restarts the service and reloads the panel automatically**: the old instance is still bound to the LAN address, so reverting used to require a manual restart. After the confirmation the plugin restarts the service and brings the panel back to `http://127.0.0.1:3080`. An already-open external browser tab cannot be rewritten by the plugin \u2014 close and reopen it"
      ]
    ]
  },
  {
    version: "2.9.2",
    items: [
      [
        "**\u4FEE\u590D\u81EA\u5B9A\u4E49\u542F\u52A8\u547D\u4EE4\u5BFC\u81F4\u300C\u670D\u52A1\u5730\u5740 / \u534F\u8BAE / TLS\u300D\u4E0D\u751F\u6548**\uFF1A\u4E00\u952E\u68C0\u6D4B\u914D\u7F6E\u5199\u5165\u7684 `dsh web --port {port} --no-open` \u7B49\u547D\u4EE4\u4EE5\u524D\u88AB\u539F\u6837\u4F7F\u7528\uFF0CDSH \u4ECD\u7ED1 127.0.0.1 \u660E\u6587\uFF0C\u63D2\u4EF6\u5374\u6309 https/\u5C40\u57DF\u7F51 IP \u63A2\u6D3B \u21D2 \u62C9\u4E0D\u8D77\u670D\u52A1\u3001\u6D4F\u89C8\u5668\u6253\u5F00\u4E5F\u4E0D\u662F https\uFF1B\u73B0\u5728\u81EA\u5B9A\u4E49\u547D\u4EE4\u540C\u6837\u53EA\u8865\u7F3A\u5931\u7684 `--host` / `--tls-cert` / `--tls-key`\uFF08\u5DF2\u6709\u540C\u540D\u53C2\u6570\u4E0D\u8986\u76D6\uFF09",
        "**Fixes a custom startup command silently overriding the endpoint settings**: a detected command such as `dsh web --port {port} --no-open` used to be used verbatim, so DSH kept listening on plain HTTP at 127.0.0.1 while the plugin probed https on the LAN IP \u2014 the service appeared unable to start and the browser URL was not https. Custom commands now get only the missing `--host` / `--tls-cert` / `--tls-key` appended (existing flags win)"
      ],
      [
        "**\u624B\u673A\u8BBF\u95EE\u751F\u6210\u524D\u7684\u51B2\u7A81\u68C0\u6D4B**\uFF1A\u542F\u52A8\u547D\u4EE4\u5DF2\u5199\u6B7B `--host`\uFF08\u4E0E\u5C40\u57DF\u7F51 IP \u4E0D\u4E00\u81F4\uFF09\u6216 `--tls-*` \u65F6\uFF0C\u751F\u6210\u4F1A\u76F4\u63A5\u63D0\u793A\u5148\u6539\u547D\u4EE4\uFF08\u8BBE\u7F6E\u4E0E\u6587\u4EF6\u90FD\u4E0D\u52A8\uFF09\uFF0C\u907F\u514D\u751F\u6210\u5B8C\u624D\u53D1\u73B0\u8FDE\u4E0D\u4E0A\uFF1B\u8BBE\u7F6E\u9875\u5728 `--host` \u4E0E\u300C\u670D\u52A1\u5730\u5740\u300D\u4E0D\u4E00\u81F4\u65F6\u663E\u793A\u544A\u8B66",
        "**Conflict checks before generating phone access settings**: if the startup command pins a different `--host` or already carries `--tls-*`, generation stops with a clear message (nothing is changed) instead of failing after the fact; the settings page also warns when a pinned `--host` disagrees with Service address"
      ],
      [
        "**\u542F\u52A8\u547D\u4EE4\u8BF4\u660E\u540C\u6B65\u66F4\u65B0**\uFF1A\u5199\u660E\u300C\u4FDD\u7559\u4F60\u7684\u53C2\u6570\u3001\u63D2\u4EF6\u53EA\u8865\u7F3A\u5931\u7684\u7AEF\u70B9\u53C2\u6570\u300D\uFF0C\u5E2E\u52A9\u5F39\u7A97\u7684\u9650\u5236\u8BF4\u660E\u540C\u6B65",
        "**Updated startup-command help**: the hint now states that your arguments are kept and only missing endpoint flags are appended; the help dialog reflects the same"
      ],
      [
        "**\u4F7F\u7528\u8BF4\u660E\u65B0\u589E\u624B\u673A\u8FDE\u63A5\u5168\u6D41\u7A0B\uFF08\u542B token \u83B7\u53D6\uFF09**\uFF1A\u4ECE\u751F\u6210\u3001\u88C5\u4FE1\u4EFB\u6839\u3001\u91CD\u542F\u670D\u52A1\uFF0C\u5230\u53D6 token \u94FE\u63A5\uFF08\u300C\u590D\u5236 token \u94FE\u63A5\u300D\u6309\u94AE\u6216\u542F\u52A8\u65E5\u5FD7 `dsh-web-out-<\u7AEF\u53E3>.log`\uFF09\uFF0C\u518D\u5230\u624B\u673A\u540C Wi-Fi\u3001\u88C5 CA\u3001\u6253\u5F00\u94FE\u63A5\uFF0C\u5E76\u8BF4\u660E token \u6BCF\u6B21\u91CD\u542F\u90FD\u4F1A\u91CD\u65B0\u751F\u6210",
        '**How it works now includes the full phone connection flow (token included)**: generate \u2192 install the trust root \u2192 restart the service \u2192 obtain the token link ("Copy token link" or the launch log `dsh-web-out-<port>.log`) \u2192 same Wi-Fi, install the CA, open the link \u2014 plus the note that the token is regenerated on every restart'
      ],
      [
        "**\u65B0\u589E\u300C\u590D\u5236 token \u94FE\u63A5\u300D\u6309\u94AE**\uFF1A\u5FEB\u6377\u64CD\u4F5C\u91CC\u7684\u6D4F\u89C8\u5668\u884C\u591A\u4E00\u4E2A\u590D\u5236\u6309\u94AE\uFF0C\u76F4\u63A5\u590D\u5236\u542F\u52A8\u65E5\u5FD7\u4E2D\u7684\u5B8C\u6574 token \u94FE\u63A5\uFF1B\u6D4F\u89C8\u5668\u8DF3\u8F6C\u540E\u5730\u5740\u680F\u4F1A\u4E22\u6389 `?token=`\uFF0C\u4ECE\u5730\u5740\u680F\u590D\u5236\u4F1A\u5F97\u5230\u88F8\u5730\u5740\u3001\u624B\u673A\u6253\u5F00\u5C31\u62A5 `dsh web authentication required`",
        '**New "Copy token link" button**: the browser row in Quick actions now copies the full token link from the launch log. After the browser redirect the address bar drops `?token=`, so copying it there yields a bare address and the phone shows `dsh web authentication required`'
      ],
      [
        "**\u751F\u6210\u65F6\u81EA\u52A8\u4FE1\u4EFB\u8BC1\u4E66\uFF08Windows\uFF09**\uFF1A\u5B89\u88C5\u6839\u8BC1\u4E66\u5230\u5F53\u524D\u7528\u6237\u300C\u53D7\u4FE1\u4EFB\u7684\u6839\u8BC1\u4E66\u9881\u53D1\u673A\u6784\u300D\uFF08certutil -user\uFF0C\u514D\u7BA1\u7406\u5458\uFF09\uFF0CObsidian \u5185\u5D4C\u9762\u677F\u4E0D\u518D\u9700\u8981\u624B\u52A8\u5BFC\u5165\uFF1BmacOS \u4ECD\u9700\u6309\u5F39\u7A97\u6B65\u9AA4\u624B\u52A8\u4FE1\u4EFB",
        `**Certificate is trusted automatically on generation (Windows)**: the root is installed into the current user's "Trusted Root Certification Authorities" (certutil -user, no admin), so the embedded Obsidian panel needs no manual import; macOS still requires the manual trust steps in the dialog`
      ]
    ]
  },
  {
    version: "2.9.1",
    items: [
      [
        "**\u65B0\u589E\u300C\u624B\u673A\u8BBF\u95EE\u914D\u7F6E\u300D**\uFF1A\u4F4D\u4E8E\u300C\u670D\u52A1\u8FD0\u884C\u300D\u5206\u7EC4\u6700\u4E0A\u65B9\uFF0C\u4E00\u952E\u751F\u6210\u672C\u673A HTTPS \u81EA\u7B7E\u8BC1\u4E66\uFF0C\u81EA\u52A8\u586B\u597D\u670D\u52A1\u5730\u5740\uFF08\u5C40\u57DF\u7F51 IP\uFF09/ \u534F\u8BAE\uFF08https\uFF09/ \u8BC1\u4E66\u4E0E\u79C1\u94A5\u8DEF\u5F84\uFF0C\u5E76\u628A rootCA.pem \u590D\u5236\u5230\u684C\u9762\u4F9B\u7535\u8111\u4E0E\u624B\u673A\u5B89\u88C5\u4FE1\u4EFB",
        "**New \u201CMobile access setup\u201D**: at the top of the Service runtime group, one click generates a local HTTPS self-signed certificate, fills in the service host (LAN IP) / protocol (https) / certificate and private-key paths, and copies rootCA.pem to the Desktop for trust installation on computer and phone"
      ],
      [
        "**\u751F\u6210\u524D\u540E\u90FD\u6709\u8BF4\u660E**\uFF1A\u70B9\u51FB\u5148\u770B\u98CE\u9669\u63D0\u793A\u4E0E\u5C06\u6267\u884C\u7684\u6B65\u9AA4\uFF08\u542B\u7535\u8111\u9700\u4FDD\u6301\u5F00\u673A\u3001\u4E0D\u7761\u7720\uFF09\uFF0C\u6210\u529F\u540E\u5F39\u7A97\u7ED9\u51FA Windows \u4FE1\u4EFB\u6839\u3001iOS \u4E0E\u5B89\u5353\u4E24\u5957\u5B89\u88C5\u6B65\u9AA4\u548C token \u94FE\u63A5\u6765\u6E90\uFF0C\u5E76\u53EF\u76F4\u63A5\u300C\u91CD\u542F\u670D\u52A1\u5E76\u751F\u6548\u300D",
        "**Guidance before and after**: the dialog first shows the risks and exact steps (including keeping the computer powered on and awake), then after success lists the Windows trust-store import, separate iOS and Android setup steps and where the token link comes from, with a one-click \u201CRestart service & apply\u201D"
      ],
      [
        "**\u53EF\u4E00\u952E\u6062\u590D\u9ED8\u8BA4\u7AEF\u70B9**\uFF1A\u628A\u56DB\u9879\u8FDE\u63A5\u8BBE\u7F6E\u9000\u56DE 127.0.0.1 / http / \u7A7A\u8BC1\u4E66\u8DEF\u5F84\uFF0C\u8BC1\u4E66\u6587\u4EF6\u4E0E\u7CFB\u7EDF\u6216\u624B\u673A\u91CC\u5DF2\u5B89\u88C5\u7684\u8BC1\u4E66\u4FE1\u4EFB\u90FD\u4E0D\u5220\u9664\u3001\u4E0D\u64A4\u9500",
        "**One-click reset of the endpoint defaults**: reverts the four connection settings to 127.0.0.1 / http / empty certificate paths without deleting certificate files or removing trust already installed on the system or phone"
      ]
    ]
  },
  {
    version: "2.9.0",
    items: [
      [
        "**\u652F\u6301\u81EA\u5B9A\u4E49\u670D\u52A1\u5730\u5740**\uFF1A\u53EF\u586B\u672C\u673A\u4EFB\u610F IPv4 / IPv6 \u5730\u5740\uFF08\u4E0E `dsh web --host` \u4E00\u81F4\uFF09\uFF0C\u63A2\u6D3B\u3001\u8BF7\u6C42\u4E0E\u9762\u677F\u90FD\u6309\u8BE5\u5730\u5740\u5DE5\u4F5C",
        "**Custom service host**: enter any local IPv4/IPv6 address (same as `dsh web --host`) and probing, requests and the panel all follow it"
      ],
      [
        "**\u652F\u6301\u539F\u751F HTTPS**\uFF1A\u586B\u8BC1\u4E66\u4E0E\u79C1\u94A5\u7684 PEM \u8DEF\u5F84\u540E\u6309 https \u8FDE\u63A5\uFF08\u9700 DSH \u2265 0.2.1-rc.2\uFF09\uFF0C\u81EA\u7B7E\u540D\u8BC1\u4E66\u7684\u4FE1\u4EFB\u6839\u4E0E\u63D2\u4EF6\u4FA7\u6821\u9A8C\u5728\u8BBE\u7F6E\u9875\u6709\u8BF4\u660E",
        "**Native HTTPS**: point the plugin at the certificate and key PEM paths to connect over https (DSH \u2265 0.2.1-rc.2); the settings page explains the trust store and plugin-side validation for self-signed certificates"
      ],
      [
        "**\u7AEF\u53E3\u5360\u7528\u8BC6\u522B\u652F\u6301\u4EFB\u610F\u672C\u673A\u7ED1\u5B9A\u5730\u5740**\uFF1A\u76D1\u542C\u5728 IPv6 \u6216\u6307\u5B9A\u7F51\u5361\u4E0A\u7684 DSH \u5B9E\u4F8B\u4E0D\u518D\u88AB\u5F53\u4F5C\u65E0\u5173\u8FDB\u7A0B",
        "**Port-owner detection works for any local binding**: a DSH instance listening on IPv6 or a specific interface is no longer treated as an unrelated process"
      ],
      [
        "**\u9ED8\u8BA4\u542F\u52A8\u547D\u4EE4\u81EA\u52A8\u9644\u52A0\u5730\u5740\u4E0E TLS \u53C2\u6570**\uFF1A\u53EA\u6709\u63D2\u4EF6\u81EA\u5DF1\u751F\u6210\u7684\u547D\u4EE4\u4F1A\u81EA\u52A8\u8865 `--host` / `--tls-cert` / `--tls-key`\uFF0C\u81EA\u5B9A\u4E49\u547D\u4EE4\u539F\u6837\u4F7F\u7528",
        "**The default startup command carries host and TLS flags automatically**: only the plugin-generated command gets `--host` / `--tls-cert` / `--tls-key`; a custom command is used verbatim"
      ],
      [
        "**\u65B0\u589E\u300C\u6D4B\u8BD5\u8FDE\u63A5\u300D\u8BCA\u65AD**\uFF1A\u8BBE\u7F6E\u9875\u4E00\u952E\u68C0\u67E5\u5F53\u524D\u5730\u5740\u4E0E\u534F\u8BAE\u80FD\u5426\u8FDE\u901A\uFF0C\u5E76\u533A\u5206\u672A\u542F\u52A8\u3001\u8D85\u65F6\u3001\u8BC1\u4E66\u672A\u53D7\u4FE1\u4EFB / \u5730\u5740\u4E0D\u5339\u914D / \u5DF2\u8FC7\u671F",
        "**New \u201CTest connection\u201D diagnostic**: the settings page checks whether the configured host and protocol are reachable and tells apart not running, timeout, and untrusted / mismatched / expired certificates"
      ],
      [
        "**README \u7CBE\u7B80**\uFF1A\u6BCF\u9879\u529F\u80FD\u4E00\u53E5\u8BDD\uFF0C\u7EC6\u8282\u79FB\u5165\u8BBE\u7F6E\u9875\u4E0E\u6545\u969C\u6392\u67E5\u533A",
        "**Leaner README**: one sentence per feature, with the details moved into the settings page and the troubleshooting section"
      ],
      [
        "**\u670D\u52A1\u8FD0\u884C\u8BBE\u7F6E\u91CD\u6392\u4E0E\u8BF4\u660E\u4F18\u5316**\uFF1A\u6309\u300C\u5730\u5740 \u2192 \u7AEF\u53E3 \u2192 \u534F\u8BAE \u2192 \u8BC1\u4E66 \u2192 \u8FD0\u884C\u5F00\u5173 \u2192 \u542F\u52A8\u547D\u4EE4\u300D\u6392\u5E8F\uFF0C\u6BCF\u9879\u6539\u4E3A\u4E00\u5230\u4E24\u53E5\u7684\u201C\u662F\u4EC0\u4E48\uFF0B\u7EA6\u675F\u201D\uFF0CTLS \u4E24\u9879\u6807\u660E\u4EC5 HTTPS \u4F7F\u7528",
        "**Reordered and clarified the service runtime settings**: host \u2192 port \u2192 protocol \u2192 certificates \u2192 runtime toggles \u2192 startup command, each described in one or two \u201Cwhat + constraint\u201D sentences, with the two TLS fields marked as HTTPS-only"
      ]
    ]
  },
  {
    version: "2.8.12",
    items: [
      [
        "**\u4FEE\u590D DSH 0.2.1-rc.2 \u5D4C\u5165\u8BA4\u8BC1\u56DE\u5F52**\uFF1A\u8BE5\u7248\u628A `/api` \u4E0E WebSocket \u5347\u7EA7\u6539\u4E3A\u76F4\u63A5\u8C03\u7528 `connection.admit()` \u9274\u6743\uFF0C\u800C\u6865\u63A5\u539F\u5148\u53EA\u5305 `requestRejection`\uFF0C\u5BFC\u81F4\u5D4C\u5165\u6A21\u5F0F\u4E0B\u6240\u6709\u63A5\u53E3 401\u3001\u804A\u5929\u4E0E\u63D2\u4EF6\u52A0\u8F7D\u6574\u4F53\u4E0D\u53EF\u7528\uFF1B\u6865\u63A5\u73B0\u5728\u6309\u540C\u4E00 token \u540C\u65F6\u5305\u88F9 `admit()`\uFF08fence 403 \u4E0E\u5DF2\u9500\u6BC1\u6001\u539F\u6837\u8FD4\u56DE\uFF09\uFF0C\u9762\u677F\u6062\u590D\u804A\u5929\u3001\u5DE5\u4F5C\u533A\u4E0E\u63D2\u4EF6\u52A0\u8F7D",
        "**Fixes the embedded-auth regression on DSH 0.2.1-rc.2**: that release routes `/api` and WebSocket upgrades through `connection.admit()` directly, while the bridge only wrapped `requestRejection`, so every embedded API call returned 401 and chat plus plugin loading were unusable. The bridge now wraps `admit()` with the same token as well (403 fence and disposed states pass through untouched), restoring chat, workspace and plugin loading in the panel"
      ],
      [
        "**\u767B\u8BB0 DSH 0.2.1-rc.2 \u4E3A\u5B9E\u6D4B\u9002\u914D\u7248\u672C**\uFF1A\u516D\u5957\u6C99\u76D2/\u5DE5\u5177\u94FE\u5B9E\u8DD1\u5168\u7EFF\uFF08\u5D4C\u5165\u8BA4\u8BC1 11 \u9879\u96F6\u5931\u8D25\u3001\u591A profile \u4E0E\u8FDB\u7A0B\u5B89\u5168 34/34\u3001setDraft \u7AEF\u5230\u7AEF 17/17\u3001\u6765\u6E90\u51C6\u5165 5/5\u3001\u5305\u6A21\u5F0F 10/10\u3001\u4F1A\u8BDD\u4FEE\u590D\u540C\u7248\u672C\u5206\u652F PASS\uFF09\u540E\u5B9E\u6D4B\u533A\u95F4\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8\uFF0C\u89E6\u70B9\u6307\u7EB9\u57FA\u7EBF\u540C\u6279\u91CD\u6293\uFF0828 \u9879\uFF0C\u65B0\u589E `connection.admit` \u4E13\u9879\u89E6\u70B9\uFF0C\u6587\u4EF6\u6570 1126\uFF09",
        "**Registered DSH 0.2.1-rc.2 as tested-supported**: after six sandbox/toolchain suites came back green (11/11 embedded auth with zero failures, 34/34 multi-profile and process safety, 17/17 setDraft end-to-end, 5/5 source-kind admission, 10/10 package mode, and the same-version session-repair branch PASS) the verified bound moves up, and the seam fingerprint baseline was re-captured in the same batch (28 seams, including a new dedicated `connection.admit` row; 1126 files)"
      ]
    ]
  },
  {
    version: "2.8.11",
    items: [
      [
        "**\u4FEE\u590D macOS \u4ECE Dock/\u8BBF\u8FBE\u542F\u52A8 Obsidian \u65F6\u670D\u52A1\u62C9\u4E0D\u8D77\u6765\uFF08`spawn npm ENOENT`\uFF09**\uFF1A\u8FD9\u7C7B\u5E94\u7528\u53EA\u7EE7\u627F\u7CFB\u7EDF\u6700\u5C0F PATH\uFF08\u4E0D\u542B Homebrew/nvm \u76EE\u5F55\uFF09\uFF0C\u63D2\u4EF6\u73B0\u5728\u4F1A\u5408\u5E76\u5E38\u89C1\u5DE5\u5177\u76EE\u5F55\u4E0E\u767B\u5F55 shell \u7684\u771F\u5B9E PATH\uFF0C\u5E76\u8BA9\u670D\u52A1\u62C9\u8D77\u3001\u4E00\u952E\u68C0\u6D4B\u3001\u4F9D\u8D56\u63A2\u6D4B\u3001\u66F4\u65B0\u68C0\u67E5\u3001\u4F1A\u8BDD\u4FEE\u590D\u7B49**\u6240\u6709**\u6267\u884C\u5916\u90E8\u547D\u4EE4\u7684\u8DEF\u5F84\u5171\u7528\u540C\u4E00\u4EFD\u5408\u5E76 PATH\uFF1BENOENT \u65F6\u8FD8\u4F1A\u81EA\u52A8\u5931\u6548\u7F13\u5B58\u91CD\u8BD5\u4E00\u6B21",
        "**Fixes the service failing to start on macOS when Obsidian is launched from the Dock/Finder (`spawn npm ENOENT`)**: such apps only inherit macOS\u2019s minimal PATH without Homebrew/nvm directories. The plugin now merges common tool directories and the real login-shell PATH, and every path that runs external commands (service start, one-click detect, dependency probes, update checks, session repair) shares that merged PATH; on ENOENT it also drops the cached PATH and retries once"
      ],
      [
        "**\u542F\u52A8\u65F6\u95EE\u4E00\u6B21\u767B\u5F55 shell \u7684\u771F\u5B9E PATH**\uFF1Anvm \u7684\u9ED8\u8BA4\u7248\u672C\u3001\u4EE5\u53CA\u4F60\u81EA\u5DF1 rc \u91CC\u8BBE\u7F6E\u7684 PATH \u56E0\u6B64\u4E5F\u80FD\u751F\u6548\uFF08\u5F02\u6B65\u30015 \u79D2\u4E0A\u9650\u3001\u5931\u8D25\u56DE\u843D\uFF0CWindows \u4E0D\u53D7\u5F71\u54CD\uFF09",
        "**Asks the login shell once for the real PATH at startup**: nvm\u2019s default version and PATH entries you set in your own shell rc now take effect too (async, 5s cap, graceful fallback; Windows is unaffected)"
      ],
      [
        "**\u62A5\u9519\u4E0D\u518D\u628A\u4EBA\u5F15\u5411\u7F51\u7EDC\u6216\u91CD\u88C5**\uFF1AmacOS \u4E0B\u7684 spawn \u5931\u8D25\u6587\u6848\u6539\u8BF4\u6E05\u300CGUI \u53EA\u7EE7\u627F\u6700\u5C0F PATH\u3001\u91CD\u542F Obsidian \u65E0\u6548\u300D\uFF0C\u7F3A git \u65F6\u4E5F\u4E0D\u4F1A\u518D\u5192\u5145\u300C\u65E0\u6CD5\u8FDE\u63A5 GitHub\u300D",
        "**Error messages no longer point at the network or a reinstall**: on macOS the spawn-failure hint now explains that a GUI app inherits only the minimal PATH and that restarting Obsidian does not help, and a missing git is no longer reported as \u201Ccannot reach GitHub\u201D"
      ]
    ]
  },
  {
    version: "2.8.10",
    items: [
      [
        "**\u4FEE\u590D\u5546\u5E97\u6E90\u7801\u5BA1\u67E5\u628A\u4E0A\u4E00\u7248\u5224\u4E3A\u672A\u901A\u8FC7**\uFF1A\u5BA1\u6838\u4E0D\u5141\u8BB8\u7981\u7528\u5E9F\u5F03 API \u68C0\u67E5\uFF0C\u672C\u7248\u6539\u7528\u4E0D\u9700\u8981\u4EFB\u4F55\u7981\u7528\u6307\u4EE4\u7684\u7B49\u4EF7\u5199\u6CD5\uFF0C\u63D2\u4EF6\u529F\u80FD\u4E0E\u754C\u9762\u4E0D\u53D8",
        "**Fixes the store review failing the previous release**: the reviewer does not allow suppressing the deprecated-API check, so that check is now satisfied without any suppression directive \u2014 plugin behaviour and UI are unchanged"
      ],
      [
        "**\u53D1\u5E03\u95E8\u7981\u591A\u52A0\u4E00\u9879\u81EA\u52A8\u68C0\u67E5**\uFF1A\u672C\u5730\u4E0E CI \u90FD\u4F1A\u62E6\u4E0B\u300C\u7528 eslint \u6307\u4EE4\u7981\u7528\u5E9F\u5F03 API \u68C0\u67E5\u300D\u7684\u5199\u6CD5\uFF0C\u9632\u6B62\u540C\u7C7B\u95EE\u9898\u518D\u6B21\u4E0A\u67B6",
        "**One more automated pre-release check**: local and CI gates now reject any eslint directive that suppresses the deprecated-API rule, so this class of review failure cannot come back"
      ]
    ]
  },
  {
    version: "2.8.9",
    items: [
      [
        "**\u5546\u5E97\u6E90\u7801\u5BA1\u67E5\u544A\u8B66\u6E05\u96F6**\uFF1AObsidian \u5BA1\u6838\u4FA7\u90A3\u4EFD 100 \u6761\u8B66\u544A\u5DF2\u5168\u90E8\u5904\u7406\uFF0C\u53EA\u5269\u4E00\u6761\u4E0D\u5F71\u54CD\u4E0A\u67B6\u7684\u58F0\u660E\u5F0F\u8BBE\u7F6E\u5EFA\u8BAE",
        "**Store review warnings cleared**: all 100 items from the Obsidian source review are handled, leaving only the non-blocking declarative-settings suggestion"
      ],
      [
        "**\u7834\u574F\u6027\u6309\u94AE\u4E0E\u8BBE\u7F6E\u9875\u5237\u65B0\u9002\u914D Obsidian 1.13**\uFF1A\u65B0\u7248\u672C\u7528\u5B98\u65B9\u65B0 API\uFF0C\u65E7\u7248\u672C\u81EA\u52A8\u9000\u56DE\u539F\u5199\u6CD5\uFF0C\u7EA2\u8272\u6309\u94AE\u4E0E\u6574\u9875\u91CD\u753B\u7684\u89C2\u611F\u884C\u4E3A\u4E0D\u53D8",
        "**Destructive buttons and settings repaint now support Obsidian 1.13**: the new API is used where available with an automatic fallback, so nothing looks or behaves differently"
      ],
      [
        "**\u9762\u677F\u5B9A\u65F6\u5668\u7EDF\u4E00\u8D70 window.\\***\uFF1A\u6740\u8FDB\u7A0B\u8F6E\u8BE2\u3001\u7B49\u7AEF\u53E3\u91CA\u653E\u4E0E\u5F00\u673A\u89E6\u70B9\u81EA\u68C0\u5728\u5F39\u51FA\u7A97\u53E3\u91CC\u4E5F\u4E0D\u518D\u4F9D\u8D56\u4E3B\u7A97\u53E3",
        "**Timers now go through `window.*`**: the kill polling, port-release wait and startup seam check no longer depend on the main window in popouts"
      ],
      [
        "**\u53D1\u5E03\u524D\u591A\u4E00\u9053\u5546\u5E97\u5BA1\u67E5\u590D\u73B0\u95E8\u7981 `npm run lint:review`**\uFF1A\u672C\u5730\u6309\u5BA1\u67E5\u6C99\u7BB1\u540C\u4E00\u89C6\u89D2\u8DD1\u4E00\u904D\uFF0C\u544A\u8B66\u4E0D\u518D\u7B49\u673A\u5668\u4EBA\u5148\u53D1\u73B0",
        "**New pre-release gate `npm run lint:review`**: reproduces the store reviewer's view locally so warnings surface before the bot finds them"
      ]
    ]
  },
  {
    version: "2.8.8",
    items: [
      [
        '**\u7248\u672C\u9002\u914D\u68C0\u67E5\u4E0D\u518D\u7B49\u4F60\u5F00\u53E3**\uFF1A\u672C\u673A DSH \u4E00\u65E6\u9AD8\u4E8E\u5B9E\u6D4B\u9002\u914D\u4E0A\u754C\uFF08\u4E14\u4E3A\u5DF2\u6838\u9A8C\u7684\u5168\u5C40\u5B98\u65B9\u5B89\u88C5\uFF09\uFF0C\u63D2\u4EF6\u5F00\u673A\u540E\u81EA\u52A8\u5BF9\u5B89\u88C5\u6811\u8DD1\u4E00\u6B21**\u53EA\u8BFB\u89E6\u70B9\u81EA\u68C0**\u2014\u2014\u6309\u767B\u8BB0\u8BE5\u4E0A\u754C\u65F6\u6293\u7684 27 \u9879\u89E6\u70B9\u6307\u7EB9\u9010\u9879\u6838\u5BF9\u7B26\u53F7\u662F\u5426\u4ECD\u5728\u3002\u7ED3\u8BBA\u4E00\u53E5\u8BDD\u8FFD\u52A0\u5728\u8BBE\u7F6E\u9875\u300C\u5F53\u524D\u9002\u914D\u72B6\u6001\u300D\u884C\u5C3E\uFF08\u4E5F\u968F\u300CDSH\u7248\u672C\u9002\u914D\u8BF4\u660E\u300D\u53EF\u67E5\uFF09\uFF1A\u5168\u5728/\u6709\u51FA\u5165/\u6709\u6D88\u5931/\u672A\u6267\u884C\u3002**\u4ECD\u4E0D\u5F39\u4EFB\u4F55\u7A97**\uFF1B"\u89E6\u70B9\u5168\u5728"\u4E0D\u6784\u6210\u9002\u914D\u767B\u8BB0\uFF08\u767B\u8BB0\u89C4\u77E9\u4E0D\u53D8\uFF0C\u4ECD\u987B\u6C99\u76D2\u5B9E\u8DD1\uFF09\uFF0C"\u89E6\u70B9\u6D88\u5931"\u53EA\u662F\u63D0\u524D\u9884\u8B66',
        '**Compatibility checks no longer wait on you**: whenever the local DSH is newer than the verified upper bound (and comes from a verified official global install), the plugin now runs a **read-only seam self-check** after startup against the 27 integration-seam fingerprint taken when that bound was registered. The verdict is appended to the settings "current compatibility" row (also visible in the compatibility note): all present / changed / missing / not run. **Still never a dialog**; "all present" is not a support registration (the sandbox-run rule stands), "missing" is an early warning only'
      ],
      [
        "**\u66F4\u65B0\u5F39\u7A97\u4E0D\u518D\u529D\u9000\u9884\u89C8\u7248**\uFF1A\u6807\u9898\u4E0E\u6B63\u6587\u53EA\u9648\u8FF0\u300C\u975E\u6B63\u5F0F\u7248\u300D\u4E8B\u5B9E\uFF0C\u5220\u6389\u300C\u6709\u98CE\u9669 / \u9884\u89C8\u7248\u4E0D\u7A33\u5B9A\uFF0C\u53EF\u80FD\u4E0E\u63D2\u4EF6\u51B2\u7A81\u5BFC\u81F4\u670D\u52A1\u5D29\u6E83 / \u5EFA\u8BAE\u7B49\u6B63\u5F0F\u7248\u300D\u4E00\u7C7B\u63AA\u8F9E\uFF08\u7528\u6237\u5B9A\u6848\uFF09\uFF1B\u300C\u66F4\u65B0\u4F1A\u5148\u7ED3\u675F\u6240\u6709 DSH \u8FDB\u7A0B\u300D\u7684\u64CD\u4F5C\u540E\u679C\u9884\u544A\u4FDD\u7559",
        '**The update dialog no longer talks you out of prereleases**: the title and body now only state the fact that it is not a stable release \u2014 the "risky / unstable, may crash the service / wait for a stable release" wording is gone (user decision). The factual note that updating stops all DSH processes first stays'
      ],
      [
        "**DSH \u66F4\u65B0\u5F39\u7A97\u7684\u9002\u914D\u8BF4\u660E\u6539\u4E3A\u8DDF\u767B\u8BB0\u8D70**\uFF1A\u539F\u5148\u5199\u6B7B\u300CDSH 0.1.5 \u7CFB\u5DF2\u5B9E\u6D4B\u9002\u914D\u300D\u4E00\u7C7B\u65E7\u6587\u6848\uFF08\u4E0A\u754C\u65E9\u5DF2\u62AC\u5230 0.2.0\uFF09\uFF0C\u73B0\u5728\u6309\u63D2\u4EF6\u5224\u5B9A\u7B49\u7EA7\u751F\u6210\u2014\u2014\u533A\u95F4\u5185\u6CE8\u660E\u5B9E\u6D4B\u533A\u95F4\u3001\u9AD8\u4E8E\u4E0A\u754C\u5982\u5B9E\u6807\u6CE8\u300C\u5C1A\u672A\u767B\u8BB0\u5B9E\u6D4B\u300D\u5E76\u9884\u544A\u5F00\u673A\u53EA\u8BFB\u89E6\u70B9\u81EA\u68C0\u3001\u65E7\u7248\uFF08\u22640.1.1\uFF09\u8BF4\u660E\u7F3A\u54EA\u4E9B\u524D\u63D0\uFF1B\u767B\u8BB0\u65B0 DSH \u7248\u672C\u540E\u5F39\u7A97\u6587\u5B57\u81EA\u52A8\u8DDF\u4E0A\uFF0C\u4E0D\u518D\u9700\u8981\u624B\u6539\u6587\u6848",
        `**The update dialog's compatibility note now follows registration**: the old hard-coded "DSH 0.1.5 is verified" text (long after the bound moved to 0.2.0) is gone \u2014 the note is generated from the plugin's own verdict: inside the range it quotes the verified range; above the bound it honestly says "not yet registered" and previews the read-only seam self-check; a legacy target (\u22640.1.1) gets the missing-prerequisites note. Registering a new DSH version updates the dialog text automatically`
      ],
      [
        "**\u767B\u8BB0 DSH 0.2.0-rc.2 \u4E3A\u5B9E\u6D4B\u9002\u914D\u7248\u672C**\uFF1A\u9694\u79BB\u5B89\u88C5\uFF08\u5B98\u65B9\u6E90\uFF1Bnpmmirror \u5F53\u65F6\u7F3A\u5B50\u5305\uFF09\u540E\u516D\u5957\u6C99\u76D2\u5168\u7EFF\u2014\u201427 \u89E6\u70B9 GONE=0\u3001\u4EC5 `agent.inbox` \u8BA1\u6570\u4E0A\u79FB\uFF08\u4E0A\u6E38\u628A inbox \u7528\u6CD5\u6269\u5230\u65B0\u6587\u4EF6\uFF0C\u7B26\u53F7\u4FF1\u5728\u4E14\u884C\u4E3A\u7ECF\u6765\u6E90\u51C6\u5165\u4E0E setDraft \u7AEF\u5230\u7AEF\u5B9E\u8BC1\uFF09\uFF0C\u591A profile/\u8FDB\u7A0B\u5B89\u5168 34/34\u3001\u8BA4\u8BC1\u77E9\u9635 11 \u9879\u96F6\u5931\u8D25\u3001\u4F1A\u8BDD\u4FEE\u590D 232 \u4F1A\u8BDD\u53EA\u8BFB\u9884\u68C0\u8DD1\u901A\u3001setDraft \u771F\u673A 17/17\uFF1B\u5B9E\u6D4B\u533A\u95F4\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8\uFF0C\u89E6\u70B9\u6307\u7EB9\u57FA\u7EBF\u540C\u6279\u91CD\u6293",
        "**Registered DSH 0.2.0-rc.2 as tested-supported**: an isolated official-registry install passed all six sandbox suites \u2014 27 seams with nothing gone (only agent.inbox counts moved, 31\u219235 across 2 new files, symbols intact and the behaviour proven by the source-kind and setDraft end-to-end runs), 34/34 multi-profile/process safety, 11 auth-matrix checks with zero failures, session repair pre-checked 232 sessions read-only, and setDraft scored 17/17. The verified range moves up and the seam fingerprint baseline was re-captured in the same batch"
      ],
      [
        '**\u767B\u8BB0\u65B0 DSH \u7248\u672C\u65F6\u57FA\u7EBF\u6307\u7EB9\u5FC5\u987B\u540C\u6279\u91CD\u6293**\uFF1A\u89E6\u70B9\u8868\uFF08id+\u6B63\u5219\uFF09\u4E0E\u5F00\u53D1\u6BD4\u5BF9\u5DE5\u5177 `dsh-compat-diff.mjs` \u9010\u9879\u9501\u5B9A\u3001\u6307\u7EB9\u57FA\u7EBF\u7248\u672C\u4E0E\u5B9E\u6D4B\u4E0A\u754C\u4E00\u81F4\u7531\u5355\u6D4B\u4E0E verify-profile S3.8 \u53CC\u9501\u2014\u2014\u4E0A\u63A8\u4E0A\u754C\u5FD8\u4E86\u91CD\u6293\u57FA\u7EBF\uFF0C\u6D4B\u8BD5\u76F4\u63A5\u7EA2\uFF0C\u4E0D\u4F1A\u51FA\u73B0"\u62FF\u65E7\u6307\u7EB9\u5224\u65B0\u7248"\u7684\u5047\u7EFF',
        "**Re-capture the seam fingerprint with every new registration**: the seam table (ids + regexes) is locked item-by-item against the dev tool `dsh-compat-diff.mjs`, and the fingerprint version must equal the verified upper bound \u2014 checked by unit tests and verify-profile S3.8, so bumping the bound without re-capturing the baseline now fails loudly instead of silently judging new versions against old fingerprints"
      ]
    ]
  },
  {
    version: "2.8.7",
    items: [
      [
        '**\u4FEE\u6389\u300C\u53D6\u6D88\u6846\u9009\u540E\u9690\u5F0F\u884C\u4E0D\u6D88\u5931\u3001\u8FD8\u8DDF\u7740\u6D88\u606F\u4E00\u8D77\u53D1\u51FA\u53BB\u300D**\uFF1A\u7126\u70B9\u8FDB\u5165\u9762\u677F\u7684\u90A3\u4E00\u6B21\u9009\u533A\u4E8B\u4EF6\u4E0D\u518D\u88AB\u6574\u4E2A\u4E22\u5F03\uFF08\u5B98\u65B9\u6A21\u578B\u5C42\u53EF\u7528\u65F6\u5F53\u573A\u6E05\u9664\uFF0C\u53EA\u6709 DOM \u8DEF\u5F84\u624D\u63A8\u8FDF\u5230\u7126\u70B9\u4EA4\u56DE\u7B14\u8BB0\u4FA7\u65F6\u8865\u505A\uFF09\uFF1B\u586B\u5145\u5931\u8D25\u65F6\u4E5F\u4E0D\u518D\u8C0E\u62A5"\u5DF2\u7ECF\u586B\u8FC7"\uFF0C\u4E4B\u540E\u6846\u9009\u540C\u4E00\u6BB5\u4ECD\u4F1A\u6B63\u5E38\u6CE8\u5165',
        "**Fixed the bridge line surviving a deselection and being sent along with the next message**: the selection event that fires when focus moves into the panel is no longer dropped outright (cleared on the spot when the official model-layer write is available, otherwise replayed the moment focus returns to the note), and a failed fill no longer makes the plugin believe the draft is already in place \u2014 reselecting the same text still injects it"
      ],
      [
        "**\u957F\u4F1A\u8BDD\u4E0B\u6865\u63A5\u66F4\u7701\u3001\u6545\u969C\u66F4\u53EF\u67E5**\uFF1A\u754C\u9762\u91C7\u6837\u6539\u6761\u4EF6\u4E0A\u62A5\u5E76\u6309\u72B6\u6001\u81EA\u9002\u5E94\u8282\u594F\u3001\u53CC\u94FE\u6CE8\u89E3\u6539\u6279\u91CF\u5408\u5E76\u3001\u6309\u952E\u4E0D\u518D\u9010\u6B21\u6253\u65E5\u5FD7\uFF1B\u8BCA\u65AD\u65E5\u5FD7\u62C6\u6210\u4E8B\u4EF6\u4E0E\u5FC3\u8DF3\u4E24\u4E2A\u6587\u4EF6\uFF08\u91C7\u6837\u4E0D\u518D\u628A\u6545\u969C\u73B0\u573A\u6324\u6389\uFF09\uFF1B\u6CE8\u5165\u53F0\u8D26\u6539\u539F\u5B50\u5199\u3001\u8BFB\u574F\u65F6\u7559\u75D5\uFF0C\u5BBF\u4E3B\u4E0E\u6865\u63A5\u4E24\u4FA7\u90FD\u4E0D\u4F1A\u518D\u9759\u9ED8\u5931\u53BB\u53BB\u91CD\u9632\u7EBF",
        "**Lighter on long sessions, easier to diagnose**: UI sampling is now conditional with a state-aware cadence, wikilink annotation is batched, keystrokes no longer log one by one; the diagnostic log is split into an events channel and a heartbeat channel so sampling can no longer flush the incident out of the 64KB window; and the injection ledger is written atomically with corruption now recorded, so neither side silently loses its dedupe guard"
      ],
      [
        "**\u4FEE\u6389\u804A\u5929\u6846\u5DF2\u6709\u6587\u5B57\u65F6\u7684\u4E09\u4E2A\u6865\u63A5\u95EE\u9898**\uFF1A\u53CD\u590D\u6846\u9009\u53EF\u80FD\u628A\u7528\u6237\u5DF2\u7ECF\u6253\u7684\u5B57\u6E05\u7A7A\uFF08\u6E05\u7A7A\u540E\u5199\u56DE\u5931\u8D25\u4E0D\u518D\u76F4\u63A5\u653E\u5F03\uFF0C\u5148\u628A\u539F\u6587\u5B57\u653E\u56DE\u518D\u62A5\u5931\u8D25\uFF09\uFF1B\u9690\u5F0F\u884C\u4E0D\u518D\u4E0E\u6B63\u6587\u7C98\u5728\u540C\u4E00\u884C\uFF08\u5206\u884C\u5224\u636E\u6539\u4E3A\u300C\u8BE5\u884C\u662F\u5426\u72EC\u5360\u4E00\u4E2A\u6BB5\u843D\u300D\u7684\u7ED3\u6784\u5224\u5B9A\uFF0C\u65E7\u5224\u636E\u5728\u6B63\u6587\u81EA\u5E26\u6362\u884C\u65F6\u6052\u4E3A\u771F\uFF09\uFF1B\u53D6\u6D88\u6846\u9009\u4E0D\u518D\u9057\u7559\u7A7A\u884C\uFF08\u5220\u9664\u533A\u95F4\u5403\u6389\u7D27\u968F\u7684\u6362\u884C\uFF0C\u5220\u5B8C\u518D\u6536\u4E00\u6B21\u7A7A\u767D\u5E76\u590D\u6838\uFF09",
        "**Fixed three bridge bugs that only show up when the composer already has text**: repeated selections could wipe out the text already typed (a failed write-back now restores it instead of giving up after clearing); the bridge line no longer shares one line with the body text (the check is structural now \u2014 whether the line owns its block \u2014 where the old one was always true whenever the user text itself contained a newline); and deselecting no longer leaves a blank line (the delete range eats the trailing newline, with one extra cleanup pass before re-checking)"
      ],
      [
        '**\u804A\u5929\u6846\u5DF2\u6709\u6587\u5B57\u65F6\uFF0C\u6CE8\u5165\u6539\u8D70\u5B98\u65B9\u6A21\u578B\u5C42\u4E00\u6B21\u5199\u5165\uFF08\u660E\u663E\u66F4\u5FEB\uFF0C\u6362\u884C\u7531\u7F16\u8F91\u5668\u81EA\u5DF1\u4FDD\u8BC1\uFF09**\uFF1A\u653E\u5F00\u539F\u5148"\u6846\u5185\u6709\u5B57\u5C31\u4E0D\u505A\u6574\u4F53\u66FF\u6362"\u7684\u9650\u5236\uFF0C\u4EE3\u4E4B\u4EE5\u9010\u5B57\u57FA\u7EBF\u590D\u6838\uFF0B\u5206\u884C\u7ED3\u6784\u590D\u6838\uFF1B\u590D\u6838\u4E0D\u8FC7\u5C31\u5148\u628A\u804A\u5929\u6846\u6062\u590D\u6210\u5199\u5165\u524D\u7684\u5185\u5BB9\u518D\u8D70 DOM \u8DEF\u5F84\uFF0C\u7EDD\u4E0D\u628A\u6CA1\u6210\u529F\u7684\u5199\u5165\u62A5\u6210\u6210\u529F',
        '**Selecting now goes through the official model-layer write even when the composer already holds text (clearly faster, and the line break comes from the editor itself)**: the old "never replace while user text exists" gate is gone, replaced by a verbatim baseline check plus a block-structure check; if either fails the composer is restored to exactly what it was before the write and the DOM path takes over \u2014 a write that did not land is never reported as a success'
      ],
      [
        "**\u4FEE\u6389\u300C\u591A\u6B21\u6846\u9009\u540E\u8D8A\u70B9\u8D8A\u4E71\u3001\u6700\u540E\u804A\u5929\u6846\u4E00\u7247\u7A7A\u767D\u300D**\uFF1A\u65B0\u4E00\u8F6E\u6CE8\u5165\u4E00\u5F00\u59CB\u5C31\u628A\u4E0A\u4E00\u6761\u94FE\u4F5C\u5E9F\uFF08\u65E7\u94FE\u4E0D\u518D\u5199\u5165\u3001\u4E5F\u4E0D\u518D\u62A2\u56DE\u7126\u70B9\uFF09\uFF1B\u6A21\u578B\u5C42\u590D\u6838\u4E0D\u8FC7\u65F6**\u4E0D\u518D\u56DE\u6EDA**\uFF08\u56DE\u6EDA\u4F1A\u548C\u4E0B\u4E00\u8F6E\u53E0\u6210\u91CD\u590D\u6587\u5B57\uFF09\uFF0C\u6539\u4E3A\u590D\u67E5\u4E24\u6B21\u518D\u4EA4\u5B9A\u5411\u8DEF\u5F84\uFF1B\u300C\u5DF2\u7ECF\u586B\u597D\u300D\u7684\u5224\u5B9A\u8865\u4E0A\u300C\u884C\u5916\u5185\u5BB9\u5FC5\u987B\u7B49\u4E8E\u5199\u524D\u57FA\u7EBF\u300D\u2014\u2014\u65E7\u5199\u6CD5\u5728\u6B63\u6587\u88AB\u541E\u6389\u65F6\u4ECD\u4F1A\u62A5\u6CE8\u5165\u6210\u529F\uFF1B\u6062\u590D\u7528\u6237\u6587\u5B57\u6539\u4E3A\u6574\u4EFD\u66FF\u6362\u8BED\u4E49\uFF08\u5148\u6E05\u7A7A\u3001\u53EA\u5199\u4E00\u6B21\uFF09\uFF1B\u53E0\u51FA\u7684\u591A\u6761\u9690\u5F0F\u884C\u5728\u751F\u6210\u7F16\u8F91\u6307\u4EE4\u65F6\u5168\u90E8\u5254\u9664\uFF08\u539F\u5148\u53EA\u53BB\u6389\u7B2C\u4E00\u6761\uFF0C\u5269\u4E0B\u7684\u4F1A\u6DF7\u8FDB\u300C\u7528\u6237\u8981\u6C42\u300D\uFF09",
        '**Fixed "select a few times and the composer turns to mush, then goes blank"**: each new fill invalidates the previous chain (the old one stops writing and stops stealing focus back); when the model-layer check no longer passes there is **no rollback** \u2014 that rollback is what stacked duplicate text against the next round \u2014 it re-checks once more and then hands over to the targeted DOM path; the "already filled" verdict must now also match the off-line content against the pre-write baseline, because the old one still reported success after the body text had been swallowed; restoring user text is now a whole-value replace (clear once, write once); and every stacked bridge line is stripped when building the edit instruction (previously only the first was removed, so the rest leaked into the user request)'
      ],
      [
        "**\u6B62\u8840\u4E24\u5904\u628A\u6587\u5B57\u300C\u53E0\u6210\u51E0\u4EFD\u300D\u7684\u5199\u6CD5**\uFF1A\u6574\u4E32\u91CD\u5199\u4EE5\u524D**\u4E0D\u770B\u6E05\u7A7A\u662F\u5426\u6210\u529F**\uFF0C\u6CA1\u6E05\u7A7A\u5C31\u7EE7\u7EED insertText\uFF0C\u7B49\u4E8E\u5728\u975E\u7A7A\u8F93\u5165\u6846\u91CC\u53C8\u8FFD\u52A0\u4E00\u4EFD\uFF1B\u800C\u5B83\u6E05\u7A7A\u7528\u7684\u662F document.execCommand \u7684 selectAll\u2014\u2014\u9009\u4E2D\u7684\u662F\u6574\u4E2A\u9875\u9762\u800C\u4E0D\u662F\u8F93\u5165\u6846\u3002\u73B0\u5728\u6E05\u7A7A\u9009\u533A\u4E25\u683C\u9650\u5728\u8F93\u5165\u6846\u5185\uFF0C**\u6CA1\u6E05\u7A7A\u5C31\u653E\u5F03\u8FD9\u6B21\u5199\u5165\u5E76\u62A5\u5931\u8D25**\uFF08\u5B81\u53EF\u4E0D\u52A8\uFF0C\u4E5F\u4E0D\u53E0\u5B57\uFF09\uFF1B\u540C\u65F6\u628A\u300C\u4E3A\u4EC0\u4E48\u8D70\u4E0D\u5230\u5B98\u65B9\u6A21\u578B\u5C42\u5199\u5165\u300D\uFF08\u65E0\u63A5\u53E3\uFF0F\u8FD4\u56DE false\uFF0F\u629B\u5F02\u5E38\uFF09\u5355\u72EC\u4E0A\u62A5\u8FDB\u8BCA\u65AD\u65E5\u5FD7\u7684 paths=[\u2026]\uFF0C\u6392\u67E5\u4E0D\u518D\u9760\u731C",
        "**Stopped two writes that were stacking duplicates**: the full-rewrite path ignored whether clearing actually succeeded and kept calling insertText anyway, so on a non-empty composer it simply appended another copy \u2014 and its clear used document.execCommand selectAll, which selects the whole page rather than the input box. The selection is now confined to the composer, and if it is still not empty the write is abandoned and reported as a failure (better untouched than stacked); the reason the official model-layer write was skipped (no API / returned false / threw) is now reported on its own into the paths=[\u2026] diagnostics line"
      ],
      [
        "**\u9690\u5F0F\u884C\u4E4B\u4E0A\u7684\u90A3\u884C\u7A7A\u767D\u4E5F\u6E05\u6389\u4E86**\uFF1ALexical \u7684\u8F93\u5165\u6846\u5E38\u4EE5\u4E00\u4E2A\u7A7A\u6BB5\u843D\uFF08\u5185\u542B <br> \u6216\u96F6\u5BBD\u5B57\u7B26\uFF09\u5F00\u5934\uFF0C\u6CE8\u5165\u843D\u5728\u5B83\u540E\u9762 \u21D2 \u770B\u8D77\u6765\u4E0A\u65B9\u591A\u4E00\u884C\u7A7A\u767D\uFF0C\u53D6\u6D88\u6846\u9009\u540E\u7167\u6837\u7559\u7740\u3002\u73B0\u5728\u5199\u5165\u4E0E\u5220\u9664\u7684\u6536\u5C3E\u90FD\u53EA\u6E05\u300C\u6846\u5F00\u5934\u5230\u7B2C\u4E00\u4E2A\u975E\u7A7A\u6587\u672C\u8282\u70B9\u4E4B\u524D\u300D\u8FD9\u6BB5\u7EAF\u7A7A\u767D\uFF0C\u6B63\u6587\u4E00\u4E2A\u5B57\u4E0D\u52A8\uFF1B\u540C\u65F6\u5220\u6389\u4E0A\u4E00\u6279\u52A0\u7684\u300C\u5168\u9009\u518D\u5220\u9664\u300D\u515C\u5E95\u2014\u2014\u90A3\u4F1A\u8FDE\u7528\u6237\u6B63\u6587\u4E00\u8D77\u5220\u6389\uFF0C\u662F\u5371\u9669\u5199\u6CD5",
        "**The blank line above the bridge line is gone**: the Lexical composer usually starts with an empty block (a <br> or a zero-width character), so an inserted line lands below it, looking like a stray empty row that also survives a deselection. Both the insert and the delete path now clear only that leading pure-whitespace stretch and never touch the body text; the select-all-then-delete fallback added last round is removed outright \u2014 it would have taken the user text with it"
      ],
      [
        "**\u767B\u8BB0 DSH 0.2.0-rc.1 \u4E3A\u5B9E\u6D4B\u9002\u914D\u7248\u672C**\uFF1A\u9694\u79BB\u5B89\u88C5\u65B0\u7248\u540E\u8DD1\u6EE1\u516D\u5957\u6C99\u76D2\uFF0825 \u4E2A\u89E6\u70B9\u96F6\u6D88\u5931\u3001\u591A profile \u4E0E\u8FDB\u7A0B\u5B89\u5168 34/34\u3001\u8BA4\u8BC1\u77E9\u9635 11 \u9879\u5168\u8FC7\u3001\u6765\u6E90\u51C6\u5165 5/5\u3001\u4F1A\u8BDD\u4FEE\u590D\u540C\u7248\u672C\u5206\u652F PASS\u3001\u6865\u63A5 setDraft \u771F\u673A\u7AEF\u5230\u7AEF 17/17\uFF09\uFF0C\u5B9E\u6D4B\u533A\u95F4\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8",
        "**Registered DSH 0.2.0-rc.1 as tested-supported**: an isolated install of the new version passed all six sandbox suites (25 integration seams with nothing gone, 34/34 for multi-profile and process safety, 11/11 on the auth matrix, 5/5 on session source-kind admission, the same-version session-repair path, and 17/17 for the bridge setDraft end-to-end run), so the verified range moves up accordingly"
      ],
      [
        "**\u542F\u52A8\u547D\u4EE4\u586B\u6210 DSH \u5185\u7F6E\u975E Web \u6863\u4F1A\u88AB\u62E6\u4E0B**\uFF1A\u4EE5\u524D\u628A\u542F\u52A8\u547D\u4EE4\u5199\u6210 dsh --profile acp\uFF08\u6216 headless / sdk / sdk-minimal\uFF09\u65F6\u63D2\u4EF6\u7167\u6837 spawn \u6210\u529F\uFF0C\u4F46\u90A3\u4E00\u6863\u4E0D\u63D0\u4F9B\u670D\u52A1\u3001\u6C38\u4E0D\u76D1\u542C\u7AEF\u53E3\uFF0C\u73B0\u8C61\u53EA\u662F\u300CDSH \u8D77\u4E0D\u6765\u3001\u9762\u677F\u8FDE\u4E0D\u4E0A\u300D\u4E14\u770B\u4E0D\u51FA\u539F\u56E0\uFF1B\u73B0\u5728\u8BBE\u7F6E\u9875\u62D2\u7EDD\u4FDD\u5B58\u5E76\u8BF4\u660E\uFF0C\u63D2\u4EF6\u542F\u52A8\u65F6\u4E5F\u4F1A\u515C\u5E95\u56DE\u9000\u4E3A\u9ED8\u8BA4 Web \u547D\u4EE4\uFF08\u9632\u624B\u6539 data.json\uFF09",
        '**A startup command pointing at a DSH built-in non-Web profile is now rejected**: writing it as dsh --profile acp (or headless / sdk / sdk-minimal) used to spawn fine, but that flavour serves no Web GUI and never listens on a port, so the only symptom was "DSH will not start" with no visible cause. Settings now refuses to save it and explains why, and the plugin falls back to the default Web command at launch (covering a hand-edited data.json)'
      ],
      [
        "**spawn \u5931\u8D25\u65F6\u63D2\u4EF6\u4F1A\u7559\u4E0B\u5B8C\u6574\u8BC1\u636E**\uFF1A\u4EE5\u524D\u53EA\u8BB0\u4E00\u53E5 message\uFF0C\u5916\u90E8\u7528\u6237\u62A5\u300Cspawn \u5C31\u62A5\u9519\u300D\u65F6\u5206\u4E0D\u6E05\u662F\u6CA1\u88C5 CLI\u3001PATH \u6CA1\u5237\u65B0\u8FD8\u662F\u88AB\u6743\u9650/\u5B89\u5168\u8F6F\u4EF6\u62E6\uFF1B\u73B0\u5728 code\u3001syscall \u4E0E\u5B9E\u9645\u6267\u884C\u7684\u547D\u4EE4\u4F1A\u4E00\u5E76\u8FDB\u901A\u77E5\u548C\u8BCA\u65AD\u65E5\u5FD7\uFF0C\u5E76\u6309\u9519\u8BEF\u7801\u7ED9\u51FA\u5BF9\u5E94\u5904\u7F6E\uFF08ENOENT\u2192\u88C5 CLI \u6216\u586B\u7EDD\u5BF9\u8DEF\u5F84\uFF1BEACCES/EPERM\u2192\u52A0\u767D\u540D\u5355\uFF09",
        "**Spawn failures now leave full evidence**: the plugin used to keep only the message, so an external report of a spawn error could not be told apart from a missing CLI, a stale PATH or a security block. The notification and the diagnostic log now carry code, syscall and the exact command attempted, with the matching remedy (ENOENT means install the CLI or use its absolute path; EACCES/EPERM means allow it through)"
      ]
    ]
  },
  {
    version: "2.8.6",
    items: [
      [
        "**\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D\u8DDF\u4E0A DSH 0.1.7 \u7684\u4F1A\u8BDD\u683C\u5F0F v4**\uFF1A\u6539\u8BFB\u5F53\u524D\u771F\u6B63\u5728\u5199\u7684 session.v4.jsonl.zstd\uFF08\u6B64\u524D\u53EA\u770B v3/v0\uFF0C\u5F53\u524D\u4F1A\u8BDD\u5168\u5728\u89C6\u91CE\u5916\uFF09\uFF0C\u65B0\u589E\u628A v4 \u5DF2\u9000\u5F79\u7684\u901A\u7528 plugin \u6765\u6E90\u5F62\u6001\u6539\u56DE\u751F\u4EA7\u8005\u81EA\u6709 kind\uFF0C\u6D88\u606F\u89D2\u8272\u8868\u6309\u683C\u5F0F\u7248\u672C\u5206\u6863\uFF08v3 \u7684 tool/result \u662F user\u3001v4 \u662F tool\uFF09\uFF0C\u4E0D\u518D\u628A\u6B63\u5E38\u4F1A\u8BDD\u8BEF\u5224\u6210\u635F\u574F",
        "**Session repair caught up with the session format v4 of DSH 0.1.7**: it now reads the file DSH actually writes (session.v4.jsonl.zstd \u2014 previously only v3/v0 were in view, so current sessions were invisible), restores the retired generic plugin source form to a producer-owned kind, and validates message roles with a version-specific table (tool/result is role=user in v3 but tool in v4), so healthy sessions are no longer reported as broken"
      ],
      [
        "**\u4FEE\u6389\u300C\u4F1A\u8BDD\u4E00\u591A\u5C31\u6574\u4E2A\u529F\u80FD\u8DD1\u4E0D\u8D77\u6765\u300D**\uFF1A\u9884\u68C0\u53C2\u6570\u539F\u5148\u4E0E\u9A71\u52A8\u811A\u672C\u4E00\u8D77\u585E\u8FDB\u547D\u4EE4\u884C\uFF0C203 \u4E2A\u4F1A\u8BDD\u5373\u8D85 Windows 32,767 \u5B57\u7B26\u4E0A\u9650\u800C spawn \u5931\u8D25\uFF1B\u73B0\u6539\u7531\u4E00\u6B21\u6027\u4E34\u65F6\u6587\u4EF6\u4F20\u53C2\uFF0C211 \u4E2A\u4F1A\u8BDD\u4E00\u6B21\u8DD1\u5B8C\u7EA6 5 \u79D2",
        "**Fixed the repair failing outright at realistic session counts**: the session list used to ride along in the command line and blew past the Windows limit of 32,767 characters at 203 sessions; arguments now go through a throwaway file, and 211 sessions complete in about 5 seconds"
      ],
      [
        "**AED \u62A2\u6551\u5B8C\u4E0D\u518D\u8BEF\u5F39\u300C\u68C0\u6D4B\u5230 DSH \u542F\u52A8\u5F02\u5E38\u300D**\uFF1A\u6536\u5C3E\u6821\u9A8C\u539F\u5148\u6293\u4E0D\u5E26\u51ED\u636E\u7684\u88F8\u5730\u5740\uFF0C\u800C DSH 0.1.2+ \u4E00\u5F8B\u56DE 401\uFF0C\u4E8E\u662F\u6BCF\u6B21\u62A2\u6551\u90FD\u4EE5\u300C\u5EFA\u8BAE\u964D\u7EA7\u300D\u7684\u5047\u5F02\u5E38\u6536\u573A\uFF1B\u73B0\u6309\u672C\u6B21\u542F\u52A8 token \u8D70\u5D4C\u5165\u5730\u5740\u6821\u9A8C\uFF08\u5BA2\u6237\u7AEF\u8D44\u4EA7\u6309\u771F\u673A\u8981\u6C42\u4FDD\u6301\u4E0D\u5E26\u51ED\u636E\uFF09\uFF0C\u8FC7\u65F6\u7684\u300C\u9762\u677F\u672A\u9002\u914D\u8BA4\u8BC1\u300D\u8BF4\u660E\u6539\u6210\u5B9E\u9645\u5904\u7F6E",
        '**No more false "DSH boot issue" dialog after an AED recovery**: the closing check used to fetch the bare, credential-less URL, which DSH 0.1.2+ always answers with 401, so every recovery ended by recommending a downgrade; it now uses the embedded URL with this launch token (the client asset fetch deliberately stays credential-less, as measured on the real machine), and the stale "panel not adapted to authentication" note now states the actual remedy'
      ],
      [
        "**\u62A2\u6551\u76EE\u6807\u5BF9\u9F50**\uFF1Adsh-fix 0.2.0 \u89E3\u6790\u4E86 `--home` \u5374\u4ECE\u4E0D\u4F7F\u7528\uFF08\u53EA\u6709 DSH_HOME \u73AF\u5883\u53D8\u91CF\u751F\u6548\uFF09\uFF0Chome \u975E\u9ED8\u8BA4\u65F6\u63D2\u4EF6\u7684\u6587\u4EF6\u5C42\u4E0E dsh-fix \u5404\u6539\u5404\u7684\uFF1B\u73B0\u5728\u4E24\u8005\u4E00\u8D77\u7ED9\u51FA\u5E76\u663E\u5F0F\u70B9\u540D profile",
        "**Recovery now patches the right place**: dsh-fix 0.2.0 parses `--home` but never uses it (only the DSH_HOME environment variable takes effect), so with a non-default home the plugin file layer and dsh-fix patched two different trees; both are now passed together and the profile is named explicitly"
      ],
      [
        "**\u300CAED for DSH\u300D\u884C\u73B0\u5728\u5206\u70B9\u5217\u51FA\u5B83\u80FD\u62A2\u6551\u56DE\u6765\u7684\u5E38\u89C1\u5D29\u6E83\u72B6\u6001**\uFF08\u63D2\u4EF6\u51B2\u7A81\u8D77\u4E0D\u6765\u3001\u8865\u4E01\u5C42\u89E3\u6790\u5931\u8D25\u3001\u63D2\u4EF6\u5305\u7F3A\u5931\u6216\u5378\u8F7D\u6B8B\u7559\u3001bundle \u5C42\u63D2\u4EF6\u62D6\u57AE\u542F\u52A8\u3001\u5B89\u5168\u6A21\u5F0F\u6B8B\u7559\u7981\u6389\u6865\u63A5\u3001\u9875\u9762\u7F3A\u542F\u52A8\u5F15\u5BFC\u6CE8\u5165\uFF09\uFF0C\u5E76\u5199\u660E\u4E0D\u9002\u7528\u7684\u8303\u56F4\uFF1B\u9AD8\u7EA7\u8BBE\u7F6E\u91CC\u300C\u9002\u914D\u72B6\u6001\u300D\u5206\u533A\u540D\u53BB\u6389\u62EC\u53F7\u8BF4\u660E",
        '**The "AED for DSH" row now lists the breakages it can rescue** \u2014 plugins conflicting so DSH will not start, an unparseable patch layer, missing or leftover plugin packages, bundle-layer plugins breaking startup, safe-mode leftovers disabling the bridge, and a page without the boot injection \u2014 and states what it does not cover; the Advanced "Compatibility" section heading drops its parenthetical note'
      ],
      [
        "**\u300CAED for DSH\u300D\u884C\u6539\u4E3A\u6B63\u6587\u7B80\u8FF0 + \u5F39\u7A97\u770B\u75C7\u72B6**\uFF1A\u6B63\u6587\u4E00\u53E5\u8BDD\u8BF4\u6E05\u5B83\u505A\u4EC0\u4E48\u3001\u4F9D\u8D56\u4EC0\u4E48\uFF08\u72EC\u7ACB\u547D\u4EE4\u884C\u5DE5\u5177 dsh-fix\uFF0Cnpm \u5168\u5C40\u5305\uFF0C\u63D2\u4EF6\u81EA\u52A8\u88C5\u5230\u6700\u65B0\uFF0C\u5B98\u65B9\u6E90\u4E0D\u901A\u8D70\u955C\u50CF\uFF09\uFF0C\u516D\u6761\u9002\u7528\u75C7\u72B6\u6536\u8FDB\u300C\u9002\u7528\u75C7\u72B6\u8BF4\u660E\u300D\u94FE\u63A5\u70B9\u5F00\u770B\uFF1B\u987A\u5E26\u8865\u4E0A\u4E00\u4E2A\u81EA\u59CB\u6F0F\u8BD1\u7684\u6309\u94AE\u952E\u2014\u2014\u300C\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D\u300D\u884C\u7684\u6309\u94AE\u5728\u4E2D\u6587\u6001\u6B64\u524D\u663E\u793A\u7684\u662F\u88F8\u952E\u540D settings.repair.btn\uFF0C\u73B0\u5728\u53EB\u300C\u4F1A\u8BDD\u4FEE\u590D\u300D",
        '**The AED row now states the feature and its dependency in one line, with the symptom list behind a "What it can fix" link** \u2014 it runs the standalone dsh-fix command-line tool (an npm global package the plugin keeps up to date, with a mirror fallback), and the six symptoms moved into a popup. Along the way a translation key that was missing from the start got added: the session row button used to show the raw key name settings.repair.btn in Chinese and now reads \u4F1A\u8BDD\u4FEE\u590D'
      ],
      [
        "**AED \u884C\u89C2\u611F\u8C03\u6574**\uFF1A\u6B63\u6587\u91CC dsh-fix \u540E\u7684\u62EC\u53F7\u8BF4\u660E\u5220\u6389\uFF08\u4F9D\u8D56\u89E3\u91CA\u79FB\u8FDB\u5F39\u7A97\u9996\u884C\uFF09\uFF0C\u300C\u9002\u7528\u75C7\u72B6\u8BF4\u660E\u300D\u6539\u6302\u5230\u884C\u540D\u53F3\u4FA7\u5E76\u52A0\u5706\u5708\u95EE\u53F7\u56FE\u6807\uFF1B\u5F39\u7A97\u6E05\u5355\u5206\u6210 \u2713 \u53EF\u4EE5\u62A2\u6551 \u4E0E \u2717 \u4E0D\u9002\u7528 \u4E24\u7EC4\uFF0C\u4E24\u7EC4\u5B57\u53F7\u4E00\u81F4\uFF0C\u53EA\u7528\u7B26\u53F7\u548C\u989C\u8272\u533A\u5206",
        "**AED row polish**: the parenthetical note after dsh-fix is gone from the row text (the dependency explanation moved into the popup), the symptoms link now sits to the right of the row name behind a circled question-mark icon, and the popup splits its list into \u2713 what it can rescue and \u2717 what it is not for, both groups at the same font size and told apart only by the mark and its colour"
      ]
    ]
  },
  {
    version: "2.8.5",
    items: [
      [
        "**\u4FEE\u590D\u5546\u5E97\u6E90\u7801\u5BA1\u67E5\u88C5\u4E0D\u4E0A\u4F9D\u8D56**\uFF1A\u9501\u6587\u4EF6\u91CC\u7684\u4E0B\u8F7D\u5730\u5740\u66FE\u88AB\u672C\u673A npm \u955C\u50CF\u914D\u7F6E\u5199\u6210\u56FD\u5185\u6E90\uFF0C\u800C\u5BA1\u67E5\u6C99\u7BB1\u53EA\u8D70\u5B98\u65B9\u6E90\uFF0C\u4F9D\u8D56\u89E3\u6790\u7C7B\u68C0\u67E5\u56E0\u6B64\u6574\u6BB5\u8DF3\u8FC7\uFF1B\u73B0\u5168\u90E8\u6539\u56DE\u5B98\u65B9\u6E90\uFF08\u4F9D\u8D56\u7248\u672C\u96F6\u53D8\u52A8\uFF09\u5E76\u52A0\u4E86\u53D1\u5E03\u95E8\u7981",
        "**Fixed the store source review failing to install dependencies**: the lockfile carried mirror-hosted tarball URLs from a local npm config, but the review sandbox only reaches the official registry, so every dependency-resolved check was skipped; all URLs are back on the official registry (no version drift) and a release gate now enforces it"
      ]
    ]
  },
  {
    version: "2.8.4",
    items: [
      [
        "**\u53D6\u6D88\u300C\u672C\u673A DSH \u4E0D\u9002\u914D\u300D\u7684\u5168\u90E8\u5F39\u7A97**\uFF1A\u5224\u5B9A\u7167\u65E7\u4EA7\u51FA\uFF0C\u53EA\u9759\u9ED8\u5199\u5728 DSH \u72B6\u6001\u6A2A\u5E45\u4E0E\u8BBE\u7F6E\u9875\u300C\u5F53\u524D\u9002\u914D\u72B6\u6001\u300D\u91CC\uFF0C\u7EC6\u8282\u7531\u4F60\u4E3B\u52A8\u70B9\u300CDSH\u7248\u672C\u9002\u914D\u8BF4\u660E\u300D\u67E5\u9605",
        '**Removed every "your DSH is not compatible" dialog**: the verdict is still computed but now appears silently in the status row and under "current compatibility", with details only behind the compatibility-notes link you open yourself'
      ],
      [
        "**\u5220\u6389\u6253\u5F00\u9762\u677F 8 \u79D2\u540E\u90A3\u6B21\u65E0\u6761\u4EF6\u6574\u5C4F\u91CD\u5237**\uFF08\u771F\u673A\u65E5\u5FD7\uFF1A\u9762\u677F 5 \u79D2\u5C31\u5DF2\u5C31\u7EEA\u4ECD\u88AB\u5237\u6389\uFF0C\u4E14\u540C\u4E00\u8F6E\u8FDE\u5237\u4E24\u6B21\uFF09\uFF0C\u767D\u5C4F\u81EA\u6108\u6539\u7531\u754C\u9762\u63A2\u6D4B\u6309\u9700\u8D1F\u8D23",
        "**Dropped the unconditional full re-render 8 seconds after opening the panel** (real-machine logs: a panel already ready at 5s got refreshed anyway, twice in one round); blank-screen recovery is now purely detection-driven, and refresh() is mutually exclusive so a round can never render twice"
      ],
      [
        "**\u767B\u8BB0 DSH 0.1.7-rc.2 \u4E3A\u5B9E\u6D4B\u9002\u914D\u7248\u672C**\uFF1A27 \u4E2A\u89E6\u70B9\u6BD4\u5BF9\u96F6\u7F3A\u5931\u3001\u9694\u79BB\u6C99\u76D2\u4E94\u4EF6\u5168\u7EFF\uFF0C\u9002\u914D\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8",
        "**Registered DSH 0.1.7-rc.2 as tested-supported**: all 27 integration seams survive the upgrade and five sandbox suites pass; the support ceiling moves up accordingly"
      ],
      [
        "**\u4F5C\u7528\u57DF\u91CD\u542F\u65B0\u589E\u300C\u7EDD\u4E0D\u81EA\u6740\u300D\u5B88\u536B**\uFF1A\u53D7\u7BA1\u8FDB\u7A0B\u8868\u82E5\u6307\u5411\u5F53\u524D\u8FDB\u7A0B\u81EA\u8EAB\u5219\u4E00\u5F8B\u8DF3\u8FC7\uFF0C\u54EA\u6015\u5B83\u7684\u547D\u4EE4\u884C\u91CC\u5E26\u7740 DSH \u8DEF\u5F84",
        "**Scoped restarts can no longer kill the plugin itself**: an entry pointing at the current process is always skipped, even when its command line contains a DSH path"
      ]
    ]
  },
  {
    version: "2.8.3",
    items: [
      [
        "**\u767B\u8BB0 DSH 0.1.7-rc.1 \u4E3A\u5B9E\u6D4B\u9002\u914D\u7248\u672C**\uFF08\u9002\u914D\u4E0A\u754C\u968F\u4E4B\u4E0A\u63A8\uFF09\uFF0C\u5E76\u5199\u660E\u767B\u8BB0\u89C4\u77E9\uFF1A\u53EA\u767B\u8BB0\u771F\u8DD1\u8FC7\u7684\u7248\u672C\uFF0C\u53D1\u73B0\u771F\u7834\u574F\u5148\u4FEE\u518D\u767B\u8BB0",
        "**Registered DSH 0.1.7-rc.1 as tested-supported** (support ceiling raised accordingly), with the rule written down: only versions actually exercised get registered, and real breakage is fixed before registering"
      ],
      [
        "**\u79FB\u9664\u8BBE\u7F6E\u9875\u300C\u586B\u5145\u5199\u5165\u65B9\u5F0F\u300D\u4E0B\u62C9**\uFF1A\u5B98\u65B9\u63A5\u53E3\u53EF\u7528\u5373\u81EA\u52A8\u4F7F\u7528\u3001\u4E0D\u53EF\u7528\u9759\u9ED8\u9000\u56DE DOM\uFF0C\u7528\u6237\u4E0D\u9700\u8981\u66FF\u6211\u4EEC\u505A\u7248\u672C\u517C\u5BB9\u5224\u65AD",
        '**Removed the "draft write method" dropdown from settings**: the official interface is used when available and silently falls back to the DOM path otherwise, so no compatibility judgement is pushed onto you'
      ]
    ]
  },
  {
    version: "2.8.2",
    items: [
      [
        "**\u4FEE\u590D\u9762\u677F\u770B\u4E0D\u5230\u804A\u5929\u8BB0\u5F55\uFF08\u8FDE\u63A5\u4E00\u76F4\u5728\u91CD\u8BD5\uFF09**\uFF1A2.8.1 \u91CD\u5199\u51ED\u636E\u5224\u636E\u65F6\u6F0F\u4E86 WebSocket \u8FD9\u79CD\u5730\u5740\u5F62\u6001\uFF0C\u4F1A\u8BDD\u4E3B\u901A\u9053\u56E0\u6B64\u62FF\u4E0D\u5230\u51ED\u636E\u3001\u63E1\u624B\u88AB\u62D2\u540E\u65E0\u9650\u91CD\u8FDE\u2014\u2014\u9762\u677F\u80FD\u6253\u5F00\uFF0C\u4F46\u5386\u53F2\u4E0E\u4F1A\u8BDD\u6570\u636E\u90FD\u51FA\u4E0D\u6765\uFF1B\u73B0\u6309\u300C\u5730\u5740\u5F52\u4E00\u5316\u540E\u662F\u5426\u672C\u673A\u670D\u52A1\u300D\u5224\u5B9A\uFF0CWebSocket \u4E0E EventSource \u4E00\u5E76\u8986\u76D6",
        '**Fixed the panel showing no chat history (connection stuck retrying)**: the 2.8.1 rule rewrite missed the WebSocket address shape, so the session channel lost its credential, was refused at the handshake and retried forever \u2014 the panel opened but neither history nor session data appeared; the rule now normalises the address before judging "is this the local service" and covers WebSocket and EventSource alike'
      ]
    ]
  },
  {
    version: "2.8.1",
    items: [
      [
        "**\u4FEE\u590D\u9762\u677F\u5185\u4E00\u6279\u8BF7\u6C42\u5168\u90E8 401**\uFF1ADSH 0.1.7 \u6539\u6362\u4E86\u8BF7\u6C42\u5730\u5740\u7684\u6784\u9020\u5F62\u5F0F\uFF0C\u6865\u63A5\u7684\u51ED\u636E\u8865\u6302\u5224\u636E\u6F0F\u6389\u4E86\u8FD9\u7C7B\u8C03\u7528\u2014\u2014\u8BBE\u7F6E\u9875\u3001\u8D26\u53F7\u51ED\u636E\u3001\u6A21\u5F0F\u9009\u62E9\u3001\u6A21\u578B\u76EE\u5F55\u3001Cordis \u9762\u677F\u4E43\u81F3\u53D1\u6D88\u606F\u90FD\u62FF\u4E0D\u5230\u51ED\u636E\u800C 401\uFF1B\u73B0\u6309\u300C\u662F\u5426\u53D1\u7ED9\u672C\u673A DSH \u670D\u52A1\u300D\u5224\u5B9A\uFF0C\u540C\u7C7B\u8C03\u7528\u4E0D\u4F1A\u518D\u6F0F\u6302",
        `**Fixed a whole class of in-panel requests returning 401**: DSH 0.1.7 changed how request URLs are built, and the bridge's credential-attaching rule missed that shape \u2014 the settings page, account credentials, mode picker, model catalogue, Cordis panel and even sending a message all went unauthenticated and answered 401; the rule now keys on "is this addressed to the local DSH service", so that class cannot be missed again`
      ],
      [
        "**\u987A\u5E26\u6536\u7D27\u51ED\u636E\u7684\u53D1\u653E\u8303\u56F4**\uFF1A\u53EA\u6709\u53D1\u7ED9\u672C\u673A DSH \u670D\u52A1\u7684\u8BF7\u6C42\u624D\u4F1A\u5E26\u4E0A\u51ED\u636E\uFF0C\u53D1\u5F80\u5916\u90E8\u5730\u5740\u7684\u8BF7\u6C42\u4E00\u5F8B\u4E0D\u5E26\uFF08\u6B64\u524D\u6309\u5730\u5740\u5B57\u9762\u91CF\u5224\u65AD\uFF0C\u8FB9\u754C\u4E0D\u4E25\u8C28\uFF09",
        "**Credential scope tightened along the way**: only requests addressed to the local DSH service carry the credential; requests to external addresses never do (the previous literal-match rule had sloppy boundaries)"
      ]
    ]
  },
  {
    version: "2.8.0",
    items: [
      [
        "**\u6846\u9009\u6587\u5B57\u4E0D\u518D\u9700\u8981\u5148\u70B9\u8FDB\u804A\u5929\u6846**\uFF1A\u586B\u5145\u4F18\u5148\u8D70 DSH \u5B98\u65B9\u7684\u6A21\u578B\u5C42\u5199\u5165\uFF08`setDraft`\uFF09\uFF0C\u8BE5\u5199\u5165\u4E0D\u8981\u6C42\u8F93\u5165\u6846\u83B7\u5F97\u7126\u70B9\u2014\u2014\u5728\u7B14\u8BB0\u91CC\u6846\u9009\uFF0C\u9690\u5F0F\u884C\u7ACB\u523B\u51FA\u73B0\u5728\u804A\u5929\u6846\uFF0C\u952E\u76D8\u7126\u70B9\u59CB\u7EC8\u7559\u5728 Obsidian",
        "**Selecting text no longer needs a click into the chat box first**: fills now prefer DSH's official model-layer write (`setDraft`), which does not require the composer to hold focus \u2014 select text in the note and the implicit line shows up at once, with the keyboard focus staying in Obsidian"
      ],
      [
        "**\u8BE5\u80FD\u529B\u9ED8\u8BA4\u5F00\u542F\u5E76\u81EA\u52A8\u5C31\u4F4D**\uFF1A\u5199\u5165\u65B9\u5F0F\u4E3A\u9ED8\u8BA4\u503C\u65F6\u6865\u63A5\u4EE5\u88F8\u5305\u540D\u5B89\u88C5\uFF08\u5B98\u65B9\u88C5\u8F7D\u5668\u8BA4\u5F97\u5BA2\u6237\u7AEF\u534A\u7684\u552F\u4E00\u5F62\u6001\uFF09\uFF1B\u94FE\u63A5\u5EFA\u4E0D\u51FA\u6765\u6216\u5B98\u65B9\u63A5\u53E3\u4E0D\u53EF\u8FBE\u65F6\u81EA\u52A8\u9000\u56DE\u539F\u8DEF\u5F84\u6A21\u5F0F\uFF0C\u884C\u4E3A\u4E0E\u65E7\u7248\u4E00\u81F4\uFF0C\u4E0D\u4F1A\u9759\u9ED8\u534A\u88C5",
        "**Enabled by default and self-installing**: with the default write mode the bridge installs as a named package (the only shape whose client half the official loader picks up); if the link cannot be created or the official API is unreachable it falls back to the previous path mode with identical behaviour \u2014 never a silent half-install"
      ],
      [
        "**\u65B0\u589E\u5199\u5165\u65B9\u5F0F\u8BBE\u7F6E\u9879\u4E0E\u5EFA\u7F6E\u671F\u63A2\u9488**\uFF1A\u8BBE\u7F6E\u9875\u53EF\u5728\u300C\u5B98\u65B9\u63A5\u53E3\u4F18\u5148 / \u4EC5 DOM \u5B9A\u5411\u66FF\u6362\u300D\u4E4B\u95F4\u5207\u6362\uFF1B\u65B0\u589E `npm run verify:package`\uFF0C\u5728\u771F\u78C1\u76D8\u4E0A\u6838\u5BF9\u5305\u5F62\u6001\u7684 8 \u9879\u843D\u5730\u6761\u4EF6\uFF08\u542B\u94FE\u63A5\u4F4D\u88AB\u5360\u65F6\u9000\u56DE\u8DEF\u5F84\u7684\u8D1F\u5411\u7528\u4F8B\uFF09",
        '**New write-mode setting and a build-time probe**: the settings page can switch between "official API first" and "DOM targeted replace only"; the new `npm run verify:package` checks the eight on-disk conditions of the package shape, including the negative case where an occupied link falls back to the path mode'
      ]
    ]
  },
  {
    version: "2.7.1",
    items: [
      [
        "**\u4FEE\u590D DSH 0.1.7 \u4E0B\u6865\u63A5\u6CE8\u5165\u88AB\u786C\u62D2**\uFF1A\u4F1A\u8BDD\u683C\u5F0F v4 \u9000\u5F79\u4E86\u901A\u7528 `kind:'plugin'` \u6E90\u5305\u88F9\u5C42\uFF0C\u6539\u8981\u6C42 source.kind \u662F\u751F\u4EA7\u8005\u81EA\u5DF1\u7684\u540D\u5B57\uFF1B\u6CE8\u5165\u7684\u9690\u5F0F\u7F16\u8F91\u6307\u4EE4\u6539\u7528 `plugin:dsh-obsidian-bridge`\uFF0C\u62A5\u9519 `format v4 message requires a producer-owned source kind` \u4E0D\u518D\u51FA\u73B0",
        "**Fixed bridge injections being hard-rejected on DSH 0.1.7**: session format v4 retired the generic `kind:'plugin'` source wrapper and now requires source.kind to be the producer's own name; injected edit instructions use `plugin:dsh-obsidian-bridge`, so the `format v4 message requires a producer-owned source kind` error is gone"
      ],
      [
        "**\u987A\u5E26\u4FEE\u590D\u6CE8\u5165\u7A97\u53E3\u53BB\u91CD**\uFF1Av4 \u8FC1\u79FB\u4F1A\u5220\u6389\u65E7\u6D88\u606F\u7684 `plugin` \u5B57\u6BB5\uFF0C\u800C\u539F\u53BB\u91CD\u53EA\u8BA4\u5B83\uFF1B\u73B0\u540C\u65F6\u8BA4\u65B0 kind \u4E0E\u8FC1\u79FB\u524D\u7684\u65E7\u5F62\u6001\uFF0C\u8DE8\u8FC1\u79FB\u8FB9\u754C\u4E0D\u4F1A\u91CD\u590D\u6CE8\u5165",
        "**Fixed injection window dedup along the way**: the v4 migration drops the legacy `plugin` field that dedup relied on; it now recognises both the new kind and the pre-migration shape, so injections are not duplicated across the migration boundary"
      ],
      [
        "**\u65B0\u589E\u5EFA\u7F6E\u671F\u63A2\u9488 `npm run verify:source-kind`**\uFF1A\u628A\u63D2\u4EF6\u5B9E\u9645\u53D1\u51FA\u7684 source \u5F62\u6001\u5582\u7ED9\u672C\u673A\u5DF2\u88C5 DSH \u7684\u4F1A\u8BDD\u51C6\u5165\u51FD\u6570\uFF0C\u65B0\u5F62\u6001\u88AB\u62D2\u6216\u65E7\u5F62\u6001\u6CA1\u88AB\u62D2\u90FD\u76F4\u63A5\u62A5\u9519\u9000\u51FA",
        "**New build-time probe `npm run verify:source-kind`**: feeds the source shapes the plugin actually emits into the installed DSH session admission, failing loudly if the new shape is rejected or the legacy one is not"
      ]
    ]
  },
  {
    version: "2.7.0",
    items: [
      [
        "**\u9002\u914D DSH 0.1.7 \u7684\u4F1A\u8BDD\u683C\u5F0F v4**\uFF1A\u8DE8\u7248\u672C\u65E7\u4F1A\u8BDD\u6539\u4E3A\u300C\u53EA\u62A5\u544A\u4E0D\u6539\u5199\u300D\uFF0C\u5E76\u8BF4\u660E\u7531 DSH \u6253\u5F00\u65F6\u81EA\u884C\u8FC1\u79FB\uFF08\u65E7\u7248\u4E0A\u8BE5\u6309\u94AE\u4F1A\u6C38\u8FDC\u4FEE\u4E0D\u52A8\uFF09",
        "**Adapted to DSH 0.1.7 session format v4**: older cross-version sessions are now report-only (never rewritten), with an explicit note that DSH migrates them on open \u2014 previously the repair could never converge"
      ],
      [
        '**\u9002\u914D\u81EA\u68C0\u65B0\u589E\u80FD\u529B\u5DEE\u5F02\u63D0\u793A**\uFF1A0.1.7+ \u4F1A\u660E\u786E\u544A\u77E5\u300C\u4F1A\u8BDD\u4FEE\u590D\u80FD\u529B\u53D7\u9650\u300D\uFF0C\u4E0D\u518D\u53EA\u8BF4"\u65B0\u4E8E\u5B9E\u6D4B\u8303\u56F4"',
        '**Compatibility check now reports capability differences**: on 0.1.7+ it states that session repair is limited, instead of only "newer than tested range"'
      ],
      [
        "**\u6865\u63A5\u652F\u6301\u88F8\u5305\u540D\u5B89\u88C5\uFF08\u5B9E\u9A8C\uFF0C\u9ED8\u8BA4\u5173\u95ED\uFF09**\uFF1A\u8865\u9F50\u5BA2\u6237\u7AEF\u534A\u88C5\u8F7D\u6240\u9700\u7684\u5305\u5F62\u6001\uFF08exports/dsh.client + node_modules \u94FE\u63A5\uFF09\uFF0C\u94FE\u63A5\u5EFA\u4E0D\u51FA\u6765\u65F6\u81EA\u52A8\u9000\u56DE\u539F\u8DEF\u5F84\u6A21\u5F0F",
        "**Bridge can install as a named package (experimental, off by default)**: ships the packaging a DSH client half needs (exports/dsh.client plus a node_modules link), and falls back to the current path entry automatically"
      ]
    ]
  },
  {
    version: "2.6.1",
    items: [
      [
        "**\u4FEE\u590D\u9762\u677F\u5185\u4E0A\u4F20\u9644\u4EF6\u4ECD\u7136\u5931\u8D25**\uFF1A\u4E0A\u4E00\u7248\u8865\u4E01\u7684\u547D\u4E2D\u6761\u4EF6\u8BFB `worker.name`\uFF0C\u800C Chromium \u91CC\u5B83\u8BFB\u56DE `null`\uFF08\u5177\u540D\u53EA\u7528\u4E8E DevTools \u6807\u7B7E\uFF09\u21D2 \u8865\u4E01\u4ECE\u672A\u6267\u884C\u3002\u73B0\u6539\u4E3A\u5728**\u6784\u9020\u671F**\u6355\u83B7 Worker \u540D\u5E76\u6CE8\u5165 Bearer \u51ED\u636E\uFF0C\u53E6\u52A0\u300C\u6D88\u606F\u5F62\u6001\u672C\u8EAB\u5C31\u662F\u4E0A\u4F20\u8BF7\u6C42\u300D\u4F5C\u7B2C\u4E8C\u9053\u6761\u4EF6\uFF1B\u767E\u5206\u6BD4\u8FDB\u5EA6\u4FDD\u7559",
        '**Fixed in-panel attachment uploads still failing**: the previous patch matched on `worker.name`, which Chromium reports as `null` (the name only labels the worker in DevTools), so the patch never ran. The name is now captured at construction time and a Bearer credential is injected, with a second "this message is an upload" condition as backup; percentage progress kept'
      ],
      [
        "**\u65B0\u589E\u4E0A\u4F20\u94FE\u8DEF\u6C99\u76D2\u56DE\u5F52**\uFF1A`npm run verify:upload`\uFF08\u8D77\u9694\u79BB\u5B9E\u4F8B\uFF0C\u5728\u771F\u5B9E\u6D4F\u89C8\u5668\u91CC\u6838\u5BF9\u8865\u4E01\u5728\u4F4D\u3001\u51ED\u636E\u5DF2\u6CE8\u5165\u3001\u5176\u4ED6 Worker \u4E0D\u88AB\u6539\u52A8\uFF09",
        "**New sandbox regression for the upload path**: `npm run verify:upload` boots an isolated instance and checks in a real browser that the patch is in place, credentials get injected, and other workers are untouched"
      ]
    ]
  },
  {
    version: "2.6.0",
    items: [
      [
        "\u65B0\u589E **DSH Profile \u8BBE\u7F6E\u9879**\uFF1A\u9762\u677F\u53EF\u7ED1\u5B9A\u72EC\u7ACB profile\uFF08\u81EA\u52A8\u4EE3\u5EFA\u3001\u6865\u63A5\u88C5\u5165\u8BE5\u6863\u3001\u6539\u7528 `dsh --profile` \u5F62\u6001\u3001\u72EC\u7ACB\u7AEF\u53E3\uFF09\uFF0C\u4E0E\u684C\u9762\u7248\u7B49\u5B9E\u4F8B\u5171\u5B58\uFF1B\u4F1A\u8BDD\u5B58\u50A8\u672C\u673A\u5171\u4EAB",
        "New **DSH profile setting**: the panel can bind its own profile (auto-created, bridge installed into it, launched as `dsh --profile` on its own port) and coexist with other instances; session storage is shared machine-wide"
      ],
      [
        "**\u4FEE\u590D\u9762\u677F\u5185\u62D6\u62FD/\u6309\u94AE\u4E0A\u4F20\u9644\u4EF6\u5931\u8D25\uFF08401\uFF09**\uFF1B\u7CFB\u7EDF\u6D4F\u89C8\u5668\u884C\u4E3A\u4E0D\u53D8",
        "**Fixed in-panel attachment uploads failing with 401**; system browser behaviour unchanged"
      ],
      [
        "**\u7AEF\u53E3\u4E0E\u8FDB\u7A0B\u5B89\u5168**\uFF1A\u300C\u91CD\u542F\u670D\u52A1\u300D\u53EA\u7EC8\u6B62\u63D2\u4EF6\u81EA\u5DF1\u62C9\u8D77\u7684\u5B9E\u4F8B\uFF0C\u5916\u90E8 DSH \u5360\u7528\u53EA\u63D0\u793A\u4E0D\u62A2\uFF1B\u8001\u7528\u6237\u9996\u6B21\u70B9\u91CD\u542F\u4F1A\u5F39\u786E\u8BA4\u6846",
        "**Port and process safety**: restarting only stops instances the plugin launched; a foreign DSH holding the port is reported, never killed; existing users get a confirmation dialog on the first restart"
      ],
      [
        "**\u53EA\u8BA4\u5B98\u65B9 DSH \u5305**\uFF1A\u672C\u673A\u7248\u672C\u53EA\u4ECE\u5B98\u65B9\u5305\u6E05\u5355\u8BFB\u53D6\uFF0C\u7B2C\u4E09\u65B9\u540C\u540D\u793E\u533A\u5305\uFF08`@x1a0f3n9/dsh-*`\uFF0C\u4E0E\u5B98\u65B9\u5171\u7528 0.1.5-rc.x \u53F7\u6BB5\uFF09\u4E0D\u518D\u88AB\u5F53\u6210\u672C\u4F53\uFF1B\u300C\u5347\u7EA7\u524D\u7ED3\u675F\u5168\u90E8 DSH\u300D\u7684\u8FDB\u7A0B\u8303\u56F4\u4E5F\u6309\u5B98\u65B9\u8EAB\u4EFD\u6536\u7A84",
        '**Only the official DSH package counts**: the local version comes from the official package manifest, so third-party same-named packages (`@x1a0f3n9/dsh-*`, which share the official 0.1.5-rc.x number space) are no longer mistaken for it; the pre-upgrade "stop all DSH" scope is narrowed to official identities too'
      ],
      [
        "**\u542F\u52A8\u65F6\u9002\u914D\u81EA\u68C0**\uFF1A\u6838\u5BF9\u672C\u673A DSH \u7248\u672C\u662F\u5426\u843D\u5728\u5B9E\u6D4B\u533A\u95F4 `0.1.5-rc.1 ~ 0.1.6-alpha.1`\u3001\u6865\u63A5\u662F\u5426\u771F\u7684\u5728\u9875\u9762\u751F\u6548\uFF1B\u5F02\u5E38\u5F39\u7A97\u5E76\u7ED9\u5904\u7F6E\u6309\u94AE\uFF0C\u540C\u79CD\u95EE\u9898 24 \u5C0F\u65F6\u5185\u53EA\u63D0\u9192\u4E00\u6B21",
        "**Startup compatibility check**: verifies the local DSH version against the verified range `0.1.5-rc.1 ~ 0.1.6-alpha.1` and whether the bridge is live in the served page; issues open a dialog with fix actions, at most once a day"
      ],
      [
        "**\u91CD\u5F00\u81EA\u52A8\u66F4\u65B0\u5E76\u65B0\u589E\u66F4\u65B0\u901A\u9053**\uFF1A\u4EC5\u6B63\u5F0F\u7248 / \u8DDF\u968F\u4E3B\u63A8\uFF08\u9ED8\u8BA4\uFF0C\u542B rc\u3001beta\uFF09/ \u542B alpha\uFF1B\u542F\u52A8\u540E\u6309\u901A\u9053\u68C0\u67E5\uFF08\u9ED8\u8BA4 24 \u5C0F\u65F6\u4E00\u6B21\uFF09\uFF0C\u53EA\u5F39\u786E\u8BA4\u6846\u7EDD\u4E0D\u9759\u9ED8\u5B89\u88C5",
        "**Auto-updates restored, with an update channel**: stable only / follow the pushed version (default; rc & beta) / include alpha; checked after startup (24h by default) and always asking before installing"
      ],
      [
        "**Profile \u6539\u4E3A\u4E0B\u62C9\u9009\u62E9 + \u65B0\u5EFA + \u5207\u6362\u786E\u8BA4**\uFF0C\u5E76\u62E6\u4E0B DSH \u5185\u7F6E\u6863\u540D\uFF08`acp` / `headless` / `sdk` / `sdk-minimal`\uFF09",
        "**Profile is now picked from a dropdown** with create-and-switch confirmation; built-in DSH names (`acp` / `headless` / `sdk` / `sdk-minimal`) are rejected"
      ],
      [
        "**\u8BBE\u7F6E\u9875\u91CD\u6392**\uFF1A\u9AD8\u7EA7\u533A\u5206\u56DB\u7EC4\uFF08\u670D\u52A1\u8FD0\u884C / DSH Profile / \u66F4\u65B0\u4E0E\u5B89\u88C5\u6E90 / \u9002\u914D\u81EA\u68C0\uFF09\uFF1B\u300C\u63D2\u4EF6\u4FE1\u606F\u300D\u65B0\u589E\u300CDSH\u7248\u672C\u9002\u914D\u8BF4\u660E\u300D\u5F39\u7A97",
        "**Settings regrouped**: the advanced area splits into Service runtime / DSH profile / Updates & install sources / Compatibility, and the plugin info row links to a DSH compatibility explanation"
      ]
    ]
  },
  {
    version: "2.5.3",
    items: [
      [
        '\u6CE8\u5165\u9690\u5F0F\u884C\u6539\u4E3A**\u53EA\u6539\u90A3\u4E00\u5C0F\u6BB5**\uFF08\u4E0D\u518D\u6E05\u7A7A\u91CD\u5199\u6574\u4E2A\u804A\u5929\u6846\uFF09\uFF1A\u2460 \u6846\u91CC\u5DF2\u6709\u9690\u5F0F\u884C \u2192 \u53EA\u628A\u8BE5\u884C\u539F\u5730\u66FF\u6362\u6210\u65B0\u884C\uFF081 \u6B21\u5199\u5165\uFF0C**\u4E0D\u518D\u51FA\u73B0"\u8F93\u5165\u6846\u77AC\u95F4\u4E3A\u7A7A"\u7684\u95EA\u70C1**\uFF09\uFF1B\u2461 \u53D6\u6D88\u6846\u9009 \u2192 \u53EA\u5220\u8BE5\u884C\uFF1B\u2462 \u9996\u6B21\u6CE8\u5165 \u2192 \u5149\u6807\u79FB\u5230\u6700\u524D\u63D2\u5165\u65B0\u884C\u518D\u8865\u4E00\u4E2A\u6BB5\u843D\u5206\u9694\uFF0C\u4F60\u5DF2\u8F93\u5165\u7684\u6587\u5B57\u59CB\u7EC8\u7559\u5728\u4E0B\u9762\u4E0D\u52A8\u3002\u786C\u5224\u636E\u662F\u300C\u9690\u5F0F\u884C\u6761\u6570\u6B63\u786E **\u4E14** \u884C\u4EE5\u5916\u7684\u5185\u5BB9\u4E0E\u6CE8\u5165\u524D\u9010\u5B57\u4E00\u81F4\u300D\u2014\u2014\u4F60\u7684\u6587\u5B57\u5168\u7A0B\u4E0D\u7ECF\u63D2\u4EF6\u4E4B\u624B\uFF0C\u4E00\u65E6\u8FD9\u4E2A\u4E0D\u53D8\u91CF\u88AB\u7834\u574F\uFF08\u5199\u5165\u671F\u95F4\u4F60\u53C8\u8F93\u5165\u4E86\u5B57\u3001\u884C\u88AB\u590D\u5236\u6210\u4E24\u6761\u3001\u7F16\u8F91\u5668\u505A\u4E86\u522B\u7684\u4E8B\uFF09\u5C31\u6574\u4F53\u9000\u56DE\u65E7\u8DEF\u5F84\uFF0C\u7EDD\u4E0D\u9759\u9ED8\u7559\u4E0B\u9519\u4E71\u5185\u5BB9\u3002\u53E6\u4FEE**\u7126\u70B9\u88AB\u62A2**\uFF08\u4E09\u9879\u53E0\u52A0\uFF09\uFF1A\u2460**\u7126\u70B9\u4E0D\u5728\u804A\u5929\u6846\u65F6\u4E00\u5F8B\u4E0D\u5199**\u2014\u2014\u5199\u5165\u672C\u8EAB\u8981\u6C42\u8F93\u5165\u6846\u83B7\u5F97\u7126\u70B9\uFF0C\u56E0\u6B64\u7126\u70B9\u5728\u7B14\u8BB0\u4FA7\u65F6\u63D2\u4EF6\u53EA\u8BB0\u4E0B\u5F85\u5199\u5165\u5185\u5BB9\uFF0C\u7B49\u4F60\u70B9\u8FDB\u804A\u5929\u6846\uFF08\u7126\u70B9\u8FDB\u5165\u8F93\u5165\u6846\uFF09\u90A3\u4E00\u523B\u518D\u8865\u4E0A\uFF0C\u4ECE\u7ED3\u6784\u4E0A\u4E0D\u518D\u62A2\u7126\u70B9\uFF1B\u2461\u5728"\u4F60\u6B63\u5728\u7B14\u8BB0\u91CC\u6253\u5B57"\uFF08\u8DDD\u6700\u8FD1\u4E00\u6B21\u6309\u952E 300ms \u5185\uFF09\u65F6\u4E0D\u89E6\u53D1\u81EA\u52A8\u586B\u5145\uFF1B\u2462\u9875\u9762\u4FA7\u5728\u7126\u70B9\u672C\u6765\u5C31\u5728 Obsidian \u65F6\u4E3B\u52A8\u628A\u7A97\u53E3\u7126\u70B9\u4EA4\u8FD8\u7236\u9875\uFF0C\u5199\u5165\u7A97\u53E3\u4E5F\u4ECE\u7EA6 600ms \u7F29\u77ED\u5230\u7EA6 90ms',
        'The implicit line is now written **in place** instead of clearing and rewriting the whole chat box: (1) when the line is already there, only that line is replaced (a single write, so the composer no longer flashes empty); (2) cancelling a selection removes only that line; (3) on first injection the caret goes to the very top, the line is inserted and a paragraph break is added, so whatever you had typed stays below untouched. The hard acceptance check is "exactly one implicit line **and** everything except that line byte-identical to before" \u2014 your text never passes through the plugin, and if that invariant breaks (you typed during the write, the line got duplicated, the editor did something else) the whole thing falls back to the old path rather than silently leaving a mess. Also fixes **focus stealing** (three layers): (1) **nothing is written while the chat box is not focused** \u2014 writing inherently requires the composer to take focus, so while focus is in your note the plugin only remembers the line and inserts it the moment you click into the chat box, which removes focus stealing structurally; (2) no auto-fill while you are typing in a note (within 300 ms of your last keystroke); (3) the page hands window focus back to the host when focus was in Obsidian, and the write window shrank from roughly 600 ms to about 90 ms'
      ]
    ]
  },
  {
    version: "2.5.2",
    items: [
      [
        '\u4FEE\u590D\u957F\u4F1A\u8BDD\u4E0B\u300C\u6CE8\u5165\u9690\u5F0F\u884C\u540E\uFF0C\u4E00\u5728\u804A\u5929\u6846\u6253\u5B57\u5C31\u6301\u7EED\u95EA\u70C1\uFF1B\u7528\u5FEB\u6377\u952E\u8F93\u5165\u5076\u53D1\u591A\u6B21\u590D\u5236\u300D\uFF1A\u2460 **\u5E42\u7B49\u77ED\u8DEF**\u2014\u2014\u586B\u5145\u524D\u5148\u6BD4\u5BF9\u76EE\u6807\u6587\u672C\u4E0E\u8F93\u5165\u6846\u5F53\u524D\u5185\u5BB9\uFF0C\u4E00\u81F4\u5C31\u4E00\u4E2A\u5B57\u90FD\u4E0D\u6539\uFF08\u957F\u4F1A\u8BDD\u4E0B\u7236\u9875\u9009\u533A\u4E8B\u4EF6\u4F1A\u9AD8\u9891\u91CD\u53D1\u540C\u4E00\u4EFD\u8349\u7A3F\uFF0C\u65E7\u7248\u6BCF\u6B21\u90FD\u6267\u884C"\u5168\u9009\u2192\u5220\u9664\u2192\u91CD\u5199"\uFF0C\u95EA\u70C1\u4E0E\u91CD\u590D\u90FD\u6765\u81EA\u8FD9\u91CC\uFF09\uFF1B\u2461 **\u7126\u70B9\u5728\u9762\u677F\u5185\u65F6\u4E0D\u518D\u81EA\u52A8\u6CE8\u5165**\u2014\u2014\u7126\u70B9\u8FDB\u5165 iframe \u4F1A\u8BA9\u7236\u6587\u6863\u9009\u533A\u88AB\u6E05\u7A7A\u5E76\u89E6\u53D1\u9009\u533A\u4E8B\u4EF6\uFF0C\u65E7\u7248\u636E\u6B64\u53CD\u590D\u4E0B\u53D1"\u6E05\u9664/\u91CD\u586B"\u8349\u7A3F\uFF1B\u2462 **ACK \u4E0D\u518D\u65E0\u6761\u4EF6\u62A2\u7126\u70B9**\u2014\u2014\u586B\u5145\u524D\u7126\u70B9\u82E5\u5DF2\u5728 DSH \u8F93\u5165\u6846\u5185\uFF0C\u63D2\u4EF6\u4E0D\u518D\u628A\u7126\u70B9\u593A\u56DE Obsidian \u7F16\u8F91\u5668\uFF08\u65E7\u7248\u4F1A\u8BA9\u6253\u5B57\u843D\u70B9\u9519\u4E71\uFF09\uFF1B\u2463 \u76F8\u540C\u8349\u7A3F\u4E0D\u91CD\u590D\u4E0B\u53D1\uFF0C\u5E76\u65B0\u589E**\u586B\u5145\u9065\u6D4B**\uFF1A\u6BCF 3 \u79D2\u628A `total/same/wrote/composerFocus` \u6C47\u603B\u4E00\u884C\u5199\u5165 `dsh-panel-diag.log`\uFF0C\u4FBF\u4E8E\u5B9A\u4F4D\u8FD9\u7C7B\u53EA\u5728\u957F\u4F1A\u8BDD\u51FA\u73B0\u7684\u65F6\u5E8F\u95EE\u9898',
        'Fixes "after injecting the implicit line, the chat box flickers continuously while typing, and shortcut input sometimes duplicates text" in long sessions: (1) **idempotent short-circuit** \u2014 the target text is compared with the composer content before filling, and nothing is written when they already match (in long sessions the host document re-sends the same draft at high frequency, and the old version ran a full "select all \u2192 delete \u2192 rewrite" every time, which is exactly where the flicker and duplication came from); (2) **no auto-injection while the panel has focus** \u2014 focusing the iframe clears the parent document selection and fires selection events, which the old version turned into repeated clear/refill drafts; (3) **the ACK no longer steals focus unconditionally** \u2014 if the DSH composer already had focus before the fill, the plugin no longer yanks focus back to the Obsidian editor (which used to misroute keystrokes); (4) identical drafts are no longer re-sent, and **fill telemetry** was added: every 3 seconds one line with `total/same/wrote/composerFocus` goes into `dsh-panel-diag.log` so timing problems that only appear in long sessions can be pinpointed'
      ]
    ]
  },
  {
    version: "2.5.1",
    items: [
      [
        '\u4FEE\u590D v2.5.0 \u5F15\u5165\u7684\u56DE\u5F52\u300C\u91CD\u65B0\u6846\u9009\u6216\u53D6\u6D88\u6846\u9009\uFF0C\u9690\u5F0F\u884C\u4E0D\u81EA\u52A8\u53D8\u66F4\u300D\uFF1Av2.5.0 \u7528**\u4E8B\u4EF6\u8BA1\u6570**\u5224\u65AD"\u7528\u6237\u662F\u5426\u4E2D\u9014\u6539\u4E86\u8F93\u5165\u6846"\uFF08\u6570 `keydown`/`beforeinput`/`paste`/`drop`\uFF09\uFF0C\u4F46\u53D7\u63A7\u7F16\u8F91\u5668\uFF08Lexical\uFF09\u5728\u83B7\u53D6\u7126\u70B9\u3001\u9009\u533A\u53D8\u5316\u3001\u4EE5\u53CA\u5B83\u81EA\u5DF1\u5904\u7406\u5199\u5165\u56DE\u54CD\u65F6\u4E5F\u4F1A\u6D3E\u53D1\u540C\u7C7B\u4E8B\u4EF6\uFF0C\u88AB\u5F53\u6210"\u7528\u6237\u8F93\u5165" \u2192 \u586B\u5145\u5728\u5199\u5165\u524D\u5C31\u6574\u4F53\u653E\u5F03 \u2192 \u8F93\u5165\u6846\u91CC\u7684\u9690\u5F0F\u884C\u505C\u5728\u4E0A\u4E00\u6B21\u7684\u5185\u5BB9\u4E0D\u518D\u66F4\u65B0\u3002\u73B0\u6539\u4E3A**\u6309\u5185\u5BB9\u6BD4\u5BF9**\u5224\u5B9A\uFF1A\u53EA\u6709\u51FA\u73B0\u300C\u65E2\u4E0D\u5C5E\u4E8E\u672C\u6B21\u76EE\u6807\u6587\u672C\u3001\u4E5F\u4E0D\u662F\u672C\u6B21\u5199\u5165\u524D\u539F\u5185\u5BB9\u300D\u7684\u6587\u672C\u624D\u7B97\u7528\u6237\u63D2\u4E86\u8FDB\u6765\uFF08\u5171\u4EAB\u6E90\u4E32 `INTRUDED_SOURCE`\uFF0C\u884C\u4E3A\u7EA7\u6D4B\u8BD5\u8986\u76D6\u5206\u9636\u6BB5\u4E2D\u95F4\u6001\u3001\u6E05\u7A7A\u5931\u8D25\u3001\u7528\u6237\u65B0\u8F93\u5165\u3001\u53D6\u6D88\u6846\u9009\u56DB\u7C7B\u573A\u666F\uFF09\uFF1B\u540C\u65F6\u6062\u590D"\u6574\u4E32\u66FF\u6362"\u6536\u5C3E\u515C\u5E95\u2014\u2014\u6E05\u7A7A\u5931\u8D25\u6216\u63D2\u5165\u88AB\u62D2\u65F6\u518D\u6574\u4E32\u5199\u4E00\u6B21\uFF08\u65E7\u7248\u6B64\u5904\u76F4\u63A5\u653E\u5F03\uFF0C\u4E5F\u4F1A\u8868\u73B0\u4E3A"\u4E0D\u66F4\u65B0"\uFF09\uFF0C\u8BE5\u515C\u5E95\u53D7\u5185\u5BB9\u6BD4\u5BF9\u5B88\u536B\u4FDD\u62A4\uFF0C\u4E0D\u4F1A\u50CF\u65E9\u671F\u7248\u672C\u90A3\u6837\u56DE\u5199\u65E7\u5FEB\u7167',
        'Fixes a v2.5.0 regression: "re-selecting or cancelling a selection no longer updates the implicit line". v2.5.0 detected "did the user edit the composer meanwhile?" by **counting events** (`keydown`/`beforeinput`/`paste`/`drop`), but a controlled editor (Lexical) also dispatches such events when it receives focus, when the selection changes and while it processes the echo of a programmatic write \u2014 those were misread as user input, so the fill aborted before writing and the implicit line stayed at its previous content. The check is now **content-based**: only text that is neither part of the intended target string nor the composer\'s content before this write counts as the user having typed (shared source string `INTRUDED_SOURCE`, with behavioural tests covering staged intermediate states, a failed clear, fresh user input and cancel-selection). The final whole-string replace fallback is restored as well \u2014 when the clear fails or the insert is rejected it writes the merged text once more (the old version simply gave up, which also showed up as "not updating"); that fallback is protected by the content check, so it can no longer write back a stale snapshot the way earlier versions did'
      ]
    ]
  },
  {
    version: "2.5.0",
    items: [
      [
        '\u5BF9\u8BDD\u91CC\u7684 `[[wikilink]]` \u73B0\u5728\u53EF\u76F4\u63A5\u70B9\u51FB\u6253\u5F00\uFF1A\u6D88\u606F\u6E32\u67D3\u65F6\u628A `[[\u7B14\u8BB0\u540D]]` / `[[\u8DEF\u5F84/\u7B14\u8BB0\u540D|\u522B\u540D]]` \u6CE8\u89E3\u6210 Obsidian \u5185\u94FE\u6837\u5F0F\uFF08\u81EA\u52A8\u8DF3\u8FC7\u4EE3\u7801\u5757\u3001\u884C\u5185\u4EE3\u7801\u4E0E\u8F93\u5165\u6846\uFF09\uFF0C\u70B9\u51FB\u540E\u5728 Obsidian \u4E2D\u6253\u5F00\u5BF9\u5E94\u7B14\u8BB0\uFF1B\u89E3\u6790\u4EA4\u7ED9 Obsidian \u81EA\u5DF1\u5B8C\u6210\uFF08\u652F\u6301\u7701\u7565 `.md` \u4E0E `#\u6807\u9898` \u951A\u70B9\uFF09\uFF0C\u627E\u4E0D\u5230\u65F6\u660E\u786E\u63D0\u793A\u300C\u672A\u627E\u5230\u7B14\u8BB0\u300D\u3002\u987A\u5E26\u4FEE\u590D\uFF1A\u6D88\u606F\u91CC\u7684\u8DEF\u5F84\u70B9\u51FB\u65E7\u903B\u8F91\u662F"\u5148\u62E6\u622A\u518D\u5224\u65AD"\uFF0C\u9047\u5230 `[[\u8DEF\u5F84|\u522B\u540D]]` \u8FD9\u7C7B\u6587\u672C\u4F1A\u628A\u70B9\u51FB\u541E\u6389\uFF08\u73B0\u5728\u89E3\u6790\u6210\u529F\u624D\u62E6\u622A\uFF09\u3002\u53E6\u65B0\u589E**\u6BCF\u4F1A\u8BDD\u4E00\u6B21**\u7684\u300C\u53CC\u94FE\u7EA6\u5B9A\u300D\u6307\u4EE4\uFF0C\u5F15\u5BFC\u6A21\u578B\u5F15\u7528\u5E93\u5185\u7B14\u8BB0\u65F6\u4F7F\u7528 `[[wikilink]]` \u800C\u975E\u88F8\u8DEF\u5F84',
        'Conversation `[[wikilinks]]` are now clickable: message rendering annotates `[[note]]` / `[[path/note|alias]]` with Obsidian internal-link styling (skipping code blocks, inline code and the composer), and clicking opens the note in Obsidian. Resolution is delegated to Obsidian itself (supports omitted `.md` and `#heading` anchors), and a missing target now reports "note not found". Also fixed: the path-click handler used to intercept before resolving, swallowing clicks on text like `[[path|alias]]` (it now only intercepts when resolution succeeds). A once-per-session "wikilink convention" instruction also nudges the model to reference vault notes with `[[wikilinks]]` instead of bare paths'
      ],
      [
        "\u4FEE\u590D\u300C\u6846\u9009\u540E\u6309 Backspace / Ctrl+Z \u7B49\u7F16\u8F91\u952E\uFF0C\u9690\u5F0F\u6865\u63A5\u51FA\u95EE\u9898\u300D\uFF08\u5FEB\u6377\u952E\u4E0D\u751F\u6548\u3001\u9690\u5F0F\u884C\u88AB\u590D\u5236\u591A\u6B21\u3001DSH \u8F93\u5165\u6846\u51FA\u73B0\u602A\u6587\u5B57\uFF09\uFF1A\u2460 \u6865\u63A5\u586B\u5145\u53EA\u5728\u4E0E DSH \u8F93\u5165\u6846\u7684\u5199\u5165\u77AC\u95F4\u6301\u6709\u7126\u70B9\uFF0C\u5199\u5B8C\u7ACB\u5373\u628A\u7126\u70B9\u8FD8\u7ED9\u6CE8\u5165\u524D\u7684\u5143\u7D20\uFF08\u65E7\u7248\u4ECE\u6CE8\u5165\u5230\u7ED3\u675F\u7EA6 200\u2013600ms \u4E00\u76F4\u5360\u7740\u7126\u70B9\uFF0C\u7F16\u8F91\u952E\u5168\u6253\u5230 DSH \u800C\u975E Obsidian\uFF09\uFF1B\u2461 \u65B0\u589E**\u4EE3\u9645\u5B88\u536B**\u2014\u2014\u586B\u5145\u671F\u95F4\u7528\u6237\u5728\u8F93\u5165\u6846\u91CC\u6309\u952E\u3001\u7C98\u8D34\u6216\u8F93\u5165\uFF08`keydown`/`beforeinput`/`paste`/`drop`\uFF0C\u81EA\u8EAB\u5199\u5165\u4E0D\u8BA1\u6570\uFF09\uFF0C\u672C\u6B21\u586B\u5145\u6574\u4F53\u653E\u5F03\uFF0C\u4E0D\u518D\u56DE\u5199\u9648\u65E7\u5185\u5BB9\uFF1B\u2462 \u5220\u9664\u7528 `textContent` \u6574\u4E32\u8986\u76D6\u8F93\u5165\u6846\u7684\u515C\u5E95\uFF08\u5B83\u4F1A\u5199\u5165\u6CE8\u5165\u5F00\u59CB\u65F6\u7684\u65E7\u5FEB\u7167\uFF0C\u6B63\u662F\u300C\u602A\u6587\u5B57\u300D\u6765\u6E90\uFF09\uFF0C\u6700\u540E\u515C\u5E95\u4EC5\u5728\u8F93\u5165\u6846\u786E\u5B9E\u4E3A\u7A7A\u4E14\u7528\u6237\u672A\u52A8\u8FC7\u65F6\u624D\u6267\u884C\uFF1B\u2463 \u7F16\u8F91\u952E\uFF08`Ctrl+Z/Y/A/C/X/V`\u3001Backspace\u3001Delete\u3001Enter\u3001Tab\u3001Esc\u3001\u65B9\u5411\u952E\u3001Home/End/PageUp/PageDown\uFF09\u4E0D\u518D\u88AB\u5FEB\u6377\u952E\u900F\u4F20 `preventDefault` \u540E\u8F6C\u53D1\u7ED9 Obsidian\u2014\u2014\u5B83\u4EEC\u7559\u5728 DSH \u5185\u90E8\uFF0CDSH \u81EA\u5DF1\u7684\u64A4\u9500/\u9009\u62E9/\u5220\u9664\u6062\u590D\u53EF\u7528\uFF08`Ctrl+O/P/,` \u7B49 Obsidian \u5168\u5C40\u5FEB\u6377\u952E\u4ECD\u7167\u5E38\u900F\u4F20\uFF09\uFF0C\u5E76\u5BF9\u300C\u8BF7\u6C42\u5FEB\u6377\u952E\u914D\u7F6E\u300D\u6D88\u606F\u52A0 5 \u79D2\u8282\u6D41",
        'Fixed "editing keys (Backspace, Ctrl+Z, ...) misbehave after a box selection" (shortcuts not taking effect, the implicit bridge line duplicated several times, stray text appearing in the DSH composer): (1) the bridge now holds focus on the DSH composer only for the instant of each write and immediately hands focus back to the previously focused element \u2014 the old version held focus for the whole 200-600 ms fill, so every editing key landed in DSH instead of Obsidian; (2) a new **generation guard** aborts the whole fill if the user types, pastes or otherwise inputs into the composer meanwhile (`keydown`/`beforeinput`/`paste`/`drop`, with the bridge\'s own writes excluded), so stale content is never written back; (3) the `textContent` whole-string overwrite fallback was removed \u2014 it wrote the snapshot taken at fill start, the very source of the "stray text"; the last-resort write now runs only when the composer is verifiably empty and untouched; (4) editing keys (`Ctrl+Z/Y/A/C/X/V`, Backspace, Delete, Enter, Tab, Esc, arrows, Home/End/PageUp/PageDown) are no longer `preventDefault`-ed and forwarded to Obsidian by the shortcut passthrough \u2014 they stay inside DSH so its own undo/selection/deletion works again (Obsidian global hotkeys such as `Ctrl+O/P/,` still pass through), and the "request shortcut config" message is throttled to 5 s'
      ]
    ]
  },
  {
    version: "2.4.4",
    items: [
      [
        "\u4FEE\u590D\u300C\u591A\u6B21\u6846\u9009\u7B14\u8BB0\u6CE8\u5165 \u2192 DSH \u5D29\u6E83\u300D\uFF1A\u6865\u63A5\u539F\u5148\u5728**\u6BCF\u4E00\u6B65** pre-step \u90FD\u5F80\u4F1A\u8BDD\u8FFD\u52A0\u4E00\u6761\u6CE8\u5165\u6D88\u606F\uFF0C\u53BB\u91CD\u53EA\u626B\u5F53\u524D\u6D88\u606F\u7A97\u53E3\u2014\u2014\u4E0A\u4E0B\u6587\u4E00\u65E6\u538B\u7F29\uFF08\u771F\u673A\u5B9E\u6D4B `compaction/prune` 48 \u6B21\uFF09\u628A\u90A3\u6761\u6D88\u606F\u88C1\u51FA\u7A97\u53E3\uFF0C\u5C31\u4F1A\u6BCF\u6B65\u518D\u6CE8\u5165\u4E00\u6761\uFF0C\u5F62\u6210\u81EA\u589E\u5F3A\u5FAA\u73AF\uFF08\u771F\u673A\u540E\u679C\uFF1A\u5355\u4F1A\u8BDD 11.8MB\u3001`user/message` 564 \u6761\u3001\u9762\u677F DOM 279 \u4E07\u5B57 \u2192 DSH \u5D29\u6E83\uFF09\u3002\u73B0\u6539\u4E3A DSH \u539F\u751F**\u4E00\u6B21\u6027\u6295\u9012**\uFF08`agent.inbox.prepend('next-step')`\uFF0C\u6D88\u8D39\u5373\u6D88\u5931\uFF0C\u4E0D\u518D\u843D\u6210\u6BCF\u6B65\u4E00\u6761\u6301\u4E45\u6D88\u606F\uFF09+ **\u4E09\u5C42\u53BB\u91CD**\uFF08inbox \u5F85\u6295\u9012\u7B7E\u540D\u6BD4\u5BF9 / `agent.session.surface` \u6BD4\u5BF9 / \u672C\u5730\u53F0\u8D26 `inject-ledger.json`\uFF1A\u540C\u4E00\u9009\u533A 10 \u5206\u949F\u5185\u53EA\u6CE8\u5165\u4E00\u6B21\uFF0C**\u4E0D\u4F9D\u8D56\u4F1A\u8BDD\u7A97\u53E3**\uFF0C\u538B\u7F29\u88C1\u526A\u4E5F\u51FB\u4E0D\u7A7F\uFF09+ **\u5355\u4F1A\u8BDD 20 \u6B21\u7194\u65AD**\uFF08\u8D85\u9650\u505C\u6B62\u6CE8\u5165\u3001\u7559 `storm` \u6807\u8BB0\u5E76\u5728\u63D2\u4EF6\u52A0\u8F7D\u65F6\u63D0\u793A\u4E00\u6B21\uFF1B`inject-log.jsonl` \u8BB0\u5F55\u6BCF\u6B21\u5224\u5B9A\u4FBF\u4E8E\u81EA\u8BC1\uFF09",
        "Fixed \"DSH crashes after injecting many box selections\": the bridge used to append a fresh injected message on **every** pre-step, de-duplicating only against the current message window \u2014 once context compaction (48 `compaction/prune` events on the real machine) dropped that message out of the window, it injected again on every step, a self-reinforcing loop (a single session grew to 11.8MB / 564 user messages / a 2.79M-character panel DOM \u2192 DSH crashed). It now uses DSH's native **one-shot delivery** (`agent.inbox.prepend('next-step')`, consumed and gone, no per-step persisted message) plus **three-layer de-duplication** (pending inbox signature / `agent.session.surface` / a local ledger `inject-ledger.json` that injects a given selection only once per 10 minutes, **independent of the message window**, so compaction cannot defeat it) and a **20-per-session circuit breaker** (stops injecting, records a `storm` flag surfaced once at plugin load, and logs every decision to `inject-log.jsonl`)"
      ]
    ]
  },
  {
    version: "2.4.3",
    items: [
      [
        '\u6865\u63A5\u586B\u5145\u6062\u590D\u4E3A 2.4.0 \u7684\u5B9E\u73B0\uFF08\u5168\u5C40\u5254\u9664\u65E7\u9690\u5F0F\u884C + \u5148\u6E05\u7A7A\u518D\u5199\u5165 + \u6709\u6B63\u6587\u65F6\u7528\u539F\u751F\u6BB5\u843D\u9020\u771F\u6362\u884C + \u514D\u95EA\u84DD\uFF09\uFF0C\u5E76**\u79FB\u9664\u63D2\u4EF6\u4FA7\u7684\u5931\u8D25\u91CD\u8BD5**\uFF08\u5B83\u4F1A\u628A\u91CD\u590D\u653E\u5927\u6210"\u591A\u8F6E\u91CD\u590D\u663E\u793A"\uFF09\uFF1B\u767D\u5C4F\u4FEE\u590D\u6539\u4E3A**\u81EA\u52A8\u5316\u624B\u52A8\u5237\u65B0**\uFF08\u9996\u6B21\u6253\u5F00 4s \u5185\u6865\u63A5\u672A\u5C31\u7EEA\u5219\u81EA\u52A8\u6574\u89C6\u56FE\u91CD\u6E32\u67D3\u4E00\u6B21\uFF0C\u6700\u591A 2 \u6B21\uFF09\u3002\u53E6\u4FEE\u300C\u8BBE\u7F6E\u91CC\u91CD\u542F\u670D\u52A1\u540E DSH \u767D\u5C4F\u3001\u5237\u65B0\u62A5\u9519\u3001\u8981\u518D\u91CD\u542F\u4E00\u6B21\u624D\u6B63\u5E38\u300D\uFF1A\u6839\u56E0\u662F `taskkill` \u8FD4\u56DE \u2260 \u8FDB\u7A0B\u5DF2\u9000\u51FA\uFF0C\u7D27\u968F\u5176\u540E\u7684\u5728\u7EBF\u63A2\u6D4B\u628A"\u6B63\u5728\u6B7B\u53BB\u7684\u65E7\u8FDB\u7A0B"\u8BEF\u5224\u4E3A\u5DF2\u5C31\u7EEA\u3001\u4E8E\u662F\u4E0D\u62C9\u8D77\u65B0\u670D\u52A1\uFF1B\u73B0\u5728\u7ED3\u675F\u540E\u4F1A**\u8F6E\u8BE2\u7B49\u5F85\u8FDB\u7A0B\u771F\u6B63\u9000\u51FA**\u5E76**\u7B49\u5F85\u7AEF\u53E3\u771F\u6B63\u91CA\u653E**\u518D\u542F\u52A8',
        'Bridge filling is back to the 2.4.0 implementation (global removal of old implicit lines + clear-then-write + a native paragraph break when user text exists + no selection flash), with the **plugin-side retry removed** (it amplified duplication into repeated lines). The blank-panel fix now **automates the manual refresh** (one full view re-render if the bridge is not ready within 4s of first open, at most twice). Also fixed "restarting the service in settings leaves the panel blank, a refresh errors, and only a second restart works": `taskkill` returning does not mean the process has exited, so the readiness probe saw the dying process as healthy and never started a new one; shutdown now **polls until the processes really exit** and **waits for the port to be released** before starting'
      ]
    ]
  },
  {
    version: "2.4.2",
    items: [
      [
        "\u4FEE\u590D\u5546\u5E97\u5BA1\u6838\u62A5\u9519 obsidianmd/no-static-styles-assignment\uFF1Aiframe \u91CD\u7ED8\u8F7B\u63A8\u6539\u4E3A\u5207\u6362 CSS \u7C7B\uFF08\u4E0D\u518D\u76F4\u63A5\u5199\u5185\u8054\u6837\u5F0F\uFF09\uFF0C\u5E76\u628A\u8BE5\u89C4\u5219\u52A0\u5165\u672C\u5730\u53D1\u5E03\u95E8\u7981\u9632\u590D\u53D1",
        "Fixed the store review error obsidianmd/no-static-styles-assignment: the iframe repaint nudge now toggles a CSS class instead of writing inline styles, and the rule is now enforced by the local release gate"
      ]
    ]
  },
  {
    version: "2.4.1",
    items: [
      [
        "\u4FEE\u590D\u300C\u9996\u6B21\u6253\u5F00\u9762\u677F\u3001DSH \u52A0\u8F7D\u5B8C\u6210\u540E\u767D\u5C4F\uFF0C\u9700\u624B\u52A8\u5237\u65B0\u4E00\u6B21\u624D\u663E\u793A\u300D\uFF1A\u89C6\u56FE\u521A\u6253\u5F00\u65F6\u5BB9\u5668\u5E38\u5E38\u8FD8\u662F 0 \u5C3A\u5BF8/\u672A\u5E03\u5C40\uFF0C\u6587\u6863\u867D\u52A0\u8F7D\u5B8C\u6210\u4E5F\u4E0D\u4F1A\u7ED8\u5236\uFF1B\u73B0\u6539\u4E3A\u5BB9\u5668\u5C3A\u5BF8\u5C31\u7EEA\u540E\u81EA\u52A8\u91CD\u8F7D\u4E00\u6B21\uFF0C\u5E76\u5728 iframe \u52A0\u8F7D\u5B8C\u6210\u3001\u7531\u9690\u85CF\u8F6C\u53EF\u89C1\u65F6\u505A\u4E00\u6B21\u50CF\u7D20\u7EA7\u91CD\u7ED8\u8F7B\u63A8\uFF08\u4E0D\u6253\u65AD\u5DF2\u5C31\u7EEA\u7684\u9762\u677F\uFF09",
        "Fixed the blank panel on first open (DSH finished loading but nothing painted until a manual refresh): the container is often still zero-sized when the view opens, so the loaded document never paints. The frame now reloads once the container has real size, and a pixel-level repaint nudge runs after load and when the view becomes visible again (without disturbing an already-ready panel)"
      ]
    ]
  },
  {
    version: "2.4.0",
    items: [
      [
        "\u9002\u914D DSH 0.1.5 \u7CFB\u5E76\u653E\u5F00\u7248\u672C\u9489\u4F4F\uFF1A\u4E00\u952E\u914D\u7F6E/\u5378\u8F7D\u91CD\u88C5\u5B89\u88C5\u5B98\u65B9\u6700\u65B0\u7248\uFF080.1.5 \u5DF2\u5B9E\u6D4B\u9002\u914D\uFF09\uFF0C\u4EC5 0.1.2\u20130.1.4 \u4FDD\u7559\u7EA2\u5B57\u529D\u9000\uFF1B\u5DF2\u88C5 CLI \u843D\u5728\u4E0D\u517C\u5BB9\u533A\u95F4\u65F6\u81EA\u52A8\u5347\u7EA7",
        "DSH 0.1.5 support and unpinned installs: one-click configure and clean reinstall now install the official latest (0.1.5 verified); only 0.1.2\u20130.1.4 keep the red warning, and an installed CLI in that range is upgraded automatically"
      ],
      [
        "\u4FEE\u590D\u65B0\u7248 DSH \u6BCF\u6B21\u8BF7\u6C42\u62A5\u300CDeepSeek request extension preparation failed\u300D\uFF1A\u6865\u63A5\u6539\u4E3A\u72EC\u7ACB\u63D2\u4EF6\u5305\uFF08\u81EA\u5E26 package.json \u4E0E\u7248\u672C\u53F7\uFF09\uFF0C\u4E0D\u518D\u88AB\u5F53\u6210 profile \u7684\u677E\u6563\u6A21\u5757",
        'Fixed the per-request "DeepSeek request extension preparation failed" error on newer DSH: the bridge now ships as its own plugin package (own package.json/version) instead of a loose module owned by the profile manifest'
      ],
      [
        "\u4FEE\u590D\u5347\u7EA7\u65B0\u7248\u540E\u5386\u53F2\u4F1A\u8BDD\u4E0D\u53EF\u89C1\uFF1A\u6865\u63A5\u7F16\u8F91\u6307\u4EE4\u6539\u7528 DSH \u89C4\u8303\u6D88\u606F\u5F62\u6001\uFF08source.form=notice + summary\uFF09\uFF0C\u65E7\u5E03\u5C40\u81EA\u52A8\u8FC1\u79FB\u5E76\u4FDD\u7559 .bak-local",
        "Fixed missing chat history after upgrading DSH: bridge edit instructions now use DSH's canonical message shape (source.form=notice + summary); the old bridge layout is migrated automatically with a .bak-local backup"
      ],
      [
        "\u66F4\u65B0\u6D41\u7A0B\u52A0\u56FA\uFF1A\u66F4\u65B0/\u91CD\u88C5\u524D\u7ED3\u675F\u6240\u6709 DSH \u8FDB\u7A0B\uFF08\u542B\u5176\u5B83\u5B9E\u4F8B\uFF0C\u5F39\u7A97\u7EA2\u5B57\u9884\u544A\uFF09\uFF1B\u5347\u7EA7\u524D\u81EA\u52A8\u5907\u4EFD\u4F1A\u8BDD\u76EE\u5F55\uFF08\u5931\u8D25\u5373\u4E2D\u6B62\uFF09\uFF1B\u5347\u7EA7\u540E\u53EA\u8BFB\u9884\u68C0\u5E76\u5728\u53D1\u73B0\u4E0D\u53EF\u8BFB\u4F1A\u8BDD\u65F6\u76F4\u63A5\u6253\u5F00\u4FEE\u590D\u5165\u53E3\uFF1B\u5347\u7EA7\u540E\u6309\u65B0\u8BA4\u8BC1\u51ED\u8BC1\u81EA\u52A8\u91CD\u8F7D\u9762\u677F\uFF08\u4FEE\u590D\u300Cdsh web authentication required\u300D\uFF09",
        'Hardened upgrade flow: all DSH processes are terminated before updating/reinstalling (disclosed in the modal), sessions are backed up first (aborting on failure), a read-only post-upgrade check opens the repair entry point when unreadable sessions are found, and the panel reloads with the new auth credential (fixes "dsh web authentication required")'
      ],
      [
        "\u65B0\u589E\u300C\u4F1A\u8BDD\u683C\u5F0F\u4FEE\u590D\u300D\uFF08\u8BBE\u7F6E\u9875/\u5347\u7EA7\u540E\u9884\u68C0\u5165\u53E3\uFF09\uFF1A\u4FEE\u590D DSH \u7248\u672C\u6F02\u79FB\u5BFC\u81F4\u7684\u65E7\u4F1A\u8BDD\u4E0D\u53EF\u8BFB\uFF08sourceEventSeqs \u5F62\u6001\u3001\u63D2\u4EF6\u5199\u5165\u7684\u975E\u6CD5 source.form\u3001\u5B50\u4F1A\u8BDD descriptor \u7248\u672C\u3001\u6CE8\u5165\u6D88\u606F\u7F3A id/role \u5BFC\u81F4\u300Clacks an identified message\u300D\u5D29\u6E83\uFF09\uFF1B\u5148\u5907\u4EFD\u539F\u6587\u4EF6\u3001\u6539\u5B8C\u7528 DSH \u81EA\u5E26\u8FC1\u79FB\u94FE\u590D\u9A8C\u3001\u901A\u8FC7\u624D\u843D\u76D8\uFF0C\u5168\u7A0B\u53EA\u8BFB\u9884\u68C0 + \u663E\u5F0F\u70B9\u51FB\u624D\u6539\u5199",
        `New "Session format repair" (settings page / post-upgrade entry): fixes old sessions made unreadable by DSH version drift (sourceEventSeqs shape, invalid plugin-written source.form, subagent descriptor version, injected messages missing id/role that crash with "lacks an identified message"). Each file is backed up first, validated with DSH's own migration chain, and only then written \u2014 scanning is read-only and nothing is rewritten without an explicit click`
      ],
      [
        "\u4FEE\u590D 0.1.5 \u4E0B\u4E24\u7C7B\u6B8B\u7559\u95EE\u9898\uFF1A\u2460 \u9762\u677F\u5185\u6587\u4EF6\u4E0A\u4F20\u8FDB\u5EA6\u4E0E\u4FA7\u680F\u6587\u6863\u9884\u89C8\u8D70 XMLHttpRequest\uFF0C\u65E7\u7248\u53EA\u7ED9 fetch/WebSocket \u8865\u51ED\u8BC1 \u2192 \u8FD9\u4E9B\u8BF7\u6C42 401 \u5E76\u89E6\u53D1\u300Cauthentication required\u300D\uFF1B\u73B0\u8865\u9F50 XHR/EventSource\uFF0C\u5E76\u8BA9\u542F\u52A8\u51ED\u8BC1\u6BCF\u6B21\u91CD\u8BFB\u3001token \u4E00\u53D8\u7ACB\u5373\u91CD\u8F7D\u9762\u677F\uFF08\u91CD\u8F7D\u9884\u7B97 2\u21925 \u8F6E\uFF09\u2461 DSH \u8F93\u5165\u6846\u5DF2\u6709\u6587\u5B57\u65F6\u9690\u5F0F\u884C\u4E0D\u51FA\u73B0\u2014\u2014\u53D7\u63A7\u7F16\u8F91\u5668\u56DE\u6EDA\u4E86\u586B\u5145\uFF0C\u800C\u65E7\u903B\u8F91\u53EA\u770B execCommand \u8FD4\u56DE\u503C\u3001\u81EA\u52A8\u6CE8\u5165\u53C8\u4E0D\u770B\u56DE\u6267\uFF1B\u73B0\u6539\u4E3A\u300C\u6821\u9A8C + \u591A\u7B56\u7565\u964D\u7EA7\u300D\u586B\u5145\uFF0C\u56DE\u6267\u5E26\u7ED3\u679C\uFF0C\u81EA\u52A8\u6CE8\u5165\u5931\u8D25\u4F1A\u91CD\u8BD5\u4E00\u6B21\u5E76\u63D0\u793A",
        `Fixed two residual issues on DSH 0.1.5: (1) in-panel file-upload progress and sidebar document preview use XMLHttpRequest while only fetch/WebSocket carried credentials, so those requests 401ed and surfaced "authentication required" \u2014 XHR/EventSource are now patched too, the launch credential is re-read on every use, and the panel reloads the moment the token changes (reload budget 2 \u2192 5 rounds); (2) the implicit line stopped appearing when the DSH composer already had text \u2014 the controlled editor rolled the fill back while the old logic trusted execCommand's return value and auto-inject ignored the ack \u2014 filling is now verified with a multi-strategy fallback, the ack reports the result, and auto-inject retries once before warning`
      ]
    ]
  },
  {
    version: "2.3.3",
    items: [
      [
        "\u66F4\u65B0\u68C0\u67E5\u6062\u590D\u9002\u914D\u8B66\u544A\uFF1A\u65B0\u7248 DSH\uFF080.1.2 \u8D77\uFF09\u56E0\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\u4E0E\u63D2\u4EF6\u4E0D\u9002\u914D\uFF08\u5185\u5D4C\u9762\u677F\u804A\u5929\u8BB0\u5F55\u65E0\u6CD5\u663E\u793A\u3001\u8F93\u5165\u6846\u4E0D\u53EF\u7528\uFF09\uFF0C\u5DF2\u4E0A\u62A5 DSH \u5B98\u65B9\u56E2\u961F\uFF0C\u5F85\u9002\u914D\u540E\u63D2\u4EF6\u5C06\u540C\u6B65\u66F4\u65B0\uFF1B\u300C\u4E00\u952E\u914D\u7F6E\u300D\u4E0E\u300C\u5378\u8F7D\u5E76\u91CD\u88C5\u300D\u5747\u56FA\u5B9A\u5B89\u88C5\u5DF2\u9A8C\u8BC1\u9002\u914D\u7248\uFF080.1.1-rc.2\uFF09",
        "Update check warns again that new DSH (0.1.2+) is incompatible due to browser-session authentication (the embedded panel cannot show chat history and the composer is unusable); the issue has been reported to the DSH team and the plugin will follow once supported. One-click configure and clean reinstall both install the verified compatible DSH (0.1.1-rc.2)"
      ],
      [
        '\u66F4\u65B0\u65E5\u5FD7\u652F\u6301\u5220\u9664\u7EBF\u6807\u8BB0\uFF08\u672C\u5F39\u7A97\u4E2D v2.3.1 \u7684"\u65B0\u7248\u517C\u5BB9"\u8BF4\u660E\u5DF2\u6309\u5B9E\u6D4B\u7ED3\u679C\u4F5C\u5E9F\u5212\u9664\uFF09',
        `Changelog entries can now be struck through (v2.3.1's "new DSH compatibility" note is voided here based on real-world testing)`
      ]
    ]
  },
  {
    version: "2.3.1",
    items: [
      [
        "~~DSH 0.1.2/0.1.3 \u517C\u5BB9\uFF1A\u6846\u9009\u53D1\u9001\u6539\u8D70 API \u76F4\u53D1\u901A\u9053\uFF08\u7AEF\u70B9\u5F62\u6001\u81EA\u9002\u5E94 + \u81EA\u52A8\u4F1A\u8BDD\u8BA4\u8BC1\uFF09\uFF0C\u4E0D\u518D\u4F9D\u8D56\u9762\u677F\u5185\u5D4C\uFF1B\u8F93\u5165\u6846\u652F\u6301 contentEditable\uFF1B\u51B7\u542F\u52A8\u81EA\u52A8\u91CD\u8F7D\uFF1B\u9762\u677F\u88AB\u8BA4\u8BC1\u62E6\u622A\u65F6\u663E\u793A\u5F15\u5BFC\u5361\uFF0C\u53EF\u4E00\u952E\u5728\u6D4F\u89C8\u5668\u6253\u5F00\uFF08\u81EA\u52A8\u643A\u5E26\u8BA4\u8BC1\u94FE\u63A5\uFF09~~\uFF08\u5B9E\u6D4B\u65B0\u7248 DSH \u4ECD\u4E0E\u63D2\u4EF6\u4E0D\u9002\u914D\uFF1A\u5185\u5D4C\u9762\u677F\u804A\u5929\u8BB0\u5F55\u4E0E\u8F93\u5165\u5F02\u5E38\uFF0C\u8BE5\u8BF4\u660E\u4F5C\u5E9F\uFF0C\u8BE6\u89C1 v2.3.3\uFF09",
        '~~DSH 0.1.2/0.1.3 compatibility: sending selections now uses the direct API channel (endpoint-style autodetection + automatic session auth) independent of the embedded panel; contentEditable composer support; cold-start auto-reload; when the panel is blocked by browser-session auth a guidance card offers one-click "Open DSH in browser" with the auth link~~ (voided: real-world testing shows new DSH versions remain incompatible with the plugin \u2014 embedded panel chat history and composer are broken; see v2.3.3)'
      ],
      [
        "\u672C\u5730\u624B\u6539\u7684\u6865\u63A5\u6587\u4EF6\u5728\u63D2\u4EF6\u8986\u76D6\u524D\u81EA\u52A8\u5907\u4EFD\uFF08.bak-local\uFF09",
        "Locally modified bridge files are now backed up (.bak-local) before the plugin overwrites them"
      ]
    ]
  },
  {
    version: "2.3.0",
    items: [
      [
        "DSH 0.1.2 \u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\u7F13\u89E3\uFF1A\u4E00\u952E\u914D\u7F6E\u9489\u4F4F\u9002\u914D\u7248 0.1.1-rc.2\uFF1B\u66F4\u65B0\u68C0\u67E5\u5BF9\u672A\u9002\u914D\u7248\u672C\u7EA2\u5B57\u529D\u9000\uFF08\u53D6\u6D88\u81EA\u52A8\u68C0\u67E5\uFF09\uFF1B\u8BA4\u8BC1\u7C7B\u542F\u52A8\u5931\u8D25\u5F39\u7A97\u5982\u5B9E\u8BF4\u660E\uFF0C\u300C\u5728\u6D4F\u89C8\u5668\u6253\u5F00 DSH\u300D\u81EA\u52A8\u643A\u5E26\u8BA4\u8BC1\u94FE\u63A5\uFF08\u6D4F\u89C8\u5668\u4E2D\u5B8C\u6574\u53EF\u7528\uFF0C\u63D2\u4EF6\u8F85\u52A9\u529F\u80FD\u4E0D\u751F\u6548\uFF09",
        'Mitigations for DSH 0.1.2 browser-session auth: one-click configure pins the verified version 0.1.1-rc.2; update check shows a red incompatibility warning (auto-check removed); auth-class boot failures get an honest modal, and "Open DSH in browser" now carries the authentication link (full DSH in the browser; plugin helpers do not apply there)'
      ]
    ]
  },
  {
    version: "2.2.2",
    items: [
      [
        "\u5546\u5E97\u5BA1\u6838\u544A\u8B66\u6E05\u7406\u7B2C\u4E8C\u8F6E\uFF1A\u590D\u5236\u515C\u5E95\u6539\u7528 Electron \u526A\u8D34\u677F\uFF08\u5F03\u7528 API\uFF09\u3001\u5B9A\u65F6\u5668/\u7C7B\u578B\u5408\u89C4\u91CD\u5199\uFF08\u65E0\u529F\u80FD\u53D8\u5316\uFF09",
        "Second round of store-review cleanup: clipboard fallback switched to the Electron API (deprecated API removed); timers and types rewritten for compliance (no behavior change)"
      ]
    ]
  },
  {
    version: "2.2.1",
    items: [
      [
        "\u6E05\u7406\u5546\u5E97\u5BA1\u6838\u544A\u8B66\uFF1A\u5B9A\u65F6\u5668/\u7C7B\u578B/\u6837\u5F0F/\u8BBE\u7F6E\u9875\u5143\u7D20\u521B\u5EFA\u7B49 24 \u9879\u5408\u89C4\u6027\u4FEE\u590D\uFF08\u65E0\u529F\u80FD\u53D8\u5316\uFF09",
        "Cleaned up store review warnings: 24 compliance fixes for timers, types, styles and settings elements (no behavior change)"
      ]
    ]
  },
  {
    version: "2.2.0",
    items: [
      [
        "AED \u589E\u5F3A\uFF1A\u8FDB\u5165\u5B89\u5168\u6A21\u5F0F\u524D\u81EA\u52A8\u68C0\u67E5\u63D2\u4EF6\u5065\u5EB7\uFF0C\u5F02\u5E38\u63D2\u4EF6\u4E34\u65F6\u7981\u7528\uFF08\u9000\u51FA\u65F6\u81EA\u52A8\u6062\u590D\uFF09\uFF0C\u574F\u63D2\u4EF6\u4E0D\u518D\u8BA9\u5B89\u5168\u6A21\u5F0F\u6253\u4E0D\u5F00\uFF1B\u5B8C\u6210\u540E\u6821\u9A8C\u542F\u52A8\uFF0C\u5F02\u5E38\u53EF\u4E00\u952E\u4FEE\u590D",
        "AED enhanced: checks plugin health before entering safe mode; broken plugins are temporarily disabled (auto-restored on exit), so safe mode boots even with broken plugins; verifies boot afterwards and offers one-click fixes"
      ],
      [
        "\u65B0\u589E\u300C\u5378\u8F7D\u5E76\u91CD\u88C5 DSH\uFF08\u4FDD\u7559\u804A\u5929\u8BB0\u5F55\uFF09\u300D\uFF1A\u7EA2\u8272\u6309\u94AE + \u5F3A\u786E\u8BA4\uFF1B\u81EA\u52A8\u5907\u4EFD\u804A\u5929\u8BB0\u5F55/\u51ED\u636E/\u8BBE\u7F6E/\u6280\u80FD\u540E\u5378\u8F7D\u91CD\u88C5",
        'New "Uninstall & reinstall DSH (keep chat history)": red button + strong confirmation; backs up chat/credentials/settings/skills before uninstalling and reinstalling'
      ]
    ]
  },
  {
    version: "2.1.1",
    items: [
      [
        "\u4E00\u952E\u914D\u7F6E DSH \u9ED8\u8BA4\u6539\u7528\u5168\u5C40 CLI \u7A33\u5B9A\u7248\u542F\u52A8\uFF08dsh web --port {port} --no-open\uFF09\uFF1A\u4E0D\u518D\u9ED8\u8BA4\u8FD0\u884C\u4ED3\u5E93 master \u4E0A\u7684\u9884\u53D1\u5E03\uFF08alpha.3 \u65B0\u589E\u6D4F\u89C8\u5668\u4F1A\u8BDD\u8BA4\u8BC1\uFF0C\u9690\u85CF\u63A7\u5236\u53F0\u4E0B\u65E0\u6CD5\u53D6\u5F97 token URL \u4F1A 401\uFF09\uFF1B\u4EC5\u5F53\u5168\u5C40 CLI \u5B89\u88C5\u5931\u8D25\u65F6\u624D\u56DE\u9000\u4ED3\u5E93\u5F62\u6001",
        "One-click configure now defaults to the stable global CLI (dsh web --port {port} --no-open) instead of the repo master (a prerelease): alpha.3 added browser-session authentication whose printed token URL is unreachable under the hidden console, causing a 401; the repo form is only used as a fallback when the global CLI install fails"
      ]
    ]
  },
  {
    version: "2.1.0",
    items: [
      [
        "AED \u589E\u5F3A\uFF1A\u62A2\u6551/\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u5B8C\u6210\u540E\u81EA\u52A8\u6821\u9A8C DSH \u542F\u52A8\u5065\u5EB7\uFF08\u9875\u9762\u542F\u52A8\u5F15\u5BFC\u6CE8\u5165 + \u5BA2\u6237\u7AEF\u6A21\u5757 bootstrap face\uFF09\uFF1B\u53D1\u73B0\u5F02\u5E38\u5F39\u7A97\u8BF4\u660E\u9519\u8BEF\u7C7B\u578B\u3001\u5224\u65AD\u4E0E\u5EFA\u8BAE\u52A8\u4F5C\uFF0C\u53EF\u6267\u884C\u4E00\u6B21\u6027\u4FEE\u590D\uFF08\u91CD\u5EFA\u6865\u63A5\u8865\u4E01 + \u6E05\u7406\u6B8B\u7559\u7981\u7528\u5757 + \u91CD\u542F\u590D\u9A8C\uFF09\uFF1B\u540C\u7C7B\u9519\u8BEF\u4E0D\u5FAA\u73AF\u5F39\u7A97\uFF0C\u63D0\u793A\u6539\u7528\u5176\u4ED6 harness\uFF08dsh-fix doctor/bisect \u6216\u91CD\u88C5\uFF09\uFF1B\u5B89\u5168\u6A21\u5F0F\u4E0D\u518D\u8BEF\u7981\u5BA2\u6237\u7AEF\u6A21\u5757\uFF08client-modules \u7EB3\u5165\u6838\u5FC3 bundle\uFF0C\u4FEE\u590D AED \u540E\u62A5\u300Cclient.js did not export the bootstrap module face\u300D\u7684\u6839\u56E0\u4E4B\u4E00\uFF09",
        'AED enhancement: after recovery/exit-safe-mode completes, the plugin verifies DSH boot health (page boot injection + client-modules bootstrap face); on failure a modal shows the error type, assessment and a suggested action with a one-shot fix (rewrite bridge patch + remove stale disable blocks + restart & re-verify); no repeated modals for the same error \u2014 other harnesses are suggested instead (dsh-fix doctor/bisect or reinstall); safe mode no longer disables the client-modules bundle (moved into the core set, fixing a root cause of "client.js did not export the bootstrap module face" after AED)'
      ],
      [
        "\u8BBE\u7F6E\u9875\u5168\u90E8\u884C\u63A7\u4EF6\uFF08\u6309\u94AE/\u8F93\u5165\u6846/\u4E0B\u62C9\u6846\uFF09\u5F3A\u5236\u4E0A\u4E0B\u5C45\u4E2D\uFF1BAED \u8BF4\u660E\u66F4\u65B0\u4E3A\u7B80\u4ECB\u6821\u9A8C\u529F\u80FD",
        "All Settings controls (buttons / inputs / dropdowns) are force-vertically-centered; the AED description now introduces the verification feature"
      ]
    ]
  },
  {
    version: "2.0.3",
    items: [
      ["\u6865\u63A5\u81EA\u6108\uFF1A\u68C0\u6D4B\u5E76\u6E05\u9664 dsh-fix \u5B89\u5168\u6A21\u5F0F\u6B8B\u7559\u7684\u300C\u7981\u7528 dsh-obsidian-bridge\u300D\u8986\u76D6\u5757\uFF08\u5386\u53F2\u590D\u53D1\u5BFC\u81F4\u6865\u63A5\u9759\u9ED8\u5931\u6548\u3001\u9762\u677F\u65E0\u6CD5\u56DE\u586B\u6587\u5B57\uFF09\uFF0C\u8865\u4E01\u5199\u5165\u6539\u539F\u5B50\u5316\uFF1B\u6062\u590D\u6865\u63A5\u540E\u63D0\u793A\u91CD\u8F7D\u751F\u6548\uFF1B\u8BBE\u7F6E\u9875\u300C\u5B89\u5168\u6A21\u5F0F\u542F\u52A8\u300D\u680F\u79FB\u9664\uFF0C\u300C\u9000\u51FA\u5B89\u5168\u6A21\u5F0F\u300D\u5E76\u5165\u300CAED for DSH\u300D\u680F\uFF1BAED \u62A2\u6551\u603B\u662F\u5B89\u88C5/\u5347\u7EA7 dsh-fix \u5230\u6700\u65B0\uFF08\u5E42\u7B49\uFF09", 'Bridge self-healing: detects and removes leftover dsh-fix safe-mode "disable dsh-obsidian-bridge" override blocks (a recurring silent failure), patch writes are now atomic; prompts to reload after restoring; the "Start in safe mode" row is removed and "Exit safe mode" moved into the "AED for DSH" row; AED always installs/upgrades dsh-fix to the latest (idempotent)']
    ]
  },
  {
    version: "2.0.2",
    items: [
      ["P0 \u5B89\u5168\u4E0E\u7A33\u5B9A\u6027\u4FEE\u590D\u56DE\u5F52\uFF1A\u2460\u7AEF\u53E3\u64CD\u4F5C\u5B89\u5168\u2014\u2014\u91CD\u542F/\u66F4\u65B0/AED \u524D\u6821\u9A8C DSH \u8EAB\u4EFD\uFF08\u4E0D\u518D\u8BEF\u6740\u540C\u540D\u7AEF\u53E3\u524D\u7F00\u7684\u65E0\u5173\u8FDB\u7A0B\uFF09\uFF1B\u2461\u4FEE\u590D\u8DEF\u5F84\u70B9\u51FB\u91CD\u5B9A\u5411\u6807\u7B7E\u8DF3\u8FC7\u5931\u6548\uFF08\u9000\u683C\u5B57\u8282 bug\uFF0C\u542B\u63A7\u5236\u5B57\u7B26\u56DE\u5F52\u6D4B\u8BD5\uFF09\uFF1B\u2462pre-step \u7F16\u8F91\u6307\u4EE4\u5E26\u81EA\u7EC8\u6B62\u53E5\uFF08\u907F\u514D\u4F1A\u8BDD\u7D2F\u79EF\u91CD\u590D\u6267\u884C\uFF09\uFF1B\u2463--no-open \u63A2\u6D4B\u6539\u5F02\u6B65\uFF08\u4E0D\u518D\u51BB\u7ED3\u754C\u9762 8-20s\uFF09\uFF0C\u63A2\u6D4B\u5931\u8D25\u6309\u300C\u652F\u6301\u300D\u5904\u7406\uFF08\u4E0D\u518D\u6F0F\u8865\u5BFC\u81F4\u5F39\u6D4F\u89C8\u5668\uFF09\uFF1B\u2464\u4E00\u952E\u5B89\u88C5 PATH \u7F13\u5B58\u5237\u65B0\uFF08\u5B89\u88C5\u540E\u4E0D\u518D\u8BEF\u62A5\u4F9D\u8D56\u4ECD\u7F3A\u5931\uFF09\uFF1B\u2465\u5168\u5C40 CLI \u66F4\u65B0\u5931\u8D25\u81EA\u52A8\u6062\u590D\u539F\u670D\u52A1\uFF1B\u2466\u8BBE\u7F6E\u9875\u8F93\u5165\u9632\u6296\uFF08\u7AEF\u53E3/\u547D\u4EE4/\u6ED1\u6746\u4E0D\u518D\u9010\u952E\u91CD\u5EFA\u670D\u52A1\uFF09\uFF1B\u2467CI \u589E\u52A0 typecheck\u3001check-review-lint \u6539\u771F\u914D\u5BF9\u626B\u63CF\uFF1B\u2468\u66F4\u65B0\u5931\u8D25\u63D0\u793A\u7EC6\u5316\u2014\u2014git \u66F4\u65B0\u9047\u672C\u5730\u672A\u63D0\u4EA4\u6539\u52A8\u65F6\u5217\u51FA\u51B2\u7A81\u6587\u4EF6\u5E76\u6307\u5F15\u63D0\u4EA4/stash", 'P0 safety & stability fixes restored: \u2460 port-kill safety \u2014 DSH identity is verified before restart/update/AED (no longer kills unrelated prefix-matching port owners); \u2461 fixed the label-skip regex backspace-byte bug (with control-character regression test); \u2462 pre-step edit instructions self-terminate (no repeated execution across turns); \u2463 --no-open probe is async (no more 8-20s UI freeze) and probe failure is treated as supported (no browser popup from a missing flag); \u2464 installer PATH cache refreshes after install (no more false "dependency still missing"); \u2465 failed global-CLI updates restore the previous service; \u2466 Settings inputs are debounced (no per-keystroke service rebuilds); \u2467 CI gains typecheck and a real eslint-disable pairing scan; \u2468 update-failure messaging lists conflicting files and guides commit/stash']
    ]
  },
  {
    version: "2.0.1",
    items: [
      ["\u57FA\u4E8E 1.9.9 \u7A33\u5B9A\u884C\u4E3A\u53D1\u5E03\uFF08\u56DE\u9000 2.0.0 \u7684\u5168\u9762\u6539\u52A8\uFF0C\u6062\u590D\u7A33\u5B9A\u8FD0\u884C\uFF09\uFF1A\u4FDD\u7559\u66F4\u65B0\u68C0\u67E5\u4F18\u5316\uFF08alpha/beta \u9884\u53D1\u5E03\u8BC6\u522B\u3001npm \u901A\u9053\u300C\u5DF2\u662F\u6700\u65B0\u300D\u8BF4\u660E\u4E0E GitHub \u9884\u89C8\u62AB\u9732\uFF09\u3001\u4E0B\u62C9\u5782\u76F4\u5C45\u4E2D\u3001\u91CD\u542F\u680F\u4F4D\u8C03\u6574\uFF1B\u79FB\u9664 2.0.0 \u5F15\u5165\u7684\u4E0D\u7A33\u5B9A\u6539\u52A8", 'Released on the stable 1.9.9 behavior (2.0.0-wide changes rolled back for stability): keeps the update-check polish (alpha/beta treated as prereleases, npm-only "up to date" notice with GitHub prerelease disclosure), centered dropdown and reordered restart row; removes the unstable 2.0.0 changes']
    ]
  },
  {
    version: "1.9.9",
    items: [
      ["\u66F4\u65B0\u68C0\u67E5\u4F18\u5316\uFF1A\u2460\u7248\u672C\u5224\u5B9A\u4FEE\u6B63\u2014\u2014alpha/beta \u8BC6\u522B\u4E3A\u9884\u53D1\u5E03\uFF08\u4E0D\u518D\u8BEF\u5F53\u6B63\u5F0F\u7248\u63D0\u793A\uFF09\uFF1B\u2461\u300C\u5DF2\u662F\u6700\u65B0\u300D\u63D0\u793A\u660E\u786E\u68C0\u6D4B\u8303\u56F4\u4EC5 npm \u5B98\u65B9\u63A8\u9001\u7684\u5168\u5C40 CLI \u7248\u672C\uFF0C\u82E5 GitHub \u53E6\u6709\u672A\u53D1\u5E03\u5230 npm \u7684\u9884\u89C8\uFF08\u5982 0.1.2-alpha.1\uFF09\u4F1A\u4E00\u5E76\u544A\u77E5\uFF0C\u907F\u514D\u8BEF\u4EE5\u4E3A\u6F0F\u68C0\uFF1B\u2462\u8BBE\u7F6E\u9875\u300CDSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian\u300D\u4E0B\u62C9\u6846\u5782\u76F4\u5C45\u4E2D\uFF1B\u2463\u5FEB\u6377\u64CD\u4F5C\u533A\u300C\u91CD\u542F DSH \u670D\u52A1\u300D\u79FB\u5230\u300C\u91CD\u8FDE\u670D\u52A1\u300D\u4E0B\u65B9", 'Update check improvements: \u2460 version semantics fixed \u2014 alpha/beta are treated as prereleases (no longer mislabeled as stable); \u2461 the "up to date" notice now states it only checks the npm-published global CLI version, and tells you when GitHub has a newer prerelease not yet published to npm (e.g. 0.1.2-alpha.1), so it never looks like a missed update; \u2462 the "DSH chat \u2192 Obsidian" dropdown is vertically centered in Settings; \u2463 "Restart DSH service" moved right below "Reconnect" in the Quick Actions section']
    ]
  },
  {
    version: "1.9.8",
    items: [
      ["\u81EA\u52A8\u6CE8\u5165\u4E0D\u8986\u76D6\u804A\u5929\u6846\u5DF2\u8F93\u5165\u5185\u5BB9\uFF1A\u9690\u5F0F\u4FE1\u606F\u884C\u6539\u4E3A\u5728\u4F60\u7684\u8F93\u5165\u4E4B\u4E0A\u751F\u6210\u3001\u6362\u884C\u540E\u4FDD\u7559\u4F60\u5DF2\u8F93\u5165\u7684\u6587\u5B57\uFF08\u591A\u6B21\u6846\u9009\u53EA\u4FDD\u7559\u6700\u65B0\u9690\u5F0F\u884C\uFF1B\u53D6\u6D88\u6846\u9009\u4EC5\u6E05\u9664\u9690\u5F0F\u884C\u3001\u4FDD\u7559\u4F60\u7684\u8F93\u5165\uFF09", "Auto-inject no longer overwrites what you already typed in the chat: the implicit line is placed above your text and your input is kept after a line break (repeated selections keep only the latest line; deselecting clears only the implicit line, keeping your input)"]
    ]
  },
  {
    version: "1.9.7",
    items: [
      ["\u4FEE\u590D\u7126\u70B9\u62A2\u5360\uFF1A\u6CE8\u5165\u9690\u5F0F\u4FE1\u606F\u884C\u540E\u4E0D\u518D\u628A\u7126\u70B9\u79FB\u5165 DSH \u804A\u5929\u6846\u2014\u2014\u6846\u9009\u6587\u5B57\u540E\u6309 Backspace \u7B49\u952E\u76D8\u64CD\u4F5C\u4ECD\u4F5C\u7528\u4E8E Obsidian \u6587\u6863\uFF0C\u4E0D\u518D\u8BEF\u5220\u804A\u5929\u6846\u5185\u5BB9", "Fix focus stealing: filling the implicit line no longer moves focus into the DSH chat, so keyboard actions (e.g. Backspace) after selecting text still act on the Obsidian note instead of the chat box"],
      ["\u4FEE\u590D\u91CD\u542F\u670D\u52A1\u81EA\u52A8\u62C9\u8D77\u6D4F\u89C8\u5668\uFF1A\u542F\u52A8\u547D\u4EE4\u81EA\u52A8\u8865\u9F50 --no-open\uFF08\u5F53\u524D DSH \u652F\u6301\u65F6\uFF09\uFF0C\u542F\u52A8/\u91CD\u542F\u4E0D\u518D\u5F39\u51FA\u6D4F\u89C8\u5668\u7A97\u53E3", "Fix browser auto-open on restart: --no-open is auto-added to the startup command (when supported by the current DSH), so starting/restarting no longer pops up the browser"]
    ]
  },
  {
    version: "1.9.6",
    items: [
      ["\u6865\u63A5\u63D0\u901F\u4E0E\u9ED8\u8BA4\u7F16\u8F91\uFF1A\u2460\u7F16\u8F91\u6307\u4EE4\u6539\u4E3A\u6865\u63A5\u63D2\u4EF6 pre-step \u94A9\u5B50\u9690\u85CF\u6CE8\u5165\uFF08\u4E0D\u5360\u7528\u804A\u5929\u6846\uFF09\uFF1A\u6536\u5230\u9690\u5F0F\u4FE1\u606F\u884C\u540E\uFF0CDSH \u5148\u8BFB\u53D6\u539F\u6587\uFF0C\u6309\u4F60\u7684\u8981\u6C42\u53EA\u8F93\u51FA\u4E00\u6BB5\u7ED3\u679C\uFF0C\u5E76\u8BE2\u95EE\u662F\u5426\u540C\u610F\u5199\u5165\uFF0C\u540C\u610F\u540E\u624D\u7528\u7F16\u8F91\u5DE5\u5177\u4FEE\u6539\u6587\u4EF6\uFF1B\u2461\u586B\u5165\u7ED3\u679C\u4EE5 ACK \u786E\u8BA4\uFF08\u6D88\u9664\u300C\u5DF2\u586B\u5165\u300D\u5047\u8C61\uFF0C\u6700\u957F\u7B49\u5F85\u7531 4s \u964D\u81F3 ~3s\uFF09\uFF1B\u2462\u9762\u677F\u5DF2\u5F00\u4E14\u6865\u63A5\u5C31\u7EEA\u65F6\u8DF3\u8FC7\u91CD\u590D\u63A2\u6D4B\u76F4\u63A5\u6CE8\u5165\uFF1B\u2463\u6865\u63A5\u91CD\u5EFA\u5931\u8D25 30s \u51B7\u5374\u3001\u53BB\u6296 300\u2192150ms\u3001\u6253\u5F00\u9762\u677F\u526F\u4F5C\u7528\u8282\u6D41\uFF1B\u2464\u4FEE\u590D\u8BBE\u7F6E\u9875\u300CDSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian\u300D\u4E0B\u62C9\u4E0D\u663E\u793A\u9ED8\u8BA4\u503C\uFF08\u65E7\u5E03\u5C14\u8BBE\u7F6E\u81EA\u52A8\u8FC1\u79FB\uFF1A\u5F00\u2192\u81EA\u52A8\u53D1\u9001\uFF0C\u5173\u2192\u53D6\u6D88\uFF09", 'Bridge speed-up & default editing: \u2460 the edit instruction is now injected by a bridge pre-step hook (never shown in the chat UI): on receiving the implicit line, DSH reads the region, outputs only the result (one paragraph), asks whether you agree, and writes the file with the edit tool only after consent; \u2461 fills are confirmed by ACK (removes the false "filled" notice; worst-case wait 4s\u2192~3s); \u2462 hot path skips redundant probe/openView when the panel is ready; \u2463 reload cooldown (30s), debounce 300\u2192150ms, openView side-effect throttling; \u2464 fixed the "DSH chat \u2192 Obsidian" dropdown showing no default value (legacy boolean setting auto-migrates: true\u2192Auto-send, false\u2192Off)']
    ]
  },
  {
    version: "1.9.5",
    items: [
      ["\u6865\u63A5\u4F4D\u7F6E\u589E\u5F3A\uFF1A\u6846\u9009\u6587\u5B57\u6539\u4E3A\u81EA\u52A8\u6CE8\u5165\u9690\u5F0F\u4FE1\u606F\u884C\uFF08\u542B\u7CBE\u786E\u884C:\u5217\u4E0E\u5B57\u6570\uFF0C\u4E0D\u542B\u539F\u6587\uFF09\uFF0CDSH \u53EF\u6309\u300C\u8DEF\u5F84 + \u884C:\u5217\u300D\u8BFB\u53D6\u6587\u4EF6\u5B9A\u4F4D\u5E76\u4FEE\u6539\u975E\u6574\u884C\u9009\u533A\uFF1B\u300CDSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian\u300D\u6539\u4E3A\u4E09\u9009\u9879\uFF08\u53D6\u6D88/\u81EA\u52A8\u53D1\u9001/\u53F3\u952E\u53D1\u9001\uFF0C\u9ED8\u8BA4\u81EA\u52A8\u53D1\u9001\uFF09\uFF1B\u5220\u9664\u300C\u9644\u5E26\u6765\u6E90\u6807\u7B7E\u300D\u8BBE\u7F6E\u9879\uFF1B\u9762\u677F\u672A\u6253\u5F00\u65F6\u4E0D\u6CE8\u518C\u81EA\u52A8\u53D1\u9001\u76D1\u542C\uFF1B\u53D6\u6D88\u6846\u9009\u81EA\u52A8\u6E05\u9664\u804A\u5929\u6846\u4E2D\u7684\u9690\u5F0F\u884C", 'Bridge location enhancement: selecting text now auto-injects an implicit info line (exact line:col + word count, no original text) so DSH can read the file and locate/edit non-full-line selections; "DSH chat \u2192 Obsidian" is now a 3-option dropdown (Off/Auto-send/Right-click send, default Auto-send); removed the "Attach source tag" setting; auto-send listeners are not registered while the panel is closed; deselecting auto-clears the implicit line in the chat']
    ]
  },
  {
    version: "1.9.4",
    items: [
      ["\u6865\u63A5\u8BBE\u7F6E\u5B8C\u5584\uFF1A\u65B0\u589E\u300CDSH \u804A\u5929\u6846\u6865\u63A5\u5230 Obsidian\u300D\u5F00\u5173\uFF1B\u6865\u63A5\u72B6\u6001\u663E\u793A\u5DF2\u52A0\u8F7D\u4E14\u751F\u6548\uFF08\u542B\u529F\u80FD\u5217\u8868\uFF09\uFF1B\u9762\u677F\u663E\u793A\u79FB\u56DE\u57FA\u7840\u8BBE\u7F6E", 'Bridge settings improved: new "DSH chat \u2192 Obsidian" switch; bridge status shows loaded & working (with feature list); panel display moved back to Basic Setup']
    ]
  },
  {
    version: "1.9.3",
    items: [
      ["\u4FEE\u590D\u9519\u8BEF\u94FE\u63A5", "Fix incorrect links"]
    ]
  },
  {
    version: "1.9.2",
    items: [
      ["\u300C\u68C0\u67E5\u63D2\u4EF6\u66F4\u65B0\u300D\u6539\u4E3A\u6253\u5F00 Obsidian \u5B98\u65B9\u5546\u5E97\u9875\uFF1B\u8BBE\u7F6E\u9875\u300C\u4E00\u952E\u914D\u7F6E DSH\u300D\u6309\u94AE\u5782\u76F4\u5C45\u4E2D", '"Check plugin updates" now opens the official Obsidian store page; the "Configure DSH" button in Settings is vertically centered']
    ]
  },
  {
    version: "1.9.1",
    items: [
      ["\u4FEE\u590D\u6865\u63A5 bug\uFF1A\u89E3\u51B3\u53D1\u9001\u6587\u5B57\u5230 DSH \u804A\u5929\u6846\u5931\u6548\u3001\u6846\u9009\u6D6E\u6846\u6B8B\u7559\u3001\u542F\u52A8\u6253\u70B9\u8DEF\u5F84\u7B49\u95EE\u9898", "Fix bridge bugs: sending text to the DSH chat no longer fails; removed the leftover selection floating button; fixed the startup-log path issue"]
    ]
  },
  {
    version: "1.9.0",
    items: [
      ["\u5FEB\u6377\u952E\u900F\u4F20\uFF1A\u5149\u6807\u805A\u7126\u5728 DSH \u9762\u677F\u5185\u65F6\uFF0CObsidian \u5168\u5C40\u5FEB\u6377\u952E\u4ECD\u53EF\u54CD\u5E94\uFF08\u81EA\u52A8\u8BFB\u53D6\u4F60\u7684\u5FEB\u6377\u952E\u8BBE\u7F6E\uFF09", "Pass through shortcuts: Obsidian global shortcuts still work while focus is inside the DSH panel (auto-reads your hotkey settings)"],
      ["DSH \u6216\u63D2\u4EF6\u66F4\u65B0\u540E\u81EA\u52A8\u91CD\u5199\u6865\u63A5\uFF0C\u4FDD\u6301\u517C\u5BB9", "Bridge is rewritten automatically after DSH or plugin updates"],
      ["\u5E95\u90E8\u57AB\u9AD8\u8BBE\u7F6E\uFF1AObsidian \u72B6\u6001\u680F\u906E\u6321\u9762\u677F\u5E95\u90E8\u65F6\uFF0C\u53EF\u8C03 0\u201330px \u7559\u767D\uFF08\u9ED8\u8BA4 20\uFF09", "Bottom padding setting: adjust 0\u201330px space when the Obsidian status bar covers the panel bottom (default 20)"],
      ["\u8BBE\u7F6E\u9875\u8C03\u6574\uFF1ADSH \u72B6\u6001\u680F\u6574\u5408\u66F4\u65B0\u65E5\u5FD7\u4E0E\u68C0\u67E5\u66F4\u65B0\uFF1B\u65B0\u589E\u63D2\u4EF6\u7248\u672C\u884C", "Settings reorganized: DSH status bar now hosts changelog + check updates; new plugin version row"]
    ]
  },
  {
    version: "1.8.7",
    items: [
      ["\u955C\u50CF\u6E90\u4FEE\u590D\uFF1AGit for Windows \u955C\u50CF\u6309\u5B8C\u6574\u7248\u672C\u6392\u5E8F\u5E76\u56DE\u9000\u53EF\u7528\u76EE\u5F55", "Mirror fix: Git for Windows mirror sorts by full version and falls back to available directories"]
    ]
  },
  {
    version: "1.8.6",
    items: [
      ["git-for-windows \u955C\u50CF\u6392\u5E8F\u4FEE\u590D\uFF08windows.N \u53C2\u4E0E\u7248\u672C\u6BD4\u8F83\uFF09", "git-for-windows mirror sorting fix (windows.N now participates in version comparison)"]
    ]
  },
  {
    version: "1.8.5",
    items: [
      ["\u8BBE\u7F6E\u9875\u300C\u91CD\u8FDE\u670D\u52A1\u300D\u6309\u94AE\u6587\u6848\u6539\u4E3A\u300C\u5237\u65B0\u300D", 'Reconnect button renamed to "Refresh" in Settings']
    ]
  }
];

// src/changelog.ts
var PluginChangelogModal = class extends import_obsidian9.Modal {
  constructor(app) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dsh-changelog-modal");
    this.setTitle(t("pluginChangelog.title"));
    const wrap = contentEl.createDiv({ cls: "dsh-changelog-list" });
    const isZh = t("pluginChangelog.locale") === "zh";
    for (const entry of PLUGIN_CHANGELOG) {
      const ver = wrap.createDiv({ cls: "dsh-changelog-ver" });
      ver.createEl("h4", { text: `v${entry.version}` });
      const list = ver.createEl("ul");
      for (const item of entry.items) {
        const li = list.createEl("li");
        const raw = isZh ? item[0] : item[1];
        const parts = raw.split("~~");
        for (let i = 0; i < parts.length; i++) {
          const seg = parts[i];
          if (seg === "") continue;
          if (i % 2 === 1) li.createEl("del", { text: seg });
          else li.appendText(seg);
        }
      }
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/source-tag.ts
function buildBridgeMessage(filePath, pos, wordCount) {
  const loc = `${formatLineCol(pos.fromLine, pos.fromCh)}-${formatLineCol(pos.toLine, pos.toCh)}`;
  return `[ BRIDGES is delivering packages for you\u2026\u2026 \xB7 ${wordCount} words \xB7 ${loc} \xB7 ${filePath} \xB7 ]`;
}
function formatLineCol(line, ch) {
  return `L${line + 1}:${ch + 1}`;
}
function countWords(text) {
  var _a, _b;
  if (text === "") return 0;
  const tokens = (_a = text.match(/\S+/g)) != null ? _a : [];
  let count = 0;
  for (const tok of tokens) {
    const cjk = (_b = tok.match(/[\u3000-\u9fff\uf900-\ufaff]/g)) != null ? _b : [];
    count += cjk.length > 0 ? cjk.length : 1;
  }
  return count;
}

// src/icon.ts
var DSH_LOGO_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path transform="translate(1.5726 2.9422) scale(0.7805)" d="M26.5174 3.39471C26.235 3.2567 26.1137 3.52006 25.9487 3.65346C25.8923 3.69659 25.8446 3.75294 25.7969 3.80469C25.3846 4.24516 24.9027 4.53439 24.2737 4.49989C23.3536 4.44814 22.5682 4.73737 21.8735 5.44119C21.7258 4.57349 21.2353 4.0554 20.4889 3.72304C20.0985 3.55054 19.7034 3.37746 19.4297 3.00197C19.2388 2.73459 19.1865 2.43673 19.091 2.14289C19.0301 1.96579 18.9697 1.78466 18.7656 1.75418C18.5442 1.71968 18.4574 1.90541 18.3705 2.06067C18.0232 2.69549 17.8887 3.39471 17.9019 4.10313C17.9324 5.6965 18.6051 6.96556 19.9421 7.86834C20.0939 7.97184 20.133 8.07535 20.0852 8.22658C19.9938 8.53766 19.8857 8.83955 19.7903 9.15063C19.7293 9.34901 19.6384 9.39271 19.4257 9.30588C18.692 8.9994 18.0583 8.54571 17.4982 7.99772C16.5477 7.07827 15.6881 6.06336 14.6162 5.26869C14.3644 5.08296 14.1125 4.91045 13.8521 4.746C12.7584 3.68394 13.9952 2.81164 14.2816 2.70814C14.5812 2.60003 14.3857 2.22857 13.4179 2.23317C12.4502 2.2372 11.5646 2.56151 10.4359 2.99335C10.2708 3.05832 10.0972 3.10547 9.91951 3.14457C8.8954 2.95022 7.83162 2.90709 6.72069 3.03245C4.62877 3.26533 2.95777 4.25436 1.72954 5.94261C0.254043 7.97184 -0.0932678 10.2777 0.33167 12.6824C0.778458 15.2171 2.07225 17.3153 4.06008 18.9558C6.12152 20.6567 8.49577 21.4905 11.2047 21.3306C12.8498 21.2358 14.6812 21.0155 16.7473 19.2669C17.2682 19.5262 17.8151 19.6297 18.7219 19.7074C19.4205 19.7723 20.0933 19.6729 20.6143 19.5648C21.4302 19.3923 21.3739 18.6367 21.0789 18.4981C18.6874 17.3843 19.2124 17.8374 18.7351 17.4706C19.9501 16.033 21.8063 13.4776 22.379 9.99821C22.4353 9.61409 22.5072 9.073 22.4986 8.76192C22.494 8.57216 22.5377 8.49856 22.7545 8.47671C23.3536 8.40771 23.935 8.24383 24.4692 7.94999C26.0188 7.10357 26.6439 5.71318 26.7911 4.04678C26.8129 3.79204 26.7865 3.52869 26.5174 3.39471ZM13.0143 18.3946C10.6964 16.5724 9.5722 15.9726 9.10816 15.9985C8.67402 16.0244 8.75222 16.5212 8.84768 16.8449C8.94773 17.1646 9.07768 17.3849 9.25996 17.6655C9.38589 17.8512 9.47272 18.1272 9.13404 18.3348C8.38766 18.7965 7.08985 18.1796 7.0289 18.1491C5.51833 17.2595 4.25559 16.0853 3.36546 14.4793C2.50581 12.9337 2.0067 11.2753 1.92447 9.50542C1.90262 9.07818 2.02855 8.92695 2.45406 8.84932C3.01413 8.74582 3.59144 8.72397 4.15093 8.80619C6.51656 9.15178 8.53027 10.2092 10.2185 11.8848C11.1822 12.8388 11.9114 13.979 12.6623 15.0929C13.461 16.2757 14.3201 17.4027 15.4144 18.3268C15.8008 18.6505 16.109 18.8966 16.404 19.0783C15.5144 19.1778 14.0297 19.1991 13.0143 18.3958V18.3946ZM14.1252 11.2489C14.1252 11.0591 14.277 10.9079 14.4679 10.9079C14.511 10.9079 14.5501 10.9165 14.5852 10.9292C14.6329 10.9464 14.6766 10.9723 14.7111 11.0114C14.7721 11.0718 14.8066 11.158 14.8066 11.2489C14.8066 11.4386 14.6548 11.5899 14.4639 11.5899C14.273 11.5899 14.1252 11.4386 14.1252 11.2489ZM17.5759 13.0188C17.3545 13.1096 17.1331 13.1873 16.9203 13.1959C16.5903 13.2131 16.2303 13.0791 16.0348 12.9153C15.7312 12.6605 15.5139 12.5179 15.423 12.0734C15.3839 11.8837 15.4057 11.5899 15.4402 11.4214C15.5185 11.0585 15.4316 10.8257 15.1757 10.614C14.9676 10.4415 14.7025 10.3938 14.4115 10.3938C14.3029 10.3938 14.2034 10.3461 14.1292 10.3076C14.0079 10.2472 13.9078 10.096 14.0033 9.91023C14.0338 9.84985 14.1815 9.70322 14.216 9.67734C14.6111 9.45251 15.0665 9.52612 15.488 9.6946C15.8784 9.85445 16.174 10.1477 16.5989 10.5623C17.033 11.0631 17.1112 11.2011 17.3585 11.5772C17.554 11.871 17.7317 12.1729 17.8536 12.5185C17.9272 12.7341 17.8317 12.9107 17.5759 13.0188Z"/></svg>';

// src/cert-gen.ts
var import_node_child_process8 = require("node:child_process");
var import_node_crypto3 = require("node:crypto");
var import_node_fs17 = require("node:fs");
var import_node_https3 = require("node:https");
var import_node_net2 = require("node:net");
var import_node_os9 = require("node:os");
var import_node_path16 = require("node:path");
var DEFAULT_VALID_DAYS = 825;
var OID_SHA256_RSA = "1.2.840.113549.1.1.11";
var OID_CN = "2.5.4.3";
var OID_BASIC_CONSTRAINTS = "2.5.29.19";
var OID_KEY_USAGE = "2.5.29.15";
var OID_EXT_KEY_USAGE = "2.5.29.37";
var OID_SUBJECT_ALT_NAME = "2.5.29.17";
var OID_SERVER_AUTH = "1.3.6.1.5.5.7.3.1";
function isLoopbackHost2(host) {
  const h = host.toLowerCase();
  if (h === "localhost" || h === "::1") return true;
  return /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h);
}
function certError(code, detail) {
  const error = new Error(detail === void 0 ? code : `${code}: ${detail}`);
  error.code = code;
  return error;
}
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
function derLength(length) {
  if (length < 128) return Buffer.from([length]);
  const bytes = [];
  let rest = length;
  while (rest > 0) {
    bytes.unshift(rest & 255);
    rest = Math.floor(rest / 256);
  }
  return Buffer.from([128 | bytes.length, ...bytes]);
}
function tlv(tag, content) {
  return Buffer.concat([Buffer.from([tag]), derLength(content.length), content]);
}
function derSeq(...items) {
  return tlv(48, Buffer.concat(items));
}
function derSet(...items) {
  return tlv(49, Buffer.concat(items));
}
function derNull() {
  return Buffer.from([5, 0]);
}
function derBooleanTrue() {
  return Buffer.from([1, 1, 255]);
}
function derOctetString(content) {
  return tlv(4, content);
}
function derUtf8(value) {
  return tlv(12, Buffer.from(value, "utf8"));
}
function derSmallInteger(value) {
  if (value < 128) return tlv(2, Buffer.from([value]));
  throw certError("der", `derSmallInteger \u4EC5\u652F\u6301 < 128 \u7684\u6B63\u6574\u6570\uFF1A${String(value)}`);
}
function derPositiveInteger(bytes) {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start += 1;
  const body = bytes.subarray(start);
  return tlv(2, body[0] >= 128 ? Buffer.concat([Buffer.from([0]), body]) : body);
}
function base128(value) {
  const out = [value & 127];
  let rest = Math.floor(value / 128);
  while (rest > 0) {
    out.unshift(rest & 127 | 128);
    rest = Math.floor(rest / 128);
  }
  return out;
}
function derOid(dotted) {
  const parts = dotted.split(".").map((part) => Number(part));
  const body = [40 * parts[0] + parts[1]];
  for (const part of parts.slice(2)) {
    body.push(...base128(part));
  }
  return tlv(6, Buffer.from(body));
}
function derBitString(bytes, unusedBits) {
  return tlv(3, Buffer.concat([Buffer.from([unusedBits]), bytes]));
}
function derName(commonName) {
  return derSeq(derSet(derSeq(derOid(OID_CN), derUtf8(commonName))));
}
function pad2(value) {
  return value < 10 ? `0${String(value)}` : String(value);
}
function derTime(date) {
  const year = date.getUTCFullYear();
  const tail = pad2(date.getUTCMonth() + 1) + pad2(date.getUTCDate()) + pad2(date.getUTCHours()) + pad2(date.getUTCMinutes()) + pad2(date.getUTCSeconds()) + "Z";
  if (year >= 1950 && year < 2050) {
    return tlv(23, Buffer.from(pad2(year % 100) + tail, "ascii"));
  }
  return tlv(24, Buffer.from(String(year) + tail, "ascii"));
}
function derSha256WithRsaAlgorithm() {
  return derSeq(derOid(OID_SHA256_RSA), derNull());
}
function derExtension(oid, critical, value) {
  const items = [derOid(oid)];
  if (critical) items.push(derBooleanTrue());
  items.push(derOctetString(value));
  return derSeq(...items);
}
function ipv4Bytes(address) {
  return Buffer.from(address.split(".").map((part) => Number(part)));
}
function ipv6Bytes(address) {
  const parts = address.split("::");
  const head = parts[0] === void 0 || parts[0] === "" ? [] : parts[0].split(":");
  const tail = parts[1] === void 0 || parts[1] === "" ? [] : parts[1].split(":");
  const fill = Math.max(0, 8 - head.length - tail.length);
  const groups = [...head, ...new Array(fill).fill("0"), ...tail];
  const out = Buffer.alloc(16);
  groups.forEach((group, index) => {
    out.writeUInt16BE(Number.parseInt(group, 16), index * 2);
  });
  return out;
}
function derGeneralName(host) {
  const kind = (0, import_node_net2.isIP)(host);
  if (kind === 4) return tlv(135, ipv4Bytes(host));
  if (kind === 6) return tlv(135, ipv6Bytes(host));
  return tlv(130, Buffer.from(host, "ascii"));
}
function assertHostsUsable(hosts) {
  for (const host of hosts) {
    if (host === "") throw certError("invalid-host", "\u4E3B\u673A\u540D\u4E3A\u7A7A");
    if ((0, import_node_net2.isIP)(host) !== 0) continue;
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/.test(host)) {
      throw certError("invalid-host", `\u4E0D\u662F\u5408\u6CD5\u7684 IPv4/IPv6 \u5730\u5740\u6216 ASCII DNS \u540D\uFF1A${host}`);
    }
  }
}
function toPem(label, der) {
  const body = der.toString("base64").replace(/(.{64})/g, "$1\n").replace(/\n+$/, "");
  return `-----BEGIN ${label}-----
${body}
-----END ${label}-----
`;
}
function detectLanIPv4(interfaces = (0, import_node_os9.networkInterfaces)()) {
  for (const list of Object.values(interfaces)) {
    if (list === void 0) continue;
    for (const info of list) {
      if (info.family !== "IPv4") continue;
      if (info.internal) continue;
      if (info.address.startsWith("127.")) continue;
      if (info.address.startsWith("169.254.")) continue;
      return info.address;
    }
  }
  return null;
}
function defaultCertDir(home = (0, import_node_os9.homedir)()) {
  const dir = (0, import_node_path16.join)(home, ".dsh-obsidian", "certs");
  (0, import_node_fs17.mkdirSync)(dir, { recursive: true });
  return dir;
}
function desktopDir(home = (0, import_node_os9.homedir)()) {
  const candidates = [(0, import_node_path16.join)(home, "Desktop"), (0, import_node_path16.join)(home, "OneDrive", "Desktop"), (0, import_node_path16.join)(home, "\u684C\u9762")];
  for (const candidate of candidates) {
    try {
      if ((0, import_node_fs17.statSync)(candidate).isDirectory()) return candidate;
    } catch (e) {
    }
  }
  throw certError("desktop-missing", `\u672A\u627E\u5230\u684C\u9762\u76EE\u5F55\uFF08\u5DF2\u5C1D\u8BD5 ${candidates.join(" / ")}\uFF09`);
}
function resolveHosts(given) {
  var _a;
  if (given === void 0) {
    const lan = detectLanIPv4();
    if (lan === null) throw certError("no-lan-address", "\u672A\u68C0\u6D4B\u5230\u5C40\u57DF\u7F51 IPv4 \u5730\u5740");
    return { host: lan, hosts: ["localhost", "127.0.0.1", "::1", lan] };
  }
  const hosts = [...new Set(given.map((host) => host.trim()).filter((host) => host !== ""))];
  if (hosts.length === 0) throw certError("no-lan-address", "hosts \u4E3A\u7A7A\u4E14\u672A\u68C0\u6D4B\u5230\u5C40\u57DF\u7F51\u5730\u5740");
  assertHostsUsable(hosts);
  return { host: (_a = hosts.find((host) => !isLoopbackHost2(host))) != null ? _a : hosts[0], hosts };
}
function createSelfSignedCert(hosts, primaryHost, now, validDays) {
  const notBeforeMs = Math.floor(now.getTime() / 1e3) * 1e3;
  const notBefore = new Date(notBeforeMs);
  const notAfter = new Date(notBeforeMs + validDays * 24 * 60 * 60 * 1e3);
  const { publicKey, privateKey } = (0, import_node_crypto3.generateKeyPairSync)("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "der" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });
  const algorithm = derSha256WithRsaAlgorithm();
  const name = derName(`DSH Obsidian (${primaryHost})`);
  const extensions = derSeq(
    // basicConstraints critical: CA:TRUE（自签单证书同时当根，Windows/iOS/安卓装进信任库后可用）
    derExtension(OID_BASIC_CONSTRAINTS, true, derSeq(derBooleanTrue())),
    // keyUsage critical: digitalSignature(0) + keyEncipherment(5) + keyCertSign(6) => 0x86
    derExtension(OID_KEY_USAGE, true, derBitString(Buffer.from([134]), 1)),
    // extKeyUsage: serverAuth（1.3.6.1.5.5.7.3.1）
    derExtension(OID_EXT_KEY_USAGE, false, derSeq(derOid(OID_SERVER_AUTH))),
    // subjectAltName: DNS:localhost + IP:127.0.0.1 + IP:::1 + IP:<lan>
    derExtension(OID_SUBJECT_ALT_NAME, false, derSeq(...hosts.map((host) => derGeneralName(host))))
  );
  const tbs = derSeq(
    tlv(160, derSmallInteger(2)),
    // [0] EXPLICIT version = v3
    derPositiveInteger((0, import_node_crypto3.randomBytes)(16)),
    // serialNumber（随机 16 字节，补正数）
    algorithm,
    name,
    // issuer（自签：与 subject 相同）
    derSeq(derTime(notBefore), derTime(notAfter)),
    name,
    // subject
    publicKey,
    // SPKI DER 原样嵌入（KeyObject.export({type:'spki',format:'der'})）
    tlv(163, extensions)
    // [3] EXPLICIT extensions
  );
  const signature = (0, import_node_crypto3.sign)("sha256", tbs, privateKey);
  const certDer = derSeq(tbs, algorithm, derBitString(signature, 0));
  return { certPem: toPem("CERTIFICATE", certDer), keyPem: String(privateKey), notBefore, notAfter };
}
function parseSanEntries(subjectAltName) {
  if (subjectAltName === void 0 || subjectAltName === "") return [];
  return subjectAltName.split(",").map((entry) => entry.trim());
}
function sanCovers(entries, host) {
  const kind = (0, import_node_net2.isIP)(host);
  if (kind === 0) return entries.includes(`DNS:${host}`);
  if (kind === 4) return entries.includes(`IP Address:${host}`);
  return entries.some((entry) => {
    if (!entry.startsWith("IP Address:")) return false;
    const value = entry.slice("IP Address:".length);
    return (0, import_node_net2.isIP)(value) === 6 && ipv6Bytes(value).equals(ipv6Bytes(host));
  });
}
function assertCertMaterial(material, hosts) {
  var _a;
  let cert;
  try {
    cert = new import_node_crypto3.X509Certificate(material.certPem);
  } catch (error) {
    throw certError("self-check", `\u751F\u6210\u7684\u8BC1\u4E66\u65E0\u6CD5\u88AB X509Certificate \u89E3\u6790\uFF1A${messageOf(error)}`);
  }
  const entries = parseSanEntries(cert.subjectAltName);
  const missing = hosts.filter((host) => !sanCovers(entries, host));
  if (missing.length > 0) {
    throw certError("self-check", `\u8BC1\u4E66 SAN \u672A\u8986\u76D6\uFF1A${missing.join(", ")}\uFF08\u5B9E\u9645\uFF1A${(_a = cert.subjectAltName) != null ? _a : "\u65E0"}\uFF09`);
  }
  if (!cert.subject.includes("CN=DSH Obsidian")) {
    throw certError("self-check", `\u8BC1\u4E66 subject \u975E\u9884\u671F\uFF1A${cert.subject}`);
  }
  if (Date.parse(cert.validFrom) > material.notBefore.getTime() + 1e3) {
    throw certError("self-check", `\u8BC1\u4E66 notBefore \u665A\u4E8E\u9884\u671F\uFF1A${cert.validFrom}`);
  }
  if (Date.parse(cert.validTo) < material.notAfter.getTime() - 1e3) {
    throw certError("self-check", `\u8BC1\u4E66 notAfter \u65E9\u4E8E\u9884\u671F\uFF1A${cert.validTo}`);
  }
}
function pickCheckTarget(hosts) {
  var _a;
  for (const candidate of ["127.0.0.1", "::1", "localhost"]) {
    if (hosts.includes(candidate)) return candidate;
  }
  return (_a = hosts.find((host) => (0, import_node_net2.isIP)(host) !== 0)) != null ? _a : hosts[0];
}
function listenOn(server, host) {
  return new Promise((resolve2) => {
    server.once("error", (error) => {
      throw certError("self-check", `\u81EA\u68C0 HTTPS \u670D\u52A1\u65E0\u6CD5\u76D1\u542C ${host}\uFF1A${messageOf(error)}`);
    });
    server.listen(0, host, () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        throw certError("self-check", "\u81EA\u68C0 HTTPS \u670D\u52A1\u672A\u8FD4\u56DE\u7AEF\u53E3");
      }
      resolve2(address.port);
    });
  });
}
function closeServer(server) {
  return new Promise((resolve2) => {
    if (!server.listening) {
      resolve2();
      return;
    }
    server.close(() => {
      resolve2();
    });
    server.closeAllConnections();
  });
}
function httpsGetStatus(port, host, ca) {
  return new Promise((resolve2, reject) => {
    const req = (0, import_node_https3.request)(
      {
        host,
        port,
        path: "/",
        method: "GET",
        ca,
        rejectUnauthorized: true,
        agent: false,
        family: (0, import_node_net2.isIP)(host) === 0 ? 4 : void 0,
        timeout: 5e3
      },
      (res) => {
        var _a;
        const status = (_a = res.statusCode) != null ? _a : 0;
        res.resume();
        resolve2(status);
      }
    );
    req.on("timeout", () => {
      req.destroy(certError("self-check", "HTTPS \u81EA\u68C0\u8BF7\u6C42\u8D85\u65F6"));
    });
    req.on("error", reject);
    req.end();
  });
}
async function verifyWithLocalHttps(certPem, keyPem, hosts) {
  const target = pickCheckTarget(hosts);
  const listenHost = (0, import_node_net2.isIP)(target) === 0 ? "127.0.0.1" : target;
  const server = (0, import_node_https3.createServer)({ cert: certPem, key: keyPem }, (_req, res) => {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("ok");
  });
  try {
    const port = await listenOn(server, listenHost);
    let trustedStatus = 0;
    try {
      trustedStatus = await httpsGetStatus(port, target, certPem);
    } catch (error) {
      throw certError("self-check", `\u5E26 ca \u7684 HTTPS \u81EA\u68C0\u5931\u8D25\uFF1A${messageOf(error)}`);
    }
    if (trustedStatus !== 200) {
      throw certError("self-check", `\u5E26 ca \u7684 HTTPS \u81EA\u68C0\u8FD4\u56DE ${String(trustedStatus)}\uFF0C\u671F\u671B 200`);
    }
    let untrustedRejected = false;
    try {
      await httpsGetStatus(port, target, void 0);
    } catch (e) {
      untrustedRejected = true;
    }
    if (!untrustedRejected) {
      throw certError("self-check", "\u4E0D\u5E26 ca \u7684 HTTPS \u8BF7\u6C42\u672A\u88AB\u62D2\u7EDD\uFF1A\u81EA\u7B7E\u8BC1\u4E66\u5FC5\u987B\u65E0\u6CD5\u901A\u8FC7\u7CFB\u7EDF\u4FE1\u4EFB\u5E93\u6821\u9A8C");
    }
  } finally {
    await closeServer(server);
  }
}
async function generateCerts(opts = {}) {
  var _a, _b, _c, _d;
  const { host, hosts } = resolveHosts(opts.hosts);
  const validDays = (_a = opts.validDays) != null ? _a : DEFAULT_VALID_DAYS;
  if (!Number.isFinite(validDays) || validDays <= 0) {
    throw certError("invalid-valid-days", `\u6709\u6548\u671F\u5FC5\u987B\u4E3A\u6B63\u6570\uFF08\u6536\u5230 ${String(validDays)}\uFF09`);
  }
  const certDir = (_b = opts.outDir) != null ? _b : defaultCertDir();
  (0, import_node_fs17.mkdirSync)(certDir, { recursive: true });
  const deskDir = (_c = opts.desktopDir) != null ? _c : desktopDir();
  (0, import_node_fs17.mkdirSync)(deskDir, { recursive: true });
  const material = createSelfSignedCert(hosts, host, (_d = opts.now) != null ? _d : /* @__PURE__ */ new Date(), validDays);
  const certPath = (0, import_node_path16.join)(certDir, "cert.pem");
  const keyPath = (0, import_node_path16.join)(certDir, "key.pem");
  const rootCaPath = (0, import_node_path16.join)(deskDir, "rootCA.pem");
  (0, import_node_fs17.writeFileSync)(certPath, material.certPem, "utf8");
  (0, import_node_fs17.writeFileSync)(keyPath, material.keyPem, { encoding: "utf8", mode: 384 });
  (0, import_node_fs17.writeFileSync)(rootCaPath, material.certPem, "utf8");
  assertCertMaterial(material, hosts);
  await verifyWithLocalHttps(material.certPem, material.keyPem, hosts);
  return {
    host,
    hosts,
    certPath,
    keyPath,
    rootCaPath,
    certPem: material.certPem,
    notBefore: material.notBefore.toISOString(),
    notAfter: material.notAfter.toISOString()
  };
}
function pemToDer(pem) {
  const body = pem.replace(/-----BEGIN [^-]+-----/g, "").replace(/-----END [^-]+-----/g, "").replace(/\s+/g, "");
  return Buffer.from(body, "base64");
}
function trustRootCertificate(certPath, opts = {}) {
  var _a, _b, _c;
  const platform = (_a = opts.platform) != null ? _a : process.platform;
  if (platform !== "win32") return { ok: false, skipped: true, error: `manual trust on ${platform}` };
  const derPath = (0, import_node_path16.join)((0, import_node_path16.dirname)(certPath), "rootCA.cer");
  try {
    const pem = (_b = opts.pemText) != null ? _b : (0, import_node_fs17.readFileSync)(certPath, "utf8");
    (0, import_node_fs17.writeFileSync)(derPath, pemToDer(pem));
    const exec = (_c = opts.execFile) != null ? _c : (file, args, options) => (0, import_node_child_process8.execFileSync)(file, args, options);
    exec("certutil", ["-user", "-addstore", "Root", derPath], {
      windowsHide: true,
      timeout: 2e4,
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, skipped: false };
  } catch (err) {
    const e = err;
    const stderr = typeof e.stderr === "string" ? e.stderr.trim() : "";
    const message = stderr !== "" ? stderr : typeof e.message === "string" ? e.message : String(err);
    return { ok: false, skipped: false, error: message };
  } finally {
    try {
      (0, import_node_fs17.unlinkSync)(derPath);
    } catch (e) {
    }
  }
}

// src/main.ts
async function copyTextToClipboard(text) {
  try {
    const requireFn = window.require;
    if (requireFn) {
      const electron = requireFn("electron");
      if (electron.clipboard) {
        electron.clipboard.writeText(text);
        return true;
      }
    }
  } catch (e) {
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}
var ConfirmModal = class extends import_obsidian10.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: this.opts.title });
    contentEl.createEl("p", { text: this.opts.body });
    if (this.opts.danger) {
      contentEl.createEl("p", { text: this.opts.danger, cls: "dsh-modal-danger" });
    }
    const s = new import_obsidian10.Setting(contentEl);
    s.addButton((b) => b.setButtonText(t("modal.cancel")).onClick(() => this.close()));
    if (this.opts.viewLink) {
      s.addButton(
        (b) => b.setButtonText(this.opts.viewLink.text).onClick(() => void window.open(this.opts.viewLink.url, "_blank"))
      );
    }
    s.addButton((b) => b.setButtonText(this.opts.confirmText).setCta().onClick(async () => {
      this.close();
      await this.opts.onConfirm();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var InstallPathModal = class extends import_obsidian10.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: this.opts.title });
    contentEl.createEl("p", { text: t("modal.installDesc") });
    const input = contentEl.createEl("input", { type: "text", value: this.opts.defaultPath, cls: "dsh-path-input" });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.close();
        this.opts.onConfirm(input.value);
      }
    });
    new import_obsidian10.Setting(contentEl).addButton(
      (b) => b.setButtonText(t("modal.cancel")).onClick(() => {
        this.close();
        this.opts.onCancel();
      })
    ).addButton(
      (b) => b.setButtonText(t("modal.installStart")).setCta().onClick(() => {
        this.close();
        this.opts.onConfirm(input.value);
      })
    );
  }
  onClose() {
    this.contentEl.empty();
  }
};
var TYPING_QUIET_MS = 300;
var STARTUP_CHECK_DELAY_MS = 12e3;
var DshHarnessPlugin = class extends import_obsidian10.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    /**
     * 设置页实例（v2.8.4）：适配判定不再弹窗，「重新检查适配」就是把这一页按最新事实重画一遍，
     * 因此需要持有引用。Obsidian 的 `addSettingTab` 不提供取回接口。
     */
    this.settingsTab = null;
    /** v2.9.1：远程访问配置生成互斥（生成证书 + TLS 自检约数秒，防连点重复生成、重复覆盖桌面 rootCA.pem）。 */
    this.mobileGenInFlight = false;
    /**
     * v2.8.8：只读触点自检的按版本缓存（键＝本机版本 + 基线版本；插件重载即清空）。
     * 只缓存"已核验全局官方安装且高于实测上界"的扫描；其余情形不跑也不留条目。
     */
    this.seamScanCache = null;
    /** DSH 前端桥接是否已就绪（注入脚本回报 ready 后置真）。 */
    this.bridgeReady = false;
    /** 启动体检定时器（适配 + 自动检查更新）；onunload 必须清掉，否则插件重载后定时器泄漏。 */
    this.startupChecksTimer = null;
    /** bridgeReady 对应的 iframe（面板重建后旧缓存失效，避免向无桥接的 frame 静默丢消息）。 */
    this.bridgeReadyFrame = null;
    /** 「DSH 聊天框桥接到 Obsidian」= auto 时，document 级选区监听是否已注册。 */
    this.autoSendRegistered = false;
    /** 自动注入去抖定时器。 */
    this.autoSendTimer = null;
    /**
     * v2.5.3：笔记侧最近一次按键时间。自动填充会把焦点临时挪进 DSH 输入框（写入必须要 focus），
     * 若此刻用户正在笔记里打字，按键就会落进 DSH（真机反馈「框选文字想改，结果打进了聊天框」）。
     * 故距最近一次按键 < TYPING_QUIET_MS 时不下发自动填充，等真正停下来再注入。
     */
    this.lastNoteKeyAt = 0;
    /**
     * v2.5.3：焦点不在 DSH 面板内时**暂存**待写入的隐式行，等页面回报 `dsh-composer-focus`
     * （用户点进聊天框）再写。写入本身就要求输入框获得焦点，因此"只在焦点已在内时才写"
     * 是从结构上消除抢焦点——用户停留在笔记侧时，插件一个字都不碰聊天框。
     */
    this.pendingAutoDraft = null;
    /** 最近一次选区是否已由自动注入填充（空选区时据此清除聊天框，只保留最新）。 */
    this.lastAutoInjected = false;
    /**
     * v2.8.0（setDraft 设计 P2）：页面脚本上报「官方模型层写入可用」。
     * 为真时 `autoSendNow` **撤掉焦点门控与打字静默期**——`setDraft` 不需要输入框获得焦点，
     * 既能在用户停留在笔记侧时立即写入（框选即出现），也不会把用户正在敲的键吸进聊天框。
     * 为假（客户端半未激活、DSH 无该插槽、dom 模式）时行为与 v2.5.3 逐字一致。
     * 只接受来自当前面板 iframe 的上报，且在 `dsh-bridge-ready` 时重置（面板重建后需重新上报）。
     */
    this.bridgeSetDraftCapable = false;
    /** v2.5.2：最近一次下发给该 frame 的草稿文本 + frame（相同草稿不重复下发，长会话下父页 selectionchange 会高频重发）。 */
    this.lastDraftFrame = null;
    this.lastDraftText = "";
    /**
     * v2.8.7：被焦点门控推迟过一次选区处理的标记。
     *
     * 为什么要它：`onDocSelection` 在「焦点已在面板 iframe 内」时直接 return（v2.5.2 的防闪烁守卫），
     * 而**焦点进入 iframe 会让父文档选区清空并派发 selectionchange**——那一次往往就是用户真实的
     * 「取消框选」。丢掉它的代价是：用户之后若不再回笔记侧产生新事件（点进面板→直接点发送是最常见动线），
     * 就再也没有任何事件来补做清除，隐式行残留在聊天框里并被随消息一起发出（真机故障，遥测实锤：
     * 最后一次 fill 之后的 35 分钟里 540 条心跳、0 条 fill）。
     *
     * 两条出口，按能力位分流（详见 `onDocSelection`）：
     *  - 官方模型层写入可用（`bridgeSetDraftCapable`）：**不推迟**，当场处理——`setDraft` 不需要焦点，
     *    既不会把用户按键吸进聊天框，也没有"清空→重写"的空态，v2.5.2 那条守卫的两个前提都不成立；
     *  - 只有 DOM 路径时：仍推迟，但把这一次记为脏，等焦点交回宿主时补跑（`onDocFocusIn`）。
     */
    this.selectionDirtyWhileInFrame = false;
    /** v2.5.2：填充遥测（3s 粒度汇总一行写进 dsh-panel-diag.log，用于定位"聊天框闪烁/重复"）。 */
    this.fillStatAt = 0;
    /** v2.5.2：填充遥测（3s 一行）。v2.8.7 起按路径细分并统计失败数，见 logFill。 */
    this.fillStat = { total: 0, same: 0, wrote: 0, failed: 0, composerFocus: 0, by: {} };
    /** dsh-fill-ack 等待器（fill 成功回传后 resolve；超时 resolve false）。v2.3.3 原版协议，v2.4.3 回退。 */
    this.fillAckResolvers = [];
    /** 桥接重建失败冷却截止（ms）：期间不再重复整页重建，避免每次发送都等 ~3s。 */
    this.bridgeReloadCooldownUntil = 0;
    /** openView 副作用节流（启动打点不每次打开都跑；更新检查 v2.3.0 起仅手动触发）。 */
    this.lastProfilerCommit = 0;
    /** 启动耗时打点器（onload → 探测 → 启动 → 就绪；写入插件数据目录）。 */
    this.profiler = null;
    /** AED 启动校验的一次性修复守卫：同一轮 AED 流程内只允许弹窗修复一次，避免循环弹窗。 */
    this.aedBootFixUsed = false;
    /** v2.5.3：笔记侧按键打点（只记时刻，不拦截事件）。 */
    this.onNoteKey = () => {
      this.lastNoteKeyAt = Date.now();
    };
    /** 选区事件（去抖 150ms）：有选区自动注入隐式行；新选区替换旧内容；空选区清除。 */
    this.onDocSelection = () => {
      const frame = this.currentFrame();
      if (frame !== null && document.activeElement === frame) {
        if (this.bridgeSetDraftCapable) this.scheduleAutoSend();
        else this.selectionDirtyWhileInFrame = true;
        return;
      }
      this.selectionDirtyWhileInFrame = false;
      this.scheduleAutoSend();
    };
    /**
     * v2.8.7：焦点从面板 iframe 交回宿主任意元素 → 补跑被 DOM 路径推迟过一次的那次选区处理。
     * 走同一条去抖链路，不会与紧随其后的 selectionchange 抢跑两次。
     */
    this.onDocFocusIn = () => {
      if (!this.selectionDirtyWhileInFrame) return;
      const frame = this.currentFrame();
      if (frame !== null && document.activeElement === frame) return;
      this.selectionDirtyWhileInFrame = false;
      this.scheduleAutoSend();
    };
  }
  async onload() {
    var _a;
    this.profiler = new StartupProfiler((_a = this.manifest.dir) != null ? _a : ".");
    this.profiler.mark("onload");
    await this.loadSettings();
    applyLocale(this.settings.language, this.settings.language === "auto" ? this.detectSystemLanguage() : void 0);
    this.buildService();
    this.profiler.mark("settings-ready");
    (0, import_obsidian10.addIcon)("dsh-logo", DSH_LOGO_SVG);
    this.registerView(DSH_VIEW_TYPE, (leaf) => new DshView(leaf, this));
    this.addRibbonIcon("dsh-logo", t("cmd.ribbon"), () => void this.openView());
    this.addCommand({
      id: "open-dsh",
      name: t("cmd.openPanel"),
      callback: () => void this.openView()
    });
    this.addCommand({
      id: "send-selection-to-dsh",
      name: t("cmd.sendSelection"),
      editorCallback: (editor) => void this.sendSelectionToDsh(editor)
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        menu.addItem(
          (item) => item.setTitle(t("menu.sendSelection")).setIcon("send").onClick(() => void this.sendSelectionToDsh(editor))
        );
      })
    );
    this.registerDomEvent(window, "message", (event) => {
      var _a2, _b, _c;
      const frame = this.currentFrame();
      if (!frame || event.source !== frame.contentWindow) {
        return;
      }
      const data = (_a2 = event.data) != null ? _a2 : {};
      if (data.type === "dsh-bridge-ready") {
        this.bridgeReady = true;
        this.bridgeReadyFrame = frame;
        this.lastDraftFrame = null;
        this.lastDraftText = "";
        this.bridgeSetDraftCapable = false;
        this.postToFrame(frame, { type: "dsh-open-cfg", vaultRoot: this.vaultRoot() });
        this.postToFrame(frame, { type: "dsh-kbd-cfg", keys: this.passthroughKeys() });
        this.syncAutoSendRegistration();
      }
      if (data.type === "dsh-bridge-client" || data.type === "dsh-bridge-cap") {
        if (data.setDraft === true && !this.bridgeSetDraftCapable) {
          this.bridgeSetDraftCapable = true;
          diagLog(this.diagDirs(), "setDraft \u53EF\u7528\uFF1A\u5DF2\u64A4\u6389\u81EA\u52A8\u586B\u5145\u7684\u7126\u70B9\u95E8\u63A7\uFF08\u6846\u9009\u5373\u51FA\u73B0\uFF09");
          const pending = this.pendingAutoDraft;
          if (pending !== null) {
            this.pendingAutoDraft = null;
            this.postDraft(frame, pending);
            this.lastAutoInjected = pending !== "";
          }
        }
      }
      if (data.type === "dsh-composer-focus") {
        this.flushPendingAutoDraft(frame);
      }
      if (data.type === "dsh-sd-fail" && typeof data.reason === "string") {
        this.logFill(`sd-fail:${data.reason}`, false, false);
        return;
      }
      if (data.type === "dsh-fill-ack") {
        const resolvers = this.fillAckResolvers;
        this.fillAckResolvers = [];
        for (const resolve2 of resolvers) resolve2();
        const had = data.had === true;
        const sd = data.sd === true;
        const note = typeof data.note === "string" ? data.note : "";
        const fillOk = data.ok === true;
        this.logFill(note, had, fillOk);
        if (!fillOk) {
          this.lastDraftFrame = null;
          this.lastDraftText = "";
        }
        if (!had && !sd) {
          try {
            (_c = (_b = this.app.workspace.getActiveViewOfType(import_obsidian10.MarkdownView)) == null ? void 0 : _b.editor) == null ? void 0 : _c.focus();
          } catch (e) {
          }
        }
      }
      if (data.type === "dsh-open-in-obsidian" && typeof data.path === "string" && data.path !== "") {
        if (this.settings.bridgeToObsidian !== "off") {
          this.openVaultTarget(data.path);
        }
      }
      if (data.type === "dsh-wikilink" && typeof data.target === "string") {
        if (this.settings.bridgeToObsidian !== "off") {
          this.openVaultTarget(data.target);
        }
      }
      if (data.type === "dsh-kbd-shortcut" && typeof data.key === "string") {
        this.executePassthroughShortcut(data.key);
      }
      if (data.type === "dsh-kbd-request") {
        this.postToFrame(frame, { type: "dsh-kbd-cfg", keys: this.passthroughKeys() });
      }
      if (data.type === "dsh-ui-state" && typeof data.len === "number") {
        const len = data.len;
        const apiRaw = data.api;
        const api = typeof apiRaw === "number" ? apiRaw : void 0;
        for (const leaf of this.app.workspace.getLeavesOfType(DSH_VIEW_TYPE)) {
          const v = leaf.view;
          if (v instanceof DshView) v.notifyUiState(len, api);
        }
      }
    });
    this.settingsTab = new DshSettingTab(this.app, this);
    this.addSettingTab(this.settingsTab);
    void this.installBridge();
    this.reportInjectStormIfAny();
    this.ensureNoOpenAdaptive();
    this.scheduleStartupChecks();
    this.syncAutoSendRegistration();
  }
  /**
   * 桥接补丁条目的安装形态（v2.8.0）：由「填充写入方式」推导。
   * `auto` → `package`（裸包名条目 + profile 下 node_modules 链接）——这是装载器认得 `client.js`
   * 的唯一形态，也是官方 `setDraft` 的唯一来源；`dom` → `path`（历史形态，行为与旧版逐字一致）。
   * 链接建不出来时 `writeBridgeFiles` 会自动退回 path 并把原因写进 `error`。
   */
  bridgeInstallMode() {
    return installModeFor(normalizeBridgeInputMode(this.settings.bridgeInputMode));
  }
  /** 写入桥接文件；变更时提示需重启 DSH 服务生效。 */
  installBridge() {
    const result = writeBridgeFiles(void 0, this.manifest.version, this.settings.profile, this.bridgeInstallMode());
    if (result.error) {
      console.warn("[dsh-harness] \u6865\u63A5\u5B89\u88C5\u5931\u8D25:", result.error);
      return;
    }
    if (result.changed || result.pluginRewritten) {
      new import_obsidian10.Notice(t("notice.bridgeInstalled"), 1e4);
    }
  }
  /**
   * DSH 或插件更新后自动重写桥接文件：确保磁盘桥接代码与插件当前源码一致
   * （DSH 新版本可能改变注入机制；writeBridgeFiles 内置内容哈希保险，内容一致时不重写、幂等）。
   * 若桥接已安装但内容有变，提示重启 DSH 服务生效。
   */
  rewriteBridgeAfterUpdate() {
    if (!isBridgeInstalled(void 0, this.settings.profile)) return;
    const result = writeBridgeFiles(void 0, this.manifest.version, this.settings.profile, this.bridgeInstallMode());
    if (result.error) {
      console.warn("[dsh-harness] \u66F4\u65B0\u540E\u6865\u63A5\u91CD\u5199\u5931\u8D25:", result.error);
      return;
    }
    if (result.changed || result.pluginRewritten) {
      new import_obsidian10.Notice(t("notice.bridgeRewritten"), 1e4);
    }
  }
  // ==================== v2.6.0：profile 选择、适配判定与启动体检 ====================
  /** 本机已有的 DSH profile 目录名（设置页下拉用）；`web` 与当前值恒在列内。 */
  listDshProfiles() {
    const names = listProfiles(this.aedHomeDir());
    if (!names.includes("web")) names.unshift("web");
    if (!names.includes(this.settings.profile)) names.push(this.settings.profile);
    return names;
  }
  /**
   * 设置页请求切换 profile：**先弹确认再执行**（会重建服务、改写默认启动命令）。
   * 校验（白名单 + 内置模板名）在这里做一次给用户即时反馈，`applyProfileChange` 内再守一次——
   * 后者是非 UI 路径（迁移/脚本）的兜底，两处共用 `src/profile.ts` 同一事实源。
   */
  requestProfileChange(nextRaw) {
    const raw = (nextRaw != null ? nextRaw : "").trim().toLowerCase();
    if (raw === "" || raw === this.settings.profile) return;
    if (!VALID_PROFILE_RE.test(raw)) {
      new import_obsidian10.Notice(t("settings.profile.invalid", { name: raw }), 1e4);
      return;
    }
    if (isReservedProfile(raw)) {
      new import_obsidian10.Notice(t("settings.profile.reserved", { name: raw }), 12e3);
      return;
    }
    new ConfirmModal(this.app, {
      title: t("modal.profileSwitchTitle"),
      body: t("modal.profileSwitchBody", { from: this.settings.profile, to: raw }),
      danger: t("modal.profileSwitchDanger"),
      confirmText: t("modal.profileSwitchConfirm"),
      onConfirm: () => this.applyProfileChange(raw)
    }).open();
  }
  /** 桥接两级健康度：文件层（补丁装没装）+ 页面层（DSH 实际吐出的 HTML 有没有桥接脚本）。 */
  async getBridgeHealth() {
    if (!isBridgeInstalled(void 0, this.settings.profile)) return "not-installed";
    const ep = this.endpoint();
    const auth = await probePanelNeedsAuth(ep);
    if (auth === "unknown") return "unknown";
    const token = this.launchToken();
    const probe = await probeBridgeInjected(ep, token);
    if (probe === "injected") return "live";
    if (probe === "missing") return "not-live";
    return "unknown";
  }
  /** 当前启动日志里的 token（无日志/无 token 时返回空串，探针会退到裸路径）。 */
  launchToken() {
    var _a, _b, _c;
    const url = (_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "";
    if (url === "") return "";
    try {
      return (_c = new URL(url).searchParams.get("token")) != null ? _c : "";
    } catch (e) {
      return "";
    }
  }
  /**
   * 等启动 token 就绪（AED 收尾校验专用，v2.8.6）。
   * AED 的 safe/clear 之后必然重启 DSH，而 token 是**每进程新生成**、由启动输出打印后
   * 从日志解析（见 service-manager.parseLaunchUrl，v2.4.0 起每次重读）。服务刚起来时日志
   * 可能还没写出这一行；此时校验只能退回裸地址，而 0.1.2+ 裸 `GET /` 恒 401 ⇒ 每次 AED 后
   * 都误弹「检测到 DSH 启动异常」。这里最多等 waitMs（每 800ms 重读一次），超时返回空串，
   * 由 verifyDshBootAsync 按「无凭据」处理（<0.1.2 本来就没有 token，属正常路径）。
   */
  async awaitLaunchToken(waitMs = 1e4) {
    const deadline = Date.now() + waitMs;
    for (; ; ) {
      const token = this.launchToken();
      if (token !== "") return token;
      if (Date.now() >= deadline) return "";
      await new Promise((resolve2) => window.setTimeout(resolve2, 800));
    }
  }
  /**
   * 适配快照（设置页状态横幅、当前适配状态行与「DSH版本适配说明」共用；不产生任何 UI 副作用）。
   *
   * v2.8.4：按用户指示**取消「本机 DSH 不适配」的全部弹窗**——判定照旧产出，但只写成快照，
   * 由设置页两行文字与 DSH 状态横幅静默呈现；启动流程里不再有任何模态框。
   * 本函数**永不抛错**：体检绝不能把插件加载或设置页渲染带下水；读不到时返回 null。
   */
  async getCompatSnapshot() {
    try {
      const info = await this.getDshVersionInfo();
      const level = info.verified ? judgeDshCompat(info.version) : "unknown";
      const bridge = await this.getBridgeHealth();
      return {
        version: info.version,
        level,
        bridge,
        issue: compatIssue(level, bridge),
        verified: info.verified,
        // A2：0.1.7 起跨版本会话只报告不改写（静态 catalog 无法离线校验），如实标注能力差异
        repairLimited: info.verified ? repairCapabilityLimited(info.version) : false,
        // v2.8.8：高于实测上界时自动跑只读触点自检（缓存命中即回；不参与等级判定，绝不弹窗）
        seamScan: await this.seamScanFor(info, level)
      };
    } catch (err) {
      console.warn("[dsh-harness] \u9002\u914D\u4F53\u68C0\u5931\u8D25:", err);
      return null;
    }
  }
  /**
   * v2.8.8：按快照上下文取触点自检结果。不适用（非「高于上界」/非已核验全局安装/找不到安装根）→ null。
   * 扫描异步进行且按版本缓存——设置页首行先显示判定文字，自检完成前 `seamScan` 走同一条缓存 Promise，
   * 完成后「重新检查适配」或重开设置页即可看到结论；开机预热（`prewarmSeamScan`）通常已把缓存备好。
   */
  async seamScanFor(info, level) {
    var _a;
    if (!seamScanApplicable({ verified: info.verified, source: info.source, level })) return null;
    const key = `${info.version}|${COMPAT_BASELINE_VERSION}`;
    if (((_a = this.seamScanCache) == null ? void 0 : _a.key) === key) return this.seamScanCache.promise;
    const promise = runSeamScan(info.version);
    this.seamScanCache = { key, promise };
    return promise;
  }
  /**
   * v2.8.8：开机后台预热触点自检（用户机制定案的"插件启动时自动"环节）。
   * 只在已核验全局官方安装且版本高于实测上界时真正扫描；结果只进缓存，无任何 UI 副作用。
   */
  async prewarmSeamScan() {
    try {
      const info = await this.getDshVersionInfo();
      const level = info.verified ? judgeDshCompat(info.version) : "unknown";
      await this.seamScanFor(info, level);
    } catch (err) {
      console.warn("[dsh-harness] \u89E6\u70B9\u81EA\u68C0\u9884\u70ED\u5931\u8D25:", err);
    }
  }
  /**
   * 启动后的后台动作（延后执行，避开首屏渲染与面板探活）：按通道自动检查 DSH 更新；
   * v2.8.8 追加第三项——只读触点自检预热（仅当本机高于实测上界才真正扫描；不弹窗、不改判定）。
   * v2.8.4：适配体检不再挂在这里——它不弹窗了，就没有"开机跑一次"的意义，改由设置页按需读取。
   */
  scheduleStartupChecks() {
    this.startupChecksTimer = window.setTimeout(() => {
      this.startupChecksTimer = null;
      void this.autoCheckDshUpdate();
      void this.prewarmSeamScan();
    }, STARTUP_CHECK_DELAY_MS);
  }
  /** 自动检查 DSH 更新（v2.6.0 重开）：只检查+弹确认框，绝不静默安装（更新会先结束全部 DSH 进程）。 */
  async autoCheckDshUpdate() {
    if (!this.settings.autoCheckUpdates) return;
    const gateMs = Math.max(1, this.settings.autoCheckIntervalHours) * 60 * 60 * 1e3;
    if (Date.now() - this.settings.lastAutoUpdateAtMs < gateMs) return;
    this.settings.lastAutoUpdateAtMs = Date.now();
    await this.saveSettings();
    try {
      const result = await this.detectUpdate();
      if (result && result.state === "behind") {
        this.askUpdate(result);
      } else if (result) {
        diagLog(this.diagDirs(), `auto-update: ${result.state} (${this.settings.updateChannel})`);
      }
    } catch (err) {
      console.warn("[dsh-harness] \u81EA\u52A8\u68C0\u67E5\u66F4\u65B0\u5931\u8D25:", err);
    }
  }
  /**
   * 当前连接端点（v2.9.0）：设置 → `ServiceEndpoint` 的**唯一**派生点。
   * 探活、netstat 端口占用识别、Node 侧 HTTP(S) 请求、iframe 首载、postMessage targetOrigin、AED 启动校验
   * 全部从这里取，不再各自拼 `127.0.0.1:<port>`。
   */
  endpoint() {
    return endpointFromSettings(this.settings);
  }
  /** 设置页「连接地址」行与视图诊断行用的人类可读端点串（IPv6 带方括号）。 */
  dshEndpointLabel() {
    return endpointLabel(this.endpoint());
  }
  /**
   * 「测试连接」（v2.9.0）：只读诊断，**不改任何设置、不重启服务**。
   * ① 先 TCP 探活（`service.probe()`）判断地址:端口有没有人监听；
   * ② 再按当前端点发一次 `GET /`（https 按设置里的证书 PEM 严格校验）：
   *    2xx–4xx 视为「连得上」（DSH ≥0.1.2 的裸 `GET /` 恒 401，属正常——面板需要启动 token）；
   *    连接被拒 / 超时 / TLS 证书错误 分别归类，供设置页给不同提示。
   * `detail`：kind='ok'/'http' 时是 HTTP 状态码；kind='tls' 时是原始错误文本（含 Node 的 code=…）。
   */
  async testServiceConnection() {
    const ep = this.endpoint();
    const listening = await this.service.probe().catch(() => false);
    try {
      const res = await endpointRequest(ep, { path: "/", method: "GET", timeoutMs: 4e3 });
      if (res.status >= 200 && res.status < 500) return { ok: true, kind: "ok", detail: String(res.status) };
      return { ok: false, kind: "http", detail: String(res.status) };
    } catch (err) {
      const fail = classifyConnectFailure(err);
      const kind = !listening && fail.kind === "other" ? "refused" : fail.kind;
      const detail = err instanceof Error ? err.message : String(err);
      return { ok: false, kind, detail };
    }
  }
  /**
   * 「远程访问配置」一键执行（v2.9.1，§4）：
   * ① `generateCerts()` 检测本机局域网 IPv4、生成自签证书/私钥，并把 `rootCA.pem` 复制到桌面；
   * ② 把服务地址（局域网 IP）/ 协议（https）/ 证书路径 / 私钥路径写进设置并落盘；
   * ③ 重建 ServiceManager 让新端点立即生效——**不自动重启服务**（重启由 Done 弹窗的 CTA 显式触发）。
   * 失败原样返回错误码/原始 message（`no-lan-address` / `desktop-missing` 由弹窗映射成本地化文案）；
   * v2.9.2 追加两种「自定义启动命令冲突」预检（生成证书之前就返回，设置与文件都不动）：
   * `custom-host`＝命令里写死的 `--host` 与检测到的局域网 IP 不一致；`custom-tls`＝命令里已写
   * `--tls-cert/--tls-key`（会覆盖本次生成的新证书，手机与插件必然对不上）。
   * 生成期间用 `mobileGenInFlight` 互斥，重复调用直接返回 `busy`。
   */
  async generateMobileAccessConfig() {
    var _a;
    if (this.mobileGenInFlight) return { ok: false, error: "busy" };
    this.mobileGenInFlight = true;
    try {
      const lan = detectLanIPv4();
      if (lan === null) return { ok: false, error: "no-lan-address: no LAN IPv4 interface found" };
      const command = String((_a = this.settings.startupCommand) != null ? _a : "");
      const commandHost = hostFlagInCommand(command);
      if (commandHost !== null) {
        const normalized = normalizeServiceHost(commandHost);
        if (!normalized.ok || normalized.host !== lan.toLowerCase()) return { ok: false, error: "custom-host" };
      }
      if (hasTlsFlagsInCommand(command)) return { ok: false, error: "custom-tls" };
      const result = await generateCerts({ hosts: ["localhost", "127.0.0.1", "::1", lan] });
      const trust = trustRootCertificate(result.rootCaPath);
      this.settings.serviceHost = result.host;
      this.settings.serviceScheme = "https";
      this.settings.tlsCertPath = result.certPath;
      this.settings.tlsKeyPath = result.keyPath;
      await this.saveSettings();
      this.reconfigureService();
      refreshSettingTab(this.settingsTab);
      return { ok: true, result, trust };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    } finally {
      this.mobileGenInFlight = false;
    }
  }
  /**
   * 「远程访问配置 · 恢复默认端点」（v2.9.1，§11；v2.9.3 起自动重启并刷新面板）：
   * 四项回退为 127.0.0.1 / http / 清空两个 TLS 路径，落盘、重建 ServiceManager，然后**自动重启服务**
   * 并刷新面板——旧实例仍绑在局域网 IP 上，不重启的话面板/浏览器看到的还是旧地址。
   * **不删除**证书文件与桌面 `rootCA.pem`，也不撤销系统/手机里已安装的证书信任。
   * 外部浏览器里**已经打开**的页面无法由插件改写 URL，需用户手动关闭后重新打开。
   */
  async resetMobileAccessSettings() {
    Object.assign(this.settings, resetEndpointSettings());
    await this.saveSettings();
    this.reconfigureService();
    refreshSettingTab(this.settingsTab);
    await this.doRestart();
  }
  /** 依据当前设置构造 ServiceManager。 */
  buildService() {
    var _a, _b, _c;
    const basePath = (_c = (_b = (_a = this.app.vault.adapter).getBasePath) == null ? void 0 : _b.call(_a)) != null ? _c : "";
    let userCommand = this.settings.startupCommand;
    const badProfile = nonWebProfileInCommand(userCommand);
    if (badProfile !== null) {
      const msg = t("settings.command.nonWebFallback", { p: badProfile });
      diagLog(this.diagDirs(), msg);
      new import_obsidian10.Notice(msg, 14e3);
      userCommand = "";
    }
    const ep = this.endpoint();
    const customCommand = typeof userCommand === "string" ? userCommand : "";
    const baseCommand = customCommand !== "" ? customCommand : detectStartupCommand(this.settings.profile) || `pnpm dsh ${repoStartupTail(this.settings.profile)}`;
    const startupCommand = applyEndpointFlags(baseCommand, ep, this.settings.tlsKeyPath);
    const startupCwd = this.settings.startupCwd || basePath;
    diagLog(this.diagDirs(), `service: endpoint=${endpointLabel(ep)} cmd=${startupCommand}`);
    this.service = new DshServiceManager({
      endpoint: ep,
      startupCommand,
      startupCwd,
      profile: this.settings.profile,
      autoStart: this.settings.autoStart,
      detached: this.settings.detached,
      readyTimeoutMs: this.settings.readyTimeoutSec * 1e3,
      // v2.8.7：spawn 失败的完整诊断（code/syscall/实际命令）落进事件日志，
      // 这样外部用户只需发 `dsh-panel-diag.log` 就能定位，而不是"报错"两个字加一张截图。
      onSpawnFailure: (detail) => {
        diagLog(this.diagDirs(), `spawn \u5931\u8D25\uFF1A${detail}`);
      }
    });
    prewarmLoginShellPath();
  }
  /**
   * DSH 版本自适应（后台、非阻塞）：`dsh web --help` 实测约 8 秒，放到定时器里异步执行。   * 双向处理 `--no-open`：
   * - 当前 dsh 支持（rc.7+）且启动命令缺 flag → 自动补上（避免启动/重启服务时自动拉起浏览器）；
   * - 不支持且命令含 flag → 自动移除并保存（避免 unknown option 启动失败）。
   * 探测结果在 service-manager 内缓存，后续 `dshSupportsNoOpen()` 直接命中缓存、零开销。
   */
  ensureNoOpenAdaptive() {
    window.setTimeout(() => {
      probeNoOpenSupportAsync((supported) => {
        const next = applyNoOpenAdaptive(this.settings.startupCommand || "", supported);
        if (next === null) return;
        this.settings.startupCommand = next;
        void this.saveSettings();
        new import_obsidian10.Notice(supported ? t("notice.noOpenAdded") : t("notice.noOpenRemoved"), 8e3);
      });
    }, 500);
  }
  /** 设置变更后重建 ServiceManager，使新配置立即生效。 */
  reconfigureService() {
    var _a;
    (_a = this.service) == null ? void 0 : _a.dispose();
    this.buildService();
  }
  /**
   * v2.6.0：profile 设置项的变更副作用链（设置页防抖后调用）。
   * ① 白名单校验（非法值 → 提示并保持旧值）；② 与旧值相同 → 直接返回；
   * ③ 落盘 + 同步 AED 文件层目标 profile；④ 代建 profile（`--from-default-profile web` 的 dump 分支，
   * 只创建不 boot；失败中止不装桥接——避免"无桥接白屏"假成功）；⑤ 装桥接到新 profile 目录；
   * ⑥ 重建 ServiceManager；⑦ 端口/自定义命令的共存性提示（只提示不改写用户命令）。
   */
  async applyProfileChange(nextRaw) {
    const raw = nextRaw.trim().toLowerCase();
    if (raw === "") return;
    if (!VALID_PROFILE_RE.test(raw)) {
      new import_obsidian10.Notice(t("settings.profile.invalid", { name: raw }), 1e4);
      return;
    }
    if (isReservedProfile(raw)) {
      new import_obsidian10.Notice(t("settings.profile.reserved", { name: raw }), 12e3);
      return;
    }
    const next = raw;
    if (next === this.settings.profile) return;
    this.settings.profile = next;
    await this.saveSettings();
    setAedProfile(next);
    const ensured = await ensureProfile(this.aedHomeDir(), next);
    if (ensured.kind === "failed") {
      new import_obsidian10.Notice(t("notice.profileCreateFail", { profile: next, err: ensured.error }), 15e3);
      return;
    }
    if (ensured.kind === "created") {
      new import_obsidian10.Notice(t("notice.profileCreated", { profile: next }), 1e4);
    }
    const bridge = writeBridgeFiles(void 0, this.manifest.version, next, this.bridgeInstallMode());
    if (bridge.error) {
      new import_obsidian10.Notice(t("settings.bridge.rewrite.fail", { err: bridge.error }), 12e3);
    }
    this.reconfigureService();
    if (next !== "web") {
      if (this.settings.port === 3080) {
        new import_obsidian10.Notice(t("settings.profile.warnPort"), 12e3);
      }
      const cmd = this.settings.startupCommand;
      if (cmd !== "" && !cmd.includes("--profile")) {
        new import_obsidian10.Notice(t("settings.profile.warnCmdMismatch"), 12e3);
      }
      new import_obsidian10.Notice(t("notice.profileSwitched", { profile: next }), 12e3);
    }
  }
  onunload() {
    var _a;
    if (this.startupChecksTimer !== null) {
      window.clearTimeout(this.startupChecksTimer);
      this.startupChecksTimer = null;
    }
    this.unregisterAutoSend();
    (_a = this.service) == null ? void 0 : _a.dispose();
  }
  async openView() {
    var _a, _b;
    const existing = this.app.workspace.getLeavesOfType(DSH_VIEW_TYPE);
    if (existing.length > 0) {
      await this.app.workspace.revealLeaf(existing[0]);
    } else {
      const leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({ type: DSH_VIEW_TYPE, active: true });
      await this.app.workspace.revealLeaf(leaf);
    }
    (_a = this.profiler) == null ? void 0 : _a.mark("panel-ready");
    const now = Date.now();
    if (now - this.lastProfilerCommit > 1e4) {
      this.lastProfilerCommit = now;
      (_b = this.profiler) == null ? void 0 : _b.commit(true);
    }
    const frame = this.currentFrame();
    if (frame) {
      this.postToFrame(frame, { type: "dsh-kbd-cfg", keys: this.passthroughKeys() });
    }
    this.syncAutoSendRegistration();
  }
  /** 刷新已打开的面板视图（用于设置变更后重载界面）。 */
  async refreshView() {
    for (const leaf of this.app.workspace.getLeavesOfType(DSH_VIEW_TYPE)) {
      const view = leaf.view;
      if (view instanceof DshView) {
        await view.refresh();
      }
    }
  }
  /** 一键检测本机 DSH 并应用启动配置。 */
  async detectAndApplyConfig() {
    const result = detectDshConfig({ cwd: this.settings.startupCwd }, { profile: this.settings.profile });
    if (result.found) {
      this.settings.startupCommand = result.startupCommand;
      this.settings.startupCwd = result.startupCwd;
      await this.saveSettings();
      this.reconfigureService();
      new import_obsidian10.Notice(result.message);
    } else {
      new import_obsidian10.Notice(result.message, 8e3);
    }
  }
  /**
   * 在 Obsidian 中打开一个库内目标（v2.5.0）。来源有两种：
   * ① 对话里被注解的 `[[wikilink]]`（别名已在页面脚本剥离，可能带 `#标题` 锚点、省略 `.md`）；
   * ② 消息里的绝对/相对路径（既有「Vault 内路径点击」）。
   * 解析优先用 Obsidian 自己的 wikilink 解析（`getFirstLinkpathDest`），失败再按路径查找；
   * 两者都失败 → 明确提示"未找到"（Issue 要求的"笔记不存在时给出提示"，旧实现走 obsidian:// URI 是静默失败）。
   */
  openVaultTarget(target) {
    const raw = target.trim().replace(/^\[\[|\]\]$/g, "");
    if (raw === "") return false;
    if (this.app.metadataCache.getFirstLinkpathDest(raw, "") !== null) {
      void this.app.workspace.openLinkText(raw, "", false);
      return true;
    }
    const norm = raw.replace(/\\/g, "/");
    const base = this.vaultRoot().replace(/\\/g, "/").replace(/\/+$/, "");
    const rel = base !== "" && norm.toLowerCase().startsWith(`${base.toLowerCase()}/`) ? norm.slice(base.length + 1) : norm;
    if (this.app.vault.getAbstractFileByPath(rel) !== null) {
      void this.app.workspace.openLinkText(rel, "", false);
      return true;
    }
    new import_obsidian10.Notice(t("notice.linkNotFound", { target: raw }), 8e3);
    return false;
  }
  /** 用系统默认浏览器打开任意 URL（electron shell.openExternal，失败降级新标签页）。 */
  openInBrowser(url) {
    try {
      const requireFn = window.require;
      if (requireFn) {
        const electron = requireFn("electron");
        if (electron.shell) {
          void electron.shell.openExternal(url);
          return;
        }
      }
    } catch (e) {
    }
    window.open(url, "_blank");
  }
  /** 在系统默认浏览器中打开 DSH Web GUI（DSH ≥0.1.2 优先使用启动输出里的带 token 认证链接）。 */
  openDshInBrowser() {
    var _a, _b;
    const authUrl = (_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "";
    this.openInBrowser(authUrl !== "" ? authUrl : `${endpointOrigin(this.endpoint())}/`);
  }
  /**
   * 复制带 token 的启动链接（v2.9.2，手机访问用）。
   *
   * 为什么需要专门按钮：DSH 的 token 链接在浏览器里会先 200/303 种下登录 cookie 再跳转，
   * **跳转后地址栏里的 `?token=` 会消失**——从地址栏复制往往得到裸地址，手机打开就是
   * “dsh web authentication required; reopen the URL printed by dsh web.”。这里直接复制
   * 启动日志里打印的原始链接（服务刚启动、日志尚未打印时最多等 3 秒）。
   */
  async copyDshTokenUrl() {
    var _a, _b;
    await this.awaitLaunchToken(3e3);
    const url = (_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "";
    if (url === "") {
      new import_obsidian10.Notice(t("notice.tokenMissing"), 12e3);
      return false;
    }
    const copied = await copyTextToClipboard(url);
    new import_obsidian10.Notice(copied ? t("notice.tokenCopied") : t("notice.tokenCopyFail", { url }), copied ? 12e3 : 18e3);
    return copied;
  }
  /** 面板 iframe 首载地址（v2.3.2）：有启动认证链接时带 token+ob=1 走嵌入适配器，否则普通地址。 */
  dshEmbedFrameUrl() {
    var _a, _b;
    return embedFrameUrl((_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "", endpointOrigin(this.endpoint()));
  }
  /** 打开会话格式修复弹窗（设置页 / 升级后预检发现不可读会话时调用；内部只读预检 + 显式点击才改写）。 */
  openSessionRepair() {
    new SessionRepairModal(this.app, this.aedHomeDir()).open();
  }
  /** 重连 DSH 服务：刷新所有已打开面板（重新探活并渲染）。 */
  async reconnectDsh() {
    await this.refreshView();
    const online = this.isDshInstalled() ? await this.service.probe() : false;
    new import_obsidian10.Notice(online ? t("notice.reconnected") : t("notice.notRunning"), 6e3);
  }
  // ---- 框选文字发送到 DSH（Claudian 式交互：选中 → 发送 → 智能体自动处理；隐式桥接注入，不发送原文）----
  /**
   * 把选中文字送进 DSH：生成桥接隐式信息行（位置/字数/路径，不显示原文）注入聊天框；
   * 桥接未就绪时降级为直接发送隐式行。
   * @param editor - 当前编辑器（提供选区位置）
   */
  async sendSelectionToDsh(editor) {
    var _a, _b;
    if (this.settings.bridgeToObsidian === "off") {
      new import_obsidian10.Notice(t("notice.bridgeOff"), 6e3);
      return;
    }
    const raw = (editor ? editor.getSelection() : "").trim();
    if (raw === "") {
      new import_obsidian10.Notice(t("notice.selectFirst"));
      return;
    }
    const message = this.bridgeSendText(editor);
    if (message === "") {
      new import_obsidian10.Notice(t("notice.sendNoFile"), 6e3);
      return;
    }
    const hotFrame = this.hotReadyFrame();
    if (hotFrame) {
      await this.fillDraftAndNotify(hotFrame, message);
      return;
    }
    const online = await this.service.probe();
    if (!online) {
      new import_obsidian10.Notice(t("notice.startingPanel"), 6e3);
      await this.openView();
      const deadline = Date.now() + 8e3;
      while (Date.now() < deadline) {
        if (await this.service.probe()) break;
        await new Promise((resolve2) => window.setTimeout(resolve2, 1e3));
      }
      if (!await this.service.probe()) {
        new import_obsidian10.Notice(t("notice.notRunning"), 6e3);
        return;
      }
    }
    await this.openView();
    const frame = this.currentFrame();
    if (frame && await this.ensureBridgeReady(frame)) {
      await this.fillDraftAndNotify(frame, message);
      return;
    }
    if (isBridgeInstalled(void 0, this.settings.profile) && await this.reloadPanelAndWaitForBridge()) {
      const frame2 = this.currentFrame();
      if (frame2) {
        await this.fillDraftAndNotify(frame2, message);
        return;
      }
    }
    const authUrl = (_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "";
    const ep = this.endpoint();
    const target = await resolveTargetSession(ep, void 0, authUrl);
    if (!target.ok) {
      new import_obsidian10.Notice(t("notice.sendFailed", { err: target.error }), 8e3);
      return;
    }
    const sent = await sendTextToSession(ep, target.value, message, void 0, authUrl);
    if (!sent.ok) {
      new import_obsidian10.Notice(t("notice.sendFailed", { err: sent.error }), 8e3);
      return;
    }
    new import_obsidian10.Notice(t("notice.bridgeFallback"), 8e3);
    if (this.settings.openPanelOnSend) {
      await this.openView();
    }
  }
  /** 桥接已就绪且 frame 未变（热路径）时返回该 frame，否则 null。 */
  hotReadyFrame() {
    const frame = this.currentFrame();
    if (!frame || !this.bridgeReady || this.bridgeReadyFrame !== frame) return null;
    return frame;
  }
  /** 向面板注入隐式行并等待 ACK：确认填入成功才提示「已填入」，否则提示页面仍在加载。v2.3.3 原版，v2.4.3 回退。 */
  async fillDraftAndNotify(frame, text) {
    this.lastDraftFrame = frame;
    this.lastDraftText = text;
    this.postToFrame(frame, { type: "dsh-fill-draft", text });
    this.lastAutoInjected = text !== "";
    const acked = await this.waitFillAck(1500);
    new import_obsidian10.Notice(acked ? t("notice.filled") : t("notice.fillPending"), 6e3);
  }
  /** 等待注入脚本回传 dsh-fill-ack（fill 成功后），超时返回 false。 */
  waitFillAck(timeoutMs) {
    return new Promise((resolve2) => {
      let timer = 0;
      const done = () => {
        window.clearTimeout(timer);
        resolve2(true);
      };
      timer = window.setTimeout(() => {
        this.fillAckResolvers = this.fillAckResolvers.filter((r) => r !== done);
        resolve2(false);
      }, timeoutMs);
      this.fillAckResolvers.push(done);
    });
  }
  /** 由编辑器选区生成注入文本（仅隐式信息行；编辑指令由桥接插件的 pre-step 钩子隐藏注入，不占用聊天框）。 */
  bridgeSendText(editor) {
    return this.bridgeMessageFor(editor);
  }
  /** 由编辑器选区生成桥接隐式信息行（路径 + 精确行:列 + 字数）；无选区/无活动文件时返回空。 */
  bridgeMessageFor(editor) {
    var _a, _b, _c;
    try {
      if (!editor || !editor.somethingSelected()) {
        return "";
      }
      const from = editor.getCursor("from");
      const to = editor.getCursor("to");
      const selected = editor.getSelection();
      const file = this.app.workspace.getActiveFile();
      if (!file) return "";
      const base = (_c = (_b = (_a = this.app.vault.adapter).getBasePath) == null ? void 0 : _b.call(_a)) != null ? _c : "";
      const full = base === "" ? file.path : (0, import_node_path17.join)(base, file.path);
      return buildBridgeMessage(full, { fromLine: from.line, fromCh: from.ch, toLine: to.line, toCh: to.ch }, countWords(selected));
    } catch (e) {
      return "";
    }
  }
  /**
   * 同步「自动发送」选区监听注册：仅当「DSH 聊天框桥接到 Obsidian」= auto 且
   * DSH 面板已打开（iframe 存在）时注册 document 级选区监听（设计：面板未开不注册）。
   * 在设置变更、面板打开、桥接就绪时调用。
   */
  syncAutoSendRegistration() {
    const want = this.settings.bridgeToObsidian === "auto" && this.currentFrame() !== null;
    if (want === this.autoSendRegistered) return;
    if (want) {
      document.addEventListener("mouseup", this.onDocSelection);
      document.addEventListener("keyup", this.onDocSelection);
      document.addEventListener("selectionchange", this.onDocSelection);
      document.addEventListener("focusin", this.onDocFocusIn);
      document.addEventListener("keydown", this.onNoteKey, true);
      this.autoSendRegistered = true;
    } else {
      this.unregisterAutoSend();
    }
  }
  /** 无条件移除选区监听（onunload / 模式切换时调用）。 */
  unregisterAutoSend() {
    if (!this.autoSendRegistered) return;
    document.removeEventListener("mouseup", this.onDocSelection);
    document.removeEventListener("keyup", this.onDocSelection);
    document.removeEventListener("selectionchange", this.onDocSelection);
    document.removeEventListener("focusin", this.onDocFocusIn);
    document.removeEventListener("keydown", this.onNoteKey, true);
    this.autoSendRegistered = false;
    this.pendingAutoDraft = null;
    this.selectionDirtyWhileInFrame = false;
    if (this.autoSendTimer !== null) {
      window.clearTimeout(this.autoSendTimer);
      this.autoSendTimer = null;
    }
  }
  /** 去抖调度一次自动注入判定（150ms 合并，避免连续框选刷出多次写入）。 */
  scheduleAutoSend() {
    if (this.autoSendTimer !== null) {
      window.clearTimeout(this.autoSendTimer);
    }
    this.autoSendTimer = window.setTimeout(() => {
      this.autoSendTimer = null;
      this.autoSendNow();
    }, 150);
  }
  /** 自动发送实际注入（仅 Markdown 编辑器；桥接未就绪/面板已关时跳过）。v2.3.3 原版，v2.4.3 回退。 */
  autoSendNow() {
    var _a;
    const frame = this.currentFrame();
    if (!frame || !this.bridgeReady || this.settings.bridgeToObsidian !== "auto") {
      return;
    }
    const noFocusWrite = this.bridgeSetDraftCapable;
    if (!noFocusWrite && Date.now() - this.lastNoteKeyAt < TYPING_QUIET_MS) return;
    const editor = (_a = this.app.workspace.getActiveViewOfType(import_obsidian10.MarkdownView)) == null ? void 0 : _a.editor;
    if (!editor) return;
    const focused = document.activeElement === frame;
    if (!editor.somethingSelected()) {
      if (this.lastAutoInjected) {
        if (focused || noFocusWrite) {
          this.postDraft(frame, "");
          this.lastAutoInjected = false;
        } else {
          this.pendingAutoDraft = "";
        }
      }
      return;
    }
    const message = this.bridgeSendText(editor);
    if (message === "") return;
    if (!focused && !noFocusWrite) {
      this.pendingAutoDraft = message;
      return;
    }
    this.postDraft(frame, message);
    this.lastAutoInjected = true;
  }
  /** v2.5.3：页面回报"焦点进入输入框"→ 把暂存的隐式行补上（此刻输入框本来就有焦点，无需抢）。 */
  flushPendingAutoDraft(frame) {
    const pending = this.pendingAutoDraft;
    if (pending === null) return;
    this.pendingAutoDraft = null;
    this.postDraft(frame, pending);
    this.lastAutoInjected = pending !== "";
  }
  /**
   * v2.5.2：下发草稿（相同 frame + 相同文本不重复下发）。
   * 长会话下面板一侧会高频触发选区事件，重复下发同一份草稿会让页面反复"清空→重写"聊天框（表现为持续闪烁）。
   */
  postDraft(frame, text) {
    if (this.lastDraftFrame === frame && this.lastDraftText === text) return;
    this.lastDraftFrame = frame;
    this.lastDraftText = text;
    this.postToFrame(frame, { type: "dsh-fill-draft", text });
  }
  /**
   * v2.5.2：填充遥测——每 3s 汇总一行写进诊断日志。
   * v2.8.7：细分到**每条路径**（`same` 幂等跳过 / `setdraft` 模型层成功 / `setdraft-dom` 模型层没过
   * 退 DOM / `field`、`edit` DOM 路径 / `superseded` 被新链作废）并统计失败数。
   * 为什么必须细分：本轮排"多次框选后越点越乱、最后一片空白"时，只有 total/wrote 两个数，
   * 完全看不出走的哪条路、有没有回滚、有没有链交叠——等于没有证据。
   */
  logFill(note, had, ok) {
    var _a;
    const s = this.fillStat;
    const key = note === "" ? "unknown" : note;
    s.total += 1;
    s.by[key] = ((_a = s.by[key]) != null ? _a : 0) + 1;
    if (key === "same") s.same += 1;
    else s.wrote += 1;
    if (!ok) s.failed += 1;
    if (had) s.composerFocus += 1;
    const now = Date.now();
    if (now - this.fillStatAt < 3e3) return;
    this.fillStatAt = now;
    const paths = Object.keys(s.by).sort().map((k) => {
      var _a2;
      return `${k}:${String((_a2 = s.by[k]) != null ? _a2 : 0)}`;
    }).join(" ");
    diagLog(
      this.diagDirs(),
      `fill 3s: total=${String(s.total)} same=${String(s.same)} wrote=${String(s.wrote)} failed=${String(s.failed)} composerFocus=${String(s.composerFocus)} paths=[${paths}]`
    );
    this.fillStat = { total: 0, same: 0, wrote: 0, failed: 0, composerFocus: 0, by: {} };
  }
  /** 诊断日志候选目录（与 DshView 同一套规则：vault 插件目录 → manifest.dir → 临时目录）。 */
  diagDirs() {
    var _a, _b;
    let base;
    try {
      base = (_b = (_a = this.app.vault.adapter).getBasePath) == null ? void 0 : _b.call(_a);
    } catch (e) {
      base = void 0;
    }
    return diagDirCandidates(base, this.app.vault.configDir, this.manifest.id, this.manifest.dir);
  }
  /** 当前 DSH 面板的 iframe（若面板打开且已渲染）。 */
  currentFrame() {
    for (const leaf of this.app.workspace.getLeavesOfType(DSH_VIEW_TYPE)) {
      const view = leaf.view;
      if (view instanceof DshView) {
        const frame = view.getFrame();
        if (frame) {
          return frame;
        }
      }
    }
    return null;
  }
  /** 向面板 iframe 发送消息（限定 targetOrigin 为本机 DSH 端口）。 */
  postToFrame(frame, payload) {
    const win = frame.contentWindow;
    if (!win) {
      return;
    }
    try {
      win.postMessage(payload, endpointOrigin(this.endpoint()));
    } catch (e) {
    }
  }
  /** 等待桥接就绪：先 ping，收到 ready 或超时返回（ready 状态与 frame 身份绑定，面板重建后自动失效）。 */
  async ensureBridgeReady(frame, timeoutMs = 1500) {
    if (this.bridgeReady && this.bridgeReadyFrame === frame) {
      return true;
    }
    this.bridgeReady = false;
    this.bridgeReadyFrame = null;
    this.postToFrame(frame, { type: "dsh-bridge-ping" });
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline && !this.bridgeReady) {
      await new Promise((resolve2) => window.setTimeout(resolve2, 100));
    }
    return this.bridgeReady && this.bridgeReadyFrame === frame;
  }
  /** 桥接未就绪时重建面板 iframe（加载带桥接脚本的新页面）并轮询等待握手就绪。 */
  async reloadPanelAndWaitForBridge(totalMs = 3e3) {
    if (Date.now() < this.bridgeReloadCooldownUntil) {
      return false;
    }
    await this.refreshView();
    const deadline = Date.now() + totalMs;
    while (Date.now() < deadline) {
      const frame = this.currentFrame();
      if (frame && await this.ensureBridgeReady(frame, 600)) {
        return true;
      }
      await new Promise((resolve2) => window.setTimeout(resolve2, 200));
    }
    this.bridgeReloadCooldownUntil = Date.now() + 3e4;
    return false;
  }
  /** 桥接状态摘要（设置页展示用）。 */
  getBridgeStatus() {
    return {
      installed: isBridgeInstalled(void 0, this.settings.profile),
      ready: this.bridgeReady
    };
  }
  /** 主动探测桥接是否已加载（设置页展示用）：向面板发 ping 并短暂等待 ready。 */
  async probeBridgeReady() {
    const frame = this.currentFrame();
    if (!frame) {
      return false;
    }
    return this.ensureBridgeReady(frame, 800);
  }
  /** DSH 主目录（传给 AED 工具的 $DSH_HOME 定位）。 */
  aedHomeDir() {
    var _a;
    return ((_a = process.env.DSH_HOME) != null ? _a : "").trim() || (0, import_node_path17.join)((0, import_node_os10.homedir)(), ".dsh");
  }
  /**
   * v2.4.4：桥接注入熔断提示。
   * 背景：桥接曾按 step 重复注入「编辑指令」（上下文压缩后去重失效 → 自增强循环），
   * 真机后果是单会话 11.8MB / 面板 DOM 279 万字并最终拖垮 DSH。改造后桥接用 DSH 原生
   * `agent.inbox` 一次性投递 + 本地台账去重，并在单会话注入超过上限时停止注入、留下 storm 标记。
   * 这里在插件加载时读取该标记：提示用户一次并清除（不循环弹窗）。
   */
  reportInjectStormIfAny() {
    try {
      const dir = bridgePackageDir(dshProfileDir(this.settings.profile, this.aedHomeDir()));
      const health = inspectLedger(dir);
      if (health.exists && !health.parseOk) {
        diagLog(this.diagDirs(), "inject-ledger \u65E0\u6CD5\u89E3\u6790\uFF1A\u6CE8\u5165\u53BB\u91CD/\u9650\u6D41\u5DF2\u5931\u6548\uFF08\u6865\u63A5\u4FA7\u540C\u65F6\u7559\u4E86 ledger-corrupt \u8BB0\u5F55\uFF09");
      }
      const storm = readStorm(dir);
      if (storm === null) return;
      clearStorm(dir);
      new import_obsidian10.Notice(t("notice.injectStormStopped", { n: String(INJECT_LIMITS.maxSessionInjections) }), 15e3);
    } catch (e) {
    }
  }
  /**
   * AED 动作（safe/clear/恢复）成功并重启服务后的统一收尾：
   * 校验 DSH 启动健康（页面注入 marker），失败时弹窗告知「错误类型 / 判断 / 建议动作」，
   * 询问用户是否执行一次性修复；修复后若仍为同类错误，不循环弹窗，提示改用其他 harness。
   * 校验与修复有耗时（页面抓取约数秒），以 Notice 提示用户。
   */
  async aedFinishWithVerify(home, result) {
    var _a, _b, _c, _d;
    if (!result.ok) return result;
    new import_obsidian10.Notice(`${t("aed.bootVerify")} ${t("aed.takesTime")}`, 8e3);
    const check = await verifyDshBootAsync(this.endpoint(), await this.awaitLaunchToken());
    if (check.ok) {
      return { ok: true, message: `${result.message} ${t("aed.bootVerifyOk")}` };
    }
    if (this.aedBootFixUsed) {
      return { ok: false, message: `${result.message} ${t("aed.fix.fail")} ${t("aed.otherHarness")}` };
    }
    const kind = (_a = check.kind) != null ? _a : "other";
    new AedBootModal(this.app, {
      kind,
      detail: (_b = check.detail) != null ? _b : "",
      autoFixable: AUTO_FIXABLE_KINDS.has(kind),
      // v2.3.0：认证类（DSH ≥0.1.2）给出捕获到的带 token 链接，引导到系统浏览器（面板内嵌实测被 SameSite 拦截）
      browserUrl: (_d = (_c = this.service) == null ? void 0 : _c.getLaunchUrl()) != null ? _d : "",
      onOpenBrowser: () => this.openDshInBrowser(),
      onApply: async () => {
        var _a2;
        this.aedBootFixUsed = true;
        try {
          writeBridgeFiles(home, this.manifest.version, this.settings.profile, this.bridgeInstallMode());
        } catch (e) {
        }
        try {
          removeBundleDisableBlocks(home);
        } catch (e) {
        }
        new import_obsidian10.Notice(t("notice.restarting"), 6e3);
        this.killPortProcess();
        (_a2 = this.service) == null ? void 0 : _a2.dispose();
        this.buildService();
        const state = await this.service.ensureOnline();
        await this.refreshView();
        if (state.kind !== "online") {
          new import_obsidian10.Notice(`${t("aed.fix.fail")} ${t("aed.otherHarness")}`, 12e3);
          return;
        }
        const again = await verifyDshBootAsync(this.endpoint(), await this.awaitLaunchToken());
        new import_obsidian10.Notice(again.ok ? t("aed.fix.done") : `${t("aed.fix.fail")} ${t("aed.otherHarness")}`, again.ok ? 8e3 : 12e3);
      }
    }).open();
    return result;
  }
  /** 仅以安全模式启动（dsh-fix safe）；成功后重启 DSH 并校验启动健康。 */
  async runAedSafe(home) {
    var _a;
    this.aedBootFixUsed = false;
    const result = await runAedSafe(home);
    if (result.ok) {
      new import_obsidian10.Notice(t("notice.restarting"), 6e3);
      this.killPortProcess();
      (_a = this.service) == null ? void 0 : _a.dispose();
      this.buildService();
      const state = await this.service.ensureOnline();
      await this.refreshView();
      if (state.kind !== "online") {
        return { ok: false, message: result.message + " " + t("notice.restartFailed", { msg: state.message }) };
      }
      return this.aedFinishWithVerify(home, { ok: true, message: result.message + " " + t("notice.restarted") });
    }
    return result;
  }
  /** 退出安全模式（dsh-fix clear 恢复用户插件），成功后重启 DSH 并校验启动健康。 */
  async runExitSafeMode(home) {
    var _a;
    this.aedBootFixUsed = false;
    const result = await exitSafeMode(home);
    if (result.ok) {
      new import_obsidian10.Notice(t("notice.restarting"), 6e3);
      this.killPortProcess();
      (_a = this.service) == null ? void 0 : _a.dispose();
      this.buildService();
      const state = await this.service.ensureOnline();
      await this.refreshView();
      if (state.kind !== "online") {
        return { ok: false, message: result.message + " " + t("notice.restartFailed", { msg: state.message }) };
      }
      return this.aedFinishWithVerify(home, { ok: true, message: result.message + " " + t("notice.restarted") });
    }
    return result;
  }
  /** 执行 AED 抢救流水线（dsh-fix 安全模式），成功后重启 DSH 并校验启动健康。 */
  async runAedRecovery(home, onStep) {
    var _a;
    this.aedBootFixUsed = false;
    const result = await aedRecovery(home, void 0, onStep);
    if (result.ok) {
      new import_obsidian10.Notice(t("notice.restarting"), 6e3);
      this.killPortProcess();
      (_a = this.service) == null ? void 0 : _a.dispose();
      this.buildService();
      const state = await this.service.ensureOnline();
      await this.refreshView();
      if (state.kind !== "online") {
        return { ok: false, message: result.message + " " + t("notice.restartFailed", { msg: state.message }) };
      }
      return this.aedFinishWithVerify(home, { ok: true, message: result.message + " " + t("notice.restarted") });
    }
    return result;
  }
  /**
   * 重启 DSH 服务（v2.6.0 作用域化）：只终止**本插件拉起/登记**的残留进程后重新启动，
   * 不再全机杀 DSH——多 profile 协同（如 desktop 版 web@3080）下，点重启不影响外部实例。
   * 端口被「非受管 DSH 进程」占用（升级前的无注册表旧实例、或撞端口的外部实例）时弹确认框，
   * 由用户显式授权后才按旧语义清理该端口占用者（绝不静默杀）。
   */
  async restartDshService() {
    new import_obsidian10.Notice(t("notice.restarting"), 6e3);
    const outcome = await this.service.restartManaged();
    if (outcome === "external") {
      new ConfirmModal(this.app, {
        title: t("restart.foreignTitle"),
        body: t("restart.foreignBody", { port: this.settings.port }),
        confirmText: t("restart.foreignConfirm"),
        onConfirm: async () => {
          killPortOwner(this.settings.port);
          await this.doRestart();
        }
      }).open();
      return;
    }
    await this.doRestart();
  }
  /** 重启执行体（作用域杀之后）：重建 ServiceManager → 清认证缓存 → 拉起 → 刷新面板。 */
  async doRestart() {
    var _a;
    (_a = this.service) == null ? void 0 : _a.dispose();
    this.buildService();
    this.resetAuthState();
    const state = await this.service.ensureOnline();
    await this.refreshView();
    new import_obsidian10.Notice(
      state.kind === "online" ? t("notice.restarted") : t("notice.restartFailed", { msg: state.message }),
      state.kind === "online" ? 6e3 : 1e4
    );
  }
  /**
   * v2.9.5 内嵌界面不可用时的兜底（用户第 3 项要求）：回退到本插件**已实测适配**的 DSH 版本。
   *
   * 只在用户于「内嵌界面暂不可用」页主动点「回退到适配版本 DSH」后进入，且先弹确认框列出目标版本与
   * 操作后果（会结束本机 DSH 进程、安装期间面板短暂离线）——升级/降级属需要显式同意的操作，与更新
   * 确认同一形态；环境类判定本身仍然不弹窗（[[用户偏好]]第 22 条）。
   *
   * 复用升级通道 `updateGlobalCli`：结束本机 DSH 进程 → `npm i -g @deepseek-ai/dsh@<version>`（官方源失败
   * 自动切 npmmirror）→ 重启服务并刷新面板；失败时尽力把原服务拉回，不把用户留在离线状态。
   * 目标版本由 `compat.fallbackTargetFor()` 统一计算：高于上界→上界；已在上界内→严格更低的最高已测版本
   * （真正的回退）；目标恰等于当前版本时不做无意义重装，只提示重载/重启。
   */
  async fallbackToAdaptedDsh() {
    const range = adaptedRangeLabel();
    const current2 = (await this.getDshVersion()).trim();
    const target = fallbackTargetFor(current2);
    if (current2 !== "" && compareVersions(current2, target) === 0) {
      new import_obsidian10.Notice(t("view.blocked.fallbackSame", { v: target }), 12e3);
      return;
    }
    const shownCurrent = current2 === "" ? t("up.unknown") : current2;
    new ConfirmModal(this.app, {
      title: t("view.blocked.fallback", { v: target }),
      body: `${t("view.blocked.fallbackConfirmBody", { v: target })}

${t("view.blocked.fallbackHint", { cur: shownCurrent, v: target, range })}`,
      confirmText: t("view.blocked.fallbackConfirm"),
      onConfirm: async () => {
        new import_obsidian10.Notice(t("view.blocked.fallbackRunning", { v: target }), 12e3);
        const r = await this.updateGlobalCli(target);
        if (r.ok) {
          new import_obsidian10.Notice(t("view.blocked.fallbackDone", { v: target }), 8e3);
        } else {
          new import_obsidian10.Notice(t("view.blocked.fallbackFail", { err: r.message, v: target }), 15e3);
        }
      }
    }).open();
  }
  /** 结束监听 DSH 端口的进程（复用 service-manager 的安全实现：精确端口匹配 + DSH 身份校验，避免误杀无关进程）。 */
  killPortProcess() {
    killPortOwner(this.settings.port);
  }
  /**
   * 结束机器上所有 DSH 进程（v2.4.0）：仅升级/重装路径调用（v2.6.0 起常规「重启服务」改走作用域重启）。
   * 目的：①释放 koffi.node 等原生依赖的文件锁（否则 npm 就地升级会 EBUSY 半途夭折，
   * 留下新旧混合的依赖树）；②避免旧实例继续占用端口或写会话。命令行为白名单匹配，不误杀无关 node。
   * v2.6.0：多 profile 共存提示——全机杀会连带停止 desktop 版等外部实例（升级前明示）。
   */
  async killAllDshProcesses() {
    var _a, _b;
    new import_obsidian10.Notice(t("notice.killAllForUpgrade"), 1e4);
    let killed = [];
    try {
      killed = await killDshProcesses();
    } catch (e) {
      return 0;
    }
    try {
      const free = await ((_a = this.service) == null ? void 0 : _a.waitPortFree(12e3));
      if (free === false) {
        this.killPortProcess();
        await ((_b = this.service) == null ? void 0 : _b.waitPortFree(5e3));
      }
    } catch (e) {
    }
    if (killed.length > 0) {
      new import_obsidian10.Notice(t("notice.dshProcessesKilled", { n: String(killed.length) }), 8e3);
    }
    return killed.length;
  }
  /**
   * 丢弃认证缓存（v2.4.0）：DSH 升级/重启后 launch token 会换新，
   * 旧的认证 URL 与 cookie 会让面板与直发请求命中 `dsh web authentication required`。
   */
  resetAuthState() {
    var _a;
    (_a = this.service) == null ? void 0 : _a.clearLaunchUrl();
    resetDshApiSession();
  }
  /**
   * DSH 升级/重装前备份会话目录（v2.4.0）。返回 false 表示备份失败——调用方应中止升级
   * （会话格式可能随版本漂移，见 2026-09-10 诊断报告：升级前备份是唯一的通用兜底）。
   */
  async backupSessionsBeforeUpgrade() {
    const home = this.aedHomeDir();
    try {
      const r = await backupSessionsDir(home, defaultCleanupBackupDir(home));
      if (r === null) {
        new import_obsidian10.Notice(t("notice.sessionsBackupNone"), 6e3);
        return true;
      }
      new import_obsidian10.Notice(t("notice.sessionsBackedUp", { n: String(r.files), dir: r.dir, size: formatBytes(r.bytes) }), 12e3);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      new import_obsidian10.Notice(t("notice.sessionsBackupFail", { err: msg }), 15e3);
      return false;
    }
  }
  /**
   * 升级后只读预检（v2.4.0）：把「磁盘上的会话数」与「新版能列出的会话数」对照。
   * 只报告，不改写任何会话文件——修复需用户显式同意（见变更日志与诊断报告）。
   */
  async precheckSessionsAfterUpgrade() {
    var _a, _b;
    try {
      const home = this.aedHomeDir();
      const onDisk = countSessionLogs(home);
      const listed = await listSessions(this.endpoint(), (_b = (_a = this.service) == null ? void 0 : _a.getLaunchUrl()) != null ? _b : "");
      if (!listed.ok) {
        new import_obsidian10.Notice(t("notice.sessionPrecheckFail", { err: listed.error }), 15e3);
        return;
      }
      const n = listed.value.items.length;
      if (onDisk > 0 && n < onDisk) {
        new import_obsidian10.Notice(t("notice.sessionPrecheckWarn", { listed: String(n), files: String(onDisk) }), 2e4);
        this.openSessionRepair();
      } else {
        new import_obsidian10.Notice(t("notice.sessionPrecheckOk", { n: String(n) }), 6e3);
      }
    } catch (e) {
    }
  }
  /** 一键安装 DSH 本体到指定目录并自动配置启动项；onStep 回调安装进度（step + 可选 percent）；返回是否成功。 */
  async installAndConfigure(dir, onStep) {
    new import_obsidian10.Notice(t("notice.installing"));
    await this.killAllDshProcesses();
    if (!await this.backupSessionsBeforeUpgrade()) return false;
    const r = await installDsh(dir, {
      cloneUrl: this.settings.installUrl || DEFAULT_DSH_REPO_URL,
      onStep
    });
    if (r.ok && r.dir) {
      this.settings.installDir = r.dir;
      this.settings.startupCwd = r.dir;
      this.settings.startupCommand = startupCommandForInstall(r.cliOk === true, this.settings.profile);
      await this.saveSettings();
      this.reconfigureService();
      new import_obsidian10.Notice(r.message, 8e3);
      return true;
    }
    new import_obsidian10.Notice(r.message, 1e4);
    return false;
  }
  /** 一键安装：已检测到 DSH 仓库时跳过路径询问，直接复用并补齐依赖/CLI；否则询问用户意向的安装路径后执行。 */
  async installWithPathPrompt(onStep) {
    const detected = locateDshRepoDir(defaultCandidates(this.settings.startupCwd));
    if (detected) {
      const ok = await this.installAndConfigure(detected, onStep);
      return ok;
    }
    const def = this.settings.installDir || detected || (0, import_node_path17.join)((0, import_node_os10.homedir)(), "deepseek-harness");
    return new Promise((resolve2) => {
      new InstallPathModal(this.app, {
        title: t("modal.installTitle"),
        defaultPath: def,
        onConfirm: (dir) => {
          const d = dir.trim();
          if (!d) {
            new import_obsidian10.Notice(t("notice.installDirEmpty"), 6e3);
            resolve2(false);
            return;
          }
          this.settings.installDir = d;
          void this.saveSettings().then(() => {
            void this.installAndConfigure(d, onStep).then(resolve2);
          });
        },
        onCancel: () => resolve2(false)
      }).open();
    });
  }
  /**
   * 卸载并重装 DSH（保留聊天记录）：停服 → 备份聊天记录/凭据/设置/技能 → 卸载运行物与插件注册
   * （+ 可选删仓库源码）→ 卸载全局 CLI → 重新下载安装（复用一键配置，启动命令全局 CLI 优先）→
   * 恢复校验 + 启动健康校验。破坏性操作：调用方需先经 CleanReinstallModal 强确认。
   * @param backupDir - 备份目录（默认 ~/.dsh-backup-<时间戳>）
   * @param deleteRepo - 是否同时删除仓库源码目录（需重新克隆，较耗时）
   */
  async runCleanReinstall(backupDir, deleteRepo) {
    var _a, _b;
    const modal = new InstallProgressModal(this.app);
    modal.open();
    const home = this.aedHomeDir();
    try {
      new import_obsidian10.Notice(t("notice.restarting"), 6e3);
      await this.killAllDshProcesses();
      (_a = this.service) == null ? void 0 : _a.dispose();
      this.buildService();
      this.resetAuthState();
      modal.update(15, t("cleanup.step.backup"));
      const backup = await backupDshData(home, backupDir);
      modal.update(30, t("cleanup.step.wipe"));
      await wipeDshRuntime(home);
      modal.update(40, t("cleanup.step.cli"));
      const cliNote = await uninstallGlobalCli();
      let repoDeleted = "";
      if (deleteRepo) {
        const repo = this.settings.installDir || locateDshRepoDir(defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)()));
        if (repo && isDshRepo(repo)) {
          try {
            const { rm: rm2 } = await import("node:fs/promises");
            await rm2(repo, { recursive: true, force: true });
            repoDeleted = t("cleanup.repoDeleted", { dir: repo });
          } catch (err) {
            repoDeleted = t("cleanup.repoDeleteFail", { err: err instanceof Error ? err.message : String(err) });
          }
        }
      }
      modal.update(50, t("cleanup.step.install"));
      const target = this.settings.installDir || locateDshRepoDir(defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)())) || (0, import_node_path17.join)((0, import_node_os10.homedir)(), "deepseek-harness");
      const installed = await this.installAndConfigure(target, (step, pct) => modal.update(50 + (pct != null ? pct : 0) * 0.4, step));
      if (!installed) {
        modal.fail();
        return { ok: false, message: t("cleanup.fail", { err: t("err.failed"), dir: backupDir }) };
      }
      modal.update(92, t("cleanup.step.verify"));
      writeBridgeFiles(void 0, this.manifest.version, this.settings.profile, this.bridgeInstallMode());
      await restoreDshData(backupDir, home);
      const state = await this.service.ensureOnline();
      await this.refreshView();
      const boot = await verifyDshBootAsync(this.endpoint(), await this.awaitLaunchToken());
      modal.done();
      window.setTimeout(() => modal.close(), 1500);
      const parts = [
        t("cleanup.done", {
          files: String(backup.totalFiles),
          bytes: formatBytes(backup.totalBytes),
          dir: backupDir
        }),
        repoDeleted,
        cliNote,
        state.kind !== "online" ? t("notice.restartFailed", { msg: state.message }) : "",
        boot.ok ? "" : t("cleanup.bootFail", { detail: (_b = boot.detail) != null ? _b : "" })
      ];
      return { ok: state.kind === "online" && boot.ok, message: parts.filter(Boolean).join(" ") };
    } catch (err) {
      modal.fail();
      return { ok: false, message: t("cleanup.fail", { err: err instanceof Error ? err.message : String(err), dir: backupDir }) };
    }
  }
  /** 弹出「卸载并重装 DSH」危险确认弹窗（红色按钮入口由设置页调用）。 */
  openCleanReinstallModal() {
    new CleanReinstallModal(this.app, {
      defaultBackupDir: defaultCleanupBackupDir(this.aedHomeDir()),
      repoDir: this.settings.installDir || locateDshRepoDir(defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)())) || "",
      onConfirm: (backupDir, deleteRepo) => {
        void this.runCleanReinstall(backupDir, deleteRepo);
      }
    }).open();
  }
  /** DSH 是否已安装（PATH 有 dsh 或检测到仓库目录）。 */
  isDshInstalled() {
    if (detectStartupCommand(this.settings.profile)) {
      return true;
    }
    const candidates = defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)());
    return locateDshRepoDir(candidates) !== null;
  }
  /** DSH 状态摘要（设置页横幅/面板提示用）。 */
  async getDshStatus() {
    const installed = this.isDshInstalled();
    const online = installed ? await this.service.probe() : false;
    const version = installed ? await this.getDshVersion() : t("up.unknown");
    return { installed, version, online };
  }
  /**
   * 读取当前 DSH 版本与其**可信度**（v2.6.0）：
   * - 全局 CLI 形态优先读官方包 manifest（`<npm root -g>/@deepseek-ai/dsh/package.json`，身份已核验）；
   *   读不到才退回 `dsh --version`——PATH 上的 `dsh` 可能由第三方包提供（实测存在 `@x1a0f3n9/dsh-*` 社区包，
   *   与官方共用 0.1.5-rc.x 号段（官方 rc.3 于 2026-09-22 发布，第三方同名 rc.3 于 09-18）），故标记为未核验；
   * - 仓库形态只在 `locateDshRepoDir` 命中（身份已核验）时读版本，**不再退回未验证的 startupCwd**——
   *   旧写法会把任意项目（含第三方 dsh 包）的 package.json 版本当成 DSH 版本。
   */
  async getDshVersionInfo() {
    if (this.startupUsesGlobalCli()) {
      const manifest = readGlobalDshVersion();
      if (manifest !== "") return { version: manifest, source: "official-manifest", verified: true };
      const cli = await getCliDshVersion();
      if (cli !== "") return { version: cli, source: "cli", verified: false };
      return { version: t("up.unknown"), source: "none", verified: false };
    }
    const dir = locateDshRepoDir(defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)()));
    if (!dir) return { version: t("up.unknown"), source: "none", verified: false };
    const version = await getLocalDshVersion(dir);
    return { version, source: "repo", verified: version !== t("up.unknown") };
  }
  /** 读取当前 DSH 版本（展示用；判定请用 getDshVersionInfo 的 verified）。 */
  async getDshVersion() {
    return (await this.getDshVersionInfo()).version;
  }
  /** 检查 DSH 更新（按启动形态：全局 CLI 走 npm、仓库走 git，均按设置里的更新通道）；发现新版本时询问用户是否更新。 */
  async checkUpdates() {
    const result = await this.detectUpdate();
    if (result && result.state === "behind") {
      this.askUpdate(result);
    } else if (result) {
      new import_obsidian10.Notice(result.message, 8e3);
    }
  }
  /**
   * 按当前通道检测一次更新（手动按钮与启动自动检查共用；返回 null=没有仓库目录）。
   * v2.9.4：两种形态的结果都要过「官方发布节奏」门禁——npm/git 先于官方 GitHub release
   * 收到预发布时不得提示升级，更新目标以官方最新 release 为准（见 `gateByRelease`）。
   */
  async detectUpdate() {
    const raw = this.startupUsesGlobalCli() ? await checkCliUpdate(void 0, this.settings.updateChannel) : await this.checkRepoUpdate();
    if (raw === null) return null;
    return gateByRelease(raw, this.settings.updateChannel);
  }
  /** 仓库形态的更新检查（无仓库目录时返回 null）。 */
  async checkRepoUpdate() {
    const dir = this.resolveRepoDir();
    if (!dir) return null;
    return checkDshUpdates(dir, void 0, { mirrorUrl: this.updateMirrorUrl(), channel: this.settings.updateChannel });
  }
  /** 启动形态对应的检查目标目录（仓库形态用）。**只返回身份已核验的仓库**，不再退回未验证的 startupCwd。 */
  resolveRepoDir() {
    const candidates = defaultCandidates(this.settings.startupCwd, (0, import_node_os10.homedir)());
    return locateDshRepoDir(candidates);
  }
  /** 弹出确认对话框；确认后按启动形态执行更新（全局 CLI → npm i -g；仓库 → git pull --ff-only）。 */
  askUpdate(info) {
    var _a, _b;
    const isPrerelease = info.prerelease === true;
    const target = classifyDshTarget((_a = info.remoteVersion) != null ? _a : "");
    const level = judgeDshCompat((_b = info.remoteVersion) != null ? _b : "");
    const range = adaptedRangeLabel();
    const killNote = t("modal.updateKillNote");
    const danger = target === "known-incompatible" ? `${t("modal.authDanger", { range })}

${killNote}` : killNote;
    const body = isPrerelease ? t("modal.updatePrereleaseBody", { msg: info.message }) : t("modal.updateBody", { msg: info.message });
    const note = level === "tested" || level === "within-line" ? t("modal.updateAdaptedNote", { range }) : level === "untested-newer" ? t("modal.updateNewerNote", { range, max: DSH_ADAPTED_MAX_TESTED }) : level === "legacy" ? t("modal.updateLegacyNote") : "";
    const bodyWithNote = note === "" ? body : `${body}

${note}`;
    new ConfirmModal(this.app, {
      title: isPrerelease ? t("modal.updatePrereleaseTitle") : t("modal.updateTitle"),
      body: bodyWithNote,
      danger,
      confirmText: target === "known-incompatible" ? t("modal.updateAnyway") : t("modal.updateConfirm"),
      viewLink: { text: t("modal.updateViewChanges"), url: this.getDshReleasesUrl() },
      onConfirm: async () => {
        this.rewriteBridgeAfterUpdate();
        new import_obsidian10.Notice(t("notice.updating"), 6e3);
        if (!await this.backupSessionsBeforeUpgrade()) return;
        const repoDir = this.resolveRepoDir();
        if (!this.startupUsesGlobalCli() && !repoDir) {
          new import_obsidian10.Notice(t("up.noRepo"), 1e4);
          return;
        }
        const r = this.startupUsesGlobalCli() ? await this.updateGlobalCli(info.remoteVersion) : await pullDshUpdates(repoDir != null ? repoDir : "", void 0, { mirrorUrl: this.updateMirrorUrl() });
        if (r.ok) {
          this.rewriteBridgeAfterUpdate();
          this.resetAuthState();
          await this.refreshView();
          void this.precheckSessionsAfterUpgrade();
        }
        const hint = r.ok && this.startupUsesGlobalCli() ? " " + t("up.repoOnlyHint") : "";
        new import_obsidian10.Notice(r.message + hint, r.ok ? 6e3 : 1e4);
      }
    }).open();
  }
  /**
   * 更新全局 CLI（带状态弹窗）：先停止 DSH 服务释放文件锁（koffi.node 被运行进程占用会导致 npm EBUSY），
   * 再 `npm i -g @deepseek-ai/dsh@<版本>`（npmmirror 优先），成功后重启服务。
   * @param target 检查阶段定出的目标版本号；缺省退回 `latest` 标签（宁装错版本不如装两个版本）。
   */
  async updateGlobalCli(target) {
    var _a;
    const modal = new UpdatingModal(this.app);
    modal.open();
    try {
      await this.killAllDshProcesses();
      (_a = this.service) == null ? void 0 : _a.dispose();
      this.buildService();
      this.resetAuthState();
      const r = await pullCliUpdate(void 0, target);
      if (!r.ok) {
        modal.fail(r.message);
        const state2 = await this.service.ensureOnline();
        const recovered = state2.kind === "online";
        if (recovered) await this.refreshView();
        return {
          ok: false,
          message: recovered ? `${r.message}\uFF08\u5DF2\u6062\u590D\u539F\u670D\u52A1\uFF09` : `${r.message} ${t("notice.restartFailed", { msg: state2.message })}`
        };
      }
      modal.setStatus(t("up.cliRestarting"));
      const state = await this.service.ensureOnline();
      modal.close();
      if (state.kind === "online") {
        await this.refreshView();
        return { ok: true, message: r.message };
      }
      return { ok: false, message: r.message + " " + t("notice.restartFailed", { msg: state.message }) };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      modal.fail(msg);
      void this.service.ensureOnline();
      return { ok: false, message: msg };
    }
  }
  /** 启动命令是否走全局 CLI（而非仓库 pnpm/npm 源码）：决定「仓库更新 ≠ 运行版本更新」提示。 */
  startupUsesGlobalCli() {
    const cmd = (this.settings.startupCommand || detectStartupCommand()).trim().toLowerCase();
    return cmd.startsWith("dsh");
  }
  /** DSH GitHub releases 页面地址（供「查看更新内容/更新日志」使用）。 */
  getDshReleasesUrl() {
    const base = this.settings.installUrl || DEFAULT_DSH_REPO_URL;
    return base.replace(/\.git$/, "") + "/releases";
  }
  /** 插件自身 GitHub releases 页面地址（插件更新日志）。 */
  getPluginReleasesUrl() {
    return `https://github.com/hjxcloud-tech/dsh-harness/releases`;
  }
  /** 插件 GitHub 主页地址（使用反馈欢迎留言）。 */
  getPluginRepoUrl() {
    return `https://github.com/hjxcloud-tech/dsh-harness`;
  }
  /** 插件在 Obsidian 官方商店的页面地址（检查更新/查看最新版本用）。 */
  getPluginStoreUrl() {
    return `https://community.obsidian.md/plugins/dsh-harness`;
  }
  /** 检查插件自身更新：查插件 GitHub Release 最新版本，与本地比较——已最新弹提示；有新版弹确认框，确认后打开 Obsidian 商店页（应用内更新入口在 Obsidian 设置 → 第三方插件）。 */
  async checkPluginUpdates() {
    var _a;
    const { remote, reachable } = await checkPluginUpdate();
    if (!reachable || remote === null) {
      new import_obsidian10.Notice(t("pluginUpdate.checkFail"), 8e3);
      return;
    }
    const local = (_a = this.manifest.version) != null ? _a : "";
    if (compareVersions(local, remote) >= 0) {
      new import_obsidian10.Notice(t("pluginUpdate.latest", { v: local }), 6e3);
      return;
    }
    new ConfirmModal(this.app, {
      title: t("pluginUpdate.updateTitle"),
      body: t("pluginUpdate.updateBody", { local, remote }),
      confirmText: t("pluginUpdate.goStore"),
      onConfirm: () => {
        this.openInBrowser(this.getPluginStoreUrl());
        new import_obsidian10.Notice(t("pluginUpdate.storeHint"), 8e3);
      }
    }).open();
  }
  /** 展示插件更新日志（内置弹窗，不跳转 GitHub）。 */
  showPluginChangelog() {
    new PluginChangelogModal(this.app).open();
  }
  /**
   * 读取 Obsidian 快捷键配置（对应设置页「选项 → 快捷键」），合并三个数据源：
   * ① commands.listCommands() 的 command.hotkeys（自定义快捷键，commandId 可用）
   * ② hotkeyManager.getDefaultHotkeys()（内置默认快捷键表，如 Ctrl+; → properties 命令）
   * ③ hotkeyManager.getHotkeys()（回退）
   * 返回 [组合键, commandId] 列表，如 ['ctrl+;', 'properties:add']。同键自定义优先（后写覆盖）。
   */
  passthroughKeyMap() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const map = /* @__PURE__ */ new Map();
    const push = (hk, commandId) => {
      const key = hk ? hotkeyToPassthroughKey(hk) : null;
      if (key !== null) map.set(key, commandId);
    };
    try {
      const defs = (_c = (_b = (_a = this.app.hotkeyManager) == null ? void 0 : _a.getDefaultHotkeys) == null ? void 0 : _b.call(_a)) != null ? _c : {};
      for (const [commandId, entry] of Object.entries(defs)) {
        for (const hk of (_d = entry == null ? void 0 : entry.hotkeys) != null ? _d : []) push(hk, commandId);
      }
    } catch (e) {
    }
    try {
      const cmds = (_g = (_f = (_e = this.app.commands) == null ? void 0 : _e.listCommands) == null ? void 0 : _f.call(_e)) != null ? _g : [];
      for (const cmd of cmds) {
        if (!cmd || typeof cmd.id !== "string" || !cmd.id || !Array.isArray(cmd.hotkeys)) continue;
        for (const hk of cmd.hotkeys) push(hk, cmd.id);
      }
    } catch (e) {
    }
    if (map.size === 0) {
      try {
        const hotkeys = (_j = (_i = (_h = this.app.hotkeyManager) == null ? void 0 : _h.getHotkeys) == null ? void 0 : _i.call(_h)) != null ? _j : [];
        for (const hk of hotkeys) push(hk, "");
      } catch (e) {
      }
    }
    return [...map.entries()].map(([key, commandId]) => ({ key, commandId }));
  }
  /** 快捷键透传配置：从快捷键配置生成全部组合键列表（'ctrl+o' / 'ctrl+;' 等）。 */
  passthroughKeys() {
    if (!this.settings.shortcutPassthrough) return [];
    return this.passthroughKeyMap().map((e) => e.key);
  }
  /** 把 iframe 内捕获的快捷键映射为 Obsidian 命令并执行：按组合键反查 commandId（来自命令自身的 hotkeys）。 */
  executePassthroughShortcut(key) {
    var _a, _b;
    try {
      const wanted = key.toLowerCase();
      const map = this.passthroughKeyMap();
      console.warn("[dsh-harness] passthrough key =", key, "| \u603B\u5FEB\u6377\u952E\u6570 =", map.length, "| \u542B\u76EE\u6807 =", map.some((e) => e.key === wanted));
      const hit = map.find((e) => e.key === wanted);
      if (hit && hit.commandId !== "") {
        void ((_b = (_a = this.app.commands).executeCommandById) == null ? void 0 : _b.call(_a, hit.commandId));
        return;
      }
      if (hit) {
        console.warn("[dsh-harness] \u547D\u4E2D\u5FEB\u6377\u952E\u4F46\u7F3A commandId\uFF08hotkeyManager \u56DE\u9000\u8DEF\u5F84\uFF09\uFF1A", wanted);
        return;
      }
      console.warn("[dsh-harness] no matching hotkey for", wanted);
    } catch (err) {
      console.warn("[dsh-harness] passthrough error:", err);
    }
  }
  /** 更新用的只读镜像：设置项优先；留空时若安装地址来自 github.com 则自动包成 gh-proxy 镜像。 */
  updateMirrorUrl() {
    const configured = this.settings.updateMirrorUrl.trim();
    if (configured !== "") return configured;
    const base = this.settings.installUrl || DEFAULT_DSH_REPO_URL;
    if (base.includes("github.com/")) return `https://gh-proxy.com/${base}`;
    return void 0;
  }
  async loadSettings() {
    var _a, _b, _c;
    const data = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...data };
    this.settings.profile = normalizeProfile(this.settings.profile);
    setAedProfile(this.settings.profile);
    this.settings.updateChannel = normalizeUpdateChannel(this.settings.updateChannel);
    this.settings.autoCheckUpdates = this.settings.autoCheckUpdates !== false;
    this.settings.autoCheckIntervalHours = Number.isFinite(this.settings.autoCheckIntervalHours) ? Math.max(MIN_AUTO_CHECK_HOURS, Math.round(this.settings.autoCheckIntervalHours)) : DEFAULT_SETTINGS.autoCheckIntervalHours;
    this.settings.lastAutoUpdateAtMs = Number.isFinite(this.settings.lastAutoUpdateAtMs) ? this.settings.lastAutoUpdateAtMs : 0;
    const hostCheck = normalizeServiceHost(this.settings.serviceHost);
    this.settings.serviceHost = hostCheck.ok ? hostCheck.host : DEFAULT_SERVICE_HOST;
    this.settings.serviceScheme = String((_a = this.settings.serviceScheme) != null ? _a : "").trim().toLowerCase() === "https" ? "https" : "http";
    this.settings.tlsCertPath = String((_b = this.settings.tlsCertPath) != null ? _b : "").trim();
    this.settings.tlsKeyPath = String((_c = this.settings.tlsKeyPath) != null ? _c : "").trim();
    const stale = this.settings;
    if ("checkCompatOnStartup" in stale || "compatAlerts" in stale) {
      delete stale.checkCompatOnStartup;
      delete stale.compatAlerts;
      await this.saveSettings();
    }
    const migrated = migrateBridgeMode(this.settings.bridgeToObsidian);
    if (migrated !== null) {
      this.settings.bridgeToObsidian = migrated;
      await this.saveSettings();
    }
    this.settings.bridgeInputMode = normalizeBridgeInputMode(this.settings.bridgeInputMode);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  /** 读取最近启动打点记录（设置页诊断区）。 */
  getStartupRecords() {
    var _a, _b;
    return (_b = (_a = this.profiler) == null ? void 0 : _a.readRecords()) != null ? _b : [];
  }
  /**
   * 「重新检查适配」（设置页按钮）：v2.8.4 起**不弹任何框**——把设置页整页按最新事实重画一遍，
   * 状态横幅的适配标记与「当前适配状态」两行同时更新（判定本身在 `getCompatSnapshot` 里，无缓存）。
   */
  recheckCompat() {
    refreshSettingTab(this.settingsTab);
  }
  /**
   * 「DSH 版本适配说明」弹窗（插件信息栏的超链接）。
   * v2.8.4：这是适配判定**唯一**还会出现的对话框，且只在用户主动点链接时打开——
   * 插件自己任何时刻都不再弹「不适配」提示。要点用 bullets 逐条列，本机判定如实写在正文。
   */
  async showCompatExplanation() {
    var _a, _b;
    const range = adaptedRangeLabel();
    const snap = (_a = await this.getCompatSnapshot()) != null ? _a : {
      version: t("up.unknown"),
      level: "unknown",
      bridge: "unknown",
      issue: null,
      seamScan: null
    };
    const bullets = [
      t("compat.explain.bulletRange", { range }),
      t("compat.explain.bulletBad"),
      t("compat.explain.bulletLegacy"),
      t("compat.explain.bulletNewer"),
      t("compat.explain.bulletBridge"),
      t("compat.explain.bulletSilent")
    ];
    if (snap.repairLimited === true) bullets.push(t("compat.repairLimited"));
    const seamLine = seamLineFor(snap.seamScan);
    if (seamLine !== "") bullets.push(seamLine);
    new CompatNoticeModal(this.app, {
      title: t("compat.explain.title"),
      body: t(`compat.verdict.${(_b = snap.issue) != null ? _b : "ok"}`, { v: snap.version }),
      bullets,
      detail: t("compat.detail", {
        v: snap.version,
        range,
        profile: this.settings.profile,
        port: String(this.settings.port)
      }),
      actions: [{ label: t("settings.compat.recheck"), cta: true, onClick: () => this.recheckCompat() }],
      closeLabel: t("compat.explain.close")
    }).open();
  }
  /** 检测 Obsidian 界面语言（getLanguage()，zh* → 中文，其余/不可用 → English）。 */
  detectSystemLanguage() {
    var _a, _b;
    try {
      const lang = (_b = (_a = import_obsidian10.getLanguage) == null ? void 0 : _a()) != null ? _b : "";
      if (lang && lang.toLowerCase().startsWith("zh")) return "zh";
    } catch (e) {
    }
    return "en";
  }
  /** Vault 根路径（DSH 工作区通常即此；用于路径点击的 Vault 内判定）。 */
  vaultRoot() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.app.vault.adapter).getBasePath) == null ? void 0 : _b.call(_a)) != null ? _c : "";
  }
};

/* nosourcemap */