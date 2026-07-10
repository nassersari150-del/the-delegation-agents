import { USER_COLOR } from '../theme/brand';
import { DEFAULT_MODELS } from '../core/llm/constants';

export const USER_ID = 'user';
export const USER_NAME = 'Président';
export const MAX_AGENTS = 999;
export { USER_COLOR };
export const DEFAULT_AGENTIC_SET_ID = 'vinted-ia';

export interface AgentNode {
  id: string;
  index: number;
  name: string;
  description: string;
  color: string;
  model: string;
  humanInTheLoop?: boolean;
  position?: { x: number; y: number };
  subagents?: AgentNode[];
}

export type OutputType = 'text' | 'image' | 'music' | 'video';

export interface AgenticSystem {
  id: string;
  teamName: string;
  teamType: string;
  teamDescription: string;
  color: string;
  outputType: OutputType;
  outputModel: string;
  outputAutoApprove?: boolean;
  user: {
    index: number;
    model: string;
    position?: { x: number; y: number };
  };
  leadAgent: AgentNode;
}

const CONSTITUTION = `
Tu fais partie de la République IA V2.0.
LOIS FONDAMENTALES :
- Loi 1 : Toute dépense nécessite l'approbation du Président.
- Loi 2 : Tout problème critique est signalé au Président immédiatement.
- Loi 3 : Aucun accès aux données sensibles sans autorisation du Président.
- Loi 4 : Rapport hebdomadaire remis au Président par Jarvis.
- Loi 7 : Les agents n'effectuent AUCUNE dépense.
PROCÉDURE D'URGENCE :
- Niveau 1 : Employé tente de résoudre seul.
- Niveau 2 : Jarvis + Gros Chef des Problèmes.
- Niveau 3 : Président — décision finale.
PHASES DE RÉFLEXION OBLIGATOIRES avant chaque réponse :
1. Priorité/tâche
2. Faisabilité technique
3. Risque sécurité
4. Impact client
5. Data apprise
`;

// Index globaux uniques :
// 0 = Président (joueur)
// 1-5   = Vinted IA
// 6-10  = Vente Site Web
// 11-15 = Pub Marques
// 16-20 = Formations IA
// 21-25 = Miniatures Vidéo
// 26-30 = Montage IA
// 31-35 = Bot Trading
// 36-40 = Agent Finance
// 41-45 = JSON Business 1
// 46-50 = JSON Business 2

export const AGENTIC_SETS: AgenticSystem[] = [
  {
    id: 'vinted-ia',
    teamName: 'Vinted IA',
    teamType: 'Dropshipping',
    teamDescription: 'Business de dropshipping Vinted vers Vinted. Marge minimum x3. Cible 20k/mois.',
    color: '#ec4899',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'vinted-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu es le Chef de Projet du business Vinted IA.',
      color: '#ec4899',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'vinted-tech',      index: 2, name: 'Pôle Tech',      description: CONSTITUTION + 'Tu gères le scraper Vinted sur Render et les workflows n8n.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -400, y: 280 } },
        { id: 'vinted-securite',  index: 3, name: 'Pôle Sécurité',  description: CONSTITUTION + 'Tu surveilles les tentatives de ban Vinted.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: -150, y: 280 } },
        { id: 'vinted-support',   index: 4, name: 'Pôle Support',   description: CONSTITUTION + 'Tu gères tous les messages acheteurs et vendeurs Vinted.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 150, y: 280 } },
        { id: 'vinted-data',      index: 5, name: 'Pôle Data',      description: CONSTITUTION + 'Tu analyses les performances ventes, marges, niches.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 400, y: 280 } },
      ]
    }
  },
  {
    id: 'vente-site-web',
    teamName: 'Vente Site Web',
    teamType: 'Agence Web',
    teamDescription: 'Agence web automatisée. Cible 12k/mois.',
    color: '#f97316',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'web-chef-projet',
      index: 6,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes l\'agence web automatisée.',
      color: '#f97316',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'web-tech',      index: 7,  name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères le code des sites web et déploiements Vercel.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'web-securite',  index: 8,  name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les accès clients.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'web-support',   index: 9,  name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les conversations avec les prospects.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'web-data',      index: 10, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances de l\'agence.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'pub-marques',
    teamName: 'Pub Marques',
    teamType: 'Publicité',
    teamDescription: 'Vendre des publicités à des marques. Cible 10k/mois.',
    color: '#eab308',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'pub-chef-projet',
      index: 11,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le business de publicité pour marques.',
      color: '#eab308',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'pub-tech',     index: 12, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères les outils de création de contenus publicitaires.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'pub-securite', index: 13, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les comptes partenaires marques.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'pub-support',  index: 14, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les relations avec les marques.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'pub-data',     index: 15, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances publicitaires.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'formations-ia',
    teamName: 'Formations IA',
    teamType: 'Formation',
    teamDescription: 'Vendre des formations à l\'aide d\'avatars IA. Cible 10k/mois.',
    color: '#22c55e',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'formation-chef-projet',
      index: 16,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes la création et vente de formations IA.',
      color: '#22c55e',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'formation-tech',     index: 17, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères la plateforme de formation et les avatars IA.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'formation-securite', index: 18, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les accès étudiants.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'formation-support',  index: 19, name: 'Pôle Support',  description: CONSTITUTION + 'Tu accompagnes les étudiants.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'formation-data',     index: 20, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances des formations.', color: '#84cc16', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'miniatures-video',
    teamName: 'Miniatures Vidéo',
    teamType: 'Design',
    teamDescription: 'Vendre des miniatures vidéo pour YouTubers. Cible 10k/mois.',
    color: '#3b82f6',
    outputType: 'image',
    outputModel: DEFAULT_MODELS.image,
    outputAutoApprove: false,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'miniature-chef-projet',
      index: 21,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes la création de miniatures YouTube.',
      color: '#3b82f6',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'miniature-tech',     index: 22, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères les outils de génération d\'images.', color: '#06b6d4', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'miniature-design',   index: 23, name: 'Pôle Design',   description: CONSTITUTION + 'Tu crées et valides les miniatures.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'miniature-support',  index: 24, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les commandes clients.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'miniature-data',     index: 25, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances des ventes de miniatures.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'montage-ia',
    teamName: 'Montage IA',
    teamType: 'Vidéo',
    teamDescription: 'Montage vidéo avec monteur IA intelligent. Cible 10k/mois.',
    color: '#8b5cf6',
    outputType: 'video',
    outputModel: DEFAULT_MODELS.video,
    outputAutoApprove: false,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'montage-chef-projet',
      index: 26,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le service de montage vidéo IA.',
      color: '#8b5cf6',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'montage-tech',     index: 27, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères les outils de montage IA et FFmpeg.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'montage-creation', index: 28, name: 'Pôle Création', description: CONSTITUTION + 'Tu supervises la qualité des montages.', color: '#ec4899', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'montage-support',  index: 29, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les clients et demandes de montage.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'montage-data',     index: 30, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances du service montage.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'bot-trading',
    teamName: 'Bot Trading',
    teamType: 'Finance',
    teamDescription: 'Bot de trading automatisé. Cible 10k/mois.',
    color: '#06b6d4',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'trading-chef-projet',
      index: 31,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le bot de trading.',
      color: '#06b6d4',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'trading-tech',     index: 32, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu développes et maintiens le bot de trading.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'trading-securite', index: 33, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les accès aux comptes de trading.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'trading-support',  index: 34, name: 'Pôle Support',  description: CONSTITUTION + 'Tu surveilles les performances du bot.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'trading-data',     index: 35, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les données de marché.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'agent-finance',
    teamName: 'Agent Finance',
    teamType: 'Finance Long Terme',
    teamDescription: 'Agent qui gère les actifs. Long terme. Cible 10k/mois.',
    color: '#f43f5e',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'finance-chef-projet',
      index: 36,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères les actifs financiers à long terme.',
      color: '#f43f5e',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'finance-tech',     index: 37, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu développes les outils d\'analyse financière.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'finance-data',     index: 38, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les données de marché et produis des rapports.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'finance-securite', index: 39, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu protèges les actifs et comptes financiers.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'finance-support',  index: 40, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les relations avec les partenaires financiers.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'json-business-1',
    teamName: 'JSON Business 1',
    teamType: 'Dynamique',
    teamDescription: 'Business dynamique. Cible 800/mois.',
    color: '#84cc16',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'json1-chef-projet',
      index: 41,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères ce business dynamique.',
      color: '#84cc16',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'json1-tech',     index: 42, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères les aspects techniques.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'json1-securite', index: 43, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les systèmes.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'json1-support',  index: 44, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les clients.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'json1-data',     index: 45, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
  {
    id: 'json-business-2',
    teamName: 'JSON Business 2',
    teamType: 'Dynamique',
    teamDescription: 'Business dynamique. Cible 800/mois.',
    color: '#a78bfa',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'json2-chef-projet',
      index: 46,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères ce business dynamique.',
      color: '#a78bfa',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'json2-tech',     index: 47, name: 'Pôle Tech',     description: CONSTITUTION + 'Tu gères les aspects techniques.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'json2-securite', index: 48, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les systèmes.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'json2-support',  index: 49, name: 'Pôle Support',  description: CONSTITUTION + 'Tu gères les clients.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } },
        { id: 'json2-data',     index: 50, name: 'Pôle Data',     description: CONSTITUTION + 'Tu analyses les performances.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 600, y: 280 } },
      ]
    }
  },
];

export function getAgentSet(id: string, customSystems: AgenticSystem[] = []): AgenticSystem {
  return (
    customSystems.find((s) => s.id === id) ||
    AGENTIC_SETS.find((s) => s.id === id) ||
    AGENTIC_SETS[0]
  );
}

export function getAllAgents(system: AgenticSystem): AgentNode[] {
  const agents: AgentNode[] = [];
  const traverse = (node: AgentNode) => {
    agents.push(node);
    if (node.subagents) node.subagents.forEach(traverse);
  };
  traverse(system.leadAgent);
  return agents;
}

export function getAllAgentsFromAllSystems(): AgentNode[] {
  const agents: AgentNode[] = [];
  AGENTIC_SETS.forEach(system => {
    const traverse = (node: AgentNode) => {
      agents.push(node);
      if (node.subagents) node.subagents.forEach(traverse);
    };
    traverse(system.leadAgent);
  });
  return agents;
}

export function getAllCharacters(system: AgenticSystem): AgentNode[] {
  const userNode: AgentNode = {
    id: USER_ID,
    index: system.user.index,
    name: USER_NAME,
    color: USER_COLOR,
    model: system.user.model,
    description: 'Président Fondateur de la République IA.',
  };
  return [userNode, ...getAllAgents(system)];
}
