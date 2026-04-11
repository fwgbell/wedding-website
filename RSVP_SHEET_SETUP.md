# RSVP Google Sheet setup (Apps Script)

This site’s RSVP form sends data directly to a Google Sheet using a Google Apps Script **Web App** endpoint.

You will:
- Add a new sheet tab for RSVPs (recommended name: `RSVPs`).
- Add an Apps Script project bound to the spreadsheet.
- Deploy it as a web app.
- Paste the web app URL into `assets/js/main.js` (`rsvpSheetConfig.webAppUrl`).

---

## 1) Create the RSVP sheet tab + headers

In your spreadsheet, create (or rename) a tab called `RSVPs` and add these headers on row 1 (columns A onward):

- `Timestamp`
- `Guest`
- `Email`
- `Attending wedding day`
- `Attending garden party`
- `Meal`
- `Dietary`
- `Coach`
- `Notes`

Notes:
- The code below appends rows in this order.
- The site checks “already RSVP’d” by looking up a row where `Guest` matches the currently authenticated guest name.
- With grouped guests, the script stores one row per guest. A group is considered already RSVP’d if any guest in that group already has a row.

---

## 2) Add Apps Script to the spreadsheet

1. Open the spreadsheet.
2. Go to:
   - `Extensions` -> `Apps Script`
3. Delete any starter code in `Code.gs`.
4. Paste the full script below.

### `Code.gs`

```javascript
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "";

  if (action === "get") {
    var guest = (e && e.parameter && e.parameter.guest) ? String(e.parameter.guest) : "";
    var guestsParam = (e && e.parameter && e.parameter.guests) ? String(e.parameter.guests) : "";
    if (!guest) {
      return jsonResponse({ ok: false, error: "Missing guest" });
    }

    // Optional: request the whole group at once.
    // Provide guests as a pipe-delimited list of names: guests=Name%20One|Name%20Two
    var requestedGuests = [];
    if (guestsParam) {
      requestedGuests = guestsParam
        .split("|")
        .map(function (s) { return String(s || "").trim(); })
        .filter(function (s) { return s !== ""; });
    }

    var sheet = getRsvpSheet_();
    var values = sheet.getDataRange().getValues();
    // Expect headers in first row.
    var guestColIndex = findHeaderIndex_(values[0], "Guest");
    var emailColIndex = findHeaderIndex_(values[0], "Email");
    var attendingWeddingColIndex = findHeaderIndex_(values[0], "Attending wedding day");
    var attendingGardenColIndex = findHeaderIndex_(values[0], "Attending garden party");
    var mealColIndex = findHeaderIndex_(values[0], "Meal");
    var dietaryColIndex = findHeaderIndex_(values[0], "Dietary");
    var coachColIndex = findHeaderIndex_(values[0], "Coach");
    var notesColIndex = findHeaderIndex_(values[0], "Notes");

    if (guestColIndex === -1) {
      return jsonResponse({ ok: false, error: "Missing 'Guest' header" });
    }

    var groupRows = [];
    var guestTarget = guest.trim().toLowerCase();
    var guestSet = {};
    if (requestedGuests.length > 0) {
      for (var g = 0; g < requestedGuests.length; g++) {
        guestSet[requestedGuests[g].trim().toLowerCase()] = true;
      }
    }

    for (var i = 1; i < values.length; i++) {
      var rowGuest = String(values[i][guestColIndex] || "").trim();
      if (!rowGuest) continue;

      var rowKey = rowGuest.toLowerCase();
      var matches = requestedGuests.length > 0 ? !!guestSet[rowKey] : (rowKey === guestTarget);
      if (!matches) continue;

      groupRows.push({
        name: rowGuest,
        email: emailColIndex === -1 ? "" : String(values[i][emailColIndex] || ""),
        attendingWedding: attendingWeddingColIndex === -1 ? "" : String(values[i][attendingWeddingColIndex] || ""),
        attendingGarden: attendingGardenColIndex === -1 ? "" : String(values[i][attendingGardenColIndex] || ""),
        meal: mealColIndex === -1 ? "" : String(values[i][mealColIndex] || ""),
        dietary: dietaryColIndex === -1 ? "" : String(values[i][dietaryColIndex] || ""),
        coach: coachColIndex === -1 ? "" : String(values[i][coachColIndex] || ""),
        notes: notesColIndex === -1 ? "" : String(values[i][notesColIndex] || ""),
      });
    }

    if (groupRows.length > 0) {
      return jsonResponse({
        ok: true,
        found: true,
        data: {
          guest: guest,
          rsvpGuests: groupRows,
          "entry.777777": groupRows[0].notes || "",
        },
      });
    }

    return jsonResponse({ ok: true, found: false });
  }

  return jsonResponse({ ok: false, error: "Unsupported action" });
}

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : "{}");
    if (!payload || payload.action !== "submit") {
      return jsonResponse({ ok: false, error: "Unsupported action" });
    }

    var data = payload.data || {};

    // Expected keys from the website (see assets/js/main.js):
    // - guest (optional, will be set if user is authenticated)
    // - entry.111111 (guest select) / entry.222222 (email) / entry.555555 (meal) ...
    // - rsvpGuests: [{ name: "Guest Name", email: "", attendingWedding: "yes"|"no"|"", attendingGarden: "yes"|"no"|"", meal: "", dietary: "", coach: "yes"|"no"|"" }, ...]
    var primaryGuest = String(data.guest || data["entry.111111"] || "").trim();
    var notes = String(data["entry.777777"] || "").trim();

    if (!primaryGuest) {
      return jsonResponse({ ok: false, error: "Missing guest" });
    }

    var rsvpGuests = data.rsvpGuests;
    if (!rsvpGuests || !rsvpGuests.length) {
      // Backwards compatible fallback: store the primary guest only.
      rsvpGuests = [{ name: primaryGuest, attendingWedding: "", attendingGarden: "" }];
    }

    var sheet = getRsvpSheet_();

    // Prevent duplicate RSVPs for the same group: if any guest already exists, don't append any rows.
    if (hasExistingAnyGuest_(sheet, rsvpGuests)) {
      return jsonResponse({ ok: true, alreadyExists: true });
    }

    for (var i = 0; i < rsvpGuests.length; i++) {
      var g = rsvpGuests[i] || {};
      var guestName = String(g.name || "").trim();
      if (!guestName) continue;

      var email = String(g.email || "").trim();
      var attendingWedding = String(g.attendingWedding || "").trim();
      var attendingGarden = String(g.attendingGarden || "").trim();
      var meal = String(g.meal || "").trim();
      var dietary = String(g.dietary || "").trim();
      var coach = String(g.coach || "").trim();

      sheet.appendRow([
        new Date(),
        guestName,
        email,
        attendingWedding,
        attendingGarden,
        meal,
        dietary,
        coach,
        notes,
      ]);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRsvpSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("RSVPs");
  if (!sheet) {
    throw new Error("Missing sheet tab named 'RSVPs'");
  }
  return sheet;
}

function findHeaderIndex_(headers, headerName) {
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === String(headerName).trim().toLowerCase()) {
      return i;
    }
  }
  return -1;
}

function hasExistingGuest_(sheet, guest) {
  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return false;

  var guestColIndex = findHeaderIndex_(values[0], "Guest");
  if (guestColIndex === -1) return false;

  var target = guest.trim().toLowerCase();
  for (var i = 1; i < values.length; i++) {
    var rowGuest = String(values[i][guestColIndex] || "").trim().toLowerCase();
    if (rowGuest && rowGuest === target) {
      return true;
    }
  }
  return false;
}

function hasExistingAnyGuest_(sheet, rsvpGuests) {
  if (!rsvpGuests || !rsvpGuests.length) return false;

  for (var i = 0; i < rsvpGuests.length; i++) {
    var g = rsvpGuests[i] || {};
    var name = String(g.name || "").trim();
    if (!name) continue;
    if (hasExistingGuest_(sheet, name)) return true;
  }

  return false;
}
```

---

## 3) Deploy as a Web App

1. In Apps Script, click `Deploy` -> `New deployment`.
2. Select type: `Web app`.
3. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (or `Anyone with the link`)
4. Click `Deploy`.
5. Copy the **Web app URL**.

---

## 4) Configure the website to use the web app URL

Open `assets/js/main.js` and set:

- `rsvpSheetConfig.webAppUrl = "<YOUR_WEB_APP_URL>"`

After that:
- Submitting the RSVP will POST JSON to the web app.
- The RSVP page will also call `GET ?action=get&guest=<name>` to see if the logged-in guest already has a row.

---

## 5) How “already RSVP’d” works

- The website stores the current guest in local storage (`wedding-auth`).
- On `rsvp.html`, the site calls the web app endpoint with `action=get`.
- If the script finds any row where `Guest` matches that guest name (case-insensitive), it returns `{ found: true }`.
- The site then disables the form inputs and shows a message.

---

## Important notes

- This is *not* secure authentication. Anyone who knows the web app URL could submit data. It’s fine for a private wedding site, but be aware.
- If you later change field names in `rsvp.html`, keep the Apps Script `entry.XXXXXX` keys in sync (or update the script to match your new names).

---

## Troubleshooting: CORS / `origin 'null'`

If you open the site by double-clicking `index.html`, your browser uses a `file://` URL. In that case the page’s origin is `null`, and browsers apply stricter CORS behavior.

### Recommended: test via a local web server

Instead of opening the HTML file directly, serve the folder over HTTP (so the origin is `http://localhost:...`).

### Avoiding preflight requests

The website submits to Apps Script using `Content-Type: text/plain;charset=UTF-8` to avoid a CORS preflight request that can fail depending on the browser/origin combination.

If you still see CORS errors:
- Re-deploy the Apps Script Web App (a new deployment can clear stale permissions).
- Ensure Web App access is set to `Anyone` / `Anyone with the link`.
