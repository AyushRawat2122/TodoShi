import React from 'react';
import { FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaPencilAlt } from 'react-icons/fa';
import { PiSignOut } from "react-icons/pi";

const Dashboard = () => {
    const user = {
        name: "Ayush Rawat",
        title: "Frontend Developer",
        location: "New Delhi, India",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        coverBg: "bg-gradient-to-r from-[#4c1f8e] to-[#8236ec]",
        skills: ["React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "Next.js", "UI/UX Design", "Firebase"],
        projects: [
            { id: 1, name: "E-commerce Platform", status: "active", lastUpdated: "2 hours ago" },
            { id: 2, name: "Portfolio Website", status: "completed", lastUpdated: "1 day ago" },
            { id: 3, name: "Task Management App", status: "active", lastUpdated: "3 days ago" },
            { id: 4, name: "Weather Dashboard", status: "completed", lastUpdated: "1 week ago" },
        ],
        about: {
            bio: "Passionate frontend developer with 4+ years of experience building modern web applications",
            location: "New Delhi, India",
            website: "ayushrawat.dev",
            socials: {
                linkedin: "ayush-rawat",
                twitter: "ayushrawat",
                github: "ayushrawat"
            }
        },
        authConnections: {
            google: true,
            github: true,
            facebook: false,
            twitter: false
        }
    };
    
    // Improved status class styling
    const getStatusClass = (status) => {
        return status === 'active' 
            ? "bg-[#8236ec] bg-opacity-20 text-[white] border border-[#a15ef3]" 
            : "bg-green-100 text-green-700 border border-green-300";
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Profile Banner Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className={`h-48 md:h-56 ${user.coverBg} relative`}>
                        <button className='absolute left-4 top-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm'>
                            <FaPencilAlt className="text-white text-sm" />
                        </button>
                        <button className="absolute right-4 top-4 text-white flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm">
                           <PiSignOut className="inline-block mr-1" /> Sign out
                        </button>
                    </div>
                    <div className="relative px-6 py-5">
                        <div className="absolute -top-16 left-6 group">
                            <img 
                                src={user.avatar} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full border-4 bg-purple-200 border-white shadow-md object-cover"
                            />
                            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100">
                                <FaPencilAlt className="text-[#4c1f8e] text-sm" />
                            </button>
                        </div>
                        <div className="ml-36 mt-2">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user.name}</h1>
                                <button className="text-gray-400 hover:text-[#4c1f8e] focus:outline-none transition-colors">
                                    <FaPencilAlt className="text-sm" />
                                </button>
                            </div>
                            <p className="text-gray-600 text-lg mt-1">{user.title}</p>
                            <div className="flex items-center mt-1 text-gray-500">
                                <FaMapMarkerAlt className="mr-1" />
                                <span>{user.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Skills Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                                <button className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors flex items-center">
                                    <span className="mr-1">+</span> Add Skill
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-4 py-1.5 bg-[#c2a7fb] bg-opacity-20 text-[#4c1f8e] rounded-full text-sm font-medium hover:bg-opacity-30 transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-bold text-gray-800">About</h2>
                                <button className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors">Edit</button>
                            </div>
                            <p className="text-gray-700 text-sm mb-5 leading-relaxed">{user.about.bio}</p>
                            <div className="space-y-3.5">
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="text-gray-500 mr-3 w-5" />
                                    <span className="text-gray-700">{user.about.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-gray-500 mr-3 w-5">🌐</div>
                                    <span className="text-gray-700">{user.about.website}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaLinkedin className="text-[#0077b5] mr-3 w-5" />
                                    <span className="text-gray-700">{user.about.socials.linkedin}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaTwitter className="text-[#1DA1F2] mr-3 w-5" />
                                    <span className="text-gray-700">{user.about.socials.twitter}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaGithub className="text-[#333] mr-3 w-5" />
                                    <span className="text-gray-700">{user.about.socials.github}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Projects Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-800">Projects</h2>
                                <button className="px-4 py-2 bg-[#6229b3] text-white rounded-full text-sm flex items-center hover:bg-[#4c1f8e] transition-colors">
                                    <span className="mr-1">+</span> New Project
                                </button>
                            </div>
                            <div className="space-y-5">
                                {user.projects.map(project => (
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
                        
                        {/* Auth Connections */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-bold text-gray-800">Connected Accounts</h2>
                                <button className="text-[#8236ec] text-sm font-medium hover:text-[#4c1f8e] transition-colors">Manage</button>
                            </div>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-800 font-medium">Google</p>
                                            <p className="text-sm text-gray-500">Access with Google account</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={user.authConnections.google} className="sr-only peer" readOnly />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a15ef3] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6229b3]"></div>
                                    </label>
                                </div>
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
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={user.authConnections.github} className="sr-only peer" readOnly />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#a15ef3] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6229b3]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
