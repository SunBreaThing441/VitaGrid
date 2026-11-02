import React, { Fragment, useContext, useState, useEffect } from "react";
import Layout from "./Layout";
import { DashboardUserContext } from "./Layout";
import { updatePersonalInformationAction } from "./Action";

const ProfileComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const userDetails = data.userDetails !== null ? data.userDetails : "";

  const [fData, setFdata] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    success: false,
  });

  useEffect(() => {
    if (userDetails) {
      setFdata({
        id: userDetails._id || "",
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: userDetails.phoneNumber || "",
        success: false,
      });
    }
  }, [userDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePersonalInformationAction(dispatch, fData);
  };

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Retrieving Facility Telemetry Profile...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                VERIFIED REQUISITION ENTITY
              </span>
            </div>
            <h1 className="text-xl font-bold text-white font-display mt-0.5">
              Hospital Facility Credentials
            </h1>
            <p className="text-xs text-slate-400">
              Preservation and delivery profile parameters for incoming cryo-transits.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            HL7 / UNESCO ACCREDITED
          </span>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 md:p-8 space-y-6">
          {fData.success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              [CREDENTIALS UPDATED] {fData.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Hospital / Transplant Center Organization Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={fData.name}
                onChange={(e) => setFdata({ ...fData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Accredited Institutional Email (Immutable Identity)
              </label>
              <input
                id="email"
                type="email"
                readOnly
                value={fData.email}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/30 border border-slate-800/60 text-slate-500 cursor-not-allowed text-sm font-mono"
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Contact VitaGrid Governance Secretariat to re-bind root credentials.
              </span>
            </div>

            <div>
              <label htmlFor="number" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Emergency Trauma & Logistics Hotline
              </label>
              <input
                id="number"
                type="text"
                required
                value={fData.phone}
                onChange={(e) => setFdata({ ...fData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Update Facility Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const UserProfile = (props) => {
  return (
    <Fragment>
      <Layout children={<ProfileComponent />} />
    </Fragment>
  );
};

export default UserProfile;
