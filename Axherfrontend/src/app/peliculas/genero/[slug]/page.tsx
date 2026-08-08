import { ContentType } from "@/entities/types";
import ContentCatalog from "@/features/contents/components/ContentCatalog";

interface Props {
    params: Promise<{
        slug: string;
    }>;

}
    
export default async function GenrePage({ params }: Props){
        const { slug } = await params;

        return (
            <ContentCatalog
                slug={slug}
                type={ContentType.MOVIE}
                basePath="/peliculas"
            />
        )
        
    }