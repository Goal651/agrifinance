package com.agrifinance.backend.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class LoanUtil {
    // Calculate fixed monthly payment for a loan
    public double calculateMonthlyPayment(double amount, double annualInterestRate, int termMonths) {
        double monthlyRate = annualInterestRate / 12.0 / 100.0;
        if (monthlyRate == 0) {
            return amount / termMonths;
        }
        return (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    // Example: Generate a payment schedule (list of monthly payments)
    public List<Double> generatePaymentSchedule(double amount, double annualInterestRate, int termMonths) {
        double monthlyPayment = calculateMonthlyPayment(amount, annualInterestRate, termMonths);
        List<Double> schedule = new ArrayList<>();
        for (int i = 0; i < termMonths; i++) {
            schedule.add(monthlyPayment);
        }
        return schedule;
    }

}
