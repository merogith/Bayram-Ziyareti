import { expect, test, type Page, type Locator } from '@playwright/test';
import { allLevels } from '../../src/content';

async function activate(locator: Locator, _page: Page) {
  if (test.info().project.name === 'touch') await locator.tap();
  else await locator.click();
}
async function start(page: Page, level = 'tree-01') {
  await page.goto(`#/play/${level}`);
  const guide = page.getByRole('button', { name: 'Anladım, oynayalım' });
  if (await guide.isVisible()) await activate(guide, page);
}
const slot = (page: Page, id: string) => page.locator(`[data-slot="${id}"] button`);
async function place(page: Page, person: string, target: string) {
  await activate(page.locator(`[data-person="${person}"]`), page);
  await activate(slot(page, target), page);
}
async function drag(page: Page, source: Locator, target: Locator | { x: number; y: number }) {
  const from = await source.boundingBox();
  const to =
    'boundingBox' in target ? await target.boundingBox() : { ...target, width: 0, height: 0 };
  if (!from || !to) throw new Error('Missing drag target');
  if (test.info().project.name === 'touch') {
    const session = await page.context().newCDPSession(page);
    const x = from.x + from.width / 2;
    const y = from.y + from.height / 2;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await page.waitForTimeout(220);
    for (let step = 1; step <= 15; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            x: x + ((to.x + to.width / 2 - x) * step) / 15,
            y: y + ((to.y + to.height / 2 - y) * step) / 15,
          },
        ],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
    return;
  }
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
  await page.mouse.up();
}

test('all existing puzzles: partial save, reset, solve, progression and final ending', async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await start(page);
  page.on('dialog', (dialog) => dialog.accept());
  for (let index = 0; index < allLevels.length; index++) {
    const level = allLevels[index];
    await expect(page.getByRole('heading', { name: level.title, exact: true })).toBeVisible();
    const entries = Object.entries(level.solution);
    const first = entries[0];
    const firstName = level.people.find((p) => p.id === first[1])!.name;
    await place(page, first[1], first[0]);
    await page.reload();
    await expect(slot(page, first[0])).toContainText(firstName);
    await activate(page.getByRole('button', { name: 'Baştan', exact: true }), page);
    await expect(slot(page, first[0])).toHaveAttribute('aria-label', /boş$/);
    for (const [target, person] of entries) await place(page, person, target);
    const win = page.getByRole('dialog');
    await expect(win).toContainText(`Tamamlanan: ${index + 1}/${allLevels.length}`);
    await expect(win.getByLabel('3 yıldız')).toBeVisible();
    if (index < allLevels.length - 1)
      await activate(win.getByRole('button', { name: /Sonraki bölüm|Sıradaki:/ }), page);
    else
      await expect(
        win.getByRole('heading', { name: 'Bütün bulmacalar tamamlandı!' }),
      ).toBeVisible();
  }
  await page.goto('#/');
  await expect(
    page.getByText('Bütün bulmacalar tamamlandı! Bayramın kutlu olsun. ☕'),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText('Bütün bulmacalar tamamlandı! Bayramın kutlu olsun. ☕'),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('keyboard alone can select, cancel and finish a puzzle', async ({ page }) => {
  await page.goto('#/play/tree-01');
  await page.getByRole('button', { name: 'Anladım, oynayalım' }).press('Enter');
  const people = allLevels[0];
  for (const [target, person] of Object.entries(people.solution)) {
    const tile = page.locator(`[data-person="${person}"]`);
    await tile.focus();
    await page.keyboard.press('Space');
    await expect(tile).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(tile).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await slot(page, target).focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('dialog', { name: 'Helal olsun!' })).toBeVisible();
});

test('fixed anchors and off-board drops are safe; occupied slots swap', async ({ page }) => {
  await start(page, 'tree-03');
  const fixed = page.locator('[data-slot="s_pdede"]');
  await drag(page, page.locator('[data-person="kemal"]'), fixed);
  await expect(fixed).toContainText('Hasan');
  await expect(page.locator('[data-person="kemal"]')).toBeVisible();
  await drag(page, page.locator('[data-person="kemal"]'), { x: 4, y: 4 });
  await expect(page.locator('[data-person="kemal"]')).toBeVisible();
  await start(page);
  await drag(page, page.locator('[data-person="ahmet"]'), slot(page, 's_baba'));
  await drag(page, page.locator('[data-person="ayse"]'), slot(page, 's_anne'));
  await drag(page, slot(page, 's_baba'), slot(page, 's_anne'));
  await expect(slot(page, 's_baba')).toContainText('Ayşe');
  await expect(slot(page, 's_anne')).toContainText('Ahmet');
  await activate(slot(page, 's_anne'), page);
  await activate(page.getByRole('button', { name: 'Seçili kişiyi geri al' }), page);
  await expect(page.locator('[data-person="ahmet"]')).toBeVisible();
});

test('hints, check feedback, glossary and persisted settings work in play', async ({ page }) => {
  await start(page);
  await place(page, 'ayse', 's_baba');
  await activate(page.getByRole('button', { name: 'Kontrol et', exact: true }), page);
  await expect(page.locator('[data-slot="s_baba"]')).toHaveClass(/slot--bad/);
  await activate(page.getByRole('button', { name: 'Bir yeri göster' }), page);
  await expect(slot(page, 's_baba')).toContainText('Ahmet');
  await expect(page.locator('.game__stats')).toContainText('Yardım: 1');
  await activate(page.getByRole('button', { name: 'Sözlük', exact: true }), page);
  await expect(
    page.getByRole('dialog').getByText('İki erkek kardeşin eşleri birbirinin eltisi.'),
  ).toBeVisible();
  await activate(page.getByRole('button', { name: 'Oyuna dön' }), page);
  await expect(slot(page, 's_baba')).toContainText('Ahmet');
  await activate(page.getByRole('button', { name: 'Ayarlar', exact: true }), page);
  for (const name of ['Ses', 'Titreşim', 'Animasyonu azalt', 'Anlık doğru/yanlış göster']) {
    const toggle = page.getByRole('checkbox', { name, exact: true });
    await toggle.setChecked(!(await toggle.isChecked()));
  }
  await activate(page.getByRole('button', { name: 'Oyuna dön' }), page);
  await expect(page.locator('.app')).toHaveAttribute('data-reduce-motion', 'true');
  await expect(page.locator('[data-slot="s_baba"]')).toHaveClass(/slot--ok/);
  await page.reload();
  await expect(page.locator('.app')).toHaveAttribute('data-reduce-motion', 'true');
  await expect(slot(page, 's_baba')).toContainText('Ahmet');
  for (const [target, person] of Object.entries(allLevels[0].solution).slice(1))
    await place(page, person, target);
  await expect(page.getByRole('dialog').getByLabel('2 yıldız')).toBeVisible();
});

test('blocked storage remains playable and states the session-only boundary', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
  });
  await start(page);
  await place(page, 'ahmet', 's_baba');
  await expect(slot(page, 's_baba')).toContainText('Ahmet');
  await page.getByRole('button', { name: 'Ayarlar', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('ilerleme bu oturumda tutulur');
});
