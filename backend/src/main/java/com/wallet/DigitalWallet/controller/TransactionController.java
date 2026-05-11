package com.wallet.DigitalWallet.controller;

import com.wallet.DigitalWallet.dto.TransactionDto;
import com.wallet.DigitalWallet.entity.Transaction;
import com.wallet.DigitalWallet.entity.User;
import com.wallet.DigitalWallet.exception.UserNotFoundException;
import com.wallet.DigitalWallet.repository.UserRepository;
import com.wallet.DigitalWallet.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getTransactions(Authentication authentication) {
        String username = authentication.getName();
        logger.debug("Fetching transactions for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new UserNotFoundException("User not found: " + username);
                });

        List<Transaction> transactions = transactionService.getTransactionHistory(user);

        List<TransactionDto> dtos = transactions.stream().map(t -> {
            TransactionDto dto = new TransactionDto();
            dto.setId(t.getId());
            dto.setType(t.getType());
            dto.setAmount(t.getAmount());
            dto.setCurrentBalance(t.getCurrentBalance());
            dto.setDescription(t.getDescription());
            dto.setTimestamp(t.getTimestamp());
            return dto;
        }).collect(Collectors.toList());

        logger.debug("Returning {} transactions for user: {}", dtos.size(), username);
        return ResponseEntity.ok(dtos);
    }
}
