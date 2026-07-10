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

// Taille d'un bureau = espacement → bureaux collés
const OFFICE_SIZE = 13;
const OFFICE_SPACING_X = OFFICE_SIZE;
const OFFICE_SPACING_Z = OFFICE_SIZE;

// Grande salle de pause centrale (entre les 2 rangées)
const PAUSE_ROOM_W = OFFICE_SIZE * 5;
const PAUSE_ROOM_D = 10;
const PAUSE_ROOM_Z = OFFICE_SIZE + PAUSE_ROOM_D / 2;

const WALL_HEIGHT = 3.2;
const WALL_THICKNESS = 0.2;
const WALL_MAT_COLOR = 0xe8e8e8;
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
      color: new THREE.Color(WALL_MAT_COLOR),
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
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      mat || this.wallMat
    );
    mesh.position.set(cx, cy, cz);
    mesh.rotation.y = rotY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.walls.push(mesh);
  }

  private addWallWithDoor(cx: number, cz: number, wallLen: number, rotY = 0): void {
    const side = (wallLen - DOOR_WIDTH) / 2;
    const hH = WALL_HEIGHT / 2;
    const aboveH = WALL_HEIGHT - DOOR_HEIGHT;
    const ft = 0.12;

    const localToWorld = (lx: number, lz: number) => ({
      x: cx + Math.cos(rotY) * lx - Math.sin(rotY) * lz,
      z: cz + Math.sin(rotY) * lx + Math.cos(rotY) * lz,
    });

    // Segment gauche
    if (side > 0.05) {
      const p = localToWorld(-(DOOR_WIDTH / 2 + side / 2), 0);
      this.addBox(p.x, hH, p.z, side, WALL_HEIGHT, WALL_THICKNESS, rotY);
    }

    // Segment droit
    if (side > 0.05) {
      const p = localToWorld(DOOR_WIDTH / 2 + side / 2, 0);
      this.addBox(p.x, hH, p.z, side, WALL_HEIGHT, WALL_THICKNESS, rotY);
    }

    // Dessus porte
    if (aboveH > 0.05) {
      this.addBox(cx, DOOR_HEIGHT + aboveH / 2, cz, wallLen, aboveH, WALL_THICKNESS, rotY);
    }

    // Encadrement — montant gauche
    const pl = localToWorld(-DOOR_WIDTH / 2, 0);
    this.addBox(pl.x, DOOR_HEIGHT / 2, pl.z, ft, DOOR_HEIGHT, WALL_THICKNESS + 0.05, rotY, this.frameMat);

    // Montant droit
    const pr = localToWorld(DOOR_WIDTH / 2, 0);
    this.addBox(pr.x, DOOR_HEIGHT / 2, pr.z, ft, DOOR_HEIGHT, WALL_THICKNESS + 0.05, rotY, this.frameMat);

    // Linteau
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

      // NORD
      const hasN = BUSINESS_LAYOUT.some(b => b.col === biz.col && b.row === biz.row - 1);
      if (hasN) {
        this.addWallWithDoor(cx, cz - half, OFFICE_SIZE, 0);
      } else {
        this.addSolidWall(cx, cz - half, OFFICE_SIZE, 0);
      }

      // SUD — mur entre bureaux et salle de pause ou extérieur
      const hasS = BUSINESS_LAYOUT.some(b => b.col === biz.col && b.row === biz.row + 1);
      if (hasS) {
        this.addWallWithDoor(cx, cz + half, OFFICE_SIZE, 0);
      } else {
        // Porte vers salle de pause pour rangée du bas (row=1)
        if (biz.row === 1) {
          this.addWallWithDoor(cx, cz + half, OFFICE_SIZE, 0);
        } else {
          // Porte vers salle de pause pour rangée du haut (row=0)
          this.addWallWithDoor(cx, cz + half, OFFICE_SIZE, 0);
        }
      }

      // OUEST
      const hasW = BUSINESS_LAYOUT.some(b => b.row === biz.row && b.col === biz.col - 1);
      if (hasW) {
        this.addWallWithDoor(cx - half, cz, OFFICE_SIZE, Math.PI / 2);
      } else {
        this.addSolidWall(cx - half, cz, OFFICE_SIZE, Math.PI / 2);
      }

      // EST
      const hasE = BUSINESS_LAYOUT.some(b => b.row === biz.row && b.col === biz.col + 1);
      if (hasE) {
        this.addWallWithDoor(cx + half, cz, OFFICE_SIZE, Math.PI / 2);
      } else {
        this.addSolidWall(cx + half, cz, OFFICE_SIZE, Math.PI / 2);
      }
    }
  }

  private buildPauseRoom(): void {
    const totalW = OFFICE_SIZE * 5;
    const cx = (OFFICE_SIZE * 2) - (OFFICE_SIZE * 2); // centré
    const cz = PAUSE_ROOM_Z;
    const half = PAUSE_ROOM_D / 2;
    const halfW = totalW / 2;

    // Mur nord salle de pause (déjà fait par les bureaux row=0 côté sud)
    // Mur sud salle de pause
    this.addSolidWall(cx, cz + half, totalW, 0);

    // Mur ouest
    this.addSolidWall(cx - halfW, cz, WALL_THICKNESS, PAUSE_ROOM_D, Math.PI / 2);

    // Mur est
    this.addSolidWall(cx + halfW, cz, WALL_THICKNESS, PAUSE_ROOM_D, Math.PI / 2);

    // Sol de la salle de pause (légèrement différent)
    const floorGeo = new THREE.PlaneGeometry(totalW, PAUSE_ROOM_D);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf5f5f5),
      roughness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0.01, cz);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Label salle de pause
    const label = this.createLabel('🛋️ Salle de Pause', 'QG Central', '#64748b');
    label.position.set(cx, 4, cz);
    this.scene.add(label);
    this.labels.push(label);
  }

  private createLabel(text: string, revenue: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    // Fond
    ctx.fillStyle = 'rgba(10,10,20,0.82)';
    ctx.roundRect(2, 2, 380, 92, 14);
    ctx.fill();

    // Bande couleur
    ctx.fillStyle = color;
    ctx.roundRect(2, 2, 380, 28, [14, 14, 0, 0]);
    ctx.fill();

    // Nom
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 192, 40);

    // Revenu — petite police
    ctx.fillStyle = color;
    ctx.font = '18px Arial';
    ctx.fillText('🎯 ' + revenue + '/mois', 192, 72);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(5.5, 1.4, 1);
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
      const themeColor = new THREE.Color(color);

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
              const isColored = name.startsWith('colored');
              mesh.material = new (THREE as any).MeshStandardNodeMaterial({
                color: isColored ? themeColor : oldMat.color,
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

      const label = this.createLabel(biz.label, biz.revenue, color);
      label.position.set(offsetX, 4.5, offsetZ);
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

  public updateThemeColor(color: string): void {
    const { selectedAgentSetId } = useTeamStore.getState();
    const idx = BUSINESS_LAYOUT.findIndex(b => b.id === selectedAgentSetId);
    if (idx < 0 || !this.offices[idx]) return;

    const themeColor = new THREE.Color(color);
    this.offices[idx].traverse((child: any) => {
      if (child.isMesh && child.name.toLowerCase().startsWith('colored')) {
        if ((child.material as any).color) {
          (child.material as any).color.copy(themeColor);
        }
      }
    });
  }

  public getOffice(): THREE.Group | null {
    return this.offices[0] || null;
  }
}
