"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface DashboardNavProps {
  activeTab: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const DashboardNav = ({ activeTab, isOpen, setIsOpen, isCollapsed, toggleCollapse }: DashboardNavProps) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30 pt-16
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className={`px-4 py-6 flex flex-col h-[calc(100vh-4rem)] relative ${isCollapsed ? 'items-center' : ''}`}>
          {/* Collapse toggle button - visible only on desktop */}
          <button 
            className="absolute hidden md:flex items-center justify-center -right-4 top-2 w-8 h-8 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors focus:outline-none shadow-sm"
            onClick={toggleCollapse}
          >
            <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {!isCollapsed && (
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Menu
            </h3>
          )}
          
          <nav className={`flex flex-col ${isCollapsed ? 'space-y-4 items-center pt-4' : 'space-y-1'}`}>
            <Link
              href="/dashboard"
              className={`rounded-lg flex items-center text-sm font-medium transition-colors
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'px-3 py-2'}
                ${activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Dashboard" : ""}
            >
              <svg
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-6.5l-3-3"
                />
              </svg>
              {!isCollapsed && "Dashboard"}
            </Link>

            <Link
              href="/brochures"
              className={`rounded-lg flex items-center text-sm font-medium transition-colors
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'px-3 py-2'}
                ${activeTab === "brochures"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "My Brochures" : ""}
            >
              <svg
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {!isCollapsed && "My Brochures"}
            </Link>

            <Link
              href="/account"
              className={`rounded-lg flex items-center text-sm font-medium transition-colors
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'px-3 py-2'}
                ${activeTab === "account"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Account Settings" : ""}
            >
              <svg
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {!isCollapsed && "Account Settings"}
            </Link>

            <Link
              href="/dashboard/billing"
              className={`rounded-lg flex items-center text-sm font-medium transition-colors
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'px-3 py-2'}
                ${activeTab === "billing"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Billing" : ""}
            >
              <svg
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              {!isCollapsed && "Billing"}
            </Link>
          </nav>
          
          {/* Spacer to push sign out to bottom */}
          <div className="flex-grow"></div>
          
          {/* Sign out button at bottom of sidebar */}
          <button
            onClick={handleSignOut}
            className={`rounded-lg flex items-center text-sm font-medium transition-colors
              ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'px-3 py-2 mt-auto'}
              text-red-600 hover:bg-red-50
            `}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <svg
              className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!isCollapsed && "Sign Out"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
