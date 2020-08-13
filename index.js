const downloadBtn = document.querySelector('#btn-download');
const msgBox = document.querySelector('#message-box');
downloadBtn.onclick = function (e) {
  loadJSONFromTextArea()
    .then((res) => {
      if (res === null) return loadJSONFromFile();
      return res;
    })
    .then(processJSON)
    .catch((err) => {
      alert('Error fetching json');
      msgBox.textContent = err || 'ERROR on fetching JSON. Please try again';
    });
};
function loadJSONFromTextArea() {
  return new Promise((resolve, reject) => {
    msgBox.textContent = '';
    const jsonInput = document.querySelector('#json-input');
    let jsonVal = jsonInput.value;
    if (jsonVal) {
      try {
        jsonVal = JSON.parse(jsonVal);
      } catch (e) {
        alert(e);
        reject('ERROR on parsing JSON. Please try again with new JSON input');
      }
      resolve(jsonVal);
    } else {
      resolve(null);
    }
  });
}
function loadJSONFromFile() {
  return fetch('./data.json').then((res) => res.json());
}
function processJSON(data) {
  const headersEnum = {
    VIEW_GRADES: 'view_grades',
    CHANGE_GRADES: 'change_grades',
    ADD_GRADES: 'add_grades',
    DELETE_GRADES: 'delete_grades',
    VIEW_CLASSES: 'view_classes',
    CHANGE_CLASSES: 'change_classes',
    ADD_CLASSES: 'add_classes',
    DELETE_CLASSES: 'delete_classes'
  };
  const fileName = 'TRACK_REVENUE_HOMEWORK_BAOTRAN';
  export_csv(headersEnum, data, fileName);
}

function export_csv(headersEnum, arrayData, fileName) {
  let header = Object.keys(headersEnum).join(',') + '\n';
  let csv = header;
  for (const person in arrayData) {
    const row = [person];
    for (const privilege in headersEnum) {
      if (arrayData[person].includes(headersEnum[privilege])) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    csv += row.join(',') + '\n';
  }
  let csvData = new Blob([csv], { type: 'text/csv' });
  let csvUrl = URL.createObjectURL(csvData);

  let hiddenElement = document.createElement('a');
  hiddenElement.href = csvUrl;
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName + '.csv';
  hiddenElement.click();
}
