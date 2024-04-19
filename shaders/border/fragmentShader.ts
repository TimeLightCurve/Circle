// eslint-disable-next-line import/no-anonymous-default-export
export default /* glsl */ `

uniform float uFrequency;
uniform vec2 uResolution;
uniform float uRadius;


void main()
{
    vec2 uv = gl_PointCoord;
    vec2 wavedUv = vec2( uv.x + sin(uv.y  * 25.0) * 0.02, uv.y + sin(uv.x  * 25.0) * 0.02);
    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25 * uRadius));
    float alpha = 1.0 * uFrequency;
    
    gl_FragColor = vec4(strength, strength, strength, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`
