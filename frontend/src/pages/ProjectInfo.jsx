import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiUpload, FiUser, FiSettings, FiX } from 'react-icons/fi';
import { HiDocument, HiDocumentText, HiCalendar } from 'react-icons/hi';
import { BsCheckCircleFill, BsLink, BsGlobe, BsImage } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from '../store/project.js';
import DatePickerField from '../components/DatePickerField.jsx';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSocketOn, useSocketEmit } from '../hooks/useSocket.js';
import serverRequest from '../utils/axios.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

export default function ProjectInfo() {
  // Modal visibility states
  const [showEditProject, setShowEditProject] = useState(false);
  const [showUpdateDesc, setShowUpdateDesc] = useState(false);
  const [showManageLinks, setShowManageLinks] = useState(false);
  const [showUploadVersion, setShowUploadVersion] = useState(false);

  // Loading states for each action
  const [editProjectLoading, setEditProjectLoading] = useState(false);
  const [updateDescLoading, setUpdateDescLoading] = useState(false);
  const [manageLinksLoading, setManageLinksLoading] = useState(false);
  const [uploadSrsLoading, setUploadSrsLoading] = useState(false);

  const { info, owner, isOwner, setInfo, roomID } = useProject();
  const { projectId } = useParams();
  const headerImgRef = useRef(null);
  const headerIconRef = useRef(null);
  const previewUrlRef = useRef("");

  // Clean up any preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Derived / fallback values
  const projectName = info.title || "Untitled Project";
  const description = info.description || "No description provided yet.";
  const deadline = info.deadline ? new Date(info.deadline).toLocaleDateString() : "No deadline";
  const createdDate = info.createdAt ? new Date(info.createdAt).toLocaleDateString() : "N/A";
  const srsUrl = info?.srs?.url || "";
  const srsFileName = srsUrl ? decodeURIComponent(srsUrl.split('/').pop()) : "No SRS uploaded";

  // links local state for display - transform server's "name" field to our UI's "label" field
  const [linksState, setLinksState] = useState(() => {
    const base = Array.isArray(info.links) ? info.links : [];
    return base.map(l => ({
      key: l._id || l.key || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      label: (l.name || l.label || "").trim(), 
      url: (l.url || "").trim(),
    }));
  });

  const displayUrl = (u, max = 30) => {
    if (!u) return "";
    try {
      const parsed = new URL(u);
      const base = `${parsed.protocol}//${parsed.hostname}`;
      const rest = parsed.pathname + parsed.search + parsed.hash;
      const full = base + (rest === '/' ? '' : rest);
      if (full.length <= max) return full;
      if (base.length >= max - 3) return base.slice(0, max - 3) + '...';
      return base + '...';
    } catch {
      return u.length <= max ? u : u.slice(0, max - 3) + '...';
    }
  };

  // ========== socket emit function ===========
  const socketEmit = useSocketEmit();

  // Submit handlers
  const handleEditProject = async (formData) => {
    try {
      setEditProjectLoading(true);
      await serverRequest.post(`/projects/update-details/${projectId}`, formData);
    } catch (error) {
      console.error("Error updating project details:", error);
    } finally {
      setEditProjectLoading(false);
      setShowEditProject(false);
    }
  };

  const handleUpdateDescription = (data) => {
    try {
      setUpdateDescLoading(true);
      socketEmit("update-project-description", { roomID, projectId, description: data.description });
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      setUpdateDescLoading(false);
      setShowUpdateDesc(false);
    }
  };
  
  const handleManageLinks = async (data) => {
    try {
      setManageLinksLoading(true);
      socketEmit("update-project-links", { roomID, projectId, links: data.links });
    } catch (error) {
      console.error("Error updating links:", error);
    } finally {
      setManageLinksLoading(false);
      setShowManageLinks(false);
    }
  };
  
  const handleUploadSrs = async (formData) => {
    try {
      setUploadSrsLoading(true);
      await serverRequest.post(`/projects/upload-srs/${projectId}`, formData);
    } catch (error) {
      console.error("Error uploading SRS:", error);
    } finally {
      setUploadSrsLoading(false);
      setShowUploadVersion(false);
    }
  };

  // ========== SOCKETS ==========
  useSocketOn("project-details-update", (updatedInfo) => {
    setInfo(updatedInfo);
  });
  useSocketOn("project-links-update", (updatedLinks) => {
    setInfo(updatedLinks);
  });
  useSocketOn("project-srs-update", (updatedSrs) => {
    setInfo(updatedSrs);
  });
  useSocketOn("project-description-update", (updatedDesc) => {
    setInfo(updatedDesc);
  });

  // ========== RENDER ==========
  return (
    <div className="sm:p-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-b from-gray-900 to-[#4c1f8e] dark:from-[#0c0a1a] dark:to-[#4c1f8e]/40 p-5 sm:p-4 flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 shadow-lg shadow-black/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
          {/* project image */}
          <div className="bg-[#f0f4ff] rounded-xl h-[100px] w-[100px] flex items-center justify-center max-sm:w-[70px] max-sm:h-[70px] relative overflow-hidden">
            {info?.image?.url && (
              <img
                ref={headerImgRef}
                src={info.image.url}
                alt="project"
                className="object-cover w-full h-full rounded-lg"
              />
            )}
            {!info?.image?.url && (
              <BsCheckCircleFill
                ref={headerIconRef}
                className="w-14 h-14 max-sm:w-8 max-sm:h-8 text-[#4068fc]"
              />
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{projectName}</h1>
            <div className="text-base sm:text-sm text-white/80 mt-1">Expected Deadline: {deadline}</div>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
              <span className="bg-[#1a3d29] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                <span className={`w-2 h-2 ${info.activeStatus ? 'bg-green-400' : 'bg-gray-400'} rounded-full inline-block`}></span>
                {info.activeStatus ? 'Active' : 'Inactive'}
              </span>
              <span className="text-white/70 text-sm flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4" />
                Created {createdDate}
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <button
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg flex md:min-w-[135px] items-center gap-2 text-base sm:text-sm"
            onClick={() => setShowEditProject(true)}
          >
            <FiEdit className="w-5 h-5 sm:w-4 sm:h-4" />
            Edit Project
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
        {/* Description */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1 grow-2 flex flex-col justify-between shadow-md dark:shadow-black/40">
          <div>
            <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
              <HiDocumentText className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
              Project Description
            </div>
            <div className="text-gray-700 dark:text-purple-200/80 text-base mb-4 whitespace-pre-line italic">
              {description}
            </div>
          </div>
          {isOwner && (
            <button
              className="px-4 py-2 font-semibold  sm:max-w-[200px] bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex justify-center items-center gap-2 text-base sm:text-sm"
              onClick={() => setShowUpdateDesc(true)}
            >
              <FiEdit className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
              Update Description
            </button>
          )}
        </div>

        {/* Owner Card */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex flex-col items-center flex-1 shadow-md dark:shadow-black/40">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 self-start mb-6 text-lg sm:text-base">
            <FiUser className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Owner
          </div>
          {owner?.avatar
            ? <img src={owner.avatar} alt={owner.username} className="rounded-full w-20 h-20 object-cover mb-3" />
            : <div className="bg-[#6229b3] rounded-full w-20 h-20 flex items-center justify-center text-white mb-3">
              <FiUser className="w-9 h-9 sm:w-8 sm:h-8" />
            </div>}
          <div className="font-bold text-gray-800 dark:text-purple-100 text-xl sm:text-lg mt-2">{owner?.username || "Unknown"}</div>
          <div className="text-sm text-gray-500 dark:text-purple-200/50 mt-0.5">ID: {owner?.userId || "—"}</div>
          <button className="px-4 py-2 mt-4 bg-white font-semibold dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 text-base sm:text-sm">
            View Profile
          </button>
        </div>
      </div>

      {/* Links & SRS */}
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6 mt-5 sm:mt-6 mb-4">
        {/* Links */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1 shadow-md dark:shadow-black/40">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <BsLink className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Links
          </div>
          <div className="mb-5 sm:mb-6 space-y-3">
            {linksState.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-purple-300">No links added yet.</div>
            )}
            {linksState.map(link => {
              const shown = displayUrl(link.url, 30);
              const truncated = shown !== link.url;
              return (
                <div key={link.key} className="flex flex-wrap sm:flex-nowrap items-center justify-between py-2 gap-2">
                  <div className="flex items-center gap-3">
                    <BsGlobe className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb] flex-shrink-0" />
                    <div className="min-w-0 overflow-hidden">
                      <div
                        className="text-base sm:text-sm font-medium text-gray-800 dark:text-purple-100 truncate"
                        title={link.label || "Link"}
                      >
                        {link.label || "Link"}
                      </div>
                      <div
                        className="text-sm sm:text-xs text-gray-500 dark:text-purple-200/70"
                        title={link.url}
                      >
                        {shown}
                        {truncated && ""}
                      </div>
                    </div>
                  </div>
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-[#e1eaff] dark:bg-[#6229b3]/30 rounded-md text-[#3b5bdb] dark:text-purple-200 hover:bg-[#d0deff] dark:hover:bg-[#6229b3]/40 text-base sm:text-sm font-medium"
                    >
                      View
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {isOwner && (
            <button
              className="px-4 py-2 font-semibold bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex items-center gap-2 text-base sm:text-sm"
              onClick={() => setShowManageLinks(true)}
            >
              <FiSettings className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
              Manage Links
            </button>
          )}
        </div>

        {/* SRS */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-4 flex-1 shadow-md dark:shadow-black/40">
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <HiDocument className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            SRS Document
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-100 dark:border-[#c2a7fb]/20 rounded-lg bg-gray-50 dark:bg-[#13111d] p-4 mb-4">
            <HiDocument className="w-12 h-12 sm:w-10 sm:h-10 text-[#6229b3] dark:text-[#c2a7fb]" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-base sm:text-sm text-gray-800 dark:text-purple-100 truncate">
                {srsUrl ? srsFileName : 'No SRS uploaded'}
              </div>
              <div className="text-sm text-gray-500 dark:text-purple-200/70 mt-0.5 truncate">
                {srsUrl ? 'Available' : '—'}
              </div>
            </div>
            {srsUrl && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="px-4 py-1.5 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 text-base sm:text-sm">
                  <a href={srsUrl} target="_blank" rel="noopener noreferrer">View</a>
                </button>
              </div>
            )}
          </div>
          {isOwner && (
            <button
              className="w-full px-4 font-semibold py-2 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 flex items-center justify-center gap-2 text-base sm:text-sm"
              onClick={() => setShowUploadVersion(true)}
            >
              <FiUpload className="w-5 h-5 sm:w-4 sm:h-4 text-[#6229b3] dark:text-[#c2a7fb]" />
              Upload New Version
            </button>
          )}
        </div>
      </div>

      {/* Extra padding div for mobile */}
      <div className="h-16 md:hidden"></div>

      {/* Popup Modals */}
      {isOwner && (
        <>
          <AnimatePresence>
            {showEditProject && (
              <ModalWrapper onClose={() => !editProjectLoading && setShowEditProject(false)}>
                <EditProjectModalContent
                  info={info}
                  onClose={() => !editProjectLoading && setShowEditProject(false)}
                  onSubmit={handleEditProject}
                  loading={editProjectLoading}
                />
              </ModalWrapper>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showUpdateDesc && (
              <ModalWrapper onClose={() => !updateDescLoading && setShowUpdateDesc(false)}>
                <UpdateDescriptionModalContent
                  description={description}
                  onClose={() => !updateDescLoading && setShowUpdateDesc(false)}
                  onSubmit={handleUpdateDescription}
                  loading={updateDescLoading}
                />
              </ModalWrapper>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showManageLinks && (
              <ModalWrapper onClose={() => !manageLinksLoading && setShowManageLinks(false)}>
                <ManageLinksModalContent
                  initialLinks={linksState}
                  onClose={() => !manageLinksLoading && setShowManageLinks(false)}
                  onSubmit={handleManageLinks}
                  loading={manageLinksLoading}
                />
              </ModalWrapper>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showUploadVersion && (
              <ModalWrapper onClose={() => !uploadSrsLoading && setShowUploadVersion(false)}>
                <UploadSRSModalContent
                  onClose={() => !uploadSrsLoading && setShowUploadVersion(false)}
                  onSubmit={handleUploadSrs}
                  loading={uploadSrsLoading}
                />
              </ModalWrapper>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ---- Reusable components ----

// Modal structure components
const ModalWrapper = ({ children, onClose }) => (
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
      <div className="p-6">{children}</div>
    </motion.div>
  </motion.div>
);

// Reusable modal components
const ModalHeader = ({ title, onClose, loading }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">{title}</h2>
    <button
      type="button"
      onClick={onClose}
      disabled={loading}
      className={`text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <FiX className="w-6 h-6" />
    </button>
  </div>
);

const ModalFooter = ({ onClose, loading, submitText }) => (
  <div className="flex justify-end gap-3 pt-2">
    <button
      type="button"
      onClick={onClose}
      disabled={loading}
      className={`px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Close
    </button>
    <button
      type="submit"
      disabled={loading}
      className={`px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3] flex items-center justify-center gap-2 ${loading ? 'opacity-75' : ''}`}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4" />
          <span>Processing...</span>
        </>
      ) : (
        submitText
      )}
    </button>
  </div>
);

// Modal content components
const EditProjectModalContent = ({ info, onClose, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: 'onChange',
    defaultValues: { title: info.title || '', deadline: info.deadline || '' }
  });
  const [deadlineValue, setDeadlineValue] = useState(info.deadline ? new Date(info.deadline) : null);
  const { roomID } = useProject();
  const modalImgRef = useRef(null);
  const modalIconRef = useRef(null);
  const previewUrlRef = useRef("");
  const imageFileRef = useRef(null);

  useEffect(() => {
    setValue('deadline', deadlineValue ? deadlineValue.toISOString() : '');
  }, [deadlineValue, setValue]);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const handleImgChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    imageFileRef.current = file;
    const url = URL.createObjectURL(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;
    if (modalImgRef.current) {
      modalImgRef.current.src = url;
      modalImgRef.current.classList.remove('hidden');
    }
    if (modalIconRef.current) modalIconRef.current.classList.add('hidden');
  };

  const innerSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("deadline", data.deadline);
    formData.append("roomID", roomID);
    if (imageFileRef.current) {
      formData.append("imageFile", imageFileRef.current);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(innerSubmit)} className="space-y-4" noValidate>
      {loading && <div className="flex justify-center mb-4"><Loader className="w-8 h-8" /></div>}

      <ModalHeader title="Edit Project" onClose={onClose} loading={loading} />

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Title</label>
        <input
          type="text"
          disabled={loading}
          {...register('title', {
            setValueAs: v => (typeof v === 'string' ? v.trim() : v),
            minLength: { value: 3, message: 'Title must be at least 3 characters' },
            maxLength: { value: 40, message: 'Title must be at most 40 characters' },
          })}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 ${errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#c2a7fb]/30'
            } ${loading ? 'opacity-60' : ''}`}
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Expected Deadline</label>
        <DatePickerField
          value={deadlineValue}
          onChange={d => setDeadlineValue(d)}
          popperPlacement="bottom-start"
          disabled={loading}
        />
        <input type="hidden" {...register('deadline')} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Image</label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            <img
              ref={modalImgRef}
              src={info?.image?.url || undefined}
              alt="project"
              className={`object-cover w-full h-full ${info?.image?.url ? '' : 'hidden'}`}
            />
            <BsCheckCircleFill
              ref={modalIconRef}
              className={`h-8 w-8 text-blue-500 ${info?.image?.url ? 'hidden' : ''}`}
            />
          </div>
          <label className={`flex items-center px-4 py-2 bg-white dark:bg-[#13111d] border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a283a] ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <BsImage className="mr-2 text-[#6229b3] dark:text-[#c2a7fb]" />
            <span className="text-sm text-gray-700 dark:text-purple-100">Change Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImgChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      </div>

      <ModalFooter onClose={onClose} loading={loading} submitText="Apply" />
    </form>
  );
};

const UpdateDescriptionModalContent = ({ description, onClose, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { description } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {loading && <div className="flex justify-center mb-4"><Loader className="w-8 h-8" /></div>}

      <ModalHeader title="Update Project Description" onClose={onClose} loading={loading} />

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Description</label>
        <textarea
          rows={6}
          disabled={loading}
          {...register('description', {
            setValueAs: v => (typeof v === 'string' ? v.trim() : v),
            required: { value: true, message: 'Description is required' },
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: 300, message: 'Description must be at most 300 characters' }
          })}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 ${errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#c2a7fb]/30'
            } ${loading ? 'opacity-60' : ''}`}
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>}
      </div>

      <ModalFooter onClose={onClose} loading={loading} submitText="Apply" />
    </form>
  );
};

const ManageLinksModalContent = ({ initialLinks, onClose, onSubmit, loading }) => {
  const { control, handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      links: initialLinks.length
        ? initialLinks
        : [{ key: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, label: '', url: '' }]
    },
    mode: 'onChange'
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'links' });

  const normalize = v => {
    if (typeof v !== 'string') return '';
    let val = v.trim();
    if (val && !/^https?:\/\//i.test(val)) val = 'https://' + val;
    return val;
  };

  const handleFormSubmit = (data) => {
    // Transform from {key, label, url} to {name, url}
    const transformedLinks = data.links
      .map(link => ({
        name: link.label, // Convert label to name for server format
        url: link.url
      }));

    onSubmit({ links: transformedLinks });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {loading && <div className="flex justify-center mb-4"><Loader className="w-8 h-8" /></div>}

      <ModalHeader title="Manage Project Links" onClose={onClose} loading={loading} />

      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={loading}
                {...register(`links.${index}.label`, {
                  required: 'Label is required',
                  setValueAs: v => (typeof v === 'string' ? v.trim() : v)
                })}
                defaultValue={field.label}
                className={`w-full px-2 py-1 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm ${errors?.links?.[index]?.label ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#c2a7fb]/30'
                  } ${loading ? 'opacity-60' : ''}`}
              />
              {errors?.links?.[index]?.label && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.links[index].label.message}
                </p>
              )}
            </div>
            <div className="col-span-3 mt-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                disabled={loading}
                {...register(`links.${index}.url`, {
                  required: 'URL is required',
                  setValueAs: normalize
                })}
                defaultValue={field.url}
                className={`w-full px-2 py-1 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm ${errors?.links?.[index]?.url ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#c2a7fb]/30'
                  } ${loading ? 'opacity-60' : ''}`}
              />
              {errors?.links?.[index]?.url && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.links[index].url.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={loading || fields.length === 1}
            className={`mt-2 text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 ${(loading || fields.length === 1) ? 'opacity-60 pointer-events-none' : ''
              }`}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ key: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, label: '', url: '' })}
        disabled={loading}
        className={`w-full px-3 py-2 border border-dashed border-gray-300 dark:border-[#c2a7fb]/30 rounded-md text-[#6229b3] dark:text-[#c2a7fb] hover:bg-gray-50 dark:hover:bg-[#2a283a]/50 flex items-center justify-center ${loading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        + Add New Link
      </button>

      <ModalFooter onClose={onClose} loading={loading} submitText="Save Links" />
    </form>
  );
};

const UploadSRSModalContent = ({ onClose, onSubmit, loading }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: 'onChange' });
  const selectedFile = watch('file');
  const { roomID } = useProject();
  const handleLocalSubmit = (data) => {
    if (!data.file?.[0]) return;
    const file = data.file[0];
    const formData = new FormData();
    formData.append('srs', file);
    formData.append('roomID', roomID);
    onSubmit(formData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-4" noValidate>
      {loading && <div className="flex justify-center mb-4"><Loader className="w-8 h-8" /></div>}

      <ModalHeader title="Upload New SRS Version" onClose={onClose} loading={loading} />

      <div className={`border-2 border-dashed rounded-lg p-8 text-center ${errors.file ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-[#c2a7fb]/30'} ${loading ? 'opacity-60' : ''}`}>
        <HiDocument className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <div className="mt-4 flex justify-center text-sm text-gray-600 dark:text-gray-400">
          <label htmlFor="file-upload-srs" className={`relative cursor-pointer rounded-md font-medium text-[#6229b3] dark:text-[#c2a7fb] hover:text-[#4c1f8e] dark:hover:text-[#8236ec] ${loading ? 'pointer-events-none' : ''}`}>
            <span>Select PDF</span>
            <input
              id="file-upload-srs"
              type="file"
              accept="application/pdf"
              disabled={loading}
              {...register('file', {
                required: 'PDF required',
                validate: {
                  isPdf: v => (v && v[0] && v[0].type === 'application/pdf') || 'Only PDF allowed',
                  size: v => (v && v[0] && v[0].size <= 1024 * 1024) || 'Max 1MB'
                }
              })}
              className="sr-only"
            />
          </label>
        </div>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">PDF up to 1MB</p>
        {selectedFile?.[0] && (
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-300">
            {selectedFile[0].name} ({(selectedFile[0].size / 1024).toFixed(1)} KB)
          </div>
        )}
        {errors.file && <p className="mt-2 text-xs text-red-500">{errors.file.message}</p>}
      </div>

      <ModalFooter
        onClose={() => { reset(); onClose(); }}
        loading={loading}
        submitText="Upload"
      />
    </form>
  );
};