package com.minimarket.minimarket.controller;

import com.minimarket.minimarket.model.Product;
import com.minimarket.minimarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/")
public class ProductViewController {

    private final ProductService productService;

    @Autowired
    public ProductViewController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public String index(Model model) {
        List<Product> products = productService.getAllProducts();
        model.addAttribute("products", products);
        model.addAttribute("productForm", new Product());
        return "index";
    }

    @PostMapping("/products/save")
    public String saveProduct(@ModelAttribute("productForm") Product product) {
        if (product.getId() != null) {
            productService.updateProduct(product.getId(), product);
        } else {
            productService.createProduct(product);
        }
        return "redirect:/";
    }

    @GetMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "redirect:/";
    }
}