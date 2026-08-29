import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminApproval.css';

const AdminApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  
  const [approvals, setApprovals] = useState(() => {
    const saved = sessionStorage.getItem('riderApprovals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('riderApprovals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    // If a new rider was passed via routing state, add them to the list
    if (location.state && location.state.newRider) {
      setApprovals(prev => {
        // Prevent adding duplicates on re-render in strict mode
        if (prev.some(r => r.id === location.state.newRider.id)) return prev;
        return [...prev, location.state.newRider];
      });
    }
  }, [location.state]);

  const openModal = (rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRider(null);
  };

  const handleDelete = (id) => {
    setApprovals(prev => prev.filter(rider => rider.id !== id));
  };

  const handleApprove = (rider) => {
    // Save to approved list for Admin Dashboard
    const savedApproved = JSON.parse(sessionStorage.getItem('approvedRiders') || '[]');
    // Add mock customer and amount for display in admin dashboard table
    const approvedRiderData = { 
      ...rider, 
      status: 'Active', 
      customer: 'Customer ' + Math.floor(Math.random() * 100), 
      amount: Math.floor(Math.random() * 400) + 100 
    };
    sessionStorage.setItem('approvedRiders', JSON.stringify([...savedApproved, approvedRiderData]));
    
    // Remove from pending
    setApprovals(prev => prev.filter(r => r.id !== rider.id));

    // Navigate to the rider dashboard with the approved rider details
    navigate('/dashboard', { state: { approvedRider: rider } });
  };

  return (
    <div className="approval-page font-inter">
      {/* TopNavBar */}
      <header className="top-nav">
        <div className="nav-left">
          <span className="nav-title">Rider/User Approval</span>
        </div>
        <div className="nav-right">
          <span className="material-symbols-outlined nav-icon">notifications</span>
          <span className="material-symbols-outlined nav-icon">account_circle</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content animate-fade-in-up">
        {/* Header Section */}
        <div className="page-header">
          <h1 className="page-title">Rider/User Approval</h1>
          {/* Approval Rule Statement */}
          <div className="info-box">
            <span className="material-symbols-outlined info-icon">info</span>
            <p>Only after Admin approves → Rider can start accepting jobs.</p>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="approval-card soft-shadow">
          <div className="card-header">
            <h2>Pending Rider Approvals</h2>
          </div>
          {/* Table */}
          <div className="table-container">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((rider, index) => (
                  <tr key={rider.id} className="row-animation" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                    <td className="font-medium">{rider.name}</td>
                    <td className="text-variant">{rider.phone}</td>
                    <td className="text-variant">
                      <span 
                        style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                        onClick={() => openModal(rider)}
                      >
                        View Documents
                      </span>
                    </td>
                    <td>
                      <span className="status-badge">{rider.status}</span>
                    </td>
                    <td className="text-right actions-cell">
                      <button className="btn btn-approve" onClick={() => handleApprove(rider)}>Approve</button>
                      <button className="btn btn-reject" onClick={() => handleDelete(rider.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-copy">
          Approval Management System © 2024. All approval actions are logged and subject to internal compliance rules.
        </span>
        <div className="footer-links">
          <a href="#">Documentation</a>
          <a href="#">Support</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>

      {/* Documents Modal */}
      {isModalOpen && selectedRider && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Documents for {selectedRider.name}</h3>
              <button className="modal-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              {selectedRider.documents && Object.keys(selectedRider.documents).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(selectedRider.documents).map(([docType, docData], i) => {
                    const isObject = typeof docData === 'object' && docData !== null;
                    const fileName = isObject ? docData.name : docData;
                    const fileUrl = isObject ? docData.url : null;
                    const isImage = isObject ? docData.isImage : (typeof docData === 'string' && (docData.endsWith('.png') || docData.endsWith('.jpg') || docData.endsWith('.jpeg')));

                    return (
                      <div key={i} style={{ border: '1px solid var(--surface-variant)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--surface)' }}>
                          <span className="material-symbols-outlined doc-icon">
                            {isImage ? 'image' : 'description'}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: '12px' }}>{docType}</span>
                            <span className="text-variant" style={{ fontSize: '12px' }}>{fileName}</span>
                          </div>
                          {fileUrl && !isImage && (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                              Open
                            </a>
                          )}
                        </div>
                        {isImage && fileUrl && (
                           <div style={{ padding: '0', borderTop: '1px solid var(--surface-variant)', backgroundColor: '#fff', textAlign: 'center' }}>
                             <img src={fileUrl} alt={docType} style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', margin: '0 auto', objectFit: 'contain' }} />
                           </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-variant" style={{ textAlign: 'center', padding: '1rem' }}>No documents uploaded.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;
