'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: () => void;
  editable?: boolean;
}

/**
 * TipTap WYSIWYG Editor
 * Rich text editor with formatting controls
 */
export function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  onImageUpload,
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b-2 border-gray-200 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation ${
                editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation ${
                editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-5 h-5" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation ${
                editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Bullet List"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation ${
                editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-5 h-5" />
            </button>
          </div>

          {/* Image Upload */}
          {onImageUpload && (
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <button
                onClick={onImageUpload}
                className="p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation text-gray-600"
                title="Upload Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation text-gray-600 disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-2 rounded-lg transition-all hover:bg-gray-200 active:scale-95 touch-manipulation text-gray-600 disabled:opacity-30"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
