import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{a as t}from"./chunk-W22LQPXL-zd8H7bTd.js";import{r as n,t as r}from"./useReports-Cu7HMNCD.js";import{C as i,N as a,ct as o,it as s,n as c,nt as l,r as u,rt as d,st as f,tt as p,v as m,y as h}from"./iframe-DUv70uw2.js";import{i as g,r as _}from"./reports-BVaObOyJ.js";import{n as v,t as y}from"./links-CTh7r0_J.js";import{n as b,t as x}from"./Invite-CP_p8qoB.js";import{n as S,t as C}from"./ReportSkeleton-KHxSiXsc.js";import{n as w,t as T}from"./ReportView-B68zVQnx.js";import{i as E,r as D}from"./scenarios-BBCT2nES.js";import{n as O,t as k}from"./LoadError-Buq5HZV1.js";function A(){let{handle:e=``}=a(),{data:t,error:r,isPending:i,refetch:o}=n(e);return i?(0,j.jsx)(C,{}):g(r,404)?(0,j.jsx)(x,{handle:e,link:v(e)}):r?(0,j.jsx)(k,{message:r.message,onRetry:()=>o()}):(0,j.jsx)(T,{report:t,link:v(t.handle)},t.generatedAt)}var j;function M(){return(M=e((()=>{i(),_(),r(),b(),S(),w(),y(),O(),j=t(),A.__docgenInfo={description:`A saved report, or an invite to send them if they haven't made one.`,methods:[],displayName:`ReportPage`}})))()}var N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{s(),o(),l(),c(),h(),D(),M(),N=u.meta({title:`Pages/Report`,component:A,parameters:{route:`/r/steady-dev`,path:`/r/:handle`}}),P=e=>f.get(`${m}/reports/:handle`,()=>p.json(E({isSample:!1,...e}))),F=N.story({beforeEach({msw:e}){e.use(P({handle:`steady-dev`}))}}),I=N.story({parameters:{route:`/r/work-dev`},beforeEach({msw:e}){e.use(P({handle:`work-dev`,privateRepos:!0}))}}),L=N.story({beforeEach({msw:e}){e.use(f.get(`${m}/reports/:handle`,()=>d(`infinite`)))}}),R=N.story({parameters:{route:`/r/octocat`}}),z=N.story({beforeEach({msw:e}){e.use(f.get(`${m}/reports/:handle`,()=>p.json({message:`Upstream GitHub error`},{status:502})))}}),B=[`Loaded`,`WithPrivateRepos`,`Loading`,`NotGeneratedYet`,`ServerError`],F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(serve({
      handle: 'steady-dev'
    }));
  }
})`,...F.input.parameters?.docs?.source},description:{story:`Anyone's report looks the same: there's no session, so no owner controls.`,...F.input.parameters?.docs?.description}}},I.input.parameters={...I.input.parameters,docs:{...I.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    route: '/r/work-dev'
  },
  beforeEach({
    msw
  }) {
    msw.use(serve({
      handle: 'work-dev',
      privateRepos: true
    }));
  }
})`,...I.input.parameters?.docs?.source},description:{story:`Private repos arrive without names.`,...I.input.parameters?.docs?.description}}},L.input.parameters={...L.input.parameters,docs:{...L.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(http.get(\`\${API_URL}/reports/:handle\`, () => delay('infinite')));
  }
})`,...L.input.parameters?.docs?.source}}},R.input.parameters={...R.input.parameters,docs:{...R.input.parameters?.docs,source:{originalSource:`meta.story({
  parameters: {
    route: '/r/octocat'
  }
})`,...R.input.parameters?.docs?.source},description:{story:`404: nobody has generated a report for this handle, so offer an invite to send them.`,...R.input.parameters?.docs?.description}}},z.input.parameters={...z.input.parameters,docs:{...z.input.parameters?.docs,source:{originalSource:`meta.story({
  beforeEach({
    msw
  }) {
    msw.use(http.get(\`\${API_URL}/reports/:handle\`, () => HttpResponse.json({
      message: 'Upstream GitHub error'
    }, {
      status: 502
    })));
  }
})`,...z.input.parameters?.docs?.source}}}})))()}V();export{F as Loaded,L as Loading,R as NotGeneratedYet,z as ServerError,I as WithPrivateRepos,B as __namedExportsOrder};