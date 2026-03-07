import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import PartnerNavbar from '../../components/layout/PartnerNavbar';
import { secureFetch } from '../../lib/api';

const API_BASE = '';

const PartnerPhotos = () => {
    const navigate = useNavigate();
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        sku: 'private-boat-10pax-kapas', // SKU yang sah dalam database
    };

    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const { addToast } = useToast();

    // Dapatkan gambar dari backend
    useEffect(() => {
        secureFetch(`${API_BASE}/api/v1/partner/photos`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.photos.length > 0) {
                    setPhotos(data.photos.map((p, i) => ({
                        id: i + 1,
                        src: `${API_BASE}${p.imageUrl}`,
                        alt: p.activityName,
                        sku: p.sku,
                        isMain: i === 0
                    })));
                }
            })
            .catch(() => { }); // Jika gagal, tunjuk galeri kosong
    }, []);

    // Upload gambar ke backend
    const handleUpload = async (file) => {
        if (!file) return;

        // Semak jenis fail
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            addToast('Hanya fail JPEG, PNG, atau WebP dibenarkan.', 'error');
            return;
        }

        // Semak saiz fail (5MB)
        if (file.size > 5 * 1024 * 1024) {
            addToast('Saiz fail melebihi had 5MB.', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await secureFetch(`${API_BASE}/api/v1/partner/photo/${activityData.sku}`, {
                method: 'POST',
                body: formData, // FormData is handled automatically by secureFetch
            });

            const data = await res.json();
            if (data.success) {
                // Tambah ke galeri terus (preview optimistik)
                const previewUrl = URL.createObjectURL(file);
                setPhotos(prev => [...prev, {
                    id: Date.now(),
                    src: previewUrl,
                    alt: file.name,
                    sku: activityData.sku
                }]);
                addToast('Gambar berjaya dimuat naik!', 'success');
            } else {
                addToast(data.message || 'Gagal muat naik gambar.', 'error');
            }
        } catch (err) {
            console.error('Upload error:', err);
            addToast(err.message || 'Ralat sambungan. Sila cuba lagi.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleUpload(file);
        e.target.value = ''; // Reset input
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const handleDeletePhoto = (id) => {
        if (window.confirm('Padam gambar ini?')) {
            setPhotos(photos.filter(p => p.id !== id));
            addToast('Gambar dipadam.', 'success');
        }
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
                        <div className="step done" onClick={() => navigate('/partner/one-package-detail')}>Meeting Point</div>
                        <div className="step done" onClick={() => navigate('/partner/departure-time')}>Departure Time</div>
                        <div className="step done" onClick={() => navigate('/partner/spots')}>Spots</div>
                        <div className="step done" onClick={() => navigate('/partner/equipment-service')}>Equipment & Service</div>
                        <div className="step done" onClick={() => navigate('/partner/pricing')}>Pricing</div>
                        <div className="step active" onClick={() => navigate('/partner/photos')}>Photos</div>
                        <div className="step" onClick={() => navigate('/partner/publish')}>Publish</div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Activity Photos</h1>
                            <p style={{ color: '#718096', marginTop: '4px' }}>Manage the images displayed on your activity listing.</p>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="partner-btn-primary"
                        >
                            <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                            {uploading ? 'Uploading...' : 'Upload Photos'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="content-card">
                        {/* Drag & Drop Zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${dragOver ? '#3182ce' : '#cbd5e0'}`,
                                borderRadius: '12px', padding: '32px', textAlign: 'center',
                                background: dragOver ? '#ebf8ff' : '#f7fafc',
                                cursor: 'pointer', marginBottom: '24px',
                                transition: 'all 0.2s', color: dragOver ? '#3182ce' : '#718096'
                            }}
                        >
                            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2.5rem', marginBottom: '12px', display: 'block' }}></i>
                            <p style={{ margin: 0, fontWeight: '600' }}>Drag & drop images here, or click to select</p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>JPEG, PNG, WebP — Maximum 5MB</p>
                        </div>

                        {/* Image Gallery */}
                        {photos.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                                <i className="fas fa-images" style={{ fontSize: '3rem', marginBottom: '12px', display: 'block' }}></i>
                                <p>No photos yet. Upload your first photo!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                                {photos.map(photo => (
                                    <div key={photo.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', aspectRatio: '4/3' }}>
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found'; }}
                                        />
                                        {photo.isMain && (
                                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(49,130,206,0.9)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                Main Photo
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDeletePhoto(photo.id)}
                                            style={{
                                                position: 'absolute', top: '8px', right: '8px',
                                                background: '#fff', color: '#e53e3e', border: '1px solid #fed7d7',
                                                borderRadius: '50%', width: '30px', height: '30px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                                            }}
                                            title="Delete Photo"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: '20px', background: '#ebf8ff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bee3f8' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#2c5282' }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                                The first image will be displayed as your activity's main cover photo.
                            </p>
                        </div>
                    </div>

                    {/* Footer Navigation Buttons */}
                    <div className="partner-footer-actions">
                        <button className="partner-btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <button className="partner-btn-primary" onClick={() => {
                            if (photos.length === 0) {
                                addToast('Sila muat naik sekurang-kurangnya satu gambar aktiviti.', 'error');
                                return;
                            }
                            navigate('/partner/publish');
                        }}>Next</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PartnerPhotos;
