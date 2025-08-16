
import { useState, useEffect } from "react";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Dashboard } from "@/components/Dashboard";
import { useAuth, withAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check if user has completed onboarding
  useEffect(() => {
    const onboardingData = localStorage.getItem(`onboarding_${user?.id}`);
    if (onboardingData) {
      try {
        const data = JSON.parse(onboardingData);
        setUserData(data);
        setIsOnboarded(true);
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    }
  }, [user?.id]);

  const handleOnboardingComplete = (data: any) => {
    // Save onboarding data for this user
    if (user?.id) {
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(data));
    }
    setUserData(data);
    setIsOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {!isOnboarded ? (
        <OnboardingForm onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard userData={userData} />
      )}
    </div>
  );
};

export default withAuth(Index);
