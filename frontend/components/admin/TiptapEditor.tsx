'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = 'Write the story here…',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const toolbarBtn = (
    active: boolean,
    onClick: () => void,
    label: string,
    title: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-xs rounded transition-colors ${
        active
          ? 'bg-text text-white'
          : 'text-text-secondary hover:text-text hover:bg-bg'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border bg-card">
        {toolbarBtn(
          editor.isActive('bold'),
          () => editor.chain().focus().toggleBold().run(),
          'B',
          'Bold'
        )}
        {toolbarBtn(
          editor.isActive('italic'),
          () => editor.chain().focus().toggleItalic().run(),
          'I',
          'Italic'
        )}
        <span className="w-px bg-border mx-1" />
        {toolbarBtn(
          editor.isActive('heading', { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          'H2',
          'Heading 2'
        )}
        {toolbarBtn(
          editor.isActive('heading', { level: 3 }),
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          'H3',
          'Heading 3'
        )}
        <span className="w-px bg-border mx-1" />
        {toolbarBtn(
          editor.isActive('bulletList'),
          () => editor.chain().focus().toggleBulletList().run(),
          '• List',
          'Bullet List'
        )}
        {toolbarBtn(
          editor.isActive('orderedList'),
          () => editor.chain().focus().toggleOrderedList().run(),
          '1. List',
          'Ordered List'
        )}
        <span className="w-px bg-border mx-1" />
        {toolbarBtn(
          editor.isActive('blockquote'),
          () => editor.chain().focus().toggleBlockquote().run(),
          '"Quote"',
          'Blockquote'
        )}
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-64 px-4 py-3 text-text bg-card focus-within:ring-2 focus-within:ring-teal focus-within:ring-inset
          [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:outline-none
          [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_p]:leading-relaxed
          [&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-4
          [&_.ProseMirror_h3]:font-serif [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-3
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-terracotta [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-text-secondary [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:my-3
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-3
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-3
          [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}
