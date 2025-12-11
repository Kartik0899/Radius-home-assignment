import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "./components/PropertyCard";
import FilterSidebar from "./components/FilterSidebar";
import EmptyState from "./components/EmptyState";
import propertiesData from "./data/properties.json";
import "./App.css";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [properties] = useState(propertiesData);

  const [filters, setFilters] = useState(() => {
    const types = searchParams.get("types")?.split(",") || ["All"];
    const selectedTypes = types.includes("All") ? [] : types;
    const priceMin = parseInt(searchParams.get("priceMin")) || 100;
    const priceMax = parseInt(searchParams.get("priceMax")) || 10000;
    const sizeMin = searchParams.get("sizeMin")
      ? parseInt(searchParams.get("sizeMin"))
      : null;
    const sizeMax = searchParams.get("sizeMax")
      ? parseInt(searchParams.get("sizeMax"))
      : null;
    const features = searchParams.get("features")?.split(",") || [];

    return {
      types: types.includes("All") ? ["All"] : types,
      selectedTypes,
      priceMin,
      priceMax,
      sizeMin,
      sizeMax,
      selectedFeatures: features,
    };
  });

  const propertyTypes = useMemo(() => {
    const types = ["All", ...new Set(properties.map((p) => p.type))];
    return types;
  }, [properties]);

  const allFeatures = useMemo(() => {
    const featuresSet = new Set();
    properties.forEach((p) => {
      p.features.forEach((f) => featuresSet.add(f));
    });
    return Array.from(featuresSet).sort();
  }, [properties]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.selectedTypes.length > 0) {
      params.set("types", filters.selectedTypes.join(","));
    }

    if (filters.priceMin !== 100) {
      params.set("priceMin", filters.priceMin.toString());
    }

    if (filters.priceMax !== 10000) {
      params.set("priceMax", filters.priceMax.toString());
    }

    if (filters.sizeMin !== null) {
      params.set("sizeMin", filters.sizeMin.toString());
    }

    if (filters.sizeMax !== null) {
      params.set("sizeMax", filters.sizeMax.toString());
    }

    if (filters.selectedFeatures.length > 0) {
      params.set("features", filters.selectedFeatures.join(","));
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Filter by type
    if (filters.selectedTypes.length > 0) {
      filtered = filtered.filter((p) => filters.selectedTypes.includes(p.type));
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Filter by size
    if (filters.sizeMin !== null) {
      filtered = filtered.filter((p) => p.size >= filters.sizeMin);
    }
    if (filters.sizeMax !== null) {
      filtered = filtered.filter((p) => p.size <= filters.sizeMax);
    }

    // Filter by features
    if (filters.selectedFeatures.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedFeatures.every((feature) =>
          p.features.includes(feature)
        )
      );
    }

    return filtered;
  }, [properties, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    const rafId = requestAnimationFrame(() => {
      setIsLoading(true);
    });

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      types: ["All"],
      selectedTypes: [],
      priceMin: 100,
      priceMax: 10000,
      sizeMin: null,
      sizeMax: null,
      selectedFeatures: [],
    });
  };

  const handleMobileFilterToggle = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleCloseMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Property Search</h1>
        <button
          className="mobile-filter-toggle"
          onClick={handleMobileFilterToggle}
          aria-label="Toggle filters"
          aria-expanded={isMobileFilterOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      <div className="app-content">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={handleCloseMobileFilter}
          propertyTypes={propertyTypes}
          allFeatures={allFeatures}
        />

        <main className="properties-section" role="main">
          <div className="results-header">
            <h2 className="results-count">
              {isLoading ? (
                <span className="loading-skeleton-text">Loading...</span>
              ) : (
                `${filteredProperties.length} Results in San Francisco`
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="properties-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="property-skeleton" aria-hidden="true">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
