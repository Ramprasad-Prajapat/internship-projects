package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.ViewModelProvider
import com.example.game.GameViewModel
import com.example.ui.SaveTheBalloonApp
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Standard instantiation since GameViewModel handles its own dependencies internally
        val viewModel = ViewModelProvider(this)[GameViewModel::class.java]

        setContent {
            MyApplicationTheme {
                SaveTheBalloonApp(viewModel = viewModel)
            }
        }
    }
}
