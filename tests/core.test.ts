import {describe,it,expect} from 'vitest';
import {actionSchema,recipeSchema,origin} from '../server/core';
const recipe=[{type:'goto',url:`${origin}/fixture`},{type:'fill',selector:'[data-testid="task-name"]',value:'Fix login issue'},{type:'selectOption',selector:'[data-testid="category"]',value:'Engineering'},{type:'click',selector:'[data-testid="submit"]'}];
describe('strict safe recipe',()=>{
 it('accepts exactly the allowlisted workflow',()=>expect(recipeSchema.parse(recipe)).toEqual(recipe));
 it.each([
 {type:'goto',url:'https://example.com'},
 {type:'goto',url:`${origin}/other`},
 {type:'fill',selector:'input[type=password]',value:'secret'},
 {type:'click',selector:'body; rm -rf /'},
 {type:'evaluate',code:'alert(1)'},
 {type:'click',selector:'[data-testid="submit"]',code:'extra'},
 {type:'fill',selector:'[data-testid="task-name"]',value:'x'.repeat(121)},
 ])('rejects unsafe event %j',event=>expect(actionSchema.safeParse(event).success).toBe(false));
 it('rejects incomplete and reordered workflows',()=>{expect(recipeSchema.safeParse(recipe.slice(1)).success).toBe(false);expect(recipeSchema.safeParse([...recipe].reverse()).success).toBe(false);});
});
