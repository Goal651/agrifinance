package com.agrifinance.backend.dto.loan;

import lombok.Data;
import java.util.List;

@Data
public class DocumentUploadDTO {
    private String idPhoto;
    private String proofOfIncome;
    private String farmOwnershipDocuments;
    private String cooperativeMembership;
    private List<String> treeImages;
}
