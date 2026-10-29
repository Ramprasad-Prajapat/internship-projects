package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.example.ui.TypingViewModel
import com.example.ui.components.BottomTabBar
import com.example.ui.screens.GameplayScreen
import com.example.ui.screens.LevelCompleteScreen
import com.example.ui.screens.LevelSelectionScreen
import com.example.ui.screens.LoginScreen
import com.example.ui.screens.MistakeReviewScreen
import com.example.ui.screens.ProfileSettingsScreen
import com.example.ui.screens.RewardsAchievementsScreen
import com.example.ui.screens.SelectModeScreen
import com.example.ui.screens.SplashScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.RegisterScreen
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                TypingRunnerApp(authManager = com.example.auth.AuthManager(this))
            }
        }
    }
}

@Composable
fun TypingRunnerApp(authManager: com.example.auth.AuthManager) {
    val navController = rememberNavController()
    // authManager is passed from MainActivity
    val viewModel: TypingViewModel = viewModel()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "splash"

    // Only display bottom navigation on core tab screens
    val tabScreens = listOf("home", "modes", "progress", "rewards", "profile")
    val showBottomBar = currentRoute in tabScreens

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            if (showBottomBar) {
                BottomTabBar(
                    activeTab = currentRoute,
                    onTabSelected = { selectedTab ->
                        if (currentRoute != selectedTab) {
                            navController.navigate(selectedTab) {
                                // Pop up to the start destination of the graph to
                                // avoid building up a large stack of destinations
                                popUpTo("home") {
                                    saveState = true
                                }
                                // Avoid multiple copies of the same destination when
                                // reselecting the same item
                                launchSingleTop = true
                                // Restore state when reselecting a previously selected item
                                restoreState = true
                            }
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "splash",
            modifier = Modifier.padding(innerPadding)
        ) {
            // 1. Splash Screen
            composable("splash") {
                SplashScreen(
                    authManager = authManager,
                    onNavigateNext = {
                        if (authManager.isLoggedIn()) {
                            viewModel.syncUserProgress()
                            navController.navigate("home") {
                                popUpTo("splash") { inclusive = true }
                            }
                        } else {
                            navController.navigate("login") {
                                popUpTo("splash") { inclusive = true }
                            }
                        }
                    }
                )
            }

            // 2. Login Screen
            composable("login") {
                    LoginScreen(
                        authManager = authManager,
                        onLoginSuccess = {
                            viewModel.syncUserProgress()
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        },
                        onRegisterClicked = { navController.navigate("register") }
                    )
            }

            // 3. Home Screen (Tab 1)
            composable("home") {
                HomeScreen(
                    viewModel = viewModel,
                    onStartGameClick = {
                        navController.navigate("modes")
                    },
                    onViewProgressClick = {
                        navController.navigate("progress")
                    }
                )
            }

            // 4. Game Select Mode Screen (Tab 2)
            composable("modes") {
                SelectModeScreen(
                    viewModel = viewModel,
                    onModeSelected = { mode ->
                        navController.navigate("levels/${mode.id}")
                    }
                )
            }

            // 5. Level Selection Screen
            composable(
                route = "levels/{modeId}",
                arguments = listOf(navArgument("modeId") { type = NavType.StringType })
            ) { backStackEntry ->
                val modeId = backStackEntry.arguments?.getString("modeId") ?: ""
                val mode = viewModel.modes.value.find { it.id == modeId }
                if (mode != null) {
                    viewModel.selectMode(mode)
                }
                LevelSelectionScreen(
                    viewModel = viewModel,
                    onLevelSelected = { level ->
                        navController.navigate("gameplay/$modeId/${level.id}")
                    }
                )
            }

            // Add Register route
            composable("register") {
                RegisterScreen(
                    authManager = authManager,
                    onRegisterSuccess = {
                        viewModel.syncUserProgress()
                        navController.navigate("home") {
                            popUpTo("register") { inclusive = true }
                        }
                    },
                    onNavigateLogin = { navController.navigate("login") { popUpTo("register") { inclusive = true } } }
                )
            }

            // 6. Gameplay Screen
            composable(
                route = "gameplay/{modeId}/{levelId}",
                arguments = listOf(
                    navArgument("modeId") { type = NavType.StringType },
                    navArgument("levelId") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val modeId = backStackEntry.arguments?.getString("modeId") ?: ""
                val levelId = backStackEntry.arguments?.getString("levelId") ?: ""
                
                LaunchedEffect(modeId, levelId) {
                    val level = viewModel.levelsList.value.find { it.id == levelId }
                    if (level != null) {
                        viewModel.selectLevel(level)
                    }
                    viewModel.startGameplaySession(modeId, levelId)
                }

                GameplayScreen(
                    viewModel = viewModel,
                    onGameplayFinished = {
                        navController.navigate("complete") {
                            popUpTo("gameplay/$modeId/$levelId") { inclusive = true }
                        }
                    },
                    onBackClick = {
                        navController.popBackStack()
                    }
                )
            }

            // 7. Level Complete Screen
            composable("complete") {
                LevelCompleteScreen(
                    viewModel = viewModel,
                    onNextLevelClick = {
                        navController.navigate("home") {
                            popUpTo("complete") { inclusive = true }
                        }
                    },
                    onReplayClick = {
                        viewModel.selectedLevel.value?.let { lvl ->
                            val modeId = viewModel.selectedMode.value?.id ?: ""
                            navController.navigate("gameplay/$modeId/${lvl.id}") {
                                popUpTo("complete") { inclusive = true }
                            }
                        }
                    },
                    onReviewErrorsClick = {
                        navController.navigate("progress") {
                            popUpTo("complete") { inclusive = true }
                        }
                    }
                )
            }

            // 8. Mistake Review Screen (Tab 3)
            composable("progress") {
                MistakeReviewScreen(
                    viewModel = viewModel,
                    onBackClick = {
                        navController.popBackStack()
                    }
                )
            }

            // 9. Rewards & Shop Screen (Tab 4)
            composable("rewards") {
                RewardsAchievementsScreen(
                    viewModel = viewModel
                )
            }

            // 10. Profile & Settings Screen (Accessible via gear or home profile clicks, let's mount settings on Profile)
            composable("profile") {
                ProfileSettingsScreen(
                    viewModel = viewModel,
                    onLogoutClick = {
                        authManager.logout()
                        navController.navigate("login") {
                            popUpTo(navController.graph.startDestinationId) { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}

