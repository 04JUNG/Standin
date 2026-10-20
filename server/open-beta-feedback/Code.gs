/* Dedicated open-beta receiver. Never falls back to the preregistration workbook.
 * Upload this file together with Schema.gs and appsscript.json.
 */
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return json_({ ok: true, service: 'standin-open-beta-feedback', surveyVersion: SURVEY.version }); }
function fields_(mode) { return SURVEY.common.concat(SURVEY[mode], SURVEY.closing); }
function allFields_() { return SURVEY.common.concat(SURVEY.complete, SURVEY.dropoff, SURVEY.closing); }
function safeCell_(value) {
  var text = String(value || '');
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
}
function sheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('FEEDBACK_SHEET_ID');
  if (!id) throw new Error('MISSING_FEEDBACK_SHEET_ID');
  var sheet = SpreadsheetApp.openById(id).getSheetByName('오픈베타 피드백');
  if (!sheet || JSON.stringify(sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !== JSON.stringify(HEADERS)) {
    throw new Error('SCHEMA_MISMATCH');
  }
  return sheet;
}
function validate_(p) {
  if (!p || p.formType !== 'open-beta-feedback' || p.surveyVersion !== SURVEY.version ||
      !/^[0-9a-f-]{36}$/i.test(p.requestId || '') || ['complete', 'dropoff'].indexOf(p.mode) < 0 ||
      p.consent !== true || typeof p.reward !== 'boolean' || typeof p.email !== 'string' ||
      p.email.length > 254 || (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) ||
      !p.answers || typeof p.answers !== 'object' || !Array.isArray(p.files) || p.files.length > 2) return false;
  if (p.reward && (!p.email || !p.files.length)) return false;
  return fields_(p.mode).every(function(q) {
    var answer = p.answers[q.id];
    return (answer === undefined ? !q.required : typeof answer === 'string' && answer.length <= 2000 &&
      (!q.required || answer.trim().length > 0) && (!q.options || !answer || q.options.indexOf(answer) >= 0));
  });
}
function decodeFiles_(files) {
  return files.map(function(file) {
    if (!file || ['image/png', 'image/jpeg', 'image/webp'].indexOf(file.type) < 0 ||
        typeof file.data !== 'string' || file.data.length > 5592408 || !/^[A-Za-z0-9+/]+={0,2}$/.test(file.data)) {
      throw new Error('INVALID_FILE');
    }
    var bytes = Utilities.base64Decode(file.data);
    if (!bytes.length || bytes.length > 4 * 1024 * 1024) throw new Error('INVALID_FILE');
    var b = bytes.slice(0, 12).map(function(n) { return n & 255; });
    var valid = file.type === 'image/png' ? [137,80,78,71,13,10,26,10].every(function(n,i) { return b[i] === n; }) :
      file.type === 'image/jpeg' ? b[0] === 255 && b[1] === 216 && b[2] === 255 :
      [82,73,70,70].every(function(n,i) { return b[i] === n; }) && [87,69,66,80].every(function(n,i) { return b[i + 8] === n; });
    if (!valid) throw new Error('INVALID_FILE');
    return { bytes: bytes, type: file.type, ext: file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1] };
  });
}
function rewardAccepted_(p, now) {
  return p.reward && now.getTime() >= Date.parse('2026-10-21T00:00:00+09:00') && now.getTime() < Date.parse('2026-11-12T00:00:00+09:00');
}
function doPost(e) {
  var p;
  try {
    if (!e || !e.postData || e.postData.contents.length > 11500000) return json_({ ok: false, error: 'INVALID_INPUT' });
    p = JSON.parse(e.postData.contents);
  } catch (_) { return json_({ ok: false, error: 'INVALID_INPUT' }); }
  if (p && p.website) return json_({ ok: true });
  if (!validate_(p)) return json_({ ok: false, error: 'INVALID_INPUT' });
  var decoded;
  try { decoded = decodeFiles_(p.files); } catch (_) { return json_({ ok: false, error: 'INVALID_FILE' }); }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ ok: false, error: 'BUSY' });
  var uploads = [];
  var saved = false;
  try {
    var sheet = sheet_();
    // Check under the same lock as the append: retries after a lost response are safe.
    var duplicate = sheet.getLastRow() > 1 && sheet.getRange(2, 2, sheet.getLastRow() - 1, 1)
      .createTextFinder(p.requestId).matchEntireCell(true).findNext();
    if (duplicate) return json_({ ok: true, duplicate: true, rewardAccepted: sheet.getRange(duplicate.getRow(), 6).getValue() === '응모' });
    if (decoded.length) {
      var folderId = PropertiesService.getScriptProperties().getProperty('FEEDBACK_UPLOAD_FOLDER_ID');
      if (!folderId) throw new Error('MISSING_UPLOAD_FOLDER');
      var folder = DriveApp.getFolderById(folderId);
      decoded.forEach(function(file, index) {
        var upload = folder.createFile(Utilities.newBlob(file.bytes, file.type, p.requestId + '-' + (index + 1) + '.' + file.ext));
        uploads.push(upload);
      });
    }
    var now = new Date();
    var reward = rewardAccepted_(p, now);
    var activeIds = fields_(p.mode).map(function(q) { return q.id; });
    var values = [now, p.requestId, SURVEY.version, p.mode === 'complete' ? '내보내기 완료' : '중단·미완료',
      safeCell_(p.email), reward ? '응모' : p.reward ? '기간 외' : '미응모', '동의'];
    allFields_().forEach(function(q) { values.push(activeIds.indexOf(q.id) >= 0 ? safeCell_(p.answers[q.id]) : ''); });
    values.push(uploads[0] ? uploads[0].getUrl() : '', uploads[1] ? uploads[1].getUrl() : '', JSON.stringify(uploads.map(function(file) { return file.getId(); })));
    sheet.appendRow(values);
    saved = true;
    return json_({ ok: true, rewardAccepted: reward });
  } catch (_) {
    // An append can succeed even when its acknowledgement is lost. Preserve
    // attachments if its ID is already present; the next request will deduplicate.
    try {
      var existing = sheet_();
      saved = saved || (existing.getLastRow() > 1 && !!existing.getRange(2, 2, existing.getLastRow() - 1, 1).createTextFinder(p.requestId).matchEntireCell(true).findNext());
    } catch (_) { /* On an ambiguous write, leave attachments for retention cleanup. */ saved = true; }
    if (!saved) uploads.forEach(function(file) { try { Drive.Files.remove(file.getId()); } catch (_) { /* Daily cleanup handles orphan files. */ } });
    return json_({ ok: false, error: 'SAVE_FAILED' });
  } finally { lock.releaseLock(); }
}

/** Run once after setting FEEDBACK_SHEET_ID. No notifications or public sharing. */
function setupOpenBetaFeedback() {
  var properties = PropertiesService.getScriptProperties();
  var id = properties.getProperty('FEEDBACK_SHEET_ID');
  if (!id) throw new Error('Set FEEDBACK_SHEET_ID to the new workbook ID first.');
  var book = SpreadsheetApp.openById(id);
  book.setSpreadsheetTimeZone('Asia/Seoul');
  var sheet = book.getSheetByName('오픈베타 피드백') || book.insertSheet('오픈베타 피드백');
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet_(); // Refuse to overwrite a different schema.
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#eeeeee').setWrap(true);
  sheet.setColumnWidths(1, HEADERS.length, 220);
  sheet.setRowHeight(1, 78);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  if (!properties.getProperty('FEEDBACK_UPLOAD_FOLDER_ID')) {
    properties.setProperty('FEEDBACK_UPLOAD_FOLDER_ID', DriveApp.createFolder('Standin 오픈베타 설문 첨부 (비공개)').getId());
  }
  var exists = ScriptApp.getProjectTriggers().some(function(trigger) { return trigger.getHandlerFunction() === 'deleteExpiredFeedback'; });
  if (!exists) ScriptApp.newTrigger('deleteExpiredFeedback').timeBased().everyDays(1).atHour(3).inTimezone('Asia/Seoul').create();
}

/** Permanently remove only this receiver's attachments and rows after 90 days. */
function deleteExpiredFeedback() {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = sheet_();
    var folderId = PropertiesService.getScriptProperties().getProperty('FEEDBACK_UPLOAD_FOLDER_ID');
    if (!folderId) throw new Error('MISSING_UPLOAD_FOLDER');
    var cutoff = Date.now() - 90 * 86400000;
    var files = DriveApp.getFolderById(folderId).getFiles();
    while (files.hasNext()) {
      var file = files.next();
      if (/^[0-9a-f-]{36}-[12]\.(png|jpg|webp)$/i.test(file.getName()) && file.getDateCreated().getTime() < cutoff) {
        Drive.Files.remove(file.getId());
      }
    }
    if (sheet.getLastRow() < 2) return;
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i][0] instanceof Date && rows[i][0].getTime() < cutoff) sheet.deleteRow(i + 2);
    }
  } finally { lock.releaseLock(); }
}
