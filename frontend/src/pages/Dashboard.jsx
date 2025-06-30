import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";
  const inputRef = useRef(null);

  const languages = [
    { id: "python", name: "Python", icon: "python" },
    { id: "cpp", name: "C++", icon: "cplusplus" },
    { id: "java", name: "Java", icon: "java" },
    { id: "javascript", name: "JavaScript", icon: "javascript" },
  ];

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(selectedLanguage.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % filteredLanguages.length);
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev - 1 + filteredLanguages.length) % filteredLanguages.length);
    } else if (e.key === "Enter" && highlightIndex !== -1) {
      const lang = filteredLanguages[highlightIndex];
      navigate(`/editor?language=${lang.id}`);
      setSelectedLanguage("");
      setHighlightIndex(-1);
      setShowSuggestions(false);
    }
  };

  const handleLanguageClick = (lang) => {
    const editorLang = lang === "cplusplus" ? "cpp" : lang;
    navigate(`/editor?language=${editorLang}`);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (highlightIndex >= filteredLanguages.length) {
      setHighlightIndex(-1);
    }
  }, [filteredLanguages]);

  const darkStyles = {
    searchInput: {
      backgroundColor: "#1a253b",
      color: "#fff",
      border: "1px solid #44506a",
    },
    suggestions: {
      backgroundColor: "#1a253b",
      borderColor: "#33425b",
    },
    suggestionItem: {
      backgroundColor: "#1a253b",
      color: "#e5e5e5",
    },
    suggestionItemHover: {
      backgroundColor: "#2c3e5f",
    },
    langBox: {
      backgroundColor: "#1a253b",
      border: "1px solid #44506a",
      color: "#e5e5e5",
    },
  };

  return (
    <div
      style={{
        ...styles.page,
        background: isDark
          ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
          : styles.page.background,
        color: isDark ? "#e5e5e5" : "#333",
      }}
    >
      <div
        style={{
          ...styles.container,
          backgroundColor: isDark ? "rgb(22, 33, 60)" : "#fff",
          boxShadow: isDark
            ? "0 20px 50px rgba(0,0,0,0.6)"
            : "0 12px 30px rgba(0, 0, 0, 0.1)",
          border: isDark ? "1px solid rgba(138, 43, 226, 0.3)" : "none",
          color: isDark ? "#e5e5e5" : "#333",
        }}
        className="glow-card"
      >
        <div style={styles.navbar}>
          <img
            src={isDark ? "/logo-dark.png" : "/logo-light.png"}
            alt="Logo"
            style={styles.logo}
          />
          <nav style={styles.navLinks}>
            {["home", "about", "contact"].map((section) => (
              <button
                key={section}
                style={{
                  ...styles.navLink,
                  color: isDark ? "#fff" : styles.navLink.color,
                }}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <label className="switch">
              <input
                type="checkbox"
                checked={isDark}
                onChange={() => setTheme(isDark ? "light" : "dark")}
              />
              <span className="slider round"></span>
            </label>
            <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </nav>
        </div>

        <div style={styles.content}>
          {activeSection === "home" && (
            <>
              <p
                style={{
                  ...styles.subtitle,
                  color: isDark ? "#fff" : styles.subtitle.color,
                }}
              >
                Search a language and start coding now!
              </p>
              <div
                style={styles.searchContainer}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search a language..."
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setHighlightIndex(-1);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    ...styles.searchInput,
                    ...(isDark ? darkStyles.searchInput : {}),
                  }}
                />
                {showSuggestions && selectedLanguage && (
                  <div
                    style={{
                      ...styles.suggestions,
                      ...(isDark ? darkStyles.suggestions : {}),
                    }}
                  >
                    {filteredLanguages.length ? (
                      filteredLanguages.map((lang, idx) => (
                        <div
                          key={lang.id}
                          style={{
                            ...styles.suggestionItem,
                            ...(isDark ? darkStyles.suggestionItem : {}),
                            ...(idx === highlightIndex
                              ? { backgroundColor: isDark ? darkStyles.suggestionItemHover.backgroundColor : "#eee" }
                              : {}),
                          }}
                          onMouseEnter={() => setHighlightIndex(idx)}
                          onMouseDown={() => navigate(`/editor?language=${lang.id}`)}
                        >
                          <img
                            src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${lang.icon}/${lang.icon}-original.svg`}
                            alt={lang.name}
                            style={styles.suggestionIcon}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          <span>{lang.name}</span>
                        </div>
                      ))
                    ) : (
                      <div style={styles.noResults}>No matching language</div>
                    )}
                  </div>
                )}
              </div>

              <h3
                style={{
                  ...styles.sectionTitle,
                  color: isDark ? "#fff" : styles.sectionTitle.color,
                }}
              >
                Languages
              </h3>
              <div style={styles.langGrid}>
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    style={{
                      ...styles.langBox,
                      ...(isDark ? darkStyles.langBox : {}),
                      boxShadow: isDark
                        ? "0 0 12px rgba(74, 0, 224, 0.3)"
                        : styles.langBox.boxShadow,
                    }}
                    onClick={() => handleLanguageClick(lang.id)}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${lang.icon}/${lang.icon}-original.svg`}
                      alt={lang.name}
                      style={styles.langIcon}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span style={styles.langLabel}>{lang.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === "about" && (
            <>
              <h2>About</h2>
              <p>
                Test Compiler is a modern online code editor supporting multiple languages.
                Write, compile, and run code directly in your browser.
              </p>
            </>
          )}

          {activeSection === "contact" && (
            <>
              <h2>Contact</h2>
              <p>Email: support@testcompiler.com</p>
              <p>Phone: +91 12345 67890</p>
            </>
          )}
        </div>

        <footer style={styles.footer}>
          <p>© 2025 Test Compiler. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        .glow-card {
          transition: all 0.3s ease-in-out;
        }
        .glow-card:hover {
          box-shadow: 0 0 25px rgba(74, 0, 224, 0.4), 0 0 50px rgba(74, 0, 224, 0.2);
          transform: scale(1.02);
        }
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
        input::placeholder {
          color: #888;
        }
        .glow-card input::placeholder {
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "30px 20px",
    fontFamily: "sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "1000px",
    borderRadius: "16px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logo: {
    height: "180px",
    objectFit: "contain",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "#4a00e0",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    textAlign: "center",
  },
  subtitle: {
    fontSize: "15px",
    color: "#555",
    marginBottom: "20px",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "300px",
    margin: "0 auto 30px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  suggestions: {
    position: "absolute",
    top: "42px",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
    overflow: "hidden",
    animation: "fadeIn 0.3s ease",
  },
  suggestionItem: {
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  suggestionIcon: {
    height: "20px",
    width: "20px",
  },
  noResults: {
    padding: "10px",
    fontStyle: "italic",
    color: "#999",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
    gap: "16px",
  },
  langBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    background: "#fafafa",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  langIcon: {
    height: "40px",
    marginBottom: "6px",
  },
  langLabel: {
    fontSize: "13px",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#888",
    marginTop: "30px",
    borderTop: "1px solid #eee",
    paddingTop: "16px",
  },
};

export default Dashboard;
