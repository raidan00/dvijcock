import { Group, AmbientLight, DirectionalLight, Color } from 'three';

let lights = new Group();

var light = new AmbientLight(new Color( 1.2, 1.2, 1.2 ), 0.75);
lights.add(light);

var light = new DirectionalLight(new Color( 0.7, 0.7, 0.7 ), 1);
light.position.set(1,1,0);
lights.add(light);
var light = new DirectionalLight(new Color( 0.7, 0.7, 0.7 ), 1);
light.position.set(-1,1,1);
lights.add(light);
var light = new DirectionalLight(new Color( 0.7, 0.7, 0.7 ), 1);
light.position.set(-1,1,-1);
lights.add(light);

export default lights;
