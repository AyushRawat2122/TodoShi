import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaFolderOpen, FaCalendarAlt, FaLock, FaEnvelope,
  FaComments, FaBell, FaMoon, FaUsers, FaFileAlt, FaVideo,
  FaDesktop, FaChartLine, FaQuestionCircle, FaHeart,
  FaBook, FaMagic, FaFileContract, FaCompass, FaRegComments,
  FaRegListAlt, FaRegClock, FaUserFriends, FaRegFileAlt
} from 'react-icons/fa';

const Guide = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0a1a]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b rounded-t-lg from-gray-900 to-[#4c1f8e] text-white dark:from-[#0c0a1a] dark:to-[#4c1f8e]/40">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <FaBook className="inline-block mr-3 text-4xl" /> Todoshi - Your Personal Task Companion
            </h1>
            <p className="text-xl italic opacity-90 max-w-3xl mx-auto">
              "A clean, fast and powerful app to manage your tasks, projects, and team — all in one space."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Features Section */}
        <motion.section 
          className="mb-16"
          {...fadeIn}
        >
          <h2 className="text-3xl font-bold text-[#4c1f8e] dark:text-purple-100 mb-8 flex items-center">
            <FaMagic className="mr-3 text-3xl" /> What Can You Do With Todoshi?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FaCheckCircle />}
              title="Add Daily To-Dos"
              description="Keep track of your tasks and mark them complete easily."
            />
            
            <FeatureCard 
              icon={<FaFolderOpen />}
              title="Create & Manage Projects"
              description="Organize your tasks under different projects — perfect for personal and team use."
            />
            
            <FeatureCard 
              icon={<FaCalendarAlt />}
              title="Track Deadlines"
              description="Todoshi reminds you what's important, when it's important."
            />
            
            <FeatureCard 
              icon={<FaLock />}
              title="Secure Sign-Up & Login"
              description="Sign up with email or social logins. Add more credentials later from your dashboard."
            />
            
            <FeatureCard 
              icon={<FaEnvelope />}
              title="Email Verification"
              description="Ensures your account is protected and safe."
            />
            
            <FeatureCard 
              icon={<FaComments />}
              title="Real-time Chat"
              description="Collaborate with your team via project-level chat channels."
            />
            
            <FeatureCard 
              icon={<FaBell />}
              title="Notifications"
              description="Get alerted for task reminders and project activities — so you never miss a beat."
            />
            
            <FeatureCard 
              icon={<FaMoon />}
              title="Dark Mode"
              description="Toggle between light and dark themes for a personalized experience."
            />
            
            <FeatureCard 
              icon={<FaUsers />}
              title="Team Collaboration"
              description="Invite teammates to projects, assign tasks, and work as one unit."
            />
            
            <FeatureCard 
              icon={<FaFileAlt />}
              title="Upload Docs & SRS"
              description="Store project-related files, hosted links, and GitHub repos under the 'About Project' tab."
            />
          </div>
        </motion.section>

        {/* Coming Soon Section */}
        <motion.section 
          className="mb-16 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-xl p-8 shadow-md border border-purple-100 dark:border-[#c2a7fb]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#6229b3] dark:text-purple-100 mb-6">🚀 Coming Soon...</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-100 dark:border-[#c2a7fb]/20 rounded-lg p-5 bg-gray-50 dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent">
              <div className="flex items-center text-[#6229b3] dark:text-[#c2a7fb] mb-3">
                <FaVideo className="text-2xl mr-3" />
                <h3 className="font-semibold">Video Call</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-purple-200/80">One-click video calls within a project workspace.</p>
            </div>
            
            <div className="border border-gray-100 dark:border-[#c2a7fb]/20 rounded-lg p-5 bg-gray-50 dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent">
              <div className="flex items-center text-[#6229b3] dark:text-[#c2a7fb] mb-3">
                <FaDesktop className="text-2xl mr-3" />
                <h3 className="font-semibold">Screen Share</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-purple-200/80">Share your screen with team members during discussions.</p>
            </div>
            
            <div className="border border-gray-100 dark:border-[#c2a7fb]/20 rounded-lg p-5 bg-gray-50 dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent">
              <div className="flex items-center text-[#6229b3] dark:text-[#c2a7fb] mb-3">
                <FaChartLine className="text-2xl mr-3" />
                <h3 className="font-semibold">Task Analytics</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-purple-200/80">See how your productivity trends over time. (Optional)</p>
            </div>
          </div>
        </motion.section>

        {/* Getting Started Section */}
        <motion.section 
          className="mb-16"
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#6229b3] dark:text-purple-100 mb-6 flex items-center">
            <FaFileContract className="mr-3 text-2xl" /> How to Get Started?
          </h2>
          
          <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-[#c2a7fb]/20">
            <div className="p-8">
              <StepCard
                number="1"
                title="Sign Up & Verify"
                items={[
                  "Use email or provider (like GitHub/Google) to sign up.",
                  "Verify your email to continue."
                ]}
              />
              
              <StepCard
                number="2"
                title="Enter Your Workspace"
                items={[
                  "After login, click `Get Started`.",
                  "This opens your main workspace dashboard."
                ]}
              />
              
              <StepCard
                number="3"
                title="Create Your First Project"
                items={[
                  "Click on `New Project`.",
                  "Choose a name and description.",
                  "This launches your project view."
                ]}
                isLast={true}
              />
            </div>
          </div>
        </motion.section>

        {/* Workspace Navigation */}
        <motion.section 
          className="mb-16 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-xl p-8 shadow-md border border-gray-100 dark:border-[#c2a7fb]/20"
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#6229b3] dark:text-purple-100 mb-6 flex items-center">
            <FaCompass className="mr-3 text-2xl" /> Inside a Project Workspace
          </h2>
          <p className="mb-6 text-gray-600 dark:text-purple-200/80 text-lg">Once inside a project, your workspace nav bar unlocks access to:</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#13111d]">
                  <th className="px-4 py-3 border-b-2 border-gray-200 dark:border-[#2a283a] text-lg dark:text-purple-100">Tab</th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 dark:border-[#2a283a] text-lg dark:text-purple-100">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] font-medium flex items-center dark:text-purple-100">
                    <FaRegComments className="text-xl text-[#6229b3] dark:text-[#c2a7fb] mr-2" /> Chat
                  </td>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] text-gray-600 dark:text-purple-200/80 text-base">Real-time chat with your team.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] font-medium flex items-center dark:text-purple-100">
                    <FaRegListAlt className="text-xl text-[#6229b3] dark:text-[#c2a7fb] mr-2" /> Todos
                  </td>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] text-gray-600 dark:text-purple-200/80 text-base">Add, update, and track tasks.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] font-medium flex items-center dark:text-purple-100">
                    <FaRegClock className="text-xl text-[#6229b3] dark:text-[#c2a7fb] mr-2" /> Logs
                  </td>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] text-gray-600 dark:text-purple-200/80 text-base">View project activity & task history.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] font-medium flex items-center dark:text-purple-100">
                    <FaUserFriends className="text-xl text-[#6229b3] dark:text-[#c2a7fb] mr-2" /> Collaborators
                  </td>
                  <td className="px-4 py-4 border-b border-gray-100 dark:border-[#2a283a] text-gray-600 dark:text-purple-200/80 text-base">Manage who has access and roles in the project.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium flex items-center dark:text-purple-100">
                    <FaRegFileAlt className="text-xl text-[#6229b3] dark:text-[#c2a7fb] mr-2" /> About
                  </td>
                  <td className="px-4 py-4 text-gray-600 dark:text-purple-200/80 text-base">Add SRS docs, GitHub repos, hosted links and project notes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Help Section */}
        <motion.section 
          className="mb-8 bg-gradient-to-r from-purple-50 to-white dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent p-8 rounded-xl shadow-sm border border-purple-100 dark:border-[#c2a7fb]/20"
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#6229b3] dark:text-purple-100 mb-6 flex items-center">
            <FaQuestionCircle className="mr-2" /> Need Help?
          </h2>
          
          <ul className="space-y-3 text-gray-700 dark:text-purple-200">
            <li className="flex items-start">
              <span className="text-[#6229b3] dark:text-[#c2a7fb] mr-2">•</span>
              <span>Email: <a href="mailto:support@todoshi.app" className="text-[#6229b3] dark:text-[#c2a7fb] hover:underline">support@todoshi.app</a></span>
            </li>
            <li className="flex items-start">
              <span className="text-[#6229b3] dark:text-[#c2a7fb] mr-2">•</span>
              <span>Join the waitlist for early features.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#6229b3] dark:text-[#c2a7fb] mr-2">•</span>
              <span>Bug or feedback? Use the in-app Report option from sidebar.</span>
            </li>
          </ul>
          
          <div className="mt-8 text-center">
            <p className="flex items-center justify-center text-[#6229b3] dark:text-[#c2a7fb]">
              <FaHeart className="mr-2" /> Thank you for choosing Todoshi.
            </p>
            <p className="text-gray-600 dark:text-purple-200/80">Let's build, ship, and get things done — together.</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-lg shadow-sm p-6 border border-gray-100 dark:border-[#c2a7fb]/20 hover:shadow-md transition-shadow">
    <div className="text-[#6229b3] dark:text-[#c2a7fb] text-2xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 dark:text-purple-100 mb-2 text-lg">{title}</h3>
    <p className="text-base text-gray-600 dark:text-purple-200/70">{description}</p>
  </div>
);

const StepCard = ({ number, title, items, isLast = false }) => (
  <div className={`relative pl-12 ${!isLast ? 'pb-8' : ''}`}>
    {!isLast && <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-100 dark:bg-[#c2a7fb]/20"></div>}
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#6229b3] text-white flex items-center justify-center font-bold">
      {number}
    </div>
    <h3 className="font-bold text-xl text-gray-800 dark:text-purple-100 mb-3">{title}</h3>
    <ul className="space-y-2 text-gray-600 dark:text-purple-200/80">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-[#6229b3] dark:text-[#c2a7fb] mr-2">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Guide;
