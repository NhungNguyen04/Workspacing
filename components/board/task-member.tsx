import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrganization } from "@clerk/nextjs";
import { Check, PlusCircle, User, Users } from "lucide-react";
import { useState } from "react";
import { useBoardStore } from "@/store/BoardStore";
import { updateTasks } from "@/lib/api/tasks";
import { useToast } from "@/hooks/use-toast";

interface TaskMemberProps {
  taskId: string;
}

export function TaskMember({ taskId }: TaskMemberProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { memberships } = useOrganization({
    memberships: {
      infinite: true, // Append new data to the existing list
      keepPreviousData: true, // Persist the cached data until the new data has been fetched
    },
  })
  const updateTask = useBoardStore((state) => state.updateTask);
  const getTaskWithColumn = useBoardStore((state) => state.getTaskWithColumn);

  const { task } = getTaskWithColumn(taskId) || { task: null };
  const assignedTo: string[] = task?.assignedTo || [];

  if (!task) {
    return null;
  }

  const toggleMember = async (memberId: string) => {
    if (isLoading) return;
    setIsLoading(true);
    let newAssignedTo: string[];
    if (assignedTo.includes(memberId)) {
      newAssignedTo = assignedTo.filter((id) => id !== memberId);
    } else {
      newAssignedTo = [...assignedTo, memberId];
    }
    // Optimistically update UI via store
    updateTask(taskId, { assignedTo: newAssignedTo });
    try {
      await updateTasks([
        {
          ...task,
          assignedTo: newAssignedTo,
        },
      ]);
      toast.toast({
        title: "Success",
        description: "Task members updated",
      });
    } catch (error) {
      // Rollback on error
      updateTask(taskId, { assignedTo });
      toast.toast({
        title: "Error",
        description: "Failed to update task members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasAssignedMembers = assignedTo.length > 0;

  return (
    <div className="relative w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between w-full h-10 bg-secondary/50 hover:bg-secondary/60 text-secondary-foreground"
            disabled={isLoading}
          >
            {hasAssignedMembers ? (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {assignedTo.length} {assignedTo.length === 1 ? "member" : "members"} assigned
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Assign members</span>
              </div>
            )}
            <PlusCircle className="h-4 w-4 ml-2 shrink-0 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Members to Task</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <Command>
              <CommandInput placeholder="Search member..." />
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                <div className="space-y-2 p-2">
                  {!memberships?.data || memberships.data.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No members available.
                    </div>
                  ) : (
                    memberships.data.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-secondary/30"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.publicUserData.imageUrl} />
                            <AvatarFallback>{member.publicUserData.firstName}</AvatarFallback>
                          </Avatar>
                          <span>
                            {member.publicUserData.firstName} {member.publicUserData.lastName}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={assignedTo.includes(member.id) ? "secondary" : "ghost"}
                          onClick={() => toggleMember(member.id)}
                          disabled={isLoading}
                          className="flex-shrink-0"
                        >
                          {assignedTo.includes(member.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <PlusCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CommandGroup>
            </Command>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
