import type { Metadata } from "next";
import { ShopwhizPreview } from "@/components/landing/shopwhiz-preview";

export const metadata: Metadata = {
  title: "Shopwhiz Preview",
  description: "Preview the AI-powered Shopwhiz shopping interface mockup.",
};

export default function PreviewPage() {
  return <ShopwhizPreview />;
}

