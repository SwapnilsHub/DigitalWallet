package com.wallet.DigitalWallet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Digital Wallet API is running");
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("endpoints", Map.of(
            "POST", "/api/auth/register, /api/auth/login, /api/wallet/add, /api/wallet/send",
            "GET", "/api/wallet/balance, /api/transactions"
        ));
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "Digital Wallet Backend");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
}
