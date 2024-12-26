marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language: validLanguage }).value;
    }
});

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview'); // Get the preview element
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const linkBtn = document.getElementById('link-btn');
const listBtn = document.getElementById('list-btn');
const codeBtn = document.getElementById('code-btn');
const heading1Btn = document.getElementById('heading1-btn');
const heading2Btn = document.getElementById('heading2-btn');
const heading3Btn = document.getElementById('heading3-btn');
const quoteBtn = document.getElementById('quote-btn');
const imageBtn = document.getElementById('image-btn');
const tableBtn = document.getElementById('table-btn');
const clearButton = document.getElementById('clear-button'); 

function surroundSelection(startTag, endTag) {
    const textarea = markdownInput; // Use the already cached element
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    textarea.value = textarea.value.substring(0, start) + startTag + selectedText + endTag + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    render();
}

function insertAtCursor(myValue) {
    const textarea = markdownInput; // Use the already cached element
    if (document.selection) { // IE support (less relevant now)
        textarea.focus();
        const sel = document.selection.createRange();
        sel.text = myValue;
    } else if (textarea.selectionStart || textarea.selectionStart === '0') {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, startPos) + myValue + textarea.value.substring(endPos, textarea.value.length);
        textarea.focus();
        textarea.setSelectionRange(startPos + myValue.length, startPos + myValue.length);
    } else {
        textarea.value += myValue;
    }
    render();
}

const render = () => {
    preview.innerHTML = marked.parse(markdownInput.value);
    document.querySelectorAll('pre code').forEach(el => {
        hljs.highlightElement(el);
    });
};

// Event Listeners (All in one place)
markdownInput.addEventListener('input', render);

boldBtn.addEventListener('click', () => surroundSelection('**', '**'));
italicBtn.addEventListener('click', () => surroundSelection('*', '*'));
linkBtn.addEventListener('click', () => {
    const url = prompt('Enter URL:');
    if (url) {
        surroundSelection('[', `](${url})`);
    }
});
listBtn.addEventListener('click', () => surroundSelection('- ', ''));
codeBtn.addEventListener('click', () => surroundSelection('`', '`'));
heading1Btn.addEventListener('click', () => surroundSelection('# ', ''));
heading2Btn.addEventListener('click', () => surroundSelection('## ', ''));
heading3Btn.addEventListener('click', () => surroundSelection('### ', ''));
quoteBtn.addEventListener('click', () => surroundSelection('> ', ''));
imageBtn.addEventListener('click', () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
        const altText = prompt('Enter alt text (optional):'); // Make alt text optional
        surroundSelection(`![${altText || ''}](${imageUrl})`, ''); // Use empty string if no alt text
    }
});
tableBtn.addEventListener('click', () => {
    const tableMarkdown = `\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Row 1, Col 1 | Row 1, Col 2 |\n| Row 2, Col 1 | Row 2, Col 2 |\n`; // Add newlines for better formatting
    insertAtCursor(tableMarkdown);
});
clearButton.addEventListener('click', () => {
    markdownInput.value = '';
    render();
});

render(); // Initial render