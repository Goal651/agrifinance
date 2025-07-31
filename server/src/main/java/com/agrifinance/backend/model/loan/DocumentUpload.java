package com.agrifinance.backend.model.loan;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentUpload {
    private String idPhoto;
    private String proofOfIncome;
    private String farmOwnershipDocuments;
    private String cooperativeMembership;
    
    @ElementCollection
    @CollectionTable(name = "loan_tree_images", joinColumns = @JoinColumn(name = "loan_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> treeImages = new ArrayList<>();
}
