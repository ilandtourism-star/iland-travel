import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PartnerNavbar from '../../components/layout/PartnerNavbar';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PartnerOnePackageDetail = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        country: 'Malaysia',
        city: '',
        address: '',
        postcode: '',
        lat: 5.2043828, // Default to Marang Jetty area
        lng: 103.2078479
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { addToast } = useToast();

    // Handle map search using Nominatim
    const handleSearch = async (autoSelect = false) => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`);
            const data = await response.json();
            setSearchResults(data);

            if (data.length > 0 && autoSelect) {
                selectLocation(data[0]);
            } else if (data.length === 0) {
                addToast('Lokasi tidak dijumpai. Sila cuba carian lain.', 'error');
            }
        } catch (error) {
            addToast('Ralat semasa mencari lokasi.', 'error');
        } finally {
            setSearching(false);
        }
    };

    const selectLocation = (result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Extract better address details if available
        const addr = result.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || '';
        const postcode = addr.postcode || '';

        setFormData(prev => ({
            ...prev,
            lat,
            lng: lon,
            city: city || prev.city,
            postcode: postcode || prev.postcode,
            address: result.display_name
        }));
        setSearchResults([]);
        setSearchQuery(result.display_name);
        addToast('Lokasi dipilih dan borang dikemas kini.', 'success');
    };

    // Handle reverse geocoding (coordinates to address)
    const handleReverseGeocode = async (lat, lng) => {
        setSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.address) {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || '';
                const postcode = addr.postcode || '';

                setFormData(prev => ({
                    ...prev,
                    city: city,
                    postcode: postcode,
                    address: data.display_name
                }));
                addToast('Alamat dikemas kini secara automatik.', 'success');
            }
        } catch (error) {
            console.error('Reverse geocode error:', error);
            addToast('Ralat semasa mencari alamat lokasi.', 'error');
        } finally {
            setSearching(false);
        }
    };

    // Custom component to handle map clicks/drags and keyboard events
    const MapEvents = () => {
        const markerRef = useRef(null);
        const map = useMap();

        useMapEvents({
            keydown(e) {
                if (e.originalEvent.key === 'Enter') {
                    handleReverseGeocode(formData.lat, formData.lng);
                }
            }
        });

        const eventHandlers = {
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    setFormData(prev => ({ ...prev, lat, lng }));
                }
            },
        };

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={[formData.lat, formData.lng]}
                ref={markerRef}>
            </Marker>
        );
    };

    // Component to recenter map when lat/lng changes from external search (if implemented)
    const RecenterMap = ({ lat, lng }) => {
        const map = useMap();
        useEffect(() => {
            map.setView([lat, lng]);
        }, [lat, lng, map]);
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (!formData.country || !formData.city || !formData.address || !formData.postcode) {
            addToast('Sila isikan semua maklumat lokasi sebelum meneruskan.', 'error');
            return;
        }
        console.log('Activity Data saved:', formData);
        navigate('/partner/departure-time');
    };

    return (
        <div className="partner-equipment-wrapper">
            <PartnerNavbar />
            <div className="container">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                    <div className="nav-card">
                        <div className="nav-header">Activity Information</div>
                        <div className="step done" onClick={() => navigate('/partner/activity-details')}>Details</div>
                        <div className="step active" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="main-content">
                    <div className="content-card">
                        <h1>Where is the meeting point?</h1>
                        <p className="subtitle">Guests will meet here to start the activity. Please ensure the location is accurate.</p>

                        <hr />

                        <div className="section-box">
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                {/* Form Inputs */}
                                <div className="form-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="input-group">
                                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Search Meeting Point</label>
                                        <div style={{ position: 'relative' }}>
                                            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', zIndex: 5 }}></i>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(true)}
                                                placeholder="Search for jetty, shop, or landmark..."
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                            />
                                            {searching && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#718096' }}>Carian...</div>}

                                            {/* Search Results Dropdown */}
                                            {searchResults.length > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    background: 'white',
                                                    border: '1px solid #cbd5e0',
                                                    borderRadius: '0 0 6px 6px',
                                                    zIndex: 1000,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {searchResults.map((result, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => selectLocation(result)}
                                                            style={{
                                                                padding: '10px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.85rem',
                                                                borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid #edf2f7'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                                                            onMouseLeave={(e) => e.target.style.background = 'white'}
                                                        >
                                                            {result.display_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="input-group">
                                            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Country</label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                            >
                                                <option value="" disabled>Select Country</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Thailand">Thailand</option>
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>City/Area</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Marang"
                                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Meeting Point Details</label>
                                        <textarea
                                            name="address"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Jetty name, shop number, or meeting point instructions..."
                                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'inherit', resize: 'none' }}
                                        ></textarea>
                                    </div>

                                    <div className="input-group">
                                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Postcode</label>
                                        <input
                                            type="text"
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 21080"
                                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', maxWidth: '150px' }}
                                        />
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
                                        <strong>Coordinates:</strong> {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                                    </div>
                                </div>

                                {/* Map Preview */}
                                <div className="map-section" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Map Preview</label>
                                    <div className="map-box" style={{
                                        flexGrow: 1,
                                        minHeight: '400px',
                                        background: '#edf2f7',
                                        border: '1px solid #cbd5e0',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        zIndex: 1
                                    }}>
                                        <MapContainer
                                            center={[formData.lat, formData.lng]}
                                            zoom={13}
                                            style={{ height: '100%', width: '100%' }}
                                            scrollWheelZoom={true}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <MapEvents />
                                            <RecenterMap lat={formData.lat} lng={formData.lng} />
                                        </MapContainer>

                                        <div className="map-pin-tip" style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'rgba(0,0,0,0.85)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            whiteSpace: 'nowrap',
                                            zIndex: 1000,
                                            pointerEvents: 'none',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span>Drag pin to exact location</span>
                                            <span style={{ fontSize: '0.7rem', color: '#cbd5e0', fontWeight: 'normal' }}>Then press <strong>Enter</strong> to auto-fill address</span>
                                        </div>
                                    </div>
                                    <p className="map-note" style={{ marginTop: '12px', fontSize: '0.85rem', color: '#718096', lineHeight: '1.4' }}>
                                        <i className="fas fa-info-circle" style={{ marginRight: '6px', color: '#5392f9' }}></i>
                                        Move the pin to the exact spot where guests should gather.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="partner-footer-actions">
                            <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                            <button className="partner-btn-primary" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerOnePackageDetail;

