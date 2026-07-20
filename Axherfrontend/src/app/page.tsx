
import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from "@/widgets/media/HeroSection";
import { HeroContent } from "@/entities/types";
import { API_URL } from "@/core/api/axiosClient";

const upcomingMovies = [
    {
        id: 1,
        title: "Moonfall",
        year: "2022",
        image:
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80",
        tag: "Action · Adventure · Sci-Fi",
    },
    {
        id: 2,
        title: "Lightyear",
        year: "2022",
        image:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80",
        tag: "Animation · Action · Comedy",
    },
    {
        id: 3,
        title: "Spiderman: No Way Home",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=900&q=80",
        tag: "Action · Adventure · Sci-Fi",
    },
    {
        id: 4,
        title: "Spiderman: No Way Home",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=900&q=80",
        tag: "Action · Adventure · Sci-Fi",
    },
];

const popularShows = [
    {
        id: 1,
        title: "Joker",
        year: "2019",
        image:
            "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 2,
        title: "Avatar",
        year: "2009",
        image:
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 3,
        title: "The Accused",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 4,
        title: "Fauci",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 5,
        title: "Shang-Chi",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 6,
        title: "Avengers Endgame",
        year: "2019",
        image:
            "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 7,
        title: "Dune",
        year: "2021",
        image:
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=720&q=80",
    },
    {
        id: 8,
        title: "Toy Story 4",
        year: "2019",
        image:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=720&q=80",
    },
];

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
                    <div>
                        <p className={styles.kicker}>Online streaming</p>
                        <h2 className={styles.sectionTitle}>Upcoming Movies</h2>
                    </div>
                    <div className={styles.filterPills}>
                        <button type="button" className={`${styles.pill} ${styles.activePill}`}>
                            Movies
                        </button>
                        <button type="button" className={styles.pill}>TV Shows</button>
                        <button type="button" className={styles.pill}>Anime</button>
                    </div>
                </header>

                <div className={styles.posterRail}>
                    {upcomingMovies.map((movie) => (
                        <article key={movie.id} className={styles.posterCard}>
                            <Image src={movie.image} alt={movie.title} width={520} height={780} />
                            <div className={styles.posterMeta}>
                                <h3>{movie.title}</h3>
                                <p>{movie.tag}</p>
                                <span>{movie.year}</span>
                            </div>
                        </article>
                    ))}
                </div>

                <header className={styles.subHeader}>
                    <p className={styles.kicker}>Online streaming</p>
                    <h2 className={styles.sectionTitle}>Popular Shows</h2>
                </header>

                <div className={styles.cardGrid}>
                    {popularShows.map((show) => (
                        <article key={show.id} className={styles.showCard}>
                            <Image src={show.image} alt={show.title} width={420} height={560} />
                            <div className={styles.showMeta}>
                                <h4>{show.title}</h4>
                                <span>{show.year}</span>
                            </div>
                        </article>
                    ))}
                </div>

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
