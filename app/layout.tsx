import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"OutcomeGuard",description:"Evidence-backed resource-to-goal verification engine."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
