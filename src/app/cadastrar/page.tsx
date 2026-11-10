import { PetForm } from "@/components/pet-form";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
 const params = await searchParams;
 const editId = typeof params.editar === "string" ? params.editar : null;
 const status = params.status === "encontrado" ? "encontrado" : "perdido";
 return <PetForm key={`${editId ?? "novo"}:${status}`} editId={editId} initialStatus={status}/>;
}
