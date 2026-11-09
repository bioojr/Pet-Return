const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
// Compile the actual TypeScript rules in memory. No extra test dependency or generated files.
const filename = path.resolve('src/lib/pets.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const domain = new Module(filename, module);
domain.filename = filename;
domain.paths = module.paths;
domain._compile(compiled, filename);
const { examples, blankFilters, filterPets, validatePet, decodeData, savePet, deletePet, toggleFavorite, validDate, isPet } = domain.exports;
const pet = { ...examples[0], id: 'local-test', createdAt: '2026-11-09T12:00:00Z' };
const empty = () => ({ pets: [], favorites: [] });
test('oito exemplos distintos e ilustrações locais existentes', () => {
 assert.equal(examples.length, 8);
 assert.equal(new Set(examples.map(p => p.id)).size, 8);
 assert.equal(new Set(examples.map(p => p.species)).size, 3);
 for(const p of examples) assert.ok(fs.existsSync(`public/illustrations/${p.illustration}.svg`));
});
test('busca ignora acentos, caixa e espaços externos', () => {
 assert.equal(filterPets(examples,{...blankFilters,q:'  AMÓRA  '})[0].name, 'Amora');
 assert.equal(filterPets(examples,{...blankFilters,regiao:'SAO PAULO'}).length, 4);
 assert.equal(filterPets(examples,{...blankFilters,q:'coleira azul'})[0].name, 'Bento');
});
test('todos os filtros são combinados; limpar restaura oito resultados', () => {
 const filters = {...blankFilters,status:'perdido',species:'Cachorro',size:'Médio',sex:'Macho',regiao:'VILA MARIANA',q:'caramelo'};
 assert.equal(filterPets(examples,filters).length, 1);
 assert.equal(filterPets(examples,{...filters,sex:'Fêmea'}).length, 0);
 assert.equal(filterPets(examples,blankFilters).length, 8);
});
test('cadastro exige nome para perdido e aceita encontrado sem nome', () => {
 assert.ok(validatePet({...pet,name:''},'2026-11-09').name);
 assert.deepEqual(validatePet({...pet,name:'',status:'encontrado'},'2026-11-09'),{});
});
test('cadastro rejeita campos em branco, descrição curta e data futura', () => {
 const errors = validatePet({...pet,city:' ',neighborhood:'',color:'',size:'',sex:'',description:'curta',date:'2026-11-10'},'2026-11-09');
 for(const key of ['city','neighborhood','color','size','sex','description','date']) assert.ok(errors[key]);
 assert.equal(validDate('2026-02-30'), false);
 assert.equal(validDate('2026-11-09'), true);
});
test('cadastro, detalhes por id e persistência após serializar/reler', () => {
 const data = decodeData(JSON.stringify(savePet(empty(),pet)));
 assert.deepEqual(data.pets.find(p => p.id === pet.id),pet);
 assert.equal(filterPets([...data.pets,...examples],blankFilters).length,9);
 assert.ok(isPet(pet));
});
test('edição mantém id e não duplica anúncio', () => {
 let data = savePet(empty(),pet);
 data = savePet(data,{...pet,name:'Bento atualizado',color:'Branco'});
 data = decodeData(JSON.stringify(data));
 assert.equal(data.pets.length,1);
 assert.equal(data.pets[0].name,'Bento atualizado');
 assert.equal(data.pets[0].id,pet.id);
});
test('pausar, reativar e reencontrar alteram presença na busca', () => {
 let data = savePet(empty(),{...pet,state:'pausado'});
 assert.equal(filterPets(data.pets,blankFilters).length,0);
 data = savePet(data,{...pet,state:'ativo'});
 assert.equal(filterPets(data.pets,blankFilters).length,1);
 data = decodeData(JSON.stringify(savePet(data,{...pet,state:'reencontrado'})));
 assert.equal(filterPets(data.pets,blankFilters).length,0);
 assert.equal(data.pets[0].state,'reencontrado');
});
test('favoritos alternam sem duplicar e persistem entre leituras', () => {
 let data = toggleFavorite(empty(),'exemplo-1');
 data = decodeData(JSON.stringify(data));
 assert.deepEqual(data.favorites,['exemplo-1']);
 data = toggleFavorite(data,'exemplo-1');
 assert.deepEqual(data.favorites,[]);
});
test('exclusão remove anúncio e favorito sem alterar exemplos', () => {
 const data = deletePet(toggleFavorite(savePet(empty(),pet),pet.id),pet.id);
 assert.deepEqual(decodeData(JSON.stringify(data)),empty());
 assert.equal(examples.length,8);
});
test('armazenamento ausente inicia vazio; inválido é rejeitado', () => {
 assert.deepEqual(decodeData(null),empty());
 for(const raw of ['{', 'null', '{}', '{"pets":[],"favorites":[5]}', JSON.stringify({pets:[{...pet,date:'2026-02-30'}],favorites:[]}), JSON.stringify({pets:[pet,pet],favorites:[]})]) assert.throws(() => decodeData(raw));
});
test('restauração dos dados locais preserva somente os exemplos', () => {
 const restored = decodeData(JSON.stringify(empty()));
 assert.equal(restored.pets.length,0);
 assert.equal(restored.favorites.length,0);
 assert.equal(filterPets([...restored.pets,...examples],blankFilters).length,8);
});
