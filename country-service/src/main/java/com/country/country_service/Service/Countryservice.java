package com.country.country_service.Service;

import com.country.country_service.Model.Countrymodel;
import com.country.country_service.Repositry.Countryrepositry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Countryservice {
    private Countryrepositry rep;

    public Countryservice(Countryrepositry rep) {
        this.rep = rep;
    }

    public Countrymodel Addcountry(Countrymodel obj) {
        Countrymodel result = rep.save(obj);
        return result;
    }

    public List<Countrymodel> viewCountry() {
        List<Countrymodel> list = rep.findAll();
        return list;
    }

    public int changeStatus(Long id) {
        Countrymodel result = rep.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
        if (result.isActive()) {
            result.setActive(false);
            rep.save(result);
            return 0;
        } else {
            result.setActive(true);
            rep.save(result);
            return 1;
        }
    }
}
