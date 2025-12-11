import './EmptyState.css';

const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <svg 
        className="empty-state-icon"
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
        <line x1="12" y1="10" x2="12" y2="4"></line>
        <line x1="12" y1="10" x2="8" y2="8"></line>
        <line x1="12" y1="10" x2="16" y2="8"></line>
      </svg>
      <h3 className="empty-state-title">No properties found</h3>
      <p className="empty-state-message">
        Try adjusting your filters to see more results.
      </p>
      {onClearFilters && (
        <button 
          className="empty-state-button"
          onClick={onClearFilters}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;

