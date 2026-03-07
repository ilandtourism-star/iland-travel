import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
                <h1 className="about-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>It Started With a Ruined Vacation...</h1>
                <p className="about-subtitle" style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                    The true story of how disappointment birthed the most trusted 'Ocean Navigators'.
                </p>
            </div>

            {/* Content Section */}
            <div className="about-content" style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', lineHeight: '1.8', color: '#334155', fontSize: '1.1rem' }}>

                <section className="about-section" style={{ marginBottom: '50px' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '20px' }}><i className="fas fa-ship" style={{ color: '#0ea5e9', marginRight: '10px' }}></i> The Origin Story</h2>
                    <p style={{ marginBottom: '20px' }}>
                        In 2022, a group of friends (including our founders) planned an epic getaway to the East Coast islands. We saved up, built an itinerary, and could barely sleep from excitement. But when we arrived at the jetty... the boat agent vanished. The glowing reviews we read online turned out to be fake. We were stranded, and our dream trip was completely shattered.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        That night, sitting under the fading stars by the beach, we made a promise: <strong>We never want another traveler to be fooled or disappointed again.</strong>
                    </p>
                    <p style={{ padding: '20px', background: '#f8fafc', borderLeft: '4px solid #0ea5e9', fontStyle: 'italic', borderRadius: '4px' }}>
                        "From that ruined vacation, <strong>iland</strong> was born. We swore to scout, filter, and only guide you to secret marine locations that are actually worth your money. We are not a regular travel agency; we are your personal 'Ocean Navigators' ensuring your story ends with awe, not regret."
                    </p>
                </section>

                <section className="about-section" style={{ marginBottom: '50px' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '20px' }}>Not Just Snorkeling: The 'Secret Inhabitants'</h2>
                    <p style={{ marginBottom: '20px' }}>
                        At <strong>iland</strong>, we believe the ocean is not a fake aquarium, but a bustling city. Unlucky tourists are usually dragged to see the 'rooftops' of dead reefs.
                    </p>
                    <p>
                        But with iland, you hold the keys. We navigate you past the tourist traps, straight into the 'secret alleys' of marine architecture. With us, you don't just swim—you hunt for the elusive Clownfish hiding in swaying anemones, or spot Seahorses blending perfectly into the coral. This is the ultimate 'Insider' experience for true ocean warriors.
                    </p>
                </section>

                {/* CTA Section */}
                <div className="about-cta-container" style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 10px 30px rgba(14,165,233,0.3)' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Let Us Guide Your Next Legend</h3>
                    <p style={{ marginBottom: '25px', color: '#e0f2fe' }}>Don't leave your vacation to chance. Join our Inner Circle today.</p>

                    <a href="/search" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#fbbf24",
                        color: "#0f172a",
                        padding: "15px 35px",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        textDecoration: "none",
                        boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)",
                        transition: "transform 0.3s ease"
                    }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <i className="fas fa-lock-open"></i> Join Our Secret Expedition
                    </a>

                    <div className="social-proof-text" style={{ marginTop: '25px', fontSize: '0.9rem', color: '#e0f2fe', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                        <div className="avatars" style={{ display: 'flex' }}>
                            <img src="https://i.pravatar.cc/100?img=12" alt="Avatar 1" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #2563eb', zIndex: 3 }} />
                            <img src="https://i.pravatar.cc/100?img=33" alt="Avatar 2" style={{ width: '32px', height: '32px', borderRadius: '50%', marginLeft: '-12px', border: '2px solid #2563eb', zIndex: 2 }} />
                            <img src="https://i.pravatar.cc/100?img=45" alt="Avatar 3" style={{ width: '32px', height: '32px', borderRadius: '50%', marginLeft: '-12px', border: '2px solid #2563eb', zIndex: 1 }} />
                        </div>
                        <span>Joined by <strong>1,200+ elite ocean explorers</strong> this year who refused to settle for basic trips.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
