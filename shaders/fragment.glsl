uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal; 

void main() {  

    float intensity = 1.05 - dot(vertexNormal, vec3(0.2, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 2.0) * pow(intensity, 3.0);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
    // texture2D parameter 1 : load the globe texture2D from book of shader 
    // texture2D parameter 2 : giving uv coordinate to the sphere

}
