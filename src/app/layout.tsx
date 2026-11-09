import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PetProvider } from "@/components/store";
import { Header, Footer, StorageNotice } from "@/components/ui";
const geist = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist", weight: "100 900" });
export const metadata: Metadata = { title: "PetReturn | Um caminho de volta para casa", description: "Ajude animais perdidos a reencontrarem suas famílias. Demonstração local com dados fictícios." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={geist.variable}><PetProvider><Header/><StorageNotice/><main id="conteudo">{children}</main><Footer/></PetProvider></body></html>; }
