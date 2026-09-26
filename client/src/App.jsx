
useEffect(() => {
  const loadProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://clothing-website-f40.vercel.app/api/products?category=${encodeURIComponent(activeCategory)}&search=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error('Failed to load products');
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error('Products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [activeCategory, search]);