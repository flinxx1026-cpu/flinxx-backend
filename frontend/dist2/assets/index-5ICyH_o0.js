import{r as C,a as Td,R as Zs,u as ot,b as Ad,c as mc,B as Cd,d as Sd,e as ht}from"./vendor-CWYb8WqM.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var yc={exports:{}},ei={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rd=C,Nd=Symbol.for("react.element"),kd=Symbol.for("react.fragment"),Pd=Object.prototype.hasOwnProperty,Od=Rd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,jd={key:!0,ref:!0,__self:!0,__source:!0};function vc(n,e,t){var r,s={},o=null,a=null;t!==void 0&&(o=""+t),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)Pd.call(e,r)&&!jd.hasOwnProperty(r)&&(s[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:Nd,type:n,key:o,ref:a,props:s,_owner:Od.current}}ei.Fragment=kd;ei.jsx=vc;ei.jsxs=vc;yc.exports=ei;var l=yc.exports,Xi={},Xa=Td;Xi.createRoot=Xa.createRoot,Xi.hydrateRoot=Xa.hydrateRoot;function Dd(n={}){const{nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}=n,[s,o]=C.useState(!1),a=C.useRef(t);a.current=t;const u=C.useRef(r);return u.current=r,C.useEffect(()=>{const h=document.createElement("script");return h.src="https://accounts.google.com/gsi/client",h.async=!0,h.defer=!0,h.nonce=e,h.onload=()=>{var f;o(!0),(f=a.current)===null||f===void 0||f.call(a)},h.onerror=()=>{var f;o(!1),(f=u.current)===null||f===void 0||f.call(u)},document.body.appendChild(h),()=>{document.body.removeChild(h)}},[e]),s}const Ld=C.createContext(null);function Md({clientId:n,nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r,children:s}){const o=Dd({nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}),a=C.useMemo(()=>({clientId:n,scriptLoadedSuccessfully:o}),[n,o]);return Zs.createElement(Ld.Provider,{value:a},s)}var Za={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _c=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Vd=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],u=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},wc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,y=o>>2,b=(o&3)<<4|u>>4;let x=(u&15)<<2|f>>6,A=f&63;h||(A=64,a||(x=64)),r.push(t[y],t[b],t[x],t[A])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(_c(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Vd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const f=s<n.length?t[n.charAt(s)]:64;++s;const b=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||u==null||f==null||b==null)throw new Fd;const x=o<<2|u>>4;if(r.push(x),f!==64){const A=u<<4&240|f>>2;if(r.push(A),b!==64){const k=f<<6&192|b;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Fd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ud=function(n){const e=_c(n);return wc.encodeByteArray(e,!0)},Ps=function(n){return Ud(n).replace(/\./g,"")},Ic=function(n){try{return wc.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bd(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d=()=>Bd().__FIREBASE_DEFAULTS__,Gd=()=>{if(typeof process>"u"||typeof Za>"u")return;const n=Za.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},qd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ic(n[1]);return e&&JSON.parse(e)},ti=()=>{try{return $d()||Gd()||qd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ec=n=>{var e,t;return(t=(e=ti())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Hd=n=>{const e=Ec(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},bc=()=>{var n;return(n=ti())===null||n===void 0?void 0:n.config},xc=n=>{var e;return(e=ti())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zd(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ps(JSON.stringify(t)),Ps(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Qe())}function Qd(){var n;const e=(n=ti())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Jd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Tc(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Yd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Xd(){const n=Qe();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Zd(){return!Qd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ac(){try{return typeof indexedDB=="object"}catch{return!1}}function Cc(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}function ef(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf="FirebaseError";class vt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=tf,Object.setPrototypeOf(this,vt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Tn.prototype.create)}}class Tn{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?nf(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new vt(s,u,r)}}function nf(n,e){return n.replace(rf,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const rf=/\{\$([^}]+)}/g;function sf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ar(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(el(o)&&el(a)){if(!Ar(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function el(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function of(n,e){const t=new af(n,e);return t.subscribe.bind(t)}class af{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");lf(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Di),s.error===void 0&&(s.error=Di),s.complete===void 0&&(s.complete=Di);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function lf(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Di(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf=1e3,uf=2,hf=4*60*60*1e3,df=.5;function tl(n,e=cf,t=uf){const r=e*Math.pow(t,n),s=Math.round(df*r*(Math.random()-.5)*2);return Math.min(hf,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(n){return n&&n._delegate?n._delegate:n}class yt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Wd;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(gf(e))try{this.getOrInitializeService({instanceIdentifier:fn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=fn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=fn){return this.instances.has(e)}getOptions(e=fn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&e(a,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:pf(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=fn){return this.component?this.component.multipleInstances?e:fn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function pf(n){return n===fn?void 0:n}function gf(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new ff(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ie||(ie={}));const yf={debug:ie.DEBUG,verbose:ie.VERBOSE,info:ie.INFO,warn:ie.WARN,error:ie.ERROR,silent:ie.SILENT},vf=ie.INFO,_f={[ie.DEBUG]:"log",[ie.VERBOSE]:"log",[ie.INFO]:"info",[ie.WARN]:"warn",[ie.ERROR]:"error"},wf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=_f[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ni{constructor(e){this.name=e,this._logLevel=vf,this._logHandler=wf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?yf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ie.DEBUG,...e),this._logHandler(this,ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ie.VERBOSE,...e),this._logHandler(this,ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ie.INFO,...e),this._logHandler(this,ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ie.WARN,...e),this._logHandler(this,ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ie.ERROR,...e),this._logHandler(this,ie.ERROR,...e)}}const If=(n,e)=>e.some(t=>n instanceof t);let nl,rl;function Ef(){return nl||(nl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function bf(){return rl||(rl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Sc=new WeakMap,Zi=new WeakMap,Rc=new WeakMap,Li=new WeakMap,Ao=new WeakMap;function xf(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(Jt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Sc.set(t,n)}).catch(()=>{}),Ao.set(e,n),e}function Tf(n){if(Zi.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Zi.set(n,e)}let eo={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Zi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Rc.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Jt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Af(n){eo=n(eo)}function Cf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Mi(this),e,...t);return Rc.set(r,e.sort?e.sort():[e]),Jt(r)}:bf().includes(n)?function(...e){return n.apply(Mi(this),e),Jt(Sc.get(this))}:function(...e){return Jt(n.apply(Mi(this),e))}}function Sf(n){return typeof n=="function"?Cf(n):(n instanceof IDBTransaction&&Tf(n),If(n,Ef())?new Proxy(n,eo):n)}function Jt(n){if(n instanceof IDBRequest)return xf(n);if(Li.has(n))return Li.get(n);const e=Sf(n);return e!==n&&(Li.set(n,e),Ao.set(e,n)),e}const Mi=n=>Ao.get(n);function Nc(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),u=Jt(a);return r&&a.addEventListener("upgradeneeded",h=>{r(Jt(a.result),h.oldVersion,h.newVersion,Jt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),u}const Rf=["get","getKey","getAll","getAllKeys","count"],Nf=["put","add","delete","clear"],Vi=new Map;function sl(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Vi.get(e))return Vi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Nf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Rf.includes(t)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let f=h.store;return r&&(f=f.index(u.shift())),(await Promise.all([f[t](...u),s&&h.done]))[0]};return Vi.set(e,o),o}Af(n=>({...n,get:(e,t,r)=>sl(e,t)||n.get(e,t,r),has:(e,t)=>!!sl(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Pf(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Pf(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const to="@firebase/app",il="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new ni("@firebase/app"),Of="@firebase/app-compat",jf="@firebase/analytics-compat",Df="@firebase/analytics",Lf="@firebase/app-check-compat",Mf="@firebase/app-check",Vf="@firebase/auth",Ff="@firebase/auth-compat",Uf="@firebase/database",Bf="@firebase/data-connect",$f="@firebase/database-compat",Gf="@firebase/functions",qf="@firebase/functions-compat",Hf="@firebase/installations",Wf="@firebase/installations-compat",zf="@firebase/messaging",Kf="@firebase/messaging-compat",Qf="@firebase/performance",Jf="@firebase/performance-compat",Yf="@firebase/remote-config",Xf="@firebase/remote-config-compat",Zf="@firebase/storage",ep="@firebase/storage-compat",tp="@firebase/firestore",np="@firebase/vertexai-preview",rp="@firebase/firestore-compat",sp="firebase",ip="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const no="[DEFAULT]",op={[to]:"fire-core",[Of]:"fire-core-compat",[Df]:"fire-analytics",[jf]:"fire-analytics-compat",[Mf]:"fire-app-check",[Lf]:"fire-app-check-compat",[Vf]:"fire-auth",[Ff]:"fire-auth-compat",[Uf]:"fire-rtdb",[Bf]:"fire-data-connect",[$f]:"fire-rtdb-compat",[Gf]:"fire-fn",[qf]:"fire-fn-compat",[Hf]:"fire-iid",[Wf]:"fire-iid-compat",[zf]:"fire-fcm",[Kf]:"fire-fcm-compat",[Qf]:"fire-perf",[Jf]:"fire-perf-compat",[Yf]:"fire-rc",[Xf]:"fire-rc-compat",[Zf]:"fire-gcs",[ep]:"fire-gcs-compat",[tp]:"fire-fst",[rp]:"fire-fst-compat",[np]:"fire-vertex","fire-js":"fire-js",[sp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Os=new Map,ap=new Map,ro=new Map;function ol(n,e){try{n.container.addComponent(e)}catch(t){Gt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function bt(n){const e=n.name;if(ro.has(e))return Gt.debug(`There were multiple attempts to register component ${e}.`),!1;ro.set(e,n);for(const t of Os.values())ol(t,n);for(const t of ap.values())ol(t,n);return!0}function An(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function It(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Yt=new Tn("app","Firebase",lp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new yt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Yt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn=ip;function kc(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:no,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw Yt.create("bad-app-name",{appName:String(s)});if(t||(t=bc()),!t)throw Yt.create("no-options");const o=Os.get(s);if(o){if(Ar(t,o.options)&&Ar(r,o.config))return o;throw Yt.create("duplicate-app",{appName:s})}const a=new mf(s);for(const h of ro.values())a.addComponent(h);const u=new cp(t,r,a);return Os.set(s,u),u}function Co(n=no){const e=Os.get(n);if(!e&&n===no&&bc())return kc();if(!e)throw Yt.create("no-app",{appName:n});return e}function it(n,e,t){var r;let s=(r=op[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const u=[`Unable to register library "${s}" with version "${e}":`];o&&u.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Gt.warn(u.join(" "));return}bt(new yt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const up="firebase-heartbeat-database",hp=1,Cr="firebase-heartbeat-store";let Fi=null;function Pc(){return Fi||(Fi=Nc(up,hp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Cr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Yt.create("idb-open",{originalErrorMessage:n.message})})),Fi}async function dp(n){try{const t=(await Pc()).transaction(Cr),r=await t.objectStore(Cr).get(Oc(n));return await t.done,r}catch(e){if(e instanceof vt)Gt.warn(e.message);else{const t=Yt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Gt.warn(t.message)}}}async function al(n,e){try{const r=(await Pc()).transaction(Cr,"readwrite");await r.objectStore(Cr).put(e,Oc(n)),await r.done}catch(t){if(t instanceof vt)Gt.warn(t.message);else{const r=Yt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Gt.warn(r.message)}}}function Oc(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fp=1024,pp=30*24*60*60*1e3;class gp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new yp(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ll();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const u=new Date(a.date).valueOf();return Date.now()-u<=pp}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Gt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ll(),{heartbeatsToSend:r,unsentEntries:s}=mp(this._heartbeatsCache.heartbeats),o=Ps(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return Gt.warn(t),""}}}function ll(){return new Date().toISOString().substring(0,10)}function mp(n,e=fp){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),cl(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),cl(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class yp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ac()?Cc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await dp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return al(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return al(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function cl(n){return Ps(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vp(n){bt(new yt("platform-logger",e=>new kf(e),"PRIVATE")),bt(new yt("heartbeat",e=>new gp(e),"PRIVATE")),it(to,il,n),it(to,il,"esm2017"),it("fire-js","")}vp("");function So(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function jc(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _p=jc,Dc=new Tn("auth","Firebase",jc());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js=new ni("@firebase/auth");function wp(n,...e){js.logLevel<=ie.WARN&&js.warn(`Auth (${Kn}): ${n}`,...e)}function ws(n,...e){js.logLevel<=ie.ERROR&&js.error(`Auth (${Kn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xt(n,...e){throw No(n,...e)}function mt(n,...e){return No(n,...e)}function Ro(n,e,t){const r=Object.assign(Object.assign({},_p()),{[e]:t});return new Tn("auth","Firebase",r).create(e,{appName:n.name})}function Xt(n){return Ro(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Lc(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&xt(n,"argument-error"),Ro(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function No(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Dc.create(n,...e)}function J(n,e,...t){if(!n)throw No(e,...t)}function Vt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ws(e),new Error(e)}function qt(n,e){n||Vt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ip(){return ul()==="http:"||ul()==="https:"}function ul(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ep(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ip()||Tc()||"connection"in navigator)?navigator.onLine:!0}function bp(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,t){this.shortDelay=e,this.longDelay=t,qt(t>e,"Short delay should be less than long delay!"),this.isMobile=Kd()||Yd()}get(){return Ep()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(n,e){qt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Vt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Vt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Vt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp=new Fr(3e4,6e4);function Po(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Qn(n,e,t,r,s={}){return Vc(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const u=Vr(Object.assign({key:n.config.apiKey},a)).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const f=Object.assign({method:e,headers:h},o);return Jd()||(f.referrerPolicy="no-referrer"),Mc.fetch()(Fc(n,n.config.apiHost,t,u),f)})}async function Vc(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},xp),e);try{const s=new Cp(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw ds(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const u=o.ok?a.errorMessage:a.error.message,[h,f]=u.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw ds(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw ds(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw ds(n,"user-disabled",a);const y=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw Ro(n,y,f);xt(n,y)}}catch(s){if(s instanceof vt)throw s;xt(n,"network-request-failed",{message:String(s)})}}async function Ap(n,e,t,r,s={}){const o=await Qn(n,e,t,r,s);return"mfaPendingCredential"in o&&xt(n,"multi-factor-auth-required",{_serverResponse:o}),o}function Fc(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?ko(n.config,s):`${n.config.apiScheme}://${s}`}class Cp{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(mt(this.auth,"network-request-failed")),Tp.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ds(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=mt(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sp(n,e){return Qn(n,"POST","/v1/accounts:delete",e)}async function Uc(n,e){return Qn(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rp(n,e=!1){const t=Ye(n),r=await t.getIdToken(e),s=Oo(r);J(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o==null?void 0:o.sign_in_provider;return{claims:s,token:r,authTime:wr(Ui(s.auth_time)),issuedAtTime:wr(Ui(s.iat)),expirationTime:wr(Ui(s.exp)),signInProvider:a||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Ui(n){return Number(n)*1e3}function Oo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return ws("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ic(t);return s?JSON.parse(s):(ws("Failed to decode base64 JWT payload"),null)}catch(s){return ws("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function hl(n){const e=Oo(n);return J(e,"internal-error"),J(typeof e.exp<"u","internal-error"),J(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof vt&&Np(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Np({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=wr(this.lastLoginAt),this.creationTime=wr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ds(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Sr(n,Uc(t,{idToken:r}));J(s==null?void 0:s.users.length,t,"internal-error");const o=s.users[0];n._notifyReloadListener(o);const a=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?Bc(o.providerUserInfo):[],u=Op(n.providerData,a),h=n.isAnonymous,f=!(n.email&&o.passwordHash)&&!(u!=null&&u.length),y=h?f:!1,b={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new io(o.createdAt,o.lastLoginAt),isAnonymous:y};Object.assign(n,b)}async function Pp(n){const e=Ye(n);await Ds(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Op(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Bc(n){return n.map(e=>{var{providerId:t}=e,r=So(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jp(n,e){const t=await Vc(n,{},async()=>{const r=Vr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=Fc(n,s,"/v1/token",`key=${o}`),u=await n._getAdditionalHeaders();return u["Content-Type"]="application/x-www-form-urlencoded",Mc.fetch()(a,{method:"POST",headers:u,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Dp(n,e){return Qn(n,"POST","/v2/accounts:revokeToken",Po(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){J(e.idToken,"internal-error"),J(typeof e.idToken<"u","internal-error"),J(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):hl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){J(e.length!==0,"internal-error");const t=hl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(J(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await jp(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new Mn;return r&&(J(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(J(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(J(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Mn,this.toJSON())}_performRefresh(){return Vt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(n,e){J(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Ft{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,o=So(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new io(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Sr(this,this.stsTokenManager.getToken(this.auth,e));return J(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rp(this,e)}reload(){return Pp(this)}_assign(e){this!==e&&(J(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ft(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){J(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Ds(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(It(this.auth.app))return Promise.reject(Xt(this.auth));const e=await this.getIdToken();return await Sr(this,Sp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,o,a,u,h,f,y;const b=(r=t.displayName)!==null&&r!==void 0?r:void 0,x=(s=t.email)!==null&&s!==void 0?s:void 0,A=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,k=(a=t.photoURL)!==null&&a!==void 0?a:void 0,S=(u=t.tenantId)!==null&&u!==void 0?u:void 0,N=(h=t._redirectEventId)!==null&&h!==void 0?h:void 0,$=(f=t.createdAt)!==null&&f!==void 0?f:void 0,G=(y=t.lastLoginAt)!==null&&y!==void 0?y:void 0,{uid:U,emailVerified:B,isAnonymous:ue,providerData:M,stsTokenManager:I}=t;J(U&&I,e,"internal-error");const g=Mn.fromJSON(this.name,I);J(typeof U=="string",e,"internal-error"),zt(b,e.name),zt(x,e.name),J(typeof B=="boolean",e,"internal-error"),J(typeof ue=="boolean",e,"internal-error"),zt(A,e.name),zt(k,e.name),zt(S,e.name),zt(N,e.name),zt($,e.name),zt(G,e.name);const m=new Ft({uid:U,auth:e,email:x,emailVerified:B,displayName:b,isAnonymous:ue,photoURL:k,phoneNumber:A,tenantId:S,stsTokenManager:g,createdAt:$,lastLoginAt:G});return M&&Array.isArray(M)&&(m.providerData=M.map(v=>Object.assign({},v))),N&&(m._redirectEventId=N),m}static async _fromIdTokenResponse(e,t,r=!1){const s=new Mn;s.updateFromServerResponse(t);const o=new Ft({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Ds(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];J(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?Bc(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(o!=null&&o.length),u=new Mn;u.updateFromIdToken(r);const h=new Ft({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new io(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(o!=null&&o.length)};return Object.assign(h,f),h}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl=new Map;function Ut(n){qt(n instanceof Function,"Expected a class definition");let e=dl.get(n);return e?(qt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,dl.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}$c.type="NONE";const fl=$c;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(n,e,t){return`firebase:${n}:${e}:${t}`}class Vn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=Is(this.userKey,s.apiKey,o),this.fullPersistenceKey=Is("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ft._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Vn(Ut(fl),e,r);const s=(await Promise.all(t.map(async f=>{if(await f._isAvailable())return f}))).filter(f=>f);let o=s[0]||Ut(fl);const a=Is(r,e.config.apiKey,e.name);let u=null;for(const f of t)try{const y=await f._get(a);if(y){const b=Ft._fromJSON(e,y);f!==o&&(u=b),o=f;break}}catch{}const h=s.filter(f=>f._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new Vn(o,e,r):(o=h[0],u&&await o._set(a,u.toJSON()),await Promise.all(t.map(async f=>{if(f!==o)try{await f._remove(a)}catch{}})),new Vn(o,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Wc(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Gc(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Kc(e))return"Blackberry";if(Qc(e))return"Webos";if(qc(e))return"Safari";if((e.includes("chrome/")||Hc(e))&&!e.includes("edge/"))return"Chrome";if(zc(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Gc(n=Qe()){return/firefox\//i.test(n)}function qc(n=Qe()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hc(n=Qe()){return/crios\//i.test(n)}function Wc(n=Qe()){return/iemobile/i.test(n)}function zc(n=Qe()){return/android/i.test(n)}function Kc(n=Qe()){return/blackberry/i.test(n)}function Qc(n=Qe()){return/webos/i.test(n)}function jo(n=Qe()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Lp(n=Qe()){var e;return jo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Mp(){return Xd()&&document.documentMode===10}function Jc(n=Qe()){return jo(n)||zc(n)||Qc(n)||Kc(n)||/windows phone/i.test(n)||Wc(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(n,e=[]){let t;switch(n){case"Browser":t=pl(Qe());break;case"Worker":t=`${pl(Qe())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Kn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=o=>new Promise((a,u)=>{try{const h=e(o);a(h)}catch(h){u(h)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fp(n,e={}){return Qn(n,"GET","/v2/passwordPolicy",Po(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Up=6;class Bp{constructor(e){var t,r,s,o;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Up,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!==null&&o!==void 0?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,o,a,u;const h={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,h),this.validatePasswordCharacterOptions(e,h),h.isValid&&(h.isValid=(t=h.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),h.isValid&&(h.isValid=(r=h.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),h.isValid&&(h.isValid=(s=h.containsLowercaseLetter)!==null&&s!==void 0?s:!0),h.isValid&&(h.isValid=(o=h.containsUppercaseLetter)!==null&&o!==void 0?o:!0),h.isValid&&(h.isValid=(a=h.containsNumericCharacter)!==null&&a!==void 0?a:!0),h.isValid&&(h.isValid=(u=h.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),h}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $p{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new gl(this),this.idTokenSubscription=new gl(this),this.beforeStateQueue=new Vp(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Dc,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ut(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Vn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Uc(this,{idToken:e}),r=await Ft._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(It(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=s==null?void 0:s._redirectEventId,h=await this.tryRedirectSignIn(e);(!a||a===u)&&(h!=null&&h.user)&&(s=h.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return J(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ds(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=bp()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(It(this.app))return Promise.reject(Xt(this));const t=e?Ye(e):null;return t&&J(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&J(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return It(this.app)?Promise.reject(Xt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return It(this.app)?Promise.reject(Xt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ut(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Fp(this),t=new Bp(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Tn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Dp(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ut(e)||this._popupRedirectResolver;J(t,this,"argument-error"),this.redirectPersistenceManager=await Vn.create(this,[Ut(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(J(u,this,"internal-error"),u.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return J(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Yc(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wp(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Jn(n){return Ye(n)}class gl{constructor(e){this.auth=e,this.observer=null,this.addObserver=of(t=>this.observer=t)}get next(){return J(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Do={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Gp(n){Do=n}function qp(n){return Do.loadJS(n)}function Hp(){return Do.gapiScript}function Wp(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zp(n,e){const t=An(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(Ar(o,e??{}))return s;xt(s,"already-initialized")}return t.initialize({options:e})}function Kp(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Ut);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Qp(n,e,t){const r=Jn(n);J(r._canInitEmulator,r,"emulator-config-failed"),J(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,o=Xc(e),{host:a,port:u}=Jp(e),h=u===null?"":`:${u}`;r.config.emulator={url:`${o}//${a}${h}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:u,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})}),Yp()}function Xc(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Jp(n){const e=Xc(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:ml(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:ml(a)}}}function ml(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Yp(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Vt("not implemented")}_getIdTokenResponse(e){return Vt("not implemented")}_linkToIdToken(e,t){return Vt("not implemented")}_getReauthenticationResolver(e){return Vt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fn(n,e){return Ap(n,"POST","/v1/accounts:signInWithIdp",Po(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp="http://localhost";class _n extends Zc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new _n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):xt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,o=So(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new _n(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Fn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Fn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Fn(e,t)}buildRequest(){const e={requestUri:Xp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Vr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur extends ri{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt extends Ur{constructor(){super("facebook.com")}static credential(e){return _n._fromParams({providerId:Lt.PROVIDER_ID,signInMethod:Lt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Lt.credentialFromTaggedObject(e)}static credentialFromError(e){return Lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Lt.credential(e.oauthAccessToken)}catch{return null}}}Lt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Lt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt extends Ur{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return _n._fromParams({providerId:Mt.PROVIDER_ID,signInMethod:Mt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Mt.credentialFromTaggedObject(e)}static credentialFromError(e){return Mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Mt.credential(t,r)}catch{return null}}}Mt.GOOGLE_SIGN_IN_METHOD="google.com";Mt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt extends Ur{constructor(){super("github.com")}static credential(e){return _n._fromParams({providerId:Kt.PROVIDER_ID,signInMethod:Kt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Kt.credentialFromTaggedObject(e)}static credentialFromError(e){return Kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Kt.credential(e.oauthAccessToken)}catch{return null}}}Kt.GITHUB_SIGN_IN_METHOD="github.com";Kt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends Ur{constructor(){super("twitter.com")}static credential(e,t){return _n._fromParams({providerId:Qt.PROVIDER_ID,signInMethod:Qt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Qt.credentialFromTaggedObject(e)}static credentialFromError(e){return Qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Qt.credential(t,r)}catch{return null}}}Qt.TWITTER_SIGN_IN_METHOD="twitter.com";Qt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await Ft._fromIdTokenResponse(e,r,s),a=yl(r);return new $n({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=yl(r);return new $n({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function yl(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ls extends vt{constructor(e,t,r,s){var o;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Ls.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Ls(e,t,r,s)}}function eu(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Ls._fromErrorAndOperation(n,o,e,r):o})}async function Zp(n,e,t=!1){const r=await Sr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return $n._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eg(n,e,t=!1){const{auth:r}=n;if(It(r.app))return Promise.reject(Xt(r));const s="reauthenticate";try{const o=await Sr(n,eu(r,s,e,n),t);J(o.idToken,r,"internal-error");const a=Oo(o.idToken);J(a,r,"internal-error");const{sub:u}=a;return J(n.uid===u,r,"user-mismatch"),$n._forOperation(n,s,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&xt(r,"user-mismatch"),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tg(n,e,t=!1){if(It(n.app))return Promise.reject(Xt(n));const r="signIn",s=await eu(n,r,e),o=await $n._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function ng(n,e,t,r){return Ye(n).onIdTokenChanged(e,t,r)}function rg(n,e,t){return Ye(n).beforeAuthStateChanged(e,t)}function sg(n,e,t,r){return Ye(n).onAuthStateChanged(e,t,r)}function ig(n){return Ye(n).signOut()}const Ms="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ms,"1"),this.storage.removeItem(Ms),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const og=1e3,ag=10;class nu extends tu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Jc(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);Mp()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,ag):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},og)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}nu.type="LOCAL";const lg=nu;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru extends tu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ru.type="SESSION";const su=ru;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cg(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new si(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(a).map(async f=>f(t.origin,o)),h=await cg(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}si.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((u,h)=>{const f=Lo("",20);s.port1.start();const y=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(b){const x=b;if(x.data.eventId===f)switch(x.data.status){case"ack":clearTimeout(y),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),u(x.data.response);break;default:clearTimeout(y),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:f,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(){return window}function hg(n){Et().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iu(){return typeof Et().WorkerGlobalScope<"u"&&typeof Et().importScripts=="function"}async function dg(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function fg(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function pg(){return iu()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou="firebaseLocalStorageDb",gg=1,Vs="firebaseLocalStorage",au="fbase_key";class Br{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ii(n,e){return n.transaction([Vs],e?"readwrite":"readonly").objectStore(Vs)}function mg(){const n=indexedDB.deleteDatabase(ou);return new Br(n).toPromise()}function oo(){const n=indexedDB.open(ou,gg);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Vs,{keyPath:au})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Vs)?e(r):(r.close(),await mg(),e(await oo()))})})}async function vl(n,e,t){const r=ii(n,!0).put({[au]:e,value:t});return new Br(r).toPromise()}async function yg(n,e){const t=ii(n,!1).get(e),r=await new Br(t).toPromise();return r===void 0?null:r.value}function _l(n,e){const t=ii(n,!0).delete(e);return new Br(t).toPromise()}const vg=800,_g=3;class lu{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await oo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>_g)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return iu()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=si._getInstance(pg()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await dg(),!this.activeServiceWorker)return;this.sender=new ug(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||fg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await oo();return await vl(e,Ms,"1"),await _l(e,Ms),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>vl(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>yg(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_l(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=ii(s,!1).getAll();return new Br(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}lu.type="LOCAL";const wg=lu;new Fr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(n,e){return e?Ut(e):(J(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo extends Zc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Fn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Fn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Fn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Ig(n){return tg(n.auth,new Vo(n),n.bypassAuthState)}function Eg(n){const{auth:e,user:t}=n;return J(t,e,"internal-error"),eg(t,new Vo(n),n.bypassAuthState)}async function bg(n){const{auth:e,user:t}=n;return J(t,e,"internal-error"),Zp(t,new Vo(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:u}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(h))}catch(f){this.reject(f)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ig;case"linkViaPopup":case"linkViaRedirect":return bg;case"reauthViaPopup":case"reauthViaRedirect":return Eg;default:xt(this.auth,"internal-error")}}resolve(e){qt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){qt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xg=new Fr(2e3,1e4);async function Tg(n,e,t){if(It(n.app))return Promise.reject(mt(n,"operation-not-supported-in-this-environment"));const r=Jn(n);Lc(n,e,ri);const s=Mo(r,t);return new pn(r,"signInViaPopup",e,s).executeNotNull()}class pn extends cu{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,pn.currentPopupAction&&pn.currentPopupAction.cancel(),pn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return J(e,this.auth,"internal-error"),e}async onExecution(){qt(this.filter.length===1,"Popup operations only handle one event");const e=Lo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(mt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(mt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,pn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(mt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,xg.get())};e()}}pn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ag="pendingRedirect",Es=new Map;class Cg extends cu{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Es.get(this.auth._key());if(!e){try{const r=await Sg(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Es.set(this.auth._key(),e)}return this.bypassAuthState||Es.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sg(n,e){const t=hu(e),r=uu(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}async function Rg(n,e){return uu(n)._set(hu(e),"true")}function Ng(n,e){Es.set(n._key(),e)}function uu(n){return Ut(n._redirectPersistence)}function hu(n){return Is(Ag,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kg(n,e,t){return Pg(n,e,t)}async function Pg(n,e,t){if(It(n.app))return Promise.reject(Xt(n));const r=Jn(n);Lc(n,e,ri),await r._initializationPromise;const s=Mo(r,t);return await Rg(s,r),s._openRedirect(r,e,"signInViaRedirect")}async function Og(n,e){return await Jn(n)._initializationPromise,du(n,e,!1)}async function du(n,e,t=!1){if(It(n.app))return Promise.reject(Xt(n));const r=Jn(n),s=Mo(r,e),a=await new Cg(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jg=10*60*1e3;class Dg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!fu(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(mt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=jg&&this.cachedEventUids.clear(),this.cachedEventUids.has(wl(e))}saveEventToCache(e){this.cachedEventUids.add(wl(e)),this.lastProcessedEventTime=Date.now()}}function wl(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function fu({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lg(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fu(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mg(n,e={}){return Qn(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vg=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Fg=/^https?/;async function Ug(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Mg(n);for(const t of e)try{if(Bg(t))return}catch{}xt(n,"unauthorized-domain")}function Bg(n){const e=so(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Fg.test(t))return!1;if(Vg.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $g=new Fr(3e4,6e4);function Il(){const n=Et().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Gg(n){return new Promise((e,t)=>{var r,s,o;function a(){Il(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Il(),t(mt(n,"network-request-failed"))},timeout:$g.get()})}if(!((s=(r=Et().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((o=Et().gapi)===null||o===void 0)&&o.load)a();else{const u=Wp("iframefcb");return Et()[u]=()=>{gapi.load?a():t(mt(n,"network-request-failed"))},qp(`${Hp()}?onload=${u}`).catch(h=>t(h))}}).catch(e=>{throw bs=null,e})}let bs=null;function qg(n){return bs=bs||Gg(n),bs}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hg=new Fr(5e3,15e3),Wg="__/auth/iframe",zg="emulator/auth/iframe",Kg={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Qg=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Jg(n){const e=n.config;J(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ko(e,zg):`https://${n.config.authDomain}/${Wg}`,r={apiKey:e.apiKey,appName:n.name,v:Kn},s=Qg.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${Vr(r).slice(1)}`}async function Yg(n){const e=await qg(n),t=Et().gapi;return J(t,n,"internal-error"),e.open({where:document.body,url:Jg(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Kg,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=mt(n,"network-request-failed"),u=Et().setTimeout(()=>{o(a)},Hg.get());function h(){Et().clearTimeout(u),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Zg=500,em=600,tm="_blank",nm="http://localhost";class El{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function rm(n,e,t,r=Zg,s=em){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const h=Object.assign(Object.assign({},Xg),{width:r.toString(),height:s.toString(),top:o,left:a}),f=Qe().toLowerCase();t&&(u=Hc(f)?tm:t),Gc(f)&&(e=e||nm,h.scrollbars="yes");const y=Object.entries(h).reduce((x,[A,k])=>`${x}${A}=${k},`,"");if(Lp(f)&&u!=="_self")return sm(e||"",u),new El(null);const b=window.open(e||"",u,y);J(b,n,"popup-blocked");try{b.focus()}catch{}return new El(b)}function sm(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const im="__/auth/handler",om="emulator/auth/handler",am=encodeURIComponent("fac");async function bl(n,e,t,r,s,o){J(n.config.authDomain,n,"auth-domain-config-required"),J(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Kn,eventId:s};if(e instanceof ri){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",sf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[y,b]of Object.entries({}))a[y]=b}if(e instanceof Ur){const y=e.getScopes().filter(b=>b!=="");y.length>0&&(a.scopes=y.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const y of Object.keys(u))u[y]===void 0&&delete u[y];const h=await n._getAppCheckToken(),f=h?`#${am}=${encodeURIComponent(h)}`:"";return`${lm(n)}?${Vr(u).slice(1)}${f}`}function lm({config:n}){return n.emulator?ko(n,om):`https://${n.authDomain}/${im}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi="webStorageSupport";class cm{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=su,this._completeRedirectFn=du,this._overrideRedirectResult=Ng}async _openPopup(e,t,r,s){var o;qt((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");const a=await bl(e,t,r,so(),s);return rm(e,a,Lo())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await bl(e,t,r,so(),s);return hg(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(qt(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Yg(e),r=new Dg(e);return t.register("authEvent",s=>(J(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Bi,{type:Bi},s=>{var o;const a=(o=s==null?void 0:s[0])===null||o===void 0?void 0:o[Bi];a!==void 0&&t(!!a),xt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Ug(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Jc()||qc()||jo()}}const um=cm;var xl="@firebase/auth",Tl="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hm{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){J(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dm(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function fm(n){bt(new yt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;J(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Yc(n)},f=new $p(r,s,o,h);return Kp(f,t),f},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),bt(new yt("auth-internal",e=>{const t=Jn(e.getProvider("auth").getImmediate());return(r=>new hm(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),it(xl,Tl,dm(n)),it(xl,Tl,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm=5*60,gm=xc("authIdTokenMaxAge")||pm;let Al=null;const mm=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>gm)return;const s=t==null?void 0:t.token;Al!==s&&(Al=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function ym(n=Co()){const e=An(n,"auth");if(e.isInitialized())return e.getImmediate();const t=zp(n,{popupRedirectResolver:um,persistence:[wg,lg,su]}),r=xc("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=mm(o.toString());rg(t,a,()=>a(t.currentUser)),ng(t,u=>a(u))}}const s=Ec("auth");return s&&Qp(t,`http://${s}`),t}function vm(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Gp({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=mt("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",vm().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});fm("Browser");var _m="firebase",wm="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */it(_m,wm,"app");var Cl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function m(){}m.prototype=g.prototype,I.D=g.prototype,I.prototype=new m,I.prototype.constructor=I,I.C=function(v,w,E){for(var _=Array(arguments.length-2),re=2;re<arguments.length;re++)_[re-2]=arguments[re];return g.prototype[w].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,g,m){m||(m=0);var v=Array(16);if(typeof g=="string")for(var w=0;16>w;++w)v[w]=g.charCodeAt(m++)|g.charCodeAt(m++)<<8|g.charCodeAt(m++)<<16|g.charCodeAt(m++)<<24;else for(w=0;16>w;++w)v[w]=g[m++]|g[m++]<<8|g[m++]<<16|g[m++]<<24;g=I.g[0],m=I.g[1],w=I.g[2];var E=I.g[3],_=g+(E^m&(w^E))+v[0]+3614090360&4294967295;g=m+(_<<7&4294967295|_>>>25),_=E+(w^g&(m^w))+v[1]+3905402710&4294967295,E=g+(_<<12&4294967295|_>>>20),_=w+(m^E&(g^m))+v[2]+606105819&4294967295,w=E+(_<<17&4294967295|_>>>15),_=m+(g^w&(E^g))+v[3]+3250441966&4294967295,m=w+(_<<22&4294967295|_>>>10),_=g+(E^m&(w^E))+v[4]+4118548399&4294967295,g=m+(_<<7&4294967295|_>>>25),_=E+(w^g&(m^w))+v[5]+1200080426&4294967295,E=g+(_<<12&4294967295|_>>>20),_=w+(m^E&(g^m))+v[6]+2821735955&4294967295,w=E+(_<<17&4294967295|_>>>15),_=m+(g^w&(E^g))+v[7]+4249261313&4294967295,m=w+(_<<22&4294967295|_>>>10),_=g+(E^m&(w^E))+v[8]+1770035416&4294967295,g=m+(_<<7&4294967295|_>>>25),_=E+(w^g&(m^w))+v[9]+2336552879&4294967295,E=g+(_<<12&4294967295|_>>>20),_=w+(m^E&(g^m))+v[10]+4294925233&4294967295,w=E+(_<<17&4294967295|_>>>15),_=m+(g^w&(E^g))+v[11]+2304563134&4294967295,m=w+(_<<22&4294967295|_>>>10),_=g+(E^m&(w^E))+v[12]+1804603682&4294967295,g=m+(_<<7&4294967295|_>>>25),_=E+(w^g&(m^w))+v[13]+4254626195&4294967295,E=g+(_<<12&4294967295|_>>>20),_=w+(m^E&(g^m))+v[14]+2792965006&4294967295,w=E+(_<<17&4294967295|_>>>15),_=m+(g^w&(E^g))+v[15]+1236535329&4294967295,m=w+(_<<22&4294967295|_>>>10),_=g+(w^E&(m^w))+v[1]+4129170786&4294967295,g=m+(_<<5&4294967295|_>>>27),_=E+(m^w&(g^m))+v[6]+3225465664&4294967295,E=g+(_<<9&4294967295|_>>>23),_=w+(g^m&(E^g))+v[11]+643717713&4294967295,w=E+(_<<14&4294967295|_>>>18),_=m+(E^g&(w^E))+v[0]+3921069994&4294967295,m=w+(_<<20&4294967295|_>>>12),_=g+(w^E&(m^w))+v[5]+3593408605&4294967295,g=m+(_<<5&4294967295|_>>>27),_=E+(m^w&(g^m))+v[10]+38016083&4294967295,E=g+(_<<9&4294967295|_>>>23),_=w+(g^m&(E^g))+v[15]+3634488961&4294967295,w=E+(_<<14&4294967295|_>>>18),_=m+(E^g&(w^E))+v[4]+3889429448&4294967295,m=w+(_<<20&4294967295|_>>>12),_=g+(w^E&(m^w))+v[9]+568446438&4294967295,g=m+(_<<5&4294967295|_>>>27),_=E+(m^w&(g^m))+v[14]+3275163606&4294967295,E=g+(_<<9&4294967295|_>>>23),_=w+(g^m&(E^g))+v[3]+4107603335&4294967295,w=E+(_<<14&4294967295|_>>>18),_=m+(E^g&(w^E))+v[8]+1163531501&4294967295,m=w+(_<<20&4294967295|_>>>12),_=g+(w^E&(m^w))+v[13]+2850285829&4294967295,g=m+(_<<5&4294967295|_>>>27),_=E+(m^w&(g^m))+v[2]+4243563512&4294967295,E=g+(_<<9&4294967295|_>>>23),_=w+(g^m&(E^g))+v[7]+1735328473&4294967295,w=E+(_<<14&4294967295|_>>>18),_=m+(E^g&(w^E))+v[12]+2368359562&4294967295,m=w+(_<<20&4294967295|_>>>12),_=g+(m^w^E)+v[5]+4294588738&4294967295,g=m+(_<<4&4294967295|_>>>28),_=E+(g^m^w)+v[8]+2272392833&4294967295,E=g+(_<<11&4294967295|_>>>21),_=w+(E^g^m)+v[11]+1839030562&4294967295,w=E+(_<<16&4294967295|_>>>16),_=m+(w^E^g)+v[14]+4259657740&4294967295,m=w+(_<<23&4294967295|_>>>9),_=g+(m^w^E)+v[1]+2763975236&4294967295,g=m+(_<<4&4294967295|_>>>28),_=E+(g^m^w)+v[4]+1272893353&4294967295,E=g+(_<<11&4294967295|_>>>21),_=w+(E^g^m)+v[7]+4139469664&4294967295,w=E+(_<<16&4294967295|_>>>16),_=m+(w^E^g)+v[10]+3200236656&4294967295,m=w+(_<<23&4294967295|_>>>9),_=g+(m^w^E)+v[13]+681279174&4294967295,g=m+(_<<4&4294967295|_>>>28),_=E+(g^m^w)+v[0]+3936430074&4294967295,E=g+(_<<11&4294967295|_>>>21),_=w+(E^g^m)+v[3]+3572445317&4294967295,w=E+(_<<16&4294967295|_>>>16),_=m+(w^E^g)+v[6]+76029189&4294967295,m=w+(_<<23&4294967295|_>>>9),_=g+(m^w^E)+v[9]+3654602809&4294967295,g=m+(_<<4&4294967295|_>>>28),_=E+(g^m^w)+v[12]+3873151461&4294967295,E=g+(_<<11&4294967295|_>>>21),_=w+(E^g^m)+v[15]+530742520&4294967295,w=E+(_<<16&4294967295|_>>>16),_=m+(w^E^g)+v[2]+3299628645&4294967295,m=w+(_<<23&4294967295|_>>>9),_=g+(w^(m|~E))+v[0]+4096336452&4294967295,g=m+(_<<6&4294967295|_>>>26),_=E+(m^(g|~w))+v[7]+1126891415&4294967295,E=g+(_<<10&4294967295|_>>>22),_=w+(g^(E|~m))+v[14]+2878612391&4294967295,w=E+(_<<15&4294967295|_>>>17),_=m+(E^(w|~g))+v[5]+4237533241&4294967295,m=w+(_<<21&4294967295|_>>>11),_=g+(w^(m|~E))+v[12]+1700485571&4294967295,g=m+(_<<6&4294967295|_>>>26),_=E+(m^(g|~w))+v[3]+2399980690&4294967295,E=g+(_<<10&4294967295|_>>>22),_=w+(g^(E|~m))+v[10]+4293915773&4294967295,w=E+(_<<15&4294967295|_>>>17),_=m+(E^(w|~g))+v[1]+2240044497&4294967295,m=w+(_<<21&4294967295|_>>>11),_=g+(w^(m|~E))+v[8]+1873313359&4294967295,g=m+(_<<6&4294967295|_>>>26),_=E+(m^(g|~w))+v[15]+4264355552&4294967295,E=g+(_<<10&4294967295|_>>>22),_=w+(g^(E|~m))+v[6]+2734768916&4294967295,w=E+(_<<15&4294967295|_>>>17),_=m+(E^(w|~g))+v[13]+1309151649&4294967295,m=w+(_<<21&4294967295|_>>>11),_=g+(w^(m|~E))+v[4]+4149444226&4294967295,g=m+(_<<6&4294967295|_>>>26),_=E+(m^(g|~w))+v[11]+3174756917&4294967295,E=g+(_<<10&4294967295|_>>>22),_=w+(g^(E|~m))+v[2]+718787259&4294967295,w=E+(_<<15&4294967295|_>>>17),_=m+(E^(w|~g))+v[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(w+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+w&4294967295,I.g[3]=I.g[3]+E&4294967295}r.prototype.u=function(I,g){g===void 0&&(g=I.length);for(var m=g-this.blockSize,v=this.B,w=this.h,E=0;E<g;){if(w==0)for(;E<=m;)s(this,I,E),E+=this.blockSize;if(typeof I=="string"){for(;E<g;)if(v[w++]=I.charCodeAt(E++),w==this.blockSize){s(this,v),w=0;break}}else for(;E<g;)if(v[w++]=I[E++],w==this.blockSize){s(this,v),w=0;break}}this.h=w,this.o+=g},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;var m=8*this.o;for(g=I.length-8;g<I.length;++g)I[g]=m&255,m/=256;for(this.u(I),I=Array(16),g=m=0;4>g;++g)for(var v=0;32>v;v+=8)I[m++]=this.g[g]>>>v&255;return I};function o(I,g){var m=u;return Object.prototype.hasOwnProperty.call(m,I)?m[I]:m[I]=g(I)}function a(I,g){this.h=g;for(var m=[],v=!0,w=I.length-1;0<=w;w--){var E=I[w]|0;v&&E==g||(m[w]=E,v=!1)}this.g=m}var u={};function h(I){return-128<=I&&128>I?o(I,function(g){return new a([g|0],0>g?-1:0)}):new a([I|0],0>I?-1:0)}function f(I){if(isNaN(I)||!isFinite(I))return b;if(0>I)return N(f(-I));for(var g=[],m=1,v=0;I>=m;v++)g[v]=I/m|0,m*=4294967296;return new a(g,0)}function y(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return N(y(I.substring(1),g));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var m=f(Math.pow(g,8)),v=b,w=0;w<I.length;w+=8){var E=Math.min(8,I.length-w),_=parseInt(I.substring(w,w+E),g);8>E?(E=f(Math.pow(g,E)),v=v.j(E).add(f(_))):(v=v.j(m),v=v.add(f(_)))}return v}var b=h(0),x=h(1),A=h(16777216);n=a.prototype,n.m=function(){if(S(this))return-N(this).m();for(var I=0,g=1,m=0;m<this.g.length;m++){var v=this.i(m);I+=(0<=v?v:4294967296+v)*g,g*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(k(this))return"0";if(S(this))return"-"+N(this).toString(I);for(var g=f(Math.pow(I,6)),m=this,v="";;){var w=B(m,g).g;m=$(m,w.j(g));var E=((0<m.g.length?m.g[0]:m.h)>>>0).toString(I);if(m=w,k(m))return E+v;for(;6>E.length;)E="0"+E;v=E+v}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function k(I){if(I.h!=0)return!1;for(var g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function S(I){return I.h==-1}n.l=function(I){return I=$(this,I),S(I)?-1:k(I)?0:1};function N(I){for(var g=I.g.length,m=[],v=0;v<g;v++)m[v]=~I.g[v];return new a(m,~I.h).add(x)}n.abs=function(){return S(this)?N(this):this},n.add=function(I){for(var g=Math.max(this.g.length,I.g.length),m=[],v=0,w=0;w<=g;w++){var E=v+(this.i(w)&65535)+(I.i(w)&65535),_=(E>>>16)+(this.i(w)>>>16)+(I.i(w)>>>16);v=_>>>16,E&=65535,_&=65535,m[w]=_<<16|E}return new a(m,m[m.length-1]&-2147483648?-1:0)};function $(I,g){return I.add(N(g))}n.j=function(I){if(k(this)||k(I))return b;if(S(this))return S(I)?N(this).j(N(I)):N(N(this).j(I));if(S(I))return N(this.j(N(I)));if(0>this.l(A)&&0>I.l(A))return f(this.m()*I.m());for(var g=this.g.length+I.g.length,m=[],v=0;v<2*g;v++)m[v]=0;for(v=0;v<this.g.length;v++)for(var w=0;w<I.g.length;w++){var E=this.i(v)>>>16,_=this.i(v)&65535,re=I.i(w)>>>16,$e=I.i(w)&65535;m[2*v+2*w]+=_*$e,G(m,2*v+2*w),m[2*v+2*w+1]+=E*$e,G(m,2*v+2*w+1),m[2*v+2*w+1]+=_*re,G(m,2*v+2*w+1),m[2*v+2*w+2]+=E*re,G(m,2*v+2*w+2)}for(v=0;v<g;v++)m[v]=m[2*v+1]<<16|m[2*v];for(v=g;v<2*g;v++)m[v]=0;return new a(m,0)};function G(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function U(I,g){this.g=I,this.h=g}function B(I,g){if(k(g))throw Error("division by zero");if(k(I))return new U(b,b);if(S(I))return g=B(N(I),g),new U(N(g.g),N(g.h));if(S(g))return g=B(I,N(g)),new U(N(g.g),g.h);if(30<I.g.length){if(S(I)||S(g))throw Error("slowDivide_ only works with positive integers.");for(var m=x,v=g;0>=v.l(I);)m=ue(m),v=ue(v);var w=M(m,1),E=M(v,1);for(v=M(v,2),m=M(m,2);!k(v);){var _=E.add(v);0>=_.l(I)&&(w=w.add(m),E=_),v=M(v,1),m=M(m,1)}return g=$(I,w.j(g)),new U(w,g)}for(w=b;0<=I.l(g);){for(m=Math.max(1,Math.floor(I.m()/g.m())),v=Math.ceil(Math.log(m)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),E=f(m),_=E.j(g);S(_)||0<_.l(I);)m-=v,E=f(m),_=E.j(g);k(E)&&(E=x),w=w.add(E),I=$(I,_)}return new U(w,I)}n.A=function(I){return B(this,I).h},n.and=function(I){for(var g=Math.max(this.g.length,I.g.length),m=[],v=0;v<g;v++)m[v]=this.i(v)&I.i(v);return new a(m,this.h&I.h)},n.or=function(I){for(var g=Math.max(this.g.length,I.g.length),m=[],v=0;v<g;v++)m[v]=this.i(v)|I.i(v);return new a(m,this.h|I.h)},n.xor=function(I){for(var g=Math.max(this.g.length,I.g.length),m=[],v=0;v<g;v++)m[v]=this.i(v)^I.i(v);return new a(m,this.h^I.h)};function ue(I){for(var g=I.g.length+1,m=[],v=0;v<g;v++)m[v]=I.i(v)<<1|I.i(v-1)>>>31;return new a(m,I.h)}function M(I,g){var m=g>>5;g%=32;for(var v=I.g.length-m,w=[],E=0;E<v;E++)w[E]=0<g?I.i(E+m)>>>g|I.i(E+m+1)<<32-g:I.i(E+m);return new a(w,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=y,pu=a}).apply(typeof Cl<"u"?Cl:typeof self<"u"?self:typeof window<"u"?window:{});var fs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gu,vr,mu,xs,ao,yu,vu,_u;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,d){return i==Array.prototype||i==Object.prototype||(i[c]=d.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof fs=="object"&&fs];for(var c=0;c<i.length;++c){var d=i[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var d=r;i=i.split(".");for(var p=0;p<i.length-1;p++){var T=i[p];if(!(T in d))break e;d=d[T]}i=i[i.length-1],p=d[i],c=c(p),c!=p&&c!=null&&e(d,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var d=0,p=!1,T={next:function(){if(!p&&d<i.length){var R=d++;return{value:c(R,i[R]),done:!1}}return p=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function h(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function f(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function y(i,c,d){return i.call.apply(i.bind,arguments)}function b(i,c,d){if(!i)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,p),i.apply(c,T)}}return function(){return i.apply(c,arguments)}}function x(i,c,d){return x=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?y:b,x.apply(null,arguments)}function A(i,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),i.apply(this,p)}}function k(i,c){function d(){}d.prototype=c.prototype,i.aa=c.prototype,i.prototype=new d,i.prototype.constructor=i,i.Qb=function(p,T,R){for(var V=Array(arguments.length-2),de=2;de<arguments.length;de++)V[de-2]=arguments[de];return c.prototype[T].apply(p,V)}}function S(i){const c=i.length;if(0<c){const d=Array(c);for(let p=0;p<c;p++)d[p]=i[p];return d}return[]}function N(i,c){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(h(p)){const T=i.length||0,R=p.length||0;i.length=T+R;for(let V=0;V<R;V++)i[T+V]=p[V]}else i.push(p)}}class ${constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function G(i){return/^[\s\xa0]*$/.test(i)}function U(){var i=u.navigator;return i&&(i=i.userAgent)?i:""}function B(i){return B[" "](i),i}B[" "]=function(){};var ue=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function M(i,c,d){for(const p in i)c.call(d,i[p],p,i)}function I(i,c){for(const d in i)c.call(void 0,i[d],d,i)}function g(i){const c={};for(const d in i)c[d]=i[d];return c}const m="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(i,c){let d,p;for(let T=1;T<arguments.length;T++){p=arguments[T];for(d in p)i[d]=p[d];for(let R=0;R<m.length;R++)d=m[R],Object.prototype.hasOwnProperty.call(p,d)&&(i[d]=p[d])}}function w(i){var c=1;i=i.split(":");const d=[];for(;0<c&&i.length;)d.push(i.shift()),c--;return i.length&&d.push(i.join(":")),d}function E(i){u.setTimeout(()=>{throw i},0)}function _(){var i=rn;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class re{constructor(){this.h=this.g=null}add(c,d){const p=$e.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var $e=new $(()=>new _t,i=>i.reset());class _t{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Ze,rt=!1,rn=new re,sn=()=>{const i=u.Promise.resolve(void 0);Ze=()=>{i.then(Wr)}};var Wr=()=>{for(var i;i=_();){try{i.h.call(i.g)}catch(d){E(d)}var c=$e;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}rt=!1};function at(){this.s=this.s,this.C=this.C}at.prototype.s=!1,at.prototype.ma=function(){this.s||(this.s=!0,this.N())},at.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function O(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}O.prototype.h=function(){this.defaultPrevented=!0};var X=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const d=()=>{};u.addEventListener("test",d,c),u.removeEventListener("test",d,c)}catch{}return i}();function ne(i,c){if(O.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var d=this.type=i.type,p=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(ue){e:{try{B(c.nodeName);var T=!0;break e}catch{}T=!1}T||(c=null)}}else d=="mouseover"?c=i.fromElement:d=="mouseout"&&(c=i.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:lt[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&ne.aa.h.call(this)}}k(ne,O);var lt={2:"touch",3:"pen",4:"mouse"};ne.prototype.h=function(){ne.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Ne="closure_listenable_"+(1e6*Math.random()|0),Rt=0;function on(i,c,d,p,T){this.listener=i,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=T,this.key=++Rt,this.da=this.fa=!1}function ct(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function er(i){this.src=i,this.g={},this.h=0}er.prototype.add=function(i,c,d,p,T){var R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);var V=zr(i,c,p,T);return-1<V?(c=i[V],d||(c.fa=!1)):(c=new on(c,this.src,R,!!p,T),c.fa=d,i.push(c)),c};function Sn(i,c){var d=c.type;if(d in i.g){var p=i.g[d],T=Array.prototype.indexOf.call(p,c,void 0),R;(R=0<=T)&&Array.prototype.splice.call(p,T,1),R&&(ct(c),i.g[d].length==0&&(delete i.g[d],i.h--))}}function zr(i,c,d,p){for(var T=0;T<i.length;++T){var R=i[T];if(!R.da&&R.listener==c&&R.capture==!!d&&R.ha==p)return T}return-1}var Kr="closure_lm_"+(1e6*Math.random()|0),Rn={};function Nt(i,c,d,p,T){if(Array.isArray(c)){for(var R=0;R<c.length;R++)Nt(i,c[R],d,p,T);return null}return d=ee(d),i&&i[Ne]?i.K(c,d,f(p)?!!p.capture:!1,T):Qr(i,c,d,!1,p,T)}function Qr(i,c,d,p,T,R){if(!c)throw Error("Invalid event type");var V=f(T)?!!T.capture:!!T,de=Q(i);if(de||(i[Kr]=de=new er(i)),d=de.add(c,d,p,V,R),d.proxy)return d;if(p=W(),d.proxy=p,p.src=i,p.listener=d,i.addEventListener)X||(T=V),T===void 0&&(T=!1),i.addEventListener(c.toString(),p,T);else if(i.attachEvent)i.attachEvent(he(c.toString()),p);else if(i.addListener&&i.removeListener)i.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function W(){function i(d){return c.call(i.src,i.listener,d)}const c=wi;return i}function tr(i,c,d,p,T){if(Array.isArray(c))for(var R=0;R<c.length;R++)tr(i,c[R],d,p,T);else p=f(p)?!!p.capture:!!p,d=ee(d),i&&i[Ne]?(i=i.i,c=String(c).toString(),c in i.g&&(R=i.g[c],d=zr(R,d,p,T),-1<d&&(ct(R[d]),Array.prototype.splice.call(R,d,1),R.length==0&&(delete i.g[c],i.h--)))):i&&(i=Q(i))&&(c=i.g[c.toString()],i=-1,c&&(i=zr(c,d,p,T)),(d=-1<i?c[i]:null)&&ke(d))}function ke(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[Ne])Sn(c.i,i);else{var d=i.type,p=i.proxy;c.removeEventListener?c.removeEventListener(d,p,i.capture):c.detachEvent?c.detachEvent(he(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=Q(c))?(Sn(d,i),d.h==0&&(d.src=null,c[Kr]=null)):ct(i)}}}function he(i){return i in Rn?Rn[i]:Rn[i]="on"+i}function wi(i,c){if(i.da)i=!0;else{c=new ne(c,this);var d=i.listener,p=i.ha||i.src;i.fa&&ke(i),i=d.call(p,c)}return i}function Q(i){return i=i[Kr],i instanceof er?i:null}var et="__closure_events_fn_"+(1e9*Math.random()>>>0);function ee(i){return typeof i=="function"?i:(i[et]||(i[et]=function(c){return i.handleEvent(c)}),i[et])}function Ie(){at.call(this),this.i=new er(this),this.M=this,this.F=null}k(Ie,at),Ie.prototype[Ne]=!0,Ie.prototype.removeEventListener=function(i,c,d,p){tr(this,i,c,d,p)};function pe(i,c){var d,p=i.F;if(p)for(d=[];p;p=p.F)d.push(p);if(i=i.M,p=c.type||c,typeof c=="string")c=new O(c,i);else if(c instanceof O)c.target=c.target||i;else{var T=c;c=new O(p,i),v(c,T)}if(T=!0,d)for(var R=d.length-1;0<=R;R--){var V=c.g=d[R];T=an(V,p,!0,c)&&T}if(V=c.g=i,T=an(V,p,!0,c)&&T,T=an(V,p,!1,c)&&T,d)for(R=0;R<d.length;R++)V=c.g=d[R],T=an(V,p,!1,c)&&T}Ie.prototype.N=function(){if(Ie.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var d=i.g[c],p=0;p<d.length;p++)ct(d[p]);delete i.g[c],i.h--}}this.F=null},Ie.prototype.K=function(i,c,d,p){return this.i.add(String(i),c,!1,d,p)},Ie.prototype.L=function(i,c,d,p){return this.i.add(String(i),c,!0,d,p)};function an(i,c,d,p){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var T=!0,R=0;R<c.length;++R){var V=c[R];if(V&&!V.da&&V.capture==d){var de=V.listener,Ve=V.ha||V.src;V.fa&&Sn(i.i,V),T=de.call(Ve,p)!==!1&&T}}return T&&!p.defaultPrevented}function Jr(i,c,d){if(typeof i=="function")d&&(i=x(i,d));else if(i&&typeof i.handleEvent=="function")i=x(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:u.setTimeout(i,c||0)}function Ii(i){i.g=Jr(()=>{i.g=null,i.i&&(i.i=!1,Ii(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Ei extends at{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Ii(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ln(i){at.call(this),this.h=i,this.g={}}k(ln,at);var nr=[];function Yr(i){M(i.g,function(c,d){this.g.hasOwnProperty(d)&&ke(c)},i),i.g={}}ln.prototype.N=function(){ln.aa.N.call(this),Yr(this)},ln.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Nn=u.JSON.stringify,bi=u.JSON.parse,xi=class{stringify(i){return u.JSON.stringify(i,void 0)}parse(i){return u.JSON.parse(i,void 0)}};function rr(){}rr.prototype.h=null;function Xr(i){return i.h||(i.h=i.i())}function Zr(){}var cn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function sr(){O.call(this,"d")}k(sr,O);function ir(){O.call(this,"c")}k(ir,O);var wt={},P=null;function F(){return P=P||new Ie}wt.La="serverreachability";function L(i){O.call(this,wt.La,i)}k(L,O);function z(i){const c=F();pe(c,new L(c))}wt.STAT_EVENT="statevent";function q(i,c){O.call(this,wt.STAT_EVENT,i),this.stat=c}k(q,O);function Z(i){const c=F();pe(c,new q(c,i))}wt.Ma="timingevent";function ve(i,c){O.call(this,wt.Ma,i),this.size=c}k(ve,O);function _e(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){i()},c)}function xe(){this.g=!0}xe.prototype.xa=function(){this.g=!1};function Te(i,c,d,p,T,R){i.info(function(){if(i.g)if(R)for(var V="",de=R.split("&"),Ve=0;Ve<de.length;Ve++){var ce=de[Ve].split("=");if(1<ce.length){var Ge=ce[0];ce=ce[1];var qe=Ge.split("_");V=2<=qe.length&&qe[1]=="type"?V+(Ge+"="+ce+"&"):V+(Ge+"=redacted&")}}else V=null;else V=R;return"XMLHTTP REQ ("+p+") [attempt "+T+"]: "+c+`
`+d+`
`+V})}function Pe(i,c,d,p,T,R,V){i.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+T+"]: "+c+`
`+d+`
`+R+" "+V})}function le(i,c,d,p){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+kn(i,d)+(p?" "+p:"")})}function kt(i,c){i.info(function(){return"TIMEOUT: "+c})}xe.prototype.info=function(){};function kn(i,c){if(!i.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(i=0;i<d.length;i++)if(Array.isArray(d[i])){var p=d[i];if(!(2>p.length)){var T=p[1];if(Array.isArray(T)&&!(1>T.length)){var R=T[0];if(R!="noop"&&R!="stop"&&R!="close")for(var V=1;V<T.length;V++)T[V]=""}}}}return Nn(d)}catch{return c}}var ge={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Pt={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Le;function Ae(){}k(Ae,rr),Ae.prototype.g=function(){return new XMLHttpRequest},Ae.prototype.i=function(){return{}},Le=new Ae;function Me(i,c,d,p){this.j=i,this.i=c,this.l=d,this.R=p||1,this.U=new ln(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ot}function Ot(){this.i=null,this.g="",this.h=!1}var or={},Pn={};function Ti(i,c,d){i.L=1,i.v=rs(jt(c)),i.m=d,i.P=!0,ma(i,null)}function ma(i,c){i.F=Date.now(),es(i),i.A=jt(i.v);var d=i.A,p=i.R;Array.isArray(p)||(p=[String(p)]),Na(d.i,"t",p),i.C=0,d=i.j.J,i.h=new Ot,i.g=Ka(i.j,d?c:null,!i.m),0<i.O&&(i.M=new Ei(x(i.Y,i,i.g),i.O)),c=i.U,d=i.g,p=i.ca;var T="readystatechange";Array.isArray(T)||(T&&(nr[0]=T.toString()),T=nr);for(var R=0;R<T.length;R++){var V=Nt(d,T[R],p||c.handleEvent,!1,c.h||c);if(!V)break;c.g[V.key]=V}c=i.H?g(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),z(),Te(i.i,i.u,i.A,i.l,i.R,i.m)}Me.prototype.ca=function(i){i=i.target;const c=this.M;c&&Dt(i)==3?c.j():this.Y(i)},Me.prototype.Y=function(i){try{if(i==this.g)e:{const qe=Dt(this.g);var c=this.g.Ba();const Dn=this.g.Z();if(!(3>qe)&&(qe!=3||this.g&&(this.h.h||this.g.oa()||Ma(this.g)))){this.J||qe!=4||c==7||(c==8||0>=Dn?z(3):z(2)),Ai(this);var d=this.g.Z();this.X=d;t:if(ya(this)){var p=Ma(this.g);i="";var T=p.length,R=Dt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){un(this),ar(this);var V="";break t}this.h.i=new u.TextDecoder}for(c=0;c<T;c++)this.h.h=!0,i+=this.h.i.decode(p[c],{stream:!(R&&c==T-1)});p.length=0,this.h.g+=i,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=d==200,Pe(this.i,this.u,this.A,this.l,this.R,qe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var de,Ve=this.g;if((de=Ve.g?Ve.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!G(de)){var ce=de;break t}}ce=null}if(d=ce)le(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ci(this,d);else{this.o=!1,this.s=3,Z(12),un(this),ar(this);break e}}if(this.P){d=!0;let ut;for(;!this.J&&this.C<V.length;)if(ut=od(this,V),ut==Pn){qe==4&&(this.s=4,Z(14),d=!1),le(this.i,this.l,null,"[Incomplete Response]");break}else if(ut==or){this.s=4,Z(15),le(this.i,this.l,V,"[Invalid Chunk]"),d=!1;break}else le(this.i,this.l,ut,null),Ci(this,ut);if(ya(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),qe!=4||V.length!=0||this.h.h||(this.s=1,Z(16),d=!1),this.o=this.o&&d,!d)le(this.i,this.l,V,"[Invalid Chunked Response]"),un(this),ar(this);else if(0<V.length&&!this.W){this.W=!0;var Ge=this.j;Ge.g==this&&Ge.ba&&!Ge.M&&(Ge.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Oi(Ge),Ge.M=!0,Z(11))}}else le(this.i,this.l,V,null),Ci(this,V);qe==4&&un(this),this.o&&!this.J&&(qe==4?qa(this.j,this):(this.o=!1,es(this)))}else bd(this.g),d==400&&0<V.indexOf("Unknown SID")?(this.s=3,Z(12)):(this.s=0,Z(13)),un(this),ar(this)}}}catch{}finally{}};function ya(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function od(i,c){var d=i.C,p=c.indexOf(`
`,d);return p==-1?Pn:(d=Number(c.substring(d,p)),isNaN(d)?or:(p+=1,p+d>c.length?Pn:(c=c.slice(p,p+d),i.C=p+d,c)))}Me.prototype.cancel=function(){this.J=!0,un(this)};function es(i){i.S=Date.now()+i.I,va(i,i.I)}function va(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=_e(x(i.ba,i),c)}function Ai(i){i.B&&(u.clearTimeout(i.B),i.B=null)}Me.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(kt(this.i,this.A),this.L!=2&&(z(),Z(17)),un(this),this.s=2,ar(this)):va(this,this.S-i)};function ar(i){i.j.G==0||i.J||qa(i.j,i)}function un(i){Ai(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,Yr(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function Ci(i,c){try{var d=i.j;if(d.G!=0&&(d.g==i||Si(d.h,i))){if(!i.K&&Si(d.h,i)&&d.G==3){try{var p=d.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var T=p;if(T[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<i.F)cs(d),as(d);else break e;Pi(d),Z(18)}}else d.za=T[1],0<d.za-d.T&&37500>T[2]&&d.F&&d.v==0&&!d.C&&(d.C=_e(x(d.Za,d),6e3));if(1>=Ia(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else dn(d,11)}else if((i.K||d.g==i)&&cs(d),!G(c))for(T=d.Da.g.parse(c),c=0;c<T.length;c++){let ce=T[c];if(d.T=ce[0],ce=ce[1],d.G==2)if(ce[0]=="c"){d.K=ce[1],d.ia=ce[2];const Ge=ce[3];Ge!=null&&(d.la=Ge,d.j.info("VER="+d.la));const qe=ce[4];qe!=null&&(d.Aa=qe,d.j.info("SVER="+d.Aa));const Dn=ce[5];Dn!=null&&typeof Dn=="number"&&0<Dn&&(p=1.5*Dn,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const ut=i.g;if(ut){const hs=ut.g?ut.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(hs){var R=p.h;R.g||hs.indexOf("spdy")==-1&&hs.indexOf("quic")==-1&&hs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Ri(R,R.h),R.h=null))}if(p.D){const ji=ut.g?ut.g.getResponseHeader("X-HTTP-Session-Id"):null;ji&&(p.ya=ji,ye(p.I,p.D,ji))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-i.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var V=i;if(p.qa=za(p,p.J?p.ia:null,p.W),V.K){Ea(p.h,V);var de=V,Ve=p.L;Ve&&(de.I=Ve),de.B&&(Ai(de),es(de)),p.g=V}else $a(p);0<d.i.length&&ls(d)}else ce[0]!="stop"&&ce[0]!="close"||dn(d,7);else d.G==3&&(ce[0]=="stop"||ce[0]=="close"?ce[0]=="stop"?dn(d,7):ki(d):ce[0]!="noop"&&d.l&&d.l.ta(ce),d.v=0)}}z(4)}catch{}}var ad=class{constructor(i,c){this.g=i,this.map=c}};function _a(i){this.l=i||10,u.PerformanceNavigationTiming?(i=u.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function wa(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Ia(i){return i.h?1:i.g?i.g.size:0}function Si(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Ri(i,c){i.g?i.g.add(c):i.h=c}function Ea(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}_a.prototype.cancel=function(){if(this.i=ba(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function ba(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const d of i.g.values())c=c.concat(d.D);return c}return S(i.i)}function ld(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var c=[],d=i.length,p=0;p<d;p++)c.push(i[p]);return c}c=[],d=0;for(p in i)c[d++]=i[p];return c}function cd(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var c=[];i=i.length;for(var d=0;d<i;d++)c.push(d);return c}c=[],d=0;for(const p in i)c[d++]=p;return c}}}function xa(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var d=cd(i),p=ld(i),T=p.length,R=0;R<T;R++)c.call(void 0,p[R],d&&d[R],i)}var Ta=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ud(i,c){if(i){i=i.split("&");for(var d=0;d<i.length;d++){var p=i[d].indexOf("="),T=null;if(0<=p){var R=i[d].substring(0,p);T=i[d].substring(p+1)}else R=i[d];c(R,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function hn(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof hn){this.h=i.h,ts(this,i.j),this.o=i.o,this.g=i.g,ns(this,i.s),this.l=i.l;var c=i.i,d=new ur;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),Aa(this,d),this.m=i.m}else i&&(c=String(i).match(Ta))?(this.h=!1,ts(this,c[1]||"",!0),this.o=lr(c[2]||""),this.g=lr(c[3]||"",!0),ns(this,c[4]),this.l=lr(c[5]||"",!0),Aa(this,c[6]||"",!0),this.m=lr(c[7]||"")):(this.h=!1,this.i=new ur(null,this.h))}hn.prototype.toString=function(){var i=[],c=this.j;c&&i.push(cr(c,Ca,!0),":");var d=this.g;return(d||c=="file")&&(i.push("//"),(c=this.o)&&i.push(cr(c,Ca,!0),"@"),i.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&i.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&i.push("/"),i.push(cr(d,d.charAt(0)=="/"?fd:dd,!0))),(d=this.i.toString())&&i.push("?",d),(d=this.m)&&i.push("#",cr(d,gd)),i.join("")};function jt(i){return new hn(i)}function ts(i,c,d){i.j=d?lr(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function ns(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function Aa(i,c,d){c instanceof ur?(i.i=c,md(i.i,i.h)):(d||(c=cr(c,pd)),i.i=new ur(c,i.h))}function ye(i,c,d){i.i.set(c,d)}function rs(i){return ye(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function lr(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function cr(i,c,d){return typeof i=="string"?(i=encodeURI(i).replace(c,hd),d&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function hd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Ca=/[#\/\?@]/g,dd=/[#\?:]/g,fd=/[#\?]/g,pd=/[#\?@]/g,gd=/#/g;function ur(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Ht(i){i.g||(i.g=new Map,i.h=0,i.i&&ud(i.i,function(c,d){i.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=ur.prototype,n.add=function(i,c){Ht(this),this.i=null,i=On(this,i);var d=this.g.get(i);return d||this.g.set(i,d=[]),d.push(c),this.h+=1,this};function Sa(i,c){Ht(i),c=On(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function Ra(i,c){return Ht(i),c=On(i,c),i.g.has(c)}n.forEach=function(i,c){Ht(this),this.g.forEach(function(d,p){d.forEach(function(T){i.call(c,T,p,this)},this)},this)},n.na=function(){Ht(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let p=0;p<c.length;p++){const T=i[p];for(let R=0;R<T.length;R++)d.push(c[p])}return d},n.V=function(i){Ht(this);let c=[];if(typeof i=="string")Ra(this,i)&&(c=c.concat(this.g.get(On(this,i))));else{i=Array.from(this.g.values());for(let d=0;d<i.length;d++)c=c.concat(i[d])}return c},n.set=function(i,c){return Ht(this),this.i=null,i=On(this,i),Ra(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function Na(i,c,d){Sa(i,c),0<d.length&&(i.i=null,i.g.set(On(i,c),S(d)),i.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var p=c[d];const R=encodeURIComponent(String(p)),V=this.V(p);for(p=0;p<V.length;p++){var T=R;V[p]!==""&&(T+="="+encodeURIComponent(String(V[p]))),i.push(T)}}return this.i=i.join("&")};function On(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function md(i,c){c&&!i.j&&(Ht(i),i.i=null,i.g.forEach(function(d,p){var T=p.toLowerCase();p!=T&&(Sa(this,p),Na(this,T,d))},i)),i.j=c}function yd(i,c){const d=new xe;if(u.Image){const p=new Image;p.onload=A(Wt,d,"TestLoadImage: loaded",!0,c,p),p.onerror=A(Wt,d,"TestLoadImage: error",!1,c,p),p.onabort=A(Wt,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=A(Wt,d,"TestLoadImage: timeout",!1,c,p),u.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=i}else c(!1)}function vd(i,c){const d=new xe,p=new AbortController,T=setTimeout(()=>{p.abort(),Wt(d,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:p.signal}).then(R=>{clearTimeout(T),R.ok?Wt(d,"TestPingServer: ok",!0,c):Wt(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(T),Wt(d,"TestPingServer: error",!1,c)})}function Wt(i,c,d,p,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),p(d)}catch{}}function _d(){this.g=new xi}function wd(i,c,d){const p=d||"";try{xa(i,function(T,R){let V=T;f(T)&&(V=Nn(T)),c.push(p+R+"="+encodeURIComponent(V))})}catch(T){throw c.push(p+"type="+encodeURIComponent("_badmap")),T}}function ss(i){this.l=i.Ub||null,this.j=i.eb||!1}k(ss,rr),ss.prototype.g=function(){return new is(this.l,this.j)},ss.prototype.i=function(i){return function(){return i}}({});function is(i,c){Ie.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(is,Ie),n=is.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,dr(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||u).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,hr(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,dr(this)),this.g&&(this.readyState=3,dr(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ka(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function ka(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?hr(this):dr(this),this.readyState==3&&ka(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,hr(this))},n.Qa=function(i){this.g&&(this.response=i,hr(this))},n.ga=function(){this.g&&hr(this)};function hr(i){i.readyState=4,i.l=null,i.j=null,i.v=null,dr(i)}n.setRequestHeader=function(i,c){this.u.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,i.push(d[0]+": "+d[1]),d=c.next();return i.join(`\r
`)};function dr(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(is.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Pa(i){let c="";return M(i,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function Ni(i,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Pa(d),typeof i=="string"?d!=null&&encodeURIComponent(String(d)):ye(i,c,d))}function Ee(i){Ie.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(Ee,Ie);var Id=/^https?$/i,Ed=["POST","PUT"];n=Ee.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Le.g(),this.v=this.o?Xr(this.o):Xr(Le),this.g.onreadystatechange=x(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(R){Oa(this,R);return}if(i=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var T in p)d.set(T,p[T]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const R of p.keys())d.set(R,p.get(R));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(R=>R.toLowerCase()=="content-type"),T=u.FormData&&i instanceof u.FormData,!(0<=Array.prototype.indexOf.call(Ed,c,void 0))||p||T||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of d)this.g.setRequestHeader(R,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{La(this),this.u=!0,this.g.send(i),this.u=!1}catch(R){Oa(this,R)}};function Oa(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,ja(i),os(i)}function ja(i){i.A||(i.A=!0,pe(i,"complete"),pe(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,pe(this,"complete"),pe(this,"abort"),os(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),os(this,!0)),Ee.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Da(this):this.bb())},n.bb=function(){Da(this)};function Da(i){if(i.h&&typeof a<"u"&&(!i.v[1]||Dt(i)!=4||i.Z()!=2)){if(i.u&&Dt(i)==4)Jr(i.Ea,0,i);else if(pe(i,"readystatechange"),Dt(i)==4){i.h=!1;try{const V=i.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=V===0){var T=String(i.D).match(Ta)[1]||null;!T&&u.self&&u.self.location&&(T=u.self.location.protocol.slice(0,-1)),p=!Id.test(T?T.toLowerCase():"")}d=p}if(d)pe(i,"complete"),pe(i,"success");else{i.m=6;try{var R=2<Dt(i)?i.g.statusText:""}catch{R=""}i.l=R+" ["+i.Z()+"]",ja(i)}}finally{os(i)}}}}function os(i,c){if(i.g){La(i);const d=i.g,p=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||pe(i,"ready");try{d.onreadystatechange=p}catch{}}}function La(i){i.I&&(u.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function Dt(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<Dt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),bi(c)}};function Ma(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function bd(i){const c={};i=(i.g&&2<=Dt(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<i.length;p++){if(G(i[p]))continue;var d=w(i[p]);const T=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const R=c[T]||[];c[T]=R,R.push(d)}I(c,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function fr(i,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[i]||c}function Va(i){this.Aa=0,this.i=[],this.j=new xe,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=fr("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=fr("baseRetryDelayMs",5e3,i),this.cb=fr("retryDelaySeedMs",1e4,i),this.Wa=fr("forwardChannelMaxRetries",2,i),this.wa=fr("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new _a(i&&i.concurrentRequestLimit),this.Da=new _d,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Va.prototype,n.la=8,n.G=1,n.connect=function(i,c,d,p){Z(0),this.W=i,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=za(this,null,this.W),ls(this)};function ki(i){if(Fa(i),i.G==3){var c=i.U++,d=jt(i.I);if(ye(d,"SID",i.K),ye(d,"RID",c),ye(d,"TYPE","terminate"),pr(i,d),c=new Me(i,i.j,c),c.L=2,c.v=rs(jt(d)),d=!1,u.navigator&&u.navigator.sendBeacon)try{d=u.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&u.Image&&(new Image().src=c.v,d=!0),d||(c.g=Ka(c.j,null),c.g.ea(c.v)),c.F=Date.now(),es(c)}Wa(i)}function as(i){i.g&&(Oi(i),i.g.cancel(),i.g=null)}function Fa(i){as(i),i.u&&(u.clearTimeout(i.u),i.u=null),cs(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&u.clearTimeout(i.s),i.s=null)}function ls(i){if(!wa(i.h)&&!i.s){i.s=!0;var c=i.Ga;Ze||sn(),rt||(Ze(),rt=!0),rn.add(c,i),i.B=0}}function xd(i,c){return Ia(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=_e(x(i.Ga,i,c),Ha(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const T=new Me(this,this.j,i);let R=this.o;if(this.S&&(R?(R=g(R),v(R,this.S)):R=this.S),this.m!==null||this.O||(T.H=R,R=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Ba(this,T,c),d=jt(this.I),ye(d,"RID",i),ye(d,"CVER",22),this.D&&ye(d,"X-HTTP-Session-Id",this.D),pr(this,d),R&&(this.O?c="headers="+encodeURIComponent(String(Pa(R)))+"&"+c:this.m&&Ni(d,this.m,R)),Ri(this.h,T),this.Ua&&ye(d,"TYPE","init"),this.P?(ye(d,"$req",c),ye(d,"SID","null"),T.T=!0,Ti(T,d,null)):Ti(T,d,c),this.G=2}}else this.G==3&&(i?Ua(this,i):this.i.length==0||wa(this.h)||Ua(this))};function Ua(i,c){var d;c?d=c.l:d=i.U++;const p=jt(i.I);ye(p,"SID",i.K),ye(p,"RID",d),ye(p,"AID",i.T),pr(i,p),i.m&&i.o&&Ni(p,i.m,i.o),d=new Me(i,i.j,d,i.B+1),i.m===null&&(d.H=i.o),c&&(i.i=c.D.concat(i.i)),c=Ba(i,d,1e3),d.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Ri(i.h,d),Ti(d,p,c)}function pr(i,c){i.H&&M(i.H,function(d,p){ye(c,p,d)}),i.l&&xa({},function(d,p){ye(c,p,d)})}function Ba(i,c,d){d=Math.min(i.i.length,d);var p=i.l?x(i.l.Na,i.l,i):null;e:{var T=i.i;let R=-1;for(;;){const V=["count="+d];R==-1?0<d?(R=T[0].g,V.push("ofs="+R)):R=0:V.push("ofs="+R);let de=!0;for(let Ve=0;Ve<d;Ve++){let ce=T[Ve].g;const Ge=T[Ve].map;if(ce-=R,0>ce)R=Math.max(0,T[Ve].g-100),de=!1;else try{wd(Ge,V,"req"+ce+"_")}catch{p&&p(Ge)}}if(de){p=V.join("&");break e}}}return i=i.i.splice(0,d),c.D=i,p}function $a(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;Ze||sn(),rt||(Ze(),rt=!0),rn.add(c,i),i.v=0}}function Pi(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=_e(x(i.Fa,i),Ha(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Ga(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=_e(x(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Z(10),as(this),Ga(this))};function Oi(i){i.A!=null&&(u.clearTimeout(i.A),i.A=null)}function Ga(i){i.g=new Me(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=jt(i.qa);ye(c,"RID","rpc"),ye(c,"SID",i.K),ye(c,"AID",i.T),ye(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&ye(c,"TO",i.ja),ye(c,"TYPE","xmlhttp"),pr(i,c),i.m&&i.o&&Ni(c,i.m,i.o),i.L&&(i.g.I=i.L);var d=i.g;i=i.ia,d.L=1,d.v=rs(jt(c)),d.m=null,d.P=!0,ma(d,i)}n.Za=function(){this.C!=null&&(this.C=null,as(this),Pi(this),Z(19))};function cs(i){i.C!=null&&(u.clearTimeout(i.C),i.C=null)}function qa(i,c){var d=null;if(i.g==c){cs(i),Oi(i),i.g=null;var p=2}else if(Si(i.h,c))d=c.D,Ea(i.h,c),p=1;else return;if(i.G!=0){if(c.o)if(p==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var T=i.B;p=F(),pe(p,new ve(p,d)),ls(i)}else $a(i);else if(T=c.s,T==3||T==0&&0<c.X||!(p==1&&xd(i,c)||p==2&&Pi(i)))switch(d&&0<d.length&&(c=i.h,c.i=c.i.concat(d)),T){case 1:dn(i,5);break;case 4:dn(i,10);break;case 3:dn(i,6);break;default:dn(i,2)}}}function Ha(i,c){let d=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(d*=2),d*c}function dn(i,c){if(i.j.info("Error code "+c),c==2){var d=x(i.fb,i),p=i.Xa;const T=!p;p=new hn(p||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||ts(p,"https"),rs(p),T?yd(p.toString(),d):vd(p.toString(),d)}else Z(2);i.G=0,i.l&&i.l.sa(c),Wa(i),Fa(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),Z(2)):(this.j.info("Failed to ping google.com"),Z(1))};function Wa(i){if(i.G=0,i.ka=[],i.l){const c=ba(i.h);(c.length!=0||i.i.length!=0)&&(N(i.ka,c),N(i.ka,i.i),i.h.i.length=0,S(i.i),i.i.length=0),i.l.ra()}}function za(i,c,d){var p=d instanceof hn?jt(d):new hn(d);if(p.g!="")c&&(p.g=c+"."+p.g),ns(p,p.s);else{var T=u.location;p=T.protocol,c=c?c+"."+T.hostname:T.hostname,T=+T.port;var R=new hn(null);p&&ts(R,p),c&&(R.g=c),T&&ns(R,T),d&&(R.l=d),p=R}return d=i.D,c=i.ya,d&&c&&ye(p,d,c),ye(p,"VER",i.la),pr(i,p),p}function Ka(i,c,d){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new Ee(new ss({eb:d})):new Ee(i.pa),c.Ha(i.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qa(){}n=Qa.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function us(){}us.prototype.g=function(i,c){return new tt(i,c)};function tt(i,c){Ie.call(this),this.g=new Va(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!G(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!G(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new jn(this)}k(tt,Ie),tt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},tt.prototype.close=function(){ki(this.g)},tt.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var d={};d.__data__=i,i=d}else this.u&&(d={},d.__data__=Nn(i),i=d);c.i.push(new ad(c.Ya++,i)),c.G==3&&ls(c)},tt.prototype.N=function(){this.g.l=null,delete this.j,ki(this.g),delete this.g,tt.aa.N.call(this)};function Ja(i){sr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const d in c){i=d;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}k(Ja,sr);function Ya(){ir.call(this),this.status=1}k(Ya,ir);function jn(i){this.g=i}k(jn,Qa),jn.prototype.ua=function(){pe(this.g,"a")},jn.prototype.ta=function(i){pe(this.g,new Ja(i))},jn.prototype.sa=function(i){pe(this.g,new Ya)},jn.prototype.ra=function(){pe(this.g,"b")},us.prototype.createWebChannel=us.prototype.g,tt.prototype.send=tt.prototype.o,tt.prototype.open=tt.prototype.m,tt.prototype.close=tt.prototype.close,_u=function(){return new us},vu=function(){return F()},yu=wt,ao={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ge.NO_ERROR=0,ge.TIMEOUT=8,ge.HTTP_ERROR=6,xs=ge,Pt.COMPLETE="complete",mu=Pt,Zr.EventType=cn,cn.OPEN="a",cn.CLOSE="b",cn.ERROR="c",cn.MESSAGE="d",Ie.prototype.listen=Ie.prototype.K,vr=Zr,Ee.prototype.listenOnce=Ee.prototype.L,Ee.prototype.getLastError=Ee.prototype.Ka,Ee.prototype.getLastErrorCode=Ee.prototype.Ba,Ee.prototype.getStatus=Ee.prototype.Z,Ee.prototype.getResponseJson=Ee.prototype.Oa,Ee.prototype.getResponseText=Ee.prototype.oa,Ee.prototype.send=Ee.prototype.ea,Ee.prototype.setWithCredentials=Ee.prototype.Ha,gu=Ee}).apply(typeof fs<"u"?fs:typeof self<"u"?self:typeof window<"u"?window:{});const Sl="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}We.UNAUTHENTICATED=new We(null),We.GOOGLE_CREDENTIALS=new We("google-credentials-uid"),We.FIRST_PARTY=new We("first-party-uid"),We.MOCK_USER=new We("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn=new ni("@firebase/firestore");function gr(){return wn.logLevel}function H(n,...e){if(wn.logLevel<=ie.DEBUG){const t=e.map(Fo);wn.debug(`Firestore (${Yn}): ${n}`,...t)}}function In(n,...e){if(wn.logLevel<=ie.ERROR){const t=e.map(Fo);wn.error(`Firestore (${Yn}): ${n}`,...t)}}function Fs(n,...e){if(wn.logLevel<=ie.WARN){const t=e.map(Fo);wn.warn(`Firestore (${Yn}): ${n}`,...t)}}function Fo(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(n="Unexpected state"){const e=`FIRESTORE (${Yn}) INTERNAL ASSERTION FAILED: `+n;throw In(e),new Error(e)}function be(n,e){n||oe()}function me(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Y extends vt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Im{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(We.UNAUTHENTICATED))}shutdown(){}}class Em{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class bm{constructor(e){this.t=e,this.currentUser=We.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){be(this.o===void 0);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new yn;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new yn,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new yn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(be(typeof r.accessToken=="string"),new wu(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return be(e===null||typeof e=="string"),new We(e)}}class xm{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=We.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Tm{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new xm(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(We.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Am{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Cm{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){be(this.o===void 0);const r=o=>{o.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,H("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(be(typeof t.token=="string"),this.R=t.token,new Am(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sm(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Sm(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%e.length))}return r}}function fe(n,e){return n<e?-1:n>e?1:0}function Gn(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Y(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Y(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new Y(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Y(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return De.fromMillis(Date.now())}static fromDate(e){return De.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new De(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?fe(this.nanoseconds,e.nanoseconds):fe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.timestamp=e}static fromTimestamp(e){return new we(e)}static min(){return new we(new De(0,0))}static max(){return new we(new De(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rr{constructor(e,t,r){t===void 0?t=0:t>e.length&&oe(),r===void 0?r=e.length-t:r>e.length-t&&oe(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Rr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Rr?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=e.get(s),a=t.get(s);if(o<a)return-1;if(o>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Se extends Rr{construct(e,t,r){return new Se(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new Y(D.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Se(t)}static emptyPath(){return new Se([])}}const Rm=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Be extends Rr{construct(e,t,r){return new Be(e,t,r)}static isValidIdentifier(e){return Rm.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Be(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new Y(D.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new Y(D.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new Y(D.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new Y(D.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Be(t)}static emptyPath(){return new Be([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.path=e}static fromPath(e){return new te(Se.fromString(e))}static fromName(e){return new te(Se.fromString(e).popFirst(5))}static empty(){return new te(Se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Se.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new te(new Se(e.slice()))}}function Nm(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=we.fromTimestamp(r===1e9?new De(t+1,0):new De(t,r));return new en(s,te.empty(),e)}function km(n){return new en(n.readTime,n.key,-1)}class en{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new en(we.min(),te.empty(),-1)}static max(){return new en(we.max(),te.empty(),-1)}}function Pm(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=te.comparator(n.documentKey,e.documentKey),t!==0?t:fe(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Om="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class jm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Eu(n){if(n.code!==D.FAILED_PRECONDITION||n.message!==Om)throw n;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&oe(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new j((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof j?t:j.resolve(t)}catch(t){return j.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):j.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):j.reject(t)}static resolve(e){return new j((t,r)=>{t(e)})}static reject(e){return new j((t,r)=>{r(e)})}static waitFor(e){return new j((t,r)=>{let s=0,o=0,a=!1;e.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=j.resolve(!1);for(const r of e)t=t.next(s=>s?j.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new j((r,s)=>{const o=e.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const f=h;t(e[f]).next(y=>{a[f]=y,++u,u===o&&r(a)},y=>s(y))}})}static doWhile(e,t){return new j((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function Dm(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function oi(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}bu.oe=-1;function Uo(n){return n==null}function Us(n){return n===0&&1/n==-1/0}function Lm(n){return typeof n=="number"&&Number.isInteger(n)&&!Us(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function $r(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function xu(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e,t){this.comparator=e,this.root=t||Fe.EMPTY}insert(e,t){return new Xe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Fe.BLACK,null,null))}remove(e){return new Xe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Fe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ps(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ps(this.root,e,this.comparator,!1)}getReverseIterator(){return new ps(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ps(this.root,e,this.comparator,!0)}}class ps{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Fe{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??Fe.RED,this.left=s??Fe.EMPTY,this.right=o??Fe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new Fe(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Fe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Fe.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw oe();const e=this.left.check();if(e!==this.right.check())throw oe();return e+(this.isRed()?0:1)}}Fe.EMPTY=null,Fe.RED=!0,Fe.BLACK=!1;Fe.EMPTY=new class{constructor(){this.size=0}get key(){throw oe()}get value(){throw oe()}get color(){throw oe()}get left(){throw oe()}get right(){throw oe()}copy(e,t,r,s,o){return this}insert(e,t,r){return new Fe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e){this.comparator=e,this.data=new Xe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Nl(this.data.getIterator())}getIteratorFrom(e){return new Nl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof Ke)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ke(this.comparator);return t.data=e,t}}class Nl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.fields=e,e.sort(Be.comparator)}static empty(){return new gt([])}unionWith(e){let t=new Ke(Be.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new gt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Gn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Mm("Invalid base64 string: "+o):o}}(e);return new Tt(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new Tt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return fe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Tt.EMPTY_BYTE_STRING=new Tt("");const Vm=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function En(n){if(be(!!n),typeof n=="string"){let e=0;const t=Vm.exec(n);if(be(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ue(n.seconds),nanos:Ue(n.nanos)}}function Ue(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Nr(n){return typeof n=="string"?Tt.fromBase64String(n):Tt.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bo(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Tu(n){const e=n.mapValue.fields.__previous_value__;return Bo(e)?Tu(e):e}function Bs(n){const e=En(n.mapValue.fields.__local_write_time__.timestampValue);return new De(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(e,t,r,s,o,a,u,h,f){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=f}}class $s{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new $s("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof $s&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gs={mapValue:{}};function qn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Bo(n)?4:Bm(n)?9007199254740991:Um(n)?10:11:oe()}function At(n,e){if(n===e)return!0;const t=qn(n);if(t!==qn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Bs(n).isEqual(Bs(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=En(s.timestampValue),u=En(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Nr(s.bytesValue).isEqual(Nr(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return Ue(s.geoPointValue.latitude)===Ue(o.geoPointValue.latitude)&&Ue(s.geoPointValue.longitude)===Ue(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return Ue(s.integerValue)===Ue(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=Ue(s.doubleValue),u=Ue(o.doubleValue);return a===u?Us(a)===Us(u):isNaN(a)&&isNaN(u)}return!1}(n,e);case 9:return Gn(n.arrayValue.values||[],e.arrayValue.values||[],At);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(Rl(a)!==Rl(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!At(a[h],u[h])))return!1;return!0}(n,e);default:return oe()}}function kr(n,e){return(n.values||[]).find(t=>At(t,e))!==void 0}function Hn(n,e){if(n===e)return 0;const t=qn(n),r=qn(e);if(t!==r)return fe(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return fe(n.booleanValue,e.booleanValue);case 2:return function(o,a){const u=Ue(o.integerValue||o.doubleValue),h=Ue(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(n,e);case 3:return kl(n.timestampValue,e.timestampValue);case 4:return kl(Bs(n),Bs(e));case 5:return fe(n.stringValue,e.stringValue);case 6:return function(o,a){const u=Nr(o),h=Nr(a);return u.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let f=0;f<u.length&&f<h.length;f++){const y=fe(u[f],h[f]);if(y!==0)return y}return fe(u.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const u=fe(Ue(o.latitude),Ue(a.latitude));return u!==0?u:fe(Ue(o.longitude),Ue(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Pl(n.arrayValue,e.arrayValue);case 10:return function(o,a){var u,h,f,y;const b=o.fields||{},x=a.fields||{},A=(u=b.value)===null||u===void 0?void 0:u.arrayValue,k=(h=x.value)===null||h===void 0?void 0:h.arrayValue,S=fe(((f=A==null?void 0:A.values)===null||f===void 0?void 0:f.length)||0,((y=k==null?void 0:k.values)===null||y===void 0?void 0:y.length)||0);return S!==0?S:Pl(A,k)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===gs.mapValue&&a===gs.mapValue)return 0;if(o===gs.mapValue)return 1;if(a===gs.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),f=a.fields||{},y=Object.keys(f);h.sort(),y.sort();for(let b=0;b<h.length&&b<y.length;++b){const x=fe(h[b],y[b]);if(x!==0)return x;const A=Hn(u[h[b]],f[y[b]]);if(A!==0)return A}return fe(h.length,y.length)}(n.mapValue,e.mapValue);default:throw oe()}}function kl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return fe(n,e);const t=En(n),r=En(e),s=fe(t.seconds,r.seconds);return s!==0?s:fe(t.nanos,r.nanos)}function Pl(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Hn(t[s],r[s]);if(o)return o}return fe(t.length,r.length)}function Wn(n){return lo(n)}function lo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=En(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Nr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return te.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=lo(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${lo(t.fields[a])}`;return s+"}"}(n.mapValue):oe()}function co(n){return!!n&&"integerValue"in n}function $o(n){return!!n&&"arrayValue"in n}function Ts(n){return!!n&&"mapValue"in n}function Um(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Ir(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return $r(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Ir(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ir(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Bm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this.value=e}static empty(){return new pt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Ts(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ir(t)}setAll(e){let t=Be.emptyPath(),r={},s=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=u.popLast()}a?r[u.lastSegment()]=Ir(a):s.push(u.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());Ts(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return At(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Ts(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){$r(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new pt(Ir(this.value))}}function Au(n){const e=[];return $r(n.fields,(t,r)=>{const s=new Be([t]);if(Ts(r)){const o=Au(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e,t,r,s,o,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(e){return new ft(e,0,we.min(),we.min(),we.min(),pt.empty(),0)}static newFoundDocument(e,t,r,s){return new ft(e,1,t,we.min(),r,s,0)}static newNoDocument(e,t){return new ft(e,2,t,we.min(),we.min(),pt.empty(),0)}static newUnknownDocument(e,t){return new ft(e,3,t,we.min(),we.min(),pt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=pt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=pt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ft&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ft(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(e,t){this.position=e,this.inclusive=t}}function Ol(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=te.comparator(te.fromName(a.referenceValue),t.key):r=Hn(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function jl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!At(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,t="asc"){this.field=e,this.dir=t}}function $m(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{}class je extends Cu{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new qm(e,t,r):t==="array-contains"?new zm(e,r):t==="in"?new Km(e,r):t==="not-in"?new Qm(e,r):t==="array-contains-any"?new Jm(e,r):new je(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Hm(e,r):new Wm(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Hn(t,this.value)):t!==null&&qn(this.value)===qn(t)&&this.matchesComparison(Hn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return oe()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tn extends Cu{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new tn(e,t)}matches(e){return Su(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Su(n){return n.op==="and"}function Ru(n){return Gm(n)&&Su(n)}function Gm(n){for(const e of n.filters)if(e instanceof tn)return!1;return!0}function uo(n){if(n instanceof je)return n.field.canonicalString()+n.op.toString()+Wn(n.value);if(Ru(n))return n.filters.map(e=>uo(e)).join(",");{const e=n.filters.map(t=>uo(t)).join(",");return`${n.op}(${e})`}}function Nu(n,e){return n instanceof je?function(r,s){return s instanceof je&&r.op===s.op&&r.field.isEqual(s.field)&&At(r.value,s.value)}(n,e):n instanceof tn?function(r,s){return s instanceof tn&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,u)=>o&&Nu(a,s.filters[u]),!0):!1}(n,e):void oe()}function ku(n){return n instanceof je?function(t){return`${t.field.canonicalString()} ${t.op} ${Wn(t.value)}`}(n):n instanceof tn?function(t){return t.op.toString()+" {"+t.getFilters().map(ku).join(" ,")+"}"}(n):"Filter"}class qm extends je{constructor(e,t,r){super(e,t,r),this.key=te.fromName(r.referenceValue)}matches(e){const t=te.comparator(e.key,this.key);return this.matchesComparison(t)}}class Hm extends je{constructor(e,t){super(e,"in",t),this.keys=Pu("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Wm extends je{constructor(e,t){super(e,"not-in",t),this.keys=Pu("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Pu(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>te.fromName(r.referenceValue))}class zm extends je{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return $o(t)&&kr(t.arrayValue,this.value)}}class Km extends je{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&kr(this.value.arrayValue,t)}}class Qm extends je{constructor(e,t){super(e,"not-in",t)}matches(e){if(kr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!kr(this.value.arrayValue,t)}}class Jm extends je{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!$o(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>kr(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(e,t=null,r=[],s=[],o=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.ue=null}}function Dl(n,e=null,t=[],r=[],s=null,o=null,a=null){return new Ym(n,e,t,r,s,o,a)}function Go(n){const e=me(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>uo(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Uo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Wn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Wn(r)).join(",")),e.ue=t}return e.ue}function qo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!$m(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Nu(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!jl(n.startAt,e.startAt)&&jl(n.endAt,e.endAt)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai{constructor(e,t=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Xm(n,e,t,r,s,o,a,u){return new ai(n,e,t,r,s,o,a,u)}function Zm(n){return new ai(n)}function Ll(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ey(n){return n.collectionGroup!==null}function Er(n){const e=me(n);if(e.ce===null){e.ce=[];const t=new Set;for(const o of e.explicitOrderBy)e.ce.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new Ke(Be.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(u=u.add(f.field))})}),u})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.ce.push(new qs(o,r))}),t.has(Be.keyField().canonicalString())||e.ce.push(new qs(Be.keyField(),r))}return e.ce}function vn(n){const e=me(n);return e.le||(e.le=ty(e,Er(n))),e.le}function ty(n,e){if(n.limitType==="F")return Dl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new qs(s.field,o)});const t=n.endAt?new Gs(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Gs(n.startAt.position,n.startAt.inclusive):null;return Dl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ho(n,e,t){return new ai(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ou(n,e){return qo(vn(n),vn(e))&&n.limitType===e.limitType}function ju(n){return`${Go(vn(n))}|lt:${n.limitType}`}function mr(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>ku(s)).join(", ")}]`),Uo(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Wn(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Wn(s)).join(",")),`Target(${r})`}(vn(n))}; limitType=${n.limitType})`}function Ho(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):te.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Er(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,u,h){const f=Ol(a,u,h);return a.inclusive?f<=0:f<0}(r.startAt,Er(r),s)||r.endAt&&!function(a,u,h){const f=Ol(a,u,h);return a.inclusive?f>=0:f>0}(r.endAt,Er(r),s))}(n,e)}function ny(n){return(e,t)=>{let r=!1;for(const s of Er(n)){const o=ry(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function ry(n,e,t){const r=n.field.isKeyField()?te.comparator(e.key,t.key):function(o,a,u){const h=a.data.field(o),f=u.data.field(o);return h!==null&&f!==null?Hn(h,f):oe()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return oe()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){$r(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return xu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sy=new Xe(te.comparator);function Hs(){return sy}const Du=new Xe(te.comparator);function ms(...n){let e=Du;for(const t of n)e=e.insert(t.key,t);return e}function Lu(n){let e=Du;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function gn(){return br()}function Mu(){return br()}function br(){return new Xn(n=>n.toString(),(n,e)=>n.isEqual(e))}const iy=new Xe(te.comparator),oy=new Ke(te.comparator);function ze(...n){let e=oy;for(const t of n)e=e.add(t);return e}const ay=new Ke(fe);function ly(){return ay}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Us(e)?"-0":e}}function Vu(n){return{integerValue:""+n}}function cy(n,e){return Lm(e)?Vu(e):Wo(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(){this._=void 0}}function uy(n,e,t){return n instanceof Ws?function(s,o){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Bo(o)&&(o=Tu(o)),o&&(a.fields.__previous_value__=o),{mapValue:a}}(t,e):n instanceof Pr?Uu(n,e):n instanceof Or?Bu(n,e):function(s,o){const a=Fu(s,o),u=Ml(a)+Ml(s.Pe);return co(a)&&co(s.Pe)?Vu(u):Wo(s.serializer,u)}(n,e)}function hy(n,e,t){return n instanceof Pr?Uu(n,e):n instanceof Or?Bu(n,e):t}function Fu(n,e){return n instanceof zs?function(r){return co(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class Ws extends li{}class Pr extends li{constructor(e){super(),this.elements=e}}function Uu(n,e){const t=$u(e);for(const r of n.elements)t.some(s=>At(s,r))||t.push(r);return{arrayValue:{values:t}}}class Or extends li{constructor(e){super(),this.elements=e}}function Bu(n,e){let t=$u(e);for(const r of n.elements)t=t.filter(s=>!At(s,r));return{arrayValue:{values:t}}}class zs extends li{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ml(n){return Ue(n.integerValue||n.doubleValue)}function $u(n){return $o(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function dy(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Pr&&s instanceof Pr||r instanceof Or&&s instanceof Or?Gn(r.elements,s.elements,At):r instanceof zs&&s instanceof zs?At(r.Pe,s.Pe):r instanceof Ws&&s instanceof Ws}(n.transform,e.transform)}class fy{constructor(e,t){this.version=e,this.transformResults=t}}class Bt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Bt}static exists(e){return new Bt(void 0,e)}static updateTime(e){return new Bt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function As(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ci{}function Gu(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Hu(n.key,Bt.none()):new Gr(n.key,n.data,Bt.none());{const t=n.data,r=pt.empty();let s=new Ke(Be.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Cn(n.key,r,new gt(s.toArray()),Bt.none())}}function py(n,e,t){n instanceof Gr?function(s,o,a){const u=s.value.clone(),h=Fl(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,e,t):n instanceof Cn?function(s,o,a){if(!As(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=Fl(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(qu(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function xr(n,e,t,r){return n instanceof Gr?function(o,a,u,h){if(!As(o.precondition,a))return u;const f=o.value.clone(),y=Ul(o.fieldTransforms,h,a);return f.setAll(y),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(n,e,t,r):n instanceof Cn?function(o,a,u,h){if(!As(o.precondition,a))return u;const f=Ul(o.fieldTransforms,h,a),y=a.data;return y.setAll(qu(o)),y.setAll(f),a.convertToFoundDocument(a.version,y).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(b=>b.field))}(n,e,t,r):function(o,a,u){return As(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(n,e,t)}function gy(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=Fu(r.transform,s||null);o!=null&&(t===null&&(t=pt.empty()),t.set(r.field,o))}return t||null}function Vl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Gn(r,s,(o,a)=>dy(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Gr extends ci{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Cn extends ci{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function qu(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Fl(n,e,t){const r=new Map;be(n.length===t.length);for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,u=e.data.field(o.field);r.set(o.field,hy(a,u,t[s]))}return r}function Ul(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,uy(o,a,e))}return r}class Hu extends ci{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class my extends ci{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&py(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=xr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=xr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Mu();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=t.has(s.key)?null:u;const h=Gu(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(we.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ze())}isEqual(e){return this.batchId===e.batchId&&Gn(this.mutations,e.mutations,(t,r)=>Vl(t,r))&&Gn(this.baseMutations,e.baseMutations,(t,r)=>Vl(t,r))}}class zo{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){be(e.mutations.length===r.length);let s=function(){return iy}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new zo(e,t,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ce,ae;function _y(n){switch(n){default:return oe();case D.CANCELLED:case D.UNKNOWN:case D.DEADLINE_EXCEEDED:case D.RESOURCE_EXHAUSTED:case D.INTERNAL:case D.UNAVAILABLE:case D.UNAUTHENTICATED:return!1;case D.INVALID_ARGUMENT:case D.NOT_FOUND:case D.ALREADY_EXISTS:case D.PERMISSION_DENIED:case D.FAILED_PRECONDITION:case D.ABORTED:case D.OUT_OF_RANGE:case D.UNIMPLEMENTED:case D.DATA_LOSS:return!0}}function wy(n){if(n===void 0)return In("GRPC error has no .code"),D.UNKNOWN;switch(n){case Ce.OK:return D.OK;case Ce.CANCELLED:return D.CANCELLED;case Ce.UNKNOWN:return D.UNKNOWN;case Ce.DEADLINE_EXCEEDED:return D.DEADLINE_EXCEEDED;case Ce.RESOURCE_EXHAUSTED:return D.RESOURCE_EXHAUSTED;case Ce.INTERNAL:return D.INTERNAL;case Ce.UNAVAILABLE:return D.UNAVAILABLE;case Ce.UNAUTHENTICATED:return D.UNAUTHENTICATED;case Ce.INVALID_ARGUMENT:return D.INVALID_ARGUMENT;case Ce.NOT_FOUND:return D.NOT_FOUND;case Ce.ALREADY_EXISTS:return D.ALREADY_EXISTS;case Ce.PERMISSION_DENIED:return D.PERMISSION_DENIED;case Ce.FAILED_PRECONDITION:return D.FAILED_PRECONDITION;case Ce.ABORTED:return D.ABORTED;case Ce.OUT_OF_RANGE:return D.OUT_OF_RANGE;case Ce.UNIMPLEMENTED:return D.UNIMPLEMENTED;case Ce.DATA_LOSS:return D.DATA_LOSS;default:return oe()}}(ae=Ce||(Ce={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new pu([4294967295,4294967295],0);class Iy{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function fo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ey(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function by(n,e){return fo(n,e.toTimestamp())}function Un(n){return be(!!n),we.fromTimestamp(function(t){const r=En(t);return new De(r.seconds,r.nanos)}(n))}function Wu(n,e){return po(n,e).canonicalString()}function po(n,e){const t=function(s){return new Se(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function xy(n){const e=Se.fromString(n);return be(Py(e)),e}function go(n,e){return Wu(n.databaseId,e.path)}function Ty(n){const e=xy(n);return e.length===4?Se.emptyPath():Cy(e)}function Ay(n){return new Se(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Cy(n){return be(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Bl(n,e,t){return{name:go(n,e),fields:t.value.mapValue.fields}}function Sy(n,e){let t;if(e instanceof Gr)t={update:Bl(n,e.key,e.value)};else if(e instanceof Hu)t={delete:go(n,e.key)};else if(e instanceof Cn)t={update:Bl(n,e.key,e.data),updateMask:ky(e.fieldMask)};else{if(!(e instanceof my))return oe();t={verify:go(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const u=a.transform;if(u instanceof Ws)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Pr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Or)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof zs)return{fieldPath:a.field.canonicalString(),increment:u.Pe};throw oe()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:by(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:oe()}(n,e.precondition)),t}function Ry(n,e){return n&&n.length>0?(be(e!==void 0),n.map(t=>function(s,o){let a=s.updateTime?Un(s.updateTime):Un(o);return a.isEqual(we.min())&&(a=Un(o)),new fy(a,s.transformResults||[])}(t,e))):[]}function Ny(n){let e=Ty(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){be(r===1);const y=t.from[0];y.allDescendants?s=y.collectionId:e=e.child(y.collectionId)}let o=[];t.where&&(o=function(b){const x=zu(b);return x instanceof tn&&Ru(x)?x.getFilters():[x]}(t.where));let a=[];t.orderBy&&(a=function(b){return b.map(x=>function(k){return new qs(Ln(k.field),function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(x))}(t.orderBy));let u=null;t.limit&&(u=function(b){let x;return x=typeof b=="object"?b.value:b,Uo(x)?null:x}(t.limit));let h=null;t.startAt&&(h=function(b){const x=!!b.before,A=b.values||[];return new Gs(A,x)}(t.startAt));let f=null;return t.endAt&&(f=function(b){const x=!b.before,A=b.values||[];return new Gs(A,x)}(t.endAt)),Xm(e,s,a,o,u,"F",h,f)}function zu(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Ln(t.unaryFilter.field);return je.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Ln(t.unaryFilter.field);return je.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Ln(t.unaryFilter.field);return je.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Ln(t.unaryFilter.field);return je.create(a,"!=",{nullValue:"NULL_VALUE"});default:return oe()}}(n):n.fieldFilter!==void 0?function(t){return je.create(Ln(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return oe()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return tn.create(t.compositeFilter.filters.map(r=>zu(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return oe()}}(t.compositeFilter.op))}(n):oe()}function Ln(n){return Be.fromServerFormat(n.fieldPath)}function ky(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Py(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(e){this.ct=e}}function jy(n){const e=Ny({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ho(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(){this.un=new Ly}addToCollectionParentIndex(e,t){return this.un.add(t),j.resolve()}getCollectionParents(e,t){return j.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return j.resolve()}deleteFieldIndex(e,t){return j.resolve()}deleteAllFieldIndexes(e){return j.resolve()}createTargetIndexes(e,t){return j.resolve()}getDocumentsMatchingTarget(e,t){return j.resolve(null)}getIndexType(e,t){return j.resolve(0)}getFieldIndexes(e,t){return j.resolve([])}getNextCollectionGroupToUpdate(e){return j.resolve(null)}getMinOffset(e,t){return j.resolve(en.min())}getMinOffsetFromCollectionGroup(e,t){return j.resolve(en.min())}updateCollectionGroup(e,t,r){return j.resolve()}updateIndexEntries(e,t){return j.resolve()}}class Ly{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Ke(Se.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Ke(Se.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new zn(0)}static kn(){return new zn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My{constructor(){this.changes=new Xn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ft.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?j.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&xr(r.mutation,s,gt.empty(),De.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,ze()).next(()=>r))}getLocalViewOfDocuments(e,t,r=ze()){const s=gn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=ms();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=gn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,ze()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,r,s){let o=Hs();const a=br(),u=function(){return br()}();return t.forEach((h,f)=>{const y=r.get(f.key);s.has(f.key)&&(y===void 0||y.mutation instanceof Cn)?o=o.insert(f.key,f):y!==void 0?(a.set(f.key,y.mutation.getFieldMask()),xr(y.mutation,f,y.mutation.getFieldMask(),De.now())):a.set(f.key,gt.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((f,y)=>a.set(f,y)),t.forEach((f,y)=>{var b;return u.set(f,new Vy(y,(b=a.get(f))!==null&&b!==void 0?b:null))}),u))}recalculateAndSaveOverlays(e,t){const r=br();let s=new Xe((a,u)=>a-u),o=ze();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(h=>{const f=t.get(h);if(f===null)return;let y=r.get(h)||gt.empty();y=u.applyToLocalView(f,y),r.set(h,y);const b=(s.get(u.batchId)||ze()).add(h);s=s.insert(u.batchId,b)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),f=h.key,y=h.value,b=Mu();y.forEach(x=>{if(!o.has(x)){const A=Gu(t.get(x),r.get(x));A!==null&&b.set(x,A),o=o.add(x)}}),a.push(this.documentOverlayCache.saveOverlays(e,f,b))}return j.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return te.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ey(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):j.resolve(gn());let u=-1,h=o;return a.next(f=>j.forEach(f,(y,b)=>(u<b.largestBatchId&&(u=b.largestBatchId),o.get(y)?j.resolve():this.remoteDocumentCache.getEntry(e,y).next(x=>{h=h.insert(y,x)}))).next(()=>this.populateOverlays(e,f,o)).next(()=>this.computeViews(e,h,f,ze())).next(y=>({batchId:u,changes:Lu(y)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new te(t)).next(r=>{let s=ms();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=ms();return this.indexManager.getCollectionParents(e,o).next(u=>j.forEach(u,h=>{const f=function(b,x){return new ai(x,null,b.explicitOrderBy.slice(),b.filters.slice(),b.limit,b.limitType,b.startAt,b.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,f,r,s).next(y=>{y.forEach((b,x)=>{a=a.insert(b,x)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,f)=>{const y=f.getKey();a.get(y)===null&&(a=a.insert(y,ft.newInvalidDocument(y)))});let u=ms();return a.forEach((h,f)=>{const y=o.get(h);y!==void 0&&xr(y.mutation,f,gt.empty(),De.now()),Ho(t,f)&&(u=u.insert(h,f))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return j.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Un(s.createTime)}}(t)),j.resolve()}getNamedQuery(e,t){return j.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:jy(s.bundledQuery),readTime:Un(s.readTime)}}(t)),j.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(){this.overlays=new Xe(te.comparator),this.Ir=new Map}getOverlay(e,t){return j.resolve(this.overlays.get(t))}getOverlays(e,t){const r=gn();return j.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.ht(e,t,o)}),j.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Ir.delete(r)),j.resolve()}getOverlaysForCollection(e,t,r){const s=gn(),o=t.length+1,a=new te(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,f=h.getKey();if(!t.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return j.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new Xe((f,y)=>f-y);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===t&&f.largestBatchId>r){let y=o.get(f.largestBatchId);y===null&&(y=gn(),o=o.insert(f.largestBatchId,y)),y.set(f.getKey(),f)}}const u=gn(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,y)=>u.set(f,y)),!(u.size()>=s)););return j.resolve(u)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new vy(t,r));let o=this.Ir.get(t);o===void 0&&(o=ze(),this.Ir.set(t,o)),this.Ir.set(t,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(){this.sessionToken=Tt.EMPTY_BYTE_STRING}getSessionToken(e){return j.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,j.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(){this.Tr=new Ke(Oe.Er),this.dr=new Ke(Oe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Oe(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Oe(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new te(new Se([])),r=new Oe(t,e),s=new Oe(t,e+1),o=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),o.push(a.key)}),o}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new te(new Se([])),r=new Oe(t,e),s=new Oe(t,e+1);let o=ze();return this.dr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new Oe(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Oe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return te.comparator(e.key,t.key)||fe(e.wr,t.wr)}static Ar(e,t){return fe(e.wr,t.wr)||te.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Ke(Oe.Er)}checkEmpty(e){return j.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new yy(o,t,r,s);this.mutationQueue.push(a);for(const u of s)this.br=this.br.add(new Oe(u.key,o)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return j.resolve(a)}lookupMutationBatch(e,t){return j.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),o=s<0?0:s;return j.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return j.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return j.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Oe(t,0),s=new Oe(t,Number.POSITIVE_INFINITY),o=[];return this.br.forEachInRange([r,s],a=>{const u=this.Dr(a.wr);o.push(u)}),j.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Ke(fe);return t.forEach(s=>{const o=new Oe(s,0),a=new Oe(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([o,a],u=>{r=r.add(u.wr)})}),j.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;te.isDocumentKey(o)||(o=o.child(""));const a=new Oe(new te(o),0);let u=new Ke(fe);return this.br.forEachWhile(h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(u=u.add(h.wr)),!0)},a),j.resolve(this.Cr(u))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){be(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return j.forEach(t.mutations,s=>{const o=new Oe(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Oe(t,0),s=this.br.firstAfterOrEqual(r);return j.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,j.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(e){this.Mr=e,this.docs=function(){return new Xe(te.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return j.resolve(r?r.document.mutableCopy():ft.newInvalidDocument(t))}getEntries(e,t){let r=Hs();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():ft.newInvalidDocument(s))}),j.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Hs();const a=t.path,u=new te(a.child("")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:f,value:{document:y}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||Pm(km(y),r)<=0||(s.has(y.key)||Ho(t,y))&&(o=o.insert(y.key,y.mutableCopy()))}return j.resolve(o)}getAllFromCollectionGroup(e,t,r,s){oe()}Or(e,t){return j.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Hy(this)}getSize(e){return j.resolve(this.size)}}class Hy extends My{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),j.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(e){this.persistence=e,this.Nr=new Xn(t=>Go(t),qo),this.lastRemoteSnapshotVersion=we.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Ko,this.targetCount=0,this.kr=zn.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),j.resolve()}getLastRemoteSnapshotVersion(e){return j.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return j.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),j.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),j.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new zn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,j.resolve()}updateTargetData(e,t){return this.Kn(t),j.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,j.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.Nr.forEach((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.Nr.delete(a),o.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),j.waitFor(o).next(()=>s)}getTargetCount(e){return j.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return j.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),j.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),j.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),j.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return j.resolve(r)}containsKey(e,t){return j.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(e,t){this.qr={},this.overlays={},this.Qr=new bu(0),this.Kr=!1,this.Kr=!0,this.$r=new $y,this.referenceDelegate=e(this),this.Ur=new Wy(this),this.indexManager=new Dy,this.remoteDocumentCache=function(s){return new qy(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Oy(t),this.Gr=new Uy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new By,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Gy(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){H("MemoryPersistence","Starting transaction:",e);const s=new Ky(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(o=>this.referenceDelegate.jr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Hr(e,t){return j.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class Ky extends jm{constructor(e){super(),this.currentSequenceNumber=e}}class Qo{constructor(e){this.persistence=e,this.Jr=new Ko,this.Yr=null}static Zr(e){return new Qo(e)}get Xr(){if(this.Yr)return this.Yr;throw oe()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),j.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),j.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),j.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.Xr.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return j.forEach(this.Xr,r=>{const s=te.fromPath(r);return this.ei(e,s).next(o=>{o||t.removeEntry(s,we.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return j.or([()=>j.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=ze(),s=ze();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Jo(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Zd()?8:Dm(Qe())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.Yi(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.Zi(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new Qy;return this.Xi(e,t,a).next(u=>{if(o.result=u,this.zi)return this.es(e,t,a,u.size)})}).next(()=>o.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(gr()<=ie.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",mr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),j.resolve()):(gr()<=ie.DEBUG&&H("QueryEngine","Query:",mr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(gr()<=ie.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",mr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,vn(t))):j.resolve())}Yi(e,t){if(Ll(t))return j.resolve(null);let r=vn(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ho(t,null,"F"),r=vn(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=ze(...o);return this.Ji.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,r).next(h=>{const f=this.ts(t,u);return this.ns(t,f,a,h.readTime)?this.Yi(e,ho(t,null,"F")):this.rs(e,f,t,h)}))})))}Zi(e,t,r,s){return Ll(t)||s.isEqual(we.min())?j.resolve(null):this.Ji.getDocuments(e,r).next(o=>{const a=this.ts(t,o);return this.ns(t,a,r,s)?j.resolve(null):(gr()<=ie.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),mr(t)),this.rs(e,a,t,Nm(s,-1)).next(u=>u))})}ts(e,t){let r=new Ke(ny(e));return t.forEach((s,o)=>{Ho(e,o)&&(r=r.add(o))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Xi(e,t,r){return gr()<=ie.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",mr(t)),this.Ji.getDocumentsMatchingQuery(e,t,en.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new Xe(fe),this._s=new Xn(o=>Go(o),qo),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Fy(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Xy(n,e,t,r){return new Yy(n,e,t,r)}async function Ku(n,e){const t=me(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],u=[];let h=ze();for(const f of s){a.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}for(const f of o){u.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}return t.localDocuments.getDocuments(r,h).next(f=>({hs:f,removedBatchIds:a,addedBatchIds:u}))})})}function Zy(n,e){const t=me(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.cs.newChangeBuffer({trackRemovals:!0});return function(u,h,f,y){const b=f.batch,x=b.keys();let A=j.resolve();return x.forEach(k=>{A=A.next(()=>y.getEntry(h,k)).next(S=>{const N=f.docVersions.get(k);be(N!==null),S.version.compareTo(N)<0&&(b.applyToRemoteDocument(S,f),S.isValidDocument()&&(S.setReadTime(f.commitVersion),y.addEntry(S)))})}),A.next(()=>u.mutationQueue.removeMutationBatch(h,b))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(u){let h=ze();for(let f=0;f<u.mutationResults.length;++f)u.mutationResults[f].transformResults.length>0&&(h=h.add(u.batch.mutations[f].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function ev(n){const e=me(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function tv(n,e){const t=me(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}class $l{constructor(){this.activeTargetIds=ly()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nv{constructor(){this.so=new $l,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new $l,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ys=null;function $i(){return ys===null?ys=function(){return 268435456+Math.round(2147483648*Math.random())}():ys++,"0x"+ys.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iv{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He="WebChannelConnection";class ov extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${o}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${o}`}get Fo(){return!1}Mo(t,r,s,o,a){const u=$i(),h=this.xo(t,r.toUriEncodedString());H("RestConnection",`Sending RPC '${t}' ${u}:`,h,s);const f={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(f,o,a),this.No(t,h,f,s).then(y=>(H("RestConnection",`Received RPC '${t}' ${u}: `,y),y),y=>{throw Fs("RestConnection",`RPC '${t}' ${u} failed with error: `,y,"url: ",h,"request:",s),y})}Lo(t,r,s,o,a,u){return this.Mo(t,r,s,o,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Yn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((o,a)=>t[a]=o),s&&s.headers.forEach((o,a)=>t[a]=o)}xo(t,r){const s=sv[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const o=$i();return new Promise((a,u)=>{const h=new gu;h.setWithCredentials(!0),h.listenOnce(mu.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case xs.NO_ERROR:const y=h.getResponseJson();H(He,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(y)),a(y);break;case xs.TIMEOUT:H(He,`RPC '${e}' ${o} timed out`),u(new Y(D.DEADLINE_EXCEEDED,"Request time out"));break;case xs.HTTP_ERROR:const b=h.getStatus();if(H(He,`RPC '${e}' ${o} failed with status:`,b,"response text:",h.getResponseText()),b>0){let x=h.getResponseJson();Array.isArray(x)&&(x=x[0]);const A=x==null?void 0:x.error;if(A&&A.status&&A.message){const k=function(N){const $=N.toLowerCase().replace(/_/g,"-");return Object.values(D).indexOf($)>=0?$:D.UNKNOWN}(A.status);u(new Y(k,A.message))}else u(new Y(D.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new Y(D.UNAVAILABLE,"Connection failed."));break;default:oe()}}finally{H(He,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(s);H(He,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",f,r,15)})}Bo(e,t,r){const s=$i(),o=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=_u(),u=vu(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.Oo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const y=o.join("");H(He,`Creating RPC '${e}' stream ${s}: ${y}`,h);const b=a.createWebChannel(y,h);let x=!1,A=!1;const k=new iv({Io:N=>{A?H(He,`Not sending because RPC '${e}' stream ${s} is closed:`,N):(x||(H(He,`Opening RPC '${e}' stream ${s} transport.`),b.open(),x=!0),H(He,`RPC '${e}' stream ${s} sending:`,N),b.send(N))},To:()=>b.close()}),S=(N,$,G)=>{N.listen($,U=>{try{G(U)}catch(B){setTimeout(()=>{throw B},0)}})};return S(b,vr.EventType.OPEN,()=>{A||(H(He,`RPC '${e}' stream ${s} transport opened.`),k.yo())}),S(b,vr.EventType.CLOSE,()=>{A||(A=!0,H(He,`RPC '${e}' stream ${s} transport closed`),k.So())}),S(b,vr.EventType.ERROR,N=>{A||(A=!0,Fs(He,`RPC '${e}' stream ${s} transport errored:`,N),k.So(new Y(D.UNAVAILABLE,"The operation could not be completed")))}),S(b,vr.EventType.MESSAGE,N=>{var $;if(!A){const G=N.data[0];be(!!G);const U=G,B=U.error||(($=U[0])===null||$===void 0?void 0:$.error);if(B){H(He,`RPC '${e}' stream ${s} received error:`,B);const ue=B.status;let M=function(m){const v=Ce[m];if(v!==void 0)return wy(v)}(ue),I=B.message;M===void 0&&(M=D.INTERNAL,I="Unknown error status: "+ue+" with message "+B.message),A=!0,k.So(new Y(M,I)),b.close()}else H(He,`RPC '${e}' stream ${s} received:`,G),k.bo(G)}}),S(u,yu.STAT_EVENT,N=>{N.stat===ao.PROXY?H(He,`RPC '${e}' stream ${s} detected buffering proxy`):N.stat===ao.NOPROXY&&H(He,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{k.wo()},0),k}}function Gi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ui(n){return new Iy(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(e,t,r=1e3,s=1.5,o=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=o,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&H("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class av{constructor(e,t,r,s,o,a,u,h){this.ui=e,this.Ho=r,this.Jo=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Qu(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===D.RESOURCE_EXHAUSTED?(In(t.toString()),In("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===D.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new Y(D.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class lv extends av{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return be(!!e.streamToken),this.lastStreamToken=e.streamToken,be(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){be(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Ry(e.writeResults,e.commitTime),r=Un(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ay(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sy(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cv extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new Y(D.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Mo(e,po(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new Y(D.UNKNOWN,o.toString())})}Lo(e,t,r,s,o){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Lo(e,po(t,r),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new Y(D.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class uv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(In(t),this.D_=!1):H("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hv{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=o,this.k_._o(a=>{r.enqueueAndForget(async()=>{Hr(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(h){const f=me(h);f.L_.add(4),await qr(f),f.q_.set("Unknown"),f.L_.delete(4),await hi(f)}(this))})}),this.q_=new uv(r,s)}}async function hi(n){if(Hr(n))for(const e of n.B_)await e(!0)}async function qr(n){for(const e of n.B_)await e(!1)}function Hr(n){return me(n).L_.size===0}async function Ju(n,e,t){if(!oi(e))throw e;n.L_.add(1),await qr(n),n.q_.set("Offline"),t||(t=()=>ev(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await hi(n)})}function Yu(n,e){return e().catch(t=>Ju(n,t,e))}async function di(n){const e=me(n),t=nn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;dv(e);)try{const s=await tv(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,fv(e,s)}catch(s){await Ju(e,s)}Xu(e)&&Zu(e)}function dv(n){return Hr(n)&&n.O_.length<10}function fv(n,e){n.O_.push(e);const t=nn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function Xu(n){return Hr(n)&&!nn(n).n_()&&n.O_.length>0}function Zu(n){nn(n).start()}async function pv(n){nn(n).p_()}async function gv(n){const e=nn(n);for(const t of n.O_)e.m_(t.mutations)}async function mv(n,e,t){const r=n.O_.shift(),s=zo.from(r,e,t);await Yu(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await di(n)}async function yv(n,e){e&&nn(n).V_&&await async function(r,s){if(function(a){return _y(a)&&a!==D.ABORTED}(s.code)){const o=r.O_.shift();nn(r).s_(),await Yu(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await di(r)}}(n,e),Xu(n)&&Zu(n)}async function ql(n,e){const t=me(n);t.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const r=Hr(t);t.L_.add(3),await qr(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await hi(t)}async function vv(n,e){const t=me(n);e?(t.L_.delete(2),await hi(t)):e||(t.L_.add(2),await qr(t),t.q_.set("Unknown"))}function nn(n){return n.U_||(n.U_=function(t,r,s){const o=me(t);return o.w_(),new lv(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:pv.bind(null,n),mo:yv.bind(null,n),f_:gv.bind(null,n),g_:mv.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await di(n)):(await n.U_.stop(),n.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new yn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,u=new Yo(e,t,a,s,o);return u.start(r),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Y(D.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function eh(n,e){if(In("AsyncQueue",`${e}: ${n}`),oi(n))return new Y(D.UNAVAILABLE,`${e}: ${n}`);throw n}class _v{constructor(){this.queries=Hl(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=me(t),o=s.queries;s.queries=Hl(),o.forEach((a,u)=>{for(const h of u.j_)h.onError(r)})})(this,new Y(D.ABORTED,"Firestore shutting down"))}}function Hl(){return new Xn(n=>ju(n),Ou)}function wv(n){n.Y_.forEach(e=>{e.next()})}var Wl,zl;(zl=Wl||(Wl={})).ea="default",zl.Cache="cache";class Iv{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Xn(u=>ju(u),Ou),this.Ma=new Map,this.xa=new Set,this.Oa=new Xe(te.comparator),this.Na=new Map,this.La=new Ko,this.Ba={},this.ka=new Map,this.qa=zn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Ev(n,e,t){const r=Av(n);try{const s=await function(a,u){const h=me(a),f=De.now(),y=u.reduce((A,k)=>A.add(k.key),ze());let b,x;return h.persistence.runTransaction("Locally write mutations","readwrite",A=>{let k=Hs(),S=ze();return h.cs.getEntries(A,y).next(N=>{k=N,k.forEach(($,G)=>{G.isValidDocument()||(S=S.add($))})}).next(()=>h.localDocuments.getOverlayedDocuments(A,k)).next(N=>{b=N;const $=[];for(const G of u){const U=gy(G,b.get(G.key).overlayedDocument);U!=null&&$.push(new Cn(G.key,U,Au(U.value.mapValue),Bt.exists(!0)))}return h.mutationQueue.addMutationBatch(A,f,$,u)}).next(N=>{x=N;const $=N.applyToLocalDocumentSet(b,S);return h.documentOverlayCache.saveOverlays(A,N.batchId,$)})}).then(()=>({batchId:x.batchId,changes:Lu(b)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let f=a.Ba[a.currentUser.toKey()];f||(f=new Xe(fe)),f=f.insert(u,h),a.Ba[a.currentUser.toKey()]=f}(r,s.batchId,t),await fi(r,s.changes),await di(r.remoteStore)}catch(s){const o=eh(s,"Failed to persist write");t.reject(o)}}function Kl(n,e,t){const r=me(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((o,a)=>{const u=a.view.Z_(e);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=me(a);h.onlineState=u;let f=!1;h.queries.forEach((y,b)=>{for(const x of b.j_)x.Z_(u)&&(f=!0)}),f&&wv(h)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function bv(n,e){const t=me(n),r=e.batch.batchId;try{const s=await Zy(t.localStore,e);nh(t,r,null),th(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await fi(t,s)}catch(s){await Eu(s)}}async function xv(n,e,t){const r=me(n);try{const s=await function(a,u){const h=me(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",f=>{let y;return h.mutationQueue.lookupMutationBatch(f,u).next(b=>(be(b!==null),y=b.keys(),h.mutationQueue.removeMutationBatch(f,b))).next(()=>h.mutationQueue.performConsistencyCheck(f)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(f,y,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,y)).next(()=>h.localDocuments.getDocuments(f,y))})}(r.localStore,e);nh(r,e,t),th(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await fi(r,s)}catch(s){await Eu(s)}}function th(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function nh(n,e,t){const r=me(n);let s=r.Ba[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}async function fi(n,e,t){const r=me(n),s=[],o=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((u,h)=>{a.push(r.Ka(h,e,t).then(f=>{var y;if((f||t)&&r.isPrimaryClient){const b=f?!f.fromCache:(y=void 0)===null||y===void 0?void 0:y.current;r.sharedClientState.updateQueryState(h.targetId,b?"current":"not-current")}if(f){s.push(f);const b=Jo.Wi(h.targetId,f);o.push(b)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(h,f){const y=me(h);try{await y.persistence.runTransaction("notifyLocalViewChanges","readwrite",b=>j.forEach(f,x=>j.forEach(x.$i,A=>y.persistence.referenceDelegate.addReference(b,x.targetId,A)).next(()=>j.forEach(x.Ui,A=>y.persistence.referenceDelegate.removeReference(b,x.targetId,A)))))}catch(b){if(!oi(b))throw b;H("LocalStore","Failed to update sequence numbers: "+b)}for(const b of f){const x=b.targetId;if(!b.fromCache){const A=y.os.get(x),k=A.snapshotVersion,S=A.withLastLimboFreeSnapshotVersion(k);y.os=y.os.insert(x,S)}}}(r.localStore,o))}async function Tv(n,e){const t=me(n);if(!t.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const r=await Ku(t.localStore,e);t.currentUser=e,function(o,a){o.ka.forEach(u=>{u.forEach(h=>{h.reject(new Y(D.CANCELLED,a))})}),o.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await fi(t,r.hs)}}function Av(n){const e=me(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=bv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xv.bind(null,e),e}class Ks{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ui(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Xy(this.persistence,new Jy,e.initialUser,this.serializer)}Ga(e){return new zy(Qo.Zr,this.serializer)}Wa(e){return new nv}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ks.provider={build:()=>new Ks};class mo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Kl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Tv.bind(null,this.syncEngine),await vv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new _v}()}createDatastore(e){const t=ui(e.databaseInfo.databaseId),r=function(o){return new ov(o)}(e.databaseInfo);return function(o,a,u,h){return new cv(o,a,u,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,u){return new hv(r,s,o,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>Kl(this.syncEngine,t,0),function(){return Gl.D()?new Gl:new rv}())}createSyncEngine(e,t){return function(s,o,a,u,h,f,y){const b=new Iv(s,o,a,u,h,f);return y&&(b.Qa=!0),b}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=me(s);H("RemoteStore","RemoteStore shutting down."),o.L_.add(5),await qr(o),o.k_.shutdown(),o.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}mo.provider={build:()=>new mo};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=We.UNAUTHENTICATED,this.clientId=Iu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{H("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(H("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new yn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=eh(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function qi(n,e){n.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Ku(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Ql(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Sv(n);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>ql(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>ql(e.remoteStore,s)),n._onlineComponents=e}async function Sv(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await qi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===D.FAILED_PRECONDITION||s.code===D.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Fs("Error using user provided cache. Falling back to memory cache: "+t),await qi(n,new Ks)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await qi(n,new Ks);return n._offlineComponents}async function Rv(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await Ql(n,n._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await Ql(n,new mo))),n._onlineComponents}function Nv(n){return Rv(n).then(e=>e.syncEngine)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kv(n,e,t){if(!t)throw new Y(D.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Pv(n,e,t,r){if(e===!0&&r===!0)throw new Y(D.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Yl(n){if(!te.isDocumentKey(n))throw new Y(D.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Xo(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":oe()}function yo(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new Y(D.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Xo(n);throw new Y(D.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xl{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new Y(D.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new Y(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Pv("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=rh((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Zo{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Xl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Y(D.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Y(D.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Xl(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Im;switch(r.type){case"firstParty":return new Tm(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new Y(D.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Jl.get(t);r&&(H("ComponentProvider","Removing Datastore"),Jl.delete(t),r.terminate())}(this),Promise.resolve()}}function Ov(n,e,t,r={}){var s;const o=(n=yo(n,Zo))._getSettings(),a=`${e}:${t}`;if(o.host!=="firestore.googleapis.com"&&o.host!==a&&Fs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let u,h;if(typeof r.mockUserToken=="string")u=r.mockUserToken,h=We.MOCK_USER;else{u=zd(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new Y(D.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new We(f)}n._authCredentials=new Em(new wu(u,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ea(this.firestore,e,this._query)}}class $t{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new jr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new $t(this.firestore,e,this._key)}}class jr extends ea{constructor(e,t,r){super(e,t,Zm(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new $t(this.firestore,null,new te(e))}withConverter(e){return new jr(this.firestore,e,this._path)}}function jv(n,e,...t){if(n=Ye(n),arguments.length===1&&(e=Iu.newId()),kv("doc","path",e),n instanceof Zo){const r=Se.fromString(e,...t);return Yl(r),new $t(n,null,new te(r))}{if(!(n instanceof $t||n instanceof jr))throw new Y(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Se.fromString(e,...t));return Yl(r),new $t(n.firestore,n instanceof jr?n.converter:null,new te(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zl{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Qu(this,"async_queue_retry"),this.Vu=()=>{const r=Gi();r&&H("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Gi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Gi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new yn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!oi(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let u=a.message||"";return a.stack&&(u=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),u}(r);throw In("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Yo.createAndSchedule(this,e,t,r,o=>this.yu(o));return this.Tu.push(s),s}fu(){this.Eu&&oe()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class sh extends Zo{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Zl,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Zl(e),this._firestoreClient=void 0,await e}}}function Dv(n,e){const t=typeof n=="object"?n:Co(),r=typeof n=="string"?n:"(default)",s=An(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Hd("firestore");o&&Ov(s,...o)}return s}function Lv(n){if(n._terminated)throw new Y(D.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Mv(n),n._firestoreClient}function Mv(n){var e,t,r;const s=n._freezeSettings(),o=function(u,h,f,y){return new Fm(u,h,f,y.host,y.ssl,y.experimentalForceLongPolling,y.experimentalAutoDetectLongPolling,rh(y.experimentalLongPollingOptions),y.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Cv(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Dr(Tt.fromBase64String(e))}catch(t){throw new Y(D.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Dr(Tt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new Y(D.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Y(D.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Y(D.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return fe(this._lat,e._lat)||fe(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vv=/^__.*__$/;class Fv{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Cn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Gr(e,this.data,t,this.fieldTransforms)}}function ch(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw oe()}}class ta{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.vu(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ta(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Qs(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(ch(this.Cu)&&Vv.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Uv{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ui(e)}Qu(e,t,r,s=!1){return new ta({Cu:e,methodName:t,qu:r,path:Be.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bv(n){const e=n._freezeSettings(),t=ui(n._databaseId);return new Uv(n._databaseId,!!e.ignoreUndefinedProperties,t)}function $v(n,e,t,r,s,o={}){const a=n.Qu(o.merge||o.mergeFields?2:0,e,t,s);fh("Data must be an object, but it was:",a,r);const u=hh(r,a);let h,f;if(o.merge)h=new gt(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const y=[];for(const b of o.mergeFields){const x=Gv(e,b,t);if(!a.contains(x))throw new Y(D.INVALID_ARGUMENT,`Field '${x}' is specified in your field mask but missing from your input data.`);Wv(y,x)||y.push(x)}h=new gt(y),f=a.fieldTransforms.filter(b=>h.covers(b.field))}else h=null,f=a.fieldTransforms;return new Fv(new pt(u),h,f)}function uh(n,e){if(dh(n=Ye(n)))return fh("Unsupported field value:",e,n),hh(n,e);if(n instanceof oh)return function(r,s){if(!ch(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const u of r){let h=uh(u,s.Lu(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=Ye(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return cy(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=De.fromDate(r);return{timestampValue:fo(s.serializer,o)}}if(r instanceof De){const o=new De(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:fo(s.serializer,o)}}if(r instanceof ah)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Dr)return{bytesValue:Ey(s.serializer,r._byteString)};if(r instanceof $t){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Wu(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof lh)return function(a,u){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(h=>{if(typeof h!="number")throw u.Bu("VectorValues must only contain numeric values.");return Wo(u.serializer,h)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Xo(r)}`)}(n,e)}function hh(n,e){const t={};return xu(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):$r(n,(r,s)=>{const o=uh(s,e.Mu(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function dh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof De||n instanceof ah||n instanceof Dr||n instanceof $t||n instanceof oh||n instanceof lh)}function fh(n,e,t){if(!dh(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Xo(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Gv(n,e,t){if((e=Ye(e))instanceof ih)return e._internalPath;if(typeof e=="string")return Hv(n,e);throw Qs("Field path arguments must be of type string or ",n,!1,void 0,t)}const qv=new RegExp("[~\\*/\\[\\]]");function Hv(n,e,t){if(e.search(qv)>=0)throw Qs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ih(...e.split("."))._internalPath}catch{throw Qs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Qs(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new Y(D.INVALID_ARGUMENT,u+n+h)}function Wv(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zv(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}function Kv(n,e,t){n=yo(n,$t);const r=yo(n.firestore,sh),s=zv(n.converter,e,t);return Qv(r,[$v(Bv(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Bt.none())])}function Qv(n,e){return function(r,s){const o=new yn;return r.asyncQueue.enqueueAndForget(async()=>Ev(await Nv(r),s,o)),o.promise}(Lv(n),e)}(function(e,t=!0){(function(s){Yn=s})(Kn),bt(new yt("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new sh(new bm(r.getProvider("auth-internal")),new Cm(r.getProvider("app-check-internal")),function(f,y){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new Y(D.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $s(f.options.projectId,y)}(a,s),a);return o=Object.assign({useFetchStreams:t},o),u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),it(Sl,"4.7.3",e),it(Sl,"4.7.3","esm2017")})();const ph="@firebase/installations",na="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh=1e4,mh=`w:${na}`,yh="FIS_v2",Jv="https://firebaseinstallations.googleapis.com/v1",Yv=60*60*1e3,Xv="installations",Zv="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},bn=new Tn(Xv,Zv,e_);function vh(n){return n instanceof vt&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _h({projectId:n}){return`${Jv}/projects/${n}/installations`}function wh(n){return{token:n.token,requestStatus:2,expiresIn:n_(n.expiresIn),creationTime:Date.now()}}async function Ih(n,e){const r=(await e.json()).error;return bn.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Eh({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function t_(n,{refreshToken:e}){const t=Eh(n);return t.append("Authorization",r_(e)),t}async function bh(n){const e=await n();return e.status>=500&&e.status<600?n():e}function n_(n){return Number(n.replace("s","000"))}function r_(n){return`${yh} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function s_({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=_h(n),s=Eh(n),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={fid:t,authVersion:yh,appId:n.appId,sdkVersion:mh},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await bh(()=>fetch(r,u));if(h.ok){const f=await h.json();return{fid:f.fid||t,registrationStatus:2,refreshToken:f.refreshToken,authToken:wh(f.authToken)}}else throw await Ih("Create Installation",h)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xh(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o_=/^[cdef][\w-]{21}$/,vo="";function a_(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=l_(n);return o_.test(t)?t:vo}catch{return vo}}function l_(n){return i_(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pi(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=new Map;function Ah(n,e){const t=pi(n);Ch(t,e),c_(t,e)}function Ch(n,e){const t=Th.get(n);if(t)for(const r of t)r(e)}function c_(n,e){const t=u_();t&&t.postMessage({key:n,fid:e}),h_()}let mn=null;function u_(){return!mn&&"BroadcastChannel"in self&&(mn=new BroadcastChannel("[Firebase] FID Change"),mn.onmessage=n=>{Ch(n.data.key,n.data.fid)}),mn}function h_(){Th.size===0&&mn&&(mn.close(),mn=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const d_="firebase-installations-database",f_=1,xn="firebase-installations-store";let Hi=null;function ra(){return Hi||(Hi=Nc(d_,f_,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(xn)}}})),Hi}async function Js(n,e){const t=pi(n),s=(await ra()).transaction(xn,"readwrite"),o=s.objectStore(xn),a=await o.get(t);return await o.put(e,t),await s.done,(!a||a.fid!==e.fid)&&Ah(n,e.fid),e}async function Sh(n){const e=pi(n),r=(await ra()).transaction(xn,"readwrite");await r.objectStore(xn).delete(e),await r.done}async function gi(n,e){const t=pi(n),s=(await ra()).transaction(xn,"readwrite"),o=s.objectStore(xn),a=await o.get(t),u=e(a);return u===void 0?await o.delete(t):await o.put(u,t),await s.done,u&&(!a||a.fid!==u.fid)&&Ah(n,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sa(n){let e;const t=await gi(n.appConfig,r=>{const s=p_(r),o=g_(n,s);return e=o.registrationPromise,o.installationEntry});return t.fid===vo?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function p_(n){const e=n||{fid:a_(),registrationStatus:0};return Rh(e)}function g_(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(bn.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=m_(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:y_(n)}:{installationEntry:e}}async function m_(n,e){try{const t=await s_(n,e);return Js(n.appConfig,t)}catch(t){throw vh(t)&&t.customData.serverCode===409?await Sh(n.appConfig):await Js(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function y_(n){let e=await ec(n.appConfig);for(;e.registrationStatus===1;)await xh(100),e=await ec(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await sa(n);return r||t}return e}function ec(n){return gi(n,e=>{if(!e)throw bn.create("installation-not-found");return Rh(e)})}function Rh(n){return v_(n)?{fid:n.fid,registrationStatus:0}:n}function v_(n){return n.registrationStatus===1&&n.registrationTime+gh<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function __({appConfig:n,heartbeatServiceProvider:e},t){const r=w_(n,t),s=t_(n,t),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={installation:{sdkVersion:mh,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await bh(()=>fetch(r,u));if(h.ok){const f=await h.json();return wh(f)}else throw await Ih("Generate Auth Token",h)}function w_(n,{fid:e}){return`${_h(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ia(n,e=!1){let t;const r=await gi(n.appConfig,o=>{if(!Nh(o))throw bn.create("not-registered");const a=o.authToken;if(!e&&b_(a))return o;if(a.requestStatus===1)return t=I_(n,e),o;{if(!navigator.onLine)throw bn.create("app-offline");const u=T_(o);return t=E_(n,u),u}});return t?await t:r.authToken}async function I_(n,e){let t=await tc(n.appConfig);for(;t.authToken.requestStatus===1;)await xh(100),t=await tc(n.appConfig);const r=t.authToken;return r.requestStatus===0?ia(n,e):r}function tc(n){return gi(n,e=>{if(!Nh(e))throw bn.create("not-registered");const t=e.authToken;return A_(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function E_(n,e){try{const t=await __(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await Js(n.appConfig,r),t}catch(t){if(vh(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Sh(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Js(n.appConfig,r)}throw t}}function Nh(n){return n!==void 0&&n.registrationStatus===2}function b_(n){return n.requestStatus===2&&!x_(n)}function x_(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Yv}function T_(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function A_(n){return n.requestStatus===1&&n.requestTime+gh<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function C_(n){const e=n,{installationEntry:t,registrationPromise:r}=await sa(e);return r?r.catch(console.error):ia(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S_(n,e=!1){const t=n;return await R_(t),(await ia(t,e)).token}async function R_(n){const{registrationPromise:e}=await sa(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(n){if(!n||!n.options)throw Wi("App Configuration");if(!n.name)throw Wi("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Wi(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Wi(n){return bn.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh="installations",k_="installations-internal",P_=n=>{const e=n.getProvider("app").getImmediate(),t=N_(e),r=An(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},O_=n=>{const e=n.getProvider("app").getImmediate(),t=An(e,kh).getImmediate();return{getId:()=>C_(t),getToken:s=>S_(t,s)}};function j_(){bt(new yt(kh,P_,"PUBLIC")),bt(new yt(k_,O_,"PRIVATE"))}j_();it(ph,na);it(ph,na,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ys="analytics",D_="firebase_id",L_="origin",M_=60*1e3,V_="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",oa="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je=new ni("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F_={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},nt=new Tn("analytics","Analytics",F_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U_(n){if(!n.startsWith(oa)){const e=nt.create("invalid-gtag-resource",{gtagURL:n});return Je.warn(e.message),""}return n}function Ph(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function B_(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function $_(n,e){const t=B_("firebase-js-sdk-policy",{createScriptURL:U_}),r=document.createElement("script"),s=`${oa}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function G_(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function q_(n,e,t,r,s,o){const a=r[s];try{if(a)await e[a];else{const h=(await Ph(t)).find(f=>f.measurementId===s);h&&await e[h.appId]}}catch(u){Je.error(u)}n("config",s,o)}async function H_(n,e,t,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const u=await Ph(t);for(const h of a){const f=u.find(b=>b.measurementId===h),y=f&&e[f.appId];if(y)o.push(y);else{o=[];break}}}o.length===0&&(o=Object.values(e)),await Promise.all(o),n("event",r,s||{})}catch(o){Je.error(o)}}function W_(n,e,t,r){async function s(o,...a){try{if(o==="event"){const[u,h]=a;await H_(n,e,t,u,h)}else if(o==="config"){const[u,h]=a;await q_(n,e,t,r,u,h)}else if(o==="consent"){const[u,h]=a;n("consent",u,h)}else if(o==="get"){const[u,h,f]=a;n("get",u,h,f)}else if(o==="set"){const[u]=a;n("set",u)}else n(o,...a)}catch(u){Je.error(u)}}return s}function z_(n,e,t,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=W_(o,n,e,t),{gtagCore:o,wrappedGtag:window[s]}}function K_(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(oa)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q_=30,J_=1e3;class Y_{constructor(e={},t=J_){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Oh=new Y_;function X_(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Z_(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:X_(r)},o=V_.replace("{app-id}",t),a=await fetch(o,s);if(a.status!==200&&a.status!==304){let u="";try{const h=await a.json();!((e=h.error)===null||e===void 0)&&e.message&&(u=h.error.message)}catch{}throw nt.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function ew(n,e=Oh,t){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw nt.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw nt.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new rw;return setTimeout(async()=>{u.abort()},M_),jh({appId:r,apiKey:s,measurementId:o},a,u,e)}async function jh(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Oh){var o;const{appId:a,measurementId:u}=n;try{await tw(r,e)}catch(h){if(u)return Je.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:a,measurementId:u};throw h}try{const h=await Z_(n);return s.deleteThrottleMetadata(a),h}catch(h){const f=h;if(!nw(f)){if(s.deleteThrottleMetadata(a),u)return Je.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${f==null?void 0:f.message}]`),{appId:a,measurementId:u};throw h}const y=Number((o=f==null?void 0:f.customData)===null||o===void 0?void 0:o.httpStatus)===503?tl(t,s.intervalMillis,Q_):tl(t,s.intervalMillis),b={throttleEndTimeMillis:Date.now()+y,backoffCount:t+1};return s.setThrottleMetadata(a,b),Je.debug(`Calling attemptFetch again in ${y} millis`),jh(n,b,r,s)}}function tw(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),o=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(o),r(nt.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function nw(n){if(!(n instanceof vt)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class rw{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function sw(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const o=await e,a=Object.assign(Object.assign({},r),{send_to:o});n("event",t,a)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iw(){if(Ac())try{await Cc()}catch(n){return Je.warn(nt.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Je.warn(nt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ow(n,e,t,r,s,o,a){var u;const h=ew(n);h.then(A=>{t[A.measurementId]=A.appId,n.options.measurementId&&A.measurementId!==n.options.measurementId&&Je.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${A.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(A=>Je.error(A)),e.push(h);const f=iw().then(A=>{if(A)return r.getId()}),[y,b]=await Promise.all([h,f]);K_(o)||$_(o,y.measurementId),s("js",new Date);const x=(u=a==null?void 0:a.config)!==null&&u!==void 0?u:{};return x[L_]="firebase",x.update=!0,b!=null&&(x[D_]=b),s("config",y.measurementId,x),y.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aw{constructor(e){this.app=e}_delete(){return delete Tr[this.app.options.appId],Promise.resolve()}}let Tr={},nc=[];const rc={};let zi="dataLayer",lw="gtag",sc,Dh,ic=!1;function cw(){const n=[];if(Tc()&&n.push("This is a browser extension environment."),ef()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=nt.create("invalid-analytics-context",{errorInfo:e});Je.warn(t.message)}}function uw(n,e,t){cw();const r=n.options.appId;if(!r)throw nt.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Je.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw nt.create("no-api-key");if(Tr[r]!=null)throw nt.create("already-exists",{id:r});if(!ic){G_(zi);const{wrappedGtag:o,gtagCore:a}=z_(Tr,nc,rc,zi,lw);Dh=o,sc=a,ic=!0}return Tr[r]=ow(n,nc,rc,e,sc,zi,t),new aw(n)}function hw(n=Co()){n=Ye(n);const e=An(n,Ys);return e.isInitialized()?e.getImmediate():dw(n)}function dw(n,e={}){const t=An(n,Ys);if(t.isInitialized()){const s=t.getImmediate();if(Ar(e,t.getOptions()))return s;throw nt.create("already-initialized")}return t.initialize({options:e})}function fw(n,e,t,r){n=Ye(n),sw(Dh,Tr[n.app.options.appId],e,t,r).catch(s=>Je.error(s))}const oc="@firebase/analytics",ac="0.10.8";function pw(){bt(new yt(Ys,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return uw(r,s,t)},"PUBLIC")),bt(new yt("analytics-internal",n,"PRIVATE")),it(oc,ac),it(oc,ac,"esm2017");function n(e){try{const t=e.getProvider(Ys).getImmediate();return{logEvent:(r,s,o)=>fw(t,r,s,o)}}catch(t){throw nt.create("interop-component-reg-failed",{reason:t})}}}pw();const gw={apiKey:"AIzaSyCIqpOl5nT3VH149xISPqyLgkjyIiMWPb8",authDomain:"flinx-8a05e.firebaseapp.com",projectId:"flinx-8a05e",storageBucket:"flinx-8a05e.firebasestorage.app",messagingSenderId:"977393893446",appId:"1:977393893446:web:308db5f232f7c5558cca47",measurementId:"G-N0LW13KMNJ"},aa=kc(gw);let mw;if(typeof window<"u")try{mw=hw(aa)}catch{console.log("Analytics initialization skipped (local development)")}const Lr=ym(aa),yw=Dv(aa),la=new Mt;la.addScope("profile");la.addScope("email");la.addScope("openid");const Mr=new Lt,Lh="863917229498555";console.log("🔧 Configuring Facebook Auth Provider:");console.log("   - App ID:",Lh);console.log("   - Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler");Mr.setCustomParameters({app_id:Lh,display:"popup",auth_type:"rerequest",scope:"public_profile,email"});Mr.addScope("public_profile");Mr.addScope("email");console.log("✅ Facebook Auth Provider initialized with:");console.log("   - Public Profile scope: ✓");console.log("   - Email scope: ✓");console.log("   - Web OAuth redirect enabled: ✓");const Mh=async(n,e)=>{var a,u,h;console.log(`📝 Processing ${e} login for user:`,n.email);let t=null;e==="facebook"&&((a=n.providerData[0])!=null&&a.uid)&&(t=n.providerData[0].uid);const r={uid:n.uid,email:n.email,name:n.displayName||"User",picture:n.photoURL||null,authProvider:e,googleId:e==="google"?(u=n.providerData[0])==null?void 0:u.uid:null,facebookId:e==="facebook"?t:null,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};console.log("✅ User info extracted:",{email:r.email,name:r.name,authProvider:r.authProvider});try{const f=await n.getIdToken();localStorage.setItem("idToken",f),console.log("🔐 Firebase ID token stored for Socket.IO")}catch(f){console.error("❌ Failed to get Firebase ID token:",f)}try{const y=await fetch("https://flinxx-backend.onrender.com/api/users/save",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uid:n.uid,email:n.email,displayName:n.displayName||"User",photoURL:n.photoURL||null,authProvider:e})});if(!y.ok)throw new Error(`Failed to save user: ${y.status}`);const b=await y.json();console.log("✅ User saved to Neon PostgreSQL:",b.user),b.user&&(r.profileCompleted=b.user.profileCompleted,r.isProfileCompleted=b.user.profileCompleted,r.id=b.user.id,r.uuid=b.user.uuid,console.log("[FIREBASE] 🎯 Updated userInfo with profileCompleted:",b.user.profileCompleted)),localStorage.setItem("dbUserId",b.user.id)}catch(f){console.error("⚠️ Error saving user to backend database:",f)}try{await Kv(jv(yw,"users",n.uid),{email:n.email,displayName:n.displayName,photoURL:n.photoURL,authProvider:e,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()},{merge:!0}),console.log("✅ User saved to Firestore")}catch(f){console.error("⚠️ Error saving user to Firestore:",f)}console.log(`
🟠 [firebase] handleLoginSuccess storing to localStorage`),console.log("🟠 [firebase]   - userInfo.profileCompleted =",r.profileCompleted),console.log("🟠 [firebase]   - userInfo.isProfileCompleted =",r.isProfileCompleted);const s={id:r.id,uuid:r.uuid,uid:r.uid,name:n.displayName,email:n.email,picture:n.photoURL,googleId:e==="google"?(h=n.providerData[0])==null?void 0:h.uid:null,facebookId:e==="facebook"?t:null,profileCompleted:r.profileCompleted||!1,isProfileCompleted:r.profileCompleted||!1,authProvider:e};console.log("🟠 [firebase] userToStore object:",s),localStorage.setItem("user",JSON.stringify(s)),localStorage.setItem("authProvider",e),localStorage.setItem("userInfo",JSON.stringify(r)),console.log("🟠 [firebase] ✅ Stored to localStorage, verifying...");const o=JSON.parse(localStorage.getItem("user"));return console.log("🟠 [firebase]   - Verified profileCompleted:",o.profileCompleted),console.log("🟠 [firebase] ✅ User data stored in localStorage with profileCompleted:",r.profileCompleted||!1),r},lc=async()=>{var n;try{console.log("📱 Starting Facebook login via popup...");const e=await Tg(Lr,Mr);console.log("✅ Facebook popup login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;let r="facebook";return t==="facebook.com"&&(r="facebook"),Mh(e.user,r)}catch(e){console.warn("⚠️ Facebook popup login failed, trying redirect method:",e.code);try{return console.log("📱 Starting Facebook login via redirect..."),await kg(Lr,Mr),null}catch(t){throw console.error("❌ Facebook login failed:",t),t}}},vw=async()=>{var n;try{const e=await Og(Lr);if(e!=null&&e.user){console.log("✅ Redirect login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;console.log("Provider:",t);let r="unknown";return t==="google.com"?r="google":t==="facebook.com"&&(r="facebook"),Mh(e.user,r)}}catch(e){console.error("Redirect result error:",e),e.code==="auth/account-exists-with-different-credential"?console.error("Account exists with different credential"):e.code==="auth/auth-domain-config-required"&&console.error("Auth domain config required")}return null},mi="https://flinxx-backend.onrender.com",Vh=()=>localStorage.getItem("token"),Fh=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getFriends blocked – invalid UUID:",n),[];const e=await fetch(`${mi}/api/friends?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});return e.ok?await e.json():[]}catch(e){return console.error("Error fetching friends:",e),[]}},_w=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getNotifications blocked – invalid UUID:",n),[];console.log("📬 Fetching notifications for user");const e=await fetch(`${mi}/api/notifications?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});if(!e.ok)return[];const t=await e.json();return console.log("✅ Notifications loaded:",t.length,"items"),t}catch(e){return console.error("❌ Error fetching notifications:",e),[]}},Ki=async n=>{if(!n||typeof n!="string"||n.length!==36)return 0;try{const e=await fetch(`${mi}/api/messages/unread-count/${n}`,{method:"GET",headers:{"Content-Type":"application/json"}});return e.ok?(await e.json()).unreadCount??0:0}catch{return 0}},Xs=async(n,e,t)=>{try{const r=localStorage.getItem("token");if(!r)return console.warn("No auth token in markMessagesAsRead"),{success:!1};let s=null;if(typeof e=="string"&&e.includes("_"))s=e;else{const u=e,h=n;if(!h||h.length!==36)return console.error("❌ Invalid UUID in markMessagesAsRead:",h),{success:!1};if(!u||u.length!==36)return console.error("❌ Invalid other user UUID in markMessagesAsRead:",u),{success:!1};s=h<u?`${h}_${u}`:`${u}_${h}`}const o=await fetch(`${mi}/api/messages/mark-read/${encodeURIComponent(s)}`,{method:"PUT",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!o.ok)return console.error("❌ Mark read API error:",o.status,o.statusText),{success:!1};const a=await o.json();return console.log("✅ Messages marked as read",a),a}catch(r){return console.error("Error marking messages as read:",r),{success:!1}}},St=C.createContext(),ww=()=>{const n=C.useContext(St);if(!n)throw new Error("useAuth must be used within AuthProvider");return n},Iw=({children:n})=>{const[e,t]=C.useState(null),[r,s]=C.useState(!0),[o,a]=C.useState(!1),[u,h]=C.useState(!1),[f,y]=C.useState([]),b=async()=>{if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.warn("⏸ refreshNotifications skipped: user UUID not ready");return}const k=await _w(e.uuid);y(Array.isArray(k)?k:[])};C.useEffect(()=>{if(r===!0){console.log("⏸ Skipping notifications fetch – authLoading is true");return}if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.log("⏸ Skipping notifications fetch – user UUID not ready");return}console.log("✅ User ready, fetching notifications:",e.uuid.substring(0,8)+"..."),b();const k=setInterval(b,5e3);return()=>{clearInterval(k)}},[r,e==null?void 0:e.uuid]),C.useEffect(()=>{(async()=>{var S,N,$;try{console.log(`

🔵 [AuthContext] ═══════════════════════════════════════════`),console.log("🔵 [AuthContext] INITIALIZATION STARTED"),console.log("🔵 [AuthContext] ═══════════════════════════════════════════");const G=localStorage.getItem("user");if(G)try{const M=JSON.parse(G);(!M.uuid||typeof M.uuid=="string"&&M.uuid.length!==36)&&(console.warn("🧹 [AuthContext] Removing invalid user from localStorage:",{uuid:M.uuid,id:M.id,email:M.email}),localStorage.removeItem("user"),localStorage.removeItem("token"))}catch{console.warn("🧹 [AuthContext] Invalid JSON in localStorage user, removing"),localStorage.removeItem("user")}const U=localStorage.getItem("token"),B=localStorage.getItem("user");if(console.log("🔵 [AuthContext] STEP 1: Check localStorage"),console.log("🔵 [AuthContext]   - token:",U?"✓ Found":"✗ Not found"),console.log("🔵 [AuthContext]   - user:",B?"✓ Found":"✗ Not found"),U&&B)try{console.log(`
🔵 [AuthContext] STEP 2: Parse localStorage user`);const M=JSON.parse(B);console.log("🔵 [AuthContext]   - Parsed user email:",M.email),console.log("🔵 [AuthContext]   - profileCompleted from localStorage:",M.profileCompleted,"(type:",typeof M.profileCompleted+")"),console.log("🔵 [AuthContext] 🔍 Attempting to restore Google OAuth user from localStorage:",M.email),console.log("🔵 [AuthContext] User data from localStorage:",{id:M.id,email:M.email,profileCompleted:M.profileCompleted,isProfileCompleted:M.isProfileCompleted});const I="https://flinxx-backend.onrender.com";console.log(`
🔵 [AuthContext] STEP 3: Validate token with backend`),console.log("🔵 [AuthContext]   - Backend URL:",I),console.log("🔵 [AuthContext]   - Making request to /api/profile...");const g=await fetch(`${I}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${U}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext]   - Response status:",g.status),g.ok){const m=await g.json();if(console.log("🔵 [AuthContext]   - Response OK, parsing data..."),console.log("🔵 [AuthContext]   - data.success:",m.success),console.log("🔵 [AuthContext]   - data.user available:",!!m.user),m.success&&m.user){console.log("🔵 [AuthContext] ✅ Token validated, user restored from backend"),console.log("🔵 [AuthContext] Backend user data:",{id:m.user.id,email:m.user.email,profileCompleted:m.user.profileCompleted,birthday:m.user.birthday,gender:m.user.gender});const v={uuid:m.user.uuid,name:m.user.name||"User",email:m.user.email,picture:m.user.picture,profileCompleted:m.user.profileCompleted||!1};if(!v.uuid||typeof v.uuid!="string"||v.uuid.length!==36){console.error("❌ INVALID UUID FROM BACKEND:",v.uuid),console.error("   Expected 36-char UUID, got:",((S=v.uuid)==null?void 0:S.length)||"undefined"),s(!1);return}console.log("🔵 [AuthContext] Setting user state with UUID-only:",{uuid:v.uuid.substring(0,8)+"...",email:v.email}),t(v),localStorage.setItem("user",JSON.stringify(v)),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - UUID-only user set");return}else console.log("🔵 [AuthContext] ⚠️  Response OK but data.success or data.user missing")}else{console.log("🔵 [AuthContext] ⚠️ Token validation response not OK:",g.status);const m=await g.text();console.log("🔵 [AuthContext] Error response:",m)}}catch(M){console.error("🔵 [AuthContext] ❌ Error validating token:",M)}else console.log(`
🔵 [AuthContext] STEP 2: Skip token validation (missing token or user)`),console.log("🔵 [AuthContext]   - Skipping /api/profile call");if(B)try{console.log(`
🔵 [AuthContext] STEP 3: Restore from localStorage (no token validation)`),console.log("🔵 [AuthContext] Raw stored user string:",B);const M=JSON.parse(B);if(console.log("🔵 [AuthContext] Parsed user object:",M),console.log("🔵 [AuthContext] User keys:",Object.keys(M)),console.log("🔵 [AuthContext] user.uuid value:",M.uuid),console.log("🔵 [AuthContext] user.uuid type:",typeof M.uuid),console.log("🔵 [AuthContext] user.uuid length:",(N=M.uuid)==null?void 0:N.length),!M.uuid||typeof M.uuid!="string"||M.uuid.length!==36){console.warn("🧹 [AuthContext] Invalid UUID in localStorage, removing:",($=M.uuid)==null?void 0:$.length),localStorage.removeItem("user"),localStorage.removeItem("token"),s(!1);return}console.log("🔵 [AuthContext]   - Email:",M.email),console.log("🔵 [AuthContext]   - UUID:",M.uuid.substring(0,8)+"..."),console.log("🔵 [AuthContext] ✅ User loaded from localStorage (UUID valid):",M.email),t(M),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - Returning from localStorage fallback path");return}catch(M){console.error("[AuthContext] Error parsing saved user:",M)}return console.log(`
🔵 [AuthContext] STEP 3: No stored token or user, checking Firebase...`),sg(Lr,async M=>{var I,g;if(console.log(`
🔵 [AuthContext] Firebase onAuthStateChanged fired`),console.log("🔵 [AuthContext]   - firebaseUser:",M?M.email:"null"),M){const m=((I=M.providerData[0])==null?void 0:I.providerId)||"unknown";console.log("🔵 [AuthContext] User authenticated via Firebase"),console.log("🔵 [AuthContext]   - Email:",M.email),console.log("🔵 [AuthContext]   - Provider:",m);try{console.log("🔵 [AuthContext] Getting Firebase ID token...");const w=await M.getIdToken();console.log("🔵 [AuthContext] ✓ ID token obtained"),localStorage.setItem("idToken",w),console.log("🔐 Firebase ID token stored for Socket.IO");const E="https://flinxx-backend.onrender.com";console.log("🔵 [AuthContext] Calling /api/profile with ID token...");const _=await fetch(`${E}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${w}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext] /api/profile response status:",_.status),_.ok){const re=await _.json();if(console.log("🔵 [AuthContext] /api/profile response OK"),console.log("🔵 [AuthContext]   - success:",re.success),console.log("🔵 [AuthContext]   - user.profileCompleted:",(g=re.user)==null?void 0:g.profileCompleted),re.success&&re.user){console.log("🔵 [AuthContext] ✅ Fetched full user profile from database:",{email:re.user.email,profileCompleted:re.user.profileCompleted}),console.log("🔵 [AuthContext] Setting user state with profileCompleted:",re.user.profileCompleted);const $e={...re.user,publicId:re.user.public_id||re.user.publicId,uuid:re.user.uuid};$e.uuid||console.error("❌ UUID missing from backend user object"),t($e),a(!0),s(!1);return}}else console.log("🔵 [AuthContext] ⚠️ /api/profile response not OK:",_.status)}catch(w){console.warn("[AuthContext] ⚠️ Failed to fetch profile from database:",w)}const v={uid:M.uid,email:M.email,displayName:M.displayName,photoURL:M.photoURL,publicId:M.uid,authProvider:m,profileCompleted:!1};console.log("[AuthContext] Using fallback userInfo (database fetch failed):",v.email),console.log("[AuthContext] ⚠️ WARNING: profileCompleted not loaded from database, defaulting to false"),t(v),a(!0),localStorage.setItem("userInfo",JSON.stringify(v)),localStorage.setItem("authProvider",m)}else{console.log("🔵 [AuthContext] Firebase user is null/logged out");const m=localStorage.getItem("authToken"),v=localStorage.getItem("authProvider");if(console.log("🔵 [AuthContext]   - authToken:",m?"Found":"Not found"),console.log("🔵 [AuthContext]   - authProvider:",v),m&&v==="guest"){const w=JSON.parse(localStorage.getItem("userInfo")||"{}");!w.publicId&&w.public_id&&(w.publicId=w.public_id),console.log("🔵 [AuthContext] Restoring guest login"),t(w),a(!0)}else console.log("🔵 [AuthContext] ❌ No authentication found, user will be redirected to login"),t(null),a(!1)}console.log("🔵 [AuthContext] ═══════════════════════════════════════════"),console.log("🔵 [AuthContext] INITIALIZATION COMPLETE - Setting isLoading=false"),console.log(`🔵 [AuthContext] ═══════════════════════════════════════════
`),s(!1)})}catch(G){console.error("[AuthContext] Error initializing auth:",G),s(!1)}})()},[]);const x=()=>{t(null),a(!1),localStorage.removeItem("authToken"),localStorage.removeItem("userInfo"),localStorage.removeItem("authProvider"),localStorage.removeItem("token"),localStorage.removeItem("user")},A=(k,S)=>{var $,G;console.log("[AuthContext] ⚠️ setAuthToken called with userData:",{email:S==null?void 0:S.email,has_uuid:!!(S!=null&&S.uuid),uuid:S==null?void 0:S.uuid,uuid_length:($=S==null?void 0:S.uuid)==null?void 0:$.length,all_keys:Object.keys(S||{})});const N={uuid:S==null?void 0:S.uuid,name:(S==null?void 0:S.name)||"User",email:S==null?void 0:S.email,picture:S==null?void 0:S.picture,profileCompleted:(S==null?void 0:S.profileCompleted)||!1};if(!N.uuid||typeof N.uuid!="string"||N.uuid.length!==36){console.error("❌ Invalid or missing UUID in setAuthToken:",{uuid_received:S==null?void 0:S.uuid,uuid_type:typeof(S==null?void 0:S.uuid),uuid_length:(G=S==null?void 0:S.uuid)==null?void 0:G.length});return}console.log("[AuthContext] ✅ setAuthToken storing user with UUID:",N.uuid.substring(0,8)+"..."),localStorage.setItem("token",k),localStorage.setItem("user",JSON.stringify(N)),localStorage.setItem("authProvider","google"),t(N),a(!0)};return l.jsx(St.Provider,{value:{user:e,isAuthenticated:o,isLoading:r,logout:x,authPending:u,setAuthPending:h,setAuthToken:A,notifications:f,refreshNotifications:b},children:n})},ca=C.createContext(),Ew=({children:n})=>{const[e,t]=C.useState({}),r=u=>{t(h=>({...h,[u]:!0}))},s=u=>{t(h=>{const f={...h};return delete f[u],f})},o=Object.keys(e).length,a={unreadMessages:e,setUnreadMessages:t,markAsUnread:r,markAsRead:s,unreadCount:o};return l.jsx(ca.Provider,{value:a,children:n})},Ct=Object.create(null);Ct.open="0";Ct.close="1";Ct.ping="2";Ct.pong="3";Ct.message="4";Ct.upgrade="5";Ct.noop="6";const Cs=Object.create(null);Object.keys(Ct).forEach(n=>{Cs[Ct[n]]=n});const _o={type:"error",data:"parser error"},Uh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Bh=typeof ArrayBuffer=="function",$h=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,ua=({type:n,data:e},t,r)=>Uh&&e instanceof Blob?t?r(e):cc(e,r):Bh&&(e instanceof ArrayBuffer||$h(e))?t?r(e):cc(new Blob([e]),r):r(Ct[n]+(e||"")),cc=(n,e)=>{const t=new FileReader;return t.onload=function(){const r=t.result.split(",")[1];e("b"+(r||""))},t.readAsDataURL(n)};function uc(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let Qi;function bw(n,e){if(Uh&&n.data instanceof Blob)return n.data.arrayBuffer().then(uc).then(e);if(Bh&&(n.data instanceof ArrayBuffer||$h(n.data)))return e(uc(n.data));ua(n,!1,t=>{Qi||(Qi=new TextEncoder),e(Qi.encode(t))})}const hc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_r=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<hc.length;n++)_r[hc.charCodeAt(n)]=n;const xw=n=>{let e=n.length*.75,t=n.length,r,s=0,o,a,u,h;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const f=new ArrayBuffer(e),y=new Uint8Array(f);for(r=0;r<t;r+=4)o=_r[n.charCodeAt(r)],a=_r[n.charCodeAt(r+1)],u=_r[n.charCodeAt(r+2)],h=_r[n.charCodeAt(r+3)],y[s++]=o<<2|a>>4,y[s++]=(a&15)<<4|u>>2,y[s++]=(u&3)<<6|h&63;return f},Tw=typeof ArrayBuffer=="function",ha=(n,e)=>{if(typeof n!="string")return{type:"message",data:Gh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Aw(n.substring(1),e)}:Cs[t]?n.length>1?{type:Cs[t],data:n.substring(1)}:{type:Cs[t]}:_o},Aw=(n,e)=>{if(Tw){const t=xw(n);return Gh(t,e)}else return{base64:!0,data:n}},Gh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},qh="",Cw=(n,e)=>{const t=n.length,r=new Array(t);let s=0;n.forEach((o,a)=>{ua(o,!1,u=>{r[a]=u,++s===t&&e(r.join(qh))})})},Sw=(n,e)=>{const t=n.split(qh),r=[];for(let s=0;s<t.length;s++){const o=ha(t[s],e);if(r.push(o),o.type==="error")break}return r};function Rw(){return new TransformStream({transform(n,e){bw(n,t=>{const r=t.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const o=new DataView(s.buffer);o.setUint8(0,126),o.setUint16(1,r)}else{s=new Uint8Array(9);const o=new DataView(s.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(r))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let Ji;function vs(n){return n.reduce((e,t)=>e+t.length,0)}function _s(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)t[s]=n[0][r++],r===n[0].length&&(n.shift(),r=0);return n.length&&r<n[0].length&&(n[0]=n[0].slice(r)),t}function Nw(n,e){Ji||(Ji=new TextDecoder);const t=[];let r=0,s=-1,o=!1;return new TransformStream({transform(a,u){for(t.push(a);;){if(r===0){if(vs(t)<1)break;const h=_s(t,1);o=(h[0]&128)===128,s=h[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(vs(t)<2)break;const h=_s(t,2);s=new DataView(h.buffer,h.byteOffset,h.length).getUint16(0),r=3}else if(r===2){if(vs(t)<8)break;const h=_s(t,8),f=new DataView(h.buffer,h.byteOffset,h.length),y=f.getUint32(0);if(y>Math.pow(2,21)-1){u.enqueue(_o);break}s=y*Math.pow(2,32)+f.getUint32(4),r=3}else{if(vs(t)<s)break;const h=_s(t,s);u.enqueue(ha(o?h:Ji.decode(h),e)),r=0}if(s===0||s>n){u.enqueue(_o);break}}}})}const Hh=4;function Re(n){if(n)return kw(n)}function kw(n){for(var e in Re.prototype)n[e]=Re.prototype[e];return n}Re.prototype.on=Re.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Re.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Re.prototype.off=Re.prototype.removeListener=Re.prototype.removeAllListeners=Re.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var r,s=0;s<t.length;s++)if(r=t[s],r===e||r.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Re.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(t){t=t.slice(0);for(var r=0,s=t.length;r<s;++r)t[r].apply(this,e)}return this};Re.prototype.emitReserved=Re.prototype.emit;Re.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Re.prototype.hasListeners=function(n){return!!this.listeners(n).length};const yi=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),st=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Pw="arraybuffer";function Wh(n,...e){return e.reduce((t,r)=>(n.hasOwnProperty(r)&&(t[r]=n[r]),t),{})}const Ow=st.setTimeout,jw=st.clearTimeout;function vi(n,e){e.useNativeTimers?(n.setTimeoutFn=Ow.bind(st),n.clearTimeoutFn=jw.bind(st)):(n.setTimeoutFn=st.setTimeout.bind(st),n.clearTimeoutFn=st.clearTimeout.bind(st))}const Dw=1.33;function Lw(n){return typeof n=="string"?Mw(n):Math.ceil((n.byteLength||n.size)*Dw)}function Mw(n){let e=0,t=0;for(let r=0,s=n.length;r<s;r++)e=n.charCodeAt(r),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(r++,t+=4);return t}function zh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Vw(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Fw(n){let e={},t=n.split("&");for(let r=0,s=t.length;r<s;r++){let o=t[r].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class Uw extends Error{constructor(e,t,r){super(e),this.description=t,this.context=r,this.type="TransportError"}}class da extends Re{constructor(e){super(),this.writable=!1,vi(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,r){return super.emitReserved("error",new Uw(e,t,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=ha(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&+(this.opts.port!==443)||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Vw(e);return t.length?"?"+t:""}}class Bw extends da{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||t()})),this.writable||(r++,this.once("drain",function(){--r||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Sw(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Cw(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=zh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Kh=!1;try{Kh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const $w=Kh;function Gw(){}class qw extends Bw{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let r=location.port;r||(r=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,t){const r=this.request({method:"POST",data:e});r.on("success",t),r.on("error",(s,o)=>{this.onError("xhr post error",s,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,r)=>{this.onError("xhr poll error",t,r)}),this.pollXhr=e}}let Bn=class Ss extends Re{constructor(e,t,r){super(),this.createRequest=e,vi(this,r),this._opts=r,this._method=r.method||"GET",this._uri=t,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const t=Wh(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(t);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ss.requestsCount++,Ss.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Gw,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ss.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};Bn.requestsCount=0;Bn.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",dc);else if(typeof addEventListener=="function"){const n="onpagehide"in st?"pagehide":"unload";addEventListener(n,dc,!1)}}function dc(){for(let n in Bn.requests)Bn.requests.hasOwnProperty(n)&&Bn.requests[n].abort()}const Hw=function(){const n=Qh({xdomain:!1});return n&&n.responseType!==null}();class Ww extends qw{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Hw&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Bn(Qh,this.uri(),e)}}function Qh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||$w))return new XMLHttpRequest}catch{}if(!e)try{return new st[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Jh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class zw extends da{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,r=Jh?{}:Wh(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;ua(r,this.supportsBinary,o=>{try{this.doWrite(r,o)}catch{}s&&yi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=zh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Yi=st.WebSocket||st.MozWebSocket;class Kw extends zw{createSocket(e,t,r){return Jh?new Yi(e,t,r):t?new Yi(e,t):new Yi(e)}doWrite(e,t){this.ws.send(t)}}class Qw extends da{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Nw(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(t).getReader(),s=Rw();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const o=()=>{r.read().then(({done:u,value:h})=>{u||(this.onPacket(h),o())}).catch(u=>{})};o();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;this._writer.write(r).then(()=>{s&&yi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Jw={websocket:Kw,webtransport:Qw,polling:Ww},Yw=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Xw=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function wo(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),r=n.indexOf("]");t!=-1&&r!=-1&&(n=n.substring(0,t)+n.substring(t,r).replace(/:/g,";")+n.substring(r,n.length));let s=Yw.exec(n||""),o={},a=14;for(;a--;)o[Xw[a]]=s[a]||"";return t!=-1&&r!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Zw(o,o.path),o.queryKey=eI(o,o.query),o}function Zw(n,e){const t=/\/{2,9}/g,r=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function eI(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,o){s&&(t[s]=o)}),t}const Io=typeof addEventListener=="function"&&typeof removeEventListener=="function",Rs=[];Io&&addEventListener("offline",()=>{Rs.forEach(n=>n())},!1);class Zt extends Re{constructor(e,t){if(super(),this.binaryType=Pw,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const r=wo(e);t.hostname=r.host,t.secure=r.protocol==="https"||r.protocol==="wss",t.port=r.port,r.query&&(t.query=r.query)}else t.host&&(t.hostname=wo(t.host).host);vi(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Fw(this.opts.query)),Io&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Rs.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Hh,t.transport=e,this.id&&(t.sid=this.id);const r=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Zt.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Zt.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(t+=Lw(s)),r>0&&t>this._maxPayload)return this.writeBuffer.slice(0,r);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,yi(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,r){return this._sendPacket("message",e,t,r),this}send(e,t,r){return this._sendPacket("message",e,t,r),this}_sendPacket(e,t,r,s){if(typeof t=="function"&&(s=t,t=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const o={type:e,data:t,options:r};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},r=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(Zt.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Io&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Rs.indexOf(this._offlineEventListener);r!==-1&&Rs.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Zt.protocol=Hh;class tI extends Zt{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),r=!1;Zt.priorWebsocketSuccess=!1;const s=()=>{r||(t.send([{type:"ping",data:"probe"}]),t.once("packet",b=>{if(!r)if(b.type==="pong"&&b.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Zt.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(y(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const x=new Error("probe error");x.transport=t.name,this.emitReserved("upgradeError",x)}}))};function o(){r||(r=!0,y(),t.close(),t=null)}const a=b=>{const x=new Error("probe error: "+b);x.transport=t.name,o(),this.emitReserved("upgradeError",x)};function u(){a("transport closed")}function h(){a("socket closed")}function f(b){t&&b.name!==t.name&&o()}const y=()=>{t.removeListener("open",s),t.removeListener("error",a),t.removeListener("close",u),this.off("close",h),this.off("upgrading",f)};t.once("open",s),t.once("error",a),t.once("close",u),this.once("close",h),this.once("upgrading",f),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&t.push(e[r]);return t}}let nI=class extends tI{constructor(e,t={}){const r=typeof e=="object"?e:t;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Jw[s]).filter(s=>!!s)),super(e,r)}};function rI(n,e="",t){let r=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),r=wo(n)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const o=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+o+":"+r.port+e,r.href=r.protocol+"://"+o+(t&&t.port===r.port?"":":"+r.port),r}const sI=typeof ArrayBuffer=="function",iI=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Yh=Object.prototype.toString,oI=typeof Blob=="function"||typeof Blob<"u"&&Yh.call(Blob)==="[object BlobConstructor]",aI=typeof File=="function"||typeof File<"u"&&Yh.call(File)==="[object FileConstructor]";function fa(n){return sI&&(n instanceof ArrayBuffer||iI(n))||oI&&n instanceof Blob||aI&&n instanceof File}function Ns(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,r=n.length;t<r;t++)if(Ns(n[t]))return!0;return!1}if(fa(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Ns(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Ns(n[t]))return!0;return!1}function lI(n){const e=[],t=n.data,r=n;return r.data=Eo(t,e),r.attachments=e.length,{packet:r,buffers:e}}function Eo(n,e){if(!n)return n;if(fa(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let r=0;r<n.length;r++)t[r]=Eo(n[r],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=Eo(n[r],e));return t}return n}function cI(n,e){return n.data=bo(n.data,e),delete n.attachments,n}function bo(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=bo(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=bo(n[t],e));return n}const uI=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],hI=5;var se;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(se||(se={}));class dI{constructor(e){this.replacer=e}encode(e){return(e.type===se.EVENT||e.type===se.ACK)&&Ns(e)?this.encodeAsBinary({type:e.type===se.EVENT?se.BINARY_EVENT:se.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===se.BINARY_EVENT||e.type===se.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=lI(e),r=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(r),s}}function fc(n){return Object.prototype.toString.call(n)==="[object Object]"}class pa extends Re{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const r=t.type===se.BINARY_EVENT;r||t.type===se.BINARY_ACK?(t.type=r?se.EVENT:se.ACK,this.reconstructor=new fI(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(fa(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const r={type:Number(e.charAt(0))};if(se[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===se.BINARY_EVENT||r.type===se.BINARY_ACK){const o=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(o,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");r.attachments=Number(a)}if(e.charAt(t+1)==="/"){const o=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););r.nsp=e.substring(o,t)}else r.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const o=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}r.id=Number(e.substring(o,t+1))}if(e.charAt(++t)){const o=this.tryParse(e.substr(t));if(pa.isPayloadValid(r.type,o))r.data=o;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case se.CONNECT:return fc(t);case se.DISCONNECT:return t===void 0;case se.CONNECT_ERROR:return typeof t=="string"||fc(t);case se.EVENT:case se.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&uI.indexOf(t[0])===-1);case se.ACK:case se.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class fI{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=cI(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const pI=Object.freeze(Object.defineProperty({__proto__:null,Decoder:pa,Encoder:dI,get PacketType(){return se},protocol:hI},Symbol.toStringTag,{value:"Module"}));function dt(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const gI=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Xh extends Re{constructor(e,t,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[dt(e,"open",this.onopen.bind(this)),dt(e,"packet",this.onpacket.bind(this)),dt(e,"error",this.onerror.bind(this)),dt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var r,s,o;if(gI.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:se.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const y=this.ids++,b=t.pop();this._registerAckCallback(y,b),a.id=y}const u=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,h=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!u||(h?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let u=0;u<this.sendBuffer.length;u++)this.sendBuffer[u].id===e&&this.sendBuffer.splice(u,1);t.call(this,new Error("operation has timed out"))},s),a=(...u)=>{this.io.clearTimeoutFn(o),t.apply(this,u)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((r,s)=>{const o=(a,u)=>a?s(a):r(u);o.withError=!0,t.push(o),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...o)=>r!==this._queue[0]?void 0:(s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...o)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:se.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case se.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case se.EVENT:case se.BINARY_EVENT:this.onevent(e);break;case se.ACK:case se.BINARY_ACK:this.onack(e);break;case se.DISCONNECT:this.ondisconnect();break;case se.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const r of t)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let r=!1;return function(...s){r||(r=!0,t.packet({type:se.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:se.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const r of t)r.apply(this,e.data)}}}function Zn(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}Zn.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};Zn.prototype.reset=function(){this.attempts=0};Zn.prototype.setMin=function(n){this.ms=n};Zn.prototype.setMax=function(n){this.max=n};Zn.prototype.setJitter=function(n){this.jitter=n};class xo extends Re{constructor(e,t){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,vi(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((r=t.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new Zn({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||pI;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new nI(this.uri,this.opts);const t=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=dt(t,"open",function(){r.onopen(),e&&e()}),o=u=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",u),e?e(u):this.maybeReconnectOnOpen()},a=dt(t,"error",o);if(this._timeout!==!1){const u=this._timeout,h=this.setTimeoutFn(()=>{s(),o(new Error("timeout")),t.close()},u);this.opts.autoUnref&&h.unref(),this.subs.push(()=>{this.clearTimeoutFn(h)})}return this.subs.push(s),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(dt(e,"ping",this.onping.bind(this)),dt(e,"data",this.ondata.bind(this)),dt(e,"error",this.onerror.bind(this)),dt(e,"close",this.onclose.bind(this)),dt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){yi(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Xh(this,e,t),this.nsps[e]=r),r}_destroy(e){const t=Object.keys(this.nsps);for(const r of t)if(this.nsps[r].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let r=0;r<t.length;r++)this.engine.write(t[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const yr={};function ks(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=rI(n,e.path||"/socket.io"),r=t.source,s=t.id,o=t.path,a=yr[s]&&o in yr[s].nsps,u=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let h;return u?h=new xo(r,e):(yr[s]||(yr[s]=new xo(r,e)),h=yr[s]),t.query&&!e.query&&(e.query=t.queryKey),h.socket(t.path,e)}Object.assign(ks,{Manager:xo,Socket:Xh,io:ks,connect:ks});const Zh="https://flinxx-backend.onrender.com";console.log("🔌 Socket.IO connecting to:",Zh);const K=ks(Zh,{reconnection:!0,reconnectionDelay:1e3,reconnectionDelayMax:5e3,reconnectionAttempts:10,transports:["websocket","polling"],secure:!1,rejectUnauthorized:!1,forceNew:!1,withCredentials:!0,upgrade:!0,rememberUpgrade:!1,multiplex:!0,timeout:6e4,extraHeaders:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"true"}});K.on("connect",()=>{console.log("✅ Socket connected successfully! ID:",K.id),console.log("📊 Transport method:",K.io.engine.transport.name)});K.on("connect_error",n=>{console.error("❌ Socket connection error:",n.message||n),console.error("📍 Error details:",n),K.io.engine.transport.name==="polling"&&console.log("🔄 Retrying with websocket...")});K.on("error",n=>{console.error("❌ Socket error:",n)});K.on("disconnect",n=>{console.log("⚠️ Socket disconnected. Reason:",n),console.log("🔄 Attempting to reconnect...")});K.on("connect_timeout",()=>{console.error("⏱️ Socket connection timeout")});const ed=C.createContext(),mI=({children:n})=>{const{user:e,isLoading:t}=ww(),[r,s]=C.useState(0);C.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;let a=!1;const u=async()=>{var y;console.log("📊 UnreadContext: Calling getUnreadCount with UUID:",((y=e.uuid)==null?void 0:y.substring(0,8))+"...");const f=await Ki(e.uuid);if(!a){const b=typeof f=="number"?f:(f==null?void 0:f.unreadCount)||0;s(b)}};u();const h=setInterval(u,5e3);return()=>{a=!0,clearInterval(h)}},[t,e==null?void 0:e.uuid]),C.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||e.uuid.length!==36)return;const a=async()=>{var f;console.log("📬 New message received, fetching updated count for UUID:",((f=e.uuid)==null?void 0:f.substring(0,8))+"...");const u=await Ki(e.uuid),h=typeof u=="number"?u:(u==null?void 0:u.unreadCount)||0;s(h)};return K.on("receive_message",a),()=>{K.off("receive_message",a)}},[t,e==null?void 0:e.uuid]);const o=async()=>{if(!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;const a=await Ki(e.uuid),u=typeof a=="number"?a:(a==null?void 0:a.unreadCount)||0;s(u)};return l.jsx(ed.Provider,{value:{unreadCount:r,setUnreadCount:s,refetchUnreadCount:o},children:n})},ga=()=>{const n=C.useContext(ed);if(!n)throw new Error("useUnread must be used within UnreadProvider");return n};class yI extends Zs.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error("Error caught by boundary:",e,t)}render(){var e;return this.state.hasError?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-4xl font-bold text-red-500 mb-4",children:"Something went wrong"}),l.jsx("p",{className:"text-gray-300 mb-8",children:(e=this.state.error)==null?void 0:e.message}),l.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white",children:"Reload Page"})]})}):this.props.children}}const vI="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjcyIiB2aWV3Qm94PSIwIDAgMjgwIDcyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8IS0tIFB1cnBsZSBSb3VuZGVkLVNxdWFyZSBJY29uIChleGFjdCBmcm9tIGJyYW5kaW5nKSAtLT4NCiAgPGc+DQogICAgPCEtLSBHcmFkaWVudCBkZWZpbml0aW9ucyAtLT4NCiAgICA8ZGVmcz4NCiAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icHVycGxlR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOUQ0RUREO3N0b3Atb3BhY2l0eToxIiAvPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3MjA5Qjc7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imdsb3dHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjAuOCIgLz4NCiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNTAwO3N0b3Atb3BhY2l0eTowLjQiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8ZmlsdGVyIGlkPSJwcmVtaXVtU2hhZG93Ij4NCiAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9IjQiIHN0ZERldmlhdGlvbj0iNiIgZmxvb2Qtb3BhY2l0eT0iMC4zNSIvPg0KICAgICAgPC9maWx0ZXI+DQogICAgPC9kZWZzPg0KICAgIA0KICAgIDwhLS0gR29sZGVuIGdsb3cvaGFsbyBiZWhpbmQgaWNvbiAtLT4NCiAgICA8Y2lyY2xlIGN4PSIzNiIgY3k9IjM2IiByPSIzNCIgZmlsbD0idXJsKCNnbG93R3JhZGllbnQpIiBvcGFjaXR5PSIwLjUiLz4NCiAgICANCiAgICA8IS0tIE1haW4gcHVycGxlIHJvdW5kZWQtc3F1YXJlIGJhY2tncm91bmQgLS0+DQogICAgPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iMTYiIGZpbGw9InVybCgjcHVycGxlR3JhZGllbnQpIiBmaWx0ZXI9InVybCgjcHJlbWl1bVNoYWRvdykiLz4NCiAgICANCiAgICA8IS0tIENhbWVyYSBib2R5ICh3aGl0ZSBvdXRsaW5lIHN0eWxlKSAtLT4NCiAgICA8cmVjdCB4PSIxNiIgeT0iMjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgcng9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41Ii8+DQogICAgDQogICAgPCEtLSBDYW1lcmEgbGVucyAoY2lyY3VsYXIpIC0tPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjMuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNSIvPg0KICAgIA0KICAgIDwhLS0gTGlnaHRuaW5nIGJvbHQgYWNjZW50ICh0b3AgcmlnaHQpIC0tPg0KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2LCAxMCkiPg0KICAgICAgPCEtLSBNYWluIGxpZ2h0bmluZyBzaGFwZSAtLT4NCiAgICAgIDxwYXRoIGQ9Ik0gNiAwIEwgMiA2IEwgNiA2IEwgMCAxNCBMIDggOCBMIDQgOCBaIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiNGRjhBMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQogICAgICA8IS0tIElubmVyIGhpZ2hsaWdodCBmb3IgZGVwdGggLS0+DQogICAgICA8cGF0aCBkPSJNIDQgMSBMIDMgNCBMIDUgNCBMIDEgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRUIzQiIgc3Ryb2tlLXdpZHRoPSIwLjgiIG9wYWNpdHk9IjAuNyIvPg0KICAgIDwvZz4NCiAgICANCiAgICA8IS0tIEdvbGRlbiBzcGFya2xlIGFjY2VudHMgLS0+DQogICAgPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMS41IiBmaWxsPSIjRkZENzAwIiBvcGFjaXR5PSIwLjkiLz4NCiAgICA8Y2lyY2xlIGN4PSI1OCIgY3k9IjE4IiByPSIxLjUiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOCIvPg0KICAgIDxjaXJjbGUgY3g9IjE2IiBjeT0iNTYiIHI9IjEiIGZpbGw9IiNGRkIzMUEiIG9wYWNpdHk9IjAuNyIvPg0KICA8L2c+DQogIA0KICA8IS0tIEZMSU5YWCBUZXh0IC0tPg0KICA8dGV4dCB4PSI4MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0idXJsKCN0ZXh0R3JhZGllbnQpIiBsZXR0ZXItc3BhY2luZz0iMSI+DQogICAgRkxJTlhYDQogIDwvdGV4dD4NCiAgDQogIDwhLS0gVGV4dCBHcmFkaWVudCAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0ZXh0R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4NCiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQjMxQTtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOEEwMDtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQo8L3N2Zz4NCg==",_I=()=>{const n=ot(),[e,t]=C.useState(!1),r=()=>{t(!0),setTimeout(()=>{n("/login",{replace:!0})},500)};return l.jsxs("div",{className:"homepage-wrapper",children:[l.jsx("header",{className:"homepage-header",children:l.jsxs("div",{className:"header-content",children:[l.jsxs("div",{className:"header-left",children:[l.jsx("img",{src:vI,alt:"Flinxx",className:"logo"}),l.jsx("span",{className:"online-status",children:"🟢 3,247 online"})]}),l.jsx("button",{onClick:r,className:"btn-start-now",children:"Start Now"})]})}),l.jsx("section",{className:"hero-section",children:l.jsxs("div",{className:"hero-content",children:[l.jsxs("h1",{className:"hero-title",children:["Meet New People",l.jsx("br",{}),"Around the World"]}),l.jsx("p",{className:"hero-subtitle",children:"Connect instantly with strangers through video chat"}),l.jsx("button",{onClick:r,disabled:e,className:"btn-hero-cta",children:e?"⟳ Loading...":"Start Video Chat"}),l.jsx("p",{className:"hero-tagline",children:"Fast, simple video chats • Real users, real time"})]})}),l.jsx("section",{className:"features-section",children:l.jsx("div",{className:"features-container",children:l.jsx("div",{className:"feature-card",children:l.jsxs("div",{className:"card-content",children:[l.jsx("div",{className:"card-icon",children:"⚡"}),l.jsxs("div",{className:"card-text",children:[l.jsx("h3",{className:"card-title",children:"Instant Connection"}),l.jsx("p",{className:"card-description",children:"Connect with random strangers in seconds. No waiting, no hassle."})]})]})})})}),l.jsxs("button",{onClick:()=>window.location.href="/contact",className:"btn-contact-us",children:[l.jsx("span",{children:"💬"}),"Contact Us"]})]})};class wI extends Error{}wI.prototype.name="InvalidTokenError";const _i="data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3c!--%20Orange%20gradient%20background%20--%3e%3crect%20width='40'%20height='40'%20rx='8'%20fill='url(%23gradient)'%20/%3e%3c!--%20Video%20camera%20icon%20--%3e%3cg%20transform='translate(8,%208)'%3e%3c!--%20Camera%20body%20--%3e%3crect%20x='1'%20y='6'%20width='16'%20height='12'%20rx='1'%20fill='white'%20stroke='white'%20stroke-width='0.5'/%3e%3c!--%20Camera%20lens%20--%3e%3ccircle%20cx='17'%20cy='12'%20r='4'%20fill='none'%20stroke='white'%20stroke-width='1'/%3e%3ccircle%20cx='17'%20cy='12'%20r='2.5'%20fill='white'%20opacity='0.8'/%3e%3c!--%20Recording%20indicator%20dot%20--%3e%3ccircle%20cx='3'%20cy='3'%20r='1.5'%20fill='%23FF4444'/%3e%3c/g%3e%3c!--%20Gradient%20definition%20--%3e%3cdefs%3e%3clinearGradient%20id='gradient'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20style='stop-color:%23FF8C42;stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:%23FF6B35;stop-opacity:1'%20/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",II="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20width='24'%20height='24'%3e%3cpath%20fill='%234285F4'%20d='M22.56%2012.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26%201.37-1.04%202.53-2.21%203.31v2.77h3.57c2.08-1.92%203.28-4.74%203.28-8.09z'/%3e%3cpath%20fill='%2334A853'%20d='M12%2023c2.97%200%205.46-.98%207.28-2.66l-3.57-2.77c-.98.66-2.23%201.06-3.71%201.06-2.86%200-5.29-1.93-6.16-4.53H2.18v2.84C3.99%2020.53%207.7%2023%2012%2023z'/%3e%3cpath%20fill='%23FBBC05'%20d='M5.84%2014.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43%208.55%201%2010.22%201%2012s.43%203.45%201.18%204.93l2.85-2.22.81-.62z'/%3e%3cpath%20fill='%23EA4335'%20d='M12%205.38c1.62%200%203.06.56%204.21%201.64l3.15-3.15C17.45%202.09%2014.97%201%2012%201%207.7%201%203.99%203.47%202.18%207.07l3.66%202.84c.87-2.6%203.3-4.53%206.16-4.53z'/%3e%3c/svg%3e",td=({onContinue:n,onCancel:e})=>{C.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow="unset"}),[]),C.useEffect(()=>{const r=s=>{s.key==="Escape"&&s.preventDefault()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[]),C.useEffect(()=>{window.history.pushState(null,"",window.location.href);const r=s=>{s.preventDefault(),window.history.pushState(null,"",window.location.href)};return window.addEventListener("popstate",r),()=>window.removeEventListener("popstate",r)},[]);const t=()=>{localStorage.setItem("termsAccepted","true"),n==null||n()};return l.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",children:l.jsxs("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-6 text-center",children:"Before you continue"}),l.jsxs("p",{className:"text-gray-700 text-center text-sm",children:["By continuing, you confirm that you are 18 years or older and agree to Flinxx's"," ",l.jsx("a",{href:"/terms-and-conditions",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/terms-and-conditions"},children:"Terms & Conditions"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"}),"."]}),l.jsx("p",{className:"text-gray-700 text-center text-sm mt-4",children:"You understand that Flinxx is a live interaction platform and you use it at your own responsibility."}),l.jsxs("div",{className:"flex gap-4 mt-6",children:[l.jsx("button",{onClick:e,className:"flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors",children:"Decline"}),l.jsx("button",{onClick:t,className:"flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors",children:"Accept & Proceed"})]})]})})},nd=()=>{try{return localStorage.getItem("termsAccepted")==="true"}catch(n){return console.error("❌ Error checking terms acceptance:",n),!1}},EI=()=>{try{localStorage.setItem("termsAccepted","true"),console.log("✅ Terms accepted and saved to localStorage")}catch(n){console.error("❌ Error saving terms acceptance:",n)}},bI=({isSigningIn:n,onShowTermsModal:e})=>{const t=()=>{console.log("🔐 Google login clicked - checking terms acceptance"),nd()?(console.log("✅ Terms already accepted - proceeding with Google login"),r()):(console.log("⚠️ Terms not accepted - showing modal first"),e("google"))},r=()=>{const s="https://flinxx-backend.onrender.com";console.log("🔗 Redirecting to Google OAuth:",`${s}/auth/google`),window.location.href=`${s}/auth/google`};return l.jsxs("button",{onClick:t,disabled:n,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${n?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-white hover:bg-gray-50 text-black shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("img",{src:II,alt:"Google",className:"w-6 h-6"}),"Continue with Google"]})},xI=()=>{const n=ot(),[e,t]=C.useState(!1),[r,s]=C.useState(null),[o,a]=C.useState(!1),[u,h]=C.useState(null);C.useEffect(()=>{(async()=>{try{const k=await vw();k&&(console.log("✅ Login successful:",k.email),n("/chat"))}catch(k){console.error("❌ Login check failed:",k)}})()},[n]);const f=A=>{console.log(`📋 Showing Terms modal for ${A}`),h(A),a(!0)},y=()=>{console.log("❌ User cancelled terms modal"),a(!1),h(null)},b=async()=>{if(console.log("✅ User accepted terms"),EI(),a(!1),u==="google"){console.log("🔐 Proceeding with Google login after terms acceptance");const A="https://flinxx-backend.onrender.com";window.location.href=`${A}/auth/google`}else if(u==="facebook"){console.log("🔐 Proceeding with Facebook login after terms acceptance");try{await lc()}catch(A){console.error("❌ Facebook login error:",A),s("Facebook login failed. Please try again.")}}h(null)},x=async()=>{if(console.log("🔐 Facebook login clicked - checking terms acceptance"),nd()){console.log("✅ Terms already accepted - proceeding with Facebook login"),t(!0),s(null);try{console.log("📱 Starting Facebook login..."),console.log("Facebook App ID:","863917229498555"),console.log("Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler"),await lc()}catch(A){console.error("❌ Facebook login error:",A),s("Facebook login failed. Please try again."),t(!1)}}else console.log("⚠️ Terms not accepted - showing modal first"),f("facebook")};return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:[l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center mb-8",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-4",children:"Welcome to Flinxx"}),l.jsx("p",{className:"text-lg text-white/80",children:"Connect with strangers instantly"}),l.jsx("p",{className:"text-sm text-white/70 mt-2",children:"Sign up to get started"})]}),r&&l.jsx("div",{className:"mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg",children:l.jsx("p",{className:"text-red-200 text-sm",children:r})}),l.jsxs("div",{className:"space-y-4",children:[e&&l.jsxs("button",{disabled:!0,className:"w-full bg-gray-400 cursor-not-allowed text-gray-700 font-bold py-3 px-6 rounded-full transition-all text-lg flex items-center justify-center gap-2",children:[l.jsx("span",{className:"animate-spin",children:"⟳"})," Signing in..."]}),l.jsx(bI,{isSigningIn:e,onShowTermsModal:f}),l.jsxs("button",{onClick:x,disabled:e,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${e?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("span",{className:"text-xl",children:"f"})," Continue with Facebook"]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsxs("p",{className:"text-xs text-white/60",children:["By signing in, you agree to our"," ",l.jsx("a",{href:"/terms",className:"text-white/80 hover:text-white underline",onClick:A=>{A.preventDefault(),window.location.href="/terms"},children:"TERMS & CONDITIONS"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-white/80 hover:text-white underline",onClick:A=>{A.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"})]})}),l.jsxs("div",{className:"mt-10 flex flex-col items-center gap-3 text-white/80 text-sm",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"⚡"}),l.jsx("p",{children:"Instant connection with strangers"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"👤"}),l.jsx("p",{children:"100% Anonymous & Safe"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🎥"}),l.jsx("p",{children:"High-quality Video Chat"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🌍"}),l.jsx("p",{children:"Connect Worldwide"})]})]})]}),o&&l.jsx(td,{onCancel:y,onContinue:b})]})},rd=C.createContext(),TI=({children:n})=>{const[e,t]=C.useState(!1),[r,s]=C.useState("solo"),o=()=>{t(!0),s("duo")},a=()=>{t(!1),s("solo")},u=h=>{console.log(`🔄 [MODE CHANGE] Switching to ${h} mode`),console.log(`   Current activeMode before: ${r}`),s(h),h==="duo"?(console.log("Opening Duo Squad modal"),t(!0)):h==="solo"&&(console.log("Closing Duo Squad modal"),t(!1)),console.log(`   activeMode will update to: ${h}`)};return l.jsx(rd.Provider,{value:{isDuoSquadOpen:e,setIsDuoSquadOpen:t,activeMode:r,setActiveMode:s,openDuoSquad:o,closeDuoSquad:a,handleModeChange:u},children:n})},sd=()=>{const n=C.useContext(rd);if(!n)throw new Error("useDuoSquad must be used within DuoSquadProvider");return n},AI=()=>{console.log(`
🧊 ═══════════════════════════════════════════════════════════════`),console.log("🧊 [ICE SERVERS CONFIGURATION]"),console.log("🧊 ═══════════════════════════════════════════════════════════════"),console.log("🧊 STUN Server:"),console.log("🧊   - stun:global.xirsys.net"),console.log("🧊     Purpose: NAT detection, find public IP"),console.log("🧊     Status: Should work on all networks"),console.log("🧊 "),console.log("🧊 TURN Servers (for relaying if P2P blocked):"),console.log("🧊   - turn:global.xirsys.net:3478?transport=udp"),console.log("🧊     Status: Blocked if ISP blocks UDP port 3478"),console.log("🧊   - turn:global.xirsys.net:3478?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TCP port 3478"),console.log("🧊   - turns:global.xirsys.net:5349?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TLS port 5349"),console.log("🧊 "),console.log("🧊 Credentials:"),console.log("🧊   - Username: nkhlydv"),console.log("🧊   - Credential: a8e244b8-cf5b-11f0-8771-0242ac140002"),console.log("🧊 "),console.log("🧊 If all TURN candidates fail with error 701:"),console.log("🧊   ✓ Configuration is CORRECT"),console.log("🧊   ✓ STUN works (can find your IP)"),console.log("🧊   ✗ ISP/Network is blocking TURN ports"),console.log("🧊   → Try VPN or different network to test"),console.log(`🧊 ═══════════════════════════════════════════════════════════════
`)},CI=()=>[{urls:["stun:global.xirsys.net"]},{urls:["turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp","turns:global.xirsys.net:5349?transport=tcp"],username:"nkhlydv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"}],SI=n=>{const e=Math.floor(n/3600),t=Math.floor(n%3600/60),r=n%60;return e>0?`${e}h ${t}m ${r}s`:t>0?`${t}m ${r}s`:`${r}s`},RI=({isOpen:n,onClose:e})=>{const[t,r]=C.useState("flex"),[s,o]=C.useState("lite");if(!n)return null;const a=[{id:"lite",name:"LITE",emoji:"✨",price:"₹69",duration:"1 Day",features:["Unlimited Filters","Gender Filter: 50/day","10 Match Preferences","Ads Enabled","No Boost"]},{id:"prime",name:"PRIME",emoji:"👑",price:"₹199",duration:"15 Days",features:["Unlimited Filters","Gender Filter: 150/day","Full Match Preferences","No Ads","2x Profile Boost","Priority Match Queue"]},{id:"ultra",name:"ULTRA",emoji:"💎",price:"₹399",duration:"30 Days",features:["Unlimited Filters","Unlimited Gender Filter","Full Match Preferences","No Ads","5x Profile Boost","Ultra Priority Queue","Ultra Badge","Double Visibility"]}],u=[{id:"blue-tick",name:"Blue Tick",emoji:"✓",price:"₹69",features:["Verification badge","Trust boost","Status indicator"]},{id:"chat-themes",name:"Chat Themes",emoji:"🎨",price:"₹49",features:["Unlock themes","Custom colors","Personal style"]},{id:"match-boost",name:"Match Boost",emoji:"⚡",price:"₹39",features:["30 min visibility boost","Increased reach","More matches"]},{id:"profile-ring",name:"Profile Ring",emoji:"💍",price:"₹79",features:["Colored profile ring","Stand out","Eye-catching design"]},{id:"profile-highlight",name:"Profile Highlight",emoji:"⭐",price:"₹99",features:["24h highlight","Top search visibility","Premium placement"]}];return a.find(h=>h.id===s),l.jsx("div",{className:"premium-overlay",onClick:e,children:l.jsxs("div",{className:"premium-box",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"close-btn",onClick:e,children:"✖"}),l.jsx("h2",{className:"premium-title",children:"Flinxx Subscriptions"}),l.jsxs("div",{className:"main-tabs-container",children:[!1,l.jsx("button",{className:`main-tab ${t==="flex"?"active":""}`,onClick:()=>r("flex"),children:"Flex Plans"})]}),!1,t==="flex"&&l.jsxs("div",{className:"tab-content",children:[l.jsx("p",{className:"flex-subtitle",children:"Choose individual features"}),l.jsx("div",{className:"flex-section flex-wrapper",children:l.jsx("div",{className:"flex-plans-box",children:l.jsx("div",{className:"flex-plans-container",children:u.map(h=>l.jsxs("div",{className:"flex-card",children:[l.jsxs("div",{className:"flex-item-header",children:[l.jsx("span",{className:"flex-emoji",children:h.emoji}),l.jsx("h4",{children:h.name})]}),l.jsx("div",{className:"flex-item-price",children:h.price}),l.jsx("ul",{className:"flex-item-features",children:h.features.map((f,y)=>l.jsxs("li",{children:[l.jsx("span",{className:"flex-check",children:"•"}),l.jsx("span",{children:f})]},y))}),l.jsx("button",{className:"flex-item-btn",children:"Add Now"})]},h.id))})})})]}),l.jsx("div",{className:"premium-footer",children:l.jsx("p",{children:"Recurring billing. Cancel anytime. No hidden charges."})})]})})},NI=({isOpen:n,onClose:e,currentGender:t="both",onOpenPremium:r})=>{const[s,o]=C.useState(t);if(!n)return null;const a=()=>{console.log("Gender filter saved:",s),e()},u=()=>{console.log("Join clicked - opening premium modal"),r(),e()};return l.jsx("div",{className:"gender-filter-overlay",onClick:e,children:l.jsxs("div",{className:"gender-filter-modal",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"gender-close-btn",onClick:e,children:"✖"}),l.jsxs("div",{className:"gender-premium-section",children:[l.jsx("div",{className:"premium-icon",children:"👑"}),l.jsxs("div",{className:"premium-content",children:[l.jsx("h3",{children:"Flinxx Prime"}),l.jsx("p",{children:"Get More Gender Filters"})]}),l.jsx("button",{className:"join-btn",onClick:u,children:"Join"})]}),l.jsxs("div",{className:"gender-section",children:[l.jsx("div",{className:"gender-icon",children:"👥"}),l.jsx("h2",{children:"Gender"}),l.jsxs("div",{className:"gender-options",children:[l.jsxs("button",{className:`gender-option ${s==="girls"?"selected":""}`,onClick:()=>o("girls"),children:[l.jsx("div",{className:"gender-emoji",children:"👧"}),l.jsx("div",{className:"gender-label",children:"Girls Only"})]}),l.jsxs("button",{className:`gender-option ${s==="guys"?"selected":""}`,onClick:()=>o("guys"),children:[l.jsx("div",{className:"gender-emoji",children:"👦"}),l.jsx("div",{className:"gender-label",children:"Guys Only"})]}),!1]})]}),l.jsxs("div",{className:"gender-footer",children:[l.jsx("button",{className:"save-btn",onClick:a,children:"Save"}),l.jsx("button",{className:"filter-btn",children:"🔽"})]})]})})},kI=({isOpen:n,onClose:e,onOpenPremium:t,onReinitializeCamera:r})=>{const s=ot(),{user:o}=C.useContext(St)||{},[a,u]=C.useState(!1),[h,f]=C.useState({id:"",name:"",email:"",picture:"",googleId:"",location:"",gender:"",birthday:"",tokens:0,gems:0}),[y,b]=C.useState(!1),[x,A]=C.useState(null),[k,S]=C.useState(!1),N=g=>{g&&(navigator.clipboard.writeText(g),S(!0),setTimeout(()=>S(!1),2e3))};C.useEffect(()=>{n&&o&&U()},[n,o]),C.useEffect(()=>{!x&&n&&$()},[n]);const $=async()=>{try{navigator.geolocation?navigator.geolocation.getCurrentPosition(async g=>{var w,E,_;const{latitude:m,longitude:v}=g.coords;try{const $e=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${m}&lon=${v}`)).json(),_t=((w=$e.address)==null?void 0:w.city)||((E=$e.address)==null?void 0:E.town)||"Unknown",Ze=((_=$e.address)==null?void 0:_.country)||"Unknown";A(`${_t}, ${Ze}`),f(rt=>({...rt,location:`${_t}, ${Ze}`}))}catch(re){console.log("Reverse geocoding error:",re)}},g=>{console.log("Geolocation error:",g),G()}):G()}catch(g){console.log("Location detection error:",g)}},G=async()=>{try{const m=await(await fetch("https://ipapi.co/json/")).json(),v=`${m.city}, ${m.country_name}`;A(v),f(w=>({...w,location:v}))}catch(g){console.log("IP API error:",g)}},U=async()=>{var g;if(o)try{f(v=>({...v,id:o.id||"",name:o.name||"User",email:o.email||"",picture:o.picture||"",googleId:o.googleId||""}));const m=localStorage.getItem("token");if(m){console.log("[ProfileModal] Fetching fresh user profile from backend");const w=await fetch("https://flinxx-backend.onrender.com/api/profile",{method:"GET",headers:{Authorization:`Bearer ${m}`,"Content-Type":"application/json"}});if(w.ok){const E=await w.json();console.log("[ProfileModal] ✅ Fetched profile data from backend:",(g=E.user)==null?void 0:g.email),E.success&&E.user&&f(_=>({..._,id:E.user.id||E.user.userId||"",name:E.user.name||"User",email:E.user.email||"",picture:E.user.picture||"",googleId:E.user.googleId||"",gender:E.user.gender||"Not set",birthday:E.user.birthday||"Not set"}))}else console.warn("[ProfileModal] ⚠️ Failed to fetch profile from backend:",w.status)}else console.log("[ProfileModal] ⚠️ No token found in localStorage")}catch(m){console.error("[ProfileModal] ❌ Error loading user profile:",m)}},B=g=>{const{name:m,value:v}=g.target;f(w=>({...w,[m]:v}))},ue=g=>{var v;const m=(v=g.target.files)==null?void 0:v[0];if(m){const w=new FileReader;w.onloadend=()=>{f(E=>({...E,picture:w.result}))},w.readAsDataURL(m)}},M=async()=>{b(!0);try{console.log("[PROFILE SAVE] Starting profile save process"),console.log("[PROFILE SAVE] Profile data:",h);const g=(o==null?void 0:o.googleId)||localStorage.getItem("userId");if(console.log("[PROFILE SAVE] User ID:",g),!g){console.error("[PROFILE SAVE] Error: No user ID found"),alert("Error: User ID not found. Please login again."),b(!1);return}const m={userId:g,birthday:h.birthday||new Date().toISOString().split("T")[0],gender:h.gender||"Not set"};console.log("[PROFILE SAVE] Request body:",JSON.stringify(m)),console.log("[PROFILE SAVE] Required fields check:"),console.log("  - userId:",!!m.userId),console.log("  - birthday:",!!m.birthday),console.log("  - gender:",!!m.gender);const v=localStorage.getItem("token");console.log("[PROFILE SAVE] Token present:",!!v),v||console.warn("[PROFILE SAVE] Warning: No auth token found");const w="https://flinxx-backend.onrender.com";console.log("[PROFILE SAVE] Backend URL:",w),console.log("[PROFILE SAVE] Making API call to /api/users/complete-profile");const E=await fetch(`${w}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json",...v&&{Authorization:`Bearer ${v}`}},body:JSON.stringify(m)});if(console.log("[PROFILE SAVE] Response status:",E.status),!E.ok){const re=await E.json();console.error("[PROFILE SAVE] Error response:",re),alert(`Failed to save profile: ${re.error||"Unknown error"}`),b(!1);return}const _=await E.json();console.log("[PROFILE SAVE] ✅ Profile saved successfully:",_),localStorage.setItem("userProfile",JSON.stringify(m)),u(!1),console.log("[PROFILE SAVE] Profile saved successfully"),console.log("[PROFILE SAVE] Closing ProfileModal..."),e(),alert("Profile updated successfully!"),console.log("🎥 [ProfileModal] Scheduling camera re-init with 500ms delay to allow modal unmount"),typeof r=="function"?setTimeout(()=>{console.log(`
🎥 [ProfileModal] 500ms delay complete, reinitializing camera now`),console.log("🎥 [ProfileModal] Calling onReinitializeCamera()"),r().then(re=>{re?console.log("🎥 [ProfileModal] ✅ Camera reinitialized successfully after profile save"):console.warn("🎥 [ProfileModal] ⚠️ Camera reinitialization returned false")}).catch(re=>{console.error("🎥 [ProfileModal] ❌ Error calling reinitializeCamera:",re)})},500):console.warn("🎥 [ProfileModal] ⚠️ onReinitializeCamera callback not provided")}catch(g){console.error("[PROFILE SAVE] Error:",g),console.error("[PROFILE SAVE] Error message:",g.message),console.error("[PROFILE SAVE] Error stack:",g.stack),alert("Failed to save profile: "+g.message)}finally{b(!1)}},I=async()=>{try{await ig(Lr),localStorage.removeItem("userInfo"),localStorage.removeItem("userProfile"),s("/login",{replace:!0})}catch(g){console.error("Sign out error:",g)}};return n?l.jsx("div",{className:"profile-modal-overlay",onClick:e,children:l.jsxs("div",{className:"profile-modal-container",onClick:g=>g.stopPropagation(),children:[l.jsx("button",{className:"profile-modal-close",onClick:e,children:"✕"}),l.jsxs("div",{className:"profile-header",children:[l.jsxs("div",{className:"profile-picture-container",children:[l.jsx("img",{src:h.picture||"https://via.placeholder.com/120",alt:"Profile",className:"profile-picture"}),a&&l.jsxs("label",{className:"photo-upload-label",children:[l.jsx("input",{type:"file",accept:"image/*",onChange:ue,style:{display:"none"}}),"📷"]})]}),a?l.jsx("input",{type:"text",name:"name",value:h.name,onChange:B,className:"profile-input-name",placeholder:"Name"}):l.jsx("h2",{className:"profile-name",children:h.name}),l.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginTop:"6px",opacity:.8},children:[l.jsxs("span",{children:["ID: ",h.id||"N/A"]}),h.id&&l.jsx("button",{onClick:()=>N(h.id),style:{background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center"},title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{className:"profile-premium-section",onClick:t,style:{cursor:"pointer"},children:[l.jsx("div",{className:"premium-badge",children:"⭐ Flinxx Premium"}),l.jsx("p",{className:"premium-description",children:"Unlock premium features"})]}),l.jsxs("div",{className:"profile-details",children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"💰 Tokens"}),l.jsx("span",{className:"detail-value",children:h.tokens})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"💎 Gems"}),l.jsx("span",{className:"detail-value",children:h.gems})]}),a?l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("input",{type:"text",name:"location",value:h.location,onChange:B,className:"profile-input-small"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsxs("select",{name:"gender",value:h.gender,onChange:B,className:"profile-input-small",children:[l.jsx("option",{value:"",children:"Select"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"}),l.jsx("option",{value:"other",children:"Other"})]})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("input",{type:"date",name:"birthday",value:h.birthday?h.birthday.slice(0,10):"",onChange:B,className:"profile-input-small text-black focus:text-black !text-black [&::-webkit-datetime-edit]:text-black [&::-webkit-datetime-edit-year-field]:text-black [&::-webkit-datetime-edit-month-field]:text-black [&::-webkit-datetime-edit-day-field]:text-black"})]})]}):l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("span",{className:"detail-value",children:h.location||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsx("span",{className:"detail-value",children:h.gender||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("span",{className:"detail-value",children:h.birthday||"Not set"})]})]})]}),l.jsx("div",{className:"profile-actions",children:a?l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"btn-save",onClick:M,disabled:y,children:y?"Saving...":"Save Changes"}),l.jsx("button",{className:"btn-cancel",onClick:()=>{u(!1),U()},children:"Cancel"})]}):l.jsxs(l.Fragment,{children:[l.jsx("button",{className:"btn-edit",onClick:()=>u(!0),children:"✏️ Edit Profile"}),l.jsx("button",{className:"btn-more",children:"⋮ More"})]})}),l.jsx("button",{className:"btn-sign-out",onClick:I,children:"Sign Out"})]})}):null},PI=({isOpen:n,onClose:e})=>{const[t,r]=C.useState([{id:1,username:"Up ke 😊",name:"Up ke",location:"National Capital Territory of Delhi",duration:"00:05",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:2,username:"Loup 😊",name:"Loup",location:"Algeria",duration:"00:06",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:3,username:"Nish 😊",name:"Nish",location:"Maharashtra",duration:"00:04",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:4,username:"Priya 😊",name:"Priya",location:"Gujarat",duration:"00:02",date:"11/27/2025",time:"9:23PM",avatar:"M",liked:!1},{id:5,username:"pagbigyamnmako 😊",name:"pagbigyamnmako",location:"Philippines",duration:"00:08",date:"11/27/2025",time:"9:23PM",avatar:"😊",liked:!1}]),s=a=>{r(t.map(u=>u.id===a?{...u,liked:!u.liked}:u))},o=a=>{r(t.filter(u=>u.id!==a))};return n?l.jsx("div",{className:"match-history-overlay",onClick:e,children:l.jsxs("div",{className:"match-history-container",onClick:a=>a.stopPropagation(),children:[l.jsxs("div",{className:"match-history-header",children:[l.jsx("h2",{children:"Match History"}),l.jsx("button",{className:"match-history-close",onClick:e,children:"✕"})]}),l.jsx("div",{className:"match-history-list",children:t.length===0?l.jsxs("div",{className:"match-history-empty",children:[l.jsx("p",{children:"No match history yet"}),l.jsx("p",{className:"match-history-empty-sub",children:"Start video chatting to build your history!"})]}):t.map(a=>l.jsxs("div",{className:"match-card",children:[l.jsxs("div",{className:"match-card-date",children:[l.jsxs("div",{className:"match-card-datetime",children:[l.jsx("span",{className:"match-date",children:a.date}),l.jsx("span",{className:"match-time",children:a.time})]}),l.jsxs("div",{className:"match-duration",children:["⏱️ ",a.duration]})]}),l.jsxs("div",{className:"match-card-user",children:[l.jsx("div",{className:"match-card-avatar",children:a.avatar==="M"?l.jsx("div",{className:"avatar-initial",children:"M"}):l.jsx("span",{children:a.avatar})}),l.jsxs("div",{className:"match-card-info",children:[l.jsx("p",{className:"match-card-name",children:a.name}),l.jsxs("p",{className:"match-card-location",children:["📍 ",a.location]})]})]}),l.jsxs("div",{className:"match-card-actions",children:[l.jsx("button",{className:`action-btn like-btn ${a.liked?"liked":""}`,onClick:()=>s(a.id),title:"Like this match",children:"❤️"}),l.jsx("button",{className:"action-btn delete-btn",onClick:()=>o(a.id),title:"Delete from history",children:"🗑️"})]})]},a.id))})]})}):null},To=({friend:n,onBack:e,onMessageSent:t})=>{var x;const{user:r}=C.useContext(St)||{},{refetchUnreadCount:s}=ga(),[o,a]=C.useState([]),[u,h]=C.useState(""),f=r==null?void 0:r.uuid;if(!f||typeof f!="string"||f.length!==36)return console.warn("⛔ ChatBox: Invalid my UUID, blocking render:",f==null?void 0:f.length),null;if(!(n!=null&&n.id)||typeof n.id!="string"||n.id.length!==36)return console.warn("⛔ ChatBox: Invalid friend UUID, blocking render:",(x=n==null?void 0:n.id)==null?void 0:x.length),null;C.useEffect(()=>{if(!f||!n)return;const A=n.id,k=f<A?`${f}_${A}`:`${A}_${f}`;console.log(`📍 Joining chat room: ${k}`),console.log(`   My UUID: ${f}`),console.log(`   Friend UUID: ${A}`),K.emit("join_chat",{senderId:f,receiverId:n.id})},[n,f]),C.useEffect(()=>{if(!f||!(n!=null&&n.id))return;(async()=>{try{const k=n.id,S=f<k?`${f}_${k}`:`${k}_${f}`,N=await Xs(S);N!=null&&N.success&&(console.log("✅ Messages from",n.display_name,"marked as read (chatId)",S),await s())}catch(k){console.error("❌ Error marking messages as read:",k)}})()},[n==null?void 0:n.id,f,s]),C.useEffect(()=>{if(!f||!(n!=null&&n.id)){console.log("⏳ ChatBox: Waiting for myUserId or friend.id",{myUserId:f,friendId:n==null?void 0:n.id});return}console.log("📨 ChatBox: Loading messages for friend:",{myUserId:f,friendId:n.id,friendName:n.display_name});const k=`https://flinxx-backend.onrender.com/api/messages?user1=${f}&user2=${n.id}`;console.log("📨 Fetching chat history from:",k),fetch(k).then(S=>{if(console.log("📨 Response status:",S.status),!S.ok)throw new Error(`HTTP ${S.status}`);return S.json()}).then(S=>{console.log("📨 Messages loaded:",S.length,"messages"),Array.isArray(S)&&a(S.map(N=>({me:N.sender_id===f,text:N.message})))}).catch(S=>{console.error("❌ Failed to load chat history:",S)})},[f,n]);const y=()=>{if(!u.trim())return;const A=new Date().toISOString();K.emit("send_message",{senderId:f,receiverId:n.id,message:u,created_at:A}),h(""),t&&t(n.id,A)};C.useEffect(()=>{const A=k=>{if(a(S=>[...S,{me:k.senderId===f,text:k.message}]),t&&k.senderId!==f){const S=k.created_at||new Date().toISOString();t(n.id,S)}};return K.on("receive_message",A),()=>K.off("receive_message",A)},[f,n,t]);const b=A=>{A.key==="Enter"&&!A.shiftKey&&(A.preventDefault(),y())};return l.jsxs("div",{className:"chat-box",children:[l.jsxs("div",{className:"chat-header",children:[l.jsx("button",{onClick:e,children:"←"}),l.jsx("img",{src:n.photo_url,alt:n.display_name}),l.jsx("span",{children:n.display_name})]}),l.jsxs("div",{className:"chat-body",children:[o.length===0&&l.jsxs("p",{className:"empty",children:["Start a conversation with ",n.display_name]}),o.map((A,k)=>l.jsx("div",{className:`bubble ${A.me?"me":""}`,children:A.text},k))]}),l.jsxs("div",{className:"chat-input",children:[l.jsx("input",{value:u,onChange:A=>h(A.target.value),onKeyPress:b,placeholder:"Type a message…"}),l.jsx("button",{onClick:y,children:"➤"})]})]})},pc=({isOpen:n,onClose:e,onUserSelect:t,mode:r="search"})=>{const{markAsRead:s}=C.useContext(ca)||{},{user:o,notifications:a,refreshNotifications:u}=C.useContext(St)||{},{setUnreadCount:h,refetchUnreadCount:f}=ga(),[y,b]=C.useState(""),[x,A]=C.useState(""),[k,S]=C.useState(!1),[N,$]=C.useState({}),[G,U]=C.useState(null),[B,ue]=C.useState(null),[M,I]=C.useState([]),[g,m]=C.useState(null),v=r==="notifications",w=r==="message",E="https://flinxx-backend.onrender.com",_=async()=>{try{const O=await fetch(`${E}/api/profile`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!O.ok)return null;const X=await O.json();if(X!=null&&X.user){const ne={...X.user,publicId:X.user.public_id};return localStorage.setItem("user",JSON.stringify(ne)),ne}return null}catch(O){return console.error("Failed to ensure current user",O),null}},re=()=>{try{const O=JSON.parse(localStorage.getItem("user"));return O?{...O,publicId:O.publicId||O.public_id||O.id}:null}catch{return null}},$e=async O=>{try{const X=re();if(!X||!X.id){console.warn("Current user not available for status check");return}const ne=await fetch(`${E}/api/friends/status?senderPublicId=${X.id}&receiverPublicId=${O}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(ne.ok){const lt=await ne.json();$(Ne=>({...Ne,[O]:lt.status}))}}catch(X){console.error("Error checking friend status:",X)}};C.useEffect(()=>{n&&_()},[n]),C.useEffect(()=>{n&&o!=null&&o.uuid&&o.uuid.length===36&&(console.log("📨 Loading friends for message mode"),Fh(o.uuid).then(O=>{const X=Array.isArray(O)?O.sort((ne,lt)=>{const Ne=ne.last_message_at?new Date(ne.last_message_at):new Date(0);return(lt.last_message_at?new Date(lt.last_message_at):new Date(0))-Ne}):[];I(X)}).catch(O=>{console.error("❌ Error loading friends:",O),I([])}))},[n,o==null?void 0:o.uuid]),C.useEffect(()=>{n&&v&&o!=null&&o.uuid&&o.uuid.length===36&&u&&(console.log("🔄 Refreshing notifications when panel opens"),u())},[n,v,o==null?void 0:o.uuid,u]);const _t=a||[],Ze=(O,X)=>{I(ne=>ne.map(Ne=>Ne.id===O?{...Ne,last_message_at:X}:Ne).sort((Ne,Rt)=>{const on=Ne.last_message_at?new Date(Ne.last_message_at):new Date(0);return(Rt.last_message_at?new Date(Rt.last_message_at):new Date(0))-on}))},rt=async O=>{O!=null&&O.id&&(o!=null&&o.uuid)&&o.uuid.length===36&&(await Xs(o.uuid,O.id),I(X=>X.map(ne=>ne.id===O.id?{...ne,unreadCount:0}:ne)),await f()),s&&O.id&&s(O.id),h(X=>Math.max(X-1,0)),m(O)};if(!n)return null;const rn=async O=>{if(!(!O||typeof O!="string")){if(b(O),!O.trim()){A([]);return}S(!0);try{const X=await fetch(`${E}/api/search-user?q=${encodeURIComponent(O)}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!X.ok){console.error("Search error:",X.status),A([]);return}const ne=await X.json();A(Array.isArray(ne)?ne:[]),Array.isArray(ne)&&ne.forEach(lt=>{$e(lt.publicId)})}catch(X){console.error("Search error:",X),A([])}finally{S(!1)}}},sn=O=>{const X=N[O];return X==="pending"?"SENT":X==="accepted"?"MESSAGE":"FRIEND"},Wr=O=>{const X=N[O];return X==="pending"?"⏳":X==="accepted"?"💬":"🤝"},at=async O=>{const X=N[O];if(X==="pending"||X==="accepted"){console.log("Friend request already sent or accepted");return}U(O);try{const ne=re();if(!(ne!=null&&ne.id)){console.error("Current user id not found",ne);return}(await fetch(`${E}/api/friends/send`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({senderPublicId:String(ne.id),receiverPublicId:String(O)})})).ok?($(Ne=>({...Ne,[O]:"pending"})),console.log("Friend request sent to:",O)):console.error("Failed to send friend request")}catch(ne){console.error("Error sending friend request:",ne)}finally{U(null)}};return l.jsx("div",{className:"search-friends-overlay",onClick:e,children:l.jsxs("div",{className:"search-friends-modal",onClick:O=>O.stopPropagation(),children:[l.jsxs("div",{className:"search-friends-header",children:[l.jsx("h2",{children:w?"Message":v?"Notifications":"Search Friends"}),l.jsx("button",{className:"search-close-btn",onClick:e,children:"✖"})]}),!v&&!w&&l.jsxs("div",{className:"search-input-container",children:[l.jsx("input",{type:"text",placeholder:"Search a friend by ID",value:y,onChange:O=>rn(O.target.value),className:"search-input",autoFocus:!0}),l.jsx("span",{className:"search-icon",children:"🔍"})]}),!v&&!w&&l.jsx("div",{className:"search-results",children:x.length===0?l.jsx("div",{className:"search-empty-state",children:l.jsx("p",{style:{textAlign:"center",color:"rgba(255, 255, 255, 0.6)",marginTop:"40px"},children:y?"No users found":""})}):x.map((O,X)=>l.jsxs("div",{className:"search-result-item",onClick:()=>{t&&t(O),e()},children:[l.jsx("div",{className:"result-avatar",children:O.avatar&&O.avatar.startsWith("http")?l.jsx("img",{src:O.avatar,alt:"avatar",style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsxs("div",{className:"result-name-row",children:[l.jsx("p",{className:"result-name",children:O.name}),l.jsxs("button",{className:"friend-badge-btn",title:"Send Friend Request",disabled:N[O.publicId]==="pending",onClick:ne=>{ne.stopPropagation(),at(O.publicId)},children:[l.jsx("span",{className:"friend-emoji","aria-hidden":"true",children:Wr(O.publicId)}),l.jsx("span",{className:"friend-text",children:sn(O.publicId)})]})]}),l.jsx("p",{className:"tap-to-chat",children:N[O.publicId]==="accepted"&&O.unreadCount>0?"New message":"Tap to chat"})]})]},`user-${O.shortId}-${X}`))}),v&&l.jsx("div",{className:"search-results",children:g?l.jsx(To,{friend:g,onBack:()=>m(null),onMessageSent:Ze}):a?_t.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No notifications"}):_t.map(O=>l.jsxs("div",{className:"notification-item",children:[l.jsx("div",{className:"notification-avatar",children:O.photo_url?l.jsx("img",{src:O.photo_url,alt:O.display_name}):l.jsx("div",{className:"text-avatar",children:O.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:O.display_name})}),O.status==="accepted"&&l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:async()=>{o!=null&&o.uuid&&o.uuid.length===36&&O.user_id&&await Xs(o.uuid,O.user_id),s&&O.user_id&&s(O.user_id);const X={...O,id:O.user_id};console.log("Opening chat from notification:",X),m(X)},children:"Message"})})]},O.id)):l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"40px"},children:"Loading notifications..."})}),w&&l.jsx("div",{className:"message-panel-body",children:g?l.jsx(To,{friend:g,onBack:()=>m(null),onMessageSent:Ze}):l.jsx("div",{className:"search-results",children:M.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No friends yet"}):M.map(O=>l.jsxs("div",{className:"search-result-item friend-row",onClick:()=>rt(O),children:[l.jsx("div",{className:"result-avatar",children:O.photo_url?l.jsx("img",{src:O.photo_url,alt:O.display_name,style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsx("p",{className:"result-name",children:O.display_name}),l.jsx("p",{className:"tap-to-chat",children:O.unreadCount>0?"New message":"Tap to chat"})]})]},O.id))})})]})})};console.log("🎯 CHAT BUILD: 2025-12-20T00:00:00Z - WebRTC stable remote stream handling");const OI=()=>{var wt;console.log("RENDER START");const{activeMode:n,setActiveMode:e,handleModeChange:t,openDuoSquad:r}=sd(),s=ot(),o=Ad(),{user:a}=C.useContext(St)||{},[u,h]=C.useState(!1),[f,y]=C.useState(!1),[b,x]=C.useState(null),[A,k]=C.useState(!1),[S,N]=C.useState(!1),[$,G]=C.useState(!1),[U,B]=C.useState(!1),[ue,M]=C.useState(!1),[I,g]=C.useState(null),[m,v]=C.useState(0),[w,E]=C.useState(!1),[_,re]=C.useState(!1),[$e,_t]=C.useState(!1),[Ze,rt]=C.useState(!1),[rn,sn]=C.useState(!1),[Wr,at]=C.useState(!1),[O,X]=C.useState(null),[ne,lt]=C.useState("both"),[Ne,Rt]=C.useState(!1),[on,ct]=C.useState(!1),[er,Sn]=C.useState([]),[zr,Kr]=C.useState(""),[Rn,Nt]=C.useState(!1),Qr=C.useRef(null),W=C.useRef(null),tr=C.useRef(null),ke=C.useRef(null),[he,wi]=C.useState(null),Q=C.useRef(null),et=C.useRef(null),ee=C.useRef(null),Ie=C.useRef(null),pe=C.useRef(null),an=C.useRef(null),[Jr,Ii]=C.useState(!1);if(console.log("HOOKS DONE"),!(a!=null&&a.uuid)||typeof a.uuid!="string"||a.uuid.length!==36)return console.log("⏳ Chat: Waiting for valid user UUID from AuthContext..."),null;console.log("🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - move hooks to top)"),C.useEffect(()=>{console.log("🔐 [TERMS CHECK] Checking if terms are accepted...");try{const P=localStorage.getItem("termsAccepted")==="true";console.log("📋 [TERMS CHECK] termsAccepted from localStorage:",P),P?(console.log("✅ [TERMS CHECK] User has accepted terms - allowing access"),y(!0)):(console.log("⚠️ [TERMS CHECK] User has not accepted terms - showing modal"),h(!0))}catch(P){console.error("❌ [TERMS CHECK] Error checking terms:",P),y(!0)}},[]);const Ei=()=>{console.log("✅ User accepted terms on dashboard"),localStorage.setItem("termsAccepted","true"),h(!1),y(!0)},ln=()=>{console.log("❌ User cancelled terms on dashboard - redirecting to login"),h(!1),s("/login",{replace:!0})};C.useEffect(()=>{const F=new URLSearchParams(o.search).get("view");x(F),k(F==="home"),console.log("[Chat] Location search params:",o.search),console.log("[Chat] view parameter:",F),console.log("[Chat] shouldStartAsIntro:",F==="home")},[o.search]),C.useEffect(()=>{const P=a||{googleId:"guest_"+Math.random().toString(36).substring(2,9),name:"Guest User",email:"guest@flinxx.local",picture:null};wi(P),ke.current||(ke.current=P.uuid,!ke.current||ke.current.length!==36?console.error("❌ CRITICAL: Invalid or missing UUID from localStorage:",ke.current):console.log("🔐 USER UUID INITIALIZED (ONE TIME):",ke.current)),tr.current||(tr.current=P)},[a]),C.useEffect(()=>()=>{an.current&&clearInterval(an.current)},[]),C.useEffect(()=>{console.log(`👁️ [ACTIVE MODE MONITOR] Current activeMode: "${n}"`)},[n]),C.useEffect(()=>{var P;console.log("📌 Refs initialized:"),console.log("   localVideoRef.current exists:",!!Q.current),console.log("   localVideoRef.current in DOM:",(P=Q.current)!=null&&P.parentElement?"YES":"NO"),console.log("   remoteVideoRef.current exists:",!!et.current),console.log("   localStreamRef.current exists:",!!ee.current)},[]);const nr=Zs.useCallback(async()=>{console.log(`

🎥 ===== CAMERA RE-INITIALIZATION STARTED =====`),console.log("🎥 [REINIT] Camera re-initialization requested"),console.log("🎥 [REINIT] Current state:"),console.log("  - localStreamRef.current exists:",!!ee.current),console.log("  - localVideoRef.current exists:",!!Q.current),console.log("  - cameraStarted:",S);try{if(!Q.current)return console.error("🎥 [REINIT] ❌ CRITICAL: localVideoRef.current is null/undefined - video element not in DOM"),!1;if(!Q.current.parentElement)return console.error("🎥 [REINIT] ❌ CRITICAL: Video element is not attached to DOM"),!1;if(console.log("🎥 [REINIT] ✓ Video element exists in DOM"),ee.current){console.log("🎥 [REINIT] Stream exists, checking if tracks are active...");const F=ee.current.getTracks();if(console.log("🎥 [REINIT] Stream has",F.length,"tracks"),F.forEach((L,z)=>{console.log(`  Track ${z}:`,{kind:L.kind,enabled:L.enabled,readyState:L.readyState})}),F.length===0)console.warn("🎥 [REINIT] ⚠️ Stream exists but has no active tracks - will request new stream"),ee.current=null;else{console.log("🎥 [REINIT] ✓ Stream has active tracks, reattaching to video element"),Q.current.srcObject=ee.current,Q.current.muted=!0,console.log("🎥 [REINIT] srcObject set, waiting for play()...");try{const L=Q.current.play();return L!==void 0&&await L,console.log("🎥 [REINIT] ✅ Camera preview reattached and playing"),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(L){return console.error("🎥 [REINIT] ❌ Error playing video:",L),console.error("🎥 [REINIT] Error name:",L.name),console.error("🎥 [REINIT] Error message:",L.message),!1}}}console.log("🎥 [REINIT] No existing stream or tracks inactive, requesting new preview stream");const P=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});return ee.current=P,console.log("🎥 [REINIT] ✅ New camera stream obtained:",P),console.log("🎥 [REINIT] New stream tracks:",P.getTracks().map(F=>({kind:F.kind,id:F.id}))),Q.current.srcObject=P,Q.current.muted=!0,console.log("🎥 [REINIT] srcObject set to new stream, calling play()..."),requestAnimationFrame(()=>{var F;(F=Q.current)==null||F.play().catch(L=>{console.log("🎥 [REINIT] Video play blocked:",L)}),console.log("🎥 [REINIT] ✅ New camera preview play command dispatched")}),N(!0),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(P){return console.error("🎥 [REINIT] ❌ Error reinitializing camera:",P),console.error("🎥 [REINIT] Error name:",P.name),console.error("🎥 [REINIT] Error message:",P.message),console.error(`🎥 ===== CAMERA RE-INITIALIZATION FAILED =====

`),!1}},[S]);C.useEffect(()=>{Qr.current={reinitializeCamera:nr}},[nr]),C.useEffect(()=>{if(!ue)return;const P=setInterval(()=>{v(F=>F+1)},1e3);return()=>clearInterval(P)},[ue]),C.useEffect(()=>{U&&S&&console.log("🎬 [PARTNER FOUND] Transitioning to video chat screen")},[U,S]);const Yr=async()=>{var P;try{if(console.log("📹 [START CAMERA] User clicked to start camera"),console.log("📹 [START CAMERA] Checking DOM state..."),console.log("   localVideoRef.current:",!!Q.current),console.log("   localVideoRef.current in DOM:",(P=Q.current)!=null&&P.parentElement?"YES":"NO"),console.log("   All videos in DOM:",document.querySelectorAll("video").length),!Q.current){console.error("📹 [START CAMERA] ❌ Video element not in DOM - cannot proceed");return}console.log("📹 [START CAMERA] Requesting camera from browser...");const F=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});Ie.current=F,ee.current=F,console.log("📹 [START CAMERA] ✅ Stream obtained:",F),console.log("📹 [START CAMERA] Stream tracks:",F.getTracks().map(L=>({kind:L.kind,enabled:L.enabled,id:L.id}))),Q.current&&(Q.current.srcObject=F,console.log("📹 [START CAMERA] ✅ Stream attached to video element"),Q.current.onloadedmetadata=()=>{console.log("📹 [START CAMERA] ✅ Video metadata loaded, calling play()"),Q.current.play().then(()=>{console.log("📹 [START CAMERA] ✅ Video playing - setting isLocalCameraReady=true"),ct(!0)}).catch(L=>{console.warn("📹 [START CAMERA] ⚠️ Play warning (but video loaded):",L.message),ct(!0)})})}catch(F){console.error("📹 [START CAMERA] ❌ CRITICAL ERROR:",F),console.error("   Error name:",F.name),console.error("   Error message:",F.message),F.name==="NotAllowedError"?console.error("❌ Camera permission DENIED by user - User clicked deny in browser prompt"):F.name==="NotFoundError"?console.error("❌ No camera device found - Check if device has a camera"):F.name==="NotReadableError"?console.error("❌ Camera is already in use by another app - Close other apps using camera"):F.name==="SecurityError"&&console.error("❌ Camera access blocked by security policy - Must use HTTPS")}};C.useEffect(()=>()=>{console.log("📹 [CLEANUP] Component unmounting - stopping camera"),Ie.current&&(Ie.current.getTracks().forEach(P=>{console.log("📹 [CLEANUP] Stopping track:",P.kind),P.stop()}),Ie.current=null)},[]),C.useEffect(()=>{if(console.log("[Camera] ⏳ Auto-start useEffect triggered, shouldStartAsIntro:",A),A){console.log("[Camera] ⏭️ Skipping auto camera init - user just completed profile (view=home)"),console.log('[Camera] Camera will start when user clicks "Start Video Chat" button'),console.log("[Camera] User must click button to start camera manually");return}async function P(){try{if(console.log("📹 [AUTO-START] Starting camera preview automatically..."),console.log("📹 [AUTO-START] Chat component mounted, attempting to initialize camera"),!Q.current){console.error("📹 [AUTO-START] ❌ Video element not in DOM yet, cannot initialize camera");return}console.log("📹 [AUTO-START] ✓ Video element found in DOM, requesting camera permissions");const L=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});ee.current=L,Ie.current=L,console.log("📹 [AUTO-START] ✅ Camera stream obtained:",L),console.log("📹 [AUTO-START] Stream tracks:",L.getTracks().map(z=>({kind:z.kind,id:z.id}))),Q.current&&(Q.current.srcObject=L,Q.current.muted=!0,Q.current.onloadedmetadata=()=>{console.log("📹 [AUTO-START] ✅ Video metadata loaded, calling play()"),Q.current.play().then(()=>{console.log("📹 [AUTO-START] ✅ Video playing - setting isLocalCameraReady=true"),N(!0),ct(!0)}).catch(z=>{console.warn("📹 [AUTO-START] ⚠️ Play warning (but video loaded):",z.message),N(!0),ct(!0)})})}catch(L){console.error("📹 [AUTO-START] ❌ Camera error:",L.message),console.error("📹 [AUTO-START] Error name:",L.name),console.error("📹 [AUTO-START] Error code:",L.code),ct(!0)}}console.log("[Camera] Chat component useEffect triggered, scheduling camera init with delay");const F=setTimeout(()=>{console.log("[Camera] Delay complete, now calling startPreview()"),P()},100);return()=>{console.log("[Camera] Chat component unmounting, clearing camera init timer"),clearTimeout(F)}},[A]);const Nn=async()=>{if(console.log("🔧 createPeerConnection called"),console.log("   Current localStreamRef:",ee.current),!ee.current){console.warn("⚠️ CRITICAL: localStreamRef.current is null - attempting to reacquire camera stream");try{const z=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=z,Q.current){Q.current.srcObject=z,Q.current.muted=!0;try{await Q.current.play()}catch(q){console.warn("⚠️ Play error during reacquisition:",q)}}console.log("✅ LOCAL STREAM RE-ACQUIRED SUCCESSFULLY"),console.log("   Tracks:",z.getTracks().map(q=>({kind:q.kind,id:q.id})))}catch(z){throw console.error("❌ FATAL: Could not reacquire camera stream:",z.message),new Error("Cannot proceed: local camera stream unavailable - "+z.message)}}AI();const P=await bi(),F=[{urls:["stun:global.xirsys.net","turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp"],username:"nkhlvdv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"},...P];console.log("🔧 ICE Servers Configuration:",{count:F.length,servers:F.map(z=>({urls:z.urls,username:z.username?"***":void 0,credential:z.credential?"***":void 0}))});const L=new RTCPeerConnection({iceServers:F,iceTransportPolicy:"all"});if(W.current=L,console.log("✅ RTCPeerConnection created with iceTransportPolicy: all"),L.onicecandidate=z=>{if(z.candidate){const q=z.candidate;console.log("🧊 ICE candidate generated:",{candidate:q.candidate,protocol:q.protocol,port:q.port,address:q.address,type:q.type,priority:q.priority,sdpMLineIndex:q.sdpMLineIndex,sdpMId:q.sdpMid}),q.type==="relay"?(console.log("🔄 RELAY (TURN) candidate generated - TURN server is reachable"),console.log("   Protocol:",q.protocol,"Port:",q.port)):q.type==="srflx"?(console.log("📍 SRFLX (server reflexive) candidate - STUN working"),console.log("   Found public address via STUN")):q.type==="host"&&console.log("🏠 HOST candidate - direct LAN connection possible"),console.log("🔌 Sending ICE candidate to partner socket:",pe.current),K.emit("ice_candidate",{candidate:q,to:pe.current}),console.log("📤 ICE candidate sent to peer")}else console.log("🧊 ICE gathering complete (null candidate received)"),console.log("📊 ICE gathering summary:"),console.log("   Connection State:",L.connectionState),console.log("   ICE Connection State:",L.iceConnectionState),console.log("   ICE Gathering State:",L.iceGatheringState)},L.oniceconnectionstatechange=()=>{const z=L.iceConnectionState;switch(console.log(`
🧊 ===== ICE CONNECTION STATE CHANGED =====`),console.log("🧊 New ICE Connection State:",z),z){case"new":console.log("🧊 State: NEW - Gathering ICE candidates");break;case"checking":console.log("🧊 State: CHECKING - Testing ICE candidate pairs"),console.log("🧊 Connection in progress - waiting for connectivity");break;case"connected":console.log("✅ State: CONNECTED - Found working ICE candidate pair"),console.log("🧊 Peer-to-peer communication established");break;case"completed":console.log("✅ State: COMPLETED - ICE checks completed, ready for media"),console.log("🧊 All connectivity checks passed");break;case"failed":console.error("❌ State: FAILED - All ICE candidate pairs failed"),console.error("❌ Could not establish peer-to-peer connection"),console.error("❌ TURN server may be unreachable or blocked by ISP"),console.error("🔍 Troubleshooting:"),console.error("   - Check console for TURN error details"),console.error("   - TURN error 701 = Network/ISP blocking ports 3478, 5349"),console.error("   - Solutions: Try VPN, different WiFi, or mobile hotspot"),console.error("   - User can retry with a retry button (do NOT auto-restart ICE)");break;case"disconnected":console.warn("⚠️ State: DISCONNECTED - Lost connection to peer"),console.warn("   Note: ICE restart is manual only to prevent stream loss");break;case"closed":console.log("🛑 State: CLOSED - Connection closed");break}console.log("📊 Full connection states:"),console.log("   Signaling State:",L.signalingState),console.log("   Connection State:",L.connectionState),console.log("   ICE Gathering State:",L.iceGatheringState)},W.current._remoteStream||(W.current._remoteStream=new MediaStream,console.log("✅ PERSISTENT REMOTE STREAM CREATED - will accumulate all incoming tracks")),L.ontrack=z=>{console.log(`

🔴🔴🔴 ===== CRITICAL: ONTRACK HANDLER FIRING! =====`),console.log("🔴 ONTRACK CALLED AT:",new Date().toISOString()),console.log("🔴 Track received:",{kind:z.track.kind,id:z.track.id,enabled:z.track.enabled});const q=W.current._remoteStream;if(console.log("🔴 Using persistent remote stream ID:",q.id),q.addTrack(z.track),console.log("✅ Track added to persistent remote stream"),console.log("📥 Remote stream now has",q.getTracks().length,"track(s)"),console.log("📥 Tracks:",q.getTracks().map(Z=>({kind:Z.kind,id:Z.id,enabled:Z.enabled}))),!et.current){console.error("❌ CRITICAL ERROR: remoteVideoRef.current is NULL!"),console.error("   Cannot attach remote track - video element not available");return}et.current.srcObject!==q?(console.log("📺 ATTACHING PERSISTENT STREAM to remoteVideoRef"),et.current.srcObject=q,et.current.muted=!1,console.log("📺 srcObject attached, attempting play()..."),et.current.play().catch(()=>{console.log("ℹ️ Autoplay blocked - will play on user interaction")})):(console.log("📺 STREAM ALREADY ATTACHED - skipping re-attachment"),console.log("   Stream has",q.getTracks().length,"tracks now")),console.log(`✅ ✅ ✅ ONTRACK COMPLETE - Remote stream persisted and attached

`)},L.onconnectionstatechange=()=>{console.log(`
🔌 ===== CONNECTION STATE CHANGED =====`),console.log("🔌 New Connection State:",L.connectionState),console.log("   ICE Connection State:",L.iceConnectionState),console.log("   ICE Gathering State:",L.iceGatheringState),console.log("   Signaling State:",L.signalingState),L.connectionState==="connected"?(M(!0),console.log("✅ WebRTC connection ESTABLISHED"),setTimeout(()=>{console.log(`
📊 ===== RECEIVER DEBUG CHECK (after connected) =====`);const z=L.getReceivers();console.log("📊 Total receivers:",z.length),z.forEach((Z,ve)=>{var _e,xe,Te,Pe,le;console.log(`📊 Receiver ${ve}:`,{kind:(_e=Z.track)==null?void 0:_e.kind,enabled:(xe=Z.track)==null?void 0:xe.enabled,readyState:(Te=Z.track)==null?void 0:Te.readyState,id:(Pe=Z.track)==null?void 0:Pe.id,muted:(le=Z.track)==null?void 0:le.muted})}),console.log("📊 Audio and video tracks should be present above");const q=L.getSenders();console.log(`
📊 Total senders:`,q.length),q.forEach((Z,ve)=>{var _e,xe,Te,Pe;console.log(`📊 Sender ${ve}:`,{kind:(_e=Z.track)==null?void 0:_e.kind,enabled:(xe=Z.track)==null?void 0:xe.enabled,readyState:(Te=Z.track)==null?void 0:Te.readyState,id:(Pe=Z.track)==null?void 0:Pe.id})})},1e3)):L.connectionState==="disconnected"?(M(!1),console.log("⚠️ WebRTC connection DISCONNECTED")):L.connectionState==="failed"?(M(!1),console.log("❌ WebRTC connection FAILED")):L.connectionState==="closed"&&(M(!1),console.log("❌ WebRTC connection CLOSED"))},!ee.current)throw console.error("❌ CRITICAL ERROR: localStreamRef.current is null/undefined in createPeerConnection!"),new Error("Local stream lost before createPeerConnection");return L};C.useEffect(()=>(console.log(`

🔌 ===== SOCKET LISTENERS SETUP (COMPONENT MOUNT) =====`),console.log("🔌 Setting up socket listeners - runs ONCE on component load"),console.log("🔌 Socket ID:",K.id),console.log("🔌 Socket connected:",K.connected),console.log("🔌 🔐 Using userIdRef.current for ALL ID comparisons:",ke.current),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("receive_message"),K.off("partner_disconnected"),K.off("disconnect"),console.log("🔌 Removed old listeners (if any existed)"),K.on("partner_found",async P=>{var _e,xe,Te,Pe;console.log(`

📋 ===== PARTNER FOUND EVENT RECEIVED =====`),console.log("👥 RAW DATA from server:",JSON.stringify(P,null,2)),console.log("👥 My socket ID:",K.id),console.log("👥 currentUser object:",JSON.stringify(he,null,2)),console.log("👥 userIdRef.current (SHOULD USE THIS):",ke.current),console.log("👥 currentUser.googleId:",he==null?void 0:he.googleId),console.log("👥 currentUser.id:",he==null?void 0:he.id),console.log("👥 data.socketId:",P.socketId),console.log("👥 data.partnerId:",P.partnerId),console.log("👥 data.userName:",P.userName),console.log(`
👥 SELF-MATCH CHECK - START`);const F=ke.current,L=P.partnerId;if(console.log("👥 COMPARISON VALUES:"),console.log("   myUserId type:",typeof F,"value:",F),console.log("   partnerUserId type:",typeof L,"value:",L),console.log("   Are they EQUAL?",F===L),console.log("   String comparison:",String(F)===String(L)),F===L){console.error(`
❌❌❌ CRITICAL ERROR: SELF-MATCH DETECTED! ❌❌❌`),console.error("   My user ID:",F,"type:",typeof F),console.error("   Partner user ID:",L,"type:",typeof L),console.error("   Match IDs:",F===L),console.error("   These should be DIFFERENT!"),Nt(!0),console.error("   Emitting skip_user..."),K.emit("skip_user",{partnerSocketId:P.socketId}),console.error("   Emitting find_partner..."),K.emit("find_partner",{userId:ke.current,userName:he.name||"Anonymous",userAge:he.age||18,userLocation:he.location||"Unknown"}),console.error("   Returning - match REJECTED");return}console.log("✅ SELF-MATCH CHECK PASSED - partner is different user"),console.log("   Accepting match and proceeding with WebRTC setup"),console.log(`👥 SELF-MATCH CHECK - END
`),pe.current=P.socketId,console.log("🔌 CRITICAL: Stored partner socket ID:",pe.current),console.log("🔌 CRITICAL: Verification - partnerSocketIdRef.current is now:",pe.current),console.log("🎬 ABOUT TO CALL setHasPartner(true)"),B(!0),console.log("🎬 ✅ setHasPartner(true) CALLED - force attach effect should trigger");const z={...P,picture:P.userPicture||P.picture||null,userName:P.userName||P.name||"Anonymous",userLocation:P.userLocation||P.location||"Unknown",userAge:P.userAge||P.age||18};g(z),console.log("🎬 ✅ setPartnerInfo CALLED with data:",z);const q=K.id,Z=P.socketId,ve=q<Z;if(console.log("🔍 SOCKET ID COMPARISON:"),console.log("   My socket ID:",q),console.log("   Partner socket ID:",Z),console.log("   Am I offerer? (myID < partnerID):",ve),console.log(`
🔐 ===== CRITICAL STREAM VERIFICATION =====`),console.log("🔐 Checking localStreamRef.current status:"),console.log("   exists:",!!ee.current),console.log("   tracks:",((_e=ee.current)==null?void 0:_e.getTracks().length)||0),console.log("   video element srcObject:",!!((xe=Q.current)!=null&&xe.srcObject)),!ee.current){console.error("🔐 ❌ CRITICAL: localStreamRef.current is NULL - cannot proceed to WebRTC"),console.error("   This means the camera stream was never acquired or was lost"),console.error("   Attempting emergency camera reacquisition...");try{const le=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=le,Q.current){Q.current.srcObject=le,Q.current.muted=!0;try{await Q.current.play()}catch{console.warn("⚠️ Play error in emergency reacquisition")}}console.log("🔐 ✅ EMERGENCY: Camera stream re-acquired")}catch(le){console.error("🔐 ❌ EMERGENCY FAILED: Could not reacquire camera -",le.message),console.error("   User must allow camera permission to continue");return}}if(console.log(`🔐 ✅ STREAM VERIFICATION PASSED - proceeding with WebRTC
`),!ve){console.log("📭 I am the ANSWERER - waiting for offer from offerer");return}console.log("📬 I am the OFFERER - creating peer connection and sending offer");try{if(console.log(`
🏠 OFFERER: Creating peer connection`),W.current){console.warn("⚠️ OFFERER: WARNING - Peer connection already exists! Not recreating."),console.warn("   Existing PC state:",{connectionState:W.current.connectionState,iceConnectionState:W.current.iceConnectionState,signalingState:W.current.signalingState});return}let le;try{le=await Nn()}catch(ge){console.error("❌ OFFERER: Error creating peer connection:",ge);return}if(W.current=le,console.log("✅ OFFERER: Peer connection created"),console.log("📊 OFFERER Stream status after peer connection creation:",{exists:!!ee.current,trackCount:(Te=ee.current)==null?void 0:Te.getTracks().length,tracks:(Pe=ee.current)==null?void 0:Pe.getTracks().map(ge=>({kind:ge.kind,enabled:ge.enabled,state:ge.readyState}))}),ee.current){console.log(`
👤 OFFERER localStream:`,ee.current);const ge=ee.current.getTracks();console.log("👤 OFFERER: All available tracks:",ge),console.log("📹 OFFERER tracks detail:",ge.map(Le=>({kind:Le.kind,id:Le.id,enabled:Le.enabled,state:Le.readyState})));const Pt=le.getSenders();if(console.log("📤 OFFERER: Existing senders count:",Pt.length),Pt.length>0)console.warn("⚠️ OFFERER WARNING: Tracks already added! Senders:",Pt.map(Le=>{var Ae,Me;return{kind:(Ae=Le.track)==null?void 0:Ae.kind,id:(Me=Le.track)==null?void 0:Me.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 OFFERER: Adding ${ge.length} local tracks to peer connection`),ge.forEach((Ae,Me)=>{console.log(`  [${Me}] Adding ${Ae.kind} track (id: ${Ae.id}, enabled: ${Ae.enabled})`);try{const Ot=le.addTrack(Ae,ee.current);console.log(`  [${Me}] ✅ addTrack succeeded, sender:`,Ot)}catch(Ot){console.error(`  [${Me}] ❌ addTrack failed:`,Ot)}}),console.log(`
✅ OFFERER: All tracks added to peer connection`);const Le=le.getSenders();console.log("📤 OFFERER senders count:",Le.length),console.log("📤 OFFERER senders after addTrack:",Le.map((Ae,Me)=>{var Ot,or,Pn;return{index:Me,kind:(Ot=Ae.track)==null?void 0:Ot.kind,id:(or=Ae.track)==null?void 0:or.id,trackExists:!!Ae.track,trackEnabled:(Pn=Ae.track)==null?void 0:Pn.enabled}})),console.log("🚀 OFFERER: Ready to send offer with",ge.length,`tracks
`)}}else console.error("❌ OFFERER: No local stream available - TRACKS WILL NOT BE SENT!"),console.error("❌ OFFERER: localStreamRef.current is:",ee.current);console.log(`
📋 ===== OFFERER CREATING AND SENDING OFFER =====`),console.log("🎬 OFFERER: Creating WebRTC offer with offerToReceiveVideo/Audio");const kt=await le.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ OFFERER: Offer created with receive constraints:",kt),console.log("📋 OFFERER SDP CHECK - Looking for a=sendrecv:");const kn=kt.sdp.split(`
`).filter(ge=>ge.includes("sendrecv")||ge.includes("recvonly")||ge.includes("sendonly"));console.log("   Media direction lines:"),kn.forEach(ge=>console.log("   ",ge)),console.log("🔄 OFFERER: Setting local description (offer)"),await le.setLocalDescription(kt),console.log("✅ OFFERER: Local description set"),console.log(`
📤 OFFERER: Sending offer with tracks:`,le.getSenders().map(ge=>{var Pt,Le,Ae;return{kind:(Pt=ge.track)==null?void 0:Pt.kind,id:(Le=ge.track)==null?void 0:Le.id,enabled:(Ae=ge.track)==null?void 0:Ae.enabled}})),console.log("📤 OFFERER: Partner socket ID from data:",P.socketId),console.log("📤 OFFERER: partnerSocketIdRef.current value:",pe.current),console.log("🔌🔌🔌 CRITICAL: About to emit webrtc_offer with to:",P.socketId),console.log("🔌🔌🔌 CRITICAL: Is to value empty/null/undefined?",!P.socketId),K.emit("webrtc_offer",{offer:W.current.localDescription,to:P.socketId}),console.log("✅ OFFERER: webrtc_offer emitted successfully"),console.log("✅ OFFERER: webrtc_offer sent to socket ID:",P.socketId),console.log("✅ OFFERER: webrtc_offer contains",W.current.getSenders().length,"senders"),console.log("✅ OFFERER: Sent to socket:",P.socketId)}catch(le){console.error("❌ OFFERER: Error in partner_found handler:",le),console.error("❌ OFFERER: Stack trace:",le.stack)}}),K.on("webrtc_offer",async P=>{console.log(`

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`),console.log("🎉🎉🎉 ⭐️ ANSWERER HANDLER FIRED ⭐️ 🎉🎉🎉"),console.log("🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"),console.log("📋 ===== ANSWERER RECEIVED OFFER ====="),console.log("⭐️ ANSWERER: WEBRTC_OFFER EVENT FIRED - OFFER WAS RECEIVED"),console.log("📨 ANSWERER: Received WebRTC offer from offerer"),console.log("📨 ANSWERER: My socket ID:",K.id),console.log("📨 ANSWERER: Offer from:",P.from),console.log("📨 ANSWERER: Full data:",P),console.log("📨 ANSWERER: data.from (offerer socket ID):",P.from),pe.current=P.from,console.log("🔌 CRITICAL: Stored offerer socket ID:",pe.current);try{if(W.current)console.log("⚠️ ANSWERER: WARNING - peerConnectionRef already exists (should be null for answerer)");else{console.log("📍 ANSWERER: Creating new peer connection for the first time");let q;try{q=await Nn()}catch(Z){console.error("❌ ANSWERER: Error creating peer connection:",Z);return}W.current=q,console.log("✅ ANSWERER: Peer connection created")}if(console.log(`
🔍 ANSWERER: ALWAYS executing track addition logic`),console.log("👤 ANSWERER: Checking localStreamRef.current..."),console.log("👤 ANSWERER localStreamRef.current:",ee.current),console.log("👤 ANSWERER localStreamRef.current === null?",ee.current===null),console.log("👤 ANSWERER localStreamRef.current === undefined?",ee.current===void 0),!ee.current){console.warn("⚠️ ANSWERER: localStreamRef.current is NULL - attempting emergency reacquisition");try{const q=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=q,Q.current){Q.current.srcObject=q,Q.current.muted=!0;try{await Q.current.play()}catch{console.warn("⚠️ Play error in answerer emergency reacquisition")}}console.log("✅ ANSWERER: Emergency stream acquisition successful")}catch(q){throw console.error("❌ ANSWERER: Emergency stream acquisition failed:",q.message),new Error("ANSWERER: Cannot reacquire camera stream - "+q.message)}}if(ee.current){console.log(`
✅ ANSWERER: localStream EXISTS - will add tracks`),console.log("📊 ANSWERER localStream object:",ee.current);const q=ee.current.getTracks();console.log("👤 ANSWERER: getAllTracks() returned:",q),console.log("👤 ANSWERER: Track array length:",q.length),q.length>0?console.log("👤 ANSWERER: Tracks detail:",q.map(ve=>({kind:ve.kind,id:ve.id,enabled:ve.enabled,readyState:ve.readyState}))):console.warn("⚠️ ANSWERER: WARNING - localStream exists but getTracks() returned empty array!");const Z=W.current.getSenders();if(console.log("📤 ANSWERER: Existing senders count:",Z.length),Z.length>0)console.warn("⚠️ ANSWERER WARNING: Tracks already added! Senders:",Z.map(ve=>{var _e,xe;return{kind:(_e=ve.track)==null?void 0:_e.kind,id:(xe=ve.track)==null?void 0:xe.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 ANSWERER: Attempting to add ${q.length} local tracks to peer connection`);let ve=0,_e=0;q.forEach((Te,Pe)=>{console.log(`  [${Pe}] About to add ${Te.kind} track (id: ${Te.id}, enabled: ${Te.enabled})`);try{const le=W.current.addTrack(Te,ee.current);console.log(`  [${Pe}] ✅ addTrack SUCCEEDED`),console.log(`  [${Pe}] Sender:`,le),ve++}catch(le){console.error(`  [${Pe}] ❌ addTrack FAILED`),console.error(`  [${Pe}] Error:`,le.message),_e++}}),console.log(`
✅ ANSWERER: Track addition complete (${ve} succeeded, ${_e} failed)`);const xe=W.current.getSenders();console.log("📤 ANSWERER: Final senders count:",xe.length),console.log("📤 ANSWERER: Senders:",xe.map((Te,Pe)=>{var le,kt,kn;return{index:Pe,kind:(le=Te.track)==null?void 0:le.kind,id:(kt=Te.track)==null?void 0:kt.id,trackExists:!!Te.track,trackEnabled:(kn=Te.track)==null?void 0:kn.enabled}}))}}else throw console.error(`
❌ ANSWERER: CRITICAL ERROR - localStreamRef.current is NULL!`),console.error("❌ ANSWERER: Cannot add tracks - stream does not exist"),new Error("ANSWERER: No local stream - cannot add tracks");console.log(`
🔄 ANSWERER: Setting remote description (offer from offerer)`),await W.current.setRemoteDescription(new RTCSessionDescription(P.offer)),console.log("✅ ANSWERER: Remote description set successfully"),console.log("🎬 ANSWERER: Creating answer");const F=await W.current.createAnswer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ ANSWERER: Answer created with receive constraints"),console.log("📋 ANSWERER SDP CHECK - Looking for a=sendrecv:");const L=F.sdp.split(`
`).filter(q=>q.includes("sendrecv")||q.includes("recvonly")||q.includes("sendonly"));console.log("   Media direction lines:"),L.forEach(q=>console.log("   ",q)),console.log("🔄 ANSWERER: Setting local description (answer)"),await W.current.setLocalDescription(F),console.log("✅ ANSWERER: Local description set successfully"),console.log(`
📋 ===== ANSWERER SENDING ANSWER =====`);const z=W.current.getSenders();console.log("📤 ANSWERER: Final senders count:",z.length),console.log("📤 ANSWERER: Sending answer with tracks:",z.map(q=>{var Z,ve,_e;return{kind:(Z=q.track)==null?void 0:Z.kind,id:(ve=q.track)==null?void 0:ve.id,enabled:(_e=q.track)==null?void 0:_e.enabled}})),console.log("🔌 CRITICAL: Offerer socket ID from offer:",P.from),console.log("🔌 SERVER sending ANSWER to:",P.from),K.emit("webrtc_answer",{answer:W.current.localDescription,to:P.from}),console.log("📤 ANSWERER: Answer emitted to offerer via socket:",P.from),console.log(`📋 ===== ANSWERER ANSWER SENT =====

`)}catch(F){console.error(`
❌ ANSWERER: ERROR in webrtc_offer handler:`,F),console.error("❌ ANSWERER: Error message:",F.message),console.error("❌ ANSWERER: Stack trace:",F.stack)}}),K.on("webrtc_answer",async P=>{console.log(`

📋 ===== OFFERER RECEIVED ANSWER =====`),console.log("📨 OFFERER: Received WebRTC answer from answerer"),console.log("📨 OFFERER: data.from (answerer socket ID):",P.from),console.log("📨 OFFERER: Answer SDP:",P.answer),pe.current=P.from,console.log("🔌 CRITICAL: Stored answerer socket ID:",pe.current);try{if(!W.current){console.error("❌ OFFERER: No peer connection available to handle answer");return}console.log(`
🔄 OFFERER: Setting remote description (answer from answerer)`),console.log("📊 OFFERER: Current connection state before answer:",{connectionState:W.current.connectionState,iceConnectionState:W.current.iceConnectionState,signalingState:W.current.signalingState}),await W.current.setRemoteDescription(new RTCSessionDescription(P.answer)),console.log("✅ OFFERER: Remote description (answer) set successfully"),console.log("📊 OFFERER: Connection state after answer:",{connectionState:W.current.connectionState,iceConnectionState:W.current.iceConnectionState,signalingState:W.current.signalingState}),console.log(`📋 ===== OFFERER ANSWER RECEIVED AND SET =====

`)}catch(F){console.error("❌ OFFERER: Error handling answer:",F),console.error("❌ OFFERER: Stack trace:",F.stack)}}),K.on("ice_candidate",async P=>{if(console.log(`
🧊 ICE candidate received from peer:`,{candidate:P.candidate,sdpMLineIndex:P.sdpMLineIndex,sdpMid:P.sdpMid}),!P.candidate||P.candidate.sdpMid==null&&P.candidate.sdpMLineIndex==null){console.warn("⚠️ Ignoring invalid ICE candidate (empty sdpMid and sdpMLineIndex)");return}try{W.current?(console.log("🧊 Adding ICE candidate to peer connection"),await W.current.addIceCandidate(new RTCIceCandidate(P.candidate)),console.log(`✅ ICE candidate added successfully
`)):console.warn("⚠️ No peer connection available for ICE candidate")}catch(F){console.error("❌ Error adding ICE candidate:",F)}}),K.on("partner_disconnected",P=>{console.log(`

🔴🔴🔴🔴🔴 ===== PARTNER DISCONNECTED EVENT RECEIVED ===== 🔴🔴🔴🔴🔴`),console.log("🔴 Event Data:",P),console.log("🔴 Timestamp:",new Date().toISOString()),console.log("🔴 Partner has closed the browser/tab"),console.log("🔴 Cleaning up WebRTC connection..."),W.current?(console.log("🔴 Closing peer connection"),console.log("   Current state:",W.current.connectionState),W.current.close(),W.current=null,console.log("🔴 Peer connection closed successfully")):console.log("🔴 WARNING: peerConnectionRef.current was null"),et.current&&(console.log("🔴 Clearing remote video ref"),et.current.srcObject=null),console.log("🔴 Calling endChat() to reset UI"),rr(),console.log("🔴🔴🔴 Cleanup complete - ready for new partner")}),K.on("disconnect",()=>{console.log("Socket disconnected"),Xr()}),console.log(`

🔌 ===== ALL SOCKET LISTENERS REGISTERED =====`),console.log("🔌 ✅ partner_found listener active"),console.log("🔌 ✅ webrtc_offer listener active"),console.log("🔌 ✅ webrtc_answer listener active"),console.log("🔌 ✅ ice_candidate listener active"),console.log("🔌 ✅ partner_disconnected listener active (CRITICAL FOR DISCONNECT)"),console.log("🔌 ✅ disconnect listener active"),console.log(`🔌 Ready to receive WebRTC signaling messages

`),()=>{console.log("🧹 Removing socket listeners on component unmount"),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("partner_disconnected"),K.off("disconnect")}),[]),C.useEffect(()=>{const P=$,F=U;return()=>{console.log(`

🧹 🧹 🧹 CHAT COMPONENT UNMOUNTING - CRITICAL CLEANUP 🧹 🧹 🧹`),P&&!F&&(console.log("🧹 User was still looking for partner - emitting cancel_matching"),K.emit("cancel_matching",{userId:ke.current,timestamp:new Date().toISOString()})),W.current&&(console.log("🧹 Closing peer connection"),W.current.close(),W.current=null),console.log("✅ Chat component cleanup complete (tracks NOT stopped - will be reused)")}},[]),C.useEffect(()=>()=>{console.log("🧹 Chat component unmounting - cleaning up peer connection only"),W.current&&(W.current.close(),W.current=null)},[]);const bi=async()=>{var P;try{console.log("🔄 Fetching TURN servers from Xirsys via backend API...");const L=await(await fetch("https://flinxx-backend.onrender.com/api/turn")).json();if(console.log("📡 Xirsys API Response:",L),(P=L==null?void 0:L.v)!=null&&P.iceServers&&Array.isArray(L.v.iceServers))return console.log("✅ TURN servers fetched from Xirsys API"),console.log("✅ iceServers is an array with",L.v.iceServers.length,"entries"),console.log("📋 ICE Servers:",L.v.iceServers),L.v.iceServers;throw console.warn("⚠️ Invalid Xirsys TURN response format"),console.log("   Expected: data.v.iceServers as array"),console.log("   Received:",L),new Error("Invalid Xirsys TURN response format")}catch(F){console.error("❌ Error fetching TURN servers from Xirsys:",F.message),console.log("🔄 Falling back to static STUN/TURN configuration");const L=CI();return console.log("📋 Using fallback ICE servers:",L),L}},xi=async()=>{if(console.log('🎬 [BUTTON CLICK] "Start Video Chat" button clicked'),console.log("🎬 [BUTTON CLICK] Current state - cameraStarted:",S,"isMatchingStarted:",$),S)S&&!$&&(console.log('🎬 [MATCHING] User clicked "Start Video Chat" again - starting matching'),console.log("🎬 [MATCHING] ⚠️ NOT reinitializing camera - stream already active"),console.log("🎬 [MATCHING] Emitting find_partner event to server"),G(!0),Nt(!0),K.emit("find_partner",{userId:ke.current,userName:he.name||"Anonymous",userAge:he.age||18,userLocation:he.location||"Unknown",userPicture:he.picture||null}),console.log("🎬 [MATCHING] ✅ find_partner event emitted - now waiting for a partner"));else{if(console.log("🎬 [BUTTON CLICK] First click - initializing camera"),console.log("🎬 [BUTTON CLICK] Checking if camera request already in progress..."),Ne){console.warn("⚠️ Camera request already in progress");return}try{Rt(!0),Nt(!0),console.log("🎬 [BUTTON CLICK] isRequestingCamera=true, isLoading=true, calling startCamera()..."),await Yr(),console.log("🎬 [BUTTON CLICK] startCamera() completed successfully"),console.log("🎬 [START] Setting cameraStarted = true (camera preview now showing)"),N(!0),Rt(!1),Nt(!1),console.log("🎬 [START] ✅ Camera initialized - user is still on home screen, matching NOT started yet")}catch(P){console.error("❌ Error initializing camera:",P),Rt(!1),Nt(!1),P.name==="NotAllowedError"?console.warn("⚠️ Camera permission denied by user"):P.name==="NotFoundError"?console.warn("⚠️ No camera device found"):P.name==="NotReadableError"&&console.warn("⚠️ Camera device is already in use by another application")}}},rr=()=>{B(!1),M(!1),g(null),Sn([]),v(0),W.current&&(W.current.close(),W.current=null),K.emit("find_partner",{userId:ke.current,userName:he.name||"Anonymous",userAge:he.age||18,userLocation:he.location||"Unknown"})},Xr=()=>{console.log("🧹 Cleaning up chat session"),W.current&&(W.current.close(),W.current=null),N(!1),B(!1),M(!1),Sn([]),v(0)},Zr=()=>(console.log("Dashboard render"),l.jsxs("div",{className:"dashboard",children:[l.jsxs("div",{className:"left-panel",children:[l.jsx("h1",{className:"logo-text",children:"Flinxx"}),l.jsxs("div",{className:"mode-switch",children:[l.jsx("button",{className:`mode-btn ${n==="solo"?"active":""}`,onClick:()=>e("solo"),children:"SoloX"}),l.jsx("button",{className:`mode-btn ${n==="duo"?"active":""}`,onClick:()=>{e("duo"),r()},children:"DuoX"})]}),l.jsx("button",{onClick:xi,disabled:Rn,className:"start-btn",children:Rn?"⟳ Loading...":"🎬 Start Video Chat"}),l.jsxs("div",{className:"top-icons",children:[l.jsx("button",{onClick:()=>_t(!0),className:"icon",title:"Profile",children:"👤"}),l.jsx("button",{onClick:()=>sn(!0),className:"icon",title:"Search",children:"🔍"}),l.jsx("button",{className:"icon",title:"Likes",children:"❤️"}),l.jsx("button",{onClick:()=>X(O==="message"?null:"message"),className:"icon",title:"Messages",children:"💬"}),l.jsx("button",{onClick:()=>E(!0),className:"icon",title:"Premium",children:"👑"}),l.jsx("button",{onClick:()=>rt(!0),className:"icon",title:"History",children:"⏱️"})]})]}),l.jsxs("div",{className:"right-panel",children:[l.jsx("div",{className:"camera-inner",children:!on&&l.jsx("div",{style:{position:"absolute",inset:0,backgroundColor:"#000",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:"12px",zIndex:1,pointerEvents:"none"},children:"Camera loading..."})}),l.jsx("div",{className:"you-label",children:"You"})]})]})),cn=()=>(C.useEffect(()=>{console.log(`

🎬 ===== WAITING SCREEN DIAGNOSTIC CHECK =====
`);const P=!!Q.current;console.log("✅ CHECK 1: Video element found?",P?"YES":"NO",Q.current);const F=!!ee.current;if(console.log("✅ CHECK 2: Local stream valid?",F?"YES":"NO",ee.current),F){const L=ee.current.getVideoTracks();if(console.log("✅ CHECK 3: Does stream have video track?",L.length>0?"YES":"NO"),L.length>0){const z=L[0];console.log("   - kind:",z.kind),console.log("   - enabled:",z.enabled),console.log("   - readyState:",z.readyState),console.log("   - id:",z.id)}}if(P&&F){const L=Q.current.srcObject===ee.current;console.log("✅ CHECK 4: Stream attached to video element?",L?"YES":"NO"),L||(console.log("   → Attaching stream to video element NOW..."),Q.current.srcObject=ee.current,Q.current.muted=!0,console.log("   → Stream attached!"))}console.log(`
🎬 ===== END DIAGNOSTIC CHECK =====

`)},[$]),l.jsxs("div",{className:"dashboard",children:[l.jsxs("div",{className:"left-panel",children:[!on&&l.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",backgroundColor:"#000",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:"12px",zIndex:0,pointerEvents:"none"},children:"Camera loading..."}),l.jsx("div",{className:"you-badge",children:"You"})]}),l.jsx("div",{className:"right-panel",children:l.jsxs("div",{className:"flex flex-col items-center justify-center text-center gap-8 py-20",children:[l.jsx("div",{className:"animate-pulse text-6xl",children:"🔍"}),l.jsxs("div",{className:"flex flex-col items-center gap-2",children:[l.jsx("h2",{className:"text-2xl font-bold",style:{color:"#d9b85f"},children:"Looking for a partner..."}),l.jsx("p",{className:"text-sm",style:{color:"#d9b85f"},children:"Matching you with someone nearby"})]}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("div",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"#d9b85f",animationDelay:"0s"}}),l.jsx("div",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"#d9b85f",animationDelay:"0.2s"}}),l.jsx("div",{className:"w-2 h-2 rounded-full animate-bounce",style:{backgroundColor:"#d9b85f",animationDelay:"0.4s"}})]}),l.jsx("button",{onClick:()=>{console.log("🔙 Cancel matching - emitting cancel_matching event"),K.emit("cancel_matching",{userId:ke.current,timestamp:new Date().toISOString()}),G(!1),Nt(!1)},className:"w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg mt-4",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f"},children:"Cancel Search"})]})})]})),sr=()=>l.jsx("video",{ref:Q,autoPlay:!0,muted:!0,playsInline:!0,className:"global-local-video"}),ir=()=>(console.log("🎬 VideoChatScreen rendering - partnerInfo:",{exists:!!I,userName:I==null?void 0:I.userName,userLocation:I==null?void 0:I.userLocation,picture:!!(I!=null&&I.picture),fullObject:I}),console.log("🎬 currentUser for comparison:",{name:he==null?void 0:he.name,location:he==null?void 0:he.location,picture:!!(he!=null&&he.picture)}),l.jsxs("div",{className:"dashboard",children:[l.jsxs("div",{className:"w-full max-w-5xl flex gap-6 flex-1",children:[l.jsx("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:l.jsxs("div",{id:"remote-video-wrapper",style:{position:"absolute",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",zIndex:1,overflow:"hidden",backgroundColor:"black",display:"flex",alignItems:"center",justifyContent:"center"},children:[l.jsx("video",{id:"remote-video-singleton",ref:et,autoPlay:!0,playsInline:!0,muted:!0,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",backgroundColor:"black",display:U?"block":"none",zIndex:10}}),!U&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000000",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1},children:l.jsx("p",{style:{color:"#d9b85f",fontSize:"14px"},children:"Waiting for partner video..."})}),U&&l.jsxs("div",{className:"absolute top-4 left-4 flex items-center gap-3 z-50 backdrop-blur-sm px-3 py-2 rounded-xl",style:{backgroundColor:"rgba(0, 0, 0, 0.6)"},children:[l.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 overflow-hidden",children:I&&I.picture?l.jsx("img",{src:I.picture,alt:"Partner",className:"w-full h-full object-cover"}):"👤"}),l.jsxs("div",{className:"min-w-0",children:[l.jsx("p",{className:"font-semibold text-sm",style:{color:"#d9b85f"},children:I?I.userName:"Partner"}),l.jsx("p",{className:"text-xs",style:{color:"#d9b85f"},children:I?I.userLocation:"Online"})]})]}),ue&&U&&l.jsxs("div",{className:"absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold z-50 shadow-lg px-3 py-2 rounded-full",style:{backgroundColor:"rgba(217, 184, 95, 0.9)",color:"#0f0f0f"},children:[l.jsx("span",{className:"w-2 h-2 rounded-full animate-pulse",style:{backgroundColor:"#0f0f0f"}}),SI(m)]})]})}),l.jsxs("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:[!on&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:"12px",zIndex:0},children:"Camera loading..."}),l.jsx("div",{className:"you-badge",style:{zIndex:2},children:"You"})]})]}),l.jsxs("div",{className:"w-full max-w-5xl flex items-center justify-center gap-4 pb-4",style:{backgroundColor:"transparent"},children:[l.jsx("button",{onClick:()=>{console.log("Skip pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⏭ Skip"}),l.jsx("button",{onClick:()=>{console.log("Next pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⏭ Next"}),l.jsx("button",{onClick:()=>{console.log("Report pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⚠️ Report"})]})]}));return l.jsxs(l.Fragment,{children:[u&&l.jsx(td,{onCancel:ln,onContinue:Ei}),f?l.jsxs("div",{className:"flex flex-col h-screen w-screen overflow-visible min-h-0",style:{backgroundColor:"#0f0f0f",overflow:"visible",position:"relative"},children:[l.jsx(sr,{}),U?l.jsx(ir,{}):$?l.jsx(cn,{}):l.jsx(Zr,{}),l.jsx(RI,{isOpen:w,onClose:()=>E(!1)}),l.jsx(kI,{isOpen:$e,onClose:()=>_t(!1),onOpenPremium:()=>E(!0),onReinitializeCamera:(wt=Qr.current)==null?void 0:wt.reinitializeCamera}),l.jsx(PI,{isOpen:Ze,onClose:()=>rt(!1)}),l.jsx(pc,{isOpen:rn,onClose:()=>sn(!1),mode:"search",onUserSelect:P=>{console.log("Selected user from search:",P)}}),l.jsx(pc,{isOpen:O!==null,onClose:()=>X(null),mode:O==="message"?"message":"notifications"}),l.jsx(NI,{isOpen:_,onClose:()=>re(!1),currentGender:ne,onOpenPremium:()=>E(!0)}),Jr&&l.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:l.jsxs("div",{className:"bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl",children:[l.jsx("h3",{className:"text-2xl font-bold text-white mb-4 text-center",children:"⏱️ Time's Up!"}),l.jsx("p",{className:"text-white/90 text-center mb-4",children:"Your 2-minute guest preview has ended. Redirecting to login..."}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsx("div",{className:"animate-spin text-4xl",children:"⟳"})})]})})]}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsx("div",{className:"text-center text-white",children:l.jsx("p",{children:"Loading..."})})})]})},jI=()=>{const n=ot(),[e,t]=C.useState(5),[r,s]=C.useState(!0),[o,a]=C.useState([{id:1,username:"Alex_24",name:"Alex",age:24,country:"USA",avatar:"👨",status:"Online"},{id:2,username:"Jordan_22",name:"Jordan",age:22,country:"UK",avatar:"👩",status:"Online"},{id:3,username:"Casey_25",name:"Casey",age:25,country:"Canada",avatar:"🧑",status:"Online"},{id:4,username:"Morgan_23",name:"Morgan",age:23,country:"Australia",avatar:"👩‍🦱",status:"Online"},{id:5,username:"Taylor_26",name:"Taylor",age:26,country:"Germany",avatar:"👨‍🦲",status:"Online"},{id:6,username:"Alex_27",name:"Alex",age:27,country:"France",avatar:"👨",status:"Online"},{id:7,username:"Sam_21",name:"Sam",age:21,country:"Canada",avatar:"👩",status:"Online"},{id:8,username:"Chris_28",name:"Chris",age:28,country:"Japan",avatar:"👨‍🦱",status:"Online"}]),[u,h]=C.useState(0),f=C.useRef(null);C.useEffect(()=>(r&&e>0?f.current=setTimeout(()=>{t(S=>S-1)},1e3):r&&e===0&&(y(),t(5)),()=>clearTimeout(f.current)),[e,r]);const y=()=>{u<o.length-1?(h(S=>S+1),t(5),s(!0)):(h(0),t(5),s(!0))},b=()=>{y()},x=()=>{K.emit("connect_user",{targetUserId:o[u].id}),n("/chat")},A=o[u],k=o[(u+1)%o.length];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:_i,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-8",children:l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"relative h-[600px] mb-8",children:[l.jsx("div",{className:"absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 transform scale-95 translate-y-4 opacity-50",children:l.jsxs("div",{className:"h-full flex flex-col justify-between",children:[l.jsxs("div",{children:[l.jsxs("h3",{className:"text-white font-bold text-xl mb-2",children:[k.name,", ",k.age]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["📍 ",k.country]})]}),l.jsx("div",{className:"text-center opacity-50",children:l.jsx("p",{className:"text-white/50 text-sm",children:"Next up..."})})]})}),l.jsxs("div",{className:"absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md rounded-3xl border-2 border-white/30 p-8 flex flex-col justify-between shadow-2xl hover:border-white/50 transition-all duration-300",children:[l.jsx("div",{className:"flex justify-center mb-6",children:l.jsx("div",{className:"w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-blue-600/50 border-4 border-white/40 text-white",children:A.avatar})}),l.jsxs("div",{children:[l.jsx("h2",{className:"text-white font-black text-3xl mb-1",children:A.name}),l.jsx("p",{className:"text-white/90 text-2xl font-bold mb-2",children:A.age}),l.jsxs("p",{className:"text-white/80 text-base mb-2",children:["📍 ",A.country]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["@",A.username]}),l.jsx("div",{className:"space-y-3",children:l.jsxs("div",{className:"bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20",children:[l.jsx("p",{className:"text-white/70 text-xs",children:"Status"}),l.jsxs("p",{className:"text-white font-bold text-sm",children:["🟢 ",A.status]})]})})]}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsxs("div",{className:"relative w-20 h-20",children:[l.jsxs("svg",{className:"w-20 h-20 transform -rotate-90",children:[l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"white",strokeWidth:"2",opacity:"0.2"}),l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"url(#gradient)",strokeWidth:"2",strokeDasharray:`${(5-e)/5*226.2} 226.2`,className:"transition-all duration-1000"}),l.jsx("defs",{children:l.jsxs("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[l.jsx("stop",{offset:"0%",stopColor:"#fbbf24"}),l.jsx("stop",{offset:"100%",stopColor:"#f59e0b"})]})})]}),l.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:l.jsx("span",{className:"text-white font-black text-2xl",children:e})})]})}),r&&l.jsx("div",{className:"text-center",children:l.jsxs("p",{className:"text-blue-400 text-sm font-semibold animate-pulse",children:["⚡ Auto-next in ",e,"s"]})})]})]}),l.jsxs("div",{className:"flex gap-4 justify-center",children:[l.jsx("button",{onClick:b,className:"flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 rounded-full font-bold text-white transition-all transform hover:scale-105 backdrop-blur",children:"👉 Skip"}),l.jsx("button",{onClick:x,className:"flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-105",children:"💬 Connect"})]}),l.jsx("div",{className:"mt-6 flex justify-center",children:l.jsx("button",{onClick:()=>s(!r),className:`px-6 py-2 rounded-full font-semibold text-sm transition-all ${r?"bg-blue-600/30 text-blue-200 border border-blue-400/50":"bg-white/10 text-white/70 border border-white/20"}`,children:r?"⚡ Auto-Next ON":"⏸️ Auto-Next OFF"})}),l.jsx("div",{className:"mt-4 text-center",children:l.jsxs("p",{className:"text-white/70 text-sm",children:["Showing ",u+1," of ",o.length," profiles"]})})]})})]})},DI=()=>{const n=ot(),{user:e}=C.useContext(St)||{},r=(localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null)||e||{name:"Guest User",email:"guest@flinxx.local",picture:null,googleId:"N/A"};console.log("👤 Profile Component - Loaded User:",r);const[s,o]=C.useState({username:(r==null?void 0:r.name)||"User",age:(r==null?void 0:r.age)||24,country:(r==null?void 0:r.location)||"Unknown",bio:"Welcome to my profile",avatar:"👨",gender:"Not specified",status:"Looking to chat",email:(r==null?void 0:r.email)||"",displayName:(r==null?void 0:r.name)||"",photoURL:(r==null?void 0:r.picture)||"",userId:(r==null?void 0:r.userId)||"N/A"}),[a,u]=C.useState(!0);C.useEffect(()=>{(async()=>{try{if(!(r!=null&&r.email)){console.log("⚠️ No user email found, using localStorage data only"),console.log("📋 Profile from localStorage:",{name:r==null?void 0:r.name,email:r==null?void 0:r.email,picture:r==null?void 0:r.picture,googleId:r==null?void 0:r.googleId}),u(!1);return}const N="https://flinxx-backend.onrender.com";console.log(`📋 Profile Component - Fetching from: ${N}/api/user/profile?email=${r.email}`);const $=await fetch(`${N}/api/user/profile?email=${encodeURIComponent(r.email)}`,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!$.ok)throw new Error(`Failed to fetch profile: ${$.status}`);const G=await $.json();console.log("✅ Profile data fetched from backend:",G.profile),G.profile?o(U=>({...U,email:G.profile.email||r.email||U.email,displayName:G.profile.name||r.name||U.displayName,photoURL:G.profile.picture||r.picture||U.photoURL,userId:G.profile.id||U.userId})):o(U=>({...U,email:r.email||U.email,displayName:r.name||U.displayName,photoURL:r.picture||U.photoURL,userId:r.userId||U.userId}))}catch(N){console.error("❌ Error fetching profile:",N),o($=>({...$,email:r.email||$.email,displayName:r.name||$.displayName,photoURL:r.picture||$.photoURL,userId:r.userId||$.userId}))}finally{u(!1)}})()},[r==null?void 0:r.email]);const[h,f]=C.useState(!1),[y,b]=C.useState(s),x=S=>{const{name:N,value:$}=S.target;b(G=>({...G,[N]:N==="age"?parseInt($):$}))},A=()=>{o(y),f(!1),console.log("Profile saved:",y)},k=["👨","👩","👦","👧","🧑","👨‍🦱","👩‍🦱","👨‍🦲","👩‍🦲"];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:_i,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 px-4 py-12",children:l.jsxs("div",{className:"max-w-2xl mx-auto",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8",children:[l.jsxs("div",{className:"flex flex-col items-center mb-8",children:[s.photoURL&&!h?l.jsx("div",{className:"w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/50 mb-6 border-4 border-white/30 overflow-hidden",children:l.jsx("img",{src:s.photoURL,alt:"Profile",className:"w-full h-full object-cover"})}):l.jsx("div",{className:"w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-7xl shadow-2xl shadow-blue-600/50 mb-6 border-4 border-white/30",children:h?l.jsx("div",{className:"grid grid-cols-3 gap-2 p-4",children:k.map(S=>l.jsx("button",{onClick:()=>b(N=>({...N,avatar:S})),className:`text-3xl p-2 rounded-lg transition-all ${y.avatar===S?"bg-white/30 border-2 border-white scale-110":"bg-white/10 hover:bg-white/20"}`,children:S},S))}):s.avatar}),!h&&l.jsx("p",{className:"text-white/70 text-sm",children:"Click Edit to change avatar"})]}),h?l.jsxs("div",{className:"space-y-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("input",{type:"text",name:"displayName",value:y.displayName,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your full name"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("input",{type:"email",name:"email",value:y.email,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your email"})]}),y.userId&&y.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID (Read-only)"}),l.jsx("input",{type:"text",value:y.userId,disabled:!0,className:"w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("input",{type:"text",name:"username",value:y.username,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsx("input",{type:"number",name:"age",value:y.age,onChange:x,min:"18",max:"100",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsx("input",{type:"text",name:"country",value:y.country,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsxs("select",{name:"gender",value:y.gender,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Male",children:"Male"}),l.jsx("option",{value:"Female",children:"Female"}),l.jsx("option",{value:"Other",children:"Other"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("textarea",{name:"bio",value:y.bio,onChange:x,rows:"4",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("select",{name:"status",value:y.status,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Looking to chat",children:"Looking to chat"}),l.jsx("option",{value:"Making friends",children:"Making friends"}),l.jsx("option",{value:"Just browsing",children:"Just browsing"})]})]}),l.jsxs("div",{className:"flex gap-4 pt-6",children:[l.jsx("button",{onClick:()=>{f(!1),b(s)},className:"flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all",children:"Cancel"}),l.jsx("button",{onClick:A,className:"flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"Save Profile"})]})]}):l.jsxs("div",{className:"space-y-6",children:[s.displayName&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.displayName})]}),s.email&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("p",{className:"text-white font-normal text-base mt-2",children:s.email})]}),s.userId&&s.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("p",{className:"text-white font-mono text-sm",children:s.userId}),l.jsx("button",{onClick:()=>navigator.clipboard.writeText(s.userId),className:"text-white/70 hover:text-white transition",title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.username})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:[s.age," years old"]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:["🌍 ",s.country]})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsx("p",{className:"text-white font-bold text-lg mt-2",children:s.gender})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("p",{className:"text-white/90 text-base mt-2",children:s.bio})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("span",{className:"w-3 h-3 bg-green-400 rounded-full animate-pulse"}),l.jsx("p",{className:"text-white font-semibold",children:s.status})]})]}),l.jsx("button",{onClick:()=>f(!0),className:"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"✏️ Edit Profile"})]})]}),l.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Matches"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"24"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Chats"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"8"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Time Online"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"42h"})]})]})]})})]})},LI=({value:n,onChange:e,maxDate:t})=>{const r=t?`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`:null;return l.jsx("input",{type:"date",value:n||"",onChange:s=>e(s.target.value),max:r,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900",placeholder:"",required:!0})},id=({user:n,onProfileComplete:e,isOpen:t})=>{const[r,s]=C.useState(""),[o,a]=C.useState(""),[u,h]=C.useState(null),[f,y]=C.useState(null),[b,x]=C.useState(!1),A=ot();C.useEffect(()=>{if(r){const[N,$,G]=r.split("-").map(Number),U=new Date(N,$-1,G),B=new Date;let ue=B.getFullYear()-U.getFullYear();const M=B.getMonth()-U.getMonth();(M<0||M===0&&B.getDate()<U.getDate())&&ue--,h(ue)}else h(null)},[r]);const k=!r||!o||b,S=async N=>{if(N.preventDefault(),!r||!o){y("Please fill in all required fields");return}if(u&&u<18){y("You must be 18+ to use this app");return}x(!0),y(null);try{const $="https://flinxx-backend.onrender.com",G=n.id||n.uid||n.googleId;if(!G)throw new Error("Unable to determine user ID");const U=await fetch(`${$}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:G,birthday:r||null,gender:o})}),B=await U.json();if(!U.ok){if(B.code==="UNDERAGE_USER"){y("You must be 18+ to use this app");return}y(B.error||"Failed to save profile");return}console.log("✅ Profile saved successfully:",B);const ue={...n,profileCompleted:!0,isProfileCompleted:!0,birthday:r,gender:o,age:u};localStorage.setItem("profileCompleted","true"),localStorage.setItem("user",JSON.stringify(ue)),e&&e(ue),setTimeout(()=>{A("/chat?view=home")},500)}catch($){console.error("❌ Error saving profile:",$),y($.message||"Network error. Please try again.")}finally{x(!1)}};return!t||!n?null:l.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto",children:l.jsx("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 my-8",children:l.jsxs("div",{className:"p-8",children:[l.jsxs("div",{className:"text-center mb-6",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Complete Your Profile"}),l.jsx("p",{className:"text-gray-600 text-sm",children:"Just a few more details to get started"})]}),l.jsx("div",{className:"flex justify-center mb-6",children:n.picture||n.photoURL?l.jsx("img",{src:n.picture||n.photoURL,alt:n.name||n.displayName,className:"w-20 h-20 rounded-full object-cover border-4 border-blue-500"}):l.jsx("div",{className:"w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500",children:l.jsx("span",{className:"text-gray-600 text-2xl",children:"👤"})})}),f&&l.jsx("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-lg",children:l.jsx("p",{className:"text-red-700 text-sm font-medium",children:f})}),l.jsxs("form",{onSubmit:S,className:"space-y-4",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Name"}),l.jsx("input",{type:"text",value:n.name||n.displayName||"",disabled:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Birthday ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsx(LI,{value:r,onChange:s,maxDate:new Date}),u!==null&&l.jsxs("p",{className:"text-xs text-gray-600 mt-1",children:["Age: ",l.jsxs("span",{className:u<18?"text-red-600 font-bold":"text-green-600 font-bold",children:[u," years old"]})]})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Gender ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsxs("select",{value:o,onChange:N=>a(N.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 appearance-none cursor-pointer",style:{backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 0.75rem center",backgroundSize:"1.5em 1.5em",paddingRight:"2.5rem"},required:!0,children:[l.jsx("option",{value:"",disabled:!0,children:"Select gender"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"})]})]}),l.jsx("button",{type:"submit",disabled:k,className:`w-full py-3 px-4 rounded-lg font-medium transition mt-6 ${k?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:b?l.jsxs("span",{className:"flex items-center justify-center",children:[l.jsx("span",{className:"inline-block animate-spin mr-2",children:"⏳"}),"Saving..."]}):"Save Profile"})]}),l.jsx("p",{className:"text-xs text-gray-500 text-center mt-4",children:"Your birthday and gender cannot be changed after saving."})]})})})};function MI(){const n=ot(),[e]=mc(),[t,r]=C.useState(!1),[s,o]=C.useState(null);C.useEffect(()=>{try{const u=e.get("token"),h=e.get("user"),f=e.get("error");if(console.log("🔐 Callback - Token:",u),console.log("👤 Callback - User:",h),f){console.error("❌ OAuth Error:",f),n("/login?error="+encodeURIComponent(f),{replace:!0});return}if(u&&h)try{const y=JSON.parse(h);localStorage.setItem("token",u),localStorage.setItem("authToken",u),localStorage.setItem("user",JSON.stringify(y)),localStorage.setItem("authProvider","google"),localStorage.setItem("userInfo",JSON.stringify(y)),console.log("✅ User data saved:",y),y.isProfileCompleted?(console.log("✅ Profile completed, redirecting to chat..."),setTimeout(()=>{n("/chat")},500)):(console.log("ℹ️ Profile not completed, showing setup modal"),o(y),r(!0))}catch(y){console.error("❌ Error parsing user data:",y),n("/login?error=invalid_user_data",{replace:!0})}else console.error("❌ Missing token or user data"),n("/login?error=missing_data",{replace:!0})}catch(u){console.error("❌ Callback error:",u),n("/login?error="+encodeURIComponent(u.message),{replace:!0})}},[e,n]);const a=u=>{console.log("✅ Profile completed, redirecting to chat"),r(!1),setTimeout(()=>{n("/chat")},500)};return t&&s?l.jsx(id,{user:s,onProfileComplete:a,isOpen:!0}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}function VI(){const n=ot(),{setAuthToken:e}=C.useContext(St)||{},[t]=mc(),[r,s]=C.useState(null),[o,a]=C.useState(!0),[u,h]=C.useState(null);return C.useEffect(()=>{(async()=>{var y,b,x;try{const A=t.get("token"),k=t.get("data");if(!A){h("No authentication token received"),a(!1);return}console.log("🔐 Auth Success - Token received:",A.substring(0,10)+"...");let S=null;if(k)try{S=JSON.parse(decodeURIComponent(k)),console.log("✅ Response data from backend:",S)}catch(B){console.warn("⚠️ Could not parse response data:",B)}const N=JSON.parse(atob(A)),G=await fetch(`https://flinxx-backend.onrender.com/auth-success?token=${A}`);if(!G.ok)throw new Error(`Failed to fetch user data: ${G.statusText}`);const U=await G.json();if(console.log("✅ User data received:",U.user.email),U.success&&U.user){const B=U.user;let ue=null;if(B.uuid&&typeof B.uuid=="string"&&B.uuid.length===36)ue=B.uuid,console.log("✅ Valid UUID found in user.uuid:",ue.substring(0,8)+"...");else if(B.id&&typeof B.id=="string"&&B.id.length===36)ue=B.id,console.log("✅ Valid UUID found in user.id (fallback):",ue.substring(0,8)+"...");else{console.error("❌ CRITICAL: No valid 36-char UUID found in backend response"),console.error("   user.uuid:",B.uuid,"(type:",typeof B.uuid+", length:",((y=B.uuid)==null?void 0:y.length)+")"),console.error("   user.id:",B.id,"(type:",typeof B.id+", length:",((b=B.id)==null?void 0:b.length)+")"),console.error("   Full response:",B),h("Authentication failed: Invalid UUID from server"),a(!1);return}const M={uuid:ue,name:B.name||B.display_name||"User",email:B.email,picture:B.picture||B.photo_url,profileCompleted:B.profileCompleted||!1};console.log("✅ User data normalized for storage (UUID ONLY):",{uuid:M.uuid.substring(0,8)+"...",email:M.email}),e?(console.log("[AuthSuccess] Storing token and user via AuthContext"),e(A,M)):(console.log("[AuthSuccess] AuthContext not available, saving to localStorage directly"),localStorage.setItem("token",A),localStorage.setItem("authToken",A),localStorage.setItem("user",JSON.stringify(M)),localStorage.setItem("authProvider","google"));const I=JSON.parse(localStorage.getItem("user")||"{}");console.log("✅ VERIFICATION - localStorage.user contents:",{has_uuid:!!I.uuid,uuid_length:(x=I.uuid)==null?void 0:x.length,has_id:!!I.id,has_email:!!I.email}),s(B),console.log("🔗 Routing all users to /chat (unified dashboard)"),setTimeout(()=>{n("/chat")},500)}else h(U.error||"Failed to authenticate")}catch(A){console.error("❌ Auth Success Error:",A),h(A.message||"An error occurred during authentication")}finally{a(!1)}})()},[t,n,e]),u?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-white text-2xl font-bold mb-4",children:"❌ Authentication Error"}),l.jsx("p",{className:"text-white/70 text-lg mb-6",children:u}),l.jsx("button",{onClick:()=>n("/login",{replace:!0}),className:"px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100",children:"Back to Login"})]})}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}const gc=()=>{const n=ot();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:_i,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Terms & Conditions"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("p",{className:"text-sm text-white/70 italic",children:"Last Updated: December 21, 2025"}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"1. Acceptance of Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:'By accessing and using the Flinxx platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"2. Use License"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"Permission is granted to temporarily download one copy of the materials (information or software) on Flinxx for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Modifying or copying the materials"}),l.jsx("li",{children:"Using the materials for any commercial purpose or for any public display"}),l.jsx("li",{children:"Attempting to decompile or reverse engineer any software contained on the Service"}),l.jsx("li",{children:"Removing any copyright or other proprietary notations from the materials"}),l.jsx("li",{children:'Transferring the materials to another person or "mirroring" the materials on any other server'}),l.jsx("li",{children:"Violating any laws or regulations applicable to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"3. Age Restriction"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"You must be at least 18 years of age to use this Service. By using Flinxx, you represent and warrant that you are at least 18 years old and have the legal right to use the platform in your jurisdiction."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"4. Disclaimer"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials on Flinxx are provided on an 'as is' basis. Flinxx makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"5. Limitations"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Flinxx, even if Flinxx or a Flinxx authorized representative has been notified orally or in writing of the possibility of such damage."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"6. Accuracy of Materials"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials appearing on Flinxx could include technical, typographical, or photographic errors. Flinxx does not warrant that any of the materials on its Service are accurate, complete, or current. Flinxx may make changes to the materials contained on the Service at any time without notice."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"7. User Conduct"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"You agree that you will not engage in any conduct that:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Violates any applicable law or regulation"}),l.jsx("li",{children:"Infringes upon or violates any intellectual property rights"}),l.jsx("li",{children:"Harasses, abuses, or threatens other users"}),l.jsx("li",{children:"Uploads malware, viruses, or other harmful code"}),l.jsx("li",{children:"Impersonates any person or entity"}),l.jsx("li",{children:"Shares non-consensual intimate content"}),l.jsx("li",{children:"Attempts to gain unauthorized access to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"8. Materials License"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By posting materials to Flinxx, you grant Flinxx a worldwide, royalty-free license to use, reproduce, modify and publish that material in any form, in any media now known or hereafter discovered. However, this license does not extend to any materials posted by other users."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"9. Limitations of Liability"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx, its employees, agents, suppliers, or any other affiliated parties be liable to you or any third party for any direct, indirect, consequential, special, or punitive damages whatsoever, including without limitation, damages for loss of profits, loss of use, business interruption, or loss of data, even if Flinxx has been advised of the possibility of such damages."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"10. Privacy Policy"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your use of Flinxx is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"11. Termination"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may terminate or suspend your account and access to the Service at any time, for any reason, without notice. Upon termination, your right to use the Service will immediately cease. You remain liable for all charges incurred through the date of termination."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"12. Modifications to Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service. If you do not agree to any of these terms, or any revised terms, please stop using the Service."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"13. Governing Law"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Flinxx operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"14. Contact Information"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you have any questions about these Terms & Conditions, please contact us at: support@flinxx.com"})]}),l.jsx("div",{className:"pt-6 border-t border-white/20",children:l.jsx("p",{className:"text-sm text-white/70",children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},FI=()=>{const n=ot();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:_i,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Privacy Policy"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By accessing or using Flinxx, you agree to this Privacy Policy."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is a live interaction platform where users and streamers communicate in real time. Due to the nature of live content, complete privacy cannot be guaranteed."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx hosts multiple streamers and users. You understand that any user or streamer may record video, audio, or interactions without your consent and may upload or share such content on external platforms. You are solely responsible for your own privacy and actions. Flinxx provides no guarantee or control over such recordings or uploads."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your video, audio, messages, and interactions may also be recorded, stored, reviewed, or used by Flinxx for safety, moderation, legal compliance, marketing, promotional, or platform improvement purposes. By continuing, you give your full consent."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is not responsible or liable for screenshots, screen recordings, re-uploads, misuse, or distribution of content by users or streamers outside the platform. You agree that you use Flinxx at your own risk."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"We do not guarantee the behavior, conduct, or content of any user or streamer. Flinxx shall not be held liable for any loss, damage, harassment, or misuse arising from live interactions."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Basic information such as device data, usage activity, and login details may be collected to operate, secure, and improve the platform."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you do not agree with this Privacy Policy, please discontinue use of Flinxx immediately."})}),l.jsx("div",{className:"text-sm text-white/50 italic pt-6 border-t border-white/20",children:l.jsx("p",{children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},UI=({children:n})=>{const e=ot(),t=C.useContext(St),r=t==null?void 0:t.user,s=t==null?void 0:t.isLoading,[o,a]=C.useState(!1),[u,h]=C.useState(null),[f,y]=C.useState(!0);console.log(`
[ProtectedChatRoute] 🟢 RENDER CALLED`),console.log("[ProtectedChatRoute]   - isLoading:",f),console.log("[ProtectedChatRoute]   - showProfileSetup:",o),console.log("[ProtectedChatRoute]   - authLoading:",s),console.log("[ProtectedChatRoute]   - authUser:",r?r.email:"null"),C.useEffect(()=>{console.log(`

🔴 [ProtectedChatRoute] ═══════════════════════════════════════════`),console.log("🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK"),console.log("🔴 [ProtectedChatRoute] ═══════════════════════════════════════════"),console.log("🔴 [ProtectedChatRoute] Effect dependencies changed:"),console.log("🔴 [ProtectedChatRoute]   - authLoading:",s),console.log("🔴 [ProtectedChatRoute]   - authUser:",r?r.email:"null");try{if(s===!0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext is still initializing (isLoading=true)"),y(!0);return}if(s===void 0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext loading state is undefined"),y(!0);return}if(console.log("🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)"),!r){console.log("🔴 [ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found"),console.log("🔴 [ProtectedChatRoute] Redirecting to /login"),y(!1),e("/login",{replace:!0});return}console.log("🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user:",r.email),console.log("🔴 [ProtectedChatRoute] authUser object:",{id:r.id,email:r.email,profileCompleted:r.profileCompleted,birthday:r.birthday,gender:r.gender}),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted type:",typeof r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted value:",r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted === true?",r.profileCompleted===!0);const x=localStorage.getItem("user");if(console.log("🔴 [ProtectedChatRoute] Checking localStorage:"),console.log("🔴 [ProtectedChatRoute]   - user key exists:",!!x),x)try{const N=JSON.parse(x);console.log("🔴 [ProtectedChatRoute] localStorage user:",{id:N.id,email:N.email,profileCompleted:N.profileCompleted}),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted type:",typeof N.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted value:",N.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted === true?",N.profileCompleted===!0)}catch(N){console.error("[ProtectedChatRoute] Failed to parse localStorage user:",N)}else console.log("[ProtectedChatRoute] ⚠️ No user in localStorage");h(r),console.log(`
🔴 [ProtectedChatRoute] PROFILE COMPLETION CHECK:`);const A=r==null?void 0:r.profileCompleted;console.log("🔴 [ProtectedChatRoute]   Source 1 (AuthContext):"),console.log("🔴 [ProtectedChatRoute]     authUser.profileCompleted =",A),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof A),console.log("🔴 [ProtectedChatRoute]     === true?",A===!0);let k=null;x?(k=JSON.parse(x).profileCompleted,console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage):"),console.log("🔴 [ProtectedChatRoute]     localStorage.profileCompleted =",k),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof k),console.log("🔴 [ProtectedChatRoute]     === true?",k===!0)):console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage): not available");const S=A===!0||k===!0;console.log(`
🔴 [ProtectedChatRoute] FINAL DECISION:`),console.log("🔴 [ProtectedChatRoute]   profileCompletedAuth === true?",A===!0),console.log("🔴 [ProtectedChatRoute]   profileCompletedStorage === true?",k===!0),console.log("🔴 [ProtectedChatRoute]   isProfileComplete (final):",S),S?(console.log(`
🔴 [ProtectedChatRoute] ✅ DECISION: Profile IS completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING Chat page
`)):(console.log(`
🔴 [ProtectedChatRoute] ❌ DECISION: Profile NOT completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal
`),a(!0)),y(!1)}catch(x){console.error("[ProtectedChatRoute] ❌ ERROR in profile check:",x),console.error("[ProtectedChatRoute] Stack:",x.stack),y(!1),e("/login",{replace:!0})}},[e,r,s]);const b=x=>{console.log("Profile completed:",x),a(!1),h(x)};return f?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Loading..."})]})}):l.jsxs(l.Fragment,{children:[o&&u&&l.jsx(id,{user:u,onProfileComplete:b,isOpen:!0}),!o&&n]})},BI=({isOpen:n=!0,onClose:e})=>{const{user:t}=C.useContext(St)||{},{markAsRead:r}=C.useContext(ca)||{},{refetchUnreadCount:s}=ga()||{},[o,a]=C.useState(null),[u,h]=C.useState(null),f=C.useRef(!1);C.useEffect(()=>{console.log("🎯 MyDuoSquad mounted")},[]),C.useEffect(()=>{if(o!==null||f.current||!n||!(t!=null&&t.uuid))return;(async()=>{try{const A=await Fh(t.uuid),k=Array.isArray(A)?A.sort((S,N)=>{const $=S.last_message_at?new Date(S.last_message_at):new Date(0);return(N.last_message_at?new Date(N.last_message_at):new Date(0))-$}):[];a(k),f.current=!0}catch(A){console.error("❌ Failed to fetch accepted friends:",A),a([]),f.current=!0}})()},[n,t==null?void 0:t.uuid]);const y=(x,A)=>{a(k=>k.map(N=>N.id===x?{...N,last_message_at:A}:N).sort((N,$)=>{const G=N.last_message_at?new Date(N.last_message_at):new Date(0);return($.last_message_at?new Date($.last_message_at):new Date(0))-G})),s&&s()},b=async x=>{try{t!=null&&t.uuid&&t.uuid.length===36&&x.id&&await Xs(t.uuid,x.id),r&&x.id&&r(x.id),h(x),s&&s()}catch(A){console.error("❌ Error marking messages as read:",A),h(x)}};return l.jsxs("div",{className:"duo-panel w-full h-full rounded-3xl p-8 flex flex-col items-start justify-start text-left relative",style:{backgroundColor:"#131313",border:"1px solid #d9b85f",overflow:"hidden",display:"flex",flexDirection:"column"},children:[l.jsx("button",{className:"modal-close-btn",onClick:e,title:"Close",children:"✕"}),l.jsx("div",{className:"w-full mb-6",children:l.jsx("h3",{className:"text-2xl font-bold",style:{color:"#d9b85f"},children:"My Duo Squad"})}),l.jsx("div",{className:"duo-friends-list",style:{flex:1,width:"100%",overflowY:"auto"},children:u?l.jsx(To,{friend:u,onBack:()=>h(null),onMessageSent:y}):o===null?l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"20px"},children:"Loading squad..."}):o.length===0?l.jsxs("div",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"20px"},children:[l.jsx("p",{children:"No squad members yet"}),l.jsx("p",{style:{fontSize:"12px",marginTop:"8px"},children:"Add friends to build your duo squad"})]}):o.map(x=>l.jsxs("div",{className:"notification-item",style:{marginBottom:"0"},children:[l.jsx("div",{className:"notification-avatar",children:x.photo_url?l.jsx("img",{src:x.photo_url,alt:x.display_name}):l.jsx("div",{className:"text-avatar",children:x.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:x.display_name})}),l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:()=>b(x),title:"Send a message",children:"Message"})})]},x.id))})]})};function $I(){const{isDuoSquadOpen:n,closeDuoSquad:e}=sd();return l.jsxs(l.Fragment,{children:[n&&l.jsx("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999},children:l.jsx(BI,{isOpen:n,onClose:e})}),l.jsx("div",{style:{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column"},children:l.jsxs(Sd,{children:[l.jsx(ht,{path:"/",element:l.jsx(_I,{})}),l.jsx(ht,{path:"/login",element:l.jsx(xI,{})}),l.jsx(ht,{path:"/terms",element:l.jsx(gc,{})}),l.jsx(ht,{path:"/terms-and-conditions",element:l.jsx(gc,{})}),l.jsx(ht,{path:"/privacy-policy",element:l.jsx(FI,{})}),l.jsx(ht,{path:"/callback",element:l.jsx(MI,{})}),l.jsx(ht,{path:"/auth-success",element:l.jsx(VI,{})}),l.jsx(ht,{path:"/chat",element:l.jsx(UI,{children:l.jsx(OI,{})})}),l.jsx(ht,{path:"/matching",element:l.jsx(jI,{})}),l.jsx(ht,{path:"/profile",element:l.jsx(DI,{})}),l.jsx(ht,{path:"*",element:l.jsx(qI,{})})]})})]})}function GI(){return l.jsx(yI,{children:l.jsx(TI,{children:l.jsx(Cd,{children:l.jsx($I,{})})})})}const qI=()=>l.jsx("div",{className:"min-h-screen flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-5xl font-bold text-indigo-400 mb-4",children:"404"}),l.jsx("p",{className:"text-gray-300 mb-8",children:"Page not found"}),l.jsx("button",{onClick:()=>window.location.href="/",className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer",children:"Go Home"})]})});function HI(){return l.jsx("div",{style:{width:"100%",height:"100vh"},children:l.jsx(GI,{})})}Xi.createRoot(document.getElementById("root")).render(l.jsx(Zs.StrictMode,{children:l.jsx(Md,{clientId:"373922547944-gm8fgpgjebnraruomkpajoa7s3nqups0.apps.googleusercontent.com",onScriptProps:{async:!0,defer:!0,nonce:"YOUR_NONCE_VALUE"},children:l.jsx(Iw,{children:l.jsx(mI,{children:l.jsx(Ew,{children:l.jsx(HI,{})})})})})}));
//# sourceMappingURL=index-5ICyH_o0.js.map
