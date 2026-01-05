import{r as T,a as Td,R as Kn,u as ft,b as Ad,c as yc,B as Cd,d as Sd,e as yt}from"./vendor-CWYb8WqM.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var vc={exports:{}},oi={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rd=T,Nd=Symbol.for("react.element"),kd=Symbol.for("react.fragment"),Pd=Object.prototype.hasOwnProperty,jd=Rd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Od={key:!0,ref:!0,__self:!0,__source:!0};function _c(n,e,t){var r,s={},o=null,a=null;t!==void 0&&(o=""+t),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)Pd.call(e,r)&&!Od.hasOwnProperty(r)&&(s[r]=e[r]);if(n&&n.defaultProps)for(r in e=n.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:Nd,type:n,key:o,ref:a,props:s,_owner:jd.current}}oi.Fragment=kd;oi.jsx=_c;oi.jsxs=_c;vc.exports=oi;var l=vc.exports,eo={},el=Td;eo.createRoot=el.createRoot,eo.hydrateRoot=el.hydrateRoot;function Dd(n={}){const{nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}=n,[s,o]=T.useState(!1),a=T.useRef(t);a.current=t;const u=T.useRef(r);return u.current=r,T.useEffect(()=>{const h=document.createElement("script");return h.src="https://accounts.google.com/gsi/client",h.async=!0,h.defer=!0,h.nonce=e,h.onload=()=>{var f;o(!0),(f=a.current)===null||f===void 0||f.call(a)},h.onerror=()=>{var f;o(!1),(f=u.current)===null||f===void 0||f.call(u)},document.body.appendChild(h),()=>{document.body.removeChild(h)}},[e]),s}const Ld=T.createContext(null);function Md({clientId:n,nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r,children:s}){const o=Dd({nonce:e,onScriptLoadSuccess:t,onScriptLoadError:r}),a=T.useMemo(()=>({clientId:n,scriptLoadedSuccessfully:o}),[n,o]);return Kn.createElement(Ld.Provider,{value:a},s)}var tl={};/**
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
 */const wc=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Fd=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],u=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},Ic={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,y=o>>2,E=(o&3)<<4|u>>4;let x=(u&15)<<2|f>>6,C=f&63;h||(C=64,a||(x=64)),r.push(t[y],t[E],t[x],t[C])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(wc(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Fd(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const f=s<n.length?t[n.charAt(s)]:64;++s;const E=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||u==null||f==null||E==null)throw new Vd;const x=o<<2|u>>4;if(r.push(x),f!==64){const C=u<<4&240|f>>2;if(r.push(C),E!==64){const P=f<<6&192|E;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Vd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ud=function(n){const e=wc(n);return Ic.encodeByteArray(e,!0)},Us=function(n){return Ud(n).replace(/\./g,"")},Ec=function(n){try{return Ic.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */const $d=()=>Bd().__FIREBASE_DEFAULTS__,Gd=()=>{if(typeof process>"u"||typeof tl>"u")return;const n=tl.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Hd=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ec(n[1]);return e&&JSON.parse(e)},ai=()=>{try{return $d()||Gd()||Hd()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bc=n=>{var e,t;return(t=(e=ai())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Wd=n=>{const e=bc(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},xc=()=>{var n;return(n=ai())===null||n===void 0?void 0:n.config},Tc=n=>{var e;return(e=ai())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */function zd(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Us(JSON.stringify(t)),Us(JSON.stringify(a)),""].join(".")}/**
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
 */function Ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ze())}function Jd(){var n;const e=(n=ai())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Qd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ac(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Yd(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Xd(){const n=Ze();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Zd(){return!Jd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Cc(){try{return typeof indexedDB=="object"}catch{return!1}}function Sc(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}function ef(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const tf="FirebaseError";class xt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=tf,Object.setPrototypeOf(this,xt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Pn.prototype.create)}}class Pn{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?nf(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new xt(s,u,r)}}function nf(n,e){return n.replace(rf,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const rf=/\{\$([^}]+)}/g;function sf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Dr(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(nl(o)&&nl(a)){if(!Dr(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function nl(n){return n!==null&&typeof n=="object"}/**
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
 */function zr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function of(n,e){const t=new af(n,e);return t.subscribe.bind(t)}class af{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");lf(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Mi),s.error===void 0&&(s.error=Mi),s.complete===void 0&&(s.complete=Mi);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function lf(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Mi(){}/**
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
 */const cf=1e3,uf=2,hf=4*60*60*1e3,df=.5;function rl(n,e=cf,t=uf){const r=e*Math.pow(t,n),s=Math.round(df*r*(Math.random()-.5)*2);return Math.min(hf,r+s)}/**
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
 */function nt(n){return n&&n._delegate?n._delegate:n}class bt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const wn="[DEFAULT]";/**
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
 */class ff{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new qd;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(mf(e))try{this.getOrInitializeService({instanceIdentifier:wn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=wn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=wn){return this.instances.has(e)}getOptions(e=wn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&e(a,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:pf(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=wn){return this.component?this.component.multipleInstances?e:wn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function pf(n){return n===wn?void 0:n}function mf(n){return n.instantiationMode==="EAGER"}/**
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
 */var ie;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ie||(ie={}));const yf={debug:ie.DEBUG,verbose:ie.VERBOSE,info:ie.INFO,warn:ie.WARN,error:ie.ERROR,silent:ie.SILENT},vf=ie.INFO,_f={[ie.DEBUG]:"log",[ie.VERBOSE]:"log",[ie.INFO]:"info",[ie.WARN]:"warn",[ie.ERROR]:"error"},wf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=_f[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class li{constructor(e){this.name=e,this._logLevel=vf,this._logHandler=wf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?yf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ie.DEBUG,...e),this._logHandler(this,ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ie.VERBOSE,...e),this._logHandler(this,ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ie.INFO,...e),this._logHandler(this,ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ie.WARN,...e),this._logHandler(this,ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ie.ERROR,...e),this._logHandler(this,ie.ERROR,...e)}}const If=(n,e)=>e.some(t=>n instanceof t);let sl,il;function Ef(){return sl||(sl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function bf(){return il||(il=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Rc=new WeakMap,to=new WeakMap,Nc=new WeakMap,Fi=new WeakMap,So=new WeakMap;function xf(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(an(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Rc.set(t,n)}).catch(()=>{}),So.set(e,n),e}function Tf(n){if(to.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});to.set(n,e)}let no={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return to.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Nc.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return an(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Af(n){no=n(no)}function Cf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Vi(this),e,...t);return Nc.set(r,e.sort?e.sort():[e]),an(r)}:bf().includes(n)?function(...e){return n.apply(Vi(this),e),an(Rc.get(this))}:function(...e){return an(n.apply(Vi(this),e))}}function Sf(n){return typeof n=="function"?Cf(n):(n instanceof IDBTransaction&&Tf(n),If(n,Ef())?new Proxy(n,no):n)}function an(n){if(n instanceof IDBRequest)return xf(n);if(Fi.has(n))return Fi.get(n);const e=Sf(n);return e!==n&&(Fi.set(n,e),So.set(e,n)),e}const Vi=n=>So.get(n);function kc(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),u=an(a);return r&&a.addEventListener("upgradeneeded",h=>{r(an(a.result),h.oldVersion,h.newVersion,an(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),u}const Rf=["get","getKey","getAll","getAllKeys","count"],Nf=["put","add","delete","clear"],Ui=new Map;function ol(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ui.get(e))return Ui.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Nf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Rf.includes(t)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let f=h.store;return r&&(f=f.index(u.shift())),(await Promise.all([f[t](...u),s&&h.done]))[0]};return Ui.set(e,o),o}Af(n=>({...n,get:(e,t,r)=>ol(e,t)||n.get(e,t,r),has:(e,t)=>!!ol(e,t)||n.has(e,t)}));/**
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
 */class kf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Pf(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Pf(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ro="@firebase/app",al="0.10.13";/**
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
 */const Qt=new li("@firebase/app"),jf="@firebase/app-compat",Of="@firebase/analytics-compat",Df="@firebase/analytics",Lf="@firebase/app-check-compat",Mf="@firebase/app-check",Ff="@firebase/auth",Vf="@firebase/auth-compat",Uf="@firebase/database",Bf="@firebase/data-connect",$f="@firebase/database-compat",Gf="@firebase/functions",Hf="@firebase/functions-compat",Wf="@firebase/installations",qf="@firebase/installations-compat",zf="@firebase/messaging",Kf="@firebase/messaging-compat",Jf="@firebase/performance",Qf="@firebase/performance-compat",Yf="@firebase/remote-config",Xf="@firebase/remote-config-compat",Zf="@firebase/storage",ep="@firebase/storage-compat",tp="@firebase/firestore",np="@firebase/vertexai-preview",rp="@firebase/firestore-compat",sp="firebase",ip="10.14.1";/**
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
 */const so="[DEFAULT]",op={[ro]:"fire-core",[jf]:"fire-core-compat",[Df]:"fire-analytics",[Of]:"fire-analytics-compat",[Mf]:"fire-app-check",[Lf]:"fire-app-check-compat",[Ff]:"fire-auth",[Vf]:"fire-auth-compat",[Uf]:"fire-rtdb",[Bf]:"fire-data-connect",[$f]:"fire-rtdb-compat",[Gf]:"fire-fn",[Hf]:"fire-fn-compat",[Wf]:"fire-iid",[qf]:"fire-iid-compat",[zf]:"fire-fcm",[Kf]:"fire-fcm-compat",[Jf]:"fire-perf",[Qf]:"fire-perf-compat",[Yf]:"fire-rc",[Xf]:"fire-rc-compat",[Zf]:"fire-gcs",[ep]:"fire-gcs-compat",[tp]:"fire-fst",[rp]:"fire-fst-compat",[np]:"fire-vertex","fire-js":"fire-js",[sp]:"fire-js-all"};/**
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
 */const Bs=new Map,ap=new Map,io=new Map;function ll(n,e){try{n.container.addComponent(e)}catch(t){Qt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Rt(n){const e=n.name;if(io.has(e))return Qt.debug(`There were multiple attempts to register component ${e}.`),!1;io.set(e,n);for(const t of Bs.values())ll(t,n);for(const t of ap.values())ll(t,n);return!0}function jn(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ct(n){return n.settings!==void 0}/**
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
 */const lp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ln=new Pn("app","Firebase",lp);/**
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
 */class cp{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new bt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ln.create("app-deleted",{appName:this._name})}}/**
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
 */const tr=ip;function Pc(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:so,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw ln.create("bad-app-name",{appName:String(s)});if(t||(t=xc()),!t)throw ln.create("no-options");const o=Bs.get(s);if(o){if(Dr(t,o.options)&&Dr(r,o.config))return o;throw ln.create("duplicate-app",{appName:s})}const a=new gf(s);for(const h of io.values())a.addComponent(h);const u=new cp(t,r,a);return Bs.set(s,u),u}function Ro(n=so){const e=Bs.get(n);if(!e&&n===so&&xc())return Pc();if(!e)throw ln.create("no-app",{appName:n});return e}function dt(n,e,t){var r;let s=(r=op[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const u=[`Unable to register library "${s}" with version "${e}":`];o&&u.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&u.push("and"),a&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qt.warn(u.join(" "));return}Rt(new bt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const up="firebase-heartbeat-database",hp=1,Lr="firebase-heartbeat-store";let Bi=null;function jc(){return Bi||(Bi=kc(up,hp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Lr)}catch(t){console.warn(t)}}}}).catch(n=>{throw ln.create("idb-open",{originalErrorMessage:n.message})})),Bi}async function dp(n){try{const t=(await jc()).transaction(Lr),r=await t.objectStore(Lr).get(Oc(n));return await t.done,r}catch(e){if(e instanceof xt)Qt.warn(e.message);else{const t=ln.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qt.warn(t.message)}}}async function cl(n,e){try{const r=(await jc()).transaction(Lr,"readwrite");await r.objectStore(Lr).put(e,Oc(n)),await r.done}catch(t){if(t instanceof xt)Qt.warn(t.message);else{const r=ln.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Qt.warn(r.message)}}}function Oc(n){return`${n.name}!${n.options.appId}`}/**
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
 */const fp=1024,pp=30*24*60*60*1e3;class mp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new yp(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ul();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const u=new Date(a.date).valueOf();return Date.now()-u<=pp}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Qt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ul(),{heartbeatsToSend:r,unsentEntries:s}=gp(this._heartbeatsCache.heartbeats),o=Us(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return Qt.warn(t),""}}}function ul(){return new Date().toISOString().substring(0,10)}function gp(n,e=fp){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),hl(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),hl(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class yp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Cc()?Sc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await dp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return cl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return cl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function hl(n){return Us(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function vp(n){Rt(new bt("platform-logger",e=>new kf(e),"PRIVATE")),Rt(new bt("heartbeat",e=>new mp(e),"PRIVATE")),dt(ro,al,n),dt(ro,al,"esm2017"),dt("fire-js","")}vp("");function No(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function Dc(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _p=Dc,Lc=new Pn("auth","Firebase",Dc());/**
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
 */const $s=new li("@firebase/auth");function wp(n,...e){$s.logLevel<=ie.WARN&&$s.warn(`Auth (${tr}): ${n}`,...e)}function Ss(n,...e){$s.logLevel<=ie.ERROR&&$s.error(`Auth (${tr}): ${n}`,...e)}/**
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
 */function Nt(n,...e){throw Po(n,...e)}function Et(n,...e){return Po(n,...e)}function ko(n,e,t){const r=Object.assign(Object.assign({},_p()),{[e]:t});return new Pn("auth","Firebase",r).create(e,{appName:n.name})}function cn(n){return ko(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Mc(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Nt(n,"argument-error"),ko(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Po(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Lc.create(n,...e)}function Q(n,e,...t){if(!n)throw Po(e,...t)}function Wt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ss(e),new Error(e)}function Yt(n,e){n||Wt(e)}/**
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
 */function oo(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ip(){return dl()==="http:"||dl()==="https:"}function dl(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function Ep(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ip()||Ac()||"connection"in navigator)?navigator.onLine:!0}function bp(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Kr{constructor(e,t){this.shortDelay=e,this.longDelay=t,Yt(t>e,"Short delay should be less than long delay!"),this.isMobile=Kd()||Yd()}get(){return Ep()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function jo(n,e){Yt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Fc{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Wt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Wt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Wt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Tp=new Kr(3e4,6e4);function Oo(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function nr(n,e,t,r,s={}){return Vc(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const u=zr(Object.assign({key:n.config.apiKey},a)).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const f=Object.assign({method:e,headers:h},o);return Qd()||(f.referrerPolicy="no-referrer"),Fc.fetch()(Uc(n,n.config.apiHost,t,u),f)})}async function Vc(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},xp),e);try{const s=new Cp(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw ws(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const u=o.ok?a.errorMessage:a.error.message,[h,f]=u.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw ws(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw ws(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw ws(n,"user-disabled",a);const y=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw ko(n,y,f);Nt(n,y)}}catch(s){if(s instanceof xt)throw s;Nt(n,"network-request-failed",{message:String(s)})}}async function Ap(n,e,t,r,s={}){const o=await nr(n,e,t,r,s);return"mfaPendingCredential"in o&&Nt(n,"multi-factor-auth-required",{_serverResponse:o}),o}function Uc(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?jo(n.config,s):`${n.config.apiScheme}://${s}`}class Cp{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Et(this.auth,"network-request-failed")),Tp.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ws(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Et(n,e,r);return s.customData._tokenResponse=t,s}/**
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
 */async function Sp(n,e){return nr(n,"POST","/v1/accounts:delete",e)}async function Bc(n,e){return nr(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Sr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rp(n,e=!1){const t=nt(n),r=await t.getIdToken(e),s=Do(r);Q(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o==null?void 0:o.sign_in_provider;return{claims:s,token:r,authTime:Sr($i(s.auth_time)),issuedAtTime:Sr($i(s.iat)),expirationTime:Sr($i(s.exp)),signInProvider:a||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function $i(n){return Number(n)*1e3}function Do(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ss("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ec(t);return s?JSON.parse(s):(Ss("Failed to decode base64 JWT payload"),null)}catch(s){return Ss("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function fl(n){const e=Do(n);return Q(e,"internal-error"),Q(typeof e.exp<"u","internal-error"),Q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Mr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof xt&&Np(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Np({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class ao{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Sr(this.lastLoginAt),this.creationTime=Sr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Gs(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Mr(n,Bc(t,{idToken:r}));Q(s==null?void 0:s.users.length,t,"internal-error");const o=s.users[0];n._notifyReloadListener(o);const a=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?$c(o.providerUserInfo):[],u=jp(n.providerData,a),h=n.isAnonymous,f=!(n.email&&o.passwordHash)&&!(u!=null&&u.length),y=h?f:!1,E={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new ao(o.createdAt,o.lastLoginAt),isAnonymous:y};Object.assign(n,E)}async function Pp(n){const e=nt(n);await Gs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function jp(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function $c(n){return n.map(e=>{var{providerId:t}=e,r=No(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function Op(n,e){const t=await Vc(n,{},async()=>{const r=zr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=Uc(n,s,"/v1/token",`key=${o}`),u=await n._getAdditionalHeaders();return u["Content-Type"]="application/x-www-form-urlencoded",Fc.fetch()(a,{method:"POST",headers:u,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Dp(n,e){return nr(n,"POST","/v2/accounts:revokeToken",Oo(n,e))}/**
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
 */class Gn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Q(e.idToken,"internal-error"),Q(typeof e.idToken<"u","internal-error"),Q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):fl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Q(e.length!==0,"internal-error");const t=fl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await Op(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new Gn;return r&&(Q(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(Q(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(Q(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Gn,this.toJSON())}_performRefresh(){return Wt("not implemented")}}/**
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
 */function rn(n,e){Q(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class qt{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,o=No(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new ao(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Mr(this,this.stsTokenManager.getToken(this.auth,e));return Q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rp(this,e)}reload(){return Pp(this)}_assign(e){this!==e&&(Q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new qt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Gs(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ct(this.auth.app))return Promise.reject(cn(this.auth));const e=await this.getIdToken();return await Mr(this,Sp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,o,a,u,h,f,y;const E=(r=t.displayName)!==null&&r!==void 0?r:void 0,x=(s=t.email)!==null&&s!==void 0?s:void 0,C=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,P=(a=t.photoURL)!==null&&a!==void 0?a:void 0,S=(u=t.tenantId)!==null&&u!==void 0?u:void 0,k=(h=t._redirectEventId)!==null&&h!==void 0?h:void 0,G=(f=t.createdAt)!==null&&f!==void 0?f:void 0,H=(y=t.lastLoginAt)!==null&&y!==void 0?y:void 0,{uid:U,emailVerified:B,isAnonymous:de,providerData:L,stsTokenManager:I}=t;Q(U&&I,e,"internal-error");const m=Gn.fromJSON(this.name,I);Q(typeof U=="string",e,"internal-error"),rn(E,e.name),rn(x,e.name),Q(typeof B=="boolean",e,"internal-error"),Q(typeof de=="boolean",e,"internal-error"),rn(C,e.name),rn(P,e.name),rn(S,e.name),rn(k,e.name),rn(G,e.name),rn(H,e.name);const g=new qt({uid:U,auth:e,email:x,emailVerified:B,displayName:E,isAnonymous:de,photoURL:P,phoneNumber:C,tenantId:S,stsTokenManager:m,createdAt:G,lastLoginAt:H});return L&&Array.isArray(L)&&(g.providerData=L.map(_=>Object.assign({},_))),k&&(g._redirectEventId=k),g}static async _fromIdTokenResponse(e,t,r=!1){const s=new Gn;s.updateFromServerResponse(t);const o=new qt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Gs(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];Q(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?$c(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(o!=null&&o.length),u=new Gn;u.updateFromIdToken(r);const h=new qt({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new ao(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(o!=null&&o.length)};return Object.assign(h,f),h}}/**
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
 */const pl=new Map;function zt(n){Yt(n instanceof Function,"Expected a class definition");let e=pl.get(n);return e?(Yt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,pl.set(n,e),e)}/**
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
 */class Gc{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Gc.type="NONE";const ml=Gc;/**
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
 */function Rs(n,e,t){return`firebase:${n}:${e}:${t}`}class Hn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=Rs(this.userKey,s.apiKey,o),this.fullPersistenceKey=Rs("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?qt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Hn(zt(ml),e,r);const s=(await Promise.all(t.map(async f=>{if(await f._isAvailable())return f}))).filter(f=>f);let o=s[0]||zt(ml);const a=Rs(r,e.config.apiKey,e.name);let u=null;for(const f of t)try{const y=await f._get(a);if(y){const E=qt._fromJSON(e,y);f!==o&&(u=E),o=f;break}}catch{}const h=s.filter(f=>f._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new Hn(o,e,r):(o=h[0],u&&await o._set(a,u.toJSON()),await Promise.all(t.map(async f=>{if(f!==o)try{await f._remove(a)}catch{}})),new Hn(o,e,r))}}/**
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
 */function gl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(zc(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Hc(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Jc(e))return"Blackberry";if(Qc(e))return"Webos";if(Wc(e))return"Safari";if((e.includes("chrome/")||qc(e))&&!e.includes("edge/"))return"Chrome";if(Kc(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Hc(n=Ze()){return/firefox\//i.test(n)}function Wc(n=Ze()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function qc(n=Ze()){return/crios\//i.test(n)}function zc(n=Ze()){return/iemobile/i.test(n)}function Kc(n=Ze()){return/android/i.test(n)}function Jc(n=Ze()){return/blackberry/i.test(n)}function Qc(n=Ze()){return/webos/i.test(n)}function Lo(n=Ze()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Lp(n=Ze()){var e;return Lo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Mp(){return Xd()&&document.documentMode===10}function Yc(n=Ze()){return Lo(n)||Kc(n)||Qc(n)||Jc(n)||/windows phone/i.test(n)||zc(n)}/**
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
 */function Xc(n,e=[]){let t;switch(n){case"Browser":t=gl(Ze());break;case"Worker":t=`${gl(Ze())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${tr}/${r}`}/**
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
 */class Fp{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=o=>new Promise((a,u)=>{try{const h=e(o);a(h)}catch(h){u(h)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Vp(n,e={}){return nr(n,"GET","/v2/passwordPolicy",Oo(n,e))}/**
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
 */class $p{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new yl(this),this.idTokenSubscription=new yl(this),this.beforeStateQueue=new Fp(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Lc,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=zt(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Hn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Bc(this,{idToken:e}),r=await qt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ct(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=s==null?void 0:s._redirectEventId,h=await this.tryRedirectSignIn(e);(!a||a===u)&&(h!=null&&h.user)&&(s=h.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return Q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Gs(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=bp()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ct(this.app))return Promise.reject(cn(this));const t=e?nt(e):null;return t&&Q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ct(this.app)?Promise.reject(cn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ct(this.app)?Promise.reject(cn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(zt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Vp(this),t=new Bp(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Pn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Dp(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&zt(e)||this._popupRedirectResolver;Q(t,this,"argument-error"),this.redirectPersistenceManager=await Hn.create(this,[zt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(Q(u,this,"internal-error"),u.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Xc(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wp(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function rr(n){return nt(n)}class yl{constructor(e){this.auth=e,this.observer=null,this.addObserver=of(t=>this.observer=t)}get next(){return Q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Mo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Gp(n){Mo=n}function Hp(n){return Mo.loadJS(n)}function Wp(){return Mo.gapiScript}function qp(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function zp(n,e){const t=jn(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(Dr(o,e??{}))return s;Nt(s,"already-initialized")}return t.initialize({options:e})}function Kp(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(zt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Jp(n,e,t){const r=rr(n);Q(r._canInitEmulator,r,"emulator-config-failed"),Q(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,o=Zc(e),{host:a,port:u}=Qp(e),h=u===null?"":`:${u}`;r.config.emulator={url:`${o}//${a}${h}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:u,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})}),Yp()}function Zc(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Qp(n){const e=Zc(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:vl(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:vl(a)}}}function vl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Yp(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class eu{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Wt("not implemented")}_getIdTokenResponse(e){return Wt("not implemented")}_linkToIdToken(e,t){return Wt("not implemented")}_getReauthenticationResolver(e){return Wt("not implemented")}}/**
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
 */async function Wn(n,e){return Ap(n,"POST","/v1/accounts:signInWithIdp",Oo(n,e))}/**
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
 */const Xp="http://localhost";class An extends eu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new An(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,o=No(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new An(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Wn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Wn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Wn(e,t)}buildRequest(){const e={requestUri:Xp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=zr(t)}return e}}/**
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
 */class ci{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Jr extends ci{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Gt extends Jr{constructor(){super("facebook.com")}static credential(e){return An._fromParams({providerId:Gt.PROVIDER_ID,signInMethod:Gt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Gt.credentialFromTaggedObject(e)}static credentialFromError(e){return Gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Gt.credential(e.oauthAccessToken)}catch{return null}}}Gt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Gt.PROVIDER_ID="facebook.com";/**
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
 */class Ht extends Jr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return An._fromParams({providerId:Ht.PROVIDER_ID,signInMethod:Ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ht.credentialFromTaggedObject(e)}static credentialFromError(e){return Ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Ht.credential(t,r)}catch{return null}}}Ht.GOOGLE_SIGN_IN_METHOD="google.com";Ht.PROVIDER_ID="google.com";/**
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
 */class sn extends Jr{constructor(){super("github.com")}static credential(e){return An._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return sn.credentialFromTaggedObject(e)}static credentialFromError(e){return sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return sn.credential(e.oauthAccessToken)}catch{return null}}}sn.GITHUB_SIGN_IN_METHOD="github.com";sn.PROVIDER_ID="github.com";/**
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
 */class on extends Jr{constructor(){super("twitter.com")}static credential(e,t){return An._fromParams({providerId:on.PROVIDER_ID,signInMethod:on.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return on.credentialFromTaggedObject(e)}static credentialFromError(e){return on.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return on.credential(t,r)}catch{return null}}}on.TWITTER_SIGN_IN_METHOD="twitter.com";on.PROVIDER_ID="twitter.com";/**
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
 */class Jn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await qt._fromIdTokenResponse(e,r,s),a=_l(r);return new Jn({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=_l(r);return new Jn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function _l(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Hs extends xt{constructor(e,t,r,s){var o;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Hs.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Hs(e,t,r,s)}}function tu(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Hs._fromErrorAndOperation(n,o,e,r):o})}async function Zp(n,e,t=!1){const r=await Mr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Jn._forOperation(n,"link",r)}/**
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
 */async function em(n,e,t=!1){const{auth:r}=n;if(Ct(r.app))return Promise.reject(cn(r));const s="reauthenticate";try{const o=await Mr(n,tu(r,s,e,n),t);Q(o.idToken,r,"internal-error");const a=Do(o.idToken);Q(a,r,"internal-error");const{sub:u}=a;return Q(n.uid===u,r,"user-mismatch"),Jn._forOperation(n,s,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&Nt(r,"user-mismatch"),o}}/**
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
 */async function tm(n,e,t=!1){if(Ct(n.app))return Promise.reject(cn(n));const r="signIn",s=await tu(n,r,e),o=await Jn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function nm(n,e,t,r){return nt(n).onIdTokenChanged(e,t,r)}function rm(n,e,t){return nt(n).beforeAuthStateChanged(e,t)}function sm(n,e,t,r){return nt(n).onAuthStateChanged(e,t,r)}function im(n){return nt(n).signOut()}const Ws="__sak";/**
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
 */class nu{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ws,"1"),this.storage.removeItem(Ws),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const om=1e3,am=10;class ru extends nu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Yc(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);Mp()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,am):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},om)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ru.type="LOCAL";const lm=ru;/**
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
 */class su extends nu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}su.type="SESSION";const iu=su;/**
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
 */class ui{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new ui(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(a).map(async f=>f(t.origin,o)),h=await cm(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ui.receivers=[];/**
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
 */function Fo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class um{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((u,h)=>{const f=Fo("",20);s.port1.start();const y=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(E){const x=E;if(x.data.eventId===f)switch(x.data.status){case"ack":clearTimeout(y),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),u(x.data.response);break;default:clearTimeout(y),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:f,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function St(){return window}function hm(n){St().location.href=n}/**
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
 */function ou(){return typeof St().WorkerGlobalScope<"u"&&typeof St().importScripts=="function"}async function dm(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function fm(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function pm(){return ou()?self:null}/**
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
 */const au="firebaseLocalStorageDb",mm=1,qs="firebaseLocalStorage",lu="fbase_key";class Qr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hi(n,e){return n.transaction([qs],e?"readwrite":"readonly").objectStore(qs)}function gm(){const n=indexedDB.deleteDatabase(au);return new Qr(n).toPromise()}function lo(){const n=indexedDB.open(au,mm);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(qs,{keyPath:lu})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(qs)?e(r):(r.close(),await gm(),e(await lo()))})})}async function wl(n,e,t){const r=hi(n,!0).put({[lu]:e,value:t});return new Qr(r).toPromise()}async function ym(n,e){const t=hi(n,!1).get(e),r=await new Qr(t).toPromise();return r===void 0?null:r.value}function Il(n,e){const t=hi(n,!0).delete(e);return new Qr(t).toPromise()}const vm=800,_m=3;class cu{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await lo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>_m)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ou()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ui._getInstance(pm()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await dm(),!this.activeServiceWorker)return;this.sender=new um(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||fm()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await lo();return await wl(e,Ws,"1"),await Il(e,Ws),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>wl(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ym(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Il(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=hi(s,!1).getAll();return new Qr(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}cu.type="LOCAL";const wm=cu;new Kr(3e4,6e4);/**
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
 */function Vo(n,e){return e?zt(e):(Q(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Uo extends eu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Wn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Wn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Wn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Im(n){return tm(n.auth,new Uo(n),n.bypassAuthState)}function Em(n){const{auth:e,user:t}=n;return Q(t,e,"internal-error"),em(t,new Uo(n),n.bypassAuthState)}async function bm(n){const{auth:e,user:t}=n;return Q(t,e,"internal-error"),Zp(t,new Uo(n),n.bypassAuthState)}/**
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
 */class uu{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:u}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(h))}catch(f){this.reject(f)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Im;case"linkViaPopup":case"linkViaRedirect":return bm;case"reauthViaPopup":case"reauthViaRedirect":return Em;default:Nt(this.auth,"internal-error")}}resolve(e){Yt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Yt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const xm=new Kr(2e3,1e4);async function Tm(n,e,t){if(Ct(n.app))return Promise.reject(Et(n,"operation-not-supported-in-this-environment"));const r=rr(n);Mc(n,e,ci);const s=Vo(r,t);return new In(r,"signInViaPopup",e,s).executeNotNull()}class In extends uu{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,In.currentPopupAction&&In.currentPopupAction.cancel(),In.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Q(e,this.auth,"internal-error"),e}async onExecution(){Yt(this.filter.length===1,"Popup operations only handle one event");const e=Fo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Et(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Et(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,In.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Et(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,xm.get())};e()}}In.currentPopupAction=null;/**
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
 */const Am="pendingRedirect",Ns=new Map;class Cm extends uu{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Ns.get(this.auth._key());if(!e){try{const r=await Sm(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Ns.set(this.auth._key(),e)}return this.bypassAuthState||Ns.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sm(n,e){const t=du(e),r=hu(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}async function Rm(n,e){return hu(n)._set(du(e),"true")}function Nm(n,e){Ns.set(n._key(),e)}function hu(n){return zt(n._redirectPersistence)}function du(n){return Rs(Am,n.config.apiKey,n.name)}/**
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
 */function km(n,e,t){return Pm(n,e,t)}async function Pm(n,e,t){if(Ct(n.app))return Promise.reject(cn(n));const r=rr(n);Mc(n,e,ci),await r._initializationPromise;const s=Vo(r,t);return await Rm(s,r),s._openRedirect(r,e,"signInViaRedirect")}async function jm(n,e){return await rr(n)._initializationPromise,fu(n,e,!1)}async function fu(n,e,t=!1){if(Ct(n.app))return Promise.reject(cn(n));const r=rr(n),s=Vo(r,e),a=await new Cm(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const Om=10*60*1e3;class Dm{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lm(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!pu(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Et(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Om&&this.cachedEventUids.clear(),this.cachedEventUids.has(El(e))}saveEventToCache(e){this.cachedEventUids.add(El(e)),this.lastProcessedEventTime=Date.now()}}function El(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function pu({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lm(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return pu(n);default:return!1}}/**
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
 */async function Mm(n,e={}){return nr(n,"GET","/v1/projects",e)}/**
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
 */const Fm=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Vm=/^https?/;async function Um(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Mm(n);for(const t of e)try{if(Bm(t))return}catch{}Nt(n,"unauthorized-domain")}function Bm(n){const e=oo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Vm.test(t))return!1;if(Fm.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const $m=new Kr(3e4,6e4);function bl(){const n=St().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Gm(n){return new Promise((e,t)=>{var r,s,o;function a(){bl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{bl(),t(Et(n,"network-request-failed"))},timeout:$m.get()})}if(!((s=(r=St().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((o=St().gapi)===null||o===void 0)&&o.load)a();else{const u=qp("iframefcb");return St()[u]=()=>{gapi.load?a():t(Et(n,"network-request-failed"))},Hp(`${Wp()}?onload=${u}`).catch(h=>t(h))}}).catch(e=>{throw ks=null,e})}let ks=null;function Hm(n){return ks=ks||Gm(n),ks}/**
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
 */const Wm=new Kr(5e3,15e3),qm="__/auth/iframe",zm="emulator/auth/iframe",Km={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Jm=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Qm(n){const e=n.config;Q(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?jo(e,zm):`https://${n.config.authDomain}/${qm}`,r={apiKey:e.apiKey,appName:n.name,v:tr},s=Jm.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${zr(r).slice(1)}`}async function Ym(n){const e=await Hm(n),t=St().gapi;return Q(t,n,"internal-error"),e.open({where:document.body,url:Qm(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Km,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=Et(n,"network-request-failed"),u=St().setTimeout(()=>{o(a)},Wm.get());function h(){St().clearTimeout(u),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
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
 */const Xm={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Zm=500,eg=600,tg="_blank",ng="http://localhost";class xl{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function rg(n,e,t,r=Zm,s=eg){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const h=Object.assign(Object.assign({},Xm),{width:r.toString(),height:s.toString(),top:o,left:a}),f=Ze().toLowerCase();t&&(u=qc(f)?tg:t),Hc(f)&&(e=e||ng,h.scrollbars="yes");const y=Object.entries(h).reduce((x,[C,P])=>`${x}${C}=${P},`,"");if(Lp(f)&&u!=="_self")return sg(e||"",u),new xl(null);const E=window.open(e||"",u,y);Q(E,n,"popup-blocked");try{E.focus()}catch{}return new xl(E)}function sg(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const ig="__/auth/handler",og="emulator/auth/handler",ag=encodeURIComponent("fac");async function Tl(n,e,t,r,s,o){Q(n.config.authDomain,n,"auth-domain-config-required"),Q(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:tr,eventId:s};if(e instanceof ci){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",sf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[y,E]of Object.entries({}))a[y]=E}if(e instanceof Jr){const y=e.getScopes().filter(E=>E!=="");y.length>0&&(a.scopes=y.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const y of Object.keys(u))u[y]===void 0&&delete u[y];const h=await n._getAppCheckToken(),f=h?`#${ag}=${encodeURIComponent(h)}`:"";return`${lg(n)}?${zr(u).slice(1)}${f}`}function lg({config:n}){return n.emulator?jo(n,og):`https://${n.authDomain}/${ig}`}/**
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
 */const Gi="webStorageSupport";class cg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=iu,this._completeRedirectFn=fu,this._overrideRedirectResult=Nm}async _openPopup(e,t,r,s){var o;Yt((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");const a=await Tl(e,t,r,oo(),s);return rg(e,a,Fo())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await Tl(e,t,r,oo(),s);return hm(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(Yt(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Ym(e),r=new Dm(e);return t.register("authEvent",s=>(Q(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Gi,{type:Gi},s=>{var o;const a=(o=s==null?void 0:s[0])===null||o===void 0?void 0:o[Gi];a!==void 0&&t(!!a),Nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Um(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Yc()||Wc()||Lo()}}const ug=cg;var Al="@firebase/auth",Cl="1.7.9";/**
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
 */class hg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function dg(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function fg(n){Rt(new bt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;Q(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Xc(n)},f=new $p(r,s,o,h);return Kp(f,t),f},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Rt(new bt("auth-internal",e=>{const t=rr(e.getProvider("auth").getImmediate());return(r=>new hg(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),dt(Al,Cl,dg(n)),dt(Al,Cl,"esm2017")}/**
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
 */const pg=5*60,mg=Tc("authIdTokenMaxAge")||pg;let Sl=null;const gg=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>mg)return;const s=t==null?void 0:t.token;Sl!==s&&(Sl=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function yg(n=Ro()){const e=jn(n,"auth");if(e.isInitialized())return e.getImmediate();const t=zp(n,{popupRedirectResolver:ug,persistence:[wm,lm,iu]}),r=Tc("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=gg(o.toString());rm(t,a,()=>a(t.currentUser)),nm(t,u=>a(u))}}const s=bc("auth");return s&&Jp(t,`http://${s}`),t}function vg(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Gp({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=Et("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",vg().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});fg("Browser");var _g="firebase",wg="10.14.1";/**
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
 */dt(_g,wg,"app");var Rl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,m){function g(){}g.prototype=m.prototype,I.D=m.prototype,I.prototype=new g,I.prototype.constructor=I,I.C=function(_,w,b){for(var v=Array(arguments.length-2),Z=2;Z<arguments.length;Z++)v[Z-2]=arguments[Z];return m.prototype[w].apply(_,v)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,m,g){g||(g=0);var _=Array(16);if(typeof m=="string")for(var w=0;16>w;++w)_[w]=m.charCodeAt(g++)|m.charCodeAt(g++)<<8|m.charCodeAt(g++)<<16|m.charCodeAt(g++)<<24;else for(w=0;16>w;++w)_[w]=m[g++]|m[g++]<<8|m[g++]<<16|m[g++]<<24;m=I.g[0],g=I.g[1],w=I.g[2];var b=I.g[3],v=m+(b^g&(w^b))+_[0]+3614090360&4294967295;m=g+(v<<7&4294967295|v>>>25),v=b+(w^m&(g^w))+_[1]+3905402710&4294967295,b=m+(v<<12&4294967295|v>>>20),v=w+(g^b&(m^g))+_[2]+606105819&4294967295,w=b+(v<<17&4294967295|v>>>15),v=g+(m^w&(b^m))+_[3]+3250441966&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(b^g&(w^b))+_[4]+4118548399&4294967295,m=g+(v<<7&4294967295|v>>>25),v=b+(w^m&(g^w))+_[5]+1200080426&4294967295,b=m+(v<<12&4294967295|v>>>20),v=w+(g^b&(m^g))+_[6]+2821735955&4294967295,w=b+(v<<17&4294967295|v>>>15),v=g+(m^w&(b^m))+_[7]+4249261313&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(b^g&(w^b))+_[8]+1770035416&4294967295,m=g+(v<<7&4294967295|v>>>25),v=b+(w^m&(g^w))+_[9]+2336552879&4294967295,b=m+(v<<12&4294967295|v>>>20),v=w+(g^b&(m^g))+_[10]+4294925233&4294967295,w=b+(v<<17&4294967295|v>>>15),v=g+(m^w&(b^m))+_[11]+2304563134&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(b^g&(w^b))+_[12]+1804603682&4294967295,m=g+(v<<7&4294967295|v>>>25),v=b+(w^m&(g^w))+_[13]+4254626195&4294967295,b=m+(v<<12&4294967295|v>>>20),v=w+(g^b&(m^g))+_[14]+2792965006&4294967295,w=b+(v<<17&4294967295|v>>>15),v=g+(m^w&(b^m))+_[15]+1236535329&4294967295,g=w+(v<<22&4294967295|v>>>10),v=m+(w^b&(g^w))+_[1]+4129170786&4294967295,m=g+(v<<5&4294967295|v>>>27),v=b+(g^w&(m^g))+_[6]+3225465664&4294967295,b=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(b^m))+_[11]+643717713&4294967295,w=b+(v<<14&4294967295|v>>>18),v=g+(b^m&(w^b))+_[0]+3921069994&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^b&(g^w))+_[5]+3593408605&4294967295,m=g+(v<<5&4294967295|v>>>27),v=b+(g^w&(m^g))+_[10]+38016083&4294967295,b=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(b^m))+_[15]+3634488961&4294967295,w=b+(v<<14&4294967295|v>>>18),v=g+(b^m&(w^b))+_[4]+3889429448&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^b&(g^w))+_[9]+568446438&4294967295,m=g+(v<<5&4294967295|v>>>27),v=b+(g^w&(m^g))+_[14]+3275163606&4294967295,b=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(b^m))+_[3]+4107603335&4294967295,w=b+(v<<14&4294967295|v>>>18),v=g+(b^m&(w^b))+_[8]+1163531501&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(w^b&(g^w))+_[13]+2850285829&4294967295,m=g+(v<<5&4294967295|v>>>27),v=b+(g^w&(m^g))+_[2]+4243563512&4294967295,b=m+(v<<9&4294967295|v>>>23),v=w+(m^g&(b^m))+_[7]+1735328473&4294967295,w=b+(v<<14&4294967295|v>>>18),v=g+(b^m&(w^b))+_[12]+2368359562&4294967295,g=w+(v<<20&4294967295|v>>>12),v=m+(g^w^b)+_[5]+4294588738&4294967295,m=g+(v<<4&4294967295|v>>>28),v=b+(m^g^w)+_[8]+2272392833&4294967295,b=m+(v<<11&4294967295|v>>>21),v=w+(b^m^g)+_[11]+1839030562&4294967295,w=b+(v<<16&4294967295|v>>>16),v=g+(w^b^m)+_[14]+4259657740&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^b)+_[1]+2763975236&4294967295,m=g+(v<<4&4294967295|v>>>28),v=b+(m^g^w)+_[4]+1272893353&4294967295,b=m+(v<<11&4294967295|v>>>21),v=w+(b^m^g)+_[7]+4139469664&4294967295,w=b+(v<<16&4294967295|v>>>16),v=g+(w^b^m)+_[10]+3200236656&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^b)+_[13]+681279174&4294967295,m=g+(v<<4&4294967295|v>>>28),v=b+(m^g^w)+_[0]+3936430074&4294967295,b=m+(v<<11&4294967295|v>>>21),v=w+(b^m^g)+_[3]+3572445317&4294967295,w=b+(v<<16&4294967295|v>>>16),v=g+(w^b^m)+_[6]+76029189&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(g^w^b)+_[9]+3654602809&4294967295,m=g+(v<<4&4294967295|v>>>28),v=b+(m^g^w)+_[12]+3873151461&4294967295,b=m+(v<<11&4294967295|v>>>21),v=w+(b^m^g)+_[15]+530742520&4294967295,w=b+(v<<16&4294967295|v>>>16),v=g+(w^b^m)+_[2]+3299628645&4294967295,g=w+(v<<23&4294967295|v>>>9),v=m+(w^(g|~b))+_[0]+4096336452&4294967295,m=g+(v<<6&4294967295|v>>>26),v=b+(g^(m|~w))+_[7]+1126891415&4294967295,b=m+(v<<10&4294967295|v>>>22),v=w+(m^(b|~g))+_[14]+2878612391&4294967295,w=b+(v<<15&4294967295|v>>>17),v=g+(b^(w|~m))+_[5]+4237533241&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~b))+_[12]+1700485571&4294967295,m=g+(v<<6&4294967295|v>>>26),v=b+(g^(m|~w))+_[3]+2399980690&4294967295,b=m+(v<<10&4294967295|v>>>22),v=w+(m^(b|~g))+_[10]+4293915773&4294967295,w=b+(v<<15&4294967295|v>>>17),v=g+(b^(w|~m))+_[1]+2240044497&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~b))+_[8]+1873313359&4294967295,m=g+(v<<6&4294967295|v>>>26),v=b+(g^(m|~w))+_[15]+4264355552&4294967295,b=m+(v<<10&4294967295|v>>>22),v=w+(m^(b|~g))+_[6]+2734768916&4294967295,w=b+(v<<15&4294967295|v>>>17),v=g+(b^(w|~m))+_[13]+1309151649&4294967295,g=w+(v<<21&4294967295|v>>>11),v=m+(w^(g|~b))+_[4]+4149444226&4294967295,m=g+(v<<6&4294967295|v>>>26),v=b+(g^(m|~w))+_[11]+3174756917&4294967295,b=m+(v<<10&4294967295|v>>>22),v=w+(m^(b|~g))+_[2]+718787259&4294967295,w=b+(v<<15&4294967295|v>>>17),v=g+(b^(w|~m))+_[9]+3951481745&4294967295,I.g[0]=I.g[0]+m&4294967295,I.g[1]=I.g[1]+(w+(v<<21&4294967295|v>>>11))&4294967295,I.g[2]=I.g[2]+w&4294967295,I.g[3]=I.g[3]+b&4294967295}r.prototype.u=function(I,m){m===void 0&&(m=I.length);for(var g=m-this.blockSize,_=this.B,w=this.h,b=0;b<m;){if(w==0)for(;b<=g;)s(this,I,b),b+=this.blockSize;if(typeof I=="string"){for(;b<m;)if(_[w++]=I.charCodeAt(b++),w==this.blockSize){s(this,_),w=0;break}}else for(;b<m;)if(_[w++]=I[b++],w==this.blockSize){s(this,_),w=0;break}}this.h=w,this.o+=m},r.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var m=1;m<I.length-8;++m)I[m]=0;var g=8*this.o;for(m=I.length-8;m<I.length;++m)I[m]=g&255,g/=256;for(this.u(I),I=Array(16),m=g=0;4>m;++m)for(var _=0;32>_;_+=8)I[g++]=this.g[m]>>>_&255;return I};function o(I,m){var g=u;return Object.prototype.hasOwnProperty.call(g,I)?g[I]:g[I]=m(I)}function a(I,m){this.h=m;for(var g=[],_=!0,w=I.length-1;0<=w;w--){var b=I[w]|0;_&&b==m||(g[w]=b,_=!1)}this.g=g}var u={};function h(I){return-128<=I&&128>I?o(I,function(m){return new a([m|0],0>m?-1:0)}):new a([I|0],0>I?-1:0)}function f(I){if(isNaN(I)||!isFinite(I))return E;if(0>I)return k(f(-I));for(var m=[],g=1,_=0;I>=g;_++)m[_]=I/g|0,g*=4294967296;return new a(m,0)}function y(I,m){if(I.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(I.charAt(0)=="-")return k(y(I.substring(1),m));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=f(Math.pow(m,8)),_=E,w=0;w<I.length;w+=8){var b=Math.min(8,I.length-w),v=parseInt(I.substring(w,w+b),m);8>b?(b=f(Math.pow(m,b)),_=_.j(b).add(f(v))):(_=_.j(g),_=_.add(f(v)))}return _}var E=h(0),x=h(1),C=h(16777216);n=a.prototype,n.m=function(){if(S(this))return-k(this).m();for(var I=0,m=1,g=0;g<this.g.length;g++){var _=this.i(g);I+=(0<=_?_:4294967296+_)*m,m*=4294967296}return I},n.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(P(this))return"0";if(S(this))return"-"+k(this).toString(I);for(var m=f(Math.pow(I,6)),g=this,_="";;){var w=B(g,m).g;g=G(g,w.j(m));var b=((0<g.g.length?g.g[0]:g.h)>>>0).toString(I);if(g=w,P(g))return b+_;for(;6>b.length;)b="0"+b;_=b+_}},n.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function P(I){if(I.h!=0)return!1;for(var m=0;m<I.g.length;m++)if(I.g[m]!=0)return!1;return!0}function S(I){return I.h==-1}n.l=function(I){return I=G(this,I),S(I)?-1:P(I)?0:1};function k(I){for(var m=I.g.length,g=[],_=0;_<m;_++)g[_]=~I.g[_];return new a(g,~I.h).add(x)}n.abs=function(){return S(this)?k(this):this},n.add=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0,w=0;w<=m;w++){var b=_+(this.i(w)&65535)+(I.i(w)&65535),v=(b>>>16)+(this.i(w)>>>16)+(I.i(w)>>>16);_=v>>>16,b&=65535,v&=65535,g[w]=v<<16|b}return new a(g,g[g.length-1]&-2147483648?-1:0)};function G(I,m){return I.add(k(m))}n.j=function(I){if(P(this)||P(I))return E;if(S(this))return S(I)?k(this).j(k(I)):k(k(this).j(I));if(S(I))return k(this.j(k(I)));if(0>this.l(C)&&0>I.l(C))return f(this.m()*I.m());for(var m=this.g.length+I.g.length,g=[],_=0;_<2*m;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var w=0;w<I.g.length;w++){var b=this.i(_)>>>16,v=this.i(_)&65535,Z=I.i(w)>>>16,_e=I.i(w)&65535;g[2*_+2*w]+=v*_e,H(g,2*_+2*w),g[2*_+2*w+1]+=b*_e,H(g,2*_+2*w+1),g[2*_+2*w+1]+=v*Z,H(g,2*_+2*w+1),g[2*_+2*w+2]+=b*Z,H(g,2*_+2*w+2)}for(_=0;_<m;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=m;_<2*m;_++)g[_]=0;return new a(g,0)};function H(I,m){for(;(I[m]&65535)!=I[m];)I[m+1]+=I[m]>>>16,I[m]&=65535,m++}function U(I,m){this.g=I,this.h=m}function B(I,m){if(P(m))throw Error("division by zero");if(P(I))return new U(E,E);if(S(I))return m=B(k(I),m),new U(k(m.g),k(m.h));if(S(m))return m=B(I,k(m)),new U(k(m.g),m.h);if(30<I.g.length){if(S(I)||S(m))throw Error("slowDivide_ only works with positive integers.");for(var g=x,_=m;0>=_.l(I);)g=de(g),_=de(_);var w=L(g,1),b=L(_,1);for(_=L(_,2),g=L(g,2);!P(_);){var v=b.add(_);0>=v.l(I)&&(w=w.add(g),b=v),_=L(_,1),g=L(g,1)}return m=G(I,w.j(m)),new U(w,m)}for(w=E;0<=I.l(m);){for(g=Math.max(1,Math.floor(I.m()/m.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),b=f(g),v=b.j(m);S(v)||0<v.l(I);)g-=_,b=f(g),v=b.j(m);P(b)&&(b=x),w=w.add(b),I=G(I,v)}return new U(w,I)}n.A=function(I){return B(this,I).h},n.and=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)&I.i(_);return new a(g,this.h&I.h)},n.or=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)|I.i(_);return new a(g,this.h|I.h)},n.xor=function(I){for(var m=Math.max(this.g.length,I.g.length),g=[],_=0;_<m;_++)g[_]=this.i(_)^I.i(_);return new a(g,this.h^I.h)};function de(I){for(var m=I.g.length+1,g=[],_=0;_<m;_++)g[_]=I.i(_)<<1|I.i(_-1)>>>31;return new a(g,I.h)}function L(I,m){var g=m>>5;m%=32;for(var _=I.g.length-g,w=[],b=0;b<_;b++)w[b]=0<m?I.i(b+g)>>>m|I.i(b+g+1)<<32-m:I.i(b+g);return new a(w,I.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=y,mu=a}).apply(typeof Rl<"u"?Rl:typeof self<"u"?self:typeof window<"u"?window:{});var Is=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gu,Ar,yu,Ps,co,vu,_u,wu;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,d){return i==Array.prototype||i==Object.prototype||(i[c]=d.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Is=="object"&&Is];for(var c=0;c<i.length;++c){var d=i[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var d=r;i=i.split(".");for(var p=0;p<i.length-1;p++){var A=i[p];if(!(A in d))break e;d=d[A]}i=i[i.length-1],p=d[i],c=c(p),c!=p&&c!=null&&e(d,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var d=0,p=!1,A={next:function(){if(!p&&d<i.length){var N=d++;return{value:c(N,i[N]),done:!1}}return p=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},u=this||self;function h(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function f(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function y(i,c,d){return i.call.apply(i.bind,arguments)}function E(i,c,d){if(!i)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,p),i.apply(c,A)}}return function(){return i.apply(c,arguments)}}function x(i,c,d){return x=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?y:E,x.apply(null,arguments)}function C(i,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),i.apply(this,p)}}function P(i,c){function d(){}d.prototype=c.prototype,i.aa=c.prototype,i.prototype=new d,i.prototype.constructor=i,i.Qb=function(p,A,N){for(var F=Array(arguments.length-2),me=2;me<arguments.length;me++)F[me-2]=arguments[me];return c.prototype[A].apply(p,F)}}function S(i){const c=i.length;if(0<c){const d=Array(c);for(let p=0;p<c;p++)d[p]=i[p];return d}return[]}function k(i,c){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(h(p)){const A=i.length||0,N=p.length||0;i.length=A+N;for(let F=0;F<N;F++)i[A+F]=p[F]}else i.push(p)}}class G{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function H(i){return/^[\s\xa0]*$/.test(i)}function U(){var i=u.navigator;return i&&(i=i.userAgent)?i:""}function B(i){return B[" "](i),i}B[" "]=function(){};var de=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function L(i,c,d){for(const p in i)c.call(d,i[p],p,i)}function I(i,c){for(const d in i)c.call(void 0,i[d],d,i)}function m(i){const c={};for(const d in i)c[d]=i[d];return c}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(i,c){let d,p;for(let A=1;A<arguments.length;A++){p=arguments[A];for(d in p)i[d]=p[d];for(let N=0;N<g.length;N++)d=g[N],Object.prototype.hasOwnProperty.call(p,d)&&(i[d]=p[d])}}function w(i){var c=1;i=i.split(":");const d=[];for(;0<c&&i.length;)d.push(i.shift()),c--;return i.length&&d.push(i.join(":")),d}function b(i){u.setTimeout(()=>{throw i},0)}function v(){var i=pt;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class Z{constructor(){this.h=this.g=null}add(c,d){const p=_e.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var _e=new G(()=>new X,i=>i.reset());class X{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let ye,De=!1,pt=new Z,et=()=>{const i=u.Promise.resolve(void 0);ye=()=>{i.then(Dn)}};var Dn=()=>{for(var i;i=v();){try{i.h.call(i.g)}catch(d){b(d)}var c=_e;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}De=!1};function st(){this.s=this.s,this.C=this.C}st.prototype.s=!1,st.prototype.ma=function(){this.s||(this.s=!0,this.N())},st.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ne(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}Ne.prototype.h=function(){this.defaultPrevented=!0};var ts=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const d=()=>{};u.addEventListener("test",d,c),u.removeEventListener("test",d,c)}catch{}return i}();function Xt(i,c){if(Ne.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var d=this.type=i.type,p=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(de){e:{try{B(c.nodeName);var A=!0;break e}catch{}A=!1}A||(c=null)}}else d=="mouseover"?c=i.fromElement:d=="mouseout"&&(c=i.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:j[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Xt.aa.h.call(this)}}P(Xt,Ne);var j={2:"touch",3:"pen",4:"mouse"};Xt.prototype.h=function(){Xt.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var q="closure_listenable_"+(1e6*Math.random()|0),ne=0;function Le(i,c,d,p,A){this.listener=i,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=A,this.key=++ne,this.da=this.fa=!1}function xe(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Tt(i){this.src=i,this.g={},this.h=0}Tt.prototype.add=function(i,c,d,p,A){var N=i.toString();i=this.g[N],i||(i=this.g[N]=[],this.h++);var F=Ln(i,c,p,A);return-1<F?(c=i[F],d||(c.fa=!1)):(c=new Le(c,this.src,N,!!p,A),c.fa=d,i.push(c)),c};function Dt(i,c){var d=c.type;if(d in i.g){var p=i.g[d],A=Array.prototype.indexOf.call(p,c,void 0),N;(N=0<=A)&&Array.prototype.splice.call(p,A,1),N&&(xe(c),i.g[d].length==0&&(delete i.g[d],i.h--))}}function Ln(i,c,d,p){for(var A=0;A<i.length;++A){var N=i[A];if(!N.da&&N.listener==c&&N.capture==!!d&&N.ha==p)return A}return-1}var At="closure_lm_"+(1e6*Math.random()|0),We={};function Lt(i,c,d,p,A){if(Array.isArray(c)){for(var N=0;N<c.length;N++)Lt(i,c[N],d,p,A);return null}return d=lr(d),i&&i[q]?i.K(c,d,f(p)?!!p.capture:!1,A):va(i,c,d,!1,p,A)}function va(i,c,d,p,A,N){if(!c)throw Error("Invalid event type");var F=f(A)?!!A.capture:!!A,me=pn(i);if(me||(i[At]=me=new Tt(i)),d=me.add(c,d,p,F,N),d.proxy)return d;if(p=ns(),d.proxy=p,p.src=i,p.listener=d,i.addEventListener)ts||(A=F),A===void 0&&(A=!1),i.addEventListener(c.toString(),p,A);else if(i.attachEvent)i.attachEvent(ar(c.toString()),p);else if(i.addListener&&i.removeListener)i.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function ns(){function i(d){return c.call(i.src,i.listener,d)}const c=Mt;return i}function Ai(i,c,d,p,A){if(Array.isArray(c))for(var N=0;N<c.length;N++)Ai(i,c[N],d,p,A);else p=f(p)?!!p.capture:!!p,d=lr(d),i&&i[q]?(i=i.i,c=String(c).toString(),c in i.g&&(N=i.g[c],d=Ln(N,d,p,A),-1<d&&(xe(N[d]),Array.prototype.splice.call(N,d,1),N.length==0&&(delete i.g[c],i.h--)))):i&&(i=pn(i))&&(c=i.g[c.toString()],i=-1,c&&(i=Ln(c,d,p,A)),(d=-1<i?c[i]:null)&&rs(d))}function rs(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[q])Dt(c.i,i);else{var d=i.type,p=i.proxy;c.removeEventListener?c.removeEventListener(d,p,i.capture):c.detachEvent?c.detachEvent(ar(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=pn(c))?(Dt(d,i),d.h==0&&(d.src=null,c[At]=null)):xe(i)}}}function ar(i){return i in We?We[i]:We[i]="on"+i}function Mt(i,c){if(i.da)i=!0;else{c=new Xt(c,this);var d=i.listener,p=i.ha||i.src;i.fa&&rs(i),i=d.call(p,c)}return i}function pn(i){return i=i[At],i instanceof Tt?i:null}var z="__closure_events_fn_"+(1e9*Math.random()>>>0);function lr(i){return typeof i=="function"?i:(i[z]||(i[z]=function(c){return i.handleEvent(c)}),i[z])}function he(){st.call(this),this.i=new Tt(this),this.M=this,this.F=null}P(he,st),he.prototype[q]=!0,he.prototype.removeEventListener=function(i,c,d,p){Ai(this,i,c,d,p)};function te(i,c){var d,p=i.F;if(p)for(d=[];p;p=p.F)d.push(p);if(i=i.M,p=c.type||c,typeof c=="string")c=new Ne(c,i);else if(c instanceof Ne)c.target=c.target||i;else{var A=c;c=new Ne(p,i),_(c,A)}if(A=!0,d)for(var N=d.length-1;0<=N;N--){var F=c.g=d[N];A=Mn(F,p,!0,c)&&A}if(F=c.g=i,A=Mn(F,p,!0,c)&&A,A=Mn(F,p,!1,c)&&A,d)for(N=0;N<d.length;N++)F=c.g=d[N],A=Mn(F,p,!1,c)&&A}he.prototype.N=function(){if(he.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var d=i.g[c],p=0;p<d.length;p++)xe(d[p]);delete i.g[c],i.h--}}this.F=null},he.prototype.K=function(i,c,d,p){return this.i.add(String(i),c,!1,d,p)},he.prototype.L=function(i,c,d,p){return this.i.add(String(i),c,!0,d,p)};function Mn(i,c,d,p){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var A=!0,N=0;N<c.length;++N){var F=c[N];if(F&&!F.da&&F.capture==d){var me=F.listener,Be=F.ha||F.src;F.fa&&Dt(i.i,F),A=me.call(Be,p)!==!1&&A}}return A&&!p.defaultPrevented}function ae(i,c,d){if(typeof i=="function")d&&(i=x(i,d));else if(i&&typeof i.handleEvent=="function")i=x(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:u.setTimeout(i,c||0)}function ct(i){i.g=ae(()=>{i.g=null,i.i&&(i.i=!1,ct(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class ee extends st{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:ct(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Zt(i){st.call(this),this.h=i,this.g={}}P(Zt,st);var it=[];function cr(i){L(i.g,function(c,d){this.g.hasOwnProperty(d)&&rs(c)},i),i.g={}}Zt.prototype.N=function(){Zt.aa.N.call(this),cr(this)},Zt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ur=u.JSON.stringify,_a=u.JSON.parse,Ci=class{stringify(i){return u.JSON.stringify(i,void 0)}parse(i){return u.JSON.parse(i,void 0)}};function hr(){}hr.prototype.h=null;function dr(i){return i.h||(i.h=i.i())}function ss(){}var en={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function fr(){Ne.call(this,"d")}P(fr,Ne);function pr(){Ne.call(this,"c")}P(pr,Ne);var Ft={},is=null;function Fn(){return is=is||new he}Ft.La="serverreachability";function os(i){Ne.call(this,Ft.La,i)}P(os,Ne);function mn(i){const c=Fn();te(c,new os(c))}Ft.STAT_EVENT="statevent";function as(i,c){Ne.call(this,Ft.STAT_EVENT,i),this.stat=c}P(as,Ne);function R(i){const c=Fn();te(c,new as(c,i))}Ft.Ma="timingevent";function $(i,c){Ne.call(this,Ft.Ma,i),this.size=c}P($,Ne);function M(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){i()},c)}function J(){this.g=!0}J.prototype.xa=function(){this.g=!1};function V(i,c,d,p,A,N){i.info(function(){if(i.g)if(N)for(var F="",me=N.split("&"),Be=0;Be<me.length;Be++){var ue=me[Be].split("=");if(1<ue.length){var ze=ue[0];ue=ue[1];var Ke=ze.split("_");F=2<=Ke.length&&Ke[1]=="type"?F+(ze+"="+ue+"&"):F+(ze+"=redacted&")}}else F=null;else F=N;return"XMLHTTP REQ ("+p+") [attempt "+A+"]: "+c+`
`+d+`
`+F})}function le(i,c,d,p,A,N,F){i.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+A+"]: "+c+`
`+d+`
`+N+" "+F})}function pe(i,c,d,p){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+qe(i,d)+(p?" "+p:"")})}function ke(i,c){i.info(function(){return"TIMEOUT: "+c})}J.prototype.info=function(){};function qe(i,c){if(!i.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(i=0;i<d.length;i++)if(Array.isArray(d[i])){var p=d[i];if(!(2>p.length)){var A=p[1];if(Array.isArray(A)&&!(1>A.length)){var N=A[0];if(N!="noop"&&N!="stop"&&N!="close")for(var F=1;F<A.length;F++)A[F]=""}}}}return ur(d)}catch{return c}}var Ee={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Pe={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},fe;function ut(){}P(ut,hr),ut.prototype.g=function(){return new XMLHttpRequest},ut.prototype.i=function(){return{}},fe=new ut;function ot(i,c,d,p){this.j=i,this.i=c,this.l=d,this.R=p||1,this.U=new Zt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ie}function Ie(){this.i=null,this.g="",this.h=!1}var Vt={},Ue={};function je(i,c,d){i.L=1,i.v=hs(Bt(c)),i.m=d,i.P=!0,mt(i,null)}function mt(i,c){i.F=Date.now(),gn(i),i.A=Bt(i.v);var d=i.A,p=i.R;Array.isArray(p)||(p=[String(p)]),Pa(d.i,"t",p),i.C=0,d=i.j.J,i.h=new Ie,i.g=Qa(i.j,d?c:null,!i.m),0<i.O&&(i.M=new ee(x(i.Y,i,i.g),i.O)),c=i.U,d=i.g,p=i.ca;var A="readystatechange";Array.isArray(A)||(A&&(it[0]=A.toString()),A=it);for(var N=0;N<A.length;N++){var F=Lt(d,A[N],p||c.handleEvent,!1,c.h||c);if(!F)break;c.g[F.key]=F}c=i.H?m(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),mn(),V(i.i,i.u,i.A,i.l,i.R,i.m)}ot.prototype.ca=function(i){i=i.target;const c=this.M;c&&$t(i)==3?c.j():this.Y(i)},ot.prototype.Y=function(i){try{if(i==this.g)e:{const Ke=$t(this.g);var c=this.g.Ba();const Bn=this.g.Z();if(!(3>Ke)&&(Ke!=3||this.g&&(this.h.h||this.g.oa()||Va(this.g)))){this.J||Ke!=4||c==7||(c==8||0>=Bn?mn(3):mn(2)),Si(this);var d=this.g.Z();this.X=d;t:if(Ut(this)){var p=Va(this.g);i="";var A=p.length,N=$t(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){yn(this),mr(this);var F="";break t}this.h.i=new u.TextDecoder}for(c=0;c<A;c++)this.h.h=!0,i+=this.h.i.decode(p[c],{stream:!(N&&c==A-1)});p.length=0,this.h.g+=i,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=d==200,le(this.i,this.u,this.A,this.l,this.R,Ke,d),this.o){if(this.T&&!this.K){t:{if(this.g){var me,Be=this.g;if((me=Be.g?Be.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!H(me)){var ue=me;break t}}ue=null}if(d=ue)pe(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ri(this,d);else{this.o=!1,this.s=3,R(12),yn(this),mr(this);break e}}if(this.P){d=!0;let gt;for(;!this.J&&this.C<F.length;)if(gt=ls(this,F),gt==Ue){Ke==4&&(this.s=4,R(14),d=!1),pe(this.i,this.l,null,"[Incomplete Response]");break}else if(gt==Vt){this.s=4,R(15),pe(this.i,this.l,F,"[Invalid Chunk]"),d=!1;break}else pe(this.i,this.l,gt,null),Ri(this,gt);if(Ut(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ke!=4||F.length!=0||this.h.h||(this.s=1,R(16),d=!1),this.o=this.o&&d,!d)pe(this.i,this.l,F,"[Invalid Chunked Response]"),yn(this),mr(this);else if(0<F.length&&!this.W){this.W=!0;var ze=this.j;ze.g==this&&ze.ba&&!ze.M&&(ze.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),Di(ze),ze.M=!0,R(11))}}else pe(this.i,this.l,F,null),Ri(this,F);Ke==4&&yn(this),this.o&&!this.J&&(Ke==4?qa(this.j,this):(this.o=!1,gn(this)))}else bd(this.g),d==400&&0<F.indexOf("Unknown SID")?(this.s=3,R(12)):(this.s=0,R(13)),yn(this),mr(this)}}}catch{}finally{}};function Ut(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function ls(i,c){var d=i.C,p=c.indexOf(`
`,d);return p==-1?Ue:(d=Number(c.substring(d,p)),isNaN(d)?Vt:(p+=1,p+d>c.length?Ue:(c=c.slice(p,p+d),i.C=p+d,c)))}ot.prototype.cancel=function(){this.J=!0,yn(this)};function gn(i){i.S=Date.now()+i.I,wa(i,i.I)}function wa(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=M(x(i.ba,i),c)}function Si(i){i.B&&(u.clearTimeout(i.B),i.B=null)}ot.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(ke(this.i,this.A),this.L!=2&&(mn(),R(17)),yn(this),this.s=2,mr(this)):wa(this,this.S-i)};function mr(i){i.j.G==0||i.J||qa(i.j,i)}function yn(i){Si(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,cr(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function Ri(i,c){try{var d=i.j;if(d.G!=0&&(d.g==i||Ni(d.h,i))){if(!i.K&&Ni(d.h,i)&&d.G==3){try{var p=d.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var A=p;if(A[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<i.F)ys(d),ms(d);else break e;Oi(d),R(18)}}else d.za=A[1],0<d.za-d.T&&37500>A[2]&&d.F&&d.v==0&&!d.C&&(d.C=M(x(d.Za,d),6e3));if(1>=ba(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else _n(d,11)}else if((i.K||d.g==i)&&ys(d),!H(c))for(A=d.Da.g.parse(c),c=0;c<A.length;c++){let ue=A[c];if(d.T=ue[0],ue=ue[1],d.G==2)if(ue[0]=="c"){d.K=ue[1],d.ia=ue[2];const ze=ue[3];ze!=null&&(d.la=ze,d.j.info("VER="+d.la));const Ke=ue[4];Ke!=null&&(d.Aa=Ke,d.j.info("SVER="+d.Aa));const Bn=ue[5];Bn!=null&&typeof Bn=="number"&&0<Bn&&(p=1.5*Bn,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const gt=i.g;if(gt){const _s=gt.g?gt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(_s){var N=p.h;N.g||_s.indexOf("spdy")==-1&&_s.indexOf("quic")==-1&&_s.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(ki(N,N.h),N.h=null))}if(p.D){const Li=gt.g?gt.g.getResponseHeader("X-HTTP-Session-Id"):null;Li&&(p.ya=Li,we(p.I,p.D,Li))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-i.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var F=i;if(p.qa=Ja(p,p.J?p.ia:null,p.W),F.K){xa(p.h,F);var me=F,Be=p.L;Be&&(me.I=Be),me.B&&(Si(me),gn(me)),p.g=F}else Ha(p);0<d.i.length&&gs(d)}else ue[0]!="stop"&&ue[0]!="close"||_n(d,7);else d.G==3&&(ue[0]=="stop"||ue[0]=="close"?ue[0]=="stop"?_n(d,7):ji(d):ue[0]!="noop"&&d.l&&d.l.ta(ue),d.v=0)}}mn(4)}catch{}}var ad=class{constructor(i,c){this.g=i,this.map=c}};function Ia(i){this.l=i||10,u.PerformanceNavigationTiming?(i=u.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ea(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function ba(i){return i.h?1:i.g?i.g.size:0}function Ni(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function ki(i,c){i.g?i.g.add(c):i.h=c}function xa(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Ia.prototype.cancel=function(){if(this.i=Ta(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Ta(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const d of i.g.values())c=c.concat(d.D);return c}return S(i.i)}function ld(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var c=[],d=i.length,p=0;p<d;p++)c.push(i[p]);return c}c=[],d=0;for(p in i)c[d++]=i[p];return c}function cd(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var c=[];i=i.length;for(var d=0;d<i;d++)c.push(d);return c}c=[],d=0;for(const p in i)c[d++]=p;return c}}}function Aa(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var d=cd(i),p=ld(i),A=p.length,N=0;N<A;N++)c.call(void 0,p[N],d&&d[N],i)}var Ca=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ud(i,c){if(i){i=i.split("&");for(var d=0;d<i.length;d++){var p=i[d].indexOf("="),A=null;if(0<=p){var N=i[d].substring(0,p);A=i[d].substring(p+1)}else N=i[d];c(N,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function vn(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof vn){this.h=i.h,cs(this,i.j),this.o=i.o,this.g=i.g,us(this,i.s),this.l=i.l;var c=i.i,d=new vr;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),Sa(this,d),this.m=i.m}else i&&(c=String(i).match(Ca))?(this.h=!1,cs(this,c[1]||"",!0),this.o=gr(c[2]||""),this.g=gr(c[3]||"",!0),us(this,c[4]),this.l=gr(c[5]||"",!0),Sa(this,c[6]||"",!0),this.m=gr(c[7]||"")):(this.h=!1,this.i=new vr(null,this.h))}vn.prototype.toString=function(){var i=[],c=this.j;c&&i.push(yr(c,Ra,!0),":");var d=this.g;return(d||c=="file")&&(i.push("//"),(c=this.o)&&i.push(yr(c,Ra,!0),"@"),i.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&i.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&i.push("/"),i.push(yr(d,d.charAt(0)=="/"?fd:dd,!0))),(d=this.i.toString())&&i.push("?",d),(d=this.m)&&i.push("#",yr(d,md)),i.join("")};function Bt(i){return new vn(i)}function cs(i,c,d){i.j=d?gr(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function us(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function Sa(i,c,d){c instanceof vr?(i.i=c,gd(i.i,i.h)):(d||(c=yr(c,pd)),i.i=new vr(c,i.h))}function we(i,c,d){i.i.set(c,d)}function hs(i){return we(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function gr(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function yr(i,c,d){return typeof i=="string"?(i=encodeURI(i).replace(c,hd),d&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function hd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Ra=/[#\/\?@]/g,dd=/[#\?:]/g,fd=/[#\?]/g,pd=/[#\?@]/g,md=/#/g;function vr(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function tn(i){i.g||(i.g=new Map,i.h=0,i.i&&ud(i.i,function(c,d){i.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=vr.prototype,n.add=function(i,c){tn(this),this.i=null,i=Vn(this,i);var d=this.g.get(i);return d||this.g.set(i,d=[]),d.push(c),this.h+=1,this};function Na(i,c){tn(i),c=Vn(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function ka(i,c){return tn(i),c=Vn(i,c),i.g.has(c)}n.forEach=function(i,c){tn(this),this.g.forEach(function(d,p){d.forEach(function(A){i.call(c,A,p,this)},this)},this)},n.na=function(){tn(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let p=0;p<c.length;p++){const A=i[p];for(let N=0;N<A.length;N++)d.push(c[p])}return d},n.V=function(i){tn(this);let c=[];if(typeof i=="string")ka(this,i)&&(c=c.concat(this.g.get(Vn(this,i))));else{i=Array.from(this.g.values());for(let d=0;d<i.length;d++)c=c.concat(i[d])}return c},n.set=function(i,c){return tn(this),this.i=null,i=Vn(this,i),ka(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function Pa(i,c,d){Na(i,c),0<d.length&&(i.i=null,i.g.set(Vn(i,c),S(d)),i.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var p=c[d];const N=encodeURIComponent(String(p)),F=this.V(p);for(p=0;p<F.length;p++){var A=N;F[p]!==""&&(A+="="+encodeURIComponent(String(F[p]))),i.push(A)}}return this.i=i.join("&")};function Vn(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function gd(i,c){c&&!i.j&&(tn(i),i.i=null,i.g.forEach(function(d,p){var A=p.toLowerCase();p!=A&&(Na(this,p),Pa(this,A,d))},i)),i.j=c}function yd(i,c){const d=new J;if(u.Image){const p=new Image;p.onload=C(nn,d,"TestLoadImage: loaded",!0,c,p),p.onerror=C(nn,d,"TestLoadImage: error",!1,c,p),p.onabort=C(nn,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=C(nn,d,"TestLoadImage: timeout",!1,c,p),u.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=i}else c(!1)}function vd(i,c){const d=new J,p=new AbortController,A=setTimeout(()=>{p.abort(),nn(d,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:p.signal}).then(N=>{clearTimeout(A),N.ok?nn(d,"TestPingServer: ok",!0,c):nn(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(A),nn(d,"TestPingServer: error",!1,c)})}function nn(i,c,d,p,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),p(d)}catch{}}function _d(){this.g=new Ci}function wd(i,c,d){const p=d||"";try{Aa(i,function(A,N){let F=A;f(A)&&(F=ur(A)),c.push(p+N+"="+encodeURIComponent(F))})}catch(A){throw c.push(p+"type="+encodeURIComponent("_badmap")),A}}function ds(i){this.l=i.Ub||null,this.j=i.eb||!1}P(ds,hr),ds.prototype.g=function(){return new fs(this.l,this.j)},ds.prototype.i=function(i){return function(){return i}}({});function fs(i,c){he.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(fs,he),n=fs.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,wr(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||u).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_r(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,wr(this)),this.g&&(this.readyState=3,wr(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ja(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function ja(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?_r(this):wr(this),this.readyState==3&&ja(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,_r(this))},n.Qa=function(i){this.g&&(this.response=i,_r(this))},n.ga=function(){this.g&&_r(this)};function _r(i){i.readyState=4,i.l=null,i.j=null,i.v=null,wr(i)}n.setRequestHeader=function(i,c){this.u.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,i.push(d[0]+": "+d[1]),d=c.next();return i.join(`\r
`)};function wr(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(fs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Oa(i){let c="";return L(i,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function Pi(i,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Oa(d),typeof i=="string"?d!=null&&encodeURIComponent(String(d)):we(i,c,d))}function Te(i){he.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(Te,he);var Id=/^https?$/i,Ed=["POST","PUT"];n=Te.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():fe.g(),this.v=this.o?dr(this.o):dr(fe),this.g.onreadystatechange=x(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(N){Da(this,N);return}if(i=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var A in p)d.set(A,p[A]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const N of p.keys())d.set(N,p.get(N));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),A=u.FormData&&i instanceof u.FormData,!(0<=Array.prototype.indexOf.call(Ed,c,void 0))||p||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[N,F]of d)this.g.setRequestHeader(N,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Fa(this),this.u=!0,this.g.send(i),this.u=!1}catch(N){Da(this,N)}};function Da(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,La(i),ps(i)}function La(i){i.A||(i.A=!0,te(i,"complete"),te(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,te(this,"complete"),te(this,"abort"),ps(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ps(this,!0)),Te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Ma(this):this.bb())},n.bb=function(){Ma(this)};function Ma(i){if(i.h&&typeof a<"u"&&(!i.v[1]||$t(i)!=4||i.Z()!=2)){if(i.u&&$t(i)==4)ae(i.Ea,0,i);else if(te(i,"readystatechange"),$t(i)==4){i.h=!1;try{const F=i.Z();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=F===0){var A=String(i.D).match(Ca)[1]||null;!A&&u.self&&u.self.location&&(A=u.self.location.protocol.slice(0,-1)),p=!Id.test(A?A.toLowerCase():"")}d=p}if(d)te(i,"complete"),te(i,"success");else{i.m=6;try{var N=2<$t(i)?i.g.statusText:""}catch{N=""}i.l=N+" ["+i.Z()+"]",La(i)}}finally{ps(i)}}}}function ps(i,c){if(i.g){Fa(i);const d=i.g,p=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||te(i,"ready");try{d.onreadystatechange=p}catch{}}}function Fa(i){i.I&&(u.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function $t(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<$t(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),_a(c)}};function Va(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function bd(i){const c={};i=(i.g&&2<=$t(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<i.length;p++){if(H(i[p]))continue;var d=w(i[p]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const N=c[A]||[];c[A]=N,N.push(d)}I(c,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ir(i,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[i]||c}function Ua(i){this.Aa=0,this.i=[],this.j=new J,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ir("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ir("baseRetryDelayMs",5e3,i),this.cb=Ir("retryDelaySeedMs",1e4,i),this.Wa=Ir("forwardChannelMaxRetries",2,i),this.wa=Ir("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Ia(i&&i.concurrentRequestLimit),this.Da=new _d,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Ua.prototype,n.la=8,n.G=1,n.connect=function(i,c,d,p){R(0),this.W=i,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Ja(this,null,this.W),gs(this)};function ji(i){if(Ba(i),i.G==3){var c=i.U++,d=Bt(i.I);if(we(d,"SID",i.K),we(d,"RID",c),we(d,"TYPE","terminate"),Er(i,d),c=new ot(i,i.j,c),c.L=2,c.v=hs(Bt(d)),d=!1,u.navigator&&u.navigator.sendBeacon)try{d=u.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&u.Image&&(new Image().src=c.v,d=!0),d||(c.g=Qa(c.j,null),c.g.ea(c.v)),c.F=Date.now(),gn(c)}Ka(i)}function ms(i){i.g&&(Di(i),i.g.cancel(),i.g=null)}function Ba(i){ms(i),i.u&&(u.clearTimeout(i.u),i.u=null),ys(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&u.clearTimeout(i.s),i.s=null)}function gs(i){if(!Ea(i.h)&&!i.s){i.s=!0;var c=i.Ga;ye||et(),De||(ye(),De=!0),pt.add(c,i),i.B=0}}function xd(i,c){return ba(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=M(x(i.Ga,i,c),za(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const A=new ot(this,this.j,i);let N=this.o;if(this.S&&(N?(N=m(N),_(N,this.S)):N=this.S),this.m!==null||this.O||(A.H=N,N=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Ga(this,A,c),d=Bt(this.I),we(d,"RID",i),we(d,"CVER",22),this.D&&we(d,"X-HTTP-Session-Id",this.D),Er(this,d),N&&(this.O?c="headers="+encodeURIComponent(String(Oa(N)))+"&"+c:this.m&&Pi(d,this.m,N)),ki(this.h,A),this.Ua&&we(d,"TYPE","init"),this.P?(we(d,"$req",c),we(d,"SID","null"),A.T=!0,je(A,d,null)):je(A,d,c),this.G=2}}else this.G==3&&(i?$a(this,i):this.i.length==0||Ea(this.h)||$a(this))};function $a(i,c){var d;c?d=c.l:d=i.U++;const p=Bt(i.I);we(p,"SID",i.K),we(p,"RID",d),we(p,"AID",i.T),Er(i,p),i.m&&i.o&&Pi(p,i.m,i.o),d=new ot(i,i.j,d,i.B+1),i.m===null&&(d.H=i.o),c&&(i.i=c.D.concat(i.i)),c=Ga(i,d,1e3),d.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),ki(i.h,d),je(d,p,c)}function Er(i,c){i.H&&L(i.H,function(d,p){we(c,p,d)}),i.l&&Aa({},function(d,p){we(c,p,d)})}function Ga(i,c,d){d=Math.min(i.i.length,d);var p=i.l?x(i.l.Na,i.l,i):null;e:{var A=i.i;let N=-1;for(;;){const F=["count="+d];N==-1?0<d?(N=A[0].g,F.push("ofs="+N)):N=0:F.push("ofs="+N);let me=!0;for(let Be=0;Be<d;Be++){let ue=A[Be].g;const ze=A[Be].map;if(ue-=N,0>ue)N=Math.max(0,A[Be].g-100),me=!1;else try{wd(ze,F,"req"+ue+"_")}catch{p&&p(ze)}}if(me){p=F.join("&");break e}}}return i=i.i.splice(0,d),c.D=i,p}function Ha(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;ye||et(),De||(ye(),De=!0),pt.add(c,i),i.v=0}}function Oi(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=M(x(i.Fa,i),za(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Wa(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=M(x(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,R(10),ms(this),Wa(this))};function Di(i){i.A!=null&&(u.clearTimeout(i.A),i.A=null)}function Wa(i){i.g=new ot(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=Bt(i.qa);we(c,"RID","rpc"),we(c,"SID",i.K),we(c,"AID",i.T),we(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&we(c,"TO",i.ja),we(c,"TYPE","xmlhttp"),Er(i,c),i.m&&i.o&&Pi(c,i.m,i.o),i.L&&(i.g.I=i.L);var d=i.g;i=i.ia,d.L=1,d.v=hs(Bt(c)),d.m=null,d.P=!0,mt(d,i)}n.Za=function(){this.C!=null&&(this.C=null,ms(this),Oi(this),R(19))};function ys(i){i.C!=null&&(u.clearTimeout(i.C),i.C=null)}function qa(i,c){var d=null;if(i.g==c){ys(i),Di(i),i.g=null;var p=2}else if(Ni(i.h,c))d=c.D,xa(i.h,c),p=1;else return;if(i.G!=0){if(c.o)if(p==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var A=i.B;p=Fn(),te(p,new $(p,d)),gs(i)}else Ha(i);else if(A=c.s,A==3||A==0&&0<c.X||!(p==1&&xd(i,c)||p==2&&Oi(i)))switch(d&&0<d.length&&(c=i.h,c.i=c.i.concat(d)),A){case 1:_n(i,5);break;case 4:_n(i,10);break;case 3:_n(i,6);break;default:_n(i,2)}}}function za(i,c){let d=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(d*=2),d*c}function _n(i,c){if(i.j.info("Error code "+c),c==2){var d=x(i.fb,i),p=i.Xa;const A=!p;p=new vn(p||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||cs(p,"https"),hs(p),A?yd(p.toString(),d):vd(p.toString(),d)}else R(2);i.G=0,i.l&&i.l.sa(c),Ka(i),Ba(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),R(2)):(this.j.info("Failed to ping google.com"),R(1))};function Ka(i){if(i.G=0,i.ka=[],i.l){const c=Ta(i.h);(c.length!=0||i.i.length!=0)&&(k(i.ka,c),k(i.ka,i.i),i.h.i.length=0,S(i.i),i.i.length=0),i.l.ra()}}function Ja(i,c,d){var p=d instanceof vn?Bt(d):new vn(d);if(p.g!="")c&&(p.g=c+"."+p.g),us(p,p.s);else{var A=u.location;p=A.protocol,c=c?c+"."+A.hostname:A.hostname,A=+A.port;var N=new vn(null);p&&cs(N,p),c&&(N.g=c),A&&us(N,A),d&&(N.l=d),p=N}return d=i.D,c=i.ya,d&&c&&we(p,d,c),we(p,"VER",i.la),Er(i,p),p}function Qa(i,c,d){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new Te(new ds({eb:d})):new Te(i.pa),c.Ha(i.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ya(){}n=Ya.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function vs(){}vs.prototype.g=function(i,c){return new at(i,c)};function at(i,c){he.call(this),this.g=new Ua(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!H(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!H(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new Un(this)}P(at,he),at.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},at.prototype.close=function(){ji(this.g)},at.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var d={};d.__data__=i,i=d}else this.u&&(d={},d.__data__=ur(i),i=d);c.i.push(new ad(c.Ya++,i)),c.G==3&&gs(c)},at.prototype.N=function(){this.g.l=null,delete this.j,ji(this.g),delete this.g,at.aa.N.call(this)};function Xa(i){fr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const d in c){i=d;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}P(Xa,fr);function Za(){pr.call(this),this.status=1}P(Za,pr);function Un(i){this.g=i}P(Un,Ya),Un.prototype.ua=function(){te(this.g,"a")},Un.prototype.ta=function(i){te(this.g,new Xa(i))},Un.prototype.sa=function(i){te(this.g,new Za)},Un.prototype.ra=function(){te(this.g,"b")},vs.prototype.createWebChannel=vs.prototype.g,at.prototype.send=at.prototype.o,at.prototype.open=at.prototype.m,at.prototype.close=at.prototype.close,wu=function(){return new vs},_u=function(){return Fn()},vu=Ft,co={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ee.NO_ERROR=0,Ee.TIMEOUT=8,Ee.HTTP_ERROR=6,Ps=Ee,Pe.COMPLETE="complete",yu=Pe,ss.EventType=en,en.OPEN="a",en.CLOSE="b",en.ERROR="c",en.MESSAGE="d",he.prototype.listen=he.prototype.K,Ar=ss,Te.prototype.listenOnce=Te.prototype.L,Te.prototype.getLastError=Te.prototype.Ka,Te.prototype.getLastErrorCode=Te.prototype.Ba,Te.prototype.getStatus=Te.prototype.Z,Te.prototype.getResponseJson=Te.prototype.Oa,Te.prototype.getResponseText=Te.prototype.oa,Te.prototype.send=Te.prototype.ea,Te.prototype.setWithCredentials=Te.prototype.Ha,gu=Te}).apply(typeof Is<"u"?Is:typeof self<"u"?self:typeof window<"u"?window:{});const Nl="@firebase/firestore";/**
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
 */class Qe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Qe.UNAUTHENTICATED=new Qe(null),Qe.GOOGLE_CREDENTIALS=new Qe("google-credentials-uid"),Qe.FIRST_PARTY=new Qe("first-party-uid"),Qe.MOCK_USER=new Qe("mock-user");/**
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
 */let sr="10.14.0";/**
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
 */const Cn=new li("@firebase/firestore");function br(){return Cn.logLevel}function W(n,...e){if(Cn.logLevel<=ie.DEBUG){const t=e.map(Bo);Cn.debug(`Firestore (${sr}): ${n}`,...t)}}function Sn(n,...e){if(Cn.logLevel<=ie.ERROR){const t=e.map(Bo);Cn.error(`Firestore (${sr}): ${n}`,...t)}}function zs(n,...e){if(Cn.logLevel<=ie.WARN){const t=e.map(Bo);Cn.warn(`Firestore (${sr}): ${n}`,...t)}}function Bo(n){if(typeof n=="string")return n;try{/**
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
 */function oe(n="Unexpected state"){const e=`FIRESTORE (${sr}) INTERNAL ASSERTION FAILED: `+n;throw Sn(e),new Error(e)}function Ae(n,e){n||oe()}function ve(n,e){return n}/**
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
 */const D={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Y extends xt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class xn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Iu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Ig{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Qe.UNAUTHENTICATED))}shutdown(){}}class Eg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class bg{constructor(e){this.t=e,this.currentUser=Qe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ae(this.o===void 0);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new xn;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new xn,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{W("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(W("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new xn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(W("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ae(typeof r.accessToken=="string"),new Iu(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ae(e===null||typeof e=="string"),new Qe(e)}}class xg{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Qe.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Tg{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new xg(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Qe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ag{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Cg{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Ae(this.o===void 0);const r=o=>{o.error!=null&&W("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,W("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{W("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):W("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Ae(typeof t.token=="string"),this.R=t.token,new Ag(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */class Eu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Sg(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%e.length))}return r}}function ge(n,e){return n<e?-1:n>e?1:0}function Qn(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
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
 */class Ve{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Y(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Y(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new Y(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Y(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ve.fromMillis(Date.now())}static fromDate(e){return Ve.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new Ve(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ge(this.nanoseconds,e.nanoseconds):ge(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class be{constructor(e){this.timestamp=e}static fromTimestamp(e){return new be(e)}static min(){return new be(new Ve(0,0))}static max(){return new be(new Ve(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class Fr{constructor(e,t,r){t===void 0?t=0:t>e.length&&oe(),r===void 0?r=e.length-t:r>e.length-t&&oe(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Fr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Fr?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=e.get(s),a=t.get(s);if(o<a)return-1;if(o>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Se extends Fr{construct(e,t,r){return new Se(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new Y(D.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Se(t)}static emptyPath(){return new Se([])}}const Rg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class He extends Fr{construct(e,t,r){return new He(e,t,r)}static isValidIdentifier(e){return Rg.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),He.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new He(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new Y(D.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new Y(D.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new Y(D.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new Y(D.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new He(t)}static emptyPath(){return new He([])}}/**
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
 */class re{constructor(e){this.path=e}static fromPath(e){return new re(Se.fromString(e))}static fromName(e){return new re(Se.fromString(e).popFirst(5))}static empty(){return new re(Se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Se.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new re(new Se(e.slice()))}}function Ng(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=be.fromTimestamp(r===1e9?new Ve(t+1,0):new Ve(t,r));return new hn(s,re.empty(),e)}function kg(n){return new hn(n.readTime,n.key,-1)}class hn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new hn(be.min(),re.empty(),-1)}static max(){return new hn(be.max(),re.empty(),-1)}}function Pg(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=re.comparator(n.documentKey,e.documentKey),t!==0?t:ge(n.largestBatchId,e.largestBatchId))}/**
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
 */async function bu(n){if(n.code!==D.FAILED_PRECONDITION||n.message!==jg)throw n;W("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class O{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&oe(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new O((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof O?t:O.resolve(t)}catch(t){return O.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):O.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):O.reject(t)}static resolve(e){return new O((t,r)=>{t(e)})}static reject(e){return new O((t,r)=>{r(e)})}static waitFor(e){return new O((t,r)=>{let s=0,o=0,a=!1;e.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=O.resolve(!1);for(const r of e)t=t.next(s=>s?O.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new O((r,s)=>{const o=e.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const f=h;t(e[f]).next(y=>{a[f]=y,++u,u===o&&r(a)},y=>s(y))}})}static doWhile(e,t){return new O((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function Dg(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function di(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class xu{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}xu.oe=-1;function $o(n){return n==null}function Ks(n){return n===0&&1/n==-1/0}function Lg(n){return typeof n=="number"&&Number.isInteger(n)&&!Ks(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function kl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Yr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Tu(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class rt{constructor(e,t){this.comparator=e,this.root=t||$e.EMPTY}insert(e,t){return new rt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,$e.BLACK,null,null))}remove(e){return new rt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,$e.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Es(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Es(this.root,e,this.comparator,!1)}getReverseIterator(){return new Es(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Es(this.root,e,this.comparator,!0)}}class Es{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class $e{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??$e.RED,this.left=s??$e.EMPTY,this.right=o??$e.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new $e(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return $e.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return $e.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,$e.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,$e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw oe();const e=this.left.check();if(e!==this.right.check())throw oe();return e+(this.isRed()?0:1)}}$e.EMPTY=null,$e.RED=!0,$e.BLACK=!1;$e.EMPTY=new class{constructor(){this.size=0}get key(){throw oe()}get value(){throw oe()}get color(){throw oe()}get left(){throw oe()}get right(){throw oe()}copy(e,t,r,s,o){return this}insert(e,t,r){return new $e(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Xe{constructor(e){this.comparator=e,this.data=new rt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Pl(this.data.getIterator())}getIteratorFrom(e){return new Pl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof Xe)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Xe(this.comparator);return t.data=e,t}}class Pl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class It{constructor(e){this.fields=e,e.sort(He.comparator)}static empty(){return new It([])}unionWith(e){let t=new Xe(He.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new It(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Qn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class kt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Mg("Invalid base64 string: "+o):o}}(e);return new kt(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new kt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ge(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}kt.EMPTY_BYTE_STRING=new kt("");const Fg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rn(n){if(Ae(!!n),typeof n=="string"){let e=0;const t=Fg.exec(n);if(Ae(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ge(n.seconds),nanos:Ge(n.nanos)}}function Ge(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Vr(n){return typeof n=="string"?kt.fromBase64String(n):kt.fromUint8Array(n)}/**
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
 */function Go(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Au(n){const e=n.mapValue.fields.__previous_value__;return Go(e)?Au(e):e}function Js(n){const e=Rn(n.mapValue.fields.__local_write_time__.timestampValue);return new Ve(e.seconds,e.nanos)}/**
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
 */class Vg{constructor(e,t,r,s,o,a,u,h,f){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=f}}class Qs{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Qs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Qs&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const bs={mapValue:{}};function Yn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Go(n)?4:Bg(n)?9007199254740991:Ug(n)?10:11:oe()}function Pt(n,e){if(n===e)return!0;const t=Yn(n);if(t!==Yn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Js(n).isEqual(Js(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=Rn(s.timestampValue),u=Rn(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Vr(s.bytesValue).isEqual(Vr(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return Ge(s.geoPointValue.latitude)===Ge(o.geoPointValue.latitude)&&Ge(s.geoPointValue.longitude)===Ge(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return Ge(s.integerValue)===Ge(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=Ge(s.doubleValue),u=Ge(o.doubleValue);return a===u?Ks(a)===Ks(u):isNaN(a)&&isNaN(u)}return!1}(n,e);case 9:return Qn(n.arrayValue.values||[],e.arrayValue.values||[],Pt);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(kl(a)!==kl(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!Pt(a[h],u[h])))return!1;return!0}(n,e);default:return oe()}}function Ur(n,e){return(n.values||[]).find(t=>Pt(t,e))!==void 0}function Xn(n,e){if(n===e)return 0;const t=Yn(n),r=Yn(e);if(t!==r)return ge(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return ge(n.booleanValue,e.booleanValue);case 2:return function(o,a){const u=Ge(o.integerValue||o.doubleValue),h=Ge(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(n,e);case 3:return jl(n.timestampValue,e.timestampValue);case 4:return jl(Js(n),Js(e));case 5:return ge(n.stringValue,e.stringValue);case 6:return function(o,a){const u=Vr(o),h=Vr(a);return u.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let f=0;f<u.length&&f<h.length;f++){const y=ge(u[f],h[f]);if(y!==0)return y}return ge(u.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const u=ge(Ge(o.latitude),Ge(a.latitude));return u!==0?u:ge(Ge(o.longitude),Ge(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Ol(n.arrayValue,e.arrayValue);case 10:return function(o,a){var u,h,f,y;const E=o.fields||{},x=a.fields||{},C=(u=E.value)===null||u===void 0?void 0:u.arrayValue,P=(h=x.value)===null||h===void 0?void 0:h.arrayValue,S=ge(((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0,((y=P==null?void 0:P.values)===null||y===void 0?void 0:y.length)||0);return S!==0?S:Ol(C,P)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===bs.mapValue&&a===bs.mapValue)return 0;if(o===bs.mapValue)return 1;if(a===bs.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),f=a.fields||{},y=Object.keys(f);h.sort(),y.sort();for(let E=0;E<h.length&&E<y.length;++E){const x=ge(h[E],y[E]);if(x!==0)return x;const C=Xn(u[h[E]],f[y[E]]);if(C!==0)return C}return ge(h.length,y.length)}(n.mapValue,e.mapValue);default:throw oe()}}function jl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ge(n,e);const t=Rn(n),r=Rn(e),s=ge(t.seconds,r.seconds);return s!==0?s:ge(t.nanos,r.nanos)}function Ol(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Xn(t[s],r[s]);if(o)return o}return ge(t.length,r.length)}function Zn(n){return uo(n)}function uo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Rn(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Vr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return re.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=uo(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${uo(t.fields[a])}`;return s+"}"}(n.mapValue):oe()}function ho(n){return!!n&&"integerValue"in n}function Ho(n){return!!n&&"arrayValue"in n}function js(n){return!!n&&"mapValue"in n}function Ug(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Rr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Yr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Rr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Rr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Bg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class wt{constructor(e){this.value=e}static empty(){return new wt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!js(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Rr(t)}setAll(e){let t=He.emptyPath(),r={},s=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=u.popLast()}a?r[u.lastSegment()]=Rr(a):s.push(u.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());js(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Pt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];js(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Yr(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new wt(Rr(this.value))}}function Cu(n){const e=[];return Yr(n.fields,(t,r)=>{const s=new He([t]);if(js(r)){const o=Cu(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new It(e)}/**
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
 */class _t{constructor(e,t,r,s,o,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(e){return new _t(e,0,be.min(),be.min(),be.min(),wt.empty(),0)}static newFoundDocument(e,t,r,s){return new _t(e,1,t,be.min(),r,s,0)}static newNoDocument(e,t){return new _t(e,2,t,be.min(),be.min(),wt.empty(),0)}static newUnknownDocument(e,t){return new _t(e,3,t,be.min(),be.min(),wt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(be.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=wt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=wt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=be.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof _t&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new _t(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Ys{constructor(e,t){this.position=e,this.inclusive=t}}function Dl(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=re.comparator(re.fromName(a.referenceValue),t.key):r=Xn(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Ll(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Pt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Xs{constructor(e,t="asc"){this.field=e,this.dir=t}}function $g(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Su{}class Fe extends Su{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Hg(e,t,r):t==="array-contains"?new zg(e,r):t==="in"?new Kg(e,r):t==="not-in"?new Jg(e,r):t==="array-contains-any"?new Qg(e,r):new Fe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Wg(e,r):new qg(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Xn(t,this.value)):t!==null&&Yn(this.value)===Yn(t)&&this.matchesComparison(Xn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return oe()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class dn extends Su{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new dn(e,t)}matches(e){return Ru(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Ru(n){return n.op==="and"}function Nu(n){return Gg(n)&&Ru(n)}function Gg(n){for(const e of n.filters)if(e instanceof dn)return!1;return!0}function fo(n){if(n instanceof Fe)return n.field.canonicalString()+n.op.toString()+Zn(n.value);if(Nu(n))return n.filters.map(e=>fo(e)).join(",");{const e=n.filters.map(t=>fo(t)).join(",");return`${n.op}(${e})`}}function ku(n,e){return n instanceof Fe?function(r,s){return s instanceof Fe&&r.op===s.op&&r.field.isEqual(s.field)&&Pt(r.value,s.value)}(n,e):n instanceof dn?function(r,s){return s instanceof dn&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,u)=>o&&ku(a,s.filters[u]),!0):!1}(n,e):void oe()}function Pu(n){return n instanceof Fe?function(t){return`${t.field.canonicalString()} ${t.op} ${Zn(t.value)}`}(n):n instanceof dn?function(t){return t.op.toString()+" {"+t.getFilters().map(Pu).join(" ,")+"}"}(n):"Filter"}class Hg extends Fe{constructor(e,t,r){super(e,t,r),this.key=re.fromName(r.referenceValue)}matches(e){const t=re.comparator(e.key,this.key);return this.matchesComparison(t)}}class Wg extends Fe{constructor(e,t){super(e,"in",t),this.keys=ju("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class qg extends Fe{constructor(e,t){super(e,"not-in",t),this.keys=ju("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function ju(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>re.fromName(r.referenceValue))}class zg extends Fe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ho(t)&&Ur(t.arrayValue,this.value)}}class Kg extends Fe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ur(this.value.arrayValue,t)}}class Jg extends Fe{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ur(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Ur(this.value.arrayValue,t)}}class Qg extends Fe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ho(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ur(this.value.arrayValue,r))}}/**
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
 */class Yg{constructor(e,t=null,r=[],s=[],o=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.ue=null}}function Ml(n,e=null,t=[],r=[],s=null,o=null,a=null){return new Yg(n,e,t,r,s,o,a)}function Wo(n){const e=ve(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>fo(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),$o(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Zn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Zn(r)).join(",")),e.ue=t}return e.ue}function qo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!$g(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!ku(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ll(n.startAt,e.startAt)&&Ll(n.endAt,e.endAt)}/**
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
 */class fi{constructor(e,t=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Xg(n,e,t,r,s,o,a,u){return new fi(n,e,t,r,s,o,a,u)}function Zg(n){return new fi(n)}function Fl(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ey(n){return n.collectionGroup!==null}function Nr(n){const e=ve(n);if(e.ce===null){e.ce=[];const t=new Set;for(const o of e.explicitOrderBy)e.ce.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new Xe(He.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(f=>{f.isInequality()&&(u=u.add(f.field))})}),u})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.ce.push(new Xs(o,r))}),t.has(He.keyField().canonicalString())||e.ce.push(new Xs(He.keyField(),r))}return e.ce}function Tn(n){const e=ve(n);return e.le||(e.le=ty(e,Nr(n))),e.le}function ty(n,e){if(n.limitType==="F")return Ml(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new Xs(s.field,o)});const t=n.endAt?new Ys(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Ys(n.startAt.position,n.startAt.inclusive):null;return Ml(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function po(n,e,t){return new fi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ou(n,e){return qo(Tn(n),Tn(e))&&n.limitType===e.limitType}function Du(n){return`${Wo(Tn(n))}|lt:${n.limitType}`}function xr(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Pu(s)).join(", ")}]`),$o(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Zn(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Zn(s)).join(",")),`Target(${r})`}(Tn(n))}; limitType=${n.limitType})`}function zo(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):re.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Nr(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,u,h){const f=Dl(a,u,h);return a.inclusive?f<=0:f<0}(r.startAt,Nr(r),s)||r.endAt&&!function(a,u,h){const f=Dl(a,u,h);return a.inclusive?f>=0:f>0}(r.endAt,Nr(r),s))}(n,e)}function ny(n){return(e,t)=>{let r=!1;for(const s of Nr(n)){const o=ry(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function ry(n,e,t){const r=n.field.isKeyField()?re.comparator(e.key,t.key):function(o,a,u){const h=a.data.field(o),f=u.data.field(o);return h!==null&&f!==null?Xn(h,f):oe()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return oe()}}/**
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
 */class ir{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Yr(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return Tu(this.inner)}size(){return this.innerSize}}/**
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
 */const sy=new rt(re.comparator);function Zs(){return sy}const Lu=new rt(re.comparator);function xs(...n){let e=Lu;for(const t of n)e=e.insert(t.key,t);return e}function Mu(n){let e=Lu;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function En(){return kr()}function Fu(){return kr()}function kr(){return new ir(n=>n.toString(),(n,e)=>n.isEqual(e))}const iy=new rt(re.comparator),oy=new Xe(re.comparator);function Ye(...n){let e=oy;for(const t of n)e=e.add(t);return e}const ay=new Xe(ge);function ly(){return ay}/**
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
 */function Ko(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ks(e)?"-0":e}}function Vu(n){return{integerValue:""+n}}function cy(n,e){return Lg(e)?Vu(e):Ko(n,e)}/**
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
 */class pi{constructor(){this._=void 0}}function uy(n,e,t){return n instanceof ei?function(s,o){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Go(o)&&(o=Au(o)),o&&(a.fields.__previous_value__=o),{mapValue:a}}(t,e):n instanceof Br?Bu(n,e):n instanceof $r?$u(n,e):function(s,o){const a=Uu(s,o),u=Vl(a)+Vl(s.Pe);return ho(a)&&ho(s.Pe)?Vu(u):Ko(s.serializer,u)}(n,e)}function hy(n,e,t){return n instanceof Br?Bu(n,e):n instanceof $r?$u(n,e):t}function Uu(n,e){return n instanceof ti?function(r){return ho(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class ei extends pi{}class Br extends pi{constructor(e){super(),this.elements=e}}function Bu(n,e){const t=Gu(e);for(const r of n.elements)t.some(s=>Pt(s,r))||t.push(r);return{arrayValue:{values:t}}}class $r extends pi{constructor(e){super(),this.elements=e}}function $u(n,e){let t=Gu(e);for(const r of n.elements)t=t.filter(s=>!Pt(s,r));return{arrayValue:{values:t}}}class ti extends pi{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Vl(n){return Ge(n.integerValue||n.doubleValue)}function Gu(n){return Ho(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function dy(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Br&&s instanceof Br||r instanceof $r&&s instanceof $r?Qn(r.elements,s.elements,Pt):r instanceof ti&&s instanceof ti?Pt(r.Pe,s.Pe):r instanceof ei&&s instanceof ei}(n.transform,e.transform)}class fy{constructor(e,t){this.version=e,this.transformResults=t}}class Kt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Kt}static exists(e){return new Kt(void 0,e)}static updateTime(e){return new Kt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Os(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class mi{}function Hu(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new qu(n.key,Kt.none()):new Xr(n.key,n.data,Kt.none());{const t=n.data,r=wt.empty();let s=new Xe(He.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new On(n.key,r,new It(s.toArray()),Kt.none())}}function py(n,e,t){n instanceof Xr?function(s,o,a){const u=s.value.clone(),h=Bl(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(n,e,t):n instanceof On?function(s,o,a){if(!Os(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=Bl(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Wu(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Pr(n,e,t,r){return n instanceof Xr?function(o,a,u,h){if(!Os(o.precondition,a))return u;const f=o.value.clone(),y=$l(o.fieldTransforms,h,a);return f.setAll(y),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(n,e,t,r):n instanceof On?function(o,a,u,h){if(!Os(o.precondition,a))return u;const f=$l(o.fieldTransforms,h,a),y=a.data;return y.setAll(Wu(o)),y.setAll(f),a.convertToFoundDocument(a.version,y).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(E=>E.field))}(n,e,t,r):function(o,a,u){return Os(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(n,e,t)}function my(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=Uu(r.transform,s||null);o!=null&&(t===null&&(t=wt.empty()),t.set(r.field,o))}return t||null}function Ul(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Qn(r,s,(o,a)=>dy(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Xr extends mi{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class On extends mi{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Wu(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Bl(n,e,t){const r=new Map;Ae(n.length===t.length);for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,u=e.data.field(o.field);r.set(o.field,hy(a,u,t[s]))}return r}function $l(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,uy(o,a,e))}return r}class qu extends mi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class gy extends mi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class yy{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&py(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Pr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Pr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Fu();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=t.has(s.key)?null:u;const h=Hu(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(be.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Ye())}isEqual(e){return this.batchId===e.batchId&&Qn(this.mutations,e.mutations,(t,r)=>Ul(t,r))&&Qn(this.baseMutations,e.baseMutations,(t,r)=>Ul(t,r))}}class Jo{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Ae(e.mutations.length===r.length);let s=function(){return iy}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Jo(e,t,r,s)}}/**
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
 */var Ce,ce;function _y(n){switch(n){default:return oe();case D.CANCELLED:case D.UNKNOWN:case D.DEADLINE_EXCEEDED:case D.RESOURCE_EXHAUSTED:case D.INTERNAL:case D.UNAVAILABLE:case D.UNAUTHENTICATED:return!1;case D.INVALID_ARGUMENT:case D.NOT_FOUND:case D.ALREADY_EXISTS:case D.PERMISSION_DENIED:case D.FAILED_PRECONDITION:case D.ABORTED:case D.OUT_OF_RANGE:case D.UNIMPLEMENTED:case D.DATA_LOSS:return!0}}function wy(n){if(n===void 0)return Sn("GRPC error has no .code"),D.UNKNOWN;switch(n){case Ce.OK:return D.OK;case Ce.CANCELLED:return D.CANCELLED;case Ce.UNKNOWN:return D.UNKNOWN;case Ce.DEADLINE_EXCEEDED:return D.DEADLINE_EXCEEDED;case Ce.RESOURCE_EXHAUSTED:return D.RESOURCE_EXHAUSTED;case Ce.INTERNAL:return D.INTERNAL;case Ce.UNAVAILABLE:return D.UNAVAILABLE;case Ce.UNAUTHENTICATED:return D.UNAUTHENTICATED;case Ce.INVALID_ARGUMENT:return D.INVALID_ARGUMENT;case Ce.NOT_FOUND:return D.NOT_FOUND;case Ce.ALREADY_EXISTS:return D.ALREADY_EXISTS;case Ce.PERMISSION_DENIED:return D.PERMISSION_DENIED;case Ce.FAILED_PRECONDITION:return D.FAILED_PRECONDITION;case Ce.ABORTED:return D.ABORTED;case Ce.OUT_OF_RANGE:return D.OUT_OF_RANGE;case Ce.UNIMPLEMENTED:return D.UNIMPLEMENTED;case Ce.DATA_LOSS:return D.DATA_LOSS;default:return oe()}}(ce=Ce||(Ce={}))[ce.OK=0]="OK",ce[ce.CANCELLED=1]="CANCELLED",ce[ce.UNKNOWN=2]="UNKNOWN",ce[ce.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ce[ce.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ce[ce.NOT_FOUND=5]="NOT_FOUND",ce[ce.ALREADY_EXISTS=6]="ALREADY_EXISTS",ce[ce.PERMISSION_DENIED=7]="PERMISSION_DENIED",ce[ce.UNAUTHENTICATED=16]="UNAUTHENTICATED",ce[ce.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ce[ce.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ce[ce.ABORTED=10]="ABORTED",ce[ce.OUT_OF_RANGE=11]="OUT_OF_RANGE",ce[ce.UNIMPLEMENTED=12]="UNIMPLEMENTED",ce[ce.INTERNAL=13]="INTERNAL",ce[ce.UNAVAILABLE=14]="UNAVAILABLE",ce[ce.DATA_LOSS=15]="DATA_LOSS";/**
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
 */new mu([4294967295,4294967295],0);class Iy{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function mo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ey(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function by(n,e){return mo(n,e.toTimestamp())}function qn(n){return Ae(!!n),be.fromTimestamp(function(t){const r=Rn(t);return new Ve(r.seconds,r.nanos)}(n))}function zu(n,e){return go(n,e).canonicalString()}function go(n,e){const t=function(s){return new Se(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function xy(n){const e=Se.fromString(n);return Ae(Py(e)),e}function yo(n,e){return zu(n.databaseId,e.path)}function Ty(n){const e=xy(n);return e.length===4?Se.emptyPath():Cy(e)}function Ay(n){return new Se(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Cy(n){return Ae(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Gl(n,e,t){return{name:yo(n,e),fields:t.value.mapValue.fields}}function Sy(n,e){let t;if(e instanceof Xr)t={update:Gl(n,e.key,e.value)};else if(e instanceof qu)t={delete:yo(n,e.key)};else if(e instanceof On)t={update:Gl(n,e.key,e.data),updateMask:ky(e.fieldMask)};else{if(!(e instanceof gy))return oe();t={verify:yo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const u=a.transform;if(u instanceof ei)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Br)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof $r)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof ti)return{fieldPath:a.field.canonicalString(),increment:u.Pe};throw oe()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:by(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:oe()}(n,e.precondition)),t}function Ry(n,e){return n&&n.length>0?(Ae(e!==void 0),n.map(t=>function(s,o){let a=s.updateTime?qn(s.updateTime):qn(o);return a.isEqual(be.min())&&(a=qn(o)),new fy(a,s.transformResults||[])}(t,e))):[]}function Ny(n){let e=Ty(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Ae(r===1);const y=t.from[0];y.allDescendants?s=y.collectionId:e=e.child(y.collectionId)}let o=[];t.where&&(o=function(E){const x=Ku(E);return x instanceof dn&&Nu(x)?x.getFilters():[x]}(t.where));let a=[];t.orderBy&&(a=function(E){return E.map(x=>function(P){return new Xs($n(P.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(P.direction))}(x))}(t.orderBy));let u=null;t.limit&&(u=function(E){let x;return x=typeof E=="object"?E.value:E,$o(x)?null:x}(t.limit));let h=null;t.startAt&&(h=function(E){const x=!!E.before,C=E.values||[];return new Ys(C,x)}(t.startAt));let f=null;return t.endAt&&(f=function(E){const x=!E.before,C=E.values||[];return new Ys(C,x)}(t.endAt)),Xg(e,s,a,o,u,"F",h,f)}function Ku(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=$n(t.unaryFilter.field);return Fe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=$n(t.unaryFilter.field);return Fe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=$n(t.unaryFilter.field);return Fe.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=$n(t.unaryFilter.field);return Fe.create(a,"!=",{nullValue:"NULL_VALUE"});default:return oe()}}(n):n.fieldFilter!==void 0?function(t){return Fe.create($n(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return oe()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return dn.create(t.compositeFilter.filters.map(r=>Ku(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return oe()}}(t.compositeFilter.op))}(n):oe()}function $n(n){return He.fromServerFormat(n.fieldPath)}function ky(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Py(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class jy{constructor(e){this.ct=e}}function Oy(n){const e=Ny({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?po(e,e.limit,"L"):e}/**
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
 */class Dy{constructor(){this.un=new Ly}addToCollectionParentIndex(e,t){return this.un.add(t),O.resolve()}getCollectionParents(e,t){return O.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return O.resolve()}deleteFieldIndex(e,t){return O.resolve()}deleteAllFieldIndexes(e){return O.resolve()}createTargetIndexes(e,t){return O.resolve()}getDocumentsMatchingTarget(e,t){return O.resolve(null)}getIndexType(e,t){return O.resolve(0)}getFieldIndexes(e,t){return O.resolve([])}getNextCollectionGroupToUpdate(e){return O.resolve(null)}getMinOffset(e,t){return O.resolve(hn.min())}getMinOffsetFromCollectionGroup(e,t){return O.resolve(hn.min())}updateCollectionGroup(e,t,r){return O.resolve()}updateIndexEntries(e,t){return O.resolve()}}class Ly{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Xe(Se.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Xe(Se.comparator)).toArray()}}/**
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
 */class er{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new er(0)}static kn(){return new er(-1)}}/**
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
 */class My{constructor(){this.changes=new ir(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,_t.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?O.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Fy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class Vy{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Pr(r.mutation,s,It.empty(),Ve.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,Ye()).next(()=>r))}getLocalViewOfDocuments(e,t,r=Ye()){const s=En();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=xs();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=En();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,Ye()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,r,s){let o=Zs();const a=kr(),u=function(){return kr()}();return t.forEach((h,f)=>{const y=r.get(f.key);s.has(f.key)&&(y===void 0||y.mutation instanceof On)?o=o.insert(f.key,f):y!==void 0?(a.set(f.key,y.mutation.getFieldMask()),Pr(y.mutation,f,y.mutation.getFieldMask(),Ve.now())):a.set(f.key,It.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((f,y)=>a.set(f,y)),t.forEach((f,y)=>{var E;return u.set(f,new Fy(y,(E=a.get(f))!==null&&E!==void 0?E:null))}),u))}recalculateAndSaveOverlays(e,t){const r=kr();let s=new rt((a,u)=>a-u),o=Ye();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(h=>{const f=t.get(h);if(f===null)return;let y=r.get(h)||It.empty();y=u.applyToLocalView(f,y),r.set(h,y);const E=(s.get(u.batchId)||Ye()).add(h);s=s.insert(u.batchId,E)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),f=h.key,y=h.value,E=Fu();y.forEach(x=>{if(!o.has(x)){const C=Hu(t.get(x),r.get(x));C!==null&&E.set(x,C),o=o.add(x)}}),a.push(this.documentOverlayCache.saveOverlays(e,f,E))}return O.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return re.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ey(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):O.resolve(En());let u=-1,h=o;return a.next(f=>O.forEach(f,(y,E)=>(u<E.largestBatchId&&(u=E.largestBatchId),o.get(y)?O.resolve():this.remoteDocumentCache.getEntry(e,y).next(x=>{h=h.insert(y,x)}))).next(()=>this.populateOverlays(e,f,o)).next(()=>this.computeViews(e,h,f,Ye())).next(y=>({batchId:u,changes:Mu(y)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new re(t)).next(r=>{let s=xs();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=xs();return this.indexManager.getCollectionParents(e,o).next(u=>O.forEach(u,h=>{const f=function(E,x){return new fi(x,null,E.explicitOrderBy.slice(),E.filters.slice(),E.limit,E.limitType,E.startAt,E.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,f,r,s).next(y=>{y.forEach((E,x)=>{a=a.insert(E,x)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,f)=>{const y=f.getKey();a.get(y)===null&&(a=a.insert(y,_t.newInvalidDocument(y)))});let u=xs();return a.forEach((h,f)=>{const y=o.get(h);y!==void 0&&Pr(y.mutation,f,It.empty(),Ve.now()),zo(t,f)&&(u=u.insert(h,f))}),u})}}/**
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
 */class Uy{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return O.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:qn(s.createTime)}}(t)),O.resolve()}getNamedQuery(e,t){return O.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:Oy(s.bundledQuery),readTime:qn(s.readTime)}}(t)),O.resolve()}}/**
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
 */class By{constructor(){this.overlays=new rt(re.comparator),this.Ir=new Map}getOverlay(e,t){return O.resolve(this.overlays.get(t))}getOverlays(e,t){const r=En();return O.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.ht(e,t,o)}),O.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Ir.delete(r)),O.resolve()}getOverlaysForCollection(e,t,r){const s=En(),o=t.length+1,a=new re(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,f=h.getKey();if(!t.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return O.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new rt((f,y)=>f-y);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===t&&f.largestBatchId>r){let y=o.get(f.largestBatchId);y===null&&(y=En(),o=o.insert(f.largestBatchId,y)),y.set(f.getKey(),f)}}const u=En(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((f,y)=>u.set(f,y)),!(u.size()>=s)););return O.resolve(u)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new vy(t,r));let o=this.Ir.get(t);o===void 0&&(o=Ye(),this.Ir.set(t,o)),this.Ir.set(t,o.add(r.key))}}/**
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
 */class $y{constructor(){this.sessionToken=kt.EMPTY_BYTE_STRING}getSessionToken(e){return O.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,O.resolve()}}/**
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
 */class Qo{constructor(){this.Tr=new Xe(Me.Er),this.dr=new Xe(Me.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Me(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Me(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new re(new Se([])),r=new Me(t,e),s=new Me(t,e+1),o=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),o.push(a.key)}),o}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new re(new Se([])),r=new Me(t,e),s=new Me(t,e+1);let o=Ye();return this.dr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new Me(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Me{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return re.comparator(e.key,t.key)||ge(e.wr,t.wr)}static Ar(e,t){return ge(e.wr,t.wr)||re.comparator(e.key,t.key)}}/**
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
 */class Gy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Xe(Me.Er)}checkEmpty(e){return O.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new yy(o,t,r,s);this.mutationQueue.push(a);for(const u of s)this.br=this.br.add(new Me(u.key,o)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return O.resolve(a)}lookupMutationBatch(e,t){return O.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),o=s<0?0:s;return O.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return O.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return O.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Me(t,0),s=new Me(t,Number.POSITIVE_INFINITY),o=[];return this.br.forEachInRange([r,s],a=>{const u=this.Dr(a.wr);o.push(u)}),O.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Xe(ge);return t.forEach(s=>{const o=new Me(s,0),a=new Me(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([o,a],u=>{r=r.add(u.wr)})}),O.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;re.isDocumentKey(o)||(o=o.child(""));const a=new Me(new re(o),0);let u=new Xe(ge);return this.br.forEachWhile(h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(u=u.add(h.wr)),!0)},a),O.resolve(this.Cr(u))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){Ae(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return O.forEach(t.mutations,s=>{const o=new Me(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Me(t,0),s=this.br.firstAfterOrEqual(r);return O.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,O.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Hy{constructor(e){this.Mr=e,this.docs=function(){return new rt(re.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return O.resolve(r?r.document.mutableCopy():_t.newInvalidDocument(t))}getEntries(e,t){let r=Zs();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():_t.newInvalidDocument(s))}),O.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Zs();const a=t.path,u=new re(a.child("")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:f,value:{document:y}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||Pg(kg(y),r)<=0||(s.has(y.key)||zo(t,y))&&(o=o.insert(y.key,y.mutableCopy()))}return O.resolve(o)}getAllFromCollectionGroup(e,t,r,s){oe()}Or(e,t){return O.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Wy(this)}getSize(e){return O.resolve(this.size)}}class Wy extends My{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),O.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class qy{constructor(e){this.persistence=e,this.Nr=new ir(t=>Wo(t),qo),this.lastRemoteSnapshotVersion=be.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Qo,this.targetCount=0,this.kr=er.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),O.resolve()}getLastRemoteSnapshotVersion(e){return O.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return O.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),O.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),O.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new er(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,O.resolve()}updateTargetData(e,t){return this.Kn(t),O.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,O.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.Nr.forEach((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.Nr.delete(a),o.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),O.waitFor(o).next(()=>s)}getTargetCount(e){return O.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return O.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),O.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),O.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),O.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return O.resolve(r)}containsKey(e,t){return O.resolve(this.Br.containsKey(t))}}/**
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
 */class zy{constructor(e,t){this.qr={},this.overlays={},this.Qr=new xu(0),this.Kr=!1,this.Kr=!0,this.$r=new $y,this.referenceDelegate=e(this),this.Ur=new qy(this),this.indexManager=new Dy,this.remoteDocumentCache=function(s){return new Hy(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new jy(t),this.Gr=new Uy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new By,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Gy(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){W("MemoryPersistence","Starting transaction:",e);const s=new Ky(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(o=>this.referenceDelegate.jr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Hr(e,t){return O.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class Ky extends Og{constructor(e){super(),this.currentSequenceNumber=e}}class Yo{constructor(e){this.persistence=e,this.Jr=new Qo,this.Yr=null}static Zr(e){return new Yo(e)}get Xr(){if(this.Yr)return this.Yr;throw oe()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),O.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),O.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),O.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.Xr.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return O.forEach(this.Xr,r=>{const s=re.fromPath(r);return this.ei(e,s).next(o=>{o||t.removeEntry(s,be.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return O.or([()=>O.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class Xo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=Ye(),s=Ye();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Xo(e,t.fromCache,r,s)}}/**
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
 */class Qy{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Zd()?8:Dg(Ze())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.Yi(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.Zi(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new Jy;return this.Xi(e,t,a).next(u=>{if(o.result=u,this.zi)return this.es(e,t,a,u.size)})}).next(()=>o.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(br()<=ie.DEBUG&&W("QueryEngine","SDK will not create cache indexes for query:",xr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),O.resolve()):(br()<=ie.DEBUG&&W("QueryEngine","Query:",xr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(br()<=ie.DEBUG&&W("QueryEngine","The SDK decides to create cache indexes for query:",xr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Tn(t))):O.resolve())}Yi(e,t){if(Fl(t))return O.resolve(null);let r=Tn(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=po(t,null,"F"),r=Tn(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=Ye(...o);return this.Ji.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,r).next(h=>{const f=this.ts(t,u);return this.ns(t,f,a,h.readTime)?this.Yi(e,po(t,null,"F")):this.rs(e,f,t,h)}))})))}Zi(e,t,r,s){return Fl(t)||s.isEqual(be.min())?O.resolve(null):this.Ji.getDocuments(e,r).next(o=>{const a=this.ts(t,o);return this.ns(t,a,r,s)?O.resolve(null):(br()<=ie.DEBUG&&W("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),xr(t)),this.rs(e,a,t,Ng(s,-1)).next(u=>u))})}ts(e,t){let r=new Xe(ny(e));return t.forEach((s,o)=>{zo(e,o)&&(r=r.add(o))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Xi(e,t,r){return br()<=ie.DEBUG&&W("QueryEngine","Using full collection scan to execute query:",xr(t)),this.Ji.getDocumentsMatchingQuery(e,t,hn.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
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
 */class Yy{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new rt(ge),this._s=new ir(o=>Wo(o),qo),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Vy(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Xy(n,e,t,r){return new Yy(n,e,t,r)}async function Ju(n,e){const t=ve(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],u=[];let h=Ye();for(const f of s){a.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}for(const f of o){u.push(f.batchId);for(const y of f.mutations)h=h.add(y.key)}return t.localDocuments.getDocuments(r,h).next(f=>({hs:f,removedBatchIds:a,addedBatchIds:u}))})})}function Zy(n,e){const t=ve(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.cs.newChangeBuffer({trackRemovals:!0});return function(u,h,f,y){const E=f.batch,x=E.keys();let C=O.resolve();return x.forEach(P=>{C=C.next(()=>y.getEntry(h,P)).next(S=>{const k=f.docVersions.get(P);Ae(k!==null),S.version.compareTo(k)<0&&(E.applyToRemoteDocument(S,f),S.isValidDocument()&&(S.setReadTime(f.commitVersion),y.addEntry(S)))})}),C.next(()=>u.mutationQueue.removeMutationBatch(h,E))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(u){let h=Ye();for(let f=0;f<u.mutationResults.length;++f)u.mutationResults[f].transformResults.length>0&&(h=h.add(u.batch.mutations[f].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function ev(n){const e=ve(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function tv(n,e){const t=ve(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}class Hl{constructor(){this.activeTargetIds=ly()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nv{constructor(){this.so=new Hl,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Hl,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Wl{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){W("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){W("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ts=null;function Hi(){return Ts===null?Ts=function(){return 268435456+Math.round(2147483648*Math.random())}():Ts++,"0x"+Ts.toString(16)}/**
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
 */const Je="WebChannelConnection";class ov extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${o}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${o}`}get Fo(){return!1}Mo(t,r,s,o,a){const u=Hi(),h=this.xo(t,r.toUriEncodedString());W("RestConnection",`Sending RPC '${t}' ${u}:`,h,s);const f={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(f,o,a),this.No(t,h,f,s).then(y=>(W("RestConnection",`Received RPC '${t}' ${u}: `,y),y),y=>{throw zs("RestConnection",`RPC '${t}' ${u} failed with error: `,y,"url: ",h,"request:",s),y})}Lo(t,r,s,o,a,u){return this.Mo(t,r,s,o,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+sr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((o,a)=>t[a]=o),s&&s.headers.forEach((o,a)=>t[a]=o)}xo(t,r){const s=sv[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const o=Hi();return new Promise((a,u)=>{const h=new gu;h.setWithCredentials(!0),h.listenOnce(yu.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case Ps.NO_ERROR:const y=h.getResponseJson();W(Je,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(y)),a(y);break;case Ps.TIMEOUT:W(Je,`RPC '${e}' ${o} timed out`),u(new Y(D.DEADLINE_EXCEEDED,"Request time out"));break;case Ps.HTTP_ERROR:const E=h.getStatus();if(W(Je,`RPC '${e}' ${o} failed with status:`,E,"response text:",h.getResponseText()),E>0){let x=h.getResponseJson();Array.isArray(x)&&(x=x[0]);const C=x==null?void 0:x.error;if(C&&C.status&&C.message){const P=function(k){const G=k.toLowerCase().replace(/_/g,"-");return Object.values(D).indexOf(G)>=0?G:D.UNKNOWN}(C.status);u(new Y(P,C.message))}else u(new Y(D.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new Y(D.UNAVAILABLE,"Connection failed."));break;default:oe()}}finally{W(Je,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(s);W(Je,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",f,r,15)})}Bo(e,t,r){const s=Hi(),o=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=wu(),u=_u(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(h.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(h.useFetchStreams=!0),this.Oo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const y=o.join("");W(Je,`Creating RPC '${e}' stream ${s}: ${y}`,h);const E=a.createWebChannel(y,h);let x=!1,C=!1;const P=new iv({Io:k=>{C?W(Je,`Not sending because RPC '${e}' stream ${s} is closed:`,k):(x||(W(Je,`Opening RPC '${e}' stream ${s} transport.`),E.open(),x=!0),W(Je,`RPC '${e}' stream ${s} sending:`,k),E.send(k))},To:()=>E.close()}),S=(k,G,H)=>{k.listen(G,U=>{try{H(U)}catch(B){setTimeout(()=>{throw B},0)}})};return S(E,Ar.EventType.OPEN,()=>{C||(W(Je,`RPC '${e}' stream ${s} transport opened.`),P.yo())}),S(E,Ar.EventType.CLOSE,()=>{C||(C=!0,W(Je,`RPC '${e}' stream ${s} transport closed`),P.So())}),S(E,Ar.EventType.ERROR,k=>{C||(C=!0,zs(Je,`RPC '${e}' stream ${s} transport errored:`,k),P.So(new Y(D.UNAVAILABLE,"The operation could not be completed")))}),S(E,Ar.EventType.MESSAGE,k=>{var G;if(!C){const H=k.data[0];Ae(!!H);const U=H,B=U.error||((G=U[0])===null||G===void 0?void 0:G.error);if(B){W(Je,`RPC '${e}' stream ${s} received error:`,B);const de=B.status;let L=function(g){const _=Ce[g];if(_!==void 0)return wy(_)}(de),I=B.message;L===void 0&&(L=D.INTERNAL,I="Unknown error status: "+de+" with message "+B.message),C=!0,P.So(new Y(L,I)),E.close()}else W(Je,`RPC '${e}' stream ${s} received:`,H),P.bo(H)}}),S(u,vu.STAT_EVENT,k=>{k.stat===co.PROXY?W(Je,`RPC '${e}' stream ${s} detected buffering proxy`):k.stat===co.NOPROXY&&W(Je,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{P.wo()},0),P}}function Wi(){return typeof document<"u"?document:null}/**
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
 */function gi(n){return new Iy(n,!0)}/**
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
 */class Qu{constructor(e,t,r=1e3,s=1.5,o=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=o,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&W("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class av{constructor(e,t,r,s,o,a,u,h){this.ui=e,this.Ho=r,this.Jo=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Qu(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===D.RESOURCE_EXHAUSTED?(Sn(t.toString()),Sn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===D.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new Y(D.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return W("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(W("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class lv extends av{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Ae(!!e.streamToken),this.lastStreamToken=e.streamToken,Ae(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Ae(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Ry(e.writeResults,e.commitTime),r=qn(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ay(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sy(this.serializer,r))};this.a_(t)}}/**
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
 */class cv extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new Y(D.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Mo(e,go(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new Y(D.UNKNOWN,o.toString())})}Lo(e,t,r,s,o){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Lo(e,go(t,r),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new Y(D.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class uv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Sn(t),this.D_=!1):W("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class hv{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=o,this.k_._o(a=>{r.enqueueAndForget(async()=>{es(this)&&(W("RemoteStore","Restarting streams for network reachability change."),await async function(h){const f=ve(h);f.L_.add(4),await Zr(f),f.q_.set("Unknown"),f.L_.delete(4),await yi(f)}(this))})}),this.q_=new uv(r,s)}}async function yi(n){if(es(n))for(const e of n.B_)await e(!0)}async function Zr(n){for(const e of n.B_)await e(!1)}function es(n){return ve(n).L_.size===0}async function Yu(n,e,t){if(!di(e))throw e;n.L_.add(1),await Zr(n),n.q_.set("Offline"),t||(t=()=>ev(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{W("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await yi(n)})}function Xu(n,e){return e().catch(t=>Yu(n,t,e))}async function vi(n){const e=ve(n),t=fn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;dv(e);)try{const s=await tv(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,fv(e,s)}catch(s){await Yu(e,s)}Zu(e)&&eh(e)}function dv(n){return es(n)&&n.O_.length<10}function fv(n,e){n.O_.push(e);const t=fn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function Zu(n){return es(n)&&!fn(n).n_()&&n.O_.length>0}function eh(n){fn(n).start()}async function pv(n){fn(n).p_()}async function mv(n){const e=fn(n);for(const t of n.O_)e.m_(t.mutations)}async function gv(n,e,t){const r=n.O_.shift(),s=Jo.from(r,e,t);await Xu(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await vi(n)}async function yv(n,e){e&&fn(n).V_&&await async function(r,s){if(function(a){return _y(a)&&a!==D.ABORTED}(s.code)){const o=r.O_.shift();fn(r).s_(),await Xu(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await vi(r)}}(n,e),Zu(n)&&eh(n)}async function ql(n,e){const t=ve(n);t.asyncQueue.verifyOperationInProgress(),W("RemoteStore","RemoteStore received new credentials");const r=es(t);t.L_.add(3),await Zr(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await yi(t)}async function vv(n,e){const t=ve(n);e?(t.L_.delete(2),await yi(t)):e||(t.L_.add(2),await Zr(t),t.q_.set("Unknown"))}function fn(n){return n.U_||(n.U_=function(t,r,s){const o=ve(t);return o.w_(),new lv(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:pv.bind(null,n),mo:yv.bind(null,n),f_:mv.bind(null,n),g_:gv.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await vi(n)):(await n.U_.stop(),n.O_.length>0&&(W("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Zo{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new xn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,u=new Zo(e,t,a,s,o);return u.start(r),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Y(D.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function th(n,e){if(Sn("AsyncQueue",`${e}: ${n}`),di(n))return new Y(D.UNAVAILABLE,`${e}: ${n}`);throw n}class _v{constructor(){this.queries=zl(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=ve(t),o=s.queries;s.queries=zl(),o.forEach((a,u)=>{for(const h of u.j_)h.onError(r)})})(this,new Y(D.ABORTED,"Firestore shutting down"))}}function zl(){return new ir(n=>Du(n),Ou)}function wv(n){n.Y_.forEach(e=>{e.next()})}var Kl,Jl;(Jl=Kl||(Kl={})).ea="default",Jl.Cache="cache";class Iv{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new ir(u=>Du(u),Ou),this.Ma=new Map,this.xa=new Set,this.Oa=new rt(re.comparator),this.Na=new Map,this.La=new Qo,this.Ba={},this.ka=new Map,this.qa=er.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Ev(n,e,t){const r=Av(n);try{const s=await function(a,u){const h=ve(a),f=Ve.now(),y=u.reduce((C,P)=>C.add(P.key),Ye());let E,x;return h.persistence.runTransaction("Locally write mutations","readwrite",C=>{let P=Zs(),S=Ye();return h.cs.getEntries(C,y).next(k=>{P=k,P.forEach((G,H)=>{H.isValidDocument()||(S=S.add(G))})}).next(()=>h.localDocuments.getOverlayedDocuments(C,P)).next(k=>{E=k;const G=[];for(const H of u){const U=my(H,E.get(H.key).overlayedDocument);U!=null&&G.push(new On(H.key,U,Cu(U.value.mapValue),Kt.exists(!0)))}return h.mutationQueue.addMutationBatch(C,f,G,u)}).next(k=>{x=k;const G=k.applyToLocalDocumentSet(E,S);return h.documentOverlayCache.saveOverlays(C,k.batchId,G)})}).then(()=>({batchId:x.batchId,changes:Mu(E)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let f=a.Ba[a.currentUser.toKey()];f||(f=new rt(ge)),f=f.insert(u,h),a.Ba[a.currentUser.toKey()]=f}(r,s.batchId,t),await _i(r,s.changes),await vi(r.remoteStore)}catch(s){const o=th(s,"Failed to persist write");t.reject(o)}}function Ql(n,e,t){const r=ve(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((o,a)=>{const u=a.view.Z_(e);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=ve(a);h.onlineState=u;let f=!1;h.queries.forEach((y,E)=>{for(const x of E.j_)x.Z_(u)&&(f=!0)}),f&&wv(h)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function bv(n,e){const t=ve(n),r=e.batch.batchId;try{const s=await Zy(t.localStore,e);rh(t,r,null),nh(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await _i(t,s)}catch(s){await bu(s)}}async function xv(n,e,t){const r=ve(n);try{const s=await function(a,u){const h=ve(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",f=>{let y;return h.mutationQueue.lookupMutationBatch(f,u).next(E=>(Ae(E!==null),y=E.keys(),h.mutationQueue.removeMutationBatch(f,E))).next(()=>h.mutationQueue.performConsistencyCheck(f)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(f,y,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,y)).next(()=>h.localDocuments.getDocuments(f,y))})}(r.localStore,e);rh(r,e,t),nh(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await _i(r,s)}catch(s){await bu(s)}}function nh(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function rh(n,e,t){const r=ve(n);let s=r.Ba[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}async function _i(n,e,t){const r=ve(n),s=[],o=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((u,h)=>{a.push(r.Ka(h,e,t).then(f=>{var y;if((f||t)&&r.isPrimaryClient){const E=f?!f.fromCache:(y=void 0)===null||y===void 0?void 0:y.current;r.sharedClientState.updateQueryState(h.targetId,E?"current":"not-current")}if(f){s.push(f);const E=Xo.Wi(h.targetId,f);o.push(E)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(h,f){const y=ve(h);try{await y.persistence.runTransaction("notifyLocalViewChanges","readwrite",E=>O.forEach(f,x=>O.forEach(x.$i,C=>y.persistence.referenceDelegate.addReference(E,x.targetId,C)).next(()=>O.forEach(x.Ui,C=>y.persistence.referenceDelegate.removeReference(E,x.targetId,C)))))}catch(E){if(!di(E))throw E;W("LocalStore","Failed to update sequence numbers: "+E)}for(const E of f){const x=E.targetId;if(!E.fromCache){const C=y.os.get(x),P=C.snapshotVersion,S=C.withLastLimboFreeSnapshotVersion(P);y.os=y.os.insert(x,S)}}}(r.localStore,o))}async function Tv(n,e){const t=ve(n);if(!t.currentUser.isEqual(e)){W("SyncEngine","User change. New user:",e.toKey());const r=await Ju(t.localStore,e);t.currentUser=e,function(o,a){o.ka.forEach(u=>{u.forEach(h=>{h.reject(new Y(D.CANCELLED,a))})}),o.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await _i(t,r.hs)}}function Av(n){const e=ve(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=bv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xv.bind(null,e),e}class ni{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=gi(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Xy(this.persistence,new Qy,e.initialUser,this.serializer)}Ga(e){return new zy(Yo.Zr,this.serializer)}Wa(e){return new nv}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ni.provider={build:()=>new ni};class vo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ql(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Tv.bind(null,this.syncEngine),await vv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new _v}()}createDatastore(e){const t=gi(e.databaseInfo.databaseId),r=function(o){return new ov(o)}(e.databaseInfo);return function(o,a,u,h){return new cv(o,a,u,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,u){return new hv(r,s,o,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>Ql(this.syncEngine,t,0),function(){return Wl.D()?new Wl:new rv}())}createSyncEngine(e,t){return function(s,o,a,u,h,f,y){const E=new Iv(s,o,a,u,h,f);return y&&(E.Qa=!0),E}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=ve(s);W("RemoteStore","RemoteStore shutting down."),o.L_.add(5),await Zr(o),o.k_.shutdown(),o.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}vo.provider={build:()=>new vo};/**
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
 */class Cv{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Qe.UNAUTHENTICATED,this.clientId=Eu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{W("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(W("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new xn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=th(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function qi(n,e){n.asyncQueue.verifyOperationInProgress(),W("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Ju(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Yl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Sv(n);W("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>ql(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>ql(e.remoteStore,s)),n._onlineComponents=e}async function Sv(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){W("FirestoreClient","Using user provided OfflineComponentProvider");try{await qi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===D.FAILED_PRECONDITION||s.code===D.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;zs("Error using user provided cache. Falling back to memory cache: "+t),await qi(n,new ni)}}else W("FirestoreClient","Using default OfflineComponentProvider"),await qi(n,new ni);return n._offlineComponents}async function Rv(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(W("FirestoreClient","Using user provided OnlineComponentProvider"),await Yl(n,n._uninitializedComponentsProvider._online)):(W("FirestoreClient","Using default OnlineComponentProvider"),await Yl(n,new vo))),n._onlineComponents}function Nv(n){return Rv(n).then(e=>e.syncEngine)}/**
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
 */function sh(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Xl=new Map;/**
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
 */function kv(n,e,t){if(!t)throw new Y(D.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Pv(n,e,t,r){if(e===!0&&r===!0)throw new Y(D.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Zl(n){if(!re.isDocumentKey(n))throw new Y(D.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ea(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":oe()}function _o(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new Y(D.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ea(n);throw new Y(D.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class ec{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new Y(D.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new Y(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Pv("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=sh((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new Y(D.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ta{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ec({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Y(D.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Y(D.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ec(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Ig;switch(r.type){case"firstParty":return new Tg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new Y(D.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Xl.get(t);r&&(W("ComponentProvider","Removing Datastore"),Xl.delete(t),r.terminate())}(this),Promise.resolve()}}function jv(n,e,t,r={}){var s;const o=(n=_o(n,ta))._getSettings(),a=`${e}:${t}`;if(o.host!=="firestore.googleapis.com"&&o.host!==a&&zs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let u,h;if(typeof r.mockUserToken=="string")u=r.mockUserToken,h=Qe.MOCK_USER;else{u=zd(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new Y(D.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new Qe(f)}n._authCredentials=new Eg(new Iu(u,h))}}/**
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
 */class na{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new na(this.firestore,e,this._query)}}class Jt{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Gr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Jt(this.firestore,e,this._key)}}class Gr extends na{constructor(e,t,r){super(e,t,Zg(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Jt(this.firestore,null,new re(e))}withConverter(e){return new Gr(this.firestore,e,this._path)}}function Ov(n,e,...t){if(n=nt(n),arguments.length===1&&(e=Eu.newId()),kv("doc","path",e),n instanceof ta){const r=Se.fromString(e,...t);return Zl(r),new Jt(n,null,new re(r))}{if(!(n instanceof Jt||n instanceof Gr))throw new Y(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Se.fromString(e,...t));return Zl(r),new Jt(n.firestore,n instanceof Gr?n.converter:null,new re(r))}}/**
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
 */class tc{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Qu(this,"async_queue_retry"),this.Vu=()=>{const r=Wi();r&&W("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Wi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Wi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new xn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!di(e))throw e;W("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let u=a.message||"";return a.stack&&(u=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),u}(r);throw Sn("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Zo.createAndSchedule(this,e,t,r,o=>this.yu(o));return this.Tu.push(s),s}fu(){this.Eu&&oe()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ih extends ta{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new tc,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new tc(e),this._firestoreClient=void 0,await e}}}function Dv(n,e){const t=typeof n=="object"?n:Ro(),r=typeof n=="string"?n:"(default)",s=jn(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Wd("firestore");o&&jv(s,...o)}return s}function Lv(n){if(n._terminated)throw new Y(D.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Mv(n),n._firestoreClient}function Mv(n){var e,t,r;const s=n._freezeSettings(),o=function(u,h,f,y){return new Vg(u,h,f,y.host,y.ssl,y.experimentalForceLongPolling,y.experimentalAutoDetectLongPolling,sh(y.experimentalLongPollingOptions),y.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Cv(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}}(n._componentsProvider))}/**
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
 */class Hr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Hr(kt.fromBase64String(e))}catch(t){throw new Y(D.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Hr(kt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class oh{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new Y(D.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new He(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class ah{constructor(e){this._methodName=e}}/**
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
 */class lh{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Y(D.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Y(D.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ge(this._lat,e._lat)||ge(this._long,e._long)}}/**
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
 */class ch{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}}/**
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
 */const Fv=/^__.*__$/;class Vv{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new On(e,this.data,this.fieldMask,t,this.fieldTransforms):new Xr(e,this.data,t,this.fieldTransforms)}}function uh(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw oe()}}class ra{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.vu(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ra(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ri(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(uh(this.Cu)&&Fv.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Uv{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||gi(e)}Qu(e,t,r,s=!1){return new ra({Cu:e,methodName:t,qu:r,path:He.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bv(n){const e=n._freezeSettings(),t=gi(n._databaseId);return new Uv(n._databaseId,!!e.ignoreUndefinedProperties,t)}function $v(n,e,t,r,s,o={}){const a=n.Qu(o.merge||o.mergeFields?2:0,e,t,s);ph("Data must be an object, but it was:",a,r);const u=dh(r,a);let h,f;if(o.merge)h=new It(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const y=[];for(const E of o.mergeFields){const x=Gv(e,E,t);if(!a.contains(x))throw new Y(D.INVALID_ARGUMENT,`Field '${x}' is specified in your field mask but missing from your input data.`);qv(y,x)||y.push(x)}h=new It(y),f=a.fieldTransforms.filter(E=>h.covers(E.field))}else h=null,f=a.fieldTransforms;return new Vv(new wt(u),h,f)}function hh(n,e){if(fh(n=nt(n)))return ph("Unsupported field value:",e,n),dh(n,e);if(n instanceof ah)return function(r,s){if(!uh(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const u of r){let h=hh(u,s.Lu(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=nt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return cy(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=Ve.fromDate(r);return{timestampValue:mo(s.serializer,o)}}if(r instanceof Ve){const o=new Ve(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:mo(s.serializer,o)}}if(r instanceof lh)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Hr)return{bytesValue:Ey(s.serializer,r._byteString)};if(r instanceof Jt){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:zu(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof ch)return function(a,u){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(h=>{if(typeof h!="number")throw u.Bu("VectorValues must only contain numeric values.");return Ko(u.serializer,h)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${ea(r)}`)}(n,e)}function dh(n,e){const t={};return Tu(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Yr(n,(r,s)=>{const o=hh(s,e.Mu(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function fh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Ve||n instanceof lh||n instanceof Hr||n instanceof Jt||n instanceof ah||n instanceof ch)}function ph(n,e,t){if(!fh(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=ea(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Gv(n,e,t){if((e=nt(e))instanceof oh)return e._internalPath;if(typeof e=="string")return Wv(n,e);throw ri("Field path arguments must be of type string or ",n,!1,void 0,t)}const Hv=new RegExp("[~\\*/\\[\\]]");function Wv(n,e,t){if(e.search(Hv)>=0)throw ri(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new oh(...e.split("."))._internalPath}catch{throw ri(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ri(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new Y(D.INVALID_ARGUMENT,u+n+h)}function qv(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */function zv(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}function Kv(n,e,t){n=_o(n,Jt);const r=_o(n.firestore,ih),s=zv(n.converter,e,t);return Jv(r,[$v(Bv(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Kt.none())])}function Jv(n,e){return function(r,s){const o=new xn;return r.asyncQueue.enqueueAndForget(async()=>Ev(await Nv(r),s,o)),o.promise}(Lv(n),e)}(function(e,t=!0){(function(s){sr=s})(tr),Rt(new bt("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new ih(new bg(r.getProvider("auth-internal")),new Cg(r.getProvider("app-check-internal")),function(f,y){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new Y(D.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Qs(f.options.projectId,y)}(a,s),a);return o=Object.assign({useFetchStreams:t},o),u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),dt(Nl,"4.7.3",e),dt(Nl,"4.7.3","esm2017")})();const mh="@firebase/installations",sa="0.6.9";/**
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
 */const gh=1e4,yh=`w:${sa}`,vh="FIS_v2",Qv="https://firebaseinstallations.googleapis.com/v1",Yv=60*60*1e3,Xv="installations",Zv="Installations";/**
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
 */const e_={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Nn=new Pn(Xv,Zv,e_);function _h(n){return n instanceof xt&&n.code.includes("request-failed")}/**
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
 */function wh({projectId:n}){return`${Qv}/projects/${n}/installations`}function Ih(n){return{token:n.token,requestStatus:2,expiresIn:n_(n.expiresIn),creationTime:Date.now()}}async function Eh(n,e){const r=(await e.json()).error;return Nn.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function bh({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function t_(n,{refreshToken:e}){const t=bh(n);return t.append("Authorization",r_(e)),t}async function xh(n){const e=await n();return e.status>=500&&e.status<600?n():e}function n_(n){return Number(n.replace("s","000"))}function r_(n){return`${vh} ${n}`}/**
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
 */async function s_({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=wh(n),s=bh(n),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={fid:t,authVersion:vh,appId:n.appId,sdkVersion:yh},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await xh(()=>fetch(r,u));if(h.ok){const f=await h.json();return{fid:f.fid||t,registrationStatus:2,refreshToken:f.refreshToken,authToken:Ih(f.authToken)}}else throw await Eh("Create Installation",h)}/**
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
 */function Th(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */const o_=/^[cdef][\w-]{21}$/,wo="";function a_(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=l_(n);return o_.test(t)?t:wo}catch{return wo}}function l_(n){return i_(n).substr(0,22)}/**
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
 */function wi(n){return`${n.appName}!${n.appId}`}/**
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
 */const Ah=new Map;function Ch(n,e){const t=wi(n);Sh(t,e),c_(t,e)}function Sh(n,e){const t=Ah.get(n);if(t)for(const r of t)r(e)}function c_(n,e){const t=u_();t&&t.postMessage({key:n,fid:e}),h_()}let bn=null;function u_(){return!bn&&"BroadcastChannel"in self&&(bn=new BroadcastChannel("[Firebase] FID Change"),bn.onmessage=n=>{Sh(n.data.key,n.data.fid)}),bn}function h_(){Ah.size===0&&bn&&(bn.close(),bn=null)}/**
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
 */const d_="firebase-installations-database",f_=1,kn="firebase-installations-store";let zi=null;function ia(){return zi||(zi=kc(d_,f_,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(kn)}}})),zi}async function si(n,e){const t=wi(n),s=(await ia()).transaction(kn,"readwrite"),o=s.objectStore(kn),a=await o.get(t);return await o.put(e,t),await s.done,(!a||a.fid!==e.fid)&&Ch(n,e.fid),e}async function Rh(n){const e=wi(n),r=(await ia()).transaction(kn,"readwrite");await r.objectStore(kn).delete(e),await r.done}async function Ii(n,e){const t=wi(n),s=(await ia()).transaction(kn,"readwrite"),o=s.objectStore(kn),a=await o.get(t),u=e(a);return u===void 0?await o.delete(t):await o.put(u,t),await s.done,u&&(!a||a.fid!==u.fid)&&Ch(n,u.fid),u}/**
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
 */async function oa(n){let e;const t=await Ii(n.appConfig,r=>{const s=p_(r),o=m_(n,s);return e=o.registrationPromise,o.installationEntry});return t.fid===wo?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function p_(n){const e=n||{fid:a_(),registrationStatus:0};return Nh(e)}function m_(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Nn.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=g_(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:y_(n)}:{installationEntry:e}}async function g_(n,e){try{const t=await s_(n,e);return si(n.appConfig,t)}catch(t){throw _h(t)&&t.customData.serverCode===409?await Rh(n.appConfig):await si(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function y_(n){let e=await nc(n.appConfig);for(;e.registrationStatus===1;)await Th(100),e=await nc(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await oa(n);return r||t}return e}function nc(n){return Ii(n,e=>{if(!e)throw Nn.create("installation-not-found");return Nh(e)})}function Nh(n){return v_(n)?{fid:n.fid,registrationStatus:0}:n}function v_(n){return n.registrationStatus===1&&n.registrationTime+gh<Date.now()}/**
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
 */async function __({appConfig:n,heartbeatServiceProvider:e},t){const r=w_(n,t),s=t_(n,t),o=e.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={installation:{sdkVersion:yh,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await xh(()=>fetch(r,u));if(h.ok){const f=await h.json();return Ih(f)}else throw await Eh("Generate Auth Token",h)}function w_(n,{fid:e}){return`${wh(n)}/${e}/authTokens:generate`}/**
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
 */async function aa(n,e=!1){let t;const r=await Ii(n.appConfig,o=>{if(!kh(o))throw Nn.create("not-registered");const a=o.authToken;if(!e&&b_(a))return o;if(a.requestStatus===1)return t=I_(n,e),o;{if(!navigator.onLine)throw Nn.create("app-offline");const u=T_(o);return t=E_(n,u),u}});return t?await t:r.authToken}async function I_(n,e){let t=await rc(n.appConfig);for(;t.authToken.requestStatus===1;)await Th(100),t=await rc(n.appConfig);const r=t.authToken;return r.requestStatus===0?aa(n,e):r}function rc(n){return Ii(n,e=>{if(!kh(e))throw Nn.create("not-registered");const t=e.authToken;return A_(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function E_(n,e){try{const t=await __(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await si(n.appConfig,r),t}catch(t){if(_h(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Rh(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await si(n.appConfig,r)}throw t}}function kh(n){return n!==void 0&&n.registrationStatus===2}function b_(n){return n.requestStatus===2&&!x_(n)}function x_(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Yv}function T_(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function A_(n){return n.requestStatus===1&&n.requestTime+gh<Date.now()}/**
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
 */async function C_(n){const e=n,{installationEntry:t,registrationPromise:r}=await oa(e);return r?r.catch(console.error):aa(e).catch(console.error),t.fid}/**
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
 */async function S_(n,e=!1){const t=n;return await R_(t),(await aa(t,e)).token}async function R_(n){const{registrationPromise:e}=await oa(n);e&&await e}/**
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
 */function N_(n){if(!n||!n.options)throw Ki("App Configuration");if(!n.name)throw Ki("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Ki(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Ki(n){return Nn.create("missing-app-config-values",{valueName:n})}/**
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
 */const Ph="installations",k_="installations-internal",P_=n=>{const e=n.getProvider("app").getImmediate(),t=N_(e),r=jn(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},j_=n=>{const e=n.getProvider("app").getImmediate(),t=jn(e,Ph).getImmediate();return{getId:()=>C_(t),getToken:s=>S_(t,s)}};function O_(){Rt(new bt(Ph,P_,"PUBLIC")),Rt(new bt(k_,j_,"PRIVATE"))}O_();dt(mh,sa);dt(mh,sa,"esm2017");/**
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
 */const ii="analytics",D_="firebase_id",L_="origin",M_=60*1e3,F_="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",la="https://www.googletagmanager.com/gtag/js";/**
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
 */const tt=new li("@firebase/analytics");/**
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
 */const V_={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},lt=new Pn("analytics","Analytics",V_);/**
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
 */function U_(n){if(!n.startsWith(la)){const e=lt.create("invalid-gtag-resource",{gtagURL:n});return tt.warn(e.message),""}return n}function jh(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function B_(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function $_(n,e){const t=B_("firebase-js-sdk-policy",{createScriptURL:U_}),r=document.createElement("script"),s=`${la}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function G_(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function H_(n,e,t,r,s,o){const a=r[s];try{if(a)await e[a];else{const h=(await jh(t)).find(f=>f.measurementId===s);h&&await e[h.appId]}}catch(u){tt.error(u)}n("config",s,o)}async function W_(n,e,t,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const u=await jh(t);for(const h of a){const f=u.find(E=>E.measurementId===h),y=f&&e[f.appId];if(y)o.push(y);else{o=[];break}}}o.length===0&&(o=Object.values(e)),await Promise.all(o),n("event",r,s||{})}catch(o){tt.error(o)}}function q_(n,e,t,r){async function s(o,...a){try{if(o==="event"){const[u,h]=a;await W_(n,e,t,u,h)}else if(o==="config"){const[u,h]=a;await H_(n,e,t,r,u,h)}else if(o==="consent"){const[u,h]=a;n("consent",u,h)}else if(o==="get"){const[u,h,f]=a;n("get",u,h,f)}else if(o==="set"){const[u]=a;n("set",u)}else n(o,...a)}catch(u){tt.error(u)}}return s}function z_(n,e,t,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=q_(o,n,e,t),{gtagCore:o,wrappedGtag:window[s]}}function K_(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(la)&&t.src.includes(n))return t;return null}/**
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
 */const J_=30,Q_=1e3;class Y_{constructor(e={},t=Q_){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Oh=new Y_;function X_(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Z_(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:X_(r)},o=F_.replace("{app-id}",t),a=await fetch(o,s);if(a.status!==200&&a.status!==304){let u="";try{const h=await a.json();!((e=h.error)===null||e===void 0)&&e.message&&(u=h.error.message)}catch{}throw lt.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function ew(n,e=Oh,t){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw lt.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw lt.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new rw;return setTimeout(async()=>{u.abort()},M_),Dh({appId:r,apiKey:s,measurementId:o},a,u,e)}async function Dh(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Oh){var o;const{appId:a,measurementId:u}=n;try{await tw(r,e)}catch(h){if(u)return tt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:a,measurementId:u};throw h}try{const h=await Z_(n);return s.deleteThrottleMetadata(a),h}catch(h){const f=h;if(!nw(f)){if(s.deleteThrottleMetadata(a),u)return tt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${f==null?void 0:f.message}]`),{appId:a,measurementId:u};throw h}const y=Number((o=f==null?void 0:f.customData)===null||o===void 0?void 0:o.httpStatus)===503?rl(t,s.intervalMillis,J_):rl(t,s.intervalMillis),E={throttleEndTimeMillis:Date.now()+y,backoffCount:t+1};return s.setThrottleMetadata(a,E),tt.debug(`Calling attemptFetch again in ${y} millis`),Dh(n,E,r,s)}}function tw(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),o=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(o),r(lt.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function nw(n){if(!(n instanceof xt)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class rw{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function sw(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const o=await e,a=Object.assign(Object.assign({},r),{send_to:o});n("event",t,a)}}/**
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
 */async function iw(){if(Cc())try{await Sc()}catch(n){return tt.warn(lt.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return tt.warn(lt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ow(n,e,t,r,s,o,a){var u;const h=ew(n);h.then(C=>{t[C.measurementId]=C.appId,n.options.measurementId&&C.measurementId!==n.options.measurementId&&tt.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${C.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(C=>tt.error(C)),e.push(h);const f=iw().then(C=>{if(C)return r.getId()}),[y,E]=await Promise.all([h,f]);K_(o)||$_(o,y.measurementId),s("js",new Date);const x=(u=a==null?void 0:a.config)!==null&&u!==void 0?u:{};return x[L_]="firebase",x.update=!0,E!=null&&(x[D_]=E),s("config",y.measurementId,x),y.measurementId}/**
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
 */class aw{constructor(e){this.app=e}_delete(){return delete jr[this.app.options.appId],Promise.resolve()}}let jr={},sc=[];const ic={};let Ji="dataLayer",lw="gtag",oc,Lh,ac=!1;function cw(){const n=[];if(Ac()&&n.push("This is a browser extension environment."),ef()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=lt.create("invalid-analytics-context",{errorInfo:e});tt.warn(t.message)}}function uw(n,e,t){cw();const r=n.options.appId;if(!r)throw lt.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)tt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw lt.create("no-api-key");if(jr[r]!=null)throw lt.create("already-exists",{id:r});if(!ac){G_(Ji);const{wrappedGtag:o,gtagCore:a}=z_(jr,sc,ic,Ji,lw);Lh=o,oc=a,ac=!0}return jr[r]=ow(n,sc,ic,e,oc,Ji,t),new aw(n)}function hw(n=Ro()){n=nt(n);const e=jn(n,ii);return e.isInitialized()?e.getImmediate():dw(n)}function dw(n,e={}){const t=jn(n,ii);if(t.isInitialized()){const s=t.getImmediate();if(Dr(e,t.getOptions()))return s;throw lt.create("already-initialized")}return t.initialize({options:e})}function fw(n,e,t,r){n=nt(n),sw(Lh,jr[n.app.options.appId],e,t,r).catch(s=>tt.error(s))}const lc="@firebase/analytics",cc="0.10.8";function pw(){Rt(new bt(ii,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return uw(r,s,t)},"PUBLIC")),Rt(new bt("analytics-internal",n,"PRIVATE")),dt(lc,cc),dt(lc,cc,"esm2017");function n(e){try{const t=e.getProvider(ii).getImmediate();return{logEvent:(r,s,o)=>fw(t,r,s,o)}}catch(t){throw lt.create("interop-component-reg-failed",{reason:t})}}}pw();const mw={apiKey:"AIzaSyCIqpOl5nT3VH149xISPqyLgkjyIiMWPb8",authDomain:"flinx-8a05e.firebaseapp.com",projectId:"flinx-8a05e",storageBucket:"flinx-8a05e.firebasestorage.app",messagingSenderId:"977393893446",appId:"1:977393893446:web:308db5f232f7c5558cca47",measurementId:"G-N0LW13KMNJ"},ca=Pc(mw);let gw;if(typeof window<"u")try{gw=hw(ca)}catch{console.log("Analytics initialization skipped (local development)")}const Wr=yg(ca),yw=Dv(ca),ua=new Ht;ua.addScope("profile");ua.addScope("email");ua.addScope("openid");const qr=new Gt,Mh="863917229498555";console.log("🔧 Configuring Facebook Auth Provider:");console.log("   - App ID:",Mh);console.log("   - Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler");qr.setCustomParameters({app_id:Mh,display:"popup",auth_type:"rerequest",scope:"public_profile,email"});qr.addScope("public_profile");qr.addScope("email");console.log("✅ Facebook Auth Provider initialized with:");console.log("   - Public Profile scope: ✓");console.log("   - Email scope: ✓");console.log("   - Web OAuth redirect enabled: ✓");const Fh=async(n,e)=>{var a,u,h;console.log(`📝 Processing ${e} login for user:`,n.email);let t=null;e==="facebook"&&((a=n.providerData[0])!=null&&a.uid)&&(t=n.providerData[0].uid);const r={uid:n.uid,email:n.email,name:n.displayName||"User",picture:n.photoURL||null,authProvider:e,googleId:e==="google"?(u=n.providerData[0])==null?void 0:u.uid:null,facebookId:e==="facebook"?t:null,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};console.log("✅ User info extracted:",{email:r.email,name:r.name,authProvider:r.authProvider});try{const f=await n.getIdToken();localStorage.setItem("idToken",f),console.log("🔐 Firebase ID token stored for Socket.IO")}catch(f){console.error("❌ Failed to get Firebase ID token:",f)}try{const y=await fetch("https://flinxx-backend.onrender.com/api/users/save",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({uid:n.uid,email:n.email,displayName:n.displayName||"User",photoURL:n.photoURL||null,authProvider:e})});if(!y.ok)throw new Error(`Failed to save user: ${y.status}`);const E=await y.json();console.log("✅ User saved to Neon PostgreSQL:",E.user),E.user&&(r.profileCompleted=E.user.profileCompleted,r.isProfileCompleted=E.user.profileCompleted,r.id=E.user.id,r.uuid=E.user.uuid,console.log("[FIREBASE] 🎯 Updated userInfo with profileCompleted:",E.user.profileCompleted)),localStorage.setItem("dbUserId",E.user.id)}catch(f){console.error("⚠️ Error saving user to backend database:",f)}try{await Kv(Ov(yw,"users",n.uid),{email:n.email,displayName:n.displayName,photoURL:n.photoURL,authProvider:e,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()},{merge:!0}),console.log("✅ User saved to Firestore")}catch(f){console.error("⚠️ Error saving user to Firestore:",f)}console.log(`
🟠 [firebase] handleLoginSuccess storing to localStorage`),console.log("🟠 [firebase]   - userInfo.profileCompleted =",r.profileCompleted),console.log("🟠 [firebase]   - userInfo.isProfileCompleted =",r.isProfileCompleted);const s={id:r.id,uuid:r.uuid,uid:r.uid,name:n.displayName,email:n.email,picture:n.photoURL,googleId:e==="google"?(h=n.providerData[0])==null?void 0:h.uid:null,facebookId:e==="facebook"?t:null,profileCompleted:r.profileCompleted||!1,isProfileCompleted:r.profileCompleted||!1,authProvider:e};console.log("🟠 [firebase] userToStore object:",s),localStorage.setItem("user",JSON.stringify(s)),localStorage.setItem("authProvider",e),localStorage.setItem("userInfo",JSON.stringify(r)),console.log("🟠 [firebase] ✅ Stored to localStorage, verifying...");const o=JSON.parse(localStorage.getItem("user"));return console.log("🟠 [firebase]   - Verified profileCompleted:",o.profileCompleted),console.log("🟠 [firebase] ✅ User data stored in localStorage with profileCompleted:",r.profileCompleted||!1),r},uc=async()=>{var n;try{console.log("📱 Starting Facebook login via popup...");const e=await Tm(Wr,qr);console.log("✅ Facebook popup login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;let r="facebook";return t==="facebook.com"&&(r="facebook"),Fh(e.user,r)}catch(e){console.warn("⚠️ Facebook popup login failed, trying redirect method:",e.code);try{return console.log("📱 Starting Facebook login via redirect..."),await km(Wr,qr),null}catch(t){throw console.error("❌ Facebook login failed:",t),t}}},vw=async()=>{var n;try{const e=await jm(Wr);if(e!=null&&e.user){console.log("✅ Redirect login successful:",e.user.email);const t=(n=e.user.providerData[0])==null?void 0:n.providerId;console.log("Provider:",t);let r="unknown";return t==="google.com"?r="google":t==="facebook.com"&&(r="facebook"),Fh(e.user,r)}}catch(e){console.error("Redirect result error:",e),e.code==="auth/account-exists-with-different-credential"?console.error("Account exists with different credential"):e.code==="auth/auth-domain-config-required"&&console.error("Auth domain config required")}return null},Ei="https://flinxx-backend.onrender.com",Vh=()=>localStorage.getItem("token"),Uh=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getFriends blocked – invalid UUID:",n),[];const e=await fetch(`${Ei}/api/friends?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});return e.ok?await e.json():[]}catch(e){return console.error("Error fetching friends:",e),[]}},_w=async n=>{try{if(!n||typeof n!="string"||n.length!==36)return console.warn("⛔ getNotifications blocked – invalid UUID:",n),[];console.log("📬 Fetching notifications for user");const e=await fetch(`${Ei}/api/notifications?userId=${n}`,{method:"GET",headers:{Authorization:`Bearer ${Vh()}`,"Content-Type":"application/json"}});if(!e.ok)return[];const t=await e.json();return console.log("✅ Notifications loaded:",t.length,"items"),t}catch(e){return console.error("❌ Error fetching notifications:",e),[]}},Qi=async n=>{if(!n||typeof n!="string"||n.length!==36)return 0;try{const e=await fetch(`${Ei}/api/messages/unread-count/${n}`,{method:"GET",headers:{"Content-Type":"application/json"}});return e.ok?(await e.json()).unreadCount??0:0}catch{return 0}},Or=async(n,e,t)=>{try{const r=localStorage.getItem("token");if(!r)return console.warn("No auth token in markMessagesAsRead"),{success:!1};let s=null;if(typeof e=="string"&&e.includes("_"))s=e;else{const u=e,h=n;if(!h||h.length!==36)return console.error("❌ Invalid UUID in markMessagesAsRead:",h),{success:!1};if(!u||u.length!==36)return console.error("❌ Invalid other user UUID in markMessagesAsRead:",u),{success:!1};s=h<u?`${h}_${u}`:`${u}_${h}`}const o=await fetch(`${Ei}/api/messages/mark-read/${encodeURIComponent(s)}`,{method:"PUT",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"}});if(!o.ok)return console.error("❌ Mark read API error:",o.status,o.statusText),{success:!1};const a=await o.json();return console.log("✅ Messages marked as read",a),a}catch(r){return console.error("Error marking messages as read:",r),{success:!1}}},Ot=T.createContext(),ww=()=>{const n=T.useContext(Ot);if(!n)throw new Error("useAuth must be used within AuthProvider");return n},Iw=({children:n})=>{const[e,t]=T.useState(null),[r,s]=T.useState(!0),[o,a]=T.useState(!1),[u,h]=T.useState(!1),[f,y]=T.useState([]),E=async()=>{if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.warn("⏸ refreshNotifications skipped: user UUID not ready");return}const P=await _w(e.uuid);y(Array.isArray(P)?P:[])};T.useEffect(()=>{if(r===!0){console.log("⏸ Skipping notifications fetch – authLoading is true");return}if(!(e!=null&&e.uuid)||e.uuid.length!==36){console.log("⏸ Skipping notifications fetch – user UUID not ready");return}console.log("✅ User ready, fetching notifications:",e.uuid.substring(0,8)+"..."),E();const P=setInterval(E,5e3);return()=>{clearInterval(P)}},[r,e==null?void 0:e.uuid]),T.useEffect(()=>{(async()=>{var S,k,G;try{console.log(`

🔵 [AuthContext] ═══════════════════════════════════════════`),console.log("🔵 [AuthContext] INITIALIZATION STARTED"),console.log("🔵 [AuthContext] ═══════════════════════════════════════════");const H=localStorage.getItem("user");if(H)try{const L=JSON.parse(H);(!L.uuid||typeof L.uuid=="string"&&L.uuid.length!==36)&&(console.warn("🧹 [AuthContext] Removing invalid user from localStorage:",{uuid:L.uuid,id:L.id,email:L.email}),localStorage.removeItem("user"),localStorage.removeItem("token"))}catch{console.warn("🧹 [AuthContext] Invalid JSON in localStorage user, removing"),localStorage.removeItem("user")}const U=localStorage.getItem("token"),B=localStorage.getItem("user");if(console.log("🔵 [AuthContext] STEP 1: Check localStorage"),console.log("🔵 [AuthContext]   - token:",U?"✓ Found":"✗ Not found"),console.log("🔵 [AuthContext]   - user:",B?"✓ Found":"✗ Not found"),U&&B)try{console.log(`
🔵 [AuthContext] STEP 2: Parse localStorage user`);const L=JSON.parse(B);console.log("🔵 [AuthContext]   - Parsed user email:",L.email),console.log("🔵 [AuthContext]   - profileCompleted from localStorage:",L.profileCompleted,"(type:",typeof L.profileCompleted+")"),console.log("🔵 [AuthContext] 🔍 Attempting to restore Google OAuth user from localStorage:",L.email),console.log("🔵 [AuthContext] User data from localStorage:",{id:L.id,email:L.email,profileCompleted:L.profileCompleted,isProfileCompleted:L.isProfileCompleted});const I="https://flinxx-backend.onrender.com";console.log(`
🔵 [AuthContext] STEP 3: Validate token with backend`),console.log("🔵 [AuthContext]   - Backend URL:",I),console.log("🔵 [AuthContext]   - Making request to /api/profile...");const m=await fetch(`${I}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${U}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext]   - Response status:",m.status),m.ok){const g=await m.json();if(console.log("🔵 [AuthContext]   - Response OK, parsing data..."),console.log("🔵 [AuthContext]   - data.success:",g.success),console.log("🔵 [AuthContext]   - data.user available:",!!g.user),g.success&&g.user){console.log("🔵 [AuthContext] ✅ Token validated, user restored from backend"),console.log("🔵 [AuthContext] Backend user data:",{id:g.user.id,email:g.user.email,profileCompleted:g.user.profileCompleted,birthday:g.user.birthday,gender:g.user.gender});const _={uuid:g.user.uuid,name:g.user.name||"User",email:g.user.email,picture:g.user.picture,profileCompleted:g.user.profileCompleted||!1};if(!_.uuid||typeof _.uuid!="string"||_.uuid.length!==36){console.error("❌ INVALID UUID FROM BACKEND:",_.uuid),console.error("   Expected 36-char UUID, got:",((S=_.uuid)==null?void 0:S.length)||"undefined"),s(!1);return}console.log("🔵 [AuthContext] Setting user state with UUID-only:",{uuid:_.uuid.substring(0,8)+"...",email:_.email}),t(_),localStorage.setItem("user",JSON.stringify(_)),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - UUID-only user set");return}else console.log("🔵 [AuthContext] ⚠️  Response OK but data.success or data.user missing")}else{console.log("🔵 [AuthContext] ⚠️ Token validation response not OK:",m.status);const g=await m.text();console.log("🔵 [AuthContext] Error response:",g)}}catch(L){console.error("🔵 [AuthContext] ❌ Error validating token:",L)}else console.log(`
🔵 [AuthContext] STEP 2: Skip token validation (missing token or user)`),console.log("🔵 [AuthContext]   - Skipping /api/profile call");if(B)try{console.log(`
🔵 [AuthContext] STEP 3: Restore from localStorage (no token validation)`),console.log("🔵 [AuthContext] Raw stored user string:",B);const L=JSON.parse(B);if(console.log("🔵 [AuthContext] Parsed user object:",L),console.log("🔵 [AuthContext] User keys:",Object.keys(L)),console.log("🔵 [AuthContext] user.uuid value:",L.uuid),console.log("🔵 [AuthContext] user.uuid type:",typeof L.uuid),console.log("🔵 [AuthContext] user.uuid length:",(k=L.uuid)==null?void 0:k.length),!L.uuid||typeof L.uuid!="string"||L.uuid.length!==36){console.warn("🧹 [AuthContext] Invalid UUID in localStorage, removing:",(G=L.uuid)==null?void 0:G.length),localStorage.removeItem("user"),localStorage.removeItem("token"),s(!1);return}console.log("🔵 [AuthContext]   - Email:",L.email),console.log("🔵 [AuthContext]   - UUID:",L.uuid.substring(0,8)+"..."),console.log("🔵 [AuthContext] ✅ User loaded from localStorage (UUID valid):",L.email),t(L),a(!0),s(!1),console.log("🔵 [AuthContext] ✅ COMPLETE - Returning from localStorage fallback path");return}catch(L){console.error("[AuthContext] Error parsing saved user:",L)}return console.log(`
🔵 [AuthContext] STEP 3: No stored token or user, checking Firebase...`),sm(Wr,async L=>{var I,m;if(console.log(`
🔵 [AuthContext] Firebase onAuthStateChanged fired`),console.log("🔵 [AuthContext]   - firebaseUser:",L?L.email:"null"),L){const g=((I=L.providerData[0])==null?void 0:I.providerId)||"unknown";console.log("🔵 [AuthContext] User authenticated via Firebase"),console.log("🔵 [AuthContext]   - Email:",L.email),console.log("🔵 [AuthContext]   - Provider:",g);try{console.log("🔵 [AuthContext] Getting Firebase ID token...");const w=await L.getIdToken();console.log("🔵 [AuthContext] ✓ ID token obtained"),localStorage.setItem("idToken",w),console.log("🔐 Firebase ID token stored for Socket.IO");const b="https://flinxx-backend.onrender.com";console.log("🔵 [AuthContext] Calling /api/profile with ID token...");const v=await fetch(`${b}/api/profile`,{method:"GET",headers:{Authorization:`Bearer ${w}`,"Content-Type":"application/json"}});if(console.log("🔵 [AuthContext] /api/profile response status:",v.status),v.ok){const Z=await v.json();if(console.log("🔵 [AuthContext] /api/profile response OK"),console.log("🔵 [AuthContext]   - success:",Z.success),console.log("🔵 [AuthContext]   - user.profileCompleted:",(m=Z.user)==null?void 0:m.profileCompleted),Z.success&&Z.user){console.log("🔵 [AuthContext] ✅ Fetched full user profile from database:",{email:Z.user.email,profileCompleted:Z.user.profileCompleted}),console.log("🔵 [AuthContext] Setting user state with profileCompleted:",Z.user.profileCompleted);const _e={...Z.user,publicId:Z.user.public_id||Z.user.publicId,uuid:Z.user.uuid};_e.uuid||console.error("❌ UUID missing from backend user object"),t(_e),a(!0),s(!1);return}}else console.log("🔵 [AuthContext] ⚠️ /api/profile response not OK:",v.status)}catch(w){console.warn("[AuthContext] ⚠️ Failed to fetch profile from database:",w)}const _={uid:L.uid,email:L.email,displayName:L.displayName,photoURL:L.photoURL,publicId:L.uid,authProvider:g,profileCompleted:!1};console.log("[AuthContext] Using fallback userInfo (database fetch failed):",_.email),console.log("[AuthContext] ⚠️ WARNING: profileCompleted not loaded from database, defaulting to false"),t(_),a(!0),localStorage.setItem("userInfo",JSON.stringify(_)),localStorage.setItem("authProvider",g)}else{console.log("🔵 [AuthContext] Firebase user is null/logged out");const g=localStorage.getItem("authToken"),_=localStorage.getItem("authProvider");if(console.log("🔵 [AuthContext]   - authToken:",g?"Found":"Not found"),console.log("🔵 [AuthContext]   - authProvider:",_),g&&_==="guest"){const w=JSON.parse(localStorage.getItem("userInfo")||"{}");!w.publicId&&w.public_id&&(w.publicId=w.public_id),console.log("🔵 [AuthContext] Restoring guest login"),t(w),a(!0)}else console.log("🔵 [AuthContext] ❌ No authentication found, user will be redirected to login"),t(null),a(!1)}console.log("🔵 [AuthContext] ═══════════════════════════════════════════"),console.log("🔵 [AuthContext] INITIALIZATION COMPLETE - Setting isLoading=false"),console.log(`🔵 [AuthContext] ═══════════════════════════════════════════
`),s(!1)})}catch(H){console.error("[AuthContext] Error initializing auth:",H),s(!1)}})()},[]);const x=()=>{t(null),a(!1),localStorage.removeItem("authToken"),localStorage.removeItem("userInfo"),localStorage.removeItem("authProvider"),localStorage.removeItem("token"),localStorage.removeItem("user")},C=(P,S)=>{var G,H;console.log("[AuthContext] ⚠️ setAuthToken called with userData:",{email:S==null?void 0:S.email,has_uuid:!!(S!=null&&S.uuid),uuid:S==null?void 0:S.uuid,uuid_length:(G=S==null?void 0:S.uuid)==null?void 0:G.length,all_keys:Object.keys(S||{})});const k={uuid:S==null?void 0:S.uuid,name:(S==null?void 0:S.name)||"User",email:S==null?void 0:S.email,picture:S==null?void 0:S.picture,profileCompleted:(S==null?void 0:S.profileCompleted)||!1};if(!k.uuid||typeof k.uuid!="string"||k.uuid.length!==36){console.error("❌ Invalid or missing UUID in setAuthToken:",{uuid_received:S==null?void 0:S.uuid,uuid_type:typeof(S==null?void 0:S.uuid),uuid_length:(H=S==null?void 0:S.uuid)==null?void 0:H.length});return}console.log("[AuthContext] ✅ setAuthToken storing user with UUID:",k.uuid.substring(0,8)+"..."),localStorage.setItem("token",P),localStorage.setItem("user",JSON.stringify(k)),localStorage.setItem("authProvider","google"),t(k),a(!0)};return l.jsx(Ot.Provider,{value:{user:e,isAuthenticated:o,isLoading:r,logout:x,authPending:u,setAuthPending:h,setAuthToken:C,notifications:f,refreshNotifications:E},children:n})},ha=T.createContext(),Ew=({children:n})=>{const[e,t]=T.useState({}),r=u=>{t(h=>({...h,[u]:!0}))},s=u=>{t(h=>{const f={...h};return delete f[u],f})},o=Object.keys(e).length,a={unreadMessages:e,setUnreadMessages:t,markAsUnread:r,markAsRead:s,unreadCount:o};return l.jsx(ha.Provider,{value:a,children:n})},jt=Object.create(null);jt.open="0";jt.close="1";jt.ping="2";jt.pong="3";jt.message="4";jt.upgrade="5";jt.noop="6";const Ds=Object.create(null);Object.keys(jt).forEach(n=>{Ds[jt[n]]=n});const Io={type:"error",data:"parser error"},Bh=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",$h=typeof ArrayBuffer=="function",Gh=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,da=({type:n,data:e},t,r)=>Bh&&e instanceof Blob?t?r(e):hc(e,r):$h&&(e instanceof ArrayBuffer||Gh(e))?t?r(e):hc(new Blob([e]),r):r(jt[n]+(e||"")),hc=(n,e)=>{const t=new FileReader;return t.onload=function(){const r=t.result.split(",")[1];e("b"+(r||""))},t.readAsDataURL(n)};function dc(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let Yi;function bw(n,e){if(Bh&&n.data instanceof Blob)return n.data.arrayBuffer().then(dc).then(e);if($h&&(n.data instanceof ArrayBuffer||Gh(n.data)))return e(dc(n.data));da(n,!1,t=>{Yi||(Yi=new TextEncoder),e(Yi.encode(t))})}const fc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Cr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<fc.length;n++)Cr[fc.charCodeAt(n)]=n;const xw=n=>{let e=n.length*.75,t=n.length,r,s=0,o,a,u,h;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const f=new ArrayBuffer(e),y=new Uint8Array(f);for(r=0;r<t;r+=4)o=Cr[n.charCodeAt(r)],a=Cr[n.charCodeAt(r+1)],u=Cr[n.charCodeAt(r+2)],h=Cr[n.charCodeAt(r+3)],y[s++]=o<<2|a>>4,y[s++]=(a&15)<<4|u>>2,y[s++]=(u&3)<<6|h&63;return f},Tw=typeof ArrayBuffer=="function",fa=(n,e)=>{if(typeof n!="string")return{type:"message",data:Hh(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Aw(n.substring(1),e)}:Ds[t]?n.length>1?{type:Ds[t],data:n.substring(1)}:{type:Ds[t]}:Io},Aw=(n,e)=>{if(Tw){const t=xw(n);return Hh(t,e)}else return{base64:!0,data:n}},Hh=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},Wh="",Cw=(n,e)=>{const t=n.length,r=new Array(t);let s=0;n.forEach((o,a)=>{da(o,!1,u=>{r[a]=u,++s===t&&e(r.join(Wh))})})},Sw=(n,e)=>{const t=n.split(Wh),r=[];for(let s=0;s<t.length;s++){const o=fa(t[s],e);if(r.push(o),o.type==="error")break}return r};function Rw(){return new TransformStream({transform(n,e){bw(n,t=>{const r=t.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const o=new DataView(s.buffer);o.setUint8(0,126),o.setUint16(1,r)}else{s=new Uint8Array(9);const o=new DataView(s.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(r))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let Xi;function As(n){return n.reduce((e,t)=>e+t.length,0)}function Cs(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)t[s]=n[0][r++],r===n[0].length&&(n.shift(),r=0);return n.length&&r<n[0].length&&(n[0]=n[0].slice(r)),t}function Nw(n,e){Xi||(Xi=new TextDecoder);const t=[];let r=0,s=-1,o=!1;return new TransformStream({transform(a,u){for(t.push(a);;){if(r===0){if(As(t)<1)break;const h=Cs(t,1);o=(h[0]&128)===128,s=h[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(As(t)<2)break;const h=Cs(t,2);s=new DataView(h.buffer,h.byteOffset,h.length).getUint16(0),r=3}else if(r===2){if(As(t)<8)break;const h=Cs(t,8),f=new DataView(h.buffer,h.byteOffset,h.length),y=f.getUint32(0);if(y>Math.pow(2,21)-1){u.enqueue(Io);break}s=y*Math.pow(2,32)+f.getUint32(4),r=3}else{if(As(t)<s)break;const h=Cs(t,s);u.enqueue(fa(o?h:Xi.decode(h),e)),r=0}if(s===0||s>n){u.enqueue(Io);break}}}})}const qh=4;function Re(n){if(n)return kw(n)}function kw(n){for(var e in Re.prototype)n[e]=Re.prototype[e];return n}Re.prototype.on=Re.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};Re.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};Re.prototype.off=Re.prototype.removeListener=Re.prototype.removeAllListeners=Re.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var r,s=0;s<t.length;s++)if(r=t[s],r===e||r.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};Re.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(t){t=t.slice(0);for(var r=0,s=t.length;r<s;++r)t[r].apply(this,e)}return this};Re.prototype.emitReserved=Re.prototype.emit;Re.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};Re.prototype.hasListeners=function(n){return!!this.listeners(n).length};const bi=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),ht=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Pw="arraybuffer";function zh(n,...e){return e.reduce((t,r)=>(n.hasOwnProperty(r)&&(t[r]=n[r]),t),{})}const jw=ht.setTimeout,Ow=ht.clearTimeout;function xi(n,e){e.useNativeTimers?(n.setTimeoutFn=jw.bind(ht),n.clearTimeoutFn=Ow.bind(ht)):(n.setTimeoutFn=ht.setTimeout.bind(ht),n.clearTimeoutFn=ht.clearTimeout.bind(ht))}const Dw=1.33;function Lw(n){return typeof n=="string"?Mw(n):Math.ceil((n.byteLength||n.size)*Dw)}function Mw(n){let e=0,t=0;for(let r=0,s=n.length;r<s;r++)e=n.charCodeAt(r),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(r++,t+=4);return t}function Kh(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Fw(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Vw(n){let e={},t=n.split("&");for(let r=0,s=t.length;r<s;r++){let o=t[r].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class Uw extends Error{constructor(e,t,r){super(e),this.description=t,this.context=r,this.type="TransportError"}}class pa extends Re{constructor(e){super(),this.writable=!1,xi(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,r){return super.emitReserved("error",new Uw(e,t,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=fa(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&+(this.opts.port!==443)||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Fw(e);return t.length?"?"+t:""}}class Bw extends pa{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||t()})),this.writable||(r++,this.once("drain",function(){--r||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Sw(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Cw(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Kh()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let Jh=!1;try{Jh=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const $w=Jh;function Gw(){}class Hw extends Bw{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let r=location.port;r||(r=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,t){const r=this.request({method:"POST",data:e});r.on("success",t),r.on("error",(s,o)=>{this.onError("xhr post error",s,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,r)=>{this.onError("xhr poll error",t,r)}),this.pollXhr=e}}let zn=class Ls extends Re{constructor(e,t,r){super(),this.createRequest=e,xi(this,r),this._opts=r,this._method=r.method||"GET",this._uri=t,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const t=zh(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(t);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ls.requestsCount++,Ls.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Gw,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ls.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};zn.requestsCount=0;zn.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",pc);else if(typeof addEventListener=="function"){const n="onpagehide"in ht?"pagehide":"unload";addEventListener(n,pc,!1)}}function pc(){for(let n in zn.requests)zn.requests.hasOwnProperty(n)&&zn.requests[n].abort()}const Ww=function(){const n=Qh({xdomain:!1});return n&&n.responseType!==null}();class qw extends Hw{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Ww&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new zn(Qh,this.uri(),e)}}function Qh(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||$w))return new XMLHttpRequest}catch{}if(!e)try{return new ht[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Yh=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class zw extends pa{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,r=Yh?{}:zh(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;da(r,this.supportsBinary,o=>{try{this.doWrite(r,o)}catch{}s&&bi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Kh()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Zi=ht.WebSocket||ht.MozWebSocket;class Kw extends zw{createSocket(e,t,r){return Yh?new Zi(e,t,r):t?new Zi(e,t):new Zi(e)}doWrite(e,t){this.ws.send(t)}}class Jw extends pa{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Nw(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(t).getReader(),s=Rw();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const o=()=>{r.read().then(({done:u,value:h})=>{u||(this.onPacket(h),o())}).catch(u=>{})};o();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],s=t===e.length-1;this._writer.write(r).then(()=>{s&&bi(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Qw={websocket:Kw,webtransport:Jw,polling:qw},Yw=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Xw=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Eo(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),r=n.indexOf("]");t!=-1&&r!=-1&&(n=n.substring(0,t)+n.substring(t,r).replace(/:/g,";")+n.substring(r,n.length));let s=Yw.exec(n||""),o={},a=14;for(;a--;)o[Xw[a]]=s[a]||"";return t!=-1&&r!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=Zw(o,o.path),o.queryKey=eI(o,o.query),o}function Zw(n,e){const t=/\/{2,9}/g,r=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function eI(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,o){s&&(t[s]=o)}),t}const bo=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ms=[];bo&&addEventListener("offline",()=>{Ms.forEach(n=>n())},!1);class un extends Re{constructor(e,t){if(super(),this.binaryType=Pw,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const r=Eo(e);t.hostname=r.host,t.secure=r.protocol==="https"||r.protocol==="wss",t.port=r.port,r.query&&(t.query=r.query)}else t.host&&(t.hostname=Eo(t.host).host);xi(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Vw(this.opts.query)),bo&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ms.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=qh,t.transport=e,this.id&&(t.sid=this.id);const r=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&un.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",un.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(t+=Lw(s)),r>0&&t>this._maxPayload)return this.writeBuffer.slice(0,r);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,bi(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,r){return this._sendPacket("message",e,t,r),this}send(e,t,r){return this._sendPacket("message",e,t,r),this}_sendPacket(e,t,r,s){if(typeof t=="function"&&(s=t,t=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const o={type:e,data:t,options:r};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},r=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(un.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),bo&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Ms.indexOf(this._offlineEventListener);r!==-1&&Ms.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}un.protocol=qh;class tI extends un{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),r=!1;un.priorWebsocketSuccess=!1;const s=()=>{r||(t.send([{type:"ping",data:"probe"}]),t.once("packet",E=>{if(!r)if(E.type==="pong"&&E.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;un.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(y(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const x=new Error("probe error");x.transport=t.name,this.emitReserved("upgradeError",x)}}))};function o(){r||(r=!0,y(),t.close(),t=null)}const a=E=>{const x=new Error("probe error: "+E);x.transport=t.name,o(),this.emitReserved("upgradeError",x)};function u(){a("transport closed")}function h(){a("socket closed")}function f(E){t&&E.name!==t.name&&o()}const y=()=>{t.removeListener("open",s),t.removeListener("error",a),t.removeListener("close",u),this.off("close",h),this.off("upgrading",f)};t.once("open",s),t.once("error",a),t.once("close",u),this.once("close",h),this.once("upgrading",f),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&t.push(e[r]);return t}}let nI=class extends tI{constructor(e,t={}){const r=typeof e=="object"?e:t;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Qw[s]).filter(s=>!!s)),super(e,r)}};function rI(n,e="",t){let r=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),r=Eo(n)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const o=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+o+":"+r.port+e,r.href=r.protocol+"://"+o+(t&&t.port===r.port?"":":"+r.port),r}const sI=typeof ArrayBuffer=="function",iI=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Xh=Object.prototype.toString,oI=typeof Blob=="function"||typeof Blob<"u"&&Xh.call(Blob)==="[object BlobConstructor]",aI=typeof File=="function"||typeof File<"u"&&Xh.call(File)==="[object FileConstructor]";function ma(n){return sI&&(n instanceof ArrayBuffer||iI(n))||oI&&n instanceof Blob||aI&&n instanceof File}function Fs(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,r=n.length;t<r;t++)if(Fs(n[t]))return!0;return!1}if(ma(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Fs(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Fs(n[t]))return!0;return!1}function lI(n){const e=[],t=n.data,r=n;return r.data=xo(t,e),r.attachments=e.length,{packet:r,buffers:e}}function xo(n,e){if(!n)return n;if(ma(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let r=0;r<n.length;r++)t[r]=xo(n[r],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=xo(n[r],e));return t}return n}function cI(n,e){return n.data=To(n.data,e),delete n.attachments,n}function To(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=To(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=To(n[t],e));return n}const uI=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],hI=5;var se;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(se||(se={}));class dI{constructor(e){this.replacer=e}encode(e){return(e.type===se.EVENT||e.type===se.ACK)&&Fs(e)?this.encodeAsBinary({type:e.type===se.EVENT?se.BINARY_EVENT:se.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===se.BINARY_EVENT||e.type===se.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=lI(e),r=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(r),s}}function mc(n){return Object.prototype.toString.call(n)==="[object Object]"}class ga extends Re{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const r=t.type===se.BINARY_EVENT;r||t.type===se.BINARY_ACK?(t.type=r?se.EVENT:se.ACK,this.reconstructor=new fI(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(ma(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const r={type:Number(e.charAt(0))};if(se[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===se.BINARY_EVENT||r.type===se.BINARY_ACK){const o=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(o,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");r.attachments=Number(a)}if(e.charAt(t+1)==="/"){const o=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););r.nsp=e.substring(o,t)}else r.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const o=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}r.id=Number(e.substring(o,t+1))}if(e.charAt(++t)){const o=this.tryParse(e.substr(t));if(ga.isPayloadValid(r.type,o))r.data=o;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case se.CONNECT:return mc(t);case se.DISCONNECT:return t===void 0;case se.CONNECT_ERROR:return typeof t=="string"||mc(t);case se.EVENT:case se.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&uI.indexOf(t[0])===-1);case se.ACK:case se.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class fI{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=cI(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const pI=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ga,Encoder:dI,get PacketType(){return se},protocol:hI},Symbol.toStringTag,{value:"Module"}));function vt(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const mI=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Zh extends Re{constructor(e,t,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[vt(e,"open",this.onopen.bind(this)),vt(e,"packet",this.onpacket.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var r,s,o;if(mI.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:se.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const y=this.ids++,E=t.pop();this._registerAckCallback(y,E),a.id=y}const u=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,h=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!u||(h?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let u=0;u<this.sendBuffer.length;u++)this.sendBuffer[u].id===e&&this.sendBuffer.splice(u,1);t.call(this,new Error("operation has timed out"))},s),a=(...u)=>{this.io.clearTimeoutFn(o),t.apply(this,u)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((r,s)=>{const o=(a,u)=>a?s(a):r(u);o.withError=!0,t.push(o),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...o)=>r!==this._queue[0]?void 0:(s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...o)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:se.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case se.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case se.EVENT:case se.BINARY_EVENT:this.onevent(e);break;case se.ACK:case se.BINARY_ACK:this.onack(e);break;case se.DISCONNECT:this.ondisconnect();break;case se.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const r of t)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let r=!1;return function(...s){r||(r=!0,t.packet({type:se.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:se.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const r of t)r.apply(this,e.data)}}}function or(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}or.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};or.prototype.reset=function(){this.attempts=0};or.prototype.setMin=function(n){this.ms=n};or.prototype.setMax=function(n){this.max=n};or.prototype.setJitter=function(n){this.jitter=n};class Ao extends Re{constructor(e,t){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,xi(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((r=t.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new or({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||pI;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new nI(this.uri,this.opts);const t=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=vt(t,"open",function(){r.onopen(),e&&e()}),o=u=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",u),e?e(u):this.maybeReconnectOnOpen()},a=vt(t,"error",o);if(this._timeout!==!1){const u=this._timeout,h=this.setTimeoutFn(()=>{s(),o(new Error("timeout")),t.close()},u);this.opts.autoUnref&&h.unref(),this.subs.push(()=>{this.clearTimeoutFn(h)})}return this.subs.push(s),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(vt(e,"ping",this.onping.bind(this)),vt(e,"data",this.ondata.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this)),vt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){bi(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Zh(this,e,t),this.nsps[e]=r),r}_destroy(e){const t=Object.keys(this.nsps);for(const r of t)if(this.nsps[r].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let r=0;r<t.length;r++)this.engine.write(t[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Tr={};function Vs(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=rI(n,e.path||"/socket.io"),r=t.source,s=t.id,o=t.path,a=Tr[s]&&o in Tr[s].nsps,u=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let h;return u?h=new Ao(r,e):(Tr[s]||(Tr[s]=new Ao(r,e)),h=Tr[s]),t.query&&!e.query&&(e.query=t.queryKey),h.socket(t.path,e)}Object.assign(Vs,{Manager:Ao,Socket:Zh,io:Vs,connect:Vs});const ed="https://flinxx-backend.onrender.com";console.log("🔌 Socket.IO connecting to:",ed);const K=Vs(ed,{reconnection:!0,reconnectionDelay:1e3,reconnectionDelayMax:5e3,reconnectionAttempts:10,transports:["websocket","polling"],secure:!1,rejectUnauthorized:!1,forceNew:!1,withCredentials:!0,upgrade:!0,rememberUpgrade:!1,multiplex:!0,timeout:6e4,extraHeaders:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"true"}});K.on("connect",()=>{console.log("✅ Socket connected successfully! ID:",K.id),console.log("📊 Transport method:",K.io.engine.transport.name)});K.on("connect_error",n=>{console.error("❌ Socket connection error:",n.message||n),console.error("📍 Error details:",n),K.io.engine.transport.name==="polling"&&console.log("🔄 Retrying with websocket...")});K.on("error",n=>{console.error("❌ Socket error:",n)});K.on("disconnect",n=>{console.log("⚠️ Socket disconnected. Reason:",n),console.log("🔄 Attempting to reconnect...")});K.on("connect_timeout",()=>{console.error("⏱️ Socket connection timeout")});const td=T.createContext(),gI=({children:n})=>{const{user:e,isLoading:t}=ww(),[r,s]=T.useState(0);T.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;let a=!1;const u=async()=>{var y;console.log("📊 UnreadContext: Calling getUnreadCount with UUID:",((y=e.uuid)==null?void 0:y.substring(0,8))+"...");const f=await Qi(e.uuid);if(!a){const E=typeof f=="number"?f:(f==null?void 0:f.unreadCount)||0;s(E)}};u();const h=setInterval(u,5e3);return()=>{a=!0,clearInterval(h)}},[t,e==null?void 0:e.uuid]),T.useEffect(()=>{if(t===!0||!e||!(e!=null&&e.uuid)||e.uuid.length!==36)return;const a=async()=>{var f;console.log("📬 New message received, fetching updated count for UUID:",((f=e.uuid)==null?void 0:f.substring(0,8))+"...");const u=await Qi(e.uuid),h=typeof u=="number"?u:(u==null?void 0:u.unreadCount)||0;s(h)};return K.on("receive_message",a),()=>{K.off("receive_message",a)}},[t,e==null?void 0:e.uuid]);const o=async()=>{if(!(e!=null&&e.uuid)||typeof e.uuid!="string"||e.uuid.length!==36)return;const a=await Qi(e.uuid),u=typeof a=="number"?a:(a==null?void 0:a.unreadCount)||0;s(u)};return l.jsx(td.Provider,{value:{unreadCount:r,setUnreadCount:s,refetchUnreadCount:o},children:n})},ya=()=>{const n=T.useContext(td);if(!n)throw new Error("useUnread must be used within UnreadProvider");return n};class yI extends Kn.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error("Error caught by boundary:",e,t)}render(){var e;return this.state.hasError?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-4xl font-bold text-red-500 mb-4",children:"Something went wrong"}),l.jsx("p",{className:"text-gray-300 mb-8",children:(e=this.state.error)==null?void 0:e.message}),l.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white",children:"Reload Page"})]})}):this.props.children}}const vI="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjcyIiB2aWV3Qm94PSIwIDAgMjgwIDcyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8IS0tIFB1cnBsZSBSb3VuZGVkLVNxdWFyZSBJY29uIChleGFjdCBmcm9tIGJyYW5kaW5nKSAtLT4NCiAgPGc+DQogICAgPCEtLSBHcmFkaWVudCBkZWZpbml0aW9ucyAtLT4NCiAgICA8ZGVmcz4NCiAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icHVycGxlR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOUQ0RUREO3N0b3Atb3BhY2l0eToxIiAvPg0KICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3MjA5Qjc7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Imdsb3dHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjAuOCIgLz4NCiAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNTAwO3N0b3Atb3BhY2l0eTowLjQiIC8+DQogICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgDQogICAgICA8ZmlsdGVyIGlkPSJwcmVtaXVtU2hhZG93Ij4NCiAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9IjQiIHN0ZERldmlhdGlvbj0iNiIgZmxvb2Qtb3BhY2l0eT0iMC4zNSIvPg0KICAgICAgPC9maWx0ZXI+DQogICAgPC9kZWZzPg0KICAgIA0KICAgIDwhLS0gR29sZGVuIGdsb3cvaGFsbyBiZWhpbmQgaWNvbiAtLT4NCiAgICA8Y2lyY2xlIGN4PSIzNiIgY3k9IjM2IiByPSIzNCIgZmlsbD0idXJsKCNnbG93R3JhZGllbnQpIiBvcGFjaXR5PSIwLjUiLz4NCiAgICANCiAgICA8IS0tIE1haW4gcHVycGxlIHJvdW5kZWQtc3F1YXJlIGJhY2tncm91bmQgLS0+DQogICAgPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iMTYiIGZpbGw9InVybCgjcHVycGxlR3JhZGllbnQpIiBmaWx0ZXI9InVybCgjcHJlbWl1bVNoYWRvdykiLz4NCiAgICANCiAgICA8IS0tIENhbWVyYSBib2R5ICh3aGl0ZSBvdXRsaW5lIHN0eWxlKSAtLT4NCiAgICA8cmVjdCB4PSIxNiIgeT0iMjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgcng9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41Ii8+DQogICAgDQogICAgPCEtLSBDYW1lcmEgbGVucyAoY2lyY3VsYXIpIC0tPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPg0KICAgIDxjaXJjbGUgY3g9IjQ0IiBjeT0iMzEiIHI9IjMuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNSIvPg0KICAgIA0KICAgIDwhLS0gTGlnaHRuaW5nIGJvbHQgYWNjZW50ICh0b3AgcmlnaHQpIC0tPg0KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2LCAxMCkiPg0KICAgICAgPCEtLSBNYWluIGxpZ2h0bmluZyBzaGFwZSAtLT4NCiAgICAgIDxwYXRoIGQ9Ik0gNiAwIEwgMiA2IEwgNiA2IEwgMCAxNCBMIDggOCBMIDQgOCBaIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiNGRjhBMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQogICAgICA8IS0tIElubmVyIGhpZ2hsaWdodCBmb3IgZGVwdGggLS0+DQogICAgICA8cGF0aCBkPSJNIDQgMSBMIDMgNCBMIDUgNCBMIDEgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRUIzQiIgc3Ryb2tlLXdpZHRoPSIwLjgiIG9wYWNpdHk9IjAuNyIvPg0KICAgIDwvZz4NCiAgICANCiAgICA8IS0tIEdvbGRlbiBzcGFya2xlIGFjY2VudHMgLS0+DQogICAgPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMS41IiBmaWxsPSIjRkZENzAwIiBvcGFjaXR5PSIwLjkiLz4NCiAgICA8Y2lyY2xlIGN4PSI1OCIgY3k9IjE4IiByPSIxLjUiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOCIvPg0KICAgIDxjaXJjbGUgY3g9IjE2IiBjeT0iNTYiIHI9IjEiIGZpbGw9IiNGRkIzMUEiIG9wYWNpdHk9IjAuNyIvPg0KICA8L2c+DQogIA0KICA8IS0tIEZMSU5YWCBUZXh0IC0tPg0KICA8dGV4dCB4PSI4MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0idXJsKCN0ZXh0R3JhZGllbnQpIiBsZXR0ZXItc3BhY2luZz0iMSI+DQogICAgRkxJTlhYDQogIDwvdGV4dD4NCiAgDQogIDwhLS0gVGV4dCBHcmFkaWVudCAtLT4NCiAgPGRlZnM+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJ0ZXh0R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4NCiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQjMxQTtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOEEwMDtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQo8L3N2Zz4NCg==",_I=()=>{const n=ft(),[e,t]=T.useState(!1),r=()=>{t(!0),setTimeout(()=>{n("/login",{replace:!0})},500)};return l.jsxs("div",{className:"homepage-wrapper",children:[l.jsx("header",{className:"homepage-header",children:l.jsxs("div",{className:"header-content",children:[l.jsxs("div",{className:"header-left",children:[l.jsx("img",{src:vI,alt:"Flinxx",className:"logo"}),l.jsx("span",{className:"online-status",children:"🟢 3,247 online"})]}),l.jsx("button",{onClick:r,className:"btn-start-now",children:"Start Now"})]})}),l.jsx("section",{className:"hero-section",children:l.jsxs("div",{className:"hero-content",children:[l.jsxs("h1",{className:"hero-title",children:["Meet New People",l.jsx("br",{}),"Around the World"]}),l.jsx("p",{className:"hero-subtitle",children:"Connect instantly with strangers through video chat"}),l.jsx("button",{onClick:r,disabled:e,className:"btn-hero-cta",children:e?"⟳ Loading...":"Start Video Chat"}),l.jsx("p",{className:"hero-tagline",children:"Fast, simple video chats • Real users, real time"})]})}),l.jsx("section",{className:"features-section",children:l.jsx("div",{className:"features-container",children:l.jsx("div",{className:"feature-card",children:l.jsxs("div",{className:"card-content",children:[l.jsx("div",{className:"card-icon",children:"⚡"}),l.jsxs("div",{className:"card-text",children:[l.jsx("h3",{className:"card-title",children:"Instant Connection"}),l.jsx("p",{className:"card-description",children:"Connect with random strangers in seconds. No waiting, no hassle."})]})]})})})}),l.jsxs("button",{onClick:()=>window.location.href="/contact",className:"btn-contact-us",children:[l.jsx("span",{children:"💬"}),"Contact Us"]})]})};class wI extends Error{}wI.prototype.name="InvalidTokenError";const Ti="data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3c!--%20Orange%20gradient%20background%20--%3e%3crect%20width='40'%20height='40'%20rx='8'%20fill='url(%23gradient)'%20/%3e%3c!--%20Video%20camera%20icon%20--%3e%3cg%20transform='translate(8,%208)'%3e%3c!--%20Camera%20body%20--%3e%3crect%20x='1'%20y='6'%20width='16'%20height='12'%20rx='1'%20fill='white'%20stroke='white'%20stroke-width='0.5'/%3e%3c!--%20Camera%20lens%20--%3e%3ccircle%20cx='17'%20cy='12'%20r='4'%20fill='none'%20stroke='white'%20stroke-width='1'/%3e%3ccircle%20cx='17'%20cy='12'%20r='2.5'%20fill='white'%20opacity='0.8'/%3e%3c!--%20Recording%20indicator%20dot%20--%3e%3ccircle%20cx='3'%20cy='3'%20r='1.5'%20fill='%23FF4444'/%3e%3c/g%3e%3c!--%20Gradient%20definition%20--%3e%3cdefs%3e%3clinearGradient%20id='gradient'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20style='stop-color:%23FF8C42;stop-opacity:1'%20/%3e%3cstop%20offset='100%25'%20style='stop-color:%23FF6B35;stop-opacity:1'%20/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",II="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20width='24'%20height='24'%3e%3cpath%20fill='%234285F4'%20d='M22.56%2012.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26%201.37-1.04%202.53-2.21%203.31v2.77h3.57c2.08-1.92%203.28-4.74%203.28-8.09z'/%3e%3cpath%20fill='%2334A853'%20d='M12%2023c2.97%200%205.46-.98%207.28-2.66l-3.57-2.77c-.98.66-2.23%201.06-3.71%201.06-2.86%200-5.29-1.93-6.16-4.53H2.18v2.84C3.99%2020.53%207.7%2023%2012%2023z'/%3e%3cpath%20fill='%23FBBC05'%20d='M5.84%2014.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43%208.55%201%2010.22%201%2012s.43%203.45%201.18%204.93l2.85-2.22.81-.62z'/%3e%3cpath%20fill='%23EA4335'%20d='M12%205.38c1.62%200%203.06.56%204.21%201.64l3.15-3.15C17.45%202.09%2014.97%201%2012%201%207.7%201%203.99%203.47%202.18%207.07l3.66%202.84c.87-2.6%203.3-4.53%206.16-4.53z'/%3e%3c/svg%3e",nd=({onContinue:n,onCancel:e})=>{T.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow="unset"}),[]),T.useEffect(()=>{const r=s=>{s.key==="Escape"&&s.preventDefault()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[]),T.useEffect(()=>{window.history.pushState(null,"",window.location.href);const r=s=>{s.preventDefault(),window.history.pushState(null,"",window.location.href)};return window.addEventListener("popstate",r),()=>window.removeEventListener("popstate",r)},[]);const t=()=>{localStorage.setItem("termsAccepted","true"),n==null||n()};return l.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",children:l.jsxs("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-6 text-center",children:"Before you continue"}),l.jsxs("p",{className:"text-gray-700 text-center text-sm",children:["By continuing, you confirm that you are 18 years or older and agree to Flinxx's"," ",l.jsx("a",{href:"/terms-and-conditions",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/terms-and-conditions"},children:"Terms & Conditions"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-blue-600 underline",onClick:r=>{r.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"}),"."]}),l.jsx("p",{className:"text-gray-700 text-center text-sm mt-4",children:"You understand that Flinxx is a live interaction platform and you use it at your own responsibility."}),l.jsxs("div",{className:"flex gap-4 mt-6",children:[l.jsx("button",{onClick:e,className:"flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors",children:"Decline"}),l.jsx("button",{onClick:t,className:"flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors",children:"Accept & Proceed"})]})]})})},rd=()=>{try{return localStorage.getItem("termsAccepted")==="true"}catch(n){return console.error("❌ Error checking terms acceptance:",n),!1}},EI=()=>{try{localStorage.setItem("termsAccepted","true"),console.log("✅ Terms accepted and saved to localStorage")}catch(n){console.error("❌ Error saving terms acceptance:",n)}},bI=({isSigningIn:n,onShowTermsModal:e})=>{const t=()=>{console.log("🔐 Google login clicked - checking terms acceptance"),rd()?(console.log("✅ Terms already accepted - proceeding with Google login"),r()):(console.log("⚠️ Terms not accepted - showing modal first"),e("google"))},r=()=>{const s="https://flinxx-backend.onrender.com";console.log("🔗 Redirecting to Google OAuth:",`${s}/auth/google`),window.location.href=`${s}/auth/google`};return l.jsxs("button",{onClick:t,disabled:n,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${n?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-white hover:bg-gray-50 text-black shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("img",{src:II,alt:"Google",className:"w-6 h-6"}),"Continue with Google"]})},xI=()=>{const n=ft(),[e,t]=T.useState(!1),[r,s]=T.useState(null),[o,a]=T.useState(!1),[u,h]=T.useState(null);T.useEffect(()=>{(async()=>{try{const P=await vw();P&&(console.log("✅ Login successful:",P.email),n("/chat"))}catch(P){console.error("❌ Login check failed:",P)}})()},[n]);const f=C=>{console.log(`📋 Showing Terms modal for ${C}`),h(C),a(!0)},y=()=>{console.log("❌ User cancelled terms modal"),a(!1),h(null)},E=async()=>{if(console.log("✅ User accepted terms"),EI(),a(!1),u==="google"){console.log("🔐 Proceeding with Google login after terms acceptance");const C="https://flinxx-backend.onrender.com";window.location.href=`${C}/auth/google`}else if(u==="facebook"){console.log("🔐 Proceeding with Facebook login after terms acceptance");try{await uc()}catch(C){console.error("❌ Facebook login error:",C),s("Facebook login failed. Please try again.")}}h(null)},x=async()=>{if(console.log("🔐 Facebook login clicked - checking terms acceptance"),rd()){console.log("✅ Terms already accepted - proceeding with Facebook login"),t(!0),s(null);try{console.log("📱 Starting Facebook login..."),console.log("Facebook App ID:","863917229498555"),console.log("Redirect URL:","https://flinx-8a05e.firebaseapp.com/__/auth/handler"),await uc()}catch(C){console.error("❌ Facebook login error:",C),s("Facebook login failed. Please try again."),t(!1)}}else console.log("⚠️ Terms not accepted - showing modal first"),f("facebook")};return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:[l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center mb-8",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-4",children:"Welcome to Flinxx"}),l.jsx("p",{className:"text-lg text-white/80",children:"Connect with strangers instantly"}),l.jsx("p",{className:"text-sm text-white/70 mt-2",children:"Sign up to get started"})]}),r&&l.jsx("div",{className:"mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg",children:l.jsx("p",{className:"text-red-200 text-sm",children:r})}),l.jsxs("div",{className:"space-y-4",children:[e&&l.jsxs("button",{disabled:!0,className:"w-full bg-gray-400 cursor-not-allowed text-gray-700 font-bold py-3 px-6 rounded-full transition-all text-lg flex items-center justify-center gap-2",children:[l.jsx("span",{className:"animate-spin",children:"⟳"})," Signing in..."]}),l.jsx(bI,{isSigningIn:e,onShowTermsModal:f}),l.jsxs("button",{onClick:x,disabled:e,className:`w-full py-3 px-6 rounded-full transition-all text-lg font-bold flex items-center justify-center gap-3 ${e?"bg-gray-400 text-gray-700 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:[l.jsx("span",{className:"text-xl",children:"f"})," Continue with Facebook"]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsxs("p",{className:"text-xs text-white/60",children:["By signing in, you agree to our"," ",l.jsx("a",{href:"/terms",className:"text-white/80 hover:text-white underline",onClick:C=>{C.preventDefault(),window.location.href="/terms"},children:"TERMS & CONDITIONS"})," ","and"," ",l.jsx("a",{href:"/privacy-policy",className:"text-white/80 hover:text-white underline",onClick:C=>{C.preventDefault(),window.location.href="/privacy-policy"},children:"Privacy Policy"})]})}),l.jsxs("div",{className:"mt-10 flex flex-col items-center gap-3 text-white/80 text-sm",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"⚡"}),l.jsx("p",{children:"Instant connection with strangers"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"👤"}),l.jsx("p",{children:"100% Anonymous & Safe"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🎥"}),l.jsx("p",{children:"High-quality Video Chat"})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{children:"🌍"}),l.jsx("p",{children:"Connect Worldwide"})]})]})]}),o&&l.jsx(nd,{onCancel:y,onContinue:E})]})},sd=T.createContext(),TI=({children:n})=>{const[e,t]=T.useState(!1),[r,s]=T.useState("solo"),o=()=>{t(!0),s("duo")},a=()=>{t(!1),s("solo")},u=h=>{console.log(`🔄 [MODE CHANGE] Switching to ${h} mode`),console.log(`   Current activeMode before: ${r}`),s(h),h==="duo"?(console.log("Opening Duo Squad modal"),t(!0)):h==="solo"&&(console.log("Closing Duo Squad modal"),t(!1)),console.log(`   activeMode will update to: ${h}`)};return l.jsx(sd.Provider,{value:{isDuoSquadOpen:e,setIsDuoSquadOpen:t,activeMode:r,setActiveMode:s,openDuoSquad:o,closeDuoSquad:a,handleModeChange:u},children:n})},id=()=>{const n=T.useContext(sd);if(!n)throw new Error("useDuoSquad must be used within DuoSquadProvider");return n},AI=()=>{console.log(`
🧊 ═══════════════════════════════════════════════════════════════`),console.log("🧊 [ICE SERVERS CONFIGURATION]"),console.log("🧊 ═══════════════════════════════════════════════════════════════"),console.log("🧊 STUN Server:"),console.log("🧊   - stun:global.xirsys.net"),console.log("🧊     Purpose: NAT detection, find public IP"),console.log("🧊     Status: Should work on all networks"),console.log("🧊 "),console.log("🧊 TURN Servers (for relaying if P2P blocked):"),console.log("🧊   - turn:global.xirsys.net:3478?transport=udp"),console.log("🧊     Status: Blocked if ISP blocks UDP port 3478"),console.log("🧊   - turn:global.xirsys.net:3478?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TCP port 3478"),console.log("🧊   - turns:global.xirsys.net:5349?transport=tcp"),console.log("🧊     Status: Blocked if ISP blocks TLS port 5349"),console.log("🧊 "),console.log("🧊 Credentials:"),console.log("🧊   - Username: nkhlydv"),console.log("🧊   - Credential: a8e244b8-cf5b-11f0-8771-0242ac140002"),console.log("🧊 "),console.log("🧊 If all TURN candidates fail with error 701:"),console.log("🧊   ✓ Configuration is CORRECT"),console.log("🧊   ✓ STUN works (can find your IP)"),console.log("🧊   ✗ ISP/Network is blocking TURN ports"),console.log("🧊   → Try VPN or different network to test"),console.log(`🧊 ═══════════════════════════════════════════════════════════════
`)},CI=()=>[{urls:["stun:global.xirsys.net"]},{urls:["turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp","turns:global.xirsys.net:5349?transport=tcp"],username:"nkhlydv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"}],SI=n=>{const e=Math.floor(n/3600),t=Math.floor(n%3600/60),r=n%60;return e>0?`${e}h ${t}m ${r}s`:t>0?`${t}m ${r}s`:`${r}s`},RI=({isOpen:n,onClose:e})=>{const[t,r]=T.useState("flex"),[s,o]=T.useState("lite");if(!n)return null;const a=[{id:"lite",name:"LITE",emoji:"✨",price:"₹69",duration:"1 Day",features:["Unlimited Filters","Gender Filter: 50/day","10 Match Preferences","Ads Enabled","No Boost"]},{id:"prime",name:"PRIME",emoji:"👑",price:"₹199",duration:"15 Days",features:["Unlimited Filters","Gender Filter: 150/day","Full Match Preferences","No Ads","2x Profile Boost","Priority Match Queue"]},{id:"ultra",name:"ULTRA",emoji:"💎",price:"₹399",duration:"30 Days",features:["Unlimited Filters","Unlimited Gender Filter","Full Match Preferences","No Ads","5x Profile Boost","Ultra Priority Queue","Ultra Badge","Double Visibility"]}],u=[{id:"blue-tick",name:"Blue Tick",emoji:"✓",price:"₹69",features:["Verification badge","Trust boost","Status indicator"]},{id:"chat-themes",name:"Chat Themes",emoji:"🎨",price:"₹49",features:["Unlock themes","Custom colors","Personal style"]},{id:"match-boost",name:"Match Boost",emoji:"⚡",price:"₹39",features:["30 min visibility boost","Increased reach","More matches"]},{id:"profile-ring",name:"Profile Ring",emoji:"💍",price:"₹79",features:["Colored profile ring","Stand out","Eye-catching design"]},{id:"profile-highlight",name:"Profile Highlight",emoji:"⭐",price:"₹99",features:["24h highlight","Top search visibility","Premium placement"]}];return a.find(h=>h.id===s),l.jsx("div",{className:"premium-overlay",onClick:e,children:l.jsxs("div",{className:"premium-box",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"close-btn",onClick:e,children:"✖"}),l.jsx("h2",{className:"premium-title",children:"Flinxx Subscriptions"}),l.jsxs("div",{className:"main-tabs-container",children:[!1,l.jsx("button",{className:`main-tab ${t==="flex"?"active":""}`,onClick:()=>r("flex"),children:"Flex Plans"})]}),!1,t==="flex"&&l.jsxs("div",{className:"tab-content",children:[l.jsx("p",{className:"flex-subtitle",children:"Choose individual features"}),l.jsx("div",{className:"flex-section flex-wrapper",children:l.jsx("div",{className:"flex-plans-box",children:l.jsx("div",{className:"flex-plans-container",children:u.map(h=>l.jsxs("div",{className:"flex-card",children:[l.jsxs("div",{className:"flex-item-header",children:[l.jsx("span",{className:"flex-emoji",children:h.emoji}),l.jsx("h4",{children:h.name})]}),l.jsx("div",{className:"flex-item-price",children:h.price}),l.jsx("ul",{className:"flex-item-features",children:h.features.map((f,y)=>l.jsxs("li",{children:[l.jsx("span",{className:"flex-check",children:"•"}),l.jsx("span",{children:f})]},y))}),l.jsx("button",{className:"flex-item-btn",children:"Add Now"})]},h.id))})})})]}),l.jsx("div",{className:"premium-footer",children:l.jsx("p",{children:"Recurring billing. Cancel anytime. No hidden charges."})})]})})},NI=({isOpen:n,onClose:e,currentGender:t="both",onOpenPremium:r})=>{const[s,o]=T.useState(t);if(!n)return null;const a=()=>{console.log("Gender filter saved:",s),e()},u=()=>{console.log("Join clicked - opening premium modal"),r(),e()};return l.jsx("div",{className:"gender-filter-overlay",onClick:e,children:l.jsxs("div",{className:"gender-filter-modal",onClick:h=>h.stopPropagation(),children:[l.jsx("button",{className:"gender-close-btn",onClick:e,children:"✖"}),l.jsxs("div",{className:"gender-premium-section",children:[l.jsx("div",{className:"premium-icon",children:"👑"}),l.jsxs("div",{className:"premium-content",children:[l.jsx("h3",{children:"Flinxx Prime"}),l.jsx("p",{children:"Get More Gender Filters"})]}),l.jsx("button",{className:"join-btn",onClick:u,children:"Join"})]}),l.jsxs("div",{className:"gender-section",children:[l.jsx("div",{className:"gender-icon",children:"👥"}),l.jsx("h2",{children:"Gender"}),l.jsxs("div",{className:"gender-options",children:[l.jsxs("button",{className:`gender-option ${s==="girls"?"selected":""}`,onClick:()=>o("girls"),children:[l.jsx("div",{className:"gender-emoji",children:"👧"}),l.jsx("div",{className:"gender-label",children:"Girls Only"})]}),l.jsxs("button",{className:`gender-option ${s==="guys"?"selected":""}`,onClick:()=>o("guys"),children:[l.jsx("div",{className:"gender-emoji",children:"👦"}),l.jsx("div",{className:"gender-label",children:"Guys Only"})]}),!1]})]}),l.jsxs("div",{className:"gender-footer",children:[l.jsx("button",{className:"save-btn",onClick:a,children:"Save"}),l.jsx("button",{className:"filter-btn",children:"🔽"})]})]})})},kI=({isOpen:n,onClose:e,onOpenPremium:t,onReinitializeCamera:r})=>{const s=ft(),{user:o}=T.useContext(Ot)||{},[a,u]=T.useState(!1),[h,f]=T.useState({id:"",name:"",email:"",picture:"",googleId:"",location:"",gender:"",birthday:"",birthdayRaw:"",tokens:0,gems:0}),[y,E]=T.useState(!1),[x,C]=T.useState(null),[P,S]=T.useState(!1),k=m=>{m&&(navigator.clipboard.writeText(m),S(!0),setTimeout(()=>S(!1),2e3))};T.useEffect(()=>{n&&o&&U()},[n,o]),T.useEffect(()=>{!x&&n&&G()},[n]);const G=async()=>{try{navigator.geolocation?navigator.geolocation.getCurrentPosition(async m=>{var w,b,v;const{latitude:g,longitude:_}=m.coords;try{const _e=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${g}&lon=${_}`)).json(),X=((w=_e.address)==null?void 0:w.city)||((b=_e.address)==null?void 0:b.town)||"Unknown",ye=((v=_e.address)==null?void 0:v.country)||"Unknown";C(`${X}, ${ye}`),f(De=>({...De,location:`${X}, ${ye}`}))}catch(Z){console.log("Reverse geocoding error:",Z)}},m=>{console.log("Geolocation error:",m),H()}):H()}catch(m){console.log("Location detection error:",m)}},H=async()=>{try{const g=await(await fetch("https://ipapi.co/json/")).json(),_=`${g.city}, ${g.country_name}`;C(_),f(w=>({...w,location:_}))}catch(m){console.log("IP API error:",m)}},U=async()=>{var m,g,_;if(o){console.log("USER PROFILE DATA:",o);try{console.log("[ProfileModal] Setting initial data from context user:",{id:o.id,uuid:o.uuid,publicId:o.publicId,gender:o.gender,birthday:o.birthday});let w="",b=o.birthday||"Not set";if(o.birthday)try{const Z=new Date(o.birthday);isNaN(Z.getTime())||(w=Z.toISOString().split("T")[0],b=Z.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(Z){console.error("[ProfileModal] Error formatting context birthday:",Z)}f(Z=>({...Z,id:o.publicId||o.id||o.uuid||"",name:o.name||"User",email:o.email||"",picture:o.picture||"",googleId:o.googleId||"",gender:o.gender?o.gender.toLowerCase():"Not set",birthday:b,birthdayRaw:w}));const v=localStorage.getItem("token");if(v){console.log("[ProfileModal] Fetching fresh user profile from backend"),console.log("[ProfileModal] Token present: YES");const _e=await fetch("https://flinxx-backend.onrender.com/api/profile",{method:"GET",headers:{Authorization:`Bearer ${v}`,"Content-Type":"application/json"}});if(console.log("[ProfileModal] API Response status:",_e.status),_e.ok){const X=await _e.json();if(console.log("[ProfileModal] ✅ Fetched profile data from backend:",X),console.log("[ProfileModal] User gender:",(m=X.user)==null?void 0:m.gender),console.log("[ProfileModal] User birthday:",(g=X.user)==null?void 0:g.birthday),console.log("[ProfileModal] User publicId:",(_=X.user)==null?void 0:_.publicId),console.log("[ProfileModal] Full user object:",X.user),X.success&&X.user){let ye="",De="Not set";if(X.user.birthday)try{const et=new Date(X.user.birthday);isNaN(et.getTime())?(ye=X.user.birthday,De=X.user.birthday):(ye=et.toISOString().split("T")[0],De=et.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(et){console.error("[ProfileModal] Error formatting birthday:",et),ye=X.user.birthday,De=X.user.birthday}const pt=X.user.gender?X.user.gender.toLowerCase():"Not set";console.log("[ProfileModal] Setting profile data with:",{gender:pt,birthday:De,birthdayRaw:ye,publicId:X.user.publicId,uuid:X.user.uuid}),f(et=>({...et,id:X.user.publicId||X.user.uuid||X.user.id||X.user.userId||"",name:X.user.name||"User",email:X.user.email||"",picture:X.user.picture||"",googleId:X.user.googleId||"",gender:pt,birthday:De,birthdayRaw:ye}))}}else{console.warn("[ProfileModal] ⚠️ Failed to fetch profile from backend:",_e.status);const X=await _e.text();console.log("[ProfileModal] Response text:",X)}}else console.log("[ProfileModal] ⚠️ No token found in localStorage")}catch(w){console.error("[ProfileModal] ❌ Error loading user profile:",w)}}},B=m=>{const{name:g,value:_}=m.target;if(g==="birthday"){let w="Not set";if(_)try{const b=new Date(_+"T00:00:00Z");isNaN(b.getTime())||(w=b.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}))}catch(b){console.error("[ProfileModal] Error formatting date:",b)}f(b=>({...b,birthdayRaw:_,birthday:w}))}else f(w=>({...w,[g]:_}))},de=m=>{var _;const g=(_=m.target.files)==null?void 0:_[0];if(g){const w=new FileReader;w.onloadend=()=>{f(b=>({...b,picture:w.result}))},w.readAsDataURL(g)}},L=async()=>{E(!0);try{console.log("[PROFILE SAVE] Starting profile save process"),console.log("[PROFILE SAVE] Profile data:",h);const m=(o==null?void 0:o.id)||(o==null?void 0:o.uuid)||(o==null?void 0:o.googleId)||localStorage.getItem("userId");if(console.log("[PROFILE SAVE] User ID:",m),!m){console.error("[PROFILE SAVE] Error: No user ID found"),alert("Error: User ID not found. Please login again."),E(!1);return}const g=h.birthdayRaw||new Date().toISOString().split("T")[0],_=h.gender&&h.gender!=="Not set"?h.gender:"",w={userId:m,birthday:g,gender:_};console.log("[PROFILE SAVE] Request body:",JSON.stringify(w)),console.log("[PROFILE SAVE] Required fields check:"),console.log("  - userId:",!!w.userId),console.log("  - birthday:",!!w.birthday),console.log("  - gender:",!!w.gender);const b=localStorage.getItem("token");console.log("[PROFILE SAVE] Token present:",!!b),b||console.warn("[PROFILE SAVE] Warning: No auth token found");const v="https://flinxx-backend.onrender.com";console.log("[PROFILE SAVE] Backend URL:",v),console.log("[PROFILE SAVE] Making API call to /api/users/complete-profile");const Z=await fetch(`${v}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json",...b&&{Authorization:`Bearer ${b}`}},body:JSON.stringify(w)});if(console.log("[PROFILE SAVE] Response status:",Z.status),!Z.ok){const X=await Z.json();console.error("[PROFILE SAVE] Error response:",X),alert(`Failed to save profile: ${X.error||"Unknown error"}`),E(!1);return}const _e=await Z.json();console.log("[PROFILE SAVE] ✅ Profile saved successfully:",_e),localStorage.setItem("userProfile",JSON.stringify(w)),u(!1),console.log("[PROFILE SAVE] Profile saved successfully"),console.log("[PROFILE SAVE] Closing ProfileModal..."),e(),alert("Profile updated successfully!"),console.log("🎥 [ProfileModal] Scheduling camera re-init with 500ms delay to allow modal unmount"),typeof r=="function"?setTimeout(()=>{console.log(`
🎥 [ProfileModal] 500ms delay complete, reinitializing camera now`),console.log("🎥 [ProfileModal] Calling onReinitializeCamera()"),r().then(X=>{X?console.log("🎥 [ProfileModal] ✅ Camera reinitialized successfully after profile save"):console.warn("🎥 [ProfileModal] ⚠️ Camera reinitialization returned false")}).catch(X=>{console.error("🎥 [ProfileModal] ❌ Error calling reinitializeCamera:",X)})},500):console.warn("🎥 [ProfileModal] ⚠️ onReinitializeCamera callback not provided")}catch(m){console.error("[PROFILE SAVE] Error:",m),console.error("[PROFILE SAVE] Error message:",m.message),console.error("[PROFILE SAVE] Error stack:",m.stack),alert("Failed to save profile: "+m.message)}finally{E(!1)}},I=async()=>{try{await im(Wr),localStorage.removeItem("userInfo"),localStorage.removeItem("userProfile"),s("/login",{replace:!0})}catch(m){console.error("Sign out error:",m)}};return n?l.jsx("div",{className:"profile-modal-overlay",onClick:e,children:l.jsxs("div",{className:"profile-modal-container",onClick:m=>m.stopPropagation(),children:[l.jsx("button",{className:"profile-modal-close",onClick:e,children:"✕"}),l.jsxs("div",{className:"profile-header",children:[l.jsxs("div",{className:"profile-picture-container",children:[l.jsx("img",{src:h.picture||"https://via.placeholder.com/120",alt:"Profile",className:"profile-picture"}),a&&l.jsxs("label",{className:"photo-upload-label",children:[l.jsx("input",{type:"file",accept:"image/*",onChange:de,style:{display:"none"}}),"📷"]})]}),a?l.jsx("input",{type:"text",name:"name",value:h.name,onChange:B,className:"profile-input-name",placeholder:"Name"}):l.jsx("h2",{className:"profile-name",children:h.name}),l.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginTop:"6px",opacity:.8},children:[l.jsxs("span",{children:["ID: ",h.id||"N/A"]}),h.id&&l.jsx("button",{onClick:()=>k(h.id),style:{background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center"},title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{className:"profile-premium-section",onClick:t,style:{cursor:"pointer"},children:[l.jsx("div",{className:"premium-badge",children:"⭐ Flinxx Premium"}),l.jsx("p",{className:"premium-description",children:"Unlock premium features"})]}),l.jsx("div",{className:"profile-details",children:a?l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("input",{type:"text",name:"location",value:h.location,onChange:B,className:"profile-input-small"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsxs("select",{name:"gender",value:h.gender,onChange:B,className:"profile-input-small",children:[l.jsx("option",{value:"",children:"Select"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"}),l.jsx("option",{value:"other",children:"Other"})]})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("input",{type:"date",name:"birthday",value:h.birthdayRaw||"",onChange:B,className:"profile-input-small text-black focus:text-black !text-black [&::-webkit-datetime-edit]:text-black [&::-webkit-datetime-edit-year-field]:text-black [&::-webkit-datetime-edit-month-field]:text-black [&::-webkit-datetime-edit-day-field]:text-black"})]}),l.jsx("button",{className:"btn-save",onClick:L,disabled:y,children:y?"Saving...":"Save Changes"}),l.jsx("button",{className:"btn-cancel",onClick:()=>{u(!1),U()},children:"Cancel"})]}):l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"📍 Location"}),l.jsx("span",{className:"detail-value",children:h.location||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"⚧ Gender"}),l.jsx("span",{className:"detail-value",children:h.gender||"Not set"})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"detail-label",children:"🎂 Birthday"}),l.jsx("span",{className:"detail-value",children:h.birthday||"Not set"})]})]})}),l.jsx("button",{className:"btn-sign-out",onClick:I,children:"Sign Out"})]})}):null},PI=({isOpen:n,onClose:e})=>{const[t,r]=T.useState([{id:1,username:"Up ke 😊",name:"Up ke",location:"National Capital Territory of Delhi",duration:"00:05",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:2,username:"Loup 😊",name:"Loup",location:"Algeria",duration:"00:06",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:3,username:"Nish 😊",name:"Nish",location:"Maharashtra",duration:"00:04",date:"11/27/2025",time:"9:24PM",avatar:"😊",liked:!1},{id:4,username:"Priya 😊",name:"Priya",location:"Gujarat",duration:"00:02",date:"11/27/2025",time:"9:23PM",avatar:"M",liked:!1},{id:5,username:"pagbigyamnmako 😊",name:"pagbigyamnmako",location:"Philippines",duration:"00:08",date:"11/27/2025",time:"9:23PM",avatar:"😊",liked:!1}]),s=a=>{r(t.map(u=>u.id===a?{...u,liked:!u.liked}:u))},o=a=>{r(t.filter(u=>u.id!==a))};return n?l.jsx("div",{className:"match-history-overlay",onClick:e,children:l.jsxs("div",{className:"match-history-container",onClick:a=>a.stopPropagation(),children:[l.jsxs("div",{className:"match-history-header",children:[l.jsx("h2",{children:"Match History"}),l.jsx("button",{className:"match-history-close",onClick:e,children:"✕"})]}),l.jsx("div",{className:"match-history-list",children:t.length===0?l.jsxs("div",{className:"match-history-empty",children:[l.jsx("p",{children:"No match history yet"}),l.jsx("p",{className:"match-history-empty-sub",children:"Start video chatting to build your history!"})]}):t.map(a=>l.jsxs("div",{className:"match-card",children:[l.jsxs("div",{className:"match-card-date",children:[l.jsxs("div",{className:"match-card-datetime",children:[l.jsx("span",{className:"match-date",children:a.date}),l.jsx("span",{className:"match-time",children:a.time})]}),l.jsxs("div",{className:"match-duration",children:["⏱️ ",a.duration]})]}),l.jsxs("div",{className:"match-card-user",children:[l.jsx("div",{className:"match-card-avatar",children:a.avatar==="M"?l.jsx("div",{className:"avatar-initial",children:"M"}):l.jsx("span",{children:a.avatar})}),l.jsxs("div",{className:"match-card-info",children:[l.jsx("p",{className:"match-card-name",children:a.name}),l.jsxs("p",{className:"match-card-location",children:["📍 ",a.location]})]})]}),l.jsxs("div",{className:"match-card-actions",children:[l.jsx("button",{className:`action-btn like-btn ${a.liked?"liked":""}`,onClick:()=>s(a.id),title:"Like this match",children:"❤️"}),l.jsx("button",{className:"action-btn delete-btn",onClick:()=>o(a.id),title:"Delete from history",children:"🗑️"})]})]},a.id))})]})}):null},Co=({friend:n,onBack:e,onMessageSent:t})=>{var x;const{user:r}=T.useContext(Ot)||{},{refetchUnreadCount:s}=ya(),[o,a]=T.useState([]),[u,h]=T.useState(""),f=r==null?void 0:r.uuid;if(!f||typeof f!="string"||f.length!==36)return console.warn("⛔ ChatBox: Invalid my UUID, blocking render:",f==null?void 0:f.length),null;if(!(n!=null&&n.id)||typeof n.id!="string"||n.id.length!==36)return console.warn("⛔ ChatBox: Invalid friend UUID, blocking render:",(x=n==null?void 0:n.id)==null?void 0:x.length),null;T.useEffect(()=>{if(!f||!n)return;const C=n.id,P=f<C?`${f}_${C}`:`${C}_${f}`;console.log(`📍 Joining chat room: ${P}`),console.log(`   My UUID: ${f}`),console.log(`   Friend UUID: ${C}`),K.emit("join_chat",{senderId:f,receiverId:n.id})},[n,f]),T.useEffect(()=>{if(!f||!(n!=null&&n.id))return;(async()=>{try{const P=n.id,S=f<P?`${f}_${P}`:`${P}_${f}`,k=await Or(S);k!=null&&k.success&&(console.log("✅ Messages from",n.display_name,"marked as read (chatId)",S),await s())}catch(P){console.error("❌ Error marking messages as read:",P)}})()},[n==null?void 0:n.id,f,s]),T.useEffect(()=>{if(!f||!(n!=null&&n.id)){console.log("⏳ ChatBox: Waiting for myUserId or friend.id",{myUserId:f,friendId:n==null?void 0:n.id});return}console.log("📨 ChatBox: Loading messages for friend:",{myUserId:f,friendId:n.id,friendName:n.display_name});const P=`https://flinxx-backend.onrender.com/api/messages?user1=${f}&user2=${n.id}`;console.log("📨 Fetching chat history from:",P),fetch(P).then(S=>{if(console.log("📨 Response status:",S.status),!S.ok)throw new Error(`HTTP ${S.status}`);return S.json()}).then(S=>{console.log("📨 Messages loaded:",S.length,"messages"),Array.isArray(S)&&a(S.map(k=>({me:k.sender_id===f,text:k.message})))}).catch(S=>{console.error("❌ Failed to load chat history:",S)})},[f,n]);const y=()=>{if(!u.trim())return;const C=new Date().toISOString();K.emit("send_message",{senderId:f,receiverId:n.id,message:u,created_at:C}),h(""),t&&t(n.id,C)};T.useEffect(()=>{const C=P=>{if(a(S=>[...S,{me:P.senderId===f,text:P.message}]),t&&P.senderId!==f){const S=P.created_at||new Date().toISOString();t(n.id,S)}};return K.on("receive_message",C),()=>K.off("receive_message",C)},[f,n,t]);const E=C=>{C.key==="Enter"&&!C.shiftKey&&(C.preventDefault(),y())};return l.jsxs("div",{className:"chat-box",children:[l.jsxs("div",{className:"chat-header",children:[l.jsx("button",{onClick:e,children:"←"}),l.jsx("img",{src:n.photo_url,alt:n.display_name}),l.jsx("span",{children:n.display_name})]}),l.jsxs("div",{className:"chat-body",children:[o.length===0&&l.jsxs("p",{className:"empty",children:["Start a conversation with ",n.display_name]}),o.map((C,P)=>l.jsx("div",{className:`bubble ${C.me?"me":""}`,children:C.text},P))]}),l.jsxs("div",{className:"chat-input",children:[l.jsx("input",{value:u,onChange:C=>h(C.target.value),onKeyPress:E,placeholder:"Type a message…"}),l.jsx("button",{onClick:y,children:"➤"})]})]})},jI=({isOpen:n,onClose:e,onUserSelect:t,mode:r="search"})=>{const{markAsRead:s}=T.useContext(ha)||{},{user:o,notifications:a,refreshNotifications:u}=T.useContext(Ot)||{},{setUnreadCount:h,refetchUnreadCount:f}=ya(),[y,E]=T.useState(""),[x,C]=T.useState(""),[P,S]=T.useState(!1),[k,G]=T.useState({}),[H,U]=T.useState(null),[B,de]=T.useState(null),[L,I]=T.useState([]),[m,g]=T.useState(null),_=r==="notifications",w=r==="message",b=r==="likes",v="https://flinxx-backend.onrender.com",Z=async()=>{try{const j=await fetch(`${v}/api/profile`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(!j.ok)return null;const q=await j.json();if(q!=null&&q.user){const ne={...q.user,publicId:q.user.public_id};return localStorage.setItem("user",JSON.stringify(ne)),ne}return null}catch(j){return console.error("Failed to ensure current user",j),null}},_e=()=>{try{const j=JSON.parse(localStorage.getItem("user"));return j?{...j,publicId:j.publicId||j.public_id||j.id}:null}catch{return null}},X=async j=>{try{const q=_e();if(!q||!q.id){console.warn("Current user not available for status check");return}const ne=await fetch(`${v}/api/friends/status?senderPublicId=${q.id}&receiverPublicId=${j}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(ne.ok){const Le=await ne.json();G(xe=>({...xe,[j]:Le.status}))}}catch(q){console.error("Error checking friend status:",q)}};T.useEffect(()=>{n&&Z()},[n]),T.useEffect(()=>{n&&o!=null&&o.uuid&&o.uuid.length===36&&(console.log("📨 Loading friends for message mode"),Uh(o.uuid).then(j=>{const q=Array.isArray(j)?j.sort((ne,Le)=>{const xe=ne.last_message_at?new Date(ne.last_message_at):new Date(0);return(Le.last_message_at?new Date(Le.last_message_at):new Date(0))-xe}):[];I(q)}).catch(j=>{console.error("❌ Error loading friends:",j),I([])}))},[n,o==null?void 0:o.uuid]),T.useEffect(()=>{n&&_&&o!=null&&o.uuid&&o.uuid.length===36&&u&&(console.log("🔄 Refreshing notifications when panel opens"),u())},[n,_,o==null?void 0:o.uuid,u]);const ye=a||[],De=(j,q)=>{I(ne=>ne.map(xe=>xe.id===j?{...xe,last_message_at:q}:xe).sort((xe,Tt)=>{const Dt=xe.last_message_at?new Date(xe.last_message_at):new Date(0);return(Tt.last_message_at?new Date(Tt.last_message_at):new Date(0))-Dt}))},pt=async j=>{j!=null&&j.id&&(o!=null&&o.uuid)&&o.uuid.length===36&&(await Or(o.uuid,j.id),I(q=>q.map(ne=>ne.id===j.id?{...ne,unreadCount:0}:ne)),await f()),s&&j.id&&s(j.id),h(q=>Math.max(q-1,0)),g(j)};if(!n)return null;const et=async j=>{if(!(!j||typeof j!="string")){if(E(j),!j.trim()){C([]);return}S(!0);try{const q=await fetch(`${v}/api/search-user?q=${encodeURIComponent(j)}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(!q.ok){console.error("Search error:",q.status),C([]);return}const ne=await q.json();C(Array.isArray(ne)?ne:[]),Array.isArray(ne)&&ne.forEach(Le=>{X(Le.publicId)})}catch(q){console.error("Search error:",q),C([])}finally{S(!1)}}},Dn=j=>{const q=k[j];return q==="pending"?"SENT":q==="accepted"?"MESSAGE":"FRIEND"},st=j=>{const q=k[j];return q==="pending"?"⏳":q==="accepted"?"💬":"🤝"},Ne=async j=>{const q=k[j];if(q==="pending"||q==="accepted"){console.log("Friend request already sent or accepted");return}U(j);try{const ne=_e();if(!(ne!=null&&ne.id)){console.error("Current user id not found",ne);return}(await fetch(`${v}/api/friends/send`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({senderPublicId:String(ne.id),receiverPublicId:String(j)})})).ok?(G(xe=>({...xe,[j]:"pending"})),console.log("Friend request sent to:",j),u&&u()):console.error("Failed to send friend request")}catch(ne){console.error("Error sending friend request:",ne)}finally{U(null)}},ts=async(j,q)=>{try{(await fetch(`${v}/api/friends/accept`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({requestId:j})})).ok&&(G(Le=>({...Le,[q]:"accepted"})),setPendingRequests(Le=>Le.map(xe=>xe.id===j?{...xe,status:"accepted"}:xe)),console.log("Friend request accepted"),u&&u())}catch(ne){console.error("Error accepting request:",ne)}},Xt=async j=>{try{(await fetch(`${v}/api/friends/reject`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({requestId:j})})).ok&&(setPendingRequests(ne=>ne.filter(Le=>Le.id!==j)),console.log("Friend request rejected"),u&&u())}catch(q){console.error("Error rejecting request:",q)}};return l.jsx("div",{className:"search-friends-overlay",onClick:e,children:l.jsxs("div",{className:"search-friends-modal",onClick:j=>j.stopPropagation(),children:[l.jsxs("div",{className:"search-friends-header",children:[l.jsx("h2",{children:w?"Messages":_?"Friend Requests":b?"❤️ Friends & Requests":"Search Friends"}),l.jsx("button",{className:"search-close-btn",onClick:e,children:"✖"})]}),!_&&!w&&!b&&l.jsxs("div",{className:"search-input-container",children:[l.jsx("input",{type:"text",placeholder:"Search a friend by ID",value:y,onChange:j=>et(j.target.value),className:"search-input",autoFocus:!0}),l.jsx("span",{className:"search-icon",children:"🔍"})]}),!_&&!w&&!b&&l.jsx("div",{className:"search-results",children:x.length===0?l.jsx("div",{className:"search-empty-state",children:l.jsx("p",{style:{textAlign:"center",color:"rgba(255, 255, 255, 0.6)",marginTop:"40px"},children:y?"No users found":""})}):x.map((j,q)=>l.jsxs("div",{className:"search-result-item",onClick:()=>{t&&t(j),e()},children:[l.jsx("div",{className:"result-avatar",children:j.avatar&&j.avatar.startsWith("http")?l.jsx("img",{src:j.avatar,alt:"avatar",style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsxs("div",{className:"result-name-row",children:[l.jsx("p",{className:"result-name",children:j.name}),l.jsxs("button",{className:"friend-badge-btn",title:"Send Friend Request",disabled:k[j.publicId]==="pending",onClick:ne=>{ne.stopPropagation(),Ne(j.publicId)},children:[l.jsx("span",{className:"friend-emoji","aria-hidden":"true",children:st(j.publicId)}),l.jsx("span",{className:"friend-text",children:Dn(j.publicId)})]})]}),l.jsx("p",{className:"tap-to-chat",children:k[j.publicId]==="accepted"&&j.unreadCount>0?"New message":"Tap to chat"})]})]},`user-${j.shortId}-${q}`))}),_&&l.jsx("div",{className:"search-results",children:m?l.jsx(Co,{friend:m,onBack:()=>g(null),onMessageSent:De}):notificationsLoading?l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"40px"},children:"Loading notifications..."}):ye.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No notifications"}):ye.map(j=>l.jsxs("div",{className:"notification-item",children:[l.jsx("div",{className:"notification-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name}):l.jsx("div",{className:"text-avatar",children:j.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:j.display_name})}),j.status==="accepted"&&l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:async()=>{o!=null&&o.uuid&&o.uuid.length===36&&j.user_id&&await Or(o.uuid,j.user_id),s&&j.user_id&&s(j.user_id);const q={...j,id:j.user_id};console.log("Opening chat from notification:",q),g(q)},children:"Message"})})]},j.id))}),w&&l.jsx("div",{className:"message-panel-body",children:m?l.jsx(Co,{friend:m,onBack:()=>g(null),onMessageSent:De}):l.jsx("div",{className:"search-results",children:L.length===0?l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px"},children:"No friends yet"}):L.map(j=>l.jsxs("div",{className:"search-result-item friend-row",onClick:()=>pt(j),children:[l.jsx("div",{className:"result-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name,style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):"👤"}),l.jsxs("div",{className:"result-info",children:[l.jsx("p",{className:"result-name",children:j.display_name}),l.jsx("p",{className:"tap-to-chat",children:j.unreadCount>0?"New message":"Tap to chat"})]})]},j.id))})}),b&&l.jsx("div",{className:"message-panel-body",children:l.jsxs("div",{className:"search-results",children:[ye&&ye.length>0&&l.jsxs("div",{style:{marginBottom:"20px"},children:[l.jsxs("h3",{style:{color:"#fff",fontSize:"14px",fontWeight:"600",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.1)"},children:["📬 ",ye.length," Friend Request",ye.length!==1?"s":""]}),ye.map(j=>{var q;return l.jsxs("div",{className:"notification-item",style:{marginTop:"10px"},children:[l.jsx("div",{className:"notification-avatar",children:j.photo_url?l.jsx("img",{src:j.photo_url,alt:j.display_name}):l.jsx("div",{className:"text-avatar",children:((q=j.display_name)==null?void 0:q.charAt(0).toUpperCase())||"?"})}),l.jsxs("div",{className:"notification-text",children:[l.jsx("strong",{children:j.display_name}),j.status!=="accepted"&&l.jsx("p",{style:{fontSize:"12px",color:"rgba(255,255,255,0.5)"},children:j.status==="pending"?"Pending":"Request received"})]}),j.status!=="accepted"&&l.jsxs("div",{style:{display:"flex",gap:"8px"},children:[l.jsx("button",{onClick:()=>ts(j.id,j.sender_id),style:{padding:"6px 12px",background:"#10b981",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Accept"}),l.jsx("button",{onClick:()=>Xt(j.id),style:{padding:"6px 12px",background:"#ef4444",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Decline"})]}),j.status==="accepted"&&l.jsx("button",{className:"message-btn",onClick:async()=>{o!=null&&o.uuid&&o.uuid.length===36&&j.user_id&&await Or(o.uuid,j.user_id),s&&j.user_id&&s(j.user_id);const ne={...j,id:j.user_id};g(ne)},children:"Message"})]},j.id)})]}),(!ye||ye.length===0)&&l.jsx("p",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"40px",padding:"20px"},children:"No friend requests yet"})]})})]})})},OI=({onClose:n})=>{const[e,t]=T.useState("flex"),o=e==="flex"?[{id:1,emoji:"✔️",name:"Blue Tick",price:"₹69",features:["Verified badge","Stand out in search","Premium status"]},{id:2,emoji:"🎨",name:"Chat Themes",price:"₹49",features:["Custom chat colors","5 premium themes","Personalize chats"]},{id:3,emoji:"⚡",name:"Match Boost",price:"₹39",features:["Boost visibility","10 boost credits","More matches"]},{id:4,emoji:"💍",name:"Profile Ring",price:"₹79",features:["Animated profile ring","Gold border effect","Premium look"]},{id:5,emoji:"✨",name:"Profile Highlight",price:"₹99",features:["Featured profile","Top visibility","Extended duration"]}]:[{id:1,emoji:"👑",name:"Premium Basic",price:"₹299/mo",features:["All Blue Tick benefits","Basic theme access","Monthly boost"]},{id:2,emoji:"💎",name:"Premium Plus",price:"₹599/mo",features:["All Premium Basic","All themes","Weekly boost"]},{id:3,emoji:"🌟",name:"Premium Elite",price:"₹999/mo",features:["Everything included","Priority support","Daily boost"]}];return l.jsxs("div",{className:"subscriptions-page",children:[l.jsx("button",{className:"subscriptions-close-btn",onClick:n,title:"Close",children:"✖"}),l.jsxs("div",{className:"subscriptions-container",children:[l.jsx("h1",{className:"subscriptions-title",children:"Flinxx Subscriptions"}),l.jsxs("div",{className:"plan-tabs",children:[l.jsx("button",{className:`tab ${e==="premium"?"active":""}`,onClick:()=>t("premium"),children:"PREMIUM PLANS"}),l.jsx("button",{className:`tab ${e==="flex"?"active":""}`,onClick:()=>t("flex"),children:"FLEX PLANS"})]}),l.jsx("div",{className:"plans-grid",children:o.map(a=>l.jsxs("div",{className:"plan-card",children:[l.jsxs("div",{className:"plan-header",children:[l.jsx("span",{className:"plan-emoji",children:a.emoji}),l.jsx("h3",{className:"plan-title",children:a.name})]}),l.jsx("div",{className:"plan-price",children:a.price}),l.jsx("ul",{className:"plan-features",children:a.features.map((u,h)=>l.jsxs("li",{children:[l.jsx("span",{className:"feature-bullet",children:"•"}),u]},h))}),l.jsx("button",{className:"plan-button",children:"ADD NOW"})]},a.id))})]})]})};console.log("🎯 CHAT BUILD: 2026-01-05T10:20:00Z - Chat layout and spacing fixes");let Oe=null;const DI=Kn.memo(()=>(console.log("📹 [CAMERA PANEL] Rendering camera panel (FINAL RENDER)"),console.log("📹 [CAMERA PANEL] sharedVideoRef at render time:",!!Oe),Kn.useEffect(()=>(console.log("📹 [CAMERA PANEL EFFECT] CameraPanel mounted in DOM"),console.log("📹 [CAMERA PANEL EFFECT] Video element in DOM:",document.querySelector("video")!==null),()=>console.log("📹 [CAMERA PANEL EFFECT] CameraPanel unmounted")),[]),l.jsxs("main",{className:"w-full lg:flex-1 relative bg-refined rounded-3xl overflow-hidden shadow-2xl border-2 border-primary group shadow-glow",children:[l.jsx("div",{className:"camera-frame w-full h-full",children:l.jsx("video",{ref:n=>{Oe=n},className:"camera-video",autoPlay:!0,muted:!0,playsInline:!0,style:{width:"100%",height:"100%",objectFit:"cover",backgroundColor:"#000"}})}),l.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10"}),l.jsx("div",{className:"absolute bottom-6 left-6 z-30 pointer-events-none",children:l.jsxs("div",{className:"flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg",children:[l.jsx("span",{className:"w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"}),l.jsx("span",{className:"text-xs font-semibold tracking-wider text-white/90 uppercase",children:"You"})]})})]}))),LI=()=>{console.log("RENDER START");const{activeMode:n,setActiveMode:e,handleModeChange:t,openDuoSquad:r}=id(),s=ft(),o=Ad(),{user:a}=T.useContext(Ot)||{},[u,h]=T.useState(!1),[f,y]=T.useState(!1),[E,x]=T.useState(null),[C,P]=T.useState(!1),[S,k]=T.useState(!1),[G,H]=T.useState(!1),[U,B]=T.useState(!1),[de,L]=T.useState(!1),[I,m]=T.useState(null),[g,_]=T.useState(0),[w,b]=T.useState(!1),[v,Z]=T.useState(!1),[_e,X]=T.useState(!1),[ye,De]=T.useState(!1),[pt,et]=T.useState(!1),[Dn,st]=T.useState(!1),[Ne,ts]=T.useState(!1),[Xt,j]=T.useState(!1),[q,ne]=T.useState(null),[Le,xe]=T.useState("both"),[Tt,Dt]=T.useState(!1),[Ln,At]=T.useState(!1),[We,Lt]=T.useState(null),[va,ns]=T.useState([]),[Ai,rs]=T.useState(""),[ar,Mt]=T.useState(!1),pn=T.useRef(null),z=T.useRef(null),lr=T.useRef(null),he=T.useRef(null),[te,Mn]=T.useState(null),ae=T.useRef(null),ct=T.useRef(null),ee=T.useRef(null),Zt=T.useRef(null),it=T.useRef(null),cr=T.useRef(null),[ur,_a]=T.useState(!1);if(console.log("HOOKS DONE"),!(a!=null&&a.uuid)||typeof a.uuid!="string"||a.uuid.length!==36)return console.log("⏳ Chat: Waiting for valid user UUID from AuthContext..."),null;console.log("🎯 CHAT COMPONENT LOADED - BUILD: 895cedd (temporal deadzone fix - move hooks to top)"),T.useEffect(()=>{if(console.log("STATE:",{isSearching:w,partnerFound:v}),w&&!v){console.log("🛑 [CAMERA BLOCK] Waiting screen active - camera blocked");return}},[w,v]),T.useEffect(()=>{console.log("🔐 [TERMS CHECK] Checking if terms are accepted...");try{const R=localStorage.getItem("termsAccepted")==="true";console.log("📋 [TERMS CHECK] termsAccepted from localStorage:",R),R?(console.log("✅ [TERMS CHECK] User has accepted terms - allowing access"),y(!0)):(console.log("⚠️ [TERMS CHECK] User has not accepted terms - showing modal"),h(!0))}catch(R){console.error("❌ [TERMS CHECK] Error checking terms:",R),y(!0)}},[]);const Ci=()=>{console.log("✅ User accepted terms on dashboard"),localStorage.setItem("termsAccepted","true"),h(!1),y(!0)},hr=()=>{console.log("❌ User cancelled terms on dashboard - redirecting to login"),h(!1),s("/login",{replace:!0})};T.useEffect(()=>{const $=new URLSearchParams(o.search).get("view");x($),P($==="home"),console.log("[Chat] Location search params:",o.search),console.log("[Chat] view parameter:",$),console.log("[Chat] shouldStartAsIntro:",$==="home")},[o.search]),T.useEffect(()=>{const R=a||{googleId:"guest_"+Math.random().toString(36).substring(2,9),name:"Guest User",email:"guest@flinxx.local",picture:null};Mn(R),he.current||(he.current=R.uuid,!he.current||he.current.length!==36?console.error("❌ CRITICAL: Invalid or missing UUID from localStorage:",he.current):console.log("🔐 USER UUID INITIALIZED (ONE TIME):",he.current)),lr.current||(lr.current=R)},[a]),T.useEffect(()=>()=>{cr.current&&clearInterval(cr.current)},[]),T.useEffect(()=>{console.log(`👁️ [ACTIVE MODE MONITOR] Current activeMode: "${n}"`)},[n]),T.useEffect(()=>{var R;console.log("📌 Refs initialized:"),console.log("   localVideoRef.current exists:",!!ae.current),console.log("   localVideoRef.current in DOM:",(R=ae.current)!=null&&R.parentElement?"YES":"NO"),console.log("   remoteVideoRef.current exists:",!!ct.current),console.log("   localStreamRef.current exists:",!!ee.current)},[]);const dr=Kn.useCallback(async()=>{console.log(`

🎥 ===== CAMERA RE-INITIALIZATION STARTED =====`),console.log("🎥 [REINIT] Camera re-initialization requested"),console.log("🎥 [REINIT] Current state:"),console.log("  - localStreamRef.current exists:",!!ee.current),console.log("  - localVideoRef.current exists:",!!ae.current),console.log("  - cameraStarted:",S);try{if(!ae.current)return console.error("🎥 [REINIT] ❌ CRITICAL: localVideoRef.current is null/undefined - video element not in DOM"),!1;if(!ae.current.parentElement)return console.error("🎥 [REINIT] ❌ CRITICAL: Video element is not attached to DOM"),!1;if(console.log("🎥 [REINIT] ✓ Video element exists in DOM"),ee.current){console.log("🎥 [REINIT] Stream exists, checking if tracks are active...");const $=ee.current.getTracks();if(console.log("🎥 [REINIT] Stream has",$.length,"tracks"),$.forEach((M,J)=>{console.log(`  Track ${J}:`,{kind:M.kind,enabled:M.enabled,readyState:M.readyState})}),$.length===0)console.warn("🎥 [REINIT] ⚠️ Stream exists but has no active tracks - will request new stream"),ee.current=null;else{console.log("🎥 [REINIT] ✓ Stream has active tracks, reattaching to video element"),ae.current.srcObject=ee.current,ae.current.muted=!0,console.log("🎥 [REINIT] srcObject set, waiting for play()...");try{const M=ae.current.play();return M!==void 0&&await M,console.log("🎥 [REINIT] ✅ Camera preview reattached and playing"),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(M){return console.error("🎥 [REINIT] ❌ Error playing video:",M),console.error("🎥 [REINIT] Error name:",M.name),console.error("🎥 [REINIT] Error message:",M.message),!1}}}console.log("🎥 [REINIT] No existing stream or tracks inactive, requesting new preview stream");const R=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});return ee.current=R,console.log("🎥 [REINIT] ✅ New camera stream obtained:",R),console.log("🎥 [REINIT] New stream tracks:",R.getTracks().map($=>({kind:$.kind,id:$.id}))),ae.current.srcObject=R,ae.current.muted=!0,console.log("🎥 [REINIT] srcObject set to new stream, calling play()..."),requestAnimationFrame(()=>{var $;($=ae.current)==null||$.play().catch(M=>{console.log("🎥 [REINIT] Video play blocked:",M)}),console.log("🎥 [REINIT] ✅ New camera preview play command dispatched")}),k(!0),console.log(`🎥 ===== CAMERA RE-INITIALIZATION SUCCESSFUL =====

`),!0}catch(R){return console.error("🎥 [REINIT] ❌ Error reinitializing camera:",R),console.error("🎥 [REINIT] Error name:",R.name),console.error("🎥 [REINIT] Error message:",R.message),console.error(`🎥 ===== CAMERA RE-INITIALIZATION FAILED =====

`),!1}},[S]);T.useEffect(()=>{pn.current={reinitializeCamera:dr}},[dr]),T.useEffect(()=>{if(!de)return;const R=setInterval(()=>{_($=>$+1)},1e3);return()=>clearInterval(R)},[de]),T.useEffect(()=>{U&&S&&console.log("🎬 [PARTNER FOUND] Transitioning to video chat screen")},[U,S]);const ss=async()=>{var R;try{if(console.log("📹 [START CAMERA] User clicked to start camera"),console.log("📹 [START CAMERA] Checking DOM state..."),console.log("   localVideoRef.current:",!!ae.current),console.log("   localVideoRef.current in DOM:",(R=ae.current)!=null&&R.parentElement?"YES":"NO"),console.log("   All videos in DOM:",document.querySelectorAll("video").length),!ae.current){console.error("📹 [START CAMERA] ❌ Video element not in DOM - cannot proceed");return}console.log("📹 [START CAMERA] Requesting camera from browser...");const $=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});Zt.current=$,ee.current=$,console.log("📹 [START CAMERA] ✅ Stream obtained:",$),console.log("📹 [START CAMERA] Stream tracks:",$.getTracks().map(M=>({kind:M.kind,enabled:M.enabled,id:M.id}))),ae.current&&(ae.current.srcObject=$,console.log("📹 [START CAMERA] ✅ Stream attached to video element"),ae.current.onloadedmetadata=()=>{console.log("📹 [START CAMERA] ✅ Video metadata loaded, calling play()"),ae.current.play().then(()=>{console.log("📹 [START CAMERA] ✅ Video playing - setting isLocalCameraReady=true"),At(!0)}).catch(M=>{console.warn("📹 [START CAMERA] ⚠️ Play warning (but video loaded):",M.message),At(!0)})})}catch($){console.error("📹 [START CAMERA] ❌ CRITICAL ERROR:",$),console.error("   Error name:",$.name),console.error("   Error message:",$.message),$.name==="NotAllowedError"?console.error("❌ Camera permission DENIED by user - User clicked deny in browser prompt"):$.name==="NotFoundError"?console.error("❌ No camera device found - Check if device has a camera"):$.name==="NotReadableError"?console.error("❌ Camera is already in use by another app - Close other apps using camera"):$.name==="SecurityError"&&console.error("❌ Camera access blocked by security policy - Must use HTTPS")}};T.useEffect(()=>()=>{console.log("📹 [DASHBOARD CLEANUP] Component unmounting"),console.log("📹 [DASHBOARD CLEANUP] ⚠️ NOT stopping camera - will be reused on return")},[]),T.useEffect(()=>{console.log("📹 [CAMERA INIT] 🔴 Starting camera initialization on mount"),console.log("📹 [CAMERA INIT] localStreamRef.current exists:",!!ee.current),console.log("📹 [CAMERA INIT] sharedVideoRef exists:",!!Oe);let R=!0;return(async()=>{try{if(ee.current)console.log("📹 [CAMERA INIT] Stream already exists - reusing existing stream");else{console.log("📹 [CAMERA INIT] Requesting camera permissions from browser...");const V=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:!0});if(!R){console.log("📹 [CAMERA INIT] Component unmounted, cleaning up stream"),V.getTracks().forEach(le=>le.stop());return}ee.current=V,Zt.current=V,console.log("📹 [CAMERA INIT] ✅ Camera stream obtained"),console.log("📹 [CAMERA INIT] Active tracks:",V.getTracks().map(le=>({kind:le.kind,enabled:le.enabled})))}if(await new Promise(V=>setTimeout(V,0)),!R)return;let M=0;const J=()=>{Oe&&ee.current?(console.log("📹 [CAMERA INIT] Attaching stream to video element..."),Oe.srcObject=ee.current,Oe.muted=!0,console.log("📹 [CAMERA INIT] Calling play() on video element"),Oe.play().then(()=>{R&&(console.log("📹 [CAMERA INIT] ✅ Video stream is now playing"),k(!0),At(!0))}).catch(V=>{R&&(console.warn("📹 [CAMERA INIT] ⚠️ Play error (stream may still display):",V.name,V.message),k(!0),At(!0))})):M<50?(M++,setTimeout(J,50)):(console.error("📹 [CAMERA INIT] ❌ Video ref never became available"),console.error("   sharedVideoRef:",!!Oe),console.error("   localStreamRef.current:",!!ee.current),At(!0))};J()}catch(M){R&&(console.error("📹 [CAMERA INIT] ❌ Error:",M.name,M.message),M.name==="NotAllowedError"?console.error("   → User denied camera permission"):M.name==="NotFoundError"?console.error("   → No camera device found"):M.name==="NotReadableError"&&console.error("   → Camera is in use by another app"),At(!0))}})(),()=>{R=!1}},[]),T.useEffect(()=>{const R=setInterval(()=>{Oe&&Oe.paused&&Oe.srcObject&&(console.warn("📹 [RESUME CHECK] Video was paused! Resuming..."),Oe.play().catch($=>console.warn("📹 [RESUME CHECK] Resume error:",$.message)))},500);return()=>clearInterval(R)},[]),T.useEffect(()=>{let R=0;const M=setInterval(()=>{try{if(!Oe||!ee.current)return;const J=ee.current.getTracks();if(J.forEach(V=>{V.readyState!=="ended"&&(V.enabled||(V.enabled=!0))}),!Oe.srcObject&&J.length>0&&(Oe.srcObject=ee.current,Oe.muted=!0),Oe.srcObject&&J.some(V=>V.readyState==="live")&&Oe.paused){const V=Date.now();V-R>2e3&&(Oe.play().catch(()=>{}),R=V)}}catch{}},500);return()=>clearInterval(M)},[]);const en=async()=>{if(console.log("🔧 createPeerConnection called"),console.log("   Current localStreamRef:",ee.current),!ee.current){console.warn("⚠️ CRITICAL: localStreamRef.current is null - attempting to reacquire camera stream");try{const J=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=J,ae.current){ae.current.srcObject=J,ae.current.muted=!0;try{await ae.current.play()}catch(V){console.warn("⚠️ Play error during reacquisition:",V)}}console.log("✅ LOCAL STREAM RE-ACQUIRED SUCCESSFULLY"),console.log("   Tracks:",J.getTracks().map(V=>({kind:V.kind,id:V.id})))}catch(J){throw console.error("❌ FATAL: Could not reacquire camera stream:",J.message),new Error("Cannot proceed: local camera stream unavailable - "+J.message)}}AI();const R=await fr(),$=[{urls:["stun:global.xirsys.net","turn:global.xirsys.net:3478?transport=udp","turn:global.xirsys.net:3478?transport=tcp"],username:"nkhlvdv",credential:"a8e244b8-cf5b-11f0-8771-0242ac140002"},...R];console.log("🔧 ICE Servers Configuration:",{count:$.length,servers:$.map(J=>({urls:J.urls,username:J.username?"***":void 0,credential:J.credential?"***":void 0}))});const M=new RTCPeerConnection({iceServers:$,iceTransportPolicy:"all"});if(z.current=M,console.log("✅ RTCPeerConnection created with iceTransportPolicy: all"),M.onicecandidate=J=>{if(J.candidate){const V=J.candidate;console.log("🧊 ICE candidate generated:",{candidate:V.candidate,protocol:V.protocol,port:V.port,address:V.address,type:V.type,priority:V.priority,sdpMLineIndex:V.sdpMLineIndex,sdpMId:V.sdpMid}),V.type==="relay"?(console.log("🔄 RELAY (TURN) candidate generated - TURN server is reachable"),console.log("   Protocol:",V.protocol,"Port:",V.port)):V.type==="srflx"?(console.log("📍 SRFLX (server reflexive) candidate - STUN working"),console.log("   Found public address via STUN")):V.type==="host"&&console.log("🏠 HOST candidate - direct LAN connection possible"),console.log("🔌 Sending ICE candidate to partner socket:",it.current),K.emit("ice_candidate",{candidate:V,to:it.current}),console.log("📤 ICE candidate sent to peer")}else console.log("🧊 ICE gathering complete (null candidate received)"),console.log("📊 ICE gathering summary:"),console.log("   Connection State:",M.connectionState),console.log("   ICE Connection State:",M.iceConnectionState),console.log("   ICE Gathering State:",M.iceGatheringState)},M.oniceconnectionstatechange=()=>{const J=M.iceConnectionState;switch(console.log(`
🧊 ===== ICE CONNECTION STATE CHANGED =====`),console.log("🧊 New ICE Connection State:",J),J){case"new":console.log("🧊 State: NEW - Gathering ICE candidates");break;case"checking":console.log("🧊 State: CHECKING - Testing ICE candidate pairs"),console.log("🧊 Connection in progress - waiting for connectivity");break;case"connected":console.log("✅ State: CONNECTED - Found working ICE candidate pair"),console.log("🧊 Peer-to-peer communication established");break;case"completed":console.log("✅ State: COMPLETED - ICE checks completed, ready for media"),console.log("🧊 All connectivity checks passed");break;case"failed":console.error("❌ State: FAILED - All ICE candidate pairs failed"),console.error("❌ Could not establish peer-to-peer connection"),console.error("❌ TURN server may be unreachable or blocked by ISP"),console.error("🔍 Troubleshooting:"),console.error("   - Check console for TURN error details"),console.error("   - TURN error 701 = Network/ISP blocking ports 3478, 5349"),console.error("   - Solutions: Try VPN, different WiFi, or mobile hotspot"),console.error("   - User can retry with a retry button (do NOT auto-restart ICE)");break;case"disconnected":console.warn("⚠️ State: DISCONNECTED - Lost connection to peer"),console.warn("   Note: ICE restart is manual only to prevent stream loss");break;case"closed":console.log("🛑 State: CLOSED - Connection closed");break}console.log("📊 Full connection states:"),console.log("   Signaling State:",M.signalingState),console.log("   Connection State:",M.connectionState),console.log("   ICE Gathering State:",M.iceGatheringState)},z.current._remoteStream||(z.current._remoteStream=new MediaStream,console.log("✅ PERSISTENT REMOTE STREAM CREATED - will accumulate all incoming tracks")),M.ontrack=J=>{console.log(`

🔴🔴🔴 ===== CRITICAL: ONTRACK HANDLER FIRING! =====`),console.log("🔴 ONTRACK CALLED AT:",new Date().toISOString()),console.log("🔴 Track received:",{kind:J.track.kind,id:J.track.id,enabled:J.track.enabled});const V=z.current._remoteStream;if(console.log("🔴 Using persistent remote stream ID:",V.id),V.addTrack(J.track),console.log("✅ Track added to persistent remote stream"),console.log("📥 Remote stream now has",V.getTracks().length,"track(s)"),console.log("📥 Tracks:",V.getTracks().map(le=>({kind:le.kind,id:le.id,enabled:le.enabled}))),!ct.current){console.error("❌ CRITICAL ERROR: remoteVideoRef.current is NULL!"),console.error("   Cannot attach remote track - video element not available");return}ct.current.srcObject!==V?(console.log("📺 ATTACHING PERSISTENT STREAM to remoteVideoRef"),ct.current.srcObject=V,ct.current.muted=!1,console.log("📺 srcObject attached, attempting play()..."),ct.current.play().catch(()=>{console.log("ℹ️ Autoplay blocked - will play on user interaction")})):(console.log("📺 STREAM ALREADY ATTACHED - skipping re-attachment"),console.log("   Stream has",V.getTracks().length,"tracks now")),console.log(`✅ ✅ ✅ ONTRACK COMPLETE - Remote stream persisted and attached

`)},M.onconnectionstatechange=()=>{console.log(`
🔌 ===== CONNECTION STATE CHANGED =====`),console.log("🔌 New Connection State:",M.connectionState),console.log("   ICE Connection State:",M.iceConnectionState),console.log("   ICE Gathering State:",M.iceGatheringState),console.log("   Signaling State:",M.signalingState),M.connectionState==="connected"?(L(!0),console.log("✅ WebRTC connection ESTABLISHED"),setTimeout(()=>{console.log(`
📊 ===== RECEIVER DEBUG CHECK (after connected) =====`);const J=M.getReceivers();console.log("📊 Total receivers:",J.length),J.forEach((le,pe)=>{var ke,qe,Ee,Pe,fe;console.log(`📊 Receiver ${pe}:`,{kind:(ke=le.track)==null?void 0:ke.kind,enabled:(qe=le.track)==null?void 0:qe.enabled,readyState:(Ee=le.track)==null?void 0:Ee.readyState,id:(Pe=le.track)==null?void 0:Pe.id,muted:(fe=le.track)==null?void 0:fe.muted})}),console.log("📊 Audio and video tracks should be present above");const V=M.getSenders();console.log(`
📊 Total senders:`,V.length),V.forEach((le,pe)=>{var ke,qe,Ee,Pe;console.log(`📊 Sender ${pe}:`,{kind:(ke=le.track)==null?void 0:ke.kind,enabled:(qe=le.track)==null?void 0:qe.enabled,readyState:(Ee=le.track)==null?void 0:Ee.readyState,id:(Pe=le.track)==null?void 0:Pe.id})})},1e3)):M.connectionState==="disconnected"?(L(!1),console.log("⚠️ WebRTC connection DISCONNECTED")):M.connectionState==="failed"?(L(!1),console.log("❌ WebRTC connection FAILED")):M.connectionState==="closed"&&(L(!1),console.log("❌ WebRTC connection CLOSED"))},!ee.current)throw console.error("❌ CRITICAL ERROR: localStreamRef.current is null/undefined in createPeerConnection!"),new Error("Local stream lost before createPeerConnection");return M};T.useEffect(()=>(console.log(`

🔌 ===== SOCKET LISTENERS SETUP (COMPONENT MOUNT) =====`),console.log("🔌 Setting up socket listeners - runs ONCE on component load"),console.log("🔌 Socket ID:",K.id),console.log("🔌 Socket connected:",K.connected),console.log("🔌 🔐 Using userIdRef.current for ALL ID comparisons:",he.current),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("receive_message"),K.off("partner_disconnected"),K.off("disconnect"),console.log("🔌 Removed old listeners (if any existed)"),K.on("partner_found",async R=>{var ke,qe,Ee,Pe;console.log(`

📋 ===== PARTNER FOUND EVENT RECEIVED =====`),console.log("👥 RAW DATA from server:",JSON.stringify(R,null,2)),console.log("👥 My socket ID:",K.id),console.log("👥 currentUser object:",JSON.stringify(te,null,2)),console.log("👥 userIdRef.current (SHOULD USE THIS):",he.current),console.log("👥 currentUser.googleId:",te==null?void 0:te.googleId),console.log("👥 currentUser.id:",te==null?void 0:te.id),console.log("👥 data.socketId:",R.socketId),console.log("👥 data.partnerId:",R.partnerId),console.log("👥 data.userName:",R.userName),b(!1),Z(!0),Mt(!1),console.log(`
👥 SELF-MATCH CHECK - START`);const $=he.current,M=R.partnerId;if(console.log("👥 COMPARISON VALUES:"),console.log("   myUserId type:",typeof $,"value:",$),console.log("   partnerUserId type:",typeof M,"value:",M),console.log("   Are they EQUAL?",$===M),console.log("   String comparison:",String($)===String(M)),$===M){console.error(`
❌❌❌ CRITICAL ERROR: SELF-MATCH DETECTED! ❌❌❌`),console.error("   My user ID:",$,"type:",typeof $),console.error("   Partner user ID:",M,"type:",typeof M),console.error("   Match IDs:",$===M),console.error("   These should be DIFFERENT!"),Mt(!0),console.error("   Emitting skip_user..."),K.emit("skip_user",{partnerSocketId:R.socketId}),console.error("   Emitting find_partner..."),K.emit("find_partner",{userId:he.current,userName:te.name||"Anonymous",userAge:te.age||18,userLocation:te.location||"Unknown"}),console.error("   Returning - match REJECTED");return}console.log("✅ SELF-MATCH CHECK PASSED - partner is different user"),console.log("   Accepting match and proceeding with WebRTC setup"),console.log(`👥 SELF-MATCH CHECK - END
`),it.current=R.socketId,console.log("🔌 CRITICAL: Stored partner socket ID:",it.current),console.log("🔌 CRITICAL: Verification - partnerSocketIdRef.current is now:",it.current),console.log("🎬 ABOUT TO CALL setHasPartner(true)"),B(!0),console.log("🎬 ✅ setHasPartner(true) CALLED - force attach effect should trigger");const J={...R,picture:R.userPicture||R.picture||null,userName:R.userName||R.name||"Anonymous",userLocation:R.userLocation||R.location||"Unknown",userAge:R.userAge||R.age||18};m(J),console.log("🎬 ✅ setPartnerInfo CALLED with data:",J);const V=K.id,le=R.socketId,pe=V<le;if(console.log("🔍 SOCKET ID COMPARISON:"),console.log("   My socket ID:",V),console.log("   Partner socket ID:",le),console.log("   Am I offerer? (myID < partnerID):",pe),console.log(`
🔐 ===== CRITICAL STREAM VERIFICATION =====`),console.log("🔐 Checking localStreamRef.current status:"),console.log("   exists:",!!ee.current),console.log("   tracks:",((ke=ee.current)==null?void 0:ke.getTracks().length)||0),console.log("   video element srcObject:",!!((qe=ae.current)!=null&&qe.srcObject)),!ee.current){console.error("🔐 ❌ CRITICAL: localStreamRef.current is NULL - cannot proceed to WebRTC"),console.error("   This means the camera stream was never acquired or was lost"),console.error("   Attempting emergency camera reacquisition...");try{const fe=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=fe,ae.current){ae.current.srcObject=fe,ae.current.muted=!0;try{await ae.current.play()}catch{console.warn("⚠️ Play error in emergency reacquisition")}}console.log("🔐 ✅ EMERGENCY: Camera stream re-acquired")}catch(fe){console.error("🔐 ❌ EMERGENCY FAILED: Could not reacquire camera -",fe.message),console.error("   User must allow camera permission to continue");return}}if(console.log(`🔐 ✅ STREAM VERIFICATION PASSED - proceeding with WebRTC
`),!pe){console.log("📭 I am the ANSWERER - waiting for offer from offerer");return}console.log("📬 I am the OFFERER - creating peer connection and sending offer");try{if(console.log(`
🏠 OFFERER: Creating peer connection`),z.current){console.warn("⚠️ OFFERER: WARNING - Peer connection already exists! Not recreating."),console.warn("   Existing PC state:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState});return}let fe;try{fe=await en()}catch(Ie){console.error("❌ OFFERER: Error creating peer connection:",Ie);return}if(z.current=fe,console.log("✅ OFFERER: Peer connection created"),console.log("📊 OFFERER Stream status after peer connection creation:",{exists:!!ee.current,trackCount:(Ee=ee.current)==null?void 0:Ee.getTracks().length,tracks:(Pe=ee.current)==null?void 0:Pe.getTracks().map(Ie=>({kind:Ie.kind,enabled:Ie.enabled,state:Ie.readyState}))}),ee.current){console.log(`
👤 OFFERER localStream:`,ee.current);const Ie=ee.current.getTracks();console.log("👤 OFFERER: All available tracks:",Ie),console.log("📹 OFFERER tracks detail:",Ie.map(Ue=>({kind:Ue.kind,id:Ue.id,enabled:Ue.enabled,state:Ue.readyState})));const Vt=fe.getSenders();if(console.log("📤 OFFERER: Existing senders count:",Vt.length),Vt.length>0)console.warn("⚠️ OFFERER WARNING: Tracks already added! Senders:",Vt.map(Ue=>{var je,mt;return{kind:(je=Ue.track)==null?void 0:je.kind,id:(mt=Ue.track)==null?void 0:mt.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 OFFERER: Adding ${Ie.length} local tracks to peer connection`),Ie.forEach((je,mt)=>{console.log(`  [${mt}] Adding ${je.kind} track (id: ${je.id}, enabled: ${je.enabled})`);try{const Ut=fe.addTrack(je,ee.current);console.log(`  [${mt}] ✅ addTrack succeeded, sender:`,Ut)}catch(Ut){console.error(`  [${mt}] ❌ addTrack failed:`,Ut)}}),console.log(`
✅ OFFERER: All tracks added to peer connection`);const Ue=fe.getSenders();console.log("📤 OFFERER senders count:",Ue.length),console.log("📤 OFFERER senders after addTrack:",Ue.map((je,mt)=>{var Ut,ls,gn;return{index:mt,kind:(Ut=je.track)==null?void 0:Ut.kind,id:(ls=je.track)==null?void 0:ls.id,trackExists:!!je.track,trackEnabled:(gn=je.track)==null?void 0:gn.enabled}})),console.log("🚀 OFFERER: Ready to send offer with",Ie.length,`tracks
`)}}else console.error("❌ OFFERER: No local stream available - TRACKS WILL NOT BE SENT!"),console.error("❌ OFFERER: localStreamRef.current is:",ee.current);console.log(`
📋 ===== OFFERER CREATING AND SENDING OFFER =====`),console.log("🎬 OFFERER: Creating WebRTC offer with offerToReceiveVideo/Audio");const ut=await fe.createOffer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ OFFERER: Offer created with receive constraints:",ut),console.log("📋 OFFERER SDP CHECK - Looking for a=sendrecv:");const ot=ut.sdp.split(`
`).filter(Ie=>Ie.includes("sendrecv")||Ie.includes("recvonly")||Ie.includes("sendonly"));console.log("   Media direction lines:"),ot.forEach(Ie=>console.log("   ",Ie)),console.log("🔄 OFFERER: Setting local description (offer)"),await fe.setLocalDescription(ut),console.log("✅ OFFERER: Local description set"),console.log(`
📤 OFFERER: Sending offer with tracks:`,fe.getSenders().map(Ie=>{var Vt,Ue,je;return{kind:(Vt=Ie.track)==null?void 0:Vt.kind,id:(Ue=Ie.track)==null?void 0:Ue.id,enabled:(je=Ie.track)==null?void 0:je.enabled}})),console.log("📤 OFFERER: Partner socket ID from data:",R.socketId),console.log("📤 OFFERER: partnerSocketIdRef.current value:",it.current),console.log("🔌🔌🔌 CRITICAL: About to emit webrtc_offer with to:",R.socketId),console.log("🔌🔌🔌 CRITICAL: Is to value empty/null/undefined?",!R.socketId),K.emit("webrtc_offer",{offer:z.current.localDescription,to:R.socketId}),console.log("✅ OFFERER: webrtc_offer emitted successfully"),console.log("✅ OFFERER: webrtc_offer sent to socket ID:",R.socketId),console.log("✅ OFFERER: webrtc_offer contains",z.current.getSenders().length,"senders"),console.log("✅ OFFERER: Sent to socket:",R.socketId)}catch(fe){console.error("❌ OFFERER: Error in partner_found handler:",fe),console.error("❌ OFFERER: Stack trace:",fe.stack)}}),K.on("webrtc_offer",async R=>{console.log(`

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`),console.log("🎉🎉🎉 ⭐️ ANSWERER HANDLER FIRED ⭐️ 🎉🎉🎉"),console.log("🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"),console.log("📋 ===== ANSWERER RECEIVED OFFER ====="),console.log("⭐️ ANSWERER: WEBRTC_OFFER EVENT FIRED - OFFER WAS RECEIVED"),console.log("📨 ANSWERER: Received WebRTC offer from offerer"),console.log("📨 ANSWERER: My socket ID:",K.id),console.log("📨 ANSWERER: Offer from:",R.from),console.log("📨 ANSWERER: Full data:",R),console.log("📨 ANSWERER: data.from (offerer socket ID):",R.from),it.current=R.from,console.log("🔌 CRITICAL: Stored offerer socket ID:",it.current);try{if(z.current)console.log("⚠️ ANSWERER: WARNING - peerConnectionRef already exists (should be null for answerer)");else{console.log("📍 ANSWERER: Creating new peer connection for the first time");let V;try{V=await en()}catch(le){console.error("❌ ANSWERER: Error creating peer connection:",le);return}z.current=V,console.log("✅ ANSWERER: Peer connection created")}if(console.log(`
🔍 ANSWERER: ALWAYS executing track addition logic`),console.log("👤 ANSWERER: Checking localStreamRef.current..."),console.log("👤 ANSWERER localStreamRef.current:",ee.current),console.log("👤 ANSWERER localStreamRef.current === null?",ee.current===null),console.log("👤 ANSWERER localStreamRef.current === undefined?",ee.current===void 0),!ee.current){console.warn("⚠️ ANSWERER: localStreamRef.current is NULL - attempting emergency reacquisition");try{const V=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480}},audio:!0});if(ee.current=V,ae.current){ae.current.srcObject=V,ae.current.muted=!0;try{await ae.current.play()}catch{console.warn("⚠️ Play error in answerer emergency reacquisition")}}console.log("✅ ANSWERER: Emergency stream acquisition successful")}catch(V){throw console.error("❌ ANSWERER: Emergency stream acquisition failed:",V.message),new Error("ANSWERER: Cannot reacquire camera stream - "+V.message)}}if(ee.current){console.log(`
✅ ANSWERER: localStream EXISTS - will add tracks`),console.log("📊 ANSWERER localStream object:",ee.current);const V=ee.current.getTracks();console.log("👤 ANSWERER: getAllTracks() returned:",V),console.log("👤 ANSWERER: Track array length:",V.length),V.length>0?console.log("👤 ANSWERER: Tracks detail:",V.map(pe=>({kind:pe.kind,id:pe.id,enabled:pe.enabled,readyState:pe.readyState}))):console.warn("⚠️ ANSWERER: WARNING - localStream exists but getTracks() returned empty array!");const le=z.current.getSenders();if(console.log("📤 ANSWERER: Existing senders count:",le.length),le.length>0)console.warn("⚠️ ANSWERER WARNING: Tracks already added! Senders:",le.map(pe=>{var ke,qe;return{kind:(ke=pe.track)==null?void 0:ke.kind,id:(qe=pe.track)==null?void 0:qe.id}})),console.warn("   Not adding tracks again to avoid duplicates");else{console.log(`
📹 ANSWERER: Attempting to add ${V.length} local tracks to peer connection`);let pe=0,ke=0;V.forEach((Ee,Pe)=>{console.log(`  [${Pe}] About to add ${Ee.kind} track (id: ${Ee.id}, enabled: ${Ee.enabled})`);try{const fe=z.current.addTrack(Ee,ee.current);console.log(`  [${Pe}] ✅ addTrack SUCCEEDED`),console.log(`  [${Pe}] Sender:`,fe),pe++}catch(fe){console.error(`  [${Pe}] ❌ addTrack FAILED`),console.error(`  [${Pe}] Error:`,fe.message),ke++}}),console.log(`
✅ ANSWERER: Track addition complete (${pe} succeeded, ${ke} failed)`);const qe=z.current.getSenders();console.log("📤 ANSWERER: Final senders count:",qe.length),console.log("📤 ANSWERER: Senders:",qe.map((Ee,Pe)=>{var fe,ut,ot;return{index:Pe,kind:(fe=Ee.track)==null?void 0:fe.kind,id:(ut=Ee.track)==null?void 0:ut.id,trackExists:!!Ee.track,trackEnabled:(ot=Ee.track)==null?void 0:ot.enabled}}))}}else throw console.error(`
❌ ANSWERER: CRITICAL ERROR - localStreamRef.current is NULL!`),console.error("❌ ANSWERER: Cannot add tracks - stream does not exist"),new Error("ANSWERER: No local stream - cannot add tracks");console.log(`
🔄 ANSWERER: Setting remote description (offer from offerer)`),await z.current.setRemoteDescription(new RTCSessionDescription(R.offer)),console.log("✅ ANSWERER: Remote description set successfully"),console.log("🎬 ANSWERER: Creating answer");const $=await z.current.createAnswer({offerToReceiveVideo:!0,offerToReceiveAudio:!0});console.log("✅ ANSWERER: Answer created with receive constraints"),console.log("📋 ANSWERER SDP CHECK - Looking for a=sendrecv:");const M=$.sdp.split(`
`).filter(V=>V.includes("sendrecv")||V.includes("recvonly")||V.includes("sendonly"));console.log("   Media direction lines:"),M.forEach(V=>console.log("   ",V)),console.log("🔄 ANSWERER: Setting local description (answer)"),await z.current.setLocalDescription($),console.log("✅ ANSWERER: Local description set successfully"),console.log(`
📋 ===== ANSWERER SENDING ANSWER =====`);const J=z.current.getSenders();console.log("📤 ANSWERER: Final senders count:",J.length),console.log("📤 ANSWERER: Sending answer with tracks:",J.map(V=>{var le,pe,ke;return{kind:(le=V.track)==null?void 0:le.kind,id:(pe=V.track)==null?void 0:pe.id,enabled:(ke=V.track)==null?void 0:ke.enabled}})),console.log("🔌 CRITICAL: Offerer socket ID from offer:",R.from),console.log("🔌 SERVER sending ANSWER to:",R.from),K.emit("webrtc_answer",{answer:z.current.localDescription,to:R.from}),console.log("📤 ANSWERER: Answer emitted to offerer via socket:",R.from),console.log(`📋 ===== ANSWERER ANSWER SENT =====

`)}catch($){console.error(`
❌ ANSWERER: ERROR in webrtc_offer handler:`,$),console.error("❌ ANSWERER: Error message:",$.message),console.error("❌ ANSWERER: Stack trace:",$.stack)}}),K.on("webrtc_answer",async R=>{console.log(`

📋 ===== OFFERER RECEIVED ANSWER =====`),console.log("📨 OFFERER: Received WebRTC answer from answerer"),console.log("📨 OFFERER: data.from (answerer socket ID):",R.from),console.log("📨 OFFERER: Answer SDP:",R.answer),it.current=R.from,console.log("🔌 CRITICAL: Stored answerer socket ID:",it.current);try{if(!z.current){console.error("❌ OFFERER: No peer connection available to handle answer");return}console.log(`
🔄 OFFERER: Setting remote description (answer from answerer)`),console.log("📊 OFFERER: Current connection state before answer:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState}),await z.current.setRemoteDescription(new RTCSessionDescription(R.answer)),console.log("✅ OFFERER: Remote description (answer) set successfully"),console.log("📊 OFFERER: Connection state after answer:",{connectionState:z.current.connectionState,iceConnectionState:z.current.iceConnectionState,signalingState:z.current.signalingState}),console.log(`📋 ===== OFFERER ANSWER RECEIVED AND SET =====

`)}catch($){console.error("❌ OFFERER: Error handling answer:",$),console.error("❌ OFFERER: Stack trace:",$.stack)}}),K.on("ice_candidate",async R=>{if(console.log(`
🧊 ICE candidate received from peer:`,{candidate:R.candidate,sdpMLineIndex:R.sdpMLineIndex,sdpMid:R.sdpMid}),!R.candidate||R.candidate.sdpMid==null&&R.candidate.sdpMLineIndex==null){console.warn("⚠️ Ignoring invalid ICE candidate (empty sdpMid and sdpMLineIndex)");return}try{z.current?(console.log("🧊 Adding ICE candidate to peer connection"),await z.current.addIceCandidate(new RTCIceCandidate(R.candidate)),console.log(`✅ ICE candidate added successfully
`)):console.warn("⚠️ No peer connection available for ICE candidate")}catch($){console.error("❌ Error adding ICE candidate:",$)}}),K.on("partner_disconnected",R=>{console.log(`

🔴🔴🔴🔴🔴 ===== PARTNER DISCONNECTED EVENT RECEIVED ===== 🔴🔴🔴🔴🔴`),console.log("🔴 Event Data:",R),console.log("🔴 Timestamp:",new Date().toISOString()),console.log("🔴 Partner has closed the browser/tab"),console.log("🔴 Cleaning up WebRTC connection..."),z.current?(console.log("🔴 Closing peer connection"),console.log("   Current state:",z.current.connectionState),z.current.close(),z.current=null,console.log("🔴 Peer connection closed successfully")):console.log("🔴 WARNING: peerConnectionRef.current was null"),ct.current&&(console.log("🔴 Clearing remote video ref"),ct.current.srcObject=null),console.log("🔴 Calling endChat() to reset UI"),is(),console.log("🔴🔴🔴 Cleanup complete - ready for new partner")}),K.on("disconnect",()=>{console.log("Socket disconnected"),Fn()}),console.log(`

🔌 ===== ALL SOCKET LISTENERS REGISTERED =====`),console.log("🔌 ✅ partner_found listener active"),console.log("🔌 ✅ webrtc_offer listener active"),console.log("🔌 ✅ webrtc_answer listener active"),console.log("🔌 ✅ ice_candidate listener active"),console.log("🔌 ✅ partner_disconnected listener active (CRITICAL FOR DISCONNECT)"),console.log("🔌 ✅ disconnect listener active"),console.log(`🔌 Ready to receive WebRTC signaling messages

`),()=>{console.log("🧹 Removing socket listeners on component unmount"),K.off("partner_found"),K.off("webrtc_offer"),K.off("webrtc_answer"),K.off("ice_candidate"),K.off("partner_disconnected"),K.off("disconnect")}),[]),T.useEffect(()=>{const R=G,$=U;return()=>{console.log(`

🧹 🧹 🧹 CHAT COMPONENT UNMOUNTING - CRITICAL CLEANUP 🧹 🧹 🧹`),R&&!$&&(console.log("🧹 User was still looking for partner - emitting cancel_matching"),K.emit("cancel_matching",{userId:he.current,timestamp:new Date().toISOString()})),z.current&&(console.log("🧹 Closing peer connection"),z.current.close(),z.current=null),console.log("✅ Chat component cleanup complete (tracks NOT stopped - will be reused)")}},[]),T.useEffect(()=>()=>{console.log("🧹 Chat component unmounting - cleaning up peer connection only"),z.current&&(z.current.close(),z.current=null)},[]);const fr=async()=>{var R;try{console.log("🔄 Fetching TURN servers from Xirsys via backend API...");const M=await(await fetch("https://flinxx-backend.onrender.com/api/turn")).json();if(console.log("📡 Xirsys API Response:",M),(R=M==null?void 0:M.v)!=null&&R.iceServers&&Array.isArray(M.v.iceServers))return console.log("✅ TURN servers fetched from Xirsys API"),console.log("✅ iceServers is an array with",M.v.iceServers.length,"entries"),console.log("📋 ICE Servers:",M.v.iceServers),M.v.iceServers;throw console.warn("⚠️ Invalid Xirsys TURN response format"),console.log("   Expected: data.v.iceServers as array"),console.log("   Received:",M),new Error("Invalid Xirsys TURN response format")}catch($){console.error("❌ Error fetching TURN servers from Xirsys:",$.message),console.log("🔄 Falling back to static STUN/TURN configuration");const M=CI();return console.log("📋 Using fallback ICE servers:",M),M}},pr=async()=>{if(console.log('🎬 [BUTTON CLICK] "Start Video Chat" button clicked'),console.log("🎬 [BUTTON CLICK] Current state - cameraStarted:",S,"isSearching:",w),S)S&&!w&&(console.log('🎬 [SEARCHING] User clicked "Start Video Chat" again - starting search'),console.log("🎬 [SEARCHING] ⚠️ NOT reinitializing camera - stream already active"),console.log("CLICKED Start Video Chat"),console.log("🎬 [STATE BEFORE] isSearching:",w,"partnerFound:",v),K.emit("start-search",{userId:he.current,userName:te.name||"Anonymous",userAge:te.age||18,userLocation:te.location||"Unknown",userPicture:te.picture||null}),console.log("🎬 [SEARCHING] ✅ start-search event emitted immediately"),b(!0),Z(!1),Mt(!0),console.log("🎬 [STATE AFTER] Calling setIsSearching(true)"),console.log("STATE AFTER START SEARCH:",{isStarting:!0,isSearching:!0,partnerFound:!1}));else{if(console.log("🎬 [BUTTON CLICK] First click - initializing camera"),console.log("🎬 [BUTTON CLICK] Checking if camera request already in progress..."),Tt){console.warn("⚠️ Camera request already in progress");return}try{Dt(!0),Mt(!0),console.log("🎬 [BUTTON CLICK] isRequestingCamera=true, isLoading=true, calling startCamera()..."),await ss(),console.log("🎬 [BUTTON CLICK] startCamera() completed successfully"),console.log("🎬 [START] Setting cameraStarted = true (camera preview now showing)"),k(!0),Dt(!1),Mt(!1),console.log("🎬 [START] ✅ Camera initialized - user is still on home screen, matching NOT started yet")}catch(R){console.error("❌ Error initializing camera:",R),Dt(!1),Mt(!1),R.name==="NotAllowedError"?console.warn("⚠️ Camera permission denied by user"):R.name==="NotFoundError"?console.warn("⚠️ No camera device found"):R.name==="NotReadableError"&&console.warn("⚠️ Camera device is already in use by another application")}}},Ft=T.useCallback(()=>{console.log("🛑 [CANCEL] User cancelled search"),console.log("STATE BEFORE CANCEL:",{isSearching:w,partnerFound:v}),K.emit("cancel-search",{userId:he.current}),b(!1),Z(!1),Mt(!1),console.log("STATE AFTER CANCEL:",{isSearching:!1,partnerFound:!1,isLoading:!1})},[]),is=()=>{B(!1),L(!1),m(null),ns([]),_(0),z.current&&(z.current.close(),z.current=null),K.emit("find_partner",{userId:he.current,userName:te.name||"Anonymous",userAge:te.age||18,userLocation:te.location||"Unknown"})},Fn=()=>{console.log("🧹 Cleaning up chat session"),z.current&&(z.current.close(),z.current=null),k(!1),B(!1),L(!1),ns([]),_(0)},os=()=>(console.log("Dashboard render"),l.jsxs("div",{className:"w-full h-[90vh] flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 relative z-10 p-4 sm:p-6 lg:p-8",children:[l.jsxs("aside",{className:"w-full lg:flex-1 h-full flex flex-col bg-refined border-2 border-primary rounded-3xl shadow-glow relative transition-all duration-300",children:[l.jsxs("div",{className:"icon-row p-6 sm:p-8",children:[l.jsx("button",{onClick:()=>et(!pt),className:"icon-btn",title:"Profile",children:a!=null&&a.picture?l.jsx("img",{src:a.picture,alt:"Profile",style:{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}):l.jsx("i",{className:"material-icons-round",children:"person"})}),l.jsx("button",{onClick:()=>Lt(We==="search"?null:"search"),className:"icon-btn",title:"Search",children:l.jsx("i",{className:"material-icons-round",children:"search"})}),l.jsx("button",{onClick:()=>Lt(We==="likes"?null:"likes"),className:"icon-btn",title:"Likes",children:l.jsx("i",{className:"material-icons-round",children:"favorite"})}),l.jsx("button",{onClick:()=>Lt(We==="messages"?null:"messages"),className:"icon-btn",title:"Messages",children:l.jsx("i",{className:"material-icons-round",children:"chat_bubble"})}),l.jsx("button",{onClick:()=>Lt(We==="trophy"?null:"trophy"),className:"icon-btn",title:"Achievements",children:l.jsx("i",{className:"material-icons-round",children:"emoji_events"})}),l.jsx("button",{onClick:()=>st(!Dn),className:"icon-btn",title:"History",children:l.jsx("i",{className:"material-icons-round",children:"timer"})})]}),l.jsxs("div",{className:"flex-1 flex flex-col items-center justify-start space-y-12 relative z-10 pt-8",children:[l.jsx("h1",{className:"font-display text-5xl sm:text-6xl font-bold text-primary tracking-tight drop-shadow-sm select-none",children:"Flinxx"}),l.jsxs("div",{className:"flex items-center gap-6",children:[l.jsx("button",{className:`px-8 py-3 rounded-xl font-semibold text-lg shadow-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${n==="solo"?"bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover":"border border-primary text-primary hover:bg-primary/10"}`,onClick:()=>e("solo"),children:"SoloX"}),l.jsx("button",{className:`px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${n==="duo"?"bg-primary text-black hover:shadow-glow-hover hover:bg-primary-hover shadow-glow":"border border-primary text-primary hover:bg-primary/10"}`,onClick:()=>{e("duo"),r()},children:"DuoX"})]}),l.jsxs("button",{onClick:pr,disabled:ar,className:"group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary via-[#E5C558] to-primary text-black font-bold text-lg shadow-lg hover:shadow-glow-hover transition-all transform hover:scale-105 overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed",children:[l.jsx("span",{className:"absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-full"}),l.jsxs("div",{className:"flex items-center justify-center gap-3 relative z-10",children:[l.jsx("span",{className:"text-2xl",children:"🎬"}),l.jsx("span",{children:ar?"Loading...":"Start Video Chat"})]})]})]}),l.jsx("div",{className:"w-full text-center py-4 z-10 mt-auto",children:l.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-600 font-medium",children:"Premium Video Experience"})})]}),l.jsx(DI,{})]})),mn=({onCancel:R})=>(T.useEffect(()=>{document.documentElement.classList.add("dark")},[]),l.jsxs(l.Fragment,{children:[l.jsx("style",{children:`
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
        `}),l.jsxs("main",{className:"flex-grow flex items-center justify-center p-4 md:p-8 relative w-full h-screen bg-black",children:[l.jsxs("div",{className:"absolute inset-0 z-0 overflow-hidden pointer-events-none",children:[l.jsx("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"}),l.jsx("div",{className:"absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]",style:{animation:"float 15s infinite linear"}}),l.jsx("div",{className:"absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-[90px]",style:{animation:"float 15s infinite linear",animationDelay:"-5s"}}),l.jsx("div",{className:"absolute top-1/3 right-1/3 w-40 h-40 bg-yellow-400/5 rounded-full blur-[60px]",style:{animation:"float 15s infinite linear",animationDelay:"-10s"}})]}),l.jsx("div",{className:"absolute inset-0 z-0 opacity-5 pointer-events-none",style:{backgroundImage:"radial-gradient(#333 1px, transparent 1px)",backgroundSize:"30px 30px"}}),l.jsxs("div",{className:"w-full max-w-7xl z-10 h-[85vh] flex flex-col md:flex-row gap-8 items-center",children:[l.jsx("div",{className:"w-full md:w-1/2 h-full flex flex-col relative group",children:l.jsxs("div",{className:"relative w-full h-full border-2 border-yellow-400/60 dark:border-yellow-400/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-yellow-400",children:[l.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-zinc-900/50",children:l.jsx("div",{className:"text-zinc-600 dark:text-zinc-700 flex flex-col items-center gap-2",children:l.jsx("span",{className:"material-icons-outlined text-6xl opacity-20",children:"videocam_off"})})}),l.jsx("div",{className:"absolute bottom-6 left-6",children:l.jsx("div",{className:"px-4 py-1.5 rounded-full border border-yellow-400/50 bg-black/60 text-yellow-400 text-sm font-medium backdrop-blur-sm shadow-lg",children:"You"})})]})}),l.jsx("div",{className:"w-full md:w-1/2 h-full flex flex-col relative group",children:l.jsxs("div",{className:"relative w-full h-full border-2 border-yellow-400/60 dark:border-yellow-400/80 rounded-3xl overflow-hidden bg-black shadow-2xl gold-glow transition-all duration-500 hover:border-yellow-400 flex flex-col items-center justify-center text-center space-y-8",children:[l.jsxs("div",{className:"relative mb-4",children:[l.jsx("div",{className:"absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse"}),l.jsx("div",{className:"search-icon-wrapper",children:l.jsx("div",{className:"text-6xl md:text-8xl filter drop-shadow-lg search-icon",children:"🔍"})})]}),l.jsxs("div",{className:"space-y-3",children:[l.jsx("h1",{className:"text-3xl md:text-4xl font-bold text-yellow-400 gold-text-glow tracking-tight",children:"Looking for a partner..."}),l.jsx("p",{className:"text-yellow-400/70 text-lg md:text-xl font-light",children:"Matching you with someone nearby"})]}),l.jsxs("div",{className:"loading-dots flex items-center justify-center space-x-3 py-4",children:[l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"}),l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"}),l.jsx("span",{className:"w-3 h-3 bg-yellow-400 rounded-full",children:"•"})]}),l.jsx("div",{className:"pt-8 w-full max-w-xs",children:l.jsxs("button",{onClick:()=>{console.log("🛑 [CANCEL] User clicked cancel - calling onCancel handler"),R&&R()},className:"w-full group relative px-8 py-3.5 bg-transparent overflow-hidden rounded-full border border-yellow-400/40 hover:border-yellow-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-black",children:[l.jsx("div",{className:"absolute inset-0 w-0 bg-yellow-400/10 transition-all duration-[250ms] ease-out group-hover:w-full"}),l.jsx("span",{className:"relative text-yellow-400/90 font-semibold tracking-wide group-hover:text-yellow-400",children:"Cancel Search"})]})}),l.jsx("div",{className:"absolute bottom-4 text-xs text-zinc-600 dark:text-zinc-700 max-w-md mx-auto",children:l.jsx("p",{children:"By connecting, you agree to our Terms of Service & Privacy Policy."})})]})})]})]})]})),as=()=>(console.log("🎬 VideoChatScreen rendering - partnerInfo:",{exists:!!I,userName:I==null?void 0:I.userName,userLocation:I==null?void 0:I.userLocation,picture:!!(I!=null&&I.picture),fullObject:I}),console.log("🎬 currentUser for comparison:",{name:te==null?void 0:te.name,location:te==null?void 0:te.location,picture:!!(te!=null&&te.picture)}),l.jsxs("div",{className:"dashboard",children:[l.jsxs("div",{className:"w-full max-w-5xl flex gap-6 flex-1",children:[l.jsx("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:l.jsxs("div",{id:"remote-video-wrapper",style:{position:"absolute",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",zIndex:1,overflow:"hidden",backgroundColor:"black",display:"flex",alignItems:"center",justifyContent:"center"},children:[l.jsx("video",{id:"remote-video-singleton",ref:ct,autoPlay:!0,playsInline:!0,muted:!0,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",backgroundColor:"black",display:U?"block":"none",zIndex:10}}),!U&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000000",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1},children:l.jsx("p",{style:{color:"#d9b85f",fontSize:"14px"},children:"Waiting for partner video..."})}),U&&l.jsxs("div",{className:"absolute top-4 left-4 flex items-center gap-3 z-50 backdrop-blur-sm px-3 py-2 rounded-xl",style:{backgroundColor:"rgba(0, 0, 0, 0.6)"},children:[l.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 overflow-hidden",children:I&&I.picture?l.jsx("img",{src:I.picture,alt:"Partner",className:"w-full h-full object-cover"}):"👤"}),l.jsxs("div",{className:"min-w-0",children:[l.jsx("p",{className:"font-semibold text-sm",style:{color:"#d9b85f"},children:I?I.userName:"Partner"}),l.jsx("p",{className:"text-xs",style:{color:"#d9b85f"},children:I?I.userLocation:"Online"})]})]}),de&&U&&l.jsxs("div",{className:"absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold z-50 shadow-lg px-3 py-2 rounded-full",style:{backgroundColor:"rgba(217, 184, 95, 0.9)",color:"#0f0f0f"},children:[l.jsx("span",{className:"w-2 h-2 rounded-full animate-pulse",style:{backgroundColor:"#0f0f0f"}}),SI(g)]})]})}),l.jsxs("div",{className:"flex-1 rounded-2xl shadow-2xl overflow-hidden relative",style:{backgroundColor:"#000",border:"1px solid #d9b85f",minHeight:"400px",aspectRatio:"16/9"},children:[!Ln&&l.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#000",display:"flex",alignItems:"center",justifyContent:"center",color:"#666",fontSize:"12px",zIndex:0},children:"Camera loading..."}),l.jsx("div",{className:"you-badge",style:{zIndex:2},children:"You"})]})]}),l.jsxs("div",{className:"w-full max-w-5xl flex items-center justify-center gap-4 pb-4",style:{backgroundColor:"transparent"},children:[l.jsx("button",{onClick:()=>{console.log("Skip pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:R=>{R.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:R=>{R.currentTarget.style.boxShadow="none"},children:"⏭ Skip"}),l.jsx("button",{onClick:()=>{console.log("Next pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:R=>{R.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:R=>{R.currentTarget.style.boxShadow="none"},children:"⏭ Next"}),l.jsx("button",{onClick:()=>{console.log("Report pressed")},className:"px-6 py-3 rounded-xl font-bold transition-all text-sm",style:{backgroundColor:"transparent",border:"1px solid #d9b85f",color:"#d9b85f",cursor:"pointer"},onMouseEnter:R=>{R.currentTarget.style.boxShadow="0 0 20px rgba(217, 184, 95, 0.3)"},onMouseLeave:R=>{R.currentTarget.style.boxShadow="none"},children:"⚠️ Report"})]})]}));return l.jsxs(l.Fragment,{children:[console.log("🎨 [RENDER] UI STATE →",{isSearching:w,partnerFound:v},"Should show:",w&&!v?"WAITING SCREEN":v?"VIDEO CHAT":"DASHBOARD"),!w&&!v&&l.jsxs(l.Fragment,{children:[console.log("🎨 [RENDER] Showing DASHBOARD"),l.jsx(os,{})]}),w&&!v&&l.jsxs(l.Fragment,{children:[console.log("🎨 [RENDER] Showing WAITING SCREEN"),l.jsx(mn,{text:"Looking for a partner...",onCancel:Ft})]}),v&&l.jsx(as,{}),!(w&&!v)&&l.jsxs(l.Fragment,{children:[u&&l.jsx(nd,{onCancel:hr,onContinue:Ci}),f?l.jsxs("div",{className:"flex flex-col h-screen w-screen overflow-visible min-h-0",style:{backgroundColor:"#0f0f0f",overflow:"visible",position:"relative"},children:[l.jsx(RI,{isOpen:_e,onClose:()=>X(!1)}),l.jsx(NI,{isOpen:ye,onClose:()=>De(!1),currentGender:Le,onOpenPremium:()=>X(!0)}),l.jsx(kI,{isOpen:pt,onClose:()=>et(!1),onOpenPremium:()=>X(!0),onReinitializeCamera:async()=>{var R;return(R=pn.current)!=null&&R.reinitializeCamera?await pn.current.reinitializeCamera():!1}}),l.jsx(PI,{isOpen:Dn,onClose:()=>st(!1)}),l.jsx(jI,{isOpen:We!==null&&We!=="trophy",onClose:()=>Lt(null),mode:We==="profile"?"profile":We==="search"?"search":We==="likes"?"likes":We==="messages"?"message":We==="timer"?"timer":"notifications",onUserSelect:R=>{console.log("Selected user from search:",R)}}),We==="trophy"&&l.jsx(OI,{onClose:()=>Lt(null)}),ur&&l.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:l.jsxs("div",{className:"bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl",children:[l.jsx("h3",{className:"text-2xl font-bold text-white mb-4 text-center",children:"⏱️ Time's Up!"}),l.jsx("p",{className:"text-white/90 text-center mb-4",children:"Your 2-minute guest preview has ended. Redirecting to login..."}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsx("div",{className:"animate-spin text-4xl",children:"⟳"})})]})})]}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsx("div",{className:"text-center text-white",children:l.jsx("p",{children:"Loading..."})})})]})]})},MI=()=>{const n=ft(),[e,t]=T.useState(5),[r,s]=T.useState(!0),[o,a]=T.useState([{id:1,username:"Alex_24",name:"Alex",age:24,country:"USA",avatar:"👨",status:"Online"},{id:2,username:"Jordan_22",name:"Jordan",age:22,country:"UK",avatar:"👩",status:"Online"},{id:3,username:"Casey_25",name:"Casey",age:25,country:"Canada",avatar:"🧑",status:"Online"},{id:4,username:"Morgan_23",name:"Morgan",age:23,country:"Australia",avatar:"👩‍🦱",status:"Online"},{id:5,username:"Taylor_26",name:"Taylor",age:26,country:"Germany",avatar:"👨‍🦲",status:"Online"},{id:6,username:"Alex_27",name:"Alex",age:27,country:"France",avatar:"👨",status:"Online"},{id:7,username:"Sam_21",name:"Sam",age:21,country:"Canada",avatar:"👩",status:"Online"},{id:8,username:"Chris_28",name:"Chris",age:28,country:"Japan",avatar:"👨‍🦱",status:"Online"}]),[u,h]=T.useState(0),f=T.useRef(null);T.useEffect(()=>(r&&e>0?f.current=setTimeout(()=>{t(S=>S-1)},1e3):r&&e===0&&(y(),t(5)),()=>clearTimeout(f.current)),[e,r]);const y=()=>{u<o.length-1?(h(S=>S+1),t(5),s(!0)):(h(0),t(5),s(!0))},E=()=>{y()},x=()=>{K.emit("connect_user",{targetUserId:o[u].id}),n("/chat")},C=o[u],P=o[(u+1)%o.length];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex flex-col",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:Ti,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-8",children:l.jsxs("div",{className:"w-full max-w-md",children:[l.jsxs("div",{className:"relative h-[600px] mb-8",children:[l.jsx("div",{className:"absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 transform scale-95 translate-y-4 opacity-50",children:l.jsxs("div",{className:"h-full flex flex-col justify-between",children:[l.jsxs("div",{children:[l.jsxs("h3",{className:"text-white font-bold text-xl mb-2",children:[P.name,", ",P.age]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["📍 ",P.country]})]}),l.jsx("div",{className:"text-center opacity-50",children:l.jsx("p",{className:"text-white/50 text-sm",children:"Next up..."})})]})}),l.jsxs("div",{className:"absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md rounded-3xl border-2 border-white/30 p-8 flex flex-col justify-between shadow-2xl hover:border-white/50 transition-all duration-300",children:[l.jsx("div",{className:"flex justify-center mb-6",children:l.jsx("div",{className:"w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-blue-600/50 border-4 border-white/40 text-white",children:C.avatar})}),l.jsxs("div",{children:[l.jsx("h2",{className:"text-white font-black text-3xl mb-1",children:C.name}),l.jsx("p",{className:"text-white/90 text-2xl font-bold mb-2",children:C.age}),l.jsxs("p",{className:"text-white/80 text-base mb-2",children:["📍 ",C.country]}),l.jsxs("p",{className:"text-white/70 text-sm mb-6",children:["@",C.username]}),l.jsx("div",{className:"space-y-3",children:l.jsxs("div",{className:"bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20",children:[l.jsx("p",{className:"text-white/70 text-xs",children:"Status"}),l.jsxs("p",{className:"text-white font-bold text-sm",children:["🟢 ",C.status]})]})})]}),l.jsx("div",{className:"flex items-center justify-center",children:l.jsxs("div",{className:"relative w-20 h-20",children:[l.jsxs("svg",{className:"w-20 h-20 transform -rotate-90",children:[l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"white",strokeWidth:"2",opacity:"0.2"}),l.jsx("circle",{cx:"40",cy:"40",r:"36",fill:"none",stroke:"url(#gradient)",strokeWidth:"2",strokeDasharray:`${(5-e)/5*226.2} 226.2`,className:"transition-all duration-1000"}),l.jsx("defs",{children:l.jsxs("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[l.jsx("stop",{offset:"0%",stopColor:"#fbbf24"}),l.jsx("stop",{offset:"100%",stopColor:"#f59e0b"})]})})]}),l.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:l.jsx("span",{className:"text-white font-black text-2xl",children:e})})]})}),r&&l.jsx("div",{className:"text-center",children:l.jsxs("p",{className:"text-blue-400 text-sm font-semibold animate-pulse",children:["⚡ Auto-next in ",e,"s"]})})]})]}),l.jsxs("div",{className:"flex gap-4 justify-center",children:[l.jsx("button",{onClick:E,className:"flex-1 px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 rounded-full font-bold text-white transition-all transform hover:scale-105 backdrop-blur",children:"👉 Skip"}),l.jsx("button",{onClick:x,className:"flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xl shadow-blue-600/30 transition-all transform hover:scale-105",children:"💬 Connect"})]}),l.jsx("div",{className:"mt-6 flex justify-center",children:l.jsx("button",{onClick:()=>s(!r),className:`px-6 py-2 rounded-full font-semibold text-sm transition-all ${r?"bg-blue-600/30 text-blue-200 border border-blue-400/50":"bg-white/10 text-white/70 border border-white/20"}`,children:r?"⚡ Auto-Next ON":"⏸️ Auto-Next OFF"})}),l.jsx("div",{className:"mt-4 text-center",children:l.jsxs("p",{className:"text-white/70 text-sm",children:["Showing ",u+1," of ",o.length," profiles"]})})]})})]})},FI=()=>{const n=ft(),{user:e}=T.useContext(Ot)||{},r=(localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null)||e||{name:"Guest User",email:"guest@flinxx.local",picture:null,googleId:"N/A"};console.log("👤 Profile Component - Loaded User:",r);const[s,o]=T.useState({username:(r==null?void 0:r.name)||"User",age:(r==null?void 0:r.age)||24,country:(r==null?void 0:r.location)||"Unknown",bio:"Welcome to my profile",avatar:"👨",gender:"Not specified",status:"Looking to chat",email:(r==null?void 0:r.email)||"",displayName:(r==null?void 0:r.name)||"",photoURL:(r==null?void 0:r.picture)||"",userId:(r==null?void 0:r.userId)||"N/A"}),[a,u]=T.useState(!0);T.useEffect(()=>{(async()=>{try{if(!(r!=null&&r.email)){console.log("⚠️ No user email found, using localStorage data only"),console.log("📋 Profile from localStorage:",{name:r==null?void 0:r.name,email:r==null?void 0:r.email,picture:r==null?void 0:r.picture,googleId:r==null?void 0:r.googleId}),u(!1);return}const k="https://flinxx-backend.onrender.com";console.log(`📋 Profile Component - Fetching from: ${k}/api/user/profile?email=${r.email}`);const G=await fetch(`${k}/api/user/profile?email=${encodeURIComponent(r.email)}`,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!G.ok)throw new Error(`Failed to fetch profile: ${G.status}`);const H=await G.json();console.log("✅ Profile data fetched from backend:",H.profile),H.profile?o(U=>({...U,email:H.profile.email||r.email||U.email,displayName:H.profile.name||r.name||U.displayName,photoURL:H.profile.picture||r.picture||U.photoURL,userId:H.profile.id||U.userId})):o(U=>({...U,email:r.email||U.email,displayName:r.name||U.displayName,photoURL:r.picture||U.photoURL,userId:r.userId||U.userId}))}catch(k){console.error("❌ Error fetching profile:",k),o(G=>({...G,email:r.email||G.email,displayName:r.name||G.displayName,photoURL:r.picture||G.photoURL,userId:r.userId||G.userId}))}finally{u(!1)}})()},[r==null?void 0:r.email]);const[h,f]=T.useState(!1),[y,E]=T.useState(s),x=S=>{const{name:k,value:G}=S.target;E(H=>({...H,[k]:k==="age"?parseInt(G):G}))},C=()=>{o(y),f(!1),console.log("Profile saved:",y)},P=["👨","👩","👦","👧","🧑","👨‍🦱","👩‍🦱","👨‍🦲","👩‍🦲"];return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsxs("div",{className:"px-6 py-6 flex justify-between items-center",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:Ti,alt:"Flinxx",className:"w-8 h-8"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]}),l.jsx("div",{className:"flex items-center gap-4",children:l.jsx("button",{onClick:()=>n("/"),className:"text-white font-semibold hover:text-white/80 transition",children:"← Back"})})]})}),l.jsx("div",{className:"flex-1 px-4 py-12",children:l.jsxs("div",{className:"max-w-2xl mx-auto",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8",children:[l.jsxs("div",{className:"flex flex-col items-center mb-8",children:[s.photoURL&&!h?l.jsx("div",{className:"w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/50 mb-6 border-4 border-white/30 overflow-hidden",children:l.jsx("img",{src:s.photoURL,alt:"Profile",className:"w-full h-full object-cover"})}):l.jsx("div",{className:"w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-7xl shadow-2xl shadow-blue-600/50 mb-6 border-4 border-white/30",children:h?l.jsx("div",{className:"grid grid-cols-3 gap-2 p-4",children:P.map(S=>l.jsx("button",{onClick:()=>E(k=>({...k,avatar:S})),className:`text-3xl p-2 rounded-lg transition-all ${y.avatar===S?"bg-white/30 border-2 border-white scale-110":"bg-white/10 hover:bg-white/20"}`,children:S},S))}):s.avatar}),!h&&l.jsx("p",{className:"text-white/70 text-sm",children:"Click Edit to change avatar"})]}),h?l.jsxs("div",{className:"space-y-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("input",{type:"text",name:"displayName",value:y.displayName,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your full name"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("input",{type:"email",name:"email",value:y.email,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60",placeholder:"Enter your email"})]}),y.userId&&y.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID (Read-only)"}),l.jsx("input",{type:"text",value:y.userId,disabled:!0,className:"w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("input",{type:"text",name:"username",value:y.username,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsx("input",{type:"number",name:"age",value:y.age,onChange:x,min:"18",max:"100",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsx("input",{type:"text",name:"country",value:y.country,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsxs("select",{name:"gender",value:y.gender,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Male",children:"Male"}),l.jsx("option",{value:"Female",children:"Female"}),l.jsx("option",{value:"Other",children:"Other"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("textarea",{name:"bio",value:y.bio,onChange:x,rows:"4",className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("select",{name:"status",value:y.status,onChange:x,className:"w-full mt-2 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/60",children:[l.jsx("option",{value:"Looking to chat",children:"Looking to chat"}),l.jsx("option",{value:"Making friends",children:"Making friends"}),l.jsx("option",{value:"Just browsing",children:"Just browsing"})]})]}),l.jsxs("div",{className:"flex gap-4 pt-6",children:[l.jsx("button",{onClick:()=>{f(!1),E(s)},className:"flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all",children:"Cancel"}),l.jsx("button",{onClick:C,className:"flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"Save Profile"})]})]}):l.jsxs("div",{className:"space-y-6",children:[s.displayName&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Full Name"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.displayName})]}),s.email&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Email"}),l.jsx("p",{className:"text-white font-normal text-base mt-2",children:s.email})]}),s.userId&&s.userId!=="N/A"&&l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"User ID"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("p",{className:"text-white font-mono text-sm",children:s.userId}),l.jsx("button",{onClick:()=>navigator.clipboard.writeText(s.userId),className:"text-white/70 hover:text-white transition",title:"Copy ID",children:"📋"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Username"}),l.jsx("p",{className:"text-white font-bold text-2xl mt-2",children:s.username})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Age"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:[s.age," years old"]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Country"}),l.jsxs("p",{className:"text-white font-bold text-xl mt-2",children:["🌍 ",s.country]})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Gender"}),l.jsx("p",{className:"text-white font-bold text-lg mt-2",children:s.gender})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Bio"}),l.jsx("p",{className:"text-white/90 text-base mt-2",children:s.bio})]}),l.jsxs("div",{children:[l.jsx("label",{className:"text-white/70 text-sm font-semibold",children:"Status"}),l.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[l.jsx("span",{className:"w-3 h-3 bg-green-400 rounded-full animate-pulse"}),l.jsx("p",{className:"text-white font-semibold",children:s.status})]})]}),l.jsx("button",{onClick:()=>f(!0),className:"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105",children:"✏️ Edit Profile"})]})]}),l.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Matches"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"24"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Chats"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"8"})]}),l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center",children:[l.jsx("p",{className:"text-white/70 text-sm mb-2",children:"Time Online"}),l.jsx("p",{className:"text-white font-black text-3xl",children:"42h"})]})]})]})})]})},VI=({value:n,onChange:e,maxDate:t})=>{const r=t?`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`:null;return l.jsx("input",{type:"date",value:n||"",onChange:s=>e(s.target.value),max:r,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900",placeholder:"",required:!0})},od=({user:n,onProfileComplete:e,isOpen:t})=>{const[r,s]=T.useState(""),[o,a]=T.useState(""),[u,h]=T.useState(null),[f,y]=T.useState(null),[E,x]=T.useState(!1),C=ft();T.useEffect(()=>{if(r){const[k,G,H]=r.split("-").map(Number),U=new Date(k,G-1,H),B=new Date;let de=B.getFullYear()-U.getFullYear();const L=B.getMonth()-U.getMonth();(L<0||L===0&&B.getDate()<U.getDate())&&de--,h(de)}else h(null)},[r]);const P=!r||!o||E,S=async k=>{if(k.preventDefault(),!r||!o){y("Please fill in all required fields");return}if(u&&u<18){y("You must be 18+ to use this app");return}x(!0),y(null);try{const G="https://flinxx-backend.onrender.com",H=n.uuid||n.id||n.uid||n.googleId;if(!H)throw new Error("Unable to determine user ID");const U=await fetch(`${G}/api/users/complete-profile`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:H,birthday:r||null,gender:o})}),B=await U.json();if(!U.ok){if(B.code==="UNDERAGE_USER"){y("You must be 18+ to use this app");return}y(B.error||"Failed to save profile");return}console.log("✅ Profile saved successfully:",B);const de={...n,profileCompleted:!0,isProfileCompleted:!0,birthday:r,gender:o,age:u};localStorage.setItem("profileCompleted","true"),localStorage.setItem("user",JSON.stringify(de)),e&&e(de),setTimeout(()=>{C("/chat?view=home")},500)}catch(G){console.error("❌ Error saving profile:",G),y(G.message||"Network error. Please try again.")}finally{x(!1)}};return!t||!n?null:l.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto",children:l.jsx("div",{className:"bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 my-8",children:l.jsxs("div",{className:"p-8",children:[l.jsxs("div",{className:"text-center mb-6",children:[l.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Complete Your Profile"}),l.jsx("p",{className:"text-gray-600 text-sm",children:"Just a few more details to get started"})]}),l.jsx("div",{className:"flex justify-center mb-6",children:n.picture||n.photoURL?l.jsx("img",{src:n.picture||n.photoURL,alt:n.name||n.displayName,className:"w-20 h-20 rounded-full object-cover border-4 border-blue-500"}):l.jsx("div",{className:"w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500",children:l.jsx("span",{className:"text-gray-600 text-2xl",children:"👤"})})}),f&&l.jsx("div",{className:"mb-4 p-3 bg-red-50 border border-red-200 rounded-lg",children:l.jsx("p",{className:"text-red-700 text-sm font-medium",children:f})}),l.jsxs("form",{onSubmit:S,className:"space-y-4",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Name"}),l.jsx("input",{type:"text",value:n.name||n.displayName||"",disabled:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Birthday ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsx(VI,{value:r,onChange:s,maxDate:new Date}),u!==null&&l.jsxs("p",{className:"text-xs text-gray-600 mt-1",children:["Age: ",l.jsxs("span",{className:u<18?"text-red-600 font-bold":"text-green-600 font-bold",children:[u," years old"]})]})]}),l.jsxs("div",{children:[l.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:["Gender ",l.jsx("span",{className:"text-red-500",children:"*"})]}),l.jsxs("select",{value:o,onChange:k=>a(k.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 appearance-none cursor-pointer",style:{backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 0.75rem center",backgroundSize:"1.5em 1.5em",paddingRight:"2.5rem"},required:!0,children:[l.jsx("option",{value:"",disabled:!0,children:"Select gender"}),l.jsx("option",{value:"male",children:"Male"}),l.jsx("option",{value:"female",children:"Female"})]})]}),l.jsx("button",{type:"submit",disabled:P,className:`w-full py-3 px-4 rounded-lg font-medium transition mt-6 ${P?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"}`,children:E?l.jsxs("span",{className:"flex items-center justify-center",children:[l.jsx("span",{className:"inline-block animate-spin mr-2",children:"⏳"}),"Saving..."]}):"Save Profile"})]}),l.jsx("p",{className:"text-xs text-gray-500 text-center mt-4",children:"Your birthday and gender cannot be changed after saving."})]})})})};function UI(){const n=ft(),[e]=yc(),[t,r]=T.useState(!1),[s,o]=T.useState(null);T.useEffect(()=>{try{const u=e.get("token"),h=e.get("data"),f=e.get("error");if(console.log("🔐 Callback - Token:",u),console.log("📦 Callback - Data:",h),f){console.error("❌ OAuth Error:",f),n("/login?error="+encodeURIComponent(f),{replace:!0});return}if(u&&h)try{const E=JSON.parse(decodeURIComponent(h)).user;console.log("✅ User data extracted:",E),localStorage.setItem("token",u),localStorage.setItem("authToken",u),localStorage.setItem("user",JSON.stringify(E)),localStorage.setItem("authProvider","google"),localStorage.setItem("userInfo",JSON.stringify(E)),console.log("✅ User data saved:",E),E.profileCompleted?(console.log("✅ Profile completed, redirecting to chat..."),setTimeout(()=>{n("/chat")},500)):(console.log("ℹ️ Profile not completed, showing setup modal"),o(E),r(!0))}catch(y){console.error("❌ Error parsing response data:",y),n("/login?error=invalid_user_data",{replace:!0})}else console.error("❌ Missing token or data"),n("/login?error=missing_data",{replace:!0})}catch(u){console.error("❌ Callback error:",u),n("/login?error="+encodeURIComponent(u.message),{replace:!0})}},[e,n]);const a=u=>{console.log("✅ Profile completed, redirecting to chat"),r(!1),setTimeout(()=>{n("/chat")},500)};return t&&s?l.jsx(od,{user:s,onProfileComplete:a,isOpen:!0}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}function BI(){const n=ft(),{setAuthToken:e}=T.useContext(Ot)||{},[t]=yc(),[r,s]=T.useState(null),[o,a]=T.useState(!0),[u,h]=T.useState(null);return T.useEffect(()=>{(async()=>{var y,E,x;try{const C=t.get("token"),P=t.get("data");if(!C){h("No authentication token received"),a(!1);return}console.log("🔐 Auth Success - Token received:",C.substring(0,10)+"...");let S=null;if(P)try{S=JSON.parse(decodeURIComponent(P)),console.log("✅ Response data from backend:",S)}catch(B){console.warn("⚠️ Could not parse response data:",B)}const k=JSON.parse(atob(C)),H=await fetch(`https://flinxx-backend.onrender.com/auth-success?token=${C}`);if(!H.ok)throw new Error(`Failed to fetch user data: ${H.statusText}`);const U=await H.json();if(console.log("✅ User data received:",U.user.email),U.success&&U.user){const B=U.user;let de=null;if(B.uuid&&typeof B.uuid=="string"&&B.uuid.length===36)de=B.uuid,console.log("✅ Valid UUID found in user.uuid:",de.substring(0,8)+"...");else if(B.id&&typeof B.id=="string"&&B.id.length===36)de=B.id,console.log("✅ Valid UUID found in user.id (fallback):",de.substring(0,8)+"...");else{console.error("❌ CRITICAL: No valid 36-char UUID found in backend response"),console.error("   user.uuid:",B.uuid,"(type:",typeof B.uuid+", length:",((y=B.uuid)==null?void 0:y.length)+")"),console.error("   user.id:",B.id,"(type:",typeof B.id+", length:",((E=B.id)==null?void 0:E.length)+")"),console.error("   Full response:",B),h("Authentication failed: Invalid UUID from server"),a(!1);return}const L={uuid:de,name:B.name||B.display_name||"User",email:B.email,picture:B.picture||B.photo_url,profileCompleted:B.profileCompleted||!1};console.log("✅ User data normalized for storage (UUID ONLY):",{uuid:L.uuid.substring(0,8)+"...",email:L.email}),e?(console.log("[AuthSuccess] Storing token and user via AuthContext"),e(C,L)):(console.log("[AuthSuccess] AuthContext not available, saving to localStorage directly"),localStorage.setItem("token",C),localStorage.setItem("authToken",C),localStorage.setItem("user",JSON.stringify(L)),localStorage.setItem("authProvider","google"));const I=JSON.parse(localStorage.getItem("user")||"{}");console.log("✅ VERIFICATION - localStorage.user contents:",{has_uuid:!!I.uuid,uuid_length:(x=I.uuid)==null?void 0:x.length,has_id:!!I.id,has_email:!!I.email}),s(B),console.log("🔗 Routing all users to /chat (unified dashboard)"),setTimeout(()=>{n("/chat")},500)}else h(U.error||"Failed to authenticate")}catch(C){console.error("❌ Auth Success Error:",C),h(C.message||"An error occurred during authentication")}finally{a(!1)}})()},[t,n,e]),u?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-white text-2xl font-bold mb-4",children:"❌ Authentication Error"}),l.jsx("p",{className:"text-white/70 text-lg mb-6",children:u}),l.jsx("button",{onClick:()=>n("/login",{replace:!0}),className:"px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100",children:"Back to Login"})]})}):l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Completing your login..."}),l.jsx("p",{className:"text-white/70 text-sm mt-2",children:"Please wait while we set up your session"})]})})}const gc=()=>{const n=ft();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:Ti,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Terms & Conditions"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("p",{className:"text-sm text-white/70 italic",children:"Last Updated: December 21, 2025"}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"1. Acceptance of Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:'By accessing and using the Flinxx platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"2. Use License"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"Permission is granted to temporarily download one copy of the materials (information or software) on Flinxx for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Modifying or copying the materials"}),l.jsx("li",{children:"Using the materials for any commercial purpose or for any public display"}),l.jsx("li",{children:"Attempting to decompile or reverse engineer any software contained on the Service"}),l.jsx("li",{children:"Removing any copyright or other proprietary notations from the materials"}),l.jsx("li",{children:'Transferring the materials to another person or "mirroring" the materials on any other server'}),l.jsx("li",{children:"Violating any laws or regulations applicable to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"3. Age Restriction"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"You must be at least 18 years of age to use this Service. By using Flinxx, you represent and warrant that you are at least 18 years old and have the legal right to use the platform in your jurisdiction."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"4. Disclaimer"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials on Flinxx are provided on an 'as is' basis. Flinxx makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"5. Limitations"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Flinxx, even if Flinxx or a Flinxx authorized representative has been notified orally or in writing of the possibility of such damage."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"6. Accuracy of Materials"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"The materials appearing on Flinxx could include technical, typographical, or photographic errors. Flinxx does not warrant that any of the materials on its Service are accurate, complete, or current. Flinxx may make changes to the materials contained on the Service at any time without notice."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"7. User Conduct"}),l.jsx("p",{className:"text-white/80 leading-relaxed mb-3",children:"You agree that you will not engage in any conduct that:"}),l.jsxs("ul",{className:"list-disc list-inside space-y-2 text-white/80",children:[l.jsx("li",{children:"Violates any applicable law or regulation"}),l.jsx("li",{children:"Infringes upon or violates any intellectual property rights"}),l.jsx("li",{children:"Harasses, abuses, or threatens other users"}),l.jsx("li",{children:"Uploads malware, viruses, or other harmful code"}),l.jsx("li",{children:"Impersonates any person or entity"}),l.jsx("li",{children:"Shares non-consensual intimate content"}),l.jsx("li",{children:"Attempts to gain unauthorized access to the Service"})]})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"8. Materials License"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By posting materials to Flinxx, you grant Flinxx a worldwide, royalty-free license to use, reproduce, modify and publish that material in any form, in any media now known or hereafter discovered. However, this license does not extend to any materials posted by other users."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"9. Limitations of Liability"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"In no event shall Flinxx, its employees, agents, suppliers, or any other affiliated parties be liable to you or any third party for any direct, indirect, consequential, special, or punitive damages whatsoever, including without limitation, damages for loss of profits, loss of use, business interruption, or loss of data, even if Flinxx has been advised of the possibility of such damages."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"10. Privacy Policy"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your use of Flinxx is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"11. Termination"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may terminate or suspend your account and access to the Service at any time, for any reason, without notice. Upon termination, your right to use the Service will immediately cease. You remain liable for all charges incurred through the date of termination."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"12. Modifications to Terms"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service. If you do not agree to any of these terms, or any revised terms, please stop using the Service."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"13. Governing Law"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Flinxx operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."})]}),l.jsxs("section",{children:[l.jsx("h2",{className:"text-2xl font-bold text-white mb-3",children:"14. Contact Information"}),l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you have any questions about these Terms & Conditions, please contact us at: support@flinxx.com"})]}),l.jsx("div",{className:"pt-6 border-t border-white/20",children:l.jsx("p",{className:"text-sm text-white/70",children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},$I=()=>{const n=ft();return l.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600",children:[l.jsx("div",{className:"relative z-20 w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 shadow-lg",children:l.jsx("div",{className:"px-6 py-4 flex justify-start items-center max-w-full",children:l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("img",{src:Ti,alt:"Flinxx",className:"w-10 h-10"}),l.jsx("h1",{className:"text-2xl font-bold text-white",children:"Flinxx"})]})})}),l.jsx("div",{className:"flex-1 flex items-center justify-center px-4 py-12",children:l.jsxs("div",{className:"w-full max-w-3xl",children:[l.jsxs("div",{className:"bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20",children:[l.jsx("h1",{className:"text-4xl font-black text-white mb-8",children:"Privacy Policy"}),l.jsxs("div",{className:"max-h-[70vh] overflow-y-auto pr-4 space-y-6 text-white/90",children:[l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"By accessing or using Flinxx, you agree to this Privacy Policy."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is a live interaction platform where users and streamers communicate in real time. Due to the nature of live content, complete privacy cannot be guaranteed."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx hosts multiple streamers and users. You understand that any user or streamer may record video, audio, or interactions without your consent and may upload or share such content on external platforms. You are solely responsible for your own privacy and actions. Flinxx provides no guarantee or control over such recordings or uploads."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Your video, audio, messages, and interactions may also be recorded, stored, reviewed, or used by Flinxx for safety, moderation, legal compliance, marketing, promotional, or platform improvement purposes. By continuing, you give your full consent."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Flinxx is not responsible or liable for screenshots, screen recordings, re-uploads, misuse, or distribution of content by users or streamers outside the platform. You agree that you use Flinxx at your own risk."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"We do not guarantee the behavior, conduct, or content of any user or streamer. Flinxx shall not be held liable for any loss, damage, harassment, or misuse arising from live interactions."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"Basic information such as device data, usage activity, and login details may be collected to operate, secure, and improve the platform."})}),l.jsx("section",{children:l.jsx("p",{className:"text-white/80 leading-relaxed",children:"If you do not agree with this Privacy Policy, please discontinue use of Flinxx immediately."})}),l.jsx("div",{className:"text-sm text-white/50 italic pt-6 border-t border-white/20",children:l.jsx("p",{children:"© 2025 Flinxx. All rights reserved."})})]})]}),l.jsx("div",{className:"text-center mt-8",children:l.jsx("button",{onClick:()=>n("/",{replace:!0}),className:"px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all",children:"Back to Home"})})]})})]})},GI=({children:n})=>{const e=ft(),t=T.useContext(Ot),r=t==null?void 0:t.user,s=t==null?void 0:t.isLoading,[o,a]=T.useState(!1),[u,h]=T.useState(null),[f,y]=T.useState(!0);console.log(`
[ProtectedChatRoute] 🟢 RENDER CALLED`),console.log("[ProtectedChatRoute]   - isLoading:",f),console.log("[ProtectedChatRoute]   - showProfileSetup:",o),console.log("[ProtectedChatRoute]   - authLoading:",s),console.log("[ProtectedChatRoute]   - authUser:",r?r.email:"null"),T.useEffect(()=>{console.log(`

🔴 [ProtectedChatRoute] ═══════════════════════════════════════════`),console.log("🔴 [ProtectedChatRoute] EFFECT RUNNING - PROFILE CHECK"),console.log("🔴 [ProtectedChatRoute] ═══════════════════════════════════════════"),console.log("🔴 [ProtectedChatRoute] Effect dependencies changed:"),console.log("🔴 [ProtectedChatRoute]   - authLoading:",s),console.log("🔴 [ProtectedChatRoute]   - authUser:",r?r.email:"null");try{if(s===!0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext is still initializing (isLoading=true)"),y(!0);return}if(s===void 0){console.log("🔴 [ProtectedChatRoute] ⏳ WAITING - AuthContext loading state is undefined"),y(!0);return}if(console.log("🔴 [ProtectedChatRoute] ✓ AuthContext finished loading (isLoading=false)"),!r){console.log("🔴 [ProtectedChatRoute] ❌ AuthContext finished loading but NO USER found"),console.log("🔴 [ProtectedChatRoute] Redirecting to /login"),y(!1),e("/login",{replace:!0});return}console.log("🔴 [ProtectedChatRoute] ✅ AuthContext loaded with user:",r.email),console.log("🔴 [ProtectedChatRoute] authUser object:",{id:r.id,email:r.email,profileCompleted:r.profileCompleted,birthday:r.birthday,gender:r.gender}),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted type:",typeof r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted value:",r.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - authUser.profileCompleted === true?",r.profileCompleted===!0);const x=localStorage.getItem("user");if(console.log("🔴 [ProtectedChatRoute] Checking localStorage:"),console.log("🔴 [ProtectedChatRoute]   - user key exists:",!!x),x)try{const k=JSON.parse(x);console.log("🔴 [ProtectedChatRoute] localStorage user:",{id:k.id,email:k.email,profileCompleted:k.profileCompleted}),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted type:",typeof k.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted value:",k.profileCompleted),console.log("🔴 [ProtectedChatRoute]   - localStorage.profileCompleted === true?",k.profileCompleted===!0)}catch(k){console.error("[ProtectedChatRoute] Failed to parse localStorage user:",k)}else console.log("[ProtectedChatRoute] ⚠️ No user in localStorage");h(r),console.log(`
🔴 [ProtectedChatRoute] PROFILE COMPLETION CHECK:`);const C=r==null?void 0:r.profileCompleted;console.log("🔴 [ProtectedChatRoute]   Source 1 (AuthContext):"),console.log("🔴 [ProtectedChatRoute]     authUser.profileCompleted =",C),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof C),console.log("🔴 [ProtectedChatRoute]     === true?",C===!0);let P=null;x?(P=JSON.parse(x).profileCompleted,console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage):"),console.log("🔴 [ProtectedChatRoute]     localStorage.profileCompleted =",P),console.log("🔴 [ProtectedChatRoute]     typeof =",typeof P),console.log("🔴 [ProtectedChatRoute]     === true?",P===!0)):console.log("🔴 [ProtectedChatRoute]   Source 2 (localStorage): not available");const S=C===!0||P===!0;console.log(`
🔴 [ProtectedChatRoute] FINAL DECISION:`),console.log("🔴 [ProtectedChatRoute]   profileCompletedAuth === true?",C===!0),console.log("🔴 [ProtectedChatRoute]   profileCompletedStorage === true?",P===!0),console.log("🔴 [ProtectedChatRoute]   isProfileComplete (final):",S),S?(console.log(`
🔴 [ProtectedChatRoute] ✅ DECISION: Profile IS completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING Chat page
`)):(console.log(`
🔴 [ProtectedChatRoute] ❌ DECISION: Profile NOT completed`),console.log(`🔴 [ProtectedChatRoute] ➜ SHOWING ProfileSetupModal
`),a(!0)),y(!1)}catch(x){console.error("[ProtectedChatRoute] ❌ ERROR in profile check:",x),console.error("[ProtectedChatRoute] Stack:",x.stack),y(!1),e("/login",{replace:!0})}},[e,r,s]);const E=x=>{console.log("Profile completed:",x),a(!1),h(x)};return f?l.jsx("div",{className:"min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"inline-block",children:l.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"})}),l.jsx("p",{className:"mt-4 text-white text-lg font-semibold",children:"Loading..."})]})}):l.jsxs(l.Fragment,{children:[o&&u&&l.jsx(od,{user:u,onProfileComplete:E,isOpen:!0}),!o&&n]})},HI=({isOpen:n=!0,onClose:e})=>{const{user:t}=T.useContext(Ot)||{},{markAsRead:r}=T.useContext(ha)||{},{refetchUnreadCount:s}=ya()||{},[o,a]=T.useState(null),[u,h]=T.useState(null),f=T.useRef(!1);T.useEffect(()=>{console.log("🎯 MyDuoSquad mounted")},[]),T.useEffect(()=>{if(o!==null||f.current||!n||!(t!=null&&t.uuid))return;(async()=>{try{const C=await Uh(t.uuid),P=Array.isArray(C)?C.sort((S,k)=>{const G=S.last_message_at?new Date(S.last_message_at):new Date(0);return(k.last_message_at?new Date(k.last_message_at):new Date(0))-G}):[];a(P),f.current=!0}catch(C){console.error("❌ Failed to fetch accepted friends:",C),a([]),f.current=!0}})()},[n,t==null?void 0:t.uuid]);const y=(x,C)=>{a(P=>P.map(k=>k.id===x?{...k,last_message_at:C}:k).sort((k,G)=>{const H=k.last_message_at?new Date(k.last_message_at):new Date(0);return(G.last_message_at?new Date(G.last_message_at):new Date(0))-H})),s&&s()},E=async x=>{try{t!=null&&t.uuid&&t.uuid.length===36&&x.id&&await Or(t.uuid,x.id),r&&x.id&&r(x.id),h(x),s&&s()}catch(C){console.error("❌ Error marking messages as read:",C),h(x)}};return l.jsxs("div",{className:"duo-panel w-full h-full rounded-3xl p-8 flex flex-col items-start justify-start text-left relative",style:{backgroundColor:"#131313",border:"1px solid #d9b85f",overflow:"hidden",display:"flex",flexDirection:"column"},children:[l.jsx("button",{className:"modal-close-btn",onClick:e,title:"Close",children:"✕"}),l.jsx("div",{className:"w-full mb-6",children:l.jsx("h3",{className:"text-2xl font-bold",style:{color:"#d9b85f"},children:"My Duo Squad"})}),l.jsx("div",{className:"duo-friends-list",style:{flex:1,width:"100%",overflowY:"auto"},children:u?l.jsx(Co,{friend:u,onBack:()=>h(null),onMessageSent:y}):o===null?l.jsx("p",{style:{textAlign:"center",color:"#9ca3af",marginTop:"20px"},children:"Loading squad..."}):o.length===0?l.jsxs("div",{style:{textAlign:"center",color:"rgba(255,255,255,0.6)",marginTop:"20px"},children:[l.jsx("p",{children:"No squad members yet"}),l.jsx("p",{style:{fontSize:"12px",marginTop:"8px"},children:"Add friends to build your duo squad"})]}):o.map(x=>l.jsxs("div",{className:"notification-item",style:{marginBottom:"0"},children:[l.jsx("div",{className:"notification-avatar",children:x.photo_url?l.jsx("img",{src:x.photo_url,alt:x.display_name}):l.jsx("div",{className:"text-avatar",children:x.display_name.charAt(0).toUpperCase()})}),l.jsx("div",{className:"notification-text",children:l.jsx("strong",{children:x.display_name})}),l.jsx("div",{className:"message-actions",children:l.jsx("button",{className:"message-btn",onClick:()=>E(x),title:"Send a message",children:"Message"})})]},x.id))})]})};function WI(){const{isDuoSquadOpen:n,closeDuoSquad:e}=id();return l.jsxs(l.Fragment,{children:[n&&l.jsx("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999},children:l.jsx(HI,{isOpen:n,onClose:e})}),l.jsx("div",{style:{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column"},children:l.jsxs(Sd,{children:[l.jsx(yt,{path:"/",element:l.jsx(_I,{})}),l.jsx(yt,{path:"/login",element:l.jsx(xI,{})}),l.jsx(yt,{path:"/terms",element:l.jsx(gc,{})}),l.jsx(yt,{path:"/terms-and-conditions",element:l.jsx(gc,{})}),l.jsx(yt,{path:"/privacy-policy",element:l.jsx($I,{})}),l.jsx(yt,{path:"/callback",element:l.jsx(UI,{})}),l.jsx(yt,{path:"/auth-success",element:l.jsx(BI,{})}),l.jsx(yt,{path:"/chat",element:l.jsx(GI,{children:l.jsx(LI,{})})}),l.jsx(yt,{path:"/matching",element:l.jsx(MI,{})}),l.jsx(yt,{path:"/profile",element:l.jsx(FI,{})}),l.jsx(yt,{path:"*",element:l.jsx(zI,{})})]})})]})}function qI(){return l.jsx(yI,{children:l.jsx(TI,{children:l.jsx(Cd,{children:l.jsx(WI,{})})})})}const zI=()=>l.jsx("div",{className:"min-h-screen flex items-center justify-center",children:l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-5xl font-bold text-indigo-400 mb-4",children:"404"}),l.jsx("p",{className:"text-gray-300 mb-8",children:"Page not found"}),l.jsx("button",{onClick:()=>window.location.href="/",className:"px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer",children:"Go Home"})]})});function KI(){return l.jsx("div",{style:{width:"100%",height:"100vh"},children:l.jsx(qI,{})})}eo.createRoot(document.getElementById("root")).render(l.jsx(Kn.StrictMode,{children:l.jsx(Md,{clientId:"373922547944-gm8fgpgjebnraruomkpajoa7s3nqups0.apps.googleusercontent.com",onScriptProps:{async:!0,defer:!0,nonce:"YOUR_NONCE_VALUE"},children:l.jsx(Iw,{children:l.jsx(gI,{children:l.jsx(Ew,{children:l.jsx(KI,{})})})})})}));
//# sourceMappingURL=index-GKKP3p8f.js.map
