/**
 * Bound to your spreadsheet (Extensions > Apps Script).
 * Returns ONLY published rows and ONLY whitelisted columns as JSON.
 * The spreadsheet itself stays private; this script is read-only.
 *
 * Optional: Project Settings > Script properties > add API_TOKEN (random string).
 * Then set the same value as APPS_SCRIPT_TOKEN in your hosting environment.
 */
var SHEET_NAME = 'Events';
var PUBLIC_COLUMNS = ['id','slug','title','description','category','city','venue',
  'start_datetime','end_datetime','image_url','price','organizer_name',
  'registration_url','contact_url','contact_public','group_url'];

function doGet(e) {
  var token = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
  if (token && (!e || !e.parameter || e.parameter.token !== token)) {
    return json_({ error: 'unauthorized' });
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return json_({ error: 'Events sheet not found' });
  var tz = ss.getSpreadsheetTimeZone();
  var values = sheet.getDataRange().getValues();
  var head = values.shift().map(function (h) { return String(h).trim(); });

  var events = values.map(function (row) {
    var o = {};
    head.forEach(function (h, i) { o[h] = row[i]; });
    return o;
  }).filter(function (o) {
    return String(o.status).trim().toLowerCase() === 'published' && o.title;
  }).map(function (o) {
    var p = {};
    PUBLIC_COLUMNS.forEach(function (k) {
      var v = o[k];
      if (v instanceof Date) v = Utilities.formatDate(v, tz, "yyyy-MM-dd'T'HH:mm:ssXXX");
      p[k] = (v === undefined || v === null) ? '' : v;
    });
    // Never expose a contact link unless the organizer opted in.
    if (String(o.contact_public).trim().toUpperCase() !== 'TRUE') p.contact_url = '';
    return p;
  });
  return json_({ events: events });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
