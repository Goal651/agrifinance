package com.agrifinance.backend.dto.loan;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PersonalInfoDTO {
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
