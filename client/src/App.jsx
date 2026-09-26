useEffect(() => {
  const loadProducts = async () => {
    setLoading(true);

    try {
      const url = new URL(
        'https://clothing-website-f40.vercel.app/api/products'
      );

      if (activeCategory && activeCategory !== 'All') {
        url.searchParams.set('category', activeCategory);
      }

      if (search.trim()) {
        url.searchParams.set('search', search.trim());
      }

      const response = await fetch(url.toString());

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products');
      }

      if (!Array.isArray(data)) {
        throw new Error('Products API did not return an array');
      }

      setProducts(data);

    } catch (error) {
      console.error('Products API Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [activeCategory, search]);