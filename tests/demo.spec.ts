import {test,expect} from '@playwright/test';
test('record → generate → invoke: real MCP demo',async({page,request})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start recording'}).click();
 await page.getByLabel('Task name').fill('Fix login issue');await page.getByLabel('Category').selectOption('Engineering');
 await page.getByRole('button',{name:'Record form submission'}).click();await expect(page.getByTestId('event-count')).toHaveText('4');
 await page.getByRole('button',{name:'Generate MCP'}).click();await expect(page.getByTestId('recipe')).toContainText('submit_demo_task');
 await page.getByRole('button',{name:'Test tool'}).click();await expect(page.getByTestId('receipt')).toHaveText(/^TASK-[A-F0-9]{8}$/);await expect(page.getByTestId('listed-tool')).toHaveText('submit_demo_task');
 const receipt=await page.getByTestId('receipt').innerText();expect(await (await request.get(`/api/receipt/${receipt}`)).json()).toEqual({taskName:'Fix login issue',category:'Engineering'});
 await page.screenshot({path:'artifacts/demo.png',fullPage:true});
});
