package com.category.category_service.Mapper;

import com.category.category_service.Entity.Categoryentity;
import com.category.category_service.dto.Categoryrequestdto;
import com.category.category_service.dto.Categoryresponsedto;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public Categoryentity toEntity(Categoryrequestdto dto){
        return Categoryentity.builder()
                .category_name(dto.getCategory_name()).build();
    }

}
