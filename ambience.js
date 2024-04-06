import { fractalNoise } from './utils.js';
import { camera, scene } from './scn.js';
import * as THREE from 'three';


export let currentDimension = 'overworld';

export const tracks = {
    'overworld':['Immersed', 'Heavy Heart', 'Healing'],
    'cave':['Ossuary 6 - Air', 'Ossuary 1 - A Beginning'],
    'flesh pit':['The Dread', 'Gathering Darkness', 'Digital Bark'],
};

let trackNum = 0;
let aud = new Audio();
export async function playNextTrack() {
    if (trackNum > (tracks[currentDimension].length-1)) {
        trackNum = 0
    };

    //console.log(tracks[currentDimension], currentDimension, trackNum, tracks[currentDimension][trackNum])

    aud.src = `./assets/music/${tracks[currentDimension][trackNum]}.mp3`;
    aud.currentTime = 0;
    aud.load();
    aud.play();

    trackNum += 1;

    aud.addEventListener('ended', function () {
        playNextTrack()
    });
}


let sun = new THREE.DirectionalLight(0xffffff);
sun.position.set(400, 400, 400);
let soft = new THREE.DirectionalLight(0x939393);
soft.position.set(-400, 400, -400);
let neath = new THREE.DirectionalLight(0x5f5f5f);
neath.position.set(0, -400, 0);
scene.add(sun);
scene.add(soft);
scene.add(neath);


function changeSkyColor(r, g, b) {
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    scene.fog.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);

    sun.color = new THREE.Color(`rgb(${r+100}, ${g+100}, ${b+100})`);
    soft.color = new THREE.Color(`rgb(${r+50}, ${g+50}, ${b+50})`);
    neath.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
}


let lastdim;
export function chkAmbience(val) {
    let relCamNoise = fractalNoise(Math.round(camera.position.x), Math.round(camera.position.z));

    currentDimension = 'overworld';

    if (camera.position.y < (relCamNoise - 15)) {
        currentDimension = 'cave';
    }

    if (camera.position.y < (relCamNoise - 400)) {
        currentDimension = 'flesh pit';
    }

    if (lastdim !== currentDimension) {
         lastdim = currentDimension
        let skycol;

        if (currentDimension === 'overworld') {
            skycol = [189, 255, 254];
        } else if (currentDimension === 'cave') {
            skycol = [0, 0, 0]
        } else if (currentDimension === 'flesh pit') {
            skycol = [50, 0, 0]
        }
        
        playNextTrack();
        changeSkyColor(skycol[0], skycol[1], skycol[2]);
    }
}