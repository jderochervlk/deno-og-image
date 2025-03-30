import satori from "npm:satori"
import { html } from "npm:satori-html"

type Args = {
  title: string
  tag: string
  date: string
  author: string
  img: string
}

async function makeImg({ title, tag, date, author, img }: Args) {
  const robotoArrayBuffer = await Deno.readFile("./Roboto-Regular.ttf")
  const svg = await satori(
    html`
    <div style="
        background: rgb(255, 255, 255);
        color: rgb(35, 37, 56); 
        width: 100%;
        height: 100%;
        display:flex
      ">
        <h1>${title}</h2>
        <p>${tag}</h2>
        <p>${author}</p>
        <p>${date}</p>
        <img src=${img}/>
      </div>
    `,
    {
      width: 1200,
      height: 630,
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
  return svg
}
const test =
  "?title=ReScript%20Retreat&tag=Accelerating%20ReScript%20development%20through%20meeting%20in-person.&date=Mar%2017%2C%202025&author=ReScript%20Association&img=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1045362176117100545%2FMioTQoTp_400x400.jpg"

Deno.serve(async (res) => {
  const url = new URL(res.url)
  const searchParams = new URLSearchParams(url.searchParams)

  const title = searchParams.get("title") ?? ""
  const tag = searchParams.get("tag") ?? ""
  const date = searchParams.get("date") ?? ""
  const author = searchParams.get("author") ?? ""
  const img = searchParams.get("img") ?? ""

  const svg = await makeImg({ title, tag, date, author, img })
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
          <title>OG test page</title>
          <meta property="og:title" content="Open Graph Test Page" />
          <meta property="og:url" content="https://joshderoche-deno-og-ima-93-4fxpc5cs4p2p.deno.dev/test" />
          <meta property="og:image" content="https://joshderoche-deno-og-ima-93-4fxpc5cs4p2p.deno.dev?title=ReScript%20Retreat&tag=Accelerating%20ReScript%20development%20through%20meeting%20in-person.&date=Mar%2017%2C%202025&author=ReScript%20Association&img=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1045362176117100545%2FMioTQoTp_400x400.jpg" />
          </head>
          <div>Test</div>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } },
      )
    default:
      return new Response("404: Not Found", {
        status: 404,
        statusText: "Not Found",
      })
  }
})
