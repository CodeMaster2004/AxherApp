import SeasonsPageClient from "../../../../../features/seasons/view/SeasonsListView";



type Props = {
    params: Promise<{ contentId: string }>;
}

export default async function SeasonsPage({ params }: Props) {
    const { contentId } = await params;

    return <SeasonsPageClient seriesId={Number(contentId)} />
}
