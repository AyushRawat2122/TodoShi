import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaPencilAlt, FaEnvelope, FaUnlink, FaInfoCircle, FaCheckCircle
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { PiSignOut } from "react-icons/pi";
import { motion } from 'framer-motion';
import { signOutUser } from "../firebase/auth.js"
import { useForm } from 'react-hook-form';
import serverRequest from '../utils/axios.js';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useUser from '../hooks/useUser';
import { FiExternalLink } from 'react-icons/fi';
import Loader from '../components/Loader.jsx';
import useConnections from '../hooks/useConnections.js';
import { linkGitHub, linkGoogle } from "../firebase/auth.js"
import { GoProject } from "react-icons/go";
import { showSuccessToast, showErrorToast } from '../utils/toastMethods.js';

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
        className="relative bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 w-full max-w-xl rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-[#c2a7fb]/20 overflow-hidden dark:border dark:border-[#c2a7fb]/20"
        onClick={(e) => e.stopPropagation()}

      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#0ea5e9]" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#0c0a1a]/50 hover:bg-white dark:hover:bg-[#c2a7fb]/10 text-gray-700 dark:text-purple-200 shadow-sm border border-white/60 dark:border-[#c2a7fb]/20 backdrop-blur transition"
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
  const { user: userState } = useUser();
  const { getConnectionDetails } = useConnections();

  const user = userState?.data;

  const connections = getConnectionDetails();

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
    google: { isLinked: false, email: "" },
    github: { isLinked: false, email: "" },
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

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
      showErrorToast("Error signing out. Please try again.");
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
      _id: user?._id || "",
      location: user?.about?.location || "",
      avatarUrl: user?.avatar?.url || "",
      bannerUrl: user?.banner?.url || "",
    });
  }, [user]);

  useEffect(() => {
    console.log("Triggered SSO Connections :", connections);
    setAuthConnections({
      google: connections.google || false,
      github: connections.github || false,
    });
  }, [connections]);

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectLoading(true);
      try {
        const response = await serverRequest.get(`/projects/displayProjects/${user._id}`);
        setProjects(response?.data?.data || []);
      } catch (error) {
        showErrorToast("Failed to load projects. Please try again.");
      } finally {
        setProjectLoading(false);
      }
    };

    if (user?._id) {
      fetchProjects();
    }
  }, [user]);

  return (
    <motion.div
      className={`min-h-screen dark:bg-[#0c0a1a] ${isLarge ? 'px-8' : 'p-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Profile Banner */}
        <motion.div
          className="bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 rounded-xl shadow-md dark:shadow-[#c2a7fb]/5 overflow-hidden dark:border dark:border-[#c2a7fb]/20"
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
            <div className={`absolute ${isLarge ? "-top-16 left-6" : "-top-8 left-4"} group`}>
              {basicInfo.avatarUrl ? (
                <img src={basicInfo.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 bg-purple-200 dark:bg-[#c2a7fb]/20 border-white dark:border-[#c2a7fb]/60 shadow-md object-cover" />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-white dark:border-[#c2a7fb]/60 shadow-md bg-gradient-to-br from-[#7c3aed] via-[#a78bfa] to-[#38bdf8]"><span className='font-serif text-7xl font-[800]'>G</span></div>
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
                <FaPencilAlt className="text-[#4c1f8e] dark:text-[#0f0030] text-sm" />
              </button>
            </div>
            <div className="ml-36 mt-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-purple-50">{basicInfo.name}</h1>
                <button
                  className="text-gray-400 dark:text-purple-300/60 hover:text-[#4c1f8e] dark:hover:text-[#c2a7fb] transition-colors"
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
              <p className="text-gray-500 dark:text-purple-300/60 text-sm">#ID : {basicInfo._id}</p>
              <p className="text-gray-600 dark:text-purple-200/80 text-lg mt-1">{basicInfo.title}</p>
              <div className="flex items-center mt-1 text-gray-500 dark:text-purple-300/60">
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
            <div className={`bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 rounded-xl shadow-md dark:shadow-[#c2a7fb]/5 dark:border dark:border-[#c2a7fb]/20 ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-purple-100">Skills</h2>
                <button
                  className="text-[#8236ec] dark:text-[#c2a7fb] text-sm font-medium hover:text-[#4c1f8e] dark:hover:text-[#c2a7fb]/80 transition-colors flex items-center"
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
                  <span key={index} className="px-4 py-1.5 bg-[#c2a7fb] bg-opacity-20 dark:bg-[#c2a7fb]/30 text-[#4c1f8e] dark:text-white rounded-full text-sm font-medium hover:bg-opacity-30 dark:hover:bg-[#c2a7fb]/40 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-purple-300/60">No skills added yet</span>
                )}
              </div>
            </div>
            {/* About */}
            <div className={`bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 rounded-xl shadow-md dark:shadow-[#c2a7fb]/5 dark:border dark:border-[#c2a7fb]/20 ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-purple-100">About</h2>
                <button
                  className="text-[#8236ec] dark:text-[#c2a7fb] text-sm font-medium hover:text-[#4c1f8e] dark:hover:text-[#c2a7fb]/80 transition-colors"
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
                <p className="text-gray-700 dark:text-purple-200/80 text-sm mb-5 leading-relaxed">{about?.description}</p>
              )}

              <div className="space-y-3.5">
                {!!about.location && (

                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-500 dark:text-purple-300/60 mr-3 w-5" />
                    <span className="text-gray-700 dark:text-purple-200/80">
                      {about.location.length > 20 ? `${about.location.slice(0, 20)}...` : about.location}
                    </span>
                  </div>

                )}

                {!!about.portfolio && (

                  <div className="flex items-center">

                    <div className="text-gray-500 dark:text-purple-300/60 mr-3 w-5">🌐</div>
                    <a
                      href={about.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] dark:text-[#c2a7fb] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {!!about.linkedIn && (
                  <div className="flex items-center">
                    <FaLinkedin className="text-[#0077b5] dark:text-[#0077b5]/80 mr-3 w-5" />
                    <a
                      href={about.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] dark:text-[#c2a7fb] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {!!about.x && (
                  <div className="flex items-center">
                    <FaTwitter className="text-[#1DA1F2] dark:text-[#1DA1F2]/80 mr-3 w-5" />
                    <a
                      href={about.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] dark:text-[#c2a7fb] hover:underline"
                    >
                      Visit <FiExternalLink className="inline-block w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {!!about.github && (
                  <div className="flex items-center">
                    <FaGithub className="text-[#333] dark:text-white mr-3 w-5" />
                    <a
                      href={about.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#4c1f8e] dark:text-[#c2a7fb] hover:underline"
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

            <div className={`bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 rounded-xl shadow-md dark:shadow-[#c2a7fb]/5 dark:border dark:border-[#c2a7fb]/20 ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-purple-100">Projects</h2>
              </div>

              <div className="space-y-5">
                {projectLoading && <div className="flex justify-center"><Loader className="w-5 h-5" /></div>}
                {!projectLoading && <div>
                  {projects.map(project => (
                    <div key={project.id} className="border-b border-gray-200 dark:border-[#c2a7fb]/20 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 p-3 rounded-lg transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className='flex items-center justify-center'>
                            {project?.ProjectImage?.url !== "" && <img src={project.ProjectImage?.url || 'https://via.placeholder.com/40'} alt={project.title} className="w-10 h-10 rounded-full flex items-center justify-center object-cover mb-2" />}
                            {project?.ProjectImage?.url === "" && <div className="w-10 h-10 flex justify-center items-center text-2xl font-extrabold text-white rounded-full border bg-purple-300 border-gray-200 dark:border-[#c2a7fb]/20"><GoProject /></div>}
                          </div>
                          <div className='flex flex-col justify-center'>
                            <h3 className="font-medium text-gray-800 dark:text-purple-100">{project.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-purple-300/60 mt-1">created {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(project.activeStatus ? 'active' : 'inactive')}`}>
                          {project.activeStatus ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>}
              </div>
            </div>



            {/* Connected Accounts */}
            <div className={`bg-white dark:bg-[#0c0a1a] dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 rounded-xl shadow-md dark:shadow-[#c2a7fb]/5 dark:border dark:border-[#c2a7fb]/20 ${isLarge ? 'p-6' : 'p-4'}`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-purple-100">Connected Accounts</h2>
                <button
                  className="text-[#8236ec] dark:text-[#c2a7fb] text-sm font-medium hover:text-[#4c1f8e] dark:hover:text-[#c2a7fb]/80 transition-colors"
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
                {authConnections.google.isLinked && (
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 rounded-lg transition-all">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0c0a1a]/50 border border-gray-200 dark:border-[#c2a7fb]/20 flex items-center justify-center">
                        <FcGoogle className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 dark:text-purple-100 font-medium">Google</p>
                        <p className="text-sm text-gray-500 dark:text-purple-300/60">
                          {authConnections.google.email ? `Linked as ${authConnections.google.email}` : "Access with Google account"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* GitHub */}
                {authConnections.github.isLinked && (
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 rounded-lg transition-all">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0c0a1a]/50 border border-gray-200 dark:border-[#c2a7fb]/20 flex items-center justify-center">
                        <FaGithub className="text-black dark:text-white text-xl" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-800 dark:text-purple-100 font-medium">GitHub</p>
                        <p className="text-sm text-gray-500 dark:text-purple-300/60">
                          {authConnections.github.email ? `GitHub primary email address: ${authConnections.github.email}` : "Access with GitHub account"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!authConnections.google.isLinked && !authConnections.github.isLinked && (
                  <p className="text-sm text-gray-500 dark:text-purple-300/60 p-3">No accounts connected. Click "Manage" to add a provider.</p>
                )}
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div >
      {!isLarge && <div className='h-40' />}
      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup} >
        {popupContent}
      </Popup >
    </motion.div >
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
      showSuccessToast("Avatar updated successfully.");
    } catch (error) {
      showErrorToast("Error updating avatar. Please try again.");
      console.error("Error updating avatar:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2 dark:text-purple-100">Update Avatar</h2>
      <p className="text-sm text-gray-500 dark:text-purple-200/80 mb-4">Choose an image file (max 1MB). Preview updates instantly.</p>
      <div className="mb-4 flex justify-center">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar preview" className="w-32 h-32 rounded-full border-4 border-white dark:border-[#c2a7fb]/30 shadow-md object-cover ring-2 ring-purple-200 dark:ring-[#c2a7fb]/20" />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#c2a7fb]/30 shadow-md bg-gradient-to-br from-[#7c3aed] via-[#a78bfa] to-[#38bdf8]" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Select image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', {
            validate: {
              size: (files) => !files?.[0] || files[0].size <= 1024 * 1024 || "Image must be 1MB or less",
              type: (files) => !files?.[0] || files[0].type.startsWith('image/') || "Only image files are allowed",
            },
          })}
          className="w-full file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-[#c2a7fb]/10 file:text-gray-700 dark:file:text-purple-200 hover:file:bg-gray-200 dark:hover:file:bg-[#c2a7fb]/20 border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-[#c2a7fb]/20 focus:border-purple-400 dark:focus:border-[#c2a7fb]/40 dark:bg-[#0c0a1a]/30"
        />
        {errors.image && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.image.message}</p>}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 bg-white dark:bg-[#0c0a1a]/50 text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] dark:bg-[#6229b3]/40 hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition">Save</button>
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
      showSuccessToast("Banner updated successfully.");
      console.log("Banner updated successfully:", data);
    } catch (error) {
      showErrorToast("Error updating banner. Please try again.");
      console.log("Error updating banner:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2 dark:text-purple-100">Update Banner</h2>
      <p className="text-sm text-gray-500 dark:text-purple-200/80 mb-4">Pick a wide image (max 1MB). Preview shown below.</p>
      <div
        className={`w-full h-28 rounded-lg border border-gray-200 dark:border-[#c2a7fb]/20 mb-4 ${previewUrl ? "" : "bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#0ea5e9]"}`}
        style={previewUrl ? { backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Select image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', {
            validate: {
              size: (files) => !files?.[0] || files[0].size <= 1024 * 1024 || "Image must be 1MB or less",
              type: (files) => !files?.[0] || files[0].type.startsWith('image/') || "Only image files are allowed",
            },
          })}
          className="w-full file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-[#c2a7fb]/10 file:text-gray-700 dark:file:text-purple-200 hover:file:bg-gray-200 dark:hover:file:bg-[#c2a7fb]/20 border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-[#c2a7fb]/20 focus:border-purple-400 dark:focus:border-[#c2a7fb]/40 dark:bg-[#0c0a1a]/30"
        />
        {errors.image && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.image.message}</p>}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 bg-white dark:bg-[#0c0a1a]/50 text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] dark:bg-[#6229b3]/40 hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition">Save</button>
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
      showSuccessToast("Profile updated successfully.");
    } catch (error) {
      showErrorToast("Error updating profile. Please try again.");
      console.log("Error updating profile:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2 dark:text-purple-100">Edit Profile</h2>
      <p className="text-sm text-gray-500 dark:text-purple-200/80 mb-4">Update your public profile details.</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-purple-200">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-[#c2a7fb]/20 focus:border-purple-400 dark:focus:border-[#c2a7fb]/40 dark:bg-[#0c0a1a]/30 dark:text-purple-100"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-purple-200">Title</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-[#c2a7fb]/20 focus:border-purple-400 dark:focus:border-[#c2a7fb]/40 dark:bg-[#0c0a1a]/30 dark:text-purple-100"
            placeholder="Full-Stack Developer"
          />
        </div>
        {/* removed Location field from the profile edit popup */}
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 bg-white dark:bg-[#0c0a1a]/50 text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] dark:bg-[#6229b3]/40 hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 shadow-sm transition">Save</button>
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
      showSuccessToast("Skills updated successfully.");
      onClose?.();
    } catch (error) {
      showErrorToast("Error saving skills. Please try again.");
      console.log("Error saving skills:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {isSubmitting && <div className="flex justify-center mb-2"><Loader className="w-5 h-5" /></div>}
      <h2 className="text-lg font-bold mb-2 dark:text-purple-100">Edit Skills</h2>
      <p className="text-sm text-gray-500 dark:text-purple-200/80 mb-4">Add or remove your top skills.</p>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {localSkills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c2a7fb]/20 dark:bg-[#c2a7fb]/30 text-[#4c1f8e] dark:text-white text-sm">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="text-gray-500 dark:text-purple-300/60 hover:text-red-500 dark:hover:text-red-400" title="Remove">✕</button>
            </span>
          ))}
          {localSkills.length === 0 && <span className="text-sm text-gray-500 dark:text-purple-300/60">No skills yet</span>}
        </div>
        {localSkills.length > 0 && (
          <button type="button" onClick={clearAll} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#c2a7fb]/20 text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10">Clear all</button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          placeholder="Add a skill and press Enter"
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-[#c2a7fb]/20 focus:border-purple-400 dark:focus:border-[#c2a7fb]/40 dark:bg-[#0c0a1a]/30 dark:text-purple-100"
        />
        <button type="button" onClick={addSkill} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] dark:bg-[#6229b3]/40 hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 transition">Add</button>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 bg-white dark:bg-[#0c0a1a]/50 text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 rounded-xl text-white bg-[#4c1f8e] dark:bg-[#6229b3]/40 hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 shadow-sm transition">Save</button>
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
      showSuccessToast("About section updated successfully.");
    } catch (error) {
      console.log("Error updating the about section:", error);
      showErrorToast("Error updating About section. Please try again.");
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
  const [linking, setLinking] = useState(false);

  // current connection state from props

  const linked = {
    google: !!initialValues?.google?.isLinked || false,
    github: !!initialValues?.github?.isLinked || false,
  };

  const emails = {
    google: initialValues?.google?.email || "",
    github: initialValues?.github?.email || "",
  };
  const { setGithubConnection, setGoogleConnection } = useConnections()

  const linkWithGoogle = async () => {
    try {
      const result = await linkGoogle();
      const googleCredentials = result?.user?.providerData.find(p => p.providerId === 'google.com');
      setGoogleConnection({ isLinked: googleCredentials?.email ? true : false, email: googleCredentials?.email || "" });
      console.log("Google linked successfully:", result?.user);
    } catch (error) {
      throw error;
    }
  };


  const linkWithGithub = async () => {
    try {
      const result = await linkGitHub();
      const githubCredentials = result?.user?.providerData.find(p => p.providerId === 'github.com');
      setGithubConnection({ isLinked: githubCredentials?.email ? true : false, email: githubCredentials?.email || "" });
      console.log("GitHub linked successfully:", result?.user);
    } catch (error) {
      throw error;
    }
  };


  const handleLink = async (provider) => {

    setLinking(true);

    try {
      if (provider === 'google') {
        await linkWithGoogle();
      } else if (provider === 'github') {
        await linkWithGithub();
      }
      showSuccessToast(`${provider} account linked successfully!`);
      onClose?.(); // close after successful link
    } catch (e) {
      showErrorToast(`Failed to link ${provider} account. Please try again.`);
      console.log(`Failed to link ${provider}:`, e);
    } finally {
      setLinking(false);
    }

  };

  return (
    <div>
      {linking && (
        <div className="flex justify-center mb-2">
          <Loader className="w-5 h-5" />
        </div>
      )}


      <h2 className="text-lg font-bold mb-2 dark:text-purple-100">Manage Connected Accounts</h2>
      <p className="text-sm text-gray-500 dark:text-purple-200/80 mb-4">Connect a provider to sign in faster.</p>


      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <FaInfoCircle className="mt-0.5 text-amber-600" />
        <p className="text-sm text-amber-800">
          Note: Initial version links only one account per provider and does not support unlinking.
          You can’t add multiple IDs for the same provider, and there’s no unlink facility. Choose wisely.
        </p>
      </div>

      <div className="space-y-3">

        {/* Google */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 p-3 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0c0a1a]/50 border border-gray-200 dark:border-[#c2a7fb]/20 flex items-center justify-center">
              <FcGoogle className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-gray-800 dark:text-purple-100 font-medium">Google</p>
              <p className="text-xs text-gray-500 dark:text-purple-300/60">
                {emails.google ? `Linked as ${emails.google}` : "Use your Google account"}
              </p>
            </div>
          </div>

          {linked.google ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <FaCheckCircle className="text-green-600" /> Linked
            </span>
          ) : (
            <button
              type="button"
              onClick={() => handleLink('google')}
              disabled={linking}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4c1f8e] text-white hover:bg-[#6229b3] shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {linking ? 'Linking…' : 'Link'}
            </button>
          )}
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#c2a7fb]/20 p-3 hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0c0a1a]/50 border border-gray-200 dark:border-[#c2a7fb]/20 flex items-center justify-center">
              <FaGithub className="text-black dark:text-white text-xl" />
            </div>
            <div className="ml-3">
              <p className="text-gray-800 dark:text-purple-100 font-medium">GitHub</p>
              <p className="text-xs text-gray-500 dark:text-purple-300/60">
                {emails.github ? `Linked as ${emails.github}` : "Use your GitHub account"}
              </p>
            </div>
          </div>

          {linked.github ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <FaCheckCircle className="text-green-600" /> Linked
            </span>
          ) : (
            <button
              type="button"
              onClick={() => handleLink('github')}
              disabled={linking}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4c1f8e] text-white hover:bg-[#6229b3] shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {linking ? 'Linking…' : 'Link'}
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;