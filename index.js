// Coloque o ID do seu formulário Google no argumento
const form = FormApp.openById('');

// Coloque o ID da sua planilha Google no argumento
const spreadSheet = SpreadsheetApp.openById('');

const formResponses = form.getResponses();
const listSheet = spreadSheet.getSheets()[0];
const baseRow = 8;

const cb = SpreadsheetApp.newColor();
const frb = SpreadsheetApp.newConditionalFormatRule();
const dvb = SpreadsheetApp.newDataValidation();

const status = [
  listSheet.getRange(4, 1),
  listSheet.getRange(5, 1),
  listSheet.getRange(6, 1),
].map(item => {
  return {
    value: item.getValue(),
    fgColor: item.getFontColor(),
    bgColor: item.getBackground()
  }
});


function createColumns()
{
  const response = formResponses[formResponses.length - 1].getItemResponses();
  const titles = response.map(item => item.getItem().getTitle());

  titles.unshift('Situação');
  titles.splice(titles.length - 2, 1);

  titles.forEach((item, i) => {
    const cell = listSheet.getRange(baseRow, i + 1);

    cell.setValue(item.toUpperCase());
    cell.setBorder(false, true, true, true, null, null);
    cell.setBackgroundObject(cb.setThemeColor(SpreadsheetApp.ThemeColorType.ACCENT1).build());
    cell.setFontColorObject(cb.setThemeColor(SpreadsheetApp.ThemeColorType.ACCENT3).build());
    cell.setFontSize(12);
    cell.setFontWeight("bold");

    if (i === 0)
      listSheet.setColumnWidth(i + 1, 128);
    else
      listSheet.autoResizeColumn(i + 1);
  });
}


function createStatusCell(cell)
{
  return dvb
    .requireValueInList(status.map(item => item.value))
    .setAllowInvalid(false)
    .build();
}


function onSubmit()
{
  insertRow(formResponses[formResponses.length - 1].getItemResponses());
}


function insertRow(itemResponses)
{
  const columns = itemResponses.map(item => item.getResponse());
  const nextRow = listSheet.getLastRow() + 1;

  columns.splice(columns.length - 2, 1);
  columns.unshift(status[0].value);
  columns.forEach((item, i) => {
    const cell = listSheet.getRange(nextRow, i + 1);
    cell.setValue(item);
    if (i === 0)
      cell.setDataValidation(createStatusCell(cell));
    else
      listSheet.autoResizeColumn(i + 1);
  });

  const range = listSheet.getRange(nextRow, 1, 1, columns.length);
  const formula = `=$A${nextRow}`;
  const rules = [];

  status.forEach(s => {
    rules.push(frb
      .whenFormulaSatisfied(`${formula}="${s.value}"`)
      .setBackground(s.bgColor)
      .setFontColor(s.fgColor)
      .setRanges([range])
      .build());
  });
  listSheet.setConditionalFormatRules(listSheet.getConditionalFormatRules().concat(rules));
}


function clearList()
{
  for (let i = baseRow + 1; i <= listSheet.getLastRow(); ++i)
  {
    listSheet.deleteRow(i);
  }
}


function refreshList()
{
  clearList();
  formResponses.forEach(response => {
    insertRow(response.getItemResponses());
  });
}