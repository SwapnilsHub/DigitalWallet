package com.wallet.DigitalWallet.controller;

import com.wallet.DigitalWallet.dto.AddMoneyRequest;
import com.wallet.DigitalWallet.dto.MoneyTransferRequest;
import com.wallet.DigitalWallet.dto.WalletResponse;
import com.wallet.DigitalWallet.entity.User;
import com.wallet.DigitalWallet.entity.Wallet;
import com.wallet.DigitalWallet.exception.UserNotFoundException;
import com.wallet.DigitalWallet.repository.UserRepository;
import com.wallet.DigitalWallet.service.WalletService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new UserNotFoundException("User not found: " + username);
                });
    }

    @GetMapping("/balance")
    public ResponseEntity<WalletResponse> getBalance(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        logger.debug("Fetching balance for user: {}", user.getUsername());
        Wallet wallet = walletService.getWallet(user);
        return ResponseEntity.ok(new WalletResponse(user.getUsername(), wallet.getBalance()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMoney(@Valid @RequestBody AddMoneyRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        logger.info("Add money request - User: {}, Amount: {}", user.getUsername(), request.getAmount());
        walletService.addMoney(user, request.getAmount());
        return ResponseEntity.ok("Money added successfully");
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMoney(@Valid @RequestBody MoneyTransferRequest request, Authentication authentication) {
        User sender = getAuthenticatedUser(authentication);
        User receiver = userRepository.findByUsername(request.getToUsername())
                .orElseThrow(() -> {
                    logger.error("Receiver not found: {}", request.getToUsername());
                    return new UserNotFoundException("Receiver not found: " + request.getToUsername());
                });

        logger.info("Send money request - From: {}, To: {}, Amount: {}", 
            sender.getUsername(), receiver.getUsername(), request.getAmount());
        walletService.sendMoney(sender, receiver, request.getAmount());
        return ResponseEntity.ok("Money transferred successfully");
    }
}
