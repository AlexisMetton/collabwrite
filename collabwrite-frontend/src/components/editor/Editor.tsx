import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Bold,
  Bookmark,
  Code,
  DecoupledEditor,
  Emoji,
  Essentials,
  EventInfo,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";
import {
  FormatPainter,
  Pagination,
  Template,
} from "ckeditor5-premium-features";
import { useMemo, useRef, useState } from "react";
import { InviteCollaboratorModal } from "../modals/InviteCollaboratorModal";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Save, UserPlus } from "lucide-react";

import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import "ckeditor5/ckeditor5.css";
import "./Editor.css";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  className?: string;
}

const LICENSE_KEY = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;

export const Editor: React.FC<EditorProps> = ({
  content,
  onContentChange,
  onSave,
  placeholder = "Commencez à écrire...",
  className = "",
}) => {
  const editorRef = useRef<DecoupledEditor | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const editorConfig = useMemo(
    () => ({
      licenseKey: LICENSE_KEY,
      placeholder,
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "link",
          "insertImage",
          "insertTable",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "outdent",
          "indent",
          "|",
          "findAndReplace",
          "|",
          "specialCharacters",
          "|",
          "fullScreen",
        ],
        shouldNotGroupWhenFull: true,
      },
      plugins: [
        // Plugins essentiels
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Subscript,
        Superscript,
        Code,
        RemoveFormat,

        // Formatage avancé
        FontSize,
        FontFamily,
        FontColor,
        FontBackgroundColor,
        Alignment,

        // Listes et indentation
        List,
        ListProperties,
        TodoList,
        Indent,
        IndentBlock,

        // Liens et images
        Link,
        LinkImage,
        ImageBlock,
        ImageInline,
        ImageCaption,
        ImageEditing,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        ImageUtils,
        PictureEditing,

        // Tables
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,

        // Outils avancés
        FindAndReplace,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,

        // Fonctionnalités premium (simplifiées)
        FormatPainter,
        Fullscreen,
        Pagination,
        Template,

        // Fonctionnalités de base
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BalloonToolbar,
        Bookmark,
        Emoji,
        HorizontalLine,
        Mention,
        PageBreak,
        PasteFromOffice,
        TextTransformation,
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
      },
      fontSize: {
        options: [9, 11, 13, "default", 17, 19, 21],
        supportAllValues: true,
      },
      fontFamily: {
        supportAllValues: true,
      },
      heading: {
        options: [
          {
            model: "paragraph" as const,
            title: "Paragraphe",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1" as const,
            view: "h1",
            title: "Titre 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2" as const,
            view: "h2",
            title: "Titre 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3" as const,
            view: "h3",
            title: "Titre 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4" as const,
            view: "h4",
            title: "Titre 4",
            class: "ck-heading_heading4",
          },
        ],
      },
      balloonToolbar: [
        "bold",
        "italic",
        "|",
        "link",
        "insertImage",
        "|",
        "bulletedList",
        "numberedList",
      ],
      initialData: content || "<p>Commencez à écrire votre document...</p>",
    }),
    [content, placeholder]
  );

  const handleReady = (editor: DecoupledEditor) => {
    editorRef.current = editor;

    // Insérer la barre d'outils dans le DOM
    if (toolbarRef.current && editor.ui.view.toolbar.element) {
      toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
    }
  };

  const handleChange = (_event: Event, editor: DecoupledEditor) => {
    const data = editor.getData();
    onContentChange(data);
  };

  const handleAfterDestroy = () => {
    if (toolbarRef.current) {
      Array.from(toolbarRef.current.children).forEach((child) =>
        child.remove()
      );
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Barre d'outils personnalisée */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
          <div>
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

        {/* Modale d'invitation */}
        <InviteCollaboratorModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          documentName="Document de collaboration"
        />

        {/* Barre d'outils CKEditor */}
        <div ref={toolbarRef} className="border rounded-lg p-2 bg-muted/50" />

        {/* Zone d'édition principale */}
        <div className="border rounded-lg overflow-hidden bg-background">
          <CKEditor
            onReady={handleReady}
            onAfterDestroy={handleAfterDestroy}
            editor={DecoupledEditor}
            config={editorConfig}
            onChange={
              handleChange as unknown as (
                event: EventInfo<string, unknown>,
                editor: DecoupledEditor
              ) => void
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default Editor;
