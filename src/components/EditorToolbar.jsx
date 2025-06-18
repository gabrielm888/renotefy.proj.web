import React, { useState } from 'react';

const EditorToolbar = ({ editorRef, onContentChange, onImageUpload }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  
  // Execute a document command
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  // Format text
  const handleFormat = (command) => {
    execCommand(command);
  };

  // Insert link
  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Handle color change
  const handleColorChange = (color) => {
    setCurrentColor(color);
    setColorPickerOpen(false);
    execCommand('foreColor', color);
  };

  // Handle file input change for image upload
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
    // Reset input value so the same file can be selected again
    e.target.value = null;
  };

  // Create a list
  const handleList = (type) => {
    execCommand(type);
  };

  // Font size options
  const handleFontSize = (size) => {
    execCommand('fontSize', size);
  };

  // Button component for toolbar
  const ToolbarButton = ({ icon, onClick, title, active = false }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded ${active ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-light p-1 flex flex-wrap items-center gap-1">
      {/* Text formatting */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1">
        <ToolbarButton
          icon={<span className="font-bold">B</span>}
          onClick={() => handleFormat('bold')}
          title="Bold"
        />
        <ToolbarButton
          icon={<span className="italic">I</span>}
          onClick={() => handleFormat('italic')}
          title="Italic"
        />
        <ToolbarButton
          icon={<span className="underline">U</span>}
          onClick={() => handleFormat('underline')}
          title="Underline"
        />
      </div>

      {/* Text alignment */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1">
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          }
          onClick={() => handleFormat('justifyLeft')}
          title="Align Left"
        />
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          }
          onClick={() => handleFormat('justifyCenter')}
          title="Align Center"
        />
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          }
          onClick={() => handleFormat('justifyRight')}
          title="Align Right"
        />
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1">
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          }
          onClick={() => handleList('insertUnorderedList')}
          title="Bullet List"
        />
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          }
          onClick={() => handleList('insertOrderedList')}
          title="Numbered List"
        />
      </div>

      {/* Font size */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1">
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          className="bg-transparent text-sm border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="3">Normal</option>
          <option value="1">Small</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
      </div>

      {/* Color picker */}
      <div className="relative flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1">
        <ToolbarButton
          icon={
            <div className="w-4 h-4 border border-gray-300 rounded-sm" style={{ backgroundColor: currentColor }}></div>
          }
          onClick={() => setColorPickerOpen(!colorPickerOpen)}
          title="Text Color"
        />
        
        {colorPickerOpen && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-dark-light shadow-lg rounded-md z-10 grid grid-cols-5 gap-1">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#FF9900', '#9900FF'].map(color => (
              <div
                key={color}
                className="w-5 h-5 border cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Link and image */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          }
          onClick={handleInsertLink}
          title="Insert Link"
        />
        <ToolbarButton
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          }
          onClick={() => document.getElementById('image-upload').click()}
          title="Upload Image"
        />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
