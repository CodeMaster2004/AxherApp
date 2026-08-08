
import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "@/widgets/media/HeroSection";
import { HeroContent } from "@/entities/types";
import { API_URL } from "@/core/api/axiosClient";
import UpcomingCarousel from "@/features/upcoming/components/UpcomingCarousel";
import TrendingSection from "@/features/popularity/components/TrendingSection";
import ContinueWatchingSection from "@/features/playbackHistory/components/ContinueWatchingSection";
import TopRatedSection from "@/features/popularity/components/TopRatedSection";



const trendingNow = [
    {
        id: 1,
        title: "Last Season",
        image:
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=520&q=80",
    },
    {
        id: 2,
        title: "Dune",
        image:
            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=520&q=80",
    },
    {
        id: 3,
        title: "Shang-Chi",
        image:
            "https://images.unsplash.com/photo-1615986200762-43f7c4e4d0e9?auto=format&fit=crop&w=520&q=80",
    },
    {
        id: 4,
        title: "A Quiet Place II",
        image:
            "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?auto=format&fit=crop&w=520&q=80",
    },
];

async function getHero(): Promise<HeroContent[]> {

    const res = await fetch(`${API_URL}/hero`, {
        next: {
            revalidate: 60, // Revalidate every 60 seconds
        },
    });

    if(!res.ok){
        return [];
    }
    return res.json();
}

export default async function Home() {
    const hero = await getHero();
    return (
        <main className={styles.page}>
            <HeroSection hero={hero}/>

            <section className={styles.contentWrap}>

           <header className={styles.sectionHeader}>
            <div className={styles.filterPills}>
                <button type="button" className={`${styles.pill} ${styles.activePill}`}>
                    Movies
                </button>
                <button type="button" className={styles.pill}>TV Shows</button>
                <button type="button" className={styles.pill}>Anime</button>
            </div>
            </header>
            <UpcomingCarousel></UpcomingCarousel>
            <TrendingSection></TrendingSection>
            <ContinueWatchingSection></ContinueWatchingSection>
            <TopRatedSection></TopRatedSection>


    

                <section className={styles.trendingSection}>
                    <h2 className={styles.trendingTitle}>Trending Now</h2>
                    <article className={styles.trendingBanner}>
                        <Image
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80"
                            alt="Trending banner"
                            width={1400}
                            height={620}
                        />
                        <div className={styles.trendingOverlay}>
                            <h3>Squid Game</h3>
                            <p>
                                A story of people who failed at life but suddenly receive a mysterious invitation
                                to survive deadly games.
                            </p>
                            <button type="button">Play Now</button>
                        </div>
                    </article>

                    <div className={styles.trendingRail}>
                        {trendingNow.map((item) => (
                            <article key={item.id} className={styles.episodeCard}>
                                <Image src={item.image} alt={item.title} width={520} height={290} />
                                <span>{item.title}</span>
                            </article>
                        ))}
                    </div>
                </section>

                <footer className={styles.footerLinks}>
                    <div>
                        <h5>Download app</h5>
                        <p>App Store</p>
                        <p>Google Play</p>
                    </div>
                    <div>
                        <h5>Resources</h5>
                        <p>About us</p>
                        <p>Pricing Plan</p>
                        <p>Help</p>
                    </div>
                    <div>
                        <h5>Legal</h5>
                        <p>Terms of use</p>
                        <p>Privacy Policy</p>
                        <p>Security</p>
                    </div>
                    <div>
                        <h5>Contact</h5>
                        <p>+51 900 000 000</p>
                        <p>hello@zstream.app</p>
                    </div>
                </footer>
            </section>
        </main>
    );
}
