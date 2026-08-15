import EpisodesPageClient from "../../../../../../../features/episodes/view/EpisodesListView";


type Props = {
  params: Promise<{ contentId: string; seasonId: string }>;
};

export default async function EpisodesPage({ params }: Props) {
  const { contentId, seasonId } = await params;
  return <EpisodesPageClient 
    contentId={Number(contentId)}
    seasonId={Number(seasonId)}
  />;
}