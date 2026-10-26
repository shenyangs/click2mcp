import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { resolve } from 'node:path';
import { recipeSchema } from './core.js';
export async function invoke(recipe:unknown,taskName:string){const client=new Client({name:'click2mcp-dashboard',version:'1.0.0'});const transport=new StdioClientTransport({command:process.execPath,args:['--import','tsx',resolve('server/mcp.ts')],env:{...Object.fromEntries(Object.entries(process.env).filter((x):x is [string,string]=>typeof x[1]==='string')),CLICK2MCP_RECIPE:JSON.stringify(recipeSchema.parse(recipe))},stderr:'pipe'});try{await client.connect(transport);const listed=await client.listTools();const result=await client.callTool({name:'submit_demo_task',arguments:{taskName}});if(result.isError)throw new Error(JSON.stringify(result));return {tools:listed.tools,result};}finally{await client.close();}}
