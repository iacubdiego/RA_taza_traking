/* ─── orbit-animation: rota el pivot en Y ─────────── */
AFRAME.registerComponent('orbit-animation', {
  schema: {
    speed:  { type: 'number', default: 40 },
    paused: { type: 'boolean', default: false }
  },
  init() { this._angle = 0; },
  tick(_, delta) {
    if (this.data.paused) return;
    this._angle = (this._angle + (delta / 1000) * this.data.speed) % 360;
    this.el.object3D.rotation.y = THREE.MathUtils.degToRad(this._angle);
  }
});

/* ─── billboard: el plano 2D siempre mira a cámara ── */
AFRAME.registerComponent('billboard', {
  tick() {
    const cam = this.el.sceneEl.camera;
    if (!cam) return;
    this.el.object3D.lookAt(cam.getWorldPosition(new THREE.Vector3()));
  }
});

/* ─── occluder: invisible pero bloquea el depth ───── */
AFRAME.registerComponent('occluder', {
  init() {
    const apply = () => {
      const mesh = this.el.getObject3D('mesh');
      if (!mesh) return;
      mesh.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshBasicMaterial({ colorWrite: false });
          node.renderOrder = -1;
        }
      });
    };
    setTimeout(apply, 0);
    this.el.addEventListener('object3dset', apply);
  }
});
