package com.wallet.DigitalWallet.service;

import com.wallet.DigitalWallet.entity.Transaction;
import com.wallet.DigitalWallet.entity.User;
import com.wallet.DigitalWallet.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    public void logTransaction(User user, String type, BigDecimal amount, BigDecimal currentBalance, String description) {
        logger.debug("Logging transaction - User: {}, Type: {}, Amount: {}", user.getUsername(), type, amount);
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setCurrentBalance(currentBalance);
        transaction.setDescription(description);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);
        
        logger.debug("Transaction logged successfully with ID: {}", transaction.getId());
    }

    public List<Transaction> getTransactionHistory(User user) {
        logger.debug("Fetching transaction history for user: {}", user.getUsername());
        List<Transaction> transactions = transactionRepository.findByUserOrderByTimestampDesc(user);
        logger.debug("Found {} transactions for user: {}", transactions.size(), user.getUsername());
        return transactions;
    }
}
