'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Loader2,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { getContents, getCategories, deleteCategory } from '@/components/content/index'
import { useContentStore } from '@/store/ContentStore'
import { AddCategory } from '@/components/content/add-category'
import { ContentCard } from '@/components/content/content-card'
import { AddContent } from '@/components/content/add-content'

export default function ContentPage() {
  const { 
    contents, 
    setContents, 
    categories, 
    setCategories,
    isLoading, 
    setLoading,
    setPreviousUrl  // Add this to destructuring
  } = useContentStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { user, isLoaded, isSignedIn } = useUser()
  const [isManageMode, setIsManageMode] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;
      setLoading(true);
      try {
        const [categoriesData, contentsData] = await Promise.all([
          getCategories(),
          getContents()
        ]);
        setCategories(categoriesData);
        setContents(contentsData);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, setContents, setCategories, setLoading]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      }
      return [...prev, categoryId]
    })
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      setContents(contents.map(content => ({
        ...content,
        categories: content.categories?.filter(cat => cat.categoryId !== categoryId)
      })));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategories.length === 0) return matchesSearch
    return matchesSearch && content.categories?.some(cat => selectedCategories.includes(cat.categoryId))
  })

  const renderCategoryButtons = () => (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center">
          <Button
            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
            onClick={() => handleCategorySelect(category.id)}
            className="flex items-center gap-2 h-8 text-sm font-medium transition-all duration-200 pr-2"
            style={{
              backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
              borderColor: category.color,
              color: selectedCategories.includes(category.id) ? '#fff' : 'inherit',
              opacity: selectedCategories.includes(category.id) ? 1 : 0.8,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
            {category.name}
          </Button>
          {isManageMode && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1 text-gray-400 hover:text-red-500"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search contents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <AddContent />
        </div>
      </div>

      {/* Category Management Section */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {renderCategoryButtons()}
          <Button
            variant="outline"
            size="sm"
            className="font-medium"
            onClick={() => setIsManageMode(!isManageMode)}
          >
            {isManageMode ? 'Done' : 'Manage Categories'}
          </Button>
          {isManageMode && (
            <AddCategory 
              onCategoryAdded={(newCategory) => {
                setCategories([...categories, newCategory])
              }} 
            />
          )}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredContents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onUpdate={(updatedContent) => {
                setContents(contents.map(c => 
                  c.id === updatedContent.id ? updatedContent : c
                ))
              }}
              onDelete={(id) => {
                setContents(contents.filter(c => c.id !== id))
              }}
              setPreviousUrl={setPreviousUrl}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredContents.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No contents found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}