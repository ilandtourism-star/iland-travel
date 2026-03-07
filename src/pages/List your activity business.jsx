import React from 'react';
import { Link } from 'react-router-dom';

// Note: Real TikTok Logo.jpg was not found in the assets, using a placeholder path or you can import it if available.
// import tiktokLogo from '../assets/images/Real TikTok Logo.jpg'; 

const ListYourActivity = () => {
    return (
        <div style={styles.body}>

            <section style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroH1}>List your activities</h1>
                    <h3 style={styles.heroH3}>Snorkeling &bull; Private Boat Trip &bull; Squid Jigging</h3>
                    <Link to="/auth?redirect=/partner/activity-listing" style={styles.heroBtnLarge}>List your activity business</Link>
                </div>
            </section>

            <div style={styles.container}>
                <h2 style={styles.sectionTitle}>All you have to do</h2>

                <div style={styles.stepsGrid}>
                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>1</div>
                        <h4 style={styles.stepCardH4}>Sign Up</h4>
                        <p style={styles.stepCardP}>Sign in or sign up for a account instantly.</p>
                    </div>

                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>2</div>
                        <h4 style={styles.stepCardH4}>Upload Details</h4>
                        <p style={styles.stepCardP}>Upload your activity details, amazing photos, and descriptions.</p>
                    </div>

                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>3</div>
                        <h4 style={styles.stepCardH4}>Set Prices</h4>
                        <p style={styles.stepCardP}>Set your prices and manage your available dates easily.</p>
                    </div>

                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>4</div>
                        <h4 style={styles.stepCardH4}>Go Live</h4>
                        <p style={styles.stepCardP}>See your activities live in front of millions of travelers within 30 mins.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

const styles = {
    body: {
        margin: 0,
        padding: 0,
        fontFamily: "'Poppins', sans-serif",
        color: '#2a2a2e',
        backgroundColor: '#ffffff',
    },
    // Header styles removed
    heroSection: {
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '550px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '0 20px',
    },
    heroContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '8px',
        maxWidth: '600px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
    heroH1: {
        color: '#2a2a2e',
        fontSize: '2.2em',
        marginBottom: '10px',
        marginTop: 0,
        lineHeight: 1.2,
    },
    heroH3: {
        color: '#737373',
        fontWeight: 400,
        fontSize: '1.1em',
        marginBottom: '30px',
    },
    heroBtnLarge: {
        display: 'inline-block',
        backgroundColor: '#5392f9',
        color: 'white',
        fontSize: '1.2em',
        padding: '15px 40px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 600,
        width: '80%',
    },
    container: {
        maxWidth: '1000px',
        margin: '60px auto',
        padding: '0 20px',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: '2em',
        color: '#2a2a2e',
        marginBottom: '40px',
        marginTop: 0,
    },
    stepsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '30px',
        textAlign: 'left',
    },
    stepCard: {
        background: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    stepNumber: {
        backgroundColor: '#5392f9',
        color: 'white',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    stepCardH4: {
        margin: '0 0 10px 0',
        fontSize: '1.1em',
        color: '#2a2a2e',
    },
    stepCardP: {
        color: '#696969',
        fontSize: '0.95em',
        lineHeight: 1.5,
        margin: 0,
    },
    // Footer styles removed
};

export default ListYourActivity;
