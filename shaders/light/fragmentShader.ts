// eslint-disable-next-line import/no-anonymous-default-export
export default /* glsl */ `

uniform float uFrequency;

void main()
{
    float num = uFrequency * 0.8;
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = num / distanceToCenter - 3.0;
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`
