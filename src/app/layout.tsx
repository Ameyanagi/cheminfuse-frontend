import "../styles/globals.css";
import footer from './footer';
import Navibar from "../components/Navibar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html>
      <head />
      <body>
        <div className="bg-[#fafafa]">
        <Navibar />
        {children}
        {footer}
        </div>
        </body>
    </html>
  );
};
