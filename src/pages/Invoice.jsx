import React, { useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, CheckCircle, MapPin, Calendar, Users, CreditCard, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { secureFetch } from '../lib/api';
import { getDisplayPackageName } from '../utils/activityLinks';

const invoiceReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                booking: action.payload,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const Invoice = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(invoiceReducer, {
        booking: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchBooking = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const response = await secureFetch(`/api/v1/booking/invoice/${bookingId}`);
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.booking });
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: data.message || "Receipt not found." });
                }
            } catch (err) {
                console.error("Error fetching invoice:", err);
                dispatch({ type: 'FETCH_FAILURE', payload: err.message });
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('invoice-content');
        if (!element) return;

        try {
            // Temporarily hide shadows and handle text scaling for better PDF quality
            const originalShadow = element.style.boxShadow;
            element.style.boxShadow = 'none';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            element.style.boxShadow = originalShadow;

            const imgData = canvas.toDataURL('image/png');

            // Calculate a proper A4 size proportional scaling
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ILAAND_Invoice_${bookingId || 'booking'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please use the Print option as an alternative.");
        }
    };

    if (state.loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading Invoice...</div>;

    if (state.error || !state.booking) return (
        <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins' }}>
            <h2>Invoice Error</h2>
            <p style={{ color: '#e53e3e' }}>{state.error || "Booking data is empty."}</p>
            <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Home</button>
        </div>
    );

    const { booking } = state;

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { 
                        background-color: white !important; 
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print { display: none !important; }
                    .invoice-card { 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important; 
                        width: 100% !important; 
                        max-width: 100% !important;
                        padding: 20px !important;
                    }
                    /* Ensure background colors print properly */
                    .bg-blue-dark { background-color: #0f172a !important; color: white !important; }
                    .bg-green-light { background-color: #f0fdf4 !important; border: 1px solid #dcfce7 !important; }
                    .bg-gray-light { background-color: #f8fafc !important; }
                }
                
                .receipt-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px;
                    font-weight: 900;
                    color: rgba(34, 197, 94, 0.05); /* very light green */
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }
            `}</style>

            <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', border: 'none', background: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>
                        <Printer size={18} /> Print
                    </button>
                    <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(30,41,59,0.3)' }}>
                        <Download size={18} /> Save PDF
                    </button>
                </div>
            </div>

            <div id="invoice-content" className="invoice-card" style={{
                maxWidth: '850px', margin: '0 auto', backgroundColor: 'white',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                position: 'relative', overflow: 'hidden'
            }}>
                <div className="receipt-watermark">PAID</div>

                {/* Header Section */}
                <div className="bg-blue-dark" style={{
                    backgroundColor: '#0f172a', /* darker, more premium blue */
                    padding: '40px 48px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: '900', fontSize: '20px' }}>I</div>
                            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: 'white' }}>ILAAND</h1>
                        </div>
                        <p style={{ opacity: 0.8, margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                            ilaand Travel & Tours Sdn Bhd<br />
                            Jeti Marang, 21600 Marang<br />
                            Terengganu, Malaysia
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '2px', color: 'white' }}>INVOICE</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginTop: '16px' }}>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.7, fontWeight: '600', marginBottom: '4px' }}>Invoice Number</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>INV-{booking.id.substring(0, 8).toUpperCase()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.7, fontWeight: '600', marginBottom: '4px' }}>Date Issued</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>{new Date(booking.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '48px', position: 'relative', zIndex: 1 }}>
                    {/* Payment Status Banner */}
                    <div className="bg-green-light" style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        borderRadius: '8px',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '40px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle size={24} color="#16a34a" />
                            <div>
                                <div style={{ fontWeight: '700', color: '#166534', fontSize: '16px' }}>Payment Successfully Received</div>
                                <div style={{ fontSize: '13px', color: '#166534', opacity: 0.8 }}>Paid via Secure Checkout on {new Date(booking.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#166534', opacity: 0.8, fontWeight: '600', textTransform: 'uppercase' }}>Amount Paid</div>
                            <div style={{ fontWeight: '800', color: '#166534', fontSize: '20px' }}>RM {parseFloat(booking.total_price).toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Customer Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>
                        <div>
                            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.05em' }}>Billed To</h3>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '18px', marginBottom: '4px' }}>{booking.firstName}</div>
                            <div style={{ color: '#475569', fontSize: '14px', marginBottom: '2px' }}>{booking.email}</div>
                            {booking.phone && <div style={{ color: '#475569', fontSize: '14px' }}>{booking.phone}</div>}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.05em' }}>Activity Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'x 12px', rowGap: '8px', fontSize: '14px' }}>
                                <div style={{ color: '#64748b' }}>Date:</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(booking.date).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

                                <div style={{ color: '#64748b' }}>Guests:</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{booking.pax} Pax ({booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''})</div>

                                {booking.arrival_time && (
                                    <>
                                        <div style={{ color: '#64748b' }}>Arrival:</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{booking.arrival_time}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Table */}
                    <div style={{ marginBottom: '40px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr className="bg-gray-light" style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #0f172a', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ textAlign: 'left', padding: '16px 8px', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Item Description</th>
                                    <th style={{ textAlign: 'center', padding: '16px 8px', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Quantity</th>
                                    <th style={{ textAlign: 'right', padding: '16px 8px', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Unit Price (RM)</th>
                                    <th style={{ textAlign: 'right', padding: '16px 8px', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Total (RM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '24px 8px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px', marginBottom: '8px' }}>{getDisplayPackageName(booking.vacation_sku, booking.packageName)}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Activity Location / Boarding Point</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Scheduled for {new Date(booking.date).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontSize: '15px' }}>
                                        {booking.pax}
                                    </td>
                                    <td style={{ padding: '24px 8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontSize: '15px' }}>
                                        {/* Estimate unit price since backend only stores total usually */}
                                        {(parseFloat(booking.total_price) / booking.pax).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '24px 8px', textAlign: 'right', fontWeight: '700', borderBottom: '1px solid #e2e8f0', color: '#0f172a', fontSize: '16px' }}>
                                        {parseFloat(booking.total_price).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                        <div style={{ width: '350px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px', color: '#64748b', fontSize: '14px' }}>
                                <span>Subtotal</span>
                                <span>RM {parseFloat(booking.total_price).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px', color: '#64748b', fontSize: '14px' }}>
                                <span>Taxes & Fees</span>
                                <span>RM 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 8px', borderTop: '2px solid #0f172a', marginTop: '8px', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>Grand Total</span>
                                <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '24px' }}>RM {parseFloat(booking.total_price).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Payment Notes</h4>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                Marine park fees and conservation taxes are not included in this invoice and must be paid separately at the departing jetty counter. Please present this invoice (digital or physical) upon arrival.
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Need Help?</h4>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                                Contact us at support@iland.com<br />
                                or call +60 12-345 6789 during business hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
