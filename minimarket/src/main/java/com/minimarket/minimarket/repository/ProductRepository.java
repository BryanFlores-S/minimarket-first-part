package com.minimarket.minimarket.repository;

import com.minimarket.minimarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Ready for the search bar in the next phase:
    List<Product> findByNameContainingIgnoreCase(String name);
}