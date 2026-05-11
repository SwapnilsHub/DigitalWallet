package com.wallet.DigitalWallet.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private String type;
    private BigDecimal amount;
    private BigDecimal currentBalance;
    private String description;
    private LocalDateTime timestamp;
}
