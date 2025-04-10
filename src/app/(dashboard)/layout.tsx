"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { session } = useSessionContext();
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = createClientComponentClient();
  
  // Determine active tab based on pathname
  let activeTab = "dashboard";
  if (pathname.includes("/account")) {
    activeTab = "account";
  } else if (pathname.includes("/billing")) {
    activeTab = "billing";
  } else if (pathname.includes("/brochures")) {
    activeTab = "brochures";
  }

  // Toggle sidebar collapse state
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    // Store preference in localStorage
    localStorage.setItem('sidebarCollapsed', (!isSidebarCollapsed).toString());
  };

  // Check if user has a sidebar preference
  useEffect(() => {
    const savedPreference = localStorage.getItem('sidebarCollapsed');
    if (savedPreference !== null) {
      setIsSidebarCollapsed(savedPreference === 'true');
    }
  }, []);

  // Fetch credits when session changes
  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single();
      
      if (data) {
        setCredits(data.credits);
      }
    };

    fetchCredits();
  }, [session, supabase]);

  // Listen for credits updates
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = supabase
      .channel('credits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.credits !== undefined) {
            setCredits(payload.new.credits);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session, supabase]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        userEmail={session?.user?.email}
        credits={credits}
      />
      <DashboardNav 
        activeTab={activeTab} 
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
      />
      
      {/* Main content with padding that adjusts to sidebar state */}
      <div className={`transition-all duration-300 pt-16 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <main className="px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
