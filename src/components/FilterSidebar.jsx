import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./FilterSidebar.css";

const FilterSidebar = ({
  filters,
  onFilterChange,
  isMobileOpen,
  onCloseMobile,
  propertyTypes,
  allFeatures,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.priceMin,
    filters.priceMax,
  ]);

  const [localSizeMin, setLocalSizeMin] = useState(
    filters.sizeMin !== null && filters.sizeMin !== undefined
      ? filters.sizeMin.toString()
      : ""
  );
  const [localSizeMax, setLocalSizeMax] = useState(
    filters.sizeMax !== null && filters.sizeMax !== undefined
      ? filters.sizeMax.toString()
      : ""
  );

  useEffect(() => {
    setLocalPriceRange([filters.priceMin, filters.priceMax]);
  }, [filters.priceMin, filters.priceMax]);

  useEffect(() => {
    const newMinValue =
      filters.sizeMin === null || filters.sizeMin === undefined
        ? ""
        : filters.sizeMin.toString();
    if (localSizeMin !== newMinValue) {
      setLocalSizeMin(newMinValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sizeMin]);

  useEffect(() => {
    const newMaxValue =
      filters.sizeMax === null || filters.sizeMax === undefined
        ? ""
        : filters.sizeMax.toString();
    if (localSizeMax !== newMaxValue) {
      setLocalSizeMax(newMaxValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sizeMax]);

  const handleTypeChange = (type) => {
    if (type === "All") {
      onFilterChange({
        ...filters,
        types: ["All"],
        selectedTypes: [],
      });
    } else {
      const newTypes = filters.selectedTypes.includes(type)
        ? filters.selectedTypes.filter((t) => t !== type)
        : [...filters.selectedTypes, type];

      onFilterChange({
        ...filters,
        types: newTypes.length === 0 ? ["All"] : newTypes,
        selectedTypes: newTypes,
      });
    }
  };

  const handleFeatureToggle = (feature) => {
    const newFeatures = filters.selectedFeatures.includes(feature)
      ? filters.selectedFeatures.filter((f) => f !== feature)
      : [...filters.selectedFeatures, feature];

    onFilterChange({
      ...filters,
      selectedFeatures: newFeatures,
    });
  };

  const handlePriceChange = (value) => {
    setLocalPriceRange(value);
    onFilterChange({
      ...filters,
      priceMin: value[0],
      priceMax: value[1],
    });
  };

  const handlePriceInputChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      const newRange = [
        Math.max(100, Math.min(numValue, localPriceRange[1])),
        localPriceRange[1],
      ];
      setLocalPriceRange(newRange);
      onFilterChange({ ...filters, priceMin: newRange[0] });
    } else {
      const newRange = [
        localPriceRange[0],
        Math.min(10000, Math.max(numValue, localPriceRange[0])),
      ];
      setLocalPriceRange(newRange);
      onFilterChange({ ...filters, priceMax: newRange[1] });
    }
  };

  const handleSizeInputChange = (type, value) => {
    if (type === "min") {
      setLocalSizeMin(value);
    } else {
      setLocalSizeMax(value);
    }

    if (value === "" || value.trim() === "") {
      onFilterChange({
        ...filters,
        sizeMin: type === "min" ? null : filters.sizeMin,
        sizeMax: type === "max" ? null : filters.sizeMax,
      });
      return;
    }

    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
      return;
    }

    const currentMin = type === "min" ? numValue : filters.sizeMin ?? null;
    const currentMax = type === "max" ? numValue : filters.sizeMax ?? null;

    if (type === "min" && currentMax !== null && numValue > currentMax) {
      return;
    }
    if (type === "max" && currentMin !== null && numValue < currentMin) {
      return;
    }

    onFilterChange({
      ...filters,
      sizeMin: type === "min" ? numValue : filters.sizeMin,
      sizeMax: type === "max" ? numValue : filters.sizeMax,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      types: ["All"],
      selectedTypes: [],
      priceMin: 100,
      priceMax: 10000,
      sizeMin: null,
      sizeMax: null,
      selectedFeatures: [],
    });
    setLocalPriceRange([100, 10000]);
  };

  const hasActiveFilters =
    filters.selectedTypes.length > 0 ||
    filters.priceMin !== 100 ||
    filters.priceMax !== 10000 ||
    filters.sizeMin !== null ||
    filters.sizeMax !== null ||
    filters.selectedFeatures.length > 0;

  return (
    <>
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`filter-sidebar ${isMobileOpen ? "mobile-open" : ""}`}
        role="complementary"
        aria-label="Property filters"
      >
        <div className="filter-header">
          <h2>Filter</h2>
          {isMobileOpen && (
            <button
              className="close-mobile-btn"
              onClick={onCloseMobile}
              aria-label="Close filters"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">Type of Place</h3>
          <div
            className="checkbox-group"
            role="group"
            aria-label="Property type filter"
          >
            {propertyTypes.map((type) => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={
                    type === "All"
                      ? filters.types.includes("All")
                      : filters.selectedTypes.includes(type)
                  }
                  onChange={() => handleTypeChange(type)}
                  className="checkbox-input"
                  aria-label={`Filter by ${type}`}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">Price Range</h3>
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="price-min" className="sr-only">
                Minimum price
              </label>
              <span className="price-prefix">$</span>
              <input
                id="price-min"
                type="number"
                min="100"
                max="10000"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceInputChange("min", e.target.value)}
                className="price-input"
                aria-label="Minimum price"
              />
            </div>
            <div className="price-input-group">
              <label htmlFor="price-max" className="sr-only">
                Maximum price
              </label>
              <span className="price-prefix">$</span>
              <input
                id="price-max"
                type="number"
                min="100"
                max="10000"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceInputChange("max", e.target.value)}
                className="price-input"
                aria-label="Maximum price"
              />
            </div>
          </div>
          <div className="slider-container">
            <Slider
              range
              min={100}
              max={10000}
              step={100}
              value={localPriceRange}
              onChange={handlePriceChange}
              trackStyle={[{ backgroundColor: "#22c55e", height: 6 }]}
              handleStyle={[
                {
                  backgroundColor: "#22c55e",
                  borderColor: "#22c55e",
                  width: 20,
                  height: 20,
                  marginTop: -7,
                },
                {
                  backgroundColor: "#22c55e",
                  borderColor: "#22c55e",
                  width: 20,
                  height: 20,
                  marginTop: -7,
                },
              ]}
              railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
            />
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">Size</h3>
          <div className="size-inputs">
            <div className="size-input-group">
              <label htmlFor="size-min" className="size-label">
                Min sq ft
              </label>
              <input
                id="size-min"
                type="number"
                min="0"
                value={localSizeMin}
                onChange={(e) => handleSizeInputChange("min", e.target.value)}
                className="size-input"
                placeholder="Min"
                aria-label="Minimum square footage"
              />
            </div>
            <div className="size-input-group">
              <label htmlFor="size-max" className="size-label">
                Max sq ft
              </label>
              <input
                id="size-max"
                type="number"
                min="0"
                value={localSizeMax}
                onChange={(e) => handleSizeInputChange("max", e.target.value)}
                className="size-input"
                placeholder="Max"
                aria-label="Maximum square footage"
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section-title">Features</h3>
          <div
            className="checkbox-group"
            role="group"
            aria-label="Property features filter"
          >
            {allFeatures.map((feature) => (
              <label key={feature} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="checkbox-input"
                  aria-label={`Filter by ${feature}`}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </aside>
    </>
  );
};

export default FilterSidebar;
