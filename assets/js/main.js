// Basic shared JavaScript for the wedding site.
// You can configure the wedding date and time for the countdown
// by editing the weddingConfig object below.

const weddingConfig = {
  // Wedding start: 19 September 2026 at 1:00pm (local time).
  // Format: YYYY-MM-DDTHH:MM:SS
  date: "2026-09-19T13:00:00",
};

const accessConfig = {
  day2OnlyAllowedPages: ["garden-party.html", "rsvp.html", "registry.html", "faq-contact.html"],
  day2OnlyDefaultRedirect: "garden-party.html",
};

const rsvpSheetConfig = {
  webAppUrl: "https://script.google.com/macros/s/AKfycbzSjkHQRo4ZFk4BoxpXu-6zvDg_9LDnzc0hlfHXAHMraeFCesxN19m75GpBZGw6-a-x/exec",
};

function flattenGuestList(list) {
  if (!Array.isArray(list)) return [];
  if (list.length === 0) return [];

  // New format: array of groups
  if (Array.isArray(list[0])) {
    return list.flat().filter(Boolean);
  }

  // Backwards compatible: flat list of guests
  return list.filter(Boolean);
}

function applyRsvpDataToGuestSections(form, rsvpGuests) {
  if (!form || !Array.isArray(rsvpGuests) || rsvpGuests.length === 0) return;

  const byName = new Map(
    rsvpGuests
      .filter((g) => g && g.name)
      .map((g) => [String(g.name).trim().toLowerCase(), g])
  );

  const cards = Array.from(form.querySelectorAll("#rsvp-guest-attendance-rows .card"));
  cards.forEach((card) => {
    const nameInput = card.querySelector("input[type='hidden'][name$='[name]']");
    const name = nameInput && nameInput.value ? String(nameInput.value).trim() : "";
    if (!name) return;
    const row = byName.get(name.toLowerCase());
    if (!row) return;

    const emailInput = card.querySelector("[data-rsvp-field='email']");
    if (emailInput) emailInput.value = String(row.email || "");
    const attendingWeddingSelect = card.querySelector("[data-rsvp-field='attendingWedding']");
    if (attendingWeddingSelect) attendingWeddingSelect.value = String(row.attendingWedding || "");
    const attendingGardenSelect = card.querySelector("[data-rsvp-field='attendingGarden']");
    if (attendingGardenSelect) attendingGardenSelect.value = String(row.attendingGarden || "");
    const mealSelect = card.querySelector("[data-rsvp-field='meal']");
    if (mealSelect) mealSelect.value = String(row.meal || "");
    const dietaryTextarea = card.querySelector("[data-rsvp-field='dietary']");
    if (dietaryTextarea) dietaryTextarea.value = String(row.dietary || "");
  });
}

function findGuestGroupByName(list, guestName) {
  if (!Array.isArray(list) || !guestName) return null;

  // New format: array of groups
  if (list.length > 0 && Array.isArray(list[0])) {
    const target = String(guestName).trim().toLowerCase();
    for (const group of list) {
      if (!Array.isArray(group)) continue;
      if (group.some((g) => g && String(g.name || "").trim().toLowerCase() === target)) {
        return group;
      }
    }
    return null;
  }

  // Backwards compatible: flat list; treat as single group
  return list;
}

function setupRsvpGuestAttendanceUI() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  const guestSelect = form.querySelector("#rsvp-guest-name");
  if (!guestSelect) return;

  const existing = document.getElementById("rsvp-guest-attendance");
  if (existing) existing.remove();

  const groupRoot = document.createElement("div");
  groupRoot.className = "form__group";
  groupRoot.id = "rsvp-guest-attendance";

  const label = document.createElement("label");
  label.textContent = "RSVP details";
  groupRoot.appendChild(label);

  const rowsRoot = document.createElement("div");
  rowsRoot.id = "rsvp-guest-attendance-rows";
  groupRoot.appendChild(rowsRoot);

  // Insert right after the name select group.
  const nameGroup = guestSelect.closest(".form__group");
  if (nameGroup && nameGroup.parentElement) {
    nameGroup.parentElement.insertBefore(groupRoot, nameGroup.nextSibling);
  } else {
    form.insertBefore(groupRoot, form.firstChild);
  }

  function renderRows() {
    rowsRoot.innerHTML = "";

    const selectedName = String(guestSelect.value || "").trim();
    if (!selectedName) {
      groupRoot.style.display = "none";
      return;
    }

    const group = typeof guestList === "undefined" ? null : findGuestGroupByName(guestList, selectedName);
    const members = Array.isArray(group) ? group : [];

    if (members.length === 0) {
      groupRoot.style.display = "none";
      return;
    }

    groupRoot.style.display = "block";

    members.forEach((member, index) => {
      const guestName = member && member.name ? String(member.name) : "Guest";
      const guestAccess = member && member.access ? String(member.access) : "";
      const isDay2Only = guestAccess === "day2";
      const showWeddingDay = !isDay2Only;

      const card = document.createElement("div");
      card.className = "card";
      card.style.marginTop = index === 0 ? "0.75rem" : "1rem";

      const inner = document.createElement("div");
      inner.className = "card__body";
      card.appendChild(inner);

      const title = document.createElement("h3");
      title.className = "card__title";
      title.style.marginTop = "0";
      title.textContent = guestName;
      inner.appendChild(title);

      const nameHidden = document.createElement("input");
      nameHidden.type = "hidden";
      nameHidden.name = `rsvpGuests[${index}][name]`;
      nameHidden.value = guestName;
      nameHidden.setAttribute("data-rsvp-guest-name", guestName);
      inner.appendChild(nameHidden);

      const emailGroup = document.createElement("div");
      emailGroup.className = "form__group";
      const emailLabel = document.createElement("label");
      emailLabel.textContent = "Email";
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.className = "form__input";
      emailInput.name = `rsvpGuests[${index}][email]`;
      emailInput.required = true;
      emailInput.setAttribute("data-rsvp-field", "email");
      emailGroup.appendChild(emailLabel);
      emailGroup.appendChild(emailInput);
      inner.appendChild(emailGroup);

      const attendingWeddingGroup = document.createElement("div");
      attendingWeddingGroup.className = "form__group";
      attendingWeddingGroup.setAttribute("data-rsvp-section", "weddingAttendance");
      attendingWeddingGroup.style.display = showWeddingDay ? "" : "none";
      const attendingWeddingLabel = document.createElement("label");
      attendingWeddingLabel.textContent = "Attending wedding day";
      const attendingWeddingSelect = document.createElement("select");
      attendingWeddingSelect.className = "form__input";
      attendingWeddingSelect.name = `rsvpGuests[${index}][attendingWedding]`;
      attendingWeddingSelect.required = showWeddingDay;
      attendingWeddingSelect.setAttribute("data-rsvp-field", "attendingWedding");

      const weddingBlank = document.createElement("option");
      weddingBlank.value = "";
      weddingBlank.textContent = "Please select";

      const weddingYes = document.createElement("option");
      weddingYes.value = "yes";
      weddingYes.textContent = "Attending";

      const weddingNo = document.createElement("option");
      weddingNo.value = "no";
      weddingNo.textContent = "Not attending";

      attendingWeddingSelect.appendChild(weddingBlank);
      attendingWeddingSelect.appendChild(weddingYes);
      attendingWeddingSelect.appendChild(weddingNo);

      attendingWeddingGroup.appendChild(attendingWeddingLabel);
      attendingWeddingGroup.appendChild(attendingWeddingSelect);
      inner.appendChild(attendingWeddingGroup);

      const attendingGardenGroup = document.createElement("div");
      attendingGardenGroup.className = "form__group";
      const attendingGardenLabel = document.createElement("label");
      attendingGardenLabel.textContent = "Attending garden party";
      const attendingGardenSelect = document.createElement("select");
      attendingGardenSelect.className = "form__input";
      attendingGardenSelect.name = `rsvpGuests[${index}][attendingGarden]`;
      attendingGardenSelect.required = true;
      attendingGardenSelect.setAttribute("data-rsvp-field", "attendingGarden");

      const gardenBlank = document.createElement("option");
      gardenBlank.value = "";
      gardenBlank.textContent = "Please select";

      const gardenYes = document.createElement("option");
      gardenYes.value = "yes";
      gardenYes.textContent = "Attending";

      const gardenNo = document.createElement("option");
      gardenNo.value = "no";
      gardenNo.textContent = "Not attending";

      attendingGardenSelect.appendChild(gardenBlank);
      attendingGardenSelect.appendChild(gardenYes);
      attendingGardenSelect.appendChild(gardenNo);

      attendingGardenGroup.appendChild(attendingGardenLabel);
      attendingGardenGroup.appendChild(attendingGardenSelect);
      inner.appendChild(attendingGardenGroup);

      const mealGroup = document.createElement("div");
      mealGroup.className = "form__group";
      mealGroup.setAttribute("data-rsvp-section", "weddingMeal");
      mealGroup.style.display = showWeddingDay ? "" : "none";
      const mealLabel = document.createElement("label");
      mealLabel.textContent = "Meal preference";
      const mealSelect = document.createElement("select");
      mealSelect.className = "form__input";
      mealSelect.name = `rsvpGuests[${index}][meal]`;
      mealSelect.setAttribute("data-rsvp-field", "meal");

      const mealBlank = document.createElement("option");
      mealBlank.value = "";
      mealBlank.textContent = "Please select";
      const mealBeef = document.createElement("option");
      mealBeef.value = "Beef";
      mealBeef.textContent = "Beef";
      const mealVeg = document.createElement("option");
      mealVeg.value = "Vegetarian";
      mealVeg.textContent = "Vegetarian";
      const mealVegan = document.createElement("option");
      mealVegan.value = "Vegan";
      mealVegan.textContent = "Vegan";

      mealSelect.appendChild(mealBlank);
      mealSelect.appendChild(mealBeef);
      mealSelect.appendChild(mealVeg);
      mealSelect.appendChild(mealVegan);

      mealGroup.appendChild(mealLabel);
      mealGroup.appendChild(mealSelect);
      inner.appendChild(mealGroup);

      const dietGroup = document.createElement("div");
      dietGroup.className = "form__group";
      dietGroup.setAttribute("data-rsvp-section", "weddingDietary");
      dietGroup.style.display = "none";
      const dietLabel = document.createElement("label");
      dietLabel.textContent = "Dietary requirements";
      const dietTextarea = document.createElement("textarea");
      dietTextarea.className = "form__input";
      dietTextarea.name = `rsvpGuests[${index}][dietary]`;
      dietTextarea.rows = 3;
      dietTextarea.placeholder = "Allergies, intolerances, or other dietary needs.";
      dietTextarea.setAttribute("data-rsvp-field", "dietary");
      dietGroup.appendChild(dietLabel);
      dietGroup.appendChild(dietTextarea);
      inner.appendChild(dietGroup);

      function updateWeddingSectionsVisibility() {
        const attendingWedding = String(attendingWeddingSelect.value || "").trim();
        const attendingGarden = String(attendingGardenSelect.value || "").trim();

        // Meal preference: only relevant for Wedding Day attendees.
        const showMeal = showWeddingDay && attendingWedding === "yes";
        mealGroup.style.display = showMeal ? "" : "none";
        if (!showMeal) {
          mealSelect.value = "";
        }

        // Dietary requirements: relevant for anyone attending either day.
        const showDietary = attendingWedding === "yes" || attendingGarden === "yes";
        dietGroup.style.display = showDietary ? "" : "none";
        if (!showDietary) {
          dietTextarea.value = "";
        }
      }

      attendingWeddingSelect.addEventListener("change", updateWeddingSectionsVisibility);
      attendingGardenSelect.addEventListener("change", updateWeddingSectionsVisibility);
      updateWeddingSectionsVisibility();

      rowsRoot.appendChild(card);
    });
  }

  guestSelect.addEventListener("change", renderRows);
  renderRows();
}

// Run navigation restrictions immediately when DOM is ready to prevent flicker
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication and apply navigation restrictions immediately
  const storedAuth = sessionStorage.getItem("wedding-auth");
  if (storedAuth) {
    const auth = JSON.parse(storedAuth);
    const access = auth && auth.access ? String(auth.access).trim() : "";
    if (access === "day2") {
      restrictNavigationForDay2Only();
    }
  }

  // Continue with rest of setup
  setupPasswordProtection().then(() => {
    setupNavToggle();
    setupFooterYear();
    setupCountdown();
    setupFaq();
    setupRsvpForm();
    setupRsvpSheetIntegration();
    setupGuestSelector();
    setupRsvpGuestAttendanceUI();
  });
});

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function applyPageRestrictions(access) {
  if (access !== "day2") {
    return;
  }

  const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const allowed = accessConfig.day2OnlyAllowedPages.map((p) => p.toLowerCase());

  if (!allowed.includes(currentPage)) {
    window.location.replace(accessConfig.day2OnlyDefaultRedirect);
    return;
  }

  // Navigation restrictions are now handled in DOMContentLoaded to prevent flicker
  // restrictNavigationForDay2Only();
}

function restrictNavigationForDay2Only() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const navList = nav.querySelector(".site-nav__list");
  if (!navList) return;

  const navItems = navList.querySelectorAll("li");
  const allowed = accessConfig.day2OnlyAllowedPages.map((p) => p.toLowerCase());

  navItems.forEach((item) => {
    const link = item.querySelector("a[href]");
    if (!link) return;

    const href = (link.getAttribute("href") || "").toLowerCase();
    
    // Hide the entire nav item if it's not in the allowed pages
    if (!allowed.includes(href)) {
      item.style.display = "none";
    }
  });

  // Handle the site header brand link (index.html)
  const brandLink = document.querySelector(".site-header__brand");
  if (brandLink) {
    const href = (brandLink.getAttribute("href") || "").toLowerCase();
    if (href === "index.html" || href === "") {
      brandLink.setAttribute("aria-disabled", "true");
      brandLink.style.pointerEvents = "none";
      brandLink.style.cursor = "default";
    }
  }
}

function setupFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function setupCountdown() {
  const root = document.querySelector("[data-countdown-root]");
  if (!root || !weddingConfig || !weddingConfig.date) return;

  const targetDate = new Date(weddingConfig.date);
  if (Number.isNaN(targetDate.getTime())) {
    // Invalid date configuration, do nothing.
    return;
  }

  const daysEl = root.querySelector("[data-countdown-days]");
  const hoursEl = root.querySelector("[data-countdown-hours]");
  const minutesEl = root.querySelector("[data-countdown-minutes]");
  const secondsEl = root.querySelector("[data-countdown-seconds]");
  const messageEl = root.querySelector("[data-countdown-message]");

  function updateCountdown() {
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      if (daysEl) daysEl.textContent = "0";
      if (hoursEl) hoursEl.textContent = "0";
      if (minutesEl) minutesEl.textContent = "0";
      if (secondsEl) secondsEl.textContent = "0";
      if (messageEl) {
        messageEl.textContent = "Today is the big day!";
      }
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    if (messageEl) {
      messageEl.textContent = "";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function setupFaq() {
  const faqRoot = document.querySelector("[data-faq-root]");
  if (!faqRoot) return;

  faqRoot.addEventListener("click", (event) => {
    const button = event.target.closest(".faq__question");
    if (!button) return;

    const item = button.closest(".faq__item");
    if (!item) return;

    item.classList.toggle("is-open");
  });
}

function setupRsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  const statusEl = document.getElementById("rsvp-status");
  const statusInlineEl = document.getElementById("rsvp-status-inline");

  form.addEventListener("submit", (event) => {
    const name = form.querySelector("#rsvp-guest-name") || form.querySelector("#rsvp-name");
    if (!name) return;

    let hasError = false;
    const messages = [];

    if (!name.value || name.value.trim() === "") {
      hasError = true;
      messages.push("Please select your name from the list.");
    }

    const guestCards = Array.from(form.querySelectorAll("#rsvp-guest-attendance-rows input[type='hidden'][name^='rsvpGuests']"));
    if (guestCards.length === 0) {
      hasError = true;
      messages.push("Please select your name so we can load your group RSVP details.");
    }

    const guestEmailInputs = Array.from(form.querySelectorAll("#rsvp-guest-attendance-rows input[type='email'][name^='rsvpGuests']"));
    guestEmailInputs.forEach((input) => {
      if (!input.value.trim()) {
        hasError = true;
      } else if (!isValidEmail(input.value)) {
        hasError = true;
      }
    });

    if (guestEmailInputs.length > 0 && guestEmailInputs.some((i) => !i.value.trim())) {
      messages.push("Please enter an email address for each guest.");
    } else if (guestEmailInputs.length > 0 && guestEmailInputs.some((i) => i.value.trim() && !isValidEmail(i.value))) {
      messages.push("Please enter valid email addresses for each guest.");
    }

    const attendingGardenSelects = Array.from(
      form.querySelectorAll("#rsvp-guest-attendance-rows select[name$='[attendingGarden]']")
    );
    if (attendingGardenSelects.some((s) => !String(s.value || "").trim())) {
      hasError = true;
      messages.push("Please select attending or not attending for the garden party for each guest.");
    }

    const weddingAttendanceSelects = Array.from(
      form.querySelectorAll("#rsvp-guest-attendance-rows select[name$='[attendingWedding]']")
    ).filter((s) => s && s.offsetParent !== null);
    if (weddingAttendanceSelects.some((s) => !String(s.value || "").trim())) {
      hasError = true;
      messages.push("Please select attending or not attending for the wedding day for each guest.");
    }

    if (hasError) {
      event.preventDefault();
      [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
        el.classList.remove("form__status--success");
        el.classList.add("form__status--error");
        el.textContent = messages.join(" ");
      });
    } else {
      [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
        el.classList.remove("form__status--error");
        el.classList.add("form__status--success");
        el.textContent = "Submitting your RSVP…";
      });
    }
  });
}

function setupRsvpSheetIntegration() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  const statusEl = document.getElementById("rsvp-status");
  const statusInlineEl = document.getElementById("rsvp-status-inline");
  const submitBtn = form.querySelector("button[type='submit']");

  const summaryRootId = "rsvp-summary";
  let summaryRoot = document.getElementById(summaryRootId);
  if (!summaryRoot) {
    summaryRoot = document.createElement("div");
    summaryRoot.id = summaryRootId;
    summaryRoot.style.display = "none";
    form.parentElement.insertBefore(summaryRoot, form);
  }

  if (!rsvpSheetConfig.webAppUrl || rsvpSheetConfig.webAppUrl.trim() === "") {
    [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
      el.classList.remove("form__status--success");
      el.classList.add("form__status--error");
      el.textContent =
        "RSVP integration is not configured yet. Please set rsvpSheetConfig.webAppUrl in assets/js/main.js.";
    });
    return;
  }

  const storedAuth = sessionStorage.getItem("wedding-auth");
  const auth = storedAuth ? JSON.parse(storedAuth) : null;
  const guestName = auth && auth.guest ? auth.guest : "";

  const rsvpCacheKey = guestName ? `wedding-rsvp:${guestName}` : "";

  function clearCachedRsvp() {
    if (!rsvpCacheKey) return;
    sessionStorage.removeItem(rsvpCacheKey);
  }

  function showRsvpForm() {
    summaryRoot.style.display = "none";
    form.style.display = "";
    if (submitBtn) submitBtn.disabled = false;
    form.querySelectorAll("input, select, textarea, button").forEach((el) => {
      el.disabled = false;
    });
    [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
      el.classList.remove("form__status--error");
      el.classList.remove("form__status--success");
      el.textContent = "";
    });
  }

  function showRsvpSummarySafe(payload) {
    showRsvpSummary(payload, form, summaryRoot, statusEl);
    // When summary is shown, keep form hidden and disabled.
    form.querySelectorAll("input, select, textarea, button").forEach((el) => {
      el.disabled = true;
    });
  }

  if (rsvpCacheKey) {
    const cached = sessionStorage.getItem(rsvpCacheKey);
    if (cached) {
      const cachedPayload = JSON.parse(cached);
      if (cachedPayload && cachedPayload.found) {
        showRsvpSummarySafe(cachedPayload);
      }
    }
  }

  if (guestName) {
    [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
      el.classList.remove("form__status--success");
      el.classList.remove("form__status--error");
      el.textContent = "Checking your RSVP…";
    });

    const group = typeof guestList === "undefined" ? null : findGuestGroupByName(guestList, guestName);
    const groupNames = Array.isArray(group)
      ? group
          .map((g) => (g && g.name ? String(g.name).trim() : ""))
          .filter((n) => n !== "")
      : [];
    const guestsParam = groupNames.length > 0 ? `&guests=${encodeURIComponent(groupNames.join("|"))}` : "";

    fetch(`${rsvpSheetConfig.webAppUrl}?action=get&guest=${encodeURIComponent(guestName)}${guestsParam}`, { method: "GET" })
      .then((res) => res.json().catch(() => null))
      .then((payload) => {
        if (!payload) return;
        if (rsvpCacheKey) {
          sessionStorage.setItem(rsvpCacheKey, JSON.stringify(payload));
        }
        if (payload.found) {
          const notesEl = form.querySelector("#rsvp-notes");
          if (notesEl && payload.data && typeof payload.data["entry.777777"] === "string") {
            notesEl.value = payload.data["entry.777777"];
          }

          if (payload.data && Array.isArray(payload.data.rsvpGuests)) {
            applyRsvpDataToGuestSections(form, payload.data.rsvpGuests);
          }
          showRsvpSummarySafe(payload);
        } else if (statusEl) {
          // Server is authoritative: if it says there's no RSVP, clear any stale local cache
          // and show the form.
          clearCachedRsvp();
          showRsvpForm();
        }
      })
      .catch(() => {
        // If lookup fails, allow normal submission.
      });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (submitBtn) submitBtn.disabled = true;
    [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
      el.classList.remove("form__status--error");
      el.classList.add("form__status--success");
      el.textContent = "Submitting your RSVP…";
    });

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (guestName) {
      data.guest = guestName;
    }

    const guestCards = Array.from(form.querySelectorAll("#rsvp-guest-attendance-rows .card"));
    const perGuest = guestCards
      .map((card) => {
        const nameInput = card.querySelector("input[type='hidden'][name$='[name]']");
        const emailInput = card.querySelector("input[type='email'][name$='[email]']");
        const attendingWeddingSelect = card.querySelector("select[name$='[attendingWedding]']");
        const attendingGardenSelect = card.querySelector("select[name$='[attendingGarden]']");
        const mealSelect = card.querySelector("select[name$='[meal]']");
        const dietaryTextarea = card.querySelector("textarea[name$='[dietary]']");

        return {
          name: String(nameInput && nameInput.value ? nameInput.value : "").trim(),
          email: String(emailInput && emailInput.value ? emailInput.value : "").trim(),
          attendingWedding: String(attendingWeddingSelect && attendingWeddingSelect.value ? attendingWeddingSelect.value : "").trim(),
          attendingGarden: String(attendingGardenSelect && attendingGardenSelect.value ? attendingGardenSelect.value : "").trim(),
          meal: String(mealSelect && mealSelect.value ? mealSelect.value : "").trim(),
          dietary: String(dietaryTextarea && dietaryTextarea.value ? dietaryTextarea.value : "").trim(),
        };
      })
      .filter((row) => row.name !== "");

    if (perGuest.length > 0) {
      data.rsvpGuests = perGuest;
    }

    fetch(rsvpSheetConfig.webAppUrl, {
      method: "POST",
      body: JSON.stringify({ action: "submit", data }),
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then((payload) => {
        if (!payload || payload.ok !== true) {
          throw new Error("RSVP submission failed");
        }
        if (rsvpCacheKey) {
          sessionStorage.setItem(
            rsvpCacheKey,
            JSON.stringify({ found: true, data, ok: true, source: "server", updatedAt: new Date().toISOString() })
          );
        }

        showRsvpSummarySafe({ found: true, data, ok: true, source: "server" });

        [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
          el.classList.remove("form__status--error");
          el.classList.add("form__status--success");
          el.textContent = "";
        });
      })
      .catch(() => {
        if (submitBtn) submitBtn.disabled = false;
        [statusEl, statusInlineEl].filter(Boolean).forEach((el) => {
          el.classList.remove("form__status--success");
          el.classList.add("form__status--error");
          el.textContent =
            "Sorry something went wrong submitting your RSVP. Please try again. If the problem persists, please contact us.";
        });
      });
  });
}

function showRsvpSummary(payload, form, summaryRoot, statusEl) {
  if (!payload || !payload.found) return;

  const data = payload.data || {};
  const notes = String(data["entry.777777"] || "").trim();

  let guestDetailsHtml = "";
  const groupGuests = Array.isArray(data.rsvpGuests) ? data.rsvpGuests : [];
  if (groupGuests.length > 0) {
    guestDetailsHtml = `
      ${groupGuests
        .map((g) => {
          const name = escapeHtml(g && g.name ? g.name : "");
          const email = escapeHtml(g && g.email ? g.email : "");
          const attendingWedding = escapeHtml(g && g.attendingWedding ? g.attendingWedding : "");
          const attendingGarden = escapeHtml(g && g.attendingGarden ? g.attendingGarden : "");
          const meal = escapeHtml(g && g.meal ? g.meal : "");
          const dietary = escapeHtml(g && g.dietary ? g.dietary : "");

          return `
            <div class="card" style="margin-top: 1rem;">
              <div class="card__body">
                <h3 class="card__title" style="margin-top: 0;">${name}</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Attending wedding day:</strong> ${attendingWedding}</p>
                <p><strong>Attending garden party:</strong> ${attendingGarden}</p>
                <p><strong>Meal:</strong> ${meal}</p>
                <p><strong>Dietary requirements:</strong> ${dietary}</p>
              </div>
            </div>
          `;
        })
        .join("")}
    `;
  }

  summaryRoot.innerHTML = `
    ${guestDetailsHtml}
    <div class="card" style="margin-top: 1rem;">
      <div class="card__body">
        <p><strong>Notes:</strong> ${escapeHtml(notes)}</p>
      </div>
    </div>
  `;

  summaryRoot.style.display = "block";
  form.style.display = "none";

  if (statusEl) {
    statusEl.classList.remove("form__status--error");
    statusEl.classList.remove("form__status--success");
    statusEl.textContent = "";
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  // Simple and permissive email pattern.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Password protection and guest access control
async function setupPasswordProtection() {
  // Load guest list configuration
  if (typeof guestList === "undefined") {
    // If guest-list.js isn't loaded, skip password protection
    return Promise.resolve();
  }

  // Check if already authenticated
  const storedAuth = sessionStorage.getItem("wedding-auth");
  if (storedAuth) {
    const auth = JSON.parse(storedAuth);
    const guestName = auth && auth.guest ? String(auth.guest).trim() : "";
    const access = auth && auth.access ? String(auth.access).trim() : "";

    // The special "Site" guest is used during password-only auth. If we land here,
    // it means the user hasn't selected themselves yet (or we have a corrupted session).
    // Force re-auth so the guest selector shows.
    if (!guestName || guestName.toLowerCase() === "site") {
      try {
        if (guestName) {
          sessionStorage.removeItem(`wedding-rsvp:${guestName}`);
        }
      } catch (_) {
        // ignore
      }
      sessionStorage.removeItem("wedding-auth");
    } else if (guestName && access) {
      applyAccessLevel(auth.access);
      applyPageRestrictions(auth.access);
      return Promise.resolve();
    }
  }

  // Show password modal
  return new Promise((resolve) => {
    const modal = createPasswordModal();
    document.body.appendChild(modal);
    
    const passwordInput = modal.querySelector("#password-input");
    const guestSelect = modal.querySelector("#guest-select");
    const submitBtn = modal.querySelector("#password-submit");
    const errorMsg = modal.querySelector("#password-error");

    const passwordsDisabled =
      (!fullAccessPassword || fullAccessPassword.trim() === "") &&
      (!day2AccessPassword || day2AccessPassword.trim() === "");

    // If passwords are empty, skip password step
    if (passwordsDisabled) {
      passwordInput.closest(".password-modal__group").style.display = "none";
      guestSelect.closest(".guest-selector").style.display = "block";
      setupGuestDropdown(guestSelect, modal, resolve);
      // Don't return - we still need to wait for guest selection
    }

    function handleSubmit() {
      const password = passwordInput.value.trim();
      
      if (!password) {
        errorMsg.textContent = "Please enter the password.";
        errorMsg.style.display = "block";
        return;
      }

      const isFullAccess =
        fullAccessPassword && password === fullAccessPassword;
      const isDay2Only =
        day2AccessPassword && password === day2AccessPassword;

      if (!isFullAccess && !isDay2Only) {
        errorMsg.textContent = "Incorrect password. Please try again.";
        errorMsg.style.display = "block";
        passwordInput.focus();
        return;
      }

      sessionStorage.setItem(
        "wedding-auth",
        JSON.stringify({ guest: "Site", access: isDay2Only ? "day2" : "both" })
      );

      applyAccessLevel(isDay2Only ? "day2" : "both");
      applyPageRestrictions(isDay2Only ? "day2" : "both");

      // Password correct, show guest selector
      passwordInput.closest(".password-modal__group").style.display = "none";
      guestSelect.closest(".guest-selector").style.display = "block";
      setupGuestDropdown(guestSelect, modal, resolve);
    }

    submitBtn.addEventListener("click", handleSubmit);
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSubmit();
    });
  });
}

function createPasswordModal() {
  const modal = document.createElement("div");
  modal.className = "password-modal";
  modal.innerHTML = `
    <div class="password-modal__content">
      <h2 class="password-modal__title">Welcome</h2>
      <p class="password-modal__text">
        Please enter the password to access Frederick & Flora's wedding website.
      </p>
      
      <div class="password-modal__group">
        <input
          type="password"
          id="password-input"
          class="password-modal__input form__input"
          placeholder="Enter password"
          autofocus
        />
        <p id="password-error" class="form__status form__status--error" style="display: none;"></p>
        <button id="password-submit" class="btn btn--primary" style="width: 100%; margin-top: 1rem;">
          Continue
        </button>
      </div>

      <div class="guest-selector" style="display: none;">
        <label class="guest-selector__label" for="guest-select">
          Select your name from the list:
        </label>
        <div class="guest-selector__input-wrapper">
          <input
            type="text"
            id="guest-select"
            class="guest-selector__input form__input"
            placeholder="Type to search or select..."
            autocomplete="off"
          />
          <div class="guest-selector__dropdown" id="guest-dropdown"></div>
        </div>
        <p id="guest-error" class="form__status form__status--error" style="display: none; margin-top: 0.5rem;"></p>
      </div>
    </div>
  `;
  return modal;
}

function setupGuestDropdown(guestSelectInput, modal, resolve) {
  const dropdown = document.getElementById("guest-dropdown");
  const errorMsg = document.getElementById("guest-error");
  const flattenedGuests = flattenGuestList(guestList);
  let filteredGuests = [...flattenedGuests];

  function renderDropdown(guests) {
    if (guests.length === 0) {
      dropdown.innerHTML = '<div class="guest-selector__no-results">No matching guests found</div>';
      dropdown.classList.add("is-open");
      return;
    }

    dropdown.innerHTML = guests
      .map(
        (guest) =>
          `<div class="guest-selector__option" data-guest-name="${guest.name}" data-access="${guest.access}">${guest.name}</div>`
      )
      .join("");
    dropdown.classList.add("is-open");

    // Add click handlers
    dropdown.querySelectorAll(".guest-selector__option").forEach((option) => {
      option.addEventListener("click", () => {
        const guestName = option.dataset.guestName;
        const access = option.dataset.access || defaultAccess;
        selectGuest(guestName, access, modal, resolve);
      });
    });
  }

  function filterGuests(query) {
    const q = query.toLowerCase().trim();
    if (q === "") {
      filteredGuests = [...flattenedGuests];
    } else {
      filteredGuests = flattenedGuests.filter((guest) =>
        guest.name.toLowerCase().includes(q)
      );
    }
    renderDropdown(filteredGuests);
  }

  guestSelectInput.addEventListener("input", (e) => {
    filterGuests(e.target.value);
  });

  guestSelectInput.addEventListener("focus", () => {
    if (filteredGuests.length > 0) {
      dropdown.classList.add("is-open");
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!guestSelectInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("is-open");
    }
  });

  // Initial render
  renderDropdown(filteredGuests);
}

function selectGuest(guestName, access, modal, resolve) {
  // Store authentication
  sessionStorage.setItem(
    "wedding-auth",
    JSON.stringify({ guest: guestName, access: access })
  );

  // Apply access level
  applyAccessLevel(access);
  applyPageRestrictions(access);

  // Remove modal
  modal.remove();

  // Resolve promise to continue page setup
  resolve();
}

function applyAccessLevel(access) {
  // Hide/show content based on access level
  document.body.setAttribute("data-access", access);

  // Hide day 2 content if access is day1 only
  if (access === "day1") {
    const day2Elements = document.querySelectorAll("[data-day='2']");
    day2Elements.forEach((el) => {
      el.style.display = "none";
    });
  }

  // Hide day 1 content if access is day2 only
  if (access === "day2") {
    const day1Elements = document.querySelectorAll("[data-day='1']");
    day1Elements.forEach((el) => {
      el.style.display = "none";
    });
  }
}

function setupGuestSelector() {
  // Populate guest in RSVP form
  const rsvpGuestSelect = document.getElementById("rsvp-guest-name");
  if (!rsvpGuestSelect || typeof guestList === "undefined") return;

  const guestDisplay = document.getElementById("rsvp-current-guest");
  const reloginLink = document.getElementById("rsvp-relogin");

  // Get current guest from session
  const storedAuth = sessionStorage.getItem("wedding-auth");
  const auth = storedAuth ? JSON.parse(storedAuth) : null;
  const sessionGuest = auth && auth.guest ? String(auth.guest).trim() : "";

  // Ensure the hidden form field + display are set from the authenticated session guest.
  if (sessionGuest) {
    rsvpGuestSelect.value = sessionGuest;
    if (guestDisplay) guestDisplay.textContent = sessionGuest;
    rsvpGuestSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Allow user to clear session and re-login.
  if (reloginLink) {
    reloginLink.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        const stored = sessionStorage.getItem("wedding-auth");
        const parsed = stored ? JSON.parse(stored) : null;
        const guestName = parsed && parsed.guest ? String(parsed.guest).trim() : "";
        if (guestName) {
          sessionStorage.removeItem(`wedding-rsvp:${guestName}`);
        }
      } catch (_) {
        // ignore
      }

      sessionStorage.removeItem("wedding-auth");
      window.location.reload();
    });
  }
}

