import { mkdir, writeFile } from 'node:fs/promises'

// Icons / Configurator, section 7439:2443. Keep the exported SVGs unchanged.
const prefix = 'https://www.figma.com/api/mcp/asset/d420aa01-760f-4d78-adb3-6cb747406eb8'
const icons = {
 cpu: { asset: 'e447b.svg', node: '8372:281' },
 motherboard: { asset: 'b3ad0.svg', node: '8372:291' },
 pc: { asset: 'd2dfc.svg', node: '8372:299' },
 gpu: { asset: '496d0.svg', node: '8372:283' },
 cooler: { asset: '14009.svg', node: '8372:279' },
 ram: { asset: '7fc9f.svg', node: '8372:305' },
 hdd: { asset: '15fe5.svg', node: '8372:285' },
 audio: { asset: '8d85b.svg', node: '8372:277' },
 'add-more': { asset: 'c9a0c.svg', node: '8372:275' },
}
await mkdir('public/icons/configurator', {recursive:true})
const sources = {}
await Promise.all(Object.entries(icons).map(async ([name, {asset,node}]) => {
 const response = await fetch(`${prefix}/${asset}`, {signal:AbortSignal.timeout(30000)})
 if (!response.ok) throw new Error(`${name}: ${response.status}`)
 await writeFile(`public/icons/configurator/${name}.svg`, Buffer.from(await response.arrayBuffer()))
 sources[name] = {node, source:`https://www.figma.com/design/KUBXumELWAZ8CpuxwT3Fay/Icons?node-id=${node.replace(':','-')}`}
 console.log(`OK ${name}`)
}))
await writeFile('public/icons/configurator/sources.json', JSON.stringify(sources,null,2))
