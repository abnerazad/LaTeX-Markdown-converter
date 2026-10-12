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

  const SUBSCRIPT_MAP = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ',
    'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ',
    's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
  };

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

  const SYMBOLS_MAP_UNICODE = {
    'times': '×',
    'cdot': '·',
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
    'space': ' ',
    'lfloor': '⌊',
    'rfloor': '⌋',
    'lceil': '⌈',
    'rceil': '⌉'
  };

  const SYMBOLS_MAP_ASCII = {
    'times': '*',
    'cdot': '*',
    'bullet': '*',
    'pm': '+/-',
    'mp': '-/+',
    'div': '/',
    'approx': '~=',
    'sim': '~',
    'simeq': '~=',
    'cong': '==',
    'equiv': '===',
    'ne': '!=',
    'neq': '!=',
    'le': '<=',
    'leq': '<=',
    'ge': '>=',
    'geq': '>=',
    'll': '<<',
    'gg': '>>',
    'infty': 'inf',
    'to': '->',
    'rightarrow': '->',
    'leftarrow': '<-',
    'leftrightarrow': '<->',
    'Rightarrow': '=>',
    'Leftarrow': '<=',
    'Leftrightarrow': '<=>',
    'implies': '=>',
    'iff': '<=>',
    'forall': 'FORALL',
    'exists': 'EXISTS',
    'nexists': 'NOT EXISTS',
    'in': 'IN',
    'notin': 'NOT IN',
    'subset': 'SUBSET',
    'supset': 'SUPERSET',
    'subseteq': '<=',
    'supseteq': '>=',
    'cap': 'INTERSECT',
    'cup': 'UNION',
    'land': 'AND',
    'lor': 'OR',
    'neg': 'NOT',
    'partial': 'd',
    'nabla': 'DEL',
    'hbar': 'h_bar',
    'ell': 'l',
    'Re': 'Re',
    'Im': 'Im',
    'circ': ' deg',
    'degree': ' deg',
    'dots': '...',
    'cdots': '...',
    'ldots': '...',
    'vdots': '...',
    'ddots': '...',
    'quad': '  ',
    'qquad': '    ',
    'enspace': ' ',
    'space': ' ',
    'lfloor': '[|',
    'rfloor': '|]',
    'lceil': '|~',
    'rceil': '~|'
  };

  const DEFAULT_OPTIONS = {
    mode: 'ascii',
    superscriptStyle: 'ascii',
    multiplicationSymbol: '*',
    compactMultiply: true,
    tableFormat: 'tsv',
    bulletStyle: 'tab',
    stripMarkdown: true,
    cleanUnits: true,
    fractionFormat: 'inline',
    rootFormat: 'func',
    removeDollarSigns: true,
    trimExtraBlankLines: true
  };

  function toSuperscriptUnicode(str) {
    return str.split('').map(ch => SUPERSCRIPT_MAP[ch] || ch).join('');
  }

  function toSubscriptUnicode(str) {
    return str.split('').map(ch => SUBSCRIPT_MAP[ch] || ch).join('');
  }

  function convertMathExpression(expr, options = {}) {
    if (!expr) return '';
    let s = expr.trim();
    if (!s) return '';

    s = s.replace(/^\$+|\$+$/g, '').trim();
    s = s.replace(/^\\+\(|\s*\\+\)$/g, '').trim();
    s = s.replace(/^\\+\[|\s*\\+\]$/g, '').trim();

    const isUnicode = options.mode === 'unicode' || options.superscriptStyle === 'unicode';
    const symMap = isUnicode ? SYMBOLS_MAP_UNICODE : SYMBOLS_MAP_ASCII;

    let multSym = options.multiplicationSymbol;
    if (!multSym) {
      multSym = isUnicode ? '×' : '*';
    }

    if (options.cleanUnits !== false) {
      s = s.replace(/([0-9])\s*\\+text\{\s*([A-Za-z]+)\s*\}/g, '$1$2');
      s = s.replace(/\}\s*\\+text\{\s*([A-Za-z]+)\s*\}/g, '} $1');
      s = s.replace(/^\\+text\{\s*([A-Za-z]+)\s*\}$/g, '$1');
    }

    s = s.replace(/\\+(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\s*\{([^{}]*)\}/g, '$1');
    while (/\\+(?:text|mathrm|mathbf)\s*\{([^{}]*)\}/.test(s)) {
      s = s.replace(/\\+(?:text|mathrm|mathbf)\s*\{([^{}]*)\}/g, '$1');
    }

    s = s.replace(/\\+frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, function (_, num, den) {
      num = num.trim();
      den = den.trim();
      const wrapNum = /[+\-*/\s]/.test(num) && !num.startsWith('(');
      const wrapDen = /[+\-*/\s]/.test(den) && !den.startsWith('(');
      const nStr = wrapNum ? `(${num})` : num;
      const dStr = wrapDen ? `(${den})` : den;
      return `${nStr}/${dStr}`;
    });

    s = s.replace(/\\+sqrt(?:\[(.*?)\])?\s*\{([^{}]*)\}/g, function (_, rootIndex, content) {
      content = content.trim();
      if (rootIndex) {
        return `root(${rootIndex}, ${content})`;
      }
      if (isUnicode) {
        return `√(${content})`;
      }
      return `sqrt(${content})`;
    });

    s = s.replace(/\\+left\s*([(\[{|.\\])/g, '$1');
    s = s.replace(/\\+right\s*([)\]}|.\\])/g, '$1');

    s = s.replace(/\^\{([^{}]*)\}/g, function (_, exp) {
      if (isUnicode) {
        return toSuperscriptUnicode(exp);
      }
      return `^(${exp})`;
    });

    s = s.replace(/\^([0-9a-zA-Z\+\-])/g, function (_, exp) {
      if (isUnicode) {
        return toSuperscriptUnicode(exp);
      }
      return `^${exp}`;
    });

    s = s.replace(/_\{([^{}]*)\}/g, function (_, sub) {
      if (isUnicode) {
        return toSubscriptUnicode(sub);
      }
      return `_${sub}`;
    });

    s = s.replace(/_([0-9a-zA-Z\+\-])/g, function (_, sub) {
      if (isUnicode) {
        return toSubscriptUnicode(sub);
      }
      return `_${sub}`;
    });

    s = s.replace(/\\+(log|ln|exp|sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|sinh|cosh|tanh|lim|min|max|sup|inf|arg|det|dim|gcd|deg)\b/g, '$1 ');

    for (const [cmd, sym] of Object.entries(symMap)) {
      const regex = new RegExp('\\\\+' + cmd + '(?![a-zA-Z])', 'g');
      if (cmd === 'times') {
        s = s.replace(regex, multSym);
      } else {
        s = s.replace(regex, sym);
      }
    }

    for (const [cmd, sym] of Object.entries(GREEK_MAP)) {
      const regex = new RegExp('\\\\+' + cmd + '(?![a-zA-Z])', 'g');
      s = s.replace(regex, sym);
    }

    s = s.replace(/\\+([a-zA-Z]+)/g, '$1');
    s = s.replace(/\\+([=+\-*,;:!<>~|\\()\[\]])/g, '$1');

    if (options.compactMultiply && options.mode === 'ascii') {
      s = s.replace(/([0-9\)])\s*\*\s*([0-9\(])/g, '$1*$2');
    }

    s = s.replace(/\$/g, '');
    s = s.replace(/\s+/g, ' ').trim();

    return s;
  }

  function stripMarkdownStyling(text) {
    if (!text) return '';
    let res = text;
    res = res.replace(/\\+`([^`]+)\\+`/g, '$1');
    res = res.replace(/(\*\*\*|___)(.*?)\1/g, '$2');
    res = res.replace(/(\*\*|__)(.*?)\1/g, '$2');
    res = res.replace(/(^|[^\w\s])\*([^\s\*](?:[^*]*?[^\s\*])?)\*(?=[^\w\s]|$)/g, '$1$2');
    res = res.replace(/(^|[^\w\s])_([^\s_](?:[^_]*?[^\s_])?)_(?=[^\w\s]|$)/g, '$1$2');
    res = res.replace(/~~(.*?)~~/g, '$1');
    res = res.replace(/`([^`]+)`/g, '$1');
    res = res.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    return res;
  }

  function convertTable(tableLines, options = {}) {
    if (!tableLines || tableLines.length === 0) return '';

    const parsedRows = [];
    for (let line of tableLines) {
      line = line.trim();
      if (!line) continue;
      
      if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line)) {
        continue;
      }

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

  function convertInlineMath(text, options = {}) {
    if (!text) return '';

    text = text.replace(/\\+\[([\s\S]*?)\\+\]/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    text = text.replace(/\\+\(([\s\S]*?)\\+\)/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    return text;
  }

  function convertBlockMath(text, options = {}) {
    if (!text) return '';

    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    text = text.replace(/\\+\[([\s\S]*?)\\+\]/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    text = text.replace(/\\+begin\{(?:equation|align|gather|split|multline)\*?\}([\s\S]*?)\\+end\{(?:equation|align|gather|split|multline)\*?\}/g, function (_, math) {
      return convertMathExpression(math, options);
    });

    return text;
  }

  function convertLine(line, options = {}) {
    if (!line) return '';
    let res = convertInlineMath(line, options);
    if (options.stripMarkdown !== false) {
      res = stripMarkdownStyling(res);
    }
    res = res.replace(/\\+text\s*\{([^{}]*)\}/g, '$1');
    res = res.replace(/\\+mathrm\s*\{([^{}]*)\}/g, '$1');
    return res;
  }

  function convert(input, customOptions = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const options = Object.assign({}, DEFAULT_OPTIONS, customOptions);

    if (options.mode === 'unicode') {
      if (!customOptions.superscriptStyle) options.superscriptStyle = 'unicode';
      if (!customOptions.multiplicationSymbol) options.multiplicationSymbol = '×';
      if (!customOptions.rootFormat) options.rootFormat = 'symbol';
      if (customOptions.compactMultiply === undefined) options.compactMultiply = false;
    } else if (options.mode === 'ascii') {
      if (!customOptions.superscriptStyle) options.superscriptStyle = 'ascii';
      if (!customOptions.multiplicationSymbol) options.multiplicationSymbol = '*';
      if (!customOptions.rootFormat) options.rootFormat = 'func';
      if (customOptions.compactMultiply === undefined) options.compactMultiply = true;
    }

    let text = convertBlockMath(input, options);

    const lines = text.split(/\r?\n/);
    const outputLines = [];
    let tableBuffer = [];
    let insideTable = false;
    let insideCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      const normalizedFence = trimmed.replace(/\\+`/g, '`');
      if (/^```|^~~~/.test(normalizedFence)) {
        if (insideTable) {
          const convertedTable = convertTable(tableBuffer, options);
          if (convertedTable) outputLines.push(convertedTable);
          tableBuffer = [];
          insideTable = false;
        }
        insideCodeBlock = !insideCodeBlock;
        outputLines.push(line.replace(/\\+`/g, '`'));
        continue;
      }

      if (insideCodeBlock) {
        outputLines.push(line);
        continue;
      }

      if (/^(\s*[-*_]\s*){3,}$/.test(trimmed)) {
        if (insideTable) {
          const convertedTable = convertTable(tableBuffer, options);
          if (convertedTable) outputLines.push(convertedTable);
          tableBuffer = [];
          insideTable = false;
        }
        continue;
      }

      const isTableLine = (trimmed.startsWith('|') && trimmed.endsWith('|')) ||
                          (trimmed.startsWith('|') && trimmed.includes('|') && trimmed.split('|').length >= 3);

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

    result = result.replace(/\\+text\s*\{([^{}]*)\}/g, '$1');
    result = result.replace(/\\+mathrm\s*\{([^{}]*)\}/g, '$1');

    if (options.trimExtraBlankLines) {
      result = result.replace(/\n{3,}/g, '\n\n');
    }

    return result;
  }

  function convertToWordHtml(input, customOptions = {}) {
    if (!input || typeof input !== 'string') return '';

    const options = Object.assign({}, DEFAULT_OPTIONS, {
      mode: 'unicode',
      superscriptStyle: 'unicode',
      multiplicationSymbol: ' × ',
      cleanUnits: true,
      stripMarkdown: true
    }, customOptions);

    let text = convertBlockMath(input, options);
    const lines = text.split(/\r?\n/);

    let html = '';
    let insideTable = false;
    let tableBuffer = [];
    let insideList = false;
    let insideCodeBlock = false;
    let codeBuffer = [];

    const TABLE_STYLE = 'border-collapse: collapse; width: 100%; max-width: 100%; margin: 12pt 0; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; border: 1.5pt solid #4a5568;';
    const TH_STYLE = 'border: 1pt solid #4a5568; background-color: #f1f5f9; color: #0f172a; font-weight: bold; padding: 7pt 10pt; text-align: left; vertical-align: middle;';
    const TD_STYLE = 'border: 1pt solid #cbd5e1; padding: 7pt 10pt; text-align: left; vertical-align: middle; color: #1e293b;';
    const UL_STYLE = 'margin: 6pt 0 12pt 0; padding-left: 20pt; list-style-type: disc; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; line-height: 1.45;';
    const LI_STYLE = 'margin-bottom: 5pt; color: #1e293b;';
    const P_STYLE = 'margin: 0 0 10pt 0; font-family: Calibri, Aptos, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #1e293b;';
    const PRE_STYLE = 'background-color: #f8fafc; border: 1pt solid #cbd5e1; border-radius: 4pt; padding: 8pt 12pt; margin: 8pt 0 12pt 0; font-family: Consolas, Courier New, monospace; font-size: 10pt; color: #0f172a; white-space: pre; overflow-x: auto;';

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
          cellText = convertInlineMath(cellText, options);
          cellText = cellText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          cellText = stripMarkdownStyling(cellText);
          cellText = cellText.replace(/\$/g, '');
          return cellText.trim();
        }));
      }

      if (rows.length === 0) return '';

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

      let tHtml = `<table border="1" cellpadding="8" cellspacing="0" style="${TABLE_STYLE}">`;
      tHtml += '<thead><tr style="background-color: #f1f5f9;">';
      rows[0].forEach(cell => {
        tHtml += `<th style="${TH_STYLE}">${cell}</th>`;
      });
      tHtml += '</tr></thead>';

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

      const normalizedFence = trimmed.replace(/\\+`/g, '`');
      if (/^```|^~~~/.test(normalizedFence)) {
        if (insideList) {
          html += '</ul>';
          insideList = false;
        }
        if (insideTable) {
          html += flushTable(tableBuffer);
          tableBuffer = [];
          insideTable = false;
        }
        if (insideCodeBlock) {
          const codeContent = codeBuffer.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          html += options.isWebPreview ? `<pre class="rendered-code-block"><code>${codeContent}</code></pre>` : `<pre style="${PRE_STYLE}"><code>${codeContent}</code></pre>`;
          codeBuffer = [];
          insideCodeBlock = false;
        } else {
          insideCodeBlock = true;
          codeBuffer = [];
        }
        continue;
      }

      if (insideCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      if (/^(\s*[-*_]\s*){3,}$/.test(trimmed)) {
        if (insideList) {
          html += '</ul>';
          insideList = false;
        }
        if (insideTable) {
          html += flushTable(tableBuffer);
          tableBuffer = [];
          insideTable = false;
        }
        html += options.isWebPreview ? '<hr class="rendered-divider">' : '<hr style="border: none; border-top: 1px solid #cbd5e1; margin: 12pt 0;">';
        continue;
      }

      const isTableLine = (trimmed.startsWith('|') && trimmed.endsWith('|')) ||
                          (trimmed.startsWith('|') && trimmed.includes('|') && trimmed.split('|').length >= 3);

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
          itemText = convertInlineMath(itemText, options);
          itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          itemText = stripMarkdownStyling(itemText);
          itemText = itemText.replace(/\$/g, '');
          html += options.isWebPreview ? `<li>${itemText}</li>` : `<li style="${LI_STYLE}">${itemText}</li>`;
        } else {
          if (insideList) {
            html += '</ul>';
            insideList = false;
          }

          if (trimmed === '') {
            
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

    if (insideCodeBlock && codeBuffer.length > 0) {
      const codeContent = codeBuffer.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html += options.isWebPreview ? `<pre class="rendered-code-block"><code>${codeContent}</code></pre>` : `<pre style="${PRE_STYLE}"><code>${codeContent}</code></pre>`;
    }

    return html;
  }

  function analyzeText(input) {
    if (!input) return { formulas: 0, tables: 0, words: 0, characters: 0, lines: 0 };
    const inlineMath = (input.match(/(?<!\\)\$[^\$\n]+?(?<!\\)\$/g) || []).length +
                       (input.match(/\\+\([^\n]+?\\+\)/g) || []).length;
    const blockMath = (input.match(/\$\$[\s\S]*?\$\$/g) || []).length +
                      (input.match(/\\+\[[\s\S]*?\\+\]/g) || []).length;
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
    SYMBOLS_MAP_UNICODE,
    SYMBOLS_MAP_ASCII
  };
});
