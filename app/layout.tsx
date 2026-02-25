import PokeballCursor from "@/src/Component/PokeBallCursor/pages";
import "./globals.css";
import Sidebar from "@/src/Component/SideBar/pages";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 cursor-none">
      <body className="flex selection:bg-cyan-500/30">
        <PokeballCursor />
        {/* <Sidebar /> */}
        {/* <main className="flex-1 ml-72 p-8 min-h-screen relative overflow-hidden">
          {/* Background Grid Decoration */}
        {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" /> */}

        <div className="flex">
          {children}
        </div>
        {/* </main> */}
      </body>
    </html>
  );
}