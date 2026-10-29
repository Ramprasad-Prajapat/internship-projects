package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.components.BottomTabBar
import com.example.constants.Routes
import com.example.screens.*
import com.example.services.AuthService
import com.example.storage.TokenStorage
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        TokenStorage.init(applicationContext)
        com.example.storage.LocalDataStorage.init(applicationContext)
        com.example.storage.LocalDataStorage.loadData()
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                AppNavigator()
            }
        }
    }
}

@Composable
fun AppNavigator() {
    val navController = rememberNavController()
    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    // Detect if current screen belongs to bottom navigation hubs
    val isGuardTab = currentRoute in listOf(
        Routes.GUARD_DASHBOARD,
        Routes.GUARD_PENDING_REQUESTS,
        Routes.SCAN_QR,
        Routes.INSIDE_VISITORS
    )

    val isResidentTab = currentRoute in listOf(
        Routes.RESIDENT_DASHBOARD,
        Routes.VISITOR_REQUESTS,
        Routes.PARCEL_REQUESTS,
        Routes.NOTIFICATION_HISTORY
    )

    val showBottomBar = isGuardTab || isResidentTab

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomTabBar(
                    selectedRoute = currentRoute ?: "",
                    onRouteSelected = { route ->
                        navController.navigate(route) {
                            // Pop up to the start destination of the current tab without removing it
                            val startRoute = if (isGuardTab) Routes.GUARD_DASHBOARD else Routes.RESIDENT_DASHBOARD
                            popUpTo(startRoute) {
                                inclusive = false
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    isGuard = isGuardTab
                )
            }
        },
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.SPLASH,
            modifier = Modifier.padding(innerPadding)
        ) {
            // 1. Splash Landing
            composable(Routes.SPLASH) {
                SplashScreen(onNavigate = { targetRoute ->
                    navController.navigate(targetRoute) {
                        popUpTo(Routes.SPLASH) { inclusive = true }
                    }
                })
            }

            // 2. Authentication Login
            composable(Routes.LOGIN) {
                LoginScreen(onNavigate = { targetRoute ->
                    navController.navigate(targetRoute) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                })
            }

            // 2.5 Unauthorized Screen
            composable(Routes.UNAUTHORIZED) {
                UnauthorizedScreen(onBackToLogin = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(Routes.UNAUTHORIZED) { inclusive = true }
                    }
                })
            }

            // 3. Guard Dashboard & Subviews (Protected: GUARD only)
            composable(Routes.GUARD_DASHBOARD) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    GuardDashboardScreen(
                        onNavigate = { route -> navController.navigate(route) },
                        onLogout = {
                            AuthService.logout()
                            navController.navigate(Routes.LOGIN) {
                                popUpTo(Routes.GUARD_DASHBOARD) { inclusive = true }
                            }
                        }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED) {
                            popUpTo(Routes.GUARD_DASHBOARD) { inclusive = true }
                        }
                    }
                }
            }

            composable(Routes.ADD_VISITOR) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    AddVisitorScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.ADD_PARCEL) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    AddParcelScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.GUARD_PENDING_REQUESTS) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    GuardPendingRequestsScreen(onNavigate = { route -> navController.navigate(route) })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.SCAN_QR) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    ScanQrScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.VERIFY_OTP) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    VerifyOtpScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.INSIDE_VISITORS) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    InsideVisitorsScreen(onNavigate = { route -> navController.navigate(route) })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable("checkout_visitor/{visitorId}") { backStackEntry ->
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    val visitorId = backStackEntry.arguments?.getString("visitorId") ?: ""
                    CheckoutVisitorScreen(
                        visitorId = visitorId,
                        onBack = { navController.popBackStack() },
                        onCheckoutConfirmed = {
                            navController.navigate(Routes.INSIDE_VISITORS) {
                                popUpTo(Routes.INSIDE_VISITORS) { inclusive = true }
                            }
                        }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.PARCEL_RECORDS) {
                if (AuthService.getCurrentUser()?.role == "GUARD") {
                    ParcelRecordsScreen(
                        onNavigate = { route -> navController.navigate(route) },
                        onBack = { navController.popBackStack() }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            // 4. Resident Dashboard & Subviews (Protected: RESIDENT only)
            composable(Routes.RESIDENT_DASHBOARD) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    ResidentDashboardScreen(
                        onNavigate = { route -> navController.navigate(route) },
                        onLogout = {
                            AuthService.logout()
                            navController.navigate(Routes.LOGIN) {
                                popUpTo(Routes.RESIDENT_DASHBOARD) { inclusive = true }
                            }
                        }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED) {
                            popUpTo(Routes.RESIDENT_DASHBOARD) { inclusive = true }
                        }
                    }
                }
            }

            composable(Routes.VISITOR_REQUESTS) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    VisitorRequestsScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.PARCEL_REQUESTS) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    ParcelRequestsScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.ADD_EXPECTED_VISITOR) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    AddExpectedVisitorScreen(
                        onNavigateToPass = { otp, qrCode ->
                            navController.navigate("otp_qr_pass/$otp/$qrCode")
                        },
                        onBack = { navController.popBackStack() }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(
                route = "otp_qr_pass/{otp}/{qrCode}",
                arguments = listOf(
                    navArgument("otp") { type = NavType.StringType },
                    navArgument("qrCode") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    val otp = backStackEntry.arguments?.getString("otp") ?: ""
                    val qrCode = backStackEntry.arguments?.getString("qrCode") ?: ""
                    OtpQrPassScreen(
                        otp = otp,
                        qrCode = qrCode,
                        onBack = {
                            navController.navigate(Routes.RESIDENT_DASHBOARD) {
                                popUpTo(Routes.RESIDENT_DASHBOARD) { inclusive = false }
                            }
                        }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.MY_VISITORS) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    MyVisitorsScreen(
                        onNavigate = { route -> navController.navigate(route) },
                        onBack = { navController.popBackStack() }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.MY_PARCELS) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    MyParcelsScreen(
                        onNavigate = { route -> navController.navigate(route) },
                        onBack = { navController.popBackStack() }
                    )
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }

            composable(Routes.NOTIFICATION_HISTORY) {
                if (AuthService.getCurrentUser()?.role == "RESIDENT") {
                    NotificationHistoryScreen(onBack = { navController.popBackStack() })
                } else {
                    androidx.compose.runtime.LaunchedEffect(Unit) {
                        navController.navigate(Routes.UNAUTHORIZED)
                    }
                }
            }
        }
    }
}
