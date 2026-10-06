/**
 * LaTeX Converter Engine
 * Converts LaTeX formulas, Markdown, and tabular data into clean, human-readable text and Word-compatible HTML.
 * Website: "LaTeX Converter by Abner"
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LatexConverter = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Unicode superscripts map
  const SUPERSCRIPT_MAP = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ',
    'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ',
    'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ',
    't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ', 'H': 'ᴴ',
    'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ',
    'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ', 'U': 'ᵁ', 'W': 'ᵂ'
  };

  // Unicode subscripts map
  const SUBSCRIPT_MAP = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ',
    'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ',
    's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
  };

  // Greek letters map
  const GREEK_MAP = {
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
    'epsilon': 'ε', 'varepsilon': 'ε', 'zeta': 'ζ', 'eta': 'η',
    'theta': 'θ', 'vartheta': 'θ', 'iota': 'ι', 'kappa': 'κ',
    'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'xi': 'ξ',
    'pi': 'π', 'varpi': 'ϖ', 'rho': 'ρ', 'varrho': 'ϱ',
    'sigma': 'σ', 'varsigma': 'ς', 'tau': 'τ', 'upsilon': 'υ',
    'phi': 'φ', 'varphi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω',
    'Gamma': 'Γ', 'Delta': 'Δ', 'Theta': 'Θ', 'Lambda': 'Λ',
    'Xi': 'Ξ', 'Pi': 'Π', 'Sigma': 'Σ', 'Upsilon': 'Υ',
    'Phi': 'Φ', 'Psi': 'Ψ', 'Omega': 'Ω'
  };

  // Math symbols map
  const SYMBOLS_MAP = {
    'times': '*',
    'cdot': '*',
    'bullet': '•',
    'pm': '±',
    'mp': '∓',
    'div': '/',
    'approx': '≈',
    'sim': '~',
    'simeq': '≃',
    'cong': '≅',
    'equiv': '≡',
    'ne': '≠',
    'neq': '≠',
    'le': '≤',
    'leq': '≤',
    'ge': '≥',
    'geq': '≥',
    'll': '<<',
    'gg': '>>',
    'infty': '∞',
    'to': '→',
    'rightarrow': '→',
    'leftarrow': '←',
    'leftrightarrow': '↔',
    'Rightarrow': '⇒',
    'Leftarrow': '⇐',
    'Leftrightarrow': '⇔',
    'implies': '⇒',
    'iff': '⇔',
    'forall': '∀',
    'exists': '∃',
    'nexists': '∄',
    'in': '∈',
    'notin': '∉',
    'subset': '⊂',
    'supset': '⊃',
    'subseteq': '⊆',
    'supseteq': '⊇',
    'cap': '∩',
    'cup': '∪',
    'land': '∧',
    'lor': '∨',
    'neg': '¬',
    'partial': '∂',
    'nabla': '∇',
    'hbar': 'ħ',
    'ell': 'ℓ',
    'Re': 'Re',
    'Im': 'Im',
    'circ': '°',
    'degree': '°',
    'dots': '...',
    'cdots': '...',
    'ldots': '...',
    'vdots': '⋮',
    'ddots': '⋱',
    'quad': '  ',
    'qquad': '    ',
    'enspace': ' ',
    'space': ' '
  };

  // Default configuration options
  const DEFAULT_OPTIONS = {
    mode: 'ascii',              // 'ascii' (Exact user prompt format) | 'unicode' (Image 2 style)
    superscriptStyle: 'ascii',  // 'ascii' (10^(-19), p^+) | 'unicode' (10⁻¹⁹, p⁺)
    multiplicationSymbol: '*', // '*' | ' * ' | '×' | ' × ' | '·'
    compactMultiply: true,      // true: 1.6022*10 (no spaces around * in ascii mode)
    tableFormat: 'tsv',         // 'tsv' (Tab-separated) | 'spaced' (Aligned text) | 'csv' | 'markdown'
    bulletStyle: 'tab',         // 'tab' (\t Indent) | 'bullet' (• ) | 'dash' (- ) | 'keep'
    stripMarkdown: true,        // Strip **bold**, *italic*, headers, etc.
    cleanUnits: true,           // E.g. $0\text{ C}$ -> 0C
    fractionFormat: 'inline',   // 'inline' (a/b) | 'parens' ((a)/(b))
    rootFormat: 'func',         // 'func' (sqrt(x)) | 'symbol' (√(x))
    removeDollarSigns: true,    // Remove $ wrappers
    trimExtraBlankLines: true   // Collapse 2+ blank lines into single blank line
  };

  function toSuperscriptUnicode(str) {
    return str.split('').map(ch => SUPERSCRIPT_MAP[ch] || ch).join('');
  }

  function toSubscriptUnicode(str) {
    return str.split('').map(ch => SUBSCRIPT_MAP[ch] || ch).join('');
  }

  /**
   * Cleans and converts an individual LaTeX formula (content inside $...$ or $$...$$)
   * GUARANTEES that all $ signs are stripped!
   */
  function convertMathExpression(expr, options = {}) {
    if (!expr) return '';
    let s = expr.trim();
    if (!s) return '';

    // Strip any accidental leading or trailing dollar signs
    s = s.replace(/^\$+|\$+$/g, '').trim();

    const isUnicode = options.mode === 'unicode' || options.superscriptStyle === 'unicode';

    // Determine multiplication symbol and spacing
    let multSym = options.multiplicationSymbol;
    if (!multSym) {
      multSym = isUnicode ? '×' : '*';
    }

    // Special unit handling:
    // e.g., $0\text{ C}$ -> "0C"
    // e.g., $0\text{C}$ -> "0C"
    // e.g., $10^{-19}\text{ C}$ -> "10^{-19} C"
    if (options.cleanUnits !== false) {
      // 0\text{ C} -> 0C
      s = s.replace(/([0-9])\s*\\text\{\s*([A-Za-z]+)\s*\}/g, '$1$2');
      // After ^{...}\text{ C} -> ^{...} C
      s = s.replace(/\}\s*\\text\{\s*([A-Za-z]+)\s*\}/g, '} $1');
      // Absolute charge ($\text{C}$) -> (C)
      s = s.replace(/^\\text\{\s*([A-Za-z]+)\s*\}$/g, '$1');
    }

    // 1. Text wrappers inside math: \text{...}, \mathrm{...}, \mathbf{...}, etc.
    s = s.replace(/\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\s*\{([^{}]*)\}/g, '$1');
    while (/\\(?:text|mathrm|mathbf)\s*\{([^{}]*)\}/.test(s)) {
      s = s.replace(/\\(?:text|mathrm|mathbf)\s*\{([^{}]*)\}/g, '$1');
    }

    // 2. Multiplication: \times and \cdot
    if (options.compactMultiply && options.mode === 'ascii') {
      // Replace with compact * (e.g. 1.6022*10)
      s = s.replace(/\s*\\times\s*/g, '*');
      s = s.replace(/\s*\\cdot\s*/g, '*');
    } else {
      const formattedMult = multSym.includes(' ') ? multSym : ` ${multSym} `;
      s = s.replace(/\s*\\times\s*/g, formattedMult);
      s = s.replace(/\s*\\cdot\s*/g, isUnicode ? ' · ' : formattedMult);
    }

    // 3. Fractions: \frac{a}{b}, \dfrac{a}{b}, \tfrac{a}{b}
    let fracRegex = /\\(?:d|t)?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/;
    while (fracRegex.test(s)) {
      s = s.replace(fracRegex, function (_, num, den) {
        num = num.trim();
        den = den.trim();
        if (options.fractionFormat === 'parens' || /[\+\-\*\/\s]/.test(num) || /[\+\-\*\/\s]/.test(den)) {
          return `(${num})/(${den})`;
        }
        return `${num}/${den}`;
      });
    }

    // 4. Roots: \sqrt[n]{x} and \sqrt{x}
    s = s.replace(/\\sqrt\s*\[(.*?)\]\s*\{(.*?)\}/g, function (_, n, x) {
      if (options.rootFormat === 'symbol' || isUnicode) {
        return `${toSuperscriptUnicode(n)}√(${x})`;
      }
      return `${n}-root(${x})`;
    });

    s = s.replace(/\\sqrt\s*\{(.*?)\}/g, function (_, x) {
      if (options.rootFormat === 'symbol' || isUnicode) {
        return `√(${x})`;
      }
      return `sqrt(${x})`;
    });

    // 5. Greek letters
    for (const [name, char] of Object.entries(GREEK_MAP)) {
      const reg = new RegExp(`\\\\${name}\\b`, 'g');
      s = s.replace(reg, char);
    }

    // 6. Common symbols
    for (const [name, char] of Object.entries(SYMBOLS_MAP)) {
      if (name === 'times' || name === 'cdot') continue;
      const reg = new RegExp(`\\\\${name}\\b`, 'g');
      s = s.replace(reg, char);
    }

    // 7. Delimiters
    s = s.replace(/\\left\s*\\\{/g, '{');
    s = s.replace(/\\right\s*\\\}/g, '}');
    s = s.replace(/\\left\s*\(/g, '(');
    s = s.replace(/\\right\s*\)/g, ')');
    s = s.replace(/\\left\s*\[/g, '[');
    s = s.replace(/\\right\s*\]/g, ']');
    s = s.replace(/\\left\s*\|/g, '|');
    s = s.replace(/\\right\s*\|/g, '|');
    s = s.replace(/\\\{/g, '{');
    s = s.replace(/\\\}/g, '}');

    // 8. Accents / vectors
    s = s.replace(/\\vec\s*\{([^{}]+)\}/g, isUnicode ? '$1\u20D7' : 'vec($1)');
    s = s.replace(/\\bar\s*\{([^{}]+)\}/g, isUnicode ? '$1\u0304' : 'bar($1)');
    s = s.replace(/\\hat\s*\{([^{}]+)\}/g, isUnicode ? '$1\u0302' : 'hat($1)');
    s = s.replace(/\\tilde\s*\{([^{}]+)\}/g, isUnicode ? '$1\u0303' : 'tilde($1)');

    // 9. Calculus & Sums
    s = s.replace(/\\sum(?:_\{([^{}]+)\}|_(\S+))?(?:\^\{([^{}]+)\}|\^(\S+))?/g, function (_, sub1, sub2, sup1, sup2) {
      const sub = sub1 || sub2;
      const sup = sup1 || sup2;
      if (sub && sup) return `sum(${sub}..${sup})`;
      if (sub) return `sum(${sub})`;
      return isUnicode ? 'Σ' : 'sum';
    });
    s = s.replace(/\\int(?:_\{([^{}]+)\}|_(\S+))?(?:\^\{([^{}]+)\}|\^(\S+))?/g, function (_, sub1, sub2, sup1, sup2) {
      const sub = sub1 || sub2;
      const sup = sup1 || sup2;
      if (sub && sup) return `int(${sub}..${sup})`;
      if (sub) return `int(${sub})`;
      return isUnicode ? '∫' : 'int';
    });

    // 10. Math functions
    s = s.replace(/\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|ln|log|exp|det|dim|ker|deg|gcd|min|max|lim|sup|inf)\b/g, '$1');

    // 11. Superscripts & Subscripts
    if (isUnicode) {
      // Unicode mode: e.g. p⁺, n⁰, e⁻, 10⁻¹⁹
      s = s.replace(/\^\{([^{}]+)\}/g, function (_, exp) {
        return toSuperscriptUnicode(exp);
      });
      s = s.replace(/\^([0-9\+\-a-zA-Z])/g, function (_, ch) {
        return SUPERSCRIPT_MAP[ch] || `^${ch}`;
      });

      s = s.replace(/_\{([^{}]+)\}/g, function (_, sub) {
        return toSubscriptUnicode(sub);
      });
      s = s.replace(/_([0-9\+\-a-zA-Z])/g, function (_, ch) {
        return SUBSCRIPT_MAP[ch] || `_${ch}`;
      });
    } else {
      // ASCII mode: e.g. p^+, n^0, e^-, 10^(-19)
      s = s.replace(/\^\{([^{}]+)\}/g, function (_, exp) {
        if (exp.length > 1 || /^[\+\-]/.test(exp)) {
          return `^(${exp})`;
        }
        return `^${exp}`;
      });

      s = s.replace(/_\{([^{}]+)\}/g, function (_, sub) {
        if (sub.length > 1) {
          return `_(${sub})`;
        }
        return `_${sub}`;
      });
    }

    // 12. Cleanup remaining backslashes
    s = s.replace(/\\([\{\}\$\%])/g, '$1');
    s = s.replace(/\\,/g, ' ');
    s = s.replace(/\\;/g, ' ');
    s = s.replace(/\\!/g, '');
    s = s.replace(/\\ /g, ' ');
    s = s.replace(/\\([a-zA-Z]+)/g, '$1');

    // Remove any rogue dollar signs
    s = s.replace(/\$/g, '');

    // Final trim of double spaces
    s = s.replace(/\s+/g, ' ').trim();

    return s;
  }

  /**
   * Helper to strip Markdown formatting (bold, italics, inline code, links)
   */
  function stripMarkdownStyling(text) {
    if (!text) return '';
    let res = text;
    // Bold & italic: ***text***, ___text___
    res = res.replace(/(\*\*\*|___)(.*?)\1/g, '$2');
    // Bold: **text**, __text__
    res = res.replace(/(\*\*|__)(.*?)\1/g, '$2');
    // Italic: *text*, _text_
    res = res.replace(/(^|[^\w])\*([^\*]+)\*(?=[^\w]|$)/g, '$1$2');
    res = res.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1$2');
    // Strikethrough: ~~text~~
    res = res.replace(/~~(.*?)~~/g, '$1');
    // Inline code: `text`
    res = res.replace(/`([^`]+)`/g, '$1');
    // Links: [text](url) -> text
    res = res.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    return res;
  }

  /**
   * Converts Markdown tables into tab-separated, CSV, or formatted text
   */
  function convertTable(tableLines, options = {}) {
    if (!tableLines || tableLines.length === 0) return '';

    const parsedRows = [];
    for (let line of tableLines) {
      line = line.trim();
      if (!line) continue;
      // Skip markdown separator row like | --- | :---: | ---: |
      if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line)) {
        continue;
      }

      // Split row by pipe
      let cells = line.split('|');
      if (cells.length > 0 && cells[0].trim() === '') cells.shift();
      if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();

      const processedCells = cells.map(cell => {
        let cellText = cell.trim();
        cellText = convertInlineMath(cellText, options);
        if (options.stripMarkdown !== false) {
          cellText = stripMarkdownStyling(cellText);
        }
        return cellText.trim();
      });

      parsedRows.push(processedCells);
    }

    if (parsedRows.length === 0) return '';

    // Format based on options
    if (options.tableFormat === 'tsv') {
      return parsedRows.map(row => row.join('\t')).join('\n');
    } else if (options.tableFormat === 'csv') {
      return parsedRows.map(row => {
        return row.map(cell => {
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',');
      }).join('\n');
    } else if (options.tableFormat === 'spaced') {
      const colWidths = [];
      parsedRows.forEach(row => {
        row.forEach((cell, i) => {
          colWidths[i] = Math.max(colWidths[i] || 0, cell.length);
        });
      });

      return parsedRows.map(row => {
        return row.map((cell, i) => cell.padEnd(colWidths[i] + 3)).join('').trimEnd();
      }).join('\n');
    } else if (options.tableFormat === 'markdown') {
      const header = '| ' + parsedRows[0].join(' | ') + ' |';
      const sep = '| ' + parsedRows[0].map(() => '---').join(' | ') + ' |';
      const body = parsedRows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n');
      return body ? `${header}\n${sep}\n${body}` : header;
    }

    return parsedRows.map(row => row.join('\t')).join('\n');
  }

  /**
   * Convert inline LaTeX inside a string: $...$ or \(...\)
   */
  function convertInlineMath(text, options = {}) {
    if (!text) return '';

    // Handle \( ... \)
    text = text.replace(/\\\((.*?)\\\)/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    // Handle $$ ... $$ if accidentally inline
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    // Handle $...$ (robust regex matching content between unescaped $)
    text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    return text;
  }

  /**
   * Convert block math: $$...$$ or \[...\] or \begin{equation}...\end{equation}
   */
  function convertBlockMath(text, options = {}) {
    if (!text) return '';

    // Handle $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    // Handle \[...\]
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    // Handle equations
    text = text.replace(/\\begin\{(?:equation|align|gather|split|multline)\*?\}([\s\S]*?)\\end\{(?:equation|align|gather|split|multline)\*?\}/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    return text;
  }

  /**
   * Converts a single line of text, handling inline math, markdown styling, etc.
   */
  function convertLine(line, options = {}) {
    if (!line) return '';
    let res = convertInlineMath(line, options);
    if (options.stripMarkdown !== false) {
      res = stripMarkdownStyling(res);
    }
    // Clean any remaining raw backslashes for text formatting
    res = res.replace(/\\text\s*\{([^{}]*)\}/g, '$1');
    res = res.replace(/\\mathrm\s*\{([^{}]*)\}/g, '$1');
    return res;
  }

  /**
   * Main Conversion Function (Returns Plain Text)
   */
  function convert(input, customOptions = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const options = Object.assign({}, DEFAULT_OPTIONS, customOptions);

    if (options.mode === 'unicode') {
      if (!customOptions.superscriptStyle) options.superscriptStyle = 'unicode';
      if (!customOptions.multiplicationSymbol) options.multiplicationSymbol = ' * ';
      if (!customOptions.rootFormat) options.rootFormat = 'symbol';
      if (customOptions.compactMultiply === undefined) options.compactMultiply = false;
    } else if (options.mode === 'ascii') {
      if (!customOptions.superscriptStyle) options.superscriptStyle = 'ascii';
      if (!customOptions.multiplicationSymbol) options.multiplicationSymbol = '*';
      if (!customOptions.rootFormat) options.rootFormat = 'func';
      if (customOptions.compactMultiply === undefined) options.compactMultiply = true;
    }

    // Pre-process block math
    let text = convertBlockMath(input, options);

    const lines = text.split(/\r?\n/);
    const outputLines = [];
    let tableBuffer = [];
    let insideTable = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      const isTableLine = (trimmed.startsWith('|') && trimmed.endsWith('|')) ||
                          (trimmed.includes('|') && trimmed.split('|').length >= 3);

      if (isTableLine) {
        insideTable = true;
        tableBuffer.push(line);
      } else {
        if (insideTable) {
          const convertedTable = convertTable(tableBuffer, options);
          if (convertedTable) {
            outputLines.push(convertedTable);
          }
          tableBuffer = [];
          insideTable = false;
        }

        let processedLine = line;

        // Bullet point detection: `* item`, `- item`, `+ item`
        const bulletMatch = processedLine.match(/^(\s*)([\*\-\+])\s+(.*)$/);
        if (bulletMatch) {
          const indent = bulletMatch[1];
          let content = bulletMatch[3];

          content = convertInlineMath(content, options);

          if (options.stripMarkdown) {
            content = stripMarkdownStyling(content);
          }

          if (options.bulletStyle === 'tab') {
            processedLine = '\t' + content;
          } else if (options.bulletStyle === 'bullet') {
            processedLine = indent + '• ' + content;
          } else if (options.bulletStyle === 'dash') {
            processedLine = indent + '- ' + content;
          } else {
            processedLine = indent + bulletMatch[2] + ' ' + content;
          }
        } else {
          processedLine = convertInlineMath(processedLine, options);

          if (options.stripMarkdown) {
            processedLine = processedLine.replace(/^#{1,6}\s+/, '');
            processedLine = stripMarkdownStyling(processedLine);
          }
        }

        outputLines.push(processedLine);
      }
    }

    if (insideTable && tableBuffer.length > 0) {
      const convertedTable = convertTable(tableBuffer, options);
      if (convertedTable) {
        outputLines.push(convertedTable);
      }
    }

    let result = outputLines.join('\n');

    result = result.replace(/\\text\s*\{([^{}]*)\}/g, '$1');
    result = result.replace(/\\mathrm\s*\{([^{}]*)\}/g, '$1');

    if (options.trimExtraBlankLines) {
      result = result.replace(/\n{3,}/g, '\n\n');
    }

    return result;
  }

  /**
   * Generates Microsoft Word & Docs compatible Rich HTML.
   * Features inline styles so that when pasted into Word:
   * - Tables become genuine native Microsoft Word tables with styled borders and cell padding.
   * - Lists become genuine Word bullet lists.
   * - Bold text and formulas are rendered cleanly with ZERO dollar signs.
   */
  function convertToWordHtml(input, customOptions = {}) {
    if (!input || typeof input !== 'string') return '';

    const options = Object.assign({}, DEFAULT_OPTIONS, {
      mode: 'unicode',
      superscriptStyle: 'unicode',
      multiplicationSymbol: ' * ',
      cleanUnits: true,
      stripMarkdown: true
    }, customOptions);

    // Pre-process block math
    let text = convertBlockMath(input, options);
    const lines = text.split(/\r?\n/);

    let html = '';
    let insideTable = false;
    let tableBuffer = [];
    let insideList = false;

    // Word-compatible inline CSS constants
    const TABLE_STYLE = 'border-collapse: collapse; width: 100%; max-width: 100%; margin: 12pt 0; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; border: 1.5pt solid #4a5568;';
    const TH_STYLE = 'border: 1pt solid #4a5568; background-color: #f1f5f9; color: #0f172a; font-weight: bold; padding: 7pt 10pt; text-align: left; vertical-align: middle;';
    const TD_STYLE = 'border: 1pt solid #cbd5e1; padding: 7pt 10pt; text-align: left; vertical-align: middle; color: #1e293b;';
    const UL_STYLE = 'margin: 6pt 0 12pt 0; padding-left: 20pt; list-style-type: disc; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; line-height: 1.45;';
    const LI_STYLE = 'margin-bottom: 5pt; color: #1e293b;';
    const P_STYLE = 'margin: 0 0 10pt 0; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #1e293b;';

    function flushTable(linesArray) {
      if (!linesArray || linesArray.length === 0) return '';
      const rows = [];
      for (let l of linesArray) {
        l = l.trim();
        if (!l || /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(l)) continue;
        let cells = l.split('|');
        if (cells.length > 0 && cells[0].trim() === '') cells.shift();
        if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();

        rows.push(cells.map(c => {
          let cellText = c.trim();
          // Convert math formulas cleanly
          cellText = convertInlineMath(cellText, options);
          // Format bold to strong tags
          cellText = cellText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          cellText = stripMarkdownStyling(cellText);
          // Strip any stray dollar signs
          cellText = cellText.replace(/\$/g, '');
          return cellText.trim();
        }));
      }

      if (rows.length === 0) return '';

      // If rendering for web preview, use CSS theme classes so dark/light mode looks gorgeous
      if (options.isWebPreview) {
        let tHtml = '<div class="rendered-table-wrapper"><table class="rendered-table">';
        tHtml += '<thead><tr>';
        rows[0].forEach(cell => {
          tHtml += `<th>${cell}</th>`;
        });
        tHtml += '</tr></thead>';

        if (rows.length > 1) {
          tHtml += '<tbody>';
          for (let r = 1; r < rows.length; r++) {
            tHtml += '<tr>';
            rows[r].forEach(cell => {
              tHtml += `<td>${cell}</td>`;
            });
            tHtml += '</tr>';
          }
          tHtml += '</tbody>';
        }
        tHtml += '</table></div>';
        return tHtml;
      }

      // Word export: use inline styles optimized for Word document pasting
      let tHtml = `<table border="1" cellpadding="8" cellspacing="0" style="${TABLE_STYLE}">`;
      // Header
      tHtml += '<thead><tr style="background-color: #f1f5f9;">';
      rows[0].forEach(cell => {
        tHtml += `<th style="${TH_STYLE}">${cell}</th>`;
      });
      tHtml += '</tr></thead>';

      // Rows
      if (rows.length > 1) {
        tHtml += '<tbody>';
        for (let r = 1; r < rows.length; r++) {
          const bg = r % 2 === 0 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;';
          tHtml += `<tr style="${bg}">`;
          rows[r].forEach(cell => {
            tHtml += `<td style="${TD_STYLE}">${cell}</td>`;
          });
          tHtml += '</tr>';
        }
        tHtml += '</tbody>';
      }
      tHtml += '</table>';
      return tHtml;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      const isTableLine = (trimmed.startsWith('|') && trimmed.endsWith('|')) ||
                          (trimmed.includes('|') && trimmed.split('|').length >= 3);

      if (isTableLine) {
        if (insideList) {
          html += '</ul>';
          insideList = false;
        }
        insideTable = true;
        tableBuffer.push(line);
      } else {
        if (insideTable) {
          html += flushTable(tableBuffer);
          tableBuffer = [];
          insideTable = false;
        }

        const bulletMatch = line.match(/^(\s*)([\*\-\+])\s+(.*)$/);
        if (bulletMatch) {
          if (!insideList) {
            html += options.isWebPreview ? '<ul class="rendered-bullet-list">' : `<ul style="${UL_STYLE}">`;
            insideList = true;
          }
          let itemText = bulletMatch[3];
          // 1. Convert math expressions inside the line!
          itemText = convertInlineMath(itemText, options);
          // 2. Convert markdown bold **text** to <strong>text</strong>
          itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          // 3. Remove remaining raw markdown
          itemText = stripMarkdownStyling(itemText);
          // 4. Ensure no dollar signs remain
          itemText = itemText.replace(/\$/g, '');

          html += options.isWebPreview ? `<li>${itemText}</li>` : `<li style="${LI_STYLE}">${itemText}</li>`;
        } else {
          if (insideList) {
            html += '</ul>';
            insideList = false;
          }

          if (trimmed === '') {
            // empty line
          } else {
            let pText = line;
            pText = convertInlineMath(pText, options);
            pText = pText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            pText = stripMarkdownStyling(pText);
            pText = pText.replace(/^#{1,6}\s+/, '');
            pText = pText.replace(/\$/g, '');

            html += options.isWebPreview ? `<p class="rendered-paragraph">${pText}</p>` : `<p style="${P_STYLE}">${pText}</p>`;
          }
        }
      }
    }

    if (insideList) {
      html += '</ul>';
    }

    if (insideTable && tableBuffer.length > 0) {
      html += flushTable(tableBuffer);
    }

    return html;
  }

  /**
   * Diagnostic / Analysis tool: Counts formulas, tables, symbols in text
   */
  function analyzeText(input) {
    if (!input) return { formulas: 0, tables: 0, words: 0, characters: 0, lines: 0 };
    const inlineMath = (input.match(/(?<!\\)\$[^\$\n]+?(?<!\\)\$/g) || []).length;
    const blockMath = (input.match(/\$\$[\s\S]*?\$\$/g) || []).length +
                      (input.match(/\\\[[\s\S]*?\\\]/g) || []).length;
    const tableSeparators = (input.match(/\|?\s*:?-+:?\s*\|/g) || []).length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const characters = input.length;
    const lines = input.split(/\r?\n/).length;

    return {
      formulas: inlineMath + blockMath,
      tables: tableSeparators > 0 ? 1 : 0,
      words: words,
      characters: characters,
      lines: lines
    };
  }

  return {
    convert,
    convertLine,
    convertInlineMath,
    convertBlockMath,
    convertMathExpression,
    convertTable,
    convertToWordHtml,
    stripMarkdownStyling,
    analyzeText,
    DEFAULT_OPTIONS,
    SUPERSCRIPT_MAP,
    SUBSCRIPT_MAP,
    GREEK_MAP,
    SYMBOLS_MAP
  };
});
