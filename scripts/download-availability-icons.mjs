import {mkdir,writeFile} from 'node:fs/promises'
const prefix='https://www.figma.com/api/mcp/asset/6a6a9309-45d3-4393-9207-75110165ccee'
const assets={shops:'b6c71.png',delivery:'8a72b.png',pickup:'35a28.png'}
await mkdir('public/images/availability',{recursive:true})
await Promise.all(Object.entries(assets).map(async([name,file])=>{
 const r=await fetch(`${prefix}/${file}`,{signal:AbortSignal.timeout(30000)})
 if(!r.ok)throw new Error(`${name}: ${r.status}`)
 await writeFile(`public/images/availability/${name}.png`,Buffer.from(await r.arrayBuffer()))
 console.log(`OK ${name}`)
}))
await writeFile('public/images/availability/sources.json',JSON.stringify({figma:'https://www.figma.com/design/HpXMKWR4xqxpNVMm668VvC/branch/lxOxnPYUmTI0NGxAAi4UGg/?node-id=25553-51416',assets},null,2))
