import { USER_COLOR } from '../theme/brand';
import { DEFAULT_MODELS } from '../core/llm/constants';

export const USER_ID = 'user';
export const USER_NAME = 'Président';
export const MAX_AGENTS = 999; // Pas de limite
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
      description: CONSTITUTION + 'Tu es le Chef de Projet du business Vinted IA. Tu coordonnes l\'équipe, suis l\'avancement des niches, ventes et marges. Tu répartis les tâches et gères les priorités.',
      color: '#ec4899',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        {
          id: 'vinted-tech',
          index: 2,
          name: 'Pôle Tech',
          description: CONSTITUTION + 'Tu gères le scraper Vinted sur Render, les workflows n8n, et les corrections de bugs. Tu surveilles les logs et proposes des améliorations techniques.',
          color: '#3b82f6',
          model: DEFAULT_MODELS.text,
          position: { x: -400, y: 280 }
        },
        {
          id: 'vinted-securite',
          index: 3,
          name: 'Pôle Sécurité',
          description: CONSTITUTION + 'Tu surveilles les tentatives de ban Vinted, fais des audits réguliers, gères les accès et mots de passe, et alertes immédiatement si intrusion détectée.',
          color: '#ef4444',
          model: DEFAULT_MODELS.text,
          position: { x: -150, y: 280 }
        },
        {
          id: 'vinted-support',
          index: 4,
          name: 'Pôle Support',
          description: CONSTITUTION + 'Tu gères tous les messages acheteurs et vendeurs Vinted. Tu traites les incidents, ouvres des tickets si besoin, et escalades vers le Gros Chef si bloqué.',
          color: '#f97316',
          model: DEFAULT_MODELS.text,
          position: { x: 150, y: 280 }
        },
        {
          id: 'vinted-data',
          index: 5,
          name: 'Pôle Data',
          description: CONSTITUTION + 'Tu analyses les performances (ventes, marges, niches actives), protèges les données, fais des rapports hebdomadaires et cherches des améliorations sur le web.',
          color: '#22c55e',
          model: DEFAULT_MODELS.text,
          position: { x: 400, y: 280 }
        }
      ]
    }
  },
  {
    id: 'vente-site-web',
    teamName: 'Vente Site Web',
    teamType: 'Agence Web',
    teamDescription: 'Agence web automatisée. Prospection, vente et déploiement de sites. Cible 12k/mois.',
    color: '#f97316',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'web-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes l\'agence web automatisée. Tu gères la prospection via SerpApi, les emails Brevo, les conversations IA et le déploiement sur Vercel.',
      color: '#f97316',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        {
          id: 'web-tech',
          index: 2,
          name: 'Pôle Tech',
          description: CONSTITUTION + 'Tu gères le code des sites web, les déploiements Vercel, et la maintenance technique de l\'agence automatisée.',
          color: '#3b82f6',
          model: DEFAULT_MODELS.text,
          position: { x: -300, y: 280 }
        },
        {
          id: 'web-securite',
          index: 3,
          name: 'Pôle Sécurité',
          description: CONSTITUTION + 'Tu sécurises les accès clients, protèges les données et surveilles les systèmes de l\'agence.',
          color: '#ef4444',
          model: DEFAULT_MODELS.text,
          position: { x: 0, y: 280 }
        },
        {
          id: 'web-support',
          index: 4,
          name: 'Pôle Support',
          description: CONSTITUTION + 'Tu gères les conversations avec les prospects et clients, traites les demandes et résous les problèmes.',
          color: '#a855f7',
          model: DEFAULT_MODELS.text,
          position: { x: 300, y: 280 }
        }
      ]
    }
  },
  {
    id: 'pub-marques',
    teamName: 'Pub Marques',
    teamType: 'Publicité',
    teamDescription: 'Vendre des publicités à des marques via des contenus automatisés. Cible 10k/mois.',
    color: '#eab308',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'pub-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le business de publicité pour marques. Tu gères la prospection, la création de contenus sponsorisés et les relations avec les annonceurs.',
      color: '#eab308',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'pub-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères les outils de création de contenus publicitaires automatisés.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'pub-securite', index: 3, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les comptes et données des partenaires marques.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'pub-support', index: 4, name: 'Pôle Support', description: CONSTITUTION + 'Tu gères les relations avec les marques et traites leurs demandes.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
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
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes la création et vente de formations IA avec avatars. Tu gères le contenu pédagogique et la plateforme de vente.',
      color: '#22c55e',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'formation-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères la plateforme de formation et les avatars IA.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'formation-securite', index: 3, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les accès étudiants et protèges les contenus.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'formation-support', index: 4, name: 'Pôle Support', description: CONSTITUTION + 'Tu accompagnes les étudiants et gères leurs questions.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
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
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes la création de miniatures YouTube. Tu gères les commandes clients et la production automatisée.',
      color: '#3b82f6',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'miniature-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères les outils de génération d\'images et l\'automatisation.', color: '#06b6d4', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'miniature-design', index: 3, name: 'Pôle Design', description: CONSTITUTION + 'Tu crées et valides les miniatures selon les besoins des YouTubers.', color: '#a855f7', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'miniature-support', index: 4, name: 'Pôle Support', description: CONSTITUTION + 'Tu gères les commandes clients et leurs retours.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
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
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le service de montage vidéo IA. Tu gères les commandes et la production automatisée.',
      color: '#8b5cf6',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'montage-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères les outils de montage IA et l\'automatisation FFmpeg.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'montage-creation', index: 3, name: 'Pôle Création', description: CONSTITUTION + 'Tu supervises la qualité des montages produits.', color: '#ec4899', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'montage-support', index: 4, name: 'Pôle Support', description: CONSTITUTION + 'Tu gères les clients et leurs demandes de montage.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
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
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu coordonnes le bot de trading. Tu surveilles les performances et alertes le Président si pertes dépassent le seuil fixé.',
      color: '#06b6d4',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'trading-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu développes et maintiens le bot de trading automatisé.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'trading-securite', index: 3, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu sécurises les accès aux comptes de trading et protèges les fonds.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'trading-data', index: 4, name: 'Pôle Data', description: CONSTITUTION + 'Tu analyses les performances du bot et optimises les stratégies.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
      ]
    }
  },
  {
    id: 'agent-finance',
    teamName: 'Agent Finance',
    teamType: 'Finance Long Terme',
    teamDescription: 'Agent qui gère les actifs avec data et autres. Long terme. Cible 10k/mois.',
    color: '#f43f5e',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'finance-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères les actifs financiers à long terme du Président. Tu analyses les marchés, proposes des stratégies d\'investissement et surveilles le portefeuille.',
      color: '#f43f5e',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'finance-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu développes les outils d\'analyse financière automatisée.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -300, y: 280 } },
        { id: 'finance-data', index: 3, name: 'Pôle Data', description: CONSTITUTION + 'Tu analyses les données de marché et produis des rapports financiers.', color: '#22c55e', model: DEFAULT_MODELS.text, position: { x: 0, y: 280 } },
        { id: 'finance-securite', index: 4, name: 'Pôle Sécurité', description: CONSTITUTION + 'Tu protèges les actifs et sécurises les comptes financiers.', color: '#ef4444', model: DEFAULT_MODELS.text, position: { x: 300, y: 280 } }
      ]
    }
  },
  {
    id: 'json-business-1',
    teamName: 'JSON Business 1',
    teamType: 'Dynamique',
    teamDescription: 'Business dynamique à définir selon les opportunités du marché. Cible 800/mois.',
    color: '#84cc16',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'json1-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères ce business dynamique. Tu t\'adaptes aux opportunités du marché et proposes des stratégies au Président.',
      color: '#84cc16',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'json1-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères les aspects techniques de ce business dynamique.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -200, y: 280 } },
        { id: 'json1-support', index: 3, name: 'Pôle Support', description: CONSTITUTION + 'Tu gères les clients et partenaires de ce business.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 200, y: 280 } }
      ]
    }
  },
  {
    id: 'json-business-2',
    teamName: 'JSON Business 2',
    teamType: 'Dynamique',
    teamDescription: 'Business dynamique à définir selon les opportunités du marché. Cible 800/mois.',
    color: '#a78bfa',
    outputType: 'text',
    outputModel: DEFAULT_MODELS.text,
    outputAutoApprove: true,
    user: { index: 0, model: 'Président', position: { x: 0, y: 0 } },
    leadAgent: {
      id: 'json2-chef-projet',
      index: 1,
      name: 'Chef de Projet',
      description: CONSTITUTION + 'Tu gères ce business dynamique. Tu t\'adaptes aux opportunités du marché et proposes des stratégies au Président.',
      color: '#a78bfa',
      model: DEFAULT_MODELS.text,
      humanInTheLoop: true,
      position: { x: 0, y: 130 },
      subagents: [
        { id: 'json2-tech', index: 2, name: 'Pôle Tech', description: CONSTITUTION + 'Tu gères les aspects techniques de ce business dynamique.', color: '#3b82f6', model: DEFAULT_MODELS.text, position: { x: -200, y: 280 } },
        { id: 'json2-support', index: 3, name: 'Pôle Support', description: CONSTITUTION + 'Tu gères les clients et partenaires de ce business.', color: '#f97316', model: DEFAULT_MODELS.text, position: { x: 200, y: 280 } }
      ]
    }
  }
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
    if (node.subagents) {
      node.subagents.forEach(traverse);
    }
  };
  traverse(system.leadAgent);
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
