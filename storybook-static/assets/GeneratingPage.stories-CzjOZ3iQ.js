import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{a as t}from"./chunk-W22LQPXL-zd8H7bTd.js";import{n,t as r}from"./useReports-Cu7HMNCD.js";import{n as i,r as a,t as o}from"./lib-DANpWN06.js";import{S as s,b as c,ct as l,it as u,n as d,nt as f,r as p,rt as m,st as h,tt as g,v as _,y as v}from"./iframe-DUv70uw2.js";import{r as y}from"./reports-BVaObOyJ.js";import{a as b}from"./cutoffs-ni-RFKRN.js";import{n as x,t as S}from"./ReportSkeleton-KHxSiXsc.js";function C(){let[e]=a(),t=e.get(`id`);return t?(0,D.jsx)(w,{id:t}):(0,D.jsx)(c,{to:`/`,replace:!0})}function w({id:e}){let{data:t,error:r}=n(e);return r?(0,D.jsx)(T,{title:`We couldn’t find that report`,message:r.message,action:(0,D.jsx)(E,{})}):!t||t.status===`pending`?(0,D.jsx)(S,{message:`Making your report. Big accounts can take a few minutes…`}):t.status===`ready`&&t.handle?(0,D.jsx)(c,{to:`/r/${t.handle}`,replace:!0}):t.status===`empty`?(0,D.jsx)(T,{title:`Nothing to compare yet`,message:`You have no commits in either window around that cut-off, so there’s no report. Try an earlier cut-off.`,action:(0,D.jsx)(o,{to:`/generate`,className:`btn btn-neutral`,children:`Pick another cut-off`})}):(0,D.jsx)(T,{title:`Your report didn’t finish`,message:t.message??`Something went wrong generating your report.`,action:(0,D.jsx)(E,{})})}function T({title:e,message:t,action:n}){return(0,D.jsxs)(`div`,{"data-theme":`now`,className:`flex min-h-dvh flex-col bg-base-100 font-now text-base-content`,children:[(0,D.jsx)(`header`,{className:`flex items-center border-b border-base-300 px-4 py-3 sm:px-8`,children:(0,D.jsxs)(o,{to:`/`,className:`text-base font-extrabold tracking-tight sm:text-lg`,children:[`Pre`,(0,D.jsx)(`span`,{className:`text-muted`,children:`/`}),`Post`]})}),(0,D.jsxs)(`main`,{className:`mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16`,children:[(0,D.jsx)(`h1`,{className:`text-4xl font-extrabold tracking-tight`,children:e}),(0,D.jsx)(`p`,{role:`alert`,className:`text-base text-muted sm:text-lg`,children:t}),(0,D.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[n,(0,D.jsx)(o,{to:`/`,className:`btn btn-ghost`,children:`Home`})]})]})]})}function E(){return(0,D.jsx)(o,{to:`/generate`,className:`btn btn-neutral`,children:`Sign in again`})}var D;function O(){return(O=e((()=>{i(),s(),v(),y(),r(),b(),x(),D=t(),C.__docgenInfo={description:`/generating?id=…, where sign-in lands: polls the generation, then shows the report.`,methods:[],displayName:`GeneratingPage`}})))()}var k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{u(),l(),f(),d(),v(),O(),k=p.meta({title:`Pages/Generating`,component:C,parameters:{route:`/generating?id=0123456789abcdef0123456789abcdef`,path:`/generating`}}),A=e=>h.get(`${_}/generations/:id`,()=>g.json({status:`pending`,handle:null,message:null,...e})),j=k.story({beforeEach({msw:e}){e.use(A({status:`pending`}))}}),M=k.story({beforeEach({msw:e}){e.use(h.get(`${_}/generations/:id`,()=>m(`infinite`)))}}),N=k.story({beforeEach({msw:e}){e.use(A({status:`ready`,handle:`octocat`}))}}),P=k.story({beforeEach({msw:e}){e.use(A({status:`empty`}))}}),F=k.story({beforeEach({msw:e}){e.use(A({status:`failed`,message:`GitHub is still crunching your repository stats. Sign in again in a minute to retry.`}))}}),I=k.story({beforeEach({msw:e}){e.use(h.get(`${_}/generations/:id`,()=>g.json({message:`We couldn’t find that report request. Sign in to generate your report.`},{status:404})))}}),L=[`Pending`,`FirstPoll`,`Ready`,`Empty`,`Failed`,`UnknownId`],j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(respond({
      status: 'pending'
    }));
  }
})`,...j.input.parameters?.docs?.source},description:{story:`Still generating: polls every 2 s.`,...j.input.parameters?.docs?.description}}},M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(http.get(\`\${API_URL}/generations/:id\`, () => delay('infinite')));
  }
})`,...M.input.parameters?.docs?.source},description:{story:`The first poll hasn't answered yet.`,...M.input.parameters?.docs?.description}}},N.input.parameters={...N.input.parameters,docs:{...N.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(respond({
      status: 'ready',
      handle: 'octocat'
    }));
  }
})`,...N.input.parameters?.docs?.source},description:{story:`Ready: moves on to /r/:handle (outside the story).`,...N.input.parameters?.docs?.description}}},P.input.parameters={...P.input.parameters,docs:{...P.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(respond({
      status: 'empty'
    }));
  }
})`,...P.input.parameters?.docs?.source},description:{story:`No commits in either window, so nothing was saved.`,...P.input.parameters?.docs?.description}}},F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(respond({
      status: 'failed',
      message: 'GitHub is still crunching your repository stats. Sign in again in a minute to retry.'
    }));
  }
})`,...F.input.parameters?.docs?.source},description:{story:`Failed: the API's message, and a way back through sign-in.`,...F.input.parameters?.docs?.description}}},I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(http.get(\`\${API_URL}/generations/:id\`, () => HttpResponse.json({
      message: 'We couldn’t find that report request. Sign in to generate your report.'
    }, {
      status: 404
    })));
  }
})`,...I.input.parameters?.docs?.source},description:{story:`404: an id the API doesn't know, e.g. an old link.`,...I.input.parameters?.docs?.description}}}})))()}R();export{P as Empty,F as Failed,M as FirstPoll,j as Pending,N as Ready,I as UnknownId,L as __namedExportsOrder};