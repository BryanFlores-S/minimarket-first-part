package com.minimarket.minimarket.repository;

import com.minimarket.minimarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Preparado para la barra de búsqueda de la siguiente fase:
    List<Product> findByNameContainingIgnoreCase(String name);
}