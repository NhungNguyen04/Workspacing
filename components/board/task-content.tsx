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
import { getTeamspaceContents } from '@/lib/api/content';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';
import type { TaskContent as TaskContentType } from '@/types/taskContent';
import { update } from 'lodash';

interface TaskContentProps {
  task: Task;
}

export const TaskContent = ({ task }: TaskContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkedContents, setLinkedContents] = useState<Content[]>([]);
  const [availableContents, setAvailableContents] = useState<Content[]>([]);
  const { toast } = useToast();

  // Get contents from TeamspaceContentStore
  const allContents = useTeamspaceContentStore(state => state.contents);
  const contentsLoaded = useTeamspaceContentStore(state => state.contentsLoaded);
  const currentTeamspaceId = useTeamspaceContentStore(state => state.currentTeamspaceId);
  const setContent = useTeamspaceContentStore(state => state.setContents);
  const setContentsLoaded = useTeamspaceContentStore(state => state.setContentsLoaded);
  const setCurrentTeamspaceId = useTeamspaceContentStore(state => state.setCurrentTeamspaceId);
  const {orgId} = useAuth();
  const router = useRouter();
  const { tasks } = useBoardStore();
  const updateTask = useBoardStore(state => state.updateTask);

  useEffect(() => {
    const fetchContents = async () => {
      if (!orgId) return;
      if (!currentTeamspaceId) {
        setCurrentTeamspaceId(orgId);
      }
      if (currentTeamspaceId && !contentsLoaded) {
        try {
          setIsLoading(true);
          const contents = await getTeamspaceContents(currentTeamspaceId);
          setContent(contents);
          setContentsLoaded(true);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load contents",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchContents();
    fetchTaskContents();
  }, [currentTeamspaceId, contentsLoaded]);

  const fetchTaskContents =  () => {
    setLinkedContents(task.content?.map(tc => tc.content) || []);
  };

  // Get available contents that are not linked to this task
  const refreshAvailableContents = () => {
    const linkedContentIds = linkedContents.map(content => content.id);
    setAvailableContents(allContents.filter(content => !linkedContentIds.includes(content.id)));
  };

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
      const taskContentRelation = await addContentToTask(task.id, contentId);
      console.log("Created task content relation:", taskContentRelation);
      
      // Update the task with the new content relationship
      const updatedContent = [...(task.content || []), taskContentRelation];
      updateTask(task.id, {
        content: updatedContent
      });

      console.log("Updated task content:", tasks);
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
      setLinkedContents(prev => prev.filter(content => content.id !== contentId));
      await removeContentFromTask(task.id, contentId);
      
      // Update the task by removing the content relationship
      const updatedContent = (task.content || []).filter((tc: TaskContentType) => tc.content.id !== contentId);
      updateTask(task.id, {
        content: updatedContent
      });
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
              {availableContents.length === 0 ? (
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
                        <span className="hover:cursor-pointer"onClick={() => {router.push(`/contents/${content.id}`)}}>{content.title}</span>
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
                <span className="truncate hover:cursor-pointer" onClick={() => {router.push(`/contents/${content.id}`)}}>{content.title}</span>
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
