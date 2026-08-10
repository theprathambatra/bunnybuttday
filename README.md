# Birthday Countdown — GitHub Pages ready

A two-page birthday experience:

- `index.html` — countdown landing page
- `celebration.html` — interactive birthday experience
- `config.js` — date, lock and text settings
- `shared.js` — local-time unlock logic + synthesized Happy Birthday instrumental
- `countdown.js` — timer + landing interactions
- `celebration.js` — cake, gifts, balloon game, finale and confetti
- `styles.css` — all visual styling

## Important: how the timezone works

The target date is created with JavaScript's **local date constructor**:

```js
new Date(2026, 7, 11, 0, 0, 0)
```

That means the birthday unlock happens at **11 August 2026, 12:00 AM in each visitor's own timezone**.

Examples:
- A visitor in Delhi unlocks at Delhi midnight.
- A visitor in Toronto unlocks at Toronto midnight.
- A visitor in London unlocks at London midnight.

It is intentionally **not** tied to IST or a single UTC timestamp.

## Locking page 2 before the countdown

In `config.js`:

```js
lockCelebrationBeforeBirthday: true
```

`celebration.html` checks the same local-time deadline and redirects back to `index.html` before the birthday.

### Important GitHub Pages limitation

GitHub Pages is a static host. This lock is excellent for normal visitors, but it is **not a secure server-side access-control system**. Someone technical who can inspect/modify client-side JavaScript or your public GitHub repo can bypass it.

If the birthday content must remain genuinely secret before midnight, use a private/backend-protected deployment instead of public GitHub Pages.

## Automatically stop showing the countdown after midnight

Set this in `config.js`:

```js
skipCountdownPageAfterUnlock: true
```

After unlock, anyone who opens `index.html` will immediately be sent to `celebration.html`.

A static webpage cannot literally delete its own `index.html` file after midnight; this redirect is the practical automatic equivalent.

## Test the celebration before publishing

Temporarily set:

```js
devPreviewUnlocked: true
```

When finished testing, set it back to:

```js
devPreviewUnlocked: false
```

Do **not** leave preview mode enabled in the published version.

## Put it on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save. GitHub will provide your public Pages URL.

## Add real photos

The memory area currently has stylized placeholders so the project works immediately without assets.

To use real photos, create an `images` folder, e.g.:

```
images/photo-1.jpg
images/photo-2.jpg
```

Then replace a placeholder in `celebration.html`, for example:

```html
<div class="photo-placeholder"><span>PHOTO 01</span></div>
```

with:

```html
<img class="photo-placeholder" src="images/photo-1.jpg" alt="Birthday memory" />
```

You can add `object-fit: cover; width: 100%;` in CSS if needed.

## Customize the words

The landing headline is in `config.js`:

```js
landingHeadline: "Happy birthday hai kya ladder"
```

The three gift messages and finale message are directly in `celebration.html` / `celebration.js` so they are easy to personalize.

## Music

The site synthesizes a simple Happy Birthday-style instrumental with the browser Web Audio API. Browsers require a user click before playing sound, which is why the music button exists.
