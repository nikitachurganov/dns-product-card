import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('public/icons/media', {recursive:true})
const response = await fetch('https://www.figma.com/api/mcp/asset/db5db2f4-94b6-4da5-87f5-a5bdde714d03/2b13c.svg', {signal:AbortSignal.timeout(30000)})
if (!response.ok) throw new Error(`Video indicator: ${response.status}`)
await writeFile('public/icons/media/video-indicator.svg', Buffer.from(await response.arrayBuffer()))
await writeFile('public/icons/media/sources.json', JSON.stringify({videoIndicator:{file:'lxOxnPYUmTI0NGxAAi4UGg',node:'30598:59703',usage:'Video preview overlay in customer media gallery'}},null,2))
console.log('Video indicator saved')
