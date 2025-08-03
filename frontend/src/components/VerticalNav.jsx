import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaEnvelope, FaBook, FaChevronLeft, FaArrowsAltH } from 'react-icons/fa';
import { MdContacts } from "react-icons/md";

const VerticalNav = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { path: '/', name: 'Home', icon: <FaHome /> },
        { path: '/dashboard', name: 'Dashboard', icon: <MdContacts /> },
        { path: '/about', name: 'About', icon: <FaInfoCircle /> },
        { path: '/contact', name: 'Contact', icon: <FaEnvelope /> },
        { path: '/guide', name: 'Guide', icon: <FaBook /> }
    ];

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <div className={`bg-white shadow-lg shadow-gray-400 h-full flex flex-col ${collapsed ? 'w-15 rounded-full' : 'w-64 rounded-2xl'}`}>
            {/* Header */}
            <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200`}>
                {!collapsed && (
                    <img src="/todoshi-branding.png" alt="todoshi" className='h-10' />
                )}
                <button
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#4c1f8e] hover:bg-gray-100 rounded-full transition-colors"
                    onClick={toggleCollapse}
                    title={collapsed ? "Expand" : "Collapse"}
                >
                    {collapsed ? <FaArrowsAltH size={16} /> : <FaChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="py-6 flex-grow">
                <ul className="space-y-4">
                    {navItems.map((item) => (
                        <li key={item.path} className="px-3">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center ${collapsed ? 'justify-center' : ''} p-2 rounded-full transition-all ${
                                        isActive 
                                            ? 'bg-[#4c1f8e] text-white' 
                                            : 'text-[#4c1f8e] hover:bg-gray-100'
                                    }`
                                }
                                title={collapsed ? item.name : ''}
                            >
                                <span className={`text-xl ${collapsed ? '' : 'ml-3 mr-3'}`}>{item.icon}</span>
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            
            {/* User Profile Section (Optional) */}
            <div className="py-2 px-1">
                <div className={`flex ${collapsed ? 'justify-center' : 'items-center px-2'}`}>
                    <div className="w-10 h-10 rounded-full bg-[#c2a7fb] bg-opacity-30 flex items-center justify-center">
                        <span className="text-sm font-medium text-[#4c1f8e]">AR</span>
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 truncate">Ayush Rawat</p>
                            <p className="text-xs text-gray-500 truncate">ayush@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerticalNav;
