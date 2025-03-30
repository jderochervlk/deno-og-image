import satori from "npm:satori"
import { html } from "npm:satori-html"

const robotoArrayBuffer = await Deno.readFile("./Roboto-Regular.ttf")
const robotoBoldArrayBuffer = await Deno.readFile("./Roboto-Bold.ttf")

async function makeImg(searchParams: URLSearchParams) {
  const title = searchParams.get("title") ?? ""
  const tag = searchParams.get("tag") ?? ""
  const date = searchParams.get("date") ?? ""
  const author = searchParams.get("author") ?? ""
  const img = searchParams.get("img") ?? ""

  console.log(author)

  const svg = await satori(
    html`<div style="
        background: url('/background.png');
        color: rgb(35, 37, 56); 
        width: 100%;
        height: 100%;
        display:flex;
        flex-direction: column;
        padding: 25px;
      ">
        <p style="rgb(105, 107, 125)">${date}</p>
        <h1 style="font-weight: 700; font-size: 4rem;"><strong>${title}</strong></h1>
        <p style="font-size: 2rem;">${tag}</p>
        <div style="display: flex;">
          <img src="${img}" height="50" width="50" style="border-radius: 9999px; margin-right: 25px;"/>
          <p>${author}</p>
        </div>
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
        {
          name: "Roboto",
          data: robotoBoldArrayBuffer,
          weight: 700,
          style: "normal",
        },
      ],
    },
  )
  return svg
}
const test =
  "?title=ReScript%20Retreat&tag=Accelerating%20ReScript%20development%20through%20meeting%20in-person.&date=Mar%2017%2C%202025&author=ReScript%20Association&img=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1045362176117100545%2FMioTQoTp_400x400.jpg"

async function readBackgroundImage() {
  const file = await Deno.open("./background.png", { read: true })
  return new Response(file.readable)
}

async function makeImgResponse(searchParams: URLSearchParams) {
  try {
    const svg = await makeImg(searchParams)
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err, null, 2), {
      status: 500,
    })
  }
}

Deno.serve(async (res) => {
  const url = new URL(res.url)
  const searchParams = new URLSearchParams(url.searchParams)

  switch (url.pathname) {
    case "/":
      return await makeImgResponse(searchParams)
    case "/favicon.ico":
      return new Response()
    case "/background.png":
      return await readBackgroundImage()
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
