import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaEllipsisV, FaPlus, FaFolder, FaCheckCircle, FaHourglassHalf, FaTimes, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';
import { UtilityHeader } from '../components/index.js';
import useUser from '../hooks/useUser.js';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import serverRequest from "../utils/axios.js"
import { Loader } from '../components/index.js';

// Empty state component for reuse
const EmptyState = ({ icon: Icon, title, message, actionText, onAction }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0c0a1a] border border-gray-200 dark:border-[#2a283a] rounded-lg my-8 text-center"
  >
    <Icon className="text-5xl mb-4 text-gray-400 dark:text-gray-600" />
    <h3 className="text-xl font-semibold text-gray-700 dark:text-purple-200/80 mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{message}</p>
    {actionText && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-[#6229b3] text-white rounded-lg flex items-center text-sm"
      >
        <FaPlus className="mr-2" /> {actionText}
      </button>
    )}
  </motion.div>
);

// Custom header for the DatePicker with year dropdown
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  changeYear,
}) => {
  // Generate array of years for the dropdown (current year + 10 years forward)
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year <= currentYear + 10; year++) {
    years.push(year);
  }

  return (
    <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-[#2a283a] mb-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center">
        <span className="text-gray-700 dark:text-white font-medium mr-2">
          {date.toLocaleString('default', { month: 'long' })}
        </span>

        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(parseInt(value))}
          className="bg-white dark:bg-[#13111d] text-gray-700 dark:text-white border border-gray-300 dark:border-[#2a283a] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#6229b3]"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Custom date picker input
const CustomDateInput = forwardRef(({ value, onClick, onChange, className, error }, ref) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
    </div>
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      onClick={onClick}
      className={`w-full px-4 py-3 pl-10 border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#2a283a]'} dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors cursor-pointer`}
      readOnly
    />
  </div>
));

// Project creation modal as subcomponent
const NewProjectModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with enhanced blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-xl p-6 border border-gray-100 dark:border-[#c2a7fb]/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-100">Create New Project</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">
                    Project Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters"
                      }
                    })}
                    className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#2a283a]'} dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors`}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-red-500 dark:text-red-400 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters"
                      }
                    })}
                    rows="4"
                    className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#2a283a]'} dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors`}
                    placeholder="Describe your project"
                  />
                  {errors.description && (
                    <p className="mt-1 text-red-500 dark:text-red-400 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="deadline" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">
                    Deadline*
                  </label>
                  <Controller
                    control={control}
                    name="deadline"
                    rules={{ required: "Deadline is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        customInput={<CustomDateInput error={errors.deadline} />}
                        renderCustomHeader={CustomHeader}
                        calendarClassName="!bg-white dark:!bg-[#13111d] border dark:border-[#2a283a] shadow-xl rounded-lg p-2"
                        wrapperClassName="w-full"
                        dayClassName={(date) =>
                          "hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-gray-900 dark:hover:text-white m-1 text-sm"
                        }
                        popperClassName="z-[105]"
                        popperProps={{
                          strategy: "fixed",
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, 8]
                              }
                            }
                          ]
                        }}
                        popperPlacement="top-start"
                        shouldCloseOnScroll={false}
                        weekDayClassName={() =>
                          "!text-[#6229b3] dark:!text-purple-300 !text-sm !font-medium"
                        }
                        monthClassName={() => "!mx-0 !mb-1"}
                        fixedHeight
                        showPopperArrow={false}
                      />
                    )}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-red-500 dark:text-red-400 text-sm">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className={`px-4 py-2 border border-gray-300 dark:border-[#2a283a] rounded-md transition-colors ${
                      loading
                        ? "bg-gray-200 dark:bg-[#232136] text-gray-400 cursor-not-allowed"
                        : "text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#13111d]"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      loading
                        ? "bg-[#a78bfa] text-white cursor-not-allowed"
                        : "bg-[#6229b3] text-white hover:bg-[#6229b3]/90"
                    }`}
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Confirm Delete Modal
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, projectTitle, loading }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-[#13111d] rounded-xl p-6 border border-gray-200 dark:border-[#2a283a] shadow-xl w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-purple-100">Delete Project</h3>
          <p className="mb-6 text-gray-700 dark:text-purple-200">
            Are you sure you want to delete <span className="font-semibold">{projectTitle}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 border border-gray-300 dark:border-[#2a283a] rounded-md transition-colors ${
                loading
                  ? "bg-gray-200 dark:bg-[#232136] text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-[#13111d]"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                loading
                  ? "bg-red-300 text-white cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <FaTrashAlt className="mr-2" /> Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Projects() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('All');
  const { user } = useUser();
  const { isServerReady, isSignedIn, isLoading } = useAuthStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Projects state instead of constant
  const [projects, setProjects] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  // This state manages the delete confirmation modal for projects.
  // - open: whether the modal is visible
  // - projectId: the _id of the project to delete
  // - projectTitle: the title of the project to show in the modal
  const [deleteModal, setDeleteModal] = useState({ open: false, projectId: null, projectTitle: "" });

  // Using useMemo for calculations to improve performance
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (activeTab === 'All') return true;
      // Use activeStatus boolean for filtering
      if (activeTab === 'Active') return project.activeStatus === true;
      if (activeTab === 'Completed') return project.activeStatus === false;
      return true;
    });
  }, [projects, activeTab]);

  // Memoized project statistics
  const { activeProjects, completedProjects, totalProjects } = useMemo(() => {
    return {
      activeProjects: projects.filter(project => project.activeStatus === true).length,
      completedProjects: projects.filter(project => project.activeStatus === false).length,
      totalProjects: projects.length
    };
  }, [projects]);

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleCreateProject = async (projectData) => {
    if (!userId && loading) return;
    setLoading(true);
    try {
      const response = await serverRequest.post(`/projects/create/${userId}`, projectData, { headers: { 'Content-Type': 'application/json' } });
      console.log('Project created:', response.data);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (projectId) => {
    setMenuOpenId(prev => (prev === projectId ? null : projectId));
  };

  const handleMenuClose = () => {
    setMenuOpenId(null);
  };

  const handleDeleteClick = (projectId, projectTitle) => {
    setDeleteModal({ open: true, projectId, projectTitle });
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      // API call to delete project
      await serverRequest.delete(`/projects/delete/${deleteModal.projectId}`);
      setProjects(prev => prev.filter(p => p._id !== deleteModal.projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
    setDeleteModal({ open: false, projectId: null, projectTitle: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, projectId: null, projectTitle: "" });
  };

  useEffect(() => {
    const getProjects = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await serverRequest.get(`/projects/search/${userId}`);
        console.log('Fetched projects:', response.data.data);
        setProjects(response?.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    if (!isLoading && isSignedIn && isServerReady && userId && userId === user?.data?._id) {
      getProjects();
    }

  }, [isLoading, isSignedIn, isServerReady, userId, user]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">loading...</div>
  }
  if (!isSignedIn && !isLoading) {
    console.log("Not Signed In");
    return <Navigate to={"/sign-in"} replace={true} />
  }
  if (!isServerReady && !isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Server Busy</div>
  }
  if (userId !== user?.data?._id) {
    return <Navigate to={"/unauthorized"} replace={true} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a1a] p-1 sm:px-6 sm:py-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <UtilityHeader backDisable={false} sticky={true} profile={true} />


        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 mt-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100">My Projects</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-purple-200/70 mt-2">Manage and track your development projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProject}
            className="px-3 sm:px-4 py-2 bg-[#6229b3] text-white rounded-lg flex items-center justify-center text-sm sm:text-base"
          >
            <span className="mr-2">+</span>
            New Project
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#0c0a1a] border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 sm:p-6 shadow-sm dark:shadow-none"
          >
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-purple-200/80 mb-2 sm:mb-4">Total Projects</h2>
            <p className="text-3xl sm:text-4xl font-bold text-blue-500 dark:text-blue-400">{totalProjects}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-[#0c0a1a] border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 sm:p-6 shadow-sm dark:shadow-none"
          >
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-purple-200/80 mb-2 sm:mb-4">Active Projects</h2>
            <p className="text-3xl sm:text-4xl font-bold text-[#6229b3] dark:text-[#c2a7fb]">{activeProjects}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-[#0c0a1a] border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 sm:p-6 shadow-sm dark:shadow-none"
          >
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-purple-200/80 mb-2 sm:mb-4">Completed Projects</h2>
            <p className="text-3xl sm:text-4xl font-bold text-green-500 dark:text-green-400">{completedProjects}</p>
          </motion.div>
        </div>

        {/* All Projects Section */}
        <div className="mb-6">
          {/* Add back the tab selector */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-purple-100">All Projects</h2>
            <div className="flex bg-gray-100 dark:bg-[#13111d] rounded-lg overflow-hidden self-start">
              {['All', 'Active', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ${
                    activeTab === tab
                      ? 'bg-[#6229b3] text-white'
                      : 'text-gray-600 dark:text-purple-200/70'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Loader for projects section */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader className={"text-3xl"} />
            </div>
          ) : (
            <>
              {/* Empty state handling */}
              {totalProjects === 0 && (
                <EmptyState
                  icon={FaFolder}
                  title="No Projects Yet"
                  message="You haven't created any projects yet. Start by creating your first project to track your development work."
                  actionText="Create First Project"
                  onAction={handleAddProject}
                />
              )}

              {totalProjects > 0 && filteredProjects.length === 0 && activeTab === 'Active' && (
                <EmptyState
                  icon={FaHourglassHalf}
                  title="No Active Projects"
                  message="You don't have any active projects at the moment. Start a new project or check your completed ones."
                  actionText="Create New Project"
                  onAction={handleAddProject}
                />
              )}

              {totalProjects > 0 && filteredProjects.length === 0 && activeTab === 'Completed' && (
                <EmptyState
                  icon={FaCheckCircle}
                  title="No Completed Projects"
                  message="You don't have any completed projects yet. Keep working on your active projects!"
                />
              )}

              {/* Projects Grid - Only show when we have projects to display */}
              {filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 sm:p-6 relative shadow-md dark:shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-purple-100">{project.title}</h3>
                        <div className="relative">
                          <button
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                            onClick={e => {
                              e.stopPropagation();
                              handleMenuOpen(project._id);
                            }}
                            disabled={loading}
                          >
                            <FaEllipsisV />
                          </button>
                          {menuOpenId === project._id && (
                            <div
                              className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a] rounded shadow-lg z-10"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                className={`w-full flex items-center px-4 py-2 text-sm rounded ${
                                  loading
                                    ? "bg-gray-200 dark:bg-[#232136] text-gray-400 cursor-not-allowed"
                                    : "text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#2a283a]"
                                }`}
                                onClick={() => {
                                  handleDeleteClick(project._id, project.title);
                                  handleMenuClose(); // Use handleMenuClose here
                                }}
                                disabled={loading}
                              >
                                <FaTrashAlt className="mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mb-3 sm:mb-4">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                            project.activeStatus
                              ? 'bg-purple-100 text-[#6229b3] dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {project.activeStatus ? 'Active' : 'Completed'}
                        </span>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-3">
                          <FaClock className="mr-1" />
                          <span>
                            {project.deadline
                              ? new Date(project.deadline).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-purple-200/70 mb-4 sm:mb-6">
                        {project.description}
                      </p>

                      <button className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-[#2a283a] text-xs sm:text-sm font-medium text-gray-700 dark:text-purple-200/80 hover:bg-gray-50 dark:hover:bg-[#13111d] rounded-md transition-colors" onClick={()=>{navigate(`/workspace/${project._id}`)}}>
                        Visit Workspace
                      </button>
                    </motion.div>
                  ))}
                  {/* Confirm Delete Modal */}
                  <ConfirmDeleteModal
                    isOpen={deleteModal.open}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    projectTitle={deleteModal.projectTitle}
                    loading={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Project Creation Modal - now using the internal component */}
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateProject}
          loading={loading}
        />
      </div>
    </div>
  );
}
