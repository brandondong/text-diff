import './style.css';
import diffStyles from './diff2html.min.css?inline';
import diffCustomStyles from './diff2html-custom.css?inline';

import { createPatch } from 'diff';

const diffShadowHost = document.getElementById("diff-shadow-host")!;

const detailsForm = document.getElementById("details-form")!;
const compareForm = document.getElementById("compare-form")!;
const leftInput = document.getElementById("left-input") as HTMLTextAreaElement;
const rightInput = document.getElementById("right-input") as HTMLTextAreaElement;

compareForm.addEventListener("submit", e => {
    e.preventDefault();

    const leftText = leftInput.value;
    const rightText = rightInput.value;

    const diff = createPatch("file_name", leftText, rightText);
    // Shadow DOM to stop tailwind reset from applying to diff UI library.
    let shadowDom = initializeShadowDom(diffShadowHost, [diffStyles, diffCustomStyles]);
    // @ts-ignore
    const diff2htmlUi = new Diff2HtmlUI(shadowDom, diff, { outputFormat: "side-by-side", diffStyle: "word", drawFileList: false });
    diff2htmlUi.draw();

    // Automatically close the details panel.
    detailsForm.removeAttribute("open");
});

function initializeShadowDom(host: HTMLElement, styles: string[]) {
    if (host.shadowRoot) {
        return host.shadowRoot;
    }
    const shadowDom = host.attachShadow({ mode: "open" });
    const sheets = styles.map(style => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(style);
        return sheet;
    })
    shadowDom.adoptedStyleSheets = sheets;
    return shadowDom;
}
