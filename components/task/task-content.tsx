import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, X, FileText } from 'lucide-react';
import { Content } from '@/types/content';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  addContentToTask,
  getTaskContents,
  removeContentFromTask
} from '@/lib/api/tasks';
import { useBoardStore } from '@/store/BoardStore';
import { useTeamspaceContentStore } from '@/store/TeamspaceContentStore';

interface TaskContentProps {
  taskId: string;
}

export const TaskContent = ({ taskId }: TaskContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkedContents, setLinkedContents] = useState<Content[]>([]);
  const [availableContents, setAvailableContents] = useState<Content[]>([]);
  const { toast } = useToast();
  
  // Get task from BoardStore
  const getTaskWithColumn = useBoardStore(state => state.getTaskWithColumn);
  const updateTask = useBoardStore(state => state.updateTask);
  
  // Get contents from TeamspaceContentStore
  const allContents = useTeamspaceContentStore(state => state.contents);
  const contentsLoaded = useTeamspaceContentStore(state => state.contentsLoaded);
  const currentTeamspaceId = useTeamspaceContentStore(state => state.currentTeamspaceId);

  const fetchTaskContents = async () => {
    try {
      setIsLoading(true);
      const contents = await getTaskContents(taskId);
      setLinkedContents(contents.map((tc: any) => tc.content));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load task contents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get available contents that are not linked to this task
  const refreshAvailableContents = () => {
    const linkedContentIds = linkedContents.map(content => content.id);
    setAvailableContents(allContents.filter(content => !linkedContentIds.includes(content.id)));
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskContents();
    }
  }, [taskId]);

  // Update available contents whenever linked contents or all contents change
  useEffect(() => {
    refreshAvailableContents();
  }, [linkedContents, allContents]);

  const handleAddContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      
      // Find the content in all contents
      const contentToAdd = allContents.find(c => c.id === contentId);
      if (!contentToAdd) return;
      
      // Optimistic update
      setLinkedContents(prev => [...prev, contentToAdd]);
      setIsDialogOpen(false);
      
      // Update in database
      await addContentToTask(taskId, contentId);
      
      toast({
        title: "Success",
        description: "Content added to task",
      });
    } catch (error) {
      // Rollback on error
      await fetchTaskContents();
      toast({
        title: "Error",
        description: "Failed to add content to task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveContent = async (contentId: string) => {
    try {
      setIsLoading(true);
      
      // Optimistic update - remove from UI immediately
      setLinkedContents(prev => prev.filter(content => content.id !== contentId));
      
      // Update in database
      await removeContentFromTask(taskId, contentId);
      
      toast({
        title: "Success",
        description: "Content removed from task",
      });
    } catch (error) {
      // Rollback on error
      await fetchTaskContents();
      toast({
        title: "Error",
        description: "Failed to remove content from task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    refreshAvailableContents();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenDialog}
              className="h-8"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Content to Task</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[50vh]">
              {!contentsLoaded ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading contents...
                </div>
              ) : availableContents.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No available contents found
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {availableContents.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-secondary/30"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{content.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddContent(content.id)}
                        disabled={isLoading}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      {isLoading && linkedContents.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          Loading contents...
        </div>
      ) : linkedContents.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No contents linked to this task
        </div>
      ) : (
        <div className="space-y-2">
          {linkedContents.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between p-2 rounded bg-secondary/20"
            >
              <div className="flex items-center space-x-2 truncate">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{content.title}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveContent(content.id)}
                disabled={isLoading}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
