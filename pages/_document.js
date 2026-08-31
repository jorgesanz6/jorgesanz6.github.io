import { Html, Head, Main, NextScript } from 'next/document'

const setInitialTheme = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <script
          data-goatcounter="https://jorgesanz6.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
