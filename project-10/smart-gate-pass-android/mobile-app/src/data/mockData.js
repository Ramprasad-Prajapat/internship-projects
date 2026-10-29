export const initialVisitors = [
  {
    id: '1',
    name: 'Marcus Thompson',
    phone: '+1 (555) 012-3456',
    purpose: 'Maintenance Delivery',
    flatNo: 'B-403',
    residentName: 'Ananya Sharma',
    guardName: 'Officer Lee',
    requestTime: '10:45 AM',
    status: 'Pending Approval'
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 987-6543',
    purpose: 'Parcel Delivery',
    flatNo: 'A-102',
    residentName: 'John Smith',
    guardName: 'Officer Chen',
    requestTime: '10:32 AM',
    status: 'Pending Approval'
  },
  {
    id: '3',
    name: 'John Doe',
    phone: '+91 98765 43210',
    purpose: 'Guest',
    flatNo: 'B-403',
    residentName: 'Ananya Sharma',
    guardName: 'Officer Lee',
    requestTime: '09:15 AM',
    status: 'Checked In',
    entryTime: '09:20 AM'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    phone: '+91 91234 56789',
    purpose: 'Guest',
    flatNo: 'C-101',
    residentName: 'Ananya Sharma',
    guardName: 'Officer Lee',
    requestTime: 'Yesterday',
    status: 'Checked Out',
    entryTime: 'Yesterday 04:00 PM',
    exitTime: 'Yesterday 06:15 PM'
  },
  {
    id: '5',
    name: 'Uncle David',
    phone: '+91 99887 76655',
    purpose: 'Family',
    flatNo: 'B-403',
    residentName: 'Ananya Sharma',
    guardName: 'Officer Lee',
    requestTime: 'Tomorrow',
    status: 'Approved', // Pre-approved visitor for check-in testing
    otp: '123456',
    isPreApproved: true
  },
  {
    id: '6',
    name: 'Ramesh Kumar',
    phone: '+91 98989 89898',
    purpose: 'Plumber',
    flatNo: 'A-102',
    residentName: 'John Smith',
    guardName: 'Officer Lee',
    requestTime: 'Just Now',
    status: 'Approved',
    otp: '482913',
    isPreApproved: true
  }
];

export const initialParcels = [
  {
    id: '1',
    companyName: 'Amazon Delivery',
    courierName: 'Rohan Das',
    phone: '+91 88888 77777',
    flatNo: 'B-403',
    residentName: 'Ananya Sharma',
    status: 'Pending Approval',
    receivedTime: '10:15 AM'
  },
  {
    id: '2',
    companyName: 'FedEx Express',
    courierName: 'Vikram Singh',
    phone: '+91 77777 66666',
    flatNo: 'A-102',
    residentName: 'John Smith',
    status: 'Held at Gate',
    receivedTime: '09:30 AM'
  },
  {
    id: '3',
    companyName: 'DHL Courier',
    courierName: 'Sanjay Dutt',
    phone: '+91 66666 55555',
    flatNo: 'C-101',
    residentName: 'Ananya Sharma',
    status: 'Delivered to Resident',
    receivedTime: '08:12 AM',
    deliveredTime: '08:30 AM'
  }
];

export const mockOtpRecords = [
  { otp: '123456', name: 'Uncle David', flatNo: 'B-403', type: 'Visitor', status: 'Valid' },
  { otp: '482913', name: 'Ramesh Kumar', flatNo: 'A-102', type: 'Visitor', status: 'Valid' },
  { otp: '000000', name: 'Expired Guest', flatNo: 'C-101', type: 'Visitor', status: 'Expired' }
];

export const mockQrRecords = [
  { qrCode: 'VISITOR-QR-001', name: 'Uncle David', flatNo: 'B-403', type: 'Visitor', details: 'Pre-Approved Entry Pass' },
  { qrCode: 'PARCEL-QR-001', name: 'FedEx Parcel', flatNo: 'A-102', type: 'Parcel', details: 'Amazon Delivery Pass' }
];
