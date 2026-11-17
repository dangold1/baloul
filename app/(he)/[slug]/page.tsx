import { SubPage, subPageMetadata, subPageSlugs } from "@/components/pages/SubPage";

type Params = { slug: string };

export const dynamicParams = false;

export const generateStaticParams = (): Params[] => subPageSlugs.map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  return subPageMetadata("he", (await params).slug);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return <SubPage lang="he" slug={(await params).slug} />;
}
