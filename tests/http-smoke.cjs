const assert = require('node:assert/strict');
const base = process.env.PETRETURN_URL || 'http://127.0.0.1:3000';
const routes = ['/', '/buscar', '/cadastrar', '/cadastrar?status=encontrado', '/meus-anuncios', '/favoritos', '/como-funciona', '/ajuda', '/pet/exemplo-1', '/pet/inexistente'];
async function main() {
 for(const route of routes) {
  const response = await fetch(base + route);
  assert.equal(response.status,200,route);
  const html = await response.text();
  assert.ok(html.includes('lang="pt-BR"'),route);
  assert.ok(html.includes('Demonstração'),route);
  assert.ok(html.includes('PetReturn'),route);
  assert.ok(!html.includes('Create Next App'),route);
  console.log(`OK ${route}`);
 }
 const home = await (await fetch(base)).text();
 assert.ok(home.includes('Ajude nossos amigos'));
 assert.ok(home.includes('voltarem para casa'));
 for(const asset of ['hero','dog-caramel','dog-white','dog-black','cat-orange','cat-gray','rabbit']) {
  const response = await fetch(`${base}/illustrations/${asset}.svg`);
  assert.equal(response.status,200);
  assert.ok(response.headers.get('content-type').includes('image/svg+xml'));
  assert.ok((await response.text()).includes('<svg'));
 }
 assert.equal((await fetch(base+'/caminho-inexistente')).status,404);
 console.log('OK 7 SVGs locais e página 404. As verificações HTTP não executam JavaScript do cliente.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
