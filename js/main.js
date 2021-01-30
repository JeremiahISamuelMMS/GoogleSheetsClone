import {downloadData, readFile} from "./utils/DOM.js";
import {Excel, getGridFromJson} from "./component/excel.js";

// Selectors !!
const documentNameDOM = document.getElementById('current-doc-name-input');
const saveDataDOM = document.getElementById('save-data-btn');
const saveDataCSV = document.getElementById('save-data-in-csv-format-btn');
const uploadDataDOM = document.getElementById('upload-data-btn');
// END Selectors !!

let excel = new Excel(
    100, 26, 'excel-table',
    'background-color-picker', 'text-color-picker', 'font-size-input',
    'make-text-bold', 'make-text-italic', 'make-text-strikethrough',
    'current-cell', 'formula-input', 'font-selector', 'plot-graph-btn'
);

const handleSaveDataAsJSON = () => {
    downloadData('json', documentNameDOM.value + '.json', JSON.stringify(excel.serialize()));
}

const handleSaveDataAsCSV = () => {
    downloadData('csv', documentNameDOM.value + '.csv', excel.serialize('csv'));
}

const changeInputSizeOnInput = (e) => {
    e.target.style.width = ((e.target.value.length + 1) * 9) + 'px';
}

const handleLoadDataFromFile = (e) => {
    const file = e.target.files[0];

    readFile(file, (fileData) => {
        const spreadsheetJsonData = JSON.parse(fileData);
        const data = getGridFromJson(spreadsheetJsonData);

        excel.resetGrid(data);
        documentNameDOM.value = spreadsheetJsonData.name;
    });
}

const functionHandleEvents = () => {
    documentNameDOM.addEventListener('input', changeInputSizeOnInput);

    saveDataDOM.addEventListener('click', handleSaveDataAsJSON);
    saveDataCSV.addEventListener('click', handleSaveDataAsCSV);
    uploadDataDOM.addEventListener('change', handleLoadDataFromFile);
}

const main = () => {
    excel.render();
    functionHandleEvents();
}

main();
