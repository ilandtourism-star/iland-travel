import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';

const PartnerButtonListAnActivity = () => {
  const navigate = useNavigate();
  const { info } = useToast();
  const [selectedType, setSelectedType] = useState('island_activity');

  const activityTypes = [
    {
      id: 'island_activity',
      title: 'Island Activity',
      description: 'Enjoy various exciting activities on the island, from hiking to scenic photo spots.',
      icon: <i className="fas fa-umbrella-beach"></i>,
    },
    {
      id: 'white_water',
      title: 'White Water Activity',
      description: 'Experience the thrill of rafting or kayaking through exciting river rapids.',
      icon: <i className="fas fa-water"></i>,
    },
    {
      id: 'water_sports',
      title: 'Water Sports',
      description: 'Engage in thrilling water activities like jet skiing and banana boat rides.',
      icon: <i className="fas fa-ship"></i>,
    },
  ];

  return (
    <div className="partner-selection-wrapper">
      <style>{`
            .partner-selection-wrapper {
                min-height: 100vh;
                background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                font-family: 'Poppins', sans-serif;
            }
            .selection-card-container {
                max-width: 600px;
                width: 100%;
            }
            .partner-selection-wrapper h1 {
                font-size: 1.8rem;
                font-weight: 700;
                color: #333;
                margin-bottom: 10px;
                text-align: center;
            }
            .partner-selection-wrapper .subtitle {
                color: #666;
                text-align: center;
                margin-bottom: 40px;
                font-size: 1rem;
            }
            .activity-options {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 40px;
            }
            .selection-item {
                background: white;
                border: 2px solid #eee;
                border-radius: 12px;
                padding: 24px;
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .selection-item:hover {
                border-color: #5392f9;
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(83, 146, 249, 0.15);
            }
            .selection-item.active {
                border-color: #5392f9;
                background-color: #f0f6ff;
                box-shadow: 0 4px 12px rgba(83, 146, 249, 0.1);
            }
            .icon-box {
                width: 50px;
                height: 50px;
                background: #f0f5ff;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #5392f9;
                flex-shrink: 0;
                font-size: 1.5rem;
                transition: all 0.3s;
            }
            .selection-item:hover .icon-box, .selection-item.active .icon-box {
                background: #5392f9;
                color: white;
            }
            .text-content {
                flex-grow: 1;
            }
            .text-content h3 {
                font-size: 1.1rem;
                margin: 0 0 4px 0;
                color: #2a2a2e;
                font-weight: 600;
            }
            .text-content p {
                font-size: 0.85rem;
                color: #666;
                margin: 0;
                line-height: 1.5;
            }
            .bottom-nav {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-top: 20px;
            }
            .partner-selection-wrapper .btn {
                padding: 12px 45px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: 0.3s;
                border: none;
            }
            .btn-back {
                background: #fff;
                border: 1px solid #ccc !important;
                color: #666;
            }
            .btn-back:hover {
                background: #f8f8f8;
            }
            .btn-next {
                background: #5392f9;
                color: #fff;
                box-shadow: 0 4px 10px rgba(83, 146, 249, 0.3);
            }
            .btn-next:hover {
                background: #367af6;
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(83, 146, 249, 0.4);
            }
        `}</style>

      <div className="selection-card-container">
        <h1>List Your Activity</h1>
        <p className="subtitle">Please select the type of activity you want to list</p>

        <div className="activity-options">
          {activityTypes.map((type) => (
            <div
              key={type.id}
              className={`selection-item ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="icon-box">
                {type.icon}
              </div>
              <div className="text-content">
                <h3>{type.title}</h3>
                <p>{type.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-nav">
          <button className="btn btn-back" onClick={() => navigate(-1)}>Back</button>
          <button
            className="btn btn-next"
            onClick={() => {
              if (selectedType === 'island_activity') {
                navigate('/partner/island-activity');
              } else {
                info('This activity type is coming soon!');
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerButtonListAnActivity;
