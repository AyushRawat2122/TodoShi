import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTasks, FaComments, FaUsers, FaChartLine, FaPalette, FaVideo, FaDesktop, FaCalendarAlt } from 'react-icons/fa';
import { PointerHighlight } from '../components/PointerHighLight';

const About = () => {
  const teamMembers = [
    {
      name: "Ayush Rawat",
      title: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/41.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a1a]">
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-purple-100 mb-4 leading-tight">
              About Todoshi: <br /> 
              <span className="text-[#6229b3] dark:text-[#c2a7fb]">
                <PointerHighlight rectangleClassName="border-[#4c1f8e]/30 dark:border-[#c2a7fb]/30">
                  Your Real-time Collaboration Hub
                </PointerHighlight>
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-purple-200/80 mb-6 leading-relaxed">
              Todoshi is a powerful real-time team collaboration platform designed to streamline project management workflows that foster discussion and enable file sharing. We focus on managing daily work goals, project documents, and ensuring clear progress visibility, all without the complexity of technical jargon.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/sign-up"
                className="px-6 py-3 bg-[#4c1f8e] dark:bg-[#6229b3]/40 text-white rounded-md hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link 
                to="/contact"
                className="px-6 py-3 bg-white dark:bg-[#0c0a1a]/50 text-[#4c1f8e] dark:text-purple-200 border border-[#4c1f8e] dark:border-[#c2a7fb]/20 rounded-md hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gray-100 dark:bg-[#0c0a1a]/30 dark:border dark:border-[#c2a7fb]/10 rounded-lg h-[300px] flex items-center justify-center"
          >
            <div className="text-gray-400 dark:text-purple-300/60 text-2xl">Platform Preview</div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-[#0c0a1a]/80 dark:to-[#0c0a1a]/60 rounded-2xl overflow-hidden shadow-xl border border-purple-100 dark:border-[#c2a7fb]/20"
          >
            <div className="bg-gradient-to-r from-purple-100 to-transparent dark:from-[#c2a7fb]/10 dark:to-transparent py-10 px-6 border-b border-purple-100 dark:border-[#c2a7fb]/20">
              <h2 className="text-3xl font-bold text-center mb-2 dark:text-purple-100">
                Key <span className="text-[#6229b3] dark:text-[#c2a7fb]">Features</span> We Offer
              </h2>
              <p className="text-center text-gray-600 dark:text-purple-200/80 max-w-3xl mx-auto">Designed to streamline your workflow and enhance productivity</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                  <FaTasks className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Comprehensive Task Management</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Create and assign daily TODOs, mark tasks as completed, and receive notifications for important deadlines.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                  <FaComments className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Real-time Group Chat & Media Sharing</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Communicate instantly with your team via real-time group chat and easily share images, documents, and other media files.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                  <FaUsers className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Collaborator & Project Management</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Add collaborators to your projects, manage project roles, and handle team permissions with ease.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                  <FaChartLine className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Daily Progress Logging</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Log your daily progress directly within the app to create a permanent record of your work and achievements.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                  <FaPalette className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Flexible Theme Options</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Switch easily between light and dark themes or create custom color schemes to match your brand.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-[#0c0a1a]/80 dark:to-[#0c0a1a]/60 rounded-2xl overflow-hidden shadow-xl border border-purple-100 dark:border-[#c2a7fb]/20"
          >
            <div className="bg-gradient-to-r from-purple-100 to-transparent dark:from-[#c2a7fb]/10 dark:to-transparent py-10 px-6 border-b border-purple-100 dark:border-[#c2a7fb]/20">
              <h2 className="text-3xl font-bold text-center mb-2 dark:text-purple-100">
                Our Next <span className="text-[#6229b3] dark:text-[#c2a7fb]">Promise</span>: What's Coming to Todoshi
              </h2>
              <p className="text-center text-gray-600 dark:text-purple-200/80 text-lg mb-2 max-w-3xl mx-auto leading-relaxed">
                We are continuously evolving Todoshi to meet your growing needs and enhance your productivity. Here's a glimpse of the exciting features we're working on:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20 text-center"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaVideo className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Group Video & Video Calls</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Connect with your team members using our integrated video conferencing solution.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20 text-center"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaDesktop className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">Screen Sharing</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Share your screen with team members during video calls for better collaboration and training.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-md border border-gray-200 dark:border-[#c2a7fb]/20 text-center"
              >
                <div className="w-12 h-12 bg-[#c2a7fb] bg-opacity-30 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaCalendarAlt className="text-xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-3">In-app Scheduling</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-purple-200/70">
                  Manage your calendar and book meetings directly within the Todoshi platform.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-purple-100">Meet Our Team</h2>
          <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-50/5 dark:to-white/5 dark:backdrop-blur-md p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-36 h-36 rounded-full overflow-hidden shadow-md mx-auto md:mx-0"
            >
              <img
                src={teamMembers[0].image}
                alt={teamMembers[0].name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-bold text-gray-800 dark:text-purple-100 text-xl mb-1">{teamMembers[0].name}</h3>
              <p className="text-md text-purple-700 dark:text-[#c2a7fb] font-medium mb-5">{teamMembers[0].title}</p>
              <p className="text-md text-gray-700 dark:text-purple-300 mb-4 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-md">
                ⭐ This hard work deserves a star!
              </p>
              <Link
                to="https://github.com/your-github-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-[#4c1f8e] to-[#6229b3] dark:from-[#6229b3]/50 dark:to-[#4c1f8e]/40 text-white rounded-md hover:bg-gradient-to-r hover:from-[#6229b3] hover:to-[#8236ec] dark:hover:from-[#6229b3]/60 dark:hover:to-[#4c1f8e]/50 transition-colors font-medium flex items-center shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.997.11-.774.42-1.305.763-1.605-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.123-.303-.535-1.526.117-3.176 0 0 1.007-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.65.241 2.873.118 3.176.77.84 1.236 1.912 1.236 3.222 0 4.61-2.807 5.624-5.478 5.92.43.37.815 1.102.815 2.222v3.293c0 .32.192.694.8.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Visit GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - already has gradient */}
      <section className="py-16 px-4 rounded-lg bg-gradient-to-b from-gray-900 to-[#4c1f8e] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-lg mb-8 text-gray-300 dark:text-purple-200/90 leading-relaxed">
            Discover how Todoshi can streamline your projects and boost your team's efficiency.
          </p>
          <Link
            to="/features"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#8236ec] to-[#6229b3] dark:from-[#c2a7fb]/40 dark:to-[#6229b3]/40 text-white rounded-md hover:opacity-90 transition-opacity font-medium shadow-lg"
          >
            Explore Features
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
