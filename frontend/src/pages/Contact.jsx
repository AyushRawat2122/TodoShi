import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 0
  });

  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 0
      });
      setSubmitted(false);
    }, 3000);
  };

  const {isSignedIn , isLoading} = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isSignedIn && !isLoading){
      navigate('/sign-in')
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0a1a]">
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-[#0c0a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-purple-100 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            We'd Love to Hear From <span className="text-[#6229b3] dark:text-[#c2a7fb]">You</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-purple-200/80 mb-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your feedback helps us improve Todoshi and deliver the best experience possible.
            Whether you have a question, suggestion, or just want to say hello, we're here for you.
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 dark:bg-[#0c0a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-[#4c1f8e] rounded-xl p-8 text-white h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="mb-8 text-gray-100">
                  Have questions or need assistance? Reach out to us using any of the methods below:
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 mr-4 text-gray-200" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-200">support@todoshi.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhoneAlt className="mt-1 mr-4 text-gray-200" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-200">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-4 text-gray-200" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-200">
                        123 Productivity Lane<br />
                        Suite 420<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feedback Form - Update background gradient */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent rounded-xl p-8 border border-gray-100 dark:border-[#c2a7fb]/20">
                <h2 className="text-2xl font-bold mb-6 dark:text-purple-100">Send Us Your Feedback</h2>

                {submitted ? (
                  <motion.div
                    className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h3 className="text-lg font-bold mb-2">Thank You!</h3>
                    <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors"
                        placeholder="What are you contacting us about?"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-gray-700 dark:text-purple-200 font-medium mb-2">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors resize-none"
                        placeholder="Please provide your feedback or questions here..."
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-purple-200 font-medium mb-2">Rate Your Experience</label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="text-3xl focus:outline-none mr-1"
                          >
                            <FaStar
                              className={`transition-colors ${(hoverRating || formData.rating) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-gray-500 dark:text-gray-300">
                          {formData.rating > 0 ? `${formData.rating}/5` : "Select a rating"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#6229b3] text-white rounded-md hover:bg-[#6229b3]/90 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-[#6229b3]/50"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Update background */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-[#0c0a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 dark:text-purple-100">Frequently Asked Questions</h2>

          <div className="grid gap-6 text-left">
            <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent p-6 rounded-xl border border-gray-100 dark:border-[#c2a7fb]/20">
              <h3 className="font-bold text-lg mb-2 dark:text-purple-100">How quickly will I receive a response?</h3>
              <p className="text-gray-600 dark:text-purple-200/70">We typically respond to all inquiries within 24-48 business hours. For urgent matters, please indicate so in your message subject.</p>
            </div>

            <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent p-6 rounded-xl border border-gray-100 dark:border-[#c2a7fb]/20">
              <h3 className="font-bold text-lg mb-2 dark:text-purple-100">Do you offer technical support?</h3>
              <p className="text-gray-600 dark:text-purple-200/70">Yes! Our technical support team is available Monday through Friday, 9 AM to 5 PM EST. Please provide as much detail as possible about your issue.</p>
            </div>

            <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent p-6 rounded-xl border border-gray-100 dark:border-[#c2a7fb]/20">
              <h3 className="font-bold text-lg mb-2 dark:text-purple-100">Can I request a specific feature?</h3>
              <p className="text-gray-600 dark:text-purple-200/70">Absolutely! We love hearing feature requests from our users. Please describe your idea in detail in the feedback form above.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
