const { test, expect } = require("./support");

test("M2.3 M4.2 M4.3 · active navigation, social colours and portfolio overlay", async ({ page }) => {
  const contact = page.locator("header address a").first();
  await contact.hover();
  await expect(contact).toHaveCSS("color", "rgb(64, 75, 191)");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await contact.focus();
  await expect(contact).toHaveCSS("color", "rgb(64, 75, 191)");
  const active = page.locator(".nav-link").first();
  expect(await active.evaluate((el) => getComputedStyle(el, "::after").content)).toBe('""');
  expect(await active.evaluate((el) => getComputedStyle(el, "::after").opacity)).toBe("1");
  await expect(page.locator(".team-card").first()).not.toHaveCSS("box-shadow", "none");
  const project = page.locator(".project-card").first();
  const overlay = project.locator(".project-overlay");
  expect((await overlay.boundingBox()).y).toBeCloseTo((await project.boundingBox()).y + 300, 0);
  await expect(project).toHaveCSS("box-shadow", "none");
  await project.locator(".project-caption").hover();
  await expect(overlay).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(project).not.toHaveCSS("box-shadow", "none");
  await page.mouse.move(0, 0);
  await project.focus();
  await expect(overlay).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(overlay).toHaveCSS("transition-property", "transform");
  await expect(overlay).toHaveCSS("transition-duration", "0.25s");
  await expect(overlay).toHaveCSS("transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)");
  const social = page.locator("footer .social-link").first();
  await social.hover();
  await expect(social).toHaveCSS("background-color", "rgb(49, 208, 170)");
  await expect(page.locator(".footer-about")).toHaveCSS("margin-right", "120px");
});

test("M5.1 · class contract, backdrop, focus trap and all close paths", async ({ page }) => {
  const bg = page.locator("#service-backdrop");
  const order = page.getByRole("button", { name: "Order Service" });
  await expect(bg).toBeHidden();
  expect(
    await bg.evaluate(
      (el) => !!(document.querySelector("footer").compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
    ),
  ).toBe(true);
  // The course grader also toggles is-open directly.
  await bg.evaluate((el) => el.classList.add("is-open"));
  await expect(bg).toBeVisible();
  await bg.evaluate((el) => el.classList.remove("is-open"));
  await expect(bg).toBeHidden();
  await order.click();
  const dialog = page.getByRole("dialog", { name: "Leave your contacts and we will call you back" });
  await expect(dialog).toBeVisible();
  await expect(bg).toHaveCSS("position", "fixed");
  const viewport = page.viewportSize(),
    frame = await bg.boundingBox(),
    modal = await dialog.boundingBox();
  expect(frame).toEqual({ x: 0, y: 0, ...viewport });
  expect(modal.x + modal.width / 2).toBeCloseTo(viewport.width / 2, 0);
  expect(modal.y + modal.height / 2).toBeCloseTo(viewport.height / 2, 0);
  const close = dialog.getByRole("button", { name: "Close form" }),
    send = dialog.getByRole("button", { name: "Send" });
  const cross = await close.boundingBox();
  expect(cross.x + cross.width).toBeCloseTo(modal.x + modal.width - 24, 0);
  expect(cross.y).toBeCloseTo(modal.y + 24, 0);
  await expect(dialog.getByLabel("Name", { exact: true })).toBeFocused();
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(send).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(bg).toBeHidden();
  await expect(order).toBeFocused();
  await order.click();
  await close.click();
  await expect(bg).toBeHidden();
  await order.click();
  await bg.click({ position: { x: 2, y: 2 } });
  await expect(bg).toBeHidden();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("M5.2 M5.3 · modal validation, labels, consent and honest local submission", async ({ page }) => {
  await page.getByRole("button", { name: "Order Service" }).click();
  const dialog = page.getByRole("dialog");
  const name = dialog.getByLabel("Name", { exact: true }),
    phone = dialog.getByLabel("Phone"),
    email = dialog.getByLabel("Email"),
    comment = dialog.getByLabel("Comment");
  await expect(dialog.locator("input:not([name]),textarea:not([name])")).toHaveCount(0);
  await expect(comment).toHaveAttribute("placeholder", "Text input");
  await expect(comment).toHaveCSS("resize", "none");
  await expect(comment).toHaveCSS("height", "120px");
  await expect(name).toHaveCSS("border-top-color", "rgb(77, 90, 229)");
  await expect(dialog.locator(".field-icon").first()).toHaveCSS("color", "rgb(77, 90, 229)");
  const input = await name.boundingBox(),
    icon = await dialog.locator(".field-icon").first().boundingBox();
  expect(input.y + input.height / 2).toBeCloseTo(icon.y + icon.height / 2, 0);
  const send = dialog.getByRole("button", { name: "Send" });
  await expect(send).toHaveAttribute("type", "submit");
  await send.click();
  await expect(name).toBeFocused();
  await name.fill("Demo Visitor");
  await phone.fill("+420123456789");
  await email.fill("invalid");
  await send.click();
  expect(await email.evaluate((el) => el.validity.typeMismatch)).toBe(true);
  await email.fill("demo@example.com");
  await comment.fill("Demo request");
  const consent = dialog.getByRole("checkbox");
  await send.click();
  await expect(consent).toBeFocused();
  await expect(consent).not.toBeChecked();
  const mark = dialog.locator('input[type="checkbox"] + label > span:first-child > svg');
  await expect(mark).toHaveCSS("opacity", "0");
  await page.keyboard.press("Space");
  await expect(mark).toHaveCSS("opacity", "1");
  await page.keyboard.press("Space");
  await expect(mark).toHaveCSS("opacity", "0");
  await dialog.locator(".consent-label > span").first().click();
  await expect(consent).toBeChecked();
  await dialog.getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page.locator("#privacy-note")).toBeVisible();
  await send.click();
  await expect(dialog.getByRole("status")).toHaveText(/No information has been sent/);
  await name.fill("Updated");
  await expect(dialog.getByRole("status")).toBeEmpty();
});

test("M5.2 · newsletter rejects invalid addresses and validates locally", async ({ page }) => {
  const footer = page.locator("footer"),
    email = footer.getByLabel("Email for newsletter"),
    submit = footer.getByRole("button", { name: "Subscribe" });
  await expect(email).toHaveAttribute("name", "subscriber-email");
  await expect(email).toHaveAttribute("placeholder", "E-mail");
  await expect(submit).toHaveAttribute("type", "submit");
  await submit.click();
  expect(await email.evaluate((el) => el.validity.valueMissing)).toBe(true);
  await email.fill("invalid");
  await submit.click();
  expect(await email.evaluate((el) => el.validity.typeMismatch)).toBe(true);
  await email.fill("demo@example.com");
  await submit.click();
  await expect(footer.getByRole("status")).toHaveText(/No information has been sent/);
});
