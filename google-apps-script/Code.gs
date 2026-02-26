/**
 * Google Apps Script - Regulatory Division Form
 * Deploy as Web App to receive form submissions and append to Google Sheet
 *
 * Setup:
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this code, save
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and use it in your React app
 */

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Regulatory Division Form - Submit via POST only',
    status: 'ok',
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // IMPORTANTE: Ang script ay dapat naka-attach sa Google Sheet (Extensions → Apps Script)
    var data = {};
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      var raw = e.postData.contents;
      data = (typeof raw === 'string' && (raw.trim().startsWith('{') || raw.trim().startsWith('[')))
        ? JSON.parse(raw) : {};
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().length === 1 && !ss.getSheetByName('Home')) {
      ss.insertSheet('Home');
    }
    const province = (data.province || '').toString().trim() || 'Other';
    const provinceSheetName = province.substring(0, 31); // Google Sheets max 31 chars
    let sheet = ss.getSheetByName(provinceSheetName);
    if (!sheet) {
      sheet = ss.insertSheet(provinceSheetName);
    }

    // Column headers (must match form field names)
    const headers = [
      'Office Address',
      'First Name',
      'Last Name',
      'Middle Initial',
      'Name Extension',
      'Designation',
      'Contact #',
      'Email',
      'Province',
      'Municipality',
      'Date Submitted',
    ];

    // First rows: add DA header + column headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 3, 11).setValues([
        ['DEPARTMENT OF AGRICULTURE - REGIONAL FIELD OFFICE - MIMAROPA', '', '', '', '', '', '', '', '', '', ''],
        ['REGULATORY DIVISION FORM', '', '', '', '', '', '', '', '', '', ''],
        headers
      ]);
    }
    formatSheet(sheet);

    // Map form data to row values (order matches headers)
    const row = [
      data.officeAddress || '',
      data.firstName || '',
      data.lastName || '',
      data.middleInitial || '',
      data.nameExtension || '',
      data.designation || '',
      data.contactNumber || '',
      data.emailAddress || '',
      data.province || '',
      data.municipality || '',
      new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
    ];

    const lastRow = sheet.getLastRow() + 1;
    sheet.appendRow(row);
    // Format only the new row (faster than fixing all rows on every submit)
    formatDataRow(sheet, lastRow);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Form submitted successfully',
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.message || 'Error saving form',
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatSheet(sheet) {
  const r1 = sheet.getRange(1, 1).getValue();
  if (r1 === 'DEPARTMENT OF AGRICULTURE' || r1 === 'DEPARTMENT OF AGRICULTURE - REGIONAL FIELD OFFICE - MIMAROPA') {
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setFontSize(11).setFontColor('#0F571C').setHorizontalAlignment('left').setVerticalAlignment('middle');
    sheet.getRange(2, 1, 2, 11).setFontWeight('bold').setFontSize(11).setFontColor('#0F571C').setHorizontalAlignment('left').setVerticalAlignment('middle');
    const colHeaderRow = sheet.getRange(3, 1, 3, 11);
    colHeaderRow.setBackground('#0F571C').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');
    colHeaderRow.setBorder(true, true, true, true, true, true, '#4D7E58', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setFrozenRows(3);
  } else if (r1 === 'REGULATORY DIVISION FORM') {
    sheet.getRange(1, 1, 1, 11).setBackground('#0F571C').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(14).setHorizontalAlignment('center').setVerticalAlignment('middle');
    const headerRow = sheet.getRange(2, 1, 2, 11);
    headerRow.setBackground('#4D7E58').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
    headerRow.setBorder(true, true, true, true, true, true, '#0F571C', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setFrozenRows(2);
  } else {
    const headerRow = sheet.getRange(1, 1, 1, 11);
    headerRow.setBackground('#0F571C').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
    headerRow.setBorder(true, true, true, true, true, true, '#4D7E58', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setFrozenRows(1);
  }
  sheet.setColumnWidths(1, 11, 130);
}

function formatDataRow(sheet, row) {
  const range = sheet.getRange(row, 1, row, 11);
  range.setBackground('#FFFFFF').setFontColor('#000000');
  range.setBorder(true, true, true, true, true, true, '#E0E0E0', SpreadsheetApp.BorderStyle.SOLID);
}

function fixAllDataRowColors(sheet) {
  var r1 = sheet.getRange(1, 1).getValue();
  var dataStartRow = 4;
  if (r1 === 'REGULATORY DIVISION FORM') dataStartRow = 3;
  else if (r1 !== 'DEPARTMENT OF AGRICULTURE' && r1 !== 'DEPARTMENT OF AGRICULTURE - REGIONAL FIELD OFFICE - MIMAROPA') dataStartRow = 2;
  var lastRow = sheet.getLastRow();
  for (var r = dataStartRow; r <= lastRow; r++) {
    formatDataRow(sheet, r);
  }
}
