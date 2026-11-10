export type PetStatus = "perdido" | "encontrado";
export type Pet = { id: string; name: string; status: PetStatus; species: string; breed: string; color: string; size: string; sex: string; description: string; city: string; neighborhood: string; date: string; illustration: string; state: "ativo" | "pausado" | "reencontrado"; createdAt: string };
export const illustrations = ["dog-caramel", "cat-orange", "dog-white", "cat-gray", "rabbit", "dog-black"];
export const species = ["Cachorro", "Gato", "Outro"];
export const sizes = ["Pequeno", "Médio", "Grande"];
export const sexes = ["Fêmea", "Macho", "Não identificado"];
const rows = [
 ["Bento", "perdido", "Cachorro", "Sem raça definida", "Caramelo", "Médio", "Macho", "São Paulo", "Vila Mariana", "dog-caramel", "Usa uma coleira azul e tem uma manchinha branca no peito. É carinhoso e pode estar assustado."],
 ["Gatinha laranja", "encontrado", "Gato", "Sem raça definida", "Laranja", "Pequeno", "Fêmea", "São Paulo", "Pinheiros", "cat-orange", "Encontrada perto de uma praça, sem coleira. Muito tranquila, com olhos verdes e a pontinha do rabo branca."],
 ["Nina", "perdido", "Cachorro", "Sem raça definida", "Branco", "Pequeno", "Fêmea", "São Paulo", "Moema", "dog-white", "Pelagem branca e orelhas marrons. Responde ao nome Nina. Foi vista pela última vez no bairro."],
 ["Gato cinza", "encontrado", "Gato", "Sem raça definida", "Cinza", "Médio", "Macho", "Campinas", "Cambuí", "cat-gray", "Gato cinza de olhos amarelos, bem cuidado. Estava abrigado na entrada de um comércio."],
 ["Pipoca", "perdido", "Outro", "Coelho", "Branco e bege", "Pequeno", "Fêmea", "Curitiba", "Água Verde", "rabbit", "Coelhinha de orelhas compridas. Tem uma orelha bege e gosta de se esconder em lugares silenciosos."],
 ["Cachorro preto", "encontrado", "Cachorro", "Sem raça definida", "Preto", "Grande", "Macho", "São Paulo", "Santana", "dog-black", "Cachorro dócil com uma mancha no focinho. Encontrado caminhando sozinho, sem identificação."],
 ["Amora", "perdido", "Gato", "Sem raça definida", "Cinza", "Pequeno", "Fêmea", "Santos", "Gonzaga", "cat-gray", "Gatinha tímida, de pelo curto. Pode estar escondida em garagens próximas."],
 ["Cachorrinha caramelo", "encontrado", "Cachorro", "Sem raça definida", "Caramelo", "Médio", "Fêmea", "Campinas", "Taquaral", "dog-caramel", "Encontrada na região do parque. Tem uma coleira vermelha sem plaquinha e é muito sociável."],
];
export const examples: Pet[] = rows.map((r, i) => ({ id: `exemplo-${i + 1}`, name: r[0], status: r[1] as PetStatus, species: r[2], breed: r[3], color: r[4], size: r[5], sex: r[6], city: r[7], neighborhood: r[8], illustration: r[9], description: r[10], date: `2026-11-${String(9-i).padStart(2,"0")}`, state: "ativo", createdAt: `2026-11-${String(9-i).padStart(2,"0")}T12:00:00Z` }));
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export const dateLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
export function isPet(value: unknown): value is Pet {
 if (!value || typeof value !== "object") return false;
 const p = value as Pet;
 return ["id", "name", "species", "breed", "color", "size", "sex", "description", "city", "neighborhood", "illustration", "status", "createdAt"].every(k => typeof p[k as keyof Pet] === "string") && p.id.startsWith("local-") && !!p.name.trim() && ["ativo", "pausado", "reencontrado"].includes(p.state) && validDate(p.date) && !Number.isNaN(Date.parse(p.createdAt)) && Object.keys(validatePet(p,p.date)).length === 0;
}
export type Filters = { q: string; regiao: string; status: string; species: string; size: string; sex: string };
export const blankFilters: Filters = { q: "", regiao: "", status: "", species: "", size: "", sex: "" };
export function filterPets(pets: Pet[], filters: Filters) { return pets.filter(p => p.state === "ativo" && (!filters.status || p.status === filters.status) && (!filters.species || p.species === filters.species) && (!filters.size || p.size === filters.size) && (!filters.sex || p.sex === filters.sex) && normalize(`${p.city} ${p.neighborhood}`).includes(normalize(filters.regiao.trim())) && normalize(`${p.name} ${p.species} ${p.breed} ${p.color} ${p.description} ${p.city} ${p.neighborhood}`).includes(normalize(filters.q.trim()))); }
export function validDate(value: string) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
export type PetFields = Omit<Pet,"id" | "state" | "createdAt">;
export function validatePet(fields: PetFields, today: string): Record<string,string> {
 const errors: Record<string,string> = {};
 for(const [key, options] of [["status",["perdido","encontrado"]],["species",species],["size",sizes],["sex",sexes],["illustration",illustrations]] as [keyof PetFields,string[]][]) if(!options.includes(fields[key])) errors[key] = "Selecione uma opção válida.";
 for(const key of ["name","breed","color","city","neighborhood"] as const) if(fields[key].length > 90) errors[key] = "Use até 90 caracteres.";
 if(fields.status === "perdido" && !fields.name.trim()) errors.name = "Informe o nome do pet perdido.";
 for(const [key,label] of [["color","a cor"],["size","o porte"],["sex","o sexo"],["city","a cidade"],["neighborhood","o bairro"],["description","uma descrição"]]) if(!fields[key as keyof PetFields].trim()) errors[key] = `Informe ${label}.`;
 if(fields.description.trim().length < 20) errors.description = "Descreva o animal com pelo menos 20 caracteres.";
 if(fields.description.length > 1500) errors.description = "Use até 1.500 caracteres.";
 if(!validDate(fields.date)) errors.date = "Informe uma data válida.";
 else if(fields.date > today) errors.date = "A ocorrência não pode estar no futuro.";
 return errors;
}
export type LocalData = { pets: Pet[]; favorites: string[] };
export const storageKey = "petreturn-v1";
export function decodeData(raw: string | null): LocalData {
 if(raw === null) return { pets: [], favorites: [] };
 const parsed = JSON.parse(raw);
 if(!parsed || !Array.isArray(parsed.pets) || !parsed.pets.every(isPet) || !Array.isArray(parsed.favorites) || !parsed.favorites.every((v: unknown) => typeof v === "string") || new Set(parsed.pets.map((p: Pet) => p.id)).size !== parsed.pets.length) throw new Error("Dados locais inválidos");
 return { pets: parsed.pets, favorites: [...new Set<string>(parsed.favorites)] };
}
export function savePet(data: LocalData, pet: Pet): LocalData { return { ...data, pets: data.pets.some(p => p.id === pet.id) ? data.pets.map(p => p.id === pet.id ? pet : p) : [pet, ...data.pets] }; }
export function deletePet(data: LocalData, id: string): LocalData { return { pets: data.pets.filter(p => p.id !== id), favorites: data.favorites.filter(f => f !== id) }; }
export function toggleFavorite(data: LocalData, id: string): LocalData { return { ...data, favorites: data.favorites.includes(id) ? data.favorites.filter(f => f !== id) : [...data.favorites, id] }; }
export function newestPets(pets: Pet[]) { return [...pets].sort((a,b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)); }

type StoragePort = Pick<Storage,"getItem" | "setItem">;
export function persistChange(storage: StoragePort | null, current: LocalData, change: (data: LocalData) => LocalData, reset = false, volatile = false): { data: LocalData; warning: string; saved: boolean; blocked: boolean } {
 const unavailable = "O armazenamento está indisponível ou cheio. As alterações duram somente nesta sessão.";
 if(!storage) return { data: change(current), warning: unavailable, saved: false, blocked: false };
 let base = current;
 if(!reset) {
  let raw: string | null;
  try { raw = storage.getItem(storageKey); }
  catch { return { data: change(current), warning: unavailable, saved: false, blocked: false }; }
  try { const stored = decodeData(raw); if(!volatile) base = stored; }
  catch { return { data: change(current), warning: "Os dados salvos são inválidos e foram preservados. Novas alterações ficam nesta sessão. Para substituí-los, use Restaurar dados na Ajuda.", saved: false, blocked: true }; }
 }
 const data = change(base);
 try { storage.setItem(storageKey,JSON.stringify(data)); return { data, warning: "", saved: true, blocked: false }; }
 catch { return { data, warning: unavailable, saved: false, blocked: false }; }
}
