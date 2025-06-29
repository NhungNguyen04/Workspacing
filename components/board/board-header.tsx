import {Button} from "@/components/ui/button";
import { ChevronLeft, UserIcon, Sparkles, Loader2, Table, Layout } from "lucide-react";
import { useBoardStore } from "@/store/BoardStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateBoardTitle, generateBoardFromAI, applyAIGeneratedBoard} from "@/lib/api/board";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaRegObjectUngroup } from "react-icons/fa";
import { Card, CardContent } from "../ui/card";
import { Progress } from "@/components/ui/progress";

interface AIPreviewProps {
  columns: Array<{
    title: string;
    tasks: string[];
  }>;
  onAccept: () => void;
  onDiscard: () => void;
  isApplying?: boolean;
  progress?: number;
}

interface BoardColumn {
  title: string;
  tasks: string[];
}

interface BoardData {
  columns: BoardColumn[];
}

const AIPreview = ({ columns, onAccept, onDiscard, isApplying, progress }: AIPreviewProps) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-white p-10 rounded-2xl max-w-[90vw] max-h-[90vh] overflow-auto shadow-2xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-primary flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-30"></div>
          <Sparkles className="w-6 h-6 relative" />
        </div>
        AI Generated Board Preview
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column, idx) => (
          <Card key={idx} className="w-[300px] shrink-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 text-lg text-primary">{column.title}</h3>
              <ul className="space-y-3">
                {column.tasks.map((task, taskIdx) => (
                  <li key={taskIdx} className="bg-slate-50 p-3 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                    {task}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-3 mt-6 border-t pt-6">
        {isApplying && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Creating board structure...</span>
              <span>{Math.round(progress || 0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onDiscard} 
            className="hover:bg-red-50"
            disabled={isApplying}
          >
            Discard
          </Button>
          <Button 
            onClick={onAccept} 
            className="bg-primary hover:bg-primary/90"
            disabled={isApplying}
          >
            {isApplying ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying Changes...
              </div>
            ) : (
              'Accept Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default function BoardHeader() {
  const {activeBoard, previousUrl, viewMode, toggleViewMode} = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activeBoard?.title);
  const [showAIInput, setShowAIInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirement, setRequirement] = useState("");
  const [aiGeneratedData, setAiGeneratedData] = useState<BoardData | null>(null);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { bulkAddColumns, bulkAddTasks } = useBoardStore();


  const enableEditing = () => {
    setIsEditing(true);
  }
  const disableEditing = () => {
    setIsEditing(false);
  }
  
  const onBlur = async () => {
    if (title === activeBoard?.title) {
      disableEditing();
      return;
    }
    if (!title) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!activeBoard?.id) {
      toast.error("Board ID is missing");
      return;
    }
    const response = updateBoardTitle(activeBoard.id, title);
    if (!response) {
      toast.error("Failed to update board title");
      return;
    }
    disableEditing();
  }
  
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    }
    if (e.key === 'Escape') {
      setTitle(activeBoard?.title);
      disableEditing();
    }
  }

  const handleAIGenerate = async () => {
    if (!requirement.trim()) {
      toast.error("Please enter a requirement");
      return;
    }
    
    setIsGenerating(true);
    try {
      const boardData = await generateBoardFromAI(requirement);
      setAiGeneratedData(boardData);
      toast.success("Board generated successfully!");
    } catch (error) {
      console.error('API error:', error);
      toast.error("Failed to generate board");
    } finally {
      setIsGenerating(false);
      setShowAIInput(false);
      setRequirement("");
    }
  };

  const handleAcceptChanges = async () => {
    if (!activeBoard?.id || !aiGeneratedData) {
      toast.error("Invalid board data");
      return;
    }

    setIsApplyingChanges(true);
    
    try {
      await applyAIGeneratedBoard(activeBoard.id, aiGeneratedData);
      setAiGeneratedData(null);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update board:', error);
      toast.error("Failed to update board. Please refresh the page.");
    } finally {
      setIsApplyingChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    setAiGeneratedData(null);
    toast.info("Changes discarded");
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="fixed top-0 left-0 w-full h-14 bg-white bg-opacity-80 pl-4 items-center flex border border-transparent border-t-0 border-l-0 border-r-0 border-b-4 border-b-gradient-to-r from-green-200 via-blue-200 to-blue-500 shadow-lg shadow-gray-300/50 z-40">
      <Button variant="outline" size="icon" style={{background: 'transparent', border: 'none'}} onClick={()=> {router.back()}}>
        <ChevronLeft className="text-primary"/>
      </Button>
      {isEditing ? (
      <input
        className="w-fit text-lg px-2.5 py-1 h-7 font-medium border rounded bg-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
      />
      ) : (
        <div onClick={enableEditing} className="flex items-center cursor-pointer w-auto mr-10">
        <h1 className="text-2xl font-bold text-primary ml-4">{title}</h1>
        </div>)}
      
      {/* View Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleViewMode}
        className="ml-4 flex items-center gap-2 hover:bg-gray-100 transition-colors"
        title={`Switch to ${viewMode === 'board' ? 'table' : 'board'} view`}
      >
        {viewMode === 'board' ? (
          <>
            <Table className="h-4 w-4" />
            <span className="hidden sm:inline">Table View</span>
          </>
        ) : (
          <>
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Board View</span>
          </>
        )}
      </Button>

      <div className="flex space-x-2 ml-auto pr-4">
         <Button 
      className="group relative overflow-hidden h-10 w-auto hover:scale-105 transform transition-all duration-200 text-primary font-medium px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-primary/25 hover:text-secondary bg-secondary"
      onClick={() => setShowAIInput(true)}
        >
      <Sparkles className="w-3 h-3 animate-pulse" />
      <span className="relative z-10 font-bold text-md">Create with GPT</span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
        <Button style={{ background: 'transparent', color: 'black' }}>Invite</Button>
        <Button style={{ background: 'transparent', color: 'black' }}>Settings</Button>
      </div>
      </div>
      <div className="flex items-center justify-center md:py-8 w-full">
      
      {showAIInput && !isGenerating && (
        <div className="flex gap-3 items-center bg-gray-400/50 p-2 rounded-xl shadow-xl border border-gray-100 w-full h-16 max-w-2xl transform transition-all duration-200 hover:shadow-2xl z-50 justify-center mx-auto">
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Describe your project requirements..."
          className="p-4 border rounded-xl w-full h-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-gray-400"
        />
        <Button 
          onClick={handleAIGenerate}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <Sparkles className="w-2 h-2" />
          Generate
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowAIInput(false)}
          className="hover:bg-red-50 px-6 py-4 rounded-xl border-2 transition-colors duration-200"
        >
          Cancel
        </Button>
        </div>
      )}

      {isGenerating && (
        <div className="flex items-center gap-4 p-8 text-base font-medium rounded-xl bg-white shadow-xl border border-gray-100 animate-pulse transition-all duration-300 justify-center mx-auto z-50">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-30 animate-pulse"></div>
          <Loader2 className="w-6 h-6 animate-spin text-primary relative"/>
        </div>
        <p className="text-primary">GPT is crafting your project structure...</p>
        </div>
      )}
      </div>
      
      {aiGeneratedData && (
      <AIPreview 
        columns={aiGeneratedData.columns}
        onAccept={handleAcceptChanges}
        onDiscard={handleDiscardChanges}
        isApplying={isApplyingChanges}
        progress={progress}
      />
      )}
    </div>
  )
}