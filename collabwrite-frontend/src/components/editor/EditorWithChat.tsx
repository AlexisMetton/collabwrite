import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { DocumentChat } from "../chat/DocumentChat";
import { Editor } from "./Editor";

interface EditorWithChatProps {
  documentId: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
}

export const EditorWithChat: React.FC<EditorWithChatProps> = ({
  documentId,
  content,
  onContentChange,
  onSave,
  placeholder,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-full w-full gap-4">
      {/* Éditeur principal */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isChatOpen ? "mr-0" : ""
        }`}
      >
        <Editor
          content={content}
          onContentChange={onContentChange}
          onSave={onSave}
          placeholder={placeholder}
        />

        {/* Bouton pour ouvrir le chat (visible seulement quand le chat est fermé) */}
        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 rounded-full shadow-lg w-14 h-14 z-50"
            size="lg"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Panneau de chat */}
      {isChatOpen && (
        <div className="w-96 flex-shrink-0 animate-in slide-in-from-right">
          <div className="h-[calc(100vh-200px)] max-h-[800px] rounded-lg border bg-card shadow-lg">
            <DocumentChat
              documentId={documentId}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorWithChat;
