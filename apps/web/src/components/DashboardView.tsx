// DashboardView — StoryForge freelancer dashboard.
//
// Displays stats, clients, packs, and deployment history.
// Fetches data from the StoryForge API backend.

import { useEffect, useState, useCallback } from 'react';
import { navigate } from '../router';
import styles from './DashboardView.module.css';

interface Stats {
  clients: number;
  projects: number;
  deploys: number;
  cost: number;
}

interface Pack {
  id: string;
  name: string;
  description: string;
  niche: string;
  price: string;
  price_brl: number;
  skills_count: number;
  features_count: number;
  features: Array<{ name: string; description: string }>;
}

interface Deployment {
  deployment_id: string;
  client_id: string;
  skill_name: string;
  provider: string;
  url: string;
  status: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  plan: string;
}

type Tab = 'overview' | 'clients' | 'packs' | 'deploys';

export function DashboardView() {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats>({ clients: 0, projects: 0, deploys: 0, cost: 0 });
  const [packs, setPacks] = useState<Pack[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [packsRes, deploysRes, clientsRes] = await Promise.all([
        fetch('/api/packs').then(r => r.json()).catch(() => null),
        fetch('/api/deploy/history?limit=20').then(r => r.json()).catch(() => null),
        fetch('/api/clients').then(r => r.json()).catch(() => null),
      ]);

      if (packsRes?.packs) setPacks(packsRes.packs);
      if (deploysRes?.deployments) setDeployments(deploysRes.deployments);
      if (clientsRes) setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.clients || []);

      setStats({
        clients: clientsRes?.length || clientsRes?.clients?.length || 0,
        projects: deploysRes?.count || 0,
        deploys: deploysRes?.count || 0,
        cost: 0,
      });
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activatePack = async (packId: string) => {
    setActivating(packId);
    try {
      const res = await fetch(`/api/packs/${packId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack_id: packId,
          client_id: `client_${Date.now()}`,
          client_name: 'Novo Cliente',
          inputs: {},
          deploy: true,
          white_label: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.open(data.url, '_blank');
      }
      fetchData();
    } catch (e) {
      console.error('Pack activation error:', e);
    } finally {
      setActivating(null);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Gerencie seus clientes e projetos</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Clientes</div>
          <div className={styles.statValue}>{stats.clients}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Projetos</div>
          <div className={styles.statValue}>{stats.projects}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Deploys</div>
          <div className={styles.statValue}>{stats.deploys}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Custo Total</div>
          <div className={styles.statValue}>${stats.cost.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['overview', 'clients', 'packs', 'deploys'] as Tab[]).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' ? 'Visão Geral' : t === 'clients' ? 'Clientes' : t === 'packs' ? 'Packs' : 'Deploys'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {tab === 'overview' && (
          <div className={styles.overview}>
            <h2>Projetos Recentes</h2>
            {deployments.length === 0 ? (
              <p className={styles.empty}>Nenhum projeto ainda</p>
            ) : (
              <div className={styles.cardsGrid}>
                {deployments.slice(0, 6).map(d => (
                  <div key={d.deployment_id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{d.skill_name}</span>
                      <span className={`${styles.badge} ${styles[`badge${d.status}`] || ''}`}>
                        {d.status}
                      </span>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener" className={styles.cardUrl}>
                      {d.url}
                    </a>
                    <div className={styles.cardMeta}>
                      <span>{d.provider}</span>
                      <span>{d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'clients' && (
          <div>
            <h2>Clientes</h2>
            {clients.length === 0 ? (
              <p className={styles.empty}>Nenhum cliente cadastrado</p>
            ) : (
              <div className={styles.cardsGrid}>
                {clients.map(c => (
                  <div key={c.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{c.name}</span>
                      <span className={`${styles.badge} ${styles.badgeLive}`}>{c.plan}</span>
                    </div>
                    <p className={styles.cardDesc}>{c.company}</p>
                    <div className={styles.cardMeta}>
                      <span>{c.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'packs' && (
          <div>
            <h2>Packs de Nicho</h2>
            <div className={styles.packsGrid}>
              {packs.map(pack => (
                <div key={pack.id} className={styles.packCard}>
                  <div className={styles.packNiche}>{pack.niche}</div>
                  <h3 className={styles.packName}>{pack.name}</h3>
                  <p className={styles.packDesc}>{pack.description}</p>
                  <div className={styles.packPrice}>{pack.price}</div>
                  <div className={styles.packFeatures}>
                    {pack.features?.slice(0, 4).map((f, i) => (
                      <div key={i} className={styles.packFeature}>{f.name}</div>
                    ))}
                  </div>
                  <button
                    className={styles.activateBtn}
                    onClick={() => activatePack(pack.id)}
                    disabled={activating === pack.id}
                  >
                    {activating === pack.id ? 'Ativando...' : 'Ativar Pack'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'deploys' && (
          <div>
            <h2>Histórico de Deploys</h2>
            {deployments.length === 0 ? (
              <p className={styles.empty}>Nenhum deploy realizado</p>
            ) : (
              <div className={styles.cardsGrid}>
                {deployments.map(d => (
                  <div key={d.deployment_id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardTitle}>{d.skill_name}</span>
                      <span className={`${styles.badge} ${styles[`badge${d.status}`] || ''}`}>
                        {d.status}
                      </span>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener" className={styles.cardUrl}>
                      {d.url}
                    </a>
                    <div className={styles.cardMeta}>
                      <span>{d.provider}</span>
                      <span>{d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
