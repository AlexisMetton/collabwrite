import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { DocumentChat } from "../chat/DocumentChat";
import { TiptapEditor } from "./TiptapEditor";

interface CursorPosition {
  userId: string;
  userName: string;
  color: string;
  position: { top: number; left: number };
}

interface EditorWithChatProps {
  documentId: string;
  documentName?: string;
  content: string;
  onContentChange: (content: string) => void;
  onRemoteContentChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  remoteVersion?: number;
  cursors?: CursorPosition[];
  onCursorMove?: (position: { from: number; to: number }) => void;
}

export const EditorWithChat: React.FC<EditorWithChatProps> = React.memo(
  ({
    documentId,
    documentName,
    content,
    onContentChange,
    onRemoteContentChange,
    onSave,
    placeholder,
    remoteVersion = 0,
    cursors = [],
    onCursorMove,
  }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
      <div className="flex h-full w-full gap-3 sm:gap-4 flex-col lg:flex-row">
        <div
          className={`flex-1 transition-all duration-300`}
        >
          <TiptapEditor
            content={content}
            onContentChange={onContentChange}
            onRemoteContentChange={onRemoteContentChange}
            onSave={onSave}
            placeholder={placeholder}
            documentId={documentId}
            documentName={documentName}
            remoteVersion={remoteVersion}
            cursors={cursors}
            onCursorMove={onCursorMove}
          />

          {!isChatOpen && (
            <Button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 rounded-full shadow-lg w-12 h-12 sm:w-14 sm:h-14 z-50"
              size="lg"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          )}
        </div>

        {isChatOpen && (
          <div className="w-full lg:w-96 flex-shrink-0 animate-in slide-in-from-right">
            <div className="h-[60vh] lg:h-[calc(100vh-200px)] lg:max-h-[800px] rounded-lg border bg-card shadow-lg">
              <DocumentChat
                documentId={documentId}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

EditorWithChat.displayName = "EditorWithChat";

export default EditorWithChat;
