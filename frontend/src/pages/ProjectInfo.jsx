import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiEdit, FiUpload, FiUser, FiSettings, FiX } from 'react-icons/fi';
import { HiDocument, HiDocumentText, HiCalendar } from 'react-icons/hi';
import { BsCheckCircleFill, BsLink, BsGlobe, BsImage } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from '../store/project.js';
import DatePickerField from '../components/DatePickerField.jsx'; // added
import { useForm, useFieldArray } from 'react-hook-form'; // extended import

export default function ProjectInfo() {
  // State for popup modals
  const [showEditProject, setShowEditProject] = useState(false);
  const [showUpdateDesc, setShowUpdateDesc] = useState(false);
  const [showManageLinks, setShowManageLinks] = useState(false);
  const [showUploadVersion, setShowUploadVersion] = useState(false);
  const { info, owner, isOwner } = useProject();
  // refs for image preview without state
  const headerImgRef = useRef(null);
  const modalImgRef = useRef(null);
  const headerIconRef = useRef(null);
  const modalIconRef = useRef(null);
  const previewUrlRef = useRef("");

  const handleProjectImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // revoke previous
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;

    [headerImgRef.current, modalImgRef.current].forEach(img => {
      if (!img) return;
      img.src = url;
      img.classList.remove('hidden');
      img.classList.add('object-cover', 'w-full', 'h-full', 'rounded-lg');
    });

    [headerIconRef.current, modalIconRef.current].forEach(icon => {
      if (!icon) return;
      icon.classList.add('hidden');
    });

    // IMPORTANT: not updating any state or store (as requested)
    // If later you want to upload, do it here and then call editInfo with final URL.
  };

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
  // backend returns only the direct SRS link (no meta like size/updated) so we avoid constructing extra meta

  // links local state for display
  const [linksState, setLinksState] = useState(() => {
    const base = Array.isArray(info.links) ? info.links : [];
    return base.map(l => ({
      key: l.key || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      label: (l.label || "").trim(),
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

  // placeholder submit handlers (log + close)
  const handleEditProject = (data) => { console.log('EditProject submit:', data); setShowEditProject(false); };
  const handleUpdateDescription = (data) => { console.log('Description submit:', data); setShowUpdateDesc(false); };
  const handleManageLinks = (data) => { console.log('Links submit:', data); setShowManageLinks(false); };
  const handleUploadSrs = (formData) => {
    const file = formData.get('srs');
    console.log('SRS submit file:', file?.name, 'size:', file?.size);
    setShowUploadVersion(false);
  };

  // ========== RENDER ==========
  return (
    <div className="sm:p-6">
      {/* Header */}
      {/* replaced hardcoded project + conditional edit button */}
      <div className="rounded-xl bg-gradient-to-b from-gray-900 to-[#4c1f8e] dark:from-[#0c0a1a] dark:to-[#4c1f8e]/40 p-5 sm:p-4 flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 shadow-lg shadow-black/30">
        {/* ...existing code... */}
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
            onClick={() => setShowEditProject(true)}   // removed resetEdit/deadline logic
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
          {/* ...existing code heading... */}
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
          {/* ...existing code heading... */}
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
          {/* ...existing heading... */}
          <div className="font-medium text-gray-800 dark:text-purple-100 flex items-center gap-2 mb-4 text-lg sm:text-base">
            <BsLink className="w-6 h-6 sm:w-5 sm:h-5 text-[#6229b3] dark:text-[#c2a7fb]" />
            Project Links
          </div>
          {/* Links list display (read-only outside modal) */}
          <div className="mb-5 sm:mb-6 space-y-3">
            {linksState.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-purple-300">No links added yet.</div>
            )}
            {linksState.map(link => {
              const shown = displayUrl(link.url, 30); // tweak max length as needed
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
          {/* ...existing heading... */}
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
            <div className="flex gap-2 mt-2 sm:mt-0">
              {srsUrl && (
                <a
                  href={srsUrl}
                  download
                  className="px-4 py-1.5 bg-[#e1eaff] dark:bg-[#6229b3]/30 rounded-md text-[#3b5bdb] dark:text-purple-200 hover:bg-[#d0deff] dark:hover:bg-[#6229b3]/40 text-base sm:text-sm font-medium"
                >
                  Download
                </a>
              )}

              {srsUrl && (
                <button className="px-4 py-1.5 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#c2a7fb]/20 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a283a] text-gray-700 dark:text-purple-100 text-base sm:text-sm">
                  View
                </button>
              )}
            </div>
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
      {/* 1. Edit Project Modal */}
      {isOwner && (
        <AnimatePresence>
          {showEditProject && (
            <ModalWrapper onClose={() => setShowEditProject(false)}>
              <EditProjectModalContent
                info={info}
                onClose={() => setShowEditProject(false)}
                onSubmit={handleEditProject}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>
      )}
      {isOwner && (
        <AnimatePresence>
          {showUpdateDesc && (
            <ModalWrapper onClose={() => setShowUpdateDesc(false)}>
              <UpdateDescriptionModalContent
                description={description}
                onClose={() => setShowUpdateDesc(false)}
                onSubmit={handleUpdateDescription}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>
      )}
      {isOwner && (
        <AnimatePresence>
          {showManageLinks && (
            <ModalWrapper onClose={() => setShowManageLinks(false)}>
              <ManageLinksModalContent
                initialLinks={linksState}
                onClose={() => setShowManageLinks(false)}
                onSubmit={handleManageLinks}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>
      )}
      {isOwner && (
        <AnimatePresence>
          {showUploadVersion && (
            <ModalWrapper onClose={() => setShowUploadVersion(false)}>
              <UploadSRSModalContent
                onClose={() => setShowUploadVersion(false)}
                onSubmit={handleUploadSrs}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

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

// ================= Subcomponents =================

const EditProjectModalContent = ({ info, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: 'onChange',
    defaultValues: { title: info.title || '', deadline: info.deadline || '' }
  });
  const [deadlineValue, setDeadlineValue] = useState(info.deadline ? new Date(info.deadline) : null);
  useEffect(() => { setValue('deadline', deadlineValue ? deadlineValue.toISOString() : ''); }, [deadlineValue, setValue]);
  const modalImgRef = useRef(null);
  const modalIconRef = useRef(null);
  const previewUrlRef = useRef("");
  const imageFileRef = useRef(null);

  const handleImgChange = (e) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    imageFileRef.current = file;
    console.log('Selected project image:', file.name, 'size:', file.size, 'type:', file.type);
    const url = URL.createObjectURL(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;
    if (modalImgRef.current) {
      modalImgRef.current.src = url;
      modalImgRef.current.classList.remove('hidden');
    }
    if (modalIconRef.current) modalIconRef.current.classList.add('hidden');
  };

  useEffect(() => () => { if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); }, []);

  const innerSubmit = (data) => {
    // attach file (may be null) + log
    if (imageFileRef.current) {
      data.imageFile = imageFileRef.current;
      console.log('Submitting with image file:', imageFileRef.current.name);
    } else {
      console.log('Submitting without new image file');
    }
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit(innerSubmit)} className="space-y-4" noValidate>
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Edit Project</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      {/* title */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Title</label>
        <input
          type="text"
          {...register('title', {
            setValueAs: v => (typeof v === 'string' ? v.trim() : v)
          })}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-[#c2a7fb]/30'}`}
        />
      </div>
      {/* deadline */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Expected Deadline</label>
        <DatePickerField value={deadlineValue} onChange={d => setDeadlineValue(d)} popperPlacement="bottom-start" />
        <input type="hidden" {...register('deadline')} />
      </div>
      {/* image */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Image</label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            {/* Always render img but never with empty string src */}
            <img
              ref={modalImgRef}
              src={info?.image?.url || null} 
              alt="project"
              className={`object-cover w-full h-full ${info?.image?.url ? '' : 'hidden'}`}
            />
            <BsCheckCircleFill
              ref={modalIconRef}
              className={`h-8 w-8 text-blue-500 ${info?.image?.url ? 'hidden' : ''}`}
            />
          </div>
          <label className="flex items-center px-4 py-2 bg-white dark:bg-[#13111d] border border-gray-300 dark:border-[#c2a7fb]/30 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a283a]">
            <BsImage className="mr-2 text-[#6229b3] dark:text-[#c2a7fb]" />
            <span className="text-sm text-gray-700 dark:text-purple-100">Change Image</span>
            <input type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6229b3] hover:bg-[#4c1f8e] text-white rounded-md"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

const UpdateDescriptionModalContent = ({ description, onClose, onSubmit }) => {
  const { register, handleSubmit } = useForm({ defaultValues: { description } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Update Project Description</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-purple-200">Project Description</label>
        <textarea
          rows={6}
          {...register('description', { setValueAs: v => (typeof v === 'string' ? v.trim() : v) })}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 border-gray-300 dark:border-[#c2a7fb]/30"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

const ManageLinksModalContent = ({ initialLinks, onClose, onSubmit }) => {
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      links: initialLinks.length
        ? initialLinks
        : [{ key: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, label: '', url: '' }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'links' });
  const normalize = v => {
    if (typeof v !== 'string') return '';
    let val = v.trim();
    if (val && !/^https?:\/\//i.test(val)) val = 'https://' + val;
    return val;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Manage Project Links</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 dark:border-[#c2a7fb]/20 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">Label</label>
              <input
                type="text"
                {...register(`links.${index}.label`, {
                  setValueAs: v => (typeof v === 'string' ? v.trim() : v)
                })}
                defaultValue={field.label}
                className="w-full px-2 py-1 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm border-gray-300 dark:border-[#c2a7fb]/30"
              />
            </div>
            <div className="col-span-3 mt-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-purple-200 mb-1">URL</label>
              <input
                type="url"
                {...register(`links.${index}.url`, {
                  setValueAs: normalize
                })}
                defaultValue={field.url}
                className="w-full px-2 py-1 border rounded-md bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 text-sm border-gray-300 dark:border-[#c2a7fb]/30"
              />
            </div>
          </div>
          <button type="button" onClick={() => remove(index)} className="mt-2 text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300">
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ key: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, label: '', url: '' })}
        className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-[#c2a7fb]/30 rounded-md text-[#6229b3] dark:text-[#c2a7fb] hover:bg-gray-50 dark:hover:bg-[#2a283a]/50 flex items-center justify-center"
      >
        + Add New Link
      </button>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
        >
          Save Links
        </button>
      </div>
    </form>
  );
};

const UploadSRSModalContent = ({ onClose, onSubmit }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: 'onChange' });
  const selectedFile = watch('file');
  const handleLocalSubmit = (data) => {
    if (!data.file?.[0]) return;
    const file = data.file[0];
    const formData = new FormData();
    formData.append('srs', file);
    console.log('Prepared FormData for SRS upload:', file.name);
    onSubmit(formData);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-4" noValidate>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100">Upload New SRS Version</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <div className={`border-2 border-dashed rounded-lg p-8 text-center ${errors.file ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-[#c2a7fb]/30'}`}>
        <HiDocument className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <div className="mt-4 flex justify-center text-sm text-gray-600 dark:text-gray-400">
          <label htmlFor="file-upload-srs" className="relative cursor-pointer rounded-md font-medium text-[#6229b3] dark:text-[#c2a7fb] hover:text-[#4c1f8e] dark:hover:text-[#8236ec]">
            <span>Select PDF</span>
            <input
              id="file-upload-srs"
              type="file"
              accept="application/pdf"
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
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => { reset(); onClose(); }}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3]"
        >
          Upload
        </button>
      </div>
    </form>
  );
};