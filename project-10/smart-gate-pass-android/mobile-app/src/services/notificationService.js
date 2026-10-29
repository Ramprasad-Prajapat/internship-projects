// Mock Service for Notification history
export const notificationService = {
  getNotifications: async () => {
    return [
      { id: '1', title: 'New Visitor Request', body: 'Marcus Thompson is waiting at Gate 4.', type: 'VISITOR', isRead: false },
      { id: '2', title: 'Parcel Waiting', body: 'Amazon parcel logged for B-403.', type: 'PARCEL', isRead: false }
    ];
  },
  markAsRead: async (id) => {
    return { success: true, id };
  }
};
