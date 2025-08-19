import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaPencilAlt, FaEnvelope, FaUnlink
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { PiSignOut } from "react-icons/pi";
import { motion } from 'framer-motion';
import { signOutUser } from "../firebase/auth.js"
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { useForm } from 'react-hook-form';
import serverRequest from '../utils/axios.js';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useUser from '../hooks/useUser';
import { FiExternalLink } from 'react-icons/fi';
import Loader from '../components/Loader.jsx';

const Popup = ({ isOpen, onClose, children }) => {
  // Always call hooks; guard the effect body with isOpen
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#0ea5e9]" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm border border-white/60 backdrop-blur transition"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isSignedIn, isServerReady, isLoading } = useAuthStatus();
  const { user: userState } = useUser();
  const user = userState?.data;

  // No demo defaults: derive from server user, keep empty when not available
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    title: "",
    location: "",
    avatarUrl: "",
    bannerUrl: "",
  });

  const [skills, setSkills] = useState([]);
  const [about, setAbout] = useState({
    description: "",
    github: "",
    linkedIn: "",
    location: "",
    x: "",
    portfolio: "",
  });

  // Keep these as-is per your note
  const [projects, setProjects] = useState([
    { id: 1, name: "E-commerce Platform", status: "active", lastUpdated: "2 hours ago" },
    { id: 2, name: "Portfolio Website", status: "completed", lastUpdated: "1 day ago" },
    { id: 3, name: "Task Management App", status: "active", lastUpdated: "3 days ago" },
    { id: 4, name: "Weather Dashboard", status: "completed", lastUpdated: "1 week ago" },
  ]);

  const [authConnections, setAuthConnections] = useState({
    google: true,
    github: true,
    emailPass: true,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const isLarge = useIsLargeScreen();

  const openPopup = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  const getStatusClass = (status) => {
    return status === 'active'
      ? "bg-[#8236ec] bg-opacity-20 text-[white] border border-[#a15ef3]"
      : "bg-green-100 text-green-700 border border-green-300";
  };

  const handleSignOut = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    try {
      await signOutUser();
    } catch (error) {
      console.log(error);
    } finally {
      setIsExecuting(false);
    }
  }

  useEffect(() => {
    // Map server user -> UI state
    console.log(user);
    setSkills(user?.skills || []);
    setAbout({
      description: user?.about?.description || "",
      github: user?.about?.github || "",
      linkedIn: user?.about?.linkedIn || "",
      location: user?.about?.location || "",
      x: user?.about?.x || "",
      portfolio: user?.about?.portfolio || "",
    });
    setBasicInfo({
      name: user?.username || "",
      title: user?.role || "",
      location: user?.about?.location || "",
      avatarUrl: user?.avatar?.url || "",
      bannerUrl: user?.banner?.url || "",
    });
  }, [user]);

  if (isLoading) {
    return <div>
      loading
    </div>
  }
  if (!isServerReady || !isSignedIn) {
    return <div>
      <h1 className="text-center text-2xl font-bold mt-10">cant enter</h1>
    </div>
  }

  return (
    <motion.div
      className={`min-h-screen ${isLarge ? 'p-8' : 'p-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Profile Banner */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className={`h-38 md:h-56 relative overflow-hidden ${basicInfo.bannerUrl ? "" : "bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#0ea5e9]"}`}
            style={
              basicInfo.bannerUrl
                ? { backgroundImage: `url(${basicInfo.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined
            }
          >
            <button
              className="absolute left-4 top-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm"
              onClick={() =>
                openPopup(
                  <EditBanner
                    initialValues={basicInfo}
                    onClose={closePopup}
                    user={user}
                  />
                )
              }
            >
              <FaPencilAlt className="text-white text-sm" />
            </button>
            <button className="absolute right-4 top-4 text-white flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm" onClick={handleSignOut}>
              <PiSignOut className="inline-block mr-1" /> Sign out
            </button>
          </div>
          <div className={`relative ${isLarge ? 'px-6 py-5' : 'px-4 py-4'}`}>
            <div className="absolute -top-16 left-6 group">
              {basicInfo.avatarUrl ? (
                <img src={basicInfo.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 bg-purple-200 border-white shadow-md object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#7c3aed] via-[#a78bfa] to-[#38bdf8]" />
              )}
              <button
                className={`absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:bg-gray-100 ${!isLarge ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={() =>
                  openPopup(
                    <EditProfileImage
                      initialValues={basicInfo}
                      onClose={closePopup}
                      user={user}
                    />
                  )
                }
              >
                <FaPencilAlt className="text-[#4c1f8e] text-sm" />
              </button>
            </div>
            <div className="ml-36 mt-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{basicInfo.name}</h1>
                <button
                  className="text-gray-400 hover:text-[#4c1f8e] transition-colors"
                  onClick={() =>
                    openPopup(
                      <EditProfile
                        initialValues={basicInfo}
                        onClose={closePopup}
                        user={user}
                      />
                    )
                  }
                >
                  <FaPencilAlt className="text-sm" />
                </button>
              </div>
              <p className="text-gray-600 text-lg mt-1">{basicInfo.title}</p>
              <div className="flex items-center mt-1 text-gray-500">
                {!!basicInfo.location && <FaMapMarkerAlt className="mr-1" />}
                {!!basicInfo.location && <span>{basicInfo.location}</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-3 ${isLarge ? 'gap-6 mt-6' : 'gap-4 mt-4'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Left Column */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Skills */}
            <div className={`bg-white rounded-xl shadow-md ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors flex items-center"
                  onClick={() =>
                    openPopup(
                      <EditSkills
                        initialValues={{ skills }}
                        onClose={closePopup}
                        user={user}
                      />
                    )
                  }
                >
                  <span className="mr-1">+</span> Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-4 py-1.5 bg-[#c2a7fb] bg-opacity-20 text-[#4c1f8e] rounded-full text-sm font-medium hover:bg-opacity-30 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-sm text-gray-500">No skills added yet</span>
                )}
              </div>
            </div>

            {/* About */}
            <div className={`bg-white rounded-xl shadow-md ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">About</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors"
                  onClick={() =>
                    openPopup(
                      <EditAbout
                        initialValues={about}
                        onClose={closePopup}
                        user={user}
                      />
                    )
                  }
                >
                  Edit
                </button>
              </div>
              {!!about.description && (
                <p className="text-gray-700 text-sm mb-5 leading-relaxed">{about?.description}</p>
              )}
              <div className="space-y-3.5">
                {!!about.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-500 mr-3 w-5" />
                    <span className="text-gray-700">
                      {about.location.length > 20 ? `${about.location.slice(0, 20)}...` : about.location}
                    </span>
                  </div>
                )}
                {!!about.portfolio && (
                  <div className="flex items-center">
                    <div className="text-gray-500 mr-3 w-5">🌐</div>
                    <a
                      href={about.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {!!about.linkedIn && (
                  <div className="flex items-center">
                    <FaLinkedin className="text-[#0077b5] mr-3 w-5" />
                    <a
                      href={about.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {!!about.x && (
                  <div className="flex items-center">
                    <FaTwitter className="text-[#1DA1F2] mr-3 w-5" />
                    <a
                      href={about.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {!!about.github && (
                  <div className="flex items-center">
                    <FaGithub className="text-[#333] mr-3 w-5" />
                    <a
                      href={about.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Projects */}
            <div className={`bg-white rounded-xl shadow-md ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Projects</h2>
              </div>
              <div className="space-y-5">
                {projects.map(project => (
                  <div key={project.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{project.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Updated {project.lastUpdated}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Accounts */}
            <div className={`bg-white rounded-xl shadow-md ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Connected Accounts</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors"
                  onClick={() =>
                    openPopup(
                      <ManageAccounts
                        initialValues={authConnections}
                        onClose={closePopup}
                        user={user}
                      />
                    )
                  }
                >
                  Manage
                </button>
              </div>

              <div className="space-y-5">
                {/* Google */}
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <FcGoogle className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Google</p>
                      <p className="text-sm text-gray-500">Access with Google account</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <FaUnlink className="text-lg" />
                  </button>
                </div>

                {/* GitHub */}
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <FaGithub className="text-black text-xl" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">GitHub</p>
                      <p className="text-sm text-gray-500">Access with GitHub account</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <FaUnlink className="text-lg" />
                  </button>
                </div>

                {/* Email and Password */}
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <FaEnvelope className="text-[#4c1f8e] text-xl" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Email and Password</p>
                      <p className="text-sm text-gray-500">Access with your email and password</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <FaUnlink className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>

      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {popupContent}
      </Popup>
    </motion.div>
  );
};

// Sub-components for editing
const EditProfileImage = ({ initialValues, onClose, user }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const file = watch('image')?.[0];
  const [previewUrl, setPreviewUrl] = useState(initialValues?.avatarUrl || "");
  const { updateUser } = useUser();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(initialValues?.avatarUrl || "");
    }
  }, [file, initialValues?.avatarUrl]);

  const onFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await serverRequest.patch(`/users/updateAvatar/${user.firebaseUID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser(data?.data);
      onClose?.();
      console.log("Avatar updated successfully:", data);

    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2">Update Avatar</h2>
      <p className="text-sm text-gray-500 mb-4">Choose an image file (max 1MB). Preview updates instantly.</p>
      <div className="mb-4 flex justify-center">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar preview" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover ring-2 ring-purple-200" />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#7c3aed] via-[#a78bfa] to-[#38bdf8]" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', {
            validate: {
              size: (files) => !files?.[0] || files[0].size <= 1024 * 1024 || "Image must be 1MB or less",
              type: (files) => !files?.[0] || files[0].type.startsWith('image/') || "Only image files are allowed",
            },
          })}
          className="w-full file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
        />
        {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition">Save</button>
      </div>
    </form>
  );
};

const EditBanner = ({ initialValues, onClose, user }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const file = watch('image')?.[0];
  const [previewUrl, setPreviewUrl] = useState(initialValues?.bannerUrl || "");
  const { updateUser } = useUser();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(initialValues?.bannerUrl || "");
    }
  }, [file, initialValues?.bannerUrl]);

  const onFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('banner', file);
      const { data } = await serverRequest.patch(`/users/updateBanner/${user.firebaseUID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data?.data);
      onClose?.();
      console.log("Banner updated successfully:", data);
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2">Update Banner</h2>
      <p className="text-sm text-gray-500 mb-4">Pick a wide image (max 1MB). Preview shown below.</p>
      <div
        className={`w-full h-28 rounded-lg border border-gray-200 mb-4 ${previewUrl ? "" : "bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#0ea5e9]"}`}
        style={previewUrl ? { backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', {
            validate: {
              size: (files) => !files?.[0] || files[0].size <= 1024 * 1024 || "Image must be 1MB or less",
              type: (files) => !files?.[0] || files[0].type.startsWith('image/') || "Only image files are allowed",
            },
          })}
          className="w-full file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
        />
        {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition">Save</button>
      </div>
    </form>
  );
};

const EditProfile = ({ initialValues, onClose, user }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      title: initialValues?.title || "",
      // removed location from default values
    }
  });
  const { updateUser } = useUser();

  const onFormSubmit = async (formdata) => {
    // trim inputs (no location here)
    const cleaned = {
      name: (formdata?.name || "").trim(),
      title: (formdata?.title || "").trim(),
    };
    try {
      const { data } = await serverRequest.patch(
        `/users/updateBasicInfo/${user.firebaseUID}`,
        { username: cleaned.name, role: cleaned.title },
        { headers: { 'Content-Type': 'application/json' } }
      );
      updateUser(data?.data);
      onClose?.();
      console.log("Profile updated successfully:", data);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2">Edit Profile</h2>
      <p className="text-sm text-gray-500 mb-4">Update your public profile details.</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
            placeholder="Full-Stack Developer"
          />
        </div>
        {/* removed Location field from the profile edit popup */}
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm transition">Save</button>
        </div>
      </div>
    </form>
  );
};

const EditSkills = ({ initialValues, onClose, user }) => {
  const [localSkills, setLocalSkills] = useState(initialValues?.skills || []);
  const [input, setInput] = useState("");
  const { handleSubmit, formState: { isSubmitting } } = useForm();
  const { updateUser } = useUser();
  const addSkill = () => {
    const s = input.trim();
    if (!s) return;
    if (!localSkills.includes(s)) setLocalSkills([...localSkills, s]);
    setInput("");
  };
  const removeSkill = (s) => setLocalSkills(localSkills.filter(x => x !== s));
  const clearAll = () => setLocalSkills([]);

  const onFormSubmit = async () => {
    try {
      // trim, remove empties, de-duplicate
      const cleanedSkills = [...new Set(localSkills.map(s => (s || "").trim()).filter(Boolean))];
      if (cleanedSkills.length === 0) {
        throw new Error("Please add at least one skill.");
      }
      const { data } = await serverRequest.patch(
        `/users/updateSkills/${user.firebaseUID}`,
        { skills: cleanedSkills },
        { headers: { 'Content-Type': 'application/json' } }
      );
      updateUser(data?.data);
      console.log("Skills updated successfully:", data);
      onClose?.();
    } catch (error) {
      console.log("Error saving skills:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2">Edit Skills</h2>
      <p className="text-sm text-gray-500 mb-4">Add or remove your top skills.</p>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {localSkills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c2a7fb]/20 text-[#4c1f8e] text-sm">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="text-gray-500 hover:text-red-500" title="Remove">✕</button>
            </span>
          ))}
          {localSkills.length === 0 && <span className="text-sm text-gray-500">No skills yet</span>}
        </div>
        {localSkills.length > 0 && (
          <button type="button" onClick={clearAll} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Clear all</button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          placeholder="Add a skill and press Enter"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
        />
        <button type="button" onClick={addSkill} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] transition">Add</button>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm transition">Save</button>
      </div>
    </form>
  );
};

const EditAbout = ({ initialValues, onClose, user }) => {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      description: initialValues?.description || "",
      github: initialValues?.github || "",
      linkedIn: initialValues?.linkedIn || "",
      location: initialValues?.location || "",
      x: initialValues?.x || "",
      portfolio: initialValues?.portfolio || "",
    }
  });
  const { updateUser } = useUser();

  // trim first, then validate https
  const httpsValidator = (v) => {
    const val = (v || "").trim();
    return !val || /^https:\/\//i.test(val) || "Must start with https://";
  };

  const onFormSubmit = async (data) => {
    const cleaned = {
      description: (data.description || "").trim(),
      github: (data.github || "").trim(),
      linkedIn: (data.linkedIn || "").trim(),
      location: (data.location || "").trim(),
      x: (data.x || "").trim(),
      portfolio: (data.portfolio || "").trim(),
    };
    console.log("Cleaned About:", cleaned);
    try {
      const { data } = await serverRequest.patch(
        `/users/updateAbout/${user?.firebaseUID}`,
        { data: cleaned },
        { headers: { "Content-Type": "application/json" } }
      );
      updateUser(data?.data);
      console.log(data?.data);
    } catch (error) {
      console.log("Error updating the about section:", error);
    }
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2">Edit About</h2>
      <p className="text-sm text-gray-500 mb-4">Only filled fields will be shown on your profile.</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
            placeholder="Tell the world about you..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              {...register("location")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio</label>
            <input
              type="text"
              {...register("portfolio", { validate: httpsValidator })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
              placeholder="https://your-site.com"
            />
            {errors.portfolio && <p className="text-xs text-red-600 mt-1">{errors.portfolio.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="text"
              {...register("linkedIn", { validate: httpsValidator })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedIn && <p className="text-xs text-red-600 mt-1">{errors.linkedIn.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">X (Twitter)</label>
            <input
              type="text"
              {...register("x", { validate: httpsValidator })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
              placeholder="https://x.com/handle"
            />
            {errors.x && <p className="text-xs text-red-600 mt-1">{errors.x.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">GitHub</label>
            <input
              type="text"
              {...register("github", { validate: httpsValidator })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400"
              placeholder="https://github.com/username"
            />
            {errors.github && <p className="text-xs text-red-600 mt-1">{errors.github.message}</p>}
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm transition">Save</button>
        </div>
      </div>
    </form>
  );
};

const ManageAccounts = ({ initialValues, onClose, user }) => {
  const { register, handleSubmit, formState: { isSubmitting }, watch } = useForm({
    defaultValues: {
      google: !!initialValues?.google,
      github: !!initialValues?.github,
      emailPass: !!initialValues?.emailPass,
    }
  });

  const onFormSubmit = (data) => {
    onClose?.();
  };

  const google = watch('google');
  const github = watch('github');
  const emailPass = watch('emailPass');

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-4">Manage Connected Accounts</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FcGoogle className="w-6 h-6 mr-3" />
            <p className="text-gray-800 font-medium">Google</p>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register('google')} className="h-4 w-4" />
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${google ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
              {google ? "Unlink" : "Link"}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGithub className="w-6 h-6 mr-3 text-black" />
            <p className="text-gray-800 font-medium">GitHub</p>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register('github')} className="h-4 w-4" />
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${github ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
              {github ? "Unlink" : "Link"}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaEnvelope className="w-6 h-6 mr-3 text-[#4c1f8e]" />
            <p className="text-gray-800 font-medium">Email and Password</p>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register('emailPass')} className="h-4 w-4" />
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${emailPass ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
              {emailPass ? "Unlink" : "Link"}
            </span>
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Close</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] hover:bg-[#6229b3] shadow-sm transition">Save</button>
      </div>
    </form>
  );
};

export default Dashboard;

