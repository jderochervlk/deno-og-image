import satori from "npm:satori"
import { html } from "npm:satori-html"

const robotoArrayBuffer = await Deno.readFile("./Roboto-Regular.ttf")
const robotoBoldArrayBuffer = await Deno.readFile("./Roboto-Bold.ttf")
const bgImage = await Deno.open("./background.png", { read: true })
const logo = await Deno.open("./rescript-logo.png", { read: true })

const template = (url: URL) => {
  const searchParams = new URLSearchParams(url.searchParams)

  const root = url.origin
  const title = searchParams.get("title") ?? ""
  const tag = searchParams.get("tag") ?? ""

  return `
     <div style="
        background-color: white;
        background: url('${root}/background.png');
        background-repeat: no-repeat;
        background-position: right bottom;
        color: rgb(35, 37, 56); 
        width: 1200px;
        height: 630px;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 25px;
      ">
      <div style="display: flex;">
        <h1 style="font-weight: 700; font-size: 6rem;"><strong>${title}</strong></h1>
        <p style="font-size: 3rem;">${tag}</p>
      </div>
      <img src="${root}/rescript-logo.png" width="408" height="96.25"/>  
      </div>
    `
}

async function makeImg(url: URL) {
  const svg = await satori(
    html(template(url)),
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
  "?title=ReScript%20Retreat&tag=Accelerating%20ReScript%20development%20through%20meeting%20in-person.&date=Mar%2017%2C%202025&img=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1045362176117100545%2FMioTQoTp_400x400.jpg&author=ReScript%20Association"

function readBackgroundImage() {
  return new Response(bgImage.readable)
}

function readLogoImage() {
  return new Response(logo.readable)
}

async function makeImgResponse(url: URL) {
  try {
    const svg = await makeImg(url)
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err, null, 2), {
      status: 500,
    })
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  switch (url.pathname) {
    case "/":
      return await makeImgResponse(url)
    case "/favicon.ico":
      return new Response()
    case "/background.png":
      return readBackgroundImage()
    case "/rescript-logo.png":
      return readLogoImage()
    case "/preview/":
      return new Response(template(url), {
        headers: { "Content-type": "text/html" },
      })
    case "/test":
      return new Response(
        `
        <html prefix="og: https://ogp.me/ns#">
          <head>
          <title>OG test page</title>
          <meta property="og:title" content="Open Graph Test Page" />
          <meta property="og:url" content="https://jvlk-og.deno.dev/test" />
          <meta property="og:image" content="https://jvlk-og.deno.dev/?title=ReScript%20Retreat&tag=Accelerating%20ReScript%20development%20through%20meeting%20in-person.&img=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1045362176117100545%2FMioTQoTp_400x400.jpg&date=Mar%2017%2C%202025&author=ReScript%20Association" />
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
