"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { X } from "lucide-react"; // Remove icon

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    const ids = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("fav-") && localStorage.getItem(key) === "true") {
        const id = key.replace("fav-", "");
        ids.push(id);
      }
    }
    if (ids.length === 0) {
      setFavorites([]);
      return;
    }
    fetchAll(ids);
  }

  async function fetchAll(ids) {
    const products = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        return await res.json();
      })
    );
    setFavorites(products);
  }

  function toggleFavorite(id) {
    localStorage.setItem(`fav-${id}`, "false");
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.amount = (existing.amount || 1) + 1;
    } else {
      cart.push({ id: product.id, price: product.price, amount: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (favorites.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        No favorite products yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="relative grid grid-rows-[1fr_auto] bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
           
            {/* ❌ REMOVE BUTTON */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="absolute top-3 right-3 z-20"
            >
              <X size={26} stroke="black" className="hover:text-red-600 transition" />
            </button>

            {/* PRODUCT LINK */}
            <Link href={`/products/${product.id}`} className="grid grid-rows-[auto_1fr_auto_auto] gap-2">
              <div className="relative w-full h-48 rounded-xl overflow-hidden row-start-1 row-end-2">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-contain rounded"
                />
              </div>

              <h2 className="text-xl font-semibold row-start-2 row-end-3">{product.title}</h2>
              <p className="text-gray-500 text-sm row-start-3 row-end-4">{product.brand}</p>
              <p className="font-bold text-lg row-start-4 row-end-5">${product.price}</p>
            </Link>

            {/* ADD TO CART BUTTON */}
            <Button
              className="!w-full !h-fit mt-3 !p-1"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
            >
              ADD
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
