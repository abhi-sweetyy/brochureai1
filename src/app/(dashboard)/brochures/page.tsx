"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  address: string;
  created_at: string;
  status: string;
  template_id: string;
}

const BrochuresPage = () => {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);

  // Protect the brochures route
  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
    }
  }, [session, isLoading, router]);

  // Fetch projects
  const fetchProjects = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('real_estate_projects')
      .select('*')
      .eq('user_id', session.user.id)  // Filter by current user's ID
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    if (data) {
      setProjects(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [supabase, session]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="mr-auto">
            <h1 className="text-3xl font-bold text-gray-900">My Brochures</h1>
            <p className="text-gray-600 mt-2">View and manage your real estate brochures</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Brochure
            </Link>
          </div>
        </div>
        
        {/* Projects List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Brochures</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-600 text-lg mb-2">You haven't created any brochures yet</p>
              <p className="text-gray-500 mb-6 max-w-md">Create your first professional real estate brochure with our easy-to-use AI templates</p>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                <span className="relative flex items-center text-white font-medium">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Your First Brochure
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map(project => (
                <Link 
                  href={`/project/${project.id}`} 
                  key={project.id}
                  className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:shadow-blue-100 flex flex-col"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-blue-100" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <h3 className="font-medium text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{project.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrochuresPage; 