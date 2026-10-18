import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{a as t}from"./chunk-W22LQPXL-zd8H7bTd.js";import{n,r}from"./iframe-DUv70uw2.js";import{n as i,t as a}from"./GenerateForm-DAcNFfmp.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),s=r.meta({title:`Generate form`,component:a,decorators:[e=>(0,o.jsx)(`div`,{className:`max-w-xl p-8 font-now`,children:(0,o.jsx)(e,{})})]}),c=s.story({args:{mock:!1}}),l=s.story({args:{mock:!0}}),u=s.story({args:{mock:!1,initialCutoff:`2024-06-01`}}),d=s.story({args:{mock:!1,initialCutoff:`2024-02-30`,error:`invalid-cutoff`}}),f=[`Connect`,`Mock`,`CustomCutoff`,`InvalidCutoff`],c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    mock: false
  }
})`,...c.input.parameters?.docs?.source},description:{story:`With the real API: submitting navigates to the API's GitHub sign-in with the cut-off.`,...c.input.parameters?.docs?.description}}},l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    mock: true
  }
})`,...l.input.parameters?.docs?.source},description:{story:`With the mock API: a handle stands in for GitHub.`,...l.input.parameters?.docs?.description}}},u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    mock: false,
    initialCutoff: '2024-06-01'
  }
})`,...u.input.parameters?.docs?.source},description:{story:`A custom date.`,...u.input.parameters?.docs?.description}}},d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    mock: false,
    initialCutoff: '2024-02-30',
    error: 'invalid-cutoff'
  }
})`,...d.input.parameters?.docs?.source},description:{story:`Sent back by the API with ?error=invalid-cutoff.`,...d.input.parameters?.docs?.description}}}})))()}p();export{c as Connect,u as CustomCutoff,d as InvalidCutoff,l as Mock,f as __namedExportsOrder};