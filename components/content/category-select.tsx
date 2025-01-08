import { Category } from '@/types/category'

interface CategorySelectProps {
  categories: Category[]
  selectedCategories: string[]
  onSelect: (categoryId: string) => void
}

export function CategorySelect({ categories, selectedCategories, onSelect }: CategorySelectProps) {
  if (!categories?.length) {
    return <div className="text-sm text-gray-500">No categories available</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200`}
          style={{
            backgroundColor: selectedCategories.includes(category.id) 
              ? category.color 
              : `${category.color}20`,
            color: selectedCategories.includes(category.id) 
              ? '#fff' 
              : category.color,
            border: `1px solid ${category.color}`,
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
