import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "KA Taxi Paris | Transferts Aéroportuaires de Prestige",
  description: "Service de taxi premium à Paris spécialisé dans les transferts vers CDG, Orly et Beauvais. Confort, ponctualité et discrétion.",
  keywords: "taxi paris, transfert aéroport, CDG, Orly, Beauvais, taxi premium, réservation taxi paris",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
