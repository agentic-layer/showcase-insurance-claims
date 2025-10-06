import { formatInTimeZone } from 'date-fns-tz';

const BERLIN_TIMEZONE = 'Europe/Berlin';

/**
 * Formats a date string to Berlin timezone without any unwanted conversions.
 * The input is assumed to already be in Berlin time from the backend.
 */
export const formatBerlinTime = (dateString: string | null): string => {
  if (!dateString) return 'Nicht verfügbar';
  
  try {
    // Parse the date string and format it in Berlin timezone
    // This ensures we display the exact time as stored in the backend
    return formatInTimeZone(
      dateString,
      BERLIN_TIMEZONE,
      'dd.MM.yyyy, HH:mm'
    ) + ' Uhr';
  } catch (error) {
    console.error('Error formatting Berlin time:', error);
    return 'Ungültiges Datum';
  }
};

/**
 * Formats a date that is already stored in Berlin time (no timezone conversion needed).
 * Used for dates like accident_date that are stored in local Berlin time.
 */
export const formatBerlinLocalTime = (dateString: string | null): string => {
  if (!dateString) return 'Nicht verfügbar';
  
  try {
    // Manually parse the date string to avoid timezone interpretation
    // Expected format: YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm:ss
    const dateTimeParts = dateString.replace('T', ' ').split(' ');
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1] || '00:00:00';
    
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Create Date object using local time constructor (month is 0-indexed)
    const date = new Date(year, month - 1, day, hours, minutes);
    
    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedYear = date.getFullYear();
    const formattedHours = date.getHours().toString().padStart(2, '0');
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${formattedDay}.${formattedMonth}.${formattedYear}, ${formattedHours}:${formattedMinutes} Uhr`;
  } catch (error) {
    console.error('Error formatting Berlin local time:', error);
    return 'Ungültiges Datum';
  }
};

/**
 * Formats a birth date (date only, no time)
 */
export const formatBirthDate = (dateString: string | null): string => {
  if (!dateString) return 'Nicht verfügbar';
  
  try {
    return formatInTimeZone(
      dateString,
      BERLIN_TIMEZONE,
      'dd.MM.yyyy'
    );
  } catch (error) {
    console.error('Error formatting birth date:', error);
    return 'Ungültiges Datum';
  }
};