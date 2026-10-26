import {test,expect} from '@playwright/test';
test('SDK discovery and invocation produce a real fixture receipt',async({request})=>{
 await request.post('/api/start');
 for(const action of [{type:'fill',selector:'[data-testid="task-name"]',value:'Integration task'},{type:'selectOption',selector:'[data-testid="category"]',value:'Design'},{type:'click',selector:'[data-testid="submit"]'}])expect((await request.post('/api/action',{data:action})).ok()).toBeTruthy();
 const generated=await (await request.post('/api/generate')).json();expect(generated.recipe).toHaveLength(4);
 const response=await request.post('/api/test',{data:{taskName:'SDK replay task'}});expect(response.ok()).toBeTruthy();const data=await response.json();expect(data.tools.map((t:any)=>t.name)).toContain('submit_demo_task');const receipt=JSON.parse(data.result.content[0].text);expect(receipt.receipt).toMatch(/^TASK-[A-F0-9]{8}$/);expect(await (await request.get(`/api/receipt/${receipt.receipt}`)).json()).toEqual({taskName:'SDK replay task',category:'Design'});
});
test('API rejects unapproved origin and unsafe actions',async({request})=>{expect((await request.post('/api/start',{headers:{Origin:'https://evil.example'}})).status()).toBe(403);expect((await request.post('/api/action',{data:{type:'evaluate',code:'1'}})).status()).toBe(400);});
test('中文小屏、键盘操作和失败反馈',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
 await expect(page.getByRole('navigation',{name:'首次使用三步引导'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.keyboard.press('Tab');await page.keyboard.press('Tab');
 await expect(page.getByRole('button',{name:'开始录制'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.getByLabel('任务名称')).toBeVisible();
 await page.getByLabel('任务名称').fill('');await expect(page.getByRole('button',{name:'录制表单提交'})).toBeDisabled();
 await page.screenshot({path:'artifacts/mobile-zh.png',fullPage:true});
 await page.route('**/api/start',route=>route.abort());
 await page.getByRole('button',{name:'开始录制'}).click();
 await expect(page.getByRole('alert')).toContainText('无法连接本地服务');
 await expect(page.getByRole('button',{name:'开始录制'})).toBeEnabled();
});
