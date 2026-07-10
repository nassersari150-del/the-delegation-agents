import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three/webgpu';
import { getAgentSet, AGENTIC_SETS } from '../../data/agents';
import { useTeamStore } from '../../integration/store/teamStore';
import { DRACO_LIB_PATH } from '../constants';
import { NavMeshManager } from '../pathfinding/NavMeshManager';
import { PoiManager } from './PoiManager';

const BUSINESS_LAYOUT = [
  { id: 'vinted-ia',        row: 0, col: 0, label: 'Vinted IA',        revenue: '20k' },
  { id: 'vente-site-web',   row: 0, col: 1, label: 'Vente Site Web',   revenue: '12k' },
  { id: 'pub-marques',      row: 0, col: 2, label: 'Pub Marques',      revenue: '10k' },
  { id: 'formations-ia',    row: 0, col: 3, label: 'Formations IA',    revenue: '10k' },
  { id: 'miniatures-video', row: 0, col: 4, label: 'Miniatures Vidéo', revenue: '10k' },
  { id: 'montage-ia',       row: 1, col: 0, label: 'Montage IA',       revenue: '10k' },
  { id: 'bot-trading',      row: 1, col: 1, label: 'Bot Trading',      revenue: '10k' },
  { id: 'agent-finance',    row: 1, col: 2, label: 'Agent Finance',    revenue: '10k' },
  { id: 'json-business-1',  row: 1, col: 3, label: 'JSON Business 1',  revenue: '800' },
  { id: 'json-business-2',  row: 1, col: 4, label: 'JSON Business 2',  revenue: '800' },
];

const OFFICE_SIZE = 13;
const OFFICE_SPACING_X = OFFICE_SIZE;
const OFFICE_SPACING_Z = OFFICE_SIZE;
const PAUSE_ROOM_W = OFFICE_SIZE * 5;
const PAUSE_ROOM_D = 12;
const PAUSE_ROOM_Z = OFFICE_SIZE + PAUSE_ROOM_D / 2;
const WALL_HEIGHT = 3.2;
const WALL_THICKNESS = 0.2;
const DOOR_WIDTH = 2.2;
const DOOR_HEIGHT = 2.6;

export class WorldManager {
  private offices: THREE.Group[] = [];
  private labels: THREE.Sprite[] = [];
  private walls: THREE.Mesh[] = [];

  constructor(
    private scene: THREE.Scene,
    private navMesh: NavMeshManager,
    private poiManager: PoiManager
  ) {}

  private get wallMat() {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe8e8e8),
      roughness: 0.85,
      metalness: 0.0,
    });
  }

  private get frameMat() {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd0d0d0),
      roughness: 0.7,
      metalness: 0.05,
    });
  }

  private addBox(cx: number, cy: number, cz: number, w: number, h: number, d: number, rotY = 0, mat?: THREE.Material): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || this.wallMat);
    mesh.position.set(cx, cy, cz);
    mesh.rotation.y = rotY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.walls.push(mesh);
  }

  private addWallWithDoor(cx: number, cz: number, wallLen: number, rotY = 0): void {
    const side = (wallLen - DOOR_WIDTH) / 2;
    const aboveH = WALL_HEIGHT - DOOR_HEIGHT;
    const ft = 0.12;

    const lw = (lx: number, lz: number) => ({
      x: cx + Math.cos(rotY) * lx - Math.sin(rotY) * lz,
      z: cz + Math.sin(rotY) * lx + Math.cos(rotY) * lz,
    });

    if (side > 0.05) {
      const l = lw(-(DOOR_WIDTH / 2 + side / 2), 0);
      this.addBox(l.x, WALL_HEIGHT / 2, l.z, side, WALL_HEIGHT, WALL_THICKNESS, rotY);
      const r = lw(DOOR_WIDTH / 2 + side / 2, 0);
      this.addBox(r.x, WALL_HEIGHT / 2, r.z, side, WALL_HEIGHT, WALL_THICKNESS, rotY);
    }

    if (aboveH > 0.05) {
      this.addBox(cx, DOOR_HEIGHT + aboveH / 2, cz, wallLen, aboveH, WALL_THICKNESS, rotY);
    }

    const pl = lw(-DOOR_WIDTH / 2, 0);
    this.addBox(pl.x, DOOR_HEIGHT / 2, pl.z, ft, DOOR_HEIGHT, WALL_THICKNESS + 0.05, rotY, this.frameMat);
    const pr = lw(DOOR_WIDTH / 2, 0);
    this.addBox(pr.x, DOOR_HEIGHT / 2, pr.z, ft, DOOR_HEIGHT, WALL_THICKNESS + 0.05, rotY, this.frameMat);
    this.addBox(cx, DOOR_HEIGHT + ft / 2, cz, DOOR_WIDTH + ft * 2, ft, WALL_THICKNESS + 0.05, rotY, this.frameMat);
  }

  private addSolidWall(cx: number, cz: number, wallLen: number, rotY = 0): void {
    this.addBox(cx, WALL_HEIGHT / 2, cz, wallLen, WALL_HEIGHT, WALL_THICKNESS, rotY);
  }

  private buildOfficeWalls(): void {
    const half = OFFICE_SIZE / 2;
    for (const biz of BUSINESS_LAYOUT) {
      const cx = biz.col * OFFICE_SPACING_X - (OFFICE_SPACING_X * 2);
      const cz = biz.row * OFFICE_SPACING_Z;

      const hasN = BUSINESS_LAYOUT.some(b => b.col === biz.col && b.row === biz.row - 1);
      hasN ? this.addWallWithDoor(cx, cz - half, OFFICE_SIZE, 0) : this.addSolidWall(cx, cz - half, OFFICE_SIZE, 0);

      const hasS = BUSINESS_LAYOUT.some(b => b.col === biz.col && b.row === biz.row + 1);
      hasS ? this.addWallWithDoor(cx, cz + half, OFFICE_SIZE, 0) : this.addWallWithDoor(cx, cz + half, OFFICE_SIZE, 0);

      const hasW = BUSINESS_LAYOUT.some(b => b.row === biz.row && b.col === biz.col - 1);
      hasW ? this.addWallWithDoor(cx - half, cz, OFFICE_SIZE, Math.PI / 2) : this.addSolidWall(cx - half, cz, OFFICE_SIZE, Math.PI / 2);

      const hasE = BUSINESS_LAYOUT.some(b => b.row === biz.row && b.col === biz.col + 1);
      hasE ? this.addWallWithDoor(cx + half, cz, OFFICE_SIZE, Math.PI / 2) : this.addSolidWall(cx + half, cz, OFFICE_SIZE, Math.PI / 2);
    }
  }

  private buildPauseRoom(): void {
    const cx = OFFICE_SIZE; // centre des 5 colonnes
    const cz = PAUSE_ROOM_Z;
    const halfW = PAUSE_ROOM_W / 2;
    const halfD = PAUSE_ROOM_D / 2;

    // Murs extérieurs salle de pause
    this.addSolidWall(cx, cz + halfD, PAUSE_ROOM_W, 0); // sud
    this.addSolidWall(cx - halfW, cz, PAUSE_ROOM_D, Math.PI / 2); // ouest
    this.addSolidWall(cx + halfW, cz, PAUSE_ROOM_D, Math.PI / 2); // est

    // Sol salle de pause
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(PAUSE_ROOM_W, PAUSE_ROOM_D),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0xf5f5f0), roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0.01, cz);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // MOBILIER salle de pause

    // Canapé (3 blocs)
    const couchMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8b9dc3), roughness: 0.8 });
    // Assise
    this.addBox(cx, 0.4, cz + 3, 5, 0.5, 1.5, 0, couchMat);
    // Dossier
    this.addBox(cx, 0.9, cz + 3.6, 5, 0.8, 0.3, 0, couchMat);
    // Accoudoir gauche
    this.addBox(cx - 2.7, 0.7, cz + 3, 0.3, 0.6, 1.5, 0, couchMat);
    // Accoudoir droit
    this.addBox(cx + 2.7, 0.7, cz + 3, 0.3, 0.6, 1.5, 0, couchMat);

    // Table basse
    const tableMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xd4b896), roughness: 0.6, metalness: 0.1 });
    this.addBox(cx, 0.3, cz + 1.2, 2.5, 0.1, 1.2, 0, tableMat);
    // Pieds table
    this.addBox(cx - 1, 0.15, cz + 0.7, 0.1, 0.3, 0.1, 0, tableMat);
    this.addBox(cx + 1, 0.15, cz + 0.7, 0.1, 0.3, 0.1, 0, tableMat);
    this.addBox(cx - 1, 0.15, cz + 1.7, 0.1, 0.3, 0.1, 0, tableMat);
    this.addBox(cx + 1, 0.15, cz + 1.7, 0.1, 0.3, 0.1, 0, tableMat);

    // Plante décorative
    const potMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xc47c3e), roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x4a7c4e), roughness: 0.8 });
    this.addBox(cx + 4, 0.3, cz - 3, 0.5, 0.6, 0.5, 0, potMat);
    this.addBox(cx + 4, 0.9, cz - 3, 0.9, 0.8, 0.9, 0, leafMat);
    // Deuxième plante
    this.addBox(cx - 4, 0.3, cz - 3, 0.5, 0.6, 0.5, 0, potMat);
    this.addBox(cx - 4, 0.9, cz - 3, 0.9, 0.8, 0.9, 0, leafMat);

    // Table à manger ronde (simulée en carré)
    const diningMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xf0ede8), roughness: 0.7 });
    const chairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x6b7280), roughness: 0.8 });
    this.addBox(cx, 0.75, cz - 2.5, 2.5, 0.1, 2.5, 0, diningMat);
    // Chaises autour de la table
    this.addBox(cx - 1.8, 0.4, cz - 2.5, 0.8, 0.5, 0.8, 0, chairMat);
    this.addBox(cx + 1.8, 0.4, cz - 2.5, 0.8, 0.5, 0.8, 0, chairMat);
    this.addBox(cx, 0.4, cz - 4, 0.8, 0.5, 0.8, 0, chairMat);
    this.addBox(cx, 0.4, cz - 1, 0.8, 0.5, 0.8, 0, chairMat);

    // Label discret salle de pause
    const label = this.createDiscreetLabel('Salle de Pause');
    label.position.set(cx, 3.5, cz);
    this.scene.add(label);
    this.labels.push(label);
  }

  private createDiscreetLabel(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, 256, 48);
    ctx.fillStyle = 'rgba(50,50,50,0.55)';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 28);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4, 0.8, 1);
    return sprite;
  }

  private createOfficeLabel(text: string, revenue: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 56;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 56);

    // Nom discret
    ctx.fillStyle = 'rgba(40,40,40,0.7)';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 22);

    // Revenu très discret
    ctx.fillStyle = 'rgba(80,80,80,0.5)';
    ctx.font = '14px Arial';
    ctx.fillText(revenue + '/mois', 128, 44);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4, 0.9, 1);
    return sprite;
  }

  public async load(): Promise<void> {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_LIB_PATH);
    loader.setDRACOLoader(dracoLoader);

    const officeGltf = await loader.loadAsync(`${import.meta.env.BASE_URL}models/office.glb`);

    const { selectedAgentSetId, customSystems } = useTeamStore.getState();
    const activeSet = getAgentSet(selectedAgentSetId, customSystems);

    for (const biz of BUSINESS_LAYOUT) {
      const agentSet = AGENTIC_SETS.find(s => s.id === biz.id);
      const color = agentSet ? agentSet.color : activeSet.color;

      const officeClone = officeGltf.scene.clone(true);
      const offsetX = biz.col * OFFICE_SPACING_X - (OFFICE_SPACING_X * 2);
      const offsetZ = biz.row * OFFICE_SPACING_Z;
      officeClone.position.set(offsetX, 0, offsetZ);

      officeClone.traverse((child: any) => {
        if (child.isMesh) {
          const mesh = child as THREE.Mesh;
          const name = mesh.name.toLowerCase();
          if (name.includes('navmesh')) {
            mesh.visible = false;
          } else {
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            if (mesh.material) {
              const oldMat = mesh.material as THREE.MeshStandardMaterial;
              // Pas de couleur par business — tout blanc/gris neutre
              mesh.material = new (THREE as any).MeshStandardNodeMaterial({
                color: oldMat.color,
                map: oldMat.map,
                roughness: 1,
                metalness: 0.35,
              });
            }
          }
        }
      });

      this.scene.add(officeClone);
      this.offices.push(officeClone);

      // Label discret
      const label = this.createOfficeLabel(biz.label, biz.revenue);
      label.position.set(offsetX, 4, offsetZ);
      this.scene.add(label);
      this.labels.push(label);

      this.poiManager.loadFromGlbWithOffset(officeClone, offsetX, offsetZ, biz.id);
    }

    this.buildOfficeWalls();
    this.buildPauseRoom();

    officeGltf.scene.traverse((child: any) => {
      if (child.isMesh && child.name.toLowerCase().includes('navmesh')) {
        this.navMesh.loadFromGeometry(child.geometry);
      }
    });
  }

  public updateThemeColor(_color: string): void {
    // Pas de couleur par bureau — neutre
  }

  public getOffice(): THREE.Group | null {
    return this.offices[0] || null;
  }
                                                 }
