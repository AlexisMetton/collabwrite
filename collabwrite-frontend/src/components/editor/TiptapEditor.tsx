import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Save,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { InviteCollaboratorModal } from "../modals/InviteCollaboratorModal";
import { RemoteCursor } from "./RemoteCursor";
import "./TiptapEditor.css";

interface CursorPosition {
  userId: string;
  userName: string;
  color: string;
  position: { top: number; left: number };
}

interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onRemoteContentChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  className?: string;
  documentId?: string;
  documentName?: string;
  remoteVersion?: number;
  cursors?: CursorPosition[];
  onCursorMove?: (position: { from: number; to: number }) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = React.memo(
  ({
    content,
    onContentChange,
    onSave,
    className = "",
    documentId,
    documentName,
    remoteVersion = 0,
    cursors = [],
    onCursorMove,
  }) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [displayCursors, setDisplayCursors] = useState<
      Array<{
        userId: string;
        userName: string;
        color: string;
        position: { top: number; left: number };
      }>
    >([]);
    const isRemoteUpdateRef = useRef(false);
    const onContentChangeRef = useRef(onContentChange);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    // Garder la référence à jour sans provoquer de re-render
    useEffect(() => {
      onContentChangeRef.current = onContentChange;
    }, [onContentChange]);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          link: false,
          underline: false,
        }),
        Underline,
        Link.configure({
          openOnClick: false,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        TextStyle,
        Color,
      ],
      content: content,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm max-w-none focus:outline-none min-h-[500px] p-4",
        },
      },
      onUpdate: ({ editor }) => {
        if (!isRemoteUpdateRef.current) {
          const html = editor.getHTML();
          requestAnimationFrame(() => {
            onContentChangeRef.current(html);
          });
        }
      },
      onSelectionUpdate: ({ editor }) => {
        // Émettre la position du curseur quand il bouge
        if (!isRemoteUpdateRef.current && onCursorMove) {
          const { from, to } = editor.state.selection;
          requestAnimationFrame(() => {
            onCursorMove({ from, to });
          });
        }
      },
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
    });

    // Gérer les mises à jour distantes (depuis d'autres utilisateurs)
    useEffect(() => {
      if (!editor) return;

      const currentContent = editor.getHTML();
      const normalize = (html: string) => html.replace(/\s+/g, " ").trim();

      if (normalize(content) !== normalize(currentContent)) {
        isRemoteUpdateRef.current = true;

        // Appliquer immédiatement pour éviter les pertes
        editor.commands.setContent(content);

        // Débloquer après un court délai
        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 50);
      }
    }, [remoteVersion, editor, content]);

    // Convertir les positions ProseMirror en positions DOM
    useEffect(() => {
      if (!editor || !editorContainerRef.current) {
        setDisplayCursors([]);
        return;
      }

      const newDisplayCursors = cursors
        .map((cursor) => {
          try {
            // Vérifier que la position est valide
            const docSize = editor.state.doc.content.size;
            if (cursor.position.left < 0 || cursor.position.left > docSize) {
              return null;
            }

            // Obtenir les coordonnées DOM réelles
            const coords = editor.view.coordsAtPos(cursor.position.left);
            const containerRect =
              editorContainerRef.current!.getBoundingClientRect();

            return {
              userId: cursor.userId,
              userName: cursor.userName,
              color: cursor.color,
              position: {
                top: coords.top - containerRect.top,
                left: coords.left - containerRect.left,
              },
            };
          } catch {
            // Position invalide, ignorer ce curseur
            return null;
          }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);

      setDisplayCursors(newDisplayCursors);
    }, [cursors, editor]);

    if (!editor) {
      return null;
    }

    const addLink = () => {
      const url = window.prompt("URL du lien:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1 border rounded-lg p-2 bg-muted/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Annuler"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Rétablir"
              >
                <Redo className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                }
                title="Titre 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                }
                title="Titre 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
                }
                title="Titre 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-muted" : ""}
                title="Gras"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-muted" : ""}
                title="Italique"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-muted" : ""}
                title="Souligné"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-muted" : ""}
                title="Barré"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-muted" : ""}
                title="Liste à puces"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-muted" : ""}
                title="Liste numérotée"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={
                  editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""
                }
                title="Aligner à gauche"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={
                  editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""
                }
                title="Centrer"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={
                  editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""
                }
                title="Aligner à droite"
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={addLink}
                className={editor.isActive("link") ? "bg-muted" : ""}
                title="Ajouter un lien"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {onSave && (
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Inviter
              </Button>
            </div>
          </div>

          <InviteCollaboratorModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            documentId={documentId}
            documentName={documentName}
          />

          <div
            ref={editorContainerRef}
            className="border rounded-lg overflow-hidden bg-background"
            style={{ position: "relative" }}
          >
            <EditorContent editor={editor} />

            {displayCursors.map((cursor) => (
              <RemoteCursor
                key={cursor.userId}
                userName={cursor.userName}
                color={cursor.color}
                position={cursor.position}
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";

export default TiptapEditor;
