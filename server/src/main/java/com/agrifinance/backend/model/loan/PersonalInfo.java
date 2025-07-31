package com.agrifinance.backend.model.loan;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalInfo {
    private String firstName;
    private String lastName;
    private String idNumber;
    private LocalDate dateOfBirth;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
