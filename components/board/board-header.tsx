import { Board } from "@/types/board";
import {Button} from "@/components/ui/button";
import { ChevronLeft, UserIcon } from "lucide-react";
import { useBoardStore } from "@/store/BoardStore";
import { useRouter } from "next/navigation";


export default function BoardHeader() {
  const {activeBoard, previousUrl} = useBoardStore();
  const router = useRouter();

  return (
    <div className="flex-1">
      <div className="h-16 w-full bg-neutral-100 bg-opacity-60 pl-4 mb-4 items-center flex">
        <Button variant="outline" size="icon" style={{background: 'transparent', border: 'none'}} onClick={()=> {router.push(previousUrl || "/")}}><ChevronLeft className="text-primary"/></Button>
        <h1 className="text-2xl font-bold">{activeBoard?.title}</h1>
        <div className="flex space-x-2">
          <Button style={{ background: 'transparent', color: 'black' }}>Invite</Button>
          <Button style={{ background: 'transparent', color: 'black' }}>Settings</Button>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-secondary bg-opacity-10 italic max-w-3xl text-primary">
          <UserIcon className="inline-block mr-2 h-8 w-8 text-primary"/>
          GPT is summarising your tasks for the team...
        </p>
      </div>
    </div>
  )
}