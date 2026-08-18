import React, { useState } from 'react';
import './RiderApproval.css';

const RiderApproval = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const approvals = [
    { id: 1, name: 'Ravi', phone: '987xxxx', status: 'Pending' },
    { id: 2, name: 'Arun', phone: '987xxxx', status: 'Pending' },
  ];

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
                    <td className="text-variant">View Documents</td>
                    <td>
                      <span className="status-badge">{rider.status}</span>
                    </td>
                    <td className="text-right actions-cell">
                      <button className="btn btn-outline" onClick={openModal}>View</button>
                      <button className="btn btn-approve">Approve</button>
                      <button className="btn btn-reject">Reject</button>
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
      {isModalOpen && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Documents List</h3>
              <button className="modal-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className="doc-list">
                <li>
                  <span className="material-symbols-outlined doc-icon">description</span>
                  <span>Aadhaar / ID</span>
                </li>
                <li>
                  <span className="material-symbols-outlined doc-icon">description</span>
                  <span>Driving License</span>
                </li>
                <li>
                  <span className="material-symbols-outlined doc-icon">description</span>
                  <span>Vehicle RC</span>
                </li>
                <li>
                  <span className="material-symbols-outlined doc-icon">description</span>
                  <span>Insurance</span>
                </li>
                <li>
                  <span className="material-symbols-outlined doc-icon">image</span>
                  <span>Profile photo</span>
                </li>
                <li>
                  <span className="material-symbols-outlined doc-icon">folder_open</span>
                  <span>Other required documents</span>
                </li>
              </ul>
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

export default RiderApproval;
