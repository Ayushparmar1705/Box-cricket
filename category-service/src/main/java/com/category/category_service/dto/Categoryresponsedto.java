package com.category.category_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Categoryresponsedto {
    private int id;
    private String category_name;
    private boolean active;
}
