import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { execute,inputSchema,recipeSchema } from './core.js';
const recipe=recipeSchema.parse(JSON.parse(process.env.CLICK2MCP_RECIPE||'[]'));
const server=new McpServer({name:'click2mcp',version:'1.0.0'});
server.registerTool('submit_demo_task',{description:'Submit a non-sensitive task to the bundled local fixture using a recorded browser recipe.',inputSchema},async ({taskName})=>({content:[{type:'text',text:JSON.stringify(await execute(recipe,taskName))}]}));
await server.connect(new StdioServerTransport());
