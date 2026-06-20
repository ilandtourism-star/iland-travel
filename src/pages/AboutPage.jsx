import React from 'react';
import SEO from '../components/common/SEO';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <SEO 
                title="Our Story | The Ocean Navigators"
                description="Learn how a ruined vacation inspired the birth of iland trekking, Malaysia's most trusted island exploration agency."
                canonical="/about"
            />

            {/* Hero Section */}
            <div className="about-hero">
                <h1 className="about-title">It Started With a Ruined Vacation...</h1>
                <p className="about-subtitle">
                    The true story of how disappointment birthed the most trusted 'Ocean Navigators'.
                </p>
            </div>

            {/* Content Section */}
            <div className="about-content">
                <section className="about-section">
                    <h2><i className="fas fa-ship"></i> The Origin Story</h2>
                    <p>
                        In 2022, a group of friends planned an epic getaway to the East Coast islands. We saved up, built an itinerary, and could barely sleep from excitement. But when we arrived at the jetty... the boat agent vanished. The glowing reviews we read online turned out to be fake. We were stranded, and our dream trip was completely shattered.
                    </p>
                    <p>
                        That night, sitting under the fading stars by the beach, we made a promise: <strong>We never want another traveler to be fooled or disappointed again.</strong>
                    </p>
                    <div className="origin-quote">
                        "From that ruined vacation, <strong>ilaand</strong> was born. We swore to scout, filter, and only guide you to secret marine locations that are actually worth your money. We are not a regular travel agency; we are your personal 'Ocean Navigators' ensuring your story ends with awe, not regret."
                    </div>
                </section>

                <section className="about-section">
                    <h2><i className="fas fa-fish"></i> Not Just Snorkeling: The 'Secret Inhabitants'</h2>
                    <p>
                        At <strong>ilaand</strong>, we believe the ocean is not a fake aquarium, but a bustling city. Unlucky tourists are usually dragged to see the 'rooftops' of dead reefs.
                    </p>
                    <p>
                        But with iland, you hold the keys. We navigate you past the tourist traps, straight into the 'secret alleys' of marine architecture. With us, you don't just swim—you hunt for the elusive Clownfish hiding in swaying anemones, or spot Seahorses blending perfectly into the coral. This is the ultimate 'Insider' experience for true ocean explorers.
                    </p>
                </section>

                {/* CTA Section */}
                <div className="about-cta-container">
                    <h3>Let Us Guide Your Next Legend</h3>
                    <p>Don't leave your vacation to chance. Join our Inner Circle today.</p>

                    <a href="/search" className="about-cta-btn">
                        <i className="fas fa-lock-open"></i> Join Our Secret Expedition
                    </a>

                    <div className="social-proof-container">
                        <div className="avatar-group">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Explorer 1" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Explorer 2" />
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="Explorer 3" />
                        </div>
                        <div className="social-proof-text">
                            Joined by <strong>1,200+ elite ocean explorers</strong> this year who refused to settle for basic trips.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
