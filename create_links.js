require('dotenv').config();
const puppeteer = require('puppeteer');
const linksData = require('./links_data.json');

const resultLinks = [];
const targetReplay = 'SFDC Live Demo (for our champions)';

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 10 });
  const page = await browser.newPage();

  async function waitForSelectors(selectors, frame) {
    for (const selector of selectors) {
      try {
        return await waitForSelector(selector, frame);
      } catch (err) {
        console.error(err);
      }
    }
    throw new Error(
      'Could not find element for selectors: ' + JSON.stringify(selectors)
    );
  }

  async function waitForSelector(selector, frame) {
    if (selector instanceof Array) {
      let element = null;
      for (const part of selector) {
        if (!element) {
          element = await frame.waitForSelector(part);
        } else {
          element = await element.$(part);
        }
        if (!element) {
          throw new Error('Could not find element: ' + part);
        }
        element = (
          await element.evaluateHandle((el) =>
            el.shadowRoot ? el.shadowRoot : el
          )
        ).asElement();
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }
    const element = await frame.waitForSelector(selector);
    if (!element) {
      throw new Error('Could not find element: ' + selector);
    }
    return element;
  }

  async function waitForElement(step, frame) {
    const count = step.count || 1;
    const operator = step.operator || '>=';
    const comp = {
      '==': (a, b) => a === b,
      '>=': (a, b) => a >= b,
      '<=': (a, b) => a <= b,
    };
    const compFn = comp[operator];
    await waitForFunction(async () => {
      const elements = await querySelectorsAll(step.selectors, frame);
      return compFn(elements.length, count);
    });
  }

  async function querySelectorsAll(selectors, frame) {
    for (const selector of selectors) {
      const result = await querySelectorAll(selector, frame);
      if (result.length) {
        return result;
      }
    }
    return [];
  }

  async function querySelectorAll(selector, frame) {
    if (selector instanceof Array) {
      let elements = [];
      let i = 0;
      for (const part of selector) {
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        const tmpElements = [];
        for (const el of elements) {
          const newEl = (
            await el.evaluateHandle((el) =>
              el.shadowRoot ? el.shadowRoot : el
            )
          ).asElement();
          if (newEl) {
            tmpElements.push(newEl);
          }
        }
        elements = tmpElements;
        i++;
      }
      return elements;
    }
    const element = await frame.$$(selector);
    if (!element) {
      throw new Error('Could not find element: ' + selector);
    }
    return element;
  }

  async function waitForFunction(fn) {
    let isActive = true;
    setTimeout(() => {
      isActive = false;
    }, 5000);
    while (isActive) {
      const result = await fn();
      if (result) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Timed out');
  }
  {
    const targetPage = page;
    await targetPage.setViewport({ width: 1808, height: 1336 });
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    await targetPage.goto('https://app.getreprise.com/auth/login/');
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [
        ['aria/you@your-business.com'],
        [
          '#content > div.login-form.my-auto.mx-auto.flex.flex-col > form > div > input.focus\\:border-indigo-500.focus\\:text-white.hover\\:text-gray-200.hover\\:border-gray-400.text-white.placeholder-gray-400.mt-1.relative.bg-gray-900.border-gray-600.transition.p-4.text-lg.border.rounded-md.w-full',
        ],
      ],
      targetPage
    );
    await element.click({ offset: { x: 248, y: 12 } });
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [
        ['aria/you@your-business.com'],
        [
          '#content > div.login-form.my-auto.mx-auto.flex.flex-col > form > div > input.focus\\:border-indigo-500.focus\\:text-white.hover\\:text-gray-200.hover\\:border-gray-400.text-white.placeholder-gray-400.mt-1.relative.bg-gray-900.border-gray-600.transition.p-4.text-lg.border.rounded-md.w-full',
        ],
      ],
      targetPage
    );
    const type = await element.evaluate((el) => el.type);
    if (
      [
        'textarea',
        'select-one',
        'text',
        'url',
        'tel',
        'search',
        'password',
        'number',
        'email',
      ].includes(type)
    ) {
      await element.type(process.env.REPRISE_EMAIL);
    } else {
      await element.focus();
      await element.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, process.env.REPRISE_EMAIL);
    }
  }
  {
    const targetPage = page;
    const element = await waitForSelectors([['#content']], targetPage);
    await element.click();
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    const element = await waitForSelectors(
      [['aria/Next'], ['#submitForm']],
      targetPage
    );
    await element.click();
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [
        ['aria/password'],
        [
          '#content > div.password-form.my-auto.mx-auto.flex.flex-col > form > div.flex.flex-col > input.focus\\:border-indigo-500.focus\\:text-white.focus\\:outline-none.hover\\:text-gray-200.hover\\:border-gray-400.text-white.placeholder-gray-400.mt-1.relative.bg-gray-900.border-gray-600.transition.p-4.text-lg.border.rounded-md.w-full',
        ],
      ],
      targetPage
    );
    await element.click();
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [
        ['aria/password'],
        [
          '#content > div.password-form.my-auto.mx-auto.flex.flex-col > form > div.flex.flex-col > input.focus\\:border-indigo-500.focus\\:text-white.focus\\:outline-none.hover\\:text-gray-200.hover\\:border-gray-400.text-white.placeholder-gray-400.mt-1.relative.bg-gray-900.border-gray-600.transition.p-4.text-lg.border.rounded-md.w-full',
        ],
      ],
      targetPage
    );
    const type = await element.evaluate((el) => el.type);
    if (
      [
        'textarea',
        'select-one',
        'text',
        'url',
        'tel',
        'search',
        'password',
        'number',
        'email',
      ].includes(type)
    ) {
      await element.type(process.env.REPRISE_PASSWORD);
    } else {
      await element.focus();
      await element.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, process.env.REPRISE_PASSWORD);
    }
  }
  {
    const targetPage = page;
    const element = await waitForSelectors([['#content']], targetPage);
    await element.click();
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    const element = await waitForSelectors(
      [
        ['aria/Log in'],
        [
          '#content > div.password-form.my-auto.mx-auto.flex.flex-col > form > div.flex.flex-col > button',
        ],
      ],
      targetPage
    );
    await element.click();
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    const element = await waitForSelectors(
      [
        [
          'body > div.bg-gray-900.w-full.h-screen.flex > div.h-full.relative.px-4.pt-1.transition-all.duration-300.group.w-80 > a:nth-child(3) > div > div',
        ],
      ],
      targetPage
    );
    await element.click({ offset: { x: 36, y: 11 } });
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    const element = await waitForSelectors(
      [['aria/Published '], ['#PUBLISHED_TAB']],
      targetPage
    );
    await element.click();
  }
  {
    // Select replay: data-test-pubreplay-title="SFDC Live Demo (for our champions)"
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    const element = await waitForSelectors(
      [[`div[data-test-pubreplay-title="${targetReplay}"] + div + div button`]],
      targetPage
    );
    await element.click();
    await Promise.all(promises);
  }

  for (let linkObj of linksData) {
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [
          [
            'body > div.bg-gray-900.w-full.h-screen.flex > div.w-full.bg-gray-800.min-h-screen.flex.flex-col.text-grey-200.p-6.overflow-y-auto > div > div.w-full.h-full.pr-4 > div.w-full.flex-1.flex-row.pb-4 > div > div.flex.justify-between.w-full.text-xl.text-gray-200.font-semibold.py-px20 > div > span > button',
          ],
        ],
        targetPage
      );
      await element.click();
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['aria/Title'], ['#form-elment-1001']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.INTERNAL_TITLE);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.INTERNAL_TITLE);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['aria/Description'], ['#form-elment-1002']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.INTERNAL_DESCRIPTION);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.INTERNAL_DESCRIPTION);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['#form-elment-1005']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.COMPANY_LOGO);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.COMPANY_LOGO);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['#form-elment-1006']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.CUST_COMPANY);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.CUST_COMPANY);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['#form-elment-1007']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.USER_NAME);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.USER_NAME);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [['#form-elment-1008']],
        targetPage
      );
      const type = await element.evaluate((el) => el.type);
      if (
        [
          'textarea',
          'select-one',
          'text',
          'url',
          'tel',
          'search',
          'password',
          'number',
          'email',
        ].includes(type)
      ) {
        await element.type(linkObj.USER_PROFILE_PIC);
      } else {
        await element.focus();
        await element.evaluate((el, value) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, linkObj.USER_PROFILE_PIC);
      }
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [
          ['aria/Create Link', 'aria/[role="generic"]'],
          [
            'body > div.bg-gray-900.w-full.h-screen.flex > div.w-full.bg-gray-800.min-h-screen.flex.flex-col.text-grey-200.p-6.overflow-y-auto > div > div:nth-child(3) > div > div > div.flex.w-full.flex-row.text-right.justify-end.mt-1 > span:nth-child(2) > button',
          ],
        ],
        targetPage
      );
      await element.click();
    }
    {
      const targetPage = page;
      const element = await waitForSelectors(
        [
          [
            '#published_replay_links_table > tbody > tr:first-child > td:nth-child(4) > div > div.break-words > a',
          ],
        ],
        targetPage
      );
      const elValue = await element.evaluate((el) => el.textContent);
      await resultLinks.push({
        linkTitle: linkObj.INTERNAL_TITLE,
        linkURL: elValue,
      });
    }
    console.log(`${linkObj.INTERNAL_TITLE} was successfully created!`);
  }
  console.table(resultLinks);
  await browser.close();
})();
