function applyRegex() {
  var inputJapanese = document.getElementById("japaneseInput").value;
  var inputText2 = document.getElementById("englishInput").value;
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

  var lines = inputText2.split(/\r?\n/); // Split text from second input box into lines
  var rubyresultLines = rubyresult.split("<br>"); // Split result into lines

  var alignedResult = ""; // String to store aligned result

  // Loop through each line from the second input box and its corresponding line from the result
  for (var i = 0; i < lines.length; i++) {
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

  document.getElementById("alignedDisplay").innerHTML = alignedResult; // Display aligned result

  // Display raw substitution result
  document.getElementById("rawResult").textContent = rubyresult;

  // Set titles
  document.getElementById("Title").innerHTML = titleruby;
  document.getElementById("subTitle").textContent = inputSubtitle;

  // Set font sizes for h1 and h2
  document.querySelector("h1").style.fontSize =
    document.getElementById("h1FontSize").value + "px";
  document.querySelector("h2").style.fontSize =
    document.getElementById("h2FontSize").value + "px";
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
}
function callPrintTab() {
  applyRegex();
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
