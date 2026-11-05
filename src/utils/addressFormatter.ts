/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KarmaiyaCentralOfficeDetails } from '../types';
import { DEFAULT_KARMAIYA_CENTRAL_OFFICE } from '../data/communityData';

/**
 * Robust sanitizer that ensures no central office field is undefined, null, or string 'undefined'.
 * Safely defaults any missing or corrupted field to the official Karmaiya Central Office baseline.
 */
export function sanitizeCentralOfficeDetails(
  office?: Partial<KarmaiyaCentralOfficeDetails> | null
): KarmaiyaCentralOfficeDetails {
  const def = DEFAULT_KARMAIYA_CENTRAL_OFFICE;
  if (!office || typeof office !== 'object') {
    return { ...def };
  }

  const clean = (val: any, fallback: string): string => {
    if (val === undefined || val === null) return fallback;
    const s = String(val).trim();
    if (
      s === '' ||
      s.toLowerCase() === 'undefined' ||
      s.toLowerCase() === 'null' ||
      s === 'undefined, undefined, undefined, Sarlahi, undefined, undefined'
    ) {
      return fallback;
    }
    return s;
  };

  return {
    officeName: clean(office.officeName, def.officeName),
    officeNameNepali: clean(office.officeNameNepali, def.officeNameNepali),
    municipality: clean(office.municipality, def.municipality),
    wardNo: clean(office.wardNo, def.wardNo),
    villageSettlement: clean(office.villageSettlement, def.villageSettlement),
    district: clean(office.district, def.district),
    province: clean(office.province, def.province),
    country: clean(office.country, def.country),
    postalCode: clean(office.postalCode, def.postalCode),
    primaryPhone: clean(office.primaryPhone, def.primaryPhone),
    secondaryPhone: clean(office.secondaryPhone, def.secondaryPhone),
    hotline: clean(office.hotline, def.hotline),
    officialEmail: clean(office.officialEmail, def.officialEmail),
    secondaryEmail: clean(office.secondaryEmail, def.secondaryEmail),
    officeHours: clean(office.officeHours, def.officeHours),
    holidaySchedule: clean(office.holidaySchedule, def.holidaySchedule),
    chiefExecutiveInCharge: clean(office.chiefExecutiveInCharge, def.chiefExecutiveInCharge),
    viceChairperson: clean(office.viceChairperson, def.viceChairperson),
    secretaryGeneral: clean(office.secretaryGeneral, def.secretaryGeneral),
    treasurer: clean(office.treasurer, def.treasurer),
    daoRegistrationNo: clean(office.daoRegistrationNo, def.daoRegistrationNo),
    swcAffiliationNo: clean(office.swcAffiliationNo, def.swcAffiliationNo),
    panNumber: clean(office.panNumber, def.panNumber),
    landmark: clean(office.landmark, def.landmark),
    gpsCoordinates: clean(office.gpsCoordinates, def.gpsCoordinates),
    googleMapsEmbedUrl: clean(office.googleMapsEmbedUrl, def.googleMapsEmbedUrl),
    emergencyRiverHelpline: clean(office.emergencyRiverHelpline, def.emergencyRiverHelpline || '+977-9806389212'),
    keyServices: Array.isArray(office.keyServices) && office.keyServices.length > 0
      ? office.keyServices
      : (def.keyServices || []),
    publicNoticeBoardNotice: office.publicNoticeBoardNotice ?? def.publicNoticeBoardNotice,
    publicNoticeTitle: office.publicNoticeTitle || def.publicNoticeTitle,
    publicNoticePriority: office.publicNoticePriority || def.publicNoticePriority || 'urgent',
    publicNoticePostedAt: office.publicNoticePostedAt || def.publicNoticePostedAt || new Date().toISOString().split('T')[0],
    publicNoticeIsPublished: office.publicNoticeIsPublished !== undefined ? office.publicNoticeIsPublished : true,
    lastUpdated: office.lastUpdated || new Date().toISOString()
  };
}

/**
 * Cleanly format the central office address string without any "undefined" or empty segments.
 */
export function formatCentralOfficeAddress(
  office?: Partial<KarmaiyaCentralOfficeDetails> | null
): string {
  const sanitized = sanitizeCentralOfficeDetails(office);

  const parts = [
    sanitized.villageSettlement,
    sanitized.wardNo,
    sanitized.municipality,
    sanitized.district,
    sanitized.province,
    sanitized.country
  ]
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(
      (item) =>
        item.length > 0 &&
        item.toLowerCase() !== 'undefined' &&
        item.toLowerCase() !== 'null'
    );

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return 'Karmaiya, Ward No. 11, Bagmati Municipality, Sarlahi, Madhesh Province, Nepal';
}

/**
 * Returns a direct Google Maps search / navigation URL for Karmaiya Central Office.
 */
export function getCentralOfficeMapsUrl(
  office?: Partial<KarmaiyaCentralOfficeDetails> | null
): string {
  const customUrl = office?.googleMapsEmbedUrl?.trim();
  if (customUrl && customUrl.startsWith('http')) {
    return customUrl;
  }
  const address = formatCentralOfficeAddress(office);
  const gps = office?.gpsCoordinates?.trim();
  if (gps && gps.includes('°')) {
    return 'https://www.google.com/maps/search/?api=1&query=27.1350,85.4720';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Sanitizes phone numbers for tel: links
 */
export function formatTelLink(phone?: string | null): string {
  if (!phone) return '+9779806389212';
  // Extract all digits and leading plus
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned || '+9779806389212';
}
