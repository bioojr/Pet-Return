"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Pet, LocalData, examples, decodeData, storageKey, savePet, deletePet, toggleFavorite, newestPets, persistChange } from "@/lib/pets";
type Store = LocalData & { ready: boolean; warning: string; save: (pet: Pet) => Promise<void>; remove: (id: string) => Promise<void>; toggle: (id: string) => Promise<void>; reset: () => Promise<void>; all: Pet[] };
const Context = createContext<Store | null>(null);
export function PetProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<LocalData>({ pets: [], favorites: [] });
 const current = useRef(data);
 const queue = useRef<Promise<void>>(Promise.resolve());
 const volatile = useRef(false);
 const [ready, setReady] = useState(false);
 const [warning, setWarning] = useState("");
 function commit(next: LocalData) { current.current = next; setData(next); }
 useEffect(() => {
  try { commit(decodeData(localStorage.getItem(storageKey))); }
  catch { setWarning("Não foi possível ler os dados salvos. Eles serão preservados até você restaurar a demonstração na Ajuda. Novas alterações podem durar somente nesta sessão."); }
  setReady(true);
  function sync(event: StorageEvent) {
   if(event.key !== storageKey && event.key !== null) return;
   if(volatile.current) return;
   try { commit(decodeData(event.newValue)); setWarning(""); }
   catch { setWarning("Outra aba alterou os dados para um formato inválido. Os dados atuais foram mantidos nesta sessão."); }
  }
  window.addEventListener("storage",sync);
  return () => window.removeEventListener("storage",sync);
 }, []);
 function update(change: (base: LocalData) => LocalData, reset = false) {
  function run() {
   let storage: Storage | null = null;
   try { storage = window.localStorage; } catch { /* Continue in memory. */ }
   const result = persistChange(storage,current.current,change,reset,volatile.current);
   commit(result.data);
   // Invalid stored data must never be overwritten by a subsequent mutation.
   volatile.current = !result.saved && !result.blocked;
   setWarning(result.warning);
  }
  const task = queue.current.then(async () => {
   if(navigator.locks) await navigator.locks.request(storageKey,run).catch(run);
   else run();
  });
  queue.current = task.catch(() => { setWarning("Não foi possível concluir a alteração. Tente novamente."); });
  return task;
 }
 return <Context.Provider value={{ ...data, ready, warning, all: newestPets([...data.pets,...examples]), save: pet => update(base => savePet(base,pet)), remove: id => update(base => deletePet(base,id)), toggle: id => update(base => toggleFavorite(base,id)), reset: () => update(() => ({ pets: [], favorites: [] }),true) }}>{children}</Context.Provider>;
}
export function usePets() { const value = useContext(Context); if (!value) throw new Error("Provider missing"); return value; }
