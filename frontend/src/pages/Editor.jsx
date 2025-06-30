import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

const Editor = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultLang = queryParams.get("language") || "python";
  const [language, setLanguage] = useState(defaultLang);

  const getTemplate = (lang) => {
    const templates = {
      python: '# Welcome to TextCompiler\nprint("Hello, World!")',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      javascript: 'console.log("Hello, World!");',
    };
    return templates[lang] || '';
  };

  const [tabs, setTabs] = useState([
    { id: 1, name: 'main', code: getTemplate(defaultLang), showClose: false },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);

  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleRunCode = () => {
    const active = tabs.find((tab) => tab.id === activeTab);
    setOutput(`Running ${language} code...\n\n${active.code}`);
  };

  const handleAddTab = () => {
    const newId = tabs.length + 1;
    const newTab = {
      id: newId,
      name: `program${newId}`,
      code: getTemplate(language),
      showClose: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const handleCodeChange = (newCode) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab ? { ...tab, code: newCode || '' } : tab
      )
    );
  };

  const colors = {
    background: isDark ? '#0b1120' : 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
    card: isDark ? 'rgb(22, 33, 60)' : '#fff',
    text: isDark ? '#e5e5e5' : '#333',
    border: isDark ? '#2b2e3a' : '#ccc',
    editorTab: isDark ? '#2b2e3a' : '#f0f0f0',
    runButton: '#22c55e',
    accent: isDark ? '#a855f7' : '#4a00e0',
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        background: colors.background,
        color: colors.text,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          background: colors.card,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <img
          src={isDark ? '/logo-dark.png' : '/logo-light.png'}
          alt="Logo"
          style={{ height: "150px" }}
        />
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            fontSize: '45px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: colors.text,
          }}
        >
          ⚙
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
  <div
    onMouseLeave={() => setShowSettings(false)}
    style={{
      position: 'absolute',
      top: '65px',
      right: '20px',
      background: colors.card,
      color: colors.text,
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      width: '260px',
      zIndex: 1000,
      transition: 'all 0.3s ease-in-out',
    }}
  >
    <h3 style={{ marginBottom: '15px' }}>🎨 Settings</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <label>🌗 Theme</label>
      <label className="switch">
        <input type="checkbox" checked={isDark} onChange={handleThemeToggle} />
        <span className="slider round"></span>
      </label>
    </div>

    <label>
      𝒇x Font Size: {fontSize}px
      <input
        type="range"
        min="12"
        max="45"
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        style={{ width: '100%' }}
      />
    </label>
  </div>
)}


      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div
            style={{
              background: colors.editorTab,
              padding: '10px 15px',
              fontWeight: 'bold',
              color: colors.accent,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() =>
                  setTabs(tabs.map((t) => t.id === tab.id ? { ...t, showClose: true } : t))
                }
                onMouseLeave={() =>
                  setTabs(tabs.map((t) => t.id === tab.id ? { ...t, showClose: false } : t))
                }
                style={{
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: tab.id === activeTab ? colors.accent : 'transparent',
                  color: tab.id === activeTab ? '#fff' : colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {tab.name}.{language === 'cpp' ? 'cpp' : language}
                {tab.showClose && tabs.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTabs = tabs.filter((t) => t.id !== tab.id);
                      setTabs(newTabs);
                      if (tab.id === activeTab) {
                        setActiveTab(newTabs[0].id);
                      }
                    }}
                    style={{
                      marginLeft: 8,
                      color: tab.id === activeTab ? '#fff' : colors.accent,
                      cursor: 'pointer',
                    }}
                  >
                    ✖
                  </span>
                )}
              </div>
            ))}
            <button
              onClick={handleAddTab}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                color: colors.accent,
                cursor: 'pointer',
              }}
              title="Add new file"
            >
              ➕
            </button>
          </div>

          {/* Monaco Editor */}
          <MonacoEditor
            language={language}
            theme={isDark ? 'vs-dark' : 'light'}
            value={tabs.find((t) => t.id === activeTab)?.code}
            onChange={handleCodeChange}
            options={{
              fontSize: fontSize,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
            height="100%"
          />
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '15px',
            background: colors.card,
            borderLeft: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                setTabs((prevTabs) =>
                  prevTabs.map((tab) =>
                    tab.id === activeTab ? { ...tab, code: getTemplate(newLang) } : tab
                  )
                );
              }}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '6px',
                border: `1px solid ${colors.border}`,
                ...(isDark && {
                  background: colors.background,
                  color: colors.text,
                }),
              }}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
            <button
              onClick={handleRunCode}
              style={{
                backgroundColor: colors.runButton,
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ▶ Run Code
            </button>
          </div>

          {/* Custom Input */}
          <div>
            <h4>Custom Input</h4>
            <textarea
              placeholder="Enter input..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              style={{
                width: '100%',
                height: '90px',
                resize: 'vertical',
                padding: '10px',
                fontFamily: 'monospace',
                ...(isDark && {
                  background: colors.background,
                  color: colors.text,
                }),
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
              }}
            />
          </div>

          {/* Output */}
          <div style={{ flex: 1 }}>
            <h4>Output</h4>
            <pre
              style={{
                width: '100%',
                height: '100%',
                ...(isDark && {
                  background: colors.background,
                  color: colors.text,
                }),
                padding: '10px',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
              }}
            >
              {output || 'Click "Run Code" to see output'}
            </pre>
          </div>
        </div>
      </div>

      <style>
        {`
          .switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 24px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #4a00e0;
          }
          input:checked + .slider:before {
            transform: translateX(20px);
          }
        `}
      </style>
    </div>
  );
};

export default Editor;
