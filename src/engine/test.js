var elements = require("../gp2/elements.js");
const twgl = require("twgl.js");

// --- FIX 1: Import all needed modules ---
//twgl.m4 = require("twgl.js/m4");
//twgl.primitives = require("twgl.js/primitives");
window.twgl = twgl;

var canvas = elements.createElementsFromJSON([
  {
    element: "canvas",
    width: 600,
    height: 360,
    style: {
      background: "#000000",
    },
  },
])[0];
document.body.append(canvas);

// --- 1. Get GLSL strings ---
const spriteVertexShader = require("./sprite.vert").default;
const spriteFragmentShader = require("./sprite.frag").default;

const gl = canvas.getContext("webgl");
// --- ADD THESE ---
gl.disable(gl.DEPTH_TEST); // Disable the depth test
gl.disable(gl.CULL_FACE); // Disable culling (in case quad is backwards)
// -----------------

gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

// --- 2. Define effects and compile program ---
const defines = `
#define ENABLE_whirl
#define ENABLE_color
`;

const finalFragmentShader = defines + spriteFragmentShader;

const spriteProgramInfo = twgl.createProgramInfo(gl, [
  spriteVertexShader,
  finalFragmentShader,
]);

// --- 3. Create geometry that matches the Scratch shader ---

// Scratch's quad is centered at (0,0) and goes from -0.5 to +0.5
const position = [-0, -0, 1, -0, -0, 1, -0, 1, 1, -0, 1, 1];

// Scratch's texcoords are Y-flipped (0,1 is top-left)
const texcoord = [
  0,
  0, // Bottom-left vertex maps to (0,0)
  1,
  0, // Bottom-right vertex maps to (1,0)
  0,
  1, // Top-left vertex maps to (0,1)
  0,
  1, // Top-left vertex maps to (0,1)
  1,
  0, // Bottom-right vertex maps to (1,0)
  1,
  1, // Top-right vertex maps to (1,1)
];

// Create the buffer info, naming the attributes to match the shader
const quadBufferInfo = twgl.createBufferInfoFromArrays(gl, {
  a_position: {
    // This now matches `attribute vec2 a_position`
    numComponents: 2,
    data: position,
  },
  a_texCoord: {
    // This now matches `attribute vec2 a_texCoord`
    numComponents: 2,
    data: texcoord,
  },
});

// --- 4. Load the texture ---
var img = document.createElement("img");
img.src = "placeholder/costume1.svg";
img.onload = function () {
  // --- FIX 2: Create a 2D canvas with a *fixed size* ---
  var canvas2d = document.createElement("canvas");
  var ctx = canvas2d.getContext("2d");

  // Use a fixed size to force the SVG to render
  const texWidth = 256;
  const texHeight = 256;
  canvas2d.width = texWidth;
  canvas2d.height = texHeight;
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, texWidth, texHeight);
  ctx.drawImage(img, 0, 0, texWidth, texHeight);
  // --------------------------------------------------

  // --- 5. Setup drawing variables ---
  const myTexture = twgl.createTexture(gl, {
    src: canvas2d,
  });

  console.log("Texture created:", myTexture);

  const projectionMatrix = twgl.m4.ortho(
    0,
    gl.canvas.width,
    gl.canvas.height,
    0,
    -1,
    1
  );

  // --- 6. Create the render loop ---
  function render(time) {
    time *= 0.001; // convert time to seconds

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0); // Use 0,0,0,0 to respect canvas style background
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Calculate a model matrix
    let modelMatrix = twgl.m4.identity();
    modelMatrix = twgl.m4.translate(modelMatrix, [0, 0, 0]);
    // Scale sprite to 100x100 pixels
    modelMatrix = twgl.m4.scale(modelMatrix, [100, 100, 1]);
    //modelMatrix = twgl.m4.rotateZ(modelMatrix, time * 0.5);

    // Define uniforms (must be inside the loop for animations)
    const uniforms = {
      u_projectionMatrix: projectionMatrix,
      u_modelMatrix: modelMatrix,
      u_skin: myTexture,

      // --- FIX 4: Provide all defined uniforms ---
      u_whirl: time * 0.5, // Animate the whirl effect
      u_color: (time * 0.1) % 1.0, // Animate the color shift
    };

    // --- Draw the sprite ---
    gl.useProgram(spriteProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, spriteProgramInfo, quadBufferInfo);
    twgl.setUniforms(spriteProgramInfo, uniforms);
    twgl.drawBufferInfo(gl, quadBufferInfo);

    // Request the next frame
    requestAnimationFrame(render);
  }

  // --- 7. Start the render loop ---
  requestAnimationFrame(render);
};

// Handle image loading errors
img.onerror = function () {
  console.error("Failed to load image at: " + img.src);
};
