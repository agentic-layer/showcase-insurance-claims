import { createContext, useContext } from 'react';

export interface AccidentLocation {
  street?: string;
  house_number?: string;
  zip_code?: string;
  postal_code?: string;
  city?: string;
  remarks?: string;
  country?: string;
}

export interface DriverInfo {
  first_name?: string;
  last_name?: string;
  relation_to_policy_holder?: string;
}

export interface AdditionalClaimData {
  transcript_summary?: string;
  material_damage?: string;
}

export interface ClaimData {
  id: string;
  kunde: string;
  geburtsdatum: string;
  kundennummer: string;
  kfzKennzeichen: string;
  unfallzeit: string;
  unfallort: string;
  fahrer: string;
  personenschaden: string;
  schadenmeldung: string;
  schadennummer: string;
  sentiment: string;
  zusammenfassung: string;
  schaden: string;
}

export interface ClaimSummary {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  claim_number: string;
}

export interface ClaimsContextType {
  availableClaims: ClaimSummary[];
  selectedClaimId: string | null;
  selectedClaimData: ClaimData | null;
  isLoading: boolean;
  setSelectedClaimId: (id: string) => void;
}

export const ClaimsContext = createContext<ClaimsContextType>({
  availableClaims: [],
  selectedClaimId: null,
  selectedClaimData: null,
  isLoading: true,
  setSelectedClaimId: () => {},
});

export const useClaims = () => {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
};
