import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import TimedButton from '../components/TimedButton';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase/config';
import { signOutUser } from '../firebase/auth';


const Verify = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const handleSendVerification = async () => {
    console.log(user);
    if (!user) {
      console.log("No user found in local storage");
      return;
    }
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent");
    } catch (error) {
      console.log('Error sending verification email:', error);
    };
    // Handle error appropriately, e.g., show a notification
  }

  useEffect(() => {
    return async () => {
      console.log("signing out user");
      await signOutUser(); // Sign out the user when the component unmounts so user can't trick us :)
    };
  }, []);


  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0c0a1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent rounded-xl shadow-xl p-8 max-w-md w-full overflow-hidden dark:border dark:border-[#c2a7fb]/20"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-[#4c1f8e] dark:bg-[#6229b3]/60 p-4 rounded-full inline-block mb-4">
              <FiMail className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-purple-100">Verify Your Email</h1>
          <div className="h-1 w-16 bg-purple-400 dark:bg-[#6229b3]/60 mx-auto my-3 rounded-full"></div>
          <p className="text-gray-600 dark:text-purple-200/80">
            Click to send verification email. Please check your inbox for a verification link.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-400/40 p-4 mb-6 rounded">
          <div className="flex">
            <FiAlertCircle className="text-blue-500 dark:text-blue-300 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Check your spam folder if you don't see the email. You can only sign in after verifying your email.
              <br />
              <strong>Important:</strong> Do not reload this page or the verification process will end.
            </p>
          </div>
        </div>

        <TimedButton
          onClick={handleSendVerification}
          className="w-full px-5 py-3 bg-[#4c1f8e] dark:bg-[#6229b3]/40 text-white rounded-lg font-medium shadow-md hover:bg-[#6229b3] dark:hover:bg-[#6229b3]/70 transition-all hover:shadow-lg hover:-translate-y-0.5"
          time={60000} // 60 seconds
          type="button"
        >
          <span>Send Verification Email</span>
        </TimedButton>

        <motion.button
          onClick={() => navigate('/sign-in')}
          className="w-full mt-4 px-5 py-3 bg-gray-100 dark:bg-[#13111d] text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#13111d]/80 transition-all"
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiArrowLeft className="mr-2" />
          Back to Sign In
        </motion.button>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Need help?{' '}
          <a
            onClick={() => navigate('/contact')}
            className="text-[#4c1f8e] dark:text-[#c2a7fb] hover:underline cursor-pointer"
          >
            Contact support
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Verify;
