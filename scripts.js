document.addEventListener('DOMContentLoaded', function() {
    const columnSlider = document.getElementById('columnSlider');
    const columnValue = document.getElementById('columnValue');
    const rowSpacingSlider = document.getElementById('rowSpacingSlider');
    const rowSpacingValue = document.getElementById('rowSpacingValue');
    const titleFontSizeSlider = document.getElementById('titleFontSizeSlider');
    const titleFontSizeValue = document.getElementById('titleFontSizeValue');
    const subtitleFontSizeSlider = document.getElementById('subtitleFontSizeSlider');
    const subtitleFontSizeValue = document.getElementById('subtitleFontSizeValue');
    const fontSizeSlidersContainer = document.getElementById('fontSizeSlidersContainer');
    const textBoxesContainer = document.getElementById('textBoxesContainer');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const titleTextBox = document.getElementById('titleTextBox');
    const subtitleTextBox = document.getElementById('subtitleTextBox');
    const titleContainer = document.getElementById('titleContainer');
    const subtitleContainer = document.getElementById('subtitleContainer');
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');

    let fontSizeSliders = [];

    columnSlider.addEventListener('input', function() {
        const coln = parseInt(columnSlider.value);
        columnValue.textContent = coln;
        updateTextBoxes(coln);
    });

    rowSpacingSlider.addEventListener('input', function() {
        const rowSpacing = parseInt(rowSpacingSlider.value);
        rowSpacingValue.textContent = rowSpacing;
        updateLyricsBlocks();
    });

    titleFontSizeSlider.addEventListener('input', function() {
        const titleFontSize = parseInt(titleFontSizeSlider.value);
        titleFontSizeValue.textContent = titleFontSize;
        titleContainer.style.fontSize = `${titleFontSize}px`;
    });

    subtitleFontSizeSlider.addEventListener('input', function() {
        const subtitleFontSize = parseInt(subtitleFontSizeSlider.value);
        subtitleFontSizeValue.textContent = subtitleFontSize;
        subtitleContainer.style.fontSize = `${subtitleFontSize}px`;
    });

    titleTextBox.addEventListener('input', updateTitle);
    subtitleTextBox.addEventListener('input', updateSubtitle);

    saveButton.addEventListener('click', saveData);
    loadButton.addEventListener('click', function() {
        fileInput.click();
    });

    function updateTitle() {
        const titleContent = titleTextBox.value;
        const withRt = titleContent.replace(/([^\s]+?)\[(.+?)\]/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');
        titleContainer.innerHTML = withRt;
    }

    function updateSubtitle() {
        const subtitleContent = subtitleTextBox.value;
        const withRt = subtitleContent.replace(/([^\s]+?)\[(.+?)\]/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');
        subtitleContainer.innerHTML = withRt;
    }

    function updateTextBoxes(coln) {
        textBoxesContainer.innerHTML = '';
        fontSizeSlidersContainer.innerHTML = '';
        lyricsContainer.querySelectorAll('.lyrics-row').forEach(el => el.remove());
        fontSizeSliders = [];

        const containerWidth = textBoxesContainer.clientWidth;
        const itemWidth = containerWidth / coln;
        const textBoxHeight = window.innerHeight / 3;

        for (let i = 0; i < coln; i++) {
            const fontSizeSliderContainer = document.createElement('div');
            fontSizeSliderContainer.className = 'font-size-slider-container';
            fontSizeSliderContainer.style.width = `${itemWidth}px`;

            const fontSizeSliderLabel = document.createElement('label');
            fontSizeSliderLabel.textContent = `Font Size (${i + 1}):`;
            const fontSizeSlider = document.createElement('input');
            fontSizeSlider.type = 'range';
            fontSizeSlider.min = '8';
            fontSizeSlider.max = '32';
            fontSizeSlider.value = '16';
            const fontSizeValue = document.createElement('span');
            fontSizeValue.textContent = fontSizeSlider.value;

            fontSizeSlider.addEventListener('input', function() {
                fontSizeValue.textContent = fontSizeSlider.value;
                updateLyricsBlocks();
            });

            fontSizeSliderContainer.appendChild(fontSizeSliderLabel);
            fontSizeSliderContainer.appendChild(fontSizeSlider);
            fontSizeSliderContainer.appendChild(fontSizeValue);
            fontSizeSlidersContainer.appendChild(fontSizeSliderContainer);
            fontSizeSliders.push(fontSizeSlider);

            const textBox = document.createElement('textarea');
            textBox.className = 'text-box';
            textBox.placeholder = `Enter text for column ${i + 1}`;
            textBox.style.width = `${itemWidth}px`;
            textBox.style.height = `${textBoxHeight}px`;
            textBox.addEventListener('input', updateLyricsBlocks);
            textBoxesContainer.appendChild(textBox);
        }

        updateLyricsBlocks();
    }

    function updateLyricsBlocks() {
        const textBoxes = document.querySelectorAll('.text-box');
        const coln = textBoxes.length;
        const containerWidth = lyricsContainer.clientWidth;
        const blockWidth = containerWidth / coln;
        const rowSpacing = parseInt(rowSpacingSlider.value);

        let maxLines = 0;
        const linesArray = [];

        textBoxes.forEach((textBox, index) => {
            const lines = textBox.value.split('\n');
            linesArray[index] = lines;
            if (lines.length > maxLines) {
                maxLines = lines.length;
            }
        });

        const existingRows = lyricsContainer.querySelectorAll('.lyrics-row');
        existingRows.forEach(row => row.remove());

        for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'lyrics-row';
            rowContainer.style.display = 'flex';
            rowContainer.style.marginBottom = `${rowSpacing}px`;

            for (let colIndex = 0; colIndex < coln; colIndex++) {
                const lyricsBlock = document.createElement('div');
                lyricsBlock.className = 'lyrics-block';
                lyricsBlock.style.width = `${blockWidth}px`;
                lyricsBlock.style.fontSize = `${fontSizeSliders[colIndex].value}px`;

                let lineContent = linesArray[colIndex][lineIndex] || '';
                const withRt = lineContent.replace(/([^\s]+?)\[(.+?)\]/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');

                lyricsBlock.innerHTML = withRt;
                rowContainer.appendChild(lyricsBlock);
            }

            lyricsContainer.appendChild(rowContainer);
        }
    }

    function saveData() {
        const data = {
            columnSlider: columnSlider.value,
            rowSpacingSlider: rowSpacingSlider.value,
            titleFontSizeSlider: titleFontSizeSlider.value,
            subtitleFontSizeSlider: subtitleFontSizeSlider.value,
            fontSizeSliders: Array.from(fontSizeSliders).map(slider => slider.value),
            textBoxes: Array.from(document.querySelectorAll('.text-box')).map(textBox => textBox.value),
            title: titleTextBox.value,
            subtitle: subtitleTextBox.value
        };

        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'SimpleRubySettings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);

            columnSlider.value = data.columnSlider;
            columnValue.textContent = data.columnSlider;
            rowSpacingSlider.value = data.rowSpacingSlider;
            rowSpacingValue.textContent = data.rowSpacingSlider;
            titleFontSizeSlider.value = data.titleFontSizeSlider;
            titleFontSizeValue.textContent = data.titleFontSizeSlider;
            subtitleFontSizeSlider.value = data.subtitleFontSizeSlider;
            subtitleFontSizeValue.textContent = data.subtitleFontSizeSlider;

            updateTextBoxes(parseInt(columnSlider.value));

            data.fontSizeSliders.forEach((value, index) => {
                if (fontSizeSliders[index]) {
                    fontSizeSliders[index].value = value;
                    const fontSizeValueSpans = document.querySelectorAll('.font-size-slider-container span');
                    if (fontSizeValueSpans[index]) {
                        fontSizeValueSpans[index].textContent = value;
                    }
                }
            });

            const textBoxes = document.querySelectorAll('.text-box');
            data.textBoxes.forEach((text, index) => {
                if (textBoxes[index]) {
                    textBoxes[index].value = text;
                }
            });

            titleTextBox.value = data.title || '';
            subtitleTextBox.value = data.subtitle || '';
            updateTitle();
            updateSubtitle();

            titleContainer.style.fontSize = `${data.titleFontSizeSlider}px`;
            subtitleContainer.style.fontSize = `${data.subtitleFontSizeSlider}px`;

            updateLyricsBlocks();
        };

        reader.readAsText(file);
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', loadData);
    document.body.appendChild(fileInput);

    updateTextBoxes(parseInt(columnSlider.value));


    const printButton = document.getElementById('printButton');

    printButton.addEventListener('click', openPrintableView);

    function openPrintableView() {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups for this site.');
            return;
        }

        // Generate the HTML content for the printable view
        const printableContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Printable View</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .title-container, .subtitle-container {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .title-container {
                        font-size: ${titleFontSizeSlider.value}px;
                        font-weight: bold;
                    }
                    .subtitle-container {
                        font-size: ${subtitleFontSizeSlider.value}px;
                        font-style: italic;
                    }
                    .lyrics-row {
                        display: flex;
                        margin-bottom: ${rowSpacingSlider.value}px;
                    }
                    .lyrics-block {
                        padding: 0px 10px; /* Reduce vertical padding */
                        /* border: 1px solid #ccc; */
                        box-sizing: border-box;
                        word-break: break-all;
                        display: flex;
                        align-items: flex-end;
                        min-height: 50px;
                        white-space: nowrap; /* Prevent text from wrapping */
                        overflow: hidden; /* Hide any overflow text */
                        text-overflow: ellipsis; /* Add ellipsis for overflow text */
                    }
                    .lyrics-block {
                        padding: 0px 10px; /* Reduce vertical padding */
                        /* border: 1px solid #ccc; */
                        box-sizing: border-box;
                        word-break: break-all;
                        display: flex;
                        align-items: flex-end;
                        min-height: 30px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-bottom: 0; /* Remove bottom margin */
                    }

                    .lyrics-row {
                        display: flex;
                        margin-bottom: 0; /* Ensure row spacing is minimized */
                    }
                </style>
            </head>
            <body>
                ${lyricsContainer.innerHTML}
            </body>
            </html>
        `;

        // Write the content to the new window
        printWindow.document.open();
        printWindow.document.write(printableContent);
        printWindow.document.close();

        // Optional: Automatically trigger print dialog
        printWindow.onload = function() {
        };
    }

});
