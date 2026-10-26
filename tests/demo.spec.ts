import {test,expect} from '@playwright/test';
test('record → generate → invoke: real MCP demo',async({page,request})=>{
 await page.goto('/');await page.getByRole('button',{name:'开始录制'}).click();
 await page.getByLabel('任务名称').fill('修复登录问题');await page.getByLabel('分类').selectOption('Engineering');
 await page.getByRole('button',{name:'录制表单提交'}).click();await expect(page.getByTestId('event-count')).toHaveText('4');
 await page.getByRole('button',{name:'生成 MCP'}).click();await expect(page.getByTestId('recipe')).toContainText('submit_demo_task');
 await page.getByRole('button',{name:'测试工具'}).click();await expect(page.getByTestId('receipt')).toHaveText(/^TASK-[A-F0-9]{8}$/);await expect(page.getByTestId('listed-tool')).toHaveText('submit_demo_task');
 const receipt=await page.getByTestId('receipt').innerText();expect(await (await request.get(`/api/receipt/${receipt}`)).json()).toEqual({taskName:'修复登录问题',category:'Engineering'});
 await page.screenshot({path:'artifacts/demo.png',fullPage:true});
});
