import { Category } from '@/types/category'
import { Button } from '@/components/ui/button'

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
        <Button
          key={category.id}
          variant={selectedCategories.includes(category.id) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSelect(category.id)
          }}
          className="flex items-center gap-2 h-8 text-sm"
          style={{
            backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
            borderColor: category.color,
            color: selectedCategories.includes(category.id) ? '#fff' : 'inherit',
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </Button>
      ))}
    </div>
  )
}
