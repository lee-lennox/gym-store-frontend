# Backend: Add Product Stock Decrease Endpoint

Add this endpoint to your **ProductController.java**:

```java
@PatchMapping("/{id}/decrease-stock")
public ResponseEntity<Product> decreaseStock(
        @PathVariable Integer id,
        @RequestBody Map<String, Integer> request) {
    
    Integer quantity = request.get("quantity");
    
    if (quantity == null || quantity <= 0) {
        return ResponseEntity.badRequest().build();
    }
    
    Optional<Product> productOpt = productService.findById(id);
    if (productOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    
    Product product = productOpt.get();
    
    // Check if enough stock available
    if (product.getStock() < quantity) {
        return ResponseEntity.badRequest().build();
    }
    
    // Decrease stock
    product.setStock(product.getStock() - quantity);
    Product updated = productService.update(product);
    
    return ResponseEntity.ok(updated);
}
```

## Important Notes:

1. Make sure your **Product** entity has a `stock` field (Integer)
2. The endpoint will:
   - Receive productId and quantity
   - Check if enough stock exists
   - Decrease the stock by the quantity
   - Return the updated product

3. This endpoint is automatically called when a customer completes checkout
4. Stock will be decreased for each product in the order

## Security Configuration

Make sure this endpoint is accessible to BUYER and ADMIN roles in **SecurityConfig.java**:

```java
.requestMatchers(HttpMethod.PATCH, "/products/*/decrease-stock").hasAnyAuthority("BUYER", "ADMIN")
```

Or since you already have:
```java
.requestMatchers(HttpMethod.GET, "/products/**").permitAll()
```

You can add:
```java
.requestMatchers(HttpMethod.PATCH, "/products/**").authenticated()
```
