import React, { useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Settings,
  Download,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../api/axios";

const AdminHeader = ({ onAddBook, onExportCSV, totalBooks = 0 }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // LOGOUT HANDLER
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await adminLogout();
    }
  };

  // SETTINGS HANDLER
  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                IES University <span className="text-indigo-600">Library</span>
              </h1>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            {/* Add Book Button */}
            <button
              onClick={onAddBook}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                  AU
                </div>
                <div className="text-left hidden lg:block mr-2">
                  <p className="text-sm font-medium text-gray-700 leading-none">
                    Admin
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileMenuOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-20">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleSettings();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <button
              onClick={() => {
                onAddBook();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-5 w-5 text-indigo-600" />
              Add New Book
            </button>

            <button
              onClick={() => {
                onExportCSV();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-5 w-5 text-gray-500" />
              Export CSV
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSettings();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-5 w-5 text-gray-500" />
              Settings
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
