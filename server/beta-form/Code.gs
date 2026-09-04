/**
 * Standin 클로즈베타 사전등록 수신기 (Google Apps Script 웹앱)
 *
 * Formspree를 대체한다. 랜딩의 사전등록 폼이 이 웹앱으로 POST하면
 *   1) 구글 시트에 한 줄 기록  (원본 = 진실의 출처)
 *   2) 디스코드 웹훅 알림
 *   3) Gmail 알림 메일
 * 순서로 처리한다. 시트 기록이 성공하면 접수 성공으로 응답하고,
 * 알림 두 건은 실패해도 응답을 바꾸지 않는다 — 알림이 막혔다고
 * 이미 저장된 등록을 실패로 돌려보내면 사용자가 중복 제출한다.
 *
 * 설치·배포 방법은 같은 폴더의 README.md 참고.
 */

/**
 * 선택 항목 정의. 랜딩의 `src/data/content.ts`의 `beta` 옵션과 같아야 한다.
 * 스크립트가 저장소 코드를 import할 수 없어 값을 옮겨 적는다 —
 * content.ts의 옵션을 고치면 여기도 같이 고쳐라.
 *
 * 시트에는 코드가 아니라 라벨을 적는다. 사람이 읽는 표이기 때문이다.
 * 정의에 없는 코드가 오면 코드를 그대로 적어 값을 잃지 않는다.
 */
var FIELDS = [
  {
    key: 'role',
    label: '작업 형태',
    options: {
      artist: '개인 웹툰 작가',
      studio: '웹툰 스튜디오',
      assistant: '어시스턴트',
      other: '기타',
    },
  },
  {
    key: 'workStatus',
    label: '현재 작업 여부',
    options: {
      active: '현재 작업 중',
      occasional: '가끔 작업함',
      'not-now': '현재는 작업하지 않음',
    },
  },
  {
    key: 'clipStudioEdition',
    label: 'Clip Studio 제품',
    options: {
      pro: 'Clip Studio Paint PRO',
      ex: 'Clip Studio Paint EX',
      other: '기타·제품 모름',
      none: '사용하지 않음',
    },
  },
  {
    key: 'clipStudioVersion',
    label: 'Clip Studio 버전',
    options: {
      '1': 'Ver. 1',
      '2': 'Ver. 2',
      '3': 'Ver. 3',
      '4': 'Ver. 4',
      '5': 'Ver. 5',
      unknown: '버전 모름',
      none: '사용하지 않음',
    },
  },
  {
    key: 'mannequinExperience',
    label: '3D 인형 사용 경험',
    options: {
      often: '자주 사용함',
      sometimes: '가끔 사용함',
      tried: '사용해 본 적 있음',
      none: '사용 경험 없음',
    },
  },
  {
    key: 'source',
    label: '알게 된 경로',
    options: {
      'pd-network': '작가·PD 소개',
      ahart: '에이하트',
      'webtoon-academy': '웹툰 학원',
      studio: '스튜디오',
      bansa: '방사 네이버 카페',
      x: 'X(트위터)',
      postype: '포스타입',
      kakao: '카카오 오픈채팅',
      discord: '디스코드',
      tumblbug: '텀블벅',
      bipa: '부산글로벌웹툰센터',
      pinterest: 'Pinterest',
      other: '기타',
    },
  },
];

var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

/**
 * 시트 헤더. `scripts/formspree-to-csv.mjs`의 HEADER와 순서가 같아야 한다.
 * 열을 바꾸면 이관본과 어긋나므로 뒤에만 추가한다.
 */
var HEADER = ['접수시각(KST)', '이메일']
  .concat(
    FIELDS.map(function (f) {
      return f.label;
    }),
  )
  .concat(['수신동의'])
  .concat(UTM_KEYS)
  .concat(['유입 페이지', '브라우저', '비고']);

var TIMEZONE = 'Asia/Seoul';
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var DISCORD_COLOR = 16739159; // #ff6b57 (brand coral)

/** 피드백 시트는 질문 하나를 열 하나로 저장한다. 분기 밖 질문은 빈칸으로 남는다. */
var FEEDBACK_FIELDS = [
  { key: 'role', label: '역할' },
  { key: 'production', label: '현재 작품 제작 여부' },
  { key: 'q4_usage_stage', label: '사용 완료 단계' },
  { key: 'q5_use_case', label: '사용한 작업' },
  { key: 'q6_previous_method', label: '기존 포즈 준비 방식' },
  { key: 'q7_previous_pain', label: '기존 방식 불편점' },
  { key: 'q7_outsource_experience', label: '3D 인체 외주 의뢰·수행 경험' },
  { key: 'q7_3d_usage_reason', label: '3D 인체 사용 이유' },
  { key: 'q8_top5_match', label: 'TOP 5 중 활용 가능 후보 수' },
  { key: 'q8_public_case_consent', label: '사용 화면 활용 사례 소개 동의' },
  { key: 'q12_usability', label: '실제 작화 활용도' },
  { key: 'q14_time_change', label: '포즈 준비 시간 변화' },
  { key: 'q15_work_ready', label: '실제 작업 도움 정도' },
  { key: 'q17_improvements', label: '유료 사용 의향 기능(최대 3)' },
  { key: 'q18_workflow_need', label: '기능이 필요한 실제 작업·문제' },
  { key: 'q22_payment_model', label: '선호 이용 방식' },
  { key: 'q23_monthly_price', label: '개인 월 구독 최대 지불 의향' },
  { key: 'q23_plugin_price', label: '1회 구매 최대 지불 의향' },
  { key: 'q24_finished_work', label: '완성 작업물 여부' },
  { key: 'q25_artifact_link', label: '완성 작업물 링크' },
  { key: 'q25_public_case_consent', label: '완성 작업물 활용 사례 소개 동의' },
  { key: 'q26_artifact_usage', label: '작업물 활용 설명' },
  { key: 'q27_internal_consent', label: '내부 검토 동의' },
  { key: 'exit_q6_reason', label: '중단 이유' },
  { key: 'exit_q6_reason_other', label: '중단 이유 기타 직접 입력' },
  { key: 'exit_q7_detail', label: '문제 상세' },
  { key: 'exit_q9_retry', label: '지원 후 재시도 의향' },
  { key: 'exit_q10_support', label: '선호 지원 방법' },
  { key: 'q31_launch_interest', label: '정식 출시 사용 의향·메일 수신 동의' },
  { key: 'q29_interview', label: '10만원 전문가 인터뷰 대상·참여 의향' },
  { key: 'q30_comment', label: '추가 의견' },
];

var FEEDBACK_FILE_FIELDS = [
  { key: 'q8_screen_first', label: '사용한 러프 또는 사용 과정' },
  { key: 'q9_screen_second', label: '3D 인체 적용 결과' },
  { key: 'exit_q8_screen', label: '문제 화면' },
  { key: 'q25_artifact', label: '완성 작업물 파일' },
];

var FEEDBACK_HEADER = ['접수시각(KST)', '설문 경로', '이메일']
  .concat(
    FEEDBACK_FIELDS.map(function (field) {
      return field.label;
    }),
  )
  .concat(
    FEEDBACK_FILE_FIELDS.map(function (field) {
      return field.label;
    }),
  )
  .concat(['유입 페이지', '브라우저']);

// ── 엔드포인트 ────────────────────────────────────────────────────────────

/** 헬스 체크. 브라우저로 열었을 때 배포가 살아있는지만 확인한다. */
function doGet() {
  return jsonResponse_({ ok: true, service: 'standin-beta-form' });
}

function doPost(e) {
  var payload;
  try {
    payload = parseBody_(e);
  } catch (err) {
    return jsonResponse_({ ok: false, error: 'INVALID_JSON' });
  }

  // 허니팟: 사람에게는 보이지 않는 필드가 채워졌으면 봇이다.
  // 봇에게 실패를 알려주면 우회를 시도하므로 조용히 성공으로 응답하고 버린다.
  if (payload.website) {
    return jsonResponse_({ ok: true });
  }

  if (payload.formType === 'feedback') {
    return handleFeedbackPost_(payload);
  }

  var invalid = validate_(payload);
  if (invalid.length > 0) {
    return jsonResponse_({ ok: false, error: 'INVALID_INPUT', fields: invalid });
  }

  var record = buildRecord_(payload);

  var appended;
  try {
    appended = appendRecord_(record);
  } catch (err) {
    console.error('시트 기록 실패: ' + err);
    return jsonResponse_({ ok: false, error: 'SERVER_ERROR' });
  }

  // 알림은 부가 작업이다. 실패해도 로그만 남기고 접수는 성공으로 응답한다.
  notifySafely_('discord', function () {
    sendDiscord_(buildDiscordPayload_(appended.record, appended.row));
  });
  notifyEmailIfConfigured_('email', function () {
    sendEmail_(appended.record, appended.row);
  });

  return jsonResponse_({ ok: true, duplicate: appended.record.note !== '' });
}

// ── 입력 처리 ─────────────────────────────────────────────────────────────

/**
 * 본문을 JSON으로 읽는다.
 * 폼은 `text/plain`으로 보낸다 — 브라우저가 preflight(OPTIONS)를 띄우지 않는
 * "단순 요청"이 되고, Apps Script 웹앱은 OPTIONS를 처리하지 못하기 때문이다.
 */
function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

// ── 클로즈베타 피드백 ───────────────────────────────────────────────────

function handleFeedbackPost_(payload) {
  var invalid = validateFeedback_(payload);
  if (invalid.length > 0) {
    return jsonResponse_({ ok: false, error: 'INVALID_INPUT', fields: invalid });
  }

  var uploads;
  try {
    uploads = saveFeedbackFiles_(payload.files || [], payload.email);
  } catch (err) {
    console.error('피드백 파일 저장 실패: ' + err);
    return jsonResponse_({ ok: false, error: 'UPLOAD_ERROR' });
  }

  var record = buildFeedbackRecord_(payload, uploads);
  var row;
  try {
    row = appendFeedbackRecord_(record);
  } catch (err) {
    console.error('피드백 시트 기록 실패: ' + err);
    return jsonResponse_({ ok: false, error: 'SERVER_ERROR' });
  }

  notifySafely_('feedback-discord', function () {
    sendDiscord_(buildFeedbackDiscordPayload_(record, row));
  });
  notifyEmailIfConfigured_('feedback-email', function () {
    sendFeedbackEmail_(record, row);
  });

  return jsonResponse_({ ok: true });
}

function validateFeedback_(payload) {
  var invalid = [];
  if (!payload.email || !EMAIL_PATTERN.test(String(payload.email).trim())) {
    invalid.push('email');
  }
  if (payload.branch !== 'complete' && payload.branch !== 'dropoff') {
    invalid.push('branch');
  }
  if (!payload.usageStage) invalid.push('usageStage');
  if (!payload.answers || typeof payload.answers !== 'object') invalid.push('answers');
  if (!payload.role) invalid.push('role');
  if (!payload.production) invalid.push('production');

  var surveyPath = payload.surveyPath || payload.branch;
  if (surveyPath === 'complete') {
    var fileKeys = (payload.files || []).map(function (file) {
      return file.key;
    });
    if (fileKeys.indexOf('q8_screen_first') === -1) invalid.push('q8_screen_first');
    if (fileKeys.indexOf('q9_screen_second') === -1) invalid.push('q9_screen_second');
  }
  return invalid;
}

function buildFeedbackRecord_(payload, uploads) {
  var answers = payload.answers || {};
  answers.role = payload.roleLabel || payload.role;
  answers.production = payload.productionLabel || payload.production;
  answers.q4_usage_stage = payload.usageStageLabel || payload.usageStage;
  return {
    receivedAt: Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
    branch: payload.surveyPath || payload.branch,
    email: String(payload.email).trim().toLowerCase(),
    answers: answers,
    uploads: uploads,
    pageUrl: trim_(payload.pageUrl),
    userAgent: trim_(payload.userAgent),
  };
}

function safeFileName_(name) {
  return String(name || 'image')
    .replace(/[\\/:*?"<>|]/g, '_')
    .slice(0, 120);
}

function saveFeedbackFiles_(files, email) {
  if (!files || files.length === 0) return {};
  var folderId = PropertiesService.getScriptProperties().getProperty(
    'FEEDBACK_UPLOAD_FOLDER_ID',
  );
  if (!folderId) throw new Error('FEEDBACK_UPLOAD_FOLDER_ID가 비어 있다.');

  var allowed = {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
  };
  var root = DriveApp.getFolderById(folderId);
  var stamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyyMMdd-HHmmss');
  var respondent = root.createFolder(
    stamp + '-' + safeFileName_(String(email).split('@')[0]),
  );
  var uploads = {};

  files.forEach(function (file) {
    var known =
      file &&
      FEEDBACK_FILE_FIELDS.some(function (field) {
        return field.key === file.key;
      });
    var isClip =
      file &&
      file.key === 'q25_artifact' &&
      /\.clip$/i.test(String(file.name || ''));
    var maxDataLength = isClip ? 30000000 : 12000000;
    if (!file || !known) throw new Error('허용되지 않은 파일 항목');
    if (!allowed[file.type] && !isClip) throw new Error('허용되지 않은 파일 형식');
    if (!file.data || String(file.data).length > maxDataLength) {
      throw new Error('파일이 비어 있거나 너무 크다.');
    }
    var blob = Utilities.newBlob(
      Utilities.base64Decode(String(file.data)),
      file.type || 'application/octet-stream',
      safeFileName_(file.name),
    );
    var saved = respondent.createFile(blob);
    uploads[file.key] = saved.getUrl();
  });
  return uploads;
}

function getFeedbackSheet_() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SHEET_ID');
  var book = sheetId
    ? SpreadsheetApp.openById(sheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('피드백을 기록할 시트를 찾을 수 없다.');

  var name = props.getProperty('FEEDBACK_SHEET_NAME') || '클로즈베타 피드백';
  var sheet = book.getSheetByName(name) || book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FEEDBACK_HEADER);
    sheet.setFrozenRows(1);
  } else {
    syncFeedbackHeader_(sheet);
  }
  sheet.getRange(1, 1, 1, FEEDBACK_HEADER.length).setFontWeight('bold');
  sheet
    .getRange(1, 1, 1, FEEDBACK_HEADER.length)
    .setBackground('#152238')
    .setFontColor('#ffffff');
  return sheet;
}

/** 새 질문이 추가되면 기존 응답 열을 보존하면서 빠진 열만 정확한 위치에 삽입한다. */
function syncFeedbackHeader_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet
    .getRange(1, 1, 1, width)
    .getValues()[0]
    .map(function (value) {
      return String(value || '');
    });

  FEEDBACK_HEADER.forEach(function (label, index) {
    if (current[index] === label) return;
    var column = index + 1;
    if (column <= sheet.getMaxColumns()) {
      sheet.insertColumnBefore(column);
    } else {
      sheet.insertColumnAfter(sheet.getMaxColumns());
    }
    sheet.getRange(1, column).setValue(label);
    current.splice(index, 0, label);
  });
}

function feedbackValue_(value) {
  if (Array.isArray(value)) return value.join(' · ');
  return value === undefined || value === null ? '' : String(value);
}

function feedbackToRow_(record) {
  var row = [
    record.receivedAt,
    record.branch === 'complete' ? '내보내기 완료' : '중단·이탈',
    record.email,
  ];
  FEEDBACK_FIELDS.forEach(function (field) {
    row.push(feedbackValue_(record.answers[field.key]));
  });
  FEEDBACK_FILE_FIELDS.forEach(function (field) {
    row.push(record.uploads[field.key] || '');
  });
  row.push(record.pageUrl, record.userAgent);
  return row;
}

function appendFeedbackRecord_(record) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getFeedbackSheet_();
    sheet.appendRow(feedbackToRow_(record));
    return sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }
}

function buildFeedbackDiscordPayload_(record, row) {
  return {
    username: 'Standin 피드백',
    embeds: [
      {
        title: '클로즈베타 피드백 도착',
        color: DISCORD_COLOR,
        fields: [
          { name: '이메일', value: record.email, inline: false },
          {
            name: '사용 경로',
            value: record.branch === 'complete' ? '내보내기 완료' : '중단·이탈',
            inline: true,
          },
          {
            name: '도달 단계',
            value: feedbackValue_(record.answers.q4_usage_stage) || '—',
            inline: true,
          },
          {
            name: '정식 출시 안내',
            value: feedbackValue_(record.answers.q31_launch_interest) || '—',
            inline: false,
          },
          {
            name: '후속 인터뷰',
            value: feedbackValue_(record.answers.q29_interview) || '—',
            inline: false,
          },
        ],
        footer: { text: '피드백 시트 ' + row + '행' },
      },
    ],
  };
}

function sendFeedbackEmail_(record, row) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) throw new Error('스크립트 속성 NOTIFY_EMAIL이 비어 있다.');
  MailApp.sendEmail({
    to: to,
    subject: '[Standin] 클로즈베타 피드백 — ' + record.email,
    body: [
      '새 클로즈베타 피드백이 접수되었습니다.',
      '',
      '이메일: ' + record.email,
      '경로: ' + (record.branch === 'complete' ? '내보내기 완료' : '중단·이탈'),
      '도달 단계: ' + feedbackValue_(record.answers.q4_usage_stage),
      '정식 출시 안내: ' + feedbackValue_(record.answers.q31_launch_interest),
      '후속 인터뷰: ' + feedbackValue_(record.answers.q29_interview),
      '',
      '구글 시트 ' + row + '행에서 전체 답변과 첨부 링크를 확인하세요.',
    ].join('\n'),
    name: 'Standin 피드백',
  });
}

/** 랜딩 폼과 같은 항목을 필수로 본다. 통과하지 못한 필드 이름을 돌려준다. */
function validate_(payload) {
  var invalid = [];

  if (!payload.email || !EMAIL_PATTERN.test(String(payload.email).trim())) {
    invalid.push('email');
  }
  FIELDS.forEach(function (field) {
    var value = payload[field.key];
    if (!value || !field.options[String(value)]) invalid.push(field.key);
  });
  if (payload.consent !== true) invalid.push('consent');

  return invalid;
}

function buildRecord_(payload) {
  var record = {
    receivedAt: Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
    email: String(payload.email).trim().toLowerCase(),
    consent: payload.consent === true,
    answers: {},
    utm: {},
    pageUrl: trim_(payload.pageUrl),
    userAgent: trim_(payload.userAgent),
    note: '',
  };

  FIELDS.forEach(function (field) {
    record.answers[field.key] = String(payload[field.key]);
  });
  UTM_KEYS.forEach(function (key) {
    record.utm[key] = trim_(payload[key]);
  });

  return record;
}

function trim_(value) {
  return value ? String(value).slice(0, 300) : '';
}

/** 코드를 사람이 읽는 라벨로. 정의에 없으면 코드를 그대로 쓴다. */
function labelOf_(field, code) {
  return field.options[String(code)] || String(code || '');
}

// ── 시트 ──────────────────────────────────────────────────────────────────

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SHEET_ID');
  var book = sheetId
    ? SpreadsheetApp.openById(sheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!book) {
    throw new Error(
      '시트를 찾을 수 없다. 스크립트 속성 SHEET_ID를 설정하거나 시트에 바인딩해라.',
    );
  }

  var name = props.getProperty('SHEET_NAME') || '클로즈베타 사전등록';
  var sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }
  return sheet;
}

function toRow_(record) {
  var row = [record.receivedAt, record.email];
  FIELDS.forEach(function (field) {
    row.push(labelOf_(field, record.answers[field.key]));
  });
  row.push(record.consent ? 'Y' : 'N');
  UTM_KEYS.forEach(function (key) {
    row.push(record.utm[key]);
  });
  row.push(record.pageUrl, record.userAgent, record.note);
  return row;
}

/**
 * 한 줄 추가하고 기록된 행 번호를 돌려준다.
 * 동시 제출이 같은 행을 덮어쓰지 않도록 스크립트 락을 잡는다.
 */
function appendRecord_(record) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    if (isDuplicateEmail_(sheet, record.email)) {
      record.note = '중복(재등록)';
    }
    sheet.appendRow(toRow_(record));
    return { record: record, row: sheet.getLastRow() };
  } finally {
    lock.releaseLock();
  }
}

function isDuplicateEmail_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === email) return true;
  }
  return false;
}

/**
 * 행 번호로 기록을 다시 읽는다. 누락 알림 재발송에 쓴다.
 * 시트에는 라벨이 적혀 있으므로 answers에도 라벨이 담긴다 —
 * labelOf_가 모르는 값을 그대로 통과시켜 표시는 동일하다.
 */
function readRow_(row) {
  var sheet = getSheet_();
  var values = sheet.getRange(row, 1, 1, HEADER.length).getValues()[0];
  var record = {
    receivedAt: values[0],
    email: values[1],
    answers: {},
    utm: {},
    consent: false,
    pageUrl: '',
    userAgent: '',
    note: '',
  };

  var i = 2;
  FIELDS.forEach(function (field) {
    record.answers[field.key] = values[i++];
  });
  record.consent = values[i++] === 'Y';
  UTM_KEYS.forEach(function (key) {
    record.utm[key] = values[i++];
  });
  record.pageUrl = values[i++];
  record.userAgent = values[i++];
  record.note = values[i];

  return record;
}

// ── 알림 ──────────────────────────────────────────────────────────────────

function notifySafely_(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(label + ' 알림 실패: ' + err);
  }
}

/** NOTIFY_EMAIL을 설정한 경우에만 이메일 알림을 보낸다. */
function notifyEmailIfConfigured_(label, fn) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!String(to || '').trim()) {
    console.log(label + ' 알림 건너뜀: NOTIFY_EMAIL 미설정');
    return;
  }
  notifySafely_(label, fn);
}

function buildDiscordPayload_(record, row, options) {
  var opts = options || {};
  var fields = [{ name: '이메일', value: String(record.email), inline: false }];

  FIELDS.forEach(function (field) {
    fields.push({
      name: field.label,
      value: labelOf_(field, record.answers[field.key]) || '—',
      inline: true,
    });
  });
  fields.push({
    name: '접수시각(KST)',
    value: String(record.receivedAt),
    inline: false,
  });

  var utm = describeUtm_(record.utm);
  if (utm) fields.push({ name: 'UTM', value: utm, inline: false });
  if (record.note) {
    fields.push({ name: '비고', value: String(record.note), inline: false });
  }

  return {
    username: 'Standin 사전등록',
    embeds: [
      {
        title: opts.title || '클로즈베타 사전등록',
        description: opts.description || '',
        color: DISCORD_COLOR,
        fields: fields,
        footer: { text: row ? '시트 ' + row + '행' : '시트 기록 없음' },
      },
    ],
  };
}

/** 값이 있는 UTM만 한 줄로 묶는다. 전부 비었으면 빈 문자열. */
function describeUtm_(utm) {
  return UTM_KEYS.filter(function (key) {
    return utm[key];
  })
    .map(function (key) {
      return key + '=' + utm[key];
    })
    .join(' · ');
}

function sendDiscord_(payload) {
  var url = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  if (!url) throw new Error('스크립트 속성 DISCORD_WEBHOOK_URL이 비어 있다.');
  url = String(url).trim();
  if (!/^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\//i.test(url)) {
    throw new Error(
      'DISCORD_WEBHOOK_URL에는 채널 주소가 아니라 https://discord.com/api/webhooks/... 형식의 웹후크 URL을 넣어야 한다.'
    );
  }

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  var code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('디스코드 응답 ' + code + ': ' + res.getContentText());
  }
}

function sendEmail_(record, row) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) throw new Error('스크립트 속성 NOTIFY_EMAIL이 비어 있다.');

  var lines = [
    '새 클로즈베타 사전등록이 접수되었습니다.',
    '',
    '이메일: ' + record.email,
  ];
  FIELDS.forEach(function (field) {
    lines.push(field.label + ': ' + labelOf_(field, record.answers[field.key]));
  });
  lines.push('수신 동의: ' + (record.consent ? 'Y' : 'N'));
  lines.push('접수시각(KST): ' + record.receivedAt);

  var utm = describeUtm_(record.utm);
  if (utm) lines.push('UTM: ' + utm);
  if (record.pageUrl) lines.push('유입 페이지: ' + record.pageUrl);
  if (record.note) lines.push('비고: ' + record.note);
  if (row) lines.push('', '시트 ' + row + '행에 기록되었습니다.');

  MailApp.sendEmail({
    to: to,
    subject: '[Standin] 클로즈베타 사전등록 — ' + record.email,
    body: lines.join('\n'),
    name: 'Standin 사전등록',
  });
}

// ── 응답 ──────────────────────────────────────────────────────────────────

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ── 수동 실행용 도구 ──────────────────────────────────────────────────────

/** 시트와 헤더를 만든다. 배포 전에 한 번 실행한다. */
function setupSheet() {
  var sheet = getSheet_();
  console.log('시트 준비 완료: ' + sheet.getName() + ' (' + sheet.getLastRow() + '행)');
}

/** 피드백 탭과 질문별 열을 만든다. 피드백 수집 전에 한 번 실행한다. */
function setupFeedbackSheet() {
  var sheet = getFeedbackSheet_();
  console.log('피드백 시트 준비 완료: ' + sheet.getName() + ' (' + sheet.getLastRow() + '행)');
}

/** 디스코드 웹후크가 실제로 동작하는지 확인한다. 시트에는 기록하지 않는다. */
function sendTestNotification() {
  var record = buildRecord_({
    email: 'test@example.com',
    role: 'artist',
    workStatus: 'active',
    clipStudioEdition: 'pro',
    clipStudioVersion: '3',
    mannequinExperience: 'sometimes',
    source: 'discord',
    consent: true,
    pageUrl: '(테스트)',
  });
  record.note = '연결 테스트 — 실제 등록 아님';

  sendDiscord_(buildDiscordPayload_(record, 0, { title: '연결 테스트' }));
  console.log('디스코드 테스트 알림 발송 완료');
}

/**
 * 이미 시트에 있는 행의 디스코드 알림을 다시 보낸다.
 * Formspree 무료 한도(월 50건)를 넘겨 알림이 가지 않은 등록을 보정할 때 쓴다.
 *
 * 사용법: 아래 ROWS에 보정할 행 번호를 넣고 이 함수를 실행한다.
 */
function resendMissedDiscordAlerts() {
  var ROWS = []; // ← 예: [37] 또는 [37, 38]. 헤더가 1행이므로 데이터는 2행부터.

  if (ROWS.length === 0) {
    throw new Error('ROWS에 보정할 데이터 행 번호(2 이상)를 넣고 실행해라.');
  }

  ROWS.forEach(function (row) {
    if (row < 2) throw new Error('데이터 행은 2행부터다: ' + row);
    var record = readRow_(row);
    if (!record.email) throw new Error(row + '행이 비어 있다.');

    sendDiscord_(
      buildDiscordPayload_(record, row, {
        title: '클로즈베타 사전등록 (지연 알림)',
        description:
          'Formspree 월 한도로 당시 알림이 발송되지 않은 등록입니다. 접수 자체는 정상 처리되었습니다.',
      }),
    );
    console.log(row + '행 알림 재발송 완료: ' + record.email);
  });
}
