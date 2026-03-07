import React from 'react';
import ActivityNavbar from '../../components/layout/ActivityNavbar';
import imgPrivateBoat from '../../assets/images/Private Boat Trip/family.png';

const PartnerPrivacyPolicy = () => {
    const activityData = {
        name: 'Private Family Trip in Kapas Island',
        id: '9001234',
        image: imgPrivateBoat,
    };

    return (
        <>
            <ActivityNavbar
                activityName={activityData.name}
                activityId={activityData.id}
                activityImage={activityData.image}
            />
            <div className="activity-dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Privacy Policy</h1>
                        <p style={{ color: '#718096', marginTop: '4px' }}>Last updated: January 1, 2024</p>
                    </div>
                </div>

                <div className="card-simple" style={{ padding: '40px' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', color: '#2d3748', lineHeight: '1.8' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>1. Introduction</h2>
                        <p style={{ marginBottom: '24px' }}>
                            Welcome to the Partner Portal. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>2. Important Information and Who We Are</h2>
                        <p style={{ marginBottom: '24px' }}>
                            This privacy policy aims to give you information on how we collect and process your personal data through your use of this website,
                            including any data you may provide through this website when you sign up for our partner program or purchase a service.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>3. The Data We Collect About You</h2>
                        <p style={{ marginBottom: '24px' }}>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Financial Data</strong> includes bank account and payment card details.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                        </ul>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>4. How We Use Your Personal Data</h2>
                        <p style={{ marginBottom: '24px' }}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li style={{ marginBottom: '8px' }}>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li style={{ marginBottom: '8px' }}>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>5. Data Security</h2>
                        <p style={{ marginBottom: '24px' }}>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>

                        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                                For any questions about this Privacy Policy, please contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerPrivacyPolicy;
