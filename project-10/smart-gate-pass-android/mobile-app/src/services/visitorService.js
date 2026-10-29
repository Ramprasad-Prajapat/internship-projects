// Mock Service for Visitor workflow
export const visitorService = {
  createVisitor: async (visitorData) => {
    // Mock API call to create visitor
    return { success: true, data: visitorData };
  },
  approveVisitor: async (id) => {
    return { success: true, id };
  },
  rejectVisitor: async (id) => {
    return { success: true, id };
  },
  checkInVisitor: async (id) => {
    return { success: true, id };
  },
  checkOutVisitor: async (id) => {
    return { success: true, id };
  }
};
