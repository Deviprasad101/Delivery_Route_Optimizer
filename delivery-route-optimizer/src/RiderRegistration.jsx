import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RiderRegistration.css';

const RiderRegistration = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState({});

  const handleFileChange = (e, docName) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setDocs(prev => ({ ...prev, [docName]: { name: file.name, url: previewUrl, isImage: file.type.startsWith('image/') } }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRider = {
      id: Date.now(), // Generate a fake ID
      name: formData.get('name') || 'Unknown',
      phone: formData.get('phone') || 'Unknown',
      status: 'Pending',
      documents: docs
    };
    navigate('/approval', { state: { newRider } });
  };

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
        <form onSubmit={handleSubmit}>
          <div className="rider-section animate-fade-in delay-200">
            <h2 className="rider-subtitle">Create Rider Account</h2>

            {/* Personal Details */}
            <div className="rider-grid">
              <div className="rider-field">
                <label className="rider-label">Name</label>
                <input className="rider-input" type="text" name="name" required />
              </div>
              <div className="rider-field">
                <label className="rider-label">Mobile Number</label>
                <input className="rider-input" type="text" name="phone" required />
              </div>
              <div className="rider-field">
                <label className="rider-label">Email</label>
                <input className="rider-input" type="email" name="email" />
              </div>
              <div className="rider-field">
                <label className="rider-label">Address</label>
                <input className="rider-input" type="text" name="address" />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="rider-grid" style={{ marginTop: '1rem' }}>
              <div className="rider-field">
                <label className="rider-label">Vehicle Type</label>
                <input className="rider-input" type="text" name="vehicleType" />
              </div>
              <div className="rider-field">
                <label className="rider-label">Vehicle Number</label>
                <input className="rider-input" type="text" name="vehicleNumber" />
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
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'Driving License')} />
                <span className="material-symbols-outlined">id_card</span>
                <span>{docs['Driving License']?.name || 'Driving License'}</span>
              </label>

              {/* Doc Card 2 */}
              <label className="rider-doc-card">
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'Vehicle RC')} />
                <span className="material-symbols-outlined">description</span>
                <span>{docs['Vehicle RC']?.name || 'Vehicle RC'}</span>
              </label>

              {/* Doc Card 3 */}
              <label className="rider-doc-card">
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'Insurance')} />
                <span className="material-symbols-outlined">verified_user</span>
                <span>{docs['Insurance']?.name || 'Insurance'}</span>
              </label>

              {/* Doc Card 4 */}
              <label className="rider-doc-card">
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'ID Proof')} />
                <span className="material-symbols-outlined">badge</span>
                <span>{docs['ID Proof']?.name || 'ID Proof'}</span>
              </label>

              {/* Doc Card 5 */}
              <label className="rider-doc-card">
                <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'Profile Photo')} />
                <span className="material-symbols-outlined">account_circle</span>
                <span>{docs['Profile Photo']?.name || 'Profile Photo'}</span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="rider-button-container animate-fade-in delay-300">
            <button className="rider-button" type="submit">
              Submit for Approval
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RiderRegistration;
