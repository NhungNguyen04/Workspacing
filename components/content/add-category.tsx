import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { createCategory, createTeamspaceCategory } from './index';
import { toast } from 'react-toastify';
import { Category } from '@/types/category';
import './color-picker.css';
import { useContentStore } from '@/store/ContentStore';
import { useParams } from 'next/navigation';

interface AddCategoryProps {
    onCategoryAdded: (category: Category) => void;
}

export function AddCategory({ onCategoryAdded }: AddCategoryProps) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#000000');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const {categories, setCategories} = useContentStore();
    const param = useParams();
    const teamspaceId = param.teamspaceId as string;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.color-picker-wrapper')) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsCreatingCategory(true);
        try {
            let newCategory;
            if (teamspaceId) newCategory = await createTeamspaceCategory(newCategoryName, newCategoryColor, teamspaceId);
            else newCategory = await createCategory(newCategoryName, newCategoryColor);
            onCategoryAdded(newCategory);
            setNewCategoryName('');
            setNewCategoryColor('#000000');
            setCategories([...categories, newCategory]);
            toast.success('New category created successfully.');
        } catch (error) {
            toast.error('Failed to create new category.');
        } finally {
            setIsCreatingCategory(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex gap-2 items-center">
                            <div className="color-picker-wrapper">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-[4rem] h-[2.5rem] p-0"
                                    style={{ backgroundColor: newCategoryColor }}
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                >
                                    <span className="sr-only">Pick a color</span>
                                </Button>
                                {showColorPicker && (
                                    <div className="color-picker-popover">
                                        <HexColorPicker
                                            color={newCategoryColor}
                                            onChange={setNewCategoryColor}
                                        />
                                    </div>
                                )}
                            </div>
                            <Input
                                type="text"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                className="flex-1 font-mono uppercase"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory}
                        className="w-full"
                    >
                        {isCreatingCategory ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Category'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
