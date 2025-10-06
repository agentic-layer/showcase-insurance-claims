import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatBerlinTime, formatBerlinLocalTime, formatBirthDate } from '@/lib/dateUtils';

interface ClaimData {
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

interface ClaimSummary {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  claim_number: string;
}

interface ClaimsContextType {
  availableClaims: ClaimSummary[];
  selectedClaimId: string | null;
  selectedClaimData: ClaimData | null;
  isLoading: boolean;
  setSelectedClaimId: (id: string) => void;
}

const ClaimsContext = createContext<ClaimsContextType>({
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

interface ClaimsProviderProps {
  children: React.ReactNode;
}

export const ClaimsProvider: React.FC<ClaimsProviderProps> = ({ children }) => {
  const [availableClaims, setAvailableClaims] = useState<ClaimSummary[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [selectedClaimData, setSelectedClaimData] = useState<ClaimData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch available claims (last 5) with optional auto-selection
  const fetchAvailableClaims = async (autoSelectId?: string) => {
    try {

      const { data: claims, error } = await supabase
        .from('claims')
        .select(`
          id,
          created_at,
          claim_number,
          customers (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching claims:', error);
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der Schäden: " + error.message,
          variant: "destructive"
        });
        return;
      }

      const formattedClaims = claims?.map(claim => ({
        id: claim.id,
        created_at: claim.created_at,
        first_name: claim.customers?.first_name || 'Unbekannt',
        last_name: claim.customers?.last_name || 'Unbekannt',
        claim_number: claim.claim_number || 'Unbekannt'
      })) || [];

      setAvailableClaims(formattedClaims);

      // Auto-selection logic
      if (autoSelectId && formattedClaims.find(claim => claim.id === autoSelectId)) {
        // If a specific ID is provided and exists in the list, select it
        setSelectedClaimId(autoSelectId);
      } else if (formattedClaims.length > 0 && !selectedClaimId) {
        // If no claim is currently selected, select the most recent one
        setSelectedClaimId(formattedClaims[0].id);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: "Fehler",
        description: "Unerwarteter Fehler beim Laden der Schäden",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch detailed claim data
  const fetchClaimData = async (claimId: string) => {
    try {
      setIsLoading(true);
      
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .select(`
          id,
          claim_number,
          customer_id,
          vehicle_id,
          accident_date,
          accident_location,
          driver,
          bodily_injury,
          conversation_id,
          overall_sentiment,
          created_at,
          customers (
            first_name,
            last_name,
            date_of_birth
          )
        `)
        .eq('id', claimId)
        .maybeSingle();

      if (claimError) {
        console.error('Error fetching claim:', claimError);
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der Schadendaten: " + claimError.message,
          variant: "destructive"
        });
        return;
      }

      if (!claimData) {
        console.log('No claim found with ID:', claimId);
        setSelectedClaimData(null);
        return;
      }

      // Fetch sentiment data if conversation_id exists
      let sentimentData = null;
      if (claimData.conversation_id) {
        const { data: sentiment } = await supabase
          .from('sentiment_analysis')
          .select('overall_sentiment')
          .eq('conversation_id', claimData.conversation_id)
          .maybeSingle();
        
        sentimentData = sentiment;
      }

      // Fetch additional fields using raw SQL to avoid type issues
      let transcriptSummary = null;
      let materialDamage = null;
      try {
        const { data: additionalData } = await supabase
          .from('claims')
          .select('transcript_summary, material_damage')
          .eq('id', claimId)
          .maybeSingle();
        
        if (additionalData) {
          transcriptSummary = (additionalData as any).transcript_summary;
          materialDamage = (additionalData as any).material_damage;
        }
      } catch (error) {
        console.log('Could not fetch additional fields:', error);
      }

      // Format the data for display
      const customer = claimData.customers;

      const formatAccidentLocation = (location: any) => {
        if (!location) return 'Nicht verfügbar';
        if (typeof location === 'string') return location;
        
        const street = location.street || '';
        const houseNumber = location.house_number || '';
        const zip = location.zip_code || location.postal_code || '';
        const city = location.city || '';
        const remarks = location.remarks || '';
        const country = location.country || '';

        let address = '';
        if (street && houseNumber) {
          address = `${street} ${houseNumber}`;
        } else if (street) {
          address = street;
        }

        if (zip && city) {
          address += address ? `, ${zip} ${city}` : `${zip} ${city}`;
        } else if (zip) {
          address += address ? `, ${zip}` : zip;
        } else if (city) {
          address += address ? `, ${city}` : city;
        }

        if (country) {
          address += address ? `, ${country}` : country;
        }

        if (remarks) {
          address += address ? ` (${remarks})` : remarks;
        }

        return address || 'Nicht verfügbar';
      };

      const formatDriver = (driver: any) => {
        if (!driver) return 'Nicht verfügbar';
        if (typeof driver === 'string') return driver;
        
        const firstName = driver.first_name || '';
        const lastName = driver.last_name || '';
        const relation = driver.relation_to_policy_holder || '';
        
        let driverInfo = '';
        if (firstName && lastName) {
          driverInfo = `${firstName} ${lastName}`;
        }
        
        if (relation) {
          driverInfo += driverInfo ? ` (${relation})` : relation;
        }
        
        return driverInfo || 'Nicht verfügbar';
      };

      const formattedData: ClaimData = {
        id: claimData.id,
        kunde: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Nicht verfügbar' : 'Nicht verfügbar',
        geburtsdatum: customer?.date_of_birth ? formatBirthDate(customer.date_of_birth) : 'Nicht verfügbar',
        kundennummer: claimData.customer_id || 'Nicht verfügbar',
        kfzKennzeichen: claimData.vehicle_id || 'Nicht verfügbar',
        unfallzeit: claimData.accident_date ? formatBerlinLocalTime(claimData.accident_date) : 'Nicht verfügbar',
        unfallort: formatAccidentLocation(claimData.accident_location),
        fahrer: formatDriver(claimData.driver),
        personenschaden: claimData.bodily_injury ? 'Ja' : 'Nein',
        schadenmeldung: claimData.created_at ? formatBerlinTime(claimData.created_at) : 'Nicht verfügbar',
        schadennummer: claimData.claim_number || 'Nicht verfügbar',
        sentiment: claimData.overall_sentiment || sentimentData?.overall_sentiment || 'Nicht verfügbar',
        zusammenfassung: transcriptSummary || 'Noch nicht verfügbar',
        schaden: materialDamage || 'Noch nicht verfügbar'
      };

      setSelectedClaimData(formattedData);
    } catch (error) {
      console.error('Error fetching claim data:', error);
      toast({
        title: "Fehler",
        description: "Unerwarteter Fehler beim Laden der Schadendaten",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available claims on mount
  useEffect(() => {
    fetchAvailableClaims();
  }, []);

  // Fetch claim data when selected claim changes
  useEffect(() => {
    if (selectedClaimId) {
      fetchClaimData(selectedClaimId);
    }
  }, [selectedClaimId]);

  // Set up real-time subscription
  useEffect(() => {

    const channel = supabase
      .channel('claims-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'claims'
        },
        async (payload) => {
          console.log('New claim inserted:', payload);
          const newClaimId = payload.new?.id;
          
          if (newClaimId) {
            // Refresh claims list and auto-select the new claim
            await fetchAvailableClaims(newClaimId);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'claims'
        },
        (payload) => {
          console.log('Claim updated:', payload);
          fetchAvailableClaims();
          // Refresh current claim data if it was updated
          if (payload.new.id === selectedClaimId) {
            fetchClaimData(selectedClaimId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClaimId]);

  return (
    <ClaimsContext.Provider
      value={{
        availableClaims,
        selectedClaimId,
        selectedClaimData,
        isLoading,
        setSelectedClaimId,
      }}
    >
      {children}
    </ClaimsContext.Provider>
  );
};
