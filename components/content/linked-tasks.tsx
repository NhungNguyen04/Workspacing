import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckSquare } from 'lucide-react';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { getContentTasks } from '@/services/taskContentService';
import { format } from 'date-fns';

interface ContentTasksProps {
  contentId: string;
}

export const ContentTasks = ({ contentId }: ContentTasksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const fetchContentTasks = async () => {
    try {
      setIsLoading(true);
      const taskRelations = await getContentTasks(contentId);
      setTasks(taskRelations.map((tc: any) => tc.task));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contentId) {
      fetchContentTasks();
    }
  }, [contentId]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Linked Tasks</h3>
      </div>
      <Separator />
      {tasks.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No tasks linked to this content
        </div>
      ) : (
        <ScrollArea className="max-h-[250px]">
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded bg-secondary/20"
              >
                <div className="flex items-center space-x-2 truncate">
                  <CheckSquare className={`h-4 w-4 flex-shrink-0 ${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={`truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    Due: {format(new Date(task.dueDate), 'MMM d')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
