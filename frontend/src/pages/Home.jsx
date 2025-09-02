import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegFileAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import { PointerHighlight } from '../components/PointerHighLight';
import { useAuthStatus } from '../hooks/useAuthStatus';
import useUser from '../hooks/useUser';

const Home = () => {

  const { isSignedIn } = useAuthStatus();
  const { user } = useUser();
  const navigate = useNavigate();
  const routeToProjects = () => {
    if(!user.data){
      console.log("User data not available yet. Server Busy");
      return;
    }

    if (isSignedIn && user?.data?._id) {
      navigate(`/projects/${user.data._id}`);
    }else{
      navigate('/sign-up');
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0c0a1a]">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-purple-100 mb-4 leading-tight">
              Streamline Your Projects, <PointerHighlight><span ><span className="text-[#6229b3] dark:text-[#c2a7fb]">Elevate</span> <br /> <span>Your Productivity</span></span></PointerHighlight>
            </h1>
            <p className="text-lg text-gray-600 dark:text-purple-200/80 my-8 leading-relaxed">
              Todoshi empowers teams to efficiently organize, track, and execute tasks in a collaborative and intuitive environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={routeToProjects}
                className="px-6 py-3 bg-[#4c1f8e] dark:bg-[#6229b3]/40 text-white rounded-md hover:bg-[#6229b3] dark:hover:bg-[#4c1f8e]/40 transition-colors font-medium"
              >
                Get Started
              </button>
              <Link
                to="/guide"
                className="px-6 py-3 bg-white dark:bg-[#0c0a1a]/50 text-gray-700 dark:text-purple-200 border border-gray-300 dark:border-[#c2a7fb]/20 rounded-md hover:bg-gray-50 dark:hover:bg-[#c2a7fb]/10 transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gray-100 dark:bg-[#0c0a1a]/30 dark:border dark:border-[#c2a7fb]/10 rounded-lg h-[300px] md:h-[400px] flex items-center justify-center"
          >
            <div className="text-gray-400 dark:text-purple-300/60 text-2xl">Dashboard Preview</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-[#0c0a1a]/20 dark:bg-gradient-to-b dark:from-gray-50/5 dark:from-10% dark:to-transparent px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-[#0c0a1a]/50  p-6 rounded-lg shadow-sm border border-gray-100 dark:border-[#c2a7fb]/20 flex flex-col items-center text-center hover:shadow-md dark:hover:shadow-[#c2a7fb]/5 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                <FaRegFileAlt className="text-2xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-purple-100 mb-2">Intuitive Task Management</h3>
              <p className="text-gray-600 dark:text-purple-200/70 text-sm mb-4">Effortlessly create, assign, and track tasks. Break down complex projects into manageable actions for improved productivity.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-[#0c0a1a]/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-[#c2a7fb]/20 flex flex-col items-center text-center hover:shadow-md dark:hover:shadow-[#c2a7fb]/5 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-2xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-purple-100 mb-2">Seamless Team Collaboration</h3>
              <p className="text-gray-600 dark:text-purple-200/70 text-sm mb-4">Foster real-time collaboration and transparent communication. Share files, comments, and updates to keep everyone in sync.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-[#0c0a1a]/50  p-6 rounded-lg shadow-sm border border-gray-100 dark:border-[#c2a7fb]/20 flex flex-col items-center text-center hover:shadow-md dark:hover:shadow-[#c2a7fb]/5 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#c2a7fb]/10 rounded-full flex items-center justify-center mb-4">
                <FaChartBar className="text-2xl text-[#4c1f8e] dark:text-[#c2a7fb]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-purple-100 mb-2">Advanced Progress Tracking</h3>
              <p className="text-gray-600 dark:text-purple-200/70 text-sm mb-4">Gain insights through rich data visualizations and analytics. Monitor project health and stay ahead with progress reports.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-purple-100">What Our Users Say</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-[#0c0a1a]/40 p-8 rounded-xl shadow-md border border-gray-100 dark:border-[#c2a7fb]/20 relative flex flex-col justify-between hover:shadow-lg dark:hover:shadow-[#c2a7fb]/5 transition-all"
            >
              <div>
                <span className="text-[#6229b3] dark:text-[#c2a7fb] text-5xl font-serif absolute left-8 top-6 opacity-20">"</span>
                <p className="text-gray-600 dark:text-purple-200/70 mb-6 italic pt-6">
                  Todoshi has transformed how our team manages projects. The intuitive, clean and powerful interface has significantly boosted our productivity.
                </p>
              </div>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-gray-200 dark:bg-[#c2a7fb]/20 rounded-full mr-4 overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-purple-100">Jane Doe</p>
                  <p className="text-sm text-gray-500 dark:text-purple-300/60">Product Manager at DevSquare</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-[#0c0a1a]/40 p-8 rounded-xl shadow-md border border-gray-100 dark:border-[#c2a7fb]/20 relative flex flex-col justify-between hover:shadow-lg dark:hover:shadow-[#c2a7fb]/5 transition-all"
            >
              <div>
                <span className="text-[#6229b3] dark:text-[#c2a7fb] text-5xl font-serif absolute left-8 top-6 opacity-20">"</span>
                <p className="text-gray-600 dark:text-purple-200/70 mb-6 italic pt-6">
                  The collaboration tools are a game-changer. Our remote team feels more connected and efficient than ever before.
                </p>
              </div>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-gray-200 dark:bg-[#c2a7fb]/20 rounded-full mr-4 overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-purple-100">Sam Miller</p>
                  <p className="text-sm text-gray-500 dark:text-purple-300/60">Project Lead, Creative Agency</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA - Add rounded corners */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-gray-900 dark:from-[#0c0a1a] to-[#4c1f8e] dark:to-[#6229b3]/60 rounded-xl overflow-hidden">
            <div className="max-w-4xl mx-auto text-center text-white py-16 px-4">
              <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Team's Potential?</h2>
              <p className="text-lg mb-8 text-gray-300 dark:text-purple-200/80">
                Join thousands of successful companies who prioritize peak productivity with Todoshi. Start your journey today!
              </p>
              <Link
                to="/sign-up"
                className="inline-block px-8 py-3 bg-[#8236ec] dark:bg-[#c2a7fb]/20 text-white dark:text-purple-100 rounded-md hover:bg-[#6229b3] dark:hover:bg-[#c2a7fb]/30 transition-colors font-medium border border-[#c2a7fb]/10"
              >
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
