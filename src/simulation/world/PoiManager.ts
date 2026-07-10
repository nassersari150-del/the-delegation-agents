import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three/webgpu';
import { getAgentSet, AGENTIC_SETS } from '../../data/agents';
import { useTeamStore } from '../../integration/store/teamStore';
import { DRACO_LIB_PATH } from '../constants';
import { NavMeshManager } from '../pathfinding/NavMeshManager';
import { PoiManager } from './PoiManager';

const BUSINESS_LAYOUT = [
  { id: 'vinted-ia',       row: 0, col: 0 },
  { id: 'vente-site-web',  row: 0, col: 1 },
  { id: 'pub-marques',     row: 0, col: 2 },
  { id: 'formations-ia',   row: 0, col: 3 },
  { id: 'miniatures-video',row: 0, col: 4 },
  { id: 'montage-ia',      row: 1, col: 0 },
  { id: 'bot-trading',     row: 1, col: 1 },
  { id: 'agent-finance',   row: 1, col: 2 },
  { id: 'json-business-1', row: 1, col: 3 },
  { id: 'json-business-2', row: 1, col: 4 },
];

const OFFICE_SPACING_X = 28;
const OFFICE_SPACING_Z = 28;

export class WorldManager {
  private offices: THREE.Group[] = [];

  constructor(
    private scene: THREE.Scene,
    private navMesh: NavMeshManager,
    private poiManager: PoiManager
  ) {}

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

      const officeClone = THREE.SkeletonUtils
        ? (THREE.SkeletonUtils as any).clone(officeGltf.scene)
        : officeGltf.scene.clone(true);

      const offsetX = biz.col * OFFICE_SPACING_X - (OFFICE_SPACING_X * 2);
      const offsetZ = biz.row * OFFICE_SPACING_Z;

      officeClone.position.set(offsetX, 0, offsetZ);

      officeClone.traverse((child: any) => {
        if (child.isMesh) {
          const mesh = child as THREE.Mesh;
          const name = mesh.name.toLowerCase();

          if (name.includes('navmesh')) {
            this.navMesh.loadFromGeometry(mesh.geometry, officeClone.position);
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

      // Ajouter les POIs de ce bureau avec offset
      this.poiManager.loadFromGlbWithOffset(officeClone, offsetX, offsetZ, biz.id);
    }
  }

  public updateThemeColor(color: string): void {
    // Met à jour seulement le bureau actif
    const { selectedAgentSetId, customSystems } = useTeamStore.getState();
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
