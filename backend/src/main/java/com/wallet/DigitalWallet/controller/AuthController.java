package com.wallet.DigitalWallet.controller;

import com.wallet.DigitalWallet.dto.AuthRequest;
import com.wallet.DigitalWallet.dto.AuthResponse;
import com.wallet.DigitalWallet.entity.User;
import com.wallet.DigitalWallet.exception.UserAlreadyExistsException;
import com.wallet.DigitalWallet.repository.UserRepository;
import com.wallet.DigitalWallet.security.JwtUtil;
import com.wallet.DigitalWallet.service.WalletService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WalletService walletService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest authRequest) {
        logger.info("Registration attempt for username: {}", authRequest.getUsername());
        
        if (userRepository.existsByUsername(authRequest.getUsername())) {
            logger.warn("Registration failed - Username already exists: {}", authRequest.getUsername());
            throw new UserAlreadyExistsException("Username is already taken!");
        }

        User user = new User();
        user.setUsername(authRequest.getUsername());
        user.setPassword(passwordEncoder.encode(authRequest.getPassword()));

        User savedUser = userRepository.save(user);
        
        // Auto-create wallet on registration
        walletService.createWallet(savedUser);

        logger.info("User registered successfully: {}", authRequest.getUsername());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        logger.info("Login attempt for username: {}", authRequest.getUsername());
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        final String jwt = jwtUtil.generateToken(authRequest.getUsername());
        
        logger.info("Login successful for username: {}", authRequest.getUsername());
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
