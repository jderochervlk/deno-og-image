import satori from "npm:satori"
import { html } from "npm:satori-html"

const robotoArrayBuffer = await Deno.readFile("./Roboto-Regular.ttf")
const svg = await satori(
  html(`<div style="background: red; padding: 25px;">Hello!</div>`),
  {
    width: 600,
    height: 400,
    fonts: [
      {
        name: "Roboto",
        data: robotoArrayBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  },
)

Deno.serve((res) => {
  const url = new URL(res.url)
  const searchParams = new URLSearchParams(res.url)
  switch (url.pathname) {
    case "/":
      return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } })
    case "/favicon.ico":
      return new Response()
    case "/test":
      return new Response(
        `
        <html prefix="og: https://ogp.me/ns#">
        <head>
        <title>The Rock (1996)</title>
        <meta property="og:title" content="The Rock" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
        <meta property="og:image" content="https://joshderoche-deno-og-ima-93-4fxpc5cs4p2p.deno.dev/" />
        </head>
        </html>
        `,
        { headers: { "Content-Type": "application/xhtml+xml  " } },
      )
    default:
      return new Response("404: Not Found", {
        status: 404,
        statusText: "Not Found",
      })
  }
})
