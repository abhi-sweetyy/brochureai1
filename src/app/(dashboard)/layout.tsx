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
  const { session } = useSessionContext();
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = createClientComponentClient();
  
  // Determine active tab based on pathname
  let activeTab = "dashboard";
  if (pathname.includes("/account")) {
    activeTab = "account";
  } else if (pathname.includes("/billing")) {
    activeTab = "billing";
  }

  // Fetch user credits
  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) return;
      
      try {
        console.log("Fetching credits for user:", session.user.id);
        
        // Always use the profiles table as the source of truth
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching credits:", error);
          
          // If profile doesn't exist yet, create it with 0 credits
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ id: session.user.id, credits: 0 });
            
            if (!insertError) {
              setCredits(0);
              console.log("Created new profile with 0 credits");
            } else {
              console.error("Error creating profile:", insertError);
            }
          }
          return;
        }
        
        console.log("Credits data:", data);
        if (data) {
          setCredits(data.credits || 0);
        }
      } catch (error) {
        console.error("Error in fetchCredits:", error);
      }
    };

    fetchCredits();

    // Listen for changes in the profiles table
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session?.user?.id}`,
        },
        (payload) => {
          console.log("Profile change detected:", payload);
          if (payload.new && 'credits' in payload.new) {
            setCredits(payload.new.credits);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      />
      
      {/* Main content with padding to account for sidebar */}
      <div className="md:pl-64 pt-16 transition-all duration-200">
        <main className="px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
