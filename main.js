const VERTEX_SHADER_SAMPLE = `#version 450
layout(location = 0) in vec3 position;
void main() {
    gl_Position = vec4(position, 1.0);
}
`;
const FRAGMENT_SHADER_SAMPLE = `#version 450
layout(location = 0) out vec4 outColor;
void main() {
    outColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;

let libGlslang = null;
let libTwgsl = null;

let promise1 = glslang();
let promise2 = twgsl("./glsl2wgsl/twgsl.wasm");

Promise.all([promise1, promise2]).then((args) => {
    libGlslang = args[0];
    libTwgsl = args[1];
});

/*
let editorGLSL = CodeMirror.fromTextArea(document.getElementById("glsl"), {
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    mode: "text/x-csrc"
});

let editorWGSL = CodeMirror.fromTextArea(document.getElementById("wgsl"), {
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    mode: "text/x-rustsrc"
});
*/

let editorGLSL = document.getElementById("glsl");
let editorWGSL = document.getElementById("wgsl");

let selectBox = document.getElementById('shader_type');
let convertButton = document.getElementById('convert');

selectBox.addEventListener('change', changeShaderType);
convertButton.addEventListener('click', convertGlslToWgsl);

function changeShaderType() {
    switch (selectBox.value) {
        case "vertex":
            editorGLSL.value = VERTEX_SHADER_SAMPLE;
            break;
        case "fragment":
            editorGLSL.value = FRAGMENT_SHADER_SAMPLE;
            break;
    }
    editorWGSL.value = "";
}

function convertGlslToWgsl() {
    let glslCode = editorGLSL.value;
    let type = selectBox.value;
    let spirv = libGlslang.compileGLSL(glslCode, type);
    let wgslCode = libTwgsl.convertSpirV2WGSL(spirv);
    editorWGSL.value = wgslCode;
}
