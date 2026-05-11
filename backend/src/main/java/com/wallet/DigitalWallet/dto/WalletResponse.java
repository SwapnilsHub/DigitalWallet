package com.wallet.DigitalWallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class WalletResponse {
    private String username;
    private BigDecimal balance;
}
