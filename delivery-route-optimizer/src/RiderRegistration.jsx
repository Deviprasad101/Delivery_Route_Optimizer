import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RiderRegistration.css';

const RiderRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="rider-page font-inter">
      <main className="rider-card animate-fade-in">
        {/* Header */}
        <header className="rider-header animate-fade-in delay-100">
          <h1 className="rider-title">
            Rider Registration / Documents
          </h1>
        </header>

        {/* Form Section */}
        <div className="rider-section animate-fade-in delay-200">
          <h2 className="rider-subtitle">Create Rider Account</h2>

          {/* Personal Details */}
          <div className="rider-grid">
            <div className="rider-field">
              <label className="rider-label">Name</label>
              <input className="rider-input" type="text" />
            </div>
            <div className="rider-field">
              <label className="rider-label">Mobile Number</label>
              <input className="rider-input" type="text" />
            </div>
            <div className="rider-field">
              <label className="rider-label">Email</label>
              <input className="rider-input" type="text" />
            </div>
            <div className="rider-field">
              <label className="rider-label">Address</label>
              <input className="rider-input" type="text" />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="rider-grid" style={{ marginTop: '1rem' }}>
            <div className="rider-field">
              <label className="rider-label">Vehicle Type</label>
              <input className="rider-input" type="text" />
            </div>
            <div className="rider-field">
              <label className="rider-label">Vehicle Number</label>
              <input className="rider-input" type="text" />
            </div>
          </div>
        </div>

        <hr className="rider-divider" />

        {/* Document Upload Section */}
        <div className="rider-section animate-fade-in delay-300">
          <h2 className="rider-subtitle">Upload Documents</h2>

          <div className="rider-grid-5">
            {/* Doc Card 1 */}
            <label className="rider-doc-card">
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" />
              <span className="material-symbols-outlined">id_card</span>
              <span>Driving License</span>
            </label>

            {/* Doc Card 2 */}
            <label className="rider-doc-card">
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" />
              <span className="material-symbols-outlined">description</span>
              <span>Vehicle RC</span>
            </label>

            {/* Doc Card 3 */}
            <label className="rider-doc-card">
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" />
              <span className="material-symbols-outlined">verified_user</span>
              <span>Insurance</span>
            </label>

            {/* Doc Card 4 */}
            <label className="rider-doc-card">
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" />
              <span className="material-symbols-outlined">badge</span>
              <span>ID Proof</span>
            </label>

            {/* Doc Card 5 */}
            <label className="rider-doc-card">
              <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" />
              <span className="material-symbols-outlined">account_circle</span>
              <span>Profile Photo</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="rider-button-container animate-fade-in delay-300">
          <button className="rider-button" onClick={() => navigate('/approval')}>
            Submit for Approval
          </button>
        </div>
      </main>
    </div>
  );
};

export default RiderRegistration;
