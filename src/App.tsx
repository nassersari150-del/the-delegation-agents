import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCoreStore } from './integration/store/coreStore';
import { ActionLogPanel } from './interface/ActionLogPanel';
import { FinalOutputModal } from './interface/FinalOutputModal';
import Header from './interface/Header';
import InspectorPanel from './interface/InspectorPanel';
import { KanbanPanel } from './interface/KanbanPanel';
import { OutputReviewModal } from './interface/OutputReviewModal';
import SimulationView from './interface/SimulationView';
import { VisualConfigurator } from './interface/VisualConfigurator/VisualConfigurator';
import { SceneContext } from './simulation/SceneContext';
import { SceneManager } from './simulation/SceneManager';
import * as THREE from 'three/webgpu';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);
  const { isLogOpen, isKanbanOpen, setIsResizing, viewMode } = useCoreStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kanbanHeight, setKanbanHeight] = useState(220);

  const startResizing = useCallback(() => setIsResizing(true), [setIsResizing]);
  const stopResizing = useCallback(() => setIsResizing(false), [setIsResizing]);

  const resize = useCallback((e: MouseEvent) => {
    if (useCoreStore.getState().isResizing) {
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY;
      const minHeight = windowHeight * 0.2;
      const maxHeight = windowHeight * 0.5;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setKanbanHeight(newHeight);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    if (canvasRef.current && !managerRef.current) {
      const manager = new SceneManager(canvasRef.current);
      managerRef.current = manager;
      setSceneManager(manager);
    }
    return () => {
      if (managerRef.current) {
        managerRef.current.dispose();
        managerRef.current = null;
        setSceneManager(null);
      }
    };
  }, []);

  // Écouter l'événement de téléportation
  useEffect(() => {
    const handleTeleport = (e: Event) => {
      const { x, y, z } = (e as CustomEvent).detail;
      const manager = managerRef.current;
      if (!manager) return;

      // Téléporte le joueur via le CharacterController
      const controller = (manager as any).characterController;
      if (!controller) return;

      const playerIndex = 0; // Le joueur est toujours l'index 0
      const target = new THREE.Vector3(x, y, z);
      controller.characterManager.setPosition(playerIndex, target);
