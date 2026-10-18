package com.category.category_service.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private String code;
    private String message;
    private Object data;

    public ApiResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
