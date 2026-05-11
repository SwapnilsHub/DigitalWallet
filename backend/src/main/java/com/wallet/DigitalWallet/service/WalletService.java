package com.wallet.DigitalWallet.service;

import com.wallet.DigitalWallet.entity.User;
import com.wallet.DigitalWallet.entity.Wallet;
import com.wallet.DigitalWallet.exception.InsufficientBalanceException;
import com.wallet.DigitalWallet.exception.WalletNotFoundException;
import com.wallet.DigitalWallet.repository.WalletRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class WalletService {

    private static final Logger logger = LoggerFactory.getLogger(WalletService.class);

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    private final ConcurrentHashMap<Long, ReentrantLock> locks = new ConcurrentHashMap<>();

    private ReentrantLock getLock(Long walletId) {
        return locks.computeIfAbsent(walletId, k -> new ReentrantLock());
    }

    public Wallet createWallet(User user) {
        logger.info("Creating wallet for user: {}", user.getUsername());
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        Wallet savedWallet = walletRepository.save(wallet);
        logger.info("Wallet created successfully with ID: {}", savedWallet.getId());
        return savedWallet;
    }

    public Wallet getWallet(User user) {
        logger.debug("Fetching wallet for user: {}", user.getUsername());
        return walletRepository.findByUser(user)
                .orElseThrow(() -> {
                    logger.error("Wallet not found for user: {}", user.getUsername());
                    return new WalletNotFoundException("Wallet not found for user: " + user.getUsername());
                });
    }

    @Transactional
    public void addMoney(User user, BigDecimal amount) {
        logger.info("Adding money to wallet - User: {}, Amount: {}", user.getUsername(), amount);
        
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            logger.warn("Invalid amount for add money: {}", amount);
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Wallet wallet = getWallet(user);
        ReentrantLock lock = getLock(wallet.getId());

        lock.lock();
        try {
            // Re-fetch to get latest balance after acquiring lock
            wallet = getWallet(user);
            BigDecimal oldBalance = wallet.getBalance();
            wallet.setBalance(wallet.getBalance().add(amount));
            walletRepository.save(wallet);
            
            logger.info("Money added successfully - User: {}, Old Balance: {}, Amount: {}, New Balance: {}", 
                user.getUsername(), oldBalance, amount, wallet.getBalance());
            
            transactionService.logTransaction(user, "CREDIT", amount, wallet.getBalance(), "Money Added");
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public void sendMoney(User sender, User receiver, BigDecimal amount) {
        logger.info("Initiating money transfer - From: {}, To: {}, Amount: {}", 
            sender.getUsername(), receiver.getUsername(), amount);
        
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            logger.warn("Invalid amount for transfer: {}", amount);
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (sender.getId().equals(receiver.getId())) {
            logger.warn("User attempting to send money to themselves: {}", sender.getUsername());
            throw new IllegalArgumentException("Cannot send money to yourself");
        }

        Wallet senderWallet = getWallet(sender);
        Wallet receiverWallet = getWallet(receiver);

        // Lock ordering to prevent deadlocks
        ReentrantLock lock1 = getLock(Math.min(senderWallet.getId(), receiverWallet.getId()));
        ReentrantLock lock2 = getLock(Math.max(senderWallet.getId(), receiverWallet.getId()));

        lock1.lock();
        lock2.lock();
        try {
            senderWallet = getWallet(sender);
            receiverWallet = getWallet(receiver);

            if (senderWallet.getBalance().compareTo(amount) < 0) {
                logger.warn("Insufficient balance for transfer - User: {}, Balance: {}, Required: {}", 
                    sender.getUsername(), senderWallet.getBalance(), amount);
                throw new InsufficientBalanceException(
                    "Insufficient balance. Current balance: " + senderWallet.getBalance() + ", Required: " + amount);
            }

            senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
            receiverWallet.setBalance(receiverWallet.getBalance().add(amount));

            walletRepository.save(senderWallet);
            walletRepository.save(receiverWallet);

            logger.info("Money transferred successfully - From: {}, To: {}, Amount: {}", 
                sender.getUsername(), receiver.getUsername(), amount);

            transactionService.logTransaction(sender, "DEBIT", amount, senderWallet.getBalance(), 
                "Sent to " + receiver.getUsername());
            transactionService.logTransaction(receiver, "CREDIT", amount, receiverWallet.getBalance(), 
                "Received from " + sender.getUsername());

        } finally {
            lock2.unlock();
            lock1.unlock();
        }
    }
}
