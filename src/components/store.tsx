"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Pet, examples, decodeData, storageKey, savePet, deletePet, toggleFavorite } from "@/lib/pets";
type Data = { pets: Pet[]; favorites: string[] };
type Store = Data & { ready: boolean; warning: string; save: (pet: Pet) => void; remove: (id: string) => void; toggle: (id: string) => void; reset: () => void; all: Pet[] };
const Context = createContext<Store | null>(null);
const key = storageKey;
export function PetProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<Data>({ pets: [], favorites: [] });
 const [ready, setReady] = useState(false);
 const [warning, setWarning] = useState("");
 useEffect(() => {
  try {
   setData(decodeData(localStorage.getItem(key)));
  } catch { setWarning("Não foi possível ler os dados salvos. Você pode continuar nesta sessão ou restaurar a demonstração na Ajuda."); }
  setReady(true);
 }, []);
 function update(next: Data) { setData(next); try { localStorage.setItem(key, JSON.stringify(next)); setWarning(""); } catch { setWarning("O armazenamento está indisponível ou cheio. As alterações duram somente nesta sessão."); } }
 return <Context.Provider value={{ ...data, ready, warning, all: [...data.pets, ...examples], save: pet => update(savePet(data,pet)), remove: id => update(deletePet(data,id)), toggle: id => update(toggleFavorite(data,id)), reset: () => update({ pets: [], favorites: [] }) }}>{children}</Context.Provider>;
}
export function usePets() { const value = useContext(Context); if (!value) throw new Error("Provider missing"); return value; }
