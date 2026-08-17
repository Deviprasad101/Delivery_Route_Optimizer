import React from 'react';
import './RiderRegistration.css';

const RiderRegistration = () => {
  return (
    <div className="bg-[#f7f9fb] min-h-screen flex items-center justify-center p-6 lg:p-12 font-inter">
      <main className="w-full max-w-4xl bg-[#ffffff] rounded-xl ambient-shadow p-8 lg:p-12 animate-fade-in flex flex-col gap-8 border border-[#e0e3e5]">
        {/* Header */}
        <header className="text-center animate-fade-in delay-100">
          <h1 className="text-[32px] leading-[40px] font-[600] tracking-[-0.01em] text-[#004ac6]">
            Rider Registration / Documents
          </h1>
        </header>

        {/* Form Section */}
        <div className="flex flex-col gap-6 animate-fade-in delay-200">
          <h2 className="text-[24px] leading-[32px] font-[600] text-[#191c1e]">Create Rider Account</h2>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Name</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Mobile Number</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Email</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Address</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Vehicle Type</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] leading-[20px] font-[500] tracking-[0.01em] text-[#434655]">Vehicle Number</label>
              <input 
                className="h-12 bg-[#f7f9fb] border border-[#c3c6d7] rounded-lg px-4 text-[16px] leading-[24px] font-[400] text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#b4c5ff] transition-all" 
                type="text" 
              />
            </div>
          </div>
        </div>

        <hr className="border-[#e0e3e5] my-2" />

        {/* Document Upload Section */}
        <div className="flex flex-col gap-6 animate-fade-in delay-300">
          <h2 className="text-[24px] leading-[32px] font-[600] text-[#191c1e]">Upload Documents</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Doc Card 1 */}
            <div className="group flex flex-col items-center justify-center p-6 bg-[#f2f4f6] border border-dashed border-[#c3c6d7] rounded-lg cursor-pointer hover:bg-[#f7f9fb] hover:border-[#004ac6] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#004ac6] transition-colors text-[32px] mb-2">id_card</span>
              <span className="text-[12px] leading-[16px] font-[600] text-[#434655] group-hover:text-[#004ac6] transition-colors text-center">Driving License</span>
            </div>

            {/* Doc Card 2 */}
            <div className="group flex flex-col items-center justify-center p-6 bg-[#f2f4f6] border border-dashed border-[#c3c6d7] rounded-lg cursor-pointer hover:bg-[#f7f9fb] hover:border-[#004ac6] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#004ac6] transition-colors text-[32px] mb-2">description</span>
              <span className="text-[12px] leading-[16px] font-[600] text-[#434655] group-hover:text-[#004ac6] transition-colors text-center">Vehicle RC</span>
            </div>

            {/* Doc Card 3 */}
            <div className="group flex flex-col items-center justify-center p-6 bg-[#f2f4f6] border border-dashed border-[#c3c6d7] rounded-lg cursor-pointer hover:bg-[#f7f9fb] hover:border-[#004ac6] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#004ac6] transition-colors text-[32px] mb-2">verified_user</span>
              <span className="text-[12px] leading-[16px] font-[600] text-[#434655] group-hover:text-[#004ac6] transition-colors text-center">Insurance</span>
            </div>

            {/* Doc Card 4 */}
            <div className="group flex flex-col items-center justify-center p-6 bg-[#f2f4f6] border border-dashed border-[#c3c6d7] rounded-lg cursor-pointer hover:bg-[#f7f9fb] hover:border-[#004ac6] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#004ac6] transition-colors text-[32px] mb-2">badge</span>
              <span className="text-[12px] leading-[16px] font-[600] text-[#434655] group-hover:text-[#004ac6] transition-colors text-center">ID Proof</span>
            </div>

            {/* Doc Card 5 */}
            <div className="group flex flex-col items-center justify-center p-6 bg-[#f2f4f6] border border-dashed border-[#c3c6d7] rounded-lg cursor-pointer hover:bg-[#f7f9fb] hover:border-[#004ac6] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined text-[#737686] group-hover:text-[#004ac6] transition-colors text-[32px] mb-2">account_circle</span>
              <span className="text-[12px] leading-[16px] font-[600] text-[#434655] group-hover:text-[#004ac6] transition-colors text-center">Profile Photo</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 animate-fade-in delay-300">
          <button className="w-full h-12 bg-[#004ac6] text-[#ffffff] text-[14px] leading-[20px] font-[500] tracking-[0.01em] rounded-lg shadow-md hover:bg-[#003ea8] hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#b4c5ff]">
            Submit for Approval
          </button>
        </div>
      </main>
    </div>
  );
};

export default RiderRegistration;
