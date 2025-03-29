import satori from 'npm:satori';
import { html } from 'npm:satori-html';

const robotoArrayBuffer = await Deno.readFile("./Roboto-Regular.ttf")
const svg = await satori(
 html(`<div style="background: red; padding: 25px;">Hello!</div>`), 
{
    width: 600,
    height: 400,
    fonts: [
      {
        name: 'Roboto',
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: robotoArrayBuffer,
        weight: 400,
        style: 'normal',
      },
    ],
  },
)

Deno.serve(() => new Response(svg, { headers: {"Content-Type": "image/svg+xml"}})
)