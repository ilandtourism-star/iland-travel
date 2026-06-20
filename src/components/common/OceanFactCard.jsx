import React, { useState, useEffect } from 'react';

const OceanFactCard = () => {
    return null; // Temporarily disabled

    const [fact, setFact] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [visible, setVisible] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Keyword mapping for images
    const getKeyword = (text) => {
        const lowerText = text.toLowerCase();

        // --- SPECIFIC LOCATIONS & REGIONS ---
        if (lowerText.includes('mexico') || lowerText.includes('cenote')) return 'mexico,underwater,cave';
        if (lowerText.includes('mariana')) return 'deep-sea,trench';
        if (lowerText.includes('baltic')) return 'baltic-sea,shipwreck';
        if (lowerText.includes('bermuda')) return 'bermuda-triangle,ocean';
        if (lowerText.includes('maldives')) return 'maldives,resort,beach';
        if (lowerText.includes('brazil')) return 'brazil,ocean';
        if (lowerText.includes('antarctika') || lowerText.includes('artik') || lowerText.includes('kutub')) return 'arctic,ice,ocean';
        if (lowerText.includes('perhentian')) return 'perhentian-island,beach';
        if (lowerText.includes('redang')) return 'redang-island,coral';
        if (lowerText.includes('kapas')) return 'kapas-island,white-sand';
        if (lowerText.includes('tioman')) return 'tioman-island,jungle';
        if (lowerText.includes('sipadan')) return 'sipadan,diving,turtle';
        if (lowerText.includes('langkawi')) return 'langkawi,geopark';
        if (lowerText.includes('mabul')) return 'mabul-island,water-bungalow';
        if (lowerText.includes('bali')) return 'bali,beach,temple';
        if (lowerText.includes('komodo')) return 'komodo-dragon,island';
        if (lowerText.includes('galápagos') || lowerText.includes('galapagos')) return 'galapagos,tortoise';
        if (lowerText.includes('santorini')) return 'santorini,volcano';

        // --- MARINE ANIMALS (EXTENDED) ---
        if (lowerText.includes('megalodon')) return 'megalodon,shark,monster';
        if (lowerText.includes('orca') || lowerText.includes('paus pembunuh')) return 'orca,killer-whale';
        if (lowerText.includes('paus biru') || lowerText.includes('blue whale')) return 'blue-whale';
        if (lowerText.includes('paus sperma')) return 'sperm-whale';
        if (lowerText.includes('humpback') || lowerText.includes('paus bungkuk')) return 'humpback-whale';
        if (lowerText.includes('paus')) return 'whale';
        if (lowerText.includes('hiu') || lowerText.includes('jerung') || lowerText.includes('yu')) {
            if (lowerText.includes('putih') || lowerText.includes('white')) return 'great-white-shark';
            if (lowerText.includes('martillo') || lowerText.includes('tukul')) return 'hammerhead-shark';
            return 'shark';
        }
        if (lowerText.includes('lumba-lumba') || lowerText.includes('dolphin')) return 'dolphin';
        if (lowerText.includes('penyu') || lowerText.includes('turtle')) return 'sea-turtle';
        if (lowerText.includes('sotong kurita') || lowerText.includes('octopus')) return 'octopus';
        if (lowerText.includes('sotong') || lowerText.includes('squid')) return 'squid';
        if (lowerText.includes('pari') || lowerText.includes('ray')) return 'manta-ray,stingray';
        if (lowerText.includes('obor-obor') || lowerText.includes('jellyfish')) return 'jellyfish';
        if (lowerText.includes('kuda laut') || lowerText.includes('seahorse')) return 'seahorse';
        if (lowerText.includes('ikan badut') || lowerText.includes('clownfish') || lowerText.includes('nemo')) return 'clownfish';
        if (lowerText.includes('belut') || lowerText.includes('eel')) return 'moray-eel';
        if (lowerText.includes('kuda laut') || lowerText.includes('seahorse')) return 'seahorse';
        if (lowerText.includes('nudibranch')) return 'nudibranch,sea-slug';
        if (lowerText.includes('dugong')) return 'dugong,manatee';

        // --- SHIPWRECKS & HISTORY ---
        if (lowerText.includes('titanic')) return 'titanic,shipwreck';
        if (lowerText.includes('bangkai kapal') || lowerText.includes('kapal karam') || lowerText.includes('shipwreck')) return 'shipwreck,underwater';
        if (lowerText.includes('lanun') || lowerText.includes('pirate')) return 'pirate-ship,treasure';
        if (lowerText.includes('emas') || lowerText.includes('harta')) return 'gold,treasure,underwater';
        if (lowerText.includes('chengho') || lowerText.includes('cheng ho')) return 'ancient-chinese-ship';
        if (lowerText.includes('viking')) return 'viking-ship';

        // --- PHENOMENA & GEOGRAPHY ---
        if (lowerText.includes('gunung berapi') || lowerText.includes('volcano')) return 'underwater-volcano';
        if (lowerText.includes('tsunami')) return 'tsunami,big-wave';
        if (lowerText.includes('arus') || lowerText.includes('current')) return 'ocean-current';
        if (lowerText.includes('terumbu karang') || lowerText.includes('coral')) return 'coral-reef';
        if (lowerText.includes('bioluminesen') || lowerText.includes('cahaya') || lowerText.includes('blue tears')) return 'bioluminescence,night-ocean';
        if (lowerText.includes('salji laut') || lowerText.includes('sea snow')) return 'marine-snow,deep-sea';
        if (lowerText.includes('sungai') && lowerText.includes('laut')) return 'underwater-river';
        if (lowerText.includes('tasik') && lowerText.includes('laut')) return 'underwater-lake';
        if (lowerText.includes('kabel')) return 'submarine-cable';
        if (lowerText.includes('oksigen') || lowerText.includes('fitoplankton')) return 'plankton,ocean';
        if (lowerText.includes('rumah api') || lowerText.includes('lighthouse')) return 'lighthouse';
        if (lowerText.includes('pantai pink') || lowerText.includes('pink beach')) return 'pink-beach';

        return 'ocean,underwater,marine-life';
    };

    useEffect(() => {
        const fetchFact = async () => {
            try {
                const today = new Date().toLocaleDateString('en-CA');
                const cachedData = localStorage.getItem('oceanFactCache');

                if (cachedData) {
                    const parsed = JSON.parse(cachedData);
                    if (parsed.date === today) {
                        setFact(parsed.fact);
                        setImageUrl(parsed.imageUrl);
                        setTimeout(() => setVisible(true), 1000);
                        return;
                    }
                }

                // Fetch random fact from our new API
                const response = await fetch('/api/v1/ocean-fact/random');
                const data = await response.json();
                if (data.success) {
                    setFact(data.fact);
                    const keyword = getKeyword(data.fact);
                    const newImageUrl = `https://loremflickr.com/400/250/${keyword}?random=${Math.floor(Math.random() * 1000)}`;
                    setImageUrl(newImageUrl);

                    localStorage.setItem('oceanFactCache', JSON.stringify({
                        date: today,
                        fact: data.fact,
                        imageUrl: newImageUrl
                    }));

                    // Show with a slight delay for better effect
                    setTimeout(() => setVisible(true), 1000);
                }
            } catch (error) {
                console.error('Error fetching ocean fact:', error);
            }
        };

        fetchFact();
    }, []);

    const fallbackCopyTextToClipboard = (text, successMessage) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert(successMessage);
            } else {
                alert('Failed to copy text.');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Failed to copy text.');
        }

        document.body.removeChild(textArea);
        setShowShareMenu(false);
    };

    const copyToClipboard = (text, successMessage) => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text, successMessage);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            alert(successMessage);
            setShowShareMenu(false);
        }).catch(err => {
            console.error('Async: Could not copy text: ', err);
            fallbackCopyTextToClipboard(text, successMessage);
        });
    };

    const handleShare = (platform) => {
        const shareUrl = window.location.href;
        const shareText = `Did you know: "${fact}"| ilaandn| ilaandn- Brought to you by iland, explore our secret oceans today!`;

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'download-image':
                downloadImageCard();
                return;
            case 'copy-text':
                copyToClipboard(fact, 'Ocean Fact copied!');
                return;
            case 'copy-link':
                copyToClipboard(shareUrl, 'Link copied to clipboard!');
                return;
        }
        if (url) {
            window.open(url, '_blank');
            setShowShareMenu(false);
        }
    };

    // Make Fact a Watermarked Downloadable Image (Behavioral Residue)
    const downloadImageCard = async () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 600;
            canvas.height = 650;

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Header Background
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, 100);

            // Header Text (Watermark 1)
            ctx.fillStyle = '#0ea5e9';
            ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ILAAND OCEAN FACT', 300, 60);

            // Load Image
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
            });

            // Draw image in middle
            ctx.drawImage(img, 0, 100, 600, 300);

            // Draw Fact Text
            ctx.fillStyle = '#1e293b';
            ctx.font = 'italic 22px Georgia, serif';
            ctx.textAlign = 'center';

            const words = `"${fact}"`.split(' ');
            let line = '';
            let y = 460;
            const maxWidth = 500;
            const lineHeight = 30;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    ctx.fillText(line.trim(), 300, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line.trim(), 300, y);

            // Draw Footer Watermark (Behavioral Residue)
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
            ctx.fillText('Explore hidden oceans at www.iland.com', 300, 620);

            // Trigger download
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'iland-ocean-fact.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setShowShareMenu(false);
        } catch (err) {
            console.error('Canvas error:', err);
            alert('Browser prevented image generation due to security. Please screenshot the card instead!');
        }
    };

    if (!fact) return null;

    return (
        <>
            <style>
                {`
                .ocean-fact-card {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    max-width: 300px;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform: translateY(120%) scale(0.9);
                    opacity: 0;
                    overflow: hidden;
                    pointer-events: none;
                    display: flex;
                    flex-direction: column;
                }

                .ocean-fact-card.visible {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                    pointer-events: all;
                }

                .fact-image-container {
                    width: 100%;
                    height: 140px;
                    overflow: hidden;
                    position: relative;
                }

                .fact-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }

                .ocean-fact-card:hover .fact-image {
                    transform: scale(1.1);
                }

                .fact-content {
                    padding: 16px 20px 20px;
                }

                .fact-badge {
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    color: #4a68de;
                    display: block;
                    margin-bottom: 8px;
                }

                .fact-text {
                    color: #1a1a1a;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                    font-weight: 500;
                }

                .fact-actions {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    display: flex;
                    gap: 6px;
                    z-index: 10;
                }

                .fact-btn {
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(4px);
                    border: none;
                    color: white;
                    cursor: pointer;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    font-size: 12px;
                }

                .fact-btn:hover {
                    background: rgba(0, 0, 0, 0.6);
                    transform: scale(1.1);
                }

                .copy-feedback {
                    position: absolute;
                    top: -35px;
                    right: 0;
                    background: #4a68de;
                    color: white;
                    font-size: 10px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s;
                    pointer-events: none;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(74, 104, 222, 0.3);
                }

                .copy-feedback.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Share Menu Styles */
                .fact-share-menu {
                    position: absolute;
                    top: 45px;
                    right: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 100;
                    min-width: 140px;
                    animation: scaleIn 0.2s ease;
                }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .share-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #333;
                    font-size: 12px;
                    font-weight: 600;
                    background: transparent;
                    border: none;
                    width: 100%;
                    text-align: left;
                }
                .share-menu-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                .share-menu-item i {
                    width: 16px;
                    font-size: 14px;
                }

                @media (max-width: 480px) {
                    .ocean-fact-card {
                        bottom: 20px;
                        right: 20px;
                        left: 20px;
                        max-width: none;
                    }
                }
                `}
            </style>
            <div className={`ocean-fact-card ${visible ? 'visible' : ''}`}>
                <div className="fact-image-container">
                    <img src={imageUrl} alt="Ocean Fact" className="fact-image" />
                    <div className="fact-actions">
                        <button className="fact-btn" title="Share Fact" onClick={() => setShowShareMenu(!showShareMenu)}>
                            <i className="fas fa-share-alt"></i>
                        </button>
                        <button className="fact-btn" title="Close" onClick={() => setVisible(false)}>
                            <i className="fas fa-times"></i>
                        </button>

                        {showShareMenu && (
                            <div className="fact-share-menu">
                                <button className="share-menu-item" onClick={() => handleShare('whatsapp')}>
                                    <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp
                                </button>
                                <button className="share-menu-item" onClick={() => handleShare('facebook')}>
                                    <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i> Facebook
                                </button>
                                <button className="share-menu-item" onClick={() => handleShare('twitter')}>
                                    <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i> X (Twitter)
                                </button>
                                <button className="share-menu-item" onClick={() => handleShare('download-image')}>
                                    <i className="fas fa-download" style={{ color: '#ff3366' }}></i> Save Image Card
                                </button>
                                <button className="share-menu-item" onClick={() => handleShare('copy-text')}>
                                    <i className="fas fa-quote-left" style={{ color: '#666' }}></i> Copy Fact
                                </button>
                                <button className="share-menu-item" onClick={() => handleShare('copy-link')}>
                                    <i className="fas fa-link" style={{ color: '#00ffff' }}></i> Copy Link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="fact-content">
                    <span className="fact-badge">Ocean Fact</span>
                    <p className="fact-text">"{fact}"</p>
                </div>
            </div>
        </>
    );
};

export default OceanFactCard;
