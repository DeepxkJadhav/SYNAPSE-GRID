(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[421],{1278:(e,s,t)=>{e.exports=t(445)},1524:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>d});var n=t(6029),a=t(5729),o=t(1278),i=t(2203),l=t.n(i),r=t(3343);function d(){let e=(0,o.useRouter)(),{sessionId:s}=e.query,{isAuthenticated:t,user:i}=(0,r.n)(),[d,c]=(0,a.useState)(!0),[x,m]=(0,a.useState)("utils.ts"),[p,h]=(0,a.useState)(""),[f,b]=(0,a.useState)([{type:"sys",text:"Initializing SynapseGrid Sandbox Environment v1.0.4..."},{type:"sys",text:"Establishing secure tunnel protocol to Node West..."},{type:"ok",text:"Connection verified. Remote container active."},{type:"info",text:"Ingested file tree (4 elements)."},{type:"cmd",text:"npm run dev"},{type:"log",text:"Server listening on port 5000 (operational)"},{type:"log",text:"Database connection verified. Ingestion active."}]),g={"server.ts":`import express from 'express';
import { db } from './db';
import { log } from './utils';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  log('Health check requested');
  res.json({ status: 'ok', db: db.isConnected() });
});

app.listen(PORT, () => {
  log(\`Server running on port \${PORT}\`);
});`,"utils.ts":`import { format } from 'date-fns';

export function log(message: string): void {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  console.log(\`[\${timestamp}] [SYS] \${message}\`);
}

export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}`,"db.ts":`import { Client } from 'pg';

class Database {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    this.client = new Client(process.env.DATABASE_URL);
  }

  async connect() {
    await this.client.connect();
    this.connected = true;
  }

  isConnected() {
    return this.connected;
  }
}

export const db = new Database();`,"package.json":`{
  "name": "synapse-sandbox",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3"
  }
}`,"README.md":`# SynapseGrid Sandbox Environment

Collaborative code sandbox editor. Type queries below, write test endpoints, and trigger script compilations.

- **Status**: Live Sync Active
- **Ingestion**: Enabled
`};return((0,a.useEffect)(()=>{t?s&&c(!1):e.push("/login")},[t,s]),d)?(0,n.jsxs)("div",{className:"flex flex-col items-center justify-center min-h-screen bg-[#040711]",children:[(0,n.jsx)("div",{className:"w-12 h-12 rounded-xl bg-indigo-600 animate-pulse mb-4"}),(0,n.jsx)("p",{className:"text-indigo-400 font-mono text-sm tracking-wider",children:"CONNECTING TO SANDBOX..."})]}):(0,n.jsxs)("div",{className:"h-screen flex flex-col bg-[#040711] overflow-hidden text-slate-300 font-sans",children:[(0,n.jsxs)("header",{className:"bg-slate-950/50 border-b border-indigo-950/40 px-6 py-4 flex justify-between items-center backdrop-blur-md",children:[(0,n.jsxs)("div",{className:"flex items-center gap-4",children:[(0,n.jsx)(l(),{href:"/dashboard",className:"text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors",children:"← Dashboard"}),(0,n.jsx)("span",{className:"text-slate-600",children:"/"}),(0,n.jsxs)("div",{className:"flex items-center gap-2",children:[(0,n.jsx)("span",{className:"w-2.5 h-2.5 rounded bg-indigo-500 shadow-glow"}),(0,n.jsxs)("h1",{className:"font-bold text-white tracking-wide text-sm font-mono",children:["SESSION: ",s?.slice(0,12)]})]})]}),(0,n.jsxs)("div",{className:"flex items-center gap-6",children:[(0,n.jsxs)("div",{className:"flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/20 px-3 py-1 rounded-md",children:[(0,n.jsx)("span",{className:"w-2 h-2 rounded-full bg-emerald-500 animate-pulse"}),(0,n.jsx)("span",{className:"text-xs font-semibold text-emerald-400 font-mono",children:"SYNC ACTIVE"})]}),(0,n.jsxs)("span",{className:"text-xs font-mono text-slate-500",children:["OPERATOR: ",i?.username]})]})]}),(0,n.jsxs)("main",{className:"flex-1 flex overflow-hidden",children:[(0,n.jsxs)("aside",{className:"w-64 bg-slate-950/20 border-r border-indigo-950/40 p-5 flex flex-col overflow-y-auto",children:[(0,n.jsx)("h2",{className:"text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono",children:"WORKSPACE FILES"}),(0,n.jsx)("div",{className:"space-y-3 font-mono text-sm",children:[{name:"src",isFolder:!0,open:!0,children:[{name:"server.ts",isFolder:!1},{name:"utils.ts",isFolder:!1},{name:"db.ts",isFolder:!1}]},{name:"package.json",isFolder:!1},{name:"README.md",isFolder:!1}].map((e,s)=>(0,n.jsx)("div",{className:"select-none",children:e.isFolder?(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"text-indigo-400 font-semibold mb-1",children:["\uD83D\uDCC1 ",e.name]}),(0,n.jsx)("div",{className:"pl-4 border-l border-indigo-950/40 space-y-1",children:e.children?.map((e,s)=>(0,n.jsxs)("div",{onClick:()=>m(e.name),className:`cursor-pointer py-1 px-2 rounded-md hover:bg-indigo-950/30 transition-colors ${x===e.name?"text-white bg-indigo-650/10 font-bold border-l-2 border-indigo-500":"text-slate-400"}`,children:["\uD83D\uDCC4 ",e.name]},s))})]}):(0,n.jsxs)("div",{onClick:()=>m(e.name),className:`cursor-pointer py-1 px-2 rounded-md hover:bg-indigo-950/30 transition-colors ${x===e.name?"text-white bg-indigo-650/10 font-bold border-l-2 border-indigo-500":"text-slate-400"}`,children:["\uD83D\uDCC4 ",e.name]})},s))})]}),(0,n.jsxs)("section",{className:"flex-1 flex flex-col overflow-hidden",children:[(0,n.jsxs)("div",{className:"flex-1 flex flex-col bg-slate-950/10 p-5 overflow-hidden",children:[(0,n.jsxs)("div",{className:"flex justify-between items-center mb-3",children:[(0,n.jsx)("span",{className:"text-xs font-mono text-indigo-400 font-bold",children:x}),(0,n.jsx)("span",{className:"text-xs text-slate-500 font-mono",children:"UTF-8 // TypeScript"})]}),(0,n.jsx)("div",{className:"flex-1 bg-slate-950/60 border border-indigo-950/40 rounded-2xl p-6 font-mono text-sm overflow-y-auto leading-relaxed shadow-inner",children:(0,n.jsx)("pre",{className:"text-emerald-400/90 select-text",children:(0,n.jsx)("code",{children:g[x]||"// empty file"})})})]}),(0,n.jsxs)("div",{className:"h-56 bg-slate-950/40 border-t border-indigo-950/40 p-5 flex flex-col overflow-hidden",children:[(0,n.jsxs)("div",{className:"flex justify-between items-center mb-2",children:[(0,n.jsx)("span",{className:"text-xs font-bold uppercase tracking-wider text-slate-500 font-mono",children:"REMOTE SHELL TERMINAL"}),(0,n.jsx)("span",{className:"text-xs text-slate-600 font-mono",children:"SANDBOX NODE 01"})]}),(0,n.jsx)("div",{className:"flex-1 bg-black/60 border border-indigo-950/30 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-1",children:f.map((e,s)=>(0,n.jsxs)("div",{className:"leading-relaxed",children:["sys"===e.type&&(0,n.jsxs)("span",{className:"text-indigo-400",children:["[SYS] ",e.text]}),"ok"===e.type&&(0,n.jsxs)("span",{className:"text-emerald-400",children:["[OK] ",e.text]}),"info"===e.type&&(0,n.jsxs)("span",{className:"text-slate-500",children:["[INFO] ",e.text]}),"cmd"===e.type&&(0,n.jsxs)("span",{className:"text-amber-400",children:["$ ",e.text]}),"log"===e.type&&(0,n.jsx)("span",{className:"text-slate-300",children:e.text})]},s))}),(0,n.jsxs)("form",{onSubmit:e=>{e.preventDefault(),p.trim()&&(b(e=>[...e,{type:"cmd",text:p},{type:"sys",text:`Command output for "${p}" is simulated in Sandbox Mode.`}]),h(""))},className:"mt-3 flex items-center bg-black/40 border border-indigo-950/40 rounded-xl px-4 py-2 font-mono text-xs",children:[(0,n.jsx)("span",{className:"text-indigo-400 mr-2",children:"$"}),(0,n.jsx)("input",{type:"text",value:p,onChange:e=>h(e.target.value),placeholder:"Submit sandboxed command...",className:"bg-transparent border-none outline-none flex-grow text-white"})]})]})]}),(0,n.jsxs)("aside",{className:"w-64 bg-slate-950/20 border-l border-indigo-950/40 p-5 flex flex-col overflow-y-auto",children:[(0,n.jsx)("h2",{className:"text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono",children:"COLLABORATORS"}),(0,n.jsxs)("div",{className:"space-y-4",children:[(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[(0,n.jsx)("div",{className:"w-9 h-9 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm",children:i?.username?.[0].toUpperCase()||"U"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-sm font-semibold text-white leading-none",children:i?.username}),(0,n.jsx)("span",{className:"text-[10px] font-mono text-indigo-400",children:"YOU // WRITER"})]})]}),(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[(0,n.jsx)("div",{className:"w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm",children:"A"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-sm font-semibold text-white leading-none",children:"alice_dev"}),(0,n.jsx)("span",{className:"text-[10px] font-mono text-emerald-400",children:"ONLINE // CO-WRITER"})]})]}),(0,n.jsxs)("div",{className:"flex items-center gap-3 opacity-60",children:[(0,n.jsx)("div",{className:"w-9 h-9 rounded-full bg-slate-900 border border-slate-700/30 flex items-center justify-center font-bold text-slate-500 text-sm",children:"R"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"text-sm font-semibold text-slate-400 leading-none",children:"ravi_shah"}),(0,n.jsx)("span",{className:"text-[10px] font-mono text-slate-500",children:"OFFLINE // READER"})]})]})]})]})]})]})}},7543:(e,s,t)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/editor/[sessionId]",function(){return t(1524)}])}},e=>{e.O(0,[203,636,593,792],()=>e(e.s=7543)),_N_E=e.O()}]);