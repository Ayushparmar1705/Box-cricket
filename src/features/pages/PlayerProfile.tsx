import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  UploadCloud,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Globe,
  Building,
  Save,
  FileCheck,
  Trash2,
  Clock,
  Trophy,
  BadgeCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { OwnerrequestApi, type Ownerrequest } from '../services/ProfileService';
import { fetchCountriesApi, type CountryItem } from '../services/countryService';
import { fetchStatesApi, type StateItem } from '../services/stateService';
import { fetchCitiesApi, type CityItem } from '../services/cityService';

interface OwnerDocumentState {
  file: File | null;
  fileName: string;
  fileSize: string;
}

const PlayerProfile: React.FC = () => {

  // Active tab selection: 'owner' (Become Turf Owner) or 'profile' (Edit Player Details)
  const [activeTab, setActiveTab] = useState<'profile' | 'owner'>('owner');

  const [ownerForm, setOwnerForm] = useState({
    business_name: "",
    business_type: "Turf Owner",
    gstn_number: "",
    state: "",
    city: "",
    country: "",
    contact_email: "",
    contact_number: "",
  });

  const [profileForm, setProfileForm] = useState({
    username: "Rohit Sharma",
    email: "rohit@boxcricket.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
  });

  const [adharDoc, setAdharDoc] = useState<OwnerDocumentState>({
    file: null,
    fileName: "",
    fileSize: "",
  });

  const [panDoc, setPanDoc] = useState<OwnerDocumentState>({
    file: null,
    fileName: "",
    fileSize: "",
  });

  const [gstDoc, setGstDoc] = useState<OwnerDocumentState>({
    file: null,
    fileName: "",
    fileSize: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmittingOwner, setIsSubmittingOwner] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [ownerApplicationSubmitted, setOwnerApplicationSubmitted] = useState(false);

  // Dynamic Location State from APIs
  const [countriesList, setCountriesList] = useState<CountryItem[]>([]);
  const [statesList, setStatesList] = useState<StateItem[]>([]);
  const [citiesList, setCitiesList] = useState<CityItem[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const [countriesRes, statesRes, citiesRes] = await Promise.all([
          fetchCountriesApi(true).catch(() => ({ data: [] })),
          fetchStatesApi(true).catch(() => ({ data: [] })),
          fetchCitiesApi(true).catch(() => ({ data: [] })),
        ]);

        const cList = Array.isArray(countriesRes) ? countriesRes : (countriesRes?.data || []);
        const sList = Array.isArray(statesRes) ? statesRes : (statesRes?.data || []);
        const ctList = Array.isArray(citiesRes) ? citiesRes : (citiesRes?.data || []);

        setCountriesList(cList);
        setStatesList(sList);
        setCitiesList(ctList);
      } catch (error) {
        console.error("Error loading location dropdown data:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    loadLocations();
  }, []);

  const filteredStates = useMemo(() => {
    if (!ownerForm.country) return statesList;
    const selectedCountryId = String(ownerForm.country);
    const filtered = statesList.filter(s =>
      String(s.countryId) === selectedCountryId ||
      String(s.country?.id) === selectedCountryId ||
      s.country_name?.toLowerCase() === ownerForm.country.toLowerCase()
    );
    return filtered.length > 0 ? filtered : statesList;
  }, [statesList, ownerForm.country]);

  const filteredCities = useMemo(() => {
    if (!ownerForm.state) return citiesList;
    const selectedStateId = String(ownerForm.state);
    const filtered = citiesList.filter(c =>
      String(c.stateId) === selectedStateId ||
      String(c.state?.id) === selectedStateId ||
      c.state_name?.toLowerCase() === ownerForm.state.toLowerCase()
    );
    return filtered.length > 0 ? filtered : citiesList;
  }, [citiesList, ownerForm.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOwnerForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: 'adhar' | 'pan' | 'gst') => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5 MB");
      e.target.value = '';
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG and PNG files are allowed");
      e.target.value = '';
      return;
    }

    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const documentData: OwnerDocumentState = {
      file: file,
      fileName: file.name,
      fileSize: `${fileSizeInMB} MB`,
    };

    if (documentType === "adhar") {
      setAdharDoc(documentData);
    } else if (documentType === "pan") {
      setPanDoc(documentData);
    } else if (documentType === "gst") {
      setGstDoc(documentData);
    }

    // Reset input value so re-uploading the same file triggers onChange
    e.target.value = '';
  };

  const handleRemoveDoc = (documentType: 'adhar' | 'pan' | 'gst') => {
    const emptyDoc: OwnerDocumentState = { file: null, fileName: "", fileSize: "" };
    if (documentType === "adhar") {
      setAdharDoc(emptyDoc);
    } else if (documentType === "pan") {
      setPanDoc(emptyDoc);
    } else if (documentType === "gst") {
      setGstDoc(emptyDoc);
    }
  };

  const handleSubmitOwnerRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Please accept the terms & conditions");
      return;
    }

    if (!adharDoc.file) {
      toast.error("Please upload your Adhar Card document");
      return;
    }

    if (!panDoc.file) {
      toast.error("Please upload your PAN Card document");
      return;
    }

    if (!gstDoc.file) {
      toast.error("Please upload your GST Certificate document");
      return;
    }

    try {
      setIsSubmittingOwner(true);
      let currentUserId: string | number | undefined;
      currentUserId = localStorage.getItem("userId") || "";

      const payload: Ownerrequest = {
        business_name: ownerForm.business_name,
        business_type: ownerForm.business_type || "SOLO",
        gstn_number: ownerForm.gstn_number,
        state: ownerForm.state,
        city: ownerForm.city,
        country: ownerForm.country,
        contact_email: ownerForm.contact_email,
        contact_number: ownerForm.contact_number,
        pan_card: panDoc.file,
        adhar_card: adharDoc.file,
        userId: parseInt(currentUserId),

      };

      const result = await OwnerrequestApi(payload);
      console.log(result);
      if (result.success === true) {
        toast.success(result.message, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
            padding: "12px 16px",
            borderRadius: "8px",
          }
        });
        setOwnerApplicationSubmitted(true);
      } else {
        toast.error(result.message, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#dc2626",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
            padding: "12px 16px",
            borderRadius: "8px",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting turf owner application:", error);
      toast.error("Failed to submit turf owner application");
    } finally {
      setIsSubmittingOwner(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };




  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">

      {/* ── Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Header Bar ── */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-8 py-3.5 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/player-dashboard"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <span className="text-slate-600 hidden sm:inline">•</span>

            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Player Profile & Settings</span>
            </span>
          </div>

          <Link
            to="/player-dashboard"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Arena Center</span>
          </Link>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Hero Profile Identity Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-1 shadow-xl shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white">
                    {(profileForm.username || 'P').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-slate-900 text-slate-950">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {profileForm.username || 'Player Account'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Verified Player
                  </span>
                  {ownerApplicationSubmitted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Owner Request Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {profileForm.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {profileForm.phone}
                  </span>
                </p>
              </div>
            </div>

            {/* Tab Switcher Buttons */}
            <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'profile'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Player Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('owner')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'owner'
                  ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300'
                  }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Become an Owner</span>
              </button>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 🏢 TAB 1: BECOME AN OWNER FORM                                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'owner' && (
          <div className="space-y-6">

            {/* Banner Notification if already submitted */}
            {ownerApplicationSubmitted ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Owner Verification in Progress</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                        Under Review
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                      Your Turf Owner application and documents (Adhar Card, Pan Card, and GST certificate) have been received.
                      Our admin team is reviewing your details. You will receive a notification once approved.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>TURF OWNER ONBOARDING PROGRAM</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Become a Box Cricket Turf Owner 🏏
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    List your cricket grounds, set slot prices, receive player bookings, and grow your turf business.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Venue Portal</span>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmitOwnerRequest} className="space-y-8">

              {/* SECTION 1: BUSINESS & LOCATION DETAILS */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-6">
                <div className="border-b border-slate-800/80 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>1. Business & Turf Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter the business name and location details of your turf.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Business Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="business_name"
                        required
                        value={ownerForm.business_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Apex Box Cricket & Sports Turf"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Business Type <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building className="w-4 h-4" />
                      </div>
                      <select
                        name="business_type"
                        value={ownerForm.business_type}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      >
                        <option value="">Select Business Type</option>

                        <option value="SOLO">Solo</option>
                        <option value="PARTNERSHIP">Partnership</option>
                      </select>
                    </div>
                  </div>

                  {/* GSTN Number */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300">
                      GSTN Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="gstn_number"
                        required
                        value={ownerForm.gstn_number}
                        onChange={handleInputChange}
                        placeholder="e.g. 24ABCDE1234F1Z5"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Country <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 z-10">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        name="country"
                        required
                        value={ownerForm.country}
                        onChange={(e) => {
                          handleInputChange(e);
                          setOwnerForm(prev => ({ ...prev, country: e.target.value, state: "", city: "" }));
                        }}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
                      >
                        <option value="">{isLoadingLocations ? "Loading countries..." : "Select Country"}</option>
                        {countriesList.map((c) => (
                          <option key={c.id || c.country_name} value={c.id}>
                            {c.country_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      State <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 z-10">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        name="state"
                        required
                        value={ownerForm.state}
                        onChange={(e) => {
                          handleInputChange(e);
                          setOwnerForm(prev => ({ ...prev, state: e.target.value, city: "" }));
                        }}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
                      >
                        <option value="">{isLoadingLocations ? "Loading states..." : "Select State"}</option>
                        {filteredStates.map((s) => (
                          <option key={s.id || s.state_name} value={s.id}>
                            {s.state_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300">
                      City / Area <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 z-10">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        name="city"
                        required
                        value={ownerForm.city}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
                      >
                        <option value="">{isLoadingLocations ? "Loading cities..." : "Select City / Area"}</option>
                        {filteredCities.map((ct) => (
                          <option key={ct.id || ct.city_name} value={ct.id}>
                            {ct.city_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BUSINESS CONTACT VERIFICATION */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-6">
                <div className="border-b border-slate-800/80 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>2. Business Contact Verification</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official phone number and email address for customer booking alerts and disbursements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contact Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Contact Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="contact_number"
                        required
                        value={ownerForm.contact_number}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Contact Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="contact_email"
                        required
                        value={ownerForm.contact_email}
                        onChange={handleInputChange}
                        placeholder="e.g. billing@apexarena.com"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: OWNER DOCUMENT UPLOADS */}
              <div className="grid-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-6">
                <div className="border-b border-slate-800/80 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-cyan-400" />
                      <span>3. Owner Verification Documents</span>
                    </h3>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      Verification Documents
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload PDF or Image scans of your verification documents (Adhar card, Pan card, GST certificate).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* ── Document 1: Adhar Card ── */}
                  <div className="col-span-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Adhar Card</span>
                        </span>
                        <span className="text-[10px] font-bold text-rose-400">*Required</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Front & Back scan of business owner Adhar card.
                      </p>
                    </div>

                    {adharDoc.fileName ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="text-xs font-bold text-emerald-300 truncate">{adharDoc.fileName}</div>
                          <div className="text-[10px] text-slate-400">{adharDoc.fileSize}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('adhar')}
                          className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors block">
                        <UploadCloud className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-300 block">Upload Adhar Card</span>
                        <span className="text-[10px] text-slate-500 block">PDF, PNG, JPG (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'adhar')}
                        />
                      </label>
                    )}
                  </div>

                  {/* ── Document 2: PAN Card ── */}
                  <div className="p-5 col-span-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-cyan-400" />
                          <span>Pan Card</span>
                        </span>
                        <span className="text-[10px] font-bold text-rose-400">*Required</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Scan copy of PAN Card for tax verification.
                      </p>
                    </div>

                    {panDoc.fileName ? (
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="text-xs font-bold text-cyan-300 truncate">{panDoc.fileName}</div>
                          <div className="text-[10px] text-slate-400">{panDoc.fileSize}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('pan')}
                          className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors block">
                        <UploadCloud className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-300 block">Upload Pan Card</span>
                        <span className="text-[10px] text-slate-500 block">PDF, PNG, JPG (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'pan')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Agreement & Submit Button */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I solemnly declare that I am the legal owner or authorized manager of the specified turf business,
                    and the uploaded <strong>GST certificate</strong>, <strong>Adhar card</strong>, and <strong>Pan card</strong> are authentic.
                    I agree to the BoxCricket Turf Owner Platform Terms.
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>256-bit Encrypted Verification Vault</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOwner}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmittingOwner ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Submit Turf Owner Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 👤 TAB 2: EDIT PLAYER PROFILE                                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Edit Personal Form */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-6">
              <div className="border-b border-slate-800/80 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Personal Player Details</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your contact details visible on match scorecards.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Player Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      placeholder="Rohit Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="rohit@boxcricket.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Home City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Promotion Box */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Own a Box Cricket Ground?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turn your vacant slots into steady revenue. Submit your business name and owner documents to get listed on BoxCricket Arena.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('owner')}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Go to Become an Owner Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/70 py-5 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 BoxCricket Network • Player Profile & Owner Registration</span>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/player-dashboard" className="hover:text-slate-300 transition-colors">Player Dashboard</Link>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">Owner Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerProfile;
