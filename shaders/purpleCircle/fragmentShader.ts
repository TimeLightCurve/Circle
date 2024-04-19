// eslint-disable-next-line import/no-anonymous-default-export
export default /* glsl */ `

uniform float uFrequency;
uniform vec2 uResolution;
uniform float uRadius;

void main()
{
    vec2 uv = gl_PointCoord;
    float dist = distance(uv , vec2(0.5));

    vec2 center = vec2(0.5);
    vec2 pos = uv /  uResolution.xy - center;
    if (dist > uRadius) {
        discard; // Discard fragments that are outside the radius to form a circle
    }
    float alpha = (1.0 - smoothstep(0.0, uRadius, dist) ) * uFrequency;
    gl_FragColor = vec4(0.5, 0.0, 0.5, alpha); // RGBA for purple to transparentt

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`
