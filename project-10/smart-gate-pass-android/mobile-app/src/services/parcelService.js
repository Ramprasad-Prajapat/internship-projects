// Mock Service for Parcel workflow
export const parcelService = {
  createParcel: async (parcelData) => {
    return { success: true, data: parcelData };
  },
  updateParcelStatus: async (id, status) => {
    return { success: true, id, status };
  }
};
