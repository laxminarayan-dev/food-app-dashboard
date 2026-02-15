import "../globals.css";
import Navbar from "@/components/Global/Navbar";

export const metadata = {
  title: "MrHalwai Admin Dashboard",
  description: "Admin dashboard for MrHalwai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-white text-slate-900 ">
          <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
            <Navbar />
            <div className="overflow-y-auto min-h-screen">
              <div className="ml-0 md:ml-64 p-4 bg-white">{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
