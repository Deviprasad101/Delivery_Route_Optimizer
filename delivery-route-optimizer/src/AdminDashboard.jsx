import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_riders: 0,
    pending_approvals: 0,
    active_trips: 0,
    completed_trips: 0,
    recent_trips: []
  });

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard');
        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
    };
    fetchStats();
  }, []);

  const totalRiders = stats.total_riders;
  const pendingCount = stats.pending_approvals;
  const activeTripsCount = stats.active_trips;
  const completedTripsCount = stats.completed_trips;
  const recentTrips = stats.recent_trips;

  return (
    <div className="bg-[#F4F7FA] text-on-background font-body-md min-h-screen h-screen flex overflow-hidden">
      {/* SideNavBar */}
      <nav className="hidden md:flex bg-surface-container-lowest dark:bg-inverse-surface fixed left-0 top-0 h-full w-[260px] z-50 border-r border-outline-variant/50 flex-col py-lg shadow-sm">
        <div className="px-lg pb-md mb-md border-b border-outline-variant/30">
          <div className="flex items-center gap-xs">
            <img
              alt="Service Logo"
              className="w-8 h-8 rounded-lg shadow-sm"
              data-alt="A clean, modern logistics brand logo featuring a stylized geometric shape in deep blue, signifying speed and reliability, set against a pristine white background. The lighting is crisp and even, highlighting the sharp edges of the logo. Corporate modern aesthetic."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGZjPAqQUjn0EHzW2Zu7g5SapKCkzbhutIZuCmvf8ZKqVPv_CE_e5gvx4kSMci3tRmkBtnKgLtvEkoN0D_l2hOWVUxuzbN8nQ5T_4FXXaESXyHba4uNzEAYuxJxFhdlVRCxpdX25OR08Bcbqa0OlYx5ooexrUlPDPkM-Y8ognJif3p_zJ4WOC4c0O-3f5QksAEw7uDUuPf450razsFNGH0iAGCkrkDBPf7FPwYIf_zNAHUlE9_xnbc"
            />
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
                Logistics Pro
              </h1>
              <p className="font-body-md text-on-surface-variant text-[11px] font-medium tracking-wide uppercase">
                Admin Console
              </p>
            </div>
          </div>
          <button className="mt-lg w-full bg-primary text-on-primary font-body-md text-body-md py-sm rounded-lg hover:bg-primary/90 hover:shadow-md transition-all font-medium flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-[18px]" data-icon="add">
              add
            </span>
            New Dispatch
          </button>
        </div>
        <ul className="flex-1 px-md space-y-1 overflow-y-auto">
          <li>
            <Link
              className="flex items-center gap-md px-md py-sm rounded-lg text-primary dark:text-primary-fixed font-semibold bg-primary/10 transition-all duration-200 ease-in-out"
              to="/admin-dashboard"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="dashboard">
                dashboard
              </span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 ease-in-out font-medium"
              to="/approval"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="group">
                group
              </span>
              Riders
            </Link>
          </li>
          <li>
            <a
              className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 ease-in-out font-medium"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="local_shipping">
                local_shipping
              </span>
              Trips
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 ease-in-out font-medium"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="payments">
                payments
              </span>
              Payments
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 ease-in-out font-medium"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="history">
                history
              </span>
              Activity
            </a>
          </li>
        </ul>
        <div className="px-md pt-md border-t border-outline-variant/30 mt-auto">
          <ul className="space-y-1">
            <li>
              <Link
                className="flex items-center gap-md px-md py-sm rounded-lg text-primary hover:bg-primary/10 transition-all duration-200 ease-in-out font-medium"
                to="/"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="arrow_back">
                  arrow_back
                </span>
                Back to App
              </Link>
            </li>
            <li>
              <a
                className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 ease-in-out font-medium"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="contact_support">
                  contact_support
                </span>
                Support
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-md px-md py-sm rounded-lg text-error hover:bg-error/10 transition-all duration-200 ease-in-out font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="logout">
                  logout
                </span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] h-full overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-40 flex justify-between items-center w-full px-xl min-h-[72px] shadow-sm flex-shrink-0">
          <div className="flex items-center gap-md">
            <span
              className="md:hidden material-symbols-outlined cursor-pointer hover:bg-surface-container-low p-xs rounded-full transition-colors"
              data-icon="menu"
            >
              menu
            </span>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-primary hidden md:block tracking-tight">
              Overview
            </h1>
          </div>
          <div className="flex items-center gap-lg">
            <div className="relative hidden sm:block">
              <span
                className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px]"
                data-icon="search"
              >
                search
              </span>
              <input
                className="pl-[44px] pr-sm py-[8px] bg-surface-container-low/50 border border-outline-variant/50 rounded-full text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none w-[320px] transition-all placeholder-outline hover:border-outline-variant"
                placeholder="Search riders, trips, or ID..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-xs text-on-surface-variant">
              <button className="relative p-sm rounded-full hover:bg-surface-container-low transition-colors group">
                <span
                  className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors"
                  data-icon="notifications"
                >
                  notifications
                </span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
              </button>
              <button className="p-sm rounded-full hover:bg-surface-container-low transition-colors group hidden sm:block">
                <span
                  className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors"
                  data-icon="settings"
                >
                  settings
                </span>
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant/30 hidden sm:block"></div>
            <button className="flex items-center gap-sm hover:bg-surface-container-low p-xs pr-sm rounded-full transition-colors border border-transparent hover:border-outline-variant/30">
              <img
                alt="Administrator Profile"
                className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest"
                data-alt="A professional headshot of a logistics administrator in a modern, well-lit office setting. The subject is smiling subtly, conveying reliability and competence. Bright, neutral lighting with a shallow depth of field focusing on the subject."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsrGhLujhl_b6CTAHeywrS-KWNhN68cik2imkTEMb-riXTE9NBKEycWs6GzjKEpl5KRaMYZ0hCMWA5qKJinL21qRuYMpYTtNVPJGRF_VjZxgpWOBFWZzroqXDix0AmYknP6blLf_qJPbDq72BEpadFIuolJkWsHAaQ6NN7HvDy-Hzq4em0lmxnSy20erVrgwuwsSefm8PkZ97zonuPG7n8K3GA7ej27BfkxecHcALjrjMfFYEwStAD"
              />
              <div className="hidden md:block text-left">
                <p className="font-body-md text-sm font-semibold text-on-surface leading-tight">
                  Admin User
                </p>
                <p className="text-xs text-on-surface-variant">Dispatcher</p>
              </div>
              <span
                className="material-symbols-outlined text-[18px] text-outline hidden md:block"
                data-icon="expand_more"
              >
                expand_more
              </span>
            </button>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="flex-1 p-xl overflow-y-auto h-full pb-xl">
          <div className="max-w-7xl mx-auto space-y-xl h-full flex flex-col">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter flex-shrink-0">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.03),0px_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-lg">
                  <div className="p-sm bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[24px]" data-icon="group">
                      group
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                    +12%{' '}
                    <span className="material-symbols-outlined text-[12px]" data-icon="trending_up">
                      trending_up
                    </span>
                  </span>
                </div>
                <div>
                  <h3 className="font-body-md text-on-surface-variant font-medium mb-1">Total Riders</h3>
                  <div className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">{totalRiders}</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.03),0px_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-lg">
                  <div className="p-sm bg-error/10 rounded-lg group-hover:bg-error/20 transition-colors">
                    <span className="material-symbols-outlined text-error text-[24px]" data-icon="pending_actions">
                      pending_actions
                    </span>
                  </div>
                  <span className="text-xs font-medium text-error bg-error/10 px-2 py-1 rounded-full flex items-center gap-1">
                    Action Req.
                  </span>
                </div>
                <div>
                  <h3 className="font-body-md text-on-surface-variant font-medium mb-1">Pending Approval</h3>
                  <div className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">{pendingCount}</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.03),0px_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-lg">
                  <div className="p-sm bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                    <span className="material-symbols-outlined text-amber-600 text-[24px]" data-icon="directions_bike">
                      directions_bike
                    </span>
                  </div>
                  <span className="flex h-2 w-2 relative mt-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-body-md text-on-surface-variant font-medium mb-1">Active Trips</h3>
                  <div className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">{activeTripsCount}</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.03),0px_4px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-lg">
                  <div className="p-sm bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <span className="material-symbols-outlined text-emerald-600 text-[24px]" data-icon="check_circle">
                      check_circle
                    </span>
                  </div>
                  <span className="text-xs font-medium text-outline bg-surface-container px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>
                <div>
                  <h3 className="font-body-md text-on-surface-variant font-medium mb-1">Completed Trips</h3>
                  <div className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">{completedTripsCount}</div>
                </div>
              </div>
            </div>

            {/* Recent Trips Section */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="p-lg border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest flex-shrink-0">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Recent Trips</h2>
                <button className="font-body-md text-sm font-medium text-primary flex items-center gap-xs hover:bg-primary/5 px-sm py-xs rounded-lg transition-colors">
                  View All{' '}
                  <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">
                    arrow_forward
                  </span>
                </button>
              </div>
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full text-left font-data-table relative">
                  <thead className="bg-surface-container/30 border-b border-outline-variant/20 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
                    <tr>
                      <th className="px-xl py-md font-label-caps text-on-surface-variant uppercase tracking-wider text-[12px] bg-surface-container/90">
                        Rider
                      </th>
                      <th className="px-xl py-md font-label-caps text-on-surface-variant uppercase tracking-wider text-[12px] bg-surface-container/90">
                        Customer
                      </th>
                      <th className="px-xl py-md font-label-caps text-on-surface-variant uppercase tracking-wider text-[12px] bg-surface-container/90">
                        Status
                      </th>
                      <th className="px-xl py-md font-label-caps text-on-surface-variant uppercase tracking-wider text-[12px] text-right bg-surface-container/90">
                        Amount
                      </th>
                      <th className="px-xl py-md w-[50px] bg-surface-container/90"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 bg-surface-container-lowest">
                    {recentTrips.length > 0 ? (
                      recentTrips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                          <td className="px-xl py-lg">
                            <div className="flex items-center gap-sm">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                                {trip.name ? trip.name.charAt(0) : 'U'}
                              </div>
                              <span className="text-on-surface font-semibold">{trip.name || 'Unknown Rider'}</span>
                            </div>
                          </td>
                          <td className="px-xl py-lg text-on-surface-variant">{trip.customer || 'N/A'}</td>
                          <td className="px-xl py-lg">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium text-[13px] gap-1.5 border ${
                              trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                trip.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                              }`}></span>
                              {trip.status}
                            </span>
                          </td>
                          <td className="px-xl py-lg text-right font-mono-metric text-on-surface font-semibold">
                            ₹{trip.amount || 0}
                          </td>
                          <td className="px-xl py-lg text-right">
                            <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                              <span className="material-symbols-outlined text-[20px]" data-icon="more_vert">
                                more_vert
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-xl py-lg text-center text-on-surface-variant font-medium">
                          No recent trips found. Approved riders will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
