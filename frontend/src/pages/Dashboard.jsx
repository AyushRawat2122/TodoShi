import React, { useState } from 'react';
import {
  FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaPencilAlt, FaEnvelope, FaUnlink
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { PiSignOut } from "react-icons/pi";
import { motion } from 'framer-motion'; // Import framer-motion

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex sm:p-2 items-center justify-center z-50">
      <motion.div initial={{ opacity: 0, scale: .5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: .5 }}
        transition={{ duration: 0.2, ease: "easeInOut" }} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative md:max-w-lg md:rounded-lg md:p-6 md:mx-auto md:my-auto sm:w-full sm:h-full sm:rounded-none sm:p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  // 🎯 Independent states
  const [basicInfo, setBasicInfo] = useState({
    name: "Ayush Rawat",
    title: "Frontend Developer",
    location: "New Delhi, India",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    coverBg: "bg-gradient-to-r from-[#4c1f8e] to-[#8236ec]",
  });

  const [skills, setSkills] = useState([
    "React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "Next.js", "UI/UX Design", "Firebase"
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: "E-commerce Platform", status: "active", lastUpdated: "2 hours ago" },
    { id: 2, name: "Portfolio Website", status: "completed", lastUpdated: "1 day ago" },
    { id: 3, name: "Task Management App", status: "active", lastUpdated: "3 days ago" },
    { id: 4, name: "Weather Dashboard", status: "completed", lastUpdated: "1 week ago" },
  ]);

  const [about, setAbout] = useState({
    bio: "Passionate frontend developer with 4+ years of experience building modern web applications",
    location: "New Delhi, India",
    website: "ayushrawat.dev",
    socials: {
      linkedin: "ayush-rawat",
      twitter: "ayushrawat",
      github: "ayushrawat",
    },
  });

  const [authConnections, setAuthConnections] = useState({
    google: true,
    github: true,
    emailPass: true,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

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

  return (
    <motion.div
      className="min-h-screen p-6 md:p-10"
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
          <div className={`h-48 md:h-56 ${basicInfo.coverBg} relative`}>
            <button
              className="absolute left-4 top-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm"
              onClick={() => openPopup(<EditBanner basicInfo={basicInfo} setBasicInfo={setBasicInfo} />)}
            >
              <FaPencilAlt className="text-white text-sm" />
            </button>
            <button className="absolute right-4 top-4 text-white flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm">
              <PiSignOut className="inline-block mr-1" /> Sign out
            </button>
          </div>
          <div className="relative px-6 py-5">
            <div className="absolute -top-16 left-6 group">
              <img src={basicInfo.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 bg-purple-200 border-white shadow-md object-cover" />
              <button
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                onClick={() => openPopup(<EditProfile basicInfo={basicInfo} setBasicInfo={setBasicInfo} />)}
              >
                <FaPencilAlt className="text-[#4c1f8e] text-sm" />
              </button>
            </div>
            <div className="ml-36 mt-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{basicInfo.name}</h1>
                <button
                  className="text-gray-400 hover:text-[#4c1f8e] transition-colors"
                  onClick={() => openPopup(<EditProfile basicInfo={basicInfo} setBasicInfo={setBasicInfo} />)}
                >
                  <FaPencilAlt className="text-sm" />
                </button>
              </div>
              <p className="text-gray-600 text-lg mt-1">{basicInfo.title}</p>
              <div className="flex items-center mt-1 text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                <span>{basicInfo.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors flex items-center"
                  onClick={() => openPopup(<EditSkills skills={skills} />)}
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
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">About</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors"
                  onClick={() => openPopup(<EditAbout about={about} />)}
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-700 text-sm mb-5 leading-relaxed">{about.bio}</p>
              <div className="space-y-3.5">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-3 w-5" />
                  <span className="text-gray-700">{about.location}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-gray-500 mr-3 w-5">🌐</div>
                  <span className="text-gray-700">{about.website}</span>
                </div>
                <div className="flex items-center">
                  <FaLinkedin className="text-[#0077b5] mr-3 w-5" />
                  <span className="text-gray-700">{about.socials.linkedin}</span>
                </div>
                <div className="flex items-center">
                  <FaTwitter className="text-[#1DA1F2] mr-3 w-5" />
                  <span className="text-gray-700">{about.socials.twitter}</span>
                </div>
                <div className="flex items-center">
                  <FaGithub className="text-[#333] mr-3 w-5" />
                  <span className="text-gray-700">{about.socials.github}</span>
                </div>
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Projects</h2>
                <button
                  className="px-4 py-2 bg-[#6229b3] text-white rounded-full text-sm flex items-center hover:bg-[#4c1f8e] transition-colors"
                  onClick={() => openPopup(<EditProjects projects={projects} />)}
                >
                  <span className="mr-1">+</span> New Project
                </button>
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Connected Accounts</h2>
                <button
                  className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors"
                  onClick={() =>
                    openPopup(
                      <ManageAccounts
                        authConnections={authConnections}
                        setAuthConnections={setAuthConnections}
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
const EditProfile = ({ basicInfo, setBasicInfo }) => {
  const [name, setName] = useState(basicInfo.name);
  const [title, setTitle] = useState(basicInfo.title);
  const [location, setLocation] = useState(basicInfo.location);

  const handleSave = () => {
    setBasicInfo((prev) => ({ ...prev, name, title, location }));
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]"
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-[#4c1f8e] text-white rounded-md hover:bg-[#6229b3] transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const EditBanner = ({ basicInfo, setBasicInfo }) => {
  const [coverBg, setCoverBg] = useState(basicInfo.coverBg);

  const handleSave = () => {
    setBasicInfo((prev) => ({ ...prev, coverBg }));
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Banner</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Banner Background</label>
          <input
            type="text"
            value={coverBg}
            onChange={(e) => setCoverBg(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]"
            placeholder="Enter CSS gradient or color"
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-[#4c1f8e] text-white rounded-md hover:bg-[#6229b3] transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const EditSkills = ({ skills }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">Edit Skills</h2>
    {/* Add form fields for editing skills */}
    <p>Current skills: {skills.join(", ")}</p>
  </div>
);

const EditAbout = ({ about }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">Edit About</h2>
    {/* Add form fields for editing about section */}
    <p>Current bio: {about.bio}</p>
  </div>
);

const EditProjects = ({ projects }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">Edit Projects</h2>
    {/* Add form fields for editing projects */}
    <p>Number of projects: {projects.length}</p>
  </div>
);

const ManageAccounts = ({ authConnections, setAuthConnections }) => {
  const toggleConnection = (account) => {
    setAuthConnections((prev) => ({
      ...prev,
      [account]: !prev[account],
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Manage Connected Accounts</h2>
      <div className="space-y-4">
        {/* Google */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FcGoogle className="w-6 h-6 mr-3" />
            <p className="text-gray-800 font-medium">Google</p>
          </div>
          <button
            onClick={() => toggleConnection("google")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${authConnections.google
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
              } transition-all`}
          >
            {authConnections.google ? "Unlink" : "Link"}
          </button>
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGithub className="w-6 h-6 mr-3 text-black" />
            <p className="text-gray-800 font-medium">GitHub</p>
          </div>
          <button
            onClick={() => toggleConnection("github")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${authConnections.github
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
              } transition-all`}
          >
            {authConnections.github ? "Unlink" : "Link"}
          </button>
        </div>

        {/* Email and Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaEnvelope className="w-6 h-6 mr-3 text-[#4c1f8e]" />
            <p className="text-gray-800 font-medium">Email and Password</p>
          </div>
          <button
            onClick={() => toggleConnection("emailPass")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${authConnections.emailPass
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
              } transition-all`}
          >
            {authConnections.emailPass ? "Unlink" : "Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
