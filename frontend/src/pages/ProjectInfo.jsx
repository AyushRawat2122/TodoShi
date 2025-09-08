import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// Import React Icons
import { FiEdit, FiUpload, FiUser, FiSettings, FiX } from 'react-icons/fi';
import { HiDocument, HiDocumentText, HiCalendar } from 'react-icons/hi';
import { BsCheckCircleFill, BsLink, BsGlobe, BsImage } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectInfo() {
  const { projectId } = useParams();
  // State for popup modals
  const [showEditProject, setShowEditProject] = useState(false);
  const [showUpdateDesc, setShowUpdateDesc] = useState(false);
  const [showManageLinks, setShowManageLinks] = useState(false);
  const [showUploadVersion, setShowUploadVersion] = useState(false);
  
  // Static placeholder data
  const projectName = "TodoShi Project";
  const projectSubtitle = "Task Management & Productivity Suite";
  const createdDate = "March 2024";
  const owner = {
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Project Owner & Lead Developer",
  };
  const description = `A comprehensive task management application designed to help teams organize, track, and complete projects efficiently. Features include real-time collaboration, automated workflows, detailed analytics, and seamless integration with popular development tools. Built with modern web technologies to ensure scalability and performance.`;
  const links = [
    { label: "Live Application", url: "https://todoshi.app", action: "Visit" },
    { label: "Documentation", url: "https://docs.todoshi.app", action: "View" }
  ];
  const srs = {
    name: "Software Requirements Specification",
    file: "TodoShi_SRS_v2.1.pdf",
    size: "2.4 MB",
    updated: "2 days ago",
    url: "#"
  };

  return (
    <div className="sm:p-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-b from-gray-900 to-[#4c1f8e] dark:from-[#0c0a1a] dark:to-[#4c1f8e]/40 p-5 sm:p-4 flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
          <div className="bg-[#f0f4ff] rounded-xl h-[100px] w-[100px] p-4 sm:p-3 flex items-center justify-center max-sm:w-[70px] max-sm:h-[70px]">
            <BsCheckCircleFill className="w-14 h-14 max-sm:w-8 max-sm:h-8 text-[#4068fc]" />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{projectName}</h1>
            <div className="text-base sm:text-sm text-white/80 mt-1">Expected Deadline: October 2024</div>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
              <span className="bg-[#1a3d29] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Active
              </span>
              <span className="text-white/70 text-sm flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4" />
                Created {createdDate}
              </span>
            </div>
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg flex md:min-w-[135px] items-center gap-2 text-base sm:text-sm"
          onClick={() => setShowEditProject(true)}
        >
          <FiEdit className="w-5 h-5 sm:w-4 sm:h-4" />
          Edit Project
        </button>
      </div>

      {/* Info Grid - now using divs */}
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
        {/* Project Description */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1 grow-2 flex flex-col justify-between">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <HiDocumentText className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Description
          </div>
          <div className="text-gray-700 dark:text-purple-200/80 text-base mb-4">{description}</div>
          <button 
            className="px-4 py-2 font-semibold max-w-[200px] bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex items-center gap-2 text-base sm:text-sm"
            onClick={() => setShowUpdateDesc(true)}
          >
            <FiEdit className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
            Update Description
          </button>
        </div>

        {/* Project Owner */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex flex-col items-center flex-1">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 self-start mb-6 text-lg sm:text-base">
            <FiUser className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Owner
          </div>
          <div className="bg-[#6229b3] rounded-full w-18 h-18 flex items-center justify-center text-white mb-3">
            <FiUser className="w-9 h-9 sm:w-8 sm:h-8" />
          </div>
          <div className="font-bold text-gray-800 dark:text-purple-100 text-xl sm:text-lg mt-2">{owner.name}</div>
          <div className="text-base sm:text-sm text-gray-600 dark:text-purple-200/70 mt-1">{owner.email}</div>
          <div className="text-sm text-gray-500 dark:text-purple-200/50 mt-0.5">{owner.role}</div>
          <button className="px-4 py-2 mt-4 bg-white font-semibold dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 text-base sm:text-sm">
            View Profile
          </button>
        </div>
      </div>

      {/* Links & SRS - now using divs */}
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6 mt-5 sm:mt-6 mb-4">
        {/* Project Links */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <BsLink className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Links
          </div>
          <div className="mb-5 sm:mb-6 space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex flex-wrap sm:flex-nowrap items-center justify-between py-2 gap-2">
                <div className="flex items-center gap-3">
                  <BsGlobe className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb] flex-shrink-0" />
                  <div className="min-w-0 overflow-hidden">
                    <div className="text-base sm:text-sm font-medium text-gray-800 dark:text-purple-100 truncate">{link.label}</div>
                    <div className="text-sm sm:text-xs text-gray-500 dark:text-purple-200/70 truncate">{link.url}</div>
                  </div>
                </div>
                <a href={link.url} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-[#e1eaff] dark:bg-[#6229b3]/30 rounded-md text-[#3b5bdb] dark:text-purple-200 hover:bg-[#d0deff] dark:hover:bg-[#6229b3]/40 text-base sm:text-sm font-medium">
                  {link.action}
                </a>
              </div>
            ))}
          </div>
          <button 
            className="px-4 py-2 font-semibold bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex items-center gap-2 text-base sm:text-sm"
            onClick={() => setShowManageLinks(true)}
          >
            <FiSettings className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
            Manage Links
          </button>
        </div>

        {/* SRS Document */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <HiDocument className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            SRS Document
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-100 dark:border-[#c2a7fb]/20 rounded-lg bg-gray-50 dark:bg-[#13111d] p-4 mb-4">
            <HiDocument className="w-12 h-12 sm:w-10 sm:h-10 text-[#6229b3] dark:text-[#c2a7fb]" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base sm:text-sm text-gray-800 dark:text-purple-100 truncate">{srs.name}</div>
              <div className="text-sm text-gray-500 dark:text-purple-200/70 mt-0.5 truncate">{srs.file} • {srs.size} • Updated {srs.updated}</div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <a href={srs.url} download className="px-4 py-1.5 bg-[#e1eaff] dark:bg-[#6229b3]/30 rounded-md text-[#3b5bdb] dark:text-purple-200 hover:bg-[#d0deff] dark:hover:bg-[#6229b3]/40 text-base sm:text-sm font-medium">
                Download
              </a>
              <button className="px-4 py-1.5 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 text-base sm:text-sm">
                Edit
              </button>
            </div>
          </div>
          <button 
            className="w-full px-4 font-semibold py-2 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex items-center justify-center gap-2 text-base sm:text-sm"
            onClick={() => setShowUploadVersion(true)}
          >
            <FiUpload className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
            Upload New Version
          </button>
        </div>
      </div>

      {/* Extra padding div for mobile */}
      <div className="h-16 md:hidden"></div>
      
      {/* Popup Modals */}
      {/* 1. Edit Project Modal */}
      <AnimatePresence>
        {showEditProject && (
          <ModalWrapper onClose={() => setShowEditProject(false)}>
            <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Edit Project</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setShowEditProject(false)}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Project Title</label>
                  <input 
                    type="text" 
                    defaultValue={projectName}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Expected Deadline</label>
                  <input 
                    type="date" 
                    defaultValue="2024-10-31"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Project Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BsCheckCircleFill className="h-8 w-8 text-blue-500" />
                    </div>
                    <label className="flex items-center px-4 py-2 bg-white dark:bg-[#13111d] border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a283a]">
                      <BsImage className="mr-2 text-[#6229b3] dark:text-[#c2a7fb]" />
                      <span className="text-sm text-gray-700 dark:text-purple-100">Change Image</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowEditProject(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* 2. Update Description Modal */}
      <AnimatePresence>
        {showUpdateDesc && (
          <ModalWrapper onClose={() => setShowUpdateDesc(false)}>
            <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Update Project Description</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setShowUpdateDesc(false)}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Project Description</label>
                  <textarea 
                    defaultValue={description}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowUpdateDesc(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* 3. Manage Links Modal */}
      <AnimatePresence>
        {showManageLinks && (
          <ModalWrapper onClose={() => setShowManageLinks(false)}>
            <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Manage Project Links</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setShowManageLinks(false)}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">Label</label>
                        <input 
                          type="text" 
                          defaultValue={link.label}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">Action</label>
                        <input 
                          type="text" 
                          defaultValue={link.action}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm"
                        />
                      </div>
                      <div className="col-span-3 mt-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">URL</label>
                        <input 
                          type="url" 
                          defaultValue={link.url}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm"
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="mt-2 text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button"
                  className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-[#c2a7fb]/30 rounded-md text-[#6229b3] dark:text-[#c2a7fb] hover:bg-gray-50 dark:hover:bg-[#2a283a]/50 flex items-center justify-center"
                >
                  + Add New Link
                </button>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowManageLinks(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* 4. Upload Version Modal */}
      <AnimatePresence>
        {showUploadVersion && (
          <ModalWrapper onClose={() => setShowUploadVersion(false)}>
            <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Upload New SRS Version</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setShowUploadVersion(false)}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-[#c2a7fb]/30 rounded-lg p-8 text-center">
                  <HiDocument className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#6229b3] dark:text-[#c2a7fb] hover:text-[#4c1f8e] dark:hover:text-[#8236ec]">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Version Notes (optional)</label>
                  <textarea 
                    placeholder="Describe what changed in this version..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowUploadVersion(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal wrapper component
const ModalWrapper = ({ children, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-[#13111d] rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto w-full max-w-md md:max-w-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
