import { ReactNode } from "react";

export function Hero({ actions }: { actions?: ReactNode }) {
  return (
    <section className="container-grid py-20 sm:py-28">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          The World's First Hub Of Tech and Research Collaborations.
        </h1>
        <p className="text-base text-slate-600 max-w-2xl">
          A one-stop shop for founders and scientists to stay up to date with the latest projects in both academia and the startup world. We curate frontier projects that are pushing the boundaries across scientific fields.
        </p>
        {actions}
      </div>
    </section>
  );
}
