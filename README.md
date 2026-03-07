# Wedding Website (Static Template)

This is a simple, static wedding website built with **plain HTML, CSS, and a little JavaScript**. It is designed to be easy to customize and host on **GitHub Pages**.

You can change all of the text, images, and colors without any build tools.

---

## Pages

All pages live in the root folder so they work nicely with GitHub Pages:

- `index.html`: Home page with hero section, navigation, and a **countdown** to your wedding date.
- `details.html`: Ceremony and reception details, schedule, dress code, and map placeholder.
- `garden-party.html`: Day 2 details for the "Happily Ever After" celebration.
- `travel-stay.html`: Travel info, accommodation options, and local recommendations.
- `rsvp.html`: RSVP form that can submit directly to a Google Form / Sheet.
- `registry.html`: Links to your registry sites or honeymoon/charity funds.
- `faq-contact-day1.html`: FAQ & contact for wedding day (day 1) guests.
- `faq-contact-day2.html`: FAQ & contact for garden party (day 2) guests.

Shared assets:

- `assets/css/main.css`: The CSS file all pages use.
- `assets/js/main.js`: Shared JavaScript (navigation toggle, countdown, RSVP validation, FAQ accordion).
- `assets/img/`: Put your own images here (hero photo, venue photos, etc.).

---

## Quick start

1. **Open the folder** in your editor.
2. Double-click `index.html` to open it in your browser.
3. Start replacing placeholder text and links with your own details.

You can copy the whole folder into a new GitHub repository when you are ready to publish.

---

## Password protection and guest list

The site includes password protection and a guest list system to ensure only invited guests can access the site and RSVP.

### Setting up the guest list

1. Open `assets/js/guest-list.js`.
2. Edit the `guestList` array to add all your invited guests:

```js
const guestList = [
  { name: "John Smith", access: "both", password: "" },
  { name: "Jane Smith", access: "both", password: "" },
  { name: "Alice Johnson", access: "day1", password: "" },
  { name: "Bob Williams", access: "day2", password: "" },
  // Add more guests...
];
```

**Access levels:**
- `"both"` - Guest can see content for both days
- `"day1"` - Guest can only see day 1 content
- `"day2"` - Guest can only see day 2 content

**Individual passwords:** Leave `password: ""` to use the site password, or set a unique password for specific guests.

### Setting the site password

In `assets/js/guest-list.js`, set the site passwords:

```js
const fullAccessPassword = "Grange";
const day2AccessPassword = "Denbigh";
```

**To disable password protection:** Set both passwords to an empty string `""`. Guests will still need to select their name from the list.

### How it works

1. When a guest visits the site, they see a password prompt (if enabled).
2. After entering the password, they select their name from a searchable dropdown.
3. The site remembers their selection for the session.
4. The RSVP form automatically pre-fills with their name.
5. Content visibility is controlled based on their access level (`day1`, `day2`, or `both`).

**Note:** Authentication is stored in the browser's session storage, so guests won't need to re-enter the password if they refresh or navigate between pages during the same browser session.

**How guests use it:**
1. Guest enters the site password (if enabled).
2. A searchable dropdown appears with all guest names.
3. Guest types to search or clicks their name from the list.
4. Once selected, they can browse the site and RSVP.
5. Their name is automatically pre-filled in the RSVP form.

**To allow guests to RSVP for multiple people:** You can add entries like "John & Jane Smith" or "The Smith Family" to the guest list, and they can select that option when RSVPing.

---

## Customizing the countdown

The countdown on the home page (`index.html`) is controlled by a small configuration object in `assets/js/main.js`:

```js
const weddingConfig = {
  // Set this to your wedding date and time.
  // Use the format YYYY-MM-DDTHH:MM:SS
  // Example: "2026-09-15T15:00:00"
  date: "2026-09-15T15:00:00",
};
```

To change the countdown:

1. Open `assets/js/main.js`.
2. Find the `weddingConfig` object at the top of the file.
3. Replace the `date` value with your own wedding date and (optional) time.

The countdown will show **Days / Hours / Minutes / Seconds** remaining. When the date has passed, it will show a “Today is the big day!” message.

---

## Wiring up the RSVP form to Google Forms

The RSVP page (`rsvp.html`) is set up to post to a Google Form or a Google Sheet via Google Forms.

### 1. Create your Google Form

1. Go to Google Forms and create a new form.
2. Add questions that match the fields you want on your RSVP:
   - Name(s)
   - Email
   - Will you attend?
   - Number of guests
   - Meal preference
   - Dietary requirements
   - Anything else we should know?

### 2. Get the formResponse URL

1. In your Google Form, click the **Preview** (eye) icon.
2. Fill in the form with test data and submit.
3. On the confirmation page, right-click and choose **View page source** (or similar for your browser).
4. Search in the source for `formResponse`.
5. Copy the `https://docs.google.com/forms/d/e/.../formResponse` URL.

### 3. Update the form action in `rsvp.html`

In `rsvp.html`, find the `<form>` tag:

```html
<form
  id="rsvp-form"
  class="form"
  method="POST"
  action="https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse"
  target="_self"
  novalidate
>
```

Replace `https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse` with the `formResponse` URL you copied from your form.

### 4. Match the `entry.xxxxxx` field names

Each Google Form question has an internal ID like `entry.1234567890`.

1. In the same page source for your form, search for `entry.`.
2. For each question, note the `name="entry.xxxxxx"` value.
3. In `rsvp.html`, update the `name` attribute of each field to match.

Example:

```html
<input
  type="text"
  id="rsvp-name"
  name="entry.111111"
  required
/>
```

Change `entry.111111` to match the ID for your “Name(s)” question. Do the same for each field (email, attending, guests, etc.).

### 5. Optional front‑end validation

`assets/js/main.js` includes a simple validation step that:

- checks that **Name** and **Email** are filled in,
- checks that the email address looks valid,
- shows a short status message if something is missing.

You can remove or adjust this logic inside the `setupRsvpForm()` function if you like.

---

## Editing styles

Edit `assets/css/main.css` to change colors, fonts, spacing, and layout. All pages use this single CSS file, so your changes apply across the site.

---

## Deploying to GitHub Pages

1. **Create a new GitHub repository.**
2. Copy all files and folders from this project into the new repo.
3. Commit and push your changes.

### If this is a user/organization site

If your repository is named `USERNAME.github.io`:

1. Go to **Settings → Pages** in GitHub.
2. Under **Source**, choose `Deploy from a branch`.
3. Choose the `main` branch and root (`/`) folder.
4. Save. GitHub will build and give you a URL like `https://USERNAME.github.io/`.

### If this is a project site

If the repository is named something like `wedding-website`:

1. Go to **Settings → Pages**.
2. Under **Source**, choose `Deploy from a branch`.
3. Choose the `main` branch and root (`/`) folder.
4. The site will be served at `https://USERNAME.github.io/wedding-website/`.

All links and assets in this template use **relative paths** (for example, `assets/css/main.css`, `details.html`), so it will work in both cases without changes.

---

## Where to add your own photos and text

- Replace the hero background/photo on `index.html` by editing the `.hero__image` styling or putting an `<img>` inside it.
- In each page (`details.html`, `travel-stay.html`, `faq-contact-day1.html`, `faq-contact-day2.html`), look for elements with the class `image-placeholder` and comments explaining what to put there.
- Replace placeholder paragraphs and headings everywhere with your own story, names, venues, dates, and notes.

Take your time customizing; you can always preview by opening `index.html` in your browser after each change.

