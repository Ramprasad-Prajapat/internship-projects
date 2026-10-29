enum RolePermission {
  customerView,
  customerOrder,
  restaurantManageMenu,
  restaurantManageOrder,
  deliveryManageDelivery,
  adminManageUsers,
  adminManageRestaurants,
  adminManageDelivery,
  adminManageOffers,
  adminViewAnalytics,
}

class UserPermissions {
  final String role;
  final List<RolePermission> permissions;

  UserPermissions({required this.role, required this.permissions});

  static UserPermissions getForRole(String role) {
    switch (role.toUpperCase()) {
      case 'RESTAURANT':
        return UserPermissions(
          role: 'RESTAURANT',
          permissions: [
            RolePermission.customerView,
            RolePermission.restaurantManageMenu,
            RolePermission.restaurantManageOrder,
          ],
        );
      case 'DELIVERY':
        return UserPermissions(
          role: 'DELIVERY',
          permissions: [
            RolePermission.customerView,
            RolePermission.deliveryManageDelivery,
          ],
        );
      case 'ADMIN':
        return UserPermissions(
          role: 'ADMIN',
          permissions: RolePermission.values,
        );
      case 'CUSTOMER':
      default:
        return UserPermissions(
          role: 'CUSTOMER',
          permissions: [
            RolePermission.customerView,
            RolePermission.customerOrder,
          ],
        );
    }
  }

  bool hasPermission(RolePermission permission) {
    return permissions.contains(permission);
  }
}
