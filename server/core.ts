import { z } from 'zod';
import { chromium, type Page } from '@playwright/test';
import { browserPath } from '../scripts/browser-path.mjs';
import { resolve } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.cache/ms-playwright');
export const origin = 'http://127.0.0.1:5208';
export const actionSchema = z.discriminatedUnion('type', [
 z.object({type:z.literal('goto'),url:z.literal(`${origin}/fixture`)}).strict(),
 z.object({type:z.literal('fill'),selector:z.literal('[data-testid="task-name"]'),value:z.string().min(1).max(120)}).strict(),
 z.object({type:z.literal('selectOption'),selector:z.literal('[data-testid="category"]'),value:z.enum(['Engineering','Design','Research'])}).strict(),
 z.object({type:z.literal('click'),selector:z.literal('[data-testid="submit"]')}).strict()
]);
export type Action=z.infer<typeof actionSchema>;
export const recipeSchema=z.array(actionSchema).length(4).superRefine((a,c)=>{if(a.map(x=>x.type).join()!=='goto,fill,selectOption,click')c.addIssue({code:'custom',message:'录制流程必须依次包含打开页面、填写、选择分类和提交四步'});});
export const inputSchema=z.object({taskName:z.string().min(1).max(120)}).strict();
export function browserOptions(){return {headless:true,timeout:15000,executablePath:browserPath(chromium.executablePath())};}
export async function protect(page:Page){page.setDefaultTimeout(8000);await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());}
export async function act(page:Page,a:Action){switch(a.type){case 'goto':await page.goto(a.url);break;case 'fill':await page.locator(a.selector).fill(a.value);break;case 'selectOption':await page.locator(a.selector).selectOption(a.value);break;case 'click':await page.locator(a.selector).click();break;}}
export async function execute(raw:unknown,taskName:string){const recipe=recipeSchema.parse(raw);const browser=await chromium.launch(browserOptions());try{const page=await browser.newPage();await protect(page);for(const a of recipe)await act(page,a.type==='fill'?{...a,value:inputSchema.parse({taskName}).taskName}:a);await page.locator('[data-testid="receipt"]').waitFor();const receipt=await page.locator('[data-testid="receipt"]').innerText();return {receipt,taskName,category:recipe.find(a=>a.type==='selectOption')?.value,source:'本地示例站点；真实浏览器提交，无模型推理'};}finally{await browser.close();}}
