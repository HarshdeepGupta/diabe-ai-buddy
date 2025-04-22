
import { createContext, useContext, ReactNode, useState } from "react";

// Profile type definitions
export interface Medication {
  name: string;
  dosage: string;
  timing: string;
}

export interface ActivityPreference {
  type: string;
  intensity: "low" | "medium" | "high";
  preferredTime: string;
}

export interface Profile {
  age: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  t2dDuration: number;
  medications: Medication[];
  activityPreferences: ActivityPreference[];
}

export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime?: string;
  description: string;
  type: "medication" | "exercise" | "meal";
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  generatedSchedule: CalendarEvent[];
  setGeneratedSchedule: (schedule: CalendarEvent[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetProfile: () => void;
}

const initialProfile: Profile = {
  age: 0,
  weight: 0,
  weightUnit: "kg",
  t2dDuration: 0,
  medications: [],
  activityPreferences: [],
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSchedule, setGeneratedSchedule] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetProfile = () => {
    setProfile(null);
    setCurrentStep(0);
    setGeneratedSchedule([]);
    setError(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        currentStep,
        setCurrentStep,
        generatedSchedule,
        setGeneratedSchedule,
        isLoading,
        setIsLoading,
        error,
        setError,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
