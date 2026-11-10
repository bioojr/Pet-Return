import { Search } from "@/components/screens";
import { blankFilters } from "@/lib/pets";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
 const params = await searchParams;
 const text = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
 const initialFilters = { ...blankFilters, q:text("q"), regiao:text("regiao"), status:["perdido","encontrado"].includes(text("status")) ? text("status") : "" };
 return <Search key={JSON.stringify(initialFilters)} initialFilters={initialFilters}/>;
}
