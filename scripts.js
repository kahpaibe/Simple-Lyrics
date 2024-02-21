function applyRuby() {
  var inputJapanese = document.getElementById("japaneseInput").value;
  var inputEnglish = document.getElementById("englishInput").value;
  var inputTitle = document.getElementById("titleInput").value;
  var inputSubtitle = document.getElementById("subtitleInput").value;

  inputJapanese = inputJapanese.replace(/(\r\n|\r|\n)/g, " <br> "); // Replace new lines with <br> tags
  inputJapanese += " <br>"; // Append text at the end of the inputText
  inputTitle = inputTitle.replace(/(\r\n|\r|\n)/g, " <br> "); // Replace new lines with <br> tags
  inputTitle += " "; // Append text at the end of the inputText

  var regexPattern = /(\S+?)\[(.+?)\](.*?)[\s\n\r$]/g; // Regex pattern for the specified substitution
  var rubyresult = inputJapanese.replace(
    regexPattern,
    "<ruby><rb>$1</rb><rt>$2</rt></ruby>$3"
  ); // Replace matches with the specified format
  var titleruby = inputTitle.replace(
    regexPattern,
    "<ruby><rb>$1</rb><rt>$2</rt></ruby>$3"
  ); // Replace matches with the specified format

  var lines = inputEnglish.split(/\r?\n/); // Split text from second input box into lines
  var rubyresultLines = rubyresult.split("<br>"); // Split result into lines

  var alignedResult = ""; // String to store aligned result

  // Loop through each line from the second input box and its corresponding line from the result
  for (var i = 0; i < rubyresultLines.length; i++) {
    if (rubyresultLines[i].trim() === "") {
      // Append a placeholder element for empty lines
      alignedResult +=
        '<div class="line"><div class="japanese-text" style="font-size: ' +
        document.getElementById("japaneseFontSize").value +
        'px;">' +
        " " +
        '</div><div class="english-text" style="font-size: ' +
        document.getElementById("englishFontSize").value +
        'px;">' +
        "&nbsp;" + // non separating space
        "</div></div>";
    } else {
      // Append the line content as usual
      alignedResult +=
        '<div class="line"><div class="japanese-text" style="font-size: ' +
        document.getElementById("japaneseFontSize").value +
        'px;">' +
        rubyresultLines[i] +
        '</div><div class="english-text" style="font-size: ' +
        document.getElementById("englishFontSize").value +
        'px;">' +
        lines[i] +
        "</div></div>";
    }
  }
  document.getElementById("alignedDisplay").innerHTML = alignedResult; // Display aligned result

  // Display raw substitution result
  document.getElementById("rawResult").textContent = rubyresult;

  // Set titles
  document.getElementById("Title").innerHTML =
    '<h1><div id="Title" style="font-size: ' +
    document.getElementById("h1FontSize").value +
    'px">' +
    titleruby +
    "</div></h1>";
  document.getElementById("subTitle").innerHTML =
    '<h2><div id="Title" style="font-size: ' +
    document.getElementById("h2FontSize").value +
    'px">' +
    inputSubtitle +
    "</div></h2>";

  // Set font sizes for h1 and h2
  document.querySelector("h2").style.fontSize =
    document.getElementById("h2FontSize").value + "px";

  titleNoRuby(); // change window title
}
function makePrintTab() {
  var title = document.getElementById("Title").innerHTML;
  var subtitle = document.getElementById("subTitle").textContent;
  var alignedContent = document.getElementById("alignedDisplay").innerHTML;

  var printWindow = window.open("", "_blank");

  // import css styles
  printWindow.document.write(
    '<link rel="stylesheet" type="text/css" href="styles.css" />'
  );

  printWindow.document.write(
    "<html><head><title>Printed Content</title></head><body>"
  );

  printWindow.document.write("<h1>" + title + "</h1>");
  printWindow.document.write("<h2>" + subtitle + "</h2>");
  printWindow.document.write("<div>" + alignedContent + "</div>");

  printWindow.document.write("</body></html>");

  // printWindow.document.title = titleNoRuby(); // change window title // Does not work as it is
}
function callPrintTab() {
  applyRuby();
  makePrintTab();
}
function saveToJson() {
  var title = document.getElementById("titleInput").value;
  var jsonData = {
    title: title,
    subtitle: document.getElementById("subtitleInput").value,
    japanese: document.getElementById("japaneseInput").value,
    english: document.getElementById("englishInput").value,
  };
  var fileName = window.prompt("Enter a file name:", title + ".json"); // defaults to {title}.json

  if (!fileName) {
    // User canceled or didn't provide a file name
    return;
  }

  var jsonDataString = JSON.stringify(jsonData);

  var blob = new Blob([jsonDataString], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importFromJson() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = function () {
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var jsonDataString = reader.result;
      var jsonData = JSON.parse(jsonDataString);

      document.getElementById("titleInput").value = jsonData.title;
      document.getElementById("subtitleInput").value = jsonData.subtitle;
      document.getElementById("japaneseInput").value = jsonData.japanese;
      document.getElementById("englishInput").value = jsonData.english;
    };

    reader.readAsText(file);
  };

  input.click();
}

function titleNoRuby() {
  // to trim the title
  var inputTitle = document.getElementById("titleInput").value;
  var inputSubtitle = document.getElementById("subtitleInput").value;
  inputTitle = inputTitle.replace(/(\r\n|\r|\n)/g, " <br> "); // Replace new lines with <br> tags
  inputTitle += " "; // Append text at the end of the inputText

  var regexPattern = /(\S+?)\[(.+?)\](.*?)[\s\n\r$]/g; // Regex pattern for the specified substitution

  var titleNoruby = inputTitle.replace(
    regexPattern,
    // "<ruby><rb>$1</rb><rt>$2</rt></ruby>$3"
    "$1 $3"
  ); // Replace matches with the specified format

  // Set titles
  document.title = titleNoruby + " - " + inputSubtitle;
  return titleNoruby + " - " + inputSubtitle;
}

function updateSliderLabel(sliderId, labelId) {
  var slider = document.getElementById(sliderId);
  var label = document.getElementById(labelId);
  label.textContent = label.textContent.split(":")[0] + ": " + slider.value;

  applyRegex(); // update all
}
