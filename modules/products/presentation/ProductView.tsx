"use client";

import { useEffect, useState } from "react";
import { Product } from "../domain/product";
import { ProductRepository } from "../infrastructure/productRepository";
import { GetProduct } from "../application/getProduct";

export default function ProductView({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const repo = new ProductRepository();
        const getProduct = new GetProduct(repo);
        const result = await getProduct.execute(productId);
        setProduct(result);
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-card">
      <h3>Product Information</h3>
      <p><strong>ID:</strong> {product.id}</p>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
    </div>
  );
}
