import{r as A,a as Td,R as It,u as ft,b as Ad,c as gc,B as Cd,d as Sd,e as gt}from"./vendor-CWYb8WqM.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var yc={exports:{}},ii={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rd=A,Nd=Symbol.for("react.element"),kd=Symbol.for("react.fragment"),Pd=Object.prototype.hasOwnProperty,jd=Rd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Od={key:!0,ref:!0,__self:!0,__source:!0};function vc(n,e,t){var r,s={},o=null,a=null;t!==void 0&&(o=""+t),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)Pd.call(e,r)&&!Od.hasOwnProperty(r)&&(s[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:Nd,type:n,key:o,ref:a,props:s,_owner:jd.current}}ii.Fragment=kd;ii.jsx=vc;ii.jsxs=vc;yc.exports=ii;var l=yc.exports,Zi={},Za=Td;Zi.createRoot=Za.createRoot,Zi.hydrateRoot=Za.hydrateRoot;function Dd(n={}){const{nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}=n,[s,o]=A.useState(!1),a=A.useRef(t);a.current=t;const u=A.useRef(r);return u.current=r,A.useEffect(()=>{const h=document.createElement("script");return h.src="https://accounts.google.com/gsi/client",h.async=!0,h.defer=!0,h.nonce=e,h.onload=()=>{var f;o(!0),(f=a.current)===null||f===void 0||f.call(a)},h.onerror=()=>{var f;o(!1),(f=u.current)===null||f===void 0||f.call(u)},document.body.appendChild(h),()=>{document.body.removeChild(h)}},[e]),s}const Ld=A.createContext(null);function Md({clientId:n,nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r,children:s}){const o=Dd({nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}),a=A.useMemo(()=>({clientId:n,scriptLoadedSuccessfully:o}),[n,o]);return It.createElement(Ld.Provider,{value:a},s)}var el={};/**
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
 */const _c=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Vd=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],u=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},wc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,y=o>>2,b=(o&3)<<4|u>>4;let x=(u&15)<<2|f>>6,C=f&63;h||(C=64,a||(x=64)),r.push(t[y],t[b],t[x],t[C])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(_c(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Vd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const f=s<n.length?t[n.charAt(s)]:64;++s;const b=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||u==null||f==null||b==null)throw new Fd;const x=o<<2|u>>4;if(r.push(x),f!==64){const C=u<<4&240|f>>2;if(r.push(C),b!==64){const k=f<<6&192|b;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Fd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ud=function(n){const e=_c(n);return wc.encodeByteArray(e,!0)},Fs=function(n){return Ud(n).replace(/\./g,"")},Ic=function(n){try{return wc.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */const $d=()=>Bd().__FIREBASE_DEFAULTS__,Gd=()=>{if(typeof process>"u"||typeof el>"u")return;const n=el.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Wd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ic(n[1]);return e&&JSON.parse(e)},oi=()=>{try{return $d()||Gd()||Wd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bc=n=>{var e,t;return(t=(e=oi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Hd=n=>{const e=bc(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Ec=()=>{var n;return(n=oi())===null||n===void 0?void 0:n.config},xc=n=>{var e;return(e=oi())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class qd{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function zd(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Fs(JSON.stringify(t)),Fs(JSON.stringify(a)),""].join(".")}/**
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
 */function Ye(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ye())}function Jd(){var n;const e=(n=oi())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Qd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Tc(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Yd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Xd(){const n=Ye();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Zd(){return!Jd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ac(){try{return typeof indexedDB=="object"}catch{return!1}}function Cc(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}function ef(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const tf="FirebaseError";class xt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=tf,Object.setPrototypeOf(this,xt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Nn.prototype.create)}}class Nn{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?nf(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new xt(s,u,r)}}function nf(n,e){return n.replace(rf,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const rf=/\{\$([^}]+)}/g;function sf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Or(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(tl(o)&&tl(a)){if(!Or(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function tl(n){return n!==null&&typeof n=="object"}/**
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
 */function qr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function of(n,e){const t=new af(n,e);return t.subscribe.bind(t)}class af{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");lf(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Li),s.error===void 0&&(s.error=Li),s.complete===void 0&&(s.complete=Li);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function lf(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Li(){}/**
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
 */const cf=1e3,uf=2,hf=4*60*60*1e3,df=.5;function nl(n,e=cf,t=uf){const r=e*Math.pow(t,n),s=Math.round(df*r*(Math.random()-.5)*2);return Math.min(hf,r+s)}/**
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
 */function tt(n){return n&&n._delegate?n._delegate:n}class Et{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const vn="[DEFAULT]";/**
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
 */class ff{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new qd;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(mf(e))try{this.getOrInitializeService({instanceIdentifier:vn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=vn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=vn){return this.instances.has(e)}getOptions(e=vn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&e(a,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:pf(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=vn){return this.component?this.component.multipleInstances?e:vn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function pf(n){return n===vn?void 0:n}function mf(n){return n.instantiationMode==="EAGER"}/**
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
 */class gf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new ff(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var oe;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(oe||(oe={}));const yf={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},vf=oe.INFO,_f={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},wf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=_f[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ai{constructor(e){this.name=e,this._logLevel=vf,this._logHandler=wf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?yf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const If=(n,e)=>e.some(t=>n instanceof t);let rl,sl;function bf(){return rl||(rl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ef(){return sl||(sl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Sc=new WeakMap,eo=new WeakMap,Rc=new WeakMap,Mi=new WeakMap,Co=new WeakMap;function xf(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(an(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Sc.set(t,n)}).catch(()=>{}),Co.set(e,n),e}function Tf(n){if(eo.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});eo.set(n,e)}let to={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return eo.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Rc.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return an(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Af(n){to=n(to)}function Cf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Vi(this),e,...t);return Rc.set(r,e.sort?e.sort():[e]),an(r)}:Ef().includes(n)?function(...e){return n.apply(Vi(this),e),an(Sc.get(this))}:function(...e){return an(n.apply(Vi(this),e))}}function Sf(n){return typeof n=="function"?Cf(n):(n instanceof IDBTransaction&&Tf(n),If(n,bf())?new Proxy(n,to):n)}function an(n){if(n instanceof IDBRequest)return xf(n);if(Mi.has(n))return Mi.get(n);const e=Sf(n);return e!==n&&(Mi.set(n,e),Co.set(e,n)),e}const Vi=n=>Co.get(n);function Nc(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),u=an(a);return r&&a.addEventListener("upgradeneeded",h=>{r(an(a.result),h.oldVersion,h.newVersion,an(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),u}const Rf=["get","getKey","getAll","getAllKeys","count"],Nf=["put","add","delete","clear"],Fi=new Map;function il(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Fi.get(e))return Fi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Nf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Rf.includes(t)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let f=h.store;return r&&(f=f.index(u.shift())),(await Promise.all([f[t](...u),s&&h.done]))[0]};return Fi.set(e,o),o}Af(n=>({...n,get:(e,t,r)=>il(e,t)||n.get(e,t,r),has:(e,t)=>!!il(e,t)||n.has(e,t)}));/**
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
 */class kf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Pf(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Pf(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const no="@firebase/app",ol="0.10.13";/**
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
 */const Jt=new ai("@firebase/app"),jf="@firebase/app-compat",Of="@firebase/analytics-compat",Df="@firebase/analytics",Lf="@firebase/app-check-compat",Mf="@firebase/app-check",Vf="@firebase/auth",Ff="@firebase/auth-compat",Uf="@firebase/database",Bf="@firebase/data-connect",$f="@firebase/database-compat",Gf="@firebase/functions",Wf="@firebase/functions-compat",Hf="@firebase/installations",qf="@firebase/installations-compat",zf="@firebase/messaging",Kf="@firebase/messaging-compat",Jf="@firebase/performance",Qf="@firebase/performance-compat",Yf="@firebase/remote-config",Xf="@firebase/remote-config-compat",Zf="@firebase/storage",ep="@firebase/storage-compat",tp="@firebase/firestore",np="@firebase/vertexai-preview",rp="@firebase/firestore-compat",sp="firebase",ip="10.14.1";/**
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
 */const ro="[DEFAULT]",op={[no]:"fire-core",[jf]:"fire-core-compat",[Df]:"fire-analytics",[Of]:"fire-analytics-compat",[Mf]:"fire-app-check",[Lf]:"fire-app-check-compat",[Vf]:"fire-auth",[Ff]:"fire-auth-compat",[Uf]:"fire-rtdb",[Bf]:"fire-data-connect",[$f]:"fire-rtdb-compat",[Gf]:"fire-fn",[Wf]:"fire-fn-compat",[Hf]:"fire-iid",[qf]:"fire-iid-compat",[zf]:"fire-fcm",[Kf]:"fire-fcm-compat",[Jf]:"fire-perf",[Qf]:"fire-perf-compat",[Yf]:"fire-rc",[Xf]:"fire-rc-compat",[Zf]:"fire-gcs",[ep]:"fire-gcs-compat",[tp]:"fire-fst",[rp]:"fire-fst-compat",[np]:"fire-vertex","fire-js":"fire-js",[sp]:"fire-js-all"};/**
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
 */const Us=new Map,ap=new Map,so=new Map;function al(n,e){try{n.container.addComponent(e)}catch(t){Jt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function kt(n){const e=n.name;if(so.has(e))return Jt.debug(`There were multiple attempts to register component ${e}.`),!1;so.set(e,n);for(const t of Us.values())al(t,n);for(const t of ap.values())al(t,n);return!0}function kn(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Rt(n){return n.settings!==void 0}/**
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
 */const lp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ln=new Nn("app","Firebase",lp);/**
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
 */class cp{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Et("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ln.create("app-deleted",{appName:this._name})}}/**
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
 */const Zn=ip;function kc(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ro,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw ln.create("bad-app-name",{appName:String(s)});if(t||(t=Ec()),!t)throw ln.create("no-options");const o=Us.get(s);if(o){if(Or(t,o.options)&&Or(r,o.config))return o;throw ln.create("duplicate-app",{appName:s})}const a=new gf(s);for(const h of so.values())a.addComponent(h);const u=new cp(t,r,a);return Us.set(s,u),u}function So(n=ro){const e=Us.get(n);if(!e&&n===ro&&Ec())return kc();if(!e)throw ln.create("no-app",{appName:n});return e}function dt(n,e,t){var r;let s=(r=op[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const u=[`Unable to register library "${s}" with version "${e}":`];o&&u.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Jt.warn(u.join(" "));return}kt(new Et(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const up="firebase-heartbeat-database",hp=1,Dr="firebase-heartbeat-store";let Ui=null;function Pc(){return Ui||(Ui=Nc(up,hp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Dr)}catch(t){console.warn(t)}}}}).catch(n=>{throw ln.create("idb-open",{originalErrorMessage:n.message})})),Ui}async function dp(n){try{const t=(await Pc()).transaction(Dr),r=await t.objectStore(Dr).get(jc(n));return await t.done,r}catch(e){if(e instanceof xt)Jt.warn(e.message);else{const t=ln.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Jt.warn(t.message)}}}async function ll(n,e){try{const r=(await Pc()).transaction(Dr,"readwrite");await r.objectStore(Dr).put(e,jc(n)),await r.done}catch(t){if(t instanceof xt)Jt.warn(t.message);else{const r=ln.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Jt.warn(r.message)}}}function jc(n){return`${n.name}!${n.options.appId}`}/**
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
 */const fp=1024,pp=30*24*60*60*1e3;class mp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new yp(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=cl();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const u=new Date(a.date).valueOf();return Date.now()-u<=pp}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Jt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=cl(),{heartbeatsToSend:r,unsentEntries:s}=gp(this._heartbeatsCache.heartbeats),o=Fs(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return Jt.warn(t),""}}}function cl(){return new Date().toISOString().substring(0,10)}function gp(n,e=fp){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),ul(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ul(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class yp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ac()?Cc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await dp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ll(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ll(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function ul(n){return Fs(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function vp(n){kt(new Et("platform-logger",e=>new kf(e),"PRIVATE")),kt(new Et("heartbeat",e=>new mp(e),"PRIVATE")),dt(no,ol,n),dt(no,ol,"esm2017"),dt("fire-js","")}vp("");function Ro(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function Oc(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _p=Oc,Dc=new Nn("auth","Firebase",Oc());/**
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
 */const Bs=new ai("@firebase/auth");function wp(n,...e){Bs.logLevel<=oe.WARN&&Bs.warn(`Auth (${Zn}): ${n}`,...e)}function Cs(n,...e){Bs.logLevel<=oe.ERROR&&Bs.error(`Auth (${Zn}): ${n}`,...e)}/**
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
 */function Pt(n,...e){throw ko(n,...e)}function bt(n,...e){return ko(n,...e)}function No(n,e,t){const r=Object.assign(Object.assign({},_p()),{[e]:t});return new Nn("auth","Firebase",r).create(e,{appName:n.name})}function cn(n){return No(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Lc(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Pt(n,"argument-error"),No(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ko(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Dc.create(n,...e)}function J(n,e,...t){if(!n)throw ko(e,...t)}function Wt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Cs(e),new Error(e)}function Qt(n,e){n||Wt(e)}/**
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
 */function io(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ip(){return hl()==="http:"||hl()==="https:"}function hl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function bp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ip()||Tc()||"connection"in navigator)?navigator.onLine:!0}function Ep(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class zr{constructor(e,t){this.shortDelay=e,this.longDelay=t,Qt(t>e,"Short delay should be less than long delay!"),this.isMobile=Kd()||Yd()}get(){return bp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Po(n,e){Qt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Mc{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Wt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Wt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Wt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Tp=new zr(3e4,6e4);function jo(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function er(n,e,t,r,s={}){return Vc(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const u=qr(Object.assign({key:n.config.apiKey},a)).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const f=Object.assign({method:e,headers:h},o);return Qd()||(f.referrerPolicy="no-referrer"),Mc.fetch()(Fc(n,n.config.apiHost,t,u),f)})}async function Vc(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},xp),e);try{const s=new Cp(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw _s(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const u=o.ok?a.errorMessage:a.error.message,[h,f]=u.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw _s(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw _s(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw _s(n,"user-disabled",a);const y=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw No(n,y,f);Pt(n,y)}}catch(s){if(s instanceof xt)throw s;Pt(n,"network-request-failed",{message:String(s)})}}async function Ap(n,e,t,r,s={}){const o=await er(n,e,t,r,s);return"mfaPendingCredential"in o&&Pt(n,"multi-factor-auth-required",{_serverResponse:o}),o}function Fc(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?Po(n.config,s):`${n.config.apiScheme}://${s}`}class Cp{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(bt(this.auth,"network-request-failed")),Tp.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function _s(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=bt(n,e,r);return s.customData._tokenResponse=t,s}/**
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
 */async function Sp(n,e){return er(n,"POST","/v1/accounts:delete",e)}async function Uc(n,e){return er(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Cr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rp(n,e=!1){const t=tt(n),r=await t.getIdToken(e),s=Oo(r);J(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o==null?void 0:o.sign_in_provider;return{claims:s,token:r,authTime:Cr(Bi(s.auth_time)),issuedAtTime:Cr(Bi(s.iat)),expirationTime:Cr(Bi(s.exp)),signInProvider:a||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Bi(n){return Number(n)*1e3}function Oo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Cs("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ic(t);return s?JSON.parse(s):(Cs("Failed to decode base64 JWT payload"),null)}catch(s){return Cs("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function dl(n){const e=Oo(n);return J(e,"internal-error"),J(typeof e.exp<"u","internal-error"),J(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Lr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof xt&&Np(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Np({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class oo{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Cr(this.lastLoginAt),this.creationTime=Cr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function $s(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Lr(n,Uc(t,{idToken:r}));J(s==null?void 0:s.users.length,t,"internal-error");const o=s.users[0];n._notifyReloadListener(o);const a=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?Bc(o.providerUserInfo):[],u=jp(n.providerData,a),h=n.isAnonymous,f=!(n.email&&o.passwordHash)&&!(u!=null&&u.length),y=h?f:!1,b={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new oo(o.createdAt,o.lastLoginAt),isAnonymous:y};Object.assign(n,b)}async function Pp(n){const e=tt(n);await $s(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function jp(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Bc(n){return n.map(e=>{var{providerId:t}=e,r=Ro(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function Op(n,e){const t=await Vc(n,{},async()=>{const r=qr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=Fc(n,s,"/v1/token",`key=${o}`),u=await n._getAdditionalHeaders();return u["Content-Type"]="application/x-www-form-urlencoded",Mc.fetch()(a,{method:"POST",headers:u,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Dp(n,e){return er(n,"POST","/v2/accounts:revokeToken",jo(n,e))}/**
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
 */class $n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){J(e.idToken,"internal-error"),J(typeof e.idToken<"u","internal-error"),J(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):dl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){J(e.length!==0,"internal-error");const t=dl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(J(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await Op(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new $n;return r&&(J(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(J(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(J(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new $n,this.toJSON())}_performRefresh(){return Wt("not implemented")}}/**
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
 */function rn(n,e){J(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Ht{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,o=Ro(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new oo(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Lr(this,this.stsTokenManager.getToken(this.auth,e));return J(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rp(this,e)}reload(){return Pp(this)}_assign(e){this!==e&&(J(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ht(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){J(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await $s(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Rt(this.auth.app))return Promise.reject(cn(this.auth));const e=await this.getIdToken();return await Lr(this,Sp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,o,a,u,h,f,y;const b=(r=t.displayName)!==null&&r!==void 0?r:void 0,x=(s=t.email)!==null&&s!==void 0?s:void 0,C=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,k=(a=t.photoURL)!==null&&a!==void 0?a:void 0,S=(u=t.tenantId)!==null&&u!==void 0?u:void 0,N=(h=t._redirectEventId)!==null&&h!==void 0?h:void 0,G=(f=t.createdAt)!==null&&f!==void 0?f:void 0,W=(y=t.lastLoginAt)!==null&&y!==void 0?y:void 0,{uid:U,emailVerified:B,isAnonymous:fe,providerData:M,stsTokenManager:I}=t;J(U&&I,e,"internal-error");const m=$n.fromJSON(this.name,I);J(typeof U=="string",e,"internal-error"),rn(b,e.name),rn(x,e.name),J(typeof B=="boolean",e,"internal-error"),J(typeof fe=="boolean",e,"internal-error"),rn(C,e.name),rn(k,e.name),rn(S,e.name),rn(N,e.name),rn(G,e.name),rn(W,e.name);const g=new Ht({uid:U,auth:e,email:x,emailVerified:B,displayName:b,isAnonymous:fe,photoURL:k,phoneNumber:C,tenantId:S,stsTokenManager:m,createdAt:G,lastLoginAt:W});return M&&Array.isArray(M)&&(g.providerData=M.map(_=>Object.assign({},_))),N&&(g._redirectEventId=N),g}static async _fromIdTokenResponse(e,t,r=!1){const s=new $n;s.updateFromServerResponse(t);const o=new Ht({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await $s(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];J(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?Bc(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(o!=null&&o.length),u=new $n;u.updateFromIdToken(r);const h=new Ht({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new oo(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(o!=null&&o.length)};return Object.assign(h,f),h}}/**
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
 */const fl=new Map;function qt(n){Qt(n instanceof Function,"Expected a class definition");let e=fl.get(n);return e?(Qt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,fl.set(n,e),e)}/**
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
 */class $c{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}$c.type="NONE";const pl=$c;/**
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
 */function Ss(n,e,t){return`firebase:${n}:${e}:${t}`}class Gn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=Ss(this.userKey,s.apiKey,o),this.fullPersistenceKey=Ss("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ht._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Gn(qt(pl),e,r);const s=(await Promise.all(t.map(async f=>{if(await f._isAvailable())return f}))).filter(f=>f);let o=s[0]||qt(pl);const a=Ss(r,e.config.apiKey,e.name);let u=null;for(const f of t)try{const y=await f._get(a);if(y){const b=Ht._fromJSON(e,y);f!==o&&(u=b),o=f;break}}catch{}const h=s.filter(f=>f._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new Gn(o,e,r):(o=h[0],u&&await o._set(a,u.toJSON()),await Promise.all(t.map(async f=>{if(f!==o)try{await f._remove(a)}catch{}})),new Gn(o,e,r))}}/**
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
 */function ml(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(qc(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Gc(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Kc(e))return"Blackberry";if(Jc(e))return"Webos";if(Wc(e))return"Safari";if((e.includes("chrome/")||Hc(e))&&!e.includes("edge/"))return"Chrome";if(zc(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Gc(n=Ye()){return/firefox\//i.test(n)}function Wc(n=Ye()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hc(n=Ye()){return/crios\//i.test(n)}function qc(n=Ye()){return/iemobile/i.test(n)}function zc(n=Ye()){return/android/i.test(n)}function Kc(n=Ye()){return/blackberry/i.test(n)}function Jc(n=Ye()){return/webos/i.test(n)}function Do(n=Ye()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Lp(n=Ye()){var e;return Do(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Mp(){return Xd()&&document.documentMode===10}function Qc(n=Ye()){return Do(n)||zc(n)||Jc(n)||Kc(n)||/windows phone/i.test(n)||qc(n)}/**
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
 */function Yc(n,e=[]){let t;switch(n){case"Browser":t=ml(Ye());break;case"Worker":t=`${ml(Ye())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Zn}/${r}`}/**
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
 */async function Fp(n,e={}){return er(n,"GET","/v2/passwordPolicy",jo(n,e))}/**
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
 */class $p{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new gl(this),this.idTokenSubscription=new gl(this),this.beforeStateQueue=new Vp(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Dc,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=qt(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Gn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Uc(this,{idToken:e}),r=await Ht._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Rt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=s==null?void 0:s._redirectEventId,h=await this.tryRedirectSignIn(e);(!a||a===u)&&(h!=null&&h.user)&&(s=h.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return J(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await $s(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Ep()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Rt(this.app))return Promise.reject(cn(this));const t=e?tt(e):null;return t&&J(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&J(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Rt(this.app)?Promise.reject(cn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Rt(this.app)?Promise.reject(cn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(qt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Fp(this),t=new Bp(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Nn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Dp(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&qt(e)||this._popupRedirectResolver;J(t,this,"argument-error"),this.redirectPersistenceManager=await Gn.create(this,[qt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(J(u,this,"internal-error"),u.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return J(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Yc(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wp(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function tr(n){return tt(n)}class gl{constructor(e){this.auth=e,this.observer=null,this.addObserver=of(t=>this.observer=t)}get next(){return J(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Lo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Gp(n){Lo=n}function Wp(n){return Lo.loadJS(n)}function Hp(){return Lo.gapiScript}function qp(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function zp(n,e){const t=kn(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(Or(o,e??{}))return s;Pt(s,"already-initialized")}return t.initialize({options:e})}function Kp(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(qt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Jp(n,e,t){const r=tr(n);J(r._canInitEmulator,r,"emulator-config-failed"),J(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,o=Xc(e),{host:a,port:u}=Qp(e),h=u===null?"":`:${u}`;r.config.emulator={url:`${o}//${a}${h}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:u,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})}),Yp()}function Xc(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Qp(n){const e=Xc(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:yl(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:yl(a)}}}function yl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Yp(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Zc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Wt("not implemented")}_getIdTokenResponse(e){return Wt("not implemented")}_linkToIdToken(e,t){return Wt("not implemented")}_getReauthenticationResolver(e){return Wt("not implemented")}}/**
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
 */async function Wn(n,e){return Ap(n,"POST","/v1/accounts:signInWithIdp",jo(n,e))}/**
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
 */const Xp="http://localhost";class xn extends Zc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new xn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Pt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,o=Ro(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new xn(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Wn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Wn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Wn(e,t)}buildRequest(){const e={requestUri:Xp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=qr(t)}return e}}/**
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
 */class li{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Kr extends li{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class $t extends Kr{constructor(){super("facebook.com")}static credential(e){return xn._fromParams({providerId:$t.PROVIDER_ID,signInMethod:$t.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return $t.credentialFromTaggedObject(e)}static credentialFromError(e){return $t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return $t.credential(e.oauthAccessToken)}catch{return null}}}$t.FACEBOOK_SIGN_IN_METHOD="facebook.com";$t.PROVIDER_ID="facebook.com";/**
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
 */class Gt extends Kr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return xn._fromParams({providerId:Gt.PROVIDER_ID,signInMethod:Gt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Gt.credentialFromTaggedObject(e)}static credentialFromError(e){return Gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Gt.credential(t,r)}catch{return null}}}Gt.GOOGLE_SIGN_IN_METHOD="google.com";Gt.PROVIDER_ID="google.com";/**
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
 */class sn extends Kr{constructor(){super("github.com")}static credential(e){return xn._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return sn.credentialFromTaggedObject(e)}static credentialFromError(e){return sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return sn.credential(e.oauthAccessToken)}catch{return null}}}sn.GITHUB_SIGN_IN_METHOD="github.com";sn.PROVIDER_ID="github.com";/**
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
 */class on extends Kr{constructor(){super("twitter.com")}static credential(e,t){return xn._fromParams({providerId:on.PROVIDER_ID,signInMethod:on.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return on.credentialFromTaggedObject(e)}static credentialFromError(e){return on.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return on.credential(t,r)}catch{return null}}}on.TWITTER_SIGN_IN_METHOD="twitter.com";on.PROVIDER_ID="twitter.com";/**
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
 */class zn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await Ht._fromIdTokenResponse(e,r,s),a=vl(r);return new zn({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=vl(r);return new zn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function vl(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Gs extends xt{constructor(e,t,r,s){var o;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Gs.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Gs(e,t,r,s)}}function eu(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Gs._fromErrorAndOperation(n,o,e,r):o})}async function Zp(n,e,t=!1){const r=await Lr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return zn._forOperation(n,"link",r)}/**
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
 */async function em(n,e,t=!1){const{auth:r}=n;if(Rt(r.app))return Promise.reject(cn(r));const s="reauthenticate";try{const o=await Lr(n,eu(r,s,e,n),t);J(o.idToken,r,"internal-error");const a=Oo(o.idToken);J(a,r,"internal-error");const{sub:u}=a;return J(n.uid===u,r,"user-mismatch"),zn._forOperation(n,s,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&Pt(r,"user-mismatch"),o}}/**
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
 */async function tm(n,e,t=!1){if(Rt(n.app))return Promise.reject(cn(n));const r="signIn",s=await eu(n,r,e),o=await zn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function nm(n,e,t,r){return tt(n).onIdTokenChanged(e,t,r)}function rm(n,e,t){return tt(n).beforeAuthStateChanged(e,t)}function sm(n,e,t,r){return tt(n).onAuthStateChanged(e,t,r)}function im(n){return tt(n).signOut()}const Ws="__sak";/**
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
 */class tu{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ws,"1"),this.storage.removeItem(Ws),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const om=1e3,am=10;class nu extends tu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qc(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);Mp()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,am):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},om)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}nu.type="LOCAL";const lm=nu;/**
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
 */function cm(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class ci{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new ci(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(a).map(async f=>f(t.origin,o)),h=await cm(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ci.receivers=[];/**
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
 */function Mo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class um{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((u,h)=>{const f=Mo("",20);s.port1.start();const y=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(b){const x=b;if(x.data.eventId===f)switch(x.data.status){case"ack":clearTimeout(y),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),u(x.data.response);break;default:clearTimeout(y),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:f,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Nt(){return window}function hm(n){Nt().location.href=n}/**
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
 */function iu(){return typeof Nt().WorkerGlobalScope<"u"&&typeof Nt().importScripts=="function"}async function dm(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function fm(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function pm(){return iu()?self:null}/**
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
 */const ou="firebaseLocalStorageDb",mm=1,Hs="firebaseLocalStorage",au="fbase_key";class Jr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ui(n,e){return n.transaction([Hs],e?"readwrite":"readonly").objectStore(Hs)}function gm(){const n=indexedDB.deleteDatabase(ou);return new Jr(n).toPromise()}function ao(){const n=indexedDB.open(ou,mm);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Hs,{keyPath:au})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Hs)?e(r):(r.close(),await gm(),e(await ao()))})})}async function _l(n,e,t){const r=ui(n,!0).put({[au]:e,value:t});return new Jr(r).toPromise()}async function ym(n,e){const t=ui(n,!1).get(e),r=await new Jr(t).toPromise();return r===void 0?null:r.value}function wl(n,e){const t=ui(n,!0).delete(e);return new Jr(t).toPromise()}const vm=800,_m=3;class lu{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ao(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>_m)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return iu()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ci._getInstance(pm()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await dm(),!this.activeServiceWorker)return;this.sender=new um(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||fm()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ao();return await _l(e,Ws,"1"),await wl(e,Ws),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>_l(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ym(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>wl(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=ui(s,!1).getAll();return new Jr(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}lu.type="LOCAL";const wm=lu;new zr(3e4,6e4);/**
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
 */function Vo(n,e){return e?qt(e):(J(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Fo extends Zc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Wn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Wn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Wn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Im(n){return tm(n.auth,new Fo(n),n.bypassAuthState)}function bm(n){const{auth:e,user:t}=n;return J(t,e,"internal-error"),em(t,new Fo(n),n.bypassAuthState)}async function Em(n){const{auth:e,user:t}=n;return J(t,e,"internal-error"),Zp(t,new Fo(n),n.bypassAuthState)}/**
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
 */class cu{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:u}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(h))}catch(f){this.reject(f)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Im;case"linkViaPopup":case"linkViaRedirect":return Em;case"reauthViaPopup":case"reauthViaRedirect":return bm;default:Pt(this.auth,"internal-error")}}resolve(e){Qt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Qt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const xm=new zr(2e3,1e4);async function Tm(n,e,t){if(Rt(n.app))return Promise.reject(bt(n,"operation-not-supported-in-this-environment"));const r=tr(n);Lc(n,e,li);const s=Vo(r,t);return new _n(r,"signInViaPopup",e,s).executeNotNull()}class _n extends cu{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,_n.currentPopupAction&&_n.currentPopupAction.cancel(),_n.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return J(e,this.auth,"internal-error"),e}async onExecution(){Qt(this.filter.length===1,"Popup operations only handle one event");const e=Mo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(bt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(bt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,_n.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(bt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,xm.get())};e()}}_n.currentPopupAction=null;/**
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
 */const Am="pendingRedirect",Rs=new Map;class Cm extends cu{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Rs.get(this.auth._key());if(!e){try{const r=await Sm(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Rs.set(this.auth._key(),e)}return this.bypassAuthState||Rs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sm(n,e){const t=hu(e),r=uu(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}async function Rm(n,e){return uu(n)._set(hu(e),"true")}function Nm(n,e){Rs.set(n._key(),e)}function uu(n){return qt(n._redirectPersistence)}function hu(n){return Ss(Am,n.config.apiKey,n.name)}/**
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
 */function km(n,e,t){return Pm(n,e,t)}async function Pm(n,e,t){if(Rt(n.app))return Promise.reject(cn(n));const r=tr(n);Lc(n,e,li),await r._initializationPromise;const s=Vo(r,t);return await Rm(s,r),s._openRedirect(r,e,"signInViaRedirect")}async function jm(n,e){return await tr(n)._initializationPromise,du(n,e,!1)}async function du(n,e,t=!1){if(Rt(n.app))return Promise.reject(cn(n));const r=tr(n),s=Vo(r,e),a=await new Cm(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const Om=10*60*1e3;class Dm{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lm(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!fu(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(bt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Om&&this.cachedEventUids.clear(),this.cachedEventUids.has(Il(e))}saveEventToCache(e){this.cachedEventUids.add(Il(e)),this.lastProcessedEventTime=Date.now()}}function Il(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function fu({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lm(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fu(n);default:return!1}}/**
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
 */async function Mm(n,e={}){return er(n,"GET","/v1/projects",e)}/**
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
 */const Vm=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Fm=/^https?/;async function Um(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Mm(n);for(const t of e)try{if(Bm(t))return}catch{}Pt(n,"unauthorized-domain")}function Bm(n){const e=io(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Fm.test(t))return!1;if(Vm.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const $m=new zr(3e4,6e4);function bl(){const n=Nt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Gm(n){return new Promise((e,t)=>{var r,s,o;function a(){bl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{bl(),t(bt(n,"network-request-failed"))},timeout:$m.get()})}if(!((s=(r=Nt().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((o=Nt().gapi)===null||o===void 0)&&o.load)a();else{const u=qp("iframefcb");return Nt()[u]=()=>{gapi.load?a():t(bt(n,"network-request-failed"))},Wp(`${Hp()}?onload=${u}`).catch(h=>t(h))}}).catch(e=>{throw Ns=null,e})}let Ns=null;function Wm(n){return Ns=Ns||Gm(n),Ns}/**
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
 */const Hm=new zr(5e3,15e3),qm="__/auth/iframe",zm="emulator/auth/iframe",Km={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Jm=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Qm(n){const e=n.config;J(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Po(e,zm):`https://${n.config.authDomain}/${qm}`,r={apiKey:e.apiKey,appName:n.name,v:Zn},s=Jm.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${qr(r).slice(1)}`}async function Ym(n){const e=await Wm(n),t=Nt().gapi;return J(t,n,"internal-error"),e.open({where:document.body,url:Qm(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Km,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=bt(n,"network-request-failed"),u=Nt().setTimeout(()=>{o(a)},Hm.get());function h(){Nt().clearTimeout(u),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
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
 */const Xm={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Zm=500,eg=600,tg="_blank",ng="http://localhost";class El{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function rg(n,e,t,r=Zm,s=eg){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const h=Object.assign(Object.assign({},Xm),{width:r.toString(),height:s.toString(),top:o,left:a}),f=Ye().toLowerCase();t&&(u=Hc(f)?tg:t),Gc(f)&&(e=e||ng,h.scrollbars="yes");const y=Object.entries(h).reduce((x,[C,k])=>`${x}${C}=${k},`,"");if(Lp(f)&&u!=="_self")return sg(e||"",u),new El(null);const b=window.open(e||"",u,y);J(b,n,"popup-blocked");try{b.focus()}catch{}return new El(b)}function sg(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const ig="__/auth/handler",og="emulator/auth/handler",ag=encodeURIComponent("fac");async function xl(n,e,t,r,s,o){J(n.config.authDomain,n,"auth-domain-config-required"),J(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Zn,eventId:s};if(e instanceof li){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",sf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[y,b]of Object.entries({}))a[y]=b}if(e instanceof Kr){const y=e.getScopes().filter(b=>b!=="");y.length>0&&(a.scopes=y.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const y of Object.keys(u))u[y]===void 0&&delete u[y];const h=await n._getAppCheckToken(),f=h?`#${ag}=${encodeURIComponent(h)}`:"";return`${lg(n)}?${qr(u).slice(1)}${f}`}function lg({config:n}){return n.emulator?Po(n,og):`https://${n.authDomain}/${ig}`}/**
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
 */const $i="webStorageSupport";class cg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=su,this._completeRedirectFn=du,this._overrideRedirectResult=Nm}async _openPopup(e,t,r,s){var o;Qt((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");const a=await xl(e,t,r,io(),s);return rg(e,a,Mo())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await xl(e,t,r,io(),s);return hm(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(Qt(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Ym(e),r=new Dm(e);return t.register("authEvent",s=>(J(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send($i,{type:$i},s=>{var o;const a=(o=s==null?void 0:s[0])===null||o===void 0?void 0:o[$i];a!==void 0&&t(!!a),Pt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Um(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Qc()||Wc()||Do()}}const ug=cg;var Tl="@firebase/auth",Al="1.7.9";/**
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
 */class hg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){J(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function dg(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function fg(n){kt(new Et("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;J(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Yc(n)},f=new $p(r,s,o,h);return Kp(f,t),f},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),kt(new Et("auth-internal",e=>{const t=tr(e.getProvider("auth").getImmediate());return(r=>new hg(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),dt(Tl,Al,dg(n)),dt(Tl,Al,"esm2017")}/**
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
 */const pg=5*60,mg=xc("authIdTokenMaxAge")||pg;let Cl=null;const gg=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>mg)return;const s=t==null?void 0:t.token;Cl!==s&&(Cl=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function yg(n=So()){const e=kn(n,"auth");if(e.isInitialized())return e.getImmediate();const t=zp(n,{popupRedirectResolver:ug,persistence:[wm,lm,su]}),r=xc("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=gg(o.toString());rm(t,a,()=>a(t.currentUser)),nm(t,u=>a(u))}}const s=bc("auth");return s&&Jp(t,`http://${s}`),t}function vg(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Gp({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=bt("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",vg().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});fg("Browser");var _g="firebase",wg="10.14.1";/**
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
 */dt(_g,wg,"app");var Sl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,m){function g(){}g.prototype=m.prototype,I.D=m.prototype,I.prototype=new g,I.prototype.constructor=I,I.C=function(_,w,E){for(var v=Array(arguments.length-2),X=2;X<arguments.length;X++)v[X-2]=arguments[X];return m.prototype[w].apply(_,v)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,m,g){g||(g=0);var _=Array(16);if(typeof m=="string")for(var w=0;16>w;++w)_[w]=m.charCodeAt(g++)|m.charCodeAt(g++)<<8|m.charCodeAt(g++)<<16|m.charCodeAt(g++)<<24;else for(w=0;16>w;++w)_[w]=m[g++]|m[g++]<<8|m[g++]<<16|m[g++]<<24;m=I.g[0],g=I.g[1],w=I.g[2];var E=I.g[3],v=m+(E^g&(w^E))+_[0]+3614090360&4294967295;m=g+(v<<7&4294967295|v>>>25),v=E+(w^m&(g^w))+_[1]+3905402710&4294967295,E=m+(v<<12&4294967295|v>>>20),v=w+(g^E&(m^g))+_[2]+606105819&4294967295,w=E+(v<<17&4294967295|v>>>15),v=g+(m^w&(E^m))+_[3]+3250441966&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(E^g&(w^E))+_[4]+4118548399&4294967295,m=g+(v<<7&4294967295|v>>>25),v=E+(w^m&(g^w))+_[5]+1200080426&4294967295,E=m+(v<<12&4294967295|v>>>20),v=w+(g^E&(m^g))+_[6]+2821735955&4294967295,w=E+(v<<17&4294967295|v>>>15),v=g+(m^w&(E^m))+_[7]+4249261313&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(E^g&(w^E))+_[8]+1770035416&4294967295,m=g+(v<<7&4294967295|v>>>25),v=E+(w^m&(g^w))+_[9]+2336552879&4294967295,E=m+(v<<12&4294967295|v>>>20),v=w+(g^E&(m^g))+_[10]+4294925233&4294967295,w=E+(v<<17&4294967295|v>>>15),v=g+(m^w&(E^m))+_[11]+2304563134&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(E^g&(w^E))+_[12]+1804603682&4294967295,m=g+(v<<7&4294967295|v>>>25),v=E+(w^m&(g^w))+_[13]+4254626195&4294967295,E=m+(v<<12&4294967295|v>>>20),v=w+(g^E&(m^g))+_[14]+2792965006&4294967295,w=E+(v<<17&4294967295|v>>>15),v=g+(m^w&(E^m))+_[15]+1236535329&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(w^E&(g^w))+_[1]+4129170786&4294967295,m=g+(v<<5&4294967295|v>>>27),v=E+(g^w&(m^g))+_[6]+3225465664&4294967295,E=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(E^m))+_[11]+643717713&4294967295,w=E+(v<<14&4294967295|v>>>18),v=g+(E^m&(w^E))+_[0]+3921069994&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^E&(g^w))+_[5]+3593408605&4294967295,m=g+(v<<5&4294967295|v>>>27),v=E+(g^w&(m^g))+_[10]+38016083&4294967295,E=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(E^m))+_[15]+3634488961&4294967295,w=E+(v<<14&4294967295|v>>>18),v=g+(E^m&(w^E))+_[4]+3889429448&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^E&(g^w))+_[9]+568446438&4294967295,m=g+(v<<5&4294967295|v>>>27),v=E+(g^w&(m^g))+_[14]+3275163606&4294967295,E=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(E^m))+_[3]+4107603335&4294967295,w=E+(v<<14&4294967295|v>>>18),v=g+(E^m&(w^E))+_[8]+1163531501&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^E&(g^w))+_[13]+2850285829&4294967295,m=g+(v<<5&4294967295|v>>>27),v=E+(g^w&(m^g))+_[2]+4243563512&4294967295,E=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(E^m))+_[7]+1735328473&4294967295,w=E+(v<<14&4294967295|v>>>18),v=g+(E^m&(w^E))+_[12]+2368359562&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(g^w^E)+_[5]+4294588738&4294967295,m=g+(v<<4&4294967295|v>>>28),v=E+(m^g^w)+_[8]+2272392833&4294967295,E=m+(v<<11&4294967295|v>>>21),v=w+(E^m^g)+_[11]+1839030562&4294967295,w=E+(v<<16&4294967295|v>>>16),v=g+(w^E^m)+_[14]+4259657740&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^E)+_[1]+2763975236&4294967295,m=g+(v<<4&4294967295|v>>>28),v=E+(m^g^w)+_[4]+1272893353&4294967295,E=m+(v<<11&4294967295|v>>>21),v=w+(E^m^g)+_[7]+4139469664&4294967295,w=E+(v<<16&4294967295|v>>>16),v=g+(w^E^m)+_[10]+3200236656&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^E)+_[13]+681279174&4294967295,m=g+(v<<4&4294967295|v>>>28),v=E+(m^g^w)+_[0]+3936430074&4294967295,E=m+(v<<11&4294967295|v>>>21),v=w+(E^m^g)+_[3]+3572445317&4294967295,w=E+(v<<16&4294967295|v>>>16),v=g+(w^E^m)+_[6]+76029189&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^E)+_[9]+3654602809&4294967295,m=g+(v<<4&4294967295|v>>>28),v=E+(m^g^w)+_[12]+3873151461&4294967295,E=m+(v<<11&4294967295|v>>>21),v=w+(E^m^g)+_[15]+530742520&4294967295,w=E+(v<<16&4294967295|v>>>16),v=g+(w^E^m)+_[2]+3299628645&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(w^(g|~E))+_[0]+4096336452&4294967295,m=g+(v<<6&4294967295|v>>>26),v=E+(g^(m|~w))+_[7]+1126891415&4294967295,E=m+(v<<10&4294967295|v>>>22),v=w+(m^(E|~g))+_[14]+2878612391&4294967295,w=E+(v<<15&4294967295|v>>>17),v=g+(E^(w|~m))+_[5]+4237533241&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~E))+_[12]+1700485571&4294967295,m=g+(v<<6&4294967295|v>>>26),v=E+(g^(m|~w))+_[3]+2399980690&4294967295,E=m+(v<<10&4294967295|v>>>22),v=w+(m^(E|~g))+_[10]+4293915773&4294967295,w=E+(v<<15&4294967295|v>>>17),v=g+(E^(w|~m))+_[1]+2240044497&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~E))+_[8]+1873313359&4294967295,m=g+(v<<6&4294967295|v>>>26),v=E+(g^(m|~w))+_[15]+4264355552&4294967295,E=m+(v<<10&4294967295|v>>>22),v=w+(m^(E|~g))+_[6]+2734768916&4294967295,w=E+(v<<15&4294967295|v>>>17),v=g+(E^(w|~m))+_[13]+1309151649&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~E))+_[4]+4149444226&4294967295,m=g+(v<<6&4294967295|v>>>26),v=E+(g^(m|~w))+_[11]+3174756917&4294967295,E=m+(v<<10&4294967295|v>>>22),v=w+(m^(E|~g))+_[2]+718787259&4294967295,w=E+(v<<15&4294967295|v>>>17),v=g+(E^(w|~m))+_[9]+3951481745&4294967295,I.g[0]=I.g[0]+m&4294967295,I.g[1]=I.g[1]+(w+(v<<21&4294967295|v>>>11))&4294967295,I.g[2]=I.g[2]+w&4294967295,I.g[3]=I.g[3]+E&4294967295}r.prototype.u=function(I,m){m===void 0&&(m=I.length);for(var g=m-this.blockSize,_=this.B,w=this.h,E=0;E<m;){if(w==0)for(;E<=g;)s(this,I,E),E+=this.blockSize;if(typeof I=="string"){for(;E<m;)if(_[w++]=I.charCodeAt(E++),w==this.blockSize){s(this,_),w=0;break}}else for(;E<m;)if(_[w++]=I[E++],w==this.blockSize){s(this,_),w=0;break}}this.h=w,this.o+=m},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var m=1;m<I.length-8;++m)I[m]=0;var g=8*this.o;for(m=I.length-8;m<I.length;++m)I[m]=g&255,g/=256;for(this.u(I),I=Array(16),m=g=0;4>m;++m)for(var _=0;32>_;_+=8)I[g++]=this.g[m]>>>_&255;return I};function o(I,m){var g=u;return Object.prototype.hasOwnProperty.call(g,I)?g[I]:g[I]=m(I)}function a(I,m){this.h=m;for(var g=[],_=!0,w=I.length-1;0<=w;w--){var E=I[w]|0;_&&E==m||(g[w]=E,_=!1)}this.g=g}var u={};function h(I){return-128<=I&&128>I?o(I,function(m){return new a([m|0],0>m?-1:0)}):new a([I|0],0>I?-1:0)}function f(I){if(isNaN(I)||!isFinite(I))return b;if(0>I)return N(f(-I));for(var m=[],g=1,_=0;I>=g;_++)m[_]=I/g|0,g*=4294967296;return new a(m,0)}function y(I,m){if(I.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(I.charAt(0)=="-")return N(y(I.substring(1),m));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=f(Math.pow(m,8)),_=b,w=0;w<I.length;w+=8){var E=Math.min(8,I.length-w),v=parseInt(I.substring(w,w+E),m);8>E?(E=f(Math.pow(m,E)),_=_.j(E).add(f(v))):(_=_.j(g),_=_.add(f(v)))}return _}var b=h(0),x=h(1),C=h(16777216);n=a.prototype,n.m=function(){if(S(this))return-N(this).m();for(var I=0,m=1,g=0;g<this.g.length;g++){var _=this.i(g);I+=(0<=_?_:4294967296+_)*m,m*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(k(this))return"0";if(S(this))return"-"+N(this).toString(I);for(var m=f(Math.pow(I,6)),g=this,_="";;){var w=B(g,m).g;g=G(g,w.j(m));var E=((0<g.g.length?g.g[0]:g.h)>>>0).toString(I);if(g=w,k(g))return E+_;for(;6>E.length;)E="0"+E;_=E+_}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function k(I){if(I.h!=0)return!1;for(var m=0;m<I.g.length;m++)if(I.g[m]!=0)return!1;return!0}function S(I){return I.h==-1}n.l=function(I){return I=G(this,I),S(I)?-1:k(I)?0:1};function N(I){for(var m=I.g.length,g=[],_=0;_<m;_++)g[_]=~I.g[_];return new a(g,~I.h).add(x)}n.abs=function(){return S(this)?N(this):this},n.add=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0,w=0;w<=m;w++){var E=_+(this.i(w)&65535)+(I.i(w)&65535),v=(E>>>16)+(this.i(w)>>>16)+(I.i(w)>>>16);_=v>>>16,E&=65535,v&=65535,g[w]=v<<16|E}return new a(g,g[g.length-1]&-2147483648?-1:0)};function G(I,m){return I.add(N(m))}n.j=function(I){if(k(this)||k(I))return b;if(S(this))return S(I)?N(this).j(N(I)):N(N(this).j(I));if(S(I))return N(this.j(N(I)));if(0>this.l(C)&&0>I.l(C))return f(this.m()*I.m());for(var m=this.g.length+I.g.length,g=[],_=0;_<2*m;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var w=0;w<I.g.length;w++){var E=this.i(_)>>>16,v=this.i(_)&65535,X=I.i(w)>>>16,_e=I.i(w)&65535;g[2*_+2*w]+=v*_e,W(g,2*_+2*w),g[2*_+2*w+1]+=E*_e,W(g,2*_+2*w+1),g[2*_+2*w+1]+=v*X,W(g,2*_+2*w+1),g[2*_+2*w+2]+=E*X,W(g,2*_+2*w+2)}for(_=0;_<m;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=m;_<2*m;_++)g[_]=0;return new a(g,0)};function W(I,m){for(;(I[m]&65535)!=I[m];)I[m+1]+=I[m]>>>16,I[m]&=65535,m++}function U(I,m){this.g=I,this.h=m}function B(I,m){if(k(m))throw Error("division by zero");if(k(I))return new U(b,b);if(S(I))return m=B(N(I),m),new U(N(m.g),N(m.h));if(S(m))return m=B(I,N(m)),new U(N(m.g),m.h);if(30<I.g.length){if(S(I)||S(m))throw Error("slowDivide_ only works with positive integers.");for(var g=x,_=m;0>=_.l(I);)g=fe(g),_=fe(_);var w=M(g,1),E=M(_,1);for(_=M(_,2),g=M(g,2);!k(_);){var v=E.add(_);0>=v.l(I)&&(w=w.add(g),E=v),_=M(_,1),g=M(g,1)}return m=G(I,w.j(m)),new U(w,m)}for(w=b;0<=I.l(m);){for(g=Math.max(1,Math.floor(I.m()/m.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),E=f(g),v=E.j(m);S(v)||0<v.l(I);)g-=_,E=f(g),v=E.j(m);k(E)&&(E=x),w=w.add(E),I=G(I,v)}return new U(w,I)}n.A=function(I){return B(this,I).h},n.and=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)&I.i(_);return new a(g,this.h&I.h)},n.or=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)|I.i(_);return new a(g,this.h|I.h)},n.xor=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)^I.i(_);return new a(g,this.h^I.h)};function fe(I){for(var m=I.g.length+1,g=[],_=0;_<m;_++)g[_]=I.i(_)<<1|I.i(_-1)>>>31;return new a(g,I.h)}function M(I,m){var g=m>>5;m%=32;for(var _=I.g.length-g,w=[],E=0;E<_;E++)w[E]=0<m?I.i(E+g)>>>m|I.i(E+g+1)<<32-m:I.i(E+g);return new a(w,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=y,pu=a}).apply(typeof Sl<"u"?Sl:typeof self<"u"?self:typeof window<"u"?window:{});var ws=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mu,Tr,gu,ks,lo,yu,vu,_u;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,d){return i==Array.prototype||i==Object.prototype||(i[c]=d.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof ws=="object"&&ws];for(var c=0;c<i.length;++c){var d=i[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var d=r;i=i.split(".");for(var p=0;p<i.length-1;p++){var T=i[p];if(!(T in d))break e;d=d[T]}i=i[i.length-1],p=d[i],c=c(p),c!=p&&c!=null&&e(d,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var d=0,p=!1,T={next:function(){if(!p&&d<i.length){var R=d++;return{value:c(R,i[R]),done:!1}}return p=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function h(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function f(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function y(i,c,d){return i.call.apply(i.bind,arguments)}function b(i,c,d){if(!i)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,p),i.apply(c,T)}}return function(){return i.apply(c,arguments)}}function x(i,c,d){return x=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?y:b,x.apply(null,arguments)}function C(i,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),i.apply(this,p)}}function k(i,c){function d(){}d.prototype=c.prototype,i.aa=c.prototype,i.prototype=new d,i.prototype.constructor=i,i.Qb=function(p,T,R){for(var V=Array(arguments.length-2),pe=2;pe<arguments.length;pe++)V[pe-2]=arguments[pe];return c.prototype[T].apply(p,V)}}function S(i){const c=i.length;if(0<c){const d=Array(c);for(let p=0;p<c;p++)d[p]=i[p];return d}return[]}function N(i,c){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(h(p)){const T=i.length||0,R=p.length||0;i.length=T+R;for(let V=0;V<R;V++)i[T+V]=p[V]}else i.push(p)}}class G{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function W(i){return/^[\s\xa0]*$/.test(i)}function U(){var i=u.navigator;return i&&(i=i.userAgent)?i:""}function B(i){return B[" "](i),i}B[" "]=function(){};var fe=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function M(i,c,d){for(const p in i)c.call(d,i[p],p,i)}function I(i,c){for(const d in i)c.call(void 0,i[d],d,i)}function m(i){const c={};for(const d in i)c[d]=i[d];return c}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(i,c){let d,p;for(let T=1;T<arguments.length;T++){p=arguments[T];for(d in p)i[d]=p[d];for(let R=0;R<g.length;R++)d=g[R],Object.prototype.hasOwnProperty.call(p,d)&&(i[d]=p[d])}}function w(i){var c=1;i=i.split(":");const d=[];for(;0<c&&i.length;)d.push(i.shift()),c--;return i.length&&d.push(i.join(":")),d}function E(i){u.setTimeout(()=>{throw i},0)}function v(){var i=pt;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class X{constructor(){this.h=this.g=null}add(c,d){const p=_e.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var _e=new G(()=>new Y,i=>i.reset());class Y{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let ge,je=!1,pt=new X,Xe=()=>{const i=u.Promise.resolve(void 0);ge=()=>{i.then(jn)}};var jn=()=>{for(var i;i=v();){try{i.h.call(i.g)}catch(d){E(d)}var c=_e;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}je=!1};function rt(){this.s=this.s,this.C=this.C}rt.prototype.s=!1,rt.prototype.ma=function(){this.s||(this.s=!0,this.N())},rt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ke(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}ke.prototype.h=function(){this.defaultPrevented=!0};var es=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const d=()=>{};u.addEventListener("test",d,c),u.removeEventListener("test",d,c)}catch{}return i}();function Yt(i,c){if(ke.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var d=this.type=i.type,p=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(fe){e:{try{B(c.nodeName);var T=!0;break e}catch{}T=!1}T||(c=null)}}else d=="mouseover"?c=i.fromElement:d=="mouseout"&&(c=i.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:j[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Yt.aa.h.call(this)}}k(Yt,ke);var j={2:"touch",3:"pen",4:"mouse"};Yt.prototype.h=function(){Yt.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var q="closure_listenable_"+(1e6*Math.random()|0),te=0;function Oe(i,c,d,p,T){this.listener=i,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=T,this.key=++te,this.da=this.fa=!1}function be(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Tt(i){this.src=i,this.g={},this.h=0}Tt.prototype.add=function(i,c,d,p,T){var R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);var V=On(i,c,p,T);return-1<V?(c=i[V],d||(c.fa=!1)):(c=new Oe(c,this.src,R,!!p,T),c.fa=d,i.push(c)),c};function Mt(i,c){var d=c.type;if(d in i.g){var p=i.g[d],T=Array.prototype.indexOf.call(p,c,void 0),R;(R=0<=T)&&Array.prototype.splice.call(p,T,1),R&&(be(c),i.g[d].length==0&&(delete i.g[d],i.h--))}}function On(i,c,d,p){for(var T=0;T<i.length;++T){var R=i[T];if(!R.da&&R.listener==c&&R.capture==!!d&&R.ha==p)return T}return-1}var At="closure_lm_"+(1e6*Math.random()|0),st={};function Dn(i,c,d,p,T){if(Array.isArray(c)){for(var R=0;R<c.length;R++)Dn(i,c[R],d,p,T);return null}return d=ir(d),i&&i[q]?i.K(c,d,f(p)?!!p.capture:!1,T):ya(i,c,d,!1,p,T)}function ya(i,c,d,p,T,R){if(!c)throw Error("Invalid event type");var V=f(T)?!!T.capture:!!T,pe=pn(i);if(pe||(i[At]=pe=new Tt(i)),d=pe.add(c,d,p,V,R),d.proxy)return d;if(p=ts(),d.proxy=p,p.src=i,p.listener=d,i.addEventListener)es||(T=V),T===void 0&&(T=!1),i.addEventListener(c.toString(),p,T);else if(i.attachEvent)i.attachEvent(rs(c.toString()),p);else if(i.addListener&&i.removeListener)i.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function ts(){function i(d){return c.call(i.src,i.listener,d)}const c=Vt;return i}function Ti(i,c,d,p,T){if(Array.isArray(c))for(var R=0;R<c.length;R++)Ti(i,c[R],d,p,T);else p=f(p)?!!p.capture:!!p,d=ir(d),i&&i[q]?(i=i.i,c=String(c).toString(),c in i.g&&(R=i.g[c],d=On(R,d,p,T),-1<d&&(be(R[d]),Array.prototype.splice.call(R,d,1),R.length==0&&(delete i.g[c],i.h--)))):i&&(i=pn(i))&&(c=i.g[c.toString()],i=-1,c&&(i=On(c,d,p,T)),(d=-1<i?c[i]:null)&&ns(d))}function ns(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[q])Mt(c.i,i);else{var d=i.type,p=i.proxy;c.removeEventListener?c.removeEventListener(d,p,i.capture):c.detachEvent?c.detachEvent(rs(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=pn(c))?(Mt(d,i),d.h==0&&(d.src=null,c[At]=null)):be(i)}}}function rs(i){return i in st?st[i]:st[i]="on"+i}function Vt(i,c){if(i.da)i=!0;else{c=new Yt(c,this);var d=i.listener,p=i.ha||i.src;i.fa&&ns(i),i=d.call(p,c)}return i}function pn(i){return i=i[At],i instanceof Tt?i:null}var z="__closure_events_fn_"+(1e9*Math.random()>>>0);function ir(i){return typeof i=="function"?i:(i[z]||(i[z]=function(c){return i.handleEvent(c)}),i[z])}function he(){rt.call(this),this.i=new Tt(this),this.M=this,this.F=null}k(he,rt),he.prototype[q]=!0,he.prototype.removeEventListener=function(i,c,d,p){Ti(this,i,c,d,p)};function ee(i,c){var d,p=i.F;if(p)for(d=[];p;p=p.F)d.push(p);if(i=i.M,p=c.type||c,typeof c=="string")c=new ke(c,i);else if(c instanceof ke)c.target=c.target||i;else{var T=c;c=new ke(p,i),_(c,T)}if(T=!0,d)for(var R=d.length-1;0<=R;R--){var V=c.g=d[R];T=Ln(V,p,!0,c)&&T}if(V=c.g=i,T=Ln(V,p,!0,c)&&T,T=Ln(V,p,!1,c)&&T,d)for(R=0;R<d.length;R++)V=c.g=d[R],T=Ln(V,p,!1,c)&&T}he.prototype.N=function(){if(he.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var d=i.g[c],p=0;p<d.length;p++)be(d[p]);delete i.g[c],i.h--}}this.F=null},he.prototype.K=function(i,c,d,p){return this.i.add(String(i),c,!1,d,p)},he.prototype.L=function(i,c,d,p){return this.i.add(String(i),c,!0,d,p)};function Ln(i,c,d,p){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var T=!0,R=0;R<c.length;++R){var V=c[R];if(V&&!V.da&&V.capture==d){var pe=V.listener,Ue=V.ha||V.src;V.fa&&Mt(i.i,V),T=pe.call(Ue,p)!==!1&&T}}return T&&!p.defaultPrevented}function le(i,c,d){if(typeof i=="function")d&&(i=x(i,d));else if(i&&typeof i.handleEvent=="function")i=x(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:u.setTimeout(i,c||0)}function ct(i){i.g=le(()=>{i.g=null,i.i&&(i.i=!1,ct(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Z extends rt{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:ct(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Xt(i){rt.call(this),this.h=i,this.g={}}k(Xt,rt);var it=[];function or(i){M(i.g,function(c,d){this.g.hasOwnProperty(d)&&ns(c)},i),i.g={}}Xt.prototype.N=function(){Xt.aa.N.call(this),or(this)},Xt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ar=u.JSON.stringify,va=u.JSON.parse,Ai=class{stringify(i){return u.JSON.stringify(i,void 0)}parse(i){return u.JSON.parse(i,void 0)}};function lr(){}lr.prototype.h=null;function cr(i){return i.h||(i.h=i.i())}function ss(){}var Zt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ur(){ke.call(this,"d")}k(ur,ke);function hr(){ke.call(this,"c")}k(hr,ke);var Ft={},is=null;function Mn(){return is=is||new he}Ft.La="serverreachability";function os(i){ke.call(this,Ft.La,i)}k(os,ke);function P(i){const c=Mn();ee(c,new os(c))}Ft.STAT_EVENT="statevent";function $(i,c){ke.call(this,Ft.STAT_EVENT,i),this.stat=c}k($,ke);function D(i){const c=Mn();ee(c,new $(c,i))}Ft.Ma="timingevent";function re(i,c){ke.call(this,Ft.Ma,i),this.size=c}k(re,ke);function F(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){i()},c)}function se(){this.g=!0}se.prototype.xa=function(){this.g=!1};function Ee(i,c,d,p,T,R){i.info(function(){if(i.g)if(R)for(var V="",pe=R.split("&"),Ue=0;Ue<pe.length;Ue++){var ue=pe[Ue].split("=");if(1<ue.length){var He=ue[0];ue=ue[1];var qe=He.split("_");V=2<=qe.length&&qe[1]=="type"?V+(He+"="+ue+"&"):V+(He+"=redacted&")}}else V=null;else V=R;return"XMLHTTP REQ ("+p+") [attempt "+T+"]: "+c+`
`+d+`
`+V})}function Pe(i,c,d,p,T,R,V){i.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+T+"]: "+c+`
`+d+`
`+R+" "+V})}function Te(i,c,d,p){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+De(i,d)+(p?" "+p:"")})}function Ce(i,c){i.info(function(){return"TIMEOUT: "+c})}se.prototype.info=function(){};function De(i,c){if(!i.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(i=0;i<d.length;i++)if(Array.isArray(d[i])){var p=d[i];if(!(2>p.length)){var T=p[1];if(Array.isArray(T)&&!(1>T.length)){var R=T[0];if(R!="noop"&&R!="stop"&&R!="close")for(var V=1;V<T.length;V++)T[V]=""}}}}return ar(d)}catch{return c}}var de={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ct={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},en;function ye(){}k(ye,lr),ye.prototype.g=function(){return new XMLHttpRequest},ye.prototype.i=function(){return{}},en=new ye;function Ze(i,c,d,p){this.j=i,this.i=c,this.l=d,this.R=p||1,this.U=new Xt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new We}function We(){this.i=null,this.g="",this.h=!1}var Le={},ut={};function St(i,c,d){i.L=1,i.v=us(Ut(c)),i.m=d,i.P=!0,dr(i,null)}function dr(i,c){i.F=Date.now(),as(i),i.A=Ut(i.v);var d=i.A,p=i.R;Array.isArray(p)||(p=[String(p)]),ka(d.i,"t",p),i.C=0,d=i.j.J,i.h=new We,i.g=Ja(i.j,d?c:null,!i.m),0<i.O&&(i.M=new Z(x(i.Y,i,i.g),i.O)),c=i.U,d=i.g,p=i.ca;var T="readystatechange";Array.isArray(T)||(T&&(it[0]=T.toString()),T=it);for(var R=0;R<T.length;R++){var V=Dn(d,T[R],p||c.handleEvent,!1,c.h||c);if(!V)break;c.g[V.key]=V}c=i.H?m(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),P(),Ee(i.i,i.u,i.A,i.l,i.R,i.m)}Ze.prototype.ca=function(i){i=i.target;const c=this.M;c&&Bt(i)==3?c.j():this.Y(i)},Ze.prototype.Y=function(i){try{if(i==this.g)e:{const qe=Bt(this.g);var c=this.g.Ba();const Un=this.g.Z();if(!(3>qe)&&(qe!=3||this.g&&(this.h.h||this.g.oa()||Va(this.g)))){this.J||qe!=4||c==7||(c==8||0>=Un?P(3):P(2)),Ci(this);var d=this.g.Z();this.X=d;t:if(fr(this)){var p=Va(this.g);i="";var T=p.length,R=Bt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){mn(this),pr(this);var V="";break t}this.h.i=new u.TextDecoder}for(c=0;c<T;c++)this.h.h=!0,i+=this.h.i.decode(p[c],{stream:!(R&&c==T-1)});p.length=0,this.h.g+=i,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=d==200,Pe(this.i,this.u,this.A,this.l,this.R,qe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var pe,Ue=this.g;if((pe=Ue.g?Ue.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!W(pe)){var ue=pe;break t}}ue=null}if(d=ue)Te(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Si(this,d);else{this.o=!1,this.s=3,D(12),mn(this),pr(this);break e}}if(this.P){d=!0;let mt;for(;!this.J&&this.C<V.length;)if(mt=od(this,V),mt==ut){qe==4&&(this.s=4,D(14),d=!1),Te(this.i,this.l,null,"[Incomplete Response]");break}else if(mt==Le){this.s=4,D(15),Te(this.i,this.l,V,"[Invalid Chunk]"),d=!1;break}else Te(this.i,this.l,mt,null),Si(this,mt);if(fr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),qe!=4||V.length!=0||this.h.h||(this.s=1,D(16),d=!1),this.o=this.o&&d,!d)Te(this.i,this.l,V,"[Invalid Chunked Response]"),mn(this),pr(this);else if(0<V.length&&!this.W){this.W=!0;var He=this.j;He.g==this&&He.ba&&!He.M&&(He.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Oi(He),He.M=!0,D(11))}}else Te(this.i,this.l,V,null),Si(this,V);qe==4&&mn(this),this.o&&!this.J&&(qe==4?Ha(this.j,this):(this.o=!1,as(this)))}else Ed(this.g),d==400&&0<V.indexOf("Unknown SID")?(this.s=3,D(12)):(this.s=0,D(13)),mn(this),pr(this)}}}catch{}finally{}};function fr(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function od(i,c){var d=i.C,p=c.indexOf(`
`,d);return p==-1?ut:(d=Number(c.substring(d,p)),isNaN(d)?Le:(p+=1,p+d>c.length?ut:(c=c.slice(p,p+d),i.C=p+d,c)))}Ze.prototype.cancel=function(){this.J=!0,mn(this)};function as(i){i.S=Date.now()+i.I,_a(i,i.I)}function _a(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=F(x(i.ba,i),c)}function Ci(i){i.B&&(u.clearTimeout(i.B),i.B=null)}Ze.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Ce(this.i,this.A),this.L!=2&&(P(),D(17)),mn(this),this.s=2,pr(this)):_a(this,this.S-i)};function pr(i){i.j.G==0||i.J||Ha(i.j,i)}function mn(i){Ci(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,or(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function Si(i,c){try{var d=i.j;if(d.G!=0&&(d.g==i||Ri(d.h,i))){if(!i.K&&Ri(d.h,i)&&d.G==3){try{var p=d.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var T=p;if(T[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<i.F)gs(d),ps(d);else break e;ji(d),D(18)}}else d.za=T[1],0<d.za-d.T&&37500>T[2]&&d.F&&d.v==0&&!d.C&&(d.C=F(x(d.Za,d),6e3));if(1>=ba(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else yn(d,11)}else if((i.K||d.g==i)&&gs(d),!W(c))for(T=d.Da.g.parse(c),c=0;c<T.length;c++){let ue=T[c];if(d.T=ue[0],ue=ue[1],d.G==2)if(ue[0]=="c"){d.K=ue[1],d.ia=ue[2];const He=ue[3];He!=null&&(d.la=He,d.j.info("VER="+d.la));const qe=ue[4];qe!=null&&(d.Aa=qe,d.j.info("SVER="+d.Aa));const Un=ue[5];Un!=null&&typeof Un=="number"&&0<Un&&(p=1.5*Un,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const mt=i.g;if(mt){const vs=mt.g?mt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(vs){var R=p.h;R.g||vs.indexOf("spdy")==-1&&vs.indexOf("quic")==-1&&vs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Ni(R,R.h),R.h=null))}if(p.D){const Di=mt.g?mt.g.getResponseHeader("X-HTTP-Session-Id"):null;Di&&(p.ya=Di,we(p.I,p.D,Di))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-i.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var V=i;if(p.qa=Ka(p,p.J?p.ia:null,p.W),V.K){Ea(p.h,V);var pe=V,Ue=p.L;Ue&&(pe.I=Ue),pe.B&&(Ci(pe),as(pe)),p.g=V}else Ga(p);0<d.i.length&&ms(d)}else ue[0]!="stop"&&ue[0]!="close"||yn(d,7);else d.G==3&&(ue[0]=="stop"||ue[0]=="close"?ue[0]=="stop"?yn(d,7):Pi(d):ue[0]!="noop"&&d.l&&d.l.ta(ue),d.v=0)}}P(4)}catch{}}var ad=class{constructor(i,c){this.g=i,this.map=c}};function wa(i){this.l=i||10,u.PerformanceNavigationTiming?(i=u.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ia(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function ba(i){return i.h?1:i.g?i.g.size:0}function Ri(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Ni(i,c){i.g?i.g.add(c):i.h=c}function Ea(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}wa.prototype.cancel=function(){if(this.i=xa(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function xa(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const d of i.g.values())c=c.concat(d.D);return c}return S(i.i)}function ld(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var c=[],d=i.length,p=0;p<d;p++)c.push(i[p]);return c}c=[],d=0;for(p in i)c[d++]=i[p];return c}function cd(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var c=[];i=i.length;for(var d=0;d<i;d++)c.push(d);return c}c=[],d=0;for(const p in i)c[d++]=p;return c}}}function Ta(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var d=cd(i),p=ld(i),T=p.length,R=0;R<T;R++)c.call(void 0,p[R],d&&d[R],i)}var Aa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ud(i,c){if(i){i=i.split("&");for(var d=0;d<i.length;d++){var p=i[d].indexOf("="),T=null;if(0<=p){var R=i[d].substring(0,p);T=i[d].substring(p+1)}else R=i[d];c(R,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function gn(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof gn){this.h=i.h,ls(this,i.j),this.o=i.o,this.g=i.g,cs(this,i.s),this.l=i.l;var c=i.i,d=new yr;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),Ca(this,d),this.m=i.m}else i&&(c=String(i).match(Aa))?(this.h=!1,ls(this,c[1]||"",!0),this.o=mr(c[2]||""),this.g=mr(c[3]||"",!0),cs(this,c[4]),this.l=mr(c[5]||"",!0),Ca(this,c[6]||"",!0),this.m=mr(c[7]||"")):(this.h=!1,this.i=new yr(null,this.h))}gn.prototype.toString=function(){var i=[],c=this.j;c&&i.push(gr(c,Sa,!0),":");var d=this.g;return(d||c=="file")&&(i.push("//"),(c=this.o)&&i.push(gr(c,Sa,!0),"@"),i.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&i.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&i.push("/"),i.push(gr(d,d.charAt(0)=="/"?fd:dd,!0))),(d=this.i.toString())&&i.push("?",d),(d=this.m)&&i.push("#",gr(d,md)),i.join("")};function Ut(i){return new gn(i)}function ls(i,c,d){i.j=d?mr(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function cs(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function Ca(i,c,d){c instanceof yr?(i.i=c,gd(i.i,i.h)):(d||(c=gr(c,pd)),i.i=new yr(c,i.h))}function we(i,c,d){i.i.set(c,d)}function us(i){return we(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function mr(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function gr(i,c,d){return typeof i=="string"?(i=encodeURI(i).replace(c,hd),d&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function hd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Sa=/[#\/\?@]/g,dd=/[#\?:]/g,fd=/[#\?]/g,pd=/[#\?@]/g,md=/#/g;function yr(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function tn(i){i.g||(i.g=new Map,i.h=0,i.i&&ud(i.i,function(c,d){i.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=yr.prototype,n.add=function(i,c){tn(this),this.i=null,i=Vn(this,i);var d=this.g.get(i);return d||this.g.set(i,d=[]),d.push(c),this.h+=1,this};function Ra(i,c){tn(i),c=Vn(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function Na(i,c){return tn(i),c=Vn(i,c),i.g.has(c)}n.forEach=function(i,c){tn(this),this.g.forEach(function(d,p){d.forEach(function(T){i.call(c,T,p,this)},this)},this)},n.na=function(){tn(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let p=0;p<c.length;p++){const T=i[p];for(let R=0;R<T.length;R++)d.push(c[p])}return d},n.V=function(i){tn(this);let c=[];if(typeof i=="string")Na(this,i)&&(c=c.concat(this.g.get(Vn(this,i))));else{i=Array.from(this.g.values());for(let d=0;d<i.length;d++)c=c.concat(i[d])}return c},n.set=function(i,c){return tn(this),this.i=null,i=Vn(this,i),Na(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function ka(i,c,d){Ra(i,c),0<d.length&&(i.i=null,i.g.set(Vn(i,c),S(d)),i.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var p=c[d];const R=encodeURIComponent(String(p)),V=this.V(p);for(p=0;p<V.length;p++){var T=R;V[p]!==""&&(T+="="+encodeURIComponent(String(V[p]))),i.push(T)}}return this.i=i.join("&")};function Vn(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function gd(i,c){c&&!i.j&&(tn(i),i.i=null,i.g.forEach(function(d,p){var T=p.toLowerCase();p!=T&&(Ra(this,p),ka(this,T,d))},i)),i.j=c}function yd(i,c){const d=new se;if(u.Image){const p=new Image;p.onload=C(nn,d,"TestLoadImage: loaded",!0,c,p),p.onerror=C(nn,d,"TestLoadImage: error",!1,c,p),p.onabort=C(nn,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=C(nn,d,"TestLoadImage: timeout",!1,c,p),u.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=i}else c(!1)}function vd(i,c){const d=new se,p=new AbortController,T=setTimeout(()=>{p.abort(),nn(d,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:p.signal}).then(R=>{clearTimeout(T),R.ok?nn(d,"TestPingServer: ok",!0,c):nn(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(T),nn(d,"TestPingServer: error",!1,c)})}function nn(i,c,d,p,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),p(d)}catch{}}function _d(){this.g=new Ai}function wd(i,c,d){const p=d||"";try{Ta(i,function(T,R){let V=T;f(T)&&(V=ar(T)),c.push(p+R+"="+encodeURIComponent(V))})}catch(T){throw c.push(p+"type="+encodeURIComponent("_badmap")),T}}function hs(i){this.l=i.Ub||null,this.j=i.eb||!1}k(hs,lr),hs.prototype.g=function(){return new ds(this.l,this.j)},hs.prototype.i=function(i){return function(){return i}}({});function ds(i,c){he.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(ds,he),n=ds.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,_r(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||u).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,vr(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,_r(this)),this.g&&(this.readyState=3,_r(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Pa(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function Pa(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?vr(this):_r(this),this.readyState==3&&Pa(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,vr(this))},n.Qa=function(i){this.g&&(this.response=i,vr(this))},n.ga=function(){this.g&&vr(this)};function vr(i){i.readyState=4,i.l=null,i.j=null,i.v=null,_r(i)}n.setRequestHeader=function(i,c){this.u.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,i.push(d[0]+": "+d[1]),d=c.next();return i.join(`\r
`)};function _r(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ds.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function ja(i){let c="";return M(i,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function ki(i,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=ja(d),typeof i=="string"?d!=null&&encodeURIComponent(String(d)):we(i,c,d))}function xe(i){he.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(xe,he);var Id=/^https?$/i,bd=["POST","PUT"];n=xe.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():en.g(),this.v=this.o?cr(this.o):cr(en),this.g.onreadystatechange=x(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(R){Oa(this,R);return}if(i=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var T in p)d.set(T,p[T]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const R of p.keys())d.set(R,p.get(R));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(R=>R.toLowerCase()=="content-type"),T=u.FormData&&i instanceof u.FormData,!(0<=Array.prototype.indexOf.call(bd,c,void 0))||p||T||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of d)this.g.setRequestHeader(R,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ma(this),this.u=!0,this.g.send(i),this.u=!1}catch(R){Oa(this,R)}};function Oa(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,Da(i),fs(i)}function Da(i){i.A||(i.A=!0,ee(i,"complete"),ee(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ee(this,"complete"),ee(this,"abort"),fs(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),fs(this,!0)),xe.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?La(this):this.bb())},n.bb=function(){La(this)};function La(i){if(i.h&&typeof a<"u"&&(!i.v[1]||Bt(i)!=4||i.Z()!=2)){if(i.u&&Bt(i)==4)le(i.Ea,0,i);else if(ee(i,"readystatechange"),Bt(i)==4){i.h=!1;try{const V=i.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=V===0){var T=String(i.D).match(Aa)[1]||null;!T&&u.self&&u.self.location&&(T=u.self.location.protocol.slice(0,-1)),p=!Id.test(T?T.toLowerCase():"")}d=p}if(d)ee(i,"complete"),ee(i,"success");else{i.m=6;try{var R=2<Bt(i)?i.g.statusText:""}catch{R=""}i.l=R+" ["+i.Z()+"]",Da(i)}}finally{fs(i)}}}}function fs(i,c){if(i.g){Ma(i);const d=i.g,p=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||ee(i,"ready");try{d.onreadystatechange=p}catch{}}}function Ma(i){i.I&&(u.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function Bt(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<Bt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),va(c)}};function Va(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Ed(i){const c={};i=(i.g&&2<=Bt(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<i.length;p++){if(W(i[p]))continue;var d=w(i[p]);const T=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const R=c[T]||[];c[T]=R,R.push(d)}I(c,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function wr(i,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[i]||c}function Fa(i){this.Aa=0,this.i=[],this.j=new se,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=wr("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=wr("baseRetryDelayMs",5e3,i),this.cb=wr("retryDelaySeedMs",1e4,i),this.Wa=wr("forwardChannelMaxRetries",2,i),this.wa=wr("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new wa(i&&i.concurrentRequestLimit),this.Da=new _d,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Fa.prototype,n.la=8,n.G=1,n.connect=function(i,c,d,p){D(0),this.W=i,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Ka(this,null,this.W),ms(this)};function Pi(i){if(Ua(i),i.G==3){var c=i.U++,d=Ut(i.I);if(we(d,"SID",i.K),we(d,"RID",c),we(d,"TYPE","terminate"),Ir(i,d),c=new Ze(i,i.j,c),c.L=2,c.v=us(Ut(d)),d=!1,u.navigator&&u.navigator.sendBeacon)try{d=u.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&u.Image&&(new Image().src=c.v,d=!0),d||(c.g=Ja(c.j,null),c.g.ea(c.v)),c.F=Date.now(),as(c)}za(i)}function ps(i){i.g&&(Oi(i),i.g.cancel(),i.g=null)}function Ua(i){ps(i),i.u&&(u.clearTimeout(i.u),i.u=null),gs(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&u.clearTimeout(i.s),i.s=null)}function ms(i){if(!Ia(i.h)&&!i.s){i.s=!0;var c=i.Ga;ge||Xe(),je||(ge(),je=!0),pt.add(c,i),i.B=0}}function xd(i,c){return ba(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=F(x(i.Ga,i,c),qa(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const T=new Ze(this,this.j,i);let R=this.o;if(this.S&&(R?(R=m(R),_(R,this.S)):R=this.S),this.m!==null||this.O||(T.H=R,R=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=$a(this,T,c),d=Ut(this.I),we(d,"RID",i),we(d,"CVER",22),this.D&&we(d,"X-HTTP-Session-Id",this.D),Ir(this,d),R&&(this.O?c="headers="+encodeURIComponent(String(ja(R)))+"&"+c:this.m&&ki(d,this.m,R)),Ni(this.h,T),this.Ua&&we(d,"TYPE","init"),this.P?(we(d,"$req",c),we(d,"SID","null"),T.T=!0,St(T,d,null)):St(T,d,c),this.G=2}}else this.G==3&&(i?Ba(this,i):this.i.length==0||Ia(this.h)||Ba(this))};function Ba(i,c){var d;c?d=c.l:d=i.U++;const p=Ut(i.I);we(p,"SID",i.K),we(p,"RID",d),we(p,"AID",i.T),Ir(i,p),i.m&&i.o&&ki(p,i.m,i.o),d=new Ze(i,i.j,d,i.B+1),i.m===null&&(d.H=i.o),c&&(i.i=c.D.concat(i.i)),c=$a(i,d,1e3),d.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Ni(i.h,d),St(d,p,c)}function Ir(i,c){i.H&&M(i.H,function(d,p){we(c,p,d)}),i.l&&Ta({},function(d,p){we(c,p,d)})}function $a(i,c,d){d=Math.min(i.i.length,d);var p=i.l?x(i.l.Na,i.l,i):null;e:{var T=i.i;let R=-1;for(;;){const V=["count="+d];R==-1?0<d?(R=T[0].g,V.push("ofs="+R)):R=0:V.push("ofs="+R);let pe=!0;for(let Ue=0;Ue<d;Ue++){let ue=T[Ue].g;const He=T[Ue].map;if(ue-=R,0>ue)R=Math.max(0,T[Ue].g-100),pe=!1;else try{wd(He,V,"req"+ue+"_")}catch{p&&p(He)}}if(pe){p=V.join("&");break e}}}return i=i.i.splice(0,d),c.D=i,p}function Ga(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;ge||Xe(),je||(ge(),je=!0),pt.add(c,i),i.v=0}}function ji(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=F(x(i.Fa,i),qa(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Wa(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=F(x(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,D(10),ps(this),Wa(this))};function Oi(i){i.A!=null&&(u.clearTimeout(i.A),i.A=null)}function Wa(i){i.g=new Ze(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=Ut(i.qa);we(c,"RID","rpc"),we(c,"SID",i.K),we(c,"AID",i.T),we(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&we(c,"TO",i.ja),we(c,"TYPE","xmlhttp"),Ir(i,c),i.m&&i.o&&ki(c,i.m,i.o),i.L&&(i.g.I=i.L);var d=i.g;i=i.ia,d.L=1,d.v=us(Ut(c)),d.m=null,d.P=!0,dr(d,i)}n.Za=function(){this.C!=null&&(this.C=null,ps(this),ji(this),D(19))};function gs(i){i.C!=null&&(u.clearTimeout(i.C),i.C=null)}function Ha(i,c){var d=null;if(i.g==c){gs(i),Oi(i),i.g=null;var p=2}else if(Ri(i.h,c))d=c.D,Ea(i.h,c),p=1;else return;if(i.G!=0){if(c.o)if(p==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var T=i.B;p=Mn(),ee(p,new re(p,d)),ms(i)}else Ga(i);else if(T=c.s,T==3||T==0&&0<c.X||!(p==1&&xd(i,c)||p==2&&ji(i)))switch(d&&0<d.length&&(c=i.h,c.i=c.i.concat(d)),T){case 1:yn(i,5);break;case 4:yn(i,10);break;case 3:yn(i,6);break;default:yn(i,2)}}}function qa(i,c){let d=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(d*=2),d*c}function yn(i,c){if(i.j.info("Error code "+c),c==2){var d=x(i.fb,i),p=i.Xa;const T=!p;p=new gn(p||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||ls(p,"https"),us(p),T?yd(p.toString(),d):vd(p.toString(),d)}else D(2);i.G=0,i.l&&i.l.sa(c),za(i),Ua(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),D(2)):(this.j.info("Failed to ping google.com"),D(1))};function za(i){if(i.G=0,i.ka=[],i.l){const c=xa(i.h);(c.length!=0||i.i.length!=0)&&(N(i.ka,c),N(i.ka,i.i),i.h.i.length=0,S(i.i),i.i.length=0),i.l.ra()}}function Ka(i,c,d){var p=d instanceof gn?Ut(d):new gn(d);if(p.g!="")c&&(p.g=c+"."+p.g),cs(p,p.s);else{var T=u.location;p=T.protocol,c=c?c+"."+T.hostname:T.hostname,T=+T.port;var R=new gn(null);p&&ls(R,p),c&&(R.g=c),T&&cs(R,T),d&&(R.l=d),p=R}return d=i.D,c=i.ya,d&&c&&we(p,d,c),we(p,"VER",i.la),Ir(i,p),p}function Ja(i,c,d){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new xe(new hs({eb:d})):new xe(i.pa),c.Ha(i.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qa(){}n=Qa.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function ys(){}ys.prototype.g=function(i,c){return new ot(i,c)};function ot(i,c){he.call(this),this.g=new Fa(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!W(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!W(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new Fn(this)}k(ot,he),ot.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ot.prototype.close=function(){Pi(this.g)},ot.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var d={};d.__data__=i,i=d}else this.u&&(d={},d.__data__=ar(i),i=d);c.i.push(new ad(c.Ya++,i)),c.G==3&&ms(c)},ot.prototype.N=function(){this.g.l=null,delete this.j,Pi(this.g),delete this.g,ot.aa.N.call(this)};function Ya(i){ur.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const d in c){i=d;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}k(Ya,ur);function Xa(){hr.call(this),this.status=1}k(Xa,hr);function Fn(i){this.g=i}k(Fn,Qa),Fn.prototype.ua=function(){ee(this.g,"a")},Fn.prototype.ta=function(i){ee(this.g,new Ya(i))},Fn.prototype.sa=function(i){ee(this.g,new Xa)},Fn.prototype.ra=function(){ee(this.g,"b")},ys.prototype.createWebChannel=ys.prototype.g,ot.prototype.send=ot.prototype.o,ot.prototype.open=ot.prototype.m,ot.prototype.close=ot.prototype.close,_u=function(){return new ys},vu=function(){return Mn()},yu=Ft,lo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},de.NO_ERROR=0,de.TIMEOUT=8,de.HTTP_ERROR=6,ks=de,Ct.COMPLETE="complete",gu=Ct,ss.EventType=Zt,Zt.OPEN="a",Zt.CLOSE="b",Zt.ERROR="c",Zt.MESSAGE="d",he.prototype.listen=he.prototype.K,Tr=ss,xe.prototype.listenOnce=xe.prototype.L,xe.prototype.getLastError=xe.prototype.Ka,xe.prototype.getLastErrorCode=xe.prototype.Ba,xe.prototype.getStatus=xe.prototype.Z,xe.prototype.getResponseJson=xe.prototype.Oa,xe.prototype.getResponseText=xe.prototype.oa,xe.prototype.send=xe.prototype.ea,xe.prototype.setWithCredentials=xe.prototype.Ha,mu=xe}).apply(typeof ws<"u"?ws:typeof self<"u"?self:typeof window<"u"?window:{});const Rl="@firebase/firestore";/**
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
 */class Ke{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ke.UNAUTHENTICATED=new Ke(null),Ke.GOOGLE_CREDENTIALS=new Ke("google-credentials-uid"),Ke.FIRST_PARTY=new Ke("first-party-uid"),Ke.MOCK_USER=new Ke("mock-user");/**
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
 */let nr="10.14.0";/**
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
 */const Tn=new ai("@firebase/firestore");function br(){return Tn.logLevel}function H(n,...e){if(Tn.logLevel<=oe.DEBUG){const t=e.map(Uo);Tn.debug(`Firestore (${nr}): ${n}`,...t)}}function An(n,...e){if(Tn.logLevel<=oe.ERROR){const t=e.map(Uo);Tn.error(`Firestore (${nr}): ${n}`,...t)}}function qs(n,...e){if(Tn.logLevel<=oe.WARN){const t=e.map(Uo);Tn.warn(`Firestore (${nr}): ${n}`,...t)}}function Uo(n){if(typeof n=="string")return n;try{/**
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
 */function ae(n="Unexpected state"){const e=`FIRESTORE (${nr}) INTERNAL ASSERTION FAILED: `+n;throw An(e),new Error(e)}function Ae(n,e){n||ae()}function ve(n,e){return n}/**
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
 */const L={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Q extends xt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class bn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class wu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Ig{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ke.UNAUTHENTICATED))}shutdown(){}}class bg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Eg{constructor(e){this.t=e,this.currentUser=Ke.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ae(this.o===void 0);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new bn;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new bn,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new bn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ae(typeof r.accessToken=="string"),new wu(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ae(e===null||typeof e=="string"),new Ke(e)}}class xg{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Ke.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Tg{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new xg(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Ke.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ag{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Cg{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Ae(this.o===void 0);const r=o=>{o.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,H("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Ae(typeof t.token=="string"),this.R=t.token,new Ag(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Sg(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class Iu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Sg(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%e.length))}return r}}function me(n,e){return n<e?-1:n>e?1:0}function Kn(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
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
 */class Fe{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Q(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Q(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new Q(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Q(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Fe.fromMillis(Date.now())}static fromDate(e){return Fe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new Fe(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?me(this.nanoseconds,e.nanoseconds):me(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class Ie{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Ie(e)}static min(){return new Ie(new Fe(0,0))}static max(){return new Ie(new Fe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class Mr{constructor(e,t,r){t===void 0?t=0:t>e.length&&ae(),r===void 0?r=e.length-t:r>e.length-t&&ae(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Mr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Mr?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=e.get(s),a=t.get(s);if(o<a)return-1;if(o>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Re extends Mr{construct(e,t,r){return new Re(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new Q(L.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Re(t)}static emptyPath(){return new Re([])}}const Rg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ge extends Mr{construct(e,t,r){return new Ge(e,t,r)}static isValidIdentifier(e){return Rg.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ge.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ge(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new Q(L.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new Q(L.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new Q(L.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new Q(L.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ge(t)}static emptyPath(){return new Ge([])}}/**
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
 */class ne{constructor(e){this.path=e}static fromPath(e){return new ne(Re.fromString(e))}static fromName(e){return new ne(Re.fromString(e).popFirst(5))}static empty(){return new ne(Re.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Re.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Re.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ne(new Re(e.slice()))}}function Ng(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=Ie.fromTimestamp(r===1e9?new Fe(t+1,0):new Fe(t,r));return new hn(s,ne.empty(),e)}function kg(n){return new hn(n.readTime,n.key,-1)}class hn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new hn(Ie.min(),ne.empty(),-1)}static max(){return new hn(Ie.max(),ne.empty(),-1)}}function Pg(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=ne.comparator(n.documentKey,e.documentKey),t!==0?t:me(n.largestBatchId,e.largestBatchId))}/**
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
 */const jg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Og{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function bu(n){if(n.code!==L.FAILED_PRECONDITION||n.message!==jg)throw n;H("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class O{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ae(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new O((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof O?t:O.resolve(t)}catch(t){return O.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):O.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):O.reject(t)}static resolve(e){return new O((t,r)=>{t(e)})}static reject(e){return new O((t,r)=>{r(e)})}static waitFor(e){return new O((t,r)=>{let s=0,o=0,a=!1;e.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=O.resolve(!1);for(const r of e)t=t.next(s=>s?O.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new O((r,s)=>{const o=e.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const f=h;t(e[f]).next(y=>{a[f]=y,++u,u===o&&r(a)},y=>s(y))}})}static doWhile(e,t){return new O((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function Dg(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function hi(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Eu{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Eu.oe=-1;function Bo(n){return n==null}function zs(n){return n===0&&1/n==-1/0}function Lg(n){return typeof n=="number"&&Number.isInteger(n)&&!zs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function Nl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Qr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function xu(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class nt{constructor(e,t){this.comparator=e,this.root=t||Be.EMPTY}insert(e,t){return new nt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Be.BLACK,null,null))}remove(e){return new nt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Be.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Is(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Is(this.root,e,this.comparator,!1)}getReverseIterator(){return new Is(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Is(this.root,e,this.comparator,!0)}}class Is{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Be{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??Be.RED,this.left=s??Be.EMPTY,this.right=o??Be.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new Be(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Be.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Be.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Be.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Be.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw ae();const e=this.left.check();if(e!==this.right.check())throw ae();return e+(this.isRed()?0:1)}}Be.EMPTY=null,Be.RED=!0,Be.BLACK=!1;Be.EMPTY=new class{constructor(){this.size=0}get key(){throw ae()}get value(){throw ae()}get color(){throw ae()}get left(){throw ae()}get right(){throw ae()}copy(e,t,r,s,o){return this}insert(e,t,r){return new Be(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Qe{constructor(e){this.comparator=e,this.data=new nt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new kl(this.data.getIterator())}getIteratorFrom(e){return new kl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof Qe)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Qe(this.comparator);return t.data=e,t}}class kl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class wt{constructor(e){this.fields=e,e.sort(Ge.comparator)}static empty(){return new wt([])}unionWith(e){let t=new Qe(Ge.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new wt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Kn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class Mg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class jt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Mg("Invalid base64 string: "+o):o}}(e);return new jt(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new jt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return me(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}jt.EMPTY_BYTE_STRING=new jt("");const Vg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Cn(n){if(Ae(!!n),typeof n=="string"){let e=0;const t=Vg.exec(n);if(Ae(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:$e(n.seconds),nanos:$e(n.nanos)}}function $e(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Vr(n){return typeof n=="string"?jt.fromBase64String(n):jt.fromUint8Array(n)}/**
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
 */function $o(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Tu(n){const e=n.mapValue.fields.__previous_value__;return $o(e)?Tu(e):e}function Ks(n){const e=Cn(n.mapValue.fields.__local_write_time__.timestampValue);return new Fe(e.seconds,e.nanos)}/**
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
 */class Fg{constructor(e,t,r,s,o,a,u,h,f){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=f}}class Js{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Js("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Js&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const bs={mapValue:{}};function Jn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?$o(n)?4:Bg(n)?9007199254740991:Ug(n)?10:11:ae()}function Ot(n,e){if(n===e)return!0;const t=Jn(n);if(t!==Jn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Ks(n).isEqual(Ks(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=Cn(s.timestampValue),u=Cn(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Vr(s.bytesValue).isEqual(Vr(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return $e(s.geoPointValue.latitude)===$e(o.geoPointValue.latitude)&&$e(s.geoPointValue.longitude)===$e(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return $e(s.integerValue)===$e(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=$e(s.doubleValue),u=$e(o.doubleValue);return a===u?zs(a)===zs(u):isNaN(a)&&isNaN(u)}return!1}(n,e);case 9:return Kn(n.arrayValue.values||[],e.arrayValue.values||[],Ot);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(Nl(a)!==Nl(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!Ot(a[h],u[h])))return!1;return!0}(n,e);default:return ae()}}function Fr(n,e){return(n.values||[]).find(t=>Ot(t,e))!==void 0}function Qn(n,e){if(n===e)return 0;const t=Jn(n),r=Jn(e);if(t!==r)return me(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return me(n.booleanValue,e.booleanValue);case 2:return function(o,a){const u=$e(o.integerValue||o.doubleValue),h=$e(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(n,e);case 3:return Pl(n.timestampValue,e.timestampValue);case 4:return Pl(Ks(n),Ks(e));case 5:return me(n.stringValue,e.stringValue);case 6:return function(o,a){const u=Vr(o),h=Vr(a);return u.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let f=0;f<u.length&&f<h.length;f++){const y=me(u[f],h[f]);if(y!==0)return y}return me(u.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const u=me($e(o.latitude),$e(a.latitude));return u!==0?u:me($e(o.longitude),$e(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return jl(n.arrayValue,e.arrayValue);case 10:return function(o,a){var u,h,f,y;const b=o.fields||{},x=a.fields||{},C=(u=b.value)===null||u===void 0?void 0:u.arrayValue,k=(h=x.value)===null||h===void 0?void 0:h.arrayValue,S=me(((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0,((y=k==null?void 0:k.values)===null||y===void 0?void 0:y.length)||0);return S!==0?S:jl(C,k)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===bs.mapValue&&a===bs.mapValue)return 0;if(o===bs.mapValue)return 1;if(a===bs.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),f=a.fields||{},y=Object.keys(f);h.sort(),y.sort();for(let b=0;b<h.length&&b<y.length;++b){const x=me(h[b],y[b]);if(x!==0)return x;const C=Qn(u[h[b]],f[y[b]]);if(C!==0)return C}return me(h.length,y.length)}(n.mapValue,e.mapValue);default:throw ae()}}function Pl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return me(n,e);const t=Cn(n),r=Cn(e),s=me(t.seconds,r.seconds);return s!==0?s:me(t.nanos,r.nanos)}function jl(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Qn(t[s],r[s]);if(o)return o}return me(t.length,r.length)}function Yn(n){return co(n)}function co(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Cn(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Vr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return ne.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=co(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${co(t.fields[a])}`;return s+"}"}(n.mapValue):ae()}function uo(n){return!!n&&"integerValue"in n}function Go(n){return!!n&&"arrayValue"in n}function Ps(n){return!!n&&"mapValue"in n}function Ug(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Sr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Qr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Sr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Sr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Bg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class _t{constructor(e){this.value=e}static empty(){return new _t({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Ps(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Sr(t)}setAll(e){let t=Ge.emptyPath(),r={},s=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=u.popLast()}a?r[u.lastSegment()]=Sr(a):s.push(u.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());Ps(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ot(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Ps(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Qr(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new _t(Sr(this.value))}}function Au(n){const e=[];return Qr(n.fields,(t,r)=>{const s=new Ge([t]);if(Ps(r)){const o=Au(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new wt(e)}/**
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
 */class vt{constructor(e,t,r,s,o,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(e){return new vt(e,0,Ie.min(),Ie.min(),Ie.min(),_t.empty(),0)}static newFoundDocument(e,t,r,s){return new vt(e,1,t,Ie.min(),r,s,0)}static newNoDocument(e,t){return new vt(e,2,t,Ie.min(),Ie.min(),_t.empty(),0)}static newUnknownDocument(e,t){return new vt(e,3,t,Ie.min(),Ie.min(),_t.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Ie.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=_t.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=_t.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ie.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof vt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new vt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Qs{constructor(e,t){this.position=e,this.inclusive=t}}function Ol(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=ne.comparator(ne.fromName(a.referenceValue),t.key):r=Qn(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Dl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ot(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Ys{constructor(e,t="asc"){this.field=e,this.dir=t}}function $g(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Cu{}class Ve extends Cu{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Wg(e,t,r):t==="array-contains"?new zg(e,r):t==="in"?new Kg(e,r):t==="not-in"?new Jg(e,r):t==="array-contains-any"?new Qg(e,r):new Ve(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Hg(e,r):new qg(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Qn(t,this.value)):t!==null&&Jn(this.value)===Jn(t)&&this.matchesComparison(Qn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ae()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class dn extends Cu{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new dn(e,t)}matches(e){return Su(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Su(n){return n.op==="and"}function Ru(n){return Gg(n)&&Su(n)}function Gg(n){for(const e of n.filters)if(e instanceof dn)return!1;return!0}function ho(n){if(n instanceof Ve)return n.field.canonicalString()+n.op.toString()+Yn(n.value);if(Ru(n))return n.filters.map(e=>ho(e)).join(",");{const e=n.filters.map(t=>ho(t)).join(",");return`${n.op}(${e})`}}function Nu(n,e){return n instanceof Ve?function(r,s){return s instanceof Ve&&r.op===s.op&&r.field.isEqual(s.field)&&Ot(r.value,s.value)}(n,e):n instanceof dn?function(r,s){return s instanceof dn&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,u)=>o&&Nu(a,s.filters[u]),!0):!1}(n,e):void ae()}function ku(n){return n instanceof Ve?function(t){return`${t.field.canonicalString()} ${t.op} ${Yn(t.value)}`}(n):n instanceof dn?function(t){return t.op.toString()+" {"+t.getFilters().map(ku).join(" ,")+"}"}(n):"Filter"}class Wg extends Ve{constructor(e,t,r){super(e,t,r),this.key=ne.fromName(r.referenceValue)}matches(e){const t=ne.comparator(e.key,this.key);return this.matchesComparison(t)}}class Hg extends Ve{constructor(e,t){super(e,"in",t),this.keys=Pu("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class qg extends Ve{constructor(e,t){super(e,"not-in",t),this.keys=Pu("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Pu(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>ne.fromName(r.referenceValue))}class zg extends Ve{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Go(t)&&Fr(t.arrayValue,this.value)}}class Kg extends Ve{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Fr(this.value.arrayValue,t)}}class Jg extends Ve{constructor(e,t){super(e,"not-in",t)}matches(e){if(Fr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Fr(this.value.arrayValue,t)}}class Qg extends Ve{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Go(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Fr(this.value.arrayValue,r))}}/**
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
 */class Yg{constructor(e,t=null,r=[],s=[],o=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.ue=null}}function Ll(n,e=null,t=[],r=[],s=null,o=null,a=null){return new Yg(n,e,t,r,s,o,a)}function Wo(n){const e=ve(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>ho(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Bo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Yn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Yn(r)).join(",")),e.ue=t}return e.ue}function Ho(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!$g(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Nu(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Dl(n.startAt,e.startAt)&&Dl(n.endAt,e.endAt)}/**
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
 */class di{constructor(e,t=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Xg(n,e,t,r,s,o,a,u){return new di(n,e,t,r,s,o,a,u)}function Zg(n){return new di(n)}function Ml(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ey(n){return n.collectionGroup!==null}function Rr(n){const e=ve(n);if(e.ce===null){e.ce=[];const t=new Set;for(const o of e.explicitOrderBy)e.ce.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new Qe(Ge.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(u=u.add(f.field))})}),u})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.ce.push(new Ys(o,r))}),t.has(Ge.keyField().canonicalString())||e.ce.push(new Ys(Ge.keyField(),r))}return e.ce}function En(n){const e=ve(n);return e.le||(e.le=ty(e,Rr(n))),e.le}function ty(n,e){if(n.limitType==="F")return Ll(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new Ys(s.field,o)});const t=n.endAt?new Qs(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Qs(n.startAt.position,n.startAt.inclusive):null;return Ll(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function fo(n,e,t){return new di(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ju(n,e){return Ho(En(n),En(e))&&n.limitType===e.limitType}function Ou(n){return`${Wo(En(n))}|lt:${n.limitType}`}function Er(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>ku(s)).join(", ")}]`),Bo(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Yn(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Yn(s)).join(",")),`Target(${r})`}(En(n))}; limitType=${n.limitType})`}function qo(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):ne.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Rr(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,u,h){const f=Ol(a,u,h);return a.inclusive?f<=0:f<0}(r.startAt,Rr(r),s)||r.endAt&&!function(a,u,h){const f=Ol(a,u,h);return a.inclusive?f>=0:f>0}(r.endAt,Rr(r),s))}(n,e)}function ny(n){return(e,t)=>{let r=!1;for(const s of Rr(n)){const o=ry(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function ry(n,e,t){const r=n.field.isKeyField()?ne.comparator(e.key,t.key):function(o,a,u){const h=a.data.field(o),f=u.data.field(o);return h!==null&&f!==null?Qn(h,f):ae()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return ae()}}/**
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
 */class rr{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Qr(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return xu(this.inner)}size(){return this.innerSize}}/**
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
 */const sy=new nt(ne.comparator);function Xs(){return sy}const Du=new nt(ne.comparator);function Es(...n){let e=Du;for(const t of n)e=e.insert(t.key,t);return e}function Lu(n){let e=Du;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function wn(){return Nr()}function Mu(){return Nr()}function Nr(){return new rr(n=>n.toString(),(n,e)=>n.isEqual(e))}const iy=new nt(ne.comparator),oy=new Qe(ne.comparator);function Je(...n){let e=oy;for(const t of n)e=e.add(t);return e}const ay=new Qe(me);function ly(){return ay}/**
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
 */function zo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:zs(e)?"-0":e}}function Vu(n){return{integerValue:""+n}}function cy(n,e){return Lg(e)?Vu(e):zo(n,e)}/**
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
 */class fi{constructor(){this._=void 0}}function uy(n,e,t){return n instanceof Zs?function(s,o){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&$o(o)&&(o=Tu(o)),o&&(a.fields.__previous_value__=o),{mapValue:a}}(t,e):n instanceof Ur?Uu(n,e):n instanceof Br?Bu(n,e):function(s,o){const a=Fu(s,o),u=Vl(a)+Vl(s.Pe);return uo(a)&&uo(s.Pe)?Vu(u):zo(s.serializer,u)}(n,e)}function hy(n,e,t){return n instanceof Ur?Uu(n,e):n instanceof Br?Bu(n,e):t}function Fu(n,e){return n instanceof ei?function(r){return uo(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class Zs extends fi{}class Ur extends fi{constructor(e){super(),this.elements=e}}function Uu(n,e){const t=$u(e);for(const r of n.elements)t.some(s=>Ot(s,r))||t.push(r);return{arrayValue:{values:t}}}class Br extends fi{constructor(e){super(),this.elements=e}}function Bu(n,e){let t=$u(e);for(const r of n.elements)t=t.filter(s=>!Ot(s,r));return{arrayValue:{values:t}}}class ei extends fi{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Vl(n){return $e(n.integerValue||n.doubleValue)}function $u(n){return Go(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function dy(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Ur&&s instanceof Ur||r instanceof Br&&s instanceof Br?Kn(r.elements,s.elements,Ot):r instanceof ei&&s instanceof ei?Ot(r.Pe,s.Pe):r instanceof Zs&&s instanceof Zs}(n.transform,e.transform)}class fy{constructor(e,t){this.version=e,this.transformResults=t}}class zt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new zt}static exists(e){return new zt(void 0,e)}static updateTime(e){return new zt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function js(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class pi{}function Gu(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Hu(n.key,zt.none()):new Yr(n.key,n.data,zt.none());{const t=n.data,r=_t.empty();let s=new Qe(Ge.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Pn(n.key,r,new wt(s.toArray()),zt.none())}}function py(n,e,t){n instanceof Yr?function(s,o,a){const u=s.value.clone(),h=Ul(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,e,t):n instanceof Pn?function(s,o,a){if(!js(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=Ul(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Wu(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function kr(n,e,t,r){return n instanceof Yr?function(o,a,u,h){if(!js(o.precondition,a))return u;const f=o.value.clone(),y=Bl(o.fieldTransforms,h,a);return f.setAll(y),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(n,e,t,r):n instanceof Pn?function(o,a,u,h){if(!js(o.precondition,a))return u;const f=Bl(o.fieldTransforms,h,a),y=a.data;return y.setAll(Wu(o)),y.setAll(f),a.convertToFoundDocument(a.version,y).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(b=>b.field))}(n,e,t,r):function(o,a,u){return js(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(n,e,t)}function my(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=Fu(r.transform,s||null);o!=null&&(t===null&&(t=_t.empty()),t.set(r.field,o))}return t||null}function Fl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Kn(r,s,(o,a)=>dy(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Yr extends pi{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Pn extends pi{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Wu(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Ul(n,e,t){const r=new Map;Ae(n.length===t.length);for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,u=e.data.field(o.field);r.set(o.field,hy(a,u,t[s]))}return r}function Bl(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,uy(o,a,e))}return r}class Hu extends pi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class gy extends pi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class yy{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&py(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=kr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=kr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Mu();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=t.has(s.key)?null:u;const h=Gu(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(Ie.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Je())}isEqual(e){return this.batchId===e.batchId&&Kn(this.mutations,e.mutations,(t,r)=>Fl(t,r))&&Kn(this.baseMutations,e.baseMutations,(t,r)=>Fl(t,r))}}class Ko{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Ae(e.mutations.length===r.length);let s=function(){return iy}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Ko(e,t,r,s)}}/**
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
 */var Se,ce;function _y(n){switch(n){default:return ae();case L.CANCELLED:case L.UNKNOWN:case L.DEADLINE_EXCEEDED:case L.RESOURCE_EXHAUSTED:case L.INTERNAL:case L.UNAVAILABLE:case L.UNAUTHENTICATED:return!1;case L.INVALID_ARGUMENT:case L.NOT_FOUND:case L.ALREADY_EXISTS:case L.PERMISSION_DENIED:case L.FAILED_PRECONDITION:case L.ABORTED:case L.OUT_OF_RANGE:case L.UNIMPLEMENTED:case L.DATA_LOSS:return!0}}function wy(n){if(n===void 0)return An("GRPC error has no .code"),L.UNKNOWN;switch(n){case Se.OK:return L.OK;case Se.CANCELLED:return L.CANCELLED;case Se.UNKNOWN:return L.UNKNOWN;case Se.DEADLINE_EXCEEDED:return L.DEADLINE_EXCEEDED;case Se.RESOURCE_EXHAUSTED:return L.RESOURCE_EXHAUSTED;case Se.INTERNAL:return L.INTERNAL;case Se.UNAVAILABLE:return L.UNAVAILABLE;case Se.UNAUTHENTICATED:return L.UNAUTHENTICATED;case Se.INVALID_ARGUMENT:return L.INVALID_ARGUMENT;case Se.NOT_FOUND:return L.NOT_FOUND;case Se.ALREADY_EXISTS:return L.ALREADY_EXISTS;case Se.PERMISSION_DENIED:return L.PERMISSION_DENIED;case Se.FAILED_PRECONDITION:return L.FAILED_PRECONDITION;case Se.ABORTED:return L.ABORTED;case Se.OUT_OF_RANGE:return L.OUT_OF_RANGE;case Se.UNIMPLEMENTED:return L.UNIMPLEMENTED;case Se.DATA_LOSS:return L.DATA_LOSS;default:return ae()}}(ce=Se||(Se={}))[ce.OK=0]="OK",ce[ce.CANCELLED=1]="CANCELLED",ce[ce.UNKNOWN=2]="UNKNOWN",ce[ce.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ce[ce.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ce[ce.NOT_FOUND=5]="NOT_FOUND",ce[ce.ALREADY_EXISTS=6]="ALREADY_EXISTS",ce[ce.PERMISSION_DENIED=7]="PERMISSION_DENIED",ce[ce.UNAUTHENTICATED=16]="UNAUTHENTICATED",ce[ce.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ce[ce.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ce[ce.ABORTED=10]="ABORTED",ce[ce.OUT_OF_RANGE=11]="OUT_OF_RANGE",ce[ce.UNIMPLEMENTED=12]="UNIMPLEMENTED",ce[ce.INTERNAL=13]="INTERNAL",ce[ce.UNAVAILABLE=14]="UNAVAILABLE",ce[ce.DATA_LOSS=15]="DATA_LOSS";/**
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
 */new pu([4294967295,4294967295],0);class Iy{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function po(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function by(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Ey(n,e){return po(n,e.toTimestamp())}function Hn(n){return Ae(!!n),Ie.fromTimestamp(function(t){const r=Cn(t);return new Fe(r.seconds,r.nanos)}(n))}function qu(n,e){return mo(n,e).canonicalString()}function mo(n,e){const t=function(s){return new Re(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function xy(n){const e=Re.fromString(n);return Ae(Py(e)),e}function go(n,e){return qu(n.databaseId,e.path)}function Ty(n){const e=xy(n);return e.length===4?Re.emptyPath():Cy(e)}function Ay(n){return new Re(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Cy(n){return Ae(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function $l(n,e,t){return{name:go(n,e),fields:t.value.mapValue.fields}}function Sy(n,e){let t;if(e instanceof Yr)t={update:$l(n,e.key,e.value)};else if(e instanceof Hu)t={delete:go(n,e.key)};else if(e instanceof Pn)t={update:$l(n,e.key,e.data),updateMask:ky(e.fieldMask)};else{if(!(e instanceof gy))return ae();t={verify:go(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const u=a.transform;if(u instanceof Zs)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Ur)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Br)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof ei)return{fieldPath:a.field.canonicalString(),increment:u.Pe};throw ae()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:Ey(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:ae()}(n,e.precondition)),t}function Ry(n,e){return n&&n.length>0?(Ae(e!==void 0),n.map(t=>function(s,o){let a=s.updateTime?Hn(s.updateTime):Hn(o);return a.isEqual(Ie.min())&&(a=Hn(o)),new fy(a,s.transformResults||[])}(t,e))):[]}function Ny(n){let e=Ty(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Ae(r===1);const y=t.from[0];y.allDescendants?s=y.collectionId:e=e.child(y.collectionId)}let o=[];t.where&&(o=function(b){const x=zu(b);return x instanceof dn&&Ru(x)?x.getFilters():[x]}(t.where));let a=[];t.orderBy&&(a=function(b){return b.map(x=>function(k){return new Ys(Bn(k.field),function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(x))}(t.orderBy));let u=null;t.limit&&(u=function(b){let x;return x=typeof b=="object"?b.value:b,Bo(x)?null:x}(t.limit));let h=null;t.startAt&&(h=function(b){const x=!!b.before,C=b.values||[];return new Qs(C,x)}(t.startAt));let f=null;return t.endAt&&(f=function(b){const x=!b.before,C=b.values||[];return new Qs(C,x)}(t.endAt)),Xg(e,s,a,o,u,"F",h,f)}function zu(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Bn(t.unaryFilter.field);return Ve.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Bn(t.unaryFilter.field);return Ve.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Bn(t.unaryFilter.field);return Ve.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Bn(t.unaryFilter.field);return Ve.create(a,"!=",{nullValue:"NULL_VALUE"});default:return ae()}}(n):n.fieldFilter!==void 0?function(t){return Ve.create(Bn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return ae()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return dn.create(t.compositeFilter.filters.map(r=>zu(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return ae()}}(t.compositeFilter.op))}(n):ae()}function Bn(n){return Ge.fromServerFormat(n.fieldPath)}function ky(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Py(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class jy{constructor(e){this.ct=e}}function Oy(n){const e=Ny({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?fo(e,e.limit,"L"):e}/**
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
 */class Dy{constructor(){this.un=new Ly}addToCollectionParentIndex(e,t){return this.un.add(t),O.resolve()}getCollectionParents(e,t){return O.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return O.resolve()}deleteFieldIndex(e,t){return O.resolve()}deleteAllFieldIndexes(e){return O.resolve()}createTargetIndexes(e,t){return O.resolve()}getDocumentsMatchingTarget(e,t){return O.resolve(null)}getIndexType(e,t){return O.resolve(0)}getFieldIndexes(e,t){return O.resolve([])}getNextCollectionGroupToUpdate(e){return O.resolve(null)}getMinOffset(e,t){return O.resolve(hn.min())}getMinOffsetFromCollectionGroup(e,t){return O.resolve(hn.min())}updateCollectionGroup(e,t,r){return O.resolve()}updateIndexEntries(e,t){return O.resolve()}}class Ly{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Qe(Re.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Qe(Re.comparator)).toArray()}}/**
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
 */class Xn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Xn(0)}static kn(){return new Xn(-1)}}/**
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
 */class My{constructor(){this.changes=new rr(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,vt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?O.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Fy{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&kr(r.mutation,s,wt.empty(),Fe.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,Je()).next(()=>r))}getLocalViewOfDocuments(e,t,r=Je()){const s=wn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=Es();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=wn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,Je()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,r,s){let o=Xs();const a=Nr(),u=function(){return Nr()}();return t.forEach((h,f)=>{const y=r.get(f.key);s.has(f.key)&&(y===void 0||y.mutation instanceof Pn)?o=o.insert(f.key,f):y!==void 0?(a.set(f.key,y.mutation.getFieldMask()),kr(y.mutation,f,y.mutation.getFieldMask(),Fe.now())):a.set(f.key,wt.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((f,y)=>a.set(f,y)),t.forEach((f,y)=>{var b;return u.set(f,new Vy(y,(b=a.get(f))!==null&&b!==void 0?b:null))}),u))}recalculateAndSaveOverlays(e,t){const r=Nr();let s=new nt((a,u)=>a-u),o=Je();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(h=>{const f=t.get(h);if(f===null)return;let y=r.get(h)||wt.empty();y=u.applyToLocalView(f,y),r.set(h,y);const b=(s.get(u.batchId)||Je()).add(h);s=s.insert(u.batchId,b)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),f=h.key,y=h.value,b=Mu();y.forEach(x=>{if(!o.has(x)){const C=Gu(t.get(x),r.get(x));C!==null&&b.set(x,C),o=o.add(x)}}),a.push(this.documentOverlayCache.saveOverlays(e,f,b))}return O.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return ne.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ey(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):O.resolve(wn());let u=-1,h=o;return a.next(f=>O.forEach(f,(y,b)=>(u<b.largestBatchId&&(u=b.largestBatchId),o.get(y)?O.resolve():this.remoteDocumentCache.getEntry(e,y).next(x=>{h=h.insert(y,x)}))).next(()=>this.populateOverlays(e,f,o)).next(()=>this.computeViews(e,h,f,Je())).next(y=>({batchId:u,changes:Lu(y)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ne(t)).next(r=>{let s=Es();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=Es();return this.indexManager.getCollectionParents(e,o).next(u=>O.forEach(u,h=>{const f=function(b,x){return new di(x,null,b.explicitOrderBy.slice(),b.filters.slice(),b.limit,b.limitType,b.startAt,b.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,f,r,s).next(y=>{y.forEach((b,x)=>{a=a.insert(b,x)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,f)=>{const y=f.getKey();a.get(y)===null&&(a=a.insert(y,vt.newInvalidDocument(y)))});let u=Es();return a.forEach((h,f)=>{const y=o.get(h);y!==void 0&&kr(y.mutation,f,wt.empty(),Fe.now()),qo(t,f)&&(u=u.insert(h,f))}),u})}}/**
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
 */class Uy{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return O.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Hn(s.createTime)}}(t)),O.resolve()}getNamedQuery(e,t){return O.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:Oy(s.bundledQuery),readTime:Hn(s.readTime)}}(t)),O.resolve()}}/**
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
 */class By{constructor(){this.overlays=new nt(ne.comparator),this.Ir=new Map}getOverlay(e,t){return O.resolve(this.overlays.get(t))}getOverlays(e,t){const r=wn();return O.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.ht(e,t,o)}),O.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Ir.delete(r)),O.resolve()}getOverlaysForCollection(e,t,r){const s=wn(),o=t.length+1,a=new ne(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,f=h.getKey();if(!t.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return O.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new nt((f,y)=>f-y);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===t&&f.largestBatchId>r){let y=o.get(f.largestBatchId);y===null&&(y=wn(),o=o.insert(f.largestBatchId,y)),y.set(f.getKey(),f)}}const u=wn(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,y)=>u.set(f,y)),!(u.size()>=s)););return O.resolve(u)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new vy(t,r));let o=this.Ir.get(t);o===void 0&&(o=Je(),this.Ir.set(t,o)),this.Ir.set(t,o.add(r.key))}}/**
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
 */class $y{constructor(){this.sessionToken=jt.EMPTY_BYTE_STRING}getSessionToken(e){return O.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,O.resolve()}}/**
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
 */class Jo{constructor(){this.Tr=new Qe(Me.Er),this.dr=new Qe(Me.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Me(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Me(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new ne(new Re([])),r=new Me(t,e),s=new Me(t,e+1),o=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),o.push(a.key)}),o}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new ne(new Re([])),r=new Me(t,e),s=new Me(t,e+1);let o=Je();return this.dr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new Me(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Me{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return ne.comparator(e.key,t.key)||me(e.wr,t.wr)}static Ar(e,t){return me(e.wr,t.wr)||ne.comparator(e.key,t.key)}}/**
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
 */class Gy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Qe(Me.Er)}checkEmpty(e){return O.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new yy(o,t,r,s);this.mutationQueue.push(a);for(const u of s)this.br=this.br.add(new Me(u.key,o)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return O.resolve(a)}lookupMutationBatch(e,t){return O.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),o=s<0?0:s;return O.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return O.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return O.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Me(t,0),s=new Me(t,Number.POSITIVE_INFINITY),o=[];return this.br.forEachInRange([r,s],a=>{const u=this.Dr(a.wr);o.push(u)}),O.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Qe(me);return t.forEach(s=>{const o=new Me(s,0),a=new Me(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([o,a],u=>{r=r.add(u.wr)})}),O.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;ne.isDocumentKey(o)||(o=o.child(""));const a=new Me(new ne(o),0);let u=new Qe(me);return this.br.forEachWhile(h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(u=u.add(h.wr)),!0)},a),O.resolve(this.Cr(u))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){Ae(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return O.forEach(t.mutations,s=>{const o=new Me(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Me(t,0),s=this.br.firstAfterOrEqual(r);return O.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,O.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Wy{constructor(e){this.Mr=e,this.docs=function(){return new nt(ne.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return O.resolve(r?r.document.mutableCopy():vt.newInvalidDocument(t))}getEntries(e,t){let r=Xs();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():vt.newInvalidDocument(s))}),O.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Xs();const a=t.path,u=new ne(a.child("")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:f,value:{document:y}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||Pg(kg(y),r)<=0||(s.has(y.key)||qo(t,y))&&(o=o.insert(y.key,y.mutableCopy()))}return O.resolve(o)}getAllFromCollectionGroup(e,t,r,s){ae()}Or(e,t){return O.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Hy(this)}getSize(e){return O.resolve(this.size)}}class Hy extends My{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),O.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class qy{constructor(e){this.persistence=e,this.Nr=new rr(t=>Wo(t),Ho),this.lastRemoteSnapshotVersion=Ie.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Jo,this.targetCount=0,this.kr=Xn.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),O.resolve()}getLastRemoteSnapshotVersion(e){return O.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return O.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),O.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),O.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Xn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,O.resolve()}updateTargetData(e,t){return this.Kn(t),O.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,O.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.Nr.forEach((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.Nr.delete(a),o.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),O.waitFor(o).next(()=>s)}getTargetCount(e){return O.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return O.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),O.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),O.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),O.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return O.resolve(r)}containsKey(e,t){return O.resolve(this.Br.containsKey(t))}}/**
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
 */class zy{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Eu(0),this.Kr=!1,this.Kr=!0,this.$r=new $y,this.referenceDelegate=e(this),this.Ur=new qy(this),this.indexManager=new Dy,this.remoteDocumentCache=function(s){return new Wy(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new jy(t),this.Gr=new Uy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new By,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Gy(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){H("MemoryPersistence","Starting transaction:",e);const s=new Ky(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(o=>this.referenceDelegate.jr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Hr(e,t){return O.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class Ky extends Og{constructor(e){super(),this.currentSequenceNumber=e}}class Qo{constructor(e){this.persistence=e,this.Jr=new Jo,this.Yr=null}static Zr(e){return new Qo(e)}get Xr(){if(this.Yr)return this.Yr;throw ae()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),O.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),O.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),O.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.Xr.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return O.forEach(this.Xr,r=>{const s=ne.fromPath(r);return this.ei(e,s).next(o=>{o||t.removeEntry(s,Ie.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return O.or([()=>O.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class Yo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=Je(),s=Je();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Yo(e,t.fromCache,r,s)}}/**
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
 */class Jy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Qy{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Zd()?8:Dg(Ye())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.Yi(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.Zi(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new Jy;return this.Xi(e,t,a).next(u=>{if(o.result=u,this.zi)return this.es(e,t,a,u.size)})}).next(()=>o.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(br()<=oe.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",Er(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),O.resolve()):(br()<=oe.DEBUG&&H("QueryEngine","Query:",Er(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(br()<=oe.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",Er(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,En(t))):O.resolve())}Yi(e,t){if(Ml(t))return O.resolve(null);let r=En(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=fo(t,null,"F"),r=En(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=Je(...o);return this.Ji.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,r).next(h=>{const f=this.ts(t,u);return this.ns(t,f,a,h.readTime)?this.Yi(e,fo(t,null,"F")):this.rs(e,f,t,h)}))})))}Zi(e,t,r,s){return Ml(t)||s.isEqual(Ie.min())?O.resolve(null):this.Ji.getDocuments(e,r).next(o=>{const a=this.ts(t,o);return this.ns(t,a,r,s)?O.resolve(null):(br()<=oe.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Er(t)),this.rs(e,a,t,Ng(s,-1)).next(u=>u))})}ts(e,t){let r=new Qe(ny(e));return t.forEach((s,o)=>{qo(e,o)&&(r=r.add(o))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Xi(e,t,r){return br()<=oe.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",Er(t)),this.Ji.getDocumentsMatchingQuery(e,t,hn.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
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
 */class Yy{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new nt(me),this._s=new rr(o=>Wo(o),Ho),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Fy(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Xy(n,e,t,r){return new Yy(n,e,t,r)}async function Ku(n,e){const t=ve(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],u=[];let h=Je();for(const f of s){a.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}for(const f of o){u.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}return t.localDocuments.getDocuments(r,h).next(f=>({hs:f,removedBatchIds:a,addedBatchIds:u}))})})}function Zy(n,e){const t=ve(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.cs.newChangeBuffer({trackRemovals:!0});return function(u,h,f,y){const b=f.batch,x=b.keys();let C=O.resolve();return x.forEach(k=>{C=C.next(()=>y.getEntry(h,k)).next(S=>{const N=f.docVersions.get(k);Ae(N!==null),S.version.compareTo(N)<0&&(b.applyToRemoteDocument(S,f),S.isValidDocument()&&(S.setReadTime(f.commitVersion),y.addEntry(S)))})}),C.next(()=>u.mutationQueue.removeMutationBatch(h,b))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(u){let h=Je();for(let f=0;f<u.mutationResults.length;++f)u.mutationResults[f].transformResults.length>0&&(h=h.add(u.batch.mutations[f].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function ev(n){const e=ve(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function tv(n,e){const t=ve(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}class Gl{constructor(){this.activeTargetIds=ly()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nv{constructor(){this.so=new Gl,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Gl,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Wl{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let xs=null;function Gi(){return xs===null?xs=function(){return 268435456+Math.round(2147483648*Math.random())}():xs++,"0x"+xs.toString(16)}/**
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
 */const ze="WebChannelConnection";class ov extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${o}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${o}`}get Fo(){return!1}Mo(t,r,s,o,a){const u=Gi(),h=this.xo(t,r.toUriEncodedString());H("RestConnection",`Sending RPC '${t}' ${u}:`,h,s);const f={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(f,o,a),this.No(t,h,f,s).then(y=>(H("RestConnection",`Received RPC '${t}' ${u}: `,y),y),y=>{throw qs("RestConnection",`RPC '${t}' ${u} failed with error: `,y,"url: ",h,"request:",s),y})}Lo(t,r,s,o,a,u){return this.Mo(t,r,s,o,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+nr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((o,a)=>t[a]=o),s&&s.headers.forEach((o,a)=>t[a]=o)}xo(t,r){const s=sv[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const o=Gi();return new Promise((a,u)=>{const h=new mu;h.setWithCredentials(!0),h.listenOnce(gu.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case ks.NO_ERROR:const y=h.getResponseJson();H(ze,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(y)),a(y);break;case ks.TIMEOUT:H(ze,`RPC '${e}' ${o} timed out`),u(new Q(L.DEADLINE_EXCEEDED,"Request time out"));break;case ks.HTTP_ERROR:const b=h.getStatus();if(H(ze,`RPC '${e}' ${o} failed with status:`,b,"response text:",h.getResponseText()),b>0){let x=h.getResponseJson();Array.isArray(x)&&(x=x[0]);const C=x==null?void 0:x.error;if(C&&C.status&&C.message){const k=function(N){const G=N.toLowerCase().replace(/_/g,"-");return Object.values(L).indexOf(G)>=0?G:L.UNKNOWN}(C.status);u(new Q(k,C.message))}else u(new Q(L.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new Q(L.UNAVAILABLE,"Connection failed."));break;default:ae()}}finally{H(ze,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(s);H(ze,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",f,r,15)})}Bo(e,t,r){const s=Gi(),o=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=_u(),u=vu(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.Oo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const y=o.join("");H(ze,`Creating RPC '${e}' stream ${s}: ${y}`,h);const b=a.createWebChannel(y,h);let x=!1,C=!1;const k=new iv({Io:N=>{C?H(ze,`Not sending because RPC '${e}' stream ${s} is closed:`,N):(x||(H(ze,`Opening RPC '${e}' stream ${s} transport.`),b.open(),x=!0),H(ze,`RPC '${e}' stream ${s} sending:`,N),b.send(N))},To:()=>b.close()}),S=(N,G,W)=>{N.listen(G,U=>{try{W(U)}catch(B){setTimeout(()=>{throw B},0)}})};return S(b,Tr.EventType.OPEN,()=>{C||(H(ze,`RPC '${e}' stream ${s} transport opened.`),k.yo())}),S(b,Tr.EventType.CLOSE,()=>{C||(C=!0,H(ze,`RPC '${e}' stream ${s} transport closed`),k.So())}),S(b,Tr.EventType.ERROR,N=>{C||(C=!0,qs(ze,`RPC '${e}' stream ${s} transport errored:`,N),k.So(new Q(L.UNAVAILABLE,"The operation could not be completed")))}),S(b,Tr.EventType.MESSAGE,N=>{var G;if(!C){const W=N.data[0];Ae(!!W);const U=W,B=U.error||((G=U[0])===null||G===void 0?void 0:G.error);if(B){H(ze,`RPC '${e}' stream ${s} received error:`,B);const fe=B.status;let M=function(g){const _=Se[g];if(_!==void 0)return wy(_)}(fe),I=B.message;M===void 0&&(M=L.INTERNAL,I="Unknown error status: "+fe+" with message "+B.message),C=!0,k.So(new Q(M,I)),b.close()}else H(ze,`RPC '${e}' stream ${s} received:`,W),k.bo(W)}}),S(u,yu.STAT_EVENT,N=>{N.stat===lo.PROXY?H(ze,`RPC '${e}' stream ${s} detected buffering proxy`):N.stat===lo.NOPROXY&&H(ze,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{k.wo()},0),k}}function Wi(){return typeof document<"u"?document:null}/**
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
 */function mi(n){return new Iy(n,!0)}/**
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
 */class Ju{constructor(e,t,r=1e3,s=1.5,o=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=o,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&H("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class av{constructor(e,t,r,s,o,a,u,h){this.ui=e,this.Ho=r,this.Jo=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Ju(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===L.RESOURCE_EXHAUSTED?(An(t.toString()),An("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===L.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new Q(L.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class lv extends av{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Ae(!!e.streamToken),this.lastStreamToken=e.streamToken,Ae(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Ae(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Ry(e.writeResults,e.commitTime),r=Hn(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ay(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sy(this.serializer,r))};this.a_(t)}}/**
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
 */class cv extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new Q(L.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Mo(e,mo(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new Q(L.UNKNOWN,o.toString())})}Lo(e,t,r,s,o){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Lo(e,mo(t,r),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new Q(L.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class uv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(An(t),this.D_=!1):H("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class hv{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=o,this.k_._o(a=>{r.enqueueAndForget(async()=>{Zr(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(h){const f=ve(h);f.L_.add(4),await Xr(f),f.q_.set("Unknown"),f.L_.delete(4),await gi(f)}(this))})}),this.q_=new uv(r,s)}}async function gi(n){if(Zr(n))for(const e of n.B_)await e(!0)}async function Xr(n){for(const e of n.B_)await e(!1)}function Zr(n){return ve(n).L_.size===0}async function Qu(n,e,t){if(!hi(e))throw e;n.L_.add(1),await Xr(n),n.q_.set("Offline"),t||(t=()=>ev(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await gi(n)})}function Yu(n,e){return e().catch(t=>Qu(n,t,e))}async function yi(n){const e=ve(n),t=fn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;dv(e);)try{const s=await tv(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,fv(e,s)}catch(s){await Qu(e,s)}Xu(e)&&Zu(e)}function dv(n){return Zr(n)&&n.O_.length<10}function fv(n,e){n.O_.push(e);const t=fn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function Xu(n){return Zr(n)&&!fn(n).n_()&&n.O_.length>0}function Zu(n){fn(n).start()}async function pv(n){fn(n).p_()}async function mv(n){const e=fn(n);for(const t of n.O_)e.m_(t.mutations)}async function gv(n,e,t){const r=n.O_.shift(),s=Ko.from(r,e,t);await Yu(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await yi(n)}async function yv(n,e){e&&fn(n).V_&&await async function(r,s){if(function(a){return _y(a)&&a!==L.ABORTED}(s.code)){const o=r.O_.shift();fn(r).s_(),await Yu(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await yi(r)}}(n,e),Xu(n)&&Zu(n)}async function Hl(n,e){const t=ve(n);t.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const r=Zr(t);t.L_.add(3),await Xr(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await gi(t)}async function vv(n,e){const t=ve(n);e?(t.L_.delete(2),await gi(t)):e||(t.L_.add(2),await Xr(t),t.q_.set("Unknown"))}function fn(n){return n.U_||(n.U_=function(t,r,s){const o=ve(t);return o.w_(),new lv(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:pv.bind(null,n),mo:yv.bind(null,n),f_:mv.bind(null,n),g_:gv.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await yi(n)):(await n.U_.stop(),n.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Xo{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new bn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,u=new Xo(e,t,a,s,o);return u.start(r),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Q(L.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function eh(n,e){if(An("AsyncQueue",`${e}: ${n}`),hi(n))return new Q(L.UNAVAILABLE,`${e}: ${n}`);throw n}class _v{constructor(){this.queries=ql(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=ve(t),o=s.queries;s.queries=ql(),o.forEach((a,u)=>{for(const h of u.j_)h.onError(r)})})(this,new Q(L.ABORTED,"Firestore shutting down"))}}function ql(){return new rr(n=>Ou(n),ju)}function wv(n){n.Y_.forEach(e=>{e.next()})}var zl,Kl;(Kl=zl||(zl={})).ea="default",Kl.Cache="cache";class Iv{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new rr(u=>Ou(u),ju),this.Ma=new Map,this.xa=new Set,this.Oa=new nt(ne.comparator),this.Na=new Map,this.La=new Jo,this.Ba={},this.ka=new Map,this.qa=Xn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function bv(n,e,t){const r=Av(n);try{const s=await function(a,u){const h=ve(a),f=Fe.now(),y=u.reduce((C,k)=>C.add(k.key),Je());let b,x;return h.persistence.runTransaction("Locally write mutations","readwrite",C=>{let k=Xs(),S=Je();return h.cs.getEntries(C,y).next(N=>{k=N,k.forEach((G,W)=>{W.isValidDocument()||(S=S.add(G))})}).next(()=>h.localDocuments.getOverlayedDocuments(C,k)).next(N=>{b=N;const G=[];for(const W of u){const U=my(W,b.get(W.key).overlayedDocument);U!=null&&G.push(new Pn(W.key,U,Au(U.value.mapValue),zt.exists(!0)))}return h.mutationQueue.addMutationBatch(C,f,G,u)}).next(N=>{x=N;const G=N.applyToLocalDocumentSet(b,S);return h.documentOverlayCache.saveOverlays(C,N.batchId,G)})}).then(()=>({batchId:x.batchId,changes:Lu(b)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let f=a.Ba[a.currentUser.toKey()];f||(f=new nt(me)),f=f.insert(u,h),a.Ba[a.currentUser.toKey()]=f}(r,s.batchId,t),await vi(r,s.changes),await yi(r.remoteStore)}catch(s){const o=eh(s,"Failed to persist write");t.reject(o)}}function Jl(n,e,t){const r=ve(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((o,a)=>{const u=a.view.Z_(e);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=ve(a);h.onlineState=u;let f=!1;h.queries.forEach((y,b)=>{for(const x of b.j_)x.Z_(u)&&(f=!0)}),f&&wv(h)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Ev(n,e){const t=ve(n),r=e.batch.batchId;try{const s=await Zy(t.localStore,e);nh(t,r,null),th(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await vi(t,s)}catch(s){await bu(s)}}async function xv(n,e,t){const r=ve(n);try{const s=await function(a,u){const h=ve(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",f=>{let y;return h.mutationQueue.lookupMutationBatch(f,u).next(b=>(Ae(b!==null),y=b.keys(),h.mutationQueue.removeMutationBatch(f,b))).next(()=>h.mutationQueue.performConsistencyCheck(f)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(f,y,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,y)).next(()=>h.localDocuments.getDocuments(f,y))})}(r.localStore,e);nh(r,e,t),th(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await vi(r,s)}catch(s){await bu(s)}}function th(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function nh(n,e,t){const r=ve(n);let s=r.Ba[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}async function vi(n,e,t){const r=ve(n),s=[],o=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((u,h)=>{a.push(r.Ka(h,e,t).then(f=>{var y;if((f||t)&&r.isPrimaryClient){const b=f?!f.fromCache:(y=void 0)===null||y===void 0?void 0:y.current;r.sharedClientState.updateQueryState(h.targetId,b?"current":"not-current")}if(f){s.push(f);const b=Yo.Wi(h.targetId,f);o.push(b)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(h,f){const y=ve(h);try{await y.persistence.runTransaction("notifyLocalViewChanges","readwrite",b=>O.forEach(f,x=>O.forEach(x.$i,C=>y.persistence.referenceDelegate.addReference(b,x.targetId,C)).next(()=>O.forEach(x.Ui,C=>y.persistence.referenceDelegate.removeReference(b,x.targetId,C)))))}catch(b){if(!hi(b))throw b;H("LocalStore","Failed to update sequence numbers: "+b)}for(const b of f){const x=b.targetId;if(!b.fromCache){const C=y.os.get(x),k=C.snapshotVersion,S=C.withLastLimboFreeSnapshotVersion(k);y.os=y.os.insert(x,S)}}}(r.localStore,o))}async function Tv(n,e){const t=ve(n);if(!t.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const r=await Ku(t.localStore,e);t.currentUser=e,function(o,a){o.ka.forEach(u=>{u.forEach(h=>{h.reject(new Q(L.CANCELLED,a))})}),o.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await vi(t,r.hs)}}function Av(n){const e=ve(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ev.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xv.bind(null,e),e}class ti{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=mi(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Xy(this.persistence,new Qy,e.initialUser,this.serializer)}Ga(e){return new zy(Qo.Zr,this.serializer)}Wa(e){return new nv}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ti.provider={build:()=>new ti};class yo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Jl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Tv.bind(null,this.syncEngine),await vv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new _v}()}createDatastore(e){const t=mi(e.databaseInfo.databaseId),r=function(o){return new ov(o)}(e.databaseInfo);return function(o,a,u,h){return new cv(o,a,u,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,u){return new hv(r,s,o,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>Jl(this.syncEngine,t,0),function(){return Wl.D()?new Wl:new rv}())}createSyncEngine(e,t){return function(s,o,a,u,h,f,y){const b=new Iv(s,o,a,u,h,f);return y&&(b.Qa=!0),b}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=ve(s);H("RemoteStore","RemoteStore shutting down."),o.L_.add(5),await Xr(o),o.k_.shutdown(),o.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}yo.provider={build:()=>new yo};/**
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
 */class Cv{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Ke.UNAUTHENTICATED,this.clientId=Iu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{H("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(H("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new bn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=eh(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Hi(n,e){n.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Ku(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Ql(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Sv(n);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Hl(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Hl(e.remoteStore,s)),n._onlineComponents=e}async function Sv(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Hi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===L.FAILED_PRECONDITION||s.code===L.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;qs("Error using user provided cache. Falling back to memory cache: "+t),await Hi(n,new ti)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Hi(n,new ti);return n._offlineComponents}async function Rv(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await Ql(n,n._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await Ql(n,new yo))),n._onlineComponents}function Nv(n){return Rv(n).then(e=>e.syncEngine)}/**
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
 */const Yl=new Map;/**
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
 */function kv(n,e,t){if(!t)throw new Q(L.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Pv(n,e,t,r){if(e===!0&&r===!0)throw new Q(L.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Xl(n){if(!ne.isDocumentKey(n))throw new Q(L.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Zo(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":ae()}function vo(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new Q(L.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Zo(n);throw new Q(L.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class Zl{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new Q(L.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new Q(L.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Pv("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=rh((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new Q(L.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new Q(L.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new Q(L.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ea{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Zl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Q(L.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Q(L.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Zl(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Ig;switch(r.type){case"firstParty":return new Tg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new Q(L.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Yl.get(t);r&&(H("ComponentProvider","Removing Datastore"),Yl.delete(t),r.terminate())}(this),Promise.resolve()}}function jv(n,e,t,r={}){var s;const o=(n=vo(n,ea))._getSettings(),a=`${e}:${t}`;if(o.host!=="firestore.googleapis.com"&&o.host!==a&&qs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let u,h;if(typeof r.mockUserToken=="string")u=r.mockUserToken,h=Ke.MOCK_USER;else{u=zd(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new Q(L.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new Ke(f)}n._authCredentials=new bg(new wu(u,h))}}/**
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
 */class ta{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ta(this.firestore,e,this._query)}}class Kt{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new $r(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Kt(this.firestore,e,this._key)}}class $r extends ta{constructor(e,t,r){super(e,t,Zg(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Kt(this.firestore,null,new ne(e))}withConverter(e){return new $r(this.firestore,e,this._path)}}function Ov(n,e,...t){if(n=tt(n),arguments.length===1&&(e=Iu.newId()),kv("doc","path",e),n instanceof ea){const r=Re.fromString(e,...t);return Xl(r),new Kt(n,null,new ne(r))}{if(!(n instanceof Kt||n instanceof $r))throw new Q(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Re.fromString(e,...t));return Xl(r),new Kt(n.firestore,n instanceof $r?n.converter:null,new ne(r))}}/**
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
 */class ec{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Ju(this,"async_queue_retry"),this.Vu=()=>{const r=Wi();r&&H("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Wi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Wi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new bn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!hi(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let u=a.message||"";return a.stack&&(u=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),u}(r);throw An("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Xo.createAndSchedule(this,e,t,r,o=>this.yu(o));return this.Tu.push(s),s}fu(){this.Eu&&ae()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class sh extends ea{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new ec,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ec(e),this._firestoreClient=void 0,await e}}}function Dv(n,e){const t=typeof n=="object"?n:So(),r=typeof n=="string"?n:"(default)",s=kn(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Hd("firestore");o&&jv(s,...o)}return s}function Lv(n){if(n._terminated)throw new Q(L.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Mv(n),n._firestoreClient}function Mv(n){var e,t,r;const s=n._freezeSettings(),o=function(u,h,f,y){return new Fg(u,h,f,y.host,y.ssl,y.experimentalForceLongPolling,y.experimentalAutoDetectLongPolling,rh(y.experimentalLongPollingOptions),y.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Cv(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}}(n._componentsProvider))}/**
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
 */class Gr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Gr(jt.fromBase64String(e))}catch(t){throw new Q(L.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Gr(jt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class ih{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new Q(L.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ge(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class ah{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Q(L.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Q(L.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return me(this._lat,e._lat)||me(this._long,e._long)}}/**
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
 */const Vv=/^__.*__$/;class Fv{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Pn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Yr(e,this.data,t,this.fieldTransforms)}}function ch(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ae()}}class na{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.vu(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new na(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ni(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(ch(this.Cu)&&Vv.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Uv{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||mi(e)}Qu(e,t,r,s=!1){return new na({Cu:e,methodName:t,qu:r,path:Ge.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bv(n){const e=n._freezeSettings(),t=mi(n._databaseId);return new Uv(n._databaseId,!!e.ignoreUndefinedProperties,t)}function $v(n,e,t,r,s,o={}){const a=n.Qu(o.merge||o.mergeFields?2:0,e,t,s);fh("Data must be an object, but it was:",a,r);const u=hh(r,a);let h,f;if(o.merge)h=new wt(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const y=[];for(const b of o.mergeFields){const x=Gv(e,b,t);if(!a.contains(x))throw new Q(L.INVALID_ARGUMENT,`Field '${x}' is specified in your field mask but missing from your input data.`);qv(y,x)||y.push(x)}h=new wt(y),f=a.fieldTransforms.filter(b=>h.covers(b.field))}else h=null,f=a.fieldTransforms;return new Fv(new _t(u),h,f)}function uh(n,e){if(dh(n=tt(n)))return fh("Unsupported field value:",e,n),hh(n,e);if(n instanceof oh)return function(r,s){if(!ch(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const u of r){let h=uh(u,s.Lu(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=tt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return cy(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=Fe.fromDate(r);return{timestampValue:po(s.serializer,o)}}if(r instanceof Fe){const o=new Fe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:po(s.serializer,o)}}if(r instanceof ah)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Gr)return{bytesValue:by(s.serializer,r._byteString)};if(r instanceof Kt){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:qu(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof lh)return function(a,u){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(h=>{if(typeof h!="number")throw u.Bu("VectorValues must only contain numeric values.");return zo(u.serializer,h)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Zo(r)}`)}(n,e)}function hh(n,e){const t={};return xu(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Qr(n,(r,s)=>{const o=uh(s,e.Mu(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function dh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Fe||n instanceof ah||n instanceof Gr||n instanceof Kt||n instanceof oh||n instanceof lh)}function fh(n,e,t){if(!dh(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Zo(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Gv(n,e,t){if((e=tt(e))instanceof ih)return e._internalPath;if(typeof e=="string")return Hv(n,e);throw ni("Field path arguments must be of type string or ",n,!1,void 0,t)}const Wv=new RegExp("[~\\*/\\[\\]]");function Hv(n,e,t){if(e.search(Wv)>=0)throw ni(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ih(...e.split("."))._internalPath}catch{throw ni(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ni(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new Q(L.INVALID_ARGUMENT,u+n+h)}function qv(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */function zv(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}function Kv(n,e,t){n=vo(n,Kt);const r=vo(n.firestore,sh),s=zv(n.converter,e,t);return Jv(r,[$v(Bv(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,zt.none())])}function Jv(n,e){return function(r,s){const o=new bn;return r.asyncQueue.enqueueAndForget(async()=>bv(await Nv(r),s,o)),o.promise}(Lv(n),e)}(function(e,t=!0){(function(s){nr=s})(Zn),kt(new Et("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new sh(new Eg(r.getProvider("auth-internal")),new Cg(r.getProvider("app-check-internal")),function(f,y){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new Q(L.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Js(f.options.projectId,y)}(a,s),a);return o=Object.assign({useFetchStreams:t},o),u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),dt(Rl,"4.7.3",e),dt(Rl,"4.7.3","esm2017")})();const ph="@firebase/installations",ra="0.6.9";/**
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
 */const mh=1e4,gh=`w:${ra}`,yh="FIS_v2",Qv="https://firebaseinstallations.googleapis.com/v1",Yv=60*60*1e3,Xv="installations",Zv="Installations";/**
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
 */const e_={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Sn=new Nn(Xv,Zv,e_);function vh(n){return n instanceof xt&&n.code.includes("request-failed")}/**
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
 */function _h({projectId:n}){return`${Qv}/projects/${n}/installations`}function wh(n){return{token:n.token,requestStatus:2,expiresIn:n_(n.expiresIn),creationTime:Date.now()}}async function Ih(n,e){const r=(await e.json()).error;return Sn.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function bh({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function t_(n,{refreshToken:e}){const t=bh(n);return t.append("Authorization",r_(e)),t}async function Eh(n){const e=await n();return e.status>=500&&e.status<600?n():e}function n_(n){return Number(n.replace("s","000"))}function r_(n){return`${yh} ${n}`}/**
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
 */async function s_({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=_h(n),s=bh(n),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={fid:t,authVersion:yh,appId:n.appId,sdkVersion:gh},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await Eh(()=>fetch(r,u));if(h.ok){const f=await h.json();return{fid:f.fid||t,registrationStatus:2,refreshToken:f.refreshToken,authToken:wh(f.authToken)}}else throw await Ih("Create Installation",h)}/**
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
 */const o_=/^[cdef][\w-]{21}$/,_o="";function a_(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=l_(n);return o_.test(t)?t:_o}catch{return _o}}function l_(n){return i_(n).substr(0,22)}/**
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
 */function _i(n){return`${n.appName}!${n.appId}`}/**
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
 */const Th=new Map;function Ah(n,e){const t=_i(n);Ch(t,e),c_(t,e)}function Ch(n,e){const t=Th.get(n);if(t)for(const r of t)r(e)}function c_(n,e){const t=u_();t&&t.postMessage({key:n,fid:e}),h_()}let In=null;function u_(){return!In&&"BroadcastChannel"in self&&(In=new BroadcastChannel("[Firebase] FID Change"),In.onmessage=n=>{Ch(n.data.key,n.data.fid)}),In}function h_(){Th.size===0&&In&&(In.close(),In=null)}/**
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
 */const d_="firebase-installations-database",f_=1,Rn="firebase-installations-store";let qi=null;function sa(){return qi||(qi=Nc(d_,f_,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Rn)}}})),qi}async function ri(n,e){const t=_i(n),s=(await sa()).transaction(Rn,"readwrite"),o=s.objectStore(Rn),a=await o.get(t);return await o.put(e,t),await s.done,(!a||a.fid!==e.fid)&&Ah(n,e.fid),e}async function Sh(n){const e=_i(n),r=(await sa()).transaction(Rn,"readwrite");await r.objectStore(Rn).delete(e),await r.done}async function wi(n,e){const t=_i(n),s=(await sa()).transaction(Rn,"readwrite"),o=s.objectStore(Rn),a=await o.get(t),u=e(a);return u===void 0?await o.delete(t):await o.put(u,t),await s.done,u&&(!a||a.fid!==u.fid)&&Ah(n,u.fid),u}/**
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
 */async function ia(n){let e;const t=await wi(n.appConfig,r=>{const s=p_(r),o=m_(n,s);return e=o.registrationPromise,o.installationEntry});return t.fid===_o?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function p_(n){const e=n||{fid:a_(),registrationStatus:0};return Rh(e)}function m_(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Sn.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=g_(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:y_(n)}:{installationEntry:e}}async function g_(n,e){try{const t=await s_(n,e);return ri(n.appConfig,t)}catch(t){throw vh(t)&&t.customData.serverCode===409?await Sh(n.appConfig):await ri(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function y_(n){let e=await tc(n.appConfig);for(;e.registrationStatus===1;)await xh(100),e=await tc(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await ia(n);return r||t}return e}function tc(n){return wi(n,e=>{if(!e)throw Sn.create("installation-not-found");return Rh(e)})}function Rh(n){return v_(n)?{fid:n.fid,registrationStatus:0}:n}function v_(n){return n.registrationStatus===1&&n.registrationTime+mh<Date.now()}/**
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
 */async function __({appConfig:n,heartbeatServiceProvider:e},t){const r=w_(n,t),s=t_(n,t),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={installation:{sdkVersion:gh,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await Eh(()=>fetch(r,u));if(h.ok){const f=await h.json();return wh(f)}else throw await Ih("Generate Auth Token",h)}function w_(n,{fid:e}){return`${_h(n)}/${e}/authTokens:generate`}/**
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
 */async function oa(n,e=!1){let t;const r=await wi(n.appConfig,o=>{if(!Nh(o))throw Sn.create("not-registered");const a=o.authToken;if(!e&&E_(a))return o;if(a.requestStatus===1)return t=I_(n,e),o;{if(!navigator.onLine)throw Sn.create("app-offline");const u=T_(o);return t=b_(n,u),u}});return t?await t:r.authToken}async function I_(n,e){let t=await nc(n.appConfig);for(;t.authToken.requestStatus===1;)await xh(100),t=await nc(n.appConfig);const r=t.authToken;return r.requestStatus===0?oa(n,e):r}function nc(n){return wi(n,e=>{if(!Nh(e))throw Sn.create("not-registered");const t=e.authToken;return A_(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function b_(n,e){try{const t=await __(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await ri(n.appConfig,r),t}catch(t){if(vh(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Sh(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await ri(n.appConfig,r)}throw t}}function Nh(n){return n!==void 0&&n.registrationStatus===2}function E_(n){return n.requestStatus===2&&!x_(n)}function x_(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Yv}function T_(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function A_(n){return n.requestStatus===1&&n.requestTime+mh<Date.now()}/**
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
 */async function C_(n){const e=n,{installationEntry:t,registrationPromise:r}=await ia(e);return r?r.catch(console.error):oa(e).catch(console.error),t.fid}/**
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
 */async function S_(n,e=!1){const t=n;return await R_(t),(await oa(t,e)).token}async function R_(n){const{registrationPromise:e}=await ia(n);e&&await e}/**
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
 */function N_(n){if(!n||!n.options)throw zi("App Configuration");if(!n.name)throw zi("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw zi(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function zi(n){return Sn.create("missing-app-config-values",{valueName:n})}/**
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
 */const kh="installations",k_="installations-internal",P_=n=>{const e=n.getProvider("app").getImmediate(),t=N_(e),r=kn(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},j_=n=>{const e=n.getProvider("app").getImmediate(),t=kn(e,kh).getImmediate();return{getId:()=>C_(t),getToken:s=>S_(t,s)}};function O_(){kt(new Et(kh,P_,"PUBLIC")),kt(new Et(k_,j_,"PRIVATE"))}O_();dt(ph,ra);dt(ph,ra,"esm2017");/**
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
 */const si="analytics",D_="firebase_id",L_="origin",M_=60*1e3,V_="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",aa="https://www.googletagmanager.com/gtag/js";/**
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
 */const et=new ai("@firebase/analytics");/**
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
 */const F_={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},lt=new Nn("analytics","Analytics",F_);/**
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
 */function U_(n){if(!n.startsWith(aa)){const e=lt.create("invalid-gtag-resource",{gtagURL:n});return et.warn(e.message),""}return n}function Ph(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function B_(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function $_(n,e){const t=B_("firebase-js-sdk-policy",{createScriptURL:U_}),r=document.createElement("script"),s=`${aa}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function G_(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function W_(n,e,t,r,s,o){const a=r[s];try{if(a)await e[a];else{const h=(await Ph(t)).find(f=>f.measurementId===s);h&&await e[h.appId]}}catch(u){et.error(u)}n("config",s,o)}async function H_(n,e,t,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const u=await Ph(t);for(const h of a){const f=u.find(b=>b.measurementId===h),y=f&&e[f.appId];if(y)o.push(y);else{o=[];break}}}o.length===0&&(o=Object.values(e)),await Promise.all(o),n("event",r,s||{})}catch(o){et.error(o)}}function q_(n,e,t,r){async function s(o,...a){try{if(o==="event"){const[u,h]=a;await H_(n,e,t,u,h)}else if(o==="config"){const[u,h]=a;await W_(n,e,t,r,u,h)}else if(o==="consent"){const[u,h]=a;n("consent",u,h)}else if(o==="get"){const[u,h,f]=a;n("get",u,h,f)}else if(o==="set"){const[u]=a;n("set",u)}else n(o,...a)}catch(u){et.error(u)}}return s}function z_(n,e,t,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=q_(o,n,e,t),{gtagCore:o,wrappedGtag:window[s]}}function K_(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(aa)&&t.src.includes(n))return t;return null}/**
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
 */const J_=30,Q_=1e3;class Y_{constructor(e={},t=Q_){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const jh=new Y_;function X_(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Z_(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:X_(r)},o=V_.replace("{app-id}",t),a=await fetch(o,s);if(a.status!==200&&a.status!==304){let u="";try{const h=await a.json();!((e=h.error)===null||e===void 0)&&e.message&&(u=h.error.message)}catch{}throw lt.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function ew(n,e=jh,t){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw lt.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw lt.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new rw;return setTimeout(async()=>{u.abort()},M_),Oh({appId:r,apiKey:s,measurementId:o},a,u,e)}async function Oh(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=jh){var o;const{appId:a,measurementId:u}=n;try{await tw(r,e)}catch(h){if(u)return et.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:a,measurementId:u};throw h}try{const h=await Z_(n);return s.deleteThrottleMetadata(a),h}catch(h){const f=h;if(!nw(f)){if(s.deleteThrottleMetadata(a),u)return et.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${f==null?void 0:f.message}]`),{appId:a,measurementId:u};throw h}const y=Number((o=f==null?void 0:f.customData)===null||o===void 0?void 0:o.httpStatus)===503?nl(t,s.intervalMillis,J_):nl(t,s.intervalMillis),b={throttleEndTimeMillis:Date.now()+y,backoffCount:t+1};return s.setThrottleMetadata(a,b),et.debug(`Calling attemptFetch again in ${y} millis`),Oh(n,b,r,s)}}function tw(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),o=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(o),r(lt.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function nw(n){if(!(n instanceof xt)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class rw{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function sw(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const o=await e,a=Object.assign(Object.assign({},r),{send_to:o});n("event",t,a)}}/**
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
 */async function iw(){if(Ac())try{await Cc()}catch(n){return et.warn(lt.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return et.warn(lt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ow(n,e,t,r,s,o,a){var u;const h=ew(n);h.then(C=>{t[C.measurementId]=C.appId,n.options.measurementId&&C.measurementId!==n.options.measurementId&&et.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${C.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(C=>et.error(C)),e.push(h);const f=iw().then(C=>{if(C)return r.getId()}),[y,b]=await Promise.all([h,f]);K_(o)||$_(o,y.measurementId),s("js",new Date);const x=(u=a==null?void 0:a.config)!==null&&u!==void 0?u:{};return x[L_]="firebase",x.update=!0,b!=null&&(x[D_]=b),s("config",y.measurementId,x),y.measurementId}/**
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
 */class aw{constructor(e){this.app=e}_delete(){return delete Pr[this.app.options.appId],Promise.resolve()}}let Pr={},rc=[];const sc={};let Ki="dataLayer",lw="gtag",ic,Dh,oc=!1;function cw(){const n=[];if(Tc()&&n.push("This is a browser extension environment."),ef()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=lt.create("invalid-analytics-context",{errorInfo:e});et.warn(t.message)}}function uw(n,e,t){cw();const r=n.options.appId;if(!r)throw lt.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)et.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw lt.create("no-api-key");if(Pr[r]!=null)throw lt.create("already-exists",{id:r});if(!oc){G_(Ki);const{wrappedGtag:o,gtagCore:a}=z_(Pr,rc,sc,Ki,lw);Dh=o,ic=a,oc=!0}return Pr[r]=ow(n,rc,sc,e,ic,Ki,t),new aw(n)}function hw(n=So()){n=tt(n);const e=kn(n,si);return e.isInitialized()?e.getImmediate():dw(n)}function dw(n,e={}){const t=kn(n,si);if(t.isInitialized()){const s=t.getImmediate();if(Or(e,t.getOptions()))return s;throw lt.create("already-initialized")}return t.initialize({options:e})}function fw(n,e,t,r){n=tt(n),sw(Dh,Pr[n.app.options.appId],e,t,r).catch(s=>et.error(s))}const ac="@firebase/analytics",lc="0.10.8";function pw(){kt(new Et(si,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return uw(r,s,t)},"PUBLIC")),kt(new Et("analytics-internal",n,"PRIVATE")),dt(ac,lc),dt(ac,lc,"esm2017");function n(e){try{const t=e.getProvider(si).getImmediate();return{logEvent:(r,s,o)=>fw(t,r,s,o)}}catch(t){throw lt.create("interop-component-reg-failed",{reason:t})}}}pw();const mw={apiKey:"AIzaSyCIqpOl5nT3VH149xISPqyLgkjyIiMWPb8",authDomain:"flinx-8a05e.firebaseapp.com",projectId:"flinx-8a05e",storageBucket:"flinx-8a05e.firebasestorage.app",messagingSenderId:"977393893446",appId:"1:977393893446:web:308db5f232f7c5558cca47",measurementId:"G-N0LW13KMNJ"},la=kc(mw);let gw;if(typeof window<"u")try{gw=hw(la)}catch{console.log("Analytics initialization skipped (local development)")}const Wr=yg(la),yw=Dv(la),ca=new Gt;ca.addScope("profile");ca.addScope("email");ca.addScope("openid");const Hr=new $t,Lh="863917229498555";console.log("🔧 Configuring Facebook Auth Provider:");console.log("   - App ID:",Lh);console.log("   - Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler");Hr.setCustomParameters({app_id:Lh,display:"popup",auth_type:"rerequest",scope:"public_profile,email"});Hr.addScope("public_profile");Hr.addScope("email");console.log("✅ Facebook Auth Provider initialized with:");console.log("   - Public Profile scope: ✓");console.log("   - Email scope: ✓");console.log("   - Web OAuth redirect enabled: ✓");const Mh=async(n,e)=>{var a,u,h;console.log(`📝 Processing ${e} login for user:`,n.email);let t=null;e==="facebook"&&((a=n.providerData[0])!=null&&a.uid)&&(t=n.providerData[0].uid);const r={uid:n.uid,email:n.email,name:n.displayName||"User",picture:n.photoURL||null,authProvider:e,googleId:e==="google"?(u=n.providerData[0])==null?void 0:u.uid:null,facebookId:e==="facebook"?t:null,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};console.log("✅ User info extracted:",{email:r.email,name:r.name,authProvider:r.authProvider});try{const f=await n.getIdToken();localStorage.setItem("idToken",f),console.log("🔐 Firebase ID token stored for Socket.IO")}catch(f){console.error("❌ Failed to get Firebase ID token:",f)}try{const y=await fetch("https://flinxx-backend.onrender.com/api/users/save",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uid:n.uid,email:n.email,displayName:n.displayName||"User",photoURL:n.photoURL||null,authProvider:e})});if(!y.ok)throw new Error(`Failed to save user: ${y.status}`);const b=await y.json();console.log("✅ User saved to Neon PostgreSQL:",b.user),b.user&&(r.profileCompleted=b.user.profileCompleted,r.isProfileCompleted=b.user.profileCompleted,r.id=b.user.id,r.uuid=b.user.uuid,console.log("[FIREBASE] 🎯 Updated userInfo with profileCompleted:",b.user.profileCompleted)),localStorage.setItem("dbUserId",b.user.id)}catch(f){console.error("⚠️ Error saving user to backend database:",f)}try{await Kv(Ov(yw,"users",n.uid),{email:n.email,displayName:n.displayName,photoURL:n.photoURL,authProvider:e,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()},{merge:!0}),console.log("✅ User saved to Firestore")}catch(f){console.error("⚠️ Error saving user to Firestore:",f)}console.log(`
🟠 [firebase] handleLoginSuccess storing to localStorage`),console.log("🟠 [firebase]   - userInfo.profileCompleted =",r.profileCompleted),console.log("🟠 [firebase]   - userInfo.isProfileCompleted =",r.isProfileCompleted);const s={id:r.id,uuid:r.uuid,uid:r.uid,name:n.displayName,email:n.email,picture:n.photoURL,googleId:e==="google"?(h=n.providerData[0])==null?void 0:h.uid:null,facebookId:e==="facebook"?t:null,profileCompleted:r.profileCompleted||!1,isProfileCompleted:r.profileCompleted||!1,authProvider:e};console.log("🟠 [firebase] userToStore object:",s),localStorage.setItem("user",JSON.stringify(s)),localStorage.setItem("authProvider",e),localStorage.setItem("userInfo",JSON.stringify(r)),console.log("🟠 [firebase] ✅ Stored to localStorage, verifying...");const o=JSON.parse(localStorage.getItem("user"));return console.log("🟠 [firebase]   - Verified profileCompleted:",o.profileCompleted),console.log("🟠 [firebase] ✅ User data stored in localStorage with profileCompleted:",r.profileCompleted||!1),r},cc=async()=>{var n;try{console.log("📱 Starting Facebook login via popup...");const e=await Tm(Wr,Hr);console.log("✅ Facebook popup login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;let r="facebook";return t==="facebook.com"&&(r="facebook"),Mh(e.user,r)}catch(e){console.warn("⚠️ Facebook popup login failed, trying redirect method:",e.code);try{return console.log("📱 Starting Facebook login via redirect..."),await km(Wr,Hr),null}catch(t){throw console.error("❌ Facebook login failed:",t),t}}},vw=async()=>{var n;try{const e=await jm(Wr);if(e!=null&&e.user){console.log("✅ Redirect login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;console.log("Provider:",t);let r="unknown";return t==="google.com"?r="google":t==="facebook.com"&&(r="facebook"),Mh(e.user,r)}}catch(e){console.error("Redirect result error:",e),e.code==="auth/account-exists-with-different-credential"?console.error("Account exists with different credential"):e.code==="auth/auth-domain-config-required"&&console.error("Auth domain config required")}return null},Ii="https://flinxx-backend.onrender.com",Vh=()=>localStorage.getItem("token"),Fh=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getFriends blocked – invalid UUID:",n),[];const e=await fetch(`${Ii}/api/friends?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});return e.ok?await e.json():[]}catch(e){return console.error("Error fetching friends:",e),[]}},_w=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getNotifications blocked – invalid UUID:",n),[];console.log("📬 Fetching notifications for user");const e=await fetch(`${Ii}/api/notifications?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});if(!e.ok)return[];const t=await e.json();return console.log("✅ Notifications loaded:",t.length,"items"),t}catch(e){return console.error("❌ Error fetching notifications:",e),[]}},Ji=async n=>{if(!n||typeof n!="string"||n.length!==36)return 0;try{const e=await fetch(`${Ii}/api/messages/unread-count/${n}`,{method:"GET",headers:{"Content-Type":"application/json"}});return e.ok?(await e.json()).unreadCount??0:0}catch{return 0}},jr=async(n,e,t)=>{try{const r=localStorage.getItem("token");if(!r)return console.warn("No auth token in markMessagesAsRead"),{success:!1};let s=null;if(typeof e=="string"&&e.includes("_"))s=e;else{const u=e,h=n;if(!h||h.length!==36)return console.error("❌ Invalid UUID in markMessagesAsRead:",h),{success:!1};if(!u||u.length!==36)return console.error("❌ Invalid other user UUID in markMessagesAsRead:",u),{success:!1};s=h<u?`${h}_${u}`:`${u}_${h}`}const o=await fetch(`${Ii}/api/messages/mark-read/${encodeURIComponent(s)}`,{method:"PUT",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!o.ok)return console.error("❌ Mark read API error:",o.status,o.statusText),{success:!1};const a=await o.json();return console.log("✅ Messages marked as read",a),a}catch(r){return console.error("Error marking messages as read:",r),{success:!1}}},Lt=A.createContext(),ww=()=>{const n=A.useContext(Lt);if(!n)throw new Error("useAuth must be used within AuthProvider");return n},Iw=({children:n})=>{const[e,t]=A.useState(null),[r,s]=A.useState(!0),[o,a]=A.useState(!1),[u,h]=A.useState(!1),[f,y]=A.useState([]),b=async()=>{if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.warn("⏸ refreshNotifications skipped: user UUID not ready");return}const k=await _w(e.uuid);y(Array.isArray(k)?k:[])};A.useEffect(()=>{if(r===!0){console.log("⏸ Skipping notifications fetch – authLoading is true");return}if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.log("⏸ Skipping notifications fetch – user UUID not ready");return}console.log("✅ User ready, fetching notifications:",e.uuid.substring(0,8)+"..."),b();const k=setInterval(b,5e3);return()=>{clearInterval(k)}},[r,e==null?void 0:e.uuid]),A.useEffect(()=>{(async()=>{var S,N,G;try{console.log(`

🔵 [AuthContext] ═══════════════════════════════════════════`),console.log("🔵 [AuthContext] INITIALIZATION STARTED"),console.log("🔵 [AuthContext] ═══════════════════════════════════════════");const W=localStorage.getItem("user");if(W)try{const M=JSON.parse(W);(!M.uuid||typeof M.uuid=="string"&&M.uuid.length!==36)&&(console.warn("🧹 [AuthContext] Removing invalid user from localStorage:",{uuid:M.uuid,id:M.id,email:M.email}),localStorage.removeItem("user"),localStorage.removeItem("token"))}catch{console.warn("🧹 [AuthContext] Invalid JSON in localStorage user, removing"),localStorage.removeItem("user")}const U=localStorage.getItem("token"),B=localStorage.getItem("user");if(console.log("🔵 [AuthContext] STEP 1: Check localStorage"),console.log("🔵 [AuthContext]   - token:",U?"✓ Found":"✗ Not found"),console.log("🔵 [AuthContext]   - user:",B?"✓ Found":"✗ Not found"),U&&B)try{console.log(`
🔵 [AuthContext] STEP 2: Parse localStorage user`);const M=JSON.parse(B);console.log("🔵 [AuthContext]   - Parsed user email:",M.email),console.log("🔵 [AuthContext]   - profileCompleted from localStorage:",M.profileCompleted,"(type:",typeof M.profileCompleted+")"),console.log("🔵 [AuthContext] 🔍 Attempting to restore Google OAuth user from localStorage:",M.email),console.log("🔵 [AuthContext] User data from localStorage:",{id:M.id,email:M.email,profileCompleted:M.profileCompleted,isProfileCompleted:M.isProfileCompleted});const I="https://flinxx-backend.onrender.com";console.log(`
🔵 [AuthContext] STEP 3: Validate token with backend`),console.log("🔵 [AuthContext]   - Backend URL:",I),console.log("🔵 [AuthContext]   - Making request to /api/profile...");const m=await fetch(`${I}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${U}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext]   - Response status:",m.status),m.ok){const g=await m.json();if(console.log("🔵 [AuthContext]   - Response OK, parsing data..."),console.log("🔵 [AuthContext]   - data.success:",g.success),console.log("🔵 [AuthContext]   - data.user available:",!!g.user),g.success&&g.user){console.log("🔵 [AuthContext] ✅ Token validated, user restored from backend"),console.log("🔵 [AuthContext] Backend user data:",{id:g.user.id,email:g.user.email,profileCompleted:g.user.profileCompleted,birthday:g.user.birthday,gender:g.user.gender});const _={uuid:g.user.uuid,name:g.user.name||"User",email:g.user.email,picture:g.user.picture,profileCompleted:g.user.profileCompleted||!1};if(!_.uuid||typeof _.uuid!="string"||_.uuid.length!==36){console.error("❌ INVALID UUID FROM BACKEND:",_.uuid),console.error("   Expected 36-char UUID, got:",((S=_.uuid)==null?void 0:S.length)||"undefined"),s(!1);return}console.log("🔵 [AuthContext] Setting user state with UUID-only:",{uuid:_.uuid.substring(0,8)+"...",email:_.email}),t(_),localStorage.setItem("user",JSON.stringify(_)),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - UUID-only user set");return}else console.log("🔵 [AuthContext] ⚠️  Response OK but data.success or data.user missing")}else{console.log("🔵 [AuthContext] ⚠️ Token validation response not OK:",m.status);const g=await m.text();console.log("🔵 [AuthContext] Error response:",g)}}catch(M){console.error("🔵 [AuthContext] ❌ Error validating token:",M)}else console.log(`
🔵 [AuthContext] STEP 2: Skip token validation (missing token or user)`),console.log("🔵 [AuthContext]   - Skipping /api/profile call");if(B)try{console.log(`
🔵 [AuthContext] STEP 3: Restore from localStorage (no token validation)`),console.log("🔵 [AuthContext] Raw stored user string:",B);const M=JSON.parse(B);if(console.log("🔵 [AuthContext] Parsed user object:",M),console.log("🔵 [AuthContext] User keys:",Object.keys(M)),console.log("🔵 [AuthContext] user.uuid value:",M.uuid),console.log("🔵 [AuthContext] user.uuid type:",typeof M.uuid),console.log("🔵 [AuthContext] user.uuid length:",(N=M.uuid)==null?void 0:N.length),!M.uuid||typeof M.uuid!="string"||M.uuid.length!==36){console.warn("🧹 [AuthContext] Invalid UUID in localStorage, removing:",(G=M.uuid)==null?void 0:G.length),localStorage.removeItem("user"),localStorage.removeItem("token"),s(!1);return}console.log("🔵 [AuthContext]   - Email:",M.email),console.log("🔵 [AuthContext]   - UUID:",M.uuid.substring(0,8)+"..."),console.log("🔵 [AuthContext] ✅ User loaded from localStorage (UUID valid):",M.email),t(M),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - Returning from localStorage fallback path");return}catch(M){console.error("[AuthContext] Error parsing saved user:",M)}return console.log(`
🔵 [AuthContext] STEP 3: No stored token or user, checking Firebase...`),sm(Wr,async M=>{var I,m;if(console.log(`
🔵 [AuthContext] Firebase onAuthStateChanged fired`),console.log("🔵 [AuthContext]   - firebaseUser:",M?M.email:"null"),M){const g=((I=M.providerData[0])==null?void 0:I.providerId)||"unknown";console.log("🔵 [AuthContext] User authenticated via Firebase"),console.log("🔵 [AuthContext]   - Email:",M.email),console.log("🔵 [AuthContext]   - Provider:",g);try{console.log("🔵 [AuthContext] Getting Firebase ID token...");const w=await M.getIdToken();console.log("🔵 [AuthContext] ✓ ID token obtained"),localStorage.setItem("idToken",w),console.log("🔐 Firebase ID token stored for Socket.IO");const E="https://flinxx-backend.onrender.com";console.log("🔵 [AuthContext] Calling /api/profile with ID token...");const v=await fetch(`${E}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${w}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext] /api/profile response status:",v.status),v.ok){const X=await v.json();if(console.log("🔵 [AuthContext] /api/profile response OK"),console.log("🔵 [AuthContext]   - success:",X.success),console.log("🔵 [AuthContext]   - user.profileCompleted:",(m=X.user)==null?void 0:m.profileCompleted),X.success&&X.user){console.log("🔵 [AuthContext] ✅ Fetched full user profile from database:",{email:X.user.email,profileCompleted:X.user.profileCompleted}),console.log("🔵 [AuthContext] Setting user state with profileCompleted:",X.user.profileCompleted);const _e={...X.user,publicId:X.user.public_id||X.user.publicId,uuid:X.user.uuid};_e.uuid||console.error("❌ UUID missing from backend user object"),t(_e),a(!0),s(!1);return}}else console.log("🔵 [AuthContext] ⚠️ /api/profile response not OK:",v.status)}catch(w){console.warn("[AuthContext] ⚠️ Failed to fetch profile from database:",w)}const _={uid:M.uid,email:M.email,displayName:M.displayName,photoURL:M.photoURL,publicId:M.uid,authProvider:g,profileCompleted:!1};console.log("[AuthContext] Using fallback userInfo (database fetch failed):",_.email),console.log("[AuthContext] ⚠️ WARNING: profileCompleted not loaded from database, defaulting to false"),t(_),a(!0),localStorage.setItem("userInfo",JSON.stringify(_)),localStorage.setItem("authProvider",g)}else{console.log("🔵 [AuthContext] Firebase user is null/logged out");const g=localStorage.getItem("authToken"),_=localStorage.getItem("authProvider");if(console.log("🔵 [AuthContext]   - authToken:",g?"Found":"Not found"),console.log("🔵 [AuthContext]   - authProvider:",_),g&&_==="guest"){const w=JSON.parse(localStorage.getItem("userInfo")||"{}");!w.publicId&&w.public_id&&(w.publicId=w.public_id),console.log("🔵 [AuthContext] Restoring guest login"),t(w),a(!0)}else console.log("🔵 [AuthContext] ❌ No authentication found, user will be redirected to login"),t(null),a(!1)}console.log("🔵 [AuthContext] ═══════════════════════════════════════════"),console.log("🔵 [AuthContext] INITIALIZATION COMPLETE - Setting isLoading=false"),console.log(`🔵 [AuthContext] ═══════════════════════════════════════════
`),s(!1)})}catch(W){console.error("[AuthContext] Error initializing auth:",W),s(!1)}})()},[]);const x=()=>{t(null),a(!1),localStorage.removeItem("authToken"),localStorage.removeItem("userInfo"),localStorage.removeItem("authProvider"),localStorage.removeItem("token"),localStorage.removeItem("user")},C=(k,S)=>{var G,W;console.log("[AuthContext] ⚠️ setAuthToken called with userData:",{email:S==null?void 0:S.email,has_uuid:!!(S!=null&&S.uuid),uuid:S==null?void 0:S.uuid,uuid_length:(G=S==null?void 0:S.uuid)==null?void 0:G.length,all_keys:Object.keys(S||{})});const N={uuid:S==null?void 0:S.uuid,name:(S==null?void 0:S.name)||"User",email:S==null?void 0:S.email,picture:S==null?void 0:S.picture,profileCompleted:(S==null?void 0:S.profileCompleted)||!1};if(!N.uuid||typeof N.uuid!="string"||N.uuid.length!==36){console.error("❌ Invalid or missing UUID in setAuthToken:",{uuid_received:S==null?void 0:S.uuid,uuid_type:typeof(S==null?void 0:S.uuid),uuid_length:(W=S==null?void 0:S.uuid)==null?void 0:W.length});return}console.log("[AuthContext] ✅ setAuthToken storing user with UUID:",N.uuid.substring(0,8)+"..."),localStorage.setItem("token",k),localStorage.setItem("user",JSON.stringify(N)),localStorage.setItem("authProvider","google"),t(N),a(!0)};return l.jsx(Lt.Provider,{value:{user:e,isAuthenticated:o,isLoading:r,logout:x,authPending:u,setAuthPending:h,setAuthToken:C,notifications:f,refreshNotifications:b},children:n})},ua=A.createContext(),bw=({children:n})=>{const[e,t]=A.useState({}),r=u=>{t(h=>({...h,[u]:!0}))},s=u=>{t(h=>{const f={...h};return delete f[u],f})},o=Object.keys(e).length,a={unreadMessages:e,setUnreadMessages:t,markAsUnread:r,markAsRead:s,unreadCount:o};return l.jsx(ua.Provider,{value:a,children:n})},Dt=Object.create(null);Dt.open="0";Dt.close="1";Dt.ping="2";Dt.pong="3";Dt.message="4";Dt.upgrade="5";Dt.noop="6";const Os=Object.create(null);Object.keys(Dt).forEach(n=>{Os[Dt[n]]=n});const wo={type:"error",data:"parser error"},Uh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Bh=typeof ArrayBuffer=="function",$h=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,ha=({type:n,data:e},t,r)=>Uh&&e instanceof Blob?t?r(e):uc(e,r):Bh&&(e instanceof ArrayBuffer||$h(e))?t?r(e):uc(new Blob([e]),r):r(Dt[n]+(e||"")),uc=(n,e)=>{const t=new FileReader;return t.onload=function(){const r=t.result.split(",")[1];e("b"+(r||""))},t.readAsDataURL(n)};function hc(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let Qi;function Ew(n,e){if(Uh&&n.data instanceof Blob)return n.data.arrayBuffer().then(hc).then(e);if(Bh&&(n.data instanceof ArrayBuffer||$h(n.data)))return e(hc(n.data));ha(n,!1,t=>{Qi||(Qi=new TextEncoder),e(Qi.encode(t))})}const dc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ar=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<dc.length;n++)Ar[dc.charCodeAt(n)]=n;const xw=n=>{let e=n.length*.75,t=n.length,r,s=0,o,a,u,h;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const f=new ArrayBuffer(e),y=new Uint8Array(f);for(r=0;r<t;r+=4)o=Ar[n.charCodeAt(r)],a=Ar[n.charCodeAt(r+1)],u=Ar[n.charCodeAt(r+2)],h=Ar[n.charCodeAt(r+3)],y[s++]=o<<2|a>>4,y[s++]=(a&15)<<4|u>>2,y[s++]=(u&3)<<6|h&63;return f},Tw=typeof ArrayBuffer=="function",da=(n,e)=>{if(typeof n!="string")return{type:"message",data:Gh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Aw(n.substring(1),e)}:Os[t]?n.length>1?{type:Os[t],data:n.substring(1)}:{type:Os[t]}:wo},Aw=(n,e)=>{if(Tw){const t=xw(n);return Gh(t,e)}else return{base64:!0,data:n}},Gh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},Wh="",Cw=(n,e)=>{const t=n.length,r=new Array(t);let s=0;n.forEach((o,a)=>{ha(o,!1,u=>{r[a]=u,++s===t&&e(r.join(Wh))})})},Sw=(n,e)=>{const t=n.split(Wh),r=[];for(let s=0;s<t.length;s++){const o=da(t[s],e);if(r.push(o),o.type==="error")break}return r};function Rw(){return new TransformStream({transform(n,e){Ew(n,t=>{const r=t.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const o=new DataView(s.buffer);o.setUint8(0,126),o.setUint16(1,r)}else{s=new Uint8Array(9);const o=new DataView(s.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(r))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let Yi;function Ts(n){return n.reduce((e,t)=>e+t.length,0)}function As(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)t[s]=n[0][r++],r===n[0].length&&(n.shift(),r=0);return n.length&&r<n[0].length&&(n[0]=n[0].slice(r)),t}function Nw(n,e){Yi||(Yi=new TextDecoder);const t=[];let r=0,s=-1,o=!1;return new TransformStream({transform(a,u){for(t.push(a);;){if(r===0){if(Ts(t)<1)break;const h=As(t,1);o=(h[0]&128)===128,s=h[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(Ts(t)<2)break;const h=As(t,2);s=new DataView(h.buffer,h.byteOffset,h.length).getUint16(0),r=3}else if(r===2){if(Ts(t)<8)break;const h=As(t,8),f=new DataView(h.buffer,h.byteOffset,h.length),y=f.getUint32(0);if(y>Math.pow(2,21)-1){u.enqueue(wo);break}s=y*Math.pow(2,32)+f.getUint32(4),r=3}else{if(Ts(t)<s)break;const h=As(t,s);u.enqueue(da(o?h:Yi.decode(h),e)),r=0}if(s===0||s>n){u.enqueue(wo);break}}}})}const Hh=4;function Ne(n){if(n)return kw(n)}function kw(n){for(var e in Ne.prototype)n[e]=Ne.prototype[e];return n}Ne.prototype.on=Ne.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Ne.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Ne.prototype.off=Ne.prototype.removeListener=Ne.prototype.removeAllListeners=Ne.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var r,s=0;s<t.length;s++)if(r=t[s],r===e||r.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Ne.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(t){t=t.slice(0);for(var r=0,s=t.length;r<s;++r)t[r].apply(this,e)}return this};Ne.prototype.emitReserved=Ne.prototype.emit;Ne.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Ne.prototype.hasListeners=function(n){return!!this.listeners(n).length};const bi=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),ht=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Pw="arraybuffer";function qh(n,...e){return e.reduce((t,r)=>(n.hasOwnProperty(r)&&(t[r]=n[r]),t),{})}const jw=ht.setTimeout,Ow=ht.clearTimeout;function Ei(n,e){e.useNativeTimers?(n.setTimeoutFn=jw.bind(ht),n.clearTimeoutFn=Ow.bind(ht)):(n.setTimeoutFn=ht.setTimeout.bind(ht),n.clearTimeoutFn=ht.clearTimeout.bind(ht))}const Dw=1.33;function Lw(n){return typeof n=="string"?Mw(n):Math.ceil((n.byteLength||n.size)*Dw)}function Mw(n){let e=0,t=0;for(let r=0,s=n.length;r<s;r++)e=n.charCodeAt(r),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(r++,t+=4);return t}function zh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Vw(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Fw(n){let e={},t=n.split("&");for(let r=0,s=t.length;r<s;r++){let o=t[r].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class Uw extends Error{constructor(e,t,r){super(e),this.description=t,this.context=r,this.type="TransportError"}}class fa extends Ne{constructor(e){super(),this.writable=!1,Ei(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,r){return super.emitReserved("error",new Uw(e,t,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=da(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&+(this.opts.port!==443)||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Vw(e);return t.length?"?"+t:""}}class Bw extends fa{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||t()})),this.writable||(r++,this.once("drain",function(){--r||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Sw(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Cw(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=zh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Kh=!1;try{Kh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const $w=Kh;function Gw(){}class Ww extends Bw{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let r=location.port;r||(r=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,t){const r=this.request({method:"POST",data:e});r.on("success",t),r.on("error",(s,o)=>{this.onError("xhr post error",s,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,r)=>{this.onError("xhr poll error",t,r)}),this.pollXhr=e}}let qn=class Ds extends Ne{constructor(e,t,r){super(),this.createRequest=e,Ei(this,r),this._opts=r,this._method=r.method||"GET",this._uri=t,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const t=qh(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(t);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ds.requestsCount++,Ds.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Gw,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ds.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};qn.requestsCount=0;qn.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",fc);else if(typeof addEventListener=="function"){const n="onpagehide"in ht?"pagehide":"unload";addEventListener(n,fc,!1)}}function fc(){for(let n in qn.requests)qn.requests.hasOwnProperty(n)&&qn.requests[n].abort()}const Hw=function(){const n=Jh({xdomain:!1});return n&&n.responseType!==null}();class qw extends Ww{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Hw&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new qn(Jh,this.uri(),e)}}function Jh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||$w))return new XMLHttpRequest}catch{}if(!e)try{return new ht[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Qh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class zw extends fa{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,r=Qh?{}:qh(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;ha(r,this.supportsBinary,o=>{try{this.doWrite(r,o)}catch{}s&&bi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=zh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Xi=ht.WebSocket||ht.MozWebSocket;class Kw extends zw{createSocket(e,t,r){return Qh?new Xi(e,t,r):t?new Xi(e,t):new Xi(e)}doWrite(e,t){this.ws.send(t)}}class Jw extends fa{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Nw(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(t).getReader(),s=Rw();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const o=()=>{r.read().then(({done:u,value:h})=>{u||(this.onPacket(h),o())}).catch(u=>{})};o();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;this._writer.write(r).then(()=>{s&&bi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Qw={websocket:Kw,webtransport:Jw,polling:qw},Yw=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Xw=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Io(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),r=n.indexOf("]");t!=-1&&r!=-1&&(n=n.substring(0,t)+n.substring(t,r).replace(/:/g,";")+n.substring(r,n.length));let s=Yw.exec(n||""),o={},a=14;for(;a--;)o[Xw[a]]=s[a]||"";return t!=-1&&r!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Zw(o,o.path),o.queryKey=eI(o,o.query),o}function Zw(n,e){const t=/\/{2,9}/g,r=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function eI(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,o){s&&(t[s]=o)}),t}const bo=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ls=[];bo&&addEventListener("offline",()=>{Ls.forEach(n=>n())},!1);class un extends Ne{constructor(e,t){if(super(),this.binaryType=Pw,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const r=Io(e);t.hostname=r.host,t.secure=r.protocol==="https"||r.protocol==="wss",t.port=r.port,r.query&&(t.query=r.query)}else t.host&&(t.hostname=Io(t.host).host);Ei(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Fw(this.opts.query)),bo&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ls.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Hh,t.transport=e,this.id&&(t.sid=this.id);const r=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&un.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",un.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(t+=Lw(s)),r>0&&t>this._maxPayload)return this.writeBuffer.slice(0,r);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,bi(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,r){return this._sendPacket("message",e,t,r),this}send(e,t,r){return this._sendPacket("message",e,t,r),this}_sendPacket(e,t,r,s){if(typeof t=="function"&&(s=t,t=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const o={type:e,data:t,options:r};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},r=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(un.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),bo&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Ls.indexOf(this._offlineEventListener);r!==-1&&Ls.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}un.protocol=Hh;class tI extends un{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),r=!1;un.priorWebsocketSuccess=!1;const s=()=>{r||(t.send([{type:"ping",data:"probe"}]),t.once("packet",b=>{if(!r)if(b.type==="pong"&&b.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;un.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(y(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const x=new Error("probe error");x.transport=t.name,this.emitReserved("upgradeError",x)}}))};function o(){r||(r=!0,y(),t.close(),t=null)}const a=b=>{const x=new Error("probe error: "+b);x.transport=t.name,o(),this.emitReserved("upgradeError",x)};function u(){a("transport closed")}function h(){a("socket closed")}function f(b){t&&b.name!==t.name&&o()}const y=()=>{t.removeListener("open",s),t.removeListener("error",a),t.removeListener("close",u),this.off("close",h),this.off("upgrading",f)};t.once("open",s),t.once("error",a),t.once("close",u),this.once("close",h),this.once("upgrading",f),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&t.push(e[r]);return t}}let nI=class extends tI{constructor(e,t={}){const r=typeof e=="object"?e:t;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Qw[s]).filter(s=>!!s)),super(e,r)}};function rI(n,e="",t){let r=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),r=Io(n)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const o=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+o+":"+r.port+e,r.href=r.protocol+"://"+o+(t&&t.port===r.port?"":":"+r.port),r}const sI=typeof ArrayBuffer=="function",iI=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Yh=Object.prototype.toString,oI=typeof Blob=="function"||typeof Blob<"u"&&Yh.call(Blob)==="[object BlobConstructor]",aI=typeof File=="function"||typeof File<"u"&&Yh.call(File)==="[object FileConstructor]";function pa(n){return sI&&(n instanceof ArrayBuffer||iI(n))||oI&&n instanceof Blob||aI&&n instanceof File}function Ms(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,r=n.length;t<r;t++)if(Ms(n[t]))return!0;return!1}if(pa(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Ms(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Ms(n[t]))return!0;return!1}function lI(n){const e=[],t=n.data,r=n;return r.data=Eo(t,e),r.attachments=e.length,{packet:r,buffers:e}}function Eo(n,e){if(!n)return n;if(pa(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let r=0;r<n.length;r++)t[r]=Eo(n[r],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=Eo(n[r],e));return t}return n}function cI(n,e){return n.data=xo(n.data,e),delete n.attachments,n}function xo(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=xo(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=xo(n[t],e));return n}const uI=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],hI=5;var ie;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(ie||(ie={}));class dI{constructor(e){this.replacer=e}encode(e){return(e.type===ie.EVENT||e.type===ie.ACK)&&Ms(e)?this.encodeAsBinary({type:e.type===ie.EVENT?ie.BINARY_EVENT:ie.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===ie.BINARY_EVENT||e.type===ie.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=lI(e),r=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(r),s}}function pc(n){return Object.prototype.toString.call(n)==="[object Object]"}class ma extends Ne{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const r=t.type===ie.BINARY_EVENT;r||t.type===ie.BINARY_ACK?(t.type=r?ie.EVENT:ie.ACK,this.reconstructor=new fI(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(pa(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const r={type:Number(e.charAt(0))};if(ie[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===ie.BINARY_EVENT||r.type===ie.BINARY_ACK){const o=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(o,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");r.attachments=Number(a)}if(e.charAt(t+1)==="/"){const o=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););r.nsp=e.substring(o,t)}else r.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const o=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}r.id=Number(e.substring(o,t+1))}if(e.charAt(++t)){const o=this.tryParse(e.substr(t));if(ma.isPayloadValid(r.type,o))r.data=o;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case ie.CONNECT:return pc(t);case ie.DISCONNECT:return t===void 0;case ie.CONNECT_ERROR:return typeof t=="string"||pc(t);case ie.EVENT:case ie.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&uI.indexOf(t[0])===-1);case ie.ACK:case ie.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class fI{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=cI(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const pI=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ma,Encoder:dI,get PacketType(){return ie},protocol:hI},Symbol.toStringTag,{value:"Module"}));function yt(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const mI=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Xh extends Ne{constructor(e,t,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[yt(e,"open",this.onopen.bind(this)),yt(e,"packet",this.onpacket.bind(this)),yt(e,"error",this.onerror.bind(this)),yt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var r,s,o;if(mI.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:ie.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const y=this.ids++,b=t.pop();this._registerAckCallback(y,b),a.id=y}const u=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,h=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!u||(h?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let u=0;u<this.sendBuffer.length;u++)this.sendBuffer[u].id===e&&this.sendBuffer.splice(u,1);t.call(this,new Error("operation has timed out"))},s),a=(...u)=>{this.io.clearTimeoutFn(o),t.apply(this,u)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((r,s)=>{const o=(a,u)=>a?s(a):r(u);o.withError=!0,t.push(o),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...o)=>r!==this._queue[0]?void 0:(s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...o)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:ie.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case ie.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case ie.EVENT:case ie.BINARY_EVENT:this.onevent(e);break;case ie.ACK:case ie.BINARY_ACK:this.onack(e);break;case ie.DISCONNECT:this.ondisconnect();break;case ie.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const r of t)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let r=!1;return function(...s){r||(r=!0,t.packet({type:ie.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:ie.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const r of t)r.apply(this,e.data)}}}function sr(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}sr.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};sr.prototype.reset=function(){this.attempts=0};sr.prototype.setMin=function(n){this.ms=n};sr.prototype.setMax=function(n){this.max=n};sr.prototype.setJitter=function(n){this.jitter=n};class To extends Ne{constructor(e,t){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,Ei(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((r=t.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new sr({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||pI;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new nI(this.uri,this.opts);const t=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=yt(t,"open",function(){r.onopen(),e&&e()}),o=u=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",u),e?e(u):this.maybeReconnectOnOpen()},a=yt(t,"error",o);if(this._timeout!==!1){const u=this._timeout,h=this.setTimeoutFn(()=>{s(),o(new Error("timeout")),t.close()},u);this.opts.autoUnref&&h.unref(),this.subs.push(()=>{this.clearTimeoutFn(h)})}return this.subs.push(s),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(yt(e,"ping",this.onping.bind(this)),yt(e,"data",this.ondata.bind(this)),yt(e,"error",this.onerror.bind(this)),yt(e,"close",this.onclose.bind(this)),yt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){bi(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Xh(this,e,t),this.nsps[e]=r),r}_destroy(e){const t=Object.keys(this.nsps);for(const r of t)if(this.nsps[r].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let r=0;r<t.length;r++)this.engine.write(t[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const xr={};function Vs(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=rI(n,e.path||"/socket.io"),r=t.source,s=t.id,o=t.path,a=xr[s]&&o in xr[s].nsps,u=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let h;return u?h=new To(r,e):(xr[s]||(xr[s]=new To(r,e)),h=xr[s]),t.query&&!e.query&&(e.query=t.queryKey),h.socket(t.path,e)}Object.assign(Vs,{Manager:To,Socket:Xh,io:Vs,connect:Vs});const Zh="https://flinxx-backend.onrender.com";console.log("🔌 Socket.IO connecting to:",Zh);const K=Vs(Zh,{reconnection:!0,reconnectionDelay:1e3,reconnectionDelayMax:5e3,reconnectionAttempts:10,transports:["websocket","polling"],secure:!1,rejectUnauthorized:!1,forceNew:!1,withCredentials:!0,upgrade:!0,rememberUpgrade:!1,multiplex:!0,timeout:6e4,extraHeaders:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"true"}});K.on("connect",()=>{console.log("✅ Socket connected successfully! ID:",K.id),console.log("📊 Transport method:",K.io.engine.transport.name)});K.on("connect_error",n=>{console.error("❌ Socket connection error:",n.message||n),console.error("📍 Error details:",n),K.io.engine.transport.name==="polling"&&console.log("🔄 Retrying with websocket...")});K.on("error",n=>{console.error("❌ Socket error:",n)});K.on("disconnect",n=>{console.log("⚠️ Socket disconnected. Reason:",n),console.log("🔄 Attempting to reconnect...")});K.on("connect_timeout",()=>{console.error("⏱️ Socket connection timeout")});const ed=A.createContext(),gI=({children:n})=>{const{user:e,isLoading:t}=ww(),[r,s]=A.useState(0);A.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;let a=!1;const u=async()=>{var y;console.log("📊 UnreadContext: Calling getUnreadCount with UUID:",((y=e.uuid)==null?void 0:y.substring(0,8))+"...");const f=await Ji(e.uuid);if(!a){const b=typeof f=="number"?f:(f==null?void 0:f.unreadCount)||0;s(b)}};u();const h=setInterval(u,5e3);return()=>{a=!0,clearInterval(h)}},[t,e==null?void 0:e.uuid]),A.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||e.uuid.length!==36)return;const a=async()=>{var f;console.log("📬 New message received, fetching updated count for UUID:",((f=e.uuid)==null?void 0:f.substring(0,8))+"...");const u=await Ji(e.uuid),h=typeof u=="number"?u:(u==null?void 0:u.unreadCount)||0;s(h)};return K.on("receive_message",a),()=>{K.off("receive_message",a)}},[t,e==null?void 0:e.uuid]);const o=async()=>{if(!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;const a=await Ji(e.uuid),u=typeof a=="number"?a:(a==null?void 0:a.unreadCount)||0;s(u)};return l.jsx(ed.Provider,{value:{unreadCount:r,setUnreadCount:s,refetchUnreadCount:o},children:n})},ga=()=>{const n=A.useContext(ed);if(!n)throw new Error("useUnread must be used within UnreadProvider");return n};class yI extends It.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error("Error caught by boundary:",e,t)}render(){var e;return this.state.hasError?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-4xl font-bold text-red-500 mb-4",children:"Something went wrong"}),l.jsx("p",{className:"text-gray-300 mb-8",children:(e=this.state.error)==null?void 0:e.message}),l.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white",children:"Reload Page"})]})}):this.props.children}}const vI="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjcyIiB2aWV3Qm94PSIwIDAgMjgwIDcyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8IS0tIFB1cnBsZSBSb3VuZGVkLVNxdWFyZSBJY29uIChleGFjdCBmcm9tIGJyYW5kaW5nKSAtLT4NCiAgPGc+DQogICAgPCEtLSBHcmFkaWVudCBkZWZpbml0aW9ucyAtLT4NCiAgICA8ZGVmcz4NCiAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icHVycGxlR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOUQ0RUREO3N0b3Atb3BhY2l0eToxIiAvPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3MjA5Qjc7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imdsb3dHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjAuOCIgLz4NCiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNTAwO3N0b3Atb3BhY2l0eTowLjQiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8ZmlsdGVyIGlkPSJwcmVtaXVtU2hhZG93Ij4NCiAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9IjQiIHN0ZERldmlhdGlvbj0iNiIgZmxvb2Qtb3BhY2l0eT0iMC4zNSIvPg0KICAgICAgPC9maWx0ZXI+DQogICAgPC9kZWZzPg0KICAgIA0KICAgIDwhLS0gR29sZGVuIGdsb3cvaGFsbyBiZWhpbmQgaWNvbiAtLT4NCiAgICA8Y2lyY2xlIGN4PSIzNiIgY3k9IjM2IiByPSIzNCIgZmlsbD0idXJsKCNnbG93R3JhZGllbnQpIiBvcGFjaXR5PSIwLjUiLz4NCiAgICANCiAgICA8IS0tIE1haW4gcHVycGxlIHJvdW5kZWQtc3F1YXJlIGJhY2tncm91bmQgLS0+DQogICAgPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iMTYiIGZpbGw9InVybCgjcHVycGxlR3JhZGllbnQpIiBmaWx0ZXI9InVybCgjcHJlbWl1bVNoYWRvdykiLz4NCiAgICANCiAgICA8IS0tIENhbWVyYSBib2R5ICh3aGl0ZSBvdXRsaW5lIHN0eWxlKSAtLT4NCiAgICA8cmVjdCB4PSIxNiIgeT0iMjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgcng9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41Ii8+DQogICAgDQogICAgPCEtLSBDYW1lcmEgbGVucyAoY2lyY3VsYXIpIC0tPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjMuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNSIvPg0KICAgIA0KICAgIDwhLS0gTGlnaHRuaW5nIGJvbHQgYWNjZW50ICh0b3AgcmlnaHQpIC0tPg0KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2LCAxMCkiPg0KICAgICAgPCEtLSBNYWluIGxpZ2h0bmluZyBzaGFwZSAtLT4NCiAgICAgIDxwYXRoIGQ9Ik0gNiAwIEwgMiA2IEwgNiA2IEwgMCAxNCBMIDggOCBMIDQgOCBaIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiNGRjhBMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQogICAgICA8IS0tIElubmVyIGhpZ2hsaWdodCBmb3IgZGVwdGggLS0+DQogICAgICA8cGF0aCBkPSJNIDQgMSBMIDMgNCBMIDUgNCBMIDEgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRUIzQiIgc3Ryb2tlLXdpZHRoPSIwLjgiIG9wYWNpdHk9IjAuNyIvPg0KICAgIDwvZz4NCiAgICANCiAgICA8IS0tIEdvbGRlbiBzcGFya2xlIGFjY2VudHMgLS0+DQogICAgPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMS41IiBmaWxsPSIjRkZENzAwIiBvcGFjaXR5PSIwLjkiLz4NCiAgICA8Y2lyY2xlIGN4PSI1OCIgY3k9IjE4IiByPSIxLjUiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOCIvPg0KICAgIDxjaXJjbGUgY3g9IjE2IiBjeT0iNTYiIHI9IjEiIGZpbGw9IiNGRkIzMUEiIG9wYWNpdHk9IjAuNyIvPg0KICA8L2c+DQogIA0KICA8IS0tIEZMSU5YWCBUZXh0IC0tPg0KICA8dGV4dCB4PSI4MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0idXJsKCN0ZXh0R3JhZGllbnQpIiBsZXR0ZXItc3BhY2luZz0iMSI+DQogICAgRkxJTlhYDQogIDwvdGV4dD4NCiAgDQogIDwhLS0gVGV4dCBHcmFkaWVudCAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0ZXh0R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4NCiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQjMxQTtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOEEwMDtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQo8L3N2Zz4NCg==",_I=()=>{const n=ft(),[e,t]=A.useState(!1),r=()=>{t(!0),setTimeout(()=>{n("/login",{replace:!0})},500)};return l.jsxs("div",{className:"homepage-wrapper",children:[l.jsx("header",{className:"homepage-header",children:l.jsxs("div",{className:"header-content",children:[l.jsxs("div",{className:"header-left",children:[l.jsx("img",{src:vI,alt:"Flinxx",className:"logo"}),l.jsx("span",{className:"online-status",children:"🟢 3,247 online"})]}),l.jsx("button",{onClick:r,className:"btn-start-now",children:"Start Now"})]})}),l.jsx("section",{className:"hero-section",children:l.jsxs("div",{className:"hero-content",children:[l.jsxs("h1",{className:"hero-title",children:["Meet New People",l.jsx("br",{}),"Around the World"]}),l.jsx("p",{className:"hero-subtitle",children:"Connect instantly with strangers through video chat"}),l.jsx("button",{onClick:r,disabled:e,className:"btn-hero-cta",children:e?"⟳ Loading...":"Start Video Chat"}),l.jsx("p",{className:"hero-tagline",children:"Fast, simple video chats • Real users, real time"})]})}),l.jsx("section",{className:"features-section",children:l.jsx("div",{className:"features-container",children:l.jsx("div",{className:"feature-card",children:l.jsxs("div",{className:"card-content",children:[l.jsx("div",{className:"card-icon",children:"⚡"}),l.jsxs("div",{className:"card-text",children:[l.jsx("h3",{className:"card-title",children:"Instant Connection"}),l.jsx("p",{className:"card-description",children:"Connect with random strangers in seconds. No waiting, no hassle."})]})]})})})}),l.jsxs("button",{onClick:()=>window.location.href="/contact",className:"btn-contact-us",children:[l.jsx("span",{children:"💬"}),"Contact Us"]})]})};class wI extends Error{}wI.prototype.name="InvalidTokenError";const xi="data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3c!--%20Orange%20gradient%20background%20--%3e%3crect%20width='40'%20height='40'%20rx='8'%20fill='url(%23gradient)'%20/%3e%3c!--%20Video%20camera%20icon%20--%3e%3cg%20transform='translate(8,%208)'%3e%3c!--%20Camera%20body%20--%3e%3crect%20x='1'%20y='6'%20width='16'%20height='12'%20rx='1'%20fill='white'%20stroke='white'%20stroke-width='0.5'/%3e%3c!--%20Camera%20lens%20--%3e%3ccircle%20cx='17'%20cy='12'%20r='4'%20fill='none'%20stroke='white'%20stroke-width='1'/%3e%3ccircle%20cx='17'%20cy='12'%20r='2.5'%20fill='white'%20opacity='0.8'/%3e%3c!--%20Recording%20indicator%20dot%20--%3e%3ccircle%20cx='3'%20cy='3'%20r='1.5'%20fill='%23FF4444'/%3e%3c/g%3e%3c!--%20Gradient%20definition%20--%3e%3cdefs%3e%3clinearGradient%20id='gradient'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20style='stop-color:%23FF8C42;stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:%23FF6B35;stop-opacity:1'%20/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",II="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20width='24'%20height='24'%3e%3cpath%20fill='%234285F4'%20d='M22.56%2012.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26%201.37-1.04%202.53-2.21%203.31v2.77h3.57c2.08-1.92%203.28-4.74%203.28-8.09z'/%3e%3cpath%20fill='%2334A853'%20d='M12%2023c2.97%200%205.46-.98%207.28-2.66l-3.57-2.77c-.98.66-2.23%201.06-3.71%201.06-2.86%200-5.29-1.93-6.16-4.53H2.18v2.84C3.99%2020.53%207.7%2023%2012%2023z'/%3e%3cpath%20fill='%23FBBC05'%20d='M5.84%2014.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43%208.55%201%2010.22%201%2012s.43%203.45%201.18%204.93l2.85-2.22.81-.62z'/%3e%3cpath%20fill='%23EA4335'%20d='M12%205.38c1.62%200%203.06.56%204.21%201.64l3.15-3.15C17.45%202.09%2014.97%201%2012%201%207.7%201%203.99%203.47%202.18%207.07l3.66%202.84c.87-2.6%203.3-4.53%206.16-4.53z'/%3e%3c/svg%3e",td=({onContinue:n,onCancel:e})=>{A.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow="unset"}),[]),A.useEffect(()=>{const r=s=>{s.key==="Escape"&&s.preventDefault()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[]),A.useEffect(()=>{window.history.pushState(null,"",window.location.href);const r=s=>{s.preventDefault(),window.history.pushState(null,"",window.location.href)};return window.addEventListener("popstate",r),()=>window.removeEventListener("popstate",r)},[]);const t=()=>{localStorage.setItem("termsAccepted","true"),n==null||n()};return l.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",children:l.jsxs("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-6 text-center",children:"Before you continue"}),l.jsxs("p",{className:"text-gray-700 text-center text-sm",children:["By continuing, you confirm that you are 18 years or older and agree to Flinxx's"," ",l.jsx("a",{href:"/terms-and-conditions",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/terms-and-conditions"},children:"Terms & Conditions"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"}),"."]}),l.jsx("p",{className:"text-gray-700 text-center text-sm mt-4",children:"You understand that Flinxx is a live interaction platform and you use it at your own responsibility."}),l.jsxs("div",{className:"flex gap-4 mt-6",children:[l.jsx("button",{onClick:e,className:"flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors",children:"Decline"}),l.jsx("button",{onClick:t,className:"flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors",children:"Accept & Proceed"})]})]})})},nd=()=>{try{return localStorage.getItem("termsAccepted")==="true"}catch(n){return console.error("❌ Error checking terms acceptance:",n),!1}},bI=()=>{try{localStorage.setItem("termsAccepted","true"),console.log("✅ Terms accepted and saved to localStorage")}catch(n){console.error("❌ Error saving terms acceptance:",n)}},EI=({isSigningIn:n,onShowTermsModal:e})=>{const t=()=>{console.log("🔐 Google login clicked - checking terms acceptance"),nd()?(console.log("✅ Terms already accepted - proceeding with Google login"),r()):(console.log("⚠️ Terms not accepted - showing modal first"),e("google"))},r=()=>{const s="https://flinxx-backend.onrender.com";console.log("🔗 Redirecting to Google OAuth:",`${s}/auth/google`),window.location.href=`${s}/auth/google`};return l.jsxs("button",{onClick:t,disabled:n,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${n?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-white hover:bg-gray-50 text-black shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("img",{src:II,alt:"Google",className:"w-6 h-6"}),"Continue with Google"]})},xI=()=>{const n=ft(),[e,t]=A.useState(!1),[r,s]=A.useState(null),[o,a]=A.useState(!1),[u,h]=A.useState(null);A.useEffect(()=>{(async()=>{try{const k=await vw();k&&(console.log("✅ Login successful:",k.email),n("/chat"))}catch(k){console.error("❌ Login check failed:",k)}})()},[n]);const f=C=>{console.log(`📋 Showing Terms modal for ${C}`),h(C),a(!0)},y=()=>{console.log("❌ User cancelled terms modal"),a(!1),h(null)},b=async()=>{if(console.log("✅ User accepted terms"),bI(),a(!1),u==="google"){console.log("🔐 Proceeding with Google login after terms acceptance");const C="https://flinxx-backend.onrender.com";window.location.href=`${C}/auth/google`}else if(u==="facebook"){console.log("🔐 Proceeding with Facebook login after terms acceptance");try{await cc()}catch(C){console.error("❌ Facebook login error:",C),s("Facebook login failed. Please try again.")}}h(null)},x=async()=>{if(console.log("🔐 Facebook login clicked - checking terms acceptance"),nd()){console.log("✅ Terms already accepted - proceeding with Facebook login"),t(!0),s(null);try{console.log("📱 Starting Facebook login..."),console.log("Facebook App ID:","863917229498555"),console.log("Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler"),await cc()}catch(C){console.error("❌ Facebook login error:",C),s("Facebook login failed. Please try again."),t(!1)}}else console.log("⚠️ Terms not accepted - showing modal first"),f("facebook")};return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:[l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center mb-8",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-4",children:"Welcome to Flinxx"}),l.jsx("p",{className:"text-lg text-white/80",children:"Connect with strangers instantly"}),l.jsx("p",{className:"text-sm text-white/70 mt-2",children:"Sign up to get started"})]}),r&&l.jsx("div",{className:"mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg",children:l.jsx("p",{className:"text-red-200 text-sm",children:r})}),l.jsxs("div",{className:"space-y-4",children:[e&&l.jsxs("button",{disabled:!0,className:"w-full bg-gray-400 cursor-not-allowed text-gray-700 font-bold py-3 px-6 rounded-full transition-all text-lg flex items-center justify-center gap-2",children:[l.jsx("span",{className:"animate-spin",children:"⟳"})," Signing in..."]}),l.jsx(EI,{isSigningIn:e,onShowTermsModal:f}),l.jsxs("button",{onClick:x,disabled:e,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${e?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("span",{className:"text-xl",children:"f"})," Continue with Facebook"]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsxs("p",{className:"text-xs text-white/60",children:["By signing in, you agree to our"," ",l.jsx("a",{href:"/terms",className:"text-white/80 hover:text-white underline",onClick:C=>{C.preventDefault(),window.location.href="/terms"},children:"TERMS & CONDITIONS"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-white/80 hover:text-white underline",onClick:C=>{C.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"})]})}),l.jsxs("div",{className:"mt-10 flex flex-col items-center gap-3 text-white/80 text-sm",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"⚡"}),l.jsx("p",{children:"Instant connection with strangers"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"👤"}),l.jsx("p",{children:"100% Anonymous & Safe"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🎥"}),l.jsx("p",{children:"High-quality Video Chat"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🌍"}),l.jsx("p",{children:"Connect Worldwide"})]})]})]}),o&&l.jsx(td,{onCancel:y,onContinue:b})]})},rd=A.createContext(),TI=({children:n})=>{const[e,t]=A.useState(!1),[r,s]=A.useState("solo"),o=()=>{t(!0),s("duo")},a=()=>{t(!1),s("solo")},u=h=>{console.log(`🔄 [MODE CHANGE] Switching to ${h} mode`),console.log(`   Current activeMode before: ${r}`),s(h),h==="duo"?(console.log("Opening Duo Squad modal"),t(!0)):h==="solo"&&(console.log("Closing Duo Squad modal"),t(!1)),console.log(`   activeMode will update to: ${h}`)};return l.jsx(rd.Provider,{value:{isDuoSquadOpen:e,setIsDuoSquadOpen:t,activeMode:r,setActiveMode:s,openDuoSquad:o,closeDuoSquad:a,handleModeChange:u},children:n})},sd=()=>{const n=A.useContext(rd);if(!n)throw new Error("useDuoSquad must be used within DuoSquadProvider");return n},AI=()=>{console.log(`
🧊 ═══════════════════════════════════════════════════════════════`),console.log("🧊 [ICE SERVERS CONFIGURATION]"),console.log("🧊 ═══════════════════════════════════════════════════════════════"),console.log("🧊 STUN Server:"),console.log("🧊   - stun:global.xirsys.net"),console.log("🧊     Purpose: NAT detection, find public IP"),console.log("🧊     Status: Should work on all networks"),console.log("🧊 "),console.log("🧊 TURN Servers (for relaying if P2P blocked):"),console.log("🧊   - turn:global.xirsys.net:3478?transport=udp"),console.log("🧊     Status: Blocked if ISP blocks UDP port 3478"),console.log("🧊   - turn:global.xirsys.net:3478?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TCP port 3478"),console.log("🧊   - turns:global.xirsys.net:5349?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TLS port 5349"),console.log("🧊 "),console.log("🧊 Credentials:"),console.log("🧊   - Username: nkhlydv"),console.log("🧊   - Credential: a8e244b8-cf5b-11f0-8771-0242ac140002"),console.log("🧊 "),console.log("🧊 If all TURN candidates fail with error 701:"),console.log("🧊   ✓ Configuration is CORRECT"),console.log("🧊   ✓ STUN works (can find your IP)"),console.log("🧊   ✗ ISP/Network is blocking TURN ports"),console.log("🧊   → Try VPN or different network to test"),console.log(`🧊 ═══════════════════════════════════════════════════════════════
`)},CI=()=>[{urls:["stun:global.xirsys.net"]},{urls:["turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp","turns:global.xirsys.net:5349?transport=tcp"],username:"nkhlydv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"}],SI=n=>{const e=Math.floor(n/3600),t=Math.floor(n%3600/60),r=n%60;return e>0?`${e}h ${t}m ${r}s`:t>0?`${t}m ${r}s`:`${r}s`},RI=({isOpen:n,onClose:e})=>{const[t,r]=A.useState("flex"),[s,o]=A.useState("lite");if(!n)return null;const a=[{id:"lite",name:"LITE",emoji:"✨",price:"₹69",duration:"1 Day",features:["Unlimited Filters","Gender Filter: 50/day","10 Match Preferences","Ads Enabled","No Boost"]},{id:"prime",name:"PRIME",emoji:"👑",price:"₹199",duration:"15 Days",features:["Unlimited Filters","Gender Filter: 150/day","Full Match Preferences","No Ads","2x Profile Boost","Priority Match Queue"]},{id:"ultra",name:"ULTRA",emoji:"💎",price:"₹399",duration:"30 Days",features:["Unlimited Filters","Unlimited Gender Filter","Full Match Preferences","No Ads","5x Profile Boost","Ultra Priority Queue","Ultra Badge","Double Visibility"]}],u=[{id:"blue-tick",name:"Blue Tick",emoji:"✓",price:"₹69",features:["Verification badge","Trust boost","Status indicator"]},{id:"chat-themes",name:"Chat Themes",emoji:"🎨",price:"₹49",features:["Unlock themes","Custom colors","Personal style"]},{id:"match-boost",name:"Match Boost",emoji:"⚡",price:"₹39",features:["30 min visibility boost","Increased reach","More matches"]},{id:"profile-ring",name:"Profile Ring",emoji:"💍",price:"₹79",features:["Colored profile ring","Stand out","Eye-catching design"]},{id:"profile-highlight",name:"Profile Highlight",emoji:"⭐",price:"₹99",features:["24h highlight","Top search visibility","Premium placement"]}];return a.find(h=>h.id===s),l.jsx("div",{className:"premium-overlay",onClick:e,children:l.jsxs("div",{className:"premium-box",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"close-btn",onClick:e,children:"✖"}),l.jsx("h2",{className:"premium-title",children:"Flinxx Subscriptions"}),l.jsxs("div",{className:"main-tabs-container",children:[!1,l.jsx("button",{className:`main-tab ${t==="flex"?"active":""}`,onClick:()=>r("flex"),children:"Flex Plans"})]}),!1,t==="flex"&&l.jsxs("div",{className:"tab-content",children:[l.jsx("p",{className:"flex-subtitle",children:"Choose individual features"}),l.jsx("div",{className:"flex-section flex-wrapper",children:l.jsx("div",{className:"flex-plans-box",children:l.jsx("div",{className:"flex-plans-container",children:u.map(h=>l.jsxs("div",{className:"flex-card",children:[l.jsxs("div",{className:"flex-item-header",children:[l.jsx("span",{className:"flex-emoji",children:h.emoji}),l.jsx("h4",{children:h.name})]}),l.jsx("div",{className:"flex-item-price",children:h.price}),l.jsx("ul",{className:"flex-item-features",children:h.features.map((f,y)=>l.jsxs("li",{children:[l.jsx("span",{className:"flex-check",children:"•"}),l.jsx("span",{children:f})]},y))}),l.jsx("button",{className:"flex-item-btn",children:"Add Now"})]},h.id))})})})]}),l.jsx("div",{className:"premium-footer",children:l.jsx("p",{children:"Recurring billing. Cancel anytime. No hidden charges."})})]})})},NI=({isOpen:n,onClose:e,currentGender:t="both",onOpenPremium:r})=>{const[s,o]=A.useState(t);if(!n)return null;const a=()=>{console.log("Gender filter saved:",s),e()},u=()=>{console.log("Join clicked - opening premium modal"),r(),e()};return l.jsx("div",{className:"gender-filter-overlay",onClick:e,children:l.jsxs("div",{className:"gender-filter-modal",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"gender-close-btn",onClick:e,children:"✖"}),l.jsxs("div",{className:"gender-premium-section",children:[l.jsx("div",{className:"premium-icon",children:"👑"}),l.jsxs("div",{className:"premium-content",children:[l.jsx("h3",{children:"Flinxx Prime"}),l.jsx("p",{children:"Get More Gender Filters"})]}),l.jsx("button",{className:"join-btn",onClick:u,children:"Join"})]}),l.jsxs("div",{className:"gender-section",children:[l.jsx("div",{className:"gender-icon",children:"👥"}),l.jsx("h2",{children:"Gender"}),l.jsxs("div",{className:"gender-options",children:[l.jsxs("button",{className:`gender-option ${s==="girls"?"selected":""}`,onClick:()=>o("girls"),children:[l.jsx("div",{className:"gender-emoji",children:"👧"}),l.jsx("div",{className:"gender-label",children:"Girls Only"})]}),l.jsxs("button",{className:`gender-option ${s==="guys"?"selected":""}`,onClick:()=>o("guys"),children:[l.jsx("div",{className:"gender-emoji",children:"👦"}),l.jsx("div",{className:"gender-label",children:"Guys Only"})]}),!1]})]}),l.jsxs("div",{className:"gender-footer",children:[l.jsx("button",{className:"save-btn",onClick:a,children:"Save"}),l.jsx("button",{className:"filter-btn",children:"🔽"})]})]})})},kI=({isOpen:n,onClose:e,onOpenPremium:t,onReinitializeCamera:r})=>{const s=ft(),{user:o}=A.useContext(Lt)||{},[a,u]=A.useState(!1),[h,f]=A.useState({id:"",name:"",email:"",picture:"",googleId:"",location:"",gender:"",birthday:"",birthdayRaw:"",tokens:0,gems:0}),[y,b]=A.useState(!1),[x,C]=A.useState(null),[k,S]=A.useState(!1),N=m=>{m&&(navigator.clipboard.writeText(m),S(!0),setTimeout(()=>S(!1),2e3))};A.useEffect(()=>{n&&o&&U()},[n,o]),A.useEffect(()=>{!x&&n&&G()},[n]);const G=async()=>{try{navigator.geolocation?navigator.geolocation.getCurrentPosition(async m=>{var w,E,v;const{latitude:g,longitude:_}=m.coords;try{const _e=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${g}&lon=${_}`)).json(),Y=((w=_e.address)==null?void 0:w.city)||((E=_e.address)==null?void 0:E.town)||"Unknown",ge=((v=_e.address)==null?void 0:v.country)||"Unknown";C(`${Y}, ${ge}`),f(je=>({...je,location:`${Y}, ${ge}`}))}catch(X){console.log("Reverse geocoding error:",X)}},m=>{console.log("Geolocation error:",m),W()}):W()}catch(m){console.log("Location detection error:",m)}},W=async()=>{try{const g=await(await fetch("https://ipapi.co/json/")).json(),_=`${g.city}, ${g.country_name}`;C(_),f(w=>({...w,location:_}))}catch(m){console.log("IP API error:",m)}},U=async()=>{var m,g,_;if(o){console.log("USER PROFILE DATA:",o);try{console.log("[ProfileModal] Setting initial data from context user:",{id:o.id,uuid:o.uuid,publicId:o.publicId,gender:o.gender,birthday:o.birthday});let w="",E=o.birthday||"Not set";if(o.birthday)try{const X=new Date(o.birthday);isNaN(X.getTime())||(w=X.toISOString().split("T")[0],E=X.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(X){console.error("[ProfileModal] Error formatting context birthday:",X)}f(X=>({...X,id:o.publicId||o.id||o.uuid||"",name:o.name||"User",email:o.email||"",picture:o.picture||"",googleId:o.googleId||"",gender:o.gender?o.gender.toLowerCase():"Not set",birthday:E,birthdayRaw:w}));const v=localStorage.getItem("token");if(v){console.log("[ProfileModal] Fetching fresh user profile from backend"),console.log("[ProfileModal] Token present: YES");const _e=await fetch("https://flinxx-backend.onrender.com/api/profile",{method:"GET",headers:{Authorization:`Bearer ${v}`,"Content-Type":"application/json"}});if(console.log("[ProfileModal] API Response status:",_e.status),_e.ok){const Y=await _e.json();if(console.log("[ProfileModal] ✅ Fetched profile data from backend:",Y),console.log("[ProfileModal] User gender:",(m=Y.user)==null?void 0:m.gender),console.log("[ProfileModal] User birthday:",(g=Y.user)==null?void 0:g.birthday),console.log("[ProfileModal] User publicId:",(_=Y.user)==null?void 0:_.publicId),console.log("[ProfileModal] Full user object:",Y.user),Y.success&&Y.user){let ge="",je="Not set";if(Y.user.birthday)try{const Xe=new Date(Y.user.birthday);isNaN(Xe.getTime())?(ge=Y.user.birthday,je=Y.user.birthday):(ge=Xe.toISOString().split("T")[0],je=Xe.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(Xe){console.error("[ProfileModal] Error formatting birthday:",Xe),ge=Y.user.birthday,je=Y.user.birthday}const pt=Y.user.gender?Y.user.gender.toLowerCase():"Not set";console.log("[ProfileModal] Setting profile data with:",{gender:pt,birthday:je,birthdayRaw:ge,publicId:Y.user.publicId,uuid:Y.user.uuid}),f(Xe=>({...Xe,id:Y.user.publicId||Y.user.uuid||Y.user.id||Y.user.userId||"",name:Y.user.name||"User",email:Y.user.email||"",picture:Y.user.picture||"",googleId:Y.user.googleId||"",gender:pt,birthday:je,birthdayRaw:ge}))}}else{console.warn("[ProfileModal] ⚠️ Failed to fetch profile from backend:",_e.status);const Y=await _e.text();console.log("[ProfileModal] Response text:",Y)}}else console.log("[ProfileModal] ⚠️ No token found in localStorage")}catch(w){console.error("[ProfileModal] ❌ Error loading user profile:",w)}}},B=m=>{const{name:g,value:_}=m.target;if(g==="birthday"){let w="Not set";if(_)try{const E=new Date(_+"T00:00:00Z");isNaN(E.getTime())||(w=E.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(E){console.error("[ProfileModal] Error formatting date:",E)}f(E=>({...E,birthdayRaw:_,birthday:w}))}else f(w=>({...w,[g]:_}))},fe=m=>{var _;const g=(_=m.target.files)==null?void 0:_[0];if(g){const w=new FileReader;w.onloadend=()=>{f(E=>({...E,picture:w.result}))},w.readAsDataURL(g)}},M=async()=>{b(!0);try{console.log("[PROFILE SAVE] Starting profile save process"),console.log("[PROFILE SAVE] Profile data:",h);const m=(o==null?void 0:o.id)||(o==null?void 0:o.uuid)||(o==null?void 0:o.googleId)||localStorage.getItem("userId");if(console.log("[PROFILE SAVE] User ID:",m),!m){console.error("[PROFILE SAVE] Error: No user ID found"),alert("Error: User ID not found. Please login again."),b(!1);return}const g=h.birthdayRaw||new Date().toISOString().split("T")[0],_=h.gender&&h.gender!=="Not set"?h.gender:"",w={userId:m,birthday:g,gender:_};console.log("[PROFILE SAVE] Request body:",JSON.stringify(w)),console.log("[PROFILE SAVE] Required fields check:"),console.log("  - userId:",!!w.userId),console.log("  - birthday:",!!w.birthday),console.log("  - gender:",!!w.gender);const E=localStorage.getItem("token");console.log("[PROFILE SAVE] Token present:",!!E),E||console.warn("[PROFILE SAVE] Warning: No auth token found");const v="https://flinxx-backend.onrender.com";console.log("[PROFILE SAVE] Backend URL:",v),console.log("[PROFILE SAVE] Making API call to /api/users/complete-profile");const X=await fetch(`${v}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json",...E&&{Authorization:`Bearer ${E}`}},body:JSON.stringify(w)});if(console.log("[PROFILE SAVE] Response status:",X.status),!X.ok){const Y=await X.json();console.error("[PROFILE SAVE] Error response:",Y),alert(`Failed to save profile: ${Y.error||"Unknown error"}`),b(!1);return}const _e=await X.json();console.log("[PROFILE SAVE] ✅ Profile saved successfully:",_e),localStorage.setItem("userProfile",JSON.stringify(w)),u(!1),console.log("[PROFILE SAVE] Profile saved successfully"),console.log("[PROFILE SAVE] Closing ProfileModal..."),e(),alert("Profile updated successfully!"),console.log("🎥 [ProfileModal] Scheduling camera re-init with 500ms delay to allow modal unmount"),typeof r=="function"?setTimeout(()=>{console.log(`
🎥 [ProfileModal] 500ms delay complete, reinitializing camera now`),console.log("🎥 [ProfileModal] Calling onReinitializeCamera()"),r().then(Y=>{Y?console.log("🎥 [ProfileModal] ✅ Camera reinitialized successfully after profile save"):console.warn("🎥 [ProfileModal] ⚠️ Camera reinitialization returned false")}).catch(Y=>{console.error("🎥 [ProfileModal] ❌ Error calling reinitializeCamera:",Y)})},500):console.warn("🎥 [ProfileModal] ⚠️ onReinitializeCamera callback not provided")}catch(m){console.error("[PROFILE SAVE] Error:",m),console.error("[PROFILE SAVE] Error message:",m.message),console.error("[PROFILE SAVE] Error stack:",m.stack),alert("Failed to save profile: "+m.message)}finally{b(!1)}},I=async()=>{try{await im(Wr),localStorage.removeItem("userInfo"),localStorage.removeItem("userProfile"),s("/login",{replace:!0})}catch(m){console.error("Sign out error:",m)}};return n?l.jsx("div",{className:"profile-modal-overlay",onClick:e,children:l.jsxs("div",{className:"profile-modal-container",onClick:m=>m.stopPropagation(),children:[l.jsx("button",{className:"profile-modal-close",onClick:e,children:"✕"}),l.jsxs("div",{className:"profile-header",children:[l.jsxs("div",{className:"profile-picture-container",children:[l.jsx("img",{src:h.picture||"https://via.placeholder.com/120",alt:"Profile",className:"profile-picture"}),a&&l.jsxs("label",{className:"photo-upload-label",children:[l.jsx("input",{type:"file",accept:"image/*",onChange:fe,style:{display:"none"}}),"📷"]})]}),a?l.jsx("input",{type:"text",name:"name",value:h.name,onChange:B,className:"profile-input-name",placeholder:"Name"}):l.jsx("h2",{className:"profile-name",children:h.name}),l.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginTop:"6px",opacity:.8},children:[l.jsxs("span",{children:["ID: ",h.id||"N/A"]}),h.id&&l.jsx("button",{onClick:()=>N(h.id),style:{background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center"},title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{className:"profile-premium-section",onClick:t,style:{cursor:"pointer"},children:[l.jsx("div",{className:"premium-badge",children:"⭐ Flinxx Premium"}),l.jsx("p",{className:"premium-description",children:"Unlock premium features"})]}),l.jsx("div",{className:"profile-details",children:a?l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("input",{type:"text",name:"location",value:h.location,onChange:B,className:"profile-input-small"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsxs("select",{name:"gender",value:h.gender,onChange:B,className:"profile-input-small",children:[l.jsx("option",{value:"",children:"Select"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"}),l.jsx("option",{value:"other",children:"Other"})]})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("input",{type:"date",name:"birthday",value:h.birthdayRaw||"",onChange:B,className:"profile-input-small text-black focus:text-black !text-black [&::-webkit-datetime-edit]:text-black [&::-webkit-datetime-edit-year-field]:text-black [&::-webkit-datetime-edit-month-field]:text-black [&::-webkit-datetime-edit-day-field]:text-black"})]}),l.jsx("button",{className:"btn-save",onClick:M,disabled:y,children:y?"Saving...":"Save Changes"}),l.jsx("button",{className:"btn-cancel",onClick:()=>{u(!1),U()},children:"Cancel"})]}):l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("span",{className:"detail-value",children:h.location||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsx("span",{className:"detail-value",children:h.gender||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("span",{className:"detail-value",children:h.birthday||"Not set"})]})]})}),l.jsx("button",{className:"btn-sign-out",onClick:I,children:"Sign Out"})]})}):null},PI=({isOpen:n,onClose:e})=>{const[t,r]=A.useState([{id:1,username:"Up ke 😊",name:"Up ke",location:"National Capital Territory of Delhi",duration:"00:05",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:2,username:"Loup 😊",name:"Loup",location:"Algeria",duration:"00:06",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:3,username:"Nish 😊",name:"Nish",location:"Maharashtra",duration:"00:04",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:4,username:"Priya 😊",name:"Priya",location:"Gujarat",duration:"00:02",date:"11/27/2025",time:"9:23PM",avatar:"M",liked:!1},{id:5,username:"pagbigyamnmako 😊",name:"pagbigyamnmako",location:"Philippines",duration:"00:08",date:"11/27/2025",time:"9:23PM",avatar:"😊",liked:!1}]),s=a=>{r(t.map(u=>u.id===a?{...u,liked:!u.liked}:u))},o=a=>{r(t.filter(u=>u.id!==a))};return n?l.jsx("div",{className:"match-history-overlay",onClick:e,children:l.jsxs("div",{className:"match-history-container",onClick:a=>a.stopPropagation(),children:[l.jsxs("div",{className:"match-history-header",children:[l.jsx("h2",{children:"Match History"}),l.jsx("button",{className:"match-history-close",onClick:e,children:"✕"})]}),l.jsx("div",{className:"match-history-list",children:t.length===0?l.jsxs("div",{className:"match-history-empty",children:[l.jsx("p",{children:"No match history yet"}),l.jsx("p",{className:"match-history-empty-sub",children:"Start video chatting to build your history!"})]}):t.map(a=>l.jsxs("div",{className:"match-card",children:[l.jsxs("div",{className:"match-card-date",children:[l.jsxs("div",{className:"match-card-datetime",children:[l.jsx("span",{className:"match-date",children:a.date}),l.jsx("span",{className:"match-time",children:a.time})]}),l.jsxs("div",{className:"match-duration",children:["⏱️ ",a.duration]})]}),l.jsxs("div",{className:"match-card-user",children:[l.jsx("div",{className:"match-card-avatar",children:a.avatar==="M"?l.jsx("div",{className:"avatar-initial",children:"M"}):l.jsx("span",{children:a.avatar})}),l.jsxs("div",{className:"match-card-info",children:[l.jsx("p",{className:"match-card-name",children:a.name}),l.jsxs("p",{className:"match-card-location",children:["📍 ",a.location]})]})]}),l.jsxs("div",{className:"match-card-actions",children:[l.jsx("button",{className:`action-btn like-btn ${a.liked?"liked":""}`,onClick:()=>s(a.id),title:"Like this match",children:"❤️"}),l.jsx("button",{className:"action-btn delete-btn",onClick:()=>o(a.id),title:"Delete from history",children:"🗑️"})]})]},a.id))})]})}):null},Ao=({friend:n,onBack:e,onMessageSent:t})=>{var x;const{user:r}=A.useContext(Lt)||{},{refetchUnreadCount:s}=ga(),[o,a]=A.useState([]),[u,h]=A.useState(""),f=r==null?void 0:r.uuid;if(!f||typeof f!="string"||f.length!==36)return console.warn("⛔ ChatBox: Invalid my UUID, blocking render:",f==null?void 0:f.length),null;if(!(n!=null&&n.id)||typeof n.id!="string"||n.id.length!==36)return console.warn("⛔ ChatBox: Invalid friend UUID, blocking render:",(x=n==null?void 0:n.id)==null?void 0:x.length),null;A.useEffect(()=>{if(!f||!n)return;const C=n.id,k=f<C?`${f}_${C}`:`${C}_${f}`;console.log(`📍 Joining chat room: ${k}`),console.log(`   My UUID: ${f}`),console.log(`   Friend UUID: ${C}`),K.emit("join_chat",{senderId:f,receiverId:n.id})},[n,f]),A.useEffect(()=>{if(!f||!(n!=null&&n.id))return;(async()=>{try{const k=n.id,S=f<k?`${f}_${k}`:`${k}_${f}`,N=await jr(S);N!=null&&N.success&&(console.log("✅ Messages from",n.display_name,"marked as read (chatId)",S),await s())}catch(k){console.error("❌ Error marking messages as read:",k)}})()},[n==null?void 0:n.id,f,s]),A.useEffect(()=>{if(!f||!(n!=null&&n.id)){console.log("⏳ ChatBox: Waiting for myUserId or friend.id",{myUserId:f,friendId:n==null?void 0:n.id});return}console.log("📨 ChatBox: Loading messages for friend:",{myUserId:f,friendId:n.id,friendName:n.display_name});const k=`https://flinxx-backend.onrender.com/api/messages?user1=${f}&user2=${n.id}`;console.log("📨 Fetching chat history from:",k),fetch(k).then(S=>{if(console.log("📨 Response status:",S.status),!S.ok)throw new Error(`HTTP ${S.status}`);return S.json()}).then(S=>{console.log("📨 Messages loaded:",S.length,"messages"),Array.isArray(S)&&a(S.map(N=>({me:N.sender_id===f,text:N.message})))}).catch(S=>{console.error("❌ Failed to load chat history:",S)})},[f,n]);const y=()=>{if(!u.trim())return;const C=new Date().toISOString();K.emit("send_message",{senderId:f,receiverId:n.id,message:u,created_at:C}),h(""),t&&t(n.id,C)};A.useEffect(()=>{const C=k=>{if(a(S=>[...S,{me:k.senderId===f,text:k.message}]),t&&k.senderId!==f){const S=k.created_at||new Date().toISOString();t(n.id,S)}};return K.on("receive_message",C),()=>K.off("receive_message",C)},[f,n,t]);const b=C=>{C.key==="Enter"&&!C.shiftKey&&(C.preventDefault(),y())};return l.jsxs("div",{className:"chat-box",children:[l.jsxs("div",{className:"chat-header",children:[l.jsx("button",{onClick:e,children:"←"}),l.jsx("img",{src:n.photo_url,alt:n.display_name}),l.jsx("span",{children:n.display_name})]}),l.jsxs("div",{className:"chat-body",children:[o.length===0&&l.jsxs("p",{className:"empty",children:["Start a conversation with ",n.display_name]}),o.map((C,k)=>l.jsx("div",{className:`bubble ${C.me?"me":""}`,children:C.text},k))]}),l.jsxs("div",{className:"chat-input",children:[l.jsx("input",{value:u,onChange:C=>h(C.target.value),onKeyPress:b,placeholder:"Type a message…"}),l.jsx("button",{onClick:y,children:"➤"})]})]})},jI=({isOpen:n,onClose:e,onUserSelect:t,mode:r="search"})=>{const{markAsRead:s}=A.useContext(ua)||{},{user:o,notifications:a,refreshNotifications:u}=A.useContext(Lt)||{},{setUnreadCount:h,refetchUnreadCount:f}=ga(),[y,b]=A.useState(""),[x,C]=A.useState(""),[k,S]=A.useState(!1),[N,G]=A.useState({}),[W,U]=A.useState(null),[B,fe]=A.useState(null),[M,I]=A.useState([]),[m,g]=A.useState(null),_=r==="notifications",w=r==="message",E=r==="likes",v="https://flinxx-backend.onrender.com",X=async()=>{try{const j=await fetch(`${v}/api/profile`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!j.ok)return null;const q=await j.json();if(q!=null&&q.user){const te={...q.user,publicId:q.user.public_id};return localStorage.setItem("user",JSON.stringify(te)),te}return null}catch(j){return console.error("Failed to ensure current user",j),null}},_e=()=>{try{const j=JSON.parse(localStorage.getItem("user"));return j?{...j,publicId:j.publicId||j.public_id||j.id}:null}catch{return null}},Y=async j=>{try{const q=_e();if(!q||!q.id){console.warn("Current user not available for status check");return}const te=await fetch(`${v}/api/friends/status?senderPublicId=${q.id}&receiverPublicId=${j}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(te.ok){const Oe=await te.json();G(be=>({...be,[j]:Oe.status}))}}catch(q){console.error("Error checking friend status:",q)}};A.useEffect(()=>{n&&X()},[n]),A.useEffect(()=>{n&&o!=null&&o.uuid&&o.uuid.length===36&&(console.log("📨 Loading friends for message mode"),Fh(o.uuid).then(j=>{const q=Array.isArray(j)?j.sort((te,Oe)=>{const be=te.last_message_at?new Date(te.last_message_at):new Date(0);return(Oe.last_message_at?new Date(Oe.last_message_at):new Date(0))-be}):[];I(q)}).catch(j=>{console.error("❌ Error loading friends:",j),I([])}))},[n,o==null?void 0:o.uuid]),A.useEffect(()=>{n&&_&&o!=null&&o.uuid&&o.uuid.length===36&&u&&(console.log("🔄 Refreshing notifications when panel opens"),u())},[n,_,o==null?void 0:o.uuid,u]);const ge=a||[],je=(j,q)=>{I(te=>te.map(be=>be.id===j?{...be,last_message_at:q}:be).sort((be,Tt)=>{const Mt=be.last_message_at?new Date(be.last_message_at):new Date(0);return(Tt.last_message_at?new Date(Tt.last_message_at):new Date(0))-Mt}))},pt=async j=>{j!=null&&j.id&&(o!=null&&o.uuid)&&o.uuid.length===36&&(await jr(o.uuid,j.id),I(q=>q.map(te=>te.id===j.id?{...te,unreadCount:0}:te)),await f()),s&&j.id&&s(j.id),h(q=>Math.max(q-1,0)),g(j)};if(!n)return null;const Xe=async j=>{if(!(!j||typeof j!="string")){if(b(j),!j.trim()){C([]);return}S(!0);try{const q=await fetch(`${v}/api/search-user?q=${encodeURIComponent(j)}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!q.ok){console.error("Search error:",q.status),C([]);return}const te=await q.json();C(Array.isArray(te)?te:[]),Array.isArray(te)&&te.forEach(Oe=>{Y(Oe.publicId)})}catch(q){console.error("Search error:",q),C([])}finally{S(!1)}}},jn=j=>{const q=N[j];return q==="pending"?"SENT":q==="accepted"?"MESSAGE":"FRIEND"},rt=j=>{const q=N[j];return q==="pending"?"⏳":q==="accepted"?"💬":"🤝"},ke=async j=>{const q=N[j];if(q==="pending"||q==="accepted"){console.log("Friend request already sent or accepted");return}U(j);try{const te=_e();if(!(te!=null&&te.id)){console.error("Current user id not found",te);return}(await fetch(`${v}/api/friends/send`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({senderPublicId:String(te.id),receiverPublicId:String(j)})})).ok?(G(be=>({...be,[j]:"pending"})),console.log("Friend request sent to:",j),u&&u()):console.error("Failed to send friend request")}catch(te){console.error("Error sending friend request:",te)}finally{U(null)}},es=async(j,q)=>{try{(await fetch(`${v}/api/friends/accept`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({requestId:j})})).ok&&(G(Oe=>({...Oe,[q]:"accepted"})),setPendingRequests(Oe=>Oe.map(be=>be.id===j?{...be,status:"accepted"}:be)),console.log("Friend request accepted"),u&&u())}catch(te){console.error("Error accepting request:",te)}},Yt=async j=>{try{(await fetch(`${v}/api/friends/reject`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({requestId:j})})).ok&&(setPendingRequests(te=>te.filter(Oe=>Oe.id!==j)),console.log("Friend request rejected"),u&&u())}catch(q){console.error("Error rejecting request:",q)}};return l.jsx("div",{className:"search-friends-overlay",onClick:e,children:l.jsxs("div",{className:"search-friends-modal",onClick:j=>j.stopPropagation(),children:[l.jsxs("div",{className:"search-friends-header",children:[l.jsx("h2",{children:w?"Messages":_?"Friend Requests":E?"❤️ Friends & Requests":"Search Friends"}),l.jsx("button",{className:"search-close-btn",onClick:e,children:"✖"})]}),!_&&!w&&!E&&l.jsxs("div",{className:"search-input-container",children:[l.jsx("input",{type:"text",placeholder:"Search a friend by ID",value:y,onChange:j=>Xe(j.target.value),className:"search-input",autoFocus:!0}),l.jsx("span",{className:"search-icon",children:"🔍"})]}),!_&&!w&&!E&&l.jsx("div",{className:"search-results",children:x.length===0?l.jsx("div",{className:"search-empty-state",children:l.jsx("p",{style:{textAlign:"center",color:"rgba(255, 255, 255, 0.6)",marginTop:"40px"},children:y?"No users found":""})}):x.map((j,q)=>l.jsxs("div",{className:"search-result-item",onClick:()=>{t&&t(j),e()},children:[l.jsx("div",{className:"result-avatar",children:j.avatar&&j.avatar.startsWith("http")?l.jsx("img",{src:j.avatar,alt:"avatar",style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsxs("div",{className:"result-name-row",children:[l.jsx("p",{className:"result-name",children:j.name}),l.jsxs("button",{className:"friend-badge-btn",title:"Send Friend Request",disabled:N[j.publicId]==="pending",onClick:te=>{te.stopPropagation(),ke(j.publicId)},children:[l.jsx("span",{className:"friend-emoji","aria-hidden":"true",children:rt(j.publicId)}),l.jsx("span",{className:"friend-text",children:jn(j.publicId)})]})]}),l.jsx("p",{className:"tap-to-chat",children:N[j.publicId]==="accepted"&&j.unreadCount>0?"New message":"Tap to chat"})]})]},`user-${j.shortId}-${q}`))}),_&&l.jsx("div",{className:"search-results",children:m?l.jsx(Ao,{friend:m,onBack:()=>g(null),onMessageSent:je}):notificationsLoading?l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"40px"},children:"Loading notifications..."}):ge.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No notifications"}):ge.map(j=>l.jsxs("div",{className:"notification-item",children:[l.jsx("div",{className:"notification-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name}):l.jsx("div",{className:"text-avatar",children:j.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:j.display_name})}),j.status==="accepted"&&l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:async()=>{o!=null&&o.uuid&&o.uuid.length===36&&j.user_id&&await jr(o.uuid,j.user_id),s&&j.user_id&&s(j.user_id);const q={...j,id:j.user_id};console.log("Opening chat from notification:",q),g(q)},children:"Message"})})]},j.id))}),w&&l.jsx("div",{className:"message-panel-body",children:m?l.jsx(Ao,{friend:m,onBack:()=>g(null),onMessageSent:je}):l.jsx("div",{className:"search-results",children:M.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No friends yet"}):M.map(j=>l.jsxs("div",{className:"search-result-item friend-row",onClick:()=>pt(j),children:[l.jsx("div",{className:"result-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name,style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsx("p",{className:"result-name",children:j.display_name}),l.jsx("p",{className:"tap-to-chat",children:j.unreadCount>0?"New message":"Tap to chat"})]})]},j.id))})}),E&&l.jsx("div",{className:"message-panel-body",children:l.jsxs("div",{className:"search-results",children:[ge&&ge.length>0&&l.jsxs("div",{style:{marginBottom:"20px"},children:[l.jsxs("h3",{style:{color:"#fff",fontSize:"14px",fontWeight:"600",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.1)"},children:["📬 ",ge.length," Friend Request",ge.length!==1?"s":""]}),ge.map(j=>{var q;return l.jsxs("div",{className:"notification-item",style:{marginTop:"10px"},children:[l.jsx("div",{className:"notification-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name}):l.jsx("div",{className:"text-avatar",children:((q=j.display_name)==null?void 0:q.charAt(0).toUpperCase())||"?"})}),l.jsxs("div",{className:"notification-text",children:[l.jsx("strong",{children:j.display_name}),j.status!=="accepted"&&l.jsx("p",{style:{fontSize:"12px",color:"rgba(255,255,255,0.5)"},children:j.status==="pending"?"Pending":"Request received"})]}),j.status!=="accepted"&&l.jsxs("div",{style:{display:"flex",gap:"8px"},children:[l.jsx("button",{onClick:()=>es(j.id,j.sender_id),style:{padding:"6px 12px",background:"#10b981",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Accept"}),l.jsx("button",{onClick:()=>Yt(j.id),style:{padding:"6px 12px",background:"#ef4444",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Decline"})]}),j.status==="accepted"&&l.jsx("button",{className:"message-btn",onClick:async()=>{o!=null&&o.uuid&&o.uuid.length===36&&j.user_id&&await jr(o.uuid,j.user_id),s&&j.user_id&&s(j.user_id);const te={...j,id:j.user_id};g(te)},children:"Message"})]},j.id)})]}),(!ge||ge.length===0)&&l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px",padding:"20px"},children:"No friend requests yet"})]})})]})})},OI=({onClose:n})=>{const[e,t]=A.useState("flex"),o=e==="flex"?[{id:1,emoji:"✔️",name:"Blue Tick",price:"₹69",features:["Verified badge","Stand out in search","Premium status"]},{id:2,emoji:"🎨",name:"Chat Themes",price:"₹49",features:["Custom chat colors","5 premium themes","Personalize chats"]},{id:3,emoji:"⚡",name:"Match Boost",price:"₹39",features:["Boost visibility","10 boost credits","More matches"]},{id:4,emoji:"💍",name:"Profile Ring",price:"₹79",features:["Animated profile ring","Gold border effect","Premium look"]},{id:5,emoji:"✨",name:"Profile Highlight",price:"₹99",features:["Featured profile","Top visibility","Extended duration"]}]:[{id:1,emoji:"👑",name:"Premium Basic",price:"₹299/mo",features:["All Blue Tick benefits","Basic theme access","Monthly boost"]},{id:2,emoji:"💎",name:"Premium Plus",price:"₹599/mo",features:["All Premium Basic","All themes","Weekly boost"]},{id:3,emoji:"🌟",name:"Premium Elite",price:"₹999/mo",features:["Everything included","Priority support","Daily boost"]}];return l.jsxs("div",{className:"subscriptions-page",children:[l.jsx("button",{className:"subscriptions-close-btn",onClick:n,title:"Close",children:"✖"}),l.jsxs("div",{className:"subscriptions-container",children:[l.jsx("h1",{className:"subscriptions-title",children:"Flinxx Subscriptions"}),l.jsxs("div",{className:"plan-tabs",children:[l.jsx("button",{className:`tab ${e==="premium"?"active":""}`,onClick:()=>t("premium"),children:"PREMIUM PLANS"}),l.jsx("button",{className:`tab ${e==="flex"?"active":""}`,onClick:()=>t("flex"),children:"FLEX PLANS"})]}),l.jsx("div",{className:"plans-grid",children:o.map(a=>l.jsxs("div",{className:"plan-card",children:[l.jsxs("div",{className:"plan-header",children:[l.jsx("span",{className:"plan-emoji",children:a.emoji}),l.jsx("h3",{className:"plan-title",children:a.name})]}),l.jsx("div",{className:"plan-price",children:a.price}),l.jsx("ul",{className:"plan-features",children:a.features.map((u,h)=>l.jsxs("li",{children:[l.jsx("span",{className:"feature-bullet",children:"•"}),u]},h))}),l.jsx("button",{className:"plan-button",children:"ADD NOW"})]},a.id))})]})]})};console.log("🎯 CHAT BUILD: 2026-01-05T10:20:00Z - Chat layout and spacing fixes");let at=null;const DI=It.memo(()=>{const n=It.useCallback(e=>{e&&(at=e)},[]);return It.useEffect(()=>(console.log("📹 CameraPanel mounted"),()=>{console.error("❌ CameraPanel unmounting - THIS BREAKS THE STREAM")}),[]),l.jsxs("main",{className:"w-full lg:flex-1 relative bg-refined rounded-3xl overflow-hidden shadow-2xl border-2 border-primary group shadow-glow",children:[l.jsx("div",{className:"camera-frame w-full h-full",children:l.jsx("video",{ref:n,className:"camera-video",autoPlay:!0,muted:!0,playsInline:!0,style:{width:"100%",height:"100%",objectFit:"cover",backgroundColor:"#000"}})}),l.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10"}),l.jsx("div",{className:"absolute bottom-6 left-6 z-30 pointer-events-none",children:l.jsxs("div",{className:"flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg",children:[l.jsx("span",{className:"w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"}),l.jsx("span",{className:"text-xs font-semibold tracking-wider text-white/90 uppercase",children:"You"})]})})]})}),LI=It.memo(({user:n,isLoading:e,activeMode:t,setActiveMode:r,openDuoSquad:s,startVideoChat:o,isProfileOpen:a,setIsProfileOpen:u,activeTab:h,setActiveTab:f,isMatchHistoryOpen:y,setIsMatchHistoryOpen:b})=>(console.log("Dashboard render"),l.jsxs("div",{className:"w-full h-[90vh] flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 relative z-10 p-4 sm:p-6 lg:p-8",children:[l.jsxs("aside",{className:"w-full lg:flex-1 h-full flex flex-col bg-refined border-2 border-primary rounded-3xl shadow-glow relative transition-all duration-300",children:[l.jsxs("div",{className:"icon-row p-6 sm:p-8",children:[l.jsx("button",{onClick:()=>u(!a),className:"icon-btn",title:"Profile",children:n!=null&&n.picture?l.jsx("img",{src:n.picture,alt:"Profile",style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):l.jsx("i",{className:"material-icons-round",children:"person"})}),l.jsx("button",{onClick:()=>f(h==="search"?null:"search"),className:"icon-btn",title:"Search",children:l.jsx("i",{className:"material-icons-round",children:"search"})}),l.jsx("button",{onClick:()=>f(h==="likes"?null:"likes"),className:"icon-btn",title:"Likes",children:l.jsx("i",{className:"material-icons-round",children:"favorite"})}),l.jsx("button",{onClick:()=>f(h==="messages"?null:"messages"),className:"icon-btn",title:"Messages",children:l.jsx("i",{className:"material-icons-round",children:"chat_bubble"})}),l.jsx("button",{onClick:()=>f(h==="trophy"?null:"trophy"),className:"icon-btn",title:"Achievements",children:l.jsx("i",{className:"material-icons-round",children:"emoji_events"})}),l.jsx("button",{onClick:()=>b(!y),className:"icon-btn",title:"History",children:l.jsx("i",{className:"material-icons-round",children:"timer"})})]}),l.jsxs("div",{className:"flex-1 flex flex-col items-center justify-start space-y-12 relative z-10 pt-8",children:[l.jsx("h1",{className:"font-display text-5xl sm:text-6xl font-bold text-primary tracking-tight drop-shadow-sm select-none",children:"Flinxx"}),l.jsxs("div",{className:"flex items-center gap-6",children:[l.jsx("button",{className:`px-8 py-3 rounded-xl font-semibold text-lg shadow-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${t==="solo"?"bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover":"border border-primary text-primary hover:bg-primary/10"}`,onClick:()=>r("solo"),children:"SoloX"}),l.jsx("button",{className:`px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${t==="duo"?"bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover shadow-glow":"border border-primary text-primary hover:bg-primary/10"}`,onClick:()=>{r("duo"),s()},children:"DuoX"})]}),l.jsxs("button",{onClick:o,disabled:e,className:"group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary via-[#E5C558] to-primary text-black font-bold text-lg shadow-lg hover:shadow-glow-hover transition-all transform hover:scale-105 overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed",children:[l.jsx("span",{className:"absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"}),l.jsxs("div",{className:"flex items-center justify-center gap-3 relative z-10",children:[l.jsx("span",{className:"text-2xl",children:"🎬"}),l.jsx("span",{children:e?"Loading...":"Start Video Chat"})]})]})]}),l.jsx("div",{className:"w-full text-center py-4 z-10 mt-auto",children:l.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-600 font-medium",children:"Premium Video Experience"})})]}),l.jsx(DI,{})]}))),MI=It.memo(({onCancel:n,localStreamRef:e,cameraStarted:t})=>{const r=It.useCallback(s=>{s&&(console.log("📺 [WAITING SCREEN] Video element ref callback fired"),e.current&&s.srcObject!==e.current&&(console.log("📺 [WAITING SCREEN] ✅ Attaching stream via ref callback"),s.srcObject=e.current,s.muted=!0,s.play().catch(o=>{console.warn("📺 [WAITING SCREEN] Play warning:",o.message)})))},[e]);return It.useEffect(()=>{document.documentElement.classList.add("dark")},[]),l.jsxs(l.Fragment,{children:[l.jsx("style",{children:`
        .gold-glow {
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.15);
        }
        .gold-text-glow {
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
        .loading-dot {
          animation: dot-pulse 1.4s infinite ease-in-out both;
        }
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .search-icon-wrapper {
          position: relative;
          display: inline-block;
          width: fit-content;
          height: fit-content;
        }
        @keyframes searchFloat {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .search-icon {
          animation: searchFloat 2s ease-in-out infinite;
          display: block;
        }
        @keyframes dotPulse {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .loading-dots span {
          animation: dotPulse 1.4s infinite;
        }
        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
      `}),l.jsxs("main",{className:"flex-grow flex items-center justify-center p-4 md:p-8 relative w-full h-screen bg-black",children:[l.jsxs("div",{className:"absolute inset-0 z-0 overflow-hidden pointer-events-none",children:[l.jsx("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"}),l.jsx("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]",style:{animation:"float 15s infinite linear"}}),l.jsx("div",{className:"absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-[90px]",style:{animation:"float 15s infinite linear",animationDelay:"-5s"}}),l.jsx("div",{className:"absolute top-1/3 right-1/3 w-40 h-40 bg-yellow-400/5 rounded-full blur-[60px]",style:{animation:"float 15s infinite linear",animationDelay:"-10s"}})]}),l.jsx("div",{className:"absolute inset-0 z-0 opacity-5 pointer-events-none",style:{backgroundImage:"radial-gradient(#333 1px, transparent 1px)",backgroundSize:"30px 30px"}}),l.jsxs("div",{className:"w-full max-w-7xl z-10 h-[85vh] flex flex-col md:flex-row gap-8 items-center",children:[l.jsx("div",{className:"w-full md:w-1/2 h-full flex flex-col relative group",children:l.jsxs("div",{className:"relative w-full h-full border-2 border-yellow-400/60 dark:border-yellow-400/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-yellow-400",children:[l.jsx("video",{ref:r,autoPlay:!0,muted:!0,playsInline:!0,style:{width:"100%",height:"100%",objectFit:"cover",backgroundColor:"#000"}}),!t&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-zinc-900/50",children:l.jsx("div",{className:"text-zinc-600 dark:text-zinc-700 flex flex-col items-center gap-2",children:l.jsx("span",{className:"material-icons-outlined text-6xl opacity-20",children:"videocam_off"})})}),l.jsx("div",{className:"absolute bottom-6 left-6",children:l.jsx("div",{className:"px-4 py-1.5 rounded-full border border-yellow-400/50 bg-black/60 text-yellow-400 text-sm font-medium backdrop-blur-sm shadow-lg",children:"You"})})]})}),l.jsx("div",{className:"w-full md:w-1/2 h-full flex flex-col relative group",children:l.jsxs("div",{className:"relative w-full h-full border-2 border-yellow-400/60 dark:border-yellow-400/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-yellow-400 flex flex-col items-center justify-center text-center space-y-8",children:[l.jsxs("div",{className:"relative mb-4",children:[l.jsx("div",{className:"absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse"}),l.jsx("div",{className:"search-icon-wrapper",children:l.jsx("div",{className:"text-6xl md:text-8xl filter drop-shadow-lg search-icon",children:"🔍"})})]}),l.jsxs("div",{className:"space-y-3",children:[l.jsx("h1",{className:"text-3xl md:text-4xl font-bold text-yellow-400 gold-text-glow tracking-tight",children:"Looking for a partner..."}),l.jsx("p",{className:"text-yellow-400/70 text-lg md:text-xl font-light",children:"Matching you with someone nearby"})]}),l.jsxs("div",{className:"loading-dots flex items-center justify-center space-x-3 py-4",children:[l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"}),l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"}),l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"})]}),l.jsx("div",{className:"pt-8 w-full max-w-xs",children:l.jsxs("button",{onClick:()=>{console.log("🛑 [CANCEL] User clicked cancel - calling onCancel handler"),n&&n()},className:"w-full group relative px-8 py-3.5 bg-transparent overflow-hidden rounded-full border border-yellow-400/40 hover:border-yellow-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-black",children:[l.jsx("div",{className:"absolute inset-0 w-0 bg-yellow-400/10 transition-all duration-[250ms] ease-out group-hover:w-full"}),l.jsx("span",{className:"relative text-yellow-400/90 font-semibold tracking-wide group-hover:text-yellow-400",children:"Cancel Search"})]})}),l.jsx("div",{className:"absolute bottom-4 text-xs text-zinc-600 dark:text-zinc-700 max-w-md mx-auto",children:l.jsx("p",{children:"By connecting, you agree to our Terms of Service & Privacy Policy."})})]})})]})]})]})}),VI=()=>{console.log("RENDER START");const{activeMode:n,setActiveMode:e,handleModeChange:t,openDuoSquad:r}=sd(),s=ft(),o=Ad(),{user:a}=A.useContext(Lt)||{},[u,h]=A.useState(!1),[f,y]=A.useState(!1),[b,x]=A.useState(null),[C,k]=A.useState(!1),[S,N]=A.useState(!1),[G,W]=A.useState(!1),[U,B]=A.useState(!1),[fe,M]=A.useState(!1),[I,m]=A.useState(null),[g,_]=A.useState(0),[w,E]=A.useState(!1),[v,X]=A.useState(!1),[_e,Y]=A.useState(!1),[ge,je]=A.useState(!1),[pt,Xe]=A.useState(!1),[jn,rt]=A.useState(!1),[ke,es]=A.useState(!1),[Yt,j]=A.useState(!1),[q,te]=A.useState(null),[Oe,be]=A.useState("both"),[Tt,Mt]=A.useState(!1),[On,At]=A.useState(!1),[st,Dn]=A.useState(null),[ya,ts]=A.useState([]),[Ti,ns]=A.useState(""),[rs,Vt]=A.useState(!1),pn=A.useRef(null),z=A.useRef(null),ir=A.useRef(null),he=A.useRef(null),[ee,Ln]=A.useState(null),le=A.useRef(null),ct=A.useRef(null),Z=A.useRef(null),Xt=A.useRef(null),it=A.useRef(null),or=A.useRef(null),[ar,va]=A.useState(!1);if(console.log("HOOKS DONE"),!(a!=null&&a.uuid)||typeof a.uuid!="string"||a.uuid.length!==36)return console.log("⏳ Chat: Waiting for valid user UUID from AuthContext..."),null;A.useEffect(()=>{let P=!0;return(async()=>{try{if(Z.current)console.log("📹 [CAMERA INIT] Stream already exists - reusing existing stream");else{console.log("📹 [CAMERA INIT] Requesting camera permissions from browser...");const F=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:!0});if(!P){console.log("📹 [CAMERA INIT] Component unmounted, cleaning up stream"),F.getTracks().forEach(se=>se.stop());return}Z.current=F,Xt.current=F,console.log("📹 [CAMERA INIT] ✅ Camera stream obtained"),console.log("📹 [CAMERA INIT] Active tracks:",F.getTracks().map(se=>({kind:se.kind,enabled:se.enabled})))}if(await new Promise(F=>setTimeout(F,0)),!P)return;let D=0;const re=()=>{at&&Z.current?(console.log("📹 [CAMERA INIT] Attaching stream to video element..."),at.srcObject=Z.current,at.muted=!0,console.log("📹 [CAMERA INIT] Calling play() on video element"),at.play().then(()=>{P&&(console.log("📹 [CAMERA INIT] ✅ Video stream is now playing"),N(!0),At(!0))}).catch(F=>{P&&(console.warn("📹 [CAMERA INIT] ⚠️ Play error (stream may still display):",F.name,F.message),N(!0),At(!0))})):D<50?(D++,setTimeout(re,50)):(console.error("📹 [CAMERA INIT] ❌ Video ref never became available"),console.error("   sharedVideoRef:",!!at),console.error("   localStreamRef.current:",!!Z.current),At(!0))};re()}catch(D){P&&(console.error("📹 [CAMERA INIT] ❌ Error:",D.name,D.message),D.name==="NotAllowedError"?console.error("   → User denied camera permission"):D.name==="NotFoundError"?console.error("   → No camera device found"):D.name==="NotReadableError"&&console.error("   → Camera is in use by another app"),At(!0))}})(),()=>{P=!1}},[]),console.log("🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - move hooks to top)"),A.useEffect(()=>{console.log("STATE:",{isSearching:w,partnerFound:v}),console.log("✅ [CAMERA] Camera available for all screens")},[w,v]),A.useEffect(()=>{console.log("🔐 [TERMS CHECK] Checking if terms are accepted...");try{const P=localStorage.getItem("termsAccepted")==="true";console.log("📋 [TERMS CHECK] termsAccepted from localStorage:",P),P?(console.log("✅ [TERMS CHECK] User has accepted terms - allowing access"),y(!0)):(console.log("⚠️ [TERMS CHECK] User has not accepted terms - showing modal"),h(!0))}catch(P){console.error("❌ [TERMS CHECK] Error checking terms:",P),y(!0)}},[]);const Ai=()=>{console.log("✅ User accepted terms on dashboard"),localStorage.setItem("termsAccepted","true"),h(!1),y(!0)},lr=()=>{console.log("❌ User cancelled terms on dashboard - redirecting to login"),h(!1),s("/login",{replace:!0})};A.useEffect(()=>{const $=new URLSearchParams(o.search).get("view");x($),k($==="home"),console.log("[Chat] Location search params:",o.search),console.log("[Chat] view parameter:",$),console.log("[Chat] shouldStartAsIntro:",$==="home")},[o.search]),A.useEffect(()=>{const P=a||{googleId:"guest_"+Math.random().toString(36).substring(2,9),name:"Guest User",email:"guest@flinxx.local",picture:null};Ln(P),he.current||(he.current=P.uuid,!he.current||he.current.length!==36?console.error("❌ CRITICAL: Invalid or missing UUID from localStorage:",he.current):console.log("🔐 USER UUID INITIALIZED (ONE TIME):",he.current)),ir.current||(ir.current=P)},[a]),A.useEffect(()=>()=>{or.current&&clearInterval(or.current)},[]),A.useEffect(()=>{console.log(`👁️ [ACTIVE MODE MONITOR] Current activeMode: "${n}"`)},[n]),A.useEffect(()=>{var P;console.log("📌 Refs initialized:"),console.log("   localVideoRef.current exists:",!!le.current),console.log("   localVideoRef.current in DOM:",(P=le.current)!=null&&P.parentElement?"YES":"NO"),console.log("   remoteVideoRef.current exists:",!!ct.current),console.log("   localStreamRef.current exists:",!!Z.current)},[]);const cr=It.useCallback(async()=>{console.log(`

🎥 ===== CAMERA RE-INITIALIZATION STARTED =====`),console.log("🎥 [REINIT] Camera re-initialization requested"),console.log("🎥 [REINIT] Current state:"),console.log("  - localStreamRef.current exists:",!!Z.current),console.log("  - localVideoRef.current exists:",!!le.current),console.log("  - cameraStarted:",S);try{if(!le.current)return console.error("🎥 [REINIT] ❌ CRITICAL: localVideoRef.current is null/undefined - video element not in DOM"),!1;if(!le.current.parentElement)return console.error("🎥 [REINIT] ❌ CRITICAL: Video element is not attached to DOM"),!1;if(console.log("🎥 [REINIT] ✓ Video element exists in DOM"),Z.current){console.log("🎥 [REINIT] Stream exists, checking if tracks are active...");const $=Z.current.getTracks();if(console.log("🎥 [REINIT] Stream has",$.length,"tracks"),$.forEach((D,re)=>{console.log(`  Track ${re}:`,{kind:D.kind,enabled:D.enabled,readyState:D.readyState})}),$.length===0)console.warn("🎥 [REINIT] ⚠️ Stream exists but has no active tracks - will request new stream"),Z.current=null;else{console.log("🎥 [REINIT] ✓ Stream has active tracks, reattaching to video element"),le.current.srcObject=Z.current,le.current.muted=!0,console.log("🎥 [REINIT] srcObject set, waiting for play()...");try{const D=le.current.play();return D!==void 0&&await D,console.log("🎥 [REINIT] ✅ Camera preview reattached and playing"),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(D){return console.error("🎥 [REINIT] ❌ Error playing video:",D),console.error("🎥 [REINIT] Error name:",D.name),console.error("🎥 [REINIT] Error message:",D.message),!1}}}console.log("🎥 [REINIT] No existing stream or tracks inactive, requesting new preview stream");const P=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});return Z.current=P,console.log("🎥 [REINIT] ✅ New camera stream obtained:",P),console.log("🎥 [REINIT] New stream tracks:",P.getTracks().map($=>({kind:$.kind,id:$.id}))),le.current.srcObject=P,le.current.muted=!0,console.log("🎥 [REINIT] srcObject set to new stream, calling play()..."),requestAnimationFrame(()=>{var $;($=le.current)==null||$.play().catch(D=>{console.log("🎥 [REINIT] Video play blocked:",D)}),console.log("🎥 [REINIT] ✅ New camera preview play command dispatched")}),N(!0),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(P){return console.error("🎥 [REINIT] ❌ Error reinitializing camera:",P),console.error("🎥 [REINIT] Error name:",P.name),console.error("🎥 [REINIT] Error message:",P.message),console.error(`🎥 ===== CAMERA RE-INITIALIZATION FAILED =====

`),!1}},[S]);A.useEffect(()=>{pn.current={reinitializeCamera:cr}},[cr]),A.useEffect(()=>{if(!fe)return;const P=setInterval(()=>{_($=>$+1)},1e3);return()=>clearInterval(P)},[fe]),A.useEffect(()=>{U&&S&&console.log("🎬 [PARTNER FOUND] Transitioning to video chat screen")},[U,S]);const ss=async()=>{var P;try{if(console.log("📹 [START CAMERA] User clicked to start camera"),console.log("📹 [START CAMERA] Checking DOM state..."),console.log("   localVideoRef.current:",!!le.current),console.log("   localVideoRef.current in DOM:",(P=le.current)!=null&&P.parentElement?"YES":"NO"),console.log("   All videos in DOM:",document.querySelectorAll("video").length),!le.current){console.error("📹 [START CAMERA] ❌ Video element not in DOM - cannot proceed");return}console.log("📹 [START CAMERA] Requesting camera from browser...");const $=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});Xt.current=$,Z.current=$,console.log("📹 [START CAMERA] ✅ Stream obtained:",$),console.log("📹 [START CAMERA] Stream tracks:",$.getTracks().map(D=>({kind:D.kind,enabled:D.enabled,id:D.id}))),le.current&&(le.current.srcObject=$,console.log("📹 [START CAMERA] ✅ Stream attached to video element"),le.current.onloadedmetadata=()=>{console.log("📹 [START CAMERA] ✅ Video metadata loaded, calling play()"),le.current.play().then(()=>{console.log("📹 [START CAMERA] ✅ Video playing - setting isLocalCameraReady=true"),At(!0)}).catch(D=>{console.warn("📹 [START CAMERA] ⚠️ Play warning (but video loaded):",D.message),At(!0)})})}catch($){console.error("📹 [START CAMERA] ❌ CRITICAL ERROR:",$),console.error("   Error name:",$.name),console.error("   Error message:",$.message),$.name==="NotAllowedError"?console.error("❌ Camera permission DENIED by user - User clicked deny in browser prompt"):$.name==="NotFoundError"?console.error("❌ No camera device found - Check if device has a camera"):$.name==="NotReadableError"?console.error("❌ Camera is already in use by another app - Close other apps using camera"):$.name==="SecurityError"&&console.error("❌ Camera access blocked by security policy - Must use HTTPS")}};A.useEffect(()=>()=>{console.log("📹 [DASHBOARD CLEANUP] Component unmounting"),console.log("📹 [DASHBOARD CLEANUP] ⚠️ NOT stopping camera - will be reused on return")},[]),A.useEffect(()=>{const P=setTimeout(()=>{at&&Z.current&&(console.log("📹 [VERIFY] Stream attached:",{srcObject:!!at.srcObject,paused:at.paused,tracks:Z.current.getTracks().length,readyState:at.readyState,networkState:at.networkState}),at.paused&&(console.log("📹 [VERIFY] Video is paused, attempting play..."),at.play().catch($=>{console.warn("📹 [VERIFY] Play failed:",$.message)})))},1e3);return()=>clearTimeout(P)},[]);const Zt=async()=>{if(console.log("🔧 createPeerConnection called"),console.log("   Current localStreamRef:",Z.current),!Z.current){console.warn("⚠️ CRITICAL: localStreamRef.current is null - attempting to reacquire camera stream");try{const re=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(Z.current=re,le.current){le.current.srcObject=re,le.current.muted=!0;try{await le.current.play()}catch(F){console.warn("⚠️ Play error during reacquisition:",F)}}console.log("✅ LOCAL STREAM RE-ACQUIRED SUCCESSFULLY"),console.log("   Tracks:",re.getTracks().map(F=>({kind:F.kind,id:F.id})))}catch(re){throw console.error("❌ FATAL: Could not reacquire camera stream:",re.message),new Error("Cannot proceed: local camera stream unavailable - "+re.message)}}AI();const P=await ur(),$=[{urls:["stun:global.xirsys.net","turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp"],username:"nkhlvdv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"},...P];console.log("🔧 ICE Servers Configuration:",{count:$.length,servers:$.map(re=>({urls:re.urls,username:re.username?"***":void 0,credential:re.credential?"***":void 0}))});const D=new RTCPeerConnection({iceServers:$,iceTransportPolicy:"all"});if(z.current=D,console.log("✅ RTCPeerConnection created with iceTransportPolicy: all"),D.onicecandidate=re=>{if(re.candidate){const F=re.candidate;console.log("🧊 ICE candidate generated:",{candidate:F.candidate,protocol:F.protocol,port:F.port,address:F.address,type:F.type,priority:F.priority,sdpMLineIndex:F.sdpMLineIndex,sdpMId:F.sdpMid}),F.type==="relay"?(console.log("🔄 RELAY (TURN) candidate generated - TURN server is reachable"),console.log("   Protocol:",F.protocol,"Port:",F.port)):F.type==="srflx"?(console.log("📍 SRFLX (server reflexive) candidate - STUN working"),console.log("   Found public address via STUN")):F.type==="host"&&console.log("🏠 HOST candidate - direct LAN connection possible"),console.log("🔌 Sending ICE candidate to partner socket:",it.current),K.emit("ice_candidate",{candidate:F,to:it.current}),console.log("📤 ICE candidate sent to peer")}else console.log("🧊 ICE gathering complete (null candidate received)"),console.log("📊 ICE gathering summary:"),console.log("   Connection State:",D.connectionState),console.log("   ICE Connection State:",D.iceConnectionState),console.log("   ICE Gathering State:",D.iceGatheringState)},D.oniceconnectionstatechange=()=>{const re=D.iceConnectionState;switch(console.log(`
🧊 ===== ICE CONNECTION STATE CHANGED =====`),console.log("🧊 New ICE Connection State:",re),re){case"new":console.log("🧊 State: NEW - Gathering ICE candidates");break;case"checking":console.log("🧊 State: CHECKING - Testing ICE candidate pairs"),console.log("🧊 Connection in progress - waiting for connectivity");break;case"connected":console.log("✅ State: CONNECTED - Found working ICE candidate pair"),console.log("🧊 Peer-to-peer communication established");break;case"completed":console.log("✅ State: COMPLETED - ICE checks completed, ready for media"),console.log("🧊 All connectivity checks passed");break;case"failed":console.error("❌ State: FAILED - All ICE candidate pairs failed"),console.error("❌ Could not establish peer-to-peer connection"),console.error("❌ TURN server may be unreachable or blocked by ISP"),console.error("🔍 Troubleshooting:"),console.error("   - Check console for TURN error details"),console.error("   - TURN error 701 = Network/ISP blocking ports 3478, 5349"),console.error("   - Solutions: Try VPN, different WiFi, or mobile hotspot"),console.error("   - User can retry with a retry button (do NOT auto-restart ICE)");break;case"disconnected":console.warn("⚠️ State: DISCONNECTED - Lost connection to peer"),console.warn("   Note: ICE restart is manual only to prevent stream loss");break;case"closed":console.log("🛑 State: CLOSED - Connection closed");break}console.log("📊 Full connection states:"),console.log("   Signaling State:",D.signalingState),console.log("   Connection State:",D.connectionState),console.log("   ICE Gathering State:",D.iceGatheringState)},z.current._remoteStream||(z.current._remoteStream=new MediaStream,console.log("✅ PERSISTENT REMOTE STREAM CREATED - will accumulate all incoming tracks")),D.ontrack=re=>{console.log(`

🔴🔴🔴 ===== CRITICAL: ONTRACK HANDLER FIRING! =====`),console.log("🔴 ONTRACK CALLED AT:",new Date().toISOString()),console.log("🔴 Track received:",{kind:re.track.kind,id:re.track.id,enabled:re.track.enabled});const F=z.current._remoteStream;if(console.log("🔴 Using persistent remote stream ID:",F.id),F.addTrack(re.track),console.log("✅ Track added to persistent remote stream"),console.log("📥 Remote stream now has",F.getTracks().length,"track(s)"),console.log("📥 Tracks:",F.getTracks().map(se=>({kind:se.kind,id:se.id,enabled:se.enabled}))),!ct.current){console.error("❌ CRITICAL ERROR: remoteVideoRef.current is NULL!"),console.error("   Cannot attach remote track - video element not available");return}ct.current.srcObject!==F?(console.log("📺 ATTACHING PERSISTENT STREAM to remoteVideoRef"),ct.current.srcObject=F,ct.current.muted=!1,console.log("📺 srcObject attached, attempting play()..."),ct.current.play().catch(()=>{console.log("ℹ️ Autoplay blocked - will play on user interaction")})):(console.log("📺 STREAM ALREADY ATTACHED - skipping re-attachment"),console.log("   Stream has",F.getTracks().length,"tracks now")),console.log(`✅ ✅ ✅ ONTRACK COMPLETE - Remote stream persisted and attached

`)},D.onconnectionstatechange=()=>{console.log(`
🔌 ===== CONNECTION STATE CHANGED =====`),console.log("🔌 New Connection State:",D.connectionState),console.log("   ICE Connection State:",D.iceConnectionState),console.log("   ICE Gathering State:",D.iceGatheringState),console.log("   Signaling State:",D.signalingState),D.connectionState==="connected"?(M(!0),console.log("✅ WebRTC connection ESTABLISHED"),setTimeout(()=>{console.log(`
📊 ===== RECEIVER DEBUG CHECK (after connected) =====`);const re=D.getReceivers();console.log("📊 Total receivers:",re.length),re.forEach((se,Ee)=>{var Pe,Te,Ce,De,de;console.log(`📊 Receiver ${Ee}:`,{kind:(Pe=se.track)==null?void 0:Pe.kind,enabled:(Te=se.track)==null?void 0:Te.enabled,readyState:(Ce=se.track)==null?void 0:Ce.readyState,id:(De=se.track)==null?void 0:De.id,muted:(de=se.track)==null?void 0:de.muted})}),console.log("📊 Audio and video tracks should be present above");const F=D.getSenders();console.log(`
📊 Total senders:`,F.length),F.forEach((se,Ee)=>{var Pe,Te,Ce,De;console.log(`📊 Sender ${Ee}:`,{kind:(Pe=se.track)==null?void 0:Pe.kind,enabled:(Te=se.track)==null?void 0:Te.enabled,readyState:(Ce=se.track)==null?void 0:Ce.readyState,id:(De=se.track)==null?void 0:De.id})})},1e3)):D.connectionState==="disconnected"?(M(!1),console.log("⚠️ WebRTC connection DISCONNECTED")):D.connectionState==="failed"?(M(!1),console.log("❌ WebRTC connection FAILED")):D.connectionState==="closed"&&(M(!1),console.log("❌ WebRTC connection CLOSED"))},!Z.current)throw console.error("❌ CRITICAL ERROR: localStreamRef.current is null/undefined in createPeerConnection!"),new Error("Local stream lost before createPeerConnection");return D};A.useEffect(()=>(console.log(`

🔌 ===== SOCKET LISTENERS SETUP (COMPONENT MOUNT) =====`),console.log("🔌 Setting up socket listeners - runs ONCE on component load"),console.log("🔌 Socket ID:",K.id),console.log("🔌 Socket connected:",K.connected),console.log("🔌 🔐 Using userIdRef.current for ALL ID comparisons:",he.current),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("receive_message"),K.off("partner_disconnected"),K.off("disconnect"),console.log("🔌 Removed old listeners (if any existed)"),K.on("partner_found",async P=>{var Pe,Te,Ce,De;console.log(`

📋 ===== PARTNER FOUND EVENT RECEIVED =====`),console.log("👥 RAW DATA from server:",JSON.stringify(P,null,2)),console.log("👥 My socket ID:",K.id),console.log("👥 currentUser object:",JSON.stringify(ee,null,2)),console.log("👥 userIdRef.current (SHOULD USE THIS):",he.current),console.log("👥 currentUser.googleId:",ee==null?void 0:ee.googleId),console.log("👥 currentUser.id:",ee==null?void 0:ee.id),console.log("👥 data.socketId:",P.socketId),console.log("👥 data.partnerId:",P.partnerId),console.log("👥 data.userName:",P.userName),E(!1),X(!0),Vt(!1),console.log(`
👥 SELF-MATCH CHECK - START`);const $=he.current,D=P.partnerId;if(console.log("👥 COMPARISON VALUES:"),console.log("   myUserId type:",typeof $,"value:",$),console.log("   partnerUserId type:",typeof D,"value:",D),console.log("   Are they EQUAL?",$===D),console.log("   String comparison:",String($)===String(D)),$===D){console.error(`
❌❌❌ CRITICAL ERROR: SELF-MATCH DETECTED! ❌❌❌`),console.error("   My user ID:",$,"type:",typeof $),console.error("   Partner user ID:",D,"type:",typeof D),console.error("   Match IDs:",$===D),console.error("   These should be DIFFERENT!"),Vt(!0),console.error("   Emitting skip_user..."),K.emit("skip_user",{partnerSocketId:P.socketId}),console.error("   Emitting find_partner..."),K.emit("find_partner",{userId:he.current,userName:ee.name||"Anonymous",userAge:ee.age||18,userLocation:ee.location||"Unknown"}),console.error("   Returning - match REJECTED");return}console.log("✅ SELF-MATCH CHECK PASSED - partner is different user"),console.log("   Accepting match and proceeding with WebRTC setup"),console.log(`👥 SELF-MATCH CHECK - END
`),it.current=P.socketId,console.log("🔌 CRITICAL: Stored partner socket ID:",it.current),console.log("🔌 CRITICAL: Verification - partnerSocketIdRef.current is now:",it.current),console.log("🎬 ABOUT TO CALL setHasPartner(true)"),B(!0),console.log("🎬 ✅ setHasPartner(true) CALLED - force attach effect should trigger");const re={...P,picture:P.userPicture||P.picture||null,userName:P.userName||P.name||"Anonymous",userLocation:P.userLocation||P.location||"Unknown",userAge:P.userAge||P.age||18};m(re),console.log("🎬 ✅ setPartnerInfo CALLED with data:",re);const F=K.id,se=P.socketId,Ee=F<se;if(console.log("🔍 SOCKET ID COMPARISON:"),console.log("   My socket ID:",F),console.log("   Partner socket ID:",se),console.log("   Am I offerer? (myID < partnerID):",Ee),console.log(`
🔐 ===== CRITICAL STREAM VERIFICATION =====`),console.log("🔐 Checking localStreamRef.current status:"),console.log("   exists:",!!Z.current),console.log("   tracks:",((Pe=Z.current)==null?void 0:Pe.getTracks().length)||0),console.log("   video element srcObject:",!!((Te=le.current)!=null&&Te.srcObject)),!Z.current){console.error("🔐 ❌ CRITICAL: localStreamRef.current is NULL - cannot proceed to WebRTC"),console.error("   This means the camera stream was never acquired or was lost"),console.error("   Attempting emergency camera reacquisition...");try{const de=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(Z.current=de,le.current){le.current.srcObject=de,le.current.muted=!0;try{await le.current.play()}catch{console.warn("⚠️ Play error in emergency reacquisition")}}console.log("🔐 ✅ EMERGENCY: Camera stream re-acquired")}catch(de){console.error("🔐 ❌ EMERGENCY FAILED: Could not reacquire camera -",de.message),console.error("   User must allow camera permission to continue");return}}if(console.log(`🔐 ✅ STREAM VERIFICATION PASSED - proceeding with WebRTC
`),!Ee){console.log("📭 I am the ANSWERER - waiting for offer from offerer");return}console.log("📬 I am the OFFERER - creating peer connection and sending offer");try{if(console.log(`
🏠 OFFERER: Creating peer connection`),z.current){console.warn("⚠️ OFFERER: WARNING - Peer connection already exists! Not recreating."),console.warn("   Existing PC state:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState});return}let de;try{de=await Zt()}catch(ye){console.error("❌ OFFERER: Error creating peer connection:",ye);return}if(z.current=de,console.log("✅ OFFERER: Peer connection created"),console.log("📊 OFFERER Stream status after peer connection creation:",{exists:!!Z.current,trackCount:(Ce=Z.current)==null?void 0:Ce.getTracks().length,tracks:(De=Z.current)==null?void 0:De.getTracks().map(ye=>({kind:ye.kind,enabled:ye.enabled,state:ye.readyState}))}),Z.current){console.log(`
👤 OFFERER localStream:`,Z.current);const ye=Z.current.getTracks();console.log("👤 OFFERER: All available tracks:",ye),console.log("📹 OFFERER tracks detail:",ye.map(We=>({kind:We.kind,id:We.id,enabled:We.enabled,state:We.readyState})));const Ze=de.getSenders();if(console.log("📤 OFFERER: Existing senders count:",Ze.length),Ze.length>0)console.warn("⚠️ OFFERER WARNING: Tracks already added! Senders:",Ze.map(We=>{var Le,ut;return{kind:(Le=We.track)==null?void 0:Le.kind,id:(ut=We.track)==null?void 0:ut.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 OFFERER: Adding ${ye.length} local tracks to peer connection`),ye.forEach((Le,ut)=>{console.log(`  [${ut}] Adding ${Le.kind} track (id: ${Le.id}, enabled: ${Le.enabled})`);try{const St=de.addTrack(Le,Z.current);console.log(`  [${ut}] ✅ addTrack succeeded, sender:`,St)}catch(St){console.error(`  [${ut}] ❌ addTrack failed:`,St)}}),console.log(`
✅ OFFERER: All tracks added to peer connection`);const We=de.getSenders();console.log("📤 OFFERER senders count:",We.length),console.log("📤 OFFERER senders after addTrack:",We.map((Le,ut)=>{var St,dr,fr;return{index:ut,kind:(St=Le.track)==null?void 0:St.kind,id:(dr=Le.track)==null?void 0:dr.id,trackExists:!!Le.track,trackEnabled:(fr=Le.track)==null?void 0:fr.enabled}})),console.log("🚀 OFFERER: Ready to send offer with",ye.length,`tracks
`)}}else console.error("❌ OFFERER: No local stream available - TRACKS WILL NOT BE SENT!"),console.error("❌ OFFERER: localStreamRef.current is:",Z.current);console.log(`
📋 ===== OFFERER CREATING AND SENDING OFFER =====`),console.log("🎬 OFFERER: Creating WebRTC offer with offerToReceiveVideo/Audio");const Ct=await de.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ OFFERER: Offer created with receive constraints:",Ct),console.log("📋 OFFERER SDP CHECK - Looking for a=sendrecv:");const en=Ct.sdp.split(`
`).filter(ye=>ye.includes("sendrecv")||ye.includes("recvonly")||ye.includes("sendonly"));console.log("   Media direction lines:"),en.forEach(ye=>console.log("   ",ye)),console.log("🔄 OFFERER: Setting local description (offer)"),await de.setLocalDescription(Ct),console.log("✅ OFFERER: Local description set"),console.log(`
📤 OFFERER: Sending offer with tracks:`,de.getSenders().map(ye=>{var Ze,We,Le;return{kind:(Ze=ye.track)==null?void 0:Ze.kind,id:(We=ye.track)==null?void 0:We.id,enabled:(Le=ye.track)==null?void 0:Le.enabled}})),console.log("📤 OFFERER: Partner socket ID from data:",P.socketId),console.log("📤 OFFERER: partnerSocketIdRef.current value:",it.current),console.log("🔌🔌🔌 CRITICAL: About to emit webrtc_offer with to:",P.socketId),console.log("🔌🔌🔌 CRITICAL: Is to value empty/null/undefined?",!P.socketId),K.emit("webrtc_offer",{offer:z.current.localDescription,to:P.socketId}),console.log("✅ OFFERER: webrtc_offer emitted successfully"),console.log("✅ OFFERER: webrtc_offer sent to socket ID:",P.socketId),console.log("✅ OFFERER: webrtc_offer contains",z.current.getSenders().length,"senders"),console.log("✅ OFFERER: Sent to socket:",P.socketId)}catch(de){console.error("❌ OFFERER: Error in partner_found handler:",de),console.error("❌ OFFERER: Stack trace:",de.stack)}}),K.on("webrtc_offer",async P=>{console.log(`

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`),console.log("🎉🎉🎉 ⭐️ ANSWERER HANDLER FIRED ⭐️ 🎉🎉🎉"),console.log("🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"),console.log("📋 ===== ANSWERER RECEIVED OFFER ====="),console.log("⭐️ ANSWERER: WEBRTC_OFFER EVENT FIRED - OFFER WAS RECEIVED"),console.log("📨 ANSWERER: Received WebRTC offer from offerer"),console.log("📨 ANSWERER: My socket ID:",K.id),console.log("📨 ANSWERER: Offer from:",P.from),console.log("📨 ANSWERER: Full data:",P),console.log("📨 ANSWERER: data.from (offerer socket ID):",P.from),it.current=P.from,console.log("🔌 CRITICAL: Stored offerer socket ID:",it.current);try{if(z.current)console.log("⚠️ ANSWERER: WARNING - peerConnectionRef already exists (should be null for answerer)");else{console.log("📍 ANSWERER: Creating new peer connection for the first time");let F;try{F=await Zt()}catch(se){console.error("❌ ANSWERER: Error creating peer connection:",se);return}z.current=F,console.log("✅ ANSWERER: Peer connection created")}if(console.log(`
🔍 ANSWERER: ALWAYS executing track addition logic`),console.log("👤 ANSWERER: Checking localStreamRef.current..."),console.log("👤 ANSWERER localStreamRef.current:",Z.current),console.log("👤 ANSWERER localStreamRef.current === null?",Z.current===null),console.log("👤 ANSWERER localStreamRef.current === undefined?",Z.current===void 0),!Z.current){console.warn("⚠️ ANSWERER: localStreamRef.current is NULL - attempting emergency reacquisition");try{const F=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(Z.current=F,le.current){le.current.srcObject=F,le.current.muted=!0;try{await le.current.play()}catch{console.warn("⚠️ Play error in answerer emergency reacquisition")}}console.log("✅ ANSWERER: Emergency stream acquisition successful")}catch(F){throw console.error("❌ ANSWERER: Emergency stream acquisition failed:",F.message),new Error("ANSWERER: Cannot reacquire camera stream - "+F.message)}}if(Z.current){console.log(`
✅ ANSWERER: localStream EXISTS - will add tracks`),console.log("📊 ANSWERER localStream object:",Z.current);const F=Z.current.getTracks();console.log("👤 ANSWERER: getAllTracks() returned:",F),console.log("👤 ANSWERER: Track array length:",F.length),F.length>0?console.log("👤 ANSWERER: Tracks detail:",F.map(Ee=>({kind:Ee.kind,id:Ee.id,enabled:Ee.enabled,readyState:Ee.readyState}))):console.warn("⚠️ ANSWERER: WARNING - localStream exists but getTracks() returned empty array!");const se=z.current.getSenders();if(console.log("📤 ANSWERER: Existing senders count:",se.length),se.length>0)console.warn("⚠️ ANSWERER WARNING: Tracks already added! Senders:",se.map(Ee=>{var Pe,Te;return{kind:(Pe=Ee.track)==null?void 0:Pe.kind,id:(Te=Ee.track)==null?void 0:Te.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 ANSWERER: Attempting to add ${F.length} local tracks to peer connection`);let Ee=0,Pe=0;F.forEach((Ce,De)=>{console.log(`  [${De}] About to add ${Ce.kind} track (id: ${Ce.id}, enabled: ${Ce.enabled})`);try{const de=z.current.addTrack(Ce,Z.current);console.log(`  [${De}] ✅ addTrack SUCCEEDED`),console.log(`  [${De}] Sender:`,de),Ee++}catch(de){console.error(`  [${De}] ❌ addTrack FAILED`),console.error(`  [${De}] Error:`,de.message),Pe++}}),console.log(`
✅ ANSWERER: Track addition complete (${Ee} succeeded, ${Pe} failed)`);const Te=z.current.getSenders();console.log("📤 ANSWERER: Final senders count:",Te.length),console.log("📤 ANSWERER: Senders:",Te.map((Ce,De)=>{var de,Ct,en;return{index:De,kind:(de=Ce.track)==null?void 0:de.kind,id:(Ct=Ce.track)==null?void 0:Ct.id,trackExists:!!Ce.track,trackEnabled:(en=Ce.track)==null?void 0:en.enabled}}))}}else throw console.error(`
❌ ANSWERER: CRITICAL ERROR - localStreamRef.current is NULL!`),console.error("❌ ANSWERER: Cannot add tracks - stream does not exist"),new Error("ANSWERER: No local stream - cannot add tracks");console.log(`
🔄 ANSWERER: Setting remote description (offer from offerer)`),await z.current.setRemoteDescription(new RTCSessionDescription(P.offer)),console.log("✅ ANSWERER: Remote description set successfully"),console.log("🎬 ANSWERER: Creating answer");const $=await z.current.createAnswer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ ANSWERER: Answer created with receive constraints"),console.log("📋 ANSWERER SDP CHECK - Looking for a=sendrecv:");const D=$.sdp.split(`
`).filter(F=>F.includes("sendrecv")||F.includes("recvonly")||F.includes("sendonly"));console.log("   Media direction lines:"),D.forEach(F=>console.log("   ",F)),console.log("🔄 ANSWERER: Setting local description (answer)"),await z.current.setLocalDescription($),console.log("✅ ANSWERER: Local description set successfully"),console.log(`
📋 ===== ANSWERER SENDING ANSWER =====`);const re=z.current.getSenders();console.log("📤 ANSWERER: Final senders count:",re.length),console.log("📤 ANSWERER: Sending answer with tracks:",re.map(F=>{var se,Ee,Pe;return{kind:(se=F.track)==null?void 0:se.kind,id:(Ee=F.track)==null?void 0:Ee.id,enabled:(Pe=F.track)==null?void 0:Pe.enabled}})),console.log("🔌 CRITICAL: Offerer socket ID from offer:",P.from),console.log("🔌 SERVER sending ANSWER to:",P.from),K.emit("webrtc_answer",{answer:z.current.localDescription,to:P.from}),console.log("📤 ANSWERER: Answer emitted to offerer via socket:",P.from),console.log(`📋 ===== ANSWERER ANSWER SENT =====

`)}catch($){console.error(`
❌ ANSWERER: ERROR in webrtc_offer handler:`,$),console.error("❌ ANSWERER: Error message:",$.message),console.error("❌ ANSWERER: Stack trace:",$.stack)}}),K.on("webrtc_answer",async P=>{console.log(`

📋 ===== OFFERER RECEIVED ANSWER =====`),console.log("📨 OFFERER: Received WebRTC answer from answerer"),console.log("📨 OFFERER: data.from (answerer socket ID):",P.from),console.log("📨 OFFERER: Answer SDP:",P.answer),it.current=P.from,console.log("🔌 CRITICAL: Stored answerer socket ID:",it.current);try{if(!z.current){console.error("❌ OFFERER: No peer connection available to handle answer");return}console.log(`
🔄 OFFERER: Setting remote description (answer from answerer)`),console.log("📊 OFFERER: Current connection state before answer:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState}),await z.current.setRemoteDescription(new RTCSessionDescription(P.answer)),console.log("✅ OFFERER: Remote description (answer) set successfully"),console.log("📊 OFFERER: Connection state after answer:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState}),console.log(`📋 ===== OFFERER ANSWER RECEIVED AND SET =====

`)}catch($){console.error("❌ OFFERER: Error handling answer:",$),console.error("❌ OFFERER: Stack trace:",$.stack)}}),K.on("ice_candidate",async P=>{if(console.log(`
🧊 ICE candidate received from peer:`,{candidate:P.candidate,sdpMLineIndex:P.sdpMLineIndex,sdpMid:P.sdpMid}),!P.candidate||P.candidate.sdpMid==null&&P.candidate.sdpMLineIndex==null){console.warn("⚠️ Ignoring invalid ICE candidate (empty sdpMid and sdpMLineIndex)");return}try{z.current?(console.log("🧊 Adding ICE candidate to peer connection"),await z.current.addIceCandidate(new RTCIceCandidate(P.candidate)),console.log(`✅ ICE candidate added successfully
`)):console.warn("⚠️ No peer connection available for ICE candidate")}catch($){console.error("❌ Error adding ICE candidate:",$)}}),K.on("partner_disconnected",P=>{console.log(`

🔴🔴🔴🔴🔴 ===== PARTNER DISCONNECTED EVENT RECEIVED ===== 🔴🔴🔴🔴🔴`),console.log("🔴 Event Data:",P),console.log("🔴 Timestamp:",new Date().toISOString()),console.log("🔴 Partner has closed the browser/tab"),console.log("🔴 Cleaning up WebRTC connection..."),z.current?(console.log("🔴 Closing peer connection"),console.log("   Current state:",z.current.connectionState),z.current.close(),z.current=null,console.log("🔴 Peer connection closed successfully")):console.log("🔴 WARNING: peerConnectionRef.current was null"),ct.current&&(console.log("🔴 Clearing remote video ref"),ct.current.srcObject=null),console.log("🔴 Calling endChat() to reset UI"),is(),console.log("🔴🔴🔴 Cleanup complete - ready for new partner")}),K.on("disconnect",()=>{console.log("Socket disconnected"),Mn()}),console.log(`

🔌 ===== ALL SOCKET LISTENERS REGISTERED =====`),console.log("🔌 ✅ partner_found listener active"),console.log("🔌 ✅ webrtc_offer listener active"),console.log("🔌 ✅ webrtc_answer listener active"),console.log("🔌 ✅ ice_candidate listener active"),console.log("🔌 ✅ partner_disconnected listener active (CRITICAL FOR DISCONNECT)"),console.log("🔌 ✅ disconnect listener active"),console.log(`🔌 Ready to receive WebRTC signaling messages

`),()=>{console.log("🧹 Removing socket listeners on component unmount"),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("partner_disconnected"),K.off("disconnect")}),[]),A.useEffect(()=>{const P=G,$=U;return()=>{console.log(`

🧹 🧹 🧹 CHAT COMPONENT UNMOUNTING - CRITICAL CLEANUP 🧹 🧹 🧹`),P&&!$&&(console.log("🧹 User was still looking for partner - emitting cancel_matching"),K.emit("cancel_matching",{userId:he.current,timestamp:new Date().toISOString()})),z.current&&(console.log("🧹 Closing peer connection"),z.current.close(),z.current=null),console.log("✅ Chat component cleanup complete (tracks NOT stopped - will be reused)")}},[]),A.useEffect(()=>()=>{console.log("🧹 Chat component unmounting - cleaning up peer connection only"),z.current&&(z.current.close(),z.current=null)},[]);const ur=async()=>{var P;try{console.log("🔄 Fetching TURN servers from Xirsys via backend API...");const D=await(await fetch("https://flinxx-backend.onrender.com/api/turn")).json();if(console.log("📡 Xirsys API Response:",D),(P=D==null?void 0:D.v)!=null&&P.iceServers&&Array.isArray(D.v.iceServers))return console.log("✅ TURN servers fetched from Xirsys API"),console.log("✅ iceServers is an array with",D.v.iceServers.length,"entries"),console.log("📋 ICE Servers:",D.v.iceServers),D.v.iceServers;throw console.warn("⚠️ Invalid Xirsys TURN response format"),console.log("   Expected: data.v.iceServers as array"),console.log("   Received:",D),new Error("Invalid Xirsys TURN response format")}catch($){console.error("❌ Error fetching TURN servers from Xirsys:",$.message),console.log("🔄 Falling back to static STUN/TURN configuration");const D=CI();return console.log("📋 Using fallback ICE servers:",D),D}},hr=async()=>{if(console.log('🎬 [BUTTON CLICK] "Start Video Chat" button clicked'),console.log("🎬 [BUTTON CLICK] Current state - cameraStarted:",S,"isSearching:",w),S)S&&!w&&(console.log('🎬 [SEARCHING] User clicked "Start Video Chat" again - starting search'),console.log("🎬 [SEARCHING] ⚠️ NOT reinitializing camera - stream already active"),console.log("CLICKED Start Video Chat"),console.log("🎬 [STATE BEFORE] isSearching:",w,"partnerFound:",v),K.emit("start-search",{userId:he.current,userName:ee.name||"Anonymous",userAge:ee.age||18,userLocation:ee.location||"Unknown",userPicture:ee.picture||null}),console.log("🎬 [SEARCHING] ✅ start-search event emitted immediately"),E(!0),X(!1),Vt(!0),console.log("🎬 [STATE AFTER] Calling setIsSearching(true)"),console.log("STATE AFTER START SEARCH:",{isStarting:!0,isSearching:!0,partnerFound:!1}));else{if(console.log("🎬 [BUTTON CLICK] First click - initializing camera"),console.log("🎬 [BUTTON CLICK] Checking if camera request already in progress..."),Tt){console.warn("⚠️ Camera request already in progress");return}try{Mt(!0),Vt(!0),console.log("🎬 [BUTTON CLICK] isRequestingCamera=true, isLoading=true, calling startCamera()..."),await ss(),console.log("🎬 [BUTTON CLICK] startCamera() completed successfully"),console.log("🎬 [START] Setting cameraStarted = true (camera preview now showing)"),N(!0),Mt(!1),Vt(!1),console.log("🎬 [START] ✅ Camera initialized - user is still on home screen, matching NOT started yet")}catch(P){console.error("❌ Error initializing camera:",P),Mt(!1),Vt(!1),P.name==="NotAllowedError"?console.warn("⚠️ Camera permission denied by user"):P.name==="NotFoundError"?console.warn("⚠️ No camera device found"):P.name==="NotReadableError"&&console.warn("⚠️ Camera device is already in use by another application")}}},Ft=A.useCallback(()=>{console.log("🛑 [CANCEL] User cancelled search"),console.log("STATE BEFORE CANCEL:",{isSearching:w,partnerFound:v}),K.emit("cancel-search",{userId:he.current}),E(!1),X(!1),Vt(!1),console.log("STATE AFTER CANCEL:",{isSearching:!1,partnerFound:!1,isLoading:!1})},[]),is=()=>{B(!1),M(!1),m(null),ts([]),_(0),z.current&&(z.current.close(),z.current=null),K.emit("find_partner",{userId:he.current,userName:ee.name||"Anonymous",userAge:ee.age||18,userLocation:ee.location||"Unknown"})},Mn=()=>{console.log("🧹 Cleaning up chat session"),z.current&&(z.current.close(),z.current=null),N(!1),B(!1),M(!1),ts([]),_(0)},os=()=>(console.log("🎬 VideoChatScreen rendering - partnerInfo:",{exists:!!I,userName:I==null?void 0:I.userName,userLocation:I==null?void 0:I.userLocation,picture:!!(I!=null&&I.picture),fullObject:I}),console.log("🎬 currentUser for comparison:",{name:ee==null?void 0:ee.name,location:ee==null?void 0:ee.location,picture:!!(ee!=null&&ee.picture)}),l.jsxs("div",{className:"dashboard",children:[l.jsxs("div",{className:"w-full max-w-5xl flex gap-6 flex-1",children:[l.jsx("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:l.jsxs("div",{id:"remote-video-wrapper",style:{position:"absolute",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",zIndex:1,overflow:"hidden",backgroundColor:"black",display:"flex",alignItems:"center",justifyContent:"center"},children:[l.jsx("video",{id:"remote-video-singleton",ref:ct,autoPlay:!0,playsInline:!0,muted:!0,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",backgroundColor:"black",display:U?"block":"none",zIndex:10}}),!U&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000000",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1},children:l.jsx("p",{style:{color:"#d9b85f",fontSize:"14px"},children:"Waiting for partner video..."})}),U&&l.jsxs("div",{className:"absolute top-4 left-4 flex items-center gap-3 z-50 backdrop-blur-sm px-3 py-2 rounded-xl",style:{backgroundColor:"rgba(0, 0, 0, 0.6)"},children:[l.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 overflow-hidden",children:I&&I.picture?l.jsx("img",{src:I.picture,alt:"Partner",className:"w-full h-full object-cover"}):"👤"}),l.jsxs("div",{className:"min-w-0",children:[l.jsx("p",{className:"font-semibold text-sm",style:{color:"#d9b85f"},children:I?I.userName:"Partner"}),l.jsx("p",{className:"text-xs",style:{color:"#d9b85f"},children:I?I.userLocation:"Online"})]})]}),fe&&U&&l.jsxs("div",{className:"absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold z-50 shadow-lg px-3 py-2 rounded-full",style:{backgroundColor:"rgba(217, 184, 95, 0.9)",color:"#0f0f0f"},children:[l.jsx("span",{className:"w-2 h-2 rounded-full animate-pulse",style:{backgroundColor:"#0f0f0f"}}),SI(g)]})]})}),l.jsxs("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:[!On&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:"12px",zIndex:0},children:"Camera loading..."}),l.jsx("div",{className:"you-badge",style:{zIndex:2},children:"You"})]})]}),l.jsxs("div",{className:"w-full max-w-5xl flex items-center justify-center gap-4 pb-4",style:{backgroundColor:"transparent"},children:[l.jsx("button",{onClick:()=>{console.log("Skip pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⏭ Skip"}),l.jsx("button",{onClick:()=>{console.log("Next pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⏭ Next"}),l.jsx("button",{onClick:()=>{console.log("Report pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:P=>{P.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:P=>{P.currentTarget.style.boxShadow="none"},children:"⚠️ Report"})]})]}));return l.jsxs(l.Fragment,{children:[console.log("🎨 [RENDER] UI STATE →",{isSearching:w,partnerFound:v},"Should show:",w&&!v?"WAITING SCREEN":v?"VIDEO CHAT":"DASHBOARD"),l.jsxs("div",{className:"w-full h-screen overflow-hidden bg-black relative",children:[console.log("🎨 [RENDER] Showing DASHBOARD"),l.jsx(LI,{user:a,isLoading:rs,activeMode:n,setActiveMode:e,openDuoSquad:r,startVideoChat:hr,isProfileOpen:pt,setIsProfileOpen:Xe,activeTab:st,setActiveTab:Dn,isMatchHistoryOpen:jn,setIsMatchHistoryOpen:rt}),w&&!v&&l.jsxs("div",{className:"absolute inset-0 z-50",children:[console.log("🎨 [RENDER] Showing WAITING SCREEN"),l.jsx(MI,{onCancel:Ft,localStreamRef:Z,cameraStarted:S})]}),v&&l.jsx("div",{className:"absolute inset-0 z-50",children:l.jsx(os,{})})]}),!(w&&!v)&&l.jsxs(l.Fragment,{children:[u&&l.jsx(td,{onCancel:lr,onContinue:Ai}),f?l.jsxs("div",{className:"flex flex-col h-screen w-screen overflow-visible min-h-0",style:{backgroundColor:"#0f0f0f",overflow:"visible",position:"relative"},children:[l.jsx(RI,{isOpen:_e,onClose:()=>Y(!1)}),l.jsx(NI,{isOpen:ge,onClose:()=>je(!1),currentGender:Oe,onOpenPremium:()=>Y(!0)}),l.jsx(kI,{isOpen:pt,onClose:()=>Xe(!1),onOpenPremium:()=>Y(!0),onReinitializeCamera:async()=>{var P;return(P=pn.current)!=null&&P.reinitializeCamera?await pn.current.reinitializeCamera():!1}}),l.jsx(PI,{isOpen:jn,onClose:()=>rt(!1)}),l.jsx(jI,{isOpen:st!==null&&st!=="trophy",onClose:()=>Dn(null),mode:st==="profile"?"profile":st==="search"?"search":st==="likes"?"likes":st==="messages"?"message":st==="timer"?"timer":"notifications",onUserSelect:P=>{console.log("Selected user from search:",P)}}),st==="trophy"&&l.jsx(OI,{onClose:()=>Dn(null)}),ar&&l.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:l.jsxs("div",{className:"bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl",children:[l.jsx("h3",{className:"text-2xl font-bold text-white mb-4 text-center",children:"⏱️ Time's Up!"}),l.jsx("p",{className:"text-white/90 text-center mb-4",children:"Your 2-minute guest preview has ended. Redirecting to login..."}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsx("div",{className:"animate-spin text-4xl",children:"⟳"})})]})})]}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsx("div",{className:"text-center text-white",children:l.jsx("p",{children:"Loading..."})})})]})]})},FI=()=>{const n=ft(),[e,t]=A.useState(5),[r,s]=A.useState(!0),[o,a]=A.useState([{id:1,username:"Alex_24",name:"Alex",age:24,country:"USA",avatar:"👨",status:"Online"},{id:2,username:"Jordan_22",name:"Jordan",age:22,country:"UK",avatar:"👩",status:"Online"},{id:3,username:"Casey_25",name:"Casey",age:25,country:"Canada",avatar:"🧑",status:"Online"},{id:4,username:"Morgan_23",name:"Morgan",age:23,country:"Australia",avatar:"👩‍🦱",status:"Online"},{id:5,username:"Taylor_26",name:"Taylor",age:26,country:"Germany",avatar:"👨‍🦲",status:"Online"},{id:6,username:"Alex_27",name:"Alex",age:27,country:"France",avatar:"👨",status:"Online"},{id:7,username:"Sam_21",name:"Sam",age:21,country:"Canada",avatar:"👩",status:"Online"},{id:8,username:"Chris_28",name:"Chris",age:28,country:"Japan",avatar:"👨‍🦱",status:"Online"}]),[u,h]=A.useState(0),f=A.useRef(null);A.useEffect(()=>(r&&e>0?f.current=setTimeout(()=>{t(S=>S-1)},1e3):r&&e===0&&(y(),t(5)),()=>clearTimeout(f.current)),[e,r]);const y=()=>{u<o.length-1?(h(S=>S+1),t(5),s(!0)):(h(0),t(5),s(!0))},b=()=>{y()},x=()=>{K.emit("connect_user",{targetUserId:o[u].id}),n("/chat")},C=o[u],k=o[(u+1)%o.length];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:xi,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-8",children:l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"relative h-[600px] mb-8",children:[l.jsx("div",{className:"absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 transform scale-95 translate-y-4 opacity-50",children:l.jsxs("div",{className:"h-full flex flex-col justify-between",children:[l.jsxs("div",{children:[l.jsxs("h3",{className:"text-white font-bold text-xl mb-2",children:[k.name,", ",k.age]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["📍 ",k.country]})]}),l.jsx("div",{className:"text-center opacity-50",children:l.jsx("p",{className:"text-white/50 text-sm",children:"Next up..."})})]})}),l.jsxs("div",{className:"absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md rounded-3xl border-2 border-white/30 p-8 flex flex-col justify-between shadow-2xl hover:border-white/50 transition-all duration-300",children:[l.jsx("div",{className:"flex justify-center mb-6",children:l.jsx("div",{className:"w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-blue-600/50 border-4 border-white/40 text-white",children:C.avatar})}),l.jsxs("div",{children:[l.jsx("h2",{className:"text-white font-black text-3xl mb-1",children:C.name}),l.jsx("p",{className:"text-white/90 text-2xl font-bold mb-2",children:C.age}),l.jsxs("p",{className:"text-white/80 text-base mb-2",children:["📍 ",C.country]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["@",C.username]}),l.jsx("div",{className:"space-y-3",children:l.jsxs("div",{className:"bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20",children:[l.jsx("p",{className:"text-white/70 text-xs",children:"Status"}),l.jsxs("p",{className:"text-white font-bold text-sm",children:["🟢 ",C.status]})]})})]}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsxs("div",{className:"relative w-20 h-20",children:[l.jsxs("svg",{className:"w-20 h-20 transform -rotate-90",children:[l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"white",strokeWidth:"2",opacity:"0.2"}),l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"url(#gradient)",strokeWidth:"2",strokeDasharray:`${(5-e)/5*226.2} 226.2`,className:"transition-all duration-1000"}),l.jsx("defs",{children:l.jsxs("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[l.jsx("stop",{offset:"0%",stopColor:"#fbbf24"}),l.jsx("stop",{offset:"100%",stopColor:"#f59e0b"})]})})]}),l.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:l.jsx("span",{className:"text-white font-black text-2xl",children:e})})]})}),r&&l.jsx("div",{className:"text-center",children:l.jsxs("p",{className:"text-blue-400 text-sm font-semibold animate-pulse",children:["⚡ Auto-next in ",e,"s"]})})]})]}),l.jsxs("div",{className:"flex gap-4 justify-center",children:[l.jsx("button",{onClick:b,className:"flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 rounded-full font-bold text-white transition-all transform hover:scale-105 backdrop-blur",children:"👉 Skip"}),l.jsx("button",{onClick:x,className:"flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-105",children:"💬 Connect"})]}),l.jsx("div",{className:"mt-6 flex justify-center",children:l.jsx("button",{onClick:()=>s(!r),className:`px-6 py-2 rounded-full font-semibold text-sm transition-all ${r?"bg-blue-600/30 text-blue-200 border border-blue-400/50":"bg-white/10 text-white/70 border border-white/20"}`,children:r?"⚡ Auto-Next ON":"⏸️ Auto-Next OFF"})}),l.jsx("div",{className:"mt-4 text-center",children:l.jsxs("p",{className:"text-white/70 text-sm",children:["Showing ",u+1," of ",o.length," profiles"]})})]})})]})},UI=()=>{const n=ft(),{user:e}=A.useContext(Lt)||{},r=(localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null)||e||{name:"Guest User",email:"guest@flinxx.local",picture:null,googleId:"N/A"};console.log("👤 Profile Component - Loaded User:",r);const[s,o]=A.useState({username:(r==null?void 0:r.name)||"User",age:(r==null?void 0:r.age)||24,country:(r==null?void 0:r.location)||"Unknown",bio:"Welcome to my profile",avatar:"👨",gender:"Not specified",status:"Looking to chat",email:(r==null?void 0:r.email)||"",displayName:(r==null?void 0:r.name)||"",photoURL:(r==null?void 0:r.picture)||"",userId:(r==null?void 0:r.userId)||"N/A"}),[a,u]=A.useState(!0);A.useEffect(()=>{(async()=>{try{if(!(r!=null&&r.email)){console.log("⚠️ No user email found, using localStorage data only"),console.log("📋 Profile from localStorage:",{name:r==null?void 0:r.name,email:r==null?void 0:r.email,picture:r==null?void 0:r.picture,googleId:r==null?void 0:r.googleId}),u(!1);return}const N="https://flinxx-backend.onrender.com";console.log(`📋 Profile Component - Fetching from: ${N}/api/user/profile?email=${r.email}`);const G=await fetch(`${N}/api/user/profile?email=${encodeURIComponent(r.email)}`,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!G.ok)throw new Error(`Failed to fetch profile: ${G.status}`);const W=await G.json();console.log("✅ Profile data fetched from backend:",W.profile),W.profile?o(U=>({...U,email:W.profile.email||r.email||U.email,displayName:W.profile.name||r.name||U.displayName,photoURL:W.profile.picture||r.picture||U.photoURL,userId:W.profile.id||U.userId})):o(U=>({...U,email:r.email||U.email,displayName:r.name||U.displayName,photoURL:r.picture||U.photoURL,userId:r.userId||U.userId}))}catch(N){console.error("❌ Error fetching profile:",N),o(G=>({...G,email:r.email||G.email,displayName:r.name||G.displayName,photoURL:r.picture||G.photoURL,userId:r.userId||G.userId}))}finally{u(!1)}})()},[r==null?void 0:r.email]);const[h,f]=A.useState(!1),[y,b]=A.useState(s),x=S=>{const{name:N,value:G}=S.target;b(W=>({...W,[N]:N==="age"?parseInt(G):G}))},C=()=>{o(y),f(!1),console.log("Profile saved:",y)},k=["👨","👩","👦","👧","🧑","👨‍🦱","👩‍🦱","👨‍🦲","👩‍🦲"];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:xi,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 px-4 py-12",children:l.jsxs("div",{className:"max-w-2xl mx-auto",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8",children:[l.jsxs("div",{className:"flex flex-col items-center mb-8",children:[s.photoURL&&!h?l.jsx("div",{className:"w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/50 mb-6 border-4 border-white/30 overflow-hidden",children:l.jsx("img",{src:s.photoURL,alt:"Profile",className:"w-full h-full object-cover"})}):l.jsx("div",{className:"w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-7xl shadow-2xl shadow-blue-600/50 mb-6 border-4 border-white/30",children:h?l.jsx("div",{className:"grid grid-cols-3 gap-2 p-4",children:k.map(S=>l.jsx("button",{onClick:()=>b(N=>({...N,avatar:S})),className:`text-3xl p-2 rounded-lg transition-all ${y.avatar===S?"bg-white/30 border-2 border-white scale-110":"bg-white/10 hover:bg-white/20"}`,children:S},S))}):s.avatar}),!h&&l.jsx("p",{className:"text-white/70 text-sm",children:"Click Edit to change avatar"})]}),h?l.jsxs("div",{className:"space-y-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("input",{type:"text",name:"displayName",value:y.displayName,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your full name"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("input",{type:"email",name:"email",value:y.email,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your email"})]}),y.userId&&y.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID (Read-only)"}),l.jsx("input",{type:"text",value:y.userId,disabled:!0,className:"w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("input",{type:"text",name:"username",value:y.username,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsx("input",{type:"number",name:"age",value:y.age,onChange:x,min:"18",max:"100",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsx("input",{type:"text",name:"country",value:y.country,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsxs("select",{name:"gender",value:y.gender,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Male",children:"Male"}),l.jsx("option",{value:"Female",children:"Female"}),l.jsx("option",{value:"Other",children:"Other"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("textarea",{name:"bio",value:y.bio,onChange:x,rows:"4",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("select",{name:"status",value:y.status,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Looking to chat",children:"Looking to chat"}),l.jsx("option",{value:"Making friends",children:"Making friends"}),l.jsx("option",{value:"Just browsing",children:"Just browsing"})]})]}),l.jsxs("div",{className:"flex gap-4 pt-6",children:[l.jsx("button",{onClick:()=>{f(!1),b(s)},className:"flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all",children:"Cancel"}),l.jsx("button",{onClick:C,className:"flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"Save Profile"})]})]}):l.jsxs("div",{className:"space-y-6",children:[s.displayName&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.displayName})]}),s.email&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("p",{className:"text-white font-normal text-base mt-2",children:s.email})]}),s.userId&&s.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("p",{className:"text-white font-mono text-sm",children:s.userId}),l.jsx("button",{onClick:()=>navigator.clipboard.writeText(s.userId),className:"text-white/70 hover:text-white transition",title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.username})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:[s.age," years old"]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:["🌍 ",s.country]})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsx("p",{className:"text-white font-bold text-lg mt-2",children:s.gender})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("p",{className:"text-white/90 text-base mt-2",children:s.bio})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("span",{className:"w-3 h-3 bg-green-400 rounded-full animate-pulse"}),l.jsx("p",{className:"text-white font-semibold",children:s.status})]})]}),l.jsx("button",{onClick:()=>f(!0),className:"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"✏️ Edit Profile"})]})]}),l.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Matches"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"24"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Chats"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"8"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Time Online"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"42h"})]})]})]})})]})},BI=({value:n,onChange:e,maxDate:t})=>{const r=t?`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`:null;return l.jsx("input",{type:"date",value:n||"",onChange:s=>e(s.target.value),max:r,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900",placeholder:"",required:!0})},id=({user:n,onProfileComplete:e,isOpen:t})=>{const[r,s]=A.useState(""),[o,a]=A.useState(""),[u,h]=A.useState(null),[f,y]=A.useState(null),[b,x]=A.useState(!1),C=ft();A.useEffect(()=>{if(r){const[N,G,W]=r.split("-").map(Number),U=new Date(N,G-1,W),B=new Date;let fe=B.getFullYear()-U.getFullYear();const M=B.getMonth()-U.getMonth();(M<0||M===0&&B.getDate()<U.getDate())&&fe--,h(fe)}else h(null)},[r]);const k=!r||!o||b,S=async N=>{if(N.preventDefault(),!r||!o){y("Please fill in all required fields");return}if(u&&u<18){y("You must be 18+ to use this app");return}x(!0),y(null);try{const G="https://flinxx-backend.onrender.com",W=n.uuid||n.id||n.uid||n.googleId;if(!W)throw new Error("Unable to determine user ID");const U=await fetch(`${G}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:W,birthday:r||null,gender:o})}),B=await U.json();if(!U.ok){if(B.code==="UNDERAGE_USER"){y("You must be 18+ to use this app");return}y(B.error||"Failed to save profile");return}console.log("✅ Profile saved successfully:",B);const fe={...n,profileCompleted:!0,isProfileCompleted:!0,birthday:r,gender:o,age:u};localStorage.setItem("profileCompleted","true"),localStorage.setItem("user",JSON.stringify(fe)),e&&e(fe),setTimeout(()=>{C("/chat?view=home")},500)}catch(G){console.error("❌ Error saving profile:",G),y(G.message||"Network error. Please try again.")}finally{x(!1)}};return!t||!n?null:l.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto",children:l.jsx("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 my-8",children:l.jsxs("div",{className:"p-8",children:[l.jsxs("div",{className:"text-center mb-6",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Complete Your Profile"}),l.jsx("p",{className:"text-gray-600 text-sm",children:"Just a few more details to get started"})]}),l.jsx("div",{className:"flex justify-center mb-6",children:n.picture||n.photoURL?l.jsx("img",{src:n.picture||n.photoURL,alt:n.name||n.displayName,className:"w-20 h-20 rounded-full object-cover border-4 border-blue-500"}):l.jsx("div",{className:"w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500",children:l.jsx("span",{className:"text-gray-600 text-2xl",children:"👤"})})}),f&&l.jsx("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-lg",children:l.jsx("p",{className:"text-red-700 text-sm font-medium",children:f})}),l.jsxs("form",{onSubmit:S,className:"space-y-4",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Name"}),l.jsx("input",{type:"text",value:n.name||n.displayName||"",disabled:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Birthday ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsx(BI,{value:r,onChange:s,maxDate:new Date}),u!==null&&l.jsxs("p",{className:"text-xs text-gray-600 mt-1",children:["Age: ",l.jsxs("span",{className:u<18?"text-red-600 font-bold":"text-green-600 font-bold",children:[u," years old"]})]})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Gender ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsxs("select",{value:o,onChange:N=>a(N.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 appearance-none cursor-pointer",style:{backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 0.75rem center",backgroundSize:"1.5em 1.5em",paddingRight:"2.5rem"},required:!0,children:[l.jsx("option",{value:"",disabled:!0,children:"Select gender"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"})]})]}),l.jsx("button",{type:"submit",disabled:k,className:`w-full py-3 px-4 rounded-lg font-medium transition mt-6 ${k?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:b?l.jsxs("span",{className:"flex items-center justify-center",children:[l.jsx("span",{className:"inline-block animate-spin mr-2",children:"⏳"}),"Saving..."]}):"Save Profile"})]}),l.jsx("p",{className:"text-xs text-gray-500 text-center mt-4",children:"Your birthday and gender cannot be changed after saving."})]})})})};function $I(){const n=ft(),[e]=gc(),[t,r]=A.useState(!1),[s,o]=A.useState(null);A.useEffect(()=>{try{const u=e.get("token"),h=e.get("data"),f=e.get("error");if(console.log("🔐 Callback - Token:",u),console.log("📦 Callback - Data:",h),f){console.error("❌ OAuth Error:",f),n("/login?error="+encodeURIComponent(f),{replace:!0});return}if(u&&h)try{const b=JSON.parse(decodeURIComponent(h)).user;console.log("✅ User data extracted:",b),localStorage.setItem("token",u),localStorage.setItem("authToken",u),localStorage.setItem("user",JSON.stringify(b)),localStorage.setItem("authProvider","google"),localStorage.setItem("userInfo",JSON.stringify(b)),console.log("✅ User data saved:",b),b.profileCompleted?(console.log("✅ Profile completed, redirecting to chat..."),setTimeout(()=>{n("/chat")},500)):(console.log("ℹ️ Profile not completed, showing setup modal"),o(b),r(!0))}catch(y){console.error("❌ Error parsing response data:",y),n("/login?error=invalid_user_data",{replace:!0})}else console.error("❌ Missing token or data"),n("/login?error=missing_data",{replace:!0})}catch(u){console.error("❌ Callback error:",u),n("/login?error="+encodeURIComponent(u.message),{replace:!0})}},[e,n]);const a=u=>{console.log("✅ Profile completed, redirecting to chat"),r(!1),setTimeout(()=>{n("/chat")},500)};return t&&s?l.jsx(id,{user:s,onProfileComplete:a,isOpen:!0}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}function GI(){const n=ft(),{setAuthToken:e}=A.useContext(Lt)||{},[t]=gc(),[r,s]=A.useState(null),[o,a]=A.useState(!0),[u,h]=A.useState(null);return A.useEffect(()=>{(async()=>{var y,b,x;try{const C=t.get("token"),k=t.get("data");if(!C){h("No authentication token received"),a(!1);return}console.log("🔐 Auth Success - Token received:",C.substring(0,10)+"...");let S=null;if(k)try{S=JSON.parse(decodeURIComponent(k)),console.log("✅ Response data from backend:",S)}catch(B){console.warn("⚠️ Could not parse response data:",B)}const N=JSON.parse(atob(C)),W=await fetch(`https://flinxx-backend.onrender.com/auth-success?token=${C}`);if(!W.ok)throw new Error(`Failed to fetch user data: ${W.statusText}`);const U=await W.json();if(console.log("✅ User data received:",U.user.email),U.success&&U.user){const B=U.user;let fe=null;if(B.uuid&&typeof B.uuid=="string"&&B.uuid.length===36)fe=B.uuid,console.log("✅ Valid UUID found in user.uuid:",fe.substring(0,8)+"...");else if(B.id&&typeof B.id=="string"&&B.id.length===36)fe=B.id,console.log("✅ Valid UUID found in user.id (fallback):",fe.substring(0,8)+"...");else{console.error("❌ CRITICAL: No valid 36-char UUID found in backend response"),console.error("   user.uuid:",B.uuid,"(type:",typeof B.uuid+", length:",((y=B.uuid)==null?void 0:y.length)+")"),console.error("   user.id:",B.id,"(type:",typeof B.id+", length:",((b=B.id)==null?void 0:b.length)+")"),console.error("   Full response:",B),h("Authentication failed: Invalid UUID from server"),a(!1);return}const M={uuid:fe,name:B.name||B.display_name||"User",email:B.email,picture:B.picture||B.photo_url,profileCompleted:B.profileCompleted||!1};console.log("✅ User data normalized for storage (UUID ONLY):",{uuid:M.uuid.substring(0,8)+"...",email:M.email}),e?(console.log("[AuthSuccess] Storing token and user via AuthContext"),e(C,M)):(console.log("[AuthSuccess] AuthContext not available, saving to localStorage directly"),localStorage.setItem("token",C),localStorage.setItem("authToken",C),localStorage.setItem("user",JSON.stringify(M)),localStorage.setItem("authProvider","google"));const I=JSON.parse(localStorage.getItem("user")||"{}");console.log("✅ VERIFICATION - localStorage.user contents:",{has_uuid:!!I.uuid,uuid_length:(x=I.uuid)==null?void 0:x.length,has_id:!!I.id,has_email:!!I.email}),s(B),console.log("🔗 Routing all users to /chat (unified dashboard)"),setTimeout(()=>{n("/chat")},500)}else h(U.error||"Failed to authenticate")}catch(C){console.error("❌ Auth Success Error:",C),h(C.message||"An error occurred during authentication")}finally{a(!1)}})()},[t,n,e]),u?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-white text-2xl font-bold mb-4",children:"❌ Authentication Error"}),l.jsx("p",{className:"text-white/70 text-lg mb-6",children:u}),l.jsx("button",{onClick:()=>n("/login",{replace:!0}),className:"px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100",children:"Back to Login"})]})}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}const mc=()=>{const n=ft();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:xi,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Terms & Conditions"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("p",{className:"text-sm text-white/70 italic",children:"Last Updated: December 21, 2025"}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"1. Acceptance of Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:'By accessing and using the Flinxx platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"2. Use License"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"Permission is granted to temporarily download one copy of the materials (information or software) on Flinxx for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Modifying or copying the materials"}),l.jsx("li",{children:"Using the materials for any commercial purpose or for any public display"}),l.jsx("li",{children:"Attempting to decompile or reverse engineer any software contained on the Service"}),l.jsx("li",{children:"Removing any copyright or other proprietary notations from the materials"}),l.jsx("li",{children:'Transferring the materials to another person or "mirroring" the materials on any other server'}),l.jsx("li",{children:"Violating any laws or regulations applicable to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"3. Age Restriction"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"You must be at least 18 years of age to use this Service. By using Flinxx, you represent and warrant that you are at least 18 years old and have the legal right to use the platform in your jurisdiction."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"4. Disclaimer"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials on Flinxx are provided on an 'as is' basis. Flinxx makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"5. Limitations"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Flinxx, even if Flinxx or a Flinxx authorized representative has been notified orally or in writing of the possibility of such damage."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"6. Accuracy of Materials"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials appearing on Flinxx could include technical, typographical, or photographic errors. Flinxx does not warrant that any of the materials on its Service are accurate, complete, or current. Flinxx may make changes to the materials contained on the Service at any time without notice."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"7. User Conduct"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"You agree that you will not engage in any conduct that:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Violates any applicable law or regulation"}),l.jsx("li",{children:"Infringes upon or violates any intellectual property rights"}),l.jsx("li",{children:"Harasses, abuses, or threatens other users"}),l.jsx("li",{children:"Uploads malware, viruses, or other harmful code"}),l.jsx("li",{children:"Impersonates any person or entity"}),l.jsx("li",{children:"Shares non-consensual intimate content"}),l.jsx("li",{children:"Attempts to gain unauthorized access to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"8. Materials License"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By posting materials to Flinxx, you grant Flinxx a worldwide, royalty-free license to use, reproduce, modify and publish that material in any form, in any media now known or hereafter discovered. However, this license does not extend to any materials posted by other users."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"9. Limitations of Liability"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx, its employees, agents, suppliers, or any other affiliated parties be liable to you or any third party for any direct, indirect, consequential, special, or punitive damages whatsoever, including without limitation, damages for loss of profits, loss of use, business interruption, or loss of data, even if Flinxx has been advised of the possibility of such damages."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"10. Privacy Policy"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your use of Flinxx is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"11. Termination"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may terminate or suspend your account and access to the Service at any time, for any reason, without notice. Upon termination, your right to use the Service will immediately cease. You remain liable for all charges incurred through the date of termination."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"12. Modifications to Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service. If you do not agree to any of these terms, or any revised terms, please stop using the Service."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"13. Governing Law"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Flinxx operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"14. Contact Information"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you have any questions about these Terms & Conditions, please contact us at: support@flinxx.com"})]}),l.jsx("div",{className:"pt-6 border-t border-white/20",children:l.jsx("p",{className:"text-sm text-white/70",children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},WI=()=>{const n=ft();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:xi,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Privacy Policy"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By accessing or using Flinxx, you agree to this Privacy Policy."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is a live interaction platform where users and streamers communicate in real time. Due to the nature of live content, complete privacy cannot be guaranteed."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx hosts multiple streamers and users. You understand that any user or streamer may record video, audio, or interactions without your consent and may upload or share such content on external platforms. You are solely responsible for your own privacy and actions. Flinxx provides no guarantee or control over such recordings or uploads."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your video, audio, messages, and interactions may also be recorded, stored, reviewed, or used by Flinxx for safety, moderation, legal compliance, marketing, promotional, or platform improvement purposes. By continuing, you give your full consent."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is not responsible or liable for screenshots, screen recordings, re-uploads, misuse, or distribution of content by users or streamers outside the platform. You agree that you use Flinxx at your own risk."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"We do not guarantee the behavior, conduct, or content of any user or streamer. Flinxx shall not be held liable for any loss, damage, harassment, or misuse arising from live interactions."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Basic information such as device data, usage activity, and login details may be collected to operate, secure, and improve the platform."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you do not agree with this Privacy Policy, please discontinue use of Flinxx immediately."})}),l.jsx("div",{className:"text-sm text-white/50 italic pt-6 border-t border-white/20",children:l.jsx("p",{children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},HI=({children:n})=>{const e=ft(),t=A.useContext(Lt),r=t==null?void 0:t.user,s=t==null?void 0:t.isLoading,[o,a]=A.useState(!1),[u,h]=A.useState(null),[f,y]=A.useState(!0);console.log(`
[ProtectedChatRoute] 🟢 RENDER CALLED`),console.log("[ProtectedChatRoute]   - isLoading:",f),console.log("[ProtectedChatRoute]   - showProfileSetup:",o),console.log("[ProtectedChatRoute]   - authLoading:",s),console.log("[ProtectedChatRoute]   - authUser:",r?r.email:"null"),A.useEffect(()=>{console.log(`

🔴 [ProtectedChatRoute] ═══════════════════════════════════════════`),console.log("🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK"),console.log("🔴 [ProtectedChatRoute] ═══════════════════════════════════════════"),console.log("🔴 [ProtectedChatRoute] Effect dependencies changed:"),console.log("🔴 [ProtectedChatRoute]   - authLoading:",s),console.log("🔴 [ProtectedChatRoute]   - authUser:",r?r.email:"null");try{if(s===!0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext is still initializing (isLoading=true)"),y(!0);return}if(s===void 0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext loading state is undefined"),y(!0);return}if(console.log("🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)"),!r){console.log("🔴 [ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found"),console.log("🔴 [ProtectedChatRoute] Redirecting to /login"),y(!1),e("/login",{replace:!0});return}console.log("🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user:",r.email),console.log("🔴 [ProtectedChatRoute] authUser object:",{id:r.id,email:r.email,profileCompleted:r.profileCompleted,birthday:r.birthday,gender:r.gender}),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted type:",typeof r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted value:",r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted === true?",r.profileCompleted===!0);const x=localStorage.getItem("user");if(console.log("🔴 [ProtectedChatRoute] Checking localStorage:"),console.log("🔴 [ProtectedChatRoute]   - user key exists:",!!x),x)try{const N=JSON.parse(x);console.log("🔴 [ProtectedChatRoute] localStorage user:",{id:N.id,email:N.email,profileCompleted:N.profileCompleted}),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted type:",typeof N.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted value:",N.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted === true?",N.profileCompleted===!0)}catch(N){console.error("[ProtectedChatRoute] Failed to parse localStorage user:",N)}else console.log("[ProtectedChatRoute] ⚠️ No user in localStorage");h(r),console.log(`
🔴 [ProtectedChatRoute] PROFILE COMPLETION CHECK:`);const C=r==null?void 0:r.profileCompleted;console.log("🔴 [ProtectedChatRoute]   Source 1 (AuthContext):"),console.log("🔴 [ProtectedChatRoute]     authUser.profileCompleted =",C),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof C),console.log("🔴 [ProtectedChatRoute]     === true?",C===!0);let k=null;x?(k=JSON.parse(x).profileCompleted,console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage):"),console.log("🔴 [ProtectedChatRoute]     localStorage.profileCompleted =",k),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof k),console.log("🔴 [ProtectedChatRoute]     === true?",k===!0)):console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage): not available");const S=C===!0||k===!0;console.log(`
🔴 [ProtectedChatRoute] FINAL DECISION:`),console.log("🔴 [ProtectedChatRoute]   profileCompletedAuth === true?",C===!0),console.log("🔴 [ProtectedChatRoute]   profileCompletedStorage === true?",k===!0),console.log("🔴 [ProtectedChatRoute]   isProfileComplete (final):",S),S?(console.log(`
🔴 [ProtectedChatRoute] ✅ DECISION: Profile IS completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING Chat page
`)):(console.log(`
🔴 [ProtectedChatRoute] ❌ DECISION: Profile NOT completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal
`),a(!0)),y(!1)}catch(x){console.error("[ProtectedChatRoute] ❌ ERROR in profile check:",x),console.error("[ProtectedChatRoute] Stack:",x.stack),y(!1),e("/login",{replace:!0})}},[e,r,s]);const b=x=>{console.log("Profile completed:",x),a(!1),h(x)};return f?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Loading..."})]})}):l.jsxs(l.Fragment,{children:[o&&u&&l.jsx(id,{user:u,onProfileComplete:b,isOpen:!0}),!o&&n]})},qI=({isOpen:n=!0,onClose:e})=>{const{user:t}=A.useContext(Lt)||{},{markAsRead:r}=A.useContext(ua)||{},{refetchUnreadCount:s}=ga()||{},[o,a]=A.useState(null),[u,h]=A.useState(null),f=A.useRef(!1);A.useEffect(()=>{console.log("🎯 MyDuoSquad mounted")},[]),A.useEffect(()=>{if(o!==null||f.current||!n||!(t!=null&&t.uuid))return;(async()=>{try{const C=await Fh(t.uuid),k=Array.isArray(C)?C.sort((S,N)=>{const G=S.last_message_at?new Date(S.last_message_at):new Date(0);return(N.last_message_at?new Date(N.last_message_at):new Date(0))-G}):[];a(k),f.current=!0}catch(C){console.error("❌ Failed to fetch accepted friends:",C),a([]),f.current=!0}})()},[n,t==null?void 0:t.uuid]);const y=(x,C)=>{a(k=>k.map(N=>N.id===x?{...N,last_message_at:C}:N).sort((N,G)=>{const W=N.last_message_at?new Date(N.last_message_at):new Date(0);return(G.last_message_at?new Date(G.last_message_at):new Date(0))-W})),s&&s()},b=async x=>{try{t!=null&&t.uuid&&t.uuid.length===36&&x.id&&await jr(t.uuid,x.id),r&&x.id&&r(x.id),h(x),s&&s()}catch(C){console.error("❌ Error marking messages as read:",C),h(x)}};return l.jsxs("div",{className:"duo-panel w-full h-full rounded-3xl p-8 flex flex-col items-start justify-start text-left relative",style:{backgroundColor:"#131313",border:"1px solid #d9b85f",overflow:"hidden",display:"flex",flexDirection:"column"},children:[l.jsx("button",{className:"modal-close-btn",onClick:e,title:"Close",children:"✕"}),l.jsx("div",{className:"w-full mb-6",children:l.jsx("h3",{className:"text-2xl font-bold",style:{color:"#d9b85f"},children:"My Duo Squad"})}),l.jsx("div",{className:"duo-friends-list",style:{flex:1,width:"100%",overflowY:"auto"},children:u?l.jsx(Ao,{friend:u,onBack:()=>h(null),onMessageSent:y}):o===null?l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"20px"},children:"Loading squad..."}):o.length===0?l.jsxs("div",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"20px"},children:[l.jsx("p",{children:"No squad members yet"}),l.jsx("p",{style:{fontSize:"12px",marginTop:"8px"},children:"Add friends to build your duo squad"})]}):o.map(x=>l.jsxs("div",{className:"notification-item",style:{marginBottom:"0"},children:[l.jsx("div",{className:"notification-avatar",children:x.photo_url?l.jsx("img",{src:x.photo_url,alt:x.display_name}):l.jsx("div",{className:"text-avatar",children:x.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:x.display_name})}),l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:()=>b(x),title:"Send a message",children:"Message"})})]},x.id))})]})};function zI(){const{isDuoSquadOpen:n,closeDuoSquad:e}=sd();return l.jsxs(l.Fragment,{children:[n&&l.jsx("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999},children:l.jsx(qI,{isOpen:n,onClose:e})}),l.jsx("div",{style:{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column"},children:l.jsxs(Sd,{children:[l.jsx(gt,{path:"/",element:l.jsx(_I,{})}),l.jsx(gt,{path:"/login",element:l.jsx(xI,{})}),l.jsx(gt,{path:"/terms",element:l.jsx(mc,{})}),l.jsx(gt,{path:"/terms-and-conditions",element:l.jsx(mc,{})}),l.jsx(gt,{path:"/privacy-policy",element:l.jsx(WI,{})}),l.jsx(gt,{path:"/callback",element:l.jsx($I,{})}),l.jsx(gt,{path:"/auth-success",element:l.jsx(GI,{})}),l.jsx(gt,{path:"/chat",element:l.jsx(HI,{children:l.jsx(VI,{})})}),l.jsx(gt,{path:"/matching",element:l.jsx(FI,{})}),l.jsx(gt,{path:"/profile",element:l.jsx(UI,{})}),l.jsx(gt,{path:"*",element:l.jsx(JI,{})})]})})]})}function KI(){return l.jsx(yI,{children:l.jsx(TI,{children:l.jsx(Cd,{children:l.jsx(zI,{})})})})}const JI=()=>l.jsx("div",{className:"min-h-screen flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-5xl font-bold text-indigo-400 mb-4",children:"404"}),l.jsx("p",{className:"text-gray-300 mb-8",children:"Page not found"}),l.jsx("button",{onClick:()=>window.location.href="/",className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer",children:"Go Home"})]})});function QI(){return l.jsx("div",{style:{width:"100%",height:"100vh"},children:l.jsx(KI,{})})}Zi.createRoot(document.getElementById("root")).render(l.jsx(It.StrictMode,{children:l.jsx(Md,{clientId:"373922547944-gm8fgpgjebnraruomkpajoa7s3nqups0.apps.googleusercontent.com",onScriptProps:{async:!0,defer:!0,nonce:"YOUR_NONCE_VALUE"},children:l.jsx(Iw,{children:l.jsx(gI,{children:l.jsx(bw,{children:l.jsx(QI,{})})})})})}));
//# sourceMappingURL=index-gg0tzI5w.js.map
