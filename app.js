/**
 * Application Controller for LaTeX Converter by Abner
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // DOM Elements
  const inputEl = document.getElementById('latex-input');
  const outputEl = document.getElementById('text-output');
  const renderedViewEl = document.getElementById('rendered-view');
  const convertBtn = document.getElementById('btn-convert');
  const clearBtn = document.getElementById('btn-clear');
  const copyBtn = document.getElementById('btn-copy');
  const copyTableBtn = document.getElementById('btn-copy-table');
  const downloadTxtBtn = document.getElementById('btn-download-txt');
  const downloadTsvBtn = document.getElementById('btn-download-tsv');
  const fileUploadInput = document.getElementById('file-upload');
  const uploadBtn = document.getElementById('btn-upload');

  // Mode and Toggle Elements
  const modeAsciiBtn = document.getElementById('mode-ascii');
  const modeUnicodeBtn = document.getElementById('mode-unicode');
  const autoConvertToggle = document.getElementById('toggle-auto-convert');
  const optionsToggleBtn = document.getElementById('btn-toggle-options');
  const optionsPanel = document.getElementById('options-panel');
  const themeToggleBtn = document.getElementById('btn-theme-toggle');

  // Output Tab Elements
  const tabPlainBtn = document.getElementById('tab-plain');
  const tabRenderedBtn = document.getElementById('tab-rendered');

  // Option dropdowns / checkboxes
  const optSuperStyle = document.getElementById('opt-super-style');
  const optMultSym = document.getElementById('opt-mult-symbol');
  const optTableFormat = document.getElementById('opt-table-format');
  const optBulletStyle = document.getElementById('opt-bullet-style');
  const optStripMarkdown = document.getElementById('opt-strip-markdown');
  const optCleanUnits = document.getElementById('opt-clean-units');

  // Stats Elements
  const statFormulas = document.getElementById('stat-formulas');
  const statTables = document.getElementById('stat-tables');
  const statWords = document.getElementById('stat-words');
  const statChars = document.getElementById('stat-chars');
  const inputCharsEl = document.getElementById('input-char-count');
  const outputCharsEl = document.getElementById('output-char-count');
  const statProcTime = document.getElementById('stat-proc-time');

  // Symbol Toolbar
  const symbolToolbar = document.getElementById('symbol-toolbar');

  // Toast Notification
  const toastEl = document.getElementById('toast');

  // Storage Keys for Browser Cache Persistence
  const STORAGE_KEYS = {
    THEME: 'abner_latex_theme',
    TEXT: 'abner_latex_text',
    MODE: 'abner_latex_mode',
    TAB: 'abner_latex_tab',
    OPTIONS: 'abner_latex_options'
  };

  // Current State
  let currentMode = 'ascii';
  let activeOutputTab = 'plain'; // 'plain' or 'rendered'
  let debounceTimer = null;

  // Save text to browser cache
  function saveUserText() {
    try {
      localStorage.setItem(STORAGE_KEYS.TEXT, inputEl.value);
    } catch (e) {
      console.warn('Could not save text to cache:', e);
    }
  }

  // Save settings & active mode/tab to browser cache
  function saveUserSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, currentMode);
      localStorage.setItem(STORAGE_KEYS.TAB, activeOutputTab);

      const options = {
        autoConvert: autoConvertToggle ? autoConvertToggle.checked : true,
        superStyle: optSuperStyle ? optSuperStyle.value : (currentMode === 'unicode' ? 'unicode' : 'ascii'),
        multSym: optMultSym ? optMultSym.value : (currentMode === 'unicode' ? ' * ' : '*'),
        tableFormat: optTableFormat ? optTableFormat.value : 'tsv',
        bulletStyle: optBulletStyle ? optBulletStyle.value : 'tab',
        stripMarkdown: optStripMarkdown ? optStripMarkdown.checked : true,
        cleanUnits: optCleanUnits ? optCleanUnits.checked : true
      };
      localStorage.setItem(STORAGE_KEYS.OPTIONS, JSON.stringify(options));
    } catch (e) {
      console.warn('Could not save settings to cache:', e);
    }
  }

  // Provided Sample Data (Matches User Request)
  const PROVIDED_EXAMPLE = `* **Protons ($p^+$)**: Positively charged particles located within the central atomic nucleus. Each proton carries an absolute charge of $+1.6022 \\times 10^{-19}\\text{ C}$ (relative atomic charge of $+1$).
* **Neutrons ($n^0$)**: Uncharged neutral particles located within the nucleus alongside protons. They possess no electric charge ($0\\text{ C}$).
* **Electrons ($e^-$)**: Negatively charged particles revolving around the central nucleus. Each electron carries an absolute charge of $-1.6022 \\times 10^{-19}\\text{ C}$ (relative atomic charge of $-1$).

The total mass of an atom is concentrated almost entirely within its dense, central nucleus, while revolving electrons occupy the peripheral regions surrounding the nucleus.

| Subatomic Particle | Symbol | Absolute Charge ($\\text{C}$)        | Relative Charge | Nucleus / Orbit Location |
| ------------------ | ------ | ------------------------------------ | --------------- | ------------------------ |
| **Proton**         | $p^+$  | $+1.6022 \\times 10^{-19}\\text{ C}$ | $+1$            | Inside Nucleus           |
| **Neutron**        | $n^0$  | $0\\text{ C}$                        | $0$             | Inside Nucleus           |
| **Electron**       | $e^-$  | $-1.6022 \\times 10^{-19}\\text{ C}$ | $-1$            | Outside Nucleus (Orbits) |`;

  // Initialize Theme
  function initTheme() {
    const savedTheme = localStorage.getItem('abner_latex_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      themeToggleBtn.title = "Switch to Dark Theme";
    } else {
      themeToggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      themeToggleBtn.title = "Switch to Light Theme";
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('abner_latex_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next} theme`);
    });
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = `toast show ${type === 'success' ? 'toast-success' : ''}`;
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // Get Current Conversion Options
  function getConversionOptions() {
    return {
      mode: currentMode,
      superscriptStyle: optSuperStyle ? optSuperStyle.value : (currentMode === 'unicode' ? 'unicode' : 'ascii'),
      multiplicationSymbol: optMultSym ? optMultSym.value : (currentMode === 'unicode' ? ' * ' : '*'),
      compactMultiply: currentMode === 'ascii',
      tableFormat: optTableFormat ? optTableFormat.value : 'tsv',
      bulletStyle: optBulletStyle ? optBulletStyle.value : 'tab',
      stripMarkdown: optStripMarkdown ? optStripMarkdown.checked : true,
      cleanUnits: optCleanUnits ? optCleanUnits.checked : true,
      trimExtraBlankLines: true
    };
  }

  // Main Conversion Trigger
  function performConversion() {
    const rawInput = inputEl.value;
    const startTime = performance.now();

    const options = getConversionOptions();
    const converted = window.LatexConverter ? window.LatexConverter.convert(rawInput, options) : rawInput;

    outputEl.value = converted;

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    if (statProcTime) statProcTime.textContent = `${duration}ms`;

    // Update Stats
    updateStats(rawInput, converted);

    // Update Rendered View
    updateRenderedView(rawInput, converted);
  }

  // Calculate and display document stats
  function updateStats(rawInput, converted) {
    if (!window.LatexConverter) return;
    const analysis = window.LatexConverter.analyzeText(rawInput);
    if (statFormulas) statFormulas.textContent = analysis.formulas;
    if (statTables) statTables.textContent = analysis.tables;
    if (statWords) statWords.textContent = analysis.words;
    if (statChars) statChars.textContent = analysis.characters;

    if (inputCharsEl) inputCharsEl.textContent = `${rawInput.length} chars`;
    if (outputCharsEl) outputCharsEl.textContent = `${converted.length} chars`;
  }

  // Render Visual View
  function updateRenderedView(rawInput, convertedText) {
    if (!renderedViewEl) return;
    if (!rawInput.trim()) {
      renderedViewEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:3rem;">No text to render. Enter LaTeX text on the left.</div>';
      return;
    }

    const visualOptions = {
      mode: currentMode,
      superscriptStyle: currentMode === 'ascii' ? 'ascii' : 'unicode',
      multiplicationSymbol: currentMode === 'ascii' ? '*' : ' * ',
      cleanUnits: true,
      stripMarkdown: true,
      isWebPreview: true
    };

    const previewHtml = window.LatexConverter ? window.LatexConverter.convertToWordHtml(rawInput, visualOptions) : '';

    renderedViewEl.innerHTML = `<div class="rendered-content-container">${previewHtml}</div>`;
  }

  /**
   * Copies formatted content into clipboard with both text/html and text/plain
   * Allows direct paste into Microsoft Word, Docs, or plain editors!
   */
  async function copyRichTextToWord(htmlContent, plainTextContent) {
    let copied = false;

    // Method 1: Modern navigator.clipboard with ClipboardItem
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([plainTextContent], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        });
        await navigator.clipboard.write([item]);
        copied = true;
      } catch (err) {
        console.warn('ClipboardItem write warning, trying fallback:', err);
      }
    }

    // Method 2: Fallback using selection range on contenteditable element
    if (!copied) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.contentEditable = 'true';
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.opacity = '0';
        tempDiv.innerHTML = htmlContent;
        document.body.appendChild(tempDiv);

        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        copied = document.execCommand('copy');
        sel.removeAllRanges();
        document.body.removeChild(tempDiv);
      } catch (e) {
        console.error('Copy fallback failed:', e);
      }
    }

    return copied;
  }

  /**
   * Handler for copying formatted content
   */
  async function copyWordFormatted(rawInputText = null) {
    const rawInput = rawInputText || inputEl.value;
    if (!rawInput.trim()) {
      showToast('Nothing to copy!', 'warn');
      return;
    }

    const visualOptions = {
      mode: currentMode,
      superscriptStyle: currentMode === 'ascii' ? 'ascii' : 'unicode',
      multiplicationSymbol: currentMode === 'ascii' ? '*' : ' * ',
      cleanUnits: true,
      stripMarkdown: true,
      isWebPreview: false
    };

    const wordHtml = window.LatexConverter.convertToWordHtml(rawInput, visualOptions);
    const plainText = outputEl.value || window.LatexConverter.convert(rawInput, getConversionOptions());

    const success = await copyRichTextToWord(wordHtml, plainText);
    if (success) {
      showToast('✓ Copied to clipboard! (Ready to paste into Word, Docs, or notes)');
    } else {
      showToast('Could not copy to clipboard. Please check browser permissions.', 'warn');
    }
  }

  // Debounced auto-conversion on input
  inputEl.addEventListener('input', function () {
    saveUserText();
    if (autoConvertToggle && !autoConvertToggle.checked) {
      if (inputCharsEl) inputCharsEl.textContent = `${inputEl.value.length} chars`;
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performConversion, 60);
  });

  // Manual Convert Button
  if (convertBtn) {
    convertBtn.addEventListener('click', () => {
      saveUserText();
      performConversion();
    });
  }

  // Clear Button
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      inputEl.value = '';
      outputEl.value = '';
      try {
        localStorage.removeItem(STORAGE_KEYS.TEXT);
      } catch (e) {}
      if (renderedViewEl) {
        renderedViewEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:3rem;">No text to render. Enter your text on the left.</div>';
      }
      updateStats('', '');
      showToast('Cleared input & output');
      inputEl.focus();
    });
  }

  // Copy Output Button (Works for both Plain Text & Rendered Visual View)
  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      if (activeOutputTab === 'rendered') {
        // In Rendered Visual View: copies rich table & formatted text for Word & other editors
        await copyWordFormatted(inputEl.value);
        return;
      }

      // In Plain Text View: copies plain text
      const text = outputEl.value;
      if (!text) {
        showToast('Nothing to copy!', 'warn');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        showToast('✓ Converted plain text copied to clipboard!');
      } catch (err) {
        outputEl.select();
        document.execCommand('copy');
        showToast('✓ Converted plain text copied to clipboard!');
      }
    });
  }

  // Copy Specific Table (for Excel & Word)
  if (copyTableBtn) {
    copyTableBtn.addEventListener('click', async function () {
      const raw = inputEl.value;
      if (!raw) {
        showToast('No table content available', 'warn');
        return;
      }

      const lines = raw.split(/\r?\n/);
      const tableLines = lines.filter(l => {
        const t = l.trim();
        return (t.startsWith('|') && t.endsWith('|')) || (t.includes('|') && t.split('|').length >= 3);
      });

      if (tableLines.length === 0) {
        showToast('No table lines detected in input', 'warn');
        return;
      }

      const tableBlock = tableLines.join('\n');
      const tableHtml = window.LatexConverter.convertToWordHtml(tableBlock, {
        mode: currentMode,
        superscriptStyle: currentMode === 'ascii' ? 'ascii' : 'unicode',
        isWebPreview: false
      });
      const tsvContent = window.LatexConverter.convertTable(tableLines, {
        mode: currentMode,
        tableFormat: 'tsv',
        superscriptStyle: currentMode === 'ascii' ? 'ascii' : 'unicode'
      });

      const success = await copyRichTextToWord(tableHtml, tsvContent);
      if (success) {
        showToast('✓ Table copied! Pastes as a real table in Word & Excel!');
      } else {
        showToast('Could not copy table', 'warn');
      }
    });
  }

  // Download .txt Button
  if (downloadTxtBtn) {
    downloadTxtBtn.addEventListener('click', function () {
      const text = outputEl.value;
      if (!text) {
        showToast('No content to download', 'warn');
        return;
      }

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'latex-converted-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded as .txt file');
    });
  }

  // Download .tsv Button
  if (downloadTsvBtn) {
    downloadTsvBtn.addEventListener('click', function () {
      const text = outputEl.value;
      if (!text) {
        showToast('No content to download', 'warn');
        return;
      }

      const blob = new Blob([text], { type: 'text/tab-separated-values;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'latex-converted-table.tsv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded as .tsv file');
    });
  }

  // File Upload
  if (uploadBtn && fileUploadInput) {
    uploadBtn.addEventListener('click', () => fileUploadInput.click());

    fileUploadInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        inputEl.value = evt.target.result;
        saveUserText();
        performConversion();
        showToast(`Loaded "${file.name}"`);
      };
      reader.readAsText(file);
    });
  }

  // Mode Selection: ASCII Plain vs Unicode Pritty
  function setMode(mode, save = true) {
    currentMode = mode;
    if (mode === 'ascii') {
      modeAsciiBtn.classList.add('active');
      modeUnicodeBtn.classList.remove('active');
      modeAsciiBtn.setAttribute('aria-selected', 'true');
      modeUnicodeBtn.setAttribute('aria-selected', 'false');
      if (optSuperStyle) optSuperStyle.value = 'ascii';
      if (optMultSym) optMultSym.value = '*';
      showToast('Mode: ASCII Plain');
    } else {
      modeUnicodeBtn.classList.add('active');
      modeAsciiBtn.classList.remove('active');
      modeUnicodeBtn.setAttribute('aria-selected', 'true');
      modeUnicodeBtn.setAttribute('aria-selected', 'false');
      if (optSuperStyle) optSuperStyle.value = 'unicode';
      if (optMultSym) optMultSym.value = ' * ';
      showToast('Mode: Unicode Pritty');
    }
    if (save) {
      saveUserSettings();
    }
    performConversion();
  }

  if (modeAsciiBtn) modeAsciiBtn.addEventListener('click', () => setMode('ascii'));
  if (modeUnicodeBtn) modeUnicodeBtn.addEventListener('click', () => setMode('unicode'));

  // Switch output tab helper
  function switchOutputTab(tab, save = true) {
    activeOutputTab = tab;
    if (tab === 'rendered') {
      tabRenderedBtn?.classList.add('active');
      tabPlainBtn?.classList.remove('active');
      if (outputEl) outputEl.style.display = 'none';
      if (renderedViewEl) renderedViewEl.classList.add('active');
    } else {
      tabPlainBtn?.classList.add('active');
      tabRenderedBtn?.classList.remove('active');
      if (outputEl) outputEl.style.display = 'block';
      if (renderedViewEl) renderedViewEl.classList.remove('active');
    }
    if (save) {
      saveUserSettings();
    }
  }

  // Output Tabs: Plain Text View vs Rendered Visual View
  if (tabPlainBtn) {
    tabPlainBtn.addEventListener('click', () => switchOutputTab('plain'));
  }
  if (tabRenderedBtn) {
    tabRenderedBtn.addEventListener('click', () => switchOutputTab('rendered'));
  }

  // Options Panel Drawer Toggle
  if (optionsToggleBtn && optionsPanel) {
    optionsToggleBtn.addEventListener('click', () => {
      optionsPanel.classList.toggle('open');
      const isOpen = optionsPanel.classList.contains('open');
      optionsToggleBtn.innerHTML = isOpen
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Hide Settings`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Options`;
    });
  }

  // Auto-convert toggle change listener
  if (autoConvertToggle) {
    autoConvertToggle.addEventListener('change', () => {
      saveUserSettings();
      if (autoConvertToggle.checked) {
        performConversion();
      }
    });
  }

  // Change listeners for options
  [optSuperStyle, optMultSym, optTableFormat, optBulletStyle, optStripMarkdown, optCleanUnits].forEach(ctrl => {
    if (ctrl) {
      ctrl.addEventListener('change', () => {
        saveUserSettings();
        performConversion();
      });
    }
  });

  // Symbol Toolbar Insertion
  if (symbolToolbar) {
    symbolToolbar.addEventListener('click', function (e) {
      const chip = e.target.closest('.symbol-chip');
      if (!chip) return;
      const snippet = chip.getAttribute('data-insert');
      if (!snippet) return;

      insertAtCursor(inputEl, snippet);
      saveUserText();
      performConversion();
    });
  }

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + text + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  }

  // Mobile Action Buttons
  const mobileBtnConvert = document.getElementById('mobile-btn-convert');
  const mobileBtnCopy = document.getElementById('mobile-btn-copy');

  if (mobileBtnConvert) {
    mobileBtnConvert.addEventListener('click', () => {
      performConversion();
      outputEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (mobileBtnCopy) {
    mobileBtnCopy.addEventListener('click', () => {
      if (copyBtn) copyBtn.click();
    });
  }

  // Restore user preferences and previous text from browser cache
  function restoreSavedPreferences() {
    try {
      // 1. Restore Mode
      const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
      if (savedMode === 'unicode') {
        currentMode = 'unicode';
        modeUnicodeBtn?.classList.add('active');
        modeAsciiBtn?.classList.remove('active');
        modeUnicodeBtn?.setAttribute('aria-selected', 'true');
        modeAsciiBtn?.setAttribute('aria-selected', 'false');
        if (optSuperStyle) optSuperStyle.value = 'unicode';
        if (optMultSym) optMultSym.value = ' * ';
      } else {
        currentMode = 'ascii';
        modeAsciiBtn?.classList.add('active');
        modeUnicodeBtn?.classList.remove('active');
        modeAsciiBtn?.setAttribute('aria-selected', 'true');
        modeUnicodeBtn?.setAttribute('aria-selected', 'false');
        if (optSuperStyle) optSuperStyle.value = 'ascii';
        if (optMultSym) optMultSym.value = '*';
      }

      // 2. Restore Options
      const savedOptionsStr = localStorage.getItem(STORAGE_KEYS.OPTIONS);
      if (savedOptionsStr) {
        try {
          const opts = JSON.parse(savedOptionsStr);
          if (autoConvertToggle && typeof opts.autoConvert === 'boolean') {
            autoConvertToggle.checked = opts.autoConvert;
          }
          if (optSuperStyle && opts.superStyle) optSuperStyle.value = opts.superStyle;
          if (optMultSym && opts.multSym) optMultSym.value = opts.multSym;
          if (optTableFormat && opts.tableFormat) optTableFormat.value = opts.tableFormat;
          if (optBulletStyle && opts.bulletStyle) optBulletStyle.value = opts.bulletStyle;
          if (optStripMarkdown && typeof opts.stripMarkdown === 'boolean') {
            optStripMarkdown.checked = opts.stripMarkdown;
          }
          if (optCleanUnits && typeof opts.cleanUnits === 'boolean') {
            optCleanUnits.checked = opts.cleanUnits;
          }
        } catch (e) {
          console.warn('Could not parse saved options:', e);
        }
      }

      // 3. Restore Output Tab
      const savedTab = localStorage.getItem(STORAGE_KEYS.TAB);
      if (savedTab === 'rendered') {
        switchOutputTab('rendered', false);
      } else {
        switchOutputTab('plain', false);
      }

      // 4. Restore Previous Text if present in browser cache, otherwise leave initially empty
      const savedText = localStorage.getItem(STORAGE_KEYS.TEXT);
      if (savedText && savedText.trim().length > 0) {
        inputEl.value = savedText;
        performConversion();
      } else {
        inputEl.value = '';
        outputEl.value = '';
        updateStats('', '');
        if (renderedViewEl) {
          renderedViewEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:3rem;">No text to render. Enter your text on the left.</div>';
        }
      }
    } catch (e) {
      console.error('Error loading preferences from browser cache:', e);
      inputEl.value = '';
      outputEl.value = '';
      updateStats('', '');
    }
  }

  // Initialize App
  initTheme();
  restoreSavedPreferences();
});
