// FaceTrack AI — Mock branches (frontend-only mode).
// Rajasthan office network. lat/lng + radiusMeters power the (mock) location-
// radius check used by the employee Mark-Attendance flow. Coordinates are
// approximate city-centre demo values — replace with exact office GPS during a
// real deployment. Field names (name/lat/lng/radiusMeters) are load-bearing and
// kept stable; the standard geofence radius is 150 m for every branch.

export const BRANCHES = [
  {
    id: 'BR001',
    name: 'Jaipur HQ',
    code: 'JAI',
    address: 'C-Scheme, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    radiusMeters: 150,
    // No dedicated branch admin assigned yet. (Previously pointed at the Super
    // Admin uid 'u-super', which is org-level — that inflated the "active branch
    // admins" count and made branch performance show the Super Admin as HQ's
    // admin. Super Admin stays global; HQ is simply unassigned until a real
    // branchAdmin user is added.)
    branchAdminId: null,
    status: 'active',
  },
  {
    id: 'BR002',
    name: 'Jodhpur Branch',
    code: 'JOD',
    address: 'Sardarpura, Jodhpur, Rajasthan',
    city: 'Jodhpur',
    state: 'Rajasthan',
    lat: 26.2389,
    lng: 73.0243,
    radiusMeters: 150,
    branchAdminId: 'u-branch',
    status: 'active',
  },
  {
    id: 'BR003',
    name: 'Udaipur Office',
    code: 'UDR',
    address: 'Hiran Magri, Udaipur, Rajasthan',
    city: 'Udaipur',
    state: 'Rajasthan',
    lat: 24.5854,
    lng: 73.7125,
    radiusMeters: 150,
    branchAdminId: null,
    status: 'active',
  },
  {
    id: 'BR004',
    name: 'Kota Office',
    code: 'KOT',
    address: 'Vigyan Nagar, Kota, Rajasthan',
    city: 'Kota',
    state: 'Rajasthan',
    lat: 25.2138,
    lng: 75.8648,
    radiusMeters: 150,
    branchAdminId: null,
    status: 'active',
  },
  {
    id: 'BR005',
    name: 'Bikaner Branch',
    code: 'BKN',
    address: 'Rani Bazar, Bikaner, Rajasthan',
    city: 'Bikaner',
    state: 'Rajasthan',
    lat: 28.0229,
    lng: 73.3119,
    radiusMeters: 150,
    branchAdminId: null,
    status: 'active',
  },
  {
    id: 'BR006',
    name: 'Ajmer Office',
    code: 'AJM',
    address: 'Civil Lines, Ajmer, Rajasthan',
    city: 'Ajmer',
    state: 'Rajasthan',
    lat: 26.4499,
    lng: 74.6399,
    radiusMeters: 150,
    branchAdminId: null,
    status: 'active',
  },
];
