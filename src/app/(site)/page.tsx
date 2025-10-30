import { Hero } from "@/components/hero";
import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="pb-16">
      <Hero
        actions={
          <Link href="/collaborations" className="inline-block">
            <button className="btn-primary text-lg px-8 py-4">
              Explore
            </button>
          </Link>
        }
      />
    </div>
  );
}
