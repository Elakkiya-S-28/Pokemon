import PokeballCursor from "@/src/Component/PokeBallCursor/pages";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="cursor-none">
      <body className="bg-[#0a0410] antialiased">
        <PokeballCursor />
        {/* Removed 'flex' class here to allow children to be full-width */}
        <main className="min-h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}