package com.category.category_service.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.category.category_service.Entity.Categoryentity;
import com.category.category_service.Repositry.Categoryrepositry;
import com.category.category_service.dto.Categoryrequestdto;
import com.category.category_service.exception.DuplicateResourceException;

@Service
public class Categoryservice {
    private final Categoryrepositry rep;

    public Categoryservice(Categoryrepositry rep) {
        this.rep = rep;
    }

    public Categoryentity createCategory(Categoryrequestdto dto) {
        Categoryentity entity = new Categoryentity();
        entity.setCategory_name(dto.getCategory_name());
        boolean isExists = rep.existsByName(dto.getCategory_name());
        if (isExists) {
            throw new DuplicateResourceException("Category already exists");
        }
        return rep.save(entity);
    }

    public List<Categoryentity> viewCategory() {
        List<Categoryentity> result = rep.findAll();
        if (result.size() > 0) {
            return result;
        } else {
            return null;
        }
    }

    public Categoryentity categoryStatus(int id, String status) {
        Categoryentity result = rep.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        result.setActive("Active".equalsIgnoreCase(status));
        return rep.save(result);
    }

    public Categoryentity getCategoryById(int id) {
        Categoryentity result = rep.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        return result;
    }
}
