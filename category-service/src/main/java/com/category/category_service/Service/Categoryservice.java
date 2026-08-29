package com.category.category_service.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.category.category_service.Entity.Categoryentity;
import com.category.category_service.Repositry.Categoryrepositry;

@Service
public class Categoryservice {
    Categoryrepositry rep;

    public Categoryservice(Categoryrepositry rep) {
        this.rep = rep;
    }

    public Categoryentity createCategory(Categoryentity cat) {
        boolean isExists = rep.existsByName(cat.getCategory_name());
        if (isExists) {
            return null;
        }
        return rep.save(cat);
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


    public Categoryentity getCategoryById(int id){
        Categoryentity result = rep.findById(id).orElseThrow(()->new RuntimeException("Category not found"));
        return result;
    }
}
