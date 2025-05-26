import { ThemeProvider } from "next-themes";

export default function Wrapper({children}: {children: React.ReactNode}) {
    return <ThemeProvider attribute={"class"} enableSystem defaultTheme="system">{children}</ThemeProvider>
}