import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';

// Category icon fallback colors
const catColors = [
  '#2874f0', '#ff6f61', '#e91e63', '#4caf50', '#ff9800',
  '#9c27b0', '#00bcd4', '#795548', '#607d8b', '#3f51b5',
];

function CategoryStrip({ categories = [], isLoading = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="market-card rounded-[2px]">
        <div className="category-strip">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="category-strip-item">
              <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: 60, height: 12 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="market-card rounded-[2px]">
      <div className="category-strip">
        {categories.map((category, i) => {
          // Use smaller image URL for faster loading (128px instead of 800px)
          const imageUrl = category.imageUrl
            ? category.imageUrl.replace(/w=\d+/, 'w=128').replace(/q=\d+/, 'q=40')
            : null;

          return (
            <button
              key={category.id}
              type="button"
              className="category-strip-item"
              onClick={() => navigate(`${ROUTES.products}?categoryId=${category.id}`)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={category.name}
                  loading="eager"
                  onError={(e) => {
                    // Fallback to colored circle with initial
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white text-lg font-bold ${imageUrl ? 'hidden' : ''}`}
                style={{ background: catColors[i % catColors.length] }}
              >
                {category.name.charAt(0)}
              </div>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryStrip;
